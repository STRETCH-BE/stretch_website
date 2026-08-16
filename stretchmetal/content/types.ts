// ============================================================================
// CONTENT TYPES — the shared shape of every typed content file. Root files
// (content/*.ts) hold Polish, content/en/*.ts hold English; both must satisfy
// these interfaces, which keeps the locales structurally symmetric — a missing
// section in one language is a type error, not a silent gap.
// ============================================================================
import type { RouteKey } from '@/lib/i18n-routes';

export type ServiceKey = 'welding' | 'laser' | 'cnc' | 'coating' | 'design' | 'structures';

export type Faq = { q: string; a: string };

export type Stat = {
  value: string;
  label: string;
  /** True while the figure awaits owner confirmation — see [CONFIRM] notes. */
  confirm?: boolean;
};

export type ProcessStep = { title: string; text: string };

export type SpecRow = { k: string; v: string };

export type HeroLine = { text: string; accent?: boolean };

// --- Site chrome (nav, footer, banners, shared labels) ----------------------
export type ChromeContent = {
  skipLink: string;
  nav: {
    items: { route: RouteKey; label: string }[];
    cta: string;
    menuOpen: string;
    menuClose: string;
    langLabel: string;
  };
  footer: {
    services: { title: string; items: { route: RouteKey; label: string }[] };
    company: { title: string; items: { route: RouteKey; label: string }[] };
    contactTitle: string;
    hoursLabel: string;
    groupTitle: string;
    groupBlurb: string;
    legalLine: string;
    legal: { route: RouteKey; label: string }[];
  };
  mobileCta: { call: string; rfq: string };
  consent: {
    heading: string;
    text: string;
    accept: string;
    reject: string;
    settings: string;
    analyticsLabel: string;
    analyticsText: string;
    marketingLabel: string;
    marketingText: string;
    save: string;
    privacyLink: string;
  };
  notFound: { code: string; title: string; text: string; cta: string };
  ctaBanner: { title: HeroLine[]; text: string; cta: string };
  breadcrumbHome: string;
};

// --- Home --------------------------------------------------------------------
export type HomeContent = {
  metaTitle: string;
  metaDescription: string;
  hero: {
    badge: string;
    title: HeroLine[];
    lead: string;
    ctaPrimary: string;
    ctaGhost: string;
    imageLabel: string;
    imageSrc?: string;
  };
  ticker: string[];
  stats: { eyebrow: string; title: string; items: Stat[] };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    linkLabel: string;
  };
  process: { eyebrow: string; title: string; lead: string; steps: ProcessStep[] };
  machinePark: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    highlights: { name: string; spec: string }[];
  };
  whyUs: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  heritage: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    imageLabel: string;
    groupLinksTitle: string;
  };
  projects: { eyebrow: string; title: string; lead: string; cta: string };
};

// --- Services ----------------------------------------------------------------
export type ServiceCard = {
  key: ServiceKey;
  name: string;
  blurb: string;
  tags: string[];
};

export type ServiceContent = {
  key: ServiceKey;
  route: RouteKey;
  name: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: HeroLine[];
  lead: string;
  specs: { title: string; rows: SpecRow[]; note?: string };
  applications: { title: string; lead: string; items: { title: string; text: string }[] };
  howToOrder: { title: string; steps: ProcessStep[] };
  faq: { title: string; items: Faq[] };
  related: { title: string; keys: ServiceKey[] };
};

export type ServicesHubContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: HeroLine[];
  lead: string;
  cards: ServiceCard[];
};

// --- Machine park ------------------------------------------------------------
export type Machine = {
  name: string;
  type: string;
  spec: string;
  /** True while specs await confirmation from the workshop. */
  confirm?: boolean;
};

export type MachineParkContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: HeroLine[];
  lead: string;
  machines: Machine[];
  facts: { title: string; items: Stat[] };
};

// --- About -------------------------------------------------------------------
export type AboutContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: HeroLine[];
  lead: string;
  timeline: { title: string; items: { period: string; title: string; text: string }[] };
  group: { title: string; paragraphs: string[]; imageLabel: string };
  values: { title: string; items: { title: string; text: string }[] };
  team: { title: string; text: string; imageLabel: string };
};

// --- Projects ----------------------------------------------------------------
export type Project = {
  title: string;
  services: string[];
  material: string;
  finish: string;
  imageLabel: string;
  /** Sample entry pending replacement with a real case. */
  sample?: boolean;
};

export type ProjectsContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: HeroLine[];
  lead: string;
  metaLabels: { services: string; material: string; finish: string };
  sampleNote: string;
  entries: Project[];
};

// --- RFQ ---------------------------------------------------------------------
export type RfqContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: HeroLine[];
  lead: string;
  form: {
    company: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    countries: { value: string; label: string }[];
    servicesLabel: string;
    services: { key: ServiceKey; label: string }[];
    materialLabel: string;
    materials: { value: string; label: string }[];
    quantity: string;
    quantityPlaceholder: string;
    deadline: string;
    deadlinePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    filesLabel: string;
    filesHint: string;
    filesDrop: string;
    filesBrowse: string;
    filesRemove: string;
    consent: string;
    consentLinkLabel: string;
    submit: string;
    submitting: string;
    optional: string;
    errors: {
      required: string;
      email: string;
      fileType: string;
      fileSize: string;
      fileCount: string;
      consent: string;
      server: string;
    };
  };
  trust: { title: string; items: { title: string; text: string }[] };
  process: { title: string; steps: ProcessStep[] };
  faq: { title: string; items: Faq[] };
  contactStrip: { title: string; text: string };
  thanks: {
    metaTitle: string;
    eyebrow: string;
    title: HeroLine[];
    text: string;
    nextTitle: string;
    next: string[];
    backHome: string;
    seeServices: string;
  };
};

// --- Contact -----------------------------------------------------------------
export type ContactContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: HeroLine[];
  lead: string;
  details: {
    addressTitle: string;
    phoneTitle: string;
    emailTitle: string;
    hoursTitle: string;
    companyTitle: string;
    companyLines: string[];
  };
  mapLabel: string;
  mapCta: string;
  form: {
    title: string;
    lead: string;
    name: string;
    email: string;
    message: string;
    consent: string;
    consentLinkLabel: string;
    submit: string;
    submitting: string;
    success: string;
    errors: { required: string; email: string; consent: string; server: string };
  };
  rfqHint: { text: string; cta: string };
};

// --- Legal -------------------------------------------------------------------
export type LegalSection = { heading: string; paragraphs: string[]; list?: string[] };

export type LegalContent = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};
