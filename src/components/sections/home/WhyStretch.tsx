// "Why stretch" — image-led split on a dark section: a tall photo beside a 2×2
// grid of benefit cards. The fourth card is red and carries the survey CTA.
import { Link } from '@/i18n/navigation';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalTextLink } from '@/components/ui/ModalButton';
import { homeImages } from '@/lib/home-images';

const CELLS = [
  { n: '01', title: 'Fast & clean fitting', body: 'Up to 50m² per day, per two-person team. No stripping out, no debris — your room stays in use.' },
  { n: '02', title: '25-year lifespan', body: "Maintenance-free and washable. It won't crack, flake or yellow — and never needs repainting." },
  { n: '03', title: 'Acoustic & lit', body: 'Integrate acoustics, LED lines, backlighting and printed designs into one seamless surface.' },
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

        <div className="why-split">
          <div className="why-photo">
            <div className="why-photo-img">
              <Placeholder label="Why STRETCH — finished room" src={homeImages.whyStretch} alt="A flawless STRETCH ceiling in a finished interior" sizes="(max-width: 900px) 100vw, 48vw" decorative />
            </div>
          </div>

          <div className="why-cards">
            {CELLS.map((c) => (
              <div key={c.n} className="why-card">
                <div className="why-card-n">{c.n}</div>
                <div>
                  <h3 className="why-card-title">{c.title}</h3>
                  <p className="why-card-body">{c.body}</p>
                </div>
              </div>
            ))}
            <div className="why-card why-card--red">
              <div className="why-card-n why-card-n--light">04</div>
              <div>
                <h3 className="why-card-title">See it for your project</h3>
                <ModalTextLink
                  type="survey"
                  source="why_stretch"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '.04em', textTransform: 'uppercase', borderBottom: '2px solid #fff', paddingBottom: 4 }}
                >
                  Book a survey ↗
                </ModalTextLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .why-split { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: stretch; }
        .why-photo { position: relative; overflow: hidden; min-height: 520px; border: 1px solid var(--border-dark, #2a2a2a); }
        .why-photo-img { position: absolute; inset: 0; }
        .why-photo-img > * { width: 100%; height: 100%; }
        .why-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.14); }
        .why-card { background: var(--black); padding: clamp(24px,2.6vw,38px); display: flex; flex-direction: column; justify-content: space-between; gap: 28px; }
        .why-card--red { background: var(--red); }
        .why-card-n { font-family: var(--font-display); font-weight: 800; color: var(--red); font-size: 14px; letter-spacing: .05em; }
        .why-card-n--light { color: #fff; }
        .why-card-title { font-family: var(--font-display); font-weight: 800; font-size: clamp(18px,1.7vw,22px); letter-spacing: -.01em; margin: 0 0 12px; color: #fff; }
        .why-card-body { font-size: 14px; line-height: 1.6; color: var(--on-dark-muted); margin: 0; }
        @media (max-width: 900px) {
          .why-split { grid-template-columns: 1fr; }
          .why-photo { min-height: 340px; }
        }
        @media (max-width: 480px) {
          .why-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
