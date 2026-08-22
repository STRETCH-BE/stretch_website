// ============================================================================
// LEAD STORE — best-effort copy of every lead into Supabase (public.leads),
// next to the e-mail delivery. Uses the service-role client (RLS has no public
// policies on the table). NEVER blocks or fails a lead: without env vars, or
// on any insert error, it logs one line (no PII) and moves on — the e-mail
// path stays the source of truth for notification, the table for history.
// Table definition: supabase/schema.sql (public.leads).
// ============================================================================
import { createServiceClient } from '@/lib/portal/supabase';
import type { LeadPayload } from '@/lib/email';

const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);

/** Anti-spam metadata stored with each lead (columns added 22 Aug 2026).
 *  Flagged leads are stored but NOT delivered — never dropped silently. */
export type LeadSpamMeta = {
  score: number;
  reasons: string[];
  flagged: boolean;
  ip?: string | null;
  host?: string | null;
  userAgent?: string | null;
};

export async function storeLead(
  payload: LeadPayload,
  delivery: { delivered: boolean; method: string },
  page: string | null,
  spam?: LeadSpamMeta,
): Promise<void> {
  try {
    const db = createServiceClient();
    if (!db) return; // no Supabase env — silently skip (matches deliver.ts philosophy)
    const row: Record<string, unknown> = {
      source: str(payload.source) ?? 'unknown',
      name: str(payload.name),
      email: str(payload.email),
      phone: str(payload.phone),
      company: str(payload.company),
      message: str(payload.message),
      product: str(payload.product),
      colour: str(payload.colour),
      colour_code: str(payload.colourCode),
      items: str(payload.items),
      page,
      delivered: delivery.delivered,
      delivery_method: delivery.method,
      payload,
    };
    if (spam) {
      row.spam_score = spam.score;
      row.spam_reasons = spam.reasons;
      row.flagged = spam.flagged;
      row.ip = str(spam.ip);
      row.host = str(spam.host);
      row.user_agent = str(spam.userAgent);
    }
    let { error } = await db.from('leads').insert(row);
    if (error && spam) {
      // Un-migrated database (spam columns missing) — never lose the lead:
      // retry with the pre-existing shape.
      const legacy = { ...row };
      for (const k of ['spam_score', 'spam_reasons', 'flagged', 'ip', 'host', 'user_agent']) delete legacy[k];
      ({ error } = await db.from('leads').insert(legacy));
    }
    if (error) console.error(`[lead] db store failed: ${error.message}`);
  } catch (err) {
    console.error(`[lead] db store failed: ${err instanceof Error ? err.message : 'unknown'}`);
  }
}
