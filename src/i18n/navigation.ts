import { createNavigation } from 'next-intl/navigation';
import { routing } from './config';

// Locale-aware navigation primitives, DOMAIN-aware via `routing.domains`.
// ALWAYS import Link/redirect/usePathname/useRouter from here — never from
// 'next/link' / 'next/navigation'.
//
// localePrefix is FORCED to 'never' here (navigation only — the middleware
// keeps the routing config as-is). Reason: during static generation next-intl
// v3 has no request host, so 'as-needed' is evaluated against the GLOBAL
// default locale (en) and every non-en page renders prefixed hrefs
// (stretch-sufit.pl linking /pl/...) that the middleware then 308s to the
// unprefixed canonical — one redirect hop per internal link, site-wide
// (ranking audit 22 Aug 2026, §1.3). With 'never' the links render unprefixed
// and each production domain resolves them to its own locale via the Host
// header. The middleware still ACCEPTS prefixed paths: on production domains
// they 308 to the clean URL (old indexed /pl/... URLs keep redirecting), and
// on unknown hosts (localhost, previews) /pl, /fr, ... remain reachable for
// dev/QA — only in-page links lose the prefix there.
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
  createNavigation({ ...routing, localePrefix: 'never' });
