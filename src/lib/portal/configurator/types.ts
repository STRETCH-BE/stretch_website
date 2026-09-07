// ============================================================================
// KIT CONFIGURATOR — shared types (Parts 1–4).
//
// The configurator prices a ceiling from the account's own pricebook rows. It
// stores NO prices of its own: `configurator_options` only says WHICH
// pricebook row an option is and HOW MUCH of it a configuration needs. Every
// price is resolved server-side, per account, at the moment it is shown.
// ============================================================================

/** What an option is, and therefore where it appears in the form. */
export const OPTION_KINDS = [
  'ceiling',
  'profile',
  'transition',
  'corner',
  'platform',
  'absorber',
  'light',
  'light_colour',
  'service',
] as const;
export type OptionKind = (typeof OPTION_KINDS)[number];

export const MATERIALS = ['PVC', 'fabric'] as const;
export type Material = (typeof MATERIALS)[number];

export const FINISHES = ['matte', 'satin', 'gloss', 'translucent', 'print'] as const;
export type Finish = (typeof FINISHES)[number];

export const COLOUR_GROUPS = ['white', 'colour', 'black'] as const;
export type ColourGroup = (typeof COLOUR_GROUPS)[number];

export const FABRIC_KINDS = ['standard', 'acoustic', 'translucent'] as const;
export type FabricKind = (typeof FABRIC_KINDS)[number];

/**
 * How a configuration's dimensions turn into a quantity of this option.
 *   area              — the ceiling surface (m²)
 *   perimeter_m       — the perimeter in metres
 *   perimeter_pieces  — the perimeter in pieces of piece_length_m
 *   fold_edge_m       — the fold between a flat and an angled panel, in metres
 *   fold_edge_pieces  — the same, in pieces
 *   per_unit          — one per unit the user entered (platforms, lights)
 *   per_corner        — one per corner
 *   per_n_units       — one per `per_n` units of the option that requires it
 *   fixed             — a flat quantity (qty_factor)
 *   weld_m            — metres of seam the panel layout forces
 *   weld_pieces       — the same, in pieces of piece_length_m (a polyester
 *                       seam is joined with a profile, not welded)
 */
export const QTY_RULES = [
  'area',
  'perimeter_m',
  'perimeter_pieces',
  'fold_edge_m',
  'fold_edge_pieces',
  'per_unit',
  'per_corner',
  'per_n_units',
  'fixed',
  'weld_m',
  'weld_pieces',
] as const;
export type QtyRule = (typeof QTY_RULES)[number];

export const ROUND_MODES = ['ceil', 'round', 'exact'] as const;
export type RoundMode = (typeof ROUND_MODES)[number];

/** One row of public.configurator_options. */
export type ConfiguratorOption = {
  id: number;
  kind: OptionKind;
  slug: string;
  label: string;
  description: string | null;
  matchCode: string | null;
  matchCategory: string | null;
  matchProduct: string | null;
  matchSeq: number | null;
  material: Material | null;
  finish: Finish | null;
  colourGroup: ColourGroup | null;
  fabricKind: FabricKind | null;
  maxWidthCm: number | null;
  qtyRule: QtyRule;
  qtyFactor: number;
  pieceLengthM: number | null;
  perN: number | null;
  minQty: number;
  roundMode: RoundMode;
  companionSlug: string | null;
  companionPerUnit: number;
  requires: string[];
  excludes: string[];
  sort: number;
  active: boolean;
};

/**
 * Why an option has no price. Both states travel all the way to the UI:
 * 'no_row'   — the Excel dropped or renamed the product this option points at.
 * 'no_price' — the row exists but carries no price for the account's market
 *              (fabric, for instance, is Installer-only today).
 * Neither is ever coerced to 0.
 */
export type ResolveStatus = 'ok' | 'no_row' | 'no_price';

/** An option resolved against the pricebook for one market. */
export type ResolvedOption = {
  status: ResolveStatus;
  /** The pricebook row that priced it (null when status is 'no_row'). */
  row: {
    category: string;
    code: string | null;
    product: string;
    unit: string | null;
    market: string;
    seq: number;
  } | null;
  priceEur: number | null;
  pricePln: number | null;
  unit: string | null;
};
