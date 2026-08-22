// /api/portal/leads — admin view of public.leads.
//   GET  ?filter=all|flagged|delivered&page=0            → 50 rows/page
//   GET  ?filter=...&format=csv                          → CSV of the filter
//   POST { action: 'deliver', id }  → deliverLead once; flagged=false,
//                                     delivered=true, delivered_at=now
//   POST { action: 'delete',  id }  → remove the row
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost } from '@/lib/portal/host';
import { deliverLead } from '@/lib/deliver';
import type { LeadPayload } from '@/lib/email';

export const runtime = 'nodejs';

const PAGE_SIZE = 50;
const CSV_MAX = 5000;

const COLS =
  'id, created_at, source, name, company, email, phone, message, product, page, host, ip, user_agent, spam_score, spam_reasons, flagged, delivered, delivery_method, delivered_at, payload';

type Filter = 'all' | 'flagged' | 'delivered';

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false, leads: [], total: 0 });
  }
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });

  const url = req.nextUrl;
  const filter = (['all', 'flagged', 'delivered'] as const).includes(url.searchParams.get('filter') as Filter)
    ? (url.searchParams.get('filter') as Filter)
    : 'all';

  if (url.searchParams.get('format') === 'csv') {
    let cq = service.from('leads').select(COLS);
    if (filter === 'flagged') cq = cq.eq('flagged', true);
    if (filter === 'delivered') cq = cq.eq('delivered', true);
    const { data, error } = await cq.order('created_at', { ascending: false }).limit(CSV_MAX);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    const rows = (data ?? []) as Record<string, unknown>[];
    const header = [
      'created_at', 'source', 'name', 'company', 'email', 'phone', 'message', 'product', 'page',
      'host', 'spam_score', 'spam_reasons', 'flagged', 'delivered', 'delivery_method', 'delivered_at',
    ];
    const csv = [
      header.join(','),
      ...rows.map((r) => header.map((h) => csvCell(r[h])).join(',')),
    ].join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="stretch-leads-${filter}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  const page = Math.max(0, Number(url.searchParams.get('page') ?? 0) || 0);
  const from = page * PAGE_SIZE;
  let query = service.from('leads').select(COLS, { count: 'exact' });
  if (filter === 'flagged') query = query.eq('flagged', true);
  if (filter === 'delivered') query = query.eq('delivered', true);
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, persisted: true, leads: data ?? [], total: count ?? 0, pageSize: PAGE_SIZE });
}

export async function POST(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false });
  }
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? '');
  const action = String(body?.action ?? '');
  if (!id) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

  if (action === 'delete') {
    const { error } = await service.from('leads').delete().eq('id', id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, persisted: true });
  }

  if (action === 'deliver') {
    const { data: row, error } = await service.from('leads').select('id, payload, delivered').eq('id', id).maybeSingle();
    if (error || !row) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    // Exactly once: a second "Deliver now" on an already-delivered lead no-ops.
    if (row.delivered) return NextResponse.json({ ok: true, persisted: true, already: true });
    const payload = (row.payload ?? {}) as LeadPayload;
    const result = await deliverLead(payload);
    const delivered = result.method !== 'log';
    const { error: upError } = await service
      .from('leads')
      .update({
        flagged: false,
        delivered,
        delivery_method: result.method,
        ...(delivered ? { delivered_at: new Date().toISOString() } : {}),
      })
      .eq('id', id);
    if (upError) return NextResponse.json({ ok: false, error: upError.message }, { status: 500 });
    return NextResponse.json({ ok: true, persisted: true, delivered, method: result.method });
  }

  return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
}
