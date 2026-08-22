// ============================================================================
// STRUCTURED DATA — schema.org JSON-LD builders.
// Render output via <JsonLd data={...} />. Uses @id URIs so schemas
// cross-reference instead of duplicating. Never fabricates ratings or prices.
// ============================================================================
import { siteUrl, brand, contact, offices, salesTerritory, social } from '@/lib/site-config';
import { locales, localeFullCodes, originForLocale, type Locale } from '@/i18n/config';
import { indicativePriceRange } from '@/lib/indicative-prices';
import type { Product, Faq } from '@/lib/products';
import type { BlogPost } from '@/lib/content';
import { localeBase } from '@/lib/seo';

const ORG_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

const logoUrl = `${siteUrl}/images/stretch-logo.png`;

const availableLanguages = locales.map((l) => localeFullCodes[l] ?? l);

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: 'Gentseweg 309 A3',
  addressLocality: contact.address.city,
  postalCode: contact.address.postalCode,
  addressRegion: contact.address.region,
  addressCountry: contact.address.country,
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: brand.name,
    legalName: brand.legalName,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: logoUrl, width: 512, height: 512 },
    description: brand.description,
    foundingDate: String(brand.founded),
    parentOrganization: { '@type': 'Organization', name: brand.parentCompany },
    address: postalAddress,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contact.phone,
        email: contact.email,
        contactType: 'sales',
        areaServed: salesTerritory,
        availableLanguage: availableLanguages,
      },
    ],
    sameAs: social.map((s) => s.url),
  };
}

/**
 * Per-origin WebSite node: each of the 12 domains declares ITS OWN website
 * (own @id/url, its single language, its translated description) — Bing was
 * seeing every domain claim stretch.mt as its website. The publisher still
 * points at the ONE global Organization @id, so the company entity stays
 * anchored to the siteUrl.
 */
export function websiteSchema(opts: { locale: Locale; description?: string; hasSearch?: boolean }) {
  const origin = originForLocale(opts.locale);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: origin,
    name: brand.name,
    description: opts.description ?? brand.description,
    inLanguage: localeFullCodes[opts.locale] ?? opts.locale,
    publisher: { '@id': ORG_ID },
  };
  if (opts.hasSearch) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${origin}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    };
  }
  return schema;
}

/**
 * Product node with a Google-valid AggregateOffer. Google REQUIRES `lowPrice`
 * on an AggregateOffer — the earlier price-less offer flagged every product
 * page invalid in Search Console. The low/high figures come from
 * src/lib/indicative-prices.ts, which mirrors the site's own published price
 * guide (€/m² installed), so the markup never claims a price the pages don't.
 * A product with no published range returns null: the page then simply emits
 * no Product markup (no rich result beats an invented price — and a Product
 * without offers/review/aggregateRating is itself a Search Console error).
 */
export function productSchema(product: Product, locale: Locale): Record<string, unknown> | null {
  const range = indicativePriceRange(product.slug);
  if (!range) return null;

  const url = `${localeBase(locale)}/products/${product.slug}`;
  const image = `${siteUrl}/api/og/${product.slug}`;

  const additionalProperty = product.specs.map((s) => ({
    '@type': 'PropertyValue',
    name: s.k,
    value: s.v,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.summary,
    category: product.category,
    url,
    // Name inlined alongside the @id: the Organization node lives on the
    // homepage, not here, and a bare @id reads as "Missing field brand" in
    // the Rich Results Test (dangling reference).
    brand: { '@type': 'Brand', name: brand.name },
    manufacturer: { '@type': 'Organization', '@id': ORG_ID, name: brand.name },
    material: product.material,
    countryOfOrigin: product.countryOfOrigin,
    image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
    additionalProperty,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: range.low,
      highPrice: range.high,
      // Documents that the figures are €/m² installed (MTK = square metre),
      // matching the published guide. unitCode only — a unitText string would
      // be untranslated English on 11 of the 12 locales.
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        priceCurrency: 'EUR',
        minPrice: range.low,
        maxPrice: range.high,
        unitCode: 'MTK',
      },
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', '@id': ORG_ID, name: brand.name },
      eligibleRegion: salesTerritory,
    },
  };
}

export type BreadcrumbItem = { name: string; url: string };

/**
 * Service node for B2B service landings (/supply): the service is offered by
 * the ONE global Organization entity (same @id anchoring the technical
 * pages), with the group's sales territory as area served.
 */
export function serviceSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: 'Stretch ceiling materials supply & confection',
    provider: { '@id': ORG_ID },
    areaServed: salesTerritory.map((code) => ({ '@type': 'Country', name: code })),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageSchema(qaList: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qaList.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: { '@type': 'Answer', text: qa.a },
    })),
  };
}

export function localBusinessSchema() {
  const hq = offices[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: brand.name,
    image: logoUrl,
    url: siteUrl,
    telephone: contact.phone,
    email: contact.email,
    priceRange: '€€',
    address: postalAddress,
    geo: hq?.geo
      ? { '@type': 'GeoCoordinates', latitude: hq.geo.lat, longitude: hq.geo.lng }
      : undefined,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '17:00',
      },
    ],
    areaServed: salesTerritory,
    parentOrganization: { '@id': ORG_ID },
  };
}

export function articleSchema(post: BlogPost, locale: Locale) {
  const url = `${localeBase(locale)}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { '@type': 'Organization', name: post.author, '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: { '@type': 'ImageObject', url: `${siteUrl}/api/og/${post.slug}`, width: 1200, height: 630 },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: localeFullCodes[locale] ?? 'en-BE',
  };
}
