// Careers (/careers). The open positions of STRETCH Group — Stretch
// Productions BV in Beveren-Waas and Alto Design Sp. z o.o. in Częstochowa —
// on every locale, the visitor's own market first. Structure (slugs, places,
// dates, how to apply) comes from src/lib/careers.ts; every word from the
// careersPage messages. BreadcrumbList JSON-LD; each vacancy page carries
// its own JobPosting node.
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { contact } from '@/lib/site-config';
import { vacanciesFor, applyHref } from '@/lib/careers';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import { localeBase } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import ApplyMailLink from '@/components/ui/ApplyMailLink';
import VacancyCard, { type VacancyCardText } from '@/components/sections/VacancyCard';
import { pageImages } from '@/lib/page-images';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/careers', titleKey: 'careersTitle', descKey: 'careersDescription' });
}

export default async function CareersPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = await getTranslations('careersPage');
  const tp = await getTranslations('productPage');

  const open = vacanciesFor(locale);
  const facts = t.raw('facts') as string[];
  const cardLabels = {
    location: t('locationLabel'),
    contract: t('contractLabel'),
    employer: t('employerLabel'),
    view: t('viewVacancy'),
    mfx: t('mfx'),
  };

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumb'), url: `${localeBase(locale)}/careers` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(36px,4vw,56px)' }}>
        <div className="cr-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="01" label={t('eyebrow')} />
            <h1 className="h1" style={{ margin: '0 0 24px' }}>
              {t('titleA')}
              <br />
              {t('titleB')} <span className="accent">{t('titleC')}.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 520, margin: 0 }}>{t('lead')}</p>
          </div>
          <div>
            <Placeholder
              label="Workshop / team"
              src={pageImages.about}
              alt={t('heroImageAlt')}
              sizes="(max-width: 860px) 100vw, 45vw"
              ratio="4/3.2"
            />
          </div>
        </div>
      </section>

      {/* Four facts — the same four the vacancy documents carry */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,72px)' }}>
        <div className="cr-facts grid-lines" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {facts.map((f) => (
            <div key={f} style={{ background: '#fff', padding: 'clamp(18px,2.2vw,26px)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="tick" aria-hidden />
              <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Open positions */}
      <section className="section--surface" id="open-positions">
        <div className="container section--sm">
          <Eyebrow num="02" label={t('openEyebrow')} />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 14px', maxWidth: '22ch' }}>{t('openTitle')}</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 640, margin: '0 0 clamp(28px,3.5vw,44px)' }}>{t('openLead')}</p>
          {open.length === 0 ? (
            <p style={{ fontSize: 15.5, color: 'var(--text-muted)', margin: 0 }}>{t('noOpenings')}</p>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              {open.map((v) => (
                <VacancyCard key={v.slug} vacancy={v} text={t.raw(`jobs.${v.slug}`) as VacancyCardText} labels={cardLabels} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="container section">
        <div className="cr-about" style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
          <Eyebrow num="03" label={t('aboutEyebrow')} />
          <div className="prose" style={{ maxWidth: 680 }}>
            <h2 style={{ margin: '0 0 18px' }}>{t('about.title')}</h2>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>
        </div>
      </section>

      {/* Open application */}
      <section className="section--dark">
        <div className="container section--sm cr-open" style={{ display: 'grid', gridTemplateColumns: '1.3fr auto', gap: 'clamp(24px,4vw,56px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="04" label={t('spontaneous.eyebrow')} tone="dark" />
            <h2 className="h2 h2--sm" style={{ color: '#fff', margin: '0 0 14px', maxWidth: '20ch' }}>{t('spontaneous.title')}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--on-dark-soft)', maxWidth: 620, margin: 0 }}>{t('spontaneous.body')}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            <ApplyMailLink href={applyHref(contact.email, t('spontaneous.subject'))} location="careers_open_application" className="btn btn--primary btn--lg">
              {t('spontaneous.button')} <ArrowUpRight size={16} />
            </ApplyMailLink>
            <a href={`mailto:${contact.email}`} className="lnk" style={{ fontSize: 14, color: 'var(--on-dark-soft)' }}>{contact.email}</a>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 1100px) {
          .vc-card { grid-template-columns: 1.4fr 1fr 1fr !important; }
          .vc-btn { grid-column: 1 / -1; justify-self: start !important; }
        }
        @media (max-width: 860px) {
          .cr-hero { grid-template-columns: 1fr !important; }
          .cr-facts { grid-template-columns: 1fr 1fr !important; }
          .cr-about { grid-template-columns: 1fr !important; }
          .cr-open { grid-template-columns: 1fr !important; }
          .vc-card { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) { .cr-facts { grid-template-columns: 1fr !important; } }
      `,
        }}
      />
    </>
  );
}
