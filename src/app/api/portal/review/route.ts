// POST /api/portal/review — approve or reject ONE pending portal account.
// Authorization: a valid signed review token (t) from the admin notification
// email, OR a signed-in admin session. POST-only by design — mail scanners
// pre-fetch links, so a GET must never change anything (the review PAGE is
// the GET and only renders).
//   approve → { action:'approve', markets?, allMarkets?, country? }
//             b2b/trade accounts need markets (or allMarkets) — approval IS
//             the market assignment; architects need none.
//   reject  → { action:'reject', reason, block?, blockDomain? }
//             deletes the auth user (+ profile via FK cascade); optionally
//             writes the canonical email and/or domain to blocked_senders.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost, portalLoginUrl } from '@/lib/portal/host';
import { checkReviewToken } from '@/lib/portal/review-token';
import { canonicalEmail, emailDomain } from '@/lib/spam/email';
import { normalizeAccountType, PRICE_MARKETS } from '@/lib/portal/types';
import { buildApprovalEmail } from '@/lib/portal/emails';
import { sendTransactionalEmail, isTransactionalConfigured } from '@/lib/transactional';

export const runtime = 'nodejs';

const REJECT_REASONS = new Set(['not_a_business', 'spam', 'duplicate', 'other']);

function sanitizeMarkets(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const valid = new Set<string>(PRICE_MARKETS as readonly string[]);
  return input.map(String).filter((m) => valid.has(m));
}

export async function POST(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }

  // --- Authorization: signed token OR admin session --------------------------
  const tokenUserId = checkReviewToken(body.t);
  let userId = tokenUserId;
  if (!userId) {
    const session = await getAdminSession();
    if (!session || session.demo) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }
    userId = String(body.userId ?? '');
  }
  if (!userId) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

  const service = createServiceClient();
  if (!service) {
    return NextResponse.json(
      { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  const { data: profile } = await service
    .from('portal_users')
    .select('id, email, role, account_type, active, pending_reason, contact_name, country, signup_host')
    .eq('id', userId)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  // The review flow never touches admin accounts.
  if (profile.role === 'admin') {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const action = String(body.action ?? '');

  // --- APPROVE ---------------------------------------------------------------
  if (action === 'approve') {
    const tier = normalizeAccountType(profile.account_type);
    const allMarkets = Boolean(body.allMarkets);
    const markets = sanitizeMarkets(body.markets);
    // b2b/trade approval IS the market assignment — refuse an empty one.
    if (tier !== 'architect' && !allMarkets && markets.length === 0) {
      return NextResponse.json({ ok: false, error: 'markets_required' }, { status: 400 });
    }
    const update: Record<string, unknown> = {
      active: true,
      pending_reason: null,
      markets,
      all_markets: allMarkets,
    };
    if (typeof body.country === 'string' && body.country.trim()) {
      update.country = body.country.trim().toUpperCase().slice(0, 8);
    }
    // Optional tier change in the same step (e.g. b2c → installer).
    if (typeof body.accountType === 'string' && body.accountType.trim()) {
      update.account_type = normalizeAccountType(body.accountType);
    }
    const { error } = await service.from('portal_users').update(update).eq('id', userId);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    if (isTransactionalConfigured()) {
      const mail = buildApprovalEmail({
        name: (profile.contact_name as string | null) ?? null,
        // Local-portal mode: link the domain the client signed up on.
        loginUrl: portalLoginUrl({
          fallbackOrigin: req.nextUrl.origin,
          signupHost: (profile as { signup_host?: string | null }).signup_host ?? null,
          country: (profile as { country?: string | null }).country ?? null,
        }),
      });
      // AWAITED — a serverless function freezes right after the response,
      // killing unawaited sends.
      const sent = await sendTransactionalEmail({
        to: profile.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      }).catch(() => ({ ok: false as const }));
      if (!sent.ok) console.warn('[review] approval mail failed to send');
    }
    return NextResponse.json({ ok: true, action: 'approved' });
  }

  // --- REJECT ----------------------------------------------------------------
  if (action === 'reject') {
    const reason = REJECT_REASONS.has(String(body.reason)) ? String(body.reason) : 'other';
    // Optional blocklist writes BEFORE the delete (we still have the email).
    const entries: { kind: 'email' | 'domain'; value: string; reason: string }[] = [];
    if (body.block === true) {
      entries.push({ kind: 'email', value: canonicalEmail(profile.email), reason });
    }
    if (body.blockDomain === true) {
      const domain = emailDomain(profile.email);
      if (domain) entries.push({ kind: 'domain', value: domain, reason });
    }
    if (entries.length > 0) {
      await service
        .from('blocked_senders')
        .upsert(entries, { onConflict: 'kind,value', ignoreDuplicates: true });
    }
    // Deleting the auth user cascades to the profile. Rejection sends nothing.
    const { error } = await service.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, action: 'rejected' });
  }

  return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
}
