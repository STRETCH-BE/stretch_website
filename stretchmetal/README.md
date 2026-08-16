# StretchMetal — Marketing Website

Production marketing site for **StretchMetal** — the metal-fabrication business
unit of the Belgian **Stretchgroup**, operating from Częstochowa, Poland.
Bilingual (Polish default + English), built with Next.js 15 (App Router),
React 19, TypeScript and Tailwind CSS v4, deployable on Vercel with **zero
required environment variables**. The site's one job: get prospects to send a
technical drawing through the RFQ form (`/wycena` · `/en/quote`).

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. (optional) configure environment
cp env.example .env.local        # every variable is optional

# 3. Run the dev server
npm run dev                      # http://localhost:3000
```

With no env vars: analytics no-op, and RFQ/contact submissions are logged to
the server console (file names + sizes, never file contents) while the user
still gets the thank-you page.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals + TS, flat config) |
| `npm run typecheck` | `tsc --noEmit` — must pass clean |

---

## Environment variables

Every variable is **optional** — see `env.example` for the annotated list.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute production origin (canonicals, hreflang, sitemap, OG, JSON-LD). |
| `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` | PostHog (EU host default). Consent-gated. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4. Loads under Consent Mode v2. |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity. Consent-gated. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel. Marketing-consent-gated. |
| `MS_GRAPH_TENANT_ID` / `MS_GRAPH_CLIENT_ID` / `MS_GRAPH_CLIENT_SECRET` / `MS_GRAPH_FROM_ADDRESS` | Send RFQ/contact mail via Microsoft Graph (app-only Mail.Send) from the company's own mailbox, with drawing files as attachments. Setup notes in `lib/email.ts`. |
| `RFQ_DESTINATION` | Inbox receiving quote requests (default: info@stretchmetal.pl). |

---

## Project structure

```
app/
  layout.tsx            # <html> + font + consent-mode defaults + analytics + banner
  globals.css           # Tailwind v4 @theme tokens + the STRETCH design system
  fonts.ts              # Self-hosted Archivo variable font (wght + wdth axes)
  (pl)/                 # Polish tree (default locale, unprefixed URLs)
    layout.tsx          #   PL nav/footer/mobile-CTA chrome
    page.tsx uslugi/ park-maszynowy/ o-nas/ realizacje/
    wycena/ kontakt/ polityka-prywatnosci/ polityka-cookies/
  en/                   # English tree under /en — mirrors the PL tree
  api/rfq/route.ts      # RFQ + contact endpoint (multipart, attachments, spam guard)
  sitemap.ts robots.ts manifest.ts not-found.tsx
  icon.tsx apple-icon.tsx opengraph-image.tsx   # generated favicon + OG image
components/
  ui/                   # button, container, eyebrow, section-title, tracked-cta,
                        # logo, fade-in, placeholder, service-icon, meta-chip
  sections/             # nav, footer, hero, ticker, stats, process, heritage, …
  screens/              # full page compositions shared by both locales
  rfq/                  # RFQ form (upload, drag-and-drop) + contact form
  analytics/            # consent banner + GA4/PostHog/Clarity/Meta loaders
  seo/json-ld.tsx       # JSON-LD renderer
  service-page.tsx      # the shared template all six service pages render through
content/
  *.ts                  # Polish content (typed; [CONFIRM] marks working values)
  en/*.ts               # English content — same types, enforced symmetry
  types.ts index.ts     # content model + getContent(locale)
lib/
  site-config.ts        # THE single source of brand/contact/legal data
  i18n-routes.ts        # typed route map → hreflang, sitemap, language switcher
  seo.ts schema.ts      # per-page Metadata builder + JSON-LD builders
  email.ts              # Microsoft Graph mailer (attachments supported)
  analytics.ts consent.ts rfq.ts use-in-view.ts
```

## Key conventions

- **Content lives in `content/`, never in components.** Components receive
  copy as props. Root files are Polish; `content/en/` mirrors them under the
  same TypeScript types, so a missing translation is a type error.
- **Adding a page**: add the route key + both paths to `lib/i18n-routes.ts`,
  create `app/(pl)/<pl-path>/page.tsx` and `app/en/<en-path>/page.tsx` (thin
  wrappers around a shared screen component), add content to both locale
  files. Sitemap, hreflang and the language switcher pick it up automatically.
- **Design tokens only.** No hex values in components — Tailwind utilities
  from the `@theme` block (`bg-red`, `text-on-dark-muted`, `border-line-dark`…).
  Zero border-radius, no gradients (photo scrims + hatch placeholders aside),
  one font (Archivo; display width via the global `wdth 125` rule).
- **`[CONFIRM]` markers.** Working values (stats, machine specs, legal data)
  are flagged with `[CONFIRM]` comments in `content/` and `lib/site-config.ts`
  — `grep -rn "CONFIRM" content lib` lists everything to verify before launch.
- **Placeholders.** Photo slots render the branded hatch tile until a real
  path is added in the content file (`components/ui/placeholder.tsx`).

---

## Deploying to Vercel

1. Import the repository in Vercel and set the project **Root Directory** to
   `stretchmetal/` (this folder). Framework preset: Next.js — no build
   changes needed.
2. Set env vars in Project → Settings → Environment Variables (at minimum
   `NEXT_PUBLIC_SITE_URL`; add the four `MS_GRAPH_*` + `RFQ_DESTINATION` to
   receive quotes by mail).
3. Deploy.

### Post-deploy checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain (no trailing slash).
- [ ] Submit the RFQ form once with a test file; confirm delivery to
      `RFQ_DESTINATION` and the auto-reply to the sender.
- [ ] Verify `/sitemap.xml` and `/robots.txt` on the live domain; submit the
      sitemap in Google Search Console.
- [ ] Confirm all `[CONFIRM]` values (stats, machine specs, NIP/KRS, hours,
      legal entity) — `grep -rn "CONFIRM" content lib`.
- [ ] Add analytics keys; accept cookies and confirm tags fire.
- [ ] Replace placeholder imagery after the workshop photo shoot (search for
      `Placeholder` usage / `imageLabel` fields in `content/`).
