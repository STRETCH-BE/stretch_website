// Genuine Google reviews only — backed by src/lib/reviews.ts. Renders NOTHING
// (no heading, no empty state) when the current market has no reviews. Quotes
// stay in the language they were written in; only the chrome is localized.
// The star score in the header appears only when a computed aggregate exists
// (>= 3 genuine reviews) — never from a hardcoded rating.
import { useLocale, useTranslations } from 'next-intl';
import Eyebrow from '@/components/ui/Eyebrow';
import { reviewsFor, aggregateFor } from '@/lib/reviews';
import type { Locale } from '@/i18n/config';

export default function Reviews() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home.reviews');
  const items = reviewsFor(locale);
  if (items.length === 0) return null;
  const agg = aggregateFor(locale);

  return (
    <section className="section--surface" id="reviews">
      <div className="container section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(36px,4vw,56px)' }}>
          <div>
            <Eyebrow num="07" label={t('eyebrow')} />
            <h2 className="h2">
              {agg ? t('title', { score: agg.ratingValue }) : t('titlePlain')}
              <span className="accent">.</span>
            </h2>
          </div>
          {agg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px,5vw,64px)', lineHeight: 1, letterSpacing: '-.03em', color: 'var(--red)' }}>
                {agg.ratingValue}
              </span>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 16, letterSpacing: '.08em', color: 'var(--red)' }}>★★★★★</div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted-2)' }}>
                  {t('ratedOn', { source: 'Google' })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {items.map((r, i) => {
            const dark = i % 3 === 1;
            return (
              <figure
                key={r.sourceUrl}
                style={{
                  margin: 0,
                  border: dark ? '1px solid var(--black)' : '1px solid var(--border)',
                  background: dark ? 'var(--black)' : '#fff',
                  color: dark ? '#fff' : 'inherit',
                  padding: 'clamp(26px,3vw,38px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div aria-label={`${r.rating}/5`} style={{ fontSize: 15, letterSpacing: '.08em', color: dark ? 'var(--red-bright)' : 'var(--red)', marginBottom: 18 }}>
                  {'★'.repeat(r.rating)}
                  <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - r.rating)}</span>
                </div>
                <blockquote lang={undefined} style={{ margin: '0 0 24px', fontSize: 16, lineHeight: 1.6, color: dark ? 'var(--on-dark-soft)' : 'var(--text-body)', flex: 1 }}>
                  “{r.quote}”
                </blockquote>
                <figcaption style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: dark ? 'var(--red)' : 'var(--black)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                    }}
                  >
                    {r.author.charAt(0)}
                  </span>
                  <span>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>{r.author}</span>
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      style={{ display: 'block', fontSize: 12.5, color: dark ? 'var(--on-dark-muted)' : 'var(--text-faint)' }}
                    >
                      {[r.city, 'Google'].filter(Boolean).join(' · ')}
                    </a>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Honest provenance line — where these quotes actually come from. */}
        <p style={{ fontSize: 12.5, color: 'var(--text-faint)', margin: '18px 0 0' }}>{t('provenance')}</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) {
          .rev-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </section>
  );
}
