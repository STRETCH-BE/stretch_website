// POST /api/datasheet-request — the gated datasheet flow, v2 (email delivery).
// Captures the lead exactly like /api/lead (deliverLead + storeLead), then
// emails the visitor a signed 14-day download link. When no provider that can
// email a visitor is configured (local dev), it responds with a fresh signed
// URL instead and the modal falls back to an instant download — a visitor
// never ends up with nothing. Never logs visitor PII — email domain only.
import { NextResponse } from 'next/server';
import { deliverLead } from '@/lib/deliver';
import { storeLead } from '@/lib/lead-store';
import { runLeadGuards } from '@/lib/spam/guard';
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

  // (a) Capture the lead exactly as /api/lead does — after the guard chain.
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

  const guard = await runLeadGuards({
    request,
    honeypot: clean(body._gotcha),
    fields: payload as Record<string, string>,
    routeKey: 'datasheet',
    ipLimit: [5, 60 * 60],
    emailLimit: [3, 24 * 60 * 60],
    formToken: body.formToken,
    turnstileToken: body.turnstileToken,
    // Returning visitors legitimately confirm within milliseconds — the
    // one-click confirm step is exempt from the too-fast rule only.
    minTokenAgeMs: body.quickConfirm === true ? 0 : undefined,
  });
  // Honeypot: silently accept bot submissions without doing anything.
  if (guard.kind === 'honeypot') return NextResponse.json({ ok: true, mode: 'email' });
  if (guard.kind === 'rate_limited') {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }
  if (guard.kind === 'captcha_fail') {
    return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
  }
  if (guard.kind === 'stale_token') {
    return NextResponse.json({ ok: false, error: 'stale_token' }, { status: 400 });
  }
  // Hard signal for the MAIL step: a disposable inbox never receives a mail
  // (the address only exists to be burned) — the lead row is still stored.
  const hardNoMail = guard.disposable;

  const page = request.headers.get('referer');
  try {
    const result = guard.spam.flagged ? null : await deliverLead(payload);
    await storeLead(
      payload,
      result
        ? { delivered: result.method !== 'log', method: result.method }
        : { delivered: false, method: 'flagged' },
      page,
      guard.spam,
    );
  } catch (err) {
    console.error(`[datasheet] lead delivery error: ${err instanceof Error ? err.message : 'unknown'}`);
    await storeLead(payload, { delivered: false, method: 'failed' }, page, guard.spam);
  }

  // Disposable inbox → normal ok response, but no visitor mail and no
  // fallback download link.
  if (hardNoMail) {
    return NextResponse.json({ ok: true, mode: 'email' });
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
