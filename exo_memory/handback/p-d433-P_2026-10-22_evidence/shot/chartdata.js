// chartdata.js: the numbers behind the two charts, from the same instruments as the tables (xsec.js's row read, bump.js's lines, wheels.js's replay read).
// Panel 1: the kn5's cross-section row at three stations (s 1000: plain; 2300: left lip, cup 0; 3300: left lip, cup 15) in the station frame.
// Panel 2: the road at the car's lateral line u = 8.4 through the joint, core and kn5, as height above the straight line through s 3250 and 3350; and run 2's body and wheel heights.
const fs = require('fs'), path = require('path'); const T = 'C:/Users/nname/Downloads/t180-wt-land413';
const D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), Prof = require(path.join(T, 'src/geom/profile.js'));
const doc = D.parse(fs.readFileSync(path.join(__dirname, '..', 'eq-TEST 10.t180track'), 'utf8')); const { segments, path: p } = AD.toPath(doc, { step: 2 }); const S = p.samples;
const g = require('../kn5grid.js')(T, path.join(__dirname, '..', 'out/t180b_test_10/t180b_test_10.kn5'));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const V = []; for (const m of g.road) for (let i = 0; i < m.pos.length / 3; i++) V.push([m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]]);
const G = 10, vg = new Map(); V.forEach((v, i) => { const k = Math.floor(v[0] / G) + ',' + Math.floor(v[2] / G); if (!vg.has(k)) vg.set(k, []); vg.get(k).push(i); });
function row(s) {
  const sm = S.find((x) => x.s === s); const near = new Set(); const gx = Math.floor(sm.pos[0] / G), gz = Math.floor(sm.pos[2] / G);
  for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) { const L = vg.get((gx + a) + ',' + (gz + b)); if (L) for (const i of L) near.add(i); }
  const out = []; for (const i of near) { const d = sub(V[i], sm.pos); if (Math.abs(dot(d, sm.T)) > 0.05) continue; const x = dot(d, sm.L), y = dot(d, sm.U); if (Math.abs(x) > 16 || Math.abs(y) > 8) continue; out.push([x, y]); }
  out.sort((a, b) => a[0] - b[0]); return out;
}
const xsec = [1000, 2300, 3300].map((s) => ({ s, row: row(s), mid: (row(s)[0][0] + row(s)[row(s).length - 1][0]) / 2 }));
const B = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'bump.json'), 'utf8')); const k = B.us.indexOf(8.4);
const r0 = B.rows.find((r) => r.s === 3280), r1 = B.rows.find((r) => r.s === 3300); const lin = (s) => r0.core[k] + (r1.core[k] - r0.core[k]) * (s - 3280) / 20;   // the road's own straight line before the joint, extended
const bump = B.rows.map((r) => ({ s: r.s, core: r.core[k] - lin(r.s), kn5: r.kn5[k] - lin(r.s) }));
const wheels = {};
for (const [run, file] of [['2', 'wheels-run2.out'], ['4', 'wheels-run4.out'], ['5', 'wheels-run5.out']]) {
  const lines = fs.readFileSync(path.join(__dirname, '..', file), 'utf8').split('\n').slice(1).filter((l) => /^\d/.test(l));
  wheels[run] = lines.map((l) => { const f = l.replace(/\|/g, ' ').trim().split(/\s+/); return { s: +f[1], u: +f[2], kph: +f[4], body: +f[5], FL: +f[6], FR: +f[7], RL: +f[8], RR: +f[9] }; }).filter((r) => r.s >= 3250 && r.s <= 3350);
}
fs.writeFileSync(path.join(__dirname, 'chart.json'), JSON.stringify({ xsec, bump, wheels }));
console.log('xsec rows', xsec.map((x) => `${x.s}: ${x.row.length} verts, mid ${x.mid.toFixed(3)}`).join(' | '), 'bump pts', bump.length, 'wheels', Object.entries(wheels).map(([r, w]) => r + ':' + w.length).join(' '));
