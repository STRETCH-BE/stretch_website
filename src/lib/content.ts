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
    key: 'commercial', slug: 'van-der-valk-boost-wellness', cat: 'Commercial', title: 'Boost Wellness',
    meta: 'Beveren · Van der Valk hotel wellness & spa', featured: true,
    image: '/images/projects/van-der-valk-boost-wellness-hero.jpg',
    summary: 'The complete renovation of the Van der Valk Beveren wellness — 700 m² of acoustic, printed and illuminated stretch ceilings in a design by Maison Max.',
    hook: 'Twenty years after the first membrane went up, Van der Valk Beveren asked us back — this time to crown an entirely new wellness.',
    description: [
      'When Van der Valk Hotel Beveren decided to renovate its entire wellness and pool area — reopened as Boost Wellness — the choice of ceiling partner was quickly made. STRETCH ceilings already hang in other parts of the hotel, and the collaboration goes back years. The project even closed a family circle: the first job was dismantling the stretch ceiling that Benjamin Nicasens of Plafondlux BV — father of STRETCH’s Michael Nicasens — had installed there twenty years earlier.',
      'Once the client had stripped the wellness and pool area back to the shell, we worked hand in hand with interior studio Maison Max from Temse, who shaped the full design and look & feel. Hotel owner Tim and his wife Paulina were involved from start to finish — Paulina brought strong design ideas of her own, which Maison Max folded into the plans, and together they chose the materials for every single part of the project. For the ceilings, that translated into a warm, smooth, acoustic design with multiple levels overhead, so no room ever reads as flat or boring.',
      'Every zone received the membrane that suits it. In the fully wet areas — pool, showers and spa — we tensioned PVC stretch ceilings, the strongest choice where humidity is constant. The changing rooms, massage rooms and nail studio received polyester (fabric) stretch ceilings, whose warm textile structure creates an ultra-matte finish.',
      'The spa is the showpiece. Paulina wanted a natural, organically curved wall — and the ceiling had to follow that complex, flowing shape. Into the printed, brown-toned ceiling she also asked for a circular skylight, not with a straight edge but with a soft curved one. Prefabricated aluminium structural elements form the lightbox and the height differences, and the result is one of the most complex — and most beautiful — installations we have delivered.',
      'Across 700 m², the focus was durability, acoustics and complex design: acoustic membranes backed with PET absorbers, integrated LED spots, inspection hatches, speakers and aluminium coving — every technical detail dissolved into one warm, seamless surface. The full renovation ran six months from strip-out to reopening.',
    ],
    highlights: [
      '700 m² of stretch ceilings throughout the wellness',
      'Printed ceiling following an organically curved wall',
      'Circular skylight with a flowing curved edge',
      'Multi-level, warm acoustic ceiling design',
      'PVC in the wet zones, ultra-matte polyester in the dry',
      'Second-generation project — the previous ceiling went up 20 years ago',
    ],
    materials: [
      'Acoustic STRETCH ceiling with PET absorber backing',
      'Printed STRETCH ceiling (spa, custom brown print)',
      'Illuminated STRETCH ceiling (skylight lightbox)',
      'PVC membranes in all wet areas',
      'Ultra-matte polyester membranes (changing, massage & nail rooms)',
      'Prefabricated aluminium structural elements — lightbox & level changes',
      'Integrated LED lighting spots',
      'Inspection hatches',
      'Integrated speakers',
      'Aluminium coving',
    ],
    facts: [
      { label: 'Venue', value: 'Van der Valk Hotel Beveren', href: 'https://www.hotelbeveren.be/' },
      { label: 'Wellness', value: 'Boost Wellness', href: 'https://www.boostwellness.be/' },
      { label: 'Interior design', value: 'Maison Max (Temse)', href: 'https://www.maisonmax.be/' },
      { label: 'Area', value: '700 m²' },
      { label: 'Year', value: '2026' },
      { label: 'Full renovation', value: '6 months' },
    ],
    faqs: [
      {
        q: 'Why PVC in some rooms and polyester in others?',
        a: 'The membrane follows the conditions of the room. In the permanently wet zones — pool, showers and spa — PVC is the strongest choice: it is completely unaffected by humidity and wipes clean. In the changing rooms, massage rooms and nail studio we tensioned polyester instead: a fabric membrane whose woven structure gives a warmer, ultra-matte finish.',
      },
      {
        q: 'How does a stretch ceiling follow a curved, organic wall?',
        a: 'The curved wall was translated into prefabricated aluminium structural elements that carry the profiles, the lightbox and the height differences. The membrane is then tensioned into that frame, so it follows the organic shape precisely — including the circular skylight with its soft curved edge.',
      },
      {
        q: 'How do the ceilings help the acoustics?',
        a: 'The wellness combines acoustic stretch membranes with PET absorber panels behind them: sound passes through the surface and is captured instead of reflected. Together with the multi-level ceiling design, this keeps large, hard-surfaced rooms calm and hushed — exactly what a spa needs.',
      },
      {
        q: 'How long does a stretch ceiling last?',
        a: 'This project is its own answer: the previous stretch ceiling here went up twenty years ago and only made way because the hotel wanted an entirely new wellness. Count on decades of service — and when the design changes, only the membrane is replaced, not the structure.',
      },
    ],
    solutions: ['acoustic-stretch-system', 'pvc-stretch-ceiling', 'polyester-stretch-ceiling', 'light-print-stretch-ceiling', 'custom-print', 'prefab-ceiling-unit', 'inspection-hatch'],
    gallery: [
      '/images/projects/van-der-valk-boost-wellness-pool.jpg',
      '/images/projects/van-der-valk-boost-wellness-pool-panorama.jpg',
      '/images/projects/van-der-valk-boost-wellness-pool-steps.jpg',
      '/images/projects/van-der-valk-boost-wellness-pool-loungers.jpg',
      '/images/projects/van-der-valk-boost-wellness-poolside-lounge.jpg',
      '/images/projects/van-der-valk-boost-wellness-spa-showers.jpg',
      '/images/projects/van-der-valk-boost-wellness-salt-sauna.jpg',
      '/images/projects/van-der-valk-boost-wellness-relaxation-room.jpg',
      '/images/projects/van-der-valk-boost-wellness-relaxation-lounge.jpg',
      '/images/projects/van-der-valk-boost-wellness-changing-room.jpg',
      '/images/projects/van-der-valk-boost-wellness-nail-studio.jpg',
    ],
  },
  {
    key: 'acoustic', slug: 'da-tweekaz-studio', cat: 'Acoustic', title: 'Da Tweekaz Studio',
    meta: 'Netherlands · Recording studio', featured: true,
    image: '/images/projects/da-tweekaz-hero.jpg',
    summary: 'Acoustic stretch ceiling and walls for a music production studio.',
    hook: 'A clean, acoustically controlled room for one of hardstyle’s best-known acts.',
    description: [
      'For Da Tweekaz’s recording studio in the Netherlands, an acoustic STRETCH system treats both the ceiling and the walls, controlling reflections so the room stays accurate to work in — with a seamless, modern finish and no visible panels overhead.',
    ],
    highlights: ['Acoustic ceiling and wall treatment', 'Seamless, panel-free finish'],
    materials: ['Acoustic STRETCH ceiling', 'STRETCH Acoustic textile (walls)'],
    facts: [
      { label: 'Country', value: 'Netherlands' },
      { label: 'STRETCH dealer', value: 'Q82 Acoustics', href: 'https://q82acoustics.com/' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['/images/projects/da-tweekaz-control-room.jpg'],
  },
  {
    key: 'acoustic', slug: 'mark-with-a-k', cat: 'Acoustic', title: 'Mark With a K',
    meta: 'Belgium · Sound studio',
    image: '/images/projects/mark-with-a-k-hero.jpg',
    summary: 'Acoustic treatment for a DJ and producer’s sound room.',
    hook: 'A flawless, acoustically controlled room for a Belgian DJ and producer.',
    description: [
      'A seamless acoustic STRETCH ceiling absorbs reverberation in the production room while keeping a flawless, modern finish. The result is a calm, controlled space to work in, with the acoustic performance hidden inside the membrane.',
    ],
    highlights: ['Seamless acoustic ceiling', 'Hidden absorber backing', 'Panel-free, modern finish'],
    materials: ['Acoustic STRETCH ceiling', 'High-density absorber backing'],
    facts: [
      { label: 'Country', value: 'Belgium' },
      { label: 'Space', value: 'Music production studio' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['/images/projects/mark-with-a-k-ceiling.jpg'],
  },
  {
    key: 'office', slug: 'notary-ampe-anthony', cat: 'Office', title: 'Notary Ampe Anthony',
    meta: 'Kruibeke · Acoustic office',
    image: '/images/projects/notary-ampe-anthony-hero.jpg',
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
    gallery: [
      '/images/projects/notary-ampe-anthony-reception.jpg',
      '/images/projects/notary-ampe-anthony-circle.jpg',
      '/images/projects/notary-ampe-anthony-lounge.jpg',
    ],
  },
  {
    key: 'commercial', slug: 'bnp-paribas-fortis', cat: 'Commercial', title: 'BNP Paribas Fortis',
    meta: 'Brussels · Bank HQ',
    image: '/images/projects/bnp-paribas-fortis-luminous-ceiling.jpg',
    summary: '2,000 m² of illuminated and acoustic ceilings at the bank’s Brussels headquarters.',
    hook: 'Illuminated and acoustic STRETCH ceilings across the bank’s new Montagne du Parc headquarters — including a multi-floor food court.',
    description: [
      'At BNP Paribas Fortis’ headquarters in central Brussels, STRETCH delivered around 2,000 m² of illuminated (STRETCH Light) and acoustic (STRETCH Acoustic) ceilings, working with Jaspers-Eyers Architects and NCBHAM together with partner Conceptexpo.',
      'A highlight is the Barista Bar food court, which welcomes staff and visitors across several floors. The Hot Corner serves warm dishes beneath a brass-blade ceiling that echoes flames; the Fresh Corner offers salads a floor up; and the Sweet Corner rounds things off with desserts — each counter mirrored so a full meal can be assembled anywhere.',
    ],
    highlights: ['≈2,000 m² of stretch ceilings', 'STRETCH Light + Acoustic combined', 'Multi-floor Barista Bar food court', 'Brass-blade “flame” feature ceiling'],
    materials: ['STRETCH Light (illuminated) ceiling', 'STRETCH Acoustic ceiling', 'Curved ceiling sections', 'Integrated lighting'],
    facts: [
      { label: 'Location', value: 'Brussels (Montagne du Parc)' },
      { label: 'Area', value: '2,000 m²' },
      { label: 'Architect', value: 'Jaspers-Eyers & NCBHAM', href: 'https://www.jaspers-eyers.be/p/montagne-du-parc.html' },
      { label: 'Partner', value: 'Conceptexpo' },
    ],
    solutions: ['light-print-stretch-ceiling', 'acoustic-stretch-system'],
    gallery: [
      '/images/projects/bnp-paribas-fortis-food-court.jpg',
      '/images/projects/bnp-paribas-fortis-curved-ceiling.jpg',
      '/images/projects/bnp-paribas-fortis-printed-detail.jpg',
    ],
  },
  {
    key: 'commercial', slug: 'van-der-valk-beveren', cat: 'Commercial', title: 'Van der Valk',
    meta: 'Beveren · Hotel event hall', featured: true,
    image: '/images/projects/van-der-valk-beveren-hero.jpg',
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
    gallery: [
      '/images/projects/van-der-valk-beveren-before.jpg',
      '/images/projects/van-der-valk-beveren-renovation.jpg',
      '/images/projects/van-der-valk-beveren-tensioning.jpg',
      '/images/projects/van-der-valk-beveren-lobby-install.jpg',
      '/images/projects/van-der-valk-beveren-hatch-detail.jpg',
      '/images/projects/van-der-valk-beveren-columns.jpg',
    ],
  },
  {
    key: 'office', slug: 'johnson-and-johnson', cat: 'Office', title: 'Johnson & Johnson',
    meta: 'Limerick, IE · Pharma R&D facility',
    image: '/images/projects/johnson-and-johnson-hero.jpg',
    summary: 'A printed, illuminated ceiling for a pharmaceutical R&D facility.',
    hook: 'A reflective, innovative ceiling and lighting design echoing Johnson & Johnson’s research into improved eyesight.',
    description: [
      'STRETCH collaborated with Van Dijk Architects and Glennwood interiors on the ceiling and lighting design for Johnson & Johnson’s new facility in Limerick City, Ireland. The brief was a reflective, innovative ceiling that matched the building’s research-and-development goals around improved eyesight.',
      'The printed and illuminated STRETCH ceiling runs throughout the building, giving each area its own focus and acting as visual guidance for people moving through the space. Modern lighting applications enhance both the design and the finished look.',
    ],
    highlights: ['Custom print throughout the building', 'Illumination for focus and wayfinding', 'Reflective, R&D-inspired design'],
    materials: ['Printed STRETCH ceiling', 'Illuminated (backlit) STRETCH ceiling', 'Integrated lighting'],
    facts: [
      { label: 'Region', value: 'Limerick, Ireland' },
      { label: 'Year', value: '2019' },
      { label: 'Area', value: '60 m²' },
      { label: 'Architect', value: 'Van Dijk Architects', href: 'https://www.vandijkarchitects.com/' },
      { label: 'STRETCH dealer', value: 'Glennwood', href: 'https://www.glennwood.ie/' },
    ],
    solutions: ['custom-print', 'light-print-stretch-ceiling'],
    gallery: [
      '/images/projects/johnson-and-johnson-canteen.jpg',
      '/images/projects/johnson-and-johnson-canopy.jpg',
    ],
  },
  {
    key: 'commercial', slug: 'polette-eyewear', cat: 'Retail', title: 'Polette Eyewear',
    meta: 'Antwerp · Retail concept store', featured: true,
    image: '/images/projects/polette-eyewear-piano-ceiling.jpg',
    summary: 'A never-before-seen retail concept by architect Javier Zubiria.',
    hook: 'A shop you can play like a musical instrument — a tribute to peace, love and unity.',
    description: [
      'Antwerp, 2022. After the success of its Paris showroom, polette teamed up again with Javier Zubiria, founder of Amsterdam studio zU-Studio, to bring a never-before-seen retail concept to Antwerp. The brief began with a single song — John Lennon’s “Imagine” — and the wish to build a place of connection and creativity after years of distance.',
      'Visitors are met by two giant piano keyboards, one on each side, each with 88 keys. The white keys are floor-to-ceiling mirrors that create a sense of infinity; the black keys double as shelves for polette’s eyewear. At the centre, a giant white bench nods to Lennon’s Bed-in peace protest.',
      'Overhead, the ceiling carries the showstopper: a sculptural piano-lid form beveled along the full 20-metre depth of the showroom, built as an illuminated, light-transmitting STRETCH ceiling. Every piano key is functional too — a sensor system lights up the next key to press, so visitors can play a song together in the space.',
    ],
    highlights: ['Illuminated, light-transmitting ceiling sculpture', 'Piano-lid form across the full 20 m depth', 'Sensor-driven interactive key lighting', 'Installed in a single working day'],
    materials: ['Acoustic, light-transmitting STRETCH ceiling', 'Sculptural piano-lid ceiling form', 'Integrated lighting', 'Sensor-controlled key lighting'],
    facts: [
      { label: 'Region', value: 'Antwerp' },
      { label: 'Year', value: '2022' },
      { label: 'Area', value: '60 m²' },
      { label: 'Architect', value: 'zU-Studio · Javier Zubiria', href: 'http://zu-studio.com/work/imagine-polette/' },
    ],
    faqs: [
      { q: 'How long did the installation take?', a: 'Installing the acoustic, light-transmitting stretch ceiling took a single working day.' },
      { q: 'How many installers worked on the project?', a: 'A team of 2 STRETCH fitters handled the whole job — the ceiling and the lighting.' },
      { q: 'How long will the ceiling last?', a: 'Like any stretch ceiling, lifespan depends on cleaning, but it will comfortably last around 25 years; after that only the membrane might need replacing, with the existing frame staying in place.' },
    ],
    solutions: ['light-print-stretch-ceiling', 'acoustic-stretch-system'],
    gallery: [
      '/images/projects/polette-eyewear-illuminated-lid.jpg',
      '/images/projects/polette-eyewear-sculpture.jpg',
      '/images/projects/polette-eyewear-keys.jpg',
    ],
  },
  {
    key: 'bathroom', slug: 'citizenm-hotel', cat: 'Bathroom', title: 'CitizenM Hotel',
    meta: 'USA & Europe · Prefab bathroom units', featured: true,
    image: '/images/projects/citizenm-paris-opera-bathroom-pod.jpg',
    summary: 'Backlit prefab bathroom ceilings for CitizenM hotels — 2,608 pods across Europe and the USA.',
    hook: 'One removable, backlit ceiling design — engineered once, repeated across 2,608 prefab bathroom pods on two continents.',
    description: [
      'CitizenM builds its hotels from prefabricated modules, with partner Saniskill producing the compact bathroom pods. STRETCH engineered and supplied the illuminated ceiling for each pod: a backlit, light-transmitting STRETCH membrane that turns the whole ceiling of the small space into a soft, even light source.',
      'Each ceiling is built from two illuminated stretch-ceiling panels — and every panel is removable. The same element that carries the light doubles as an inspection hatch, so the services above the pod stay reachable without a single extra opening breaking the clean surface.',
      'In total 2,608 shower pods were delivered across Europe and America — from Paris Opera and Copenhagen Rådhuspladsen to New York, Chicago, Miami Brickell, Washington DC, Seattle, San Francisco, Los Angeles and Nuenen. Built off-site, every unit arrives with the same repeatable, hotel-grade finish.',
    ],
    highlights: ['2,608 prefab shower pods on two continents', 'Two backlit panels per ceiling', 'Every panel removable — the ceiling doubles as an inspection hatch', 'Humidity-proof, wipeable membrane'],
    materials: ['Prefab STRETCH ceiling element (two panels per pod)', 'STRETCH Backlit (light-transmitting) membrane', 'Removable panels — full-surface inspection hatch', 'Integrated lighting'],
    facts: [
      { label: 'Continents', value: 'USA & Europe' },
      { label: 'Units', value: '2,608 shower pods' },
      { label: 'Cities', value: 'Paris, Copenhagen, New York, Chicago, Miami, Washington DC, Seattle, San Francisco, LA, Nuenen' },
      { label: 'Partner', value: 'Saniskill', href: 'https://saniskill.nl/portfolio/citizenm-hotel-group/' },
    ],
    solutions: ['prefab-ceiling-unit', 'light-print-stretch-ceiling', 'inspection-hatch'],
    gallery: [
      '/images/projects/citizenm-prefab-bathroom-pod.jpg',
      '/images/projects/citizenm-pod-interior.jpg',
      '/images/projects/citizenm-copenhagen-radhuspladsen.jpg',
      '/images/projects/citizenm-seattle-pioneer-square.jpg',
      '/images/projects/citizenm-washington-dc-capitol.jpg',
      '/images/projects/citizenm-paris-opera-2.jpg',
    ],
  },
  {
    key: 'living', slug: 'london-chapel', cat: 'Living room', title: 'London Chapel',
    meta: 'London, UK · Chapel conversion',
    image: '/images/projects/london-chapel-hero.jpg',
    summary: 'Acoustic fabric walls and a fabric-lined vaulted ceiling for a chapel converted into a London home.',
    hook: 'A chapel turned family home — wrapped room by room in tensioned acoustic fabric.',
    description: [
      'For this chapel conversion in London, our dealer Upholster London finished the interiors with tensioned STRETCH fabric: acoustic fabric walls run through the halls, landings and stairwells, and even the vaulted ceiling is lined with fabric between its original ribs.',
      'The textile surfaces calm the acoustics of the tall, hard spaces and give every room a warm, upholstered depth that paint can never reach — while original details such as the stained-glass windows stay untouched, framed by crisp fabric panels. A fabric-walled home cinema completes the home.',
    ],
    highlights: ['Fabric-lined vaulted chapel ceiling', 'Acoustic fabric walls throughout the home', 'Fabric-walled home cinema', 'Original stained glass, crisply framed'],
    materials: ['STRETCH acoustic fabric walling', 'Fabric-lined vaulted ceiling', 'Fabric-walled home cinema', 'Bespoke profiles around arches and stained glass'],
    facts: [
      { label: 'Location', value: 'London, UK' },
      { label: 'Space', value: 'Chapel converted into a private home' },
      { label: 'STRETCH dealer', value: 'Upholster London' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: [
      '/images/projects/london-chapel-vaulted-ceiling.jpg',
      '/images/projects/london-chapel-home-cinema.jpg',
      '/images/projects/london-chapel-staircase.jpg',
      '/images/projects/london-chapel-stained-glass.jpg',
      '/images/projects/london-chapel-landing.jpg',
      '/images/projects/london-chapel-bathroom.jpg',
      '/images/projects/london-chapel-stair-detail.jpg',
      '/images/projects/london-chapel-navy-wall.jpg',
      '/images/projects/london-chapel-keypad.jpg',
    ],
  },
  {
    key: 'light', slug: 'rue-perree-paris', cat: 'Light & Print', title: 'Rue Perrée',
    meta: 'Paris · Backlit gallery ceiling',
    image: '/images/projects/rue-perree-luminous-gallery.jpg',
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
    gallery: [
      '/images/projects/rue-perree-boutique.jpg',
      '/images/projects/rue-perree-bar.jpg',
    ],
  },
  // ---- Migrated from the old stretchplafond.be portfolio (6 Aug 2026) ------
  // EN copy distilled from the old Dutch case-study pages; translations for the
  // `projects` messages namespace are a follow-up step (EN renders meanwhile).
  {
    key: 'living', slug: 'vier-emmershof-lokeren', cat: 'Living room', title: '’t Vier Emmershof',
    meta: 'Lokeren · Forest residence',
    image: '/images/projects/vier-emmershof-hero.jpg',
    summary: 'Acoustic stretch ceilings through a sculptural forest residence.',
    hook: 'A sculptural home among the spruce trees, kept just as calm inside as the forest around it.',
    description: [
      'At ’t Vier Emmershof in Lokeren, a sculptural residence sits between preserved spruce trees, its fully glazed rear facade pulling the forest into the living spaces. Natural finishes shape a warm, quiet interior.',
      'Acoustic STRETCH ceilings run through the home, absorbing the reflections all that glass would otherwise amplify — and acoustic wall elements finished with printed textile extend the treatment beyond the ceiling plane.',
    ],
    highlights: ['Acoustic ceilings throughout the home', 'Printed-textile acoustic wall elements', 'Glazed rear facade — forest views, controlled acoustics'],
    materials: ['Acoustic STRETCH ceiling', 'Acoustic wall elements with printed textile'],
    facts: [
      { label: 'Location', value: 'Lokeren, Belgium' },
      { label: 'Architect', value: 'Inzicht Architecten' },
      { label: 'STRETCH dealer', value: 'Plafondlux BV' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: [
      '/images/projects/vier-emmershof-interior.jpg',
      '/images/projects/vier-emmershof-sculpture.jpg',
      '/images/projects/vier-emmershof-bath.jpg',
    ],
  },
  {
    key: 'living', slug: 'vp-193', cat: 'Living room', title: 'Villa VP-193',
    meta: 'East Flanders · Private residence',
    image: '/images/projects/vp-193-hero.jpg',
    summary: 'Acoustic ceilings for a sandstone-clad villa built around light and privacy.',
    hook: 'A home allowed to stand out without shouting — Indian sandstone outside, calm acoustics inside.',
    description: [
      'Villa VP-193 wears a facade of Indian sandstone that gives the house warmth and character. Its living spaces turn to the rear, where large glass planes frame a spruce forest, while a generous interior garden at the front keeps daylight high and privacy intact. A bold cantilever forms the covered terrace and carport.',
      'Inside, acoustic STRETCH ceilings keep the open, hard-surfaced spaces comfortable, with Kreon lighting integrated flush into the membrane.',
    ],
    highlights: ['Acoustic ceiling across the open living spaces', 'Flush-integrated Kreon lighting', 'Sandstone facade with cantilevered terrace'],
    materials: ['Acoustic STRETCH ceiling', 'Integrated lighting (Kreon a.o.)'],
    facts: [
      { label: 'Region', value: 'East Flanders, Belgium' },
      { label: 'Architect', value: 'Inzicht Architecten' },
      { label: 'STRETCH dealer', value: 'Plafondlux BV' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: [
      '/images/projects/vp-193-kitchen.jpg',
      '/images/projects/vp-193-hall.jpg',
      '/images/projects/vp-193-exterior.jpg',
    ],
  },
  {
    key: 'living', slug: 'jpv-210', cat: 'Living room', title: 'Villa JPV-210',
    meta: 'Belgium · Private residence',
    image: '/images/projects/jpv-210-hero.jpg',
    summary: 'Seamless white ceilings for an all-white minimalist villa.',
    hook: 'White on white: a minimalist villa where the ceiling had to disappear completely.',
    description: [
      'Villa JPV-210 is an exercise in reduction — stacked white volumes outside, and interiors where walls, joinery and floors dissolve into a single bright surface. In a house this pure, any ceiling seam or fixture would break the spell.',
      'Seamless STRETCH ceilings carry the same uninterrupted white overhead, keeping the hard, open volumes comfortable to live in.',
    ],
    highlights: ['Seamless matte-white ceilings throughout', 'No visible seams or trims', 'Calm in hard, open volumes'],
    materials: ['Seamless STRETCH ceiling, matte white'],
    facts: [
      { label: 'Country', value: 'Belgium' },
      { label: 'Space', value: 'Private villa' },
    ],
    solutions: ['polyester-stretch-ceiling', 'acoustic-stretch-system'],
    gallery: [
      '/images/projects/jpv-210-kitchen.jpg',
      '/images/projects/jpv-210-living.jpg',
      '/images/projects/jpv-210-stairs.jpg',
    ],
  },
  {
    key: 'living', slug: 'ben-home-vdb-222', cat: 'Living room', title: 'BEN Home VDB-222',
    meta: 'Sint-Pauwels · Near-energy-neutral home',
    image: '/images/projects/vdb-222-hero.jpg',
    summary: 'Acoustic ceilings for a near-energy-neutral forest home built around unity.',
    hook: 'Maximum glass, maximum connection to the trees — without giving up quiet or privacy.',
    description: [
      'Unity is the guiding principle of this BEN (nearly energy-neutral) residence in Sint-Pauwels: generous glazing and an open plan connect the house to the surrounding greenery, balanced carefully against privacy and a sense of shelter.',
      'Acoustic STRETCH ceilings temper the openness — absorbing sound across the glazed, open volumes — with Delta Light fixtures integrated cleanly into the membrane.',
    ],
    highlights: ['Acoustic ceiling across the open plan', 'Integrated Delta Light lighting', 'Near-energy-neutral (BEN) build'],
    materials: ['Acoustic STRETCH ceiling', 'Integrated lighting (Delta Light a.o.)'],
    facts: [
      { label: 'Location', value: 'Sint-Pauwels, Belgium' },
      { label: 'Architect', value: 'Inzicht Architecten' },
      { label: 'STRETCH dealer', value: 'Plafondlux BV' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: [
      '/images/projects/vdb-222-living.jpg',
      '/images/projects/vdb-222-terrace.jpg',
      '/images/projects/vdb-222-bath.jpg',
    ],
  },
  {
    key: 'living', slug: 'vap-sint-pauwels', cat: 'Living room', title: 'VAP — Sint-Pauwels',
    meta: 'Sint-Pauwels · White villa',
    image: '/images/projects/vap-sint-pauwels-hero.jpg',
    summary: 'Acoustic ceilings for a bright white villa inspired by water.',
    hook: 'A white villa for a family drawn to water — ceilings that catch the light like a calm sea.',
    description: [
      'This bright white villa (project VA-176) reflects its owners’ connection to water: light surfaces and ceiling planes that pick up reflections like a still sea. A home office can split off into a suite with an identity of its own.',
      'Acoustic STRETCH ceilings run through the living spaces, paired with Kreon lighting, keeping the crisp white interior as calm to the ear as it is to the eye.',
    ],
    highlights: ['Acoustic ceilings in every living space', 'Kreon lighting integration', 'Convertible office / guest-suite layout'],
    materials: ['Acoustic STRETCH ceiling', 'Integrated lighting (Kreon a.o.)'],
    facts: [
      { label: 'Location', value: 'Sint-Pauwels, Belgium' },
      { label: 'Year', value: '2022–2023' },
      { label: 'Architect', value: 'Inzicht Architecten' },
      { label: 'STRETCH dealer', value: 'Plafondlux BV' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['/images/projects/vap-sint-pauwels-1.jpg', '/images/projects/vap-sint-pauwels-2.jpg', '/images/projects/vap-sint-pauwels-3.jpg'], // photos to come (old site: STRETCH-Van-Akeleyn set)
  },
  {
    key: 'office', slug: 'goesten-opdam', cat: 'Office', title: 'Goesten & Opdam',
    meta: 'Belgium · Office fit-out',
    image: '/images/projects/goesten-opdam-hero.jpg',
    summary: 'A colour-matched acoustic ceiling for a nature-inspired office fit-out.',
    hook: 'Acoustics in a custom RAL colour, over an office that brings the outside in.',
    description: [
      'The Goesten & Opdam offices, fitted out with interior builder Tenback, take their cue from nature — down to the leafy feature wall behind the curved reception desk.',
      'Overhead, an acoustic STRETCH ceiling in a custom RAL colour ties the palette together while keeping the workspace quiet.',
    ],
    highlights: ['Acoustic ceiling in a custom RAL colour', 'Nature-themed office interior'],
    materials: ['Acoustic STRETCH ceiling (custom RAL colour)'],
    facts: [
      { label: 'Country', value: 'Belgium' },
      { label: 'Interior builder', value: 'Tenback' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['', '', ''],
  },
  {
    key: 'office', slug: 'dhl-zaventem', cat: 'Office', title: 'DHL Zaventem',
    meta: 'Zaventem · Boeing 737 meeting room',
    image: '/images/projects/dhl-zaventem-hero.jpg',
    summary: 'A Camira-clad acoustic ceiling inside a full-scale Boeing 737 meeting room.',
    hook: 'A conference room built as a Boeing 737 fuselage — with acoustics to match the idea.',
    description: [
      'For the DHL team in Zaventem, dealer Ideal Acoustics built a meeting space unlike any other: a full-scale section of a Boeing 737 fuselage, right in the office.',
      'Acoustic STRETCH ceilings finished with Camira textile line the space, so the spectacular shell also delivers serious acoustic comfort for meetings.',
    ],
    highlights: ['Full-scale Boeing 737 fuselage meeting room', 'Acoustic ceiling clad in Camira textile'],
    materials: ['Acoustic STRETCH ceiling', 'Camira textile finish'],
    facts: [
      { label: 'Location', value: 'Zaventem, Belgium' },
      { label: 'Year', value: '2023' },
      { label: 'STRETCH dealer', value: 'Ideal Acoustics' },
      { label: 'Client', value: 'DHL' },
    ],
    solutions: ['acoustic-stretch-system'],
    gallery: ['/images/projects/dhl-zaventem-1.jpg', '/images/projects/dhl-zaventem-2.jpg', '/images/projects/dhl-zaventem-3.jpg'], // photos to come (old site: Ideal Acoustics set)
  },
  {
    key: 'commercial', slug: 'veta-interieur-showroom', cat: 'Retail', title: 'Veta Interieur',
    meta: 'Dendermonde · Bathroom showroom',
    image: '/images/products/illuminated-printed-stretch-ceiling.jpg',
    summary: 'Printed, illuminated ceilings across a 350 m² bathroom showroom.',
    hook: 'Eighteen bathroom worlds under one roof — printed, glowing ceilings setting each scene.',
    description: [
      'Veta Interieur’s 350 m² showroom in Dendermonde stages complete bathroom experiences, built on 25 years of design and craftsmanship with materials imported directly from Italy and Spain.',
      'STRETCH delivered illuminated ceilings with edge-to-edge print — soft, even light overhead that turns each display bathroom into an immersive scene.',
    ],
    highlights: ['350 m² showroom', 'Printed + backlit ceilings', 'Immersive display bathrooms'],
    materials: ['STRETCH Backlit (light-transmitting) ceiling', 'Edge-to-edge custom print'],
    facts: [
      { label: 'Location', value: 'Dendermonde, Belgium' },
      { label: 'Year', value: '2022' },
      { label: 'Client', value: 'Veta Interieur' },
    ],
    solutions: ['custom-print', 'light-print-stretch-ceiling'],
    gallery: ['', '', ''],
  },
  {
    key: 'commercial', slug: 'creneau-afas-lounge', cat: 'Commercial', title: 'AFAS Lounge — BE•AT',
    meta: 'Antwerpen · VIP lounge, AFAS Dome',
    image: '/images/projects/creneau-afas-lounge-hero.jpg',
    summary: 'A black gloss acoustic ceiling that turns one lounge into four rooms.',
    hook: 'One ceiling, two effects: a club-grade mirror above, concert-grade absorption behind it.',
    description: [
      'For the VIP lounge of the AFAS Dome in Antwerp, design studio Creneau International (Hasselt) imagined a space that plays four roles in a single evening: restaurant, dance floor, conference room and lounge. The ceiling had to carry that transformation.',
      'We produced a black high-gloss PVC membrane with roughly 90% reflectivity — a mirror that doubles the room and its light — backed by a perforated acoustic layer with absorber material, so the BE•AT sound system lands crisp instead of harsh.',
      'LED lighting points and speaker openings were cut in production, the membrane was welded seamlessly up to 6.50 m wide, and the 250 m² lounge ceiling was installed in three days on site.',
    ],
    highlights: ['One surface, two functions: mirror gloss + acoustic absorption', 'LED and speaker openings factory-cut, no visible hardware', '250 m² installed in three days'],
    materials: ['Black high-gloss PVC membrane (±90% reflectivity)', 'Perforated acoustic backing with absorber', 'Factory-cut LED and audio integrations'],
    facts: [
      { label: 'Location', value: 'AFAS Dome, Antwerpen' },
      { label: 'Design', value: 'Creneau International (Hasselt)' },
      { label: 'Surface', value: '250 m² · installed in 3 days' },
      { label: 'Year', value: '2025' },
    ],
    gallery: ['/images/projects/creneau-afas-lounge-1.jpg', '/images/projects/creneau-afas-lounge-2.jpg', '/images/projects/creneau-afas-lounge-3.jpg'],
  },
  {
    key: 'office', slug: 'candor-sint-martens-latem', cat: 'Office', title: 'Candor',
    meta: 'Sint-Martens-Latem · Developer offices',
    image: '/images/projects/candor-sint-martens-latem-hero.jpg',
    summary: 'Invisible acoustics for a developer’s offices — zero visible panels.',
    hook: 'Meeting rooms below RT60 0.6 seconds, and not a single acoustic panel in sight.',
    description: [
      'Real-estate developer Candor renovated its offices on the Kortrijksesteenweg in Sint-Martens-Latem: open space, meeting rooms, kitchen and a relaxation zone, designed by Goedele Perdu with acoustic consulting by Form Design (Dendermonde) — our dealer for the region.',
      'The acoustics disappear into the architecture. Micro-perforated polyester membranes span every ceiling as one smooth plane, with the absorption layer hidden in the plenum above and LED lighting integrated flush into the surface.',
      'The result measures where it matters: reverberation below 0.8 seconds in the open space and below 0.6 seconds in meeting rooms — concentration-grade acoustics with zero visible panels, and every ceiling demountable for maintenance.',
    ],
    highlights: ['RT60 below 0.8 s (open space) and 0.6 s (meeting rooms)', 'Micro-perforated membrane, absorption hidden in the plenum', 'Demountable — full access to the ceiling void'],
    materials: ['Acoustic micro-perforated polyester membrane', 'Plenum absorption layer', 'Integrated flush LED lighting'],
    facts: [
      { label: 'Location', value: 'Sint-Martens-Latem' },
      { label: 'Interior design', value: 'Goedele Perdu' },
      { label: 'Acoustics', value: 'Form Design (Dendermonde)' },
      { label: 'Year', value: '2025' },
    ],
    gallery: ['/images/projects/candor-sint-martens-latem-1.jpg', '/images/projects/candor-sint-martens-latem-2.jpg', '/images/projects/candor-sint-martens-latem-3.jpg'],
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
          'PVC films are warmed during installation so they relax, then tighten as they cool to a flawless surface. PVC is fully recyclable, removable for access to the services above, and spans up to 6.4 m seamless — the widest option.',
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
  // ============================================================
  // P1 KNOWLEDGE-BASE ARTICLES — recreated from the old site's top
  // organic pages (see gsc-site-analysis workbook). Slugs kept
  // identical to the old Dutch URLs so the 301s are near-exact.
  // ============================================================
  {
    slug: 'houten-planchetten-plafond-renoveren-of-vernieuwen',
    title: 'Renovating a wooden slat ceiling: paint it or cover it?',
    excerpt:
      'Wooden planchette ceilings make a room feel dark and dated. You have two realistic options: sand and paint the slats, or mount a new ceiling below them. Here is an honest comparison — including when a stretch ceiling is the smarter route.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 6,
    image: '/images/blog/houten-planchetten-plafond-renoveren-of-vernieuwen.jpg',
    body: [
      {
        heading: 'Why slat ceilings feel dated',
        paragraphs: [
          'Wooden planchettes were everywhere in Belgian homes from the seventies through the nineties. The wood itself is usually still fine — the problem is optical. Dark lacquered slats absorb light, press the room down visually and clash with the bright, calm interiors most renovations aim for.',
          'The good news: you almost never have to tear the ceiling down. Both realistic fixes work on top of, or just below, the existing slats.',
        ],
      },
      {
        heading: 'Option 1 — sand and paint the slats',
        paragraphs: [
          'Painting is the budget route, and done properly it can look good. Degrease the slats first with a non-foaming cleaner, so the sanding paper does not clog. If the old varnish is flaking, sand it back with P60 and work up to P100 for a surface the primer can grip.',
          'Prime with a felt roller, respect the drying times — count 24 to 48 hours depending on the condition of the wood — and finish with two coats of quality ceiling paint. The gaps between the slats stay visible, which some people like; if you want them gone, they need filling and sanding, and at that point the labour starts to outweigh the savings.',
        ],
      },
      {
        heading: 'Option 2 — a new ceiling below the slats',
        paragraphs: [
          'The alternative is to leave the planchettes where they are and mount a new, perfectly flat ceiling a few centimetres below them. Classically that means a plasterboard ceiling: framing, boards, joints, sanding and painting — solid, but a week of work and a house full of dust.',
          'A stretch ceiling reaches the same flat result a different way. A slim profile is fixed around the perimeter, and a membrane is tensioned into it — over the existing slats, in a single day, without sanding dust and usually without even moving the furniture out. Spots, ventilation and sensors are integrated during the same visit.',
        ],
      },
      {
        heading: 'Which one should you choose?',
        paragraphs: [
          'Paint if the budget is tight, the slats are in good condition and you do not mind the grooved look staying. Choose a new ceiling below if you want a seamless modern surface, need to hide cables, pipes or bad repairs, or want built-in lighting.',
          'Between plasterboard and stretch: plasterboard wins on DIY familiarity, stretch wins on speed, cleanliness and maintenance — the membrane never cracks, never needs repainting, and a matte white finish is indistinguishable from a freshly plastered ceiling.',
        ],
      },
      {
        heading: 'What it looks like in practice',
        paragraphs: [
          'A typical living room takes our installers one working day: profile up, membrane tensioned, lighting connected, done. The old planchettes stay hidden above the new ceiling — no demolition container, no debris.',
          'Curious what that would cost for your room? Request a free quote with your dimensions and we will come back with a concrete price, usually the same working day.',
        ],
      },
    ],
  },
  {
    slug: 'scheuren-in-plafond-herstellen',
    title: 'Repairing ceiling cracks — and stopping them from coming back',
    excerpt:
      'Most ceiling cracks are harmless, some are warnings. This guide covers what causes them, how to repair small and large cracks properly — and why a stretch ceiling is the only fix that guarantees they never show again.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 6,
    image: '/images/blog/scheuren-in-plafond-herstellen.jpg',
    body: [
      {
        heading: 'Where ceiling cracks come from',
        paragraphs: [
          'Buildings move. Temperature and humidity swings make timber and plaster expand and contract, and hairline cracks along joints or corners are the visible result. Other common causes are poorly finished plasterboard seams, old water damage and — more rarely — real structural settlement.',
          'A fine, stable hairline crack is cosmetic. A crack that keeps growing, runs diagonally from a corner, or appears together with sticking doors deserves a professional look before you reach for filler.',
        ],
      },
      {
        heading: 'Repairing small cracks',
        paragraphs: [
          'Open the crack slightly with a scraper so the filler has something to hold, brush out the dust, and fill with a flexible joint compound. Let it dry fully, sand it flush, and repaint the area — ideally the whole ceiling, because a repainted patch is always visible in raking light.',
          'Count on a day of work including drying times for an average repair. Materials are cheap; the invisible part — sanding and repainting to an even finish — is where the hours go.',
        ],
      },
      {
        heading: 'Repairing large or recurring cracks',
        paragraphs: [
          'Wide cracks, sagging sections or crumbling plaster call for more than filler: damaged zones need cutting out and replacing, or a full skim coat. At that point you are close to the cost of a new ceiling surface — and the honest truth is that even a professional repair cannot promise the crack stays away. The building keeps moving, and rigid plaster keeps registering that movement.',
        ],
      },
      {
        heading: 'The fix that cannot crack',
        paragraphs: [
          'This is where a stretch ceiling changes the logic. Instead of repairing the rigid surface again, you tension a flexible membrane a few centimetres below it. The old ceiling — cracks and all — disappears from view, and because the membrane is elastic, building movement simply cannot mark it.',
          'Installation takes one day in a normal room, produces no dust, and the existing ceiling does not need to be repaired first. The result is a perfectly flat matte, satin or gloss surface that never needs repainting.',
        ],
      },
      {
        heading: 'Repair or cover: a quick decision guide',
        paragraphs: [
          'One stable hairline crack in an otherwise good ceiling: repair it and repaint. A ceiling with multiple cracks, old repairs that keep returning, or a poor surface overall: covering it with a stretch ceiling is usually faster, cleaner and permanent.',
          'Send us a photo of your ceiling with the room dimensions and we will tell you honestly which route we would take — and what it would cost.',
        ],
      },
    ],
  },
  {
    slug: 'de-ideale-plafondhoogte',
    title: 'What is the ideal ceiling height?',
    excerpt:
      'From 2.20 m bedrooms in older homes to 3 m townhouse salons: what counts as a comfortable ceiling height, what the norms say for new construction and offices, and how to finish a ceiling when every centimetre counts.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 5,
    image: '/images/blog/de-ideale-plafondhoogte.jpg',
    body: [
      {
        heading: 'The short answer',
        paragraphs: [
          'For most Belgian homes the comfortable zone sits between 2.50 and 2.60 m. Lower starts to feel pressed as soon as the room is large; higher feels generous but costs more to heat. The "ideal" height is really a balance between room size, function, light and budget.',
        ],
      },
      {
        heading: 'Existing homes and renovations',
        paragraphs: [
          'In houses built in the last fifty years, expect around 2.50 m in living rooms and kitchens and about 2.20 m in bedrooms — bedrooms were deliberately built lower to save heated volume. Older stock swings both ways: post-war workers\u2019 housing can dip below 2.40 m, while pre-war townhouses often reach 2.80 to 3.00 m on the bel-etage.',
          'In a renovation you rarely change the structural height — what you control is how much of it the finishing layer eats. That makes the choice of ceiling system surprisingly important.',
        ],
      },
      {
        heading: 'New construction and offices',
        paragraphs: [
          'New-build practice in Belgium and the Netherlands works with a minimum of 2.40 m for habitable rooms, and most projects design at around 2.60 m. Offices follow workplace standards — the Dutch NEN 1824 guideline, widely used as a reference, sets 2.50 m as the minimum for office space — and open-plan floors usually go higher for air volume and acoustics.',
        ],
      },
      {
        heading: 'When every centimetre counts',
        paragraphs: [
          'The lower the room, the more the finishing system matters. A classic suspended plasterboard ceiling with framing typically costs 7 to 15 cm; add recessed spots and you lose more. A stretch ceiling needs only a few centimetres — the profile height — and integrates flat LED lighting without extra depth.',
          'That difference decides whether a 2.50 m room stays at a comfortable 2.46 m or drops to a noticeably low 2.38 m. In basements, bathrooms and renovated attics it is often the argument that settles the system choice.',
        ],
      },
      {
        heading: 'Height is also perception',
        paragraphs: [
          'A ceiling reads higher when it is bright and even. A matte white seamless surface reflects soft light and visually lifts the room; a high-gloss lacquer membrane goes further and mirrors the space, which can make low rooms feel dramatically taller. Combined with indirect LED lines along the perimeter, the effect is stronger than a few real centimetres.',
          'Planning a renovation where height is tight? Ask us for a quote — we will tell you exactly how many centimetres the build-up needs in your situation.',
        ],
      },
    ],
  },
  {
    slug: 'geluidsoverlast-van-uw-bovenburen',
    title: 'Noise from the upstairs neighbours: what actually works',
    excerpt:
      'Footsteps, scraping chairs, a washing machine through the slab — contact noise is the hardest noise to fight. Why the ceiling is the right surface to treat, and how an acoustic mass-spring-mass ceiling brings real, measurable relief.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        heading: 'Two kinds of noise, two problems',
        paragraphs: [
          'Airborne noise — voices, music, a television — travels through the air and is blocked reasonably well by mass alone. Contact noise is different: footsteps, moving furniture and appliances vibrate the building itself, and the structure carries that vibration straight into your rooms. That is why you hear heels on the floor above so much louder than a conversation.',
          'Contact noise is best tackled at the source — a soft floor covering upstairs works wonders — but you cannot oblige your neighbours to renovate. What you control is your own side of the slab.',
        ],
      },
      {
        heading: 'Why the ceiling comes first',
        paragraphs: [
          'In an apartment, the ceiling is the largest surface radiating the neighbours\u2019 noise into your space. Treating it first gives the biggest gain; in older buildings with continuous masonry, flanking walls can be a second step.',
          'What does not work: gluing thin foam or "acoustic" panels directly to the slab. Direct contact passes the vibration straight through — decoration, not isolation.',
        ],
      },
      {
        heading: 'Mass-spring-mass: the principle that works',
        paragraphs: [
          'Real contact-noise isolation decouples a new, heavy layer from the structure: mass (the slab), spring (an air cavity with absorption and resilient mounting), mass (the new ceiling). The vibration loses its energy in the spring instead of reaching the surface you hear.',
          'Our acoustic ceiling build-up applies exactly that principle in about 5 cm of construction depth, with a rated insulation improvement around 55 dB for the system — enough to turn stamping into a faint background and normal living noise into silence. A deeper cavity or added mass pushes the performance further.',
        ],
      },
      {
        heading: 'Invisible when finished',
        paragraphs: [
          'The acoustic layer disappears behind a tensioned STRETCH membrane, so the finished result looks like any seamless designer ceiling — matte, satin or printed, with integrated lighting if you wish. No visible panels, no studio look in your living room.',
          'Installation is a matter of days, not weeks, and the room stays usable: no wet plaster, minimal dust.',
        ],
      },
      {
        heading: 'A realistic expectation',
        paragraphs: [
          'No ceiling system makes a badly built slab disappear completely, and very low-frequency thuds are physics\u2019 hardest case. But a properly executed mass-spring-mass ceiling is the difference between hearing every step and genuinely forgetting you have neighbours most of the day.',
          'Describe your situation in a quote request — building type, room size, what you hear — and we will advise whether the ceiling alone will get you there.',
        ],
      },
    ],
  },
  {
    slug: 'spanplafond-buiten',
    title: 'Stretch ceilings outdoors: covered terraces, overhangs and pool houses',
    excerpt:
      'A stretch ceiling is not only an indoor product. Under roof overhangs, carports, verandas and pool houses, an outdoor-grade membrane gives a seamless, washable finish that plasterwork outside can never match.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 4,
    image: '/images/blog/spanplafond-buiten.jpg',
    body: [
      {
        heading: 'Where an outdoor stretch ceiling makes sense',
        paragraphs: [
          'Think of every covered outdoor space where you look up at raw concrete, timber or cables: the overhang along a modern facade, the carport, the veranda or pergola, the pool house, a shop or hotel entrance. A tensioned membrane turns those into finished architecture in a day.',
          'The condition is that the ceiling is sheltered — under a roof, not exposed to standing water or direct driving rain. Within normal Belgian outdoor conditions, the membrane holds its tension and colour season after season.',
        ],
      },
      {
        heading: 'Built for outside',
        paragraphs: [
          'For exterior use we work with membranes with a No-Stain finish: dirt and insects do not bond with the surface, and a soft sponge with water brings the ceiling back to new. There is no paint film to flake, no plaster to crack in frost — the classic failure modes of finished outdoor ceilings simply do not apply.',
          'The look is a choice, not a compromise: more than thirty colours across matte, satin and gloss finishes. Deep black overhangs have become a signature detail on modern villas — the ceiling reads as a shadow line and makes the facade float.',
        ],
      },
      {
        heading: 'Light and print, also outside',
        paragraphs: [
          'Everything we integrate indoors travels outside: waterproof spots, LED lines along the perimeter, even a full backlit ceiling that turns a terrace into an evening room. Printed membranes open the playful end — a sky over the pool house, a brand statement over a commercial entrance.',
        ],
      },
      {
        heading: 'From bare overhang to finished ceiling',
        paragraphs: [
          'The build-up mirrors an interior installation: perimeter profile on the existing structure, membrane tensioned in, fixtures integrated. Most residential overhangs and pool houses are finished within a day.',
          'Send us a photo of your outdoor space with rough dimensions and we will confirm whether the situation is suitable and what it would cost.',
        ],
      },
    ],
  },
  {
    slug: 'klimaat-plafond',
    title: 'The climate ceiling: heating and cooling you never see or hear',
    excerpt:
      'A climate ceiling regulates room temperature through the ceiling surface itself — silently, evenly and invisibly behind a stretch membrane. How the system works, and why it pairs so well with a tensioned ceiling.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        heading: 'What a climate ceiling is',
        paragraphs: [
          'A climate ceiling uses the ceiling plane to heat and cool the room. Instead of radiators on the wall or a split unit blowing air at your neck, the conditioning happens above you, spread across the largest free surface of the room — which is exactly why the result feels so even.',
          'Combined with a stretch ceiling, the technology disappears completely: the membrane forms the visible surface, and the climate components live in the plenum behind it.',
        ],
      },
      {
        heading: 'How it works behind the membrane',
        paragraphs: [
          'Warm air rises; the ceiling is where the room\u2019s heat naturally collects. The system exploits that: air circulates quietly through the plenum between the structural slab and the membrane, entering and leaving through profiles with integrated openings. The membrane surface itself tempers the room by convection and radiation — inductive heating and cooling without visible grilles.',
          'Because the exchange surface is enormous compared to a radiator, the system runs at gentle temperatures and low air speeds. In practice that means a uniform room temperature, no draughts, and operation you can barely hear.',
        ],
      },
      {
        heading: 'What it means for energy use',
        paragraphs: [
          'Large-surface, low-temperature systems work efficiently with modern heat pumps, and the even distribution lets you set the thermostat lower for the same comfort. Depending on the building, that translates into roughly five to ten percent less energy use compared to conventional convection heating.',
        ],
      },
      {
        heading: 'Climate, acoustics and light in one plane',
        paragraphs: [
          'The same ceiling build-up carries the rest of the room\u2019s comfort: acoustic absorption behind a micro-perforated membrane, integrated LED lines or a fully backlit surface, spots and sensors — all in the identical seamless finish. One plane, four functions, zero visible technology.',
        ],
      },
      {
        heading: 'Is it right for your project?',
        paragraphs: [
          'Climate ceilings shine in renovations where wall space is precious, in offices that need silent cooling, and in high-end homes where design comes first. The investment depends heavily on room size and the climate installation itself, so an honest answer always starts from your plans.',
          'Request a quote with your project details and we will tell you what a climate ceiling would involve in your situation — construction depth, planning and budget.',
        ],
      },
    ],
  },
  {
    slug: 'kan-je-een-spanplafond-afwassen',
    title: 'Can you wash a stretch ceiling?',
    excerpt:
      'Yes — and that is one of its quiet superpowers. What you can safely use on a PVC or polyester membrane, what to avoid, and how to keep a stretch ceiling looking new for decades.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 4,
    image: '/images/blog/kan-je-een-spanplafond-afwassen.jpg',
    body: [
      {
        heading: 'The short answer',
        paragraphs: [
          'A PVC or polyester stretch ceiling is washable. The membrane is a closed surface that does not absorb dirt the way paint or plaster does, so everyday marks stay on top — where you can remove them.',
          'That makes stretch ceilings the practical choice for kitchens, bathrooms and commercial spaces, where a painted ceiling would need repainting every few years.',
        ],
      },
      {
        heading: 'How to clean it safely',
        paragraphs: [
          'Use warm water, a soft sponge or microfibre cloth, and light pressure. Wipe in straight passes rather than circles on gloss finishes to avoid shine differences. For grease film or stubborn marks, use a mild non-abrasive cleaner — our STRETCH Cleaner is formulated exactly for membrane surfaces and leaves no residue.',
          'Act quickly when something splashes: a fresh mark wipes away in seconds, a dried one takes patience. Never lean on the membrane while cleaning — let the cloth do the work.',
        ],
      },
      {
        heading: 'What to avoid',
        paragraphs: [
          'Skip scouring pads, abrasive powders, solvents and aggressive degreasers — they can dull or damage the surface permanently. High-pressure or steam cleaners have no place near a tensioned membrane either.',
          'One caveat: this guidance covers PVC and polyester membranes. Speciality textiles such as cotton-based or coated acoustic fabrics have their own care instructions — when in doubt, ask your supplier before wetting anything.',
        ],
      },
      {
        heading: 'Prevention beats cleaning',
        paragraphs: [
          'Good extraction in the kitchen, ventilation in the bathroom and a No-Stain finish in demanding spaces keep the ceiling clean by themselves for years. Where insects or dust are the enemy — think outdoor overhangs — the No-Stain surface makes the annual wipe-down almost symbolic.',
          'Need the right cleaner or advice for a specific stain? Our materials page lists the STRETCH Cleaner in 1 L and 5 L, and we are happy to advise on anything the sponge cannot fix.',
        ],
      },
    ],
  },
  {
    slug: 'spanplafond-zelf-plaatsen',
    title: 'Installing a stretch ceiling yourself: honest advice',
    excerpt:
      'Can a handy DIYer install a stretch ceiling? Sometimes — with the right system. What the job really involves, where it goes wrong, and when calling a certified installer (or becoming one) is the better plan.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        heading: 'What the job involves',
        paragraphs: [
          'Every stretch ceiling follows the same sequence. First the preparation: measure the room precisely, choose the membrane type, and clear the substrate of loose fixtures. Then the perimeter profile goes up, fixed level around the room — this rail carries all the tension, so straightness and solid anchoring are everything. Finally the membrane is tensioned into the profile and the finishing follows: trims, spots, ventilation.',
          'On paper that is a day of work for a normal room. In practice, the difference between a taut, seamless result and a wavy disappointment sits in the details of each step.',
        ],
      },
      {
        heading: 'Cold or warm: two very different systems',
        paragraphs: [
          'Polyester fabric systems install cold: the fabric clicks into the profile and is tensioned by hand. With patience, decent tools and a helper, this is the DIY-friendly end of the spectrum — and the route our stretch kits are designed for.',
          'PVC membranes are different. They are welded to size with a harpoon edge and installed warm: the room is heated so the membrane relaxes, then it is hooked into the profile and shrinks taut as it cools. That takes a heater, experience in reading the tension, and confidence around corners and obstacles. It is teachable — it is literally what we teach — but it is not a first-weekend project.',
        ],
      },
      {
        heading: 'Where DIY installations go wrong',
        paragraphs: [
          'The classic failures are a profile that is not level or tears out of soft plaster, measurement errors that leave the membrane slack or impossibly tight, and improvised cut-outs for spots that end in a ruined sheet. Electrical connections for integrated lighting are a job for a professional in any case.',
          'The honest math: a membrane welded to the wrong size is a loss, not a lesson. If your room has many corners, pipes or built-ins, the risk grows quickly.',
        ],
      },
      {
        heading: 'Three good routes to a stretch ceiling',
        paragraphs: [
          'Route one: have it installed. A certified installer finishes a normal room in a day, guarantees the result, and the price difference with DIY is smaller than most people expect once materials and tools are counted.',
          'Route two: the cold polyester kit for the confident DIYer — we supply the fabric, profiles and instructions through our materials catalogue. Route three: if ceilings are your trade, follow our installer training and do it properly with heat, harpoon and all — that is how most of our partner installers started.',
        ],
      },
    ],
  },
  {
    slug: 'schuin-dak',
    title: 'Finishing a sloped roof interior — layer by layer',
    excerpt:
      'Converting an attic stands or falls with the build-up behind the finish: insulation, vapour barrier, airtightness. How a pitched roof is layered from tiles to interior surface, and how a stretch ceiling finishes the slope seamlessly.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 5,
    image: '/images/blog/schuin-dak.jpg',
    body: [
      {
        heading: 'Know your roof structure',
        paragraphs: [
          'Belgian pitched roofs come in two families. A purlin roof (gordingendak) carries the load on horizontal beams, leaving recognisable horizontal lines through the attic. A truss or rafter roof (spantendak) works with diagonal members from ridge to eaves and generally leaves a more open volume. Which one you have determines where fixing points sit and how the interior finish can be mounted.',
        ],
      },
      {
        heading: 'The six layers of a healthy roof',
        paragraphs: [
          'From outside in, a correctly built pitched roof stacks six functions: the roofing itself (tiles, slate or metal), a breathable underlay that keeps wind and stray water out, thermal insulation sized for today\u2019s energy standards, a vapour barrier on the warm side, an airtight seal at every joint and penetration, and finally the interior finish you actually see.',
          'The vapour barrier deserves the most respect. Warm indoor air carries moisture; let it reach the cold side of the insulation and it condenses — and hidden condensation is how mould and rotten roof timber start. Every tear taped, every cable passage sealed.',
        ],
      },
      {
        heading: 'Finishing the slope: the visible layer',
        paragraphs: [
          'The classic finish is plasterboard on battens: familiar, but on a slope it means overhead jointing and sanding, and every future movement of the roof timber can telegraph a crack through the paint.',
          'A stretch ceiling takes the slope differently: profiles along the edges of each plane, membrane tensioned in between — seamless, crack-free and light. Slopes, knee walls and even the transition to a flat ceiling section can be finished in the same material, which makes small attic rooms read as one calm volume.',
        ],
      },
      {
        heading: 'Attic rooms, bathrooms and light',
        paragraphs: [
          'Attic conversions usually become bedrooms, offices or bathrooms — and under a roof, each has its wish. For bathrooms, the membrane is moisture-resistant by nature and shrugs off condensation that would stain plasterwork. For bedrooms and offices, an acoustic membrane build-up softens rain noise and echo. And where roof windows are scarce, backlit membrane panels between the rafters bring daylight-like brightness to the darkest corner of the house.',
          'Planning an attic conversion? Ask us for a quote for the finishing layer — standard, acoustic or moisture-resistant — and we will think along from the profile up.',
        ],
      },
    ],
  },
  {
    slug: 'sterrenhemel',
    title: 'A starry-sky ceiling: how it works',
    excerpt:
      'By day a sleek seamless ceiling, by night a sky full of stars. How fibre optics turn a stretch ceiling into a starry sky, which effects are possible, and what an installation involves.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 4,
    body: [
      {
        heading: 'The idea',
        paragraphs: [
          'A starry-sky ceiling hides hundreds of fibre-optic light points in a tensioned membrane. With the light source off, you see nothing but a perfectly flat designer ceiling — no visible holes, no hardware. Switch it on and the surface becomes a night sky, as subtle or as dense as you designed it.',
          'The fibres themselves carry no electricity and no heat; they only transport light from a hidden projector above the membrane. That is what makes the effect safe, silent and maintenance-friendly.',
        ],
      },
      {
        heading: 'Effects and options',
        paragraphs: [
          'The projector decides the mood: static stars, gentle twinkling, or the occasional falling star tracing across the ceiling. Light colour is a choice too — warm or cool white for realism, RGB if you want the sky to shift colour with the evening.',
          'Density and pattern are designed per project: an even scatter for a natural sky, concentrations and constellations if you want them, or star fields combined with a printed design — a night-blue gradient, clouds, a galaxy.',
        ],
      },
      {
        heading: 'Where it works best',
        paragraphs: [
          'Bedrooms and home cinemas are the classics — spaces where you lie or sit back and the ceiling becomes the view. Hotels, wellness suites and restaurants use the same technique as a signature detail. Because the base is a normal stretch ceiling, the starry section can be one zone of a larger seamless surface.',
        ],
      },
      {
        heading: 'What an installation involves',
        paragraphs: [
          'We handle the whole picture: design of the star field, preparation of the membrane with the fibres, placement of the projector where you can reach it, and the tensioned installation itself. Count two to three working days for a typical room, depending on size and the number of light points.',
          'Pricing follows the design — size, star density and effects — so every quote is custom. Tell us the room and the atmosphere you are after, and we will design a sky for it.',
        ],
      },
    ],
  },
  {
    slug: 'spanplafond-prijs',
    title: 'What does a stretch ceiling cost? An honest price guide',
    excerpt:
      'Stretch ceiling prices range from roughly €70 to €200 per m² installed, depending on the type and the room. Here is what sits behind that spread, indicative ranges per ceiling type, and how to get a firm number for your project.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        heading: 'The short answer',
        paragraphs: [
          'For a professionally installed stretch ceiling, count on roughly €70 to €200 per square metre excluding VAT, installation included. The spread is real: a plain matte white ceiling in a rectangular living room sits at the bottom of that range, while a backlit bathroom ceiling with integrated lighting sits at the top.',
          'Every figure in this guide is an indicative range, not a quote. The membrane is made to measure for your exact room, so the honest final number always comes from a free, no-obligation quote.',
        ],
      },
      {
        heading: 'Indicative ranges per ceiling type',
        paragraphs: [
          'A basic single-colour PVC or polyester ceiling is the entry point at around €70 to €90 per m² — the fast, seamless upgrade for living rooms, bedrooms and offices. A printed design adds the artwork and preparation, landing around €90 to €100 per m².',
          'An acoustic ceiling — micro-perforated membrane with absorption behind it — runs around €100 to €150 per m² depending on the build-up. A translucent, backlit ceiling with LED fields behind the membrane sits around €130 to €160 per m² including the light plane. Bathroom projects combining moisture-proof membrane with integrated lighting typically reach €150 to €200 per m².',
          'Speciality work — a starry sky, printed backlit designs, prefab elements — is designed per project and quoted per design.',
        ],
      },
      {
        heading: 'What moves the price',
        paragraphs: [
          'Room size works in your favour: the larger the surface, the lower the price per square metre, because set-up and finishing spread over more metres. Small rooms carry proportionally more of those fixed steps.',
          'Complexity is the second lever. Every corner, curve, pillar or pipe passage means extra profile work and welding time — a simple rectangle is cheaper per metre than an L-shaped landing with five spots. Finally, the finish and the integrations decide the rest: lighting lines, spots, ventilation and sensors are integrated beautifully, but each is work and material.',
        ],
      },
      {
        heading: 'What the price includes — and what it saves later',
        paragraphs: [
          'Our figures include the made-to-measure membrane welded in our Belgian production, the perimeter profiles, and professional installation — for a normal room, in a single day, without demolition or dust.',
          'The part a per-m² comparison misses: a stretch ceiling does not need repainting. A plastered ceiling wants fresh paint every few years and cracks with the building; the membrane stays taut, washable and identical for decades. Over ten years, the "expensive" ceiling is usually the cheap one.',
        ],
      },
      {
        heading: 'From estimate to firm number',
        paragraphs: [
          'Send us the room dimensions, a photo and what you have in mind — through the quote button on this page — and you get a concrete, free quote, usually the same working day. No calculator gymnastics needed: measuring and pricing precisely is our job, not yours.',
          'Are you an installer or reseller buying materials rather than a finished ceiling? Trade pricing lives in the client zone — request a partner account and you see your prices directly.',
        ],
      },
    ],
  },
  {
    slug: 'clipso-spanplafonds',
    title: 'Clipso stretch ceilings: what they are and where to get them',
    excerpt:
      'Clipso is the best-known brand of polyester fabric for stretch ceilings and walls — the acoustic fabric ceiling many architects specify by name. What Clipso-type fabric is, what it does well, and how we supply, print, confection and install it.',
    datePublished: '2026-08-07',
    dateModified: '2026-08-07',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        heading: 'What "Clipso" actually means',
        paragraphs: [
          'Clipso is a French-made polyester knit fabric for tensioned ceilings and walls — so well known that the brand name has become shorthand for the whole category of fabric stretch ceilings (the way people say Gyproc for plasterboard). Since 2022 the brand belongs to Ecophon, part of the Saint-Gobain group.',
          'The fabric installs cold: no heating of the room, no welding on site. The knit is wider than PVC — seamless up to around five metres — breathable, and available in standard, acoustic and translucent versions.',
        ],
      },
      {
        heading: 'Where fabric shines — and where PVC wins',
        paragraphs: [
          'Choose a polyester fabric ceiling when you want a deep matte, textile look, cold installation (occupied homes, heritage buildings), large seamless widths or micro-perforated acoustics. The acoustic version — the "akoestisch spandoek" or "toile tendue acoustique" architects ask for — pairs an elegant surface with serious absorption.',
          'PVC membrane wins on gloss and lacquer finishes, printed designs with backlighting, bathrooms and washability. In practice many of our projects combine both — fabric in living and office spaces, PVC where light, print or moisture leads.',
        ],
      },
      {
        heading: 'How we work with Clipso-type fabrics',
        paragraphs: [
          'As a manufacturer we keep the whole chain in-house: we stock polyester ceiling fabrics on the roll, cut and confection them to measure in our Belgian production, print on them, and combine them with our own profiles, LED lighting and acoustic build-ups.',
          'Installers and resellers buy the fabric by the roll or cut to size through our materials catalogue — with the acoustic version available off the shelf — and end customers get the finished, installed ceiling through our dealer network.',
        ],
      },
      {
        heading: 'Cleaning and care',
        paragraphs: [
          'Fabric ceilings ask little: dust them like a wall, and treat stains early with a slightly damp cloth. For PVC membranes and coated fabrics our STRETCH Cleaner does the work — see the care guide elsewhere on this blog for the full instructions.',
        ],
      },
      {
        heading: 'Getting a Clipso-type ceiling',
        paragraphs: [
          'Tell us the room and the goal — acoustic comfort, a matte designer surface, a printed wall — and we quote the made-to-measure fabric, the materials, or the full installation through the dealer in your region, usually the same working day.',
        ],
      },
    ],
  },
  {
    // Recreation of the old stretchplafond.fr traffic carrier
    // /decouvrez-les-avantages-du-plafond-tendu/ (65% of all .fr clicks) —
    // the legacy URL 301s here (redirects.mjs, French rules). Same pattern
    // as the planchetten article on .be. Prices mirror the published
    // price-guide article (€70–200/m²) — indicative only, never a quote.
    slug: 'plafond-tendu-avantages-et-inconvenients',
    title: 'Stretch ceilings: the advantages and disadvantages, honestly (2026 price guide)',
    excerpt:
      'A stretch ceiling gives you a seamless new ceiling in a day — but it is not the right answer for every room or budget. The real advantages, the honest disadvantages, and 2026 price ranges.',
    datePublished: '2026-08-22',
    dateModified: '2026-08-22',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        heading: 'What a stretch ceiling actually is',
        paragraphs: [
          'A stretch ceiling is a thin membrane — PVC film or polyester fabric — tensioned across the room and clipped into a slim perimeter profile a few centimetres below the existing ceiling. PVC is mounted with heat and cools drum-tight; polyester fabric mounts cold, without a heat gun.',
          'The old ceiling stays where it is. Cracks, cables, pipes and decades of paint layers disappear behind one perfectly flat surface, and for a normal room the whole installation takes a single day.',
        ],
      },
      {
        heading: 'The advantages',
        paragraphs: [
          'Speed and cleanliness first: no demolition, no rubble container, no plaster dust, no painting afterwards. The furniture can usually stay in the room.',
          'Then the surface itself: seamless up to roughly five metres wide, perfectly flat, and available matte, satin, glossy, translucent or printed. Lighting is where the system beats every alternative — LED lines, spots and even backlit fields integrate flush into the membrane.',
          'The practical wins: the membrane does not crack with the building, never needs repainting, is washable, and handles humid rooms like bathrooms without flaking. Acoustic versions absorb sound through micro-perforations with absorption material hidden above. And the reaction-to-fire classes are documented — our membrane ranges are tested to B-s1,d0, with a non-flammable glassfibre option at A2-s1,d0.',
          'Finally, access: the membrane is demountable. An installer can open a section for work in the plenum and re-tension it — try that with plasterboard.',
        ],
      },
      {
        heading: 'The disadvantages — the honest list',
        paragraphs: [
          'You lose a few centimetres of ceiling height: the profile needs mounting space, and integrated lighting needs a little more. In most rooms that is invisible; in a low cellar it can matter.',
          'The membrane is tough but not invincible: a sharp object pushed into it can puncture it. Small damage is repairable and a damaged panel can be replaced, but a champagne cork is a better story than a ladder corner.',
          'Quality depends on the installer. A stretch ceiling is measured and welded to the millimetre; a sloppy measurement or a cheap membrane shows. Work with a trained, certified installer and ask what membrane brand goes above your head.',
          'And the price: a stretch ceiling costs more than a coat of paint on an already-good ceiling. It competes on total cost — against plastering plus painting plus repainting every few years — not against a paint roller.',
        ],
      },
      {
        heading: 'What it costs in 2026',
        paragraphs: [
          'Professionally installed, count on roughly €70 to €200 per square metre excluding VAT, installation included. A plain single-colour ceiling sits around €70–90 per m², a printed design around €90–100, an acoustic build-up around €100–150, and backlit or bathroom projects with integrated lighting €130–200 per m².',
          'These are indicative ranges, not quotes — the membrane is made to measure for your exact room. Larger rooms come out cheaper per square metre; corners, curves and integrations add work. The full breakdown lives in our price guide, and a free quote gives you the firm number, usually the same working day.',
        ],
      },
      {
        heading: 'Stretch ceiling or plasterboard?',
        paragraphs: [
          'Plasterboard is cheaper on day one for a simple flat ceiling — if the room is empty, dust is acceptable and the finishing (jointing, sanding, priming, two coats of paint) is included in your comparison.',
          'The stretch ceiling wins on renovation speed, on seamless large surfaces, on humid rooms, on integrated lighting and acoustics, and on the years after: no cracks, no repainting, and a surface that still looks new after a decade. That is why it is the renovation standard for finished, furnished homes.',
        ],
      },
      {
        heading: 'When it is the right choice',
        paragraphs: [
          'Choose a stretch ceiling when the room is lived-in and the ceiling above it is tired; when you want lighting inside the ceiling instead of on it; when a bathroom or pool area needs a moisture-proof finish; or when an office or practice needs acoustic calm without visible panels.',
          'Doubting between systems, colours or budgets? Send us a photo and the room dimensions through the quote button — you get an honest recommendation and a free quote, without obligation.',
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
    a: 'Up to 6.4 m seamless with PVC film, and up to 5.15 m with polyester. Larger spans are covered with a near-invisible welded joint or a deliberate profile line.',
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
