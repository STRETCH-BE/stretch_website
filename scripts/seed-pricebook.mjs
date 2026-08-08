#!/usr/bin/env node
// ============================================================================
// STRETCH CLIENT PORTAL — pricebook seeder / CLI sync
//
//   node scripts/seed-pricebook.mjs "path/to/Alto Pricing System.xlsx"
//
// Reads the client-safe PriceBook columns from the workbook and replaces the
// `pricebook` table (same behaviour as the portal's admin upload). Internal
// columns (Margin %, Cost EUR, …) are never read.
//
// Required env vars (put them in .env.local or export them):
//   NEXT_PUBLIC_SUPABASE_URL   — https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  — service-role key (Settings → API)
//
// NOTE: keep the parsing rules in sync with src/lib/portal/parse-pricebook.ts.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

// --- tiny .env.local loader (no extra dependency) ---------------------------
for (const envFile of ['.env.local', '.env']) {
  if (!existsSync(envFile)) continue;
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const file = process.argv[2];

if (!file) {
  console.error('Usage: node scripts/seed-pricebook.mjs "path/to/Alto Pricing System.xlsx"');
  process.exit(1);
}
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

// --- parse (mirror of src/lib/portal/parse-pricebook.ts) --------------------
const GROUPED = new Set(['Ceilings made-to-measure', 'Rolls PVC foil', 'Foil cut to length']);
const BRAND_CANON = { BAUF: 'Bauf', NewMAt: 'NewMat', SUFITY: 'Sufity' };
const text = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
};
const price = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
};

const wb = XLSX.read(readFileSync(file), { type: 'buffer' });
const sheetName = wb.SheetNames.find((n) => n.trim().toLowerCase() === 'pricebook');
if (!sheetName) {
  console.error(`No "PriceBook" sheet found. Sheets: ${wb.SheetNames.join(', ')}`);
  process.exit(1);
}
const grid = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, raw: true, defval: null });
const headerIdx = grid.findIndex(
  (r) => Array.isArray(r) && r.some((c) => text(c) === 'Category') && r.some((c) => text(c) === 'Product'),
);
if (headerIdx === -1) {
  console.error('PriceBook sheet has no header row with "Category" and "Product".');
  process.exit(1);
}
const header = grid[headerIdx].map((c) => (text(c) ?? '').toLowerCase());
const col = (n) => header.indexOf(n.toLowerCase());
const [cType, cCat, cCode, cProd, cUnit, cMkt, cEur, cPln] = [
  col('Type'), col('Category'), col('Code'), col('Product'), col('Unit'), col('Market'), col('Price EUR'), col('Price PLN'),
];

const rows = [];
const skipped = [];
// Same-named rows with different prices are real (roll width bands etc.) —
// keep them all, disambiguated with an occurrence sequence in sheet order.
const seen = new Map();
let sort = 0;
for (let i = headerIdx + 1; i < grid.length; i++) {
  const r = grid[i];
  if (!Array.isArray(r)) continue;
  const category = text(r[cCat]);
  const product = text(r[cProd]);
  const market = text(r[cMkt]);
  if (!category || !product || !market) continue;
  const eur = price(r[cEur]);
  if (eur === null) {
    skipped.push(`${product} [${market}] — missing Price EUR`);
    continue;
  }
  const key = `${category}||${product}||${market}`;
  const seq = (seen.get(key) ?? 0) + 1;
  seen.set(key, seq);
  sort += 1;
  const token = product.split(/\s+/)[0];
  rows.push({
    type: cType === -1 ? null : text(r[cType]),
    category,
    code: cCode === -1 ? null : text(r[cCode]),
    product,
    unit: cUnit === -1 ? null : text(r[cUnit]),
    market,
    price_eur: eur,
    price_pln: cPln === -1 ? null : price(r[cPln]),
    product_group: GROUPED.has(category) ? (BRAND_CANON[token] ?? token ?? null) : null,
    seq,
    sort,
  });
}

let fx = null;
const settingsName = wb.SheetNames.find((n) => n.trim().toLowerCase() === 'settings');
if (settingsName) {
  const s = XLSX.utils.sheet_to_json(wb.Sheets[settingsName], { header: 1, raw: true, defval: null });
  const fxRow = s.find((r) => Array.isArray(r) && text(r[0]) === 'EUR → PLN');
  if (fxRow) fx = price(fxRow[1]);
}
const now = new Date();
const version = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

console.log(`Parsed ${rows.length} rows (${skipped.length} skipped). FX EUR→PLN: ${fx ?? 'n/a'}`);
for (const s of skipped) console.log(`  · skipped: ${s}`);

// --- sync -------------------------------------------------------------------
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Paged read — Supabase caps every response at 1000 rows regardless of .limit().
const existing = [];
for (let from = 0; ; from += 1000) {
  const { data, error: readError } = await supabase
    .from('pricebook')
    .select('id, category, product, market, seq')
    .order('id', { ascending: true })
    .range(from, from + 999);
  if (readError) {
    console.error('Read failed:', readError.message);
    process.exit(1);
  }
  existing.push(...(data ?? []));
  if ((data ?? []).length < 1000) break;
}
// Databases created before the `type` column: upsert without it.
const { error: typeProbe } = await supabase.from('pricebook').select('type').limit(1);
if (typeProbe) {
  console.warn('NOTE: pricebook.type column missing — run the migration in supabase/schema.sql to store the Type column.');
  for (const r of rows) delete r.type;
}

const newKeys = new Set(rows.map((r) => `${r.category}||${r.product}||${r.market}||${r.seq}`));
const staleIds = (existing ?? [])
  .filter((r) => !newKeys.has(`${r.category}||${r.product}||${r.market}||${r.seq}`))
  .map((r) => r.id);

const CHUNK = 500;
for (let i = 0; i < rows.length; i += CHUNK) {
  const { error } = await supabase
    .from('pricebook')
    .upsert(rows.slice(i, i + CHUNK), { onConflict: 'category,product,market,seq' });
  if (error) {
    console.error('Upsert failed:', error.message);
    process.exit(1);
  }
  process.stdout.write(`  upserted ${Math.min(i + CHUNK, rows.length)}/${rows.length}\r`);
}
console.log();
for (let i = 0; i < staleIds.length; i += CHUNK) {
  const { error } = await supabase.from('pricebook').delete().in('id', staleIds.slice(i, i + CHUNK));
  if (error) {
    console.error('Delete failed:', error.message);
    process.exit(1);
  }
}
await supabase.from('pricebook_meta').upsert({
  id: true,
  version,
  fx_eur_pln: fx,
  source: file.split(/[\\/]/).pop(),
  updated_at: new Date().toISOString(),
});

console.log(`Done. ${rows.length} rows live, ${staleIds.length} stale rows removed, version ${version}.`);
