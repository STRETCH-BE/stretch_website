// Global 404 — rendered inside the root layout only (no locale chrome), so it
// carries both languages: PL first (default tree), EN below, links to both
// home pages. Styled in the design system: black, display type, red accent.
import Link from 'next/link';
import { getContent } from '@/content';
import { routes } from '@/lib/i18n-routes';

export default function NotFound() {
  const pl = getContent('pl').chrome.notFound;
  const en = getContent('en').chrome.notFound;

  return (
    <main className="section--dark flex min-h-screen items-center">
      <div className="container-sm py-20">
        <p className="wdth-125 text-[clamp(80px,16vw,220px)] font-black leading-none text-red-bright">
          {pl.code}
        </p>
        <h1 className="h2 mt-6">{pl.title}</h1>
        <p className="lead mt-4 max-w-[520px] text-on-dark-soft">{pl.text}</p>
        <p className="mt-6 max-w-[520px] text-[14px] text-on-dark-muted" lang="en">
          <strong className="uppercase">{en.title}.</strong> {en.text}
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href={routes.home.pl} className="btn btn--primary">
            {pl.cta}
            <span className="btn__arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link href={routes.home.en} className="btn btn--ghost-light" lang="en">
            {en.cta}
            <span className="btn__arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
