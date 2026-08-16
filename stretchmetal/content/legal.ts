// ============================================================================
// PRAWNE (PL) — polityka prywatności i polityka cookies. Administrator danych:
// [CONFIRM] Alto Design Sp. z o.o. — potwierdzić podmiot i dane rejestrowe
// przed publikacją. Treść obejmuje przetwarzanie plików RFQ i stack
// analityczny (GA4, PostHog, Clarity, Meta — wszystkie za zgodą).
// ============================================================================
import type { LegalContent } from '@/content/types';

export const privacy: LegalContent = {
  metaTitle: 'Polityka prywatności | StretchMetal',
  metaDescription:
    'Polityka prywatności serwisu stretchmetal.pl: administrator danych, cele i podstawy przetwarzania, pliki RFQ, prawa użytkowników RODO.',
  title: 'Polityka prywatności',
  // [CONFIRM] data publikacji polityki
  updated: 'Ostatnia aktualizacja: sierpień 2026',
  intro:
    'Niniejsza polityka opisuje, jak przetwarzamy dane osobowe użytkowników serwisu stretchmetal.pl, w szczególności dane przekazywane w formularzach wyceny i kontaktu.',
  sections: [
    {
      heading: '1. Administrator danych',
      paragraphs: [
        // [CONFIRM] podmiot prawny i dane rejestrowe
        'Administratorem danych osobowych jest Alto Design Sp. z o.o. z siedzibą przy ul. Legionów 59, 42-200 Częstochowa (dalej: „Administrator”), prowadząca serwis pod marką StretchMetal. Kontakt w sprawach danych osobowych: info@stretchmetal.pl.',
      ],
    },
    {
      heading: '2. Jakie dane przetwarzamy i po co',
      paragraphs: [
        'Formularz wyceny (RFQ): firma, imię i nazwisko, e-mail, telefon, kraj, treść zapytania oraz załączone pliki (rysunki i dokumentacja techniczna). Cel: przygotowanie i przesłanie wyceny oraz obsługa zlecenia. Podstawa prawna: art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy).',
        'Formularz kontaktowy: imię i nazwisko, e-mail, treść wiadomości. Cel: odpowiedź na wiadomość. Podstawa: art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes — obsługa korespondencji).',
        'Dane analityczne (za zgodą): informacje o korzystaniu z serwisu zbierane przez narzędzia opisane w polityce cookies. Podstawa: art. 6 ust. 1 lit. a RODO (zgoda).',
      ],
    },
    {
      heading: '3. Pliki załączane do wyceny',
      paragraphs: [
        'Rysunki i dokumentacja techniczna przekazywane w formularzu wyceny są przetwarzane wyłącznie w celu przygotowania wyceny i realizacji zlecenia. Dostęp do plików mają wyłącznie osoby zaangażowane w przygotowanie wyceny. Nie udostępniamy dokumentacji osobom trzecim; na życzenie podpisujemy umowę o poufności (NDA) przed analizą plików.',
        'Pliki przesyłane są do nas pocztą elektroniczną za pośrednictwem infrastruktury Microsoft 365 (Microsoft Ireland Operations Ltd.) i przechowywane w skrzynce pocztowej obsługującej zapytania ofertowe.',
      ],
    },
    {
      heading: '4. Odbiorcy danych',
      paragraphs: [
        'Dane mogą być powierzane podmiotom przetwarzającym je na nasze zlecenie: dostawcy hostingu serwisu (Vercel Inc.), dostawcy poczty i infrastruktury biurowej (Microsoft), a po wyrażeniu zgody — dostawcom narzędzi analitycznych wymienionym w polityce cookies. Część tych podmiotów przetwarza dane poza EOG w oparciu o standardowe klauzule umowne lub decyzje o adekwatności (m.in. EU–US Data Privacy Framework).',
        'W ramach grupy kapitałowej dane mogą być udostępniane spółkom Stretchgroup w zakresie niezbędnym do obsługi zlecenia.',
      ],
    },
    {
      heading: '5. Okres przechowywania',
      paragraphs: [
        'Zapytania ofertowe wraz z załącznikami przechowujemy przez okres prowadzenia rozmów handlowych, a po zawarciu umowy — przez okres jej realizacji i wymagany przepisami okres archiwizacji dokumentacji (podatkowej i księgowej). Zapytania, po których nie doszło do współpracy, usuwamy najpóźniej po 24 miesiącach.',
      ],
    },
    {
      heading: '6. Twoje prawa',
      paragraphs: ['Zgodnie z RODO masz prawo do:'],
      list: [
        'dostępu do swoich danych i otrzymania ich kopii,',
        'sprostowania danych,',
        'usunięcia danych („prawo do bycia zapomnianym”),',
        'ograniczenia przetwarzania,',
        'przenoszenia danych,',
        'sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie,',
        'cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność przetwarzania przed cofnięciem),',
        'skargi do Prezesa Urzędu Ochrony Danych Osobowych (uodo.gov.pl).',
      ],
    },
    {
      heading: '7. Dobrowolność podania danych',
      paragraphs: [
        'Podanie danych jest dobrowolne, ale niezbędne do otrzymania wyceny lub odpowiedzi na wiadomość. Bez adresu e-mail nie jesteśmy w stanie odpowiedzieć na zapytanie.',
      ],
    },
    {
      heading: '8. Zmiany polityki',
      paragraphs: [
        'Politykę możemy aktualizować, np. przy zmianie narzędzi lub przepisów. Obowiązująca wersja jest zawsze publikowana na tej stronie z datą aktualizacji.',
      ],
    },
  ],
};

export const cookies: LegalContent = {
  metaTitle: 'Polityka cookies | StretchMetal',
  metaDescription:
    'Polityka cookies serwisu stretchmetal.pl: jakie pliki cookies stosujemy, narzędzia analityczne i marketingowe oraz jak zarządzać zgodą.',
  title: 'Polityka cookies',
  // [CONFIRM] data publikacji polityki
  updated: 'Ostatnia aktualizacja: sierpień 2026',
  intro:
    'Serwis stretchmetal.pl używa plików cookies i podobnych technologii. Narzędzia analityczne i marketingowe uruchamiamy wyłącznie po wyrażeniu zgody w banerze — przyciski „Akceptuję” i „Odrzucam” są równorzędne.',
  sections: [
    {
      heading: '1. Czym są cookies',
      paragraphs: [
        'Cookies to niewielkie pliki zapisywane na Twoim urządzeniu przez przeglądarkę. Służą do utrzymania ustawień, analizy ruchu i mierzenia skuteczności działań marketingowych.',
      ],
    },
    {
      heading: '2. Kategorie stosowanych cookies',
      paragraphs: [
        'Niezbędne: zapamiętanie Twojej decyzji o zgodzie (localStorage, klucz consent-preferences). Działają zawsze — bez nich baner pytałby o zgodę na każdej stronie.',
        'Analityczne (za zgodą): Google Analytics 4, PostHog (serwery w UE) i Microsoft Clarity — statystyki odwiedzin, mapy kliknięć i nagrania sesji służące poprawie serwisu.',
        'Marketingowe (za zgodą): Meta Pixel — pomiar skuteczności kampanii reklamowych.',
      ],
    },
    {
      heading: '3. Google Consent Mode v2',
      paragraphs: [
        'Do czasu wyrażenia zgody wszystkie sygnały Google ustawione są na „denied”. Google Analytics może w tym trybie zbierać wyłącznie zanonimizowane, bezplikowe sygnały modelowane. Pełne cookies analityczne uruchamiają się dopiero po kliknięciu „Akceptuję”.',
      ],
    },
    {
      heading: '4. Zarządzanie zgodą',
      paragraphs: [
        'Decyzję możesz zmienić w każdej chwili: link „Ustawienia cookies” w stopce otwiera baner ponownie. Cofnięcie zgody zatrzymuje narzędzia analityczne i marketingowe na tym urządzeniu.',
        'Cookies możesz też usuwać i blokować w ustawieniach przeglądarki — może to jednak utrudnić korzystanie z niektórych funkcji serwisu.',
      ],
    },
    {
      heading: '5. Administrator',
      paragraphs: [
        // [CONFIRM] podmiot prawny
        'Administratorem danych zbieranych przez cookies jest Alto Design Sp. z o.o., ul. Legionów 59, 42-200 Częstochowa. Zasady przetwarzania danych osobowych opisuje polityka prywatności.',
      ],
    },
  ],
};
