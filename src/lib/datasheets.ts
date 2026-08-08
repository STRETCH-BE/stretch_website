// =============================================================================
// DATASHEETS — the downloadable technical documents library.
//
// HOW TO ADD / EDIT A DATASHEET:
//   1. Drop the PDF into  public/datasheets/  (create the folder if needed).
//   2. Add or edit an entry below. `file` is the public path to the PDF.
//   3. Commit & push.
//
// Every download is gated: the visitor must submit name + email + phone first
// (captured as a lead via /api/lead), then the file downloads.
//
// Filenames are case-sensitive on Vercel — match them EXACTLY. Group documents
// with `category`; the page lists them grouped, in the order below.
// =============================================================================

export type Datasheet = {
  /** Stable id (kebab-case) — also used for tracking. */
  slug: string;
  title: string;
  description: string;
  /** Grouping heading on the page (e.g. 'Ceiling systems', 'Compliance'). */
  category: string;
  /** Public path to the file, e.g. '/datasheets/acoustic-stretch-system.pdf'. */
  file: string;
  /** Shown on the button row, e.g. 'PDF'. */
  format?: string;
  /** Optional human size, e.g. '1.2 MB'. */
  sizeLabel?: string;
  /** Optional 'last updated' note, e.g. 'Jan 2026'. */
  updated?: string;
};

export const datasheets: Datasheet[] = [
  // ---- Ceiling systems (membranes) ----------------------------------------
  {
    slug: 'pvc-stretch-ceiling',
    title: 'PVC film stretch ceiling',
    description: '170 µm PVC ceiling film up to 500 cm seamless width: 24 colours, Supermirror / Satin / Matt finishes, fire class B-s1,d0 (EN 14716), 10-year warranty.',
    category: 'Ceiling systems',
    file: '/datasheets/pvc-stretch-ceiling.pdf',
    format: 'PDF',
    sizeLabel: '268 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-pvc-r',
    title: 'PVC film stretch ceiling PVC-R',
    description: '170 µm PVC film in widths up to 200 cm; fire class B-s1,d0 (EN 14716), 24 colours, BIO-PRUF treated, micro-perforated acoustic variants, 10-year warranty.',
    category: 'Ceiling systems',
    file: '/datasheets/stretch-pvc-r.pdf',
    format: 'PDF',
    sizeLabel: '284 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'polyester-stretch-ceiling',
    title: 'Polyester stretch ceiling STD',
    description: 'PU-coated polyester knit fabric, cold-mounted: widths 200/320/510 cm, 255 g/m², 0.4 mm, fire class B-s1,d0, with cleaning instructions.',
    category: 'Ceiling systems',
    file: '/datasheets/polyester-stretch-ceiling.pdf',
    format: 'PDF',
    sizeLabel: '341 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'polyester-705s',
    title: 'Polyester stretch ceiling 705S',
    description: 'PU-coated polyester fabric in six widths from 200 to 515 cm, 245 g/m², fire class B-s1,d0 — roughly 5× the strength of PVC film.',
    category: 'Ceiling systems',
    file: '/datasheets/polyester-705s.pdf',
    format: 'PDF',
    sizeLabel: '340 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'polyester-non-flammable',
    title: 'Non-flammable stretch ceiling A2',
    description: 'Non-flammable glassfibre weave ceiling fabric: 320 cm width, 270 g/m², RAL 9016, fire class A2-s1,d0.',
    category: 'Ceiling systems',
    file: '/datasheets/polyester-non-flammable.pdf',
    format: 'PDF',
    sizeLabel: '327 KB',
    updated: 'Aug 2026',
  },
  // ---- Acoustic ------------------------------------------------------------
  {
    slug: 'acoustic-stretch-system',
    title: 'Acoustic stretch system',
    description: 'STRETCH Acoustic PU-coated polyester fabric: 245 g/m², widths 200–515 cm, fire class B-s1,d0, sound absorption up to Class A (αw 1.00).',
    category: 'Acoustic',
    file: '/datasheets/acoustic-stretch-system.pdf',
    format: 'PDF',
    sizeLabel: '383 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-acoustic-495d',
    title: 'Acoustic stretch ceiling 495D',
    description: 'STRETCH Acoustic 495D fabric: 245 g/m², 0.4 mm, widths 200–515 cm, fire class B-s1,d0, αw 0.50–1.00 (Class A–D) depending on plenum depth.',
    category: 'Acoustic',
    file: '/datasheets/stretch-acoustic-495d.pdf',
    format: 'PDF',
    sizeLabel: '383 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-acoustic-705a',
    title: 'Acoustic stretch ceiling 705A',
    description: 'STRETCH Acoustic 705A fabric: 210 g/m², 0.3 mm, widths 200–510 cm, fire class B-s1,d0, absorption class D (αw 0.55 with D4010, 55 mm plenum).',
    category: 'Acoustic',
    file: '/datasheets/stretch-acoustic-705a.pdf',
    format: 'PDF',
    sizeLabel: '358 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-acoustic-colours',
    title: 'Acoustic stretch ceiling colours 495AC',
    description: 'STRETCH Acoustic 495AC fabric in 30 colours: 245 g/m², 0.4 mm, widths 250/320/515 cm, fire class B-s1,d0, absorption rating Class A.',
    category: 'Acoustic',
    file: '/datasheets/stretch-acoustic-colours.pdf',
    format: 'PDF',
    sizeLabel: '340 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-micro-perf',
    title: 'Micro-perforated acoustic PVC Micro-Perf',
    description: 'Micro-perforated PVC membranes (~250,000 perforations/m²): αw 0.45–0.75, NRC 0.45 for a single membrane, up to 0.90 with fibreglass backing.',
    category: 'Acoustic',
    file: '/datasheets/stretch-micro-perf.pdf',
    format: 'PDF',
    sizeLabel: '309 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretchsound-acoustic-panels',
    title: 'Stretchsound polyester wool acoustic panels',
    description: 'Sound-absorbing polyester wool (over 60% recycled PET): fire class B-s1,d0 (EN 13501-1), 20/40 kg/m³, 1200 × 1000 mm plates, rated −30 °C to +120 °C.',
    category: 'Acoustic',
    file: '/datasheets/stretchsound-acoustic-panels.pdf',
    format: 'PDF',
    sizeLabel: '150 KB',
    updated: 'Aug 2026',
  },
  // ---- Light & backlit -----------------------------------------------------
  {
    slug: 'stretch-translucent-307-308-309t',
    title: 'Translucent backlit ceiling 307T/308T/309T',
    description: 'PU-coated translucent polyester fabric for backlit ceilings: 30/50/70% light transmission, widths 250/320/510 cm, 200 g/m², fire class B-s1,d0.',
    category: 'Light & backlit',
    file: '/datasheets/stretch-translucent-307-308-309t.pdf',
    format: 'PDF',
    sizeLabel: '346 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-backlit-lux',
    title: 'Backlit stretch ceiling LUX',
    description: 'PU-acrylic coated translucent polyester fabric (SF-T-LUX) with 50% light transmission: widths 250/320/510 cm, 155 g/m², 0.3 mm, fire class B-s1,d0.',
    category: 'Light & backlit',
    file: '/datasheets/stretch-backlit-lux.pdf',
    format: 'PDF',
    sizeLabel: '350 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-black-back',
    title: 'Black Back stretch ceiling',
    description: 'PU-coated polyester Black Back fabric (SF-BB) for light-tight event ceilings: widths 200/320/510 cm, 245 g/m², 0.4 mm, fire class B-s1,d0, 10-year warranty.',
    category: 'Light & backlit',
    file: '/datasheets/stretch-black-back.pdf',
    format: 'PDF',
    sizeLabel: '337 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-lighting-sbl',
    title: 'LED lighting bar SBL',
    description: '24 V DC LED bars SBL-93 (930 mm, 950 lm) and SBL-43 (430 mm, 550 lm) for backlit ceilings: 110 lm/W, CRI 90, IP60, 160° lens, CCT 2700–9000 K.',
    category: 'Light & backlit',
    file: '/datasheets/stretch-lighting-sbl.pdf',
    format: 'PDF',
    sizeLabel: '1.0 MB',
    updated: 'Aug 2026',
  },
  // ---- Prefab & accessories ------------------------------------------------
  {
    slug: 'prefab-l-cove-1010',
    title: 'Prefab cove element L-COVE 1010',
    description: 'Technical drawing of the prefab L-shaped aluminium cove element, 100 × 100 mm section in 3050 mm lengths, with section and corner details.',
    category: 'Prefab & accessories',
    file: '/datasheets/prefab-l-cove-1010.pdf',
    format: 'PDF',
    sizeLabel: '298 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'prefab-l-cove-1610',
    title: 'Prefab cove element L-COVE 1610',
    description: 'Technical drawing of the prefab L-shaped aluminium cove element, 160 × 100 mm section in 3050 mm lengths, with section and corner details.',
    category: 'Prefab & accessories',
    file: '/datasheets/prefab-l-cove-1610.pdf',
    format: 'PDF',
    sizeLabel: '314 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-inspection-hatch',
    title: 'Inspection hatch for STRETCH ceilings (NL)',
    description: 'Built-in inspection hatch for STRETCH ceilings and walls: 2 mm aluminium fixed and removable frames, 33 mm depth, snaplock closures and safety cable.',
    category: 'Prefab & accessories',
    file: '/datasheets/stretch-inspection-hatch.pdf',
    format: 'PDF',
    sizeLabel: '239 KB',
    updated: 'Aug 2026',
  },
  // ---- Specials & outdoor --------------------------------------------------
  {
    slug: 'stretch-invisible-speaker',
    title: 'Invisible speaker SIS (NL)',
    description: 'SIS-400 concealed two-way speakers behind the membrane: 4-inch woofer plus tweeter, 6/8 W, 8 Ω, passive or WLAN/FM/Bluetooth variants, 404 × 357 × 48 mm.',
    category: 'Specials & outdoor',
    file: '/datasheets/stretch-invisible-speaker.pdf',
    format: 'PDF',
    sizeLabel: '466 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-mirror',
    title: 'Stretch mirror panels S-MIRROR',
    description: 'Made-to-measure silver mirror film panels on an aluminium frame: 280 cm width, 2000 g/m², fire class B-s1,d0, αw 0.75 with 60–100 mm glass-wool backing.',
    category: 'Specials & outdoor',
    file: '/datasheets/stretch-mirror.pdf',
    format: 'PDF',
    sizeLabel: '442 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-ir-heating',
    title: 'IR heating film S-H-IR-R',
    description: '220 V infrared ceiling/floor heating film, 220–280 W/m², surface below 60 °C, widths 330–1000 mm, 0.5 kg/m², with wiring and thermostat instructions.',
    category: 'Specials & outdoor',
    file: '/datasheets/stretch-ir-heating.pdf',
    format: 'PDF',
    sizeLabel: '518 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'stretch-outdoor',
    title: 'Outdoor stretch fabric SF-OD',
    description: 'PVC-coated polyester knitted fabric for outdoor ceilings: widths 320/500 cm, 500 g/m², matt white RAL 9016, UV and water resistant.',
    category: 'Specials & outdoor',
    file: '/datasheets/stretch-outdoor.pdf',
    format: 'PDF',
    sizeLabel: '464 KB',
    updated: 'Aug 2026',
  },
  // ---- Profiles & installation details ------------------------------------
  {
    slug: 'profiles-p-c6',
    title: 'Ceiling & wall profile P-C6',
    description: 'PVC tension profile for ceiling and wall fixing: 27 × 10 mm cross-section, 140 g/m, extruded PVC, 2 m strips in white or black.',
    category: 'Profiles & installation details',
    file: '/datasheets/profiles-p-c6.pdf',
    format: 'PDF',
    sizeLabel: '107 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'profiles-s-pp-c01',
    title: 'Ceiling & wall profile S-PP-C01',
    description: 'PVC tension profile for ceiling and wall fixing: 31.8 × 11 mm, 200 g/m, pre-drilled every 10 cm, 2000 or 2700 mm lengths in white, beige or black.',
    category: 'Profiles & installation details',
    file: '/datasheets/profiles-s-pp-c01.pdf',
    format: 'PDF',
    sizeLabel: '116 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 's-bs-pvc-01-installation',
    title: 'Installation drawing S-BS-PVC-01',
    description: 'Technical drawing for mounting the S-BS-PVC-01 wall profile: fixed every 100 mm with 4.2 × 25 mm screws and 6 × 30 mm dowels.',
    category: 'Profiles & installation details',
    file: '/datasheets/s-bs-pvc-01-installation.pdf',
    format: 'PDF',
    sizeLabel: '48 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 's-bs-f-02-installation',
    title: 'Fabric system base structure S-BS-F-02',
    description: 'Technical drawing of the base structure for the S-BS-F-02 fabric system: wall fixing with 6 × 80 mm screws, 8 × 50 mm dowels and staples every 100 mm.',
    category: 'Profiles & installation details',
    file: '/datasheets/s-bs-f-02-installation.pdf',
    format: 'PDF',
    sizeLabel: '84 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 's-bs-f-02-track-support',
    title: 'Base structure with track support S-BS-F-02',
    description: 'Technical drawing of the S-BS-F-02 base structure with supports: nail + glue or 6 × 40 screw and 8 × 40 plug fixing, 2–3 mm gap above the membrane.',
    category: 'Profiles & installation details',
    file: '/datasheets/s-bs-f-02-track-support.pdf',
    format: 'PDF',
    sizeLabel: '57 KB',
    updated: 'Aug 2026',
  },
  {
    slug: 'basic-structure-stretch-ceiling',
    title: 'Basic stretch ceiling structure S-BS-1 (NL)',
    description: 'Technical drawing of the basic stretch ceiling substructure with section views and fixing specification (30 staples of 9.2 × 15 × 1.5 mm per 1000 mm).',
    category: 'Profiles & installation details',
    file: '/datasheets/basic-structure-stretch-ceiling-nl.pdf',
    format: 'PDF',
    sizeLabel: '199 KB',
    updated: 'Aug 2026',
  },
  // ---- Maintenance ---------------------------------------------------------
  {
    slug: 'maintenance-stretch-ceilings',
    title: 'Maintenance of stretch ceilings (NL)',
    description: 'Care guide for PU-coated polyester stretch ceilings: clean with STRETCH Cleaner or pH-neutral products and a soft white cloth; never use bleach.',
    category: 'Maintenance',
    file: '/datasheets/maintenance-stretch-ceilings-nl.pdf',
    format: 'PDF',
    sizeLabel: '252 KB',
    updated: 'Aug 2026',
  },
];

/** Look up a datasheet by slug. */
export const getDatasheet = (slug: string): Datasheet | undefined =>
  datasheets.find((d) => d.slug === slug);

/** Datasheets offered for download on /technical/{membrane}/datasheet. */
export const membraneDatasheets: Record<'polyester' | 'pvc', string[]> = {
  polyester: [
    'polyester-stretch-ceiling',
    'polyester-705s',
    'polyester-non-flammable',
    'acoustic-stretch-system',
    'stretch-translucent-307-308-309t',
    'stretch-backlit-lux',
    's-bs-f-02-installation',
    's-bs-f-02-track-support',
  ],
  pvc: [
    'pvc-stretch-ceiling',
    'stretch-pvc-r',
    'stretch-micro-perf',
    's-bs-pvc-01-installation',
  ],
};

/** Datasheets grouped by category, preserving array order. */
export function datasheetsByCategory(): { category: string; items: Datasheet[] }[] {
  const groups: { category: string; items: Datasheet[] }[] = [];
  for (const d of datasheets) {
    let g = groups.find((x) => x.category === d.category);
    if (!g) {
      g = { category: d.category, items: [] };
      groups.push(g);
    }
    g.items.push(d);
  }
  return groups;
}
