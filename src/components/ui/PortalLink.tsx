// Link INTO the client portal. With NEXT_PUBLIC_PORTAL_HOST set the portal
// lives on one canonical host and this renders a plain absolute <a>; without
// it, a normal locale-aware next-intl Link (zero-config = today's behaviour).
// Portal-internal navigation must NOT use this — it stays relative.
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { portalHref, isPortalHostEnabled } from '@/lib/portal/host';

// Narrow prop set (not AnchorHTMLAttributes) so the spread satisfies both
// <a> and next-intl's Link typing.
type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function PortalLink({ href, children, ...rest }: Props) {
  if (isPortalHostEnabled()) {
    return (
      <a href={portalHref(href)} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
