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
//  - The aggregate score is computed from >= 3 genuine reviews, never
//    hardcoded — and it is VISIBLE TEXT ONLY (the Reviews section header).
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

// Populated 30 Aug 2026 from the two managed Google Business profiles
// (screenshots supplied by Michael): STRETCH, Gentseweg 309/A3 Beveren (be)
// and Alto Design Sp. z o.o., Legionów 59 Częstochowa (pl). Only reviews
// whose full text was visible are included (truncated ones cannot be quoted
// verbatim); rating-only reviews carry no quote and are omitted. Dates are
// year-precision ISO ("about N years ago" on Google). sourceUrl points at
// the public profile's review list — swap in per-review Share links when
// available.
//
// NO Review/AggregateRating structured data: self-serving reviews on an
// Organization/LocalBusiness node are ineligible for star results.
// Stars are only reachable via Product schema with genuine per-product
// reviews — which we do not yet collect.
export const reviews: Review[] = [
  // --- stretchplafond.be — STRETCH, Beveren (5.0, managed profile) ---------
  {
    author: 'Paulina Piotrovska',
    locale: 'be',
    rating: 5,
    datePublished: '2024',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=STRETCH+Gentseweg+309+A3+9120+Beveren',
    quote: 'High quality products and service, they put the customers first!',
  },
  {
    author: 'Dorus Lippens',
    locale: 'be',
    rating: 5,
    datePublished: '2021',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=STRETCH+Gentseweg+309+A3+9120+Beveren',
    quote: 'Top service',
  },
  // --- stretch-sufit.pl — Alto Design Sp. z o.o., Częstochowa --------------
  {
    author: 'Dorota Kucharska',
    locale: 'pl',
    rating: 5,
    datePublished: '2024',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Polecam z całego serca , wykończony sufit wyglada naprawdę pięknie , rzetelna i uczciwa firma.',
  },
  {
    author: 'Dawid Łukasik',
    locale: 'pl',
    rating: 5,
    datePublished: '2023',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Polecam w 100% super kontakt, szybki pomiar, wycena i efekt znakomity',
  },
  {
    author: 'Angelika Królikowska',
    locale: 'pl',
    rating: 5,
    datePublished: '2023',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Bardzo polecam firmę Alto Design i właściciela Pana Romana. Obsługa klienta na najwyższym poziomie, pan Roman doradza i pomaga w wyborze kolorów i rodzajów sufitów. Szybki termin wykonania, ceny bardzo dobre. Efekt wow gwarantowany. Pan, który robił sufity swoją pracę wykonał bardzo dokładnie i z ogromną starannością. Nie ma się do czego przyczepić. Żałuję, że tak długo zwlekaliśmy ze zrobieniem sufitów napinanych. Na pewno jeszcze skorzystamy z usług Alto Design. Gdyby wszystkie firmy remontowe tak obsługiwały klientów i wykonywały swoją pracę świat byłby piękniejszy :) pozdrawiamy',
  },
  {
    author: 'Tarek Daghestani',
    locale: 'pl',
    rating: 5,
    datePublished: '2021',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Bardzo dobry kontakt z wykonawcą sufitów napinanych. Ekipa monterów bardzo miła, konkretna i fachowa, zrobili swoje bardzo szybko i bez marudzenia 😊. Polecam współpracę, będziecie zadowoleni 😉.',
  },
  {
    author: 'Anna Gołębiowska',
    locale: 'pl',
    rating: 5,
    datePublished: '2021',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Firma zatrudnia profesjonalnych pracowników, którzy świetnie wykonują swoją pracę, oczywiście zgodnie z umową. Bardzo szybki termin realizacji. Super. Bardzo polecamy',
  },
  {
    author: 'Łukasz Graczyk',
    locale: 'pl',
    rating: 5,
    datePublished: '2021',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Polecam w 200% Alto Design. Super ekipa która napinala sufit, terminowi przede wszystkim, czysto zrobione,kontakt i wycena z szefem bez żadnego problemu. Mogę śmiało stwierdzić że w dzisiejszych czasach o tak super zrobioną usługę jest ciężko.Dziekuje polecam i pozdrawiam serdecznie 😉😉😉',
  },
  {
    author: 'Aneta Łozińska',
    locale: 'pl',
    rating: 5,
    datePublished: '2021',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Serdecznie dziękuję za wykonanie sufitu napinanego. Jakość usługi (przy moim suficie panowie innych firm twierdzili ze jest nie możliwe zrobienie go idealnego bez marszczeń) a jednak firma wykonała go idealnie, termin, fachowość, sympatyczna ekipa po prostu nie ma słów żeby to określić. Bardzo polecam usługi tej firmy. Napewno każdy podzieli moje zdanie. Jeszcze raz dziekuje',
  },
  {
    author: 'D D',
    locale: 'pl',
    rating: 5,
    datePublished: '2021',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Szczerze polecam, solidna i profesjonalna firma. Pan Wojtek cierpliwie wyjaśniał wszelkie wątpliwości. Szczególne podziękowania dla ekipy- pracowali do późnych godzin nocnych, na bieżąco rozwiązywali wszelkie trudności. Szybki termin realizacji, jesteśmy bardzo zadowoleni.',
  },
  {
    author: 'Patryk Krzywdziński',
    locale: 'pl',
    rating: 5,
    datePublished: '2020',
    source: 'google',
    sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Alto+Design+Sufity+napinane+Legion%C3%B3w+59+Cz%C4%99stochowa',
    quote: 'Super wykonanie i super ekipa dokładna i czysta robota polecam',
  },
];

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
