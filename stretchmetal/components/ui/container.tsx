// Layout container: max-width 1320px with the fluid gutter. The one wrapper
// every section uses, so horizontal rhythm is identical site-wide.
import type { ReactNode } from 'react';

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container-sm${className ? ` ${className}` : ''}`}>{children}</div>;
}
