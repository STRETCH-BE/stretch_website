// ============================================================================
// TRAINING DAYS — server-side validation of a day as the admin saves it
// (POST creates, PATCH validates the existing row merged with the patch so an
// end date is always checked against the start date). Pure: no I/O.
// ============================================================================
import {
  TRAINING_DEFAULT_LOCATION,
  TRAINING_LANGUAGES,
  TRAINING_STATUSES,
  TRAINING_SYSTEMS,
  type TrainingStatus,
  type TrainingSystem,
} from './config';

export const TRAINING_NOTE_MAX = 500;
export const TRAINING_LOCATION_MAX = 80;

/** The writable columns of public.training_sessions, validated and normalised. */
export type TrainingDayInput = {
  starts_on: string;
  ends_on: string | null;
  system: TrainingSystem;
  languages: string[];
  location: string;
  seats_left: number | null;
  status: TrainingStatus;
  published: boolean;
  note: string | null;
};

export type TrainingDayValidation = { ok: true; row: TrainingDayInput } | { ok: false; error: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** A real calendar date in YYYY-MM-DD (2026-02-30 is not one). */
export function isIsoDate(v: unknown): v is string {
  if (typeof v !== 'string' || !ISO_DATE.test(v)) return false;
  const [y, m, d] = v.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

/**
 * Validate a complete day. The first invalid field is named in `error`
 * (starts_on · ends_on · system · languages · location · seats_left · status ·
 * published · note) — the API answers 400 { ok: false, error: '<field>' }.
 * Languages are upper-cased and de-duplicated; an empty location falls back
 * to Beveren-Waas; an end date equal to the start date means a one-day session.
 */
export function validateTrainingDay(input: Record<string, unknown>): TrainingDayValidation {
  const bad = (field: string): TrainingDayValidation => ({ ok: false, error: field });

  if (!isIsoDate(input.starts_on)) return bad('starts_on');
  const starts_on = input.starts_on;

  let ends_on: string | null = null;
  if (input.ends_on !== undefined && input.ends_on !== null && input.ends_on !== '') {
    if (!isIsoDate(input.ends_on) || input.ends_on < starts_on) return bad('ends_on');
    ends_on = input.ends_on === starts_on ? null : input.ends_on;
  }

  const system = String(input.system ?? '');
  if (!(TRAINING_SYSTEMS as readonly string[]).includes(system)) return bad('system');

  if (!Array.isArray(input.languages)) return bad('languages');
  const languages = Array.from(new Set(input.languages.map((l) => String(l).trim().toUpperCase()).filter(Boolean)));
  if (languages.length === 0 || languages.some((l) => !(TRAINING_LANGUAGES as readonly string[]).includes(l))) {
    return bad('languages');
  }

  const rawLocation = input.location === undefined || input.location === null ? '' : String(input.location).trim();
  const location = rawLocation || TRAINING_DEFAULT_LOCATION;
  if (location.length > TRAINING_LOCATION_MAX) return bad('location');

  let seats_left: number | null = null;
  if (input.seats_left !== undefined && input.seats_left !== null && input.seats_left !== '') {
    const n = typeof input.seats_left === 'number' ? input.seats_left : Number(String(input.seats_left).trim());
    if (!Number.isInteger(n) || n < 0 || n > 99) return bad('seats_left');
    seats_left = n;
  }

  const status = input.status === undefined ? 'open' : String(input.status);
  if (!(TRAINING_STATUSES as readonly string[]).includes(status)) return bad('status');

  const published = input.published === undefined ? true : input.published;
  if (typeof published !== 'boolean') return bad('published');

  let note: string | null = null;
  if (input.note !== undefined && input.note !== null) {
    if (typeof input.note !== 'string') return bad('note');
    const trimmed = input.note.trim();
    if (trimmed.length > TRAINING_NOTE_MAX) return bad('note');
    note = trimmed || null;
  }

  return {
    ok: true,
    row: {
      starts_on,
      ends_on,
      system: system as TrainingSystem,
      languages,
      location,
      seats_left,
      status: status as TrainingStatus,
      published,
      note,
    },
  };
}
