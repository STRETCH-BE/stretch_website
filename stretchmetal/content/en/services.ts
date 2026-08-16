// ============================================================================
// SERVICES (EN) — hub + full content for the six service pages. Technical
// parameters in the spec tables are WORKING values marked [CONFIRM]; they are
// presented as "confirmed at quotation" in copy, never as verified fact.
// ============================================================================
import type { ServiceCard, ServiceContent, ServicesHubContent } from '@/content/types';

export const serviceCards: ServiceCard[] = [
  {
    key: 'laser',
    name: 'Laser cutting',
    blurb: 'Precision sheet cutting straight from your DXF/DWG files. Repeatability in tenths of a millimetre.',
    tags: ['steel', 'stainless', 'aluminium'],
  },
  {
    key: 'welding',
    name: 'Welding',
    blurb: 'MIG/MAG and TIG. Frames, structures and details — from single pieces to production runs.',
    tags: ['MIG/MAG', 'TIG', 'mild & stainless steel'],
  },
  {
    key: 'cnc',
    name: 'CNC machining',
    blurb: 'Milling and turning of machine parts and components to 2D/3D documentation.',
    tags: ['milling', 'turning', 'STEP/IGES'],
  },
  {
    key: 'coating',
    name: 'Powder coating',
    blurb: 'Powder coating in the full RAL palette, with proper surface preparation.',
    tags: ['full RAL', 'matt / gloss / texture'],
  },
  {
    key: 'design',
    name: 'Design & engineering',
    blurb: '2D/3D technical documentation. We turn your sketch into production-ready files.',
    tags: ['2D/3D', 'DXF', 'STEP'],
  },
  {
    key: 'structures',
    name: 'Steel structures',
    blurb: 'Complete custom structures: design, welding, coating and delivery from one plant.',
    tags: ['made to measure', 'turn-key fabrication'],
  },
];

export const servicesHub: ServicesHubContent = {
  metaTitle: 'Metal Fabrication Services in Poland | StretchMetal',
  metaDescription:
    'Welding, laser cutting, CNC machining, powder coating, design and custom steel structures. Six services in one plant in Częstochowa, Poland.',
  eyebrow: 'Services',
  title: [{ text: 'Six services.' }, { text: 'One plant.', accent: true }],
  lead: 'The whole production chain under one roof. You send a drawing — you receive a finished, coated part. No juggling three subcontractors.',
  cards: serviceCards,
};

const commonOrderSteps = [
  {
    title: 'Send your documentation',
    text: 'The quote form accepts DXF, DWG, STEP, IGES, PDF and ZIP — up to 15 MB. A description plus a sketch works too.',
  },
  {
    title: 'Receive a quote in 48 h',
    text: 'You get a price, a lead time and engineering remarks. For series we quote quantity brackets.',
  },
  {
    title: 'Approve and await delivery',
    text: 'On approval we schedule production. We ship from Częstochowa across the EU — Germany and Benelux in 1–2 working days.',
  },
];

export const services: Record<string, ServiceContent> = {
  welding: {
    key: 'welding',
    route: 'welding',
    name: 'Welding',
    metaTitle: 'MIG & TIG Welding Services in Poland | StretchMetal',
    metaDescription:
      'MIG/MAG and TIG welding: mild steel, stainless and aluminium. Frames, structures and details — single pieces or series. Quotes within 48 hours.',
    eyebrow: 'Service 02',
    title: [{ text: 'MIG & TIG' }, { text: 'welding', accent: true }],
    lead: 'We weld what we later install ourselves: frames, substructures, light channels. Professional welders, clean seams, dimensions held to the drawing — from one-offs to repeat series.',
    specs: {
      title: 'Technical scope',
      rows: [
        // [CONFIRM] every parameter in this table — working workshop data
        { k: 'Processes', v: 'MIG/MAG (135/136), TIG (141)' },
        { k: 'Materials', v: 'mild steel S235–S355, stainless 304/316, aluminium' },
        { k: 'Thicknesses', v: '1 mm to 20 mm' },
        { k: 'Part size', v: 'up to 6,000 mm long, up to approx. 1.5 t' },
        { k: 'Volumes', v: 'prototypes, small and medium series' },
        { k: 'File formats', v: 'DXF, DWG, STEP, PDF' },
      ],
      note: 'Limit parameters are confirmed at quotation — they depend on part geometry.',
    },
    applications: {
      title: 'What we weld',
      lead: 'The part families that leave our welding shop most often.',
      items: [
        {
          title: 'Frames and substructures',
          text: 'Load-bearing frames for enclosures, machines and ceilings — straight, repeatable, with mounting holes where they belong.',
        },
        {
          title: 'Support structures',
          text: 'Brackets, consoles and mounts that carry load. Welds placed where the drawing says.',
        },
        {
          title: 'Architectural elements',
          text: 'Light channels, housings, trim profiles — parts that stay visible after coating.',
        },
        {
          title: 'Stainless tanks and housings',
          text: 'TIG-welded stainless steel where seam aesthetics and corrosion resistance matter.',
        },
      ],
    },
    howToOrder: { title: 'How to order', steps: commonOrderSteps },
    faq: {
      title: 'Frequently asked',
      items: [
        {
          q: 'Do you weld single pieces or only series?',
          a: 'Both. The workshop was built for one-off structures for our group\'s projects, so single parts are everyday work. For series we offer quantity pricing.',
        },
        {
          q: 'Do you hold welding certifications?',
          a: 'Our welders are experienced professionals, but we do not claim system certifications (EN 1090, ISO 3834). If your project requires them, say so in the enquiry — we will tell you straight whether we can take it on.',
        },
        {
          q: 'How do you control weld quality?',
          a: 'Visual and dimensional inspection of every part before dispatch. Our toughest customer is the group\'s own installation crews — a structure that doesn\'t fit goes back to the shop floor, not to a client.',
        },
        {
          q: 'Can you prepare documentation if I only have a sketch?',
          a: 'Yes. Our design office turns sketches into 2D/3D documentation and agrees the dimensions with you before production. It appears as a separate line on the quote.',
        },
        {
          q: 'Do you weld aluminium?',
          a: 'Yes, TIG and MIG. For aluminium please state the alloy (e.g. 6060, 5754) — we match filler and parameters accordingly.',
        },
      ],
    },
    related: { title: 'Related services', keys: ['laser', 'coating', 'structures'] },
  },

  laser: {
    key: 'laser',
    route: 'laser',
    name: 'Laser cutting',
    metaTitle: 'Laser Cutting Services in Poland | StretchMetal',
    metaDescription:
      'Sheet metal laser cutting from DXF/DWG files: steel, stainless, aluminium. Short lead times, EU-wide delivery from Poland. Quotes in 48 hours.',
    eyebrow: 'Service 01',
    title: [{ text: 'Laser' }, { text: 'cutting', accent: true }],
    lead: 'From DXF file to cut part — no corrections, no surprises. We cut steel, stainless and aluminium on a fiber laser with the kind of repeatability you only notice at assembly.',
    specs: {
      title: 'Technical scope',
      rows: [
        // [CONFIRM] every parameter in this table — working workshop data
        { k: 'Technology', v: 'fiber laser' },
        { k: 'Sheet format', v: 'up to 3,000 × 1,500 mm' },
        { k: 'Mild steel', v: 'up to 20 mm' },
        { k: 'Stainless steel', v: 'up to 12 mm' },
        { k: 'Aluminium', v: 'up to 10 mm' },
        { k: 'File formats', v: 'DXF, DWG (preferred), STEP, PDF' },
      ],
      note: 'Thickness limits depend on grade and the edge quality you need — confirmed at quotation.',
    },
    applications: {
      title: 'What we cut',
      lead: 'From single blanks to complete nested part sets.',
      items: [
        {
          title: 'Blanks and structural plates',
          text: 'Flat parts for further processing: bending, welding, bolting. Holes and chamfers in one pass.',
        },
        {
          title: 'Serial parts',
          text: 'Nesting optimised per sheet — less scrap, lower per-piece price on series.',
        },
        {
          title: 'Decorative panels',
          text: 'Perforations, logos, architectural panels. A laser edge usually needs no grinding.',
        },
        {
          title: 'Prototypes',
          text: 'One test piece before you commit to a series. Fast loop: file in the morning, part on its way within days.',
        },
      ],
    },
    howToOrder: {
      title: 'How to order',
      steps: [
        {
          title: 'Send a DXF or DWG',
          text: 'Curves at 1:1 scale, no dimension lines on the cutting layer. No CAD file? A dimensioned PDF works — we redraw it.',
        },
        ...commonOrderSteps.slice(1),
      ],
    },
    faq: {
      title: 'Frequently asked',
      items: [
        {
          q: 'What file do you need for a quote?',
          a: 'Ideally DXF or DWG at 1:1 scale plus material, thickness and quantity. A dimensioned PDF is fine too — production file preparation is added to the quote.',
        },
        {
          q: 'Do you supply material or do I send my own?',
          a: 'By default we cut from our own certified stock (mill certificates available). Customer-supplied material is possible — we agree it at quotation.',
        },
        {
          q: 'What cutting accuracy do you hold?',
          a: 'Typically ±0.1–0.2 mm depending on thickness and grade. Mark critical dimensions on the drawing and we will tell you plainly whether we can hold them.',
        },
        {
          q: 'Do you bend cut parts?',
          a: 'Cutting is combined with CNC machining, welding and coating in-house; bending is done with a partner next door. Mark the bends on your drawing and we quote the whole job as one service.',
        },
        {
          q: 'How long does an order take?',
          a: 'Typical parts from stock material: a few working days from quote approval. The lead time always comes with the price — and it is binding.',
        },
      ],
    },
    related: { title: 'Related services', keys: ['welding', 'cnc', 'coating'] },
  },

  cnc: {
    key: 'cnc',
    route: 'cnc',
    name: 'CNC machining',
    metaTitle: 'CNC Machining Services in Poland | StretchMetal',
    metaDescription:
      'CNC milling and turning of machine parts to 2D/3D documentation. Steel, stainless, aluminium. Plant in Częstochowa, delivery across the EU.',
    eyebrow: 'Service 03',
    title: [{ text: 'CNC' }, { text: 'machining', accent: true }],
    lead: 'We mill and turn parts that must fit first time: machine components, fasteners, weld-on details. STEP documentation in, finished part out.',
    specs: {
      title: 'Technical scope',
      rows: [
        // [CONFIRM] every parameter in this table — working workshop data
        { k: 'Operations', v: '3-axis milling, turning' },
        { k: 'Materials', v: 'steel, stainless, aluminium, engineering plastics' },
        { k: 'Milling envelope', v: 'up to 1,000 × 500 mm' },
        { k: 'Turning', v: 'diameters up to 300 mm' },
        { k: 'Tolerances', v: 'typically to IT7 per documentation' },
        { k: 'File formats', v: 'STEP, IGES, DXF, dimensioned PDF' },
      ],
      note: 'Tolerances and surface finish are confirmed per part at quotation.',
    },
    applications: {
      title: 'What we machine',
      lead: 'Typical parts off our machines.',
      items: [
        {
          title: 'Machine parts',
          text: 'Mounting plates, bushings, shafts, guide elements — for rebuilds and new builds.',
        },
        {
          title: 'Details for welded structures',
          text: 'Milled parts that go into our own fabrications: pins, seats, face plates.',
        },
        {
          title: 'Short runs and prototypes',
          text: 'From one piece. Verify a prototype before ordering the series.',
        },
        {
          title: 'Post-laser finishing',
          text: 'Tapping, countersinking, facing — we finish parts cut from sheet in-house.',
        },
      ],
    },
    howToOrder: { title: 'How to order', steps: commonOrderSteps },
    faq: {
      title: 'Frequently asked',
      items: [
        {
          q: 'Which files do you accept?',
          a: 'Ideally STEP or IGES plus a PDF production drawing with tolerances. A dimensioned PDF alone also works — our design office prepares the model.',
        },
        {
          q: 'Do you make single pieces?',
          a: 'Yes. A large share of our work is one-off parts for the group\'s structures, so there is no minimum order quantity.',
        },
        {
          q: 'What tolerances do you hold?',
          a: 'Typically to IT7 for milling and turning. Mark critical dimensions on the drawing — we confirm feasibility before accepting the job.',
        },
        {
          q: 'Do you machine customer-supplied material?',
          a: 'Yes — we take jobs both from our own certified stock and from material you supply.',
        },
        {
          q: 'Can CNC be combined with your other services?',
          a: 'That is our main advantage: a part can be laser cut, welded, machined and powder coated without leaving the plant.',
        },
      ],
    },
    related: { title: 'Related services', keys: ['laser', 'design', 'welding'] },
  },

  coating: {
    key: 'coating',
    route: 'coating',
    name: 'Powder coating',
    metaTitle: 'Powder Coating Services in Poland | StretchMetal',
    metaDescription:
      'Powder coating of steel and aluminium in the full RAL palette: matt, gloss, texture. Surface preparation included. EU-wide delivery from Poland.',
    eyebrow: 'Service 04',
    title: [{ text: 'Powder' }, { text: 'coating', accent: true }],
    lead: 'The last step before a part goes straight to installation. We powder coat structures and details — our own and supplied — in any RAL colour, surface preparation included.',
    specs: {
      title: 'Technical scope',
      rows: [
        // [CONFIRM] every parameter in this table — working workshop data
        { k: 'Colours', v: 'full RAL palette; matt, satin, gloss, texture' },
        { k: 'Substrates', v: 'mild steel, galvanised steel, aluminium' },
        { k: 'Part size', v: 'up to 3,000 × 1,500 × 1,500 mm' },
        { k: 'Surface preparation', v: 'degreasing, abrasive blasting' },
        { k: 'Coating thickness', v: 'typically 60–120 µm' },
      ],
      note: 'Booth dimensions and available preparation are confirmed at quotation.',
    },
    applications: {
      title: 'What we coat',
      lead: 'Powder coating where durability and looks both count.',
      items: [
        {
          title: 'Steel structures',
          text: 'Frames, brackets and substructures — ours and supplied. Coating closes the production loop in one plant.',
        },
        {
          title: 'Architectural elements',
          text: 'Profiles, panels, light channels, railings. Colour matched to the interior design, repeatable across the series.',
        },
        {
          title: 'Housings and serial parts',
          text: 'A consistent finish across the whole series — no shade differences between batches.',
        },
        {
          title: 'Outdoor elements',
          text: 'Weather-resistant coatings, on galvanised substrate for longer protection.',
        },
      ],
    },
    howToOrder: { title: 'How to order', steps: commonOrderSteps },
    faq: {
      title: 'Frequently asked',
      items: [
        {
          q: 'Do you coat parts you did not fabricate?',
          a: 'Yes, we take external structures and parts. Conditions: it must fit the booth and be suitable for surface preparation.',
        },
        {
          q: 'Which colours are available?',
          a: 'The full RAL palette in matt, satin, gloss or texture. Non-stock colours are ordered per job — that can add a few days to the lead time.',
        },
        {
          q: 'How do you prepare the surface?',
          a: 'Degreasing and abrasive blasting before coating as standard. Adhesion depends on preparation — we never skip it.',
        },
        {
          q: 'Is the coating suitable outdoors?',
          a: 'Yes, with the right substrate. Outdoors we recommend galvanised steel under the powder coat — and we say so explicitly in the quote.',
        },
        {
          q: 'How long does coating take?',
          a: 'Parts from our current production are coated within days. For supplied parts the date is agreed at quotation — usually within a week.',
        },
      ],
    },
    related: { title: 'Related services', keys: ['welding', 'structures', 'laser'] },
  },

  design: {
    key: 'design',
    route: 'design',
    name: 'Design & engineering',
    metaTitle: 'Design & Technical Documentation | StretchMetal',
    metaDescription:
      '2D/3D production documentation: from sketch to DXF/STEP files. An engineer on the shop floor, not in a remote office. Częstochowa, Poland.',
    eyebrow: 'Service 05',
    title: [{ text: 'Design &' }, { text: 'engineering', accent: true }],
    lead: 'Not every client has a design department. Our engineer turns a sketch, a photo or an on-site measurement into production-ready 2D/3D documentation — and checks along the way whether the part can be made cheaper.',
    specs: {
      title: 'Technical scope',
      rows: [
        // [CONFIRM] every parameter in this table — working data
        { k: 'Scope', v: '3D models, 2D production drawings, nestings, assembly documentation' },
        { k: 'Output', v: 'DXF, DWG, STEP, PDF' },
        { k: 'Input', v: 'sketch, photo, on-site measurement, legacy drawing, sample part' },
        { k: 'Optimisation', v: 'manufacturability, sheet nesting, weld reduction' },
      ],
      note: 'Order design on its own, or as the first step of production with us.',
    },
    applications: {
      title: 'What we design',
      lead: 'Documentation made next to the machines — not at a desk detached from production.',
      items: [
        {
          title: 'Documentation from a sketch',
          text: 'An idea on paper? We come back with a 3D model and a drawing for approval, then produce it.',
        },
        {
          title: 'Reverse engineering',
          text: 'We measure a worn part and produce documentation that lets you remake it serially.',
        },
        {
          title: 'Design for manufacturing',
          text: 'We adapt documentation to the process: less welding, better nesting, lower cost per piece.',
        },
        {
          title: 'Complete structures',
          text: 'A frame, platform or substructure designed from scratch — with profile selection and mounting points.',
        },
      ],
    },
    howToOrder: {
      title: 'How to order',
      steps: [
        {
          title: 'Describe what you need',
          text: 'Sketch, photo, dimensions — whatever you have. The quote form takes files up to 15 MB.',
        },
        {
          title: 'Receive scope and price',
          text: 'Within 48 h we return with the documentation scope, the design fee and — if you want — the fabrication price.',
        },
        {
          title: 'Approve the documentation',
          text: 'You approve the model and drawings before production. The documentation is yours — source files included.',
        },
      ],
    },
    faq: {
      title: 'Frequently asked',
      items: [
        {
          q: 'Can I order the design alone, without production?',
          a: 'Yes. You receive source files (DXF/STEP) and can produce anywhere. In practice, doing both with us usually costs less.',
        },
        {
          q: 'Who owns the documentation?',
          a: 'You do. Once the design work is paid, the documentation and source files are your property.',
        },
        {
          q: 'Do you sign NDAs?',
          a: 'Yes, on request, before you send files. Client documentation is treated as confidential with or without an NDA — we never share it with third parties.',
        },
        {
          q: 'What does documentation cost?',
          a: 'It depends on complexity — from simple blanks to assemblies with dozens of parts. The fee is quoted up front, before any work starts.',
        },
      ],
    },
    related: { title: 'Related services', keys: ['structures', 'cnc', 'laser'] },
  },

  structures: {
    key: 'structures',
    route: 'structures',
    name: 'Steel structures',
    metaTitle: 'Custom Steel Structures from Poland | StretchMetal',
    metaDescription:
      'Complete custom steel structures: design, cutting, welding, powder coating and EU delivery. One fabricator, one deadline. Częstochowa, Poland.',
    eyebrow: 'Service 06',
    title: [{ text: 'Custom steel' }, { text: 'structures', accent: true }],
    lead: 'Our specialty since day one: complete structures from design to coating. Frames, platforms, substructures and enclosures — exactly the kind we erect in our own group projects.',
    specs: {
      title: 'Technical scope',
      rows: [
        // [CONFIRM] every parameter in this table — working workshop data
        { k: 'Scope', v: 'design → cutting → welding → machining → coating → delivery' },
        { k: 'Materials', v: 'S235–S355 profiles and sheet, stainless, aluminium' },
        { k: 'Size', v: 'elements up to 6,000 mm, modules sized for road transport' },
        { k: 'Weight', v: 'up to approx. 1.5 t per element' },
        { k: 'Assembly', v: 'prepared for site assembly: holes, part marking, bolt kits' },
      ],
      note: 'Larger structures are split into transport modules — we design the splits for assembly.',
    },
    applications: {
      title: 'What we build',
      lead: 'Structures that leave the plant ready to bolt together on site.',
      items: [
        {
          title: 'Ceiling and lighting substructures',
          text: 'Our heritage: frames and channels for stretch ceilings, produced for the group for years.',
        },
        {
          title: 'Machine and equipment frames',
          text: 'Load-bearing frames for industrial builds — welded, machined, with mounting faces.',
        },
        {
          title: 'Platforms, stairs, railings',
          text: 'Industrial access steelwork made to measure, with grating and powder coating.',
        },
        {
          title: 'One-off builds',
          text: 'Non-standard structures for a specific project: from industrial furniture to display frameworks.',
        },
      ],
    },
    howToOrder: { title: 'How to order', steps: commonOrderSteps },
    faq: {
      title: 'Frequently asked',
      items: [
        {
          q: 'Can you design the structure from scratch?',
          a: 'Yes — that is our standard mode. You describe function and dimensions; we design, show you the model for approval, then produce.',
        },
        {
          q: 'Do you fabricate structures covered by EN 1090?',
          a: 'We do not claim EN 1090 certification. Structures that require it (CE-marked load-bearing building elements) are referred to certified fabricators — we say so up front at enquiry.',
        },
        {
          q: 'Do you deliver and install?',
          a: 'We deliver across the EU. Structures are prepared for self-assembly: marked parts, bolt kits, an assembly drawing. On-site installation can be discussed for larger projects.',
        },
        {
          q: 'How does transport of large structures work?',
          a: 'We design modular splits sized for road transport from Częstochowa — the A1 motorway is next to the plant. Germany and Benelux typically take 1–2 days.',
        },
        {
          q: 'Is there a minimum order size?',
          a: 'No minimum. From a single bracket to a series of frames — we quote anything within our technical range.',
        },
      ],
    },
    related: { title: 'Related services', keys: ['design', 'welding', 'coating'] },
  },
};
