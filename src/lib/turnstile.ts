// ============================================================================
// CLOUDFLARE TURNSTILE — sitekey/secret resolution + server-side verification.
//
// TWO WIDGET GROUPS: the free Turnstile plan allows 10 hostnames per widget,
// and pages render on more hosts than that (13 locale domains + the Vercel
// preview + localhost). Every hostname sits in exactly ONE group — the two
// lists below MUST match the hostnames configured on the two widgets in the
// Cloudflare dashboard (see docs/ANTI-SPAM.md). Group A contains the
// canonical portal host (stretch.mt); if only the A keys are set, every host
// uses A.
//
// TWO TOKEN FLOWS — do not mix them up:
//   • LEAD routes (/api/lead, /api/contact, /api/datasheet-request) verify
//     the token here via verifyTurnstile().
//   • AUTH routes (portal signup/login) do NOT call siteverify — Turnstile
//     tokens are single-use and Supabase verifies them itself via
//     options.captchaToken once "CAPTCHA protection" is enabled in the
//     dashboard. Service-role admin calls (createUser, generateLink) are
//     exempt and need no token.
//
// ZERO-CONFIG RULE: with no TURNSTILE env vars set, isTurnstileEnabled() is
// false, no widget renders and no verification happens — the site behaves
// exactly as before.
//
// This module is imported by BOTH the client widget (sitekey helpers only —
// NEXT_PUBLIC vars are inlined at build) and server routes (secrets are read
// lazily inside the server-only functions, so they never reach a bundle).
// ============================================================================

/** Widget group A — canonical portal host first, then preview, localhost and
 *  the first locale domains in i18n config order, exactly 10 hostnames. */
export const TURNSTILE_HOSTS_A = [
  'stretch.mt', // canonical portal host + en
  'stretch-website-seven.vercel.app', // Vercel preview
  'localhost',
  'stretch-ceilings.uk',
  'stretchplafond.be',
  'stretchplafond.nl',
  'stretchplafond.fr',
  'stretch-sufit.pl',
  'stretchdecken.de',
  'stretchtecho.es',
] as const;

/** Widget group B — the remaining locale domains. */
export const TURNSTILE_HOSTS_B = [
  'stretchteto.pt',
  'straekloft.dk',
  'stretchceilings.se',
  'stretchtak.no',
  'stretch.is',
  // Live since 30 Aug 2026 (F13) — was missing from both groups, so every US
  // lead failed the captcha. Add the hostname to widget B in Cloudflare too.
  'stretchceiling.us',
] as const;

const ALL_HOSTS = new Set<string>([...TURNSTILE_HOSTS_A, ...TURNSTILE_HOSTS_B]);

function normalizeHost(host: string | null | undefined): string {
  return (host ?? '').toLowerCase().split(':')[0].replace(/^www\./, '');
}

/** Turnstile is enabled as soon as the group-A keypair is present. */
export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY_A);
}

function isGroupB(host: string): boolean {
  return (TURNSTILE_HOSTS_B as readonly string[]).includes(host);
}

/** Sitekey for the widget on a given hostname (client-safe). Empty string
 *  when Turnstile is disabled. Hosts outside both lists (unknown previews)
 *  fall back to group A — Cloudflare will reject the render there, which the
 *  widget surfaces via its error callback. */
export function turnstileSiteKeyFor(host: string): string {
  const h = normalizeHost(host);
  const a = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY_A || '';
  const b = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY_B || '';
  if (!a) return '';
  return isGroupB(h) && b ? b : a;
}

/** Secret for a hostname (SERVER ONLY — reads non-public env lazily). */
export function turnstileSecretFor(host: string): string {
  const h = normalizeHost(host);
  const a = process.env.TURNSTILE_SECRET_A || '';
  const b = process.env.TURNSTILE_SECRET_B || '';
  if (!a) return '';
  return isGroupB(h) && b ? b : a;
}

export type TurnstileVerdict = 'pass' | 'fail' | 'unavailable';

/**
 * Verify a Turnstile token with Cloudflare (LEAD routes only — see header).
 * 'unavailable' (network error / 5xx / timeout) lets callers continue with a
 * score penalty instead of dropping a possibly-real lead.
 */
export async function verifyTurnstile(opts: {
  token: string;
  host: string;
  ip?: string | null;
}): Promise<TurnstileVerdict> {
  const secret = turnstileSecretFor(opts.host);
  if (!secret) return 'pass'; // disabled → no-op
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const body = new URLSearchParams({ secret, response: opts.token });
    if (opts.ip) body.set('remoteip', opts.ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    });
    if (!res.ok) return res.status >= 500 ? 'unavailable' : 'fail';
    const json = (await res.json()) as { success?: boolean; hostname?: string };
    if (!json.success) return 'fail';
    // A valid token minted on a hostname that is not ours = replayed from
    // elsewhere → fail. localhost is in the list for dev.
    const tokenHost = normalizeHost(json.hostname);
    if (tokenHost && !ALL_HOSTS.has(tokenHost)) return 'fail';
    return 'pass';
  } catch {
    return 'unavailable';
  } finally {
    clearTimeout(timer);
  }
}
