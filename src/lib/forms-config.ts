// ============================================================================
// FORM CONFIGS — the 7 CtaModal types (quote/survey/training/dates/partner/
// call/samples). Mirrors the CtaModal mockup field-for-field. English copy is
// authored here directly for the EN-only launch; extract to messages/ when
// nl/fr/de are added (flagged in CHANGES.md).
// ============================================================================

export type ModalType =
  | 'quote'
  | 'survey'
  | 'training'
  | 'dates'
  | 'partner'
  | 'call'
  | 'samples'
  | 'datasheet'
  | 'project'
  | 'kit_order'
  | 'supply_inquiry';

export type FieldKind = 'text' | 'select' | 'area';

export type FormField = {
  /** Stable key submitted to the API + used as the email label. */
  name: string;
  kind: FieldKind;
  label: string;
  inputType?: 'text' | 'email' | 'tel';
  placeholder?: string;
  options?: string[];
  /**
   * Stable submitted values parallel to `options`. When set, the select posts
   * optionValues[i] while showing the (localized) options[i] label — server
   * logic must never depend on a localized label. Localization overlays
   * replace `options` only; `optionValues` always comes from this file.
   */
  optionValues?: string[];
  /** Span both grid columns. */
  full?: boolean;
  required?: boolean;
};

export type ModalConfig = {
  title: string;
  subtitle: string;
  submitLabel: string;
  sentTitle: string;
  sentMsg: string;
  showDates?: boolean;
  fields: FormField[];
};

export const TRAINING_DATES = [
  '15–16 Sep 2026',
  '06–08 Oct 2026',
  '17–18 Nov 2026',
  'English session — new dates soon',
  'German session — new dates soon',
  'Custom on-site session',
];

export type TrainingSession = {
  date: string;
  note: string;
  /** Language(s) of instruction — rendered as badges (codes stay untranslated). */
  languages: string[];
  /** EN/DE international sessions: interest capture until real dates land
   *  (Michael confirms them) — booked via source 'training_international'. */
  international?: boolean;
};

export const TRAINING_DATE_DETAIL: TrainingSession[] = [
  { date: '15–16 Sep 2026', note: 'Beveren-Waas · 4 seats', languages: ['NL'] },
  { date: '06–08 Oct 2026', note: 'Beveren-Waas · 6 seats', languages: ['NL'] },
  { date: '17–18 Nov 2026', note: 'Beveren-Waas · 8 seats', languages: ['NL'] },
  { date: 'English session — new dates soon', note: 'Beveren-Waas · international group', languages: ['EN'], international: true },
  { date: 'German session — new dates soon', note: 'Beveren-Waas · international group', languages: ['DE'], international: true },
];

// ---------------------------------------------------------------------------
// COUNTRY + CITY — shared across every lead form so the team can route each
// enquiry to the right market. The select submits stable ISO 3166-1 codes
// (never localized labels); display names come from modals.shared.countries.
// ---------------------------------------------------------------------------
export const COUNTRY_VALUES = [
  'BE', 'NL', 'FR', 'DE', 'AT', 'CH', 'LU', 'PL', 'ES', 'PT',
  'DK', 'SE', 'NO', 'IS', 'GB', 'US', 'OTHER',
] as const;

export const COUNTRY_OPTIONS_EN = [
  'Belgium', 'Netherlands', 'France', 'Germany', 'Austria', 'Switzerland',
  'Luxembourg', 'Poland', 'Spain', 'Portugal', 'Denmark', 'Sweden', 'Norway',
  'Iceland', 'United Kingdom', 'United States', 'Other country',
] as const;

/** The pre-selected country per locale domain (en = international, no default). */
const LOCALE_DEFAULT_COUNTRY: Record<string, string> = {
  uk: 'GB',
  be: 'BE', nl: 'NL', fr: 'FR', de: 'DE', pl: 'PL', es: 'ES',
  pt: 'PT', da: 'DK', sv: 'SE', no: 'NO', is: 'IS',
};

export function defaultCountryForLocale(locale: string): string | undefined {
  return LOCALE_DEFAULT_COUNTRY[locale];
}

const countryField = (required = true): FormField => ({
  name: 'country',
  kind: 'select',
  label: 'Country',
  options: [...COUNTRY_OPTIONS_EN],
  optionValues: [...COUNTRY_VALUES],
  required,
});

const cityField = (required = false): FormField => ({
  name: 'city',
  kind: 'text',
  inputType: 'text',
  label: 'City',
  placeholder: 'Your city',
  required,
});

export const MODAL_CONFIGS: Record<ModalType, ModalConfig> = {
  quote: {
    title: 'Request a free quote',
    subtitle: 'Tell us about your project and we will get back to you with a tailored price.',
    submitLabel: 'Send request',
    sentTitle: 'Request received',
    sentMsg: 'Thanks — a specialist will reply within two working days.',
    fields: [
      { name: 'name', kind: 'text', inputType: 'text', label: 'Name', placeholder: 'First & last name', required: true },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@email.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      cityField(true),
      countryField(),
      { name: 'rooms', kind: 'select', label: 'Rooms', options: ['1 room', '2 rooms', '3 rooms', '4 rooms', 'More than 4'] },
      { name: 'timeline', kind: 'select', label: 'Timeline', options: ['As soon as possible', 'Within 1–3 months', 'Within 4–12 months', 'Just exploring'] },
      { name: 'message', kind: 'area', label: 'Your project', placeholder: 'Surface, location, anything useful...', full: true },
    ],
  },
  survey: {
    title: 'Book a site survey',
    subtitle: 'We measure up and advise on site — free and without obligation.',
    submitLabel: 'Request survey',
    sentTitle: 'Survey requested',
    sentMsg: 'Thanks — we will contact you to arrange a convenient time.',
    fields: [
      { name: 'name', kind: 'text', inputType: 'text', label: 'Name', placeholder: 'First & last name', required: true },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@email.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      { name: 'address', kind: 'text', inputType: 'text', label: 'Address', placeholder: 'Street, city', full: true },
      countryField(),
      { name: 'preferredTime', kind: 'select', label: 'Preferred time', options: ['Morning', 'Afternoon', 'Flexible'] },
      { name: 'rooms', kind: 'select', label: 'Rooms', options: ['1 room', '2 rooms', '3 rooms', '4+ rooms'] },
    ],
  },
  training: {
    title: 'Book your training',
    subtitle: 'Hands-on certification at our Belgian HQ — leave your details and we will confirm.',
    submitLabel: 'Request my seat',
    sentTitle: 'Seat requested',
    sentMsg: 'Thanks — we will confirm your spot and send joining details.',
    fields: [
      { name: 'fullName', kind: 'text', inputType: 'text', label: 'Full name', placeholder: 'First & last name', required: true },
      { name: 'company', kind: 'text', inputType: 'text', label: 'Company', placeholder: 'Your company' },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@company.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      cityField(),
      countryField(),
      { name: 'preferredDate', kind: 'select', label: 'Preferred date', options: TRAINING_DATES },
      { name: 'attendees', kind: 'select', label: 'Attendees', options: ['1 person', '2 people', '3 people', '4+ people'] },
    ],
  },
  dates: {
    title: 'Upcoming training dates',
    subtitle: 'Pick a date and reserve your seat — small groups, booked first-come.',
    submitLabel: 'Request my seat',
    sentTitle: 'Seat requested',
    sentMsg: 'Thanks — we will confirm your spot and send joining details.',
    showDates: true,
    fields: [
      { name: 'fullName', kind: 'text', inputType: 'text', label: 'Full name', placeholder: 'First & last name', required: true },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@company.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      countryField(),
      { name: 'preferredDate', kind: 'select', label: 'Preferred date', options: TRAINING_DATES },
    ],
  },
  partner: {
    title: 'Apply to become a partner',
    subtitle: 'Tell us about your company — we review every application personally.',
    submitLabel: 'Submit application',
    sentTitle: 'Application received',
    sentMsg: 'Thanks — our partner team will review and get back to you within two working days.',
    fields: [
      { name: 'company', kind: 'text', inputType: 'text', label: 'Company', placeholder: 'Your company', required: true },
      { name: 'contactName', kind: 'text', inputType: 'text', label: 'Contact name', placeholder: 'First & last name', required: true },
      { name: 'partnerType', kind: 'select', label: 'I want to become a', options: ['Reseller — I sell, you install', 'Dealer — I sell & install myself', 'Not sure yet'] },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@company.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      cityField(),
      countryField(),
      { name: 'activity', kind: 'select', label: 'Activity', options: ['Building & renovation', 'Interior fit-out', 'Dry-lining / plastering', 'Electrical / lighting', 'Other'] },
      { name: 'notes', kind: 'area', label: 'About your business', placeholder: 'Team size, regions you cover, current activity...', full: true },
    ],
  },
  call: {
    title: 'Book a call',
    subtitle: 'Leave your number and a good time — we will call you back.',
    submitLabel: 'Request a call',
    sentTitle: 'Call requested',
    sentMsg: 'Thanks — we will call you at your preferred time.',
    fields: [
      { name: 'name', kind: 'text', inputType: 'text', label: 'Name', placeholder: 'First & last name', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      cityField(),
      countryField(),
      { name: 'bestTime', kind: 'select', label: 'Best time', options: ['Morning', 'Afternoon', 'Early evening'] },
      { name: 'topic', kind: 'select', label: 'Topic', options: ['A quote', 'Partnership', 'Training', 'Technical question', 'Other'] },
    ],
  },
  samples: {
    title: 'Request colour samples',
    subtitle: 'Order physical RAL / colour swatches — free for trade partners.',
    submitLabel: 'Request samples',
    sentTitle: 'Samples requested',
    sentMsg: 'Thanks — we will post your swatches and follow up within two working days.',
    fields: [
      { name: 'company', kind: 'text', inputType: 'text', label: 'Company', placeholder: 'Your company', required: true },
      { name: 'contactName', kind: 'text', inputType: 'text', label: 'Contact name', placeholder: 'First & last name', required: true },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@company.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      { name: 'shippingAddress', kind: 'text', inputType: 'text', label: 'Shipping address', placeholder: 'Street, postcode, city', full: true },
      countryField(),
      { name: 'productLine', kind: 'select', label: 'Product line', options: ['Polyester', 'PVC film', 'Acoustic', 'Not sure yet'] },
      { name: 'colours', kind: 'text', inputType: 'text', label: 'Colours of interest', placeholder: 'e.g. White, Anthracite, Custom RAL' },
      { name: 'notes', kind: 'area', label: 'Notes', placeholder: 'Project, quantities, anything useful...', full: true },
    ],
  },
  datasheet: {
    title: 'Get the datasheet by email',
    subtitle: 'Leave your details and we’ll email the datasheet straight to your inbox. We only use them to follow up on your enquiry.',
    submitLabel: 'Email me the datasheet',
    sentTitle: 'Check your inbox',
    sentMsg: 'The datasheet is on its way to {email}. Don’t see it within a few minutes? Check your spam folder.',
    fields: [
      { name: 'name', kind: 'text', inputType: 'text', label: 'Name', placeholder: 'First & last name', required: true, full: true },
      {
        name: 'role',
        kind: 'select',
        label: 'I am a(n)',
        options: ['Architect', 'Installer', 'Private client', 'Other business'],
        optionValues: ['architect', 'installer', 'private', 'other'],
        required: true,
      },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@email.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      { name: 'city', kind: 'text', inputType: 'text', label: 'City', placeholder: 'Your city', required: true },
      countryField(false),
    ],
  },
  kit_order: {
    title: 'Order the DIY kit',
    subtitle:
      'Tell us about your ceiling and we reply within one working day with a tailored quote and a proforma invoice in EUR.',
    submitLabel: 'Request my kit quote',
    sentTitle: 'Kit request received',
    sentMsg: 'Thanks — we confirm your kit, price and delivery within one working day with a proforma invoice in EUR.',
    fields: [
      { name: 'name', kind: 'text', inputType: 'text', label: 'Name', placeholder: 'First & last name', required: true },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@email.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+44 ...', required: true },
      countryField(),
      { name: 'size', kind: 'text', inputType: 'text', label: 'Ceiling size', placeholder: 'e.g. 4 × 5 m or 20 m²', required: true },
      {
        name: 'finish',
        kind: 'select',
        label: 'Fabric',
        // The kit's real variants (materials.ts) — not the PVC finish range.
        options: ['Standard (matte white)', 'Acoustic', 'Translucent'],
        optionValues: ['standard', 'acoustic', 'translucent'],
      },
      { name: 'message', kind: 'area', label: 'Your room', placeholder: 'Ceiling shape, obstacles, lighting plans…', full: true },
    ],
  },
  supply_inquiry: {
    title: 'Talk to our supply team',
    subtitle: 'Tell us what you install and where — we reply within one working day with how we can supply you.',
    submitLabel: 'Send my inquiry',
    sentTitle: 'Inquiry received',
    sentMsg: 'Thanks — our supply team replies within one working day.',
    fields: [
      { name: 'name', kind: 'text', inputType: 'text', label: 'Name', placeholder: 'First & last name', required: true },
      { name: 'company', kind: 'text', inputType: 'text', label: 'Company', placeholder: 'Your company', required: true },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@company.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+33 ...', required: true },
      countryField(),
      { name: 'message', kind: 'area', label: 'What do you need?', placeholder: 'Materials, confection, volumes, timing…', full: true },
    ],
  },
  project: {
    title: 'Register a project',
    subtitle: 'Tell us about your live project — a dedicated advisor follows up within one working day with spec support, budget input and priority sampling.',
    submitLabel: 'Register the project',
    sentTitle: 'Project registered',
    sentMsg: 'Thanks — a dedicated advisor will contact you within one working day.',
    fields: [
      { name: 'projectName', kind: 'text', inputType: 'text', label: 'Project name', placeholder: 'Project or working title', required: true },
      { name: 'location', kind: 'text', inputType: 'text', label: 'Location', placeholder: 'City', required: true },
      countryField(),
      {
        name: 'buildingType',
        kind: 'select',
        label: 'Building type',
        options: ['Office', 'Hospitality', 'Healthcare', 'Retail', 'Residential', 'Education', 'Other'],
        optionValues: ['office', 'hospitality', 'healthcare', 'retail', 'residential', 'education', 'other'],
      },
      {
        name: 'system',
        kind: 'select',
        label: 'System',
        options: ['Polyester', 'PVC', 'Acoustic', 'Light & print', 'Prefab', 'Not sure yet'],
        optionValues: ['polyester', 'pvc', 'acoustic', 'light-print', 'prefab', 'unsure'],
      },
      {
        name: 'stage',
        kind: 'select',
        label: 'Stage',
        options: ['Concept', 'Design', 'Tender', 'On site'],
        optionValues: ['concept', 'design', 'tender', 'on-site'],
      },
      { name: 'area', kind: 'text', inputType: 'text', label: 'Area', placeholder: 'approx. m²' },
      { name: 'email', kind: 'text', inputType: 'email', label: 'Email', placeholder: 'you@office.com', required: true },
      { name: 'phone', kind: 'text', inputType: 'tel', label: 'Phone', placeholder: '+32 ...', required: true },
      { name: 'notes', kind: 'area', label: 'Notes', placeholder: 'Ceiling heights, acoustics targets, deadlines...', full: true },
    ],
  },
};
