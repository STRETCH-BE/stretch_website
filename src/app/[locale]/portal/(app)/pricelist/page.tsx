// CLIENT PORTAL — pricelist (/portal/pricelist).
// Server component: loads exactly the rows this account may see (Postgres RLS
// in Supabase mode), then hands off to the interactive client view. Layout and
// interaction follow Michael's pricelist mockup, restyled to the site tokens.
import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { isValidLocale, localeFullCodes, type Locale } from '@/i18n/config';
import { getPortalSession } from '@/lib/portal/auth';
import { hasTradeAccess } from '@/lib/portal/types';
import { getPricebook } from '@/lib/portal/data';
import PricelistView from '@/components/portal/PricelistView';

export default async function PortalPricelistPage({ params }: { params: { locale: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) return null; // (app) layout already redirects
  if (!hasTradeAccess(session.profile)) redirect({ href: '/portal', locale }); // trade accounts only

  const { rows, meta } = await getPricebook(session);

  // With the portal on one canonical host the viewing locale is always 'en',
  // so the PLN default must come from the ACCOUNT (signup country). Accounts
  // that predate the country column fall back to the locale heuristic.
  const country = (session.profile.country ?? '').toUpperCase();
  const preferPln = country ? country === 'PL' : locale === 'pl';

  return (
    <PricelistView
      rows={rows}
      meta={meta}
      formatLocale={localeFullCodes[locale] ?? 'en'}
      defaultCurrency={preferPln ? 'PLN' : 'EUR'}
      accountCountry={session.profile.country ?? null}
    />
  );
}
