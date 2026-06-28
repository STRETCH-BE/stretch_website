// Shared logic for /inspiration/[slug] project detail pages.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, brand } from '@/lib/site-config';
import { buildAlternates } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import { getProjectBySlug, projectSlugs } from '@/lib/content';
import ProjectPage from '@/components/sections/ProjectPage';

export function projectParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export function projectMetadata(slug: string, locale: string): Metadata {
  if (!isValidLocale(locale)) return {};
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const title = `${project.title} — ${project.meta} | ${brand.name}`;
  const description = project.summary ?? `${project.title} — a STRETCH ceiling project. ${project.meta}.`;
  const route = `/inspiration/${slug}`;
  const ogImg = `${siteUrl}/api/og`;
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale as Locale, route),
    openGraph: {
      type: 'article',
      siteName: brand.name,
      title,
      description,
      url: `${siteUrl}/${locale}${route}`,
      images: [{ url: ogImg, width: 1200, height: 630, alt: project.title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImg] },
  };
}

export function ProjectView({ slug, locale }: { slug: string; locale: string }) {
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  if (isValidLocale(locale)) setRequestLocale(locale as Locale);
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${loc}` },
    { name: 'Inspiration', url: `${siteUrl}/${loc}/inspiration` },
    { name: project.title, url: `${siteUrl}/${loc}/inspiration/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <ProjectPage project={project} />
    </>
  );
}
