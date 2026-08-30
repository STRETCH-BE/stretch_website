// =============================================================================
// GENUINE CUSTOMER REVIEWS — the ONLY source the Reviews section and any
// Review / AggregateRating structured data may read from. Non-genuine review
// presentation is a blacklisted practice under the UCPD, so this array ships
// EMPTY and is populated exclusively with real, public, permission-cleared
// reviews (network audit 30 Aug 2026, F10).
//
// Rules:
//  - `quote` stays in the ORIGINAL language, verbatim — never translated.
//  - `sourceUrl` must point at the actual public review.
//  - A market renders the section only for its own `locale` entries and
//    renders NOTHING when it has none.
//  - aggregateRating is computed from >= 3 genuine reviews, never hardcoded.
// =============================================================================
import type { Locale } from '@/i18n/config';

export type Review = {
  author: string; // real first name as published, e.g. "Katrien D."
  city?: string;
  locale: Locale; // which market's domain this review belongs on
  rating: 1 | 2 | 3 | 4 | 5;
  datePublished: string; // ISO
  source: 'google';
  sourceUrl: string; // link to the actual public review
  quote: string; // original language, verbatim, never translated
};

export const reviews: Review[] = []; // Michael populates with real reviews

/** The reviews shown on a market's own domain. */
export function reviewsFor(locale: Locale): Review[] {
  return reviews.filter((r) => r.locale === locale);
}

/** Aggregate for a market — null below 3 genuine reviews (no rating markup). */
export function aggregateFor(
  locale: Locale,
): { ratingValue: string; reviewCount: number } | null {
  const rs = reviewsFor(locale);
  if (rs.length < 3) return null;
  const avg = rs.reduce((sum, r) => sum + r.rating, 0) / rs.length;
  return { ratingValue: (Math.round(avg * 10) / 10).toFixed(1), reviewCount: rs.length };
}
