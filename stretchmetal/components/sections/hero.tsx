// Home hero — black, full-height: group badge chip, the display headline with
// one red word, positioning lead and the two CTAs; the future hero photo slot
// runs full-width below the copy (a stacked layout lets the display type use
// the whole container — a side column can't hold 10.5vw Archivo Expanded).
import FadeIn from '@/components/ui/fade-in';
import MetaChip from '@/components/ui/meta-chip';
import Placeholder from '@/components/ui/placeholder';
import TrackedCta from '@/components/ui/tracked-cta';
import { path, type Locale } from '@/lib/i18n-routes';
import type { HomeContent } from '@/content/types';

export default function Hero({ locale, content }: { locale: Locale; content: HomeContent['hero'] }) {
  return (
    <section className="section--dark relative overflow-hidden">
      <div className="container-sm flex min-h-[calc(100vh-72px)] flex-col justify-center py-16 min-[1000px]:py-20">
        <FadeIn>
          <MetaChip>{content.badge}</MetaChip>
          <h1 className="h-display mt-7">
            {content.title.map((line, i) => (
              <span key={i} className={`block ${line.accent ? 'text-red-bright' : ''}`}>
                {line.text}
              </span>
            ))}
          </h1>
          <p className="lead mt-8 max-w-[560px] text-on-dark-soft">{content.lead}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <TrackedCta href={path('rfq', locale)} cta="hero-primary" location="hero" rfq size="lg">
              {content.ctaPrimary}
            </TrackedCta>
            <TrackedCta
              href={path('services', locale)}
              cta="hero-services"
              location="hero"
              variant="ghost-light"
              size="lg"
            >
              {content.ctaGhost}
            </TrackedCta>
          </div>
        </FadeIn>
        <FadeIn delay={150} className="mt-14 hidden min-[860px]:block">
          <Placeholder label={content.imageLabel} src={content.imageSrc} ratio="21/8" />
        </FadeIn>
      </div>
    </section>
  );
}
