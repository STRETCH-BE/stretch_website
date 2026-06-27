import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/config';

// next-intl middleware: handles locale detection + redirects to the prefixed
// route (localePrefix: 'always').
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except: api routes, Next internals, and files with an
  // extension (images, robots.txt, sitemap.xml, llms.txt, favicon, etc.).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
