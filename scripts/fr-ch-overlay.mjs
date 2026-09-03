#!/usr/bin/env node
// ============================================================================
// ROMANDIE OVERLAY — builds messages/fr-ch.json (fr-CH, stretchdecken.ch/fr/)
// from messages/fr.json. IDEMPOTENT: re-run it whenever fr.json changes —
//
//   node scripts/fr-ch-overlay.mjs            # write messages/fr-ch.json
//   node scripts/fr-ch-overlay.mjs --check    # exit 1 if fr-ch.json is stale
//   node scripts/fr-ch-overlay.mjs --report   # list every string the overlay touched
//
// Same pattern as scripts/ch-overlay.mjs (values only — never keys, slugs,
// URLs or ICU placeholders):
//   1. VAT: "hors TVA" / "TVA incluse|comprise" / "TVAC" / "HTVA" →
//      "… 8.1 %" where the string already mentions VAT (Swiss rate since
//      2024). The Belgian premium/VAT article keeps its 6 % — it is
//      market-restricted and never renders on fr-ch.
//   2. € / EUR → CHF ONLY in strings that are not product prices. Product-price
//      strings are LEFT AS THEY ARE and listed by --report: none of them
//      renders on fr-ch (pricesPublished() in src/lib/currency.ts is false
//      for every Swiss locale).
//   3. Phone placeholders "+33 ..." / "+32 ..." → "+41 ...".
//   4. Swiss-French overrides (OVERRIDES): QuinLay AG as the Swiss
//      representative in the hero, dealer copy, contact/Impressum/footer/
//      modal and training strings. "devis" and "code postal" stay — both
//      are Swiss French.
// Contact data (phone, e-mail, address) is NOT rewritten: components read
// swissPartner from src/lib/site-config.ts on every Swiss locale.
// Output is byte-identical to the repo convention:
// JSON.stringify(obj, null, 2) + '\n' with UTF-8 characters unescaped.
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FR = join(root, 'messages', 'fr.json');
const FRCH = join(root, 'messages', 'fr-ch.json');
const args = new Set(process.argv.slice(2));

// ---- 2. Strings that quote product prices or describe EUR settlement -------
// Matched by key-path prefix. Everything here is hidden on fr-ch by code.
const PRICE_STRING_PREFIXES = [
  'blogPosts.posts.', // every € inside an article body is a product price or a Belgian grant
  'meta.priceCalculatorDescription', // "70–200 €/m²" — page is 404 on fr-ch
  'meta.supplyCzSkDescription', // Czech/Slovak supply invoiced from Poland in EUR/PLN
  'supplyCzSkPage.', // idem
  'architectsPage.', // €/m² budget bands — the architect portal bands are EUR
  'portal.', // portal copy: trade pricing, EUR/PLN by pricebook
  'datasheetEmail.architectInvite', // same €/m² budget-band wording
  'currency.', // "indication to the ECB rate … all payments in EUR": describes EUR settlement; never renders on fr-ch
];

// ---- 1. VAT — only the Belgian premium article keeps its own rate ---------
const VAT_SKIP_PREFIXES = ['blogPosts.posts.spanplafond-premie-btw.'];
const VAT = [
  [/\bTVAC\b/g, 'TVA 8.1 % incluse'],
  [/\bHTVA\b/g, 'hors TVA 8.1 %'],
  [/\bhors TVA\b(?! 8\.1)/g, 'hors TVA 8.1 %'],
  [/\bTVA (incluse|comprise)\b/g, 'TVA 8.1 % $1'],
];

// ---- 4. Swiss-French values -----------------------------------------------
// Keys use the same dotted path syntax as the message tools: [n] = array index.
const OVERRIDES = {
  'home.hero.slides.0.subhead':
    'Fabricant en Belgique et en Pologne – représentation générale Suisse & Liechtenstein : QuinLay AG, showroom à Rickenbach LU.',
  'meta.homeTitle': 'STRETCH Suisse — Un nouveau plafond en un jour | Plafonds & murs tendus',
  'meta.homeDescription':
    'Plafonds tendus et murs sans soudure, posés à froid en une journée — sans poussière ni peinture. Fabriqués en Belgique et en Pologne ; conseil, livraison et pose en Suisse par QuinLay AG, Rickenbach LU.',
  // Utility-bar tagline: one line at 11.5px beside five links — keep it short.
  'common.handMadeInBelgium': 'Représentation générale CH & FL : QuinLay AG',
  'footer.tagline':
    'Plafonds et murs tendus de notre propre production en Belgique et en Pologne – en Suisse et au Liechtenstein, conseil, livraison et pose via notre représentation générale QuinLay AG, Rickenbach LU.',
  // Dealer pages — real dealer pages carry the QuinLay title pattern; the
  // Romandie recruitment pages keep the French recruitment copy.
  'dealersPage.h1': 'Plafond tendu {place}',
  'dealersPage.metaTitleDealer': 'Plafond tendu {place} – Conseil, showroom & pose | STRETCH × QuinLay AG',
  'dealersPage.metaDescDealer':
    'Plafond tendu à {place} : conseil au showroom de Rickenbach LU, prise de mesures sur place, fabrication sur mesure et pose par des partenaires formés – QuinLay AG, représentation générale STRETCH Suisse & Liechtenstein. Demandez un devis.',
  'dealersPage.introDealer':
    'Un plafond tendu STRETCH à {place} commence chez QuinLay AG, notre représentation générale pour la Suisse et le Liechtenstein : conseil au showroom de Rickenbach LU, prise de mesures sur place, fabrication sur mesure dans nos usines en Belgique et en Pologne, pose par des partenaires formés – matériaux en stock en Suisse.',
  'dealersPage.dealerBadge': 'Représentation générale STRETCH Suisse & Liechtenstein',
  'dealersPage.dealerBadgeShort': 'Représentation générale',
  'dealersPage.whyTitle': 'Pourquoi STRETCH en Suisse',
  'dealersPage.why1':
    'Du fabricant – chaque plafond est soudé sur mesure dans nos propres usines en Belgique et en Pologne et arrive en Suisse prêt à poser.',
  'dealersPage.why2':
    'Pose formée – les partenaires de QuinLay AG suivent la formation STRETCH dans leur propre salle de formation à Rickenbach LU et travaillent avec nos profilés, toiles et éclairages.',
  'dealersPage.why3':
    'Un seul interlocuteur – conseil, matériaux en stock en Suisse et pose d’une seule main, avec STRETCH en soutien.',
  'dealersPage.ovMetaTitle': 'Plafonds tendus en Suisse & au Liechtenstein – QuinLay AG | STRETCH',
  'dealersPage.ovMetaDescription':
    'Plafonds tendus STRETCH en Suisse et au Liechtenstein : conseil au showroom de Rickenbach LU, pose par des partenaires formés – Lausanne, Genève, Fribourg, Neuchâtel, Sion, Zurich, Berne, Bâle et plus. Représentation générale : QuinLay AG.',
  'dealersPage.ovIntro':
    'En Suisse et au Liechtenstein, les plafonds tendus STRETCH sont conseillés, mesurés et posés via QuinLay AG, notre représentation générale à Rickenbach LU – showroom, salle de formation et matériaux en stock en Suisse. Trouvez votre région ; en Suisse romande, nous cherchons encore des partenaires poseurs.',
  'dealersPage.identityDirectKicker': 'Représentation générale Suisse & Liechtenstein',
  'dealersPage.identityDirectTitle': '{place} : conseil et pose via QuinLay AG',
  'dealersPage.identityDirectBody':
    'QuinLay AG à Rickenbach LU est la représentation générale de STRETCH pour la Suisse et le Liechtenstein : conseil au showroom, prise de mesures sur place à {place}, matériaux en stock en Suisse et pose par des partenaires formés. Les plafonds sont fabriqués sur mesure dans nos usines en Belgique et en Pologne.',
  'dealersPage.identityDirectCard': 'Représentation générale STRETCH Suisse & Liechtenstein – conseil, showroom, pose.',
  // Recruitment variant (Romandie): served via QuinLay AG, never "directement
  // depuis notre production belge".
  'dealersPage.introRecruit':
    'Il n’y a pas encore de partenaire poseur STRETCH à {place} – en attendant, QuinLay AG, notre représentation générale pour la Suisse et le Liechtenstein, vous conseille et organise la pose depuis Rickenbach LU. Nous cherchons le bon partenaire local.',
  'dealersPage.metaTitleRecruit': 'Plafond tendu {place} – Conseil & pose via QuinLay AG | STRETCH',
  'dealersPage.metaDescRecruit':
    'Un plafond tendu à {place} ? Conseil et pose via QuinLay AG, représentation générale STRETCH Suisse & Liechtenstein – et nous cherchons un partenaire poseur local. Demandez un devis ou devenez notre partenaire à {place}.',
  'dealersPage.recruitBody':
    'Nous cherchons activement un partenaire poseur à {place} : formation dans la salle de formation de QuinLay AG à Rickenbach LU, matériaux en stock en Suisse, soutien marketing – et les demandes de cette page vous reviennent.',
  // Contact page, footer, modals.
  'contactPage.swissPartnerTitle': 'Votre interlocuteur en Suisse et au Liechtenstein : QuinLay AG, Rickenbach LU',
  'contactPage.swissPartnerBody':
    'QuinLay AG est la représentation générale de STRETCH pour la Suisse et le Liechtenstein : showroom et salle de formation à Rickenbach LU, matériaux en stock en Suisse, pose par des partenaires formés. Chaque demande venant de Suisse est traitée par QuinLay AG – avec STRETCH en copie.',
  'contactPage.swissCallback': 'Rappel par QuinLay AG',
  'contactPage.impressumHeading': 'Mentions légales – Suisse & Liechtenstein',
  'contactPage.impressumManufacturer': 'Fabricant',
  'contactPage.impressumSwissParty': 'Partie contractante pour la Suisse et le Liechtenstein',
  'contactPage.impressumNote': 'Devis, livraisons et factures pour la Suisse et le Liechtenstein sont établis par QuinLay AG.',
  'contactPage.hours': 'Rappel par QuinLay AG',
  'modals.swissPartnerNote':
    'Votre demande est transmise à QuinLay AG, Rickenbach LU – représentation générale STRETCH Suisse & Liechtenstein – avec STRETCH en copie. Rappel par QuinLay AG.',
  'footer.swissPartnerHeading': 'Représentation générale Suisse & Liechtenstein',
  'footer.manufacturerHeading': 'Fabricant – Belgique',
  'partnersPage.why.quinlayCard.title': 'Suisse & Liechtenstein : QuinLay AG',
  'partnersPage.why.quinlayCard.body':
    'Notre représentation générale pour la Suisse et le Liechtenstein – showroom et salle de formation à Rickenbach LU, matériaux en stock en Suisse, partenaires de pose dans tout le pays.',
  'partnersPage.why.quinlayCard.cta': 'Vers quinlay.ch',
  // Installer training: QuinLay AG runs day courses (Basic / Advanced) in
  // Rickenbach LU, booked on quinlay.ch — no Belgian "2–3 days at HQ" claims.
  'trainingPage.dates.externalCta': 'Dates & réservation sur quinlay.ch',
  'trainingPage.dates.swissRoom': 'Les cours ont lieu dans la salle de formation et d’essai de QuinLay AG, à Rickenbach LU.',
  'trainingPage.dates.secondaryCta': 'Des questions sur le cours ? Contactez-nous',
  'trainingPage.dates.lead': 'Deux cours d’une journée chez QuinLay AG à Rickenbach LU – dates et réservation directement sur quinlay.ch.',
  'trainingPage.hero.travel': 'Rickenbach LU – salle de formation et d’essai de QuinLay AG, à 15 minutes de Lucerne',
  'trainingPage.hero.titleC': 'en une journée',
  'trainingPage.hero.lead':
    'Cours pratiques dans la salle de formation et d’essai de QuinLay AG à Rickenbach LU – cours Basic pour débuter, cours Advanced pour approfondir. Dates, contenu et réservation sur quinlay.ch.',
  'trainingPage.format[0].value': '1 jour',
  'trainingPage.format[0].label': 'par cours',
  'trainingPage.format[1].value': 'Rickenbach LU',
  'trainingPage.format[1].label': 'Salle de formation et d’essai QuinLay AG',
  'trainingPage.format[2].value': '2',
  'trainingPage.format[2].label': 'Cours : Basic & Advanced',
  'trainingPage.courseName': 'Cours d’une journée STRETCH chez QuinLay AG',
  'trainingPage.courseDescription':
    'Cours d’une journée Basic et Advanced de pose de plafonds tendus dans la salle de formation et d’essai de QuinLay AG à Rickenbach LU – dates et réservation sur quinlay.ch.',
  'trainingPage.curriculum.lead':
    'Le programme STRETCH – du rouleau de membrane au plafond fini, éclairé et acoustique. Le contenu exact des deux cours d’une journée est sur quinlay.ch.',
  // Supply / export copy: the contracting party for CH & FL is QuinLay AG.
  'supplyPage.currencyLine': 'Prix et facturation en CHF par QuinLay AG (Suisse & Liechtenstein).',
  'projectsExportPage.how.currencyLine': 'Facturation en CHF par QuinLay AG (Suisse & Liechtenstein).',
};

// ---- helpers ---------------------------------------------------------------
const PLACEHOLDER = /\{[^}]+\}/g;
const touched = { vat: [], currency: [], overrides: [], currencySkipped: [], phone: [] };

function startsWithAny(path, prefixes) {
  return prefixes.some((p) => path.startsWith(p));
}

function transform(value, path) {
  let v = value;
  // Protect ICU placeholders (they may contain letters we must not touch).
  const slots = [];
  v = v.replace(PLACEHOLDER, (m) => {
    slots.push(m);
    return ` ${slots.length - 1} `;
  });
  if (!startsWithAny(path, VAT_SKIP_PREFIXES)) {
    let vv = v;
    for (const [re, to] of VAT) vv = vv.replace(re, to);
    if (vv !== v) touched.vat.push(path);
    v = vv;
  }
  // Phone placeholders ("+33 ...", "+32 ...", "+971 ...") → the Swiss code.
  if (/^\+\d{2,3} \.\.\.$/.test(v) && v !== '+41 ...') {
    v = '+41 ...';
    touched.phone.push(path);
  }
  if (/€|\bEUR\b/.test(v)) {
    if (startsWithAny(path, PRICE_STRING_PREFIXES)) {
      touched.currencySkipped.push(path);
    } else {
      v = v.replace(/\bEUR\b/g, 'CHF').replace(/\s?€/g, ' CHF').replace(/  CHF/g, ' CHF');
      touched.currency.push(path);
    }
  }
  return v.replace(/ (\d+) /g, (_, i) => slots[Number(i)]);
}

function walk(node, path) {
  if (typeof node === 'string') return transform(node, path);
  if (Array.isArray(node)) return node.map((v, i) => walk(v, `${path}[${i}]`));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = walk(v, path ? `${path}.${k}` : k);
    return out;
  }
  return node;
}

function setPath(obj, path, value) {
  const parts = [];
  for (const m of path.matchAll(/([^.[\]]+)|\[(\d+)\]/g)) parts.push(m[1] !== undefined ? m[1] : Number(m[2]));
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] === undefined || cur[p] === null) throw new Error(`override path not in fr.json: ${path}`);
    cur = cur[p];
  }
  const last = parts[parts.length - 1];
  if (cur[last] === undefined) throw new Error(`override path not in fr.json: ${path}`);
  cur[last] = value;
}

const fr = JSON.parse(readFileSync(FR, 'utf8'));
const frch = walk(fr, '');
for (const [path, value] of Object.entries(OVERRIDES)) {
  setPath(frch, path, value);
  touched.overrides.push(path);
}
const output = JSON.stringify(frch, null, 2) + '\n';

if (args.has('--check')) {
  const current = existsSync(FRCH) ? readFileSync(FRCH, 'utf8') : '';
  if (current !== output) {
    console.error('messages/fr-ch.json is stale — run: node scripts/fr-ch-overlay.mjs');
    process.exit(1);
  }
  console.log('messages/fr-ch.json is up to date');
} else {
  writeFileSync(FRCH, output);
  console.log('messages/fr-ch.json written from fr.json');
}

console.log(
  `VAT 8.1 %: ${touched.vat.length} · €/EUR→CHF: ${touched.currency.length} (skipped as product prices: ${touched.currencySkipped.length}) · phone placeholders → +41: ${touched.phone.length} · Swiss-French overrides: ${touched.overrides.length}`,
);

if (args.has('--report')) {
  const list = (title, arr) => {
    console.log(`\n${title} (${arr.length})`);
    for (const p of arr) console.log(`  ${p}`);
  };
  list('€/EUR → CHF', touched.currency);
  list('€/EUR left as is (product prices / EUR-settlement notes, hidden on fr-ch)', touched.currencySkipped);
  list('VAT → 8.1 %', touched.vat);
  list('Phone placeholders → +41 ...', touched.phone);
  list('Swiss-French overrides', touched.overrides);
}
