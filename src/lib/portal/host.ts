// ============================================================================
// PORTAL ON ONE HOST — helpers around NEXT_PUBLIC_PORTAL_HOST.
//
// Production value: stretch.mt. When set, the client portal runs ONLY there:
// the middleware 308s any /portal path on another production domain to the
// canonical host, /api/portal/* returns 404 on non-canonical production
// hosts, and every link INTO the portal is absolute. Unset (zero-config) →
// everything behaves exactly as before (locale-relative portal everywhere).
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
