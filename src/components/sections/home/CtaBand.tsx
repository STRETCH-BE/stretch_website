// Closing CTA band — dark, oversized headline with the primary quote CTA and a
// "find your nearest dealer" link to Contact.
import { Link } from '@/i18n/navigation';
import { ModalButton } from '@/components/ui/ModalButton';
import { contact } from '@/lib/site-config';

export default function CtaBand() {
  return (
    <section className="section--dark" id="cta">
      <div className="container section" style={{ textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ width: 30, height: 2, background: 'var(--red)' }} />
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--on-dark-faint)' }}>
            Ready when you are
          </span>
          <span style={{ width: 30, height: 2, background: 'var(--red)' }} />
        </span>

        <h2 className="h2" style={{ color: '#fff', margin: '0 auto', maxWidth: '18ch' }}>
          Ready for a new ceiling<span className="accent">?</span>
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--on-dark-muted-2)', maxWidth: 560, margin: '22px auto 34px' }}>
          Tell us about your project and we will get back to you with a tailored price — free and
          without obligation, within two working days.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <ModalButton type="quote" source="home_cta" trackQuote className="btn btn--primary btn--lg">
            Request a free quote →
          </ModalButton>
          <Link href="/contact" className="btn btn--ghost-light btn--lg">
            Find your nearest dealer
          </Link>
        </div>

        <p style={{ marginTop: 30, fontSize: 13.5, color: 'var(--on-dark-faint)' }}>
          Prefer to talk?{' '}
          <a href={contact.phoneHref} style={{ color: '#fff', fontWeight: 600 }}>
            {contact.phoneDisplay}
          </a>{' '}
          · {contact.hoursDisplay}
        </p>
      </div>
    </section>
  );
}
