// ============================================================================
// LOCAL CONTACT — which phone number / e-mail the chrome shows per locale.
// Switzerland & Liechtenstein (stretchdecken.ch, 2 Sep 2026): QuinLay AG is
// the general representative and every Swiss lead is theirs, so the header,
// footer, CTA band, mobile menu and contact cards show QuinLay's number and
// address on the ch locale. Every other locale keeps the Belgian HQ.
// Client-safe: only reads site-config constants.
// ============================================================================
import { isSwissLocale, type Locale } from '@/i18n/config';
import { contact, swissPartner } from '@/lib/site-config';

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

/** True on the locales served by QuinLay AG (ch, fr-ch) — re-exported from i18n/config. */
export { isSwissLocale };
