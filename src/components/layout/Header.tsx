'use client';

// Sticky site header: black utility bar (reseller/training/phone/language) + a
// white nav row with a Solutions dropdown listing the five products. "Free
// quote" opens the lead modal. The mockup's separate "Technical" mega-menu is
// folded into the product spec sections + FAQ (see CHANGES.md — Nav).
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ChevronDown, ArrowUpRight, Phone } from 'lucide-react';
import { products } from '@/lib/products';
import { contact } from '@/lib/site-config';
import { ModalButton } from '@/components/ui/ModalButton';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import { analytics } from '@/lib/analytics';

export default function Header() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [solOpen, setSolOpen] = useState(false);

  // Close the dropdown whenever the route changes.
  useEffect(() => {
    setSolOpen(false);
  }, [pathname]);

  return (
    <header
      onMouseLeave={() => setSolOpen(false)}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        background: 'rgba(255,255,255,.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Utility bar */}
      <div style={{ background: 'var(--black)', color: '#fff' }}>
        <div
          className="container"
          style={{
            height: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 11.5,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            <span style={{ width: 8, height: 8, background: 'var(--red)', display: 'inline-block' }} />
            <span>{t('handMadeInBelgium')}</span>
          </div>
          <div
            className="only-desktop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              fontSize: 11.5,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            <Link href="/partners" className="lnk">
              {t('nav.reseller')}
            </Link>
            <Link href="/installer-training" className="lnk">
              {t('nav.training')}
            </Link>
            <span style={{ opacity: 0.4 }}>|</span>
            <a
              href={contact.phoneHref}
              className="lnk"
              style={{ color: 'var(--red)' }}
              onClick={() => analytics.phoneClick('header_utility')}
            >
              {contact.phoneDisplay}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="container"
        style={{
          height: 'var(--header-h)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" aria-label="STRETCH — home" style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 27,
              letterSpacing: '-.02em',
              color: 'var(--black)',
            }}
          >
            STRETCH
          </span>
          <span style={{ color: 'var(--red)', fontWeight: 900, fontSize: 16 }}>®</span>
        </Link>

        <nav
          className="only-desktop"
          aria-label="Primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            fontSize: 13.5,
            fontWeight: 600,
            letterSpacing: '.03em',
            textTransform: 'uppercase',
          }}
        >
          <div
            onMouseEnter={() => setSolOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 'var(--header-h)',
              cursor: 'pointer',
              color: solOpen ? 'var(--red)' : 'var(--black)',
            }}
          >
            <Link href="/products" className="lnk">
              {t('nav.solutions')}
            </Link>
            <ChevronDown
              size={13}
              style={{
                transition: 'transform .2s',
                transform: solOpen ? 'rotate(180deg)' : 'none',
                color: solOpen ? 'var(--red)' : 'var(--text-faint-2)',
              }}
            />
          </div>
          <Link href="/inspiration" className="lnk" onMouseEnter={() => setSolOpen(false)}>
            {t('nav.inspiration')}
          </Link>
          <Link href="/partners" className="lnk" onMouseEnter={() => setSolOpen(false)}>
            {t('nav.partners')}
          </Link>
          <Link href="/faq" className="lnk" onMouseEnter={() => setSolOpen(false)}>
            {t('nav.faq')}
          </Link>
          <Link href="/contact" className="lnk" onMouseEnter={() => setSolOpen(false)}>
            {t('nav.contact')}
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <ModalButton
            type="quote"
            source="header"
            trackQuote
            className="btn btn--primary btn--sm only-desktop"
          >
            {t('cta.freeQuote')} <ArrowUpRight size={15} />
          </ModalButton>
          <MobileMenu />
        </div>
      </div>

      {/* Solutions dropdown */}
      {solOpen && (
        <div
          className="only-desktop"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            background: '#fff',
            borderTop: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 60,
          }}
        >
          <div
            className="container"
            style={{
              padding: 'clamp(22px,2.6vw,34px) var(--gutter)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) 320px',
              gap: 'clamp(20px,2.6vw,48px)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: 'var(--red)',
                  padding: '2px 0 16px',
                }}
              >
                {t('nav.allSolutions')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 28px' }}>
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="megaitem"
                    style={{
                      display: 'block',
                      padding: '14px 0',
                      borderBottom: '1px solid #f1efeb',
                    }}
                  >
                    <div
                      className="megaitem-t"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 16,
                        letterSpacing: '-.01em',
                        color: 'var(--black)',
                      }}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 3 }}>
                      {p.category}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                minHeight: 240,
                background: 'var(--black)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 26,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: 'var(--red)',
                }}
              >
                {t('handMadeInBelgium')}
              </div>
              <div>
                <div
                  style={{
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 22,
                    lineHeight: 1.05,
                    marginBottom: 10,
                  }}
                >
                  A new ceiling in one day
                </div>
                <ModalButton
                  type="quote"
                  source="header_dropdown"
                  trackQuote
                  className=""
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: '.07em',
                    textTransform: 'uppercase',
                    borderBottom: '2px solid var(--red)',
                    paddingBottom: 3,
                    cursor: 'pointer',
                  }}
                >
                  {t('cta.requestQuote')} <span style={{ color: 'var(--red)' }}>→</span>
                </ModalButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <a href={contact.phoneHref} className="only-mobile" style={{ display: 'none' }} aria-hidden>
        <Phone size={1} />
      </a>

      <style jsx global>{`
        .megaitem {
          transition: transform 0.15s ease;
        }
        .megaitem:hover {
          transform: translateX(4px);
        }
        .megaitem:hover .megaitem-t {
          color: var(--red);
        }
      `}</style>
    </header>
  );
}
