// Partners / reseller page (/partners). Hero with dual CTA, the why-partner
// six-cell grid, a three-step how-it-works, and the embedded application form
// (red section, → /api/lead as a partner lead). BreadcrumbList JSON-LD.
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, TrendingUp, Users, Package, MapPin, GraduationCap, Megaphone } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import InlineLeadForm from '@/components/sections/InlineLeadForm';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/partners', titleKey: 'partnersTitle', descKey: 'partnersDescription' });
}

const WHY = [
  { icon: TrendingUp, title: 'Strong margins', body: 'Trade pricing on made-to-measure membranes and profiles, with healthy margins on a premium, in-demand product.' },
  { icon: Users, title: 'Referred leads', body: 'We pass local customer enquiries to certified partners in their region — real projects, not just a price list.' },
  { icon: Package, title: 'B2B ordering', body: 'Order confectioned-to-size from our Belgian workshop through a dedicated partner portal, with reliable lead times.' },
  { icon: MapPin, title: 'Made in Belgium', body: 'Hand-made membranes engineered in Belgium, backed by a 25-year warranty you can stand behind.' },
  { icon: GraduationCap, title: 'Hands-on training', body: 'Certify your team at our HQ in days — confection, profiles, cold & heat mounting, light and acoustics.' },
  { icon: Megaphone, title: 'Marketing support', body: 'Product imagery, samples and sales material to help you win and close stretch-ceiling work.' },
];

const STEPS = [
  { n: '01', title: 'Apply & qualify', body: 'Send a short application. We review every one personally and set up a call to understand your business.' },
  { n: '02', title: 'Train & onboard', body: 'Get certified at our HQ and set up on the B2B portal — onboarding within weeks, exclusive territory where available.' },
  { n: '03', title: 'Order made-to-measure', body: 'Order confectioned-to-size, fit in a day, and receive referred local leads as they come in.' },
];

export default function PartnersPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'Partners', url: `${siteUrl}/${locale}/partners` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(40px,5vw,72px)' }}>
        <div className="pt-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="01" label="For the trade" />
            <h1 className="h1" style={{ margin: '0 0 24px' }}>
              Become a
              <br />
              <span className="accent">reseller.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 460, margin: '0 0 30px' }}>
              Add stretch ceilings to your offer with trade pricing, made-to-measure supply from our
              Belgian workshop, hands-on training and referred local leads.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <ModalButton type="partner" source="partners_hero" className="btn btn--primary">
                Apply to become a partner <ArrowRight size={16} />
              </ModalButton>
              <ModalButton type="call" source="partners_hero" className="btn btn--ghost">
                Book a call <ArrowRight size={16} className="btn__arrow" />
              </ModalButton>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Placeholder label="Installer / team photo" ratio="4/3.4" />
            <div style={{ position: 'absolute', right: -1, bottom: -1, background: 'var(--red)', color: '#fff', padding: '16px 22px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, lineHeight: 1 }}>50m²</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 5 }}>Fitted per team / day</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="section--dark">
        <div className="container section">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(40px,5vw,64px)' }}>
            <div>
              <Eyebrow num="02" label="Why partner with us" tone="dark" />
              <h2 className="h2">More margin,<br /><span className="accent">less hassle.</span></h2>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--on-dark-muted-2)', maxWidth: 360, margin: 0 }}>
              We handle the product, the training and the supply chain — you deliver a premium ceiling
              your customers love.
            </p>
          </div>
          <div className="pt-why grid-lines grid-lines--dark" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {WHY.map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ background: 'var(--black)', padding: 'clamp(26px,3vw,40px)' }}>
                <span style={{ color: 'var(--red)', display: 'inline-flex', marginBottom: 18 }}><Icon size={26} /></span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, letterSpacing: '-.01em', margin: '0 0 11px' }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--on-dark-muted)', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container section">
        <Eyebrow num="03" label="How it works" />
        <h2 className="h2 h2--sm" style={{ margin: '0 0 clamp(36px,4vw,52px)', maxWidth: '20ch' }}>
          Add ceilings to your offer and do more with fewer people.
        </h2>
        <div className="pt-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ border: '1px solid var(--border)', padding: 'clamp(26px,3vw,38px)', background: '#fff' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, color: 'var(--red)', letterSpacing: '-.03em', lineHeight: 1 }}>{s.n}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, letterSpacing: '-.01em', margin: '18px 0 11px' }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="section--red">
        <div className="container section">
          <div className="pt-apply" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="04" label="Become a partner" tone="dark" />
              <h2 className="h2" style={{ color: '#fff', margin: '0 0 18px' }}>Apply<br /><span style={{ color: 'var(--black)' }}>today.</span></h2>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['We review every application personally', 'Exclusive territory where available', 'Onboarding within weeks'].map((p) => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#fff', fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, background: '#fff', flexShrink: 0 }} />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', padding: 'clamp(26px,3vw,40px)', border: '1px solid var(--border)' }}>
              <InlineLeadForm type="partner" source="partners_apply" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .pt-hero { grid-template-columns: 1fr !important; }
          .pt-why { grid-template-columns: 1fr 1fr !important; }
          .pt-steps { grid-template-columns: 1fr !important; }
          .pt-apply { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .pt-why { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
