// Why-us section — the four commercial arguments in a hairline 2×2 grid on
// the off-white surface.
import FadeIn from '@/components/ui/fade-in';
import SectionTitle from '@/components/ui/section-title';
import type { HomeContent } from '@/content/types';

export default function WhyUs({ content }: { content: HomeContent['whyUs'] }) {
  return (
    <section className="section section--surface">
      <div className="container-sm">
        <FadeIn>
          <SectionTitle num="05" eyebrow={content.eyebrow} title={content.title} small />
        </FadeIn>
        <div className="grid-lines mt-10 min-[860px]:grid-cols-2">
          {content.items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col bg-white p-8">
                <span className="text-[13px] font-bold tracking-[0.16em] text-red">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="h3 mt-4">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-text-muted">{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
