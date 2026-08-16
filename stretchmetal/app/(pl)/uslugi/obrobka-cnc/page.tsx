// Service page (cnc) — PL. All six services render through the shared
// ServicePage template; this file only binds locale + typed content + metadata.
import type { Metadata } from 'next';
import ServicePage from '@/components/service-page';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const service = getContent('pl').services.cnc;

export const metadata: Metadata = pageMetadata({
  route: 'cnc',
  locale: 'pl',
  title: service.metaTitle,
  description: service.metaDescription,
});

export default function Page() {
  return <ServicePage locale="pl" service={service} />;
}
