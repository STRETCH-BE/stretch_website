// =============================================================================
// HOMEPAGE IMAGES — your control panel.
//
// HOW TO ADD A PHOTO:
//   1. Drop the file into  public/images/home/  (create the folder if needed).
//   2. Set the matching path below, e.g.  hero: '/images/home/hero.jpg'.
//   3. Commit & push — Vercel rebuilds and the photo appears.
//
// An empty string ('') keeps the branded placeholder, so you can fill these in
// one at a time. Paths are PUBLIC web paths (start with /images/...), NOT file
// system paths.
//
// PHOTO TIPS:
//   • JPG or WebP, ~1600px on the long edge, optimised (aim < 400 KB each).
//   • Shoot/crop roughly to the shape noted per slot; next/image covers + crops.
//   • Landscape unless a slot says portrait.
// =============================================================================

export const homeImages = {
  // HERO — the showpiece, top of the page. Landscape ~4:3.
  // file: public/images/home/hero.jpg
  hero: '',

  // SOLUTIONS — two room shots, landscape 16:10.
  solutionsPolyester: '', // matte polyester ceiling room — home/polyester.jpg
  solutionsPvc: '', //        glossy / printed PVC ceiling room — home/pvc.jpg

  // ACOUSTICS — a studio, office or cinema with an acoustic ceiling.
  // file: public/images/home/acoustics.jpg
  acoustics: '',

  // APPLICATIONS (bento grid) — keyed to each tile.
  app: {
    living: '', //     living room (large tile, ~4:3) — home/app-living.jpg
    cinema: '', //     home cinema (wide tile)        — home/app-cinema.jpg
    bathroom: '', //   bathroom                        — home/app-bathroom.jpg
    office: '', //     office                          — home/app-office.jpg
    light: '', //      backlit / starry-sky ceiling    — home/app-starry.jpg
    commercial: '', // retail / hotel                  — home/app-retail.jpg
  },

  // SELECTED WORK — five PORTRAIT (3:4) project photos, shown in this order.
  // files: home/gallery-1.jpg … home/gallery-5.jpg
  gallery: ['', '', '', '', ''] as string[],
};
