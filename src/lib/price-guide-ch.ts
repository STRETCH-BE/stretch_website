// ============================================================================
// SWISS PRICE GUIDE — /spanndecke-preis-schweiz on stretchdecken.ch (de-CH).
// The ONLY public product prices on the Swiss site: INDICATIVE CHF/m² ranges
// for INSTALLED ceilings, agreed with QuinLay AG. Never materials, never
// dealer prices — those stay in the portal (existing rule).
//
// TODO(Michael): fill `low` / `high` for every finish from QuinLay's answer
// (CHF per m², installed, incl. 8.1 % MwSt.). Until EVERY range is filled:
//   - the page renders with a visible "Richtwerte folgen" notice and
//     "CHF – / m²" placeholders (so the layout can be reviewed),
//   - it is noindex, out of the sitemap and not linked from the dealer
//     pages (`priceGuideChReady` below flips all three automatically).
// Single-locale page: its copy lives HERE, next to the numbers it explains,
// not in the 16 message files — it renders on ch only, in Swiss German
// (no ß). Route, redirects and hreflang: src/app/[locale]/spanndecke-preis-
// schweiz/page.tsx, redirects.mjs (every other domain → its own price
// article), src/app/sitemap.xml/route.ts.
// ============================================================================

export type PriceGuideFinish = {
  key: 'matt' | 'satin' | 'gloss' | 'print' | 'lichtdecke' | 'akustik';
  name: string;
  blurb: string;
  /** CHF per m² installed, incl. 8.1 % MwSt. — null until QuinLay confirms. */
  low: number | null;
  high: number | null;
};

export const priceGuideCh = {
  route: '/spanndecke-preis-schweiz',
  /** Sitemap <lastmod> — bump when the ranges or the copy change. */
  updatedAt: '2026-09-03',
  meta: {
    title: 'Was kostet eine Spanndecke in der Schweiz? Richtpreise in CHF/m² | STRETCH × QuinLay AG',
    description:
      'Richtpreise für montierte Spanndecken in der Schweiz und in Liechtenstein: CHF pro m² nach Oberfläche – matt, satiniert, glänzend, bedruckt, Lichtdecke, Akustik. Inkl. 8.1 % MwSt., Montage durch QuinLay-Partner. Was den Preis bestimmt und wie Sie zur verbindlichen Offerte kommen.',
  },
  eyebrow: 'Richtpreise Schweiz & Liechtenstein',
  h1: 'Was kostet eine Spanndecke in der Schweiz?',
  lead:
    'Niemand in der Schweiz publiziert Spanndecken-Preise – darum finden Sie hier die Richtwerte, mit denen die QuinLay AG, unsere Generalvertretung für die Schweiz und Liechtenstein, montierte Decken kalkuliert. Alle Werte gelten pro Quadratmeter fertig montierte Decke.',
  vatNote:
    'Richtwerte inkl. 8.1 % MwSt., Montage durch QuinLay-Partner. Keine Offerte: der verbindliche Preis entsteht beim Aufmass vor Ort und hängt von Raumform, Ecken, Einbauten und Beleuchtung ab.',
  pendingNotice:
    'Richtwerte in Abstimmung mit der QuinLay AG – die CHF-Spannen werden ergänzt, sobald sie vorliegen.',
  pendingRange: 'Richtwert folgt',
  tableHeading: 'Richtpreise pro m² nach Oberfläche',
  tableCols: { finish: 'Oberfläche', range: 'CHF / m² montiert' },
  finishes: [
    {
      key: 'matt',
      name: 'Matt',
      blurb: 'Die klassische, einfarbige Decke – wirkt wie frisch verputzt und gestrichen, ohne Nähte und ohne Staub.',
      low: null,
      high: null,
    },
    {
      key: 'satin',
      name: 'Satiniert',
      blurb: 'Leichter Seidenglanz, der Licht weich verteilt – die beliebteste Wahl für Wohn- und Schlafräume.',
      low: null,
      high: null,
    },
    {
      key: 'gloss',
      name: 'Glänzend (Lack)',
      blurb: 'Spiegelnde Hochglanzfolie, die den Raum optisch höher und heller macht – Bad, Küche, Empfang.',
      low: null,
      high: null,
    },
    {
      key: 'print',
      name: 'Bedruckt',
      blurb: 'Ihr Motiv, Foto oder Muster auf der Decke – Fotodruck in Grossformat, inklusive Druckvorbereitung.',
      low: null,
      high: null,
    },
    {
      key: 'lichtdecke',
      name: 'Lichtdecke',
      blurb: 'Transluzente Folie mit LED-Fläche dahinter – gleichmässiges, dimmbares Licht aus der ganzen Decke, inkl. Lichtebene.',
      low: null,
      high: null,
    },
    {
      key: 'akustik',
      name: 'Akustik',
      blurb: 'Mikroperforierte Folie mit Absorber dahinter – weniger Nachhall in Büros, Restaurants und Wohnräumen, inkl. Akustikschicht.',
      low: null,
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
      title: 'Akustikschicht und Licht',
      body: 'Eine Akustikdecke besteht aus Folie plus Absorber, eine Lichtdecke aus Folie plus LED-Ebene – beides ist eine zweite Lage, die Material und Montage verdoppelt. Die Spannen oben enthalten diese Lagen bereits.',
    },
    {
      title: 'Untergrund und Zugänglichkeit',
      body: 'Alte Decken bleiben, wo sie sind – die Spanndecke wird davor montiert. Hohe Räume, Gerüste oder ein Wochenendtermin schlagen beim Montagepartner zu Buche.',
    },
  ],
  ctaHeading: 'Zur verbindlichen Offerte in drei Schritten',
  ctaBody:
    'Schicken Sie uns die Masse Ihres Raums, ein Foto und Ihre Wünsche – die QuinLay AG meldet sich innerhalb eines Werktags, klärt offene Punkte am Telefon oder im Showroom in Rickenbach LU und kommt für das Aufmass vor Ort. Danach erhalten Sie eine verbindliche Offerte in CHF.',
  ctaButton: 'Kostenlose Offerte anfordern',
  ctaShowroom: 'Showroom-Termin in Rickenbach LU',
  partnerLine: 'Beratung, Offerte, Aufmass und Montage: QuinLay AG, Stierenberg Park 1A, 6221 Rickenbach – Generalvertretung STRETCH Schweiz & Liechtenstein.',
  faqHeading: 'Häufige Fragen zum Preis',
  faqs: [
    {
      q: 'Sind die Richtwerte inklusive Montage?',
      a: 'Ja. Alle Spannen gelten pro Quadratmeter fertig montierte Decke, inkl. 8.1 % MwSt., montiert durch einen QuinLay-Partner. Nicht enthalten sind Leuchten und Elektroarbeiten, die Sie separat wählen.',
    },
    {
      q: 'Warum gibt es eine Spanne und keinen Fixpreis pro m²?',
      a: 'Weil Ecken, Ausschnitte und Raumform den Aufwand bestimmen, nicht nur die Fläche. Ein 30-m²-Wohnzimmer mit vier Ecken und zwei Spots liegt am unteren Rand, ein 8-m²-Bad mit sechs Spots und einer Schräge am oberen.',
    },
    {
      q: 'Wie schnell bekomme ich einen verbindlichen Preis?',
      a: 'Nach dem Aufmass vor Ort meist innerhalb weniger Werktage. Mit Massen, Foto und Ausstattungswunsch über das Formular auf dieser Seite erhalten Sie vorab eine erste Einschätzung.',
    },
    {
      q: 'Wer montiert in der Schweiz und in Liechtenstein?',
      a: 'Geschulte Montagepartner der QuinLay AG, unserer Generalvertretung mit Showroom, Schulungsraum und Lager in Rickenbach LU. Hergestellt wird jede Decke nach Mass in unseren Werken in Belgien und Polen.',
    },
  ],
  sources: { quote: 'price_guide_ch' },
};

/** Every range filled → the page is indexable, in the sitemap and linked. */
export const priceGuideChReady: boolean = priceGuideCh.finishes.every(
  (f) => typeof f.low === 'number' && typeof f.high === 'number',
);

/** "CHF 1 050" — Swiss grouping with a narrow no-break space, no decimals. */
export function formatChf(amount: number): string {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `CHF ${grouped}`;
}
