// /kit — the DIY polyester stretch-ceiling kit page (UK-forward, ships in
// every locale). Faithful to the catalog: contents mirror the materials.ts
// kit item (polyester cold-install — fabric to measure, profiles, corner
// pieces, instructions; standard/acoustic/translucent). Price policy: the
// public retail price lives in src/lib/currency.ts (KIT_RETAIL_PRICE_EUR);
// while it is null the page runs price-on-request and NO price appears.
// No Product JSON-LD without a price (a price-less offer is a Search
// Console error — see indicative-prices.ts) — Breadcrumb + FAQPage only.
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Check, ArrowUpRight } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, faqPageSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import PriceIndication from '@/components/ui/PriceIndication';
import { ModalButton } from '@/components/ui/ModalButton';
import { Link } from '@/i18n/navigation';
import { localeBase } from '@/lib/seo';
import { KIT_RETAIL_PRICE_EUR, asOf } from '@/lib/currency';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/kit', titleKey: 'kitTitle', descKey: 'kitDescription' });
}

export default async function KitPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = await getTranslations('kitPage');
  const tp = await getTranslations('productPage');

  const boxItems = t.raw('boxItems') as string[];
  const deliveryPoints = t.raw('deliveryPoints') as string[];
  const faqs = (t.raw('faq') as { q: string; a: string }[]) ?? [];

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumb'), url: `${localeBase(locale)}/kit` },
  ]);

  const sectionHead = (num: string, label: string, title: string) => (
    <div style={{ marginBottom: 'clamp(18px,2.4vw,28px)' }}>
      <Eyebrow num={num} label={label} />
      <h2 className="h2--sm h2" style={{ margin: 0 }}>{title}</h2>
    </div>
  );

  return (
    <>
      <JsonLd data={crumbs} />
      {faqs.length > 0 && <JsonLd data={faqPageSchema(faqs)} />}

      {/* HERO */}
      <section className="container section">
        <div className="kit-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="01" label={t('eyebrow')} />
            <h1 className="h1" style={{ margin: '0 0 22px' }}>
              {t('titleA')}
              <br />
              <span className="accent">{t('titleB')}</span>
            </h1>
            <p className="lead" style={{ maxWidth: '52ch', margin: '0 0 28px' }}>{t('intro')}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <ModalButton type="kit_order" source="kit_order" className="btn btn--primary">
                {t('ctaOrder')} <ArrowUpRight size={15} />
              </ModalButton>
              <Link href="/materials/fabrics" className="btn btn--ghost">
                {t('ctaMaterials')}
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative', minHeight: 380 }}>
            <Placeholder label="STRETCH DIY kit" src="/images/materials/polyester-diy-kit.jpg" alt={t('heroAlt')} sizes="(max-width: 900px) 100vw, 46vw" />
          </div>
        </div>
      </section>

      {/* WHAT'S IN THE BOX */}
      <section className="section--surface">
        <div className="container section--sm">
          {sectionHead('02', t('boxEyebrow'), t('boxTitle'))}
          <div className="kit-box-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {boxItems.map((item) => (
              <div key={item} style={{ background: '#fff', padding: '20px 22px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Check size={17} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14.5, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '16px 0 0', maxWidth: '68ch' }}>{t('sizeBody')}</p>
        </div>
      </section>

      {/* HOW-TO */}
      <section className="container section--sm">
        {sectionHead('03', t('howEyebrow'), t('howTitle'))}
        <p style={{ maxWidth: '62ch', color: 'var(--text-body)', margin: '0 0 20px' }}>{t('howBody')}</p>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <Link href="/blog/spanplafond-zelf-plaatsen" className="lnk" style={{ fontWeight: 700 }}>
            {t('howBlog')} →
          </Link>
          <Link href="/installer-training" className="lnk" style={{ fontWeight: 700 }}>
            {t('howTraining')} →
          </Link>
        </div>
      </section>

      {/* PRICE + ORDER */}
      <section className="section--dark">
        <div className="container section--sm">
          <Eyebrow num="04" label={t('priceEyebrow')} tone="dark" />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('priceTitle')}</h2>
          {KIT_RETAIL_PRICE_EUR !== null ? (
            <div style={{ margin: '0 0 14px' }}>
              <PriceIndication eur={KIT_RETAIL_PRICE_EUR} />
            </div>
          ) : (
            <p style={{ fontSize: 17, fontWeight: 700, margin: '0 0 14px', maxWidth: '56ch' }}>{t('priceOnRequest')}</p>
          )}
          <p style={{ fontSize: 13.5, color: 'var(--on-dark-muted)', maxWidth: '68ch', margin: '0 0 26px' }}>
            {t('currencyNotice', { asOf })}
          </p>
          <ModalButton type="kit_order" source="kit_order" className="btn btn--primary">
            {t('ctaOrder')} <ArrowUpRight size={15} />
          </ModalButton>
          <ul style={{ listStyle: 'none', margin: '30px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '68ch' }}>
            {deliveryPoints.map((p) => (
              <li key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, color: 'var(--on-dark-soft)' }}>
                <Check size={16} style={{ color: 'var(--red-bright)', flexShrink: 0, marginTop: 3 }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="container section--sm">
        {sectionHead('05', t('faqEyebrow'), t('faqTitle'))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 820 }}>
          {faqs.map((f) => (
            <details key={f.q} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 15.5 }}>{f.q}</summary>
              <p style={{ margin: '10px 0 0', color: 'var(--text-body)', maxWidth: '68ch', lineHeight: 1.6 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .kit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
