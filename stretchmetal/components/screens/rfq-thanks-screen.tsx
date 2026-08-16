// RFQ thank-you — expectation setting after a successful submission: what
// happens next, the direct phone number, and back-links into the site.
import PageHero from '@/components/sections/page-hero';
import FadeIn from '@/components/ui/fade-in';
import Button from '@/components/ui/button';
import { getContent } from '@/content';
import { contact } from '@/lib/site-config';
import { path, type Locale } from '@/lib/i18n-routes';

export default function RfqThanksScreen({ locale }: { locale: Locale }) {
  const { rfq } = getContent(locale);
  const t = rfq.thanks;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} lead={t.text} />
      <section className="section">
        <div className="container-sm">
          <FadeIn>
            <h2 className="h2 h2--sm">{t.nextTitle}</h2>
          </FadeIn>
          <div className="grid-lines mt-10 min-[860px]:grid-cols-3">
            {t.next.map((step, i) => (
              <FadeIn key={i} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col bg-white p-7">
                  <span className="wdth-125 text-[28px] font-black leading-none text-red">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-4 text-[14px] leading-relaxed text-text-muted">{step}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button href={path('home', locale)} variant="ghost">
                {t.backHome}
              </Button>
              <Button href={path('services', locale)} variant="ghost">
                {t.seeServices}
              </Button>
              <a href={contact.phoneHref} className="lnk text-[16px] font-bold">
                {contact.phone}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
