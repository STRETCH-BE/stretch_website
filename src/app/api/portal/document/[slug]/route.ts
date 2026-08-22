// GET /api/portal/document/[slug] — streams a RESTRICTED installer document
// (see src/lib/installer-docs.ts) to a signed-in TRADE account. Unlike the
// datasheet route this takes no signed token: there is no shareable link to
// mint, the session is checked on every single request, so a URL copied out of
// the portal is useless to anyone outside the trade tiers.
//
// The response is STREAMED rather than buffered: the installation guide is
// ~20 MB and a buffered response would both spike function memory and run into
// the platform's buffered-payload ceiling.
import { NextResponse } from 'next/server';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { getInstallerDoc } from '@/lib/installer-docs';
import { storeLead } from '@/lib/lead-store';
import { isPortalAllowedHost } from '@/lib/portal/host';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  // Canonical portal host only (404 elsewhere when NEXT_PUBLIC_PORTAL_HOST set).
  if (!isPortalAllowedHost(_request.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const session = await getPortalSession();
  if (!session || !hasTradeAccess(session.profile)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const doc = getInstallerDoc(params.slug);
  if (!doc) return NextResponse.json({ ok: false, error: 'unknown_slug' }, { status: 404 });

  // Demo mode ships no real files.
  if (session.demo) return NextResponse.json({ ok: false, error: 'demo' }, { status: 403 });

  const filePath = path.join(process.cwd(), 'installer-private', doc.file);
  let size: number;
  try {
    size = (await stat(filePath)).size;
  } catch {
    return NextResponse.json({ ok: false, error: 'file_missing' }, { status: 404 });
  }

  // Log who took a restricted document — the guide is not for third parties,
  // so every download is attributable.
  await storeLead(
    {
      source: 'portal_installer_download',
      email: session.profile.email,
      company: session.profile.company ?? undefined,
      resourceSlug: doc.slug,
      downloadedFile: doc.title,
    },
    { delivered: false, method: 'portal' },
    null,
  );

  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream<Uint8Array>;
  const ext = path.extname(doc.file).toLowerCase();
  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${doc.file.replace(/"/g, '')}"`,
      'Content-Length': String(size),
      'Cache-Control': 'no-store, private',
    },
  });
}
