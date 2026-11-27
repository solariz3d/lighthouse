// ripple268.js (pane B, L268): the held width after the heads of E's table (handback/p-l264-read-E_2026-11-27.md §2 (a)), on ONE tree, built as E built them
// (e264.js, grab264.js, row5.js: the app's brush through createCoreShell's default brushFn, Sculpt's grab by beginFollow, the panel's own extendOptions), plus
// E's whole sweep, other lengths, a level head, typed widths, and a Turn by corner. For each new piece, E's own measure: the swing (the largest w − head),
// where it is, and the LAST station (every length/1000) where |w − head| > 1 mm; and the joint, the end, the start ramp R (startRampM), the largest |w''|.
// Also the piece's bytes without w, and every other channel sampled every metre, so two trees can be compared channel by channel (cmp268.js).
// Synthetic roads only.   usage: node ripple268.js <tree> <out.json>
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), OUT = process.argv[3];
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const h = (x) => crypto.createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 12);
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const DEG = Math.PI / 180;
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } });
const doc = (s) => s.getState().history.present;
const total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const noW = (P) => { const { w, ...channels } = P.channels; return { ...P, channels }; };
const startRampM = (length) => { const K = D.evenKnots(length); return K.length ? K[0] : length; };
async function shell(d, { sculpt = false, appBrush = true } = {}) { const s = await createCoreShell({ autosaveMs: 0, ...(appBrush ? {} : { brushFn: null }) }); if (d) s.commitDoc(d); if (sculpt) s.setSculpt(true); return s; }
const brushed = async ({ d, r, delta }) => { const s = await shell(plain()); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grabbed = async ({ d, r, dw }) => { const s = await shell(plain(), { sculpt: true }); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); return s; };
const transitioned = async () => { const s = await shell(null, { appBrush: false }); s.extend({ length: 300 }); s.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); s.extend({ length: 75, transition: 30, targets: { w: 25 } }); return s; };
const wpp = (P, x) => { const e = 0.05; return (D.channelValue(P, 'w', x + e) - 2 * D.channelValue(P, 'w', x) + D.channelValue(P, 'w', x - e)) / (e * e); };
function measure(before, P) {
  const prev = before.pieces[before.pieces.length - 1], a = D.pieceEnd(prev).w;
  let maxDev = 0, at = 0, last1 = 0, w2 = 0;
  for (let k = 0; k <= 1000; k++) { const x = (P.length * k) / 1000, dv = D.channelValue(P, 'w', x) - a.v; if (Math.abs(dv) > Math.abs(maxDev)) { maxDev = dv; at = x; } if (Math.abs(dv) > 1e-3) last1 = x; }
  for (let x = 0.1; x < P.length - 0.1; x += 0.1) w2 = Math.max(w2, Math.abs(wpp(P, x)));
  const others = {}; for (const ch of D.CHANNELS) if (ch !== 'w' && P.channels[ch]) { const arr = []; for (let x = 0; x <= P.length + 1e-9; x += 1) arr.push(D.channelValue(P, ch, Math.min(x, P.length))); others[ch] = arr; }
  return { head: a, length: P.length, R: startRampM(P.length), maxDev: +maxDev.toFixed(6), maxDevAt: +at.toFixed(2), off1mmUntil: +last1.toFixed(2), joint: D.jointProblem(D.pieceEnd(prev), P, D.kindOf(prev)), end: D.pieceEnd(P).w, maxW2: +w2.toExponential(3), knots: P.knots.length, piece: h(P), pieceNoW: h(noW(P)), others };
}
const asShown = async (mk, length = 100, typed = {}) => { const s = await mk(); const before = doc(s); s.extend(extendOptions({ ...BLANK, length, ...typed, head: s.headState() })); const after = doc(s); if (after === before) return { refused: s.getState().message }; return { ...measure(before, after.pieces.at(-1)), placedSame: h(after.pieces.slice(0, -1)) === h(before.pieces) }; };
const TABLE = [
  ['E1 the brush, +1.37 at end-5, r 20', () => brushed({ d: 5, r: 20, delta: 1.37 })],
  ['E2 the brush, +1.37 at end-10, r 20', () => brushed({ d: 10, r: 20, delta: 1.37 })],
  ['E3 the brush, +5 at end-19, r 20', () => brushed({ d: 19, r: 20, delta: 5 })],
  ['E4 the brush, +5 at end-30, r 40', () => brushed({ d: 30, r: 40, delta: 5 })],
  ['E5 grab, w +1.37 at end-5, r 20', () => grabbed({ d: 5, r: 20, dw: 1.37 })],
  ['E6 grab, w +2 at end-10, r 20', () => grabbed({ d: 10, r: 20, dw: 2 })],
  ['E7 grab, w -2 at end-20, r 30', () => grabbed({ d: 20, r: 30, dw: -2 })],
  ['E8 a number transition (drag-ghost row 5 head)', transitioned],
];
(async () => {
  const out = { tree: T, table: [], lengths: [], sweep: [], extra: [] };
  for (const [name, mk] of TABLE) out.table.push({ case: name, ...(await asShown(mk)) });
  for (const [name, mk] of TABLE) for (const length of [10, 400]) out.lengths.push({ case: `${name}, ${length} m`, ...(await asShown(mk, length)) });
  for (const r of [5, 10, 20, 40]) for (const d of [0, 2, 5, 10, 15, 19, 30]) for (const delta of [1.37, 5, -1.37, -3]) { if (d >= r + 5) continue; out.sweep.push({ case: `sweep r ${r} d ${d} delta ${delta}`, ...(await asShown(() => brushed({ d, r, delta }))) }); }
  out.extra.push({ case: 'grab, w +2 at end-0, r 10', ...(await asShown(() => grabbed({ d: 0, r: 10, dw: 2 }))) });
  out.extra.push({ case: 'a level head (no brush)', ...(await asShown(() => shell(plain()))) });
  for (const [label, typed] of [['typed 22, whole piece', { width: '22' }], ['typed 22, early', { width: '22', atStart: { width: true } }], ['typed 20.46', { width: '20.46' }]]) out.extra.push({ case: `E6's head, ${label}`, ...(await asShown(() => grabbed({ d: 10, r: 20, dw: 2 }), 100, typed)) });
  { const s = await grabbed({ d: 10, r: 20, dw: 2 }), before = doc(s), after = TB.extendCorner(before, { length: 300, turnDeg: 45 }); out.extra.push({ case: "E6's head, a Turn by corner of 45 deg over 300 m (core)", ...measure(before, after.pieces.at(-1)) }); }
  fs.writeFileSync(OUT, JSON.stringify(out));
  const f = (r) => r.refused ? `REFUSED ${r.refused}` : `head ${r.head.v.toFixed(4)} (${r.head.m.toExponential(2)}), R ${r.R}, swing ${(1000 * r.maxDev).toFixed(1)} mm at ${r.maxDevAt}, >1 mm until ${r.off1mmUntil}, end ${r.end.v} (${r.end.m}), joint ${r.joint === null ? 'ok' : r.joint}, max|w''| ${r.maxW2}`;
  for (const r of out.table) console.log(`${r.case}: ${f(r)}`);
})().catch((e) => { console.error('ripple268 failed:', e); process.exit(1); });
