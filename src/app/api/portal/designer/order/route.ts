// CLIENT PORTAL — receive a ceiling order from the designer.
// Stores the order in designer_orders (best-effort) and e-mails it to the
// STRETCH lead inbox from the SERVER, with the order JSON attached — the
// dealer's own mail client is no longer a single point of failure. The
// designer keeps a mailto fallback for when this route can't be reached.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { storeOrder, logDesignerEvent } from '@/lib/portal/designer-store';
import { deliverOrderEmail } from '@/lib/portal/order-email';

export const dynamic = 'force-dynamic';

const MAX_ORDER_BYTES = 2_000_000;

type OrderBody = {
  order?: { ref?: unknown };
  client?: Record<string, unknown>;
  product?: unknown;
  specification?: unknown;
  quote?: unknown;
  drawing?: unknown;
  summaryText?: unknown;
};

export async function POST(request: NextRequest) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!hasTradeAccess(session.profile))
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const raw = await request.text();
  if (raw.length > MAX_ORDER_BYTES)
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 });
  let body: OrderBody;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const ref =
    typeof body.order?.ref === 'string' && /^[A-Z0-9-]{6,40}$/.test(body.order.ref)
      ? body.order.ref
      : null;
  if (!ref) return NextResponse.json({ ok: false, error: 'missing_ref' }, { status: 400 });

  // Demo sessions: acknowledge but never store or e-mail.
  if (session.demo) {
    return NextResponse.json({ ok: true, demo: true, ref, stored: false, delivered: false });
  }

  const summaryText =
    typeof body.summaryText === 'string' ? body.summaryText.slice(0, 20_000) : `Order ${ref}`;
  const orderJson = JSON.stringify(
    {
      order: body.order,
      dealer: { email: session.profile.email, company: session.profile.company },
      client: body.client ?? {},
      product: body.product ?? {},
      specification: body.specification ?? {},
      quote: body.quote ?? {},
      drawing: body.drawing ?? {},
    },
    null,
    1,
  );

  const delivery = await deliverOrderEmail({
    ref,
    dealer: { email: session.profile.email, company: session.profile.company },
    client: body.client ?? {},
    summaryText,
    orderJson,
  });

  const storedId = await storeOrder(
    session.profile,
    {
      ref,
      client: body.client ?? {},
      product: body.product ?? {},
      specification: body.specification ?? {},
      quote: body.quote ?? {},
      drawing: body.drawing ?? {},
    },
    { delivered: delivery.delivered, method: delivery.method },
  );

  void logDesignerEvent('order_placed', session.profile.email, false, {
    ref,
    stored: Boolean(storedId),
    delivered: delivery.delivered,
    method: delivery.method,
  });

  // ok when the order reached at least one durable place (inbox or database).
  const ok = delivery.delivered || Boolean(storedId);
  return NextResponse.json({
    ok,
    ref,
    stored: Boolean(storedId),
    delivered: delivery.delivered,
    method: delivery.method,
  });
}
