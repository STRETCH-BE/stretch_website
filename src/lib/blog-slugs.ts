// ============================================================================
// PER-LOCALE BLOG SLUGS — the one small module both the app AND redirects.mjs
// read (per-market audit 2 Sep 2026, defect 1: the Polish domain published
// Polish text at a Dutch URL because generateStaticParams used ONE slug per
// post for every locale).
//
// blog-slugs.json maps CANONICAL slug → { locale: localized slug }. A locale
// absent from the map keeps the canonical slug, so nothing changes until a
// locale opts in. `be` and `nl` are never listed: those Dutch URLs rank.
//
// Kept deliberately tiny and dependency-free: the mega menu (a client
// component) resolves blog links through it, and redirects.mjs derives the
// host-scoped 301s from the same JSON, so the app and the redirect map can
// never disagree about where an article lives.
// ============================================================================
import type { Locale } from '@/i18n/config';
import slugMap from './blog-slugs.json';

export type BlogSlugMap = Record<string, Partial<Record<Locale, string>>>;

export const blogSlugMap: BlogSlugMap = slugMap as BlogSlugMap;

/**
 * Market-native articles (BlogPost.native): they exist on ONE locale only, so
 * a cross-domain link to them must land on /blog, not on a 404. Kept here
 * (client-safe) rather than derived from content.ts, which must never reach
 * the client bundle; content.ts asserts the two agree at module load.
 */
export const marketOnlyBlogSlugs: Record<string, Locale> = {
  'spanndecke-kosten-pro-m2': 'de',
  'spanndecke-oder-abgehaengte-decke': 'de',
  'spanndecke-kosten-renovierung': 'de',
  'co-to-jest-sufit-napinany': 'pl',
  'sufit-napinany-pvc-czy-tkanina': 'pl',
  'o-co-zapytac-producenta-sufitow-napinanych': 'pl',
  'plafond-tendu-prix-m2': 'fr',
  'plafond-tendu-prix-pose': 'fr',
  'plafond-tendu-devis-comparer': 'fr',
};

/** The slug a post uses on a locale: its per-locale slug, else the canonical one. */
export function localizedBlogSlug(canonicalSlug: string, locale: Locale): string {
  return blogSlugMap[canonicalSlug]?.[locale] ?? canonicalSlug;
}

/** "/blog/<localized slug>" for a canonical slug on a locale. */
export function blogPath(canonicalSlug: string, locale: Locale): string {
  return `/blog/${localizedBlogSlug(canonicalSlug, locale)}`;
}

/** Canonical slug for a slug seen in a URL on a locale (localized OR canonical), or undefined. */
export function canonicalBlogSlug(slugInUrl: string, locale: Locale, canonicalSlugs: readonly string[]): string | undefined {
  for (const c of canonicalSlugs) {
    if (localizedBlogSlug(c, locale) === slugInUrl) return c;
  }
  return undefined;
}

/**
 * Rewrites a locale-relative href so that "/blog/<canonical>" points at the
 * locale's own slug. Non-blog hrefs pass through untouched. Used for the
 * link rows inside article bodies (messages) and for skeleton links in
 * components, which are always written with canonical slugs.
 */
export function localizeHref(href: string, locale: Locale): string {
  const m = /^\/blog\/([^/?#]+)(.*)$/.exec(href);
  if (!m) return href;
  return `/blog/${localizedBlogSlug(m[1], locale)}${m[2]}`;
}

/**
 * The same page on ANOTHER locale's domain — for the language switcher, the
 * mobile language grid and the footer's "STRETCH worldwide" links, which
 * preserve the current path across domains. Blog paths are translated to the
 * target locale's own slug (a Polish slug on stretchdecken.de would 404);
 * market-only articles fall back to /blog on every other domain. All other
 * paths pass through unchanged.
 */
export function pathForLocale(pathname: string, from: Locale, to: Locale): string {
  const m = /^\/blog\/([^/?#]+)(.*)$/.exec(pathname);
  if (!m) return pathname;
  const slugInUrl = m[1];
  const canonical =
    Object.keys(blogSlugMap).find((c) => localizedBlogSlug(c, from) === slugInUrl) ?? slugInUrl;
  const only = marketOnlyBlogSlugs[canonical];
  if (only && only !== to) return '/blog';
  return `/blog/${localizedBlogSlug(canonical, to)}${m[2]}`;
}
