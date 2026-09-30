# Updating the ceiling designer

The designer is a single self-contained HTML app embedded (base64) in
`src/lib/portal/designer-html.ts` and served only to signed-in portal users
via `/api/portal/designer` (it contains the Stretch price matrix — never put
it in `/public`).

To ship a new version of the tool:

```bash
node -e "
const fs = require('fs');
const b64 = fs.readFileSync('abc-floorplan.html').toString('base64');
const chunks = b64.match(/.{1,4000}/g).map(c => '  ' + JSON.stringify(c)).join(' +\n');
fs.writeFileSync('src/lib/portal/designer-html.ts',
  '// CLIENT PORTAL — ceiling designer app (base64, auth-gated).\n' +
  'export const DESIGNER_HTML_B64 =\n' + chunks + ';\n');
"
```

Then commit and deploy. No other file changes needed.

## DXF / DWG import

`Open` in the top bar accepts `.json` (measurement files) and `.dxf`
drawings. The importer lives in the pure `<script id="core">` block
(`parseDXF`, `dxfUnitScale`, `dxfToDesign`) and is covered by
`scripts/designer-dxf.test.mjs` (part of `npm test`), which decodes the
base64 module and runs the core in Node.

What it does:

- ASCII DXF, any version (R12 … 2018): `LINE`, `LWPOLYLINE`/`POLYLINE`
  (incl. bulge arcs), `ARC`, `CIRCLE`, `ELLIPSE`, `SPLINE` (approximated),
  block `INSERT`s (scaled / rotated / mirrored). Text, dimensions, hatches
  and the designer's own `DIAGONALS` / `DIMS` / `LABELS` layers are ignored.
- Loose lines are joined at their end points, dangling lines are pruned and
  the largest closed shape becomes the ceiling; closed shapes inside it
  become cut-outs (circle, ellipse, rectangle, regular polygon — anything
  else is replaced by its bounding rectangle with a warning).
- Tangent corner arcs become a corner radius; other curves are polygonised.
- Units: `$INSUNITS` from the header; if the drawing is unitless, the DXF
  units dropdown is used when the user changed it, otherwise the unit is
  guessed from the drawing size and the message says so.
- The room becomes wall lengths + a fan of diagonals from corner A (the
  lowest-left corner, walking counter-clockwise), corner flips are solved so
  the outline matches the drawing, and the display rotation keeps the
  drawing's orientation.

DWG is a closed binary format with no practical in-browser parser: a `.dwg`
file is accepted by the file picker only to show a message telling the user
to save it as DXF (SAVEAS → DXF in AutoCAD / BricsCAD, or the free ODA File
Converter). Binary DXF files get the same kind of message.
