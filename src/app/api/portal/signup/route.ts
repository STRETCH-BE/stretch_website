// POST /api/portal/signup — open self-registration, B2B-oriented.
// Two self-service audiences:
//   • Client  → account_type 'b2c': the B2B qualification set (company, VAT,
//     contact, phone, country, business type); an admin upgrades to a trade
//     tier after review. No trade pricing until then.
//   • Architect → account_type 'architect': office name + city instead of the
//     VAT set; instant access to the architect area after email confirmation.
//     NEVER any trade pricing — enforced by hasTradeAccess + pricebook RLS.
// Only available in Supabase mode — demo mode has no real accounts.
import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient, createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';

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

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
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
      // After the confirmation link, land the user on the portal login.
      emailRedirectTo: `${req.nextUrl.origin}/portal/login`,
    },
  });

  if (error) {
    const exists = /already|registered|exists/i.test(error.message);
    return NextResponse.json(
      { ok: false, error: exists ? 'exists' : 'failed' },
      { status: exists ? 409 : 500 },
    );
  }
  // Supabase quirk: signUp for an existing confirmed email returns a user with
  // an empty identities array instead of an error.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 });
  }

  // Create the portal profile right away (service role — RLS has no insert
  // policies by design). If this fails, the login route self-heals it later.
  if (data.user) {
    const service = createServiceClient();
    if (service) {
      const base = {
        id: data.user.id,
        email,
        role: 'client',
        account_type: accountType,
        markets: [],
        all_markets: false,
        active: true,
      };
      const { error: profileError } = await service
        .from('portal_users')
        .upsert({ ...base, ...details, account_type: accountType }, { onConflict: 'id' });
      if (profileError) {
        // Un-migrated database (newer columns missing) — store the core
        // profile; the details survive in the auth metadata for later.
        await service.from('portal_users').upsert({ ...base, company }, { onConflict: 'id' });
      }
    }
  }

  // confirm=true → Supabase sent a confirmation email; no session yet.
  return NextResponse.json({ ok: true, confirm: !data.session });
}
