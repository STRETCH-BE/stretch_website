// ============================================================================
// KIT CONFIGURATOR — request body → a configuration the engine can trust.
//
// Used by BOTH the quote route and the order route, so an order is validated
// exactly as the quote it came from. Anything the browser sends that is not a
// dimension or a slug is dropped here; prices are never read from the body.
// ============================================================================
import type { ConfiguratorConfig, LightPick, PlatformPick } from './bom';
import { COLOUR_GROUPS, FABRIC_KINDS, FINISHES, MATERIALS } from './types';

/** Room limits — a stretch ceiling outside these is not a web order. */
export const LIMITS = {
  minSide: 0.2,
  maxSide: 30,
  maxSlope: 15,
  maxLights: 500,
  maxLightTypes: 12,
  maxPlatformTypes: 12,
  maxPlatformQty: 500,
  maxCorners: 60,
  maxTextLength: 400,
} as const;

export type ParseResult =
  | {
      ok: true;
      config: ConfiguratorConfig;
      meta: {
        /** What the installer calls this ceiling — "Living room", "Unit 4B". */
        reference: string | null;
        projectRef: string | null;
        deliveryAddress: string | null;
        note: string | null;
      };
    }
  | { ok: false; error: string };

function n(v: unknown): number {
  if (typeof v === 'number') return isFinite(v) ? v : NaN;
  if (typeof v === 'string') return Number(v.replace(',', '.'));
  return NaN;
}

function text(v: unknown, max: number = LIMITS.maxTextLength): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim().slice(0, max);
  return t.length ? t : null;
}

function inSet<T extends string>(v: unknown, values: readonly T[]): T | null {
  return typeof v === 'string' && (values as readonly string[]).includes(v) ? (v as T) : null;
}

/** A slug the catalogue could hold. Never trusted — the engine looks it up. */
function slug(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return /^[a-z0-9][a-z0-9-]{0,79}$/i.test(s) ? s : null;
}

export function parseConfig(body: unknown): ParseResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, error: 'bad_body' };
  const b = body as Record<string, unknown>;

  const length = n(b.length);
  const width = n(b.width);
  if (!isFinite(length) || !isFinite(width)) return { ok: false, error: 'bad_dimensions' };
  if (length < LIMITS.minSide || width < LIMITS.minSide) return { ok: false, error: 'too_small' };
  if (length > LIMITS.maxSide || width > LIMITS.maxSide) return { ok: false, error: 'too_large' };

  const shape = b.shape === 'sloped' ? 'sloped' : 'flat';
  let slopeRun = n(b.slopeRun);
  if (!isFinite(slopeRun) || slopeRun < 0) slopeRun = 0;
  if (slopeRun > LIMITS.maxSlope) return { ok: false, error: 'slope_too_large' };
  if (shape === 'sloped' && slopeRun <= 0) return { ok: false, error: 'missing_slope' };

  const material = inSet(b.material, MATERIALS);
  if (!material) return { ok: false, error: 'bad_material' };

  const platforms: PlatformPick[] = [];
  if (Array.isArray(b.platforms)) {
    for (const raw of b.platforms.slice(0, LIMITS.maxPlatformTypes)) {
      if (!raw || typeof raw !== 'object') continue;
      const r = raw as Record<string, unknown>;
      const s = slug(r.slug);
      const qty = Math.floor(n(r.qty));
      if (!s || !isFinite(qty) || qty <= 0) continue;
      if (qty > LIMITS.maxPlatformQty) return { ok: false, error: 'platform_qty_too_large' };
      // Each type at most once — the form enforces it, the server insists.
      if (platforms.some((p) => p.slug === s)) continue;
      platforms.push({ slug: s, qty });
    }
  }

  const lights: LightPick[] = [];
  if (Array.isArray(b.lights)) {
    for (const raw of b.lights.slice(0, LIMITS.maxLightTypes)) {
      if (!raw || typeof raw !== 'object') continue;
      const r = raw as Record<string, unknown>;
      const s = slug(r.slug);
      const qty = Math.floor(n(r.qty));
      if (!s || !isFinite(qty) || qty <= 0) continue;
      if (qty > LIMITS.maxLights) return { ok: false, error: 'too_many_lights' };
      // Each type at most once — the form enforces it, the server insists.
      if (lights.some((l) => l.slug === s)) continue;
      lights.push({ slug: s, qty });
    }
  }

  const cornersInside = b.cornersInside == null ? null : Math.floor(n(b.cornersInside));
  const cornersOutside = b.cornersOutside == null ? null : Math.floor(n(b.cornersOutside));
  for (const c of [cornersInside, cornersOutside]) {
    if (c !== null && (!isFinite(c) || c < 0 || c > LIMITS.maxCorners)) return { ok: false, error: 'bad_corners' };
  }

  const config: ConfiguratorConfig = {
    length,
    width,
    shape,
    slopeRun: shape === 'sloped' ? slopeRun : 0,
    foldSide: b.foldSide === 'width' ? 'width' : 'length',
    material,
    finish: material === 'PVC' ? inSet(b.finish, FINISHES) : null,
    colourGroup: material === 'PVC' ? inSet(b.colourGroup, COLOUR_GROUPS) : null,
    fabricKind: material === 'fabric' ? inSet(b.fabricKind, FABRIC_KINDS) : null,
    profileSlug: slug(b.profileSlug),
    cornersInside,
    cornersOutside,
    platforms,
    absorberSlug: slug(b.absorberSlug),
    lights,
  };

  return {
    ok: true,
    config,
    meta: {
      reference: text(b.reference, 120),
      projectRef: text(b.projectRef, 120),
      deliveryAddress: text(b.deliveryAddress),
      note: text(b.note),
    },
  };
}
