// ============================================================================
// ANALYTICS — one track() that fires into every active platform, plus typed
// wrappers for the canonical event taxonomy. Consent-aware: PostHog + Clarity
// only load with analytics consent, Meta only fires with marketing consent,
// GA is gated by Consent Mode v2 (loads always, sends modelled hits).
// Every platform no-ops when its env key is missing — zero-config safe.
// ============================================================================
import { getConsent } from '@/lib/consent';

// Browser globals injected by the third-party scripts. Typed loosely on purpose.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    posthog?: {
      capture?: (event: string, props?: Record<string, unknown>) => void;
      opt_in_capturing?: () => void;
      opt_out_capturing?: () => void;
    };
  }
}

export type EventProps = Record<string, string | number | boolean | undefined>;

export function track(eventName: string, props?: EventProps): void {
  if (typeof window === 'undefined') return;

  // GA4 — Consent Mode handles gating, so always attempt to send.
  try {
    window.gtag?.('event', eventName, props || {});
  } catch {
    /* no-op */
  }

  const consent = getConsent();

  // PostHog — the loader only initialises it with analytics consent, so a
  // present window.posthog is already consent-approved.
  if (consent?.analytics) {
    try {
      window.posthog?.capture?.(eventName, props || {});
    } catch {
      /* no-op */
    }
  }

  if (consent?.marketing) {
    // Map our taxonomy onto Meta's standard events.
    const metaMap: Record<string, string> = {
      rfq_submitted: 'Lead',
      contact_submitted: 'Contact',
      rfq_click: 'Lead',
    };
    try {
      if (window.fbq && metaMap[eventName]) {
        window.fbq('track', metaMap[eventName], props || {});
      }
    } catch {
      /* no-op */
    }
  }

  // Clarity custom tags (Clarity itself is gated at load time; setting tags is
  // harmless if it never loaded).
  try {
    if (typeof window.clarity === 'function' && props) {
      for (const [k, v] of Object.entries(props)) {
        if (v != null) window.clarity('set', k, String(v));
      }
    }
  } catch {
    /* no-op */
  }
}

// ---------------------------------------------------------------------------
// Typed wrappers — the canonical events. Wire these into components directly.
// ---------------------------------------------------------------------------
export const analytics = {
  /** Any tracked CTA click; `cta` identifies the button, `location` the section. */
  ctaClick(cta: string, location: string) {
    track('cta_click', { cta, location });
  },
  rfqClick(location: string) {
    track('rfq_click', { location });
  },
  /** RFQ form successfully submitted. `services` = comma-joined service keys. */
  rfqSubmitted(p: { services: string; files: number; locale: string }) {
    track('rfq_submitted', p);
  },
  rfqError(reason: string) {
    track('rfq_error', { reason });
  },
  contactSubmitted(locale: string) {
    track('contact_submitted', { locale });
  },
  phoneClick(location: string) {
    track('phone_click', { location });
  },
  emailClick(location: string) {
    track('email_click', { location });
  },
  languageSwitch(from: string, to: string, pathname: string) {
    track('language_switch', { from, to, path: pathname });
  },
};
