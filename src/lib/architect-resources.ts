// =============================================================================
// ARCHITECT RESOURCES — the specification library inside the architect area.
//
// HOW TO ADD / EDIT A RESOURCE (same pattern as datasheets.ts):
//   1. Drop the file into  architect-private/  (repo root — NOT under public/;
//      files are served only to signed-in architect/admin accounts via
//      GET /api/architect/file/[slug]).
//   2. Add or edit an entry below. `file` is the BARE filename.
//   3. Commit & push.
//
// An entry whose file is not on disk yet renders as "coming soon" in the
// dashboard (never a broken link) — so the entries below can go live before
// the files do. Filenames are case-sensitive on Vercel.
// =============================================================================

export type ArchitectResourceCategory = 'spec' | 'cad' | 'photos' | 'case-study';

export type ArchitectResource = {
  /** Stable id (kebab-case) — also used for tracking + the download URL. */
  slug: string;
  title: string;
  description: string;
  category: ArchitectResourceCategory;
  /** Bare filename inside architect-private/. */
  file: string;
  /** Shown on the row, e.g. 'DOCX', 'DWG', 'ZIP', 'PDF'. */
  format: string;
  sizeLabel?: string;
  updated: string;
  /** Language of the document, e.g. 'NL', 'FR', 'EN'. */
  lang?: string;
  /** Photos: one-line usage-rights note. */
  rightsNote?: string;
  /** Case studies: the system installed. */
  system?: string;
  location?: string;
  /** Case studies: 2–4 measured result rows. */
  results?: { k: string; v: string }[];
};

export const architectResources: ArchitectResource[] = [
  // ---- Specification texts (ready-to-paste tender clauses) ------------------
  // PLACEHOLDER — Michael drops the real .docx files into architect-private/.
  { slug: 'spec-polyester-nl', title: 'Bestektekst — polyester spanplafond', description: 'Kant-en-klare bestektekst voor het STRETCH polyester spansysteem: membraan, brandklasse B-s1,d0, profielen en plaatsing.', category: 'spec', file: 'spec-polyester-nl.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'NL' },
  { slug: 'spec-polyester-fr', title: 'Cahier des charges — plafond tendu polyester', description: 'Clause type pour le système tendu polyester STRETCH : membrane, classement au feu B-s1,d0, profilés et pose.', category: 'spec', file: 'spec-polyester-fr.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'FR' },
  { slug: 'spec-polyester-en', title: 'Specification — polyester stretch ceiling', description: 'Copy-ready tender specification for the STRETCH polyester system: membrane, fire class B-s1,d0, profiles and installation.', category: 'spec', file: 'spec-polyester-en.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'EN' },
  { slug: 'spec-pvc-nl', title: 'Bestektekst — PVC spanplafond', description: 'Kant-en-klare bestektekst voor het STRETCH PVC-spanplafond: folie tot 500 cm naadloos, brandklasse B-s1,d0, garantie.', category: 'spec', file: 'spec-pvc-nl.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'NL' },
  { slug: 'spec-pvc-fr', title: 'Cahier des charges — plafond tendu PVC', description: 'Clause type pour le plafond tendu PVC STRETCH : film jusqu’à 500 cm sans soudure, classement B-s1,d0, garantie.', category: 'spec', file: 'spec-pvc-fr.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'FR' },
  { slug: 'spec-pvc-en', title: 'Specification — PVC stretch ceiling', description: 'Copy-ready tender specification for the STRETCH PVC film ceiling: seamless widths up to 500 cm, fire class B-s1,d0, warranty.', category: 'spec', file: 'spec-pvc-en.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'EN' },
  { slug: 'spec-acoustic-nl', title: 'Bestektekst — akoestisch spanplafond', description: 'Bestektekst voor het STRETCH akoestische systeem: microgeperforeerd membraan, absorptie tot klasse A (αw 1.00).', category: 'spec', file: 'spec-acoustic-nl.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'NL' },
  { slug: 'spec-acoustic-fr', title: 'Cahier des charges — plafond acoustique', description: 'Clause type pour le système acoustique STRETCH : membrane microperforée, absorption jusqu’à la classe A (αw 1.00).', category: 'spec', file: 'spec-acoustic-fr.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'FR' },
  { slug: 'spec-acoustic-en', title: 'Specification — acoustic stretch ceiling', description: 'Tender specification for the STRETCH acoustic system: micro-perforated membrane, absorption up to Class A (αw 1.00).', category: 'spec', file: 'spec-acoustic-en.docx', format: 'DOCX', updated: 'Aug 2026', lang: 'EN' },

  // ---- CAD & BIM ------------------------------------------------------------
  // PLACEHOLDER — real DWG/RVT/SKP exports to follow.
  { slug: 'cad-profiles-dwg', title: 'Profile details — DWG', description: 'All STRETCH aluminium and PVC tension profiles as 2D CAD details: sections, fixing distances and membrane engagement.', category: 'cad', file: 'stretch-profile-details.dwg', format: 'DWG', updated: 'Aug 2026' },
  { slug: 'cad-ceiling-buildups-dwg', title: 'Ceiling build-ups — DWG', description: 'Standard build-up drawings: flat ceiling, cove, floating panel, backlit plenum and inspection hatch integration.', category: 'cad', file: 'stretch-ceiling-buildups.dwg', format: 'DWG', updated: 'Aug 2026' },
  { slug: 'bim-revit-family', title: 'Revit family — stretch ceiling systems', description: 'Parametric Revit family for STRETCH ceiling systems with membrane type, profile and plenum depth parameters.', category: 'cad', file: 'stretch-ceilings.rvt', format: 'RVT', updated: 'Aug 2026' },
  { slug: 'cad-sketchup-set', title: 'SketchUp component set', description: 'SketchUp components for quick concept models: flat, cove and floating stretch ceiling volumes.', category: 'cad', file: 'stretch-ceilings.skp', format: 'SKP', updated: 'Aug 2026' },

  // ---- Project photo sets ---------------------------------------------------
  // PLACEHOLDER — hi-res zips per reference project.
  { slug: 'photos-van-der-valk-wellness', title: 'Photo set — Van der Valk Boost Wellness', description: '700 m² hotel wellness: printed spa ceiling, curved organic wall and backlit skylight. Hi-res JPGs.', category: 'photos', file: 'photos-van-der-valk-wellness.zip', format: 'ZIP', updated: 'Aug 2026', rightsNote: 'Free to use in client presentations with a STRETCH credit.' },
  { slug: 'photos-johnson-johnson', title: 'Photo set — Johnson & Johnson offices', description: 'Printed forest-canopy ceilings in the meeting suites. Hi-res JPGs.', category: 'photos', file: 'photos-johnson-johnson.zip', format: 'ZIP', updated: 'Aug 2026', rightsNote: 'Free to use in client presentations with a STRETCH credit.' },
  { slug: 'photos-event-halls', title: 'Photo set — event halls & venues', description: 'Black Back event ceilings and backlit installations across venue projects. Hi-res JPGs.', category: 'photos', file: 'photos-event-halls.zip', format: 'ZIP', updated: 'Aug 2026', rightsNote: 'Free to use in client presentations with a STRETCH credit.' },

  // ---- Technical case studies (measured results) ----------------------------
  // PLACEHOLDER — replace with real measured data (e.g. the Candor RT60 study).
  {
    slug: 'case-candor-rt60',
    title: 'Case study — restaurant acoustics (RT60)',
    description: 'Acoustic stretch ceiling retrofit in a 180-seat restaurant: full-surface Class A absorber above the guests, installed in two nights.',
    category: 'case-study', file: 'case-candor-rt60.pdf', format: 'PDF', updated: 'Aug 2026',
    system: 'Acoustic stretch ceiling 495AC', location: 'Belgium',
    results: [
      { k: 'RT60 before', v: '2.4 s' },
      { k: 'RT60 after', v: '0.7 s' },
      { k: 'Sound absorption class', v: 'A (αw 1.00)' },
      { k: 'Installation time', v: '2 nights, zero closure days' },
    ],
  },
  {
    slug: 'case-backlit-office',
    title: 'Case study — backlit office ceiling (lux & uniformity)',
    description: 'Translucent backlit ceiling over an open-plan office floor: even, glare-free light replacing a grid of downlights.',
    category: 'case-study', file: 'case-backlit-office.pdf', format: 'PDF', updated: 'Aug 2026',
    system: 'Translucent 308T + LED bars SBL', location: 'Netherlands',
    results: [
      { k: 'Task-plane illuminance', v: '540 lux average' },
      { k: 'Uniformity U0', v: '0.82' },
      { k: 'Glare rating UGR', v: '< 16' },
    ],
  },
];

/** Look up a resource by slug. */
export const getArchitectResource = (slug: string): ArchitectResource | undefined =>
  architectResources.find((r) => r.slug === slug);

/** Resources of one category, in file order. */
export const architectResourcesByCategory = (category: ArchitectResourceCategory): ArchitectResource[] =>
  architectResources.filter((r) => r.category === category);
