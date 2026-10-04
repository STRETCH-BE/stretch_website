// ============================================================================
// TRAINING DAYS — constants. The Beveren-Waas installer-training days live in
// public.training_sessions (Supabase) and are edited from /portal/admin; this
// file holds the knobs around that table. Client-safe: no server imports.
// ============================================================================

/** How long a rendered training page / the cached row set may be served
 *  before it is re-read (seconds). A save in the admin refreshes at once via
 *  revalidateTag; this is the safety net. Keep equal to the literal
 *  `export const revalidate` on the pages that read the table. */
export const TRAINING_REVALIDATE_SECONDS = 3600;

/** true: a full day stays on the page with a "Full" tag until its date.
 *  false: a day disappears as soon as it is full. */
export const TRAINING_SHOW_FULL = true;

/** Languages of instruction the admin can tick (badge codes, never translated). */
export const TRAINING_LANGUAGES = ['NL', 'FR', 'EN', 'DE', 'PL'] as const;
export type TrainingLanguage = (typeof TRAINING_LANGUAGES)[number];

/** The languages with their own "international" funnel on /installer-training:
 *  real days when one is taught in that language, an interest card otherwise. */
export const TRAINING_INTEREST_LANGUAGES = ['EN', 'DE', 'PL'] as const;
export type TrainingInterestLanguage = (typeof TRAINING_INTEREST_LANGUAGES)[number];

export const TRAINING_SYSTEMS = ['polyester', 'pvc', 'both'] as const;
export type TrainingSystem = (typeof TRAINING_SYSTEMS)[number];

export const TRAINING_STATUSES = ['open', 'full'] as const;
export type TrainingStatus = (typeof TRAINING_STATUSES)[number];

export const TRAINING_DEFAULT_LOCATION = 'Beveren-Waas';

/** Defines "today" for hiding past days: a day disappears on its own date. */
export const TRAINING_TIMEZONE = 'Europe/Brussels';

/** Next data-cache tag shared by every reader of the table. */
export const TRAINING_CACHE_TAG = 'training-sessions';

/** Preferred-date select values that are not a session id. */
export const TRAINING_CUSTOM_CHOICE = 'custom';
export const TRAINING_INTEREST_PREFIX = 'interest:';
export function interestChoiceValue(language: TrainingInterestLanguage): string {
  return `${TRAINING_INTEREST_PREFIX}${language}`;
}
