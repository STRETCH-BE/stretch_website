# Typographic blog heroes (one JPG per locale)

Two guides have no photo that could carry them, so their hero is drawn from
the article's own content, in the site's black / red / off-white Archivo
look. Because the pictures carry text, there is **one JPG per locale**:

```
public/images/blog/<canonical slug>.<locale>.jpg      2400×1200 (ratio 16/8)
```

| Article | Script | Locales | What the picture is |
|---|---|---|---|
| `spanplafond-prijs` (price guide) | `scripts/blog-hero-price-guide.mjs` | 14 — not `ch`/`fr-ch` (`pricesPublished()` hides the post there) | €70–200 / m² headline + the five per-type ranges as a bar chart; Poland in PLN |
| `klimaat-plafond` (climate ceiling) | `scripts/blog-hero-klimaat-plafond.mjs` | all 16 | cross-section of the mechanism (slab, plenum with the air loop, profiles with integrated openings, membrane, the room tempered by convection and radiation) + "5–10 % less energy" + the article's "one plane, four functions, zero visible technology" |

`scripts/blog-hero-lib.mjs` is the shared frame (surface tone, Archivo subset
from `src/fonts`, red kicker + eyebrow, STRETCH® mark, rule, the 16/9-crop
safe area, the render loop). `src/lib/content.ts` lists the files through
`imageByLocale: blogHeroByLocale('<slug>'[, { by, except }])` and
`localizeBlogPost(post, raw, locale)` resolves the locale's file into `image`.
A locale without an entry shows the branded placeholder rather than another
market's words. `npm test` runs `scripts/check-blog-heroes.mjs`, which fails
when a listed file is missing.

## Where the words and numbers come from

Nothing on an image is typed by hand twice:

| On the image | Source |
|---|---|
| Price guide: chart title | `messages/<locale>.json` → `blogPosts.posts.spanplafond-prijs.body[1].heading` |
| Price guide: the five row labels | `messages/<locale>.json` → `priceCalculatorPage.types.*` |
| Price guide: all figures | `src/lib/indicative-prices.ts` (EUR buckets; PLN for `pl`) — the script refuses to render if they drifted |
| Climate ceiling: eyebrow | `blogPosts.posts.klimaat-plafond.body[1].heading` ("How it works behind the membrane") |
| Climate ceiling: tagline | last sentence of `body[3].paragraphs[0]` ("One plane, four functions, zero visible technology.") |
| Climate ceiling: 5–10 % | `body[2].paragraphs[0]` ("roughly five to ten percent less energy use …") |
| Short labels (eyebrow of the price guide, slab / plenum / profile / membrane …) | per-locale tables in the scripts, each word lifted from that locale's own article text or `priceCalculatorPage.disclaimer` |

## Re-rendering

Playwright is not a project dependency; install it alongside, never in
`package.json`:

```bash
npm i --no-save playwright && npx playwright install chromium
node scripts/blog-hero-price-guide.mjs             # 14 locales
node scripts/blog-hero-klimaat-plafond.mjs         # 16 locales
node scripts/blog-hero-klimaat-plafond.mjs pl is   # a subset
```

Look at the JPGs (Polish has the longest labels) and commit them. Re-render
whenever a figure, a type label or the quoted article wording changes in any
locale. A new typographic hero = a new recipe script on the same lib + a
`blogHeroByLocale()` line on its post.
