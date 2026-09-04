# Updating the acoustic calculator

The reverberation-time calculator is a single self-contained HTML app
(`acoustic-calculator.html` in the repo root, next to `abc-floorplan.html`).
It is embedded (base64) in `src/lib/portal/acoustic-html.ts` and served only
to signed-in portal users via `/api/portal/acoustics` — it carries no pricing,
but it is a portal feature: never put it in `/public`.

Its material, absorber and target tables are the master copy of those
numbers. `src/lib/portal/acoustic-data.ts` is generated FROM the HTML so the
API can recompute a saved room's headline results server-side without a
second, hand-maintained copy of the tables.

To ship a new version of the tool:

```bash
node scripts/update-acoustics.mjs
```

That rewrites both generated modules. Then `npm run typecheck && npm run build`,
commit and deploy. No other file changes needed.

What must survive an update of the HTML (the portal relies on it):

- the `PORTAL BRIDGE` block at the bottom of the script (save / open /
  delete, browser autosave, usage events, `window.AcousticBridge`);
- the `UI` object and the `data-ui*` hooks (nl + en interface);
- the `LANG` resolution (`?lang=` → `window.PORTAL_LOCALE` → default);
- the `MATERIALEN` / `PANELEN` / `DOELEN` arrays keeping their `nr` keys —
  saved rooms reference materials and panels by `nr`, not by list position.
