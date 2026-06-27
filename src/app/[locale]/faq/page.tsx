// FAQ page (/faq). Renders the global FAQ as an accessible native <details>
// accordion and emits FAQPage + BreadcrumbList JSON-LD. Content is drafted and
// flagged in CHANGES.md.
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, faqPageSchema } from '@/lib/structured-data';
import { globalFaqs } from '@/lib/content';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import { ModalButton } from '@/components/ui/ModalButton';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/faq', titleKey: 'faqTitle', descKey: 'faqDescription' });
}

export default function FaqPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'FAQ', url: `${siteUrl}/${locale}/faq` },
  ]);

  return (
    <>
      <JsonLd data={faqPageSchema(globalFaqs)} />
      <JsonLd data={crumbs} />

      <section className="container section">
        <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>
          <div>
            <Eyebrow num="01" label="FAQ" />
            <h1 className="h1" style={{ margin: '0 0 20px' }}>
              Good
              <br />
              <span className="accent">questions.</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6, maxWidth: 360, margin: '0 0 26px' }}>
              Everything people usually ask about stretch ceilings — installation, lifespan,
              acoustics, spans and cost. Still unsure? Just ask.
            </p>
            <ModalButton type="quote" source="faq_aside" trackQuote className="btn btn--primary">
              Request a free quote <ArrowRight size={16} />
            </ModalButton>
          </div>

          <div>
            {globalFaqs.map((f, i) => (
              <details key={f.q} className="faq-item" {...(i === 0 ? { open: true } : {})}>
                <summary className="faq-q">
                  <span>{f.q}</span>
                  <span className="faq-ic" aria-hidden />
                </summary>
                <p className="faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-item:first-child { border-top: 1px solid var(--border); }
        .faq-q {
          list-style: none; cursor: pointer; display: flex; align-items: center;
          justify-content: space-between; gap: 20px; padding: 22px 4px;
          font-family: var(--font-display); font-weight: 700; font-size: clamp(16px,1.7vw,19px);
          letter-spacing: -.01em; color: var(--black);
        }
        .faq-q::-webkit-details-marker { display: none; }
        .faq-ic { position: relative; width: 16px; height: 16px; flex-shrink: 0; }
        .faq-ic::before, .faq-ic::after {
          content: ''; position: absolute; background: var(--red); transition: transform .2s ease;
        }
        .faq-ic::before { left: 0; top: 7px; width: 16px; height: 2px; }
        .faq-ic::after { left: 7px; top: 0; width: 2px; height: 16px; }
        .faq-item[open] .faq-ic::after { transform: scaleY(0); }
        .faq-a {
          margin: 0; padding: 0 40px 24px 4px; font-size: 15.5px; line-height: 1.7;
          color: var(--text-muted);
        }
        @media (max-width: 860px) { .faq-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
