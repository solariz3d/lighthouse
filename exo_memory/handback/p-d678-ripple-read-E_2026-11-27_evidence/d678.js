// d678.js (pane E, D678 read of e112a14..c2591bf): the held width laid by the callers B's rows do not vary, from heads the APP's own tools leave, on ONE tree.
// Heads: the app's brush (createCoreShell's default brushFn; channel 'w' goes to the core's value brush) and Sculpt's grab (beginFollow, brushTo({ w })), on B's
// road (ripple268.js `plain`); a grid of grabs near the end; a grid of wide brushes about 30 m before the end; a level head. Callers, each through the SHELL with
// the panel's own extendOptions (what the panel's buttons call): Extend as shown, Turn by, a corner with an extra corner, Sharp (the panel's defaults 90 deg,
// R 22, ramp 4), Jump (its take-off), Level; and Finish (finish.js finishToStart, the function the shell's close job runs) on a lap that is nearly closed.
// For the FIRST new piece (the held one) against the head: the swing past the head's width and where, the last station > 1 mm and > 1e-9 m off, the end, the
// joint, the largest |w''| (B's step, and a fine one), the brushed piece's own largest |w''|, the pieces already laid, the bytes. Synthetic roads only.
// Also: the right-width refusals (C6) with their positive control on 'w'. usage: node d678.js <tree> <out.json>
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), OUT = process.argv[3];
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const h = (x) => crypto.createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 12);
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const DEG = Math.PI / 180;
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } });
// the lap of my L264 Finish probe (finishw.js): a straight and four quarter turns at R 180, then 60 m, open near its start
const lap = () => { const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); return TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present;
const total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const noW = (P) => { const { w, ...channels } = P.channels; return { ...P, channels }; };
async function shell(d, sculpt = false) { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(d); if (sculpt) s.setSculpt(true); return s; }
const brushed = (road, d, r, delta) => async () => { const s = await shell(road()); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grabbed = (road, d, r, dw) => async () => { const s = await shell(road(), true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return s; };
const level = (road) => async () => shell(road());
const wAt = (P, x) => D.channelValue(P, 'w', x);
const wpp = (P, x, e) => (wAt(P, x + e) - 2 * wAt(P, x) + wAt(P, x - e)) / (e * e);
const mostB = (P) => { let m = 0; for (let x = 0.1; x < P.length - 0.1; x += 0.1) m = Math.max(m, Math.abs(wpp(P, x, 0.05))); return m; };   // B's bend268.js measure
const mostFine = (P, upTo) => { let m = 0, at = 0; for (let x = 0.02; x < Math.min(P.length - 0.02, upTo); x += 0.01) { const v = Math.abs(wpp(P, x, 0.01)); if (v > m) { m = v; at = x; } } return [m, at]; };
function measure(before, P) {
  const prev = before.pieces[before.pieces.length - 1], a = D.pieceEnd(prev).w, L = P.length;
  let swing = 0, at = 0, last1mm = 0, last1e9 = 0;
  const look = (x) => { const dv = wAt(P, x) - a.v; if (Math.abs(dv) > Math.abs(swing)) { swing = dv; at = x; } if (Math.abs(dv) > 1e-3) last1mm = x; if (Math.abs(dv) > 1e-9) last1e9 = x; };
  for (let k = 0; k * 0.01 <= Math.min(L, 60) + 1e-9; k++) look(Math.min(L, k * 0.01));
  for (let x = 60.1; x < L; x += 0.1) look(x); look(L);
  const [w2fine, w2fineAt] = mostFine(P, 40);
  return { head: { v: a.v, m: a.m }, length: +L.toFixed(4), firstKnots: P.knots.slice(0, 10), swing: +swing.toFixed(7), swingAt: +at.toFixed(2), factor: a.m ? +(swing / a.m).toFixed(4) : null,
    over1mmUntil: +last1mm.toFixed(2), over1e9Until: +last1e9.toFixed(2), end: D.pieceEnd(P).w, joint: D.jointProblem(D.pieceEnd(prev), P, D.kindOf(prev)),
    w2B: +mostB(P).toExponential(4), w2fine: +w2fine.toExponential(4), w2fineAt: +w2fineAt.toFixed(2), brushedOwnW2B: +mostB(prev).toExponential(4), piece: h(P), pieceNoW: h(noW(P)) };
}
const opts = (s, length = 100) => extendOptions({ ...BLANK, length, head: s.headState() });
const CALLERS = [
  ['extend', (s) => s.extend(opts(s))],
  ['turnBy 45', (s) => s.extendTurnBy(opts(s), 45)],
  ['turnBy -90 over 200', (s) => s.extendTurnBy(opts(s, 200), -90)],
  ['corner 30 + extra 20 from 50', (s) => s.extend({ ...opts(s), turnDeg: 30, changes: { turnDeg: [{ from: 50, deg: 20 }] } })],
  ['sharp 90 R22 ramp4', (s) => s.extendSharp(opts(s), { deg: 90, R: 22, ramp: 4 })],
  ['sharp -60 R40 ramp8', (s) => s.extendSharp(opts(s), { deg: -60, R: 40, ramp: 8 })],
  ['sharp 90 R150 ramp4', (s) => s.extendSharp(opts(s), { deg: 90, R: 150, ramp: 4 })],
  ['sharp -60 R40 ramp1', (s) => s.extendSharp(opts(s), { deg: -60, R: 40, ramp: 1 })],
  ['jump (take-off)', (s) => s.jump(opts(s))],
  ['level', (s) => s.extendLevel(opts(s))],
];
async function run(name, mk, callers) {
  const rows = [];
  for (const [cname, call] of callers) {
    const s = await mk(), before = doc(s), headW = D.endState(before).w;
    let err = null; try { call(s); } catch (e) { err = `${e.code || e.name}: ${String(e.message).slice(0, 160)}`; }
    const after = doc(s);
    if (err || after === before) { rows.push({ case: name, caller: cname, headW, refused: err || s.getState().message }); continue; }
    const n0 = before.pieces.length;
    rows.push({ case: name, caller: cname, headW, added: after.pieces.length - n0, kinds: after.pieces.slice(n0).map((P) => P.type), placedSame: h(after.pieces.slice(0, n0)) === h(before.pieces), msg: s.getState().message || null, ...measure(before, after.pieces[n0]) });
  }
  return rows;
}
(async () => {
  const out = { tree: T, rows: [], finish: [], rightWidth: [] };
  const HEADS = [
    ['level head', level(plain)],
    ['E1 brush +1.37 end-5 r20', brushed(plain, 5, 20, 1.37)],
    ['E4 brush +5 end-30 r40', brushed(plain, 30, 40, 5)],
    ['E6 grab +2 end-10 r20', grabbed(plain, 10, 20, 2)],
  ];
  for (const d of [0, 1, 2, 3, 5]) for (const r of [5, 10, 20]) for (const dw of [2, -2, 4]) HEADS.push([`grab ${dw > 0 ? '+' : ''}${dw} end-${d} r${r}`, grabbed(plain, d, r, dw)]);
  for (const d of [25, 30, 35]) for (const r of [30, 40]) for (const delta of [5, -5]) HEADS.push([`brush ${delta > 0 ? '+' : ''}${delta} end-${d} r${r}`, brushed(plain, d, r, delta)]);
  if (process.env.SMOKE) HEADS.length = 4;
  for (const [name, mk] of HEADS) out.rows.push(...(await run(name, mk, CALLERS)));
  // Finish (the core function the shell's job runs) on the lap, from a level head, E1-, E4- and E6-like heads and two grabs near the end
  if (!process.env.SMOKE) for (const [name, mk] of [['lap level', level(lap)], ['lap brush +1.37 end-5 r20', brushed(lap, 5, 20, 1.37)], ['lap brush +5 end-30 r40', brushed(lap, 30, 40, 5)], ['lap grab +2 end-10 r20', grabbed(lap, 10, 20, 2)],
    ['lap grab +2 end-0 r10', grabbed(lap, 0, 10, 2)], ['lap grab -2 end-2 r5', grabbed(lap, 2, 5, -2)]]) {
    const s = await mk(), d0 = doc(s); let r, err = null; try { r = F.finishToStart(d0); } catch (e) { err = `${e.code || e.name}: ${String(e.message).slice(0, 200)}`; }
    if (err) { out.finish.push({ head: name, headW: D.endState(d0).w, refused: err }); continue; }
    const n0 = d0.pieces.length, P = r.doc.pieces[n0];
    const pieces = r.doc.pieces.slice(n0).map((Q) => ({ length: +Q.length.toFixed(2), w0: +wAt(Q, 0).toFixed(5), w1: +D.pieceEnd(Q).w.v.toFixed(5), w2B: +mostB(Q).toExponential(3) }));
    out.finish.push({ head: name, headW: D.endState(d0).w, closed: !!r.doc.closed, plan: r.plan.word, window: r.window, placedSame: h(r.doc.pieces.slice(0, n0)) === h(d0.pieces), pieces, first: measure(d0, P) });
  }
  // C6: the right width. The app's brush (default brushFn) on 'wd', Sculpt's grab on 'wd', and the shell with no core brush (brushFn null: not the app's path);
  // each beside the same call on 'w' (the positive control: the call itself works)
  for (const ch of ['wd', 'w']) {
    { const s = await shell(plain()); let e1 = null; try { s.beginBrush({ mode: 'rate', channel: ch, s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); } catch (e) { e1 = `${e.code}: ${e.message}`; }
      out.rightWidth.push({ path: 'app brush (default brushFn)', ch, threw: e1, msg: s.getState().message, headW: D.endState(doc(s)).w, headWd: D.endState(doc(s)).wd || null }); }
    { const s = await shell(plain(), true); let e1 = null; try { s.beginFollow({ s0: total(doc(s)) - 5, r: 20 }); s.brushTo({ [ch]: 1.37 }); s.endBrush(); } catch (e) { e1 = `${e.code}: ${e.message}`; }
      out.rightWidth.push({ path: "Sculpt's grab", ch, threw: e1, msg: s.getState().message, headW: D.endState(doc(s)).w, headWd: D.endState(doc(s)).wd || null }); }
    { const s = await createCoreShell({ autosaveMs: 0, brushFn: null }); s.commitDoc(plain()); let e1 = null; try { s.beginBrush({ mode: 'rate', channel: ch, s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); } catch (e) { e1 = `${e.code}: ${e.message}`; }
      out.rightWidth.push({ path: 'shell with brushFn null (older sculpt; not the app)', ch, threw: e1, msg: s.getState().message, headW: D.endState(doc(s)).w, headWd: D.endState(doc(s)).wd || null }); }
  }
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log(`rows ${out.rows.length}, finish ${out.finish.length}, rightWidth ${out.rightWidth.length}`);
})().catch((e) => { console.error('d678 failed:', e); process.exit(1); });
