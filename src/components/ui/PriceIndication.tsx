// EUR amount first and dominant; on non-euro markets that settle in EUR the
// local figure renders smaller, lighter and always marked "≈" (policy:
// settlement is EUR-only — see src/lib/currency.ts). Euro markets and Poland
// (PLN settlement) show the EUR amount alone.
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { asOf, displayPolicyFor, formatEur, formatIndication } from '@/lib/currency';

export default function PriceIndication({ eur }: { eur: number }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('currency');
  const policy = displayPolicyFor(locale);
  const indication = formatIndication(eur, locale, 2);
  const note = indication ? t('indicationNote', { currency: policy.currency, asOf }) : undefined;
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10, fontVariantNumeric: 'tabular-nums' }}
      aria-label={t('indicationAria', { eur: formatEur(eur) })}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6em', letterSpacing: '-.02em' }}>
        {formatEur(eur)}
      </span>
      {indication && (
        <span title={note} style={{ fontSize: '.95em', color: 'var(--text-faint-2)', fontWeight: 600 }}>
          {indication}
        </span>
      )}
    </span>
  );
}
