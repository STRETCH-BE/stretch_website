// ============================================================================
// CONTACT (EN) — contact details, mini form (uses the RFQ API without files)
// and the map teaser. Address/phone are read from lib/site-config.ts.
// ============================================================================
import type { ContactContent } from '@/content/types';

export const contactPage: ContactContent = {
  metaTitle: 'Contact — StretchMetal, Częstochowa, Poland',
  metaDescription:
    'StretchMetal, ul. Legionów 59, 42-200 Częstochowa, Poland. Phone +48 730 700 333, e-mail info@stretchmetal.pl. Mon–Fri 08:00–16:00.',
  eyebrow: 'Contact',
  title: [{ text: "Let's talk" }, { text: 'steel', accent: true }],
  lead: 'Technical questions, lead times, long-term cooperation — we pick up the phone or reply the same business day.',
  details: {
    addressTitle: 'Plant address',
    phoneTitle: 'Phone',
    emailTitle: 'E-mail',
    hoursTitle: 'Opening hours',
    companyTitle: 'Company details',
    // [CONFIRM] company registration data: VAT ID / KRS / REGON
    companyLines: [
      'Alto Design Sp. z o.o. (StretchMetal brand)',
      'VAT ID: [to be confirmed]',
      'KRS: [to be confirmed]',
    ],
  },
  mapLabel: 'Map: ul. Legionów 59, Częstochowa, Poland',
  mapCta: 'Open in Google Maps',
  form: {
    title: 'Write to us',
    lead: 'A quick question without files? This form is enough. Documentation for a quote goes through the quote form.',
    name: 'Contact name',
    email: 'E-mail',
    message: 'Message',
    consent: 'I consent to the processing of the data provided in order to answer my message. Details in the',
    consentLinkLabel: 'privacy policy',
    submit: 'Send message',
    submitting: 'Sending…',
    success: 'Message sent. We reply by the next business day at the latest.',
    errors: {
      required: 'This field is required.',
      email: 'Enter a valid e-mail address.',
      consent: 'Consent is required so we can reply.',
      server: 'The message could not be sent. Try again or call us.',
    },
  },
  rfqHint: {
    text: 'Have a drawing or documentation ready?',
    cta: 'Go to the quote form',
  },
};
