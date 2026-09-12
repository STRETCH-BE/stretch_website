// Acoustics page content — Dutch (Belgium) — Flemish classroom, NBN S 01-400-2.
// Written natively for this market (own norms, vocabulary, worked example,
// FAQ); never a translation of another market's module and never copied to
// one. The route computes the Sabine numbers from `sabine.room`. The single
// Re-Sound link lives in `cannotFix` — the only section allowed to carry it.
import type { AcousticsContent } from './types';

export const be: AcousticsContent = {
  meta: {
    title: 'Nagalm verminderen met een akoestisch plafond | STRETCH',
    description: 'Nagalm in uw klas of kantoor? Zo verlaagt een akoestisch spanplafond (klasse A) de nagalmtijd, wat NBN S 01-400-2 vraagt en wanneer wanden nodig zijn.',
  },
  eyebrow: 'Akoestiek in de praktijk',
  h1: 'Hoe verminder ik de nagalm in mijn leslokaal of kantoor?',
  answer: [
    'Begin bij het plafond. Het is het grootste ononderbroken oppervlak van de ruimte en in een klassiek leslokaal of kantoor is het gepleisterd of in gyproc: hard, dus bijna volledig weerkaatsend. Een akoestisch spanplafond met een microgeperforeerd membraan en een polyesterwolabsorber erachter haalt absorptieklasse A (αw ≥ 0,90, ISO 11654). U dekt zo het slechtste oppervlak van de ruimte af met het beste, zonder het bestaande plafond af te breken.',
    'Pas daarna kijkt u naar de wanden. In een leslokaal van gewone hoogte volstaat het plafond vaak. In een langwerpig kantoor, een ruimte met veel glas of een landschapskantoor waar spraak van bureau naar bureau draagt, komen daar wandpanelen en bel- of vergadercabines bij. Wat uw ruimte nodig heeft, volgt uit de nagalmtijd die we vooraf ramen of die de akoesticus meet.',
  ],
  why: {
    heading: 'Waarom klinkt een harde ruimte zo luid?',
    paragraphs: [
      'Geluid dat op een harde wand, een raam of een gepleisterd plafond valt, kaatst bijna volledig terug. Elke lettergreep blijft nog even hangen terwijl de volgende al vertrekt. Die uitdoving heet nagalm; de nagalmtijd T (RT60) is de tijd die het geluid nodig heeft om met 60 dB af te nemen. Hoe langer T, hoe meer klanken over elkaar schuiven en hoe slechter de spraakverstaanbaarheid.',
      'Daar komt een reflex bovenop: wie zichzelf slecht hoort, praat luider. In een refter of een klas met dertig leerlingen zet dat een spiraal in gang, het lombardeffect: iedereen wil boven het achtergrondgeluid uitkomen en de ruimte wordt steeds luider. Een leerkracht die de hele dag zijn of haar stem moet forceren, heeft geen volumeprobleem maar een absorptieprobleem.',
    ],
  },
  targets: {
    heading: 'Welke nagalmtijd is normaal per ruimte?',
    intro: 'Praktische ordes van grootte voor de nagalmtijd in de middenfrequenties, in een gemeubelde ruimte. Voor scholen legt NBN S 01-400-2 criteria per lokaaltype vast; voor landschapskantoren zijn ISO 22955 (leidraad) en ISO 3382-3 (meetnorm) de referenties.',
    cols: {
      room: 'Ruimte',
      target: 'Nagalmtijd T (orde van grootte)',
      norm: 'Referentie',
    },
    rows: [
      {
        room: 'Leslokaal (basis- en secundair onderwijs)',
        target: '0,5–0,8 s',
        norm: 'NBN S 01-400-2',
      },
      {
        room: 'Vergaderzaal',
        target: '0,5–0,7 s',
        norm: 'praktijkwaarde, geen norm',
      },
      {
        room: 'Landschapskantoor',
        target: '0,5–0,8 s',
        norm: 'ISO 22955 / ISO 3382-3 (ook D2,S · Lp,A,S,4m · rD)',
      },
      {
        room: 'Restaurant / refter',
        target: '0,6–1,0 s',
        norm: 'praktijkwaarde, geen norm',
      },
      {
        room: 'Thuisbioscoop / regie van een opnamestudio',
        target: '0,2–0,4 s',
        norm: 'praktijkwaarde, geen norm',
      },
      {
        room: 'Sporthal / polyvalente zaal',
        target: '1,5–2,0 s, sterk volumeafhankelijk',
        norm: 'praktijkwaarde; in een school geldt NBN S 01-400-2',
      },
    ],
    norms: [
      {
        name: 'NBN S 01-400-2',
        what: 'Belgische norm met de akoestische criteria voor schoolgebouwen, onder meer een maximale nagalmtijd per lokaaltype.',
      },
      {
        name: 'ISO 22955',
        what: 'Leidraad voor de akoestiek van landschapskantoren: welke maatregelen passen bij welk type kantoorwerk.',
      },
      {
        name: 'ISO 3382-3',
        what: 'Meetnorm voor landschapskantoren. Niet de nagalmtijd staat centraal, maar hoe spraak zich verspreidt: de ruimtelijke afname van spraak D2,S, het A-gewogen spraakniveau op 4 m Lp,A,S,4m en de afleidingsafstand rD.',
      },
      {
        name: 'ISO 11654',
        what: 'Deelt absorberende materialen in klassen in op basis van αw: klasse A (αw ≥ 0,90) tot klasse E (0,15–0,25).',
      },
      {
        name: 'EN 13501-1',
        what: 'Europese classificatie van het brandgedrag van bouwmaterialen, bijvoorbeeld B-s1,d0.',
      },
    ],
    acousticianNote: 'Deze tabel geeft praktische ordes van grootte, geen wettelijke grenswaarden. De exacte eis voor uw project, zeker voor een school onder NBN S 01-400-2, laat u altijd nakijken door de akoesticus of het studiebureau van het project.',
  },
  ceiling: {
    heading: 'Het akoestisch spanplafond: klasse A op het grootste oppervlak',
    paragraphs: [
      'Het Acoustic Stretch System is een strak gespannen membraan met microperforaties die van op de grond nauwelijks opvallen. Geluid gaat door die perforaties en wordt opgevangen in een dichte polyesterwolabsorber in de holte erboven. Het membraan blijft vlak, naadloos tot 5,15 m breed en wasbaar; met die absorberende laag erachter haalt het systeem klasse A volgens ISO 11654.',
      'Het membraan wordt koud of warm gespannen in een clipprofiel langs de wanden. In renovatie hangt het onder het bestaande plafond: geen afbraak, en een lokaal is in één dag klaar. Verlichting en inspectieluiken worden geïntegreerd, luidsprekers kunnen achter het membraan verdwijnen. Hetzelfde systeem werkt op wanden en als vrijhangende eilanden of baffles. De productiestudio van Mark With a K kreeg zo een naadloos akoestisch plafond zonder één zichtbare paneellijn.',
    ],
    bullets: [
      'Absorptieklasse A (αw ≥ 0,90, ISO 11654) met absorberende achterlaag',
      'Naadloos tot 5,15 m breed',
      'Brandgedrag B-s1,d0 volgens EN 13501-1, A2-uitvoering mogelijk',
      'Wasbaar oppervlak, 10 jaar garantie',
      'Wit, gebroken wit, grijs, antraciet, elke RAL-kleur of eigen print',
      'Ook als akoestische wand, eiland of baffle',
    ],
    productLink: {
      before: 'Alle technische fiches, kleuren en montagedetails vindt u op de productpagina van het ',
      anchor: 'Acoustic Stretch System',
      after: '.',
    },
  },
  sabine: {
    heading: 'Rekenvoorbeeld: een leslokaal van 9 × 7 × 3 m',
    intro: 'De formule van Sabine zegt, in woorden: de nagalmtijd is evenredig met het volume en omgekeerd evenredig met de totale absorptie A, de som van elk oppervlak maal zijn absorptiecoëfficiënt α (0 = alles weerkaatst, 1 = alles geabsorbeerd). We rekenen een leeg Vlaams leslokaal door, zonder banken, kasten of leerlingen, met typische waarden voor de middenfrequenties. Alleen het plafond verandert.',
    room: {
      name: 'Leslokaal 9 × 7 × 3 m (leeg)',
      length: 9,
      width: 7,
      height: 3,
      floor: {
        material: 'Linoleumvloer',
        alpha: 0.05,
      },
      walls: {
        material: 'Gepleisterde wanden met ramen',
        alpha: 0.05,
      },
      ceilingBefore: {
        material: 'Gepleisterd plafond',
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
      formulaNote: 'T = 0,161 · V / A, met V in m³ en A in m² Sabine.',
      floor: 'Vloer',
      walls: 'Wanden',
      ceiling: 'Plafond',
    },
    conclusion: 'In de lege klas zakt de nagalmtijd van {tBefore} naar {tAfter}, net onder de ondergrens van 0,5 tot 0,8 s die voor een leslokaal gangbaar is. Met banken, kasten, jassen en dertig leerlingen erbij komt de werkelijke waarde nog wat lager uit.',
  },
  cannotFix: {
    heading: 'Wat een plafond alleen niet oplost',
    paragraphs: [
      [
        {
          text: 'De formule van Sabine gaat uit van een diffuus geluidsveld, gelijkmatig over de ruimte verdeeld. Dat klopt behoorlijk voor een klas of vergaderzaal, minder voor een lange gang, een laag en breed landschapskantoor of een sporthal. Daar is een meting ter plaatse de enige betrouwbare basis.',
        },
      ],
      [
        {
          text: 'Tussen twee evenwijdige harde wanden, bijvoorbeeld een glazen gevel tegenover een gepleisterde muur, ontstaat flutterecho: de ratelende echo die u hoort als u in uw handen klapt. Het geluid pendelt horizontaal, dus het plafond doet daar weinig aan. Hier is absorptie nodig op minstens één van beide wanden.',
        },
      ],
      [
        {
          text: 'In een landschapskantoor telt niet alleen hoe snel geluid uitdooft, maar ook hoe ver spraak draagt: ISO 3382-3 drukt dat uit in de afname D2,S en de afleidingsafstand rD. Een absorberend plafond helpt, maar spraak blijft in rechte lijn tussen bureaus lopen. Daarom combineren we het plafond met schermen, ',
        },
        {
          text: 'akoestische wandpanelen en belcabines van Re-Sound',
          href: 'https://re-sound.be/nl',
        },
        {
          text: '. Die cabines worden binnen de STRETCH Group gebouwd in de eigen fabriek in Częstochowa.',
        },
      ],
      [
        {
          text: 'Een vertrouwelijk klantengesprek of twee uur geconcentreerd werk vragen om een afgesloten ruimte. Geen enkel plafond maakt van een open werkvloer een spreekkamer; een bel- of vergadercabine wel.',
        },
      ],
      [
        {
          text: 'Absorptie verbetert de geluidsisolatie naar het lokaal ernaast niet. Stemmen door een lichte tussenwand of stoelen die schuiven op de verdieping erboven zijn een zaak van bouwkundige isolatie. En onder ongeveer 125 Hz doet een akoestisch plafond nauwelijks iets.',
        },
      ],
    ],
  },
  combined: {
    heading: 'Eén project voor plafond, wanden en cabines',
    paragraphs: [
      'Stel: een basisschool wil in de zomervakantie vier klassen en de refter aanpakken. STRETCH komt één keer opmeten en berekent per lokaal (Sabine) wat het plafond alleen oplevert. Voor de klassen volstaat het spanplafond; in de refter, met tegels en veel glas, komen er wandpanelen van Re-Sound bij. Eén contactpersoon, één planning in de vakantieweken, en na de montage kan de akoesticus van het project met een controlemeting vastleggen wat er veranderd is.',
      'Voor het kantoor van een Vlaamse kmo loopt het net zo: de open werkvloer krijgt een akoestisch spanplafond, de klantendienst wandpanelen en belcabines, de vergaderzaal een plafond met verborgen luidsprekers. Plafond door STRETCH, panelen en cabines door Re-Sound, met één projectleider. Bij notariskantoor Ampe Anthony, waar verstaanbaarheid in elk gesprek telt, plaatsten we zo 350 m² akoestisch spanplafond.',
    ],
  },
  faqs: [
    {
      q: 'Wat zegt NBN S 01-400-2 over de nagalm in een klaslokaal?',
      a: 'NBN S 01-400-2 is de Belgische norm voor de akoestiek van schoolgebouwen en legt per lokaaltype een maximale nagalmtijd vast; voor een gewone klas komt dat in de praktijk neer op 0,5 tot 0,8 s. Welke waarde precies voor uw school geldt, hangt af van het lokaaltype en het bestek.',
    },
    {
      q: 'Kan een akoestisch spanplafond onder mijn bestaande plafond geplaatst worden?',
      a: 'Ja, dat is de gangbare manier in renovatie. Het clipprofiel wordt langs de wanden bevestigd, de absorber komt in de holte en het membraan wordt eronder gespannen. Het oude plafond blijft zitten, er is geen afbraak en een gemiddeld lokaal is in één dag klaar. Verlichting en inspectieluiken worden geïntegreerd.',
    },
    {
      q: 'Volstaat een akoestisch plafond in een landschapskantoor?',
      a: 'Meestal niet helemaal. Het plafond haalt de nagalmtijd naar beneden, maar in een landschapskantoor gaat het ook om hoe ver spraak draagt (D2,S en rD volgens ISO 3382-3). Daarvoor zijn schermen of wandpanelen tussen de werkzones nodig, en cabines voor telefoongesprekken en geconcentreerd werk. Een meting vooraf toont waar het plafond volstaat.',
    },
    {
      q: 'Helpt een akoestisch plafond ook tegen het lawaai uit het lokaal ernaast?',
      a: 'Nee. Absorptie werkt op het geluid in de ruimte zelf en maakt uw eigen lokaal rustiger en verstaanbaarder. Geluid door een tussenwand, een deur of de vloer erboven is een kwestie van geluidsisolatie en vraagt bouwkundige maatregelen. Ook lage tonen onder ongeveer 125 Hz vangt een plafond nauwelijks op.',
    },
    {
      q: 'Hoe weet ik hoeveel nagalm mijn ruimte nu heeft?',
      a: 'Een eerste indicatie geeft de formule van Sabine met de afmetingen en materialen van uw ruimte; die raming maken we bij een offerteaanvraag. Een betrouwbaar cijfer komt uit een meting ter plaatse door de akoesticus van het project, vóór de werken en na de montage. Zo kent u het verschil in seconden, niet alleen op gevoel.',
    },
  ],
  cta: {
    heading: 'Vraag een offerte en een raming van uw nagalmtijd aan',
    body: 'Stuur ons de afmetingen en enkele foto\'s van uw leslokaal, kantoor of refter. U krijgt een berekende raming (Sabine) van de nagalmtijd vóór en na de werken, plus een offerte voor het akoestisch spanplafond, eventueel aangevuld met wandpanelen en cabines.',
    button: 'Vrijblijvende offerte aanvragen',
    productButton: 'Bekijk het Acoustic Stretch System',
  },
};
