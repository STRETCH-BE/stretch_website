// ============================================================================
// WYCENA / RFQ (PL) — treść formularza wyceny, paska zaufania, mini-procesu,
// FAQ i strony podziękowania. To najważniejsza strona serwisu: każda etykieta
// i komunikat błędu ma być jednoznaczny.
// ============================================================================
import type { RfqContent } from '@/content/types';

export const rfq: RfqContent = {
  metaTitle: 'Wycena — wyślij rysunek | StretchMetal',
  metaDescription:
    'Wyślij rysunek DXF, DWG, STEP lub PDF i odbierz wycenę w 48 godzin roboczych. Cięcie laserowe, spawanie, CNC, malowanie proszkowe, konstrukcje.',
  eyebrow: 'Wycena',
  title: [{ text: 'Wyślij rysunek.' }, { text: 'Resztą zajmiemy się my.', accent: true }],
  lead: 'Załącz dokumentację, napisz czego potrzebujesz — wracamy w ciągu 48 godzin roboczych z ceną, terminem i uwagami technologicznymi.',
  form: {
    company: 'Firma',
    name: 'Imię i nazwisko',
    email: 'E-mail',
    phone: 'Telefon',
    country: 'Kraj',
    countries: [
      { value: 'PL', label: 'Polska' },
      { value: 'DE', label: 'Niemcy' },
      { value: 'BE', label: 'Belgia' },
      { value: 'NL', label: 'Niderlandy' },
      { value: 'LU', label: 'Luksemburg' },
      { value: 'FR', label: 'Francja' },
      { value: 'CZ', label: 'Czechy' },
      { value: 'SK', label: 'Słowacja' },
      { value: 'AT', label: 'Austria' },
      { value: 'OTHER', label: 'Inny kraj UE' },
    ],
    servicesLabel: 'Potrzebne usługi',
    services: [
      { key: 'laser', label: 'Cięcie laserowe' },
      { key: 'welding', label: 'Spawanie' },
      { key: 'cnc', label: 'Obróbka CNC' },
      { key: 'coating', label: 'Malowanie proszkowe' },
      { key: 'design', label: 'Projektowanie' },
      { key: 'structures', label: 'Konstrukcja stalowa' },
    ],
    materialLabel: 'Materiał',
    materials: [
      { value: 'steel', label: 'Stal czarna' },
      { value: 'stainless', label: 'Stal nierdzewna' },
      { value: 'aluminium', label: 'Aluminium' },
      { value: 'other', label: 'Inny / nie wiem' },
    ],
    quantity: 'Ilość sztuk',
    quantityPlaceholder: 'np. 1, 50, 500',
    deadline: 'Oczekiwany termin',
    deadlinePlaceholder: 'np. do końca miesiąca',
    message: 'Opis zlecenia',
    messagePlaceholder:
      'Co mamy wykonać? Wymiary, materiał, ilości, wymagania dotyczące wykończenia…',
    filesLabel: 'Pliki (rysunki, dokumentacja)',
    filesHint: 'DXF, DWG, STEP, STP, IGES, IGS, PDF, ZIP — łącznie do 15 MB',
    filesDrop: 'Przeciągnij pliki tutaj',
    filesBrowse: 'albo wybierz z dysku',
    filesRemove: 'Usuń plik',
    consent:
      'Wyrażam zgodę na przetwarzanie podanych danych oraz załączonych plików w celu przygotowania wyceny. Szczegóły w',
    consentLinkLabel: 'polityce prywatności',
    submit: 'Wyślij zapytanie',
    submitting: 'Wysyłanie…',
    optional: 'opcjonalnie',
    errors: {
      required: 'To pole jest wymagane.',
      email: 'Podaj poprawny adres e-mail.',
      fileType: 'Niedozwolony format pliku. Dozwolone: DXF, DWG, STEP, STP, IGES, IGS, PDF, ZIP.',
      fileSize: 'Łączny rozmiar plików przekracza 15 MB. Usuń część plików lub spakuj je mocniej.',
      fileCount: 'Maksymalnie 10 plików w jednym zapytaniu.',
      consent: 'Zgoda jest wymagana, żebyśmy mogli przetworzyć Twoje pliki.',
      server: 'Nie udało się wysłać zapytania. Spróbuj ponownie albo napisz na info@stretchmetal.pl.',
    },
  },
  trust: {
    title: 'Jak pracujemy z zapytaniami',
    items: [
      {
        title: 'Odpowiedź w 48 h',
        text: 'Wycenę wysyłamy w ciągu 48 godzin roboczych. Jeśli czegoś brakuje w dokumentacji, dopytamy tego samego dnia.',
      },
      {
        title: 'NDA na życzenie',
        text: 'Podpisujemy umowę o poufności przed otwarciem plików, jeśli tego wymagasz.',
      },
      {
        title: 'Pliki traktowane poufnie',
        text: 'Dokumentacja trafia wyłącznie do osób przygotowujących wycenę. Nie udostępniamy jej osobom trzecim.',
      },
      {
        title: 'Kontakt z technologiem',
        text: 'Wycenę przygotowuje osoba z warsztatu, nie handlowiec. Pytania techniczne omawiasz bezpośrednio z nią.',
      },
    ],
  },
  process: {
    title: 'Co dzieje się po wysłaniu',
    steps: [
      {
        title: 'Analiza dokumentacji',
        text: 'Technolog sprawdza wykonalność, materiał i czas maszynowy.',
      },
      {
        title: 'Wycena z terminem',
        text: 'Dostajesz cenę, wiążący termin i ewentualne uwagi do projektu.',
      },
      {
        title: 'Akceptacja i produkcja',
        text: 'Po Twojej akceptacji zlecenie wchodzi do planu produkcji.',
      },
    ],
  },
  faq: {
    title: 'Pytania o wycenę',
    items: [
      {
        q: 'Nie mam rysunku technicznego — co wysłać?',
        a: 'Wystarczy szkic z wymiarami, zdjęcie podobnego detalu albo opis. Dokumentację produkcyjną przygotuje nasz dział projektowy — ujmiemy to w wycenie.',
      },
      {
        q: 'Ile kosztuje wycena?',
        a: 'Nic. Wycena jest bezpłatna i niezobowiązująca.',
      },
      {
        q: 'Jak liczycie 48 godzin?',
        a: 'Godziny robocze: zapytanie z piątku po południu dostaje odpowiedź najpóźniej we wtorek. Zwykle odpowiadamy szybciej.',
      },
      {
        q: 'Co jeśli pliki ważą więcej niż 15 MB?',
        a: 'Napisz na info@stretchmetal.pl — podeślemy link do przesłania większej paczki. Formularz przyjmuje też ZIP, co zwykle wystarcza.',
      },
      {
        q: 'Czy wyceniacie zlecenia spoza Polski?',
        a: 'Tak, pracujemy dla klientów z całej UE. Wycena może być po polsku, angielsku lub niderlandzku; ceny w PLN lub EUR.',
      },
    ],
  },
  contactStrip: {
    title: 'Wolisz porozmawiać?',
    text: 'Zadzwoń lub napisz — technolog odpowie na pytania przed wysłaniem plików.',
  },
  thanks: {
    metaTitle: 'Dziękujemy za zapytanie | StretchMetal',
    eyebrow: 'Zapytanie wysłane',
    title: [{ text: 'Dziękujemy.' }, { text: 'Działamy.', accent: true }],
    text: 'Twoje zapytanie trafiło do technologa. Wycenę z ceną i terminem wyślemy na podany adres w ciągu 48 godzin roboczych.',
    nextTitle: 'Co dalej',
    next: [
      'Sprawdzimy dokumentację i wykonalność zlecenia.',
      'Jeśli czegoś zabraknie, dopytamy mailem lub telefonicznie.',
      'Dostaniesz wycenę z wiążącym terminem realizacji.',
    ],
    backHome: 'Strona główna',
    seeServices: 'Zobacz usługi',
  },
};
