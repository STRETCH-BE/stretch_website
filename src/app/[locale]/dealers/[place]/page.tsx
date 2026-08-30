// DEALERS — place page (/dealers/[place]). Catches "spanplafond <stad>" /
// "plafond tendu <ville>" searches. Two variants from src/lib/dealers.ts:
// dealer card(s) for served areas, or the "become our dealer in <place>"
// recruitment variant. All copy = template strings in the `dealersPage`
// namespace with {place}/{province} slots — adding a place needs no new keys.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, MapPin } from 'lucide-react';
import { isValidLocale, locales, type Locale } from '@/i18n/config';
import { brand } from '@/lib/site-config';
import { localeBase, buildAlternates } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import { getDealerPlace, dealerPlaceSlugs, placeDealers, nearbyPlaces, getDealerPlace as getPlace, dealerMarkets, isDealerMarket } from '@/lib/dealers';
import { getProjectBySlug } from '@/lib/content';
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
  const title = hasDealers ? t('metaTitleDealer', { place: place.name }) : t('metaTitleRecruit', { place: place.name });
  const description = hasDealers ? t('metaDescDealer', { place: place.name }) : t('metaDescRecruit', { place: place.name });
  const route = `/dealers/${place.slug}`;
  const ogImg = `${localeBase(locale)}/api/og`;
  return {
    title: { absolute: `${title} | ${brand.name}` },
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
  const near = nearbyPlaces(place!);
  const province = place!.province ? getPlace(place!.province) : undefined;
  const projects = (place!.projects ?? [])
    .map((slug) => {
      const base = getProjectBySlug(slug);
      if (!base) return undefined;
      return localizeProject(base, tpr.has(`${slug}.title`) ? (tpr.raw(slug) as ProjectMessages) : undefined);
    })
    .filter(Boolean);

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('crumbDealers'), url: `${localeBase(locale)}/dealers` },
    { name: place!.name, url: `${localeBase(locale)}/dealers/${place!.slug}` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container" style={{ paddingTop: 'clamp(20px,3vw,30px)' }}>
        <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, fontSize: 12.5, color: 'var(--text-faint-2)' }}>
          <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>{tp('home')}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/dealers" style={{ color: 'inherit', textDecoration: 'none' }}>{t('crumbDealers')}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" style={{ color: 'var(--text-muted)' }}>{place!.name}</li>
        </ol>
      </nav>

      {/* Head */}
      <section className="container" style={{ padding: 'clamp(22px,3vw,36px) 0 clamp(26px,3vw,40px)' }}>
        <Eyebrow num="01" label={t('eyebrow')} />
        <h1 className="h1" style={{ fontSize: 'clamp(34px,5vw,72px)', margin: '0 0 clamp(14px,2vw,20px)' }}>
          {t('h1', { place: place!.name })}<span className="accent">.</span>
        </h1>
        <p className="lead" style={{ maxWidth: 680, margin: 0 }}>
          {hasDealers ? t('introDealer', { place: place!.name }) : t('introRecruit', { place: place!.name })}
        </p>
      </section>

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
                  <MapPin size={14} /> {place!.name}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <ModalButton type="quote" source={`dealers_${place!.slug}`} trackQuote className="btn btn--primary btn--sm">
                    {t('quoteCta')} <ArrowRight size={14} />
                  </ModalButton>
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
            <h2 className="h2 h2--sm" style={{ color: '#fff', fontSize: 'clamp(22px,2.8vw,34px)', margin: '0 0 10px' }}>{t('recruitTitle', { place: place!.name })}</h2>
            <p style={{ color: 'var(--on-dark-muted)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 640 }}>{t('recruitBody', { place: place!.name })}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/partners" className="btn btn--primary">{t('recruitCta')} <ArrowRight size={16} /></Link>
              <ModalButton type="quote" source={`dealers_${place!.slug}`} trackQuote className="btn" style={{ background: '#fff', color: 'var(--black)' }}>
                {t('quoteCta')}
              </ModalButton>
            </div>
          </div>
        )}
      </section>

      {/* Why via a dealer / direct */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('whyTitle')}</h2>
        <div className="dlr-why">
          {[t('why1'), t('why2'), t('why3')].map((w, i) => (
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
          <h2 className="h2 h2--sm" style={{ margin: '0 0 18px' }}>{t('projectsHeading', { place: place!.name })}</h2>
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
              {place!.kind === 'province' ? t('nearbyHeadingProvince', { place: place!.name }) : province ? t('nearbyHeading', { province: province.name }) : t('nearbyHeadingProvince', { place: place!.name })}
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
        .dlr-why { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .dlr-why__item { border: 1px solid var(--border); background: var(--surface); padding: clamp(18px,2vw,24px); position: relative; }
        .dlr-why__num { display: block; font-size: 11px; font-weight: 800; letter-spacing: .14em; color: var(--red); margin-bottom: 8px; }
        .dlr-proj { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dlr-proj__card { display: block; text-decoration: none; color: inherit; }
        .dlr-chip { display: inline-flex; border: 1px solid var(--border-input); padding: 8px 14px; font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-decoration: none; color: var(--text-muted); background: #fff; }
        .dlr-chip:hover { border-color: var(--black); color: var(--black); }
        .dlr-chip--dark { background: var(--black); color: #fff; border-color: var(--black); }
        .dlr-chip--dark:hover { color: #fff; }
        @media (max-width: 860px) { .dlr-grid, .dlr-why, .dlr-proj { grid-template-columns: 1fr; } }
        @media (min-width: 861px) and (max-width: 1100px) { .dlr-proj { grid-template-columns: 1fr 1fr; } }
      ` }} />
    </>
  );
}
