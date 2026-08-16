// About — EN. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import AboutScreen from '@/components/screens/about-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { about } = getContent('en');

export const metadata: Metadata = pageMetadata({
  route: 'about',
  locale: 'en',
  title: about.metaTitle,
  description: about.metaDescription,
});

export default function Page() {
  return <AboutScreen locale="en" />;
}
