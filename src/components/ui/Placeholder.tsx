// Image placeholder tile. Photography is supplied later (brief: assets [LATER]),
// so every image slot in the mockups renders this diagonal-hatch tile instead.
// It is NOT a raster <img> — when real photos arrive, swap these for next/image
// with explicit width/height/alt (see CHANGES.md "Images").
type PlaceholderProps = {
  label: string;
  /** Light tile (on light sections) vs dark tile (default). */
  light?: boolean;
  /** Optional aspect ratio, e.g. "16/10". When omitted, fills its container. */
  ratio?: string;
  rounded?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Marks the tile decorative for assistive tech. */
  decorative?: boolean;
};

export default function Placeholder({
  label,
  light = false,
  ratio,
  className,
  style,
  decorative = false,
}: PlaceholderProps) {
  return (
    <div
      className={`img-ph${light ? ' img-ph--light' : ''}${className ? ' ' + className : ''}`}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      style={{
        width: '100%',
        height: ratio ? 'auto' : '100%',
        aspectRatio: ratio,
        ...style,
      }}
    >
      {label}
    </div>
  );
}
