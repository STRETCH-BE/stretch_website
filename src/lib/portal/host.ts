// ============================================================================
// PORTAL HOST MODE — helpers around NEXT_PUBLIC_PORTAL_HOST.
//
// SET (e.g. stretch.mt): the client portal runs ONLY there — the middleware
// 308s any /portal path on another production domain to the canonical host,
// /api/portal/* returns 404 on non-canonical production hosts, and every
// link INTO the portal is absolute.
//
// UNSET — LOCAL PORTALS: the portal serves on every locale domain with
// per-domain sessions (auth cookies cannot cross domains). Every email
// (confirmation, approval, welcome) then links the client's LOCAL domain:
// the domain they signed up on, or the one matching their country
// (portalLoginUrl below). Requires all domains in Supabase's auth redirect
// allowlist.
//
// localhost and *.vercel.app previews are never redirected or blocked —
// they are not production domains.
// ============================================================================
import { localeDomains } from '@/i18n/config';

export function portalHost(): string {
  return (process.env.NEXT_PUBLIC_PORTAL_HOST || '').toLowerCase().replace(/\/$/, '');
}

export function isPortalHostEnabled(): boolean {
  return Boolean(portalHost());
}

function normalizeHost(host: string | null | undefined): string {
  return (host ?? '').toLowerCase().split(':')[0].replace(/^www\./, '');
}

/** True when `host` is one of our production locale domains. */
export function isProductionHost(host: string | null | undefined): boolean {
  const h = normalizeHost(host);
  return Object.values(localeDomains).some((d) => d.toLowerCase() === h);
}

/** True when the request host may serve the portal: the canonical host, or
 *  any non-production host (localhost, previews), or the feature is off. */
export function isPortalAllowedHost(host: string | null | undefined): boolean {
  if (!isPortalHostEnabled()) return true;
  const h = normalizeHost(host);
  if (h === portalHost()) return true;
  return !isProductionHost(h); // localhost / previews stay open
}

/**
 * Href for a link INTO the portal. Canonical host set → absolute URL there
 * (the portal is EN-only, so the path stays unprefixed); otherwise the plain
 * locale-aware path for next-intl's Link. Portal-INTERNAL links stay relative.
 */
export function portalHref(path: string): string {
  if (!isPortalHostEnabled()) return path;
  return `https://${portalHost()}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Base origin for Supabase emailRedirectTo / redirectTo URLs. */
export function portalOrigin(fallbackOrigin: string): string {
  return isPortalHostEnabled() ? `https://${portalHost()}` : fallbackOrigin;
}

/** Country (ISO-2) → locale, for picking a client's LOCAL portal domain when
 *  the canonical portal host is off. Neighbours map to the nearest domain. */
const COUNTRY_TO_LOCALE: Record<string, keyof typeof localeDomains> = {
  BE: 'be', NL: 'nl', FR: 'fr', LU: 'fr', PL: 'pl',
  DE: 'de', AT: 'de', CH: 'de', ES: 'es', PT: 'pt',
  DK: 'da', SE: 'sv', NO: 'no', IS: 'is', GB: 'uk', UK: 'uk', IE: 'uk', MT: 'en', US: 'us',
};

/**
 * Login URL for a portal email (approval, welcome). Canonical host set →
 * always that host. Otherwise prefer the domain the person signed up on,
 * then the domain matching their country, then the caller's origin — so
 * "local logins" stay local in every mail.
 */
export function portalLoginUrl(opts: {
  fallbackOrigin: string;
  signupHost?: string | null;
  country?: string | null;
}): string {
  if (isPortalHostEnabled()) return `https://${portalHost()}/portal/login`;
  const host = normalizeHost(opts.signupHost);
  if (host && isProductionHost(host)) return `https://${host}/portal/login`;
  const locale = COUNTRY_TO_LOCALE[(opts.country ?? '').trim().toUpperCase()];
  const domain = locale ? (localeDomains as Record<string, string>)[locale] : undefined;
  if (domain) return `https://${domain}/portal/login`;
  return `${opts.fallbackOrigin.replace(/\/$/, '')}/portal/login`;
}
