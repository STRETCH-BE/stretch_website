// FAQ block — native <details> accordions (keyboard-accessible for free),
// hard-edged, with the matching FAQPage JSON-LD emitted by the page that
// renders it.
import FadeIn from '@/components/ui/fade-in';
import type { Faq } from '@/content/types';

export default function FaqSection({ title, items }: { title: string; items: Faq[] }) {
  return (
    <div>
      <h2 className="h2 h2--sm">{title}</h2>
      <div className="mt-8 border-t border-border-2">
        {items.map((faq) => (
          <FadeIn key={faq.q}>
            <details className="group border-b border-border-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  className="text-[18px] font-black text-red transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="max-w-[720px] pb-6 text-[14px] leading-relaxed text-text-muted">{faq.a}</p>
            </details>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
