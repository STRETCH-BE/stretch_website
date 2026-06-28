// Legacy duplicate route. /training has been consolidated into
// /installer-training; this issues a permanent (308) redirect so any existing
// or external links keep working and search engines fold the two together.
import { permanentRedirect } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';

export const dynamic = 'force-static';

export default function Page({ params }: { params: { locale: string } }) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en';
  permanentRedirect(`/${locale}/installer-training`);
}
