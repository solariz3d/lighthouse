// poses.js (pane C, L259): for chosen [T2] sections, the read's pose along a lead-in and the section, and the Reference track nudge that puts
// the lead-in's first point on his start, facing his way. Local only (track data).
//   node poses.js <read.json> <kn5 copy> <from:to:lead> ...      e.g. 26185:26345:80
// THE PLACEMENT (app f3cd425): src/reference/ribbon.js placeAt; a layout with no AI line is placed by its kn5's AC_START_0 (position, forward =
// the world matrix's third row; src-tauri/src/kn5road.rs start_of), set down on the road under it (src/reference/road.js roadReference/groundUnder).
// world = local·R + t, t = anchor + d − start·R, R about up by th = h(start.T) − h(anchor.T) + yaw, h(v) = atan2(v.z, v.x).
// So a read point Q goes to (Q − start)·R + anchor + d, and d = (start − P)·R puts P on the anchor. His anchor: pos [0,0,0], T [0,0,1] (a new
// document: app/preview/preview.js refAnchor, src/core/document.js createDoc).
// The yaw is rounded to 0.01° FIRST and d computed from the rounded yaw, so the lead point lands on his start whatever the lap distance.
// The read is measure.js readRef's: ±12 m smoothed, metres along the smoothed line (the study's).
'use strict';
const fs = require('fs'), path = require('path');
const { readKn5 } = require(path.join(__dirname, 'tools', 'kn5.cjs'));
const M = require('./measure.js');
const [readFile, kn5File, ...specs] = process.argv.slice(2);
const read = JSON.parse(fs.readFileSync(readFile, 'utf8')), ref = M.readRef(read), S = ref.raw;
const DEG = 180 / Math.PI, wrap = (a) => ((a + 540) % 360) - 180;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
console.log(`read: ${ref.n} stations, walked ${read.walked_m} m, smoothed arc ${ref.arc[ref.n - 1].toFixed(0)} m, end ${read.end}, start dummy ${read.start}`);

const st = kn5File.endsWith('.json') ? JSON.parse(fs.readFileSync(kn5File, 'utf8')) : readKn5(kn5File).dummies.find((d) => /^AC_START_0$/i.test(d.name));
if (!st) throw new Error('no AC_START_0');
const sT = unit(st.fwd), s0 = [st.pos[0], S[0].c[1], st.pos[2]];   // set-down height: the read's first station (inferred: within cm)
console.log(`AC_START_0 at ${st.pos.map((v) => v.toFixed(2)).join(', ')}, forward ${sT.map((v) => v.toFixed(4)).join(', ')}; read station 0 centre ${S[0].c.join(', ')} (${Math.hypot(S[0].c[0] - st.pos[0], S[0].c[2] - st.pos[2]).toFixed(2)} m off in plan)`);
const h = (v) => Math.atan2(v[2], v[0]);
const at = (m) => { let k = 0; while (k < ref.n - 1 && ref.arc[k + 1] <= m) k++; return k; };
function pose(k) {
  const f = ref.T[k], n = ref.N[k];
  const heading = Math.atan2(f[0], f[2]) * DEG, pitch = Math.asin(Math.max(-1, Math.min(1, f[1]))) * DEG;
  const L = unit(cross([0, 1, 0], f)), U = unit(cross(f, L));
  return { k, m: ref.arc[k], heading, pitch, bank: -Math.atan2(dot(n, L), dot(n, U)) * DEG, up: S[k].up, width: ref.W[k] };   // bank + = left side up (the panel's sign)
}
const out = {};
for (const spec of specs) {
  const [from, to, lead] = spec.split(':').map(Number);
  const kL = at(from - lead), kF = at(from), kT = at(to);
  const P = ref.P[kL], fP = ref.T[kL];
  const yaw = Math.round(wrap((h(fP) - h(sT)) * DEG) * 100) / 100;
  const th = h(sT) - h([0, 0, 1]) + yaw / DEG, c = Math.cos(th), sn = Math.sin(th);
  const mul = (v) => [v[0] * c + v[2] * sn, v[1], -v[0] * sn + v[2] * c];   // row vector · R, R rows [c,0,-s],[0,1,0],[s,0,c]
  const d = mul(sub(s0, P)).map((v) => Math.round(v * 10) / 10);
  const placed = (Q) => { const r = mul(sub(Q, s0)); return [r[0] + d[0], r[1] + d[1], r[2] + d[2]]; };
  const pl = placed(P), fl = mul(fP);
  console.log(`\nsection ${from}-${to} m (${to - from} m), lead-in from ${ref.arc[kL].toFixed(0)} m:`);
  console.log(`  nudge: x ${d[0]}  z ${d[2]}  up ${d[1]}  turn ${yaw}  -> the lead point lands at ${pl.map((v) => v.toFixed(2)).join(', ')}, facing heading ${(Math.atan2(fl[0], fl[2]) * DEG).toFixed(2)} deg`);
  const e = [kL, kF, kT].map((k) => ({ ...pose(k), at: placed(ref.P[k]).map((v) => +v.toFixed(1)) }));
  for (const [name, p] of [['lead start', e[0]], ['section start', e[1]], ['section end', e[2]]])
    console.log(`  ${name.padEnd(13)} ${p.m.toFixed(0)} m: on his screen x ${p.at[0]} z ${p.at[2]} up ${p.at[1]}; heading ${wrap(p.heading - e[0].heading).toFixed(1)} from his start, pitch ${p.pitch.toFixed(1)}, bank ${p.bank.toFixed(1)}, up-angle ${p.up}, width ${p.width.toFixed(1)} m`);
  const span = (k0, k1) => { let mp = 0, mb = 0, mu = 0; for (let k = k0; k <= k1; k++) { const p = pose(k); mp = Math.max(mp, Math.abs(p.pitch)); mb = Math.max(mb, Math.abs(p.bank)); mu = Math.max(mu, p.up); } return `max |pitch| ${mp.toFixed(1)}, max |bank| ${mb.toFixed(1)}, max up-angle ${mu.toFixed(1)}`; };
  // the heading's run over the section, every 20 m: the shape he will see
  const hs = []; for (let m = from; m <= to; m += 20) hs.push(wrap(pose(at(m)).heading - e[1].heading).toFixed(0));
  console.log(`  lead-in: ${span(kL, kF)}; section: ${span(kF, kT)}; heading over the section every 20 m (from its start): ${hs.join(' ')}`);
  out[`${from}-${to}`] = { from, to, lead, leadAt: +ref.arc[kL].toFixed(1), nudge: { x: d[0], z: d[2], up: d[1], turn: yaw } };
}
fs.writeFileSync(path.join(__dirname, 'nudges.json'), JSON.stringify(out, null, 1));
