// ============================================================================
// HOME (EN) — full homepage copy, aimed at a German/Benelux purchasing
// manager. Values marked [CONFIRM] are working figures pending confirmation.
// ============================================================================
import type { HomeContent } from '@/content/types';

export const home: HomeContent = {
  metaTitle: 'StretchMetal — Metal Fabrication in Poland | Welding, Laser, CNC',
  metaDescription:
    'B2B metal fabrication in Częstochowa, Poland: MIG/TIG welding, sheet laser cutting, CNC machining, powder coating, custom steel structures. Quotes in 48 h.',
  hero: {
    badge: 'Part of the Belgian Stretchgroup · 🇧🇪 🇵🇱',
    title: [
      { text: 'Steel. Cut.' },
      { text: 'Welded.' },
      { text: 'Coated.', accent: true },
    ],
    lead: 'We built this workshop for our own production. Now it builds for you. Laser cutting, welding, CNC machining and powder coating — from drawing to finished part, in one plant in Częstochowa, Poland.',
    ctaPrimary: 'Send your drawing',
    ctaGhost: 'See our services',
    imageLabel: 'Photo: production hall — welding stations',
  },
  ticker: [
    'Laser cutting',
    'Welding',
    'CNC machining',
    'Powder coating',
    'Steel structures',
    'Design & engineering',
  ],
  stats: {
    eyebrow: 'In numbers',
    title: 'A workshop, not a middleman',
    items: [
      // [CONFIRM] every value below — working figures
      { value: '1,200 m²', label: 'of production floor', confirm: true },
      { value: '48 h', label: 'to answer with a quote', confirm: true },
      { value: '20 t', label: 'monthly capacity', confirm: true },
      { value: '2 countries', label: 'group presence in BE + PL', confirm: true },
      { value: 'EU', label: 'deliveries across the Union', confirm: true },
    ],
  },
  services: {
    eyebrow: 'Services',
    title: 'Six services. One plant.',
    lead: 'The complete production chain under one roof: from technical documentation through cutting and welding to powder coating and dispatch.',
    linkLabel: 'Service details',
  },
  process: {
    eyebrow: 'Process',
    title: 'From drawing to delivery',
    lead: 'A simple, repeatable process. No sales layer, no e-mail ping-pong — your drawing goes straight to production planning.',
    steps: [
      {
        title: 'Send your drawing',
        text: 'DXF, DWG, STEP or PDF via the quote form. A dimensioned sketch is enough — we can prepare the production documentation for you.',
      },
      {
        title: 'Quote within 48 h',
        text: 'We reply within 48 business hours: price, lead time and any engineering remarks on your design.',
      },
      {
        title: 'Production',
        text: 'Cutting, machining and welding to your documentation. We keep you posted — in English, Dutch or Polish.',
      },
      {
        title: 'QC and powder coating',
        text: 'Dimensions and welds are checked, then the part is powder coated in your RAL colour. It leaves the plant ready to install.',
      },
      {
        title: 'Delivery across the EU',
        text: 'Packed and shipped from Częstochowa — the A1 motorway runs past the plant. Germany and Benelux in 1–2 working days.',
      },
    ],
  },
  machinePark: {
    eyebrow: 'Machine park',
    title: 'The machines we run',
    lead: 'Concrete machines, concrete capabilities. The full list with parameters is on its own page.',
    cta: 'Full machine park',
    highlights: [
      // [CONFIRM] machine models and parameters — working data
      { name: 'Fiber laser cutter', spec: 'sheets up to 3000 × 1500 mm' },
      { name: 'MIG/MAG and TIG stations', spec: 'steel, stainless, aluminium' },
      { name: 'CNC mill and lathe', spec: 'machined parts and components' },
      { name: 'Powder coating line', spec: 'full RAL palette' },
    ],
  },
  whyUs: {
    eyebrow: 'Why us',
    title: 'Western standards. Polish economics.',
    items: [
      {
        title: 'Western-style communication',
        text: 'Belgian service culture: fast answers, agreements that hold, and a team that works in English, Dutch and Polish.',
      },
      {
        title: 'Polish manufacturing economics',
        text: 'Production costs below Western European levels — without a quality trade-off, because the same steel goes into our own group projects.',
      },
      {
        title: 'Częstochowa — steel country',
        text: 'The plant sits in Poland\'s Silesian steel region, right by the A1 motorway. Material is on hand; trucking to Germany or Benelux takes 1–2 days.',
      },
      {
        title: 'Drawing to coated part',
        text: 'Design, cutting, welding, coating and dispatch in one plant. One partner, one responsibility, one deadline.',
      },
    ],
  },
  heritage: {
    eyebrow: 'Our story',
    title: 'Built for our own production',
    paragraphs: [
      'Stretchgroup is a Belgian group manufacturing seamless stretch ceilings — the STRETCH brand in Benelux and Stretch Sufit in Poland. Every ceiling project needs steel: frames, light channels, substructures.',
      'So the group hired professional metalworkers in Częstochowa and built its own fabrication workshop. The result is a plant with more capacity than the group itself consumes.',
      'That surplus now serves the market. StretchMetal takes on orders from companies across Poland and the EU — on the same machines, with the same care that goes into the group\'s own production.',
    ],
    imageLabel: 'Photo: assembling a ceiling steel substructure',
    groupLinksTitle: 'Group brands',
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Fresh off the shop floor',
    lead: 'A cross-section of what we make — from serial frames to one-off custom structures.',
    cta: 'All projects',
  },
};
