// Contact page (/contact). Quick-contact cards, the message form (→ /api/contact)
// beside a workshop/map placeholder, the four-office grid, and a dealer CTA.
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl, contact, offices } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import ContactForm from '@/components/sections/ContactForm';
import { ModalButton } from '@/components/ui/ModalButton';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/contact', titleKey: 'contactTitle', descKey: 'contactDescription' });
}

const CARDS = [
  { icon: Phone, label: 'Call us', value: contact.phoneDisplay, sub: contact.hoursDisplay, href: contact.phoneHref },
  { icon: Mail, label: 'Email us', value: contact.email, sub: 'Personal reply within 2 days', href: `mailto:${contact.email}` },
  { icon: MessageCircle, label: 'WhatsApp / Telegram', value: 'Chat with us', sub: 'Quick questions, fast answers', href: contact.whatsappHref },
];

export default function ContactPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'Contact', url: `${siteUrl}/${locale}/contact` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={localBusinessSchema()} />

      {/* Hero + quick-contact cards */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(32px,4vw,56px)' }}>
        <Eyebrow num="01" label="Contact" />
        <h1 className="h1" style={{ margin: '0 0 clamp(28px,3vw,40px)' }}>
          Let&rsquo;s talk
          <br />
          <span className="accent">ceilings.</span>
        </h1>
        <div className="qc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {CARDS.map(({ icon: Icon, label, value, sub, href }) => (
            <a key={label} href={href} className="qc-card" style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(22px,2.4vw,30px)', textDecoration: 'none', display: 'block' }}>
              <span style={{ display: 'inline-flex', width: 44, height: 44, background: 'var(--surface)', color: 'var(--red)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Icon size={20} />
              </span>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginBottom: 9 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, letterSpacing: '-.01em', marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>{sub}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Form + workshop image */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,90px)' }}>
        <div className="ct-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }}>
          <div>
            <h2 className="h2 h2--sm" style={{ margin: '0 0 8px' }}>Send us a message</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 28px', maxWidth: 460 }}>
              Tell us about your project or question. A specialist replies within two working days.
            </p>
            <ContactForm />
          </div>
          <div style={{ position: 'relative', minHeight: 380, height: '100%' }}>
            <Placeholder label="Workshop / map" decorative style={{ minHeight: 380 }} />
            <div style={{ position: 'absolute', left: 0, bottom: 0, right: 0, background: 'var(--black)', color: '#fff', padding: '20px 24px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>Headquarters</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{contact.address.street}</div>
              <div style={{ fontSize: 15, color: 'var(--on-dark-soft)' }}>{contact.address.postalCode} {contact.address.city}, Belgium</div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="section--surface">
        <div className="container section--sm">
          <Eyebrow num="02" label="Our offices" />
          <div className="off-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {offices.map((o) => (
              <div key={o.country} style={{ background: '#fff', padding: 'clamp(22px,2.4vw,30px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: 'var(--red)' }}>{o.country}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>{o.role}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', marginBottom: 12 }}>{o.countryName}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {o.addressLines.map((l) => <div key={l}>{l}</div>)}
                </div>
                {o.email && (
                  <a href={`mailto:${o.email}`} className="lnk" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--red)' }}>{o.email}</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dealer CTA */}
      <section className="section--red">
        <div className="container section--sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h2 className="h2 h2--sm" style={{ color: '#fff', margin: '0 0 8px' }}>Prefer a local dealer?</h2>
            <p style={{ color: 'rgba(255,255,255,.9)', margin: 0, maxWidth: 460 }}>
              We refer residential enquiries to certified installers in your region — ask and we will
              connect you.
            </p>
          </div>
          <ModalButton type="quote" source="contact_dealer" trackQuote className="btn btn--dark">
            Find your nearest dealer <ArrowRight size={16} />
          </ModalButton>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .qc-grid { grid-template-columns: 1fr !important; }
          .ct-grid { grid-template-columns: 1fr !important; }
          .off-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .off-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
