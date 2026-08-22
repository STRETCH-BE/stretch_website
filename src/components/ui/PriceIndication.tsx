// EUR amount first and dominant; the £ figure smaller, lighter and always
// marked as an indication (policy: settlement is EUR-only — see currency.ts).
import { formatEur, formatGbpIndication, asOf } from '@/lib/currency';

export default function PriceIndication({ eur }: { eur: number }) {
  const note = `Indication only — all payments in EUR. ECB reference rate of ${asOf}.`;
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10, fontVariantNumeric: 'tabular-nums' }}
      aria-label={`${formatEur(eur)} — indication only, all payments in EUR`}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6em', letterSpacing: '-.02em' }}>
        {formatEur(eur)}
      </span>
      <span title={note} style={{ fontSize: '.95em', color: 'var(--text-faint-2)', fontWeight: 600 }}>
        {formatGbpIndication(eur)}
      </span>
    </span>
  );
}
