// DEALERS — directory overview (/dealers). Eight regions (Flanders & Brussels,
// Wallonia, Netherlands, Luxembourg, Austria, Germany, Poland, France) with
// province + city links, the visitor's home regions first; places without a
// dealer show the "dealer wanted" chip. Recruitment band at the bottom.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight, BadgeCheck, Search } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { brand } from '@/lib/site-config';
import { localeBase, buildAlternates } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import { ModalButton } from '@/components/ui/ModalButton';
import { dealerPlaces, placeDealers, dealerMarkets, isDealerMarket, regionsForLocale, regionLabelKeys } from '@/lib/dealers';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  // Market-restricted (N2): no dealer network on this locale → no page.
  if (!isDealerMarket(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'dealersPage' });
  const route = '/dealers';
  const ogImg = `${localeBase(locale)}/api/og`;
  return {
    title: { absolute: t('ovMetaTitle') },
    description: t('ovMetaDescription'),
    alternates: buildAlternates(locale, route, dealerMarkets),
    openGraph: {
      type: 'website', siteName: brand.name, title: t('ovMetaTitle'), description: t('ovMetaDescription'),
      url: `${localeBase(locale)}${route}`,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title: t('ovMetaTitle'), description: t('ovMetaDescription'), images: [ogImg] },
  };
}

export default async function DealersOverviewPage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);
  // Market-restricted (N2): the directory does not exist on locales without
  // a dealer network (currently `us`) — hard 404, mirroring BlogPost.markets.
  if (!isDealerMarket(locale)) notFound();
  const t = await getTranslations('dealersPage');
  const tp = await getTranslations('productPage');
  // Home regions first (Germany before Flanders on stretchdecken.de …).
  const regions = regionsForLocale(locale).map((key) => ({ key, labelKey: regionLabelKeys[key] }));

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumbDealers'), url: `${localeBase(locale)}/dealers` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(28px,4vw,52px) 0 clamp(28px,4vw,44px)' }}>
        <Eyebrow num="01" label={t('ovEyebrow')} />
        <h1 className="h1" style={{ fontSize: 'clamp(38px,6vw,92px)', margin: '0 0 clamp(16px,2vw,24px)' }}>
          {t('ovTitle')}<span className="accent">.</span>
        </h1>
        <p className="lead" style={{ maxWidth: 660, margin: 0 }}>{t('ovIntro')}</p>
      </section>

      {/* Regions */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        {regions.map((r) => {
          const provinces = dealerPlaces.filter((p) => p.region === r.key && p.kind === 'province');
          const cities = dealerPlaces.filter((p) => p.region === r.key && p.kind === 'city');
          return (
            <div key={r.key} style={{ marginBottom: 'clamp(28px,3.4vw,44px)' }}>
              <h2 className="h2 h2--sm" style={{ margin: '0 0 14px' }}>{t(r.labelKey)}</h2>
              <div className="dov-block">
                <div className="dov-row">
                  {provinces.map((p) => {
                    const has = placeDealers(p).length > 0;
                    return (
                      <Link key={p.slug} href={`/dealers/${p.slug}`} className="dov-card">
                        <span style={{ fontWeight: 800, fontSize: 14.5, letterSpacing: '-.01em' }}>{p.name}</span>
                        <span className={has ? 'dov-tag dov-tag--ok' : 'dov-tag'}>
                          {has ? (<><BadgeCheck size={12} /> {t('dealerBadgeShort')}</>) : (<><Search size={12} /> {t('lookingLabel')}</>)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                {cities.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                    {cities.map((c) => (
                      <Link key={c.slug} href={`/dealers/${c.slug}`} className="dov-chip">{c.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Recruitment band */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,90px)' }}>
        <div style={{ background: 'var(--black)', padding: 'clamp(28px,4vw,48px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h2 className="h2 h2--sm" style={{ color: '#fff', fontSize: 'clamp(22px,2.6vw,32px)', margin: '0 0 8px' }}>{t('ovRecruitTitle')}</h2>
            <p style={{ color: 'var(--on-dark-muted)', fontSize: 14.5, lineHeight: 1.55, margin: 0, maxWidth: 560 }}>{t('ovRecruitBody')}</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/partners" className="btn btn--primary">{t('recruitCta')} <ArrowRight size={16} /></Link>
            <ModalButton type="quote" source="dealers_overview" trackQuote className="btn" style={{ background: '#fff', color: 'var(--black)' }}>
              {t('quoteCta')}
            </ModalButton>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .dov-block { border: 1px solid var(--border); background: var(--surface); padding: clamp(16px,2vw,24px); }
        .dov-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .dov-card { display: flex; flex-direction: column; gap: 8px; background: #fff; border: 1px solid var(--border); padding: 14px 16px; text-decoration: none; color: inherit; }
        .dov-card:hover { border-color: var(--black); }
        .dov-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--text-faint); }
        .dov-tag--ok { color: var(--red); }
        .dov-chip { display: inline-flex; border: 1px solid var(--border-input); padding: 7px 12px; font-size: 12.5px; font-weight: 700; text-decoration: none; color: var(--text-muted); background: #fff; }
        .dov-chip:hover { border-color: var(--black); color: var(--black); }
        @media (max-width: 960px) { .dov-row { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .dov-row { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
