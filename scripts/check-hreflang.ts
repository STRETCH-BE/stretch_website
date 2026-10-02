#!/usr/bin/env tsx
// ============================================================================
// HREFLANG CHECK — the Swiss host's alternates, read from the build output.
//
//   npx tsx scripts/check-hreflang.ts            (runs in `postbuild` too)
//
// Reads the prerendered HTML of four stretchdecken.ch pages — /,
// /dealers/luzern, /products/pvc-stretch-ceiling and /fr/dealers/lausanne —
// straight from .next/server/app (no server needed) and asserts, for each:
//   • a self-referencing <link rel="canonical">,
//   • rel="alternate" hreflang entries for de-CH (the ch host), de-DE (the
//     .de host) and x-default (the en host) — plus fr-CH (the ch host under
//     /fr/) wherever the page exists on fr-CH (every page but the
//     German-Swiss place pages, which the Romandie locale does not carry —
//     and the mirror image for /fr/dealers/lausanne, which de-CH does not),
//   • de-AT pointing at EXACTLY the de-DE URL (stretchdecken.at redirects to
//     .de — one URL, two tags),
//   • every hreflang URL on the domain + public prefix the i18n config
//     declares for that locale, and no tag for a pending locale.
// Expected hosts come from src/i18n/config.ts, never from literals, so a
// NEXT_PUBLIC_DOMAIN_* override on a preview build cannot trip it. The tags
// of /dealers/luzern are printed in full. Exit code 1 on the first failure.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  localeDomains,
  localeFullCodes,
  localeStatus,
  liveLocales,
  publicPrefix,
  hreflangAliases,
  defaultLocale,
  type Locale,
} from '../src/i18n/config';
import { getDealerPlace, localesForPlace } from '../src/lib/dealers';

const NEXT = join(process.cwd(), '.next', 'server', 'app');

type Sample = { locale: Locale; route: string };
const SAMPLES: Sample[] = [
  { locale: 'ch', route: '/' },
  { locale: 'ch', route: '/dealers/luzern' },
  { locale: 'ch', route: '/products/pvc-stretch-ceiling' },
  { locale: 'fr-ch', route: '/dealers/lausanne' },
];

function urlFor(locale: Locale, route: string): string {
  const base = `https://${localeDomains[locale]}${publicPrefix(locale)}`;
  return route === '/' ? base : `${base}${route}`;
}

function htmlFor(s: Sample): string {
  const file = join(NEXT, s.locale, s.route === '/' ? '' : s.route.replace(/^\//, ''));
  const candidate = s.route === '/' ? join(NEXT, `${s.locale}.html`) : `${file}.html`;
  if (!existsSync(candidate)) {
    console.error(`check-hreflang: ${candidate} not found — run \`next build\` first.`);
    process.exit(2);
  }
  return readFileSync(candidate, 'utf8');
}

/** The locales a sample page exists on (its alternate set). */
function localesOf(s: Sample): Locale[] {
  const m = /^\/dealers\/([^/]+)$/.exec(s.route);
  if (m) {
    const place = getDealerPlace(m[1]);
    if (!place) throw new Error(`unknown place ${m[1]}`);
    return localesForPlace(place).filter((l) => localeStatus[l] === 'live');
  }
  return [...liveLocales];
}

function parse(html: string): { canonical: string | null; alternates: { lang: string; href: string }[]; tags: string[] } {
  const head = html.split('</head>')[0] ?? html;
  const tags = head.match(/<link[^>]+rel="(?:alternate|canonical)"[^>]*>/g) ?? [];
  const alternates: { lang: string; href: string }[] = [];
  let canonical: string | null = null;
  for (const tag of tags) {
    const rel = /rel="([^"]+)"/.exec(tag)?.[1];
    const href = /href="([^"]+)"/.exec(tag)?.[1] ?? '';
    const lang = /hrefLang="([^"]+)"|hreflang="([^"]+)"/i.exec(tag);
    if (rel === 'canonical') canonical = href;
    else if (rel === 'alternate' && lang) alternates.push({ lang: lang[1] ?? lang[2], href });
  }
  return { canonical, alternates, tags };
}

let failures = 0;
function expect(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error(`  ✗ ${msg}`);
  }
}

for (const s of SAMPLES) {
  const page = urlFor(s.locale, s.route);
  const { canonical, alternates, tags } = parse(htmlFor(s));
  const byLang = new Map(alternates.map((a) => [a.lang, a.href]));
  const on = localesOf(s);
  console.log(`\n${page}  (exists on: ${on.join(', ')})`);

  expect(canonical === page, `canonical should be self-referencing (${page}), got ${canonical}`);

  const want = (l: Locale) => {
    const code = localeFullCodes[l];
    const href = urlFor(l, s.route);
    expect(byLang.get(code) === href, `hreflang ${code} should be ${href}, got ${byLang.get(code) ?? '(absent)'}`);
  };
  // The four the review asked for: de-CH, fr-CH, de-DE, x-default — each
  // where the page exists on that locale, and provably absent where not.
  if (on.includes('fr-ch')) want('fr-ch');
  else expect(!byLang.has('fr-CH'), `fr-CH must be absent (page is not built on fr-ch), got ${byLang.get('fr-CH')}`);
  if (on.includes('ch')) want('ch');
  else expect(!byLang.has('de-CH'), `de-CH must be absent (page is not built on ch), got ${byLang.get('de-CH')}`);
  want('de');
  const xDefault = on.includes(defaultLocale) ? defaultLocale : on[0];
  expect(byLang.get('x-default') === urlFor(xDefault, s.route), `x-default should be ${urlFor(xDefault, s.route)}, got ${byLang.get('x-default') ?? '(absent)'}`);

  // de-AT (and any other alias) = the aliased locale's URL, byte for byte.
  for (const [tag, l] of Object.entries(hreflangAliases)) {
    if (on.includes(l)) expect(byLang.get(tag) === byLang.get(localeFullCodes[l]), `${tag} must equal ${localeFullCodes[l]} (${byLang.get(localeFullCodes[l])}), got ${byLang.get(tag) ?? '(absent)'}`);
    else expect(!byLang.has(tag), `${tag} must be absent when ${l} has no page`);
  }

  // Every live locale the page exists on has exactly its own-domain URL; no pending locale appears.
  for (const l of on) want(l);
  for (const l of Object.keys(localeDomains) as Locale[]) {
    if (localeStatus[l] !== 'live') expect(!byLang.has(localeFullCodes[l]), `${localeFullCodes[l]} is pending and must not be advertised`);
  }
  const expectedCount = on.length + Object.entries(hreflangAliases).filter(([, l]) => on.includes(l)).length + 1;
  expect(alternates.length === expectedCount, `expected ${expectedCount} alternate tags (${on.length} locales + aliases + x-default), got ${alternates.length}`);

  if (s.route === '/dealers/luzern' || process.env.CHECK_HREFLANG_VERBOSE) {
    console.log('  tags:');
    for (const t of tags) console.log(`    ${t}`);
  } else {
    console.log(`  ${alternates.length} alternates, canonical ${canonical}`);
  }
}

if (failures) {
  console.error(`\ncheck-hreflang: FAILED (${failures} assertion${failures === 1 ? '' : 's'}).`);
  process.exit(1);
}
console.log('\ncheck-hreflang: all four sample pages carry the expected canonical and hreflang set.');
