// Final CTA banner — black, display type: „Masz rysunek? Masz wycenę." with
// the primary RFQ button. Shared across the home page and every subpage
// (services, machine park, about, projects) as the closing conversion push.
import FadeIn from '@/components/ui/fade-in';
import TrackedCta from '@/components/ui/tracked-cta';
import { path, type Locale } from '@/lib/i18n-routes';
import type { ChromeContent } from '@/content/types';

export default function CtaFinal({
  locale,
  content,
  location,
}: {
  locale: Locale;
  content: ChromeContent['ctaBanner'];
  location: string;
}) {
  return (
    <section className="section section--dark border-t border-line-dark">
      <div className="container-sm">
        <FadeIn>
          <h2 className="h2">
            {content.title.map((line, i) => (
              <span key={i} className={`block ${line.accent ? 'text-red-bright' : ''}`}>
                {line.text}
              </span>
            ))}
          </h2>
          <p className="lead mt-6 max-w-[520px] text-on-dark-soft">{content.text}</p>
          <div className="mt-9">
            <TrackedCta href={path('rfq', locale)} cta="cta-final" location={location} rfq size="lg">
              {content.cta}
            </TrackedCta>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
