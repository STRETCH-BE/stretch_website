// /projects-export — Gulf & international project supply. Premium confection
// for fit-out and interior contractors in far markets (UAE/Saudi/Qatar and
// beyond): translucent/backlit, printed, acoustic and large-format ceilings,
// engineered and welded in our EU factory and shipped by air as light parcels.
//
// FACTS DISCIPLINE (hard rule): no certification claim is ever invented.
// The fire classes named on this page come from src/lib/datasheets.ts —
// B-s1,d0 membranes (EN 14716 / EN 13501-1) across the PVC, polyester,
// acoustic and translucent ranges, plus the non-flammable glassfibre option
// at A2-s1,d0. Anything not covered by a published datasheet gets the
// "certification documentation available on request" fallback. Datasheet
// access stays behind the existing gated flow (/datasheets) — never linked
// as raw files here. Reference projects are REAL case studies from
// content.ts. NO pricing appears; invoicing is EUR-only.
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, ArrowUpRight, Check, FileCheck } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, serviceSchema } from '@/lib/structured-data';
import { getProjectBySlug } from '@/lib/content';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import { Link } from '@/i18n/navigation';
import { localeBase } from '@/lib/seo';

// Commercial case studies with real photography (content.ts) — shown as the
// reference strip. Order: acoustic showpiece, acoustic office, luminous bank
// HQ, luminous gallery.
const REFERENCE_SLUGS = [
  'creneau-afas-lounge',
  'candor-sint-martens-latem',
  'bnp-paribas-fortis',
  'rue-perree-paris',
] as const;

// The four project capabilities, each mapped to the catalog page that
// documents it (never invented): translucent/backlit + printed live on the
// Light & Print product, acoustic on the acoustic system, large-format on
// the polyester range (seamless widths up to 515 cm per the datasheets).
const CAPABILITY_LINKS = [
  '/products/light-print-stretch-ceiling',
  '/products/light-print-stretch-ceiling',
  '/products/acoustic-stretch-system',
  '/products/polyester-stretch-ceiling',
] as const;

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/projects-export', titleKey: 'projectsExportTitle', descKey: 'projectsExportDescription' });
}

export default async function ProjectsExportPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = await getTranslations('projectsExportPage');
  const tp = await getTranslations('productPage');

  const capabilities = t.raw('capabilities.items') as { title: string; body: string }[];
  const steps = t.raw('how.steps') as { title: string; body: string }[];
  const audiences = t.raw('audiences.items') as string[];
  const references = REFERENCE_SLUGS.map((slug) => getProjectBySlug(slug)).filter(
    (p): p is NonNullable<ReturnType<typeof getProjectBySlug>> => Boolean(p),
  );

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumb'), url: `${localeBase(locale)}/projects-export` },
  ]);
  const service = serviceSchema({
    name: t('serviceName'),
    description: t('serviceDescription'),
    url: `${localeBase(locale)}/projects-export`,
  });

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={service} />

      {/* HERO */}
      <section className="container section">
        <div style={{ maxWidth: 880 }}>
          <Eyebrow num="01" label={t('eyebrow')} />
          <h1 className="h1" style={{ margin: '0 0 22px', fontSize: 'clamp(26px, 5.6vw, 84px)' }}>
            {t('titleA')}
            <br />
            <span className="accent">{t('titleB')}</span>
          </h1>
          <p className="lead" style={{ maxWidth: '56ch', margin: '0 0 28px' }}>{t('lead')}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <ModalButton type="projects_export" source="projects_export" className="btn btn--primary">
              {t('cta')} <ArrowUpRight size={15} />
            </ModalButton>
            <Link href="/datasheets" className="btn btn--ghost">
              {t('ctaDatasheets')}
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT WE DELIVER */}
      <section className="section--surface">
        <div className="container section--sm">
          <div style={{ marginBottom: 'clamp(18px,2.4vw,28px)' }}>
            <Eyebrow num="02" label={t('capabilities.eyebrow')} />
            <h2 className="h2 h2--sm" style={{ margin: 0 }}>{t('capabilities.title')}</h2>
          </div>
          <div className="pe-caps" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {capabilities.map((c, i) => (
              <Link key={c.title} href={CAPABILITY_LINKS[i] ?? '/products'} style={{ background: '#fff', padding: 'clamp(20px,2.4vw,28px)', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17.5, letterSpacing: '-.01em' }}>{c.title}</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-muted)' }}>{c.body}</span>
                <span style={{ marginTop: 'auto', color: 'var(--red)', fontWeight: 700, fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {t('capabilities.cta')} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section className="container section--sm">
        <div style={{ marginBottom: 'clamp(18px,2.4vw,28px)' }}>
          <Eyebrow num="03" label={t('references.eyebrow')} />
          <h2 className="h2 h2--sm" style={{ margin: 0 }}>{t('references.title')}</h2>
        </div>
        <div className="pe-refs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {references.map((p) => (
            <Link key={p.slug} href={`/inspiration/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', marginBottom: 12 }}>
                <Placeholder label={p.title} src={p.image} alt={p.title} sizes="(max-width: 900px) 50vw, 24vw" />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5, letterSpacing: '-.01em', marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>{p.meta}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FIRE & TECHNICAL DOCUMENTATION */}
      <section className="section--dark">
        <div className="container section--sm">
          <Eyebrow num="04" label={t('fire.eyebrow')} tone="dark" />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 16px' }}>{t('fire.title')}</h2>
          <p style={{ maxWidth: '68ch', color: 'var(--on-dark-soft)', lineHeight: 1.65, margin: '0 0 20px' }}>
            {/* Classes below trace to datasheets.ts — see the header comment. */}
            {t('fire.body')}
          </p>
          <ul style={{ listStyle: 'none', margin: '0 0 22px', padding: 0, display: 'flex', flexDirection: 'column', gap: 11, maxWidth: '72ch' }}>
            {(t.raw('fire.points') as string[]).map((p) => (
              <li key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, color: 'var(--on-dark-soft)', lineHeight: 1.55 }}>
                <FileCheck size={16} style={{ color: 'var(--red-bright)', flexShrink: 0, marginTop: 3 }} />
                {p}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 13.5, color: 'var(--on-dark-muted)', maxWidth: '68ch', margin: '0 0 24px' }}>{t('fire.fallback')}</p>
          <Link href="/datasheets" className="btn btn--primary">
            {t('ctaDatasheets')} <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* HOW PROJECT SUPPLY WORKS */}
      <section className="container section--sm">
        <div style={{ marginBottom: 'clamp(18px,2.4vw,28px)' }}>
          <Eyebrow num="05" label={t('how.eyebrow')} />
          <h2 className="h2 h2--sm" style={{ margin: 0 }}>{t('how.title')}</h2>
        </div>
        <ol className="pe-steps" style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 'clamp(16px,2vw,24px)' }}>
          {steps.map((s, i) => (
            <li key={s.title} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--red)', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, margin: '8px 0 5px' }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>{s.body}</p>
            </li>
          ))}
        </ol>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-faint)', margin: 0 }}>{t('how.currencyLine')}</p>
      </section>

      {/* WHO WE WORK WITH + CTA */}
      <section className="section--surface">
        <div className="container section--sm">
          <div style={{ marginBottom: 'clamp(18px,2.4vw,26px)' }}>
            <Eyebrow num="06" label={t('audiences.eyebrow')} />
            <h2 className="h2 h2--sm" style={{ margin: 0 }}>{t('audiences.title')}</h2>
          </div>
          <ul style={{ listStyle: 'none', margin: '0 0 10px', padding: 0, display: 'flex', flexDirection: 'column', gap: 11, maxWidth: '62ch' }}>
            {audiences.map((a) => (
              <li key={a} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, lineHeight: 1.55 }}>
                <Check size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 3 }} />
                {a}
              </li>
            ))}
          </ul>
          <p style={{ margin: '0 0 26px' }}>
            <Link href="/architects" className="lnk" style={{ fontWeight: 700, fontSize: 14.5 }}>
              {t('audiences.architectsLink')} →
            </Link>
          </p>
          <ModalButton type="projects_export" source="projects_export" className="btn btn--primary">
            {t('cta')} <ArrowUpRight size={15} />
          </ModalButton>
        </div>
      </section>

      <style>{`
        @media (max-width: 1000px) {
          .pe-caps { grid-template-columns: 1fr 1fr !important; }
          .pe-refs { grid-template-columns: 1fr 1fr !important; }
          .pe-steps { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .pe-caps { grid-template-columns: 1fr !important; }
          .pe-refs { grid-template-columns: 1fr !important; }
          .pe-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
