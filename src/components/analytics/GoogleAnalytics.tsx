'use client';

// GA4 loader. Loads gtag.js on EVERY page regardless of consent — Consent Mode
// v2 (set in ConsentModeDefaults) gates whether cookies/identifiers are used.
//
// Measurement IDs — one GA4 web stream per domain:
//   NEXT_PUBLIC_GA_ID_<LOCALE>  e.g. NEXT_PUBLIC_GA_ID_BE for
//   stretchplafond.be. Falls back to NEXT_PUBLIC_GA_ID for any domain
//   without its own stream. No ID resolved → renders nothing.
// Statically enumerated because Next.js only inlines NEXT_PUBLIC_* vars it
// can see verbatim at build time (same pattern as the Clarity loader).
import Script from 'next/script';
import { useLocale } from 'next-intl';

const LOCALE_IDS: Record<string, string | undefined> = {
  en: process.env.NEXT_PUBLIC_GA_ID_EN,
  be: process.env.NEXT_PUBLIC_GA_ID_BE,
  nl: process.env.NEXT_PUBLIC_GA_ID_NL,
  fr: process.env.NEXT_PUBLIC_GA_ID_FR,
  pl: process.env.NEXT_PUBLIC_GA_ID_PL,
  de: process.env.NEXT_PUBLIC_GA_ID_DE,
  es: process.env.NEXT_PUBLIC_GA_ID_ES,
  pt: process.env.NEXT_PUBLIC_GA_ID_PT,
  da: process.env.NEXT_PUBLIC_GA_ID_DA,
  sv: process.env.NEXT_PUBLIC_GA_ID_SV,
  no: process.env.NEXT_PUBLIC_GA_ID_NO,
  is: process.env.NEXT_PUBLIC_GA_ID_IS,
};
const FALLBACK_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  const locale = useLocale();
  const gaId = LOCALE_IDS[locale] ?? FALLBACK_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
