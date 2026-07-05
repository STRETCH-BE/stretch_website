import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/config';

// next-intl middleware in DOMAIN mode: the Host header decides the locale
// (stretchplafond.nl → nl, stretchplafond.pl → pl, ...), and each domain
// serves clean, unprefixed URLs. On unknown hosts (localhost, Vercel
// previews) it falls back to path-prefixed routing so every locale remains
// reachable at /be, /fr, /pl, ... for development and QA.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except: api routes, Next internals, and files with an
  // extension (images, robots.txt override is handled by a route handler).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
