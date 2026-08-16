// Stats strip — hairline grid of big numbers. Values flagged `confirm` in the
// content files are working figures; the copy never presents them outside
// this strip as verified facts.
import FadeIn from '@/components/ui/fade-in';
import SectionTitle from '@/components/ui/section-title';
import type { HomeContent } from '@/content/types';

export default function Stats({ content }: { content: HomeContent['stats'] }) {
  return (
    <section className="section section--surface">
      <div className="container-sm">
        <FadeIn>
          <SectionTitle num="01" eyebrow={content.eyebrow} title={content.title} small />
        </FadeIn>
        <FadeIn delay={100}>
          <div className="grid-lines mt-10 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-5">
            {content.items.map((stat) => (
              <div key={stat.label} className="bg-white p-7">
                <p className="wdth-125 text-[clamp(30px,3.4vw,44px)] font-black uppercase leading-none tracking-[-0.02em]">
                  {stat.value}
                </p>
                <p className="mt-3 text-[13px] font-semibold leading-snug text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
