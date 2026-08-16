// ============================================================================
// RFQ SCREEN — the quote funnel page: dark hero, the form beside the trust
// rail, then the mini process, quoting FAQ and the phone/e-mail strip.
// ============================================================================
import Breadcrumbs from '@/components/sections/breadcrumbs';
import FaqSection from '@/components/sections/faq';
import PageHero from '@/components/sections/page-hero';
import RfqForm from '@/components/rfq/rfq-form';
import FadeIn from '@/components/ui/fade-in';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { contact } from '@/lib/site-config';
import { absoluteUrl, path, type Locale } from '@/lib/i18n-routes';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schema';

export default function RfqScreen({ locale }: { locale: Locale }) {
  const { rfq, chrome } = getContent(locale);
  const label = chrome.footer.company.items.find((i) => i.route === 'rfq')?.label ?? 'RFQ';

  return (
    <>
      <JsonLd data={faqPageSchema(rfq.faq.items)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          { name: label, url: absoluteUrl('rfq', locale) },
        ])}
      />
      <Breadcrumbs crumbs={[{ label: chrome.breadcrumbHome, href: path('home', locale) }, { label }]} />
      <PageHero eyebrow={rfq.eyebrow} title={rfq.title} lead={rfq.lead} />

      {/* Form + trust rail */}
      <section className="section">
        <div className="container-sm grid gap-12 min-[1000px]:grid-cols-[1fr_340px]">
          <FadeIn className="relative">
            <RfqForm locale={locale} content={rfq.form} />
          </FadeIn>
          <FadeIn delay={120}>
            <aside className="grid-lines" aria-label={rfq.trust.title}>
              <div className="bg-white p-6">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.16em] text-text-faint">
                  {rfq.trust.title}
                </h2>
              </div>
              {rfq.trust.items.map((item) => (
                <div key={item.title} className="bg-white p-6">
                  <span className="tick" aria-hidden />
                  <h3 className="mt-4 text-[14px] font-extrabold uppercase">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{item.text}</p>
                </div>
              ))}
            </aside>
          </FadeIn>
        </div>
      </section>

      {/* Mini process */}
      <section className="section section--surface">
        <div className="container-sm">
          <FadeIn>
            <h2 className="h2 h2--sm">{rfq.process.title}</h2>
          </FadeIn>
          <div className="grid-lines mt-10 min-[860px]:grid-cols-3">
            {rfq.process.steps.map((step, i) => (
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
      <section className="section">
        <div className="container-sm">
          <FaqSection title={rfq.faq.title} items={rfq.faq.items} />
        </div>
      </section>

      {/* Contact strip */}
      <section className="section--sm section--dark">
        <div className="container-sm flex flex-col gap-6 min-[860px]:flex-row min-[860px]:items-center min-[860px]:justify-between">
          <FadeIn>
            <h2 className="h2 h2--sm">{rfq.contactStrip.title}</h2>
            <p className="mt-3 max-w-[440px] text-[14px] text-on-dark-soft">{rfq.contactStrip.text}</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="flex flex-col gap-2 text-[17px] font-bold">
              <a href={contact.phoneHref} className="lnk">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="lnk">
                {contact.email}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
