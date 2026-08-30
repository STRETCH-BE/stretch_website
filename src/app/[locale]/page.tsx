// Homepage. Assembles the home sections in mockup order (light → dark → red
// rhythm) and emits Organization, WebSite and LocalBusiness JSON-LD. Metadata
// for "/" comes from the locale layout; this route relies on that default.
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';
import JsonLd from '@/components/seo/JsonLd';
import { organizationSchema, websiteSchema, localBusinessSchema, reviewsSchema } from '@/lib/structured-data';

import Hero from '@/components/sections/home/Hero';
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

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale: Locale = isValidLocale(params.locale) ? (params.locale as Locale) : defaultLocale;
  setRequestLocale(locale);
  const t = await getTranslations('meta');

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema({ locale, description: t('homeDescription'), hasSearch: false })} />
      <JsonLd data={localBusinessSchema()} />
      {(() => {
        // Review/AggregateRating markup only when this market displays
        // genuine reviews — null (no markup at all) otherwise.
        const reviewsLd = reviewsSchema(locale);
        return reviewsLd ? <JsonLd data={reviewsLd} /> : null;
      })()}

      <Hero />
      <Ticker />
      <Stats />
      <WhyStretch />
      <Solutions />
      <Acoustics />
      <ApplicationAreas />
      <InstallerPartner />
      <Gallery />
      <Reviews />
      <CtaBand />
    </>
  );
}
