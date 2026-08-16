// Default Open Graph image — black field, red bar, STRETCHMETAL wordmark and
// the trade line. Placed at the app root so it cascades to every route; a
// page can override it later by adding its own opengraph-image or passing
// `ogImage` to pageMetadata(). Uses the built-in sans font (satori cannot
// consume the woff2 variable font); the black/red composition carries the
// identity until a designed static og.png replaces it.
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'StretchMetal — steel. cut. welded. coated.';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          color: '#ffffff',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 22, height: 22, background: '#e00000' }} />
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '4px' }}>
            CZĘSTOCHOWA · POLAND · EU
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 110, fontWeight: 800, letterSpacing: '-3px', lineHeight: 1 }}>
            <span>STRETCH</span>
            <span style={{ color: '#ff1a1a' }}>METAL</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 34, fontWeight: 600, color: '#c9c6c0' }}>
            STEEL · CUT · WELDED · COATED
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 16, background: '#e00000' }} />
      </div>
    ),
    size,
  );
}
