// Next.js configuration. Kept deliberately minimal — the site is a static-ish
// marketing site with one API route; no rewrites, no experimental flags.
// `outputFileTracingRoot` pins file tracing to this package: the repository
// root also contains the STRETCH group site (its own package.json/lockfile),
// and without the pin Next would warn about multiple lockfiles and trace from
// the wrong root.
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // No remote image hosts yet — all imagery is local (placeholders until the
  // workshop photo shoot). Add remotePatterns here if a CDN is introduced.
};

export default nextConfig;
