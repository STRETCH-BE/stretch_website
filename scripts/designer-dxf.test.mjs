// Ceiling-designer DXF import regression tests — part of `npm test`.
// Loads the pure geometry core (<script id="core">) of the designer straight
// out of the base64 module and checks that DXF drawings turn into the right
// walls / diagonals / corner radii / cut-outs — including a round trip
// through the designer's own DXF export.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const tsPath = fileURLToPath(new URL('../src/lib/portal/designer-html.ts', import.meta.url));
const b64 = (readFileSync(tsPath, 'utf8').match(/DESIGNER_HTML_B64 =\s*([\s\S]*?);\s*$/)[1].match(/"[^"]*"/g) || [])
  .map((c) => JSON.parse(c)).join('');
const html = Buffer.from(b64, 'base64').toString('utf8');
const core = html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const mod = { exports: {} };
new Function('module', core)(mod);
const { parseDXF, dxfUnitScale, dxfToDesign, makeDXF, solveRoom, buildMeasures } = mod.exports;

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { console.error('  ✗', name); throw e; }
}
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} expected ${b} ±${tol}, got ${a}`);

// Solve a design (walls + diagonals + flips) back into corner positions.
function solveDesign(d) {
  const r = solveRoom(d.n, buildMeasures(d.n, d.walls, d.diagonals).measures, new Set(d.flips), d.angles || {}, {});
  assert.ok(r.allPlaced, 'all corners placed');
  return r.pts;
}
// Compare two closed polygons up to rigid motion + start index (shape only).
function sameShape(P, Q, tol) {
  assert.equal(P.length, Q.length);
  const n = P.length;
  const dd = (pts) => pts.map((p, i) => Math.hypot(pts[(i + 1) % n].x - p.x, pts[(i + 1) % n].y - p.y));
  const dp = dd(P), dq = dd(Q);
  const diag = (pts, k) => pts.map((p, i) => Math.hypot(pts[(i + k) % n].x - p.x, pts[(i + k) % n].y - p.y));
  for (let i = 0; i < n; i++) near(dp[i], dq[i], tol, `wall ${i}`);
  for (let k = 2; k < n - 1; k++) { const a = diag(P, k), b = diag(Q, k); for (let i = 0; i < n; i++) near(a[i], b[i], tol, `diag ${i}+${k}`); }
}

const dxfPairs = (pairs) => pairs.map(([c, v]) => `${c}\r\n${v}`).join('\r\n') + '\r\n';
const line = (p, q, layer = '0') => [[0, 'LINE'], [8, layer], [10, p[0]], [20, p[1]], [11, q[0]], [21, q[1]]];
const wrap = (ents, header = [], blocks = []) => dxfPairs([
  [0, 'SECTION'], [2, 'HEADER'], ...header, [0, 'ENDSEC'],
  [0, 'SECTION'], [2, 'BLOCKS'], ...blocks, [0, 'ENDSEC'],
  [0, 'SECTION'], [2, 'ENTITIES'], ...ents, [0, 'ENDSEC'], [0, 'EOF'],
]);

console.log('designer DXF import');

test('L-shaped room from loose LINEs (cm, unitless header → guessed) + circle cut-out', () => {
  const pts = [[0, 0], [500, 0], [500, 300], [200, 300], [200, 450], [0, 450]];
  const ents = [];
  pts.forEach((p, i) => ents.push(...line(p, pts[(i + 1) % pts.length])));
  ents.push([0, 'CIRCLE'], [8, 'SPOTS'], [10, 100], [20, 100], [40, 8]);
  // a title-block rectangle far outside the room must be ignored
  [[900, 0], [1100, 0], [1100, 100], [900, 100]].forEach((p, i, a) => ents.push(...line(p, a[(i + 1) % 4])));
  const parsed = parseDXF(wrap(ents));
  const us = dxfUnitScale(parsed, 0);
  assert.equal(us.source, 'guess'); assert.equal(us.scale, 1);
  const { design, info, warnings } = dxfToDesign(parsed, { unitScale: us.scale, name: 'L' });
  assert.equal(design.n, 6);
  assert.equal(info.cutouts, 1);
  assert.deepEqual(design.walls, [500, 300, 300, 150, 200, 450]);
  assert.equal(design.diagonals.length, 3);
  near(design.diagonals[0].len, Math.hypot(500, 300), 0.1);
  assert.ok(warnings.some((w) => /outside the ceiling outline/.test(w)));
  const solved = solveDesign(design);
  sameShape(solved, pts.map(([x, y]) => ({ x, y })), 0.2);
  // orientation is kept: A-B along +x in the file → rotation 0
  assert.equal(design.rotation, 0);
  const cut = design.cutouts[0];
  assert.equal(cut.type, 'circle'); assert.equal(cut.r, 8);
  near(cut.x, 100, 0.01); near(cut.y, 100, 0.01);
});

test('closed LWPOLYLINE in mm ($INSUNITS=4) with bulge fillet → corner radius', () => {
  // 4000×3000 mm rectangle, corner at (4000,3000) rounded with r=500 (bulge = tan(90°/4))
  const b = Math.tan(Math.PI / 8);
  const ents = [[0, 'LWPOLYLINE'], [8, 'WALLS'], [90, 5], [70, 1],
    [10, 0], [20, 0], [10, 4000], [20, 0], [10, 4000], [20, 2500], [42, b], [10, 3500], [20, 3000], [10, 0], [20, 3000]];
  const parsed = parseDXF(wrap(ents, [[9, '$INSUNITS'], [70, 4]]));
  const us = dxfUnitScale(parsed, 0);
  assert.equal(us.source, 'header'); assert.equal(us.scale, 0.1);
  const { design } = dxfToDesign(parsed, { unitScale: us.scale });
  assert.equal(design.n, 4);
  assert.deepEqual(design.walls, [400, 300, 400, 300]);
  assert.deepEqual(design.radii, { 2: 50 });
  assert.equal(design.diagonals.length, 1); near(design.diagonals[0].len, 500, 0.1);
});

test('rectangle drawn in a block INSERT (rotated + mirrored) and rectangular cut-out', () => {
  const blocks = [[0, 'BLOCK'], [2, 'ROOM'], [10, 0], [20, 0],
    ...line([0, 0], [600, 0]), ...line([600, 0], [600, 400]), ...line([600, 400], [0, 400]), ...line([0, 400], [0, 0]),
    [0, 'ENDBLK']];
  const ents = [[0, 'INSERT'], [2, 'room'], [10, 1000], [20, 2000], [41, -1], [42, 1], [50, 30],
    // 80×40 rectangular cut-out, rotated 30° with the room, drawn as loose lines around (1000,2000) shifted inside
    ...(() => {
      const c = { x: 1000 - 300 * Math.cos(Math.PI / 6) + 200 * Math.sin(Math.PI / 6) * 0, y: 2000 - 300 * Math.sin(Math.PI / 6) + 200 * Math.cos(Math.PI / 6) };
      const rot = Math.PI / 6, cs = Math.cos(rot), sn = Math.sin(rot);
      const P = (u, v) => [c.x + u * cs - v * sn, c.y + u * sn + v * cs];
      const q = [P(-40, -20), P(40, -20), P(40, 20), P(-40, 20)];
      return q.flatMap((p, i) => line(p, q[(i + 1) % 4]));
    })()];
  const parsed = parseDXF(wrap(ents, [[9, '$INSUNITS'], [70, 5]], blocks));
  const { design } = dxfToDesign(parsed, { unitScale: 1 });
  assert.equal(design.n, 4);
  assert.deepEqual(design.walls.slice().sort(), [400, 400, 600, 600]);
  assert.equal(design.cutouts.length, 1);
  const cut = design.cutouts[0];
  assert.equal(cut.type, 'rect');
  assert.deepEqual([cut.w, cut.h].sort((a, b) => a - b), [40, 80]);
  const solved = solveDesign(design);
  sameShape(solved, [{ x: 0, y: 0 }, { x: 600, y: 0 }, { x: 600, y: 400 }, { x: 0, y: 400 }], 0.2);
});

test('CIRCLE ceiling and ELLIPSE ceiling', () => {
  let parsed = parseDXF(wrap([[0, 'CIRCLE'], [10, 50], [20, 50], [40, 150]], [[9, '$INSUNITS'], [70, 5]]));
  let r = dxfToDesign(parsed, { unitScale: 1 });
  assert.equal(r.design.roomType, 'circle'); assert.equal(r.design.roomDim.d, 300);
  // circle drawn as two ARCs is still a circle
  parsed = parseDXF(wrap([[0, 'ARC'], [10, 0], [20, 0], [40, 100], [50, 0], [51, 180], [0, 'ARC'], [10, 0], [20, 0], [40, 100], [50, 180], [51, 360]]));
  r = dxfToDesign(parsed, { unitScale: 1 });
  assert.equal(r.design.roomType, 'circle'); assert.equal(r.design.roomDim.d, 200);
  parsed = parseDXF(wrap([[0, 'ELLIPSE'], [10, 0], [20, 0], [11, 200], [21, 0], [40, 0.5], [41, 0], [42, 6.283185307179586]]));
  r = dxfToDesign(parsed, { unitScale: 1 });
  assert.equal(r.design.roomType, 'ellipse'); assert.equal(r.design.roomDim.w, 400); assert.equal(r.design.roomDim.h, 200);
});

test('round trip: designer DXF export (with fillet arcs, diagonals, labels) re-imports to the same room', () => {
  // the 15-corner "My room" shape solved by the engine itself
  const st = { n: 15, walls: [152, 102, 100, 61, 229, 12, 15, 11, 123, 108, 123, 12, 15, 199, 249],
    diagonals: [{ a: 0, b: 3, len: 233 }, { a: 1, b: 3, len: 141 }, { a: 3, b: 5, len: 237 }, { a: 3, b: 6, len: 234 }, { a: 3, b: 13, len: 232 }, { a: 3, b: 14, len: 328 }, { a: 6, b: 13, len: 83 }, { a: 7, b: 13, len: 85 }, { a: 7, b: 12, len: 83 }, { a: 7, b: 9, len: 124 }, { a: 7, b: 10, len: 156 }],
    angles: { 9: 90, 11: 180, 12: 180, 14: 90 }, flips: [6, 9] };
  const pts = solveDesign(st);
  const dxf = makeDXF({ pts, n: st.n, walls: st.walls, diags: st.diagonals, name: 'my room', areaM2: '1', perimM: '1', scale: 10 });
  const parsed = parseDXF(dxf);
  assert.equal(dxfUnitScale(parsed, 0).source, 'guess'); // R12 export carries no $INSUNITS → 1000s of units → mm
  const { design } = dxfToDesign(parsed, { unitScale: 0.1 });
  // corner 12 is an exact 180° (straight) corner in the source → it vanishes from the drawing
  // (corner 11 is declared 180° too but the tape measurements bend it by 0.6°, so it stays)
  assert.equal(design.n, 14);
  const back = solveDesign(design);
  const src = pts.filter((_, i) => i !== 12);
  sameShape(back, src, 0.3);
});

test('binary DXF and DWG-like input are rejected with a clear message', () => {
  assert.throws(() => parseDXF('AutoCAD Binary DXF\r\n\x1a\x00'), /binary DXF/);
  assert.throws(() => parseDXF('AC1027\x00\x00garbage'), /not a DXF/);
  assert.throws(() => dxfToDesign(parseDXF(wrap(line([0, 0], [100, 0]))), { unitScale: 1 }), /no closed outline/);
});

console.log(`  ${passed} passed`);
