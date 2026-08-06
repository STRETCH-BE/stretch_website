// MATERIALS — public catalogue overview (/materials). Quote-list, no checkout:
// each group page lists item families whose buttons open the quote modal
// pre-filled with the product name. See src/lib/materials.ts.
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight, MessageSquareQuote, PackageOpen, Reply } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import { localeBase } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { materialGroups } from '@/lib/materials';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({
    locale: params.locale,
    route: '/materials',
    titleKey: 'materialsTitle',
    descKey: 'materialsDescription',
  });
}

export default async function MaterialsPage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('materials');
  const tp = await getTranslations('productPage');

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('title'), url: `${localeBase(locale)}/materials` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(28px,4vw,52px) 0 clamp(30px,4vw,50px)' }}>
        <Eyebrow num="01" label={t('eyebrow')} />
        <h1 className="h1" style={{ fontSize: 'clamp(38px,6vw,92px)', margin: '0 0 clamp(16px,2vw,24px)' }}>
          {t('title')}<span className="accent">.</span>
        </h1>
        <p className="lead" style={{ maxWidth: 640, margin: 0 }}>{t('intro')}</p>
      </section>

      {/* How it works — 3 steps, no checkout */}
      <section className="container" style={{ paddingBottom: 'clamp(36px,4vw,60px)' }}>
        <div className="mt-how">
          {[
            { icon: <PackageOpen size={19} />, title: t('how1Title'), body: t('how1Body') },
            { icon: <MessageSquareQuote size={19} />, title: t('how2Title'), body: t('how2Body') },
            { icon: <Reply size={19} />, title: t('how3Title'), body: t('how3Body') },
          ].map((s, i) => (
            <div key={s.title} className="mt-how__step">
              <span className="mt-how__num">0{i + 1}</span>
              <span style={{ color: 'var(--red)' }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 5 }}>{s.title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-muted)' }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Group cards */}
      <section className="container" style={{ paddingBottom: 'clamp(44px,5vw,72px)' }}>
        <div className="mt-grid">
          {materialGroups.map((g) => (
            <Link key={g.slug} href={`/materials/${g.slug}`} className="mt-card zoom-wrap">
              <div style={{ overflow: 'hidden' }}>
                <Placeholder label={g.name} src={g.items.find((i) => i.image)?.image ?? ''} alt={g.name} sizes="(max-width: 860px) 100vw, 33vw" light ratio="16/10" className="zoom-img" />
              </div>
              <div style={{ padding: '20px 22px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', margin: '0 0 7px', textTransform: 'uppercase' }}>{g.name}</h2>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: '0 0 12px' }}>{g.intro}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--red)' }}>
                  {t('browse', { count: g.items.length })} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dealer band */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,90px)' }}>
        <div style={{ background: 'var(--black)', padding: 'clamp(28px,4vw,48px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h2 className="h2 h2--sm" style={{ color: '#fff', fontSize: 'clamp(22px,2.6vw,32px)', margin: '0 0 8px' }}>{t('dealerTitle')}</h2>
            <p style={{ color: 'var(--on-dark-muted)', fontSize: 14.5, lineHeight: 1.55, margin: 0, maxWidth: 520 }}>{t('dealerBody')}</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/portal" className="btn btn--primary">{t('dealerCta')} <ArrowRight size={16} /></Link>
            <Link href="/partners" className="btn" style={{ background: '#fff', color: 'var(--black)' }}>{t('partnerCta')}</Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .mt-how { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .mt-how__step { display: flex; gap: 14px; align-items: flex-start; border: 1px solid var(--border); background: var(--surface); padding: clamp(18px,2vw,24px); position: relative; }
        .mt-how__num { position: absolute; top: 12px; right: 16px; font-size: 11px; font-weight: 800; letter-spacing: .14em; color: var(--text-faint); }
        .mt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .mt-card { display: block; border: 1px solid var(--border); background: #fff; text-decoration: none; color: inherit; overflow: hidden; }
        .mt-card:hover { border-color: var(--black); }
        @media (max-width: 900px) { .mt-how, .mt-grid { grid-template-columns: 1fr; } }
        @media (min-width: 901px) and (max-width: 1100px) { .mt-grid { grid-template-columns: 1fr 1fr; } }
      ` }} />
    </>
  );
}
