#!/usr/bin/env node
// ============================================================================
// SWISS OVERLAY — builds messages/ch.json (de-CH, stretchdecken.ch) from
// messages/de.json. IDEMPOTENT: re-run it whenever de.json changes —
//
//   node scripts/ch-overlay.mjs            # write messages/ch.json
//   node scripts/ch-overlay.mjs --check    # exit 1 if ch.json is stale
//   node scripts/ch-overlay.mjs --report   # list every string the overlay touched
//
// What it does to every string VALUE (never keys, slugs, URLs or ICU
// placeholders):
//   1. ß → ss (Swiss Standard German has no ß: "Strasse", "nach Mass", "gross").
//   2. Vocabulary: Angebot → Offerte (Angebote → Offerten, Angebots… →
//      Offerten…), Kostenvoranschlag → Offerte, Bundesland → Kanton.
//   3. VAT: "inkl. MwSt." / "zzgl. MwSt." → "… 8.1 % MwSt." where the string
//      already mentions VAT (Swiss rate since 2024).
//   4. € / EUR → CHF ONLY in strings that are not product prices. Product-price
//      strings (the price guide and the other posts that quote €/m², the
//      calculator meta, the architect/portal budget-band copy, the CZ/SK
//      supply page invoiced from Poland) are LEFT AS THEY ARE and listed by
//      --report: none of them renders on the ch locale (pricesPublished() in
//      src/lib/currency.ts hides the calculator, the price posts and the
//      Product offers there).
//   5. Swiss-specific values (OVERRIDES): hero subline, dealer copy naming
//      QuinLay AG, title pattern, contact/impressum/footer/modal strings —
//      the Swiss German register lives here, not in de.json.
// Contact data (phone, e-mail, address) is NOT rewritten: components read
// swissPartner from src/lib/site-config.ts on the ch locale.
// Output is byte-identical to the repo convention:
// JSON.stringify(obj, null, 2) + '\n' with UTF-8 characters unescaped.
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DE = join(root, 'messages', 'de.json');
const CH = join(root, 'messages', 'ch.json');
const args = new Set(process.argv.slice(2));

// ---- 4. Strings that quote product prices: never converted to CHF ----------
// Matched by key-path prefix. Everything here is hidden on ch by code.
const PRICE_STRING_PREFIXES = [
  'blogPosts.posts.', // every € inside an article body is a product price or a Belgian grant
  'meta.priceCalculatorDescription', // "€70–200/m²" — page is 404 on ch
  'meta.supplyCzSkDescription', // Czech/Slovak supply invoiced from Poland in EUR/PLN
  'supplyCzSkPage.', // idem
  'architectsPage.', // "€/m²-Budgetbänder" — the architect portal bands are EUR
  'portal.', // portal copy: trade pricing, EUR/PLN by pricebook
  'datasheetEmail.architectInvite', // same €/m² budget-band wording
  'currency.', // "indication to the ECB rate … all payments in EUR": describes EUR settlement; ch settles in CHF and never renders an indication
];

// ---- 2. Vocabulary (values only) ------------------------------------------
// "Angebot" in the sense of a product RANGE (Sortiment) stays "Angebot" —
// only the quote sense becomes "Offerte". Protected before the swap.
const ASSORTMENT_SENSE = /\b((?:in )?(?:Ihr|ihr|unser|das) )Angebot( (?:um|auf|an|erweitern)\b)/g;
const ASSORTMENT_MARK = '\u0000ANGEBOT\u0000';
// Angebot is neuter, Offerte is feminine: fix the article + adjective chain in
// front of the noun before the noun itself is swapped.
const NOM = { ein: 'eine', Ein: 'Eine', kein: 'keine', Kein: 'Keine', dieses: 'diese', Dieses: 'Diese', jedes: 'jede', Jedes: 'Jede' };
const DAT = { einem: 'einer', Einem: 'Einer', keinem: 'keiner', dem: 'der', Ihrem: 'Ihrer', unserem: 'unserer', jedem: 'jeder' };
const VOCAB = [
  [/\bKostenvoranschlag\b/g, 'Offerte'],
  [/\bKostenvoranschläge\b/g, 'Offerten'],
  // "ein kostenloses, unverbindliches Angebot" → "eine kostenlose, unverbindliche Offerte"
  [/\b(ein|Ein|kein|Kein|dieses|Dieses|jedes|Jedes)((?:\s+[a-zäöü]+es,?)*)\s+Angebot\b/g, (_, art, adj) => `${NOM[art]}${adj.replace(/es\b/g, 'e')} Offerte`],
  // "einem kostenlosen, unverbindlichen Angebot" → "einer kostenlosen, unverbindlichen Offerte"
  [/\b(einem|Einem|keinem|dem|Ihrem|unserem|jedem)((?:\s+[a-zäöü]+en,?)*)\s+Angebot\b/g, (_, art, adj) => `${DAT[art]}${adj} Offerte`],
  // "das verbindliche Angebot" → "die verbindliche Offerte"
  [/\b(das|Das)((?:\s+[a-zäöü]+e,?)*)\s+Angebot\b/g, (_, art, adj) => `${art === 'das' ? 'die' : 'Die'}${adj} Offerte`],
  // "Kostenloses verbindliches Angebot" (no article) → "Kostenlose verbindliche Offerte"
  [/((?:\b[A-Za-zÄÖÜäöü]+es,?\s+)+)Angebot\b/g, (_, adj) => `${adj.replace(/es\b/g, 'e')}Offerte`],
  [/\bIhr Angebot\b/g, 'Ihre Offerte'],
  [/\bunser Angebot\b/g, 'unsere Offerte'],
  [/\bAngebote\b/g, 'Offerten'],
  [/\bAngebots(?=[a-zäöü-])/g, 'Offerten'], // Angebotsanfrage → Offertenanfrage, Angebots-Button → Offerten-Button
  [/\bAngebot\b/g, 'Offerte'],
  [/\bBundesland\b/g, 'Kanton'],
  [/\bBundesländer\b/g, 'Kantone'],
];

// ---- 5. Swiss-specific values ----------------------------------------------
// Keys use the same dotted path syntax as the message tools: [n] = array index.
const OVERRIDES = {
  'home.hero.slides.0.subhead':
    'Hersteller aus Belgien und Polen – Generalvertretung Schweiz & Liechtenstein: QuinLay AG, Showroom Rickenbach LU.',
  'meta.homeTitle': 'STRETCH — Spanndecken Schweiz & Liechtenstein | Generalvertretung QuinLay AG',
  'meta.homeDescription':
    'Fugenlose Spanndecken und Spannwände vom Hersteller (Belgien & Polen), in der Schweiz und in Liechtenstein beraten, ausgestellt und montiert über die Generalvertretung QuinLay AG, Rickenbach LU. Showroom, Schulungsraum, Lager in der Schweiz.',
  // Utility-bar tagline: one line at 11.5px beside five links — keep it short.
  'common.handMadeInBelgium': 'Generalvertretung CH & FL: QuinLay AG',
  'footer.tagline':
    'Spanndecken und Spannwände aus eigener Produktion in Belgien und Polen – in der Schweiz und in Liechtenstein beraten, geliefert und montiert über unsere Generalvertretung QuinLay AG, Rickenbach LU.',
  // Dealer directory — every Swiss page is a real QuinLay page.
  'dealersPage.h1': 'Spanndecke {place}',
  'dealersPage.metaTitleDealer': 'Spanndecke {place} – Beratung, Showroom & Montage | STRETCH × QuinLay AG',
  'dealersPage.metaDescDealer':
    'Spanndecke in {place}: Beratung im Showroom Rickenbach LU, Aufmass vor Ort, Fertigung nach Mass in unseren Werken in Belgien und Polen, Montage durch geschulte Partner. QuinLay AG, Generalvertretung STRETCH Schweiz & Liechtenstein – Offerte anfragen.',
  'dealersPage.introDealer':
    'Eine STRETCH-Spanndecke in {place} beginnt bei der QuinLay AG, unserer Generalvertretung für die Schweiz und Liechtenstein: Beratung im Showroom in Rickenbach LU, Aufmass vor Ort, Fertigung nach Mass in unseren Werken in Belgien und Polen, Montage durch geschulte Partner – Material ab Schweizer Lager.',
  'dealersPage.dealerBadge': 'Generalvertretung STRETCH Schweiz & Liechtenstein',
  'dealersPage.dealerBadgeShort': 'Generalvertretung',
  'dealersPage.whyTitle': 'Warum STRETCH in der Schweiz',
  'dealersPage.why1':
    'Vom Hersteller – jede Decke wird in unseren eigenen Werken in Belgien und Polen nach Mass verschweisst und kommt montagefertig in die Schweiz.',
  'dealersPage.why2':
    'Geschulte Montage – die Partner der QuinLay AG durchlaufen die STRETCH-Schulung im eigenen Schulungsraum in Rickenbach LU und arbeiten mit unseren Profilen, Folien und Beleuchtungen.',
  'dealersPage.why3': 'Ein Ansprechpartner – Beratung, Material ab Schweizer Lager und Montage aus einer Hand, mit STRETCH im Hintergrund.',
  'dealersPage.ovMetaTitle': 'STRETCH-Händler Schweiz & Liechtenstein – QuinLay AG | STRETCH',
  'dealersPage.ovMetaDescription':
    'Spanndecken in der Schweiz und in Liechtenstein: Beratung, Showroom und Montage über die Generalvertretung QuinLay AG in Rickenbach LU – von Luzern über Zürich, Bern und Basel bis Vaduz.',
  'dealersPage.ovIntro':
    'In der Schweiz und in Liechtenstein werden STRETCH-Spanndecken über unsere Generalvertretung QuinLay AG beraten, ausgestellt und montiert – Showroom und Schulungsraum in Rickenbach LU, Material ab Schweizer Lager. Wählen Sie Ihre Region.',
  'dealersPage.identityDirectKicker': 'Generalvertretung Schweiz & Liechtenstein',
  'dealersPage.identityDirectTitle': '{place}: beraten und montiert über die QuinLay AG',
  'dealersPage.identityDirectBody':
    'Die QuinLay AG in Rickenbach LU ist die Generalvertretung von STRETCH für die Schweiz und Liechtenstein: Beratung im Showroom, Aufmass vor Ort in {place}, Material ab Schweizer Lager und Montage durch geschulte Partner. Hergestellt werden die Decken nach Mass in unseren Werken in Belgien und Polen.',
  'dealersPage.identityDirectCard': 'Generalvertretung STRETCH Schweiz & Liechtenstein – Beratung, Showroom, Montage.',
  'dealersPage.recruitBody':
    'Wir suchen aktiv einen Montagepartner in {place}: Schulung im Schulungsraum der QuinLay AG in Rickenbach LU, Material ab Schweizer Lager, Marketingunterstützung – und die Anfragen dieser Seite gehen an Sie.',
  // Contact page, footer, modals — Swiss German register.
  'contactPage.swissPartnerTitle': 'Ihr Ansprechpartner in der Schweiz und in Liechtenstein: QuinLay AG, Rickenbach LU',
  'contactPage.swissPartnerBody':
    'Die QuinLay AG ist die Generalvertretung von STRETCH für die Schweiz und Liechtenstein: Showroom und Schulungsraum in Rickenbach LU, Material ab Schweizer Lager, Montage durch geschulte Partner. Jede Anfrage aus der Schweiz beantwortet die QuinLay AG – mit STRETCH in Kopie.',
  'contactPage.swissCallback': 'Rückruf durch QuinLay AG',
  'contactPage.impressumHeading': 'Impressum – Schweiz & Liechtenstein',
  'contactPage.impressumManufacturer': 'Hersteller',
  'contactPage.impressumSwissParty': 'Vertragspartnerin für die Schweiz und Liechtenstein',
  'contactPage.impressumNote': 'Offerten, Lieferungen und Rechnungen für die Schweiz und Liechtenstein erfolgen durch die QuinLay AG.',
  'contactPage.hours': 'Rückruf durch QuinLay AG',
  'modals.swissPartnerNote':
    'Ihre Anfrage geht an die QuinLay AG, Rickenbach LU – Generalvertretung STRETCH Schweiz & Liechtenstein – mit STRETCH in Kopie. Rückruf durch QuinLay AG.',
  'footer.swissPartnerHeading': 'Generalvertretung Schweiz & Liechtenstein',
  'footer.manufacturerHeading': 'Hersteller – Belgien',
  'partnersPage.why.quinlayCard.title': 'Schweiz & Liechtenstein: QuinLay AG',
  'partnersPage.why.quinlayCard.body':
    'Unsere Generalvertretung für die Schweiz und Liechtenstein – Showroom und Schulungsraum in Rickenbach LU, Material ab Schweizer Lager, Montagepartner im ganzen Land.',
  'partnersPage.why.quinlayCard.cta': 'Zu quinlay.ch',
  'trainingPage.dates.externalCta': 'Termine & Buchung auf quinlay.ch',
  'trainingPage.dates.swissRoom': 'Die Kurse finden im eigenen Schulungs- und Testraum der QuinLay AG in Rickenbach LU statt.',
  'trainingPage.dates.secondaryCta': 'Fragen zum Kurs? Kontakt aufnehmen',
  'trainingPage.hero.travel': 'Rickenbach LU – Schulungs- und Testraum der QuinLay AG, 15 Minuten von Luzern',
  'trainingPage.dates.lead': 'Zwei Tageskurse bei der QuinLay AG in Rickenbach LU – Termine und Buchung direkt auf quinlay.ch.',
  // Installer training: QuinLay AG runs day courses (Basic / Advanced) in
  // Rickenbach LU, booked on quinlay.ch — no Belgian "2–3 days at HQ" claims.
  'trainingPage.hero.titleC': 'als Tageskurs',
  'trainingPage.hero.lead':
    'Praxiskurse im Schulungs- und Testraum der QuinLay AG in Rickenbach LU – Tageskurs Basic für den Einstieg, Tageskurs Advanced zum Vertiefen. Termine, Inhalte und Buchung auf quinlay.ch.',
  'trainingPage.format[0].value': '1 Tag',
  'trainingPage.format[0].label': 'pro Kurs',
  'trainingPage.format[1].value': 'Rickenbach LU',
  'trainingPage.format[1].label': 'Schulungs- und Testraum QuinLay AG',
  'trainingPage.format[2].value': '2',
  'trainingPage.format[2].label': 'Kurse: Basic & Advanced',
  'trainingPage.courseName': 'STRETCH-Tageskurse bei der QuinLay AG',
  'trainingPage.courseDescription':
    'Tageskurse Basic und Advanced zur Spanndecken-Montage im Schulungs- und Testraum der QuinLay AG in Rickenbach LU – Termine und Buchung auf quinlay.ch.',
  'trainingPage.curriculum.lead':
    'Das STRETCH-Programm – von der Membranrolle zur fertigen, beleuchteten Akustikdecke. Die genauen Inhalte der beiden Tageskurse finden Sie auf quinlay.ch.',
  // Supply / export copy: the contracting party for CH & FL is QuinLay AG.
  'supplyPage.currencyLine': 'Preise und Rechnungsstellung in CHF durch die QuinLay AG (Schweiz & Liechtenstein).',
  'projectsExportPage.how.currencyLine': 'Rechnungsstellung in CHF durch die QuinLay AG (Schweiz & Liechtenstein).',
};

// ---- helpers ---------------------------------------------------------------
const PLACEHOLDER = /\{[^}]+\}/g;
const touched = { eszett: [], vocab: [], vat: [], currency: [], overrides: [], currencySkipped: [], phone: [] };

function isPriceString(path) {
  return PRICE_STRING_PREFIXES.some((p) => path.startsWith(p));
}

function transform(value, path) {
  let v = value;
  // Protect ICU placeholders (they may contain letters we must not touch).
  const slots = [];
  v = v.replace(PLACEHOLDER, (m) => {
    slots.push(m);
    return ` ${slots.length - 1} `;
  });
  const before = v;
  if (v.includes('ß')) {
    v = v.replace(/ß/g, 'ss');
    touched.eszett.push(path);
  }
  let vv = v.replace(ASSORTMENT_SENSE, `$1${ASSORTMENT_MARK}$2`);
  for (const [re, to] of VOCAB) vv = vv.replace(re, to);
  vv = vv.split(ASSORTMENT_MARK).join('Angebot');
  if (vv !== v) touched.vocab.push(path);
  v = vv;
  if (/(inkl|zzgl)\. MwSt\./.test(v) && !/8\.1 % MwSt\./.test(v)) {
    v = v.replace(/(inkl|zzgl)\. MwSt\./g, '$1. 8.1 % MwSt.');
    touched.vat.push(path);
  }
  // Phone placeholders ("+32 ...", "+49 ...", "+971 ...") → the Swiss code.
  if (/^\+\d{2,3} \.\.\.$/.test(v) && v !== '+41 ...') {
    v = '+41 ...';
    touched.phone.push(path);
  }
  if (/€|\bEUR\b/.test(v)) {
    if (isPriceString(path)) {
      touched.currencySkipped.push(path);
    } else {
      v = v.replace(/\bEUR\b/g, 'CHF').replace(/€/g, 'CHF');
      touched.currency.push(path);
    }
  }
  void before;
  return v.replace(/ (\d+) /g, (_, i) => slots[Number(i)]);
}

function walk(node, path) {
  if (Array.isArray(node)) return node.map((v, i) => walk(v, `${path}[${i}]`));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = walk(v, path ? `${path}.${k}` : k);
    return out;
  }
  if (typeof node === 'string') return transform(node, path);
  return node;
}

function setPath(obj, path, value) {
  const parts = [];
  for (const m of path.matchAll(/([^.[\]]+)|\[(\d+)\]/g)) parts.push(m[1] !== undefined ? m[1] : Number(m[2]));
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] === undefined) throw new Error(`override path does not exist in de.json: ${path}`);
    cur = cur[p];
  }
  const last = parts[parts.length - 1];
  if (cur[last] === undefined) throw new Error(`override path does not exist in de.json: ${path}`);
  cur[last] = value;
}

// ---- run -------------------------------------------------------------------
const de = JSON.parse(readFileSync(DE, 'utf8'));
const ch = walk(de, '');
for (const [path, value] of Object.entries(OVERRIDES)) {
  setPath(ch, path, value);
  touched.overrides.push(path);
}
const out = JSON.stringify(ch, null, 2) + '\n';

if (args.has('--check')) {
  const current = existsSync(CH) ? readFileSync(CH, 'utf8') : '';
  if (current !== out) {
    console.error('messages/ch.json is stale — run: node scripts/ch-overlay.mjs');
    process.exit(1);
  }
  console.log('messages/ch.json is up to date');
} else {
  writeFileSync(CH, out);
  console.log(`messages/ch.json written from de.json`);
}
console.log(
  `ß→ss: ${touched.eszett.length} strings · vocabulary: ${touched.vocab.length} · VAT 8.1 %: ${touched.vat.length} · €/EUR→CHF: ${touched.currency.length} (skipped as product prices: ${touched.currencySkipped.length}) · phone placeholders → +41: ${touched.phone.length} · Swiss overrides: ${touched.overrides.length}`,
);
if (args.has('--report')) {
  const list = (title, arr) => {
    console.log(`\n${title} (${arr.length})`);
    for (const p of arr) console.log(`  ${p}`);
  };
  list('€/EUR → CHF', touched.currency);
  list('Phone placeholders → +41 ...', touched.phone);
  list('€/EUR left as is (product prices / EUR-settlement notes, hidden on ch)', touched.currencySkipped);
  list('VAT → 8.1 %', touched.vat);
  list('Vocabulary', touched.vocab);
  list('Swiss overrides', touched.overrides);
}
