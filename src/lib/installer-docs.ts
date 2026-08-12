// =============================================================================
// INSTALLER DOCUMENTS — restricted trade library (/portal/documents).
//
// SEPARATE FROM src/lib/datasheets.ts ON PURPOSE. Datasheets are marketing
// collateral: anyone may request them from the public /datasheets page and
// they are emailed out. The documents below are RESTRICTED — the installation
// guide states in its own introduction that it is only for fitters who have
// completed STRETCH's approved training and "must not be made available to
// third parties". Keeping them in their own registry + their own folder makes
// it structurally impossible for one to slip into the public lead gate.
//
// ACCESS: signed-in TRADE accounts only (producer / installer / admin — see
// hasTradeAccess). b2c and architect accounts never see this section.
//
// HOW TO ADD A DOCUMENT:
//   1. Drop the file into  installer-private/  (repo root — never public/).
//   2. Add an entry below; `file` is the BARE filename.
//   3. Commit & push. Filenames are case-sensitive on Vercel.
// =============================================================================

export type InstallerDoc = {
  /** Stable id (kebab-case) — used in the download URL and download log. */
  slug: string;
  title: string;
  description: string;
  /** Bare filename inside installer-private/. */
  file: string;
  format?: string;
  sizeLabel?: string;
  updated?: string;
  /** Extra line shown under the title, e.g. page count / language. */
  detail?: string;
};

export const installerDocs: InstallerDoc[] = [
  {
    slug: 'installation-guide',
    title: 'STRETCH installation guide',
    description:
      'The complete fitter workbook: site preparation and quoting, receiving and handling coverings, choosing profiles per substrate, ceilings with plenum, complex shapes and double joins, walls, lighting integration and finishing.',
    file: 'stretch-installation-guide.pdf',
    format: 'PDF',
    sizeLabel: '19.6 MB',
    updated: 'Aug 2026',
    detail: '22 pages · English',
  },
];

export function getInstallerDoc(slug: string): InstallerDoc | undefined {
  return installerDocs.find((d) => d.slug === slug);
}
