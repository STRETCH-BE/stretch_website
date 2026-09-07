#!/usr/bin/env node
// ============================================================================
// STRETCH CLIENT PORTAL — kit-configurator option seeder
//
//   node scripts/seed-configurator-options.mjs            (dry run — prints)
//   node scripts/seed-configurator-options.mjs --write    (inserts)
//
// Reads the LIVE pricebook with the service role and proposes a starter
// catalogue for public.configurator_options. Everything it creates is
// active = false: nothing reaches the configurator until Michael has opened
// the admin Configurator tab and switched it on.
//
// It never writes a price and never touches the pricebook.
//
// Required env vars (put them in .env.local or export them):
//   NEXT_PUBLIC_SUPABASE_URL   — https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  — service-role key (Settings → API)
//
// --from-demo reads src/lib/portal/demo-pricebook.json instead of Supabase,
// so the classification can be reviewed without database access.
// ============================================================================
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// --- tiny .env.local loader (no extra dependency) ---------------------------
for (const envFile of ['.env.local', '.env']) {
  if (!existsSync(envFile)) continue;
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const WRITE = process.argv.includes('--write');
const FROM_DEMO = process.argv.includes('--from-demo');

// ---------------------------------------------------------------------------
// Category map — the REAL category names in the pricebook (checked against the
// workbook, not assumed). Anything not listed here lands in "unclassified".
// ---------------------------------------------------------------------------
const CEILING_CATEGORIES = new Set(['Ceilings made-to-measure', 'Cut to measure']);
const PROFILE_CATEGORIES = new Set([
  'Profiles ALU/PVC',
  'Profiles ALU',
  'Profiles PVC',
  'Profiles akaplast PVC',
]);
const CORNER_CATEGORIES = new Set(['Profile accessories', 'Profiles accessories']);
const ACCESSORY_CATEGORIES = new Set(['Accessories PVC']);
// Light supports. The WHOLE category is offered (spotholders, round and square
// supports, the chandelier support, perforated tape, dimmers) — an installer
// mounting lights buys from all of it, so no term filter here.
const LIGHT_SUPPORT_CATEGORIES = new Set(['Lighting accessories']);
const ABSORBER_CATEGORIES = new Set(['Absorbers - polyesterwool']);
const LIGHT_CATEGORIES = new Set(['Tracklighting 48V', 'Tracklighting', 'Light fixtures', 'LED modules']);

const CORNER_TERMS = /(corner|angle|hoek|k[aą]t|90°|45°)/i;
const TRANSITION_TERMS = /(transition|angle profile|corner 90|separation|level)/i;
const PLATFORM_TERMS = /(platform|ring|square|cross|spotholder|light support)/i;
const ABSORBER_TERMS = /(fleece|absorb|acoustic|polyesterwo|vlies)/i;

// ---------------------------------------------------------------------------
// Parsing — product name → foil matrix columns
// ---------------------------------------------------------------------------

/**
 * Roll width in cm. Two spellings live in the pricebook:
 *   PVC    "MSD Mat White 580 cm"      → 580
 *   fabric "308 T 3,35 0004 Blanc"     → 335   (metres, comma decimal)
 *          "495D ... 0003 2,0m"        → 200
 */
export function parseWidthCm(product) {
  const cm = product.match(/(\d{2,4})\s*cm\b/i);
  if (cm) return Number(cm[1]);
  // metres with a comma or dot, optionally followed by m — take the FIRST,
  // which is where the fabric pricelist puts the width.
  const m = product.match(/(?:^|\s)(\d{1,2})[.,](\d{1,2})\s*m?(?=\s|$)/);
  if (m) return Math.round(Number(`${m[1]}.${m[2]}`) * 100);
  return null;
}

/** matte | satin | gloss | translucent | print, or null when unrecognised. */
export function parseFinish(product) {
  const p = product.toLowerCase();
  if (/\btranslucen/.test(p)) return 'translucent';
  if (/\bprint\b/.test(p)) return 'print';
  if (/\bgloss(y)?\b|\bbrillant\b/.test(p)) return 'gloss';
  if (/\bsatin\b/.test(p)) return 'satin';
  if (/\bmat(te|t)?\b/.test(p)) return 'matte';
  return null;
}

/** white | colour | black. Matches BOTH spellings — the live data says Color. */
export function parseColourGroup(product) {
  const p = product.toLowerCase();
  if (/\bcolou?r\b/.test(p)) return 'colour';
  if (/\bblack\b|\bnoir\b|\bzwart\b/.test(p) && !/\bwhite\b|\bblanc\b/.test(p)) return 'black';
  if (/\bwhite\b|\bblanc\b|\bwit\b/.test(p)) return 'white';
  return null;
}

/** standard | acoustic | translucent for fabric. */
export function parseFabricKind(product) {
  const p = product.toLowerCase();
  if (/acoustic|acoustique|micro perf/.test(p)) return 'acoustic';
  if (/translucid|translucen/.test(p)) return 'translucent';
  return 'standard';
}

/** PVC | fabric, taken from the workbook's Type column when it is populated. */
export function parseMaterial(row) {
  const t = (row.type || '').toLowerCase();
  if (t.includes('fabric') || t.includes('textile') || t.includes('polyester')) return 'fabric';
  if (t.includes('pvc')) return 'PVC';
  // Fall back on the category: "Cut to measure" is the fabric pricelist.
  return row.category === 'Cut to measure' ? 'fabric' : 'PVC';
}

function slugify(...parts) {
  return parts
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** 'pc' / 'pc.' / 'm' / 'm1' / 'm²' / 'roll' / 'pack' → a normalised unit. */
function normUnit(unit) {
  const u = (unit || '').toLowerCase().replace(/\./g, '').trim();
  if (u === 'm2' || u === 'm²') return 'm2';
  if (u === 'm' || u === 'm1') return 'm';
  if (u === 'pc' || u === 'pcs' || u === 'piece') return 'pc';
  return u || 'pc';
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

function proposeFor(product, rows) {
  const first = rows[0];
  const cat = first.category;
  const unit = normUnit(first.unit);
  const base = {
    label: product,
    match_code: first.code || null,
    match_category: first.code ? null : cat,
    match_product: first.code ? null : product,
    match_seq: first.seq ?? 1,
    sort: first.sort ?? 0,
    active: false,
  };

  if (CEILING_CATEGORIES.has(cat)) {
    const material = parseMaterial(first);
    const width = parseWidthCm(product);
    return {
      ...base,
      kind: 'ceiling',
      slug: slugify('foil', product),
      material,
      finish: material === 'PVC' ? parseFinish(product) : null,
      colour_group: material === 'PVC' ? parseColourGroup(product) : null,
      fabric_kind: material === 'fabric' ? parseFabricKind(product) : null,
      max_width_cm: width,
      qty_rule: 'area',
      round_mode: 'exact',
      _warn: width ? null : 'no roll width could be parsed from the name',
    };
  }

  if (PROFILE_CATEGORIES.has(cat)) {
    const isTransition = TRANSITION_TERMS.test(product);
    // Read the UNIT: 'm' sells per metre, everything else per 2 m piece.
    const perMetre = unit === 'm';
    return {
      ...base,
      kind: isTransition ? 'transition' : 'profile',
      slug: slugify(isTransition ? 'trans' : 'prof', first.code || product),
      // A profile row is named "Aluminium profile" for all 14 codes, so the
      // code is the only thing that identifies it — label it with both.
      label: first.code && first.code !== product ? `${product} (${first.code})` : product,
      qty_rule: isTransition
        ? perMetre ? 'fold_edge_m' : 'fold_edge_pieces'
        : perMetre ? 'perimeter_m' : 'perimeter_pieces',
      piece_length_m: perMetre ? null : 2,
      round_mode: perMetre ? 'exact' : 'ceil',
    };
  }

  if (CORNER_CATEGORIES.has(cat) && CORNER_TERMS.test(product)) {
    return { ...base, kind: 'corner', slug: slugify('corner', first.code || product), qty_rule: 'per_corner' };
  }

  if (ABSORBER_CATEGORIES.has(cat) || (ACCESSORY_CATEGORIES.has(cat) && ABSORBER_TERMS.test(product))) {
    // Sold by m² → the surface straight through. Sold by the piece → the SAME
    // surface, converted by the sheet size in the name (1200mm x 1000mm).
    const sheet = product.match(/(\d{3,4})\s*mm\s*[x*]\s*(\d{3,4})\s*mm/i);
    const sheetM2 = sheet ? (Number(sheet[1]) / 1000) * (Number(sheet[2]) / 1000) : null;
    const isArea = unit === 'm2';
    return {
      ...base,
      kind: 'absorber',
      slug: slugify('abs', first.code || product),
      qty_rule: 'area',
      qty_factor: isArea ? 1 : sheetM2 ? Number((1 / sheetM2).toFixed(4)) : 1,
      round_mode: isArea ? 'exact' : 'ceil',
      _warn:
        isArea || sheetM2
          ? null
          : `sold per ${unit} but no sheet size in the name — set qty_factor by hand`,
    };
  }

  if (LIGHT_SUPPORT_CATEGORIES.has(cat)) {
    return {
      ...base,
      kind: 'platform',
      slug: slugify('plat', first.code || product),
      qty_rule: 'per_unit',
    };
  }

  if (ACCESSORY_CATEGORIES.has(cat) && PLATFORM_TERMS.test(product)) {
    return {
      ...base,
      kind: 'platform',
      slug: slugify('plat', first.code || product),
      qty_rule: 'per_unit',
      // Which protective ring pairs with which platform is Michael's call
      // (open question 5) — never guessed here.
      _warn: /platform/i.test(product) ? 'set companion_slug to its protective ring' : null,
    };
  }

  if (LIGHT_CATEGORIES.has(cat)) {
    const perMetre = unit === 'm';
    // Colour temperature makes a light_colour option. NOTE (6 Sep 2026): the
    // only K-coded rows in the pricebook are LED STRIPS in "LED modules" —
    // the 48 V tracklight spots have no colour variants at all, so the
    // configurator's light-colour selector stays hidden until rows exist.
    const kelvin = product.match(/\b(\d{4})\s?k\b/i);
    if (kelvin) {
      return {
        ...base,
        kind: 'light_colour',
        slug: slugify('lightcol', first.code || product),
        qty_rule: perMetre ? 'perimeter_m' : 'per_unit',
        round_mode: perMetre ? 'exact' : 'ceil',
      };
    }
    return {
      ...base,
      kind: 'light',
      slug: slugify('light', first.code || product),
      qty_rule: perMetre ? 'perimeter_m' : 'per_unit',
      round_mode: perMetre ? 'exact' : 'ceil',
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Load the pricebook
// ---------------------------------------------------------------------------
async function loadRows() {
  if (FROM_DEMO) {
    const demo = JSON.parse(readFileSync('src/lib/portal/demo-pricebook.json', 'utf8'));
    return demo.rows;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    console.error('(Use --from-demo to classify the bundled sample pricebook instead.)');
    process.exit(1);
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const all = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('pricebook')
      .select('type, category, code, product, unit, market, seq, sort')
      .order('sort')
      .range(from, from + 999);
    if (error) {
      console.error(`pricebook query failed: ${error.message}`);
      process.exit(1);
    }
    all.push(...data);
    if (data.length < 1000) return all;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const rows = await loadRows();
console.log(`Pricebook rows read: ${rows.length}${FROM_DEMO ? ' (bundled sample)' : ''}\n`);

// One option per distinct product, not per market row.
const byProduct = new Map();
for (const r of rows) {
  const key = `${r.category} ${r.code || ''} ${r.product} ${r.seq ?? 1}`;
  if (!byProduct.has(key)) byProduct.set(key, []);
  byProduct.get(key).push(r);
}

const proposals = [];
const unclassified = [];
const warnings = [];
const seenSlugs = new Set();

for (const [, group] of byProduct) {
  const product = group[0].product;
  const p = proposeFor(product, group);
  if (!p) {
    unclassified.push(`${group[0].category} :: ${product}`);
    continue;
  }
  const { _warn, ...option } = p;
  // Slugs are unique per (kind, slug) — suffix a collision rather than losing
  // a product silently.
  let slug = option.slug || slugify(option.kind, product);
  let n = 2;
  while (seenSlugs.has(`${option.kind}:${slug}`)) slug = `${option.slug}-${n++}`;
  seenSlugs.add(`${option.kind}:${slug}`);
  option.slug = slug;
  if (_warn) warnings.push(`${option.kind} ${slug}: ${_warn}`);
  proposals.push(option);
}

// --- report ----------------------------------------------------------------
const byKind = new Map();
for (const p of proposals) byKind.set(p.kind, (byKind.get(p.kind) ?? 0) + 1);

console.log('PROPOSED OPTIONS (all inactive until you switch them on):');
for (const [kind, n] of [...byKind].sort()) console.log(`  ${String(n).padStart(4)}  ${kind}`);

console.log('\nCEILINGS — the foil matrix that drives auto-selection:');
const ceilings = proposals.filter((p) => p.kind === 'ceiling');
const combos = new Map();
for (const c of ceilings) {
  const key =
    c.material === 'PVC' ? `PVC / ${c.finish ?? '?'} / ${c.colour_group ?? '?'}` : `fabric / ${c.fabric_kind ?? '?'}`;
  if (!combos.has(key)) combos.set(key, []);
  combos.get(key).push(c.max_width_cm ?? '?');
}
for (const [combo, widths] of [...combos].sort()) {
  console.log(`  ${combo.padEnd(34)} rolls: ${widths.sort((a, b) => a - b).join(', ')} cm`);
}
const deadEnds = [...combos].filter(([k]) => /\?/.test(k));
if (deadEnds.length) {
  console.log('\n  ⚠ combinations with an unparsed finish/colour — they will NOT be selectable:');
  for (const [k, w] of deadEnds) console.log(`      ${k} (${w.join(', ')})`);
}

if (warnings.length) {
  console.log(`\nNEEDS A HUMAN (${warnings.length}):`);
  for (const w of warnings.slice(0, 40)) console.log(`  • ${w}`);
  if (warnings.length > 40) console.log(`  … and ${warnings.length - 40} more`);
}

if (unclassified.length) {
  console.log(`\nCOULD NOT CLASSIFY (${unclassified.length}) — left out of the proposal:`);
  const shown = unclassified.slice(0, 40);
  for (const u of shown) console.log(`  • ${u}`);
  if (unclassified.length > shown.length) console.log(`  … and ${unclassified.length - shown.length} more`);
}

if (!WRITE) {
  console.log(`\nDry run — nothing written. Re-run with --write to insert ${proposals.length} inactive options.`);
  process.exit(0);
}

if (FROM_DEMO) {
  console.error('\n--write refuses to run against the bundled sample pricebook.');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

let written = 0;
for (let i = 0; i < proposals.length; i += 200) {
  const chunk = proposals.slice(i, i + 200);
  const { error } = await supabase
    .from('configurator_options')
    .upsert(chunk, { onConflict: 'kind,slug', ignoreDuplicates: true });
  if (error) {
    console.error(`insert failed: ${error.message}`);
    process.exit(1);
  }
  written += chunk.length;
}
console.log(`\nWrote ${written} options, all active = false. Open the portal admin → Configurator to curate them.`);
