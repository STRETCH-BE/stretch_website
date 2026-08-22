// ============================================================================
// SERVERLESS-SAFE RATE LIMITING — Postgres via the existing service client
// (no new vendor). The counter lives in public.rate_limits, incremented by
// the SECURITY DEFINER function public.rate_limit_hit (supabase/schema.sql).
//
// FAIL-OPEN by design: Supabase not configured → allow; RPC error → allow +
// one console.warn. We never lose a real lead to our own limiter — hard
// stopping is the edge firewall's job (Vercel rules), this layer handles the
// polite 429s.
// ============================================================================
import { createServiceClient } from '@/lib/portal/supabase';

/**
 * Count a hit against `key`. Returns true when the request is ALLOWED,
 * false when the limit for the window would be exceeded.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    const db = createServiceClient();
    if (!db) return true; // zero-config → no-op
    const { data, error } = await db.rpc('rate_limit_hit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.warn(`[rate-limit] rpc failed for ${key.split(':')[0]}: ${error.message}`);
      return true; // fail-open
    }
    return data !== false;
  } catch (err) {
    console.warn(`[rate-limit] unexpected error: ${err instanceof Error ? err.message : 'unknown'}`);
    return true;
  }
}

/** Client IP: first x-forwarded-for entry → x-real-ip → 'unknown'. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0].trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}
