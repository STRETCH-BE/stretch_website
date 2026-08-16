// Projects — the full case grid from content/projects.ts. Sample entries are
// visibly marked until real photographed cases replace them.
import Breadcrumbs from '@/components/sections/breadcrumbs';
import CtaFinal from '@/components/sections/cta-final';
import PageHero from '@/components/sections/page-hero';
import ProjectsGrid from '@/components/sections/projects-grid';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { absoluteUrl, path, type Locale } from '@/lib/i18n-routes';
import { breadcrumbSchema } from '@/lib/schema';

export default function ProjectsScreen({ locale }: { locale: Locale }) {
  const { projects, chrome } = getContent(locale);
  const label = chrome.nav.items.find((i) => i.route === 'projects')?.label ?? 'Projects';

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          { name: label, url: absoluteUrl('projects', locale) },
        ])}
      />
      <Breadcrumbs crumbs={[{ label: chrome.breadcrumbHome, href: path('home', locale) }, { label }]} />
      <PageHero eyebrow={projects.eyebrow} title={projects.title} lead={projects.lead} />
      <section className="section">
        <div className="container-sm">
          <ProjectsGrid
            entries={projects.entries}
            metaLabels={projects.metaLabels}
            sampleNote={projects.sampleNote}
          />
        </div>
      </section>
      <CtaFinal locale={locale} content={chrome.ctaBanner} location="projects" />
    </>
  );
}
