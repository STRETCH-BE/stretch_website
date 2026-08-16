// RFQ thank-you (noindex: funnel end, no SEO value) — EN. Thin route wrapper: metadata from the typed
// content file + the shared screen component (see components/screens/).
import type { Metadata } from 'next';
import RfqThanksScreen from '@/components/screens/rfq-thanks-screen';
import { getContent } from '@/content';
import { pageMetadata } from '@/lib/seo';

const { rfq } = getContent('en');

export const metadata: Metadata = pageMetadata({
  route: 'rfqThanks',
  locale: 'en',
  title: rfq.thanks.metaTitle,
  description: rfq.metaDescription,
  noindex: true,
});

export default function Page() {
  return <RfqThanksScreen locale="en" />;
}
