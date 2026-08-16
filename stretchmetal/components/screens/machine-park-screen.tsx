// Machine park — dark technical page: hairline grid of machine cards (name,
// type, working parameters) + hall facts. Honest: confirm-flagged entries stay
// in the content file until the workshop verifies them.
import Breadcrumbs from '@/components/sections/breadcrumbs';
import CtaFinal from '@/components/sections/cta-final';
import PageHero from '@/components/sections/page-hero';
import FadeIn from '@/components/ui/fade-in';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { absoluteUrl, path, type Locale } from '@/lib/i18n-routes';
import { breadcrumbSchema } from '@/lib/schema';

export default function MachineParkScreen({ locale }: { locale: Locale }) {
  const { machinePark, chrome } = getContent(locale);
  const label = chrome.nav.items.find((i) => i.route === 'machinePark')?.label ?? 'Machine park';

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          { name: label, url: absoluteUrl('machinePark', locale) },
        ])}
      />
      <Breadcrumbs crumbs={[{ label: chrome.breadcrumbHome, href: path('home', locale) }, { label }]} />
      <PageHero eyebrow={machinePark.eyebrow} title={machinePark.title} lead={machinePark.lead} />

      <section className="section section--dark border-t border-line-dark">
        <div className="container-sm">
          <div className="grid-lines grid-lines--dark min-[640px]:grid-cols-2 min-[1100px]:grid-cols-4">
            {machinePark.machines.map((machine, i) => (
              <FadeIn key={machine.name} delay={i * 50} className="h-full">
                <div className="flex h-full flex-col bg-black p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-dark-muted">
                    {machine.type}
                  </p>
                  <h2 className="mt-3 text-[16px] font-extrabold uppercase leading-snug text-white">
                    {machine.name}
                  </h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-on-dark-soft">{machine.spec}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Hall facts */}
          <FadeIn delay={150}>
            <h2 className="h2 h2--sm mt-16">{machinePark.facts.title}</h2>
          </FadeIn>
          <div className="grid-lines grid-lines--dark mt-8 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-4">
            {machinePark.facts.items.map((stat) => (
              <FadeIn key={stat.label} className="h-full">
                <div className="flex h-full flex-col bg-black p-7">
                  <p className="wdth-125 text-[clamp(30px,3.4vw,44px)] font-black uppercase leading-none text-white">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-[13px] font-semibold text-on-dark-muted">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal locale={locale} content={chrome.ctaBanner} location="machine-park" />
    </>
  );
}
