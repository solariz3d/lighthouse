// L6: over the reader's drawn lists still refused after the knots (seed 11, 5 and 20 m floors), the first try's refusal against the last try's (flowSolve's fail)
'use strict';
const path = require('path'), R = 'G:/consonance-scratch/o-smooth-t180', D = require(R + '/src/core/document.js'), EX = require(R + '/src/core/extend.js');
const DEG = Math.PI / 180, LEN = 300, lead = EX.extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
function drawn(gap, count, seed = 11) { const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648), out = [];
  for (let k = 0; k < count; k++) { const tr = +(20 + rnd() * 80).toFixed(1), nm = 1 + Math.floor(rnd() * 3), marks = []; let at = tr;
    for (let i = 0; i < nm; i++) { at = +(at + gap + rnd() * 40).toFixed(1); if (at > LEN) break; marks.push({ at, target: (rnd() * 60 - 30) * DEG }); }
    out.push({ first: { at: tr, target: (rnd() * 60 - 30) * DEG }, marks }); } return out; }
// the same call on a copy whose flowBank throws the first try's refusal (mutant L6)
const fs = require('fs'), C = 'G:/consonance-scratch/o-smooth-work/tmp/l6'; fs.rmSync(C, { recursive: true, force: true }); for (const d of ['src', 'tools']) fs.cpSync(path.join(R, d), path.join(C, d), { recursive: true });
const f = C + '/src/core/extend.js'; fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('  throw flowRefusal(fail, marks, piece.length, trial);', '  throw flowRefusal(r.fail, marks, piece.length, trial);'));
const D2 = require(C + '/src/core/document.js'), EX2 = require(C + '/src/core/extend.js'), lead2 = EX2.extend(D2.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } });
const msg = (E, ld, L, more) => { try { E.extend(ld, { length: LEN, targets: { phi: L.first.target }, transition: { phi: L.first.at }, bankShape: 'flow', through: { phi: L.marks }, ...more }); return null; } catch (e) { return e.message; } };
for (const gap of [5, 20]) drawn(gap, 160).forEach((L, i) => { for (const more of [{ roomSearch: false }, {}]) { const a = msg(EX, lead, L, more), b = msg(EX2, lead2, L, more); if (a && a !== b) console.log(`gap ${gap} list ${i} ${JSON.stringify(more)}\n  last:  ${a}\n  first: ${b}`); } });
console.log('done');
