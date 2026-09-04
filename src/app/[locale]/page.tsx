// Homepage. Assembles the home sections in mockup order (light → dark → red
// rhythm) and emits Organization, WebSite and LocalBusiness JSON-LD. Metadata
// for "/" comes from the locale layout; this route relies on that default.
//
// Per-market variations (audit 2 Sep 2026):
//   de — the calculator is the weapon: a compact estimator entry point sits
//        directly under the hero (T6) and hands over to /price-calculator.
//   pl — the academy is the story: the installer band moves up, right after
//        the stats, so installers and contractors meet it first (T7).
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import JsonLd from '@/components/seo/JsonLd';
import { organizationSchema, websiteSchema, localBusinessSchema, polishBusinessSchema } from '@/lib/structured-data';

import Hero from '@/components/sections/home/Hero';
import HomeEstimator from '@/components/sections/home/HomeEstimator';
import { Ticker, Stats } from '@/components/sections/home/TickerStats';
import WhyStretch from '@/components/sections/home/WhyStretch';
import Solutions from '@/components/sections/home/Solutions';
import Acoustics from '@/components/sections/home/Acoustics';
import ApplicationAreas from '@/components/sections/home/ApplicationAreas';
import InstallerPartner from '@/components/sections/home/InstallerPartner';
import Gallery from '@/components/sections/home/Gallery';
// Reviews renders ONLY genuine, permission-cleared Google reviews from
// src/lib/reviews.ts — and renders nothing at all for markets without them
// (UCPD: non-genuine review presentation is a blacklisted practice).
import Reviews from '@/components/sections/home/Reviews';
import CtaBand from '@/components/sections/home/CtaBand';

/** Locales whose homepage carries the compact estimator under the hero. */
const ESTIMATOR_HOME: readonly Locale[] = ['de'];
/** Locales whose homepage leads with the installer academy. */
const ACADEMY_FIRST: readonly Locale[] = ['pl'];

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale: Locale = isValidLocale(params.locale) ? (params.locale as Locale) : defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations('meta');
  const academyFirst = ACADEMY_FIRST.includes(locale);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema({ locale, description: t('homeDescription'), hasSearch: false })} />
      {/* pl: Alto Design Sp. z o.o. (Częstochowa) is the local entity, not the Belgian HQ. */}
      <JsonLd data={locale === 'pl' ? polishBusinessSchema() : localBusinessSchema()} />

      <Hero />
      {ESTIMATOR_HOME.includes(locale) && <HomeEstimator />}
      <Ticker />
      <Stats />
      {academyFirst && <InstallerPartner />}
      <WhyStretch />
      <Solutions />
      <Acoustics />
      <ApplicationAreas />
      {!academyFirst && <InstallerPartner />}
      <Gallery />
      <Reviews />
      <CtaBand />
    </>
  );
}
