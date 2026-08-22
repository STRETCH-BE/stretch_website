// POST /api/portal/signup — open self-registration, B2B-oriented.
// Two self-service audiences:
//   • Client  → account_type 'b2c': the B2B qualification set (company, VAT,
//     contact, phone, country, business type). This IS the installer/b2b
//     path — the account stays PENDING until an admin reviews it and assigns
//     markets (decision locked 22 Aug 2026; one line below flips it back to
//     instant access).
//   • Architect → account_type 'architect': office name + city instead of
//     the VAT set. Company-domain architects keep instant access after email
//     confirmation; freemail architects go to pending review.
// Anti-spam chain (22 Aug 2026): host guard → rate limits (incl. a global
// circuit breaker) → canonical email → disposable → duplicate → form token +
// spam score → signUp with captchaToken (Supabase verifies Turnstile itself
// once CAPTCHA protection is enabled — we never call siteverify here, the
// token is single-use). Only available in Supabase mode.
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost, portalOrigin } from '@/lib/portal/host';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { canonicalEmail, emailDomain, isDisposable, isFreemail } from '@/lib/spam/email';
import { isBlockedSender } from '@/lib/spam/blocklist';
import { scoreSubmission, FLAG_THRESHOLD, HARD_THRESHOLD } from '@/lib/spam/score';
import { checkFormToken } from '@/lib/form-token';
import { isTurnstileEnabled, verifyTurnstile } from '@/lib/turnstile';
import { sendTransactionalEmail, isTransactionalConfigured } from '@/lib/transactional';
import { buildAdminReviewEmail, buildConfirmEmail } from '@/lib/portal/emails';
import { mintReviewToken, isReviewTokenEnabled } from '@/lib/portal/review-token';
import { contact } from '@/lib/site-config';
import { locales } from '@/i18n/config';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Loose formats — real verification happens when our team reviews the account.
const VAT_RE = /^[A-Za-z0-9 .\-]{6,20}$/;
const PHONE_RE = /^[0-9+()/. \-]{6,25}$/;
const COUNTRY_RE = /^([A-Z]{2}|OTHER)$/;
const BUSINESS_TYPES = new Set(['installer', 'distributor', 'architect', 'contractor', 'other']);

function text(v: unknown, max: number): string {
  return String(v ?? '').trim().slice(0, max);
}

/** Global circuit breaker: >30 signups/hour site-wide means an attack.
 *  Notify the admin at most once per hour (via the rate limiter itself). */
async function tripCircuitBreaker(): Promise<void> {
  if (!(await rateLimit('signup:breaker-mail', 1, 60 * 60))) return; // already notified
  const to = process.env.PORTAL_ADMIN_EMAIL || contact.leadDestination;
  if (!isTransactionalConfigured()) {
    console.warn('[signup] circuit breaker tripped (30 signups/hour) — no mail provider configured');
    return;
  }
  await sendTransactionalEmail({
    to,
    subject: 'STRETCH portal — signup circuit breaker tripped',
    html: '<p>More than 30 portal signups in the last hour. New signups are being answered with 503 until the rate drops. Check the Supabase auth users and the Vercel firewall.</p>',
    text: 'More than 30 portal signups in the last hour. New signups are being answered with 503 until the rate drops. Check the Supabase auth users and the Vercel firewall.',
  }).catch(() => undefined);
}

export async function POST(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }

  // --- Rate limits (fail-open in the helper) -------------------------------
  const ip = getClientIp(req);
  // 6 POSTs/hour = 3 real attempts (the client silently retries once with a
  // fresh token on a captcha failure, so every attempt can cost 2 POSTs).
  if (
    !(await rateLimit(`signup:ip10m:${ip}`, 6, 60 * 60)) ||
    !(await rateLimit(`signup:ipday:${ip}`, 12, 24 * 60 * 60))
  ) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }
  if (!(await rateLimit('signup:global', 30, 60 * 60))) {
    await tripCircuitBreaker();
    return NextResponse.json({ ok: false, error: 'busy' }, { status: 503 });
  }

  let email = '';
  let password = '';
  let company = '';
  let contactName = '';
  let vat = '';
  let phone = '';
  let country = '';
  let businessType = '';
  let accountType = 'b2c';
  let office = '';
  let city = '';
  let captchaToken = '';
  let formToken: unknown;
  let signupLocale = 'en';
  try {
    const body = await req.json();
    email = text(body.email, 200).toLowerCase();
    password = String(body.password ?? '');
    company = text(body.company, 120);
    contactName = text(body.contactName, 120);
    vat = text(body.vat, 32);
    phone = text(body.phone, 32);
    country = text(body.country, 8).toUpperCase();
    businessType = text(body.businessType, 20).toLowerCase();
    // Self-service tiers only: 'architect' or 'b2c' — b2b tiers are always
    // granted by an admin, never self-selected.
    accountType = text(body.accountType, 20).toLowerCase() === 'architect' ? 'architect' : 'b2c';
    office = text(body.office, 120);
    city = text(body.city, 80);
    captchaToken = text(body.captchaToken, 4096);
    formToken = body.formToken;
    const loc = text(body.locale, 8);
    if ((locales as readonly string[]).includes(loc)) signupLocale = loc;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const isArchitect = accountType === 'architect';
  if (isArchitect && !office) office = company;
  const baseValid =
    EMAIL_RE.test(email) && password.length >= 8 && company && contactName && PHONE_RE.test(phone);
  // Architects: office + city instead of the B2B qualification set.
  const audienceValid = isArchitect
    ? Boolean(office && city)
    : VAT_RE.test(vat) && COUNTRY_RE.test(country) && BUSINESS_TYPES.has(businessType);
  if (!baseValid || !audienceValid) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  // WE verify the Turnstile token here — same proven siteverify path as the
  // lead routes. (GoTrue's own captcha verification of server-forwarded
  // tokens failed consistently with timeout-or-duplicate, Aug 2026 — the
  // Supabase CAPTCHA toggle therefore stays OFF and this is the gate.)
  let turnstileUnavailable = false;
  if (isTurnstileEnabled()) {
    if (!captchaToken) {
      console.warn('[signup] captcha rejected: no token from the client widget');
      return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
    }
    const verdict = await verifyTurnstile({
      token: captchaToken,
      host: req.headers.get('host') ?? '',
      ip,
    });
    if (verdict === 'fail') {
      console.warn('[signup] captcha rejected by siteverify');
      return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
    }
    // 'unavailable' fails OPEN (scored below) — an outage at Cloudflare must
    // never close signups; the pending gate still stands behind it.
    turnstileUnavailable = verdict === 'unavailable';
  }

  // --- Canonical email: disposable → reject; duplicate → 409 ---------------
  const canonical = canonicalEmail(email);
  const domain = emailDomain(email);
  if (isDisposable(domain)) {
    return NextResponse.json({ ok: false, error: 'disposable' }, { status: 400 });
  }
  // Admin blocklist (blocked_senders) — same message as a hard spam reject.
  if (await isBlockedSender(email)) {
    return NextResponse.json({ ok: false, error: 'rejected' }, { status: 400 });
  }
  // Per-email daily cap on signup attempts.
  if (!(await rateLimit(`signup:email:${canonical}`, 5, 24 * 60 * 60))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }
  const service = createServiceClient();
  if (service) {
    const { data: existing } = await service
      .from('portal_users')
      .select('id')
      .eq('canonical_email', canonical)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
    }
  }

  // --- Form token + spam score ---------------------------------------------
  const tokenState = checkFormToken(formToken);
  if (tokenState === 'stale') {
    return NextResponse.json({ ok: false, error: 'stale_token' }, { status: 400 });
  }
  const { score, reasons } = scoreSubmission({
    fields: { email, name: contactName, company, city, office, phone },
    meta: {
      formToken: tokenState === 'missing' ? 'missing' : tokenState === 'fast' ? 'fast' : 'ok',
      turnstileUnavailable,
    },
  });
  if (score >= HARD_THRESHOLD) {
    return NextResponse.json({ ok: false, error: 'rejected' }, { status: 400 });
  }
  const spamPending = score >= FLAG_THRESHOLD;

  // --- Account state rules (decisions locked 22 Aug 2026) ------------------
  // Client path = the installer/b2b qualification set → ALWAYS pending until
  // an admin assigns markets. [flip: delete the '!isArchitect' branch below
  // to give installers instant access again]
  let pendingReason: string | null = null;
  if (spamPending) pendingReason = 'spam_review';
  else if (isArchitect && isFreemail(domain)) pendingReason = 'freemail';
  else if (!isArchitect) pendingReason = 'installer_review';
  const active = pendingReason === null;

  // The company details also go into the auth user's metadata, so the login
  // route's self-heal can rebuild a full profile if the insert below fails.
  const details = {
    company,
    contact_name: contactName,
    vat: vat || null,
    phone,
    country: country || null,
    business_type: isArchitect ? 'architect' : businessType,
    account_type: accountType,
    office: isArchitect ? office : null,
    city: city || null,
  };

  const redirectTo = `${portalOrigin(req.nextUrl.origin)}/portal/login`;
  const EXISTS_RE = /already|registered|exists/i;
  let user: { id: string } | null = null;

  if (service && isTransactionalConfigured()) {
    // FAST PATH — create the user + confirmation link via the ADMIN API and
    // send the confirmation mail OURSELVES (the same provider chain that
    // delivers datasheet mails). Supabase's own SMTP send made /auth/v1/signup
    // exceed the gateway timeout (504s observed 22 Aug 2026 with the
    // Microsoft 365 SMTP configured); generateLink is a fast DB operation
    // and sends nothing.
    let { data: linkData, error: linkError } = await service.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { data: details, redirectTo },
    });
    if (linkError && EXISTS_RE.test(linkError.message)) {
      // Orphan from an earlier timed-out attempt: an UNCONFIRMED auth user
      // with no portal profile is safe to replace — heal and retry once.
      const orphan = await findAuthUserByEmail(service, email);
      const orphanProfile = orphan
        ? (await service.from('portal_users').select('id').eq('id', orphan.id).maybeSingle()).data
        : null;
      if (orphan && !orphan.email_confirmed_at && !orphanProfile) {
        await service.auth.admin.deleteUser(orphan.id).catch(() => undefined);
        ({ data: linkData, error: linkError } = await service.auth.admin.generateLink({
          type: 'signup',
          email,
          password,
          options: { data: details, redirectTo },
        }));
      }
    }
    if (linkError || !linkData?.user) {
      if (linkError && EXISTS_RE.test(linkError.message)) {
        return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
      }
      console.warn(`[signup] generateLink failed: ${linkError?.message ?? 'no user returned'}`);
      return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
    }
    user = linkData.user;
    const confirmUrl = linkData.properties?.action_link;
    if (confirmUrl) {
      const mail = buildConfirmEmail({ name: contactName, confirmUrl });
      const sent = await sendTransactionalEmail({
        to: email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
      if (!sent.ok) {
        console.warn('[signup] confirmation mail could not be sent — resend via the admin panel');
      }
    }
  } else {
    // LEGACY PATH (no own mail provider): plain signUp, Supabase sends the
    // confirmation mail through its configured SMTP.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: 'implicit' } },
    );
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: details, emailRedirectTo: redirectTo },
    });
    if (error) {
      const exists = EXISTS_RE.test(error.message);
      const captcha = /captcha/i.test(error.message);
      if (captcha) console.warn(`[signup] captcha rejected by Supabase: ${error.message}`);
      else if (!exists) console.warn(`[signup] signUp failed: ${error.message}`);
      return NextResponse.json(
        { ok: false, error: exists ? 'exists' : captcha ? 'captcha' : 'failed' },
        { status: exists ? 409 : captcha ? 400 : 500 },
      );
    }
    // Supabase quirk: signUp for an existing confirmed email returns a user
    // with an empty identities array instead of an error.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
    }
    user = data.user;
  }

  // Create the portal profile right away (service role — RLS has no insert
  // policies by design). If this fails, the login route self-heals it later.
  if (user && service) {
    const base = {
      id: user.id,
      email,
      role: 'client',
      account_type: accountType,
      markets: [],
      all_markets: false,
      active,
    };
    const spamMeta = {
      canonical_email: canonical,
      pending_reason: pendingReason,
      signup_ip: ip === 'unknown' ? null : ip,
      signup_host: req.headers.get('host'),
      signup_ua: (req.headers.get('user-agent') ?? '').slice(0, 400) || null,
      signup_locale: signupLocale,
    };
    const { error: profileError } = await service
      .from('portal_users')
      .upsert({ ...base, ...details, ...spamMeta, account_type: accountType }, { onConflict: 'id' });
    if (profileError) {
      // Un-migrated database (newer columns missing) — store the core
      // profile; the details survive in the auth metadata for later.
      await service.from('portal_users').upsert({ ...base, company }, { onConflict: 'id' });
    }
    if (spamPending) {
      console.warn(`[signup] pending spam_review (score ${score}): ${reasons.join(', ')}`);
    }

    // Notify the admin about EVERY self-signup — pending ones carry the
    // signed review link, auto-approved ones are an FYI. AWAITED: a serverless
    // function freezes right after the response, killing unawaited sends.
    if (isTransactionalConfigured()) {
      const origin = portalOrigin(req.nextUrl.origin);
      const reviewUrl =
        pendingReason && isReviewTokenEnabled()
          ? `${origin}/portal/review?t=${encodeURIComponent(mintReviewToken(user.id))}`
          : `${origin}/portal/admin`;
      const mail = buildAdminReviewEmail({
        accountType,
        contactName,
        company: company || null,
        office: isArchitect ? office || null : null,
        city: city || null,
        country: country || null,
        email,
        canonicalEmail: canonical,
        phone: phone || null,
        pendingReason,
        spamScore: score,
        spamReasons: reasons,
        signupHost: req.headers.get('host'),
        signupLocale: signupLocale,
        signupIp: ip === 'unknown' ? null : ip,
        signupUserAgent: req.headers.get('user-agent'),
        reviewUrl,
      });
      const to = process.env.PORTAL_ADMIN_EMAIL || contact.leadDestination;
      const sent = await sendTransactionalEmail({
        to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      }).catch(() => ({ ok: false as const }));
      if (!sent.ok) console.warn('[signup] admin notification mail failed to send');
    }
  }

  // confirm=true → a confirmation email is on its way; no session yet.
  // pending=true → the success screen explains the review step.
  return NextResponse.json({ ok: true, confirm: true, pending: !active });
}

/** Look an auth user up by email via the admin list API (no direct filter
 *  exists in supabase-js v2 — pages of 1000 cover this portal many times). */
async function findAuthUserByEmail(
  service: NonNullable<ReturnType<typeof createServiceClient>>,
  email: string,
): Promise<{ id: string; email_confirmed_at: string | null } | null> {
  const needle = email.toLowerCase();
  try {
    for (let pageNo = 1; pageNo <= 5; pageNo++) {
      const { data, error } = await service.auth.admin.listUsers({ page: pageNo, perPage: 1000 });
      if (error || !data?.users?.length) return null;
      const hit = data.users.find((u) => (u.email ?? '').toLowerCase() === needle);
      if (hit) return { id: hit.id, email_confirmed_at: hit.email_confirmed_at ?? null };
      if (data.users.length < 1000) return null;
    }
  } catch {
    /* fall through */
  }
  return null;
}
