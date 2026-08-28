// =============================================================================
// TECHNICAL HUB — per-membrane documentation pages surfaced in the Technical
// mega-menu. Datasheet / Colours / FAQ reuse existing product data; Fire safety,
// Installation and Specification are NEW drafted content (verify before launch).
// Routes: /technical/{membrane}/{topic}  e.g. /technical/polyester/datasheet
// =============================================================================

export type TechTopicKey =
  | 'datasheet'
  | 'colours'
  | 'fire-safety'
  | 'installation'
  | 'specification'
  | 'faq';

export type TechMembraneKey = 'polyester' | 'pvc';

export const techTopics: { key: TechTopicKey; label: string; sub: string }[] = [
  { key: 'datasheet', label: 'Datasheet', sub: 'Specs & download' },
  { key: 'colours', label: 'Colours & finishes', sub: 'Full range' },
  { key: 'fire-safety', label: 'Fire safety', sub: 'Reaction-to-fire & A2' },
  { key: 'installation', label: 'Installation guide', sub: 'Step by step' },
  { key: 'specification', label: 'Specification text', sub: 'For tenders' },
  { key: 'faq', label: 'FAQ', sub: 'Common questions' },
];

export const techTopicKeys = techTopics.map((t) => t.key);
export const isTechTopic = (s: string): s is TechTopicKey => (techTopicKeys as string[]).includes(s);
export const isTechMembrane = (s: string): s is TechMembraneKey => s === 'polyester' || s === 'pvc';

/** One block of a specification document — rendered in order inside the
 *  copy-ready box on /technical/{membrane}/specification. */
export type SpecBlock =
  | { type: 'heading'; text: string }
  | { type: 'p'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'kv'; rows: { k: string; v: string }[] };

export type TechMembrane = {
  key: TechMembraneKey;
  productSlug: string;
  label: string; // 'Polyester stretch ceiling'
  short: string; // 'Polyester'
  blurb: string; // one-line hub intro
  fireSafety: { intro: string; rows: { k: string; v: string }[]; body: string[] };
  installation: { intro: string; steps: { title: string; body: string }[] };
  specification: { intro: string; blocks: SpecBlock[] };
};

export const techMembranes: Record<TechMembraneKey, TechMembrane> = {
  polyester: {
    key: 'polyester',
    productSlug: 'polyester-stretch-ceiling',
    label: 'Polyester stretch ceiling',
    short: 'Polyester',
    blurb: 'Cold-mounted polyester membrane — a very matte, seamless ceiling tensioned by hand.',
    fireSafety: {
      intro:
        'The polyester membrane is classified B-s1,d0 to EN 13501-1 — flame-retardant, with very limited smoke and no flaming droplets. A non-combustible A2-s1,d0 version is available where the strictest fire requirements apply.',
      rows: [
        { k: 'Standard classification', v: 'B-s1,d0' },
        { k: 'Non-combustible option', v: 'A2-s1,d0' },
        { k: 'Smoke production', v: 's1 — very limited' },
        { k: 'Flaming droplets', v: 'd0 — none' },
        { k: 'Test standard', v: 'EN 13501-1' },
      ],
      body: [
        'The classification B-s1,d0 means the membrane is flame-retardant (B), produces very little smoke (s1) and releases no burning droplets (d0) — the combination most public and commercial interiors require.',
        'For escape routes, high-rise buildings, hospitals and other projects where a non-combustible lining is specified, the A2-s1,d0 version meets that higher requirement while keeping the same seamless, very matte appearance.',
        'Reaction-to-fire certificates and declarations of performance are available on request for inclusion in your fire dossier.',
      ],
    },
    installation: {
      intro:
        'Polyester is tensioned cold — no heat guns, no drying time, no fumes. A two-person team typically completes a room in a single day, even in furnished, occupied spaces.',
      steps: [
        { title: 'Survey & measure', body: 'The room is laser-measured and the membrane is cut and welded to a single seamless panel up to 5.15 m wide, made to the exact shape of the room.' },
        { title: 'Fit the perimeter profile', body: 'A slim clip profile is fixed to the wall or ceiling at the chosen height, following straight runs, curves and corners.' },
        { title: 'Tension cold by hand', body: 'The cold membrane is clipped into the profile and hand-tensioned across the room, pulling drum-tight to a perfectly flat surface — with no heat involved.' },
        { title: 'Finish & detailing', body: 'Edges, corners and any integrated lighting or inspection hatches are detailed. There is no drying time, so the room is clean and back in use immediately.' },
      ],
    },
    specification: {
      intro: 'A copy-ready clause for tender and bestek documents. Adjust the bracketed values to your project.',
      blocks: [
        {
          type: 'p',
          text: 'Supply and install a cold-tensioned polyester stretch ceiling system [STRETCH or approved equivalent]. The membrane shall be a knitted polyester textile, tensioned cold into a perimeter clip profile without the application of heat, forming a seamless, very matte surface up to 5.15 m wide. Reaction to fire shall be class B-s1,d0 to EN 13501-1 (class A2-s1,d0 where indicated). The system shall be washable and humidity-resistant, suitable for installation in occupied spaces, and carry a manufacturer warranty of [10] years. Colour: [RAL ____]. Where an acoustic performance is specified, provide a micro-perforated membrane with high-density absorber backing achieving sound absorption up to class A.',
        },
      ],
    },
  },
  pvc: {
    key: 'pvc',
    productSlug: 'pvc-stretch-ceiling',
    label: 'PVC stretch ceiling',
    short: 'PVC film',
    blurb: 'Heat-mounted PVC film — fully recyclable, removable and seamless to 6.5 m.',
    fireSafety: {
      intro:
        'The PVC film is classified B-s1,d0 to EN 13501-1 — flame-retardant, with very limited smoke development and no flaming droplets.',
      rows: [
        { k: 'Classification', v: 'B-s1,d0' },
        { k: 'Smoke production', v: 's1 — very limited' },
        { k: 'Flaming droplets', v: 'd0 — none' },
        { k: 'Test standard', v: 'EN 13501-1' },
      ],
      body: [
        'The classification B-s1,d0 means the film is flame-retardant (B), produces very little smoke (s1) and releases no burning droplets (d0), making it suitable for the great majority of residential and commercial interiors.',
        'Because the film is removable, it can be unclipped and re-tensioned for access to the services above without affecting its fire performance.',
        'Reaction-to-fire certificates and declarations of performance are available on request for your fire dossier.',
      ],
    },
    installation: {
      intro:
        'PVC film is warmed and tensioned on install — a tired ceiling becomes a flawless new one in a single day, with the old surface left in place underneath.',
      steps: [
        { title: 'Survey & measure', body: 'The room is measured and the film is high-frequency welded to size with a perimeter harpoon edge, made to the shape of the room and seamless up to 6.5 m wide.' },
        { title: 'Fit the perimeter profile', body: 'A harpoon/clip profile is fixed around the room at the chosen height, following the wall line and any features.' },
        { title: 'Heat & tension', body: 'The space is warmed with a heat source to soften the film; the harpoon edge is hooked into the profile and the film tensions taut and flat as it cools.' },
        { title: 'Finish & detailing', body: 'Edges, corners, light fittings and inspection hatches are finished. The film wipes clean and is immediately serviceable.' },
      ],
    },
    // Full lastenboek/tender specification — source: STRETCH lastenboek-
    // beschrijving spanplafond (client document, Aug 2026), SM-series film.
    specification: {
      intro:
        'A copy-ready specification text for tender and bestek documents — the full system description in accordance with EN 14716. Adjust the bracketed values to your project.',
      blocks: [
        { type: 'heading', text: 'STRETCH® stretch ceiling system [or approved equivalent]' },
        {
          type: 'p',
          text: 'Film type: STRETCH® PVC film, SM series [SM reference]. Stretch ceiling in accordance with European standard EN 14716 — CE marked.',
        },
        { type: 'heading', text: 'Description' },
        { type: 'p', text: 'The system consists of three components:' },
        {
          type: 'bullets',
          items: [
            'Flexible membrane: calendered PVC film, cut to size in the fabrication workshop to the dimensions and shapes of the room and, where required, joined by high-frequency welding. Seamless — without dividing profile or weld seam — up to 650 cm wide (matte white); other colours and finishes up to 560 cm.',
            'Semi-flexible harpoon: an extruded harpoon edge welded around the membrane perimeter, in white or black, by which the ceiling is tensioned into the profile. The ceiling can be removed and re-installed an unlimited number of times without deformation, giving full access to the void above.',
            'Profiles: extruded aluminium STRETCH profiles, in visible, invisible or shadow-gap versions. Minimum build-up height: 15 mm.',
          ],
        },
        {
          type: 'p',
          text: 'The stretch ceiling is made to measure in the fabrication workshop according to the dimensions of the room. The membrane is tensioned after heating the room and fixed into the pre-installed STRETCH profiles.',
        },
        { type: 'heading', text: 'System composition' },
        {
          type: 'bullets',
          items: [
            'Flexible polymer film obtained by calendering, in accordance with EN 14716, CE marked.',
            'Semi-flexible harpoon obtained by extrusion.',
            'The film carries an A+ label (indoor-air emissions) in accordance with current indoor air quality legislation.',
            'Film, harpoon and profiles are 100% recyclable.',
            'The films are produced with plasticisers free of heavy metals, in accordance with RoHS.',
          ],
        },
        { type: 'heading', text: 'Film characteristics' },
        {
          type: 'kv',
          rows: [
            { k: 'Max seamless width under tension', v: '650 cm (matte white) · 560 cm (other colours & finishes)' },
            { k: 'Maximum length', v: 'Weight-dependent, typically 20 m' },
            { k: 'Film thickness', v: '170 µm' },
            { k: 'Colour fastness to light', v: '≥ 6' },
            { k: 'Water vapour permeability', v: '27 g/m²/24 h' },
            { k: 'Water resistance', v: 'Washable — suitable for humid rooms' },
            { k: 'Finishes', v: 'Supermirror · Satin · Matte — 24 standard colours; translucent for backlit ceilings' },
            { k: 'Service life', v: '≥ 30 years' },
            { k: 'Reaction to fire', v: 'B-s1,d0 (EN 13501-1)' },
          ],
        },
        { type: 'heading', text: 'Warranty' },
        {
          type: 'p',
          text: 'Manufacturer’s warranty: 10 years on the film, the weld seams and colour preservation. The warranty is valid only with a warranty certificate stating the unique product ID, the dealer and the installation date.',
        },
        { type: 'heading', text: 'Options' },
        {
          type: 'bullets',
          items: [
            'Backlit ceiling: where indicated, a translucent film is installed over an LED field, giving even, hotspot-free light distribution.',
            'Acoustic ceiling: micro-perforated film, perforation Ø 0.30 mm (0.15 or 0.45 mm on request), approx. 250,000 perforations per m², barely visible in tensioned condition; available in all colours and finishes. Combined with absorbent material in the plenum (e.g. polyester wool); total build-up typically 40–50 mm.',
            'Star ceiling: film with integrated fibre-optic or LED star points according to the drawings.',
          ],
        },
        { type: 'heading', text: 'Installation' },
        {
          type: 'p',
          text: 'Installation is carried out by a specialised firm trained and approved by the manufacturer; only then does the manufacturer’s warranty apply and is the warranty certificate (unique product ID, dealer, installation date) issued. The made-to-measure membrane is placed with its perimeter harpoon into the STRETCH aluminium profiles after heating the room, and can be removed and re-installed without limit and without deformation.',
        },
        { type: 'heading', text: 'Additional requirements' },
        {
          type: 'bullets',
          items: [
            'The necessary precautions shall be taken so that the space above the stretch ceiling is sufficiently airtight.',
            'Oversized ceilings shall be subdivided by an invisible separation profile in anodised aluminium, suspended from metal brackets.',
            'Built-in elements (spotlights, grilles, sprinklers, loudspeakers) shall be provided with appropriate backing structures and reinforcement rings.',
            'Samples shall be submitted to the architect for approval.',
          ],
        },
      ],
    },
  },
};
