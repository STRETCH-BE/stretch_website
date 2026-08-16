// Contact — EN. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import ContactScreen from '@/components/screens/contact-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { contact } = getContent('en');

export const metadata: Metadata = pageMetadata({
  route: 'contact',
  locale: 'en',
  title: contact.metaTitle,
  description: contact.metaDescription,
});

export default function Page() {
  return <ContactScreen locale="en" />;
}
