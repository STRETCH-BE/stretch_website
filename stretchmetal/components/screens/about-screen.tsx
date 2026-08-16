// About — the group story: timeline (Belgium → Częstochowa → workshop →
// StretchMetal), the group block, values and the team placeholder.
import Breadcrumbs from '@/components/sections/breadcrumbs';
import CtaFinal from '@/components/sections/cta-final';
import Heritage from '@/components/sections/heritage';
import PageHero from '@/components/sections/page-hero';
import FadeIn from '@/components/ui/fade-in';
import Placeholder from '@/components/ui/placeholder';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { absoluteUrl, path, type Locale } from '@/lib/i18n-routes';
import { breadcrumbSchema, organizationSchema } from '@/lib/schema';

export default function AboutScreen({ locale }: { locale: Locale }) {
  const { about, home, chrome } = getContent(locale);
  const label = chrome.nav.items.find((i) => i.route === 'about')?.label ?? 'About';

  return (
    <>
      <JsonLd data={organizationSchema(locale)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          { name: label, url: absoluteUrl('about', locale) },
        ])}
      />
      <Breadcrumbs crumbs={[{ label: chrome.breadcrumbHome, href: path('home', locale) }, { label }]} />
      <PageHero eyebrow={about.eyebrow} title={about.title} lead={about.lead} />

      {/* Timeline */}
      <section className="section">
        <div className="container-sm">
          <FadeIn>
            <h2 className="h2 h2--sm">{about.timeline.title}</h2>
          </FadeIn>
          <div className="grid-lines mt-10 min-[860px]:grid-cols-4">
            {about.timeline.items.map((item, i) => (
              <FadeIn key={item.title} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col bg-white p-7">
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-red">{item.period}</p>
                  <h3 className="h3 mt-4">{item.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Group block */}
      <section className="section section--surface">
        <div className="container-sm grid gap-10 min-[1000px]:grid-cols-[1fr_0.9fr]">
          <FadeIn>
            <h2 className="h2 h2--sm">{about.group.title}</h2>
            <div className="mt-6 flex max-w-[560px] flex-col gap-4">
              {about.group.paragraphs.map((p, i) => (
                <p key={i} className="text-[14.5px] leading-relaxed text-text-body">
                  {p}
                </p>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={120} className="min-h-[300px]">
            <Placeholder label={about.group.imageLabel} />
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-sm">
          <FadeIn>
            <h2 className="h2 h2--sm">{about.values.title}</h2>
          </FadeIn>
          <div className="grid-lines mt-10 min-[860px]:grid-cols-3">
            {about.values.items.map((value, i) => (
              <FadeIn key={value.title} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col bg-white p-8">
                  <span className="tick" aria-hidden />
                  <h3 className="h3 mt-5">{value.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-text-muted">{value.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section className="section section--surface">
        <div className="container-sm grid items-center gap-10 min-[1000px]:grid-cols-[0.9fr_1fr]">
          <FadeIn className="min-h-[280px]">
            <Placeholder label={about.team.imageLabel} light />
          </FadeIn>
          <FadeIn delay={120}>
            <h2 className="h2 h2--sm">{about.team.title}</h2>
            <p className="mt-5 max-w-[520px] text-[14.5px] leading-relaxed text-text-body">{about.team.text}</p>
          </FadeIn>
        </div>
      </section>

      <Heritage locale={locale} content={home.heritage} />
      <CtaFinal locale={locale} content={chrome.ctaBanner} location="about" />
    </>
  );
}
