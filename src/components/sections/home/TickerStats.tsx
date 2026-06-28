// Red scrolling ticker + the four-stat band.
const TICKER_ITEMS = [
  'Installed in one day',
  'Acoustic improvement',
  '25-year lifespan',
  '100% recyclable',
  'Seamless to 5.7m',
  'No dust · No paint',
  'Hand made in Belgium',
];

export function Ticker() {
  const run = TICKER_ITEMS.map((t) => (
    <span key={t} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '.04em', textTransform: 'uppercase', padding: '15px 0' }}>
        &nbsp;&nbsp;{t}&nbsp;&nbsp;&nbsp;▪&nbsp;&nbsp;&nbsp;
      </span>
    </span>
  ));
  return (
    <div style={{ background: 'var(--red)', color: '#fff', overflow: 'hidden', whiteSpace: 'nowrap', borderTop: '1px solid var(--black)', borderBottom: '1px solid var(--black)' }}>
      <div style={{ display: 'inline-flex', willChange: 'transform', animation: 'ticker 34s linear infinite' }}>
        <div style={{ display: 'inline-flex' }}>{run}</div>
        <div style={{ display: 'inline-flex' }} aria-hidden>
          {run}
        </div>
      </div>
    </div>
  );
}

const STATS = [
  { value: '1', accent: '.', label: 'Day to install' },
  { value: '+25', accent: '.', label: 'Year lifespan' },
  { value: '6.4', accent: 'm', label: 'Seamless span' },
  { value: '100', accent: '%', label: 'Recyclable (PVC)' },
];

export function Stats() {
  return (
    <section
      className="container stats-grid"
      style={{
        paddingTop: 'clamp(40px,5vw,72px)',
        paddingBottom: 'clamp(40px,5vw,72px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 1,
        background: 'var(--border)',
        border: '1px solid var(--border)',
      }}
    >
      {STATS.map((s) => (
        <div key={s.label} style={{ background: '#fff', padding: '28px 24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px,4vw,52px)', lineHeight: 1, letterSpacing: '-.03em' }}>
            {s.value}
            <span className="accent">{s.accent}</span>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted-2)', marginTop: 10 }}>
            {s.label}
          </div>
        </div>
      ))}
      <style>{`
        @media (max-width: 720px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
