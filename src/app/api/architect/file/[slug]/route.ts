// GET /api/architect/file/[slug] — streams an architect resource (spec text,
// CAD/BIM file, photo zip, case-study PDF) from architect-private/ to a
// signed-in architect (or admin) account. Downloads are logged as lead rows
// (source 'portal_architect_download') so every taken document is visible.
import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getPortalSession } from '@/lib/portal/auth';
import { hasArchitectAccess } from '@/lib/portal/types';
import { getArchitectResource } from '@/lib/architect-resources';
import { storeLead } from '@/lib/lead-store';

export const runtime = 'nodejs';

const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.dwg': 'application/acad',
  '.rvt': 'application/octet-stream',
  '.skp': 'application/octet-stream',
  '.zip': 'application/zip',
};

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const session = await getPortalSession();
  if (!session || !hasArchitectAccess(session.profile)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const res = getArchitectResource(params.slug);
  if (!res) return NextResponse.json({ ok: false, error: 'unknown_slug' }, { status: 404 });

  // Demo mode: no real files, no lead rows.
  if (session.demo) return NextResponse.json({ ok: false, error: 'demo' }, { status: 403 });

  await storeLead(
    {
      source: 'portal_architect_download',
      email: session.profile.email,
      company: session.profile.office ?? session.profile.company ?? undefined,
      resourceSlug: res.slug,
      downloadedFile: res.title,
    },
    { delivered: false, method: 'portal' },
    null,
  );

  let data: Buffer;
  try {
    data = await readFile(path.join(process.cwd(), 'architect-private', res.file));
  } catch {
    return NextResponse.json({ ok: false, error: 'file_missing' }, { status: 404 });
  }

  const ext = path.extname(res.file).toLowerCase();
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${res.file.replace(/"/g, '')}"`,
      'Content-Length': String(data.length),
      'Cache-Control': 'no-store',
    },
  });
}
