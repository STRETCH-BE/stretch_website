// Web app manifest — brand colours + the generated SM icon. Minimal on
// purpose: this is a marketing site, not an installable app.
import type { MetadataRoute } from 'next';
import { brand } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.description.pl,
    start_url: '/',
    display: 'browser',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [{ src: '/icon', sizes: '64x64', type: 'image/png' }],
  };
}
