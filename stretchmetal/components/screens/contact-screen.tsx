// Contact — details grid (address, phone, e-mail, hours, company data), a
// static map placeholder with an external Google Maps link, the mini contact
// form and a pointer to the RFQ funnel for anyone with files.
import Breadcrumbs from '@/components/sections/breadcrumbs';
import PageHero from '@/components/sections/page-hero';
import ContactForm from '@/components/rfq/contact-form';
import FadeIn from '@/components/ui/fade-in';
import Placeholder from '@/components/ui/placeholder';
import TrackedCta from '@/components/ui/tracked-cta';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { contact } from '@/lib/site-config';
import { absoluteUrl, path, type Locale } from '@/lib/i18n-routes';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema';

export default function ContactScreen({ locale }: { locale: Locale }) {
  const { contact: t, chrome } = getContent(locale);
  const label = chrome.nav.items.find((i) => i.route === 'contact')?.label ?? 'Contact';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${contact.geo.lat},${contact.geo.lng}`;

  return (
    <>
      <JsonLd data={localBusinessSchema(locale)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          { name: label, url: absoluteUrl('contact', locale) },
        ])}
      />
      <Breadcrumbs crumbs={[{ label: chrome.breadcrumbHome, href: path('home', locale) }, { label }]} />
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      {/* Details + map */}
      <section className="section">
        <div className="container-sm grid gap-12 min-[1000px]:grid-cols-2">
          <FadeIn>
            <div className="grid-lines min-[640px]:grid-cols-2">
              <div className="bg-white p-6">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-text-faint">
                  {t.details.addressTitle}
                </h2>
                <address className="mt-3 text-[14.5px] font-semibold not-italic leading-relaxed">
                  {contact.address.street}
                  <br />
                  {contact.address.postalCode} {contact.address.city}
                  <br />
                  {contact.address.countryName[locale]}
                </address>
              </div>
              <div className="bg-white p-6">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-text-faint">
                  {t.details.phoneTitle} / {t.details.emailTitle}
                </h2>
                <p className="mt-3 flex flex-col gap-1 text-[14.5px] font-semibold">
                  <a href={contact.phoneHref} className="lnk">
                    {contact.phone}
                  </a>
                  <a href={`mailto:${contact.email}`} className="lnk">
                    {contact.email}
                  </a>
                </p>
              </div>
              <div className="bg-white p-6">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-text-faint">
                  {t.details.hoursTitle}
                </h2>
                <p className="mt-3 text-[14.5px] font-semibold">{contact.hoursLabel[locale]}</p>
              </div>
              <div className="bg-white p-6">
                <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-text-faint">
                  {t.details.companyTitle}
                </h2>
                <p className="mt-3 text-[13px] leading-relaxed text-text-muted">
                  {t.details.companyLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="flex h-full min-h-[300px] flex-col">
              <Placeholder label={t.mapLabel} className="grow" />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost mt-4 self-start"
              >
                {t.mapCta}
                <span className="btn__arrow" aria-hidden>
                  →
                </span>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mini form + RFQ pointer */}
      <section className="section section--surface">
        <div className="container-sm grid gap-12 min-[1000px]:grid-cols-[1fr_340px]">
          <FadeIn className="relative">
            <h2 className="h2 h2--sm">{t.form.title}</h2>
            <p className="mt-4 max-w-[560px] text-[14px] text-text-muted">{t.form.lead}</p>
            <div className="mt-8 max-w-[640px]">
              <ContactForm locale={locale} content={t.form} />
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="border-2 border-black bg-white p-7">
              <p className="text-[15px] font-bold">{t.rfqHint.text}</p>
              <div className="mt-5">
                <TrackedCta href={path('rfq', locale)} cta="contact-rfq-hint" location="contact" rfq>
                  {t.rfqHint.cta}
                </TrackedCta>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
