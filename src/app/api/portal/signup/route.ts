// POST /api/portal/signup — open self-registration (B2C accounts).
// Creates a Supabase auth user + a `portal_users` profile with
// account_type='b2c': the user gets their own account area immediately, but
// NO trade pricing and NO designer. An admin can later upgrade the account to
// B2B (and assign markets) in the portal admin panel.
// Only available in Supabase mode — demo mode has no real accounts.
import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient, createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }

  let email = '';
  let password = '';
  let company = '';
  try {
    const body = await req.json();
    email = String(body.email ?? '').trim().toLowerCase();
    password = String(body.password ?? '');
    company = String(body.company ?? '').trim().slice(0, 120);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || password.length < 8) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  const supabase = createRouteClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: company ? { company } : undefined,
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

  // Create the B2C portal profile right away (service role — RLS has no insert
  // policies by design). If this fails, the login route self-heals it later.
  if (data.user) {
    const service = createServiceClient();
    if (service) {
      await service.from('portal_users').upsert(
        {
          id: data.user.id,
          email,
          company: company || null,
          role: 'client',
          account_type: 'b2c',
          markets: [],
          all_markets: false,
          active: true,
        },
        { onConflict: 'id' },
      );
    }
  }

  // confirm=true → Supabase sent a confirmation email; no session yet.
  return NextResponse.json({ ok: true, confirm: !data.session });
}
