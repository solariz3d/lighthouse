// probe.js (D622, O): read-only. Near the p38/p41 crossing of a kn5: the p38-named meshes and the lower surfaces within R, with their extents, mean normals,
// and the nearest point of each; plus the whole track's extent. node probe.js <kn5> [R]
'use strict';
require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/winhide.js');
const { readKn5Full } = require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-36313935/c88002b1-74d8-4036-8cc0-f64aefbeabff/scratchpad/d593/kn5full.js');
const [, , KN5, RS = '30'] = process.argv, R = +RS, O = [38.5, 27, -474];
const kn = readKn5Full(KN5);
const f = (x) => x.toFixed(2);
const all = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity];
for (const m of kn.meshes) {
  if (!(m.renderable && m.visible)) continue;
  const P = m.pos, n = P.length / 3;
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) { all[c * 2] = Math.min(all[c * 2], P[i * 3 + c]); all[c * 2 + 1] = Math.max(all[c * 2 + 1], P[i * 3 + c]); }
  let cnt = 0; const box = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity], nm = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    const p = [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]];
    if (Math.hypot(p[0] - O[0], p[1] - O[1], p[2] - O[2]) > R) continue;
    cnt++; for (let c = 0; c < 3; c++) { box[c * 2] = Math.min(box[c * 2], p[c]); box[c * 2 + 1] = Math.max(box[c * 2 + 1], p[c]); nm[c] += m.nrm[i * 3 + c]; }
  }
  if (!cnt) continue;
  const l = Math.hypot(...nm) || 1;
  console.log(`${m.name.padEnd(34)} n ${String(cnt).padStart(5)}  x ${f(box[0])}..${f(box[1])}  y ${f(box[2])}..${f(box[3])}  z ${f(box[4])}..${f(box[5])}  meanN ${nm.map((v) => f(v / l)).join(',')}  mat ${kn.materials[m.material] && kn.materials[m.material].name}`);
}
console.log('track extent', all.map(f).join(' '));
