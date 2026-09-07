import { useState, useMemo, Fragment } from "react";

/* ============================================================================
   STRETCH — kit configurator prototype
   Visual + functional mock of /portal/configurator (prompt pack, 6 Sep 2026).

   SAMPLE DATA. The pricebook below mirrors the real table shape
   (category | code | product | unit | market | price_eur) and uses real MSD /
   protective-square figures where I had them; profiles, platforms, absorbers
   and lights are plausible fillers. The real tool reads Supabase.
   ==========================================================================*/

const T = {
  ink: "#0a0a0a",
  paper: "#ffffff",
  red: "#ff0000",
  line: "#e3e3e3",
  wash: "#f6f6f6",
  muted: "#6b6b6b",
};

const MARKETS = ["West Europe", "East Europe", "Key account", "USA", "Installer"];

/* --- public.pricebook (sample extract) ----------------------------------- */
const PRICEBOOK = [
  // Ceilings made-to-measure — unit m² — PVC
  ["Ceilings made-to-measure", "MSD-MW-320", "MSD Mat White 320 cm", "m²", { "East Europe": 5.72, "West Europe": 11.08, USA: 13.13, "Key account": 4.44, Installer: 9.40 }],
  ["Ceilings made-to-measure", "MSD-MW-500", "MSD Mat White 500 cm", "m²", { "East Europe": 6.24, "West Europe": 12.09, USA: 14.33, "Key account": 4.85, Installer: 10.25 }],
  ["Ceilings made-to-measure", "MSD-MW-580", "MSD Mat White 580 cm", "m²", { "East Europe": 6.14, "West Europe": 11.90, USA: 14.10, "Key account": 6.34, Installer: 10.10 }],
  ["Ceilings made-to-measure", "MSD-SW-320", "MSD Satin White 320 cm", "m²", { "East Europe": 5.94, "West Europe": 11.51, USA: 13.63, Installer: 9.75 }],
  ["Ceilings made-to-measure", "MSD-SW-500", "MSD Satin White 500 cm", "m²", { "East Europe": 6.18, "West Europe": 11.97, USA: 14.18, Installer: 10.15 }],
  ["Ceilings made-to-measure", "MSD-GW-320", "MSD Glossy White 320 cm", "m²", { "East Europe": 6.02, "West Europe": 11.66, USA: 13.82, "Key account": 4.67, Installer: 9.90 }],
  ["Ceilings made-to-measure", "MSD-GW-500", "MSD Glossy White 500 cm", "m²", { "East Europe": 6.79, "West Europe": 13.15, USA: 15.58, "Key account": 5.26, Installer: 11.15 }],
  ["Ceilings made-to-measure", "MSD-MC-320", "MSD Mat Colour 320 cm", "m²", { "East Europe": 5.88, "West Europe": 11.39, USA: 13.50, Installer: 9.66 }],
  ["Ceilings made-to-measure", "MSD-MC-500", "MSD Mat Colour 500 cm", "m²", { "East Europe": 6.41, "West Europe": 12.42, USA: 14.72, Installer: 10.53 }],
  ["Ceilings made-to-measure", "MSD-SC-320", "MSD Satin Colour 320 cm", "m²", { "East Europe": 5.45, "West Europe": 10.56, USA: 12.51, Installer: 8.95 }],
  ["Ceilings made-to-measure", "MSD-SC-500", "MSD Satin Colour 500 cm", "m²", { "East Europe": 5.69, "West Europe": 11.02, USA: 13.07, Installer: 9.35 }],
  ["Ceilings made-to-measure", "MSD-GC-500", "MSD Glossy Color 500 cm", "m²", { "East Europe": 6.92, "West Europe": 13.41, USA: 15.89, "Key account": 5.96, Installer: 11.35 }],
  // Fabric — Installer market only. This is the "price on request" demo.
  ["Ceilings made-to-measure", "CLP-495-510", "Clipso 495 SA 510 cm", "m²", { Installer: 18.90 }],
  ["Ceilings made-to-measure", "CLP-ACO-510", "Clipso Acoustic 510 cm", "m²", { Installer: 24.60 }],

  // Profiles ALU/PVC — sold per 2 m piece
  ["Profiles ALU/PVC", "SP-PVC-KP-2M", "PVC clip-in profile 2 m", "pc", { "East Europe": 3.10, "West Europe": 5.90, USA: 8.40, "Key account": 2.65, Installer: 5.20 }],
  ["Profiles ALU/PVC", "SP-ALU-HP-2M", "ALU harpoon profile visible 2 m", "pc", { "East Europe": 6.20, "West Europe": 11.80, USA: 16.50, "Key account": 5.30, Installer: 10.40 }],
  ["Profiles ALU/PVC", "SP-ALU-SL-2M", "ALU shadow-line profile 2 m", "pc", { "East Europe": 8.40, "West Europe": 15.90, USA: 22.00, "Key account": 7.15, Installer: 14.00 }],
  ["Profiles ALU/PVC", "SP-ALU-TR-2M", "ALU angle/transition profile 2 m", "pc", { "East Europe": 7.10, "West Europe": 13.40, USA: 18.60, "Key account": 6.05, Installer: 11.80 }],

  // Profile accessories
  ["Profile accessories", "ACC-CIN", "Inside corner clip", "pc", { "East Europe": 0.45, "West Europe": 1.10, USA: 1.60, "Key account": 0.38, Installer: 0.95 }],
  ["Profile accessories", "ACC-COUT", "Outside corner clip", "pc", { "East Europe": 0.55, "West Europe": 1.30, USA: 1.90, "Key account": 0.47, Installer: 1.15 }],

  // Accessories PVC — platforms + rings (protective squares are real figures)
  ["Accessories PVC", "PLT-SPOT-F75", "Platform fixed spot Ø75", "pc", { "East Europe": 1.20, "West Europe": 2.60, USA: 3.80, "Key account": 1.05, Installer: 2.30 }],
  ["Accessories PVC", "PLT-SPOT-A90", "Platform adjustable spot Ø60–90", "pc", { "East Europe": 1.60, "West Europe": 3.40, USA: 4.90, "Key account": 1.35, Installer: 3.00 }],
  ["Accessories PVC", "PLT-SPK-160", "Platform speaker Ø160", "pc", { "East Europe": 3.80, "West Europe": 7.90, USA: 11.40, "Key account": 3.20, Installer: 6.95 }],
  ["Accessories PVC", "PRS-90", "Protective square 90*90", "pc", { Producers: 0.19, "East Europe": 0.35, "West Europe": 0.93, USA: 14.00, "Key account": 0.30, Installer: 0.80 }],
  ["Accessories PVC", "PRS-160", "Protective square 160*160", "pc", { Producers: 0.20, "East Europe": 0.38, "West Europe": 1.00, USA: 15.00, "Key account": 0.32, Installer: 0.88 }],

  // Acoustic
  ["Accessories PVC", "ACO-FL40", "Acoustic fleece 40 mm", "m²", { "East Europe": 4.20, "West Europe": 8.60, USA: 12.10, "Key account": 3.55, Installer: 7.60 }],
  ["Accessories PVC", "ACO-MEL50", "Melamine absorber panel 50 mm", "m²", { Installer: 11.20 }],

  // Lighting
  ["Tracklighting 48V", "LT-GU10-WH", "GU10 spot ring white", "pc", { "East Europe": 4.10, "West Europe": 8.20, USA: 11.80, "Key account": 3.50, Installer: 7.20 }],
  ["Tracklighting 48V", "LT-MOD8-30", "LED module 8 W 3000K", "pc", { "East Europe": 6.30, "West Europe": 12.40, USA: 17.90, "Key account": 5.35, Installer: 10.90 }],
  ["Tracklighting 48V", "LT-MOD8-40", "LED module 8 W 4000K", "pc", { "East Europe": 6.30, "West Europe": 12.40, USA: 17.90, "Key account": 5.35, Installer: 10.90 }],
  ["Tracklighting 48V", "LT-MOD8-60", "LED module 8 W 6000K", "pc", { "East Europe": 6.45, "West Europe": 12.70, USA: 18.30, "Key account": 5.48, Installer: 11.15 }],
  ["Tracklighting 48V", "LT-DRV-150", "LED driver 24V 150 W", "pc", { "East Europe": 14.00, "West Europe": 27.50, USA: 39.00, "Key account": 11.90, Installer: 24.20 }],

  // Services
  ["Ceilings made-to-measure", "SRV-WELD", "Welding of membrane", "m", { "East Europe": 2.10, "West Europe": 4.30, USA: 6.10, "Key account": 1.80, Installer: 3.80 }],
].map(([category, code, product, unit, prices]) => ({ category, code, product, unit, prices }));

const row = (code) => PRICEBOOK.find((r) => r.code === code) || null;
const priceOf = (code, market) => {
  const r = row(code);
  if (!r) return { status: "no_row", price: null, r: null };
  const p = r.prices[market];
  return p == null ? { status: "no_price", price: null, r } : { status: "ok", price: p, r };
};

/* --- public.configurator_options (sample catalogue) ----------------------
   Foils are described by material + finish + colour + roll width. The user
   never picks a width: the engine picks the narrowest roll that covers the
   ceiling in one piece, and falls back to the widest one with a weld.        */
const FOILS = [
  { code: "MSD-MW-320", material: "PVC", finish: "matte", colour: "white", width: 320, name: "MSD Mat White" },
  { code: "MSD-MW-500", material: "PVC", finish: "matte", colour: "white", width: 500, name: "MSD Mat White" },
  { code: "MSD-MW-580", material: "PVC", finish: "matte", colour: "white", width: 580, name: "MSD Mat White" },
  { code: "MSD-SW-320", material: "PVC", finish: "satin", colour: "white", width: 320, name: "MSD Satin White" },
  { code: "MSD-SW-500", material: "PVC", finish: "satin", colour: "white", width: 500, name: "MSD Satin White" },
  { code: "MSD-GW-320", material: "PVC", finish: "gloss", colour: "white", width: 320, name: "MSD Glossy White" },
  { code: "MSD-GW-500", material: "PVC", finish: "gloss", colour: "white", width: 500, name: "MSD Glossy White" },
  { code: "MSD-MC-320", material: "PVC", finish: "matte", colour: "colour", width: 320, name: "MSD Mat Colour" },
  { code: "MSD-MC-500", material: "PVC", finish: "matte", colour: "colour", width: 500, name: "MSD Mat Colour" },
  { code: "MSD-SC-320", material: "PVC", finish: "satin", colour: "colour", width: 320, name: "MSD Satin Colour" },
  { code: "MSD-SC-500", material: "PVC", finish: "satin", colour: "colour", width: 500, name: "MSD Satin Colour" },
  { code: "MSD-GC-500", material: "PVC", finish: "gloss", colour: "colour", width: 500, name: "MSD Glossy Colour" },
  { code: "CLP-495-510", material: "fabric", kind: "standard", width: 510, name: "Clipso 495 SA" },
  { code: "CLP-ACO-510", material: "fabric", kind: "acoustic", width: 510, name: "Clipso Acoustic" },
];

const FINISHES = [
  { value: "matte", label: "Matte" },
  { value: "satin", label: "Satin" },
  { value: "gloss", label: "Gloss" },
];
const COLOURS = [
  { value: "white", label: "White" },
  { value: "colour", label: "Colour" },
];
const FABRICS = [
  { value: "standard", label: "Standard fabric" },
  { value: "acoustic", label: "Acoustic fabric" },
];

/** Narrowest roll in the chosen family that covers `need` metres in one piece. */
function pickFoil(cfg, need) {
  const family = FOILS.filter((f) =>
    cfg.material === "fabric"
      ? f.material === "fabric" && f.kind === cfg.fabric
      : f.material === "PVC" && f.finish === cfg.finish && f.colour === cfg.colour
  ).sort((a, b) => a.width - b.width);

  if (!family.length) return { foil: null, reason: "This combination is not in the pricelist." };
  const fit = family.find((f) => f.width / 100 >= need - 0.001);
  if (fit)
    return {
      foil: fit,
      reason: `${fit.width} cm roll covers your ${num(need)} m span in one piece — no weld.`,
    };
  const widest = family[family.length - 1];
  return {
    foil: widest,
    reason: `Widest roll in this finish is ${widest.width} cm, so the ceiling is welded to reach ${num(need)} m.`,
  };
}

const PROFILES = [
  { slug: "pvc-clip", code: "SP-PVC-KP-2M", label: "PVC clip-in", piece: 2 },
  { slug: "alu-harpoon", code: "SP-ALU-HP-2M", label: "ALU harpoon, visible", piece: 2 },
  { slug: "alu-shadow", code: "SP-ALU-SL-2M", label: "ALU shadow line", piece: 2 },
];
const TRANSITION = { slug: "alu-angle", code: "SP-ALU-TR-2M", label: "ALU angle profile", piece: 2 };

const PLATFORMS = [
  { slug: "spot-f75", code: "PLT-SPOT-F75", label: "Fixed spot Ø75", ring: "PRS-90" },
  { slug: "spot-a90", code: "PLT-SPOT-A90", label: "Adjustable spot Ø60–90", ring: "PRS-90" },
  { slug: "speaker-160", code: "PLT-SPK-160", label: "Speaker Ø160", ring: "PRS-160" },
];

const ABSORBERS = [
  { slug: "none", code: null, label: "None" },
  { slug: "fleece-40", code: "ACO-FL40", label: "Acoustic fleece 40 mm" },
  { slug: "melamine-50", code: "ACO-MEL50", label: "Melamine panel 50 mm" },
];

const LIGHT_TYPES = [
  { slug: "gu10", label: "GU10 spot ring", colours: { white: "LT-GU10-WH" }, driver: null },
  {
    slug: "led-8w",
    label: "LED module 8 W",
    colours: { "3000K": "LT-MOD8-30", "4000K": "LT-MOD8-40", "6000K": "LT-MOD8-60" },
    driver: { code: "LT-DRV-150", per: 10 },
  },
];

const MIN_BILLABLE_M2 = 1;
const CORNER_DEFAULTS = { flatInside: 4, flatOutside: 0, foldInside: 4, foldOutside: 2 };

/* --- BOM engine ---------------------------------------------------------- */
function buildBom(cfg, market) {
  const L = Math.max(0, cfg.length);
  const W = Math.max(0, cfg.width);
  const S = cfg.shape === "slope" ? Math.max(0, cfg.slopeRun) : 0;
  const foldSide = cfg.foldSide === "width" ? W : L;

  const flatArea = L * W;
  const slopeArea = cfg.shape === "slope" ? foldSide * S : 0;
  const area = Math.max(MIN_BILLABLE_M2, +(flatArea + slopeArea).toFixed(2));
  const perimeter = cfg.shape === "slope" ? 2 * L + 2 * W + 2 * S : 2 * (L + W);

  const lines = [];
  const notes = [];
  const push = (kind, code, qty, unitOverride, note) => {
    if (!code || qty <= 0) return;
    const { status, price, r } = priceOf(code, market);
    lines.push({
      kind,
      code,
      product: r ? r.product : code,
      unit: unitOverride || (r ? r.unit : ""),
      qty: +qty.toFixed(2),
      price,
      status,
      total: price == null ? null : +(price * qty).toFixed(2),
      note,
    });
  };

  // 1. Membrane — the foil is chosen automatically from material + finish + colour
  const panels = [[L, W]];
  if (cfg.shape === "slope") panels.push([foldSide, S]);
  const need = Math.max(...panels.map(([a, b]) => Math.min(a, b)), 0);
  const { foil, reason: foilReason } = pickFoil(cfg, need);
  push("Ceiling", foil?.code, area, "m²");
  if (!foil) notes.push("No foil in the pricelist matches this finish and colour.");

  // 2. Welding — panels wider than the chosen roll
  if (foil) {
    const w = foil.width / 100;
    let weldM = 0;
    panels.forEach(([a, b]) => {
      if (Math.min(a, b) > w) {
        const n = Math.ceil(Math.min(a, b) / w) - 1;
        weldM += n * Math.max(a, b);
      }
    });
    if (weldM > 0) {
      push("Ceiling", "SRV-WELD", weldM, "m", "panel wider than the roll");
      notes.push(`Your ceiling is wider than the ${foil.width} cm roll, so it is welded in production.`);
    }
  }

  // 3. Perimeter profile
  const prof = PROFILES.find((p) => p.slug === cfg.profile);
  if (prof && perimeter > 0) push("Profile", prof.code, Math.ceil(perimeter / prof.piece), "pc");

  // 4. Angle profile at the fold
  if (cfg.shape === "slope" && foldSide > 0) {
    push("Profile", TRANSITION.code, Math.ceil(foldSide / TRANSITION.piece), "pc", "at the fold");
  }

  // 5. Corners
  push("Corners", "ACC-CIN", cfg.cornersInside, "pc");
  push("Corners", "ACC-COUT", cfg.cornersOutside, "pc");

  // 6. Platforms + their protective rings
  cfg.platforms.forEach((p) => {
    const opt = PLATFORMS.find((x) => x.slug === p.slug);
    if (!opt || p.qty <= 0) return;
    push("Platforms", opt.code, p.qty, "pc");
    push("Platforms", opt.ring, p.qty, "pc", "protective ring");
  });

  // 7. Acoustic absorber — always the same surface as the ceiling
  const abs = ABSORBERS.find((a) => a.slug === cfg.absorber);
  if (abs?.code) push("Acoustic", abs.code, area, "m²", "follows the ceiling surface");

  // 8. Lights + driver
  const lt = LIGHT_TYPES.find((t) => t.slug === cfg.lightType);
  if (lt && cfg.lightQty > 0) {
    const code = lt.colours[cfg.lightColour] || Object.values(lt.colours)[0];
    push("Lighting", code, cfg.lightQty, "pc");
    if (lt.driver) push("Lighting", lt.driver.code, Math.ceil(cfg.lightQty / lt.driver.per), "pc", `1 per ${lt.driver.per} lights`);
  }

  const priced = lines.filter((l) => l.total != null);
  const open = lines.filter((l) => l.total == null);
  return {
    lines,
    notes,
    foil,
    foilReason,
    need: +need.toFixed(2),
    area,
    perimeter: +perimeter.toFixed(2),
    flatArea: +flatArea.toFixed(2),
    slopeArea: +slopeArea.toFixed(2),
    subtotal: +priced.reduce((s, l) => s + l.total, 0).toFixed(2),
    openCount: open.length,
  };
}

/* --- formatting ---------------------------------------------------------- */
const eur = (n) =>
  n == null ? "—" : "€ " + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (n) => n.toLocaleString("en-GB", { maximumFractionDigits: 2 });

/* --- small UI pieces ----------------------------------------------------- */
function Section({ n, title, children }) {
  return (
    <section className="sec">
      <h2>
        <span className="secn">{n}</span>
        {title}
      </h2>
      <div className="secbody">{children}</div>
    </section>
  );
}

function Num({ label, value, onChange, step = 0.1, min = 0, suffix }) {
  return (
    <label className="fld">
      <span>{label}</span>
      <div className="numwrap">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
        />
        {suffix && <em>{suffix}</em>}
      </div>
    </label>
  );
}

function Pick({ label, value, onChange, options }) {
  return (
    <label className="fld">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* --- plan view ----------------------------------------------------------- */
function PlanView({ L, W, S, shape, foldSide }) {
  const slope = shape === "slope";
  const alongLength = foldSide === "length";
  const boxW = 300;
  const boxH = 190;
  const pad = 34;
  const spanX = slope && !alongLength ? L + S : L;
  const spanY = slope && alongLength ? W + S : W;
  const k = Math.min((boxW - pad * 2) / Math.max(spanX, 0.1), (boxH - pad * 2) / Math.max(spanY, 0.1));
  const w = L * k;
  const h = W * k;
  const s = S * k;
  const x0 = pad;
  const y0 = pad;

  return (
    <svg viewBox={`0 0 ${boxW} ${boxH}`} className="plan" role="img" aria-label="Ceiling plan">
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke={T.ink} strokeWidth="1.5" />
      {slope && alongLength && (
        <>
          <rect x={x0} y={y0 + h} width={w} height={s} fill={T.wash} stroke={T.ink} strokeWidth="1.5" />
          <line x1={x0} y1={y0 + h} x2={x0 + w} y2={y0 + h} stroke={T.red} strokeWidth="2.5" />
          <text x={x0 + w / 2} y={y0 + h + s / 2 + 4} textAnchor="middle" className="pv-in">
            slope {num(S)} m
          </text>
        </>
      )}
      {slope && !alongLength && (
        <>
          <rect x={x0 + w} y={y0} width={s} height={h} fill={T.wash} stroke={T.ink} strokeWidth="1.5" />
          <line x1={x0 + w} y1={y0} x2={x0 + w} y2={y0 + h} stroke={T.red} strokeWidth="2.5" />
          <text x={x0 + w + s / 2} y={y0 + h / 2} textAnchor="middle" className="pv-in" transform={`rotate(90 ${x0 + w + s / 2} ${y0 + h / 2})`}>
            slope {num(S)} m
          </text>
        </>
      )}
      <text x={x0 + w / 2} y={y0 - 12} textAnchor="middle" className="pv">
        {num(L)} m
      </text>
      <text x={x0 - 12} y={y0 + h / 2} textAnchor="middle" className="pv" transform={`rotate(-90 ${x0 - 12} ${y0 + h / 2})`}>
        {num(W)} m
      </text>
      <style>{`
        .pv { font-size: 11px; fill: ${T.muted}; letter-spacing: .02em; }
        .pv-in { font-size: 10px; fill: ${T.muted}; }
      `}</style>
    </svg>
  );
}

/* --- app ----------------------------------------------------------------- */
export default function App() {
  const [market, setMarket] = useState("West Europe");
  const [cfg, setCfg] = useState({
    length: 4.2,
    width: 3.4,
    shape: "flat",
    slopeRun: 1.2,
    foldSide: "length",
    ceilingType: "PVC",
    material: "PVC",
    finish: "matte",
    colour: "white",
    fabric: "standard",
    profile: "alu-harpoon",
    cornersInside: 4,
    cornersOutside: 0,
    platforms: [{ slug: "spot-f75", qty: 6 }],
    absorber: "none",
    lightType: "led-8w",
    lightColour: "3000K",
    lightQty: 6,
  });
  const [stage, setStage] = useState("build"); // build | confirm | done
  const [order, setOrder] = useState({ email: "info@dealer.be", address: "", ref: "", note: "" });
  const [placed, setPlaced] = useState(null);
  const [showMail, setShowMail] = useState(false);
  const [history, setHistory] = useState([]);

  const set = (k, v) => setCfg((c) => ({ ...c, [k]: v }));
  const bom = useMemo(() => buildBom(cfg, market), [cfg, market]);

  // corner defaults follow the shape until the user overrides them
  const applyShape = (shape) => {
    const d = shape === "slope" ? CORNER_DEFAULTS : CORNER_DEFAULTS;
    setCfg((c) => ({
      ...c,
      shape,
      cornersInside: shape === "slope" ? d.foldInside : d.flatInside,
      cornersOutside: shape === "slope" ? d.foldOutside : d.flatOutside,
    }));
  };

  const grouped = bom.lines.reduce((acc, l) => {
    (acc[l.kind] = acc[l.kind] || []).push(l);
    return acc;
  }, {});

  const place = () => {
    const ref = `STR-2026-${String(43 + history.length).padStart(4, "0")}`;
    const rec = {
      ref,
      at: new Date(),
      total: bom.subtotal,
      open: bom.openCount,
      market,
      lines: bom.lines,
      cfg: { ...cfg },
      foil: bom.foil ? `${bom.foil.name} ${bom.foil.width} cm` : "—",
      area: bom.area,
    };
    setPlaced(rec);
    setHistory((h) => [rec, ...h]);
    setStage("done");
  };

  const reset = () => {
    setStage("build");
    setPlaced(null);
    setShowMail(false);
  };

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,400;125,600;125,800&display=swap');
        * { box-sizing: border-box; }
        .app {
          font-family: 'Archivo', 'Arial Narrow', system-ui, sans-serif;
          font-variation-settings: 'wdth' 125;
          color: ${T.ink}; background: ${T.paper};
          font-size: 15px; line-height: 1.45;
          padding: 0 0 96px;
        }
        .app input, .app select, .app textarea, .app button { font: inherit; font-variation-settings: inherit; border-radius: 0; }
        .bar { background: ${T.ink}; color: ${T.paper}; padding: 14px 16px; display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; }
        .bar h1 { font-size: 17px; font-weight: 800; margin: 0; letter-spacing: -.01em; }
        .bar .sub { font-size: 12.5px; color: #b9b9b9; }
        .demo { background: ${T.red}; color: #fff; font-size: 12px; padding: 8px 16px; }
        .wrap { padding: 0 16px; }
        .sec { border-bottom: 1px solid ${T.line}; padding: 18px 0 20px; }
        .sec h2 { font-size: 15px; font-weight: 800; margin: 0 0 14px; display: flex; align-items: center; gap: 10px; }
        .secn { width: 22px; height: 22px; background: ${T.ink}; color: #fff; font-size: 11px; font-weight: 700;
                display: inline-flex; align-items: center; justify-content: center; flex: none; }
        .secbody { display: grid; gap: 12px; }
        .two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .fld { display: grid; gap: 5px; }
        .fld > span { font-size: 12.5px; color: ${T.muted}; }
        .fld input, .fld select, .fld textarea {
          border: 1px solid ${T.line}; padding: 10px 11px; width: 100%; background: #fff; color: ${T.ink};
        }
        .fld input:focus, .fld select:focus, .fld textarea:focus { outline: 2px solid ${T.red}; outline-offset: -2px; border-color: ${T.red}; }
        .numwrap { position: relative; display: flex; align-items: center; }
        .numwrap em { position: absolute; right: 11px; font-style: normal; font-size: 12px; color: ${T.muted}; pointer-events: none; }
        .numwrap input { padding-right: 34px; font-variant-numeric: tabular-nums; }
        .seg { display: flex; border: 1px solid ${T.ink}; }
        .seg button { flex: 1; border: 0; background: #fff; padding: 10px 8px; cursor: pointer; font-size: 13px; }
        .seg button + button { border-left: 1px solid ${T.ink}; }
        .seg button[aria-pressed="true"] { background: ${T.ink}; color: #fff; font-weight: 700; }
        .chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .derived { display: flex; gap: 18px; flex-wrap: wrap; border-top: 1px solid ${T.line}; padding-top: 10px; }
        .derived div { display: grid; gap: 1px; }
        .derived span { font-size: 11.5px; color: ${T.muted}; }
        .derived b { font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; }
        .auto { border-left: 3px solid ${T.red}; background: ${T.wash}; padding: 10px 12px; display: grid; gap: 2px; }
        .autolbl { font-size: 11.5px; color: ${T.muted}; }
        .auto b { font-size: 14.5px; font-weight: 800; }
        .autowhy { font-size: 12px; color: ${T.muted}; }
        .chip { border: 1px solid ${T.line}; background: #fff; padding: 6px 10px; font-size: 12.5px; cursor: pointer; }
        .chip[aria-pressed="true"] { border-color: ${T.ink}; background: ${T.ink}; color: #fff; }
        .rowline { display: grid; grid-template-columns: 1fr 82px 32px; gap: 8px; align-items: end; }
        .mini { border: 1px solid ${T.line}; background: #fff; padding: 10px 0; cursor: pointer; font-size: 16px; line-height: 1; }
        .add { border: 1px dashed ${T.ink}; background: #fff; padding: 9px; cursor: pointer; font-size: 13px; width: 100%; }
        .panel { background: ${T.wash}; border-top: 3px solid ${T.ink}; margin-top: 4px; padding: 16px; }
        .plan { width: 100%; max-width: 340px; height: auto; display: block; margin: 0 auto 8px; }
        .facts { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12.5px; color: ${T.muted}; margin-bottom: 14px; justify-content: center; }
        .facts b { color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .warn { border-left: 3px solid ${T.red}; background: #fff; padding: 9px 11px; font-size: 12.5px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; font-size: 11.5px; color: ${T.muted}; font-weight: 600; padding: 6px 0; border-bottom: 1px solid ${T.line}; }
        th.r, td.r { text-align: right; }
        td { padding: 8px 0; border-bottom: 1px solid #ececec; vertical-align: top; font-variant-numeric: tabular-nums; }
        td.p { font-variant-numeric: normal; }
        .grp { font-size: 11.5px; font-weight: 700; padding-top: 14px; }
        .req { color: ${T.red}; font-size: 12px; }
        .lnote { display: block; color: ${T.muted}; font-size: 11.5px; }
        .tot { display: flex; justify-content: space-between; align-items: baseline; padding-top: 14px; font-weight: 800; font-size: 19px; font-variant-numeric: tabular-nums; }
        .fine { font-size: 11.5px; color: ${T.muted}; margin-top: 6px; }
        .cta { position: fixed; left: 0; right: 0; bottom: 0; background: ${T.ink}; color: #fff;
               display: flex; align-items: center; gap: 12px; padding: 10px 14px; z-index: 5; }
        .cta .amt { font-weight: 800; font-variant-numeric: tabular-nums; }
        .cta .lbl { font-size: 11.5px; color: #b9b9b9; }
        .cta button { margin-left: auto; background: ${T.red}; color: #fff; border: 0; padding: 12px 20px; font-weight: 800; cursor: pointer; }
        .sheet { border: 1px solid ${T.line}; padding: 16px; margin: 16px 0; }
        .sheet h3 { margin: 0 0 12px; font-size: 15px; font-weight: 800; }
        .btnrow { display: flex; gap: 8px; margin-top: 14px; }
        .btn { border: 1px solid ${T.ink}; background: #fff; padding: 11px 14px; cursor: pointer; font-size: 13.5px; }
        .btn.primary { background: ${T.red}; border-color: ${T.red}; color: #fff; font-weight: 800; }
        .ok { border-left: 3px solid ${T.ink}; padding: 12px 14px; background: ${T.wash}; }
        .ok b { font-size: 20px; display: block; font-variant-numeric: tabular-nums; }
        .mail { border: 1px solid ${T.line}; padding: 14px; font-size: 13px; margin-top: 12px; background: #fff; }
        .mail h4 { margin: 0 0 4px; font-size: 13px; }
        .mail .meta { color: ${T.muted}; font-size: 12px; margin-bottom: 10px; }
        .hist { font-size: 13px; }
        .hist div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${T.line}; font-variant-numeric: tabular-nums; }
        @media (min-width: 900px) {
          .cols { display: grid; grid-template-columns: 1fr 400px; gap: 32px; align-items: start; }
          .panel { position: sticky; top: 16px; margin-top: 18px; }
          .cta { position: static; margin-top: 16px; }
        }
      `}</style>

      <div className="bar">
        <h1>Ceiling configurator</h1>
        <span className="sub">/portal/configurator · signed in as dealer</span>
      </div>
      <div className="demo">
        Prototype with sample pricebook data. Real MSD and protective-square prices where I had them; profiles, platforms and
        lights are stand-ins. The live tool reads Supabase.
      </div>

      <div className="wrap">
        <div className="cols">
          <div>
            <Section n="0" title="Account tier (test switch)">
              <Pick
                label="Your prices come from this market — in the real portal it's fixed by your account"
                value={market}
                onChange={setMarket}
                options={MARKETS.map((m) => ({ value: m, label: m }))}
              />
            </Section>

            <Section n="1" title="Size and shape">
              <div className="two">
                <Num label="Length" value={cfg.length} onChange={(v) => set("length", v)} suffix="m" />
                <Num label="Width" value={cfg.width} onChange={(v) => set("width", v)} suffix="m" />
              </div>
              <div className="seg" role="group">
                <button aria-pressed={cfg.shape === "flat"} onClick={() => applyShape("flat")}>
                  Flat ceiling
                </button>
                <button aria-pressed={cfg.shape === "slope"} onClick={() => applyShape("slope")}>
                  Flat + angled
                </button>
              </div>
              {cfg.shape === "slope" && (
                <div className="two">
                  <Num label="Slope run (along the slope)" value={cfg.slopeRun} onChange={(v) => set("slopeRun", v)} suffix="m" />
                  <Pick
                    label="Fold runs along"
                    value={cfg.foldSide}
                    onChange={(v) => set("foldSide", v)}
                    options={[
                      { value: "length", label: "the length side" },
                      { value: "width", label: "the width side" },
                    ]}
                  />
                </div>
              )}
              <div className="derived">
                <div>
                  <span>Surface</span>
                  <b>{num(bom.area)} m²</b>
                </div>
                <div>
                  <span>Perimeter</span>
                  <b>{num(bom.perimeter)} m</b>
                </div>
                <div>
                  <span>Widest span</span>
                  <b>{num(bom.need)} m</b>
                </div>
              </div>
            </Section>

            <Section n="2" title="Foil">
              <div className="seg" role="group">
                <button aria-pressed={cfg.material === "PVC"} onClick={() => set("material", "PVC")}>
                  PVC
                </button>
                <button aria-pressed={cfg.material === "fabric"} onClick={() => set("material", "fabric")}>
                  Fabric
                </button>
              </div>
              {cfg.material === "PVC" ? (
                <div className="two">
                  <Pick label="Finish" value={cfg.finish} onChange={(v) => set("finish", v)} options={FINISHES} />
                  <Pick label="Colour" value={cfg.colour} onChange={(v) => set("colour", v)} options={COLOURS} />
                </div>
              ) : (
                <Pick label="Fabric" value={cfg.fabric} onChange={(v) => set("fabric", v)} options={FABRICS} />
              )}
              <div className="auto">
                <span className="autolbl">Foil chosen for you</span>
                <b>{bom.foil ? `${bom.foil.name} — ${bom.foil.width} cm roll` : "No match in the pricelist"}</b>
                <span className="autowhy">{bom.foilReason}</span>
              </div>
            </Section>

            <Section n="3" title="Perimeter profile and corners">
              <Pick
                label="Profile"
                value={cfg.profile}
                onChange={(v) => set("profile", v)}
                options={PROFILES.map((p) => ({ value: p.slug, label: `${p.label} — ${p.piece} m pieces` }))}
              />
              <div className="two">
                <Num label="Inside corners" value={cfg.cornersInside} onChange={(v) => set("cornersInside", v)} step={1} />
                <Num label="Outside corners" value={cfg.cornersOutside} onChange={(v) => set("cornersOutside", v)} step={1} />
              </div>
            </Section>

            <Section n="4" title="Platforms for spots">
              {cfg.platforms.map((p, i) => (
                <div className="rowline" key={i}>
                  <Pick
                    label={i === 0 ? "Type" : ""}
                    value={p.slug}
                    onChange={(v) =>
                      set("platforms", cfg.platforms.map((x, j) => (j === i ? { ...x, slug: v } : x)))
                    }
                    options={PLATFORMS.map((x) => ({ value: x.slug, label: x.label }))}
                  />
                  <Num
                    label={i === 0 ? "Qty" : ""}
                    value={p.qty}
                    step={1}
                    onChange={(v) => set("platforms", cfg.platforms.map((x, j) => (j === i ? { ...x, qty: v } : x)))}
                  />
                  <button
                    className="mini"
                    aria-label="Remove this platform type"
                    onClick={() => set("platforms", cfg.platforms.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="add"
                onClick={() => {
                  const used = cfg.platforms.map((p) => p.slug);
                  const next = PLATFORMS.find((p) => !used.includes(p.slug));
                  if (next) set("platforms", [...cfg.platforms, { slug: next.slug, qty: 1 }]);
                }}
              >
                Add another platform type
              </button>
            </Section>

            <Section n="5" title="Acoustic absorber">
              <Pick
                label="Type"
                value={cfg.absorber}
                onChange={(v) => set("absorber", v)}
                options={ABSORBERS.map((a) => ({ value: a.slug, label: a.label }))}
              />
              {cfg.absorber !== "none" && (
                <div className="auto">
                  <span className="autolbl">Absorber surface</span>
                  <b>{num(bom.area)} m²</b>
                  <span className="autowhy">Always the same surface as the ceiling.</span>
                </div>
              )}
            </Section>

            <Section n="6" title="Lights">
              <Pick
                label="Type"
                value={cfg.lightType}
                onChange={(v) => {
                  const t = LIGHT_TYPES.find((x) => x.slug === v);
                  setCfg((c) => ({ ...c, lightType: v, lightColour: Object.keys(t.colours)[0] }));
                }}
                options={LIGHT_TYPES.map((t) => ({ value: t.slug, label: t.label }))}
              />
              <div className="two">
                <Pick
                  label="Light colour"
                  value={cfg.lightColour}
                  onChange={(v) => set("lightColour", v)}
                  options={Object.keys(LIGHT_TYPES.find((t) => t.slug === cfg.lightType).colours).map((k) => ({
                    value: k,
                    label: k,
                  }))}
                />
                <Num label="Quantity" value={cfg.lightQty} step={1} onChange={(v) => set("lightQty", v)} />
              </div>
            </Section>
          </div>

          {/* ---------- summary panel ---------- */}
          <div className="panel">
            <PlanView L={cfg.length} W={cfg.width} S={cfg.slopeRun} shape={cfg.shape} foldSide={cfg.foldSide} />
            <div className="facts">
              <span>
                Membrane <b>{num(bom.area)} m²</b>
              </span>
              <span>
                Perimeter <b>{num(bom.perimeter)} m</b>
              </span>
              <span>
                Market <b>{market}</b>
              </span>
            </div>

            {bom.notes.map((n, i) => (
              <div className="warn" key={i}>
                {n}
              </div>
            ))}
            {bom.openCount > 0 && (
              <div className="warn">
                {bom.openCount} line{bom.openCount > 1 ? "s have" : " has"} no price for {market}. We price
                {bom.openCount > 1 ? " them" : " it"} by hand and confirm before production.
              </div>
            )}

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="r">Qty</th>
                  <th className="r">Unit</th>
                  <th className="r">Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([kind, ls]) => (
                  <Fragment key={kind}>
                    <tr>
                      <td className="grp p" colSpan={4}>
                        {kind}
                      </td>
                    </tr>
                    {ls.map((l, i) => (
                      <tr key={kind + i}>
                        <td className="p">
                          {l.product}
                          {l.note && <span className="lnote">{l.note}</span>}
                        </td>
                        <td className="r">
                          {num(l.qty)} {l.unit}
                        </td>
                        <td className="r">{l.price == null ? <span className="req">on request</span> : eur(l.price)}</td>
                        <td className="r">{l.total == null ? "—" : eur(l.total)}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>

            <div className="tot">
              <span>{bom.openCount > 0 ? "From" : "Total"}</span>
              <span>{eur(bom.subtotal)}</span>
            </div>
            <p className="fine">
              Ex VAT, ex shipping. Invoicing in EUR (PLN for Poland). Pricelist 2026-08 · sample data.
            </p>
          </div>
        </div>

        {/* ---------- order flow ---------- */}
        {stage === "confirm" && (
          <div className="sheet">
            <h3>Place this order</h3>
            <div className="secbody">
              <label className="fld">
                <span>Confirmation e-mail</span>
                <input value={order.email} onChange={(e) => setOrder({ ...order, email: e.target.value })} />
              </label>
              <label className="fld">
                <span>Delivery address</span>
                <textarea rows={3} value={order.address} onChange={(e) => setOrder({ ...order, address: e.target.value })} />
              </label>
              <div className="two">
                <label className="fld">
                  <span>Your reference</span>
                  <input value={order.ref} onChange={(e) => setOrder({ ...order, ref: e.target.value })} />
                </label>
                <label className="fld">
                  <span>Note for production</span>
                  <input value={order.note} onChange={(e) => setOrder({ ...order, note: e.target.value })} />
                </label>
              </div>
            </div>
            <p className="fine">
              Clicking Place order sends it straight to us and confirms by e-mail. No payment is taken — a proforma invoice
              in EUR follows before production.
            </p>
            <div className="btnrow">
              <button className="btn primary" onClick={place}>
                Place order
              </button>
              <button className="btn" onClick={() => setStage("build")}>
                Back
              </button>
            </div>
          </div>
        )}

        {stage === "done" && placed && (
          <div className="sheet">
            <div className="ok">
              <b>{placed.ref}</b>
              Order received. A confirmation is on its way to {order.email}.
              {placed.open > 0 && ` ${placed.open} line${placed.open > 1 ? "s" : ""} still need a price — we confirm those by hand.`}
            </div>
            <div className="btnrow">
              <button className="btn" onClick={() => setShowMail(!showMail)}>
                {showMail ? "Hide" : "Show"} the confirmation e-mail
              </button>
              <button className="btn" onClick={reset}>
                Configure another
              </button>
            </div>

            {showMail && (
              <div className="mail">
                <h4>Your STRETCH order {placed.ref}</h4>
                <div className="meta">
                  to {order.email} · from order@stretchgroup.be
                </div>
                <p style={{ marginTop: 0 }}>
                  Thanks — we have your order. This confirms we received it. It is not an invoice and no payment has been
                  taken; we send a proforma invoice in EUR before production. Prices are ex VAT and ex shipping.
                </p>
                <p>
                  <strong>Your ceiling.</strong> {num(placed.cfg.length)} × {num(placed.cfg.width)} m
                  {placed.cfg.shape === "slope" ? `, plus an angled section of ${num(placed.cfg.slopeRun)} m` : ""} —{" "}
                  {num(placed.area)} m² of {placed.foil}.
                </p>
                <table>
                  <tbody>
                    {placed.lines.map((l, i) => (
                      <tr key={i}>
                        <td className="p">{l.product}</td>
                        <td className="r">
                          {num(l.qty)} {l.unit}
                        </td>
                        <td className="r">{l.total == null ? <span className="req">on request</span> : eur(l.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="tot">
                  <span>{placed.open > 0 ? "From" : "Total"}</span>
                  <span>{eur(placed.total)}</span>
                </div>
                <p className="fine">
                  Questions? Reply to this e-mail or call us. STRETCH · Gentseweg 309/A3, 9120 Beveren.
                </p>
              </div>
            )}
          </div>
        )}

        {history.length > 0 && stage !== "confirm" && (
          <div className="sheet hist">
            <h3>Your orders (this session)</h3>
            {history.map((h) => (
              <div key={h.ref}>
                <span>
                  {h.ref} · {h.market}
                </span>
                <span>
                  {eur(h.total)}
                  {h.open > 0 ? " +" : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {stage === "build" && (
        <div className="cta">
          <div>
            <div className="lbl">{bom.openCount > 0 ? "From, ex VAT" : "Total, ex VAT"}</div>
            <div className="amt">{eur(bom.subtotal)}</div>
          </div>
          <button onClick={() => setStage("confirm")}>Order</button>
        </div>
      )}
    </div>
  );
}
