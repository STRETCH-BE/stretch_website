// ============================================================================
// SITE CONFIG — the single source of truth for brand, contact and legal data.
// Every component, schema builder and email template reads from here; nothing
// else hardcodes an address, phone number or URL. Items tagged [CONFIRM] are
// placeholders awaiting confirmation from the owner — grep for "[CONFIRM]"
// to find every one before launch.
// ============================================================================

/** Absolute production origin. Vercel: set NEXT_PUBLIC_SITE_URL (no trailing
 *  slash). The fallback is the intended production domain. [CONFIRM] domain */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stretchmetal.pl'
).replace(/\/$/, '');

export const brand = {
  name: 'StretchMetal',
  /** Wordmark rendering — always uppercase in the logo lockup. */
  display: 'STRETCHMETAL',
  /** [CONFIRM] legal entity operating the StretchMetal brand */
  legalName: 'Alto Design Sp. z o.o.',
  parentCompany: 'Stretchgroup',
  /** Short positioning line used in schema + meta fallbacks. */
  description: {
    pl: 'Usługi obróbki metali B2B: spawanie, cięcie laserowe, obróbka CNC, malowanie proszkowe i kompletne konstrukcje stalowe. Warsztat belgijskiej Stretchgroup w Częstochowie.',
    en: 'B2B metal fabrication services: welding, laser cutting, CNC machining, powder coating and complete custom steel structures. The Belgian Stretchgroup workshop in Częstochowa, Poland.',
  },
} as const;

export const contact = {
  /** [CONFIRM] e-mail */
  email: 'info@stretchmetal.pl',
  /** [CONFIRM] phone */
  phone: '+48 730 700 333',
  phoneHref: 'tel:+48730700333',
  address: {
    /** [CONFIRM] street address */
    street: 'ul. Legionów 59',
    postalCode: '42-200',
    city: 'Częstochowa',
    region: 'woj. śląskie',
    country: 'PL',
    countryName: { pl: 'Polska', en: 'Poland' },
  },
  /** [CONFIRM] geo coordinates */
  geo: { lat: 50.80759, lng: 19.15894 },
  /** [CONFIRM] opening hours (Mo–Fr 08:00–16:00) */
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '16:00' },
  hoursLabel: { pl: 'pn–pt 8:00–16:00', en: 'Mon–Fri 08:00–16:00' },
} as const;

/** Sister brands of the Stretchgroup — linked in the footer, heritage section
 *  and Organization schema (sameAs). */
export const groupSites = [
  {
    name: 'STRETCH',
    url: 'https://stretchplafond.be',
    blurb: {
      pl: 'Sufity napinane — Belgia',
      en: 'Seamless stretch ceilings — Belgium',
    },
  },
  {
    name: 'Stretch Sufit',
    url: 'https://altodesign.pl',
    blurb: {
      pl: 'Sufity napinane — Polska',
      en: 'Stretch ceilings — Poland',
    },
  },
] as const;

/** Social profiles for schema sameAs. [CONFIRM] — none created yet; keep empty
 *  until real profiles exist (schema omits sameAs entries that aren't real). */
export const social: { name: string; url: string }[] = [];

/** Where RFQ + contact submissions are delivered. Falls back to the public
 *  contact address so a half-configured mailer still routes somewhere real. */
export const rfqDestination = process.env.RFQ_DESTINATION ?? contact.email;
