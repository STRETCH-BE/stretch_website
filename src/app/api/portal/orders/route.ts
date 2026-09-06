// /api/portal/orders — configurator orders.
//   GET   → the caller's orders (every order for an admin); ?reference= for one
//           order with its frozen line snapshot
//   PATCH → admin only: status, internal note, or "send the confirmation again"
//
// Installers and admins only. Clients never write here: status changes and
// internal notes are admin-only and go through the service role.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasConfiguratorAccess } from '@/lib/portal/types';
import { isPortalAllowedHost } from '@/lib/portal/host';
import {
  ORDER_STATUSES,
  getOrder,
  listOrders,
  updateOrder,
  type PortalOrderStatus,
} from '@/lib/portal/configurator/order-store';
import { buildCustomerEmail } from '@/lib/portal/configurator/order-mail';
import { sendTransactionalEmail } from '@/lib/transactional';
import type { PricedBom } from '@/lib/portal/configurator/pricing';
import type { ConfiguratorConfig } from '@/lib/portal/configurator/bom';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function guard(request: NextRequest | Request) {
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return { error: NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 }) };
  }
  const session = await getPortalSession();
  if (!session) return { error: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }) };
  if (!hasConfiguratorAccess(session.profile))
    return { error: NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 }) };
  return { session };
}

export async function GET(request: NextRequest) {
  const { session, error } = await guard(request);
  if (error) return error;
  if (session!.demo) return NextResponse.json({ ok: true, demo: true, orders: [] });

  const reference = request.nextUrl.searchParams.get('reference');
  if (reference) {
    const found = await getOrder(session!.profile, reference);
    if (!found) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, order: found.order, lines: found.lines });
  }

  const orders = await listOrders(session!.profile);
  if (orders === null) return NextResponse.json({ ok: true, storage: 'none', orders: [] });
  return NextResponse.json({ ok: true, orders });
}

export async function PATCH(request: NextRequest) {
  const { session, error } = await guard(request);
  if (error) return error;
  if (session!.profile.role !== 'admin')
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  if (session!.demo) return NextResponse.json({ ok: true, demo: true });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const reference = typeof body.reference === 'string' ? body.reference : null;
  if (!reference) return NextResponse.json({ ok: false, error: 'missing_reference' }, { status: 400 });
  const found = await getOrder(session!.profile, reference);
  if (!found) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });

  // "Send the confirmation again" — rebuilt from the FROZEN snapshot, never
  // re-priced from a newer pricebook.
  if (body.resend === true) {
    const order = found.order;
    const quote = {
      market: order.market,
      currency: order.currency,
      lines: found.lines.map((l) => ({
        kind: l.kind ?? '',
        slug: '',
        label: l.product,
        code: l.code,
        qty: Number(l.qty),
        unit: l.unit,
        unitPriceEur: l.unit_price == null ? null : Number(l.unit_price),
        lineTotalEur: l.line_total == null ? null : Number(l.line_total),
        unitPricePln: null,
        lineTotalPln: null,
        status: l.line_total == null ? ('no_price' as const) : ('ok' as const),
        note: l.note ?? undefined,
      })),
      notes: [],
      subtotalEur: Number(order.subtotal),
      subtotalPln: null,
      needsManualPricing: order.needs_manual_pricing,
      unpricedCount: found.lines.filter((l) => l.line_total == null).length,
      area: 0,
      perimeter: 0,
      need: 0,
      cornersInside: 0,
      cornersOutside: 0,
      weldMetres: 0,
      weldCount: order.weld_required ? 1 : 0,
      incomplete: false,
      foil: {
        slug: null,
        label: order.foil_product,
        code: order.foil_code,
        product: order.foil_product,
        widthCm: null,
        reason: '',
        weldRequired: order.weld_required,
      },
      panels: [],
      pricebookVersion: order.pricebook_version ?? '—',
      pricebookUpdatedAt: '',
    } as unknown as PricedBom;

    const cfg = order.config as unknown as ConfiguratorConfig;
    // The snapshot has no geometry read-outs; take what the config carries.
    quote.area = Number(cfg?.length ?? 0) * Number(cfg?.width ?? 0);
    const mail = buildCustomerEmail({
      reference: order.reference,
      quote,
      config: cfg,
      account: { email: order.email, company: order.company },
      meta: { projectRef: order.project_ref, deliveryAddress: order.delivery_address, note: order.note },
    });
    const res = await sendTransactionalEmail({
      to: order.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    return NextResponse.json({ ok: res.ok, resent: res.ok, method: res.method });
  }

  const patch: { status?: PortalOrderStatus; internal_note?: string | null } = {};
  if (typeof body.status === 'string') {
    if (!(ORDER_STATUSES as readonly string[]).includes(body.status))
      return NextResponse.json({ ok: false, error: 'bad_status' }, { status: 400 });
    patch.status = body.status as PortalOrderStatus;
  }
  if ('internalNote' in body) {
    patch.internal_note = typeof body.internalNote === 'string' ? body.internalNote.slice(0, 2000) : null;
  }
  if (Object.keys(patch).length === 0)
    return NextResponse.json({ ok: false, error: 'nothing_to_update' }, { status: 400 });

  const done = await updateOrder(found.order.id, patch);
  return NextResponse.json({ ok: done });
}
