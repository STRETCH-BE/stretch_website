'use client';

// CLIENT PORTAL — the kit configurator.
// Dimensions drive everything: surface, perimeter and the widest span are
// DERIVED and shown at the point of entry, the foil is chosen by the engine
// from material + finish + colour, and the acoustic absorber always follows
// the ceiling surface. No price is ever computed here — the browser posts the
// configuration and the server returns priced lines.
//
// Admin/installer-only surface, EN-only like the rest of the portal.
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, TriangleAlert, RefreshCw } from 'lucide-react';
import { PRICE_MARKETS } from '@/lib/portal/types';
import ConfiguratorOrder, { type OrderCeilingInput } from './ConfiguratorOrder';

// ---------------------------------------------------------------------------
// Shapes mirrored from the API (kept local so the client bundle stays small)
// ---------------------------------------------------------------------------
export type ViewOption = {
  kind: string;
  slug: string;
  label: string;
  material: string | null;
  finish: string | null;
  colourGroup: string | null;
  fabricKind: string | null;
  maxWidthCm: number | null;
  qtyRule: string;
  companionSlug: string | null;
};

export type QuoteLine = {
  kind: string;
  slug: string;
  label: string;
  code: string | null;
  qty: number;
  unit: string | null;
  unitPriceEur: number | null;
  lineTotalEur: number | null;
  unitPricePln: number | null;
  lineTotalPln: number | null;
  status: 'ok' | 'no_row' | 'no_price';
  companionOf?: string;
  note?: string;
};

export type Quote = {
  market: string;
  currency: 'EUR' | 'PLN';
  lines: QuoteLine[];
  notes: string[];
  subtotalEur: number;
  subtotalPln: number | null;
  needsManualPricing: boolean;
  unpricedCount: number;
  area: number;
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

export type ConfigState = {
  reference: string;
  length: string;
  width: string;
  shape: 'flat' | 'sloped';
  slopeRun: string;
  /** The angled ceiling's own length along the fold. */
  foldLength: string;
  foldSide: 'length' | 'width';
  seamDirection: 'auto' | 'length' | 'width';
  material: 'PVC' | 'fabric';
  finish: string;
  colourGroup: string;
  fabricKind: string;
  profileSlug: string;
  cornersInside: string;
  cornersOutside: string;
  platforms: { slug: string; qty: string }[];
  absorberSlug: string;
  lights: { slug: string; qty: string }[];
};

const INITIAL: ConfigState = {
  reference: '',
  length: '4.20',
  width: '3.40',
  shape: 'flat',
  slopeRun: '',
  foldLength: '',
  foldSide: 'length',
  seamDirection: 'auto',
  material: 'PVC',
  finish: 'matte',
  colourGroup: 'white',
  fabricKind: 'standard',
  profileSlug: '',
  cornersInside: '4',
  cornersOutside: '0',
  platforms: [],
  absorberSlug: '',
  lights: [],
};

/** Mirrors CORNER_DEFAULTS in bom.ts — the form prefills, the engine agrees. */
const CORNERS_FOR_SHAPE = {
  flat: { inside: 4, outside: 0 },
  sloped: { inside: 4, outside: 2 },
} as const;

const KIND_GROUP_TITLES: Record<string, string> = {
  ceiling: 'Ceiling',
  profile: 'Perimeter profile',
  transition: 'Fold edge',
  corner: 'Corners',
  platform: 'Light supports',
  absorber: 'Acoustic absorber',
  light: 'Lighting',
  light_colour: 'Light colour',
  service: 'Services',
};

function num(v: string): number {
  const n = Number(String(v).replace(',', '.'));
  return isFinite(n) ? n : 0;
}

/** Payload for the API — dimensions and slugs only, never a price. */
export function toPayload(c: ConfigState, market: string) {
  return {
    length: num(c.length),
    width: num(c.width),
    shape: c.shape,
    slopeRun: c.shape === 'sloped' ? num(c.slopeRun) : 0,
    foldLength: c.shape === 'sloped' && num(c.foldLength) > 0 ? num(c.foldLength) : null,
    foldSide: c.foldSide,
    seamDirection: c.seamDirection,
    material: c.material,
    finish: c.material === 'PVC' ? c.finish : null,
    colourGroup: c.material === 'PVC' ? c.colourGroup : null,
    fabricKind: c.material === 'fabric' ? c.fabricKind : null,
    profileSlug: c.profileSlug || null,
    cornersInside: c.cornersInside === '' ? null : num(c.cornersInside),
    cornersOutside: c.cornersOutside === '' ? null : num(c.cornersOutside),
    platforms: c.platforms.filter((p) => p.slug && num(p.qty) > 0).map((p) => ({ slug: p.slug, qty: num(p.qty) })),
    absorberSlug: c.absorberSlug || null,
    lights: c.lights.filter((l) => l.slug && num(l.qty) > 0).map((l) => ({ slug: l.slug, qty: num(l.qty) })),
    reference: c.reference.trim() || null,
    market,
  };
}

export default function ConfiguratorView({
  demo,
  market: initialMarket,
  canChooseMarket,
  formatLocale,
  accountEmail,
  company,
}: {
  demo: boolean;
  market: string;
  canChooseMarket: boolean;
  formatLocale: string;
  accountEmail: string;
  company: string | null;
}) {
  const [config, setConfig] = useState<ConfigState>(INITIAL);
  const [options, setOptions] = useState<ViewOption[]>([]);
  const [ready, setReady] = useState<boolean | null>(null);
  const [market, setMarket] = useState(initialMarket);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pricing, setPricing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  const set = useCallback(<K extends keyof ConfigState>(key: K, value: ConfigState[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
  }, []);

  // --- catalogue ------------------------------------------------------------
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/portal/configurator/quote');
        const json = await res.json();
        if (!alive) return;
        if (!json.ok) {
          setErr(json.error ?? 'Could not load the catalogue.');
          setReady(false);
          return;
        }
        setOptions(json.options ?? []);
        setReady(Boolean(json.ready));
      } catch {
        if (alive) {
          setErr('Could not load the catalogue.');
          setReady(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // --- derived read-outs, computed as they type (no round-trip) -------------
  const L = num(config.length);
  const W = num(config.width);
  const S = config.shape === 'sloped' ? num(config.slopeRun) : 0;
  const foldFrom = config.foldSide === 'width' ? W : L;
  // The angled ceiling's own fold length; empty = as long as the side it folds from.
  const foldEdge = num(config.foldLength) > 0 ? num(config.foldLength) : foldFrom;
  const derived = useMemo(() => {
    const flatArea = L * W;
    const angledArea = S > 0 ? foldEdge * S : 0;
    const shared = S > 0 ? Math.min(foldEdge, foldFrom) : 0;
    const perimeter = 2 * L + 2 * W + (S > 0 ? 2 * foldEdge + 2 * S - 2 * shared : 0);
    const spans = [Math.min(L, W)];
    if (S > 0) spans.push(Math.min(foldEdge, S));
    return { area: flatArea + angledArea, flatArea, angledArea, perimeter, need: Math.max(...spans, 0) };
  }, [L, W, S, foldEdge, foldFrom]);

  // --- pricing (debounced; typing is never blocked on the network) ---------
  const price = useCallback(
    async (c: ConfigState, m: string) => {
      if (num(c.length) <= 0 || num(c.width) <= 0) return;
      const mine = ++seq.current;
      setPricing(true);
      try {
        const res = await fetch('/api/portal/configurator/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toPayload(c, m)),
        });
        const json = await res.json();
        if (mine !== seq.current) return; // a newer request has overtaken this one
        if (!json.ok) {
          setErr(json.error ?? 'Could not price this configuration.');
          return;
        }
        setErr(null);
        setQuote(json.quote as Quote);
      } catch {
        if (mine === seq.current) setErr('Could not price this configuration.');
      } finally {
        if (mine === seq.current) setPricing(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void price(config, market), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [config, market, ready, price]);

  // The form must never OPEN on a combination the catalogue cannot price. The
  // material, finish, colour and fabric kind it starts on are only defaults:
  // once the catalogue is known, move to the first choice that has a roll.
  useEffect(() => {
    const ceilings = options.filter((o) => o.kind === 'ceiling');
    if (ceilings.length === 0) return;
    setConfig((c) => {
      const has = (m: string) => ceilings.some((o) => o.material === m);
      const material = has(c.material) ? c.material : has('PVC') ? 'PVC' : 'fabric';
      if (!has(material)) return c;
      const family = ceilings.filter((o) => o.material === material);
      const pick = (current: string, values: (string | null)[]) => {
        const list = values.filter((v): v is string => Boolean(v));
        return list.includes(current) ? current : (list[0] ?? current);
      };
      if (material === 'fabric') {
        const fabricKind = pick(c.fabricKind, family.map((o) => o.fabricKind));
        return c.material === material && c.fabricKind === fabricKind ? c : { ...c, material, fabricKind };
      }
      const finish = pick(c.finish, family.map((o) => o.finish));
      const colourGroup = pick(
        c.colourGroup,
        family.filter((o) => o.finish === finish).map((o) => o.colourGroup),
      );
      return c.material === material && c.finish === finish && c.colourGroup === colourGroup
        ? c
        : { ...c, material, finish, colourGroup };
    });
  }, [options]);

  // A profile that belongs to the other material must not survive a material
  // switch — it would silently price the wrong product. (The fold edge and the
  // corner piece are picked by the engine per material, so they cannot drift.)
  useEffect(() => {
    setConfig((c) => {
      const fits =
        !c.profileSlug ||
        options.some((o) => o.slug === c.profileSlug && (o.material === null || o.material === c.material));
      return fits ? c : { ...c, profileSlug: '' };
    });
  }, [config.material, options]);

  // --- option lists ---------------------------------------------------------
  const byKind = useCallback((kind: string) => options.filter((o) => o.kind === kind), [options]);
  /**
   * The perimeter profile and the corner product differ by material — an ALU
   * profile for a PVC ceiling, a PVC profile for a polyester one — so only
   * offer what fits. An option with no material recorded suits either.
   */
  const forMaterial = useCallback(
    (kind: string) =>
      options.filter((o) => o.kind === kind && (o.material === null || o.material === config.material)),
    [options, config.material],
  );
  const profiles = useMemo(() => forMaterial('profile'), [forMaterial]);
  /** Empty for polyester today — the corner piece is a PVC product. */
  const corners = useMemo(() => forMaterial('corner'), [forMaterial]);
  const platformOptions = useMemo(() => byKind('platform'), [byKind]);
  const absorbers = useMemo(() => byKind('absorber'), [byKind]);
  /**
   * A fitting and a colour temperature of that fitting are both just pricebook
   * rows, so they share one list: the installer picks rows and a count each,
   * and no fitting can be charged twice.
   */
  const lightOptions = useMemo(
    () => [...byKind('light'), ...byKind('light_colour')],
    [byKind],
  );

  /** Finishes and colours that actually have a roll — never offer a dead end. */
  const available = useMemo(() => {
    const ceilings = options.filter((o) => o.kind === 'ceiling');
    const finishes = new Set<string>();
    const colours = new Set<string>();
    const fabricKinds = new Set<string>();
    for (const c of ceilings) {
      if (c.material === 'PVC') {
        if (c.finish) finishes.add(c.finish);
        if (c.finish === config.finish && c.colourGroup) colours.add(c.colourGroup);
      } else if (c.fabricKind) fabricKinds.add(c.fabricKind);
    }
    return {
      finishes: [...finishes],
      colours: [...colours],
      fabricKinds: [...fabricKinds],
      hasPvc: ceilings.some((c) => c.material === 'PVC'),
      hasFabric: ceilings.some((c) => c.material === 'fabric'),
    };
  }, [options, config.finish]);

  const fmt = useMemo(
    () => new Intl.NumberFormat(formatLocale, { style: 'currency', currency: 'EUR' }),
    [formatLocale],
  );
  const fmtPln = useMemo(
    () => new Intl.NumberFormat(formatLocale, { style: 'currency', currency: 'PLN' }),
    [formatLocale],
  );
  const money = useCallback(
    (eur: number | null, pln: number | null) => {
      if (quote?.currency === 'PLN' && pln != null) return fmtPln.format(pln);
      return eur == null ? 'price on request' : fmt.format(eur);
    },
    [quote?.currency, fmt, fmtPln],
  );

  const thisTotal = quote
    ? quote.currency === 'PLN' && quote.subtotalPln != null
      ? fmtPln.format(quote.subtotalPln)
      : fmt.format(quote.subtotalEur)
    : null;

  const complete = Boolean(quote && !quote.incomplete && quote.lines.length > 0 && L > 0 && W > 0);

  // --- the order: several ceilings ------------------------------------------
  // Michael, 8 Sep 2026: "Create the ability to order multiple ceiling kits."
  // "Add to order" freezes the ceiling being edited (its configuration and the
  // server's quote for it) into this list and clears the form for the next
  // one. The order is the list plus the ceiling being edited when that one is
  // complete — so a single ceiling still orders without an extra click.
  const [basket, setBasket] = useState<{ id: string; config: ConfigState; quote: Quote }[]>([]);
  const addToOrder = useCallback(() => {
    if (!quote || !complete) return;
    const id = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    setBasket((b) => [...b, { id, config: { ...config, platforms: [...config.platforms], lights: [...config.lights] }, quote }]);
    // The next ceiling keeps the job's choices (foil, profile, seams, extras)
    // and starts with a fresh room and no name.
    setConfig((c) => ({ ...c, reference: '', length: INITIAL.length, width: INITIAL.width, shape: 'flat', slopeRun: '', foldLength: '' }));
    setQuote(null);
  }, [quote, complete, config]);
  const removeFromOrder = useCallback((id: string) => setBasket((b) => b.filter((x) => x.id !== id)), []);
  const editFromOrder = useCallback(
    (id: string) => {
      const item = basket.find((x) => x.id === id);
      if (!item) return;
      setBasket((b) => b.filter((x) => x.id !== id));
      setConfig(item.config);
      setQuote(item.quote);
    },
    [basket],
  );
  const orderCeilings = useMemo<OrderCeilingInput[]>(
    () => [
      ...basket.map((b) => ({ config: b.config, quote: b.quote })),
      ...(quote && complete ? [{ config, quote, current: true }] : []),
    ],
    [basket, quote, complete, config],
  );
  const orderable = orderCeilings.length > 0;
  const orderFrom = orderCeilings.some((c) => c.quote.needsManualPricing);
  const total = useMemo(() => {
    if (orderCeilings.length === 0) return null;
    const allPln = orderCeilings.every((c) => c.quote.currency === 'PLN' && c.quote.subtotalPln != null);
    const sum = orderCeilings.reduce((s, c) => s + (allPln ? c.quote.subtotalPln ?? 0 : c.quote.subtotalEur), 0);
    return allPln ? fmtPln.format(sum) : fmt.format(sum);
  }, [orderCeilings, fmt, fmtPln]);

  // -------------------------------------------------------------------------
  if (ready === false) {
    return (
      <div className="container cfg-empty">
        <h1>Configurator</h1>
        <p>
          {demo
            ? 'Demo mode — the configurator needs the live pricebook and option catalogue.'
            : 'The option catalogue is empty. An admin seeds it with scripts/seed-configurator-options.mjs and switches on the real options under Admin ▸ Configurator.'}
        </p>
        {err && <p className="cfg-err">{err}</p>}
        <style jsx>{`
  .cfg { padding-top: clamp(24px,3vw,44px); padding-bottom: clamp(60px,7vw,90px); }
  .cfg-empty { padding: clamp(40px,6vw,90px) 0; max-width: 640px; }
  .cfg-empty h1 { font-family: var(--font-display); font-weight: 900; text-transform: uppercase; font-size: clamp(26px,3.4vw,42px); margin: 0 0 12px; }
  .cfg-empty p { color: var(--text-muted); font-size: 15px; line-height: 1.65; }
  .cfg-head { margin: 0 0 8px; }
  .cfg-head .eyebrow { display: flex; align-items: center; gap: 12px; }
  .cfg-head .dot { background: var(--red); width: 10px; height: 10px; display: inline-block; }
  .cfg-head h1 { font-family: var(--font-display); font-weight: 900; text-transform: uppercase; font-size: clamp(28px,4vw,50px); line-height: 1; margin: 12px 0 10px; }
  .cfg-head .lead { color: var(--text-muted); font-size: 15px; line-height: 1.6; max-width: 620px; margin: 0 0 14px; }
  .cfg-market { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
  .cfg-market select { font: inherit; font-size: 13px; text-transform: none; letter-spacing: 0; padding: 5px 8px; border: 1px solid var(--border-input); background: #fff; }
  .cfg-grid { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 34px; align-items: start; margin-top: 18px; }
  .cfg-grid > * { min-width: 0; }
  .cfg-form .row > * { min-width: 0; }
  .cfg-form .row { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; }
  .cfg-form input, .cfg-form select { font: inherit; font-size: 14px; padding: 9px 11px; border: 1px solid var(--border-input); background: #fff; width: 100%; min-width: 0; }
  .derived { display: flex; gap: 22px; flex-wrap: wrap; margin: 14px 0 0; padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); }
  .derived div { display: flex; flex-direction: column; gap: 2px; }
  .derived dt { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-faint-2); }
  .derived dd { margin: 0; font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .seg { display: inline-flex; border: 1px solid var(--black); margin: 0 0 14px; flex-wrap: wrap; }
  .seg button { font: inherit; font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; padding: 9px 18px; background: #fff; border: 0; cursor: pointer; }
  .seg button.on { background: var(--black); color: #fff; }
  .seg button:disabled { opacity: .4; cursor: not-allowed; }
  .foilbox { border-left: 3px solid var(--red); background: var(--surface); padding: 12px 14px; margin: 14px 0 0; }
  .foilbox.bad { border-left-color: #9a6b00; background: #fff7e6; }
  .foilbox .k { font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 5px; }
  .foilbox .v { font-size: 15px; font-weight: 800; margin: 0 0 4px; }
  .foilbox .why { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0; }
  .iconbtn { align-self: flex-end; border: 1px solid var(--border-input); background: #fff; padding: 9px 10px; cursor: pointer; color: var(--text-muted); }
  .add { display: inline-flex; align-items: center; gap: 7px; font: inherit; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--red); background: none; border: 0; cursor: pointer; padding: 12px 0 0; }
  .add:disabled { opacity: .4; cursor: not-allowed; }
  .basket { margin: 18px 0 0; border-top: 1px solid var(--border); padding-top: 14px; }
  .basket-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .basket-head .k { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; margin: 0; }
  .basket .add { margin: 0; }
  .basket-hint { font-size: 12px; color: var(--text-faint); line-height: 1.55; margin: 8px 0 0; }
  .basket-list { list-style: none; margin: 10px 0 0; padding: 0; border: 1px solid var(--border); }
  .basket-list li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--border); font-size: 12.5px; }
  .basket-list li:last-child { border-bottom: 0; }
  .basket-list li.current { background: #fafafa; color: var(--text-muted); }
  .basket-list .meta { color: var(--text-muted); }
  .basket-list .right { display: flex; align-items: center; gap: 10px; white-space: nowrap; }
  .basket-list .amt { font-weight: 800; font-variant-numeric: tabular-nums; }
  .basket-list .lnk { font: inherit; font-size: 11.5px; font-weight: 700; background: none; border: 0; padding: 2px 4px; cursor: pointer; color: var(--red); display: inline-flex; align-items: center; }
  .basket-total { display: flex; align-items: baseline; justify-content: space-between; margin: 10px 0 0; }
  .basket-total span { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
  .basket-total strong { font-size: 18px; font-weight: 900; font-variant-numeric: tabular-nums; }
  .subhead { font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin: 14px 0 6px; }
  .running { font-size: 12.5px; color: var(--text-muted); margin: 10px 0 0; }
  .cfg-result .sticky { position: sticky; top: 18px; }
  .facts { display: flex; gap: 18px; flex-wrap: wrap; margin: 14px 0; }
  .facts div { display: flex; flex-direction: column; gap: 2px; }
  .facts dt { font-size: 9.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-faint-2); }
  .facts dd { margin: 0; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .facts dd .sub { font-size: 10.5px; font-weight: 600; color: var(--text-faint-2); }
  .tablewrap .cut { display: block; font-size: 11px; color: var(--text-muted); margin-top: 2px; line-height: 1.4; }
  .warnings { list-style: none; padding: 0; margin: 0 0 14px; display: flex; flex-direction: column; gap: 7px; }
  .warnings li { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; line-height: 1.5; color: #8a5b12; background: #fff7e6; border: 1px solid #f2dfb3; padding: 8px 10px; }
  .tablewrap { overflow-x: auto; border: 1px solid var(--border); background: #fff; }
  .cfg-result table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  .cfg-result th { text-align: left; font-size: 9.5px; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted-2); font-weight: 700; padding: 8px 10px; border-bottom: 2px solid var(--black); }
  .cfg-result td { padding: 8px 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .cfg-result td.n { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .cfg-result td.b { font-weight: 700; }
  .cfg-result td.muted { color: var(--text-muted); }
  .cfg-result tr.grouprow td { background: var(--surface); font-size: 9.5px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); padding: 6px 10px; }
  .cfg-result tr.unpriced td { background: #fffdf5; }
  .tag { display: inline-block; font-size: 9.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-faint-2); border: 1px solid var(--border-2); padding: 1px 5px; margin-left: 6px; white-space: nowrap; }
  .tag.warn { color: #9a6b00; border-color: #f2dfb3; background: #fff7e6; }
  .total { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; border-top: 2px solid var(--black); padding: 12px 2px 0; margin-top: 0; }
  .total span { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
  .total strong { font-family: var(--font-display); font-size: clamp(22px,2.6vw,30px); font-weight: 900; font-variant-numeric: tabular-nums; }
  .fromnote { font-size: 12px; color: #8a5b12; line-height: 1.5; margin: 8px 0 0; }
  .smallprint { font-size: 11px; color: var(--text-faint); line-height: 1.55; margin: 10px 0 0; }
  .cfg-err { color: var(--red); font-size: 13px; font-weight: 600; margin: 10px 0 0; }
  .spin { animation: cfgspin 1s linear infinite; }
  @keyframes cfgspin { to { transform: rotate(360deg); } }
  .cfg-bottombar { display: none; }
  @media (max-width: 1080px) {
    .cfg-grid { grid-template-columns: 1fr; }
    .cfg-result .sticky { position: static; }
    .cfg { padding-bottom: 96px; }
    .cfg-bottombar {
      display: flex; align-items: center; gap: 14px;
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 20;
      background: var(--black); color: #fff; padding: 10px 16px;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    }
    .cfg-bottombar .l { display: block; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #b9b9b9; }
    .cfg-bottombar strong { font-size: 19px; font-weight: 900; font-variant-numeric: tabular-nums; }
    .cfg-bottombar .b {
      margin-left: auto; background: var(--red); color: #fff; text-decoration: none;
      font-size: 12.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
      padding: 12px 22px;
    }
  }
  @media (max-width: 520px) {
    .cfg-head h1 { font-size: clamp(26px, 8.5vw, 34px); }
    .cfg-head .lead { font-size: 14px; }
    .derived { gap: 10px 16px; padding: 10px 12px; }
    .derived dd { font-size: 15px; }
    .derived dd .sub { display: block; font-size: 11px; font-weight: 600; }
    /* Two fields to a row, a third wraps under them at half width. */
    .cfg-form .row { gap: 10px; }
    .cfg-form .row > * { flex: 1 1 calc(50% - 5px); }
    .cfg-form input, .cfg-form select { font-size: 16px; padding: 10px 11px; } /* 16px: no iOS zoom on focus */
    .seg button { padding: 11px 14px; font-size: 11.5px; }
    /* The read-outs: a tidy two-column grid instead of a row that clips. */
    .facts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; margin: 12px 0; }
    .facts dd .sub { display: block; }
    .foilbox .v { font-size: 14px; }
    .cfg-result th, .cfg-result td { padding: 7px 8px; }
    .cfg-result table { font-size: 12px; }
    /* Ceilings in the order: the amount and the buttons drop under the name. */
    .basket-list li { flex-wrap: wrap; padding: 9px 10px; }
    .basket-list .right { width: 100%; justify-content: space-between; }
    .basket .add { width: 100%; justify-content: center; }
    /* The fixed bar: the total may wrap, the button never clips. */
    .cfg-bottombar { gap: 10px; padding: 9px 12px; padding-bottom: calc(9px + env(safe-area-inset-bottom, 0px)); }
    .cfg-bottombar > div { min-width: 0; }
    .cfg-bottombar .l { font-size: 9.5px; letter-spacing: .08em; white-space: normal; }
    .cfg-bottombar strong { font-size: 17px; }
    .cfg-bottombar .b { flex: 0 0 auto; white-space: nowrap; padding: 11px 16px; font-size: 12px; }
  }
`}</style>
      </div>
    );
  }

  // Section numbers are handed out as the form renders, so a section that is
  // not shown (Corners, on a material with no corner piece) leaves no gap.
  let sectionNo = 0;
  const step = () => (sectionNo += 1);

  return (
    <div className="container cfg">
      <header className="cfg-head">
        <p className="eyebrow">
          <span className="dot" /> Kit configurator
        </p>
        <h1>Build the ceiling, see the price.</h1>
        <p className="lead">
          Enter the room and the finish. The engine picks the foil, works out the profiles, seams and corners, and
          prices every line against your own pricelist.
        </p>
        {canChooseMarket && (
          <label className="cfg-market">
            Price group
            <select value={market} onChange={(e) => setMarket(e.target.value)}>
              {PRICE_MARKETS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      <div className="cfg-grid">
        {/* ------------------------------------------------------------- form */}
        <div className="cfg-form">
          <Section n={step()} title={config.shape === 'sloped' ? 'The flat ceiling' : 'The room'}>
            {/* Names this ceiling. A job is several of them, and "Living room"
                beats "the 4.20 × 3.40 one" on the production sheet. */}
            <Field label="Reference" hint="What you call this ceiling — it travels with the order.">
              <input
                value={config.reference}
                onChange={(e) => set('reference', e.target.value)}
                maxLength={120}
                placeholder="Living room"
                aria-label="Ceiling reference"
              />
            </Field>
            <div className="row">
              <Field label="Length (m)">
                <input
                  inputMode="decimal"
                  value={config.length}
                  onChange={(e) => set('length', e.target.value)}
                  aria-label="Length in metres"
                />
              </Field>
              <Field label="Width (m)">
                <input
                  inputMode="decimal"
                  value={config.width}
                  onChange={(e) => set('width', e.target.value)}
                  aria-label="Width in metres"
                />
              </Field>
            </div>
            {/* Derived, at the point of entry — outputs, never inputs. */}
            <dl className="derived">
              <div>
                <dt>Surface</dt>
                <dd>
                  {derived.area.toFixed(2)} m²
                  {derived.angledArea > 0 && (
                    <span className="sub">
                      {' '}
                      flat {derived.flatArea.toFixed(2)} + angled {derived.angledArea.toFixed(2)}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Perimeter</dt>
                <dd>{derived.perimeter.toFixed(2)} m</dd>
              </div>
              <div>
                <dt>Widest span</dt>
                <dd>{derived.need.toFixed(2)} m</dd>
              </div>
            </dl>
          </Section>

          <Section n={step()} title="Shape">
            <div className="seg">
              {(['flat', 'sloped'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={config.shape === s ? 'on' : ''}
                  onClick={() => {
                    // The corner counts follow the shape, then stay editable.
                    const d = CORNERS_FOR_SHAPE[s];
                    setConfig((c) => ({
                      ...c,
                      shape: s,
                      cornersInside: String(d.inside),
                      cornersOutside: String(d.outside),
                    }));
                  }}
                >
                  {s === 'flat' ? 'Flat ceiling' : 'Flat + angled'}
                </button>
              ))}
            </div>
            {config.shape === 'sloped' && (
              <>
                {/* The angled ceiling is its own size — Michael, 7 Sep 2026:
                    "We should be able to add the size of the angled ceiling
                    separately." It is not the flat ceiling's side × a slope. */}
                <p className="subhead">Angled ceiling</p>
                <div className="row">
                  <Field label="Along the fold (m)" hint={`Its length where it meets the flat ceiling. Empty = the whole ${config.foldSide} (${foldFrom.toFixed(2)} m).`}>
                    <input
                      inputMode="decimal"
                      value={config.foldLength}
                      onChange={(e) => set('foldLength', e.target.value)}
                      placeholder={foldFrom.toFixed(2)}
                      aria-label="Angled ceiling length along the fold in metres"
                    />
                  </Field>
                  <Field label="Slope run (m)" hint="Measured along the slope, not the horizontal projection.">
                    <input
                      inputMode="decimal"
                      value={config.slopeRun}
                      onChange={(e) => set('slopeRun', e.target.value)}
                      aria-label="Slope run in metres"
                    />
                  </Field>
                  <Field label="The fold runs along">
                    <select value={config.foldSide} onChange={(e) => set('foldSide', e.target.value as 'length' | 'width')}>
                      <option value="length">the length ({L.toFixed(2)} m)</option>
                      <option value="width">the width ({W.toFixed(2)} m)</option>
                    </select>
                  </Field>
                </div>
                {S > 0 && (
                  <p className="running">
                    Angled ceiling {foldEdge.toFixed(2)} × {S.toFixed(2)} m = {(foldEdge * S).toFixed(2)} m², on top of the flat{' '}
                    {(L * W).toFixed(2)} m².
                  </p>
                )}
              </>
            )}
          </Section>

          <Section n={step()} title="Foil">
            {/* A material with no active roll is not offered at all — a greyed
                button is a dead end the installer still has to read. PVC comes
                back by itself the day a PVC roll is activated. */}
            <div className="seg">
              {(['PVC', 'fabric'] as const)
                .filter((m) => (m === 'PVC' ? available.hasPvc : available.hasFabric))
                .map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={config.material === m ? 'on' : ''}
                    onClick={() => set('material', m)}
                  >
                    {m === 'PVC' ? 'PVC' : 'Fabric'}
                  </button>
                ))}
            </div>
            {config.material === 'PVC' ? (
              <div className="row">
                <Field label="Finish">
                  <select value={config.finish} onChange={(e) => set('finish', e.target.value)}>
                    {available.finishes.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Colour">
                  <select value={config.colourGroup} onChange={(e) => set('colourGroup', e.target.value)}>
                    {available.colours.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            ) : (
              <Field label="Fabric">
                <select value={config.fabricKind} onChange={(e) => set('fabricKind', e.target.value)}>
                  {available.fabricKinds.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {/* Which way the seams run is the installer's call: it decides
                which side the roll has to span, so it can add or remove a
                seam and change which rolls the pieces come off. */}
            <Field
              label="Seams run along"
              hint="Automatic lays the cloth for the fewest seams. Choose a side to run them the other way."
            >
              <select value={config.seamDirection} onChange={(e) => set('seamDirection', e.target.value as ConfigState['seamDirection'])}>
                <option value="auto">automatic — fewest seams</option>
                <option value="length">the length ({(L || 0).toFixed(2)} m)</option>
                <option value="width">the width ({(W || 0).toFixed(2)} m)</option>
              </select>
            </Field>

            {/* The engine's choice, with its reason — the installer never
                picks a roll width or a product name. */}
            <div className={quote?.foil.slug ? 'foilbox' : 'foilbox bad'}>
              <p className="k">Foil chosen for you</p>
              {quote?.foil.slug ? (
                <>
                  <p className="v">{quote.foil.product ?? quote.foil.label}</p>
                  <p className="why">
                    {quote.foil.reason}
                    {(quote.clothWidthsCm ?? []).length > 1 &&
                      ` The pieces are cut from the ${quote.clothWidthsCm.join(', ')} cm rolls — a seam's remainder comes off the narrowest roll that covers it.`}
                  </p>
                </>
              ) : (
                <p className="why">{quote?.foil.reason ?? 'Enter the room to see which foil fits.'}</p>
              )}
            </div>
          </Section>

          <Section n={step()} title="Perimeter profile">
            <Field label="Profile">
              <select value={config.profileSlug} onChange={(e) => set('profileSlug', e.target.value)}>
                <option value="">— none —</option>
                {profiles.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          {/* Only a material that HAS a corner piece asks for corner counts —
              a polyester ceiling has none, so nothing to count. The piece
              itself is not a choice: the engine takes the one for the
              material, exactly as it does the fold edge. */}
          {corners.length > 0 && (
          <Section n={step()} title="Corners">
            <div className="row">
              <Field label="Inside" hint={`Default for this shape: ${CORNERS_FOR_SHAPE[config.shape].inside}`}>
                <input
                  inputMode="numeric"
                  value={config.cornersInside}
                  onChange={(e) => set('cornersInside', e.target.value)}
                  aria-label="Inside corners"
                />
              </Field>
              <Field label="Outside" hint={`Default for this shape: ${CORNERS_FOR_SHAPE[config.shape].outside}`}>
                <input
                  inputMode="numeric"
                  value={config.cornersOutside}
                  onChange={(e) => set('cornersOutside', e.target.value)}
                  aria-label="Outside corners"
                />
              </Field>
            </div>
          </Section>
          )}

          <Section n={step()} title="Light supports">
            {config.platforms.map((p, i) => (
              <div className="row" key={i}>
                <Field label="Type">
                  <select
                    value={p.slug}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        platforms: c.platforms.map((x, j) => (j === i ? { ...x, slug: e.target.value } : x)),
                      }))
                    }
                  >
                    <option value="">— choose —</option>
                    {platformOptions
                      .filter((o) => o.slug === p.slug || !config.platforms.some((x) => x.slug === o.slug))
                      .map((o) => (
                        <option key={o.slug} value={o.slug}>
                          {o.label}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Quantity">
                  <input
                    inputMode="numeric"
                    value={p.qty}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        platforms: c.platforms.map((x, j) => (j === i ? { ...x, qty: e.target.value } : x)),
                      }))
                    }
                    aria-label="Light support quantity"
                  />
                </Field>
                <button
                  type="button"
                  className="iconbtn"
                  onClick={() => setConfig((c) => ({ ...c, platforms: c.platforms.filter((_, j) => j !== i) }))}
                  aria-label="Remove this light support type"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add"
              disabled={config.platforms.length >= platformOptions.length}
              onClick={() => setConfig((c) => ({ ...c, platforms: [...c.platforms, { slug: '', qty: '1' }] }))}
            >
              <Plus size={14} /> Add another type
            </button>
            {config.platforms.length > 0 && (
              <p className="running">
                {config.platforms.reduce((s, p) => s + num(p.qty), 0)} support
                {config.platforms.reduce((s, p) => s + num(p.qty), 0) === 1 ? '' : 's'} in total
              </p>
            )}
          </Section>

          <Section n={step()} title="Acoustic absorber">
            <Field label="Type">
              <select value={config.absorberSlug} onChange={(e) => set('absorberSlug', e.target.value)}>
                <option value="">None</option>
                {absorbers.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            {/* No quantity field on purpose: the surface is always the ceiling. */}
            <p className="running">
              Absorber surface — {derived.area.toFixed(2)} m², always the same surface as the ceiling.
            </p>
          </Section>

          {/* Lighting works exactly like the light supports above: a real ceiling
              mixes fittings — six round spots, two tilting ones, the GU10
              lampholders that go in them — so it is a list, not one choice. */}
          <Section n={step()} title="Lighting">
            {config.lights.map((l, i) => (
              <div className="row" key={i}>
                <Field label="Type">
                  <select
                    value={l.slug}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        lights: c.lights.map((x, j) => (j === i ? { ...x, slug: e.target.value } : x)),
                      }))
                    }
                  >
                    <option value="">— choose —</option>
                    {lightOptions
                      .filter((o) => o.slug === l.slug || !config.lights.some((x) => x.slug === o.slug))
                      .map((o) => (
                        <option key={o.slug} value={o.slug}>
                          {o.label}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Quantity">
                  <input
                    inputMode="numeric"
                    value={l.qty}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        lights: c.lights.map((x, j) => (j === i ? { ...x, qty: e.target.value } : x)),
                      }))
                    }
                    aria-label="Light quantity"
                  />
                </Field>
                <button
                  type="button"
                  className="iconbtn"
                  onClick={() => setConfig((c) => ({ ...c, lights: c.lights.filter((_, j) => j !== i) }))}
                  aria-label="Remove this light type"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add"
              disabled={config.lights.length >= lightOptions.length}
              onClick={() => setConfig((c) => ({ ...c, lights: [...c.lights, { slug: '', qty: '1' }] }))}
            >
              <Plus size={14} /> Add another type
            </button>
            {config.lights.length > 0 && (
              <p className="running">
                {config.lights.reduce((s, l) => s + num(l.qty), 0)} light
                {config.lights.reduce((s, l) => s + num(l.qty), 0) === 1 ? '' : 's'} in total
              </p>
            )}
          </Section>
        </div>

        {/* ----------------------------------------------------------- result */}
        <aside className="cfg-result">
          <div className="sticky">
            <PlanView
              length={L}
              width={W}
              slope={S}
              foldLength={foldEdge}
              foldSide={config.foldSide}
              shape={config.shape}
            />

            <dl className="facts">
              <div>
                <dt>Surface</dt>
                <dd>{(quote?.area ?? derived.area).toFixed(2)} m²</dd>
              </div>
              {/* Fabric is bought by the running metre of roll, so the figure
                  the ceiling line is billed on is shown, not just the m². */}
              {quote && quote.rollMetres > 0 && quote.clothPieces > 0 && (
                <div>
                  <dt>Cloth</dt>
                  <dd>
                    {quote.rollMetres.toFixed(2)} m{' '}
                    <span className="sub">
                      {quote.clothPieces} piece{quote.clothPieces === 1 ? '' : 's'}
                      {/* Pieces may come off different rolls — a seam's
                          remainder is cut from a narrower one. */}
                      {(quote.clothWidthsCm ?? []).length > 0 && ` off ${quote.clothWidthsCm.join(' / ')} cm`}
                    </span>
                  </dd>
                </div>
              )}
              <div>
                <dt>Perimeter</dt>
                <dd>{(quote?.perimeter ?? derived.perimeter).toFixed(2)} m</dd>
              </div>
              <div>
                <dt>Price group</dt>
                <dd>{quote?.market ?? market}</dd>
              </div>
            </dl>

            {(quote?.notes.length ?? 0) > 0 && (
              <ul className="warnings">
                {quote!.notes.map((n, i) => (
                  <li key={i}>
                    <TriangleAlert size={13} /> {n}
                  </li>
                ))}
              </ul>
            )}
            {err && <p className="cfg-err">{err}</p>}

            <div className="tablewrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(quote?.lines ?? []).map((l, i) => {
                    const prev = quote!.lines[i - 1];
                    const head = !prev || prev.kind !== l.kind;
                    return (
                      <Fragment key={`${l.slug}-${i}`}>
                        {head && (
                          <tr className="grouprow">
                            <td colSpan={4}>{KIND_GROUP_TITLES[l.kind] ?? l.kind}</td>
                          </tr>
                        )}
                        <tr className={l.status === 'ok' ? undefined : 'unpriced'}>
                          <td>
                            {l.label}
                            {l.companionOf && <span className="tag">with {l.companionOf}</span>}
                            {l.status !== 'ok' && <span className="tag warn">price on request</span>}
                            {/* A piece of cloth carries its cut measurements —
                                production cuts exactly what is billed. */}
                            {l.kind === 'ceiling' && l.note && <span className="cut">{l.note}</span>}
                          </td>
                          <td className="n">
                            {l.qty} {l.unit ?? ''}
                          </td>
                          <td className="n">{l.unitPriceEur == null ? '—' : money(l.unitPriceEur, l.unitPricePln)}</td>
                          <td className="n b">{l.lineTotalEur == null ? '—' : money(l.lineTotalEur, l.lineTotalPln)}</td>
                        </tr>
                      </Fragment>
                    );
                  })}
                  {(quote?.lines.length ?? 0) === 0 && (
                    <tr>
                      <td colSpan={4} className="muted">
                        {pricing ? 'Pricing…' : 'Enter the room to see the bill of materials.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="total">
              <span>
                {quote?.needsManualPricing ? 'From' : 'Total'}
                {pricing && <RefreshCw size={12} className="spin" />}
              </span>
              <strong>{total ?? '—'}</strong>
            </div>
            {quote?.needsManualPricing && (
              <p className="fromnote">
                {quote.unpricedCount} line{quote.unpricedCount === 1 ? '' : 's'} still to be priced by hand, so the
                figure above is a &ldquo;from&rdquo; total — we confirm the rest on the proforma.
              </p>
            )}
            <p className="smallprint">
              Ex VAT, ex shipping. Invoicing in EUR (PLN for Poland).
              <br />
              Pricelist {quote?.pricebookVersion ?? '—'}
              {quote?.pricebookUpdatedAt ? ` · updated ${String(quote.pricebookUpdatedAt).slice(0, 10)}` : ''}
            </p>

            {/* Several ceilings in one order. */}
            <div className="basket">
              <div className="basket-head">
                <p className="k">Ceilings in this order</p>
                <button type="button" className="add" disabled={!complete} onClick={addToOrder} aria-label="Add this ceiling to the order">
                  <Plus size={14} /> Add this ceiling, start the next
                </button>
              </div>
              {basket.length === 0 && quote && complete && (
                <p className="basket-hint">
                  One ceiling orders as it is. For a job with several, add this one and configure the next — every ceiling is
                  listed, priced and sent together.
                </p>
              )}
              {basket.length > 0 && (
                <ol className="basket-list">
                  {basket.map((b, i) => (
                    <li key={b.id}>
                      <div>
                        <strong>{b.config.reference.trim() || `Ceiling ${i + 1}`}</strong>
                        <span className="meta">
                          {' '}
                          {b.config.length} × {b.config.width} m
                          {b.config.shape === 'sloped' && Number(b.config.slopeRun.replace(',', '.')) > 0
                            ? ` + ${b.config.foldLength || (b.config.foldSide === 'width' ? b.config.width : b.config.length)} × ${b.config.slopeRun} m`
                            : ''}{' '}
                          · {b.quote.area.toFixed(2)} m² · {b.quote.foil.product ?? b.quote.foil.label ?? '—'}
                        </span>
                      </div>
                      <div className="right">
                        <span className="amt">
                          {b.quote.needsManualPricing ? 'from ' : ''}
                          {money(b.quote.subtotalEur, b.quote.subtotalPln)}
                        </span>
                        <button type="button" className="lnk" onClick={() => editFromOrder(b.id)} aria-label={`Edit ceiling ${i + 1}`}>
                          Edit
                        </button>
                        <button type="button" className="lnk" onClick={() => removeFromOrder(b.id)} aria-label={`Remove ceiling ${i + 1}`}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </li>
                  ))}
                  {quote && complete && (
                    <li className="current">
                      <div>
                        <strong>{config.reference.trim() || `Ceiling ${basket.length + 1}`}</strong>
                        <span className="meta"> — the one you are editing, included as it stands</span>
                      </div>
                      <div className="right">
                        <span className="amt">
                          {quote.needsManualPricing ? 'from ' : ''}
                          {thisTotal}
                        </span>
                      </div>
                    </li>
                  )}
                </ol>
              )}
              {basket.length > 0 && (
                <p className="basket-total">
                  <span>
                    {orderFrom ? 'From' : 'Total'} — {orderCeilings.length} ceiling{orderCeilings.length === 1 ? '' : 's'}
                  </span>
                  <strong>{total ?? '—'}</strong>
                </p>
              )}
            </div>

            <div id="cfg-order" />
            <ConfiguratorOrder
              ceilings={orderCeilings}
              quote={quote}
              market={market}
              orderable={orderable}
              demo={demo}
              accountEmail={accountEmail}
              company={company}
              money={money}
              total={total}
            />
          </div>
        </aside>
      </div>

      {/* Mobile only: the running total stays in view while you scroll the form. */}
      <div className="cfg-bottombar" role="status" aria-live="polite">
        <div>
          <span className="l">
            {orderFrom ? 'From, ex VAT' : 'Total, ex VAT'}
            {orderCeilings.length > 1 ? ` · ${orderCeilings.length} ceilings` : ''}
          </span>
          <strong>{total ?? thisTotal ?? '—'}</strong>
        </div>
        <a href="#cfg-order" className="b">
          Order
        </a>
      </div>

      <style jsx>{`
  .cfg { padding-top: clamp(24px,3vw,44px); padding-bottom: clamp(60px,7vw,90px); }
  .cfg-empty { padding: clamp(40px,6vw,90px) 0; max-width: 640px; }
  .cfg-empty h1 { font-family: var(--font-display); font-weight: 900; text-transform: uppercase; font-size: clamp(26px,3.4vw,42px); margin: 0 0 12px; }
  .cfg-empty p { color: var(--text-muted); font-size: 15px; line-height: 1.65; }
  .cfg-head { margin: 0 0 8px; }
  .cfg-head .eyebrow { display: flex; align-items: center; gap: 12px; }
  .cfg-head .dot { background: var(--red); width: 10px; height: 10px; display: inline-block; }
  .cfg-head h1 { font-family: var(--font-display); font-weight: 900; text-transform: uppercase; font-size: clamp(28px,4vw,50px); line-height: 1; margin: 12px 0 10px; }
  .cfg-head .lead { color: var(--text-muted); font-size: 15px; line-height: 1.6; max-width: 620px; margin: 0 0 14px; }
  .cfg-market { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); }
  .cfg-market select { font: inherit; font-size: 13px; text-transform: none; letter-spacing: 0; padding: 5px 8px; border: 1px solid var(--border-input); background: #fff; }
  .cfg-grid { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 34px; align-items: start; margin-top: 18px; }
  .cfg-grid > * { min-width: 0; }
  .cfg-form .row > * { min-width: 0; }
  .cfg-form .row { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; }
  .cfg-form input, .cfg-form select { font: inherit; font-size: 14px; padding: 9px 11px; border: 1px solid var(--border-input); background: #fff; width: 100%; min-width: 0; }
  .derived { display: flex; gap: 22px; flex-wrap: wrap; margin: 14px 0 0; padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); }
  .derived div { display: flex; flex-direction: column; gap: 2px; }
  .derived dt { font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-faint-2); }
  .derived dd { margin: 0; font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .seg { display: inline-flex; border: 1px solid var(--black); margin: 0 0 14px; flex-wrap: wrap; }
  .seg button { font: inherit; font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; padding: 9px 18px; background: #fff; border: 0; cursor: pointer; }
  .seg button.on { background: var(--black); color: #fff; }
  .seg button:disabled { opacity: .4; cursor: not-allowed; }
  .foilbox { border-left: 3px solid var(--red); background: var(--surface); padding: 12px 14px; margin: 14px 0 0; }
  .foilbox.bad { border-left-color: #9a6b00; background: #fff7e6; }
  .foilbox .k { font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 5px; }
  .foilbox .v { font-size: 15px; font-weight: 800; margin: 0 0 4px; }
  .foilbox .why { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0; }
  .iconbtn { align-self: flex-end; border: 1px solid var(--border-input); background: #fff; padding: 9px 10px; cursor: pointer; color: var(--text-muted); }
  .add { display: inline-flex; align-items: center; gap: 7px; font: inherit; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--red); background: none; border: 0; cursor: pointer; padding: 12px 0 0; }
  .add:disabled { opacity: .4; cursor: not-allowed; }
  .basket { margin: 18px 0 0; border-top: 1px solid var(--border); padding-top: 14px; }
  .basket-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .basket-head .k { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; margin: 0; }
  .basket .add { margin: 0; }
  .basket-hint { font-size: 12px; color: var(--text-faint); line-height: 1.55; margin: 8px 0 0; }
  .basket-list { list-style: none; margin: 10px 0 0; padding: 0; border: 1px solid var(--border); }
  .basket-list li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--border); font-size: 12.5px; }
  .basket-list li:last-child { border-bottom: 0; }
  .basket-list li.current { background: #fafafa; color: var(--text-muted); }
  .basket-list .meta { color: var(--text-muted); }
  .basket-list .right { display: flex; align-items: center; gap: 10px; white-space: nowrap; }
  .basket-list .amt { font-weight: 800; font-variant-numeric: tabular-nums; }
  .basket-list .lnk { font: inherit; font-size: 11.5px; font-weight: 700; background: none; border: 0; padding: 2px 4px; cursor: pointer; color: var(--red); display: inline-flex; align-items: center; }
  .basket-total { display: flex; align-items: baseline; justify-content: space-between; margin: 10px 0 0; }
  .basket-total span { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
  .basket-total strong { font-size: 18px; font-weight: 900; font-variant-numeric: tabular-nums; }
  .subhead { font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); margin: 14px 0 6px; }
  .running { font-size: 12.5px; color: var(--text-muted); margin: 10px 0 0; }
  .cfg-result .sticky { position: sticky; top: 18px; }
  .facts { display: flex; gap: 18px; flex-wrap: wrap; margin: 14px 0; }
  .facts div { display: flex; flex-direction: column; gap: 2px; }
  .facts dt { font-size: 9.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-faint-2); }
  .facts dd { margin: 0; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .facts dd .sub { font-size: 10.5px; font-weight: 600; color: var(--text-faint-2); }
  .tablewrap .cut { display: block; font-size: 11px; color: var(--text-muted); margin-top: 2px; line-height: 1.4; }
  .warnings { list-style: none; padding: 0; margin: 0 0 14px; display: flex; flex-direction: column; gap: 7px; }
  .warnings li { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; line-height: 1.5; color: #8a5b12; background: #fff7e6; border: 1px solid #f2dfb3; padding: 8px 10px; }
  .tablewrap { overflow-x: auto; border: 1px solid var(--border); background: #fff; }
  .cfg-result table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  .cfg-result th { text-align: left; font-size: 9.5px; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted-2); font-weight: 700; padding: 8px 10px; border-bottom: 2px solid var(--black); }
  .cfg-result td { padding: 8px 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .cfg-result td.n { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .cfg-result td.b { font-weight: 700; }
  .cfg-result td.muted { color: var(--text-muted); }
  .cfg-result tr.grouprow td { background: var(--surface); font-size: 9.5px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); padding: 6px 10px; }
  .cfg-result tr.unpriced td { background: #fffdf5; }
  .tag { display: inline-block; font-size: 9.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-faint-2); border: 1px solid var(--border-2); padding: 1px 5px; margin-left: 6px; white-space: nowrap; }
  .tag.warn { color: #9a6b00; border-color: #f2dfb3; background: #fff7e6; }
  .total { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; border-top: 2px solid var(--black); padding: 12px 2px 0; margin-top: 0; }
  .total span { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
  .total strong { font-family: var(--font-display); font-size: clamp(22px,2.6vw,30px); font-weight: 900; font-variant-numeric: tabular-nums; }
  .fromnote { font-size: 12px; color: #8a5b12; line-height: 1.5; margin: 8px 0 0; }
  .smallprint { font-size: 11px; color: var(--text-faint); line-height: 1.55; margin: 10px 0 0; }
  .cfg-err { color: var(--red); font-size: 13px; font-weight: 600; margin: 10px 0 0; }
  .spin { animation: cfgspin 1s linear infinite; }
  @keyframes cfgspin { to { transform: rotate(360deg); } }
  .cfg-bottombar { display: none; }
  @media (max-width: 1080px) {
    .cfg-grid { grid-template-columns: 1fr; }
    .cfg-result .sticky { position: static; }
    .cfg { padding-bottom: 96px; }
    .cfg-bottombar {
      display: flex; align-items: center; gap: 14px;
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 20;
      background: var(--black); color: #fff; padding: 10px 16px;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    }
    .cfg-bottombar .l { display: block; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #b9b9b9; }
    .cfg-bottombar strong { font-size: 19px; font-weight: 900; font-variant-numeric: tabular-nums; }
    .cfg-bottombar .b {
      margin-left: auto; background: var(--red); color: #fff; text-decoration: none;
      font-size: 12.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
      padding: 12px 22px;
    }
  }
  @media (max-width: 520px) {
    .cfg-head h1 { font-size: clamp(26px, 8.5vw, 34px); }
    .cfg-head .lead { font-size: 14px; }
    .derived { gap: 10px 16px; padding: 10px 12px; }
    .derived dd { font-size: 15px; }
    .derived dd .sub { display: block; font-size: 11px; font-weight: 600; }
    /* Two fields to a row, a third wraps under them at half width. */
    .cfg-form .row { gap: 10px; }
    .cfg-form .row > * { flex: 1 1 calc(50% - 5px); }
    .cfg-form input, .cfg-form select { font-size: 16px; padding: 10px 11px; } /* 16px: no iOS zoom on focus */
    .seg button { padding: 11px 14px; font-size: 11.5px; }
    /* The read-outs: a tidy two-column grid instead of a row that clips. */
    .facts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; margin: 12px 0; }
    .facts dd .sub { display: block; }
    .foilbox .v { font-size: 14px; }
    .cfg-result th, .cfg-result td { padding: 7px 8px; }
    .cfg-result table { font-size: 12px; }
    /* Ceilings in the order: the amount and the buttons drop under the name. */
    .basket-list li { flex-wrap: wrap; padding: 9px 10px; }
    .basket-list .right { width: 100%; justify-content: space-between; }
    .basket .add { width: 100%; justify-content: center; }
    /* The fixed bar: the total may wrap, the button never clips. */
    .cfg-bottombar { gap: 10px; padding: 9px 12px; padding-bottom: calc(9px + env(safe-area-inset-bottom, 0px)); }
    .cfg-bottombar > div { min-width: 0; }
    .cfg-bottombar .l { font-size: 9.5px; letter-spacing: .08em; white-space: normal; }
    .cfg-bottombar strong { font-size: 17px; }
    .cfg-bottombar .b { flex: 0 0 auto; white-space: nowrap; padding: 11px 16px; font-size: 12px; }
  }
`}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="sec">
      <h2>
        <span className="n">({String(n).padStart(2, '0')})</span> {title}
      </h2>
      {children}
      <style jsx>{`
        .sec {
          border-top: 1px solid var(--border);
          padding: 20px 0 4px;
        }
        h2 {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        .n {
          color: var(--red);
          margin-right: 6px;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="fld">
      <span className="l">{label}</span>
      {children}
      {hint && <span className="h">{hint}</span>}
      <style jsx>{`
        .fld {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1 1 150px;
          min-width: 0;
        }
        .l {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .h {
          font-size: 11px;
          color: var(--text-faint);
          line-height: 1.4;
        }
      `}</style>
    </label>
  );
}

/** Plan view — tokens only, no chart library. The fold is drawn in red. */
function PlanView({
  length,
  width,
  slope,
  foldLength,
  foldSide,
  shape,
}: {
  length: number;
  width: number;
  slope: number;
  /** The angled panel's own length along the fold. */
  foldLength: number;
  foldSide: 'length' | 'width';
  shape: 'flat' | 'sloped';
}) {
  const L = Math.max(length, 0.1);
  const W = Math.max(width, 0.1);
  const S = shape === 'sloped' ? Math.max(slope, 0) : 0;
  const alongLength = foldSide === 'length';
  const foldFrom = alongLength ? L : W;
  const F = S > 0 ? Math.max(foldLength, 0.1) : 0;
  // Total drawn extent: the slope panel sits beyond the fold edge, and may be
  // shorter or longer than the side it folds from.
  const totalW = alongLength ? W + S : Math.max(W, F);
  const totalL = alongLength ? Math.max(L, F) : L + S;
  const pad = 34;
  const box = 300;
  const scale = Math.min((box - pad * 2) / totalL, (box * 0.72 - pad * 2) / totalW);
  const w = totalL * scale;
  const h = totalW * scale;
  const x = (box - w) / 2;
  const y = (box * 0.72 - h) / 2;
  const flatH = alongLength ? W * scale : Math.min(W, totalW) * scale;
  const flatW = alongLength ? Math.min(L, totalL) * scale : L * scale;
  // The angled panel starts at the fold's origin and runs F along it.
  const foldPx = F * scale;
  const slopePx = S * scale;

  return (
    <svg viewBox={`0 0 ${box} ${box * 0.72}`} className="plan" role="img" aria-label="Plan view of the ceiling">
      <rect x={x} y={y} width={flatW} height={flatH} fill="#f4f4f5" stroke="#111" strokeWidth="1.5" />
      {S > 0 &&
        (alongLength ? (
          <rect x={x} y={y + flatH} width={foldPx} height={slopePx} fill="#e6e6e8" stroke="#111" strokeWidth="1.5" />
        ) : (
          <rect x={x + flatW} y={y} width={slopePx} height={foldPx} fill="#e6e6e8" stroke="#111" strokeWidth="1.5" />
        ))}
      {S > 0 &&
        (alongLength ? (
          <line x1={x} y1={y + flatH} x2={x + Math.min(foldPx, flatW)} y2={y + flatH} stroke="#e2001a" strokeWidth="2.5" />
        ) : (
          <line x1={x + flatW} y1={y} x2={x + flatW} y2={y + Math.min(foldPx, flatH)} stroke="#e2001a" strokeWidth="2.5" />
        ))}
      <text x={x + flatW / 2} y={y - 10} textAnchor="middle" fontSize="11" fill="#555">
        {length.toFixed(2)} m
      </text>
      <text
        x={x - 10}
        y={y + flatH / 2}
        textAnchor="middle"
        fontSize="11"
        fill="#555"
        transform={`rotate(-90 ${x - 10} ${y + flatH / 2})`}
      >
        {width.toFixed(2)} m
      </text>
      {S > 0 && (
        <text
          x={alongLength ? x + foldPx / 2 : x + flatW + slopePx / 2}
          y={alongLength ? y + flatH + slopePx / 2 + 4 : y + Math.min(foldPx, flatH) + 16}
          textAnchor="middle"
          fontSize="10.5"
          fill="#e2001a"
        >
          {foldLength.toFixed(2)} × {slope.toFixed(2)} m
        </text>
      )}
      <style jsx>{`
        .plan {
          width: 100%;
          height: auto;
          background: #fff;
          border: 1px solid var(--border);
          display: block;
        }
      `}</style>
    </svg>
  );
}

