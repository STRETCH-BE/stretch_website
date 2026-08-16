// Favicon — generated at build: the red square with a white "SM", the
// smallest possible expression of the identity. Served as /icon.
import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: '-1px',
        }}
      >
        SM
      </div>
    ),
    size,
  );
}
