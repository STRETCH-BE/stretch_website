// Legal pages (privacy + cookies) — prose layout in the design system, fed by
// the typed LegalContent structure.
import Breadcrumbs from '@/components/sections/breadcrumbs';
import PageHero from '@/components/sections/page-hero';
import JsonLd from '@/components/seo/json-ld';
import { getContent } from '@/content';
import { absoluteUrl, path, type Locale, type RouteKey } from '@/lib/i18n-routes';
import { breadcrumbSchema } from '@/lib/schema';
import type { LegalContent } from '@/content/types';

export default function LegalScreen({
  locale,
  content,
  route,
}: {
  locale: Locale;
  content: LegalContent;
  route: RouteKey;
}) {
  const { chrome } = getContent(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: chrome.breadcrumbHome, url: absoluteUrl('home', locale) },
          { name: content.title, url: absoluteUrl(route, locale) },
        ])}
      />
      <Breadcrumbs
        crumbs={[{ label: chrome.breadcrumbHome, href: path('home', locale) }, { label: content.title }]}
      />
      <PageHero eyebrow={content.updated} title={[{ text: content.title }]} lead={content.intro} />
      <section className="section">
        <div className="container-sm">
          <div className="prose-legal">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {section.list ? (
                  <ul>
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
