// ============================================================================
// ROOT LAYOUT — <html> + <body>, the Archivo font variable, consent-mode
// defaults (synchronous, before any analytics), the analytics loaders and the
// cookie banner. Locale chrome (nav/footer) lives in the (pl) and /en
// layouts; the default <html lang> is Polish and the /en layout corrects it
// client-side (App Router allows only one root <html>).
// ============================================================================
import type { Metadata, Viewport } from 'next';
import { archivo } from '@/app/fonts';
import { ConsentModeDefaults, AnalyticsScripts } from '@/components/analytics';
import CookieConsent from '@/components/analytics/cookie-consent';
import { brand, siteUrl } from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.parentCompany}`,
    template: `%s`,
  },
  description: brand.description.pl,
  applicationName: brand.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={archivo.variable}>
      <head>
        <ConsentModeDefaults />
      </head>
      <body>
        {children}
        <AnalyticsScripts />
        <CookieConsent />
      </body>
    </html>
  );
}
