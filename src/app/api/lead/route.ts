// POST /api/lead — receives every lead-modal submission and delivers it via the
// graceful multi-method sender. Sanitises strings, caps field count/length to
// resist abuse, and returns a minimal { ok }. Never logs submitted PII.
// Anti-spam chain (22 Aug 2026): honeypot → rate limit → Turnstile → form
// token → spam score. Flagged leads are ALWAYS stored, never delivered, and
// the response stays the normal success state (a bot never learns).
import { NextResponse } from 'next/server';
import { deliverLead } from '@/lib/deliver';
import { storeLead } from '@/lib/lead-store';
import { runLeadGuards } from '@/lib/spam/guard';
import type { LeadPayload } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FIELDS = 40;
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
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const payload: LeadPayload = { source: clean(body.source) || 'unknown' };
  let count = 0;
  for (const [key, val] of Object.entries(body)) {
    if (key === 'source' || key === '_gotcha' || key === 'formToken' || key === 'turnstileToken') continue;
    if (count >= MAX_FIELDS) break;
    const v = clean(val);
    if (v) {
      payload[key] = v;
      count++;
    }
  }

  // Require at least one contact handle.
  if (!payload.email && !payload.phone) {
    return NextResponse.json({ ok: false, error: 'missing_contact' }, { status: 422 });
  }

  const guard = await runLeadGuards({
    request,
    honeypot: clean(body._gotcha),
    fields: payload as Record<string, string>,
    routeKey: 'lead',
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

  // Page the visitor submitted from (referer) — stored with the lead.
  const page = request.headers.get('referer');

  try {
    // Flagged → store only; the response stays the normal success state.
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
    console.error(`[lead] unexpected delivery error: ${err instanceof Error ? err.message : 'unknown'}`);
    // Store the lead anyway — a delivery failure must not lose the enquiry.
    await storeLead(payload, { delivered: false, method: 'failed' }, page, guard.spam);
    return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 502 });
  }
}
