// CLIENT PORTAL — saved ceiling designs (list / load / save / delete).
// Trade accounts only (the designer itself is trade-gated). All persistence is
// best-effort: in demo mode or without a service-role key the route answers
// with storage:'none' and the designer falls back to browser-side storage.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { listDesigns, getDesign, saveDesign, deleteDesign } from '@/lib/portal/designer-store';
import { isPortalAllowedHost } from '@/lib/portal/host';

export const dynamic = 'force-dynamic';

const MAX_STATE_BYTES = 1_000_000; // a measurement file is a few KB — 1 MB is generous

async function guard() {
  const session = await getPortalSession();
  if (!session) return { error: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }) };
  if (!hasTradeAccess(session.profile))
    return { error: NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 }) };
  return { session };
}

export async function GET(request: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const { session, error } = await guard();
  if (error) return error;
  if (session!.demo) return NextResponse.json({ ok: true, storage: 'none', demo: true, designs: [] });

  const id = request.nextUrl.searchParams.get('id');
  if (id) {
    const design = await getDesign(session!.profile.email, id);
    if (!design) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, design });
  }
  const designs = await listDesigns(session!.profile.email);
  if (designs === null) return NextResponse.json({ ok: true, storage: 'none', designs: [] });
  return NextResponse.json({ ok: true, storage: 'db', designs });
}

export async function POST(request: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const { session, error } = await guard();
  if (error) return error;
  if (session!.demo) return NextResponse.json({ ok: true, storage: 'none', demo: true, id: null });

  let body: { id?: string | null; name?: string; state?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }
  const state = body.state as Record<string, unknown> | undefined;
  if (!state || state.app !== 'abc-floorplan')
    return NextResponse.json({ ok: false, error: 'not_a_measurement' }, { status: 400 });
  if (JSON.stringify(state).length > MAX_STATE_BYTES)
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 });

  const name = (typeof body.name === 'string' && body.name.trim().slice(0, 120)) || 'Untitled';
  const id = await saveDesign(session!.profile, {
    id: typeof body.id === 'string' ? body.id : null,
    name,
    state,
  });
  if (!id) return NextResponse.json({ ok: true, storage: 'none', id: null });
  return NextResponse.json({ ok: true, storage: 'db', id });
}

export async function DELETE(request: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const { session, error } = await guard();
  if (error) return error;
  if (session!.demo) return NextResponse.json({ ok: true });
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  await deleteDesign(session!.profile.email, id);
  return NextResponse.json({ ok: true });
}
