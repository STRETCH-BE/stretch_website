// ============================================================================
// GOOGLE MAPS LISTINGS — the company locations the contact page embeds and
// links (Google Business Profiles, not bare address pins). Keyless URLs only:
// no API key, no billing account. Client-safe (pure functions, no env).
// ============================================================================

/** A Google Business Profile listing (contact.maps / offices[].maps in site-config). */
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
// it: the keyless `maps?q=…&output=embed` URL with the name + address query,
// which Google resolves to the listing in most cases.
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

/** Plain link to the listing (no cookies on our page): the share link, else a Maps search. */
export function mapOpenUrl(p: MapPlace): string {
  return p.shareUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.query)}`;
}
