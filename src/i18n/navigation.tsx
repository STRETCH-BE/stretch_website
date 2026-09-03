import { forwardRef, type ComponentProps, type ComponentRef } from 'react';
import { useLocale } from 'next-intl';
import { createNavigation } from 'next-intl/navigation';
import { routing, localePathPrefix, type Locale } from './config';

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
//
// PATH-PREFIXED LOCALES (fr-ch on stretchdecken.ch/fr/, 3 Sep 2026): a locale
// with an entry in localePathPrefix is the SECOND locale on its domain, so
// its links must carry the public prefix — Link adds it and usePathname
// strips it, both keyed on the active locale. (On localhost /fr/... is the
// French locale, so fr-ch in-page links only resolve on the real host —
// same class of dev-only limitation as the unprefixed links above.)
const nav = createNavigation({ ...routing, localePrefix: 'never' });

export const { redirect, permanentRedirect, useRouter, getPathname } = nav;

type BaseLinkProps = ComponentProps<typeof nav.Link>;
type Href = BaseLinkProps['href'];

function withPrefix(href: Href, prefix: string): Href {
  if (typeof href === 'string') {
    if (!href.startsWith('/') || href === prefix || href.startsWith(`${prefix}/`)) return href;
    return href === '/' ? prefix : `${prefix}${href}`;
  }
  if (href && typeof href === 'object' && typeof href.pathname === 'string') {
    return { ...href, pathname: withPrefix(href.pathname, prefix) as string };
  }
  return href;
}

export const Link = forwardRef<ComponentRef<typeof nav.Link>, BaseLinkProps>(function Link(props, ref) {
  const active = useLocale() as Locale;
  const target = (props.locale as Locale | undefined) ?? active;
  const prefix = localePathPrefix[target];
  const href = prefix ? withPrefix(props.href, prefix) : props.href;
  return <nav.Link ref={ref} {...props} href={href} />;
});

/** Locale-agnostic pathname ("/products"), with a path-prefixed locale's public prefix stripped. */
export function usePathname(): ReturnType<typeof nav.usePathname> {
  const pathname = nav.usePathname();
  const locale = useLocale() as Locale;
  const prefix = localePathPrefix[locale];
  if (!prefix || !pathname) return pathname;
  if (pathname === prefix) return '/';
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}
