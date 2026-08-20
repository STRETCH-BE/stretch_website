// POST /api/datasheet-request — the gated datasheet flow, v2 (email delivery).
// Captures the lead exactly like /api/lead (deliverLead + storeLead), then
// emails the visitor a signed 14-day download link. When no provider that can
// email a visitor is configured (local dev), it responds with a fresh signed
// URL instead and the modal falls back to an instant download — a visitor
// never ends up with nothing. Never logs visitor PII — email domain only.
import { NextResponse } from 'next/server';
import { deliverLead } from '@/lib/deliver';
import { storeLead } from '@/lib/lead-store';
import type { LeadPayload } from '@/lib/email';
import { getDatasheet } from '@/lib/datasheets';
import { createDatasheetLink } from '@/lib/datasheet-links';
import { buildDatasheetEmail } from '@/lib/datasheet-email';
import { isTransactionalConfigured, sendTransactionalEmail } from '@/lib/transactional';
import { locales } from '@/i18n/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LEN = 5000;
const ROLES = new Set(['architect', 'installer', 'private', 'other']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown): string {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .slice(0, MAX_LEN)
    .trim();
}

// Best-effort in-memory rate limit: max 8 requests/hour per IP. Serverless
// instances each keep their own Map, so this is per-instance and resets on
// cold starts — it exists so nobody can use this endpoint to spam a third
// party's inbox from a single connection, not as a hard guarantee.
const RATE_MAX = 8;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_MAX) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  // Prune other stale entries occasionally so the map cannot grow unbounded.
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  // Honeypot: silently accept bot submissions without doing anything.
  if (clean(body._gotcha)) {
    return NextResponse.json({ ok: true, mode: 'email' });
  }

  const name = clean(body.name);
  const role = clean(body.role).toLowerCase();
  const email = clean(body.email);
  const phone = clean(body.phone);
  const city = clean(body.city);
  // Optional ISO country code from the shared country select (max 8 chars —
  // codes are 2, 'OTHER' is 5; anything longer is garbage).
  const country = clean(body.country).slice(0, 8).toUpperCase();
  const slug = clean(body.slug);
  const locale = (locales as readonly string[]).includes(clean(body.locale)) ? clean(body.locale) : 'en';
  const source = clean(body.source) || 'pdf_download';

  const sheet = getDatasheet(slug);
  if (
    !name ||
    !ROLES.has(role) ||
    !EMAIL_RE.test(email) ||
    !phone ||
    !city ||
    !sheet
  ) {
    return NextResponse.json({ ok: false, error: 'invalid_fields' }, { status: 422 });
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  // (a) Capture the lead exactly as /api/lead does.
  const payload: LeadPayload = {
    source,
    name,
    role,
    email,
    phone,
    city,
    ...(country ? { country } : {}),
    downloadedFile: sheet.title,
    datasheetSlug: sheet.slug,
  };
  const page = request.headers.get('referer');
  try {
    const result = await deliverLead(payload);
    await storeLead(payload, { delivered: result.method !== 'log', method: result.method }, page);
  } catch (err) {
    console.error(`[datasheet] lead delivery error: ${err instanceof Error ? err.message : 'unknown'}`);
    await storeLead(payload, { delivered: false, method: 'failed' }, page);
  }

  // Signed link — relative path; make it absolute for the email.
  const link = createDatasheetLink(sheet.slug, locale);
  const origin = new URL(request.url).origin;
  const url = `${origin}${link}`;

  // Local-dev fallback: nothing can email the visitor → instant download.
  if (!isTransactionalConfigured()) {
    return NextResponse.json({ ok: true, mode: 'download', url: link });
  }

  // (b) Email the visitor the signed link. Architects additionally get the
  // architect-area invite paragraph (budget bands, case studies, one-click docs).
  let extraParagraph: { html: string; text: string } | undefined;
  if (role === 'architect') {
    const { getTranslations } = await import('next-intl/server');
    const t = await getTranslations({ locale, namespace: 'datasheetEmail' });
    const invite = t('architectInvite');
    const architectsUrl = `${origin}/${locale}/architects`;
    extraParagraph = {
      html: `<p style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13.5px;line-height:1.6;color:#0A0A0A;background:#F4F3F1;padding:14px 16px;margin:0 0 24px;">${invite
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')} <a href="${architectsUrl}" style="color:#FF0000;font-weight:700;">${architectsUrl}</a></p>`,
      text: `${invite} ${architectsUrl}`,
    };
  }
  const built = await buildDatasheetEmail({ locale, name, title: sheet.title, url, extraParagraph });
  const sent = await sendTransactionalEmail({ to: email, subject: built.subject, html: built.html, text: built.text });
  if (!sent.ok) {
    // Providers configured but all failed at runtime — never leave the
    // visitor with nothing: fall back to the instant download.
    return NextResponse.json({ ok: true, mode: 'download', url: link });
  }

  return NextResponse.json({ ok: true, mode: 'email' });
}
