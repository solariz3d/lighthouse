'use strict';
// probe.js <tree>: O1 read, pane C. Lays turn/climb changes over a moving first ramp in the tree given, reads the BUILT path's rate change (the row file's builtPeak,
// copied), and prints one JSON line per case. Synthetic only.
const path = require('path'), crypto = require('crypto'), ROOT = process.argv[2];
const D = require(path.join(ROOT, 'src/core/document.js')), { extend } = require(path.join(ROOT, 'src/core/extend.js')), A = require(path.join(ROOT, 'src/core/adapter.js'));
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170), R = (x) => (x * DEG) / 100;
function builtPeak(d, a, b, pitch = false) {
  const S = A.toPath(d).path.samples; let prev = null, off = 0;
  const H = S.map((x) => { let v = pitch ? Math.asin(Math.max(-1, Math.min(1, x.T[1]))) : Math.atan2(x.T[2], x.T[0]); if (prev !== null) { while (v + off - prev > Math.PI) off -= 2 * Math.PI; while (v + off - prev < -Math.PI) off += 2 * Math.PI; } prev = v + off; return { s: x.s, v: v + off }; });
  const atS = (s) => { let lo = 0, hi = H.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (H[m].s <= s) lo = m; else hi = m; } const f = (s - H[lo].s) / (H[hi].s - H[lo].s); return H[lo].v + f * (H[hi].v - H[lo].v); };
  let m = 0; for (let s = a; s <= b; s += 0.5) m = Math.max(m, Math.abs(atS(s + 1) - 2 * atS(s) + atS(s - 1))); return m / BAR;
}
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex').slice(0, 16);
// one case: lead piece 200 m at `lead`, then a piece of L m typed `first`, opts extra (transition), changes list [[from, to], ...] in °/100m
function run(c) {
  const ch = c.ch || 'kh', d0 = extend(D.createDoc('g'), { length: 200, targets: { [ch]: R(c.lead) } });
  const opts = { length: c.L, targets: { [ch]: R(c.first) }, changes: { [ch]: c.changes.map(([from, to]) => ({ from, target: R(to) })) }, ...(c.opts || {}) };
  try { const d = extend(d0, opts); return { ...c, laid: true, peak: +builtPeak(d, 180, 200 + c.L + 20, ch === 'kv').toFixed(3), sha: sha(d) }; }
  catch (e) { return { ...c, laid: false, err: e.code, needM: e.needM === undefined ? null : +(+e.needM).toFixed(2), msg: e.message.slice(0, 200) }; }
}
const cases = [];
// A. a change mid-ramp, followed by a second change (the probe places the first as if it ended at the ramp's end)
for (const [first, t1, t2] of [[-80, -60, -70], [-80, -100, -90], [-60, -40, -50], [80, 60, 70], [-80, -60, -60.5]])
  for (const f1 of [100, 120, 140, 160]) for (const f2 of [200, 230, 260]) cases.push({ set: 'A', lead: 0, first, L: 300, changes: [[f1, t1], [f2, t2]] });
// A2. a single change whose first ramp is a transition shorter than the piece, the change ending after it
for (const tr of [150, 200, 250]) for (const f of [120, 160, 200]) cases.push({ set: 'A2', lead: 0, first: -80, L: 300, opts: { transition: tr }, changes: [[f, -60]] });
// B. the rows' own geometry, one change to the end, swept by mark (span = 300 - from)
for (const [ch, first, to] of [['kh', -80, -60], ['kh', -80, -75], ['kh', 80, 100], ['kv', -30, -20], ['kv', 20, 30], ['kh', -40, -20]])
  for (let f = 150; f <= 285; f += 5) cases.push({ set: 'B', ch, lead: 0, first, L: 300, changes: [[f, to]] });
// C. no first ramp (lead = first): must match the base byte for byte; varied values, both fields, two changes, a long piece
for (const [ch, v, to, L, f] of [['kh', 50, 70, 400, 380], ['kh', 50, 70, 400, 300], ['kh', -120, -100, 250, 200], ['kv', 15, 5, 300, 260], ['kv', 15, 5, 300, 290], ['kh', 0, 30, 500, 420]])
  cases.push({ set: 'C', ch, lead: v, first: v, L, changes: [[f, to]] });
cases.push({ set: 'C', ch: 'kh', lead: 30, first: 30, L: 600, changes: [[200, 50], [450, 20]] });
cases.push({ set: 'C', ch: 'kv', lead: -8, first: -8, L: 600, changes: [[250, 4], [560, 0]] });
for (const c of cases) console.log(JSON.stringify(run(c)));
