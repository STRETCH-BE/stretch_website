// ============================================================================
// CONTENT — inspiration projects, blog posts and the global FAQ.
// Inspiration projects mirror the Inspiration mockup. Blog posts and the global
// FAQ are DRAFTED (evergreen, educational) and flagged in CHANGES.md for review;
// none fabricate testimonials, prices or claims beyond the brief.
// ============================================================================
import type { Locale } from '@/i18n/config';
import { blogSlugMap, marketOnlyBlogSlugs } from '@/lib/blog-slugs';

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
/** Sitemap <lastmod> for /inspiration/[slug] — bump when project entries change (F12). */
export const projectsUpdatedAt = '2026-08-08'; // placeholder purge + real photos
export const projectSlugs = projects.map((p) => p.slug);
/** Look up a project by its slug. */
export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

// ---------------------------------------------------------------------------
// Blog — drafted evergreen / educational articles (flagged for review).
// ---------------------------------------------------------------------------

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
  /** Optional related-link row. Internal hrefs are locale-relative routes;
   *  https hrefs open in a new tab. */
  links?: { label: string; href: string }[];
};

export type BlogPost = {
  /** CANONICAL slug — the key for messages overlays, OG images and redirects. */
  slug: string;
  /**
   * Per-locale URL slugs (per-market audit 2 Sep 2026, defect 1). Sourced from
   * src/lib/blog-slugs.json at module load — never set here by hand: that JSON
   * is also what redirects.mjs reads to 301 the old paths. A locale absent
   * from the map keeps `slug`. `be`/`nl` are never remapped (those URLs rank).
   */
  slugs?: Partial<Record<Locale, string>>;
  title: string;
  excerpt: string;
  datePublished: string; // ISO
  dateModified: string; // ISO
  author: string;
  readMinutes: number;
  /** Optional hero photo path from /public. Empty = branded placeholder. */
  image?: string;
  /** Locales the post exists on. Absent = every locale (the default). */
  markets?: Locale[];
  /**
   * Market-native article: written in the market language directly here (no
   * English structural source, no message overlays anywhere — by design it is
   * never translated). Must always come with a single-locale `markets`.
   */
  native?: Locale;
  /** Render the price-calculator CTA card under the article (T6). */
  calculatorCta?: boolean;
  /** Render the per-market currency note for the published EUR ranges (T2). */
  priceGuide?: boolean;
  /** Body as an ordered list of sections. */
  body: BlogSection[];
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
          'PVC films are warmed during installation so they relax, then tighten as they cool to a flawless surface. PVC is fully recyclable, removable for access to the services above, and spans up to 6.5 m seamless — the widest option.',
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
    // The public price guide: currency note per market (T2) + calculator card (T6).
    priceGuide: true,
    calculatorCta: true,
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
  {
    slug: 'spanplafond-premie-btw',
    title: 'Grants and VAT for a stretch ceiling in Belgium (2026)',
    excerpt:
      'No Belgian region subsidises a ceiling or wall finish — a stretch ceiling included. What does count is the insulation above or behind it, and the 6% VAT rate. Here is where each region stands on 22 August 2026.',
    datePublished: '2026-08-22',
    dateModified: '2026-08-22',
    author: 'STRETCH',
    readMinutes: 7,
    // Hero: add image: '/images/blog/spanplafond-premie-btw.jpg' once the photo exists.
    // Belgium-specific: the Dutch/French markets + both English domains.
    markets: ['be', 'nl', 'fr', 'en', 'uk'],
    body: [
      {
        heading: 'The short answer',
        paragraphs: [
          'A stretch ceiling on its own does not qualify for a renovation grant in any of Belgium\'s three regions. Flanders scrapped its interior-renovation category (ceilings, interior walls, floors) on 1 July 2025 and explicitly lists plastering on walls and ceilings among the non-eligible works; Wallonia and Brussels only ever funded energy measures.',
          'Two things do count. First, the insulation you tackle together with the ceiling — attic floor, roof, the inside of an exterior wall or a cellar ceiling. Second, the federal 6% VAT rate on the installed stretch ceiling itself, in a dwelling that is at least ten years old. For most stretch-ceiling projects that VAT rate is the only advantage, and by far the biggest one.',
          'All three regions rewrote their rules in 2026. This article reflects the situation on 22 August 2026; always check your region\'s official simulator before you order.',
        ],
        links: [
          { label: 'Premiezoeker.be (all Belgian schemes)', href: 'https://www.premiezoeker.be' },
        ],
      },
      {
        heading: 'Flanders: Mijn VerbouwPremie only for lower incomes',
        paragraphs: [
          'Since 1 March 2026, owner-occupiers in income categories 1 and 2 only qualify for a heat-pump or heat-pump-boiler premium. For roof, exterior wall, floor, windows and doors the premium continues for categories 3 and 4. Private landlords fall into category 1, and non-residential buildings (offices, hospitality, schools) no longer get Mijn VerbouwPremie at all.',
          'Roughly: a single person with a taxable income up to €43,240 or a couple up to €60,520 (plus €4,420 per dependant) is in category 3 or 4. Above that — or if you fully own a second home or building plot — you are in category 1.',
        ],
        bullets: [
          'Roof and attic floor: new insulation with Rd ≥ 4.5 m²K/W placed by a contractor. Category 4: 50% of the invoice excl. VAT, maximum €5,750. Category 3: 35%, maximum €4,025. Roof renovation works only count if you insulate at the same time.',
          'Exterior wall, including from the inside: Rd ≥ 2 m²K/W for interior insulation, placed by a contractor with a certificate of competence or under an architect\'s supervision. Category 4: 50%, maximum €5,000. Category 3: 35%, maximum €3,500.',
          'Floor: insulating a cellar ceiling or crawl space also falls under this category.',
          'General: dwelling connected to the grid before 1 January 2006, invoice of at least €1,000 excl. VAT and no older than two years, one premium per category every five years. Apply via Mijn VerbouwLoket after the final invoice.',
          'Never eligible: the stretch ceiling itself, plaster or plasterboard work, painting, do-it-yourself.',
          'If you no longer qualify for the premium you may still get Mijn VerbouwLening, a loan of up to €60,000 at 0% for category 4, 0.5% for category 3 and 1.5% for category 2 (category 1 is excluded). It covers insulation and renovation of roof, walls and floors, glazing and heat pumps — not the ceiling finish. The EPC label premium has been discontinued.',
        ],
        links: [
          { label: 'Mijn VerbouwPremie (official)', href: 'https://www.vlaanderen.be/bouwen-wonen-en-energie/bouwen-en-verbouwen/premies-voor-renovatie/mijn-verbouwpremie' },
          { label: 'Simulator 2026', href: 'https://apps.energiesparen.be/simulator-mijnverbouwpremie' },
        ],
      },
      {
        heading: 'Wallonia: Primes Habitation until 30 September 2026, loans afterwards',
        paragraphs: [
          'Since 14 February 2025 Wallonia runs a temporary regime that merged its energy and renovation grants into Primes Habitation. Base amounts were cut by roughly 60% and a housing audit is mandatory for everything except roof and attic insulation. Every application, final invoice included, must be filed by 30 September 2026.',
        ],
        bullets: [
          'Roof insulation: base €20/m² (€26 with bio-based insulation), multiplied by an income coefficient from 2 (R4) to 6 (R1) — up to €156/m². Cap: 70% of the invoice incl. VAT for R1 and R2, 50% for R3 and R4. Required thermal resistance: at least R = 5 m²K/W.',
          'Wall insulation (cavity, inside or outside): base €8.80/m² (€12 bio-based), up to €72/m²; audit mandatory.',
          'Conditions: dwelling at least 15 years old, works by a contractor registered with the Crossroads Bank for Enterprises, reference income up to €122,800.',
          'Walloon residents only: a 30% tax reduction on roof insulation (R ≥ 2.5), capped at €4,120 for 2026 expenses, entered under code 3317 — cumulative with the premium and with 6% VAT.',
          'From 1 October 2026 direct grants disappear. They are replaced by the Rénopack — an interest-free loan of which part is waived (up to 50% for income category C1, 40% for C2, 15% for C3) — and the Rénoprêt at a preferential rate for C4, landlords and co-ownerships. Support will then only be available for homes with EPB label G or F reaching at least D, or label E reaching at least C, calculated on a global quote instead of per item; the ceiling rises to €75,000 for a single-family house. The execution decrees still have to fix the details.',
        ],
        links: [
          { label: 'Walloon government announcement', href: 'https://www.wallonie.be/fr/actualites/renovation-energetique-les-grandes-lignes-du-futur-regime-de-soutien-sont-connues' },
          { label: 'Roof insulation tax reduction (FPS Finance)', href: 'https://fin.belgium.be/fr/particuliers/avantages-fiscaux/isolation-du-toit' },
        ],
      },
      {
        heading: 'Brussels: no grants for invoices dated 2025 or 2026',
        paragraphs: [
          'Brussels\' Renolution grants have been suspended since early 2025. No application can be filed for final invoices dated 2025 or 2026, and in February 2026 the new regional government confirmed the grants will not return in their current form. They are to be replaced by interest-free loans, start date unknown. The €56 million released in the 2026 budget only pays the backlog of 2024 files.',
        ],
        bullets: [
          'What remains: the ECORENO loan from the Brussels Housing Fund (2.5% or 3.5% depending on income, reopened on 1 January 2026), municipal grants in a handful of communes, and of course the 6% VAT rate.',
          'For reference if the scheme ever returns: the last scale paid €35, €55 or €75 per m² of roof insulation depending on income category, and interior wall insulation required R ≥ 2 m²K/W.',
          'New since 1 January 2026: every rental in Brussels needs an EPB certificate with at least label E — one more reason landlords are insulating now.',
        ],
        links: [
          { label: 'Renolution.brussels', href: 'https://renolution.brussels' },
        ],
      },
      {
        heading: '6% VAT: the advantage that does apply to a stretch ceiling',
        paragraphs: [
          'A stretch ceiling supplied and installed by a contractor is work on immovable property. In a dwelling first occupied at least ten years ago it carries 6% VAT instead of 21% — on the materials and on the labour. That is 15 percentage points off the whole invoice, with no file to submit.',
        ],
        bullets: [
          'Conditions: the dwelling has been in use for at least ten calendar years on the date of the first invoice, is used more than half privately after the works, and the invoice is addressed to the end user — owner or tenant. Materials you buy to fit yourself stay at 21%.',
          'Since 2022 a standard statement on the invoice replaces the old certificate; you have one month to object if the conditions are not met.',
          'Lighting: loose fittings and lamps are excluded from the reduced rate unless they are built into a ceiling. Spots integrated in the stretch ceiling therefore follow the 6%.',
          'Walls: wall covering cut to the size of the surface to be covered is treated as work on immovable property. A made-to-measure stretch wall system qualifies.',
          'Not applicable: offices, hospitality and other non-residential buildings (21%), new builds under ten years old, and do-it-yourself materials.',
        ],
        links: [
          { label: 'Renovation VAT rate (FPS Finance)', href: 'https://fin.belgium.be/nl/particulieren/woning/bouwen-verbouwen/verbouwen/verbouwen-btw-tarief' },
        ],
      },
      {
        heading: 'How to combine a grant with a stretch ceiling',
        paragraphs: [
          'Have the insulation and the stretch ceiling invoiced as two separate items. The insulation item must be at least €1,000 excl. VAT, carried out by the contractor and accompanied by the contractor\'s certificate; the stretch-ceiling item stands on its own. Both carry 6% VAT if the dwelling is old enough.',
          'Plan the sequence: insulate first, with the vapour barrier your insulation contractor specifies, then the stretch ceiling. There is no drying time, so the ceiling can go in the day after the insulation. In Flanders you apply via Mijn VerbouwLoket as soon as you have the final invoice for the insulation; in Wallonia you meet the 30 September 2026 deadline.',
          'Unsure about your income category, or what your municipality adds on top? The official simulators and Premiezoeker.be give you an answer in minutes. For a fixed price on the ceiling itself, a STRETCH installer in your region measures the room free of charge.',
        ],
        links: [
          { label: 'Finishing a ceiling after insulation', href: '/blog/plafond-afwerken-na-isolatie' },
          { label: 'Price guide', href: '/blog/spanplafond-prijs' },
          { label: 'Find an installer', href: '/dealers' },
        ],
      },
    ],
  },
  {
    slug: 'plafond-afwerken-na-isolatie',
    title: 'Finishing a ceiling after insulation: plasterboard or stretch ceiling?',
    excerpt:
      'After roof, attic-floor or interior wall insulation you need a new ceiling or wall. Plaster, plasterboard or a stretch ceiling: here are the differences in time, dust, access to the insulation and VAT — and how to keep the grant for the insulation safe.',
    datePublished: '2026-08-22',
    dateModified: '2026-08-22',
    author: 'STRETCH',
    readMinutes: 6,
    // Hero: add image: '/images/blog/plafond-afwerken-na-isolatie.jpg' once the photo exists.
    body: [
      {
        heading: 'Why the finish after insulation is different',
        paragraphs: [
          'Insulate a pitched roof from the inside, a flat roof from below or the inside of an exterior wall, and you end up with an open build-up: insulation, a vapour barrier and a timber or metal frame. That needs a finish that looks crisp, leaves the vapour barrier intact and keeps the services reachable.',
          'The finish decides more than looks. It decides how long the job takes, how much dust and drying time you accept, whether you can still reach the insulation and pipes later, and how the lighting is built in. It also decides which part of the invoice is eligible for a grant: the insulation is, the finish never is.',
        ],
      },
      {
        heading: 'Option 1: plasterboard, filler and paint',
        paragraphs: [
          'The classic route: plasterboard on the frame, joints and screw heads filled, sanded, primed and painted twice. Solid and available everywhere, but count on four to seven working days with drying times, fine dust throughout the house and a fixed construction: anyone who later needs to reach the insulation or the vapour barrier has to break the ceiling open.',
          'On sloping ceilings and dormers the joints and junctions are the weak point too: settlement and temperature swings show up as hairline cracks in the seams.',
        ],
      },
      {
        heading: 'Option 2: a stretch ceiling as the finish',
        paragraphs: [
          'A stretch ceiling is tensioned into a slim perimeter profile a few centimetres below the new insulation layer. Installation usually takes one day, with no dust, no drying time and no need to empty the room. The membrane is seamless up to 5.15 m (polyester) or 6.5 m (PVC) and follows sloping planes and dormers.',
        ],
        bullets: [
          'Access stays: a PVC membrane can be released from the profile and refitted, or you add an invisible inspection hatch. Handy for a leak check, extra cabling or a later change to the insulation.',
          'Lighting is part of the system: spots, LED lines or a 48 V track are built into the ceiling — and so follow the 6% VAT rate in a dwelling older than ten years.',
          'Acoustics: a micro-perforated membrane with an absorber above turns a freshly insulated attic room into a quiet bedroom or office straight away.',
          'Humid rooms: PVC is unaffected by the humidity of a bathroom under the roof.',
        ],
        links: [
          { label: 'Inspection hatch', href: '/products/inspection-hatch' },
          { label: 'Acoustic stretch system', href: '/products/acoustic-stretch-system' },
          { label: 'Stretch ceilings under a sloping roof', href: '/blog/schuin-dak' },
        ],
      },
      {
        heading: 'Vapour barrier and cavity: the technical agreements',
        paragraphs: [
          'A stretch ceiling is a finish, not a vapour barrier. The vapour barrier stays on the warm side of the insulation, continuous and taped, exactly as the insulation contractor specifies — in Flanders it is even a grant condition when a pitched roof is insulated from the inside. Never leave it out because a membrane is going underneath anyway.',
          'Between insulation and membrane there is a cavity of a few centimetres. That is where pipes, cables and the recessed boxes for the spots go. Heavy items such as a ceiling fan or a large fitting hang from the structure above, not from the membrane. Agree the profile height and the spot positions before the insulation contractor finishes, so nobody has to come back.',
          'For interior wall insulation the same applies to a stretch wall: insulation and vapour barrier first, the wall system over it, with frames for sockets and switches.',
        ],
        links: [
          { label: 'Stretch wall systems', href: '/applications/walls' },
        ],
      },
      {
        heading: 'How to keep the grant for the insulation',
        paragraphs: [
          'In Flanders an owner-occupier in income category 3 or 4 gets a Mijn VerbouwPremie for roof or attic-floor insulation (Rd ≥ 4.5) and for insulation on the inside of an exterior wall (Rd ≥ 2, by a certified contractor or under an architect\'s supervision). In Wallonia the Primes Habitation for roof and wall insulation run until 30 September 2026. In Brussels there are no regional grants in 2026.',
        ],
        bullets: [
          'Ask for two separate items on the quote and the invoice: insulation (with the contractor\'s certificate, at least €1,000 excl. VAT) and ceiling finish.',
          'The finish is never eligible — plaster and plasterboard included — so a mixed invoice only makes the file harder.',
          'Both items get 6% VAT if the dwelling has been in use for at least ten years and the contractor supplies and installs.',
          'File the grant after the final invoice for the insulation; in Flanders via Mijn VerbouwLoket, within two years.',
        ],
        links: [
          { label: 'Grants and VAT for a stretch ceiling in Belgium', href: '/blog/spanplafond-premie-btw' },
        ],
      },
      {
        heading: 'What it costs and how to plan it',
        paragraphs: [
          'Count on roughly €70 to €200 per m² excl. VAT, installed, for a stretch ceiling depending on type and lighting; a plasterboard ceiling with filling and painting usually lands between €35 and €70 per m² but takes a week on site. The gap narrows as soon as you count the spots, the acoustics and the lost days.',
          'A practical schedule: days one and two insulation and vapour barrier, day three the stretch ceiling, the lights on that same evening. A STRETCH installer in your region measures the room free of charge and matches the profiles to the insulation contractor\'s frame.',
        ],
        links: [
          { label: 'Price guide', href: '/blog/spanplafond-prijs' },
          { label: 'Find an installer', href: '/dealers' },
        ],
      },
    ],
  },
  {
    slug: 'plafond-renoveren-opties',
    title: 'Renovating a ceiling: the four options compared (2026)',
    excerpt:
      'Re-plaster, plasterboard, timber slats or a stretch ceiling? What each option costs per m², how long the job takes, how much dust you accept and what the VAT rate does — so you choose on the basis of your ceiling, not out of habit.',
    datePublished: '2026-08-22',
    dateModified: '2026-08-22',
    author: 'STRETCH',
    readMinutes: 6,
    // Hero: add image: '/images/blog/plafond-renoveren-opties.jpg' once the photo exists.
    body: [
      {
        heading: 'The short answer',
        paragraphs: [
          'For an old ceiling with cracks, stains or a dated finish there are four realistic routes: re-plastering (or filling and painting), a new plasterboard ceiling, timber slats or panels, and a stretch ceiling. Per square metre they sit closer together than most people think; the difference is in the time on site, the dust, the access to what is above and the lifespan.',
          'Rule of thumb: if the substrate is sound and flat, repainting or filling is cheapest. If the ceiling is cracked, uneven, full of pipes, or you want to add lighting and acoustics, a stretch ceiling wins on total cost and time. Plasterboard sits in between; slats are a style choice.',
        ],
      },
      {
        heading: 'Option 1: re-plastering, filling and painting',
        paragraphs: [
          'Small cracks, a yellowed paint layer or a slightly uneven ceiling: filling, sanding and two coats of paint will do, or a new plaster skim for larger damage. Indicatively €10 to €20 per m² for painting and €25 to €45 per m² for re-plastering, excl. VAT — at 6% VAT in a dwelling older than ten years.',
          'Downsides: the room must be emptied and covered, fine dust gets everywhere, drying times dictate the schedule and a structural crack usually comes back. Pipes or an uneven concrete slab stay visible.',
        ],
        links: [
          { label: 'Repairing cracks in a ceiling', href: '/blog/scheuren-in-plafond-herstellen' },
        ],
      },
      {
        heading: 'Option 2: a new plasterboard ceiling',
        paragraphs: [
          'A suspended plasterboard ceiling on a metal frame hides pipes and unevenness and allows spots. Indicatively €35 to €70 per m² including filling and painting, excl. VAT. It is a fixed construction: four to seven working days with drying times, and later access to the services only by demolition.',
          'The result is classic and solid, but the joints remain the weak point — in large spans and with temperature swings, hairline cracks in the seams after a few years are common.',
        ],
      },
      {
        heading: 'Option 3: timber slats or panels',
        paragraphs: [
          'Slats add warmth and character and are relatively quick to fit: indicatively €40 to €90 per m² excl. VAT depending on timber and finish. They do need a frame, leave less freedom for lighting and require maintenance. If you already have a dated slatted ceiling, it is often smarter to hang a stretch ceiling underneath it than to tear it down.',
        ],
        links: [
          { label: 'Renovating a wooden slatted ceiling', href: '/blog/houten-planchetten-plafond-renoveren-of-vernieuwen' },
        ],
      },
      {
        heading: 'Option 4: a stretch ceiling',
        paragraphs: [
          'A PVC or polyester membrane is tensioned into a slim profile along the walls, a few centimetres below the existing ceiling. Everything above it — cracks, slats, pipes, an uneven concrete slab — disappears behind one seamless plane. Installed in one day, without dust, without drying time and with the furniture still in the room.',
        ],
        bullets: [
          'Price: roughly €70 to €200 per m² excl. VAT, installed; a plain matte white ceiling sits at the bottom, backlit or printed at the top.',
          'Built-in lighting, acoustic absorption, a starry sky or a print all live in the same system.',
          'Access: PVC is removable and can be fitted with an invisible inspection hatch.',
          'Lifespan: decades without repainting; washable; unaffected by humidity in bathrooms and kitchens.',
          'VAT: 6% on materials and installation in a dwelling older than ten years, built-in spots included.',
        ],
        links: [
          { label: 'Price guide', href: '/blog/spanplafond-prijs' },
          { label: 'PVC stretch ceiling', href: '/products/pvc-stretch-ceiling' },
          { label: 'Polyester stretch ceiling', href: '/products/polyester-stretch-ceiling' },
        ],
      },
      {
        heading: 'Comparison at a glance',
        paragraphs: [],
        bullets: [
          'Cost per m² (excl. VAT, indicative): painting €10–20 · re-plastering €25–45 · plasterboard €35–70 · slats €40–90 · stretch ceiling €70–200.',
          'Time on site for a 30 m² living room: painting 1–2 days · re-plastering 3–5 days · plasterboard 4–7 days · slats 2–3 days · stretch ceiling 1 day.',
          'Dust and drying time: plaster and plasterboard a lot · slats little · stretch ceiling none.',
          'Hides pipes and unevenness: plaster no · plasterboard yes · slats yes · stretch ceiling yes.',
          'Access afterwards: plaster and plasterboard no · slats limited · stretch ceiling yes (PVC).',
          'Lighting and acoustics built in: plasterboard partly · stretch ceiling fully.',
          'Grants: no finish is eligible anywhere in Belgium; only the insulation above it. VAT: 6% for every option if a contractor supplies and installs in a dwelling older than ten years.',
        ],
      },
      {
        heading: 'Which option for which ceiling?',
        paragraphs: [
          'Sound, flat ceiling with a tired paint layer: paint. Cracks in an old plaster ceiling: find the cause first, then fill — or, if they keep coming back, span over it. Slats you are tired of: span over them instead of demolishing. Pipes, uneven concrete or a renovation with new lighting and acoustics: stretch ceiling. Plasterboard still makes sense where a heavy appliance has to hang from the ceiling or where you deliberately want a classic, fixed construction.',
          'If you are insulating in the same phase, choose the finish only after the insulation; the grant attaches to the insulation, not to the ceiling. For a fixed price, a STRETCH installer from your region measures the room free of charge.',
        ],
        links: [
          { label: 'Finishing a ceiling after insulation', href: '/blog/plafond-afwerken-na-isolatie' },
          { label: 'Grants and VAT in Belgium', href: '/blog/spanplafond-premie-btw' },
          { label: 'Find an installer', href: '/dealers' },
        ],
      },
    ],
  },
  // ============================================================
  // MARKET-NATIVE ARTICLES (per-market audit 2 Sep 2026, T4b) — written
  // in the market language for that market only (`native` + single-locale
  // `markets`). Deliberately NOT translated: no blogPosts.posts overlay
  // exists for them in any message file, and none may be added — the
  // point is a market-native content programme, not a 14-way translation.
  // ============================================================
  {
    slug: 'spanndecke-kosten-pro-m2',
    native: 'de',
    markets: ['de'],
    calculatorCta: true,
    title: "Spanndecke: Kosten pro m² – was kostet eine Spanndecke wirklich?",
    excerpt: "Eine montierte Spanndecke kostet in Deutschland etwa 70 bis 200 € pro m² zzgl. MwSt. Hier finden Sie die Richtwerte je Deckentyp, die Preistreiber und den Kostenrechner, der Ihr Projekt in 30 Sekunden einordnet.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        "heading": "Die kurze Antwort – und der Rechner dazu",
        "paragraphs": [
          "Eine professionell montierte Spanndecke kostet in Deutschland etwa 70 bis 200 € pro Quadratmeter, zuzüglich Mehrwertsteuer und inklusive Montage. Die Spanne ist keine Ausflucht, sondern die ehrliche Bandbreite: Eine unifarbene, matte Decke im rechteckigen Wohnzimmer liegt am unteren Ende, eine Baddecke mit integrierter Beleuchtung am oberen.",
          "Wer eine konkretere Zahl für den eigenen Raum will, muss nicht warten: Unser Kostenrechner macht aus Quadratmetern und Deckentyp in rund 30 Sekunden die veröffentlichte Richtspanne. Fläche eingeben, Deckentyp wählen, fertig – Sie sehen sofort, in welcher Größenordnung Ihr Projekt liegt, noch bevor Sie mit uns oder einem Fachbetrieb sprechen.",
          "Wichtig ist die Einordnung: Jeder Wert in diesem Artikel ist ein Richtwert, kein Angebot. Die Membran wird für Ihren Raum nach Maß gefertigt, und erst ein kostenloses Angebot – für Sie unverbindlich, meist noch am selben Werktag – nennt die feste Zahl. Der Rechner ist der erste Schritt, das Angebot der zweite."
        ],
        "links": [
          {
            "label": "Zum Spanndecken-Kostenrechner",
            "href": "/price-calculator"
          },
          {
            "label": "Häufige Fragen zu Spanndecken",
            "href": "/faq"
          }
        ]
      },
      {
        "heading": "Kosten pro m² nach Deckentyp: die Richtwerte",
        "paragraphs": [
          "Der Deckentyp ist der größte Hebel beim Quadratmeterpreis. Die Richtwerte in der Liste unten sind unsere veröffentlichten Spannen für Deutschland – montiert, zzgl. MwSt., für einen normal geschnittenen Raum – und exakt die Werte, mit denen auch der Kostenrechner arbeitet.",
          "Zwischen PVC-Folie und Polyester gibt es beim Einstiegspreis keinen nennenswerten Unterschied – die Wahl fällt über Optik und Montage. Polyester wird kalt gespannt, ist sehr matt und bis 5,15 m fugenlos; PVC-Folie wird warm montiert, ist in Matt, Satin und Glanz erhältlich und bleibt bis 6,5 m ohne Naht. Beide Oberflächen sind abwaschbar und feuchtigkeitsbeständig, die PVC-Folie lässt sich zudem für den Zugriff auf die Technik darüber ausklipsen und wieder spannen.",
          "Wer die Akustik gleich mitplant, spart sich die zweite Baustelle: Die Akustik-Spanndecke ist optisch von der Standardausführung nicht zu unterscheiden und macht nachträglich aufgesetzte Absorber an Wand oder Decke überflüssig."
        ],
        "bullets": [
          "Unifarbene Basisdecke (PVC-Folie oder Polyester): 70–90 € pro m² – das fugenlose Upgrade für Wohnzimmer, Schlafzimmer und Büro.",
          "Bedrucktes Design: 90–100 € pro m² – Motiv und Druckvorbereitung inklusive.",
          "Akustik-Spanndecke: 100–150 € pro m² – mikroperforierte Membran mit Absorber dahinter, bis Schallabsorptionsklasse A.",
          "Transluzente Lichtdecke (hinterleuchtet): 130–160 € pro m² – inklusive LED-Lichtfläche hinter der Folie.",
          "Bad mit integrierter Beleuchtung: 150–200 € pro m² – feuchtraumtaugliche Folie plus Lichtintegration.",
          "Sonderanfertigungen wie Sternenhimmel oder Fertigmodule: pro Design kalkuliert, ohne festen m²-Preis."
        ],
        "links": [
          {
            "label": "PVC-Folien-Spanndecke",
            "href": "/products/pvc-stretch-ceiling"
          },
          {
            "label": "Polyester-Spanndecke",
            "href": "/products/polyester-stretch-ceiling"
          },
          {
            "label": "Akustisches Spannsystem",
            "href": "/products/acoustic-stretch-system"
          }
        ]
      },
      {
        "heading": "Was den Quadratmeterpreis nach oben oder unten bewegt",
        "paragraphs": [
          "Die Fläche arbeitet für Sie. Je größer der Raum, desto niedriger der Preis pro m², weil sich Aufmaß, Profilmontage und Abschlussarbeiten auf mehr Quadratmeter verteilen. Bei einem kleinen Gäste-WC schlagen diese Fixkosten anteilig deutlich stärker zu Buche als bei einem 40-m²-Wohnbereich – rechnen Sie bei kleinen Flächen deshalb eher mit dem oberen Ende der Spanne.",
          "Die Raumgeometrie ist der zweite Hebel. Jede Ecke, jede Rundung, jede Säule und jede Rohrdurchführung bedeutet zusätzliche Profil- und Schweißarbeit. Ein schlichtes Rechteck ist pro Quadratmeter günstiger als ein L-förmiger Flur mit Dachschräge und fünf Spots. Genau diese Details kann kein Online-Rechner kennen – sie sind der Grund, warum die Richtspanne eine Spanne bleibt.",
          "Der dritte Hebel sind die Integrationen. Lichtlinien, Einbauspots, Lüftungsauslässe, Sensoren und Revisionsklappen lassen sich sauber in die Membran einbinden, aber jedes Element bringt Material und Arbeitszeit mit. Eine Lichtdecke oder ein bedrucktes Motiv wählen Sie deshalb bewusst dort, wo es wirkt – im Bad, im Heimkino, über dem Empfangstresen – statt flächendeckend."
        ],
        "links": [
          {
            "label": "Lichtdecke und Lichtintegration",
            "href": "/products/light-print-stretch-ceiling"
          },
          {
            "label": "Individuell bedruckte Decke",
            "href": "/products/custom-print"
          },
          {
            "label": "Sternenhimmel-Decke",
            "href": "/products/starry-sky"
          }
        ]
      },
      {
        "heading": "Was im Preis enthalten ist – und was er langfristig spart",
        "paragraphs": [
          "Die Richtwerte sind Komplettpreise für die fertige Decke, keine Materialpreise. Enthalten sind die nach Maß gefertigte Membran – in unserer eigenen Produktion vermessen, zugeschnitten und verschweißt –, die umlaufenden Profile, in die sie eingeklipst wird, und die Montage durch einen zertifizierten Fachbetrieb.",
          "Für die Baustelle heißt das: Ein Zwei-Personen-Team schafft rund 50 m² pro Tag; abgerissen, geschliffen oder gestrichen wird nicht. Kalt montiertes Polyester braucht keine Trockenzeit, PVC-Folie wird bei der Montage erwärmt und noch am selben Tag gespannt. Rohre, Kabel, Risse und die alte Decke verschwinden dahinter – Sie verlieren dabei nur wenige Zentimeter Raumhöhe. Wo Sie später an die Technik müssen, wird eine Revisionsklappe gleich mit eingeplant. Die Brandklasse B-s1,d0 nach EN 13501-1 dokumentieren wir auf Anfrage.",
          "Was ein reiner m²-Vergleich mit Putz und Farbe übersieht: Eine Spanndecke muss nie neu gestrichen werden. Sie reißt nicht, blättert nicht ab, vergilbt nicht und lässt sich abwaschen – bei einer Lebensdauer von über 25 Jahren. Die verputzte Decke verlangt immer wieder einen Maler und bekommt mit jeder Setzung des Gebäudes neue Risse. Über die Nutzungsdauer gerechnet spart die Spanndecke jeden dieser Malerdurchgänge – und die vermeintlich „teure“ Decke ist am Ende oft die günstigere."
        ],
        "links": [
          {
            "label": "Spanndecken im Bad",
            "href": "/applications/bathroom-kitchen"
          },
          {
            "label": "Brandschutz der PVC-Folie",
            "href": "/technical/pvc/fire-safety"
          },
          {
            "label": "Revisionsklappe",
            "href": "/products/inspection-hatch"
          }
        ]
      },
      {
        "heading": "Vom Richtwert zum verbindlichen Angebot",
        "paragraphs": [
          "Ein Beispiel macht die Logik greifbar: Für ein 20-m²-Wohnzimmer mit unifarbener Decke zeigt der Kostenrechner eine Spanne von rund 1.400 bis 1.800 €. Für ein 8-m²-Bad mit integrierter Beleuchtung liegt die Richtspanne bei etwa 1.200 bis 1.600 € – weniger Fläche, aber der aufwendigere Deckentyp. Beides sind Größenordnungen, mit denen sich planen lässt – aber noch kein Preis, den Sie unterschreiben würden.",
          "Für die feste Zahl brauchen wir drei Dinge: die Raummaße (Länge × Breite reichen für den Anfang), ein Foto der bestehenden Decke und Ihre Vorstellung – Farbe, Finish, gewünschte Beleuchtung. Damit erhalten Sie ein konkretes Angebot – kostenlos, unverbindlich und meist noch am selben Werktag. Präzise messen und kalkulieren ist unsere Aufgabe, nicht Ihre.",
          "Montiert wird über unser Netz zertifizierter Fachbetriebe – Monteure, die bei uns geschult wurden und beide Systeme beherrschen, kalt gespanntes Polyester wie warm montierte PVC-Folie. Ob Berlin, Hamburg, München oder Köln: Über die Seite Ihrer Stadt in unserem Händlernetz stellen Sie Ihre Anfrage – wir vermitteln die Montage an einen zertifizierten Fachbetrieb aus unserem Netz, und wo es noch keinen gibt, montieren wir vorerst direkt aus unserer eigenen Produktion. In beiden Fällen wird der Raum vor Ort aufgemessen, und aus der Richtspanne wird ein festes Angebot."
        ],
        "links": [
          {
            "label": "Händler in Ihrer Nähe finden",
            "href": "/dealers"
          },
          {
            "label": "Spanndecken in Berlin",
            "href": "/dealers/berlin"
          },
          {
            "label": "Spanndecken in München",
            "href": "/dealers/muenchen"
          }
        ]
      },
      {
        "heading": "Jetzt rechnen – dann anfragen",
        "paragraphs": [
          "Die schnellste Antwort auf „Was kostet eine Spanndecke?“ ist Ihre eigene: Öffnen Sie den Kostenrechner, geben Sie die Deckenfläche ein, wählen Sie den Deckentyp und lesen Sie die Richtspanne ab. Das dauert eine halbe Minute und macht jedes Gespräch danach konkreter – mit uns wie mit dem Fachbetrieb vor Ort.",
          "Im zweiten Schritt fordern Sie Ihr kostenloses Angebot an – mit Maßen, Foto und Wunschliste. Zurück kommt ein fester Preis für Ihren Raum statt einer Spanne, in der Regel noch am selben Werktag – und Sie entscheiden ohne jede Verpflichtung.",
          "Sie sind Monteur oder Fachbetrieb und kaufen Membranen statt fertiger Decken? Dann gelten für Sie die Händlerpreise im Partnerportal – beantragen Sie ein Partnerkonto, und Sie sehen Ihre Preise direkt."
        ],
        "links": [
          {
            "label": "Kosten jetzt berechnen",
            "href": "/price-calculator"
          },
          {
            "label": "Kostenloses Angebot anfordern",
            "href": "/contact"
          },
          {
            "label": "Partner werden",
            "href": "/partners"
          }
        ]
      }
    ],
  },
  {
    slug: 'spanndecke-oder-abgehaengte-decke',
    native: 'de',
    markets: ['de'],
    calculatorCta: true,
    title: "Spanndecke oder abgehängte Decke aus Gipskarton? Der Vergleich",
    excerpt: "Spanndecke oder Trockenbaudecke aus Gipskarton? Wir vergleichen Bauzeit, Staub, Optik, Zugang zur Technik, Akustik, Feuchträume und Kosten – mit Richtpreisen, damit Sie die richtige Decke für Ihr Projekt wählen.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        "heading": "Worum es beim Vergleich wirklich geht",
        "paragraphs": [
          "Wer eine alte, rissige oder schlicht unschöne Decke loswerden will, landet fast immer bei zwei Optionen: einer abgehängten Decke aus Gipskarton – im Handwerk kurz „Trockenbau“ genannt – oder einer Spanndecke. Beide verbergen, was darüber liegt: Risse, Kabel, Rohre, die alte Holzdecke. Beide schaffen eine neue, ebene Fläche unter der Rohdecke. Und beide kosten ein paar Zentimeter Raumhöhe.",
          "Der Unterschied liegt im Weg dorthin. Trockenbau ist ein Bauprozess mit Unterkonstruktion, Beplankung, Spachteln, Schleifen und Streichen. Eine Spanndecke ist eine passgenau geschweißte Membran, die in ein umlaufendes Profil gespannt wird – fertig montiert, ohne Nacharbeit. Als Hersteller von Spanndecken stehen wir natürlich nicht neutral daneben. Trotzdem ist dieser Vergleich ehrlich gemeint: Es gibt Situationen, in denen Gipskarton die bessere Wahl ist, und wir nennen sie."
        ],
        "links": [
          {
            "label": "Was ist eine Spanndecke?",
            "href": "/blog/what-is-a-stretch-ceiling"
          },
          {
            "label": "Decke renovieren: die vier Optionen im Vergleich",
            "href": "/blog/plafond-renoveren-opties"
          }
        ]
      },
      {
        "heading": "Bauzeit und Staub: ein Tag oder mehrere Tage",
        "paragraphs": [
          "Bei der Bauzeit ist der Unterschied am deutlichsten. Eine abgehängte Gipskartondecke braucht mehrere Tage: Unterkonstruktion setzen, Platten schrauben, Fugen und Schraubenköpfe spachteln, trocknen lassen, schleifen, oft ein zweites Mal spachteln, grundieren, zweimal streichen. Zwischen den Schritten liegen Trocknungszeiten, die sich nicht abkürzen lassen. Der Raum ist in dieser Zeit Baustelle – Möbel raus oder abgedeckt, Schleifstaub in jeder Ritze.",
          "Eine Spanndecke wird in einem normalen Raum an einem Tag montiert. Ein Zweierteam schafft rund 50 m² pro Tag: Profil an die Wand, Membran einklinken und spannen, Spots und Anschlüsse setzen. Es wird nichts abgerissen, nichts gespachtelt, nichts gestrichen. Die Möbel bleiben im Raum, abends wird kurz gesaugt, und das Wohnzimmer ist wieder Wohnzimmer.",
          "Zwei Details, die in der Praxis zählen: Die Polyester-Spanndecke wird kalt montiert und braucht keinerlei Trocknungszeit. Die PVC-Folie wird bei der Montage erwärmt – auch das ist am selben Tag erledigt, ohne Staub und ohne Farbgeruch."
        ],
        "links": [
          {
            "label": "Polyester-Spanndecke",
            "href": "/products/polyester-stretch-ceiling"
          },
          {
            "label": "PVC-Folien-Spanndecke",
            "href": "/products/pvc-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Optik: gespachtelt und gestrichen oder fugenlos gespannt",
        "paragraphs": [
          "Eine gut gemachte Trockenbaudecke sieht nach dem Streichen aus wie eine verputzte Decke – und genau das ist ihre Stärke, wenn Sie diese klassische Optik wollen. Sie lässt sich in jeder Farbe streichen, abgestuft bauen, mit Vouten und Höhenversätzen gestalten. Die Kehrseite: Jede Fuge und jeder Schraubenkopf müssen perfekt verspachtelt sein, sonst zeichnen sie sich im Streiflicht ab. Und mit dem Gebäude arbeitet auch die Decke – feine Risse an den Plattenstößen sind nach ein paar Jahren keine Seltenheit.",
          "Eine Spanndecke ist eine einzige, fugenlose Fläche: bei Polyester bis 5,15 m Breite, bei PVC-Folie bis 6,5 m. Die sehr matte Polyestermembran sieht aus wie eine frisch gespachtelte, matt gestrichene Decke – nur ohne Risse; PVC-Folie gibt es zusätzlich in Satin und Hochglanz, was kleine Räume optisch höher erscheinen lässt. Die Oberfläche reißt nicht, blättert nicht ab, vergilbt nicht und muss nie neu gestrichen werden.",
          "Dazu kommen Gestaltungsmöglichkeiten, die Gipskarton nicht bietet: eine transluzente Lichtdecke mit LED-Feldern, ein Sternenhimmel aus Glasfasern oder ein randlos bedrucktes Motiv. Wer eine Voute oder ein frei schwebendes Deckensegel möchte, bekommt das mit vorgefertigten Aluminium-Elementen ebenfalls – ohne Spachtelmasse und Schleifstaub."
        ],
        "links": [
          {
            "label": "Lichtdecke und bedruckte Designs",
            "href": "/products/light-print-stretch-ceiling"
          },
          {
            "label": "Vorgefertigte Deckenelemente",
            "href": "/products/prefab-ceiling-unit"
          },
          {
            "label": "Farben und Oberflächen",
            "href": "/materials"
          }
        ]
      },
      {
        "heading": "Zugang zur Technik: der unterschätzte Punkt",
        "paragraphs": [
          "Über einer neuen Decke liegt fast immer Technik: Wasserleitungen, Elektrokabel, Lüftungsrohre, manchmal der Abwasserstrang der Wohnung darüber. Bei einer Gipskartondecke bedeutet Zugang entweder eine fest eingebaute Revisionsöffnung – oder im Ernstfall: aufsägen, reparieren, neu beplanken, spachteln, schleifen, streichen. Also wieder mehrere Tage, und die Fläche sieht danach selten so aus wie vorher.",
          "Eine PVC-Spanndecke löst der Monteur aus dem Profil, legt sie für die Reparatur beiseite und spannt danach dieselbe Folie wieder ein. Für Stellen, an die man regelmäßig heranmuss – Absperrventile, Verteiler, Lüftungsgeräte –, gibt es integrierte Revisionsklappen, die in der gespannten Fläche nahezu unsichtbar sind und sich beliebig oft öffnen lassen. Die Membran selbst nimmt durch Feuchtigkeit keinen Schaden, was bei einem Leck von oben den Unterschied zwischen Reparatur und Neubau der Decke ausmachen kann."
        ],
        "links": [
          {
            "label": "Revisionsklappen für Spanndecken",
            "href": "/products/inspection-hatch"
          },
          {
            "label": "PVC-Folie: demontierbar und recycelbar",
            "href": "/products/pvc-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Akustik, Feuchträume und Brandschutz",
        "paragraphs": [
          "Eine glatte, gestrichene Gipskartondecke ist akustisch hart: Sie reflektiert Schall wie Putz. Wer den Nachhall im Wohnzimmer, im Großraumbüro oder im Restaurant dämpfen will, braucht beim Trockenbau gelochte Akustikplatten oder zusätzliche Absorber – und nimmt sichtbare Lochbilder in Kauf. Bei der Spanndecke bleibt die Fläche dieselbe, die Akustik kommt als Option dazu: Das akustische Spannsystem kombiniert eine mikroperforierte Membran mit einem Polyesterwolle-Absorber dahinter und erreicht bis Schallabsorptionsklasse A (αw ≥ 0,90) – bei gleicher Optik wie die Standarddecke.",
          "In Bad und Küche entscheidet die Feuchtigkeit. Gipskarton braucht dort imprägnierte Platten und einen sorgfältigen Anstrich – und bleibt bei Dampf und Spritzwasser trotzdem der Schwachpunkt. Die Spannmembran ist feuchtigkeitsbeständig und abwaschbar; deshalb ist das Bad ein typischer Einsatzort für die Spanndecke, oft gleich mit integrierter Beleuchtung hinter der Folie.",
          "Beim Brandschutz gilt für beide Systeme: Prüfen Sie die Klassifizierung für Ihren konkreten Anwendungsfall. Unsere Membranen sind nach EN 13501-1 in B-s1,d0 klassifiziert; die Dokumentation erhalten Sie auf Anfrage."
        ],
        "links": [
          {
            "label": "Akustisches Spannsystem",
            "href": "/products/acoustic-stretch-system"
          },
          {
            "label": "Spanndecken in Bad und Küche",
            "href": "/applications/bathroom-kitchen"
          },
          {
            "label": "Brandschutz der PVC-Folie",
            "href": "/technical/pvc/fire-safety"
          }
        ]
      },
      {
        "heading": "Was kostet welche Decke? Richtwerte und versteckte Posten",
        "paragraphs": [
          "Für eine professionell montierte Spanndecke rechnen Sie mit etwa €70 bis €200 pro m² zzgl. MwSt., Montage inklusive. Größere Räume senken den Quadratmeterpreis, weil sich Vorbereitung und Abschlussarbeiten auf mehr Fläche verteilen; Ecken, Rundungen, Säulen, Rohrdurchführungen und integrierte Beleuchtung erhöhen ihn. Jede Zahl ist ein Richtwert – die verbindliche Summe steht erst im Angebot für Ihren Raum.",
          "Für die Trockenbaudecke nennen wir bewusst keinen Preis: Er hängt von Unterkonstruktion, Plattenqualität, Raumgeometrie und den Handwerkerpreisen in Ihrer Region ab, und wir könnten ihn nicht seriös beziffern. Was Sie beim Vergleich der Angebote aber immer einrechnen sollten: Zur Trockenbaudecke gehören Spachteln, Schleifen und Streichen – also mehrere Arbeitstage, Trocknungszeiten und oft ein zweites Gewerk. Und danach steht alle paar Jahre das nächste Streichen an – ein Posten, den es bei der Spanndecke schlicht nicht gibt.",
          "Die Richtwerte für die Spanndecke nach Deckentyp, montiert und zzgl. MwSt.:"
        ],
        "bullets": [
          "Einfarbige Basisdecke aus PVC oder Polyester: rund €70–90 pro m²",
          "Bedrucktes Design: rund €90–100 pro m²",
          "Akustik-Spanndecke: rund €100–150 pro m²",
          "Transluzente Lichtdecke mit LED-Feldern: rund €130–160 pro m²",
          "Baddecke mit integrierter Beleuchtung: rund €150–200 pro m²",
          "Sternenhimmel und vorgefertigte Elemente: Kalkulation pro Design"
        ],
        "links": [
          {
            "label": "Preisleitfaden Spanndecke",
            "href": "/blog/spanplafond-prijs"
          },
          {
            "label": "Kostenrechner",
            "href": "/price-calculator"
          }
        ]
      },
      {
        "heading": "Fazit: Welche Decke passt zu Ihrem Projekt?",
        "paragraphs": [
          "Gipskarton bleibt eine gute Wahl, wenn Sie die klassische, gestrichene Putzoptik wollen, wenn im Neubau ohnehin ein Trockenbauer auf der Baustelle ist und alle Wände beplankt, oder wenn Sie die Decke später selbst in einer neuen Farbe streichen möchten. Wer die Baustelle nicht scheut und mehrere Tage einplanen kann, bekommt damit eine solide, bewährte Decke.",
          "Die Spanndecke ist die richtige Wahl, wenn der Raum bewohnt bleibt und die Decke ohne Staub und Streichen an einem Tag fertig sein soll. Sie passt, wenn Sie Leitungen und Technik verstecken, aber erreichbar halten wollen, und wenn Bad, Küche oder ein Raum mit Nachhall saniert wird. Und sie ist konkurrenzlos, wenn Sie Licht, ein Druckmotiv oder einen Sternenhimmel in die Decke holen möchten – ohne je wieder eine Decke zu streichen.",
          "Rechnen Sie Ihren Raum in 30 Sekunden durch: Der Kostenrechner rechnet Ihre Quadratmeter mit dem Richtwert des gewünschten Deckentyps hoch und zeigt Ihnen sofort eine Richtspanne. Und wenn Sie eine verbindliche Zahl möchten, schicken Sie uns Raummaße, ein Foto und Ihre Vorstellung – Sie erhalten ein kostenloses, unverbindliches Angebot, meist noch am selben Werktag. Einen zertifizierten Fachbetrieb in Ihrer Nähe finden Sie in unserem Händlernetz."
        ],
        "links": [
          {
            "label": "Zum Kostenrechner",
            "href": "/price-calculator"
          },
          {
            "label": "Kostenloses Angebot anfragen",
            "href": "/contact"
          },
          {
            "label": "Fachbetrieb in Ihrer Nähe",
            "href": "/dealers"
          }
        ]
      }
    ],
  },
  {
    slug: 'spanndecke-kosten-renovierung',
    native: 'de',
    markets: ['de'],
    calculatorCta: true,
    title: "Spanndecke bei der Renovierung: Kosten, Preistreiber und Budget",
    excerpt: "Rissige Putzdecke, Holzdecke oder Altbau-Bad: Eine Spanndecke kostet bei der Renovierung etwa 70 bis 200 € pro m², montiert an einem Tag. Was den Preis treibt, wie viel Höhe Sie verlieren und wie Sie Ihr Budget planen.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 5,
    body: [
      {
        "heading": "Die kurze Antwort",
        "paragraphs": [
          "Eine professionell montierte Spanndecke kostet bei einer Renovierung etwa 70 bis 200 € pro m² zzgl. MwSt. – Membran, Profile und Montage inklusive. Für das typische Altbauzimmer mit rissiger Putzdecke, das einfach wieder glatt und weiß sein soll, liegen Sie am unteren Ende dieser Spanne: 70 bis 90 € pro m². Ein Bad mit feuchtraumtauglicher Folie und integrierter Beleuchtung erreicht 150 bis 200 € pro m².",
          "Gerade bei der Renovierung spielt eine Spanndecke ihre Stärken am deutlichsten aus: Die alte Decke bleibt, wo sie ist. Nichts wird abgeschlagen, nichts verputzt, nichts gestrichen. Die Membran wird in ein schmales Profil an den Wänden gespannt und verdeckt alles, was darüber liegt – Risse, Holz, Rohre, Kabel. In einem normalen Raum ist das an einem Tag erledigt, und die Möbel bleiben stehen.",
          "Alle Zahlen in diesem Leitfaden sind Richtwerte. Jede Spanndecke wird in unserer Produktion maßgefertigt, deshalb kommt die verbindliche Summe immer aus einem kostenlosen, unverbindlichen Angebot – in der Regel noch am selben Werktag."
        ],
        "links": [
          {
            "label": "Decke renovieren: die vier Optionen im Vergleich",
            "href": "/blog/plafond-renoveren-opties"
          }
        ]
      },
      {
        "heading": "Putz, Holz oder Altbau: Welche Decke Sie überspannen",
        "paragraphs": [
          "Die rissige Putzdecke ist der Klassiker. Ob Setzungsriss, Haarriss im Anstrich oder das feine Rissnetz über einer alten Rohrdecke: Die Spanndecke wird nicht auf den Putz geklebt, sondern an den Wänden befestigt. Der Riss darüber darf weiterarbeiten – sichtbar wird er nie wieder. Vorher sollten lediglich lose Putzstücke entfernt werden, damit später nichts auf die Membran fällt. Wer wissen will, woher die Risse kommen, findet die Ursachen im Leitfaden zu Deckenrissen.",
          "Die Holzdecke aus den Siebzigern oder Achtzigern – Nut-und-Feder-Paneele, dunkel lasiert – muss für eine Spanndecke nicht abgebaut werden. Das spart den Container, den Wochenendeinsatz und den Ärger mit dem Staub. Das Profil wird an der Wand unterhalb der Paneele montiert, die matte Membran spannt sich darüber, und der Raum wirkt sofort höher und heller, obwohl er rechnerisch ein paar Zentimeter verliert.",
          "Im Altbau kommt meist noch etwas dazu: eine Heizungsleitung, die unter der Decke entlangläuft, ein nachträglich verlegtes Stromkabel, die Abluft aus dem Bad. Genau hier macht sich eine Spanndecke am schnellsten bezahlt. Statt Verkofferungen aus Gipskarton zu bauen, hängen Sie die Decke einfach so weit ab, dass alles dahinter verschwindet – und über eine Revisionsklappe bleibt der Zugang zu Ventilen und Verteilern erhalten."
        ],
        "links": [
          {
            "label": "Risse in der Decke reparieren",
            "href": "/blog/scheuren-in-plafond-herstellen"
          },
          {
            "label": "Revisionsklappe",
            "href": "/products/inspection-hatch"
          }
        ]
      },
      {
        "heading": "Was den Preis bei der Renovierung wirklich bewegt",
        "paragraphs": [
          "Der Quadratmeterpreis ist bei einer Renovierung selten der Punkt, an dem das Budget kippt. Es sind die Details des Raums. Ein rechteckiges Schlafzimmer mit vier Ecken und einer Deckenleuchte ist der einfachste Fall; der L-förmige Altbau-Flur mit Erker, zwei Rohrdurchführungen und sechs Spots liegt pro Quadratmeter deutlich darüber, weil jede Ecke zusätzliche Profil- und Schweißarbeit bedeutet.",
          "Die Beleuchtung ist der zweite Hebel – und derjenige, den Sie am stärksten selbst in der Hand haben. Eine vorhandene Pendelleuchte an alter Stelle kostet praktisch nichts extra. Jeder Einbauspot braucht seine eigene Vorbereitung in der Membran, LED-Linien ein eigenes Profil, eine hinterleuchtete Lichtdecke ein LED-Feld hinter transluzenter Folie. Das alles lässt sich sauber integrieren – aber jedes Element bedeutet Arbeit und Material."
        ],
        "bullets": [
          "Raumgröße: Je mehr Fläche, desto niedriger der m²-Preis – Anfahrt, Aufmaß und Abschlussarbeiten verteilen sich auf mehr Quadratmeter.",
          "Geometrie: Jede Ecke, Rundung, Säule und Rohrdurchführung erhöht den Preis. Ein Rechteck ist immer günstiger als ein verwinkelter Grundriss.",
          "Beleuchtung: Spots, LED-Linien und Lichtdecken werden pro Element kalkuliert – planen Sie sie vor dem Angebot, nicht danach.",
          "Höhenverlust: normalerweise nur wenige Zentimeter. Müssen Rohre oder Kabel verschwinden, kann die Abhängung auch einmal 10 cm betragen – das kostet kaum Geld, gehört aber in die Planung.",
          "Zugang: Wo hinter der Decke Ventile, Verteiler oder Lüftungsklappen sitzen, gehört eine Revisionsklappe ins Angebot."
        ]
      },
      {
        "heading": "Budget planen: die Preisklassen und zwei Rechenbeispiele",
        "paragraphs": [
          "Für die Budgetplanung genügen fünf Preisklassen. Sie gelten pro Quadratmeter, montiert, zzgl. MwSt., und sie sind bewusst als Spanne angegeben: Das untere Ende steht für den großen, einfachen Raum, das obere für den kleinen, verwinkelten.",
          "Zwei Beispiele, rein rechnerisch: Ein Altbau-Wohnzimmer mit 20 m² und rissiger Putzdecke landet in der Basisklasse bei 1.400 bis 1.800 €. Ein Bad mit 6 m², Lichtdecke und Abluftdurchführung liegt bei 900 bis 1.200 € – und eher am oberen Ende, weil kleine Räume anteilig mehr der Fixkosten wie Anfahrt und Aufmaß tragen. Sternenhimmel und vorgefertigte Elemente werden pro Design kalkuliert und stehen deshalb in keiner Tabelle.",
          "Wenn Sie Fläche und Deckentyp kennen, liefert der Kostenrechner in einer Minute eine erste Einordnung. Er ersetzt kein Aufmaß, aber er zeigt sofort, ob Ihr Budget zu Ihrem Wunsch passt."
        ],
        "bullets": [
          "Einfarbige Basisdecke, PVC oder Polyester: 70 bis 90 € pro m² – die Lösung für Putz- und Holzdecken in Wohn-, Schlaf- und Arbeitszimmern.",
          "Bedrucktes Design: 90 bis 100 € pro m².",
          "Akustik-Spanndecke mit Absorber: 100 bis 150 € pro m² – für den hallenden Altbau mit hohen Decken und Dielenboden.",
          "Transluzente Lichtdecke mit LED-Feldern: 130 bis 160 € pro m².",
          "Bad mit feuchtraumtauglicher Folie und integrierter Beleuchtung: 150 bis 200 € pro m²."
        ],
        "links": [
          {
            "label": "Kostenrechner: m² × Deckentyp",
            "href": "/price-calculator"
          },
          {
            "label": "Was kostet eine Spanndecke? Der Preisleitfaden",
            "href": "/blog/spanplafond-prijs"
          }
        ]
      },
      {
        "heading": "Ein Tag Montage – die Möbel bleiben stehen",
        "paragraphs": [
          "Ein Posten steht auf keiner Rechnung: die Zeit, die Sie nicht auf einer Baustelle wohnen. Ein Zwei-Personen-Team schafft rund 50 m² am Tag. Die Monteure kommen morgens, montieren die Profile umlaufend an den Wänden, spannen die Membran, setzen Spots und Leuchten und räumen abends wieder auf. Kein Abriss, kein Staub, kein Malerbetrieb danach. Das Sofa rückt in die Raummitte, der Schrank bleibt, wo er ist.",
          "Bei der Polyester-Spanndecke wird die Membran kalt gespannt – keine Trocknungszeit, keine Dämpfe, der Raum ist abends wieder nutzbar. Die PVC-Folie wird bei der Montage erwärmt und gespannt; sie ist zudem demontierbar, falls Sie später an die Leitungen dahinter müssen. Beide Systeme sind nach EN 13501-1 mit B-s1,d0 klassifiziert – die Dokumentation erhalten Sie auf Anfrage.",
          "Im Bad zahlt sich das doppelt aus. Die Oberfläche ist feuchtigkeitsbeständig und abwaschbar, sie reißt nicht, blättert nicht ab und vergilbt nicht – und sie muss nie wieder gestrichen werden. Die Spanndecke, die heute als „teurere“ Option erscheint, ist über eine Lebensdauer von mehr als 25 Jahren meist die günstigere."
        ],
        "links": [
          {
            "label": "Spanndecken für Bad & Küche",
            "href": "/applications/bathroom-kitchen"
          },
          {
            "label": "PVC-Folien-Spanndecke",
            "href": "/products/pvc-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Vom Richtwert zum Festpreis",
        "paragraphs": [
          "Der Weg zu einer verbindlichen Zahl ist kurz. Messen Sie Länge und Breite des Raums, zählen Sie die Ecken, fotografieren Sie die Decke und notieren Sie, was dahinter verschwinden soll und welche Beleuchtung Sie sich wünschen. Mehr braucht ein Fachbetrieb nicht, um ein konkretes Angebot zu erstellen – kostenlos, unverbindlich und in der Regel noch am selben Werktag.",
          "Rechnen Sie zuerst selbst: Der Kostenrechner rechnet Ihre Quadratmeter mit dem Deckentyp hoch und nennt Ihnen eine ehrliche Spanne für Ihr Projekt. Dann fordern Sie Ihr kostenloses Angebot an – und die rissige Putzdecke ist an einem Tag Geschichte."
        ],
        "links": [
          {
            "label": "Zum Kostenrechner",
            "href": "/price-calculator"
          },
          {
            "label": "Kostenloses Angebot anfordern",
            "href": "/contact"
          },
          {
            "label": "Händler in Ihrer Nähe finden",
            "href": "/dealers"
          }
        ]
      }
    ],
  },
  {
    slug: 'co-to-jest-sufit-napinany',
    native: 'pl',
    markets: ['pl'],
    title: "Co to jest sufit napinany i jak powstaje: od pomiaru do montażu",
    excerpt: "Sufit napinany to membrana z folii PVC lub tkaniny poliestrowej, wykonywana na wymiar w zakładzie i wpinana w profil obwodowy. Pokazujemy, jak powstaje: pomiar, projekt, produkcja w Częstochowie i montaż w jeden dzień.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        "heading": "Sufit napinany w skrócie",
        "paragraphs": [
          "Sufit napinany to cienka membrana — dziany poliester albo kalandrowana folia PVC — rozpięta pod istniejącym stropem i wpięta w wąski aluminiowy profil zamocowany na ścianach po obwodzie pomieszczenia. Od dołu wygląda jak idealnie gładki, świeżo pomalowany sufit. Różnica polega na tym, że nie ma tu tynku, szpachli ani farby, a cała płaszczyzna jest jednym elementem wykonanym na wymiar.",
          "Ponieważ membrana trzyma się ramy, a nie stropu, ukrywa wszystko, co znajduje się nad nią: rury, przewody, pęknięty tynk, stare panele. Nowa płaszczyzna schodzi tylko o kilka centymetrów niżej — tyle, ile potrzebuje profil — chyba że celowo chowa się pod nią instalacje, jak w naszej realizacji dla kancelarii notarialnej w Belgii, gdzie sufit opuszczono o 10 cm. Powierzchnia jest zmywalna, odporna na wilgoć, nie pęka, nie łuszczy się i nie żółknie, więc nigdy nie trzeba jej malować, a jej żywotność liczy się w dziesięcioleciach — ponad 25 lat.",
          "Odpowiedź na pytanie „co to jest sufit napinany” jest więc krótka. Ciekawsze jest pytanie „jak powstaje”, bo tam rozstrzyga się jakość: sufitu napinanego nie kupuje się gotowego — powstaje w zakładzie pod konkretne pomieszczenie. Poniżej pokazujemy tę drogę krok po kroku — od pomiaru po ostatnie wpięcie w profil."
        ],
        "links": [
          {
            "label": "Najczęstsze pytania o sufity napinane",
            "href": "/faq"
          }
        ]
      },
      {
        "heading": "Producent z dwoma zakładami w UE",
        "paragraphs": [
          "STRETCH jest producentem sufitów i ścian napinanych od 2018 roku. Siedziba i produkcja mieszczą się w Beveren-Waas w Belgii (Gentseweg 309 A3, Beverpark) — tam membrany są mierzone, cięte i zgrzewane na wymiar. Drugi zakład to polski oddział: Alto Design Sp. z o.o. przy ul. Legionów 59 w Częstochowie. To tutaj powstają sufity z folii PVC, więc folia na polskie budowy pochodzi z krajowej produkcji.",
          "Dla klienta oznacza to krótką drogę od pomiaru do gotowej membrany i wsparcie techniczne po polsku. Dla montażystów — polskojęzyczne szkolenia w częstochowskim zakładzie oraz portal partnerski, przez który zamawia się membrany na wymiar. STRETCH działa przede wszystkim w modelu B2B: pomiar, sprzedaż i montaż prowadzą certyfikowani dealerzy i montażyści, a zakład odpowiada za produkt i dokumentację.",
          "Mamy też oddział w Wiedniu i sprzedaż w USA, ale dla polskiego klienta liczy się jedno: sufit, który zawiśnie w jego salonie, powstał w zakładzie w Polsce lub Belgii, z dokumentacją techniczną dostępną na życzenie."
        ],
        "links": [
          {
            "label": "Zakład STRETCH w Częstochowie",
            "href": "/dealers/czestochowa"
          },
          {
            "label": "Partnerzy i dealerzy",
            "href": "/partners"
          }
        ]
      },
      {
        "heading": "Kroki 1 i 2: pomiar i projekt",
        "paragraphs": [
          "Wszystko zaczyna się od pomiaru na miejscu. Montażysta mierzy pomieszczenie — długości ścian i przekątne, bo mało które wnętrze jest idealnym prostokątem — i notuje każdy element, który sufit musi uwzględnić. Membrana będzie później wykonana co do milimetra, więc niedokładny pomiar to jedyna rzecz, której zakład nie jest w stanie naprawić.",
          "Na podstawie pomiaru powstaje projekt: rysunek sufitu z układem zgrzewów (jeśli pomieszczenie jest szersze niż maksymalna szerokość bez łączeń), z wycięciami pod oprawy oraz z wybranym systemem i wykończeniem. Tu klient decyduje, czy chce głębokiego matu tkaniny, połysku folii, membrany akustycznej, podświetlenia czy nadruku. Do zakładu trafia komplet danych produkcyjnych — jak przy oknach czy meblach na wymiar — przede wszystkim:"
        ],
        "bullets": [
          "kształt i wymiary pomieszczenia, w tym łuki, wnęki, słupy i skosy;",
          "miejsca pod oprawy punktowe, linie LED, czujniki, kratki wentylacyjne i klapy rewizyjne;",
          "przejścia rur i inne przeszkody nad przyszłą płaszczyzną sufitu;",
          "wysokość montażu profilu — zwykle kilka centymetrów pod istniejącym stropem, więcej, gdy trzeba schować instalacje;",
          "wybrany system, kolor i wykończenie membrany."
        ],
        "links": [
          {
            "label": "Klapy rewizyjne do sufitu napinanego",
            "href": "/products/inspection-hatch"
          },
          {
            "label": "Sufit podświetlany i z nadrukiem",
            "href": "/products/light-print-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Krok 3: cięcie i zgrzewanie membrany w zakładzie",
        "paragraphs": [
          "To etap, którego klient nie widzi, a który przesądza o efekcie. W zakładzie folia PVC jest rozwijana z roli, docinana według rysunku i — jeśli sufit jest szerszy niż pojedynczy bryt — zgrzewana wysokoczęstotliwościowo w jeden płat o kształcie pomieszczenia. Spoina jest niemal niewidoczna i trwała. Następnie po całym obwodzie zgrzewa się krawędź harpunową — półelastyczny harpun z PVC, który później zaczepi się w profilu obwodowym na ścianie i będzie utrzymywał napięcie przez lata.",
          "Folia PVC zostanie podczas montażu podgrzana, wpięta w profil i naciągnięta, a stygnąc, skurczy się i napnie do idealnie płaskiej powierzchni. Z tkaniną poliestrową jest inaczej: zakład docina ją według rysunku, a montażysta napina ją na zimno — ręcznie, bez nagrzewnicy. Bryty łączy się tylko wtedy, gdy pomieszczenie jest szersze niż 5,15 m. W obu przypadkach gotowa membrana jest sprawdzana, składana i pakowana, po czym trafia do montażysty razem z profilami i akcesoriami.",
          "Ponieważ konfekcjonowanie odbywa się w zakładzie, a nie na budowie, montażysta niczego nie zgrzewa w mieszkaniu klienta — nie ma tam maszyn, oparów ani ścinków. Na miejsce przyjeżdża gotowy sufit, który trzeba „tylko” dobrze zamontować."
        ],
        "links": [
          {
            "label": "Sufit napinany z folii PVC",
            "href": "/products/pvc-stretch-ceiling"
          },
          {
            "label": "Membrany, kolory i wykończenia",
            "href": "/materials"
          }
        ]
      },
      {
        "heading": "PVC czy poliester: dwa systemy, jedna decyzja",
        "paragraphs": [
          "Folia PVC to membrana montowana na ciepło. Daje wybór wykończeń — połysk, satyna, mat — pokrywa do 6,5 m bez łączeń, a po latach można ją wypiąć, żeby dostać się do instalacji, i wpiąć ponownie. Jest w pełni recyklingowalna i naturalnie odporna na wilgoć, dlatego chętnie trafia do łazienek i kuchni. Folie półprzezroczyste są też podstawą sufitów podświetlanych, a na folię PVC można nadrukować dowolny obraz od krawędzi do krawędzi.",
          "Poliester to dziana tkanina montowana na zimno: bez nagrzewnicy, bez oparów, bez czasu schnięcia. Ma głęboko matowe, nieodbijające światła wykończenie, najbliższe świeżo pomalowanemu tynkowi, i pokrywa do 5,15 m bez łączeń. W wersji mikroperforowanej z absorberem z wełny poliestrowej osiąga pochłanianie dźwięku aż do klasy A (αw ≥ 0,90) — przy identycznym wyglądzie co wersja standardowa.",
          "W praktyce wybór rzadko jest trudny, a certyfikowany montażysta STRETCH zna oba systemy — jedna certyfikacja obejmuje zarówno poliester na zimno, jak i PVC na ciepło. Najkrótsza podpowiedź:"
        ],
        "bullets": [
          "połysk, podświetlenie, nadruk albo dostęp do instalacji nad sufitem — folia PVC;",
          "efekt idealnie matowego tynku, montaż bez ciepła albo akustyka — poliester;",
          "oba systemy mają klasę reakcji na ogień B-s1,d0 wg EN 13501-1 — dokumentacja na życzenie;",
          "oba są zmywalne, odporne na wilgoć i powstają na wymiar w tym samym procesie."
        ],
        "links": [
          {
            "label": "Poliestrowy sufit napinany",
            "href": "/products/polyester-stretch-ceiling"
          },
          {
            "label": "Sufit napinany z folii PVC",
            "href": "/products/pvc-stretch-ceiling"
          },
          {
            "label": "Akustyczny system napinany",
            "href": "/products/acoustic-stretch-system"
          }
        ]
      },
      {
        "heading": "Kroki 4 i 5: profile i montaż w jeden dzień",
        "paragraphs": [
          "Dzień montażu zaczyna się od profili. Aluminiowy profil obwodowy mocuje się do ścian idealnie w poziomie, wokół całego pomieszczenia, kilka centymetrów pod istniejącym stropem — to on wyznacza nową płaszczyznę sufitu. Równolegle montuje się podkonstrukcje pod oprawy: platformy, dzięki którym spoty i linie LED trzymają się stropu, a nie membrany. Stary sufit zwykle zostaje na miejscu; nie ma wyburzania, kurzu ani szlifowania.",
          "Potem przychodzi kolej na membranę. Folię PVC podgrzewa się nagrzewnicą, aż stanie się elastyczna, po czym zaczepia się harpun w profilu — najpierw w narożnikach, potem wzdłuż ścian. W miarę stygnięcia folia kurczy się i napina, a każde pofałdowanie znika. Tkaninę poliestrową wpina się na zimno w profil obwodowy. Na końcu nakleja się pierścienie ochronne, wycina w nich otwory pod oprawy i montuje oświetlenie.",
          "Dwuosobowa ekipa wykonuje w ten sposób około 50 m² dziennie, więc typowe pomieszczenie mieszkalne jest gotowe w jeden dzień. Meble mogą zostać, poliester nie wymaga żadnego czasu schnięcia, a po montażu folii PVC wystarczy poczekać, aż pomieszczenie ostygnie."
        ],
        "links": [
          {
            "label": "Czy sufit napinany można zamontować samemu?",
            "href": "/blog/spanplafond-zelf-plaatsen"
          },
          {
            "label": "Salon i kino domowe",
            "href": "/applications/living-cinema"
          }
        ]
      },
      {
        "heading": "Ile to kosztuje i jak zacząć",
        "paragraphs": [
          "Orientacyjne ceny sufitu napinanego z montażem w Polsce to od około 150 do 450 zł za m² netto. Podstawowy jednokolorowy sufit z PVC lub poliestru to około 150–200 zł/m², sufit z nadrukiem 200–250 zł/m², akustyczny 250–350 zł/m², podświetlany 300–400 zł/m², a łazienkowy ze zintegrowanym oświetleniem 350–450 zł/m². Większa powierzchnia obniża cenę za metr; narożniki, łuki, słupy, przejścia rur i integracje oświetlenia ją podnoszą. Gwiezdne niebo i elementy prefabrykowane wycenia się indywidualnie.",
          "Każda z tych kwot jest orientacyjna. Ponieważ membrana powstaje na wymiar, konkretną kwotę daje dopiero bezpłatna, niezobowiązująca wycena — po przesłaniu wymiarów zwykle jeszcze tego samego dnia roboczego, a ostatecznie po pomiarze na miejscu. Szybki szacunek zrobisz samodzielnie w kalkulatorze ceny za m².",
          "Jeśli jesteś montażystą albo prowadzisz firmę wykończeniową, zacznij od szkolenia — po polsku, w zakładzie w Częstochowie. Certyfikacja STRETCH obejmuje oba systemy: poliester na zimno i PVC na ciepło. Jeśli planujesz sufit u siebie, poproś o bezpłatną wycenę: certyfikowany dealer STRETCH wykona pomiar, zakład przygotuje membranę na wymiar, a montaż zajmie jeden dzień."
        ],
        "links": [
          {
            "label": "Szkolenia dla montażystów",
            "href": "/installer-training"
          },
          {
            "label": "Kalkulator ceny za m²",
            "href": "/price-calculator"
          },
          {
            "label": "Poproś o bezpłatną wycenę",
            "href": "/contact"
          }
        ]
      }
    ],
  },
  {
    slug: 'sufit-napinany-pvc-czy-tkanina',
    native: 'pl',
    markets: ['pl'],
    title: "Sufit napinany PVC czy tkanina? Porównanie od producenta",
    excerpt: "Folia PVC czy tkanina poliestrowa? Producent obu membran porównuje montaż na zimno i na ciepło, szerokość bez łączeń, wykończenie, odporność na wilgoć, akustykę, recykling, dostęp do instalacji i ceny za m².",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        "heading": "Krótka odpowiedź",
        "paragraphs": [
          "Oba systemy to sufit napinany w pełnym tego słowa znaczeniu: membrana bez łączeń, wykonana na wymiar, wpięta w wąski profil obwodowy i gotowa w jeden dzień — bez kucia, kurzu i malowania. Różnica leży w materiale i w tym, jak się go napina. Tkanina poliestrowa jest dziana i montuje się ją na zimno; folia PVC jest kalandrowana i podczas montażu podgrzewana. Z tej jednej różnicy wynika prawie wszystko, co poniżej.",
          "Jako producent obu membran nie mamy powodu, żeby faworyzować którąś z nich. Poliester konfekcjonujemy w belgijskiej centrali w Beveren-Waas, folię PVC produkujemy w Częstochowie — i codziennie sprzedajemy jedno i drugie. Dlatego zamiast marketingu przedstawiamy uczciwą listę: kiedy sięgnąć po tkaninę, a kiedy po folię."
        ],
        "bullets": [
          "Tkanina poliestrowa: gdy liczy się głęboko matowy, „tynkowy” wygląd i montaż bez nagrzewnicy w użytkowanym pomieszczeniu — typowy wybór do mieszkań i biur.",
          "Folia PVC: gdy w grę wchodzi połysk lub satyna, podświetlenie albo nadruk, szerokość bez łączeń powyżej 5,15 m, pomieszczenie mokre (basen, strefa wellness) lub łatwy dostęp do instalacji nad sufitem."
        ],
        "links": [
          {
            "label": "Poliestrowy sufit napinany",
            "href": "/products/polyester-stretch-ceiling"
          },
          {
            "label": "Sufit napinany z folii PVC",
            "href": "/products/pvc-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Montaż na zimno czy na ciepło",
        "paragraphs": [
          "Tkanina poliestrowa jest napinana ręcznie, na zimno. Montażysta mocuje profil obwodowy, rozkłada membranę i wpina ją w profil krawędź po krawędzi — bez nagrzewnicy i bez czasu schnięcia. To ma znaczenie w mieszkaniu, w którym ktoś śpi, w gabinecie lekarskim czy w biurze, które nie może przerwać pracy: meble zostają na miejscu, a po wyjściu ekipy z pomieszczenia można korzystać od razu.",
          "Folię PVC podgrzewa się w trakcie montażu: pod wpływem ciepła staje się elastyczna, wpina się ją w profil, a stygnąc, kurczy się i napina do idealnie gładkiej powierzchni. Wymaga to nagrzewnicy i wprawy, ale w rękach certyfikowanego montażysty montaż jest równie czysty — również tutaj nie ma kucia, tynkowania ani malowania, a meble zostają na miejscu.",
          "Tempo pracy jest zbliżone: typowe pomieszczenie to jeden dzień pracy, a dwuosobowa ekipa montuje około 50 m² dziennie. W obu przypadkach sufit obniża się tylko o kilka centymetrów — tyle, ile potrzeba, by ukryć rury, przewody, pęknięcia i stary sufit."
        ],
        "links": [
          {
            "label": "Czym jest sufit napinany?",
            "href": "/blog/what-is-a-stretch-ceiling"
          },
          {
            "label": "Czy da się zamontować sufit napinany samemu?",
            "href": "/blog/spanplafond-zelf-plaatsen"
          }
        ]
      },
      {
        "heading": "Szerokość bez łączeń i wykończenie powierzchni",
        "paragraphs": [
          "Tkanina poliestrowa pokrywa do 5,15 m bez łączenia, folia PVC — do 6,5 m. Dla większości salonów, sypialni, kuchni i biur obie wartości w zupełności wystarczą; różnica zaczyna się liczyć w dużych otwartych przestrzeniach, restauracjach czy salonach wystawowych. Większe rozpiętości rozwiązujemy niemal niewidoczną zgrzewaną spoiną albo celowo poprowadzoną linią profilu, która staje się elementem projektu.",
          "Wykończenie to najbardziej widoczna różnica. Poliester ma jedno oblicze — bardzo matowe, nieodbijające światła, do złudzenia przypominające świeżo pomalowany tynk. Folia PVC daje wybór: mat, satyna, połysk, a także wersje półprzezroczyste i metaliczne. Połysk optycznie podnosi niskie pomieszczenie i odbija światło, satyna łagodzi ten efekt, a mat PVC jest bliski tkaninie, choć nie tak głęboki.",
          "Podświetlenie i nadruk to domena folii. Półprzezroczysta folia PVC równomiernie rozprasza pola LED bez punktowych prześwitów, a każdy obraz — grafika, tekstura, gwiezdne niebo — może być nadrukowany od krawędzi do krawędzi. Jeśli sufit ma świecić albo nieść obraz, wybór jest oczywisty."
        ],
        "links": [
          {
            "label": "Sufit świetlny",
            "href": "/products/light-print-stretch-ceiling"
          },
          {
            "label": "Sufit z nadrukiem na wymiar",
            "href": "/products/custom-print"
          },
          {
            "label": "Sufit gwiezdne niebo",
            "href": "/products/starry-sky"
          }
        ]
      },
      {
        "heading": "Wilgoć: łazienka, kuchnia, basen",
        "paragraphs": [
          "Obie membrany są zmywalne i odporne na wilgoć: nie pękają, nie łuszczą się, nie żółkną i nigdy nie wymagają odmalowania. W łazience i kuchni sprawdzi się więc zarówno tkanina, jak i folia — para i zachlapania nie robią na nich wrażenia, a oprawy, wentylację i klapy rewizyjne da się wkomponować w powierzchnię, pod którą znikają rury.",
          "Tam, gdzie wilgoć jest stała, a nie chwilowa — basen, strefa wellness, hotelowe spa — polecamy folię PVC. To nasze standardowe rozwiązanie dla pomieszczeń mokrych: gładka, wodoodporna powierzchnia, którą w razie potrzeby można wypiąć, sprawdzić przestrzeń nad sufitem i napiąć ponownie.",
          "Bezpieczeństwo pożarowe nie rozstrzyga wyboru: obie membrany mają klasyfikację ogniową B-s1,d0 według EN 13501-1, a dokumentację — przydatną zwłaszcza przy obiektach publicznych i inwestycjach komercyjnych — udostępniamy na życzenie."
        ],
        "links": [
          {
            "label": "Sufity napinane do łazienek i kuchni",
            "href": "/applications/bathroom-kitchen"
          },
          {
            "label": "Klasa ogniowa folii PVC",
            "href": "/technical/pvc/fire-safety"
          },
          {
            "label": "Klasa ogniowa poliestru",
            "href": "/technical/polyester/fire-safety"
          }
        ]
      },
      {
        "heading": "Akustyka, recykling, demontaż i dostęp",
        "paragraphs": [
          "Akustyka nie przechyla szali, bo dostępna jest w obu systemach. Akustyczny system napinany to mikroperforowana membrana, za którą kryje się absorber z wełny poliestrowej — wygląda identycznie jak wykończenie standardowe, a pochłania dźwięk aż do klasy A (αw ≥ 0,90). Do biur open space i restauracji zwykle proponujemy matową tkaninę, do sal z podświetleniem — perforowaną folię; efekt akustyczny jest w obu przypadkach ten sam.",
          "Recykling to punkt dla folii: system PVC w 100% poddaje się recyklingowi do surowca — argument, który ma znaczenie w przetargach i projektach z wymogami środowiskowymi. Demontaż również przemawia za PVC — montażysta może wypiąć folię, odsłonić instalacje nad sufitem i napiąć ją ponownie w kilka minut, a przy remoncie czy zmianie aranżacji cały sufit da się zdjąć i zamontować ponownie.",
          "Przy tkaninie poliestrowej dostęp planuje się zawczasu: tam, gdzie są zawory, rozdzielacze czy centrala wentylacyjna, przewidujemy dyskretne klapy rewizyjne, które nie przerywają czystej linii sufitu. To rozwiązanie działa zresztą w obu systemach i warto o nim pomyśleć już na etapie wyceny."
        ],
        "links": [
          {
            "label": "Akustyczny system napinany",
            "href": "/products/acoustic-stretch-system"
          },
          {
            "label": "Klapy rewizyjne",
            "href": "/products/inspection-hatch"
          },
          {
            "label": "Akustyka sufitów napinanych — wyjaśniamy",
            "href": "/blog/stretch-ceiling-acoustics-explained"
          }
        ]
      },
      {
        "heading": "Cena za m²: czy materiał zmienia kwotę?",
        "paragraphs": [
          "Mniej, niż większość osób zakłada. Podstawowy, jednokolorowy sufit napinany z montażem — z PVC albo z poliestru — mieści się w tych samych orientacyjnych widełkach 150–200 zł za m² netto. O ostatecznej kwocie decyduje nie materiał, lecz typ sufitu, wielkość i kształt pomieszczenia oraz integracje: każdy narożnik, łuk, słup, przejście rury czy oprawa to dodatkowa praca przy profilach i zgrzewaniu, a większa powierzchnia obniża cenę za metr.",
          "Wszystkie kwoty są orientacyjne, dotyczą sufitu z montażem i są podane netto. Membrana powstaje na wymiar, więc wiążąca kwota pochodzi zawsze z bezpłatnej, niezobowiązującej wyceny — zwykle jeszcze tego samego dnia roboczego. Orientacyjną kwotę dla Państwa metrażu poda kalkulator cen, a pełne wyjaśnienie widełek znajdą Państwo w naszym przewodniku cenowym."
        ],
        "bullets": [
          "Jednolity kolor, PVC lub poliester: 150–200 zł za m²",
          "Sufit z nadrukiem (folia PVC): 200–250 zł za m²",
          "Sufit akustyczny, tkanina lub folia: 250–350 zł za m²",
          "Sufit półprzezroczysty, podświetlany (folia PVC): 300–400 zł za m²",
          "Łazienka ze zintegrowanym oświetleniem: 350–450 zł za m²"
        ],
        "links": [
          {
            "label": "Kalkulator cen sufitów napinanych",
            "href": "/price-calculator"
          },
          {
            "label": "Ile kosztuje sufit napinany? Przewodnik po cenach",
            "href": "/blog/spanplafond-prijs"
          }
        ]
      },
      {
        "heading": "Werdykt producenta i następny krok",
        "paragraphs": [
          "Gdyby streścić ten tekst w jednym zdaniu: tkanina poliestrowa wygrywa matowym wyglądem i montażem na zimno, folia PVC — wykończeniami, podświetleniem, szerokością, recyklingiem i dostępem. W typowym mieszkaniu oba wybory są dobre i kosztują podobnie; w hali basenowej, sali ze świetlnym sufitem czy pomieszczeniu szerszym niż 5,15 m wybór zawęża się do PVC. W obu przypadkach dostają Państwo membranę wykonaną na wymiar, ponad 25 lat żywotności, zmywalną powierzchnię i długoterminową gwarancję, której szczegóły podajemy na życzenie.",
          "Planują Państwo sufit w domu, biurze lub lokalu? Wystarczy przesłać wymiary pomieszczenia, zdjęcie i krótki opis oczekiwań — bezpłatną, niezobowiązującą wycenę z rekomendacją materiału przygotujemy zwykle tego samego dnia roboczego. Pomiar i dobór systemu to nasza praca, nie Państwa.",
          "Są Państwo montażystą lub firmą wykończeniową i chcą dodać sufity napinane do oferty? Nasze szkolenie dla montażystów trwa 2–3 dni i obejmuje oba systemy — zimny poliester i podgrzewaną folię PVC — w jednej certyfikacji, z zajęciami po polsku w naszym zakładzie w Częstochowie. Po certyfikacji wystarczy poprosić o konto partnerskie, by widzieć ceny handlowe w portalu i dołączyć do sieci certyfikowanych montażystów STRETCH."
        ],
        "links": [
          {
            "label": "Szkolenie dla montażystów",
            "href": "/installer-training"
          },
          {
            "label": "Poproś o bezpłatną wycenę",
            "href": "/contact"
          },
          {
            "label": "Zostań partnerem STRETCH",
            "href": "/partners"
          }
        ]
      }
    ],
  },
  {
    slug: 'o-co-zapytac-producenta-sufitow-napinanych',
    native: 'pl',
    markets: ['pl'],
    title: "O co zapytać producenta sufitów napinanych? Lista kontrolna",
    excerpt: "Jak wybrać producenta sufitów napinanych? Sprawdź adres zakładu, klasę ogniową B-s1,d0, szerokość bez łączeń, termin realizacji i to, kto szkoli montażystów. 9 pytań dla inwestorów i wykonawców.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        "heading": "Producent czy pośrednik? Pytanie, od którego wszystko się zaczyna",
        "paragraphs": [
          "Hasło „producent sufitów napinanych” bywa używane szerzej, niż wskazywałaby liczba zakładów, w których naprawdę zgrzewa się membrany. Zdarza się, że firma kupuje folię z rolki, zleca konfekcję na zewnątrz i sprzedaje gotowy sufit pod własną marką. Nie ma w tym nic złego — dopóki wiadomo, kto odpowiada za materiał, kto za zgrzew, a kto za montaż. Kłopot zaczyna się wtedy, gdy po latach trzeba dokupić klapę rewizyjną, domówić membranę w tym samym kolorze albo pokazać rzeczoznawcy dokument, którego nikt nie potrafi znaleźć.",
          "Dla inwestora prywatnego oznacza to jedno: sufit będzie wisiał ponad 25 lat, więc warto wiedzieć, skąd pochodzi. Dla montażysty sprawa jest jeszcze poważniejsza — od producenta zależy termin realizacji, powtarzalność koloru, dostępność profili i to, czy klient z reklamacją wróci do niego, czy do fabryki.",
          "Poniższa lista kontrolna powstała z myślą o obu grupach. Zadaj te pytania każdemu, kto nazywa siebie producentem, i porównaj odpowiedzi. Różnice widać od razu."
        ]
      },
      {
        "heading": "Gdzie fizycznie stoi zakład?",
        "paragraphs": [
          "Pierwsze pytanie brzmi banalnie, ale odsiewa najwięcej: pod jakim adresem zgrzewa się membrany i czy można tam przyjechać? Producent z prawdziwym zakładem podaje ulicę i numer, a nie „produkcję w UE” czy „własne linie za granicą”. Adres da się sprawdzić na mapie, a na miejscu zobaczyć zgrzewarki wysokiej częstotliwości, rolki folii i profile.",
          "STRETCH ma dwa takie adresy. Folia PVC powstaje w Polsce, w zakładzie Alto Design Sp. z o.o. przy ul. Legionów 59, 42-202 Częstochowa — tam też organizujemy polskojęzyczne szkolenia montażystów. Centrala firmy, Stretch Productions BV, mieści się w Belgii, przy Gentseweg 309 A3 (Beverpark), 9120 Beveren-Waas. Membrany kroimy i zgrzewamy na wymiar w naszych własnych zakładach w Częstochowie i w Beveren-Waas, a w obu też szkolimy montażystów — partner może więc zobaczyć produkcję na własne oczy, zanim złoży pierwsze zamówienie.",
          "Warto dopytać, co dokładnie dzieje się w każdym z tych miejsc: gdzie produkuje się folię, gdzie się ją konfekcjonuje i skąd rusza wysyłka. Odpowiedź „wszystko u nas” bez podania adresu powinna zapalić lampkę ostrzegawczą."
        ],
        "links": [
          {
            "label": "Sufity napinane w Częstochowie",
            "href": "/dealers/czestochowa"
          },
          {
            "label": "Zaopatrzenie z fabryki dla montażystów",
            "href": "/supply"
          }
        ]
      },
      {
        "heading": "Klasa reakcji na ogień i szerokość bez łączeń",
        "paragraphs": [
          "Drugie pytanie dotyczy papierów. Poproś o klasyfikację reakcji na ogień według EN 13501-1 i o dokument, który ją potwierdza — nie o zapewnienie, że „folia jest niepalna”. Membrany STRETCH, zarówno folia PVC, jak i poliester, mają klasę B-s1,d0: trudnozapalne, o bardzo ograniczonym wydzielaniu dymu i bez płonących kropli. Certyfikaty i deklaracje właściwości użytkowych wysyłamy na życzenie, do dokumentacji przeciwpożarowej budynku.",
          "Trzecie pytanie to szerokość membrany bez łączeń. W salonie o wymiarach 6 × 8 m różnica między 5,15 m a 6,5 m decyduje o tym, czy w suficie pojawi się zgrzew. Folia PVC STRETCH jest dostępna bez łączeń do szerokości 6,5 m, membrana poliestrowa montowana na zimno — do 5,15 m. Większe rozpiętości pokrywa się niemal niewidocznym zgrzewem albo celowo poprowadzoną linią profilu — ale to trzeba ustalić przed wyceną, nie na budowie.",
          "Dopytaj też o systemy: czy producent oferuje zarówno poliester (bardzo matowy, montaż na zimno, bez czasu schnięcia), jak i PVC (połysk, satyna, mat, montaż na ciepło, folia demontowalna i w pełni nadająca się do recyklingu). Producent z jednym systemem będzie go polecał do wszystkiego."
        ],
        "links": [
          {
            "label": "Bezpieczeństwo pożarowe folii PVC",
            "href": "/technical/pvc/fire-safety"
          },
          {
            "label": "Bezpieczeństwo pożarowe membrany poliestrowej",
            "href": "/technical/polyester/fire-safety"
          },
          {
            "label": "Materiały i wykończenia",
            "href": "/materials"
          }
        ]
      },
      {
        "heading": "Termin realizacji i zgrzewanie na wymiar",
        "paragraphs": [
          "Sufit napinany nie jest towarem z półki. Każdą membranę mierzy się, docina i zgrzewa pod konkretne pomieszczenie — folię PVC z krawędzią harpunową po obwodzie, którą wpina się w profil. Dlatego pytanie o termin realizacji trzeba zadać precyzyjnie: ile dni roboczych mija od zatwierdzenia rysunku do wysyłki i czy termin jest potwierdzany przy zamówieniu, czy „zwykle wychodzi”. O aktualny termin realizacji warto zapytać już przy wycenie — bezpłatnej i niezobowiązującej.",
          "Montażysta powinien dodatkowo sprawdzić logistykę: czy membrana przyjeżdża złożona i opisana, czy wysyłka obejmuje profile i osprzęt oraz kto odpowiada za błąd wymiaru. Uczciwy producent mówi wprost, kiedy pomiar leży po stronie montażysty, a kiedy po stronie zakładu.",
          "Inwestora interesuje przede wszystkim sam montaż: w typowym pomieszczeniu trwa jeden dzień, bez kucia, bez kurzu i bez malowania, a dwuosobowa ekipa wykonuje około 50 m² dziennie. Jeśli ktoś obiecuje trzy dni, „bo membrana musi wyschnąć”, warto zapytać, o jakim materiale mowa."
        ],
        "links": [
          {
            "label": "Sufit napinany z folii PVC",
            "href": "/products/pvc-stretch-ceiling"
          },
          {
            "label": "Poliestrowy sufit napinany",
            "href": "/products/polyester-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Szkolenie montażystów, certyfikat i serwis po latach",
        "paragraphs": [
          "Najlepsza membrana nie uratuje krzywo wyznaczonego profilu. Zapytaj więc, kto montuje i kto go przeszkolił. Producent, który szkoli sam, bierze odpowiedzialność za cały łańcuch. Certyfikacja montażysty STRETCH to 2–3 dni praktyki na prawdziwych ramach. Jedno szkolenie obejmuje oba systemy — poliester na zimno i folię PVC na ciepło — a do tego konfekcję, profile, integrację światła i akustyki oraz wycenę. Sesje po polsku organizujemy w zakładzie w Częstochowie — terminy potwierdzamy na życzenie.",
          "Inwestorowi to pytanie daje prostą odpowiedź: montażysta z certyfikatem producenta pracuje z jego profilami, membranami i oświetleniem, więc materiał i montaż są pod jednym dachem, a reklamacja ma jeden adres. Montażyście daje coś więcej — miejsce w sieci certyfikowanych dealerów i dostęp do portalu partnerskiego z cennikiem dla profesjonalistów.",
          "Ostatni punkt to serwis. Co się stanie, gdy za pięć lat pęknie rura nad sufitem? Folia PVC STRETCH jest demontowalna: wypina się ją z profilu, naprawia instalację i napina ponownie. Tam, gdzie dostęp będzie potrzebny regularnie, od razu planuje się klapy rewizyjne. Zapytaj też, czy producent dostarczy membranę zamienną w tym samym kolorze i wykończeniu oraz na jakich warunkach udziela gwarancji — STRETCH daje wieloletnią gwarancję, a szczegóły przekazujemy na życzenie."
        ],
        "links": [
          {
            "label": "Szkolenie i certyfikacja montażystów",
            "href": "/installer-training"
          },
          {
            "label": "Zostań partnerem STRETCH",
            "href": "/partners"
          },
          {
            "label": "Klapy rewizyjne",
            "href": "/products/inspection-hatch"
          }
        ]
      },
      {
        "heading": "Lista kontrolna: pytania do producenta sufitów napinanych",
        "paragraphs": [
          "Poniższą listę można wydrukować albo skopiować do e-maila. Wystarczy, że producent odpowie na każde pytanie jednym konkretem — adresem, liczbą, dokumentem lub nazwiskiem.",
          "Jeśli któraś odpowiedź brzmi „to zależy” i nie ma dalszego ciągu, to również jest odpowiedź. Producent, który zna własny zakład, odpowiada na te pytania w kilka minut — zadaje mu je przecież każdy dobry montażysta."
        ],
        "bullets": [
          "Pod jakim adresem produkujecie folię i gdzie zgrzewacie membrany na wymiar? Czy można odwiedzić zakład?",
          "Jaką klasę reakcji na ogień według EN 13501-1 ma membrana i czy prześlecie certyfikat oraz deklarację właściwości użytkowych?",
          "Jaka jest maksymalna szerokość bez łączeń dla folii PVC i dla poliestru?",
          "Ile dni roboczych trwa realizacja od zatwierdzenia rysunku i czy termin jest potwierdzany pisemnie przy zamówieniu?",
          "Kto wykonuje pomiar i kto odpowiada za błąd wymiaru?",
          "Czy sami szkolicie i certyfikujecie montażystów? Ile trwa szkolenie i czy obejmuje oba systemy?",
          "Czy membranę można zdemontować i ponownie napiąć? Czy dostarczycie membranę zamienną w tym samym kolorze?",
          "Jakie są warunki gwarancji na materiał i na montaż — i kto jej udziela: producent czy montażysta?",
          "Co dokładnie obejmuje wycena: membrana, profile, montaż, oświetlenie, klapy rewizyjne?"
        ],
        "links": [
          {
            "label": "Najczęstsze pytania o sufity napinane",
            "href": "/faq"
          }
        ]
      },
      {
        "heading": "Co powinna zawierać uczciwa wycena — i co dalej",
        "paragraphs": [
          "Ostatnie pytanie dotyczy pieniędzy, ale nie w wersji „ile za metr”. Uczciwa wycena rozbija kwotę na membranę wykonaną na wymiar, profile obwodowe, montaż i integracje: oświetlenie, klapy rewizyjne, przejścia rur. Orientacyjnie, netto i z montażem, podstawowy jednokolorowy sufit z PVC lub poliestru to około 150–200 zł za m², sufit z nadrukiem 200–250 zł, sufit akustyczny 250–350 zł, sufit podświetlany 300–400 zł, a łazienka ze zintegrowanym oświetleniem 350–450 zł za m². Duże, proste pomieszczenia obniżają cenę za metr; narożniki, łuki, słupy i integracje oświetlenia ją podnoszą.",
          "To widełki, nie oferta. Konkretna kwota pochodzi zawsze z bezpłatnej, niezobowiązującej wyceny przygotowanej na podstawie wymiarów, zdjęcia i krótkiego opisu pomieszczenia. Jeżeli producent podaje jedną cenę za metr, nie pytając o pomieszczenie, to jeszcze nie jest wycena.",
          "Jesteś montażystą albo prowadzisz firmę wykończeniową i chcesz dodać sufity napinane do oferty? Zapisz się na szkolenie z certyfikacją — po polsku, w Częstochowie — i zamawiaj membrany prosto z zakładu. Planujesz sufit u siebie? Prześlij nam wymiary i zdjęcie, a bezpłatną wycenę przygotujemy zwykle tego samego dnia roboczego."
        ],
        "links": [
          {
            "label": "Zapisz się na szkolenie montażystów",
            "href": "/installer-training"
          },
          {
            "label": "Poproś o bezpłatną wycenę",
            "href": "/contact"
          },
          {
            "label": "Przewodnik po cenach sufitów napinanych",
            "href": "/blog/spanplafond-prijs"
          }
        ]
      }
    ],
  },
  {
    slug: 'plafond-tendu-prix-m2',
    native: 'fr',
    markets: ['fr'],
    calculatorCta: true,
    title: "Plafond tendu : quel prix au m² en 2026 ? Fourchettes et devis",
    excerpt: "Un plafond tendu posé coûte de 70 à 200 € HT le m² en France, selon la toile et la configuration de la pièce. Fourchettes par type, facteurs de prix, contenu du devis et calculateur pour votre estimation.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        "heading": "La réponse courte : de 70 à 200 € le m², pose comprise",
        "paragraphs": [
          "En France, un plafond tendu posé par un professionnel coûte entre 70 et 200 € hors taxes (HT) par mètre carré, toile sur mesure, profilés et pose compris. L’écart n’a rien d’un flou commercial : un plafond blanc mat dans un séjour rectangulaire se situe tout en bas de la fourchette ; un plafond de salle de bains avec spots et lignes lumineuses intégrés, tout en haut. Entre les deux, ce sont le type de toile, la surface et la complexité de la pièce qui font le prix.",
          "Vous voulez un ordre de grandeur pour votre pièce avant de lire la suite ? Notre calculateur de prix croise votre surface et le type de plafond, et affiche en trente secondes la fourchette indicative correspondante. Gardez toutefois une chose en tête : chaque toile est confectionnée aux dimensions exactes de votre pièce ; le chiffre ferme sort donc toujours d’un devis gratuit et sans engagement, jamais d’un tableau."
        ],
        "links": [
          {
            "label": "Calculer le prix de mon plafond tendu",
            "href": "/price-calculator"
          },
          {
            "label": "Qu’est-ce qu’un plafond tendu ?",
            "href": "/blog/what-is-a-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Fourchettes de prix par type de plafond tendu",
        "paragraphs": [
          "Les réalisations spéciales — ciel étoilé en fibre optique, éléments préfabriqués sur cadre aluminium, impressions rétroéclairées — n’entrent dans aucune case : elles se conçoivent au cas par cas et se chiffrent sur projet, devis gratuit compris.",
          "Pour tout le reste, voici les fourchettes indicatives que nous publions pour la France, en euros HT par m², pose comprise. Elles valent pour une pièce de forme simple et une surface courante ; nous verrons ensuite ce qui les fait varier :"
        ],
        "bullets": [
          "Plafond tendu uni, film PVC ou polyester : 70 à 90 € le m². L’entrée de gamme pour un séjour, une chambre ou un bureau, en finition mate, satinée ou laquée.",
          "Plafond tendu imprimé : 90 à 100 € le m². N’importe quelle image, imprimée bord à bord sur la toile, préparation du visuel comprise.",
          "Plafond tendu acoustique : 100 à 150 € le m². Toile micro-perforée doublée d’un absorbant en laine de polyester, jusqu’à la classe A d’absorption.",
          "Plafond translucide rétroéclairé : 130 à 160 € le m². Film translucide et modules LED derrière la toile, pour une nappe de lumière homogène, sans point chaud.",
          "Salle de bains avec éclairage intégré : 150 à 200 € le m². Toile résistante à l’humidité, spots et lignes lumineuses intégrés, le tout dans une petite pièce pleine d’angles : d’où le haut de la fourchette."
        ],
        "links": [
          {
            "label": "Plafond tendu film PVC",
            "href": "/products/pvc-stretch-ceiling"
          },
          {
            "label": "Plafond tendu polyester",
            "href": "/products/polyester-stretch-ceiling"
          },
          {
            "label": "Plafond tendu acoustique",
            "href": "/products/acoustic-stretch-system"
          }
        ]
      },
      {
        "heading": "Ce qui fait varier le prix au m²",
        "paragraphs": [
          "La surface joue en votre faveur. Une partie du travail est fixe quelle que soit la pièce : relevé des cotes, pose des profilés périphériques, déplacement, finitions. Sur 40 m², ces étapes se diluent ; sur 6 m², elles pèsent proportionnellement beaucoup plus. C’est pour cela qu’un grand séjour revient moins cher au m² qu’une petite salle d’eau, à toile identique.",
          "La géométrie est le deuxième levier. Chaque angle rentrant, chaque courbe, chaque pilier ou passage de tuyau demande une découpe de profilé et une soudure supplémentaires. Une pièce rectangulaire sans obstacle reste au bas de la fourchette ; un palier en L avec une poutre et trois canalisations grimpe vers le haut de la fourchette, même en toile unie.",
          "Enfin, les intégrations. Spots, lignes LED, bouches de ventilation, détecteurs, trappes de visite : chaque élément qui traverse la toile demande un renfort, un accessoire et du temps de pose. Le rendu est impeccable, mais cela se compte en matériel et en heures. C’est précisément ce qu’aucun tableau de prix au m² ne peut anticiper."
        ],
        "links": [
          {
            "label": "Trappes de visite",
            "href": "/products/inspection-hatch"
          },
          {
            "label": "Plafonds lumineux et imprimés",
            "href": "/products/light-print-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Ce que le prix comprend — et ce qu’il vous épargne ensuite",
        "paragraphs": [
          "Nos fourchettes sont des prix « pose comprise » : elles couvrent l’ensemble de la prestation, pas seulement la toile. Concrètement, un devis STRETCH comprend trois choses : la toile, découpée et soudée à vos dimensions dans nos propres ateliers européens (siège et production à Beveren-Waas, en Belgique) ; les profilés périphériques et les accessoires nécessaires ; la pose par une équipe certifiée, en une seule journée pour une pièce de taille courante. Le tout sans démolition, sans poussière, sans peinture : la pièce reste meublée et l’ancien plafond reste en place.",
          "Ce qu’une comparaison au m² ne montre pas, c’est la suite. Un plafond en plâtre réclame un coup de peinture régulier et suit les mouvements du bâtiment, fissures comprises. Une toile tendue ne se fissure pas, ne s’écaille pas, ne jaunit pas et se lave d’un coup d’éponge, et cela pendant plus de 25 ans. Sur la durée, le plafond qui semblait « cher » le jour du devis est souvent celui qui coûte le moins.",
          "Un point pratique à intégrer dans votre réflexion : la pose fait perdre quelques centimètres de hauteur sous plafond, un peu plus si vous choisissez d’y cacher des gaines ou des canalisations. En rénovation, c’est en général le prix — minime — d’un plafond neuf sans un gramme de gravats."
        ],
        "links": [
          {
            "label": "Peut-on laver un plafond tendu ?",
            "href": "/blog/kan-je-een-spanplafond-afwassen"
          },
          {
            "label": "Réparer un plafond fissuré",
            "href": "/blog/scheuren-in-plafond-herstellen"
          }
        ]
      },
      {
        "heading": "Trois exemples de prix de plafond tendu au m²",
        "paragraphs": [
          "Un séjour de 30 m², rectangulaire, en toile blanche mate unie : c’est le cas d’école du bas de fourchette, soit 70 à 90 € le m². Multipliez par votre surface, ou laissez le calculateur le faire, et vous tenez l’ordre de grandeur d’un plafond neuf posé en une journée, sans vider la pièce.",
          "Une salle de bains de 6 m² avec trois spots et une ligne lumineuse au-dessus de la douche : petite surface, beaucoup d’angles, toile résistante à l’humidité et plusieurs intégrations. On se situe en haut de la fourchette, entre 150 et 200 € le m². Le montant total reste contenu, mais le m² est cher parce que tout le travail se concentre sur peu de surface.",
          "Un open space de 80 m² où la réverbération fatigue tout le monde : une toile acoustique micro-perforée avec absorbant, entre 100 et 150 € le m², et la grande surface tire le chiffre vers le bas de cette fourchette. Le plafond reste visuellement identique à un plafond uni, mais la pièce devient enfin calme."
        ],
        "links": [
          {
            "label": "Séjour et home cinéma",
            "href": "/applications/living-cinema"
          },
          {
            "label": "Salle de bains et cuisine",
            "href": "/applications/bathroom-kitchen"
          },
          {
            "label": "Bureaux et commerces",
            "href": "/applications/office-retail"
          }
        ]
      },
      {
        "heading": "Du prix indicatif au devis ferme",
        "paragraphs": [
          "Passer de la fourchette au chiffre ferme est simple. Envoyez-nous les dimensions de la pièce, une ou deux photos et ce que vous avez en tête — finition, éclairage, acoustique — et vous recevez un devis concret, gratuit et sans engagement, généralement dans la journée, en jours ouvrés. Pas de visite obligatoire pour un premier chiffre ; le relevé précis se fait avant la fabrication, puisque la toile est confectionnée au millimètre pour votre pièce.",
          "Où que vous soyez en France, vous pouvez commander dès aujourd’hui : notre réseau de poseurs certifiés s’étoffe dans l’Hexagone et, en attendant qu’un partenaire soit installé près de chez vous, nos propres équipes se déplacent depuis notre production belge — à Paris, à Lyon comme à Marseille."
        ],
        "links": [
          {
            "label": "Plafond tendu à Paris",
            "href": "/dealers/paris"
          },
          {
            "label": "Plafond tendu à Lyon",
            "href": "/dealers/lyon"
          },
          {
            "label": "Plafond tendu à Marseille",
            "href": "/dealers/marseille"
          }
        ]
      },
      {
        "heading": "Demandez votre devis gratuit",
        "paragraphs": [
          "Vous êtes poseur, plaquiste, électricien ou décorateur et vous cherchez plutôt un tarif fourniture seule ? Les tarifs professionnels ne sont pas publiés ici : ils se trouvent dans l’espace client, ouvert aux professionnels après validation de leur compte. Si vous voulez poser vous-même, une formation de deux à trois jours à notre siège belge vous certifie : une seule certification couvre la pose à froid du polyester et la pose à chaud du film PVC.",
          "Pour votre propre plafond, deux étapes suffisent. Commencez par le calculateur de prix pour situer votre projet dans la fourchette, puis demandez votre devis gratuit et sans engagement : vous saurez, en général dès le jour même, ce que coûte réellement un plafond tendu dans votre pièce — et non dans une pièce moyenne."
        ],
        "links": [
          {
            "label": "Calculer le prix de mon plafond tendu",
            "href": "/price-calculator"
          },
          {
            "label": "Demander un devis gratuit",
            "href": "/contact"
          },
          {
            "label": "Formation installateur",
            "href": "/installer-training"
          }
        ]
      }
    ],
  },
  {
    slug: 'plafond-tendu-prix-pose',
    native: 'fr',
    markets: ['fr'],
    calculatorCta: true,
    title: "Plafond tendu : prix de la pose au m² et ce que le tarif comprend",
    excerpt: "Pose d’un plafond tendu : comptez 70 à 200 € HT/m² posé. Ce que le tarif comprend, pourquoi le prix baisse avec la surface, ce qui le fait grimper et pourquoi choisir un poseur certifié.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        "heading": "Prix de pose d’un plafond tendu : l’essentiel",
        "paragraphs": [
          "Pour un plafond tendu posé par un professionnel, comptez entre 70 et 200 € hors TVA (HT) par m², pose comprise. Ce n’est pas le prix de la toile seule : c’est celui d’un plafond fini, relevé sur place, confectionné sur mesure et posé dans la journée.",
          "L’écart entre le bas et le haut de la fourchette tient au type de toile, aux options d’éclairage ou d’acoustique et à la géométrie de la pièce. Fourchettes indicatives pour une pose complète :"
        ],
        "bullets": [
          "Plafond uni — polyester mat, ou film PVC mat, satiné ou laqué : 70 à 90 € HT/m²",
          "Plafond imprimé sur mesure, bord à bord : 90 à 100 € HT/m²",
          "Plafond acoustique micro-perforé avec absorbeur : 100 à 150 € HT/m²",
          "Plafond translucide rétroéclairé, modules LED compris : 130 à 160 € HT/m²",
          "Salle de bains avec éclairage intégré : 150 à 200 € HT/m²",
          "Ciel étoilé et structures préfabriquées : chiffrés au projet"
        ],
        "links": [
          {
            "label": "Guide complet des prix du plafond tendu",
            "href": "/blog/spanplafond-prijs"
          },
          {
            "label": "Estimer le prix de mon plafond au m²",
            "href": "/price-calculator"
          }
        ]
      },
      {
        "heading": "Ce que le prix de la pose comprend réellement",
        "paragraphs": [
          "Tous ces montants restent indicatifs : la toile étant soudée aux dimensions exactes de votre pièce, le prix ferme sort toujours d’un devis gratuit et sans engagement. Un tarif de pose sérieux couvre quatre postes. D’abord la prise de mesures sur place : le poseur relève la pièce au millimètre — longueurs, angles, hauteur, position des spots et des sorties de câbles — car la toile est fabriquée à ces cotes. Ensuite la confection : la membrane est découpée et soudée sur mesure dans notre production belge de Beveren-Waas, d’un seul tenant jusqu’à 5,15 m de large en polyester et 6,5 m en film PVC.",
          "Troisième poste, les profilés périphériques, fixés tout autour de la pièce quelques centimètres sous le plafond existant ; quatrième, la pose elle-même. Pour une pièce ordinaire, tout tient en une journée : profilés le matin, toile tendue l’après-midi, luminaires raccordés en fin de journée. Aucune démolition, aucun ponçage, aucune peinture : la pièce reste meublée et le poseur repart sans laisser de poussière.",
          "Le devis doit préciser noir sur blanc si les luminaires sont fournis et quels travaux électriques votre électricien réalise avant la pose — tirer les câbles jusqu’aux spots, par exemple."
        ],
        "links": [
          {
            "label": "Plafond tendu film PVC",
            "href": "/products/pvc-stretch-ceiling"
          },
          {
            "label": "Plafond tendu polyester",
            "href": "/products/polyester-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Pourquoi le prix au m² baisse avec la surface",
        "paragraphs": [
          "Le prix au mètre carré n’est pas linéaire, et c’est une bonne nouvelle pour les grandes pièces. Une part du travail est fixe quelle que soit la surface : déplacement, prise de mesures, préparation du chantier, mise à niveau des profilés, nettoyage. Sur 9 m² de salle d’eau, ces étapes pèsent lourd ; sur 45 m² de séjour, elles se diluent.",
          "La géométrie joue aussi. Le profilé se compte au mètre linéaire, la toile au mètre carré. Une pièce de 3 × 3 m réclame 12 m de profilé pour 9 m², soit 1,3 m de profilé par m² ; une pièce de 6 × 8 m en demande 28 m pour 48 m², soit à peine 0,6 m par m². Plus la pièce est grande, moins le périmètre pèse dans le prix du mètre carré.",
          "En pratique, une équipe de deux poseurs traite environ 50 m² dans la journée. Un grand séjour ouvert sur la cuisine ou un plateau de bureaux se situe donc en bas de la fourchette, tandis qu’un couloir étroit, avec ses angles rapprochés, affiche un prix au m² plus élevé — sans pour autant peser lourd sur la facture totale."
        ],
        "links": [
          {
            "label": "Salon et home cinéma",
            "href": "/applications/living-cinema"
          },
          {
            "label": "Bureaux et commerces",
            "href": "/applications/office-retail"
          }
        ]
      },
      {
        "heading": "Ce qui fait monter le tarif",
        "paragraphs": [
          "Tout ce qui rompt le rectangle coûte du temps de confection et du temps de pose. Chaque angle est un point de découpe et de soudure supplémentaire ; une courbe demande un profilé cintré ; un pilier impose une toile refermée autour de l’obstacle.",
          "Un séjour rectangulaire avec quatre spots se situe en bas de la fourchette de sa catégorie ; le même séjour avec une corniche lumineuse, une poutre à contourner et douze spots orientables grimpe nettement. Ce n’est pas une marge cachée, c’est du travail qui se voit ; le devis doit le détailler ligne par ligne, pour que vous puissiez arbitrer. Les intégrations qui font le charme du résultat ont, elles aussi, leur coût :"
        ],
        "bullets": [
          "Angles supplémentaires, décrochés et pièces en L : plus de profilé et plus de soudures au m².",
          "Courbes et changements de niveau : profilé cintré, gabarit et temps de pose.",
          "Spots, suspensions, rails et détecteurs : chaque percement reçoit un renfort et une découpe précise.",
          "Passages de tuyaux, poutres et gaines de ventilation : contournement soudé sur mesure.",
          "Rétroéclairage et lignes lumineuses : modules LED, alimentation et réglage.",
          "Trappes de visite pour garder l’accès aux vannes ou aux boîtiers."
        ],
        "links": [
          {
            "label": "Plafond lumineux et imprimé",
            "href": "/products/light-print-stretch-ceiling"
          },
          {
            "label": "Trappes de visite",
            "href": "/products/inspection-hatch"
          },
          {
            "label": "Salle de bains et cuisine",
            "href": "/applications/bathroom-kitchen"
          }
        ]
      },
      {
        "heading": "Pose à froid ou pose à chaud : quelle différence sur la facture ?",
        "paragraphs": [
          "Deux familles de toiles, deux méthodes de pose. La toile polyester se pose à froid : tricotée, très mate, elle est tendue à la main et clipsée dans le profilé, sans canon à chaleur ni temps de séchage. La pièce est utilisable dès le départ du poseur, et l’absence de chauffage rend la pose possible dans des locaux occupés.",
          "Le film PVC se pose à chaud : soudé sur mesure avec un bord harpon, il est assoupli en chauffant la pièce, accroché dans le profilé, puis se tend net et plan en refroidissant. Il offre les finitions laquée, satinée et mate, se démonte pour accéder au plénum et se recycle entièrement. C’est aussi la toile des plafonds translucides rétroéclairés.",
          "Sur la facture, les deux méthodes partent de la même fourchette de base : 70 à 90 € HT/m² pour un plafond uni. La différence de prix ne vient pas de la méthode mais de la finition, des options et de la géométrie. Le choix se fait donc sur l’usage : mat profond et pose sans chaleur d’un côté ; brillance, translucidité et démontabilité de l’autre."
        ],
        "links": [
          {
            "label": "Toiles et finitions",
            "href": "/materials"
          },
          {
            "label": "Qu’est-ce qu’un plafond tendu ?",
            "href": "/blog/what-is-a-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Pourquoi confier la pose de votre plafond tendu à un poseur certifié",
        "paragraphs": [
          "Un plafond tendu se joue au millimètre. La toile est soudée aux cotes relevées ; une prise de mesures approximative ou un angle oublié, et la toile ne se tend pas correctement — ou ne rentre pas du tout. En PVC, la maîtrise de la chaleur décide de la tension finale ; en polyester, c’est la main et l’ordre de clipsage. Ce savoir-faire s’apprend, il ne s’improvise pas.",
          "C’est pourquoi STRETCH forme ses poseurs à son siège belge : deux à trois jours de certification pratique — confection, profilés, pose à froid et à chaud, lumière et acoustique. Un poseur certifié termine une pièce courante en une journée, connaît l’Euroclasse B-s1,d0 (EN 13501-1) des membranes et vous remet la documentation sur demande. La garantie longue durée du fabricant est conditionnée à une pose dans les règles de l’art ; détails sur demande.",
          "Vous êtes artisan, plaquiste ou peintre et vous voulez ajouter le plafond tendu à votre offre ? La formation installateur est ouverte aux professionnels, sans expérience préalable. Vous êtes particulier ? Trouvez un poseur certifié près de chez vous, de Paris à Marseille."
        ],
        "links": [
          {
            "label": "Formation installateur",
            "href": "/installer-training"
          },
          {
            "label": "Trouver un poseur certifié",
            "href": "/dealers"
          },
          {
            "label": "Sécurité incendie du film PVC",
            "href": "/technical/pvc/fire-safety"
          }
        ]
      },
      {
        "heading": "Plafond tendu : du tarif indicatif au devis ferme",
        "paragraphs": [
          "Les fourchettes de cet article donnent un ordre de grandeur ; elles ne remplacent pas un chiffre ferme. Pour l’obtenir, envoyez-nous les dimensions de la pièce, une photo du plafond actuel et ce que vous imaginez — finition, nombre de spots, ligne lumineuse. Vous recevez un devis gratuit et sans engagement, généralement dans la journée, détaillé poste par poste.",
          "Vous préférez d’abord une estimation rapide ? Le calculateur de prix en ligne croise votre surface et votre type de plafond pour vous donner une première fourchette en quelques secondes. Ensuite, un poseur certifié passe prendre les mesures, et le tarif de pose devient un prix ferme. Demandez votre devis gratuit dès aujourd’hui."
        ],
        "links": [
          {
            "label": "Calculer le prix de mon plafond tendu",
            "href": "/price-calculator"
          },
          {
            "label": "Demander un devis gratuit",
            "href": "/contact"
          }
        ]
      }
    ],
  },
  {
    slug: 'plafond-tendu-devis-comparer',
    native: 'fr',
    markets: ['fr'],
    calculatorCta: true,
    title: "Devis plafond tendu : comment le lire et le comparer avant de signer",
    excerpt: "Trois devis de plafond tendu pour la même pièce, trois présentations différentes. Les postes à vérifier, les questions à poser, les pièges à éviter — et les fourchettes de prix indicatives pour situer chaque offre.",
    datePublished: '2026-09-02',
    dateModified: '2026-09-02',
    author: 'STRETCH',
    readMinutes: 6,
    body: [
      {
        "heading": "Pourquoi deux devis de plafond tendu se ressemblent rarement",
        "paragraphs": [
          "Trois devis pour le même séjour de 25 m², trois documents qui n’ont rien en commun : un prix au m² tout rond, un forfait sans détail, un tableau de six lignes. Ce n’est pas forcément un signe de mauvaise foi : un plafond tendu est un produit fabriqué sur mesure, dont la pose est un métier à part entière, avec des options qui pèsent lourd dans le total — et chaque entreprise structure son devis à sa manière.",
          "Pour comparer, il faut d’abord ramener chaque offre au même format. Un devis complet de plafond tendu contient au minimum les postes ci-dessous ; si l’un d’eux manque, réclamez-le avant de comparer quoi que ce soit. Un chiffre bas qui oublie la moitié des postes n’est pas un bon prix, c’est un devis incomplet."
        ],
        "bullets": [
          "La surface mesurée sur place, pièce par pièce, et la hauteur sous plafond perdue (quelques centimètres en général).",
          "La toile : type (polyester ou film PVC), finition, coloris, et la mention d’une pose sans soudure ou de l’emplacement de la soudure.",
          "Les profilés périphériques : type de fixation et métrage.",
          "La main-d’œuvre de pose, à la journée ou au forfait, avec le nombre de poseurs.",
          "Les intégrations : spots, lignes lumineuses, trappes de visite, grilles de ventilation.",
          "Les sujétions : angles, courbes, piliers, passages de tuyaux, dépose éventuelle de l’existant.",
          "Les frais de déplacement, le délai de fabrication et la date de pose."
        ],
        "links": [
          {
            "label": "Qu’est-ce qu’un plafond tendu ?",
            "href": "/blog/what-is-a-stretch-ceiling"
          },
          {
            "label": "Guide des prix du plafond tendu",
            "href": "/blog/spanplafond-prijs"
          }
        ]
      },
      {
        "heading": "Toile et main-d’œuvre : deux lignes, pas une",
        "paragraphs": [
          "Premier réflexe utile : séparer la fourniture de la pose. La toile sort d’un atelier : mesurée, découpée et soudée aux cotes exactes de votre pièce. La pose est un service : deux poseurs posent généralement une cinquantaine de m² par jour, sans démolition, sans poussière, meubles en place.",
          "Cette séparation montre où se cache l’écart entre deux devis. Une toile polyester tendue à froid et un film PVC tendu à chaud n’ont ni le même prix matière ni la même mise en œuvre — le polyester ne demande aucun temps de séchage, le PVC est chauffé pendant la pose. Si un devis fond tout dans un prix « pose comprise », demandez le détail poste par poste ; un professionnel sérieux le donne volontiers.",
          "Une pièce de 12 m² en L avec cinq spots demande presque autant de préparation qu’un séjour rectangulaire de 30 m² : une journée de pose reste une journée de pose, quelle que soit la surface. Voilà pourquoi le prix au m² baisse quand la surface augmente et grimpe avec la complexité."
        ],
        "links": [
          {
            "label": "Plafond tendu polyester",
            "href": "/products/polyester-stretch-ceiling"
          },
          {
            "label": "Plafond tendu film PVC",
            "href": "/products/pvc-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Largeur sans soudure : le détail qui change l’aspect final",
        "paragraphs": [
          "Une toile de plafond tendu est produite en laizes d’une largeur donnée. Au-delà, il faut soit souder deux laizes — la soudure reste alors présente — soit assumer une ligne de profilé. Chez STRETCH, le polyester est sans soudure jusqu’à 5,15 m et le film PVC jusqu’à 6,5 m : la quasi-totalité des pièces d’habitation se couvre d’un seul tenant.",
          "Le devis doit préciser si votre plafond sera d’un seul tenant et, s’il y a une soudure, où elle passera. Un séjour de 6 m de large en PVC sans soudure et le même séjour avec une soudure au milieu ne sont pas la même prestation, même à prix au m² identique."
        ],
        "links": [
          {
            "label": "Matériaux et finitions",
            "href": "/materials"
          },
          {
            "label": "Questions fréquentes",
            "href": "/faq"
          }
        ]
      },
      {
        "heading": "Classement au feu : exigez le document, pas la promesse",
        "paragraphs": [
          "« Ignifugée », « aux normes », « classée » : ces mentions abondent sur les devis, souvent sans référence précise. Ce qui compte, c’est l’Euroclasse selon la norme EN 13501-1, exprimée sous la forme B-s1,d0 — réaction au feu, fumées, gouttelettes enflammées. Nos toiles polyester et PVC sont classées B-s1,d0, documentation disponible sur demande.",
          "Demandez donc, pour chaque devis, l’Euroclasse exacte et le procès-verbal de classement qui l’atteste, au nom de la toile réellement posée, pas d’un produit générique. Selon l’usage du local, ce document peut vous être réclamé plus tard ; renseignez-vous sur les règles en vigueur. Une classe promise sans document ne vaut pas plus qu’un devis qui n’en parle pas."
        ],
        "links": [
          {
            "label": "Sécurité incendie du film PVC",
            "href": "/technical/pvc/fire-safety"
          },
          {
            "label": "Sécurité incendie du polyester",
            "href": "/technical/polyester/fire-safety"
          }
        ]
      },
      {
        "heading": "Fabricant ou revendeur : qui a fabriqué votre toile ?",
        "paragraphs": [
          "Derrière un devis de plafond tendu, il y a toujours deux acteurs : celui qui fabrique la toile et celui qui la pose. Parfois la même entreprise, souvent non. Ce n’est pas un problème en soi — la pose par un poseur local formé est la règle du métier — mais vous devez savoir qui répond de quoi si un défaut apparaît. Un revendeur qui ne cite ni fabricant ni référence ne cache pas forcément quelque chose, mais vous comparez alors un produit anonyme à un produit identifié.",
          "STRETCH est un fabricant : les toiles sont mesurées, découpées et soudées sur mesure dans notre atelier de Beveren-Waas, en Belgique ; le film PVC sort de notre second site de production, à Częstochowa, en Pologne. La pose est confiée à des poseurs certifiés, formés à notre siège en Belgique. Sur le devis, cela se traduit par un nom de fabricant, une référence de toile et une garantie longue durée, détails sur demande."
        ],
        "links": [
          {
            "label": "Trouver un poseur certifié",
            "href": "/dealers"
          },
          {
            "label": "Plafond tendu à Paris",
            "href": "/dealers/paris"
          },
          {
            "label": "Plafond tendu à Lyon",
            "href": "/dealers/lyon"
          }
        ]
      },
      {
        "heading": "Les questions à poser avant de signer",
        "paragraphs": [
          "Une fois les devis remis au même format, une poignée de questions suffit à départager les offres. Faites-vous confirmer les réponses par écrit : elles feront partie du contrat.",
          "Posez-les sans hésiter : un poseur qui connaît son métier y répond en quelques minutes, et c’est ce qui distingue une offre solide d’un prix lancé au téléphone."
        ],
        "bullets": [
          "Quelle surface exacte a été mesurée, et la hauteur sous plafond perdue est-elle indiquée ?",
          "Quelle toile précisément — fabricant, référence, finition, coloris — et avec quelle largeur sans soudure ?",
          "Le prix distingue-t-il fourniture et pose ? Combien de poseurs, combien de jours ?",
          "Chaque intégration — spot, ligne lumineuse, trappe de visite — est-elle chiffrée, fourniture et raccordement compris ?",
          "Quel classement au feu, et pouvez-vous m’envoyer le document au nom de cette toile ?",
          "Qui répond d’un défaut : le fabricant, le poseur, les deux ?",
          "Quel délai de fabrication, et quelle date de pose ?"
        ],
        "links": [
          {
            "label": "Trappes de visite",
            "href": "/products/inspection-hatch"
          },
          {
            "label": "Plafond lumineux",
            "href": "/products/light-print-stretch-ceiling"
          }
        ]
      },
      {
        "heading": "Les pièges classiques et le test des fourchettes de prix",
        "paragraphs": [
          "Premier piège : le prix au m² sans surface. Un « plafond tendu à partir de… » n’engage à rien tant que personne n’a mesuré la pièce : le mètre carré d’un couloir de 4 m² ne se paie pas au même tarif que celui d’un séjour de 40 m². Un devis se juge sur le montant total pour votre pièce, pas sur le prix d’appel.",
          "Deuxième piège : les options non chiffrées. « Spots : selon choix », « éclairage : en option », « trappe : à définir » — chaque mention de ce type est un supplément qui finira sur la facture. Exigez que tout ce qui est prévu soit chiffré, et que le reste soit exclu par écrit. Méfiez-vous aussi des devis muets sur la dépose de l’existant, l’évacuation des déchets ou les frais de déplacement.",
          "Pour garder les pieds sur terre, comparez le total ramené au m² avec nos fourchettes indicatives, hors TVA, pose comprise : environ 70 à 90 € pour une toile unie en PVC ou en polyester, 90 à 100 € pour un design imprimé, 100 à 150 € pour un plafond acoustique, 130 à 160 € pour un plafond translucide rétroéclairé, 150 à 200 € pour une salle de bains avec éclairage intégré. Nettement en dessous, un devis mérite une relecture poste par poste ; nettement au-dessus, il doit se justifier par la complexité ou les intégrations. Pour un premier ordre de grandeur, utilisez notre calculateur de prix ; pour un chiffre ferme, demandez un devis gratuit et sans engagement — avec vos dimensions et une photo, il vous parvient généralement le jour même."
        ],
        "links": [
          {
            "label": "Calculateur de prix",
            "href": "/price-calculator"
          },
          {
            "label": "Demander un devis gratuit",
            "href": "/contact"
          },
          {
            "label": "Guide des prix du plafond tendu",
            "href": "/blog/spanplafond-prijs"
          }
        ]
      }
    ],
  },
];

// Per-locale slugs come from the shared JSON (see BlogPost.slugs).
for (const p of blogPosts) {
  const m = blogSlugMap[p.slug];
  if (m && Object.keys(m).length > 0) p.slugs = m;
  // Market-native posts must be listed in the client-safe map the language
  // switcher uses, or a cross-domain link to them 404s on the sibling domain.
  if (p.native && marketOnlyBlogSlugs[p.slug] !== p.native) {
    throw new Error(`content.ts: market-native post "${p.slug}" is missing from marketOnlyBlogSlugs (src/lib/blog-slugs.ts)`);
  }
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const blogSlugs = blogPosts.map((p) => p.slug);

/** Posts visible on a locale — a post with `markets` exists ONLY there. The
 *  single source of the market rule: every place that lists posts uses this. */
export function blogPostsFor(locale: Locale): BlogPost[] {
  return blogPosts.filter((p) => !p.markets || p.markets.includes(locale));
}

/** The slug a post uses on a locale (its own, else the canonical one). */
export function slugForLocale(post: BlogPost, locale: Locale): string {
  return post.slugs?.[locale] ?? post.slug;
}

/** "/blog/<slug for this locale>" — the ONLY way to build a blog href. */
export function blogHref(post: BlogPost, locale: Locale): string {
  return `/blog/${slugForLocale(post, locale)}`;
}

/** Resolve the slug seen in a URL on a locale to the post (localized slug
 *  first; the canonical slug is NOT accepted on a locale that has its own —
 *  the old path 301s in redirects.mjs and must not double-serve). */
export function blogPostForSlug(locale: Locale, slugInUrl: string): BlogPost | undefined {
  return blogPostsFor(locale).find((p) => slugForLocale(p, locale) === slugInUrl);
}

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
    a: 'Up to 6.5 m seamless with PVC film, and up to 5.15 m with polyester. Larger spans are covered with a near-invisible welded joint or a deliberate profile line.',
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

// Reviews moved to src/lib/reviews.ts — genuine, permission-cleared Google
// reviews only. The placeholder testimonials and the hardcoded rating that
// lived here were removed (network audit 30 Aug 2026, F10): nothing may
// render or emit rating markup that is not derived from real review data.
