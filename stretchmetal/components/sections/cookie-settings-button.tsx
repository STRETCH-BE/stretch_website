'use client';

// Footer link that reopens the consent banner (GDPR: consent must be as easy
// to withdraw as to give). Dispatches the event the banner listens for.
import { CONSENT_OPEN_BANNER_EVENT } from '@/lib/consent';
import type { Locale } from '@/lib/i18n-routes';

export default function CookieSettingsButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      className="lnk cursor-pointer text-[12.5px] text-on-dark-muted"
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_OPEN_BANNER_EVENT))}
    >
      {locale === 'pl' ? 'Ustawienia cookies' : 'Cookie settings'}
    </button>
  );
}
