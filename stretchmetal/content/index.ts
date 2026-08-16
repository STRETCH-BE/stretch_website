// ============================================================================
// CONTENT INDEX — one accessor that returns the full content bundle for a
// locale. Pages call getContent(locale) instead of importing individual files,
// so the PL/EN symmetry is enforced in one place and a page can never mix
// locales by accident.
// ============================================================================
import type { Locale } from '@/lib/i18n-routes';

import { chrome as chromePl } from '@/content/chrome';
import { home as homePl } from '@/content/home';
import { services as servicesPl, servicesHub as servicesHubPl, serviceCards as serviceCardsPl } from '@/content/services';
import { machinePark as machineParkPl } from '@/content/machines';
import { about as aboutPl } from '@/content/about';
import { projects as projectsPl } from '@/content/projects';
import { rfq as rfqPl } from '@/content/rfq';
import { contactPage as contactPl } from '@/content/contact';
import { privacy as privacyPl, cookies as cookiesPl } from '@/content/legal';

import { chrome as chromeEn } from '@/content/en/chrome';
import { home as homeEn } from '@/content/en/home';
import { services as servicesEn, servicesHub as servicesHubEn, serviceCards as serviceCardsEn } from '@/content/en/services';
import { machinePark as machineParkEn } from '@/content/en/machines';
import { about as aboutEn } from '@/content/en/about';
import { projects as projectsEn } from '@/content/en/projects';
import { rfq as rfqEn } from '@/content/en/rfq';
import { contactPage as contactEn } from '@/content/en/contact';
import { privacy as privacyEn, cookies as cookiesEn } from '@/content/en/legal';

const bundles = {
  pl: {
    chrome: chromePl,
    home: homePl,
    services: servicesPl,
    servicesHub: servicesHubPl,
    serviceCards: serviceCardsPl,
    machinePark: machineParkPl,
    about: aboutPl,
    projects: projectsPl,
    rfq: rfqPl,
    contact: contactPl,
    privacy: privacyPl,
    cookies: cookiesPl,
  },
  en: {
    chrome: chromeEn,
    home: homeEn,
    services: servicesEn,
    servicesHub: servicesHubEn,
    serviceCards: serviceCardsEn,
    machinePark: machineParkEn,
    about: aboutEn,
    projects: projectsEn,
    rfq: rfqEn,
    contact: contactEn,
    privacy: privacyEn,
    cookies: cookiesEn,
  },
} as const;

export type ContentBundle = (typeof bundles)[Locale];

export function getContent(locale: Locale): ContentBundle {
  return bundles[locale];
}
