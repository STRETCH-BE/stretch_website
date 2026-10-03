#!/usr/bin/env node
// BLOG — render the hero of the public price guide (blog "spanplafond-prijs")
// as a typographic infographic, ONE JPG PER LOCALE, into
//   public/images/blog/spanplafond-prijs.<locale>.jpg   (2400×1200 = the
//   article hero ratio 16/8; the blog card crops it to 16/9, the safe area
//   accounts for that).
//
// Every word on the image is the site's own copy — messages/<locale>.json:
//   blogPosts.posts.spanplafond-prijs.body[1].heading  (chart title)
//   priceCalculatorPage.types.*                        (the five buckets)
// and every figure mirrors src/lib/indicative-prices.ts (EUR buckets; PLN for
// Poland). The script refuses to render when a figure below no longer matches
// that file, so the picture can never claim a price the page does not.
// Switzerland (ch, fr-ch) is deliberately absent: pricesPublished() hides the
// post there; blogHeroByLocale() in content.ts lists no ch/fr-ch, so the
// placeholder would show — never a EUR image. Add a CHF entry here AND there when the Swiss
// guide lands.
//
// Needs Playwright's Chromium, which is NOT a project dependency (keep it out
// of package.json):
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/blog-hero-price-guide.mjs            # all locales
//   node scripts/blog-hero-price-guide.mjs pl is      # a subset
// Then commit the JPGs. See scripts/blog-heroes.md.
import fs from 'node:fs';
import path from 'node:path';
import { repo, renderAll, postMessages, frameTop, document_, esc } from './blog-hero-lib.mjs';

const only = process.argv.slice(2);

// Per m² installed, excl. VAT — mirrors src/lib/indicative-prices.ts (checked below).
const buckets = {
  EUR: { basic: [70, 90], printed: [90, 100], acoustic: [100, 150], backlit: [130, 160], bathroom: [150, 200] },
  PLN: { basic: [150, 200], printed: [200, 250], acoustic: [250, 350], backlit: [300, 400], bathroom: [350, 450] },
};
const ticks = { EUR: [70, 100, 150, 200], PLN: [150, 250, 350, 450] };
const order = ['basic', 'printed', 'acoustic', 'backlit', 'bathroom'];

// Drift guard: every pair above must appear verbatim in indicative-prices.ts.
const src = fs.readFileSync(path.join(repo, 'src/lib/indicative-prices.ts'), 'utf8');
for (const [cur, b] of Object.entries(buckets)) {
  for (const [k, [lo, hi]] of Object.entries(b)) {
    if (!src.includes(`${k}: { low: ${lo}, high: ${hi} }`)) {
      console.error(`indicative-prices.ts no longer says ${cur} ${k} = ${lo}–${hi}. Update the buckets in this script first.`);
      process.exit(1);
    }
  }
}

// Per locale: the big figure, the red unit after it (carrying the currency
// where the market writes it after the amount), the row values and the
// eyebrow. Vocabulary follows the article's own P1 + priceCalculatorPage.disclaimer.
const L = {
  en: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'per m²', money: (a, b) => `€${a}–${b}`, caption: 'Indicative price · installed · excl. VAT' },
  uk: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'per m²', money: (a, b) => `€${a}–${b}`, caption: 'Indicative price · installed · excl. VAT' },
  us: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'per m²', money: (a, b) => `€${a}–${b}`, caption: 'Indicative price · installed · excl. tax' },
  be: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'per m²', money: (a, b) => `€${a}–${b}`, caption: 'Richtprijs · geplaatst · excl. btw' },
  nl: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'per m²', money: (a, b) => `€${a}–${b}`, caption: 'Richtprijs · geplaatst · excl. btw' },
  fr: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'par m²', money: (a, b) => `€${a}–${b}`, caption: 'Prix indicatif · posé · hors TVA' },
  de: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'pro m²', money: (a, b) => `€${a}–${b}`, caption: 'Richtpreis · montiert · zzgl. MwSt.' },
  es: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'por m²', money: (a, b) => `€${a}–${b}`, caption: 'Precio indicativo · instalado · sin IVA' },
  pt: { cur: 'EUR', fig: (a, b) => `€${a}–${b}`, unit: 'por m²', money: (a, b) => `€${a}–${b}`, caption: 'Preço indicativo · instalado · sem IVA' },
  da: { cur: 'EUR', fig: (a, b) => `${a}–${b}`, unit: '€ per m²', money: (a, b) => `${a}–${b} €`, caption: 'Vejledende pris · monteret · ekskl. moms' },
  sv: { cur: 'EUR', fig: (a, b) => `${a}–${b}`, unit: '€ per m²', money: (a, b) => `${a}–${b} €`, caption: 'Riktpris · monterat · exkl. moms' },
  no: { cur: 'EUR', fig: (a, b) => `${a}–${b}`, unit: '€ per m²', money: (a, b) => `${a}–${b} €`, caption: 'Veiledende pris · montert · ekskl. mva' },
  is: { cur: 'EUR', fig: (a, b) => `${a}–${b}`, unit: 'EUR per m²', money: (a, b) => `${a}–${b} EUR`, caption: 'Viðmiðunarverð · uppsett · án VSK' },
  pl: { cur: 'PLN', fig: (a, b) => `${a}–${b}`, unit: 'zł za m²', money: (a, b) => `${a}–${b} zł`, caption: 'Cena orientacyjna · z montażem · netto' },
};

function html(locale) {
  const { messages: m, post } = postMessages(locale, 'spanplafond-prijs');
  const types = m.priceCalculatorPage.types;
  const cfg = L[locale];
  const b = buckets[cfg.cur];
  const t = ticks[cfg.cur];
  const [min, max] = [t[0], t[t.length - 1]];
  const pct = (v) => ((v - min) / (max - min)) * 100;

  const rows = order
    .map((k) => {
      const [lo, hi] = b[k];
      return `<div class="row">
        <div class="lbl">${esc(types[k])}</div>
        <div class="track">${t.map((v) => `<i style="left:${pct(v)}%"></i>`).join('')}<b style="left:${pct(lo)}%;width:${pct(hi) - pct(lo)}%"></b></div>
        <div class="val">${esc(cfg.money(lo, hi))}</div>
      </div>`;
    })
    .join('');

  const css = `
.fig{display:flex;align-items:baseline;gap:30px;margin-top:40px;white-space:nowrap;height:282px}
.fig .n{font-size:282px;letter-spacing:-.045em;line-height:1;font-variant-numeric:tabular-nums}
.fig .u{font-size:84px;letter-spacing:-.03em;color:#e00000;line-height:1}
.chart{margin-top:36px}
.ch-head{display:grid;grid-template-columns:760px 1130px 1fr;align-items:end;min-height:84px;padding-bottom:16px;border-bottom:1.5px solid #cfccc6}
.ch-title{font-size:28px;line-height:1.16;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#0a0a0a;padding-right:40px}
.ticks{position:relative;width:1130px;height:30px;font-size:24px;font-weight:600;color:#8a867f;font-variant-numeric:tabular-nums}
.ticks span{position:absolute;transform:translateX(-50%);bottom:0}
.row{display:grid;grid-template-columns:760px 1130px 1fr;align-items:center;height:92px;border-bottom:1.5px solid #e2e0db}
.row:last-child{border-bottom:none}
.lbl{font-size:33px;font-weight:600;line-height:1.08;color:#1f1e1b;padding-right:40px}
.track{position:relative;height:100%}
.track i{position:absolute;top:0;bottom:0;width:1.5px;background:#dedbd5}
.track b{position:absolute;top:50%;height:26px;margin-top:-13px;background:#0a0a0a}
.val{font-size:34px;font-weight:800;text-align:right;font-variant-numeric:tabular-nums;letter-spacing:-.01em;white-space:nowrap}
`;
  const body = `${frameTop(cfg.caption)}
  <div class="fig disp"><span class="n" id="n">${esc(cfg.fig(b.basic[0], b.bathroom[1]))}</span><span class="u">${esc(cfg.unit)}</span></div>
  <div class="chart">
    <div class="ch-head"><div class="ch-title">${esc(post.body[1].heading)}</div><div class="ticks">${t.map((v) => `<span style="left:${pct(v)}%">${v}</span>`).join('')}</div></div>
    ${rows}
  </div>`;
  // Shrink the big figure until it (plus the unit) fits the sheet width. Runs
  // after the webfont is in (renderAll) — measured in the fallback font it lies.
  const script = `
  window.fit = () => {
    const n = document.getElementById('n'), u = document.querySelector('.fig .u');
    const avail = 2400 - 220 - 30 - u.getBoundingClientRect().width;
    let size = 282; n.style.fontSize = size + 'px';
    while (n.getBoundingClientRect().width > avail && size > 120) { size -= 4; n.style.fontSize = size + 'px'; }
    return 'figure ' + size + 'px';
  };`;
  return document_(locale, css, body, script);
}

const locales = only.length ? only : Object.keys(L);
for (const l of locales) if (!L[l]) { console.error(`no hero recipe for locale "${l}"`); process.exit(1); }
await renderAll({ slug: 'spanplafond-prijs', locales, html });
