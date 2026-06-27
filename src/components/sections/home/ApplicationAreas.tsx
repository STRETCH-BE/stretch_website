// "Where stretch works" — a bento grid of application areas. The living-room
// tile spans 2×2 and is flagged "Most popular"; cinema spans two columns. Each
// tile links through to the Inspiration gallery.
import { Link } from '@/i18n/navigation';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';

type Area = {
  key: string;
  title: string;
  blurb: string;
  area: string; // grid-area name
  badge?: string;
  dark?: boolean;
};

const AREAS: Area[] = [
  { key: 'living', title: 'Living rooms', blurb: 'A flawless, matte ceiling that reads like fresh plaster — without the cracks.', area: 'living', badge: 'Most popular' },
  { key: 'bathroom', title: 'Bathrooms', blurb: 'Humidity-proof and washable.', area: 'bath' },
  { key: 'office', title: 'Offices', blurb: 'Acoustic comfort at work.', area: 'office' },
  { key: 'cinema', title: 'Home cinemas', blurb: 'Starry skies, hidden speakers and Class A acoustics in one seamless surface.', area: 'cinema', dark: true },
  { key: 'light', title: 'Backlit & starry', blurb: 'Even, dimmable light.', area: 'starry' },
  { key: 'commercial', title: 'Retail & hotels', blurb: 'Printed, branded ceilings.', area: 'retail' },
];

export default function ApplicationAreas() {
  return (
    <section className="container section" id="applications">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 'clamp(36px,4vw,56px)' }}>
        <div>
          <Eyebrow num="04" label="Applications" />
          <h2 className="h2">
            Where stretch
            <br />
            works best.
          </h2>
        </div>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 360, margin: 0 }}>
          From a single living room to an entire hotel — the same seamless system, tuned to the
          demands of each space.
        </p>
      </div>

      <div className="bento">
        {AREAS.map((a) => (
          <Link
            key={a.key}
            href="/inspiration"
            className={`bento-cell zoom-wrap${a.dark ? ' bento-cell--dark' : ''}`}
            style={{ gridArea: a.area }}
          >
            <Placeholder label={`${a.title} example`} light={!a.dark} className="zoom-img" decorative />
            <div className="bento-overlay">
              {a.badge && <span className="bento-badge">{a.badge}</span>}
              <div className="bento-meta">
                <h3 className="bento-title">{a.title}</h3>
                <p className="bento-blurb">{a.blurb}</p>
                <span className="bento-link">View projects →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .bento {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, minmax(190px, 1fr));
          gap: 14px;
          grid-template-areas:
            "living living cinema cinema"
            "living living bath office"
            "starry retail bath office";
          grid-template-rows: repeat(3, minmax(170px, 1fr));
        }
        .bento-cell {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--black);
          display: block;
          min-height: 170px;
        }
        .bento-cell--dark { border-color: var(--black); }
        .bento-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(16px, 1.8vw, 26px);
          background: linear-gradient(to top, rgba(10,10,10,.82) 0%, rgba(10,10,10,.12) 55%, rgba(10,10,10,0) 100%);
        }
        .bento-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: var(--red);
          color: #fff;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          padding: 6px 11px;
        }
        .bento-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(18px, 2vw, 26px);
          letter-spacing: -.02em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 6px;
        }
        .bento-blurb {
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--on-dark-soft);
          margin: 0 0 12px;
          max-width: 34ch;
        }
        .bento-link {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #fff;
        }
        .bento-cell:hover .bento-link { color: var(--red); }
        @media (max-width: 860px) {
          .bento {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            grid-template-areas:
              "living living"
              "cinema cinema"
              "bath office"
              "starry retail";
          }
        }
        @media (max-width: 540px) {
          .bento {
            grid-template-columns: 1fr;
            grid-template-areas:
              "living" "cinema" "bath" "office" "starry" "retail";
          }
        }
      `}</style>
    </section>
  );
}
