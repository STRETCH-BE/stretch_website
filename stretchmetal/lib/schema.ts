// ============================================================================
// STRUCTURED DATA — schema.org JSON-LD builders, rendered via
// <JsonLd data={...} />. Uses @id URIs so nodes cross-reference instead of
// duplicating. Never fabricates ratings, prices or certifications — the site
// holds no certifications yet and the markup must not imply otherwise.
// ============================================================================
import { brand, contact, groupSites, siteUrl, social } from '@/lib/site-config';
import { absoluteUrl, localeFullCodes, type Locale, type RouteKey } from '@/lib/i18n-routes';

const ORG_ID = `${siteUrl}/#organization`;

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: contact.address.street,
  addressLocality: contact.address.city,
  postalCode: contact.address.postalCode,
  addressRegion: contact.address.region,
  addressCountry: contact.address.country,
};

/** Company entity. Emitted once per page tree (home) so other nodes can
 *  reference ORG_ID. parentOrganization anchors StretchMetal to the group;
 *  sameAs points at the sister-brand sites (their public web presence). */
export function organizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: brand.name,
    legalName: brand.legalName,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/icon`, width: 512, height: 512 },
    description: brand.description[locale],
    parentOrganization: { '@type': 'Organization', name: brand.parentCompany },
    address: postalAddress,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contact.phone,
        email: contact.email,
        contactType: 'sales',
        areaServed: ['PL', 'DE', 'BE', 'NL', 'LU', 'FR', 'CZ', 'SK', 'AT'],
        availableLanguage: ['pl', 'en', 'nl'],
      },
    ],
    sameAs: [...groupSites.map((s) => s.url), ...social.map((s) => s.url)],
  };
}

/** Physical workshop — home + contact pages. Hours/geo are [CONFIRM] values
 *  from site-config; correcting them there corrects the markup. */
export function localBusinessSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: brand.name,
    description: brand.description[locale],
    image: `${siteUrl}/icon`,
    url: siteUrl,
    telephone: contact.phone,
    email: contact.email,
    address: postalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contact.geo.lat,
      longitude: contact.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: contact.hours.days,
        opens: contact.hours.opens,
        closes: contact.hours.closes,
      },
    ],
    parentOrganization: { '@id': ORG_ID },
  };
}

/** One Service node per service page. No offers/prices — quotes are bespoke. */
export function serviceSchema(opts: {
  route: RouteKey;
  locale: Locale;
  name: string;
  description: string;
}) {
  const url = absoluteUrl(opts.route, opts.locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: opts.name,
    description: opts.description,
    url,
    inLanguage: localeFullCodes[opts.locale],
    provider: { '@type': 'Organization', '@id': ORG_ID, name: brand.name },
    areaServed: ['PL', 'DE', 'BE', 'NL', 'LU', 'FR', 'CZ', 'SK', 'AT'],
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

export function faqPageSchema(qaList: { q: string; a: string }[]) {
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
