// =============================================================================
// EVENTS — trainings, lunch & learns, showroom days and fairs, shown in the
// architect area and on /architects. The lunch & learns, showroom days and
// fairs are hand-edited here: add an entry, commit, done. The Beveren-Waas
// TRAINING days are NOT: they come from public.training_sessions through the
// training view (src/lib/training/), one 'training' event per upcoming day,
// and partner-run locales (QuinLay AG) get none. Past events are hidden.
// =============================================================================
import type { Locale } from '@/i18n/config';
import { getTrainingView } from '@/lib/training/sessions';

export type EventKind = 'lunch-learn' | 'showroom' | 'fair' | 'training';

export type StretchEvent = {
  slug: string;
  title: string;
  /** Human date label, e.g. 'do 19 nov 2026' / 'Oct 2026 · date TBC'. */
  dateLabel: string;
  /** ISO date of the (first) day — used for sorting + hiding past events. */
  isoDate: string;
  location: string;
  kind: EventKind;
  blurb: string;
  /** Still open for registration? */
  open: boolean;
  /** Training events: the public.training_sessions id (prefills the booking form). */
  sessionId?: string;
};

export const events: StretchEvent[] = [
  // PLACEHOLDER lunch & learns — Michael confirms dates and topics.
  {
    slug: 'lunch-learn-acoustics',
    title: 'Lunch & learn — acoustics that show their numbers',
    dateLabel: 'Oct 2026 · date TBC',
    isoDate: '2026-10-20',
    location: 'At your office (BE/NL)',
    kind: 'lunch-learn',
    blurb: 'One hour at your office: measured RT60 cases, absorption classes and how to specify them.',
    open: true,
  },
  {
    slug: 'lunch-learn-light',
    title: 'Lunch & learn — backlit ceilings & printed light',
    dateLabel: 'Nov 2026 · date TBC',
    isoDate: '2026-11-24',
    location: 'At your office (BE/NL)',
    kind: 'lunch-learn',
    blurb: 'Luminous ceilings in practice: lux levels, uniformity, printable membranes and details that work.',
    open: true,
  },
];

/**
 * Upcoming events for a locale, soonest first: the hand-edited events plus one
 * training event per upcoming Beveren-Waas day (localized title, date label and
 * note from the training view). `now` injectable for tests.
 */
export async function upcomingEvents(locale: Locale, now: Date = new Date()): Promise<StretchEvent[]> {
  const today = now.toISOString().slice(0, 10);
  const view = await getTrainingView(locale, now);
  const training: StretchEvent[] = view.sessions.map((s) => ({
    slug: `training-${s.id}`,
    title: s.eventTitle,
    dateLabel: s.dateLabel,
    isoDate: s.startsOn,
    location: s.location,
    kind: 'training',
    blurb: s.note,
    open: !s.full,
    sessionId: s.id,
  }));
  return [...events.filter((e) => e.isoDate >= today), ...training].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}
