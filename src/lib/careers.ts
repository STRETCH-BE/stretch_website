// ============================================================================
// CAREERS — the open positions behind /careers and /careers/[slug].
// STRUCTURE ONLY: slug, hiring entity, place, dates and how to apply. Every
// word a visitor reads (title, summary, the six sections) lives in the
// messages under careersPage.jobs.<slug>, in all 16 locale files (ch and
// fr-ch are generated from de / fr by scripts/ch-overlay.mjs and
// scripts/fr-ch-overlay.mjs — never edited by hand).
//
// To publish a vacancy: one entry here + its texts in the 14 source message
// files, then regenerate the two Swiss overlays. To close one: remove the
// entry — the detail route 404s (dynamicParams=false), the listing, the
// sitemap and the "other positions" block follow by themselves.
//
// No salary is published on the website (Michael, 6 Oct 2026): neither in
// the copy nor as JobPosting.baseSalary.
// ============================================================================
import type { Locale } from '@/i18n/config';
import { siteUrl, brand, contact, polishEntity, groupSites } from '@/lib/site-config';

export type VacancyEmployer = {
  /** Legal name of the hiring entity — printed on the page and in the JobPosting node. */
  name: string;
  /** The entity's public website (JobPosting.hiringOrganization.sameAs). */
  url: string;
};

export type Vacancy = {
  /** URL slug, identical on every locale: /careers/<slug>. */
  slug: string;
  employer: VacancyEmployer;
  /** Locales whose own market this vacancy belongs to — listed first there. */
  markets: readonly Locale[];
  /** Workplace (JobPosting.jobLocation) — from site-config, so it matches the contact pages. */
  address: { street: string; postalCode: string; city: string; region?: string; country: string };
  /** schema.org employmentType. */
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
  /** ISO date the vacancy went live — JobPosting.datePosted and the sitemap <lastmod>. */
  datePosted: string;
  apply: {
    email: string;
    /** The subject line applicants are asked to use — pre-filled in the mailto link, same in every language. */
    subject: string;
    phoneDisplay: string;
    phoneHref: string;
  };
};

const STRETCH: VacancyEmployer = { name: brand.legalName, url: siteUrl };
const ALTO: VacancyEmployer = { name: polishEntity.name, url: groupSites.alto };

export const vacancies: readonly Vacancy[] = [
  // Project Manager — Beveren-Waas HQ (vacancy document, September 2026).
  {
    slug: 'project-manager',
    employer: STRETCH,
    markets: ['be', 'nl'],
    address: {
      street: contact.address.streetShort,
      postalCode: contact.address.postalCode,
      city: contact.address.city,
      region: contact.address.region,
      country: contact.address.country,
    },
    employmentType: 'FULL_TIME',
    datePosted: '2026-10-06',
    apply: { email: contact.email, subject: 'Project Manager', phoneDisplay: contact.phoneDisplay, phoneHref: contact.phoneHref },
  },
  // Inside Sales — Alto Design Sp. z o.o., Częstochowa (copy drafted 6 Oct 2026, see CHANGES.md).
  {
    slug: 'inside-sales',
    employer: ALTO,
    markets: ['pl'],
    address: {
      street: polishEntity.street,
      postalCode: polishEntity.postalCode,
      city: polishEntity.city,
      country: polishEntity.country,
    },
    employmentType: 'FULL_TIME',
    datePosted: '2026-10-06',
    apply: {
      email: polishEntity.email,
      subject: 'Inside Sales',
      phoneDisplay: polishEntity.phones[0].display,
      phoneHref: polishEntity.phones[0].href,
    },
  },
];

export const vacancySlugs = vacancies.map((v) => v.slug);

export function getVacancy(slug: string): Vacancy | undefined {
  return vacancies.find((v) => v.slug === slug);
}

/** The open positions for a locale: its own market's vacancies first, then the rest in list order. */
export function vacanciesFor(locale: Locale): Vacancy[] {
  return [...vacancies.filter((v) => v.markets.includes(locale)), ...vacancies.filter((v) => !v.markets.includes(locale))];
}

/** mailto: link with the subject line pre-filled. */
export function applyHref(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

/** Sitemap <lastmod> for /careers and the vacancy pages — bump when a vacancy opens, closes or changes. */
export const careersUpdatedAt = '2026-10-06';
