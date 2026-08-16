// ============================================================================
// SEO — one helper that builds the full per-page Metadata object: unique
// title/description, canonical, hreflang alternates from the route map, and
// Open Graph defaults. Pages call pageMetadata() in their `metadata` export so
// every route gets consistent, symmetric SEO plumbing.
// ============================================================================
import type { Metadata } from 'next';
import { brand, siteUrl } from '@/lib/site-config';
import {
  absoluteUrl,
  languageAlternates,
  localeFullCodes,
  type Locale,
  type RouteKey,
} from '@/lib/i18n-routes';

type PageMetaInput = {
  route: RouteKey;
  locale: Locale;
  /** ≤ 60 chars — rendered as-is (no template suffix appended). */
  title: string;
  /** ≤ 155 chars. */
  description: string;
  /** Per-page OG image override; defaults to the root opengraph-image. */
  ogImage?: string;
  /** Set on funnel/thank-you pages that shouldn't be indexed. */
  noindex?: boolean;
};

export function pageMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.route, input.locale);
  return {
    title: input.title,
    description: input.description,
    alternates: languageAlternates(input.route, input.locale),
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: brand.name,
      locale: localeFullCodes[input.locale].replace('-', '_'),
      type: 'website',
      // Explicit page-level openGraph replaces the file-convention image, so
      // the default points at the generated /opengraph-image route; pages can
      // override via `ogImage`.
      images: [
        { url: `${siteUrl}${input.ogImage ?? '/opengraph-image'}`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    },
  };
}
