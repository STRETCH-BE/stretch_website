// GET /api/architect/datasheet/[slug] — one-click datasheet download for
// signed-in architect (or admin) accounts. The account replaces the public
// lead form: each download is logged as a lead row (source
// 'portal_architect_download', method 'portal' — the leads table is the log,
// no e-mail goes out), then the PDF streams from datasheets-private/.
import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPortalSession } from '@/lib/portal/auth';
import { hasArchitectAccess } from '@/lib/portal/types';
import { getDatasheet } from '@/lib/datasheets';
import { storeLead } from '@/lib/lead-store';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const session = await getPortalSession();
  if (!session || !hasArchitectAccess(session.profile)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const sheet = getDatasheet(params.slug);
  if (!sheet) return NextResponse.json({ ok: false, error: 'unknown_slug' }, { status: 404 });

  // Demo mode: no real files, no lead rows.
  if (session.demo) return NextResponse.json({ ok: false, error: 'demo' }, { status: 403 });

  // 30 downloads per hour per account — enough for any real specifier,
  // a wall for scripted bulk pulls (fail-open helper).
  if (!(await rateLimit(`architect-dl:${session.profile.id}`, 30, 60 * 60))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  await storeLead(
    {
      source: 'portal_architect_download',
      email: session.profile.email,
      company: session.profile.office ?? session.profile.company ?? undefined,
      datasheetSlug: sheet.slug,
      downloadedFile: sheet.title,
    },
    { delivered: false, method: 'portal' },
    null,
  );

  let data: Buffer;
  try {
    data = await readFile(path.join(process.cwd(), 'datasheets-private', sheet.file));
  } catch {
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
