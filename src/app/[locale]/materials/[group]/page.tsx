// MATERIALS — group page (/materials/[group]). Lists the item families of one
// product group; every item's button opens the QUOTE MODAL pre-filled with the
// product name (source materials_<group>). No prices, no checkout — the reply
// with price + delivery comes by email through the normal lead pipeline.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { isValidLocale, locales, type Locale } from '@/i18n/config';
import { brand } from '@/lib/site-config';
import { localeBase, buildAlternates } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import { AddToInquiryButton } from '@/components/materials/Inquiry';
import { getMaterialGroup, materialGroupSlugs } from '@/lib/materials';
import { localizeMaterialGroup, type MaterialGroupMessages } from '@/lib/localize-content';

export function generateStaticParams() {
  return locales.flatMap((locale) => materialGroupSlugs.map((group) => ({ locale, group })));
}

export async function generateMetadata({ params }: { params: { locale: string; group: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {};
  const base = getMaterialGroup(params.group);
  if (!base) return {};
  const locale = params.locale as Locale;
  const tData = await getTranslations({ locale, namespace: 'materialsData' });
  const g = localizeMaterialGroup(base, tData.has(`${base.slug}.name`) ? (tData.raw(base.slug) as MaterialGroupMessages) : undefined);
  const url = `${localeBase(locale)}/materials/${g.slug}`;
  const ogImg = `${localeBase(locale)}/api/og`;
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: buildAlternates(locale, `/materials/${g.slug}`),
    openGraph: {
      type: 'website', siteName: brand.name, title: g.metaTitle, description: g.metaDescription, url,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title: g.metaTitle, description: g.metaDescription, images: [ogImg] },
  };
}

export default async function MaterialGroupPage({ params }: { params: { locale: string; group: string } }) {
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  setRequestLocale(locale);
  const base = getMaterialGroup(params.group);
  if (!base) notFound();

  const t = await getTranslations('materials');
  const tData = await getTranslations('materialsData');
  const g = localizeMaterialGroup(base!, tData.has(`${base!.slug}.name`) ? (tData.raw(base!.slug) as MaterialGroupMessages) : undefined);
  const tp = await getTranslations('productPage');

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: t('title'), url: `${localeBase(locale)}/materials` },
    { name: g.name, url: `${localeBase(locale)}/materials/${g.slug}` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container" style={{ paddingTop: 'clamp(20px,3vw,30px)' }}>
        <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, fontSize: 12.5, color: 'var(--text-faint-2)' }}>
          <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>{tp('home')}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/materials" style={{ color: 'inherit', textDecoration: 'none' }}>{t('title')}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" style={{ color: 'var(--text-muted)' }}>{g.name}</li>
        </ol>
      </nav>

      {/* Head */}
      <section className="container" style={{ padding: 'clamp(22px,3vw,36px) 0 clamp(28px,3.4vw,44px)' }}>
        <Eyebrow num="01" label={g.eyebrow} />
        <h1 className="h1" style={{ fontSize: 'clamp(34px,5vw,72px)', margin: '0 0 clamp(14px,2vw,20px)' }}>
          {g.name}<span className="accent">.</span>
        </h1>
        <p className="lead" style={{ maxWidth: 640, margin: 0 }}>{g.intro}</p>
      </section>

      {/* Items */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="mtg-grid">
          {g.items.map((item) => (
            <article key={item.name} className="mtg-item">
              <Placeholder label={item.name} src={item.image} alt={item.name} sizes="(max-width: 860px) 100vw, 33vw" light ratio="4/3" />
              <div style={{ padding: '18px 0 0' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-.01em', margin: '0 0 7px' }}>{item.name}</h2>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)', margin: '0 0 14px' }}>{item.body}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <ModalButton type="quote" source={`materials_${g.slug}`} product={item.name} trackQuote className="btn btn--primary btn--sm">
                    {t('requestQuote')} <ArrowRight size={14} />
                  </ModalButton>
                  <AddToInquiryButton group={g.name} name={item.name} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* No-checkout note + dealer band */}
      <section className="container" style={{ paddingBottom: 'clamp(50px,6vw,84px)' }}>
        <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', padding: 'clamp(20px,2.6vw,30px)', marginBottom: 16, fontSize: 14, lineHeight: 1.65, color: 'var(--text-muted)', maxWidth: 860 }}>
          {t('noCheckout')}
        </div>
        <div style={{ background: 'var(--black)', padding: 'clamp(24px,3.4vw,40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <p style={{ color: 'var(--on-dark-muted)', fontSize: 14.5, lineHeight: 1.55, margin: 0, maxWidth: 560 }}>
            <strong style={{ color: '#fff' }}>{t('dealerTitle')}</strong> — {t('dealerBody')}
          </p>
          <Link href="/portal" className="btn btn--primary">{t('dealerCta')} <ArrowRight size={16} /></Link>
        </div>
        <div style={{ marginTop: 22 }}>
          <Link href="/materials" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> {t('backToAll')}
          </Link>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .mtg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(18px,2.4vw,28px); }
        .mtg-item { border: 1px solid var(--border); background: #fff; padding: clamp(16px,1.8vw,22px); display: flex; flex-direction: column; }
        .mtg-item > div { flex: 1; display: flex; flex-direction: column; }
        .mtg-item p { flex: 1; }
        @media (max-width: 900px) { .mtg-grid { grid-template-columns: 1fr; } }
        @media (min-width: 901px) and (max-width: 1150px) { .mtg-grid { grid-template-columns: 1fr 1fr; } }
      ` }} />
    </>
  );
}
