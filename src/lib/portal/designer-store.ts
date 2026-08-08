// ============================================================================
// CLIENT PORTAL — designer persistence (saved designs, orders, usage events).
//
// Follows the lead-store philosophy: every call is BEST-EFFORT via the
// service-role client. Without Supabase env vars (or before the designer
// tables exist) the helpers return "unavailable" results instead of throwing,
// so the designer itself keeps working — persistence just degrades to the
// browser-side fallbacks. Table definitions: supabase/schema.sql.
// ============================================================================
import { createServiceClient } from '@/lib/portal/supabase';
import type { PortalProfile } from '@/lib/portal/types';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/portal/types';

export { ORDER_STATUSES, type OrderStatus };

export type DesignSummary = { id: string; name: string; updated_at: string };

export type DesignerOrderRow = {
  id: string;
  ref: string;
  user_email: string;
  company: string | null;
  client: Record<string, unknown>;
  specification: Record<string, unknown>;
  quote: Record<string, unknown>;
  status: OrderStatus;
  delivered: boolean;
  created_at: string;
};

function log(op: string, err: unknown) {
  console.error(`[designer] ${op} failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

// ---- Designs ---------------------------------------------------------------

export async function listDesigns(email: string): Promise<DesignSummary[] | null> {
  const db = createServiceClient();
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('designer_designs')
      .select('id, name, updated_at')
      .eq('user_email', email)
      .order('updated_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data ?? []) as DesignSummary[];
  } catch (err) {
    log('listDesigns', err);
    return null;
  }
}

export async function getDesign(email: string, id: string): Promise<Record<string, unknown> | null> {
  const db = createServiceClient();
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('designer_designs')
      .select('id, name, state')
      .eq('user_email', email)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return (data as Record<string, unknown>) ?? null;
  } catch (err) {
    log('getDesign', err);
    return null;
  }
}

export async function saveDesign(
  profile: PortalProfile,
  design: { id?: string | null; name: string; state: unknown },
): Promise<string | null> {
  const db = createServiceClient();
  if (!db) return null;
  try {
    if (design.id) {
      const { data, error } = await db
        .from('designer_designs')
        .update({ name: design.name, state: design.state, updated_at: new Date().toISOString() })
        .eq('id', design.id)
        .eq('user_email', profile.email)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (data?.id) return data.id as string;
      // id not found for this user → fall through to insert a fresh row.
    }
    const { data, error } = await db
      .from('designer_designs')
      .insert({
        user_id: profile.id || null,
        user_email: profile.email,
        name: design.name,
        state: design.state,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data.id as string;
  } catch (err) {
    log('saveDesign', err);
    return null;
  }
}

export async function deleteDesign(email: string, id: string): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;
  try {
    const { error } = await db.from('designer_designs').delete().eq('user_email', email).eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    log('deleteDesign', err);
    return false;
  }
}

// ---- Orders ----------------------------------------------------------------

export async function storeOrder(
  profile: PortalProfile,
  order: {
    ref: string;
    client: unknown;
    product: unknown;
    specification: unknown;
    quote: unknown;
    drawing: unknown;
  },
  delivery: { delivered: boolean; method: string | null },
): Promise<string | null> {
  const db = createServiceClient();
  if (!db) return null;
  try {
    const { data, error } = await db
      .from('designer_orders')
      .insert({
        ref: order.ref,
        user_id: profile.id || null,
        user_email: profile.email,
        company: profile.company,
        client: order.client ?? {},
        product: order.product ?? {},
        specification: order.specification ?? {},
        quote: order.quote ?? {},
        drawing: order.drawing ?? {},
        delivered: delivery.delivered,
        delivery_method: delivery.method,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data.id as string;
  } catch (err) {
    log('storeOrder', err);
    return null;
  }
}

export async function listOrders(profile: PortalProfile): Promise<DesignerOrderRow[] | null> {
  const db = createServiceClient();
  if (!db) return null;
  try {
    let q = db
      .from('designer_orders')
      .select('id, ref, user_email, company, client, specification, quote, status, delivered, created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (profile.role !== 'admin') q = q.eq('user_email', profile.email);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as DesignerOrderRow[];
  } catch (err) {
    log('listOrders', err);
    return null;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const db = createServiceClient();
  if (!db) return false;
  try {
    const { error } = await db
      .from('designer_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    log('updateOrderStatus', err);
    return false;
  }
}

// ---- Usage events ----------------------------------------------------------

export async function logDesignerEvent(
  event: string,
  email: string | null,
  demo: boolean,
  meta: Record<string, unknown> = {},
): Promise<void> {
  const db = createServiceClient();
  if (!db) return;
  try {
    await db.from('designer_events').insert({ event, user_email: email, demo, meta });
  } catch (err) {
    log('logEvent', err);
  }
}
