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
const { pickFoil, foilFamily, weldsForPanel, rollMetresForPanel, cutPanel, cutPanelFromFamily } = loadTs('../src/lib/portal/configurator/foil.ts', {
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
  './foil': { pickFoil, foilFamily, weldsForPanel, rollMetresForPanel, cutPanel, cutPanelFromFamily },
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
  check('reason names the roll and says no seam',
    /500 cm roll covers your 3.4 m span in one piece — no seam\./.test(narrowest.reason), narrowest.reason);

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
  check('a seam emits a plain-language note', gloss.notes.some((n) => /seam/i.test(n)));

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
    check('a FABRIC ceiling that seams does NOT borrow the PVC welding price',
      !fabWeld.lines.some((l) => l.slug === 'weld-pvc'));
    check('…it shows the seam as a visible un-priced line instead',
      fabWeld.lines.some((l) => l.kind === 'service' && l.missing === true));

    // Michael, 7 Sep 2026: "the cost for the seam is the price of the
    // p-ccmidno profile" — a polyester seam is JOINED with a 2 m profile, so
    // it is billed in pieces, not by the metre like a welded PVC seam.
    const seamFabric = opt({ kind: 'service', slug: 'seam-fabric', label: 'Seam joint profile P-CCMIDNO 2m', qtyRule: 'weld_pieces', pieceLengthM: 2, matchCode: 'P-CCMIDNO 2m', material: 'fabric', finish: null, colourGroup: null, maxWidthCm: null, roundMode: 'ceil' });
    const SEAM = [...MAT, seamFabric];
    const fabBase = { ...base, material: 'fabric', fabricKind: 'standard', finish: null, colourGroup: null, profileSlug: null };
    const fabSeam = buildBom({ ...fabBase, length: 8, width: 5.5 }, SEAM);
    // 200 cm roll, 5.5 m short side → ceil(5.5/2) − 1 = 2 seams × 8 m = 16 m.
    check('a polyester seam is priced by the P-CCMIDNO profile', fabSeam.lines.some((l) => l.slug === 'seam-fabric'));
    check('…in 2 m PIECES, not metres: ceil(16 / 2) = 8',
      fabSeam.lines.find((l) => l.slug === 'seam-fabric')?.qty === 8,
      `${fabSeam.weldMetres} m → ${fabSeam.lines.find((l) => l.slug === 'seam-fabric')?.qty}`);
    check('…and nothing is left un-priced', !fabSeam.lines.some((l) => l.missing),
      fabSeam.lines.filter((l) => l.missing).map((l) => `${l.kind}:${l.slug}`).join(','));
    check('a PVC seam is still welded BY THE METRE, not in pieces',
      buildBom({ ...base, length: 8, width: 5.5, finish: 'gloss' }, SEAM).lines
        .find((l) => l.kind === 'service')?.rule === 'weld_m');
    check('the polyester seam profile is NOT borrowed by a PVC ceiling',
      !buildBom({ ...base, length: 8, width: 5.5, finish: 'gloss' }, SEAM).lines.some((l) => l.slug === 'seam-fabric'));
    const fabNoSeam = buildBom({ ...fabBase, length: 1.8, width: 1.5 }, SEAM);
    check('a polyester ceiling that needs no seam gets no seam line',
      fabNoSeam.weldCount === 0 && !fabNoSeam.lines.some((l) => l.slug === 'seam-fabric'),
      `${fabNoSeam.weldCount} seam(s)`);

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
console.log('\nfabric is billed per RUNNING METRE of roll, not per m\u00b2');
{
  // Michael, 7 Sep 2026: "For fabric, the measurements off the fabrics are per
  // m1 in the pricelist correspondenting with the width off the fabric."
  // Every fabric row in the pricebook carries unit 'm': "495D … 5,10m" at
  // EUR 135.92 buys ONE METRE of cloth 5.10 m wide. Billing the ceiling's m²
  // against that price charges the roll width over again.
  //
  // "always make sure that 20cm in width is free … in the length also take
  // always minimum 20cm extra length for each ceiling. If the ceiling is
  // flat + angled you need 2 fabrics; if it has a seam, add a second fabric
  // and add the measurements to it." And, after the first cut at it:
  // "it shouldn't multiply. It should add the necessary width of extra
  // fabric." — the second piece is the LEFTOVER width off a narrower roll.
  const A = 0.2;
  check('a panel inside the roll width takes its long side + 20 cm',
    near(rollMetresForPanel({ a: 4.2, b: 3.4 }, 510, A), 4.4), String(rollMetresForPanel({ a: 4.2, b: 3.4 }, 510, A)));
  check('without an allowance (PVC) it is the bare long side',
    rollMetresForPanel({ a: 4.2, b: 3.4 }, 510) === 4.2);
  check('strips and seams come from the same cut',
    cutPanel({ a: 8, b: 5.5 }, 510, A).seams === cutPanel({ a: 8, b: 5.5 }, 510, A).strips - 1);
  check('the seam length is the panel\u2019s long side, no allowance',
    weldsForPanel({ a: 8, b: 5.5 }, 510, A).metres === 8);
  check('an empty panel consumes nothing', rollMetresForPanel({ a: 0, b: 3 }, 510, A) === 0);

  // The live 705S range: seven widths of the same cloth.
  const roll = (w, price) => opt({ slug: `fab-${w}`, label: `705S 0002 ${(w / 100).toFixed(2)}m`, material: 'fabric',
    finish: null, colourGroup: null, fabricKind: 'standard', maxWidthCm: w, qtyRule: 'roll_m', roundMode: 'exact',
    matchCode: `705S-${w}`, sort: w });
  const R = { 150: roll(150), 200: roll(200), 250: roll(250), 335: roll(335), 410: roll(410), 450: roll(450), 510: roll(510) };
  const FAMILY = Object.values(R);
  const pvcM2 = opt({ slug: 'pvc-m2', label: 'MSD Matte White 500', material: 'PVC', finish: 'matte',
    colourGroup: 'white', maxWidthCm: 500, qtyRule: 'area', roundMode: 'exact', matchCode: 'MSD-500' });
  const CLOTH = [...FAMILY, pvcM2];
  const std = { material: 'fabric', fabricKind: 'standard' };
  const fam = foilFamily(std, CLOTH);
  check('the family is sorted narrowest first', fam.map((o) => o.maxWidthCm).join(',') === '150,200,250,335,410,450,510');

  // The roll is chosen on span + 20 cm: 4.00 m wants 4.20, 4.01 wants more.
  check('a 4.00 m span picks the 4.50 roll, not the 4.10 (4.00 + 0.20 = 4.20 > 4.10)',
    pickFoil(std, 4.0, CLOTH, A).option === R[450], pickFoil(std, 4.0, CLOTH, A).option?.slug);
  check('…the same span WITHOUT an allowance would have taken the 4.10',
    pickFoil(std, 4.0, CLOTH).option === R[410]);
  check('a 3.90 m span still fits the 4.10 roll (3.90 + 0.20 = 4.10)',
    pickFoil(std, 3.9, CLOTH, A).option === R[410]);
  check('the reason line shows the allowance',
    /3\.9 m span \+ 0\.2 m in one piece/.test(pickFoil(std, 3.9, CLOTH, A).reason), pickFoil(std, 3.9, CLOTH, A).reason);

  // --- cutting a panel from the FAMILY: the narrowest roll that covers ----
  const one = cutPanelFromFamily({ a: 5.5, b: 3.4 }, fam, A);
  check('a panel that fits takes the NARROWEST roll that covers its width: 3.40 + 0.20 → the 4.10',
    one.pieces.length === 1 && one.pieces[0].option === R[410] && near(one.pieces[0].length, 5.7) && one.seams === 0,
    one.pieces.map((p) => `${p.option.slug}×${p.length}`).join(','));
  // "It should add the necessary width of extra fabric": 5.50 + 0.20 = 5.70 on a
  // 5.10 roll is ONE 5.10 strip plus a 0.60 m remainder off the 1.50 roll.
  const seamed = cutPanelFromFamily({ a: 6, b: 5.5 }, fam, A);
  check('a seamed panel is a full 5.10 strip PLUS the leftover off the narrowest roll that covers it',
    seamed.pieces.length === 2 && seamed.pieces[0].option === R[510] && seamed.pieces[1].option === R[150],
    seamed.pieces.map((p) => `${p.option.slug} covers ${p.covers}`).join(','));
  check('…the remainder is 0.60 m and marked as such',
    near(seamed.pieces[1].covers, 0.6) && seamed.pieces[1].remainder === true && seamed.pieces[0].remainder === false);
  check('…both pieces are cut 6.20 m long (6 + 20 cm), one seam of 6 m',
    seamed.pieces.every((p) => near(p.length, 6.2)) && seamed.seams === 1 && near(seamed.seamMetres, 6));
  const big = cutPanelFromFamily({ a: 12, b: 11 }, fam, A);
  check('11.00 + 0.20 m: two full 5.10 strips + 1.00 m remainder off the 1.50 roll — three pieces, two seams',
    big.pieces.length === 3 && big.pieces[0].option === R[510] && big.pieces[1].option === R[510] &&
    big.pieces[2].option === R[150] && near(big.pieces[2].covers, 1.0) && big.seams === 2,
    big.pieces.map((p) => `${p.option.slug} covers ${p.covers}`).join(','));
  const exact = cutPanelFromFamily({ a: 6, b: 4.9 }, fam, A);
  check('4.90 + 0.20 = 5.10 exactly still fits the 5.10 roll in one piece', exact.pieces.length === 1 && exact.pieces[0].option === R[510]);
  // The SHORT side is the constraint — 12 x 8.50, so 8.50 is the span.
  const remainderBig = cutPanelFromFamily({ a: 12, b: 8.5 }, fam, A);
  check('8.50 + 0.20: one 5.10 strip + 3.60 m remainder → the 4.10 roll, not another 5.10',
    remainderBig.pieces.length === 2 && remainderBig.pieces[1].option === R[410], remainderBig.pieces.map((p) => p.option.slug).join(','));
  const narrowOnly = cutPanelFromFamily({ a: 8, b: 5.5 }, [R[200]], A);
  check('a family of one width falls back to strips of that width (5.70 on 2.00 → 3 pieces)',
    narrowOnly.pieces.length === 3 && narrowOnly.pieces.every((p) => p.option === R[200]) && narrowOnly.seams === 2);
  check('an empty family yields nothing', cutPanelFromFamily({ a: 4, b: 3 }, [], A).pieces.length === 0);

  // --- Michael's screenshot 1: 5.50 x 3.40 + a 4.20 m slope along the length ---
  const room1 = {
    length: 5.5, width: 3.4, shape: 'sloped', slopeRun: 4.2, foldSide: 'length',
    material: 'fabric', finish: null, colourGroup: null, fabricKind: 'standard',
    profileSlug: null, cornersInside: null, cornersOutside: null,
    platforms: [], absorberSlug: null, lights: [],
  };
  const bom1 = buildBom(room1, CLOTH);
  const cloth1 = bom1.lines.filter((l) => l.kind === 'ceiling');
  check('screenshot 1: two pieces, each from ITS OWN roll — flat 3.60 → 4.10, angled 4.40 → 4.50',
    cloth1.length === 2 && cloth1[0].slug === 'fab-410' && cloth1[1].slug === 'fab-450',
    cloth1.map((l) => l.slug).join(','));
  check('…each 5.70 m long (5.50 + 20 cm), 11.40 m in total',
    cloth1.every((l) => near(l.qty, 5.7)) && near(bom1.rollMetres, 11.4) && bom1.clothPieces === 2);
  check('…the widths used are reported', bom1.clothWidthsCm.join(',') === '410,450', bom1.clothWidthsCm.join(','));
  check('…the "chosen foil" is still the roll for the widest span (4.50)', bom1.foil.option === R[450]);
  check('…no seam', bom1.weldCount === 0);

  // --- Michael's screenshot 2: 5.50 x 6.00 + a 5.50 m slope — "It's multiplying fabrics" ---
  const room2 = { ...room1, width: 6, slopeRun: 5.5 };
  const bom2 = buildBom(room2, CLOTH);
  const cloth2 = bom2.lines.filter((l) => l.kind === 'ceiling');
  check('screenshot 2: four pieces — but NOT four 5.10 strips',
    cloth2.length === 4 && cloth2.map((l) => l.slug).join(',') === 'fab-510,fab-150,fab-510,fab-150',
    cloth2.map((l) => l.slug).join(','));
  check('…flat panel: a 5.10 strip of 6.20 m + a 0.60 m remainder off the 1.50 roll, also 6.20 m',
    near(cloth2[0].qty, 6.2) && near(cloth2[1].qty, 6.2) && /remainder 0\.60 m/.test(cloth2[1].note), cloth2[1].note);
  check('…angled panel: a 5.10 strip of 5.70 m + a 0.60 m remainder off the 1.50 roll',
    near(cloth2[2].qty, 5.7) && near(cloth2[3].qty, 5.7) && /remainder 0\.60 m/.test(cloth2[3].note));
  check('…23.80 m of cloth in total, but off the 150 and 510 rolls', near(bom2.rollMetres, 23.8) && bom2.clothWidthsCm.join(',') === '150,510');
  check('…two seams, 6.00 + 5.50 = 11.50 m', bom2.weldCount === 2 && near(bom2.weldMetres, 11.5));
  check('…each piece note names its roll width', /5\.10 m wide/.test(cloth2[0].note) && /1\.50 m wide/.test(cloth2[1].note), cloth2[1].note);

  // The same room in PVC keeps the m2 rule and ONE line — one catalogue, two units.
  const pvcRoom = { ...room1, material: 'PVC', finish: 'matte', colourGroup: 'white', fabricKind: null };
  const pvcBom = buildBom(pvcRoom, CLOTH);
  const pvcLines = pvcBom.lines.filter((l) => l.kind === 'ceiling');
  check('a PVC ceiling is still ONE line billed per m\u00b2',
    pvcLines.length === 1 && pvcLines[0].rule === 'area' && near(pvcLines[0].qty, 5.5 * 3.4 + 5.5 * 4.2),
    pvcLines.map((l) => `${l.rule} ${l.qty}`).join(','));
  check('PVC reports no cloth pieces or widths', pvcBom.clothPieces === 0 && pvcBom.clothWidthsCm.length === 0);
}

// ---------------------------------------------------------------------------
console.log('\nseam direction — the installer chooses which way the seams run');
{
  // Michael, 7 Sep 2026: "Give the user the option to choose direction of the
  // seam." 'auto' spans the shorter side (fewest seams); 'length' / 'width'
  // runs the seams along that side of the room on EVERY panel.
  const A = 0.2;
  const roll = (w) => opt({ slug: `fab-${w}`, label: `705S 0002 ${(w / 100).toFixed(2)}m`, material: 'fabric',
    finish: null, colourGroup: null, fabricKind: 'standard', maxWidthCm: w, qtyRule: 'roll_m', roundMode: 'exact',
    matchCode: `705S-${w}`, sort: w });
  const R = { 150: roll(150), 250: roll(250), 410: roll(410), 450: roll(450), 510: roll(510) };
  const CLOTH = Object.values(R);
  const fam = foilFamily({ material: 'fabric', fabricKind: 'standard' }, CLOTH);

  // The cut itself: which side the roll spans.
  const auto = cutPanelFromFamily({ a: 5.5, b: 6 }, fam, A);
  const alongA = cutPanelFromFamily({ a: 5.5, b: 6 }, fam, A, 'b'); // roll spans b (6.00) ⇒ pieces run along a
  check('spanning the 6.00 side: 6.20 needed → 5.10 + a 1.10 m remainder, pieces 5.70 long, seam 5.50 m',
    alongA.pieces.length === 2 && alongA.pieces[1].option === R[150] && near(alongA.pieces[1].covers, 1.1) &&
    alongA.pieces.every((p) => near(p.length, 5.7)) && near(alongA.seamMetres, 5.5),
    alongA.pieces.map((p) => `${p.option.slug} covers ${p.covers} len ${p.length}`).join(','));
  check('spanning the 5.50 side is what auto does', near(auto.pieces[0].length, 6.2) && near(auto.seamMetres, 6));

  const base = {
    length: 4, width: 6, shape: 'flat', slopeRun: 0, foldSide: 'length', seamDirection: 'auto',
    material: 'fabric', finish: null, colourGroup: null, fabricKind: 'standard',
    profileSlug: null, cornersInside: null, cornersOutside: null, platforms: [], absorberSlug: null, lights: [],
  };
  // 4.00 x 6.00: auto spans 4.00 (+0.20 → the 4.50 roll), no seam.
  const a = buildBom(base, CLOTH);
  check('auto: 4.00 + 20 cm fits the 4.50 roll in one piece — no seam',
    a.weldCount === 0 && a.clothPieces === 1 && a.foil.option === R[450], `${a.weldCount} ${a.clothPieces} ${a.foil.option?.slug}`);
  // Seams along the LENGTH (4.00): the roll spans the width 6.00 → 6.20 → 5.10 + 1.10 → 2 pieces, 1 seam of 4.00 m.
  const len = buildBom({ ...base, seamDirection: 'length' }, CLOTH);
  check('seams along the length: the roll spans the 6.00 width → two pieces and one seam of 4.00 m',
    len.weldCount === 1 && near(len.weldMetres, 4) && len.clothPieces === 2 && len.clothWidthsCm.join(',') === '150,510',
    `${len.weldCount} ${len.weldMetres} ${len.clothPieces} ${len.clothWidthsCm}`);
  check('…the pieces run along the length: 4.00 + 20 cm = 4.20 m each',
    len.lines.filter((l) => l.kind === 'ceiling').every((l) => near(l.qty, 4.2)));
  check('…the roll the widest span takes is now the 5.10 and the reason says seam profile',
    len.foil.option === R[510] && /seam profile/.test(len.foil.reason), len.foil.reason);
  check('…the note says which way the seam runs', len.notes.some((n) => /along the length/.test(n)), len.notes.join(' | '));
  // Seams along the WIDTH (6.00): the roll spans the length 4.00 → same as auto here.
  const wid = buildBom({ ...base, seamDirection: 'width' }, CLOTH);
  check('seams along the width: the roll spans the 4.00 length — same single piece as auto',
    wid.weldCount === 0 && wid.clothPieces === 1 && wid.foil.option === R[450]);

  // Flat + angled: the choice applies to BOTH panels through the room axes.
  // 5.50 x 3.40, slope 4.20 along the length. Angled panel: a = 5.50 (length axis), b = 4.20 (width axis).
  const slope = { ...base, length: 5.5, width: 3.4, shape: 'sloped', slopeRun: 4.2, foldSide: 'length' };
  const sAuto = buildBom(slope, CLOTH);
  check('sloped, auto: flat spans 3.40 (4.10 roll), angled spans 4.20 (4.50 roll), no seam',
    sAuto.weldCount === 0 && sAuto.clothWidthsCm.join(',') === '410,450', sAuto.clothWidthsCm.join(','));
  const sWidth = buildBom({ ...slope, seamDirection: 'width' }, CLOTH);
  check('sloped, seams along the width: BOTH panels span their length-axis side 5.50 → 5.70 → a seam on each',
    sWidth.weldCount === 2 && sWidth.clothPieces === 4, `${sWidth.weldCount} ${sWidth.clothPieces}`);
  check('…the flat seam is 3.40 m and the angled seam 4.20 m (the pieces run along the width)',
    near(sWidth.weldMetres, 3.4 + 4.2), String(sWidth.weldMetres));
  const sLength = buildBom({ ...slope, seamDirection: 'length' }, CLOTH);
  check('sloped, seams along the length: the roll spans 3.40 and 4.20 — the same as auto here',
    sLength.weldCount === 0 && sLength.clothWidthsCm.join(',') === '410,450');
  // The fold along the WIDTH swaps the angled panel's axes: a = W (width axis), b = S (length axis).
  const foldW = { ...base, length: 5.5, width: 3.4, shape: 'sloped', slopeRun: 4.2, foldSide: 'width', seamDirection: 'width' };
  const fw = buildBom(foldW, CLOTH);
  check('fold along the width, seams along the width: flat spans 5.50 (seam), angled spans its slope 4.20 (no seam)',
    fw.weldCount === 1 && near(fw.weldMetres, 3.4), `${fw.weldCount} ${fw.weldMetres}`);

  // Nonsense is 'auto', never a crash.
  check('an unknown direction behaves as auto', buildBom({ ...base, seamDirection: 'diagonal' }, CLOTH).weldCount === 0);
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
  const r = parseConfig({ ...posted, reference: '  Living room  ' });
  check('the posted payload parses', r.ok === true, r.error);
  check('the ceiling reference is carried and trimmed', r.ok && r.meta.reference === 'Living room',
    JSON.stringify(r.ok ? r.meta.reference : r));
  check('an empty reference is null, never an empty string',
    parseConfig({ ...posted, reference: '   ' }).meta.reference === null);
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
