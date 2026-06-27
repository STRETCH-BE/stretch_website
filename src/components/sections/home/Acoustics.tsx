// "Acoustics, built in." — dark section: image panel with a Class A tag, plus a
// four-cell capability grid (panels / islands / wall panels / invisible audio).
import { Link } from '@/i18n/navigation';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';

const CELLS = [
  {
    title: 'Acoustic panels',
    body: 'High-density absorption built behind the seamless membrane.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round">
        <line x1="6" y1="16" x2="6" y2="8" />
        <line x1="12" y1="19" x2="12" y2="5" />
        <line x1="18" y1="16" x2="18" y2="8" />
      </svg>
    ),
  },
  {
    title: 'Ceiling islands',
    body: 'Free-hanging baffles that calm large, open spaces.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.7">
        <ellipse cx="12" cy="12" rx="9" ry="5" />
      </svg>
    ),
  },
  {
    title: 'Wall panels',
    body: 'Decorative absorbers that double as wall finishes.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round">
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <line x1="4" y1="12" x2="20" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Invisible audio',
    body: 'Speakers hidden completely behind the stretched film.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.7">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2.4" fill="var(--red)" stroke="none" />
      </svg>
    ),
  },
];

export default function Acoustics() {
  return (
    <section className="section--dark" id="acoustics">
      <div className="container section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(36px,4vw,56px)' }}>
          <div>
            <Eyebrow num="03" label="Acoustic comfort" tone="dark" />
            <h2 className="h2">
              Acoustics,
              <br />
              <span className="accent">built in.</span>
            </h2>
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--on-dark-muted-2)', maxWidth: 380, margin: 0 }}>
            More than a beautiful finish. A micro-perforated membrane backed with high-density
            absorbers tames reverberation and noise — turning hard, echoey rooms into calm,
            comfortable spaces.
          </p>
        </div>

        <div className="ac-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 'clamp(24px,3vw,48px)', alignItems: 'stretch' }}>
          <div style={{ position: 'relative', minHeight: 440 }}>
            <Placeholder label="Acoustic install / studio" />
            <span style={{ position: 'absolute', left: 0, top: 0, background: 'var(--red)', color: '#fff', padding: '11px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>
              Up to Class A absorption
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ac-cells grid-lines grid-lines--dark" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 24, flex: 1 }}>
              {CELLS.map((c) => (
                <div key={c.title} style={{ background: 'var(--black)', padding: 'clamp(22px,2.4vw,30px)', display: 'flex', flexDirection: 'column' }}>
                  {c.icon}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', margin: '18px 0 9px' }}>{c.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--on-dark-muted)', margin: 0 }}>{c.body}</p>
                </div>
              ))}
            </div>
            <Link href="/products/acoustic-stretch-system" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>
              Explore acoustic solutions →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ac-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .ac-cells { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
