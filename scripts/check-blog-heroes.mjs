#!/usr/bin/env node
// BLOG — every hero a post points at must exist under public/. Catches a typo
// in an `image:` path or a missing locale file behind blogHeroByLocale() at
// `npm test` time instead of shipping the branded placeholder (or a 404 in
// next/image) to a visitor. Pure text scan of src/lib/content.ts — no TS
// toolchain needed, so it runs anywhere node runs.
//   node scripts/check-blog-heroes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Line comments dropped first: content.ts carries "// Hero: add image: '…' once
// the photo exists" notes that must not count as references.
const content = fs
  .readFileSync(path.join(repo, 'src/lib/content.ts'), 'utf8')
  .split('\n')
  .map((line) => line.replace(/(^|\s)\/\/.*$/, ''))
  .join('\n');
const config = fs.readFileSync(path.join(repo, 'src/i18n/config.ts'), 'utf8');

// Every locale key of src/i18n/config.ts (the default `on` of blogHeroByLocale).
const localesBlock = config.match(/export const locales = \[([\s\S]*?)\] as const;/);
if (!localesBlock) throw new Error('check-blog-heroes: could not read `locales` from src/i18n/config.ts');
const allLocales = [...localesBlock[1].matchAll(/'([a-z-]+)'/g)].map((m) => m[1]);

const wanted = new Map(); // public path → where it is referenced

// 1. Literal `image: '/images/blog/….jpg'` (and any other quoted /images/blog
//    path — not the template inside blogHeroByLocale itself).
for (const m of content.matchAll(/['"](\/images\/blog\/[^'"]+)['"]/g)) {
  wanted.set(m[1], 'literal');
}
// 2. blogHeroByLocale('<slug>'[, ['a', 'b', …]]) → <slug>.<locale>.jpg per locale.
for (const m of content.matchAll(/blogHeroByLocale\(\s*'([^']+)'\s*(?:,\s*\[([^\]]*)\])?\s*\)/g)) {
  const slug = m[1];
  const on = m[2] ? [...m[2].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]) : allLocales;
  if (on.length === 0) throw new Error(`check-blog-heroes: blogHeroByLocale('${slug}') lists no locales`);
  for (const l of on) wanted.set(`/images/blog/${slug}.${l}.jpg`, `blogHeroByLocale('${slug}') · ${l}`);
}

const missing = [...wanted].filter(([p]) => !fs.existsSync(path.join(repo, 'public', p)));
for (const [p, where] of missing) console.error(`MISSING public${p}  (${where})`);
console.log(`check-blog-heroes: ${wanted.size} hero files referenced, ${missing.length} missing`);
process.exit(missing.length ? 1 : 0);
