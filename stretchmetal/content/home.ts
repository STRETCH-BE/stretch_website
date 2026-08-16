// ============================================================================
// HOME (PL) — pełna treść strony głównej, sekcja po sekcji. Wartości oznaczone
// [CONFIRM] to dane robocze do potwierdzenia przez właściciela — patrz raport.
// ============================================================================
import type { HomeContent } from '@/content/types';

export const home: HomeContent = {
  metaTitle: 'StretchMetal — obróbka metali Częstochowa | Spawanie, laser, CNC',
  metaDescription:
    'Warsztat obróbki metali w Częstochowie: spawanie MIG/TIG, cięcie laserowe blach, CNC, malowanie proszkowe i konstrukcje stalowe. Wycena w 48 h.',
  hero: {
    badge: 'Część belgijskiej Stretchgroup · 🇧🇪 🇵🇱',
    title: [
      { text: 'Stal. Cięta.' },
      { text: 'Spawana.' },
      { text: 'Malowana.', accent: true },
    ],
    lead: 'Ten warsztat zbudowaliśmy dla własnej produkcji. Teraz produkuje dla Ciebie. Cięcie laserowe, spawanie, CNC i malowanie proszkowe — od rysunku do gotowego elementu, w jednym zakładzie w Częstochowie.',
    ctaPrimary: 'Wyślij rysunek',
    ctaGhost: 'Zobacz usługi',
    imageLabel: 'Zdjęcie: hala produkcyjna — stanowiska spawalnicze',
  },
  ticker: [
    'Cięcie laserowe',
    'Spawanie',
    'CNC',
    'Malowanie proszkowe',
    'Konstrukcje stalowe',
    'Projektowanie',
  ],
  stats: {
    eyebrow: 'W liczbach',
    title: 'Warsztat, nie pośrednik',
    items: [
      // [CONFIRM] wszystkie wartości poniżej — dane robocze
      { value: '1 200 m²', label: 'powierzchni hali produkcyjnej', confirm: true },
      { value: '48 h', label: 'na odpowiedź z wyceną', confirm: true },
      { value: '20 t', label: 'mocy przerobowej miesięcznie', confirm: true },
      { value: '2 kraje', label: 'grupa obecna w Belgii i Polsce', confirm: true },
      { value: 'UE', label: 'dostawy do całej Unii', confirm: true },
    ],
  },
  services: {
    eyebrow: 'Usługi',
    title: 'Sześć usług. Jeden zakład.',
    lead: 'Kompletna ścieżka produkcyjna pod jednym dachem: od dokumentacji technicznej, przez cięcie i spawanie, po lakierowanie proszkowe i wysyłkę.',
    linkLabel: 'Szczegóły usługi',
  },
  process: {
    eyebrow: 'Proces',
    title: 'Od rysunku do dostawy',
    lead: 'Prosty, powtarzalny proces. Bez handlowców, bez przepychania maili — rysunek trafia prosto na produkcję.',
    steps: [
      {
        title: 'Wyślij rysunek',
        text: 'DXF, DWG, STEP lub PDF przez formularz wyceny. Wystarczy szkic z wymiarami — dokumentację możemy przygotować za Ciebie.',
      },
      {
        title: 'Wycena w 48 h',
        text: 'Odpowiadamy w ciągu 48 godzin roboczych: cena, termin i ewentualne uwagi technologiczne do projektu.',
      },
      {
        title: 'Produkcja',
        text: 'Cięcie, gięcie, obróbka i spawanie zgodnie z dokumentacją. O postępach informujemy — po polsku, angielsku lub niderlandzku.',
      },
      {
        title: 'Kontrola i malowanie',
        text: 'Sprawdzamy wymiary i spoiny, potem lakierujemy proszkowo w wybranym kolorze RAL. Element wyjeżdża gotowy do montażu.',
      },
      {
        title: 'Dostawa w całej UE',
        text: 'Pakujemy i wysyłamy z Częstochowy — autostrada A1 obok zakładu. Niemcy i Benelux w 1–2 dni robocze.',
      },
    ],
  },
  machinePark: {
    eyebrow: 'Park maszynowy',
    title: 'Maszyny, na których pracujemy',
    lead: 'Konkretne maszyny, konkretne możliwości. Pełną listę z parametrami znajdziesz na osobnej stronie.',
    cta: 'Cały park maszynowy',
    highlights: [
      // [CONFIRM] modele i parametry maszyn — dane robocze
      { name: 'Wycinarka laserowa fiber', spec: 'blachy do 3000 × 1500 mm' },
      { name: 'Stanowiska MIG/MAG i TIG', spec: 'stal, nierdzewka, aluminium' },
      { name: 'Frezarka i tokarka CNC', spec: 'obróbka detali i części maszyn' },
      { name: 'Lakiernia proszkowa', spec: 'pełna paleta RAL' },
    ],
  },
  whyUs: {
    eyebrow: 'Dlaczego my',
    title: 'Zachodni standard. Polska produkcja.',
    items: [
      {
        title: 'Komunikacja po zachodniemu',
        text: 'Belgijska kultura obsługi: odpowiadamy szybko, dotrzymujemy ustaleń, mówimy po polsku, angielsku i niderlandzku.',
      },
      {
        title: 'Ekonomia polskiej produkcji',
        text: 'Koszty wytworzenia niższe niż w Europie Zachodniej — bez kompromisu w jakości, bo tę samą stal montujemy we własnych projektach.',
      },
      {
        title: 'Częstochowa — region stali',
        text: 'Zakład w sercu śląskiego zagłębia stalowego, przy autostradzie A1. Materiał mamy pod ręką, transport do Niemiec i Beneluksu zajmuje 1–2 dni.',
      },
      {
        title: 'Od rysunku do gotowego elementu',
        text: 'Projekt, cięcie, spawanie, malowanie i wysyłka w jednym zakładzie. Jeden partner, jedna odpowiedzialność, jeden termin.',
      },
    ],
  },
  heritage: {
    eyebrow: 'Historia',
    title: 'Zbudowany dla własnej produkcji',
    paragraphs: [
      'Stretchgroup to belgijska grupa produkująca bezszwowe sufity napinane — marka STRETCH w Beneluksie i Stretch Sufit w Polsce. Każdy projekt sufitowy potrzebuje stali: ram, kanałów świetlnych, podkonstrukcji.',
      'Dlatego w Częstochowie zatrudniliśmy zawodowych ślusarzy i spawaczy i zbudowaliśmy własny warsztat metalowy. Powstał zakład o większych mocach, niż grupa sama konsumuje.',
      'Tę nadwyżkę oddajemy rynkowi. StretchMetal wykonuje zlecenia dla firm z Polski i całej UE — na tych samych maszynach i z tą samą starannością, z jaką produkuje dla grupy.',
    ],
    imageLabel: 'Zdjęcie: montaż podkonstrukcji stalowej sufitu',
    groupLinksTitle: 'Marki grupy',
  },
  projects: {
    eyebrow: 'Realizacje',
    title: 'Co ostatnio zjechało z hali',
    lead: 'Przykładowe zlecenia — od seryjnych ram po jednostkowe konstrukcje na wymiar.',
    cta: 'Wszystkie realizacje',
  },
};
