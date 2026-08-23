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
  locales,
  defaultLocale,
  localeFullCodes,
  originForLocale,
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

/** Canonical-order locale subset: all locales, or `only` when given (used by
 *  market-restricted content that exists on a subset of domains). */
function subsetOf(only?: readonly Locale[]): readonly Locale[] {
  if (!only || only.length === 0) return locales;
  return locales.filter((l) => only.includes(l));
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
): Metadata['alternates'] {
  const subset = subsetOf(only);
  const languages: Record<string, string> = {};
  for (const l of subset) {
    languages[localeFullCodes[l] ?? l] = buildCanonical(l, route);
  }
  const xDefault = subset.includes(defaultLocale) ? defaultLocale : subset[0];
  languages['x-default'] = buildCanonical(xDefault, route);

  return {
    canonical: buildCanonical(locale, route),
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
