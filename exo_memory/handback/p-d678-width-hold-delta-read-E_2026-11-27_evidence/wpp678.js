// wpp678.js (pane E, D678 Track 2): the held width's largest |w''| three ways, against the CHANGELOG's bend figures (c2591bf..1074d5d): B's measure (bend268.js,
// as d678.js's mostB: every 0.1 m, a central difference of 0.05 m), the fine one (d678.js's mostFine: every 0.01 m up to 40 m, a difference of 0.01 m), and the
// spline's own: a cubic's w'' is linear between knots, so its largest |w''| is at a knot (or the piece's ends); read there one-sided from each side by
// (f(k) - 2 f(k -/+ e) + f(k -/+ 2e)) / e^2 at e = 1e-3 and 1e-4 (the two must agree, or the figure is not converged). The brushed piece's own the same three
// ways, and the ratios. Heads: E4 (the app's brush +5 at end-30, r 40), E6 (Sculpt's grab +2 at end-10, r 20), grab +4 at end-3, r 5. Callers through the shell
// with the panel's extendOptions: Extend 100, 30, 15 and 10 m; Sharp -60 R40 ramp 8, 90 R150 ramp 4, -60 R40 ramp 1. usage: node wpp678.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (sculpt) => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain()); if (sculpt) s.setSculpt(true); return s; };
const HEADS = { 'E4 brush +5 end-30 r40': async () => { const s = await sh(); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; },
  'E6 grab +2 end-10 r20': async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; },
  'grab +4 end-3 r5': async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - 3, r: 5 }); s.brushTo({ w: 4 }); s.endBrush(); s.setSculpt(false); return s; } };
const opts = (s, length = 100) => extendOptions({ ...BLANK, length, head: s.headState() });
const CALLERS = [['extend 100', (s) => s.extend(opts(s, 100))], ['extend 30', (s) => s.extend(opts(s, 30))], ['extend 15', (s) => s.extend(opts(s, 15))], ['extend 10', (s) => s.extend(opts(s, 10))],
  ['sharp -60 R40 ramp8', (s) => s.extendSharp(opts(s), { deg: -60, R: 40, ramp: 8 })], ['sharp 90 R150 ramp4', (s) => s.extendSharp(opts(s), { deg: 90, R: 150, ramp: 4 })],
  ['sharp -60 R40 ramp1', (s) => s.extendSharp(opts(s), { deg: -60, R: 40, ramp: 1 })]];
const wAt = (P, x) => D.channelValue(P, 'w', x), wpp = (P, x, e) => (wAt(P, x + e) - 2 * wAt(P, x) + wAt(P, x - e)) / (e * e);
const mostB = (P) => { let m = 0; for (let x = 0.1; x < P.length - 0.1; x += 0.1) m = Math.max(m, Math.abs(wpp(P, x, 0.05))); return m; };
const mostFine = (P, upTo) => { let m = 0; for (let x = 0.02; x < Math.min(P.length - 0.02, upTo); x += 0.01) m = Math.max(m, Math.abs(wpp(P, x, 0.01))); return m; };
const atKnots = (P, e) => { const L = P.length, ks = [0, ...P.knots.filter((k) => k > 0 && k < L), L]; let m = 0, at = 0;
  for (const k of ks) { const sides = []; if (k - 2 * e >= 0) sides.push((wAt(P, k) - 2 * wAt(P, k - e) + wAt(P, k - 2 * e)) / (e * e)); if (k + 2 * e <= L) sides.push((wAt(P, k) - 2 * wAt(P, k + e) + wAt(P, k + 2 * e)) / (e * e));
    for (const v of sides) if (Math.abs(v) > m) { m = Math.abs(v); at = k; } } return { m, at }; };
(async () => {
  { const f = (x) => 3 * x * x * x - 2 * x * x, e4 = 1e-4, k = 1.5; console.log('CONTROL one-sided second derivative of 3x^3-2x^2 at 1.5 (exact 23): left', ((f(k) - 2 * f(k - e4) + f(k - 2 * e4)) / (e4 * e4)).toFixed(4), 'right', ((f(k) - 2 * f(k + e4) + f(k + 2 * e4)) / (e4 * e4)).toFixed(4)); }
  for (const [hn, mk] of Object.entries(HEADS)) {
    const s0 = await mk(), prev = doc(s0).pieces.at(-1), own = { B: mostB(prev), k3: atKnots(prev, 1e-3).m, k4: atKnots(prev, 1e-4).m };
    console.log(JSON.stringify({ head: hn, slope: +D.pieceEnd(prev).w.m.toFixed(5), brushedOwn: { B: +own.B.toPrecision(5), knots1e3: +own.k3.toPrecision(5), knots1e4: +own.k4.toPrecision(5) } }));
    for (const [cn, call] of CALLERS) {
      const s = await mk(), n = doc(s).pieces.length; let err = null; try { call(s); } catch (e) { err = `${e.code}: ${String(e.message).slice(0, 100)}`; }
      if (doc(s).pieces.length === n) { console.log(JSON.stringify({ head: hn, caller: cn, refused: err || s.getState().message })); continue; }
      const P = doc(s).pieces[n], B = mostB(P), F = mostFine(P, 40), k3 = atKnots(P, 1e-3), k4 = atKnots(P, 1e-4);
      console.log(JSON.stringify({ head: hn, caller: cn, length: P.length, firstKnots: P.knots.slice(0, 6), B: +B.toPrecision(5), fine: +F.toPrecision(5), knots1e3: +k3.m.toPrecision(5), knots1e4: +k4.m.toPrecision(5), at: +k4.at.toFixed(4),
        ratioB: +(B / own.B).toFixed(3), ratioKnots: +(k4.m / own.k4).toFixed(3) }));
    }
  }
})().catch((e) => { console.error('wpp678 failed:', e); process.exit(1); });
