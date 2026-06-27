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
