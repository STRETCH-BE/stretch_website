// Installer training page (/installer-training). Hero + format band, the
// six-cell curriculum, upcoming-date cards, and the booking form (→ /api/lead).
// BreadcrumbList + a Course JSON-LD describing the programme.
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Check } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, brand } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import { TRAINING_DATE_DETAIL } from '@/lib/forms-config';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { pageImages } from '@/lib/page-images';
import { ModalButton } from '@/components/ui/ModalButton';
import InlineLeadForm from '@/components/sections/InlineLeadForm';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/installer-training', titleKey: 'trainingTitle', descKey: 'trainingDescription' });
}

const FORMAT = [
  { value: '2–3', label: 'Days, hands-on' },
  { value: 'HQ', label: 'Beveren-Waas, Belgium' },
  { value: '1:4', label: 'Trainer to installer' },
];

const CURRICULUM = [
  { n: '01', title: 'Membrane & confection', body: 'How polyester and PVC membranes are measured, cut and welded to size in the workshop.' },
  { n: '02', title: 'Perimeter profiles', body: 'Setting out and fixing clip profiles dead level — the foundation of a flawless ceiling.' },
  { n: '03', title: 'Cold & heat mounting', body: 'Tensioning both systems correctly: cold polyester and warmed PVC film, start to finish.' },
  { n: '04', title: 'Light & acoustics', body: 'Integrating backlighting, LED lines, printed films and acoustic absorber backing.' },
  { n: '05', title: 'Finishing & access', body: 'Clean perimeter detailing, cut-outs for fittings, and discreet inspection hatches.' },
  { n: '06', title: 'Estimating & sales', body: 'Measuring a job, quoting with confidence and positioning stretch ceilings to clients.' },
];

export default function TrainingPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'Installer training', url: `${siteUrl}/${locale}/installer-training` },
  ]);
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'STRETCH installer certification',
    description:
      'Hands-on stretch-ceiling installer certification at the STRETCH HQ in Belgium: membrane confection, profiles, cold & heat mounting, light, acoustics, finishing and estimating.',
    provider: { '@type': 'Organization', name: brand.name, sameAs: siteUrl },
    url: `${siteUrl}/${locale}/installer-training`,
  };

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={course} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(40px,5vw,72px)' }}>
        <div className="tr-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="01" label="Installer training" />
            <h1 className="h1" style={{ margin: '0 0 24px' }}>
              Fit like a pro
              <br />
              in <span className="accent">days.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 460, margin: '0 0 30px' }}>
              Hands-on certification at our Belgian HQ. Learn membrane confection, profiles, cold &amp;
              heat mounting, light and acoustics — no prior experience needed.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <ModalButton type="training" source="training_hero" className="btn btn--primary">
                Book your training <ArrowRight size={16} />
              </ModalButton>
              <a href="#dates" className="btn btn--ghost">See dates <ArrowRight size={16} className="btn__arrow" /></a>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Placeholder
            label="Training / workshop photo"
            src={pageImages.training}
            alt="STRETCH installer training in the workshop"
            sizes="(max-width: 860px) 100vw, 45vw"
            ratio="4/3.4"
          />
          </div>
        </div>

        {/* Format band */}
        <div className="tr-format" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginTop: 'clamp(28px,3vw,44px)' }}>
          {FORMAT.map((f) => (
            <div key={f.label} style={{ background: '#fff', padding: '26px 24px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(30px,3.4vw,46px)', lineHeight: 1, letterSpacing: '-.03em' }}>{f.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted-2)', marginTop: 10 }}>{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section className="section--dark">
        <div className="container section">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(40px,5vw,64px)' }}>
            <div>
              <Eyebrow num="02" label="What you'll learn" tone="dark" />
              <h2 className="h2">The full craft<span className="accent">.</span></h2>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--on-dark-muted-2)', maxWidth: 360, margin: 0 }}>
              From a roll of membrane to a finished, lit, acoustic ceiling — and the commercial skills
              to sell it.
            </p>
          </div>
          <div className="tr-curric grid-lines grid-lines--dark" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {CURRICULUM.map((c) => (
              <div key={c.n} style={{ background: 'var(--black)', padding: 'clamp(26px,3vw,40px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--red)', fontSize: 14, letterSpacing: '.05em' }}>{c.n}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, letterSpacing: '-.01em', margin: '16px 0 11px' }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--on-dark-muted)', margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dates */}
      <section id="dates" className="container section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 'clamp(32px,3vw,48px)' }}>
          <div>
            <Eyebrow num="03" label="Upcoming dates" />
            <h2 className="h2 h2--sm">Reserve your seat<span className="accent">.</span></h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 320, margin: 0 }}>
            Small groups, booked first-come. Custom on-site sessions available on request.
          </p>
        </div>
        <div className="tr-dates" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {TRAINING_DATE_DETAIL.map((d) => (
            <div key={d.date} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(22px,2.4vw,28px)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', marginBottom: 8 }}>{d.date}</div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>{d.note}</div>
            </div>
          ))}
          <div style={{ border: '1px dashed var(--border-input)', background: 'var(--surface)', padding: 'clamp(22px,2.4vw,28px)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', marginBottom: 8 }}>On request</div>
            <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>Custom on-site session</div>
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="section--red">
        <div className="container section">
          <div className="tr-book" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="04" label="Plan your training" tone="dark" />
              <h2 className="h2" style={{ color: '#fff', margin: '0 0 22px' }}>Book a<br /><span style={{ color: 'var(--black)' }}>seat.</span></h2>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)', marginBottom: 14 }}>Included</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Certificate of completion', 'Installer starter kit', 'Lunch & materials on site'].map((p) => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#fff', fontWeight: 500 }}>
                    <Check size={18} /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', padding: 'clamp(26px,3vw,40px)', border: '1px solid var(--border)' }}>
              <InlineLeadForm type="training" source="training_book" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .tr-hero { grid-template-columns: 1fr !important; }
          .tr-curric { grid-template-columns: 1fr 1fr !important; }
          .tr-dates { grid-template-columns: 1fr 1fr !important; }
          .tr-book { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .tr-format { grid-template-columns: 1fr !important; }
          .tr-curric { grid-template-columns: 1fr !important; }
          .tr-dates { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
