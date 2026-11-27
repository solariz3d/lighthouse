// e264.js (pane E, L264 read): vary B's width hold on ONE tree, through the shell with the APP'S brush (createCoreShell's default brushFn, src/core/sculpt.js brush,
// the width as a 'value' brush, as the app runs it) and the panel's own extendOptions. Synthetic roads only. Prints one JSON line per case.
// usage: node e264.js <tree> <out.jsonl>
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), OUT = process.argv[3];
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const TB = require(path.join(T, 'src/core/turnby.js')), SH = require(path.join(T, 'src/core/sharp.js')), LV = require(path.join(T, 'src/core/level.js')), J = require(path.join(T, 'src/core/jump.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const h = (x) => crypto.createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 12);
const lines = []; const emit = (o) => { lines.push(JSON.stringify(o)); };
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const DEG = Math.PI / 180;
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } });
const doc = (s) => s.getState().history.present;
const total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const noW = (P) => { const { w, ...channels } = P.channels; return { ...P, channels }; };
async function shell(d, { sculpt = false, appBrush = true } = {}) { const s = await createCoreShell({ autosaveMs: 0, ...(appBrush ? {} : { brushFn: null }) }); if (d) s.commitDoc(d); if (sculpt) s.setSculpt(true); return s; }
function brush(s, { d = 5, r = 20, delta = 1.37, s0 } = {}) {
  const L = total(doc(s)); s.beginBrush({ mode: 'rate', channel: 'w', s0: s0 === undefined ? L - d : s0, r }); s.brushTo(delta); s.endBrush();
  return s.getState().message;
}
/** The new last piece measured against the head it was laid from. */
function measure(prevDoc, P) {
  const prev = prevDoc.pieces[prevDoc.pieces.length - 1], a = D.pieceEnd(prev).w;
  const c = P.channels.w, hk = P.knots.length ? P.knots[0] : P.length, startSlope = (3 * (c[1] - c[0])) / hk;
  let maxDev = 0, at = 0, lastOff1mm = 0;
  for (let k = 0; k <= 1000; k++) { const x = (P.length * k) / 1000, dv = D.channelValue(P, 'w', x) - a.v; if (Math.abs(dv) > Math.abs(maxDev)) { maxDev = dv; at = x; } if (Math.abs(dv) > 1e-3) lastOff1mm = x; }
  return { headW: a, joint: D.jointProblem(D.pieceEnd(prev), P, D.kindOf(prev)), startSlope: +startSlope.toPrecision(6), maxDev: +maxDev.toFixed(5), maxDevAt: +at.toFixed(2), off1mmUntil: +lastOff1mm.toFixed(2),
    end: D.pieceEnd(P).w, wAt100: P.length >= 100 ? +D.channelValue(P, 'w', 100).toFixed(5) : null, piece: h(P), pieceNoW: h(noW(P)) };
}
function extendShown(s, length = 100, typed = {}) {
  const before = doc(s); s.extend(extendOptions({ ...BLANK, length, ...typed, head: s.headState() })); const after = doc(s);
  if (after === before) return { refused: s.getState().message };
  return { ...measure(before, after.pieces[after.pieces.length - 1]), placedSame: h(after.pieces.slice(0, -1)) === h(before.pieces) };
}
(async () => {
  // 1. B's case with the app's brush, plain and Sculpt on; and with the older rate brush (brushFn null, B's rows) for comparison
  for (const [label, o] of [['app brush', {}], ['app brush, Sculpt on', { sculpt: true }], ['older rate brush (B\'s rows)', { appBrush: false }]]) {
    const s = await shell(plain(), o), msg = brush(s), head = D.endState(doc(s)).w, ext = [];
    for (let i = 0; i < 3; i++) ext.push(extendShown(s));
    emit({ case: `1 B's case (+1.37 at end-5, r 20), ${label}`, msg, head, ext });
  }
  // 2. sweep: where the brush sits against the head, its radius, its size and sign (the app's brush), one Extend of 100 m as shown
  for (const r of [5, 10, 20, 40]) for (const d of [0, 2, 5, 10, 15, 19, 30]) for (const delta of [1.37, 5, -1.37, -3]) {
    if (d >= r + 5) continue;
    const s = await shell(plain()), msg = brush(s, { d, r, delta }), head = D.endState(doc(s)).w;
    emit({ case: `2 sweep r ${r} d ${d} delta ${delta}`, msg, head, ext: [extendShown(s)] });
  }
  // 3. the middle of the road: s0 150 m before the end, r 20 (the falloff ends 130 m before the head)
  { const s = await shell(plain()), msg = brush(s, { d: 150, r: 20, delta: 1.37 }), head = D.endState(doc(s)).w; emit({ case: '3 middle (end-150, r 20, +1.37)', msg, head, ext: [extendShown(s), extendShown(s)] }); }
  // 4. brushed DOWN at the head, then three Extends; and a long piece
  { const s = await shell(plain()), msg = brush(s, { delta: -1.37 }), head = D.endState(doc(s)).w; emit({ case: '4 down (-1.37 at end-5, r 20)', msg, head, ext: [extendShown(s), extendShown(s), extendShown(s, 400)] }); }
  { const s = await shell(plain()), msg = brush(s, { delta: -8, d: 2, r: 10 }), head = D.endState(doc(s)).w; emit({ case: '4b down hard (-8 at end-2, r 10)', msg, head, ext: [extendShown(s), extendShown(s, 10)] }); }
  // 5. a width typed after the brush (whole piece, and early), then left as shown
  for (const [label, typed] of [['22 whole piece', { width: '22' }], ['22 early', { width: '22', atStart: { width: true } }], ['20.46 as shown', { width: '20.46' }], ['15 on 10 m', { width: '15', length: 10 }]]) {
    const s = await shell(plain()), msg = brush(s), head = D.endState(doc(s)).w;
    const { length = 100, ...rest } = typed; const t = extendShown(s, length, rest), headAfterTyped = D.endState(doc(s)).w;
    emit({ case: `5 typed ${label}, then as shown`, msg, head, ext: [t, extendShown(s)], headAfterTyped });
  }
  // 6. a closed lap: the cut test's lap (core-cut.test.js), brushed near the seam; Extend on it; then the first piece cut out, which opens it at the gap, and Extend as shown
  {
    const R = 180, Q = (Math.PI * R) / 2, s = await createCoreShell({ autosaveMs: 0, storage: { backupDoc: async (n) => `${n}.bak` } });
    let d = TB.extendCorner(doc(s), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
    s.adopt(TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } })); s.close();
    const closed = doc(s).closed, L = total(doc(s)), msg = brush(s, { s0: L - 5, r: 20, delta: 1.37 }), headClosed = D.endState(doc(s)).w;
    const onClosed = extendShown(s);
    s.selectPiece(0); s.cutSelection(); await s.applyCut();
    const opened = !doc(s).closed, head = D.endState(doc(s)).w;
    emit({ case: '6 closed lap brushed at the seam (L-5, r 20, +1.37); Extend on the closed lap; then piece 0 cut, Extend as shown x2', closed, msg, headClosed, onClosed, opened, cutMsg: s.getState().message, head, ext: [extendShown(s), extendShown(s)] });
  }
  // 7. the other callers of extend from B's brushed head (app brush): a corner from the panel, a corner and a sharp turn and a level piece and a jump from the core
  {
    const s = await shell(plain()); brush(s); const d0 = doc(s), head = D.endState(d0).w, res = {};
    const tryIt = (name, f) => { try { const d1 = f(); const P = d1.pieces[d0.pieces.length]; res[name] = { ...measure(d0, P), pieces: d1.pieces.length - d0.pieces.length, allNew: h(d1.pieces.slice(d0.pieces.length).map(noW)) }; } catch (e) { res[name] = { refused: `${e.code || e.name}: ${String(e.message).slice(0, 120)}` }; } };
    tryIt('panel corner 45', () => { const s2 = { ...s }; s.extend(extendOptions({ ...BLANK, length: 300, turn: '45', turnAs: 'corner', head: s.headState() })); const d1 = doc(s); s.undo(); return d1; });
    tryIt('core corner 90 over 400', () => TB.extendCorner(d0, { length: 400, turnDeg: 90 }));
    tryIt('core sharp -60 R 150', () => SH.extendSharp(d0, {}, { angle: -60 * DEG, R: 150, ramp: 4 }));
    tryIt('core level 400', () => LV.extendLevel(d0, { length: 400 }));
    tryIt('core jumpHere 100', () => J.jumpHere(d0, null, { landingM: 100 }));
    tryIt('core jumpHere after a 50 m take-off', () => J.jumpHere(d0, { length: 50 }, { landingM: 100 }));
    emit({ case: '7 callers from the brushed head', head, res });
  }
  // 8. Close from a brushed head (the lap of 6, left open, brushed at its head): close() and closeBest()
  for (const how of ['close', 'closeBest']) {
    const R = 180, Q = (Math.PI * R) / 2, s = await createCoreShell({ autosaveMs: 0, storage: { backupDoc: async (n) => `${n}.bak` } });
    let d = TB.extendCorner(doc(s), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
    s.adopt(TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }));
    const msg = brush(s, { d: 5, r: 20, delta: 1.37 }), head = D.endState(doc(s)).w, n0 = doc(s).pieces.length, before = doc(s);
    if (how === 'close') s.close(); else await s.closeBest();
    const after = doc(s), P = after.pieces;
    emit({ case: `8 ${how} from a brushed head`, msg, head, closed: !!after.closed, message: s.getState().message, piecesAdded: P.length - n0, firstPiecesSame: h(P.slice(0, n0 - 2)) === h(before.pieces.slice(0, n0 - 2)),
      seamW: P.length ? { last: D.pieceEnd(P[P.length - 1]).w, startW: D.channelAt(P[0], 'w', 0).v } : null, all: h(P), allNoW: h(P.map(noW)) });
  }
  fs.writeFileSync(OUT, lines.join('\n') + '\n'); console.log(`${lines.length} cases → ${OUT}`);
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });
