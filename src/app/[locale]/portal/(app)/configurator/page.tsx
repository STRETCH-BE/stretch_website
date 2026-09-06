// CLIENT PORTAL — kit configurator (/portal/configurator).
// Dimensions in, a priced bill of materials out. The price IS the account's
// market tier, so the tool is login-gated and INSTALLERS + ADMINS ONLY
// (hasConfiguratorAccess) — b2c and architect accounts are redirected here AND
// refused by every API route. /portal/* is already noindexed, disallowed in
// robots.txt and absent from the sitemap.
import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { isValidLocale, localeFullCodes, type Locale } from '@/i18n/config';
import { getPortalSession } from '@/lib/portal/auth';
import { hasConfiguratorAccess, configuratorMarket } from '@/lib/portal/types';
import ConfiguratorView from '@/components/portal/ConfiguratorView';

export default async function PortalConfiguratorPage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) return null; // (app) layout already redirects
  if (!hasConfiguratorAccess(session.profile)) redirect({ href: '/portal', locale });

  const canChooseMarket = session.profile.role === 'admin' || session.profile.allMarkets;

  return (
    <ConfiguratorView
      demo={session.demo}
      market={configuratorMarket(session.profile)}
      canChooseMarket={canChooseMarket}
      formatLocale={localeFullCodes[locale] ?? 'en'}
      accountEmail={session.profile.email}
      company={session.profile.company}
    />
  );
}
