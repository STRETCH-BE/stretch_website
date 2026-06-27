// Homepage hero: oversized headline, supporting copy + dual CTA, bullet proof
// points, and a hero image slot with the 5.0 Google rating + seamless-span tags.
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ModalButton } from '@/components/ui/ModalButton';
import Placeholder from '@/components/ui/Placeholder';

const PROOF = [
  'Installed within one day',
  'No dust or dirt during fitting',
  'Measurable acoustic improvement',
  'Never paint or sand again',
];

export default function Hero() {
  return (
    <section
      className="container"
      style={{ paddingTop: 'clamp(36px,6vw,76px)', paddingBottom: 'clamp(28px,4vw,48px)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(22px,3vw,34px)', flexWrap: 'wrap' }}>
        <span style={{ width: 34, height: 2, background: 'var(--red)' }} />
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--black)' }}>
          Stretch® Ceilings &amp; Walls
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>
          — Fitted in one day
        </span>
      </div>

      <h1 className="h-display" style={{ margin: 0 }}>
        A new ceiling
        <br />
        in <span className="accent">one day.</span>
      </h1>

      <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.35fr', gap: 'clamp(28px,4vw,64px)', marginTop: 'clamp(34px,4vw,56px)', alignItems: 'end' }}>
        <div>
          <p className="lead" style={{ maxWidth: 440, margin: '0 0 28px' }}>
            Sleek, seamless stretch ceilings and walls — installed cold, with no dust and no mess.
            One team, one day, a flawless finish that lasts 25 years and measurably improves the
            acoustics of every room.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 30 }}>
            <ModalButton type="quote" source="hero" trackQuote className="btn btn--primary">
              Request a free quote <ArrowRight size={16} />
            </ModalButton>
            <Link href="/products" className="btn btn--ghost">
              Explore solutions <ArrowRight size={16} className="btn__arrow" />
            </Link>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {PROOF.map((p) => (
              <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 13, fontSize: 14.5, fontWeight: 600 }}>
                <span className="tick" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ position: 'relative' }}>
          <Placeholder label="Hero ceiling photo" ratio="4/3.05" />
          <div style={{ position: 'absolute', left: -1, bottom: -1, background: 'var(--red)', color: '#fff', padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, lineHeight: 1 }}>5.0</span>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 13, letterSpacing: '.05em' }}>★★★★★</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0.92 }}>
                Rated on Google
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', right: -1, top: -1, background: 'var(--black)', color: '#fff', padding: '11px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            Seamless to 5.7m
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; align-items: start !important; }
        }
      `}</style>
    </section>
  );
}
