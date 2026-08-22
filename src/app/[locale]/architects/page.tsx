// ARCHITECTS (/architects) — the marketing page that sells the architect area:
// everything needed to specify a stretch ceiling in one free account. Value
// blocks mirror the dashboard sections; case-study teasers show one measured
// metric each (full studies live inside the area); the signup CTA lands on
// /portal/login?signup=architect with Architect pre-selected.
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Euro,
  FileText,
  Layers,
  LineChart,
  ScrollText,
  UserRound,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import PortalLink from '@/components/ui/PortalLink';
import { isValidLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import { upcomingEvents } from '@/lib/events';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import { localeBase } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/architects', titleKey: 'architectsTitle', descKey: 'architectsDescription' });
}

const VALUE_ICONS = [FileText, ScrollText, Layers, Camera, LineChart, Euro, CalendarDays, UserRound];

export default async function ArchitectsPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = await getTranslations('architectsPage');
  const tp = await getTranslations('productPage');

  const events = upcomingEvents().slice(0, 3);
  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumb'), url: `${localeBase(locale)}/architects` },
  ]);

  const values = Array.from({ length: 8 }, (_, i) => ({
    Icon: VALUE_ICONS[i],
    title: t(`values.${i}.title`),
    body: t(`values.${i}.body`),
  }));
  const steps = Array.from({ length: 3 }, (_, i) => ({
    title: t(`steps.${i}.title`),
    body: t(`steps.${i}.body`),
  }));
  const cases = Array.from({ length: 2 }, (_, i) => ({
    title: t(`cases.${i}.title`),
    metric: t(`cases.${i}.metric`),
    metricLabel: t(`cases.${i}.metricLabel`),
  }));
  const faqs = Array.from({ length: 4 }, (_, i) => ({
    q: t(`faqs.${i}.q`),
    a: t(`faqs.${i}.a`),
  }));

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(26px,3.4vw,46px)' }}>
        <Eyebrow num="01" label={t('eyebrow')} />
        <h1 className="h1" style={{ margin: '0 0 clamp(18px,2vw,26px)', maxWidth: 900 }}>
          {t('titleA')} <span className="accent">{t('titleB')}.</span>
        </h1>
        <p className="lead" style={{ maxWidth: 620, margin: '0 0 26px' }}>{t('lead')}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <PortalLink href="/portal/login?signup=architect" className="btn btn--primary">
            {t('ctaCreate')} <ArrowRight size={15} />
          </PortalLink>
          <PortalLink href="/portal" className="btn btn--ghost">
            {t('ctaSignIn')}
          </PortalLink>
        </div>
      </section>

      {/* Value blocks */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="archp-grid">
          {values.map(({ Icon, title, body }) => (
            <div key={title} className="archp-card">
              <Icon size={20} strokeWidth={1.9} style={{ color: 'var(--red)' }} />
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--black)', color: '#fff', padding: 'clamp(40px,5vw,64px) 0' }}>
        <div className="container">
          <h2 className="h2 h2--sm" style={{ color: '#fff', margin: '0 0 26px' }}>{t('howTitle')}<span className="accent">.</span></h2>
          <div className="archp-steps">
            {steps.map((s, i) => (
              <div key={s.title} className="archp-step">
                <span className="archp-step__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case-study teasers + events */}
      <section className="container" style={{ padding: 'clamp(40px,5vw,64px) 0' }}>
        <div className="archp-split">
          <div>
            <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('casesTitle')}<span className="accent">.</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cases.map((c) => (
                <article key={c.title} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(18px,2.2vw,24px)' }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800 }}>{c.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px,3vw,34px)', color: 'var(--red)' }}>{c.metric}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{c.metricLabel}</span>
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: 12.5, color: 'var(--text-faint)' }}>{t('casesNote')}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('eventsTitle')}<span className="accent">.</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map((e) => (
                <div key={e.slug} style={{ border: '1px solid var(--border)', background: '#fff', padding: '14px 18px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint-2)', marginTop: 4, letterSpacing: '.03em' }}>
                    {e.dateLabel} · {e.location}
                  </div>
                </div>
              ))}
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{t('eventsNote')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('faqTitle')}<span className="accent">.</span></h2>
        <div style={{ maxWidth: 760 }}>
          {faqs.map((f) => (
            <details key={f.q} className="archp-faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Signup CTA */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,90px)' }}>
        <div style={{ background: 'var(--black)', color: '#fff', padding: 'clamp(28px,4vw,48px)', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 380px' }}>
            <h2 className="h2 h2--sm" style={{ color: '#fff', margin: '0 0 10px' }}>{t('ctaTitle')}<span className="accent">.</span></h2>
            <p style={{ margin: 0, color: 'var(--on-dark-muted)', fontSize: 14.5, lineHeight: 1.6, maxWidth: 560 }}>{t('ctaBody')}</p>
          </div>
          <PortalLink href="/portal/login?signup=architect" className="btn btn--primary">
            {t('ctaCreate')} <ArrowRight size={15} />
          </PortalLink>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .archp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .archp-card { background: #fff; border: 1px solid var(--border); padding: clamp(18px,2vw,24px); display: flex; flex-direction: column; gap: 10px; }
        .archp-card h2 { margin: 0; font-size: 14.5px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; }
        .archp-card p { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.55; }
        .archp-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .archp-step { border: 1px solid var(--line-dark); padding: clamp(18px,2.2vw,26px); }
        .archp-step__num { font-family: var(--font-display); font-weight: 900; font-size: 26px; color: var(--red); }
        .archp-step h3 { margin: 10px 0 8px; font-size: 15px; font-weight: 800; letter-spacing: .03em; text-transform: uppercase; }
        .archp-step p { margin: 0; font-size: 13.5px; color: var(--on-dark-muted); line-height: 1.6; }
        .archp-split { display: grid; grid-template-columns: 7fr 5fr; gap: clamp(24px,3.4vw,48px); align-items: start; }
        .archp-faq { border: 1px solid var(--border); background: #fff; margin-bottom: 10px; }
        .archp-faq summary { padding: 15px 18px; cursor: pointer; font-size: 14.5px; font-weight: 700; list-style: none; }
        .archp-faq summary::-webkit-details-marker { display: none; }
        .archp-faq p { margin: 0; padding: 0 18px 16px; font-size: 14px; color: var(--text-muted); line-height: 1.65; max-width: 640px; }
        @media (max-width: 980px) { .archp-grid { grid-template-columns: 1fr 1fr; } .archp-steps { grid-template-columns: 1fr; } .archp-split { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .archp-grid { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
