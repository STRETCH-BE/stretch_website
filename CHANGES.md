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
