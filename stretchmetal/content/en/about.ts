// ============================================================================
// ABOUT (EN) — the group story. The heritage facts are true (the workshop was
// built for the group's own production); timeline dates marked [CONFIRM] need
// confirmation.
// ============================================================================
import type { AboutContent } from '@/content/types';

export const about: AboutContent = {
  metaTitle: 'About StretchMetal | The Belgian Stretchgroup Workshop',
  metaDescription:
    'The StretchMetal story: a Belgian stretch-ceiling group built its own metal workshop in Częstochowa, Poland. Today it also fabricates for external clients.',
  eyebrow: 'About us',
  title: [{ text: 'A workshop with' }, { text: 'a pedigree', accent: true }],
  lead: 'StretchMetal did not start from a business plan for metal services. It started from a need: a Belgian stretch-ceiling group needed steel it could rely on.',
  timeline: {
    title: 'How it came together',
    items: [
      {
        // [CONFIRM] year the group started in Belgium
        period: 'Belgium',
        title: 'The STRETCH group',
        text: 'Stretchgroup manufactures and installs seamless stretch ceilings across Benelux under the STRETCH brand (stretchplafond.be). Own production, own installation crews.',
      },
      {
        // [CONFIRM] year production started in Poland
        period: 'Częstochowa',
        title: 'Production in Poland',
        text: 'The group moves production to Częstochowa and grows the Polish ceiling brand Stretch Sufit (altodesign.pl). Every project needs steel: frames, light channels, substructures.',
      },
      {
        period: 'The workshop',
        title: 'Steel in-house',
        text: 'Instead of buying structures externally, the group hires professional metalworkers and welders and builds its own workshop. Quality stops depending on subcontractors.',
      },
      {
        period: 'Today',
        title: 'StretchMetal',
        text: 'The workshop has more capacity than the group consumes. That surplus goes to the market: StretchMetal takes orders from companies across Poland and the EU.',
      },
    ],
  },
  group: {
    title: 'The group behind the brand',
    paragraphs: [
      'Stretchgroup is a Belgian group with production in Poland: the STRETCH brand in Benelux, Stretch Sufit in Poland, and StretchMetal as the fabrication backbone of it all.',
      'For a client this means one thing: a workshop that does not live from one-off orders. Our production is loaded with the group\'s own projects, and external orders get the same care — because they run on the same floor, the same machines, with the same people.',
    ],
    imageLabel: 'Photo: the team on the production floor',
  },
  values: {
    title: 'What we stand on',
    items: [
      {
        title: 'Precision',
        text: 'The dimension on the drawing is the dimension on the part. Every element is checked before dispatch — we know first-hand what a misfitting structure costs at installation.',
      },
      {
        title: 'Communication',
        text: 'We answer within 48 hours, in English, Dutch or Polish. If something is not feasible, we say so up front — before taking the order, not after the deadline.',
      },
      {
        title: 'Deadlines',
        text: 'The date on the quote is binding. An installation crew waiting for steel is our daily reality — we know what a delay costs on site.',
      },
    ],
  },
  team: {
    title: 'The team',
    text: 'Professional metalworkers, welders and CNC operators from Częstochowa — a region that has lived off steel for generations. Team photos will appear here after the shoot on the shop floor.',
    imageLabel: 'Photo: the workshop team — shoot pending',
  },
};
