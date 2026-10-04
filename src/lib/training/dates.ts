// ============================================================================
// TRAINING DAYS — pure date helpers shared by the loader, the view, the admin
// API and the tests. No I/O, no Next imports (client-safe).
// ============================================================================
import { TRAINING_SHOW_FULL, TRAINING_TIMEZONE } from './config';
import type { TrainingRow } from './types';

/** Calendar date (YYYY-MM-DD) of `now` in a time zone. */
export function dateInTimeZone(now: Date, timeZone: string = TRAINING_TIMEZONE): string {
  // en-CA prints ISO order (2026-11-19); the parts API keeps it unambiguous.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Shift an ISO date by whole days (calendar arithmetic in UTC, no DST drift). */
export function shiftIsoDate(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** A day is full when it is marked full or has no seat left. */
export function isTrainingFull(row: Pick<TrainingRow, 'status' | 'seats_left'>): boolean {
  return row.status === 'full' || row.seats_left === 0;
}

/**
 * The rows a page shows: published, starts_on AFTER today in TRAINING_TIMEZONE
 * (a day disappears on its own date) and, when TRAINING_SHOW_FULL is off, not
 * full. Soonest first.
 */
export function upcomingSessions(rows: TrainingRow[], now: Date = new Date()): TrainingRow[] {
  const today = dateInTimeZone(now);
  return rows
    .filter((r) => r.published !== false && r.starts_on > today)
    .filter((r) => TRAINING_SHOW_FULL || !isTrainingFull(r))
    .sort((a, b) => a.starts_on.localeCompare(b.starts_on));
}
