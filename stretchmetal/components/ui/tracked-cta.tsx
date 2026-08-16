'use client';

// CTA button that reports its click to the analytics layer before navigating.
// Used for every conversion-relevant button (RFQ entries above all) so the
// funnel is measurable per location.
import Button, { type ButtonVariant } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import type { ReactNode } from 'react';

type TrackedCtaProps = {
  children: ReactNode;
  href: string;
  cta: string;
  location: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Marks the CTA as an RFQ-funnel entry (fires the dedicated rfq_click). */
  rfq?: boolean;
};

export default function TrackedCta({
  children,
  href,
  cta,
  location,
  variant = 'primary',
  size = 'md',
  className,
  rfq = false,
}: TrackedCtaProps) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        if (rfq) analytics.rfqClick(location);
        else analytics.ctaClick(cta, location);
      }}
    >
      {children}
    </Button>
  );
}
