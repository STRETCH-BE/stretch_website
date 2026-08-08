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
      { protocol: 'https', hostname: 'stretchplafond.com' },
      { protocol: 'https', hostname: 'stretchplafond.be' },
      { protocol: 'https', hostname: 'stretchplafond.nl' },
      { protocol: 'https', hostname: 'stretchplafond.fr' },
      { protocol: 'https', hostname: 'stretchplafond.pl' },
      { protocol: 'https', hostname: 'stretchplafond.de' },
      { protocol: 'https', hostname: 'stretchplafond.es' },
      { protocol: 'https', hostname: 'stretchplafond.pt' },
      { protocol: 'https', hostname: 'stretchplafond.dk' },
      { protocol: 'https', hostname: 'stretchplafond.se' },
      { protocol: 'https', hostname: 'stretchplafond.no' },
      { protocol: 'https', hostname: 'stretchplafond.is' },
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
