#!/usr/bin/env tsx
// ============================================================================
// SITEMAP CHECK — every production host, after `next build`.
//
//   npx tsx scripts/check-sitemap.ts            (runs in `postbuild` too)
//
// For each live domain it renders the real /sitemap.xml handler
// (src/app/sitemap.xml/route.ts, Host header = the domain) and compares the
// <loc> set with what the build actually produced: every page Next
// prerendered for that host's locales (.next/prerender-manifest.json — the
// union of every generateStaticParams) that is INDEXABLE and SELF-CANONICAL
// in its built HTML must be in the sitemap, and every sitemap URL must be a
// built page. Pages the build emits but the sitemap must not list are
// recognised by their own HTML, never by a hand-kept list: a `noindex`
// robots meta (portal, the 404 page, the hidden calculator on a no-price
// locale) or a canonical pointing elsewhere (/applications/custom-print →
// /products/custom-print, /training → /installer-training). Exit code 1 on
// any mismatch, with the offending URLs printed. The Swiss review of 2 Oct
// 2026 is the reason it exists: "only 61 static URLs" turned out to be a
// truncated fetch, and nothing on the build side ever counted.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  liveLocales,
  localeDomains,
  localesForDomain,
  localeStatus,
  publicPrefix,
  type Locale,
} from '../src/i18n/config';
import { GET as sitemapGET } from '../src/app/sitemap.xml/route';

const ROOT = process.cwd();
const NEXT = join(ROOT, '.next');
const MANIFEST = join(NEXT, 'prerender-manifest.json');

if (!existsSync(MANIFEST)) {
  console.error(`check-sitemap: ${MANIFEST} not found — run \`next build\` first.`);
  process.exit(2);
}

type Manifest = { routes: Record<string, { srcRoute?: string | null }> };
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as Manifest;

/** Built (locale, route) pairs: "/ch/dealers/luzern" → { locale: 'ch', route: '/dealers/luzern' }. */
function builtPages(): { locale: Locale; route: string; path: string }[] {
  const out: { locale: Locale; route: string; path: string }[] = [];
  for (const path of Object.keys(manifest.routes)) {
    const seg = path.split('/').filter(Boolean);
    const locale = seg[0] as Locale;
    if (!locale || !(liveLocales as readonly string[]).includes(locale)) continue;
    const route = '/' + seg.slice(1).join('/');
    out.push({ locale, route, path });
  }
  return out;
}

/** The prerendered HTML of a built path (.next/server/app/<path>.html). */
function builtHtml(path: string): string | null {
  const file = join(NEXT, 'server', 'app', `${path === '/' ? 'index' : path.replace(/^\//, '')}.html`);
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
}

function isNoindex(html: string): boolean {
  return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
}

function canonicalOf(html: string): string | null {
  const m = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(html);
  return m ? m[1] : null;
}

/** The absolute URL a (locale, route) pair carries in the sitemap. */
function urlFor(locale: Locale, route: string): string {
  const base = `https://${localeDomains[locale]}${publicPrefix(locale)}`;
  return route === '/' ? base : `${base}${route}`;
}

async function sitemapUrls(host: string): Promise<string[]> {
  const res = sitemapGET(new Request(`https://${host}/sitemap.xml`, { headers: { host } }));
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const built = builtPages();
  const hosts = [...new Set(liveLocales.map((l) => localeDomains[l]))];
  let failed = false;
  const summary: string[] = [];

  for (const host of hosts) {
    const locales = localesForDomain(host).filter((l) => localeStatus[l] === 'live');
    const listed = await sitemapUrls(host);
    const listedSet = new Set(listed);

    // Expected: every built, indexable, self-canonical page of the host's locales.
    const expected = new Map<string, string>(); // url → built path
    const skipped: string[] = [];
    for (const page of built.filter((p) => locales.includes(p.locale))) {
      const url = urlFor(page.locale, page.route);
      const html = builtHtml(page.path);
      if (html === null) {
        // Not an HTML page (a redirect-only route such as /training is
        // prerendered without a body) — it has no place in the sitemap.
        skipped.push(`${url} (no html)`);
        continue;
      }
      if (isNoindex(html)) {
        skipped.push(`${url} (noindex)`);
        continue;
      }
      const canonical = canonicalOf(html);
      if (canonical && canonical !== url) {
        skipped.push(`${url} (canonical → ${canonical})`);
        continue;
      }
      expected.set(url, page.path);
    }

    const missing = [...expected.keys()].filter((u) => !listedSet.has(u)).sort();
    const extra = listed.filter((u) => !expected.has(u)).sort();
    const dupes = listed.filter((u, i) => listed.indexOf(u) !== i);

    // Per-locale count: a URL belongs to the locale whose base is its LONGEST
    // matching prefix (stretchdecken.ch/fr/… is fr-ch, not ch).
    const localeOfUrl = (u: string): Locale | undefined =>
      [...locales]
        .sort((a, b) => urlFor(b, '/').length - urlFor(a, '/').length)
        .find((l) => u === urlFor(l, '/') || u.startsWith(urlFor(l, '/') + '/'));
    const perLocale = locales.map((l) => `${l}: ${listed.filter((u) => localeOfUrl(u) === l).length}`).join(', ');
    const ok = missing.length === 0 && extra.length === 0 && dupes.length === 0;
    summary.push(`${ok ? 'OK  ' : 'FAIL'} ${host.padEnd(22)} sitemap ${String(listed.length).padStart(4)} · built indexable ${String(expected.size).padStart(4)} · (${perLocale})${skipped.length ? ` · ${skipped.length} built pages rightly skipped` : ''}`);
    if (!ok) {
      failed = true;
      if (missing.length) console.error(`\n${host}: ${missing.length} built, indexable page(s) MISSING from the sitemap:\n  ${missing.join('\n  ')}`);
      if (extra.length) console.error(`\n${host}: ${extra.length} sitemap URL(s) that are NOT built pages (would 404):\n  ${extra.join('\n  ')}`);
      if (dupes.length) console.error(`\n${host}: duplicate <loc>:\n  ${[...new Set(dupes)].join('\n  ')}`);
    }
    if (process.env.CHECK_SITEMAP_VERBOSE && skipped.length) console.log(`${host}: skipped\n  ${skipped.join('\n  ')}`);
  }

  console.log('\nSitemap vs build, per host:');
  for (const line of summary) console.log('  ' + line);
  if (failed) {
    console.error('\ncheck-sitemap: FAILED — the sitemap and the build disagree (see above).');
    process.exit(1);
  }
  console.log('\ncheck-sitemap: every host lists exactly its built, indexable pages.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
