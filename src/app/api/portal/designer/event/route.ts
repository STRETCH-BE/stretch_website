// CLIENT PORTAL — lightweight designer usage events (fire-and-forget).
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { logDesignerEvent } from '@/lib/portal/designer-store';

export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['open', 'cloud_save', 'cloud_load', 'order_attempt', 'order_fallback']);

export async function POST(request: NextRequest) {
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
