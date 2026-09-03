// ============================================================================
// HOST-AWARE SITEMAP — /sitemap.xml
// One Vercel deployment serves 15 domains (one locale each). Each domain must
// expose a sitemap containing ONLY its own URLs, with xhtml:link hreflang
// alternates pointing at the sibling domains (Google's recommended pattern
// for multi-domain international sites). A static app/sitemap.ts can't read
// the Host header, so this is a dynamic route handler instead.
// ============================================================================
import {
  liveLocales,
  localeStatus,
  defaultLocale,
  localeFullCodes,
  localesForHost,
  hreflangAliases,
  type Locale,
} from '@/i18n/config';
import { buildCanonical } from '@/lib/seo';
import { priceGuideCh, priceGuideChReady } from '@/lib/price-guide-ch';
import { staticRoutes, staticRouteDates } from '@/lib/site-config';
import { productSlugs, productsUpdatedAt } from '@/lib/products';
import { applicationSlugs, applicationsUpdatedAt } from '@/lib/applications';
import { blogPostsFor, blogHref, blogPostForSlug, projectSlugs, projectsUpdatedAt } from '@/lib/content';
import { dealerPlaceSlugs, isDealerMarket, dealersUpdatedAt } from '@/lib/dealers';
import { pricesPublished } from '@/lib/currency';
import { techMembranes, techTopicKeys, technicalUpdatedAt } from '@/lib/technical';
import { materialGroupSlugs, materialsUpdatedAt } from '@/lib/materials';

// No force-dynamic: reading request.headers already keeps this handler
// request-dynamic, and every <lastmod> below is a real content date (F12) —
// two fetches minutes apart return byte-identical XML.

// Build-time fallback ONLY — evaluated once at module scope, never per
// request. A route resolving to this means someone forgot to date it: add
// it to staticRouteDates or the family's *UpdatedAt constant.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// Absolute URL on the locale's own domain — with the public path prefix of a
// second locale on a shared domain (fr-ch → https://stretchdecken.ch/fr/...).
function urlFor(locale: Locale, route: string): string {
  return buildCanonical(locale, route);
}

function collectRoutes(locale: Locale): string[] {
  const productRoutes = productSlugs.map((s) => `/products/${s}`);
  const applicationRoutes = applicationSlugs.map((s) => `/applications/${s}`);
  // Blog is the one per-locale group: market-restricted posts only appear in
  // the sitemaps of the domains they exist on, each at THIS locale's slug.
  const blogRoutes = blogPostsFor(locale).map((p) => blogHref(p, locale));
  // Dealer directory + installer training exist on dealer markets only (N2).
  const dealerRoutes = isDealerMarket(locale) ? dealerPlaceSlugs.map((s) => `/dealers/${s}`) : [];
  const technicalRoutes = Object.keys(techMembranes).flatMap((m) =>
    techTopicKeys.map((t) => `/technical/${m}/${t}`),
  );
  const projectRoutes = projectSlugs.map((s) => `/inspiration/${s}`);
  const materialRoutes = materialGroupSlugs.map((s) => `/materials/${s}`);
  const statics = (isDealerMarket(locale)
    ? [...staticRoutes]
    : staticRoutes.filter((r) => r !== '/dealers' && r !== '/installer-training'))
    // No public prices on this locale → no calculator page (pricesPublished).
    .filter((r) => r !== '/price-calculator' || pricesPublished(locale));
  // The Swiss CHF price guide: de-CH only, and only once QuinLay's ranges are in.
  const swissGuide = locale === 'ch' && priceGuideChReady ? [priceGuideCh.route] : [];
  return [
    ...statics,
    ...swissGuide,
    ...productRoutes,
    ...applicationRoutes,
    ...technicalRoutes,
    ...projectRoutes,
    ...materialRoutes,
    ...blogRoutes,
    ...dealerRoutes,
  ];
}

function priorityFor(route: string): number {
  if (route === '/') return 1;
  if (route === '/products' || route.startsWith('/products/')) return 0.9;
  if (['/contact', '/partners', '/installer-training', '/price-calculator', '/dealers'].includes(route)) return 0.8;
  if (route === '/inspiration' || route === '/samples' || route === '/blog') return 0.7;
  if (route.startsWith('/blog/')) return 0.6;
  if (route.startsWith('/technical/')) return 0.6;
  if (route.startsWith('/inspiration/')) return 0.6;
  return 0.4;
}

function changeFreqFor(route: string): string {
  if (route === '/' || route === '/inspiration' || route === '/blog') return 'weekly';
  if (route === '/privacy' || route === '/terms') return 'yearly';
  return 'monthly';
}

// Real freshness per route family (F12): blog posts carry their own
// dateModified; every other family carries a maintained *UpdatedAt date;
// static routes have an explicit map in site-config.ts.
function lastModFor(route: string, locale: Locale): string {
  let d: string | undefined = staticRouteDates[route];
  if (!d && route.startsWith('/blog/')) {
    d = blogPostForSlug(locale, route.slice('/blog/'.length))?.dateModified;
  }
  if (!d && route.startsWith('/inspiration/')) d = projectsUpdatedAt;
  if (!d && route.startsWith('/products/')) d = productsUpdatedAt;
  if (!d && route.startsWith('/applications/')) d = applicationsUpdatedAt;
  if (!d && route.startsWith('/technical/')) d = technicalUpdatedAt;
  if (!d && route.startsWith('/materials/')) d = materialsUpdatedAt;
  if (!d && route.startsWith('/dealers/')) d = dealersUpdatedAt;
  return `${d ?? BUILD_DATE}T00:00:00.000Z`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Locales a route exists on — all LIVE locales, intersected with a
 *  market-restricted post's markets. Pending locales never appear. */
function localesForRoute(route: string, locale: Locale): readonly Locale[] {
  if (route.startsWith('/blog/')) {
    const post = blogPostForSlug(locale, route.slice('/blog/'.length));
    if (post?.markets?.length) return liveLocales.filter((l) => post.markets!.includes(l));
  }
  // Dealer directory + installer training: dealer markets only (N2) — no
  // domain may advertise an en-US alternate for them.
  if (route === '/dealers' || route.startsWith('/dealers/') || route === '/installer-training') {
    return liveLocales.filter(isDealerMarket);
  }
  if (route === '/price-calculator') return liveLocales.filter(pricesPublished);
  if (route === priceGuideCh.route) return liveLocales.filter((l) => l === 'ch');
  return liveLocales;
}

export function GET(request: Request) {
  const host = request.headers.get('host');
  // Serve EVERY locale owned by this domain (stretchdecken.ch → ch + fr-ch);
  // unknown hosts (previews) fall back to the default locale so the sitemap
  // is always valid. A pending locale is skipped — its URLs must not be
  // advertised anywhere until it is flipped to 'live' — and a domain with no
  // live locale serves an EMPTY sitemap.
  const hostLocales = localesForHost(host);
  const served = (hostLocales.length > 0 ? hostLocales : [defaultLocale]).filter((l) => localeStatus[l] === 'live');
  if (served.length === 0) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>\n',
      { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
    );
  }
  const entriesFor = (locale: Locale) => collectRoutes(locale)
    .map((route) => {
      const routeLocales = localesForRoute(route, locale);
      const xDefault = routeLocales.includes(defaultLocale) ? defaultLocale : (routeLocales[0] ?? defaultLocale);
      // Blog posts carry a different slug per locale: every alternate must
      // name THAT locale's own path (per-market audit 2 Sep 2026, defect 1).
      const post = route.startsWith('/blog/') ? blogPostForSlug(locale, route.slice('/blog/'.length)) : undefined;
      const routeOn = (l: Locale) => (post ? blogHref(post, l) : route);
      const alternates = routeLocales
        .map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${localeFullCodes[l] ?? l}" href="${esc(urlFor(l, routeOn(l)))}"/>`,
        )
        // de-AT → the de-DE URL (see hreflangAliases in config).
        .concat(
          Object.entries(hreflangAliases)
            .filter(([, l]) => routeLocales.includes(l))
            .map(([tag, l]) => `    <xhtml:link rel="alternate" hreflang="${tag}" href="${esc(urlFor(l, routeOn(l)))}"/>`),
        )
        .concat(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(urlFor(xDefault, routeOn(xDefault)))}"/>`,
        )
        .join('\n');
      return [
        '  <url>',
        `    <loc>${esc(urlFor(locale, route))}</loc>`,
        `    <lastmod>${lastModFor(route, locale)}</lastmod>`,
        `    <changefreq>${changeFreqFor(route)}</changefreq>`,
        `    <priority>${priorityFor(route)}</priority>`,
        alternates,
        '  </url>',
      ].join('\n');
    });
  const entries = served.flatMap(entriesFor).join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
