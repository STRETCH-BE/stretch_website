// "Why stretch" — dark section, six-cell hairline grid. The sixth cell is red
// and contains a survey CTA.
import Eyebrow from '@/components/ui/Eyebrow';
import { ModalTextLink } from '@/components/ui/ModalButton';

const CELLS = [
  { n: '01', title: 'Fast & clean fitting', body: 'Up to 50m² per day, per two-person team. No stripping out, no debris — your room stays in use.' },
  { n: '02', title: '25-year lifespan', body: "Maintenance-free and washable. It won't crack, flake or yellow — and it never needs repainting." },
  { n: '03', title: '100% recyclable', body: 'Our PVC system is fully recyclable back to raw material — a circular, sustainable choice.' },
  { n: '04', title: 'Acoustic & lit', body: 'Integrate acoustics, LED lines, backlighting and printed designs into one seamless surface.' },
  { n: '05', title: 'Lower cost', body: 'Cheaper than a conventional suspended ceiling, with far less labour and zero finishing trades.' },
];

export default function WhyStretch() {
  return (
    <section className="section--dark" id="why">
      <div className="container section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(40px,5vw,68px)' }}>
          <div>
            <Eyebrow num="01" label="Why stretch" tone="dark" />
            <h2 className="h2" style={{ maxWidth: '13ch' }}>
              A better ceiling, by design.
            </h2>
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--on-dark-muted-2)', maxWidth: 360, margin: 0 }}>
            A single membrane, tensioned cold across the room. No demolition, no drying time, no
            compromise — engineered to outlast conventional plasterboard.
          </p>
        </div>

        <div className="why-grid grid-lines grid-lines--dark" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          {CELLS.map((c) => (
            <div key={c.n} style={{ background: 'var(--black)', padding: 'clamp(28px,3vw,42px)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--red)', fontSize: 14, letterSpacing: '.05em' }}>
                {c.n}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', margin: '18px 0 12px' }}>
                {c.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--on-dark-muted)', margin: 0 }}>{c.body}</p>
            </div>
          ))}
          <div style={{ background: 'var(--red)', padding: 'clamp(28px,3vw,42px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 14, letterSpacing: '.05em' }}>06</div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', margin: '18px 0 16px', color: '#fff' }}>
                See it for your project
              </h3>
              <ModalTextLink
                type="survey"
                source="why_stretch"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #fff',
                  paddingBottom: 4,
                }}
              >
                Book a survey ↗
              </ModalTextLink>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .why-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
