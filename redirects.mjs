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
// live crawls of stretch.mt / stretchplafond.nl / stretchceiling.us (8 Aug 2026).
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
// ---------------------------------------------------------------------------
const dutchRules = (h) => [
  // --- commerce (GSC: 731 clicks; catch-alls agreed 6 Aug) ---
  R(h, '/shop/:path*', SHOP_TARGET),
  R(h, '/product/:path*', SHOP_TARGET),
  R(h, '/product-groepen/:path*', SHOP_TARGET),
  R(h, '/winkelmand', SHOP_TARGET),
  R(h, '/cart', SHOP_TARGET),
  R(h, '/checkout', SHOP_TARGET),
  R(h, '/afrekenen', SHOP_TARGET),
  R(h, '/my-account/:path*', '/portal/login'),

  // --- solution / product pages (gap analysis §1.3) ---
  R(h, '/standard-spanplafond', '/products/polyester-stretch-ceiling'),
  R(h, '/pvc-spanplafond', '/products/pvc-stretch-ceiling'),
  R(h, '/acoustic', '/products/acoustic-stretch-system'),
  R(h, '/akoestisch-plafond', '/products/acoustic-stretch-system'),
  R(h, '/akoestische-plafondpanelen', '/products/acoustic-stretch-system'),
  R(h, '/lichtgevend-spanplafonds', '/products/light-print-stretch-ceiling'),
  R(h, '/print', '/products/custom-print'),
  R(h, '/sterrenhemel', '/products/starry-sky'),
  R(h, '/citiznm-spanplafond-prefab-badkamer-unit', '/products/prefab-ceiling-unit'),
  R(h, '/gelakt-plafond', '/products/pvc-stretch-ceiling'),
  R(h, '/klimaat-plafond', '/products/polyester-stretch-ceiling'), // recreate later (GSC 63)
  R(h, '/buiten-plafonds', '/products/pvc-stretch-ceiling'),       // recreate later (GSC 67)
  R(h, '/spanplafond-buiten', '/products/pvc-stretch-ceiling'),    // recreate later (GSC 47)
  R(h, '/sustainable-spanplafond', '/products/polyester-stretch-ceiling'),
  R(h, '/niet-brandbaar-spanplafond', '/technical/polyester/fire-safety'),
  R(h, '/schuin-dak', '/products/polyester-stretch-ceiling'),
  R(h, '/plafondlijsten', '/materials/profiles'),
  R(h, '/plafondbekleding', '/products'),

  // --- walls category (gap analysis §3) ---
  R(h, '/wanden', '/applications/walls'),
  R(h, '/akoestische-wandbekleding-stretch', '/applications/walls'),
  R(h, '/akoestische-wandbekleding', '/applications/walls'),
  R(h, '/textiel-wandbekleding', '/applications/walls'),
  R(h, '/velour-wanden', '/applications/walls'),
  R(h, '/greenkey-wand-ruimte', '/applications/walls'),

  // --- top knowledge-base articles: 35% of ALL clicks (GSC big six) ---
  // Interim targets; each flagged for recreation as /blog/<slug>.
  R(h, '/houten-planchetten-plafond-renoveren-of-vernieuwen', '/products/polyester-stretch-ceiling'), // GSC 734
  R(h, '/scheuren-in-plafond-herstellen', '/products/polyester-stretch-ceiling'),                     // GSC 265
  R(h, '/de-ideale-plafondhoogte', '/faq'),                                                           // GSC 128
  R(h, '/geluidsoverlast-van-uw-bovenburen', '/products/acoustic-stretch-system'),                    // GSC 102
  R(h, '/Knowledge-base/houten-planchetten-plafond-renoveren-of-vernieuwen', '/products/polyester-stretch-ceiling'),
  R(h, '/Knowledge-base/scheuren-in-plafond-herstellen', '/products/polyester-stretch-ceiling'),
  R(h, '/Knowledge-base/de-ideale-plafondhoogte', '/faq'),
  R(h, '/Knowledge-base/geluidsoverlast-van-uw-bovenburen', '/products/acoustic-stretch-system'),
  // Knowledge-base long tail (~50 articles) → technical hub
  R(h, '/Knowledge-base/:path*', '/technical'),
  R(h, '/knowledge-base/:path*', '/technical'),

  // --- local SEO city pages (gap analysis §1.2 → new /dealers/[place]) ---
  R(h, '/spanplafond-antwerpen', '/dealers/antwerpen'),
  R(h, '/spanplafond-limburg', '/dealers/limburg'),
  R(h, '/spanplafond-west-vlaanderen', '/dealers/west-vlaanderen'),
  R(h, '/spanplafond-sint-niklaas', '/dealers/sint-niklaas'),
  R(h, '/spanplafond-ninove', '/dealers/ninove'),
  R(h, '/spanplafond-beveren-waas', '/contact'), // HQ city
  R(h, '/spanplafond-:city', '/dealers'),        // bornem, aartselaar, ternat, tremelo, esse, …

  // --- content & funnel pages ---
  R(h, '/waarom-kiezen-voor-een-spanplafond', '/faq'),
  R(h, '/calculeer-je-eigen-spanplafond', '/contact'),
  R(h, '/bereken-je-spanplafond', '/contact'),
  R(h, '/reseller-worden', '/partners'),
  R(h, '/booking', '/installer-training'),
  R(h, '/stretch-spanplafond-training-inplannen', '/installer-training'),
  R(h, '/jobs', '/about'),
  R(h, '/jobs/:path*', '/about'),
  R(h, '/privacy-policy', '/privacy'),
  R(h, '/algemene-voorwaarden', '/terms'),

  // --- uploads: pricelists exposed dealer pricing → all PDFs off-index ---
  R(h, '/wp-content/uploads/:path*', '/datasheets'),
];

// ---------------------------------------------------------------------------
// GENERIC WOO/WP RULES — for hosts whose localized slugs are not yet inventoried
// ---------------------------------------------------------------------------
const genericRules = (h, account = '/portal/login') => [
  R(h, '/shop/:path*', SHOP_TARGET),
  R(h, '/product/:path*', SHOP_TARGET),
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
  R('stretch.mt', '/Knowledge-base/:path*', '/technical'),
  R('stretch.mt', '/knowledge-base/:path*', '/technical'),
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
