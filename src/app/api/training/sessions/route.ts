// GET /api/training/sessions?locale=xx — the training view for a locale, for a
// booking form opened on a page that did not pass it (header, footer, portal).
// Returns buildTrainingView(): formatted labels, choices and interest state —
// never the internal note column (the loader does not even select it).
import { NextRequest, NextResponse } from 'next/server';
import { isValidLocale } from '@/i18n/config';
import { getTrainingView } from '@/lib/training/sessions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') ?? '';
  if (!isValidLocale(locale)) {
    return NextResponse.json({ ok: false, error: 'locale' }, { status: 400 });
  }
  const view = await getTrainingView(locale);
  return NextResponse.json(view, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
  });
}
