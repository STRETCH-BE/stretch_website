// ============================================================================
// CHROME (PL) — nawigacja, stopka, baner cookies, pasek mobilny, 404 i
// wspólne CTA. Komponenty dostają te teksty przez propsy — żaden komponent
// sekcji nie zawiera zaszytej treści.
// ============================================================================
import type { ChromeContent } from '@/content/types';

export const chrome: ChromeContent = {
  skipLink: 'Przejdź do treści',
  nav: {
    items: [
      { route: 'services', label: 'Usługi' },
      { route: 'machinePark', label: 'Park maszynowy' },
      { route: 'projects', label: 'Realizacje' },
      { route: 'about', label: 'O nas' },
      { route: 'contact', label: 'Kontakt' },
    ],
    cta: 'Wyślij rysunek',
    menuOpen: 'Otwórz menu',
    menuClose: 'Zamknij menu',
    langLabel: 'Język',
  },
  footer: {
    services: {
      title: 'Usługi',
      items: [
        { route: 'welding', label: 'Spawanie' },
        { route: 'laser', label: 'Cięcie laserowe' },
        { route: 'cnc', label: 'Obróbka CNC' },
        { route: 'coating', label: 'Malowanie proszkowe' },
        { route: 'design', label: 'Projektowanie' },
        { route: 'structures', label: 'Konstrukcje stalowe' },
      ],
    },
    company: {
      title: 'Firma',
      items: [
        { route: 'about', label: 'O nas' },
        { route: 'machinePark', label: 'Park maszynowy' },
        { route: 'projects', label: 'Realizacje' },
        { route: 'rfq', label: 'Wycena' },
        { route: 'contact', label: 'Kontakt' },
      ],
    },
    contactTitle: 'Kontakt',
    hoursLabel: 'Godziny pracy',
    groupTitle: 'Grupa',
    groupBlurb:
      'StretchMetal jest częścią belgijskiej Stretchgroup — producenta sufitów napinanych z zakładem produkcyjnym w Częstochowie.',
    // [CONFIRM] pełne dane rejestrowe: NIP / KRS / kapitał zakładowy
    legalLine: 'StretchMetal — marka Alto Design Sp. z o.o. · ul. Legionów 59, 42-200 Częstochowa · NIP: [do uzupełnienia]',
    legal: [
      { route: 'privacy', label: 'Polityka prywatności' },
      { route: 'cookies', label: 'Polityka cookies' },
    ],
  },
  mobileCta: { call: 'Zadzwoń', rfq: 'Wyślij rysunek' },
  consent: {
    heading: 'Cookies i analityka',
    text: 'Używamy plików cookies do analizy ruchu i mierzenia skuteczności strony. Możesz zaakceptować wszystkie, odrzucić wszystkie lub wybrać zakres. Szczegóły znajdziesz w polityce cookies.',
    accept: 'Akceptuję',
    reject: 'Odrzucam',
    settings: 'Ustawienia',
    analyticsLabel: 'Analityka',
    analyticsText: 'Statystyki odwiedzin i nagrania sesji (GA4, PostHog, Clarity).',
    marketingLabel: 'Marketing',
    marketingText: 'Piksele reklamowe do mierzenia kampanii (Meta).',
    save: 'Zapisz wybór',
    privacyLink: 'Polityka cookies',
  },
  notFound: {
    code: '404',
    title: 'Nie ma takiej strony',
    text: 'Adres jest błędny albo strona została przeniesiona. Wróć na stronę główną lub przejdź do usług.',
    cta: 'Strona główna',
  },
  ctaBanner: {
    title: [{ text: 'Masz rysunek?' }, { text: 'Masz wycenę.', accent: true }],
    text: 'Wyślij dokumentację DXF, DWG, STEP lub PDF. Odpowiadamy w ciągu 48 godzin roboczych — z ceną i terminem.',
    cta: 'Wyślij rysunek',
  },
  breadcrumbHome: 'Strona główna',
};
