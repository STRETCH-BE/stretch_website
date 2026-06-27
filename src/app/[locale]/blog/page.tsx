// Blog index (/blog). Lists drafted educational posts. BreadcrumbList JSON-LD.
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { siteUrl } from '@/lib/site-config';
import { pageMetadata } from '@/lib/page-meta';
import { breadcrumbSchema } from '@/lib/structured-data';
import { blogPosts } from '@/lib/content';
import JsonLd from '@/components/seo/JsonLd';
import Eyebrow from '@/components/ui/Eyebrow';
import Placeholder from '@/components/ui/Placeholder';

export function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return pageMetadata({ locale: params.locale, route: '/blog', titleKey: 'blogTitle', descKey: 'blogDescription' });
}

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default function BlogIndex({ params }: { params: { locale: string } }) {
  if (isValidLocale(params.locale)) setRequestLocale(params.locale as Locale);
  const locale = (isValidLocale(params.locale) ? params.locale : 'en') as Locale;

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `${siteUrl}/${locale}` },
    { name: 'Guides', url: `${siteUrl}/${locale}/blog` },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <section className="container section">
        <Eyebrow num="01" label="Guides & insights" />
        <h1 className="h1" style={{ margin: '0 0 clamp(36px,4vw,56px)' }}>
          Stretch ceilings,
          <br />
          <span className="accent">explained.</span>
        </h1>

        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 18 }}>
          {blogPosts.map((p) => (
            <article key={p.slug} style={{ border: '1px solid var(--border)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/blog/${p.slug}`} className="zoom-wrap" style={{ display: 'block', overflow: 'hidden' }}>
                <Placeholder label={p.title} light ratio="16/9" className="zoom-img" decorative />
              </Link>
              <div style={{ padding: 'clamp(24px,2.6vw,34px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>
                  {fmtDate(p.datePublished)} · {p.readMinutes} min read
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(22px,2.4vw,28px)', letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 14px' }}>
                  <Link href={`/blog/${p.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{p.title}</Link>
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)', margin: '0 0 22px', flex: 1 }}>{p.excerpt}</p>
                <Link href={`/blog/${p.slug}`} className="lnk" style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: '.04em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                  Read article <ArrowRight size={15} style={{ color: 'var(--red)' }} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`@media (max-width: 760px){ .blog-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
