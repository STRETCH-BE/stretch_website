// ============================================================================
// CURRENCY — control panel for the GBP *indication*.
//
// POLICY (locked 22 Aug 2026): all prices, invoices and payments are in EUR
// (PLN for Poland). GBP is DISPLAY-ONLY — a courtesy indication for UK
// visitors, never a settlement amount.
//
// MAINTENANCE: `gbpPerEur` is the ECB reference rate, maintained BY HAND —
// never fetched live. Check monthly (or when the rate moves >2%) and update
// BOTH values. A stale rate misleads but never mischarges: nothing financial
// reads this file.
//
// KIT_RETAIL_PRICE_EUR: the public retail price of the DIY kit. Deliberately
// unset (null) → the /kit page runs in price-on-request mode. Setting a
// number here is a conscious exception to the "dealer prices are never
// public" rule that only Michael makes.
// ============================================================================

export const gbpPerEur = 0.86;
export const asOf = '2026-08-22';

export const KIT_RETAIL_PRICE_EUR: number | null = null;

/** "≈ £51.70" — thin-space thousands, 2 decimals, always marked approximate. */
export function formatGbpIndication(eur: number): string {
  const gbp = eur * gbpPerEur;
  const fixed = gbp.toFixed(2);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `≈ £${grouped}.${dec}`;
}

/** "€1 950.00" — matching EUR formatting for the dominant amount. */
export function formatEur(eur: number): string {
  const fixed = eur.toFixed(2);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `€${grouped}.${dec}`;
}
