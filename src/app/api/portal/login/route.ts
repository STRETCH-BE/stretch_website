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

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let email = '';
  let password = '';
  try {
    const body = await req.json();
    email = String(body.email ?? '').trim();
    password = String(body.password ?? '');
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 401 });
  }

  // The auth user must also have an ACTIVE portal profile.
  const { data: profile } = await supabase
    .from('portal_users')
    .select('id, active')
    .eq('id', data.user.id)
    .maybeSingle();

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
      const base = {
        id: data.user.id,
        email,
        company: metaText('company'),
        role: 'client',
        account_type: 'b2c',
        markets: [],
        all_markets: false,
        active: true,
      };
      const { error: insertError } = await service.from('portal_users').insert({
        ...base,
        // B2B details captured at signup (see signup route) — restored here.
        contact_name: metaText('contact_name'),
        vat: metaText('vat'),
        phone: metaText('phone'),
        country: metaText('country'),
        business_type: metaText('business_type'),
      });
      if (!insertError) return NextResponse.json({ ok: true, demo: false });
      // Un-migrated database (B2B columns missing) — core profile only.
      const { error: retryError } = await service.from('portal_users').insert(base);
      if (!retryError) return NextResponse.json({ ok: true, demo: false });
    }
    await supabase.auth.signOut();
    return NextResponse.json({ ok: false, error: 'inactive' }, { status: 403 });
  }

  if (!profile.active) {
    await supabase.auth.signOut();
    return NextResponse.json({ ok: false, error: 'inactive' }, { status: 403 });
  }

  return NextResponse.json({ ok: true, demo: false });
}
