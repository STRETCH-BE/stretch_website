// /api/portal/blocklist — admin management of blocked_senders.
//   GET    → list entries (newest first)
//   POST   → add { kind: 'email'|'domain', value, reason? }
//   DELETE → remove { id }
// Emails are stored in their CANONICAL form (gmail dots/+suffix collapsed) so
// they match what the signup/lead guards compare against.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost } from '@/lib/portal/host';
import { canonicalEmail } from '@/lib/spam/email';

export const runtime = 'nodejs';

async function guard(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false, entries: [] });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });
  const { data, error } = await service
    .from('blocked_senders')
    .select('id, kind, value, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, persisted: true, entries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const kind = body?.kind === 'domain' ? 'domain' : 'email';
  let value = String(body?.value ?? '').trim().toLowerCase();
  if (kind === 'email') value = canonicalEmail(value);
  else value = value.replace(/^@/, '');
  const reason = String(body?.reason ?? '').trim().slice(0, 200) || null;
  if (!value || (kind === 'email' && !value.includes('@')) || (kind === 'domain' && !value.includes('.'))) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });
  const { error } = await service
    .from('blocked_senders')
    .upsert({ kind, value, reason }, { onConflict: 'kind,value', ignoreDuplicates: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, persisted: true });
}

export async function DELETE(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!id) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });
  const { error } = await service.from('blocked_senders').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, persisted: true });
}
