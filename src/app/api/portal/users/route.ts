// /api/portal/users — admin-only client-account management.
//   GET    → list portal accounts
//   POST   → create account { email, password, company, role, accountType, country?, markets, allMarkets }
//   PATCH  → update account { id, active?, company?, role?, accountType?, country?, markets?, allMarkets?, password? }
// Uses the service-role client AFTER verifying the caller's admin session.
import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS, getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { normalizeAccountType, PRICE_MARKETS } from '@/lib/portal/types';

export const runtime = 'nodejs';

function demoList() {
  return DEMO_USERS.map(({ password: _pw, ...u }) => u);
}

function sanitizeMarkets(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const valid = new Set<string>(PRICE_MARKETS as readonly string[]);
  return input.map(String).filter((m) => valid.has(m));
}

export async function GET() {
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
    'id, email, company, role, account_type, markets, all_markets, active, created_at, contact_name, vat, phone, country, business_type, office, city';
  const CORE: string = 'id, email, company, role, account_type, markets, all_markets, active, created_at';
  // B2B columns are a later addition — un-migrated databases fall back.
  let { data, error } = await service.from('portal_users').select(FULL).order('created_at', { ascending: true });
  if (error) {
    ({ data, error } = await service.from('portal_users').select(CORE).order('created_at', { ascending: true }));
  }
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const users = ((data ?? []) as unknown as Record<string, unknown>[]).map((u) => ({
    id: u.id,
    email: u.email,
    company: u.company,
    role: u.role,
    accountType: normalizeAccountType(u.account_type),
    markets: (u.markets as string[] | null) ?? [],
    allMarkets: Boolean(u.all_markets),
    active: Boolean(u.active),
    contactName: (u.contact_name as string | null) ?? null,
    vat: (u.vat as string | null) ?? null,
    phone: (u.phone as string | null) ?? null,
    country: (u.country as string | null) ?? null,
    businessType: (u.business_type as string | null) ?? null,
    office: (u.office as string | null) ?? null,
    city: (u.city as string | null) ?? null,
  }));
  return NextResponse.json({ ok: true, users, persisted: true });
}

export async function POST(req: NextRequest) {
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
  });
  if (profileError) {
    // Roll back the orphaned auth user so the e-mail can be retried.
    await service.auth.admin.deleteUser(created.user.id).catch(() => undefined);
    return NextResponse.json({ ok: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, persisted: true, id: created.user.id });
}

export async function PATCH(req: NextRequest) {
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
