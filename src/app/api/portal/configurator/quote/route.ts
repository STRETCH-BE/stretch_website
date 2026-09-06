// /api/portal/configurator/quote — price a configuration.
//   GET  → the active option catalogue the form needs (no prices)
//   POST → a configuration in, a priced bill of materials out
//
// Installers and admins only, enforced HERE as well as on the page: a hidden
// nav item is not access control. The body carries dimensions and slugs only —
// every price is resolved server-side from the account's own pricebook rows.
import { NextRequest, NextResponse } from 'next/server';
import { getPortalSession } from '@/lib/portal/auth';
import { hasConfiguratorAccess, configuratorMarket } from '@/lib/portal/types';
import { isPortalAllowedHost } from '@/lib/portal/host';
import { loadOptions } from '@/lib/portal/configurator/options';
import { parseConfig } from '@/lib/portal/configurator/parse-config';
import { quoteFor } from '@/lib/portal/configurator/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 20_000;

async function guard(request: NextRequest | Request) {
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return { error: NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 }) };
  }
  const session = await getPortalSession();
  if (!session) return { error: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }) };
  if (!hasConfiguratorAccess(session.profile))
    return { error: NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 }) };
  return { session };
}

/** The catalogue the form renders from. Labels and rules only — no prices. */
export async function GET(request: NextRequest) {
  const { session, error } = await guard(request);
  if (error) return error;

  // Resolved once: the "no catalogue yet" answer must carry the same market
  // and the same selector flag as the ready one, or the UI loses both.
  const market = configuratorMarket(session!.profile, request.nextUrl.searchParams.get('market'));
  const canChooseMarket = session!.profile.role === 'admin' || session!.profile.allMarkets;

  const options = await loadOptions({ activeOnly: true });
  if (!options) {
    return NextResponse.json({ ok: true, ready: false, options: [], market, canChooseMarket });
  }
  return NextResponse.json({
    ok: true,
    ready: options.length > 0,
    market,
    canChooseMarket,
    options: options.map((o) => ({
      kind: o.kind,
      slug: o.slug,
      label: o.label,
      material: o.material,
      finish: o.finish,
      colourGroup: o.colourGroup,
      fabricKind: o.fabricKind,
      maxWidthCm: o.maxWidthCm,
      qtyRule: o.qtyRule,
      companionSlug: o.companionSlug,
    })),
  });
}

export async function POST(request: NextRequest) {
  const { session, error } = await guard(request);
  if (error) return error;

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES)
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const parsed = parseConfig(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });

  const requestedMarket =
    body && typeof body === 'object' ? (body as Record<string, unknown>).market : null;
  const result = await quoteFor(session!, parsed.config, typeof requestedMarket === 'string' ? requestedMarket : null);
  if ('error' in result) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }
  return NextResponse.json({ ok: true, quote: result.quote });
}
