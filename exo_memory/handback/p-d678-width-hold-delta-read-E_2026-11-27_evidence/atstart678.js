// atstart678.js (pane E, D678 Track 2): the held width when another field is typed at the start (the panel's "at start" box), which makes the hold lay 8
// subdivisions, against the CHANGELOG's figures for Extend on a 100 m piece ("about 1.5 times the head's change per metre ... at about 3.6 m"; "within 1 mm of
// the head's by 7 to 14 m ... and on it from ... 15 m"). Extend as shown, 100 m and 30 m, from E1, E4, E6 and the grab +4 at end-3 r5, with: nothing typed;
// a bank of 8 at start; a cup of 20 at start; an edge of 10 at start; a bank of 8 over the whole piece (no at start). One tree. usage: node atstart678.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (sculpt) => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain()); if (sculpt) s.setSculpt(true); return s; };
const HEADS = { E1: async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); return s; },
  E4: async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; },
  E6: async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; },
  'grab +4 end-3 r5': async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - 3, r: 5 }); s.brushTo({ w: 4 }); s.endBrush(); s.setSculpt(false); return s; } };
const TYPED = { 'nothing typed': {}, 'bank 8 at start': { bank: 8, atStart: { bank: true } }, 'cup 20 at start': { cup: 20, atStart: { cup: true } }, 'edge 10 at start': { edge: 10, atStart: { edge: true } }, 'bank 8, whole piece': { bank: 8 } };
const wpp = (P, x) => { const e = 0.05; return (D.channelValue(P, 'w', x + e) - 2 * D.channelValue(P, 'w', x) + D.channelValue(P, 'w', x - e)) / (e * e); };
(async () => {
  for (const length of [100, 30]) for (const [hn, mk] of Object.entries(HEADS)) for (const [tn, more] of Object.entries(TYPED)) {
    const s = await mk(), prev = doc(s).pieces.at(-1), a = D.pieceEnd(prev).w, n = doc(s).pieces.length; let err = null;
    try { s.extend(extendOptions({ ...BLANK, length, head: s.headState(), ...more })); } catch (e) { err = `${e.code}: ${e.message}`; }
    if (doc(s).pieces.length === n) { console.log(JSON.stringify({ length, head: hn, typed: tn, refused: (err || s.getState().message || '').slice(0, 120) })); continue; }
    const P = doc(s).pieces.at(-1); let swing = 0, at = 0, l1 = 0, l9 = 0, w2 = 0;
    for (let k = 0; k <= length * 100; k++) { const x = k / 100, d = D.channelValue(P, 'w', x) - a.v; if (Math.abs(d) > Math.abs(swing)) { swing = d; at = x; } if (Math.abs(d) > 1e-3) l1 = x; if (Math.abs(d) > 1e-9) l9 = x; }
    for (let x = 0.1; x < length - 0.1; x += 0.1) w2 = Math.max(w2, Math.abs(wpp(P, x)));
    const end = D.pieceEnd(P).w;
    console.log(JSON.stringify({ length, head: hn, typed: tn, slope: +a.m.toFixed(5), swingMm: +(1000 * swing).toFixed(1), at: +at.toFixed(2), factor: +(swing / a.m).toFixed(3), over1mmUntil: +l1.toFixed(2), over1e9Until: +l9.toFixed(2), w2: +w2.toExponential(3), knots: P.knots.length, firstKnots: P.knots.slice(0, 9), endIsHeadLevel: end.v === a.v && end.m === 0, joint: D.jointProblem(D.pieceEnd(prev), P, D.kindOf(prev)) }));
  }
})().catch((e) => { console.error('atstart678 failed:', e); process.exit(1); });
