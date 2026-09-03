// ============================================================================
// SITE CONFIG — single source of truth for brand data.
// Pulled from the finalized brand brief + design mockups. Anything that varies
// by deploy (URLs, IDs) reads from env; everything brand-stable lives here.
// ============================================================================

// Primary origin — the default-locale (en / international) domain. Page URLs
// are always built per-locale via localeBase() in src/lib/seo.ts; siteUrl is
// only used for domain-stable identifiers (Organization @id, logo URL) so the
// brand keeps ONE schema.org entity across all 15 domains.
export const siteUrl = (
  // stretch.mt = the en / x-default domain — the group's schema.org identity.
  process.env.NEXT_PUBLIC_SITE_URL || 'https://stretch.mt'
).replace(/\/$/, '');

export const brand = {
  name: 'STRETCH',
  legalName: 'Stretch Productions BV',
  parentCompany: 'STRETCH Group',
  poweredBy: 'Powered by STRETCH Media',
  founded: 2018,
  // Belgian enterprise / VAT number (BE 0xxx.xxx.xxx). Shown on the Belgian
  // place pages' identity block (per-market audit, T5) ONLY once set — never
  // invented. Michael: fill in from the KBO/BCE extract.
  vatNumber: '',
  tagline: 'A new ceiling in one day.',
  description:
    'STRETCH installs sleek, seamless stretch ceilings and walls in a single day — cold-mounted, with no dust and no painting — offering acoustic, lighting and printed-design options. Hand-made in Belgium for residential and commercial projects.',
  domain: 'stretchplafond.be',
  colors: {
    red: '#FF0000',
    black: '#0A0A0A',
    pureBlack: '#000000',
    white: '#FFFFFF',
    surface: '#F4F3F1',
    text: '#0A0A0A',
  },
} as const;

export const contact = {
  email: 'info@stretchgroup.be',
  leadDestination: process.env.LEAD_DESTINATION || 'leads@stretchgroup.be',
  phone: '+32474522090',
  phoneDisplay: '+32 474 52 20 90',
  phoneHref: 'tel:+32474522090',
  whatsapp: '+32474522090',
  whatsappHref: 'https://wa.me/32474522090',
  telegram: 'https://t.me/STRETCH_OFFICE',
  hours: 'Mo-Fr 08:30-17:00',
  hoursDisplay: 'Mon–Fri · 08:30–17:00',
  address: {
    street: 'Gentseweg 309 A3 (Beverpark)',
    city: 'Beveren-Waas',
    postalCode: '9120',
    region: 'Oost-Vlaanderen',
    country: 'BE',
  },
  geo: { lat: 51.1953188, lng: 4.2239015 },
  // Google Business Profile of the HQ — the contact-page map embeds this
  // LISTING (profile card: name, rating, photos, directions), not a bare
  // address pin. `ftid` is the "0x…:0x…" feature id from the profile's full
  // google.com/maps/place/… URL (or its "Embed a map" code); with it the
  // embed is pinned to the exact listing. While it is empty the map falls
  // back to the name + address query, which Google resolves to the listing
  // in most cases. `shareUrl` is the maps.app.goo.gl link (3 Sep 2026).
  maps: {
    name: 'STRETCH',
    query: 'STRETCH, Gentseweg 309 A3, 9120 Beveren-Waas',
    shareUrl: 'https://maps.app.goo.gl/fiRQxCoyWXjvLpJi8',
    ftid: '', // TODO: "0x…:0x…" from the profile URL
    lat: 51.1953188,
    lng: 4.2239015,
    region: 'be',
  },
} as const;

// Generalvertretung STRETCH Schweiz & Liechtenstein (2 Sep 2026). Official
// contact data — use exactly this everywhere on the ch locale; every Swiss
// lead is delivered to swissPartner.email (QUINLAY_LEAD_EMAIL overrides) with
// leadDestination in copy (src/lib/deliver.ts).
export const swissPartner = {
  name: 'QuinLay AG',
  role: 'Generalvertretung STRETCH Schweiz & Liechtenstein',
  street: 'Stierenberg Park 1A',
  postalCode: '6221',
  city: 'Rickenbach',
  canton: 'LU',
  country: 'CH',
  phone: '+41413134732',
  phoneDisplay: '041 313 47 32',
  phoneHref: 'tel:+41413134732',
  email: 'office@quinlay.ch',
  url: 'https://www.quinlay.ch',
  // Google listing for the Swiss contact-page map (same shape as contact.maps).
  maps: {
    name: 'QuinLay AG',
    query: 'QuinLay AG, Stierenberg Park 1A, 6221 Rickenbach',
    shareUrl: '', // TODO: QuinLay's maps.app.goo.gl share link
    ftid: '', // TODO: "0x…:0x…" from the listing URL
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
    region: 'ch',
  },
} as const;

export type Office = {
  role: string;
  country: string;
  countryName: string;
  name: string;
  addressLines: string[];
  email?: string;
  /** The branch's own public website, when it operates under its own name. */
  url?: string;
  geo?: { lat: number; lng: number };
};

export const offices: Office[] = [
  {
    role: 'Headquarters',
    country: 'BE',
    countryName: 'Belgium',
    name: 'STRETCH',
    addressLines: ['Gentseweg 309 A3', '9120 Beveren-Waas'],
    email: 'info@stretchgroup.be',
    geo: { lat: 51.1953188, lng: 4.2239015 },
  },
  {
    role: 'Sales',
    country: 'US',
    countryName: 'United States',
    name: 'STRETCH US',
    addressLines: ['New York', 'Sales — US'],
    email: 'us@stretchgroup.be',
  },
  {
    role: 'Branch',
    country: 'PL',
    countryName: 'Poland',
    name: 'Alto Design Sp. z o.o.',
    addressLines: ['Legionów 59', '42-202 Częstochowa'],
    email: 'info@stretch-sufit.pl',
    // Group-owned installer brand — linked from the shared footer so Google
    // reads the two domains as related, not competing.
    url: 'https://altodesign.pl',
    geo: { lat: 50.8074338, lng: 19.1585487 },
  },
  {
    role: 'Branch',
    country: 'AT',
    countryName: 'Austria',
    name: 'STRETCH Austria',
    addressLines: ['Gertrude-Fröhlich-Sandner-Straße 2', '1100 Vienna'],
    email: 'info@stretchdecken.at',
    geo: { lat: 48.1861668, lng: 16.3767073 },
  },
];

// Group reach (schema.org areaServed / eligibleRegion — ISO 3166-1 alpha-2,
// so the United Kingdom is 'GB', not 'UK'). Sales territory at launch is
// Belgium; the group operates across these markets.
export const salesTerritory = [
  'BE',
  'NL',
  'FR',
  'DE',
  'AT',
  'PL',
  'GB',
  'US',
  'IS',
  'MT',
  // Markets with their own domain (codebase analysis 2 Sep 2026): the Product
  // eligibleRegion on stretchtecho.es / straekloft.dk / … must include them.
  'ES',
  'PT',
  'DK',
  'SE',
  'NO',
] as const;

// Social handles are [LATER] in the brief — only Telegram is public today.
// Render only entries with a real URL.
export const social: { label: string; short: string; url: string }[] = [
  { label: 'Telegram', short: 'tg', url: contact.telegram },
];

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export type NavLink = { key: string; href: string };

export const mainNav: NavLink[] = [
  { key: 'solutions', href: '/products' },
  { key: 'inspiration', href: '/inspiration' },
  { key: 'partners', href: '/partners' },
  { key: 'contact', href: '/contact' },
];

export const utilityNav: NavLink[] = [
  { key: 'reseller', href: '/partners' },
    { key: 'dealers', href: '/dealers' },
  { key: 'training', href: '/installer-training' },
];

export const footerNav = {
  solutions: [
    { key: 'polyester', href: '/products/polyester-stretch-ceiling' },
    { key: 'pvc', href: '/products/pvc-stretch-ceiling' },
    { key: 'acoustic', href: '/products/acoustic-stretch-system' },
    { key: 'light', href: '/products/light-print-stretch-ceiling' },
    { key: 'prefab', href: '/products/prefab-ceiling-unit' },
    { key: 'kit', href: '/kit' },
    { key: 'priceCalculator', href: '/price-calculator' },
  ] as NavLink[],
  company: [
    { key: 'reseller', href: '/partners' },
    { key: 'supply', href: '/supply' },
    { key: 'projectsExport', href: '/projects-export' },
    { key: 'training', href: '/installer-training' },
    // The dealer directory hub was linked from /supply only (codebase
    // analysis 2 Sep 2026) — the local pages are the proven tactic, so the hub
    // sits in the footer on every dealer market (label: footer.dealers).
    { key: 'dealers', href: '/dealers' },
    { key: 'architects', href: '/architects' },
    { key: 'inspiration', href: '/inspiration' },
    { key: 'about', href: '/about' },
    { key: 'faq', href: '/faq' },
    // Client portal — private client area (login-gated, noindex).
    { key: 'clientPortal', href: '/portal' },
  ] as NavLink[],
  legal: [
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' },
  ] as NavLink[],
};

// Every internal route, for the sitemap. Product + blog detail routes are
// appended dynamically from the catalogs below in sitemap.ts.
export const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/products',
  '/partners',
  '/installer-training',
  '/inspiration',
  '/materials',
  '/dealers',
  '/samples',
  '/datasheets',
  '/architects',
  '/kit',
  '/supply',
  '/supply/czechia-slovakia',
  '/projects-export',
  '/price-calculator',
  '/products/prefab-lighting-elements',
  '/faq',
  '/blog',
  '/privacy',
  '/terms',
] as const;

// Sitemap <lastmod> for the static routes above — the date each page's
// content last genuinely changed, seeded from git history (fix round 2,
// F12). Bump an entry when you materially change that page. A route
// missing here falls back to the sitemap's build-time constant, which
// means someone forgot to date it — add it.
export const staticRouteDates: Record<string, string> = {
  '/': '2026-08-30', // reviews section + schema cleanup
  '/about': '2026-08-06',
  '/contact': '2026-08-30', // direct-installation band (N2)
  '/products': '2026-08-06',
  '/partners': '2026-08-30',
  '/installer-training': '2026-08-30',
  '/inspiration': '2026-08-06',
  '/materials': '2026-08-22',
  '/dealers': '2026-08-30',
  '/samples': '2026-08-06',
  '/datasheets': '2026-08-06',
  '/architects': '2026-08-22',
  '/kit': '2026-08-30',
  '/supply': '2026-08-30',
  '/supply/czechia-slovakia': '2026-08-22',
  '/projects-export': '2026-08-22',
  '/price-calculator': '2026-08-22',
  '/products/prefab-lighting-elements': '2026-08-06',
  '/faq': '2026-08-24',
  '/blog': '2026-08-23',
  '/privacy': '2026-08-22',
  '/terms': '2026-08-06',
};
