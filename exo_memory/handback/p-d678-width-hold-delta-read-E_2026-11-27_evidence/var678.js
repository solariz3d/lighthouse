// var678.js (pane E, D678 Track 2): does the width hold move anything but the width? From the same head on two trees (REF, normally e112a14, which has no hold
// knots; TEST, the tree read), every channel but w and wd of every new piece, sampled every 0.01 m, in STEPS of that channel's stored decimals (D.DEC of TEST),
// the pieces' count and lengths, and the end point (the adapter's path at step 0.25, its last sample, as endpos678.js reads it). Beside it, on TEST, the same
// caller from the same head with its width made level (its last piece's last two w control points set equal: B's "vsFlat"). And the held width on TEST: the
// joint, the end against the head's width, the last station over 1 mm off, the swing; with an optional WIDTH tree (c2591bf), whether the first piece's knots and
// w are that tree's. Heads: a level head, E1, E4, E6 and the grab +4 at end-3 r5 (chan678.js's, on B's road). Callers: SET f4 (the F4 table's nine, and the
// corner list's extra from 10 m), or SET var (a second field typed with the hold: a climb, and a bank at start, which makes the hold lay 8 subdivisions).
// usage: node var678.js <refTree> <testTree> <f4|var> <out.json> [widthTree]
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const load = (T) => { T = path.resolve(T); return { T, D: require(path.join(T, 'src/core/document.js')), extend: require(path.join(T, 'src/core/extend.js')).extend, A: require(path.join(T, 'src/core/adapter.js')),
  shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const [refT, testT, SET, OUT, widthT] = process.argv.slice(2);
const R = load(refT), X = load(testT), W = widthT ? load(widthT) : null;
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = (t) => t.extend(t.extend(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 12);
const sh = async (t, sculpt) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); if (sculpt) s.setSculpt(true); return s; };
const HEADS = {
  'level head': async (t) => sh(t),
  E1: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); return s; },
  E4: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; },
  E6: async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; },
  'grab +4 end-3 r5': async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 3, r: 5 }); s.brushTo({ w: 4 }); s.endBrush(); s.setSculpt(false); return s; },
};
// the same head with its width made level: the last piece's last two w control points set equal (the end value kept)
const twin = async (t, s) => { const d = doc(s), P = d.pieces.at(-1), w = P.channels.w.slice(); w[w.length - 2] = w[w.length - 1];
  const s2 = await t.shell({ autosaveMs: 0 }); s2.commitDoc(t.D.checkDoc({ ...d, pieces: [...d.pieces.slice(0, -1), { ...P, channels: { ...P.channels, w } }] })); return s2; };
const opt = (t, s, more = {}) => t.extendOptions({ ...BLANK, head: s.headState(), ...more });
const CALLERS = SET === 'f4' ? {
  extend: (t, s) => s.extend(opt(t, s)), 'turnBy 45': (t, s) => s.extendTurnBy(opt(t, s), 45), 'turnBy -90 over 200': (t, s) => s.extendTurnBy(opt(t, s, { length: 200 }), -90),
  'corner 30 + extra 20 from 50': (t, s) => s.extend({ ...opt(t, s), turnDeg: 30, changes: { turnDeg: [{ from: 50, deg: 20 }] } }),
  'corner 30 + extra 20 from 10': (t, s) => s.extend({ ...opt(t, s), turnDeg: 30, changes: { turnDeg: [{ from: 10, deg: 20 }] } }),
  'sharp -60 R40 ramp8': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 8 }), 'sharp 90 R150 ramp4': (t, s) => s.extendSharp(opt(t, s), { deg: 90, R: 150, ramp: 4 }),
  'sharp -60 R40 ramp1': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 1 }), 'jump (take-off)': (t, s) => s.jump(opt(t, s)), level: (t, s) => s.extendLevel(opt(t, s)),
} : {
  'W1 climb 4 as a corner': (t, s) => s.extend(opt(t, s, { climb: 4, turnAs: 'corner' })),
  'W2 corner 30 with climb 4': (t, s) => s.extend(opt(t, s, { turn: 30, climb: 4, turnAs: 'corner' })),
  'W3 extend, bank 8 at start': (t, s) => s.extend(opt(t, s, { bank: 8, atStart: { bank: true } })),
  'W4 turnBy 45, bank 8 at start': (t, s) => s.extendTurnBy(opt(t, s, { bank: 8, atStart: { bank: true } }), 45),
  'W5 extend 30 m, bank 8 at start': (t, s) => s.extend(opt(t, s, { length: 30, bank: 8, atStart: { bank: true } })),
  'W6 sharp -60 R40 ramp8, bank 8 at start': (t, s) => s.extendSharp(opt(t, s, { bank: 8, atStart: { bank: true } }), { deg: -60, R: 40, ramp: 8 }),
};
const lay = (t, s, call) => { const n = doc(s).pieces.length; let err = null; try { call(t, s); } catch (e) { err = `${e.code || e.name}: ${String(e.message).slice(0, 160)}`; }
  const d = doc(s); if (d.pieces.length === n) return { refused: err || String(s.getState().message).slice(0, 160) };
  return { d, n, added: d.pieces.slice(n), end: t.A.toPath(d, { step: 0.25 }).path.samples.at(-1).pos, msg: s.getState().message || null }; };
// every channel but w and wd of every new piece, in steps of the TEST tree's DEC
function apart(a, b) {
  if (a.refused || b.refused) return { refused: [a.refused || null, b.refused || null] };
  const r = { count: [a.added.length, b.added.length], lengths: a.added.map((P, i) => (b.added[i] && P.length === b.added[i].length ? 'same' : `${P.length} vs ${b.added[i] && b.added[i].length}`)), worst: 0, worstAt: null, perCh: {} };
  a.added.forEach((P, i) => { const Q = b.added[i]; if (!Q) return;
    if (!P.channels || !Q.channels) { if (JSON.stringify(P) !== JSON.stringify(Q)) { r.worst = Infinity; r.worstAt = `piece ${i} (${P.type}) differs`; } return; }
    for (const ch of Object.keys(P.channels)) { if (ch === 'w' || ch === 'wd') continue; const step = 10 ** -X.D.DEC[ch], L = Math.min(P.length, Q.length);
      let m = 0, at = 0; for (let k = 0, n = Math.round(L / 0.01); k <= n; k++) { const x = Math.min((k * L) / n, L), d = Math.abs(X.D.channelValue(P, ch, x) - X.D.channelValue(Q, ch, x)) / step; if (d > m) { m = d; at = x; } }
      r.perCh[ch] = Math.max(r.perCh[ch] || 0, +m.toFixed(3)); if (m > r.worst) { r.worst = +m.toFixed(3); r.worstAt = `${ch}, piece ${i} at ${at.toFixed(2)} m`; } } });
  r.endApartM = +Math.hypot(...a.end.map((v, k) => v - b.end[k])).toExponential(3);
  return r;
}
function widthOf(s0, L, Wl) {
  if (L.refused) return null;
  const prev = L.d.pieces[L.n - 1], P = L.added[0], head = X.D.pieceEnd(prev).w, end = X.D.pieceEnd(P).w;
  let swing = 0, at = 0, off = 0; for (let k = 0, n = Math.round(P.length * 100); k <= n; k++) { const x = k / 100, d = X.D.channelValue(P, 'w', x) - head.v; if (Math.abs(d) > Math.abs(swing)) { swing = d; at = x; } if (Math.abs(d) > 1e-3) off = x; }
  const gaps = P.knots.map((k, i) => (i ? k - P.knots[i - 1] : k)); const minGap = Math.min(...gaps, P.length - (P.knots.at(-1) || 0));
  const o = { head, slope: head.m, joint: X.D.jointProblem(X.D.pieceEnd(prev), P, X.D.kindOf(prev)), endIsHeadLevel: end.v === head.v && end.m === 0, end, swingMm: +(1000 * swing).toFixed(3), swingAt: +at.toFixed(2), over1mmUntil: +off.toFixed(2), knots: P.knots.length, minKnotGapM: +minGap.toFixed(4) };
  if (Wl && !Wl.refused) { const Q = Wl.added[0]; o.vsWidthTree = { knotsSame: JSON.stringify(P.knots) === JSON.stringify(Q.knots), wSame: JSON.stringify(P.channels.w) === JSON.stringify(Q.channels.w), lengthSame: P.length === Q.length };
    if (!o.vsWidthTree.wSame || !o.vsWidthTree.knotsSame) { let m = 0, a2 = 0; const L2 = Math.min(P.length, Q.length); for (let k = 0, n = Math.round(L2 * 100); k <= n; k++) { const x = Math.min(k / 100, L2), d = Math.abs(X.D.channelValue(P, 'w', x) - W.D.channelValue(Q, 'w', x)); if (d > m) { m = d; a2 = x; } } o.vsWidthTree.maxDwMm = +(1000 * m).toFixed(4); o.vsWidthTree.at = +a2.toFixed(2); o.vsWidthTree.knots = [P.knots.length, Q.knots.length]; } }
  else if (Wl) o.vsWidthTree = { widthTreeRefused: Wl.refused };
  return o;
}
(async () => {
  const rows = [];
  for (const [hn, mk] of Object.entries(HEADS)) for (const [cn, call] of Object.entries(CALLERS)) {
    const sR = await mk(R), sX = await mk(X), sW = W ? await mk(W) : null;
    const same = h(doc(sR).pieces) === h(doc(sX).pieces) && (!sW || h(doc(sW).pieces) === h(doc(sX).pieces));
    if (!same) { rows.push({ head: hn, caller: cn, note: 'heads DIFFER between trees' }); continue; }
    const slope = X.D.pieceEnd(doc(sX).pieces.at(-1)).w.m, placed = h(doc(sX).pieces);
    const sF = slope !== 0 ? await twin(X, await mk(X)) : null;
    const LR = lay(R, sR, call), LX = lay(X, sX, call), LF = sF ? lay(X, sF, call) : null, LW = sW ? lay(W, sW, call) : null;
    rows.push({ head: hn, caller: cn, slope, refused: LX.refused || null, refRefused: LR.refused || null, placedSame: LX.refused ? null : h(LX.d.pieces.slice(0, LX.n)) === placed,
      vsRef: apart(LX, LR), vsTwin: LF ? apart(LX, LF) : null, width: slope !== 0 ? widthOf(sX, LX, LW) : null, levelBytesVsWidthTree: slope === 0 && LW && !LX.refused && !LW.refused ? h(LX.added) === h(LW.added) : undefined });
  }
  fs.writeFileSync(OUT, JSON.stringify({ ref: R.T, test: X.T, width: W && W.T, set: SET, DEC: X.D.DEC, rows }, null, 1));
  for (const r of rows) console.log(JSON.stringify({ head: r.head, caller: r.caller, slope: r.slope, refused: r.refused, refRefused: r.refRefused, placedSame: r.placedSame, vsRef: r.vsRef && { worst: r.vsRef.worst, at: r.vsRef.worstAt, end: r.vsRef.endApartM, lengths: r.vsRef.lengths, refused: r.vsRef.refused }, vsTwin: r.vsTwin && { worst: r.vsTwin.worst, at: r.vsTwin.worstAt, end: r.vsTwin.endApartM, lengths: r.vsTwin.lengths }, width: r.width && { joint: r.width.joint, level: r.width.endIsHeadLevel, swingMm: r.width.swingMm, over1mm: r.width.over1mmUntil, knots: r.width.knots, minGap: r.width.minKnotGapM, vsWidthTree: r.width.vsWidthTree }, levelBytes: r.levelBytesVsWidthTree }));
})().catch((e) => { console.error('var678 failed:', e); process.exit(1); });
