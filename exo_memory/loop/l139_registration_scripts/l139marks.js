// L139 amendment (pane E): one mark per field. (1) a 1,000 m piece banking 30°, turning 1/300 and climbing 4°/100 m over 120 m first ramps, with three second
// changes at their own marks: bank → 0 from 700 (70%), turn → −1/300 from 550 (55%), climb → 0 from 800 (80%), laid in that order by the emulator of
// l139scan.js (secondRamp generalised: knots inserted over [F, L], that channel alone refitted). Each channel must hold its first value up to its OWN mark:
// measured on the document (channelAt) and on the built road (roll, kvec·L, kvec·U) against the same piece with no second change, over [0, its from].
// Also each order of laying (6 permutations): the emulator inserts knots per channel, which re-quantises the OTHER channels around the new knots.
// (2) his 11-05 picture's piece (turn −90° as a corner, bank +66.14°, cup 15.5, then bank 0 at the panel's default from), length ASSUMED 750 m (the picture
// does not show it): the built bank's peak acceleration at the end joint against BANK_BAR (the L136 M5 carry).
'use strict';
const path = require('path'), W = process.argv[2];
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: L139 marks' });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const D = require(path.join(W, 'src/core/document.js')), X = require(path.join(W, 'src/core/extend.js')), A = require(path.join(W, 'src/core/adapter.js')), T = require(path.join(W, 'src/core/turnby.js'));
const { extend, channelFn, fitWithHold, C2_CHANNELS } = X;
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const flat = () => extend(D.createDoc('e'), { length: 1000, family: 'bowl' });
function endC2(piece, ch) { const P = piece.channels[ch], n = P.length, L = piece.length, U = D.knotVector(piece), dec = D.DEC[ch]; if (n < 5) return; const qe = (3 * (P[n - 1] - P[n - 2])) / (L - U[n - 1]); P[n - 3] = Number((P[n - 2] - (qe * (L - U[n - 2])) / 3).toFixed(dec)) + 0; }
function addSecond(P, st, t1, Lt, ch, F, T2) {
  const L = P.length, f1 = channelFn(st, t1, Lt, ch, null), f2 = channelFn({ v: t1, m: 0 }, T2, L - F, ch, null);
  const ts = []; for (let j = 0; j < 8; j++) ts.push(+(F + ((L - F) * j) / 8).toFixed(4));
  const add = [...new Set(ts)].filter((k) => k > 0.5 && k < L - 0.5 && P.knots.every((h) => Math.abs(h - k) > 1e-3));
  const out = add.length ? D.insertKnots(P, add) : P, U = D.knotVector(out), n = out.channels[ch].length, keep = new Set();
  for (let i = 0; i < n; i++) if (U[i + 4] <= F + 1e-9) keep.add(i);
  fitWithHold(out, ch, (s) => (s < F ? f1(s) : f2(s - F)), Infinity, T2, keep);
  if (C2_CHANNELS.has(ch)) endC2(out, ch);
  return out;
}
const opts = { length: 1000, targets: { phi: 30 * DEG, kh: 1 / 300, kv: 4 * DEG / 100 }, transition: 120 };
const SEC = { phi: { from: 700, target: 0 }, kh: { from: 550, target: -1 / 300 }, kv: { from: 800, target: 0 } };
const built = (doc) => A.toPath(doc).path.samples.map((x) => ({ s: x.s, phi: x.roll / DEG, kh: dot(x.kvec, x.L), kv: dot(x.kvec, x.U) }));
const perms = [['phi', 'kh', 'kv'], ['phi', 'kv', 'kh'], ['kh', 'phi', 'kv'], ['kh', 'kv', 'phi'], ['kv', 'phi', 'kh'], ['kv', 'kh', 'phi']];
const plain = extend(extend(flat(), opts), { length: 200 }), Pp = plain.pieces[1], Bp = built(plain), st = D.endState(flat());
const out = { order: {} };
for (const order of perms) {
  let P = extend(flat(), opts).pieces[1];
  for (const ch of order) P = addSecond(P, st[ch], opts.targets[ch], 120, ch, SEC[ch].from, SEC[ch].target);
  const doc = extend(D.appendPiece(flat(), P), { length: 200 }), Pa = doc.pieces[1], Ba = built(doc), row = {};
  for (const ch of ['phi', 'kh', 'kv']) {
    const F = SEC[ch].from; let dl = 0; for (let s = 0; s <= F; s += 0.25) dl = Math.max(dl, Math.abs(D.channelAt(Pa, ch, s).v - D.channelAt(Pp, ch, s).v));
    let bl = 0; for (let k = 0; k < Ba.length; k++) { const s = Ba[k].s; if (s < 1000 || s > 1000 + F) continue; bl = Math.max(bl, Math.abs(Ba[k][ch] - Bp[k][ch])); }
    const e = D.channelAt(Pa, ch, 1000);
    row[ch] = { docLeak: +dl.toPrecision(3), builtLeak: +bl.toPrecision(3), end: +e.v.toPrecision(4), endSlope: +e.d1.toPrecision(3) };
  }
  out.order[order.join('>')] = row;
}
{ const { extendOptions } = require(path.join(W, 'app/core/panel.js'));
  const o = extendOptions({ length: '750', turn: '-90', climb: '', bank: '66.14', width: '', cup: '15.5', edge: '', start: '', tube: '', atStart: {}, turnAs: 'corner', thenBank: '0', bankFrom: '' });
  let d; try { d = extend(T.extendCorner(flat(), o), { length: 200 }); } catch (e) { out.picture = { refused: `${e.code}: ${e.message}` }; }
  if (d) { const S = A.toPath(d).path.samples, r = (s) => S[Math.round(s / (S[1].s - S[0].s))].roll / DEG; let pk = 0, at = 0; for (let s = 1000 + o.second.phi.from - 50; s <= 1950; s += 2) { const a = Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4; if (a > pk) { pk = a; at = s - 1000; } }
    out.picture = { second: o.second, peak: +pk.toFixed(5), at, bar: +(BAR / DEG).toFixed(5), builtAtEnd: +r(1750).toFixed(3) }; }
}
console.log(JSON.stringify(out, null, 1));
