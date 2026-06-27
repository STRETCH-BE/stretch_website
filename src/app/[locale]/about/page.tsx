// About page (/about). Company story + the international office footprint.
// Body copy is DRAFTED from the brand brief and flagged in CHANGES.md for
// client review. BreadcrumbList + Organization JSON-LD.
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, brand, offices } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, organizationSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/about', titleKey: 'aboutTitle', descKey: 'aboutDescription' });
}

const VALUES = [
  { value: brand.founded, label: 'Founded', sub: 'Building seamless ceilings ever since.' },
  { value: '25yr', label: 'Warranty', sub: 'On our hand-made membranes.' },
  { value: '4', label: 'Offices', sub: 'Belgium, USA, Poland & Austria.' },
];

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'About', url: `${siteUrl}/${locale}/about` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={organizationSchema()} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(36px,4vw,56px)' }}>
        <div className="ab-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="01" label="About STRETCH" />
            <h1 className="h1" style={{ margin: '0 0 24px' }}>
              Hand made
              <br />
              in <span className="accent">Belgium.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 480, margin: 0 }}>
              {brand.name} designs and manufactures seamless stretch ceilings and walls — engineered
              in Belgium, fitted in a day, and built to last for decades.
            </p>
          </div>
          <div>
            <Placeholder label="Workshop / team" ratio="4/3.2" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,72px)' }}>
        <div className="ab-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
          {VALUES.map((v) => (
            <div key={v.label} style={{ background: '#fff', padding: 'clamp(26px,3vw,38px)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,3.6vw,50px)', lineHeight: 1, letterSpacing: '-.03em' }}>{v.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', margin: '12px 0 6px' }}>{v.label}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{v.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="section--surface">
        <div className="container section--sm">
          <div className="ab-story" style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <Eyebrow num="02" label="Our story" />
            <div className="prose" style={{ maxWidth: 680 }}>
              <p>
                {brand.name} was founded in {brand.founded} with a simple conviction: a ceiling should be
                a finish you notice for the right reasons. Traditional plaster ceilings crack, stain and
                take days of messy work to install and repaint. A tensioned membrane does not — it goes
                up clean, dead-flat and seamless, often in a single day.
              </p>
              <p>
                Everything starts in our Belgian workshop, where polyester and PVC membranes are
                measured, cut and welded to size by hand. That confection-to-measure approach is what
                lets a finished ceiling clip into place so quickly on site, with no dust and no repaint.
              </p>
              <p>
                Today we work primarily through a network of trade partners and certified installers,
                supplying made-to-measure systems, hands-on training and referred local leads. From
                recording studios to event halls, bathrooms to retail, our systems bring light, acoustic
                control and a flawless surface to spaces across Europe and beyond.
              </p>
              <p>
                We are a B2B-led business with offices in Belgium, the United States, Poland and Austria
                — but every membrane still carries the same promise: hand made in Belgium, backed by a
                25-year warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="container section">
        <Eyebrow num="03" label="Where we are" />
        <div className="ab-off" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
          {offices.map((o) => (
            <div key={o.country} style={{ background: '#fff', padding: 'clamp(22px,2.4vw,30px)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: 'var(--red)', marginBottom: 6 }}>{o.country}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-.01em', marginBottom: 12 }}>{o.countryName}</div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginBottom: 10 }}>{o.role}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                {o.addressLines.map((l) => <div key={l}>{l}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section--red">
        <div className="container section--sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <h2 className="h2 h2--sm" style={{ color: '#fff', margin: 0, maxWidth: '18ch' }}>Let&rsquo;s build something seamless.</h2>
          <ModalButton type="quote" source="about_cta" trackQuote className="btn btn--dark">
            Request a free quote <ArrowRight size={16} />
          </ModalButton>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .ab-hero { grid-template-columns: 1fr !important; }
          .ab-stats { grid-template-columns: 1fr !important; }
          .ab-story { grid-template-columns: 1fr !important; }
          .ab-off { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) { .ab-off { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
