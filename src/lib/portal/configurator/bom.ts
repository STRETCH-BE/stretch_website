// ============================================================================
// KIT CONFIGURATOR — the bill of materials.
//
// PURE: dimensions in, line items out. No I/O, no database, no prices — the
// server resolves every line against the account's own pricebook rows
// afterwards (see pricing.ts), so a price can never arrive from the browser.
//
// Unit-tested by scripts/configurator.test.mjs.
// ============================================================================
import { cutPanelFromFamily, foilFamily, pickFoil, type ClothPiece, type FoilPick } from './foil';
import type {
  ColourGroup,
  ConfiguratorOption,
  FabricKind,
  Finish,
  Material,
  OptionKind,
  RoundMode,
} from './types';

// ---------------------------------------------------------------------------
// Tunables. Michael can correct these in ONE place.
// ---------------------------------------------------------------------------

/** Smallest surface that is ever billed, in m². */
export const MIN_BILLABLE_M2 = 1;

/** Spare added to the perimeter before profiles are cut to pieces (0 = none). */
export const PROFILE_SPARE_PCT = 0;

/**
 * Gripping allowance for FABRIC, in metres, across the width AND along the
 * length of every piece (Michael, 7 Sep 2026): a 4.00 m span wants a 4.20 m
 * roll, a 4.01 m span wants more than 4.20 m, and each piece is cut 20 cm
 * long. PVC is welded to size and gets none.
 */
export const FABRIC_ALLOWANCE_M = 0.2;

/**
 * Corner counts the form starts from. The installer overrides them freely.
 * A rectangle has four inside corners; folding a slope into it adds two
 * outside corners where the fold meets the perimeter.
 * TO CONFIRM (Michael, open question 2): whether a fold really adds 2 outside.
 */
export const CORNER_DEFAULTS = {
  flat: { inside: 4, outside: 0 },
  sloped: { inside: 4, outside: 2 },
} as const;

// ---------------------------------------------------------------------------
// Shapes
// ---------------------------------------------------------------------------

export type CeilingShape = 'flat' | 'sloped';
export type FoldSide = 'length' | 'width';
/**
 * Which way the seams run. 'auto' lays the roll's width across each panel's
 * shorter side (fewest seams); 'length' / 'width' is the installer's call —
 * seams then run along that side of the room, on every panel.
 */
export type SeamDirection = 'auto' | 'length' | 'width';
export const SEAM_DIRECTIONS: readonly SeamDirection[] = ['auto', 'length', 'width'];

export type PlatformPick = { slug: string; qty: number };

/** Lights are picked exactly like platforms: several types, a count each. */
export type LightPick = { slug: string; qty: number };

/** Everything the installer entered. This is what the browser posts. */
export type ConfiguratorConfig = {
  length: number;
  width: number;
  shape: CeilingShape;
  /** Slope run in metres, measured ALONG the slope (not its horizontal projection). */
  slopeRun: number;
  foldSide: FoldSide;
  seamDirection: SeamDirection;
  material: Material;
  finish: Finish | null;
  colourGroup: ColourGroup | null;
  fabricKind: FabricKind | null;
  profileSlug: string | null;
  /** null = use the shape default. */
  cornersInside: number | null;
  cornersOutside: number | null;
  platforms: PlatformPick[];
  absorberSlug: string | null;
  lights: LightPick[];
};

export type BomLine = {
  kind: OptionKind;
  slug: string;
  label: string;
  qty: number;
  rule: string;
  /** True when the catalogue has no such option — shown as "needs attention",
   *  never dropped, so a missing transition profile cannot vanish silently. */
  missing?: boolean;
  /** The option this line was pulled in by (protective ring, driver). */
  companionOf?: string;
  note?: string;
};

/**
 * A panel's two sides, and which room axis side `a` lies on. The flat panel's
 * `a` is the length. The angled panel's `a` is the fold edge — the length or
 * the width, whichever the fold runs along — and its `b` (the slope) then
 * runs across the OTHER axis. That is what lets "seams along the length" mean
 * the same thing on both panels.
 */
export type Panel = { a: number; b: number; label: string; aAxis: 'length' | 'width' };

export type Bom = {
  lines: BomLine[];
  notes: string[];
  foil: FoilPick;
  panels: Panel[];
  /** Billable surface, m². */
  area: number;
  /** Running metres of roll the panels consume (fabric is priced per m1). */
  rollMetres: number;
  /** Pieces of cloth — one per panel, one more per seam. 0 for PVC. */
  clothPieces: number;
  /** Every roll width the pieces come off, narrowest first. */
  clothWidthsCm: number[];
  perimeter: number;
  /** The widest span the foil has to cover in one piece, m². */
  need: number;
  cornersInside: number;
  cornersOutside: number;
  weldMetres: number;
  weldCount: number;
  /** True when the configuration cannot be ordered as it stands. */
  incomplete: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pos(n: unknown): number {
  return typeof n === 'number' && isFinite(n) && n > 0 ? n : 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function applyRound(value: number, mode: RoundMode): number {
  if (mode === 'ceil') return Math.ceil(round2(value));
  if (mode === 'round') return Math.round(value);
  return round2(value);
}

function finalQty(raw: number, option: ConfiguratorOption): number {
  const scaled = raw * (typeof option.qtyFactor === 'number' ? option.qtyFactor : 1);
  return Math.max(applyRound(scaled, option.roundMode), option.minQty || 0);
}

function bySlug(options: ConfiguratorOption[]): Map<string, ConfiguratorOption> {
  const m = new Map<string, ConfiguratorOption>();
  for (const o of options) if (o.active) m.set(o.slug, o);
  return m;
}

/**
 * Options the ENGINE picks by itself (the fold-edge profile, the corner piece,
 * the welding service) must match the ceiling's material: welding a PVC seam
 * and welding a polyester seam are different products at different prices. An
 * option with no material recorded is treated as suiting any material.
 *
 * Options the INSTALLER picks explicitly (perimeter profile, light supports,
 * lights) are priced as chosen — the form only offers the ones that fit.
 */
function suitsMaterial(option: ConfiguratorOption, material: Material): boolean {
  return option.active && (option.material === null || option.material === material);
}

/** A line for an option the catalogue does not have — visible, never silent. */
function missingLine(kind: OptionKind, slug: string, qty: number, rule: string): BomLine {
  return {
    kind,
    slug,
    label: slug,
    qty,
    rule,
    missing: true,
    note: 'Not in the configurator catalogue — needs a price before this can be ordered.',
  };
}

// ---------------------------------------------------------------------------
// The engine
// ---------------------------------------------------------------------------

export function buildBom(config: ConfiguratorConfig, options: ConfiguratorOption[]): Bom {
  const catalogue = bySlug(options);
  const lines: BomLine[] = [];
  const notes: string[] = [];

  const L = pos(config.length);
  const W = pos(config.width);
  const sloped = config.shape === 'sloped';
  const S = sloped ? pos(config.slopeRun) : 0;
  const foldEdge = config.foldSide === 'width' ? W : L;

  // (a) Panels ---------------------------------------------------------------
  const panels: Panel[] = [{ a: L, b: W, label: 'Flat panel', aAxis: 'length' }];
  if (sloped && S > 0 && foldEdge > 0) {
    panels.push({ a: foldEdge, b: S, label: 'Angled panel', aAxis: config.foldSide === 'width' ? 'width' : 'length' });
  }

  // Seams run along the length ⇒ the pieces run along the length ⇒ the roll's
  // width spans the side on the WIDTH axis, and vice versa. 'auto' spans the
  // shorter side, which is the fewest seams.
  const direction: SeamDirection = config.seamDirection === 'length' || config.seamDirection === 'width' ? config.seamDirection : 'auto';
  const coverOf = (p: Panel): 'short' | 'a' | 'b' => {
    if (direction === 'auto') return 'short';
    // The side to span is the one on the axis the seams do NOT run along.
    const spanAxis = direction === 'length' ? 'width' : 'length';
    return p.aAxis === spanAxis ? 'a' : 'b';
  };
  const spanOf = (p: Panel): number => {
    const c = coverOf(p);
    return c === 'a' ? p.a : c === 'b' ? p.b : Math.min(p.a, p.b);
  };

  // (b) Surface --------------------------------------------------------------
  const rawArea = L * W + (sloped ? foldEdge * S : 0);
  const area = rawArea > 0 ? Math.max(Math.ceil(rawArea * 100) / 100, MIN_BILLABLE_M2) : 0;

  // (c) Perimeter ------------------------------------------------------------
  // Flat: 2(L + W). Flat + slope: 2L + 2W + 2S. Derivation — the two panels'
  // own perimeters are 2(L + W) + 2(X + S), and the shared fold edge X is
  // counted once in each, so removing both occurrences leaves 2L + 2W + 2S,
  // whichever side the fold runs along.
  const perimeter = round2(2 * L + 2 * W + (sloped && S > 0 ? 2 * S : 0));

  // (d) Widest span — a roll's LENGTH is unlimited, only its width constrains,
  // so each panel is limited by its shorter side.
  // With a chosen seam direction the span is whatever side the roll has to
  // cover on that layout — it may be the longer one, and then seams appear.
  const need = panels.reduce((max, p) => Math.max(max, spanOf(p)), 0);

  // Foil ---------------------------------------------------------------------
  const allowance = config.material === 'fabric' ? FABRIC_ALLOWANCE_M : 0;
  const choice = {
    material: config.material,
    finish: config.finish,
    colourGroup: config.colourGroup,
    fabricKind: config.fabricKind,
  };
  // The family is the same cloth in every width the pricelist carries. The
  // "chosen foil" is the roll the WIDEST span takes — what the box on the form
  // and the production sheet name — but each piece of cloth is cut from the
  // narrowest roll that covers ITS OWN width (see cutPanelFromFamily).
  const family = foilFamily(choice, options);
  const foil = pickFoil(choice, need, options, allowance);

  // How each panel is cut: which roll, how long, the seams between pieces.
  // ONE model feeds the cloth lines and the seam line, so they cannot disagree.
  const cuts = foil.option
    ? panels.map((p) => ({ panel: p, cut: cutPanelFromFamily({ a: p.a, b: p.b }, family, allowance, coverOf(p)) }))
    : [];
  const pieces: { panel: Panel; piece: ClothPiece; index: number; of: number }[] = [];
  for (const { panel, cut } of cuts) {
    cut.pieces.forEach((piece, i) => pieces.push({ panel, piece, index: i + 1, of: cut.pieces.length }));
  }
  const rollMetres = round2(pieces.reduce((sum, p) => sum + p.piece.length, 0));
  const clothPieces = pieces.length;
  const clothWidthsCm = [...new Set(pieces.map((p) => p.piece.widthCm).filter((w): w is number => w != null))].sort((a, b) => a - b);

  let incomplete = area <= 0 || L <= 0 || W <= 0;
  if (!foil.option) {
    incomplete = true;
    notes.push(foil.reason);
  } else if (foil.option.qtyRule === 'roll_m') {
    // Fabric: sold by the running metre of a roll of a given width, and cut
    // into PIECES — one per panel, one more per seam — each listed with its
    // own roll and measurements so production cuts exactly what is billed.
    // Michael, 7 Sep 2026: "if the ceiling is flat + angled you need 2
    // fabrics … a ceiling can have multiple seams, so also multiple fabrics"
    // and "it shouldn't multiply. It should add the necessary width of extra
    // fabric" — so a seam's second piece is the LEFTOVER width off a narrower
    // roll, never another full-width strip.
    let n = 0;
    for (const { panel, piece, index, of } of pieces) {
      n += 1;
      const width = piece.widthCm != null ? `${(piece.widthCm / 100).toFixed(2)} m wide` : 'width not recorded';
      const which = of > 1 ? (piece.remainder ? `, remainder ${piece.covers.toFixed(2)} m` : `, strip ${index} of ${of}`) : '';
      lines.push({
        kind: 'ceiling',
        slug: piece.option.slug,
        label: piece.option.label,
        qty: finalQty(piece.length, piece.option),
        rule: 'roll_m',
        note: `Piece ${n} of ${clothPieces} — ${panel.label.toLowerCase()}${which}: ${width} × ${piece.length.toFixed(
          2,
        )} m long (incl. ${Math.round(allowance * 100)} cm to grip).`,
      });
    }
    notes.push(foil.reason);
  } else {
    // PVC: welded to size, billed on the ceiling's surface.
    lines.push({
      kind: 'ceiling',
      slug: foil.option.slug,
      label: foil.option.label,
      qty: finalQty(area, foil.option),
      rule: 'area',
      note: foil.reason,
    });
  }

  // (e) The fold edge itself -------------------------------------------------
  if (sloped && S > 0 && foldEdge > 0) {
    const transition = options.find((o) => o.kind === 'transition' && suitsMaterial(o, config.material));
    if (transition) {
      const raw =
        transition.qtyRule === 'fold_edge_pieces'
          ? Math.ceil((foldEdge * (1 + PROFILE_SPARE_PCT / 100)) / (transition.pieceLengthM || 2))
          : foldEdge;
      lines.push({
        kind: 'transition',
        slug: transition.slug,
        label: transition.label,
        qty: finalQty(raw, transition),
        rule: transition.qtyRule,
      });
    } else {
      // No transition option configured: the line still appears, un-priced.
      lines.push(missingLine('transition', 'fold-edge-profile', round2(foldEdge), 'fold_edge_m'));
      notes.push('No angle/transition profile is set up yet, so the fold edge has no price.');
    }
  }

  // (f) Perimeter profile ----------------------------------------------------
  const profile = config.profileSlug ? catalogue.get(config.profileSlug) : null;
  if (config.profileSlug && !profile) {
    lines.push(missingLine('profile', config.profileSlug, perimeter, 'perimeter_m'));
  } else if (profile) {
    const withSpare = perimeter * (1 + PROFILE_SPARE_PCT / 100);
    const raw =
      profile.qtyRule === 'perimeter_pieces'
        ? Math.ceil(withSpare / (profile.pieceLengthM || 2))
        : withSpare;
    lines.push({
      kind: 'profile',
      slug: profile.slug,
      label: profile.label,
      qty: finalQty(raw, profile),
      rule: profile.qtyRule,
    });
  }

  // (g) Corners --------------------------------------------------------------
  const defaults = sloped ? CORNER_DEFAULTS.sloped : CORNER_DEFAULTS.flat;
  const cornersInside = config.cornersInside ?? defaults.inside;
  const cornersOutside = config.cornersOutside ?? defaults.outside;
  const corners = Math.max(0, cornersInside) + Math.max(0, cornersOutside);
  // The corner piece is not a choice — there is one per material, so the engine
  // picks it the way it picks the fold edge. A material with no corner piece
  // (polyester today) simply has no corner line.
  const corner = options.find((o) => o.kind === 'corner' && suitsMaterial(o, config.material)) ?? null;
  if (corner && corners > 0) {
    lines.push({
      kind: 'corner',
      slug: corner.slug,
      label: corner.label,
      qty: finalQty(corners, corner),
      rule: 'per_corner',
    });
  }

  // Platforms, absorber, lights ---------------------------------------------
  const perUnit: { option: ConfiguratorOption | null; slug: string; qty: number; kind: OptionKind }[] = [];
  for (const p of config.platforms ?? []) {
    const qty = Math.max(0, Math.floor(pos(p.qty)));
    if (!p.slug || qty <= 0) continue;
    perUnit.push({ option: catalogue.get(p.slug) ?? null, slug: p.slug, qty, kind: 'platform' });
  }
  // Lights are a list of types, like the platforms. One entry IS one pricebook
  // row — a colour temperature (3000K / 4000K / 6000K) is its own row of the
  // same fitting, so it is picked instead of the plain fitting, never on top
  // of it, and the fitting can never be charged twice.
  for (const l of config.lights ?? []) {
    const qty = Math.max(0, Math.floor(pos(l.qty)));
    if (!l.slug || qty <= 0) continue;
    const option = catalogue.get(l.slug) ?? null;
    perUnit.push({ option, slug: l.slug, qty, kind: option?.kind === 'light_colour' ? 'light_colour' : 'light' });
  }

  for (const entry of perUnit) {
    if (!entry.option) {
      lines.push(missingLine(entry.kind, entry.slug, entry.qty, 'per_unit'));
      continue;
    }
    lines.push({
      kind: entry.option.kind,
      slug: entry.option.slug,
      label: entry.option.label,
      qty: finalQty(entry.qty, entry.option),
      rule: 'per_unit',
    });
  }

  // (i) Absorber — the surface is ALWAYS the ceiling surface. No override.
  const absorber = config.absorberSlug ? catalogue.get(config.absorberSlug) : null;
  if (config.absorberSlug && !absorber) {
    lines.push(missingLine('absorber', config.absorberSlug, area, 'area'));
  } else if (absorber) {
    lines.push({
      kind: 'absorber',
      slug: absorber.slug,
      label: absorber.label,
      qty: finalQty(area, absorber),
      rule: 'area',
      note: `Absorber surface — ${area.toFixed(2)} m², always the same surface as the ceiling.`,
    });
  }

  // (j) Companions — VISIBLE lines, never hidden add-ons ---------------------
  // Built from the lines that exist so far, so a companion of a companion is
  // not chased in circles.
  for (const line of [...lines]) {
    const parent = catalogue.get(line.slug);
    if (!parent?.companionSlug) continue;
    const companion = catalogue.get(parent.companionSlug);
    if (!companion) {
      lines.push(missingLine(parent.kind, parent.companionSlug, line.qty, 'companion'));
      continue;
    }
    const raw =
      companion.qtyRule === 'per_n_units'
        ? Math.ceil(line.qty / Math.max(1, companion.perN || 1))
        : line.qty * (parent.companionPerUnit || 1);
    lines.push({
      kind: companion.kind,
      slug: companion.slug,
      label: companion.label,
      qty: finalQty(raw, companion),
      rule: companion.qtyRule,
      companionOf: parent.slug,
    });
  }

  // (h) Welding --------------------------------------------------------------
  const weldCount = cuts.reduce((sum, c) => sum + c.cut.seams, 0);
  const weldMetres = round2(cuts.reduce((sum, c) => sum + c.cut.seamMetres, 0));
  if (weldCount > 0) {
    notes.push(
      `${weldCount} seam${weldCount > 1 ? 's' : ''} — ${weldMetres} m in total, running along the ${
        direction === 'auto' ? 'longer side of each panel' : direction
      }, because the ceiling is wider than the ${foil.option?.maxWidthCm} cm roll.`,
    );
    // How a seam is MADE differs by material: a PVC seam is welded and billed
    // per metre, a polyester one is joined with a profile and billed per piece.
    const weldService = options.find(
      (o) =>
        o.kind === 'service' &&
        (o.qtyRule === 'weld_m' || o.qtyRule === 'weld_pieces') &&
        suitsMaterial(o, config.material),
    );
    if (weldService) {
      const raw =
        weldService.qtyRule === 'weld_pieces'
          ? Math.ceil(weldMetres / (weldService.pieceLengthM || 2))
          : weldMetres;
      lines.push({
        kind: 'service',
        slug: weldService.slug,
        label: weldService.label,
        qty: finalQty(raw, weldService),
        rule: weldService.qtyRule,
      });
    } else {
      lines.push(missingLine('service', 'seam', weldMetres, 'weld_m'));
    }
  }

  return {
    lines,
    notes,
    foil,
    panels,
    area,
    rollMetres,
    clothPieces: foil.option?.qtyRule === 'roll_m' ? clothPieces : 0,
    clothWidthsCm: foil.option?.qtyRule === 'roll_m' ? clothWidthsCm : [],
    perimeter,
    need: round2(need),
    cornersInside,
    cornersOutside,
    weldMetres,
    weldCount,
    incomplete,
  };
}
