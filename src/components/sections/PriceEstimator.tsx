'use client';

// Public price-estimate step ("kosten rechner" / "kalkulator" / "prijs
// berekenen" queries): m² × ceiling type → the PUBLISHED indicative range,
// then straight into the quote modal. The buckets mirror the public price
// guide (blog spanplafond-prijs) and src/lib/indicative-prices.ts — keep all
// three in sync; this page must never show a number the guide does not
// publish. Nothing here reads trade pricing.
import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { ModalButton } from '@/components/ui/ModalButton';
import { Link } from '@/i18n/navigation';
import { localeFullCodes, type Locale } from '@/i18n/config';

// €/m² installed, excl. VAT — the published buckets from the price guide.
const BUCKETS = [
  { key: 'basic', low: 70, high: 90 },
  { key: 'printed', low: 90, high: 100 },
  { key: 'acoustic', low: 100, high: 150 },
  { key: 'backlit', low: 130, high: 160 },
  { key: 'bathroom', low: 150, high: 200 },
] as const;

export default function PriceEstimator() {
  const t = useTranslations('priceCalculatorPage');
  const locale = useLocale() as Locale;
  const [area, setArea] = useState(20);
  const [bucket, setBucket] = useState<(typeof BUCKETS)[number]['key']>('basic');

  const fmt = useMemo(
    () => new Intl.NumberFormat(localeFullCodes[locale] ?? 'en', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
    [locale],
  );
  const b = BUCKETS.find((x) => x.key === bucket) ?? BUCKETS[0];
  const safeArea = Math.min(Math.max(Number.isFinite(area) ? area : 0, 1), 1000);
  const low = fmt.format(safeArea * b.low);
  const high = fmt.format(safeArea * b.high);

  return (
    <div style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(24px,3vw,40px)', maxWidth: 720 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
        <label style={{ display: 'block' }}>
          <span className="field-label">{t('areaLabel')}</span>
          <input
            type="number"
            className="field"
            min={1}
            max={1000}
            value={Number.isFinite(area) ? area : ''}
            onChange={(e) => setArea(e.target.valueAsNumber)}
            aria-label={t('areaLabel')}
          />
        </label>
        <label style={{ display: 'block' }}>
          <span className="field-label">{t('typeLabel')}</span>
          <select className="field" value={bucket} onChange={(e) => setBucket(e.target.value as typeof bucket)}>
            {BUCKETS.map((x) => (
              <option key={x.key} value={x.key}>
                {t(`types.${x.key}`)} · €{x.low}–{x.high}/m²
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '18px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted-2)', marginBottom: 6 }}>
          {t('estimateLabel', { area: safeArea })}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px,3.4vw,40px)', letterSpacing: '-.02em', lineHeight: 1 }}>
          {low} – {high}
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.6, margin: '0 0 20px' }}>{t('disclaimer')}</p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <ModalButton type="quote" source="price_calculator" trackQuote className="btn btn--primary">
          {t('cta')} <ArrowRight size={15} />
        </ModalButton>
        <Link href="/blog/spanplafond-prijs" className="lnk" style={{ fontWeight: 700, fontSize: 14 }}>
          {t('guideLink')} →
        </Link>
      </div>
    </div>
  );
}
