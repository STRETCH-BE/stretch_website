// CLIENT PORTAL — order products (or request a quote) straight from the
// pricelist. The client picks quantities in the pricelist cart; this route
// re-prices every line against the pricebook THE USER IS ALLOWED TO SEE
// (getPricebook → RLS-scoped), sends the branded internal + confirmation
// e-mails through the designer-order pipeline, and stores the order in
// designer_orders so it shows up under /portal/orders with a status.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { getPricebook } from '@/lib/portal/data';
import { storeOrder, logDesignerEvent } from '@/lib/portal/designer-store';
import { deliverOrderEmails, type OrderAttachment } from '@/lib/portal/order-email';
import { contact } from '@/lib/site-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_ITEMS = 60;
const MAX_QTY = 9999;
const MAX_NOTE = 2000;

type CartItem = { key?: unknown; qty?: unknown };

/** Stable row identity — matches the pricebook unique key. */
const rowKey = (r: { category: string; product: string; market: string; seq: number }) =>
  `${r.category}||${r.product}||${r.market}||${r.seq}`;

export async function POST(request: NextRequest) {
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!hasTradeAccess(session.profile))
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  let body: { intent?: unknown; items?: CartItem[]; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const intent = body.intent === 'quote' ? 'quote' : 'order';
  const note = typeof body.note === 'string' ? body.note.slice(0, MAX_NOTE).trim() : '';
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];
  const wanted = new Map<string, number>();
  for (const it of rawItems) {
    const key = typeof it?.key === 'string' ? it.key : '';
    const qty = Math.floor(Number(it?.qty));
    if (!key || !Number.isFinite(qty) || qty < 1) continue;
    wanted.set(key, Math.min(qty, MAX_QTY));
  }
  if (wanted.size === 0) {
    return NextResponse.json({ ok: false, error: 'empty' }, { status: 422 });
  }

  // Re-price server-side from the rows this account may see (RLS-scoped) —
  // client-sent prices are never trusted.
  const { rows } = await getPricebook(session);
  const byKey = new Map(rows.map((r) => [rowKey(r), r]));
  const lines: { code: string; label: string; qty: number; unit: string; amount: number }[] = [];
  for (const [key, qty] of wanted) {
    const row = byKey.get(key);
    if (!row) return NextResponse.json({ ok: false, error: 'unknown_item' }, { status: 422 });
    lines.push({
      code: row.code ?? '',
      label: `${row.product} · ${row.market}`,
      qty,
      unit: row.unit ?? 'pc',
      amount: Math.round(row.price_eur * qty * 100) / 100,
    });
  }
  const total = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const ref = `${intent === 'quote' ? 'QT' : 'PO'}-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;

  // Demo sessions: acknowledge but never store or e-mail.
  if (session.demo) {
    return NextResponse.json({ ok: true, demo: true, ref, intent, total, stored: false, delivered: false, confirmed: false });
  }

  const orderObject = {
    kind: 'pricelist',
    order: { ref, type: intent, note },
    dealer: { email: session.profile.email, company: session.profile.company },
    client: {},
    product: {},
    specification: { items: lines.map((l) => ({ ...l })) },
    quote: { lines, total },
    note,
  };

  const summaryText = [
    `${intent === 'quote' ? 'Quote request' : 'Product order'} ${ref} from ${session.profile.company || session.profile.email}`,
    '',
    ...lines.map((l) => `${l.qty} × ${l.label}${l.code ? ` [${l.code}]` : ''} — € ${l.amount.toFixed(2)}`),
    '',
    `Total (excl. VAT): € ${total.toFixed(2)}`,
    ...(note ? ['', `Note: ${note}`] : []),
  ].join('\n');

  const attachments: OrderAttachment[] = [
    { filename: `${ref}-order.json`, content: Buffer.from(JSON.stringify(orderObject, null, 1)) },
  ];

  const { internal, confirmation } = await deliverOrderEmails({
    ref,
    dealer: { email: session.profile.email, company: session.profile.company },
    order: orderObject as Record<string, any>,
    summaryText,
    attachments,
    fileLinks: [],
  });

  const storedId = await storeOrder(
    session.profile,
    {
      ref,
      client: { name: intent === 'quote' ? 'Pricelist — quote request' : 'Pricelist — order' },
      product: { kind: 'pricelist', intent },
      specification: { items: lines },
      quote: { lines, total },
      drawing: {},
      files: [],
    },
    { delivered: internal.delivered, method: internal.method },
  );

  console.info(
    `[pricelist-order] ${ref}: ${lines.length} lines, € ${total.toFixed(2)}; internal → ${contact.leadDestination} via ${internal.method}` +
      `${internal.delivered ? '' : ' (NOT delivered)'}; confirmation → ${session.profile.email} via ${confirmation.method}` +
      `${confirmation.delivered ? '' : ' (NOT delivered)'}; stored=${Boolean(storedId)}`,
  );

  void logDesignerEvent('pricelist_order', session.profile.email, false, {
    ref,
    intent,
    lines: lines.length,
    total,
    stored: Boolean(storedId),
    delivered: internal.delivered,
  });

  const ok = internal.delivered || Boolean(storedId);
  return NextResponse.json({
    ok,
    ref,
    intent,
    total,
    stored: Boolean(storedId),
    delivered: internal.delivered,
    confirmed: confirmation.delivered,
  });
}
