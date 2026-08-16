// Visible breadcrumb trail for subpages — pairs with the BreadcrumbList
// JSON-LD each page emits. Rendered inside the dark page hero band.
import Link from 'next/link';

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line-dark bg-black text-white">
      <ol className="container-sm flex flex-wrap items-center gap-2 py-3 text-[11.5px] font-semibold uppercase tracking-[0.1em]">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 ? (
              <span className="text-on-dark-muted" aria-hidden>
                /
              </span>
            ) : null}
            {crumb.href ? (
              <Link href={crumb.href} className="lnk text-on-dark-soft">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-white">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
