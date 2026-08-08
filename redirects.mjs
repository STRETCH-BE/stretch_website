// ============================================================================
// LEGACY REDIRECT MAP — WordPress multisite → Next.js, all domains at once.
// Imported by next.config.mjs:  async redirects() { return legacyRedirects; }
//
// Host-scoped: Vercel's domain-level 308s preserve paths, so legacy URLs from
// stretch-ceilings.uk / stretchceiling.us land on stretch.mt (English rules)
// and stretchdecken.at / stretchgroup.ch / stretchgroup.li land on
// stretchdecken.de (German rules). Seven host groups cover sixteen domains.
//
// DECISION FLAG — set before deploy:
//   Shop lives on  →  '/materials'                      (webshop retired)
//   Shop lives on  →  'https://shop.stretchgroup.be'    (WooCommerce kept on subdomain)
const SHOP_TARGET = '/materials';
//
// NOTE: no blanket "/:path* → /" fallback — in Next.js, redirects() run BEFORE
// the filesystem, so a catch-all would redirect the new site's own pages too.
// Unmatched legacy tails 404 and are added here weekly from the GSC 404 report.
// Sources: GSC 12-mo export (7 Aug 2026), old-site gap analysis (6 Aug 2026),
// live crawls of stretch.mt / stretchplafond.nl / stretchceiling.us (8 Aug 2026),
// GSC Coverage "All known pages" export for stretchplafond.be (9 Aug 2026,
// 425 URLs — full sweep, every URL matched or explicitly mapped below).
// ============================================================================

const host = (h) => [{ type: 'host', value: h }];
const R = (h, source, destination) => ({
  source,
  has: host(h),
  destination,
  permanent: true,
});

// ---------------------------------------------------------------------------
// DUTCH RULES — applied to stretchplafond.be AND stretchplafond.nl
// Order matters: specific slugs BEFORE the /spanplafond(s)-:tail fallbacks.
// ---------------------------------------------------------------------------
const dutchRules = (h) => [
  // --- commerce (GSC: 731 clicks; catch-alls agreed 6 Aug) ---
  R(h, '/shop/:path*', SHOP_TARGET),
  R(h, '/shop-2', SHOP_TARGET),
  R(h, '/product/:path*', SHOP_TARGET),
  R(h, '/product-category/:path*', SHOP_TARGET),
  R(h, '/product-tag/:path*', SHOP_TARGET),
  R(h, '/product-groepen/:path*', SHOP_TARGET),
  R(h, '/sale', SHOP_TARGET),
  R(h, '/new-arrivals', SHOP_TARGET),
  R(h, '/winkelmand', SHOP_TARGET),
  R(h, '/cart', SHOP_TARGET),
  R(h, '/checkout', SHOP_TARGET),
  R(h, '/afrekenen', SHOP_TARGET),
  R(h, '/my-account/:path*', '/portal/login'),
  R(h, '/login-register', '/portal/login'),
  R(h, '/mijn-aankooplijsten', '/portal/login'),
  R(h, '/prijslijsten-spanplafonds', '/portal/login'),
  R(h, '/request-a-quote', '/contact'),
  R(h, '/offerte-aanvragen', '/contact'),
  R(h, '/coupon_campaign/:path*', '/installer-training'),

  // --- solution / product pages (gap analysis §1.3 + Coverage sweep) ---
  R(h, '/standard-spanplafond', '/products/polyester-stretch-ceiling'),
  R(h, '/polyester-spanplafond', '/products/polyester-stretch-ceiling'),
  R(h, '/pvc-spanplafond', '/products/pvc-stretch-ceiling'),
  R(h, '/acoustic', '/products/acoustic-stretch-system'),
  R(h, '/akoestisch-plafond', '/products/acoustic-stretch-system'),
  R(h, '/akoestische-plafondpanelen', '/products/acoustic-stretch-system'),
  R(h, '/akoestische-panelen', '/products/acoustic-stretch-system'),
  R(h, '/akoestische-plafondeilanden', '/products/acoustic-stretch-system'),
  R(h, '/akoestiek-optimaliseren-in-hybride-ruimtes', '/products/acoustic-stretch-system'),
  R(h, '/een-geluidseffect-op-mensen', '/products/acoustic-stretch-system'),
  R(h, '/invisible-audio-spanplafond', '/products/acoustic-stretch-system'),
  R(h, '/lichtgevend-spanplafonds', '/products/light-print-stretch-ceiling'),
  R(h, '/print', '/products/custom-print'),
  R(h, '/sterrenhemel', '/products/starry-sky'),
  R(h, '/citiznm-spanplafond-prefab-badkamer-unit', '/products/prefab-ceiling-unit'),
  R(h, '/prefab-plafond', '/products/prefab-ceiling-unit'),
  R(h, '/inspectieluik', '/products/inspection-hatch'),
  R(h, '/gelakt-plafond', '/products/pvc-stretch-ceiling'),
  R(h, '/sustainable-spanplafond', '/products/polyester-stretch-ceiling'),
  R(h, '/niet-brandbaar-spanplafond', '/technical/polyester/fire-safety'),
  R(h, '/plafondlijsten', '/materials/profiles'),
  R(h, '/plafondbekleding', '/products'),
  R(h, '/plafonds', '/products'),
  R(h, '/spanplafond-oplossingen', '/products'),
  R(h, '/toepassingsgebieden', '/products'),
  R(h, '/klassiek-gabarit', '/products'),
  R(h, '/stretch-op-maat', '/materials'),
  R(h, '/texture', '/materials'),
  // lighting for stretch ceilings
  R(h, '/led-lijn-verlichting', '/products/prefab-lighting-elements'),
  R(h, '/verlichting-spanplafond', '/products/prefab-lighting-elements'),
  R(h, '/verlichting-voor-spanplafonds', '/products/prefab-lighting-elements'),
  R(h, '/philips-hue-of-ander-verlichting-systeem', '/products/prefab-lighting-elements'),
  R(h, '/smart-home-oplossingen', '/products/prefab-lighting-elements'),

  // --- walls category (gap analysis §3) ---
  R(h, '/wanden', '/applications/walls'),
  R(h, '/akoestische-wandbekleding-stretch', '/applications/walls'),
  R(h, '/akoestische-wandbekleding', '/applications/walls'),
  R(h, '/akoestische-wandpanelen', '/applications/walls'),
  R(h, '/textiel-wandbekleding', '/applications/walls'),
  R(h, '/velour-wanden', '/applications/walls'),
  R(h, '/greenkey-wand-ruimte', '/applications/walls'),

  // --- applications (room-specific articles → application pages) ---
  R(h, '/spanplafond-badkamer', '/applications/bathroom-kitchen'),
  R(h, '/badkamer-renovatie', '/applications/bathroom-kitchen'),
  R(h, '/spanplafond-in-de-badkamer-de-voordelen-en-materiaalkeuze', '/applications/bathroom-kitchen'),
  R(h, '/infrarood-verwarming-in-je-badkamer', '/applications/bathroom-kitchen'),
  R(h, '/spanplafond-woonkamer', '/applications/living-cinema'),
  R(h, '/thuisbioscoop-akoestische-oplossing', '/applications/living-cinema'),
  R(h, '/thuisbioscoop-akoestische-optimalisatie', '/applications/living-cinema'),
  R(h, '/kantoor-akoestisch-spanplafond', '/applications/office-retail'),

  // --- knowledge-base articles, now recreated as /blog/<slug> ---
  R(h, '/houten-planchetten-plafond-renoveren-of-vernieuwen', '/blog/houten-planchetten-plafond-renoveren-of-vernieuwen'), // GSC 734
  R(h, '/scheuren-in-plafond-herstellen', '/blog/scheuren-in-plafond-herstellen'),                                         // GSC 265
  R(h, '/de-ideale-plafondhoogte', '/blog/de-ideale-plafondhoogte'),                                                       // GSC 128
  R(h, '/geluidsoverlast-van-uw-bovenburen', '/blog/geluidsoverlast-van-uw-bovenburen'),                                   // GSC 102
  R(h, '/Knowledge-base/houten-planchetten-plafond-renoveren-of-vernieuwen', '/blog/houten-planchetten-plafond-renoveren-of-vernieuwen'),
  R(h, '/Knowledge-base/scheuren-in-plafond-herstellen', '/blog/scheuren-in-plafond-herstellen'),
  R(h, '/Knowledge-base/de-ideale-plafondhoogte', '/blog/de-ideale-plafondhoogte'),
  R(h, '/Knowledge-base/geluidsoverlast-van-uw-bovenburen', '/blog/geluidsoverlast-van-uw-bovenburen'),
  R(h, '/klimaat-plafond', '/blog/klimaat-plafond'),
  R(h, '/buiten-plafonds', '/blog/spanplafond-buiten'),
  R(h, '/spanplafond-buiten', '/blog/spanplafond-buiten'),
  R(h, '/schuin-dak', '/blog/schuin-dak'),
  R(h, '/spanplafond-onder-schuin-dak', '/blog/schuin-dak'),
  R(h, '/kan-je-een-spanplafond-afwassen', '/blog/kan-je-een-spanplafond-afwassen'),
  R(h, '/spanplafond-zelf-plaatsen', '/blog/spanplafond-zelf-plaatsen'),
  R(h, '/spanplafond-prijs', '/blog/spanplafond-prijs'),
  R(h, '/spanplafond-prijs-2023', '/blog/spanplafond-prijs'),
  R(h, '/wat-kost-een-spanplafond', '/blog/spanplafond-prijs'),
  R(h, '/bereken-prijs-spanplafond', '/blog/spanplafond-prijs'),
  R(h, '/clipso-spanplafonds', '/blog/clipso-spanplafonds'),
  R(h, '/wat-is-een-spanplafond', '/blog/what-is-a-stretch-ceiling'),
  R(h, '/blog-wat-is-een-spanplafond', '/blog/what-is-a-stretch-ceiling'),
  R(h, '/le-plafond-tendu', '/blog/what-is-a-stretch-ceiling'),
  // Knowledge-base long tail + WP docs archives → specs & downloads library
  // (/technical has no index page — the hub's entry points are the per-material
  // leaf pages; /datasheets is the "All specs & downloads" library.)
  R(h, '/Knowledge-base/:path*', '/datasheets'),
  R(h, '/knowledge-base/:path*', '/datasheets'),
  R(h, '/Knowledge-base-category/:path*', '/datasheets'),
  R(h, '/knowledge-base-category/:path*', '/datasheets'),
  R(h, '/docs-/:path*', '/datasheets'),
  R(h, '/technisch', '/datasheets'),
  R(h, '/brandveiligheid-spanplafond', '/technical/pvc/fire-safety'),
  R(h, '/kleuren-pvc-spanplafonds', '/technical/pvc/colours'),
  R(h, '/polyester-kleuren', '/technical/polyester/colours'),

  // --- spec texts (bestekteksten) → architect area ---
  R(h, '/bestektekst-:doc', '/architects'),
  R(h, '/bestekteksten-:doc', '/architects'),

  // --- project references → recreated case studies ---
  R(h, '/van-der-valk-beveren-spanplafond-feestzaal', '/inspiration/van-der-valk-beveren'),
  R(h, '/da-tweekaz-opnamestudio-akoestisch-spanplafond', '/inspiration/da-tweekaz-studio'),
  R(h, '/mark-with-a-k-geluidstudio-akoestisch-spanplafond', '/inspiration/mark-with-a-k'),
  R(h, '/notariskantoor-ampe-anthony-akoestisch-spanplafond', '/inspiration/notary-ampe-anthony'),
  R(h, '/bnp-parisbas-fortis-brussel', '/inspiration/bnp-paribas-fortis'),
  R(h, '/spanplafond-jhonson-jhonson-limmerick', '/inspiration/johnson-and-johnson'),
  R(h, '/polette', '/inspiration/polette-eyewear'),
  R(h, '/london-chapel', '/inspiration/london-chapel'),
  R(h, '/rue-perree-art-recherche-industrie', '/inspiration/rue-perree-paris'),
  R(h, '/vier-emmershof-lokeren', '/inspiration/vier-emmershof-lokeren'),
  R(h, '/vp-193', '/inspiration/vp-193'),
  R(h, '/vap-sint-pauwels', '/inspiration/vap-sint-pauwels'),
  R(h, '/akoestisch-spanplafond-ben-woning', '/inspiration/ben-home-vdb-222'),
  R(h, '/inspiratie-spanplafond', '/inspiration'),
  R(h, '/spanplafonds-youtube', '/inspiration'),
  R(h, '/clients', '/inspiration'),
  R(h, '/clients-3', '/inspiration'),

  // --- local SEO city pages (→ /dealers/[place]) ---
  R(h, '/spanplafond-antwerpen', '/dealers/antwerpen'),
  R(h, '/spanplafond-limburg', '/dealers/limburg'),
  R(h, '/spanplafond-west-vlaanderen', '/dealers/west-vlaanderen'),
  R(h, '/spanplafonds-west-vlaanderen', '/dealers/west-vlaanderen'),
  R(h, '/spanplafond-sint-niklaas', '/dealers/sint-niklaas'),
  R(h, '/spanplafond-ninove', '/dealers/ninove'),
  R(h, '/spanplafond-beveren-waas', '/contact'), // HQ city
  R(h, '/spanplafond-aalst-valentin-projects', '/dealers/aalst'),
  R(h, '/spanplafonds-antwerpen-strak-spanplafonds', '/dealers/antwerpen'),
  R(h, '/spanplafonds-lokeren-plafondlux', '/dealers/lokeren'),
  R(h, '/stretch-spanplafonds-laten-plaatsen-in-gent', '/dealers/gent'),
  R(h, '/spanplafond-laten-plaatsen', '/dealers'),
  R(h, '/spanplafond-plaatsen', '/dealers'),
  R(h, '/showroom-bad-en-douche', '/dealers'),
  R(h, '/ik-koos-voor-een-stretch-dealer', '/dealers'),
  // fallbacks LAST — every unlisted spanplafond(s)-* tail is a locality page
  // (bornem, aartselaar, ternat, tremelo, esse, …). Both spellings: the old
  // site used singular AND plural prefixes, and `/spanplafond-:city` does NOT
  // match "spanplafonds-…" (the extra s breaks the literal prefix).
  R(h, '/spanplafond-:city', '/dealers'),
  R(h, '/spanplafonds-:city', '/dealers'),

  // --- content & funnel pages ---
  R(h, '/waarom-kiezen-voor-een-spanplafond', '/faq'),
  R(h, '/hoe-lang-gaat-een-spanplafond-mee', '/faq'),
  R(h, '/hoe-lang-gaat-spanplafond-mee', '/faq'),
  R(h, '/hoeveel-lager-komt-een-spanplafond', '/faq'),
  R(h, '/is-een-spanplafond-isolerend', '/faq'),
  R(h, '/plafond-isoleren-met-een-spanplafond', '/faq'),
  R(h, '/bouwpremies-subsidies-spanplafonds', '/faq'),
  R(h, '/garantie-reparatie-en-retourzendingen', '/faq'),
  R(h, '/retourneren', '/faq'),
  R(h, '/garantie-aanmelden', '/contact'),
  R(h, '/herstelling-aanmelden', '/contact'),
  R(h, '/klantenservice', '/contact'),
  R(h, '/calculeer-je-eigen-spanplafond', '/contact'),
  R(h, '/bereken-je-spanplafond', '/contact'),
  R(h, '/reseller-worden', '/partners'),
  R(h, '/verkooppunt-worden', '/partners'),
  R(h, '/booking', '/installer-training'),
  R(h, '/stretch-spanplafond-training-inplannen', '/installer-training'),
  R(h, '/about-us', '/about'),
  R(h, '/hand-made-in-belgium', '/about'),
  R(h, '/jobs', '/about'),
  R(h, '/jobs/:path*', '/about'),
  R(h, '/vacature-:job', '/about'),
  R(h, '/project-manager-spanplafonds', '/about'),
  R(h, '/nieuws-blog', '/blog'),
  R(h, '/category/:path*', '/blog'),
  R(h, '/author/:path*', '/blog'),
  R(h, '/bouw-en-reno-2023', '/blog'),
  R(h, '/bouwbeurs-roeselare-onze-stretchspanplafonds-van-het-merk-stretch-in-de-spotlight', '/blog'),
  R(h, '/stretch-spanplafonds-op-batibouw', '/blog'),
  R(h, '/stretch-spanplafonds-staan-weer-tentoon-op-batibouw-2024', '/blog'),
  R(h, '/privacy-policy', '/privacy'),
  R(h, '/algemene-voorwaarden', '/terms'),
  R(h, '/terms-and-conditions', '/terms'),

  // --- WP litter (attachment pages, plugin endpoints, exit surveys) → home ---
  R(h, '/cropped-stretch-logo-2022-01-jpg', '/'),
  R(h, '/entries', '/'),
  R(h, '/out', '/'),
  R(h, '/page-builder-preview', '/'),
  R(h, '/af-product-visibility', '/'),
  R(h, '/ik-koos-voor-een-ander-soort-plafond', '/'),
  R(h, '/ik-koos-voor-een-concurent', '/'),

  // --- uploads: pricelists exposed dealer pricing → all PDFs off-index ---
  R(h, '/wp-content/uploads/:path*', '/datasheets'),
];

// ---------------------------------------------------------------------------
// GENERIC WOO/WP RULES — for hosts whose localized slugs are not yet inventoried
// ---------------------------------------------------------------------------
const genericRules = (h, account = '/portal/login') => [
  R(h, '/shop/:path*', SHOP_TARGET),
  R(h, '/product/:path*', SHOP_TARGET),
  R(h, '/product-category/:path*', SHOP_TARGET),
  R(h, '/cart', SHOP_TARGET),
  R(h, '/checkout', SHOP_TARGET),
  R(h, '/my-account/:path*', account),
  R(h, '/privacy-policy', '/privacy'),
  R(h, '/wp-content/uploads/:path*', '/datasheets'),
];

// ---------------------------------------------------------------------------
// ENGLISH RULES — stretch.mt (also receives legacy .uk / .us paths via 308)
// ---------------------------------------------------------------------------
const englishRules = [
  ...genericRules('stretch.mt'),
  R('stretch.mt', '/soluzzjonijiet', '/products'),
  R('stretch.mt', '/warranty-repair-and-returns', '/faq'),
  R('stretch.mt', '/terms-and-conditions', '/terms'),
  R('stretch.mt', '/customer-service', '/contact'),
  R('stretch.mt', '/Knowledge-base/:path*', '/datasheets'),
  R('stretch.mt', '/knowledge-base/:path*', '/datasheets'),
];

// ---------------------------------------------------------------------------
// GERMAN RULES — stretchdecken.de (also receives .at / .ch / .li paths via 308)
// ---------------------------------------------------------------------------
const germanRules = [
  ...genericRules('stretchdecken.de', '/portal/login'),
  R('stretchdecken.de', '/mein-konto/:path*', '/portal/login'),
  R('stretchdecken.de', '/warenkorb', SHOP_TARGET),
  R('stretchdecken.de', '/kasse', SHOP_TARGET),
];

// ---------------------------------------------------------------------------
// FRENCH RULES — stretchplafond.fr
// ---------------------------------------------------------------------------
const frenchRules = [
  ...genericRules('stretchplafond.fr', '/portal/login'),
  R('stretchplafond.fr', '/boutique/:path*', SHOP_TARGET),
  R('stretchplafond.fr', '/mon-compte/:path*', '/portal/login'),
  R('stretchplafond.fr', '/panier', SHOP_TARGET),
  R('stretchplafond.fr', '/commande', SHOP_TARGET),
];

// ---------------------------------------------------------------------------
// POLISH / ICELANDIC RULES — thin satellites, generic sweep
// ---------------------------------------------------------------------------
const polishRules = [
  ...genericRules('stretch-sufit.pl'),
  R('stretch-sufit.pl', '/sklep/:path*', SHOP_TARGET),
  R('stretch-sufit.pl', '/moje-konto/:path*', '/portal/login'),
  R('stretch-sufit.pl', '/koszyk', SHOP_TARGET),
];
const icelandicRules = [...genericRules('stretch.is')];

// ---------------------------------------------------------------------------
export const legacyRedirects = [
  ...dutchRules('stretchplafond.be'),
  ...dutchRules('stretchplafond.nl'),
  ...englishRules,
  ...germanRules,
  ...frenchRules,
  ...polishRules,
  ...icelandicRules,
];

export default legacyRedirects;
