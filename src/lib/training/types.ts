// ============================================================================
// TRAINING DAYS — shared shapes (client-safe). The row is what the site reads
// from public.training_sessions (never the internal note); the view is what a
// locale renders: formatted labels, the preferred-date choices and the EN/DE/PL
// interest state. Only the server formats dates (view.ts) so the browser and
// the server can never disagree.
// ============================================================================
import type { TrainingInterestLanguage, TrainingStatus, TrainingSystem } from './config';

export type TrainingRow = {
  id: string;
  /** ISO date (YYYY-MM-DD). */
  starts_on: string;
  /** ISO date or null = a one-day session. */
  ends_on: string | null;
  system: TrainingSystem;
  /** Subset of TRAINING_LANGUAGES, e.g. ['NL', 'EN']. */
  languages: string[];
  location: string;
  seats_left: number | null;
  status: TrainingStatus;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type TrainingViewSession = {
  id: string;
  startsOn: string;
  endsOn: string | null;
  system: TrainingSystem;
  languages: string[];
  location: string;
  status: TrainingStatus;
  seatsLeft: number | null;
  /** status 'full' or seats_left = 0. */
  full: boolean;
  /** Localized date, e.g. "do 19 nov 2026" / "Thu, 19 Nov 2026" / "6–8 okt 2026". */
  dateLabel: string;
  /** Localized system, e.g. "Polyester spanplafonds". */
  systemLabel: string;
  /** Card note: the location, plus " · " and the seats-left plural when seats
   *  are set and the day is open. */
  note: string;
  /** Localized events title: "Installer training — Polyester ceilings". */
  eventTitle: string;
};

/** One option of the preferred-date select. `value` is submitted by the form
 *  and mapped to `canonical` (English, the e-mail text) on submit. */
export type TrainingChoice = {
  /** Session id, 'interest:EN' | 'interest:DE' | 'interest:PL', or 'custom'. */
  value: string;
  /** Localized label shown in the select. */
  label: string;
  /** The same line in English — what the lead e-mail reads, whatever the visitor's language. */
  canonical: string;
  /** Set when the choice is a real day: stored as leads.payload.trainingSessionId. */
  sessionId?: string;
};

export type TrainingInterest = {
  language: TrainingInterestLanguage;
  /** Open upcoming sessions taught in this language. */
  sessions: TrainingViewSession[];
  /** The interest card (label + note) when no such session exists, else null. */
  card: { label: string; note: string } | null;
};

export type TrainingView = {
  /** Partner-run locale (QuinLay AG on ch / fr-ch): no DB sessions, no interest cards, no Events. */
  partnerRun: boolean;
  /** Upcoming sessions, open and (when TRAINING_SHOW_FULL) full, soonest first. */
  sessions: TrainingViewSession[];
  choices: TrainingChoice[];
  interest: TrainingInterest[];
};
