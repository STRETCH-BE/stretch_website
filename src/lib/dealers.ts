// =============================================================================
// DEALER DIRECTORY — the control panel for /dealers and /dealers/[place].
//
// Phase 1 (Michael, 7 Aug 2026): Flanders + Brussels, Wallonia, Netherlands —
// ±50 place pages that catch "spanplafond <stad>" / "plafond tendu <ville>"
// searches, list the certified dealer(s) for the area, and run a "become our
// dealer in <place>" recruitment variant where no dealer exists yet.
// Source analysis: benelux-dealer-directory-analysis-v3.xlsx.
//
// HOW TO EDIT: add a dealer to DEALERS, then reference its id from the places
// it serves. A place with an empty dealerIds renders the recruitment variant.
// Page copy lives in the `dealersPage` messages namespace (template strings
// with {place}/{province} slots) — nothing to translate when adding places.
// =============================================================================

import { locales, type Locale } from '@/i18n/config';

export type Dealer = {
  id: string;
  name: string;
  /** Dealer link exactly as supplied (may point to a subpage). */
  url: string;
};

export type PlaceKind = 'city' | 'province';
export type DealerRegion = 'flanders' | 'wallonia' | 'netherlands' | 'luxembourg' | 'austria';

export type DealerPlace = {
  slug: string;
  /** Native place name, used in every locale. */
  name: string;
  kind: PlaceKind;
  region: DealerRegion;
  /** Locale whose search market this page primarily targets. */
  primaryLocale: 'be' | 'fr' | 'nl' | 'de';
  /** Parent province slug (cities only). */
  province?: string;
  dealerIds: string[];
  /** Related project slugs (content.ts) shown as local proof. */
  projects?: string[];
};

export const dealers: Dealer[] = [
  { id: 'strak', name: 'Strak Spanplafonds', url: 'https://strak-spanplafonds.be/over-ons/' },
  { id: 'plafondlux', name: 'Plafondlux', url: 'https://plafondlux.be' },
  { id: 'plafon', name: 'Pla-fon', url: 'https://pla-fon.be/' },
  { id: 'parket-valentin', name: 'Parket Valentin', url: 'https://www.parketvalentin.be/stretch-plafonds' },
  { id: 'formdesign', name: 'Formdesign', url: 'https://formdesign.be/' },
  { id: 'corpus', name: 'Corpus Interieur', url: 'https://corpusinterieur.be/' },
  { id: 'flex', name: 'Flex Spanplafonds', url: 'https://www.flex-spanplafonds.be/' },
  { id: 'q82', name: 'Q82 Acoustics', url: 'https://q82acoustics.nl' },
  { id: 'dsc', name: 'De Spanplafond Concurrent', url: 'https://www.despanplafondconcurrent.nl/' },
  { id: 'spannende', name: 'Spannende Plafonds', url: 'https://spannendeplafonds.nl/' },
  { id: 'maas', name: 'Maas Afbouw', url: 'https://maasafbouw.nl/' },
];

export const dealerPlaces: DealerPlace[] = [
  // ---------------------------------------------------------------- Flanders
  // Provinces
  { slug: 'oost-vlaanderen', name: 'Oost-Vlaanderen', kind: 'province', region: 'flanders', primaryLocale: 'be', dealerIds: ['plafondlux', 'parket-valentin', 'formdesign', 'corpus'], projects: ['vp-193', 'vier-emmershof-lokeren', 'van-der-valk-beveren'] },
  { slug: 'provincie-antwerpen', name: 'Antwerpen (provincie)', kind: 'province', region: 'flanders', primaryLocale: 'be', dealerIds: ['strak'], projects: ['polette-eyewear', 'creneau-afas-lounge'] },
  { slug: 'west-vlaanderen', name: 'West-Vlaanderen', kind: 'province', region: 'flanders', primaryLocale: 'be', dealerIds: ['plafon'], projects: [] },
  { slug: 'vlaams-brabant', name: 'Vlaams-Brabant & Brussel', kind: 'province', region: 'flanders', primaryLocale: 'be', dealerIds: ['flex'], projects: ['dhl-zaventem', 'bnp-paribas-fortis'] },
  { slug: 'limburg', name: 'Limburg', kind: 'province', region: 'flanders', primaryLocale: 'be', dealerIds: ['flex'] },
  // Cities
  { slug: 'antwerpen', name: 'Antwerpen', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'provincie-antwerpen', dealerIds: ['strak'], projects: ['polette-eyewear', 'creneau-afas-lounge'] },
  { slug: 'gent', name: 'Gent', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'oost-vlaanderen', dealerIds: ['plafondlux'], projects: ['candor-sint-martens-latem'] },
  { slug: 'roeselare', name: 'Roeselare', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'west-vlaanderen', dealerIds: ['plafon'] },
  { slug: 'brussel', name: 'Brussel', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'vlaams-brabant', dealerIds: [], projects: ['bnp-paribas-fortis'] },
  { slug: 'ninove', name: 'Ninove', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'oost-vlaanderen', dealerIds: ['parket-valentin'] },
  { slug: 'lokeren', name: 'Lokeren', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'oost-vlaanderen', dealerIds: ['plafondlux'], projects: ['vier-emmershof-lokeren'] },
  { slug: 'dendermonde', name: 'Dendermonde', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'oost-vlaanderen', dealerIds: ['formdesign'], projects: ['veta-interieur-showroom'] },
  { slug: 'aalst', name: 'Aalst', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'oost-vlaanderen', dealerIds: ['parket-valentin'] },
  { slug: 'sint-niklaas', name: 'Sint-Niklaas', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'oost-vlaanderen', dealerIds: ['corpus'], projects: ['vap-sint-pauwels', 'ben-home-vdb-222'] },
  { slug: 'brugge', name: 'Brugge', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'west-vlaanderen', dealerIds: ['plafon'], projects: [] },
  { slug: 'leuven', name: 'Leuven', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'vlaams-brabant', dealerIds: ['flex'] },
  { slug: 'hasselt', name: 'Hasselt', kind: 'city', region: 'flanders', primaryLocale: 'be', province: 'limburg', dealerIds: ['flex'] },

  // ---------------------------------------------------------------- Wallonia
  // Provinces
  { slug: 'hainaut', name: 'Hainaut', kind: 'province', region: 'wallonia', primaryLocale: 'fr', dealerIds: [] },
  { slug: 'province-de-liege', name: 'Province de Liège', kind: 'province', region: 'wallonia', primaryLocale: 'fr', dealerIds: [] },
  { slug: 'province-de-namur', name: 'Province de Namur', kind: 'province', region: 'wallonia', primaryLocale: 'fr', dealerIds: [] },
  { slug: 'brabant-wallon', name: 'Brabant wallon', kind: 'province', region: 'wallonia', primaryLocale: 'fr', dealerIds: [] },
  { slug: 'province-de-luxembourg', name: 'Province de Luxembourg', kind: 'province', region: 'wallonia', primaryLocale: 'fr', dealerIds: [] },
  // Cities
  { slug: 'liege', name: 'Liège', kind: 'city', region: 'wallonia', primaryLocale: 'fr', province: 'province-de-liege', dealerIds: [] },
  { slug: 'charleroi', name: 'Charleroi', kind: 'city', region: 'wallonia', primaryLocale: 'fr', province: 'hainaut', dealerIds: [] },
  { slug: 'mons', name: 'Mons', kind: 'city', region: 'wallonia', primaryLocale: 'fr', province: 'hainaut', dealerIds: [] },
  { slug: 'namur', name: 'Namur', kind: 'city', region: 'wallonia', primaryLocale: 'fr', province: 'province-de-namur', dealerIds: [] },
  { slug: 'tournai', name: 'Tournai', kind: 'city', region: 'wallonia', primaryLocale: 'fr', province: 'hainaut', dealerIds: [] },
  { slug: 'wavre', name: 'Wavre', kind: 'city', region: 'wallonia', primaryLocale: 'fr', province: 'brabant-wallon', dealerIds: [] },
  { slug: 'arlon', name: 'Arlon', kind: 'city', region: 'wallonia', primaryLocale: 'fr', province: 'province-de-luxembourg', dealerIds: [] },

  // ------------------------------------------------------------- Netherlands
  // Provinces
  { slug: 'zuid-holland', name: 'Zuid-Holland', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['q82'] },
  { slug: 'noord-holland', name: 'Noord-Holland', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['dsc'] },
  { slug: 'noord-brabant', name: 'Noord-Brabant', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['spannende'] },
  { slug: 'gelderland', name: 'Gelderland', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['q82'] },
  { slug: 'provincie-utrecht', name: 'Utrecht (provincie)', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['spannende'] },
  { slug: 'overijssel', name: 'Overijssel', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['q82'] },
  { slug: 'nederlands-limburg', name: 'Limburg (NL)', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['spannende'] },
  { slug: 'zeeland', name: 'Zeeland', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: ['maas'] },
  { slug: 'flevoland', name: 'Flevoland', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: [] },
  { slug: 'friesland', name: 'Friesland', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: [] },
  { slug: 'groningen', name: 'Groningen', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: [] },
  { slug: 'drenthe', name: 'Drenthe', kind: 'province', region: 'netherlands', primaryLocale: 'nl', dealerIds: [] },
  // Cities
  { slug: 'rotterdam', name: 'Rotterdam', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'zuid-holland', dealerIds: ['q82'] },
  { slug: 'den-haag', name: 'Den Haag', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'zuid-holland', dealerIds: ['q82'] },
  { slug: 'amsterdam', name: 'Amsterdam', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'noord-holland', dealerIds: ['dsc'] },
  { slug: 'eindhoven', name: 'Eindhoven', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'noord-brabant', dealerIds: ['spannende'] },
  { slug: 'tilburg', name: 'Tilburg', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'noord-brabant', dealerIds: ['spannende'] },
  { slug: 'breda', name: 'Breda', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'noord-brabant', dealerIds: ['spannende'] },
  { slug: 'den-bosch', name: 'Den Bosch', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'noord-brabant', dealerIds: ['spannende'] },
  { slug: 'utrecht', name: 'Utrecht', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'provincie-utrecht', dealerIds: ['spannende'] },
  { slug: 'arnhem', name: 'Arnhem', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'gelderland', dealerIds: ['q82'] },
  { slug: 'nijmegen', name: 'Nijmegen', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'gelderland', dealerIds: ['q82'] },
  { slug: 'apeldoorn', name: 'Apeldoorn', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'gelderland', dealerIds: ['q82'] },
  { slug: 'deventer', name: 'Deventer', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'overijssel', dealerIds: ['q82'] },
  { slug: 'maastricht', name: 'Maastricht', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'nederlands-limburg', dealerIds: ['spannende'] },
  { slug: 'venlo', name: 'Venlo', kind: 'city', region: 'netherlands', primaryLocale: 'nl', province: 'nederlands-limburg', dealerIds: ['spannende'] },
  // ------------------------------------------------- Luxembourg (Grand Duchy)
  { slug: 'luxembourg', name: 'Luxembourg (Grand-Duché)', kind: 'province', region: 'luxembourg', primaryLocale: 'fr', dealerIds: [] },
  { slug: 'luxembourg-ville', name: 'Luxembourg-Ville', kind: 'city', region: 'luxembourg', primaryLocale: 'fr', province: 'luxembourg', dealerIds: [] },
  { slug: 'esch-sur-alzette', name: 'Esch-sur-Alzette', kind: 'city', region: 'luxembourg', primaryLocale: 'fr', province: 'luxembourg', dealerIds: [] },
  // ---------------------------------------------------------------- Austria
  { slug: 'wien', name: 'Wien', kind: 'city', region: 'austria', primaryLocale: 'de', dealerIds: [] },
];

// ---------------------------------------------------------------------------
// MARKET COVERAGE — the locales /dealers, /dealers/[place] and
// /installer-training exist on (same idiom as BlogPost.markets). Derived from
// the data — every locale whose market has places listed above — plus the
// locales we deliberately keep the directory + recruitment funnel live on.
// stretchceiling.us is in neither set: there is no US dealer network yet, so
// on `us` these routes 404, stay out of the sitemap and are never advertised
// as an en-US alternate, and the "find a dealer" CTAs swap to the truthful
// direct-installation message (fix round 2, N2). Listing a first US place in
// dealerPlaces (primaryLocale 'us') brings it all back automatically.
// ---------------------------------------------------------------------------
const dataLocales = new Set<Locale>(dealerPlaces.map((p) => p.primaryLocale));
const recruitmentLocales: readonly Locale[] = ['en', 'uk', 'pl', 'es', 'pt', 'da', 'sv', 'no', 'is'];
export const dealerMarkets: readonly Locale[] = locales.filter(
  (l) => dataLocales.has(l) || recruitmentLocales.includes(l),
);
export const isDealerMarket = (l: Locale): boolean => dealerMarkets.includes(l);

export const dealerPlaceSlugs = dealerPlaces.map((p) => p.slug);
export const getDealerPlace = (slug: string): DealerPlace | undefined =>
  dealerPlaces.find((p) => p.slug === slug);
export const getDealer = (id: string): Dealer | undefined => dealers.find((d) => d.id === id);

/** Cities that belong to a province. */
export const provinceCities = (provinceSlug: string): DealerPlace[] =>
  dealerPlaces.filter((p) => p.kind === 'city' && p.province === provinceSlug);

/** Sibling cities in the same province (for the "nearby" block). */
export const nearbyPlaces = (place: DealerPlace): DealerPlace[] => {
  if (place.kind === 'province') return provinceCities(place.slug);
  return dealerPlaces.filter((p) => p.slug !== place.slug && p.province === place.province && p.kind === 'city');
};

/** Dealers for a place; provinces inherit their cities' dealers too. */
export const placeDealers = (place: DealerPlace): Dealer[] => {
  const ids = new Set(place.dealerIds);
  if (place.kind === 'province') {
    for (const c of provinceCities(place.slug)) c.dealerIds.forEach((id) => ids.add(id));
  }
  return [...ids].map((id) => getDealer(id)).filter((d): d is Dealer => Boolean(d));
};
