// Small hard-edged badge chip — used for the hero group badge and the
// capability tags on service cards. No pill radius: this is a rectangle.
import type { ReactNode } from 'react';

export default function MetaChip({
  children,
  tone = 'dark',
}: {
  children: ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-[7px] text-[11.5px] font-bold uppercase tracking-[0.14em] ${
        tone === 'dark'
          ? 'border-line-dark text-on-dark-soft'
          : 'border-border-2 text-text-muted'
      }`}
    >
      {children}
    </span>
  );
}
