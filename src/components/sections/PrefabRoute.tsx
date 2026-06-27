// Shared logic for the prefab routes: page metadata + render PrefabPage with
// BreadcrumbList JSON-LD. notFound() for unknown slugs.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, brand } from '@/lib/site-config';
import { buildAlternates } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import { prefabPages } from '@/lib/prefab';
import PrefabPage from '@/components/sections/PrefabPage';

export function prefabMetadata(slug: string, locale: string): Metadata {
  if (!isValidLocale(locale)) return {};
  const data = prefabPages[slug];
  if (!data) return {};
  const title = `${data.name} | ${brand.name}`;
  const url = `${siteUrl}/${locale}/products/${slug}`;
  const ogImg = `${siteUrl}/api/og`;
  return {
    title: { absolute: title },
    description: data.metaDescription,
    alternates: buildAlternates(locale as Locale, `/products/${slug}`),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title,
      description: data.metaDescription,
      url,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title, description: data.metaDescription, images: [ogImg] },
  };
}

export function PrefabView({ slug, locale }: { slug: string; locale: string }) {
  if (isValidLocale(locale)) setRequestLocale(locale as Locale);
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale;
  const data = prefabPages[slug];
  if (!data) notFound();

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${loc}` },
    { name: 'Solutions', url: `${siteUrl}/${loc}/products` },
    { name: data.name, url: `${siteUrl}/${loc}/products/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <PrefabPage data={data} />
    </>
  );
}
