// ============================================================================
// SERVICE PAGE TEMPLATE — one component renders all six services in both
// locales; pages pass the typed ServiceContent + locale. Layout: breadcrumbs →
// dark hero → spec table → applications grid → mini order process → FAQ →
// related services → CTA banner. JSON-LD (Service + FAQPage + BreadcrumbList)
// is emitted here so no service page can forget it.
// ============================================================================
import Link from 'next/link';
import Breadcrumbs from '@/components/sections/breadcrumbs';
import CtaFinal from '@/components/sections/cta-final';
import FaqSection from '@/components/sections/faq';
import PageHero from '@/components/sections/page-hero';
import FadeIn from '@/components/ui/fade-in';
import ServiceIcon from '@/components/ui/service-icon';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import type { ServiceContent } from '@/content/types';
import { absoluteUrl, path, type Locale } from '@/lib/i18n-routes';
import { breadcrumbSchema, faqPageSchema, serviceSchema } from '@/lib/schema';

export default function ServicePage({ locale, service }: { locale: Locale; service: ServiceContent }) {
  const { chrome, serviceCards } = getContent(locale);
  const relatedCards = service.related.keys
    .map((key) => serviceCards.find((c) => c.key === key))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const crumbs = [
    { label: chrome.breadcrumbHome, href: path('home', locale) },
    {
      label: chrome.nav.items.find((i) => i.route === 'services')?.label ?? 'Services',
      href: path('services', locale),
    },
    { label: service.name },
  ];

  return (
    <>
      <JsonLd
        data={serviceSchema({
          route: service.route,
          locale,
          name: service.name,
          description: service.metaDescription,
        })}
      />
      <JsonLd data={faqPageSchema(service.faq.items)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          {
            name: chrome.nav.items.find((i) => i.route === 'services')?.label ?? 'Services',
            url: absoluteUrl('services', locale),
          },
          { name: service.name, url: absoluteUrl(service.route, locale) },
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />
      <PageHero eyebrow={service.eyebrow} title={service.title} lead={service.lead} />

      {/* Spec table — the millimetres-and-dates section. */}
      <section className="section">
        <div className="container-sm">
          <FadeIn>
            <h2 className="h2 h2--sm">{service.specs.title}</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="mt-8 max-w-[860px] overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <tbody>
                  {service.specs.rows.map((row) => (
                    <tr key={row.k} className="border-b border-border-2">
                      <th
                        scope="row"
                        className="w-[40%] py-4 pr-6 align-top text-[12.5px] font-bold uppercase tracking-[0.1em] text-text-faint"
                      >
                        {row.k}
                      </th>
                      <td className="py-4 text-[14.5px] font-semibold">{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {service.specs.note ? (
                <p className="mt-4 text-[12.5px] italic text-text-faint">{service.specs.note}</p>
              ) : null}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Applications grid */}
      <section className="section section--surface">
        <div className="container-sm">
          <FadeIn>
            <h2 className="h2 h2--sm">{service.applications.title}</h2>
            <p className="lead mt-5 max-w-[620px] text-text-body">{service.applications.lead}</p>
          </FadeIn>
          <div className="grid-lines mt-10 min-[640px]:grid-cols-2">
            {service.applications.items.map((item, i) => (
              <FadeIn key={item.title} delay={i * 60} className="h-full">
                <div className="flex h-full flex-col bg-white p-7">
                  <span className="tick" aria-hidden />
                  <h3 className="h3 mt-5">{item.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Mini order process */}
      <section className="section">
        <div className="container-sm">
          <FadeIn>
            <h2 className="h2 h2--sm">{service.howToOrder.title}</h2>
          </FadeIn>
          <div className="grid-lines mt-10 min-[860px]:grid-cols-3">
            {service.howToOrder.steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col bg-white p-7">
                  <span className="wdth-125 text-[28px] font-black leading-none text-red">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-[15px] font-extrabold uppercase leading-snug">{step.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-text-muted">{step.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--surface">
        <div className="container-sm">
          <FaqSection title={service.faq.title} items={service.faq.items} />
        </div>
      </section>

      {/* Related services */}
      <section className="section--sm section">
        <div className="container-sm">
          <FadeIn>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-text-faint">
              {service.related.title}
            </h2>
          </FadeIn>
          <div className="grid-lines mt-6 min-[860px]:grid-cols-3">
            {relatedCards.map((card) => (
              <FadeIn key={card.key} className="h-full">
                <Link
                  href={path(card.key, locale)}
                  className="group flex h-full items-center justify-between gap-4 bg-white p-6 transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-4">
                    <ServiceIcon name={card.key} className="text-black" />
                    <span className="text-[14px] font-extrabold uppercase">{card.name}</span>
                  </span>
                  <span className="text-red transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal locale={locale} content={chrome.ctaBanner} location={`service-${service.key}`} />
    </>
  );
}
