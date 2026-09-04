// CLIENT PORTAL — saved acoustic rooms (list / load / save / delete).
// Every signed-in account (hasAcousticsAccess). All persistence is
// best-effort: in demo mode or without a service-role key the route answers
// with storage:'none' and the calculator falls back to browser-side autosave.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasAcousticsAccess } from '@/lib/portal/types';
import { listProjects, getProject, saveProject, deleteProject } from '@/lib/portal/acoustic-store';
import { isAcousticState } from '@/lib/portal/acoustic-summary';
import { isPortalAllowedHost } from '@/lib/portal/host';

export const dynamic = 'force-dynamic';

const MAX_STATE_BYTES = 1_000_000; // a room is a few KB — 1 MB is generous

async function guard() {
  const session = await getPortalSession();
  if (!session) return { error: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }) };
  if (!hasAcousticsAccess(session.profile))
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
  if (session!.demo) return NextResponse.json({ ok: true, storage: 'none', demo: true, projects: [] });

  const id = request.nextUrl.searchParams.get('id');
  if (id) {
    const project = await getProject(session!.profile.email, id);
    if (!project) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, project });
  }
  const projects = await listProjects(session!.profile.email);
  if (projects === null) return NextResponse.json({ ok: true, storage: 'none', projects: [] });
  return NextResponse.json({ ok: true, storage: 'db', projects });
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
  const state = body.state;
  if (!isAcousticState(state)) return NextResponse.json({ ok: false, error: 'not_a_room' }, { status: 400 });
  if (JSON.stringify(state).length > MAX_STATE_BYTES)
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 });

  const name = (typeof body.name === 'string' && body.name.trim().slice(0, 120)) || 'Untitled';
  const id = await saveProject(session!.profile, {
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
  await deleteProject(session!.profile.email, id);
  return NextResponse.json({ ok: true });
}
