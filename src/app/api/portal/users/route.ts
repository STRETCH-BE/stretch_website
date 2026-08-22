// /api/portal/users — admin-only client-account management.
//   GET    → list portal accounts
//   POST   → create account { email, password, company, role, accountType, country?, markets, allMarkets }
//   PATCH  → update account { id, active?, company?, role?, accountType?, country?, markets?, allMarkets?, password? }
// Uses the service-role client AFTER verifying the caller's admin session.
import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS, getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { normalizeAccountType, PRICE_MARKETS } from '@/lib/portal/types';
import { isPortalAllowedHost, portalOrigin } from '@/lib/portal/host';
import { canonicalEmail, emailDomain } from '@/lib/spam/email';
import { buildWelcomeEmail } from '@/lib/portal/emails';
import { sendTransactionalEmail, isTransactionalConfigured } from '@/lib/transactional';

export const runtime = 'nodejs';

function demoList() {
  return DEMO_USERS.map(({ password: _pw, ...u }) => u);
}

function sanitizeMarkets(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const valid = new Set<string>(PRICE_MARKETS as readonly string[]);
  return input.map(String).filter((m) => valid.has(m));
}

export async function GET(request: Request) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, users: demoList(), persisted: false });
  }
  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
      { status: 500 },
    );
  }
  const FULL: string =
    'id, email, company, role, account_type, markets, all_markets, active, created_at, contact_name, vat, phone, country, business_type, office, city, pending_reason, canonical_email, signup_ip, signup_host, signup_ua, signup_locale';
  const MID: string =
    'id, email, company, role, account_type, markets, all_markets, active, created_at, contact_name, vat, phone, country, business_type, office, city';
  const CORE: string = 'id, email, company, role, account_type, markets, all_markets, active, created_at';
  // Anti-spam and B2B columns are later additions — un-migrated databases
  // fall back in two steps.
  let { data, error } = await service.from('portal_users').select(FULL).order('created_at', { ascending: false });
  if (error) {
    ({ data, error } = await service.from('portal_users').select(MID).order('created_at', { ascending: false }));
  }
  if (error) {
    ({ data, error } = await service.from('portal_users').select(CORE).order('created_at', { ascending: false }));
  }
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Email-confirmation state lives on the AUTH user — join by id via
  // listUsers, paginated properly (1000/page covers this portal many times
  // over, but loop anyway).
  const confirmed = new Map<string, boolean>();
  try {
    for (let pageNo = 1; pageNo <= 20; pageNo++) {
      const { data: pageData, error: listError } = await service.auth.admin.listUsers({
        page: pageNo,
        perPage: 1000,
      });
      if (listError || !pageData?.users?.length) break;
      for (const au of pageData.users) confirmed.set(au.id, Boolean(au.email_confirmed_at));
      if (pageData.users.length < 1000) break;
    }
  } catch {
    /* confirmation state stays unknown */
  }

  const users = ((data ?? []) as unknown as Record<string, unknown>[]).map((u) => ({
    id: u.id,
    email: u.email,
    company: u.company,
    role: u.role,
    accountType: normalizeAccountType(u.account_type),
    markets: (u.markets as string[] | null) ?? [],
    allMarkets: Boolean(u.all_markets),
    active: Boolean(u.active),
    createdAt: (u.created_at as string | null) ?? null,
    contactName: (u.contact_name as string | null) ?? null,
    vat: (u.vat as string | null) ?? null,
    phone: (u.phone as string | null) ?? null,
    country: (u.country as string | null) ?? null,
    businessType: (u.business_type as string | null) ?? null,
    office: (u.office as string | null) ?? null,
    city: (u.city as string | null) ?? null,
    pendingReason: (u.pending_reason as string | null) ?? null,
    canonicalEmail: (u.canonical_email as string | null) ?? null,
    signupIp: u.signup_ip ? String(u.signup_ip) : null,
    signupHost: (u.signup_host as string | null) ?? null,
    signupUa: (u.signup_ua as string | null) ?? null,
    signupLocale: (u.signup_locale as string | null) ?? null,
    emailConfirmed: confirmed.has(String(u.id)) ? confirmed.get(String(u.id)) : null,
  }));
  return NextResponse.json({ ok: true, users, persisted: true });
}

// DELETE — remove accounts (auth user + profile via FK cascade).
//   { ids: string[], markSpam?: boolean, blockDomain?: boolean }
// markSpam additionally writes the canonical email (and optionally the
// domain) to blocked_senders. Admin accounts are never deleted here.
export async function DELETE(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.map(String).filter(Boolean).slice(0, 100) : [];
  if (ids.length === 0) {
    return NextResponse.json({ ok: false, error: 'Missing account ids.' }, { status: 400 });
  }
  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false, deleted: 0 });
  }
  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  const { data: rows } = await service
    .from('portal_users')
    .select('id, email, role')
    .in('id', ids);
  const targets = (rows ?? []).filter((r) => r.role !== 'admin');

  if (body?.markSpam === true && targets.length > 0) {
    const entries: { kind: string; value: string; reason: string }[] = [];
    for (const r of targets) {
      entries.push({ kind: 'email', value: canonicalEmail(r.email), reason: 'spam' });
      if (body?.blockDomain === true) {
        const domain = emailDomain(r.email);
        if (domain) entries.push({ kind: 'domain', value: domain, reason: 'spam' });
      }
    }
    // Un-migrated database (table missing) → the delete still proceeds.
    const { error: blockError } = await service
      .from('blocked_senders')
      .upsert(entries, { onConflict: 'kind,value', ignoreDuplicates: true });
    if (blockError) console.warn(`[users] blocklist write failed: ${blockError.message}`);
  }

  let deleted = 0;
  const errors: string[] = [];
  for (const r of targets) {
    const { error } = await service.auth.admin.deleteUser(r.id);
    if (error) {
      errors.push(`${r.email}: ${error.message}`);
      // Auth user may already be gone — remove the orphaned profile.
      await service.from('portal_users').delete().eq('id', r.id);
    } else {
      deleted += 1;
    }
  }
  return NextResponse.json({ ok: true, persisted: true, deleted, errors });
}

export async function POST(req: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');
  const company = String(body?.company ?? '').trim() || null;
  const role = body?.role === 'admin' ? 'admin' : 'client';
  const accountType = normalizeAccountType(body?.accountType);
  const allMarkets = Boolean(body?.allMarkets) || role === 'admin';
  const markets = sanitizeMarkets(body?.markets);
  // Same sanitization as PATCH: ISO alpha-2 (or 'OTHER'), stored uppercase.
  const country = String(body?.country ?? '').trim().toUpperCase().slice(0, 8) || null;

  if (!email || !email.includes('@') || password.length < 8) {
    return NextResponse.json(
      { ok: false, error: 'Valid e-mail and a password of at least 8 characters are required.' },
      { status: 400 },
    );
  }
  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false });
  }
  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  const { data: created, error: authError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError || !created.user) {
    return NextResponse.json(
      { ok: false, error: authError?.message ?? 'Could not create the login.' },
      { status: 500 },
    );
  }

  const { error: profileError } = await service.from('portal_users').insert({
    id: created.user.id,
    email,
    company,
    role,
    account_type: accountType,
    markets,
    all_markets: allMarkets,
    active: true,
    country,
    canonical_email: canonicalEmail(email),
  });
  if (profileError) {
    // canonical_email is a later column — retry the pre-existing shape.
    const { error: legacyError } = await service.from('portal_users').insert({
      id: created.user.id,
      email,
      company,
      role,
      account_type: accountType,
      markets,
      all_markets: allMarkets,
      active: true,
      country,
    });
    if (legacyError) {
      // Roll back the orphaned auth user so the e-mail can be retried.
      await service.auth.admin.deleteUser(created.user.id).catch(() => undefined);
      return NextResponse.json({ ok: false, error: legacyError.message }, { status: 500 });
    }
  }

  // Welcome mail (default ON): tell the client STRETCH created their account,
  // with the temporary password. AWAITED — unawaited sends die when the
  // serverless function freezes after the response.
  let welcomed = false;
  if (body?.sendWelcome !== false && isTransactionalConfigured()) {
    const mail = buildWelcomeEmail({
      name: null,
      email,
      tempPassword: password,
      loginUrl: `${portalOrigin(req.nextUrl.origin)}/portal/login`,
    });
    const sent = await sendTransactionalEmail({
      to: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }).catch(() => ({ ok: false as const }));
    welcomed = sent.ok;
    if (!sent.ok) console.warn('[users] welcome mail failed to send');
  }

  return NextResponse.json({ ok: true, persisted: true, id: created.user.id, welcomed });
}

export async function PATCH(req: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!id) return NextResponse.json({ ok: false, error: 'Missing account id.' }, { status: 400 });

  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false });
  }
  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  const update: Record<string, unknown> = {};
  if (typeof body.active === 'boolean') update.active = body.active;
  if (typeof body.company === 'string') update.company = body.company.trim() || null;
  if (body.role === 'admin' || body.role === 'client') update.role = body.role;
  // Move an account between tiers — markets are assigned separately; a trade
  // account without markets simply sees no rows yet.
  if (typeof body.accountType === 'string') update.account_type = normalizeAccountType(body.accountType);
  if (Array.isArray(body.markets)) update.markets = sanitizeMarkets(body.markets);
  if (typeof body.allMarkets === 'boolean') update.all_markets = body.allMarkets;
  if (typeof body.contactName === 'string') update.contact_name = body.contactName.trim().slice(0, 120) || null;
  if (typeof body.vat === 'string') update.vat = body.vat.trim().slice(0, 32) || null;
  if (typeof body.phone === 'string') update.phone = body.phone.trim().slice(0, 32) || null;
  if (typeof body.country === 'string') update.country = body.country.trim().toUpperCase().slice(0, 8) || null;
  if (typeof body.businessType === 'string') update.business_type = body.businessType.trim().toLowerCase().slice(0, 20) || null;
  if (typeof body.office === 'string') update.office = body.office.trim().slice(0, 120) || null;
  if (typeof body.city === 'string') update.city = body.city.trim().slice(0, 80) || null;

  if (Object.keys(update).length > 0) {
    const { error } = await service.from('portal_users').update(update).eq('id', id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (typeof body.password === 'string' && body.password.length >= 8) {
    const { error } = await service.auth.admin.updateUserById(id, { password: body.password });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, persisted: true });
}
