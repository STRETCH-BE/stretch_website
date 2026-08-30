'use client';

// Site footer (pure black). Four columns: brand, Solutions, Company, HQ contact.
// Legal row with Privacy/Terms/Warranty + a "Manage cookies" trigger that
// reopens the consent banner via the consent-open-banner event.
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { footerNav } from '@/lib/site-config';
import { contact } from '@/lib/site-config';
import { isDealerMarket } from '@/lib/dealers';
import PortalLink from '@/components/ui/PortalLink';
import { CONSENT_OPEN_BANNER_EVENT } from '@/lib/consent';
import { analytics } from '@/lib/analytics';
import {
  liveLocales,
  localeNames,
  localeFullCodes,
  originForLocale,
  type Locale,
} from '@/i18n/config';

export default function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('cookies');
  const locale = useLocale() as Locale;
  const pathname = usePathname(); // locale-agnostic path, identical across domains
  const path = pathname === '/' ? '' : pathname;
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--pure-black)', color: '#fff' }}>
      <div
        className="container"
        style={{ paddingTop: 'clamp(52px,6vw,84px)', paddingBottom: 40 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1.3fr',
            gap: 40,
            paddingBottom: 48,
            borderBottom: '1px solid var(--line-footer)',
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 26,
                  letterSpacing: '-.02em',
                }}
              >
                STRETCH
              </span>
              <span style={{ color: 'var(--red-bright)', fontWeight: 900, fontSize: 15 }}>®</span>
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--on-dark-muted)',
                maxWidth: 300,
                margin: '0 0 22px',
              }}
            >
              {t('tagline')}
            </p>
          </div>

          {/* Solutions */}
          <FooterCol heading={t('solutionsHeading')}>
            {footerNav.solutions.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="lnk" style={{ color: 'var(--on-dark-soft)' }}>
                  {t(`links.${l.key}`)}
                </Link>
              </li>
            ))}
          </FooterCol>

          {/* Company */}
          <FooterCol heading={t('companyHeading')}>
            {footerNav.company
              // Training only exists on dealer markets (N2) — no dead link on us.
              .filter((l) => l.href !== '/installer-training' || isDealerMarket(locale))
              .map((l) => (
              <li key={l.href}>
                {l.key === 'clientPortal' ? (
                  <PortalLink href={l.href} className="lnk" style={{ color: 'var(--on-dark-soft)' }}>
                    {t(`links.${l.key}`)}
                  </PortalLink>
                ) : (
                  <Link href={l.href} className="lnk" style={{ color: 'var(--on-dark-soft)' }}>
                    {t(`links.${l.key}`)}
                  </Link>
                )}
              </li>
            ))}
          </FooterCol>

          {/* HQ */}
          <div>
            {/* Not a document heading (fixes heading-order audit); brighter
                red for AA contrast of 11.5px text on the black footer. */}
            <p
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--red-bright)',
                margin: '0 0 18px',
              }}
            >
              {t('hqHeading')}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--on-dark-soft)', margin: '0 0 16px' }}>
              Beverpark, Gentseweg 309 A3
              <br />
              9120 Beveren-Waas, Belgium
            </p>
            <a
              href={contact.phoneHref}
              onClick={() => analytics.phoneClick('footer')}
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 19,
                color: '#fff',
                marginBottom: 6,
              }}
            >
              {contact.phoneDisplay}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="lnk"
              style={{ fontSize: 14, color: 'var(--red-bright)' }}
              onClick={() => analytics.emailClick('footer')}
            >
              {contact.email}
            </a>
            <div
              style={{
                display: 'flex',
                gap: 20,
                marginTop: 20,
                fontSize: 11.5,
                fontWeight: 600,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--on-dark-muted)',
                flexWrap: 'wrap',
              }}
            >
              <span>US · New York</span>
              <span>PL · Częstochowa</span>
              <span>AT · Vienna</span>
            </div>
          </div>
        </div>

        {/* STRETCH worldwide — crawlable cross-domain links. Real anchors so
            every page gives Google a crawl path into each live sibling domain
            (hreflang alone passes no crawl signal). Visually quiet by design. */}
        <nav
          aria-label={t('worldwideHeading')}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: '8px 18px',
            paddingTop: 26,
            marginBottom: 4,
            borderTop: '1px solid rgba(255,255,255,.12)',
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--on-dark-muted)' }}>
            {t('worldwideHeading')}
          </span>
          {liveLocales
            .filter((l) => l !== locale)
            .map((l) => (
              <a
                key={l}
                href={`${originForLocale(l)}${path}`}
                hrefLang={localeFullCodes[l]}
                className="lnk"
                style={{ fontSize: 12.5, color: 'var(--on-dark-muted)' }}
              >
                {localeNames[l] ?? l}
              </a>
            ))}
        </nav>

        {/* Legal row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            paddingTop: 26,
          }}
        >
          <p style={{ fontSize: 12.5, color: 'var(--on-dark-muted)', margin: 0, letterSpacing: '.04em' }}>
            Copyright ©{year} {t('rights')}
          </p>
          <div style={{ display: 'flex', gap: 22, fontSize: 12.5, color: 'var(--on-dark-muted)', flexWrap: 'wrap' }}>
            {footerNav.legal.map((l) => (
              <Link key={l.href} href={l.href} className="lnk">
                {l.key === 'privacy' ? t('privacy') : t('terms')}
              </Link>
            ))}
            <button
              type="button"
              className="lnk"
              onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_BANNER_EVENT))}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                font: 'inherit',
                color: 'var(--on-dark-muted)',
                padding: 0,
              }}
            >
              {tc('manage')}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 860px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      {/* Not a document heading (fixes heading-order audit); brighter red
          for AA contrast of 11.5px text on the black footer. */}
      <p
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: 'var(--red-bright)',
          margin: '0 0 18px',
        }}
      >
        {heading}
      </p>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 11,
          fontSize: 14,
        }}
      >
        {children}
      </ul>
    </div>
  );
}
