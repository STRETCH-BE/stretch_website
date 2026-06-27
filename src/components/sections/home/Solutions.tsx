// "Two systems. One finish." — the Polyester (light card) and PVC (dark card)
// comparison, each linking to its product page.
import { Link } from '@/i18n/navigation';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { homeImages } from '@/lib/home-images';

const POLY_FEATURES = ['Seamless to 5.15m', 'Cold installation', 'Very matte look', 'Acoustic & washable'];
const PVC_FEATURES = ['100% recyclable', 'Seamless to 5.7m', 'Easily removable', 'Acoustic & washable'];

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

      <div className="sol-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Polyester — light card */}
        <article style={{ border: '1px solid var(--border)', background: '#fff' }}>
          <Placeholder
            label="Polyester ceiling photo"
            src={homeImages.solutionsPolyester}
            alt="Matte polyester stretch ceiling"
            sizes="(max-width: 860px) 100vw, 45vw"
            light
            ratio="16/10"
          />
          <div style={{ padding: 'clamp(26px,3vw,40px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--red)' }}>Cold mount</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>Seamless to 5.15m</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.02em', textTransform: 'uppercase', margin: '0 0 14px' }}>Polyester</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: '0 0 22px' }}>
              An aesthetic, functional membrane for new build and renovation alike — installed cold,
              with a very matte look.
            </p>
            <ul style={{ listStyle: 'none', margin: '0 0 26px', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
              {POLY_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 600 }}>
                  <span className="tick tick--sm" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/products/polyester-stretch-ceiling" className="lnk" style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: '.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Explore polyester <span style={{ color: 'var(--red)' }}>→</span>
            </Link>
          </div>
        </article>

        {/* PVC — dark card */}
        <article style={{ border: '1px solid var(--black)', background: 'var(--black)', color: '#fff' }}>
          <Placeholder
            label="PVC ceiling photo"
            src={homeImages.solutionsPvc}
            alt="Glossy PVC film stretch ceiling"
            sizes="(max-width: 860px) 100vw, 45vw"
            ratio="16/10"
          />
          <div style={{ padding: 'clamp(26px,3vw,40px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--red)' }}>Heat mount</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#7c7972' }}>Seamless to 5.7m</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.02em', textTransform: 'uppercase', margin: '0 0 14px' }}>PVC Film</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--on-dark-muted)', margin: '0 0 22px' }}>
              A warmed film tensioned on install — fully recyclable and easily removable. Replace
              your ceiling in a single day.
            </p>
            <ul style={{ listStyle: 'none', margin: '0 0 26px', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
              {PVC_FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 600 }}>
                  <span className="tick tick--sm" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/products/pvc-stretch-ceiling" className="lnk" style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: '.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              Explore PVC <span style={{ color: 'var(--red)' }}>→</span>
            </Link>
          </div>
        </article>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .sol-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
