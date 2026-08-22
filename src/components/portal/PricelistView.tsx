'use client';

// CLIENT PORTAL — interactive pricelist.
// Category tabs (sticky), live search, optional market filter (only when the
// account sees more than one price group), EUR/PLN currency switch, print
// stylesheet and CSV export. Every category stays mounted in the DOM —
// inactive ones are hidden on screen and ALL of them print.
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Download, Minus, Plus, Printer, Search, ShoppingCart, X } from 'lucide-react';
import type { PricebookMeta, PriceRow } from '@/lib/portal/types';
import { categoryRank } from '@/lib/portal/types';
import { formatGbpIndication, asOf } from '@/lib/currency';

// GB export accounts: the ≈£ figures and the settlement banner below are
// deliberately NOT localized — the portal's export UI is English-only copy,
// and only country='GB' accounts ever see it (everyone else's pricelist is
// pixel-identical to before).
const GBP_BANNER_KEY = 'plv-gbp-banner-dismissed';
const GBP_BANNER = {
  title: 'Prices and settlement are in EUR',
  body:
    `Every invoice is issued and payable in EUR — the ≈£ figures are a courtesy indication at the ECB reference rate of ${asOf}; ` +
    'your bank converts at its own rate. Most UK partners pay the EUR invoice from a Wise or Revolut EUR balance to avoid card mark-ups.',
  dismiss: 'Got it',
};

type Currency = 'EUR' | 'PLN';

// Stable row identity — matches the pricebook unique key, used by the cart
// and re-priced server-side in /api/portal/pricelist-order.
const rowKeyOf = (r: PriceRow) => `${r.category}||${r.product}||${r.market}||${r.seq}`;

type CartLine = {
  key: string;
  product: string;
  code: string | null;
  market: string;
  unit: string | null;
  price_eur: number;
  qty: number;
};

type Props = {
  rows: PriceRow[];
  meta: PricebookMeta;
  formatLocale: string;
  defaultCurrency: Currency;
  /** Account's ISO country from signup — 'GB' switches on the £ indication. */
  accountCountry?: string | null;
};

export default function PricelistView({ rows, meta, formatLocale, defaultCurrency, accountCountry }: Props) {
  const t = useTranslations('portal.pricelist');
  const gbAccount = (accountCountry ?? '').toUpperCase() === 'GB';
  const [gbpBannerOpen, setGbpBannerOpen] = useState(false);
  useEffect(() => {
    if (!gbAccount) return;
    try {
      setGbpBannerOpen(localStorage.getItem(GBP_BANNER_KEY) !== '1');
    } catch {
      setGbpBannerOpen(true);
    }
  }, [gbAccount]);
  function dismissGbpBanner() {
    setGbpBannerOpen(false);
    try {
      localStorage.setItem(GBP_BANNER_KEY, '1');
    } catch {
      /* per-viewer convenience only */
    }
  }

  const markets = useMemo(
    () => Array.from(new Set(rows.map((r) => r.market))).sort(),
    [rows],
  );
  const hasPln = useMemo(() => rows.some((r) => r.price_pln !== null), [rows]);

  // Top-level product families (Type column) in pricebook order. The filter
  // only appears when the data actually distinguishes more than one type.
  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      if (!r.type) continue;
      counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [rows]);

  const [query, setQuery] = useState('');
  const [type, setType] = useState<string>('all');
  const [market, setMarket] = useState<string>('all');
  const [currency, setCurrency] = useState<Currency>(
    defaultCurrency === 'PLN' && hasPln ? 'PLN' : 'EUR',
  );
  const [active, setActive] = useState<string | null>(null);

  // --- Order basket ----------------------------------------------------------
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cartNote, setCartNote] = useState('');
  const [cartStatus, setCartStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [cartResult, setCartResult] = useState<{ ref: string; intent: 'order' | 'quote'; demo?: boolean } | null>(null);

  const cartLines = useMemo(() => Object.values(cart), [cart]);
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cartLines.reduce((s, l) => s + l.price_eur * l.qty, 0);

  function addToCart(r: PriceRow) {
    const key = rowKeyOf(r);
    setCart((prev) => ({
      ...prev,
      [key]: prev[key]
        ? { ...prev[key], qty: prev[key].qty + 1 }
        : { key, product: r.product, code: r.code, market: r.market, unit: r.unit, price_eur: r.price_eur, qty: 1 },
    }));
    setCartStatus('idle');
  }

  function setQty(key: string, qty: number) {
    setCart((prev) => {
      if (!Number.isFinite(qty) || qty < 1) {
        const { [key]: _gone, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: { ...prev[key], qty: Math.min(Math.floor(qty), 9999) } };
    });
  }

  async function submitCart(intent: 'order' | 'quote') {
    if (cartStatus === 'sending' || cartLines.length === 0) return;
    setCartStatus('sending');
    try {
      const res = await fetch('/api/portal/pricelist-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent,
          note: cartNote,
          items: cartLines.map((l) => ({ key: l.key, qty: l.qty })),
        }),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok: boolean; ref?: string; demo?: boolean }
        | null;
      if (!res.ok || !json?.ok || !json.ref) throw new Error('failed');
      setCartResult({ ref: json.ref, intent, demo: json.demo });
      setCart({});
      setCartNote('');
      setCartStatus('sent');
    } catch {
      setCartStatus('error');
    }
  }

  // --- Filtering -------------------------------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (type !== 'all' && r.type !== type) return false;
      if (market !== 'all' && r.market !== market) return false;
      if (!q) return true;
      return (
        r.product.toLowerCase().includes(q) ||
        (r.code ?? '').toLowerCase().includes(q) ||
        (r.product_group ?? '').toLowerCase().includes(q)
      );
    });
  }, [rows, query, type, market]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of filtered) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => categoryRank(a[0]) - categoryRank(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [filtered]);

  const activeCategory =
    active && categories.some((c) => c.name === active) ? active : categories[0]?.name ?? null;

  const showMarketChip = market === 'all' && markets.length > 1;

  // --- Formatting ------------------------------------------------------------
  const fmtEur = useMemo(
    () => new Intl.NumberFormat(formatLocale, { style: 'currency', currency: 'EUR' }),
    [formatLocale],
  );
  const fmtPln = useMemo(
    () => new Intl.NumberFormat(formatLocale, { style: 'currency', currency: 'PLN' }),
    [formatLocale],
  );
  const price = (r: PriceRow) =>
    currency === 'PLN' ? (r.price_pln === null ? '—' : fmtPln.format(r.price_pln)) : fmtEur.format(r.price_eur);

  // --- CSV export (respects current filter) -----------------------------------
  function exportCsv() {
    const esc = (v: string | number | null) =>
      v === null || v === undefined ? '' : `"${String(v).replace(/"/g, '""')}"`;
    const lines = [
      ['Type', 'Category', 'Code', 'Product', 'Unit', 'Market', 'Price EUR', 'Price PLN'].join(';'),
      ...filtered.map((r) =>
        [
          esc(r.type),
          esc(r.category),
          esc(r.code),
          esc(r.product),
          esc(r.unit),
          esc(r.market),
          r.price_eur.toFixed(2).replace('.', ','),
          r.price_pln === null ? '' : r.price_pln.toFixed(2).replace('.', ','),
        ].join(';'),
      ),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `STRETCH-pricelist-${meta.version}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // --- Grouping inside a category ---------------------------------------------
  function groupsFor(category: string) {
    const inCat = filtered.filter((r) => r.category === category);
    const map = new Map<string, PriceRow[]>();
    for (const r of inCat) {
      const key = r.product_group ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries());
  }

  return (
    <div className="plv">
      {/* Meta strip */}
      <div className="plv__meta print-show">
        <div className="container plv__meta-in">
          <h1 className="plv__title">{t('title')}</h1>
          <div className="plv__meta-facts">
            <span>
              {t('version')} <strong>{meta.version}</strong>
            </span>
            {meta.updated_at && (
              <span>
                {t('updated')} <strong>{String(meta.updated_at).slice(0, 10)}</strong>
              </span>
            )}
            {currency === 'PLN' && meta.fx_eur_pln && (
              <span>
                FX <strong>1 EUR = {meta.fx_eur_pln} PLN</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* GB export accounts only — EUR settlement notice, dismissed per browser */}
      {gbAccount && gbpBannerOpen && (
        <div className="plv__gbp-banner no-print" role="note">
          <div className="container plv__gbp-banner-in">
            <div>
              <strong>{GBP_BANNER.title}</strong>
              <p>{GBP_BANNER.body}</p>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={dismissGbpBanner}>
              {GBP_BANNER.dismiss}
            </button>
          </div>
        </div>
      )}

      {/* Type filter — the first level: product family, then category below */}
      {types.length > 1 && (
        <div className="plv__types no-print">
          <div className="container plv__types-in" role="tablist" aria-label={t('type')}>
            <button
              type="button"
              role="tab"
              aria-selected={type === 'all'}
              className={type === 'all' ? 'plv__type plv__type--on' : 'plv__type'}
              onClick={() => {
                setType('all');
                setActive(null);
              }}
            >
              {t('allTypesOpt')}
              <small>{rows.length}</small>
            </button>
            {types.map((tp) => (
              <button
                key={tp.name}
                type="button"
                role="tab"
                aria-selected={type === tp.name}
                className={type === tp.name ? 'plv__type plv__type--on' : 'plv__type'}
                onClick={() => {
                  setType(tp.name);
                  setActive(null);
                }}
              >
                {tp.name}
                <small>{tp.count}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="plv__toolbar no-print">
        <div className="container plv__toolbar-in">
          <label className="plv__search">
            <Search size={15} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              aria-label={t('search')}
            />
          </label>

          {markets.length > 1 && (
            <select
              className="plv__select"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              aria-label={t('market')}
            >
              <option value="all">{t('allMarketsOpt')}</option>
              {markets.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}

          {hasPln && (
            <div className="plv__currency" role="group" aria-label={t('currency')}>
              {(['EUR', 'PLN'] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={currency === c ? 'on' : ''}
                  onClick={() => setCurrency(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <span className="plv__count">{t('count', { count: filtered.length })}</span>
          <span className="plv__spacer" />
          <button type="button" className="plv__tool" onClick={() => window.print()}>
            <Printer size={14} /> {t('print')}
          </button>
          <button type="button" className="plv__tool" onClick={exportCsv}>
            <Download size={14} /> {t('exportCsv')}
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <nav className="plv__tabs no-print" aria-label={t('title')}>
        <div className="container plv__tabs-in" role="tablist">
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              role="tab"
              aria-selected={c.name === activeCategory}
              className={c.name === activeCategory ? 'plv__tab plv__tab--on' : 'plv__tab'}
              onClick={() => setActive(c.name)}
            >
              {c.name}
              <small>{c.count}</small>
            </button>
          ))}
        </div>
      </nav>

      {/* Content — every category rendered; inactive hidden on screen, all print */}
      <main className="container plv__main">
        {filtered.length === 0 && <p className="plv__empty">{t('empty')}</p>}

        {categories.map((c) => (
          <section
            key={c.name}
            className={c.name === activeCategory ? 'plv__cat plv__cat--on' : 'plv__cat'}
          >
            <h2 className="plv__cat-title print-show">{c.name}</h2>
            {groupsFor(c.name).map(([group, groupRows]) => (
              <article key={group || 'default'} className="plv__card">
                <h3>
                  <span>{group || c.name}</span>
                  <small>{groupRows.length}</small>
                </h3>
                <div>
                  {groupRows.map((r) => {
                    const inCart = cart[rowKeyOf(r)]?.qty;
                    return (
                      <div key={`${r.product}|${r.market}|${r.sort}`} className="plv__row">
                        <div className="plv__prod">
                          <span className="plv__name">{r.product}</span>
                          {r.code && <span className="plv__code">{r.code}</span>}
                        </div>
                        {showMarketChip && <span className="plv__chip plv__chip--mkt">{r.market}</span>}
                        {r.unit && <span className="plv__chip">{r.unit}</span>}
                        <span className="plv__price">
                          {price(r)}
                          {gbAccount && currency === 'EUR' && (
                            <small className="plv__gbp" title={GBP_BANNER.body}>
                              {formatGbpIndication(r.price_eur)}
                            </small>
                          )}
                        </span>
                        <button
                          type="button"
                          className={inCart ? 'plv__add plv__add--in no-print' : 'plv__add no-print'}
                          onClick={() => addToCart(r)}
                          title={t('addLabel')}
                          aria-label={`${t('addLabel')} — ${r.product}`}
                        >
                          {inCart ? <span className="plv__add-qty">{inCart}</span> : <Plus size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </section>
        ))}
      </main>

      {/* Floating basket button */}
      {(cartLines.length > 0 || cartStatus === 'sent') && (
        <button type="button" className="plv__cartbtn no-print" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={16} />
          <span>{t('basketLabel')}</span>
          {cartCount > 0 && <span className="plv__cartbtn-badge">{cartCount}</span>}
        </button>
      )}

      {/* Basket drawer */}
      {cartOpen && (
        <div className="plv__cart-overlay no-print" onClick={() => setCartOpen(false)}>
          <aside className="plv__cart" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={t('cartTitle')}>
            <header className="plv__cart-head">
              <h2>{t('cartTitle')}</h2>
              <button type="button" onClick={() => setCartOpen(false)} aria-label={t('closeLabel')} className="plv__cart-x">
                <X size={18} />
              </button>
            </header>

            {cartStatus === 'sent' && cartResult ? (
              <div className="plv__cart-done">
                <span className="plv__cart-check">
                  <Check size={26} strokeWidth={2.5} />
                </span>
                <h3>{cartResult.intent === 'quote' ? t('sentQuoteTitle') : t('sentOrderTitle')}</h3>
                <p>
                  {cartResult.intent === 'quote'
                    ? t('sentQuoteMsg', { ref: cartResult.ref })
                    : t('sentOrderMsg', { ref: cartResult.ref })}
                </p>
                {cartResult.demo && <p className="plv__cart-demo">{t('demoNote')}</p>}
                <button type="button" className="btn btn--dark btn--sm" onClick={() => setCartOpen(false)}>
                  {t('closeLabel')}
                </button>
              </div>
            ) : cartLines.length === 0 ? (
              <p className="plv__cart-empty">{t('cartEmpty')}</p>
            ) : (
              <>
                <div className="plv__cart-lines">
                  {cartLines.map((l) => (
                    <div key={l.key} className="plv__cart-line">
                      <div className="plv__cart-line-name">
                        <strong>{l.product}</strong>
                        <span>
                          {[l.code, l.market, l.unit].filter(Boolean).join(' · ')} · {fmtEur.format(l.price_eur)}
                        </span>
                      </div>
                      <div className="plv__cart-qty">
                        <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="−">
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={l.qty}
                          onChange={(e) => setQty(l.key, Number(e.target.value))}
                          aria-label={t('qty')}
                        />
                        <button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="+">
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="plv__cart-line-total">{fmtEur.format(l.price_eur * l.qty)}</span>
                    </div>
                  ))}
                </div>

                <label className="plv__cart-note">
                  <span>{t('noteLabel')}</span>
                  <textarea
                    value={cartNote}
                    onChange={(e) => setCartNote(e.target.value)}
                    placeholder={t('notePlaceholder')}
                    maxLength={2000}
                    rows={2}
                  />
                </label>

                <div className="plv__cart-total">
                  <span>{t('totalLabel')}</span>
                  <strong>
                    {fmtEur.format(cartTotal)}
                    {gbAccount && cartTotal > 0 && (
                      <small className="plv__gbp">{formatGbpIndication(cartTotal)}</small>
                    )}
                  </strong>
                </div>

                {cartStatus === 'error' && <p className="plv__cart-error">{t('errorMsg')}</p>}

                <div className="plv__cart-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={cartStatus === 'sending'}
                    onClick={() => submitCart('order')}
                  >
                    {cartStatus === 'sending' ? t('sendingLabel') : t('submitOrder')}
                  </button>
                  <button
                    type="button"
                    className="btn btn--dark"
                    disabled={cartStatus === 'sending'}
                    onClick={() => submitCart('quote')}
                  >
                    {t('submitQuote')}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      <style jsx>{`
        .plv {
          padding-bottom: 64px;
        }
        .plv__meta {
          background: #fff;
          border-bottom: 3px solid var(--red);
        }
        .plv__meta-in {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          padding-top: 22px;
          padding-bottom: 16px;
        }
        .plv__title {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 900;
          text-transform: uppercase;
          font-size: clamp(24px, 3vw, 38px);
          letter-spacing: 0.01em;
        }
        .plv__meta-facts {
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
          color: var(--text-muted-2);
          font-size: 12.5px;
        }
        .plv__meta-facts strong {
          color: var(--text);
        }

        /* GB export accounts: EUR-settlement banner + ≈£ indication */
        .plv__gbp-banner {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .plv__gbp-banner-in {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          padding-top: 14px;
          padding-bottom: 14px;
        }
        .plv__gbp-banner strong {
          display: block;
          font-size: 13.5px;
          margin-bottom: 2px;
        }
        .plv__gbp-banner p {
          margin: 0;
          font-size: 12.5px;
          color: var(--text-muted-2);
          max-width: 92ch;
          line-height: 1.5;
        }
        .plv__gbp {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-faint-2);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        /* Type — the PRIMARY filter: big display-font blocks, full width. */
        .plv__types {
          background: #fff;
          border-bottom: 1px solid var(--border);
        }
        .plv__types-in {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 18px;
          padding-bottom: 18px;
        }
        .plv__type {
          flex: 1 1 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 2px solid var(--black);
          border-bottom-width: 4px;
          background: #fff;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(14px, 1.7vw, 19px);
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--text);
          padding: 16px 20px;
          cursor: pointer;
        }
        .plv__type small {
          font-size: 11.5px;
          font-family: var(--font-body, inherit);
          font-weight: 800;
          color: var(--text-muted-2);
          background: var(--surface);
          border: 1px solid var(--border-2);
          padding: 3px 8px;
        }
        .plv__type:hover:not(.plv__type--on) {
          background: var(--surface);
        }
        .plv__type--on {
          background: var(--black);
          color: #fff;
          border-color: var(--black);
          border-bottom-color: var(--red);
        }
        .plv__type--on small {
          background: var(--red);
          border-color: var(--red);
          color: #fff;
        }
        @media (max-width: 640px) {
          .plv__type {
            padding: 12px 14px;
            font-size: 14px;
          }
        }

        .plv__toolbar {
          background: #fff;
          border-bottom: 1px solid var(--border);
        }
        .plv__toolbar-in {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 12px;
          padding-bottom: 12px;
        }
        .plv__search {
          flex: 1 1 240px;
          max-width: 420px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid var(--border-input);
          padding: 0 12px;
          background: #fff;
          color: var(--text-faint);
        }
        .plv__search input {
          border: 0;
          outline: none;
          padding: 11px 0;
          width: 100%;
          font: inherit;
          font-size: 14px;
          background: transparent;
          color: var(--text);
        }
        .plv__select {
          border: 1px solid var(--border-input);
          background: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 10px;
          max-width: 210px;
        }
        .plv__currency {
          display: inline-flex;
          border: 1px solid var(--border-input);
        }
        .plv__currency button {
          border: 0;
          background: #fff;
          font: inherit;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 10px 14px;
          cursor: pointer;
          color: var(--text-muted-2);
        }
        .plv__currency button.on {
          background: var(--black);
          color: #fff;
        }
        .plv__count {
          font-size: 12.5px;
          color: var(--text-muted-2);
          white-space: nowrap;
        }
        .plv__spacer {
          flex: 1;
        }
        .plv__tool {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-input);
          background: #fff;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 10px 14px;
          cursor: pointer;
        }
        .plv__tool:hover {
          border-color: var(--black);
        }

        .plv__tabs {
          position: sticky;
          top: calc(var(--header-h) + 42px);
          z-index: 30;
          background: #fff;
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .plv__tabs-in {
          display: flex;
          gap: 2px;
          overflow-x: auto;
        }
        /* Category — the SECONDARY filter: compact, quiet tabs. */
        .plv__tab {
          border: 0;
          background: none;
          font: inherit;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 11px 11px 9px;
          cursor: pointer;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }
        .plv__tab small {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-faint-2);
          background: var(--surface);
          border: 1px solid var(--border-2);
          padding: 1px 5px;
        }
        .plv__tab:hover {
          color: var(--text);
        }
        .plv__tab--on {
          color: var(--text);
          border-bottom-color: var(--red);
        }
        .plv__tab--on small {
          background: var(--red);
          border-color: var(--red);
          color: #fff;
        }

        .plv__main {
          padding-top: 26px;
        }
        .plv__empty {
          color: var(--text-muted);
          font-size: 14.5px;
          padding: 40px 0;
        }
        .plv__cat {
          display: none;
        }
        .plv__cat--on {
          display: block;
        }
        .plv__cat-title {
          display: none;
        }

        .plv__card {
          background: #fff;
          border: 1px solid var(--border);
          margin: 0 0 18px;
        }
        .plv__card h3 {
          margin: 0;
          background: var(--black);
          color: #fff;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .plv__card h3 small {
          color: var(--on-dark-muted);
          font-weight: 600;
          font-size: 11px;
        }
        .plv__row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 9px 16px;
          border-top: 1px solid #f0efec;
          font-size: 14px;
        }
        .plv__row:nth-child(even) {
          background: #fafaf8;
        }
        .plv__prod {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .plv__name {
          font-weight: 600;
        }
        .plv__code {
          font-size: 11.5px;
          color: var(--text-faint);
          letter-spacing: 0.04em;
        }
        .plv__chip {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-muted-2);
          border: 1px solid var(--border-2);
          background: var(--surface);
          padding: 3px 8px;
          white-space: nowrap;
        }
        .plv__chip--mkt {
          background: #fff;
          border-color: var(--border-input);
        }
        .plv__price {
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          min-width: 96px;
          text-align: right;
        }

        @media (max-width: 640px) {
          .plv__row {
            flex-wrap: wrap;
            row-gap: 4px;
          }
          .plv__price {
            min-width: 0;
          }
        }

        /* --- Order basket --------------------------------------------------- */
        .plv__add {
          width: 30px;
          height: 30px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-input);
          background: #fff;
          color: var(--text-muted);
          cursor: pointer;
        }
        .plv__add:hover {
          border-color: var(--black);
          color: var(--black);
        }
        .plv__add--in {
          background: var(--black);
          border-color: var(--black);
          color: #fff;
        }
        .plv__add-qty {
          font-size: 11.5px;
          font-weight: 800;
        }
        .plv__cartbtn {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 60;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--black);
          color: #fff;
          border: none;
          font: inherit;
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 14px 18px;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
        }
        .plv__cartbtn:hover {
          background: var(--red);
        }
        .plv__cartbtn-badge {
          background: var(--red);
          font-size: 11px;
          padding: 2px 7px;
        }
        .plv__cartbtn:hover .plv__cartbtn-badge {
          background: var(--black);
        }
        .plv__cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 70;
          background: rgba(10, 10, 10, 0.45);
          display: flex;
          justify-content: flex-end;
        }
        .plv__cart {
          width: min(440px, 100%);
          height: 100%;
          background: #fff;
          display: flex;
          flex-direction: column;
          padding: 22px;
          overflow-y: auto;
        }
        .plv__cart-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .plv__cart-head h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .plv__cart-x {
          border: none;
          background: none;
          cursor: pointer;
          color: var(--black);
          padding: 6px;
        }
        .plv__cart-x:hover {
          color: var(--red);
        }
        .plv__cart-empty {
          color: var(--text-muted);
          font-size: 13.5px;
          line-height: 1.6;
        }
        .plv__cart-lines {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }
        .plv__cart-line {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--border);
          padding: 10px 12px;
        }
        .plv__cart-line-name {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .plv__cart-line-name strong {
          font-size: 13px;
          line-height: 1.35;
        }
        .plv__cart-line-name span {
          font-size: 11px;
          color: var(--text-faint);
          letter-spacing: 0.03em;
        }
        .plv__cart-qty {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--border-input);
        }
        .plv__cart-qty button {
          width: 26px;
          height: 30px;
          border: none;
          background: #fff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        .plv__cart-qty button:hover {
          color: var(--red);
        }
        .plv__cart-qty input {
          width: 44px;
          border: none;
          border-left: 1px solid var(--border-input);
          border-right: 1px solid var(--border-input);
          text-align: center;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 0;
          -moz-appearance: textfield;
        }
        .plv__cart-qty input::-webkit-outer-spin-button,
        .plv__cart-qty input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .plv__cart-line-total {
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
          min-width: 72px;
          text-align: right;
        }
        .plv__cart-note span {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .plv__cart-note textarea {
          width: 100%;
          border: 1px solid var(--border-input);
          font: inherit;
          font-size: 13.5px;
          padding: 10px 12px;
          resize: vertical;
        }
        .plv__cart-total {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin: 16px 0 4px;
          padding-top: 14px;
          border-top: 2px solid var(--black);
        }
        .plv__cart-total span {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .plv__cart-total strong {
          font-size: 20px;
          font-weight: 900;
          font-variant-numeric: tabular-nums;
        }
        .plv__cart-error {
          color: var(--red);
          font-size: 13px;
          font-weight: 600;
          margin: 8px 0 0;
        }
        .plv__cart-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
        }
        .plv__cart-actions :global(.btn) {
          width: 100%;
          justify-content: center;
        }
        .plv__cart-done {
          text-align: center;
          padding: 40px 8px;
        }
        .plv__cart-check {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--red);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .plv__cart-done h3 {
          margin: 0 0 10px;
          font-size: 20px;
          font-weight: 800;
        }
        .plv__cart-done p {
          margin: 0 0 18px;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--text-muted);
        }
        .plv__cart-demo {
          font-size: 12px !important;
          color: var(--text-faint) !important;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .plv__cat {
            display: block !important;
            break-inside: auto;
          }
          .plv__cat-title {
            display: block;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 22px 0 10px;
          }
          .plv__card {
            border-color: #ddd;
          }
          .plv__card h3 {
            background: #111 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .plv__row {
            padding: 5px 10px;
            font-size: 11.5px;
          }
          .plv__price {
            font-size: 11.5px;
          }
        }
      `}</style>
    </div>
  );
}
