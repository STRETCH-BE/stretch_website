// BLOG HEROES — the shared frame every typographic blog hero is drawn in, so
// the set reads as one family: 2400×1200 (the article's 16/8 slot; the 16/9
// listing crop takes 66 px top and bottom, keep content inside), the site's
// surface tone, the Archivo subset from src/fonts (display look = wdth 125),
// red kicker + uppercase eyebrow top-left, the STRETCH® mark top-right, a
// black rule under them. Recipes (blog-hero-*.mjs) supply the body per locale.
//
// Playwright/Chromium is NOT a project dependency — see scripts/blog-heroes.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const outDir = path.join(repo, 'public/images/blog');

const fontB64 = fs.readFileSync(path.join(repo, 'src/fonts/archivo-var.woff2')).toString('base64');

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** messages/<locale>.json → blogPosts.posts[slug] (title, excerpt, body). */
export function postMessages(locale, slug) {
  const m = JSON.parse(fs.readFileSync(path.join(repo, `messages/${locale}.json`), 'utf8'));
  return { messages: m, post: m.blogPosts.posts[slug] };
}

/** The frame's CSS. Recipes append their own rules after it. */
export const frameCss = `
@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${fontB64}) format('woff2');font-weight:400 900;font-stretch:100% 125%;font-display:block}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:2400px;height:1200px;overflow:hidden}
body{background:#f4f3f1;color:#0a0a0a;font-family:Archivo,system-ui,sans-serif;position:relative}
.sheet{position:absolute;inset:0;padding:104px 110px 0}
.disp{font-variation-settings:'wdth' 125;font-weight:900;text-transform:uppercase}
.top{display:flex;justify-content:space-between;align-items:baseline;height:44px}
.eyebrow{display:flex;align-items:center;gap:22px;color:#e00000;font-size:30px;font-weight:700;letter-spacing:.09em;text-transform:uppercase}
.mark{display:flex;align-items:baseline;gap:4px}
.mark .w{font-size:46px;letter-spacing:-.02em}
.mark .r{color:#e00000;font-weight:900;font-size:26px}
.rule{height:3px;background:#0a0a0a;margin-top:26px}
`;

/** Top bar: red kicker + eyebrow, STRETCH® mark, rule. */
export function frameTop(eyebrow) {
  return `<div class="top">
    <div class="eyebrow"><span style="display:inline-block;width:54px;height:7px;background:#e00000"></span>${esc(eyebrow)}</div>
    <div class="mark disp"><span class="w">STRETCH</span><span class="r">®</span></div>
  </div>
  <div class="rule"></div>`;
}

/** Full document around a recipe's body. `script` runs in the page; expose window.fit() to post-process after fonts load. */
export function document_(locale, css, body, script = '') {
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><style>${frameCss}${css}</style></head><body><div class="sheet">${body}</div><script>${script}</script></body></html>`;
}

/**
 * Render `locales` to public/images/blog/<slug>.<locale>.jpg.
 * html(locale) returns the full document; window.fit (if defined) runs after
 * the webfont is in and its return value is echoed in the log.
 */
export async function renderAll({ slug, locales, html }) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2400, height: 1200 }, deviceScaleFactor: 1 });
  for (const loc of locales) {
    await page.setContent(html(loc), { waitUntil: 'load' });
    const note = await page.evaluate(async () => {
      await document.fonts.ready;
      return typeof window.fit === 'function' ? window.fit() : '';
    });
    const file = path.join(outDir, `${slug}.${loc}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 2400, height: 1200 } });
    console.log(`${loc}  ${path.relative(repo, file)}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB${note !== '' ? '  ' + note : ''}`);
  }
  await browser.close();
}
