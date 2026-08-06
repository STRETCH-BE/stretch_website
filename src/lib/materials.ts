// =============================================================================
// MATERIALS & SUPPLIES — the public product catalogue (quote-list, no checkout).
//
// Replaces the old WooCommerce shop for SEO + lead capture: every group page
// targets a buying keyword ("spanplafond profielen", "spanplafond doek", …) and
// every item opens the QUOTE MODAL pre-filled with the product name. The lead
// arrives via the normal pipeline (leads@) with the item in the email — Michael
// replies with price + delivery. No cart, no payments, nothing to maintain.
//
// Item families are curated from the Alto pricebook categories + the old shop.
// NO PRICES here, ever — prices live behind the portal login (B2B).
// Photos: drop files into public/images/materials/ and fill the `image` slots
// ('' = branded placeholder). English copy = source of truth; translations land
// in the `materialsData` messages namespace later (same overlay pattern as
// products/projects).
// =============================================================================

export type MaterialItem = {
  name: string;
  body: string;
  /** Photo from /public, e.g. '/images/materials/alu-profile.jpg'. '' = placeholder. */
  image: string;
};

export type MaterialGroup = {
  slug: string;
  name: string;
  eyebrow: string;
  /** <title> + meta description (EN source; localized later). */
  metaTitle: string;
  metaDescription: string;
  intro: string;
  items: MaterialItem[];
};

export const materialGroups: MaterialGroup[] = [
  {
    slug: 'profiles',
    name: 'Profiles & tracks',
    eyebrow: 'Profiles',
    metaTitle: 'Stretch ceiling profiles — aluminium & PVC | STRETCH',
    metaDescription:
      'Aluminium and PVC stretch-ceiling profiles, LED-line profiles and end caps, straight from our own production. Request a quote — we reply with price and delivery.',
    intro:
      'The rails that hold every STRETCH ceiling: aluminium and PVC perimeter profiles, LED-line profiles and finishing pieces — the same profiles our own installers use, cut and shipped from our production.',
    items: [
      { name: 'Aluminium stretch-ceiling profiles', body: 'Rigid aluminium perimeter and separation profiles for cold and heat mounting — straight lengths, ready to fit.', image: '' },
      { name: 'PVC stretch-ceiling profiles', body: 'Flexible PVC harpoon profiles for curved walls and simple perimeters.', image: '' },
      { name: 'LED-line profiles & end caps', body: 'Recessed profiles that put a crisp light line into the membrane, with matching end caps (16 / 31 mm).', image: '' },
      { name: 'Tracklight 48V profile', body: 'The magnetic 48V track that integrates flush into a stretch ceiling — the backbone of the tracklight system.', image: '' },
    ],
  },
  {
    slug: 'fabrics',
    name: 'Fabrics & foils',
    eyebrow: 'Fabrics',
    metaTitle: 'Stretch ceiling fabric & PVC foil — rolls, cut to length, made to measure | STRETCH',
    metaDescription:
      'PVC stretch-ceiling foil (MSD, Bauf, Teqtum, Renolit) on the roll, cut to length, or welded made-to-measure with harpoon. Matte, glossy, translucent and colour finishes. Request a quote.',
    intro:
      'Membrane the way you need it: full rolls for your own confection, foil cut to length, or a finished made-to-measure ceiling welded with harpoon — in matte, satin, glossy, translucent and colour finishes from the major foil brands.',
    items: [
      { name: 'PVC foil on the roll', body: 'MSD, Bauf, Teqtum and Renolit foil by the roll — matte/satin, glossy, translucent, colour, metallic and Black & White ranges.', image: '' },
      { name: 'Foil cut to length', body: 'The same foil ranges cut to the length you need — no full roll required.', image: '' },
      { name: 'Made-to-measure ceilings', body: 'Your ceiling welded to size in our production, harpoon included — ready to hang in the profile.', image: '' },
      { name: 'Translucent (backlit) foil', body: 'Light-transmitting membrane for illuminated ceilings and light boxes, up to 5 m seamless.', image: '' },
    ],
  },
  {
    slug: 'lighting',
    name: 'Lighting',
    eyebrow: 'Lighting',
    metaTitle: 'Stretch ceiling lighting — 48V tracklight, LED modules, spotrings | STRETCH',
    metaDescription:
      'Lighting for stretch ceilings: magnetic 48V tracklights, spot and grille lights, LED modules for backlit ceilings and spotrings/protective rings. Request a quote.',
    intro:
      'Everything that lights a STRETCH ceiling: the magnetic 48V tracklight family, LED field modules for backlit ceilings, and the rings that finish every spot cleanly.',
    items: [
      { name: 'Tracklight 48V system', body: 'Magnetic spots, grille lights and connectors for the flush 48V track — swap and reposition fixtures by hand.', image: '' },
      { name: 'LED modules for backlit ceilings', body: 'Even, dimmable LED fields that turn a translucent membrane into a seamless light source.', image: '' },
      { name: 'Spotrings & protective rings', body: 'Rings in every diameter (4.5–300 mm) that reinforce cut-outs for spots, sensors and ventilation.', image: '' },
    ],
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    eyebrow: 'Accessories',
    metaTitle: 'Stretch ceiling accessories — harpoon, rings, fixings | STRETCH',
    metaDescription:
      'Stretch-ceiling accessories: harpoon, protective rings, glue, fixings and finishing pieces — everything around the membrane. Request a quote.',
    intro:
      'The small parts that make a clean job: harpoon for welding, protective rings, glue and fixings — the consumables every installer runs through.',
    items: [
      { name: 'Harpoon', body: 'The welded edge that locks the membrane into the profile — sold by the roll.', image: '' },
      { name: 'Protective rings', body: 'Self-adhesive rings from 4.5 to 300 mm for spots, hooks, pipes and sensors.', image: '' },
      { name: 'Glue & fixings', body: 'AKFIX glue, screws and the mounting consumables used on every site.', image: '' },
    ],
  },
  {
    slug: 'tools-cleaning',
    name: 'Tools & cleaning',
    eyebrow: 'Tools',
    metaTitle: 'Stretch ceiling tools & STRETCH Cleaner | STRETCH',
    metaDescription:
      'Installation hand tools for stretch ceilings and the STRETCH Cleaner that keeps membranes spotless (1 L and 5 L). Request a quote.',
    intro:
      'Installer hand tools and the cleaner made for stretch membranes — the same products from our training room and our own vans.',
    items: [
      { name: 'Installation hand tools', body: 'Spatulas and hand tools shaped for tucking membrane without damage.', image: '' },
      { name: 'STRETCH Cleaner 1 L', body: 'The membrane-safe cleaner for fingerprints, dust and building-site film.', image: '' },
      { name: 'STRETCH Cleaner 5 L', body: 'The same cleaner in the workshop size for dealers and heavy users.', image: '' },
    ],
  },
];

export const materialGroupSlugs = materialGroups.map((g) => g.slug);
export const getMaterialGroup = (slug: string): MaterialGroup | undefined =>
  materialGroups.find((g) => g.slug === slug);
