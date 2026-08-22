// CLIENT PORTAL — update a designer order's status (admin only).
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/portal/auth';
import { updateOrderStatus, ORDER_STATUSES, type OrderStatus } from '@/lib/portal/designer-store';
import { isPortalAllowedHost } from '@/lib/portal/host';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  if (session.demo) return NextResponse.json({ ok: true, demo: true });

  let body: { id?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }
  const id = typeof body.id === 'string' ? body.id : null;
  const status = ORDER_STATUSES.includes(body.status as OrderStatus) ? (body.status as OrderStatus) : null;
  if (!id || !status) return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });

  const ok = await updateOrderStatus(id, status);
  return NextResponse.json({ ok });
}
