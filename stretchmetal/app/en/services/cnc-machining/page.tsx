// Service page (cnc) — EN. All six services render through the shared
// ServicePage template; this file only binds locale + typed content + metadata.
import type { Metadata } from 'next';
import ServicePage from '@/components/service-page';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const service = getContent('en').services.cnc;

export const metadata: Metadata = pageMetadata({
  route: 'cnc',
  locale: 'en',
  title: service.metaTitle,
  description: service.metaDescription,
});

export default function Page() {
  return <ServicePage locale="en" service={service} />;
}
