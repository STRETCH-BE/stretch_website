'use client';

// Public price-estimate step ("kosten rechner" / "kalkulator" / "prijs
// berekenen" queries): m² × ceiling type → the PUBLISHED indicative range,
// then straight into the quote modal. The buckets come from
// src/lib/indicative-prices.ts — the ONE public price source that also feeds
// the Product JSON-LD and mirrors the price guide (blog spanplafond-prijs);
// this page can never show a number the guide does not publish. Nothing here
// reads trade pricing.
//
// CURRENCY (per-market audit 2 Sep 2026, defect 4): the dominant amount is
// the SETTLEMENT currency — EUR everywhere, PLN on stretch-sufit.pl (its own
// published PLN buckets, not a conversion). Non-euro markets that settle in
// EUR (dk/se/no/is/uk/us) get a local "≈" indication beside the euro figure
// at the hand-maintained ECB rate in src/lib/currency.ts — the same treatment
// the UK GBP indication had since 22 Aug 2026.
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { ModalButton } from '@/components/ui/ModalButton';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';
import { estimatorBuckets, bucketKeys, type BucketKey } from '@/lib/indicative-prices';
import {
  asOf,
  displayPolicyFor,
  formatIndicationRange,
  formatMoney,
  formatRangePerM2,
  settlementCurrencyFor,
} from '@/lib/currency';

const MIN_AREA = 1;
const MAX_AREA = 1000;

function clampArea(n: number): number {
  return Math.min(Math.max(Number.isFinite(n) ? n : 0, MIN_AREA), MAX_AREA);
}

export default function PriceEstimator({ guideHref }: { guideHref: string }) {
  const t = useTranslations('priceCalculatorPage');
  const tc = useTranslations('currency');
  const locale = useLocale() as Locale;
  const [area, setArea] = useState(20);
  const [bucket, setBucket] = useState<BucketKey>('basic');

  // Entry points elsewhere (the German homepage estimator, city pages) hand
  // over ?area=&type=. Read on mount from window so the page stays fully
  // static (useSearchParams would force a client-side bail-out).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = Number(q.get('area'));
    if (Number.isFinite(a) && a > 0) setArea(Math.round(clampArea(a)));
    const ty = q.get('type');
    if (ty && (bucketKeys as readonly string[]).includes(ty)) setBucket(ty as BucketKey);
  }, []);

  const settlement = settlementCurrencyFor(locale);
  const policy = displayPolicyFor(locale);
  const buckets = useMemo(() => estimatorBuckets[settlement], [settlement]);
  const b = buckets[bucket];
  const safeArea = clampArea(area);
  const lowAmount = safeArea * b.low;
  const highAmount = safeArea * b.high;
  const primary = `${formatMoney(lowAmount, settlement, locale)} – ${formatMoney(highAmount, settlement, locale)}`;
  // Only EUR-settling non-euro markets get the "≈ local" line; Poland's PLN
  // figure IS the primary amount and never an approximation.
  const indication = settlement === 'EUR' ? formatIndicationRange(lowAmount, highAmount, locale) : null;

  return (
    <div style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(24px,3vw,40px)', maxWidth: 720 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
        <label style={{ display: 'block' }}>
          <span className="field-label">{t('areaLabel')}</span>
          <input
            type="number"
            className="field"
            min={MIN_AREA}
            max={MAX_AREA}
            value={Number.isFinite(area) ? area : ''}
            onChange={(e) => setArea(e.target.valueAsNumber)}
            aria-label={t('areaLabel')}
          />
        </label>
        <label style={{ display: 'block' }}>
          <span className="field-label">{t('typeLabel')}</span>
          <select className="field" value={bucket} onChange={(e) => setBucket(e.target.value as BucketKey)}>
            {bucketKeys.map((k) => (
              <option key={k} value={k}>
                {t(`types.${k}`)} · {formatRangePerM2(buckets[k].low, buckets[k].high, settlement, locale)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '18px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted-2)', marginBottom: 6 }}>
          {t('estimateLabel', { area: safeArea })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 16px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px,3.4vw,40px)', letterSpacing: '-.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {primary}
          </div>
          {indication && (
            <div
              title={tc('indicationNote', { currency: policy.currency, asOf })}
              style={{ fontSize: 'clamp(15px,1.6vw,20px)', fontWeight: 600, color: 'var(--text-faint-2)', fontVariantNumeric: 'tabular-nums' }}
            >
              {indication}
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.6, margin: '0 0 8px' }}>{t('disclaimer')}</p>
      {indication && (
        <p style={{ fontSize: 12.5, color: 'var(--text-faint)', lineHeight: 1.6, margin: '0 0 20px' }}>
          {tc('indicationNote', { currency: policy.currency, asOf })}
        </p>
      )}
      {!indication && <div style={{ height: 12 }} />}

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <ModalButton type="quote" source="price_calculator" trackQuote className="btn btn--primary">
          {t('cta')} <ArrowRight size={15} />
        </ModalButton>
        <Link href={guideHref} className="lnk" style={{ fontWeight: 700, fontSize: 14 }}>
          {t('guideLink')} →
        </Link>
      </div>
    </div>
  );
}
