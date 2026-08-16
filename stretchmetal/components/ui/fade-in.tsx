'use client';

// Scroll-reveal wrapper: fades + lifts children into view once, via the shared
// useInView hook. The reduced-motion media query in globals.css zeroes the
// transition, so users who opt out see content instantly.
import { useInView } from '@/lib/use-in-view';
import type { CSSProperties, ReactNode } from 'react';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

export default function FadeIn({ children, delay = 0, className, style }: FadeInProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
