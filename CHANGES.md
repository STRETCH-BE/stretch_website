## 2026-08-30 (23) — Fix round 2: honest review markup, US dealer reality, sitemap dates

Re-analysis fixes (N1, N2, F12), one task per commit.

- **N1 — no self-serving review markup.** `reviewsSchema()` attached
  `Review` + `AggregateRating` nodes to our own `Organization` node — the
  business marking up reviews about itself, which Google's review-snippet
  rules make ineligible for stars. The schema function is removed and the
  homepage no longer emits it; no `Organization`/`LocalBusiness` node
  anywhere carries rating markup. The VISIBLE reviews section is untouched
  (`aggregateFor()` stays — it feeds the on-page score header, plain text).
  A comment in `src/lib/reviews.ts` documents why, and that `Product`
  schema with genuine per-product reviews is the only legitimate future
  route to stars — reviews we do not yet collect.
- **N2 — no Belgian dealer directory for Americans (option A).** The US
  homepage sent visitors to a Flanders/Wallonia/NL/LUX/AT dealer list.
  `dealerMarkets` in `src/lib/dealers.ts` (derived from the places'
  `primaryLocale` values + the deliberate recruitment locales, same idiom
  as `BlogPost.markets`) now market-restricts `/dealers`, `/dealers/
  [place]` and `/installer-training`: on `us` they 404
  (`dynamicParams=false` on the place route — which also turned the
  pre-existing 500 on unknown place slugs into a clean 404), drop out of
  the sitemap, and no domain advertises an en-US alternate for them
  (`buildAlternates`/`pageMetadata` gained `only`). Header, mobile menu,
  footer, /supply, /partners, /kit and the home installer band hide the
  dead links on `us` (the mega menu never carried them). The "Find your
  nearest dealer" CTAs (home CTA band, product pages, contact band) swap
  on non-dealer markets to the truthful direct-installation message —
  new keys `ctaBand.dealerDirect`, `productPage.dealerDirect`,
  `contactPage.directTitle/directBody/directCta` in all 14 message
  files. us.json also drops its four dead blog links (2× `/dealers`,
  2× the market-restricted premie post) and stops offering "Find a
  dealer" as a contact subject. Every other domain is unchanged.
  *Option B (US installer recruitment now): add a `usa` region with
  empty-`dealerIds` recruitment places and widen `primaryLocale` to
  include `'us'` — a commercial decision, deliberately not taken here.*
- **F12 — real sitemap freshness.** Every `<lastmod>` was request time
  (`new Date()` per fetch), telling Google nothing. Now: blog posts keep
  their own `dateModified`; products/applications/technical/materials/
  projects/dealer places carry a maintained `*UpdatedAt` constant in
  their data file (seeded from `git log -1 --format=%cs`, e.g. products
  2026-08-28 = the 6.5 m correction); static routes have an explicit
  `staticRouteDates` map in `site-config.ts`. The fallback is a single
  build-time constant — a route resolving to it means someone forgot to
  date it. `force-dynamic` dropped (the Host-header read keeps the
  handler request-dynamic); two fetches minutes apart are byte-identical,
  10 distinct honest dates, none in the future.

## 2026-08-30 (22) — Network audit fixes: liveness, crawl paths, redirects, reviews, US market

Fixes from the 30 Aug 2026 network audit (F1–F13), one task per commit.

- **T1/F2 — hreflang liveness.** `localeStatus` in `src/i18n/config.ts` marks
  `pt` (stretchteto.pt) and `no` (stretchtak.no) as `'pending'` — their
  domains do not resolve in DNS, yet every page and sitemap advertised them
  as alternates, breaking the reciprocal confirmation of the whole hreflang
  cluster. `buildAlternates`/`buildOgLocales` (seo.ts), the sitemap's
  xhtml:link alternates and x-default, and the language switcher now
  intersect with `liveLocales`; a pending locale's own domain serves an
  empty sitemap. Flipping one flag to `'live'` restores a locale everywhere.
- **T2/F3 — crawlable cross-domain links.** The 13 domains had not a single
  crawlable `<a href>` between them (the switcher used `<button>` +
  `window.location.assign`), leaving each domain an island — the likely
  cause of the zero-indexed .dk/.se domains. The language switcher and
  mobile menu now render real anchors (absolute sibling URL + `hrefLang`,
  JS behaviour kept as progressive enhancement), and the footer gains a
  quiet "STRETCH worldwide" row linking every LIVE sibling domain on every
  page, preserving the current path. New key `footer.worldwideHeading` in
  all message files (this pass also adds the Task-5 review chrome keys).
- **T3/F4 — UK/MT kit redirects.** `/product-category/stretch-kits/` on
  stretch-ceilings.uk (ranks #3 for "stretch ceiling kit", ~2/3 of UK
  clicks) redirected to the generic `/materials` hub because genericRules'
  `/product-category/:path*` catch-all fired first. Four kit rules now sit
  BEFORE the spread on both stretch-ceilings.uk and stretch.mt → `/kit`.
  A path-to-regexp audit of the whole file (Next's own matcher, real array
  order) found ZERO rules shadowed to a different destination; four
  case-only duplicate `/knowledge-base/` rules are dead-but-harmless and
  kept deliberately (they become live if caseSensitiveRoutes is enabled).
- **T4/F5 — Icelandic content redirects.** stretch.is had only the generic
  shop sweep; the old site's strongest page `/dukaloft/` (~312 clicks/yr)
  404ed. Seed content rules (before the spread): `/dukaloft` →
  `/products/pvc-stretch-ceiling`, `/sjalfbaert-dukaloft` →
  `/products/polyester-stretch-ceiling`. Full map awaits the GSC
  "All known pages" export for stretch.is.
- **T5/F10 — real reviews or none.** New `src/lib/reviews.ts`: a typed,
  EMPTY array of genuine Google reviews (author as published, market
  locale, rating, date, link to the actual public review, quote verbatim
  in its ORIGINAL language — never translated). The Reviews section is now
  mounted but renders NOTHING for a market without entries; the star score
  appears only from a computed aggregate of ≥3 genuine reviews. JSON-LD
  emits Review nodes for exactly what is displayed and AggregateRating
  only from the real array — a domain that shows no reviews emits no
  rating markup at all. The placeholder testimonials and the hardcoded
  `ratingDisplay` 5.0 score were deleted from content.ts; the
  `reviewsData` message namespace is no longer read. Honest provenance
  line under the section, localized.
- **T6/F13 — the US serves the US.** New `us` locale on stretchceiling.us
  (uk pattern: market code → en-US), status `'pending'` until Michael
  removes the Vercel domain redirect — then one flag flip activates it in
  hreflang, sitemap and switcher everywhere. `messages/us.json` is a
  full-parity Americanization of en.json: US spelling, imperial-first
  units with metric in parentheses, "excl. tax" phrasing, US date style —
  and NO EU fire-class claims (B-s1,d0 / EN 13501-1 replaced with neutral
  "flame-retardant, fire test documentation on request" wording pending
  Michael's answer on ASTM E84 / NFPA 286 testing). GA/Clarity env slots,
  usRules redirects, image remotePattern, US→us portal-login mapping.
  Open for Michael: USD pricing, US dealer/training routes, GSC export.

## 2026-08-08 (21) — SEO audit: three shadowing bugs fixed

Full-codebase SEO audit (metadata, hreflang, canonicals, sitemaps, robots,
structured data, portal noindex), verified against the rendered production
build per locale domain. Three real defects found and fixed — all cases of
an old file shadowing the newer host-aware implementation:

- **Deleted src/app/sitemap.ts** (old path-based sitemap): it was winning
  over app/sitemap.xml/route.ts, so every domain served ONE identical
  sitemap full of https://stretchplafond.com/<locale>/… URLs (which
  redirect on the real domains) and missing dealer/material detail pages.
  Now each domain serves its own host-aware sitemap: only its own URLs
  (142 on .nl, zero off-domain), xhtml hreflang + x-default on every
  entry, dealer/material routes included, portal excluded. Also fixes the
  `next dev` route-conflict crash the duplicate caused.
- **Deleted public/robots.txt** (stale static file): it shadowed
  app/robots.txt/route.ts, hardcoding `Sitemap: stretchplafond.be/…` on
  ALL 12 domains and missing the /portal disallows. Each domain now
  advertises its own sitemap and blocks the portal.
- **Deleted src/app/layout.tsx** (duplicate root layout): both it and
  [locale]/layout.tsx rendered <html>/<body>, producing nested documents
  where the FIRST <html> said lang="en" on every locale. Now a single
  <html> with the correct per-locale BCP-47 lang.

Verified healthy (no changes needed): per-domain canonicals; 13 hreflang
link tags (12 locales + x-default) on every page; per-page meta ×12 with
full key parity; portal noindex + robots disallow; /training 308 → the
canonical /installer-training; JSON-LD Organization/WebSite/LocalBusiness
(home), Product/BreadcrumbList/FAQPage (products), Article (blog); OG
image endpoint; real 404 status; llms.txt; AI crawlers explicitly
allowed; /architects present in sitemap, nav, footer and meta ×12.

## 2026-08-08 (20) — Order & quote from the pricelist + compact architect dashboard

- **Pricelist order basket** (client request): every price row gets a +
  button; a floating basket opens a drawer with quantity steppers, an
  optional note and a live total, submitted either as **Place order** or
  **Request a quote**. New POST /api/portal/pricelist-order: trade session
  required, every line RE-PRICED server-side from the RLS-scoped pricebook
  (client prices never trusted; unknown items rejected), ref PO-/QT-
  yyyymmdd-hhmm. Delivery reuses the designer-order pipeline: branded
  internal e-mail to the lead inbox + confirmation to the client (Graph →
  webhook → SMTP), order JSON attached, and the order stored in
  designer_orders so it appears under /portal/orders with a status the
  admin can advance. order-email.ts generalised for kind 'pricelist'
  (order vs quote wording, products table instead of the ceiling spec,
  optional note; designer e-mails unchanged). Demo mode acknowledges
  without sending/storing. i18n portal.pricelist ×12 (17 keys).
  E2E-verified: payload carries stable row keys + quantities, drawer
  totals correct, quote submit returns ref and renders the success state.
- **Architect dashboard decluttered** (client: advisor CTA too low, too
  much scrolling): the advisor is now a black strip directly under the
  heading (phone, e-mail, Book a call always in view); the datasheet and
  case-study folds start CLOSED and Events became a fold too — the page
  reads as a compact index (fold bars with counts) instead of a long
  scroll. Full-page height roughly halved.

## 2026-08-08 (19) — ARCHITECT AREA: second audience in the portal

Architects are focus #2 after B2B installers: one free account with everything
needed to SPECIFY a stretch ceiling. Iron pricing rule: architect accounts
NEVER see trade pricing — no pricelist, no designer, no pricebook data.

- **Account model**: AccountType gains 'architect' (4 tiers). The two leak
  traps on THIS branch are fixed: normalizeAccountType() maps architect
  BEFORE the installer fallback, hasTradeAccess() now enumerates
  producer/installer instead of "not b2c", and the pricebook RLS policy's
  tier case yields NULL for architect (matches no market — zero rows even if
  app code had a bug). priceGroupForTier() returns null for architects. New
  hasArchitectAccess() guards the architect surfaces. schema.sql: idempotent
  ARCHITECT AREA block (DO $$ drop-and-recreate the account_type check with
  the four-value set, add office/city columns, refreshed pricebook policy).
- **Signup**: "I am" segmented choice Client / Architect. Architect mode:
  office name (company field relabelled) + contact + phone + city; instant
  access after e-mail confirmation, no admin approval. accountType/office/
  city ride in the auth metadata so the login self-heal recreates an
  architect profile, not b2c. /portal/login?signup=architect pre-selects
  Architect (used by the landing CTA).
- **Admin**: 4-option tier select + account-type filter; office/city shown in
  the qualification line.
- **Architect dashboard** ((app)/page.tsx branches to ArchitectDashboard):
  Project tools (budget-guide tile, register-a-project + sample-box CTAs
  pre-filled from the profile) · Library (29 one-click datasheets via
  /api/architect/datasheet/[slug] — each download stored as a
  portal_architect_download lead row; spec texts NL/FR/EN, CAD/BIM, photo
  sets, 2 measured case-study cards with result rows) · Events (events.ts:
  3 trainings + 2 lunch&learns, past events auto-hidden, one-click register
  modals) · Advisor card. Resources from architect-resources.ts +
  repo-root architect-private/ (README lists expected files); missing file
  → "coming soon" badge + disabled button, route 404s. Demo architect
  account architect@stretch.be / stretch2026 (downloads disabled).
- **Budget guide** /portal/budget-guide (architect + admin only, b2b/b2c
  redirect): indicative €/m² bands from hand-edited budget-bands.ts —
  PLACEHOLDER ranges, Michael sets the real ones. Header comment forbids
  ever importing pricebook data there; grep-verified the page and dashboard
  import no portal/data or pricebook source. Prominent disclaimer +
  register-your-project CTA.
- **Modal plumbing**: OpenOptions.prefill (generic pre-fill used by the
  datasheet edit step too), new 'project' modal type (9 fields, stable
  optionValues for buildingType/system/stage) → /api/lead with source
  architect_project; SOURCE_LABELS/FIELD_LABELS extended.
- **/architects landing** ×12 (hero, 8 value blocks, how-it-works, next
  events, 2 case teasers with one measured metric, 4 FAQs incl. the pricing
  answer, signup CTA) + sitemap entry + footer link + mega-menu category 3
  (append-only, cats 0/1 untouched) + mobile-menu entry + meta keys.
- **Flywheel**: public datasheet requests with role=architect get an invite
  paragraph in the e-mail (extraParagraph hook) and an invite line in the
  modal success state, both linking /architects.
- E2E-verified: architect demo sees the dashboard; /portal/pricelist and
  /portal/designer redirect; budget guide renders 5 bands for architect,
  redirects installer; installer still reaches the pricelist; signed-out
  hits on /api/architect/* → 403; coercion audit 0 hits; all new keys = 12
  files.

## 2026-08-08 (18) — DATASHEET GATE v2: bigger form + e-mail-only delivery

Datasheets are no longer instant downloads: the visitor leaves five details
(name · role · e-mail · phone · city) and the PDF arrives by e-mail as a
signed 14-day link. Lead capture unchanged (deliverLead + storeLead).

- **Stable role values**: FormField.optionValues (parallel to options) —
  selects submit stable keys (architect/installer/private/other), never a
  localized label; localizeModalConfig localizes labels only. Verified in
  the posted payload.
- **PDFs moved out of public/**: all 29 live in repo-root datasheets-private/
  (README lists exact filenames); Datasheet.file is now the bare filename;
  no public /datasheets/*.pdf works (404, grep-verified no references).
  next.config.mjs ships the folder via experimental.outputFileTracingIncludes.
- **Signed links**: datasheet-links.ts — HMAC-SHA256 over slug+exp
  (base64url, 14 days, DATASHEET_SIGNING_SECRET env, timingSafeEqual,
  obviously-dev fallback + warn when unset; documented in the README env
  table). GET /api/datasheet/[slug]?t=&l= streams the PDF; invalid/expired/
  unknown → branded 410 page localized via the validated l param
  (datasheetLink namespace ×12); file missing → 404 JSON.
- **POST /api/datasheet-request**: clean() sanitisation + honeypot; role/
  slug/locale validated; best-effort in-memory rate limit 8/h/IP (429
  rate_limited); lead delivered + stored exactly as /api/lead (source
  pdf_download, datasheetSlug, downloadedFile, role, city, referer page);
  visitor e-mail via new transactional.ts (Graph → webhook → SMTP — the
  branch's Resend-free chain; recipient never logged, domain only). No
  provider configured (or all fail at runtime) → { mode:'download', url }
  and the modal falls back to the old instant download.
- **Visitor e-mail**: datasheet-email.ts — table layout, inline CSS, no
  external images: black STRETCH® header, red download button, plain-URL
  fallback, 14-day note, contact footer + soft CTA; text/plain alternative;
  extraParagraph hook (used by the architect invite). datasheetEmail
  namespace ×12.
- **Modal**: datasheet flow posts the five fields + slug + locale; success
  state = "check your inbox" with the address + spam note (fallback mode
  keeps the manual download button); 429 shown inline; analytics identical.
  Returning visitors (localStorage 'datasheet-contact', v1, 30 days, guarded
  try/catch): compact confirm step "Send {title} to {email}?" + one-click
  send (posts a FULL lead every time — verified: second sheet's one-click
  posted its own slug) + "Not you? Edit details" pre-filling the form.
- **Portal documents** page now mints fresh signed links per render (files
  left public/); technical hub pages keep their gated per-sheet rows (this
  branch already had them — richer than the spec's single-slug plan, so
  TechMembrane.datasheetSlug was not needed).
- **Copy** ×12: modals.datasheet (5 fields incl. localized role options,
  confirm/fallback/rateLimited), datasheetsPage lead + privacy note now name
  the five fields and e-mail delivery.
- Verified with curl + Playwright on the production build: fresh link
  downloads (200, application/pdf), tampered + expired + unknown slug → 410
  in the link's locale, missing file → 404, localized role label → 422,
  honeypot → silent ok, no-env → mode download with working fallback.

## 2026-08-08 (17) — Type filter made primary + B2B signup

- **Pricelist filter hierarchy flipped** (client: "type must be the main
  filter"): the Type selector is now large display-font blocks (equal-width,
  2px border, active = black fill + red bottom bar + red count badge)
  directly under the title; the category tabs shrank to a compact quiet row.
  Fixed a real state bug found via screenshot: :hover (specificity 0,2,0)
  beat .plv__type--on (0,1,0), so the active block lost its black fill under
  the cursor leaving white-on-white text — hover now scoped with
  :not(.plv__type--on). demo-pricebook.json regenerated from the fabric
  workbook (1,388 rows, both types, three tier markets) so demo mode shows
  the full two-level filtering; verified with Playwright screenshots (all
  types + fabric active, hovered and idle).
- **B2B-grade signup** (client: "we are B2B focussed"): Create account now
  requires Company, Contact person, Phone, VAT number, Country (localised
  names via Intl.DisplayNames, 21 countries + Other) and Business type
  (installer / distributor / architect / contractor / other). Stored on
  portal_users (5 new nullable columns + add-column-if-not-exists migration
  in schema.sql; retry-without-columns fallbacks in signup and login
  self-heal keep un-migrated DBs working; details also mirrored into the
  auth user metadata so self-heal can rebuild a full profile). Admin panel
  shows the qualification line under the company (contact · phone · VAT ·
  country · type) and the users API accepts admin edits of those fields.
  i18n: portal.login keys + new portal.businessTypes namespace ×12; account
  still starts as B2C until an admin upgrades the tier after review.
- Client action: run the new portal_users migration block (5 alter lines)
  in supabase/schema.sql.

## 2026-08-08 (16) — Pricebook: Type column, 1000-row cap fix, Type→Category filter

Client uploaded PriceBook v2.4 (1,504 rows incl. new fabric range + "Type"
column) and saw only 1,000 items — Supabase/PostgREST caps EVERY response at
1,000 rows regardless of .limit().

- **All pricebook reads now paginate** (.range() in 1,000-row pages until a
  short page): portal query (data.ts), admin sync diff read (sync/route.ts)
  and the CLI seeder (seed-pricebook.mjs). The full pricelist reaches the
  portal regardless of size.
- **New `type` column** end-to-end: PriceRow (types.ts), schema.sql
  (create table + `add column if not exists` migration for live DBs), the
  workbook parser + seeder (optional "Type" header), the sync route and the
  pricelist CSV export. Missing-column fallbacks everywhere: reads retry
  without `type`, the sync upserts without it and warns in the report — an
  un-migrated database keeps working, just without the filter.
- **Pricelist UI: two-level filtering.** New Type strip (black/red segmented
  buttons with counts, only rendered when the data has >1 type) above the
  toolbar; category tabs recompute from the selected type — filter Type
  first, then Category, as requested. i18n keys portal.pricelist.type /
  allTypesOpt in all 12 locales.
- Verified against the uploaded v2.4 workbook: 1,388 priced rows parse
  (901 PVC / 487 fabric), 116 rows skipped because they carry no price in
  the Excel at all (listed in the admin upload report).
- Client actions: run the pricebook migration line in supabase/schema.sql,
  then re-upload the workbook in /portal/admin so `type` gets populated.

## 2026-08-08 (15) — PriceBook v2.4: price groups ARE the tiers

- Client uploaded Alto PriceBook v2.4 (1017 rows): the ten old price groups
  (West/East Europe, USA, Tier: … etc.) are GONE — every product now has one
  price per account tier: 'Producer/Reseller' (339) / 'Installer' (339) /
  'B2C' (339; 116 rows skipped for missing EUR price). This is what the
  earlier 3-option screenshot was about, and why the client's installer test
  account showed "0 items" (its granted markets no longer exist as groups).
- Visibility now follows the tier automatically: priceGroupForTier() maps
  producer→'Producer/Reseller', installer→'Installer', b2c→'B2C'.
  PRICE_MARKETS = those three; markets[] demoted to OPTIONAL extra grants
  (e.g. hand an installer the producer column). Enforced in the RLS policy
  (tier clause tolerant of label spellings in account_type) + demo filter;
  admin/all_markets unchanged. Create-account "select at least one market"
  validation removed; admin labels renamed Markets→Price groups ×12; portal
  nav shows the tier group. B2C accounts still have NO pricelist access
  (gate unchanged) even though a B2C price column now exists — client to
  decide whether consumer logins should see it.
- demo-pricebook.json regenerated from v2.4 (901 rows, 3 groups); demo
  users' stale market grants cleared; docs/PORTAL.md rewritten accordingly.
- schema.sql: pricebook_read policy updated in place + migration note; run
  the policy block + `update portal_users set markets='{}' where not
  (markets <@ array[...])` on the live DB.

## 2026-08-08 (14) — Three account tiers: Producer/Reseller · Installer · B2C

- Client adjusted the account model: the b2b/b2c split becomes THREE tiers.
  AccountType = 'producer' | 'installer' | 'b2c'; trade access (pricelist,
  designer, orders) = admin OR any non-b2c tier — hasTradeAccess() is the
  single gate everywhere, so producer and installer behave identically for
  now (pricing differences stay market-driven via the markets[] grants).
- normalizeAccountType() maps whatever is stored to a canonical tier —
  tolerant of display labels typed straight into Supabase ("Producer/
  Reseller", "Installer", "B2C") and of legacy 'b2b' rows (→ installer).
  Used at every read (auth.ts session, users API list) and write (users API
  create/update).
- AdminPanel: the B2B/B2C pill + "Upgrade/Set" toggle link replaced by a
  3-option tier dropdown per user row; create form gains an account-type
  select (markets section hidden for B2C). Labels translated ×12
  (typeProducer/typeInstaller/typeB2c + colType; makeB2b/makeB2c/typeB2b
  keys dropped).
- schema.sql: account_type default 'installer', check
  ('producer','installer','b2c') + run-once ACCOUNT TIERS migration block at
  the bottom (drops old check, maps existing values incl. hand-edited
  labels, re-adds canonical check). Client must run it in the Supabase SQL
  editor — until then the app still works because reads are tolerant; only
  admin-panel tier WRITES could be rejected by a hand-made constraint that
  doesn't allow canonical lowercase values.
- Demo users: west client = installer, east client = producer.

## 2026-08-08 (13) — Resend removed entirely (zero clutter)

- Graph mail verified live: test order STR-20260808-1613 delivered via graph
  for both e-mails (internal + dealer confirmation, all attachments) from
  info@stretchgroup.be, using a dedicated app registration for this website
  (the reused Sufit app was blocked by the tenant's ApplicationAccessPolicy —
  per-app, so a fresh app bypasses it; client advised to add a RestrictAccess
  policy for the new app scoped to info@).
- Client deleted RESEND_API_KEY and asked for zero clutter → Resend stripped:
  branches removed from deliver.ts + order-email.ts, method unions narrowed,
  `resend` npm dependency uninstalled, README env table/priority/checklist
  rewritten Graph-first. Chain is now graph → webhook → smtp → log (webhook
  and SMTP stay: dependency-light, unconfigured, and Microsoft-compatible
  escape hatches — e.g. Power Automate or smtp.office365.com).
- NOTE: with only Graph configured, a Graph failure (realistic case: client
  secret expiry, ~24 months) means orders are stored + visible in /portal/orders
  but NOT e-mailed (summary log line shows "NOT delivered"). Client warned to
  diary the secret expiry.

## 2026-08-08 (12) — E-mail via Microsoft 365 (Graph) — client wants fewer tools

- New src/lib/msgraph-mail.ts: sends through the company's own Exchange
  Online mailbox via Microsoft Graph (client-credentials, plain fetch, zero
  new npm deps; token cached across warm invocations; attachments + reply-to
  + Sent Items). Wired as the FIRST transport in BOTH chains: designer order
  e-mails (order-email.ts) and website leads (deliver.ts); chain now
  graph → resend → webhook → smtp → log. Graph honours recipients, so the
  dealer confirmation flows through it too.
- Setup documented in msgraph-mail.ts header: Entra app registration with
  APPLICATION permission Mail.Send + admin consent + client secret; env vars
  MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MS_GRAPH_SENDER (shared
  mailbox works, no licence needed). Optional ApplicationAccessPolicy to
  scope the app to that one mailbox. RESEND_API_KEY can be removed once
  Graph is live.
- Not live-testable from the sandbox (no tenant credentials/egress) —
  request shapes follow the standard Graph sendMail contract; verify with
  one test order after setting the env vars.

## 2026-08-08 (11) — Order e-mail fixes from live test + automatic design saving

Live test findings (client): both e-mails arrived at leads@ and neither had
attachments → delivery runs through the generic LEAD_WEBHOOK_URL relay, which
mails a FIXED inbox and forwards only subject/body. Plus designer_designs
stayed empty (cloud save was manual-only). Fixes:

- **Documents now survive any relay**: order PDFs/DXF/JSON are uploaded to a
  private Supabase Storage bucket (designer-orders, schema.sql) and both
  e-mails carry 30-day signed DOWNLOAD LINKS next to the native attachments.
  File index stored on the order row (designer_orders.files jsonb, with
  un-migrated-schema retry).
- **No more duplicate at leads@**: the dealer confirmation is recipient-
  critical — it now only sends via Resend/SMTP (transports that honour the
  recipient); via webhook-only setups it is skipped (confirmed:false) instead
  of landing in the lead inbox.
- **Designs save automatically**: the first autosave tick with real
  measurements silently CREATES the design row (updates in place afterwards);
  the ☁ Save button remains for naming/explicit saves. Example room excluded.
- ACTION for client: re-run schema.sql bottom blocks (storage bucket + files
  column). RECOMMENDED: add RESEND_API_KEY (or SMTP_*) in Vercel env so real
  attachments + the dealer confirmation work end-to-end.

## 2026-08-08 (10) — Designer order e-mails: branded layout, attachments, confirmation

- **Branded HTML order e-mail** (was: monospace text dump): black STRETCH®
  header, red section labels, dealer/client blocks, ceiling-specification
  table, itemised price table with total — built from the STRUCTURED order
  object (order-email.ts buildOrderEmailHtml), text summary kept as fallback.
- **Documents attached**: the designer now uploads the generated floorplan
  PDF, production PDF and DXF with the order (base64, ≤3 MB total, 8-file cap,
  sanitised names — Vercel's 4.5 MB body limit respected) and the server adds
  the order JSON itself; all attached to BOTH e-mails.
- **Dealer confirmation e-mail**: every order now sends a second branded
  e-mail to the dealer ("Your STRETCH order … — received", reply-to =
  leads inbox) with the same attachments; the designer's success message
  says a confirmation is on its way (response field `confirmed`).
- Verified: typecheck + build green; demo E2E confirms the order POST carries
  the PDF+DXF payload and the single ZIP download still works; both e-mail
  variants rendered and visually checked.

## 2026-08-08 (9) — Homepage "Selected work" photos match their titles

- The five-tile strip took its TITLES from the first five projects in
  content.ts but its PHOTOS from five static /images/home/gallery-*.jpg
  slots — after the portfolio reshuffle every tile showed the wrong photo.
  Gallery.tsx now uses each project's own hero (p.image) with the static
  slot only as fallback, so the strip stays correct as the portfolio
  changes. Verified: all five tiles render their own hero.

## 2026-08-08 (8) — Ceiling designer: server orders, cloud designs, order history

- **Orders now reach STRETCH reliably** (was: mailto-only, nothing server-side):
  new POST /api/portal/designer/order stores every order in designer_orders
  (best-effort, service-role) AND e-mails it from the server (Resend→webhook→
  SMTP→log chain, order JSON attached; reply-to = dealer). The designer's
  "Place order" now bundles floorplan PDF (+production PDF) + DXF + order.json
  into ONE ZIP (browser multi-download blocking solved), POSTs the order, and
  only falls back to the old mailto flow when the server is unreachable.
- **Designs are saved**: designer_designs table + /api/portal/designer/designs
  (list/load/save/delete). New PORTAL BRIDGE inside the designer HTML adds a
  "☁ Save" button + "My designs" picker in the toolbar, cloud autosave for
  loaded designs, and a browser crash-net autosave (localStorage, restore
  banner after reload). Serve-time PORTAL_USER injection shows "Ordering as
  <company>" above the order button.
- **NEW /portal/orders** (trade): dealers see their own order history with
  status badges; admins see all orders and can change status
  (received/confirmed/in_production/delivered/cancelled) via
  /api/portal/designer/order/status. Orders nav item ×12 + overview tile
  flipped live for trade accounts (stays "soon" for b2c). portal.orders
  namespace translated ×12.
- **Usage events**: designer_events table + /event route (open, cloud_save,
  cloud_load, order_attempt, order_fallback, order_placed).
- Zero-config degradation preserved: demo mode acknowledges but never stores/
  sends; without the new tables the designer still works (file save + ZIP +
  server e-mail; history shows "unavailable"). ACTION REQUIRED to activate
  storage: run the new DESIGNER block at the bottom of supabase/schema.sql in
  the Supabase SQL editor.
- Deferred on purpose (client decision): live pricing from the pricebook DB
  (designer still uses its embedded price matrix).
- Verified: typecheck + build green; demo-mode E2E (Playwright): login → nav
  shows Orders → APIs answer demo-safe → designer bridge boots, cloud UI
  hidden in demo, example room → Place order downloads ONE valid ZIP (3 files)
  + demo notice, zero JS errors.

## 2026-08-08 (7) — Application hero titles no longer hidden behind the photo

- On the 5 application pages the global .h1 (up to 8.5vw/142px) overflowed its
  grid column on long words, painting UNDER the hero image (client screenshots:
  BATHROOMS/KITCHEN/WELLNESS/ACOUSTICS all clipped). Scoped fix in
  ApplicationPage.tsx: .ap-hero .h1 sized clamp(30px,3.6vw,48px) — calibrated
  so the longest localized word (13 glyphs, nl "thuisbioscoop"/"wandakoestiek")
  fits the column in all 12 locales — with break-word as last-resort guard.
  Verified at 1728px on nl/en/de worst cases.

## 2026-08-08 (6) — Pricing article localized per market currency

- The "What does a stretch ceiling cost?" blog post (spanplafond-prijs) showed
  EUR values on every domain. Now per market: PL in PLN at Polish market
  levels (150–450 zł/m² netto: basic 150–200, print 200–250, acoustic
  250–350, backlit 300–400, bathroom 350–450 — client's reference site
  sufity-pawbud.pl unreachable from the sandbox, figures market-informed,
  FLAGGED for client verification); DK/SE/NO/IS get the EUR ranges converted
  and rounded (DKK 500–1.500 kr., SEK 800–2 300 kr, NOK 800–2 300 kr,
  ISK 10.000–30.000 kr.). The 7 euro-market locales keep €70–200. Audit
  confirmed no other namespace carries money values.

## 2026-08-08 (5) — Johnson & Johnson photos

- Client uploaded 3 photos via GitHub to main (14–17 MB each, "Johnson &
  Johnson*.jpg"). Merged main into the PR branch, optimized to 1920px web
  JPGs (~440 KB each) as johnson-and-johnson-{hero,canteen,canopy}.jpg,
  wired hero + 2-photo gallery into the project entry, and deleted the raw
  originals so main is clean after merge.
- Still outstanding: BeA tacker photo for "Air tools & tackers" (materials) —
  pasted images don't arrive as files; needs zip or GitHub upload.

## 2026-08-08 (4) — Materials page images

- **Fabrics:** "Polyester stretch ceiling on the roll" now uses a copy of the
  pvc-roll photo (polyester-roll.jpg, client request); "Polyester stretch
  ceiling kit (DIY)" gets the DIY-kit product photo from the client's photo
  zip (fabric + absorber pads + profile).
- **Accessories:** "Invisible ceiling speaker" gets the install render
  extracted at full resolution from the invisible-speaker datasheet PDF
  (the client's pasted image matched it 1:1).
- "Air tools & tackers" (BeA tacker photo) still without image — the pasted
  image couldn't be saved from chat; client asked to re-send as a file.

## 2026-08-08 (3) — 4 placeholder projects deleted, 4 real projects get photos

- **Deleted (client request):** city-penthouse-antwerp, wellness-spa-bruges,
  home-cinema-ghent, private-villa-knokke — removed from content.ts, from the
  projects + projectCards.metas namespaces ×12, and the now-empty "Home
  cinema" portfolio filter dropped (content.ts + inspirationPage.filters ×12,
  index 6). dealers.ts local-project links remapped: Antwerpen →
  creneau-afas-lounge, Gent → candor-sint-martens-latem, West-Vlaanderen/
  Brugge → none. Portfolio now 21 projects.
- **Photos wired from client zips (photographer sets):** da-tweekaz-studio
  (hero + control room), mark-with-a-k (hero + ceiling detail),
  notary-ampe-anthony (hero + 3: reception, circular recess, lounge — note:
  photos show the office's current "Ampe & Depuydt" branding).
- **london-chapel corrected + photographed:** the old copy described a backlit
  ceiling; the actual project (dealer Upholster London) is acoustic FABRIC
  WALLING through a chapel-turned-home plus a fabric-lined vaulted ceiling and
  a fabric-walled home cinema. Entry rewritten (cat Light & Print → Living
  room, dealer fact added), re-translated ×12, hero + 9-photo gallery.
- 3 loose photos in the request (printed forest-canopy ceiling + moss rings in
  an industrial office) match no known project — parked, client asked.

## 2026-08-08 (2) — Boost Wellness fixes, event-hall photos, datasheets surfaced

- **Boost Wellness corrections (client feedback):** year fact 2025 → 2026
  (content.ts + ×12 messages); Maison Max fact now links to
  https://www.maisonmax.be/.
- **Event-hall photos wired:** the old van-der-valk-beveren project (event hall)
  gets a hero + 6-photo gallery from the "Foto website/Van der valk" install
  set — dismantling the old dimpled black ceiling, membrane tensioning, cove
  lighting/hatch details, seamless finish around the textile columns
  (public/images/projects/van-der-valk-beveren-*.jpg). Both featured tiles on
  /inspiration now carry real photos.
- **Datasheets surfaced where people look for them** (client couldn't find
  them): (1) /technical/{polyester|pvc}/datasheet now lists the membrane's
  PDFs with gated download buttons + an "all datasheets" link
  (membraneDatasheets map in datasheets.ts); (2) NEW /portal/documents —
  the full library with DIRECT downloads (no lead gate) for signed-in
  clients; portal overview "Documents" tile flipped from "Soon" to live and
  a Documents item added to the portal nav. New strings ×12:
  techPage.downloadsTitle/allDatasheets, portal.nav.documents, portal.docs.

## 2026-08-08 — Van der Valk "Boost Wellness" project page + real datasheet library

- **New featured project page ×12** (/inspiration/van-der-valk-boost-wellness):
  the complete wellness renovation of Van der Valk Hotel Beveren, reopened as
  Boost Wellness (boostwellness.be), interior design by Maison Max (Temse).
  700 m² / 6-month renovation; story covers the 20-year Plafondlux full-circle
  (Benjamin → Michael Nicasens), Tim & Paulina's collaboration, PVC in wet
  zones vs ultra-matte polyester in changing/massage/nail rooms, and the
  printed brown spa ceiling following the organically curved wall with its
  curved-edge circular skylight (prefab aluminium lightbox elements). Facts,
  6 highlights, 10 materials, 4 FAQs, 7 linked solutions. Photo set from the
  client processed to web JPGs: hero + 11 gallery images
  (public/images/projects/van-der-valk-boost-wellness-*.jpg). Placed first in
  content.ts → leads the Featured pair and the portfolio grid. Translated into
  all 12 locales (projects + projectCards.metas namespaces); be.json kept on
  the site's "spanplafond" terminology. Portfolio now 25 projects.
- **Datasheet library goes real:** 29 actual PDFs (client-supplied) added under
  public/datasheets/ with clean kebab-case names, and datasheets.ts rebuilt —
  7 categories (Ceiling systems, Acoustic, Light & backlit, Prefab &
  accessories, Specials & outdoor, Profiles & installation details,
  Maintenance) with spec-accurate one-line descriptions extracted from the
  documents themselves, real file sizes. Replaces the 5 placeholder entries
  whose files 404'd. Docs that are Dutch-only are marked "(NL)".
- **Housekeeping:** added .gitignore (node_modules/.next/tsbuildinfo/env) — the
  repo had none.
- Verified: typecheck + `next build` green; page prerenders in all 12 locales;
  smoke-tested en/be/fr/pl rendering (hero + gallery + no MISSING_MESSAGE),
  inspiration listing shows the new featured card, datasheet PDFs serve 200.

## 2026-08-07 (8) — LU + Wien dealer pages, mega-menu applications, SEO audit (build 1844)

- **Dealer directory phase 2:** new regions in dealers.ts (DealerRegion +
  'luxembourg' | 'austria'; primaryLocale + 'de'): /dealers/luxembourg
  (Grand-Duché overview), /dealers/luxembourg-ville, /dealers/esch-sur-alzette
  (fr; "Plafond tendu Luxembourg-Ville — …") + /dealers/wien (de; "Spanndecke
  Wien — …", 755 impr/yr on the old .at). All recruitment variant. Overview
  page shows 5 region sections (regionLuxembourg/regionAustria labels ×12).
  59 places total.
- **Mega menu:** pool-wellness + walls inserted in the Applications category
  (skeleton + megaMenu.solutions.cats[4].items ×12 — titles/subs reuse the
  already-translated applications strings; "All inspiration" stays last).
  Verified in-browser: 5 application links render localized.
- **SEO audit (dev-verified):** per-domain sitemap contains every route family
  (dealers incl. the 4 new, applications 5, blog 14 incl. clipso + prijs,
  materials 6, projects 24) + hreflang alternates; host-aware robots.txt OK
  (per-domain sitemap URL, AI crawlers welcomed, only /api/ disallowed);
  0 MISSING_MESSAGE.
- Build 1796 → **1844** (+4 dealer places ×12). content.ts slugs 38.

## 2026-08-07 (7) — fix: blog index now shows the hero photos

- The /blog overview card rendered Placeholder WITHOUT the src prop, so every
  card showed the branded placeholder even when the post has a hero image.
  Fixed: src={p.image} + alt + sizes on the index card (article pages were
  already correct). Posts without a photo still fall back to the placeholder.

## 2026-08-07 (6) — Photo batch, 2 project pages, competitor B-batch (build 1796 pages)

- **19 photos wired** (Michael's Website.zip, checklist names): VAP Sint-Pauwels
  + DHL Zaventem hero+gallery (coming-soon chips GONE), 6 blog heroes
  (planchetten, scheuren, plafondhoogte, buiten, afwassen, schuin-dak),
  5 materials (tracklight-profile/-system, polyester-wool-panels,
  acoustic-islands, acoustic-wall-panels). 2 extra ZEBRA photos staged
  (project awaits details).
- **2 new project pages ×12** (details from altodesign.pl): creneau-afas-lounge
  (AFAS Dome Antwerpen, Creneau International; black gloss ±90% + acoustic
  backing, 250 m² in 3 days, factory-cut LED/audio) + candor-sint-martens-latem
  (Goedele Perdu + Form Design = our dealer; RT60 <0.8/<0.6 s, micro-perforated,
  demountable). Portfolio now 24 projects. Photos curated from projzips.
- **Competitor B-batch:**
  · Blog post `clipso-spanplafonds` ×12 (slug = old URL, 33 clicks/yr; nl title
    "Clipso spanplafonds…", "akoestisch spandoek"; fr "plafond tendu Clipso",
    "toile tendue acoustique") — intercepts PolyGroup/Phonotech brand traffic.
  · 2 new APPLICATIONS ×12 (+ has() guards in ApplicationRoute): pool-wellness
    ("Zwembaden & wellness") + walls ("Spanwanden & wandakoestiek").
  · Acoustic product RENAMED fr "Plafond tendu acoustique" (1.8K impr) /
    nl+be "Akoestisch spanplafond" (2.9K impr) — title/H1/nav = the keyword.
  · fabrics metaDescription fr/nl now names "toile acoustique en rouleau" /
    "akoestisch doek op rol" (45 clicks/yr proof).
  · Fabrics 5th item: "Polyester stretch ceiling kit (DIY)" ×12 (UK: 66% of
    .uk clicks) — appended index-safe.
  · Manufacturer USP: footer tagline reworded ×12 ("manufacturer, not
    importer, Belgian production") + new first "Straight from the manufacturer"
    card on /partners (Factory icon; WHY_ICONS got a fallback so extra cards
    cannot crash prerender again).
- Fixed: mojibake from unicode_escape insertion (em dashes/bullets); partners
  prerender crash (icon array shorter than cards).
- Verified: typecheck, build 1796/1796 (was 1736; +24 project, +12 blog,
  +24 application pages), 0 MISSING_MESSAGE. content.ts slugs now **38**.
- Still placeholder: 6 blog heroes (geluidsoverlast, klimaat, zelf-plaatsen,
  sterrenhemel, prijs, what-is), speaker, air-tools, polyester-roll, kit photo,
  installer.jpg, about/contact/cta-band, prefab pairs, Bert Demasure print.

## 2026-08-07 (5) — leads stored in Supabase (in addition to e-mail)

- **New table `public.leads`** (supabase/schema.sql, safe to re-run): every
  enquiry from /api/lead — contact, quote modals, materials inquiry, dealer
  pages — is inserted with source, contact fields, product/colour/items,
  the page it was sent from (referer), delivered flag + delivery method, and
  the full raw payload as jsonb. Indexes on created_at + source. RLS enabled
  with NO policies: only the service role writes; read via Supabase dashboard.
- **`src/lib/lead-store.ts`** (best-effort): uses createServiceClient();
  without env vars or on any error it logs one line (no PII) and never blocks
  the lead — e-mail stays the notification path, the table is the history.
  On delivery failure the lead is stored anyway (delivered=false).
- Michael: run the new schema block once in the Supabase SQL editor
  (leads-table.sql delivered separately). Env vars already set (portal live).
- Confirmed by Michael today: price-guide ranges correct; copy review done;
  LEAD_WEBHOOK_URL live (e-mails arrive).

## 2026-08-07 (4) — DEALER DIRECTORY phase 1 live: 55 places, 11 dealers (build 1736 pages)

- **New /dealers section** (control panel `src/lib/dealers.ts`): overview page
  (3 regions: Flanders & Brussels / Wallonia / Netherlands, province cards +
  city chips, "Dealer" vs "Dealer wanted" tags, recruitment band) + 55 place
  pages `/dealers/<place>` — 12 Flemish cities + 5 Flemish provinces, 7 Walloon
  cities + 5 provinces (all recruitment variant), 14 Dutch cities + 12
  provinces. Slug collisions solved: provincie-antwerpen, provincie-utrecht,
  nederlands-limburg, province-de-liege/-namur/-luxembourg.
- **Two page variants:** certified-dealer card(s) (badge, quote CTA source
  `dealers_<place>`, external "Visit website") or **recruitment variant**
  ("Become our STRETCH dealer in {place}" black band → /partners + quote CTA).
  Plus why-STRETCH 3-up, local project cards (mapped: Antwerpen→Polette/City
  Penthouse, Gent→Home Cinema, Brugge→Wellness Spa, Brussel→BNP, Lokeren→Vier
  Emmershof, Sint-Niklaas→VAP/VDB-222, Dendermonde→Veta, provinces likewise),
  nearby-places chips, breadcrumb JSON-LD.
- **11 dealers wired** (Michael's list): Strak Spanplafonds (Antwerpen),
  Plafondlux (Gent/Lokeren), Pla-fon (Roeselare/Brugge/W-Vl), Parket Valentin
  (Ninove/Aalst), Formdesign (Dendermonde), Corpus Interieur (Sint-Niklaas),
  Flex Spanplafonds (Leuven/Hasselt/VB/Limburg), Q82 Acoustics (ZH/Gelderland/
  Overijssel cities), De Spanplafond Concurrent (Amsterdam/NH), Spannende
  Plafonds (NB/Utrecht/NL-Limburg cities), Maas Afbouw (Zeeland). Brussel +
  all Wallonia + Flevoland/Friesland/Groningen/Drenthe = dealer wanted.
- **Copy = 36 template keys** (`dealersPage` ns, {place}/{province} ICU slots
  — adding a place needs NO new translations) ×12 languages; keyword-first
  metaTitles (nl "Spanplafond {place} — …", fr "Plafond tendu {place} — …").
  Footer: new "Dealer network" link (footer.dealers ×12). Sitemap + staticRoutes.
- Verified: typecheck, build **1736/1736** (was 1064; +660 place pages + 12
  overview), 0 MISSING_MESSAGE; spot-checks be/antwerpen (dealer card),
  be/brussel (recruitment), fr/liege, nl/zeeland (Maas Afbouw), nl/rotterdam.

## 2026-08-07 (3) — P2 part 1: price guide + 3 materials additions (build 1064 pages)

- **Price guide** as blog post `spanplafond-prijs` (slug = old URL, 19.3K impr/yr;
  "spanplafond prijs" query 6.4K impr) ×12 languages. Ranges = Michael's own
  published old-page figures (excl. VAT, incl. installation): basic €70–90/m²,
  printed €90–100, acoustic €100–150, translucent/backlit €130–160, bathroom
  €150–200; speciality = per design. Framed as indicative; funnels to free
  quote + partner account for trade pricing. ⚠ ranges date from the 2023 page —
  Michael to confirm they still hold.
- **Materials: 3 additions with proven search demand** (all appended at END of
  item arrays — index-safe for the materialsData overlay):
  · accessories + "Invisible ceiling speaker" (old shop 32 clicks/yr)
  · tools-cleaning + "Air tools & tackers" (BEA; 33 clicks/yr)
  · NEW 6th group **acoustic-panels** (old category 42 clicks/yr): polyester
    wool panels, ceiling islands & baffles, wall panels. Group page ×12 locales
    (+12 pages), overview now 6 cards. Photos = placeholders.
- Translations ×12 (blogPosts.posts + materialsData) — nl "Wat kost een
  spanplafond? Een eerlijke prijsgids" / "Akoestische panelen".
- Verified: typecheck, build 1064/1064 (was 1040; +12 price post, +12 group),
  0 MISSING_MESSAGE, content.ts slug count 35. Dealer directory = P2 part 2,
  still open.

## 2026-08-07 (2) — P1: the 10 knowledge-base articles, recreated ×12 languages

- **10 blog articles added** (content.ts blogPosts; now 12 posts, content.ts
  slug count 24 → 34; build 920 → **1040 pages**). Recreated from the old
  site's top organic pages — together 62% of stretchplafond.be's clicks:
  houten-planchetten-plafond-renoveren-of-vernieuwen (734/yr), scheuren-in-
  plafond-herstellen (265), de-ideale-plafondhoogte (128), geluidsoverlast-
  van-uw-bovenburen (102), spanplafond-buiten (67+47, both old outdoor URLs →
  one article), klimaat-plafond (63), kan-je-een-spanplafond-afwassen (47),
  spanplafond-zelf-plaatsen (44), schuin-dak (28), sterrenhemel (48).
- **Slugs = the old Dutch URLs** so the 301s are near-exact
  (old /<slug>/ → /be/blog/<slug>).
- EN source rewritten (not copied) in house tone; facts preserved from the
  old articles (P60–P100 sanding, 24–48 h drying, 2.50/2.20/2.40/2.60/3.00 m
  heights, NEN 1824, mass-spring-mass ±55 dB at 5 cm, No-Stain outdoors,
  5–10% energy, fibre-optic starry sky 2–3 days). The old €/m² price range in
  the klimaat article was intentionally dropped (quote-based pricing on the
  new site). Old "zelf plaatsen" article rewritten as honest DIY guidance
  funnelling to kits (/materials), installer training and quotes.
- **Translated ×12** (blogPosts.posts.<slug> in every messages file; be = nl;
  NL titles/headings target the original queries). Verified: typecheck,
  1040/1040 pages, 0 MISSING_MESSAGE, NL/PL/DE spot-checks.
- Hero images = branded placeholders for now (BlogPost.image per slug when
  photos come).

## 2026-08-07 — Fabrics rework: 4 sellable products, version checkmarks, colour choice + 16 photos

- **Fabrics & foils group rebuilt** (Michael's list): PVC foil produced to size,
  Fabric stretch ceiling cut to measure, Polyester stretch ceiling on the roll,
  PVC stretch ceiling on the roll — each with **Standard / Acoustic /
  Translucent checkmarks** (`variants` on MaterialItem; new client component
  `materials/ItemActions.tsx` replaces the button pair on group pages). Checked
  versions travel into the quote modal (`product: "… — Standard, Acoustic"`)
  and the inquiry list (`items: "… [Standaard, Akoestisch] (…)"`).
- **Colour chart choice in the inquiry form**: "Colour / finish" select (matte
  white / matte colour / satin / gloss / translucent / printed / no preference)
  + free "Colour code" field (RAL / chart no.) — posted as `colour` /
  `colourCode`, passed through /api/lead generically.
- **16 material photos wired** (`public/images/materials/`): group covers
  (profiles rail, fabric swatch fan, toolbox — new `cover` field on
  MaterialGroup) + item photos for alu/PVC/LED-line profiles, foil cut to size,
  fabric swatches, PVC roll, LED modules, spot rings, harpoon, protective
  rings, glue, hand tools, Cleaner 1 L + 5 L. Tracklight items + polyester roll
  still placeholders. NOTE: the Cleaner 1 L photo shows CLIPSO branding.
- Glue body generalised (photo shows COSMO CA-500.200, copy said AKFIX →
  now "instant adhesive (cyanoacrylate)").
- Translations ×12 updated in the same pass: new fabrics items, glue body,
  13 new UI keys (variant labels + colour menu). Verified: typecheck, build
  920/920, 0 MISSING_MESSAGE, be/nl screenshots of the full flow.

## 2026-08-06 (4) — Inquiry list + full translation pass (materials data & 8 migrated projects)

- **Inquiry list (materials step 2)** — `src/components/materials/Inquiry.tsx`:
  "Add to inquiry" toggle on every item card, floating bar (item count) fixed
  bottom-right across the catalogue (`materials/layout.tsx` mounts the provider
  + bar; list survives navigation between group pages via sessionStorage
  `stretch_inquiry_v1`). Panel = item list with remove + one combined form
  (name/company/email/phone/message, consent checkbox → /privacy, `_gotcha`
  honeypot) → POST `/api/lead` with `source: materials_inquiry` and all items
  joined into one line. Success state clears the list. 19 UI keys in the
  `materials` namespace, translated ×12.
- **Materials data localized** — new `materialsData` namespace ×12 (5 groups:
  name/eyebrow/metaTitle/metaDescription/intro + 17 items name/body), overlay
  via new `localizeMaterialGroup` in `localize-content.ts`, wired with has()
  guards into /materials overview, group pages and their generateMetadata
  (localized `<title>`/description per locale — each still ends "| STRETCH").
- **8 migrated projects translated ×12** — `projects.<slug>` entries (title/
  summary/hook/description/highlights/materials/facts) for vier-emmershof-
  lokeren, vp-193, jpv-210, ben-home-vdb-222, vap-sint-pauwels, goesten-opdam,
  dhl-zaventem, veta-interieur-showroom in all 11 non-EN locales (be = nl);
  plus localized `projectCards.metas.<slug>` ×12 (the "City · Type" line on
  cards + detail pages). Brand names, dimensions and units preserved exactly.
- Verified: typecheck clean, build 920/920 pages, 0 MISSING_MESSAGE; Polish
  spot-checks (Profile i szyny, Willa VP-193, inquiry flow add→bar→panel all
  localized).

## 2026-08-06 (3) — Materials catalogue: the shop's successor (quote-list, no checkout)

- **New public section `/materials`** + 5 group pages (profiles, fabrics,
  lighting, accessories, tools-cleaning) — `src/lib/materials.ts` is the control
  panel (item families curated from the Alto pricebook categories + old shop;
  NO prices ever; image slots in `public/images/materials/`).
- Every item's button opens the existing QUOTE MODAL pre-filled with the
  product (`ModalButton product=…`, source `materials_<group>`); the modal now
  shows the selected item as a chip. Leads arrive through the normal pipeline
  with the product named.
- Each group page targets an old shop keyword ("spanplafond profielen",
  "spanplafond doek", …) — these are the 301 targets for the old shop URLs
  (see webshop-seo-analysis.xlsx). "No webshop, on purpose" note + dealer band
  (portal login / become a partner) on every page.
- Wired: header + mobile nav ("Materials", `common.nav.materials` ×12), sitemap
  (staticRoutes + per-group routes), meta keys ×12, full `materials` UI
  namespace translated ×12. Group/item DATA is EN for now (translation overlay
  later, same as projects).
- Step 2 (later): "add to inquiry" list across items with one combined send.

## 2026-08-06 (2) — Portfolio: 8 case studies migrated from the old site

- Migrated from old stretchplafond.be pages (EN copy distilled from the Dutch
  originals; `projects` messages translations = follow-up, EN falls back
  meanwhile via new has() guards in ProjectRoute): ’t Vier Emmershof (Lokeren),
  Villa VP-193, Villa JPV-210, BEN Home VDB-222 (Sint-Pauwels), VAP — Sint-
  Pauwels (VA-176), Goesten & Opdam, DHL Zaventem (Boeing 737 meeting room),
  Veta Interieur showroom (Dendermonde). Portfolio now 22 projects (matches the
  old site's inspiration section).
- Photos processed into `public/images/projects/` for Vier Emmershof, VP-193,
  JPV-210, VDB-222 (hero 16:9 + 3-image 4:3 galleries) and Goesten & Opdam
  (hero); Veta reuses the illuminated-print photo; VAP + DHL show the
  "photos coming soon" chip until their photo sets arrive.
- Fixed: ProjectRoute crashed the title (MISSING_MESSAGE → blank h1) for any
  project without a messages entry; both localizeProject call sites now guard
  with tpr.has() and fall back to the English source. (PortfolioGrid already
  guarded.)
- Review notes for Michael: Goesten & Opdam copy is inferred from the photo +
  old listing line (RAL-colour acoustic ceiling, Tenback) — please verify;
  facts for JPV-210 kept minimal (old page is offline).

## 2026-08-06 — Phone, partners photo, portal accounts (B2C signup), lead email

- **Company phone** → `+32 474 52 20 90` (`lib/site-config.ts`: phone/phoneDisplay/
  phoneHref; used by header, footer, contact, JSON-LD). Old +32 3 284 68 18 removed.
- **Partners page hero photo**: `pageImages.partners` now reuses the homepage
  installer photo (`/images/home/installer.jpg`).
- **Portal — open self-registration with account tiers** (see docs/PORTAL.md):
  new `account_type` ('b2c'|'b2b') on `portal_users` (+ one-line migration for
  existing DBs in schema.sql). "Create account" tab on /portal/login →
  `POST /api/portal/signup` (Supabase signUp + b2c profile; login self-heals a
  missing profile). B2C accounts get their own dashboard (account tile + trade
  upsell) but NO pricelist/designer — enforced in pages, the designer API route
  and by RLS (no markets granted). Admin panel: B2B/B2C badge + one-click
  Upgrade to B2B / Set to B2C; admin-created accounts stay b2b. 21 new portal
  i18n keys translated in all 12 locales.
- **Demo logins hidden by default**: demo mode (and its listed credentials) now
  requires `NEXT_PUBLIC_PORTAL_DEMO=1`; without Supabase env vars the login
  page shows a "portal launching soon" notice and no credentials work.
- **Lead email**: no code change needed — `lib/deliver.ts` already tries
  Resend → webhook → SMTP. Following the re-sound.be pattern (Power Automate →
  leads@stretchgroup.be), set `LEAD_WEBHOOK_URL` in Vercel to the same Power
  Automate flow URL. `LEAD_DESTINATION` already defaults to leads@stretchgroup.be.
- **CTA audit fix**: the quote/lead modal (`LeadGenModal`) was the only form
  WITHOUT the `_gotcha` honeypot (ContactForm + InlineLeadForm had it) — added,
  so all lead entry points now share the same spam protection.

## 2026-08-05 — Portfolio: CitizenM case study + first project photos + "coming soon"

- **CitizenM Hotel rewritten as a full case study** (facts from saniskill.nl and
  the old stretchplafond.be post): Saniskill builds the prefab pods, STRETCH
  engineered the illuminated ceiling — TWO backlit stretch panels per pod, every
  panel removable so the ceiling doubles as a full-surface inspection hatch;
  2,608 shower pods delivered across Europe & America (Paris Opera, Copenhagen
  Rådhuspladsen, NYC, Chicago, Miami Brickell, Washington DC, Seattle, SF, LA,
  Nuenen). New facts row (Units), solutions now incl. `inspection-hatch`,
  featured on the grid. Copy translated in ALL 12 locales (`projects.citizenm-hotel`).
- **First real portfolio photos** (`public/images/projects/`): CitizenM (hero +
  6-image gallery incl. the standalone pod product shot), BNP Paribas Fortis
  (luminous oval hero + 3 gallery), Polette Eyewear (piano-lid hero + 3 gallery,
  now featured), Rue Perrée (luminous gallery hero + 2 gallery).
- **"Photos coming soon" chip** on portfolio cards without a photo
  (`PortfolioGrid`, new `projectCards.comingSoon` key ×12 locales).
- **Held back for later** (no matching project pages yet, per Michael): ZEBRA
  Huis, Creneau–AFAS Lounge, Candor, Vier Emmershof, Tenback–Goesten Opdam and
  code-named villa sets JPV-210 / VP-193 / VDB-222 — photo sets received and
  archived, waiting for project titles/details.

## 2026-07-26 — Prefab Structures page: hero title fix + first real photos

**What changed**

- **Hero title no longer runs behind the photo.** The prefab pages used the
  full-page `.h1` scale (up to 142px) inside a half-width hero column, so
  "PREFAB STRUCTURES" (and worse, long localized names) bled under the hero
  image. `PrefabPage` now sizes the hero `<h1>` per locale (`H1_SIZE` map,
  largest size at which that locale's longest word still fits the column at any
  viewport — measured in Archivo wdth 125), with `text-wrap: balance` +
  hyphenation/wrap safety nets. Verified headless across all 12 locales × 7
  viewport widths × both prefab pages: zero overflow / overlap / mid-word
  breaks. (Done in TS rather than `:lang()` CSS because the currently deployed
  tree still nests two `<html>` elements — the outer `lang="en"` would defeat
  `:lang()`; see the 11 Jul SEO-fix notes.)
- **Production photos added** (`public/images/prefab/`): laser cutting, laser
  welding and powder-coating photos now fill the three "Made in-house" detail
  slots (`detail-cutting.jpg`, `detail-welding.jpg`, `detail-powdercoating.jpg`).
- **"Floating coving ceiling" showcase is now the BelOrta case** (Sint-Katelijne-
  Waver): production drawing SP-2025-11-45 (A1 sheet rendered from the AutoCAD
  PDF to `show-coving-drawing.png`), the installed round coving
  (`show-coving-result.jpg`) and the finished space with the red acoustic
  cylinders (`show-coving-result2.jpg`). `PrefabShowcase` gained an optional
  `result2` slot — when present the showcase renders a 3-up row (drawing /
  installed / finished space) with a new numbered caption. New i18n key
  `prefabPage.finishedSpace` added to all 12 locales.
- **"Raster grid ceiling" showcase** keeps its placeholders — photos still to
  come from Michael.
- **Removed `src/app/sitemap.ts`** (route collision): it shadowed the host-aware
  `src/app/sitemap.xml/route.ts` and made `next dev`/`next build` fail outright
  ("same specificity as an optional catch-all route"). This re-applies part of
  the 11 Jul SEO fix (commit 107a835) that this tree was missing.

**Verified:** `tsc --noEmit` clean; `next build` (fonts stubbed offline) OK;
Playwright screenshots of hero (en/pl/sv/is, desktop+mobile), production grid
and 3-up showcase all render correctly.

**Same day, second batch — six more photos placed:**

- Prefab Structures hero → `prefab/prefab-structures-hero.jpg` (Uhoda tower red
  backlit grid); Prefab Lighting Elements hero → `prefab/prefab-lighting-hero.jpg`
  (CitizenM San Francisco).
- Illuminated page "Printed designs" → `products/illuminated-printed-stretch-ceiling.jpg`
  (Veta interieur bathroom print).
- Custom-print page "Print plus backlight" → `products/printed-backlit-stretch-ceiling.jpg`
  (Glennwood / Johnson & Johnson); "Made to your space" →
  `products/custom-print-made-to-your-space.jpg` (showroom coving).
- Installer-training hero now wired to `pageImages.training` →
  `pages/training.jpg` (membrane tuck-in shot); the page previously rendered a
  bare placeholder with no `src` at all.
- Still awaiting files: "Your image, edge to edge" (Bert Demasure_Blondeel
  Argendael print03.jpg), partners "Installer / team photo" (installer.jpg),
  and an "LED line lighting" photo for the Illuminated page.

## 2026-07-09 — Ceiling designer in the portal (pro area)

**What was built** 

- **`/portal/designer`** — the ABC Floorplan ceiling designer (measure → draw → seams → quote → order) now lives inside the client portal, next to the pricelist. Nav link + dashboard tile ("live") added; translated in all 12 locales.
- **Auth-gated delivery:** the designer is a single self-contained HTML app embedded base64 in `src/lib/portal/designer-html.ts` and served ONLY through `GET /api/portal/designer` after `getPortalSession()` passes (anonymous → 307 to `/portal/login`). It is deliberately NOT in `/public` because the app contains the Stretch foil price matrix and service rates. Response headers: `private, no-store`, `X-Frame-Options: SAMEORIGIN`.
- **Embedding:** `src/app/[locale]/portal/(app)/designer/page.tsx` renders the app full-height in an iframe pointed at the API route. The tool itself is locale-independent (English UI, as built).
- **No database (per Michael's request):** the order flow downloads the order files (floorplan PDF, production PDF, DXF, order.json) and opens a pre-filled email draft. Persisting orders/documents server-side is a documented future step (an `/api/portal/orders` route + Supabase table + real attachment email would slot in without touching the designer).
- **Updating the tool:** replace `abc-floorplan.html` and run the one-liner in `scripts/update-designer.md` to regenerate the embedded module. No other file changes needed.

**Files:** new `src/lib/portal/designer-html.ts`, `src/app/api/portal/designer/route.ts`, `src/app/[locale]/portal/(app)/designer/page.tsx`, `scripts/update-designer.md`; modified `src/components/portal/PortalNav.tsx`, `src/app/[locale]/portal/(app)/page.tsx`, all 12 `messages/*.json` (keys `portal.nav.designer`, `portal.dash.tileDesigner*`, `portal.designer.*`).

**Verified:** `tsc --noEmit` clean; `next build` succeeds; Playwright: anonymous requests to the page and the API both redirect to login, demo login → designer renders inside the portal shell, tool solves the 15-corner reference room (SVG draws, spec table computes), nav/tile/locale (nl) all OK.

## 2026-07-11 — Body-copy i18n phase 1: home page, CTA band, product templates

**What changed**

- Extracted all hardcoded English copy from the HOME page (Hero incl. 4 slides,
  Ticker, Stats, WhyStretch, Solutions, Acoustics, ApplicationAreas, Gallery,
  InstallerPartner, Reviews headings), the site-wide CTA band, the solution-page
  TEMPLATE (breadcrumbs, CTAs, section headings, colours note, datasheet labels)
  and the products overview page into new `home`, `ctaBand`, `productPage` and
  `productsPage` namespaces in `messages/*.json` — translated in ALL 12 locales
  (~160 keys each, native industry terminology; 390 keys total per locale, full
  parity verified).
- Result: the home page and all product-page chrome now render fully native on
  every domain (verified fr/pl/de rendered output — zero residual English in the
  extracted sections; EN output unchanged).

**Still English (phase 2+ — needs extraction + translation per surface)**

- Product CATALOG text in `lib/products.ts` (names/intros/features/specs/FAQs
  per product) — appears on product pages below the translated chrome.
- `lib/content.ts` (global FAQs, blog posts, reviews, projects), technical.ts,
  prefab.ts, applications.ts, forms-config.ts, partners / installer-training /
  about page bodies.

---

## 2026-07-10 — Ceiling designer cut-out fixes + per-domain SEO repairs

**Ceiling designer (`src/lib/portal/designer-html.ts`)**

- Corner numbers ① ② ③ always visible on rectangle cut-outs (also before any tape).
- General 3-point solver: ANY mix of >=3 tapes over corners ①②③ now positions the
  rectangle — including one tape each from three room corners (θ-scan + Levenberg–
  Marquardt polish, verified against scipy least-squares). Exact 2+1 path kept.
- Per-tape Δ accuracy report; tape lines on the plan coloured by fit (violet OK,
  orange 1–3 cm, red >3 cm with Δ printed). Same-corner mistakes get a specific error.

**SEO (every language/domain)**

- REMOVED `src/app/layout.tsx`: it rendered `<html lang="en">` around the
  `[locale]` layout's own `<html lang>` → nested/duplicate html tags on every page.
  The `[locale]` layout (which already loads fonts + globals) is now the root, as
  per the next-intl domain-routing pattern. Every domain now serves exactly one
  `<html>` with the correct BCP-47 lang.
- REMOVED `src/app/sitemap.ts`: the legacy path-prefixed sitemap was shadowing the
  host-aware `sitemap.xml/route.ts`, so every domain served `stretchplafond.com/en…`
  URLs (which redirect). Each domain now serves its own 53 clean URLs.
- REMOVED `public/robots.txt`: the static file was shadowing the host-aware
  `robots.txt/route.ts` and advertised the `.be` sitemap on all 12 domains. Robots
  is now per-domain (correct `Sitemap:` line) and keeps the `/portal` disallows.
- Audited per-language metadata on rendered pages: titles/descriptions localized with
  native industry keywords (spanplafonds / plafonds tendus / Spanndecken / sufity
  napinane / …), hreflang cluster (12 + x-default) present, canonical per domain,
  og:locale correct, portal noindex intact.

**Translation state (analysis)**

- `messages/*.json`: 229 keys × 12 locales, full parity, native-quality strings.
- Remaining untranslated surface: ~468 hardcoded English strings in code —
  `lib/content.ts` (140: FAQs, blog, reviews), `lib/products.ts` (100),
  `lib/prefab.ts` (31), partners page (29), `lib/technical.ts` (24),
  `lib/forms-config.ts` (21), `lib/applications.ts` (15), installer-training (14),
  plus ~40 in home/section components. Translating these needs the copy extracted
  to a locale-aware content layer — recommended as dedicated phases (1: home +
  products, 2: content.ts, 3: technical/prefab/partners/training).

---

## 2026-07-08 — Client portal (login + live pricelist)

**What was built**

- **`/portal`** — a login-gated client platform: dashboard, **pricelist** (category tabs, search, market filter, EUR/PLN switch, print stylesheet, CSV export — layout follows Michael's pricelist mockup restyled to the site tokens), and an **admin page** (Excel sync + client-account management). All portal routes are `noindex`, excluded from sitemaps and disallowed in robots.
- **Data flow:** the *Alto Pricing System* Excel stays the pricing master. The admin upload (or `scripts/seed-pricebook.mjs`) reads ONLY the client-safe PriceBook columns (Category, Code, Product, Unit, Market, Price EUR, Price PLN) into a Supabase `pricebook` table. **Margin % and cost columns are never read, stored, or transmitted.**
- **Auth & visibility:** Supabase password auth; `portal_users` profiles carry `role` (client/admin), `markets[]`, `all_markets`, `active`. Per-market price visibility is enforced with **Postgres row-level security** (see `supabase/schema.sql`), not just UI filtering — deliberate, since margins differ per market (East/West Europe, USA, UAE, Key account, Producers, Standard, rolls tiers).
- **Zero-config demo mode** (consistent with the site's env-var philosophy): without Supabase env vars the portal runs on a bundled sample pricebook (`src/lib/portal/demo-pricebook.json`, generated from the 2026-07 workbook, 2,447 rows) with three demo logins listed on the login page. Demo mode is a preview, not a security boundary.
- **Session refresh** composed into `src/middleware.ts` (next-intl first, then Supabase token refresh on `/portal` paths only). Root `middleware.ts` mirrors it.
- New deps: `@supabase/supabase-js`, `@supabase/ssr`, `xlsx`. New env vars (all optional): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Added `.env.example` (README referenced it but it was missing).
- Entry points: header utility bar, mobile menu and footer "Company" column link to `/portal` (`common.nav.clientLogin` / `footer.links.clientPortal`, translated in all 12 locales; the full portal UI ships translated in all 12 message bundles — same native-review caveat as the rest).
- Setup guide: **`docs/PORTAL.md`** (Supabase project → schema.sql → 3 env vars → seed script → admin bootstrap script).

**Decisions / notes for review**

- Rows are keyed on Category+Product+Market; a product rename in Excel shows as removed+added in the sync report (expected).
- 4 PriceBook rows currently have no Price EUR (Bauf Translucent Satin/Mat White 450 cm — cost cell empty in the workbook) and are skipped with a warning at sync time; fix them in the Excel when convenient.
- The pricelist's product grouping inside a category derives the brand from the first word of the product name for ceilings/rolls/foil-cut (MSD, Bauf, Teqtum, Renolit…). Other categories render as a single list — add richer grouping later if wanted.
- Documents & order-history tiles on the dashboard are staged "coming soon" placeholders — the portal was explicitly designed as a platform for more client data sources.

---

## 2026-07-05 — Multi-domain internationalization (12 locales, one domain each)

**What changed**

- `src/i18n/config.ts` is now the single source of truth for **12 locales** (`en, be, nl, fr, pl, de, es, pt, da, sv, no, is`) and their **production domains** (`localeDomains` map — edit domains ONLY here). `be` is a market code for Dutch-Belgium; browsers/search engines only ever see the mapped BCP-47 codes (`nl-BE`, `nl-NL`, `nb-NO`, ...).
- **Domain-based routing** via next-intl `defineRouting({ domains })` with `localePrefix: 'as-needed'`: each domain serves ONE locale with clean, unprefixed URLs (`stretchplafond.nl/products`). Unknown hosts (localhost, `*.vercel.app` previews) keep path-prefixed access to every locale (`/fr`, `/pl`, ...) for dev & QA.
- `middleware.ts` moved to `src/middleware.ts` — REQUIRED: with a `src/` directory Next.js only loads middleware from `src/`, the root file was silently ignored.
- Root layout merged into `src/app/[locale]/layout.tsx` (the next-intl documented pattern) so `<html lang>` is the correct BCP-47 code per locale.
- **SEO is fully cross-domain**: `buildCanonical`/`buildAlternates` in `src/lib/seo.ts` emit per-domain canonicals and a 13-entry hreflang cluster (12 locales + `x-default` → the `en` domain). All page/OG/JSON-LD URLs use the new `localeBase(locale)` helper. Organization `@id`/logo stay pinned to `siteUrl` (the `.com`) so the brand keeps one schema.org entity across all domains.
- `app/sitemap.ts` replaced by **host-aware** `app/sitemap.xml/route.ts`: each domain serves ONLY its own URLs, each with `xhtml:link` hreflang alternates to the sibling domains. Static `public/robots.txt` replaced by host-aware `app/robots.txt/route.ts` (same crawl policy, per-domain `Sitemap:` line).
- `LanguageSwitcher` is now a full 12-language dropdown that navigates **across domains** in production (preserving path + query) and falls back to in-app locale switching on dev/preview hosts.
- Lead-modal privacy link no longer hardcodes `/en/privacy` (locale-aware `Link`), consent sentence is translated (`forms.consentPrefix`). `/training` legacy 308 redirect now uses the locale-aware `permanentRedirect`.
- **Message bundles for all 12 locales** in `messages/` with verified key parity. Translations are solid working drafts — have a native speaker review marketing copy before launch (especially da/sv/no/is industry terms).

**Deploying (Vercel)**

1. Add ALL 12 domains to the same Vercel project (Settings → Domains). Do NOT set any of them to redirect — each must "Serve" the deployment. Point DNS (A/CNAME per Vercel's instructions) for each.
2. The Host header decides the locale — no env vars required. Optionally override a domain per environment with `NEXT_PUBLIC_DOMAIN_<LOCALE>`.
3. After launch, add each domain as a separate property in Google Search Console and submit `https://<domain>/sitemap.xml`.

# CHANGES — Build log & decisions

This document records the choices, assumptions, and deviations made while building the STRETCH website from the brief + design mockups, plus everything that needs human review before launch.

---

## Day 0 — Initial build

A complete, production-ready marketing site was built from the "Zero-to-Production" prompt, the finalized Brand Brief, and the seven design mockups (Homepage, Solution Page, Inspiration, Become a Reseller, Installer Training, Contact, CtaModal).

### Stack (as locked in the brief)

- **Next.js 14** (App Router), static-export-compatible patterns, TypeScript **strict**.
- **next-intl 3.x** with `localePrefix: 'always'`.
- **styled-jsx** + token-driven `globals.css` (no Tailwind).
- **next/font** self-hosted; **next/image** only; **lucide-react** for icons.
- **Vercel** deploy target; server-side form handling via route handlers; consent in `localStorage`; animations via CSS + IntersectionObserver only.

`tsc --noEmit` passes clean, and a full `next build` prerenders all 23 routes successfully.

---

## Decisions & assumptions

1. **English-only launch, i18n fully wired.** Per the brief, `locales = ['en']`. `next-intl` is fully plumbed so adding `nl` / `fr` / `de` later is a one-line change plus a message file. Reusable chrome (nav, CTAs, forms, cookies, footer, meta) lives in `messages/en.json`; long-form page **body** copy is authored in English directly in the section components and earmarked for extraction when more locales are enabled.
2. **Products: one folder per product.** Five solution pages, each its own route under `src/app/[locale]/products/<slug>/`, sharing a single `SolutionPage` component and a shared `ProductRoute` helper (so each route file is ~3 lines). Slugs: `polyester-stretch-ceiling`, `pvc-stretch-ceiling`, `acoustic-stretch-system`, `light-print-stretch-ceiling`, `prefab-ceiling-unit`.
3. **Graceful, zero-config lead delivery.** `lib/deliver.ts` auto-selects a method at runtime: Resend → webhook → SMTP (Nodemailer) → log-only. The site runs with no env vars (log-only). `resend` / `nodemailer` are optional dependencies, imported dynamically only when configured. Submitted PII is never logged (only source, destination and the submitter's email domain).
4. **Text wordmark logo.** "STRETCH®" is rendered as type (matching the mockups). Brand favicons and a 512×512 Organization logo were generated (red mark / black wordmark).
5. **Analytics per brief.** GA4 = yes, Microsoft Clarity = yes, Bing UET = no, Meta Pixel = no. GA always loads but is gated by Consent Mode v2 (default denied). Clarity loads on analytics consent. Meta/Bing components are present but return `null` unless their env var is set.

---

## Deviations from the brief / mockups

1. **`<html>` consolidation.** Only the **root** `app/layout.tsx` renders `<html lang="en-BE">` and applies the font variable; `app/[locale]/layout.tsx` does **not** render a second `<html>`. This avoids nested-html issues with the App Router while keeping locale-aware metadata.
2. **Navigation simplified.** The header is Solutions (dropdown of the 5 products) / Inspiration / Partners / Contact, plus a utility bar (reseller, training, phone, language). The mockup's "Technical" mega-menu was folded into the per-product spec sections and the FAQ, rather than a separate top-level menu — clearer hierarchy, fewer thin pages.
3. **Display font = variable Archivo (width axis), not a separate "Archivo Expanded" family.** Google Fonts no longer ships "Archivo Expanded" as a standalone family (`next/font/google` has no such export); the expanded look is the **width (`wdth`) axis** of the single variable Archivo font, pushed to `125` via `font-variation-settings` in `globals.css`. Visual result matches the mockups while keeping one self-hosted font.
4. **Image placeholders instead of raster stand-ins.** Every photographic slot renders a branded diagonal-hatch placeholder (`components/ui/Placeholder`) rather than a raster image, so the build ships with no copyrighted or dummy photography. Search the codebase for `Placeholder` to find every slot to replace with real `next/image` assets.
5. **Sitemap is dynamic.** `app/sitemap.ts` generates `sitemap.xml` (locales × routes + hreflang + `x-default`). There is intentionally **no** static `public/sitemap.xml`.

---

## Drafted content — REVIEW BEFORE LAUNCH

The following content was drafted from category norms and the brief, and should be reviewed/replaced by the client:

- **Customer reviews** (`lib/content.ts → reviews`): three placeholder testimonials with initials-style names. **No `aggregateRating` is emitted in JSON-LD** until real, permission-cleared reviews are in place. Replace with genuine Google reviews (with permission) and only then consider adding rating schema.
- **FAQ** (`lib/content.ts → globalFaqs`, 9 items): drafted answers to standard stretch-ceiling questions. Verify each against your actual products, warranty and process.
- **Blog/guides** (`lib/content.ts → blogPosts`, 2 articles): drafted educational posts ("What is a stretch ceiling?", "Stretch ceiling acoustics explained"). Review for accuracy and brand voice; add more over time.
- **Per-product FAQs & spec values** (`lib/products.ts`): technical values (spans, classes, warranty, recyclability) are drawn from the brief/mockups and are indicative — confirm before publishing.
- **About page copy** (`app/[locale]/about/page.tsx`): drafted company story. Confirm founding year, history and the office footprint.
- **Privacy & Terms** (`app/[locale]/privacy`, `/terms`): drafted as starting points and **must be reviewed by a qualified legal advisor** to reflect your actual data-processing practices and contractual terms.
- **Contact details** (`lib/site-config.ts`): phone, emails, addresses and geo-coordinates are taken from the brief — verify all are current.

---

## Open questions for the client

- Final production domain for `NEXT_PUBLIC_SITE_URL` (assumed `https://stretchplafond.be`).
- Preferred lead-delivery method and verified sending domain (Resend recommended).
- Whether the residential/e-commerce ("DIY kit") path should eventually link from this B2B-led site, and how it should relate to the booking funnel.
- Real GA4 and Clarity IDs.
- Confirmation of training dates, seat counts and venue before they go live (`lib/forms-config.ts`).

---

## Known notes

- A local `next build` downloads the Archivo font from Google at build time; in network-restricted environments that single step fails while everything else compiles. Vercel builds have network access, so this is a non-issue in deployment. Type-checking never needs network.
- `next@14.2.x`: keep patch versions current. If `npm audit` flags an advisory for the pinned version, bump within the 14.2 line (`npm install next@^14.2`) and re-run `npm run typecheck` + `npm run build`.
