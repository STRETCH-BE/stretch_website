// ============================================================================
// USŁUGI (PL) — hub + pełna treść sześciu podstron usług. Parametry techniczne
// w tabelach specyfikacji są danymi ROBOCZYMI do potwierdzenia z warsztatem —
// każdy oznaczony [CONFIRM]. Nie publikujemy ich nigdzie jako zweryfikowanych
// faktów poza tymi tabelami.
// ============================================================================
import type { ServiceCard, ServiceContent, ServicesHubContent } from '@/content/types';

export const serviceCards: ServiceCard[] = [
  {
    key: 'laser',
    name: 'Cięcie laserowe',
    blurb: 'Precyzyjne cięcie blach z plików DXF/DWG. Powtarzalność na poziomie dziesiątych milimetra.',
    tags: ['stal', 'nierdzewka', 'aluminium'],
  },
  {
    key: 'welding',
    name: 'Spawanie',
    blurb: 'MIG/MAG i TIG. Konstrukcje, ramy i detale — od pojedynczych sztuk po serie.',
    tags: ['MIG/MAG', 'TIG', 'stal czarna i nierdzewna'],
  },
  {
    key: 'cnc',
    name: 'Obróbka CNC',
    blurb: 'Frezowanie i toczenie części maszyn oraz detali według dokumentacji 2D/3D.',
    tags: ['frezowanie', 'toczenie', 'STEP/IGES'],
  },
  {
    key: 'coating',
    name: 'Malowanie proszkowe',
    blurb: 'Lakierowanie proszkowe w pełnej palecie RAL, z przygotowaniem powierzchni.',
    tags: ['pełny RAL', 'mat / połysk / struktura'],
  },
  {
    key: 'design',
    name: 'Projektowanie',
    blurb: 'Dokumentacja techniczna 2D/3D. Ze szkicu robimy pliki gotowe na produkcję.',
    tags: ['2D/3D', 'DXF', 'STEP'],
  },
  {
    key: 'structures',
    name: 'Konstrukcje stalowe',
    blurb: 'Kompletne konstrukcje na wymiar: od projektu, przez spawanie, po malowanie i dostawę.',
    tags: ['na wymiar', 'kompletna realizacja'],
  },
];

export const servicesHub: ServicesHubContent = {
  metaTitle: 'Usługi obróbki metali — Częstochowa | StretchMetal',
  metaDescription:
    'Spawanie, cięcie laserowe, obróbka CNC, malowanie proszkowe, projektowanie i konstrukcje stalowe. Sześć usług w jednym zakładzie w Częstochowie.',
  eyebrow: 'Usługi',
  title: [{ text: 'Sześć usług.' }, { text: 'Jeden zakład.', accent: true }],
  lead: 'Cała ścieżka produkcyjna pod jednym dachem. Zlecasz rysunek — odbierasz gotowy, pomalowany element. Bez koordynowania trzech podwykonawców.',
  cards: serviceCards,
};

const commonOrderSteps = [
  {
    title: 'Prześlij dokumentację',
    text: 'Formularz wyceny przyjmuje DXF, DWG, STEP, IGES, PDF i ZIP — do 15 MB. Możesz też opisać detal i dołączyć szkic.',
  },
  {
    title: 'Odbierz wycenę w 48 h',
    text: 'Dostajesz cenę, termin i uwagi technologiczne. Przy seriach wyceniamy progi ilościowe.',
  },
  {
    title: 'Zatwierdź i czekaj na dostawę',
    text: 'Po akceptacji ruszamy z produkcją. Wysyłamy z Częstochowy do całej UE — Niemcy i Benelux w 1–2 dni robocze.',
  },
];

export const services: Record<string, ServiceContent> = {
  welding: {
    key: 'welding',
    route: 'welding',
    name: 'Spawanie',
    metaTitle: 'Spawanie MIG/MAG i TIG — Częstochowa | StretchMetal',
    metaDescription:
      'Usługi spawalnicze MIG/MAG i TIG: stal czarna, nierdzewna i aluminium. Ramy, konstrukcje i detale — pojedyncze sztuki i serie. Wycena w 48 h.',
    eyebrow: 'Usługa 02',
    title: [{ text: 'Spawanie' }, { text: 'MIG i TIG', accent: true }],
    lead: 'Spawamy to, co potem sami montujemy: ramy, podkonstrukcje, kanały świetlne. Zawodowi spawacze, czyste spoiny, wymiary trzymane według dokumentacji — od pojedynczej sztuki po powtarzalne serie.',
    specs: {
      title: 'Zakres techniczny',
      rows: [
        // [CONFIRM] wszystkie parametry w tej tabeli — dane robocze warsztatu
        { k: 'Metody', v: 'MIG/MAG (135/136), TIG (141)' },
        { k: 'Materiały', v: 'stal czarna S235–S355, stal nierdzewna 304/316, aluminium' },
        { k: 'Grubości', v: 'od 1 mm do 20 mm' },
        { k: 'Gabaryt elementu', v: 'do 6 000 mm długości, do ok. 1,5 t' },
        { k: 'Serie', v: 'prototypy, małe i średnie serie' },
        { k: 'Formaty plików', v: 'DXF, DWG, STEP, PDF' },
      ],
      note: 'Parametry graniczne potwierdzamy przy wycenie — zależą od geometrii detalu.',
    },
    applications: {
      title: 'Co spawamy',
      lead: 'Najczęstsze grupy detali, które wychodzą z naszej spawalni.',
      items: [
        {
          title: 'Ramy i podkonstrukcje',
          text: 'Ramy nośne pod zabudowy, maszyny i sufity — proste, powtarzalne, z otworami pod montaż.',
        },
        {
          title: 'Konstrukcje wsporcze',
          text: 'Wsporniki, konsole i uchwyty przenoszące obciążenia. Spoiny w miejscach, gdzie mają być.',
        },
        {
          title: 'Elementy architektoniczne',
          text: 'Kanały świetlne, obudowy, profile wykończeniowe — detale, które po malowaniu zostają na widoku.',
        },
        {
          title: 'Zbiorniki i obudowy z nierdzewki',
          text: 'Spawanie TIG stali nierdzewnej tam, gdzie liczy się estetyka spoiny i odporność na korozję.',
        },
      ],
    },
    howToOrder: { title: 'Jak zamówić', steps: commonOrderSteps },
    faq: {
      title: 'Częste pytania',
      items: [
        {
          q: 'Czy spawacie pojedyncze sztuki, czy tylko serie?',
          a: 'Jedno i drugie. Warsztat powstał do produkcji jednostkowych konstrukcji pod projekty grupy, więc pojedyncze detale to nasz chleb powszedni. Przy seriach dajemy progi cenowe.',
        },
        {
          q: 'Czy macie uprawnienia i certyfikaty spawalnicze?',
          a: 'Pracują u nas zawodowi spawacze z doświadczeniem produkcyjnym. Nie deklarujemy certyfikatów systemowych (EN 1090, ISO 3834) — jeśli Twój projekt ich wymaga, powiedz o tym przy zapytaniu, a odpowiemy wprost, czy możemy go przyjąć.',
        },
        {
          q: 'Jak kontrolujecie jakość spoin?',
          a: 'Kontrola wizualna i wymiarowa każdego elementu przed wysyłką. Nasz najsurowszy klient to własne ekipy montażowe grupy — konstrukcja, która nie trzyma wymiaru, wraca na halę, nie do klienta.',
        },
        {
          q: 'Czy przygotujecie dokumentację, jeśli mam tylko szkic?',
          a: 'Tak. Dział projektowy przerysuje szkic do dokumentacji 2D/3D i uzgodni z Tobą wymiary przed produkcją. To osobna pozycja na wycenie.',
        },
        {
          q: 'Spawacie aluminium?',
          a: 'Tak, metodą TIG i MIG. Przy aluminium prosimy o informację o stopie (np. 6060, 5754) — dobieramy spoiwo i parametry.',
        },
      ],
    },
    related: { title: 'Powiązane usługi', keys: ['laser', 'coating', 'structures'] },
  },

  laser: {
    key: 'laser',
    route: 'laser',
    name: 'Cięcie laserowe',
    metaTitle: 'Cięcie laserowe blach — Częstochowa | StretchMetal',
    metaDescription:
      'Cięcie laserowe blach ze stali, nierdzewki i aluminium z plików DXF/DWG. Krótkie terminy, wysyłka w całej UE. Wycena w 48 godzin.',
    eyebrow: 'Usługa 01',
    title: [{ text: 'Cięcie' }, { text: 'laserowe', accent: true }],
    lead: 'Z pliku DXF do wyciętego detalu — bez poprawek i bez zdziwień. Tniemy stal, nierdzewkę i aluminium na wycinarce fiber, z powtarzalnością, którą widać dopiero przy montażu.',
    specs: {
      title: 'Zakres techniczny',
      rows: [
        // [CONFIRM] wszystkie parametry w tej tabeli — dane robocze warsztatu
        { k: 'Technologia', v: 'laser światłowodowy (fiber)' },
        { k: 'Format arkusza', v: 'do 3 000 × 1 500 mm' },
        { k: 'Stal czarna', v: 'do 20 mm' },
        { k: 'Stal nierdzewna', v: 'do 12 mm' },
        { k: 'Aluminium', v: 'do 10 mm' },
        { k: 'Formaty plików', v: 'DXF, DWG (preferowane), STEP, PDF' },
      ],
      note: 'Grubości graniczne zależą od gatunku i jakości krawędzi, której oczekujesz — potwierdzamy przy wycenie.',
    },
    applications: {
      title: 'Co wycinamy',
      lead: 'Od pojedynczych formatek po komplety detali z rozkroju.',
      items: [
        {
          title: 'Formatki i blachy konstrukcyjne',
          text: 'Elementy płaskie pod dalszą obróbkę: gięcie, spawanie, skręcanie. Otwory i fazowania w jednym przejściu.',
        },
        {
          title: 'Detale seryjne',
          text: 'Rozkrój zoptymalizowany pod arkusz — mniejszy odpad, niższa cena sztuki przy seriach.',
        },
        {
          title: 'Elementy ozdobne i panele',
          text: 'Ażury, logotypy, panele architektoniczne. Krawędź po laserze zwykle nie wymaga szlifowania.',
        },
        {
          title: 'Prototypy',
          text: 'Jedna sztuka na próbę zanim zamówisz serię. Szybka pętla: plik rano, detal w drodze za kilka dni.',
        },
      ],
    },
    howToOrder: {
      title: 'Jak zamówić',
      steps: [
        {
          title: 'Wyślij DXF lub DWG',
          text: 'Krzywe w skali 1:1, bez wymiarowań na warstwie cięcia. Nie masz pliku? Prześlij PDF z wymiarami — przerysujemy.',
        },
        ...commonOrderSteps.slice(1),
      ],
    },
    faq: {
      title: 'Częste pytania',
      items: [
        {
          q: 'Jakiego pliku potrzebujecie do wyceny?',
          a: 'Najlepiej DXF lub DWG w skali 1:1 plus informacja o materiale, grubości i ilości sztuk. PDF z wymiarami też wystarczy — przygotowanie pliku produkcyjnego doliczamy do wyceny.',
        },
        {
          q: 'Czy dostarczacie materiał, czy mam przysłać własny?',
          a: 'Standardowo tniemy z naszego materiału z atestem hutniczym. Możemy też ciąć z materiału powierzonego — uzgadniamy to przy wycenie.',
        },
        {
          q: 'Jaka jest dokładność cięcia?',
          a: 'Typowo ±0,1–0,2 mm w zależności od grubości i gatunku. Jeśli detal ma wymiary krytyczne, zaznacz je na rysunku — powiemy wprost, czy je utrzymamy.',
        },
        {
          q: 'Czy gniecie wycięte detale?',
          a: 'Obecnie cięcie łączymy z obróbką CNC, spawaniem i malowaniem w naszym zakładzie; gięcie realizujemy z partnerem obok. Zaznacz gięcia na rysunku, a wycenimy całość jako jedną usługę.',
        },
        {
          q: 'Ile trwa realizacja?',
          a: 'Typowe detale z materiału magazynowego: kilka dni roboczych od akceptacji wyceny. Termin dostajesz zawsze razem z ceną i jest wiążący.',
        },
      ],
    },
    related: { title: 'Powiązane usługi', keys: ['welding', 'cnc', 'coating'] },
  },

  cnc: {
    key: 'cnc',
    route: 'cnc',
    name: 'Obróbka CNC',
    metaTitle: 'Obróbka CNC — frezowanie i toczenie | StretchMetal',
    metaDescription:
      'Frezowanie i toczenie CNC części maszyn i detali według dokumentacji 2D/3D. Stal, nierdzewka, aluminium. Zakład w Częstochowie, dostawa w UE.',
    eyebrow: 'Usługa 03',
    title: [{ text: 'Obróbka' }, { text: 'CNC', accent: true }],
    lead: 'Frezujemy i toczymy detale, które muszą pasować za pierwszym razem: części maszyn, elementy złączne, detale pod spawanie. Dokumentacja STEP wchodzi, gotowy detal wychodzi.',
    specs: {
      title: 'Zakres techniczny',
      rows: [
        // [CONFIRM] wszystkie parametry w tej tabeli — dane robocze warsztatu
        { k: 'Operacje', v: 'frezowanie 3-osiowe, toczenie' },
        { k: 'Materiały', v: 'stal, stal nierdzewna, aluminium, tworzywa konstrukcyjne' },
        { k: 'Pole robocze frezowania', v: 'do 1 000 × 500 mm' },
        { k: 'Toczenie', v: 'średnice do 300 mm' },
        { k: 'Tolerancje', v: 'typowo do IT7 według dokumentacji' },
        { k: 'Formaty plików', v: 'STEP, IGES, DXF, PDF z wymiarami' },
      ],
      note: 'Tolerancje i chropowatość potwierdzamy dla konkretnego detalu przy wycenie.',
    },
    applications: {
      title: 'Co obrabiamy',
      lead: 'Typowe detale z naszych maszyn.',
      items: [
        {
          title: 'Części maszyn',
          text: 'Płyty montażowe, tuleje, wałki, elementy prowadzenia — pod regenerację i nowe budowy.',
        },
        {
          title: 'Detale pod konstrukcje spawane',
          text: 'Elementy frezowane, które wchodzą w nasze własne konstrukcje: czopy, gniazda, płyty czołowe.',
        },
        {
          title: 'Krótkie serie i prototypy',
          text: 'Od jednej sztuki. Prototyp możesz zweryfikować, zanim zamówisz serię.',
        },
        {
          title: 'Obróbka po cięciu laserowym',
          text: 'Gwintowanie, pogłębianie, planowanie — wykańczamy detale wycięte u nas z arkusza.',
        },
      ],
    },
    howToOrder: { title: 'Jak zamówić', steps: commonOrderSteps },
    faq: {
      title: 'Częste pytania',
      items: [
        {
          q: 'Jakie pliki przyjmujecie?',
          a: 'Najlepiej STEP lub IGES plus rysunek wykonawczy PDF z tolerancjami. Sam PDF z wymiarami też wystarczy — model przygotuje nasz dział projektowy.',
        },
        {
          q: 'Czy robicie pojedyncze sztuki?',
          a: 'Tak. Duża część naszej pracy to detale jednostkowe pod konstrukcje grupy, więc nie mamy minimum ilościowego.',
        },
        {
          q: 'Jakie tolerancje utrzymujecie?',
          a: 'Typowo do IT7 przy frezowaniu i toczeniu. Wymiary krytyczne oznacz na rysunku — potwierdzimy wykonalność przed przyjęciem zlecenia.',
        },
        {
          q: 'Czy obrabiacie materiał powierzony?',
          a: 'Tak — przyjmujemy zarówno zlecenia z naszego materiału z atestem, jak i z materiału klienta.',
        },
        {
          q: 'Czy łączycie CNC z innymi usługami?',
          a: 'To nasza główna przewaga: detal może być wycięty laserem, pospawany, obrobiony i pomalowany proszkowo bez opuszczania zakładu.',
        },
      ],
    },
    related: { title: 'Powiązane usługi', keys: ['laser', 'design', 'welding'] },
  },

  coating: {
    key: 'coating',
    route: 'coating',
    name: 'Malowanie proszkowe',
    metaTitle: 'Malowanie proszkowe — pełny RAL | StretchMetal',
    metaDescription:
      'Lakierowanie proszkowe stali i aluminium w pełnej palecie RAL: mat, połysk, struktura. Z przygotowaniem powierzchni. Częstochowa, dostawy w UE.',
    eyebrow: 'Usługa 04',
    title: [{ text: 'Malowanie' }, { text: 'proszkowe', accent: true }],
    lead: 'Ostatni etap, po którym element trafia prosto na montaż. Lakierujemy proszkowo konstrukcje i detale — własne i powierzone — w dowolnym kolorze RAL, z przygotowaniem powierzchni.',
    specs: {
      title: 'Zakres techniczny',
      rows: [
        // [CONFIRM] wszystkie parametry w tej tabeli — dane robocze warsztatu
        { k: 'Kolory', v: 'pełna paleta RAL; mat, półmat, połysk, struktura' },
        { k: 'Podłoża', v: 'stal czarna, stal ocynkowana, aluminium' },
        { k: 'Gabaryt elementu', v: 'do 3 000 × 1 500 × 1 500 mm' },
        { k: 'Przygotowanie powierzchni', v: 'odtłuszczanie, obróbka strumieniowo-ścierna' },
        { k: 'Grubość powłoki', v: 'typowo 60–120 µm' },
      ],
      note: 'Wymiary komory i dostępne przygotowanie powierzchni potwierdzamy przy wycenie.',
    },
    applications: {
      title: 'Co malujemy',
      lead: 'Powłoka proszkowa tam, gdzie liczy się trwałość i wygląd.',
      items: [
        {
          title: 'Konstrukcje stalowe',
          text: 'Ramy, wsporniki i podkonstrukcje — nasze i powierzone. Malowanie domyka produkcję w jednym zakładzie.',
        },
        {
          title: 'Elementy architektoniczne',
          text: 'Profile, panele, kanały świetlne, balustrady. Kolor pod projekt wnętrza, powtarzalny w całej serii.',
        },
        {
          title: 'Obudowy i detale seryjne',
          text: 'Powtarzalna powłoka na całej serii — bez różnic odcienia między partiami.',
        },
        {
          title: 'Elementy zewnętrzne',
          text: 'Powłoki odporne na warunki atmosferyczne, na podłożu ocynkowanym dla dłuższej ochrony.',
        },
      ],
    },
    howToOrder: { title: 'Jak zamówić', steps: commonOrderSteps },
    faq: {
      title: 'Częste pytania',
      items: [
        {
          q: 'Czy malujecie elementy powierzone, nie wykonane u was?',
          a: 'Tak. Przyjmujemy konstrukcje i detale z zewnątrz. Warunek: element musi się zmieścić w komorze i nadawać do przygotowania powierzchni.',
        },
        {
          q: 'Jakie kolory są dostępne?',
          a: 'Pełna paleta RAL, w wykończeniu mat, półmat, połysk lub struktura. Kolory spoza magazynu zamawiamy pod zlecenie — to może wydłużyć termin o kilka dni.',
        },
        {
          q: 'Jak przygotowujecie powierzchnię?',
          a: 'Standardowo odtłuszczanie i obróbka strumieniowo-ścierna przed malowaniem. Od przygotowania zależy przyczepność — nie pomijamy tego etapu.',
        },
        {
          q: 'Czy powłoka nadaje się na zewnątrz?',
          a: 'Tak, przy właściwym podłożu. Na zewnątrz rekomendujemy stal ocynkowaną pod powłoką proszkową — piszemy to wprost w wycenie.',
        },
        {
          q: 'Ile trwa malowanie?',
          a: 'Elementy z bieżącej produkcji malujemy w ciągu kilku dni roboczych. Przy powierzonych: termin ustalamy przy wycenie, zwykle do tygodnia.',
        },
      ],
    },
    related: { title: 'Powiązane usługi', keys: ['welding', 'structures', 'laser'] },
  },

  design: {
    key: 'design',
    route: 'design',
    name: 'Projektowanie',
    metaTitle: 'Projektowanie i dokumentacja techniczna | StretchMetal',
    metaDescription:
      'Dokumentacja techniczna 2D/3D pod produkcję: ze szkicu do plików DXF/STEP. Konstruktor po stronie warsztatu, nie biura. Częstochowa.',
    eyebrow: 'Usługa 05',
    title: [{ text: 'Projektowanie' }, { text: 'i dokumentacja', accent: true }],
    lead: 'Nie każdy klient ma dział konstrukcyjny. Nasz projektant zamienia szkic, zdjęcie albo pomiar z natury w dokumentację 2D/3D gotową na produkcję — i od razu sprawdza, czy detal da się wykonać taniej.',
    specs: {
      title: 'Zakres techniczny',
      rows: [
        // [CONFIRM] wszystkie parametry w tej tabeli — dane robocze
        { k: 'Zakres', v: 'modele 3D, rysunki wykonawcze 2D, rozkroje, dokumentacja złożeniowa' },
        { k: 'Wyjście', v: 'DXF, DWG, STEP, PDF' },
        { k: 'Wejście', v: 'szkic, zdjęcie, pomiar z natury, stary rysunek, próbka detalu' },
        { k: 'Optymalizacja', v: 'technologiczność, rozkrój arkusza, redukcja spawania' },
      ],
      note: 'Projektowanie zamawiane samodzielnie lub jako pierwszy etap produkcji u nas.',
    },
    applications: {
      title: 'Co projektujemy',
      lead: 'Dokumentacja, która powstaje przy warsztacie — nie przy biurku oderwanym od produkcji.',
      items: [
        {
          title: 'Dokumentacja ze szkicu',
          text: 'Masz pomysł na kartce? Wracamy z modelem 3D i rysunkiem do akceptacji, potem produkujemy.',
        },
        {
          title: 'Odtworzenie istniejącego detalu',
          text: 'Pomiar z natury zużytej części i dokumentacja pozwalająca ją odtwarzać seryjnie.',
        },
        {
          title: 'Adaptacja pod produkcję',
          text: 'Przerabiamy dokumentację pod technologie: mniej spawania, lepszy rozkrój, niższy koszt sztuki.',
        },
        {
          title: 'Konstrukcje kompletne',
          text: 'Projekt ramy, podestu czy podkonstrukcji od zera — z doborem profili i punktów montażowych.',
        },
      ],
    },
    howToOrder: {
      title: 'Jak zamówić',
      steps: [
        {
          title: 'Opisz, co ma powstać',
          text: 'Szkic, zdjęcie, wymiary — cokolwiek masz. Formularz wyceny przyjmuje pliki do 15 MB.',
        },
        {
          title: 'Otrzymaj propozycję i cenę',
          text: 'W 48 h wracamy z zakresem dokumentacji, ceną projektu i — jeśli chcesz — ceną wykonania.',
        },
        {
          title: 'Akceptujesz dokumentację',
          text: 'Model i rysunki dostajesz do akceptacji przed produkcją. Dokumentacja jest Twoja — pliki źródłowe przekazujemy.',
        },
      ],
    },
    faq: {
      title: 'Częste pytania',
      items: [
        {
          q: 'Czy mogę zamówić sam projekt, bez produkcji?',
          a: 'Tak. Dokumentację przekazujemy w plikach źródłowych (DXF/STEP) i możesz ją produkować gdziekolwiek. Zwykle jednak taniej wychodzi zrobić jedno i drugie u nas.',
        },
        {
          q: 'Do kogo należą prawa do dokumentacji?',
          a: 'Do Ciebie. Po opłaceniu projektu dokumentacja i pliki źródłowe są Twoją własnością.',
        },
        {
          q: 'Czy podpisujecie NDA?',
          a: 'Tak, na życzenie przed przekazaniem plików. Dokumentację klientów traktujemy poufnie także bez NDA — nie udostępniamy jej osobom trzecim.',
        },
        {
          q: 'Ile kosztuje dokumentacja?',
          a: 'Zależy od złożoności — od prostych formatek po złożenia z dziesiątkami detali. Cenę podajemy z góry w wycenie, przed rozpoczęciem pracy.',
        },
      ],
    },
    related: { title: 'Powiązane usługi', keys: ['structures', 'cnc', 'laser'] },
  },

  structures: {
    key: 'structures',
    route: 'structures',
    name: 'Konstrukcje stalowe',
    metaTitle: 'Konstrukcje stalowe na wymiar — Częstochowa | StretchMetal',
    metaDescription:
      'Kompletne konstrukcje stalowe na zamówienie: projekt, cięcie, spawanie, malowanie proszkowe i dostawa w UE. Jeden wykonawca, jeden termin.',
    eyebrow: 'Usługa 06',
    title: [{ text: 'Konstrukcje' }, { text: 'stalowe', accent: true }],
    lead: 'Nasza specjalność od pierwszego dnia: kompletne konstrukcje od projektu po malowanie. Ramy, podesty, podkonstrukcje i zabudowy — dokładnie takie, jakie sami stawiamy w projektach grupy.',
    specs: {
      title: 'Zakres techniczny',
      rows: [
        // [CONFIRM] wszystkie parametry w tej tabeli — dane robocze warsztatu
        { k: 'Zakres', v: 'projekt → cięcie → spawanie → obróbka → malowanie → dostawa' },
        { k: 'Materiały', v: 'profile i blachy S235–S355, stal nierdzewna, aluminium' },
        { k: 'Gabaryt', v: 'elementy do 6 000 mm, moduły pod transport drogowy' },
        { k: 'Masa', v: 'do ok. 1,5 t na element' },
        { k: 'Montaż', v: 'przygotowanie pod montaż: otwory, znakowanie, komplety śrub' },
      ],
      note: 'Większe konstrukcje dzielimy na moduły transportowe — projektujemy podziały pod montaż.',
    },
    applications: {
      title: 'Co budujemy',
      lead: 'Konstrukcje, które wychodzą z hali gotowe do skręcenia na miejscu.',
      items: [
        {
          title: 'Podkonstrukcje sufitowe i świetlne',
          text: 'Nasz rodowód: ramy i kanały pod sufity napinane, produkowane dla grupy od lat.',
        },
        {
          title: 'Ramy maszyn i urządzeń',
          text: 'Ramy nośne pod zabudowy przemysłowe — spawane, obrobione, z płaszczyznami montażowymi.',
        },
        {
          title: 'Podesty, schody, barierki',
          text: 'Elementy komunikacji przemysłowej na wymiar, z kratą pomostową i malowaniem proszkowym.',
        },
        {
          title: 'Zabudowy indywidualne',
          text: 'Nietypowe konstrukcje pod konkretny projekt: od mebli industrialnych po stelaże ekspozycyjne.',
        },
      ],
    },
    howToOrder: { title: 'Jak zamówić', steps: commonOrderSteps },
    faq: {
      title: 'Częste pytania',
      items: [
        {
          q: 'Czy wykonujecie konstrukcje z projektem od zera?',
          a: 'Tak — to nasz standardowy tryb. Opisujesz funkcję i wymiary, my projektujemy, pokazujemy model do akceptacji i produkujemy.',
        },
        {
          q: 'Czy realizujecie konstrukcje objęte normą EN 1090?',
          a: 'Nie deklarujemy certyfikacji EN 1090. Konstrukcje, które jej wymagają (elementy nośne budynków wprowadzane na rynek UE z oznakowaniem CE), kierujemy do certyfikowanych wytwórni — mówimy to wprost przy zapytaniu.',
        },
        {
          q: 'Czy dostarczacie i montujecie?',
          a: 'Dostarczamy w całej UE. Konstrukcje przygotowujemy pod samodzielny montaż: znakowane elementy, komplet śrub, rysunek złożeniowy. Montaż na miejscu — do uzgodnienia przy większych projektach.',
        },
        {
          q: 'Jak wygląda transport dużych konstrukcji?',
          a: 'Projektujemy podziały modułowe pod transport drogowy z Częstochowy — autostrada A1 jest obok zakładu. Niemcy i Benelux to standardowo 1–2 dni.',
        },
        {
          q: 'Jaki jest minimalny rozmiar zlecenia?',
          a: 'Nie ma minimum. Od pojedynczego wspornika po serię ram — wyceniamy wszystko, co mieści się w naszych możliwościach technicznych.',
        },
      ],
    },
    related: { title: 'Powiązane usługi', keys: ['design', 'welding', 'coating'] },
  },
};
