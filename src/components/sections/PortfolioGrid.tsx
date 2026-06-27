'use client';

// Client-side filterable portfolio grid. Filter buttons switch the active
// category; the grid re-renders from the static project list. Pure client
// state, no data fetching.
import { useMemo, useState } from 'react';
import { projects, projectFilters } from '@/lib/content';
import Placeholder from '@/components/ui/Placeholder';

export default function PortfolioGrid() {
  const [active, setActive] = useState('all');

  const shown = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.key === active)),
    [active],
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 'clamp(28px,3vw,40px)' }}>
        <div role="tablist" aria-label="Filter projects" style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {projectFilters.map((f) => {
            const on = active === f.key;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(f.key)}
                style={{
                  font: 'inherit',
                  cursor: 'pointer',
                  fontSize: 12.5,
                  fontWeight: 700,
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  padding: '9px 16px',
                  border: on ? '1px solid var(--black)' : '1px solid var(--border)',
                  background: on ? 'var(--black)' : '#fff',
                  color: on ? '#fff' : 'var(--text-muted)',
                  transition: 'all .15s',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
          Showing {shown.length}
        </span>
      </div>

      <div className="pf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {shown.map((p) => (
          <figure key={p.title} className="zoom-wrap" style={{ margin: 0, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ overflow: 'hidden' }}>
              <Placeholder label={`${p.title} — ${p.cat}`} light ratio="4/3" className="zoom-img" decorative />
            </div>
            <figcaption style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 9 }}>{p.cat}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', margin: '0 0 5px' }}>{p.title}</h3>
              <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>{p.meta}</div>
            </figcaption>
          </figure>
        ))}
      </div>

      <style>{`
        @media (max-width: 860px) { .pf-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px) { .pf-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
