// ============================================================================
// SWISS PRICE GUIDE — /spanndecke-preis-schweiz on stretchdecken.ch (de-CH).
// The ONLY public product prices on the Swiss site: INDICATIVE CHF/m² ranges
// for INSTALLED ceilings, agreed with QuinLay AG. Never materials, never
// dealer or portal prices — those stay in the portal (existing rule).
//
// TODO(Michael): fill `low` / `high` for every finish from QuinLay's answer
// (CHF per m², installed, incl. 8.1 % MwSt.) and `offerteWithinDays` (the
// number of working days QuinLay commits to for the written Offerte). Until a
// range is filled its row renders "Richtwerte folgen" — never a made-up
// number. Since the 1-month review (2 Oct 2026) the page ships, is indexed,
// sits in the ch sitemap and is linked from the home hero, the footer, every
// Swiss place page and the FAQ with the placeholders visible; the ranges are
// dropped in here when they arrive, nothing else changes.
// Single-locale page: its copy lives HERE, next to the numbers it explains,
// not in the 16 message files — it renders on ch only, in Swiss German
// (no ß). Route, redirects and hreflang: src/app/[locale]/spanndecke-preis-
// schweiz/page.tsx, redirects.mjs (every other domain → its own price
// article), src/app/sitemap.xml/route.ts.
// ============================================================================
import { priceGuideChRoute } from './price-guide-ch-route';

export type PriceGuideFinish = {
  key: 'matt' | 'satin' | 'gloss' | 'print' | 'lichtdecke' | 'akustik';
  name: string;
  blurb: string;
  /** CHF per m² installed, incl. 8.1 % MwSt. — null until QuinLay confirms. */
  low: number | null;
  high: number | null;
};

export const priceGuideCh = {
  route: priceGuideChRoute,
  /** Sitemap <lastmod> — bump when the ranges or the copy change. */
  updatedAt: '2026-10-02',
  /** TODO(Michael): working days from the Aufmass to the written Offerte
   *  (QuinLay's commitment). null → the page says "genaue Frist folgt". */
  offerteWithinDays: null as number | null,
  meta: {
    title: 'Was kostet eine Spanndecke in der Schweiz? Richtpreise in CHF/m² | STRETCH × QuinLay AG',
    description:
      'Richtpreise für montierte Spanndecken in der Schweiz und in Liechtenstein: CHF pro m² nach Oberfläche – matt, satiniert, glänzend, bedruckt, Lichtdecke, Akustik. Inkl. 8.1 % MwSt., Montage durch QuinLay AG bzw. STRETCH-Partner, unverbindlich. Was den Preis bestimmt und wie Sie zur Offerte kommen.',
  },
  eyebrow: 'Richtpreise Schweiz & Liechtenstein',
  h1: 'Was kostet eine Spanndecke in der Schweiz?',
  lead:
    'Niemand in der Schweiz publiziert Spanndecken-Preise – darum finden Sie hier die Richtwerte, mit denen die QuinLay AG, unsere Generalvertretung für die Schweiz und Liechtenstein, montierte Decken kalkuliert. Alle Werte gelten pro Quadratmeter fertig montierte Decke.',
  vatNote:
    'Richtwerte inkl. 8.1 % MwSt., Montage durch QuinLay AG bzw. STRETCH-Partner, unverbindlich. Der verbindliche Preis entsteht beim Aufmass vor Ort und hängt von Raumform, Ecken, Einbauten und Beleuchtung ab.',
  pendingNotice:
    'Richtwerte folgen – die CHF-Spannen werden in Abstimmung mit der QuinLay AG ergänzt, sobald sie vorliegen.',
  pendingRange: 'Richtwerte folgen',
  tableHeading: 'Richtpreise pro m² nach Oberfläche',
  tableCols: { finish: 'Oberfläche', range: 'CHF / m² montiert' },
  finishes: [
    {
      key: 'matt',
      name: 'Matt',
      blurb: 'Die klassische, einfarbige Decke – wirkt wie frisch verputzt und gestrichen, ohne Nähte und ohne Staub.',
      low: null, // TODO(Michael): CHF/m² from QuinLay
      high: null,
    },
    {
      key: 'satin',
      name: 'Satiniert',
      blurb: 'Leichter Seidenglanz, der Licht weich verteilt – die beliebteste Wahl für Wohn- und Schlafräume.',
      low: null, // TODO(Michael)
      high: null,
    },
    {
      key: 'gloss',
      name: 'Glänzend (Lack)',
      blurb: 'Spiegelnde Hochglanzfolie, die den Raum optisch höher und heller macht – Bad, Küche, Empfang.',
      low: null, // TODO(Michael)
      high: null,
    },
    {
      key: 'print',
      name: 'Bedruckt',
      blurb: 'Ihr Motiv, Foto oder Muster auf der Decke – Fotodruck in Grossformat, inklusive Druckvorbereitung.',
      low: null, // TODO(Michael)
      high: null,
    },
    {
      key: 'lichtdecke',
      name: 'Lichtdecke',
      blurb: 'Transluzente Folie mit LED-Fläche dahinter – gleichmässiges, dimmbares Licht aus der ganzen Decke, inkl. Lichtebene.',
      low: null, // TODO(Michael)
      high: null,
    },
    {
      key: 'akustik',
      name: 'Akustik',
      blurb: 'Mikroperforierte Folie mit Absorber dahinter – weniger Nachhall in Büros, Restaurants und Wohnräumen, inkl. Akustikschicht.',
      low: null, // TODO(Michael)
      high: null,
    },
  ] as PriceGuideFinish[],
  driversHeading: 'Was den Preis bestimmt',
  drivers: [
    {
      title: 'Raumform und Grösse',
      body: 'Ein rechteckiger Raum mit vier Ecken ist der günstigste Fall. Erker, Nischen, Schrägen und Rundungen brauchen mehr Profil und mehr Montagezeit pro Quadratmeter – kleine Räume liegen deshalb pro m² höher als grosse.',
    },
    {
      title: 'Ecken und Profil',
      body: 'Jede zusätzliche Ecke ist ein Gehrungsschnitt und ein Anschluss. Auch die Wahl des Randprofils – sichtbar, schattenfugig oder unsichtbar – bewegt den Preis.',
    },
    {
      title: 'Spots, Leuchten und Einbauten',
      body: 'Jeder Spot, jede Pendelleuchte, jeder Rauchmelder und jede Lüftungsöffnung wird mit einem Verstärkungsring vorbereitet und ausgeschnitten. Die Anzahl der Ausschnitte ist nach der Fläche der wichtigste Preisfaktor.',
    },
    {
      title: 'Akustikschicht',
      body: 'Eine Akustikdecke besteht aus mikroperforierter Folie plus Absorber dahinter – eine zweite Lage, die Material und Montage erhöht. Die Spanne für Akustik oben enthält diese Lage bereits.',
    },
    {
      title: 'Lichtdecke',
      body: 'Eine Lichtdecke ist transluzente Folie plus LED-Ebene dahinter, inklusive Treiber und Dimmung. Die Spanne für Lichtdecken enthält die Lichtebene; die Elektroinstallation bis zur Decke bleibt beim Elektriker.',
    },
    {
      title: 'Untergrund und Zugänglichkeit',
      body: 'Alte Decken bleiben, wo sie sind – die Spanndecke wird davor montiert. Hohe Räume, Gerüste oder ein Wochenendtermin schlagen beim Montagepartner zu Buche.',
    },
  ],
  offerteHeading: 'So kommen Sie zur Offerte',
  offerteLead:
    'Drei Schritte von der ersten Frage zur verbindlichen Offerte in CHF – alle über die QuinLay AG, unsere Generalvertretung für die Schweiz und Liechtenstein.',
  offerteSteps: [
    {
      title: 'Beratung im Showroom Rickenbach LU',
      body: 'Oberflächen, Profile, Licht und Akustik am Original anschauen – im Showroom der QuinLay AG, Stierenberg Park 1A, 6221 Rickenbach, oder vorab per Telefon und Formular mit Massen, Foto und Ausstattungswunsch.',
    },
    {
      title: 'Aufmass vor Ort',
      body: 'Ein Montagepartner der QuinLay AG misst den Raum aus, zählt Ecken und Ausschnitte und klärt Untergrund, Anschlüsse und Beleuchtung – die Grundlage für einen verbindlichen Preis.',
    },
    {
      title: 'Offerte in CHF',
      // The time span is appended at render time (offerteWithin below).
      body: 'Sie erhalten eine schriftliche, verbindliche Offerte in CHF inkl. 8.1 % MwSt. – Material nach Mass aus unseren Werken in Belgien und Polen, Montage durch die QuinLay AG bzw. STRETCH-Partner.',
    },
  ],
  ctaButton: 'Kostenlose Offerte anfordern',
  ctaShowroom: 'Showroom-Termin in Rickenbach LU',
  partnerLine: 'Beratung, Offerte, Aufmass und Montage: QuinLay AG, Stierenberg Park 1A, 6221 Rickenbach – Generalvertretung STRETCH Schweiz & Liechtenstein.',
  faqHeading: 'Häufige Fragen zum Preis',
  faqs: [
    {
      q: 'Sind die Richtwerte inklusive Montage?',
      a: 'Ja. Alle Spannen gelten pro Quadratmeter fertig montierte Decke, inkl. 8.1 % MwSt., montiert durch die QuinLay AG bzw. einen STRETCH-Partner. Nicht enthalten sind Leuchten und Elektroarbeiten, die Sie separat wählen.',
    },
    {
      q: 'Warum gibt es eine Spanne und keinen Fixpreis pro m²?',
      a: 'Weil Ecken, Ausschnitte und Raumform den Aufwand bestimmen, nicht nur die Fläche. Ein 30-m²-Wohnzimmer mit vier Ecken und zwei Spots liegt am unteren Rand, ein 8-m²-Bad mit sechs Spots und einer Schräge am oberen.',
    },
    {
      q: 'Wie schnell bekomme ich einen verbindlichen Preis?',
      a: 'Nach dem Aufmass vor Ort erhalten Sie die schriftliche Offerte innerhalb weniger Werktage. Mit Massen, Foto und Ausstattungswunsch über das Formular auf dieser Seite erhalten Sie vorab eine erste Einschätzung.',
    },
    {
      q: 'Wer montiert in der Schweiz und in Liechtenstein?',
      a: 'Geschulte Montagepartner der QuinLay AG, unserer Generalvertretung mit Showroom, Schulungsraum und Lager in Rickenbach LU. Hergestellt wird jede Decke nach Mass in unseren Werken in Belgien und Polen.',
    },
    {
      q: 'Gelten die Richtwerte auch in Liechtenstein?',
      a: 'Ja. Die QuinLay AG betreut Liechtenstein von Rickenbach LU aus mit, die Mehrwertsteuer ist dieselbe (8.1 %) und die Richtwerte gelten unverändert. Ob die längere Anfahrt nach Vaduz separat berechnet wird, sehen Sie transparent in der Offerte.',
    },
  ],
  sources: { quote: 'price_guide_ch' },
};

/** Every range filled → the "Richtwerte folgen" notice disappears. The page
 *  is indexed, in the sitemap and linked either way (review, 2 Oct 2026). */
export const priceGuideChReady: boolean = priceGuideCh.finishes.every(
  (f) => typeof f.low === 'number' && typeof f.high === 'number',
);

/** "innerhalb von 5 Werktagen", or the honest placeholder while the number is open. */
export function offerteWithin(days: number | null = priceGuideCh.offerteWithinDays): string {
  if (typeof days === 'number' && days > 0) return days === 1 ? 'innerhalb von 1 Werktag' : `innerhalb von ${days} Werktagen`;
  return 'innerhalb weniger Werktage (genaue Frist folgt)';
}

/** "CHF 1 050" — Swiss grouping with a narrow no-break space, no decimals. */
export function formatChf(amount: number): string {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `CHF ${grouped}`;
}
