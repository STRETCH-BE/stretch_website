// Self-hosted Archivo variable font (wght 400–900 + wdth 100–125), copied from
// the STRETCH group site — one preloaded file covers Latin + Latin Extended
// (Polish diacritics included), so „Częstochowa" never drags a second subset
// into the critical path. The industrial "expanded" display look is the wdth
// axis driven to 125 in CSS (see globals.css), not a second family.
import localFont from 'next/font/local';

export const archivo = localFont({
  src: '../fonts/archivo-var.woff2',
  weight: '400 900',
  variable: '--font-archivo',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});
