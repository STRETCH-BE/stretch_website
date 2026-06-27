// =============================================================================
// PRODUCT (SOLUTION) PAGE IMAGES — control panel for all five product pages.
//
// HOW TO ADD PHOTOS:
//   1. Drop files into  public/images/products/  (create the folder if needed).
//   2. Set the matching path below, e.g.  hero: '/images/products/polyester-hero.jpg'.
//   3. Commit & push.
//
// Each product page uses ONE hero photo + THREE feature photos (one per feature
// row, in order). Empty string ('') keeps the branded placeholder, so you can
// fill these in gradually. The "related solutions" thumbnails reuse each
// product's own hero automatically — no extra files needed.
//
// Filenames are case-sensitive on Vercel: match them EXACTLY.
// Suggested: JPG/WebP, ~1600px long edge, hero landscape ~4:3, features ~16:11.
// =============================================================================

export type ProductImageSet = { hero: string; features: string[] };

export const productImages: Record<string, ProductImageSet> = {
  // ---- Polyester ----------------------------------------------------------
  'polyester-stretch-ceiling': {
    hero: '/images/products/polyester-hero.jpg',
    features: [
      '/images/products/polyester-1.jpg', // [0] Cold installation
      '/images/products/polyester-2.jpg', // [1] A very matte finish
      '/images/products/polyester-3.jpg', // [2] Acoustic & washable
    ],
  },

  // ---- PVC film -----------------------------------------------------------
  'pvc-stretch-ceiling': {
    hero: '/images/products/pvc-hero.jpg',
    features: [
      '/images/products/pvc-1.jpg', // [0] Recyclable to raw material
      '/images/products/pvc-2.jpg', // [1] Backlight & print ready
      '/images/products/pvc-3.jpg', // [2] Removable & washable
    ],
  },

  // ---- Acoustic -----------------------------------------------------------
  'acoustic-stretch-system': {
    hero: '/images/products/acoustic-hero.jpg',
    features: [
      '/images/products/acoustic-1.jpg', // [0] Class A absorption
      '/images/products/acoustic-2.jpg', // [1] Islands & wall panels
      '/images/products/acoustic-3.jpg', // [2] Invisible audio
    ],
  },

  // ---- Light & Print (not requested yet — fill in when ready) -------------
  'light-print-stretch-ceiling': {
    hero: '',
    features: ['', '', ''], // [0] backlight  [1] starry sky / RGB  [2] custom print
  },

  // ---- Prefab (not requested yet — fill in when ready) --------------------
  'prefab-ceiling-unit': {
    hero: '',
    features: ['', '', ''], // [0] click-fit  [1] made to measure  [2] inspection hatch
  },
};

export function productImage(slug: string): ProductImageSet {
  return productImages[slug] ?? { hero: '', features: [] };
}
