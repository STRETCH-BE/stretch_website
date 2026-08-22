// ============================================================================
// SIGNUP COUNTRIES — the one list behind every portal account-country select
// (B2B/architect signup + the admin create form). Client-safe, no imports.
//
// STRETCH supplies trade partners Europe-wide: the select leads with the
// EU/EEA + UK + CH group (sorted alphabetically in the visitor's language),
// with the few overseas markets after them. ISO 3166-1 alpha-2 codes — labels
// come from the browser's own Intl region names.
// ============================================================================

/** EU + EEA + United Kingdom + Switzerland. */
export const EUROPE_SIGNUP_COUNTRIES = [
  'AT', 'BE', 'BG', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR',
  'GB', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MT',
  'NL', 'NO', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
] as const;

/** Non-European markets the group actually serves. */
export const OVERSEAS_SIGNUP_COUNTRIES = ['US', 'AE'] as const;

export type SignupCountry =
  | (typeof EUROPE_SIGNUP_COUNTRIES)[number]
  | (typeof OVERSEAS_SIGNUP_COUNTRIES)[number];

/**
 * Options for a country select: the European group first (alphabetical by
 * localized label), then overseas. Falls back to raw codes when the browser
 * lacks Intl.DisplayNames for the locale.
 */
export function signupCountryOptions(locale: string): { code: string; label: string }[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([locale], { type: 'region' });
  } catch {
    names = null;
  }
  const label = (code: string) => names?.of(code) ?? code;
  const sortByLabel = (codes: readonly string[]) =>
    codes.map((code) => ({ code, label: label(code) })).sort((a, b) => a.label.localeCompare(b.label, locale));
  return [...sortByLabel(EUROPE_SIGNUP_COUNTRIES), ...sortByLabel(OVERSEAS_SIGNUP_COUNTRIES)];
}
