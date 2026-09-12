// ============================================================================
// ACOUSTICS GUIDE — shared route module for /akoestiek (be, nl), /acoustique
// (fr) and /akustik (de). Each locale has its OWN written content module
// (src/lib/acoustics/<locale>.ts — norms, vocabulary and examples of that
// market, never a translation); a locale without one has no page at all
// (dynamicParams=false in each thin route → 404), no nav entry, no sitemap
// URL and no hreflang alternate. The slug per locale lives in
// src/lib/page-slugs.json, which redirects.mjs reads too.
//
// The Sabine worked example is COMPUTED here from the module's room, so the
// printed arithmetic can never disagree with the prose. Re-Sound links appear
// in ONE section only ("what the ceiling cannot fix") — see Segment.
// ============================================================================
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { brand, resoundUrlFor } from '@/lib/site-config';
import { buildAlternates, buildCanonical, buildOgLocales, apiBase, localeBase } from '@/lib/seo';
import { breadcrumbSchema, faqPageSchema } from '@/lib/structured-data';
import { acousticsSlugs, acousticsMarkets, acousticsHref, ACOUSTIC_PRODUCT_ROUTE } from '@/lib/page-slugs';
import { getAcoustics, type AcousticsContent, type Segment } from '@/lib/acoustics';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import InlineLeadForm from '@/components/sections/InlineLeadForm';

const SOURCE = 'acoustics_page';
const IMAGE = '/images/products/acoustic-stretch-ceiling-absorbtion.jpg';

/** The locales a route directory serves — the owners of its slug only. */
export function acousticsParams(slug: string): { locale: Locale }[] {
  return acousticsMarkets.filter((l) => acousticsSlugs[l] === slug).map((locale) => ({ locale }));
}

function resolve(localeParam: string, slug: string): Locale | null {
  if (!isValidLocale(localeParam)) return null;
  const locale = localeParam as Locale;
  return acousticsSlugs[locale] === slug ? locale : null;
}

export function acousticsMetadata(localeParam: string, slug: string): Metadata {
  const locale = resolve(localeParam, slug);
  const c = locale ? getAcoustics(locale) : undefined;
  if (!locale || !c) return {};
  const route = acousticsHref(locale);
  const { ogLocale, alternate } = buildOgLocales(locale, acousticsMarkets);
  const ogImg = `${apiBase(locale)}/api/og`;
  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    robots: { index: true, follow: true },
    // Every alternate names THAT locale's own slug (routeFor), restricted to
    // the markets that have a written page.
    alternates: buildAlternates(locale, route, acousticsMarkets, (l) => acousticsHref(l)),
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title: c.meta.title,
      description: c.meta.description,
      url: buildCanonical(locale, route),
      locale: ogLocale,
      alternateLocale: alternate,
      images: [{ url: ogImg, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: { card: 'summary_large_image', title: c.meta.title, description: c.meta.description, images: [ogImg] },
  };
}

// --- number formatting: comma decimals on every market this page exists on ---
const dec = (n: number, d: number) => n.toFixed(d).replace('.', ',');

/** Section heading with the house accent: "…?" keeps its question mark, everything else gets the red full stop. */
function H2({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const q = /\?\s*$/.test(text);
  const base = text.replace(/[?.]\s*$/, '');
  return (
    <h2 className={className ?? 'h2 h2--sm'} style={style}>
      {base}<span className="accent">{q ? '?' : '.'}</span>
    </h2>
  );
}
const num = (n: number) => (Number.isInteger(n) ? String(n) : dec(n, 1));

function Segments({ parts, locale }: { parts: Segment[]; locale: Locale }) {
  return (
    <>
      {parts.map((s, i) =>
        s.href ? (
          s.href.startsWith('resound:') ? (
            // Sister-company link: "resound:<range>" → that range's page in this
            // locale's Re-Sound language (else the locale root). A normal followed
            // anchor, no nofollow/sponsored.
            <a key={i} href={resoundUrlFor(locale, s.href.slice('resound:'.length))} className="lnk">{s.text}</a>
          ) : /^https?:\/\//.test(s.href) ? (
            <a key={i} href={s.href} className="lnk">{s.text}</a>
          ) : (
            <Link key={i} href={s.href} className="lnk">{s.text}</Link>
          )
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

/** Sabine worked example — every number derived from the module's room. */
function SabineExample({ s, locale }: { s: AcousticsContent['sabine']; locale: Locale }) {
  const { room: r, labels: L } = s;
  const V = r.length * r.width * r.height;
  const floorArea = r.length * r.width;
  const ceilingArea = floorArea;
  const wallArea = 2 * (r.length + r.width) * r.height;
  const rows = [
    { label: L.floor, before: r.floor.material, after: r.floor.material, S: floorArea, aB: r.floor.alpha, aA: r.floor.alpha },
    { label: L.walls, before: r.walls.material, after: r.walls.material, S: wallArea, aB: r.walls.alpha, aA: r.walls.alpha },
    { label: L.ceiling, before: r.ceilingBefore.material, after: r.ceilingAfter.material, S: ceilingArea, aB: r.ceilingBefore.alpha, aA: r.ceilingAfter.alpha },
  ];
  const aBefore = rows.reduce((t, x) => t + x.S * x.aB, 0);
  const aAfter = rows.reduce((t, x) => t + x.S * x.aA, 0);
  const tBefore = (0.161 * V) / aBefore;
  const tAfter = (0.161 * V) / aAfter;
  // DIN 18041 (2016) A3 target — German market only: T_soll = 0,32 · lg(V) − 0,17 s.
  const din = locale === 'de' && L.dinTarget ? 0.32 * Math.log10(V) - 0.17 : null;
  const conclusion = s.conclusion.replace('{tBefore}', `${dec(tBefore, 2)} s`).replace('{tAfter}', `${dec(tAfter, 2)} s`);
  const cell = (S: number, a: number) => `${dec(a, 2)} × ${num(S)} = ${dec(S * a, 2)}`;

  return (
    <section className="container section ac-sabine">
      <H2 text={s.heading} style={{ margin: '0 0 14px' }} />
      <p style={{ maxWidth: 760, fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 22px' }}>{s.intro}</p>
      <div className="ac-sheet">
        <p className="ac-line ac-line--strong">{r.name}</p>
        <p className="ac-line">{L.volume}: V = {num(r.length)} × {num(r.width)} × {num(r.height)} = <strong>{num(V)} m³</strong></p>
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>{L.surface}</th>
                <th>{L.area}</th>
                <th>{L.alpha} × m² = {L.absorption} · {L.before}</th>
                <th>{L.alpha} × m² = {L.absorption} · {L.after}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.label ?? x.before}>
                  <td>
                    {x.label ? <strong>{x.label}</strong> : null}
                    <span className="ac-mat">{x.before === x.after ? x.before : `${x.before} → ${x.after}`}</span>
                  </td>
                  <td>{num(x.S)} m²</td>
                  <td>{cell(x.S, x.aB)}</td>
                  <td>{cell(x.S, x.aA)}</td>
                </tr>
              ))}
              <tr className="ac-total">
                <td>{L.total}</td>
                <td />
                <td>{rows.map((x) => dec(x.S * x.aB, 2)).join(' + ')} = <strong>{dec(aBefore, 2)} m²</strong></td>
                <td>{rows.map((x) => dec(x.S * x.aA, 2)).join(' + ')} = <strong>{dec(aAfter, 2)} m²</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="ac-line">{L.formulaNote}</p>
        <p className="ac-line">{L.reverb} · {L.before}: T = 0,161 × {num(V)} / {dec(aBefore, 2)} = <strong>{dec(tBefore, 2)} s</strong></p>
        <p className="ac-line">{L.reverb} · {L.after}: T = 0,161 × {num(V)} / {dec(aAfter, 2)} = <strong>{dec(tAfter, 2)} s</strong></p>
        {din !== null && L.dinTarget && (
          <p className="ac-line">{L.dinTarget}: T = 0,32 × lg({num(V)}) − 0,17 = <strong>{dec(din, 2)} s</strong></p>
        )}
      </div>
      <p style={{ maxWidth: 760, fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '22px 0 0' }}>{conclusion}</p>
    </section>
  );
}

export async function AcousticsView({ localeParam, slug }: { localeParam: string; slug: string }) {
  const locale = resolve(localeParam, slug);
  const c = locale ? getAcoustics(locale) : undefined;
  if (!locale || !c) notFound();
  setRequestLocale(locale);
  const tp = await getTranslations('productPage');
  const route = acousticsHref(locale);

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: tp('solutions'), url: `${localeBase(locale)}/products` },
    { name: c.eyebrow, url: buildCanonical(locale, route) },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <JsonLd data={faqPageSchema(c.faqs)} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container" style={{ paddingTop: 'clamp(20px,3vw,30px)' }}>
        <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, fontSize: 12.5, color: 'var(--text-faint-2)' }}>
          <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>{tp('home')}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>{tp('solutions')}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" style={{ color: 'var(--text-muted)' }}>{c.eyebrow}</li>
        </ol>
      </nav>

      {/* HERO — H1 + the direct answer (ceiling first, then walls) */}
      <section className="container ac-hero" style={{ padding: 'clamp(22px,3vw,36px) 0 clamp(36px,4vw,56px)' }}>
        <Eyebrow num="01" label={c.eyebrow} />
        <h1 className="h1" style={{ fontSize: 'clamp(32px,4.6vw,62px)', margin: '0 0 clamp(16px,2vw,24px)', maxWidth: 940 }}>
          {c.h1.replace(/\s*\?$/, '')}<span className="accent">?</span>
        </h1>
        <div style={{ maxWidth: 760 }}>
          {c.answer.map((p, i) => (
            <p key={i} className={i === 0 ? 'lead' : undefined} style={{ margin: i === 0 ? '0 0 16px' : '0 0 14px', fontSize: i === 0 ? undefined : 15.5, lineHeight: 1.65, color: i === 0 ? undefined : 'var(--text-body)' }}>{p}</p>
          ))}
        </div>
      </section>

      {/* WHY hard rooms are loud */}
      <section className="container" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="ac-two">
          <H2 text={c.why.heading} style={{ margin: 0 }} />
          <div>
            {c.why.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 14px' }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* TARGETS by room type + the norms of this market */}
      <section className="section--dark">
        <div className="container section">
          <Eyebrow num="02" label={c.eyebrow} tone="dark" />
          <H2 text={c.targets.heading} className="h2" style={{ margin: '0 0 14px' }} />
          <p style={{ maxWidth: 760, fontSize: 15.5, lineHeight: 1.65, color: 'rgba(255,255,255,.78)', margin: '0 0 26px' }}>{c.targets.intro}</p>
          <div className="ac-table-wrap">
            <table className="ac-table ac-table--dark">
              <thead>
                <tr>
                  <th>{c.targets.cols.room}</th>
                  <th>{c.targets.cols.target}</th>
                  <th>{c.targets.cols.norm}</th>
                </tr>
              </thead>
              <tbody>
                {c.targets.rows.map((r) => (
                  <tr key={r.room}>
                    <td><strong>{r.room}</strong></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{r.target}</td>
                    <td>{r.norm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="ac-norms">
            {c.targets.norms.map((n) => (
              <div key={n.name}>
                <dt>{n.name}</dt>
                <dd>{n.what}</dd>
              </div>
            ))}
          </dl>
          <p className="ac-note">{c.targets.acousticianNote}</p>
        </div>
      </section>

      {/* THE ACOUSTIC STRETCH CEILING */}
      <section className="container section ac-body">
        <div className="ac-two ac-two--media">
          <div>
            <Eyebrow num="03" label={c.eyebrow} />
            <H2 text={c.ceiling.heading} style={{ margin: '0 0 16px' }} />
            {c.ceiling.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 14px' }}>{p}</p>
            ))}
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 18px' }}>
              {c.ceiling.productLink.before}
              <Link href={ACOUSTIC_PRODUCT_ROUTE} className="lnk">{c.ceiling.productLink.anchor}</Link>
              {c.ceiling.productLink.after}
            </p>
            <ul className="ac-bullets">
              {c.ceiling.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <Link href={ACOUSTIC_PRODUCT_ROUTE} className="btn btn--ghost btn--sm" style={{ marginTop: 18 }}>
              {c.cta.productButton} <ArrowRight size={14} className="btn__arrow" />
            </Link>
          </div>
          <div className="ac-media">
            <Placeholder label={c.ceiling.heading} src={IMAGE} alt={c.ceiling.heading} sizes="(max-width: 860px) 100vw, 44vw" light ratio="4/3" />
          </div>
        </div>
      </section>

      {/* SABINE worked example */}
      <SabineExample s={c.sabine} locale={locale} />

      {/* WHAT THE CEILING CANNOT FIX — the only place a Re-Sound link belongs */}
      <section className="container ac-body" style={{ paddingBottom: 'clamp(40px,5vw,64px)' }}>
        <div className="ac-two">
          <H2 text={c.cannotFix.heading} style={{ margin: 0 }} />
          <div>
            {c.cannotFix.paragraphs.map((parts, i) => (
              <p key={i} style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 14px' }}>
                <Segments parts={parts} locale={locale} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* COMBINED project */}
      <section className="container" style={{ paddingBottom: 'clamp(48px,6vw,80px)' }}>
        <div className="ac-combined">
          <H2 text={c.combined.heading} style={{ margin: '0 0 14px' }} />
          {c.combined.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--text-body)', margin: '0 0 12px', maxWidth: 800 }}>{p}</p>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ paddingBottom: 'clamp(48px,6vw,80px)' }}>
        <div className="ac-faq">
          {c.faqs.map((f) => (
            <div key={f.q} style={{ border: '1px solid var(--border)', background: '#fff', padding: 'clamp(18px,2.2vw,26px)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-.01em', margin: '0 0 8px' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-body)', margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA → own quote form */}
      <section id="offerte" className="section--red">
        <div className="container section">
          <div className="ac-cta">
            <div>
              <Eyebrow num="04" label={c.eyebrow} tone="red" />
              <h2 className="h2" style={{ color: '#fff', margin: '0 0 18px' }}>{c.cta.heading.replace(/[?.]\s*$/, '')}<span style={{ color: 'var(--black)' }}>{/\?\s*$/.test(c.cta.heading) ? '?' : '.'}</span></h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#fff', margin: '0 0 22px', maxWidth: 520 }}>{c.cta.body}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <ModalButton type="quote" source={SOURCE} trackQuote className="btn btn--dark">
                  {c.cta.button} <ArrowRight size={16} />
                </ModalButton>
                <Link href={ACOUSTIC_PRODUCT_ROUTE} className="btn btn--ghost ac-btn-on-red">
                  {c.cta.productButton} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div style={{ background: '#fff', padding: 'clamp(26px,3vw,40px)', border: '1px solid var(--border)' }}>
              <InlineLeadForm type="quote" source={SOURCE} />
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .ac-body a.lnk, .ac-hero a.lnk { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.5px; }
        .ac-two { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(24px,4vw,64px); align-items: start; }
        .ac-two--media { grid-template-columns: 1.1fr .9fr; align-items: center; }
        .ac-media { max-width: 100%; }
        .ac-bullets { margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.6; color: var(--text-body); }
        .ac-bullets li { margin: 0 0 6px; }
        .ac-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .ac-table { width: 100%; border-collapse: collapse; font-size: 14.5px; line-height: 1.5; min-width: 560px; }
        .ac-table th { text-align: left; font-size: 11.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); padding: 10px 14px 10px 0; border-bottom: 1.5px solid var(--black); vertical-align: bottom; }
        .ac-table td { padding: 12px 14px 12px 0; border-bottom: 1px solid var(--border); vertical-align: top; color: var(--text-body); }
        .ac-table--dark { min-width: 0; }
        .ac-table--dark th { color: rgba(255,255,255,.65); border-bottom-color: rgba(255,255,255,.5); }
        .ac-table--dark td { color: rgba(255,255,255,.85); border-bottom-color: rgba(255,255,255,.14); }
        .ac-table--dark td strong { color: #fff; }
        .ac-mat { display: block; font-size: 13px; color: var(--text-muted); }
        .ac-total td { font-weight: 700; border-bottom: none; }
        .ac-norms { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 40px; margin: 28px 0 0; }
        .ac-norms dt { font-family: var(--font-display); font-weight: 800; font-size: 15px; color: #fff; margin: 0 0 3px; }
        .ac-norms dd { margin: 0; font-size: 14px; line-height: 1.55; color: rgba(255,255,255,.72); }
        .ac-note { margin: 26px 0 0; padding: 12px 16px; border-left: 3px solid var(--red-bright); background: rgba(255,255,255,.06); font-size: 14.5px; line-height: 1.55; color: #fff; max-width: 760px; }
        .ac-sheet { border: 1.5px solid var(--black); background: #fff; padding: clamp(16px,2.4vw,28px); }
        .ac-line { margin: 0 0 8px; font-size: 14.5px; line-height: 1.6; color: var(--text-body); }
        .ac-line--strong { font-family: var(--font-display); font-weight: 800; font-size: 17px; letter-spacing: -.01em; color: var(--black); margin-bottom: 10px; }
        .ac-sheet .ac-table { margin: 12px 0 16px; }
        .ac-combined { border: 1px solid var(--border); background: var(--surface); padding: clamp(20px,2.8vw,36px); }
        .ac-faq { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px,2vw,28px); }
        .ac-cta { display: grid; grid-template-columns: .9fr 1.1fr; gap: clamp(32px,4vw,64px); align-items: start; }
        .ac-btn-on-red { border-color: #fff; color: #fff; }
        .ac-btn-on-red:hover { background: #fff; color: var(--black); }
        @media (max-width: 860px) {
          .ac-two, .ac-two--media, .ac-norms, .ac-faq, .ac-cta { grid-template-columns: 1fr; }
          .ac-two--media .ac-media { order: -1; }
        }
        @media (max-width: 480px) {
          /* Long display words (German compounds, "nagalmraming") must never widen the page. */
          .ac-hero .h1, .ac-cta .h2, .ac-sabine .h2 { font-size: clamp(24px, 7.2vw, 32px); overflow-wrap: anywhere; }
          .h2 { overflow-wrap: anywhere; }
          /* Long button labels wrap instead of pushing the page wider than the phone. */
          .ac-body .btn, .ac-cta .btn { white-space: normal; text-align: left; max-width: 100%; }
        }
      ` }} />
    </>
  );
}
