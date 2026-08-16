// Machine park — EN. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import MachineParkScreen from '@/components/screens/machine-park-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { machinePark } = getContent('en');

export const metadata: Metadata = pageMetadata({
  route: 'machinePark',
  locale: 'en',
  title: machinePark.metaTitle,
  description: machinePark.metaDescription,
});

export default function Page() {
  return <MachineParkScreen locale="en" />;
}
