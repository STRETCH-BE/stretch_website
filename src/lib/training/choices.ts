// ============================================================================
// TRAINING DAYS — preferred-date choices (client-safe). The select submits a
// choice VALUE (a session id, 'interest:EN', 'custom'); on submit the form maps
// it to the choice's English canonical label (what the e-mail reads) and, for a
// real day, the session id (stored in leads.payload.trainingSessionId).
// ============================================================================
import { trainingSessionsFor } from '@/lib/forms-config';
import {
  TRAINING_CUSTOM_CHOICE,
  TRAINING_INTEREST_LANGUAGES,
  interestChoiceValue,
  type TrainingInterestLanguage,
} from './config';
import type { TrainingChoice, TrainingView } from './types';

/** The modals.trainingSessions namespace as the client receives it (tm.raw). */
export type TrainingSessionMessages = {
  interest: Record<TrainingInterestLanguage, { label: string; note: string }>;
  custom: string;
};

/**
 * English wording of the interest / custom choices — mirrors
 * modals.trainingSessions in messages/en.json. Used as the canonical e-mail
 * text only while a modal opened without a view is still fetching it.
 */
const CANONICAL_FALLBACK: Record<TrainingInterestLanguage | 'custom', string> = {
  EN: 'English session — new dates soon',
  DE: 'German session — new dates soon',
  PL: 'Polish session — new dates soon',
  custom: 'Custom on-site session',
};

/** The interest (EN/DE/PL) and custom choices from a locale's messages. */
export function fallbackChoices(m: TrainingSessionMessages): TrainingChoice[] {
  return [
    ...TRAINING_INTEREST_LANGUAGES.map((l) => ({
      value: interestChoiceValue(l),
      label: m.interest[l].label,
      canonical: CANONICAL_FALLBACK[l],
    })),
    { value: TRAINING_CUSTOM_CHOICE, label: m.custom, canonical: CANONICAL_FALLBACK.custom },
  ];
}

/** Partner-run locale (QuinLay AG): the partner's courses, value = label — today's behaviour. */
export function partnerChoices(locale: string): TrainingChoice[] {
  return trainingSessionsFor(locale).sessions.map((s) => ({ value: s.date, label: s.date, canonical: s.date }));
}

/** What a training/dates form shows before (or without) the server view. */
export function fallbackView(locale: string, m: TrainingSessionMessages): TrainingView {
  if (trainingSessionsFor(locale).partnerRun) {
    return { partnerRun: true, sessions: [], choices: partnerChoices(locale), interest: [] };
  }
  return {
    partnerRun: false,
    sessions: [],
    choices: fallbackChoices(m),
    interest: TRAINING_INTEREST_LANGUAGES.map((l) => ({ language: l, sessions: [], card: m.interest[l] })),
  };
}

/** The choice behind a submitted select value, or null when it is not one of ours. */
export function resolveTrainingChoice(choices: TrainingChoice[], value: string): TrainingChoice | null {
  return choices.find((c) => c.value === value) ?? null;
}

/**
 * Rewrite a submission in place: preferredDate becomes the choice's English
 * canonical label and, for a real day, trainingSessionId is added. A value we
 * do not know (e.g. a partner course label) is left untouched.
 */
export function applyTrainingChoice(data: Record<string, string>, choices: TrainingChoice[]): void {
  const picked = data.preferredDate;
  if (!picked) return;
  const choice = resolveTrainingChoice(choices, picked);
  if (!choice) return;
  data.preferredDate = choice.canonical;
  if (choice.sessionId) data.trainingSessionId = choice.sessionId;
}
