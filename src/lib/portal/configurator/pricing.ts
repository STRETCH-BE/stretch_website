// ============================================================================
// KIT CONFIGURATOR — pricing. SERVER SIDE ONLY.
//
// The browser posts a CONFIGURATION and never a price. This module rebuilds
// the bill of materials from the catalogue and resolves every line against the
// account's own pricebook rows, so a tampered request body cannot change what
// anything costs.
//
// A line with no price for the account's market renders "price on request",
// the total renders "from € X", and the order still submits — flagged
// needs_manual_pricing. A silent € 0 line is the one unacceptable failure mode.
// ============================================================================
import type { PortalSession, PriceRow } from '../types';
import { configuratorMarket } from '../types';
import { getPricebook } from '../data';
import { buildBom, type Bom, type ConfiguratorConfig } from './bom';
import { loadOptions, resolveOption } from './options';
import type { ConfiguratorOption, ResolveStatus } from './types';

export type PricedLine = {
  kind: string;
  slug: string;
  /** The pricebook product name when it resolved, else the option's label. */
  label: string;
  code: string | null;
  qty: number;
  unit: string | null;
  unitPriceEur: number | null;
  lineTotalEur: number | null;
  unitPricePln: number | null;
  lineTotalPln: number | null;
  status: ResolveStatus;
  companionOf?: string;
  note?: string;
};

export type PricedBom = {
  market: string;
  currency: 'EUR' | 'PLN';
  lines: PricedLine[];
  notes: string[];
  /** Sum of the lines that DO have a price. */
  subtotalEur: number;
  subtotalPln: number | null;
  /** True when at least one line could not be priced. */
  needsManualPricing: boolean;
  unpricedCount: number;
  area: number;
  /** Running metres of roll — what a fabric ceiling is actually billed on. */
  rollMetres: number;
  clothPieces: number;
  clothWidthsCm: number[];
  perimeter: number;
  need: number;
  cornersInside: number;
  cornersOutside: number;
  weldMetres: number;
  weldCount: number;
  incomplete: boolean;
  foil: {
    slug: string | null;
    label: string | null;
    code: string | null;
    product: string | null;
    widthCm: number | null;
    reason: string;
    weldRequired: boolean;
  };
  panels: { a: number; b: number; label: string }[];
  pricebookVersion: string;
  pricebookUpdatedAt: string;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Price a BOM against one market's rows.
 * Pure apart from its inputs — the route fetches rows and options, this maps.
 */
export function priceBom(
  bom: Bom,
  options: ConfiguratorOption[],
  market: string,
  rows: PriceRow[],
  meta: { version: string; updated_at: string },
  opts: { preferPln?: boolean } = {},
): PricedBom {
  const bySlug = new Map(options.map((o) => [o.slug, o]));
  const lines: PricedLine[] = [];
  let subtotalEur = 0;
  let subtotalPln = 0;
  let unpriced = 0;
  let plnComplete = true;

  for (const line of bom.lines) {
    const option = bySlug.get(line.slug);
    if (!option || line.missing) {
      unpriced += 1;
      lines.push({
        kind: line.kind,
        slug: line.slug,
        label: line.label,
        code: null,
        qty: line.qty,
        unit: null,
        unitPriceEur: null,
        lineTotalEur: null,
        unitPricePln: null,
        lineTotalPln: null,
        status: 'no_row',
        companionOf: line.companionOf,
        note: line.note,
      });
      plnComplete = false;
      continue;
    }

    const resolved = resolveOption(option, market, rows);
    const unitEur = resolved.priceEur;
    const unitPln = resolved.pricePln;
    const totalEur = unitEur === null ? null : round2(unitEur * line.qty);
    const totalPln = unitPln === null ? null : round2(unitPln * line.qty);

    if (totalEur === null) {
      unpriced += 1;
      plnComplete = false;
    } else {
      subtotalEur += totalEur;
      if (totalPln === null) plnComplete = false;
      else subtotalPln += totalPln;
    }

    lines.push({
      kind: line.kind,
      slug: option.slug,
      // Prefer the pricebook's own product name — that is what the production
      // sheet and the invoice will say.
      label: resolved.row?.product ?? option.label,
      code: resolved.row?.code ?? option.matchCode ?? null,
      qty: line.qty,
      unit: resolved.unit,
      unitPriceEur: unitEur,
      lineTotalEur: totalEur,
      unitPricePln: unitPln,
      lineTotalPln: totalPln,
      status: resolved.status,
      companionOf: line.companionOf,
      note: line.note,
    });
  }

  const notes = [...bom.notes];
  if (unpriced > 0) {
    notes.push(
      `${unpriced} line${unpriced > 1 ? 's have' : ' has'} no price for ${market} — we price ${unpriced > 1 ? 'them' : 'it'} by hand and confirm on the proforma. The total below is a "from" figure.`,
    );
  }

  const foilOption = bom.foil.option;
  const foilResolved = foilOption ? resolveOption(foilOption, market, rows) : null;

  return {
    market,
    // PLN only when the whole basket has a PLN price — a mixed total would be
    // wrong, and fabric carries no PLN price today.
    currency: opts.preferPln && plnComplete && subtotalPln > 0 ? 'PLN' : 'EUR',
    lines,
    notes,
    subtotalEur: round2(subtotalEur),
    subtotalPln: plnComplete ? round2(subtotalPln) : null,
    needsManualPricing: unpriced > 0,
    unpricedCount: unpriced,
    area: bom.area,
    rollMetres: bom.rollMetres,
    clothPieces: bom.clothPieces,
    clothWidthsCm: bom.clothWidthsCm,
    perimeter: bom.perimeter,
    need: bom.need,
    cornersInside: bom.cornersInside,
    cornersOutside: bom.cornersOutside,
    weldMetres: bom.weldMetres,
    weldCount: bom.weldCount,
    incomplete: bom.incomplete,
    foil: {
      slug: foilOption?.slug ?? null,
      label: foilOption?.label ?? null,
      code: foilResolved?.row?.code ?? foilOption?.matchCode ?? null,
      product: foilResolved?.row?.product ?? null,
      widthCm: foilOption?.maxWidthCm ?? null,
      reason: bom.foil.reason,
      weldRequired: bom.foil.weldRequired,
    },
    panels: bom.panels,
    pricebookVersion: meta.version,
    pricebookUpdatedAt: meta.updated_at,
  };
}

/**
 * The whole server-side path: session + configuration → priced BOM.
 * Used by the quote route AND by the order route, so an order can never be
 * priced differently from what the installer was shown.
 */
export async function quoteFor(
  session: PortalSession,
  config: ConfiguratorConfig,
  requestedMarket?: string | null,
): Promise<{ quote: PricedBom; options: ConfiguratorOption[] } | { error: 'no_catalogue' }> {
  const options = await loadOptions({ activeOnly: true });
  if (!options) return { error: 'no_catalogue' };

  const market = configuratorMarket(session.profile, requestedMarket);
  const { rows, meta } = await getPricebook(session);
  const bom = buildBom(config, options);
  const country = (session.profile.country ?? '').toUpperCase();
  const quote = priceBom(bom, options, market, rows, meta, { preferPln: country === 'PL' });
  return { quote, options };
}
