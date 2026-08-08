'use client';

// Opens the lead modal in 'datasheet' mode. The visitor leaves name, role,
// email, phone and city (captured as a lead via /api/datasheet-request) and
// the datasheet arrives by email as a signed 14-day download link.
import { Download } from 'lucide-react';
import { useLeadModal } from '@/components/LeadGenModal';
import type { Datasheet } from '@/lib/datasheets';

export default function DatasheetDownloadButton({
  sheet,
  className = 'btn btn--primary btn--sm',
}: {
  sheet: Datasheet;
  className?: string;
}) {
  const { open } = useLeadModal();
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        open('datasheet', {
          source: 'pdf_download',
          datasheet: { slug: sheet.slug, title: sheet.title },
        })
      }
    >
      Download <Download size={15} />
    </button>
  );
}
