// Footer — dark, hairline-separated columns: services, company, contact,
// group sites; legal row with cookie-settings trigger and language switch.
// Server component; the cookie-settings button is the one client island.
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import CookieSettingsButton from '@/components/sections/cookie-settings-button';
import { contact, groupSites } from '@/lib/site-config';
import { path, routes, type Locale } from '@/lib/i18n-routes';
import type { ChromeContent } from '@/content/types';

export default function Footer({ locale, chrome }: { locale: Locale; chrome: ChromeContent }) {
  const colTitle = 'text-[12px] font-bold uppercase tracking-[0.18em] text-on-dark-muted';
  const colLink = 'lnk text-[13.5px] font-semibold text-on-dark-soft';

  return (
    <footer className="bg-black text-white">
      <div className="container-sm section--sm">
        {/* Hairline column grid — the signature texture on dark. */}
        <div className="grid-lines grid-lines--dark min-[860px]:grid-cols-4">
          <div className="bg-black p-7">
            <Logo locale={locale} />
            <p className="mt-5 max-w-[280px] text-[13px] leading-relaxed text-on-dark-muted">
              {chrome.footer.groupBlurb}
            </p>
          </div>

          <nav aria-label={chrome.footer.services.title} className="bg-black p-7">
            <p className={colTitle}>{chrome.footer.services.title}</p>
            <ul className="mt-4 flex flex-col gap-[10px]">
              {chrome.footer.services.items.map((item) => (
                <li key={item.route}>
                  <Link href={path(item.route, locale)} className={colLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={chrome.footer.company.title} className="bg-black p-7">
            <p className={colTitle}>{chrome.footer.company.title}</p>
            <ul className="mt-4 flex flex-col gap-[10px]">
              {chrome.footer.company.items.map((item) => (
                <li key={item.route}>
                  <Link href={path(item.route, locale)} className={colLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bg-black p-7">
            <p className={colTitle}>{chrome.footer.contactTitle}</p>
            <address className="mt-4 flex flex-col gap-[10px] not-italic text-[13.5px] text-on-dark-soft">
              <span>
                {contact.address.street}
                <br />
                {contact.address.postalCode} {contact.address.city}
                <br />
                {contact.address.countryName[locale]}
              </span>
              <a href={contact.phoneHref} className="lnk font-semibold">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="lnk font-semibold">
                {contact.email}
              </a>
              <span className="text-on-dark-muted">
                {chrome.footer.hoursLabel}: {contact.hoursLabel[locale]}
              </span>
            </address>

            <p className={`mt-6 ${colTitle}`}>{chrome.footer.groupTitle}</p>
            <ul className="mt-3 flex flex-col gap-[10px]">
              {groupSites.map((site) => (
                <li key={site.url}>
                  <a href={site.url} className={colLink} rel="noopener">
                    {site.name}
                    <span className="ml-2 text-[12px] text-on-dark-muted">{site.blurb[locale]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-8 flex flex-col gap-4 border-t border-line-dark pt-6 text-[12.5px] text-on-dark-muted min-[860px]:flex-row min-[860px]:items-center min-[860px]:justify-between">
          <p>{chrome.footer.legalLine}</p>
          <div className="flex flex-wrap items-center gap-5">
            {chrome.footer.legal.map((item) => (
              <Link key={item.route} href={path(item.route, locale)} className="lnk">
                {item.label}
              </Link>
            ))}
            <CookieSettingsButton locale={locale} />
            <Link href={routes.home[locale === 'pl' ? 'en' : 'pl']} className="lnk font-bold uppercase">
              {locale === 'pl' ? 'EN' : 'PL'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
