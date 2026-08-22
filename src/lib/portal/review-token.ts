// ============================================================================
// SIGNED REVIEW TOKEN — lets the approval email's review link open
// /portal/review without a login. HMAC-SHA256 over "<userId>.<expiry>" with
// FORM_SIGNING_SECRET (fallback DATASHEET_SIGNING_SECRET), valid 7 days,
// constant-time compare. The token authorizes VIEWING and the POST actions on
// exactly one account — nothing else.
// ============================================================================
import { createHmac, timingSafeEqual } from 'crypto';

export const REVIEW_TOKEN_DAYS = 7;

function secret(): string {
  return process.env.FORM_SIGNING_SECRET || process.env.DATASHEET_SIGNING_SECRET || '';
}

export function isReviewTokenEnabled(): boolean {
  return Boolean(secret());
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

/** token = base64url("<userId>.<expiryMs>") + "." + hmac */
export function mintReviewToken(userId: string): string {
  const expiry = Date.now() + REVIEW_TOKEN_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(`${userId}.${expiry}`, 'utf8').toString('base64url');
  return `${payload}.${sign(payload)}`;
}

/** Returns the user id for a valid, unexpired token — null otherwise. */
export function checkReviewToken(token: unknown): string | null {
  if (!isReviewTokenEnabled()) return null;
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, mac] = token.split('.', 2);
  const expected = sign(payload);
  const a = Buffer.from(mac ?? '', 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const decoded = Buffer.from(payload, 'base64url').toString('utf8');
  const dot = decoded.lastIndexOf('.');
  if (dot < 1) return null;
  const userId = decoded.slice(0, dot);
  const expiry = Number(decoded.slice(dot + 1));
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;
  return userId || null;
}
