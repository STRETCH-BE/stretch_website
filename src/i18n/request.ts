import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale } from './config';

// Loads the message bundle for the active locale. Wired into next.config.mjs
// via createNextIntlPlugin('./src/i18n/request.ts').
export default getRequestConfig(async ({ locale }) => {
  if (!isValidLocale(locale)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
