'use client';

// Google Maps embed for the contact page — consent-aware. The iframe (which
// sets Google cookies) is only loaded when the visitor has granted marketing
// consent in the cookie banner, or clicks "Load map" here. Until then the slot
// shows a dark striped panel with the button and a plain link to Google Maps
// (no cookies). Keyless embed URLs — no API key or billing account. The map
// shows the company's Google Business Profile LISTING (see MapPlace). The box
// grows to fill its column (flex: 1) and is at least 380px tall.
import { useEffect, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { getConsent, CONSENT_UPDATE_EVENT, type ConsentPreferences } from '@/lib/consent';

/** A Google Business Profile listing (see contact.maps in site-config). */
export type MapPlace = {
  /** Listing name exactly as on Google Maps. */
  name: string;
  /** Name + address query — the fallback embed and the "Open in Google Maps" link. */
  query: string;
  /** maps.app.goo.gl share link of the listing; used for "Open in Google Maps" when set. */
  shareUrl?: string;
  /** Google feature id "0x…:0x…" of the listing — pins the embed to the exact profile. */
  ftid?: string;
  lat?: number;
  lng?: number;
  /** Region code for the embed (ISO 3166-1 alpha-2, lower case), e.g. "be". */
  region: string;
};

const ZOOM = 15;

// Embed URL. With the listing's feature id we build the same keyless
// `maps/embed?pb=` URL Google's "Share → Embed a map" generates for a place,
// which renders the profile card (name, rating, photos, directions). Without
// it: the keyless `maps?q=…&output=embed` URL with the name + address query.
export function mapEmbedUrl(p: MapPlace, lang: string): string {
  if (p.ftid && typeof p.lat === 'number' && typeof p.lng === 'number') {
    // `1d` is Google's viewport "distance" for the zoom level at this latitude.
    const d = (3991 * Math.cos((p.lat * Math.PI) / 180) * 2 ** (17 - ZOOM)).toFixed(1);
    const pb =
      `!1m18!1m12!1m3!1d${d}!2d${p.lng}!3d${p.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1` +
      `!3m3!1m2!1s${encodeURIComponent(p.ftid)}!2s${encodeURIComponent(p.name)}!5e0` +
      `!3m2!1s${lang}!2s${p.region}!4v1!5m2!1s${lang}!2s${p.region}`;
    return `https://www.google.com/maps/embed?pb=${pb}`;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(p.query)}&z=${ZOOM}&hl=${encodeURIComponent(lang)}&output=embed`;
}

export function mapOpenUrl(p: MapPlace): string {
  return p.shareUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.query)}`;
}

type Props = {
  place: MapPlace;
  /** UI language of the map tiles/labels (BCP 47 language subtag, e.g. "de"). */
  lang: string;
  /** Accessible title for the iframe / label for the panel. */
  title: string;
  loadLabel: string;
  note: string;
  openLabel: string;
};

export default function ContactMap({ place, lang, title, loadLabel, note, openLabel }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Marketing consent (now or later via the banner) loads the map by itself.
  useEffect(() => {
    if (getConsent()?.marketing) setLoaded(true);
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<ConsentPreferences>).detail;
      if (detail?.marketing ?? getConsent()?.marketing) setLoaded(true);
    };
    window.addEventListener(CONSENT_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(CONSENT_UPDATE_EVENT, onUpdate);
  }, []);

  const embedSrc = mapEmbedUrl(place, lang);
  const openHref = mapOpenUrl(place);

  return (
    <div className="ct-map" style={{ position: 'relative', flex: '1 1 auto', minHeight: 380 }}>
      {loaded ? (
        <iframe
          src={embedSrc}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, filter: 'grayscale(.15)' }}
        />
      ) : (
        <div
          aria-label={title}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: 24,
            textAlign: 'center',
            color: '#fff',
            background: 'repeating-linear-gradient(135deg, #171717 0 14px, #1d1d1d 14px 28px)',
          }}
        >
          <MapPin size={28} style={{ color: 'var(--red-bright)' }} />
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setLoaded(true)}>
            {loadLabel}
          </button>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: 'rgba(255,255,255,.7)', margin: 0, maxWidth: 320 }}>{note}</p>
          <a
            href={openHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff' }}
          >
            {openLabel} <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
