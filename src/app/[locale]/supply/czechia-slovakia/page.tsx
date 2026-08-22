// /supply/czechia-slovakia — targeted CEE supply page. We produce in Poland,
// so Czechia and Slovakia are next-door freight; this page invites wholesale
// and installer partners there. It is a SALES TOOL for direct outreach (the
// en/de/pl versions get sent to prospects), not an SEO play: there is NO
// Czech or Slovak locale and we are not adding one — ranking in Czech would
// need real cs content, which is out of scope. It still ships in every
// locale with normal metadata/hreflang so shared links resolve cleanly.
//
// Facts discipline: only products/groups that exist in materials.ts are
// named (fabric range with translucent/acoustic premium tiers, profiles,
// confection). NO prices appear. This is the ONE page that offers PLN
// settlement alongside EUR (policy: EUR everywhere, PLN for Poland — CZ/SK
// partners may invoice via the Polish production entity).
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, ArrowUpRight, Check, Truck } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, serviceSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import { ModalButton } from '@/components/ui/ModalButton';
import { Link } from '@/i18n/navigation';
import { localeBase } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/supply/czechia-slovakia', titleKey: 'supplyCzSkTitle', descKey: 'supplyCzSkDescription' });
}

export default async function SupplyCzSkPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = await getTranslations('supplyCzSkPage');
  const ts = await getTranslations('supplyPage');
  const tp = await getTranslations('productPage');

  const whyPoints = t.raw('why.points') as string[];
  const partnerPoints = t.raw('partner.points') as string[];

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: ts('crumb'), url: `${localeBase(locale)}/supply` },
    { name: t('crumb'), url: `${localeBase(locale)}/supply/czechia-slovakia` },
  ]);
  const service = serviceSchema({
    name: t('serviceName'),
    description: t('serviceDescription'),
    url: `${localeBase(locale)}/supply/czechia-slovakia`,
  });

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={service} />

      {/* HERO */}
      <section className="container section">
        <div style={{ maxWidth: 880 }}>
          <Eyebrow num="01" label={t('eyebrow')} />
          <h1 className="h1" style={{ margin: '0 0 22px', fontSize: 'clamp(26px, 5.6vw, 84px)' }}>
            {t('titleA')}
            <br />
            <span className="accent">{t('titleB')}</span>
          </h1>
          <p className="lead" style={{ maxWidth: '56ch', margin: '0 0 14px' }}>{t('lead')}</p>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 14.5, margin: '0 0 28px' }}>
            <Truck size={17} style={{ color: 'var(--red)' }} /> {t('freight')}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <ModalButton type="supply_inquiry" source="supply_cz_sk" className="btn btn--primary">
              {t('ctaInquiry')} <ArrowUpRight size={15} />
            </ModalButton>
            <Link href="/portal/login?signup=installer" className="btn btn--ghost">
              {ts('ctaPortal')}
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US vs COMMODITY SUPPLY */}
      <section className="section--surface">
        <div className="container section--sm">
          <div style={{ marginBottom: 'clamp(18px,2.4vw,28px)' }}>
            <Eyebrow num="02" label={t('why.eyebrow')} />
            <h2 className="h2 h2--sm" style={{ margin: 0 }}>{t('why.title')}</h2>
          </div>
          <p style={{ maxWidth: '62ch', color: 'var(--text-body)', lineHeight: 1.65, margin: '0 0 22px' }}>{t('why.body')}</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {whyPoints.map((p) => (
              <li key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, lineHeight: 1.55, background: '#fff', border: '1px solid var(--border)', padding: '16px 18px' }}>
                <Check size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 3 }} />
                {p}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-faint)', margin: '18px 0 0' }}>
            {/* The ONE page offering PLN settlement alongside EUR. */}
            {t('currencyLine')}
          </p>
        </div>
      </section>

      {/* WHOLESALE PARTNER INVITATION */}
      <section className="section--dark">
        <div className="container section--sm">
          <Eyebrow num="03" label={t('partner.eyebrow')} tone="dark" />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 16px' }}>{t('partner.title')}</h2>
          <p style={{ maxWidth: '62ch', color: 'var(--on-dark-soft)', lineHeight: 1.65, margin: '0 0 24px' }}>{t('partner.body')}</p>
          <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'flex', flexDirection: 'column', gap: 11, maxWidth: '68ch' }}>
            {partnerPoints.map((p) => (
              <li key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, color: 'var(--on-dark-soft)', lineHeight: 1.55 }}>
                <Check size={16} style={{ color: 'var(--red-bright)', flexShrink: 0, marginTop: 3 }} />
                {p}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <ModalButton type="supply_inquiry" source="supply_cz_sk" className="btn btn--primary">
              {t('ctaInquiry')} <ArrowRight size={15} />
            </ModalButton>
            <Link href="/supply" className="btn btn--ghost-light">
              {t('backToSupply')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
