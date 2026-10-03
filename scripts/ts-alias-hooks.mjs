// Node module hooks for running app TypeScript from scripts/*.mjs (Node ≥ 22
// strips the types itself): maps "@/…" to src/…, adds the ".ts"/".tsx"
// extension the app code leaves out, and loads .json imports without the
// import attribute Node otherwise demands.
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');

function withExt(file) {
  for (const f of [file, `${file}.ts`, `${file}.tsx`, path.join(file, 'index.ts')]) {
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  let file = null;
  if (specifier.startsWith('@/')) file = withExt(path.join(SRC, specifier.slice(2)));
  else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith('file:')) {
    file = withExt(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier));
  }
  return file ? next(pathToFileURL(file).href, context) : next(specifier, context);
}

export async function load(url, context, next) {
  if (url.endsWith('.json')) return next(url, { ...context, importAttributes: { type: 'json' } });
  return next(url, context);
}
