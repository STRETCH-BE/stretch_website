// Contact page (/contact). Quick-contact cards, the message form (→ /api/contact)
// beside a workshop/map placeholder, the four-office grid, and a dealer CTA.
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone, Mail, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, localeFullCodes, type Locale } from '@/i18n/config';
import { siteUrl, contact, offices, swissPartner, brand, polishEntity } from '@/lib/site-config';
import { localContactFor, isSwissLocale, isPolishLocale, mapPlaceFor } from '@/lib/local-contact';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema, localBusinessSchema, branchLocalBusinessSchemas, polishBusinessSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import { isDealerMarket } from '@/lib/dealers';
import ContactForm from '@/components/sections/ContactForm';
import ContactMap from '@/components/sections/ContactMap';
import { ModalButton } from '@/components/ui/ModalButton';
import { localeBase } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/contact', titleKey: 'contactTitle', descKey: 'contactDescription' });
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const t = await getTranslations('contactPage');
  const tp = await getTranslations('productPage');
  // ch: the Swiss general representative answers — QuinLay's number and inbox.
  const local = localContactFor(locale);
  const swiss = isSwissLocale(locale);
  // pl: Alto Design Sp. z o.o. (Częstochowa) is the point of contact; the HQ stays visible below.
  const polish = isPolishLocale(locale);
  const tc = await getTranslations('common');
  const tpl = (k: string) => tc(`plContact.${k}`); // pl-only keys (pl.json), only called when `polish`
  const map = mapPlaceFor(locale);
  // "Tessin / Ticino: contattateci in italiano — office@quinlay.ch", e-mail linked.
  const ticino = t('ticinoLine').split(swissPartner.email);

  const cards = [
    { icon: Phone, label: t('cards.call.label'), value: local.phoneDisplay, sub: swiss ? t('swissCallback') : t('hours'), href: local.phoneHref, aria: local.phoneLine ? tpl(`call.${local.phoneLine}`) : undefined },
    { icon: Mail, label: t('cards.email.label'), value: local.email, sub: swiss || polish ? local.name : t('cards.email.sub'), href: `mailto:${local.email}`, aria: undefined },
    { icon: MessageCircle, label: t('cards.chat.label'), value: t('cards.chat.value'), sub: t('cards.chat.sub'), href: contact.whatsappHref, aria: undefined },
  ];

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('eyebrow'), url: `${localeBase(locale)}/contact` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={localBusinessSchema()} />
      {/* pl: Alto Design's own node (full NAP, hours, VAT) replaces the generic PL branch node. */}
      {[
        ...(polish ? [polishBusinessSchema()] : []),
        ...branchLocalBusinessSchemas().filter((b) => !(polish && String(b['@id']).endsWith('#branch-pl'))),
      ].map((b) => (
        <JsonLd key={b['@id']} data={b} />
      ))}

      {/* Hero + quick-contact cards */}
      <section className="container" style={{ padding: 'clamp(36px,5vw,72px) 0 clamp(32px,4vw,56px)' }}>
        <Eyebrow num="01" label={t('eyebrow')} />
        <h1 className="h1" style={{ margin: '0 0 clamp(28px,3vw,40px)' }}>
          {t('titleA')}
          <br />
          <span className="accent">{t('titleB')}.</span>
        </h1>
        <div className="qc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {cards.map(({ icon: Icon, label, value, sub, href, aria }) => (
            <a key={label} href={href} {...(aria ? { 'aria-label': aria } : {})} className="qc-card" style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(22px,2.4vw,30px)', textDecoration: 'none', display: 'block' }}>
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

      {/* Switzerland & Liechtenstein: QuinLay AG is the partner every enquiry reaches (2 Sep 2026).
          Poland (4 Sep 2026): Alto Design Sp. z o.o. first (labelled lines), the group HQ beside it. */}
      {swiss ? (
        <section className="container" style={{ paddingBottom: 'clamp(32px,4vw,48px)' }}>
          <div style={{ border: '1.5px solid var(--black)', background: '#fff', padding: 'clamp(22px,3vw,36px)', display: 'grid', gridTemplateColumns: '1.3fr .9fr', gap: 'clamp(18px,3vw,40px)' }} className="ct-swiss">
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>{t('swissPartnerKicker')}</div>
              <h2 className="h2 h2--sm" style={{ margin: '0 0 10px' }}>{t('swissPartnerTitle')}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-body)', margin: 0, maxWidth: 640 }}>{t('swissPartnerBody')}</p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 'clamp(18px,2.2vw,26px)', fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)', alignSelf: 'start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--black)', marginBottom: 4 }}>{swissPartner.name}</div>
              <div>{swissPartner.street}</div>
              <div>{swissPartner.postalCode} {swissPartner.city} {swissPartner.canton}</div>
              <a href={swissPartner.phoneHref} className="lnk" style={{ display: 'inline-block', marginTop: 10, fontWeight: 700 }}>{swissPartner.phoneDisplay}</a>
              <br />
              <a href={`mailto:${swissPartner.email}`} className="lnk" style={{ fontWeight: 700 }}>{swissPartner.email}</a>
              <br />
              <a href={swissPartner.url} className="lnk" rel="noopener" target="_blank" style={{ fontWeight: 700 }}>quinlay.ch</a>
              <div style={{ marginTop: 10, fontSize: 12.5 }}>{t('swissCallback')}</div>
            </div>
          </div>
          {/* Ticino: no Italian locale — one line, in Italian, pointing at QuinLay. */}
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)', margin: '14px 0 0' }}>
            {ticino[0]}
            <a href={`mailto:${swissPartner.email}`} className="lnk" style={{ fontWeight: 700 }}>{swissPartner.email}</a>
            {ticino[1]}
          </p>
        </section>
      ) : polish ? (
        <section className="container" style={{ paddingBottom: 'clamp(32px,4vw,48px)' }}>
          <div style={{ border: '1.5px solid var(--black)', background: '#fff', padding: 'clamp(22px,3vw,36px)', display: 'grid', gridTemplateColumns: '1.3fr .9fr', gap: 'clamp(18px,3vw,40px)' }} className="ct-swiss">
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>{tpl('officeHeading')}</div>
              <h2 className="h2 h2--sm" style={{ margin: '0 0 10px', fontSize: 'clamp(22px,2.2vw,30px)' }}>{polishEntity.name}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 16px' }}>
                {polishEntity.street}
                <br />
                {`${polishEntity.postalCode} ${polishEntity.city}, ${polishEntity.countryName}`}
              </p>
              <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 18px' }} className="ct-pl-lines">
                {polishEntity.phones.map((ph) => (
                  <li key={ph.key} style={{ lineHeight: 1.35 }}>
                    <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginBottom: 2 }}>{tpl(`lines.${ph.key}`)}</span>
                    <a href={ph.href} className="lnk" aria-label={tpl(`call.${ph.key}`)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--black)' }}>{ph.display}</a>
                    {ph.languages && <span style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: 8 }}>{ph.languages}</span>}
                  </li>
                ))}
              </ul>
              <a href={`mailto:${polishEntity.email}`} className="lnk" style={{ fontWeight: 700 }}>{polishEntity.email}</a>
              <div style={{ marginTop: 8, fontSize: 13.5, color: 'var(--text-muted)' }}>{`${tpl('hoursLabel')}: ${polishEntity.hours}`}</div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 'clamp(18px,2.2vw,26px)', fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)', alignSelf: 'start' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>{tpl('hqHeading')}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--black)', marginBottom: 4 }}>{brand.parentCompany}</div>
              <div>{contact.address.footerLines[0]}</div>
              <div>{`${contact.address.postalCode} ${contact.address.city}, ${tpl('hqCountry')}`}</div>
              <a href={`mailto:${contact.email}`} className="lnk" style={{ display: 'inline-block', marginTop: 10, fontWeight: 700 }}>{contact.email}</a>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `@media (max-width: 860px) { .ct-pl-lines { grid-template-columns: 1fr !important; } }` }} />
        </section>
      ) : false}

      {/* Form + workshop image */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,90px)' }}>
        <div className="ct-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }}>
          <div>
            <h2 className="h2 h2--sm" style={{ margin: '0 0 8px' }}>{t('formTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 28px', maxWidth: 460 }}>
              {t('formLead')}
            </p>
            <ContactForm />
          </div>
          {/* Google Maps (consent-aware, see ContactMap) showing the Google
              Business Profile listing: QuinLay AG for the Swiss locales, the
              Częstochowa branch on stretch-sufit.pl, the Beveren HQ
              everywhere else (mapPlaceFor). The address box sits BELOW the
              map so Google's attribution stays visible. */}
          <div className="ct-map-col" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', minHeight: 380 }}>
            <ContactMap
              place={map.place}
              lang={localeFullCodes[locale].split('-')[0]}
              title={t('mapLabel')}
              loadLabel={t('map.load')}
              note={t('map.note')}
              openLabel={t('map.open')}
            />
            <div style={{ background: 'var(--black)', color: '#fff', padding: '20px 24px' }}>
              {swiss ? (
                <>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: 8 }}>{t('swissPartnerKicker')}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{swissPartner.name} · {swissPartner.street}</div>
                  <div style={{ fontSize: 15, color: 'var(--on-dark-soft)' }}>{swissPartner.postalCode} {swissPartner.city} {swissPartner.canton}</div>
                </>
              ) : polish ? (
                <>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: 8 }}>{tpl('officeHeading')}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{`${polishEntity.name} · ${polishEntity.street}`}</div>
                  <div style={{ fontSize: 15, color: 'var(--on-dark-soft)' }}>{`${polishEntity.postalCode} ${polishEntity.city}, ${polishEntity.countryName}`}</div>
                </>
              ) : map.office ? (
                <>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: 8 }}>{map.office.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{map.office.addressLines[0]}</div>
                  <div style={{ fontSize: 15, color: 'var(--on-dark-soft)' }}>{map.office.addressLines.slice(1).join(', ')}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--red-bright)', marginBottom: 8 }}>{t('hqKicker')}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{contact.address.street}</div>
                  <div style={{ fontSize: 15, color: 'var(--on-dark-soft)' }}>{t('hqLocation', { postalCode: contact.address.postalCode, city: contact.address.city })}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="section--surface">
        <div className="container section--sm">
          <Eyebrow num="02" label={t('officesEyebrow')} />
          <div className="off-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
            {offices.map((o) => (
              <div key={o.country} style={{ background: '#fff', padding: 'clamp(22px,2.4vw,30px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: 'var(--red)' }}>{o.country}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>{o.role}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', marginBottom: 12 }}>{o.countryName}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {(polish && o.country === 'PL' ? [polishEntity.name, polishEntity.street, `${polishEntity.postalCode} ${polishEntity.city}`] : o.addressLines).map((l) => <div key={l}>{l}</div>)}
                </div>
                {o.email && (
                  <a href={`mailto:${o.email}`} className="lnk" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--red)' }}>{o.email}</a>
                )}
                {o.maps?.shareUrl && (
                  <a href={o.maps.shareUrl} target="_blank" rel="noopener noreferrer" className="lnk" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 12.5, fontWeight: 700 }}>
                    <MapPin size={13} style={{ color: 'var(--red)' }} /> {t('map.open')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dealer CTA — or, on markets without a dealer network (N2), the
          truthful direct-installation band. Same layout, honest copy. */}
      <section className="section--red">
        <div className="container section--sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h2 className="h2 h2--sm" style={{ color: '#fff', margin: '0 0 8px' }}>
              {isDealerMarket(locale) ? t('dealerTitle') : t('directTitle')}
            </h2>
            <p style={{ color: '#fff', margin: 0, maxWidth: 460 }}>
              {isDealerMarket(locale) ? t('dealerBody') : t('directBody')}
            </p>
          </div>
          <ModalButton type="quote" source="contact_dealer" trackQuote className="btn btn--dark">
            {isDealerMarket(locale) ? t('dealerCta') : t('directCta')} <ArrowRight size={16} />
          </ModalButton>
        </div>
      </section>

      {/* Swiss Impressum — minimal, both parties named; legal wording to be checked by Michael. */}
      {swiss && (
        <section className="container" style={{ padding: 'clamp(28px,4vw,48px) 0' }}>
          <h2 style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 14px' }}>{t('impressumHeading')}</h2>
          <div className="ct-impressum" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-muted)' }}>
            <div style={{ border: '1px solid var(--border)', padding: '16px 18px' }}>
              <div style={{ fontWeight: 800, color: 'var(--black)' }}>{t('impressumManufacturer')}</div>
              <div>{brand.legalName}</div>
              <div>{contact.address.street}, {contact.address.postalCode} {contact.address.city}, {offices[0].countryName}</div>
              <div>{contact.email} · {contact.phoneDisplay}</div>
            </div>
            <div style={{ border: '1px solid var(--border)', padding: '16px 18px' }}>
              <div style={{ fontWeight: 800, color: 'var(--black)' }}>{t('impressumSwissParty')}</div>
              <div>{swissPartner.name}</div>
              <div>{swissPartner.street}, {swissPartner.postalCode} {swissPartner.city} {swissPartner.canton}, Schweiz</div>
              <div>{swissPartner.email} · {swissPartner.phoneDisplay}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-faint)', margin: '12px 0 0' }}>{t('impressumNote')}</p>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) {
          .qc-grid { grid-template-columns: 1fr !important; }
          .ct-grid { grid-template-columns: 1fr !important; }
          .ct-swiss { grid-template-columns: 1fr !important; }
          .ct-impressum { grid-template-columns: 1fr !important; }
          .off-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .off-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </>
  );
}
