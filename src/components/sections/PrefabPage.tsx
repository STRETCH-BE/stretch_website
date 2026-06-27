// Custom prefab page body (used by both prefab routes). Sections: hero → what we
// build → materials → case studies (3D render / cut-view / end result) → shipped
// worldwide → CTA. Driven by src/lib/prefab.ts.
import { Link } from '@/i18n/navigation';
import { ArrowRight, Globe } from 'lucide-react';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import Eyebrow from '@/components/ui/Eyebrow';
import type { PrefabPageData } from '@/lib/prefab';

const CASE_LABELS = ['3D render', 'Cut-view', 'End result'] as const;

export default function PrefabPage({ data }: { data: PrefabPageData }) {
  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container" style={{ paddingTop: 'clamp(20px,3vw,30px)' }}>
        <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, fontSize: 12.5, color: 'var(--text-faint-2)' }}>
          <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Solutions</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" style={{ color: 'var(--text-muted)' }}>{data.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(24px,3vw,40px) 0 clamp(40px,5vw,72px)' }}>
        <div className="pf-hero">
          <div style={{ minWidth: 0 }}>
            <Eyebrow num="01" label={data.eyebrow} />
            <h1 className="h1" style={{ margin: '0 0 clamp(16px,2vw,24px)' }}>{data.name}</h1>
            <p className="lead" style={{ maxWidth: 500, margin: '0 0 28px' }}>{data.intro}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <ModalButton type="quote" source={`prefab_${data.slug}`} trackQuote className="btn btn--primary">
                Discuss a project <ArrowRight size={16} />
              </ModalButton>
              <Link href="/partners" className="btn btn--ghost">Become a dealer</Link>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <Placeholder label={`${data.name} photo`} src={data.hero} alt={data.name} priority sizes="(max-width: 860px) 100vw, 50vw" ratio="4/3.2" />
          </div>
        </div>
      </section>

      {/* What we build */}
      <section className="container" style={{ paddingBottom: 'clamp(44px,5vw,76px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}>
          <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: 13, letterSpacing: '.16em' }}>(01)</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>{data.makeHeading}</span>
        </div>
        <div className="pf-grid">
          {data.make.map((m) => (
            <div key={m.title} className="pf-card">
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(19px,2vw,23px)', letterSpacing: '-.01em', margin: '0 0 10px' }}>{m.title}</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section className="container" style={{ paddingBottom: 'clamp(44px,5vw,76px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}>
          <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: 13, letterSpacing: '.16em' }}>(02)</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>{data.materialsHeading}</span>
        </div>
        <div className="pf-grid">
          {data.materials.map((m) => (
            <div key={m.title} className="pf-mat">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-.01em', margin: '0 0 9px' }}>{m.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      {data.caseStudies.length > 0 && (
        <section className="container" style={{ paddingBottom: 'clamp(44px,5vw,76px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 'clamp(24px,3vw,38px)' }}>
            <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: 13, letterSpacing: '.16em' }}>(03)</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>Case studies</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(34px,4vw,56px)' }}>
            {data.caseStudies.map((c) => (
              <div key={c.title} className="pf-case">
                <div className="pf-case-head">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.2vw,26px)', letterSpacing: '-.01em', margin: 0 }}>{c.title}</h3>
                  {c.meta && <span className="pf-case-meta">{c.meta}</span>}
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: '10px 0 0', maxWidth: 640 }}>{c.summary}</p>
                </div>
                <div className="pf-case-imgs">
                  {[c.render, c.cutview, c.result].map((src, i) => (
                    <figure key={i} style={{ margin: 0 }}>
                      <Placeholder
                        label={`${c.title} — ${CASE_LABELS[i]}`}
                        src={src}
                        alt={`${c.title} — ${CASE_LABELS[i]}`}
                        sizes="(max-width: 860px) 100vw, 33vw"
                        light
                        ratio="4/3"
                      />
                      <figcaption style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginTop: 10 }}>
                        <span style={{ color: 'var(--red)', marginRight: 7 }}>0{i + 1}</span>{CASE_LABELS[i]}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shipped worldwide */}
      <section className="container" style={{ paddingBottom: 'clamp(44px,5vw,76px)' }}>
        <div className="pf-world">
          <Globe size={30} strokeWidth={1.7} style={{ color: 'var(--red)', flex: '0 0 auto' }} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(20px,2.4vw,28px)', letterSpacing: '-.01em', textTransform: 'uppercase', margin: '0 0 8px' }}>Shipped worldwide</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0, maxWidth: 620 }}>{data.worldwide}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,90px)' }}>
        <div style={{ background: 'var(--black)', padding: 'clamp(30px,4vw,52px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 22 }}>
          <div>
            <h2 className="h2 h2--sm" style={{ color: '#fff', fontSize: 'clamp(24px,3vw,34px)', margin: '0 0 8px' }}>Have a project for us?</h2>
            <p style={{ color: 'var(--on-dark-muted)', fontSize: 14.5, lineHeight: 1.55, margin: 0, maxWidth: 470 }}>Send us the drawings or the idea — we will engineer the prefab structure and ship it to you.</p>
          </div>
          <ModalButton type="quote" source={`prefab_${data.slug}_cta`} trackQuote className="btn btn--primary">
            Discuss a project <ArrowRight size={16} />
          </ModalButton>
        </div>
      </section>

      <style>{`
        .pf-hero { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(28px,4vw,60px); align-items: center; }
        .pf-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .pf-card { border: 1px solid var(--border); background: #fff; padding: clamp(22px,2.6vw,30px); }
        .pf-mat { border-left: 2px solid var(--red); background: var(--surface); padding: clamp(18px,2.2vw,26px); }
        .pf-case { border: 1px solid var(--border); background: #fff; padding: clamp(20px,2.6vw,32px); }
        .pf-case-head { margin-bottom: clamp(18px,2.2vw,26px); }
        .pf-case-meta { display: inline-block; margin-top: 8px; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--red); }
        .pf-case-imgs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .pf-world { display: flex; gap: 18px; align-items: flex-start; border: 1px solid var(--border); background: var(--surface); padding: clamp(22px,3vw,34px); }
        @media (max-width: 900px) {
          .pf-hero { grid-template-columns: 1fr; }
          .pf-grid { grid-template-columns: 1fr; }
          .pf-case-imgs { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
