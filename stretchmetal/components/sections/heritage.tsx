// Heritage section — dark: the Stretchgroup story (Belgium → Częstochowa →
// the workshop opening to the market) with the sister-brand links.
import FadeIn from '@/components/ui/fade-in';
import Placeholder from '@/components/ui/placeholder';
import SectionTitle from '@/components/ui/section-title';
import { groupSites } from '@/lib/site-config';
import type { Locale } from '@/lib/i18n-routes';
import type { HomeContent } from '@/content/types';

export default function Heritage({
  locale,
  content,
}: {
  locale: Locale;
  content: HomeContent['heritage'];
}) {
  return (
    <section className="section section--dark">
      <div className="container-sm grid gap-12 min-[1000px]:grid-cols-[1.1fr_0.9fr]">
        <FadeIn>
          <SectionTitle num="06" eyebrow={content.eyebrow} title={content.title} tone="dark" small />
          <div className="mt-6 flex max-w-[560px] flex-col gap-4">
            {content.paragraphs.map((p, i) => (
              <p key={i} className="text-[14.5px] leading-relaxed text-on-dark-soft">
                {p}
              </p>
            ))}
          </div>
          <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.18em] text-on-dark-muted">
            {content.groupLinksTitle}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {groupSites.map((site) => (
              <li key={site.url}>
                <a href={site.url} rel="noopener" className="lnk text-[14px] font-bold text-white">
                  {site.name}
                  <span className="ml-2 font-normal text-on-dark-muted">{site.blurb[locale]}</span>
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>
        <FadeIn delay={150} className="min-h-[320px]">
          <Placeholder label={content.imageLabel} />
        </FadeIn>
      </div>
    </section>
  );
}
