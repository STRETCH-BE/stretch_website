// CLIENT PORTAL — lightweight designer usage events (fire-and-forget).
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { logDesignerEvent } from '@/lib/portal/designer-store';
import { isPortalAllowedHost } from '@/lib/portal/host';

export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['open', 'cloud_save', 'cloud_load', 'order_attempt', 'order_fallback']);

export async function POST(request: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const session = await getPortalSession();
  if (!session) return new NextResponse(null, { status: 204 });
  let body: { event?: unknown; meta?: unknown };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const event = typeof body.event === 'string' && ALLOWED.has(body.event) ? body.event : null;
  if (event) {
    const meta =
      body.meta && typeof body.meta === 'object' && !Array.isArray(body.meta)
        ? (body.meta as Record<string, unknown>)
        : {};
    void logDesignerEvent(event, session.profile.email, session.demo, meta);
  }
  return new NextResponse(null, { status: 204 });
}
