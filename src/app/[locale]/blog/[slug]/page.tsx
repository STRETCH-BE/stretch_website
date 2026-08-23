// Blog post (/blog/[slug]). Renders the drafted article body, with Article +
// BreadcrumbList JSON-LD and per-post OG. Statically generated from blogSlugs.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, locales, type Locale } from '@/i18n/config';
import { siteUrl, brand } from '@/lib/site-config';
import { localeBase, buildAlternates, buildOgLocales } from '@/lib/seo';
import { localeFullCodes } from '@/i18n/config';
import { blogPostsFor } from '@/lib/content';
import { localizeBlogPost, type BlogPostMessages } from '@/lib/localize-content';
import { articleSchema, breadcrumbSchema } from '@/lib/structured-data';
import JsonLd from '@/components/seo/JsonLd';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';

// Every (locale, slug) pair is enumerated below — market-restricted posts only
// on their own locales. dynamicParams=false → anything else 404s immediately
// instead of rendering on demand (which trips next-intl's headers() lookup).
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => blogPostsFor(locale).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  if (!isValidLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const base = blogPostsFor(locale).find((p) => p.slug === params.slug);
  if (!base) return {};
  const tb = await getTranslations({ locale, namespace: 'blogPosts' });
  const post = localizeBlogPost(base, (tb.raw('posts') as Record<string, BlogPostMessages>)[base.slug]);

  const route = `/blog/${post.slug}`;
  // hreflang + OG alternates only span the locales the post exists on.
  const { ogLocale, alternate } = buildOgLocales(locale, base.markets);
  const ogImg = `${localeBase(locale)}/api/og/${post.slug}`;

  return {
    title: { absolute: `${post.title} | ${brand.name}` },
    description: post.excerpt,
    alternates: buildAlternates(locale, route, base.markets),
    openGraph: {
      type: 'article',
      siteName: brand.name,
      title: post.title,
      description: post.excerpt,
      url: `${localeBase(locale)}${route}`,
      locale: ogLocale,
      alternateLocale: alternate,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      images: [{ url: ogImg, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: [ogImg] },
  };
}

function fmtDate(iso: string, locale: Locale) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString(localeFullCodes[locale] ?? 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default async function BlogPostPage({ params }: { params: { locale: string; slug: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;
  const base = blogPostsFor(locale).find((p) => p.slug === params.slug);
  if (!base) notFound();
  const tb = await getTranslations('blogPosts');
  const tp = await getTranslations('productPage');
  const post = localizeBlogPost(base, (tb.raw('posts') as Record<string, BlogPostMessages>)[base.slug]);

  const crumbs = breadcrumbSchema([
    { name: tp('home'), url: `${localeBase(locale)}` },
    { name: tb('chrome.eyebrow'), url: `${localeBase(locale)}/blog` },
    { name: post.title, url: `${localeBase(locale)}/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleSchema(post, locale)} />
      <JsonLd data={crumbs} />

      <article className="container" style={{ padding: 'clamp(32px,4vw,56px) 0 clamp(50px,6vw,90px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link href="/blog" className="lnk" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 'clamp(24px,3vw,36px)' }}>
            <ArrowLeft size={15} /> {tb('chrome.backToBlog')}
          </Link>

          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 16 }}>
            {fmtDate(post.datePublished, locale)} · {tb('chrome.readMinutes', { count: post.readMinutes })}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px,4.6vw,58px)', lineHeight: 0.98, letterSpacing: '-.03em', textTransform: 'uppercase', margin: '0 0 24px', color: 'var(--black)' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 'clamp(17px,1.4vw,20px)', lineHeight: 1.55, color: 'var(--text-muted)', margin: '0 0 clamp(28px,3vw,40px)' }}>{post.excerpt}</p>
        </div>

        <div style={{ maxWidth: 920, margin: '0 auto clamp(32px,4vw,48px)' }}>
          <Placeholder
            label={post.title}
            src={post.image}
            alt={post.title}
            priority
            sizes="(max-width: 920px) 100vw, 920px"
            light
            ratio="16/8"
          />
        </div>

        <div className="prose" style={{ maxWidth: 760, margin: '0 auto' }}>
          {post.body.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul>
                  {section.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.links && section.links.length > 0 && (
                <p style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', fontWeight: 600 }}>
                  {section.links.map((link, i) =>
                    link.href.startsWith('https://') ? (
                      <a key={i} href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <Link key={i} href={link.href}>
                        {link.label}
                      </Link>
                    ),
                  )}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Inline CTA */}
        <div style={{ maxWidth: 760, margin: 'clamp(40px,5vw,64px) auto 0' }}>
          <div className="section--surface" style={{ padding: 'clamp(28px,3vw,44px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, border: '1px solid var(--border)' }}>
            <div>
              <h2 className="h2 h2--sm" style={{ margin: '0 0 6px' }}>{tb('chrome.ctaTitle')}</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{tb('chrome.ctaBody')}</p>
            </div>
            <ModalButton type="quote" source={`blog_${post.slug}`} trackQuote className="btn btn--primary">
              {tb('chrome.ctaBtn')} <ArrowRight size={16} />
            </ModalButton>
          </div>
        </div>
      </article>
    </>
  );
}
