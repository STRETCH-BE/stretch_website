// Swiss price guide (/spanndecke-preis-schweiz) — de-CH ONLY. Indicative
// CHF/m² ranges for INSTALLED ceilings agreed with QuinLay AG: the one
// exception to "no public prices on the Swiss site" (pricesPublished() stays
// false for everything else). Copy and numbers live in
// src/lib/price-guide-ch.ts; until every range is filled the page is
// noindex, out of the sitemap and unlinked, with visible placeholders.
// Every other locale: no page at all (dynamicParams=false → 404) and a 308
// from redirects.mjs to that domain's own price article.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, Calculator, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { brand, swissPartner } from '@/lib/site-config';
import { buildAlternates, buildCanonical, buildOgLocales, apiBase, localeBase } from '@/lib/seo';
import { breadcrumbSchema, faqPageSchema } from '@/lib/structured-data';
import { priceGuideCh, priceGuideChReady, formatChf } from '@/lib/price-guide-ch';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import { ModalButton } from '@/components/ui/ModalButton';
import InlineLeadForm from '@/components/sections/InlineLeadForm';

const GUIDE_LOCALE: Locale = 'ch';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: GUIDE_LOCALE }];
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (params.locale !== GUIDE_LOCALE) return {};
  const route = priceGuideCh.route;
  const { ogLocale } = buildOgLocales(GUIDE_LOCALE, [GUIDE_LOCALE]);
  const ogImg = `${apiBase(GUIDE_LOCALE)}/api/og`;
  return {
    title: { absolute: priceGuideCh.meta.title },
    description: priceGuideCh.meta.description,
    // Placeholders are not a page Google should rank: index only once the
    // ranges are in (priceGuideChReady).
    robots: priceGuideChReady ? { index: true, follow: true } : { index: false, follow: true },
    alternates: buildAlternates(GUIDE_LOCALE, route, [GUIDE_LOCALE]),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title: priceGuideCh.h1,
      description: priceGuideCh.meta.description,
      url: buildCanonical(GUIDE_LOCALE, route),
      locale: ogLocale,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title: priceGuideCh.h1, description: priceGuideCh.meta.description, images: [ogImg] },
  };
}

function rangeLabel(low: number | null, high: number | null): string {
  if (typeof low === 'number' && typeof high === 'number') return `${formatChf(low)} – ${formatChf(high)}`;
  return 'CHF – / m²';
}

export default async function SwissPriceGuidePage({ params }: { params: { locale: string } }) {
  if (!isValidLocale(params.locale) || params.locale !== GUIDE_LOCALE) notFound();
  const locale = GUIDE_LOCALE;
  setRequestLocale(locale);
  const tp = await getTranslations('productPage');
  const g = priceGuideCh;

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: g.h1, url: buildCanonical(locale, g.route) },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={faqPageSchema(g.faqs)} />

      {/* HERO */}
      <section className="container section" style={{ paddingBottom: 'clamp(28px,3vw,44px)' }}>
        <Eyebrow num="01" label={g.eyebrow} />
        <h1 className="h1" style={{ fontSize: 'clamp(34px,5vw,68px)', margin: '0 0 clamp(14px,2vw,20px)', maxWidth: 900 }}>
          {g.h1.replace(/\?$/, '')}<span className="accent">?</span>
        </h1>
        <p className="lead" style={{ maxWidth: 720, margin: '0 0 18px' }}>{g.lead}</p>
        <p style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', maxWidth: 720, margin: 0 }}>
          <MapPin size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
          {g.partnerLine}
        </p>
      </section>

      {/* RANGES */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <h2 className="h2 h2--sm" style={{ margin: '0 0 16px' }}>{g.tableHeading}</h2>
        {!priceGuideChReady && (
          <p className="pg-pending" role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1.5px dashed var(--red)', background: '#fff', padding: '10px 14px', fontSize: 13.5, fontWeight: 700, margin: '0 0 16px' }}>
            <Calculator size={16} style={{ color: 'var(--red)' }} /> {g.pendingNotice}
          </p>
        )}
        <div className="pg-table" style={{ border: '1.5px solid var(--black)', background: '#fff' }}>
          <div className="pg-row pg-row--head" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: 18, padding: '12px 18px', borderBottom: '1.5px solid var(--black)', fontSize: 11.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            <span>{g.tableCols.finish}</span>
            <span />
            <span style={{ textAlign: 'right' }}>{g.tableCols.range}</span>
          </div>
          {g.finishes.map((f) => {
            const pending = typeof f.low !== 'number' || typeof f.high !== 'number';
            return (
              <div key={f.key} className="pg-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr', gap: 18, padding: '16px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>{f.name}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-muted)' }}>{f.blurb}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, whiteSpace: 'nowrap', color: pending ? 'var(--text-faint)' : 'var(--black)' }}>
                    {rangeLabel(f.low, f.high)}
                  </div>
                  {pending && <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--red)', marginTop: 2 }}>{g.pendingRange}</div>}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 760, margin: '14px 0 0' }}>{g.vatNote}</p>
      </section>

      {/* DRIVERS */}
      <section className="section--dark">
        <div className="container section">
          <Eyebrow num="02" label={g.driversHeading} tone="dark" />
          <h2 className="h2" style={{ margin: '0 0 clamp(24px,3vw,40px)' }}>{g.driversHeading}<span className="accent">.</span></h2>
          <div className="pg-drivers" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.12)' }}>
            {g.drivers.map((d, i) => (
              <div key={d.title} style={{ background: 'var(--black)', padding: 'clamp(20px,2.4vw,30px)' }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.12em', color: 'var(--red)', marginBottom: 10 }}>0{i + 1}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', margin: '0 0 8px', color: '#fff' }}>{d.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.75)', margin: 0 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERTE */}
      <section id="offerte" className="section--red">
        <div className="container section">
          <div className="pg-cta" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="03" label={g.eyebrow} tone="red" />
              <h2 className="h2" style={{ color: '#fff', margin: '0 0 18px' }}>{g.ctaHeading}<span style={{ color: 'var(--black)' }}>.</span></h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#fff', margin: '0 0 22px', maxWidth: 520 }}>{g.ctaBody}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <ModalButton type="quote" source={g.sources.quote} trackQuote className="btn btn--dark">
                  {g.ctaButton} <ArrowRight size={16} />
                </ModalButton>
                <Link href="/dealers/luzern" className="btn btn--ghost btn--on-red">
                  {g.ctaShowroom} <ArrowRight size={16} />
                </Link>
              </div>
              <p style={{ fontSize: 13, color: '#fff', margin: '22px 0 0', maxWidth: 520 }}>
                {swissPartner.name} · {swissPartner.street}, {swissPartner.postalCode} {swissPartner.city} ·{' '}
                <a href={swissPartner.phoneHref} style={{ color: '#fff', fontWeight: 700 }}>{swissPartner.phoneDisplay}</a>
              </p>
            </div>
            <div style={{ background: '#fff', padding: 'clamp(26px,3vw,40px)', border: '1px solid var(--border)' }}>
              <InlineLeadForm type="quote" source={g.sources.quote} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container section">
        <h2 className="h2 h2--sm" style={{ margin: '0 0 clamp(18px,2.4vw,28px)' }}>{g.faqHeading}<span className="accent">.</span></h2>
        <div className="pg-faq" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px,2vw,28px)' }}>
          {g.faqs.map((f) => (
            <div key={f.q} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(18px,2.2vw,26px)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-.01em', margin: '0 0 8px' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-body)', margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .btn--on-red { border-color: #fff; color: #fff; }
        .btn--on-red:hover { background: #fff; color: var(--black); }
        @media (max-width: 860px) {
          .pg-row { grid-template-columns: 1fr !important; gap: 6px !important; }
          .pg-row--head { display: none !important; }
          .pg-row > div:last-child { text-align: left !important; }
          .pg-drivers { grid-template-columns: 1fr !important; }
          .pg-cta { grid-template-columns: 1fr !important; }
          .pg-faq { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </>
  );
}
