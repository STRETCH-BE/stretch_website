// ============================================================================
// CONTENT — inspiration projects, blog posts and the global FAQ.
// Inspiration projects mirror the Inspiration mockup. Blog posts and the global
// FAQ are DRAFTED (evergreen, educational) and flagged in CHANGES.md for review;
// none fabricate testimonials, prices or claims beyond the brief.
// ============================================================================

export type Project = {
  key: string;
  /** URL slug for the detail page, e.g. 'van-der-valk-beveren'. */
  slug: string;
  cat: string;
  title: string;
  meta: string;
  featured?: boolean;
  /** Hero/thumbnail photo from /public. Empty = placeholder. */
  image?: string;
  /** One-line summary shown on the project detail hero. */
  summary?: string;
  /** Detail-page body paragraphs (English; drafted from the old site — verify). */
  description?: string[];
  /** Slugs of STRETCH solutions used (link to product pages). */
  solutions?: string[];
  /** Story-opening subtitle shown under the title. */
  hook?: string;
  /** Short feature/achievement callouts, e.g. 'αw 0.95 acoustic absorption'. */
  highlights?: string[];
  /** Detailed products & materials used on the project. */
  materials?: string[];
  /** Fact-sheet rows (region, year, area, architect, dealer…). */
  facts?: { label: string; value: string; href?: string }[];
  /** Project-specific Q&A (rendered + FAQPage schema). */
  faqs?: { q: string; a: string }[];
  /** Gallery image paths from /public ('' = placeholder). */
  gallery?: string[];
};

export const projectFilters: { key: string; label: string }[] = [
  { key: 'all', label: 'All work' },
  { key: 'acoustic', label: 'Acoustic' },
  { key: 'living', label: 'Living' },
  { key: 'bathroom', label: 'Bathroom' },
  { key: 'office', label: 'Office' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'cinema', label: 'Home cinema' },
  { key: 'light', label: 'Light & Print' },
];

export const browseSolutions: { key: string; label: string; desc: string }[] = [
  { key: 'acoustic', label: 'Acoustic', desc: 'Studios, offices & quiet rooms' },
  { key: 'light', label: 'Light & Print', desc: 'Backlit & printed ceilings' },
  { key: 'living', label: 'Living', desc: 'Homes & private interiors' },
  { key: 'bathroom', label: 'Bathroom', desc: 'Humidity-proof & prefab' },
  { key: 'office', label: 'Office', desc: 'Acoustic comfort at work' },
  { key: 'commercial', label: 'Commercial', desc: 'Retail, hotels & venues' },
];

export const projects: Project[] = [
  {
    key: 'acoustic', slug: 'da-tweekaz-studio', cat: 'Acoustic', title: 'Da Tweekaz Studio',
    meta: 'Belgium · Recording studio', featured: true,
    summary: 'Acoustic stretch ceiling for a hardstyle production studio.',
    description: [
      'The studio needed a ceiling that looked clean and controlled the room acoustically. A micro-perforated acoustic STRETCH membrane with high-density absorber backing tames reflections across the production space, so the room stays accurate to monitor in — with no visible panels overhead, just one seamless surface.',
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['', '', ''],
  },
  {
    key: 'acoustic', slug: 'mark-with-a-k', cat: 'Acoustic', title: 'Mark With a K',
    meta: 'Belgium · Sound studio',
    summary: 'Acoustic treatment for a DJ and producer’s sound room.',
    description: [
      'A seamless acoustic STRETCH ceiling absorbs reverberation in the production room while keeping a flawless, modern finish. The result is a calm, controlled space to work in, with the acoustic performance hidden inside the membrane.',
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['', '', ''],
  },
  {
    key: 'office', slug: 'notary-ampe-anthony', cat: 'Office', title: 'Notary Ampe Anthony',
    meta: 'Kruibeke · Acoustic office',
    summary: '350 m² of acoustic stretch ceilings across a high-end notary office.',
    hook: 'A complete high-end office fit-out where hard, reflective materials needed taming — without losing the sharp, minimal look.',
    description: [
      'In 2019 the Ampe Anthony notary office in Kruibeke was rebuilt from the ground up as a high-end interior with a deliberately sharp, minimal look — polished concrete floors, steel window frames and plenty of hard surfaces. No expense was spared to finish it perfectly.',
      'Those hard materials made the office acoustically live. To bring it back to a comfortable level, the entire interior received an acoustic STRETCH ceiling backed by a dedicated polyester-wool absorber mounted against the existing concrete slab, pushing the acoustic performance to a high level.',
      'The ceiling dropped 10 cm to conceal all the technical services above it, leaving a height of 260 cm. To make the space feel taller and larger, we built large elliptical recesses into the ceiling — an optical trick that visibly lifts the room.',
    ],
    highlights: ['Reverberation time measured at 0.6 s', 'Large elliptical ceiling recesses for a taller feel', 'Dedicated polyester-wool absorber behind the membrane'],
    materials: [
      'Acoustic STRETCH ceiling',
      'Curved bespoke aluminium frames',
      'Polyester-wool absorber D40/50 (40 kg/m³, 50 mm)',
      'STRETCH Design ceiling in the elliptical form',
      'White PVC tension profiles around the perimeter',
      'Lighting: Wever & Ducré, Delta Light',
    ],
    facts: [
      { label: 'Region', value: 'Waasland (Kruibeke)' },
      { label: 'Year', value: '2018' },
      { label: 'Area', value: '350 m²' },
      { label: 'Architect', value: 'Ante Architecten', href: 'https://www.ante.be/' },
      { label: 'STRETCH dealer', value: 'Corpus Interieur', href: 'https://corpusspanplafond.be/' },
    ],
    faqs: [
      { q: 'How long did the installation take?', a: 'Installing the acoustic ceilings, all the lighting and the special finishes took 7 working days.' },
      { q: 'What reverberation time was achieved?', a: 'Measured after installation, the office reached a reverberation time of 0.6 s — the interior is, and feels, very quiet.' },
      { q: 'How many installers worked on the project?', a: 'A team of 2 STRETCH fitters completed the whole ceiling package: the membrane, the lighting, the acoustic panels, the ceiling joinery and the elliptical structures.' },
      { q: 'How long will the ceiling last?', a: 'Like any stretch ceiling, lifespan depends on cleaning, but it will comfortably last around 25 years. After that only the membrane might need replacing — the existing frame stays in place.' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['', '', ''],
  },
  {
    key: 'commercial', slug: 'bnp-paribas-fortis', cat: 'Commercial', title: 'BNP Paribas Fortis',
    meta: 'Brussels · Bank HQ',
    summary: 'Acoustic ceilings for a corporate banking headquarters.',
    description: [
      'In the open-plan floors of the bank’s headquarters, acoustic STRETCH ceilings keep speech intelligible and the workspace comfortable. The system integrates lighting and building services cleanly while delivering measurable sound absorption overhead.',
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['', '', ''],
  },
  {
    key: 'commercial', slug: 'van-der-valk-beveren', cat: 'Commercial', title: 'Van der Valk',
    meta: 'Beveren · Hotel event hall', featured: true,
    summary: 'Maximum acoustic absorption for a hotel event hall — with almost no height to give.',
    hook: 'An acoustic problem that had dogged the hotel’s event hall for years, solved through the ceiling.',
    description: [
      'Tim van der Valk approached STRETCH about an acoustic problem that had affected their event space for several years. After talking it through with Michael Nicasens of STRETCH, we concluded the fix had to come from the ceiling — but the existing ceiling was only 255 cm high, leaving very little room for a system.',
      'So we proposed a 50 mm system height that still reaches αw 0.95: maximum acoustic absorption with only a minimal drop in ceiling height. The large event rooms are spanned seamlessly, with the acoustic performance built into the membrane and the detailing — hatches, lighting, sensors and a starry-sky feature — integrated cleanly overhead.',
    ],
    highlights: ['αw 0.95 acoustic absorption', 'Only 50 mm system height', 'Integrated technical access hatches', 'Lighting & presence sensors', 'Starry-sky feature', 'Seamless finish around columns'],
    materials: [
      'Acoustic STRETCH ceiling (50 mm system)',
      'Integrated technical hatches',
      'Integrated lighting',
      'Presence sensors',
      'Starry-sky installation',
      'Perimeter tension profiles',
    ],
    facts: [
      { label: 'Venue', value: 'Van der Valk Hotel Beveren', href: 'https://www.hotelbeveren.be/' },
      { label: 'Region', value: 'Beveren-Waas' },
      { label: 'Existing height', value: '255 cm' },
      { label: 'System height', value: '50 mm' },
      { label: 'Acoustic rating', value: 'αw 0.95' },
    ],
    solutions: ['acoustic-stretch-system', 'starry-sky'],
    gallery: ['', '', ''],
  },
  {
    key: 'office', slug: 'johnson-and-johnson', cat: 'Office', title: 'Johnson & Johnson',
    meta: 'Limerick, IE · Pharma office',
    summary: 'Seamless acoustic ceilings for a pharmaceutical office.',
    description: [
      'In the offices of the pharmaceutical campus, STRETCH ceilings deliver a clean, hygienic, seamless finish with acoustic absorption built in. The space stays comfortable for focused work and is easy to maintain.',
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['', '', ''],
  },
  {
    key: 'commercial', slug: 'polette-eyewear', cat: 'Retail', title: 'Polette Eyewear',
    meta: 'Antwerp · Retail store',
    summary: 'A never-before-seen retail concept by architect Javier Zubiria.',
    description: [
      'For Polette’s store, architect Javier Zubiria designed a striking, unconventional retail concept. STRETCH ceilings carry the bold geometry of the space with a flawless finish that frames both the product and the architecture.',
    ],
    solutions: ['pvc-stretch-ceiling', 'light-print-stretch-ceiling'],
    gallery: ['', '', ''],
  },
  {
    key: 'bathroom', slug: 'citizenm-hotel', cat: 'Bathroom', title: 'CitizenM Hotel',
    meta: 'Prefab bathroom units',
    summary: 'Prefab bathroom ceilings for a modular hotel build.',
    description: [
      'Built off-site as repeatable modules, the hotel’s bathroom pods use prefab STRETCH ceilings for a perfect, water-resistant finish in every room — installed fast and identical at scale.',
    ],
    solutions: ['prefab-ceiling-unit', 'pvc-stretch-ceiling'],
    gallery: ['', '', ''],
  },
  {
    key: 'light', slug: 'london-chapel', cat: 'Light & Print', title: 'London Chapel',
    meta: 'London, UK · Backlit ceiling',
    summary: 'A backlit stretch ceiling over a restored chapel space.',
    description: [
      'A translucent STRETCH ceiling turns the whole soffit into a soft, even light source, washing the restored interior in glare-free illumination while concealing the LED field completely.',
    ],
    solutions: ['light-print-stretch-ceiling'],
    gallery: ['', '', ''],
  },
  {
    key: 'living', slug: 'private-villa-knokke', cat: 'Living room', title: 'Private Villa',
    meta: 'Knokke · Open living',
    summary: 'A seamless matte ceiling for an open-plan coastal villa.',
    description: [
      'In the villa’s open living space, a very matte polyester STRETCH ceiling reads like flawless plaster from wall to wall — crisp and modern, free of the cracks and shadow lines of a conventional ceiling.',
    ],
    solutions: ['polyester-stretch-ceiling'],
    gallery: ['', '', ''],
  },
  {
    key: 'cinema', slug: 'home-cinema-ghent', cat: 'Home cinema', title: 'Home Cinema',
    meta: 'Ghent · Starry sky + acoustic',
    summary: 'A starry-sky ceiling with acoustic backing for a home cinema.',
    description: [
      'Hundreds of fibre-optic points create a twinkling night sky above the seating, while an acoustic backing keeps the room controlled for film sound — atmosphere and performance combined in a single ceiling.',
    ],
    solutions: ['starry-sky', 'acoustic-stretch-system'],
    gallery: ['', '', ''],
  },
  {
    key: 'living', slug: 'city-penthouse-antwerp', cat: 'Living room', title: 'City Penthouse',
    meta: 'Antwerp · Living room',
    summary: 'A flawless feature ceiling for a city penthouse.',
    description: [
      'The penthouse living space uses a seamless STRETCH ceiling with integrated lighting to keep the look minimal and the surface perfect across the open plan.',
    ],
    solutions: ['polyester-stretch-ceiling', 'light-print-stretch-ceiling'],
    gallery: ['', '', ''],
  },
  {
    key: 'bathroom', slug: 'wellness-spa-bruges', cat: 'Bathroom', title: 'Wellness Spa',
    meta: 'Bruges · Spa bathroom',
    summary: 'A humidity-proof, backlit ceiling for a spa.',
    description: [
      'The spa needed a ceiling that handles humidity and sets a calm mood. A translucent, backlit STRETCH ceiling glows softly over the wellness area and wipes clean, unaffected by steam and moisture.',
    ],
    solutions: ['pvc-stretch-ceiling', 'light-print-stretch-ceiling'],
    gallery: ['', '', ''],
  },
  {
    key: 'light', slug: 'rue-perree-paris', cat: 'Light & Print', title: 'Rue Perrée',
    meta: 'Paris · Backlit gallery ceiling',
    summary: 'An illuminated ceiling for a multi-brand gallery space in Paris.',
    hook: 'Gallery-grade, even light across a multi-brand showroom — fixtures out of sight.',
    description: [
      'At ART RECHERCHE INDUSTRIE on Rue Perrée in Paris — a gallery showcasing several brands — a luminous STRETCH ceiling provides an even, hotspot-free wash of light across the space. With the LED field hidden behind a translucent membrane, the work on display stays the focus, not the fixtures.',
    ],
    highlights: ['Even, hotspot-free illumination', 'LED field fully concealed', 'Gallery-grade colour rendering'],
    facts: [
      { label: 'Location', value: 'Rue Perrée, Paris (FR)' },
      { label: 'Space', value: 'Multi-brand gallery' },
    ],
    solutions: ['light-print-stretch-ceiling'],
    gallery: ['', '', ''],
  },
];

/** All project slugs, for static params + sitemap. */
export const projectSlugs = projects.map((p) => p.slug);
/** Look up a project by its slug. */
export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

// ---------------------------------------------------------------------------
// Blog — drafted evergreen / educational articles (flagged for review).
// ---------------------------------------------------------------------------

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  datePublished: string; // ISO
  dateModified: string; // ISO
  author: string;
  readMinutes: number;
  /** Optional hero photo path from /public. Empty = branded placeholder. */
  image?: string;
  /** Body as an ordered list of {heading, paragraphs}. */
  body: { heading: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'what-is-a-stretch-ceiling',
    title: 'What is a stretch ceiling? A plain-English guide',
    excerpt:
      'A stretch ceiling is a thin membrane tensioned across a room and clipped into a slim perimeter profile — installed cold or with heat, in a single day. Here is how it works and where it makes sense.',
    datePublished: '2026-01-15',
    dateModified: '2026-01-15',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        heading: 'The short version',
        paragraphs: [
          'A stretch ceiling is a thin, seamless membrane — either knitted polyester or a calendered PVC film — that is tensioned across a room and clipped into a slim profile fixed around the perimeter walls. The result looks like a perfectly flat, freshly painted ceiling, but there is no plaster, no sanding and no painting involved.',
          'Because the membrane is fitted to a frame rather than fixed directly to the structure above, it hides pipework, wiring, uneven concrete and old ceilings completely — and it can be installed in a single day, in a room that stays furnished and in use.',
        ],
      },
      {
        heading: 'Cold mount vs. heat mount',
        paragraphs: [
          'Polyester membranes are tensioned cold: no heat, no fumes and no drying time. They give a deep, very matte finish and can span up to 5.15 m without a seam.',
          'PVC films are warmed during installation so they relax, then tighten as they cool to a flawless surface. PVC is fully recyclable, removable for access to the services above, and spans up to 5.7 m seamless — the widest option.',
        ],
      },
      {
        heading: 'What you can build into it',
        paragraphs: [
          'A stretch ceiling is more than a finish. A micro-perforated version backed with a high-density absorber reaches up to Class A sound absorption, turning echoey rooms calm. Translucent films become an even, dimmable light source with no hotspots, and any image — including a fibre-optic starry sky — can be printed edge-to-edge.',
          'Speakers can even be hidden completely behind the membrane for clean, sourceless audio. All of it lives inside one seamless surface.',
        ],
      },
      {
        heading: 'Where it makes sense',
        paragraphs: [
          'Homeowners use stretch ceilings in living rooms, bathrooms and home cinemas; businesses use them in offices, restaurants, studios, retail and hospitality. They suit both new build and renovation, and the PVC system shrugs off humidity, which makes it a strong fit for wet areas.',
          'Want to know whether it suits your project? Request a free, no-obligation quote and a specialist will get back to you within two working days.',
        ],
      },
    ],
  },
  {
    slug: 'stretch-ceiling-acoustics-explained',
    title: 'Stretch ceiling acoustics, explained',
    excerpt:
      'A micro-perforated stretch membrane backed with a high-density absorber can reach up to Class A sound absorption — without any visible acoustic panels. Here is how it works and what αw and NRC mean.',
    datePublished: '2026-01-22',
    dateModified: '2026-01-22',
    author: 'STRETCH',
    readMinutes: 6,
    // Reuses the acoustic product photo. Point this at a dedicated image
    // (e.g. '/images/blog/acoustics-explained.jpg') whenever you have one.
    image: '/images/blog/acoustic-stretch-ceiling-hero.jpg',
    body: [
      {
        heading: 'Why rooms sound harsh',
        paragraphs: [
          'Hard, flat surfaces — glass, concrete, plasterboard — reflect sound back into the room. Those reflections pile up as reverberation, which makes speech harder to follow and music or background noise more tiring. The fix is to absorb some of that energy before it bounces.',
          'Traditionally that means visible acoustic panels or baffles. A stretch ceiling lets you do it invisibly.',
        ],
      },
      {
        heading: 'How an acoustic stretch ceiling works',
        paragraphs: [
          'The visible face is a micro-perforated membrane: thousands of tiny perforations let sound pass through into a high-density polyester-wool absorber mounted behind it. The room still reads as one flawless, seamless ceiling, but the sound energy is captured rather than reflected.',
          'Done well, this reaches up to Class A absorption — the highest classification — across the treated area.',
        ],
      },
      {
        heading: 'Reading the numbers: αw and NRC',
        paragraphs: [
          'Sound absorption is measured on a scale from 0 (fully reflective) to 1 (fully absorptive). In Europe the headline figure is the weighted absorption coefficient αw, and the matching class runs from Class A (αw ≥ 0.90) down to Class E. NRC (Noise Reduction Coefficient) is the equivalent single-number rating used more often in North America.',
          'When you compare acoustic products, those are the figures to look for — αw, the absorption class, and NRC — rather than vague claims about "soundproofing".',
        ],
      },
      {
        heading: 'Where it earns its keep',
        paragraphs: [
          'Recording studios, home cinemas, open-plan offices, restaurants, classrooms and healthcare spaces all benefit. The same system extends to free-hanging ceiling islands and decorative wall panels where a full ceiling is not possible.',
          'If you are fighting reverberation in a specific room, request a quote and tell us the dimensions and use — we will advise on the right absorber and finish.',
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const blogSlugs = blogPosts.map((p) => p.slug);

// ---------------------------------------------------------------------------
// Global FAQ (for /faq). Drafted from standard B2B/B2C questions in the
// stretch-ceiling category — flagged for client review.
// ---------------------------------------------------------------------------

export type Faq = { q: string; a: string };

export const globalFaqs: Faq[] = [
  {
    q: 'What is a stretch ceiling?',
    a: 'A stretch ceiling is a thin, seamless membrane — polyester or PVC film — tensioned across a room and clipped into a slim perimeter profile. It looks like a perfectly flat painted ceiling but installs with no plaster, no sanding and no painting, and hides everything above it.',
  },
  {
    q: 'How long does installation take?',
    a: 'Most rooms are finished in a single day. A two-person team fits up to roughly 50 m² per day. Cold-mounted polyester needs no drying time, so the room is usable immediately.',
  },
  {
    q: 'Is it messy? Do I need to move out?',
    a: 'No. There is no demolition, dust, sanding or painting, so installation can take place in a furnished, occupied room. The existing ceiling can usually stay in place underneath.',
  },
  {
    q: 'How long does a stretch ceiling last?',
    a: 'Our systems carry a 25-year warranty. The surface is washable and humidity-proof, and will not crack, flake, yellow or need repainting.',
  },
  {
    q: 'Can it improve acoustics?',
    a: 'Yes. A micro-perforated, absorber-backed version reaches up to Class A sound absorption while looking identical to the standard finish — measurably reducing reverberation and noise.',
  },
  {
    q: 'What is the widest ceiling you can install without a seam?',
    a: 'Up to 5.7 m seamless with PVC film, and up to 5.15 m with polyester. Larger spans are covered with a near-invisible welded joint or a deliberate profile line.',
  },
  {
    q: 'Can I have lighting, backlighting or a printed design?',
    a: 'Yes. Translucent films give an even, dimmable backlight with no hotspots, LED line lighting integrates into the surface, and any image — including a starry sky — can be printed edge-to-edge.',
  },
  {
    q: 'How much does a stretch ceiling cost?',
    a: 'Pricing is project-based — it depends on the surface area, the system, finish and any lighting or acoustic options. Request a free, no-obligation quote and a specialist will reply within two working days.',
  },
  {
    q: 'Do you work with contractors and resellers?',
    a: 'Yes. STRETCH is B2B-led: we train installers at our Belgian HQ, supply made-to-measure membranes through a B2B portal, and refer local customers to certified partners. See the Partners and Installer training pages.',
  },
];

// ---------------------------------------------------------------------------
// Reviews — PLACEHOLDER testimonials, DRAFTED for layout only and flagged in
// CHANGES.md. These are NOT real customer quotes: replace every entry with
// genuine, permission-cleared reviews (e.g. imported from the Google Business
// Profile) before launch. The 5.0 / Google rating reflects the live site's
// public rating; do not emit an aggregateRating in schema until real review
// data backs it.
// ---------------------------------------------------------------------------

export type Review = { name: string; role: string; quote: string };

export const reviews: Review[] = [
  {
    name: 'Paul A.',
    role: 'Homeowner · Antwerp',
    quote:
      'They fitted our living-room ceiling in a single day with no mess at all. The matte finish looks exactly like fresh plaster — we are genuinely delighted.',
  },
  {
    name: 'Hanne D.',
    role: 'Architect · Ghent',
    quote:
      'I specify STRETCH for the acoustic ceilings now. The room reads as one clean surface and the reverberation is gone — clients always notice the difference.',
  },
  {
    name: 'Matthias V.',
    role: 'Contractor · Sint-Niklaas',
    quote:
      'The training got my team installing fast, and the made-to-measure supply is reliable. Becoming a partner added a whole new service to our business.',
  },
];

export const ratingDisplay = { score: '5.0', source: 'Google' } as const;
