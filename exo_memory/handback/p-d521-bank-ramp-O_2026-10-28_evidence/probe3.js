// probe3.js (D521, O): why the gravity-frame roll's peak rate (bankrate.cjs's measure) reads above the bank channel's on a turning piece: the sample's own
// roll field, the gravity-frame roll from U, and φ, at a few stations of a 30° bank over 200 m with and without the 90° turn.
'use strict';
const path = require('path');
const T = process.env.T180_TREE;
const D = require(path.join(T, 'src/core/document.js'));
const { extend } = require(path.join(T, 'src/core/extend.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js'));
const DEG = Math.PI / 180;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
for (const kh of [0, (90 * DEG) / 200]) {
  let d = extend(D.createDoc('p3'), { length: 100 }); d = extend(d, { length: 200, targets: { phi: -30 * DEG, ...(kh ? { kh } : {}) } });
  const { path: P } = toPath(d, { step: 0.5 }); const rows = [];
  for (const m of P.samples) { if (m.s < 100) continue; const f = unit(m.T), Lg = unit(cr([0, 1, 0], f)), Ug = cr(f, Lg); rows.push({ s: m.s, g: Math.atan2(dot(m.U, Lg), dot(m.U, Ug)) / DEG, roll: m.roll / DEG, phi: D.valuesAt(d.pieces[1], Math.min(200, m.s - 100)).phi / DEG, grade: m.grade }); }
  let pg = 0, pp = 0; for (let i = 1; i < rows.length; i++) { const ds = rows[i].s - rows[i - 1].s; pg = Math.max(pg, Math.abs(rows[i].g - rows[i - 1].g) / ds); pp = Math.max(pp, Math.abs(rows[i].phi - rows[i - 1].phi) / ds); }
  console.log(`turn ${kh ? '90°' : 'none'}: peak gravity-frame roll rate ${pg.toFixed(3)} °/m, peak φ rate ${pp.toFixed(3)} °/m`);
  for (const s of [110, 150, 200, 250, 300]) { const r = rows.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a)); console.log(`  s ${r.s}: φ ${r.phi.toFixed(3)}°, sample roll ${r.roll.toFixed(3)}°, gravity-frame roll from U ${r.g.toFixed(3)}°, grade ${Number(r.grade).toFixed(4)}`); }
}
