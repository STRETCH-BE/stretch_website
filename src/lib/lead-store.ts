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

export async function storeLead(
  payload: LeadPayload,
  delivery: { delivered: boolean; method: string },
  page: string | null,
): Promise<void> {
  try {
    const db = createServiceClient();
    if (!db) return; // no Supabase env — silently skip (matches deliver.ts philosophy)
    const { error } = await db.from('leads').insert({
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
    });
    if (error) console.error(`[lead] db store failed: ${error.message}`);
  } catch (err) {
    console.error(`[lead] db store failed: ${err instanceof Error ? err.message : 'unknown'}`);
  }
}
