// ============================================================================
// PROJECTS (EN) — sample entries (sample: true) to be replaced with real cases
// after the photo shoot. Based on the workshop's real production profile but
// marked as samples in the UI.
// ============================================================================
import type { ProjectsContent } from '@/content/types';

export const projects: ProjectsContent = {
  metaTitle: 'Projects — StretchMetal, Częstochowa',
  metaDescription:
    'Sample workshop projects: ceiling substructures, light channels, frames and brackets. Laser cutting, welding, CNC and powder coating.',
  eyebrow: 'Projects',
  title: [{ text: 'From the floor,' }, { text: 'not a catalogue', accent: true }],
  lead: 'A cross-section of what we produce: from serial frames for the group to one-off custom structures. The gallery grows after every shoot on the floor.',
  metaLabels: { services: 'Services', material: 'Material', finish: 'Finish' },
  sampleNote: 'Sample entry — photos and project data in preparation.',
  entries: [
    {
      title: 'Ceiling substructures for the STRETCH group',
      services: ['laser cutting', 'welding', 'powder coating'],
      material: 'S235 steel, closed profiles',
      finish: 'RAL 9005 matt',
      imageLabel: 'Photo: ceiling substructure frame',
      sample: true,
    },
    {
      title: 'Powder-coated light channels',
      services: ['laser cutting', 'welding', 'powder coating'],
      material: '2 mm steel sheet',
      finish: 'RAL 9016 matt',
      imageLabel: 'Photo: light channel after coating',
      sample: true,
    },
    {
      title: 'Mounting brackets — series of 500',
      services: ['laser cutting', 'bending', 'powder coating'],
      material: 'S355 steel, 4 mm',
      finish: 'RAL 7016 texture',
      imageLabel: 'Photo: bracket series on a pallet',
      sample: true,
    },
    {
      title: 'Machine frame for an industrial build',
      services: ['design', 'welding', 'CNC machining'],
      material: 'S355 profiles + milled plates',
      finish: 'RAL 5010 gloss',
      imageLabel: 'Photo: machine frame before coating',
      sample: true,
    },
    {
      title: 'Industrial railing for a loft office',
      services: ['design', 'welding', 'powder coating'],
      material: 'mild steel, 40×40 profiles',
      finish: 'RAL 9005 satin',
      imageLabel: 'Photo: railing after installation',
      sample: true,
    },
    {
      title: 'Milled parts for a machine rebuild',
      services: ['CNC machining', 'design'],
      material: 'C45 steel, aluminium',
      finish: 'raw, oiled',
      imageLabel: 'Photo: CNC milled parts',
      sample: true,
    },
  ],
};
