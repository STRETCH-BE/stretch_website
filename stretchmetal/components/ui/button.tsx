// Hard-edged button/link in the three identity variants. Renders a Next
// <Link> when `href` is given, otherwise a <button>. The red → arrow glyph is
// part of the identity; it flips colour with the text on hover (CSS handles
// that via .btn__arrow).
import Link from 'next/link';
import type { ReactNode, MouseEventHandler } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'ghost-light';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  arrow?: boolean;
  onClick?: MouseEventHandler;
  className?: string;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn--primary',
  ghost: 'btn--ghost',
  'ghost-light': 'btn--ghost-light',
};

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  arrow = true,
  onClick,
  className,
}: ButtonProps) {
  const cls = [
    'btn',
    variantClass[variant],
    size === 'lg' ? 'btn--lg' : size === 'sm' ? 'btn--sm' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {children}
      {arrow ? (
        <span className="btn__arrow" aria-hidden>
          →
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}
