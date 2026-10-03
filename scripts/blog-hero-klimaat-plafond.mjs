#!/usr/bin/env node
// BLOG — hero of the climate-ceiling article (blog "klimaat-plafond"), ONE
// JPG PER LOCALE → public/images/blog/klimaat-plafond.<locale>.jpg. Same
// frame as the price-guide hero (scripts/blog-hero-lib.mjs); the body is the
// article's own mechanism as a cross-section — slab, plenum with the air
// loop, profiles with integrated openings, membrane, the room tempered by
// convection and radiation — next to the two facts the article states: five
// to ten percent less energy than convection heating, and "one plane, four
// functions, zero visible technology".
//
// Every word comes from messages/<locale>.json: the eyebrow is the "How it
// works behind the membrane" H2, the tagline is the article's own closing
// sentence of section 4, and the short labels below are the nouns of that
// locale's section-2 and section-3 text (draagvloer / dalle / Rohdecke …) —
// never a translation made here from scratch.
//
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/blog-hero-klimaat-plafond.mjs            # all locales
//   node scripts/blog-hero-klimaat-plafond.mjs pl is      # a subset
import { renderAll, postMessages, frameTop, document_, esc } from './blog-hero-lib.mjs';

const SLUG = 'klimaat-plafond';

// Vocabulary per language, lifted from the locale's own article text.
const EN = { slab: 'Structural slab', plenum: 'Plenum', air: 'Air circulates', profile: 'Profile with integrated openings', membrane: 'Membrane', exchange: 'Convection and radiation', comfort: 'Uniform room temperature · no draughts · barely audible', pct: '5–10%', energyA: 'less energy use', energyB: 'than conventional convection heating', qual: 'roughly · depending on the building' };
const NL = { slab: 'Draagvloer', plenum: 'Plenum', air: 'Lucht circuleert', profile: 'Profiel met geïntegreerde openingen', membrane: 'Doek', exchange: 'Convectie en straling', comfort: 'Uniforme ruimtetemperatuur · geen tocht · amper hoorbaar', pct: '5–10 %', energyA: 'minder energieverbruik', energyB: 'tegenover klassieke convectieverwarming', qual: 'ruwweg · afhankelijk van het gebouw' };
const FR = { slab: 'Dalle', plenum: 'Plénum', air: 'L’air circule', profile: 'Profilé à ouvertures intégrées', membrane: 'Toile', exchange: 'Convection et rayonnement', comfort: 'Température uniforme · aucun courant d’air · à peine audible', pct: '5–10 %', energyA: 'd’énergie en moins', energyB: 'par rapport à un chauffage par convection classique', qual: 'environ · selon le bâtiment' };
const DE = { slab: 'Rohdecke', plenum: 'Plenum', air: 'Luft zirkuliert', profile: 'Profil mit integrierten Öffnungen', membrane: 'Folie', exchange: 'Konvektion und Strahlung', comfort: 'Gleichmäßige Raumtemperatur · keine Zugluft · kaum hörbar', pct: '5–10 %', energyA: 'weniger Energieverbrauch', energyB: 'im Vergleich zu klassischer Konvektionsheizung', qual: 'grob · je nach Gebäude' };
const L = {
  en: EN,
  uk: EN,
  us: { ...EN, comfort: 'Uniform room temperature · no drafts · barely audible' },
  be: NL,
  nl: NL,
  fr: FR,
  'fr-ch': FR,
  de: DE,
  ch: { ...DE, comfort: 'Gleichmässige Raumtemperatur · keine Zugluft · kaum hörbar' },
  pl: { slab: 'Strop', plenum: 'Przestrzeń za membraną', air: 'Powietrze krąży', profile: 'Profil ze zintegrowanymi otworami', membrane: 'Membrana', exchange: 'Konwekcja i promieniowanie', comfort: 'Jednolita temperatura · brak przeciągów · prawie niesłyszalna praca', pct: '5–10 %', energyA: 'niższe zużycie energii', energyB: 'w porównaniu z konwencjonalnym ogrzewaniem konwekcyjnym', qual: 'mniej więcej · w zależności od budynku' },
  es: { slab: 'Forjado', plenum: 'Plénum', air: 'El aire circula', profile: 'Perfil con aberturas integradas', membrane: 'Lámina', exchange: 'Convección y radiación', comfort: 'Temperatura uniforme · sin corrientes · apenas se oye', pct: '5–10 %', energyA: 'menos consumo', energyB: 'frente a la calefacción convectiva convencional', qual: 'aproximadamente · según el edificio' },
  pt: { slab: 'Laje', plenum: 'Plenum', air: 'O ar circula', profile: 'Perfil com aberturas integradas', membrane: 'Tela', exchange: 'Convecção e radiação', comfort: 'Temperatura uniforme · sem correntes de ar · mal se ouve', pct: '5–10 %', energyA: 'menos consumo de energia', energyB: 'face ao aquecimento convectivo convencional', qual: 'cerca de · conforme o edifício' },
  da: { slab: 'Bærende dæk', plenum: 'Hulrum', air: 'Luften cirkulerer', profile: 'Profil med integrerede åbninger', membrane: 'Membran', exchange: 'Konvektion og stråling', comfort: 'Ensartet rumtemperatur · ingen træk · knap hørbar', pct: '5–10 %', energyA: 'lavere energiforbrug', energyB: 'sammenlignet med konventionel konvektionsvarme', qual: 'cirka · afhængigt af bygningen' },
  sv: { slab: 'Bärande bjälklag', plenum: 'Utrymme', air: 'Luften cirkulerar', profile: 'Profil med integrerade öppningar', membrane: 'Duk', exchange: 'Konvektion och strålning', comfort: 'Jämn rumstemperatur · inget drag · knappt hörbar', pct: '5–10 %', energyA: 'lägre energianvändning', energyB: 'jämfört med konventionell konvektionsvärme', qual: 'ungefär · beroende på byggnaden' },
  no: { slab: 'Bærende dekke', plenum: 'Hulrom', air: 'Luften sirkulerer', profile: 'Profil med integrerte åpninger', membrane: 'Duk', exchange: 'Konveksjon og stråling', comfort: 'Jevn romtemperatur · ingen trekk · knapt hørbar', pct: '5–10 %', energyA: 'lavere energibruk', energyB: 'sammenlignet med konvensjonell konveksjonsvarme', qual: 'omtrent · avhengig av bygningen' },
  is: { slab: 'Burðarplata', plenum: 'Holrými', air: 'Loft streymir', profile: 'Prófíll með innbyggðum opum', membrane: 'Dúkur', exchange: 'Varmaburður og geislun', comfort: 'Jafnt hitastig · enginn dragsúgur · varla heyranlegt', pct: '5–10 %', energyA: 'minni orkunotkun', energyB: 'samanborið við hefðbundna hitun með varmaburði', qual: 'um það bil · eftir byggingunni' },
};

/** Last sentence of a paragraph ("… One plane, four functions, zero visible technology."). */
function lastSentence(p) {
  const trimmed = p.trim().replace(/[.!]$/, '');
  const i = Math.max(trimmed.lastIndexOf('. '), trimmed.lastIndexOf('! '));
  return (i >= 0 ? trimmed.slice(i + 2) : trimmed) + '.';
}

// ---- cross-section (SVG, 1390×858, placed at 110/232) -----------------------
// Geometry in local px: walls 40 wide, slab 96 tall, plenum 96→480, membrane
// at 480, room below. The perimeter profiles are the small black blocks on
// the walls at membrane height, with slots (the integrated openings) in the
// strip visible from the room; the air loop runs up through the left slots,
// across under the slab, and down through the right ones. Strokes carry a
// white halo so the loop stays visible where it crosses a black profile.
const W = 1390, H = 858, WALL = 40, SLAB = 96, MEMB = 480, PROF = 36, PROF_TOP = MEMB - 110, PROF_BOT = MEMB + 30;

function arrowHead(x, y, angleDeg, size = 16, fill = '#3a3833') {
  return `<polygon points="0,0 ${-size},${-size * 0.55} ${-size},${size * 0.55}" transform="translate(${x} ${y}) rotate(${angleDeg})" fill="${fill}" stroke="#ffffff" stroke-width="3" paint-order="stroke"/>`;
}

function diagram(t) {
  const label = (x, y, text, anchor = 'start', fill = '#54514b') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-size="25" font-weight="700" letter-spacing="2" style="text-transform:uppercase">${esc(text).toUpperCase()}</text>`;

  const profile = (x) => {
    // the perimeter profile: a block at membrane height with three slots (the
    // integrated openings) in the strip the room sees, below the membrane
    let g = `<rect x="${x}" y="${PROF_TOP}" width="${PROF}" height="${PROF_BOT - PROF_TOP}" fill="#0a0a0a"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${x - 1}" y="${MEMB + 7 + i * 8}" width="${PROF + 2}" height="4" fill="#ffffff"/>`;
    return g;
  };

  // air loop: up the left wall through the grille, arch under the slab, down the right
  const xl = WALL + PROF / 2, xr = W - WALL - PROF / 2;
  const loop = `M ${xl} 660 L ${xl} ${PROF_TOP - 40} Q ${xl} 176 ${xl + 330} 176 L ${xr - 330} 176 Q ${xr} 176 ${xr} ${PROF_TOP - 40} L ${xr} 660`;
  const heads =
    arrowHead(xl, 590, -90) +
    arrowHead(xl, 300, -90) +
    arrowHead(560, 176, 0) +
    arrowHead(W / 2 + 60, 176, 0) +
    arrowHead(W - 560, 176, 0) +
    arrowHead(xr, 300, 90) +
    arrowHead(xr, 610, 90);

  // radiation: red waves leaving the membrane into the room
  let waves = '';
  for (const x of [330, 480, 630, 780, 930, 1080]) {
    waves += `<path d="M ${x} ${MEMB + 44} q 9 11 0 22 t 0 22 t 0 22" fill="none" stroke="#e00000" stroke-width="4" stroke-linecap="round"/>` + arrowHead(x, MEMB + 44 + 66 + 14, 90, 14, '#e00000');
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:110px;top:232px;font-family:Archivo,system-ui,sans-serif">
  <defs>
    <pattern id="hatch" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(135)">
      <rect width="24" height="24" fill="#e8e6e1"/><rect width="12" height="24" fill="#dedbd4"/>
    </pattern>
  </defs>
  <!-- structure: slab + walls -->
  <rect x="0" y="0" width="${W}" height="${SLAB}" fill="url(#hatch)"/>
  <rect x="0" y="0" width="${WALL}" height="${H}" fill="url(#hatch)"/>
  <rect x="${W - WALL}" y="0" width="${WALL}" height="${H}" fill="url(#hatch)"/>
  <!-- plenum -->
  <rect x="${WALL}" y="${SLAB}" width="${W - 2 * WALL}" height="${MEMB - SLAB}" fill="#ffffff"/>
  <line x1="${WALL}" y1="${SLAB}" x2="${W - WALL}" y2="${SLAB}" stroke="#0a0a0a" stroke-width="3"/>
  <!-- perimeter profiles with integrated openings -->
  ${profile(WALL)}${profile(W - WALL - PROF)}
  <!-- membrane -->
  <line x1="${WALL + PROF}" y1="${MEMB}" x2="${W - WALL - PROF}" y2="${MEMB}" stroke="#0a0a0a" stroke-width="8"/>
  <!-- air loop (white halo under the stroke keeps it readable across the profiles) -->
  <path d="${loop}" fill="none" stroke="#ffffff" stroke-width="10" stroke-linejoin="round"/>
  <path d="${loop}" fill="none" stroke="#3a3833" stroke-width="4" stroke-linejoin="round"/>
  ${heads}
  <!-- radiation + convection into the room -->
  ${waves}
  <!-- labels -->
  ${label(WALL + 24, 58, t.slab)}
  ${label(W / 2, 150, t.air, 'middle')}
  ${label(WALL + PROF + 60, PROF_TOP - 18, t.plenum)}
  ${label(W - WALL - PROF - 60, PROF_TOP - 60, t.profile, 'end')}
  <line x1="${W - WALL - PROF - 44}" y1="${PROF_TOP - 50}" x2="${W - WALL - PROF - 6}" y2="${PROF_TOP + 24}" stroke="#54514b" stroke-width="2"/>
  ${label(WALL + PROF + 44, MEMB + 36, t.membrane)}
  ${label(W / 2, MEMB + 196, t.exchange, 'middle', '#e00000')}
  ${label(W / 2, H - 22, t.comfort, 'middle', '#0a0a0a')}
</svg>`;
}

function html(locale) {
  const { post } = postMessages(locale, SLUG);
  const t = L[locale];
  const eyebrow = post.body[1].heading; // "How it works behind the membrane"
  const tagline = lastSentence(post.body[3].paragraphs[0]); // "One plane, four functions, zero visible technology."
  const css = `
.col{position:absolute;left:1620px;top:232px;width:670px;height:858px;display:flex;flex-direction:column;justify-content:space-between}
.pct{font-size:168px;letter-spacing:-.045em;line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums}
.pct .p{color:#e00000;font-size:96px;margin-left:10px}
.en-a{font-size:36px;font-weight:800;letter-spacing:-.01em;line-height:1.15;margin-top:26px;color:#0a0a0a}
.en-b{font-size:30px;font-weight:600;line-height:1.25;color:#3a3833;margin-top:6px}
.qual{font-size:24px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#8a867f;margin-top:22px}
.tag{font-size:50px;line-height:1.02;letter-spacing:-.02em;padding-top:30px;border-top:3px solid #0a0a0a}
`;
  const pctParts = t.pct.match(/^(.*?)(\s?%)$/);
  const body = `${frameTop(eyebrow)}
  ${diagram(t)}
  <div class="col">
    <div>
      <div class="pct disp">${esc(pctParts[1])}<span class="p">%</span></div>
      <div class="en-a">${esc(t.energyA)}</div>
      <div class="en-b">${esc(t.energyB)}</div>
      <div class="qual">${esc(t.qual)}</div>
    </div>
    <div class="tag disp">${esc(tagline)}</div>
  </div>`;
  return document_(locale, css, body);
}

const only = process.argv.slice(2);
const locales = only.length ? only : Object.keys(L);
for (const l of locales) if (!L[l]) { console.error(`no hero recipe for locale "${l}"`); process.exit(1); }
await renderAll({ slug: SLUG, locales, html });
