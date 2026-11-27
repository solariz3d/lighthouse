// row1_678.js (pane B, D678 Track 1): ROW 1, THE PATH, as registered in handback/p-d678-width-hold-path-B_2026-11-27.md §0. E's five heads (chan678.js) and the
// nine callers that lay (endpos678.js / chan678.js, the shell with the panel's extendOptions), and Finish (finish.js finishToStart) on E's lap with E's six heads (d678.js).
// For each head x caller on tree X: the new pieces' count and lengths, every channel but w (and wd) of every new piece every 0.01 m, and the end point (toPath step
// 0.25, last sample), against (1) the same caller from the LEVEL head on the same tree X and (2) the same head and caller on the reference tree (e112a14). Each
// channel's largest difference is printed in STEPS of its stored decimals (document.js DEC: 1 = one step). Also the first new piece's joint and its end width.
// usage: node row1_678.js <tree X> <reference tree> [finish]      (synthetic roads only)
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path');
const load = (T) => { T = path.resolve(T); return { T, D: require(path.join(T, 'src/core/document.js')), extend: require(path.join(T, 'src/core/extend.js')).extend, A: require(path.join(T, 'src/core/adapter.js')),
  TB: require(path.join(T, 'src/core/turnby.js')), F: require(path.join(T, 'src/core/finish.js')),
  shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const X = load(process.argv[2]), R = load(process.argv[3]), FINISH = process.argv[4] === 'finish';
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const DEG = Math.PI / 180;
const plain = (t) => t.extend(t.extend(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } });
const lap = (t) => { const Rr = 180, Q = (Math.PI * Rr) / 2; let d = t.TB.extendCorner(t.D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = t.TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / Rr } }); return t.TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (t, road, sculpt) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(road(t)); if (sculpt) s.setSculpt(true); return s; };
const brush = (road, d, r, delta) => async (t) => { const s = await sh(t, road); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grab = (road, d, r, dw) => async (t) => { const s = await sh(t, road, true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return s; };
const HEADS = { 'level head': async (t) => sh(t, plain), E1: brush(plain, 5, 20, 1.37), E4: brush(plain, 30, 40, 5), E6: grab(plain, 10, 20, 2), 'grab +4 end-3 r5': grab(plain, 3, 5, 4) };
const FHEADS = { 'lap level': async (t) => sh(t, lap), 'lap brush +1.37 end-5 r20': brush(lap, 5, 20, 1.37), 'lap brush +5 end-30 r40': brush(lap, 30, 40, 5), 'lap grab +2 end-10 r20': grab(lap, 10, 20, 2),
  'lap grab +2 end-0 r10': grab(lap, 0, 10, 2), 'lap grab -2 end-2 r5': grab(lap, 2, 5, -2) };
const opt = (t, s, length = 100) => t.extendOptions({ ...BLANK, length, head: s.headState() });
const CALLERS = { extend: (t, s) => s.extend(opt(t, s)), 'turnBy 45': (t, s) => s.extendTurnBy(opt(t, s), 45), 'turnBy -90 over 200': (t, s) => s.extendTurnBy(opt(t, s, 200), -90),
  'corner 30 + extra 20 from 50': (t, s) => s.extend({ ...opt(t, s), turnDeg: 30, changes: { turnDeg: [{ from: 50, deg: 20 }] } }),
  'sharp -60 R40 ramp8': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 8 }), 'sharp 90 R150 ramp4': (t, s) => s.extendSharp(opt(t, s), { deg: 90, R: 150, ramp: 4 }),
  'sharp -60 R40 ramp1': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 1 }), 'sharp 90 R22 ramp4 (refused on both, E)': (t, s) => s.extendSharp(opt(t, s), { deg: 90, R: 22, ramp: 4 }),
  'jump (take-off)': (t, s) => s.jump(opt(t, s)), level: (t, s) => s.extendLevel(opt(t, s)) };
const endOf = (t, d) => { const q = t.A.toPath({ ...d, closed: false }, { step: 0.25 }).path.samples.at(-1).pos; return q; };
/** The largest difference of each channel but w and wd over two lists of pieces, in steps of its DEC; null when the counts or lengths differ. */
function compare(t, ps, qs) {
  if (ps.length !== qs.length) return { counts: [ps.length, qs.length] };
  const lengths = ps.map((P, i) => P.length === qs[i].length);
  if (!lengths.every(Boolean)) return { lengths: ps.map((P, i) => [P.length, qs[i].length]) };
  const worst = {}; let all = 0, where = null;
  ps.forEach((P, i) => {
    const Q = qs[i]; if (P.type !== 'road' || Q.type !== 'road') { if (JSON.stringify(P) !== JSON.stringify(Q)) worst[`piece${i}`] = 'flight differs'; return; }
    for (const ch of t.D.CHANNELS) {
      if (ch === 'w' || ch === 'wd' || !P.channels[ch] || !Q.channels[ch]) continue;
      const step = 10 ** -t.D.DEC[ch]; let m = 0, at = 0;
      const n = Math.ceil(P.length / 0.01);
      for (let k = 0; k <= n; k++) { const x = Math.min(P.length, k * 0.01), d = Math.abs(t.D.channelValue(P, ch, x) - t.D.channelValue(Q, ch, x)) / step; if (d > m) { m = d; at = x; } }
      if (m > (worst[ch] || 0)) worst[ch] = +m.toFixed(3);
      if (m > all) { all = m; where = `${ch} piece ${i} at ${at.toFixed(2)}`; }
    }
  });
  return { maxSteps: +all.toFixed(3), where, worst };
}
// ADDED after the first run (see the hand-back §1): the same head with ONLY its width made level at its end (the head piece's last two width control points set
// equal, so the end slope is 0 and every other channel, the turn's slope included, is the head's own). It separates the hold from a head whose other channels differ.
const flatten = async (t, mk) => { const s = await mk(t), d = doc(s), P = d.pieces[d.pieces.length - 1], w = P.channels.w.slice(); w[w.length - 2] = w[w.length - 1];
  const s2 = await t.shell({ autosaveMs: 0 }); s2.commitDoc(t.D.checkDoc({ ...d, pieces: [...d.pieces.slice(0, -1), { ...P, channels: { ...P.channels, w } }] })); return s2; };
async function lay(t, mk, call, flat = false) {
  const s = flat ? await flatten(t, mk) : await mk(t), d0 = doc(s), n = d0.pieces.length, prev = d0.pieces[n - 1];
  try { call(t, s); } catch (e) { return { threw: String(e.message).slice(0, 120) }; }
  const d = doc(s); if (d.pieces.length === n) return { refused: String(s.getState().message).slice(0, 100) };
  const P = d.pieces[n], head = t.D.pieceEnd(prev).w;
  return { n, d, pieces: d.pieces.slice(n), end: endOf(t, d), head, joint: t.D.jointProblem(t.D.pieceEnd(prev), P, t.D.kindOf(prev)), firstEnd: t.D.pieceEnd(P).w };
}
const apart = (a, b) => +Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]).toFixed(6);
(async () => {
  let worstSteps = 0, worstEnd = 0, rows = 0, fails = 0;
  for (const [cn, call] of Object.entries(CALLERS)) {
    const lev = await lay(X, HEADS['level head'], call);
    for (const [hn, mk] of Object.entries(HEADS)) {
      if (hn === 'level head') { console.log(JSON.stringify({ head: hn, caller: cn, refused: lev.refused || lev.threw || undefined, added: lev.pieces ? lev.pieces.length : 0 })); continue; }
      const x = await lay(X, mk, call), r = await lay(R, mk, call), fl = await lay(X, mk, call, true);
      if (!x.pieces || !lev.pieces || !r.pieces) { console.log(JSON.stringify({ head: hn, caller: cn, X: x.refused || x.threw || 'laid', level: lev.refused || lev.threw || 'laid', ref: r.refused || r.threw || 'laid' })); continue; }
      const vsFlat = fl.pieces ? compare(X, x.pieces, fl.pieces) : { flat: fl.refused || fl.threw }, endF = fl.pieces ? apart(x.end, fl.end) : null, flatHeadSlope = fl.head ? fl.head.m : null;
      const vsLevel = compare(X, x.pieces, lev.pieces), vsRef = compare(X, x.pieces, r.pieces);
      const endL = apart(x.end, lev.end), endR = apart(x.end, r.end);
      const held = x.head.m !== 0, firstOk = held ? x.firstEnd.v === x.head.v && x.firstEnd.m === 0 : true;
      const ok = vsLevel.maxSteps !== undefined && vsRef.maxSteps !== undefined && vsLevel.maxSteps <= 1 && vsRef.maxSteps <= 1 && endL <= 1e-4 && endR <= 1e-4 && x.joint === null && firstOk;
      rows++; if (!ok) fails++;
      if (vsLevel.maxSteps !== undefined) worstSteps = Math.max(worstSteps, vsLevel.maxSteps, vsRef.maxSteps || 0); worstEnd = Math.max(worstEnd, endL, endR);
      console.log(JSON.stringify({ head: hn, caller: cn, ok, vsFlat, endFromFlatM: endF, flatHeadSlope, flatOk: vsFlat.maxSteps !== undefined && vsFlat.maxSteps <= 1 && endF <= 1e-4, headSlope: +x.head.m.toExponential(3), added: x.pieces.length, vsLevel, vsRef, endFromLevelM: endL, endFromRefM: endR, joint: x.joint, firstEnd: x.firstEnd }));
    }
  }
  console.log(`ROWS ${rows}, fail ${fails}, largest difference ${worstSteps} steps, largest end apart ${worstEnd} m`);
  if (!FINISH) return;
  let flev = null; rows = 0; fails = 0; worstSteps = 0; worstEnd = 0;
  for (const [hn, mk] of Object.entries(FHEADS)) {
    const fin = async (t) => { const s = await mk(t), d0 = doc(s), n = d0.pieces.length; let r; try { r = t.F.finishToStart(d0); } catch (e) { return { threw: `${e.code || e.name}: ${String(e.message).slice(0, 120)}` }; }
      return { n, head: t.D.endState(d0).w, closed: !!r.doc.closed, plan: r.plan.word, window: r.window, placedSame: JSON.stringify(r.doc.pieces.slice(0, n)) === JSON.stringify(d0.pieces), pieces: r.doc.pieces.slice(n), end: endOf(t, r.doc) }; };
    const x = await fin(X), r = await fin(R);
    if (hn === 'lap level') { flev = x; console.log(JSON.stringify({ finish: hn, X: x.threw || { closed: x.closed, plan: x.plan, window: x.window, added: x.pieces.length } })); continue; }
    if (!x.pieces || !r.pieces || !flev.pieces) { console.log(JSON.stringify({ finish: hn, X: x.threw || 'laid', ref: r.threw || 'laid' })); continue; }
    const vsLevel = compare(X, x.pieces, flev.pieces), vsRef = compare(X, x.pieces, r.pieces), endL = apart(x.end, flev.end), endR = apart(x.end, r.end);
    const ok = vsLevel.maxSteps !== undefined && vsRef.maxSteps !== undefined && vsLevel.maxSteps <= 1 && vsRef.maxSteps <= 1 && endL <= 1e-4 && endR <= 1e-4;
    rows++; if (!ok) fails++;
    if (vsLevel.maxSteps !== undefined) worstSteps = Math.max(worstSteps, vsLevel.maxSteps, vsRef.maxSteps || 0); worstEnd = Math.max(worstEnd, endL, endR);
    console.log(JSON.stringify({ finish: hn, ok, headSlope: +x.head.m.toExponential(3), closed: x.closed, plan: x.plan, window: x.window, placedSame: x.placedSame, vsLevel, vsRef, endFromLevelM: endL, endFromRefM: endR }));
  }
  console.log(`FINISH ROWS ${rows}, fail ${fails}, largest difference ${worstSteps} steps, largest end apart ${worstEnd} m`);
})().catch((e) => { console.error('row1_678 failed:', e); process.exit(1); });
