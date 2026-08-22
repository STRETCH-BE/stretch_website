// POST /api/contact — the standalone contact-page form. Same delivery pipeline
// as /api/lead, tagged with source "contact". Kept as its own endpoint so the
// contact form and the lead modal can evolve independently.
// Anti-spam chain (22 Aug 2026): honeypot → rate limit → Turnstile → form
// token → spam score; flagged submissions are stored (now also via
// storeLead), never delivered, and always answered with the success state.
import { NextResponse } from 'next/server';
import { deliverLead } from '@/lib/deliver';
import { storeLead } from '@/lib/lead-store';
import { runLeadGuards } from '@/lib/spam/guard';
import type { LeadPayload } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LEN = 5000;

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

  const email = clean(body.email);
  const name = clean(body.name);
  if (!clean(body._gotcha) && !email && !clean(body.phone)) {
    return NextResponse.json({ ok: false, error: 'missing_contact' }, { status: 422 });
  }

  const payload: LeadPayload = {
    source: 'contact',
    name,
    email,
    phone: clean(body.phone),
    subject: clean(body.subject),
    timeline: clean(body.timeline),
    message: clean(body.message),
  };

  const guard = await runLeadGuards({
    request,
    honeypot: clean(body._gotcha),
    fields: payload as Record<string, string>,
    routeKey: 'lead', // shares the /api/lead budget — same audience, same forms
    ipLimit: [6, 10 * 60],
    emailLimit: [10, 24 * 60 * 60],
    formToken: body.formToken,
    turnstileToken: body.turnstileToken,
  });
  if (guard.kind === 'honeypot') return NextResponse.json({ ok: true });
  if (guard.kind === 'rate_limited') {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }
  if (guard.kind === 'captcha_fail') {
    return NextResponse.json({ ok: false, error: 'captcha' }, { status: 400 });
  }
  if (guard.kind === 'stale_token') {
    return NextResponse.json({ ok: false, error: 'stale_token' }, { status: 400 });
  }

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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[contact] unexpected delivery error: ${err instanceof Error ? err.message : 'unknown'}`);
    await storeLead(payload, { delivered: false, method: 'failed' }, page, guard.spam);
    return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 502 });
  }
}
