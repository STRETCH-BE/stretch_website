// Shared logic for the application routes: builds page metadata and renders the
// ApplicationPage with BreadcrumbList JSON-LD. notFound() for unknown slugs.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, brand } from '@/lib/site-config';
import { buildAlternates } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import { getApplication } from '@/lib/applications';
import ApplicationPage from '@/components/sections/ApplicationPage';

export function applicationMetadata(slug: string, locale: string): Metadata {
  if (!isValidLocale(locale)) return {};
  const app = getApplication(slug);
  if (!app) return {};
  const title = `${app.name} | ${brand.name}`;
  const url = `${siteUrl}/${locale}/applications/${slug}`;
  const ogImg = `${siteUrl}/api/og`;
  return {
    title: { absolute: title },
    description: app.metaDescription,
    alternates: buildAlternates(locale as Locale, `/applications/${slug}`),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title,
      description: app.metaDescription,
      url,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title, description: app.metaDescription, images: [ogImg] },
  };
}

export function ApplicationView({ slug, locale }: { slug: string; locale: string }) {
  if (isValidLocale(locale)) setRequestLocale(locale as Locale);
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale;
  const app = getApplication(slug);
  if (!app) notFound();

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${loc}` },
    { name: 'Applications', url: `${siteUrl}/${loc}/inspiration` },
    { name: app.shortName, url: `${siteUrl}/${loc}/applications/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <ApplicationPage app={app} />
    </>
  );
}
