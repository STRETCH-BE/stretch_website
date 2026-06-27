// Shared logic for the five product routes. Each product folder is its own
// route (one-folder-per-product), so this keeps those page files to three lines
// and centralises metadata + JSON-LD (Product, BreadcrumbList, FAQPage).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, brand } from '@/lib/site-config';
import { buildAlternates, buildOgLocales } from '@/lib/seo';
import { getProduct } from '@/lib/products';
import { productSchema, breadcrumbSchema, faqPageSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import SolutionPage from '@/components/sections/SolutionPage';

export function productMetadata(slug: string, localeParam: string): Metadata {
  if (!isValidLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const product = getProduct(slug);
  if (!product) return {};

  const route = `/products/${slug}`;
  const { ogLocale, alternate } = buildOgLocales(locale);
  const ogImg = `${siteUrl}/api/og/${slug}`;

  return {
    title: product.name,
    description: product.summary,
    alternates: buildAlternates(locale, route),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title: `${product.name} | ${brand.name}`,
      description: product.summary,
      url: `${siteUrl}/${locale}${route}`,
      locale: ogLocale,
      alternateLocale: alternate,
      images: [{ url: ogImg, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${brand.name}`,
      description: product.summary,
      images: [ogImg],
    },
  };
}

export function ProductView({ slug, locale: localeParam }: { slug: string; locale: string }) {
  const product = getProduct(slug);
  if (!product) notFound();
  if (isValidLocale(localeParam)) setRequestLocale(localeParam as Locale);
  const locale = (isValidLocale(localeParam) ? localeParam : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'Solutions', url: `${siteUrl}/${locale}/products` },
    { name: product.short, url: `${siteUrl}/${locale}/products/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={productSchema(product, locale)} />
      <JsonLd data={crumbs} />
      <JsonLd data={faqPageSchema(product.faqs)} />
      <SolutionPage product={product} />
    </>
  );
}
