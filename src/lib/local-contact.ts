// ============================================================================
// LOCAL CONTACT — which phone number / e-mail the chrome shows per locale.
// Switzerland & Liechtenstein (stretchdecken.ch, 2 Sep 2026): QuinLay AG is
// the general representative and every Swiss lead is theirs, so the header,
// footer, CTA band, mobile menu and contact cards show QuinLay's number and
// address on the ch locale. Every other locale keeps the Belgian HQ.
// Client-safe: only reads site-config constants.
// ============================================================================
import { isSwissLocale, type Locale } from '@/i18n/config';
import { contact, offices, swissPartner, type Office } from '@/lib/site-config';
import type { MapPlace } from '@/lib/maps';

export type LocalContact = {
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  /** The organisation the visitor actually reaches. */
  name: string;
};

export function localContactFor(locale: Locale): LocalContact {
  if (isSwissLocale(locale)) {
    return {
      phoneDisplay: swissPartner.phoneDisplay,
      phoneHref: swissPartner.phoneHref,
      email: swissPartner.email,
      name: swissPartner.name,
    };
  }
  return { phoneDisplay: contact.phoneDisplay, phoneHref: contact.phoneHref, email: contact.email, name: 'STRETCH' };
}

/**
 * The Google listing the contact-page map shows, plus the office whose
 * address goes in the box under it (undefined = the Belgian HQ / QuinLay,
 * which the page renders from contact / swissPartner). Poland
 * (stretch-sufit.pl) maps the Częstochowa branch; the Swiss locales map
 * QuinLay AG; every other locale maps the Beveren HQ.
 */
export function mapPlaceFor(locale: Locale): { place: MapPlace; office?: Office } {
  if (isSwissLocale(locale)) return { place: swissPartner.maps };
  if (locale === 'pl') {
    const pl = offices.find((o) => o.country === 'PL');
    if (pl?.maps) return { place: pl.maps, office: pl };
  }
  return { place: contact.maps };
}

/** True on the locales served by QuinLay AG (ch, fr-ch) — re-exported from i18n/config. */
export { isSwissLocale };
