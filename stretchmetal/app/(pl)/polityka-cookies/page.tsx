// Cookie policy — PL. Prose page rendered by the shared LegalScreen.
import type { Metadata } from 'next';
import LegalScreen from '@/components/screens/legal-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const content = getContent('pl').cookies;

export const metadata: Metadata = pageMetadata({
  route: 'cookies',
  locale: 'pl',
  title: content.metaTitle,
  description: content.metaDescription,
});

export default function Page() {
  return <LegalScreen locale="pl" content={content} route="cookies" />;
}
