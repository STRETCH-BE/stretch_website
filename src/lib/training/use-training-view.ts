'use client';

// ============================================================================
// TRAINING DAYS — the view inside a client form. A training/dates form that is
// given the view by its page uses it as is; one opened anywhere else (header,
// footer, architect portal, …) fetches it from /api/training/sessions for its
// locale and, until it arrives, shows the interest and custom choices built
// from the locale's own messages. Partner-run locales never fetch.
// ============================================================================
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { ModalType } from '@/lib/forms-config';
import { fallbackView, type TrainingSessionMessages } from './choices';
import type { TrainingView } from './types';

function isTrainingView(v: unknown): v is TrainingView {
  return Boolean(v && typeof v === 'object' && Array.isArray((v as TrainingView).choices) && Array.isArray((v as TrainingView).sessions));
}

export function useTrainingView(type: ModalType, provided?: TrainingView): TrainingView {
  const locale = useLocale();
  const tm = useTranslations('modals');
  const needed = type === 'training' || type === 'dates';
  const fallback = useMemo(
    () => fallbackView(locale, tm.raw('trainingSessions') as TrainingSessionMessages),
    [locale, tm],
  );
  const [fetched, setFetched] = useState<TrainingView | null>(null);

  useEffect(() => {
    if (!needed || provided || fallback.partnerRun) return;
    let cancelled = false;
    fetch(`/api/training/sessions?locale=${encodeURIComponent(locale)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && isTrainingView(json)) setFetched(json);
      })
      .catch(() => {
        /* keep the fallback choices */
      });
    return () => {
      cancelled = true;
    };
  }, [needed, provided, locale, fallback.partnerRun]);

  return provided ?? fetched ?? fallback;
}
