// Shared logic for the technical hub route. Generates all membrane×topic pages,
// supplies per-page metadata + BreadcrumbList (and FAQPage on the faq topic).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, brand } from '@/lib/site-config';
import { buildAlternates } from '@/lib/seo';
import { breadcrumbSchema, faqPageSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import { getProduct } from '@/lib/products';
import {
  techMembranes,
  techTopics,
  techTopicKeys,
  isTechMembrane,
  isTechTopic,
  type TechMembraneKey,
  type TechTopicKey,
} from '@/lib/technical';
import TechnicalPage from '@/components/sections/TechnicalPage';

export function technicalParams() {
  const out: { membrane: string; topic: string }[] = [];
  for (const membrane of Object.keys(techMembranes)) {
    for (const topic of techTopicKeys) out.push({ membrane, topic });
  }
  return out;
}

function topicDescription(label: string, topic: TechTopicKey): string {
  switch (topic) {
    case 'datasheet':
      return `Technical datasheet for the ${label} — specifications, classifications and downloads.`;
    case 'colours':
      return `Colour and finish range for the ${label}, with RAL references and sample requests.`;
    case 'fire-safety':
      return `Reaction-to-fire classification for the ${label} — B-s1,d0 and A2 options to EN 13501-1.`;
    case 'installation':
      return `Step-by-step installation guide for the ${label}.`;
    case 'specification':
      return `Copy-ready specification (bestektekst) clause for the ${label}, for tenders and dossiers.`;
    case 'faq':
      return `Frequently asked questions about the ${label}.`;
  }
}

export function technicalMetadata(membrane: string, topic: string, locale: string): Metadata {
  if (!isValidLocale(locale) || !isTechMembrane(membrane) || !isTechTopic(topic)) return {};
  const m = techMembranes[membrane];
  const topicMeta = techTopics.find((t) => t.key === topic)!;
  const title = `${topicMeta.label} — ${m.label} | ${brand.name}`;
  const description = topicDescription(m.label, topic);
  const route = `/technical/${membrane}/${topic}`;
  const ogImg = `${siteUrl}/api/og`;
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale as Locale, route),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title,
      description,
      url: `${siteUrl}/${locale}${route}`,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImg] },
  };
}

export function TechnicalView({ membrane, topic, locale }: { membrane: string; topic: string; locale: string }) {
  if (!isTechMembrane(membrane) || !isTechTopic(topic)) notFound();
  if (isValidLocale(locale)) setRequestLocale(locale as Locale);
  const loc = (isValidLocale(locale) ? locale : 'en') as Locale;

  const mKey = membrane as TechMembraneKey;
  const tKey = topic as TechTopicKey;
  const m = techMembranes[mKey];
  const topicMeta = techTopics.find((t) => t.key === tKey)!;
  const product = getProduct(m.productSlug);

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${loc}` },
    { name: m.short, url: `${siteUrl}/${loc}/technical/${mKey}/datasheet` },
    { name: topicMeta.label, url: `${siteUrl}/${loc}/technical/${mKey}/${tKey}` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      {tKey === 'faq' && product && <JsonLd data={faqPageSchema(product.faqs)} />}
      <TechnicalPage membrane={mKey} topic={tKey} />
    </>
  );
}
