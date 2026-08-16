// ============================================================================
// CHROME (EN) — navigation, footer, cookie banner, mobile bar, 404 and shared
// CTAs. English mirror of content/chrome.ts; the ChromeContent type keeps the
// two locales structurally identical.
// ============================================================================
import type { ChromeContent } from '@/content/types';

export const chrome: ChromeContent = {
  skipLink: 'Skip to content',
  nav: {
    items: [
      { route: 'services', label: 'Services' },
      { route: 'machinePark', label: 'Machine park' },
      { route: 'projects', label: 'Projects' },
      { route: 'about', label: 'About' },
      { route: 'contact', label: 'Contact' },
    ],
    cta: 'Send your drawing',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    langLabel: 'Language',
  },
  footer: {
    services: {
      title: 'Services',
      items: [
        { route: 'welding', label: 'Welding' },
        { route: 'laser', label: 'Laser cutting' },
        { route: 'cnc', label: 'CNC machining' },
        { route: 'coating', label: 'Powder coating' },
        { route: 'design', label: 'Design & engineering' },
        { route: 'structures', label: 'Steel structures' },
      ],
    },
    company: {
      title: 'Company',
      items: [
        { route: 'about', label: 'About us' },
        { route: 'machinePark', label: 'Machine park' },
        { route: 'projects', label: 'Projects' },
        { route: 'rfq', label: 'Request a quote' },
        { route: 'contact', label: 'Contact' },
      ],
    },
    contactTitle: 'Contact',
    hoursLabel: 'Opening hours',
    groupTitle: 'Group',
    groupBlurb:
      'StretchMetal is part of the Belgian Stretchgroup — a stretch-ceiling manufacturer with its production plant in Częstochowa, Poland.',
    // [CONFIRM] full registration data: VAT ID / KRS / share capital
    legalLine:
      'StretchMetal — a brand of Alto Design Sp. z o.o. · ul. Legionów 59, 42-200 Częstochowa, Poland · VAT ID: [to be confirmed]',
    legal: [
      { route: 'privacy', label: 'Privacy policy' },
      { route: 'cookies', label: 'Cookie policy' },
    ],
  },
  mobileCta: { call: 'Call us', rfq: 'Send your drawing' },
  consent: {
    heading: 'Cookies & analytics',
    text: 'We use cookies to analyse traffic and measure how the site performs. Accept all, reject all, or choose a scope — the details are in our cookie policy.',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Settings',
    analyticsLabel: 'Analytics',
    analyticsText: 'Visit statistics and session recordings (GA4, PostHog, Clarity).',
    marketingLabel: 'Marketing',
    marketingText: 'Ad pixels for campaign measurement (Meta).',
    save: 'Save choice',
    privacyLink: 'Cookie policy',
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    text: 'The address is wrong or the page has moved. Head back to the homepage or browse our services.',
    cta: 'Homepage',
  },
  ctaBanner: {
    title: [{ text: 'Got a drawing?' }, { text: "You've got a quote.", accent: true }],
    text: 'Send your DXF, DWG, STEP or PDF documentation. We reply within 48 business hours — with a price and a delivery date.',
    cta: 'Send your drawing',
  },
  breadcrumbHome: 'Home',
};
