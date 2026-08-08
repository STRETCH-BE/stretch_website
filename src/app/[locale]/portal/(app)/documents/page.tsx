// CLIENT PORTAL — documents (/portal/documents). The technical library with
// direct downloads for signed-in clients — no lead gate, unlike /datasheets.
// The PDFs live outside public/, so each render mints fresh signed links
// (14 days — plenty for a page that regenerates them on every visit).
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Download } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getPortalSession } from '@/lib/portal/auth';
import { datasheetsByCategory } from '@/lib/datasheets';
import { createDatasheetLink } from '@/lib/datasheet-links';

export const dynamic = 'force-dynamic';

export default async function PortalDocumentsPage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) return null; // (app) layout already redirects
  const t = await getTranslations('portal.docs');

  const groups = datasheetsByCategory();

  return (
    <div className="container" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(40px,5vw,72px)' }}>
      <p className="eyebrow">
        <span style={{ background: 'var(--red)', width: 10, height: 10, display: 'inline-block', marginRight: 12 }} />
        {t('title')}
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
      <p style={{ color: 'var(--text-muted)', fontSize: 15.5, margin: '0 0 34px', maxWidth: 640 }}>{t('intro')}</p>

      {groups.map((group) => (
        <div key={group.category} style={{ marginBottom: 'clamp(28px,3.4vw,44px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>
              {group.category}
            </span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.items.map((sheet) => (
              <div key={sheet.slug} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid var(--border)', background: '#fff' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{sheet.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{sheet.description}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-faint-2)', marginTop: 5, letterSpacing: '.04em' }}>
                    {[sheet.format, sheet.sizeLabel, sheet.updated].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <a
                  href={createDatasheetLink(sheet.slug, locale)}
                  download
                  className="btn btn--primary btn--sm"
                  style={{ flexShrink: 0 }}
                >
                  {t('download')} <Download size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
