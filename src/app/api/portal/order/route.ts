// /api/portal/order — place a configurator order.
//
// NO payment integration: this stores the order, sends two e-mails and
// confirms. The proforma invoice follows from us manually.
//
// Installers and admins only — enforced HERE, not just on the page. The body
// carries a CONFIGURATION; the server rebuilds the bill of materials, re-runs
// the foil choice and re-prices everything from the live pricebook, so a body
// carrying its own prices or its own foil changes nothing.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasConfiguratorAccess } from '@/lib/portal/types';
import { isPortalAllowedHost } from '@/lib/portal/host';
import { rateLimit } from '@/lib/rate-limit';
import { parseConfig } from '@/lib/portal/configurator/parse-config';
import { quoteFor } from '@/lib/portal/configurator/pricing';
import { buildCustomerEmail, buildInternalEmail } from '@/lib/portal/configurator/order-mail';
import { findByIdempotencyKey, nextReference, storeOrder } from '@/lib/portal/configurator/order-store';
import { sendTransactionalEmail } from '@/lib/transactional';
import { contact } from '@/lib/site-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 20_000;
const ORDERS_PER_HOUR = 10;

function notifyEmail(): string {
  return process.env.ORDER_NOTIFY_EMAIL || 'order@stretchgroup.be';
}

export async function POST(request: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  // Not a public form: anonymous and non-installer requests are refused here,
  // independently of the page guard.
  const session = await getPortalSession();
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  if (!hasConfiguratorAccess(session.profile))
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const idempotencyKey =
    typeof body.idempotencyKey === 'string' && /^[\w-]{8,80}$/.test(body.idempotencyKey)
      ? body.idempotencyKey
      : null;

  // A repeated key returns the ORIGINAL order instead of creating a second one.
  if (idempotencyKey && !session.demo) {
    const existing = await findByIdempotencyKey(idempotencyKey);
    if (existing) {
      return NextResponse.json({
        ok: true,
        reference: existing.reference,
        duplicate: true,
        stored: true,
        confirmed: true,
        needsManualPricing: existing.needs_manual_pricing,
        unpricedCount: 0,
      });
    }
  }

  const parsed = parseConfig(body.config ?? body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });

  // Contact fields may travel at the top level of the order body too.
  const meta = {
    reference: parsed.meta.reference ?? (typeof body.reference === 'string' ? body.reference.slice(0, 120) : null),
    projectRef: parsed.meta.projectRef ?? (typeof body.projectRef === 'string' ? body.projectRef.slice(0, 120) : null),
    deliveryAddress:
      parsed.meta.deliveryAddress ?? (typeof body.deliveryAddress === 'string' ? body.deliveryAddress.slice(0, 400) : null),
    note: parsed.meta.note ?? (typeof body.note === 'string' ? body.note.slice(0, 400) : null),
  };

  const requestedMarket = typeof body.market === 'string' ? body.market : null;
  const result = await quoteFor(session, parsed.config, requestedMarket);
  if ('error' in result) return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  const { quote } = result;

  if (quote.incomplete || quote.lines.length === 0) {
    return NextResponse.json({ ok: false, error: 'incomplete_configuration' }, { status: 400 });
  }

  // Demo sessions: acknowledge, never store or e-mail.
  if (session.demo) {
    return NextResponse.json({ ok: true, demo: true, reference: 'STR-DEMO-0001', stored: false, confirmed: false });
  }

  // Best-effort per-account throttle (same helper as the datasheet route).
  const allowed = await rateLimit(`configurator-order:${session.profile.email}`, ORDERS_PER_HOUR, 3600);
  if (!allowed) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });

  const reference = await nextReference();
  const mailInput = {
    reference,
    quote,
    config: parsed.config,
    account: { email: session.profile.email, company: session.profile.company },
    meta,
  };

  // Store FIRST: a mail failure must never lose the order.
  const order = await storeOrder({
    reference,
    profile: session.profile,
    quote,
    config: parsed.config,
    meta,
    idempotencyKey,
  });

  const internal = buildInternalEmail(mailInput);
  const customer = buildCustomerEmail(mailInput);
  const [internalRes, customerRes] = await Promise.all([
    sendTransactionalEmail({ to: notifyEmail(), subject: internal.subject, html: internal.html, text: internal.text }),
    sendTransactionalEmail({
      to: session.profile.email,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    }),
  ]);

  // One always-on delivery line — diagnosable from the Vercel logs, no PII.
  console.info(
    `[configurator-order] ${reference}: internal → ${notifyEmail()} via ${internalRes.method}` +
      `${internalRes.ok ? '' : ' (NOT delivered)'}; confirmation via ${customerRes.method}` +
      `${customerRes.ok ? '' : ' (NOT delivered)'}; stored=${Boolean(order)}; market=${quote.market}; ` +
      `lines=${quote.lines.length}; unpriced=${quote.unpricedCount}; leadInbox=${contact.leadDestination}`,
  );

  return NextResponse.json({
    ok: Boolean(order) || internalRes.ok,
    reference,
    stored: Boolean(order),
    // The UI says "the confirmation is on its way" only when it really is.
    confirmed: customerRes.ok,
    needsManualPricing: quote.needsManualPricing,
    unpricedCount: quote.unpricedCount,
  });
}
