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
    // Rebuild the ceilings from the frozen snapshot. Orders since 8 Sep 2026
    // hold { ceilings: [...] } and lines carry ceiling_no; older ones hold a
    // single configuration and every line is ceiling 1.
    const cfgRoot = (order.config ?? {}) as Record<string, unknown>;
    const configs = (Array.isArray(cfgRoot.ceilings) ? cfgRoot.ceilings : [cfgRoot]) as unknown as ConfiguratorConfig[];
    const count = Math.max(1, configs.length, ...found.lines.map((l) => Number(l.ceiling_no ?? 1)));
    const ceilings = Array.from({ length: count }, (_, i) => {
      const cfg = configs[i] ?? configs[0] ?? ({} as ConfiguratorConfig);
      const mine = found.lines.filter((l) => Number(l.ceiling_no ?? 1) === i + 1);
      const subtotal = mine.reduce((sum, l) => sum + (l.line_total == null ? 0 : Number(l.line_total)), 0);
      const L = Number(cfg?.length ?? 0);
      const W = Number(cfg?.width ?? 0);
      const F = Number(cfg?.foldLength ?? (cfg?.foldSide === 'width' ? W : L));
      const S = cfg?.shape === 'sloped' ? Number(cfg?.slopeRun ?? 0) : 0;
      const quote = {
        market: order.market,
        currency: order.currency,
        lines: mine.map((l) => ({
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
        subtotalEur: Math.round(subtotal * 100) / 100,
        subtotalPln: null,
        needsManualPricing: mine.some((l) => l.line_total == null),
        unpricedCount: mine.filter((l) => l.line_total == null).length,
        // The snapshot has no geometry read-outs; take what the config carries.
        area: L * W + F * S,
        rollMetres: 0,
        clothPieces: 0,
        clothWidthsCm: [],
        perimeter: 0,
        need: 0,
        cornersInside: 0,
        cornersOutside: 0,
        weldMetres: 0,
        weldCount: i === 0 && order.weld_required ? 1 : 0,
        incomplete: false,
        foil: {
          slug: null,
          label: i === 0 ? order.foil_product : null,
          code: i === 0 ? order.foil_code : null,
          product: i === 0 ? order.foil_product : null,
          widthCm: null,
          reason: '',
          weldRequired: i === 0 && order.weld_required,
        },
        panels: [],
        pricebookVersion: order.pricebook_version ?? '—',
        pricebookUpdatedAt: '',
      } as unknown as PricedBom;
      const stored = (cfg ?? {}) as unknown as { reference?: unknown };
      const reference =
        (typeof stored.reference === 'string' ? stored.reference : null) ??
        mine[0]?.ceiling_ref ??
        (count === 1 ? order.ceiling_ref : null);
      return { config: cfg, quote, reference };
    });
    const mail = buildCustomerEmail({
      reference: order.reference,
      ceilings,
      account: { email: order.email, company: order.company },
      meta: {
        projectRef: order.project_ref,
        deliveryAddress: order.delivery_address,
        note: order.note,
      },
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
