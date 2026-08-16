// About — PL. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import AboutScreen from '@/components/screens/about-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { about } = getContent('pl');

export const metadata: Metadata = pageMetadata({
  route: 'about',
  locale: 'pl',
  title: about.metaTitle,
  description: about.metaDescription,
});

export default function Page() {
  return <AboutScreen locale="pl" />;
}
