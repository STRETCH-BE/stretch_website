// ============================================================================
// LEAD DELIVERY — graceful, zero-config multi-method send.
// Tries, in order: Microsoft 365 Graph (MS_* vars) → generic webhook
// (LEAD_WEBHOOK_URL) → SMTP/Nodemailer (SMTP_HOST) → log-only. The site works
// with no env vars at all (log-only), so it never hard-fails. PII is never
// logged — only the lead source, the destination and the submitter's email
// domain.
// ============================================================================
import { buildLeadEmail, type LeadPayload } from '@/lib/email';
import { contact, swissPartner } from '@/lib/site-config';
import { isGraphMailConfigured, sendGraphMail } from '@/lib/msgraph-mail';
import { localeDomains } from '@/i18n/config';
import { swissPlaceSlugs } from '@/lib/dealers';

export type DeliveryResult = { ok: true; method: 'graph' | 'webhook' | 'smtp' | 'log'; to: string; cc: string[] };

// ---------------------------------------------------------------------------
// SWISS LEADS (2 Sep 2026): the purpose of stretchdecken.ch is to generate
// leads for QuinLay AG, the general representative for Switzerland &
// Liechtenstein. A lead is Swiss when it was submitted on the ch domain OR its
// source names a Swiss place / Swiss-only funnel — the place list is derived
// from src/lib/dealers.ts (region switzerland), never hard-coded here. Swiss
// leads go TO QuinLay (QUINLAY_LEAD_EMAIL, default office@quinlay.ch) with the
// normal STRETCH destination in CC; everything else is unchanged.
// ---------------------------------------------------------------------------
const SWISS_SOURCES = new Set<string>([
  ...swissPlaceSlugs.map((slug) => `dealers_${slug}`),
  'training_ch',
  'price_guide_ch',
]);

function normalizeHost(host: string | null | undefined): string {
  return (host ?? '').toLowerCase().split(':')[0].replace(/^www\./, '');
}

export function isSwissLead(payload: LeadPayload, host?: string | null): boolean {
  if (normalizeHost(host) === localeDomains.ch.toLowerCase()) return true;
  const source = typeof payload.source === 'string' ? payload.source : '';
  return SWISS_SOURCES.has(source);
}

/** Recipients for a lead: QuinLay (+ STRETCH in CC) for Swiss leads, else STRETCH. */
export function leadRecipients(payload: LeadPayload, host?: string | null): { to: string; cc: string[]; market: 'CH' | null } {
  if (isSwissLead(payload, host)) {
    const to = process.env.QUINLAY_LEAD_EMAIL || swissPartner.email;
    const cc = contact.leadDestination && contact.leadDestination !== to ? [contact.leadDestination] : [];
    return { to, cc, market: 'CH' };
  }
  return { to: contact.leadDestination, cc: [], market: null };
}

function emailDomain(payload: LeadPayload): string {
  const e = typeof payload.email === 'string' ? payload.email : '';
  const at = e.lastIndexOf('@');
  return at > -1 ? e.slice(at + 1) : 'n/a';
}

function logIssue(method: string, err: unknown) {
  // Log the failure WITHOUT any submitted personal data.
  console.error(`[lead] ${method} delivery failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

export async function deliverLead(payload: LeadPayload, opts: { host?: string | null } = {}): Promise<DeliveryResult> {
  const built = buildLeadEmail(payload);
  const { to, cc } = leadRecipients(payload, opts.host);
  const from =
    process.env.LEAD_FROM_EMAIL ||
    `STRETCH Website <website@${contact.email.split('@')[1] || 'stretchplafond.be'}>`;
  const replyTo = typeof payload.email === 'string' && payload.email ? payload.email : undefined;

  // 0) Microsoft 365 (Graph) — the company's own mailbox, preferred ---------
  if (isGraphMailConfigured()) {
    try {
      await sendGraphMail({ to, cc, replyTo, subject: built.subject, html: built.html });
      return { ok: true, method: 'graph', to, cc };
    } catch (err) {
      logIssue('graph', err);
    }
  }

  // 1) Generic webhook ------------------------------------------------------
  if (process.env.LEAD_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: built.subject,
          body: built.html,
          text: built.text,
          isHtml: true,
          to,
          cc,
          meta: payload,
        }),
      });
      if (!res.ok) throw new Error(`webhook responded ${res.status}`);
      return { ok: true, method: 'webhook', to, cc };
    } catch (err) {
      logIssue('webhook', err);
    }
  }

  // 2) SMTP via Nodemailer --------------------------------------------------
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
        cc: cc.length ? cc : undefined,
        replyTo,
        subject: built.subject,
        html: built.html,
        text: built.text,
      });
      return { ok: true, method: 'smtp', to, cc };
    } catch (err) {
      logIssue('smtp', err);
    }
  }

  // 3) Log-only -------------------------------------------------------------
  console.info(
    `[lead] received "${String(payload.source)}" → ${to}${cc.length ? ` (cc ${cc.join(', ')})` : ''} (no delivery method configured; submitter domain: ${emailDomain(payload)})`,
  );
  return { ok: true, method: 'log', to, cc };
}
