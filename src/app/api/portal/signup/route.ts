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
import { createRouteClient, createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost, portalOrigin } from '@/lib/portal/host';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { canonicalEmail, emailDomain, isDisposable, isFreemail } from '@/lib/spam/email';
import { isBlockedSender } from '@/lib/spam/blocklist';
import { scoreSubmission, FLAG_THRESHOLD, HARD_THRESHOLD } from '@/lib/spam/score';
import { checkFormToken } from '@/lib/form-token';
import { isTurnstileEnabled } from '@/lib/turnstile';
import { sendTransactionalEmail, isTransactionalConfigured } from '@/lib/transactional';
import { buildAdminReviewEmail } from '@/lib/portal/emails';
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

  // When Turnstile is on, a missing token must fail LOUDLY here — once the
  // Supabase CAPTCHA toggle is enabled, signUp would reject it anyway with a
  // less useful error.
  if (isTurnstileEnabled() && !captchaToken) {
    console.warn('[signup] captcha rejected: no token from the client widget');
    return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
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

  const supabase = createRouteClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: details,
      // Turnstile: Supabase verifies this itself once CAPTCHA protection is
      // enabled in the dashboard (tokens are single-use — never siteverify'd
      // here as well).
      ...(captchaToken ? { captchaToken } : {}),
      // After the confirmation link, land the user on the portal login on
      // the canonical portal host.
      emailRedirectTo: `${portalOrigin(req.nextUrl.origin)}/portal/login`,
    },
  });

  if (error) {
    const exists = /already|registered|exists/i.test(error.message);
    const captcha = /captcha/i.test(error.message);
    if (captcha) console.warn(`[signup] captcha rejected by Supabase: ${error.message}`);
    else if (!exists) console.warn(`[signup] signUp failed: ${error.message}`);
    return NextResponse.json(
      { ok: false, error: exists ? 'exists' : captcha ? 'captcha' : 'failed' },
      { status: exists ? 409 : captcha ? 400 : 500 },
    );
  }
  // Supabase quirk: signUp for an existing confirmed email returns a user with
  // an empty identities array instead of an error.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
  }

  // Create the portal profile right away (service role — RLS has no insert
  // policies by design). If this fails, the login route self-heals it later.
  if (data.user && service) {
    const base = {
      id: data.user.id,
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

    // Pending → notify the admin with the full profile + signed review link.
    // Fire-and-forget: a mail hiccup must never fail the signup response.
    if (pendingReason && isTransactionalConfigured()) {
      const origin = portalOrigin(req.nextUrl.origin);
      const reviewUrl = isReviewTokenEnabled()
        ? `${origin}/portal/review?t=${encodeURIComponent(mintReviewToken(data.user.id))}`
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
      sendTransactionalEmail({ to, subject: mail.subject, html: mail.html, text: mail.text }).catch(
        () => undefined,
      );
    }
  }

  // confirm=true → Supabase sent a confirmation email; no session yet.
  // pending=true → the success screen explains the review step.
  return NextResponse.json({ ok: true, confirm: !data.session, pending: !active });
}
