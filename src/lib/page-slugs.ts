// ============================================================================
// PER-LOCALE SLUGS FOR MARKET-RESTRICTED STATIC PAGES — the small, client-safe
// module the app AND redirects.mjs read (same discipline as blog-slugs.ts).
//
// page-slugs.json maps a page key → { locale: slug }. A locale absent from the
// map has NO page at all (dynamicParams=false → 404), no nav entry, no sitemap
// URL and no hreflang alternate: a market only gets the page once it has its
// own written version (src/lib/acoustics/<locale>.ts) — never a shared body.
//
// Reserved slugs for later sprints (do not reuse for anything else):
// en/uk/us "acoustics", es/pt "acustica", ch "akustik", fr-ch "acoustique".
// ============================================================================
import type { Locale } from '@/i18n/config';
import slugMap from './page-slugs.json';

type PageSlugMap = { acoustics: Partial<Record<Locale, string>> };

export const acousticsSlugs: Partial<Record<Locale, string>> = (slugMap as PageSlugMap).acoustics;

/** Locales that have their own acoustics page, in map order. */
export const acousticsMarkets = Object.keys(acousticsSlugs) as Locale[];

export function hasAcoustics(locale: Locale): boolean {
  return typeof acousticsSlugs[locale] === 'string';
}

/** Where the acoustic content lives on a locale: its own page, else the product. */
export const ACOUSTIC_PRODUCT_ROUTE = '/products/acoustic-stretch-system';

export function acousticsHref(locale: Locale): string {
  const slug = acousticsSlugs[locale];
  return slug ? `/${slug}` : ACOUSTIC_PRODUCT_ROUTE;
}

const acousticsPaths = new Set(Object.values(acousticsSlugs).map((s) => `/${s}`));

/** True for "/akoestiek", "/acoustique", "/akustik" (any locale's slug). */
export function isAcousticsRoute(route: string): boolean {
  return acousticsPaths.has(route.replace(/\/+$/, '') || '/');
}

/** Skeleton marker for the menus: resolved to acousticsHref(locale) at render
 *  time and filtered out on locales without the page. */
export const ACOUSTICS_NAV = 'acoustics:';

/** Sitemap <lastmod> for the acoustics pages — bump when a market's copy changes. */
export const acousticsUpdatedAt = '2026-09-12';
