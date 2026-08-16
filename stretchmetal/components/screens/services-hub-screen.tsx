// Services hub — dark intro + the six-card hairline grid + closing CTA.
import Breadcrumbs from '@/components/sections/breadcrumbs';
import CtaFinal from '@/components/sections/cta-final';
import PageHero from '@/components/sections/page-hero';
import ServicesGrid from '@/components/sections/services-grid';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { absoluteUrl, path, type Locale } from '@/lib/i18n-routes';
import { breadcrumbSchema } from '@/lib/schema';

export default function ServicesHubScreen({ locale }: { locale: Locale }) {
  const { servicesHub, home, chrome } = getContent(locale);
  const hubLabel = chrome.nav.items.find((i) => i.route === 'services')?.label ?? 'Services';

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          { name: hubLabel, url: absoluteUrl('services', locale) },
        ])}
      />
      <Breadcrumbs
        crumbs={[{ label: chrome.breadcrumbHome, href: path('home', locale) }, { label: hubLabel }]}
      />
      <PageHero eyebrow={servicesHub.eyebrow} title={servicesHub.title} lead={servicesHub.lead} />
      <section className="section">
        <div className="container-sm">
          <ServicesGrid locale={locale} cards={servicesHub.cards} linkLabel={home.services.linkLabel} />
        </div>
      </section>
      <CtaFinal locale={locale} content={chrome.ctaBanner} location="services-hub" />
    </>
  );
}
