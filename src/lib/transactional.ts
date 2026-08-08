// ============================================================================
// TRANSACTIONAL EMAIL — send TO a visitor (datasheet delivery, confirmations),
// as opposed to deliver.ts which notifies OUR lead inbox. Reuses the exact
// same provider chain and env vars: Microsoft 365 Graph (MS_* vars) → generic
// webhook (LEAD_WEBHOOK_URL, same payload shape — `to` is the visitor here) →
// SMTP/Nodemailer (SMTP_HOST). No provider configured → { ok: false }, and the
// caller decides on a fallback. The recipient's address is never logged —
// domain only, matching deliver.ts.
// ============================================================================
import { contact } from '@/lib/site-config';
import { isGraphMailConfigured, sendGraphMail } from '@/lib/msgraph-mail';

export type TransactionalResult =
  | { ok: true; method: 'graph' | 'webhook' | 'smtp' }
  | { ok: false; method: 'none' };

/** True when at least one provider that can email a visitor is configured. */
export function isTransactionalConfigured(): boolean {
  return Boolean(isGraphMailConfigured() || process.env.LEAD_WEBHOOK_URL || process.env.SMTP_HOST);
}

function domainOf(email: string): string {
  const at = email.lastIndexOf('@');
  return at > -1 ? email.slice(at + 1) : 'n/a';
}

function logIssue(method: string, err: unknown) {
  // Log the failure WITHOUT the recipient's address.
  console.error(`[transactional] ${method} send failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

export async function sendTransactionalEmail(msg: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<TransactionalResult> {
  const from =
    process.env.LEAD_FROM_EMAIL ||
    `STRETCH <website@${contact.email.split('@')[1] || 'stretchplafond.be'}>`;

  // 0) Microsoft 365 (Graph) -------------------------------------------------
  if (isGraphMailConfigured()) {
    try {
      await sendGraphMail({ to: msg.to, subject: msg.subject, html: msg.html });
      return { ok: true, method: 'graph' };
    } catch (err) {
      logIssue('graph', err);
    }
  }

  // 1) Generic webhook -------------------------------------------------------
  if (process.env.LEAD_WEBHOOK_URL) {
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
        }),
      });
      if (!res.ok) throw new Error(`webhook responded ${res.status}`);
      return { ok: true, method: 'webhook' };
    } catch (err) {
      logIssue('webhook', err);
    }
  }

  // 2) SMTP via Nodemailer ---------------------------------------------------
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
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      return { ok: true, method: 'smtp' };
    } catch (err) {
      logIssue('smtp', err);
    }
  }

  console.info(`[transactional] no provider available (recipient domain: ${domainOf(msg.to)})`);
  return { ok: false, method: 'none' };
}
