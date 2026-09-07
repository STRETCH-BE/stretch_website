// ============================================================================
// KIT CONFIGURATOR — foil matrix and auto-selection.
//
// The installer never picks a roll width or a product name. They choose a
// material, then a finish and a colour (PVC) or a fabric kind, and this module
// resolves the actual product from the catalogue — including whether the
// ceiling has to be welded to reach the room's widest span.
//
// Pure: no I/O, no database, no pricing. Unit-tested by
// scripts/configurator.test.mjs.
// ============================================================================
import type {
  ColourGroup,
  ConfiguratorOption,
  FabricKind,
  Finish,
  Material,
} from './types';

export type FoilChoice = {
  material: Material;
  /** PVC only. */
  finish?: Finish | null;
  /** PVC only. */
  colourGroup?: ColourGroup | null;
  /** Fabric only. */
  fabricKind?: FabricKind | null;
};

export type FoilPick = {
  /** The chosen roll, or null when the family is empty. */
  option: ConfiguratorOption | null;
  /** Plain language, shown to the installer as-is. */
  reason: string;
  /** True when even the widest roll in the family is narrower than the span. */
  weldRequired: boolean;
  /** The family that was considered, narrowest first (for the admin/debug). */
  family: ConfiguratorOption[];
};

/** Roll width in metres, or null for a roll with no width recorded. */
function widthM(option: ConfiguratorOption): number | null {
  const cm = option.maxWidthCm;
  return typeof cm === 'number' && isFinite(cm) && cm > 0 ? cm / 100 : null;
}

function fmt(n: number): string {
  // 3.4 not 3.40, 3.35 stays 3.35 — the reason line is read by a person.
  return String(Math.round(n * 100) / 100);
}

/**
 * The active ceiling options matching a choice, sorted narrowest first.
 * Exported because the admin uses it to spot combinations with no roll at all.
 */
export function foilFamily(choice: FoilChoice, options: ConfiguratorOption[]): ConfiguratorOption[] {
  return options
    .filter((o) => {
      if (o.kind !== 'ceiling' || !o.active) return false;
      if (o.material !== choice.material) return false;
      if (choice.material === 'PVC') {
        // A null on the option means "not recorded" and must not match a
        // specific request — an unclassified roll is never auto-selected.
        if (choice.finish && o.finish !== choice.finish) return false;
        if (choice.colourGroup && o.colourGroup !== choice.colourGroup) return false;
        return Boolean(o.finish && o.colourGroup);
      }
      if (choice.fabricKind && o.fabricKind !== choice.fabricKind) return false;
      return Boolean(o.fabricKind);
    })
    .slice()
    .sort((a, b) => (a.maxWidthCm ?? 0) - (b.maxWidthCm ?? 0) || a.sort - b.sort || a.id - b.id);
}

/**
 * Pick the roll for a span.
 *
 * The rule (Michael, 6 Sep 2026): the NARROWEST roll that still covers the
 * span in one piece — narrower is cheaper per m², so this is the cheapest
 * correct answer, not merely the first that fits. When nothing in the family
 * is wide enough, take the widest and tell the user the ceiling needs a seam.
 * How that seam is MADE depends on the material — a PVC seam is welded, a
 * polyester one is joined with a seam profile — so the wording follows it.
 */
export function pickFoil(
  choice: FoilChoice,
  needMetres: number,
  options: ConfiguratorOption[],
  /** Extra width the cloth needs beyond the span (fabric: 20 cm to grip). */
  allowanceM = 0,
): FoilPick {
  const family = foilFamily(choice, options);

  if (family.length === 0) {
    return {
      option: null,
      reason: 'This combination is not in the pricelist.',
      weldRequired: false,
      family,
    };
  }

  const span = typeof needMetres === 'number' && isFinite(needMetres) && needMetres > 0 ? needMetres : 0;
  const extra = typeof allowanceM === 'number' && isFinite(allowanceM) && allowanceM > 0 ? allowanceM : 0;
  // A 4.00 m span needs a 4.20 m roll; a 4.01 m span needs more than 4.20 m.
  const required = span > 0 ? span + extra : 0;
  const plus = extra ? ` + ${fmt(extra)} m` : '';

  const fits = family.filter((o) => {
    const w = widthM(o);
    return w != null && w >= required;
  });

  if (fits.length > 0) {
    const option = fits[0]; // family is sorted narrowest first
    const w = widthM(option)!;
    return {
      option,
      reason: span
        ? `${option.maxWidthCm} cm roll covers your ${fmt(span)} m span${plus} in one piece — no seam.`
        : `${option.maxWidthCm} cm roll — the narrowest in this finish.`,
      weldRequired: false,
      family,
    };
  }

  // Nothing fits: the widest roll in the family, seamed.
  const option = family[family.length - 1];
  const w = widthM(option);
  const joined = choice.material === 'PVC' ? 'welded' : 'joined with a seam profile';
  return {
    option,
    reason:
      w == null
        ? `No roll width is recorded for this finish, so the ceiling may have to be ${joined}.`
        : `Widest roll in this finish is ${option.maxWidthCm} cm, so the ceiling is ${joined} to reach ${fmt(span)} m${plus}.`,
    weldRequired: true,
    family,
  };
}

/**
 * How one panel is cut from a roll.
 *
 * A roll is unlimited in length, so only the panel's SHORTER side is
 * constrained by the roll's width: the strips, and therefore the seams, run
 * along the longer side. Fabric needs a gripping allowance — 20 cm across the
 * width and 20 cm along the length of EVERY piece (Michael, 7 Sep 2026) — so
 * a 4.00 m span wants a 4.20 m roll and each piece is cut 20 cm long.
 */
export type PanelCut = {
  /** Pieces of cloth this panel needs (1 = no seam). */
  strips: number;
  /** Running metres per piece, allowance included. */
  stripLength: number;
  /** Seams between the strips. */
  seams: number;
  /** Geometric seam length — seams × the panel's long side. */
  seamMetres: number;
};

export function cutPanel(
  panel: { a: number; b: number },
  rollWidthCm: number | null,
  allowanceM = 0,
): PanelCut {
  const short = Math.min(panel.a, panel.b);
  const long = Math.max(panel.a, panel.b);
  if (!(short > 0) || !(long > 0)) return { strips: 0, stripLength: 0, seams: 0, seamMetres: 0 };
  const extra = allowanceM > 0 ? allowanceM : 0;
  const w = rollWidthCm && rollWidthCm > 0 ? rollWidthCm / 100 : null;
  // No width recorded: one strip is the best assumption, and the un-priced
  // path elsewhere makes the missing data visible.
  const strips = w ? Math.max(1, Math.ceil((short + extra) / w)) : 1;
  const seams = strips - 1;
  return { strips, stripLength: long + extra, seams, seamMetres: seams * long };
}

/** Seams and seam length for one panel — a view on cutPanel(). */
export function weldsForPanel(
  panel: { a: number; b: number },
  rollWidthCm: number | null,
  allowanceM = 0,
): { welds: number; metres: number } {
  const cut = cutPanel(panel, rollWidthCm, allowanceM);
  return { welds: cut.seams, metres: cut.seamMetres };
}

/**
 * RUNNING METRES of roll one panel consumes — every piece, allowance included.
 *
 * Fabric is sold by the linear metre AT A GIVEN ROLL WIDTH — the pricelist
 * carries "495D … 5,10m" at EUR 135.92 per metre, which buys 1 m × 5.10 m of
 * cloth. Billing the ceiling's m² against that price charges roughly the roll
 * width over again, so the quantity has to be metres OFF THE ROLL, not surface.
 * The offcut across the width is paid for: that is what "cut to measure" means.
 */
export function rollMetresForPanel(
  panel: { a: number; b: number },
  rollWidthCm: number | null,
  allowanceM = 0,
): number {
  const cut = cutPanel(panel, rollWidthCm, allowanceM);
  return cut.strips * cut.stripLength;
}
