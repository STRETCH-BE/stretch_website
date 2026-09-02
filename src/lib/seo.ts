// ============================================================================
// SEO helpers — DOMAIN-AWARE canonical + hreflang alternates.
// Each locale lives on its own domain with unprefixed URLs, so:
//   canonical  → https://<locale-domain><route>
//   hreflang   → one entry per locale pointing at that locale's DOMAIN
//   x-default  → the default-locale (en) domain
// Derives entirely from i18n/config: adding/changing a locale or domain needs
// no change here.
// ============================================================================
import type { Metadata } from 'next';
import {
  liveLocales,
  defaultLocale,
  localeFullCodes,
  originForLocale,
  hreflangAliases,
  type Locale,
} from '@/i18n/config';

/** Normalize a route to a clean, leading-slash path with no trailing slash. */
function normalizeRoute(route: string): string {
  if (!route || route === '/') return '';
  return ('/' + route.replace(/^\/+|\/+$/g, '')).replace(/\/+/g, '/');
}

/**
 * Absolute base URL of a locale's own domain (no trailing slash), e.g.
 * "https://stretchplafond.nl". Use `${localeBase(locale)}/products` wherever
 * `${siteUrl}/${locale}/products` was used before.
 */
export function localeBase(locale: Locale): string {
  return originForLocale(locale);
}

/** Absolute URL for a (locale, route) pair, e.g. https://stretchplafond.nl/products. */
export function buildCanonical(locale: Locale, route: string): string {
  // Home resolves to the bare origin; every other route is origin + path.
  return `${originForLocale(locale)}${normalizeRoute(route)}`;
}

/** Canonical-order locale subset: all LIVE locales, or their intersection
 *  with `only` when given (used by market-restricted content that exists on
 *  a subset of domains). Pending locales never appear in alternates. */
function subsetOf(only?: readonly Locale[]): readonly Locale[] {
  const base = !only || only.length === 0 ? liveLocales : liveLocales.filter((l) => only.includes(l));
  // Never return an empty set — alternates always need at least one URL.
  return base.length > 0 ? base : [defaultLocale];
}

/**
 * hreflang alternates for a route: one entry per locale (keyed by BCP 47 code,
 * pointing at that locale's domain) plus x-default pointing at the
 * default-locale domain. Pass `only` to restrict the set to the locales a
 * market-restricted page exists on; x-default then falls back to the first
 * listed locale when en is not among them.
 */
export function buildAlternates(
  locale: Locale,
  route: string,
  only?: readonly Locale[],
  /** Per-locale route (blog posts carry a different slug per locale). Each
   *  hreflang MUST point at that locale's OWN path — a Polish alternate that
   *  names the Dutch slug 404s on stretch-sufit.pl and breaks the cluster. */
  routeFor?: (l: Locale) => string,
): Metadata['alternates'] {
  const subset = subsetOf(only);
  const pathFor = (l: Locale) => (routeFor ? routeFor(l) : route);
  const languages: Record<string, string> = {};
  for (const l of subset) {
    languages[localeFullCodes[l] ?? l] = buildCanonical(l, pathFor(l));
  }
  // de-AT → the de-DE URL (stretchdecken.at redirects there) — see config.
  for (const [tag, l] of Object.entries(hreflangAliases)) {
    if (subset.includes(l)) languages[tag] = buildCanonical(l, pathFor(l));
  }
  const xDefault = subset.includes(defaultLocale) ? defaultLocale : subset[0];
  languages['x-default'] = buildCanonical(xDefault, pathFor(xDefault));

  return {
    canonical: buildCanonical(locale, pathFor(locale)),
    languages,
  };
}

/** OG locale + alternateLocale for a given active locale (nl_BE style).
 *  `only` restricts alternates the same way as buildAlternates. */
export function buildOgLocales(
  locale: Locale,
  only?: readonly Locale[],
): { ogLocale: string; alternate: string[] } {
  const fmt = (code: string) => code.replace('-', '_');
  const ogLocale = fmt(localeFullCodes[locale] ?? 'en');
  const alternate = subsetOf(only)
    .filter((l) => l !== locale)
    .map((l) => fmt(localeFullCodes[l] ?? l));
  return { ogLocale, alternate };
}
