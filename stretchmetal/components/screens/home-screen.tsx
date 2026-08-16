// ============================================================================
// HOME SCREEN — the full homepage composition, shared by / (PL) and /en. The
// section order is the conversion narrative: hero → ticker → proof (stats) →
// offer (services) → how (process) → capability (machines) → arguments →
// story → work → final CTA.
// ============================================================================
import Hero from '@/components/sections/hero';
import Ticker from '@/components/sections/ticker';
import Stats from '@/components/sections/stats';
import ServicesGrid from '@/components/sections/services-grid';
import Process from '@/components/sections/process';
import MachineParkTeaser from '@/components/sections/machine-park-teaser';
import WhyUs from '@/components/sections/why-us';
import Heritage from '@/components/sections/heritage';
import ProjectsGrid from '@/components/sections/projects-grid';
import CtaFinal from '@/components/sections/cta-final';
import FadeIn from '@/components/ui/fade-in';
import SectionTitle from '@/components/ui/section-title';
import TrackedCta from '@/components/ui/tracked-cta';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { path, type Locale } from '@/lib/i18n-routes';
import { localBusinessSchema, organizationSchema } from '@/lib/schema';

export default function HomeScreen({ locale }: { locale: Locale }) {
  const { home, serviceCards, projects, chrome } = getContent(locale);

  return (
    <>
      <JsonLd data={organizationSchema(locale)} />
      <JsonLd data={localBusinessSchema(locale)} />

      <Hero locale={locale} content={home.hero} />
      <Ticker items={home.ticker} />
      <Stats content={home.stats} />

      {/* Services */}
      <section className="section">
        <div className="container-sm">
          <FadeIn>
            <SectionTitle
              num="02"
              eyebrow={home.services.eyebrow}
              title={home.services.title}
              lead={home.services.lead}
              small
            />
          </FadeIn>
          <div className="mt-10">
            <ServicesGrid locale={locale} cards={serviceCards} linkLabel={home.services.linkLabel} />
          </div>
        </div>
      </section>

      <div className="border-t border-border">
        <Process
          num="03"
          eyebrow={home.process.eyebrow}
          title={home.process.title}
          lead={home.process.lead}
          steps={home.process.steps}
        />
      </div>

      <MachineParkTeaser locale={locale} content={home.machinePark} />
      <WhyUs content={home.whyUs} />
      <Heritage locale={locale} content={home.heritage} />

      {/* Projects teaser — first three cases */}
      <section className="section">
        <div className="container-sm">
          <FadeIn>
            <SectionTitle
              num="07"
              eyebrow={home.projects.eyebrow}
              title={home.projects.title}
              lead={home.projects.lead}
              small
            />
          </FadeIn>
          <div className="mt-10">
            <ProjectsGrid
              entries={projects.entries.slice(0, 3)}
              metaLabels={projects.metaLabels}
              sampleNote={projects.sampleNote}
            />
          </div>
          <FadeIn delay={150}>
            <div className="mt-10">
              <TrackedCta href={path('projects', locale)} cta="projects" location="home-projects" variant="ghost">
                {home.projects.cta}
              </TrackedCta>
            </div>
          </FadeIn>
        </div>
      </section>

      <CtaFinal locale={locale} content={chrome.ctaBanner} location="home" />
    </>
  );
}
