// =============================================================================
// INDICATIVE PRICE RANGES — the single public price source.
//
// Feeds (1) the Product JSON-LD (AggregateOffer), (2) the /price-calculator
// estimator, (3) the currency note on the price-guide article. Google requires
// `lowPrice` on an AggregateOffer; without it every product page is flagged
// invalid in Search Console ("Missing field lowPrice"). These ranges are NOT
// the trade pricebook: they are the per-m²-installed figures the site already
// publishes in the public price guide (blog "spanplafond-prijs" — €70–€200/m²
// installed, excl. VAT, with per-type buckets), so search results never claim
// anything the pages themselves don't.
//
// TWO SETTLEMENT CURRENCIES, ONE SOURCE: the Polish domain settles in PLN and
// its price guide (messages/pl.json, blogPosts.posts.spanplafond-prijs)
// publishes its own PLN buckets — 150–450 zł/m² — which are a Polish price
// list, NOT the EUR buckets converted at a rate. Both lists live here so the
// estimator, the JSON-LD and the guide can never disagree. Every other market
// reads the EUR list; non-euro markets that settle in EUR render a local
// "≈" indication beside it (src/lib/currency.ts) — never a forked number.
//
// EDITING: change the numbers here whenever the published guide changes —
// keep both in sync, the guide is the public source of truth. A product with
// NO entry here emits NO Product markup at all (better no rich result than an
// invented price): today that is the inspection hatch and the prefab unit,
// which have no published pricing.
// =============================================================================
import type { SettlementCurrency } from '@/lib/currency';

export type IndicativePriceRange = {
  /** per m² installed, bottom of the published bucket. */
  low: number;
  /** per m² installed, top of the published bucket. */
  high: number;
};

/** The five estimator buckets, in guide order. Labels live in priceCalculatorPage.types.* */
export type BucketKey = 'basic' | 'printed' | 'acoustic' | 'backlit' | 'bathroom';
export const bucketKeys: readonly BucketKey[] = ['basic', 'printed', 'acoustic', 'backlit', 'bathroom'];

export const estimatorBuckets: Record<SettlementCurrency, Record<BucketKey, IndicativePriceRange>> = {
  EUR: {
    // "A basic single-colour PVC or polyester ceiling … around €70 to €90 per m²"
    basic: { low: 70, high: 90 },
    // "A printed design … landing around €90 to €100 per m²"
    printed: { low: 90, high: 100 },
    // "An acoustic ceiling … around €100 to €150 per m²"
    acoustic: { low: 100, high: 150 },
    // "A translucent, backlit ceiling … around €130 to €160 per m²"
    backlit: { low: 130, high: 160 },
    // "Bathroom projects … with integrated lighting typically reach €150 to €200"
    bathroom: { low: 150, high: 200 },
  },
  PLN: {
    // pl.json price guide: "od około 150 zł do 200 zł za m²"
    basic: { low: 150, high: 200 },
    // "około 200 zł do 250 zł za m²"
    printed: { low: 200, high: 250 },
    // "około 250 zł do 350 zł za m²"
    acoustic: { low: 250, high: 350 },
    // "około 300 zł do 400 zł za m²"
    backlit: { low: 300, high: 400 },
    // "sięgają zwykle 350 zł do 450 zł za m²"
    bathroom: { low: 350, high: 450 },
  },
};

/** Overall published span per currency (guide headline: €70–200 / 150–450 zł). */
export const overallRange: Record<SettlementCurrency, IndicativePriceRange> = {
  EUR: { low: estimatorBuckets.EUR.basic.low, high: estimatorBuckets.EUR.bathroom.high },
  PLN: { low: estimatorBuckets.PLN.basic.low, high: estimatorBuckets.PLN.bathroom.high },
};

/** Product slug → estimator bucket. Starry sky spans the backlit floor to the guide's overall top. */
const productBucket: Record<string, BucketKey | 'starry'> = {
  'polyester-stretch-ceiling': 'basic',
  'pvc-stretch-ceiling': 'basic',
  'custom-print': 'printed',
  'acoustic-stretch-system': 'acoustic',
  'light-print-stretch-ceiling': 'backlit',
  'starry-sky': 'starry',
  // NO entries (no published price → no Product markup):
  //   'inspection-hatch'   — unit-priced accessory, pricing on request
  //   'prefab-ceiling-unit' — launching product, pricing on request
};

export function indicativePriceRange(slug: string, currency: SettlementCurrency = 'EUR'): IndicativePriceRange | undefined {
  const bucket = productBucket[slug];
  if (!bucket) return undefined;
  const list = estimatorBuckets[currency];
  if (bucket === 'starry') return { low: list.backlit.low, high: overallRange[currency].high };
  return list[bucket];
}

/** Back-compat view of the EUR list keyed by product slug (used by tests/tools). */
export const indicativePrices: Record<string, IndicativePriceRange> = Object.fromEntries(
  Object.keys(productBucket).map((slug) => [slug, indicativePriceRange(slug, 'EUR')!]),
);
