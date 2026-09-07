'use client';

// CLIENT PORTAL — admin ▸ Configurator.
// The option catalogue behind /portal/configurator: which pricebook row each
// option is, and how much of it a configuration needs. Nothing here stores a
// price — it points AT pricebook rows, and the resolved price is shown for a
// market of the admin's choosing so a broken pointer is obvious immediately.
//
// Admin-only and EN-only, like the rest of the panel.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, TriangleAlert, Sliders } from 'lucide-react';
import { PRICE_MARKETS } from '@/lib/portal/types';
import {
  COLOUR_GROUPS,
  FABRIC_KINDS,
  FINISHES,
  MATERIALS,
  OPTION_KINDS,
  QTY_RULES,
  ROUND_MODES,
} from '@/lib/portal/configurator/types';
import { CARD_CSS } from './admin-css';

type OptionRow = {
  id: number;
  kind: string;
  slug: string;
  label: string;
  description: string | null;
  match_code: string | null;
  match_category: string | null;
  match_product: string | null;
  match_seq: number | null;
  material: string | null;
  finish: string | null;
  colour_group: string | null;
  fabric_kind: string | null;
  max_width_cm: number | null;
  qty_rule: string;
  qty_factor: number | string;
  piece_length_m: number | string | null;
  per_n: number | null;
  min_qty: number | string;
  round_mode: string;
  companion_slug: string | null;
  companion_per_unit: number | string;
  requires: string[];
  excludes: string[];
  sort: number;
  active: boolean;
};

type ProductRow = {
  category: string;
  code: string | null;
  product: string;
  unit: string | null;
  seq: number;
  sort: number;
  prices: Record<string, number>;
};

type Resolution = { status: 'ok' | 'no_row' | 'no_price'; product: ProductRow | null; price: number | null };

/** Mirror of resolveOption() for the admin view (same rules, same order). */
function resolve(option: OptionRow, market: string, products: ProductRow[]): Resolution {
  let candidates: ProductRow[] = [];
  if (option.match_code) candidates = products.filter((p) => p.code === option.match_code);
  if (candidates.length === 0 && option.match_category && option.match_product) {
    candidates = products.filter((p) => p.category === option.match_category && p.product === option.match_product);
  }
  if (candidates.length === 0) return { status: 'no_row', product: null, price: null };
  const wanted = option.match_seq ?? 1;
  const product =
    candidates.find((p) => p.seq === wanted) ?? candidates.slice().sort((a, b) => a.seq - b.seq)[0];
  const price = product.prices[market];
  return typeof price === 'number'
    ? { status: 'ok', product, price }
    : { status: 'no_price', product, price: null };
}

const KIND_TITLES: Record<string, string> = {
  ceiling: 'Ceilings — the foil matrix',
  profile: 'Perimeter profiles',
  transition: 'Fold-edge / angle profiles',
  corner: 'Corners',
  platform: 'Light supports, platforms & rings',
  absorber: 'Acoustic absorbers',
  light: 'Lights',
  light_colour: 'Light colours',
  service: 'Services (welding …)',
};

export default function ConfiguratorCard({ demo }: { demo: boolean }) {
  const [options, setOptions] = useState<OptionRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [market, setMarket] = useState<string>('Installer');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [open, setOpen] = useState<string>('ceiling');
  const [saving, setSaving] = useState<number | null>(null);
  const [onlyProblems, setOnlyProblems] = useState(false);

  const load = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/portal/configurator/options');
      const json = await res.json();
      if (!json.ok) {
        setErr(json.error || 'Could not load the catalogue.');
        setNeedsMigration(Boolean(json.needsMigration));
        return;
      }
      setOptions(json.options ?? []);
      setProducts(json.products ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not load the catalogue.');
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    void load();
  }, [load]);

  const resolutions = useMemo(() => {
    const m = new Map<number, Resolution>();
    for (const o of options) m.set(o.id, resolve(o, market, products));
    return m;
  }, [options, market, products]);

  const problems = useMemo(
    () => options.filter((o) => resolutions.get(o.id)?.status !== 'ok'),
    [options, resolutions],
  );

  /** Material + finish + colour combinations with NO active roll — dead ends
   *  in the configurator's UI, so Michael has to see them. */
  const deadEnds = useMemo(() => {
    const ceilings = options.filter((o) => o.kind === 'ceiling' && o.active);
    if (ceilings.length === 0) return [];
    const out: string[] = [];
    for (const finish of FINISHES) {
      for (const colour of COLOUR_GROUPS) {
        const has = ceilings.some(
          (c) => c.material === 'PVC' && c.finish === finish && c.colour_group === colour,
        );
        if (!has) out.push(`PVC · ${finish} · ${colour}`);
      }
    }
    for (const kind of FABRIC_KINDS) {
      if (!ceilings.some((c) => c.material === 'fabric' && c.fabric_kind === kind)) out.push(`fabric · ${kind}`);
    }
    return out;
  }, [options]);

  /** Active rolls that share a combination AND a width — the engine then picks
   *  by sort order, which is rarely what anyone means. */
  const duplicateWidths = useMemo(() => {
    const seen = new Map<string, string[]>();
    for (const o of options) {
      if (o.kind !== 'ceiling' || !o.active || !o.max_width_cm) continue;
      const key =
        o.material === 'PVC'
          ? `PVC · ${o.finish} · ${o.colour_group} · ${o.max_width_cm} cm`
          : `fabric · ${o.fabric_kind} · ${o.max_width_cm} cm`;
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(o.label);
    }
    return [...seen.entries()].filter(([, labels]) => labels.length > 1);
  }, [options]);

  const save = useCallback(
    async (id: number, patch: Record<string, unknown>) => {
      setSaving(id);
      setErr(null);
      try {
        const res = await fetch('/api/portal/configurator/options', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...patch }),
        });
        const json = await res.json();
        if (!json.ok) {
          setErr(json.error || 'Save failed.');
          return;
        }
        setOptions((prev) => prev.map((o) => (o.id === id ? (json.option as OptionRow) : o)));
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Save failed.');
      } finally {
        setSaving(null);
      }
    },
    [],
  );

  const byKind = useMemo(() => {
    const m = new Map<string, OptionRow[]>();
    for (const k of OPTION_KINDS) m.set(k, []);
    for (const o of options) {
      if (onlyProblems && resolutions.get(o.id)?.status === 'ok') continue;
      m.get(o.kind)?.push(o);
    }
    return m;
  }, [options, onlyProblems, resolutions]);

  const shown = byKind.get(open) ?? [];

  return (
    <div className="padm-card">
      <div className="head">
        <h2>
          <Sliders size={16} /> Configurator
        </h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label className="padm-meta" htmlFor="cfg-market">
            Price shown for
          </label>
          <select
            id="cfg-market"
            className="padm-sel"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
          >
            {PRICE_MARKETS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button type="button" className="padm-linkbtn" onClick={() => void load()} disabled={loading}>
            <RefreshCw size={13} style={{ verticalAlign: -2 }} /> Reload
          </button>
        </div>
      </div>
      <p className="body">
        Which pricebook row each option is, and how much of it a room needs. Options seeded by{' '}
        <code>scripts/seed-configurator-options.mjs</code> arrive inactive — switch on the ones that are real.
      </p>

      {demo && <p className="padm-note">Demo mode — no configurator database.</p>}
      {needsMigration && (
        <p className="padm-err">
          The <code>configurator_options</code> table does not exist yet. Run the KIT CONFIGURATOR block from{' '}
          <code>supabase/schema.sql</code> in the Supabase SQL editor.
        </p>
      )}
      {err && !needsMigration && <p className="padm-err">{err}</p>}

      {!demo && options.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', margin: '0 0 12px' }}>
            <span className={problems.length ? 'padm-pill padm-pill--warn' : 'padm-pill padm-pill--on'}>
              {problems.length} need{problems.length === 1 ? 's' : ''} attention
            </span>
            <span className="padm-pill">{options.filter((o) => o.active).length} active</span>
            <span className="padm-pill">{options.length} total</span>
            <label className="padm-chip" style={{ margin: 0 }}>
              <input type="checkbox" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} />
              Only show problems
            </label>
          </div>

          {deadEnds.length > 0 && (
            <p className="padm-note" style={{ border: '1px solid #f3c2c2', background: '#fdeaea', padding: '10px 12px' }}>
              <TriangleAlert size={13} style={{ verticalAlign: -2, color: 'var(--red)' }} />{' '}
              <strong>No active roll</strong> for {deadEnds.length} combination{deadEnds.length === 1 ? '' : 's'} — an
              installer choosing one gets &ldquo;not in the pricelist&rdquo;: {deadEnds.join(' · ')}
            </p>
          )}
          {duplicateWidths.length > 0 && (
            <p className="padm-note" style={{ border: '1px solid #f2dfb3', background: '#fff7e6', padding: '10px 12px' }}>
              <TriangleAlert size={13} style={{ verticalAlign: -2, color: '#9a6b00' }} /> Two active rolls share a
              combination AND a width, so the engine picks by sort order:{' '}
              {duplicateWidths.map(([k, labels]) => `${k} (${labels.join(' / ')})`).join(' · ')}
            </p>
          )}

          <div className="padm-tabs" style={{ flexWrap: 'wrap' }}>
            {OPTION_KINDS.map((k) => {
              const all = options.filter((o) => o.kind === k);
              const bad = all.filter((o) => resolutions.get(o.id)?.status !== 'ok').length;
              return (
                <button
                  key={k}
                  type="button"
                  className={open === k ? 'padm-tab on' : 'padm-tab'}
                  onClick={() => setOpen(k)}
                >
                  {k} ({all.length}
                  {bad ? ` · ${bad}!` : ''})
                </button>
              );
            })}
          </div>

          <p className="padm-meta" style={{ margin: '0 0 10px' }}>
            {KIND_TITLES[open] ?? open}
          </p>

          <div className="padm-tablewrap">
            <table>
              <thead>
                <tr>
                  <th>On</th>
                  <th>Label</th>
                  <th>Pricebook row</th>
                  <th>{market} price</th>
                  <th>Quantity rule</th>
                  {open === 'ceiling' && <th>Foil matrix</th>}
                  <th>Companion</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => {
                  const r = resolutions.get(o.id)!;
                  return (
                    <tr key={o.id} className={o.active ? undefined : 'off'}>
                      <td>
                        <input
                          type="checkbox"
                          checked={o.active}
                          disabled={saving === o.id}
                          onChange={(e) => void save(o.id, { active: e.target.checked })}
                          aria-label={`Activate ${o.label}`}
                        />
                      </td>
                      <td style={{ minWidth: 200 }}>
                        <input
                          className="padm-inp"
                          style={{ width: '100%', fontSize: 12.5 }}
                          defaultValue={o.label}
                          onBlur={(e) => e.target.value !== o.label && void save(o.id, { label: e.target.value })}
                          aria-label="Label"
                        />
                        <span className="padm-meta">{o.slug}</span>
                      </td>
                      <td style={{ minWidth: 260 }}>
                        <select
                          className="padm-sel"
                          style={{ width: '100%' }}
                          value={
                            r.product
                              ? `${r.product.category}|${r.product.code ?? ''}|${r.product.product}|${r.product.seq}`
                              : ''
                          }
                          disabled={saving === o.id}
                          onChange={(e) => {
                            const [category, code, product, seq] = e.target.value.split('|');
                            void save(o.id, {
                              match_code: code || null,
                              match_category: code ? null : category,
                              match_product: code ? null : product,
                              match_seq: Number(seq) || 1,
                            });
                          }}
                        >
                          <option value="">— not linked —</option>
                          {products.map((p) => {
                            const v = `${p.category}|${p.code ?? ''}|${p.product}|${p.seq}`;
                            return (
                              <option key={v} value={v}>
                                {p.category} — {p.product}
                                {p.code ? ` [${p.code}]` : ''}
                                {p.seq > 1 ? ` (#${p.seq})` : ''}
                              </option>
                            );
                          })}
                        </select>
                        {r.status === 'no_row' && (
                          <span className="padm-pill padm-pill--warn">no row — the Excel dropped it</span>
                        )}
                        {r.status === 'no_price' && (
                          <span className="padm-pill padm-pill--pending">no {market} price</span>
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {r.price != null ? `€ ${r.price.toFixed(2)}` : '—'}
                        <br />
                        <span className="padm-meta">{r.product?.unit ?? ''}</span>
                      </td>
                      <td style={{ minWidth: 190 }}>
                        <select
                          className="padm-sel"
                          value={o.qty_rule}
                          disabled={saving === o.id}
                          onChange={(e) => void save(o.id, { qty_rule: e.target.value })}
                          aria-label="Quantity rule"
                        >
                          {QTY_RULES.map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                        <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                          <NumField label="×" value={o.qty_factor} onSave={(v) => void save(o.id, { qty_factor: v })} />
                          <NumField
                            label="piece m"
                            value={o.piece_length_m}
                            onSave={(v) => void save(o.id, { piece_length_m: v })}
                          />
                          <NumField label="per N" value={o.per_n} onSave={(v) => void save(o.id, { per_n: v })} />
                          <select
                            className="padm-sel"
                            value={o.round_mode}
                            onChange={(e) => void save(o.id, { round_mode: e.target.value })}
                            aria-label="Rounding"
                          >
                            {ROUND_MODES.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      {open === 'ceiling' && (
                        <td style={{ minWidth: 230 }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            <EnumField
                              value={o.material}
                              values={MATERIALS}
                              onSave={(v) => void save(o.id, { material: v })}
                              label="material"
                            />
                            {o.material === 'fabric' ? (
                              <EnumField
                                value={o.fabric_kind}
                                values={FABRIC_KINDS}
                                onSave={(v) => void save(o.id, { fabric_kind: v })}
                                label="kind"
                              />
                            ) : (
                              <>
                                <EnumField
                                  value={o.finish}
                                  values={FINISHES}
                                  onSave={(v) => void save(o.id, { finish: v })}
                                  label="finish"
                                />
                                <EnumField
                                  value={o.colour_group}
                                  values={COLOUR_GROUPS}
                                  onSave={(v) => void save(o.id, { colour_group: v })}
                                  label="colour"
                                />
                              </>
                            )}
                            <NumField
                              label="width cm"
                              value={o.max_width_cm}
                              onSave={(v) => void save(o.id, { max_width_cm: v })}
                            />
                          </div>
                        </td>
                      )}
                      <td style={{ minWidth: 150 }}>
                        <input
                          className="padm-inp"
                          style={{ width: '100%', fontSize: 12 }}
                          defaultValue={o.companion_slug ?? ''}
                          placeholder="slug"
                          onBlur={(e) =>
                            e.target.value !== (o.companion_slug ?? '') &&
                            void save(o.id, { companion_slug: e.target.value || null })
                          }
                          aria-label="Companion slug"
                        />
                        <NumField
                          label="per unit"
                          value={o.companion_per_unit}
                          onSave={(v) => void save(o.id, { companion_per_unit: v })}
                        />
                      </td>
                    </tr>
                  );
                })}
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={7} className="padm-meta">
                      Nothing here yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!demo && !loading && options.length === 0 && !err && (
        <p className="padm-note">
          The catalogue is empty. Run <code>node scripts/seed-configurator-options.mjs</code> (dry run), then{' '}
          <code>--write</code>, then switch on the options that are real.
        </p>
      )}

      <style jsx>{CARD_CSS}</style>
    </div>
  );
}

function NumField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: number | string | null;
  onSave: (v: string) => void;
}) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: 'var(--text-muted)' }}>
      {label}
      <input
        className="padm-inp"
        style={{ width: 62, fontSize: 12, padding: '3px 5px' }}
        defaultValue={value == null ? '' : String(value)}
        onBlur={(e) => {
          const next = e.target.value.trim();
          if (next !== (value == null ? '' : String(value))) onSave(next);
        }}
      />
    </label>
  );
}

function EnumField({
  value,
  values,
  onSave,
  label,
}: {
  value: string | null;
  values: readonly string[];
  onSave: (v: string) => void;
  label: string;
}) {
  return (
    <select
      className="padm-sel"
      value={value ?? ''}
      onChange={(e) => onSave(e.target.value)}
      aria-label={label}
    >
      <option value="">{label}?</option>
      {values.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}
