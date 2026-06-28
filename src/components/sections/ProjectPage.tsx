// Project detail page body for /inspiration/[slug]. Hero image + summary,
// description paragraphs, the STRETCH solutions used (linked to product pages),
// and a gallery of image placeholders. Data comes from content.ts `projects`.
import { Link } from '@/i18n/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Placeholder from '@/components/ui/Placeholder';
import { ModalButton } from '@/components/ui/ModalButton';
import { getProduct } from '@/lib/products';
import type { Project } from '@/lib/content';

export default function ProjectPage({ project }: { project: Project }) {
  const solutions = (project.solutions ?? [])
    .map((slug) => {
      const p = getProduct(slug);
      return p ? { slug, name: p.name } : null;
    })
    .filter((x): x is { slug: string; name: string } => x !== null);

  const gallery = project.gallery ?? [];

  return (
    <article className="container" style={{ padding: 'clamp(20px,3vw,32px) 0 clamp(50px,6vw,90px)' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: 'clamp(20px,2.6vw,30px)' }}>
        <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-faint-2)' }}>
          <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/inspiration" style={{ color: 'inherit', textDecoration: 'none' }}>Inspiration</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" style={{ color: 'var(--red)' }}>{project.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div style={{ maxWidth: 760, marginBottom: 'clamp(24px,3vw,38px)' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12 }}>{project.cat}</div>
        <h1 className="h1" style={{ fontSize: 'clamp(34px,6vw,72px)', lineHeight: 0.98, margin: '0 0 14px' }}>{project.title}<span className="accent">.</span></h1>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginBottom: project.summary ? 16 : 0 }}>{project.meta}</div>
        {project.summary && <p className="lead" style={{ margin: 0 }}>{project.summary}</p>}
      </div>

      {/* Hero image */}
      <div style={{ border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 'clamp(34px,4vw,56px)' }}>
        <Placeholder
          label={`${project.title} — ${project.cat}`}
          src={project.image}
          alt={`${project.title} — ${project.cat}`}
          priority
          sizes="100vw"
          ratio="16/9"
          light
        />
      </div>

      {/* Body + sidebar */}
      <div className="pj-grid">
        <div style={{ minWidth: 0 }}>
          {(project.description ?? []).map((para, i) => (
            <p key={i} style={{ fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.7, color: 'var(--text-muted)', margin: '0 0 18px' }}>{para}</p>
          ))}
        </div>

        <aside className="pj-aside">
          {solutions.length > 0 && (
            <>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginBottom: 14 }}>Solutions used</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                {solutions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/products/${s.slug}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 15px', border: '1px solid var(--border)', background: 'var(--surface)', textDecoration: 'none', color: 'var(--text)', fontSize: 14, fontWeight: 600 }}
                  >
                    {s.name} <ArrowRight size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </>
          )}
          <ModalButton type="quote" source={`project_${project.slug}`} product={project.title} className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
            Start a similar project <ArrowRight size={15} />
          </ModalButton>
        </aside>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section style={{ marginTop: 'clamp(46px,5vw,72px)' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-faint-2)', marginBottom: 18 }}>Gallery</div>
          <div className="pj-gallery">
            {gallery.map((src, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
                <Placeholder
                  label={`${project.title} — photo ${i + 1}`}
                  src={src}
                  alt={`${project.title} — photo ${i + 1}`}
                  sizes="(max-width: 760px) 100vw, 33vw"
                  ratio="4/3"
                  light
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back + CTA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 'clamp(46px,5vw,72px)', paddingTop: 'clamp(28px,3vw,40px)', borderTop: '1px solid var(--border)' }}>
        <Link href="/inspiration" className="btn btn--ghost btn--sm">
          <ArrowLeft size={14} /> All projects
        </Link>
        <Link href="/products" className="btn btn--ghost btn--sm">
          Explore solutions <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        .pj-grid { display: grid; grid-template-columns: 1fr 280px; gap: clamp(28px,4vw,56px); align-items: start; }
        .pj-aside { position: sticky; top: 96px; }
        .pj-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 760px) {
          .pj-grid { grid-template-columns: 1fr; }
          .pj-aside { position: static; }
          .pj-gallery { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </article>
  );
}
