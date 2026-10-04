// Training-days regression tests — part of `npm test`.
// Pins what the sites and the admin derive from public.training_sessions:
//   • formatTrainingDate — the per-locale labels (UTC calendar dates, pt long month);
//   • upcomingSessions — a day disappears on its own date (Brussels), full days;
//   • buildTrainingView — cards, the preferred-date choices and their English
//     canonical lines, the EN/DE/PL interest state, partner-run locales;
//   • applyTrainingChoice — what a form submits;
//   • validateTrainingDay — the admin API's 400s name the field.
// Loads the TypeScript sources through the repo's module hooks — no build step.
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./ts-alias-hooks.mjs', import.meta.url);
const { formatTrainingDate, buildTrainingView } = await import('../src/lib/training/view.ts');
const { upcomingSessions, dateInTimeZone, shiftIsoDate, isTrainingFull } = await import('../src/lib/training/dates.ts');
const { applyTrainingChoice, fallbackView } = await import('../src/lib/training/choices.ts');
const { validateTrainingDay } = await import('../src/lib/training/validate.ts');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`✗ ${name}\n  ${err instanceof Error ? err.message : err}`);
    process.exitCode = 1;
  }
}
async function testAsync(name, fn) {
  try {
    await fn();
    passed++;
  } catch (err) {
    console.error(`✗ ${name}\n  ${err instanceof Error ? err.message : err}`);
    process.exitCode = 1;
  }
}

const row = (over = {}) => ({
  id: 'a1',
  starts_on: '2026-11-19',
  ends_on: null,
  system: 'polyester',
  languages: ['NL', 'EN'],
  location: 'Beveren-Waas',
  seats_left: null,
  status: 'open',
  published: true,
  created_at: '2026-10-04T00:00:00Z',
  updated_at: '2026-10-04T00:00:00Z',
  ...over,
});
const SEED = [row(), row({ id: 'b2', starts_on: '2026-11-20', system: 'pvc' })];
const NOW = new Date('2026-10-04T12:00:00Z');

// ---- date labels ------------------------------------------------------------
test('date labels per locale (19 Nov 2026)', () => {
  assert.equal(formatTrainingDate('be', '2026-11-19', null), 'do 19 nov 2026');
  assert.equal(formatTrainingDate('nl', '2026-11-19', null), 'do 19 nov 2026');
  assert.equal(formatTrainingDate('en', '2026-11-19', null), 'Thu, 19 Nov 2026');
  assert.equal(formatTrainingDate('uk', '2026-11-19', null), 'Thu, 19 Nov 2026');
  assert.equal(formatTrainingDate('us', '2026-11-19', null), 'Thu, Nov 19, 2026');
  assert.equal(formatTrainingDate('de', '2026-11-19', null), 'Do., 19. Nov. 2026');
  assert.equal(formatTrainingDate('fr', '2026-11-19', null), 'jeu. 19 nov. 2026');
  assert.equal(formatTrainingDate('pl', '2026-11-19', null), 'czw., 19 lis 2026');
  assert.equal(formatTrainingDate('pt', '2026-11-19', null), 'quinta, 19 de novembro de 2026');
});
test('a multi-day block formats as a range', () => {
  assert.equal(formatTrainingDate('be', '2026-10-06', '2026-10-08'), '6–8 okt 2026');
  assert.equal(formatTrainingDate('en', '2026-10-06', '2026-10-08'), '6–8 Oct 2026');
  // ends_on equal to starts_on is a one-day session
  assert.equal(formatTrainingDate('be', '2026-11-19', '2026-11-19'), 'do 19 nov 2026');
});

// ---- today / upcoming ------------------------------------------------------
test('"today" follows Europe/Brussels, not UTC', () => {
  // 23:30 UTC on 18 Nov is already 19 Nov in Brussels (UTC+1 in November).
  assert.equal(dateInTimeZone(new Date('2026-11-18T23:30:00Z')), '2026-11-19');
  assert.equal(shiftIsoDate('2026-03-01', -1), '2026-02-28');
  assert.equal(shiftIsoDate('2026-12-31', 1), '2027-01-01');
});
test('a day disappears on its own date; full days stay listed; unpublished never', () => {
  const rows = [
    row({ id: 'past', starts_on: '2026-11-18' }),
    row({ id: 'today', starts_on: '2026-11-19' }),
    row({ id: 'tomorrow', starts_on: '2026-11-20', status: 'full' }),
    row({ id: 'later', starts_on: '2026-12-11', seats_left: 0 }),
    row({ id: 'hidden', starts_on: '2026-12-12', published: false }),
  ];
  const now = new Date('2026-11-19T08:00:00Z'); // 19 Nov in Brussels
  assert.deepEqual(upcomingSessions(rows, now).map((r) => r.id), ['tomorrow', 'later']);
  assert.equal(isTrainingFull(row({ seats_left: 0 })), true);
  assert.equal(isTrainingFull(row({ status: 'full' })), true);
  assert.equal(isTrainingFull(row({ seats_left: 3 })), false);
});

// ---- the view ---------------------------------------------------------------
await testAsync('be view: two cards, two day choices, DE/PL interest, no EN interest', async () => {
  const v = await buildTrainingView('be', SEED, NOW);
  assert.equal(v.partnerRun, false);
  assert.deepEqual(v.sessions.map((s) => `${s.dateLabel} · ${s.systemLabel}`), [
    'do 19 nov 2026 · Polyester spanplafonds',
    'vr 20 nov 2026 · PVC-spanplafonds',
  ]);
  assert.deepEqual(v.sessions.map((s) => s.note), ['Beveren-Waas', 'Beveren-Waas']);
  assert.deepEqual(v.sessions.map((s) => s.full), [false, false]);
  assert.deepEqual(v.sessions.map((s) => s.eventTitle), [
    'Installateursopleiding — Polyester spanplafonds',
    'Installateursopleiding — PVC-spanplafonds',
  ]);
  assert.deepEqual(v.choices.map((c) => c.value), ['a1', 'b2', 'interest:DE', 'interest:PL', 'custom']);
  assert.equal(v.choices[0].label, 'do 19 nov 2026 — Polyester spanplafonds (NL/EN)');
  assert.equal(v.choices[0].canonical, 'Thu, 19 Nov 2026 — Polyester ceilings (NL/EN) · Beveren-Waas');
  assert.equal(v.choices[0].sessionId, 'a1');
  assert.equal(v.choices[2].label, 'Duitstalige sessie — nieuwe data binnenkort');
  assert.equal(v.choices[2].canonical, 'German session — new dates soon');
  assert.equal(v.choices[4].label, 'Sessie op maat op locatie');
  assert.equal(v.choices[4].canonical, 'Custom on-site session');
  assert.deepEqual(v.interest.map((i) => [i.language, i.sessions.length, i.card === null]), [
    ['EN', 2, true],
    ['DE', 0, false],
    ['PL', 0, false],
  ]);
  assert.equal(v.interest[2].card.label, 'Poolstalige sessie — nieuwe data binnenkort');
});
await testAsync('en / us / pl views format and label in their own language', async () => {
  const en = await buildTrainingView('en', SEED, NOW);
  assert.equal(en.sessions[0].dateLabel, 'Thu, 19 Nov 2026');
  assert.equal(en.sessions[0].systemLabel, 'Polyester ceilings');
  assert.equal(en.choices[0].label, 'Thu, 19 Nov 2026 — Polyester ceilings (NL/EN)');
  const us = await buildTrainingView('us', SEED, NOW);
  assert.equal(us.sessions[1].dateLabel, 'Fri, Nov 20, 2026');
  assert.equal(us.choices[1].canonical, 'Fri, 20 Nov 2026 — PVC ceilings (NL/EN) · Beveren-Waas');
  const pl = await buildTrainingView('pl', SEED, NOW);
  assert.equal(pl.sessions[0].dateLabel, 'czw., 19 lis 2026');
  assert.equal(pl.sessions[0].systemLabel, 'Sufity napinane poliestrowe');
  assert.equal(pl.choices[2].label, 'Sesja po niemiecku — nowe terminy wkrótce');
});
await testAsync('seats plural, full days and a non-HQ location', async () => {
  const rows = [
    row({ id: 'one', seats_left: 1 }),
    row({ id: 'many', starts_on: '2026-11-20', seats_left: 5, system: 'pvc' }),
    row({ id: 'full', starts_on: '2026-11-21', status: 'full', seats_left: 2 }),
    row({ id: 'zero', starts_on: '2026-11-22', seats_left: 0 }),
    row({ id: 'pl', starts_on: '2026-12-11', languages: ['PL'], location: 'Częstochowa', system: 'both' }),
  ];
  const be = await buildTrainingView('be', rows, NOW);
  assert.deepEqual(be.sessions.map((s) => s.note), [
    'Beveren-Waas · 1 plaats vrij',
    'Beveren-Waas · 5 plaatsen vrij',
    'Beveren-Waas', // full: no seat count
    'Beveren-Waas',
    'Częstochowa',
  ]);
  assert.deepEqual(be.sessions.map((s) => s.full), [false, false, true, true, false]);
  // full days are visible but not choosable
  assert.deepEqual(be.choices.map((c) => c.value), ['one', 'many', 'pl', 'interest:DE', 'custom']);
  assert.equal(be.choices[2].label, 'vr 11 dec 2026 — Polyester + PVC (PL)');
  assert.equal(be.choices[2].canonical, 'Fri, 11 Dec 2026 — Polyester + PVC (PL) · Częstochowa');
  // a Polish day switches the PL interest card to a real day
  assert.equal(be.interest[2].card, null);
  assert.equal(be.interest[2].sessions[0].id, 'pl');
  const pl = await buildTrainingView('pl', rows, NOW);
  assert.deepEqual(pl.sessions.slice(0, 2).map((s) => s.note), ['Beveren-Waas · 1 wolne miejsce', 'Beveren-Waas · 5 wolnych miejsc']);
});
await testAsync('no upcoming day: only the three interest choices and custom', async () => {
  const v = await buildTrainingView('nl', [], NOW);
  assert.deepEqual(v.sessions, []);
  assert.deepEqual(v.choices.map((c) => c.value), ['interest:EN', 'interest:DE', 'interest:PL', 'custom']);
  assert.deepEqual(v.interest.map((i) => i.card !== null), [true, true, true]);
  // the client-side fallback matches the server view (labels), canonical from English
  const fb = fallbackView('nl', {
    interest: {
      EN: { label: v.interest[0].card.label, note: v.interest[0].card.note },
      DE: { label: v.interest[1].card.label, note: v.interest[1].card.note },
      PL: { label: v.interest[2].card.label, note: v.interest[2].card.note },
    },
    custom: v.choices[3].label,
  });
  assert.deepEqual(fb.choices, v.choices);
});
await testAsync('partner-run locales keep the QuinLay courses, no DB days, no interest', async () => {
  for (const locale of ['ch', 'fr-ch']) {
    const v = await buildTrainingView(locale, SEED, NOW);
    assert.equal(v.partnerRun, true);
    assert.deepEqual(v.sessions, []);
    assert.deepEqual(v.interest, []);
    assert.equal(v.choices.length, 2);
    assert.match(v.choices[0].value, /^Tageskurs Basic/);
    assert.equal(v.choices[0].value, v.choices[0].label);
    assert.equal(v.choices[0].canonical, v.choices[0].label);
  }
});

// ---- what a form submits ---------------------------------------------------
await testAsync('applyTrainingChoice: canonical label + session id; interest and custom have no id', async () => {
  const v = await buildTrainingView('be', SEED, NOW);
  const booking = { fullName: 'Test', preferredDate: 'a1' };
  applyTrainingChoice(booking, v.choices);
  assert.equal(booking.preferredDate, 'Thu, 19 Nov 2026 — Polyester ceilings (NL/EN) · Beveren-Waas');
  assert.equal(booking.trainingSessionId, 'a1');
  const interest = { preferredDate: 'interest:PL' };
  applyTrainingChoice(interest, v.choices);
  assert.equal(interest.preferredDate, 'Polish session — new dates soon');
  assert.equal('trainingSessionId' in interest, false);
  const custom = { preferredDate: 'custom' };
  applyTrainingChoice(custom, v.choices);
  assert.equal(custom.preferredDate, 'Custom on-site session');
  const unknown = { preferredDate: 'Tageskurs Basic – CHF 1 050 exkl. MwSt.' };
  applyTrainingChoice(unknown, v.choices);
  assert.equal(unknown.preferredDate, 'Tageskurs Basic – CHF 1 050 exkl. MwSt.');
  const empty = {};
  applyTrainingChoice(empty, v.choices);
  assert.deepEqual(empty, {});
});

// ---- admin validation -------------------------------------------------------
test('validateTrainingDay: defaults and normalisation', () => {
  const r = validateTrainingDay({ starts_on: '2026-12-11', system: 'polyester', languages: ['en', 'EN', ' nl '] });
  assert.equal(r.ok, true);
  assert.deepEqual(r.row, {
    starts_on: '2026-12-11',
    ends_on: null,
    system: 'polyester',
    languages: ['EN', 'NL'],
    location: 'Beveren-Waas',
    seats_left: null,
    status: 'open',
    published: true,
    note: null,
  });
  const block = validateTrainingDay({ starts_on: '2026-12-11', ends_on: '2026-12-12', system: 'both', languages: ['NL'], seats_left: '6', note: '  pro forma paid x2  ', status: 'full', published: false, location: '' });
  assert.equal(block.ok, true);
  assert.equal(block.row.ends_on, '2026-12-12');
  assert.equal(block.row.seats_left, 6);
  assert.equal(block.row.note, 'pro forma paid x2');
  assert.equal(block.row.status, 'full');
  assert.equal(block.row.published, false);
  assert.equal(block.row.location, 'Beveren-Waas');
  // an end date equal to the start date is a one-day session
  assert.equal(validateTrainingDay({ starts_on: '2026-12-11', ends_on: '2026-12-11', system: 'pvc', languages: ['NL'] }).row.ends_on, null);
});
test('validateTrainingDay: every rejection names the field', () => {
  const base = { starts_on: '2026-12-11', system: 'polyester', languages: ['EN'] };
  const err = (input) => {
    const r = validateTrainingDay(input);
    assert.equal(r.ok, false);
    return r.error;
  };
  assert.equal(err({ ...base, starts_on: '11/12/2026' }), 'starts_on');
  assert.equal(err({ ...base, starts_on: '2026-02-30' }), 'starts_on');
  assert.equal(err({ ...base, ends_on: '2026-12-10' }), 'ends_on');
  assert.equal(err({ ...base, system: 'x' }), 'system');
  assert.equal(err({ ...base, languages: [] }), 'languages');
  assert.equal(err({ ...base, languages: ['XX'] }), 'languages');
  assert.equal(err({ ...base, languages: 'EN' }), 'languages');
  assert.equal(err({ ...base, location: 'x'.repeat(81) }), 'location');
  assert.equal(err({ ...base, seats_left: -1 }), 'seats_left');
  assert.equal(err({ ...base, seats_left: 100 }), 'seats_left');
  assert.equal(err({ ...base, seats_left: '2.5' }), 'seats_left');
  assert.equal(err({ ...base, status: 'cancelled' }), 'status');
  assert.equal(err({ ...base, published: 'yes' }), 'published');
  assert.equal(err({ ...base, note: 'n'.repeat(501) }), 'note');
});

if (process.exitCode) {
  console.error(`training tests: FAILED (${passed} passed)`);
} else {
  console.log(`training tests: ${passed} passed`);
}
