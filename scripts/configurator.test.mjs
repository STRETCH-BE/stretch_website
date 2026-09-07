// Kit-configurator regression tests — part of `npm test`.
// Pins the two pieces that decide what a customer is quoted:
//   • pickFoil — which roll the engine picks, and when it welds;
//   • resolveOption — a missing row / missing market price never becomes €0;
//   • buildBom — geometry, profiles, corners, welds, companions, absorber.
// Loads the TypeScript sources directly via ts.transpileModule — no build step.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadTs(relPath, extraModules = {}) {
  const path = fileURLToPath(new URL(relPath, import.meta.url));
  const js = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  const localRequire = (id) => (id in extraModules ? extraModules[id] : require(id));
  new Function('require', 'module', 'exports', js)(localRequire, mod, mod.exports);
  return mod.exports;
}

const types = loadTs('../src/lib/portal/configurator/types.ts');
const { pickFoil, foilFamily, weldsForPanel } = loadTs('../src/lib/portal/configurator/foil.ts', {
  './types': types,
});
// options.ts imports the Supabase client; stub it — resolveOption is pure.
const { resolveOption } = loadTs('../src/lib/portal/configurator/options.ts', {
  './types': types,
  '../types': {},
  '../supabase': { createServiceClient: () => null },
});
const { buildBom } = loadTs('../src/lib/portal/configurator/bom.ts', {
  './types': types,
  './foil': { pickFoil, foilFamily, weldsForPanel },
});
const { parseConfig } = loadTs('../src/lib/portal/configurator/parse-config.ts', {
  './types': types,
  './bom': { buildBom },
});

let failures = 0;
function check(label, ok, detail = '') {
  if (ok) {
    console.log(`  ok  ${label}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}
function near(a, b, eps = 0.005) {
  return typeof a === 'number' && Math.abs(a - b) < eps;
}

// ---------------------------------------------------------------------------
// Fixtures — shaped like the real pricebook (MSD matte white 320/500/580 …).
// ---------------------------------------------------------------------------
let nextId = 1;
function opt(over = {}) {
  return {
    id: nextId++,
    kind: 'ceiling',
    slug: `o${nextId}`,
    label: 'Option',
    description: null,
    matchCode: null,
    matchCategory: 'Ceilings made-to-measure',
    matchProduct: 'X',
    matchSeq: 1,
    material: 'PVC',
    finish: 'matte',
    colourGroup: 'white',
    fabricKind: null,
    maxWidthCm: 320,
    qtyRule: 'area',
    qtyFactor: 1,
    pieceLengthM: null,
    perN: null,
    minQty: 0,
    roundMode: 'ceil',
    companionSlug: null,
    companionPerUnit: 1,
    requires: [],
    excludes: [],
    sort: 0,
    active: true,
    ...over,
  };
}

const matteWhite320 = opt({ slug: 'msd-matte-white-320', label: 'MSD Mat White 320 cm', maxWidthCm: 320, matchProduct: 'MSD Mat White 320 cm' });
const matteWhite500 = opt({ slug: 'msd-matte-white-500', label: 'MSD Mat White 500 cm', maxWidthCm: 500, matchProduct: 'MSD Mat White 500 cm' });
const matteWhite580 = opt({ slug: 'msd-matte-white-580', label: 'MSD Mat White 580 cm', maxWidthCm: 580, matchProduct: 'MSD Mat White 580 cm' });
const glossWhite320 = opt({ slug: 'msd-gloss-white-320', label: 'MSD Glossy White 320 cm', finish: 'gloss', maxWidthCm: 320, matchProduct: 'MSD Glossy White 320 cm' });
const glossWhite500 = opt({ slug: 'msd-gloss-white-500', label: 'MSD Glossy White 500 cm', finish: 'gloss', maxWidthCm: 500, matchProduct: 'MSD Glossy White 500 cm' });
const fabricAcoustic200 = opt({
  slug: 'fab-495d-200', label: '495D Acoustic 2,00 m', material: 'fabric', finish: null,
  colourGroup: null, fabricKind: 'acoustic', maxWidthCm: 200,
  matchCategory: 'Cut to measure', matchProduct: '495D Acoustic Covering Color White 0003 2,0m',
});
const inactive580 = opt({ slug: 'inactive', maxWidthCm: 580, active: false, matchProduct: 'inactive' });

const CEILINGS = [matteWhite500, matteWhite320, matteWhite580, glossWhite320, glossWhite500, fabricAcoustic200, inactive580];

console.log('\npickFoil — selection and welding');
{
  const pvcMatteWhite = { material: 'PVC', finish: 'matte', colourGroup: 'white' };

  const family = foilFamily(pvcMatteWhite, CEILINGS);
  check('family is narrowest-first and excludes inactive rolls',
    family.map((o) => o.maxWidthCm).join(',') === '320,500,580',
    family.map((o) => o.maxWidthCm).join(','));

  const exact = pickFoil(pvcMatteWhite, 3.2, CEILINGS);
  check('exact fit takes the roll of that width (3.20 m → 320 cm)', exact.option === matteWhite320 && !exact.weldRequired);

  const narrowest = pickFoil(pvcMatteWhite, 3.4, CEILINGS);
  check('3.4 m takes the NARROWEST that fits (500, not 580)', narrowest.option === matteWhite500 && !narrowest.weldRequired);
  check('reason names the roll and says no weld',
    /500 cm roll covers your 3.4 m span in one piece — no weld\./.test(narrowest.reason), narrowest.reason);

  const stepUp = pickFoil(pvcMatteWhite, 5.5, CEILINGS);
  check('5.5 m matte white steps up to the 580 roll instead of welding', stepUp.option === matteWhite580 && !stepUp.weldRequired);

  const weld = pickFoil({ material: 'PVC', finish: 'gloss', colourGroup: 'white' }, 5.5, CEILINGS);
  check('5.5 m gloss white has no 580 roll → widest + weld', weld.option === glossWhite500 && weld.weldRequired);
  check('weld reason is plain language',
    /Widest roll in this finish is 500 cm, so the ceiling is welded to reach 5.5 m\./.test(weld.reason), weld.reason);

  const empty = pickFoil({ material: 'PVC', finish: 'satin', colourGroup: 'black' }, 3, CEILINGS);
  check('empty family → no option and the pricelist message',
    empty.option === null && empty.reason === 'This combination is not in the pricelist.' && !empty.weldRequired);

  const fab = pickFoil({ material: 'fabric', fabricKind: 'acoustic' }, 1.9, CEILINGS);
  check('fabric is matched on fabric_kind, not finish/colour', fab.option === fabricAcoustic200 && !fab.weldRequired);
  const fabWeld = pickFoil({ material: 'fabric', fabricKind: 'acoustic' }, 4.2, CEILINGS);
  check('fabric wider than its roll welds', fabWeld.option === fabricAcoustic200 && fabWeld.weldRequired);

  check('weldsForPanel: 5.5 m short side on a 5.0 m roll = 1 weld of 8.4 m',
    weldsForPanel({ a: 8.4, b: 5.5 }, 500).welds === 1 && near(weldsForPanel({ a: 8.4, b: 5.5 }, 500).metres, 8.4));
  check('weldsForPanel: within the roll = no weld', weldsForPanel({ a: 8.4, b: 3.4 }, 500).welds === 0);
  check('weldsForPanel: 11 m short side on a 3.2 m roll = 3 welds',
    weldsForPanel({ a: 12, b: 11 }, 320).welds === 3);
}

// ---------------------------------------------------------------------------
console.log('\nresolveOption — a missing price is never €0');
{
  const rows = [
    { category: 'Ceilings made-to-measure', code: null, product: 'MSD Mat White 500 cm', unit: 'm²', market: 'Installer', price_eur: 12.5, price_pln: 52.9, seq: 1, sort: 1, type: null, product_group: null },
    { category: 'Ceilings made-to-measure', code: null, product: 'MSD Mat White 500 cm', unit: 'm²', market: 'B2C', price_eur: 28, price_pln: null, seq: 1, sort: 1, type: null, product_group: null },
    { category: 'Cut to measure', code: null, product: '495D Acoustic Covering Color White 0003 2,0m', unit: 'm²', market: 'Installer', price_eur: 31.4, price_pln: null, seq: 1, sort: 2, type: null, product_group: null },
    { category: 'Accessories PVC', code: 'SLA-TR-300', product: 'PROTECTIVE RINGS 300', unit: 'pc', market: 'Installer', price_eur: 3, price_pln: null, seq: 1, sort: 3, type: null, product_group: null },
    { category: 'Accessories PVC', code: 'SLA-TR-300', product: 'PROTECTIVE RINGS 300 (bis)', unit: 'pc', market: 'Installer', price_eur: 9, price_pln: null, seq: 2, sort: 4, type: null, product_group: null },
  ];

  const ok = resolveOption(matteWhite500, 'Installer', rows);
  check('resolves to the row for the account market', ok.status === 'ok' && ok.priceEur === 12.5 && ok.unit === 'm²');

  const otherMarket = resolveOption(matteWhite500, 'Producer/Reseller', rows);
  check("product exists but not for this market → 'no_price', price null",
    otherMarket.status === 'no_price' && otherMarket.priceEur === null);

  const fabricForB2C = resolveOption(fabricAcoustic200, 'B2C', rows);
  check("fabric on a B2C account → 'no_price', never another market's price",
    fabricForB2C.status === 'no_price' && fabricForB2C.priceEur === null);

  const gone = resolveOption(matteWhite320, 'Installer', rows);
  check("a product the Excel dropped → 'no_row', price null", gone.status === 'no_row' && gone.priceEur === null);

  const ring = opt({ kind: 'platform', matchCode: 'SLA-TR-300', matchCategory: null, matchProduct: null, matchSeq: 2 });
  check('a duplicated code is disambiguated by match_seq', resolveOption(ring, 'Installer', rows).priceEur === 9);
  const ringDefault = opt({ kind: 'platform', matchCode: 'SLA-TR-300', matchCategory: null, matchProduct: null, matchSeq: null });
  check('a duplicated code with no seq takes the lowest seq, deterministically',
    resolveOption(ringDefault, 'Installer', rows).priceEur === 3);
}

// ---------------------------------------------------------------------------
console.log('\nbuildBom — geometry, quantities, companions');
{
  const profileM = opt({ kind: 'profile', slug: 'alu-m', label: 'Aluminium profile', qtyRule: 'perimeter_m', matchCode: 'SP-PVC-W-AA-01', roundMode: 'exact', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const profilePc = opt({ kind: 'profile', slug: 'alu-pc', label: 'PVC profile 2 m', qtyRule: 'perimeter_pieces', pieceLengthM: 2, matchCode: 'SP-PVC-C-AA-02', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const cornerIn = opt({ kind: 'corner', slug: 'corner-in', label: 'Inside corner', qtyRule: 'per_corner', matchCode: 'C-IN', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const transition = opt({ kind: 'transition', slug: 'trans', label: 'Angle profile', qtyRule: 'fold_edge_m', matchCode: 'T-1', roundMode: 'exact', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const ring = opt({ kind: 'platform', slug: 'ring-100', label: 'Protective ring 100', qtyRule: 'per_unit', matchCode: 'SLA-TR-100', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const platform = opt({ kind: 'platform', slug: 'plat-100', label: 'Chandelier platform 100', qtyRule: 'per_unit', matchCode: 'PLAT-100', companionSlug: 'ring-100', companionPerUnit: 1, maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const platform2 = opt({ kind: 'platform', slug: 'plat-200', label: 'Chandelier platform 200', qtyRule: 'per_unit', matchCode: 'PLAT-200', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const absorberM2 = opt({ kind: 'absorber', slug: 'abs-m2', label: 'Polyesterwool D20/50 (m²)', qtyRule: 'area', matchCode: 'D20/50-W (m²)', roundMode: 'exact', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const absorberSheet = opt({ kind: 'absorber', slug: 'abs-sheet', label: 'Polyesterwool sheet 1.2 × 1.0 m', qtyRule: 'area', qtyFactor: 1 / 1.2, roundMode: 'ceil', matchCode: 'D40/40', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const light = opt({ kind: 'light', slug: 'spot', label: 'Magnetic Grille Light 10W', qtyRule: 'per_unit', matchCode: 'SL-MGL-2010S', companionSlug: 'driver', companionPerUnit: 1, maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const driver = opt({ kind: 'light', slug: 'driver', label: 'Power supply 60W', qtyRule: 'per_n_units', perN: 6, matchCode: 'LPV-60-24', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const weldService = opt({ kind: 'service', slug: 'weld', label: 'Welding', qtyRule: 'weld_m', matchCode: 'S-WELD', roundMode: 'exact', maxWidthCm: null, material: null, finish: null, colourGroup: null });

  const CATALOGUE = [...CEILINGS, profileM, profilePc, cornerIn, transition, ring, platform, platform2, absorberM2, absorberSheet, light, driver, weldService];

  const base = {
    length: 4.2, width: 3.4, shape: 'flat', slopeRun: 0, foldSide: 'length',
    material: 'PVC', finish: 'matte', colourGroup: 'white', fabricKind: null,
    profileSlug: 'alu-m', cornersInside: null, cornersOutside: null,
    platforms: [], absorberSlug: null, lights: [],
  };

  const flat = buildBom(base, CATALOGUE);
  check('flat: surface = L × W', near(flat.area, 14.28), String(flat.area));
  check('flat: perimeter = 2(L + W)', near(flat.perimeter, 15.2), String(flat.perimeter));
  check('flat: widest span = the shorter side', near(flat.need, 3.4), String(flat.need));
  check('flat 3.4 m span picks the 500 roll, no weld', flat.foil.option === matteWhite500 && !flat.foil.weldRequired);
  check('flat: profile in metres = perimeter', near(flat.lines.find((l) => l.slug === 'alu-m').qty, 15.2));
  check('flat: 4 inside corners, no outside', flat.lines.find((l) => l.slug === 'corner-in').qty === 4);
  check('flat: no fold-edge line', !flat.lines.some((l) => l.slug === 'trans'));

  const sloped = buildBom({ ...base, shape: 'sloped', slopeRun: 1.2, foldSide: 'length' }, CATALOGUE);
  check('sloped: surface adds the slope panel (14.28 + 4.2 × 1.2)', near(sloped.area, 19.32), String(sloped.area));
  check('sloped: perimeter = 2L + 2W + 2S', near(sloped.perimeter, 17.6), String(sloped.perimeter));
  check('sloped: fold edge = the shared side, in metres', near(sloped.lines.find((l) => l.slug === 'trans').qty, 4.2));
  check('sloped: corner defaults become 4 inside + 2 outside', sloped.cornersInside === 4 && sloped.cornersOutside === 2);
  check('flat: corner defaults are 4 inside + 0 outside', flat.cornersInside === 4 && flat.cornersOutside === 0);
  const overridden = buildBom({ ...base, cornersInside: 6, cornersOutside: 3 }, CATALOGUE);
  check('an explicit corner count always wins over the default',
    overridden.lines.find((l) => l.slug === 'corner-in').qty === 9);
  check('sloped widest span is still the widest of the two panels',
    near(sloped.need, 3.4), String(sloped.need));

  const slopedWidth = buildBom({ ...base, shape: 'sloped', slopeRun: 1.2, foldSide: 'width' }, CATALOGUE);
  check('sloped on the width side: perimeter is the same 2L + 2W + 2S', near(slopedWidth.perimeter, 17.6));
  check('sloped on the width side: fold edge is W', near(slopedWidth.lines.find((l) => l.slug === 'trans').qty, 3.4));

  const pieces = buildBom({ ...base, profileSlug: 'alu-pc' }, CATALOGUE);
  check('profile sold per 2 m piece: ceil(15.2 / 2) = 8', pieces.lines.find((l) => l.slug === 'alu-pc').qty === 8);

  // A long room, so the WIDTH is the constrained span: 3.4 m → 5.5 m.
  const long = { ...base, length: 8 };
  const narrow = buildBom(long, CATALOGUE);
  check('8.0 × 3.4 matte white: span 3.4 → the 500 roll, no weld',
    narrow.foil.option === matteWhite500 && !narrow.weldCount);
  const stepped = buildBom({ ...long, width: 5.5 }, CATALOGUE);
  check('same room at 5.5 m wide steps UP to the 580 roll instead of welding',
    stepped.foil.option === matteWhite580 && stepped.weldCount === 0 && !stepped.lines.some((l) => l.slug === 'weld'));
  const gloss = buildBom({ ...long, width: 5.5, finish: 'gloss' }, CATALOGUE);
  check('the same change on gloss white (no 580 roll) welds and prices the weld service',
    gloss.foil.weldRequired && gloss.lines.some((l) => l.slug === 'weld'));
  check('weld length = 1 weld × the long side (8.0 m)', near(gloss.lines.find((l) => l.slug === 'weld').qty, 8), String(gloss.lines.find((l) => l.slug === 'weld')?.qty));
  check('weld emits a plain-language note', gloss.notes.some((n) => /weld/i.test(n)));

  const multi = buildBom({ ...base, platforms: [{ slug: 'plat-100', qty: 3 }, { slug: 'plat-200', qty: 2 }] }, CATALOGUE);
  check('two platform types both price', multi.lines.find((l) => l.slug === 'plat-100').qty === 3 && multi.lines.find((l) => l.slug === 'plat-200').qty === 2);
  check('a platform pulls in its protective ring as a VISIBLE line', multi.lines.find((l) => l.slug === 'ring-100')?.qty === 3);

  const lit = buildBom({ ...base, lights: [{ slug: 'spot', qty: 7 }] }, CATALOGUE);
  check('lights price per unit', lit.lines.find((l) => l.slug === 'spot').qty === 7);
  check('one driver per 6 lights → 2 for 7 lights', lit.lines.find((l) => l.slug === 'driver').qty === 2);

  // Lighting is a LIST, like the platforms: a real ceiling mixes fittings.
  const spot3000 = opt({ kind: 'light_colour', slug: 'spot-3000k', label: 'Magnetic Grille Light 10W 3000K', qtyRule: 'per_unit', matchCode: 'SL-MGL-2010S-30', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const gu10 = opt({ kind: 'light', slug: 'gu10', label: 'GU10 fitting', qtyRule: 'per_unit', matchCode: 'GU10-Fitting', maxWidthCm: null, material: null, finish: null, colourGroup: null });
  const COLOURED = [...CATALOGUE, spot3000, gu10];
  const mixed = buildBom(
    { ...base, lights: [{ slug: 'spot', qty: 4 }, { slug: 'gu10', qty: 4 }, { slug: 'spot-3000k', qty: 2 }] },
    COLOURED,
  );
  check('three light types all price, each once',
    mixed.lines.filter((l) => l.slug === 'spot').length === 1 &&
    mixed.lines.find((l) => l.slug === 'spot').qty === 4 &&
    mixed.lines.find((l) => l.slug === 'gu10').qty === 4 &&
    mixed.lines.find((l) => l.slug === 'spot-3000k').qty === 2);
  // A colour temperature is a pricebook row of the SAME fitting. It is picked
  // INSTEAD of the plain fitting, so the fitting can never be charged twice.
  const coloured = buildBom({ ...base, lights: [{ slug: 'spot-3000k', qty: 6 }] }, COLOURED);
  check('a light colour is one row on its own, and prices as light_colour',
    coloured.lines.filter((l) => l.kind === 'light' || l.kind === 'light_colour').length === 1 &&
    coloured.lines.some((l) => l.slug === 'spot-3000k' && l.kind === 'light_colour' && l.qty === 6));
  const goneColour = buildBom({ ...base, lights: [{ slug: 'spot-9000k', qty: 6 }] }, COLOURED);
  check('a light the catalogue lost is visible, not silent',
    goneColour.lines.some((l) => l.slug === 'spot-9000k' && l.missing === true));
  const zeroLights = buildBom({ ...base, lights: [{ slug: 'spot', qty: 0 }] }, COLOURED);
  check('a light type with no quantity produces no line', !zeroLights.lines.some((l) => l.slug === 'spot'));

  const absM2 = buildBom({ ...base, absorberSlug: 'abs-m2' }, CATALOGUE);
  check('absorber surface is ALWAYS the ceiling surface', near(absM2.lines.find((l) => l.slug === 'abs-m2').qty, 14.28));
  const absSheet = buildBom({ ...base, absorberSlug: 'abs-sheet' }, CATALOGUE);
  check('absorber sold per sheet converts the same surface: ceil(14.28 / 1.2) = 12',
    absSheet.lines.find((l) => l.slug === 'abs-sheet').qty === 12);

  const tiny = buildBom({ ...base, length: 0.5, width: 0.5 }, CATALOGUE);
  check('surface is floored at the minimum billable m²', near(tiny.area, 1), String(tiny.area));

  const noFoil = buildBom({ ...base, finish: 'satin', colourGroup: 'black' }, CATALOGUE);
  check('a combination with no roll marks the configuration incomplete',
    noFoil.foil.option === null && noFoil.incomplete === true);

  // The engine's OWN picks (fold edge, welding) follow the ceiling's material:
  // welding a PVC seam and a polyester seam are different products.
  {
    const weldPvc = opt({ kind: 'service', slug: 'weld-pvc', label: 'Welding, PVC', qtyRule: 'weld_m', matchCode: 'SRV-WELD-PVC', material: 'PVC', finish: null, colourGroup: null, maxWidthCm: null, roundMode: 'exact' });
    const transPvc = opt({ kind: 'transition', slug: 'trans-pvc', label: 'Angle, PVC', qtyRule: 'fold_edge_m', matchCode: 'T-PVC', material: 'PVC', finish: null, colourGroup: null, maxWidthCm: null, roundMode: 'exact' });
    const cornerPvc = opt({ kind: 'corner', slug: 'corner-pvc', label: 'Corner, PVC', qtyRule: 'per_corner', matchCode: 'SRV-CORNER-PVC', material: 'PVC', finish: null, colourGroup: null, maxWidthCm: null });
    const fabricRoll = opt({ slug: 'fab-200', label: 'Fabric 2,00 m', material: 'fabric', finish: null, colourGroup: null, fabricKind: 'standard', maxWidthCm: 200, matchProduct: 'Fabric 2,00 m', roundMode: 'exact' });
    const MAT = [...CEILINGS.filter((o) => o.active), fabricRoll, weldPvc, transPvc, cornerPvc];

    const pvcWeld = buildBom({ ...base, length: 8, width: 5.5, finish: 'gloss' }, MAT);
    check('a PVC ceiling that welds uses the PVC welding service',
      pvcWeld.lines.some((l) => l.slug === 'weld-pvc'));

    const fabWeld = buildBom({ ...base, material: 'fabric', fabricKind: 'standard', finish: null, colourGroup: null, length: 8, width: 5.5 }, MAT);
    check('a FABRIC ceiling that welds does NOT borrow the PVC welding price',
      !fabWeld.lines.some((l) => l.slug === 'weld-pvc'));
    check('…it shows welding as a visible un-priced line instead',
      fabWeld.lines.some((l) => l.kind === 'service' && l.missing === true));

    const fabFold = buildBom({ ...base, material: 'fabric', fabricKind: 'standard', finish: null, colourGroup: null, shape: 'sloped', slopeRun: 1.2 }, MAT);
    check('the fold edge does not borrow the PVC angle profile either',
      !fabFold.lines.some((l) => l.slug === 'trans-pvc') &&
        fabFold.lines.some((l) => l.kind === 'transition' && l.missing === true));

    const pvcFold = buildBom({ ...base, shape: 'sloped', slopeRun: 1.2 }, MAT);
    check('a PVC fold DOES use the PVC angle profile', pvcFold.lines.some((l) => l.slug === 'trans-pvc'));

    // The corner piece is no longer a choice in the form — the engine takes
    // the one for the material, so a polyester ceiling gets no corner line
    // rather than silently borrowing the PVC one.
    check('a PVC ceiling gets its corner piece without being asked',
      pvcFold.lines.find((l) => l.slug === 'corner-pvc')?.qty === 6);
    const fabCorner = buildBom({ ...base, material: 'fabric', fabricKind: 'standard', finish: null, colourGroup: null }, MAT);
    check('a FABRIC ceiling does NOT borrow the PVC corner piece',
      !fabCorner.lines.some((l) => l.kind === 'corner'));
  }

  const missingTransition = buildBom({ ...base, shape: 'sloped', slopeRun: 1.2 }, CATALOGUE.filter((o) => o.slug !== 'trans'));
  check('no transition option in the catalogue → a visible no_row line, not a silent drop',
    missingTransition.lines.some((l) => l.kind === 'transition' && l.missing === true));
}

// ---------------------------------------------------------------------------
console.log('\nparseConfig — the payload the form actually posts');
{
  // The browser posts a bare config object (see toPayload in ConfiguratorView).
  const posted = {
    length: 4.2, width: 3.4, shape: 'sloped', slopeRun: 4.2, foldSide: 'length',
    material: 'fabric', finish: null, colourGroup: null, fabricKind: 'standard',
    profileSlug: 'prof-s-pp-c01-w-2m', cornersInside: null, cornersOutside: null,
    platforms: [{ slug: 'plat-e-cs80', qty: 6 }],
    absorberSlug: 'abs-d40-10-w-40m',
    lights: [{ slug: 'light-sl-5061-white', qty: 6 }, { slug: 'light-gu10-fitting', qty: 6 }],
    market: 'Installer',
  };
  const r = parseConfig(posted);
  check('the posted payload parses', r.ok === true, r.error);
  check('both light types survive the round trip',
    r.ok && r.config.lights.length === 2 &&
    r.config.lights[0].slug === 'light-sl-5061-white' && r.config.lights[0].qty === 6 &&
    r.config.lights[1].slug === 'light-gu10-fitting',
    JSON.stringify(r.ok ? r.config.lights : r));

  const dup = parseConfig({ ...posted, lights: [{ slug: 'a', qty: 2 }, { slug: 'a', qty: 5 }] });
  check('the same light type twice is collapsed to one', dup.ok && dup.config.lights.length === 1,
    JSON.stringify(dup.ok ? dup.config.lights : dup));
  const zero = parseConfig({ ...posted, lights: [{ slug: 'a', qty: 0 }] });
  check('a light with no quantity is dropped', zero.ok && zero.config.lights.length === 0);
  const huge = parseConfig({ ...posted, lights: [{ slug: 'a', qty: 999999 }] });
  check('an absurd light count is rejected, not clamped silently',
    huge.ok === false && huge.error === 'too_many_lights', JSON.stringify(huge));
  const junk = parseConfig({ ...posted, lights: 'lots' });
  check('a non-array lights field yields no lights, never a crash', junk.ok && junk.config.lights.length === 0);
}

// ---------------------------------------------------------------------------
console.log('\naccess — installers and admins only');
{
  const portalTypes = loadTs('../src/lib/portal/types.ts');
  const { hasConfiguratorAccess, configuratorMarket } = portalTypes;
  const who = (accountType, role = 'client', over = {}) => ({
    id: 'u', email: 'x@y.z', company: null, role, accountType,
    markets: [], allMarkets: false, active: true, ...over,
  });

  check('installer may use the configurator', hasConfiguratorAccess(who('installer')));
  check('producer may use it (a trade tier that buys)', hasConfiguratorAccess(who('producer')));
  check('admin may use it', hasConfiguratorAccess(who('installer', 'admin')));
  check('b2c may NOT', !hasConfiguratorAccess(who('b2c')));
  check('architect may NOT', !hasConfiguratorAccess(who('architect')));
  check('an installer with an EMPTY markets[] still qualifies (the tier grants the group)',
    hasConfiguratorAccess(who('installer', 'client', { markets: [] })));

  check("an installer is priced on its own group, with no say in it",
    configuratorMarket(who('installer'), 'B2C') === 'Installer');
  check('a producer is priced on Producer/Reseller', configuratorMarket(who('producer')) === 'Producer/Reseller');
  check('an admin may choose a group', configuratorMarket(who('installer', 'admin'), 'B2C') === 'B2C');
  check('an admin defaults to Installer', configuratorMarket(who('installer', 'admin')) === 'Installer');
  check('a nonsense group is ignored', configuratorMarket(who('installer', 'admin'), 'Wholesale') === 'Installer');
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll kit-configurator checks passed');
