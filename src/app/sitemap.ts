// Dynamic sitemap. One entry per locale × route (static routes + products +
// blog posts), each carrying hreflang alternates incl. x-default. Generated at
// build time — there is intentionally NO static public/sitemap.xml.
import type { MetadataRoute } from 'next';
import { locales, defaultLocale, localeFullCodes } from '@/i18n/config';
import { siteUrl } from '@/lib/site-config';
import { staticRoutes } from '@/lib/site-config';
import { productSlugs } from '@/lib/products';
import { applicationSlugs } from '@/lib/applications';
import { blogSlugs, blogPosts } from '@/lib/content';

function alternatesFor(route: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeFullCodes[l] ?? l] = `${siteUrl}/${l}${route === '/' ? '' : route}`;
  languages['x-default'] = `${siteUrl}/${defaultLocale}${route === '/' ? '' : route}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const priorityFor = (route: string): number => {
    if (route === '/') return 1;
    if (route === '/products' || route.startsWith('/products/')) return 0.9;
    if (['/contact', '/partners', '/installer-training'].includes(route)) return 0.8;
    if (route === '/inspiration' || route === '/samples' || route === '/blog') return 0.7;
    if (route.startsWith('/blog/')) return 0.6;
    return 0.4;
  };
  const changeFreqFor = (route: string): MetadataRoute.Sitemap[number]['changeFrequency'] => {
    if (route === '/' || route === '/inspiration' || route === '/blog') return 'weekly';
    if (route === '/privacy' || route === '/terms') return 'yearly';
    return 'monthly';
  };

  const productRoutes = productSlugs.map((s) => `/products/${s}`);
  const applicationRoutes = applicationSlugs.map((s) => `/applications/${s}`);
  const blogRoutes = blogSlugs.map((s) => `/blog/${s}`);
  const allRoutes = [...staticRoutes, ...productRoutes, ...applicationRoutes, ...blogRoutes];

  const lastModFor = (route: string): Date => {
    if (route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '');
      const post = blogPosts.find((p) => p.slug === slug);
      if (post) return new Date(post.dateModified + 'T00:00:00Z');
    }
    return now;
  };

  const entries: MetadataRoute.Sitemap = [];
  for (const route of allRoutes) {
    for (const l of locales) {
      entries.push({
        url: `${siteUrl}/${l}${route === '/' ? '' : route}`,
        lastModified: lastModFor(route),
        changeFrequency: changeFreqFor(route),
        priority: priorityFor(route),
        alternates: { languages: alternatesFor(route) },
      });
    }
  }
  return entries;
}
