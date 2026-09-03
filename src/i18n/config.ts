// ============================================================================
// i18n — SINGLE SOURCE OF TRUTH
//
// MULTI-DOMAIN SETUP: each locale is served from its own domain (one locale
// per domain), with clean, UNPREFIXED urls in production:
//
//   stretchplafond.be/products   → locale "be" (Dutch, Belgium)
//   stretchplafond.nl/products   → locale "nl" (Dutch, Netherlands)
//   stretchplafond.com/products  → locale "en" (English / international,
//                                   also the hreflang x-default)
//
// On hosts that are NOT in the domain map (localhost, *.vercel.app previews)
// every locale stays reachable via a path prefix: /be, /fr, /pl, ... and the
// default locale (en) is unprefixed. This keeps dev & preview fully working.
//
// NOTE ON "be": it is used here as a MARKET code (Belgium — Dutch content),
// not an ISO 639-1 language code (which would be Belarusian). The correct
// BCP-47 code nl-BE is mapped below and is what ends up in <html lang>,
// hreflang and og:locale — so search engines always see valid codes.
//
// Everything else — middleware, navigation, sitemap hreflang, <html lang>,
// canonical URLs, OG alternateLocale, robots.txt — derives from this file.
// To change a domain, edit `localeDomains` below. Nothing else.
// ============================================================================
// Market product term (per-market audit 2 Sep 2026, defect 5 — the word the
// market actually searches; never reintroduce the old spændloft/strekkiloft):
// da=strækloft · sv=spänntak · no=strekktak · is=dúkaloft · de=Spanndecke ·
// pl=sufit napinany · fr=plafond tendu · nl/be=spanplafond
import { defineRouting } from 'next-intl/routing';

export const locales = [
  'en', // English — international / x-default
  'uk', // English — United Kingdom (market code, not ISO 639; en-GB below)
  'us', // English — United States (market code; en-US below)
  'be', // Dutch — Belgium
  'nl', // Dutch — Netherlands
  'fr', // French — France
  'pl', // Polish — Poland
  'de', // German — Germany
  'ch', // German — Switzerland & Liechtenstein (market code; de-CH below) — stretchdecken.ch, QuinLay AG
  'fr-ch', // French — Romandie: the SAME domain as ch, served under /fr/ (fr-CH below; localePathPrefix)
  'es', // Spanish — Spain
  'pt', // Portuguese — Portugal
  'da', // Danish — Denmark
  'sv', // Swedish — Sweden
  'no', // Norwegian (Bokmål) — Norway
  'is', // Icelandic — Iceland
] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// ---------------------------------------------------------------------------
// DOMAIN MAP — the only place production domains are defined.
// Override any entry per-deploy with NEXT_PUBLIC_DOMAIN_<LOCALE> if needed.
// ---------------------------------------------------------------------------
export const localeDomains: Record<Locale, string> = {
  en: process.env.NEXT_PUBLIC_DOMAIN_EN || 'stretch.mt', // en + x-default (global); .us still 308 → here
  uk: process.env.NEXT_PUBLIC_DOMAIN_UK || 'stretch-ceilings.uk', // en-GB — UK kit/materials market
  us: process.env.NEXT_PUBLIC_DOMAIN_US || 'stretchceiling.us', // en-US — own market (audit 30 Aug 2026, F13)
  be: process.env.NEXT_PUBLIC_DOMAIN_BE || 'stretchplafond.be',
  nl: process.env.NEXT_PUBLIC_DOMAIN_NL || 'stretchplafond.nl',
  fr: process.env.NEXT_PUBLIC_DOMAIN_FR || 'stretchplafond.fr',
  pl: process.env.NEXT_PUBLIC_DOMAIN_PL || 'stretch-sufit.pl',
  de: process.env.NEXT_PUBLIC_DOMAIN_DE || 'stretchdecken.de',
  ch: process.env.NEXT_PUBLIC_DOMAIN_CH || 'stretchdecken.ch', // bought 2 Sep 2026 (+ .li → 308 here); stretchgroup.ch/.li → here at the registrar
  'fr-ch': process.env.NEXT_PUBLIC_DOMAIN_CH || 'stretchdecken.ch', // Romandie — same host as ch, public prefix /fr (localePathPrefix below)
  es: process.env.NEXT_PUBLIC_DOMAIN_ES || 'stretchtecho.es',
  pt: process.env.NEXT_PUBLIC_DOMAIN_PT || 'stretchteto.pt',
  da: process.env.NEXT_PUBLIC_DOMAIN_DA || 'straekloft.dk', // strækloft.dk (xn--strkloft-l0a.dk) 308 → here
  sv: process.env.NEXT_PUBLIC_DOMAIN_SV || 'stretchceilings.se', // spänntak.se (xn--spnntak-6wa.se) 308 → here
  no: process.env.NEXT_PUBLIC_DOMAIN_NO || 'stretchtak.no', // strekktak.no held by competitor, registrar lapsed — backorder for the drop
  is: process.env.NEXT_PUBLIC_DOMAIN_IS || 'stretch.is',
};

// ---------------------------------------------------------------------------
// LIVENESS — 'live' = the domain resolves and is served. 'pending' =
// configured but not yet reachable (no DNS / still redirecting); excluded
// from hreflang, sitemaps and the language switcher so the live domains
// never advertise a dead host. Flipping a flag to 'live' restores the
// locale everywhere with no other code change.
// ---------------------------------------------------------------------------
export const localeStatus: Record<Locale, 'live' | 'pending'> = {
  en: 'live',
  uk: 'live',
  // Live since 30 Aug 2026 — the Vercel domain-level redirect was removed
  // and stretchceiling.us serves en-US directly.
  us: 'live',
  be: 'live',
  nl: 'live',
  fr: 'live',
  pl: 'live',
  de: 'live',
  // stretchdecken.ch — domain bought 2 Sep 2026, not yet on Vercel/DNS. Flip to
  // 'live' the day it resolves: that one change adds de-CH to hreflang, the
  // sitemaps and the switcher on every domain.
  ch: 'pending',
  'fr-ch': 'pending', // flips together with ch — same domain
  es: 'live',
  pt: 'pending', // stretchteto.pt — no DNS yet
  da: 'live',
  sv: 'live',
  no: 'pending', // stretchtak.no — no DNS yet (name question open: strekktak.no is taken)
  is: 'live',
};

export const liveLocales = locales.filter((l) => localeStatus[l] === 'live');

/** Absolute https origin for a locale, e.g. "https://stretchplafond.nl". */
export function originForLocale(locale: Locale): string {
  return `https://${localeDomains[locale]}`;
}

/** Locale served by a given host (case-insensitive, ignores port & www.). */
export function localeForHost(host: string | null | undefined): Locale | null {
  if (!host) return null;
  const h = host.toLowerCase().split(':')[0].replace(/^www\./, '');
  const hit = (Object.entries(localeDomains) as [Locale, string][]).find(
    ([, d]) => d.toLowerCase() === h,
  );
  return hit ? hit[0] : null;
}

// next-intl routing definition (consumed by middleware + navigation helpers).
// One locale per domain → production URLs carry no locale prefix at all;
// unknown hosts (dev/preview) fall back to prefixed routing ("as-needed").
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // The middleware's Link-header alternates use the INTERNAL market codes
  // ('uk', 'be') — which BCP-47 reads as Ukrainian and Belarusian. Our
  // correct hreflang (en-GB, nl-BE via localeFullCodes) already ships in the
  // HTML head and the sitemap, so the header is disabled rather than let two
  // sources disagree (ranking-audit verification, 22 Aug 2026).
  alternateLinks: false,
  // URL-driven only — no cookie / Accept-Language redirects. On the
  // two-locale Swiss domain a detection redirect would bounce a visitor who
  // switched back to German straight to /fr again (the switcher navigates
  // by URL); single-locale domains never needed detection.
  localeDetection: false,
  // One entry per DOMAIN: its default (unprefixed) locale first, then any
  // path-prefixed locale it also serves (stretchdecken.ch → ch + fr-ch).
  domains: Array.from(new Set(locales.map((l) => localeDomains[l]))).map((domain) => ({
    domain,
    defaultLocale: localesForDomain(domain)[0] ?? defaultLocale,
    locales: localesForDomain(domain),
  })),
});

// Native-language display names (shown in the language switcher).
export const localeNames: Record<Locale, string> = {
  en: 'English',
  uk: 'English (UK)',
  us: 'English (US)',
  be: 'Nederlands (België)',
  nl: 'Nederlands',
  fr: 'Français',
  pl: 'Polski',
  de: 'Deutsch',
  ch: 'Deutsch (Schweiz)',
  'fr-ch': 'Français (Suisse)',
  es: 'Español',
  pt: 'Português',
  da: 'Dansk',
  sv: 'Svenska',
  no: 'Norsk',
  is: 'Íslenska',
};

// Emoji flags for the switcher.
export const localeFlags: Record<Locale, string> = {
  en: '🌐',
  uk: '🇬🇧',
  us: '🇺🇸',
  be: '🇧🇪',
  nl: '🇳🇱',
  fr: '🇫🇷',
  pl: '🇵🇱',
  de: '🇩🇪',
  ch: '🇨🇭',
  'fr-ch': '🇨🇭',
  es: '🇪🇸',
  pt: '🇵🇹',
  da: '🇩🇰',
  sv: '🇸🇪',
  no: '🇳🇴',
  is: '🇮🇸',
};

// BCP 47 codes — used for <html lang>, OG locale, hreflang, formatting.
// These are the ONLY codes exposed to browsers/search engines.
export const localeFullCodes: Record<Locale, string> = {
  en: 'en',      // international English (x-default lives on this domain)
  uk: 'en-GB',
  us: 'en-US',
  be: 'nl-BE',
  nl: 'nl-NL',
  fr: 'fr-FR',
  pl: 'pl-PL',
  de: 'de-DE',
  ch: 'de-CH',
  'fr-ch': 'fr-CH',
  es: 'es-ES',
  pt: 'pt-PT',
  da: 'da-DK',
  sv: 'sv-SE',
  no: 'nb-NO',
  is: 'is-IS',
};

// ---------------------------------------------------------------------------
// HREFLANG ALIASES — extra BCP-47 tags that point at ANOTHER locale's URL.
// stretchdecken.at redirects to stretchdecken.de (Vercel domain level), so
// de-AT is served by the German pages: every hreflang set and sitemap
// alternate lists de-AT with the de-DE URL (Google accepts several tags on
// one URL). Not a locale: no domain, no messages, no pages of its own.
// ---------------------------------------------------------------------------
export const hreflangAliases: Record<string, Locale> = {
  'de-AT': 'de',
};

// ---------------------------------------------------------------------------
// PATH-PREFIXED LOCALES — a second locale on an existing domain, served under
// a public path prefix. Romandie (fr-ch, 3 Sep 2026) lives on
// stretchdecken.ch/fr/. The middleware maps /fr ↔ next-intl's internal
// /fr-ch prefix, Link/usePathname (src/i18n/navigation.tsx) add and strip
// it, localeBase/buildCanonical (src/lib/seo.ts) and the sitemap put it in
// every absolute URL. A locale WITHOUT an entry here is its domain's default
// and stays unprefixed.
// ---------------------------------------------------------------------------
export const localePathPrefix: Partial<Record<Locale, string>> = {
  'fr-ch': '/fr',
};

/** Public path prefix of a locale ('' for a domain's default locale). */
export function publicPrefix(locale: Locale): string {
  return localePathPrefix[locale] ?? '';
}

/** Every locale a domain serves, the domain's default (unprefixed) first — config order. */
export function localesForDomain(domain: string): Locale[] {
  const d = domain.toLowerCase();
  return locales.filter((l) => localeDomains[l].toLowerCase() === d);
}

/** Every locale served by a request host (empty on unknown hosts). */
export function localesForHost(host: string | null | undefined): Locale[] {
  const first = localeForHost(host);
  return first ? localesForDomain(localeDomains[first]) : [];
}

// ---------------------------------------------------------------------------
// SWISS LOCALES — served by QuinLay AG (Switzerland & Liechtenstein): Swiss
// contact data in the chrome, no public product prices, CHF, leads to QuinLay.
// ---------------------------------------------------------------------------
export const swissLocales: readonly Locale[] = ['ch', 'fr-ch'];
export function isSwissLocale(locale: Locale): boolean {
  return swissLocales.includes(locale);
}

/** Two-letter trigger label for the language switcher: the LANGUAGE on a
 *  multi-locale domain (DE | FR on stretchdecken.ch), the market code elsewhere. */
export function localeShortLabel(locale: Locale): string {
  if (locale === 'ch') return 'DE';
  if (locale === 'fr-ch') return 'FR';
  return locale.toUpperCase();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Pull the leading locale segment from a pathname, or the default locale. */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg && isValidLocale(seg) ? seg : defaultLocale;
}

/** Strip the leading locale segment, returning the remaining path (always starts with "/"). */
export function removeLocaleFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && isValidLocale(parts[0])) parts.shift();
  return '/' + parts.join('/');
}
