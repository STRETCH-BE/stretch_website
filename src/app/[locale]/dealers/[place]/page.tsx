// DEALERS — place page (/dealers/[place]). Catches "spanplafond <stad>" /
// "plafond tendu <ville>" / "Spanndecke <Stadt>" / "sufit napinany <miasto>"
// searches. Two variants from src/lib/dealers.ts: dealer card(s) for served
// areas, or the "become our dealer in <place>" recruitment variant. All copy =
// template strings in the `dealersPage` namespace with {place}/{province}
// slots — adding a place needs no new keys.
//
// Per-market audit (2 Sep 2026):
//  T5 — every Belgian and Luxembourg page carries the BELGIAN company identity
//       (legal entity, Beveren-Waas production, VAT once set) and emits the
//       Belgian LocalBusiness node, so a Walloon reader on stretchplafond.fr
//       sees a Belgian manufacturer, not a French-looking one. French cities
//       get their own block without the Belgian address.
//  T7 — Częstochowa names the group's Polish plant and emits its branch node.
//  T6 — every city page links the price calculator ("what does it cost in …").
//  CH — Switzerland & Liechtenstein (2 Sep 2026): QuinLay AG is a REAL dealer
//       on every Swiss place: contact block (showroom, phone, e-mail, services,
//       drive time from Rickenbach) + its LocalBusiness node; Vaduz names
//       Liechtenstein; no price line (pricesPublished).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Calculator, Car, Factory, Mail, MapPin, Phone } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { brand, contact, offices, siteUrl, swissPartner } from '@/lib/site-config';
import { localeBase, buildAlternates, apiBase } from '@/lib/seo';
import { breadcrumbSchema, localBusinessSchema, branchLocalBusinessSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import {
  getDealerPlace,
  dealerPlaceSlugs,
  placeDealers,
  nearbyPlaces,
  getDealerPlace as getPlace,
  dealerMarkets,
  isDealerMarket,
  isBelgianPlace,
  placeEntity,
  regionLabelKeys,
} from '@/lib/dealers';
import { getProjectBySlug, blogPostsFor, blogHref } from '@/lib/content';
import { pricesPublished } from '@/lib/currency';
import { priceGuideCh, priceGuideChReady } from '@/lib/price-guide-ch';
import { localizeProject, type ProjectMessages } from '@/lib/localize-content';

// Every valid (locale, place) pair is enumerated below. dynamicParams=false →
// anything else (unknown slug, or a non-dealer-market locale like `us`) 404s
// immediately instead of rendering on demand, which trips next-intl's
// headers() lookup into a 500 (same pattern as the blog slug route).
export const dynamicParams = false;

export function generateStaticParams() {
  // Market-restricted (N2): place pages are only built for dealer markets.
  return dealerMarkets.flatMap((locale) => dealerPlaceSlugs.map((place) => ({ locale, place })));
}

export async function generateMetadata({ params }: { params: { locale: string; place: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {};
  if (!isDealerMarket(params.locale as Locale)) return {};
  const place = getDealerPlace(params.place);
  if (!place) return {};
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'dealersPage' });
  const hasDealers = placeDealers(place).length > 0;
  const placeLabel = place.country === 'LI' ? `${place.name} / ${t('liechtenstein')}` : place.name;
  const title = hasDealers ? t('metaTitleDealer', { place: placeLabel }) : t('metaTitleRecruit', { place: placeLabel });
  const description = hasDealers ? t('metaDescDealer', { place: placeLabel }) : t('metaDescRecruit', { place: placeLabel });
  const route = `/dealers/${place.slug}`;
  const ogImg = `${apiBase(locale)}/api/og`;
  // A locale may carry the brand in its own title pattern ("… | STRETCH × QuinLay AG").
  const fullTitle = title.includes(`| ${brand.name}`) ? title : `${title} | ${brand.name}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: buildAlternates(locale, route, dealerMarkets),
    openGraph: {
      type: 'website', siteName: brand.name, title, description, url: `${localeBase(locale)}${route}`,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImg] },
  };
}

export default async function DealerPlacePage({ params }: { params: { locale: string; place: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);
  // Market-restricted (N2): no dealer network on this locale → 404.
  if (!isDealerMarket(locale)) notFound();
  const place = getDealerPlace(params.place);
  if (!place) notFound();

  const t = await getTranslations('dealersPage');
  const tp = await getTranslations('productPage');
  const tpr = await getTranslations('projects');
  const found = placeDealers(place!);
  const hasDealers = found.length > 0;
  // Vaduz belongs to Liechtenstein: the H1 and every {place} slot say so.
  const placeLabel = place!.country === 'LI' ? `${place!.name} / ${t('liechtenstein')}` : place!.name;
  const near = nearbyPlaces(place!);
  const province = place!.province ? getPlace(place!.province) : undefined;
  const regionLabel = t(regionLabelKeys[place!.region]);
  const projects = (place!.projects ?? [])
    .map((slug) => {
      const base = getProjectBySlug(slug);
      if (!base) return undefined;
      return localizeProject(base, tpr.has(`${slug}.title`) ? (tpr.raw(slug) as ProjectMessages) : undefined);
    })
    .filter(Boolean);

  // Identity (T5/T7): which entity speaks on this page.
  const entity = placeEntity(place!);
  const belgian = isBelgianPlace(place!) || place!.region === 'luxembourg';
  // Swiss places (any locale): the contracting party is QuinLay AG, so the
  // identity card names them — never the Belgian office line.
  const swissPlace = place!.region === 'switzerland';
  const plOffice = offices.find((o) => o.country === 'PL');
  // The Belgian grants/VAT article exists on be/nl/fr/en/uk only — link it
  // where it exists (it is the most Belgium-specific proof on the site).
  const vatPost = belgian ? blogPostsFor(locale).find((p) => p.slug === 'spanplafond-premie-btw') : undefined;

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumbDealers'), url: `${localeBase(locale)}/dealers` },
    { name: place!.name, url: `${localeBase(locale)}/dealers/${place!.slug}` },
  ]);
  // LocalBusiness: the Belgian manufacturer on Belgian/Luxembourg pages, the
  // Częstochowa plant on Polish pages. French/German/Austrian pages emit no
  // local entity node — there is no local address to claim.
  const localBusiness = belgian ? localBusinessSchema() : entity === 'pl' ? branchLocalBusinessSchema('PL') : undefined;
  // Dealers with a full contact block (QuinLay AG) get their own LocalBusiness
  // node: the showroom is a real, locatable local entity.
  const dealerNodes = found
    .filter((d) => d.contact)
    .map((d) => {
      const c = d.contact!;
      const m = (c.addressLines[1] ?? '').match(/^(\S+)\s+(.+)$/);
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#dealer-${d.id}`,
        name: d.name,
        url: d.url,
        telephone: c.phone,
        email: c.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: c.addressLines[0],
          ...(m ? { postalCode: m[1], addressLocality: m[2] } : { addressLocality: c.addressLines[1] }),
          addressCountry: 'CH',
        },
        parentOrganization: { '@id': `${siteUrl}/#organization` },
      };
    });

  return (
    <>
      <JsonLd data={crumbs} />
      {localBusiness && <JsonLd data={localBusiness} />}
      {dealerNodes.map((n) => (
        <JsonLd key={n['@id']} data={n} />
      ))}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container" style={{ paddingTop: 'clamp(20px,3vw,30px)' }}>
        <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, fontSize: 12.5, color: 'var(--text-faint-2)' }}>
          <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>{tp('home')}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/dealers" style={{ color: 'inherit', textDecoration: 'none' }}>{t('crumbDealers')}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" style={{ color: 'var(--text-muted)' }}>{placeLabel}</li>
        </ol>
      </nav>

      {/* Head */}
      <section className="container" style={{ padding: 'clamp(22px,3vw,36px) 0 clamp(26px,3vw,40px)' }}>
        <Eyebrow num="01" label={`${t('eyebrow')} · ${regionLabel}`} />
        <h1 className="h1" style={{ fontSize: 'clamp(34px,5vw,72px)', margin: '0 0 clamp(14px,2vw,20px)' }}>
          {t('h1', { place: placeLabel })}<span className="accent">.</span>
        </h1>
        <p className="lead" style={{ maxWidth: 680, margin: '0 0 18px' }}>
          {hasDealers ? t('introDealer', { place: placeLabel }) : t('introRecruit', { place: placeLabel })}
        </p>
        {typeof place!.driveMinutes === 'number' && (
          <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 14px' }}>
            <Car size={15} style={{ color: 'var(--red)' }} /> {t('driveTime', { minutes: place!.driveMinutes })}
          </p>
        )}
        {/* "What does a stretch ceiling cost in <place>?" → the calculator (T6);
            on de-CH the Swiss CHF price guide instead, once QuinLay's ranges are in. */}
        {pricesPublished(locale) && (
          <Link href="/price-calculator" className="lnk" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 14.5 }}>
            <Calculator size={16} style={{ color: 'var(--red)' }} /> {t('costLine', { place: placeLabel })} →
          </Link>
        )}
        {locale === 'ch' && priceGuideChReady && (
          <Link href={priceGuideCh.route} className="lnk" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 14.5 }}>
            <Calculator size={16} style={{ color: 'var(--red)' }} /> {t('costLine', { place: placeLabel })} →
          </Link>
        )}
      </section>

      {/* Factory (Częstochowa) — the plant is the story (T7) */}
      {place!.factory && plOffice && (
        <section className="container" style={{ paddingBottom: 'clamp(36px,4vw,56px)' }}>
          <div style={{ border: '1.5px solid var(--black)', background: '#fff', padding: 'clamp(24px,3vw,40px)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(18px,2.4vw,28px)', alignItems: 'start' }}>
            <span style={{ display: 'inline-flex', width: 52, height: 52, background: 'var(--black)', color: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Factory size={24} />
            </span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>{t('factoryKicker')}</div>
              <h2 className="h2 h2--sm" style={{ margin: '0 0 10px' }}>{t('factoryTitle')}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 12px', maxWidth: 640 }}>{t('factoryBody')}</p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} style={{ color: 'var(--red)' }} /> {plOffice.name} · {plOffice.addressLines.join(', ')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Link href="/installer-training" className="btn btn--primary btn--sm">{t('factoryTraining')} <ArrowRight size={14} /></Link>
                {plOffice.url && (
                  <a href={plOffice.url} className="btn btn--ghost btn--sm">{t('factoryCta')} <ArrowUpRight size={14} /></a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dealer cards OR recruitment band */}
      <section className="container" style={{ paddingBottom: 'clamp(36px,4vw,56px)' }}>
        {hasDealers ? (
          <div className="dlr-grid">
            {found.map((d) => (
              <article key={d.id} className="dlr-card">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>
                  <BadgeCheck size={15} /> {t('dealerBadge')}
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(21px,2.2vw,27px)', letterSpacing: '-.01em', textTransform: 'uppercase', margin: '0 0 6px' }}>{d.name}</h2>
                <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', margin: '0 0 18px' }}>
                  <MapPin size={14} /> {d.contact ? `${d.contact.addressLines.join(', ')} · ${placeLabel}` : placeLabel}
                </p>
                {d.contact && (
                  /* General representative (QuinLay AG): role, showroom, phone, e-mail, services. */
                  <div style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.7, color: 'var(--text-body)' }}>
                    {d.contact.roleKey && <div style={{ fontWeight: 700, color: 'var(--black)' }}>{t(d.contact.roleKey)}</div>}
                    {d.contact.showroom && <div>{t('showroomLabel')}: {d.contact.addressLines.join(', ')}</div>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginTop: 4 }}>
                      <a href={`tel:${d.contact.phone}`} className="lnk" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}><Phone size={14} style={{ color: 'var(--red)' }} /> {d.contact.phoneDisplay}</a>
                      <a href={`mailto:${d.contact.email}`} className="lnk" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}><Mail size={14} style={{ color: 'var(--red)' }} /> {d.contact.email}</a>
                    </div>
                    {d.contact.serviceKeys && d.contact.serviceKeys.length > 0 && (
                      <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {d.contact.serviceKeys.map((k) => (
                          <li key={k} style={{ fontSize: 12.5, fontWeight: 700, border: '1px solid var(--border-input)', padding: '5px 10px' }}>{t(k)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {d.contact?.showroom ? (
                    <ModalButton type="quote" source={`dealers_${place!.slug}`} trackQuote className="btn btn--primary btn--sm">
                      {t('showroomCta')} <ArrowRight size={14} />
                    </ModalButton>
                  ) : (
                    <ModalButton type="quote" source={`dealers_${place!.slug}`} trackQuote className="btn btn--primary btn--sm">
                      {t('quoteCta')} <ArrowRight size={14} />
                    </ModalButton>
                  )}
                  {d.contact?.showroom && (
                    <ModalButton type="quote" source={`dealers_${place!.slug}`} trackQuote className="btn btn--ghost btn--sm">
                      {t('quoteCta')}
                    </ModalButton>
                  )}
                  <a href={d.url} target="_blank" rel="noopener" className="btn btn--ghost btn--sm">
                    {t('visitSite')} <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ background: 'var(--black)', padding: 'clamp(26px,3.6vw,46px)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 10 }}>{t('recruitChip')}</div>
            <h2 className="h2 h2--sm" style={{ color: '#fff', fontSize: 'clamp(22px,2.8vw,34px)', margin: '0 0 10px' }}>{t('recruitTitle', { place: placeLabel })}</h2>
            <p style={{ color: 'var(--on-dark-muted)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 640 }}>{t('recruitBody', { place: placeLabel })}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/partners" className="btn btn--primary">{t('recruitCta')} <ArrowRight size={16} /></Link>
              <ModalButton type="quote" source={`dealers_${place!.slug}`} trackQuote className="btn" style={{ background: '#fff', color: 'var(--black)' }}>
                {t('quoteCta')}
              </ModalButton>
            </div>
          </div>
        )}
      </section>

      {/* Identity — who is speaking on this page (T5/T7) */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="dlr-identity">
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>
              {entity === 'pl' ? t('identityPlKicker') : belgian ? t('identityBeKicker') : t('identityDirectKicker')}
            </div>
            <h2 className="h2 h2--sm" style={{ margin: '0 0 10px' }}>
              {entity === 'pl' ? t('identityPlTitle') : belgian ? t('identityBeTitle') : t('identityDirectTitle', { place: placeLabel })}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-body)', margin: 0, maxWidth: 640 }}>
              {entity === 'pl' ? t('identityPlBody', { place: placeLabel }) : belgian ? t('identityBeBody', { place: placeLabel }) : t('identityDirectBody', { place: placeLabel })}
            </p>
          </div>
          <div className="dlr-identity__card">
            {entity === 'pl' && plOffice ? (
              <>
                <div className="dlr-identity__name">{plOffice.name}</div>
                <div>{plOffice.addressLines.join(', ')}</div>
                <div>{plOffice.countryName}</div>
                <div className="dlr-identity__name" style={{ marginTop: 12 }}>{brand.legalName}</div>
                <div>{contact.address.street}, {contact.address.postalCode} {contact.address.city}</div>
                <div>{offices[0].countryName}</div>
              </>
            ) : belgian ? (
              <>
                <div className="dlr-identity__name">{brand.legalName}</div>
                <div>{contact.address.street}</div>
                <div>{contact.address.postalCode} {contact.address.city} · {offices[0].countryName}</div>
                {brand.vatNumber && <div style={{ marginTop: 6 }}>{t('identityVat')} {brand.vatNumber}</div>}
                <a href={contact.phoneHref} className="lnk" style={{ display: 'inline-block', marginTop: 10, fontWeight: 700 }}>{contact.phoneDisplay}</a>
                {vatPost && (
                  <Link href={blogHref(vatPost, locale)} className="lnk" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontWeight: 700, fontSize: 13.5 }}>
                    {t('identityVatArticle')} <ArrowRight size={14} style={{ color: 'var(--red)' }} />
                  </Link>
                )}
              </>
            ) : swissPlace ? (
              <>
                <div className="dlr-identity__name">{swissPartner.name}</div>
                <div>{t('generalAgent')}</div>
                <div>{swissPartner.street}, {swissPartner.postalCode} {swissPartner.city}</div>
                <a href={swissPartner.phoneHref} className="lnk" style={{ display: 'inline-block', marginTop: 10, fontWeight: 700 }}>{swissPartner.phoneDisplay}</a>
              </>
            ) : (
              <>
                <div className="dlr-identity__name">{brand.name}</div>
                <div>{t('identityDirectCard')}</div>
                <a href={contact.phoneHref} className="lnk" style={{ display: 'inline-block', marginTop: 10, fontWeight: 700 }}>{contact.phoneDisplay}</a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why via a dealer / direct */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('whyTitle')}</h2>
        <div className="dlr-why">
          {[entity === 'pl' ? t('why1Pl') : t('why1'), t('why2'), t('why3')].map((w, i) => (
            <div key={i} className="dlr-why__item">
              <span className="dlr-why__num">0{i + 1}</span>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>{w}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Local projects */}
      {projects.length > 0 && (
        <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
          <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('projectsHeading', { place: placeLabel })}</h2>
          <div className="dlr-proj">
            {projects.map((p) => (
              <Link key={p!.slug} href={`/inspiration/${p!.slug}`} className="dlr-proj__card zoom-wrap">
                <div style={{ overflow: 'hidden' }}>
                  <Placeholder label={p!.title} src={p!.image} alt={p!.title} sizes="(max-width: 860px) 100vw, 33vw" light ratio="16/10" className="zoom-img" />
                </div>
                <div style={{ padding: '14px 2px 0' }}>
                  <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-.01em' }}>{p!.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Nearby + back */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,84px)' }}>
        {near.length > 0 && (
          <>
            <h2 style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 12px' }}>
              {place!.kind === 'province'
                ? t('nearbyHeadingProvince', { place: placeLabel })
                : province
                  ? t('nearbyHeading', { province: province.name })
                  : t('nearbyHeadingRegion', { region: regionLabel })}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              {province && place!.kind === 'city' && (
                <Link href={`/dealers/${province.slug}`} className="dlr-chip dlr-chip--dark">{province.name}</Link>
              )}
              {near.map((n) => (
                <Link key={n.slug} href={`/dealers/${n.slug}`} className="dlr-chip">{n.name}</Link>
              ))}
            </div>
          </>
        )}
        <Link href="/dealers" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> {t('backToAll')}
        </Link>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .dlr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(16px,2vw,24px); }
        .dlr-card { border: 1.5px solid var(--black); background: #fff; padding: clamp(20px,2.6vw,32px); }
        .dlr-identity { display: grid; grid-template-columns: 1.3fr .9fr; gap: clamp(18px,3vw,40px); border: 1px solid var(--border); background: var(--surface); padding: clamp(22px,3vw,36px); }
        .dlr-identity__card { background: #fff; border: 1px solid var(--border); padding: clamp(18px,2.2vw,26px); font-size: 14px; line-height: 1.65; color: var(--text-muted); align-self: start; }
        .dlr-identity__name { font-family: var(--font-display); font-weight: 800; font-size: 16px; letter-spacing: -.01em; color: var(--black); margin-bottom: 4px; }
        .dlr-why { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .dlr-why__item { border: 1px solid var(--border); background: var(--surface); padding: clamp(18px,2vw,24px); position: relative; }
        .dlr-why__num { display: block; font-size: 11px; font-weight: 800; letter-spacing: .14em; color: var(--red); margin-bottom: 8px; }
        .dlr-proj { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dlr-proj__card { display: block; text-decoration: none; color: inherit; }
        .dlr-chip { display: inline-flex; border: 1px solid var(--border-input); padding: 8px 14px; font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-decoration: none; color: var(--text-muted); background: #fff; }
        .dlr-chip:hover { border-color: var(--black); color: var(--black); }
        .dlr-chip--dark { background: var(--black); color: #fff; border-color: var(--black); }
        .dlr-chip--dark:hover { color: #fff; }
        @media (max-width: 860px) { .dlr-grid, .dlr-why, .dlr-proj, .dlr-identity { grid-template-columns: 1fr; } }
        @media (min-width: 861px) and (max-width: 1100px) { .dlr-proj { grid-template-columns: 1fr 1fr; } }
      ` }} />
    </>
  );
}
