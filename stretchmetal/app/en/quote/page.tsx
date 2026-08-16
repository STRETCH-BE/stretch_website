// RFQ (quote funnel) — EN. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import RfqScreen from '@/components/screens/rfq-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { rfq } = getContent('en');

export const metadata: Metadata = pageMetadata({
  route: 'rfq',
  locale: 'en',
  title: rfq.metaTitle,
  description: rfq.metaDescription,
});

export default function Page() {
  return <RfqScreen locale="en" />;
}
