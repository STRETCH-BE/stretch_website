// Subpage intro hero — dark: eyebrow, uppercase display H1 (one accent word)
// and the lead paragraph. Every non-home page opens with this block, keeping
// the section rhythm consistent site-wide.
import FadeIn from '@/components/ui/fade-in';
import Eyebrow from '@/components/ui/eyebrow';
import type { HeroLine } from '@/content/types';

export default function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: HeroLine[];
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="section--dark">
      <div className="container-sm pb-14 pt-16 min-[860px]:pb-20 min-[860px]:pt-24">
        <FadeIn>
          <Eyebrow label={eyebrow} tone="dark" />
          <h1 className="h1 max-w-[1000px]">
            {title.map((line, i) => (
              <span key={i} className={`block ${line.accent ? 'text-red-bright' : ''}`}>
                {line.text}
              </span>
            ))}
          </h1>
          {lead ? <p className="lead mt-7 max-w-[620px] text-on-dark-soft">{lead}</p> : null}
          {children}
        </FadeIn>
      </div>
    </section>
  );
}
