// joints.js <repo> <track copy>: the piece joints of the document (s, the bank there in degrees, from the path samples' frame), and the path's extent.
'use strict';
const path = require('path'), fs = require('fs'), os = require('os');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [REPO, T] = process.argv.slice(2);
const R = (p) => require(path.join(REPO, p)), D = R('src/core/document.js'), A = R('src/core/adapter.js');
const doc = D.parse(fs.readFileSync(T, 'utf8'));
const P = A.toPath(doc, { step: 2 }).path.samples;
console.log('sample keys', Object.keys(P[0]).join(','), 'n', P.length, 'last s', P[P.length - 1].s.toFixed(1));
const at = (s) => P.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a));
// bank = angle of the frame's U from world up, signed by L's height
const bank = (q) => { const u = q.U; return Math.sign(q.L[1] || 0) * Math.acos(Math.max(-1, Math.min(1, u[1]))) * 180 / Math.PI; };
let s = 0;
const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const q of P) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], q.pos[k]); hi[k] = Math.max(hi[k], q.pos[k]); }
console.log('extent lo', lo.map((x) => x.toFixed(0)).join(','), 'hi', hi.map((x) => x.toFixed(0)).join(','));
doc.pieces.forEach((p, i) => {
  const q = at(s), m = at(s + p.length / 2);
  console.log(`p${i} start s ${s.toFixed(0)} len ${p.length} bank@joint ${bank(q).toFixed(1)} bank@mid ${bank(m).toFixed(1)} pos ${q.pos.map((x) => x.toFixed(0)).join(',')}`);
  s += p.length;
});
