// Line-art icons for the six services — drawn as one consistent set: 24×24
// viewBox, 2px stroke, square caps/joins (hard corners, per the identity),
// currentColor so they inherit text colour on any surface.
import type { ServiceKey } from '@/content/types';

const common = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
};

const icons: Record<ServiceKey, React.ReactElement> = {
  // Welding: torch angled onto a seam, spark ticks above the arc point.
  welding: (
    <svg {...common}>
      <path d="M4 20h16" />
      <path d="M15 20l-4-7 6-6 3 3-5 10" />
      <path d="M9 7l2 2M6 10l2 2" />
    </svg>
  ),
  // Laser cutting: beam from a cutting head down to a split sheet.
  laser: (
    <svg {...common}>
      <path d="M10 3h4v4h-4z" />
      <path d="M12 7v9" />
      <path d="M3 20h7M14 20h7" />
      <path d="M9 17l3-1 3 1" />
    </svg>
  ),
  // CNC: end mill over a block, chips flying.
  cnc: (
    <svg {...common}>
      <path d="M10 3h4v6l-2 2-2-2V3z" />
      <path d="M4 15h16v6H4z" />
      <path d="M17 6l3-2M18 10l3-1" />
    </svg>
  ),
  // Powder coating: spray gun with particle dots onto a panel.
  coating: (
    <svg {...common}>
      <path d="M3 8h6l2 3-2 3H3V8z" />
      <path d="M3 8V6M3 14v2" />
      <path d="M18 4v16" />
      <path d="M13 8h1M15 11h1M13 14h1" />
    </svg>
  ),
  // Design: set square + pencil line on a drawing sheet.
  design: (
    <svg {...common}>
      <path d="M4 4h16v16H4z" />
      <path d="M8 16V8l8 8H8z" />
      <path d="M16 4l4 4" />
    </svg>
  ),
  // Structures: welded portal frame with a brace.
  structures: (
    <svg {...common}>
      <path d="M4 21V5h4v16" />
      <path d="M16 21V5h4v16" />
      <path d="M8 8h8M8 15h8" />
      <path d="M8 15l8-7" />
    </svg>
  ),
};

export default function ServiceIcon({ name, className }: { name: ServiceKey; className?: string }) {
  return <span className={className}>{icons[name]}</span>;
}
