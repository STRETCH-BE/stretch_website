// =============================================================================
// PREFAB PAGES — content + image slots for the two prefab pages:
//   • Prefab Structures      → /products/prefab-ceiling-unit
//   • Prefab Lighting Elements → /products/prefab-lighting-elements
//
// Both render with <PrefabPage>. Drop photos/drawings into public/images/prefab/
// and set the paths below. Empty string ('') = branded placeholder.
//
// Each case study has THREE image slots: a 3D render, a cut-view drawing and the
// end-result photo. Filenames are case-sensitive on Vercel — match them exactly.
// =============================================================================

export type PrefabItem = { title: string; body: string };

export type PrefabCase = {
  title: string;
  meta?: string;
  summary: string;
  render: string; // 3D render / drawing
  cutview: string; // cut-view / section drawing
  result: string; // finished result photo
};

export type PrefabPageData = {
  slug: string;
  name: string;
  eyebrow: string;
  metaDescription: string;
  intro: string;
  hero: string;
  makeHeading: string;
  make: PrefabItem[];
  materialsHeading: string;
  materials: PrefabItem[];
  caseStudies: PrefabCase[];
  worldwide: string;
};

// --- Prefab structures -------------------------------------------------------
export const prefabStructures: PrefabPageData = {
  slug: 'prefab-ceiling-unit',
  name: 'Prefab Structures',
  eyebrow: 'Prefab structures',
  metaDescription:
    'Prefab carrier structures for stretch ceilings — aluminium, steel and wood beams, coving and height-difference details, built in Belgium and shipped worldwide to STRETCH dealers.',
  intro:
    'We design and build the prefab carrier structures behind stretch-ceiling projects — beams for raster and grid ceilings, coving for floating ceilings, and clean height-difference details. Made to measure in aluminium, steel or wood in our Belgian workshop, and shipped worldwide to our dealers.',
  hero: '', // public/images/prefab/prefab-structures-hero.jpg

  makeHeading: 'What we build',
  make: [
    {
      title: 'Beams — raster & grid ceilings',
      body: 'Pre-built beams that frame a stretch membrane into a raster or grid ceiling — repeatable modules, square to the millimetre and ready to mount on site.',
    },
    {
      title: 'Coving — floating ceilings',
      body: 'Perimeter coving that lifts a stretch ceiling off the walls for a floating, shadow-gap effect, with a channel for concealed lighting where needed.',
    },
    {
      title: 'Height-difference finishes',
      body: 'Stepped and multi-level carriers that take a stretch membrane across height changes cleanly — no messy build-up or guesswork on site.',
    },
  ],

  materialsHeading: 'Built in aluminium, steel or wood',
  materials: [
    { title: 'Aluminium', body: 'Lightweight, rigid and corrosion-free — ideal for large spans, humid rooms and integrated lighting profiles.' },
    { title: 'Steel', body: 'Maximum strength for large structures and heavy spans, powder-coated to suit the environment.' },
    { title: 'Wood (MDF / multiplex)', body: 'MDF, multiplex and other boards machined to shape for warm, complex or curved forms.' },
  ],

  caseStudies: [
    {
      title: 'Raster grid ceiling',
      meta: 'Aluminium beams',
      summary: 'A coffered raster ceiling built from a prefab aluminium beam grid, ready for the membrane to be tensioned into each field.',
      render: '', // prefab/case-raster-render.jpg
      cutview: '', // prefab/case-raster-cutview.jpg
      result: '', // prefab/case-raster-result.jpg
    },
    {
      title: 'Floating coving ceiling',
      meta: 'Aluminium coving',
      summary: 'A floating ceiling lifted off the walls with prefab coving and a concealed lighting channel for a soft perimeter glow.',
      render: '', // prefab/case-coving-render.jpg
      cutview: '', // prefab/case-coving-cutview.jpg
      result: '', // prefab/case-coving-result.jpg
    },
    {
      title: 'Multi-level ceiling',
      meta: 'Steel & wood',
      summary: 'A stepped, multi-level ceiling carried across two height changes with a prefab structure, finished seamlessly in stretch membrane.',
      render: '', // prefab/case-multilevel-render.jpg
      cutview: '', // prefab/case-multilevel-cutview.jpg
      result: '', // prefab/case-multilevel-result.jpg
    },
  ],

  worldwide:
    'Every structure is crated and shipped worldwide, so our dealers anywhere can offer the same clean, repeatable result — without a workshop of their own.',
};

// --- Prefab lighting elements ------------------------------------------------
export const prefabLighting: PrefabPageData = {
  slug: 'prefab-lighting-elements',
  name: 'Prefab Lighting Elements',
  eyebrow: 'Prefab lighting elements',
  metaDescription:
    'Prefab lighting elements built from an aluminium structure and finished with a STRETCH membrane — luminous coves, light lines and backlit features, delivered ready to install and shipped worldwide.',
  intro:
    'Pre-assembled lighting elements built from an aluminium structure and finished with our stretch membrane — luminous coves, light lines and backlit features. Delivered ready to install, and shipped worldwide to our dealers.',
  hero: '', // public/images/prefab/prefab-lighting-hero.jpg

  makeHeading: 'What we build',
  make: [
    { title: 'Luminous coves', body: 'Perimeter coves that wash a wall or ceiling with even, hidden light — built as a ready-to-mount aluminium element.' },
    { title: 'Light lines', body: 'Crisp recessed light lines integrated into a stretch surface for clean, architectural lighting.' },
    { title: 'Backlit features', body: 'Backlit panels and shapes finished with a translucent stretch membrane for an even, hotspot-free glow.' },
  ],

  materialsHeading: 'How they are built',
  materials: [
    { title: 'Aluminium structure', body: 'A precise, rigid aluminium frame machined to your dimensions — the backbone of every lighting element.' },
    { title: 'LED & diffusion', body: 'Dimmable LED, sized and placed for even output, with the membrane diffusing the light smoothly.' },
    { title: 'Stretch membrane finish', body: 'A translucent or printed STRETCH membrane tensioned over the frame for a flawless luminous surface.' },
  ],

  caseStudies: [
    {
      title: 'Luminous cove',
      meta: 'Aluminium + translucent membrane',
      summary: 'A perimeter light cove delivered as a single prefab element, washing the ceiling edge with even light.',
      render: '', // prefab/light-cove-render.jpg
      cutview: '', // prefab/light-cove-cutview.jpg
      result: '', // prefab/light-cove-result.jpg
    },
    {
      title: 'Backlit feature panel',
      meta: 'Aluminium + LED + membrane',
      summary: 'A freestanding backlit panel built as a prefab element, glowing evenly with no visible hotspots.',
      render: '', // prefab/light-panel-render.jpg
      cutview: '', // prefab/light-panel-cutview.jpg
      result: '', // prefab/light-panel-result.jpg
    },
  ],

  worldwide:
    'Like all our prefab elements, lighting features are crated and shipped worldwide — assembled and tested here, ready to install there.',
};

export const prefabPages: Record<string, PrefabPageData> = {
  'prefab-ceiling-unit': prefabStructures,
  'prefab-lighting-elements': prefabLighting,
};
