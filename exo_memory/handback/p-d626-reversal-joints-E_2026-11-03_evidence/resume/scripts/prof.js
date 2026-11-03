// usage (from a checkout): node prof.js — a 20,000 m turning piece after a 100 m straight, rebuilt as a turn drag would (a new piece object each time, its kh
// nudged): the mean time of toSegments, of bankPlan alone, and of the docSamples-like sampling, over 20 rebuilds
const path = require('path'), R = process.cwd();
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js')), { extend } = require(path.join(R, 'src/core/extend.js'));
let d = extend(extend(D.createDoc('p'), { length: 100, family: 'bowl' }), { length: 20000, targets: { kh: 1 / 5000 } });
const t = (f) => { const a = process.hrtime.bigint(); f(); return Number(process.hrtime.bigint() - a) / 1e6; };
let seg = 0, plan = 0;
for (let i = 0; i < 20; i++) {
  const P = d.pieces[1], c = P.channels.kh.slice(); c[Math.floor(c.length / 2)] *= 1 + 1e-4 * (i + 1);
  const e = { ...d, pieces: d.pieces.map((Q, k) => (k === 1 ? { ...Q, channels: { ...Q.channels, kh: c } } : Q)) };
  if (A.bankPlan) plan += t(() => A.bankPlan(e));
  seg += t(() => A.toSegments(e));
}
console.log(`${R.split(/[\/]/).pop()}: toSegments ${(seg / 20).toFixed(1)} ms, bankPlan ${(plan / 20).toFixed(1)} ms (mean of 20)`);
