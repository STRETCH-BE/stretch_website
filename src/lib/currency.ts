// ============================================================================
// CURRENCY — control panel for the DISPLAY currency per market.
//
// POLICY (locked 22 Aug 2026, generalised 2 Sep 2026 — per-market audit,
// defect 4): ALL prices, invoices and payments are in EUR — PLN for Poland.
// Nothing in this file changes that. Every other currency on the public site
// is DISPLAY-ONLY: a courtesy indication for the visitor's market, always
// marked approximate, never a settlement amount. No settlement path (portal
// pricelist, orders, invoices, the PLN pricebook) reads the rate table below.
//
// MAINTENANCE: `ratesPerEur` are ECB euro reference rates, maintained BY HAND
// — never fetched live, so two consecutive builds always render identical
// figures. Check monthly (or when a rate moves >2%) on ecb.europa.eu and
// update BOTH the rate and `asOf`. A stale rate misleads but never mischarges.
//
// SEEDED 2 Sep 2026 from ECB reference levels. The build sandbox could not
// reach the ECB feed (egress-blocked), so verify the eight values against
// https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml before the
// first deploy and bump `asOf` to the day you checked.
//
// KIT_RETAIL_PRICE_EUR: the public retail price of the DIY kit. Deliberately
// unset (null) → the /kit page runs in price-on-request mode. Setting a
// number here is a conscious exception to the "dealer prices are never
// public" rule that only Michael makes.
// ============================================================================
import { localeFullCodes, type Locale } from '@/i18n/config';

export type DisplayCurrency = 'EUR' | 'PLN' | 'GBP' | 'USD' | 'DKK' | 'SEK' | 'NOK' | 'ISK' | 'CHF';

/** Settlement currencies: what invoices are actually issued in. */
export type SettlementCurrency = 'EUR' | 'PLN';

export const asOf = '2026-09-02';

/** ECB reference rate: 1 EUR = n units of the currency. Hand-maintained. */
export const ratesPerEur: Record<Exclude<DisplayCurrency, 'EUR'>, number> = {
  GBP: 0.86,
  USD: 1.17,
  DKK: 7.46,
  SEK: 11.05,
  NOK: 11.65,
  ISK: 143,
  // Switzerland has no locale of its own yet (.ch still redirects to .de).
  // The rate is ready; it activates the day a `ch` locale is added to
  // `policies` below — nothing else to change.
  CHF: 0.94,
  // PLN is a SETTLEMENT currency for Poland. It is listed here only so that
  // an EUR-denominated public figure (e.g. the kit retail price, if ever set)
  // can be shown with a PLN indication. The Polish indicative m² buckets are
  // NOT derived from this rate — they are published in PLN in
  // src/lib/indicative-prices.ts, and the portal's PLN trade prices come
  // from the pricebook.
  PLN: 4.27,
};

/** Kept for the portal's GBP indication (PricelistView) — same value, one source. */
export const gbpPerEur = ratesPerEur.GBP;

export const KIT_RETAIL_PRICE_EUR: number | null = null;

// ---------------------------------------------------------------------------
// Per-locale DISPLAY policy.
//   'eur'         euro market — EUR only, nothing beside it.
//   'indication'  non-euro market that settles in EUR — EUR stays the dominant
//                 amount, the local currency renders beside it as "≈ …",
//                 exactly like the UK GBP treatment (22 Aug 2026).
//   'settlement'  Poland — PLN is the settlement currency, so PLN figures are
//                 the primary amount (from the PLN price list), never an
//                 approximation of a euro figure.
// ---------------------------------------------------------------------------
export type DisplayMode = 'eur' | 'indication' | 'settlement';
export type DisplayPolicy = { currency: DisplayCurrency; mode: DisplayMode };

const policies: Partial<Record<Locale, DisplayPolicy>> = {
  da: { currency: 'DKK', mode: 'indication' },
  sv: { currency: 'SEK', mode: 'indication' },
  no: { currency: 'NOK', mode: 'indication' },
  is: { currency: 'ISK', mode: 'indication' },
  uk: { currency: 'GBP', mode: 'indication' },
  us: { currency: 'USD', mode: 'indication' },
  pl: { currency: 'PLN', mode: 'settlement' },
  // ch: { currency: 'CHF', mode: 'indication' },  ← when a Swiss locale exists
};

export function displayPolicyFor(locale: Locale): DisplayPolicy {
  return policies[locale] ?? { currency: 'EUR', mode: 'eur' };
}

/** The currency shown to a visitor of this locale (display, not settlement). */
export function displayCurrencyFor(locale: Locale): DisplayCurrency {
  return displayPolicyFor(locale).currency;
}

/** The currency invoices are issued in for this locale: PLN in Poland, EUR everywhere else. */
export function settlementCurrencyFor(locale: Locale): SettlementCurrency {
  return displayPolicyFor(locale).mode === 'settlement' ? 'PLN' : 'EUR';
}

/** True when the locale shows a local "≈" indication beside the EUR amount. */
export function hasIndication(locale: Locale): boolean {
  return displayPolicyFor(locale).mode === 'indication';
}

export function convertFromEur(eur: number, currency: DisplayCurrency): number {
  return currency === 'EUR' ? eur : eur * ratesPerEur[currency];
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------
const ZERO_DECIMAL: ReadonlySet<DisplayCurrency> = new Set(['ISK']);

/**
 * Locale-aware currency formatting ("522 kr.", "$1,234", "1 950 €", "150 zł").
 * `fractionDigits` defaults to 0 (indicative figures are never shown to the
 * cent); ISK never carries decimals.
 */
export function formatMoney(
  amount: number,
  currency: DisplayCurrency,
  locale: Locale,
  fractionDigits = 0,
): string {
  const digits = ZERO_DECIMAL.has(currency) ? 0 : fractionDigits;
  return new Intl.NumberFormat(localeFullCodes[locale] ?? 'en', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** "€70–€90/m²" style range in the given currency. */
export function formatRangePerM2(low: number, high: number, currency: DisplayCurrency, locale: Locale): string {
  return `${formatMoney(low, currency, locale)}–${formatMoney(high, currency, locale)}/m²`;
}

/**
 * The local-currency indication for a EUR amount on an 'indication' locale:
 * "≈ 522 kr." — always prefixed with ≈ so it can never be read as a
 * settlement amount. Returns null on euro markets and on Poland (where PLN
 * figures are primary, never an approximation).
 */
export function formatIndication(eur: number, locale: Locale, fractionDigits = 0): string | null {
  const policy = displayPolicyFor(locale);
  if (policy.mode !== 'indication') return null;
  return `≈ ${formatMoney(convertFromEur(eur, policy.currency), policy.currency, locale, fractionDigits)}`;
}

/** Same as formatIndication, for a low–high EUR range: "≈ 522–671 kr.". */
export function formatIndicationRange(lowEur: number, highEur: number, locale: Locale): string | null {
  const policy = displayPolicyFor(locale);
  if (policy.mode !== 'indication') return null;
  const c = policy.currency;
  return `≈ ${formatMoney(convertFromEur(lowEur, c), c, locale)}–${formatMoney(convertFromEur(highEur, c), c, locale)}`;
}

/** "≈ £51.70" — thin-space thousands, 2 decimals, always marked approximate. (Portal GBP indication.) */
export function formatGbpIndication(eur: number): string {
  const gbp = eur * gbpPerEur;
  const fixed = gbp.toFixed(2);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `≈ £${grouped}.${dec}`;
}

/** "€1 950.00" — matching EUR formatting for the dominant amount. */
export function formatEur(eur: number): string {
  const fixed = eur.toFixed(2);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `€${grouped}.${dec}`;
}
