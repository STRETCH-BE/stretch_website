// Spam-score regression tests — `npm test`.
// Pins the scoring contract from docs/ANTI-SPAM.md:
//   • the real spam row that started all this must score >= HARD_THRESHOLD;
//   • anonymised equivalents of three legitimate submissions score < FLAG;
//   • the name heuristics keep passing real-world capitalisation and
//     consonant-heavy Polish names;
//   • canonicalEmail collapses the Gmail dot/plus tricks.
// Loads the TypeScript sources directly via ts.transpileModule — no build step.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadTs(relPath, extraModules = {}) {
  const path = fileURLToPath(new URL(relPath, import.meta.url));
  const js = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  const localRequire = (id) => (id in extraModules ? extraModules[id] : require(id));
  new Function('require', 'module', 'exports', js)(localRequire, mod, mod.exports);
  return mod.exports;
}

const email = loadTs('../src/lib/spam/email.ts');
const { scoreSubmission, hasRandomCaseWord, FLAG_THRESHOLD, HARD_THRESHOLD } = loadTs(
  '../src/lib/spam/score.ts',
  { './email': email },
);

let failures = 0;
function check(label, ok, detail = '') {
  if (ok) {
    console.log(`  ok  ${label}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

// --- 1. The real spam row (verbatim from the leads table) must hard-fail ----
{
  const { score, reasons } = scoreSubmission({
    fields: {
      name: 'lQazfcnPUfNaTSBCmjtARCKr',
      company: 'clijtFrEseYMSzYhHMkCb',
      city: 'mnrhFilmZFLiAtizNeT',
      email: 'j.eq.u.xa.nole9.0@gmail.com',
      phone: '7951189303',
    },
  });
  check(`real spam row scores ${score} >= ${HARD_THRESHOLD}`, score >= HARD_THRESHOLD, reasons.join(', '));
}

// --- 2. Anonymised legitimate rows must stay below the flag threshold -------
const LEGIT = [
  {
    label: 'BE installer quote request',
    fields: {
      name: 'Jan Peeters',
      company: 'Peeters Interieur BV',
      city: 'Antwerpen',
      email: 'jan.peeters@peetersinterieur.be',
      phone: '+32 470 12 34 56',
      message: 'Graag een offerte voor een spanplafond van 42 m2 in de woonkamer.',
    },
  },
  {
    label: 'PL consonant-heavy name',
    fields: {
      name: 'Krzysztof Szczepański',
      company: 'Sufity Chrzanowski',
      city: 'Pszczyna',
      email: 'biuro@sufity-pszczyna.pl',
      phone: '+48 601 234 567',
      message: 'Proszę o wycenę sufitu napinanego, ok. 60 m2.',
    },
  },
  {
    label: 'NL architect with gmail + capitalised surname',
    fields: {
      name: 'Anne VanDenBroucke',
      company: 'Studio VDB',
      city: "'s-Hertogenbosch",
      email: 'anne.vdb.studio@gmail.com',
      phone: '06 12 34 56 78',
      message: 'Kunnen jullie een McDonald restaurant project aan? Zie www.studiovdb.nl.',
    },
  },
];
for (const row of LEGIT) {
  const { score, reasons } = scoreSubmission({ fields: row.fields });
  check(`${row.label} scores ${score} < ${FLAG_THRESHOLD}`, score < FLAG_THRESHOLD, reasons.join(', '));
}

// --- 3. Case heuristics: real names pass, gibberish does not ---------------
for (const good of ['McDonald', 'iPhone', 'VanDenBroucke', 'Verbandsgemeinde', 'Szczepański']) {
  check(`hasRandomCaseWord('${good}') is false`, !hasRandomCaseWord(good));
}
for (const bad of ['clijtFrEseYMSzYhHMkCb', 'lQazfcnPUfNaTSBCmjtARCKr']) {
  check(`hasRandomCaseWord('${bad}') is true`, hasRandomCaseWord(bad));
}

// --- 4. Meta signals stack the way the routes rely on ----------------------
{
  const missing = scoreSubmission({ fields: { email: 'a@b.co' }, meta: { formToken: 'missing' } });
  check(`missing form token adds 40 (got ${missing.score})`, missing.score === 40);
  const fast = scoreSubmission({ fields: { email: 'a@b.co' }, meta: { formToken: 'fast' } });
  check(`sub-3s form token adds 60 (got ${fast.score})`, fast.score === 60);
  const honeypot = scoreSubmission({ fields: {}, meta: { honeypot: true } });
  check(`honeypot alone hard-fails (got ${honeypot.score})`, honeypot.score >= HARD_THRESHOLD);
}

// --- 5. canonicalEmail collapses the alias tricks ---------------------------
{
  const { canonicalEmail, gmailDotCount, isFreemail, isDisposable } = email;
  check(
    "canonicalEmail('j.eq.u.xa.nole9.0@gmail.com') = 'jequxanole90@gmail.com'",
    canonicalEmail('j.eq.u.xa.nole9.0@gmail.com') === 'jequxanole90@gmail.com',
  );
  check(
    "canonicalEmail('Jan.Peeters+offerte@Gmail.com') = 'janpeeters@gmail.com'",
    canonicalEmail('Jan.Peeters+offerte@Gmail.com') === 'janpeeters@gmail.com',
  );
  check(
    "canonicalEmail keeps dots outside gmail ('a.b@firma.be')",
    canonicalEmail('a.b@firma.be') === 'a.b@firma.be',
  );
  check("gmailDotCount('a.b@firma.be') = 0", gmailDotCount('a.b@firma.be') === 0);
  check("isFreemail('telenet.be')", isFreemail('telenet.be'));
  check("!isFreemail('peetersinterieur.be')", !isFreemail('peetersinterieur.be'));
  check("isDisposable('mailinator.com')", isDisposable('mailinator.com'));
  check("!isDisposable('stretchplafond.be')", !isDisposable('stretchplafond.be'));
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll spam-score checks passed');
