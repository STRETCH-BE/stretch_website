// ============================================================================
// CLIENT PORTAL — acoustic calculator: the saved-room state and the headline
// results derived from it SERVER-SIDE.
//
// The calculator posts its whole form as `state` (app:'stretch-acoustic').
// The denormalised columns of acoustic_projects (room type, volume, RT before
// and after, target, treated quantity, product) are computed here from that
// state with the same Sabine arithmetic as the tool — T = V / (6 × A), A the
// sum of surface × α per octave band, headline = mean of 500 / 1000 / 2000 Hz
// — using the tables generated from the tool itself (acoustic-data.ts). They
// are never taken from separate client fields; anything missing or not
// finite becomes null rather than a guess. Pure: no Supabase, no I/O.
// ============================================================================
import {
  ACOUSTIC_MATERIALS,
  ACOUSTIC_PANELS,
  ACOUSTIC_SPEECH,
  ACOUSTIC_TARGETS,
} from '@/lib/portal/acoustic-data';

export const ACOUSTIC_APP = 'stretch-acoustic';

/** One deviating surface (window, door, carpet…) deducted from a main surface. */
export type AcousticSurfaceRow = { surface: 'vloer' | 'plafond' | 'wand'; nr: number | null; m2: string };
/** One panel line: the absorber by its table `nr` and the quantity as typed. */
export type AcousticPanelRow = { nr: number | null; qty: string };

/** The calculator's own format — see the PORTAL BRIDGE in acoustic-calculator.html. */
export type AcousticState = {
  app: typeof ACOUSTIC_APP;
  version: number;
  /** 'st' (pieces) or 'm2' (treated area) — the report's unit. */
  unit?: string;
  lang?: string;
  room: {
    name?: string;
    project?: string;
    client?: string;
    /** DOELEN.naam (Dutch key of the room type). */
    type?: string | null;
    L?: string;
    B?: string;
    H?: string;
    floor?: number | null;
    ceiling?: number | null;
    walls?: number | null;
  };
  surfaces?: AcousticSurfaceRow[];
  panels?: AcousticPanelRow[];
};

export type AcousticSummary = {
  room_type: string | null;
  volume_m3: number | null;
  rt_before_s: number | null;
  rt_after_s: number | null;
  target_s: number | null;
  treated_qty: number | null;
  treated_unit: string | null;
  product_code: string | null;
};

const ZERO = [0, 0, 0, 0, 0, 0];

/** Shape check for a POSTed state (not a deep validation — the summary tolerates gaps). */
export function isAcousticState(x: unknown): x is AcousticState {
  if (!x || typeof x !== 'object') return false;
  const s = x as Record<string, unknown>;
  return s.app === ACOUSTIC_APP && !!s.room && typeof s.room === 'object';
}

/** Same parsing as the tool's getal(): "8,4" → 8.4; anything else → 0. */
function num(v: unknown): number {
  const n = parseFloat(String(v ?? '').replace(',', '.').replace(/\s/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function material(nr: unknown): number[] {
  return ACOUSTIC_MATERIALS.find((m) => m.nr === nr)?.a ?? ZERO;
}
function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function summariseAcoustic(state: AcousticState): AcousticSummary {
  const room = state.room ?? {};
  const L = num(room.L), B = num(room.B), H = num(room.H);
  const V = Math.round(L * B * H * 10) / 10;

  const opp: Record<'vloer' | 'plafond' | 'wand', number> = { vloer: L * B, plafond: L * B, wand: 2 * (L + B) * H };
  const extra: { m2: number; a: number[] }[] = [];
  for (const row of state.surfaces ?? []) {
    if (!row || (row.surface !== 'vloer' && row.surface !== 'plafond' && row.surface !== 'wand')) continue;
    const mat = ACOUSTIC_MATERIALS.find((m) => m.nr === row.nr);
    const m2 = num(row.m2);
    if (!mat || !m2) continue;
    opp[row.surface] -= m2;
    extra.push({ m2, a: mat.a });
  }
  (Object.keys(opp) as (keyof typeof opp)[]).forEach((k) => {
    if (opp[k] < 0) opp[k] = 0;
  });

  const surfaces = [
    { m2: opp.vloer, a: material(room.floor) },
    { m2: opp.plafond, a: material(room.ceiling) },
    { m2: opp.wand, a: material(room.walls) },
    ...extra,
  ];

  const panels: { n: number; a: number[]; naam: string }[] = [];
  for (const row of state.panels ?? []) {
    const p = ACOUSTIC_PANELS.find((x) => x.nr === row?.nr);
    const n = num(row?.qty);
    if (p && n) panels.push({ n, a: p.a, naam: p.naam });
  }

  const tBefore: number[] = [], tAfter: number[] = [];
  for (let i = 0; i < 6; i++) {
    let A = 0;
    for (const s of surfaces) A += s.m2 * s.a[i];
    let Ana = A;
    for (const p of panels) Ana += p.n * p.a[i];
    tBefore.push(V > 0 && A > 0 ? V / (6 * A) : 0);
    tAfter.push(V > 0 && Ana > 0 ? V / (6 * Ana) : 0);
  }
  const mean = (arr: number[]) => ACOUSTIC_SPEECH.reduce((s, i) => s + arr[i], 0) / ACOUSTIC_SPEECH.length;
  const gBefore = mean(tBefore), gAfter = mean(tAfter);
  const valid = V > 0 && gBefore > 0 && Number.isFinite(gBefore) && Number.isFinite(gAfter);

  const target = ACOUSTIC_TARGETS.find((t) => t.naam === room.type) ?? null;
  const qty = panels.reduce((s, p) => s + p.n, 0);
  const unit = state.unit === 'm2' ? 'm2' : state.unit === 'st' ? 'st' : null;

  return {
    room_type: target ? target.naam : typeof room.type === 'string' && room.type ? room.type.slice(0, 80) : null,
    volume_m3: V > 0 ? V : null,
    rt_before_s: valid ? round3(gBefore) : null,
    rt_after_s: valid ? round3(gAfter) : null,
    target_s: target ? target.t : null,
    treated_qty: Number.isFinite(qty) ? qty : null,
    treated_unit: unit,
    product_code: panels.length ? panels[0].naam.replace(/^STRETCH Acoustic - /, '') : null,
  };
}
