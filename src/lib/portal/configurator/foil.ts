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
 * is wide enough, take the widest and tell the user it will be welded.
 */
export function pickFoil(
  choice: FoilChoice,
  needMetres: number,
  options: ConfiguratorOption[],
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

  const fits = family.filter((o) => {
    const w = widthM(o);
    return w != null && w >= span;
  });

  if (fits.length > 0) {
    const option = fits[0]; // family is sorted narrowest first
    const w = widthM(option)!;
    return {
      option,
      reason: span
        ? `${option.maxWidthCm} cm roll covers your ${fmt(span)} m span in one piece — no weld.`
        : `${option.maxWidthCm} cm roll — the narrowest in this finish.`,
      weldRequired: false,
      family,
    };
  }

  // Nothing fits: the widest roll in the family, welded.
  const option = family[family.length - 1];
  const w = widthM(option);
  return {
    option,
    reason:
      w == null
        ? 'No roll width is recorded for this finish, so the ceiling may have to be welded.'
        : `Widest roll in this finish is ${option.maxWidthCm} cm, so the ceiling is welded to reach ${fmt(span)} m.`,
    weldRequired: true,
    family,
  };
}

/**
 * Welds and weld length for one panel against a roll width.
 * A roll is unlimited in length, so only the panel's SHORTER side is
 * constrained: the seams then run along its longer side.
 */
export function weldsForPanel(
  panel: { a: number; b: number },
  rollWidthCm: number | null,
): { welds: number; metres: number } {
  const short = Math.min(panel.a, panel.b);
  const long = Math.max(panel.a, panel.b);
  const w = rollWidthCm && rollWidthCm > 0 ? rollWidthCm / 100 : null;
  if (!w || short <= w) return { welds: 0, metres: 0 };
  const welds = Math.ceil(short / w) - 1;
  return { welds, metres: welds * long };
}
