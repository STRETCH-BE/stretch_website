// Services grid — six hairline cells: red number, line-art icon, name, blurb,
// capability tags and the arrow link to the service page. Used on the home
// page and the services hub (the hub passes headed=false and its own intro).
import Link from 'next/link';
import FadeIn from '@/components/ui/fade-in';
import MetaChip from '@/components/ui/meta-chip';
import ServiceIcon from '@/components/ui/service-icon';
import type { ServiceCard } from '@/content/types';
import { path, type Locale } from '@/lib/i18n-routes';

export default function ServicesGrid({
  locale,
  cards,
  linkLabel,
}: {
  locale: Locale;
  cards: ServiceCard[];
  linkLabel: string;
}) {
  return (
    <div className="grid-lines min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3">
      {cards.map((card, i) => (
        <FadeIn key={card.key} delay={i * 60} className="h-full">
          <Link
            href={path(card.key, locale)}
            className="group flex h-full flex-col bg-white p-7 transition-colors hover:bg-surface"
          >
            <div className="flex items-start justify-between">
              <span className="text-[13px] font-bold tracking-[0.16em] text-red">
                {String(i + 1).padStart(2, '0')}
              </span>
              <ServiceIcon name={card.key} className="text-black" />
            </div>
            <h3 className="h3 mt-6">{card.name}</h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{card.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <MetaChip key={tag} tone="light">
                  {tag}
                </MetaChip>
              ))}
            </div>
            <span className="mt-auto flex items-center gap-2 pt-6 text-[12.5px] font-bold uppercase tracking-[0.1em]">
              {linkLabel}
              <span className="text-red transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </span>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
