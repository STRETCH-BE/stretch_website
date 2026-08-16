// Sitemap — generated from the typed route map: every route × both locales,
// each entry carrying its hreflang alternates (+ x-default → PL). Adding a
// page to lib/i18n-routes.ts adds it here automatically. The thank-you pages
// are excluded (noindex funnel ends).
import type { MetadataRoute } from 'next';
import { absoluteUrl, routes, type RouteKey } from '@/lib/i18n-routes';

const EXCLUDED: RouteKey[] = ['rfqThanks'];

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = (Object.keys(routes) as RouteKey[]).filter((k) => !EXCLUDED.includes(k));
  const entries: MetadataRoute.Sitemap = [];

  for (const key of keys) {
    const alternates = {
      languages: {
        'pl-PL': absoluteUrl(key, 'pl'),
        en: absoluteUrl(key, 'en'),
        'x-default': absoluteUrl(key, 'pl'),
      },
    };
    const priority = key === 'home' ? 1 : key === 'rfq' ? 0.9 : 0.7;
    entries.push(
      { url: absoluteUrl(key, 'pl'), changeFrequency: 'monthly', priority, alternates },
      { url: absoluteUrl(key, 'en'), changeFrequency: 'monthly', priority, alternates },
    );
  }
  return entries;
}
