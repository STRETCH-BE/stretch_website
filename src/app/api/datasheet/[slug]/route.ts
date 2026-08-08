// GET /api/datasheet/[slug]?t=<token>&l=<locale> — the only way to fetch a
// gated datasheet PDF. Files live in repo-root datasheets-private/ (shipped in
// this route's serverless bundle via outputFileTracingIncludes) and stream out
// only with a valid, unexpired HMAC token (src/lib/datasheet-links.ts).
// Invalid/expired token or unknown slug → a tiny branded 410 page pointing at
// /{locale}/datasheets to request a fresh link; entry known but PDF not yet
// dropped in → 404 JSON.
import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getTranslations } from 'next-intl/server';
import { getDatasheet } from '@/lib/datasheets';
import { verifyDatasheetToken } from '@/lib/datasheet-links';
import { locales } from '@/i18n/config';

export const runtime = 'nodejs';

function escapeHtml(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function expiredPage(locale: string): Promise<NextResponse> {
  const t = await getTranslations({ locale, namespace: 'datasheetLink' });
  const title = t('expiredTitle');
  const body = t('expiredBody');
  const cta = t('requestNew');
  const href = `/${locale}/datasheets`;
  const html = `<!doctype html>
<html lang="${escapeHtml(locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)} — STRETCH</title>
</head>
<body style="margin:0;background:#F4F3F1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:10vh auto 0;background:#fff;padding:36px 32px;">
    <div style="font-size:17px;font-weight:800;letter-spacing:.04em;color:#0A0A0A;margin-bottom:26px;">STRETCH<span style="color:#FF0000;">&reg;</span></div>
    <h1 style="font-size:26px;font-weight:800;color:#0A0A0A;margin:0 0 12px;line-height:1.1;">${escapeHtml(title)}</h1>
    <p style="font-size:15px;line-height:1.6;color:#55524E;margin:0 0 26px;">${escapeHtml(body)}</p>
    <a href="${escapeHtml(href)}" style="display:inline-block;background:#FF0000;color:#fff;font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:14px 26px;text-decoration:none;">${escapeHtml(cta)}</a>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    status: 410,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const url = new URL(request.url);
  const token = url.searchParams.get('t') ?? '';
  const rawLocale = url.searchParams.get('l') ?? 'en';
  // The locale param is unsigned — validate it against the known list.
  const locale = (locales as readonly string[]).includes(rawLocale) ? rawLocale : 'en';

  const sheet = getDatasheet(params.slug);
  if (!sheet || !token || !verifyDatasheetToken(sheet.slug, token)) {
    return expiredPage(locale);
  }

  let data: Buffer;
  try {
    data = await readFile(path.join(process.cwd(), 'datasheets-private', sheet.file));
  } catch {
    // Entry exists but the PDF has not been dropped in yet.
    return NextResponse.json({ ok: false, error: 'file_missing' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${sheet.file.replace(/"/g, '')}"`,
      'Content-Length': String(data.length),
      'Cache-Control': 'no-store',
    },
  });
}
