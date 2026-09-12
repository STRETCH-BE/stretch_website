// Acoustics page content — French (France + Wallonia) — brasserie, arrêté 2003, NF S 31-080.
// Written natively for this market (own norms, vocabulary, worked example,
// FAQ); never a translation of another market's module and never copied to
// one. The route computes the Sabine numbers from `sabine.room`. The single
// Re-Sound link lives in `cannotFix` — the only section allowed to carry it.
import type { AcousticsContent } from './types';

export const fr: AcousticsContent = {
  meta: {
    title: 'Plafond acoustique : réduire la réverbération | STRETCH',
    description: 'Brasserie, open space ou classe bruyante ? Le plafond tendu acoustique STRETCH (classe A) réduit la réverbération. Normes, cibles et exemple chiffré.',
  },
  eyebrow: 'Acoustique des plafonds tendus',
  h1: 'Comment réduire la réverbération d\'une pièce avec un plafond acoustique ?',
  answer: [
    'Commencez par le plafond. C\'est la plus grande surface ininterrompue de la pièce, celle que ni mobilier, ni portes, ni vitrages ne viennent couper. Un plafond tendu acoustique STRETCH — membrane micro-perforée devant un absorbant en laine de polyester haute densité — atteint la classe d\'absorption A (αw ≥ 0,90, ISO 11654). Dans une brasserie de 14 m × 9 m, cette seule intervention fait passer le temps de réverbération du niveau d\'un hall de gare à celui d\'un restaurant où l\'on s\'entend parler.',
    'Ensuite seulement, les murs. Si le plafond ne suffit pas — pièce très haute, murs parallèles en béton ou en verre, open space où la parole doit s\'éteindre vite d\'un poste à l\'autre — on ajoute des panneaux muraux absorbants, des écrans et, pour les appels confidentiels, des cabines. En France comme en Wallonie ou à Bruxelles, la logique est la même : d\'abord le plafond, puis ce qui manque.',
  ],
  why: {
    heading: 'Pourquoi une pièce « dure » est-elle si bruyante ?',
    paragraphs: [
      'Carrelage, plaque de plâtre, béton, vitrage : ces surfaces renvoient de 95 à 98 % de l\'énergie sonore qui les touche (α ≈ 0,05 pour le plâtre, le béton et le verre, ≈ 0,02 pour le carrelage). Chaque mot rebondit des dizaines de fois avant de s\'éteindre. Cette traînée de réflexions, c\'est la réverbération (la « résonance » ou l\'« écho » dont on se plaint au quotidien), mesurée par le temps de réverbération T (ou RT60) : le temps, en secondes, qu\'il faut à un son pour décroître de 60 dB une fois la source coupée.',
      'Dans une salle réverbérante, les syllabes se chevauchent et la parole perd en intelligibilité. Pour se faire comprendre, chacun élève la voix. La table voisine parle encore plus fort et le bruit de fond s\'entretient de lui-même. Absorber au plafond brise ce cercle vicieux : T diminue, la parole redevient intelligible à voix normale et le niveau global baisse de lui-même.',
    ],
  },
  targets: {
    heading: 'Quel temps de réverbération viser selon le local ?',
    intro: 'Les valeurs ci-dessous sont des ordres de grandeur pratiques pour des locaux meublés, aux fréquences moyennes. Elles permettent de cadrer un projet ; la valeur à respecter dépend du texte applicable (voir la note en fin de tableau).',
    cols: {
      room: 'Type de local',
      target: 'T visé',
      norm: 'Référence',
    },
    rows: [
      {
        room: 'Salle de classe (France)',
        target: '0,4 – 0,8 s',
        norm: 'Arrêté du 25 avril 2003 (classe ≤ 250 m³)',
      },
      {
        room: 'Salle de classe (Wallonie / Bruxelles)',
        target: '0,5 – 0,8 s',
        norm: 'Ordre de grandeur ; référence : NBN S 01-400-2 (valeur exacte selon la norme)',
      },
      {
        room: 'Salle de réunion',
        target: '0,5 – 0,7 s',
        norm: 'Ordre de grandeur ; références : NF S 31-080, ISO 22955',
      },
      {
        room: 'Open space',
        target: '0,5 – 0,8 s',
        norm: 'Ordre de grandeur ; références : NF S 31-080, ISO 22955 et ISO 3382-3 (D2,S ; Lp,A,S,4m ; rD)',
      },
      {
        room: 'Brasserie, restaurant, cantine',
        target: '0,6 – 1,0 s',
        norm: 'Ordre de grandeur',
      },
      {
        room: 'Home cinéma, régie de studio',
        target: '0,2 – 0,4 s',
        norm: 'Ordre de grandeur',
      },
      {
        room: 'Salle de sport, grande halle',
        target: '1,5 – 2,0 s',
        norm: 'Ordre de grandeur, fortement lié au volume',
      },
    ],
    norms: [
      {
        name: 'Arrêté du 25 avril 2003',
        what: 'Arrêté français relatif à la limitation du bruit dans les établissements d\'enseignement : durée de réverbération des classes de 0,4 à 0,8 s jusqu\'à 250 m³, de 0,6 à 1,2 s au-delà.',
      },
      {
        name: 'NBN S 01-400-2',
        what: 'Norme belge qui fixe les critères acoustiques des bâtiments scolaires ; c\'est la référence pour les écoles en Wallonie et à Bruxelles.',
      },
      {
        name: 'NF S 31-080',
        what: 'Norme française qui définit des niveaux de performance acoustique pour les bureaux : temps de réverbération, décroissance spatiale, bruit de fond.',
      },
      {
        name: 'ISO 22955',
        what: 'Qualité acoustique des open spaces : elle décrit les types d\'activité que l\'on y rencontre et les critères à viser pour chacun.',
      },
      {
        name: 'ISO 3382-3',
        what: 'Méthode de mesure en open space : décroissance spatiale de la parole D2,S, niveau de parole à 4 m Lp,A,S,4m et distance de distraction rD.',
      },
      {
        name: 'ISO 11654',
        what: 'Classement des absorbants selon leur coefficient αw : classe A (αw ≥ 0,90), B (0,80 – 0,85), C (0,60 – 0,75), D (0,30 – 0,55), E (0,15 – 0,25).',
      },
      {
        name: 'EN 13501-1',
        what: 'Classification européenne de réaction au feu (Euroclasses) : le plafond tendu acoustique STRETCH y est classé B-s1,d0, et une version A2-s1,d0 est disponible lorsque le projet l\'exige.',
      },
    ],
    acousticianNote: 'Ces plages sont des repères, pas des seuils réglementaires : la valeur exacte à atteindre dans votre local se vérifie avec l\'acousticien du projet, sur la base du texte applicable en France ou en Belgique.',
  },
  ceiling: {
    heading: 'Comment fonctionne un plafond tendu acoustique ?',
    paragraphs: [
      'La membrane est micro-perforée : des milliers d\'ouvertures invisibles depuis le sol laissent passer l\'onde sonore au lieu de la renvoyer. Derrière, un matelas absorbant en laine de polyester haute densité dissipe cette énergie. L\'ensemble atteint la classe A (ISO 11654), tout en gardant l\'aspect d\'un plafond tendu lisse, sans joint jusqu\'à 5,15 m de largeur.',
      'La pose se fait à froid ou à chaud dans un profilé à clipser fixé en périphérie. En rénovation, le système se monte sous le plafond existant — plâtre, dalles, béton — sans démolition, en une journée pour un local courant ; luminaires et trappes s\'intègrent dans la membrane. Le même système habille les murs ou se suspend en îlots et en baffles, et des haut-parleurs peuvent être dissimulés derrière la membrane pour une sonorisation discrète.',
    ],
    bullets: [
      'Classe d\'absorption A (αw ≥ 0,90, ISO 11654) avec matelas absorbant',
      'Sans joint jusqu\'à 5,15 m de largeur',
      'Réaction au feu B-s1,d0 (EN 13501-1), version A2-s1,d0 disponible',
      'Face lavable, garantie 10 ans',
      'Blanc, blanc cassé, gris, anthracite, impression personnalisée ou teinte RAL',
      'Pose sous plafond existant en une journée, sans démolition',
    ],
    productLink: {
      before: 'Vous trouverez le détail des membranes, des matelas absorbants et des profilés sur la fiche de l\'',
      anchor: 'Acoustic Stretch System',
      after: '.',
    },
  },
  sabine: {
    heading: 'Exemple chiffré : une brasserie de 14 m × 9 m, avant et après',
    intro: 'La formule de Sabine relie le temps de réverbération au volume du local et à ce qu\'il absorbe : T = 0,161 × V / A, où V est le volume en m³ et A l\'aire d\'absorption équivalente en m² Sabine, c\'est-à-dire la somme de chaque surface multipliée par son coefficient α. Plus A grandit, plus T raccourcit. L\'exemple ci-dessous est volontairement calculé pour une salle vide, sans tables, sans chaises, sans clients : seules les surfaces nues comptent.',
    room: {
      name: 'Brasserie 14 m × 9 m × 3,5 m',
      length: 14,
      width: 9,
      height: 3.5,
      floor: {
        material: 'Carrelage céramique',
        alpha: 0.02,
      },
      walls: {
        material: 'Murs plâtrés avec grandes baies vitrées',
        alpha: 0.05,
      },
      ceilingBefore: {
        material: 'Plafond en plâtre',
        alpha: 0.05,
      },
      ceilingAfter: {
        material: 'Plafond tendu acoustique avec matelas absorbant',
        alpha: 0.9,
      },
    },
    labels: {
      volume: 'Volume V',
      surface: 'Surface',
      area: 'Aire (m²)',
      alpha: 'α',
      absorption: 'Absorption (m² Sabine)',
      before: 'Avant',
      after: 'Après',
      total: 'Total A',
      reverb: 'Temps de réverbération T',
      formulaNote: 'T = 0,161 × V / A',
      floor: 'Sol',
      walls: 'Murs',
      ceiling: 'Plafond',
    },
    conclusion: 'À vide, la brasserie passe de {tBefore} à {tAfter} en changeant uniquement le plafond : on est déjà au niveau, voire légèrement en dessous, de l\'ordre de grandeur visé pour un restaurant (0,6 – 1,0 s). Cette réserve est volontaire : l\'objectif est atteint sans dépendre du mobilier ni du taux d\'occupation. Avec les tables, les banquettes et les clients, la valeur réelle baisse encore un peu, sans jamais rendre la salle « sourde ».',
  },
  cannotFix: {
    heading: 'Ce qu\'un plafond acoustique ne règle pas',
    paragraphs: [
      [
        {
          text: 'Reprenons la brasserie de l\'exemple. Le bruit du comptoir — machine à café, verres, tiroir-caisse — et celui de la cuisine ouverte arrivent aux premières tables en son direct, à deux ou trois mètres de la source. Il n\'y a là aucune réverbération à traiter : le plafond acoustique ne les atténue pas. Ce qui aide, c\'est la distance, une cloison vitrée ou un demi-mur derrière le passe, une hotte moins bruyante.',
        },
      ],
      [
        {
          text: 'La terrasse fermée en vitrage, la véranda ou l\'extension en verre posent un autre problème : deux parois dures et parallèles se renvoient le son en allers-retours rapides, et l\'espace fait caisse de résonance. Le plafond, perpendiculaire à ces vitrages, n\'y peut rien. Il faut absorber au moins l\'un des deux côtés — panneaux muraux, rideaux lourds, stores intérieurs en tissu — ou casser le parallélisme.',
        },
      ],
      [
        {
          text: 'Le soir, quand la sono monte, le plafond agit peu en dessous de 125 Hz environ : à ces fréquences, la longueur d\'onde dépasse largement l\'épaisseur d\'un absorbant de quelques centimètres. Cela vaut aussi pour le ronflement d\'une ventilation ou d\'une chambre froide. Un limiteur sur la sono, un réglage du caisson de basses et, au besoin, des pièges à basses dans les angles sont les bons outils.',
        },
      ],
      [
        {
          text: 'Dans un open space, le problème change de nature : ce n\'est plus la durée du son qui compte, mais la distance à laquelle on entend distinctement un collègue. L\'ISO 3382-3 la mesure avec la décroissance spatiale D2,S et la distance de distraction rD. Le plafond fait baisser le niveau global, mais pour raccourcir rD il faut couper la ligne de vue entre les postes : des écrans, ainsi que des ',
        },
        {
          text: 'panneaux muraux acoustiques et cabines acoustiques Re-Sound',
          href: 'https://re-sound.be/fr',
        },
        {
          text: '. Les panneaux traitent les murs qui renvoient la voix d\'un poste à l\'autre ; les cabines téléphoniques et de réunion, fabriquées par le groupe dans son atelier de Częstochowa, en Pologne, sortent l\'appel du plateau et isolent dans les deux sens.',
        },
      ],
      [
        {
          text: 'Reste l\'isolement vers les voisins. Une brasserie doit respecter les limites d\'émergence chez les riverains — en France, la réglementation sur les bruits de voisinage et, si la musique est amplifiée, celle sur les lieux diffusant des sons amplifiés ; à Bruxelles et en Wallonie, les arrêtés régionaux sur le bruit. L\'absorption au plafond ne traite pas la paroi mitoyenne : ce qui passe chez le voisin dépend des murs, des planchers, des vitrages et de leurs jonctions. Un plafond plus absorbant baisse le niveau dans la salle de quelques dB, ce qui aide un peu, mais ne remplace ni un doublage ni une porte acoustique.',
        },
      ],
    ],
  },
  combined: {
    heading: 'Restaurant et bureaux d\'une même entreprise : un seul projet',
    paragraphs: [
      'Cas courant : une entreprise rénove à la fois le restaurant du personnel et l\'open space qui le jouxte. STRETCH coordonne l\'ensemble : un seul relevé sur place des dimensions et des matériaux, un seul interlocuteur, un seul planning. Le plafond tendu acoustique est conçu, fabriqué et posé par STRETCH ; les panneaux muraux, les écrans et les cabines viennent de Re-Sound, société sœur de STRETCH au sein du même groupe.',
      'À l\'espace bien-être (wellness) de l\'hôtel Van der Valk à Beveren, STRETCH a posé 700 m² de plafonds tendus acoustiques, imprimés et rétroéclairés ; la même méthode de projet unique s\'applique à une brasserie lilloise ou à un plateau de bureaux à Namur.',
    ],
  },
  faqs: [
    {
      q: 'Quel gain en dB puis-je attendre dans une salle de 100 couverts ?',
      a: 'Dans la brasserie de l\'exemple (441 m³), le temps de réverbération à vide est divisé par sept environ. En théorie, cela abaisse le niveau du champ réverbéré de 8 à 9 dB, ce que l\'oreille perçoit comme un bruit presque divisé par deux. En pratique, le gain est souvent supérieur : dès que l\'on s\'entend, chacun parle moins fort. Le chiffre exact dépend de la salle, du mobilier et de l\'occupation ; l\'acousticien le mesure.',
    },
    {
      q: 'Un plafond tendu acoustique est-il compatible avec une cuisine ouverte (graisse, nettoyage) ?',
      a: 'Oui, en salle. La face de la membrane est lavable et garantie 10 ans ; les micro-perforations, invisibles depuis le sol, s\'entretiennent avec le reste du plafond. Au-dessus du passe et dans la cuisine elle-même, sous la hotte, nous conseillons une membrane lisse non perforée, plus facile à dégraisser, et nous réservons la version acoustique à la zone des couverts, là où la réverbération se joue.',
    },
    {
      q: 'Faut-il un acousticien pour respecter l\'arrêté du 25 avril 2003 ?',
      a: 'L\'arrêté vise les établissements d\'enseignement, pas les restaurants ; pour une classe, il fixe une durée de réverbération à respecter, que le maître d\'ouvrage doit faire vérifier. STRETCH fournit une estimation Sabine avant et après travaux pour dimensionner le plafond ; la conformité se démontre par une mesure sur place (ISO 3382-2), réalisée par un acousticien. Dans un ERP, le bureau de contrôle peut demander ce rapport.',
    },
    {
      q: 'Le plafond seul suffit-il à corriger l\'acoustique ?',
      a: 'Souvent oui pour une brasserie, une classe ou une salle de réunion de proportions courantes : le plafond est la plus grande surface libre et la classe A y fait l\'essentiel du travail. Il ne suffit pas quand la pièce est très haute, quand deux murs durs se font face (écho flottant) ou en open space, où la propagation de la parole entre postes demande écrans, panneaux muraux et cabines.',
    },
    {
      q: 'Quel classement au feu pour un plafond tendu acoustique en ERP (établissement recevant du public) ?',
      a: 'Le plafond tendu acoustique STRETCH est classé B-s1,d0 selon l\'EN 13501-1 (Euroclasses) ; une version A2-s1,d0 est disponible lorsque le projet l\'exige. Le classement requis dépend du type d\'établissement et de l\'usage du local : vérifiez-le avec le bureau de contrôle ou la commission de sécurité en France, avec le service incendie de la zone de secours en Belgique.',
    },
  ],
  cta: {
    heading: 'Votre salle passe de hall de gare à restaurant où l\'on s\'entend',
    body: 'Dites-nous les dimensions de la salle, la hauteur sous plafond et les matériaux du sol et des murs : nous chiffrons le temps de réverbération avant et après, en secondes, et le devis qui va avec — gratuitement et sans engagement. L\'estimation Sabine reste à valider par l\'acousticien du projet. Devis pour la France, la Wallonie et Bruxelles.',
    button: 'Chiffrer le gain de ma salle',
    productButton: 'Voir l\'Acoustic Stretch System',
  },
};
