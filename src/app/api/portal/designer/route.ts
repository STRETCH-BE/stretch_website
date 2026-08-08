// CLIENT PORTAL — serves the ceiling designer app (single-file HTML) to
// signed-in portal users only. The app embeds the Stretch price matrix, so it
// must never be publicly reachable; it ships as a base64 module and is
// decoded per request. Rendered inside an <iframe> on /portal/designer.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { DESIGNER_HTML_B64 } from '@/lib/portal/designer-html';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.redirect(new URL('/portal/login', request.url));
  }
  // The designer embeds the trade price matrix — b2b/admin accounts only.
  if (!hasTradeAccess(session.profile)) {
    return NextResponse.redirect(new URL('/portal', request.url));
  }
  // Inject the signed-in profile so the PortalBridge can label the order UI
  // ("Ordering as …") without an extra round-trip. Never include role/markets.
  const portalUser = JSON.stringify({
    email: session.profile.email,
    company: session.profile.company,
    demo: session.demo,
  }).replace(/</g, '\\u003c');
  const html = Buffer.from(DESIGNER_HTML_B64, 'base64')
    .toString('utf8')
    .replace('</head>', `<script>window.PORTAL_USER=${portalUser};</script></head>`);
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      // the designer is only meant to be embedded by our own portal page
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
