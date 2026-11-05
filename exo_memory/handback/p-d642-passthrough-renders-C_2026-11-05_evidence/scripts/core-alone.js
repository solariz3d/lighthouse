// core_changes.test.js: node --test test/core_changes.test.js. L139, MORE THAN ONE CHANGE PER FIELD (the keeper, 2026-11-05 00:34: "We could just build the second move
// feature before. Remember its more than just the banking, its the turns, climb, etc."; 06:49Z: "what if i want the climb to change more than once per piece, the same with
// turns? With turns you can create multiple snaking curves with one piece"). extend(..., { changes: { kh|kv|phi|w|c|e|er: [{ from, target }, ...] } }) and, read as
// corners, extendCorner(..., { turnDeg, changes: { turnDeg: [{ from, deg }, ...] } }). The bar is pane E's registration (lighthouse exo_memory/loop/
// l139_registration_2026-11-05.md, fc21dcdd, and the plan's "AMENDED AGAIN"): each change holds the value before it to its own mark within 1% of its change (docLeak),
// the minimums are E's (A) and refused by name, the S and the snake end straight on their heading, no change leaves the bytes as they were.
'use strict';
const crypto = require('crypto');
const D = require('../src/core/document.js');
const X = require('../src/core/extend.js');
const { extend } = X;
const A = require('../src/core/adapter.js');
const TB = require('../src/core/turnby.js');

const DEG = Math.PI / 180, ROUTE_BAR = 29.4 / (10 * 170 * 170);
const flat = () => extend(D.createDoc('g'), { length: 1000, family: 'bowl' });
const head = (d) => d.pieces[d.pieces.length - 1];
const at = (d, ch, s) => D.channelAt(head(d), ch, s).v;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
/** docLeak (E's M1): the most a channel moves before `upTo` against the same piece without that change, every 0.5 m. */
function builtRollPeak(d, a, b) {
  const S = A.toPath(d).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; };
const BANK_BAR = 29.4 / (10 * 170 * 170);
const { extendOptions } = require('../app/core/panel.js');
/** The built road's roll acceleration (the adapter's roll, 2 m second differences, as joints() b reads it), peak over [a, b] in track metres, ÷ the bar. */
  let m = 0; for (let s = a; s <= b; s += 0.5) m = Math.max(m, Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4); return m / BANK_BAR;
}
/** The built heading's (or pitch's) second difference over 1 m, peak over [a, b], ÷ the bar (pane E's l139slope.js reader). */
function builtTurnPeak(d, a, b, pitch = false) {
  const S = A.toPath(d).path.samples; let prev = null, off = 0;
  const H = S.map((x) => { let v = pitch ? Math.asin(Math.max(-1, Math.min(1, x.T[1]))) : Math.atan2(x.T[2], x.T[0]); if (prev !== null) { while (v + off - prev > Math.PI) off -= 2 * Math.PI; while (v + off - prev < -Math.PI) off += 2 * Math.PI; } v += off; prev = v; return { s: x.s, v }; });
  const atS = (s) => { let lo = 0, hi = H.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (H[m].s <= s) lo = m; else hi = m; } const f = (s - H[lo].s) / (H[hi].s - H[lo].s); return H[lo].v + f * (H[hi].v - H[lo].v); };
  let m = 0; for (let s = a; s <= b; s += 0.5) m = Math.max(m, Math.abs(atS(s + 1) - 2 * atS(s) + atS(s - 1))); return m / BANK_BAR;
}
// R2 case 1, the core alone (no panel): his 11-05 picture on 750 m, -90 corner, bank 66.14 then 0, cup 15.5; the change's from swept; the built roll peak, as the row reads it
const DEGc = Math.PI / 180, base = { step: 66.14 * DEGc, length: 750 };
const min0 = X.secondMinM('phi', 66.14 * DEGc, 0), minB = X.secondMinM('phi', 66.14 * DEGc, 0, base);
console.log(`core minimum without base ${min0.toFixed(1)} m, with base ${minB.toFixed(1)} m`);
for (const F of [300, 350, 400, 430, 450, 477.42]) {
  const o = { length: 750, turnDeg: -90, targets: { phi: 66.14 * DEGc, c: 15.5 }, bankShape: 'rounded', changes: { phi: [{ from: F, target: 0 }] } };
  let pk; try { const d = extend(TB.extendCorner(flat(), o), { length: 200 }); pk = builtRollPeak(d, 1000 + F - 20, 1750 + 20).toFixed(3); } catch (e) { pk = `refused (${e.code}: ${String(e.message).slice(0, 160)})`; }
  console.log(`from ${F} (segment ${(750 - F).toFixed(1)} m): built roll peak ${pk} × the bar`);
}
