'use strict';
// q5: over laid drawn lists (probe5's generator, seed 11, gap 5 and 20), how far the BUILT road is from each mark at the mark (the document meets them), and whether the adapter re-rounded the piece
const D = require('./t/src/core/document.js'), { extend } = require('./t/src/core/extend.js'), RP = require('./t/test/roll_profile.js');
const KH = +process.argv[2] || 0; const DEG = Math.PI / 180, LEN = 300;
const lead = extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) {
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) {
    const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks });
  }
  return out;
}
for (const gap of [5, 20]) {
  const miss = [], ex = []; let laid = 0;
  for (const L of drawn(gap, 160)) {
    let doc; try { doc = extend(lead, { length: LEN, targets: { phi: L.first.target, kh: KH }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks } }); } catch (e) { continue; }
    laid++; const B = RP.builtBank(doc, 0.5);
    let worst = 0, wm = null; for (const m of [L.first, ...L.marks]) { const d = Math.abs(RP.near(B, 300 + m.at).v - m.target / DEG); if (d > worst) { worst = d; wm = m; } }
    miss.push(worst); if (worst > 5 && ex.length < 3) ex.push([L.first, ...L.marks].map((m) => `${m.at}:${(m.target / DEG).toFixed(1)}`).join(' ') + ` | worst mark ${wm.at} m asks ${(wm.target / DEG).toFixed(1)}, road ${RP.near(B, 300 + wm.at).v.toFixed(2)}`);
  }
  const s = [...miss].sort((a, b) => a - b), c = (x) => miss.filter((d) => d > x).length;
  console.log(`gap ${gap}: laid ${laid}; built road's worst miss at a mark: median ${s[s.length >> 1].toFixed(2)}°, max ${s[s.length - 1].toFixed(2)}°; lists missing a mark by > 1°: ${c(1)}, > 5°: ${c(5)}, > 10°: ${c(10)}`);
  ex.forEach((x) => console.log('  ' + x));
}
