// ============================================================================
// KONTAKT (PL) — dane kontaktowe, mini-formularz (korzysta z API RFQ bez
// plików) i zajawka mapy. Adres/telefon czytane z lib/site-config.ts.
// ============================================================================
import type { ContactContent } from '@/content/types';

export const contactPage: ContactContent = {
  metaTitle: 'Kontakt — StretchMetal Częstochowa',
  metaDescription:
    'StretchMetal, ul. Legionów 59, 42-200 Częstochowa. Telefon +48 730 700 333, e-mail info@stretchmetal.pl. Pn–pt 8:00–16:00.',
  eyebrow: 'Kontakt',
  title: [{ text: 'Kontakt' }, { text: 'z warsztatem', accent: true }],
  lead: 'Pytania techniczne, terminy, współpraca stała — odbierzemy telefon albo odpiszemy tego samego dnia roboczego.',
  details: {
    addressTitle: 'Adres zakładu',
    phoneTitle: 'Telefon',
    emailTitle: 'E-mail',
    hoursTitle: 'Godziny pracy',
    companyTitle: 'Dane firmy',
    // [CONFIRM] dane rejestrowe spółki: NIP / KRS / REGON
    companyLines: [
      'Alto Design Sp. z o.o. (marka StretchMetal)',
      'NIP: [do uzupełnienia]',
      'KRS: [do uzupełnienia]',
    ],
  },
  mapLabel: 'Mapa: ul. Legionów 59, Częstochowa',
  mapCta: 'Otwórz w Mapach Google',
  form: {
    title: 'Napisz do nas',
    lead: 'Krótkie pytanie bez plików? Ten formularz wystarczy. Dokumentację do wyceny prześlij przez formularz wyceny.',
    name: 'Imię i nazwisko',
    email: 'E-mail',
    message: 'Wiadomość',
    consent: 'Wyrażam zgodę na przetwarzanie podanych danych w celu odpowiedzi na wiadomość. Szczegóły w',
    consentLinkLabel: 'polityce prywatności',
    submit: 'Wyślij wiadomość',
    submitting: 'Wysyłanie…',
    success: 'Wiadomość wysłana. Odpowiemy najpóźniej następnego dnia roboczego.',
    errors: {
      required: 'To pole jest wymagane.',
      email: 'Podaj poprawny adres e-mail.',
      consent: 'Zgoda jest wymagana, żebyśmy mogli odpowiedzieć.',
      server: 'Nie udało się wysłać wiadomości. Spróbuj ponownie albo zadzwoń.',
    },
  },
  rfqHint: {
    text: 'Masz gotowy rysunek albo dokumentację?',
    cta: 'Przejdź do wyceny',
  },
};
