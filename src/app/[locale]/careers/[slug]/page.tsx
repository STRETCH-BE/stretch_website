// Vacancy page (/careers/[slug]). One open position in full — the six
// sections of the vacancy document (role, what you will do, who you are,
// what we offer, how to apply) — with JobPosting + BreadcrumbList JSON-LD.
// Statically generated for every (locale, slug) pair in src/lib/careers.ts;
// dynamicParams=false → any other slug 404s instead of rendering on demand
// (which trips next-intl's headers() lookup, see the [locale] layout).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, locales, localeFullCodes, type Locale } from '@/i18n/config';
import { brand } from '@/lib/site-config';
import { vacancySlugs, getVacancy, vacanciesFor, applyHref, type Vacancy } from '@/lib/careers';
import { localeBase, buildAlternates, buildOgLocales, apiBase } from '@/lib/seo';
import { breadcrumbSchema, jobPostingSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import ApplyMailLink from '@/components/ui/ApplyMailLink';
import VacancyCard, { type VacancyCardText } from '@/components/sections/VacancyCard';

/** The translated body of one vacancy — careersPage.jobs.<slug> in the messages. */
type JobMessages = VacancyCardText & {
  languages: string;
  facts: { label: string; value: string }[];
  role: { title: string; p1: string; p2: string; lines: { label: string; value: string }[] };
  do: { title: string; intro: string; areas: { title: string; items: string[] }[] };
  who: { title: string; items: string[] };
  offer: { title: string; items: { title: string; sub: string }[]; closing: string };
  apply: { title: string; body: string; hours: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => vacancySlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const vacancy = getVacancy(params.slug);
  if (!vacancy) return {};
  const t = await getTranslations({ locale, namespace: 'careersPage' });
  const job = t.raw(`jobs.${vacancy.slug}`) as JobMessages;
  const route = `/careers/${vacancy.slug}`;
  const title = `${job.title} — ${job.location} | ${brand.name}`;
  const description = job.summary;
  const { ogLocale, alternate } = buildOgLocales(locale);
  const ogImg = `${apiBase(locale)}/api/og`;
  const url = `${localeBase(locale)}${route}`;

  return {
    title: { absolute: title },
    description,
    robots: { index: true, follow: true },
    alternates: buildAlternates(locale, route),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title,
      description,
      url,
      locale: ogLocale,
      alternateLocale: alternate,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImg] },
  };
}

function fmtDate(iso: string, locale: Locale) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString(localeFullCodes[locale] ?? 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The vacancy as simple HTML for JobPosting.description — the same text the page prints. */
function descriptionHtml(job: JobMessages): string {
  const list = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  return [
    `<p>${esc(job.summary)}</p>`,
    `<p>${esc(job.role.p1)}</p><p>${esc(job.role.p2)}</p>`,
    `<h3>${esc(job.do.title)}</h3>`,
    ...job.do.areas.map((a) => `<h4>${esc(a.title)}</h4>${list(a.items)}`),
    `<h3>${esc(job.who.title)}</h3>${list(job.who.items)}`,
    `<h3>${esc(job.offer.title)}</h3>${list(job.offer.items.map((i) => `${i.title} — ${i.sub}`))}<p>${esc(job.offer.closing)}</p>`,
    `<p>${esc(job.apply.body)}</p>`,
  ].join('');
}

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: 'var(--text-faint-2)',
  marginBottom: 6,
} as const;

export default async function VacancyPage({ params }: { params: { locale: string; slug: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const vacancy = getVacancy(params.slug);
  if (!vacancy) notFound();
  const v: Vacancy = vacancy;

  const t = await getTranslations('careersPage');
  const tp = await getTranslations('productPage');
  const job = t.raw(`jobs.${v.slug}`) as JobMessages;
  const facts = t.raw('facts') as string[];
  const others = vacanciesFor(locale).filter((o) => o.slug !== v.slug);
  const url = `${localeBase(locale)}/careers/${v.slug}`;
  const mailto = applyHref(v.apply.email, v.apply.subject);
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
    { name: job.title, url },
  ]);

  return (
    <>
      <JsonLd data={jobPostingSchema(v, { locale, title: job.title, description: descriptionHtml(job), url })} />
      <JsonLd data={crumbs} />

      {/* Hero + apply card */}
      <section className="container" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(36px,4vw,56px)' }}>
        <Link
          href="/careers"
          className="lnk"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 'clamp(24px,3vw,36px)' }}
        >
          <ArrowLeft size={15} /> {t('detail.back')}
        </Link>
        <div className="vp-hero" style={{ display: 'grid', gridTemplateColumns: '1.25fr .75fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
          <div>
            <Eyebrow num="00" label={`${t('detail.vacancyEyebrow')} · ${job.location}`} />
            <h1 className="h2" style={{ margin: '0 0 22px' }}>
              {job.title}{' '}
              <span style={{ fontSize: '.42em', fontWeight: 600, color: 'var(--text-faint-2)', letterSpacing: 0, textTransform: 'none', whiteSpace: 'nowrap' }}>{t('mfx')}</span>
            </h1>
            <p className="lead" style={{ maxWidth: 620, margin: 0 }}>{job.summary}</p>
          </div>
          <aside style={{ border: '1.5px solid var(--black)', background: '#fff', padding: 'clamp(22px,2.6vw,32px)' }}>
            <div style={labelStyle}>{t('employerLabel')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-.01em', marginBottom: 4 }}>{v.employer.name}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 18 }}>
              {v.address.street}
              <br />
              {`${v.address.postalCode} ${v.address.city}`}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div>
                <div style={labelStyle}>{t('contractLabel')}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{job.contract}</div>
              </div>
              <div>
                <div style={labelStyle}>{t('languagesLabel')}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{job.languages}</div>
              </div>
            </div>
            <ApplyMailLink href={mailto} location={`careers_${v.slug}`} className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
              {t('detail.applyButton')} <ArrowUpRight size={15} />
            </ApplyMailLink>
            <div style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 12, lineHeight: 1.6 }}>
              {t('detail.subjectNote', { subject: v.apply.subject })}
              <br />
              {t('detail.published', { date: fmtDate(v.datePosted, locale) })}
            </div>
          </aside>
        </div>

        {/* Key facts */}
        <div className="vp-facts grid-lines" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginTop: 'clamp(32px,4vw,56px)' }}>
          {job.facts.map((f) => (
            <div key={f.label} style={{ background: '#fff', padding: 'clamp(20px,2.4vw,28px)' }}>
              <div style={labelStyle}>{f.label}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.55, fontWeight: 500 }}>{f.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* (01) About STRETCH */}
      <section className="section--surface">
        <div className="container section--sm">
          <div className="vp-two" style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="01" label={t('aboutEyebrow')} />
              <h2 className="h2 h2--sm" style={{ margin: 0, maxWidth: '12ch' }}>{t('about.title')}</h2>
            </div>
            <div>
              <div className="prose" style={{ maxWidth: 680 }}>
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
              </div>
              <ul className="vp-facts4" style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(4,auto)', gap: '10px 22px', justifyContent: 'start' }}>
                {facts.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    <span className="tick tick--sm" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* (02) The role */}
      <section className="container section--sm">
        <div className="vp-two" style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
          <div>
            <Eyebrow num="02" label={t('detail.roleEyebrow')} />
            <h2 className="h2 h2--sm" style={{ margin: 0, maxWidth: '12ch' }}>{job.role.title}</h2>
          </div>
          <div>
            <div className="prose" style={{ maxWidth: 680 }}>
              <p>{job.role.p1}</p>
              <p>{job.role.p2}</p>
            </div>
            <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: 'clamp(20px,2.4vw,28px)', marginTop: 8, maxWidth: 680 }}>
              <div style={{ ...labelStyle, color: 'var(--red)', marginBottom: 14 }}>{t('detail.reportingHeading')}</div>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 22px', fontSize: 14.5, lineHeight: 1.55 }}>
                {job.role.lines.map((l) => (
                  <div key={l.label} style={{ display: 'contents' }}>
                    <dt style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint-2)', paddingTop: 3 }}>{l.label}</dt>
                    <dd style={{ margin: 0, fontWeight: 500 }}>{l.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* (03) What you will do */}
      <section className="section--surface">
        <div className="container section--sm">
          <Eyebrow num="03" label={t('detail.doEyebrow')} />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 12px', maxWidth: '22ch' }}>{job.do.title}</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 620, margin: '0 0 clamp(28px,3.5vw,44px)' }}>{job.do.intro}</p>
          <div className="vp-areas" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {job.do.areas.map((a, i) => (
              <div key={a.title} style={{ background: '#fff', border: '1px solid var(--border)', padding: 'clamp(22px,2.6vw,32px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, letterSpacing: '.16em', color: 'var(--red)', marginBottom: 10 }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(18px,1.9vw,22px)', letterSpacing: '-.01em', margin: '0 0 14px' }}>{a.title}</h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {a.items.map((item) => (
                    <li key={item} style={{ display: 'flex', gap: 12, fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                      <span className="tick tick--sm" style={{ marginTop: 7 }} aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* (04) Who you are */}
      <section className="container section--sm">
        <div className="vp-two" style={{ display: 'grid', gridTemplateColumns: '.8fr 1.2fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start' }}>
          <div>
            <Eyebrow num="04" label={t('detail.whoEyebrow')} />
            <h2 className="h2 h2--sm" style={{ margin: 0, maxWidth: '12ch' }}>{job.who.title}</h2>
          </div>
          <ul className="vp-who" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px' }}>
            {job.who.items.map((item) => (
              <li key={item} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)' }}>
                <span className="tick" style={{ marginTop: 7 }} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* (05) What we offer */}
      <section className="section--surface">
        <div className="container section--sm">
          <Eyebrow num="05" label={t('detail.offerEyebrow')} />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 clamp(28px,3.5vw,44px)', maxWidth: '22ch' }}>{job.offer.title}</h2>
          <div className="vp-offer grid-lines" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {job.offer.items.map((o) => (
              <div key={o.title} style={{ background: '#fff', padding: 'clamp(22px,2.6vw,32px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(18px,1.9vw,22px)', letterSpacing: '-.01em', marginBottom: 10 }}>{o.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>{o.sub}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', maxWidth: 760, margin: 'clamp(24px,3vw,36px) 0 0' }}>{job.offer.closing}</p>
        </div>
      </section>

      {/* (06) How to apply */}
      <section className="section--dark">
        <div className="container section--sm vp-apply" style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="06" label={t('detail.applyEyebrow')} tone="dark" />
            <h2 className="h2 h2--sm" style={{ color: '#fff', margin: '0 0 16px', maxWidth: '16ch' }}>{job.apply.title}</h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--on-dark-soft)', maxWidth: 620, margin: '0 0 26px' }}>{job.apply.body}</p>
            <ApplyMailLink href={mailto} location={`careers_${v.slug}_apply`} className="btn btn--primary btn--lg">
              {t('detail.applyButton')} <ArrowUpRight size={16} />
            </ApplyMailLink>
          </div>
          <div style={{ display: 'grid', gap: 22, fontSize: 14, lineHeight: 1.5 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ display: 'inline-flex', width: 42, height: 42, flexShrink: 0, border: '1px solid var(--line-dark)', color: 'var(--red-bright)', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </span>
              <div>
                <div style={{ ...labelStyle, color: 'var(--on-dark-faint)' }}>{t('detail.emailLabel')}</div>
                <a href={mailto} className="lnk" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#fff' }}>{v.apply.email}</a>
                <div style={{ fontSize: 12.5, color: 'var(--on-dark-muted)', marginTop: 4 }}>{t('detail.subjectNote', { subject: v.apply.subject })}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ display: 'inline-flex', width: 42, height: 42, flexShrink: 0, border: '1px solid var(--line-dark)', color: 'var(--red-bright)', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} />
              </span>
              <div>
                <div style={{ ...labelStyle, color: 'var(--on-dark-faint)' }}>{t('detail.questionsLabel')}</div>
                <a href={v.apply.phoneHref} className="lnk" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: '#fff' }}>{v.apply.phoneDisplay}</a>
                <div style={{ fontSize: 12.5, color: 'var(--on-dark-muted)', marginTop: 4 }}>{job.apply.hours}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other open positions */}
      {others.length > 0 && (
        <section className="container section--sm">
          <Eyebrow label={t('detail.otherEyebrow')} />
          <div style={{ display: 'grid', gap: 14 }}>
            {others.map((o) => (
              <VacancyCard key={o.slug} vacancy={o} text={t.raw(`jobs.${o.slug}`) as VacancyCardText} labels={cardLabels} />
            ))}
          </div>
        </section>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 1100px) {
          .vc-card { grid-template-columns: 1.4fr 1fr 1fr !important; }
          .vc-btn { grid-column: 1 / -1; justify-self: start !important; }
          .vp-offer { grid-template-columns: 1fr 1fr !important; }
          .vp-facts { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 860px) {
          .vp-hero, .vp-two, .vp-apply, .vp-areas, .vp-who { grid-template-columns: 1fr !important; }
          .vp-facts4 { grid-template-columns: 1fr 1fr !important; }
          .vc-card { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .vp-facts, .vp-offer, .vp-facts4 { grid-template-columns: 1fr !important; }
        }
      `,
        }}
      />
    </>
  );
}
