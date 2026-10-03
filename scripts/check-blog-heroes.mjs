// Asserts that every blog hero the app references exists under public/:
// each post's `image` and every entry of `imageByLocale`, and that each locale
// a post renders on resolves to an existing file. Exit 1 on any miss.
//   node scripts/check-blog-heroes.mjs
import { register } from 'node:module';
import { existsSync } from 'node:fs';

register('./ts-alias-hooks.mjs', import.meta.url);
const { blogPosts, blogPostsFor } = await import('../src/lib/content.ts');
const { locales } = await import('../src/i18n/config.ts');

const missing = [];
let checked = 0;
const exists = (src) => existsSync(new URL(`../public${src}`, import.meta.url));
for (const p of blogPosts) {
  const refs = [p.image, ...Object.values(p.imageByLocale ?? {})].filter(Boolean);
  for (const src of new Set(refs)) {
    checked++;
    if (!exists(src)) missing.push(`${p.slug}: ${src}`);
  }
}
let perLocale = 0;
for (const l of locales) {
  for (const p of blogPostsFor(l)) {
    const src = p.imageByLocale?.[l] ?? p.image;
    if (!src) continue;
    perLocale++;
    if (!exists(src)) missing.push(`${p.slug} on ${l}: ${src}`);
  }
}
const bare = blogPosts.filter((p) => !p.image && !p.imageByLocale).map((p) => p.slug);
console.log(`blog heroes: ${checked} files referenced, ${perLocale} (locale, post) heroes resolved, ${missing.length} missing`);
if (bare.length) console.log(`posts without a hero (placeholder tile): ${bare.join(', ')}`);
if (missing.length) {
  console.error(missing.map((m) => `  MISSING ${m}`).join('\n'));
  process.exit(1);
}
