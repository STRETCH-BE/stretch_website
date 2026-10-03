# The price-guide hero (blog `spanplafond-prijs`)

The public price guide has no photo: its hero is the guide's own numbers set
as a typographic infographic — the €70–200 / m² headline and the five
per-type ranges as a bar chart — in the site's black / red / off-white
Archivo look. Because the picture carries text, there is **one JPG per
locale**:

```
public/images/blog/spanplafond-prijs.<locale>.jpg      2400×1200 (ratio 16/8)
```

`src/lib/content.ts` lists them through `imageByLocale: blogHeroByLocale('spanplafond-prijs', [...])`
and `localizeBlogPost(post, raw, locale)` resolves the locale's file into
`image`. Switzerland (`ch`, `fr-ch`) is not listed on purpose — `pricesPublished()`
hides the post there, and a locale without an entry shows the branded
placeholder rather than another market's figures. `npm test` runs
`scripts/check-blog-heroes.mjs`, which fails when a listed file is missing.

## Where the words and numbers come from

Nothing on the image is typed by hand twice:

| On the image | Source |
|---|---|
| Chart title | `messages/<locale>.json` → `blogPosts.posts.spanplafond-prijs.body[1].heading` |
| The five row labels | `messages/<locale>.json` → `priceCalculatorPage.types.*` |
| All figures | `src/lib/indicative-prices.ts` (EUR buckets; PLN buckets for `pl`) |
| Eyebrow (“Richtprijs · geplaatst · excl. btw”) and the unit | per-locale table in the script, in the article's own vocabulary |

The script checks every figure against `indicative-prices.ts` and stops if
they drifted — so when a bucket changes, update that file first, then the
`buckets` table in the script, then re-render.

## Re-rendering

Playwright is not a project dependency; install it alongside, never in
`package.json`:

```bash
npm i --no-save playwright && npx playwright install chromium
node scripts/blog-hero-price-guide.mjs          # all 14 locales
node scripts/blog-hero-price-guide.mjs pl is    # just some
```

Then look at the JPGs (the Polish one is the widest headline) and commit
them. Re-render whenever a bucket, a type label or the article's H2 for the
ranges changes in any locale.
