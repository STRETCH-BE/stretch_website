// ============================================================================
// CLIENT PORTAL — acoustic calculator persistence (saved rooms, usage events).
//
// Same philosophy as designer-store.ts: every call is BEST-EFFORT via the
// service-role client. Without Supabase env vars (or before the acoustic
// tables exist) the helpers return "unavailable" results instead of throwing,
// so the calculator keeps working — persistence just degrades to the
// browser-side autosave. Table definitions: supabase/schema.sql.
// ============================================================================
import { createServiceClient } from '@/lib/portal/supabase';
import type { PortalProfile } from '@/lib/portal/types';
import { summariseAcoustic, type AcousticState, type AcousticSummary } from '@/lib/portal/acoustic-summary';

/** List row: the denormalised headline results, never the jsonb state. */
export type AcousticProjectSummary = {
  id: string;
  name: string;
  updated_at: string;
  room_type: string | null;
  rt_before_s: number | null;
  rt_after_s: number | null;
  target_s: number | null;
};

function log(op: string, err: unknown) {
  console.error(`[acoustics] ${op} failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

// ---- Rooms -----------------------------------------------------------------

export async function listProjects(email: string): Promise<AcousticProjectSummary[] | null> {
  const db = createServiceClient();
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('acoustic_projects')
      .select('id, name, updated_at, room_type, rt_before_s, rt_after_s, target_s')
      .eq('user_email', email)
      .order('updated_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data ?? []) as AcousticProjectSummary[];
  } catch (err) {
    log('listProjects', err);
    return null;
  }
}

export async function getProject(email: string, id: string): Promise<Record<string, unknown> | null> {
  const db = createServiceClient();
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('acoustic_projects')
      .select('id, name, state')
      .eq('user_email', email)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return (data as Record<string, unknown>) ?? null;
  } catch (err) {
    log('getProject', err);
    return null;
  }
}

/**
 * Insert or update a room. The headline columns are derived here from the
 * submitted state (acoustic-summary.ts) — never from client-supplied fields.
 */
export async function saveProject(
  profile: PortalProfile,
  project: { id?: string | null; name: string; state: AcousticState },
): Promise<string | null> {
  const db = createServiceClient();
  if (!db) return null;
  const summary: AcousticSummary = summariseAcoustic(project.state);
  try {
    if (project.id) {
      const { data, error } = await db
        .from('acoustic_projects')
        .update({ name: project.name, state: project.state, ...summary, updated_at: new Date().toISOString() })
        .eq('id', project.id)
        .eq('user_email', profile.email)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (data?.id) return data.id as string;
      // id not found for this user → fall through to insert a fresh row.
    }
    const { data, error } = await db
      .from('acoustic_projects')
      .insert({
        user_id: profile.id || null,
        user_email: profile.email,
        name: project.name,
        state: project.state,
        ...summary,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data.id as string;
  } catch (err) {
    log('saveProject', err);
    return null;
  }
}

export async function deleteProject(email: string, id: string): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;
  try {
    const { error } = await db.from('acoustic_projects').delete().eq('user_email', email).eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    log('deleteProject', err);
    return false;
  }
}

// ---- Usage events ----------------------------------------------------------

export async function logAcousticEvent(
  event: string,
  email: string | null,
  demo: boolean,
  meta: Record<string, unknown> = {},
): Promise<void> {
  const db = createServiceClient();
  if (!db) return;
  try {
    await db.from('acoustic_events').insert({ event, user_email: email, demo, meta });
  } catch (err) {
    log('logEvent', err);
  }
}
