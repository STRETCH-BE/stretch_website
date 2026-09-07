# STRETCH Client Portal

A login-gated client area at **`/portal`** where clients see their **trade
pricelist** — always in sync with the *Alto Pricing System* Excel — with room
to grow (documents, order history are staged on the dashboard).

---

## How it works

```
Alto Pricing System.xlsx ──(admin upload / CLI)──▶ Supabase Postgres ──▶ /portal/pricelist
        │                                              │
        │  Only the client-safe PriceBook columns      │  Row-level security:
        │  (Category, Code, Product, Unit, Market,     │  each account sees ONLY
        │  Price EUR, Price PLN) are ever read.        │  its assigned markets.
        │  Margin % and cost build-up NEVER leave      │
        │  the Excel file.                             ▼
        └──────────────────────────────────── portal pages (Next.js, styled to site)
```

- **Excel stays the master.** Update prices in the workbook, upload it on
  `/portal/admin` (or run the CLI script) — every client instantly sees the
  new prices. The sync reports added/changed/removed rows.
- **Tier-based visibility** (an explicit business decision): since PriceBook
  v2.4 the price groups are the account tiers — `Producer/Reseller`,
  `Installer`, `B2C`. An account automatically sees the group matching its
  tier (extra groups can be granted per account); an Installer can never
  query Producer/Reseller rows — enforced by Postgres row-level security,
  not just UI code.
- **Two roles.** `client` (sees the pricelist for its tier) and `admin`
  (sees everything + admin page: pricelist sync, account management). The
  tier lives in `account_type`: `producer` / `installer` / `b2c`.
- **Zero-config demo mode.** Without Supabase env vars the whole portal runs
  on bundled sample data with demo logins (listed on the login page). Demo
  mode is a preview feature — do **not** treat it as private.

## Pages

| Route | What it is |
| --- | --- |
| `/portal/login` | Login (split brand panel + form; lists demo accounts in demo mode) |
| `/portal` | Dashboard — pricelist tile (live) + documents & orders (staged) |
| `/portal/pricelist` | Category tabs, search, market filter, EUR/PLN switch, print, CSV export |
| `/portal/admin` | Admins only — Excel upload sync + client-account manager |

All portal routes are `noindex` and disallowed in `robots.txt`.

## Going live (≈ 15 minutes)

1. **Create a Supabase project** (free tier is fine): https://supabase.com →
   New project. Pick the EU (Frankfurt) region.
2. **Create the tables**: Supabase → SQL Editor → paste the contents of
   [`supabase/schema.sql`](../supabase/schema.sql) → Run.
3. **Set the env vars** (Vercel → Project → Settings → Environment Variables,
   and locally in `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL` — Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Settings → API → `anon public`
   - `SUPABASE_SERVICE_ROLE_KEY` — Settings → API → `service_role` (server-only secret)
4. **Load the pricelist**:
   ```bash
   node scripts/seed-pricebook.mjs "path/to/Alto Pricing System.xlsx"
   ```
5. **Create your admin account**:
   ```bash
   node scripts/create-portal-admin.mjs michael@stretchplafonds.be "ChooseAStrongPassword" "STRETCH HQ"
   ```
6. **Redeploy** (so the env vars take effect), sign in at `/portal/login`,
   and create client accounts from `/portal/admin` (e-mail + temporary
   password + markets).

From then on, updating prices = save the Excel → upload it on
`/portal/admin`. Done.

## Updating the pricelist

- **Portal (recommended):** `/portal/admin` → *Pricelist sync* → choose the
  workbook → Sync. You get a report: rows added / price changes / removed /
  skipped (e.g. rows with a missing Price EUR are listed by name).
- **CLI:** `node scripts/seed-pricebook.mjs <file.xlsx>` does the same from a
  terminal.
- Rows are keyed on **Category + Product + Market** — renaming a product in
  the Excel therefore shows up as `removed + added`, which is expected.

## Account & market model

`portal_users` (one row per login):

| Field | Meaning |
| --- | --- |
| `role` | `client` or `admin` |
| `account_type` | Tier: `producer` (Producer/Reseller), `installer` or `b2c` — decides the price group seen automatically |
| `markets` | EXTRA price groups granted on top of the tier's own, e.g. `{"Producer/Reseller"}` |
| `all_markets` | `true` → sees every price group (admins are always all-markets) |
| `active` | `false` → account keeps existing but cannot use the portal |

Price groups present in the PriceBook (one price per product per tier):
`Producer/Reseller`, `Installer`, `B2C`. A typical account needs no manual
grants at all — its tier decides what it sees.

## Security notes

- The database never contains margins or costs — the sync **does not read**
  those columns, so they cannot leak.
- Market visibility is enforced with Postgres RLS using the caller's own JWT;
  the browser only ever receives rows the account is allowed to see.
- Writes require the `service_role` key, which exists only server-side and is
  used strictly after an admin-session check.
- Demo mode (no Supabase env) is intentionally public — configure Supabase
  before announcing the portal to clients.

## Extending the platform

The dashboard already stages the next data sources (documents, orders). To
add one: create a table + RLS policy in Supabase mirroring `pricebook`'s
pattern, a data helper in `src/lib/portal/`, and a page under
`src/app/[locale]/portal/(app)/`. The session/auth plumbing is shared.

---

## Self-registration (B2C) + account tiers — added 6 Aug 2026

The portal now has TWO account tiers on top of the existing roles:

- **b2c** — anyone can create this account themselves on `/portal/login`
  (Create account tab, Supabase mode only). They get their own account area
  (dashboard + staged documents/orders), but **no pricelist and no designer**
  — those embed trade pricing. Enforced in the pages, the designer API route
  AND by Postgres RLS (a b2c profile has no markets, so the pricebook policy
  returns zero rows even if application code had a bug).
- **b2b** — dealer/trade account: everything as before (market-based pricing,
  designer). Created by an admin, or a b2c account upgraded via the admin
  panel's new "Upgrade to B2B" action (then assign markets).

Implementation notes:

- `portal_users.account_type` column ('b2c' | 'b2b', default 'b2b' so all
  pre-existing accounts stay dealers). `supabase/schema.sql` contains both the
  fresh-install column and the one-line `alter table` migration for existing
  databases — run it once in the Supabase SQL editor.
- Signup: `POST /api/portal/signup` → `auth.signUp` (Supabase sends the
  confirmation email) + service-role insert of the b2c profile. The login
  route self-heals a missing profile as b2c, so users created directly in the
  Supabase dashboard can also sign in.
- **Demo mode is now opt-in.** Without Supabase env vars the login page shows
  a "portal launching soon" notice and no credentials work. Set
  `NEXT_PUBLIC_PORTAL_DEMO=1` (preview deployments only!) to restore the old
  listed demo accounts. Never set it in production.

---

## Acoustic calculator — added 4 Sep 2026

`/portal/acoustics` embeds the reverberation-time calculator
(`acoustic-calculator.html`, repo root) the same way the ceiling designer is
embedded: an iframe onto the authenticated `/api/portal/acoustics` route,
which decodes the base64 module `src/lib/portal/acoustic-html.ts` per
request and injects `window.PORTAL_USER` and `window.PORTAL_LOCALE`.

- **Access:** every signed-in account — trade, b2c and architects — via
  `hasAcousticsAccess()` in `src/lib/portal/types.ts`, the one place to
  tighten it. The tool carries no pricing.
- **Persistence:** `/api/portal/acoustics/projects` (GET list / GET ?id /
  POST / DELETE) → `acoustic_projects`; `/api/portal/acoustics/event` →
  `acoustic_events`. Best-effort like the designer: demo mode, no
  service-role key or missing tables answer `storage:'none'` and the tool
  keeps working on its browser autosave. The headline columns (room type,
  volume, RT before/after, target, treated quantity, product) are derived
  server-side from the saved state by `acoustic-summary.ts`, using the
  tables generated from the tool (`acoustic-data.ts`).
- **Languages:** the tool's interface is Dutch or English (`UI` object in
  the HTML); `be` and `nl` get Dutch, every other locale English. The PDF
  report follows the same language.
- **Updating the tool:** `node scripts/update-acoustics.mjs` — see
  `scripts/update-acoustics.md`.

---

## Kit configurator — added 6 Sep 2026

`/portal/configurator` turns a room into a priced bill of materials, and
`/api/portal/order` turns that into an order. Three layers keep a pricebook
upload from ever breaking it:

```
public.pricebook            ← the Excel, untouched. The only price source.
public.configurator_options ← maps an option to its pricebook row + the
                              quantity rule that fills it (admin ▸ Configurator)
the BOM engine              ← dimensions → line items → server-side pricing
```

- **Access:** installers, producers and admins — `hasConfiguratorAccess()` in
  `src/lib/portal/types.ts`, built on `hasTradeAccess` so it can never drift
  from the pricelist and the designer. b2c and architect accounts are
  redirected off the page AND refused by every API route.
- **No price ever comes from the browser.** The client posts a configuration;
  `quoteFor()` rebuilds the bill of materials, re-runs the foil choice and
  re-prices from the account's own rows. The order route does the same again.
- **Missing prices are visible, never zero.** `resolveOption()` reports
  `no_row` (the Excel dropped the product) and `no_price` (no price for this
  market) as first-class states: the line reads "price on request", the total
  reads "from € X", and the order still submits flagged
  `needs_manual_pricing`.
- **The foil is chosen, not picked.** `pickFoil()` takes the NARROWEST roll
  that covers the room's widest span in one piece, and welds only when the
  family has nothing wide enough. The reason is shown to the installer in
  plain language.
- **Orders** are written to `portal_orders` + `portal_order_lines`, where the
  lines are a SNAPSHOT: a later pricebook never changes an existing order. Two
  e-mails go out through the usual chain (Graph → webhook → SMTP → log): the
  customer's confirmation and our production sheet
  (`ORDER_NOTIFY_EMAIL`, default `order@stretchgroup.be`). No payment is taken
  — the proforma follows by hand, and both the UI and the mail say so.
- **Seeding:** `node scripts/seed-configurator-options.mjs` (dry run) →
  `--write` → admin ▸ Configurator to activate what is real. Everything
  arrives inactive on purpose. `--from-demo` classifies the bundled sample
  pricebook without database access.
- **Tests:** `npm test` covers `pickFoil`, `resolveOption` and `buildBom`
  (geometry, profiles per metre and per piece, corners, welds, companions,
  the absorber conversion).

- **Lights and light supports are LISTS**, not single choices: add a type, set
  a count, remove it. A colour temperature is a pricebook row of the SAME
  fitting, so it is picked *instead of* the plain fitting — never alongside it,
  which would charge the fitting twice.
- **Picked by the engine, not by the installer:** the fold-edge (`transition`)
  profile, the `corner` piece and the seam `service` are chosen by the
  ceiling's material, so at most ONE of each may be active per material or the
  pick is arbitrary. The form asks for corner *counts* only when a corner piece
  exists for the material. These three are set by hand in admin ▸ Configurator;
  the seeder does not invent them.
- **Geometry.** The angled ceiling is its own size — `foldLength` (its length
  along the fold) × `slopeRun`; a null fold length means the whole side it
  folds from, which is what orders stored before 7 Sep 2026 mean. Surface =
  L × W + F × S. Perimeter = both panels' own perimeters minus twice the fold
  they share, min(F, side) — 2L + 2W + 2S in the normal case. Widest span =
  the largest of each panel's shorter side. The fold-edge profile is cut for
  F (ceil(F / 2) pieces of P-CCMIDNO).
- **Fabric is sold by the LINEAR metre and cut into PIECES; PVC by the m².**
  Every fabric row in the pricebook carries `unit = 'm'` — `495D … 5,10m` at
  €135.92 buys one metre of cloth 5.10 m wide — so fabric ceilings use
  `qty_rule = 'roll_m'`. `cutPanel()` in `foil.ts` is the one model for cloth
  and seams: the roll's width covers the panel's shorter side, strips run along
  the longer side, and the bill carries **one line per piece** with its cut
  measurements. Fabric gets a **20 cm gripping allowance both ways**
  (`FABRIC_ALLOWANCE_M` in `bom.ts`): every piece is cut 20 cm long and each
  panel takes the **narrowest roll of its family that covers its short side
  + 20 cm** (`cutPanelFromFamily()`). A panel wider than the widest roll takes
  full-width strips of the widest roll only while more than a roll is left;
  the last piece is the **leftover, off the narrowest roll that covers it** —
  never another full-width strip ("it should add the necessary width of
  extra fabric", Michael, 7 Sep 2026). Flat + angled = two pieces; each seam
  adds one; pieces of one ceiling may come off different rolls, and each
  line names its own. **Seam direction** is the installer's (`seamDirection`:
  `auto` spans each panel's shorter side for the fewest seams; `length` /
  `width` runs the seams along that side of the room on every panel, the
  angled panel mapped through the fold's axis) — it can add a seam and change
  which rolls the pieces come off. PVC rows carry `unit = 'm²'`, keep `area`, one line, no
  allowance. If a new ceiling row is ever added, set its rule from the
  pricebook's own unit.
- **A seam is not always a weld.** A PVC seam is welded and billed by the metre
  (`weld_m`); a polyester seam is joined with the `P-CCMIDNO 2m` mid-joint
  profile and billed per 2 m piece (`weld_pieces`). The same pricebook row
  therefore appears twice in the catalogue — once as the fold edge, once as the
  seam — under different quantity rules. Polyester takes **no corner piece** at
  all (Michael, 7 Sep 2026).
- **Materials with no active roll are not offered** at Foil at all. Today that
  means polyester only; activating a PVC roll brings the choice back with no
  code change.
- **Behaviour reference:** `claude/kit-configurator-prototype.jsx` is the
  agreed prototype. Reference material only — nothing imports it. Where it
  and the brief disagree the brief wins; where either disagrees with the
  pricebook, the pricebook wins.

Run the two SQL blocks at the end of `supabase/schema.sql` (KIT CONFIGURATOR
option catalogue, then KIT CONFIGURATOR orders) in the Supabase SQL editor.
Both are idempotent.
