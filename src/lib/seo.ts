// ============================================================================
// SEO helpers — canonical + hreflang alternates.
// Derives entirely from i18n/config, so adding a locale needs no change here.
// ============================================================================
import type { Metadata } from 'next';
import { locales, defaultLocale, localeFullCodes, type Locale } from '@/i18n/config';
import { siteUrl } from '@/lib/site-config';

/** Normalize a route to a clean, leading-slash path with no trailing slash. */
function normalizeRoute(route: string): string {
  if (!route || route === '/') return '';
  return ('/' + route.replace(/^\/+|\/+$/g, '')).replace(/\/+/g, '/');
}

/** Absolute URL for a (locale, route) pair, e.g. https://site/en/products. */
export function buildCanonical(locale: Locale, route: string): string {
  return `${siteUrl}/${locale}${normalizeRoute(route)}`;
}

/**
 * hreflang alternates for a route: one entry per locale (keyed by BCP 47 code)
 * plus x-default pointing at the default-locale version.
 */
export function buildAlternates(locale: Locale, route: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[localeFullCodes[l] ?? l] = buildCanonical(l, route);
  }
  languages['x-default'] = buildCanonical(defaultLocale, route);

  return {
    canonical: buildCanonical(locale, route),
    languages,
  };
}

/** OG locale + alternateLocale for a given active locale (en_BE style). */
export function buildOgLocales(locale: Locale): { ogLocale: string; alternate: string[] } {
  const fmt = (code: string) => code.replace('-', '_');
  const ogLocale = fmt(localeFullCodes[locale] ?? 'en-BE');
  const alternate = locales
    .filter((l) => l !== locale)
    .map((l) => fmt(localeFullCodes[l] ?? l));
  return { ogLocale, alternate };
}
