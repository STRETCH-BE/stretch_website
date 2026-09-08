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
import { orderTotals, type PricedBom } from './pricing';
import type { ConfiguratorConfig } from './bom';

/** One ceiling of the order, as configured and as priced. */
export type MailCeiling = { config: ConfiguratorConfig; quote: PricedBom; reference: string | null };

export type OrderMailInput = {
  reference: string;
  /** One or several — Michael, 8 Sep 2026: "order multiple ceiling kits". */
  ceilings: MailCeiling[];
  account: { email: string; company: string | null };
  meta: { projectRef: string | null; deliveryAddress: string | null; note: string | null };
};

/** "Living room" or "Ceiling 2" — never blank on a sheet. */
function ceilingName(c: MailCeiling, i: number): string {
  return c.reference ?? `Ceiling ${i + 1}`;
}

function totalsOf(input: OrderMailInput): string {
  const t = orderTotals(input.ceilings);
  return t.currency === 'PLN' && t.subtotalPln != null ? `PLN ${t.subtotalPln.toFixed(2)}` : `€ ${t.subtotalEur.toFixed(2)}`;
}

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
function specLines(ceiling: MailCeiling): [string, string][] {
  const { config: c, quote: q } = ceiling;
  const rows: [string, string][] = [];
  if (ceiling.reference) rows.push(['Ceiling', ceiling.reference]);
  rows.push(
    ['Room', `${c.length.toFixed(2)} × ${c.width.toFixed(2)} m`],
    [
      'Shape',
      c.shape === 'sloped'
        ? `Flat ${c.length.toFixed(2)} × ${c.width.toFixed(2)} m + angled ${(c.foldLength ?? (c.foldSide === 'width' ? c.width : c.length)).toFixed(2)} × ${c.slopeRun.toFixed(2)} m (fold along the ${c.foldSide})`
        : 'Flat ceiling',
    ],
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
  return rows;
}

const H2 = 'font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 10px';

/** A ceiling's block in the customer's mail: heading (when several), spec, lines, subtotal (when several). */
function customerCeilingHtml(c: MailCeiling, i: number, of: number): string {
  return `${
    of > 1
      ? `<h2 style="font-size:15px;font-weight:900;text-transform:uppercase;margin:26px 0 12px;padding-top:18px;border-top:2px solid ${INK}">${i + 1}. ${esc(ceilingName(c, i))}</h2>`
      : ''
  }
     <h2 style="${H2}">What you configured</h2>
     ${specTableHtml(specLines(c))}
     <h2 style="${H2}">Bill of materials</h2>
     ${linesTableHtml(c.quote)}
     ${
       of > 1
         ? `<p style="text-align:right;font-size:13px;margin:0 0 6px;color:#444">${esc(ceilingName(c, i))} — ${c.quote.needsManualPricing ? 'from ' : ''}<strong>${esc(totalOf(c.quote))}</strong></p>`
         : ''
     }`;
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
  const { reference, ceilings } = input;
  const totals = orderTotals(ceilings);
  const many = ceilings.length > 1;
  const subject = `Your STRETCH order ${reference}${many ? ` — ${ceilings.length} ceilings` : ''}`;

  const html = shell(
    'Order confirmation',
    `<p style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 6px">Order ${esc(reference)}</p>
     <h1 style="font-size:26px;font-weight:900;text-transform:uppercase;margin:0 0 16px;line-height:1.1">Thank you — we have your order.</h1>
     <p style="font-size:14px;line-height:1.65;color:#444;margin:0 0 22px">${esc(NO_PAYMENT_EN)}</p>
     ${
       many
         ? `<p style="font-size:14px;line-height:1.6;margin:0 0 6px"><strong>${ceilings.length} ceilings:</strong> ${ceilings
             .map((c, i) => esc(ceilingName(c, i)))
             .join(' · ')}</p>`
         : ''
     }
     ${input.meta.projectRef ? `<p style="font-size:13px;color:#666;margin:0 0 18px">Project reference: ${esc(input.meta.projectRef)}</p>` : ''}
     ${ceilings.map((c, i) => customerCeilingHtml(c, i, ceilings.length)).join('')}
     <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:${many ? 18 : 0}px">
       <tr><td style="padding:12px 0;border-top:2px solid ${INK};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#666">${
         totals.needsManualPricing ? 'From' : 'Total'
       }${many ? ` — ${ceilings.length} ceilings` : ''}</td>
       <td align="right" style="padding:12px 0;border-top:2px solid ${INK};font-size:22px;font-weight:900">${esc(totalsOf(input))}</td></tr>
     </table>
     ${
       totals.needsManualPricing
         ? `<p style="font-size:13px;color:#8a5b12;background:#fff7e6;border:1px solid #f2dfb3;padding:10px 12px;margin:12px 0 0;line-height:1.55">${totals.unpricedCount} line${
             totals.unpricedCount === 1 ? '' : 's'
           } still need a price. We work ${totals.unpricedCount === 1 ? 'it' : 'them'} out by hand and confirm on the proforma invoice.</p>`
         : ''
     }
     ${input.meta.deliveryAddress ? `<h2 style="${H2};margin-top:22px">Delivery</h2><p style="font-size:14px;line-height:1.6;margin:0;white-space:pre-line">${esc(input.meta.deliveryAddress)}</p>` : ''}
     ${input.meta.note ? `<h2 style="${H2};margin-top:22px">Your note</h2><p style="font-size:14px;line-height:1.6;margin:0;white-space:pre-line">${esc(input.meta.note)}</p>` : ''}
     <h2 style="${H2};margin-top:24px">What happens next</h2>
     <p style="font-size:14px;line-height:1.65;color:#444;margin:0 0 8px">We check the configuration, price anything still open, and send you a proforma invoice in EUR. Production starts once that is settled.</p>
     <p style="font-size:14px;line-height:1.65;color:#444;margin:0">Questions about this order? Reply to this e-mail or call us — quote ${esc(reference)}.</p>`,
  );

  const text = [
    `Your STRETCH order ${reference}${many ? ` — ${ceilings.length} ceilings` : ''}`,
    '',
    NO_PAYMENT_EN,
    input.meta.projectRef ? `\nProject reference: ${input.meta.projectRef}` : '',
    ...ceilings.flatMap((c, i) => [
      '',
      many ? `=== ${i + 1}. ${ceilingName(c, i).toUpperCase()} ===` : '',
      'WHAT YOU CONFIGURED',
      ...specLines(c).map(([k, v]) => `  ${k}: ${v}`),
      '',
      'BILL OF MATERIALS',
      ...c.quote.lines.map(
        (l) =>
          `  ${l.qty} ${l.unit ?? ''} × ${l.label}${l.code ? ` [${l.code}]` : ''} — ${money(c.quote, l.lineTotalEur, l.lineTotalPln)}`,
      ),
      many ? `  ${ceilingName(c, i)}: ${c.quote.needsManualPricing ? 'from ' : ''}${totalOf(c.quote)}` : '',
    ]),
    '',
    `${totals.needsManualPricing ? 'FROM' : 'TOTAL'}${many ? ` (${ceilings.length} ceilings)` : ''}: ${totalsOf(input)}`,
    totals.needsManualPricing
      ? `${totals.unpricedCount} line(s) still need a price; we confirm them on the proforma invoice.`
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

/** Production rows for ONE ceiling — the bench reads these top to bottom. */
function productionRows(c: MailCeiling): [string, string][] {
  const { quote, config } = c;
  const rows: [string, string][] = [
    ['Panels', quote.panels.map((p) => `${p.label}: ${p.a.toFixed(2)} × ${p.b.toFixed(2)} m`).join(' | ')],
    ['Shape', config.shape === 'sloped' ? `Flat ${config.length.toFixed(2)} × ${config.width.toFixed(2)} m + angled ${(config.foldLength ?? (config.foldSide === 'width' ? config.width : config.length)).toFixed(2)} × ${config.slopeRun.toFixed(2)} m (fold along the ${config.foldSide})` : 'Flat'],
    ['Seams', quote.weldCount > 0 ? `${quote.weldCount} seam(s), ${quote.weldMetres.toFixed(2)} m, along the ${config.seamDirection === 'auto' ? 'longer side' : config.seamDirection} — ${quote.foil.reason}` : 'none'],
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
    rows.push([
      'Profiles',
      profiles.map((l) => `${l.label}: ${l.qty} ${l.unit ?? ''}${l.unit === 'pc' ? ` (${(l.qty * 2).toFixed(1)} m at 2 m/piece)` : ''}`).join(' | '),
    ]);
  }
  return rows;
}

function unpricedOf(quote: PricedBom) {
  return quote.lines.filter((l) => l.status !== 'ok');
}

/** b. Our copy — a production sheet, one block per ceiling. */
export function buildInternalEmail(input: OrderMailInput): { subject: string; html: string; text: string } {
  const { reference, ceilings, account } = input;
  const totals = orderTotals(ceilings);
  const many = ceilings.length > 1;
  const flag = totals.needsManualPricing ? ' ⚠ NEEDS MANUAL PRICING' : '';
  const subject = `Order ${reference} — ${account.company || account.email} (${totals.market})${many ? ` — ${ceilings.length} ceilings` : ''}${flag}`;

  const account_rows: [string, string][] = [
    ['Account', account.email],
    ['Company', account.company ?? '—'],
    ['Price group', totals.market],
    ['Pricelist', `${ceilings[0]?.quote.pricebookVersion ?? '—'}${ceilings[0]?.quote.pricebookUpdatedAt ? ` (${String(ceilings[0].quote.pricebookUpdatedAt).slice(0, 10)})` : ''}`],
    ['Delivery', input.meta.deliveryAddress ?? '—'],
    ['Ceilings', ceilings.map((c, i) => ceilingName(c, i)).join('; ')],
    ['Project ref', input.meta.projectRef ?? '—'],
    ['Note', input.meta.note ?? '—'],
  ];

  const allUnpriced = ceilings.flatMap((c, i) => unpricedOf(c.quote).map((l) => ({ l, name: ceilingName(c, i), market: c.quote.market })));

  const html = shell(
    'New order',
    `<p style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#888;margin:0 0 6px">Order ${esc(reference)}${many ? ` · ${ceilings.length} ceilings` : ''}</p>
     <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;margin:0 0 16px;line-height:1.1">${esc(account.company || account.email)}</h1>
     ${
       allUnpriced.length
         ? `<div style="border:2px solid ${RED};background:#fdeaea;padding:12px 14px;margin:0 0 20px">
              <p style="margin:0 0 6px;font-weight:900;color:${RED};font-size:13px;letter-spacing:.05em;text-transform:uppercase">Needs manual pricing — ${allUnpriced.length} line${allUnpriced.length === 1 ? '' : 's'}</p>
              <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6">${allUnpriced
                .map(({ l, name, market }) => `<li>${many ? `${esc(name)}: ` : ''}${esc(l.label)} — ${esc(l.qty)} ${esc(l.unit ?? '')} (${esc(l.status === 'no_row' ? 'no pricebook row' : `no ${market} price`)})</li>`)
                .join('')}</ul>
            </div>`
         : ''
     }
     ${ceilings
       .map(
         (c, i) => `${
           many
             ? `<h2 style="font-size:15px;font-weight:900;text-transform:uppercase;margin:26px 0 12px;padding-top:18px;border-top:2px solid ${INK}">${i + 1}. ${esc(ceilingName(c, i))}</h2>`
             : ''
         }
     <h2 style="${H2}">Production</h2>
     ${specTableHtml(productionRows(c))}
     <h2 style="${H2}">Bill of materials</h2>
     ${linesTableHtml(c.quote)}
     ${many ? `<p style="text-align:right;font-size:13px;margin:0 0 6px;color:#444">${esc(ceilingName(c, i))} — <strong>${esc(totalOf(c.quote))}</strong></p>` : ''}`,
       )
       .join('')}
     <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:${many ? 18 : 0}px 0 22px">
       <tr><td style="padding:12px 0;border-top:2px solid ${INK};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#666">Subtotal (ex VAT, ex shipping)${many ? ` — ${ceilings.length} ceilings` : ''}</td>
       <td align="right" style="padding:12px 0;border-top:2px solid ${INK};font-size:22px;font-weight:900">${esc(totalsOf(input))}</td></tr>
     </table>
     <h2 style="${H2}">Account</h2>
     ${specTableHtml(account_rows)}`,
  );

  const text = [
    `ORDER ${reference} — ${account.company || account.email} (${totals.market})${many ? ` — ${ceilings.length} CEILINGS` : ''}`,
    totals.needsManualPricing ? `\n*** NEEDS MANUAL PRICING — ${allUnpriced.length} line(s) ***` : '',
    ...allUnpriced.map(({ l, name, market }) => `  ! ${many ? `${name}: ` : ''}${l.label} — ${l.qty} ${l.unit ?? ''} (${l.status === 'no_row' ? 'no pricebook row' : `no ${market} price`})`),
    ...ceilings.flatMap((c, i) => [
      '',
      many ? `=== ${i + 1}. ${ceilingName(c, i).toUpperCase()} ===` : '',
      'PRODUCTION',
      ...productionRows(c).map(([k, v]) => `  ${k}: ${v}`),
      '',
      'BILL OF MATERIALS',
      ...c.quote.lines.map(
        (l) =>
          `  ${l.qty} ${l.unit ?? ''} × ${l.label}${l.code ? ` [${l.code}]` : ''} — ${money(c.quote, l.lineTotalEur, l.lineTotalPln)}${
            l.kind === 'ceiling' && l.note ? `\n      ${l.note}` : ''
          }`,
      ),
      many ? `  ${ceilingName(c, i)}: ${totalOf(c.quote)}` : '',
    ]),
    '',
    `SUBTOTAL (ex VAT, ex shipping)${many ? ` — ${ceilings.length} ceilings` : ''}: ${totalsOf(input)}`,
    '',
    'ACCOUNT',
    ...account_rows.map(([k, v]) => `  ${k}: ${v}`),
  ]
    .filter((l) => l !== '')
    .join('\n');

  return { subject, html, text };
}
