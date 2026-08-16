// Image slot for future workshop photography. With `src` it renders a real
// photo via next/image (object-fit cover); without it, the branded dark
// diagonal-hatch tile with an uppercase caption describing the future shot.
// Real photos drop in by adding one path in the content file — no component
// changes needed.
import Image from 'next/image';
import type { CSSProperties } from 'react';

type PlaceholderProps = {
  label: string;
  src?: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  light?: boolean;
  /** CSS aspect ratio, e.g. "16/10". Omit to fill the parent's height. */
  ratio?: string;
  className?: string;
  style?: CSSProperties;
};

export default function Placeholder({
  label,
  src,
  alt,
  priority,
  sizes,
  light = false,
  ratio,
  className,
  style,
}: PlaceholderProps) {
  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden ${className ?? ''}`}
        style={{ height: ratio ? 'auto' : '100%', aspectRatio: ratio, ...style }}
      >
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  }
  return (
    <div
      className={`img-ph${light ? ' img-ph--light' : ''} w-full ${className ?? ''}`}
      role="img"
      aria-label={label}
      style={{ height: ratio ? 'auto' : '100%', aspectRatio: ratio, ...style }}
    >
      {label}
    </div>
  );
}
