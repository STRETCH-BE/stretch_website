// Registry of the market acoustics pages. The locale set MUST match
// src/lib/page-slugs.json (nav, sitemap, hreflang and redirects read the
// JSON; the page reads this registry) — asserted at module load.
import type { Locale } from '@/i18n/config';
import { acousticsMarkets } from '@/lib/page-slugs';
import type { AcousticsContent } from './types';
import { be } from './be';
import { nl } from './nl';
import { fr } from './fr';
import { de } from './de';

export type { AcousticsContent, Segment } from './types';

export const acousticsContent: Partial<Record<Locale, AcousticsContent>> = { be, nl, fr, de };

for (const l of acousticsMarkets) {
  if (!acousticsContent[l]) throw new Error(`page-slugs.json lists "${l}" for the acoustics page but src/lib/acoustics has no ${l}.ts module`);
}

export function getAcoustics(locale: Locale): AcousticsContent | undefined {
  return acousticsContent[locale];
}
