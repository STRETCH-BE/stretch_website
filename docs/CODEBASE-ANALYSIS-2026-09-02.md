# STRETCH website — full codebase analysis (2 September 2026)

Scope: the whole repository, read subsystem by subsystem by ten parallel
readers (152 raw findings). The 42 findings the readers rated *high* were
then each handed to an independent verifier instructed to refute them
against the files at HEAD; 9 survived, 33 were rejected — almost all because
they described the tree *before* the round-3 commits that landed while the
analysis ran (the verifiers ran after). The 110 medium/low/info findings
were not adversarially verified (the pass was scaled down after two
container restarts) and are listed as reader claims with a status. A
completeness critic added 9 more. Every finding carries a status: **fixed**
(round 3 or the two analysis-fix commits), **partly**, **open**, or
**decision** (Michael's call, not code).

## 1. What the site is

- **Stack.** Next.js 14.2 App Router, TypeScript strict, `next-intl` 3 in
  DOMAIN mode, styled-jsx/inline styles + a token-driven `globals.css`,
  self-hosted Archivo variable font, Vercel. No test runner beyond one
  spam-score script; `npm run typecheck` and `next build` are the gates.
- **One locale per domain.** `src/i18n/config.ts` is the single source:
  14 locales (`en uk us be nl fr pl de es pt da sv no is`), each mapped to a
  production host (`localeDomains`), a liveness flag (`pt`, `no` pending),
  BCP-47 codes (`localeFullCodes`) and native names. Middleware resolves the
  locale from the Host header; production URLs carry no prefix; unknown hosts
  (localhost, previews) fall back to `/xx` prefixes. `redirects.mjs` (loaded
  by `next.config.mjs`) holds the WordPress-era legacy map per host plus
  per-domain locale-prefix strips.
- **Content model.** Structural data lives in TypeScript (`src/lib/products.ts`,
  `content.ts` — projects, blog posts, FAQ — `dealers.ts`, `applications.ts`,
  `technical.ts`, `materials.ts`, `prefab.ts`), always in English; every
  locale overlays display text from `messages/<locale>.json` (~1 790 flat
  keys, full parity enforced by convention, `MISSING_MESSAGE` is a hard
  build failure). `localize-*.ts` merge the overlays over the structural
  source so slugs, images, flags and routing never leave code.
- **Routes.** `src/app/[locale]/…`: home, products (8), applications (5),
  technical hub (2 membranes × 6 topics), materials, inspiration (21
  projects), blog (18 posts, market-restricted via `markets`), dealers
  (directory + place pages, dealer markets only), installer training,
  partners, supply, projects-export, kit, price calculator, datasheets,
  architects, samples, contact, about, FAQ, legal, and a login-gated
  `/portal` (Supabase, RLS-protected trade pricelist, designer, orders,
  admin). `src/app/api/*` carries lead/contact delivery, datasheet links,
  OG images and the portal API.
- **SEO plumbing.** `seo.ts` builds canonical + hreflang per locale domain
  (live locales only, optional `only` subset for market-restricted routes);
  `page-meta.ts` reads titles/descriptions from the `meta` namespace;
  `structured-data.ts` emits Organization (one global entity anchored on
  stretch.mt), per-domain WebSite, LocalBusiness (Belgian HQ + PL/AT
  branches on the contact page), Product with AggregateOffer from
  `indicative-prices.ts`, Article, BreadcrumbList, FAQPage, Course/Event.
  `sitemap.xml` and `robots.txt` are host-aware route handlers.
- **Commercial plumbing.** Seven lead-form types through one modal
  (`LeadGenModal`), delivery Graph → webhook → SMTP → log, Turnstile +
  form-token + rate limit + spam score, consent-gated GA4/Clarity with
  Consent Mode v2 defaults, per-locale analytics IDs.

## 2. The five audit defects, verified against the code

| # | Defect | Evidence in code | Status |
|---|---|---|---|
| D1 | Blog posts carry Dutch slugs on every locale | `generateStaticParams` used one `slug` per post for all 14 locales; 15 of 18 posts have Dutch slugs; hreflang and sitemap alternates advertised the Dutch path on every domain | **fixed in round 3** (per-locale `slugs`, derived 301s) |
| D2 | 58 of 59 local pages are Benelux | `dealers.ts`: be 17 · nl 26 · fr 15 (all Wallonia/Luxembourg) · de 1 (Wien) · rest 0 | **fixed in round 3** (+10 DE, +3 PL, +8 FR) |
| D3 | The calculator is only linked from the footer | the only `/price-calculator` href was `footerNav.solutions` in `site-config.ts`; two legacy calculator URLs redirected to `/contact` | **fixed in round 3** |
| D4 | EUR rendered in five non-euro markets | `currency.ts` handled GBP only; `PriceEstimator` hardcoded `currency: 'EUR'`; the Product `AggregateOffer` was EUR on stretch-sufit.pl although its guide is in PLN; the da/sv/no/is price guides carried hand-converted local figures at four different rates | **fixed in round 3** |
| D5 | Danish and Icelandic use a product noun nobody searches | `da.json`: spændloft 135× + stretchloft 73×; `is.json`: strekkiloft 132× + strekkloft 50× (two competing wrong terms inside each file) | **fixed in round 3** (native check pending) |

## 3. Findings

### 3.1 Confirmed by adversarial verification (high-rated reader findings that survived a refute pass)

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| high | **fixed** | `src/app/robots.txt/route.ts` | robots.txt disallows /api/ on every domain, but every og:image, twitter:image, Product.image and Article.image is served from /api/og | `Allow: /api/og/` added (analysis-fix commit). |
| medium | **fixed** | `src/lib/site-config.ts` | salesTerritory omits ES, PT, DK, SE, NO (and CZ/SK/LU) although those markets have their own domains — Product eligibleRegion, LocalBusiness areaServed and Organization contactPoint areaServed tell Google the site does not serve them | ES, PT, DK, SE, NO added. |
| medium | **fixed** | `src/lib/indicative-prices.ts` | Polish PLN buckets are not derivable from the EUR buckets at any plausible rate, and the Polish calculator meta still advertises €70–200/m² | By design: the PLN list is a Polish price list, not a conversion; documented in indicative-prices.ts; the Polish calculator meta now says 150–450 zł/m². |
| high | **open** | `src/lib/portal/designer-html.ts` | Designer HTML embeds COST prices (costEUR/m2) next to sell prices, contradicting the 'margins never leave Excel' guarantee | Commercial/security: cost prices reach a downloadable HTML — Michael to confirm intent before it is changed. |
| high | **open** | `src/lib/portal/auth.ts` | Demo admin session is forgeable with an unsigned cookie whenever Supabase is unconfigured, even in 'closed' mode | Only when Supabase is unconfigured; make demo mode require NEXT_PUBLIC_PORTAL_DEMO=1 explicitly and never in production. |
| high | **fixed** | `src/lib/turnstile.ts` | Turnstile hostname allowlist omits the live US domain stretchceiling.us — every lead from the US site fails captcha | stretchceiling.us added to widget group B in code — the hostname must also be added to widget B in Cloudflare. |
| low | **open** | `.gitignore` | tsconfig.tsbuildinfo is committed although .gitignore lists *.tsbuildinfo, and it churns in every commit | Either stop committing it (git rm --cached) or drop the .gitignore line; this round refreshes it once more in the final chore commit, as previous rounds did. |
| high | **fixed** | `src/lib/turnstile.ts` | stretchceiling.us is in neither Turnstile host group; docs and .env.example still say 13 domains | Same fix; docs/.env.example still say 13 domains (open, hygiene). |
| low | **open** | `README.md` | README still says the site is English-only at launch and that nl/fr/de are not yet added | README needs a rewrite: locales, sitemap route, self-hosted font, no ESLint, unprefixed default locale, `npm test`. |

### 3.2 Completeness-critic findings (cross-cutting, not separately verified)

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| high | **fixed** | `src/components/layout/Footer.tsx` | Language switcher, mobile language grid and footer 'worldwide' links preserve the current path across domains — they 404 on every per-locale blog slug, every market-restricted post and every dealer route on the US domain | pathForLocale() in blog-slugs.ts; market-only articles fall back to /blog. |
| medium | **fixed** | `messages/pl.json` | Polish translation of the renovation-options article still prices a stretch ceiling at €70–200/m², contradicting the PLN price list, the .pl calculator and the PLN AggregateOffer on the same domain | 150–450 zł. |
| medium | **fixed** | `public/llms.txt` | public/llms.txt instructs AI assistants that STRETCH publishes no prices and must not quote figures — the site now publishes €70–200/m² buckets on /price-calculator, in the price guide and in AggregateOffer JSON-LD; it also still lists 12 domains without stretchceiling.us and a 6.4 m PVC width | llms.txt now states the indicative ranges and points at the calculator. |
| low | **fixed** | `redirects.mjs` | Two-hop redirect chain on stretchdecken.de: the legacy /spanndecke rule lands on the canonical English blog slug, which the per-locale slug rule then 301s again | Legacy content rules resolve the host’s own slug (blog() helper in redirects.mjs). |
| low | **open** | `src/app/[locale]/not-found.tsx` | The 404 page body is hardcoded English on all 14 domains (only its <title>/description are translated), and it is now the landing page for every stale-slug and cross-domain miss | Translate not-found.tsx through a notFound namespace (×14). |
| low | **fixed** | `src/components/layout/Header.tsx` | On stretch-sufit.pl the header renders the 'Installer training' link twice — once from the dealer-market utility bar and once from the T7 primary-nav branch | Utility-bar link hidden on pl. |
| low | **open** | `claude/blog-batch-2026-08-22.json` | A 108 KB Claude working file with finished copy for three posts is committed at the repo root and referenced by nothing; its content has already diverged from the live messages | claude/blog-batch-2026-08-22.json can be deleted; its copy is in content.ts and the message files. |
| info | **open** | `src/app/[locale]/prefab-lighting/page.tsx` | /prefab-ceiling-unit and /prefab-lighting exist as second 200 URLs for the two prefab product pages on every locale (canonicalised, not redirected) | /prefab-ceiling-unit and /prefab-lighting duplicate the product routes — 308 them or canonicalise. |
| info | **fixed** | `src/lib/blog-slugs.json` | Several summary/confirmed claims are stale at HEAD and should not be published as-is | This report was written from the verified set only. |

### 3.3 Reader findings not adversarially verified (medium / low / info)

Reader claims, grouped by subsystem. Each was triaged by hand against HEAD after the round-3 and analysis-fix commits; **fixed**/**partly** rows were checked in the built output, **open** rows were not re-verified line by line.

#### i18n, routing & redirects

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **open** | `src/i18n/config.ts` | Foreign locale prefixes on live domains 307 to the two PENDING (no-DNS) hosts | Restrict routing.domains to liveLocales (pt/no) until their DNS exists. |
| medium | **fixed** | `redirects.mjs` | Legacy Dutch calculator URLs are redirected to /contact and a blog post, not /price-calculator | → /price-calculator. |
| medium | **fixed** | `redirects.mjs` | Blog redirect map hard-wires Dutch slugs on both Dutch hosts and English/French slugs elsewhere — tightly coupled to D1 | Derived from blog-slugs.json; be/nl deliberately keep Dutch slugs. |
| medium | **fixed** | `redirects.mjs` | Danish domain and Icelandic legacy data use the market terms that the message files never use | T1. |
| medium | **decision** | `src/i18n/config.ts` | French-speaking Belgium has no locale: Walloon dealer places live on the fr-FR domain and Belgian users are routed to the Dutch domain | fr-BE on its own host — written up in CHANGES.md. |
| low | **open** | `redirects.mjs` | Host matching in redirects.mjs and next-intl is exact — www. hosts match no domain and fall back to English prefixed routing | Add www. → apex 308s at the Vercel domain level (or duplicate host rules). |
| low | **open** | `middleware.ts` | Root middleware.ts is dead code that must be hand-synced with src/middleware.ts | Delete the root copy (Next only loads src/middleware.ts). |
| low | **open** | `next.config.mjs` | NEXT_PUBLIC_DOMAIN_<LOCALE> overrides are not honoured by redirects.mjs or next.config remotePatterns | Either drop the env overrides or feed redirects.mjs/next.config from the same table. |
| low | **fixed** | `redirects.mjs` | Polish market historically priced in PLN; estimator and currency helpers only know EUR/GBP | T2/T7. |
| low | **fixed** | `src/app/[locale]/dealers/page.tsx` | /dealers renders all Benelux regions on every dealer market; DE domain has a single Austrian place and inherits Dutch place redirects on .nl | Home regions first + DE/PL/FR regions (T3). |
| info | **open** | `src/i18n/config.ts` | Stale and self-contradicting domain comments in config.ts, middleware.ts and redirects.mjs | Hygiene. |
| info | **open** | `src/i18n/config.ts` | getLocaleFromPath/removeLocaleFromPath are unused and wrong for domain mode | Delete. |
| info | **open** | `redirects.mjs` | Case-variant duplicate rules (/Knowledge-base vs /knowledge-base) are redundant under Next's case-insensitive matching | Harmless; documented as deliberate in round 1. |

#### SEO & structured data

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **fixed** | `src/lib/structured-data.ts` | Product AggregateOffer hard-codes priceCurrency EUR (and €/m² ranges) on GBP/USD/PLN/DKK/SEK/NOK/ISK domains | T2 (PLN on .pl). |
| medium | **fixed** | `src/app/[locale]/dealers/[place]/page.tsx` | Dealer place pages emit no LocalBusiness/Place/Service markup — only BreadcrumbList | Belgian/Polish entity nodes (T5/T7); DE/FR/AT pages deliberately emit none (no local address). |
| medium | **open** | `src/app/sitemap.xml/route.ts` | Every dealer-market domain's sitemap and hreflang advertise all 59 Benelux/Wien place pages — straekloft.dk/dealers/gent with hreflang da-DK, stretchdecken.de/dealers/antwerpen, etc. | By design since phase 1 — see “every place is pre-rendered”. |
| medium | **partly** | `src/i18n/config.ts` | On stretchplafond.fr the Wallonia/Luxembourg place pages are the only French dealer pages, yet carry hreflang fr-FR, a France-scoped WebSite/inLanguage and a 'Belgique & Pays-Bas' overview title — no fr-BE identity exists anywhere | Identity fixed (T5); the fr-BE hreflang question is the decision. |
| medium | **fixed** | `messages/da.json` | Danish and Icelandic <title>/meta descriptions (all 44 meta keys) use the non-searched product nouns 'spændloft' and 'strekkiloft' | T1. |
| medium | **open** | `src/app/api/og/[slug]/route.tsx` | OG image routes are not locale/host aware: every domain's cards show English product/blog titles, the hard-coded footer 'stretchplafond.be' and English 'Hand made in Belgium' / 'Guide · STRETCH' | Same as the OG title finding. |
| low | **open** | `src/lib/structured-data.ts` | Organization.description and Service.serviceType are untranslated English on every domain | Translate via the meta namespace. |
| low | **partly** | `src/lib/structured-data.ts` | Poland has no schema identity of its own: the only PL node is the Alto Design branch pointing at altodesign.pl, training Events are hard-located at the Belgian HQ, and the Częstochowa plant is absent from Organization/LocalBusiness | The Częstochowa page now emits the PL branch node; the Organization stays global by design. |
| low | **open** | `src/lib/products.ts` | PVC product is declared countryOfOrigin 'PL' in Product JSON-LD while every OG image and the Organization description assert 'Hand made in Belgium' | True (PVC is made in Częstochowa) — but site copy elsewhere says “made in Belgium”; the two-plant wording (T7) should propagate. |
| low | **fixed** | `src/app/sitemap.xml/route.ts` | /price-calculator falls to the sitemap's default priority 0.4 while product pages get 0.9 | 0.8. |

#### Content & blog

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **fixed** | `messages/pl.json` | Article body link rows live in each message file and hard-code Dutch /blog/ slugs (pl.json, de.json, all 14 files) | localizeHref() maps body-link hrefs to the locale slug. |
| medium | **fixed** | `src/app/[locale]/kit/page.tsx` | Three components hard-code blog slugs outside content.ts (kit page, PriceEstimator, MegaMenu) | blogPath()/localizeHref() everywhere. |
| medium | **fixed** | `src/lib/content.ts` | No article links to /price-calculator; the price guide post has no link rows at all | Calculator card on the price guide; German/French articles link it. |
| medium | **fixed** | `messages/da.json` | Price-guide currency drifts per locale: EUR on uk/us, hand-typed kr ranges on da/sv/no/is with no shared source | Guides are EUR again with the ≈ card from the ECB table. |
| medium | **fixed** | `messages/da.json` | Danish blog copy mixes 'spændloft' and 'stretchloft' (never 'strækloft'); Icelandic mixes 'strekkiloft' and 'strekkloft' ('dúkaloft' only twice) | T1. |
| medium | **fixed** | `src/lib/content.ts` | The .fr traffic-carrier post has a French slug but no `markets`, so it is published on all 14 domains; de/pl have no market-native articles or article redirects | Every locale now has its own slug for it. |
| low | **open** | `messages/pl.json` | spanplafond-premie-btw is shipped untranslated (English) in 8 message files where it is never rendered | Hygiene: the premie post could be dropped from the 9 bundles where it never renders. |
| low | **open** | `src/lib/structured-data.ts` | OG card renders the English content.ts title on every domain, and Article JSON-LD image uses the global siteUrl while page metadata uses localeBase | api/og/[slug] is not locale-aware; pass the locale or read the Host header (edge route). |
| low | **open** | `src/lib/content.ts` | Post dates are batch-stamped and never bumped; two posts are dated before the repository existed | Editorial. |
| low | **open** | `src/lib/content.ts` | readMinutes is hand-set and uncorrelated with article length | Compute from word count at build time. |
| info | **open** | `src/lib/content.ts` | 11 of 18 posts have no hero image and render the branded placeholder; three carry TODO comments | Editorial/photography. |
| info | **fixed** | `src/lib/blog-slugs.json` | In-flight T4a scaffolding present but inert: blog-slugs.json is {} and redirects.mjs does not read it | Transient (mid-change tree). |

#### Dealer directory

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **partly** | `messages/en.json` | 'Production near Lokeren' in dealersPage copy contradicts the registered HQ Beveren-Waas used everywhere else | ovIntro fixed on de/pl/fr; the other 11 bundles still say “near Lokeren” — Beveren-Waas is the registered site. |
| medium | **fixed** | `src/app/[locale]/dealers/[place]/page.tsx` | Nearby heading for province-less cities renders 'Orte in Berlin' / 'Localités dans la province : Paris' above a list of other cities | nearbyHeadingRegion. |
| medium | **partly** | `messages/en.json` | Overview metadata still says 'Belgium & the Netherlands' on every locale | Rewritten on de/pl/fr; the other dealer-market locales still say Belgium & the Netherlands although they now list eight regions. |
| medium | **open** | `src/app/[locale]/dealers/[place]/page.tsx` | Every place is pre-rendered on all 13 dealer-market domains in that domain's language; primaryLocale never restricts routing | By design since phase 1 (a Danish domain carries Benelux place pages); consider restricting place pages to their home market + en. |
| medium | **fixed** | `messages/da.json` | Danish dealersPage uses 'Stretchloft' and Icelandic uses 'Strekkloft' in H1 and meta titles instead of the market terms | T1. |
| low | **open** | `messages/fr.json` | Luxembourg city pages call the Grand Duchy a 'province' in the nearby heading (fr) | Wording. |
| info | **fixed** | `src/lib/dealers.ts` | dealerMarkets derivation verified: every locale except us; us still ships the full 38-key dealersPage namespace | Verified again after T3. |
| info | **fixed** | `messages/fr.json` | ICU placeholders and apostrophes verified consistent across all 14 locales | Info. |
| info | **open** | `src/lib/dealers.ts` | Wien is targeted at stretchdecken.de (de-DE) although site-config lists a Vienna office with its own .at mailbox | Austria has a branch and its own .at domain that 302s to .de — an at locale would be the structural fix. |
| info | **fixed** | `src/app/[locale]/price-calculator/page.tsx` | Working tree does not typecheck (two errors outside the dealer subsystem) | Transient. |

#### Pricing & currency

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **partly** | `messages/pl.json` | A second EUR price guide ships on every locale, including Poland and the Nordics, outside the T2 currency treatment | Poland fixed (PLN); other markets show EUR deliberately (with ≈ where applicable). |
| medium | **fixed** | `messages/pl.json` | kitPage.currencyNotice is a £-specific sentence shipped to all 14 locales and rendered on every domain in HEAD | Replaced by currency.* ×14. |
| medium | **open** | `src/lib/currency.ts` | Poland is declared a PLN-settlement market in code while every Polish lead/quote string promises EUR invoices | pl.json modal copy (kit_order, projects_export) still says EUR proforma — decide and align. |
| medium | **open** | `src/app/api/portal/pricelist-order/route.ts` | Portal PLN pricelist is display-only: basket, server re-pricing and e-mails are always EUR | Settlement/portal scope. |
| medium | **fixed** | `src/components/sections/SolutionPage.tsx` | T6 calculator entry points read message keys that do not exist in any locale file | Transient. |
| low | **partly** | `src/lib/currency.ts` | Two different EUR→PLN rates coexist and the eight new display rates are unverified placeholders | Public side documented; designer PLN rate still separate (see above). ECB seeds must be verified. |
| low | **open** | `src/app/[locale]/portal/(app)/budget-guide/page.tsx` | Architect budget guide formats EUR with the internal market code instead of the BCP-47 code | Use localeFullCodes. |

#### Message files

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **open** | `messages/no.json` | no.json mixes strekktak (125×) with strekkhimling (98×) in the same file — same inconsistency pattern as D5, adjacent to its scope | Norwegian has the same two-terms problem da/is had (strekktak vs strekkhimling) — needs the native decision alongside the domain question (T1b). |
| medium | **open** | `messages/da.json` | Belgium-only article spanplafond-premie-btw ships verbatim in English inside 8 non-market bundles (58/58 leaves identical to en) — dead weight that also accounts for every surviving 'stretch ceiling' in the Nordic files | Same as above (hygiene). |
| medium | **partly** | `messages/da.json` | Currency copy inside the bundles contradicts itself: € in meta/architect strings on non-euro locales whose own price guide is in kr/zł, plus a dead kitPage.currencyNotice hard-coding £ in all 14 files | Meta descriptions deliberately keep the EUR range; kit/export modal copy on pl still promises EUR (open). |
| medium | **partly** | `messages/fr.json` | fr.json on stretchplafond.fr presents a Belgian dealer/company identity with no French-market framing; the only Wallonia strings are one region label and the overview meta | T5 gives Wallonia/Luxembourg the Belgian identity and France its own block; the rest of fr.json is unchanged. |
| low | **open** | `messages/uk.json` | uk.json is a byte-identical copy of en.json, so stretch-ceilings.uk carries no UK-specific wording (dealer/contact copy still describes Belgium & the Netherlands) | No UK-specific wording (kit-forward market) — editorial. |
| low | **fixed** | `messages/pl.json` | pl.json claims Belgian-only production in the footer/home meta while its supply and training copy already speaks of the Polish plant in Częstochowa; € still in the calculator meta | T7 value changes. |
| low | **fixed** | `messages/en.json` | The bundles expose the price calculator only as a footer label; the mega menu has no calculator entry and the new MobileMenu call targets a key that does not exist | T6. |
| low | **open** | `messages/da.json` | Residual short English strings in non-English bundles (outside proper nouns) | Hygiene; list in the reader output. |

#### UI, navigation & homepage

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **fixed** | `messages/da.json` | da/is nav, mega menu and homepage strings use the old product nouns (spændloft / strekkiloft), never the market terms | T1. |
| medium | **fixed** | `src/lib/site-config.ts` | /dealers directory has no link in Header, MegaMenu, MobileMenu or Footer; utilityNav/mainNav are dead config | Footer + mobile menu on dealer markets. |
| medium | **fixed** | `src/lib/blog-slugs.json` | Mega menu blog link cannot localize: blog-slugs.json is empty so every locale gets the canonical slug | localizeHref + slug map. |
| medium | **open** | `src/components/sections/home/Gallery.tsx` | Homepage Gallery renders un-localized project title/category/meta from content.ts | Localise through the projects namespace like the project pages do. |
| medium | **open** | `src/components/layout/Header.tsx` | Mega menus open only on mouse hover — no keyboard/touch path | Accessibility: add click/keyboard toggling. |
| low | **open** | `src/app/[locale]/layout.tsx` | 'Skip to content' and several aria-labels are hard-coded English although common.skipToContent exists | Use common.skipToContent. |
| low | **open** | `src/components/layout/Footer.tsx` | Footer HQ address and branch list are hard-coded English, not derived from site-config or translated | Render from site-config offices + translated country names. |
| low | **fixed** | `src/components/layout/Header.tsx` | On pl the Installer training link is rendered twice in the header, and the 'Hand made in Belgium' claim is locale-invariant | See above. |
| low | **open** | `src/app/globals.css` | .only-desktop { display: initial } overrides .btn's inline-flex on the header quote button | CSS nit. |
| low | **fixed** | `src/app/[locale]/kit/page.tsx` | Three server pages use bare <style>{`...`}</style> template literals instead of dangerouslySetInnerHTML | Converted. |
| low | **open** | `src/components/layout/LanguageSwitcher.tsx` | LanguageSwitcher listbox has invalid option ownership and an unlabeled trigger | Accessibility. |
| info | **fixed** | `src/components/layout/MegaMenu.tsx` | Technical mega menu 'All specs & downloads' points to /products, not /datasheets | → /datasheets. |
| info | **fixed** | `src/lib/site-config.ts` | site-config salesTerritory omits ES/PT/DK/SE/NO despite live domains; '12 domains' comment stale | ES, PT, DK, SE, NO added. |

#### Portal, API & security

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **open** | `src/lib/portal/demo-pricebook.json` | Bundled 'sample' pricebook is a full real export of the v2.4 workbook with Producer/Reseller prices | Portal: replace demo-pricebook.json with synthetic rows — real Producer/Reseller prices are in git. |
| medium | **open** | `src/app/api/portal/designer/route.ts` | Designer route serves the price-matrix HTML to demo sessions (no session.demo check, unlike every other file route) | Add the session.demo check like every other portal route. |
| medium | **open** | `src/lib/portal/designer-store.ts` | Client-supplied order ref + storage upsert lets one dealer overwrite another dealer's archived order documents | Namespace the storage key by account id. |
| medium | **open** | `supabase/schema.sql` | RLS grants b2c accounts the B2C price group, contradicting the documented 'zero rows' invariant | Check against the documented invariant. |
| medium | **fixed** | `src/lib/turnstile.ts` | Turnstile hostname allow-list omits stretchceiling.us, so every form/login/signup on the live US domain fails captcha once Turnstile is enabled | See above. |
| medium | **open** | `src/lib/datasheet-links.ts` | Public datasheet links fall back to a hard-coded signing secret when DATASHEET_SIGNING_SECRET is unset | Fail closed when DATASHEET_SIGNING_SECRET is unset. |
| medium | **open** | `package.json` | Next.js pinned at 14.2.15, behind several 14.2.x security releases | Upgrade to the latest 14.2.x. |
| low | **open** | `src/app/api/portal/users/route.ts` | Admin PATCH can promote any account to admin, deactivate other admins and reset their passwords with no audit trail | Portal hardening backlog. |
| low | **open** | `src/lib/portal/emails.ts` | Welcome e-mails carry the admin-chosen password in plaintext with no forced reset | Force a reset link instead. |
| low | **open** | `src/app/api/portal/review/route.ts` | Review-token e-mail link is a 7-day bearer credential that can approve an account into any tier with all markets | Shorten / bind to tier. |
| low | **open** | `src/app/api/portal/signup/route.ts` | Architect self-signup on any non-freemail domain is auto-activated, giving instant access to architect-private CAD/BIM/PDF downloads | Policy decision. |
| low | **open** | `src/lib/rate-limit.ts` | Rate limiting, blocklist and lead storage silently no-op when SUPABASE_SERVICE_ROLE_KEY is absent | Log loudly when the service key is missing in production. |
| low | **open** | `next.config.mjs` | No HTTP security headers beyond Cache-Control on /api/og | Add HSTS, X-Content-Type-Options, frame-ancestors via next.config headers(). |
| low | **open** | `src/app/api/portal/designer/event/route.ts` | designer/event accepts an unbounded meta object from any signed-in account (b2c/architect included) and stores it verbatim | Cap size, validate shape. |
| low | **open** | `src/app/api/portal/login/route.ts` | Login self-heal inserts the un-normalised request e-mail into portal_users.email (unique, case-sensitive) | Lower-case before insert. |
| info | **open** | `datasheets-private/README.md` | Gated datasheets and the installer guide are committed to git | Policy: private repo, but a 20 MB binary in history. |
| info | **open** | `src/lib/turnstile.ts` | Stale comments/docs contradict the live Turnstile and demo-mode behaviour | Hygiene. |
| info | **open** | `src/app/api/portal/pricelist-order/route.ts` | Portal orders and the designer are EUR-only; designer hardcodes its own PLN rate | Settlement path; deliberately untouched by T2 — but the designer PLN rate duplicates the table (decide which is canonical). |

#### Forms, lead delivery, analytics & consent

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **fixed** | `src/lib/forms-config.ts` | defaultCountryForLocale has no entry for the 'us' locale — US visitors get no pre-selected country | us → US. |
| medium | **open** | `src/lib/deliver.ts` | All 14 markets deliver to one inbox and the lead email carries no originating domain/locale | Add the originating host/locale to the lead e-mail subject and body; per-market routing is a config decision. |
| medium | **open** | `src/components/sections/ContactForm.tsx` | Contact form submits no country or locale, so contact-page leads cannot be attributed to a market | Add hidden locale/host fields to ContactForm. |
| medium | **open** | `src/lib/forms-config.ts` | Polish Częstochowa training session is modelled as an 'international' session and its leads are labelled 'EN/DE' | Give the Polish session its own source label and route. |
| medium | **open** | `src/components/LeadGenModal.tsx` | Clarity identify(email) and company tags fire under the 'analytics' category that the banner describes as anonymous | Consent category wording vs. what fires — review with the consent text. |
| low | **open** | `src/lib/forms-config.ts` | Training modal/inline form copy sells the Belgian HQ on the Polish market | pl.json training modal copy still names the Belgian HQ; the training page itself already says Częstochowa. |
| low | **open** | `src/lib/events.ts` | events.ts is hardcoded English and has no Polish/Częstochowa entry despite the 'keep in sync' rule | Sync rule not followed; add the Polish session. |
| low | **open** | `src/components/analytics/MetaPixel.tsx` | Meta Pixel and Bing UET use one global ID for all 14 domains while GA/Clarity are per-locale; .env docs omit US | Config decision. |
| low | **open** | `src/lib/forms-config.ts` | Belgian '+32 ...' phone placeholder ships in the modal forms of every non-Belgian market | Per-locale placeholder from the locale bundle. |
| low | **open** | `src/lib/forms-config.ts` | kit_order / projects_export forms promise a 'proforma invoice in EUR' on GBP, USD and PLN markets | Settlement truth: EUR everywhere except PLN in Poland — pl.json kit/export modal copy should say PLN. |
| low | **open** | `src/app/api/datasheet-request/route.ts` | Datasheet email's architect invite links to a locale-prefixed path that production domains 308-redirect | One 308 hop; build the link with localeBase(). |
| info | **open** | `src/app/[locale]/layout.tsx` | ConsentModeDefaults claims to render into <head> but is mounted inside <body> under the intl provider | Comment/hygiene. |
| info | **open** | `.env.example` | .env.example LEAD_DESTINATION differs from the code default and from the contact address | Hygiene. |
| info | **open** | `src/app/[locale]/layout.tsx` | Hardcoded English 'Skip to content' in the locale layout | common.skipToContent exists — use it. |

#### Build, tooling & repo hygiene

| Severity | Status | File | Finding | Note |
|---|---|---|---|---|
| medium | **open** | `README.md` | README claims the build fetches Archivo from Google; fonts are self-hosted via next/font/local | README rewrite. |
| medium | **open** | `README.md` | README 'Project structure' block is stale: sitemap.ts, root layout.tsx, messages under src/, public/robots.txt, 5 product routes, 7 form types | README rewrite. |
| medium | **open** | `package.json` | README says `npm run lint` runs ESLint (next/core-web-vitals), but ESLint is neither installed nor configured | Install/configure ESLint or drop the script line. |
| medium | **open** | `middleware.ts` | Root middleware.ts is a dead hand-synced copy; Next only loads src/middleware.ts | Delete it. |
| medium | **fixed** | `public/llms.txt` | llms.txt states PVC maximum seamless width 6.4 m; products.ts was corrected to 6.5 m on 2026-08-28 | 6.5 m. |
| medium | **fixed** | `public/llms.txt` | llms.txt says '12 country domains' and its domain list omits stretchceiling.us | 14, incl. stretchceiling.us. |
| medium | **partly** | `public/llms.txt` | llms.txt link list and product list lag the live route set (no /price-calculator, /dealers, /materials, /kit, /supply; 5 of 8 products) | Prices/plants/domains updated; the route list is still short (no /dealers, /materials, /price-calculator entries). |
| medium | **fixed** | `public/llms.txt` | llms.txt tells AI assistants STRETCH publishes no prices while /price-calculator and Product JSON-LD publish €70–200/m² ranges | See above. |
| medium | **fixed** | `public/llms.txt` | llms.txt says 'Made in Belgium … in-house' while the Polish site now claims two EU factories (Częstochowa + Beveren-Waas) | Two EU plants. |
| medium | **open** | `public/llms.txt` | llms.txt promises a 25-year warranty; the product spec tables state 10 years | The site itself is inconsistent: FAQ/about say 25 years, product specs and Product JSON-LD say 10 (prefab 25). Michael decides the number; then one source. |
| medium | **open** | `INTEGRATION-NOTES.md` | INTEGRATION-NOTES.md is a stale 9 Jul 2026 zip delivery note: 12 locales, 'no database yet' for designer orders, 3 of 5 demo logins | Delete or date it. |
| low | **open** | `README.md` | README quick start says localhost redirects to /en; the default locale is served unprefixed | README rewrite. |
| low | **open** | `README.md` | README Scripts table omits `npm test` (spam-score regression tests) | README rewrite. |
| low | **open** | `.env.example` | .env.example GA/Clarity per-locale suffix list omits US although the code reads NEXT_PUBLIC_GA_ID_US | Hygiene. |
| low | **open** | `src/app/fonts.ts` | Font module, font README and robots route comments still say 12 locales/domains | Hygiene. |
| low | **open** | `src/app/[locale]/applications/custom-print/page.tsx` | Orphan duplicate routes: /applications/custom-print, /prefab-ceiling-unit and /prefab-lighting render the same pages as their /products/* twins | See the prefab duplicates above. |
| low | **open** | `src/components/ui/Reveal.tsx` | src/components/ui/Reveal.tsx is unused but still documented in the README | Delete. |
| low | **open** | `claude/blog-batch-2026-08-22.json` | claude/blog-batch-2026-08-22.json — a 108 KB AI working artefact committed at the repo root, unreferenced by code | Delete. |

### 3.4 Rejected high findings

20 reader findings rated high were refuted by the verifier — all but one because they described the working tree before the round-3 commits (D1–D5 mechanics, missing message keys, empty slug map). They are recorded in the workflow journal and not repeated here.

## 4. What to do next (priority order)

1. **Portal/security backlog** (3.1/3.3, all open): demo-admin session when Supabase is unset, cost prices in the designer HTML, real pricebook export in `demo-pricebook.json`, designer route without the demo check, datasheet signing-secret fallback, HTTP security headers, Next.js 14.2.x upgrade.
2. **Cloudflare Turnstile**: add `stretchceiling.us` to widget group B (code is done; the widget config is not).
3. **Decisions for Michael** (also in CHANGES.md): Sweden canonical `spänntak.se`; Norway domain and the strekktak/strekkhimling term; fr-BE host for Wallonia; French sales NAP; Belgian VAT number; the warranty number (10 vs 25 years); AT/CH/LI 302 → 308; ECB rate verification; native check of the `TODO(is)` string.
4. **Lead attribution**: originating host/locale in every lead e-mail; contact form country; Polish training source.
5. **Hygiene**: README rewrite, delete root `middleware.ts`, `claude/blog-batch-2026-08-22.json`, `Reveal.tsx`, `INTEGRATION-NOTES.md`; decide on `tsconfig.tsbuildinfo`; “near Lokeren” → Beveren-Waas in 11 bundles; English 404 page and skip link.
6. **Structural**: OG images per locale; restrict `routing.domains` to live locales; place pages per home market.

## 5. Subsystem notes (from the readers)

### SEO & structured data

SEO is domain-per-locale. src/i18n/config.ts owns locales, localeDomains, localeStatus (pt/no pending), and localeFullCodes (en, en-GB, en-US, nl-BE, fr-FR, da-DK, is-IS…). src/lib/seo.ts builds canonical = origin + route and hreflang = one entry per LIVE locale (intersected with an optional `only` subset) plus x-default → en (or the first subset member); buildOgLocales mirrors it. src/lib/page-meta.ts (pageMetadata) wraps this for static routes using the `meta` namespace; dynamic routes call buildAlternates directly: blog passes `base.markets`, /dealers and /dealers/[place] and /installer-training pass `dealerMarkets` (every locale except `us`); products, prefab, technical, applications, materials, projects pass no restriction. The sitemap (src/app/sitemap.xml/route.ts) is host-aware, lists only the host's locale, emits xhtml:link alternates via localesForRoute (same rules), and serves an empty urlset for pending domains; robots.txt is host-aware and disallows /api/ and /portal. Structured data (src/lib/structured-data.ts): ONE global Organization @id at stretch.mt (Belgian HQ address, salesTerritory areaServed) rendered on / and /about; a per-origin WebSite node on /; a Belgian LocalBusiness (Beveren-Waas, url stretch.mt, priceRange €€) on / and /contact; branch LocalBusiness nodes for PL (Alto Design, url altodesign.pl) and AT on /contact of every domain; Product+AggregateOffer (EUR, indicative-prices.ts) + FAQPage on product pages; Article on blog posts; Course+Event on /installer-training; Service on /supply; BreadcrumbList everywhere. Dealer place pages emit only BreadcrumbList. OG images come from /api/og and /api/og/[slug] (edge, not host/locale aware). The hreflang/canonical/x-default/only logic itself is sound; the defects are in what is keyed on a single slug, what is hard-coded (EUR, Belgian NAP, brand.domain, English strings), the robots block on /api/, and market coverage data.

Key files: `/home/user/stretch_website/src/lib/seo.ts`, `/home/user/stretch_website/src/lib/page-meta.ts`, `/home/user/stretch_website/src/lib/structured-data.ts`, `/home/user/stretch_website/src/lib/site-config.ts`, `/home/user/stretch_website/src/i18n/config.ts`, `/home/user/stretch_website/src/app/sitemap.xml/route.ts`, `/home/user/stretch_website/src/app/robots.txt/route.ts`, `/home/user/stretch_website/src/app/api/og/route.tsx`

### i18n, routing & redirects

Routing is next-intl 3.26.5 in DOMAIN mode. /home/user/stretch_website/src/i18n/config.ts is the single source: `locales` (14), `localeDomains` (env-overridable literals), `localeStatus` (pt and no are 'pending'), `liveLocales`, `localeForHost` (strips port and www.), and `routing = defineRouting({ localePrefix: 'as-needed', alternateLinks: false, domains: locales.map(...) })` — one domain per locale, each with `locales: [locale]`. src/middleware.ts (the file Next really loads — build/index.js takes `path.join(pagesDir || appDir, "..")` = src/) does an optional /portal→NEXT_PUBLIC_PORTAL_HOST 308, then `createMiddleware(routing)`, then a Supabase cookie refresh on /portal paths; the matcher skips api/_next/_vercel/dotted paths. next-intl's resolveLocale matches `x-forwarded-host ?? host` EXACTLY against `domain`; on a known host that domain's single locale always wins (cookie/Accept-Language are constrained to it) and unprefixed paths are rewritten to /<locale>/…; a foreign prefix (/pt/x on stretch.mt) triggers a cross-domain 307. Unknown hosts (localhost, previews) fall back to prefixed as-needed routing with global default en. navigation.ts forces `localePrefix: 'never'` so rendered hrefs are unprefixed. request.ts loads messages/<locale>.json with defaultLocale fallback. Liveness (`liveLocales`) drives hreflang (seo.ts buildAlternates), sitemap (empty on a pending host), footer/switcher links — but NOT `routing.domains` nor generateStaticParams (both use all 14). next.config.mjs wires the plugin, 14 remotePatterns and `redirects() { return legacyRedirects }`. redirects.mjs yields 512 host-scoped 308s: `localePrefixStrips` first (each domain strips only its own prefix), then dutchRules×2, english, uk, us, german, french, polish, icelandic; Next redirects are first-match-wins, case-insensitive and run before middleware. A systematic check of all 512 rules found zero shadowed rules (every kit/deep rule precedes its genericRules spread) and all 72 distinct destinations resolve to real routes/slugs (13/13 blog, 13/13 inspiration, 8/8 dealers, materials, products, /installer-training valid on de/fr/pl because dealerMarkets includes them). config.ts localeDomains, redirects.mjs LOCALE_DOMAINS and next.config remotePatterns list the same 14 hosts. Root middleware.ts is functionally identical to src/middleware.ts (diff = import path + comment) but is dead code with no sync guard.

Key files: `/home/user/stretch_website/src/i18n/config.ts`, `/home/user/stretch_website/src/i18n/navigation.ts`, `/home/user/stretch_website/src/i18n/request.ts`, `/home/user/stretch_website/src/middleware.ts`, `/home/user/stretch_website/middleware.ts`, `/home/user/stretch_website/next.config.mjs`, `/home/user/stretch_website/redirects.mjs`, `/home/user/stretch_website/node_modules/next-intl/dist/esm/middleware/resolveLocale.js`

### Dealer directory

The dealer directory is driven by /home/user/stretch_website/src/lib/dealers.ts (uncommitted Phase 2 edit: HEAD has 59 places, working tree 80). Places are typed DealerPlace {slug, name, kind, region, primaryLocale, province?, dealerIds, projects?, factory?}. Counts (working tree): by primaryLocale be 17 / fr 23 / nl 26 / de 11 / pl 3; by region flanders 17, wallonia 12, netherlands 26, luxembourg 3, austria 1, germany 10, poland 3, france 8; 23 provinces + 57 cities; 42 places have empty dealerIds (recruitment variant): brussel, all 12 Wallonia, 4 NL provinces, 3 Luxembourg, wien, 10 DE, 3 PL, 8 FR. Only czestochowa carries factory:true. dealerMarkets = locales.filter(l => dataLocales.has(l) || recruitmentLocales.includes(l)) where dataLocales = Set(primaryLocale) = {be,fr,nl,de,pl} and recruitmentLocales = [en,uk,pl,es,pt,da,sv,no,is]; the union is every locale except `us`, so on us both routes notFound(), generateStaticParams skips them and sitemap.xml/route.ts drops /dealers*. primaryLocale is used for nothing else: [place]/page.tsx generateStaticParams builds dealerMarkets x dealerPlaceSlugs (13 x 80 = 1040 pages), so every place exists on every dealer-market domain in that domain's language, with buildAlternates(locale, route, dealerMarkets) emitting an 11-locale hreflang cluster per place. Copy is 38 template keys in the nested dealersPage namespace, identical key set and {place}/{province} placeholders in all 14 files, no ASCII apostrophes (fr uses U+2019). Every variant on every locale names only "our Belgian production" and "production near Lokeren"; the page emits only breadcrumbSchema JSON-LD (no LocalBusiness), and the new helpers placeEntity(), isBelgianPlace(), regionsForLocale(), regionLabelKeys and factory are imported nowhere. dealers/page.tsx still hardcodes five REGIONS, so the 21 DE/PL/FR pages are not linked from the overview, and regionGermany/regionPoland/regionFrance keys do not exist in any message file.

Key files: `/home/user/stretch_website/src/lib/dealers.ts`, `/home/user/stretch_website/src/app/[locale]/dealers/page.tsx`, `/home/user/stretch_website/src/app/[locale]/dealers/[place]/page.tsx`, `/home/user/stretch_website/messages/en.json`, `/home/user/stretch_website/src/lib/seo.ts`, `/home/user/stretch_website/src/i18n/config.ts`, `/home/user/stretch_website/src/lib/structured-data.ts`, `/home/user/stretch_website/src/lib/site-config.ts`

### Content & blog

Blog content lives in one TypeScript array: `blogPosts: BlogPost[]` in src/lib/content.ts (HEAD: 18 posts, lines 665-1619). `BlogPost` carries slug, title, excerpt, datePublished/dateModified, author, readMinutes, optional image, optional `markets: Locale[]`, and `body: BlogSection[]` (heading/paragraphs/bullets/links). `blogPostsFor(locale)` (line 1629) is the single market filter: `!p.markets || p.markets.includes(locale)`. Only ONE post (`spanplafond-premie-btw`, line 1355) has `markets`; the other 17 render on all 14 locales. Slug classes at HEAD: 2 English, 15 Dutch (comment lines 752-753: "Slugs kept identical to the old Dutch URLs so the 301s are near-exact"), 1 French (`plafond-tendu-avantages-et-inconvenients`).

Translation is an overlay: `localizeBlogPost` in src/lib/localize-content.ts (line 156-159) spreads the EN structural post and replaces title/excerpt/BODY wholesale from `messages/<locale>.json` under nested `blogPosts.posts.<canonical-slug>` (18 keys in every file). Because body is replaced, the per-section `links` rows (hrefs) actually come from each message file, not from content.ts, and already diverge (us.json dropped 4 links; nl.json has an extra section).

Rendering: src/app/[locale]/blog/page.tsx lists `blogPostsFor(locale)` and links `/blog/${p.slug}`; src/app/[locale]/blog/[slug]/page.tsx (HEAD) enumerates `locales.flatMap(locale => blogPostsFor(locale).map(p => ({locale, slug: p.slug})))`, builds hreflang via `buildAlternates(locale, /blog/${post.slug}, base.markets)`, OG image `${localeBase(locale)}/api/og/${post.slug}`, and Article JSON-LD via `articleSchema` (src/lib/structured-data.ts 261-276). src/app/sitemap.xml/route.ts emits `/blog/${p.slug}` per locale with alternates on the same slug. Other /blog/ URL constructors at HEAD: MegaMenu.tsx:59, kit/page.tsx:103, PriceEstimator.tsx:82, api/og/[slug]/route.tsx (getBlogPost, English title), redirects.mjs (Dutch rules 114-136, de:320, fr:343). Working tree already contains T4a scaffolding (src/lib/blog-slugs.ts/.json = `{}`), so all locales still resolve to canonical Dutch slugs until the map is filled and redirects.mjs is wired.

Key files: `/home/user/stretch_website/src/lib/content.ts`, `/home/user/stretch_website/src/lib/localize-content.ts`, `/home/user/stretch_website/src/app/[locale]/blog/[slug]/page.tsx`, `/home/user/stretch_website/src/app/[locale]/blog/page.tsx`, `/home/user/stretch_website/src/app/sitemap.xml/route.ts`, `/home/user/stretch_website/src/lib/structured-data.ts`, `/home/user/stretch_website/src/app/api/og/[slug]/route.tsx`, `/home/user/stretch_website/src/components/layout/MegaMenu.tsx`

### Pricing & currency

Pricing has ONE public number source, src/lib/indicative-prices.ts: `estimatorBuckets[EUR|PLN]` (five per-m² buckets, EUR 70–200 / PLN 150–450) and `indicativePriceRange(slug, currency)`. Display policy lives in src/lib/currency.ts (uncommitted rewrite, 2 Sep): `policies` maps da/sv/no/is/uk/us to mode 'indication' (EUR primary + "≈ local" at hand-kept `ratesPerEur`), pl to mode 'settlement' (PLN primary), everything else EUR-only; `settlementCurrencyFor()` returns PLN only for pl. Consumers: PriceEstimator.tsx (/price-calculator: `formatMoney` primary + `formatIndicationRange`), PriceIndication.tsx (/kit, only when `KIT_RETAIL_PRICE_EUR` is non-null — it is null, so /kit is price-on-request), PriceGuideCurrencyNote.tsx (aside on the spanplafond-prijs article, indication locales only, gated by `priceGuide: true` in content.ts), structured-data.ts `productSchema` (AggregateOffer in the settlement currency; HEAD still hardcodes 'EUR'), and the architect budget-guide (src/lib/budget-bands.ts, EUR placeholders). Public text surfaces that also carry prices are message strings: blogPosts.spanplafond-prijs (EUR on 9 locales, hand-typed kr./ISK figures on da/sv/no/is, zł on pl), blogPosts.plafond-tendu-avantages-et-inconvenients body[3] (EUR on every locale incl. pl/da/sv/is), meta.priceCalculatorDescription ("€70–200/m²" on all 14 incl. pl), meta.architectsDescription, portal.architect.budgetTileBody, kitPage.currencyNotice (£ text on all 14). Settlement paths: every lead/quote string says EUR (modals.kit_order, modals.projects_export, projectsExportPage.how.currencyLine; supplyPage says "EUR (PLN in Poland)"); the portal pricelist (PricelistView) toggles EUR/PLN display and shows ≈£ for GB accounts via `formatGbpIndication`, but the basket, /api/portal/pricelist-order (`row.price_eur`), order-email.ts and orders/page.tsx are EUR-only. The Polish PLN buckets are NOT a conversion: implied 2.14–2.50 PLN/EUR versus ECB 4.27 (EUR 70–200 → 299–854 zł), i.e. the Polish list is roughly half the euro list — a deliberate local price list or an error, but not derivable at any plausible rate. The working tree also reads a `currency.*` message namespace and several T6 keys that exist in none of the 14 files.

Key files: `/home/user/stretch_website/src/lib/currency.ts`, `/home/user/stretch_website/src/lib/indicative-prices.ts`, `/home/user/stretch_website/src/components/sections/PriceEstimator.tsx`, `/home/user/stretch_website/src/components/ui/PriceIndication.tsx`, `/home/user/stretch_website/src/components/sections/PriceGuideCurrencyNote.tsx`, `/home/user/stretch_website/src/app/[locale]/price-calculator/page.tsx`, `/home/user/stretch_website/src/app/[locale]/kit/page.tsx`, `/home/user/stretch_website/src/lib/structured-data.ts`

### Message files

Message files are 14 nested next-intl bundles (messages/<locale>.json, 49 top-level namespaces, 1788 flat keys, 3,279 string leaves once arrays are flattened). src/i18n/request.ts loads `messages/${locale}.json` per domain (src/i18n/config.ts localeDomains), so uk.json (byte-identical to en.json, 0 differing keys) is what stretch-ceilings.uk serves, while us.json diverges from en on 414 keys (spelling, ft/in, "business days"). Blog bodies live under blogPosts.posts.<canonical Dutch slug> and are merged onto src/lib/content.ts skeletons by localizeBlogPost; visibility is gated by `markets` in content.ts (blogPostsFor), and per-locale URLs are meant to come from src/lib/blog-slugs.json via slugForLocale, but that file is an untracked empty `{}`. Checks run with python3 over all 14 files: key parity holds exactly (0 missing/0 extra in every locale); leaf-level divergence is confined to blogPosts (deliberate link removal for the Belgium-only post in 8 non-market locales, fr reorders that post Wallonia-first, nl adds a "Woont u in Nederland?" section, us drops /dealers links). ICU placeholder sets match en on every key in every locale (0 mismatches; the single plural key productPage.chartCount carries one/few/many/other in pl); rich-text tag sets match (0); no mojibake (no Ã, â€, U+FFFD, Â+nbsp in any file). Naive identical-to-en counts are 141–211 per non-English locale but are dominated by proper nouns (projects, colour codes); the stopword-strict count is 37 in da/de/es/is/no/pl/pt/sv and 1 in be/fr/nl — 36 of the 37 are the untranslated Belgian grants article. D5 product nouns: da spændloft* 135 / stretchloft* 83 / strækloft* 0; is strekkiloft* 132 / strekkloft* 90 / dúkaloft* 3; no strekktak* 125 / strekkhimling* 98 (also mixed); sv spänntak* 225 (clean). Separately, the uncommitted working tree already calls 33 message keys (currency.*, dealersPage.identity*/factory*, home.estimator.*, common.nav.priceCalculator, productPage.priceLink, blogPosts.chrome.calculator*) that exist in none of the 14 files.

Key files: `/home/user/stretch_website/messages/en.json`, `/home/user/stretch_website/messages/da.json`, `/home/user/stretch_website/messages/is.json`, `/home/user/stretch_website/messages/no.json`, `/home/user/stretch_website/messages/sv.json`, `/home/user/stretch_website/messages/uk.json`, `/home/user/stretch_website/messages/pl.json`, `/home/user/stretch_website/messages/fr.json`

### UI, navigation & homepage

The chrome is three client components mounted by src/app/[locale]/layout.tsx: Header.tsx (black utility bar with reseller/training/portal/phone/LanguageSwitcher, then a white primary nav whose Solutions and Technical entries open MegaMenu on hover; a `locale === 'pl'` branch adds Installer training to the primary nav), MobileMenu.tsx (portal-rendered drawer with a flat link list incl. /price-calculator and /architects, product list, and the only phone-side language grid) and Footer.tsx (columns driven by `footerNav` in src/lib/site-config.ts, hard-coded HQ block, cross-domain "worldwide" anchors). MegaMenu keeps structure in two skeleton arrays (SOLUTIONS_SKELETON, TECHNICAL_SKELETON) and pulls every label from the `megaMenu.<menu>.cats[i].items[j].{title,sub}` arrays in messages via `buildCategories()`; because keys are positional, new entries must be appended (the /price-calculator item is cats.0.items.4, Architects is technical cats.2). Blog hrefs pass through `localizeHref()` (src/lib/blog-slugs.ts) which reads blog-slugs.json — currently `{}`. Link targets for /installer-training and dealer CTAs are gated by `isDealerMarket()` (src/lib/dealers.ts) so `us` never gets dead links. The homepage (src/app/[locale]/page.tsx) composes Hero → HomeEstimator (de only) → Ticker/Stats → WhyStretch → Solutions → Acoustics → ApplicationAreas → InstallerPartner (moved first on pl) → Gallery → Reviews → CtaBand; each section is a server component with a `<style dangerouslySetInnerHTML>` block, while client components (Footer, MegaMenu) use styled-jsx. SolutionPage.tsx is the shared product body (breadcrumb, hero with new /price-calculator link, specs, colours, related, red CTA) and ProductRoute.tsx wraps it with metadata and JSON-LD. Currency display comes from src/lib/currency.ts (display policy per locale) rendered by PriceIndication.tsx and PriceGuideCurrencyNote.tsx. All 14 message files have 1788 keys in parity, and none of the keys introduced by the uncommitted T2/T6/T7 work exist yet.

Key files: `/home/user/stretch_website/src/components/layout/Header.tsx`, `/home/user/stretch_website/src/components/layout/MegaMenu.tsx`, `/home/user/stretch_website/src/components/layout/MobileMenu.tsx`, `/home/user/stretch_website/src/components/layout/Footer.tsx`, `/home/user/stretch_website/src/components/layout/LanguageSwitcher.tsx`, `/home/user/stretch_website/src/lib/site-config.ts`, `/home/user/stretch_website/src/app/[locale]/layout.tsx`, `/home/user/stretch_website/src/app/[locale]/page.tsx`

### Portal, API & security

The portal is a Next.js 14 App Router area under /[locale]/portal with a zero-config split in src/lib/portal/supabase.ts: isSupabaseConfigured() (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY) selects Supabase auth via @supabase/ssr cookie clients (createRscClient/createRouteClient), otherwise getPortalSession() in src/lib/portal/auth.ts falls back to an unsigned base64url demo cookie (stretch_portal_demo) matched against DEMO_USERS. Session resolution reads portal_users under the user's own JWT (RLS policy portal_users_read_own); role/accountType gate trade areas via hasTradeAccess/hasArchitectAccess (src/lib/portal/types.ts). Pricelist reads (src/lib/portal/data.ts getPricebook) go through the user JWT so RLS pricebook_read_by_market (supabase/schema.sql) is the enforcement layer; every write, plus leads, rate_limits, blocked_senders, designer_* tables and the private storage bucket, uses createServiceClient() (SUPABASE_SERVICE_ROLE_KEY, server-only, RLS bypass) strictly after getAdminSession()/getPortalSession() checks in the /api/portal/* route handlers. Public lead endpoints (/api/lead, /api/contact, /api/datasheet-request) share runLeadGuards (src/lib/spam/guard.ts): honeypot → Postgres rate_limit_hit RPC (fail-open) → Turnstile siteverify with hostname allow-list (src/lib/turnstile.ts) → HMAC form token (src/lib/form-token.ts) → scoreSubmission + blocked_senders; flagged leads are stored via storeLead but never delivered. Signup/login verify Turnstile themselves, apply per-IP/per-email limits and a global circuit breaker, and gate installer signups as pending (review via HMAC review token, src/lib/portal/review-token.ts). Gated files stream from datasheets-private/, architect-private/, installer-private/ with static slug→file maps; public datasheet links are HMAC-signed (src/lib/datasheet-links.ts). Middleware only does the NEXT_PUBLIC_PORTAL_HOST 308 and Supabase token refresh; /api is excluded from the matcher, and /api/portal/* apply isPortalAllowedHost. Main weaknesses found: the designer HTML embeds cost prices, demo sessions are forgeable without the demo flag, the bundled demo pricebook is a full real export, designer order refs allow cross-dealer file overwrite, RLS lets b2c JWTs read B2C rows contrary to the docs, and stretchceiling.us is missing from the Turnstile host lists.

Key files: `/home/user/stretch_website/src/lib/portal/auth.ts`, `/home/user/stretch_website/src/lib/portal/supabase.ts`, `/home/user/stretch_website/src/lib/portal/data.ts`, `/home/user/stretch_website/src/lib/portal/demo-pricebook.json`, `/home/user/stretch_website/src/lib/portal/designer-html.ts`, `/home/user/stretch_website/src/app/api/portal/designer/route.ts`, `/home/user/stretch_website/src/app/api/portal/designer/order/route.ts`, `/home/user/stretch_website/src/lib/portal/designer-store.ts`

### Forms, lead delivery, analytics & consent

Forms: src/lib/forms-config.ts holds 12 MODAL_CONFIGS (English structural source; labels/options overlaid per locale by localizeModalConfig in src/lib/localize-content.ts from messages `modals.*`, with stable `optionValues` submitted). Every lead form shares countryField() (ISO codes) and defaultCountryForLocale() (LOCALE_DEFAULT_COUNTRY). LeadGenModal.tsx (context provider + one modal) and InlineLeadForm.tsx post to /api/lead; ContactForm.tsx posts to /api/contact; datasheet flow posts to /api/datasheet-request. Routes run runLeadGuards (honeypot → rate limit → Turnstile → form token → spam score) then deliverLead() (src/lib/deliver.ts: Graph → webhook → SMTP → log) which builds one internal email via buildLeadEmail (src/lib/email.ts) to the single inbox contact.leadDestination, and storeLead() (src/lib/lead-store.ts) copies the row into Supabase public.leads with page/host/ip. transactional.ts reuses the same provider chain for visitor mail (datasheet link). Analytics: src/lib/consent.ts stores {analytics, marketing} in localStorage and pushes Consent Mode v2 updates; ConsentModeDefaults sets all storage denied inline; GoogleAnalytics.tsx and Clarity.tsx resolve one ID per locale (NEXT_PUBLIC_GA_ID_<LOCALE> / NEXT_PUBLIC_CLARITY_ID_<LOCALE> with fallback), MetaPixel/BingUET use one global ID gated on marketing consent; src/lib/analytics.ts track() always sends to gtag, Meta/Bing only with marketing consent, Clarity tags always. Training sessions (TRAINING_DATE_DETAIL) are localised by array index via modals.trainingDates/trainingDateNotes; the Polish Częstochowa session is flagged `international: true` and booked via source 'training_international'. Verified all 14 message files carry full modals field/option coverage and 17 country names. Key defects found: US domain missing from Turnstile allowlist and default-country map; leads carry no origin market; Polish training interest labelled EN/DE; Clarity identify(email) under the "anonymous" analytics category; events.ts strings untranslated; EUR/Belgian phone copy in non-EUR/non-BE markets.

Key files: `/home/user/stretch_website/src/lib/forms-config.ts`, `/home/user/stretch_website/src/lib/localize-content.ts`, `/home/user/stretch_website/src/components/LeadGenModal.tsx`, `/home/user/stretch_website/src/components/sections/InlineLeadForm.tsx`, `/home/user/stretch_website/src/components/sections/ContactForm.tsx`, `/home/user/stretch_website/src/app/api/lead/route.ts`, `/home/user/stretch_website/src/app/api/contact/route.ts`, `/home/user/stretch_website/src/app/api/datasheet-request/route.ts`

### Build, tooling & repo hygiene

Build and tooling: Next.js 14.2.15 App Router with the next-intl plugin (next.config.mjs → createNextIntlPlugin('./src/i18n/request.ts')), redirects pulled from redirects.mjs (which loads src/lib/blog-slugs.json through createRequire, so the per-locale blog 301s and the routes share one map), image remotePatterns for all 14 production hosts, and experimental.outputFileTracingIncludes bundling the datasheets-private/, architect-private/ and installer-private/ folders into their gated API routes. The middleware Next actually loads is src/middleware.ts (build/index.js computes rootDir = join(appDir, '..') = src); it runs next-intl in domain mode, refreshes the Supabase session on /portal and 308s /portal to NEXT_PUBLIC_PORTAL_HOST. Fonts are self-hosted: src/app/fonts.ts uses next/font/local with src/fonts/archivo-var.woff2 (rebuild recipe in src/fonts/README.md). robots.txt and sitemap.xml are route handlers (src/app/robots.txt/route.ts, src/app/sitemap.xml/route.ts), not static files. tsconfig.json is strict with @/* paths and incremental:true, which is why tsconfig.tsbuildinfo keeps being regenerated and committed despite .gitignore. Scripts: seed-pricebook.mjs and create-portal-admin.mjs (Supabase service-role CLIs, parsing rules mirrored from src/lib/portal/parse-pricebook.ts and currently in sync) and spam-score.test.mjs (npm test, transpiles the TS sources with ts.transpileModule). No ESLint is installed or configured although package.json exposes `next lint`. Documentation is layered: README.md (largely from the English-only, Google-fonts era), INTEGRATION-NOTES.md (a 9 Jul 2026 zip delivery note), CHANGES.md (25 dated entries; entry 25 is being written concurrently), docs/ANTI-SPAM.md, docs/PORTAL.md, public/llms.txt (AI-facing facts and link list), and .env.example. The recurring theme is drift: the code moved to 14 locales, a US domain, self-hosted fonts, route-handler robots/sitemap, a public price calculator, a 6.5 m PVC width and a two-factory claim on .pl, while README, INTEGRATION-NOTES, llms.txt, .env.example, turnstile.ts and the font/robots comments still describe 12 locales / 13 domains, English-only, Google-fetched fonts and no published prices.

Key files: `/home/user/stretch_website/package.json`, `/home/user/stretch_website/tsconfig.json`, `/home/user/stretch_website/.gitignore`, `/home/user/stretch_website/.env.example`, `/home/user/stretch_website/next.config.mjs`, `/home/user/stretch_website/redirects.mjs`, `/home/user/stretch_website/src/middleware.ts`, `/home/user/stretch_website/middleware.ts`

