// Installer training page (/installer-training). Hero + format band, the
// six-cell curriculum, upcoming-date cards, and the booking form (→ /api/lead).
// BreadcrumbList + a Course JSON-LD describing the programme, plus one Event
// per upcoming Beveren-Waas day. The days come from public.training_sessions
// (src/lib/training/, edited in /portal/admin): statically rendered, re-read
// hourly and at once after an admin save.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, ArrowUpRight, Check, MapPin } from 'lucide-react';
import { isValidLocale, type Locale, localeFullCodes } from '@/i18n/config';
import { siteUrl, brand, contact } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import { trainingSessionsFor } from '@/lib/forms-config';
import { TRAINING_DEFAULT_LOCATION } from '@/lib/training/config';
import { getTrainingView } from '@/lib/training/sessions';
import { dealerMarkets, isDealerMarket } from '@/lib/dealers';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { pageImages } from '@/lib/page-images';
import { ModalButton } from '@/components/ui/ModalButton';
import InlineLeadForm from '@/components/sections/InlineLeadForm';
import { localeBase } from '@/lib/seo';

// Hourly safety net for the training days (an admin save revalidates at once).
// Segment config must be a literal — keep equal to TRAINING_REVALIDATE_SECONDS.
export const revalidate = 3600;

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // `only` (N2): training exists on dealer markets only — no en-US alternate.
  return pageMetadata({ locale: params.locale, route: '/installer-training', titleKey: 'trainingTitle', descKey: 'trainingDescription', only: dealerMarkets });
}

export default async function TrainingPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  // Market-restricted (N2): no dealer/installer network on this locale → 404.
  if (!isDealerMarket(locale)) notFound();
  const t = await getTranslations('trainingPage');
  const tm = await getTranslations('modals');
  const tp = await getTranslations('productPage');

  const format = t.raw('format') as { value: string; label: string }[];
  const curriculum = t.raw('curriculum.items') as { title: string; body: string }[];
  const included = t.raw('book.included') as string[];

  // The training view, built once per render: the upcoming Beveren-Waas days
  // (public.training_sessions) with localized labels, the preferred-date
  // choices for both forms and the EN/DE/PL interest state. ch / fr-ch:
  // QuinLay AG runs the courses (per-locale override in forms-config, copy in
  // the config itself) — no DB days, no interest cards, no Events.
  const view = await getTrainingView(locale);
  const { sessions: partnerSessions, partnerRun } = trainingSessionsFor(locale);
  const fullLabel = tm('trainingSessions.full');

  const langBadges = (languages: string[]) => (
    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
      {languages.map((l) => (
        <span key={l} style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', background: 'var(--surface)', border: '1px solid var(--border)', padding: '3px 8px', color: 'var(--text-muted)' }}>
          {l}
        </span>
      ))}
    </div>
  );

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumb'), url: `${localeBase(locale)}/installer-training` },
  ]);
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: t('courseName'),
    description: t('courseDescription'),
    provider: { '@type': 'Organization', name: brand.name, sameAs: siteUrl },
    url: `${localeBase(locale)}/installer-training`,
  };
  // One Event per visible day (open and full) — interest cards carry no Event.
  // No offers node — training pricing is not published (open decision per market).
  const trainingLocation = {
    '@type': 'Place',
    name: `${brand.name} HQ`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      postalCode: contact.address.postalCode,
      addressLocality: contact.address.city,
      addressCountry: contact.address.country,
    },
  };
  const sessionEvents = view.sessions.map((s) => ({
    id: s.id,
    data: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `${t('courseName')} — ${s.systemLabel}`,
      startDate: s.startsOn,
      endDate: s.endsOn ?? s.startsOn,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: s.location === TRAINING_DEFAULT_LOCATION ? trainingLocation : { '@type': 'Place', name: s.location },
      inLanguage: s.languages.map((l) => l.toLowerCase()),
      organizer: { '@type': 'Organization', name: brand.name, url: siteUrl },
      url: `${localeBase(locale)}/installer-training#dates`,
    },
  }));

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={course} />
      {sessionEvents.map((e) => (
        <JsonLd key={e.id} data={e.data} />
      ))}

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(40px,5vw,72px)' }}>
        {/* minmax(0, …) columns: the headline's longest word must never set the
            text column's minimum width and squeeze the photo (it collapsed to
            ~230px with the global 142px h1 on stretch.mt). The h1 is sized for
            this page's long words (nl "gecertificeerd", sv "spänntaksmontering")
            with hyphenation as the fallback. */}
        <div className="tr-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, .9fr)', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <div style={{ minWidth: 0 }}>
            <Eyebrow num="01" label={t('hero.eyebrow')} />
            <h1 className="h1" lang={localeFullCodes[locale]} style={{ margin: '0 0 24px', fontSize: 'clamp(32px, 4.5vw, 62px)', hyphens: 'auto', overflowWrap: 'anywhere' }}>
              {t('hero.titleA')}
              <br />
              {t('hero.titleB')} <span className="accent">{t('hero.titleC')}.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 460, margin: '0 0 18px' }}>
              {t('hero.lead')}
            </p>
            {/* Location + travel line, localized per market (§3 goal B) */}
            <p style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', maxWidth: 460, margin: '0 0 28px' }}>
              <MapPin size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
              {t('hero.travel')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <ModalButton type="training" source="training_hero" trainingView={view} className="btn btn--primary">
                {t('hero.ctaBook')} <ArrowRight size={16} />
              </ModalButton>
              <a href="#dates" className="btn btn--ghost">{t('hero.ctaDates')} <ArrowRight size={16} className="btn__arrow" /></a>
            </div>
          </div>
          <div style={{ position: 'relative', minWidth: 0 }}>
            {/* The training photo is portrait (1536×2048): a 4/5 slot shows it
                almost uncropped beside the tall headline; 4/3 on mobile. */}
            <Placeholder label={t('hero.imageLabel')} src={pageImages.training} sizes="(max-width: 860px) 100vw, 45vw" priority ratio="4/5" className="tr-hero-img" />
          </div>
        </div>

        {/* Format band */}
        <div className="tr-format" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginTop: 'clamp(28px,3vw,44px)' }}>
          {format.map((f) => (
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
              <Eyebrow num="02" label={t('curriculum.eyebrow')} tone="dark" />
              <h2 className="h2">{t('curriculum.title')}<span className="accent">.</span></h2>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--on-dark-muted-2)', maxWidth: 360, margin: 0 }}>
              {t('curriculum.lead')}
            </p>
          </div>
          <div className="tr-curric grid-lines grid-lines--dark" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {curriculum.map((c, i) => (
              <div key={c.title} style={{ background: 'var(--black)', padding: 'clamp(26px,3vw,40px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--red-bright)', fontSize: 14, letterSpacing: '.05em' }}>{String(i + 1).padStart(2, '0')}</div>
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
            <Eyebrow num="03" label={t('dates.eyebrow')} />
            <h2 className="h2 h2--sm">{t('dates.title')}<span className="accent">.</span></h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 320, margin: 0 }}>
            {t('dates.lead')}
          </p>
        </div>
        <div className="tr-dates" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {/* Partner-run courses (QuinLay AG): booking on quinlay.ch, our modal as the secondary CTA. */}
          {partnerRun &&
            partnerSessions.map((d) => (
              <div key={d.date} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(22px,2.4vw,28px)', display: 'flex', flexDirection: 'column' }}>
                {langBadges(d.languages)}
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', marginBottom: 8 }}>{d.date}</div>
                <div style={{ fontSize: 13, color: 'var(--text-faint)', flex: 1 }}>{d.note}</div>
                {d.external && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                    <a href={d.external.href} target="_blank" rel="noopener" className="btn btn--primary btn--sm" style={{ justifyContent: 'center' }}>
                      {t('dates.externalCta')} <ArrowUpRight size={14} />
                    </a>
                    <ModalButton type="training" source={d.source ?? 'training_hero'} trainingView={view} className="btn btn--ghost btn--sm" style={{ justifyContent: 'center' }}>
                      {t('dates.secondaryCta')}
                    </ModalButton>
                  </div>
                )}
              </div>
            ))}
          {/* One card per upcoming Beveren-Waas day: a full day keeps its card with a
              "Full" tag and no button until its date; an open day reserves a seat. */}
          {view.sessions.map((s) => (
            <div key={s.id} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(22px,2.4vw,28px)', display: 'flex', flexDirection: 'column' }}>
              {langBadges(s.languages)}
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', marginBottom: 6 }}>{s.dateLabel}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{s.systemLabel}</div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)', flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {s.full ? (
                  <>
                    <span>{s.location}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', background: 'var(--black)', color: '#fff', padding: '3px 8px' }}>{fullLabel}</span>
                  </>
                ) : (
                  s.note
                )}
              </div>
              {!s.full && (
                <ModalButton type="training" source="training_card" prefill={{ preferredDate: s.id }} trainingView={view} className="btn btn--ghost btn--sm" style={{ justifyContent: 'center', marginTop: 16 }}>
                  {tm('trainingSessions.reserve')} <ArrowRight size={14} />
                </ModalButton>
              )}
            </div>
          ))}
          {!partnerRun && (
            <div style={{ border: '1px dashed var(--border-input)', background: 'var(--surface)', padding: 'clamp(22px,2.4vw,28px)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', marginBottom: 8 }}>{t('dates.onRequestTitle')}</div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>{t('dates.onRequestNote')}</div>
            </div>
          )}
        </div>
        {!partnerRun && view.sessions.length === 0 && (
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', margin: '18px 0 0', maxWidth: '60ch' }}>{tm('trainingSessions.noDates')}</p>
        )}
        {partnerRun && (
          <p style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', margin: '18px 0 0' }}>
            <MapPin size={15} style={{ color: 'var(--red)' }} /> {t('dates.swissRoom')}
          </p>
        )}
      </section>

      {/* International — EN/DE/PL: real days when one is taught in that language, an interest card otherwise (not on partner-run locales) */}
      {!partnerRun && (
      <section id="international" className="section--surface">
        <div className="container section--sm">
          <div className="tr-intl" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="04" label={t('international.eyebrow')} />
              <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('international.title')}<span className="accent">.</span></h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', maxWidth: '48ch', margin: '0 0 14px' }}>{t('international.lead')}</p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: '48ch', margin: 0 }}>{t('international.body')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {view.interest.map((i) =>
                i.sessions.length > 0 ? (
                  <div key={i.language} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(20px,2.2vw,26px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
                    <div>
                      {langBadges([i.language])}
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', marginBottom: 6 }}>{tm(`trainingSessions.languageTitle.${i.language}`)}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-faint)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {i.sessions.map((s) => (
                          <span key={s.id}>{s.dateLabel} · {s.systemLabel}</span>
                        ))}
                      </div>
                    </div>
                    <ModalButton type="training" source="training_international" prefill={{ preferredDate: i.sessions[0].id }} trainingView={view} className="btn btn--ghost btn--sm">
                      {tm('trainingSessions.reserve')} <ArrowRight size={14} />
                    </ModalButton>
                  </div>
                ) : (
                  <div key={i.language} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(20px,2.2vw,26px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
                    <div>
                      {langBadges([i.language])}
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', marginBottom: 6 }}>{i.card?.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>{i.card?.note}</div>
                    </div>
                    <ModalButton type="dates" source="training_international" prefill={{ preferredDate: `interest:${i.language}` }} trainingView={view} className="btn btn--ghost btn--sm">
                      {t('international.cta')} <ArrowRight size={14} />
                    </ModalButton>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Booking form */}
      <section id="book" className="section--red">
        <div className="container section">
          <div className="tr-book" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="05" label={t('book.eyebrow')} tone="red" />
              <h2 className="h2" style={{ color: '#fff', margin: '0 0 22px' }}>{t('book.titleA')}<br /><span style={{ color: 'var(--black)' }}>{t('book.titleB')}.</span></h2>
              {/* HQ inclusions (certificate, starter kit, lunch) are Beveren-Waas facts —
                  a partner-run locale makes no such claims for the partner's courses. */}
              {!partnerRun && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', marginBottom: 14 }}>{t('book.includedLabel')}</div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {included.map((p) => (
                      <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#fff', fontWeight: 500 }}>
                        <Check size={18} /> {p}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div style={{ background: '#fff', padding: 'clamp(26px,3vw,40px)', border: '1px solid var(--border)' }}>
              <InlineLeadForm type="training" source="training_book" trainingView={view} />
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) {
          .tr-hero { grid-template-columns: 1fr !important; }
          .tr-hero-img { aspect-ratio: 4/3 !important; }
          .tr-curric { grid-template-columns: 1fr 1fr !important; }
          .tr-dates { grid-template-columns: 1fr 1fr !important; }
          .tr-intl { grid-template-columns: 1fr !important; }
          .tr-book { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .tr-format { grid-template-columns: 1fr !important; }
          .tr-curric { grid-template-columns: 1fr !important; }
          .tr-dates { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </>
  );
}
