// Content model of the market acoustics pages (/akoestiek, /acoustique,
// /akustik). One module per locale, written natively for that market's norms
// and vocabulary — never a translation of another market's module. The route
// (AcousticsRoute.tsx) computes the Sabine worked example from `sabine.room`
// so the printed arithmetic can never disagree with the prose.

/** A run of text, optionally a link. "resound:<range>" resolves to that
 *  Re-Sound range page in the locale's Re-Sound language (site-config
 *  resoundRangePaths); other external hrefs render as a plain followed <a>;
 *  locale-relative hrefs render through next-intl's Link. */
export type Segment = { text: string; href?: string };

export type AcousticsSurface = { material: string; alpha: number };

export type AcousticsContent = {
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  /** Direct answer to the H1 — ceiling first, then walls. */
  answer: string[];
  why: { heading: string; paragraphs: string[] };
  targets: {
    heading: string;
    intro: string;
    cols: { room: string; target: string; norm: string };
    rows: { room: string; target: string; norm: string }[];
    norms: { name: string; what: string }[];
    acousticianNote: string;
  };
  ceiling: {
    heading: string;
    paragraphs: string[];
    bullets: string[];
    /** One sentence: before + <link>anchor</link> + after → the product page. */
    productLink: { before: string; anchor: string; after: string };
  };
  sabine: {
    heading: string;
    intro: string;
    room: {
      name: string;
      length: number;
      width: number;
      height: number;
      floor: AcousticsSurface;
      walls: AcousticsSurface;
      ceilingBefore: AcousticsSurface;
      ceilingAfter: AcousticsSurface;
    };
    labels: {
      volume: string;
      surface: string;
      area: string;
      alpha: string;
      absorption: string;
      before: string;
      after: string;
      total: string;
      reverb: string;
      formulaNote: string;
      floor?: string;
      walls?: string;
      ceiling?: string;
      /** de only: the DIN 18041 A3 target line label. */
      dinTarget?: string;
    };
    /** Contains the literal placeholders {tBefore} and {tAfter}. */
    conclusion: string;
  };
  /** "What the ceiling cannot fix" — the ONLY section that may link to Re-Sound. */
  cannotFix: { heading: string; paragraphs: Segment[][] };
  combined: { heading: string; paragraphs: string[] };
  faqs: { q: string; a: string }[];
  cta: { heading: string; body: string; button: string; productButton: string };
};
