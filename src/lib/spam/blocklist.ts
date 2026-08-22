// ============================================================================
// BLOCKED SENDERS — admin-curated blocklist (public.blocked_senders):
//   kind 'email'  → matched against the CANONICAL form of the sender address;
//   kind 'domain' → matched against the email domain.
// Signups from a hit are refused; leads from a hit are stored flagged and
// never delivered. Fail-open: no Supabase / missing table / query error →
// not blocked (the scoring layers still apply).
// ============================================================================
import { createServiceClient } from '@/lib/portal/supabase';
import { canonicalEmail, emailDomain } from './email';

export async function isBlockedSender(email: string): Promise<boolean> {
  if (!email) return false;
  try {
    const db = createServiceClient();
    if (!db) return false;
    const canonical = canonicalEmail(email);
    const domain = emailDomain(email);
    const { data, error } = await db
      .from('blocked_senders')
      .select('kind, value')
      .in('value', [canonical, domain])
      .limit(10);
    if (error || !data) return false; // un-migrated database → feature off
    return data.some(
      (r) => (r.kind === 'email' && r.value === canonical) || (r.kind === 'domain' && r.value === domain),
    );
  } catch {
    return false;
  }
}
