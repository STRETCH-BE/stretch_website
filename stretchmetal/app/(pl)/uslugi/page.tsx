// Services hub — PL. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import ServicesHubScreen from '@/components/screens/services-hub-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { servicesHub } = getContent('pl');

export const metadata: Metadata = pageMetadata({
  route: 'services',
  locale: 'pl',
  title: servicesHub.metaTitle,
  description: servicesHub.metaDescription,
});

export default function Page() {
  return <ServicesHubScreen locale="pl" />;
}
