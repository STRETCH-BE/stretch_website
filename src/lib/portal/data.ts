// ============================================================================
// CLIENT PORTAL — pricebook data access
//
// Supabase mode: rows come from the `pricebook` table through the USER's own
// session, so Postgres row-level security enforces market visibility even if
// application code had a bug. Demo mode: rows come from the bundled sample
// JSON and are filtered in code. Both paths return the same shape.
// ============================================================================
import type { PortalSession, PricebookMeta, PriceRow } from './types';
import { categoryRank, priceGroupForTier } from './types';
import { createRscClient, isSupabaseConfigured } from './supabase';

type Pricebook = { rows: PriceRow[]; meta: PricebookMeta };

function sortRows(rows: PriceRow[]): PriceRow[] {
  return rows
    .slice()
    .sort((a, b) => categoryRank(a.category) - categoryRank(b.category) || a.sort - b.sort);
}

function visibleToProfile(row: PriceRow, session: PortalSession): boolean {
  const p = session.profile;
  if (p.role === 'admin' || p.allMarkets) return true;
  // The account's own tier group, plus any extra groups granted via markets[].
  return row.market === priceGroupForTier(p.accountType) || p.markets.includes(row.market);
}

async function demoPricebook(session: PortalSession): Promise<Pricebook> {
  // Dynamic import keeps the (large) sample JSON out of every other page's
  // module graph; it only ever loads server-side.
  const demo = (await import('./demo-pricebook.json')).default as {
    meta: PricebookMeta;
    rows: PriceRow[];
  };
  return {
    meta: demo.meta,
    rows: sortRows(demo.rows.filter((r) => visibleToProfile(r, session))),
  };
}

// Supabase caps every PostgREST response at 1000 rows regardless of .limit(),
// so the pricebook (1500+ rows) must be fetched page by page.
const PAGE = 1000;

async function fetchAllRows(
  supabase: ReturnType<typeof createRscClient>,
  columns: string,
): Promise<PriceRow[]> {
  const all: PriceRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('pricebook')
      .select(columns)
      .order('sort', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`pricebook query failed: ${error.message}`);
    const page = (data ?? []) as unknown as PriceRow[];
    all.push(...page);
    if (page.length < PAGE) return all;
  }
}

/** All pricebook rows the signed-in account is allowed to see, plus metadata. */
export async function getPricebook(session: PortalSession): Promise<Pricebook> {
  if (!isSupabaseConfigured() || session.demo) return demoPricebook(session);

  const supabase = createRscClient();
  const BASE_COLUMNS =
    'category, code, product, unit, market, price_eur, price_pln, product_group, seq, sort';
  const [rows, { data: meta }] = await Promise.all([
    // `type` is a later addition — fall back for databases still on the old
    // schema (rows then simply carry no type and the type filter stays hidden).
    fetchAllRows(supabase, `type, ${BASE_COLUMNS}`).catch(() =>
      fetchAllRows(supabase, BASE_COLUMNS),
    ),
    supabase.from('pricebook_meta').select('version, fx_eur_pln, source, updated_at').maybeSingle(),
  ]);

  return {
    rows: sortRows(rows),
    meta: {
      version: meta?.version ?? '—',
      fx_eur_pln: meta?.fx_eur_pln ?? null,
      source: meta?.source ?? null,
      updated_at: meta?.updated_at ?? '',
    },
  };
}
