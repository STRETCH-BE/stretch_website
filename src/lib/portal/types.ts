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
  /** Top-level product family (e.g. "PVC stretch ceilings"). Null on rows
   *  imported before the Type column existed in the workbook. */
  type: string | null;
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
 * producer/reseller partner. `architect` = self-registered specifier account:
 * the architect area (documents, spec texts, budget guide) and NEVER any
 * trade pricing, pricelist or designer. Admins are implicitly trade.
 */
export type AccountType = 'producer' | 'installer' | 'b2c' | 'architect';

export const ACCOUNT_TYPES = ['producer', 'installer', 'b2c', 'architect'] as const;

/**
 * Canonical tier from a stored account_type value. Tolerant of display labels
 * written straight into the database ("Producer/Reseller", "Installer",
 * "B2C", "Architect") and of pre-tier rows ('b2b' → installer). The architect
 * branch MUST come before the installer fallback — an unrecognised architect
 * value falling through to installer would leak trade pricing.
 */
export function normalizeAccountType(raw: unknown): AccountType {
  const v = typeof raw === 'string' ? raw.toLowerCase() : '';
  if (v.includes('architect')) return 'architect';
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
  /** Architect accounts: office name + city from signup. */
  office?: string | null;
  city?: string | null;
  phone?: string | null;
};

/**
 * Trade areas (pricelist, designer, orders) are for the trade tiers and
 * admins ONLY — enumerated on purpose: b2c AND architect are excluded, and a
 * future tier stays locked out until explicitly added here.
 */
export function hasTradeAccess(profile: PortalProfile): boolean {
  return (
    profile.role === 'admin' ||
    profile.accountType === 'producer' ||
    profile.accountType === 'installer'
  );
}

/** The architect area (dashboard, budget guide) — architects and admins. */
export function hasArchitectAccess(profile: PortalProfile): boolean {
  return profile.role === 'admin' || profile.accountType === 'architect';
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

/**
 * The PriceBook group an account tier sees automatically. Architects get
 * NONE — null never matches a row's market, so no pricing is ever visible.
 */
export function priceGroupForTier(tier: AccountType): (typeof PRICE_MARKETS)[number] | null {
  if (tier === 'architect') return null;
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
