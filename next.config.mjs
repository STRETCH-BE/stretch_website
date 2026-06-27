import createNextIntlPlugin from 'next-intl/plugin';

// Point the plugin at the i18n request config (getMessages, etc.)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // styled-jsx is bundled with Next.js — no extra config needed.
  images: {
    // Serve modern formats first; Next falls back automatically.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add the production image origin here if assets are served off-domain.
      { protocol: 'https', hostname: 'stretchplafond.be' },
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
};

export default withNextIntl(nextConfig);
