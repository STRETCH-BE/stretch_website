# Anti-spam — architecture & rollout

How the STRETCH website defends its forms, portal signup and login against
bots and junk submissions. **Zero-config rule: with none of the env vars below
set, the site behaves exactly as it did before this system existed** — no
CAPTCHA, no rate limits (they fail open without the SQL function), no host
redirects. Every layer switches on independently via its own env var.

## Layers

| Layer | Where | Env switch |
| --- | --- | --- |
| Honeypot field (`_gotcha`) | every public form | always on (no config) |
| Form token (time-to-submit HMAC) | every public form + signup | `FORM_SIGNING_SECRET` (falls back to `DATASHEET_SIGNING_SECRET`, then dev fallback) |
| Cloudflare Turnstile | every public form, signup, login | `NEXT_PUBLIC_TURNSTILE_SITEKEY_A/B` + `TURNSTILE_SECRET_A/B` |
| Rate limits (Postgres) | lead, contact, datasheet, signup, login, architect downloads | Supabase + the `rate_limit_hit` SQL function (fails open without it) |
| Spam scoring | lead, contact, datasheet, signup | always on once the route runs the guard chain |
| Disposable-email blocking | all of the above | always on (`disposable-email-domains` package) |
| Canonical email dedup | portal signup | `canonical_email` column + unique index (SQL) |
| Portal on one host | middleware + `/api/portal/*` + portal links | `NEXT_PUBLIC_PORTAL_HOST` (production: `stretch.mt`) |
| Signup gating (pending review) | portal signup + login self-heal | always on once the `pending_reason` column exists |

## The two Turnstile token flows — never mix them

1. **Lead endpoints** (`/api/lead`, `/api/contact`, `/api/datasheet-request`):
   the browser widget's token is POSTed as `turnstileToken` and verified
   server-side against Cloudflare **siteverify** in `src/lib/turnstile.ts`.
2. **Auth endpoints** (`/api/portal/signup`, `/api/portal/login`): the token is
   forwarded to Supabase as `options.captchaToken` and **Supabase verifies it**
   (once CAPTCHA protection is enabled in the Supabase dashboard). These routes
   **never call siteverify** — Turnstile tokens are single-use, so verifying
   one ourselves would make Supabase's own verification fail.

`src/lib/spam/guard.ts` (`runLeadGuards`) is the shared chain for the lead
endpoints: honeypot → rate limits → Turnstile → form token → scoring.
Siteverify outages **fail open** (+40 score, `turnstile_unavailable` reason)
so an outage at Cloudflare never takes the forms down.

## Turnstile widget groups (10-hostname limit per widget)

One Turnstile widget accepts at most 10 hostnames; we have 13 production
domains + previews + localhost, so there are two widgets (`src/lib/turnstile.ts`):

- **Group A** (`NEXT_PUBLIC_TURNSTILE_SITEKEY_A` / `TURNSTILE_SECRET_A`):
  `stretch.mt`, `stretch-website-seven.vercel.app`, `localhost`,
  `stretch-ceilings.uk`, `stretchplafond.be`, `stretchplafond.nl`,
  `stretchplafond.fr`, `stretch-sufit.pl`, `stretchdecken.de`, `stretchtecho.es`
- **Group B** (`NEXT_PUBLIC_TURNSTILE_SITEKEY_B` / `TURNSTILE_SECRET_B`):
  `stretchteto.pt`, `straekloft.dk`, `stretchceilings.se`, `stretchtak.no`,
  `stretch.is`

The client picks the sitekey by `window.location.hostname`; the server tries
the matching secret first and the other one as fallback. Local testing keys
(always pass, work on any hostname): sitekey `1x00000000000000000000AA`,
secret `1x0000000000000000000000000000000AA`.

## Spam scoring

`src/lib/spam/score.ts`. Flag at **60** (lead stored but not delivered,
signup → `pending_reason='spam_review'`), hard-reject at **100**. Weights:
honeypot 100 · invalid email 100 · disposable domain 60 · ≥3 dots in a
gmail local part 30 · random-case word 50 per field (cap 100) · 7+ consonant
run 20 · bad phone 20 · ≥3 URLs 50 · spam lexicon 30 · identical fields 30 ·
missing form token 40 · sub-3s submit 60 · Turnstile unavailable 40.
Case-switch detection passes McDonald / iPhone / VanDenBroucke /
Verbandsgemeinde; the consonant-run charset excludes `y` and Polish accents
so Szczepański / Chrzanowski / Pszczyna pass. Regression fixtures:
`npm test` (`scripts/spam-score.test.mjs`).

**Flagged leads are never dropped silently** — the row is stored with
`flagged=true`, `spam_score`, `spam_reasons`; only delivery is skipped.
Disposable-email datasheet requests are stored but no download mail is sent.

## Rate limits (per route)

Postgres-backed (`rate_limits` table + `rate_limit_hit` upsert function,
`SECURITY DEFINER`, ~2% chance 24h sweep per call). **Fails open** when the
function is missing or Supabase is down.

| Route | Limits |
| --- | --- |
| `/api/lead` + `/api/contact` (shared keys) | 6/10 min per IP · 10/day per canonical email |
| `/api/datasheet-request` | 5/h per IP · 3/day per email |
| `/api/portal/signup` | 6/h + 12/day POSTs per IP (= 3/h real attempts — the client silently retries once on a captcha failure) · 5/day per email · **global 30/h circuit breaker** (503 + max one admin mail/hour to `PORTAL_ADMIN_EMAIL`) |
| `/api/portal/login` | 10/10 min per IP · 20/h per email |
| architect downloads | 30/h per user id |

## Signup gating

Precedence in `/api/portal/signup` (mirrored by the login self-heal):
`spam_review` (score ≥ 60) → `freemail` (architect on a free-mail domain) →
`installer_review` (**every** non-architect self-signup stays pending until an
admin assigns markets — flip comment in the route restores instant access).
Pending accounts get HTTP 403 `{error:'pending'}` at login; the UI shows the
awaiting-review message. Company-domain architects keep instant access after
email confirmation.

## Rollout order (production)

1. Run the **ANTI-SPAM PART 1** blocks in `supabase/schema.sql` (idempotent —
   safe to re-run). First check the duplicates SELECT it contains: the unique
   `canonical_email` index only creates cleanly when existing duplicates are
   resolved.
2. Create the two Turnstile widgets in the Cloudflare dashboard with the
   hostname lists above (mode: Managed, invisible preferred).
3. Set the env vars in Vercel: both sitekeys + secrets, `FORM_SIGNING_SECRET`,
   `PORTAL_ADMIN_EMAIL`, `NEXT_PUBLIC_PORTAL_HOST=stretch.mt`. Deploy.
4. Test the public forms and a signup on the live site.
5. Supabase dashboard → Authentication → URL configuration: site URL
   `https://stretch.mt`, redirect URLs for `/portal/login`.
6. **Only after the deploy is live**: Supabase → Authentication → Attack
   protection → enable CAPTCHA (Turnstile) with `TURNSTILE_SECRET_A`.
   Turning the toggle OFF restores login instantly if anything goes wrong.

## Testing

- `npm test` — spam-score fixtures (real spam row must score ≥100; the
  anonymised legitimate rows < 60).
- Local E2E with the always-pass test keys: set the four Turnstile vars to
  the test values, submit each form, sign up, log in.
- `curl` a lead endpoint 7× from one IP → the 7th answers `429`.
- With `NEXT_PUBLIC_PORTAL_HOST=stretch.mt`: `curl -H 'Host: stretchplafond.be'
  localhost:3300/portal` → `308` to `https://stretch.mt/portal`; same host on
  `/api/portal/login` → `404`.
- Zero-config: unset every new var → forms, signup and login behave exactly
  as before (no widget rendered, no token required, no redirects).

---

# Part 2 — approval gate, admin hygiene, purge

## Approval gate

Every pending signup (`installer_review`, `freemail`, `spam_review`) emails
`PORTAL_ADMIN_EMAIL` (fallback `LEAD_DESTINATION`) the full profile + spam
context and a **signed review link** `/portal/review?t=<token>` (HMAC-SHA256
over user id + expiry with `FORM_SIGNING_SECRET`, valid 7 days). The page is
also reachable signed-in as an admin (`/portal/review?id=<userId>`, and via
the Approve/Reject row actions in the admin panel).

- The review page changes **nothing on GET** — mail scanners pre-fetch links.
  Approve and Reject are POSTs to `/api/portal/review`.
- **Approve**: b2b/trade accounts require markets (or "all markets") —
  approval IS the market assignment; architects need none. Sets
  `active=true`, clears `pending_reason`, emails the user "Your STRETCH
  account is approved" (branded, with a login button).
- **Reject**: reason (not a business / spam / duplicate / other) → deletes
  the auth user + profile; checkboxes add the canonical address and/or the
  domain to `blocked_senders`. The applicant is not notified.
- Tampered/expired token → a small branded "link expired" page pointing to
  `/portal/admin`.

## Blocklist (`public.blocked_senders`)

`kind 'email'` matches the CANONICAL address (gmail dots/+suffix collapsed);
`kind 'domain'` matches the email domain. Consulted by:
- `/api/portal/signup` → hit = 400 with the could-not-create message;
- `/api/lead`, `/api/contact`, `/api/datasheet-request` → hit = hard flag
  (stored, never delivered, no visitor mail).
Managed in the admin panel ("Blocklist" card) or via Mark-as-spam / Reject.

## Admin panel additions (`stretch.mt/portal/admin`)

- **Accounts**: status badges (Active / Pending: reason / Deactivated /
  Email unconfirmed — joined from `auth.users`), created date, search,
  status/type/country filters, a "Pending (n)" tab, expandable signup
  metadata (canonical email, IP, host, locale, user agent), row actions
  (Approve, Reject, Deactivate, Delete, Mark as spam) and bulk
  Delete / Mark as spam.
- **Leads**: newest first, 50/page, All / Flagged / Delivered filter,
  reasons on flagged rows, **Deliver now** (delivers exactly once — sets
  `flagged=false`, `delivered_at`), Delete, CSV export of the filter.

## Purge & retention (pg_cron)

Enable the `pg_cron` extension in the dashboard first (Database →
Extensions), then run the ANTI-SPAM PART 2 block in `supabase/schema.sql`.

| Job | Schedule | What it does |
| --- | --- | --- |
| `purge-unconfirmed-signups` | 03:20 UTC nightly | deletes auth users with unconfirmed email older than 48 h (admins excluded; FK cascade removes the profile) |
| `purge-lead-pii` | 03:40 UTC nightly | nulls `signup_ip`/`signup_ua` on portal_users after 30 days and `ip`/`user_agent` on leads after 90 days |

Check job runs: `select * from cron.job_run_details order by start_time desc limit 20;`

## Supabase email templates

Files in `supabase/email-templates/` (HTML to paste into Authentication →
Emails → Templates; the .txt files are the plain-text equivalents for
reference). Magic-link is intentionally absent — the portal does not use it.

| File | Dashboard template slot | Subject to set |
| --- | --- | --- |
| `confirm-signup.html` | Confirm signup | `Confirm your STRETCH portal account` |
| `reset-password.html` | Reset password | `Reset your STRETCH portal password` |
| `change-email.html` | Change email address | `Confirm your new email address — STRETCH` |
