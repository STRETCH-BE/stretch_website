// ============================================================================
// KIT CONFIGURATOR — option catalogue access and pricebook resolution.
//
// resolveOption() is the ONLY place an option becomes a price. It never
// fuzzy-matches, never falls back to another market and never substitutes a
// similar product: a missing row and a missing price are first-class states
// that travel to the UI as "price on request".
// ============================================================================
import type { PriceRow } from '../types';
import { createServiceClient } from '../supabase';
import type { ConfiguratorOption, OptionKind, ResolvedOption } from './types';

/** Columns of configurator_options, in one place. */
const OPTION_COLUMNS =
  'id, kind, slug, label, description, match_code, match_category, match_product, match_seq, ' +
  'material, finish, colour_group, fabric_kind, max_width_cm, qty_rule, qty_factor, ' +
  'piece_length_m, per_n, min_qty, round_mode, companion_slug, companion_per_unit, ' +
  'requires, excludes, sort, active';

function num(v: unknown, fallback: number): number {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && isFinite(n) ? n : fallback;
}

function numOrNull(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && isFinite(n) ? n : null;
}

/** Database row → ConfiguratorOption. Numerics arrive as strings from PostgREST. */
export function mapOptionRow(r: Record<string, unknown>): ConfiguratorOption {
  return {
    id: num(r.id, 0),
    kind: r.kind as OptionKind,
    slug: String(r.slug ?? ''),
    label: String(r.label ?? ''),
    description: (r.description as string) ?? null,
    matchCode: (r.match_code as string) ?? null,
    matchCategory: (r.match_category as string) ?? null,
    matchProduct: (r.match_product as string) ?? null,
    matchSeq: numOrNull(r.match_seq),
    material: (r.material as ConfiguratorOption['material']) ?? null,
    finish: (r.finish as ConfiguratorOption['finish']) ?? null,
    colourGroup: (r.colour_group as ConfiguratorOption['colourGroup']) ?? null,
    fabricKind: (r.fabric_kind as ConfiguratorOption['fabricKind']) ?? null,
    maxWidthCm: numOrNull(r.max_width_cm),
    qtyRule: r.qty_rule as ConfiguratorOption['qtyRule'],
    qtyFactor: num(r.qty_factor, 1),
    pieceLengthM: numOrNull(r.piece_length_m),
    perN: numOrNull(r.per_n),
    minQty: num(r.min_qty, 0),
    roundMode: (r.round_mode as ConfiguratorOption['roundMode']) ?? 'ceil',
    companionSlug: (r.companion_slug as string) ?? null,
    companionPerUnit: num(r.companion_per_unit, 1),
    requires: Array.isArray(r.requires) ? (r.requires as string[]) : [],
    excludes: Array.isArray(r.excludes) ? (r.excludes as string[]) : [],
    sort: num(r.sort, 0),
    active: Boolean(r.active),
  };
}

function log(op: string, err: unknown) {
  console.error(`[configurator] ${op} failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

/**
 * The option catalogue. Returns null when the table is missing or Supabase is
 * not configured — callers then show the configurator's "not set up yet"
 * state rather than an empty form that prices nothing.
 *
 * Read with the SERVICE role: the catalogue carries no prices, and reading it
 * this way keeps the configurator working in the API routes, which have no
 * user Supabase client of their own.
 */
export async function loadOptions(opts: { activeOnly?: boolean } = {}): Promise<ConfiguratorOption[] | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  try {
    let query = supabase.from('configurator_options').select(OPTION_COLUMNS).order('sort').order('id');
    if (opts.activeOnly !== false) query = query.eq('active', true);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as Record<string, unknown>[]).map(mapOptionRow);
  } catch (err) {
    log('loadOptions', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

/** Candidate rows for an option, ignoring market. */
function candidates(option: ConfiguratorOption, rows: PriceRow[]): PriceRow[] {
  if (option.matchCode) {
    const byCode = rows.filter((r) => r.code === option.matchCode);
    if (byCode.length) return byCode;
    // A code that matches nothing falls through to category+product, so an
    // option keeps working when the Excel drops a code but keeps the product.
  }
  if (option.matchCategory && option.matchProduct) {
    return rows.filter((r) => r.category === option.matchCategory && r.product === option.matchProduct);
  }
  return [];
}

/**
 * Pick one row out of several. The pricebook legitimately holds same-named —
 * and even same-coded — rows that are different products (roll width bands),
 * kept apart by `seq`. Prefer the option's own seq; otherwise the lowest, so
 * the answer is always deterministic rather than "whatever came back first".
 */
function pickBySeq(rows: PriceRow[], seq: number | null): PriceRow | null {
  if (rows.length === 0) return null;
  if (rows.length === 1) return rows[0];
  const wanted = seq ?? 1;
  return rows.find((r) => r.seq === wanted) ?? rows.slice().sort((a, b) => a.seq - b.seq)[0];
}

/**
 * Resolve one option against a set of pricebook rows for ONE market.
 *
 * `rows` may be the account's RLS-filtered rows (configurator) or every row
 * (admin, service role). When the product exists but not for `market` the
 * status is 'no_price' — the admin needs that apart from 'no_row', and the
 * installer sees "price on request" either way.
 */
export function resolveOption(
  option: ConfiguratorOption,
  market: string,
  rows: PriceRow[],
): ResolvedOption {
  const all = candidates(option, rows);
  if (all.length === 0) {
    return { status: 'no_row', row: null, priceEur: null, pricePln: null, unit: null };
  }

  const inMarket = all.filter((r) => r.market === market);
  const row = pickBySeq(inMarket, option.matchSeq);
  if (!row) {
    // The product is in the pricelist, just not priced for this market
    // (fabric is Installer-only today). Never fall back to another market.
    const any = pickBySeq(all, option.matchSeq)!;
    return { status: 'no_price', row: null, priceEur: null, pricePln: null, unit: any.unit };
  }

  const priceEur = typeof row.price_eur === 'number' && isFinite(row.price_eur) ? row.price_eur : null;
  return {
    status: priceEur === null ? 'no_price' : 'ok',
    row: {
      category: row.category,
      code: row.code,
      product: row.product,
      unit: row.unit,
      market: row.market,
      seq: row.seq,
    },
    priceEur,
    pricePln: typeof row.price_pln === 'number' && isFinite(row.price_pln) ? row.price_pln : null,
    unit: row.unit,
  };
}

/** Resolve a whole catalogue at once — the admin's "needs attention" list. */
export function resolveAll(
  options: ConfiguratorOption[],
  market: string,
  rows: PriceRow[],
): Map<number, ResolvedOption> {
  const out = new Map<number, ResolvedOption>();
  for (const o of options) out.set(o.id, resolveOption(o, market, rows));
  return out;
}
