// /price-calculator — the public estimate step for the calculator/kosten-
// rechner/kalkulator query families (ranking audit §2.2/§2.4/§2.5: the old
// sites' calculator pages carried thousands of impressions and had no
// new-site target). It multiplies m² by the PUBLISHED per-type buckets from
// the price guide — indicative only, quote CTA for the firm number. No trade
// pricing anywhere near this page.
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import PriceEstimator from '@/components/sections/PriceEstimator';
import { localeBase } from '@/lib/seo';
import { blogPath } from '@/lib/blog-slugs';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { pricesPublished } from '@/lib/currency';

// Locales that publish indicative prices — the page does not exist elsewhere
// (Switzerland: no product prices on the public site, QuinLay AG 2 Sep 2026).
const PRICE_MARKETS = locales.filter(pricesPublished);

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/price-calculator', titleKey: 'priceCalculatorTitle', descKey: 'priceCalculatorDescription', only: PRICE_MARKETS });
}

export default async function PriceCalculatorPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  if (!pricesPublished(locale)) notFound();
  const t = await getTranslations('priceCalculatorPage');
  const tp = await getTranslations('productPage');

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumb'), url: `${localeBase(locale)}/price-calculator` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <section className="container section">
        <div style={{ maxWidth: 880 }}>
          <Eyebrow num="01" label={t('eyebrow')} />
          <h1 className="h1" style={{ margin: '0 0 22px', fontSize: 'clamp(26px, 5.6vw, 84px)' }}>
            {t('titleA')}
            <br />
            <span className="accent">{t('titleB')}</span>
          </h1>
          <p className="lead" style={{ maxWidth: '56ch', margin: '0 0 30px' }}>{t('lead')}</p>
        </div>
        <PriceEstimator guideHref={blogPath('spanplafond-prijs', locale)} />
      </section>
    </>
  );
}
