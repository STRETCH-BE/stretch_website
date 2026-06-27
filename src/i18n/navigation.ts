import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, routing } from './config';

// Locale-aware navigation primitives. ALWAYS import Link/redirect/etc. from
// here — never from 'next/link' / 'next/navigation' — so locale prefixing
// happens automatically at the Link level.
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({
    locales,
    localePrefix: routing.localePrefix,
  });
