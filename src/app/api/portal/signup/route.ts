// POST /api/portal/signup — open self-registration, B2B-oriented.
// STRETCH is B2B-focused: registration asks for the company details our team
// needs to qualify the account (company, VAT, contact, phone, country,
// business type). The account itself is created as account_type='b2c' — own
// account area immediately, NO trade pricing and NO designer — and an admin
// upgrades it to a trade tier after reviewing the submitted details.
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
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (
    !EMAIL_RE.test(email) ||
    password.length < 8 ||
    !company ||
    !contactName ||
    !VAT_RE.test(vat) ||
    !PHONE_RE.test(phone) ||
    !COUNTRY_RE.test(country) ||
    !BUSINESS_TYPES.has(businessType)
  ) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  // The company details also go into the auth user's metadata, so the login
  // route's self-heal can rebuild a full profile if the insert below fails.
  const details = {
    company,
    contact_name: contactName,
    vat,
    phone,
    country,
    business_type: businessType,
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
        account_type: 'b2c',
        markets: [],
        all_markets: false,
        active: true,
      };
      const { error: profileError } = await service
        .from('portal_users')
        .upsert({ ...base, ...details }, { onConflict: 'id' });
      if (profileError) {
        // Un-migrated database (B2B columns missing) — store the core profile;
        // the details survive in the auth metadata for later.
        await service.from('portal_users').upsert({ ...base, company }, { onConflict: 'id' });
      }
    }
  }

  // confirm=true → Supabase sent a confirmation email; no session yet.
  return NextResponse.json({ ok: true, confirm: !data.session });
}
