// Apple touch icon — same red square / white SM as the favicon, at 180px.
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e00000',
          color: '#ffffff',
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: '-3px',
        }}
      >
        SM
      </div>
    ),
    size,
  );
}
