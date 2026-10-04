// ============================================================================
// TRAINING DAYS — loader (server code only). Reads public.training_sessions
// with the service-role client — never createRscClient() or anything that
// touches cookies()/headers(), which would turn the static training pages
// dynamic. One cache entry (unstable_cache, tag TRAINING_CACHE_TAG) is shared
// by every locale; the admin API revalidates the tag after each write and the
// hourly revalidate is the safety net.
//
// Caching note (Next 14.2): unstable_cache runs its callback in a scope with
// fetchCache 'force-no-store', so supabase-js's inner fetch is never cached on
// its own — a revalidateTag() always reaches the database on the next read.
// ============================================================================
import { unstable_cache } from 'next/cache';
import type { Locale } from '@/i18n/config';
import { createServiceClient } from '@/lib/portal/supabase';
import { trainingSessionsFor } from '@/lib/forms-config';
import { TRAINING_CACHE_TAG, TRAINING_REVALIDATE_SECONDS } from './config';
import { dateInTimeZone, shiftIsoDate } from './dates';
import type { TrainingRow, TrainingView } from './types';
import { buildTrainingView } from './view';

export { dateInTimeZone, isTrainingFull, shiftIsoDate, upcomingSessions } from './dates';

/** Every column the site reads — the internal `note` is deliberately absent. */
export const TRAINING_ROW_COLUMNS =
  'id, starts_on, ends_on, system, languages, location, seats_left, status, published, created_at, updated_at';

async function fetchTrainingRows(): Promise<TrainingRow[]> {
  const db = createServiceClient();
  if (!db) return []; // no Supabase env — the pages fall back to the on-request card
  const since = shiftIsoDate(dateInTimeZone(new Date()), -1);
  const { data, error } = await db
    .from('training_sessions')
    .select(TRAINING_ROW_COLUMNS)
    .eq('published', true)
    .gte('starts_on', since)
    .order('starts_on', { ascending: true });
  if (error) {
    console.error(`[training] sessions query failed: ${error.message}`);
    return [];
  }
  return (data ?? []) as TrainingRow[];
}

const cachedTrainingRows = unstable_cache(fetchTrainingRows, ['training-sessions'], {
  tags: [TRAINING_CACHE_TAG],
  revalidate: TRAINING_REVALIDATE_SECONDS,
});

/**
 * Published rows from yesterday on, soonest first — one shared cache entry.
 * Never throws into a page: any failure logs one line (no data) and yields [].
 */
export async function getTrainingRows(): Promise<TrainingRow[]> {
  try {
    return await cachedTrainingRows();
  } catch (err) {
    console.error(`[training] sessions unavailable: ${err instanceof Error ? err.message : 'unknown'}`);
    return [];
  }
}

/** The view for a locale from the shared cached rows (no database call on partner-run locales). */
export async function getTrainingView(locale: Locale, now: Date = new Date()): Promise<TrainingView> {
  const rows = trainingSessionsFor(locale).partnerRun ? [] : await getTrainingRows();
  return buildTrainingView(locale, rows, now);
}
