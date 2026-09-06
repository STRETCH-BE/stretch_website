// /api/portal/configurator/options — admin-only option catalogue management.
//   GET    → every option + a compact pricebook index for the product picker
//   POST   → create an option
//   PATCH  → update one option { id, ...fields }
//   DELETE → remove one option (?id=)
// Uses the service-role client AFTER verifying the caller's admin session,
// exactly like /api/portal/users. Nothing here reads or writes a price: the
// catalogue only points AT pricebook rows.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/portal/auth';
import { createServiceClient, isSupabaseConfigured } from '@/lib/portal/supabase';
import { isPortalAllowedHost } from '@/lib/portal/host';
import {
  COLOUR_GROUPS,
  FABRIC_KINDS,
  FINISHES,
  MATERIALS,
  OPTION_KINDS,
  QTY_RULES,
  ROUND_MODES,
} from '@/lib/portal/configurator/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLUMNS =
  'id, kind, slug, label, description, match_code, match_category, match_product, match_seq, ' +
  'material, finish, colour_group, fabric_kind, max_width_cm, qty_rule, qty_factor, ' +
  'piece_length_m, per_n, min_qty, round_mode, companion_slug, companion_per_unit, ' +
  'requires, excludes, sort, active';

/** Fields an admin may set, with their validator. Anything else is ignored. */
const ENUMS: Record<string, readonly string[]> = {
  kind: OPTION_KINDS,
  material: MATERIALS,
  finish: FINISHES,
  colour_group: COLOUR_GROUPS,
  fabric_kind: FABRIC_KINDS,
  qty_rule: QTY_RULES,
  round_mode: ROUND_MODES,
};
const TEXT_FIELDS = ['slug', 'label', 'description', 'match_code', 'match_category', 'match_product', 'companion_slug'];
const NUMBER_FIELDS = ['match_seq', 'max_width_cm', 'qty_factor', 'piece_length_m', 'per_n', 'min_qty', 'companion_per_unit', 'sort'];

function clean(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [field, values] of Object.entries(ENUMS)) {
    if (!(field in body)) continue;
    const v = body[field];
    if (v === null || v === '') out[field] = null;
    else if (typeof v === 'string' && values.includes(v)) out[field] = v;
  }
  for (const field of TEXT_FIELDS) {
    if (!(field in body)) continue;
    const v = body[field];
    if (v === null || v === '') out[field] = field === 'slug' || field === 'label' ? undefined : null;
    else if (typeof v === 'string') out[field] = v.slice(0, 200);
  }
  for (const field of NUMBER_FIELDS) {
    if (!(field in body)) continue;
    const v = body[field];
    if (v === null || v === '') out[field] = null;
    else {
      const n = Number(v);
      if (isFinite(n)) out[field] = n;
    }
  }
  for (const field of ['requires', 'excludes']) {
    if (!(field in body)) continue;
    const v = body[field];
    if (Array.isArray(v)) out[field] = v.map(String).slice(0, 20);
  }
  if ('active' in body) out.active = Boolean(body.active);
  // Never let a null through for the NOT NULL columns.
  for (const k of ['qty_factor', 'min_qty', 'companion_per_unit', 'sort']) {
    if (out[k] === null) delete out[k];
  }
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
  return out;
}

function service() {
  const s = createServiceClient();
  return s;
}

async function guard(request: NextRequest | Request) {
  if (!isPortalAllowedHost(request.headers.get('host'))) {
    return { error: NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 }) };
  }
  const session = await getAdminSession();
  if (!session) return { error: NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 }) };
  if (!isSupabaseConfigured() || session.demo) {
    return { error: NextResponse.json({ ok: true, demo: true, options: [], products: [] }) };
  }
  const s = service();
  if (!s) {
    return {
      error: NextResponse.json(
        { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' },
        { status: 500 },
      ),
    };
  }
  return { supabase: s };
}

export async function GET(request: Request) {
  const { supabase, error } = await guard(request);
  if (error) return error;

  const { data: options, error: optErr } = await supabase!
    .from('configurator_options')
    .select(COLUMNS)
    .order('kind')
    .order('sort')
    .order('id');
  if (optErr) {
    // The table is a later addition — say so plainly instead of a 500 page.
    return NextResponse.json(
      { ok: false, error: optErr.message, needsMigration: /relation .* does not exist/i.test(optErr.message) },
      { status: 500 },
    );
  }

  // A compact index of the pricebook for the product picker AND for resolving
  // "needs attention" in the browser: one entry per distinct product, with its
  // price per market. No margins, no costs — those never leave the Excel.
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error: pbErr } = await supabase!
      .from('pricebook')
      .select('category, code, product, unit, market, price_eur, price_pln, seq, sort')
      .order('sort')
      .range(from, from + 999);
    if (pbErr) return NextResponse.json({ ok: false, error: pbErr.message }, { status: 500 });
    rows.push(...(data ?? []));
    if ((data ?? []).length < 1000) break;
  }

  const index = new Map<string, Record<string, unknown>>();
  for (const r of rows) {
    const key = `${r.category}|${r.code ?? ''}|${r.product}|${r.seq}`;
    let entry = index.get(key);
    if (!entry) {
      entry = {
        category: r.category,
        code: r.code,
        product: r.product,
        unit: r.unit,
        seq: r.seq,
        sort: r.sort,
        prices: {} as Record<string, number>,
      };
      index.set(key, entry);
    }
    (entry.prices as Record<string, number>)[String(r.market)] = Number(r.price_eur);
  }

  return NextResponse.json({ ok: true, options: options ?? [], products: [...index.values()] });
}

export async function POST(request: NextRequest) {
  const { supabase, error } = await guard(request);
  if (error) return error;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }
  const patch = clean(body);
  if (!patch.kind || !patch.slug || !patch.label || !patch.qty_rule) {
    return NextResponse.json({ ok: false, error: 'kind, slug, label and qty_rule are required' }, { status: 400 });
  }
  const { data, error: insErr } = await supabase!
    .from('configurator_options')
    .insert({ active: false, ...patch })
    .select(COLUMNS)
    .single();
  if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, option: data });
}

export async function PATCH(request: NextRequest) {
  const { supabase, error } = await guard(request);
  if (error) return error;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }
  const id = Number(body.id);
  if (!isFinite(id) || id <= 0) return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  const patch = clean(body);
  if (Object.keys(patch).length === 0) return NextResponse.json({ ok: false, error: 'nothing_to_update' }, { status: 400 });
  const { data, error: updErr } = await supabase!
    .from('configurator_options')
    .update(patch)
    .eq('id', id)
    .select(COLUMNS)
    .single();
  if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, option: data });
}

export async function DELETE(request: NextRequest) {
  const { supabase, error } = await guard(request);
  if (error) return error;
  const id = Number(request.nextUrl.searchParams.get('id'));
  if (!isFinite(id) || id <= 0) return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  const { error: delErr } = await supabase!.from('configurator_options').delete().eq('id', id);
  if (delErr) return NextResponse.json({ ok: false, error: delErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
