// ============================================================================
// KIT CONFIGURATOR — the two order e-mails.
//
//   a. TO THE CUSTOMER  — what they configured, the lines, the total, and in
//      plain words that this is NOT an invoice and no payment was taken.
//   b. TO US            — the same, plus the account, the market, the
//      pricebook version and a loud flag when lines still need a price. Reads
//      like a production sheet: panels and welds first, then the foil code.
//
// Inline CSS in the black/white/red identity, no external images, and a
// plain-text alternative alongside every HTML body.
// ============================================================================
import { contact } from '@/lib/site-config';
import type { PricedBom } from './pricing';
import type { ConfiguratorConfig } from './bom';

export type OrderMailInput = {
  reference: string;
  quote: PricedBom;
  config: ConfiguratorConfig;
  account: { email: string; company: string | null };
  meta: { reference: string | null; projectRef: string | null; deliveryAddress: string | null; note: string | null };
};

const RED = '#e2001a';
const INK = '#111111';

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function money(quote: PricedBom, eur: number | null, pln: number | null): string {
  if (eur == null) return 'price on request';
  if (quote.currency === 'PLN' && pln != null) return `PLN ${pln.toFixed(2)}`;
  return `€ ${eur.toFixed(2)}`;
}

function totalOf(quote: PricedBom): string {
  return quote.currency === 'PLN' && quote.subtotalPln != null
    ? `PLN ${quote.subtotalPln.toFixed(2)}`
    : `€ ${quote.subtotalEur.toFixed(2)}`;
}

/** The configuration in plain words — the same list in both e-mails. */
function specLines(input: OrderMailInput): [string, string][] {
  const { config: c, quote: q } = input;
  const rows: [string, string][] = [];
  if (input.meta.reference) rows.push(['Ceiling', input.meta.reference]);
  rows.push(
    ['Room', `${c.length.toFixed(2)} × ${c.width.toFixed(2)} m`],
    ['Shape', c.shape === 'sloped' ? `Flat + angled (slope ${c.slopeRun.toFixed(2)} m along the ${c.foldSide})` : 'Flat ceiling'],
    ['Surface', `${q.area.toFixed(2)} m²`],
    ['Perimeter', `${q.perimeter.toFixed(2)} m`],
    ['Widest span', `${q.need.toFixed(2)} m`],
    ['Foil', q.foil.product ?? q.foil.label ?? '—'],
    ['Roll width', q.foil.widthCm ? `${q.foil.widthCm} cm (widest span)` : '—'],
    ['Seams', q.weldCount > 0 ? `${q.weldCount} seam(s), ${q.weldMetres.toFixed(2)} m, along the ${c.seamDirection === 'auto' ? 'longer side' : c.seamDirection}` : 'none'],
    ['Corners', `${q.cornersInside} inside · ${q.cornersOutside} outside`],
  );
  if (c.platforms.length) {
    rows.push(['Light supports', c.platforms.map((p) => `${p.qty} × ${p.slug}`).join(', ')]);
  }
  if (c.absorberSlug) rows.push(['Absorber', `${c.absorberSlug} — ${q.area.toFixed(2)} m² (the ceiling surface)`]);
  if (c.lights.length) {
    rows.push(['Lights', c.lights.map((l) => `${l.qty} × ${l.slug}`).join(', ')]);
  }
  if (input.meta.projectRef) rows.push(['Project reference', input.meta.projectRef]);
  return rows;
}

function specTableHtml(rows: [string, string][]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 22px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:7px 0;border-bottom:1px solid #e8e8ea;color:#666;width:42%">${esc(k)}</td><td style="padding:7px 0;border-bottom:1px solid #e8e8ea;font-weight:600;color:${INK}">${esc(v)}</td></tr>`,
      )
      .join('')}
  </table>`;
}

function linesTableHtml(quote: PricedBom): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:13px;margin:0 0 14px">
    <tr>
      <th align="left" style="padding:8px 0;border-bottom:2px solid ${INK};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#666">Product</th>
      <th align="right" style="padding:8px 0;border-bottom:2px solid ${INK};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#666">Qty</th>
      <th align="right" style="padding:8px 0;border-bottom:2px solid ${INK};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#666">Unit</th>
      <th align="right" style="padding:8px 0;border-bottom:2px solid ${INK};font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#666">Total</th>
    </tr>
    ${quote.lines
      .map(
        (l) => `<tr>
      <td style="padding:7px 0;border-bottom:1px solid #e8e8ea">${esc(l.label)}${l.code ? ` <span style="color:#999">[${esc(l.code)}]</span>` : ''}${
        l.status !== 'ok' ? ` <span style="color:${RED};font-weight:700">· price on request</span>` : ''
      }${
        l.kind === 'ceiling' && l.note ? `<br><span style="font-size:11px;color:#666">${esc(l.note)}</span>` : ''
      }</td>
      <td align="right" style="padding:7px 0;border-bottom:1px solid #e8e8ea;white-space:nowrap">${esc(l.qty)} ${esc(l.unit ?? '')}</td>
      <td align="right" style="padding:7px 0;border-bottom:1px solid #e8e8ea;white-space:nowrap">${esc(money(quote, l.unitPriceEur, l.unitPricePln))}</td>
      <td align="right" style="padding:7px 0;border-bottom:1px solid #e8e8ea;white-space:nowrap;font-weight:700">${esc(money(quote, l.lineTotalEur, l.lineTotalPln))}</td>
    </tr>`,
      )
      .join('')}
  </table>`;
}

function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f5">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f4f4f5">
    <tr><td align="center" style="padding:26px 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e2e2e5;font-family:Helvetica,Arial,sans-serif;color:${INK}">
        <tr><td style="background:${INK};padding:18px 26px">
          <span style="color:#fff;font-weight:900;letter-spacing:.04em;font-size:17px">STRETCH</span>
          <span style="color:${RED};font-weight:900">&nbsp;®</span>
          <span style="float:right;color:#bdbdc2;font-size:11px;letter-spacing:.08em;text-transform:uppercase">${esc(title)}</span>
        </td></tr>
        <tr><td style="padding:26px">${body}</td></tr>
        <tr><td style="background:#fafafa;border-top:1px solid #e8e8ea;padding:16px 26px;font-size:11.5px;color:#777;line-height:1.6">
          STRETCH · ${esc(contact.email)} · ${esc(contact.phoneDisplay ?? contact.phone ?? '')}
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

const NO_PAYMENT_EN =
  'This confirms we received your order. It is not an invoice and no payment has been taken; we send a proforma invoice in EUR before production. Prices are ex VAT and ex shipping.';

/** a. The customer's confirmation. */
export function buildCustomerEmail(input: OrderMailInput): { subject: string; html: string; text: string } {
  const { reference, quote } = input;
  const rows = specLines(input);
  const subject = `Your STRETCH order ${reference}`;

  const html = shell(
    'Order confirmation',
    `<p style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 6px">Order ${esc(reference)}</p>
     <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0 0 16px;line-height:1.1">Thank you — we have your order.</h1>
     <p style="font-size:14px;line-height:1.65;color:#444;margin:0 0 22px">${esc(NO_PAYMENT_EN)}</p>
     <h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 10px">What you configured</h2>
     ${specTableHtml(rows)}
     <h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 10px">Bill of materials</h2>
     ${linesTableHtml(quote)}
     <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
       <tr><td style="padding:12px 0;border-top:2px solid ${INK};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#666">${
         quote.needsManualPricing ? 'From' : 'Total'
       }</td>
       <td align="right" style="padding:12px 0;border-top:2px solid ${INK};font-size:22px;font-weight:900">${esc(totalOf(quote))}</td></tr>
     </table>
     ${
       quote.needsManualPricing
         ? `<p style="font-size:13px;color:#8a5b12;background:#fff7e6;border:1px solid #f2dfb3;padding:10px 12px;margin:12px 0 0;line-height:1.55">${quote.unpricedCount} line${
             quote.unpricedCount === 1 ? '' : 's'
           } still need a price. We work ${quote.unpricedCount === 1 ? 'it' : 'them'} out by hand and confirm on the proforma invoice.</p>`
         : ''
     }
     ${input.meta.deliveryAddress ? `<h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:22px 0 8px">Delivery</h2><p style="font-size:14px;line-height:1.6;margin:0;white-space:pre-line">${esc(input.meta.deliveryAddress)}</p>` : ''}
     ${input.meta.note ? `<h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:22px 0 8px">Your note</h2><p style="font-size:14px;line-height:1.6;margin:0;white-space:pre-line">${esc(input.meta.note)}</p>` : ''}
     <h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:24px 0 8px">What happens next</h2>
     <p style="font-size:14px;line-height:1.65;color:#444;margin:0 0 8px">We check the configuration, price anything still open, and send you a proforma invoice in EUR. Production starts once that is settled.</p>
     <p style="font-size:14px;line-height:1.65;color:#444;margin:0">Questions about this order? Reply to this e-mail or call us — quote ${esc(reference)}.</p>`,
  );

  const text = [
    `Your STRETCH order ${reference}`,
    '',
    NO_PAYMENT_EN,
    '',
    'WHAT YOU CONFIGURED',
    ...rows.map(([k, v]) => `  ${k}: ${v}`),
    '',
    'BILL OF MATERIALS',
    ...quote.lines.map(
      (l) =>
        `  ${l.qty} ${l.unit ?? ''} × ${l.label}${l.code ? ` [${l.code}]` : ''} — ${money(quote, l.lineTotalEur, l.lineTotalPln)}`,
    ),
    '',
    `${quote.needsManualPricing ? 'FROM' : 'TOTAL'}: ${totalOf(quote)}`,
    quote.needsManualPricing
      ? `${quote.unpricedCount} line(s) still need a price; we confirm them on the proforma invoice.`
      : '',
    '',
    input.meta.deliveryAddress ? `DELIVERY\n  ${input.meta.deliveryAddress}` : '',
    input.meta.note ? `YOUR NOTE\n  ${input.meta.note}` : '',
    '',
    'WHAT HAPPENS NEXT',
    '  We check the configuration, price anything still open, and send a proforma',
    '  invoice in EUR. Production starts once that is settled.',
    '',
    `Questions? Reply to this e-mail — quote ${reference}.`,
  ]
    .filter((l) => l !== '')
    .join('\n');

  return { subject, html, text };
}

/** b. Our copy — a production sheet. */
export function buildInternalEmail(input: OrderMailInput): { subject: string; html: string; text: string } {
  const { reference, quote, config: c, account } = input;
  const flag = quote.needsManualPricing ? ' ⚠ NEEDS MANUAL PRICING' : '';
  const subject = `Order ${reference} — ${account.company || account.email} (${quote.market})${flag}`;

  const production: [string, string][] = [
    ['Panels', quote.panels.map((p) => `${p.label}: ${p.a.toFixed(2)} × ${p.b.toFixed(2)} m`).join(' | ')],
    ['Seams', quote.weldCount > 0 ? `${quote.weldCount} seam(s), ${quote.weldMetres.toFixed(2)} m, along the ${input.config.seamDirection === 'auto' ? 'longer side' : input.config.seamDirection} — ${quote.foil.reason}` : 'none'],
    ['Foil code', quote.foil.code ?? '—'],
    ['Foil product', quote.foil.product ?? quote.foil.label ?? '—'],
    ['Roll width', quote.foil.widthCm ? `${quote.foil.widthCm} cm (widest span)` : '—'],
    // Fabric is cut into pieces and bought by the running metre — the bench
    // needs the pieces, the m² is only the ceiling. Pieces may come off
    // different rolls: a seam's remainder is cut from a narrower one.
    ...(quote.clothPieces > 0
      ? ([['Cloth', `${quote.clothPieces} piece(s), ${quote.rollMetres.toFixed(2)} m off the ${
          (quote.clothWidthsCm ?? []).length ? quote.clothWidthsCm.join(' / ') : quote.foil.widthCm ?? '?'
        } cm roll(s) — roll and measurements per piece in the bill below`]] as [string, string][])
      : []),
    ['Surface', `${quote.area.toFixed(2)} m²`],
    ['Perimeter', `${quote.perimeter.toFixed(2)} m`],
  ];

  const profiles = quote.lines.filter((l) => l.kind === 'profile' || l.kind === 'transition');
  if (profiles.length) {
    production.push([
      'Profiles',
      profiles.map((l) => `${l.label}: ${l.qty} ${l.unit ?? ''}${l.unit === 'pc' ? ` (${(l.qty * 2).toFixed(1)} m at 2 m/piece)` : ''}`).join(' | '),
    ]);
  }

  const account_rows: [string, string][] = [
    ['Account', account.email],
    ['Company', account.company ?? '—'],
    ['Price group', quote.market],
    ['Pricelist', `${quote.pricebookVersion}${quote.pricebookUpdatedAt ? ` (${String(quote.pricebookUpdatedAt).slice(0, 10)})` : ''}`],
    ['Delivery', input.meta.deliveryAddress ?? '—'],
    ['Ceiling', input.meta.reference ?? '—'],
    ['Project ref', input.meta.projectRef ?? '—'],
    ['Note', input.meta.note ?? '—'],
    ['Shape', c.shape === 'sloped' ? `Flat + angled, slope ${c.slopeRun.toFixed(2)} m along the ${c.foldSide}` : 'Flat'],
  ];

  const unpriced = quote.lines.filter((l) => l.status !== 'ok');

  const html = shell(
    'New order',
    `<p style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 6px">Order ${esc(reference)}</p>
     <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;margin:0 0 16px;line-height:1.1">${esc(account.company || account.email)}</h1>
     ${
       unpriced.length
         ? `<div style="border:2px solid ${RED};background:#fdeaea;padding:12px 14px;margin:0 0 20px">
              <p style="margin:0 0 6px;font-weight:900;color:${RED};font-size:13px;letter-spacing:.05em;text-transform:uppercase">Needs manual pricing — ${unpriced.length} line${unpriced.length === 1 ? '' : 's'}</p>
              <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6">${unpriced
                .map((l) => `<li>${esc(l.label)} — ${esc(l.qty)} ${esc(l.unit ?? '')} (${esc(l.status === 'no_row' ? 'no pricebook row' : `no ${quote.market} price`)})</li>`)
                .join('')}</ul>
            </div>`
         : ''
     }
     <h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 10px">Production</h2>
     ${specTableHtml(production)}
     <h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 10px">Bill of materials</h2>
     ${linesTableHtml(quote)}
     <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 22px">
       <tr><td style="padding:12px 0;border-top:2px solid ${INK};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#666">Subtotal (ex VAT, ex shipping)</td>
       <td align="right" style="padding:12px 0;border-top:2px solid ${INK};font-size:22px;font-weight:900">${esc(totalOf(quote))}</td></tr>
     </table>
     <h2 style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 10px">Account</h2>
     ${specTableHtml(account_rows)}`,
  );

  const text = [
    `ORDER ${reference} — ${account.company || account.email} (${quote.market})`,
    quote.needsManualPricing ? `\n*** NEEDS MANUAL PRICING — ${unpriced.length} line(s) ***` : '',
    ...unpriced.map((l) => `  ! ${l.label} — ${l.qty} ${l.unit ?? ''} (${l.status === 'no_row' ? 'no pricebook row' : `no ${quote.market} price`})`),
    '',
    'PRODUCTION',
    ...production.map(([k, v]) => `  ${k}: ${v}`),
    '',
    'BILL OF MATERIALS',
    ...quote.lines.map(
      (l) =>
        `  ${l.qty} ${l.unit ?? ''} × ${l.label}${l.code ? ` [${l.code}]` : ''} — ${money(quote, l.lineTotalEur, l.lineTotalPln)}${
          l.kind === 'ceiling' && l.note ? `\n      ${l.note}` : ''
        }`,
    ),
    '',
    `SUBTOTAL (ex VAT, ex shipping): ${totalOf(quote)}`,
    '',
    'ACCOUNT',
    ...account_rows.map(([k, v]) => `  ${k}: ${v}`),
  ]
    .filter((l) => l !== '')
    .join('\n');

  return { subject, html, text };
}
