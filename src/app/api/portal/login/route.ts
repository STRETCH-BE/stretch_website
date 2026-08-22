// POST /api/portal/login — signs a portal client in.
// Supabase mode: password auth + portal profile check (must exist + be active;
// a missing profile is self-healed as a B2C profile so self-registered users
// and users created directly in the Supabase dashboard can always sign in).
// Demo mode (no Supabase env AND NEXT_PUBLIC_PORTAL_DEMO=1): checks the
// built-in demo accounts and sets a plain demo cookie. Without the flag the
// portal is closed until Supabase is configured — no demo credentials work.
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteClient, createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { DEMO_COOKIE, findDemoUser } from '@/lib/portal/auth';
import { isPortalAllowedHost } from '@/lib/portal/host';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { canonicalEmail, emailDomain, isFreemail } from '@/lib/spam/email';
import { isTurnstileEnabled, verifyTurnstile } from '@/lib/turnstile';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  let email = '';
  let password = '';
  let captchaToken = '';
  try {
    const body = await req.json();
    email = String(body.email ?? '').trim();
    password = String(body.password ?? '');
    captchaToken = String(body.captchaToken ?? '').slice(0, 4096);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  // Rate limits: per IP and per (canonical) email — fail-open in the helper.
  const ip = getClientIp(req);
  if (
    !(await rateLimit(`login:ip:${ip}`, 10, 10 * 60)) ||
    !(await rateLimit(`login:email:${canonicalEmail(email)}`, 20, 60 * 60))
  ) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  // WE verify the Turnstile token — same proven siteverify path as the lead
  // routes. (GoTrue's own verification of server-forwarded tokens failed
  // consistently with timeout-or-duplicate, Aug 2026 — the Supabase CAPTCHA
  // toggle therefore stays OFF.) 'unavailable' fails open: the per-IP and
  // per-email rate limits above still stand, and locking every real client
  // out during a Cloudflare outage is the worse failure.
  if (isTurnstileEnabled() && isSupabaseConfigured()) {
    if (!captchaToken) {
      console.warn('[login] captcha rejected: no token from the client widget');
      return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
    }
    const verdict = await verifyTurnstile({
      token: captchaToken,
      host: req.headers.get('host') ?? '',
      ip,
    });
    if (verdict === 'fail') {
      console.warn('[login] captcha rejected by siteverify');
      return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
    }
  }

  // --- Demo mode (opt-in via NEXT_PUBLIC_PORTAL_DEMO=1) --------------------
  if (!isSupabaseConfigured()) {
    if (process.env.NEXT_PUBLIC_PORTAL_DEMO !== '1') {
      return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
    }
    const user = findDemoUser(email, password);
    if (!user) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 401 });
    cookies().set(DEMO_COOKIE, Buffer.from(user.email, 'utf8').toString('base64url'), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    return NextResponse.json({ ok: true, demo: true });
  }

  // --- Supabase mode -------------------------------------------------------
  const supabase = createRouteClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    // The Turnstile token was verified ABOVE by our own siteverify call —
    // single-use, so never also forwarded to Supabase.
  });
  if (error || !data.user) {
    const captcha = error && /captcha/i.test(error.message);
    if (captcha) console.warn(`[login] captcha rejected by Supabase: ${error?.message}`);
    return NextResponse.json(
      { ok: false, error: captcha ? 'captcha' : 'invalid' },
      { status: captcha ? 400 : 401 },
    );
  }

  // The auth user must also have an ACTIVE portal profile. pending_reason is
  // a later column — retry without it so an un-migrated database still works.
  let { data: profile } = await supabase
    .from('portal_users')
    .select('id, active, pending_reason')
    .eq('id', data.user.id)
    .maybeSingle();
  if (!profile) {
    ({ data: profile } = await supabase
      .from('portal_users')
      .select('id, active')
      .eq('id', data.user.id)
      .maybeSingle() as unknown as { data: typeof profile });
  }

  if (!profile) {
    // Auth user without profile (self-signup edge case, or user created in the
    // Supabase dashboard) → self-heal with a B2C profile.
    const service = createServiceClient();
    if (service) {
      const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
      const metaText = (key: string) =>
        typeof meta[key] === 'string' && (meta[key] as string).trim()
          ? (meta[key] as string).trim().slice(0, 120)
          : null;
      // Self-service tiers only from metadata: an architect signup must
      // self-heal as an architect, anything else stays b2c.
      const metaTier = metaText('account_type') === 'architect' ? 'architect' : 'b2c';
      // The self-heal must apply the SAME gating rules as /api/portal/signup —
      // otherwise a failed profile insert becomes a bypass around the
      // approval gate (decisions locked 22 Aug 2026).
      const healPending =
        metaTier === 'architect'
          ? isFreemail(emailDomain(email))
            ? 'freemail'
            : null
          : 'installer_review';
      const base = {
        id: data.user.id,
        email,
        company: metaText('company'),
        role: 'client',
        account_type: metaTier,
        markets: [],
        all_markets: false,
        active: healPending === null,
      };
      const { error: insertError } = await service.from('portal_users').insert({
        ...base,
        // Signup details captured in the auth metadata — restored here.
        contact_name: metaText('contact_name'),
        vat: metaText('vat'),
        phone: metaText('phone'),
        country: metaText('country'),
        business_type: metaText('business_type'),
        office: metaText('office'),
        city: metaText('city'),
        canonical_email: canonicalEmail(email),
        pending_reason: healPending,
      });
      if (!insertError) {
        if (healPending) {
          await supabase.auth.signOut();
          return NextResponse.json({ ok: false, error: 'pending' }, { status: 403 });
        }
        return NextResponse.json({ ok: true, demo: false });
      }
      // Un-migrated database (B2B columns missing) — core profile only.
      const { error: retryError } = await service.from('portal_users').insert(base);
      if (!retryError) {
        if (healPending) {
          await supabase.auth.signOut();
          return NextResponse.json({ ok: false, error: 'pending' }, { status: 403 });
        }
        return NextResponse.json({ ok: true, demo: false });
      }
    }
    await supabase.auth.signOut();
    return NextResponse.json({ ok: false, error: 'inactive' }, { status: 403 });
  }

  if (!profile.active) {
    await supabase.auth.signOut();
    // Awaiting approval reads differently from deactivated-by-an-admin.
    const pending = Boolean((profile as { pending_reason?: string | null }).pending_reason);
    return NextResponse.json(
      { ok: false, error: pending ? 'pending' : 'inactive' },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true, demo: false });
}
