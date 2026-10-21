'use strict';
// D421c (O): row 3's lap layout (each piece's kh at its middle) and, for one window, WHICH pieces the re-close changes, against the dragged lap.
//   node which.js <tree> <k|whole|a,b,c> [final px]   (a,b,c: an explicit window)
const TREE = process.argv[2], K = process.argv[3], PX = Number(process.argv[4] || 14);
const D = require(`${TREE}/src/core/document.js`), { close } = require(`${TREE}/src/core/close.js`);
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
const { PER_PX } = require(`${TREE}/app/core/panel.js`);
const closed10 = (s) => { s.extend({ length: 200, family: 'bowl' }); for (let k = 0; k < 2; k++) { for (let i = 0; i < (k ? 20 : 19); i++) s.extend({ length: 200, transition: 40, targets: { kh: 0 } }); for (let i = 0; i < 5; i++) s.extend({ length: 200, transition: 40, targets: { kh: Math.PI / 1000 } }); } s.close(); };
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 }); closed10(s);
  const base = s.getState().history.present;
  s.setSculpt(true); s.beginBrush({ tool: 'bend', mode: 'rate', channel: 'kh', s0: 2100, r: 200 });
  for (let i = 1; i < 12; i++) s.brushTo(Math.round(Math.sin((i / 12) * 3 * Math.PI * 0.75) * 20) * PER_PX.kh);
  s.brushTo(PX * PER_PX.kh);
  const st = s.getState(), open = st.history.present, win = st.brush.changedPieces;
  const kh = base.pieces.map((P) => +D.valuesAt(P, P.length / 2).kh.toFixed(5));
  const corners = kh.map((v, i) => (v !== 0 ? i : -1)).filter((i) => i >= 0);
  const widen = (k) => [...new Set([...Array.from({ length: k }, (_, j) => Math.max(0, Math.min(...win) - 1 - j)), ...win, ...Array.from({ length: k }, (_, j) => Math.min(open.pieces.length - 1, Math.max(...win) + 1 + j))])].sort((a, b) => a - b);
  const winOf = (K) => (K.includes(',') ? K.split(',').map(Number) : widen(+K)); const out = K === 'whole' ? close(open, { edited: win }) : close(open, { window: winOf(K) });
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const changed = out.doc.pieces.map((P, i) => (same(P, open.pieces[i]) ? -1 : i)).filter((i) => i >= 0);
  console.log(JSON.stringify({ pieces: base.pieces.length, corner_pieces_kh_nonzero: corners, brushed: win, try: K, window: K === 'whole' ? null : winOf(K), converged: out.converged, gapM: out.gapM, report: out.report, changed, changed_outside_window: K === 'whole' ? null : changed.filter((i) => !winOf(K).includes(i)) }));
})().catch((e) => { console.error(e); process.exit(1); });
