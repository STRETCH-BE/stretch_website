// Swiss price guide (/spanndecke-preis-schweiz) — de-CH ONLY. Indicative
// CHF/m² ranges for INSTALLED ceilings agreed with QuinLay AG: the one
// exception to "no public prices on the Swiss site" (pricesPublished() stays
// false for everything else). Copy and numbers live in
// src/lib/price-guide-ch.ts. Since the 1-month review (2 Oct 2026) the page
// ships indexed, in the sitemap and linked (hero, footer, Swiss place pages,
// FAQ) with its placeholders visible — "Richtwerte folgen" per row and
// "genaue Frist folgt" for the Offerte lead time — until Michael fills them.
// Every other locale: no page at all (dynamicParams=false → 404) and a 308
// from redirects.mjs to that domain's own price article.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, Calculator, MapPin, Ruler, Store, FileText } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { brand, swissPartner } from '@/lib/site-config';
import { buildAlternates, buildCanonical, buildOgLocales, apiBase, localeBase } from '@/lib/seo';
import { breadcrumbSchema, faqPageSchema } from '@/lib/structured-data';
import { priceGuideCh, priceGuideChReady, formatChf, offerteWithin } from '@/lib/price-guide-ch';
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
    // Indexed with the placeholders visible (review, 2 Oct 2026): the drivers,
    // the Offerte process and the FAQ are real content; the ranges follow.
    robots: { index: true, follow: true },
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

function rangeLabel(low: number | null, high: number | null): string | null {
  if (typeof low === 'number' && typeof high === 'number') return `${formatChf(low)} – ${formatChf(high)}`;
  return null; // placeholder row: "Richtwerte folgen", never a made-up figure
}

const STEP_ICONS = [Store, Ruler, FileText];

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
                  {pending ? (
                    <div data-pending="true" style={{ display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--red)', border: '1.5px dashed var(--red)', padding: '6px 10px', whiteSpace: 'nowrap' }}>
                      {g.pendingRange}
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, whiteSpace: 'nowrap', color: 'var(--black)' }}>
                      {rangeLabel(f.low, f.high)}
                    </div>
                  )}
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

      {/* OFFERTE — showroom → Aufmass → Offerte (lead time: offerteWithin) */}
      <section id="offerte" className="section--red">
        <div className="container section">
          <div className="pg-cta" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="03" label={g.eyebrow} tone="red" />
              <h2 className="h2" style={{ color: '#fff', margin: '0 0 18px' }}>{g.offerteHeading}<span style={{ color: 'var(--black)' }}>.</span></h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#fff', margin: '0 0 22px', maxWidth: 520 }}>{g.offerteLead}</p>
              <ol style={{ listStyle: 'none', margin: '0 0 26px', padding: 0, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
                {g.offerteSteps.map((st, i) => {
                  const Icon = STEP_ICONS[i] ?? FileText;
                  const last = i === g.offerteSteps.length - 1;
                  return (
                    <li key={st.title} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, alignItems: 'start' }}>
                      <span style={{ display: 'inline-flex', width: 40, height: 40, background: 'var(--black)', color: '#fff', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} />
                      </span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5, color: '#fff', marginBottom: 4 }}>
                          0{i + 1} · {st.title}
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#fff', margin: 0 }}>
                          {st.body}
                          {/* Lead time: QuinLay's number of working days, or the honest placeholder (offerteWithinDays TODO). */}
                          {last && <> <strong data-pending={priceGuideCh.offerteWithinDays === null ? 'true' : undefined}>{`Die Offerte erhalten Sie ${offerteWithin()}.`}</strong></>}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
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
