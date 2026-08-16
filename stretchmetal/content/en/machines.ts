// ============================================================================
// MACHINE PARK (EN) — machine list and hall facts. ALL models, parameters and
// figures in this file are WORKING data [CONFIRM]; `confirm: true` renders a
// "to be confirmed" marker in the UI.
// ============================================================================
import type { MachineParkContent } from '@/content/types';

export const machinePark: MachineParkContent = {
  metaTitle: 'Machine Park — StretchMetal, Częstochowa',
  metaDescription:
    'The machines we run: fiber laser cutter, MIG/TIG stations, CNC mill and lathe, powder coating line. Production hall in Częstochowa, Poland.',
  eyebrow: 'Machine park',
  title: [{ text: 'Machines,' }, { text: 'not promises', accent: true }],
  lead: 'What stands on the floor defines what we can make. Below is the current machine park — limit parameters are always confirmed at quotation for your specific part.',
  machines: [
    // [CONFIRM] every entry below: model, type and parameters — working data
    {
      name: 'Fiber laser cutter',
      type: 'Sheet cutting',
      spec: 'working area 3,000 × 1,500 mm · mild steel to 20 mm, stainless to 12 mm, aluminium to 10 mm',
      confirm: true,
    },
    {
      name: 'MIG/MAG welding stations',
      type: 'Welding',
      spec: 'mild and galvanised steel · elements up to 6,000 mm',
      confirm: true,
    },
    {
      name: 'TIG welding stations',
      type: 'Welding',
      spec: 'stainless steel and aluminium · visible, aesthetic seams',
      confirm: true,
    },
    {
      name: 'CNC milling machine',
      type: 'Machining',
      spec: 'working area 1,000 × 500 mm · 3 axes · tolerances to IT7',
      confirm: true,
    },
    {
      name: 'CNC lathe',
      type: 'Machining',
      spec: 'diameters up to 300 mm · one-offs and series',
      confirm: true,
    },
    {
      name: 'Powder coating line',
      type: 'Coating',
      spec: 'booth up to 3,000 × 1,500 × 1,500 mm · full RAL · surface preparation',
      confirm: true,
    },
    {
      name: 'Metal band saw',
      type: 'Profile cutting',
      spec: 'angle cutting of profiles and tubes · weld prep',
      confirm: true,
    },
    {
      name: 'Measuring equipment',
      type: 'Quality control',
      spec: 'dimensional inspection of parts and structures before dispatch',
      confirm: true,
    },
  ],
  facts: {
    title: 'The hall in numbers',
    items: [
      // [CONFIRM] working figures
      { value: '1,200 m²', label: 'of production floor', confirm: true },
      { value: '20 t', label: 'monthly capacity', confirm: true },
      { value: 'A1', label: 'motorway next to the plant', confirm: true },
      { value: '48 h', label: 'to answer with a quote', confirm: true },
    ],
  },
};
