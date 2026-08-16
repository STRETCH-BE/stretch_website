// ============================================================================
// I18N ROUTES — the typed route map driving everything locale-related:
// hreflang alternates, the sitemap, the language switcher and every internal
// link. PL is the default locale and lives at the root; EN lives under /en.
// Adding a page = one entry here + two page.tsx files; the sitemap, alternates
// and switcher pick it up automatically.
// ============================================================================
import { siteUrl } from '@/lib/site-config';

export type Locale = 'pl' | 'en';
export const locales: Locale[] = ['pl', 'en'];
export const defaultLocale: Locale = 'pl';

/** BCP-47 codes for <html lang>, OG locale and schema inLanguage. */
export const localeFullCodes: Record<Locale, string> = {
  pl: 'pl-PL',
  en: 'en',
};

export type RouteKey =
  | 'home'
  | 'services'
  | 'welding'
  | 'laser'
  | 'cnc'
  | 'coating'
  | 'design'
  | 'structures'
  | 'machinePark'
  | 'about'
  | 'projects'
  | 'rfq'
  | 'rfqThanks'
  | 'contact'
  | 'privacy'
  | 'cookies';

/** Path per locale for every route on the site (leading slash, no trailing). */
export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { pl: '/', en: '/en' },
  services: { pl: '/uslugi', en: '/en/services' },
  welding: { pl: '/uslugi/spawanie', en: '/en/services/welding' },
  laser: { pl: '/uslugi/ciecie-laserowe', en: '/en/services/laser-cutting' },
  cnc: { pl: '/uslugi/obrobka-cnc', en: '/en/services/cnc-machining' },
  coating: { pl: '/uslugi/malowanie-proszkowe', en: '/en/services/powder-coating' },
  design: { pl: '/uslugi/projektowanie', en: '/en/services/design-engineering' },
  structures: { pl: '/uslugi/konstrukcje-stalowe', en: '/en/services/steel-structures' },
  machinePark: { pl: '/park-maszynowy', en: '/en/machine-park' },
  about: { pl: '/o-nas', en: '/en/about' },
  projects: { pl: '/realizacje', en: '/en/projects' },
  rfq: { pl: '/wycena', en: '/en/quote' },
  rfqThanks: { pl: '/wycena/dziekujemy', en: '/en/quote/thank-you' },
  contact: { pl: '/kontakt', en: '/en/contact' },
  privacy: { pl: '/polityka-prywatnosci', en: '/en/privacy-policy' },
  cookies: { pl: '/polityka-cookies', en: '/en/cookie-policy' },
};

/** Route path for a key + locale, e.g. path('rfq', 'en') → '/en/quote'. */
export function path(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}

/** Absolute URL for a key + locale. */
export function absoluteUrl(key: RouteKey, locale: Locale): string {
  const p = routes[key][locale];
  return p === '/' ? siteUrl : `${siteUrl}${p}`;
}

/**
 * Alternates object for Next's Metadata API: canonical for the current locale
 * plus hreflang for every locale and x-default → PL (the default tree).
 */
export function languageAlternates(key: RouteKey, locale: Locale) {
  return {
    canonical: absoluteUrl(key, locale),
    languages: {
      'pl-PL': absoluteUrl(key, 'pl'),
      en: absoluteUrl(key, 'en'),
      'x-default': absoluteUrl(key, 'pl'),
    },
  };
}

/**
 * Given a concrete pathname, find its route key — used by the language
 * switcher and the mobile sticky bar (both only know usePathname()).
 */
export function routeKeyForPath(pathname: string): RouteKey | null {
  const clean = pathname.replace(/\/$/, '') || '/';
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const locale of locales) {
      if (routes[key][locale] === clean) return key;
    }
  }
  return null;
}

/** Which locale a pathname belongs to (EN tree is everything under /en). */
export function localeForPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'pl';
}

/**
 * The same page in the other locale, for the language switcher. Unknown paths
 * (e.g. 404) fall back to the other locale's home page.
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const key = routeKeyForPath(pathname);
  return key ? routes[key][to] : routes.home[to];
}
