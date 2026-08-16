'use client';

// Site navigation — sticky dark bar: logo left, routes + language switcher +
// the primary RFQ CTA right; hamburger overlay on mobile. Locale-aware via
// props (each locale layout passes its own chrome content).
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/logo';
import TrackedCta from '@/components/ui/tracked-cta';
import { analytics } from '@/lib/analytics';
import { path, switchLocalePath, type Locale } from '@/lib/i18n-routes';
import type { ChromeContent } from '@/content/types';

export default function Nav({ locale, chrome }: { locale: Locale; chrome: ChromeContent }) {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const otherLocale: Locale = locale === 'pl' ? 'en' : 'pl';
  const switchHref = switchLocalePath(pathname, otherLocale);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const langSwitch = (
    <Link
      href={switchHref}
      className="lnk text-[12.5px] font-bold uppercase tracking-[0.14em] text-on-dark-soft"
      aria-label={chrome.nav.langLabel}
      onClick={() => analytics.languageSwitch(locale, otherLocale, pathname)}
    >
      {otherLocale === 'pl' ? 'PL' : 'EN'}
    </Link>
  );

  return (
    <header className="sticky top-0 z-[80] border-b border-line-dark bg-black text-white">
      <div className="container-sm flex h-[72px] items-center justify-between gap-6">
        <Logo locale={locale} />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center gap-7 min-[1000px]:flex">
          {chrome.nav.items.map((item) => {
            const href = path(item.route, locale);
            const active = pathname === href || (href !== path('home', locale) && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={item.route}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`lnk text-[13px] font-bold uppercase tracking-[0.1em] ${
                  active ? 'text-red-bright' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 min-[1000px]:flex">
          {langSwitch}
          <TrackedCta href={path('rfq', locale)} cta="nav" location="nav" rfq size="sm">
            {chrome.nav.cta}
          </TrackedCta>
        </div>

        {/* Mobile: language + burger */}
        <div className="flex items-center gap-5 min-[1000px]:hidden">
          {langSwitch}
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? chrome.nav.menuClose : chrome.nav.menuOpen}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`block h-[2px] w-6 bg-white transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-[2px] w-6 bg-white ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-6 bg-white transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-[75] overflow-y-auto bg-black min-[1000px]:hidden">
          <nav aria-label="Main mobile" className="container-sm flex flex-col py-8">
            {chrome.nav.items.map((item, i) => (
              <Link
                key={item.route}
                href={path(item.route, locale)}
                className="wdth-125 border-b border-line-dark py-5 text-[22px] font-black uppercase text-white"
              >
                <span className="mr-3 text-[13px] font-bold text-red-bright">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.label}
              </Link>
            ))}
            <div className="pt-8">
              <TrackedCta href={path('rfq', locale)} cta="nav-mobile" location="nav-mobile" rfq size="lg">
                {chrome.nav.cta}
              </TrackedCta>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
