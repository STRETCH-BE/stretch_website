// ============================================================================
// LEGACY REDIRECT MAP — WordPress multisite → Next.js, all domains at once.
// Imported by next.config.mjs:  async redirects() { return legacyRedirects; }
//
// Host-scoped: Vercel's domain-level 308s preserve paths, so legacy URLs from
// stretch-ceilings.uk / stretchceiling.us land on stretch.mt (English rules)
// and stretchdecken.at / stretchgroup.ch / stretchgroup.li land on
// stretchdecken.de (German rules); stretchdecken.ch is its own site since 2 Sep
// 2026 (Swiss rules below). Host groups cover every domain the group owns.
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

import { createRequire } from 'node:module';

const host = (h) => [{ type: 'host', value: h }];
const R = (h, source, destination) => ({
  source,
  has: host(h),
  destination,
  permanent: true,
});

// ---------------------------------------------------------------------------
// PER-LOCALE BLOG SLUGS (per-market audit 2 Sep 2026, defect 1). Every locale
// used to serve its translated article at the canonical (Dutch) slug; a locale
// listed in src/lib/blog-slugs.json now serves its OWN slug and the old path
// must 301. The rules are derived from the SAME JSON the app reads (via
// src/lib/blog-slugs.ts), so the redirect map and the routes cannot drift.
// `be`/`nl` are never in the map — their Dutch URLs rank and stay.
// Each host's rules are spread BEFORE that host's genericRules spread
// (first match wins; a /blog path never collides with the shop catch-alls,
// but the ordering discipline is the same as for the kit rules).
// ---------------------------------------------------------------------------
const requireJson = createRequire(import.meta.url);
const BLOG_SLUGS = requireJson('./src/lib/blog-slugs.json');
/** The host's own path for a canonical blog slug (avoids a two-hop chain through the slug 301). */
const blog = (locale, canonical) => `/blog/${(BLOG_SLUGS[canonical] && BLOG_SLUGS[canonical][locale]) || canonical}`;
const blogSlugRules = (h, locale) =>
  Object.entries(BLOG_SLUGS).flatMap(([canonical, perLocale]) => {
    const own = perLocale[locale];
    return own && own !== canonical ? [R(h, `/blog/${canonical}`, `/blog/${own}`)] : [];
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
  // Old calculator pages → the public estimator (they went to /contact
  // until the calculator existed — per-market audit 2 Sep 2026, T6).
  R(h, '/calculeer-je-eigen-spanplafond', '/price-calculator'),
  R(h, '/bereken-je-spanplafond', '/price-calculator'),
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
// ENGLISH RULES — stretch.mt (also receives legacy .us paths via 308)
// ---------------------------------------------------------------------------
const englishRules = [
  // Kit rules FIRST — they must outrank genericRules' /product-category and
  // /shop catch-alls (first match wins; a rule appended after the spread can
  // never fire). The kit category is the highest-value legacy URL set.
  R('stretch.mt', '/product-category/stretch-kits/:path*', '/kit'),
  R('stretch.mt', '/product-category/stretch-kit/:path*', '/kit'),
  R('stretch.mt', '/stretch-ceiling-kit', '/kit'),
  R('stretch.mt', '/diy-stretch-ceiling-kit', '/kit'),
  ...blogSlugRules('stretch.mt', 'en'),
  ...genericRules('stretch.mt'),
  R('stretch.mt', '/soluzzjonijiet', '/products'),
  R('stretch.mt', '/warranty-repair-and-returns', '/faq'),
  R('stretch.mt', '/terms-and-conditions', '/terms'),
  R('stretch.mt', '/customer-service', '/contact'),
  R('stretch.mt', '/Knowledge-base/:path*', '/datasheets'),
  R('stretch.mt', '/knowledge-base/:path*', '/datasheets'),
];

// ---------------------------------------------------------------------------
// UK RULES — stretch-ceilings.uk. Was a domain-level 308 → stretch.mt until the
// uk locale went live (Aug 2026); once the domain is attached to the project
// these host-scoped rules absorb the old WordPress-era .uk paths directly.
// ---------------------------------------------------------------------------
const ukRules = [
  // Kit rules FIRST — /product-category/stretch-kits ranks #3 for "stretch
  // ceiling kit" (~2/3 of all UK clicks) and must land on /kit, not the
  // generic /materials hub. Must precede the genericRules spread.
  R('stretch-ceilings.uk', '/product-category/stretch-kits/:path*', '/kit'),
  R('stretch-ceilings.uk', '/product-category/stretch-kit/:path*', '/kit'),
  R('stretch-ceilings.uk', '/stretch-ceiling-kit', '/kit'),
  R('stretch-ceilings.uk', '/diy-stretch-ceiling-kit', '/kit'),
  ...blogSlugRules('stretch-ceilings.uk', 'uk'),
  ...genericRules('stretch-ceilings.uk'),
  R('stretch-ceilings.uk', '/warranty-repair-and-returns', '/faq'),
  R('stretch-ceilings.uk', '/terms-and-conditions', '/terms'),
  R('stretch-ceilings.uk', '/customer-service', '/contact'),
  R('stretch-ceilings.uk', '/Knowledge-base/:path*', '/datasheets'),
  R('stretch-ceilings.uk', '/knowledge-base/:path*', '/datasheets'),
];

// ---------------------------------------------------------------------------
// GERMAN RULES — stretchdecken.de (also receives .at / .ch / .li paths via 308)
// Content block added 22 Aug 2026: the old-site DE URL set was still 404ing
// (only the shop sweep existed) while Google keeps the URLs indexed —
// inventory from the ranking analysis, statuses verified live that day.
// ---------------------------------------------------------------------------
const germanRules = [
  ...blogSlugRules('stretchdecken.de', 'de'),
  ...genericRules('stretchdecken.de', '/portal/login'),
  R('stretchdecken.de', '/mein-konto/:path*', '/portal/login'),
  R('stretchdecken.de', '/warenkorb', SHOP_TARGET),
  R('stretchdecken.de', '/kasse', SHOP_TARGET),
  R('stretchdecken.de', '/produkt-kategorie/:path*', SHOP_TARGET),
  // --- legacy content URLs (22 Aug 2026 sweep) ---
  R('stretchdecken.de', '/nicht-brennbare-spanndecke', '/technical/polyester/fire-safety'),
  R('stretchdecken.de', '/pvc-spanndecke', '/products/pvc-stretch-ceiling'),
  R('stretchdecken.de', '/spanndecke-aus-polyester', '/products/polyester-stretch-ceiling'),
  R('stretchdecken.de', '/lichtdecke', '/products/light-print-stretch-ceiling'),
  // old FAQ page (carried the €75–80/m² price answer)
  R('stretchdecken.de', '/loesungen-de', '/faq'),
  // the old plain-language guide → its recreation
  R('stretchdecken.de', '/spanndecke', blog('de', 'what-is-a-stretch-ceiling')),
  R('stretchdecken.de', '/decke', '/products'),
  R('stretchdecken.de', '/stretch-spanndecken-de', '/products'),
  // e-learning playlist page → training
  R('stretchdecken.de', '/spanndecken-youtube', '/installer-training'),
];

// ---------------------------------------------------------------------------
// FRENCH RULES — stretchplafond.fr
// Content block added 22 Aug 2026 (same sweep). NOTE: the specific
// /product-category/... deep rule must come BEFORE the genericRules spread —
// Next.js redirects are first-match-wins.
// ---------------------------------------------------------------------------
const frenchRules = [
  // 495D acoustic roll — the one shop URL that earned clicks (45/yr)
  R('stretchplafond.fr', '/product-category/tissus-stretch/plafond-tendu-en-rouleau', '/materials/fabrics'),
  ...blogSlugRules('stretchplafond.fr', 'fr'),
  ...genericRules('stretchplafond.fr', '/portal/login'),
  R('stretchplafond.fr', '/boutique/:path*', SHOP_TARGET),
  R('stretchplafond.fr', '/mon-compte/:path*', '/portal/login'),
  R('stretchplafond.fr', '/panier', SHOP_TARGET),
  R('stretchplafond.fr', '/commande', SHOP_TARGET),
  // --- legacy content URLs (22 Aug 2026 sweep) ---
  // the traffic carrier (65% of all .fr clicks) → its /blog recreation
  R('stretchplafond.fr', '/decouvrez-les-avantages-du-plafond-tendu', blog('fr', 'plafond-tendu-avantages-et-inconvenients')),
  R('stretchplafond.fr', '/plafond-tendu-acoustique', '/products/acoustic-stretch-system'),
  R('stretchplafond.fr', '/plafond-tendu-en-pvc', '/products/pvc-stretch-ceiling'),
  R('stretchplafond.fr', '/plafond-tendu-textile-polyester', '/products/polyester-stretch-ceiling'),
  R('stretchplafond.fr', '/plafond-tendu-lumineux', '/products/light-print-stretch-ceiling'),
  R('stretchplafond.fr', '/plafond-tendu-brillant', '/products/pvc-stretch-ceiling'),
  R('stretchplafond.fr', '/plafond-tendu-salle-de-bains', '/applications/bathroom-kitchen'),
  R('stretchplafond.fr', '/plafond-tendu-salon', '/applications/living-cinema'),
  R('stretchplafond.fr', '/revetement-de-plafond', '/products'),
  R('stretchplafond.fr', '/plafond-tendu-standard', '/products/polyester-stretch-ceiling'),
  R('stretchplafond.fr', '/solutions', '/products'),
  R('stretchplafond.fr', '/plafonds', '/products'),
  R('stretchplafond.fr', '/nouvelles-et-mises-a-jour', '/blog'),
  // old dealer-recruitment page → partners
  R('stretchplafond.fr', '/devenir-revendeur-plafond-tendu', '/partners'),
  R('stretchplafond.fr', '/plafond-tendu-youtube', '/installer-training'),
];

// ---------------------------------------------------------------------------
// POLISH RULES — stretch-sufit.pl
// Content block added 22 Aug 2026 (same sweep): the old Polish site had a
// full content URL set, not just a shop. Pricelist URLs go to the portal —
// trade pricing is login-gated on the new site.
// ---------------------------------------------------------------------------
const polishRules = [
  ...blogSlugRules('stretch-sufit.pl', 'pl'),
  ...genericRules('stretch-sufit.pl'),
  R('stretch-sufit.pl', '/sklep/:path*', SHOP_TARGET),
  R('stretch-sufit.pl', '/moje-konto/:path*', '/portal/login'),
  R('stretch-sufit.pl', '/koszyk', SHOP_TARGET),
  // --- legacy content URLs (22 Aug 2026 sweep) ---
  R('stretch-sufit.pl', '/sufit-napinany-pvc', '/products/pvc-stretch-ceiling'),
  R('stretch-sufit.pl', '/tekstylny-sufit-napinany', '/products/polyester-stretch-ceiling'),
  R('stretch-sufit.pl', '/blyszczacy-sufit-napinany', '/products/pvc-stretch-ceiling'),
  R('stretch-sufit.pl', '/akustyczny-sufit-napinany', '/products/acoustic-stretch-system'),
  R('stretch-sufit.pl', '/swiecacy-sufit-napinany', '/products/light-print-stretch-ceiling'),
  R('stretch-sufit.pl', '/oswietlenie-sufitowe-napinane', '/products/prefab-lighting-elements'),
  R('stretch-sufit.pl', '/standardowy-sufit-napinany', '/products/polyester-stretch-ceiling'),
  // old FAQ page (carried the PLN price answer)
  R('stretch-sufit.pl', '/rozwiazania-sufitow-napinanych', '/faq'),
  R('stretch-sufit.pl', '/sufity', '/products'),
  // calculator → the public estimate page
  R('stretch-sufit.pl', '/kalkulator-sufitow-napinanych', '/price-calculator'),
  // public PLN pricelist pages → portal (trade pricing is login-gated now)
  R('stretch-sufit.pl', '/cennik-sufitow-napinanych-2', '/portal/login'),
  R('stretch-sufit.pl', '/cennik-sufitow-napinanych', '/portal/login'),
  R('stretch-sufit.pl', '/plan-treningowy-z-sufitem-napinanym', '/installer-training'),
  // e-learning playlist page → training
  R('stretch-sufit.pl', '/sufity-napinane-youtube', '/installer-training'),
];
// ---------------------------------------------------------------------------
// US RULES — stretchceiling.us. Effective once the Vercel domain-level
// redirect to stretch.mt is removed and the domain is attached to the
// project (audit 30 Aug 2026, F13). Content rules BEFORE the generic spread.
// Known old .us URLs still surfacing in search; awaiting the GSC URL export
// for stretchceiling.us to complete the map.
// ---------------------------------------------------------------------------
const usRules = [
  R('stretchceiling.us', '/shop/stretch-kits/stretch-fabric-stretch-ceiling-kit/:path*', '/kit'),
  R('stretchceiling.us', '/shop/stretch-kits/:path*', '/kit'),
  R('stretchceiling.us', '/spanplafond-laten-plaatsen', '/products'),
  ...blogSlugRules('stretchceiling.us', 'us'),
  ...genericRules('stretchceiling.us'),
];

// ---------------------------------------------------------------------------
// ICELANDIC RULES — stretch.is. Content rules BEFORE the generic spread.
// Seeded from the URLs confirmed as previously indexed (network audit 30 Aug
// 2026, F5): /dukaloft was the old site's strongest page (~312 clicks/yr at
// position ~4). Awaiting the GSC "All known pages" export for stretch.is to
// map the remaining legacy URLs the way dutchRules/germanRules were built.
// ---------------------------------------------------------------------------
const icelandicRules = [
  R('stretch.is', '/dukaloft', '/products/pvc-stretch-ceiling'),
  R('stretch.is', '/sjalfbaert-dukaloft', '/products/polyester-stretch-ceiling'),
  ...blogSlugRules('stretch.is', 'is'),
  ...genericRules('stretch.is'),
];

// ---------------------------------------------------------------------------
// SPANISH / PORTUGUESE / NORDIC RULES — these hosts had no legacy map yet;
// they carry only the per-locale blog slug 301s (2 Sep 2026) plus the
// generic WP/Woo sweep, in that order.
// ---------------------------------------------------------------------------
const spanishRules = [...blogSlugRules('stretchtecho.es', 'es'), ...genericRules('stretchtecho.es')];
const portugueseRules = [...blogSlugRules('stretchteto.pt', 'pt'), ...genericRules('stretchteto.pt')];
const danishRules = [...blogSlugRules('straekloft.dk', 'da'), ...genericRules('straekloft.dk')];
const swedishRules = [...blogSlugRules('stretchceilings.se', 'sv'), ...genericRules('stretchceilings.se')];
const norwegianRules = [...blogSlugRules('stretchtak.no', 'no'), ...genericRules('stretchtak.no')];

// ---------------------------------------------------------------------------
// SWISS RULES — stretchdecken.ch (de-CH, QuinLay AG, 2 Sep 2026). The .ch host
// used to be stretchgroup.ch redirecting to .de; the blog slugs are the German
// ones, then the generic WP/Woo sweep.
//   stretchdecken.li  → stretchdecken.ch (root → the Vaduz / Liechtenstein
//                       place page, everything else path-preserving)
//   stretchgroup.ch / stretchgroup.li → stretchdecken.ch — Michael points
//                       them there at the registrar; these host rules are the
//                       safety net should either host ever reach Vercel.
// All absolute-destination 308s; the .at → .de redirect stays at Vercel level.
// ---------------------------------------------------------------------------
const swissRules = [...blogSlugRules('stretchdecken.ch', 'ch'), ...genericRules('stretchdecken.ch')];
const CH_ORIGIN = 'https://stretchdecken.ch';
const swissHostRedirects = [
  R('stretchdecken.li', '/', `${CH_ORIGIN}/dealers/vaduz`),
  R('stretchdecken.li', '/:path*', `${CH_ORIGIN}/:path*`),
  R('www.stretchdecken.li', '/', `${CH_ORIGIN}/dealers/vaduz`),
  R('www.stretchdecken.li', '/:path*', `${CH_ORIGIN}/:path*`),
  R('stretchgroup.ch', '/:path*', `${CH_ORIGIN}/:path*`),
  R('www.stretchgroup.ch', '/:path*', `${CH_ORIGIN}/:path*`),
  R('stretchgroup.li', '/:path*', `${CH_ORIGIN}/:path*`),
  R('www.stretchgroup.li', '/:path*', `${CH_ORIGIN}/:path*`),
];

// ---------------------------------------------------------------------------
// LOCALE-PREFIX STRIPS — each domain 308s its own locale prefix to the clean
// URL (/de/kit on stretchdecken.de → /kit). The next-intl middleware does
// this too, but with a 307 Temporary — wrong signal for URLs that moved
// permanently when internal links went unprefixed (ranking audit §1.3).
// These config-level rules run BEFORE the middleware and win with a 308.
// Host-scoped, so localhost/preview path-prefix routing is untouched.
// ---------------------------------------------------------------------------
const LOCALE_DOMAINS = [
  ['stretch.mt', 'en'],
  ['stretch-ceilings.uk', 'uk'],
  ['stretchceiling.us', 'us'],
  ['stretchplafond.be', 'be'],
  ['stretchplafond.nl', 'nl'],
  ['stretchplafond.fr', 'fr'],
  ['stretch-sufit.pl', 'pl'],
  ['stretchdecken.de', 'de'],
  ['stretchdecken.ch', 'ch'],
  ['stretchtecho.es', 'es'],
  ['stretchteto.pt', 'pt'],
  ['straekloft.dk', 'da'],
  ['stretchceilings.se', 'sv'],
  ['stretchtak.no', 'no'],
  ['stretch.is', 'is'],
];
const localePrefixStrips = LOCALE_DOMAINS.flatMap(([h, l]) => [
  R(h, `/${l}`, '/'),
  R(h, `/${l}/:path*`, '/:path*'),
]);

// ---------------------------------------------------------------------------
export const legacyRedirects = [
  ...localePrefixStrips,
  ...dutchRules('stretchplafond.be'),
  ...dutchRules('stretchplafond.nl'),
  ...englishRules,
  ...ukRules,
  ...usRules,
  ...germanRules,
  ...frenchRules,
  ...polishRules,
  ...icelandicRules,
  ...spanishRules,
  ...portugueseRules,
  ...danishRules,
  ...swedishRules,
  ...norwegianRules,
  ...swissRules,
  ...swissHostRedirects,
];

export default legacyRedirects;
