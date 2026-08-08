// =============================================================================
// EVENTS — trainings, lunch & learns, showroom days and fairs, shown in the
// architect area and on /architects. Hand-edited control file: add an entry,
// commit, done. Past events (isoDate before today) are hidden automatically.
// Keep the training entries in sync with TRAINING_DATE_DETAIL in
// forms-config.ts.
// =============================================================================

export type EventKind = 'lunch-learn' | 'showroom' | 'fair' | 'training';

export type StretchEvent = {
  slug: string;
  title: string;
  /** Human date label, e.g. '15–16 Sep 2026'. */
  dateLabel: string;
  /** ISO date of the (first) day — used for sorting + hiding past events. */
  isoDate: string;
  location: string;
  kind: EventKind;
  blurb: string;
  /** Still open for registration? */
  open: boolean;
};

export const events: StretchEvent[] = [
  {
    slug: 'training-sep-2026',
    title: 'Installer training — 2 days',
    dateLabel: '15–16 Sep 2026',
    isoDate: '2026-09-15',
    location: 'Beveren-Waas',
    kind: 'training',
    blurb: 'Hands-on certification at our Belgian HQ — 4 seats.',
    open: true,
  },
  {
    slug: 'training-oct-2026',
    title: 'Installer training — 3 days',
    dateLabel: '06–08 Oct 2026',
    isoDate: '2026-10-06',
    location: 'Beveren-Waas',
    kind: 'training',
    blurb: 'Hands-on certification at our Belgian HQ — 6 seats.',
    open: true,
  },
  {
    slug: 'training-nov-2026',
    title: 'Installer training — 2 days',
    dateLabel: '17–18 Nov 2026',
    isoDate: '2026-11-17',
    location: 'Beveren-Waas',
    kind: 'training',
    blurb: 'Hands-on certification at our Belgian HQ — 8 seats.',
    open: true,
  },
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

/** Upcoming events, soonest first. `now` injectable for tests. */
export function upcomingEvents(now = new Date()): StretchEvent[] {
  const today = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.isoDate >= today)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}
