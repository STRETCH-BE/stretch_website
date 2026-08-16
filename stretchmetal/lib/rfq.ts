// ============================================================================
// RFQ SHARED CONSTANTS — one definition of what the quote form accepts, used
// by BOTH the client form (instant validation, friendly errors) and the API
// route (authoritative server-side validation). Keeping them identical means
// the server never rejects something the UI said was fine.
// ============================================================================

/** Accepted drawing/file extensions (lowercase, with dot). */
export const RFQ_ALLOWED_EXTENSIONS = [
  '.dxf',
  '.dwg',
  '.step',
  '.stp',
  '.iges',
  '.igs',
  '.pdf',
  '.zip',
] as const;

/** Total upload cap across all files: 15 MB. */
export const RFQ_MAX_TOTAL_BYTES = 15 * 1024 * 1024;

/** Max number of files per submission (sanity cap, generous). */
export const RFQ_MAX_FILES = 10;

/** Minimum ms between form render and submit — bots fill instantly. */
export const RFQ_MIN_FILL_MS = 3_000;

/** The `accept` attribute value for the file input. */
export const RFQ_ACCEPT_ATTR = RFQ_ALLOWED_EXTENSIONS.join(',');

export function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return RFQ_ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/** Service keys as submitted by the checkbox chips. */
export const RFQ_SERVICE_KEYS = [
  'welding',
  'laser',
  'cnc',
  'coating',
  'design',
  'structures',
] as const;
export type RfqServiceKey = (typeof RFQ_SERVICE_KEYS)[number];

export const RFQ_MATERIALS = ['steel', 'stainless', 'aluminium', 'other'] as const;
export type RfqMaterial = (typeof RFQ_MATERIALS)[number];

/** Human-readable size, locale-independent enough for both languages. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
