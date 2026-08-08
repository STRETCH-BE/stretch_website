// ============================================================================
// CLIENT PORTAL — designer order e-mail delivery.
//
// Same graceful multi-method chain as lead delivery (deliver.ts):
// Resend → webhook → SMTP → log-only. Unlike leads, an order carries the full
// order JSON as an attachment (Resend / SMTP) or inline (webhook), so the
// production team always receives the machine-readable file — no more relying
// on the dealer's own mail client and manual attachments.
// ============================================================================
import { escapeHtml } from '@/lib/email';
import { contact } from '@/lib/site-config';

export type OrderEmailInput = {
  ref: string;
  dealer: { email: string; company: string | null };
  client: Record<string, unknown>;
  summaryText: string;
  orderJson: string;
};

export type OrderDelivery = { delivered: boolean; method: 'resend' | 'webhook' | 'smtp' | 'log' };

function logIssue(method: string, err: unknown) {
  console.error(`[designer-order] ${method} delivery failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

function buildBodies(input: OrderEmailInput): { subject: string; text: string; html: string } {
  const clientName = typeof input.client?.name === 'string' && input.client.name ? ` — ${input.client.name}` : '';
  const subject = `Ceiling order ${input.ref}${clientName} (${input.dealer.company || input.dealer.email})`;
  const text = [
    `Ceiling order ${input.ref}`,
    `Dealer: ${input.dealer.company || '-'} <${input.dealer.email}>`,
    '',
    input.summaryText,
    '',
    'The machine-readable order file is attached (order.json).',
  ].join('\n');
  const html = [
    `<h2 style="margin:0 0 12px">Ceiling order ${escapeHtml(input.ref)}</h2>`,
    `<p style="margin:0 0 16px"><b>Dealer:</b> ${escapeHtml(input.dealer.company || '-')} &lt;${escapeHtml(input.dealer.email)}&gt;</p>`,
    `<pre style="font:13px/1.5 ui-monospace,Menlo,monospace;background:#f6f8fa;padding:14px;border-radius:6px;white-space:pre-wrap">${escapeHtml(input.summaryText)}</pre>`,
    `<p style="color:#555">The machine-readable order file is attached (order.json).</p>`,
  ].join('\n');
  return { subject, text, html };
}

export async function deliverOrderEmail(input: OrderEmailInput): Promise<OrderDelivery> {
  const { subject, text, html } = buildBodies(input);
  const to = contact.leadDestination;
  const from =
    process.env.LEAD_FROM_EMAIL ||
    `STRETCH Website <website@${contact.email.split('@')[1] || 'stretchplafond.be'}>`;
  const replyTo = input.dealer.email || undefined;
  const attachment = { filename: `${input.ref}-order.json`, content: input.orderJson };

  // 1) Resend ---------------------------------------------------------------
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from,
        to,
        reply_to: replyTo,
        subject,
        html,
        text,
        attachments: [{ filename: attachment.filename, content: Buffer.from(attachment.content).toString('base64') }],
      });
      return { delivered: true, method: 'resend' };
    } catch (err) {
      logIssue('resend', err);
    }
  }

  // 2) Generic webhook ------------------------------------------------------
  if (process.env.LEAD_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body: html, text, isHtml: true, to, order: JSON.parse(input.orderJson) }),
      });
      if (!res.ok) throw new Error(`webhook responded ${res.status}`);
      return { delivered: true, method: 'webhook' };
    } catch (err) {
      logIssue('webhook', err);
    }
  }

  // 3) SMTP via Nodemailer --------------------------------------------------
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
        to,
        replyTo,
        subject,
        html,
        text,
        attachments: [attachment],
      });
      return { delivered: true, method: 'smtp' };
    } catch (err) {
      logIssue('smtp', err);
    }
  }

  // 4) Log-only -------------------------------------------------------------
  console.info(`[designer-order] order ${input.ref} received (no delivery method configured)`);
  return { delivered: false, method: 'log' };
}
