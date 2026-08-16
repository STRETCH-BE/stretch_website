// ============================================================================
// PARK MASZYNOWY (PL) — lista maszyn i fakty o hali. WSZYSTKIE modele,
// parametry i liczby w tym pliku to dane ROBOCZE [CONFIRM] — do potwierdzenia
// z warsztatem przed publikacją jako fakt. Pole `confirm: true` renderuje się
// w UI jako wartość robocza.
// ============================================================================
import type { MachineParkContent } from '@/content/types';

export const machinePark: MachineParkContent = {
  metaTitle: 'Park maszynowy — StretchMetal Częstochowa',
  metaDescription:
    'Maszyny, na których pracujemy: wycinarka laserowa fiber, stanowiska MIG/TIG, frezarka i tokarka CNC, lakiernia proszkowa. Hala w Częstochowie.',
  eyebrow: 'Park maszynowy',
  title: [{ text: 'Maszyny,' }, { text: 'nie obietnice', accent: true }],
  lead: 'To, co stoi na hali, definiuje, co możemy wykonać. Poniżej aktualny park maszynowy — parametry graniczne zawsze potwierdzamy przy wycenie konkretnego detalu.',
  machines: [
    // [CONFIRM] każda pozycja poniżej: model, typ i parametry — dane robocze
    {
      name: 'Wycinarka laserowa fiber',
      type: 'Cięcie blach',
      spec: 'pole robocze 3 000 × 1 500 mm · stal do 20 mm, nierdzewka do 12 mm, aluminium do 10 mm',
      confirm: true,
    },
    {
      name: 'Stanowiska spawalnicze MIG/MAG',
      type: 'Spawanie',
      spec: 'stal czarna i ocynkowana · elementy do 6 000 mm',
      confirm: true,
    },
    {
      name: 'Stanowiska spawalnicze TIG',
      type: 'Spawanie',
      spec: 'stal nierdzewna i aluminium · spoiny widoczne i estetyczne',
      confirm: true,
    },
    {
      name: 'Frezarka CNC',
      type: 'Obróbka skrawaniem',
      spec: 'pole robocze 1 000 × 500 mm · 3 osie · tolerancje do IT7',
      confirm: true,
    },
    {
      name: 'Tokarka CNC',
      type: 'Obróbka skrawaniem',
      spec: 'średnice do 300 mm · detale jednostkowe i serie',
      confirm: true,
    },
    {
      name: 'Lakiernia proszkowa',
      type: 'Malowanie',
      spec: 'komora do 3 000 × 1 500 × 1 500 mm · pełny RAL · przygotowanie powierzchni',
      confirm: true,
    },
    {
      name: 'Piła taśmowa do metalu',
      type: 'Cięcie profili',
      spec: 'cięcie profili i rur pod kątem · przygotówka pod spawanie',
      confirm: true,
    },
    {
      name: 'Narzędzia pomiarowe',
      type: 'Kontrola jakości',
      spec: 'kontrola wymiarowa detali i konstrukcji przed wysyłką',
      confirm: true,
    },
  ],
  facts: {
    title: 'Hala w liczbach',
    items: [
      // [CONFIRM] wartości robocze
      { value: '1 200 m²', label: 'powierzchni produkcyjnej', confirm: true },
      { value: '20 t', label: 'mocy przerobowej miesięcznie', confirm: true },
      { value: 'A1', label: 'autostrada obok zakładu', confirm: true },
      { value: '48 h', label: 'na odpowiedź z wyceną', confirm: true },
    ],
  },
};
