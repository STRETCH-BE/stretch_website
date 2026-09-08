'use client';

// CLIENT PORTAL — admin ▸ Orders (kit configurator).
// List, filter, open one order's frozen line snapshot, move it along its
// lifecycle, leave an internal note (never mailed), resend the confirmation
// and export CSV for Exact Online.
//
// Admin-only and EN-only, like the rest of the panel.
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Download, PackageSearch, RefreshCw, Send, TriangleAlert } from 'lucide-react';
import { PRICE_MARKETS } from '@/lib/portal/types';
import { CARD_CSS } from './admin-css';

const STATUSES = ['received', 'confirmed', 'in_production', 'shipped', 'cancelled'] as const;
type Status = (typeof STATUSES)[number];

type OrderRow = {
  id: string;
  reference: string;
  email: string;
  company: string | null;
  market: string;
  currency: 'EUR' | 'PLN';
  config: Record<string, unknown>;
  foil_code: string | null;
  foil_product: string | null;
  weld_required: boolean;
  subtotal: number | string;
  needs_manual_pricing: boolean;
  status: Status;
  pricebook_version: string | null;
  ceiling_count?: number;
  ceiling_ref?: string | null;
  project_ref: string | null;
  delivery_address: string | null;
  note: string | null;
  internal_note: string | null;
  created_at: string;
};

type LineRow = {
  line_no: number;
  ceiling_no?: number;
  ceiling_ref?: string | null;
  kind: string | null;
  code: string | null;
  product: string;
  unit: string | null;
  qty: number | string;
  unit_price: number | string | null;
  line_total: number | string | null;
  note: string | null;
};

/** Plain decimal point, semicolon separated — opens cleanly in Excel. */
function csv(rows: (string | number | null)[][]): string {
  return rows
    .map((r) =>
      r
        .map((v) => {
          if (v == null) return '';
          const s = String(v);
          return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(';'),
    )
    .join('\n');
}

function download(name: string, body: string) {
  const blob = new Blob([`﻿${body}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function money(o: { currency: string; subtotal: number | string }): string {
  const n = Number(o.subtotal);
  return `${o.currency === 'PLN' ? 'PLN' : '€'} ${isFinite(n) ? n.toFixed(2) : '0.00'}`;
}

export default function OrdersCard({ demo }: { demo: boolean }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState<'all' | Status>('all');
  const [market, setMarket] = useState<'all' | string>('all');
  const [q, setQ] = useState('');
  const [openRef, setOpenRef] = useState<string | null>(null);
  const [lines, setLines] = useState<LineRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 25;

  const load = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch('/api/portal/orders');
      const json = await res.json();
      if (!json.ok) {
        setErr(json.error || 'Could not load orders.');
        return;
      }
      setOrders(json.orders ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  }, [demo]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false;
      if (market !== 'all' && o.market !== market) return false;
      if (!needle) return true;
      return (
        o.reference.toLowerCase().includes(needle) ||
        (o.company ?? '').toLowerCase().includes(needle) ||
        o.email.toLowerCase().includes(needle)
      );
    });
  }, [orders, status, market, q]);

  const pageRows = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const thisMonth = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      const d = new Date(o.created_at);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }, [orders]);
  const awaitingPricing = useMemo(() => orders.filter((o) => o.needs_manual_pricing).length, [orders]);

  const openOrder = useCallback(async (reference: string) => {
    if (openRef === reference) {
      setOpenRef(null);
      return;
    }
    setOpenRef(reference);
    setLines([]);
    try {
      const res = await fetch(`/api/portal/orders?reference=${encodeURIComponent(reference)}`);
      const json = await res.json();
      if (json.ok) setLines(json.lines ?? []);
    } catch {
      /* the row stays open with no lines; the list is still usable */
    }
  }, [openRef]);

  const patch = useCallback(
    async (reference: string, body: Record<string, unknown>, okMsg: string) => {
      setBusy(true);
      setMsg(null);
      setErr(null);
      try {
        const res = await fetch('/api/portal/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, ...body }),
        });
        const json = await res.json();
        if (!json.ok) {
          setErr(json.error || 'Update failed.');
          return;
        }
        setMsg(okMsg);
        if ('status' in body || 'internalNote' in body) await load();
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Update failed.');
      } finally {
        setBusy(false);
      }
    },
    [load],
  );

  const exportList = useCallback(() => {
    download(
      `stretch-orders-${new Date().toISOString().slice(0, 10)}.csv`,
      csv([
        ['Reference', 'Date', 'Company', 'Email', 'Market', 'Currency', 'Subtotal', 'Needs manual pricing', 'Status', 'Ceilings', 'Ceiling refs', 'Foil (first ceiling)', 'Seamed', 'Pricelist', 'Project ref'],
        ...filtered.map((o) => [
          o.reference,
          o.created_at.slice(0, 10),
          o.company ?? '',
          o.email,
          o.market,
          o.currency,
          Number(o.subtotal).toFixed(2),
          o.needs_manual_pricing ? 'yes' : 'no',
          o.status,
          Number(o.ceiling_count ?? 1),
          o.ceiling_ref ?? '',
          o.foil_product ?? '',
          o.weld_required ? 'yes' : 'no',
          o.pricebook_version ?? '',
          o.project_ref ?? '',
        ]),
      ]),
    );
  }, [filtered]);

  const exportOrder = useCallback(
    (o: OrderRow) => {
      download(
        `${o.reference}-lines.csv`,
        csv([
          ['Reference', 'Line', 'Ceiling', 'Ceiling ref', 'Kind', 'Code', 'Product', 'Unit', 'Qty', 'Unit price', 'Line total', 'Note'],
          ...lines.map((l) => [
            o.reference,
            l.line_no,
            Number(l.ceiling_no ?? 1),
            l.ceiling_ref ?? '',
            l.kind ?? '',
            l.code ?? '',
            l.product,
            l.unit ?? '',
            Number(l.qty).toFixed(3),
            l.unit_price == null ? '' : Number(l.unit_price).toFixed(2),
            l.line_total == null ? '' : Number(l.line_total).toFixed(2),
            l.note ?? '',
          ]),
        ]),
      );
    },
    [lines],
  );

  return (
    <div className="padm-card">
      <div className="head">
        <h2>
          <PackageSearch size={16} /> Orders
        </h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="padm-pill">{thisMonth} this month</span>
          <span className={awaitingPricing ? 'padm-pill padm-pill--warn' : 'padm-pill'}>
            {awaitingPricing} awaiting manual pricing
          </span>
          <button type="button" className="padm-linkbtn" onClick={() => void load()} disabled={loading}>
            <RefreshCw size={13} style={{ verticalAlign: -2 }} /> Reload
          </button>
          <button type="button" className="padm-linkbtn" onClick={exportList} disabled={filtered.length === 0}>
            <Download size={13} style={{ verticalAlign: -2 }} /> CSV
          </button>
        </div>
      </div>
      <p className="body">Orders placed in the kit configurator. Prices are frozen at order time — a later pricelist never changes them.</p>

      {demo && <p className="padm-note">Demo mode — no orders database.</p>}
      {err && <p className="padm-err">{err}</p>}
      {msg && <p className="padm-note">{msg}</p>}

      {!demo && (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '0 0 12px' }}>
            <input
              className="padm-inp"
              placeholder="Search reference / company / e-mail"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              style={{ flex: '1 1 220px' }}
              aria-label="Search orders"
            />
            <select
              className="padm-sel"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as 'all' | Status);
                setPage(0);
              }}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              className="padm-sel"
              value={market}
              onChange={(e) => {
                setMarket(e.target.value);
                setPage(0);
              }}
              aria-label="Filter by market"
            >
              <option value="all">All markets</option>
              {PRICE_MARKETS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="padm-tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Market</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pageRows.map((o) => (
                  <Fragment key={o.id}>
                    <tr>
                      <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {o.reference}
                        {o.needs_manual_pricing && (
                          <span className="padm-pill padm-pill--warn" style={{ marginLeft: 6 }}>
                            <TriangleAlert size={10} style={{ verticalAlign: -1 }} /> price
                          </span>
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{o.created_at.slice(0, 10)}</td>
                      <td>
                        {o.company || '—'}
                        <br />
                        <span className="padm-meta">{o.email}</span>
                      </td>
                      <td>{o.market}</td>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {o.needs_manual_pricing ? 'from ' : ''}
                        {money(o)}
                      </td>
                      <td>
                        <select
                          className="padm-sel"
                          value={o.status}
                          disabled={busy}
                          onChange={(e) => void patch(o.reference, { status: e.target.value }, `${o.reference} → ${e.target.value}`)}
                          aria-label={`Status of ${o.reference}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button type="button" className="padm-linkbtn" onClick={() => void openOrder(o.reference)}>
                          {openRef === o.reference ? 'Close' : 'Open'}
                        </button>
                      </td>
                    </tr>
                    {openRef === o.reference && (
                      <tr>
                        <td colSpan={7}>
                          <div className="padm-sub">
                            <span className="lbl">Configuration{Number(o.ceiling_count ?? 1) > 1 ? ` — ${o.ceiling_count} ceilings` : ''}</span>
                            <p className="padm-meta" style={{ margin: 0, lineHeight: 1.7 }}>
                              {/* Orders since 8 Sep 2026 hold { ceilings: [...] }; older ones a single configuration. */}
                              {((Array.isArray(o.config?.ceilings) ? o.config.ceilings : [o.config ?? {}]) as Record<string, unknown>[]).map(
                                (c, i, all) => (
                                  <Fragment key={i}>
                                    {all.length > 1 && <strong>{i + 1}. {String(c.reference ?? `Ceiling ${i + 1}`)} · </strong>}
                                    {String(c.length ?? '?')} × {String(c.width ?? '?')} m · {String(c.shape ?? 'flat')}
                                    {c.shape === 'sloped'
                                      ? ` (angled ${String(c.foldLength ?? (c.foldSide === 'width' ? c.width : c.length) ?? '?')} × ${String(c.slopeRun ?? '?')} m, fold along the ${String(c.foldSide ?? '?')})`
                                      : ''}{' '}
                                    · {String(c.material ?? '')} {String(c.finish ?? c.fabricKind ?? '')} {String(c.colourGroup ?? '')}
                                    {c.seamDirection && c.seamDirection !== 'auto' ? ` · seams along the ${String(c.seamDirection)}` : ''}
                                    <br />
                                  </Fragment>
                                ),
                              )}
                              Foil chosen{Number(o.ceiling_count ?? 1) > 1 ? ' (first ceiling)' : ''}: <strong>{o.foil_product ?? '—'}</strong>
                              {o.foil_code ? ` [${o.foil_code}]` : ''} · {o.weld_required ? 'SEAMED' : 'no seam'} ·
                              pricelist {o.pricebook_version ?? '—'}
                              {o.delivery_address ? <><br />Delivery: {o.delivery_address}</> : null}
                              {o.note ? <><br />Customer note: {o.note}</> : null}
                            </p>

                            <span className="lbl">Line snapshot</span>
                            <div className="padm-tablewrap">
                              <table>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Unit price</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {lines.map((l, i) => (
                                    <Fragment key={l.line_no}>
                                      {Number(o.ceiling_count ?? 1) > 1 &&
                                        (i === 0 || Number(lines[i - 1].ceiling_no ?? 1) !== Number(l.ceiling_no ?? 1)) && (
                                          <tr>
                                            <td colSpan={5} style={{ fontWeight: 800, background: '#f6f6f7' }}>
                                              {Number(l.ceiling_no ?? 1)}. {l.ceiling_ref ?? `Ceiling ${Number(l.ceiling_no ?? 1)}`}
                                            </td>
                                          </tr>
                                        )}
                                    <tr>
                                      <td>{l.line_no}</td>
                                      <td>
                                        {l.product}
                                        {l.code ? <span className="padm-meta"> [{l.code}]</span> : null}
                                        {l.note ? <span className="padm-pill padm-pill--pending">{l.note}</span> : null}
                                      </td>
                                      <td style={{ whiteSpace: 'nowrap' }}>
                                        {Number(l.qty)} {l.unit ?? ''}
                                      </td>
                                      <td style={{ whiteSpace: 'nowrap' }}>
                                        {l.unit_price == null ? '—' : Number(l.unit_price).toFixed(2)}
                                      </td>
                                      <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                                        {l.line_total == null ? '—' : Number(l.line_total).toFixed(2)}
                                      </td>
                                    </tr>
                                    </Fragment>
                                  ))}
                                  {lines.length === 0 && (
                                    <tr>
                                      <td colSpan={5} className="padm-meta">
                                        Loading the snapshot…
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            <span className="lbl">Internal note (never mailed)</span>
                            <textarea
                              className="padm-inp"
                              rows={2}
                              style={{ width: '100%' }}
                              defaultValue={o.internal_note ?? ''}
                              onBlur={(e) =>
                                e.target.value !== (o.internal_note ?? '') &&
                                void patch(o.reference, { internalNote: e.target.value }, 'Note saved.')
                              }
                            />

                            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                className="padm-linkbtn"
                                disabled={busy}
                                onClick={() => void patch(o.reference, { resend: true }, `Confirmation re-sent for ${o.reference}.`)}
                              >
                                <Send size={13} style={{ verticalAlign: -2 }} /> Send the confirmation again
                              </button>
                              <button
                                type="button"
                                className="padm-linkbtn padm-linkbtn--mut"
                                disabled={lines.length === 0}
                                onClick={() => exportOrder(o)}
                              >
                                <Download size={13} style={{ verticalAlign: -2 }} /> CSV of these lines
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="padm-meta">
                      {loading ? 'Loading…' : 'No orders yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > PER_PAGE && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <button type="button" className="padm-linkbtn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                ← Newer
              </button>
              <span className="padm-meta">
                {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <button
                type="button"
                className="padm-linkbtn"
                disabled={(page + 1) * PER_PAGE >= filtered.length}
                onClick={() => setPage((p) => p + 1)}
              >
                Older →
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{CARD_CSS}</style>
    </div>
  );
}
