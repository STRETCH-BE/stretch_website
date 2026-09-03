import createMiddleware from 'next-intl/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing, localeDomains, isValidLocale, localeForHost, localesForDomain, localePathPrefix } from './i18n/config';

// next-intl middleware in DOMAIN mode: the Host header decides the locale
// (stretchplafond.nl → nl, stretchplafond.pl → pl, ...), and each domain
// serves clean, unprefixed URLs. On unknown hosts (localhost, Vercel
// previews) it falls back to path-prefixed routing so every locale remains
// reachable at /be, /fr, /pl, ... for development and QA.
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // PORTAL ON ONE HOST (NEXT_PUBLIC_PORTAL_HOST, production: stretch.mt):
  // any /portal path — with or without locale prefix — on another PRODUCTION
  // host 308s to the same portal path on the canonical host (en locale =
  // unprefixed there). localhost and *.vercel.app previews are never
  // redirected; unset env → feature off (zero-config).
  const portalHost = (process.env.NEXT_PUBLIC_PORTAL_HOST || '').toLowerCase().split(':')[0];
  if (portalHost) {
    const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0].replace(/^www\./, '');
    const isProductionHost = Object.values(localeDomains).some((d) => d.toLowerCase() === host);
    if (isProductionHost && host !== portalHost) {
      const { pathname, search } = request.nextUrl;
      const parts = pathname.split('/').filter(Boolean);
      const stripped = parts[0] && isValidLocale(parts[0]) ? `/${parts.slice(1).join('/')}` : pathname;
      if (stripped === '/portal' || stripped.startsWith('/portal/')) {
        return NextResponse.redirect(`https://${portalHost}${stripped}${search}`, 308);
      }
    }
  }

  // PATH-PREFIXED LOCALE on a shared domain (fr-ch on stretchdecken.ch/fr/):
  // next-intl only knows its own prefix (/fr-ch). Map the public prefix to it
  // before routing, and map any redirect target back, so the browser only
  // ever sees /fr/... — /fr-ch/... itself 308s to /fr/... in redirects.mjs.
  // Unknown hosts (localhost, previews) are untouched: there /fr-ch/... is
  // the way in and /fr/... stays the French locale.
  // Same host resolution as next-intl (x-forwarded-host first) so both agree behind a proxy.
  const hostLocale = localeForHost(request.headers.get('x-forwarded-host') ?? request.headers.get('host'));
  const prefixedLocale = hostLocale
    ? localesForDomain(localeDomains[hostLocale]).find((l) => localePathPrefix[l])
    : undefined;
  const publicPrefix = prefixedLocale ? localePathPrefix[prefixedLocale]! : '';
  let intlRequest = request;
  if (prefixedLocale) {
    const { pathname } = request.nextUrl;
    if (pathname === publicPrefix || pathname.startsWith(`${publicPrefix}/`)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${prefixedLocale}${pathname.slice(publicPrefix.length)}`;
      intlRequest = new NextRequest(url, { headers: request.headers, method: request.method });
    }
  }

  const response = intlMiddleware(intlRequest);

  if (prefixedLocale) {
    const location = response.headers.get('location');
    if (location) {
      const target = new URL(location, request.url);
      const internal = `/${prefixedLocale}`;
      if (target.pathname === internal || target.pathname.startsWith(`${internal}/`)) {
        target.pathname = `${publicPrefix}${target.pathname.slice(internal.length)}` || '/';
        response.headers.set('location', target.toString());
      }
    }
  }

  // CLIENT PORTAL — keep the Supabase auth session fresh on /portal routes.
  // Server Components cannot write cookies, so expired access tokens are
  // refreshed here, the only place where request AND response cookies are
  // both writable. This block no-ops when Supabase is not configured (the
  // portal then runs in demo mode) and on every non-portal route.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey && request.nextUrl.pathname.includes('/portal')) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    // Reading the user triggers a token refresh when needed.
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  // Match all pathnames except: api routes, Next internals, and files with an
  // extension (images, robots.txt override is handled by a route handler).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
