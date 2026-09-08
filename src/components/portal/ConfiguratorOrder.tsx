'use client';

// CLIENT PORTAL — placing a configurator order.
// The button is disabled until the configuration is valid; it opens a compact
// confirm step, then posts the CONFIGURATION (never a price) to
// /api/portal/order. No payment is taken and the UI says so, twice.
import { useCallback, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ConfigState, Quote } from './ConfiguratorView';
import { toPayload } from './ConfiguratorView';

/** One ceiling going into the order, as configured and as the server priced it. */
export type OrderCeilingInput = { config: ConfigState; quote: Quote; current?: boolean };

type Placed = {
  reference: string;
  confirmed: boolean;
  stored: boolean;
  needsManualPricing: boolean;
  unpricedCount: number;
  ceilings: number;
  demo?: boolean;
};

function nameOf(c: OrderCeilingInput, i: number): string {
  return c.config.reference.trim() || `Ceiling ${i + 1}`;
}

function sizeOf(c: OrderCeilingInput): string {
  const L = Number(c.config.length.replace(',', '.')) || 0;
  const W = Number(c.config.width.replace(',', '.')) || 0;
  const S = c.config.shape === 'sloped' ? Number(c.config.slopeRun.replace(',', '.')) || 0 : 0;
  const F = c.config.shape === 'sloped' ? Number(c.config.foldLength.replace(',', '.')) || (c.config.foldSide === 'width' ? W : L) : 0;
  return `${L} × ${W} m${S > 0 ? ` + ${F} × ${S} m` : ''}`;
}

/** One key per submit — a repeat returns the original order, never a second. */
function newKey(): string {
  const rnd =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `ord-${rnd}`.replace(/[^\w-]/g, '').slice(0, 80);
}

export default function ConfiguratorOrder({
  ceilings,
  quote,
  market,
  orderable,
  demo,
  accountEmail,
  company,
  money,
  total,
}: {
  /** Everything that will be sent: the ceilings added to the order, plus the
   *  one being edited when it is complete (flagged `current`). */
  ceilings: OrderCeilingInput[];
  /** The ceiling being edited — for the "why not orderable" hint only. */
  quote: Quote | null;
  market: string;
  orderable: boolean;
  demo: boolean;
  accountEmail: string;
  company: string | null;
  money: (eur: number | null, pln: number | null) => string;
  /** The ORDER total, formatted. */
  total: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(accountEmail);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [key, setKey] = useState<string>(() => newKey());

  const submit = useCallback(async () => {
    if (ceilings.length === 0) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch('/api/portal/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Every ceiling as a CONFIGURATION — the server re-prices each one.
          ceilings: ceilings.map((c) => toPayload(c.config, market)),
          market,
          projectRef: projectRef || null,
          deliveryAddress: deliveryAddress || null,
          note: note || null,
          idempotencyKey: key,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        const which = json.ceiling ? ` (ceiling ${json.ceiling})` : '';
        setErr(
          json.error === 'rate_limited'
            ? 'That is a lot of orders in one hour. Give it a moment, or call us.'
            : json.error === 'incomplete_configuration'
              ? `A configuration is not complete yet${which}.`
              : json.error === 'too_many_ceilings'
                ? 'That is more ceilings than one order takes — split it in two.'
                : 'The order could not be placed. Nothing was charged — try again, or call us.',
        );
        return;
      }
      setPlaced({
        reference: json.reference,
        confirmed: Boolean(json.confirmed),
        stored: Boolean(json.stored),
        needsManualPricing: Boolean(json.needsManualPricing),
        unpricedCount: Number(json.unpricedCount ?? 0),
        ceilings: Number(json.ceilings ?? ceilings.length),
        demo: Boolean(json.demo),
      });
      setOpen(false);
      setKey(newKey()); // a new key for any next order
    } catch {
      setErr('The order could not be placed. Nothing was charged — try again, or call us.');
    } finally {
      setBusy(false);
    }
  }, [ceilings, market, projectRef, deliveryAddress, note, key]);

  const summary = useMemo(
    () =>
      ceilings.map((c, i) => ({
        name: nameOf(c, i),
        current: Boolean(c.current),
        text: [
          sizeOf(c),
          `${c.quote.area.toFixed(2)} m²`,
          c.quote.foil.product ?? c.quote.foil.label ?? '—',
          c.quote.weldCount > 0 ? `${c.quote.weldCount} seam(s)` : 'no seams',
        ].join(' · '),
        total: money(c.quote.subtotalEur, c.quote.subtotalPln),
        from: c.quote.needsManualPricing,
      })),
    [ceilings, money],
  );

  if (placed) {
    return (
      <div className="ord-done">
        <p className="k">
          <CheckCircle2 size={16} /> Order {placed.reference}
          {placed.ceilings > 1 ? ` — ${placed.ceilings} ceilings` : ''}
        </p>
        <p>
          {placed.demo
            ? 'Demo mode — nothing was stored or e-mailed.'
            : placed.confirmed
              ? `A confirmation is on its way to ${email}.`
              : 'We have your order. The confirmation e-mail is delayed — we will follow up by hand.'}
        </p>
        {placed.needsManualPricing && (
          <p className="warn">
            {placed.unpricedCount} line{placed.unpricedCount === 1 ? '' : 's'} still to be priced. We work{' '}
            {placed.unpricedCount === 1 ? 'it' : 'them'} out and confirm on the proforma invoice.
          </p>
        )}
        <p className="small">No payment has been taken. A proforma invoice in EUR follows before production.</p>
        <a href="/portal/orders" className="link">
          See your orders →
        </a>
        <style jsx>{`
  .ord { margin: 18px 0 0; }
  .cta { font: inherit; font-size: 13px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; background: var(--red); color: #fff; border: 0; padding: 14px 24px; cursor: pointer; width: 100%; }
  .cta:disabled { background: var(--border-2); color: var(--text-faint); cursor: not-allowed; }
  .ghost { font: inherit; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; background: none; border: 1px solid var(--border-input); padding: 13px 18px; cursor: pointer; }
  .btns { display: flex; gap: 8px; margin-top: 12px; }
  .confirm { border: 1px solid var(--border); background: #fff; padding: 16px; }
  .confirm .k, .ord-done .k { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; margin: 0 0 8px; }
  .summary { font-size: 12.5px; color: var(--text-muted); margin: 0 0 14px; padding-left: 18px; line-height: 1.5; }
  .summary li { margin: 0 0 6px; }
  .summary strong { color: var(--black); }
  .summary em { font-style: normal; color: var(--text-faint); }
  .confirm label { display: block; margin: 0 0 10px; }
  .confirm label span { display: block; font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 4px; }
  .confirm input, .confirm textarea { font: inherit; font-size: 13.5px; padding: 8px 10px; border: 1px solid var(--border-input); width: 100%; background: #fff; resize: vertical; }
  .totalline { display: flex; align-items: baseline; justify-content: space-between; border-top: 2px solid var(--black); padding: 10px 0 0; margin: 14px 0 6px; }
  .totalline span { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
  .totalline strong { font-size: 20px; font-weight: 900; font-variant-numeric: tabular-nums; }
  .small { font-size: 11.5px; color: var(--text-faint); line-height: 1.55; margin: 8px 0 0; }
  .err { color: var(--red); font-size: 12.5px; font-weight: 600; margin: 10px 0 0; }
  .warn { font-size: 12.5px; color: #8a5b12; background: #fff7e6; border: 1px solid #f2dfb3; padding: 8px 10px; margin: 10px 0 0; line-height: 1.5; }
  .ord-done { border: 1px solid var(--black); background: #fff; padding: 16px; margin: 18px 0 0; }
  .ord-done p { font-size: 13.5px; line-height: 1.6; margin: 0 0 6px; }
  .link { display: inline-block; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--red); margin-top: 8px; }
`}</style>
      </div>
    );
  }

  return (
    <div className="ord">
      {!open ? (
        <>
          <button type="button" className="cta" disabled={!orderable} onClick={() => setOpen(true)}>
            Place order{ceilings.length > 1 ? ` — ${ceilings.length} ceilings` : ''}
          </button>
          {!orderable && (
            <p className="small">
              {quote?.foil.slug ? 'Enter the room to complete the configuration.' : 'Pick a foil that exists in the pricelist first.'}
            </p>
          )}
        </>
      ) : (
        <div className="confirm">
          <p className="k">Confirm your order{ceilings.length > 1 ? ` — ${ceilings.length} ceilings` : ''}</p>
          <ol className="summary">
            {summary.map((c, i) => (
              <li key={i}>
                <strong>{c.name}</strong>
                {c.current && ceilings.length > 1 ? <em> (the one you are editing)</em> : null}
                <br />
                {c.text} — {c.from ? 'from ' : ''}
                {c.total}
              </li>
            ))}
          </ol>
          <label>
            <span>E-mail for the confirmation</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <label>
            <span>Delivery address</span>
            <textarea rows={3} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
          </label>
          <label>
            <span>Project reference</span>
            <input value={projectRef} onChange={(e) => setProjectRef(e.target.value)} />
          </label>
          <label>
            <span>Note</span>
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <p className="totalline">
            <span>{summary.some((c) => c.from) ? 'From' : 'Total'}</span>
            <strong>{total ?? '—'}</strong>
          </p>
          <p className="small">
            Ex VAT, ex shipping. Placing the order does not take a payment — we send a proforma invoice in EUR before
            production.
          </p>
          {err && <p className="err">{err}</p>}
          <div className="btns">
            <button type="button" className="cta" disabled={busy} onClick={() => void submit()}>
              {busy ? 'Sending…' : 'Send the order'}
            </button>
            <button type="button" className="ghost" disabled={busy} onClick={() => setOpen(false)}>
              Back
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
  .ord { margin: 18px 0 0; }
  .cta { font: inherit; font-size: 13px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; background: var(--red); color: #fff; border: 0; padding: 14px 24px; cursor: pointer; width: 100%; }
  .cta:disabled { background: var(--border-2); color: var(--text-faint); cursor: not-allowed; }
  .ghost { font: inherit; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; background: none; border: 1px solid var(--border-input); padding: 13px 18px; cursor: pointer; }
  .btns { display: flex; gap: 8px; margin-top: 12px; }
  .confirm { border: 1px solid var(--border); background: #fff; padding: 16px; }
  .confirm .k, .ord-done .k { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; margin: 0 0 8px; }
  .summary { font-size: 12.5px; color: var(--text-muted); margin: 0 0 14px; padding-left: 18px; line-height: 1.5; }
  .summary li { margin: 0 0 6px; }
  .summary strong { color: var(--black); }
  .summary em { font-style: normal; color: var(--text-faint); }
  .confirm label { display: block; margin: 0 0 10px; }
  .confirm label span { display: block; font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 4px; }
  .confirm input, .confirm textarea { font: inherit; font-size: 13.5px; padding: 8px 10px; border: 1px solid var(--border-input); width: 100%; background: #fff; resize: vertical; }
  .totalline { display: flex; align-items: baseline; justify-content: space-between; border-top: 2px solid var(--black); padding: 10px 0 0; margin: 14px 0 6px; }
  .totalline span { font-size: 10.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
  .totalline strong { font-size: 20px; font-weight: 900; font-variant-numeric: tabular-nums; }
  .small { font-size: 11.5px; color: var(--text-faint); line-height: 1.55; margin: 8px 0 0; }
  .err { color: var(--red); font-size: 12.5px; font-weight: 600; margin: 10px 0 0; }
  .warn { font-size: 12.5px; color: #8a5b12; background: #fff7e6; border: 1px solid #f2dfb3; padding: 8px 10px; margin: 10px 0 0; line-height: 1.5; }
  .ord-done { border: 1px solid var(--black); background: #fff; padding: 16px; margin: 18px 0 0; }
  .ord-done p { font-size: 13.5px; line-height: 1.6; margin: 0 0 6px; }
  .link { display: inline-block; font-size: 12px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--red); margin-top: 8px; }
`}</style>
    </div>
  );
}

