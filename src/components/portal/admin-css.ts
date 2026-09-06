// CLIENT PORTAL — admin card styles, shared by AdminPanel and the
// Configurator tab. Kept as a plain CSS string (injected once per card) so
// both surfaces look identical without a styled-jsx dependency between them.
export const CARD_CSS = `
  .padm-card { background: #fff; border: 1px solid var(--border); padding: clamp(20px, 2.2vw, 28px); }
  .padm-card h2 { display: flex; align-items: center; gap: 10px; margin: 0 0 8px; font-size: 15px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
  .padm-card .body { color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 18px; }
  .padm-card .head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .padm-tablewrap { overflow-x: auto; }
  .padm-card table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .padm-card th { text-align: left; font-size: 10.5px; letter-spacing: 0.09em; text-transform: uppercase; color: var(--text-muted-2); font-weight: 700; padding: 8px 10px; border-bottom: 2px solid var(--black); white-space: nowrap; }
  .padm-card td { padding: 9px 10px; border-bottom: 1px solid var(--border); vertical-align: top; }
  .padm-card tr.off td { opacity: 0.55; }
  .padm-pill { font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; background: var(--surface); border: 1px solid var(--border-2); color: var(--text-muted-2); white-space: nowrap; display: inline-block; }
  .padm-pill--on { background: #eaf6ef; border-color: #bfe3cd; color: #0c7a43; }
  .padm-pill--pending { background: #fff7e6; border-color: #f2dfb3; color: #9a6b00; }
  .padm-pill--warn { background: #fdeaea; border-color: #f3c2c2; color: var(--red); }
  .padm-linkbtn { border: 0; background: none; font: inherit; font-size: 12px; font-weight: 700; color: var(--red); cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
  .padm-linkbtn:hover { text-decoration: underline; }
  .padm-linkbtn--mut { color: var(--text-muted); }
  .padm-sel { font: inherit; font-size: 12px; padding: 4px 6px; border: 1px solid var(--border-2); background: #fff; color: var(--text); cursor: pointer; }
  .padm-inp { font: inherit; font-size: 13px; padding: 7px 10px; border: 1px solid var(--border-input); background: #fff; }
  .padm-note { font-size: 13px; color: var(--text-muted); margin: 0 0 12px; }
  .padm-err { color: var(--red); font-size: 13px; font-weight: 600; margin: 10px 0 0; }
  .padm-meta { font-size: 11px; color: var(--text-faint); }
  .padm-sub { border: 1px solid var(--border-2); background: var(--surface); padding: 14px; margin: 6px 0 4px; }
  .padm-sub .lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--text-muted); margin: 10px 0 5px; }
  .padm-chip { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600; border: 1px solid var(--border-input); background: #fff; padding: 6px 9px; cursor: pointer; margin: 3px 6px 3px 0; }
  .padm-chip.on { border-color: var(--black); background: var(--black); color: #fff; }
  .padm-chip input { accent-color: var(--red); }
  .padm-tabs { display: flex; gap: 0; margin: 0 0 14px; border-bottom: 2px solid var(--black); }
  .padm-tab { font: inherit; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; padding: 9px 16px; cursor: pointer; background: var(--surface); color: var(--text-muted-2); border: 1px solid var(--border); border-bottom: none; }
  .padm-tab.on { background: var(--black); color: #fff; border-color: var(--black); }
`;
