// Part 2's falsifier: row 5 (no overshoot) failed with λ = 0. Sweep FLOW_TENSION and read row 5's two measures, the rate bars, the halts and the bending.
// usage: node tension_sweep.js <tree>   (loads the tree's extend.js with the constant replaced, as a module in the same folder; nothing on disk is changed)
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const T = process.argv[2], fs = require('fs'), path = require('path'), Module = require('module');
const file = path.join(T, 'src/core/extend.js'), src = fs.readFileSync(file, 'utf8');
const D = require(T + '/src/core/document.js'), RP = require(T + '/test/roll_profile.js'), DEG = Math.PI / 180;
const MARKS = [{ at: 0, deg: 0 }, { at: 80, deg: -20 }, { at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
for (const lam of [0, 1e-4, 3e-4, 1e-3, 2e-3, 3e-3, 5e-3, 1e-2, 3e-2]) {
  const m = new Module(file, module); m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file));
  m._compile(src.replace(/const FLOW_TENSION = [^;]+;/, `const FLOW_TENSION = ${lam};`).replace(/const FLOW_PEAK_REST = [^;]+;/, `const FLOW_PEAK_REST = ${process.env.PEAK || "false"};`), file);
  const { extend } = m.exports;
  const lead = extend(D.createDoc('s'), { length: 300, family: 'bowl', first: { w: 33 } });
  const d = extend(lead, { length: 300, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.slice(2).map((x) => ({ at: x.at, target: x.deg * DEG })) } });
  const p = RP.docBank(d.pieces[1]);
  let over = 0, where = null;
  for (let k = 0; k + 1 < MARKS.length; k++) {
    const a = MARKS[k], b = MARKS[k + 1], lo = Math.min(a.deg, b.deg), hi = Math.max(a.deg, b.deg);
    for (const x of p.filter((x) => x.s >= a.at && x.s <= b.at)) { const o = Math.max(lo - x.v, x.v - hi); if (o > over) { over = o; where = x.s; } }
  }
  const peak = (c) => Math.max(...RP.rateOn(p, c).map((x) => Math.abs(x.r)));
  let acc = 0; for (let s = 0; s <= 300; s += 0.5) acc = Math.max(acc, Math.abs(D.channelAt(d.pieces[1], 'phi', s).d2) / DEG);
  console.log(`λ ${String(lam).padEnd(6)} past a segment's range by at most ${over.toFixed(3)}° (at ${where}); rate peaks 30/20/8 m ${peak(30).toFixed(3)}/${peak(20).toFixed(3)}/${peak(8).toFixed(3)} °/m; roll acceleration peak ${acc.toFixed(4)} °/m²`);
}
