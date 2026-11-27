// chan678.js (pane E, D678): does c2591bf move any channel but the width? The held piece's knots differ between the trees (the hold's ramp adds knots), so bytes
// cannot say; this evaluates every channel of the first new piece on both trees from the same head, every 0.01 m, and prints the largest difference per channel,
// with the piece's length, its turn (the integral of kh, degrees) and its tightest radius on each tree. A level head is the reference (no hold on either tree).
// Then two positive controls for zeros the hand-back quotes: D.jointProblem must flag a joint broken by 1 mm of width, and the placed-pieces hash must see one
// control point moved by 1e-9. usage: node chan678.js <beforeTree> <afterTree>
'use strict';
const path = require('path'), crypto = require('crypto');
const load = (T) => { T = path.resolve(T); return { D: require(path.join(T, 'src/core/document.js')), extend: require(path.join(T, 'src/core/extend.js')).extend,
  shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const [Bt, At] = process.argv.slice(2).map(load);
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = (t) => t.extend(t.extend(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (t, sculpt) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); if (sculpt) s.setSculpt(true); return s; };
const heads = {
  'level head': async (t) => sh(t),
  E1: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); return s; },
  E4: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; },
  E6: async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; },
  'grab +4 end-3 r5': async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 3, r: 5 }); s.brushTo({ w: 4 }); s.endBrush(); s.setSculpt(false); return s; },
};
const opt = (t, s, length = 100) => t.extendOptions({ ...BLANK, length, head: s.headState() });
const callers = { extend: (t, s) => s.extend(opt(t, s)), 'turnBy 45': (t, s) => s.extendTurnBy(opt(t, s), 45), 'turnBy -90 over 200': (t, s) => s.extendTurnBy(opt(t, s, 200), -90),
  'corner 30 + extra 20 from 50': (t, s) => s.extend({ ...opt(t, s), turnDeg: 30, changes: { turnDeg: [{ from: 50, deg: 20 }] } }),
  'sharp -60 R40 ramp8': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 8 }), 'sharp 90 R150 ramp4': (t, s) => s.extendSharp(opt(t, s), { deg: 90, R: 150, ramp: 4 }),
  'sharp -60 R40 ramp1': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 1 }), 'jump (take-off)': (t, s) => s.jump(opt(t, s)), level: (t, s) => s.extendLevel(opt(t, s)) };
const turn = (t, P) => { let a = 0, m = 0; const n = Math.ceil(P.length / 0.01); for (let i = 0; i < n; i++) { const x0 = (i * P.length) / n, x1 = ((i + 1) * P.length) / n, k0 = t.D.channelValue(P, 'kh', x0), k1 = t.D.channelValue(P, 'kh', x1); a += ((k0 + k1) / 2) * (x1 - x0); m = Math.max(m, Math.abs(k0)); } return [(a * 180) / Math.PI, m]; };
(async () => {
  for (const [hn, mk] of Object.entries(heads)) for (const [cn, call] of Object.entries(callers)) {
    const sb = await mk(Bt), sa = await mk(At), n = doc(sb).pieces.length;
    if (JSON.stringify(doc(sb).pieces) !== JSON.stringify(doc(sa).pieces)) { console.log(JSON.stringify({ head: hn, caller: cn, note: 'heads DIFFER between trees' })); continue; }
    try { call(Bt, sb); call(At, sa); } catch (e) { console.log(JSON.stringify({ head: hn, caller: cn, threw: String(e.message).slice(0, 100) })); continue; }
    if (doc(sb).pieces.length === n || doc(sa).pieces.length === n) { console.log(JSON.stringify({ head: hn, caller: cn, refused: [sb.getState().message, sa.getState().message].map((m) => String(m).slice(0, 80)) })); continue; }
    const Pb = doc(sb).pieces[n], Pa = doc(sa).pieces[n], out = {};
    for (const ch of Object.keys(Pa.channels)) { let m = 0, at = 0; for (let x = 0; x <= Pa.length + 1e-9; x += 0.01) { const d = Math.abs(At.D.channelValue(Pa, ch, Math.min(x, Pa.length)) - Bt.D.channelValue(Pb, ch, Math.min(x, Pb.length))); if (d > m) { m = d; at = x; } } out[ch] = m ? `${m.toExponential(2)} at ${at.toFixed(2)}` : 0; }
    const [hb, mb] = turn(Bt, Pb), [ha, ma] = turn(At, Pa);
    console.log(JSON.stringify({ head: hn, caller: cn, added: [doc(sb).pieces.length - n, doc(sa).pieces.length - n], lengthB: Pb.length, lengthA: Pa.length, knotsB: Pb.knots.length, knotsA: Pa.knots.length, turnDegB: +hb.toFixed(6), turnDegA: +ha.toFixed(6), tightestRB: +(1 / mb).toFixed(3), tightestRA: +(1 / ma).toFixed(3), maxDiff: out }));
  }
  // positive controls
  const t = At, s = await heads.E4(t), d = doc(s), prev = d.pieces.at(-1); s.extend(opt(t, s)); const P = doc(s).pieces.at(-1);
  const bad = JSON.parse(JSON.stringify(P)); bad.channels.w = bad.channels.w.map((v) => v + 1e-3);
  console.log('control jointProblem, the laid joint:', JSON.stringify(t.D.jointProblem(t.D.pieceEnd(prev), P, t.D.kindOf(prev))), '| the same piece with its width raised 1 mm:', JSON.stringify(t.D.jointProblem(t.D.pieceEnd(prev), bad, t.D.kindOf(prev))));
  const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 12);
  const moved = JSON.parse(JSON.stringify(d.pieces)); moved[0].channels.w[1] += 1e-9;
  console.log('control placed hash: a copy reads same:', h(d.pieces) === h(JSON.parse(JSON.stringify(d.pieces))), '| one control point moved 1e-9 reads different:', h(d.pieces) !== h(moved));
})().catch((e) => { console.error('chan678 failed:', e); process.exit(1); });
