// /supply — installer materials & confection landing. The public face of the
// factory-supply offer (materials, made-to-measure confection, training) for
// installation professionals across Europe; the French version doubles as the
// landing for outreach to independent French installers. Copy stays positive
// and generic — we say what WE offer, we never name competitors.
//
// Facts discipline: the six supply groups come straight from materials.ts
// (localized via the materialsData namespace) — never invent products or
// brands. NO prices appear here: settlement policy is one line (EUR, PLN for
// Poland), pricing lives behind the portal tiers. Confection lead time reads
// from LEAD_TIME_DAYS (src/lib/supply.ts) — placeholder-safe until Michael
// fills in the real number.
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, ArrowUpRight, Check, Package } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, serviceSchema } from '@/lib/structured-data';
import { materialGroups } from '@/lib/materials';
import { LEAD_TIME_DAYS } from '@/lib/supply';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import { ModalButton } from '@/components/ui/ModalButton';
import { Link } from '@/i18n/navigation';
import { localeBase } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/supply', titleKey: 'supplyTitle', descKey: 'supplyDescription' });
}

export default async function SupplyPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = await getTranslations('supplyPage');
  const tData = await getTranslations('materialsData');
  const tp = await getTranslations('productPage');

  const confectionPoints = t.raw('confection.points') as string[];
  const steps = t.raw('how.steps') as { title: string; body: string }[];

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumb'), url: `${localeBase(locale)}/supply` },
  ]);
  const service = serviceSchema({
    name: t('serviceName'),
    description: t('serviceDescription'),
    url: `${localeBase(locale)}/supply`,
  });

  const sectionHead = (num: string, label: string, title: string, dark = false) => (
    <div style={{ marginBottom: 'clamp(18px,2.4vw,28px)' }}>
      <Eyebrow num={num} label={label} tone={dark ? 'dark' : undefined} />
      <h2 className="h2 h2--sm" style={{ margin: 0 }}>{title}</h2>
    </div>
  );

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={service} />

      {/* HERO */}
      <section className="container section">
        <div style={{ maxWidth: 880 }}>
          <Eyebrow num="01" label={t('eyebrow')} />
          {/* Long multilingual title (nl/pl run to 24+-char words) — smaller
              clamp than --fs-h1 so no locale ever overflows the viewport. */}
          <h1 className="h1" style={{ margin: '0 0 22px', fontSize: 'clamp(26px, 5.6vw, 84px)' }}>
            {t('titleA')}
            <br />
            <span className="accent">{t('titleB')}</span>
          </h1>
          <p className="lead" style={{ maxWidth: '56ch', margin: '0 0 16px' }}>{t('lead')}</p>
          {/* France-forward angle, written generically for every locale */}
          <p style={{ maxWidth: '62ch', color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 28px' }}>{t('independent')}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/portal/login?signup=installer" className="btn btn--primary">
              {t('ctaPortal')} <ArrowUpRight size={15} />
            </Link>
            <ModalButton type="supply_inquiry" source="supply_inquiry" className="btn btn--ghost">
              {t('ctaInquiry')}
            </ModalButton>
          </div>
        </div>
      </section>

      {/* WHAT WE SUPPLY — the six real materials groups, deep-linked */}
      <section className="section--surface">
        <div className="container section--sm">
          {sectionHead('02', t('groupsEyebrow'), t('groupsTitle'))}
          <div className="sup-groups" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {materialGroups.map((g) => (
              <Link key={g.slug} href={`/materials/${g.slug}`} style={{ background: '#fff', padding: 'clamp(22px,2.4vw,30px)', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Package size={19} style={{ color: 'var(--red)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-.01em' }}>
                  {tData.has(`${g.slug}.name`) ? tData(`${g.slug}.name`) : g.name}
                </span>
                <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-muted)' }}>
                  {tData.has(`${g.slug}.intro`) ? `${tData(`${g.slug}.intro`).split('.')[0]}.` : `${g.intro.split('.')[0]}.`}
                </span>
                <span style={{ marginTop: 'auto', color: 'var(--red)', fontWeight: 700, fontSize: 13.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {t('groupsCta')} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONFECTION SERVICE */}
      <section className="container section--sm">
        <div className="sup-conf" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }}>
          <div>
            {sectionHead('03', t('confection.eyebrow'), t('confection.title'))}
            <p style={{ maxWidth: '56ch', color: 'var(--text-body)', lineHeight: 1.65, margin: '0 0 14px' }}>{t('confection.body')}</p>
            <p style={{ maxWidth: '56ch', color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>
              {LEAD_TIME_DAYS !== null
                ? t('confection.leadTime', { days: LEAD_TIME_DAYS })
                : t('confection.leadTimeTbc')}
            </p>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {confectionPoints.map((p) => (
              <li key={p} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14.5, lineHeight: 1.55 }}>
                <Check size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 3 }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section--surface">
        <div className="container section--sm">
          {sectionHead('04', t('how.eyebrow'), t('how.title'))}
          <ol className="sup-steps" style={{ listStyle: 'none', margin: '0 0 26px', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(18px,2.4vw,28px)' }}>
            {steps.map((s, i) => (
              <li key={s.title} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--red)', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5, margin: '8px 0 5px' }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>{s.body}</p>
              </li>
            ))}
          </ol>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: '72ch', margin: '0 0 10px' }}>
            {t('how.notExclusiveA')}{' '}
            <Link href="/dealers" className="lnk">{t('how.dealersLink')}</Link>
            {' · '}
            <Link href="/partners" className="lnk">{t('how.partnersLink')}</Link>
          </p>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-faint)', margin: 0 }}>{t('currencyLine')}</p>

          {/* Regional strip — room for more regions later */}
          <div style={{ marginTop: 'clamp(22px,3vw,32px)', border: '1px solid var(--border)', background: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>{t('regional.label')}</span>
            <Link href="/supply/czechia-slovakia" className="lnk" style={{ fontWeight: 700, fontSize: 14.5 }}>
              {t('regional.czsk')} →
            </Link>
          </div>
        </div>
      </section>

      {/* TRAINING CROSS-SELL + CTA */}
      <section className="section--dark">
        <div className="container section--sm">
          <Eyebrow num="05" label={t('training.eyebrow')} tone="dark" />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 16px' }}>{t('training.title')}</h2>
          <p style={{ maxWidth: '62ch', color: 'var(--on-dark-soft)', lineHeight: 1.65, margin: '0 0 26px' }}>{t('training.body')}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/installer-training" className="btn btn--primary">
              {t('training.cta')} <ArrowRight size={15} />
            </Link>
            <ModalButton type="supply_inquiry" source="supply_inquiry" className="btn btn--ghost-light">
              {t('ctaInquiry')}
            </ModalButton>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .sup-groups { grid-template-columns: 1fr 1fr !important; }
          .sup-conf { grid-template-columns: 1fr !important; }
          .sup-steps { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .sup-groups { grid-template-columns: 1fr !important; }
          .sup-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
