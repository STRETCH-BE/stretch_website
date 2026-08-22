// POST /api/portal/logout — ends the portal session (Supabase or demo cookie).
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { DEMO_COOKIE } from '@/lib/portal/auth';
import { isPortalAllowedHost } from '@/lib/portal/host';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  if (isSupabaseConfigured()) {
    const supabase = createRouteClient();
    await supabase.auth.signOut();
  }
  cookies().delete(DEMO_COOKIE);
  return NextResponse.json({ ok: true });
}
