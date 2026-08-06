// MATERIALS — shared layout: mounts the inquiry-list context + floating bar
// around the catalogue pages, so items collected on one group page survive
// navigating to another.
import type { ReactNode } from 'react';
import { InquiryProvider, InquiryBar } from '@/components/materials/Inquiry';

export default function MaterialsLayout({ children }: { children: ReactNode }) {
  return (
    <InquiryProvider>
      {children}
      <InquiryBar />
    </InquiryProvider>
  );
}
