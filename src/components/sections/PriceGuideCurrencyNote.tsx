// The price guide's published ranges are EUR (the settlement currency). On
// non-euro markets that settle in EUR (dk/se/no/is/uk/us) this card shows the
// same buckets with a "≈ local" indication at the hand-maintained ECB rate —
// the same treatment as the estimator and the UK GBP indication. It renders
// NOTHING on euro markets and on Poland, whose guide is written in PLN.
// Figures come from src/lib/indicative-prices.ts only (single source).
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { asOf, displayPolicyFor, formatIndicationRange, formatRangePerM2, hasIndication } from '@/lib/currency';
import { estimatorBuckets, bucketKeys } from '@/lib/indicative-prices';

export default function PriceGuideCurrencyNote({ locale }: { locale: Locale }) {
  const t = useTranslations('currency');
  const tp = useTranslations('priceCalculatorPage');
  if (!hasIndication(locale)) return null;
  const policy = displayPolicyFor(locale);
  const buckets = estimatorBuckets.EUR;
  return (
    <aside
      aria-label={t('guideNoteTitle', { currency: policy.currency })}
      style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: 'clamp(18px,2.4vw,26px)' }}
    >
      <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>
        {t('guideNoteTitle', { currency: policy.currency })}
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)', margin: '0 0 12px' }}>
        {t('guideNoteBody', { currency: policy.currency, asOf })}
      </p>
      <dl style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '6px 18px', margin: 0, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
        {bucketKeys.map((k) => (
          <div key={k} style={{ display: 'contents' }}>
            <dt style={{ color: 'var(--text-body)' }}>{tp(`types.${k}`)}</dt>
            <dd style={{ margin: 0, fontWeight: 700 }}>
              {formatRangePerM2(buckets[k].low, buckets[k].high, 'EUR', locale)}{' '}
              <span style={{ fontWeight: 600, color: 'var(--text-faint-2)' }}>{formatIndicationRange(buckets[k].low, buckets[k].high, locale)}/m²</span>
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
