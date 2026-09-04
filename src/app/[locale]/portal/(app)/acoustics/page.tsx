// CLIENT PORTAL — acoustic calculator (/portal/acoustics).
// The calculator is a self-contained HTML app (Sabine reverberation time per
// octave band, 3-page PDF report) served by the authenticated
// /api/portal/acoustics route and embedded full-height here, like the ceiling
// designer. The iframe isolates its styles/scripts from the site and lets us
// update it by swapping one file. The page's locale is passed to the route so
// the tool picks its report language (be, nl → Dutch, everything else → English).
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getPortalSession } from '@/lib/portal/auth';
import { hasAcousticsAccess } from '@/lib/portal/types';

export default async function PortalAcousticsPage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) return null; // (app) layout already redirects
  if (!hasAcousticsAccess(session.profile)) redirect({ href: '/portal', locale });

  const t = await getTranslations('portal.acoustics');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ padding: '18px 0 10px' }}>
        <p className="eyebrow" style={{ margin: 0 }}>
          <span
            style={{ background: 'var(--red)', width: 10, height: 10, display: 'inline-block', marginRight: 12 }}
          />
          {t('eyebrow')}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5, margin: '8px 0 0', maxWidth: 720 }}>
          {t('hint')}
        </p>
      </div>
      <iframe
        src={`/api/portal/acoustics?locale=${locale}`}
        title={t('eyebrow')}
        style={{
          border: 'none',
          borderTop: '1px solid var(--line, #e2e8f0)',
          width: '100%',
          height: 'calc(100vh - 120px)',
          minHeight: 760,
          display: 'block',
          background: '#0d0d0d',
        }}
      />
    </div>
  );
}
