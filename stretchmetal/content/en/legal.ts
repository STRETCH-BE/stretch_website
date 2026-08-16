// ============================================================================
// LEGAL (EN) — privacy policy and cookie policy. Data controller: [CONFIRM]
// Alto Design Sp. z o.o. — confirm the legal entity and registration data
// before launch. Covers RFQ file processing and the analytics stack (GA4,
// PostHog, Clarity, Meta — all consent-gated).
// ============================================================================
import type { LegalContent } from '@/content/types';

export const privacy: LegalContent = {
  metaTitle: 'Privacy Policy | StretchMetal',
  metaDescription:
    'Privacy policy of stretchmetal.pl: data controller, purposes and legal bases of processing, RFQ files, GDPR user rights.',
  title: 'Privacy policy',
  // [CONFIRM] policy publication date
  updated: 'Last updated: August 2026',
  intro:
    'This policy describes how we process personal data of stretchmetal.pl users, in particular data submitted through the quote (RFQ) and contact forms.',
  sections: [
    {
      heading: '1. Data controller',
      paragraphs: [
        // [CONFIRM] legal entity and registration data
        'The controller of your personal data is Alto Design Sp. z o.o., ul. Legionów 59, 42-200 Częstochowa, Poland (the "Controller"), operating this website under the StretchMetal brand. Contact for data matters: info@stretchmetal.pl.',
      ],
    },
    {
      heading: '2. What data we process and why',
      paragraphs: [
        'Quote form (RFQ): company, contact name, e-mail, phone, country, enquiry text and attached files (drawings and technical documentation). Purpose: preparing and sending a quote and handling the order. Legal basis: Art. 6(1)(b) GDPR (steps prior to entering into a contract).',
        'Contact form: name, e-mail, message text. Purpose: answering your message. Legal basis: Art. 6(1)(f) GDPR (legitimate interest — handling correspondence).',
        'Analytics data (with consent): information about site usage collected by the tools described in the cookie policy. Legal basis: Art. 6(1)(a) GDPR (consent).',
      ],
    },
    {
      heading: '3. Files attached to quote requests',
      paragraphs: [
        'Drawings and technical documentation submitted through the quote form are processed solely to prepare the quote and fulfil the order. Only the people preparing your quote have access to the files. We never share documentation with third parties; on request we sign a non-disclosure agreement (NDA) before analysing your files.',
        'Files are delivered to us by e-mail through Microsoft 365 infrastructure (Microsoft Ireland Operations Ltd.) and stored in the mailbox handling sales enquiries.',
      ],
    },
    {
      heading: '4. Data recipients',
      paragraphs: [
        'Data may be entrusted to processors acting on our behalf: the website hosting provider (Vercel Inc.), the e-mail and office infrastructure provider (Microsoft), and — once you consent — the analytics providers listed in the cookie policy. Some of these providers process data outside the EEA under standard contractual clauses or adequacy decisions (including the EU–US Data Privacy Framework).',
        'Within the corporate group, data may be shared with Stretchgroup companies to the extent necessary to handle your order.',
      ],
    },
    {
      heading: '5. Retention',
      paragraphs: [
        'Quote enquiries with attachments are kept for the duration of commercial discussions and, if a contract follows, for its term plus the archiving periods required by tax and accounting law. Enquiries that do not lead to cooperation are deleted after 24 months at the latest.',
      ],
    },
    {
      heading: '6. Your rights',
      paragraphs: ['Under the GDPR you have the right to:'],
      list: [
        'access your data and receive a copy,',
        'rectify your data,',
        'erase your data ("right to be forgotten"),',
        'restrict processing,',
        'data portability,',
        'object to processing based on legitimate interest,',
        'withdraw consent at any time (without affecting processing carried out before withdrawal),',
        'lodge a complaint with the Polish supervisory authority (Prezes UODO, uodo.gov.pl).',
      ],
    },
    {
      heading: '7. Voluntary provision',
      paragraphs: [
        'Providing data is voluntary but necessary to receive a quote or an answer. Without an e-mail address we cannot respond to your enquiry.',
      ],
    },
    {
      heading: '8. Changes to this policy',
      paragraphs: [
        'We may update this policy, e.g. when tools or regulations change. The current version is always published on this page with its update date.',
      ],
    },
  ],
};

export const cookies: LegalContent = {
  metaTitle: 'Cookie Policy | StretchMetal',
  metaDescription:
    'Cookie policy of stretchmetal.pl: which cookies we use, analytics and marketing tools, and how to manage your consent.',
  title: 'Cookie policy',
  // [CONFIRM] policy publication date
  updated: 'Last updated: August 2026',
  intro:
    'stretchmetal.pl uses cookies and similar technologies. Analytics and marketing tools run only after you consent in the banner — the "Accept" and "Reject" buttons are equal.',
  sections: [
    {
      heading: '1. What cookies are',
      paragraphs: [
        'Cookies are small files your browser stores on your device. They keep settings, help analyse traffic and measure the effectiveness of marketing.',
      ],
    },
    {
      heading: '2. Categories we use',
      paragraphs: [
        'Necessary: remembering your consent decision (localStorage, key consent-preferences). Always active — without it the banner would ask on every page.',
        'Analytics (with consent): Google Analytics 4, PostHog (EU servers) and Microsoft Clarity — visit statistics, click maps and session recordings used to improve the site.',
        'Marketing (with consent): Meta Pixel — measuring ad campaign effectiveness.',
      ],
    },
    {
      heading: '3. Google Consent Mode v2',
      paragraphs: [
        'Until you consent, all Google signals are set to "denied". In this mode Google Analytics may only collect anonymised, cookieless modelled signals. Full analytics cookies start only after you click "Accept".',
      ],
    },
    {
      heading: '4. Managing consent',
      paragraphs: [
        'You can change your decision at any time: the "Cookie settings" link in the footer reopens the banner. Withdrawing consent stops analytics and marketing tools on this device.',
        'You can also delete and block cookies in your browser settings — this may make some site features harder to use.',
      ],
    },
    {
      heading: '5. Controller',
      paragraphs: [
        // [CONFIRM] legal entity
        'The controller of data collected via cookies is Alto Design Sp. z o.o., ul. Legionów 59, 42-200 Częstochowa, Poland. Personal data processing is described in the privacy policy.',
      ],
    },
  ],
};
