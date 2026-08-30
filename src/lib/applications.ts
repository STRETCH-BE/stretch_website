// =============================================================================
// APPLICATIONS — room-type landing pages (/applications/<slug>).
// Each pulls together the relevant solutions + portfolio projects for a space.
// `hero` reuses existing photos so pages show real images immediately; swap to
// dedicated shots in public/images/applications/ when you have them.
// =============================================================================

export type Application = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  metaDescription: string;
  intro: string;
  hero: string;
  benefits: { title: string; body: string }[];
  /** Product slugs to feature as recommended solutions. */
  solutionSlugs: string[];
  /** Portfolio project keys (content.ts) to show as selected work. */
  projectKeys: string[];
};

export const applications: Application[] = [
  {
    slug: 'living-cinema',
    name: 'Living rooms & home cinema',
    shortName: 'Living & cinema',
    eyebrow: 'Living & cinema',
    metaDescription:
      'Stretch ceilings for living rooms and home cinemas — seamless finishes, integrated lighting, fibre-optic starry skies and better acoustics, fitted in a day.',
    intro:
      'A flawless ceiling sets the tone of a living space. STRETCH gives you a perfectly smooth, seamless finish — with hidden lighting, a fibre-optic starry sky for the cinema, and acoustic comfort, all fitted cold in a single day.',
    hero: '/images/home/app-living.jpg',
    benefits: [
      { title: 'A seamless, perfect finish', body: 'No cracks, no joins and no repainting — a smooth membrane tensioned wall to wall, in a deep matte or any colour you like.' },
      { title: 'Cinema-ready atmosphere', body: 'Add a fibre-optic starry sky, integrated LED lines and dimmable backlight to set the perfect mood for movie nights.' },
      { title: 'Calmer, quieter rooms', body: 'An acoustic membrane tames echo in open-plan living spaces, so conversation and sound feel warmer and clearer.' },
    ],
    solutionSlugs: ['polyester-stretch-ceiling', 'starry-sky', 'acoustic-stretch-system'],
    projectKeys: ['living', 'cinema', 'light'],
  },
  {
    slug: 'bathroom-kitchen',
    name: 'Bathrooms & kitchens',
    shortName: 'Bathroom & kitchen',
    eyebrow: 'Bathroom & kitchen',
    metaDescription:
      'Humidity-proof stretch ceilings for bathrooms and kitchens — waterproof, mould-resistant and wipe-clean, with integrated lighting, fitted in a single day.',
    intro:
      'Bathrooms and kitchens are tough on ceilings. A STRETCH membrane is waterproof, mould-resistant and wipe-clean — hiding pipework and ducting behind a flawless surface, with downlights and extraction integrated neatly.',
    hero: '/images/home/app-bathroom.jpg',
    benefits: [
      { title: 'Humidity- and water-proof', body: 'The membrane shrugs off steam and splashes and will not flake, stain or grow mould like a painted or plastered ceiling.' },
      { title: 'Wipe-clean surface', body: 'A quick wipe keeps it looking new — ideal above showers, baths and cooking zones.' },
      { title: 'Neat, integrated services', body: 'Downlights, speakers, extraction and inspection hatches all integrate into the surface, hiding the pipework above.' },
    ],
    solutionSlugs: ['pvc-stretch-ceiling', 'prefab-ceiling-unit', 'inspection-hatch'],
    projectKeys: ['bathroom'],
  },
  {
    slug: 'office-retail',
    name: 'Offices & retail',
    shortName: 'Office & retail',
    eyebrow: 'Office & retail',
    metaDescription:
      'Stretch ceilings for offices, retail and hospitality — Class A acoustics, branded printed ceilings and integrated lighting, installed fast with minimal disruption.',
    intro:
      'Commercial spaces need to look sharp and sound right. STRETCH delivers Class A acoustic comfort, branded printed ceilings and integrated lighting — installed cold and fast, with minimal disruption to a working space.',
    hero: '/images/home/app-retail.jpg',
    benefits: [
      { title: 'Class A acoustic comfort', body: 'A micro-perforated acoustic ceiling cuts reverberation in open offices, meeting rooms and restaurants for clearer speech.' },
      { title: 'Branded, printed ceilings', body: 'Print any image, pattern or brand graphic edge-to-edge — a striking feature for retail, showrooms and hospitality.' },
      { title: 'Fast, low-disruption fit', body: 'Cold installation means no dust and no mess, with most rooms finished in a single day — ideal for occupied premises.' },
    ],
    solutionSlugs: ['acoustic-stretch-system', 'custom-print', 'light-print-stretch-ceiling'],
    projectKeys: ['office', 'commercial', 'acoustic'],
  },
  {
    slug: 'pool-wellness',
    name: 'Swimming pools & wellness',
    shortName: 'Pool & wellness',
    eyebrow: 'Pool & wellness',
    metaDescription:
      'Stretch ceilings for swimming pools, spas and wellness spaces — moisture- and chlorine-resistant membranes with No-Stain finish, integrated light and acoustics, installed without downtime.',
    intro:
      'Pool halls and wellness spaces destroy painted ceilings: condensation, chlorine vapour and heat make coatings flake within years. A tensioned membrane is immune to all three — and brings light and acoustics into the wettest rooms of the building.',
    hero: '/images/products/illuminated-printed-stretch-ceiling.jpg',
    benefits: [
      { title: 'Built for moisture and chlorine', body: 'The membrane does not absorb water, cannot peel or flake, and shrugs off condensation and pool chemistry — with No-Stain finishes that wipe clean.' },
      { title: 'Light with nothing to corrode', body: 'Backlit ceilings and sealed LED lines put even, glare-free light over the water without exposed fixtures rusting in the humid air.' },
      { title: 'Acoustics for hard, wet rooms', body: 'Tile and glass make pools loud. An acoustic membrane build-up takes the sting out of the echo without adding a single visible panel.' },
    ],
    solutionSlugs: ['pvc-stretch-ceiling', 'light-print-stretch-ceiling', 'acoustic-stretch-system'],
    projectKeys: ['bathroom', 'light'],
  },
  {
    slug: 'walls',
    name: 'Stretch walls & wall acoustics',
    shortName: 'Walls',
    eyebrow: 'Walls',
    metaDescription:
      'Textile and velvet wall coverings, printed stretch walls and acoustic wall build-ups — seamless tensioned walls with the absorption hidden behind the surface.',
    intro:
      'Everything a stretch ceiling does, a wall can do too. Tensioned textile and velvet walls give a seamless, deep-matte surface; printed membranes turn a wall into artwork; and acoustic build-ups hide serious absorption behind the fabric — no visible panels.',
    hero: '/images/materials/acoustic-wall-panels.jpg',
    benefits: [
      { title: 'Seamless textile surfaces', body: 'Velvet and textile walls tensioned edge to edge — a warm, upholstered look without seams, staples or sagging over time.' },
      { title: 'Acoustics behind the surface', body: 'Absorber material disappears behind a micro-perforated fabric wall, pairing with an acoustic ceiling to bring reverberation down to a comfortable level.' },
      { title: 'Any image, wall-sized', body: 'Printed stretch walls carry photography, artwork or branding edge to edge — backlit if you want the image to glow.' },
    ],
    solutionSlugs: ['acoustic-stretch-system', 'custom-print', 'polyester-stretch-ceiling'],
    projectKeys: ['acoustic', 'commercial'],
  },
];

export function getApplication(slug: string): Application | undefined {
  return applications.find((a) => a.slug === slug);
}

/** Sitemap <lastmod> for /applications/[slug] — bump when application copy changes (F12). */
export const applicationsUpdatedAt = '2026-08-07';
export const applicationSlugs = applications.map((a) => a.slug);
