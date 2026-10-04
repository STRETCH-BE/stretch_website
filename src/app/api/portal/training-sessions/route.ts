// /api/portal/training-sessions — admin management of public.training_sessions
// (the Beveren-Waas training days shown on /installer-training, in both booking
// forms, in the architects' events and in the Event JSON-LD).
//   GET    → { ok, persisted, sessions } — every row from today − 90 days on,
//            unpublished included, internal note included, with `requests` =
//            the non-flagged website bookings linked to that day
//            (leads.payload.trainingSessionId).
//   POST   → create a day            { starts_on, ends_on?, system, languages, location?, seats_left?, status?, published?, note? }
//   PATCH  → update a day by id      { id, ...any of the fields above }
//   DELETE → remove a day            { id }
// Every successful write revalidates the shared cache tag and the training +
// architects pages on every locale, then returns the fresh list.
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost } from '@/lib/portal/host';
import { TRAINING_CACHE_TAG, TRAINING_DEFAULT_LOCATION } from '@/lib/training/config';
import { dateInTimeZone, shiftIsoDate } from '@/lib/training/sessions';
import type { TrainingRow } from '@/lib/training/types';
import { validateTrainingDay } from '@/lib/training/validate';

export const runtime = 'nodejs';

/** A row as the admin sees it: the internal note and the request count included. */
export type AdminTrainingRow = TrainingRow & { note: string | null; requests: number };

const PAST_DAYS = 90;

/** Demo mode: the two seeded days as sample rows. */
const DEMO_ROWS: AdminTrainingRow[] = [
  {
    id: 'demo-2026-11-19-polyester',
    starts_on: '2026-11-19',
    ends_on: null,
    system: 'polyester',
    languages: ['NL', 'EN'],
    location: TRAINING_DEFAULT_LOCATION,
    seats_left: null,
    status: 'open',
    published: true,
    note: null,
    created_at: '2026-10-04T00:00:00.000Z',
    updated_at: '2026-10-04T00:00:00.000Z',
    requests: 0,
  },
  {
    id: 'demo-2026-11-20-pvc',
    starts_on: '2026-11-20',
    ends_on: null,
    system: 'pvc',
    languages: ['NL', 'EN'],
    location: TRAINING_DEFAULT_LOCATION,
    seats_left: null,
    status: 'open',
    published: true,
    note: null,
    created_at: '2026-10-04T00:00:00.000Z',
    updated_at: '2026-10-04T00:00:00.000Z',
    requests: 0,
  },
];

async function guard(req: NextRequest) {
  if (!isPortalAllowedHost(req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  if (!isSupabaseConfigured() || session.demo) {
    return NextResponse.json({ ok: true, persisted: false, sessions: DEMO_ROWS });
  }
  return null;
}

// ---------------------------------------------------------------------------
// Listing with request counts
// ---------------------------------------------------------------------------
type Service = NonNullable<ReturnType<typeof createServiceClient>>;

async function requestCounts(service: Service): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  // One query on the JSON path where it is set; the count happens in code.
  let { data, error } = await service
    .from('leads')
    .select('sid:payload->>trainingSessionId')
    .not('payload->>trainingSessionId', 'is', null)
    .eq('flagged', false);
  if (error) {
    // Un-migrated database (no flagged column yet): count every linked lead.
    ({ data, error } = await service
      .from('leads')
      .select('sid:payload->>trainingSessionId')
      .not('payload->>trainingSessionId', 'is', null));
  }
  if (error) {
    console.error(`[training] request count failed: ${error.message}`);
    return counts;
  }
  for (const row of (data ?? []) as { sid: string | null }[]) {
    if (row.sid) counts.set(row.sid, (counts.get(row.sid) ?? 0) + 1);
  }
  return counts;
}

async function listRows(service: Service): Promise<{ sessions: AdminTrainingRow[] } | { error: string }> {
  const since = shiftIsoDate(dateInTimeZone(new Date()), -PAST_DAYS);
  const [{ data, error }, counts] = await Promise.all([
    service.from('training_sessions').select('*').gte('starts_on', since).order('starts_on', { ascending: true }),
    requestCounts(service),
  ]);
  if (error) return { error: error.message };
  const sessions = ((data ?? []) as (TrainingRow & { note: string | null })[]).map((r) => ({
    ...r,
    requests: counts.get(r.id) ?? 0,
  }));
  return { sessions };
}

/** Every reader of the table: the shared cache entry and the two pages on all locales. */
function revalidateTrainingReaders() {
  revalidateTag(TRAINING_CACHE_TAG);
  revalidatePath('/[locale]/installer-training', 'page');
  revalidatePath('/[locale]/architects', 'page');
}

async function freshList(service: Service) {
  const listed = await listRows(service);
  if ('error' in listed) return NextResponse.json({ ok: false, error: listed.error }, { status: 500 });
  return NextResponse.json({ ok: true, persisted: true, sessions: listed.sessions });
}

// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });
  return freshList(service);
}

export async function POST(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false, error: 'body' }, { status: 400 });
  const checked = validateTrainingDay(body);
  if (!checked.ok) return NextResponse.json({ ok: false, error: checked.error }, { status: 400 });
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });
  const { error } = await service.from('training_sessions').insert(checked.row);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  revalidateTrainingReaders();
  return freshList(service);
}

export async function PATCH(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = String(body?.id ?? '');
  if (!body || !id) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 });
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });
  // Partial update: validate the existing row merged with the patch, so an
  // end date is always checked against the (possibly unchanged) start date.
  const { data: current, error: readError } = await service.from('training_sessions').select('*').eq('id', id).maybeSingle();
  if (readError) return NextResponse.json({ ok: false, error: readError.message }, { status: 500 });
  if (!current) return NextResponse.json({ ok: false, error: 'id' }, { status: 404 });
  const { id: _id, ...patch } = body;
  const checked = validateTrainingDay({ ...(current as Record<string, unknown>), ...patch });
  if (!checked.ok) return NextResponse.json({ ok: false, error: checked.error }, { status: 400 });
  const { error } = await service
    .from('training_sessions')
    .update({ ...checked.row, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  revalidateTrainingReaders();
  return freshList(service);
}

export async function DELETE(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = String(body?.id ?? '');
  if (!id) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 });
  const service = createServiceClient();
  if (!service) return NextResponse.json({ ok: false, error: 'service unavailable' }, { status: 500 });
  const { error } = await service.from('training_sessions').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  revalidateTrainingReaders();
  return freshList(service);
}
