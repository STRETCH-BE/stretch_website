'use client';

// Sticky site header: black utility bar (reseller/training/phone/language) + a
// white nav row. Solutions and Technical each open a rich three-panel mega menu
// (see MegaMenu). "Free quote" opens the lead modal.
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { localContactFor } from '@/lib/local-contact';
import { isDealerMarket } from '@/lib/dealers';
import type { Locale } from '@/i18n/config';
import { ModalButton } from '@/components/ui/ModalButton';
import PortalLink from '@/components/ui/PortalLink';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import MegaMenu, { useSolutionsMenu, useTechnicalMenu } from './MegaMenu';
import { analytics } from '@/lib/analytics';

type OpenMenu = 'solutions' | 'technical' | null;

export default function Header() {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  // Primary-nav density: Polish (8 items, "Szkolenia") and Icelandic
  // ("Algengar spurningar", "Samstarfsaðilar") labels are far longer than the
  // others and overlapped the logo and the CTA. The nav tightens its
  // font-size and gaps by total label length (globals.css, [data-nav]).
  const navChars = [t('nav.solutions'), t('nav.technical'), ...(locale === 'pl' ? [t('nav.training')] : []), t('nav.materials'), t('nav.inspiration'), t('nav.partners'), t('nav.faq'), t('nav.contact')].join('').length;
  const navDensity = navChars > 72 ? 'x-dense' : navChars > 60 ? 'dense' : 'normal';
  const solutionsMenu = useSolutionsMenu();
  const technicalMenu = useTechnicalMenu();
  const pathname = usePathname();
  const [open, setOpen] = useState<OpenMenu>(null);
  // ch: QuinLay AG's number (the Swiss general representative) instead of the Belgian HQ.
  const local = localContactFor(locale);

  // Close any open mega menu whenever the route changes.
  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  const close = () => setOpen(null);

  return (
    <header
      onMouseLeave={close}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        background: 'rgba(255,255,255,.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
      }}
     data-nav={navDensity}>
      {/* Utility bar */}
      <div style={{ background: 'var(--black)', color: '#fff' }}>
        <div className="container" style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Tagline truncates (ellipsis) instead of wrapping the 42px bar; the
              utility links never wrap (hdr-util / hdr-tag in globals.css). */}
          <div className="hdr-tag" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, background: 'var(--red)', display: 'inline-block', flexShrink: 0 }} />
            <span className="hdr-tag__text">{t('handMadeInBelgium')}</span>
          </div>
          <div className="only-desktop hdr-util" style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 11.5, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            <Link href="/partners" className="lnk">{t('nav.reseller')}</Link>
            {/* Training only exists on dealer markets (N2) — no dead link on us. */}
            {isDealerMarket(locale) && locale !== 'pl' && (
              <Link href="/installer-training" className="lnk">{t('nav.training')}</Link>
            )}
            <PortalLink href="/portal" className="lnk">{t('nav.clientLogin')}</PortalLink>
            <span style={{ opacity: 0.4 }}>|</span>
            {/* pl: Alto Design's domestic-projects line, labelled (label hidden ≤1280px, globals.css). */}
            {local.phoneLine && (
              <span className="hdr-phone-label" style={{ color: 'var(--on-dark-muted)' }}>{t(`plContact.lines.${local.phoneLine}`)}</span>
            )}
            <a href={local.phoneHref} className="lnk" style={{ color: 'var(--red-bright)' }} {...(local.phoneLine ? { 'aria-label': t(`plContact.call.${local.phoneLine}`) } : {})} onClick={() => analytics.phoneClick('header_utility')}>
              {local.phoneDisplay}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container" style={{ height: 'var(--header-h)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" aria-label="STRETCH — home" onMouseEnter={close} style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 27, letterSpacing: '-.02em', color: 'var(--black)' }}>STRETCH</span>
          <span style={{ color: 'var(--red)', fontWeight: 900, fontSize: 16 }}>®</span>
        </Link>

        <nav className="only-desktop hdr-nav" aria-label="Primary" style={{ display: 'flex', alignItems: 'center', fontWeight: 600, textTransform: 'uppercase' }}>
          <NavDrop label={t('nav.solutions')} href="/products" active={open === 'solutions'} onEnter={() => setOpen('solutions')} />
          <NavDrop label={t('nav.technical')} href="/products" active={open === 'technical'} onEnter={() => setOpen('technical')} />
          {/* Poland: the academy is the differentiator — installer training is a
              PRIMARY nav item on stretch-sufit.pl (per-market audit, T7). */}
          {locale === 'pl' && (
            <Link href="/installer-training" className="lnk" onMouseEnter={close}>{t('nav.training')}</Link>
          )}
          <Link href="/materials" className="lnk" onMouseEnter={close}>{t('nav.materials')}</Link>
          <Link href="/inspiration" className="lnk" onMouseEnter={close}>{t('nav.inspiration')}</Link>
          <Link href="/partners" className="lnk" onMouseEnter={close}>{t('nav.partners')}</Link>
          <Link href="/faq" className="lnk" onMouseEnter={close}>{t('nav.faq')}</Link>
          <Link href="/contact" className="lnk" onMouseEnter={close}>{t('nav.contact')}</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <ModalButton type="quote" source="header" trackQuote className="btn btn--primary btn--sm only-desktop">
            {t('cta.freeQuote')} <ArrowUpRight size={14} />
          </ModalButton>
          <MobileMenu />
        </div>
      </div>

      {/* Mega menus */}
      {open && (
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
          <MegaMenu config={open === 'solutions' ? solutionsMenu : technicalMenu} onNavigate={close} />
        </div>
      )}
    </header>
  );
}

// Nav item that is both a link (to its overview) and a mega-menu trigger on hover.
function NavDrop({ label, href, active, onEnter }: { label: string; href: string; active: boolean; onEnter: () => void }) {
  return (
    <div
      onMouseEnter={onEnter}
      style={{ display: 'flex', alignItems: 'center', gap: 6, height: 'var(--header-h)', cursor: 'pointer', color: active ? 'var(--red)' : 'var(--black)' }}
    >
      <Link href={href} className="lnk" aria-expanded={active} style={{ color: 'inherit' }}>
        {label}
      </Link>
      <ChevronDown size={13} style={{ transition: 'transform .2s', transform: active ? 'rotate(180deg)' : 'none', color: active ? 'var(--red)' : 'var(--text-faint-2)' }} />
    </div>
  );
}
