// Privacy policy — EN. Prose page rendered by the shared LegalScreen.
import type { Metadata } from 'next';
import LegalScreen from '@/components/screens/legal-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const content = getContent('en').privacy;

export const metadata: Metadata = pageMetadata({
  route: 'privacy',
  locale: 'en',
  title: content.metaTitle,
  description: content.metaDescription,
});

export default function Page() {
  return <LegalScreen locale="en" content={content} route="privacy" />;
}
