// ============================================================================
// i18n — SINGLE SOURCE OF TRUTH
// Adding a locale is a one-line change to `locales` below (plus a messages
// file). Everything else — middleware, sitemap hreflang, <html lang>, OG
// alternateLocale — derives from this file.
//
// Launch config (per brand brief): English only. `planned_locales` nl/fr/de
// are kept in the maps below so enabling them later is genuinely one line.
// ============================================================================

export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// next-intl routing definition (consumed by middleware + navigation helpers).
export const routing = {
  locales,
  defaultLocale,
  // Every route is namespaced under /<locale> — no locale-less routes.
  localePrefix: 'always' as const,
};

// Native-language display names (shown in the language switcher).
export const localeNames: Record<string, string> = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
  de: 'Deutsch',
};

// Emoji flags for the switcher.
export const localeFlags: Record<string, string> = {
  en: '🇬🇧',
  nl: '🇧🇪',
  fr: '🇧🇪',
  de: '🇧🇪',
};

// BCP 47 codes — used for <html lang>, OG locale, hreflang, formatting.
export const localeFullCodes: Record<string, string> = {
  en: 'en-BE',
  nl: 'nl-BE',
  fr: 'fr-BE',
  de: 'de-BE',
};

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
