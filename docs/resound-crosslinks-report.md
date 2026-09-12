# Re-Sound cross-links — implementation report

Branch `seo/resound-crosslinks`, one commit per section; built and validated before the push, then merged to `main` for the production deployment on Michael's instruction ("push to production once finished"). Every link below is a normal followed anchor (no `nofollow`, no `sponsored`); the footer links carry `prefetch={false}` where they are internal. Locale codes are the site's market codes (`be` = nl-BE, `uk` = en-GB, `us` = en-US, `ch` = de-CH, `fr-ch` = fr-CH).

## Summary

| Section | Links to re-sound.be | Where |
|---|---|---|
| 1 · Footer STRETCH Group block | 16 (one per locale, on every page of that domain) | `src/components/layout/Footer.tsx` |
| 2 · Organization JSON-LD | `sameAs` entry (+ stretchmetal.pl, altodesign.pl) and `parentOrganization` STRETCH Group, emitted once in the root layout | `src/lib/structured-data.ts`, `src/app/[locale]/layout.tsx` |
| 3 · Acoustics pages | 4 (exactly one per page, in "what the ceiling cannot fix") | `src/lib/acoustics/*.ts`, `src/components/sections/AcousticsRoute.tsx` |
| 4 · Contextual links | 48 (product spec section, acoustics article, materials acoustic entry × 16 locales) | `SolutionPage.tsx`, `blog/[slug]/page.tsx`, `materials/[group]/page.tsx`, messages |

Re-Sound target per locale (`resoundLocaleFor` in `src/lib/site-config.ts`): be/nl → `/nl`, fr/fr-ch → `/fr`, de/ch → `/de`, es → `/es`, pt → `/pt`, every other locale (en, uk, us, da, sv, no, is, pl) → `/en`. The Nordic Re-Sound locales are `noindex`, so no Nordic domain links into them. Because re-sound.be is unreachable from the build sandbox, every link lands on the locale ROOT of re-sound.be; replace it with the matching range hub (wall panels / booths) once those URLs are confirmed — see "Open items".

## 1 · Footer — STRETCH Group block (every page, above the legal line)

| Locale | Source (every page of) | Anchor text → target |
|---|---|---|
| be | https://stretchplafond.be/* | `STRETCH — spanplafonds en wanden` → https://stretchplafond.be/ · `Re-Sound — akoestische panelen en belcabines` → https://re-sound.be/nl · `Stretch Metal — metaalbewerking` → https://stretchmetal.pl · `Alto Design — productie Polen` → https://altodesign.pl |
| nl | https://stretchplafond.nl/* | `STRETCH — spanplafonds en wanden` → https://stretchplafond.nl/ · `Re-Sound — akoestische panelen en belcabines` → https://re-sound.be/nl · `Stretch Metal — metaalbewerking` → https://stretchmetal.pl · `Alto Design — productie Polen` → https://altodesign.pl |
| fr | https://stretchplafond.fr/* | `STRETCH — plafonds et murs tendus` → https://stretchplafond.fr/ · `Re-Sound — panneaux acoustiques et cabines acoustiques` → https://re-sound.be/fr · `Stretch Metal — métallerie` → https://stretchmetal.pl · `Alto Design — production, Pologne` → https://altodesign.pl |
| de | https://stretchdecken.de/* | `STRETCH — Spanndecken und Spannwände` → https://stretchdecken.de/ · `Re-Sound — Akustikpaneele und Telefonboxen` → https://re-sound.be/de · `Stretch Metal — Metallverarbeitung` → https://stretchmetal.pl · `Alto Design — Produktion, Polen` → https://altodesign.pl |
| ch (generated from de) | https://stretchdecken.ch/* | `STRETCH — Spanndecken und Spannwände` → https://stretchdecken.ch/ · `Re-Sound — Akustikpaneele und Telefonboxen` → https://re-sound.be/de · `Stretch Metal — Metallverarbeitung` → https://stretchmetal.pl · `Alto Design — Produktion, Polen` → https://altodesign.pl |
| fr-ch (generated from fr) | https://stretchdecken.ch/fr/* | `STRETCH — plafonds et murs tendus` → https://stretchdecken.ch/fr/ · `Re-Sound — panneaux acoustiques et cabines acoustiques` → https://re-sound.be/fr · `Stretch Metal — métallerie` → https://stretchmetal.pl · `Alto Design — production, Pologne` → https://altodesign.pl |
| en | https://stretch.mt/* | `STRETCH — stretch ceilings and walls` → https://stretch.mt/ · `Re-Sound — acoustic panels and phone booths` → https://re-sound.be/en · `Stretch Metal — metalworking` → https://stretchmetal.pl · `Alto Design — production, Poland` → https://altodesign.pl |
| uk | https://stretch-ceilings.uk/* | `STRETCH — stretch ceilings and walls` → https://stretch-ceilings.uk/ · `Re-Sound — acoustic panels and phone booths` → https://re-sound.be/en · `Stretch Metal — metalworking` → https://stretchmetal.pl · `Alto Design — production, Poland` → https://altodesign.pl |
| us | https://stretchceiling.us/* | `STRETCH — stretch ceilings and walls` → https://stretchceiling.us/ · `Re-Sound — acoustic panels and phone booths` → https://re-sound.be/en · `Stretch Metal — metalworking` → https://stretchmetal.pl · `Alto Design — production, Poland` → https://altodesign.pl |
| es | https://stretchtecho.es/* | `STRETCH — techos y paredes tensados` → https://stretchtecho.es/ · `Re-Sound — paneles acústicos y cabinas acústicas` → https://re-sound.be/es · `Stretch Metal — trabajo del metal` → https://stretchmetal.pl · `Alto Design — producción, Polonia` → https://altodesign.pl |
| pt | https://stretchteto.pt/* | `STRETCH — tetos e paredes tensionados` → https://stretchteto.pt/ · `Re-Sound — painéis acústicos e cabines acústicas` → https://re-sound.be/pt · `Stretch Metal — metalomecânica` → https://stretchmetal.pl · `Alto Design — produção, Polónia` → https://altodesign.pl |
| pl | https://stretch-sufit.pl/* | `STRETCH — sufity napinane i ściany` → https://stretch-sufit.pl/ · `Re-Sound — panele akustyczne i budki akustyczne` → https://re-sound.be/en · `Stretch Metal — obróbka metali` → https://stretchmetal.pl · `Alto Design — produkcja, Polska` → https://altodesign.pl |
| da | https://straekloft.dk/* | `STRETCH — strækloft og vægge` → https://straekloft.dk/ · `Re-Sound — akustikpaneler og telefonbokse` → https://re-sound.be/en · `Stretch Metal — metalbearbejdning` → https://stretchmetal.pl · `Alto Design — produktion, Polen` → https://altodesign.pl |
| sv | https://stretchceilings.se/* | `STRETCH — spänntak och väggar` → https://stretchceilings.se/ · `Re-Sound — akustikpaneler och telefonbås` → https://re-sound.be/en · `Stretch Metal — metallbearbetning` → https://stretchmetal.pl · `Alto Design — produktion, Polen` → https://altodesign.pl |
| no | https://stretchtak.no/* | `STRETCH — strekktak og vegger` → https://stretchtak.no/ · `Re-Sound — akustikkpaneler og telefonbokser` → https://re-sound.be/en · `Stretch Metal — metallbearbeiding` → https://stretchmetal.pl · `Alto Design — produksjon, Polen` → https://altodesign.pl |
| is | https://stretch.is/* | `STRETCH — dúkaloft og veggir` → https://stretch.is/ · `Re-Sound — hljóðdeyfiplötur og símaklefar` → https://re-sound.be/en · `Stretch Metal — málmvinnsla` → https://stretchmetal.pl · `Alto Design — framleiðsla, Pólland` → https://altodesign.pl |

Heading of the block: `footer.group.heading` = "STRETCH Group" in every locale (`aria-label` of the `<nav>`). Parity: `footer.group.{heading,stretch,resound,metal,alto}` present in all 16 message files; `ch.json`/`fr-ch.json` regenerated with the overlay scripts.

## 2 · Organization JSON-LD

- `parentOrganization`: `{ "@type": "Organization", "name": "STRETCH Group", "url": "https://stretchgroup.be" }`.
- `sameAs`: the social profiles plus `https://re-sound.be`, `https://stretchmetal.pl`, `https://altodesign.pl`.
- Emitted ONCE per page from `src/app/[locale]/layout.tsx`; the per-page copies on the home and about pages were removed, so no page carries the Organization node twice.

## 3 · Acoustics pages (be, nl, fr, de)

Own written content per market (`src/lib/acoustics/<locale>.ts`): norms, vocabulary, worked example, FAQ and combined-project block differ per market; nothing is shared or translated. Locales without a written version have no page (404 via `dynamicParams = false`), no nav entry, no sitemap URL and no hreflang alternate. The slug per locale lives in `src/lib/page-slugs.json`, read by the app and by `redirects.mjs` (another market's slug on a domain that has the page 308s to its own slug; a domain without the page sends the three slugs to `/products/acoustic-stretch-system`).

| Locale | URL | H1 | Re-Sound link (section "what the ceiling cannot fix") | Internal links |
|---|---|---|---|---|
| be | https://stretchplafond.be/akoestiek | Hoe verminder ik de nagalm in mijn leslokaal of kantoor? | `akoestische wandpanelen en belcabines van Re-Sound` → https://re-sound.be/nl | `Acoustic Stretch System` → https://stretchplafond.be/products/acoustic-stretch-system (ceiling section) · CTA to the on-site quote form (`source=acoustics_page`) · breadcrumb Home / Solutions |
| nl | https://stretchplafond.nl/akoestiek | Galm in de kantoortuin: hoeveel haalt een akoestisch plafond eraf? | `de akoestische wandpanelen en focusruimtes van Re-Sound` → https://re-sound.be/nl | `Acoustic Stretch System` → https://stretchplafond.nl/products/acoustic-stretch-system (ceiling section) · CTA to the on-site quote form (`source=acoustics_page`) · breadcrumb Home / Solutions |
| fr | https://stretchplafond.fr/acoustique | Comment réduire la réverbération d'une pièce avec un plafond acoustique ? | `panneaux muraux acoustiques et cabines acoustiques Re-Sound` → https://re-sound.be/fr | `Acoustic Stretch System` → https://stretchplafond.fr/products/acoustic-stretch-system (ceiling section) · CTA to the on-site quote form (`source=acoustics_page`) · breadcrumb Home / Solutions |
| de | https://stretchdecken.de/akustik | Was hilft wirklich gegen Nachhall im Raum? | `Akustikpaneele für Wände und Telefonboxen von Re-Sound` → https://re-sound.be/de | `Acoustic Stretch System` → https://stretchdecken.de/products/acoustic-stretch-system (ceiling section) · CTA to the on-site quote form (`source=acoustics_page`) · breadcrumb Home / Solutions |

Structured data per page: `BreadcrumbList` (Home → Solutions → page) and `FAQPage` (4–5 questions, ≤ 80 words each). Sabine example: `T = 0,161 · V / A`, computed by the route from the market's own room so the printed arithmetic cannot drift from the prose; the German page also prints the DIN 18041 A3 target `T_soll = 0,32 · lg(V) − 0,17`.

Navigation and discovery:

- Mega menu → Solutions → Acoustic: appended item (`megaMenu.solutions.cats.1.items.3`, label present in all 16 files) rendered only where `hasAcoustics(locale)`.
- Mobile drawer: link under "All solutions" (`common.nav.acoustics`), same gate.
- Language switcher / footer worldwide links: `pathForLocale` maps the page to the target locale's own slug, or to the acoustic product on locales without it.
- Sitemap: the page is listed on its four domains only, each with hreflang alternates naming the other three locales' own slugs (x-default = nl-BE, the first live locale of the set).

## 4 · Contextual links from existing pages

Three placements, each with its own anchor per locale (never the bare brand name, never the same anchor twice on a domain):

| Locale | Product page (end of spec section) | Acoustics article (body, wall-treatment section) | Materials — acoustic panels entry |
|---|---|---|---|
| be | `akoestische wandpanelen van Re-Sound` → https://re-sound.be/nl <br>from https://stretchplafond.be/products/acoustic-stretch-system | `belcabines voor open kantoren` → https://re-sound.be/nl <br>from https://stretchplafond.be/blog/stretch-ceiling-acoustics-explained | `wandabsorbers en eilanden van Re-Sound` → https://re-sound.be/nl <br>from https://stretchplafond.be/materials/acoustic-panels |
| nl | `wandpanelen en telefooncellen van Re-Sound` → https://re-sound.be/nl <br>from https://stretchplafond.nl/products/acoustic-stretch-system | `concentratiecabines voor de kantoortuin` → https://re-sound.be/nl <br>from https://stretchplafond.nl/blog/stretch-ceiling-acoustics-explained | `akoestische wandabsorbers van Re-Sound` → https://re-sound.be/nl <br>from https://stretchplafond.nl/materials/acoustic-panels |
| fr | `panneaux muraux acoustiques de Re-Sound` → https://re-sound.be/fr <br>from https://stretchplafond.fr/products/acoustic-stretch-system | `cabines acoustiques pour open space` → https://re-sound.be/fr <br>from https://stretchplafond.fr/blog/acoustique-des-plafonds-tendus | `absorbeurs muraux et îlots acoustiques Re-Sound` → https://re-sound.be/fr <br>from https://stretchplafond.fr/materials/acoustic-panels |
| de | `Akustikpaneele für Wände von Re-Sound` → https://re-sound.be/de <br>from https://stretchdecken.de/products/acoustic-stretch-system | `Telefonboxen für das Großraumbüro` → https://re-sound.be/de <br>from https://stretchdecken.de/blog/spanndecken-akustik-erklaert | `Wandabsorber und Deckensegel von Re-Sound` → https://re-sound.be/de <br>from https://stretchdecken.de/materials/acoustic-panels |
| ch (generated from de) | `Akustikpaneele für Wände von Re-Sound` → https://re-sound.be/de <br>from https://stretchdecken.ch/products/acoustic-stretch-system | `Telefonboxen für das Großraumbüro` → https://re-sound.be/de <br>from https://stretchdecken.ch/blog/spanndecken-akustik-erklaert | `Wandabsorber und Deckensegel von Re-Sound` → https://re-sound.be/de <br>from https://stretchdecken.ch/materials/acoustic-panels |
| fr-ch (generated from fr) | `panneaux muraux acoustiques de Re-Sound` → https://re-sound.be/fr <br>from https://stretchdecken.ch/fr/products/acoustic-stretch-system | `cabines acoustiques pour open space` → https://re-sound.be/fr <br>from https://stretchdecken.ch/fr/blog/acoustique-des-plafonds-tendus | `absorbeurs muraux et îlots acoustiques Re-Sound` → https://re-sound.be/fr <br>from https://stretchdecken.ch/fr/materials/acoustic-panels |
| en | `acoustic wall panels from Re-Sound` → https://re-sound.be/en <br>from https://stretch.mt/products/acoustic-stretch-system | `phone booths for open-plan offices` → https://re-sound.be/en <br>from https://stretch.mt/blog/stretch-ceiling-acoustics-explained | `wall absorbers and ceiling islands by Re-Sound` → https://re-sound.be/en <br>from https://stretch.mt/materials/acoustic-panels |
| uk | `Re-Sound acoustic wall panels` → https://re-sound.be/en <br>from https://stretch-ceilings.uk/products/acoustic-stretch-system | `acoustic phone booths for open-plan offices` → https://re-sound.be/en <br>from https://stretch-ceilings.uk/blog/stretch-ceiling-acoustics-explained | `wall absorbers and ceiling rafts from Re-Sound` → https://re-sound.be/en <br>from https://stretch-ceilings.uk/materials/acoustic-panels |
| us | `sound-absorbing wall panels from Re-Sound` → https://re-sound.be/en <br>from https://stretchceiling.us/products/acoustic-stretch-system | `phone booths for open offices` → https://re-sound.be/en <br>from https://stretchceiling.us/blog/stretch-ceiling-acoustics-explained | `wall absorbers and ceiling clouds by Re-Sound` → https://re-sound.be/en <br>from https://stretchceiling.us/materials/acoustic-panels |
| es | `paneles acústicos de pared de Re-Sound` → https://re-sound.be/es <br>from https://stretchtecho.es/products/acoustic-stretch-system | `cabinas acústicas para oficinas abiertas` → https://re-sound.be/es <br>from https://stretchtecho.es/blog/acustica-del-techo-tensado-explicada | `absorbentes de pared e islas acústicas de Re-Sound` → https://re-sound.be/es <br>from https://stretchtecho.es/materials/acoustic-panels |
| pt | `painéis acústicos de parede da Re-Sound` → https://re-sound.be/pt <br>from https://stretchteto.pt/products/acoustic-stretch-system | `cabines acústicas para escritórios abertos` → https://re-sound.be/pt <br>from https://stretchteto.pt/blog/acustica-tetos-tensionados-explicada | `absorsores de parede e ilhas acústicas da Re-Sound` → https://re-sound.be/pt <br>from https://stretchteto.pt/materials/acoustic-panels |
| pl | `Panele akustyczne ścienne Re-Sound` → https://re-sound.be/en <br>from https://stretch-sufit.pl/products/acoustic-stretch-system | `budki akustyczne do biur open space` → https://re-sound.be/en <br>from https://stretch-sufit.pl/blog/akustyka-sufitow-napinanych | `absorbery ścienne i wyspy sufitowe Re-Sound` → https://re-sound.be/en <br>from https://stretch-sufit.pl/materials/acoustic-panels |
| da | `Akustiske vægpaneler fra Re-Sound` → https://re-sound.be/en <br>from https://straekloft.dk/products/acoustic-stretch-system | `telefonbokse til storrumskontorer` → https://re-sound.be/en <br>from https://straekloft.dk/blog/akustik-i-straekloft-forklaret | `vægabsorbenter og loftsøer fra Re-Sound` → https://re-sound.be/en <br>from https://straekloft.dk/materials/acoustic-panels |
| sv | `Akustiska väggpaneler från Re-Sound` → https://re-sound.be/en <br>from https://stretchceilings.se/products/acoustic-stretch-system | `telefonbås för öppna kontorslandskap` → https://re-sound.be/en <br>from https://stretchceilings.se/blog/spanntak-akustik-forklarat | `väggabsorbenter och taköar från Re-Sound` → https://re-sound.be/en <br>from https://stretchceilings.se/materials/acoustic-panels |
| no | `Akustiske veggpaneler fra Re-Sound` → https://re-sound.be/en <br>from https://stretchtak.no/products/acoustic-stretch-system | `telefonbokser for åpne kontorlandskap` → https://re-sound.be/en <br>from https://stretchtak.no/blog/strekktak-akustikk-forklart | `veggabsorbenter og takøyer fra Re-Sound` → https://re-sound.be/en <br>from https://stretchtak.no/materials/acoustic-panels |
| is | `Hljóðdeyfiplötur á veggi frá Re-Sound` → https://re-sound.be/en <br>from https://stretch.is/products/acoustic-stretch-system | `símaklefar fyrir opin skrifstofurými` → https://re-sound.be/en <br>from https://stretch.is/blog/hljodvist-dukalofta-einfold-skyring | `veggdeyfar og loftseyjar frá Re-Sound` → https://re-sound.be/en <br>from https://stretch.is/materials/acoustic-panels |

Mechanics: the product and materials sentences are `productPage.acousticWall{Before,Link,After}` / `materials.acousticResound{Before,Link,After}` keys composed in JSX around `resoundUrlFor(locale)`; the article gets one extra paragraph plus a `links` row whose href is the `resound:` marker, resolved per locale by the blog route. The article's `dateModified`, `productsUpdatedAt` and `materialsUpdatedAt` were bumped so the sitemap `<lastmod>` values move.

## 5 · Recommended links back from re-sound.be

Re-Sound currently links to STRETCH nowhere in its body copy. The pages below are the ones worth a contextual link from Re-Sound, in the matching Re-Sound locale, with a descriptive anchor (vary them per page, never a bare "STRETCH"):

| Re-Sound locale | Link to | Suggested anchor | Where on re-sound.be |
|---|---|---|---|
| /nl | https://stretchplafond.be/akoestiek | `akoestisch spanplafond van STRETCH` | wandpanelen range page, paragraph on "ceiling first" |
| /nl | https://stretchplafond.nl/akoestiek | `nagalmtijd verlagen met een akoestisch plafond` | kantoorakoestiek / kantoortuin article (Dutch market) |
| /nl | https://stretchplafond.be/products/acoustic-stretch-system | `akoestisch spanplafond tot absorptieklasse A` | product comparison / "when panels are not enough" |
| /fr | https://stretchplafond.fr/acoustique | `plafond tendu acoustique et temps de réverbération` | page panneaux muraux, paragraphe "le plafond d'abord" |
| /fr | https://stretchplafond.fr/products/acoustic-stretch-system | `plafond tendu acoustique classe A de STRETCH` | cabines acoustiques page, section projets combinés |
| /de | https://stretchdecken.de/akustik | `Nachhallzeit nach DIN 18041 mit einer Akustik-Spanndecke` | Akustikpaneele range page, "Decke zuerst" paragraph |
| /de | https://stretchdecken.de/products/acoustic-stretch-system | `Akustik-Spanndecke bis Schallabsorptionsklasse A` | Telefonboxen page, combined-project block |
| /en | https://stretch.mt/products/acoustic-stretch-system | `acoustic stretch ceilings up to Class A absorption` | wall panels range page (until the English acoustics guide exists) |
| /en | https://stretch.mt/blog/stretch-ceiling-acoustics-explained | `how an acoustic stretch ceiling works` | acoustics knowledge article |
| /es | https://stretchtecho.es/products/acoustic-stretch-system | `techo tensado acústico de STRETCH` | página de paneles acústicos |
| /pt | https://stretchteto.pt/products/acoustic-stretch-system | `teto tensado acústico da STRETCH` | página de painéis acústicos (domain pending DNS — link only once stretchteto.pt is live) |
| all | https://stretchgroup.be | `STRETCH Group` | footer group block on re-sound.be, mirroring this site's block |

Also worth mirroring on re-sound.be: the same Organization JSON-LD shape (`parentOrganization` STRETCH Group, `sameAs` listing the STRETCH ceiling domains) so both sites describe one group entity.

## 6 · Validation

- `npx --offline tsc --noEmit`: clean (exit 0).
- `rm -rf .next && npx --offline next build`: exit 0, 3190 static pages (3186 before + the four acoustics pages); `grep -c MISSING_MESSAGE` = 0, `grep -ci fail` = 0, no error lines beyond the framework's own error routes.
- Locale parity (`grep -l ... messages/*.json | wc -l` = 16) for every new key: `footer.group.*`, `common.nav.acoustics`, `megaMenu.solutions.cats.1.items.3`, `productPage.acousticWall*`, `materials.acousticResound*`, and the article's new paragraph + `links` row.
- `node scripts/ch-overlay.mjs --check` and `node scripts/fr-ch-overlay.mjs --check`: up to date (ch.json and fr-ch.json regenerated, never hand-edited).
- `npm run check:client-messages`: OK — every client namespace is shipped.
- On `next start` with Host headers: the guide answers 200 on stretchplafond.be, stretchplafond.nl, stretchplafond.fr and stretchdecken.de and 404 on every other domain; each domain's sitemap lists the page once with the four-locale hreflang cluster (x-default nl-BE) and stretch.mt / stretchdecken.ch list nothing; a foreign slug 308s to the host's own slug (e.g. .be/akustik → /akoestiek) and to /products/acoustic-stretch-system on domains without the page (incl. stretchdecken.ch/fr/…).
- Playwright: mega-menu Acoustic category shows the guide item on .be and .de only (not on stretch.mt or stretchdecken.ch), the mobile drawer likewise; no horizontal overflow on the four pages at 360 px and 390 px.
- Every page carries exactly one in-body Re-Sound link (plus the footer one); the three contextual links resolve to /nl, /fr, /de, /en per domain (checked on .be, .de, .ch, .dk, .pl, stretch.mt).
- Lighthouse 12.8 mobile, local throttled, homepage nl-BE served with the Host header, baseline = origin/main build on port 3080 interleaved with this branch on 3081, 8 runs each: performance median 94.5 (main: 97, 94, 98, 94, 93, 94, 95, 97) vs 94.5 (branch: 91, 96, 94, 94, 94, 96, 98, 95) — no regression; the new /akoestiek page 95, 97, 95 (median 95); accessibility, best-practices and SEO 100 on every run. Deterministic cross-check: the home route's client JS is identical in size in both builds (10 files, 424.0 kB), same script and JSON-LD counts; the served HTML grew 1.7 kB for the four footer links.

## Open items

- re-sound.be could not be fetched from the build sandbox (proxy refuses the host), so no range-hub URL (wall panels, booths) could be verified. Every link targets the locale root `https://re-sound.be/<locale>`; swap in the hub paths once confirmed — the targets are centralised in `resoundUrlFor(locale, path)` (footer, product, materials), the `resound:` marker (article) and the four content modules (acoustics pages).
- Markets without an acoustics page this sprint: ch, fr-ch (Swiss norms framing: DIN 18041 in practice, SIA 181 for insulation), en/uk/us (`/acoustics`), es/pt (`/acustica`), da/sv/no/is/pl. Reserved slugs are documented in `src/lib/page-slugs.ts`. Add a market by writing `src/lib/acoustics/<locale>.ts` and one line in `page-slugs.json` — nav, sitemap, hreflang, switcher and redirects follow automatically.
- Optional: `hrefLang` attribute on the footer Re-Sound anchor (`resoundLocaleFor[locale]`) — cosmetic for crawlers, not required.
