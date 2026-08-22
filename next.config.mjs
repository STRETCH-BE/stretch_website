import createNextIntlPlugin from 'next-intl/plugin';
import { legacyRedirects } from './redirects.mjs';

// Point the plugin at the i18n request config (getMessages, etc.)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Ship the private datasheet PDFs inside the download route's serverless
    // bundle — they live outside public/ on purpose (gated, signed links only).
    outputFileTracingIncludes: {
      '/api/datasheet/[slug]': ['./datasheets-private/**/*'],
      '/api/architect/datasheet/[slug]': ['./datasheets-private/**/*'],
      '/api/architect/file/[slug]': ['./architect-private/**/*'],
      // Restricted trade documents get their OWN folder so the ~20 MB
      // installation guide is bundled into this route only — not into the
      // three public/architect datasheet routes above.
      '/api/portal/document/[slug]': ['./installer-private/**/*'],
    },
  },
  // styled-jsx is bundled with Next.js — no extra config needed.
  images: {
    // Serve modern formats first; Next falls back automatically.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // One locale per domain — allow next/image to load assets referenced by
      // absolute URL from any of the production domains. Keep in sync with
      // `localeDomains` in src/i18n/config.ts.
      { protocol: 'https', hostname: 'stretch.mt' },
      { protocol: 'https', hostname: 'stretch-ceilings.uk' },
      { protocol: 'https', hostname: 'stretchplafond.be' },
      { protocol: 'https', hostname: 'stretchplafond.nl' },
      { protocol: 'https', hostname: 'stretchplafond.fr' },
      { protocol: 'https', hostname: 'stretch-sufit.pl' },
      { protocol: 'https', hostname: 'stretchdecken.de' },
      { protocol: 'https', hostname: 'stretchtecho.es' },
      { protocol: 'https', hostname: 'stretchteto.pt' },
      { protocol: 'https', hostname: 'straekloft.dk' },
      { protocol: 'https', hostname: 'stretchceilings.se' },
      { protocol: 'https', hostname: 'stretchtak.no' },
      { protocol: 'https', hostname: 'stretch.is' },
    ],
  },
  async headers() {
    return [
      {
        // Long-cache the immutable OG image responses.
        source: '/api/og/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return legacyRedirects;
  },
};

export default withNextIntl(nextConfig);
