// endpos678.js (pane E, D678): where the track ENDS after each caller, on both trees, from the same head: the heading at the end (degrees), and the end point
// (the adapter's path, last sample) and the distance between the trees' end points. A level head is the reference. usage: node endpos678.js <beforeTree> <afterTree>
'use strict';
const path = require('path');
const load = (T) => { T = path.resolve(T); return { D: require(path.join(T, 'src/core/document.js')), extend: require(path.join(T, 'src/core/extend.js')).extend, A: require(path.join(T, 'src/core/adapter.js')),
  shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const [Bt, At] = process.argv.slice(2).map(load);
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = (t) => t.extend(t.extend(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (t, sculpt) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); if (sculpt) s.setSculpt(true); return s; };
const heads = { 'level head': async (t) => sh(t),
  E4: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; },
  E6: async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; } };
const opt = (t, s, length = 100) => t.extendOptions({ ...BLANK, length, head: s.headState() });
const callers = { extend: (t, s) => s.extend(opt(t, s)), 'turnBy 45': (t, s) => s.extendTurnBy(opt(t, s), 45), 'turnBy -90 over 200': (t, s) => s.extendTurnBy(opt(t, s, 200), -90),
  'corner 30 + extra 20 from 50': (t, s) => s.extend({ ...opt(t, s), turnDeg: 30, changes: { turnDeg: [{ from: 50, deg: 20 }] } }),
  'sharp -60 R40 ramp8': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 8 }), 'sharp 90 R150 ramp4': (t, s) => s.extendSharp(opt(t, s), { deg: 90, R: 150, ramp: 4 }),
  'sharp -60 R40 ramp1': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 1 }) };
const endOf = (t, d) => { const q = t.A.toPath(d, { step: 0.25 }).path.samples.at(-1).pos; return { x: q[0], y: q[1], z: q[2] }; };
const deg = (t, d) => (t.D.endState(d).heading !== undefined ? (t.D.endState(d).heading * 180) / Math.PI : null);
(async () => {
  const ref = {};
  for (const [hn, mk] of Object.entries(heads)) for (const [cn, call] of Object.entries(callers)) {
    const sb = await mk(Bt), sa = await mk(At), n = doc(sb).pieces.length; call(Bt, sb); call(At, sa);
    const db = doc(sb), da = doc(sa), eb = endOf(Bt, db), ea = endOf(At, da);
    const turnOf = (t, d) => { let a = 0; for (const P of d.pieces.slice(n)) { if (!P.channels || !P.channels.kh) continue; const m = Math.ceil(P.length / 0.01); for (let i = 0; i < m; i++) { const x0 = (i * P.length) / m, x1 = ((i + 1) * P.length) / m; a += ((t.D.channelValue(P, 'kh', x0) + t.D.channelValue(P, 'kh', x1)) / 2) * (x1 - x0); } } return (a * 180) / Math.PI; };
    const lenB = db.pieces.slice(n).reduce((a, P) => a + P.length, 0), lenA = da.pieces.slice(n).reduce((a, P) => a + P.length, 0);
    const dist = eb && ea ? Math.hypot(ea.x - eb.x, ea.y - eb.y, (ea.z || 0) - (eb.z || 0)) : null;
    if (hn === 'level head') ref[cn] = ea;
    const fromLevel = ref[cn] && ea ? Math.hypot(ea.x - ref[cn].x, ea.y - ref[cn].y, (ea.z || 0) - (ref[cn].z || 0)) : null;
    console.log(JSON.stringify({ head: hn, caller: cn, pieces: [db.pieces.length - n, da.pieces.length - n], addedLength: [+lenB.toFixed(4), +lenA.toFixed(4)], turnAddedDeg: [+turnOf(Bt, db).toFixed(5), +turnOf(At, da).toFixed(5)], endApartM: dist === null ? 'no end point read' : +dist.toFixed(4), afterEndFromLevelHeadM: fromLevel === null ? null : +fromLevel.toFixed(4) }));
  }
})().catch((e) => { console.error('endpos678 failed:', e); process.exit(1); });
