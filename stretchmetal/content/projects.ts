// ============================================================================
// REALIZACJE (PL) — wpisy przykładowe (sample: true) do podmiany na prawdziwe
// case'y po sesji zdjęciowej. Oparte na realnym profilu produkcji warsztatu
// (konstrukcje dla grupy), ale oznaczone w UI jako przykładowe.
// ============================================================================
import type { ProjectsContent } from '@/content/types';

export const projects: ProjectsContent = {
  metaTitle: 'Realizacje — StretchMetal Częstochowa',
  metaDescription:
    'Przykładowe realizacje warsztatu: podkonstrukcje sufitowe, kanały świetlne, ramy i wsporniki. Cięcie, spawanie, CNC i malowanie proszkowe.',
  eyebrow: 'Realizacje',
  title: [{ text: 'Z hali,' }, { text: 'nie z katalogu', accent: true }],
  lead: 'Przekrój tego, co produkujemy: od seryjnych ram dla grupy po jednostkowe konstrukcje na wymiar. Galeria będzie rosła po każdej sesji na hali.',
  metaLabels: { services: 'Usługi', material: 'Materiał', finish: 'Wykończenie' },
  sampleNote: 'Wpis przykładowy — zdjęcia i dane realizacji w przygotowaniu.',
  entries: [
    {
      title: 'Podkonstrukcje sufitowe dla grupy STRETCH',
      services: ['cięcie laserowe', 'spawanie', 'malowanie proszkowe'],
      material: 'stal S235, profile zamknięte',
      finish: 'RAL 9005 mat',
      imageLabel: 'Zdjęcie: rama podkonstrukcji sufitowej',
      sample: true,
    },
    {
      title: 'Kanały świetlne malowane proszkowo',
      services: ['cięcie laserowe', 'spawanie', 'malowanie proszkowe'],
      material: 'blacha stalowa 2 mm',
      finish: 'RAL 9016 mat',
      imageLabel: 'Zdjęcie: kanał świetlny po malowaniu',
      sample: true,
    },
    {
      title: 'Wsporniki montażowe — seria 500 szt.',
      services: ['cięcie laserowe', 'gięcie', 'malowanie proszkowe'],
      material: 'stal S355, 4 mm',
      finish: 'RAL 7016 struktura',
      imageLabel: 'Zdjęcie: seria wsporników na palecie',
      sample: true,
    },
    {
      title: 'Rama maszyny pod zabudowę przemysłową',
      services: ['projektowanie', 'spawanie', 'obróbka CNC'],
      material: 'profile S355 + płyty frezowane',
      finish: 'RAL 5010 połysk',
      imageLabel: 'Zdjęcie: rama maszyny przed malowaniem',
      sample: true,
    },
    {
      title: 'Balustrada industrialna do biura loftowego',
      services: ['projektowanie', 'spawanie', 'malowanie proszkowe'],
      material: 'stal czarna, profile 40×40',
      finish: 'RAL 9005 półmat',
      imageLabel: 'Zdjęcie: balustrada po montażu',
      sample: true,
    },
    {
      title: 'Detale frezowane do regeneracji maszyny',
      services: ['obróbka CNC', 'projektowanie'],
      material: 'stal C45, aluminium',
      finish: 'surowe, olejowane',
      imageLabel: 'Zdjęcie: detale frezowane CNC',
      sample: true,
    },
  ],
};
