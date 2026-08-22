'use client';

// MATERIALS — per-item action row: optional version checkboxes (standard /
// acoustic / translucent) + quote button + add-to-inquiry toggle. The checked
// versions travel with the product name into the quote modal and the inquiry
// list, so the reply can quote the right membrane type straight away.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { useLeadModal } from '@/components/LeadGenModal';
import { analytics } from '@/lib/analytics';
import { useInquiry } from '@/components/materials/Inquiry';
import { Link } from '@/i18n/navigation';
import type { MaterialItem } from '@/lib/materials';

const VARIANT_KEY: Record<string, string> = {
  standard: 'variantStandard',
  acoustic: 'variantAcoustic',
  translucent: 'variantTranslucent',
};

export function ItemActions({
  group,
  name,
  source,
  variants,
  pageHref,
}: {
  group: string;
  name: string;
  source: string;
  variants?: MaterialItem['variants'];
  pageHref?: string;
}) {
  const t = useTranslations('materials');
  const { open } = useLeadModal();
  const { has, toggle } = useInquiry();
  const [sel, setSel] = useState<string[]>([]);

  const labels = (variants ?? []).filter((v) => sel.includes(v)).map((v) => t(VARIANT_KEY[v]));
  const product = labels.length ? `${name} — ${labels.join(', ')}` : name;
  const on = has(name);

  return (
    <div>
      {variants && variants.length > 0 && (
        <div className="mia-vars" role="group" aria-label={name}>
          {variants.map((v) => {
            const checked = sel.includes(v);
            return (
              <label key={v} className={checked ? 'mia-var mia-var--on' : 'mia-var'}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setSel((prev) => (checked ? prev.filter((x) => x !== v) : [...prev, v]))}
                />
                <span className="mia-var__box">{checked && <Check size={11} strokeWidth={3.5} />}</span>
                {t(VARIANT_KEY[v])}
              </label>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {pageHref && (
          <Link href={pageHref} className="btn btn--primary btn--sm">
            {t('orderKitCta')} <ArrowRight size={14} />
          </Link>
        )}
        <button
          type="button"
          className={pageHref ? 'btn btn--ghost btn--sm' : 'btn btn--primary btn--sm'}
          onClick={() => {
            analytics.quoteClick(product, source);
            open('quote', { source, product });
          }}
        >
          {t('requestQuote')} <ArrowRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => toggle({ group, name, variants: labels.length ? labels : undefined })}
          aria-pressed={on}
          className={on ? 'btn btn--sm' : 'btn btn--ghost btn--sm'}
          style={on ? { background: 'var(--black)', color: '#fff', borderColor: 'var(--black)' } : undefined}
        >
          {on ? (
            <>
              <Check size={14} /> {t('inList')}
            </>
          ) : (
            <>
              <Plus size={14} /> {t('addToList')}
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .mia-vars {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 12px;
        }
        .mia-var {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid var(--border-input);
          background: #fff;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          cursor: pointer;
          user-select: none;
        }
        .mia-var input {
          position: absolute;
          opacity: 0;
          width: 1px;
          height: 1px;
        }
        .mia-var__box {
          width: 14px;
          height: 14px;
          border: 1.5px solid var(--border-input);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }
        .mia-var--on {
          border-color: var(--black);
          color: var(--black);
        }
        .mia-var--on .mia-var__box {
          background: var(--red);
          border-color: var(--red);
          color: #fff;
        }
        .mia-var:hover {
          border-color: var(--black);
        }
      `}</style>
    </div>
  );
}
