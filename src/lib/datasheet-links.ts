// ============================================================================
// DATASHEET LINKS — signed, expiring download URLs for the gated datasheets.
//
// The PDFs live in repo-root datasheets-private/ (NOT under public/), so the
// only way to fetch one is GET /api/datasheet/[slug]?t=<token> with a valid
// token. Tokens are HMAC-SHA256 over `${slug}.${exp}` (exp = unix seconds,
// 14 days out), base64url-encoded as `${exp}.${sig}` — stateless, no database.
//
// Env: DATASHEET_SIGNING_SECRET — any long random string. Without it (local
// dev) an obviously-dev fallback is derived and a single warning is logged;
// production links MUST set the real secret or they break on every deploy.
// ============================================================================
import { createHmac, timingSafeEqual } from 'node:crypto';

export const DATASHEET_LINK_DAYS = 14;

let warned = false;

function secret(): string {
  const s = process.env.DATASHEET_SIGNING_SECRET;
  if (s) return s;
  if (!warned) {
    warned = true;
    console.warn(
      '[datasheet] DATASHEET_SIGNING_SECRET is not set — using an insecure dev fallback. Set it in production.',
    );
  }
  return 'dev-only-datasheet-secret-do-not-use-in-production';
}

function sign(slug: string, exp: number): string {
  return createHmac('sha256', secret()).update(`${slug}.${exp}`).digest('base64url');
}

/** Token accepted by /api/datasheet/[slug]: `${exp}.${hmac}`. */
export function createDatasheetToken(slug: string): string {
  const exp = Math.floor(Date.now() / 1000) + DATASHEET_LINK_DAYS * 24 * 60 * 60;
  return `${exp}.${sign(slug, exp)}`;
}

/** Absolute-path signed URL for a datasheet download (relative to the origin). */
export function createDatasheetLink(slug: string, locale: string): string {
  const token = createDatasheetToken(slug);
  return `/api/datasheet/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}&l=${encodeURIComponent(locale)}`;
}

/** Constant-time verification. False on malformed, tampered or expired tokens. */
export function verifyDatasheetToken(slug: string, token: string): boolean {
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const exp = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isInteger(exp) || exp <= 0 || !sig) return false;

  const expected = sign(slug, exp);
  // Early length check — timingSafeEqual throws on length mismatch.
  if (sig.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  return exp > Math.floor(Date.now() / 1000);
}
