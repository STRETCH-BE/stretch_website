// "Two systems. One finish." — Polyester and PVC as two tall, full-image cards
// with the copy overlaid on a bottom gradient and a subtle zoom on hover.
import { Link } from '@/i18n/navigation';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { homeImages } from '@/lib/home-images';

type Sol = {
  href: string;
  img: string;
  mount: string;
  span: string;
  name: string;
  blurb: string;
  features: string[];
  cta: string;
  alt: string;
  light?: boolean;
};

const SOLUTIONS: Sol[] = [
  {
    href: '/products/polyester-stretch-ceiling', img: homeImages.solutionsPolyester,
    mount: 'Cold mount', span: 'Seamless to 5.15m', name: 'Polyester',
    blurb: 'An aesthetic, functional membrane for new build and renovation alike — installed cold, with a very matte look.',
    features: ['Seamless to 5.15m', 'Cold installation', 'Very matte look', 'Acoustic & washable'],
    cta: 'Explore polyester', alt: 'Matte polyester stretch ceiling', light: true,
  },
  {
    href: '/products/pvc-stretch-ceiling', img: homeImages.solutionsPvc,
    mount: 'Heat mount', span: 'Seamless to 6.4m', name: 'PVC Film',
    blurb: 'A warmed film tensioned on install — fully recyclable and easily removable. Replace your ceiling in a single day.',
    features: ['100% recyclable', 'Seamless to 6.4m', 'Easily removable', 'Acoustic & washable'],
    cta: 'Explore PVC', alt: 'Glossy PVC film stretch ceiling',
  },
];

export default function Solutions() {
  return (
    <section className="container section" id="solutions">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 'clamp(36px,4vw,56px)' }}>
        <div>
          <Eyebrow num="02" label="Our solutions" />
          <h2 className="h2">
            Two systems.
            <br />
            One finish.
          </h2>
        </div>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 340, margin: 0 }}>
          Polyester or PVC — both tensioned by hand for the same flawless, matte result. Choose by
          span, removability and sustainability.
        </p>
      </div>

      <div className="sol-grid">
        {SOLUTIONS.map((s) => (
          <Link key={s.name} href={s.href} className="sol-card zoom-wrap">
            <div className="sol-img">
              <Placeholder label={`${s.name} ceiling photo`} src={s.img} alt={s.alt} sizes="(max-width: 760px) 100vw, 45vw" light={s.light} className="zoom-img" decorative />
            </div>
            <div className="sol-overlay">
              <div className="sol-tags">
                <span className="sol-tag sol-tag--red">{s.mount}</span>
                <span className="sol-tag">{s.span}</span>
              </div>
              <h3 className="sol-name">{s.name}</h3>
              <p className="sol-blurb">{s.blurb}</p>
              <ul className="sol-features">
                {s.features.map((f) => (
                  <li key={f}><span className="tick tick--sm" />{f}</li>
                ))}
              </ul>
              <span className="sol-link">{s.cta} <span style={{ color: 'var(--red)' }}>&rarr;</span></span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .sol-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .sol-card { position: relative; display: block; overflow: hidden; min-height: 600px; border: 1px solid var(--border); background: var(--black); }
        .sol-img { position: absolute; inset: 0; }
        .sol-img > * { width: 100%; height: 100%; }
        .sol-overlay {
          position: absolute; inset: 0; z-index: 1;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: clamp(26px,3vw,42px);
          background: linear-gradient(to top, rgba(10,10,10,.92) 0%, rgba(10,10,10,.55) 38%, rgba(10,10,10,.1) 70%, rgba(10,10,10,0) 100%);
        }
        .sol-tags { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
        .sol-tag { font-size: 11.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.65); }
        .sol-tag--red { color: var(--red); }
        .sol-name { font-family: var(--font-display); font-weight: 900; font-size: clamp(30px,3.6vw,46px); letter-spacing: -.025em; text-transform: uppercase; color: #fff; margin: 0 0 14px; line-height: .9; }
        .sol-blurb { font-size: 14.5px; line-height: 1.6; color: var(--on-dark-soft); margin: 0 0 20px; max-width: 42ch; }
        .sol-features { list-style: none; margin: 0 0 24px; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 420px; }
        .sol-features li { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 600; color: #fff; }
        .sol-link { font-weight: 700; font-size: 13.5px; letter-spacing: .05em; text-transform: uppercase; color: #fff; display: inline-flex; align-items: center; gap: 10px; }
        @media (max-width: 760px) {
          .sol-grid { grid-template-columns: 1fr !important; }
          .sol-card { min-height: 460px; }
        }
      `}</style>
    </section>
  );
}
