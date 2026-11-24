// For each surviving mutant: a copy of src/ and tools/ with it applied, then drawn lists (more seeds, both gaps, plain and through a part-turning corner) laid on it,
// read as the rows read them. Prints the first list the mutant lays wrong (doc or built) for each, or "none in N".
'use strict';
const fs = require('fs'), path = require('path');
const T = 'G:/consonance-scratch/o-smooth-t180', W = 'G:/consonance-scratch/o-smooth-work/tmp';
const DEG = Math.PI / 180, LEN = 300, LEAD = 300, ROOM = 0.5;
const MUT = {
  B2: [['const lo = same > 0 ? Math.max(bot, FLOW_SIDE) : bot, hi = same < 0 ? Math.min(top, -FLOW_SIDE) : top;', 'const lo = bot, hi = top;']],
  B3: [['const FLOW_EVERY_M = 0.25;', 'const FLOW_EVERY_M = 2;']],
  B6: [["return w ? { fail: { kind: w.s <= U[4] + 1e-9 ? 'joint' : 'range', k: flowSteepest(all) } } : { piece: out };", 'return { piece: out };']],
  B36: [['const FLOW_EVERY_M = 0.25;', 'const FLOW_EVERY_M = 2;'], ["return w ? { fail: { kind: w.s <= U[4] + 1e-9 ? 'joint' : 'range', k: flowSteepest(all) } } : { piece: out };", 'return { piece: out };']],
  W2: [['if (w) throw flowRefusal(w, f.marks, opts.length, trial);\n    return;', 'return;']],
};
function copy(id) {
  const dir = path.join(W, 'surv-' + id); fs.rmSync(dir, { recursive: true, force: true });
  for (const d of ['src', 'tools']) fs.cpSync(path.join(T, d), path.join(dir, d), { recursive: true });
  const f = path.join(dir, 'src/core/extend.js'); let s = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  for (const [a, b] of MUT[id]) { if (s.split(a).length !== 2) throw new Error(id + ' not applied'); s = s.replace(a, () => b); }
  fs.writeFileSync(f, s); return dir;
}
function drawn(gap, count, seed) {
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) {
    const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: +(rnd() * 60 - 30).toFixed(2) * DEG }); }
    out.push({ first: { at: tr, target: +(rnd() * 60 - 30).toFixed(2) * DEG }, marks });
  }
  return out;
}
function wrongWith(read, L, v0) {
  const all = [{ at: 0, target: v0 }, L.first, ...L.marks].map((m) => ({ at: m.at, deg: m.target / DEG }));
  const hi = Math.max(...all.map((m) => m.deg)), lo = Math.min(...all.map((m) => m.deg));
  for (let s = 0; s <= LEN; s += 0.5) {
    const v = read(s);
    if (v > hi + ROOM || v < lo - ROOM) return `range ${v.toFixed(3)} at ${s}`;
    const j = all.findIndex((m) => m.at > s);
    if (j > 0) { const a = all[j - 1].deg, b = all[j].deg; if (a * b > 0 && Math.sign(v) === -Math.sign(a) && Math.abs(v) > 1e-6) return `sign ${v.toFixed(4)} at ${s}`; }
  }
  return null;
}
const id = process.argv[2], dir = copy(id);
const D = require(dir + '/src/core/document.js'), { extend } = require(dir + '/src/core/extend.js'), TB = require(dir + '/src/core/turnby.js'), A = require(dir + '/src/core/adapter.js');
const lead = extend(D.createDoc('s'), { length: LEAD, family: 'bowl', first: { w: 33 } });
const near = (S, s) => S.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a));
const ways = {
  plain: (o) => extend(lead, o),
  corner90: (o) => TB.extendCorner(lead, { ...o, turnDeg: 90 }),
  cornerS: (o) => TB.extendCorner(lead, { ...o, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] } }),
  cornerLate: (o) => TB.extendCorner(lead, { ...o, turnDeg: 0, changes: { turnDeg: [{ from: 150, deg: 90 }] } }),
};
let tried = 0;
for (const [wname, lay] of Object.entries(ways)) for (const [gap, seed] of [[5, 101], [5, 202], [20, 303], [10, 404], [40, 505]]) for (const L of drawn(gap, 120, seed)) {
  const o = { length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } };
  let d; try { d = lay(o); } catch (e) { if (!(e instanceof D.CoreError)) { console.log(id, wname, 'UNTYPED', e.message); process.exit(0); } continue; }
  tried++;
  const P = d.pieces[1], v0 = D.channelValue(d.pieces[0], 'phi', LEAD);
  const w1 = wrongWith((s) => D.channelValue(P, 'phi', s) / DEG, L, v0);
  const S = A.toPath(d, { step: 0.5 }).path.samples, w2 = w1 ? null : wrongWith((s) => near(S, LEAD + s).roll / DEG, L, v0);
  if (w1 || w2) { console.log(id, wname, 'gap', gap, 'seed', seed, w1 ? 'doc ' + w1 : 'built ' + w2, JSON.stringify({ first: [L.first.at, +(L.first.target / DEG).toFixed(2)], marks: L.marks.map((m) => [m.at, +(m.target / DEG).toFixed(2)]) })); process.exit(0); }
}
console.log(id, 'none in', tried, 'laid lists');
