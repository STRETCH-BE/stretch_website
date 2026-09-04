// CLIENT PORTAL — serves the acoustic (reverberation-time) calculator app
// (single-file HTML) to signed-in portal users only. It carries no pricing,
// but it is a portal feature: it ships as a base64 module and is decoded per
// request, never from /public. Rendered inside an <iframe> on
// /portal/acoustics. Access: hasAcousticsAccess (every signed-in account).
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasAcousticsAccess } from '@/lib/portal/types';
import { ACOUSTIC_HTML_B64 } from '@/lib/portal/acoustic-html';
import { isPortalAllowedHost } from '@/lib/portal/host';
import { isValidLocale } from '@/i18n/config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const session = await getPortalSession();
  if (!session) {
    return NextResponse.redirect(new URL('/portal/login', request.url));
  }
  if (!hasAcousticsAccess(session.profile)) {
    return NextResponse.redirect(new URL('/portal', request.url));
  }
  // Inject the signed-in profile so the PORTAL BRIDGE can label the toolbar
  // ("Signed in as …") without an extra round-trip. Never include role/markets.
  const portalUser = JSON.stringify({
    email: session.profile.email,
    company: session.profile.company,
    demo: session.demo,
  }).replace(/</g, '\\u003c');
  // The page passes its locale (?locale=…); the tool maps it to the report
  // language (be, nl → nl; everything else → en). ?lang= inside the tool still
  // overrides. Anything that is not one of our locales falls back to en.
  const rawLocale = request.nextUrl.searchParams.get('locale') ?? '';
  const portalLocale = JSON.stringify(isValidLocale(rawLocale) ? rawLocale : 'en').replace(/</g, '\\u003c');
  const html = Buffer.from(ACOUSTIC_HTML_B64, 'base64')
    .toString('utf8')
    .replace('</head>', `<script>window.PORTAL_USER=${portalUser};window.PORTAL_LOCALE=${portalLocale};</script></head>`);
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      // the calculator is only meant to be embedded by our own portal page
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
