// ============================================================================
// STRUCTURED DATA — schema.org JSON-LD builders.
// Render output via <JsonLd data={...} />. Uses @id URIs so schemas
// cross-reference instead of duplicating. Never fabricates ratings or prices.
// ============================================================================
import { siteUrl, brand, contact, offices, salesTerritory, social } from '@/lib/site-config';
import { locales, localeFullCodes, originForLocale, type Locale } from '@/i18n/config';
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

export function productSchema(product: Product, locale: Locale) {
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
    brand: { '@id': ORG_ID },
    manufacturer: { '@id': ORG_ID },
    material: product.material,
    countryOfOrigin: product.countryOfOrigin,
    image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
    additionalProperty,
    // No price published — ship valid sparse Offer (price is project-based).
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: { '@id': ORG_ID },
      eligibleRegion: salesTerritory,
    },
  };
}

export type BreadcrumbItem = { name: string; url: string };

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
