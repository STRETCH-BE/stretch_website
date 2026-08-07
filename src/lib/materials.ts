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
  /**
   * Optional version checkboxes shown on the item card (canonical keys; labels
   * come from the `materials` messages namespace as variant<Key>). The visitor's
   * selection is appended to the product name in the quote modal / inquiry list.
   */
  variants?: ('standard' | 'acoustic' | 'translucent')[];
};

export type MaterialGroup = {
  slug: string;
  name: string;
  eyebrow: string;
  /** <title> + meta description (EN source; localized later). */
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Group-card photo on /materials. Falls back to the first item photo. */
  cover?: string;
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
    cover: '/images/materials/group-profiles.jpg',
    items: [
      { name: 'Aluminium stretch-ceiling profiles', body: 'Rigid aluminium perimeter and separation profiles for cold and heat mounting — straight lengths, ready to fit.', image: '/images/materials/alu-profiles.jpg' },
      { name: 'PVC stretch-ceiling profiles', body: 'Flexible PVC harpoon profiles for curved walls and simple perimeters.', image: '/images/materials/pvc-profiles.jpg' },
      { name: 'LED-line profiles & end caps', body: 'Recessed profiles that put a crisp light line into the membrane, with matching end caps (16 / 31 mm).', image: '/images/materials/led-line-profiles.jpg' },
      { name: 'Tracklight 48V profile', body: 'The magnetic 48V track that integrates flush into a stretch ceiling — the backbone of the tracklight system.', image: '/images/materials/tracklight-profile.jpg' },
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
    cover: '/images/materials/fabric-cut-to-measure.jpg',
    items: [
      {
        name: 'PVC foil produced to size',
        body: 'Your ceiling welded and cut to the exact room dimensions in our production — harpoon edge included, folded, labelled and ready to hang in the profile.',
        image: '/images/materials/foil-cut-to-size.jpg',
        variants: ['standard', 'acoustic', 'translucent'],
      },
      {
        name: 'Fabric stretch ceiling cut to measure',
        body: 'Polyester fabric ceiling cut to your measurements from our own confection — the fabric ranges from the colour chart.',
        image: '/images/materials/fabric-cut-to-measure.jpg',
        variants: ['standard', 'acoustic', 'translucent'],
      },
      {
        name: 'Polyester stretch ceiling on the roll',
        body: 'Full rolls of polyester stretch-ceiling fabric for partners with their own confection.',
        image: '',
        variants: ['standard', 'acoustic', 'translucent'],
      },
      {
        name: 'PVC stretch ceiling on the roll',
        body: 'PVC membrane by the roll — matte, satin, glossy, translucent and colour ranges from the major foil brands.',
        image: '/images/materials/pvc-roll.jpg',
        variants: ['standard', 'acoustic', 'translucent'],
      },
      // Appended 7 Aug (kit — UK data: 66% of .uk clicks) — keep at END (index merge).
      {
        name: 'Polyester stretch ceiling kit (DIY)',
        body: 'The complete cold-install kit: polyester fabric cut to your room, profiles, corner pieces and instructions — the DIY route to a seamless fabric ceiling.',
        image: '',
        variants: ['standard', 'acoustic', 'translucent'],
      },
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
      { name: 'Tracklight 48V system', body: 'Magnetic spots, grille lights and connectors for the flush 48V track — swap and reposition fixtures by hand.', image: '/images/materials/tracklight-system.jpg' },
      { name: 'LED modules for backlit ceilings', body: 'Even, dimmable LED fields that turn a translucent membrane into a seamless light source.', image: '/images/materials/led-modules.jpg' },
      { name: 'Spotrings & protective rings', body: 'Rings in every diameter (4.5–300 mm) that reinforce cut-outs for spots, sensors and ventilation.', image: '/images/materials/spot-rings.jpg' },
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
      { name: 'Harpoon', body: 'The welded edge that locks the membrane into the profile — sold by the roll.', image: '/images/materials/harpoon.jpg' },
      { name: 'Protective rings', body: 'Self-adhesive rings from 4.5 to 300 mm for spots, hooks, pipes and sensors.', image: '/images/materials/protective-rings.jpg' },
      { name: 'Glue & fixings', body: 'Instant adhesive (cyanoacrylate), screws and the mounting consumables used on every site.', image: '/images/materials/glue-fixings.jpg' },
      // Appended 7 Aug (P2) — keep at the END: materialsData items merge by index.
      { name: 'Invisible ceiling speaker', body: 'Flat audio exciter mounted above the membrane that turns the ceiling surface itself into a full-range speaker — music with zero visible hardware.', image: '' },
    ],
  },
  {
    slug: 'acoustic-panels',
    name: 'Acoustic panels',
    eyebrow: 'Acoustics',
    metaTitle: 'Acoustic panels — polyester wool, islands & wall panels | STRETCH',
    metaDescription:
      'Acoustic polyester wool panels, free-hanging ceiling islands and wall panels that take the echo out of a room — cut to size from our production. Request a quote.',
    intro:
      'Absorption for rooms that sound as good as they look: polyester wool panels for ceilings and walls, free-hanging islands and baffles — cut to size and delivered from our own production.',
    items: [
      { name: 'Polyester wool panels', body: 'Self-supporting acoustic panels in polyester wool — colour-fast, safe to handle and cut to size for ceilings and walls.', image: '/images/materials/polyester-wool-panels.jpg' },
      { name: 'Acoustic ceiling islands & baffles', body: 'Free-hanging absorbers for spaces where a full acoustic ceiling is not an option — offices, restaurants, halls.', image: '/images/materials/acoustic-islands.jpg' },
      { name: 'Acoustic wall panels', body: 'Wall-mounted absorption that pairs with an acoustic ceiling to bring reverberation down to a comfortable level.', image: '/images/materials/acoustic-wall-panels.jpg' },
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
    cover: '/images/materials/group-tools.jpg',
    items: [
      { name: 'Installation hand tools', body: 'Spatulas and hand tools shaped for tucking membrane without damage.', image: '/images/materials/hand-tools.jpg' },
      { name: 'STRETCH Cleaner 1 L', body: 'The membrane-safe cleaner for fingerprints, dust and building-site film.', image: '/images/materials/cleaner-1l.jpg' },
      { name: 'STRETCH Cleaner 5 L', body: 'The same cleaner in the workshop size for dealers and heavy users.', image: '/images/materials/cleaner-5l.jpg' },
      // Appended 7 Aug (P2) — keep at the END: materialsData items merge by index.
      { name: 'Air tools & tackers', body: 'Pneumatic tackers and air tools for fast, solid profile mounting — the same BEA models our own installers run.', image: '' },
    ],
  },
];

export const materialGroupSlugs = materialGroups.map((g) => g.slug);
export const getMaterialGroup = (slug: string): MaterialGroup | undefined =>
  materialGroups.find((g) => g.slug === slug);
