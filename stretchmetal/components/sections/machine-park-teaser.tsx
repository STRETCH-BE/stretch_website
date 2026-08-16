// Machine park teaser — dark section with the highlight machines in a
// hairline grid and the link to the full machine-park page.
import FadeIn from '@/components/ui/fade-in';
import SectionTitle from '@/components/ui/section-title';
import TrackedCta from '@/components/ui/tracked-cta';
import { path, type Locale } from '@/lib/i18n-routes';
import type { HomeContent } from '@/content/types';

export default function MachineParkTeaser({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent['machinePark'];
}) {
  return (
    <section className="section section--dark">
      <div className="container-sm">
        <FadeIn>
          <SectionTitle num="04" eyebrow={content.eyebrow} title={content.title} lead={content.lead} tone="dark" small />
        </FadeIn>
        <div className="grid-lines grid-lines--dark mt-10 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-4">
          {content.highlights.map((machine, i) => (
            <FadeIn key={machine.name} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col bg-black p-6">
                <span className="tick" aria-hidden />
                <h3 className="mt-5 text-[15.5px] font-extrabold uppercase leading-snug">{machine.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-on-dark-muted">{machine.spec}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <div className="mt-10">
            <TrackedCta
              href={path('machinePark', locale)}
              cta="machine-park"
              location="home-machine-park"
              variant="ghost-light"
            >
              {content.cta}
            </TrackedCta>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
