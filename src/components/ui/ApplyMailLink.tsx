'use client';

// mailto: link that records an email_click event (GA4) — the apply buttons and
// the open-application CTA on the careers pages. The label comes in as
// children, so the component reads no messages of its own.
import type { CSSProperties, ReactNode } from 'react';
import { analytics } from '@/lib/analytics';

export default function ApplyMailLink({
  href,
  location,
  className,
  style,
  children,
}: {
  href: string;
  /** Analytics location label, e.g. "careers_project-manager". */
  location: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} style={style} onClick={() => analytics.emailClick(location)}>
      {children}
    </a>
  );
}
