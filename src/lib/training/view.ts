// ============================================================================
// TRAINING DAYS — the per-locale view (server code; getTrainingView() in
// sessions.ts feeds it the cached rows). Everything a locale
// renders is built here, once per render: date labels through
// Intl.DateTimeFormat in the locale's BCP-47 code, system labels and plurals
// from modals.trainingSessions, the preferred-date choices with their English
// canonical lines (the e-mail text), and the EN/DE/PL interest state. The
// client never formats a date, so server and browser cannot disagree.
// ============================================================================
import { createTranslator } from 'next-intl';
import { localeFullCodes, type Locale } from '@/i18n/config';
import { trainingSessionsFor } from '@/lib/forms-config';
import {
  TRAINING_CUSTOM_CHOICE,
  TRAINING_INTEREST_LANGUAGES,
  interestChoiceValue,
  type TrainingInterestLanguage,
} from './config';
import { partnerChoices } from './choices';
import { isTrainingFull, upcomingSessions } from './dates';
import type { TrainingChoice, TrainingInterest, TrainingRow, TrainingView, TrainingViewSession } from './types';

/** BCP-47 code for Intl: the international English domain formats as en-GB. */
export function trainingFormatLocale(locale: Locale): string {
  return locale === 'en' ? 'en-GB' : localeFullCodes[locale];
}

/** A calendar date as a UTC instant, so formatting in UTC can never shift the day. */
function utcDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * "do 19 nov 2026" (be/nl), "Thu, 19 Nov 2026" (en/uk), "Thu, Nov 19, 2026" (us),
 * "Do., 19. Nov. 2026" (de), "jeu. 19 nov. 2026" (fr), "czw., 19 lis 2026" (pl),
 * "quinta, 19 de novembro de 2026" (pt — 'short' would print 19/11/2026);
 * a multi-day block as a range: "6–8 okt 2026".
 */
export function formatTrainingDate(locale: Locale, startsOn: string, endsOn: string | null): string {
  const month = locale === 'pt' ? 'long' : 'short';
  const tag = trainingFormatLocale(locale);
  if (!endsOn || endsOn === startsOn) {
    return new Intl.DateTimeFormat(tag, { weekday: 'short', day: 'numeric', month, year: 'numeric', timeZone: 'UTC' }).format(
      utcDate(startsOn),
    );
  }
  return new Intl.DateTimeFormat(tag, { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' }).formatRange(
    utcDate(startsOn),
    utcDate(endsOn),
  );
}

type Translator = ReturnType<typeof createTranslator>;

async function loadTranslator(locale: Locale): Promise<Translator> {
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  return createTranslator({ locale: trainingFormatLocale(locale), messages, namespace: 'modals.trainingSessions' });
}

function toViewSession(row: TrainingRow, locale: Locale, t: Translator): TrainingViewSession {
  const full = isTrainingFull(row);
  const systemLabel = t(`systems.${row.system}`);
  const seats =
    row.seats_left !== null && row.seats_left !== undefined && !full
      ? ` · ${t('seatsLeft', { count: row.seats_left })}`
      : '';
  return {
    id: row.id,
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    system: row.system,
    languages: row.languages,
    location: row.location,
    status: row.status,
    seatsLeft: row.seats_left,
    full,
    dateLabel: formatTrainingDate(locale, row.starts_on, row.ends_on),
    systemLabel,
    note: `${row.location}${seats}`,
    eventTitle: t('eventTitle', { system: systemLabel }),
  };
}

function choiceLine(s: TrainingViewSession): string {
  return `${s.dateLabel} — ${s.systemLabel} (${s.languages.join('/')})`;
}

/**
 * Build the view for a locale from the (cached) rows. Partner-run locales
 * (QuinLay AG on ch / fr-ch) keep today's behaviour exactly: the partner's
 * courses as select options, no DB sessions, no interest cards, no Events.
 */
export async function buildTrainingView(locale: Locale, rows: TrainingRow[], now: Date = new Date()): Promise<TrainingView> {
  if (trainingSessionsFor(locale).partnerRun) {
    return { partnerRun: true, sessions: [], choices: partnerChoices(locale), interest: [] };
  }
  const [t, tEn] = await Promise.all([loadTranslator(locale), locale === 'en' ? null : loadTranslator('en')]);
  const canonicalT = tEn ?? t;

  const upcoming = upcomingSessions(rows, now);
  const sessions = upcoming.map((row) => toViewSession(row, locale, t));
  const canonicalSessions = upcoming.map((row) => toViewSession(row, 'en', canonicalT));

  const openIdx = sessions.map((s, i) => (s.full ? -1 : i)).filter((i) => i >= 0);
  const openSessions = openIdx.map((i) => sessions[i]);
  const taughtIn = (l: TrainingInterestLanguage) => openSessions.filter((s) => s.languages.includes(l));

  const choices: TrainingChoice[] = [
    ...openIdx.map((i) => ({
      value: sessions[i].id,
      label: choiceLine(sessions[i]),
      canonical: `${choiceLine(canonicalSessions[i])} · ${sessions[i].location}`,
      sessionId: sessions[i].id,
    })),
    ...TRAINING_INTEREST_LANGUAGES.filter((l) => taughtIn(l).length === 0).map((l) => ({
      value: interestChoiceValue(l),
      label: t(`interest.${l}.label`),
      canonical: canonicalT(`interest.${l}.label`),
    })),
    { value: TRAINING_CUSTOM_CHOICE, label: t('custom'), canonical: canonicalT('custom') },
  ];

  const interest: TrainingInterest[] = TRAINING_INTEREST_LANGUAGES.map((l) => {
    const inLanguage = taughtIn(l);
    return {
      language: l,
      sessions: inLanguage,
      card: inLanguage.length > 0 ? null : { label: t(`interest.${l}.label`), note: t(`interest.${l}.note`) },
    };
  });

  return { partnerRun: false, sessions, choices, interest };
}
