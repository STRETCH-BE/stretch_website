// Acoustics page content — German (Germany) — Besprechungsraum, DIN 18041, VDI 2569.
// Written natively for this market (own norms, vocabulary, worked example,
// FAQ); never a translation of another market's module and never copied to
// one. The route computes the Sabine numbers from `sabine.room`. The single
// Re-Sound link lives in `cannotFix` — the only section allowed to carry it.
import type { AcousticsContent } from './types';

export const de: AcousticsContent = {
  meta: {
    title: 'Akustikdecke gegen Nachhall: DIN 18041 & Sabine | STRETCH',
    description: 'Zu viel Nachhall im Besprechungsraum oder Großraumbüro? Eine Akustik-Spanndecke senkt die Nachhallzeit – Sollwerte nach DIN 18041 und Rechenbeispiel.',
  },
  eyebrow: 'Raumakustik mit Spanndecken',
  h1: 'Was hilft wirklich gegen Nachhall im Raum?',
  answer: [
    'Zuerst die Decke. Sie ist in fast jedem Raum die größte zusammenhängende Fläche, die weder von Türen und Fenstern noch von Möbeln unterbrochen wird. Wer dort Schall absorbiert, gewinnt mit einer einzigen Fläche die meiste Absorptionsfläche A – und damit die größte Senkung der Nachhallzeit. Eine Akustik-Spanndecke mit mikroperforierter Membran und Absorberauflage aus hochverdichteter Polyesterwolle erreicht Schallabsorptionsklasse A nach ISO 11654 – als geschlossene, fugenlose Fläche bis 5,15 m Breite.',
    'Dann die Wände. Reicht die Decke rechnerisch nicht aus, oder flattert der Schall zwischen zwei parallelen, harten Wänden hin und her, kommen Wandabsorber dazu. Für Großraumbüros gehören außerdem Wandpaneele sowie Telefon- und Meetingboxen ins Konzept, weil dort nicht nur die Nachhallzeit zählt, sondern auch, wie weit sich Sprache im Raum ausbreitet.',
    'Wie viel Absorption Ihr Raum braucht, lässt sich mit der Sabine-Formel abschätzen. Weiter unten rechnen wir es für einen Besprechungsraum vor und vergleichen das Ergebnis mit dem Sollwert nach DIN 18041.',
  ],
  why: {
    heading: 'Warum Räume mit harten Oberflächen so laut sind',
    paragraphs: [
      'Gipskarton, Beton und Glas reflektieren den Schall fast vollständig: Bei einem Absorptionsgrad von 0,05 werden 95 % der Schallenergie in den Raum zurückgeworfen; Parkett liegt mit 0,07 kaum besser. Jedes gesprochene Wort läuft mehrfach zwischen Decke, Wänden und Boden hin und her, bevor es abklingt. Diese Abklingzeit ist die Nachhallzeit T. Je länger die Nachhallzeit, desto stärker überlagern sich aufeinanderfolgende Silben und desto mehr sinkt die Sprachverständlichkeit.',
      'Dazu kommt der Lombard-Effekt: Wer sein Gegenüber schlecht versteht, spricht lauter. Der Raum wird lauter, alle erhöhen die Stimme, und der Pegel schaukelt sich hoch. In Kantinen, Großraumbüros und Klassenräumen ist genau das der Grund, warum ein Tag dort so ermüdend ist.',
      'Die DIN 18041 nennt dieses Ziel Hörsamkeit: ein Raum, in dem Sprache ohne Anstrengung verstanden wird. Absorption an Decke und Wänden ist der Weg dorthin.',
    ],
  },
  targets: {
    heading: 'Welche Nachhallzeit ist für welchen Raum sinnvoll?',
    intro: 'Die folgenden Werte sind praxisübliche Größenordnungen für die mittlere Nachhallzeit in möblierten Räumen. Die DIN 18041 leitet den Sollwert aus dem Raumvolumen ab; in Großraumbüros kommen weitere Kenngrößen hinzu.',
    cols: {
      room: 'Raumtyp',
      target: 'Nachhallzeit (Mittelwert)',
      norm: 'Bezug',
    },
    rows: [
      {
        room: 'Klassenraum / Gruppenraum',
        target: '0,5–0,8 s',
        norm: 'DIN 18041, Nutzungsart A3, volumenabhängig; bei inklusiver Nutzung A4 mit niedrigerem Sollwert – mit dem Akustiker prüfen',
      },
      {
        room: 'Besprechungsraum',
        target: '0,5–0,7 s',
        norm: 'DIN 18041, Nutzungsart A3, volumenabhängig',
      },
      {
        room: 'Großraumbüro',
        target: '0,5–0,8 s',
        norm: 'VDI 2569, ISO 22955, ISO 3382-3 (zusätzlich D2,S, Lp,A,S,4m, rD)',
      },
      {
        room: 'Restaurant / Kantine',
        target: '0,6–1,0 s',
        norm: 'Richtwert',
      },
      {
        room: 'Heimkino / Regieraum',
        target: '0,2–0,4 s',
        norm: 'Richtwert',
      },
      {
        room: 'Sporthalle',
        target: '1,5–2,0 s',
        norm: 'DIN 18041, Nutzungsart A5, stark volumenabhängig',
      },
    ],
    norms: [
      {
        name: 'DIN 18041:2016',
        what: 'Hörsamkeit in Räumen: legt für die Nutzungsarten A1 bis A5 volumenabhängige Sollwerte der Nachhallzeit fest, z. B. für A3 (Unterricht/Kommunikation) Tsoll = 0,32 · lg(V/m³) − 0,17 s.',
      },
      {
        name: 'VDI 2569',
        what: 'Schallschutz und akustische Gestaltung in Büros: Planungsgrundlage für Einzel-, Gruppen- und Großraumbüros.',
      },
      {
        name: 'ISO 22955',
        what: 'Akustische Qualität offener Bürolandschaften: ordnet Bürotypen nach Tätigkeit und benennt passende akustische Anforderungen.',
      },
      {
        name: 'ISO 3382-3',
        what: 'Messung der Raumakustik in Großraumbüros: definiert die räumliche Abklingrate der Sprache D2,S (in dB je Abstandsverdopplung), den A-bewerteten Sprachpegel in 4 m Abstand Lp,A,S,4m und den Ablenkungsabstand rD.',
      },
      {
        name: 'ASR A3.7 „Lärm“',
        what: 'Technische Regel für Arbeitsstätten: konkretisiert die Anforderungen der Arbeitsstättenverordnung an den Schutz vor Lärm, einschließlich raumakustischer Anforderungen an Arbeitsräume.',
      },
      {
        name: 'ISO 11654',
        what: 'Schallabsorptionsklassen A bis E nach dem bewerteten Schallabsorptionsgrad αw; Klasse A bedeutet αw ≥ 0,90.',
      },
      {
        name: 'EN 13501-1',
        what: 'Europäische Klassifizierung des Brandverhaltens von Bauprodukten; das Acoustic Stretch System ist als B-s1,d0 klassifiziert, optional als A2-s1,d0.',
      },
    ],
    acousticianNote: 'Alle Werte sind Größenordnungen aus der Praxis, keine Grenzwerte. Den genauen Sollwert für Ihren Raum – Nutzungsart, Volumen, Toleranzbereich – prüfen Sie bitte immer mit dem Akustiker Ihres Projekts.',
  },
  ceiling: {
    heading: 'Die Akustik-Spanndecke: Klasse A auf der größten Fläche im Raum',
    paragraphs: [
      'Das Acoustic Stretch System besteht aus zwei Lagen. Vorne eine Spannmembran mit feinen Mikroperforationen, die dennoch wie eine geschlossene Fläche wirkt. Dahinter eine Absorberauflage aus hochverdichteter Polyesterwolle. Der Schall tritt durch die Perforation ein, verliert im Absorber seine Energie und kommt nur zu einem kleinen Teil in den Raum zurück. So erreicht die Decke einen bewerteten Schallabsorptionsgrad αw von 0,90 und damit Klasse A nach ISO 11654.',
      'Montiert wird die Membran kalt oder warm in ein umlaufendes Klemmprofil – ohne Fugen, ohne sichtbares Raster, bis 5,15 m Breite aus einem Stück. Im Bestand sitzt das System unter der vorhandenen Decke: kein Abbruch. Leuchten und Revisionsklappen werden eingeplant, und ein Raum ist in der Regel innerhalb eines Tages fertig. Dasselbe System eignet sich auch für Wände sowie als frei hängende Deckensegel oder Baffles; Lautsprecher lassen sich unsichtbar hinter der Membran einbauen.',
    ],
    bullets: [
      'Schallabsorptionsklasse A (αw ≥ 0,90 nach ISO 11654) mit Absorberauflage',
      'Fugenlos bis 5,15 m Breite',
      'Brandverhalten B-s1,d0 nach EN 13501-1, optional A2-s1,d0',
      'Abwaschbare Oberfläche, 10 Jahre Garantie',
      'Farben: Weiß, Cremeweiß, Grau, Anthrazit, jeder RAL-Ton oder Digitaldruck mit eigenem Motiv',
      'Auch für Wände, Deckensegel und Baffles – mit verdeckten Lautsprechern',
    ],
    productLink: {
      before: 'Alle technischen Daten finden Sie auf der Produktseite zum ',
      anchor: 'Acoustic Stretch System',
      after: '.',
    },
  },
  sabine: {
    heading: 'Rechenbeispiel: Besprechungsraum vor und nach der Akustikdecke',
    intro: 'Die Sabine-Formel schätzt die Nachhallzeit aus zwei Größen: dem Raumvolumen V und der äquivalenten Absorptionsfläche A. A ist die Summe aller Oberflächen, jede multipliziert mit ihrem Absorptionsgrad α. Je größer A im Verhältnis zu V, desto kürzer der Nachhall. Das Beispiel rechnet bewusst mit einem leeren, unbesetzten Raum ohne Möbel und Personen, damit nur die Wirkung der Decke sichtbar wird.',
    room: {
      name: 'Besprechungsraum',
      length: 8,
      width: 5,
      height: 2.8,
      floor: {
        material: 'Parkett',
        alpha: 0.07,
      },
      walls: {
        material: 'Gipskarton mit Verglasung',
        alpha: 0.05,
      },
      ceilingBefore: {
        material: 'Putzdecke',
        alpha: 0.05,
      },
      ceilingAfter: {
        material: 'Akustik-Spanndecke mit Absorber',
        alpha: 0.9,
      },
    },
    labels: {
      volume: 'Raumvolumen V',
      surface: 'Oberfläche',
      area: 'Fläche (m²)',
      alpha: 'α',
      absorption: 'Absorption (m² Sabine)',
      before: 'Vorher',
      after: 'Nachher',
      total: 'Summe A',
      reverb: 'Nachhallzeit T (leer, unbesetzt)',
      formulaNote: 'Berechnet nach Sabine: T = 0,161 · V / A.',
      floor: 'Boden',
      walls: 'Wände',
      ceiling: 'Decke',
      dinTarget: 'Sollwert nach DIN 18041, A3 (besetzter Raum)',
    },
    conclusion: 'Mit der Putzdecke hat der leere Raum eine Nachhallzeit von {tBefore}, mit der Akustik-Spanndecke von {tAfter} – das liegt in der Größenordnung des Sollwerts nach DIN 18041 für Nutzungsart A3 und leicht unter der praxisüblichen Spanne von 0,5–0,7 s für Besprechungsräume. Der Sollwert der DIN 18041 gilt allerdings für den besetzten Raum: Mit Tisch, Stühlen und Personen fällt die reale Nachhallzeit noch etwas niedriger aus und kann unter den Toleranzbereich fallen – deshalb legt der Akustiker fest, ob die ganze Decke oder nur ein Teil absorbierend ausgeführt wird.',
  },
  cannotFix: {
    heading: 'Was eine Akustikdecke nicht leisten kann',
    paragraphs: [
      [
        {
          text: 'Der Sollwert der DIN 18041 ist keine einzelne Zahl. Die Norm verlangt, dass das Verhältnis T/Tsoll in den Oktavbändern von 250 Hz bis 2 kHz zwischen 0,8 und 1,2 liegt; bei 125 Hz ist der Toleranzbereich nach oben weiter gefasst, weil tiefe Frequenzen schwerer zu absorbieren sind. Ein Raum kann also bei 1 kHz exakt den Sollwert treffen und trotzdem außerhalb des Toleranzbereichs liegen, wenn der Nachhall bei 125 Hz zu lang bleibt.',
        },
      ],
      [
        {
          text: 'Genau hier liegt die Grenze einer Deckenabsorption. Der bewertete Schallabsorptionsgrad αw, der die Klasse A begründet, wird vom mittleren Frequenzbereich bestimmt. Ein Absorber vor der Decke wirkt bei 125 Hz – Wellenlänge rund 2,7 m – deutlich schwächer als bei 1 kHz; der Absorptionsgrad hängt dort vor allem vom Abstand zur Rohdecke ab. Bleibt der Raum bei 125 Hz außerhalb des Toleranzbereichs, sind zusätzlich Kantenabsorber entlang der Decke-Wand-Kante oder Bassfallen in den Raumecken nötig – wie viel davon, legt der Akustiker fest.',
        },
      ],
      [
        {
          text: 'Auch das Gegenteil ist ein Mangel: Die DIN 18041 nennt mit 0,8 · Tsoll eine Untergrenze. Ein überdämpfter Raum klingt dumpf, Sprechende müssen ihre Stimme stärker anstrengen, weil der Raum sie nicht mehr trägt, und in Vortragsräumen (A2) fehlt den hinteren Reihen die Stützung durch frühe Reflexionen. Da der Sollwert für den besetzten Raum gilt, kann eine vollflächige Klasse-A-Decke in einem kleinen, gut möblierten Besprechungsraum bereits zu weit gehen. Deshalb zeigt das Rechenbeispiel nur den leeren Zustand – und deshalb kann die Planung auf eine Teilfläche hinauslaufen.',
        },
      ],
      [
        {
          text: 'Für Arbeitsstätten konkretisiert die ASR A3.7 „Lärm“ die Arbeitsstättenverordnung. Sie fordert raumakustische Maßnahmen im Arbeitsraum – genau das leistet die Absorption an der Decke. Sie ist aber nicht mit Schalldämmung zu verwechseln: Luftschall und Trittschall aus dem Nachbarraum werden über Bauteile nach DIN 4109 (R\'w, DnT,w, L\'n,w) begrenzt, nicht über Absorber; ebenso wenig senkt eine Akustikdecke den Pegel einer lauten Lüftungsanlage an der Quelle. Und wo Beschäftigte vertraulich telefonieren oder ungestört arbeiten müssen, braucht es eine raumtrennende Lösung: geschlossene Räume oder Boxen. Passende ',
        },
        {
          text: 'PET-Akustikpaneele von Re-Sound',
          href: 'resound:panels',
        },
        {
          text: ' und ',
        },
        {
          text: 'Telefon- und Meetingboxen',
          href: 'resound:booths',
        },
        {
          text: ' gibt es innerhalb der STRETCH Group.',
        },
      ],
    ],
  },
  combined: {
    heading: 'Bestandsbüro sanieren: Akustikdecke, Wandpaneele und Telefonboxen aus einer Hand',
    paragraphs: [
      'Typischer Ausgangspunkt in Deutschland ist ein Bürogebäude aus den 1990er-Jahren: abgehängte Rasterdecke 625 × 625 mm mit gealterten Mineralfaserplatten, Glastrennwände, Teppichfliesen – und eine Nachhallzeit, die trotz „Akustikplatten“ über den Empfehlungen der VDI 2569 liegt. STRETCH spannt die Akustik-Spanndecke als fugenlose Ebene unter oder anstelle des Rasters; die Unterkonstruktion kann bleiben, Leuchten und Revisionsöffnungen werden übernommen. Für das Bauamt und das Brandschutzkonzept ist die Klassifizierung B-s1,d0 nach EN 13501-1 dokumentiert; wo die Landesbauordnung eine nichtbrennbare Deckenbekleidung verlangt, etwa in notwendigen Fluren, kommt die Ausführung A2-s1,d0 zum Einsatz.',
      'Das Gesamtprojekt liefern STRETCH und Re-Sound gemeinsam: ein Aufmaß, ein Ansprechpartner, ein Terminplan. Die Akustik-Spanndecke montiert STRETCH; Wandpaneele sowie Telefon- und Meetingboxen kommen von Re-Sound und werden im gruppeneigenen Werk in Częstochowa gefertigt. Die Decke bringt die Nachhallzeit in den Bereich der VDI 2569, die Wandpaneele brechen die Reflexionen zwischen Glastrennwand und Gipskartonwand, die Boxen nehmen die Telefonate aus dem Raum.',
      'Dass dasselbe System auch deutlich strengere Ziele erreicht, zeigen die Studioprojekte der Gruppe, etwa das Tonstudio des Produzentenduos Da Tweekaz, in dem die Sollnachhallzeit weit unter den Bürowerten liegt. Ihr Projekt planen wir individuell mit Ihrem Akustiker und stellen ihm die Messdaten des Systems zur Verfügung.',
    ],
  },
  faqs: [
    {
      q: 'Welche Nachhallzeit schreibt die DIN 18041 für einen Besprechungsraum vor?',
      a: 'Die DIN 18041 nennt keinen festen Wert, sondern eine Formel je Nutzungsart. Kleine und mittlere Besprechungsräume werden in der Regel A3 (Unterricht/Kommunikation) zugeordnet, größere Konferenzräume ggf. A2 (Sprache/Vortrag). Für A3 gilt Tsoll = 0,32 · lg(V/m³) − 0,17 s; für einen Raum mit 112 m³ ergibt das rund 0,5 s. Dazu kommen ein Toleranzbereich und die Anforderung, dass der Wert über die relevanten Frequenzen weitgehend eingehalten wird. Den verbindlichen Sollwert bestätigt der Akustiker.',
    },
    {
      q: 'Was ist der Unterschied zwischen Nutzungsart A2 und A3?',
      a: 'Beide sind Nutzungsarten der DIN 18041 für Sprache. A2 „Sprache/Vortrag“ meint Räume, in denen eine Person zu vielen spricht – Vortrags- und Konferenzsäle, Gerichtssäle. A3 „Unterricht/Kommunikation“ meint wechselseitiges Sprechen – Klassenräume, Seminar- und Besprechungsräume. A3 hat den strengeren Sollwert: 0,32 · lg(V/m³) − 0,17 s statt 0,37 · lg(V/m³) − 0,14 s. Für 112 m³ heißt das etwa 0,5 s statt 0,6 s. Bei inklusiver Nutzung gilt A4 mit noch kürzerer Nachhallzeit.',
    },
    {
      q: 'Brauche ich einen Nachweis nach DIN 18041 für die Baugenehmigung oder den Arbeitsschutz (ASR A3.7)?',
      a: 'Die DIN 18041 ist keine Bauvorschrift, sondern eine anerkannte Regel der Technik. Das Bauamt verlangt in der Regel keinen raumakustischen Nachweis, wohl aber die Brandklassifizierung der Deckenbekleidung nach EN 13501-1. Für Arbeitsstätten fordert die ASR A3.7 „Lärm“ raumakustische Maßnahmen und verweist dabei auf die DIN 18041; Bauherren, Unfallkassen und Schulträger lassen sich die Einhaltung häufig rechnerisch oder messtechnisch belegen. Diesen Nachweis erstellt der Akustiker – wir liefern ihm die Absorptionsdaten des Systems.',
    },
    {
      q: 'Wie groß muss die absorbierende Fläche sein, wenn nur ein Teil der Decke ausgeführt wird?',
      a: 'Aus der Sabine-Formel folgt die benötigte Absorptionsfläche: A = 0,161 · V / Tsoll. Davon ziehen Sie ab, was Boden, Wände und Einrichtung schon absorbieren; den Rest teilen Sie durch die Differenz der Absorptionsgrade zwischen neuer und alter Decke (0,90 − 0,05 = 0,85). Für den Besprechungsraum aus dem Beispiel wären das rund 34 der 40 m² Decke im leeren Zustand – im möblierten, besetzten Raum entsprechend weniger. Die restliche Fläche kann als unperforierte Spanndecke ausgeführt werden.',
    },
    {
      q: 'Was steckt hinter der Schallabsorptionsklasse A?',
      a: 'Klasse A ist die höchste der fünf Schallabsorptionsklassen der ISO 11654 und setzt einen bewerteten Schallabsorptionsgrad αw von mindestens 0,90 voraus (B: 0,80–0,85, C: 0,60–0,75, D: 0,30–0,55, E: 0,15–0,25). αw wird ermittelt, indem die im Hallraum gemessenen Absorptionsgrade mit einer Bezugskurve verglichen werden; er beschreibt vor allem den sprachrelevanten Bereich. Das Acoustic Stretch System erreicht Klasse A mit Absorberauflage. Für den Nachweis nach DIN 18041 zählen jedoch die Werte je Oktavband, nicht nur αw.',
    },
  ],
  cta: {
    heading: 'Wie stark hallt Ihr Raum?',
    body: 'Schicken Sie uns die Maße Ihres Raums und nennen Sie uns die vorhandenen Oberflächen. Sie erhalten eine unverbindliche Einschätzung der Nachhallzeit vor und nach dem Einbau einer Akustik-Spanndecke sowie ein Angebot für Ihr Projekt – auf Wunsch abgestimmt mit Ihrem Akustiker.',
    button: 'Nachhallzeit einschätzen lassen',
    productButton: 'Zum Acoustic Stretch System',
  },
};
