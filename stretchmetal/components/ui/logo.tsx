// STRETCHMETAL wordmark — text logo in expanded Archivo with the red square
// "pixel" accent, styled after the STRETCH group mark. Renders as a link to
// the locale home page.
import Link from 'next/link';
import { path, type Locale } from '@/lib/i18n-routes';

export default function Logo({ locale, onDark = true }: { locale: Locale; onDark?: boolean }) {
  return (
    <Link
      href={path('home', locale)}
      className={`wdth-125 inline-flex items-baseline gap-[6px] text-[17px] font-black uppercase tracking-[-0.01em] ${
        onDark ? 'text-white' : 'text-black'
      }`}
      aria-label="StretchMetal"
    >
      <span>
        STRETCH<span className={onDark ? 'text-red-bright' : 'text-red'}>METAL</span>
      </span>
      <span className="h-[7px] w-[7px] self-center bg-red" aria-hidden />
    </Link>
  );
}
