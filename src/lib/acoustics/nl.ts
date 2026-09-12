// Acoustics page content — Dutch (Netherlands) — kantoortuin, Frisse Scholen, NPR 3438.
// Written natively for this market (own norms, vocabulary, worked example,
// FAQ); never a translation of another market's module and never copied to
// one. The route computes the Sabine numbers from `sabine.room`. The single
// Re-Sound link lives in `cannotFix` — the only section allowed to carry it.
import type { AcousticsContent } from './types';

export const nl: AcousticsContent = {
  meta: {
    title: 'Akoestisch plafond tegen galm in de kantoortuin | STRETCH',
    description: 'Geen bindende norm voor kantoorakoestiek in Nederland, wel NPR 3438, ISO 22955 en Frisse Scholen. Rekenvoorbeeld kantoortuin: van 1,6 s naar 0,4 s nagalm.',
  },
  eyebrow: 'Akoestiek en nagalm',
  h1: 'Galm in de kantoortuin: hoeveel haalt een akoestisch plafond eraf?',
  answer: [
    'In de meeste Nederlandse kantoortuinen zit het probleem niet tussen de bureaus maar boven uw hoofd: een gipsplaatplafond of een systeemplafond met gladde minerale platen dat zo\'n 95 % van de spraakenergie terugkaatst. Het rekenvoorbeeld verderop laat zien wat dat ene vlak doet. Een lege kantoortuin van 15 bij 10 meter gaat van 1,6 s nagalm naar ongeveer 0,4 s wanneer alleen het plafond wordt vervangen door een akoestisch spanplafond van absorptieklasse A (αw ≥ 0,90, ISO 11654). Dat is ruim onder de 0,5–0,8 s die adviseurs voor een kantoortuin aanhouden, zonder sloopwerk en meestal in één dag.',
    'Wanden en belcellen komen pas in beeld als de vraag verandert. Wilt u dat een collega op acht meter afstand niet meer woordelijk te volgen is, dan gaat het om de afname van spraak over afstand (D2,S uit NEN-EN-ISO 3382-3), en daar heeft u schermen tussen de bureaus en absorptie op de wanden voor nodig. Wilt u vertrouwelijk bellen of een uur ongestoord schrijven, dan is een gesloten belcel of focusruimte het enige dat werkt. Absorptie maakt geluid zachter, niet onhoorbaar.',
    'Op deze pagina: de richtwaarden en referenties die in Nederland gelden, het verschil met het systeemplafond dat u waarschijnlijk al heeft, het volledige rekenvoorbeeld met de formule van Sabine en de grenzen van wat een plafond kan.',
  ],
  why: {
    heading: 'Waarom is de kantoortuin om drie uur luider dan om negen uur?',
    paragraphs: [
      'Om negen uur zitten er zes mensen en is het rustig. Om drie uur zitten er dertig, staan er twee overleggen bij een bureau en belt iemand met een klant. Ieder gesprek weerkaatst op het systeemplafond, de glazen scheidingswanden en de gipsplaatwanden en blijft daar rondhangen. Het achtergrondniveau stapelt op: elk nieuw gesprek komt bovenop de restanten van alle andere. Wie zichzelf slecht hoort, praat luider, en zo tilt de ruimte zichzelf in de loop van de dag een paar decibel omhoog.',
      'Hoe ver spraak draagt, is meetbaar. In een kantoortuin met goede absorptie daalt het spraakniveau per verdubbeling van de afstand met 7 dB of meer (D2,S volgens NEN-EN-ISO 3382-3); in een galmende kantoortuin met harde vlakken is dat vaak maar 2 tot 3 dB. Een collega op acht meter klinkt dan bijna even luid als een collega op twee meter. Absorptie op het plafond vergroot die afname en verlaagt het achtergrondniveau, waardoor mensen vanzelf zachter gaan praten.',
      'Ter verduidelijking: de nagalmtijd T is de tijd in seconden waarin het geluidniveau 60 dB daalt nadat de bron stopt. Het is de maat die in de tabel hieronder staat en die u met de formule van Sabine zelf kunt inschatten.',
    ],
  },
  targets: {
    heading: 'Welke nagalmtijd is gebruikelijk per ruimte?',
    intro: 'Nederland kent voor kantoren geen enkele bindende norm voor ruimteakoestiek, wel een reeks referenties waar adviseurs en opdrachtgevers naar verwijzen. De waarden hieronder zijn ordes van grootte voor de nagalmtijd in de middenfrequenties, in gemeubileerde ruimtes, gerangschikt naar de vragen die wij het vaakst krijgen.',
    cols: {
      room: 'Ruimtetype',
      target: 'Richtwaarde T',
      norm: 'Referentie in Nederland',
    },
    rows: [
      {
        room: 'Kantoortuin',
        target: '0,5–0,8 s',
        norm: 'NEN-EN-ISO 3382-3 en ISO 22955 (D2,S, Lp,A,S,4m, rD); NPR 3438 voor geluid op de werkplek',
      },
      {
        room: 'Vergaderruimte',
        target: '0,5–0,7 s',
        norm: 'orde van grootte; NPR 3438 voor de werkplek',
      },
      {
        room: 'Concentratiewerkplek / stiltekamer',
        target: '0,4–0,6 s',
        norm: 'orde van grootte; ISO 22955 deelt open kantoren in naar activiteitstype, concentratiewerk stelt de strengste eis',
      },
      {
        room: 'Callcenter / klantcontact',
        target: '0,4–0,6 s',
        norm: 'orde van grootte; ISO 22955 (telefoonwerk) en NPR 3438',
      },
      {
        room: 'Klaslokaal',
        target: '0,5–0,8 s',
        norm: 'PvE Frisse Scholen (RVO) werkt met nagalmklassen A, B en C; welke klasse geldt, toetsen met uw adviseur',
      },
      {
        room: 'Wachtruimte huisartsen- of tandartspraktijk',
        target: '0,6–0,8 s',
        norm: 'orde van grootte; let ook op privacy van gesprekken aan de balie',
      },
      {
        room: 'Bedrijfsrestaurant / kantine',
        target: '0,6–1,0 s',
        norm: 'orde van grootte',
      },
    ],
    norms: [
      {
        name: 'PvE Frisse Scholen (RVO)',
        what: 'Vrijwillig Programma van Eisen van RVO voor schoolgebouwen; verdeelt onder meer de nagalmtijd van klaslokalen in klassen en is het uitgangspunt dat veel schoolbesturen en gemeenten bij nieuwbouw en renovatie nemen.',
      },
      {
        name: 'NPR 3438',
        what: 'Nederlandse praktijkrichtlijn over geluidhinder op de werkplek; beschrijft hoe u geluid in werkruimtes beoordeelt en beperkt.',
      },
      {
        name: 'NEN-EN-ISO 3382-3',
        what: 'Meetnorm voor kantoortuinen; meet niet alleen de nagalm, maar ook de afname van spraak over afstand (D2,S), het spraakniveau op 4 m (Lp,A,S,4m) en de afleidingsafstand rD.',
      },
      {
        name: 'ISO 22955',
        what: 'Richtlijn voor de akoestische kwaliteit van open kantoren, ingedeeld naar het soort werk dat er gebeurt.',
      },
      {
        name: 'ISO 11654',
        what: 'Deelt absorberende materialen in klassen A tot en met E op basis van αw; klasse A betekent αw ≥ 0,90.',
      },
      {
        name: 'EN 13501-1',
        what: 'Europese brandclassificatie van bouwproducten; het Acoustic Stretch System is B-s1,d0, met een A2-optie.',
      },
      {
        name: 'Bbl (voorheen Bouwbesluit 2012)',
        what: 'Het Besluit bouwwerken leefomgeving (Bbl, de opvolger van het Bouwbesluit) regelt de geluidwering tussen woningen; dat is geluidisolatie, iets anders dan de nagalm binnen één ruimte.',
      },
    ],
    acousticianNote: 'De genoemde waarden zijn richtwaarden, geen wettelijke grenzen. Controleer de exacte eis voor uw project altijd met de akoestisch adviseur; die kent het Programma van Eisen, de meetmethode en de toetsing die uw opdrachtgever verlangt.',
  },
  ceiling: {
    heading: 'Van systeemplafond naar klasse A: wat er boven uw hoofd verandert',
    paragraphs: [
      'Het meeste Nederlandse kantoor heeft al een plafond dat akoestisch oogt: een systeemplafond met minerale platen van 60 × 60 cm. Veel van die platen zijn glad, overgeschilderd of vervuild en halen daardoor niet meer dan absorptieklasse C of D; de galm in de kantoortuin komt dus vaak van een plafond dat er absorberend uitziet. Het Acoustic Stretch System overspant dat plafond of komt in de plaats van de platen: een microgeperforeerd doek met daarachter een absorber van polyesterwol met hoge dichtheid. Geluid gaat door de perforaties, verliest zijn energie in de wol en het hele vlak haalt in één keer klasse A (αw ≥ 0,90, ISO 11654).',
      'De 60 × 60-armaturen uit het systeemplafond worden overgenomen: ze krijgen een uitsparing in het doek of worden vervangen door vlakke ledpanelen of lijnverlichting die in het spanplafond is opgenomen. Inspectieluiken naar de luchtbehandeling boven het plafond blijven bereikbaar. Het doek zit in een clipprofiel langs de rand, wordt koud of warm gespannen en is tot 5,15 m breedte naadloos; een kantoorruimte is doorgaans in één dag geplaatst, zonder puin.',
      'Dat hetzelfde systeem ook strengere eisen aankan, laat de studio van Da Tweekaz zien: daar is het akoestische doek op het plafond én op de wanden toegepast, in een ruimte waar de nagalmtijd veel lager moet liggen dan in een kantoortuin. Voor een kantoor volstaat in de regel het plafond; de wanden komen pas aan bod wanneer de spraakafname over afstand het probleem is.',
    ],
    bullets: [
      'Absorptieklasse A (αw ≥ 0,90, ISO 11654) met absorberende vulling',
      'Naadloos tot 5,15 m breedte',
      'Brandklasse B-s1,d0 (EN 13501-1), optie A2',
      'Afwasbaar oppervlak, 10 jaar garantie',
      'Kleuren: wit, gebroken wit, grijs, antraciet; eigen print of RAL-kleur',
      'Montage onder of in plaats van het bestaande systeemplafond, met integratie van verlichting en inspectieluiken',
    ],
    productLink: {
      before: 'Alle technische gegevens vindt u op de productpagina van het ',
      anchor: 'Acoustic Stretch System',
      after: '.',
    },
  },
  sabine: {
    heading: 'Rekenvoorbeeld: een kantoortuin van 15 bij 10 meter',
    intro: 'De formule van Sabine zegt dat de nagalmtijd evenredig is met het volume van de ruimte en omgekeerd evenredig met de totale absorptie: T = 0,161 · V / A. Daarin is V het volume in m³ en A de equivalente absorptieoppervlakte in m² Sabine, de som van alle oppervlakten, elk vermenigvuldigd met de eigen absorptiecoëfficiënt α. Het voorbeeld hieronder is een lege kantoortuin: geen bureaus, geen kasten, geen mensen. Alleen het plafond verandert.',
    room: {
      name: 'Kantoortuin 15 × 10 × 3 m',
      length: 15,
      width: 10,
      height: 3,
      floor: {
        material: 'Dunne vloerbedekking',
        alpha: 0.2,
      },
      walls: {
        material: 'Gipsplaatwanden met glaspartijen',
        alpha: 0.05,
      },
      ceilingBefore: {
        material: 'Stucplafond op gipsplaat',
        alpha: 0.05,
      },
      ceilingAfter: {
        material: 'Akoestisch spanplafond met absorber',
        alpha: 0.9,
      },
    },
    labels: {
      volume: 'Volume V',
      surface: 'Oppervlak',
      area: 'Oppervlakte (m²)',
      alpha: 'α',
      absorption: 'Absorptie (m² Sabine)',
      before: 'Voor',
      after: 'Na',
      total: 'Totaal A',
      reverb: 'Nagalmtijd T',
      formulaNote: 'T = 0,161 · V / A',
      floor: 'Vloer',
      walls: 'Wanden',
      ceiling: 'Plafond',
    },
    conclusion: 'De lege kantoortuin gaat van {tBefore} naar {tAfter}: van ver boven de richtwaarde van 0,5–0,8 s tot eronder, alleen door het plafond. Met bureaus, kasten, scheidingsschermen en mensen erin verschuift de werkelijke waarde nog iets. Wat het plafond niet oplost, is hoe ver spraak door de ruimte draagt.',
  },
  cannotFix: {
    heading: 'Wat een akoestisch plafond niet oplost',
    paragraphs: [
      [
        {
          text: 'De nagalmtijd zegt hoe lang geluid blijft hangen, niet hoe ver het komt. In het rekenvoorbeeld zakt de kantoortuin van 1,6 s naar ongeveer 0,4 s, en toch is een collega op acht meter dan nog steeds woordelijk te verstaan: het plafond haalt de reflecties weg, maar het rechtstreekse geluid van mond naar oor blijft. NEN-EN-ISO 3382-3 meet daarom de spraakafname per verdubbeling van de afstand (D2,S) en de afleidingsafstand rD. Om die te verbeteren heeft u schermen tussen de bureaus, absorptie op de reflecterende wanden en aparte ruimtes voor bellen en overleg nodig. Daarvoor werken wij binnen de STRETCH Group samen met ons zusterbedrijf: ',
        },
        {
          text: 'de akoestische wandpanelen en focusruimtes van Re-Sound',
          href: 'https://re-sound.be/nl',
        },
        {
          text: ' vullen het plafond aan waar de absorptie boven uw hoofd ophoudt.',
        },
      ],
      [
        {
          text: 'Wat u door de wand of de vloer van een aangrenzende ruimte hoort, is geen nagalm maar geluidisolatie, en die verandert niet met een absorberend plafond. Voor een werkgever is dit een Arbo-vraag: NPR 3438 beschrijft hoe u geluid op de werkplek beoordeelt en beperkt, en maakt onderscheid tussen het geluid dat in de ruimte zelf ontstaat en het geluid dat van elders binnenkomt. Voor dat tweede helpen massa en ontkoppeling van de scheidingsconstructie. Ook onder ongeveer 125 Hz, het gebrom van installaties, doet een plafond weinig.',
        },
      ],
      [
        {
          text: 'Sabine gaat uit van een geluidveld dat gelijkmatig uit alle richtingen komt; in een lange, lage kantoortuin met glazen scheidingswanden klopt dat maar ten dele. Laat een akoestisch adviseur daarom voor en na de ingreep meten volgens NEN-EN-ISO 3382-3: naast T ook D2,S, Lp,A,S,4m en rD. Dan weet u niet alleen dat de galm weg is, maar ook of de spraak op de werkplekken voldoende is afgenomen, en heeft u een toetsbaar rapport voor de opdrachtgever of de RI&E.',
        },
      ],
    ],
  },
  combined: {
    heading: 'Eén project: plafond, wandpanelen en belcellen',
    paragraphs: [
      'Vraagt uw kantoortuin om meer dan een plafond, dan pakken wij het als één project aan: één opname op locatie, één plan, één planning. Het akoestisch spanplafond komt van STRETCH, de wandpanelen en de focus- en belcellen van Re-Sound, in hetzelfde kleurenschema. De belcellen worden binnen de groep gemaakt, in de eigen fabriek in Częstochowa.',
      'U heeft één aanspreekpunt. Laat u de nagalmtijd en de spraakafname vooraf en achteraf meten door uw akoestisch adviseur, dan staat zwart op wit wat de ingreep heeft opgeleverd.',
    ],
  },
  faqs: [
    {
      q: 'Kan het spanplafond over mijn bestaande systeemplafond heen, of moeten de platen eruit?',
      a: 'Beide kan. Het clipprofiel wordt langs de rand gemonteerd en het doek met absorber hangt onder de bestaande platen; die blijven zitten. Wilt u hoogte winnen, dan nemen we de platen en het rasterwerk weg en spannen we onder het constructieve plafond. In beide gevallen worden de 60 × 60-armaturen en inspectieluiken in het doek opgenomen en is een kantoorruimte doorgaans in één dag klaar.',
    },
    {
      q: 'Hoeveel dB stiller wordt mijn kantoortuin?',
      a: 'Dat hangt af van wat u meet. In het rekenvoorbeeld daalt de nagalmtijd van 1,6 s naar ongeveer 0,4 s; het galmende, rondhangende deel van het geluid neemt daarmee grofweg 6 dB af. Rechtstreekse spraak van een collega vlakbij wordt niet zachter. Wel gaan mensen in een minder galmende ruimte vanzelf zachter praten, waardoor het achtergrondniveau in de praktijk verder daalt dan de rekensom alleen laat zien.',
    },
    {
      q: 'Welke norm geldt in Nederland voor de akoestiek van een kantoor?',
      a: 'Er is geen bindende norm. Het Besluit bouwwerken leefomgeving (Bbl, de opvolger van het Bouwbesluit) regelt de geluidwering tussen woningen, niet de nagalm in een kantoor. Adviseurs werken met NPR 3438 voor geluid op de werkplek en met NEN-EN-ISO 3382-3 en ISO 22955 voor kantoortuinen; voor scholen is het Programma van Eisen Frisse Scholen van RVO de maatstaf.',
    },
    {
      q: 'Telt een akoestisch spanplafond mee voor het PvE Frisse Scholen?',
      a: 'Het PvE Frisse Scholen (RVO) stelt eisen aan de nagalmtijd van leslokalen, ingedeeld in klassen; het schrijft geen product voor. Een spanplafond van absorptieklasse A over het hele lokaal levert in de meeste gevallen de grootste bijdrage aan die nagalmtijd. Of de klasse wordt gehaald, hangt ook af van het volume, het meubilair en de wanden; laat uw adviseur het vooraf doorrekenen en na plaatsing meten.',
    },
    {
      q: 'Kan ik de nagalmtijd van mijn ruimte zelf inschatten?',
      a: 'Grofweg wel, met T = 0,161 · V / A. Meet lengte, breedte en hoogte voor het volume, vermenigvuldig elke oppervlakte met de bijbehorende absorptiecoëfficiënt en tel alles op. Vergelijk het resultaat met de richtwaarde uit de tabel, bijvoorbeeld 0,5–0,8 s voor een kantoortuin. Voor een toetsing aan ISO 22955 of het PvE Frisse Scholen is een meting door een adviseur nodig.',
    },
  ],
  cta: {
    heading: 'Wilt u weten wat het plafond in uw kantoortuin doet?',
    body: 'Heeft u een plattegrond of de maten van uw kantoortuin, vergaderruimte of lokaal? Wij rekenen de nagalmtijd voor en na uit en zeggen eerlijk of het plafond alleen volstaat of dat er wandpanelen of belcellen bij horen.',
    button: 'Laat uw nagalmtijd berekenen',
    productButton: 'Bekijk het Acoustic Stretch System',
  },
};
