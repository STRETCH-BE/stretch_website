// "Become a STRETCH installer" — the red B2B recruitment band. Three numbered
// cells (train in days / order B2B / referred leads) and dual CTAs to the
// training and partner flows.
import { Link } from '@/i18n/navigation';
import Eyebrow from '@/components/ui/Eyebrow';
import { ModalButton } from '@/components/ui/ModalButton';

const STEPS = [
  { n: '01', title: 'Train in days', body: 'Hands-on certification at our Belgian HQ — confection, profiles, cold & heat mounting, light and acoustics. No prior experience needed.' },
  { n: '02', title: 'Order B2B', body: 'Made-to-measure membranes and profiles from our workshop, at trade pricing, through a dedicated partner portal.' },
  { n: '03', title: 'Get referred leads', body: 'We pass local customer enquiries to certified partners in their region — real projects, not just a price list.' },
];

export default function InstallerPartner() {
  return (
    <section className="section--red" id="installer">
      <div className="container section">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(40px,5vw,64px)' }}>
          <div>
            <Eyebrow num="05" label="For the trade" tone="dark" />
            <h2 className="h2" style={{ color: '#fff', maxWidth: '16ch' }}>
              Become a STRETCH installer.
            </h2>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.9)', maxWidth: 400, margin: 0 }}>
            STRETCH is B2B-led. Add stretch ceilings to your offer, get trained at our HQ, order
            made-to-measure from Belgium, and receive referred local leads.
          </p>
        </div>

        <div className="ip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.3)', border: '1px solid rgba(255,255,255,.3)', marginBottom: 'clamp(32px,4vw,48px)' }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ background: 'var(--red)', padding: 'clamp(26px,3vw,40px)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'rgba(255,255,255,.7)', fontSize: 14, letterSpacing: '.05em' }}>{s.n}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-.01em', margin: '16px 0 11px', color: '#fff' }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.9)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <ModalButton type="partner" source="home_installer" className="btn btn--dark">
            Become a reseller →
          </ModalButton>
          <Link href="/installer-training" className="btn btn--ghost-light">
            See installer training →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .ip-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
