// ============================================================================
// KIT CONFIGURATOR — order persistence.
//
// The lines table is a SNAPSHOT: what the installer was shown is what gets
// stored, and it is never recomputed from a later pricebook. Everything here
// goes through the service role AFTER the route has verified the session.
// ============================================================================
import { createServiceClient } from '../supabase';
import type { PortalProfile } from '../types';
import { orderTotals, type PricedBom } from './pricing';
import type { ConfiguratorConfig } from './bom';

export const ORDER_STATUSES = ['received', 'confirmed', 'in_production', 'shipped', 'cancelled'] as const;
export type PortalOrderStatus = (typeof ORDER_STATUSES)[number];

export type PortalOrderRow = {
  id: string;
  reference: string;
  email: string;
  company: string | null;
  market: string;
  currency: 'EUR' | 'PLN';
  config: Record<string, unknown>;
  foil_code: string | null;
  foil_product: string | null;
  weld_required: boolean;
  subtotal: number;
  needs_manual_pricing: boolean;
  status: PortalOrderStatus;
  pricebook_version: string | null;
  /** How many ceilings the order holds; config is { ceilings: [...] }. */
  ceiling_count: number;
  /** The ceilings' references, "; "-joined. */
  ceiling_ref: string | null;
  project_ref: string | null;
  delivery_address: string | null;
  note: string | null;
  internal_note: string | null;
  created_at: string;
  updated_at: string;
};

export type PortalOrderLineRow = {
  line_no: number;
  /** 1-based ceiling within the order, and that ceiling's reference. */
  ceiling_no: number;
  ceiling_ref: string | null;
  kind: string | null;
  code: string | null;
  product: string;
  unit: string | null;
  qty: number;
  unit_price: number | null;
  line_total: number | null;
  note: string | null;
};

function log(op: string, err: unknown) {
  console.error(`[configurator-order] ${op} failed: ${err instanceof Error ? err.message : 'unknown error'}`);
}

/** STR-<year>-<0001>. Falls back to a timestamp when the sequence is absent. */
export async function nextReference(): Promise<string> {
  const year = new Date().getFullYear();
  const supabase = createServiceClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('nextval', { seq: 'public.portal_order_ref_seq' });
      if (!error && data != null) return `STR-${year}-${String(Number(data)).padStart(4, '0')}`;
    } catch {
      /* fall through */
    }
    // No nextval RPC exposed (the default): count this year's orders instead.
    try {
      const { count, error } = await supabase
        .from('portal_orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', `${year}-01-01`);
      if (!error) return `STR-${year}-${String((count ?? 0) + 1).padStart(4, '0')}`;
    } catch (err) {
      log('nextReference', err);
    }
  }
  return `STR-${year}-${String(Date.now() % 10000).padStart(4, '0')}`;
}

/** An order already written under this idempotency key, if any. */
export async function findByIdempotencyKey(key: string): Promise<PortalOrderRow | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('portal_orders')
      .select('*')
      .eq('idempotency_key', key)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as PortalOrderRow) ?? null;
  } catch (err) {
    log('findByIdempotencyKey', err);
    return null;
  }
}

/** One ceiling of an order: its configuration, its priced bill, its name. */
export type OrderCeiling = { config: ConfiguratorConfig; quote: PricedBom; reference: string | null };

export { orderTotals } from './pricing';

/** Write the order and its frozen line snapshot. Returns null when it could
 *  not be stored — the route then still e-mails, and says so. */
export async function storeOrder(input: {
  reference: string;
  profile: PortalProfile;
  ceilings: OrderCeiling[];
  meta: { projectRef: string | null; deliveryAddress: string | null; note: string | null };
  idempotencyKey: string | null;
}): Promise<PortalOrderRow | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  const { ceilings } = input;
  const first = ceilings[0];
  if (!first) return null;
  const totals = orderTotals(ceilings);
  try {
    const { data, error } = await supabase
      .from('portal_orders')
      .insert({
        reference: input.reference,
        user_id: input.profile.id,
        email: input.profile.email,
        company: input.profile.company,
        market: totals.market,
        currency: totals.currency,
        // Every ceiling as submitted. Readers accept the older single-config
        // shape too (orders placed before 8 Sep 2026).
        config: { ceilings: ceilings.map((c) => ({ ...c.config, reference: c.reference })) } as unknown as Record<string, unknown>,
        // The FIRST ceiling's foil, for the list view; every line below says
        // which ceiling it belongs to.
        foil_code: first.quote.foil.code,
        foil_product: first.quote.foil.product ?? first.quote.foil.label,
        weld_required: ceilings.some((c) => c.quote.foil.weldRequired || c.quote.weldCount > 0),
        subtotal: totals.currency === 'PLN' && totals.subtotalPln != null ? totals.subtotalPln : totals.subtotalEur,
        needs_manual_pricing: totals.needsManualPricing,
        pricebook_version: first.quote.pricebookVersion,
        ceiling_count: ceilings.length,
        ceiling_ref: ceilings.map((c, i) => c.reference ?? `Ceiling ${i + 1}`).join('; ').slice(0, 400) || null,
        project_ref: input.meta.projectRef,
        delivery_address: input.meta.deliveryAddress,
        note: input.meta.note,
        idempotency_key: input.idempotencyKey,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);

    const order = data as PortalOrderRow;
    let lineNo = 0;
    const lines = ceilings.flatMap((c, ci) =>
      c.quote.lines.map((l) => {
        lineNo += 1;
        return {
          order_id: order.id,
          line_no: lineNo,
          ceiling_no: ci + 1,
          ceiling_ref: c.reference,
          kind: l.kind,
          code: l.code,
          product: l.label,
          unit: l.unit,
          qty: l.qty,
          unit_price: totals.currency === 'PLN' ? l.unitPricePln : l.unitPriceEur,
          line_total: totals.currency === 'PLN' ? l.lineTotalPln : l.lineTotalEur,
          note: l.status === 'ok' ? l.note ?? null : l.status === 'no_row' ? 'no pricebook row' : `no ${c.quote.market} price`,
        };
      }),
    );
    if (lines.length) {
      const { error: lineErr } = await supabase.from('portal_order_lines').insert(lines);
      if (lineErr) log('storeOrderLines', new Error(lineErr.message));
    }
    return order;
  } catch (err) {
    log('storeOrder', err);
    return null;
  }
}

/** The account's own orders; every order for an admin. */
export async function listOrders(profile: PortalProfile): Promise<PortalOrderRow[] | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  try {
    let query = supabase.from('portal_orders').select('*').order('created_at', { ascending: false }).limit(400);
    if (profile.role !== 'admin') query = query.eq('email', profile.email);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as PortalOrderRow[];
  } catch (err) {
    log('listOrders', err);
    return null;
  }
}

/** One order plus its frozen lines, scoped to the caller. */
export async function getOrder(
  profile: PortalProfile,
  reference: string,
): Promise<{ order: PortalOrderRow; lines: PortalOrderLineRow[] } | null> {
  const supabase = createServiceClient();
  if (!supabase) return null;
  try {
    let query = supabase.from('portal_orders').select('*').eq('reference', reference);
    if (profile.role !== 'admin') query = query.eq('email', profile.email);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const order = data as PortalOrderRow;
    const { data: lines } = await supabase
      .from('portal_order_lines')
      .select('line_no, ceiling_no, ceiling_ref, kind, code, product, unit, qty, unit_price, line_total, note')
      .eq('order_id', order.id)
      .order('line_no');
    return { order, lines: (lines ?? []) as PortalOrderLineRow[] };
  } catch (err) {
    log('getOrder', err);
    return null;
  }
}

/** Admin: move an order along its lifecycle, or leave an internal note. */
export async function updateOrder(
  id: string,
  patch: { status?: PortalOrderStatus; internal_note?: string | null },
): Promise<boolean> {
  const supabase = createServiceClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('portal_orders')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  } catch (err) {
    log('updateOrder', err);
    return false;
  }
}
