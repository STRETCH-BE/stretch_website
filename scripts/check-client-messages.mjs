#!/usr/bin/env node
// Verifies that every namespace a CLIENT component reads (useTranslations /
// useMessages, followed through the client module graph) is shipped to the
// browser: either in CLIENT_NAMESPACES (src/i18n/client-messages.ts, every
// page) or in PAGE_NAMESPACES (provided by that page's nested provider).
// Run: node scripts/check-client-messages.mjs   (exit 1 on a gap)
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const cfg = fs.readFileSync(path.join(root, 'i18n/client-messages.ts'), 'utf8');
const listed = new Set([...cfg.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]));

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|mjs|js)$/.test(e.name)) files.push(p);
  }
})(root);
const src = Object.fromEntries(files.map((f) => [f, fs.readFileSync(f, 'utf8')]));
const resolve = (from, spec) => {
  let base;
  if (spec.startsWith('@/')) base = path.join(root, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
  else return null;
  for (const c of [base, `${base}.tsx`, `${base}.ts`, `${base}.mjs`, `${base}.js`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')]) if (src[c]) return c;
  return null;
};
const roots = files.filter((f) => /^(['"])use client\1/m.test(src[f].slice(0, 300)));
const seen = new Set();
const stack = [...roots];
while (stack.length) {
  const f = stack.pop();
  if (seen.has(f)) continue;
  seen.add(f);
  for (const m of src[f].matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    const r = resolve(f, m[1]);
    if (r && !seen.has(r)) stack.push(r);
  }
  for (const m of src[f].matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const r = resolve(f, m[1]);
    if (r && !seen.has(r)) stack.push(r);
  }
}
const problems = [];
const used = new Map();
for (const f of seen) {
  for (const m of src[f].matchAll(/use(Translations|Messages)\((?:['"]([^'"]*)['"])?\)/g)) {
    const rel = path.relative(root, f);
    if (m[1] === 'Messages' || m[2] === undefined) { problems.push(`${rel}: ${m[0]} reads ALL messages — pass a namespace`); continue; }
    const top = m[2].split('.')[0];
    if (!used.has(top)) used.set(top, new Set());
    used.get(top).add(rel);
    if (!listed.has(top)) problems.push(`${rel}: namespace "${top}" is not in CLIENT_NAMESPACES / PAGE_NAMESPACES`);
  }
}
console.log(`client modules: ${seen.size} (${roots.length} 'use client' roots) — namespaces read on the client: ${[...used.keys()].sort().join(', ')}`);
if (problems.length) {
  console.error('\nMissing client messages:\n  ' + [...new Set(problems)].join('\n  '));
  process.exit(1);
}
console.log('OK — every client namespace is shipped.');
