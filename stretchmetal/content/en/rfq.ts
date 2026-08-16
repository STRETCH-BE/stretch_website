// ============================================================================
// RFQ (EN) — quote form, trust rail, mini process, FAQ and thank-you page.
// The most important page on the site: every label and error message must be
// unambiguous for a non-native-English purchasing manager.
// ============================================================================
import type { RfqContent } from '@/content/types';

export const rfq: RfqContent = {
  metaTitle: 'Request a Quote — Send Your Drawing | StretchMetal',
  metaDescription:
    'Send a DXF, DWG, STEP or PDF drawing and receive a quote within 48 business hours. Laser cutting, welding, CNC, powder coating, steel structures.',
  eyebrow: 'Request a quote',
  title: [{ text: 'Send the drawing.' }, { text: "We'll handle the rest.", accent: true }],
  lead: 'Attach your documentation, tell us what you need — we come back within 48 business hours with a price, a lead time and engineering remarks.',
  form: {
    company: 'Company',
    name: 'Contact name',
    email: 'E-mail',
    phone: 'Phone',
    country: 'Country',
    countries: [
      { value: 'PL', label: 'Poland' },
      { value: 'DE', label: 'Germany' },
      { value: 'BE', label: 'Belgium' },
      { value: 'NL', label: 'Netherlands' },
      { value: 'LU', label: 'Luxembourg' },
      { value: 'FR', label: 'France' },
      { value: 'CZ', label: 'Czechia' },
      { value: 'SK', label: 'Slovakia' },
      { value: 'AT', label: 'Austria' },
      { value: 'OTHER', label: 'Other EU country' },
    ],
    servicesLabel: 'Services needed',
    services: [
      { key: 'laser', label: 'Laser cutting' },
      { key: 'welding', label: 'Welding' },
      { key: 'cnc', label: 'CNC machining' },
      { key: 'coating', label: 'Powder coating' },
      { key: 'design', label: 'Design & engineering' },
      { key: 'structures', label: 'Steel structure' },
    ],
    materialLabel: 'Material',
    materials: [
      { value: 'steel', label: 'Mild steel' },
      { value: 'stainless', label: 'Stainless steel' },
      { value: 'aluminium', label: 'Aluminium' },
      { value: 'other', label: 'Other / not sure' },
    ],
    quantity: 'Quantity',
    quantityPlaceholder: 'e.g. 1, 50, 500',
    deadline: 'Target deadline',
    deadlinePlaceholder: 'e.g. end of the month',
    message: 'Order description',
    messagePlaceholder:
      'What should we make? Dimensions, material, quantities, finish requirements…',
    filesLabel: 'Files (drawings, documentation)',
    filesHint: 'DXF, DWG, STEP, STP, IGES, IGS, PDF, ZIP — up to 15 MB total',
    filesDrop: 'Drag files here',
    filesBrowse: 'or browse your disk',
    filesRemove: 'Remove file',
    consent:
      'I consent to the processing of the data provided and the attached files for the purpose of preparing a quote. Details in the',
    consentLinkLabel: 'privacy policy',
    submit: 'Send enquiry',
    submitting: 'Sending…',
    optional: 'optional',
    errors: {
      required: 'This field is required.',
      email: 'Enter a valid e-mail address.',
      fileType: 'File type not allowed. Accepted: DXF, DWG, STEP, STP, IGES, IGS, PDF, ZIP.',
      fileSize: 'Total file size exceeds 15 MB. Remove some files or compress them further.',
      fileCount: 'A maximum of 10 files per enquiry.',
      consent: 'Consent is required so we can process your files.',
      server: 'The enquiry could not be sent. Try again or write to info@stretchmetal.pl.',
    },
  },
  trust: {
    title: 'How we handle enquiries',
    items: [
      {
        title: 'Answer within 48 h',
        text: 'Quotes go out within 48 business hours. If anything is missing from the documentation, we ask the same day.',
      },
      {
        title: 'NDA on request',
        text: 'We sign a non-disclosure agreement before opening your files if you require it.',
      },
      {
        title: 'Files handled confidentially',
        text: 'Documentation reaches only the people preparing your quote. It is never shared with third parties.',
      },
      {
        title: 'Direct engineer contact',
        text: 'Your quote is prepared by someone from the shop floor, not a sales layer. Technical questions go straight to them.',
      },
    ],
  },
  process: {
    title: 'What happens after you send it',
    steps: [
      {
        title: 'Documentation review',
        text: 'An engineer checks feasibility, material and machine time.',
      },
      {
        title: 'Quote with a date',
        text: 'You receive a price, a binding lead time and any remarks on the design.',
      },
      {
        title: 'Approval and production',
        text: 'Once you approve, the order enters the production schedule.',
      },
    ],
  },
  faq: {
    title: 'Questions about quoting',
    items: [
      {
        q: 'I have no technical drawing — what should I send?',
        a: 'A dimensioned sketch, a photo of a similar part or a description is enough. Our design office prepares the production documentation — it is itemised in the quote.',
      },
      {
        q: 'What does a quote cost?',
        a: 'Nothing. Quotes are free and non-binding.',
      },
      {
        q: 'How do you count the 48 hours?',
        a: 'Business hours: an enquiry sent Friday afternoon is answered by Tuesday at the latest. Usually we are faster.',
      },
      {
        q: 'What if my files are larger than 15 MB?',
        a: 'Write to info@stretchmetal.pl — we will send you a link for a larger package. The form also accepts ZIP, which usually does the job.',
      },
      {
        q: 'Do you quote for clients outside Poland?',
        a: 'Yes, we work for clients across the EU. Quotes can be in English, Dutch or Polish; prices in EUR or PLN.',
      },
    ],
  },
  contactStrip: {
    title: 'Prefer to talk first?',
    text: 'Call or write — an engineer will answer your questions before you send any files.',
  },
  thanks: {
    metaTitle: 'Thank You for Your Enquiry | StretchMetal',
    eyebrow: 'Enquiry sent',
    title: [{ text: 'Thank you.' }, { text: "We're on it.", accent: true }],
    text: 'Your enquiry has reached our engineer. The quote with price and lead time will arrive at your address within 48 business hours.',
    nextTitle: 'What happens next',
    next: [
      'We review your documentation and check feasibility.',
      'If anything is missing, we follow up by e-mail or phone.',
      'You receive a quote with a binding delivery date.',
    ],
    backHome: 'Homepage',
    seeServices: 'See our services',
  },
};
