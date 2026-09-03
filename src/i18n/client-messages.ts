// ============================================================================
// CLIENT MESSAGES — the subset of each locale file that is serialised into
// every HTML page for NextIntlClientProvider (hydration of client components).
// The full file (~240 KB raw on nl) used to ship on every page; client
// components only read these top-level namespaces. Server components keep
// using the full file through next-intl/server.
//
// Maintenance: `node scripts/check-client-messages.mjs` walks the client
// module graph and fails when a client component reads a namespace that is
// in neither list. Page-level namespaces are provided by a nested provider
// on the page that renders the component (union with the global set — a
// nested NextIntlClientProvider replaces, it does not merge).
// ============================================================================
import type { AbstractIntlMessages } from 'next-intl';

/** Namespaces every page needs on the client (header, footer, consent, lead modal, forms, hero, estimators). */
export const CLIENT_NAMESPACES = [
  'alt',
  'blogPage',
  'catalog',
  'common',
  'contactPage',
  'cookies',
  'currency',
  'footer',
  'forms',
  'home',
  'inlineLead',
  'inspirationPage',
  'materials',
  'megaMenu',
  'modals',
  'priceCalculatorPage',
  'projectCards',
  'security',
] as const;

/** Namespaces only some pages need on the client — passed by that page's nested provider. */
export const PAGE_NAMESPACES = {
  /** PortfolioGrid (inspiration page): project titles/descriptions (~31 KB raw). */
  projects: ['projects'],
  /** Dealer portal (login form, nav, price list, admin). */
  portal: ['portal'],
} as const;

export function pickMessages(messages: AbstractIntlMessages, keys: readonly string[]): AbstractIntlMessages {
  const out: AbstractIntlMessages = {};
  for (const k of keys) if (k in messages) out[k] = messages[k];
  return out;
}

/** The global client subset. */
export function clientMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return pickMessages(messages, CLIENT_NAMESPACES);
}

/** Global subset + the page-level namespaces a page needs (for a nested provider). */
export function clientMessagesWith(messages: AbstractIntlMessages, extra: readonly string[]): AbstractIntlMessages {
  return pickMessages(messages, [...CLIENT_NAMESPACES, ...extra]);
}
