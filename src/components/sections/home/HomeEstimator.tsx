'use client';

// Compact estimator entry point for the homepage (per-market audit, T6 —
// mounted on stretchdecken.de directly under the hero): area field + ceiling
// type, submitting through to /price-calculator?area=&type=, where the full
// estimator reads the query and shows the published range. Nothing is
// computed here and no figure is shown — the numbers stay in ONE place
// (src/lib/indicative-prices.ts, rendered by PriceEstimator).
import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Calculator } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { bucketKeys, type BucketKey } from '@/lib/indicative-prices';

export default function HomeEstimator() {
  const t = useTranslations('home.estimator');
  const tc = useTranslations('priceCalculatorPage');
  const router = useRouter();
  const [area, setArea] = useState(20);
  const [type, setType] = useState<BucketKey>('basic');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const a = Math.min(Math.max(Math.round(Number.isFinite(area) ? area : 20), 1), 1000);
    router.push(`/price-calculator?area=${a}&type=${type}`);
  };

  return (
    <section className="he" aria-label={t('title')}>
      <div className="container he-in">
        <div className="he-copy">
          <div className="he-kicker"><Calculator size={15} /> {t('kicker')}</div>
          <h2 className="he-title">{t('title')}</h2>
          <p className="he-sub">{t('sub')}</p>
        </div>
        <form className="he-form" onSubmit={submit} action="/price-calculator" method="get">
          <label className="he-field">
            <span className="field-label">{tc('areaLabel')}</span>
            <input type="number" name="area" className="field" min={1} max={1000} value={Number.isFinite(area) ? area : ''} onChange={(e) => setArea(e.target.valueAsNumber)} />
          </label>
          <label className="he-field">
            <span className="field-label">{tc('typeLabel')}</span>
            <select name="type" className="field" value={type} onChange={(e) => setType(e.target.value as BucketKey)}>
              {bucketKeys.map((k) => (
                <option key={k} value={k}>{tc(`types.${k}`)}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn--primary he-btn">
            {t('cta')} <ArrowRight size={16} />
          </button>
        </form>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .he { background: var(--surface); border-bottom: 1px solid var(--border); }
        .he-in { display: grid; grid-template-columns: 1fr 1.2fr; gap: clamp(20px,3vw,48px); align-items: center; padding-top: clamp(22px,2.6vw,34px); padding-bottom: clamp(22px,2.6vw,34px); }
        .he-kicker { display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--red); margin-bottom: 8px; }
        .he-title { font-family: var(--font-display); font-weight: 900; font-size: clamp(20px,2.2vw,28px); letter-spacing: -.02em; line-height: 1.05; margin: 0 0 6px; }
        .he-sub { font-size: 13.5px; color: var(--text-muted); margin: 0; max-width: 46ch; }
        .he-form { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 12px; align-items: end; }
        .he-field { display: block; min-width: 0; }
        .he-btn { height: 46px; white-space: nowrap; }
        @media (max-width: 900px) { .he-in { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .he-form { grid-template-columns: 1fr; } }
      ` }} />
    </section>
  );
}
