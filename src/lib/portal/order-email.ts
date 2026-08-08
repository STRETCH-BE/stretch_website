// ============================================================================
// CLIENT PORTAL — designer order e-mails (internal + dealer confirmation).
//
// Two branded HTML e-mails per order, built from the STRUCTURED order object
// (not the text blob): one to the STRETCH lead inbox, one confirmation to the
// dealer who placed it. Both carry the production documents (PDF/DXF, uploaded
// by the designer) and the machine-readable order JSON as attachments.
// Delivery uses the same graceful chain as leads: Microsoft Graph → webhook →
// SMTP → log-only. Layout matches buildLeadEmail (email.ts): 600 px table,
// black header, STRETCH red.
// ============================================================================
import { escapeHtml } from '@/lib/email';
import { brand, contact } from '@/lib/site-config';
import { isGraphMailConfigured, sendGraphMail } from '@/lib/msgraph-mail';

export type OrderAttachment = { filename: string; content: Buffer };
export type OrderFileLink = { filename: string; url: string };

export type OrderEmailInput = {
  ref: string;
  dealer: { email: string; company: string | null };
  /** The structured order object as posted by the designer. */
  order: Record<string, any>;
  /** Plain-text summary from the designer (text fallback). */
  summaryText: string;
  attachments: OrderAttachment[];
  /** Signed download links (Supabase Storage) — survive relays that strip attachments. */
  fileLinks?: OrderFileLink[];
};

export type OrderDelivery = { delivered: boolean; method: 'graph' | 'webhook' | 'smtp' | 'log' };

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
const F = 'Arial,Helvetica,sans-serif';
const BORDER = '#ECEAE6';
const MUTED = '#6E6B66';
const INK = '#0A0A0A';
const RED = '#FF0000';

function esc(v: unknown): string {
  return escapeHtml(v == null ? '' : String(v));
}
function n2(v: unknown): string {
  return typeof v === 'number' && isFinite(v) ? v.toFixed(2) : '—';
}
function specRows(order: Record<string, any>): [string, string][] {
  const s = order.specification || {};
  const p = order.product || {};
  const foil = [p.brand, p.finish, p.colourClass, p.color ? `(${p.color})` : '']
    .filter(Boolean)
    .join(' · ');
  const rows: [string, string][] = [
    ['Ceiling', order?.drawing?.name || '—'],
    ['Foil', foil || '—'],
    ['Foil width', p.width ? `${p.width} cm` : '—'],
    ['Area (net)', `${n2(s.ceilingAreaNetM2)} m²`],
    ['Foil needed', `${n2(s.foilNeededM2)} m²`],
    ['Strips / seams', `${s.strips ?? '—'} / ${s.seams ?? '—'}${typeof s.seamLengthM === 'number' ? ` (${n2(s.seamLengthM)} m)` : ''}`],
    ['Perimeter (harpoon)', `${n2(s.perimeterM)} m`],
    ['Cut-outs', `${s.cutouts ?? 0} (${n2(s.cutoutEdgesM)} m edges, ${s.cutoutCorners ?? 0} corners)`],
    ['Corners', String(s.corners ?? '—')],
    ['Production shrinkage', typeof s.shrinkPct === 'number' && s.shrinkPct > 0 ? `−${s.shrinkPct} %` : 'none'],
  ];
  return rows;
}
function quoteLines(order: Record<string, any>): { code: string; label: string; qty: string; amount: string }[] {
  const q = order.quote || {};
  const all = ([] as any[]).concat(q.lines || [], q.pctLines || [], q.fixedLines || []);
  return all
    .filter((l) => l && typeof l === 'object')
    .map((l) => ({
      code: String(l.code ?? ''),
      label: String(l.label ?? ''),
      qty: l.unit === '%' ? `${Number(l.qty).toFixed(1)} %` : `${n2(l.qty)} ${l.unit ?? ''}`,
      amount: `€ ${n2(l.amount)}`,
    }));
}

function kvTable(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-collapse:collapse;">${rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:9px 14px;border-bottom:1px solid ${BORDER};font:600 11px ${F};letter-spacing:.05em;text-transform:uppercase;color:${MUTED};white-space:nowrap;vertical-align:top;width:44%;">${esc(k)}</td>
        <td style="padding:9px 14px;border-bottom:1px solid ${BORDER};font:400 14px ${F};color:${INK};">${esc(v)}</td>
      </tr>`,
    )
    .join('')}</table>`;
}

function sectionTitle(label: string): string {
  return `<div style="font:700 11px ${F};letter-spacing:.16em;text-transform:uppercase;color:${RED};margin:26px 0 10px;">${esc(label)}</div>`;
}

export function buildOrderEmailHtml(
  input: OrderEmailInput,
  audience: 'internal' | 'confirmation',
): { subject: string; html: string; text: string } {
  const { ref, dealer, order } = input;
  const client = (order.client || {}) as Record<string, unknown>;
  const clientName = typeof client.name === 'string' && client.name ? client.name : '';
  const total = order?.quote?.total;
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const subject =
    audience === 'internal'
      ? `Ceiling order ${ref}${clientName ? ` — ${clientName}` : ''} (${dealer.company || dealer.email})`
      : `Your STRETCH order ${ref} — received`;

  const intro =
    audience === 'internal'
      ? `A new ceiling order was placed in the client portal by <b>${esc(dealer.company || dealer.email)}</b>.`
      : `Thank you — we received your ceiling order and it is now with our production team. You will hear from us shortly to confirm production and delivery. Your order also appears under <b>Orders</b> in the client portal.`;

  const priceRows = quoteLines(order)
    .map(
      (l) => `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};font:700 11px ${F};color:${MUTED};white-space:nowrap;">${esc(l.code)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};font:400 13.5px ${F};color:${INK};">${esc(l.label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};font:400 13px ${F};color:${MUTED};white-space:nowrap;text-align:right;">${esc(l.qty)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};font:600 13.5px ${F};color:${INK};white-space:nowrap;text-align:right;">${esc(l.amount)}</td>
      </tr>`,
    )
    .join('');

  const links = input.fileLinks ?? [];
  const linkFor = (filename: string) => links.find((l) => l.filename === filename);
  const attachmentList = input.attachments
    .map((a) => {
      const link = linkFor(a.filename);
      const label = link
        ? `<a href="${esc(link.url)}" style="color:${INK};">${esc(a.filename)}</a> — <a href="${esc(link.url)}" style="color:${RED};font-weight:700;text-decoration:none;">download</a>`
        : esc(a.filename);
      return `<li style="font:400 13px ${F};color:${INK};margin:3px 0;">${label}</li>`;
    })
    .join('');
  const linksNote = links.length
    ? `<p style="font:400 12px ${F};color:${MUTED};margin:8px 0 0;">Download links stay valid for 30 days. The same files are attached to this e-mail where supported.</p>`
    : '';

  const clientRows: [string, string][] = [
    ['Name', String(client.name || '—')],
    ['E-mail', String(client.email || '—')],
    ['Phone', String(client.phone || '—')],
    ['Address', String(client.address || '—')],
  ];
  const dealerRows: [string, string][] = [
    ['Company', dealer.company || '—'],
    ['E-mail', dealer.email],
  ];

  const html = `<!doctype html>
<html><body style="margin:0;background:#F4F3F1;padding:24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid ${BORDER};">
    <tr><td style="background:${INK};padding:22px 26px;">
      <span style="font:900 22px ${F};letter-spacing:-.02em;color:#fff;">${esc(brand.name)}</span><span style="color:${RED};font:900 14px ${F};">&reg;</span>
      <div style="font:600 11px ${F};letter-spacing:.18em;text-transform:uppercase;color:${RED};margin-top:6px;">${
        audience === 'internal' ? 'New ceiling order' : 'Order confirmation'
      }</div>
    </td></tr>
    <tr><td style="padding:26px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font:900 24px ${F};letter-spacing:-.01em;color:${INK};">${esc(ref)}</td>
        <td style="text-align:right;font:400 13px ${F};color:${MUTED};">${esc(date)}</td>
      </tr></table>
      <p style="font:400 14.5px ${F};line-height:1.6;color:#54514B;margin:14px 0 0;">${intro}</p>

      ${sectionTitle(audience === 'internal' ? 'Dealer' : 'Your account')}
      ${kvTable(dealerRows)}

      ${sectionTitle('Client')}
      ${kvTable(clientRows)}

      ${sectionTitle('Ceiling specification')}
      ${kvTable(specRows(order))}

      ${sectionTitle('Price')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-collapse:collapse;">
        ${priceRows}
        <tr>
          <td colspan="3" style="padding:11px 12px;font:800 13px ${F};letter-spacing:.06em;text-transform:uppercase;color:${INK};background:#FAF9F7;">Total (excl. VAT)</td>
          <td style="padding:11px 12px;font:900 16px ${F};color:${INK};background:#FAF9F7;white-space:nowrap;text-align:right;">€ ${n2(total)}</td>
        </tr>
      </table>

      ${sectionTitle('Documents')}
      <ul style="margin:0;padding-left:18px;">${attachmentList || `<li style="font:400 13px ${F};color:${MUTED};">See the dealer's order ZIP</li>`}</ul>
      ${linksNote}

      <p style="font:400 12px ${F};color:#9A968F;margin:26px 0 0;">${
        audience === 'internal'
          ? `Placed via the ${esc(brand.name)} client portal · reply goes to the dealer.`
          : `Questions about this order? Simply reply to this e-mail.`
      }</p>
    </td></tr>
  </table>
</body></html>`;

  const text =
    (audience === 'internal'
      ? `New ceiling order ${ref} from ${dealer.company || dealer.email}\n\n`
      : `Thank you — we received your ceiling order ${ref}.\nOur production team will confirm shortly. You can follow it under Orders in the client portal.\n\n`) +
    input.summaryText;

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Delivery chain (shared by both e-mails)
// ---------------------------------------------------------------------------
function logIssue(method: string, err: unknown) {
  console.error(`[designer-order] ${method} delivery failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

async function send(msg: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  attachments: OrderAttachment[];
  webhookExtra?: Record<string, unknown>;
  /**
   * The generic lead webhook typically relays to a FIXED inbox and ignores
   * `to` — fine for the internal order e-mail, wrong for the dealer
   * confirmation (it would land at the lead inbox as a duplicate). When set,
   * the webhook step is skipped and only recipient-faithful transports
   * (Graph / SMTP) are used.
   */
  recipientCritical?: boolean;
}): Promise<OrderDelivery> {
  const from =
    process.env.LEAD_FROM_EMAIL ||
    `STRETCH Website <website@${contact.email.split('@')[1] || 'stretchplafonds.be'}>`;

  // 0) Microsoft 365 (Graph) — the company's own mailbox, preferred ---------
  if (isGraphMailConfigured()) {
    try {
      await sendGraphMail({
        to: msg.to,
        replyTo: msg.replyTo,
        subject: msg.subject,
        html: msg.html,
        attachments: msg.attachments,
      });
      return { delivered: true, method: 'graph' };
    } catch (err) {
      logIssue('graph', err);
    }
  }

  if (process.env.LEAD_WEBHOOK_URL && !msg.recipientCritical) {
    try {
      const res = await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: msg.subject,
          body: msg.html,
          text: msg.text,
          isHtml: true,
          to: msg.to,
          attachments: msg.attachments.map((a) => ({ filename: a.filename, contentBase64: a.content.toString('base64') })),
          ...(msg.webhookExtra || {}),
        }),
      });
      if (!res.ok) throw new Error(`webhook responded ${res.status}`);
      return { delivered: true, method: 'webhook' };
    } catch (err) {
      logIssue('webhook', err);
    }
  }

  if (process.env.SMTP_HOST) {
    try {
      const nodemailer = await import('nodemailer');
      const port = Number(process.env.SMTP_PORT || 587);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      });
      await transport.sendMail({
        from: process.env.SMTP_FROM || from,
        to: msg.to,
        replyTo: msg.replyTo,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        attachments: msg.attachments.map((a) => ({ filename: a.filename, content: a.content })),
      });
      return { delivered: true, method: 'smtp' };
    } catch (err) {
      logIssue('smtp', err);
    }
  }

  console.info(`[designer-order] "${msg.subject}" → ${msg.to} (no delivery method configured)`);
  return { delivered: false, method: 'log' };
}

/** Send the internal order e-mail + the dealer confirmation. */
export async function deliverOrderEmails(
  input: OrderEmailInput,
): Promise<{ internal: OrderDelivery; confirmation: OrderDelivery }> {
  const internalMsg = buildOrderEmailHtml(input, 'internal');
  const internal = await send({
    to: contact.leadDestination,
    replyTo: input.dealer.email || undefined,
    subject: internalMsg.subject,
    html: internalMsg.html,
    text: internalMsg.text,
    attachments: input.attachments,
    webhookExtra: { order: input.order },
  });

  let confirmation: OrderDelivery = { delivered: false, method: 'log' };
  if (input.dealer.email) {
    const confirmMsg = buildOrderEmailHtml(input, 'confirmation');
    confirmation = await send({
      to: input.dealer.email,
      replyTo: contact.leadDestination,
      subject: confirmMsg.subject,
      html: confirmMsg.html,
      text: confirmMsg.text,
      attachments: input.attachments,
      recipientCritical: true,
    });
  }
  return { internal, confirmation };
}
