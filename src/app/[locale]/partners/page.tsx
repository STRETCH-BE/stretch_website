// Partners page (/partners). Explains the two ways to work with STRETCH —
// Reseller (you sell, we install via the dealer network) and Dealer (you sell
// and install yourself, after training) — with a comparison, shared benefits,
// per-path how-it-works, and a tagged application form. BreadcrumbList JSON-LD.
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, TrendingUp, Users, Package, MapPin, GraduationCap, Megaphone, Store, Wrench, Check } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { siteUrl } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { pageImages } from '@/lib/page-images';
import { ModalButton } from '@/components/ui/ModalButton';
import InlineLeadForm from '@/components/sections/InlineLeadForm';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/partners', titleKey: 'partnersTitle', descKey: 'partnersDescription' });
}

const RESELLER_POINTS = [
  'You sell the finished, installed ceiling to your client',
  'We install it for you, through our certified dealer network',
  'No installation crew or skills needed on your side',
  'Trade pricing, product imagery and referred local leads',
];
const DEALER_POINTS = [
  'You sell STRETCH product within your own projects',
  'You carry out the installation yourself',
  'Your installer completes our hands-on training course first',
  'Order made-to-measure from our Belgian workshop',
];

const COMPARE: { label: string; reseller: string; dealer: string }[] = [
  { label: 'What you sell', reseller: 'A finished, installed ceiling', dealer: 'Product within your own projects' },
  { label: 'Who installs', reseller: 'We do — via our dealer network', dealer: 'You do, yourself' },
  { label: 'Training', reseller: 'Not required', dealer: 'Required — hands-on course' },
  { label: 'Best suited to', reseller: 'Designers, showrooms, contractors', dealer: 'Installers & fit-out firms' },
];

const WHY = [
  { icon: TrendingUp, title: 'Strong margins', body: 'Trade pricing on made-to-measure membranes and profiles, with healthy margins on a premium, in-demand product.' },
  { icon: Users, title: 'Referred leads', body: 'We pass local customer enquiries to partners in their region — real projects, not just a price list.' },
  { icon: Package, title: 'B2B ordering', body: 'Order confectioned-to-size from our Belgian workshop through a dedicated partner portal, with reliable lead times.' },
  { icon: MapPin, title: 'Made in Belgium', body: 'Hand-made membranes engineered in Belgium, backed by a long product warranty you can stand behind.' },
  { icon: GraduationCap, title: 'Hands-on training', body: 'For dealers: certify your team at our HQ in days — confection, profiles, cold & heat mounting, light and acoustics.' },
  { icon: Megaphone, title: 'Marketing support', body: 'Product imagery, samples and sales material to help you win and close stretch-ceiling work.' },
];

const RESELLER_STEPS = [
  { n: '01', title: 'Apply as a reseller', body: 'Send a short application. We review every one personally and set up a call to understand your business.' },
  { n: '02', title: 'Get set up', body: 'Trade pricing, samples and sales material — no training needed. Start quoting stretch ceilings right away.' },
  { n: '03', title: 'Sell — we install', body: 'You close the sale and own the client; we and our dealers fit the ceiling, on time and to spec.' },
];
const DEALER_STEPS = [
  { n: '01', title: 'Apply as a dealer', body: 'Send a short application. We review every one personally and set up a call to understand your business.' },
  { n: '02', title: 'Train & certify', body: 'Your team completes our hands-on course at HQ: confection, profiles, cold & heat mounting, light and acoustics.' },
  { n: '03', title: 'Order & install', body: 'Order made-to-measure, fit it yourself in a day, and receive referred local leads as they come in.' },
];

export default function PartnersPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'Partners', url: `${siteUrl}/${locale}/partners` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Hero */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(40px,5vw,72px)' }}>
        <div className="pt-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <div>
            <Eyebrow num="01" label="For the trade" />
            <h1 className="h1" style={{ margin: '0 0 24px' }}>
              Partner with
              <br />
              <span className="accent">STRETCH.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 480, margin: '0 0 30px' }}>
              Two ways to work with us: sell our ceilings as a finished product and let our network
              install them, or train up and install them yourself. Either way, you get trade pricing,
              made-to-measure supply from Belgium and referred local leads.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <ModalButton type="partner" source="partners_hero" className="btn btn--primary">
                Apply to become a partner <ArrowRight size={16} />
              </ModalButton>
              <ModalButton type="call" source="partners_hero" className="btn btn--ghost">
                Book a call <ArrowRight size={16} className="btn__arrow" />
              </ModalButton>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Placeholder
            label="Installer / team photo"
            src={pageImages.partners}
            alt="A STRETCH installation partner at work"
            sizes="(max-width: 860px) 100vw, 45vw"
            ratio="4/3.4"
          />
            <div style={{ position: 'absolute', right: -1, bottom: -1, background: 'var(--red)', color: '#fff', padding: '16px 22px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, lineHeight: 1 }}>50m²</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 5 }}>Fitted per team / day</div>
            </div>
          </div>
        </div>
      </section>

      {/* Two ways to partner */}
      <section className="section--surface">
        <div className="container section">
          <Eyebrow num="02" label="Two ways to partner" />
          <h2 className="h2 h2--sm" style={{ margin: '0 0 14px', maxWidth: '22ch' }}>
            Reseller or dealer — pick the model that fits your business.
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: 620, margin: '0 0 clamp(32px,4vw,48px)' }}>
            The difference is simple: a reseller sells the ceiling and lets us install it; a dealer
            sells and installs it themselves after completing our training.
          </p>

          <div className="pt-paths" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {/* Reseller */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', padding: 'clamp(26px,3vw,40px)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ color: 'var(--red)', display: 'inline-flex' }}><Store size={26} /></span>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>Reseller</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px,2.4vw,28px)', letterSpacing: '-.02em', margin: '0 0 12px' }}>You sell. We install.</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-muted)', margin: '0 0 20px' }}>
                You sell a STRETCH ceiling as a finished, installed product to your client. We and our
                dealer network handle the installation as your partner — you focus on the sale and the
                relationship.
              </p>
              <ul style={{ listStyle: 'none', margin: '0 0 22px', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {RESELLER_POINTS.map((p) => (
                  <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.45 }}>
                    <Check size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />{p}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 13, color: 'var(--text-faint-2)', margin: '0 0 22px' }}><strong style={{ color: 'var(--text)' }}>Best for:</strong> interior designers, architects, kitchen &amp; bathroom showrooms and contractors who want to offer ceilings without installing them.</p>
              <div style={{ marginTop: 'auto' }}>
                <ModalButton type="partner" source="partners_reseller" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Apply as a reseller <ArrowRight size={15} />
                </ModalButton>
              </div>
            </div>

            {/* Dealer */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', padding: 'clamp(26px,3vw,40px)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ color: 'var(--red)', display: 'inline-flex' }}><Wrench size={26} /></span>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>Dealer</span>
                <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--red)', border: '1px solid var(--red)', padding: '4px 9px', borderRadius: 999 }}>Training required</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px,2.4vw,28px)', letterSpacing: '-.02em', margin: '0 0 12px' }}>You sell and install.</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-muted)', margin: '0 0 20px' }}>
                You sell STRETCH product within your own projects and carry out the installation
                yourself. To become a certified dealer, your installer first completes our hands-on
                training course at our HQ.
              </p>
              <ul style={{ listStyle: 'none', margin: '0 0 22px', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {DEALER_POINTS.map((p) => (
                  <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.45 }}>
                    <Check size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />{p}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 13, color: 'var(--text-faint-2)', margin: '0 0 22px' }}><strong style={{ color: 'var(--text)' }}>Best for:</strong> installers, fit-out firms and dry-lining specialists who want to add stretch ceilings to their own install capability.</p>
              <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <ModalButton type="partner" source="partners_dealer" className="btn btn--primary" style={{ flex: '1 1 auto', justifyContent: 'center' }}>
                  Apply as a dealer <ArrowRight size={15} />
                </ModalButton>
                <Link href="/installer-training" className="btn btn--ghost btn--sm" style={{ flex: '0 0 auto' }}>
                  See the training <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="pt-compare" style={{ marginTop: 'clamp(24px,3vw,36px)', border: '1px solid var(--border)', background: '#fff', overflowX: 'auto' }}>
            <div className="pt-compare-row pt-compare-head" style={{ fontWeight: 700 }}>
              <div />
              <div style={{ color: 'var(--text)' }}>Reseller</div>
              <div style={{ color: 'var(--text)' }}>Dealer</div>
            </div>
            {COMPARE.map((r) => (
              <div key={r.label} className="pt-compare-row">
                <div style={{ fontWeight: 600, color: 'var(--text-faint-2)' }}>{r.label}</div>
                <div>{r.reseller}</div>
                <div>{r.dealer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="section--dark">
        <div className="container section">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 'clamp(40px,5vw,64px)' }}>
            <div>
              <Eyebrow num="03" label="What every partner gets" tone="dark" />
              <h2 className="h2">More margin,<br /><span className="accent">less hassle.</span></h2>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--on-dark-muted-2)', maxWidth: 360, margin: 0 }}>
              Whichever model you choose, we handle the product and the supply chain — you deliver a
              premium ceiling your customers love.
            </p>
          </div>
          <div className="pt-why grid-lines grid-lines--dark" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {WHY.map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ background: 'var(--black)', padding: 'clamp(26px,3vw,40px)' }}>
                <span style={{ color: 'var(--red)', display: 'inline-flex', marginBottom: 18 }}><Icon size={26} /></span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, letterSpacing: '-.01em', margin: '0 0 11px' }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--on-dark-muted)', margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — per path */}
      <section className="container section">
        <Eyebrow num="04" label="How it works" />
        <h2 className="h2 h2--sm" style={{ margin: '0 0 clamp(36px,4vw,52px)', maxWidth: '24ch' }}>
          A short path to selling stretch ceilings — your way.
        </h2>
        <div className="pt-flows" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,48px)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span style={{ color: 'var(--red)', display: 'inline-flex' }}><Store size={20} /></span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '.02em', textTransform: 'uppercase', margin: 0 }}>Reseller path</h3>
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {RESELLER_STEPS.map((s) => (
                <li key={s.n} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 18 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--red)', lineHeight: 1 }}>{s.n}</div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, margin: '8px 0 5px' }}>{s.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <span style={{ color: 'var(--red)', display: 'inline-flex' }}><Wrench size={20} /></span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '.02em', textTransform: 'uppercase', margin: 0 }}>Dealer path</h3>
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DEALER_STEPS.map((s) => (
                <li key={s.n} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 18 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--red)', lineHeight: 1 }}>{s.n}</div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, margin: '8px 0 5px' }}>{s.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-muted)', margin: 0 }}>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="section--red">
        <div className="container section">
          <div className="pt-apply" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start' }}>
            <div>
              <Eyebrow num="05" label="Become a partner" tone="dark" />
              <h2 className="h2" style={{ color: '#fff', margin: '0 0 18px' }}>Apply<br /><span style={{ color: 'var(--black)' }}>today.</span></h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#fff', margin: '0 0 22px', maxWidth: 360 }}>
                Tell us whether you want to resell or install — we&apos;ll take it from there.
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['We review every application personally', 'Exclusive territory where available', 'Onboarding within weeks'].map((p) => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#fff', fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, background: '#fff', flexShrink: 0 }} />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff', padding: 'clamp(26px,3vw,40px)', border: '1px solid var(--border)' }}>
              <InlineLeadForm type="partner" source="partners_apply" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .pt-compare-row { display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 16px; padding: 14px clamp(16px,2vw,24px); border-bottom: 1px solid var(--border); font-size: 14px; min-width: 520px; }
        .pt-compare-row:last-child { border-bottom: 0; }
        .pt-compare-head { background: var(--surface); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; }
        @media (max-width: 860px) {
          .pt-hero { grid-template-columns: 1fr !important; }
          .pt-paths { grid-template-columns: 1fr !important; }
          .pt-why { grid-template-columns: 1fr 1fr !important; }
          .pt-flows { grid-template-columns: 1fr !important; }
          .pt-apply { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .pt-why { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
