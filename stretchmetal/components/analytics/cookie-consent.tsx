'use client';

// Cookie consent banner — equal Accept/Reject buttons (no dark patterns), an
// optional per-category settings view, locale-aware via the pathname. Hidden
// once a decision is stored; the footer's "Cookie settings" link reopens it
// by dispatching CONSENT_OPEN_BANNER_EVENT.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CONSENT_OPEN_BANNER_EVENT,
  hasConsentDecision,
  getConsent,
  setConsent,
} from '@/lib/consent';
import { getContent } from '@/content';
import { localeForPath, path } from '@/lib/i18n-routes';

export default function CookieConsent() {
  const pathname = usePathname();
  const locale = localeForPath(pathname ?? '/');
  const t = getContent(locale).chrome.consent;

  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const [marketingOn, setMarketingOn] = useState(false);

  useEffect(() => {
    setVisible(!hasConsentDecision());
    const onOpen = () => {
      const current = getConsent();
      if (current) {
        setAnalyticsOn(current.analytics);
        setMarketingOn(current.marketing);
      }
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_BANNER_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_BANNER_EVENT, onOpen);
  }, []);

  if (!visible) return null;

  const decide = (analytics: boolean, marketing: boolean) => {
    setConsent({ analytics, marketing });
    setVisible(false);
    setShowSettings(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.heading}
      className="fixed inset-x-0 bottom-0 z-[90] border-t-2 border-red bg-black text-white"
    >
      <div className="container-sm py-5">
        <p className="wdth-125 text-[13px] font-black uppercase tracking-[0.08em]">{t.heading}</p>
        <p className="mt-2 max-w-[720px] text-[13.5px] leading-relaxed text-on-dark-soft">
          {t.text}{' '}
          <Link href={path('cookies', locale)} className="underline">
            {t.privacyLink}
          </Link>
        </p>

        {showSettings ? (
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex items-start gap-3 text-[13.5px]">
              <input
                type="checkbox"
                checked={analyticsOn}
                onChange={(e) => setAnalyticsOn(e.target.checked)}
                className="mt-[3px] h-4 w-4 accent-red"
              />
              <span>
                <strong className="font-bold">{t.analyticsLabel}</strong>
                <span className="block text-on-dark-muted">{t.analyticsText}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-[13.5px]">
              <input
                type="checkbox"
                checked={marketingOn}
                onChange={(e) => setMarketingOn(e.target.checked)}
                className="mt-[3px] h-4 w-4 accent-red"
              />
              <span>
                <strong className="font-bold">{t.marketingLabel}</strong>
                <span className="block text-on-dark-muted">{t.marketingText}</span>
              </span>
            </label>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          {showSettings ? (
            <button
              type="button"
              className="btn btn--sm btn--primary"
              onClick={() => decide(analyticsOn, marketingOn)}
            >
              {t.save}
            </button>
          ) : (
            <>
              <button type="button" className="btn btn--sm btn--primary" onClick={() => decide(true, true)}>
                {t.accept}
              </button>
              <button
                type="button"
                className="btn btn--sm btn--ghost-light"
                onClick={() => decide(false, false)}
              >
                {t.reject}
              </button>
              <button
                type="button"
                className="btn btn--sm btn--ghost-light"
                onClick={() => setShowSettings(true)}
              >
                {t.settings}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
