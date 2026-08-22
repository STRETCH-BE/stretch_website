'use client';

// Mobile navigation drawer (shown below 860px via the .only-mobile helper).
// Full-screen overlay with the nav links, product list, a quote CTA and the
// country/language grid (the desktop switcher lives in the .only-desktop
// utility bar, so this is the ONLY way to change language on a phone).
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { products } from '@/lib/products';
import { contact } from '@/lib/site-config';
import {
  locales,
  localeNames,
  localeFlags,
  localeForHost,
  originForLocale,
  type Locale,
} from '@/i18n/config';
import { useLeadModal } from '@/components/LeadGenModal';
import PortalLink from '@/components/ui/PortalLink';
import { analytics } from '@/lib/analytics';

// Shared style for the primary drawer links (Link and PortalLink render alike).
const drawerLinkStyle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: 26,
  textTransform: 'uppercase',
  letterSpacing: '-.02em',
  padding: '13px 0',
  borderBottom: '1px solid var(--border)',
} as const;

export default function MobileMenu() {
  const t = useTranslations('common');
  const tc = useTranslations('catalog');
  const tb = useTranslations('blogPage');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { open: openModal } = useLeadModal();
  const [open, setOpen] = useState(false);

  // Cross-domain language switch — same logic as the desktop LanguageSwitcher:
  // on a known locale domain, jump to the target locale's domain preserving
  // the path; on localhost/previews, fall back to the in-app locale switch.
  function switchTo(next: Locale) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    analytics.languageSwitch(locale, next, pathname);
    const onKnownDomain =
      typeof window !== 'undefined' && localeForHost(window.location.host) !== null;
    if (onKnownDomain) {
      const search = window.location.search || '';
      window.location.assign(`${originForLocale(next)}${pathname === '/' ? '' : pathname}${search}`);
      return;
    }
    setOpen(false);
    router.replace(pathname, { locale: next });
  }

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    // No inline display here: it would override the .only-mobile media query
    // (inline styles beat class rules), hiding the burger on phones too.
    <div className="only-mobile">
      <button
        type="button"
        aria-label={t('openMenu')}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 6,
          display: 'flex',
          color: 'var(--black)',
        }}
      >
        <Menu size={26} />
      </button>

      {/* Portal: the header's backdrop-filter makes it the containing block
          for fixed descendants, which would clip this "full-screen" drawer to
          the header's 120px box. Rendering on <body> escapes that. Client-only
          by construction (open is only ever set after a click). */}
      {open && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <div
            className="container"
            style={{
              height: 'var(--header-h)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 24,
                  letterSpacing: '-.02em',
                }}
              >
                STRETCH
              </span>
              <span style={{ color: 'var(--red)', fontWeight: 900, fontSize: 14 }}>®</span>
            </span>
            <button
              type="button"
              aria-label={t('closeMenu')}
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}
            >
              <X size={26} />
            </button>
          </div>

          <nav
            className="container"
            style={{ paddingTop: 28, paddingBottom: 28, display: 'flex', flexDirection: 'column' }}
          >
            {[
              { href: '/products', label: t('nav.solutions') },
              { href: '/materials', label: t('nav.materials') },
              { href: '/inspiration', label: t('nav.inspiration') },
              { href: '/partners', label: t('nav.partners') },
              { href: '/installer-training', label: t('nav.training') },
              { href: '/architects', label: t('nav.architects') },
              { href: '/faq', label: t('nav.faq') },
              { href: '/about', label: t('nav.about') },
              { href: '/contact', label: t('nav.contact') },
              { href: '/portal', label: t('nav.clientLogin') },
            ].map((item) =>
              item.href === '/portal' ? (
                <PortalLink key={item.href} href={item.href} style={drawerLinkStyle}>
                  {item.label}
                </PortalLink>
              ) : (
                <Link key={item.href} href={item.href} style={drawerLinkStyle}>
                  {item.label}
                </Link>
              ),
            )}

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--text-faint-2)',
                margin: '26px 0 12px',
              }}
            >
              {t('nav.allSolutions')}
            </div>
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                style={{ padding: '9px 0', fontSize: 15, fontWeight: 600, color: 'var(--text-muted)' }}
              >
                {tc(`${p.key}.name`)}
              </Link>
            ))}

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--text-faint-2)',
                margin: '26px 0 12px',
              }}
            >
              {t('nav.technical')}
            </div>
            {[
              { href: '/samples', label: t('cta.requestSamples') },
              { href: '/blog', label: tb('eyebrow') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ padding: '9px 0', fontSize: 15, fontWeight: 600, color: 'var(--text-muted)' }}
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              className="btn btn--primary"
              style={{ marginTop: 28, justifyContent: 'center' }}
              onClick={() => {
                setOpen(false);
                analytics.quoteClick(undefined, 'mobile_menu');
                openModal('quote', { source: 'mobile_menu' });
              }}
            >
              {t('cta.requestQuote')} <ArrowUpRight size={16} />
            </button>
            <a
              href={contact.phoneHref}
              onClick={() => analytics.phoneClick('mobile_menu')}
              style={{
                marginTop: 18,
                textAlign: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 20,
                color: 'var(--black)',
              }}
            >
              {contact.phoneDisplay}
            </a>

            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'var(--text-faint-2)',
                margin: '34px 0 12px',
              }}
            >
              {t('languageLabel')}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                background: 'var(--border)',
                border: '1px solid var(--border)',
              }}
            >
              {locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => switchTo(l)}
                  aria-current={l === locale ? 'true' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: l === locale ? 'var(--surface)' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '12px 12px',
                    fontSize: 14,
                    fontWeight: l === locale ? 700 : 500,
                    color: l === locale ? 'var(--red)' : 'var(--text)',
                    textAlign: 'left',
                  }}
                >
                  <span aria-hidden>{localeFlags[l]}</span>
                  {localeNames[l] ?? l}
                </button>
              ))}
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}
