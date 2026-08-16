'use client';

// Mobile sticky conversion bar: call + RFQ buttons pinned to the bottom on
// small screens. Hidden on the RFQ pages themselves (the form is already
// there) — same logic as the stretch-sufit bar.
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';
import { contact } from '@/lib/site-config';
import { path, routes, type Locale } from '@/lib/i18n-routes';
import type { ChromeContent } from '@/content/types';

export default function MobileStickyCta({ locale, chrome }: { locale: Locale; chrome: ChromeContent }) {
  const pathname = usePathname() ?? '/';
  const onRfq =
    pathname.startsWith(routes.rfq.pl) || pathname.startsWith(routes.rfq.en);
  if (onRfq) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 border-t-2 border-red bg-black min-[860px]:hidden">
      <a
        href={contact.phoneHref}
        className="flex min-h-[54px] items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-[0.05em] text-white"
        onClick={() => analytics.phoneClick('mobile-sticky')}
      >
        {chrome.mobileCta.call}
      </a>
      <Link
        href={path('rfq', locale)}
        className="flex min-h-[54px] items-center justify-center gap-2 bg-red text-[13px] font-bold uppercase tracking-[0.05em] text-white"
        onClick={() => analytics.rfqClick('mobile-sticky')}
      >
        {chrome.mobileCta.rfq}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
