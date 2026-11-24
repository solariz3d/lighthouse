// For a surviving mutant: lay the same drawn lists on the real code and on the mutant; print the first list whose outcome differs (laid / refused, or the laid
// bank more than 1e-9 rad apart anywhere on a 0.25 m read), with which side did what. Reuses survivor_search.js's copy and its drawn lists.
'use strict';
const fs = require('fs'), path = require('path');
const T = 'G:/consonance-scratch/o-smooth-t180', W = 'G:/consonance-scratch/o-smooth-work/tmp', DEG = Math.PI / 180, LEN = 300, LEAD = 300;
const id = process.argv[2], dir = path.join(W, 'surv-' + id);
const load = (root) => { const D = require(root + '/src/core/document.js'); return { D, X: require(root + '/src/core/extend.js'), TB: require(root + '/src/core/turnby.js') }; };
const real = load(T), mut = load(dir);
function drawn(gap, count, seed) {
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) {
    const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: +(rnd() * 60 - 30).toFixed(2) * DEG }); }
    out.push({ first: { at: tr, target: +(rnd() * 60 - 30).toFixed(2) * DEG }, marks });
  }
  return out;
}
const lay = (M, wname, o) => {
  const lead = M.lead || (M.lead = M.X.extend(M.D.createDoc('s'), { length: LEAD, family: 'bowl', first: { w: 33 } }));
  const f = { plain: () => M.X.extend(lead, o), corner90: () => M.TB.extendCorner(lead, { ...o, turnDeg: 90 }) }[wname];
  try { return { d: f() }; } catch (e) { if (!(e instanceof M.D.CoreError)) return { untyped: e.message }; return { refused: e.message.slice(0, 120) }; }
};
let n = 0, apart = 0;
for (const wname of (process.argv[3] || 'plain,corner90').split(',')) for (const [gap, seed] of [[5, 11], [20, 23], [5, 101], [5, 202], [20, 303], [10, 404], [40, 505], [5, 606], [10, 707]]) for (const L of drawn(gap, 120, seed)) {
  const o = { length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } };
  const a = lay(real, wname, o), b = lay(mut, wname, o); n++;
  let diff = null;
  if (!!a.d !== !!b.d) diff = a.d ? 'real lays, mutant refuses: ' + (b.refused || b.untyped) : 'real refuses (' + (a.refused || a.untyped) + '), mutant lays';
  else if (a.d) { let m = 0; for (let s = 0; s <= LEN; s += 0.25) m = Math.max(m, Math.abs(real.D.channelValue(a.d.pieces[1], 'phi', s) - mut.D.channelValue(b.d.pieces[1], 'phi', s))); if (m > 1e-9) diff = 'both lay, ' + m.toExponential(2) + ' rad apart'; }
  if (diff && diff.startsWith('both')) { apart++; diff = null; }
  if (diff) { console.log(id, wname, 'gap', gap, 'seed', seed, diff, JSON.stringify({ first: [L.first.at, +(L.first.target / DEG).toFixed(2)], marks: L.marks.map((m) => [m.at, +(m.target / DEG).toFixed(2)]) })); process.exit(0); }
}
console.log(id, 'no laid/refused difference in', n, 'lists;', apart, 'laid both ways a little apart');
