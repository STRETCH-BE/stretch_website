// ============================================================================
// O NAS (PL) — historia grupy i zakładu. Fakty o rodowodzie są prawdziwe
// (warsztat powstał dla własnej produkcji grupy); daty w osi czasu oznaczone
// [CONFIRM] wymagają potwierdzenia.
// ============================================================================
import type { AboutContent } from '@/content/types';

export const about: AboutContent = {
  metaTitle: 'O nas — StretchMetal | Warsztat belgijskiej Stretchgroup',
  metaDescription:
    'Historia StretchMetal: belgijska grupa sufitów napinanych zbudowała w Częstochowie własny warsztat metalowy. Dziś produkuje także dla klientów zewnętrznych.',
  eyebrow: 'O nas',
  title: [{ text: 'Warsztat z' }, { text: 'rodowodem', accent: true }],
  lead: 'StretchMetal nie powstał z biznesplanu na usługi metalowe. Powstał z potrzeby: belgijska grupa sufitów napinanych potrzebowała stali, na którą mogła liczyć.',
  timeline: {
    title: 'Jak to się ułożyło',
    items: [
      {
        // [CONFIRM] rok startu działalności grupy w Belgii
        period: 'Belgia',
        title: 'Grupa STRETCH',
        text: 'Stretchgroup produkuje i montuje bezszwowe sufity napinane w Beneluksie pod marką STRETCH (stretchplafond.be). Własna produkcja, własne ekipy montażowe.',
      },
      {
        // [CONFIRM] rok uruchomienia produkcji w Polsce
        period: 'Częstochowa',
        title: 'Produkcja w Polsce',
        text: 'Grupa przenosi produkcję do Częstochowy i rozwija polską markę sufitową Stretch Sufit (altodesign.pl). Każdy projekt potrzebuje stali: ram, kanałów świetlnych, podkonstrukcji.',
      },
      {
        period: 'Warsztat',
        title: 'Własny metal',
        text: 'Zamiast kupować konstrukcje na zewnątrz, grupa zatrudnia zawodowych ślusarzy i spawaczy i buduje własny warsztat metalowy. Jakość przestaje zależeć od podwykonawców.',
      },
      {
        period: 'Dziś',
        title: 'StretchMetal',
        text: 'Warsztat ma większe moce, niż grupa sama konsumuje. Nadwyżkę oddajemy rynkowi: StretchMetal przyjmuje zlecenia firm z Polski i całej UE.',
      },
    ],
  },
  group: {
    title: 'Grupa za marką',
    paragraphs: [
      'Stretchgroup to belgijska grupa z produkcją w Polsce: marka STRETCH w Beneluksie, Stretch Sufit w Polsce i StretchMetal jako zaplecze konstrukcyjne całości.',
      'Dla klienta oznacza to jedno: warsztat, który nie żyje z pojedynczych zleceń. Nasza produkcja jest obciążona własnymi projektami grupy, a zlecenia zewnętrzne traktujemy z tą samą starannością — bo pracują na tej samej hali, na tych samych maszynach i z tymi samymi ludźmi.',
    ],
    imageLabel: 'Zdjęcie: zespół na hali produkcyjnej',
  },
  values: {
    title: 'Na czym stoimy',
    items: [
      {
        title: 'Precyzja',
        text: 'Wymiar z rysunku to wymiar na detalu. Kontrolujemy każdy element przed wysyłką, bo sami wiemy, ile kosztuje montaż konstrukcji, która nie pasuje.',
      },
      {
        title: 'Komunikacja',
        text: 'Odpowiadamy w 48 godzin, po polsku, angielsku lub niderlandzku. Jeśli coś nie jest wykonalne, mówimy to wprost — przed przyjęciem zlecenia, nie po terminie.',
      },
      {
        title: 'Terminy',
        text: 'Termin z wyceny jest wiążący. Grupa montażowa czekająca na konstrukcję to nasza codzienność — wiemy, co znaczy opóźnienie na budowie.',
      },
    ],
  },
  team: {
    title: 'Zespół',
    text: 'Zawodowi ślusarze, spawacze i operatorzy CNC z Częstochowy — regionu, który stalą stoi od pokoleń. Zdjęcia zespołu pojawią się tu po sesji na hali.',
    imageLabel: 'Zdjęcie: zespół warsztatu — do sesji',
  },
};
