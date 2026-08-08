// CLIENT PORTAL — receive a ceiling order from the designer.
// Stores the order in designer_orders (best-effort) and sends TWO branded
// e-mails from the server: the order (with production documents attached) to
// the STRETCH lead inbox, and a confirmation to the dealer who placed it.
// The designer keeps a mailto fallback for when this route can't be reached.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { storeOrder, logDesignerEvent } from '@/lib/portal/designer-store';
import { deliverOrderEmails, type OrderAttachment } from '@/lib/portal/order-email';

export const dynamic = 'force-dynamic';

// Vercel route handlers cap request bodies around 4.5 MB — stay under it.
const MAX_ORDER_BYTES = 4_000_000;
const MAX_FILES = 8;
const MAX_FILE_BYTES = 1_500_000;
const MAX_TOTAL_FILE_BYTES = 3_000_000;

type OrderBody = {
  order?: { ref?: unknown };
  client?: Record<string, unknown>;
  product?: unknown;
  specification?: unknown;
  quote?: unknown;
  drawing?: unknown;
  summaryText?: unknown;
  files?: { name?: unknown; dataB64?: unknown }[];
};

function safeName(name: unknown): string | null {
  if (typeof name !== 'string') return null;
  const clean = name.replace(/[^\w. ()\-]/g, '').trim();
  return clean && clean.length <= 80 ? clean : null;
}

function parseFiles(body: OrderBody): OrderAttachment[] {
  if (!Array.isArray(body.files)) return [];
  const out: OrderAttachment[] = [];
  let total = 0;
  for (const f of body.files.slice(0, MAX_FILES)) {
    const name = safeName(f?.name);
    if (!name || typeof f.dataB64 !== 'string') continue;
    let buf: Buffer;
    try {
      buf = Buffer.from(f.dataB64, 'base64');
    } catch {
      continue;
    }
    if (!buf.length || buf.length > MAX_FILE_BYTES) continue;
    total += buf.length;
    if (total > MAX_TOTAL_FILE_BYTES) break;
    out.push({ filename: name, content: buf });
  }
  return out;
}

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
    return NextResponse.json({ ok: true, demo: true, ref, stored: false, delivered: false, confirmed: false });
  }

  const summaryText =
    typeof body.summaryText === 'string' ? body.summaryText.slice(0, 20_000) : `Order ${ref}`;

  const orderObject = {
    order: body.order,
    dealer: { email: session.profile.email, company: session.profile.company },
    client: body.client ?? {},
    product: body.product ?? {},
    specification: body.specification ?? {},
    quote: body.quote ?? {},
    drawing: body.drawing ?? {},
  };

  // Attachments: the documents uploaded by the designer + the order JSON,
  // which the server generates itself (so it is always present and trusted).
  const attachments = parseFiles(body);
  attachments.push({
    filename: `${ref}-order.json`,
    content: Buffer.from(JSON.stringify(orderObject, null, 1)),
  });

  const { internal, confirmation } = await deliverOrderEmails({
    ref,
    dealer: { email: session.profile.email, company: session.profile.company },
    order: orderObject as Record<string, any>,
    summaryText,
    attachments,
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
    { delivered: internal.delivered, method: internal.method },
  );

  void logDesignerEvent('order_placed', session.profile.email, false, {
    ref,
    stored: Boolean(storedId),
    delivered: internal.delivered,
    method: internal.method,
    confirmed: confirmation.delivered,
    attachments: attachments.length,
  });

  // ok when the order reached at least one durable place (inbox or database).
  const ok = internal.delivered || Boolean(storedId);
  return NextResponse.json({
    ok,
    ref,
    stored: Boolean(storedId),
    delivered: internal.delivered,
    method: internal.method,
    confirmed: confirmation.delivered,
  });
}
