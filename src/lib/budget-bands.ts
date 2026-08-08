// =============================================================================
// BUDGET BANDS — indicative €/m² ranges for the architect budget guide.
//
// This file is the ONLY pricing-shaped content architect accounts may ever
// see. Never import pricebook / portal pricing data here, and never render
// pricebook data on any architect-visible surface. These bands are deliberate
// hand-set, coarse, installed-price indications for early-stage budgeting —
// they have NO connection to the trade pricelist.
//
// PLACEHOLDER — Michael sets the real bands. The ranges below are stand-ins
// so the page renders; replace before telling architects about the guide.
// =============================================================================

export type BudgetBand = {
  slug: string;
  system: string;
  description: string;
  lowEur: number;
  highEur: number;
  unit: 'm²' | 'unit';
  /** What the band includes (installed price scope). */
  includes: string[];
  note?: string;
};

export const budgetBands: BudgetBand[] = [
  {
    slug: 'polyester',
    system: 'Polyester stretch ceiling',
    description: 'Cold-mounted PU-coated polyester membrane — the workhorse for offices, care and retail.',
    lowEur: 45, highEur: 85, unit: 'm²',
    includes: ['Membrane + perimeter profiles', 'Installation by a certified team', 'Standard cut-outs for lighting'],
  },
  {
    slug: 'pvc',
    system: 'PVC film stretch ceiling',
    description: 'Seamless PVC film up to 500 cm width — gloss, satin and matt finishes.',
    lowEur: 40, highEur: 80, unit: 'm²',
    includes: ['Membrane + perimeter profiles', 'Heat installation by a certified team', 'Standard cut-outs for lighting'],
  },
  {
    slug: 'acoustic',
    system: 'Acoustic stretch ceiling',
    description: 'Micro-perforated membrane with mineral-wool backing — absorption up to Class A.',
    lowEur: 65, highEur: 120, unit: 'm²',
    includes: ['Acoustic membrane + absorber package', 'Installation', 'Measured-performance documentation on request'],
  },
  {
    slug: 'light-print',
    system: 'Backlit & printed ceilings',
    description: 'Translucent membranes with LED backlight, or hi-res printed designs.',
    lowEur: 120, highEur: 260, unit: 'm²',
    includes: ['Membrane + LED plenum or print', 'Drivers and dimming', 'Installation'],
    note: 'Printed designs depend heavily on artwork and size — register the project for a real number.',
  },
  {
    slug: 'prefab',
    system: 'Prefab light coves & elements',
    description: 'Factory-made cove and floating elements, delivered ready to mount.',
    lowEur: 90, highEur: 220, unit: 'unit',
    includes: ['Prefab element per running metre', 'Mounting hardware', 'Delivery within Benelux'],
  },
];

/** File-level disclaimer rendered prominently on the budget-guide page. */
export const budgetDisclaimer =
  'Indicative installed price bands, excl. VAT, for early-stage budgeting only. Every project is priced individually — register your project for a real number.';
