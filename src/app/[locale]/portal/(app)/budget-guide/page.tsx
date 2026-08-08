// CLIENT PORTAL — the architect budget guide (/portal/budget-guide).
// Indicative installed €/m² bands for early-stage budgeting — the numbers
// nobody publishes. Architect + admin only: trade accounts have the real
// pricelist and b2c has neither. ALL numbers come from the hand-edited
// src/lib/budget-bands.ts — this page must never import portal/data.ts or
// any other pricebook source.
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CircleAlert, ArrowRight } from 'lucide-react';
import { redirect } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getPortalSession } from '@/lib/portal/auth';
import { hasArchitectAccess } from '@/lib/portal/types';
import { budgetBands } from '@/lib/budget-bands';
import { ModalButton } from '@/components/ui/ModalButton';

export const dynamic = 'force-dynamic';

export default async function BudgetGuidePage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session || !hasArchitectAccess(session.profile)) {
    redirect({ href: '/portal', locale });
  }
  const { profile } = session!;
  const t = await getTranslations('portal.budget');

  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const prefill = {
    email: profile.email,
    phone: profile.phone ?? '',
    company: profile.office ?? profile.company ?? '',
  };

  return (
    <div className="container" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,72px)' }}>
      <p className="eyebrow">
        <span style={{ background: 'var(--red)', width: 10, height: 10, display: 'inline-block', marginRight: 12 }} />
        {t('eyebrow')}
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: 'clamp(30px,4.4vw,54px)',
          lineHeight: 1,
          margin: '14px 0 10px',
        }}
      >
        {t('title')}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15.5, margin: '0 0 22px', maxWidth: 680 }}>{t('intro')}</p>

      {/* The indicative disclaimer — prominent, above the numbers. */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', borderLeft: '3px solid var(--red)', border: '1px solid var(--border)', padding: '14px 18px', maxWidth: 760, margin: '0 0 30px' }}>
        <CircleAlert size={17} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>{t('disclaimer')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 860 }}>
        {budgetBands.map((band) => (
          <article key={band.slug} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', border: '1px solid var(--border)', background: '#fff', padding: 'clamp(18px,2.4vw,26px)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <h2 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, letterSpacing: '.02em' }}>{band.system}</h2>
              <p style={{ margin: '0 0 12px', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>{band.description}</p>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint-2)', margin: '0 0 6px' }}>
                {t('includes')}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-body)', lineHeight: 1.7 }}>
                {band.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>
              {band.note && (
                <p style={{ margin: '10px 0 0', fontSize: 12.5, color: 'var(--text-faint)', lineHeight: 1.5 }}>{band.note}</p>
              )}
            </div>
            <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px,2.6vw,30px)', letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>
                {fmt.format(band.lowEur)} – {fmt.format(band.highEur)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted-2)', marginTop: 4 }}>
                {band.unit === 'm²' ? t('perM2') : t('perUnit')}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Real number → register the project */}
      <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', background: 'var(--black)', color: '#fff', padding: 'clamp(20px,2.6vw,30px)', maxWidth: 860 }}>
        <p style={{ margin: 0, flex: '1 1 320px', fontSize: 14.5, lineHeight: 1.6 }}>{t('ctaBody')}</p>
        <ModalButton type="project" source="architect_project_budget" prefill={prefill} className="btn btn--primary">
          {t('ctaButton')} <ArrowRight size={15} />
        </ModalButton>
      </div>
    </div>
  );
}
