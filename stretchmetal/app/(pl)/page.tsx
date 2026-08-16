// Homepage — PL. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import HomeScreen from '@/components/screens/home-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { home } = getContent('pl');

export const metadata: Metadata = pageMetadata({
  route: 'home',
  locale: 'pl',
  title: home.metaTitle,
  description: home.metaDescription,
});

export default function Page() {
  return <HomeScreen locale="pl" />;
}
