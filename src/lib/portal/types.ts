// ============================================================================
// CLIENT PORTAL — shared types & constants
//
// The portal serves the STRETCH trade pricelist (and, later, more client data)
// behind a login. Data model mirrors the "PriceBook" sheet of the Alto Pricing
// System workbook — STRIPPED of every internal column (margin %, cost build-up
// etc.). Those never leave the Excel file: they are not parsed, not stored,
// not transmitted.
// ============================================================================

/** One product × market price row — the only pricing data the portal knows. */
export type PriceRow = {
  category: string;
  code: string | null;
  product: string;
  unit: string | null;
  /** Price group the row belongs to (market / tier / channel). */
  market: string;
  price_eur: number;
  price_pln: number | null;
  /** Optional visual grouping inside a category (brand for foils/ceilings). */
  product_group: string | null;
  /**
   * Occurrence number (1, 2, …) among rows sharing Category+Product+Market.
   * The Excel PriceBook contains same-named rows that are genuinely different
   * products (e.g. roll width bands) — seq keeps them apart in the database.
   */
  seq: number;
  /** Preserves the PriceBook row order for display. */
  sort: number;
};

export type PricebookMeta = {
  version: string;
  fx_eur_pln: number | null;
  source: string | null;
  updated_at: string;
};

export type PortalRole = 'client' | 'admin';

/**
 * Account tier. `b2c` = self-registered consumer account: own account area,
 * but NO trade pricing and NO designer. The two trade tiers (created by an
 * admin, or a b2c account upgraded by an admin) get market-based pricing
 * visibility: `installer` buys and installs; `producer` is a
 * producer/reseller partner. Admins are implicitly trade.
 */
export type AccountType = 'producer' | 'installer' | 'b2c';

export const ACCOUNT_TYPES = ['producer', 'installer', 'b2c'] as const;

/**
 * Canonical tier from a stored account_type value. Tolerant of display labels
 * written straight into the database ("Producer/Reseller", "Installer",
 * "B2C") and of pre-tier rows ('b2b' → installer).
 */
export function normalizeAccountType(raw: unknown): AccountType {
  const v = typeof raw === 'string' ? raw.toLowerCase() : '';
  if (v.includes('producer') || v.includes('reseller')) return 'producer';
  if (v === 'b2c') return 'b2c';
  return 'installer';
}

export type PortalProfile = {
  id: string;
  email: string;
  company: string | null;
  role: PortalRole;
  accountType: AccountType;
  /** Price groups this account may see (ignored when allMarkets). */
  markets: string[];
  allMarkets: boolean;
  active: boolean;
};

/** Trade areas (pricelist, designer) are for trade tiers and admins only. */
export function hasTradeAccess(profile: PortalProfile): boolean {
  return profile.role === 'admin' || profile.accountType !== 'b2c';
}

export type PortalSession = {
  profile: PortalProfile;
  /** True when running without Supabase (zero-config preview mode). */
  demo: boolean;
};

/**
 * Every price group in the PriceBook. Since Alto Pricing System v2.4 the
 * groups ARE the account tiers: each product carries one price per tier, and
 * an account automatically sees the group matching its tier (see
 * priceGroupForTier). Extra groups can still be granted per-account via
 * markets[] — e.g. show an installer the producer pricing too.
 */
export const PRICE_MARKETS = ['Producer/Reseller', 'Installer', 'B2C'] as const;

/** The PriceBook group an account tier sees automatically. */
export function priceGroupForTier(tier: AccountType): (typeof PRICE_MARKETS)[number] {
  if (tier === 'producer') return 'Producer/Reseller';
  if (tier === 'b2c') return 'B2C';
  return 'Installer';
}

/** Category display order (matches the PriceBook / mockup ordering). */
export const CATEGORY_ORDER = [
  'Ceilings made-to-measure',
  'Rolls PVC foil',
  'Foil cut to length',
  'Profiles ALU/PVC',
  'Profile accessories',
  'Accessories PVC',
  'Tracklighting 48V',
] as const;

export function categoryRank(category: string): number {
  const i = (CATEGORY_ORDER as readonly string[]).indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

/** Designer order lifecycle (designer_orders.status). Client-safe constants. */
export const ORDER_STATUSES = ['received', 'confirmed', 'in_production', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Result of syncing an uploaded PriceBook against the database. */
export type SyncReport = {
  total: number;
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
  skipped: string[];
  version: string;
  persisted: boolean;
};
