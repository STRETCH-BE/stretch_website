// =============================================================================
// INDICATIVE PRICE RANGES — feeds the Product JSON-LD (AggregateOffer).
//
// Google requires `lowPrice` on an AggregateOffer; without it every product
// page is flagged invalid in Search Console ("Missing field lowPrice"). These
// ranges are NOT the trade pricebook: they are the per-m²-installed figures
// the site already publishes in the public price guide
// (blog "spanplafond-prijs" — €70–€200/m² installed, excl. VAT, with per-type
// buckets), so search results never claim anything the pages themselves don't.
//
// EDITING: change the numbers here whenever the published guide changes —
// keep both in sync, the guide is the public source of truth. A product with
// NO entry here emits NO Product markup at all (better no rich result than an
// invented price): today that is the inspection hatch and the prefab unit,
// which have no published pricing.
// =============================================================================

export type IndicativePriceRange = {
  /** €/m² installed, bottom of the published bucket. */
  low: number;
  /** €/m² installed, top of the published bucket. */
  high: number;
};

export const indicativePrices: Record<string, IndicativePriceRange> = {
  // "A basic single-colour PVC or polyester ceiling … around €70 to €90 per m²"
  'polyester-stretch-ceiling': { low: 70, high: 90 },
  'pvc-stretch-ceiling': { low: 70, high: 90 },
  // "A printed design … landing around €90 to €100 per m²"
  'custom-print': { low: 90, high: 100 },
  // "An acoustic ceiling … around €100 to €150 per m²"
  'acoustic-stretch-system': { low: 100, high: 150 },
  // "A translucent, backlit ceiling … around €130 to €160 per m²"
  'light-print-stretch-ceiling': { low: 130, high: 160 },
  // Starry sky = the backlit bucket's floor up to the guide's published
  // overall top ("…with integrated lighting typically reach €150 to €200").
  'starry-sky': { low: 130, high: 200 },
  // NO entries (no published price → no Product markup):
  //   'inspection-hatch'   — unit-priced accessory, pricing on request
  //   'prefab-ceiling-unit' — launching product, pricing on request
};

export function indicativePriceRange(slug: string): IndicativePriceRange | undefined {
  return indicativePrices[slug];
}
