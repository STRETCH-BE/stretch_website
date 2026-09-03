'use client';

// Microsoft Clarity. Gated on the ANALYTICS consent category: only injects the
// script once analytics consent is granted. Listens for live consent changes.
//
// Project IDs — one Clarity project per domain, added gradually:
//   NEXT_PUBLIC_CLARITY_ID_<LOCALE>  e.g. NEXT_PUBLIC_CLARITY_ID_BE for
//   stretchplafond.be. Falls back to NEXT_PUBLIC_CLARITY_ID (a catch-all
//   project for every domain without its own). No ID resolved → no-op.
// Statically enumerated because Next.js only inlines NEXT_PUBLIC_* vars it
// can see verbatim at build time (same pattern as localeDomains overrides).
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getConsent, CONSENT_UPDATE_EVENT, type ConsentPreferences } from '@/lib/consent';

const LOCALE_IDS: Record<string, string | undefined> = {
  en: process.env.NEXT_PUBLIC_CLARITY_ID_EN,
  uk: process.env.NEXT_PUBLIC_CLARITY_ID_UK,
  us: process.env.NEXT_PUBLIC_CLARITY_ID_US,
  be: process.env.NEXT_PUBLIC_CLARITY_ID_BE,
  nl: process.env.NEXT_PUBLIC_CLARITY_ID_NL,
  fr: process.env.NEXT_PUBLIC_CLARITY_ID_FR,
  pl: process.env.NEXT_PUBLIC_CLARITY_ID_PL,
  de: process.env.NEXT_PUBLIC_CLARITY_ID_DE,
  ch: process.env.NEXT_PUBLIC_CLARITY_ID_CH,
  'fr-ch': process.env.NEXT_PUBLIC_CLARITY_ID_CH, // same project: one Swiss domain
  es: process.env.NEXT_PUBLIC_CLARITY_ID_ES,
  pt: process.env.NEXT_PUBLIC_CLARITY_ID_PT,
  da: process.env.NEXT_PUBLIC_CLARITY_ID_DA,
  sv: process.env.NEXT_PUBLIC_CLARITY_ID_SV,
  no: process.env.NEXT_PUBLIC_CLARITY_ID_NO,
  is: process.env.NEXT_PUBLIC_CLARITY_ID_IS,
};
const FALLBACK_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function Clarity() {
  const locale = useLocale();
  const clarityId = LOCALE_IDS[locale] ?? FALLBACK_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(Boolean(getConsent()?.analytics));
    sync();
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<ConsentPreferences>).detail;
      setAllowed(Boolean(detail?.analytics ?? getConsent()?.analytics));
    };
    window.addEventListener(CONSENT_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(CONSENT_UPDATE_EVENT, onUpdate);
  }, []);

  useEffect(() => {
    if (!clarityId) return;
    if (!allowed) {
      // Consent revoked mid-session — stop the recording immediately. The
      // script stays loaded but inert; a page load without consent never
      // injects it in the first place.
      window.clarity?.('stop');
      return;
    }
    if (!document.getElementById('clarity-script')) {
      const s = document.createElement('script');
      s.id = 'clarity-script';
      s.type = 'text/javascript';
      s.async = true;
      s.innerHTML = `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `;
      document.head.appendChild(s);
    }
    // Clarity's consent API: confirms cookie consent (required when the
    // project has "Cookies consent required" enabled) and restarts a
    // recording that a mid-session revoke stopped.
    window.clarity?.('consent');
    window.clarity?.('start');
  }, [allowed, clarityId]);

  return null;
}
