// body616.js <replay> <track kn5> <car collider.kn5> <out.csv>: read-only. Every replay frame: the car's physics collision box placed in the world, then
//   down: each box vertex's height over the road it is above (a ray from 3 m above along the car's up, 10 m down, over physics road meshes 1ROAD*: the first
//         hit is that surface; height = t - 3, negative = the vertex is through the surface)
//   up:   from each box vertex along the car's up, 40 m, the first hit on ANY mesh (drawn or physics), and its name
//   plus the speed, gas and boost from the replay's telemetry tail (blackbox acreplay.js alignTelemetry), the piece under the car, and the wheel centres' heights.
// The box is placed with the model's wheel centres (HUB_* at y 0.395, x ±0.900, z ±1.715) fitted to the replay's recorded wheel centres each frame:
// fwd = front axle middle - rear axle middle, up = fwd x (wheels 0,2 - wheels 1,3) signed to agree with extractCar's normal (its winding is fixed over the lap), left = up x fwd; the box's origin from the quad's centre.
// (So suspension travel is the wheels' own: the box rides at its model height over the wheel plane. The body position the replay records is used as a check.)
'use strict';
const fs = require('fs');
const R = require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs');
const [RP, TRK, COL, OUT] = process.argv.slice(2);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a) || 1; return mul(a, 1 / l); };
// the box, deduplicated
const col = readKn5(COL).meshes[0], seen = new Set(), BOX = [];
for (let i = 0; i < col.pos.length; i += 3) { const v = [col.pos[i], col.pos[i + 1], col.pos[i + 2]], k = v.map((x) => x.toFixed(3)).join(','); if (!seen.has(k)) { seen.add(k); BOX.push(v); } }
const yLo = Math.min(...BOX.map((v) => v[1])), yHi = Math.max(...BOX.map((v) => v[1]));
const BOT = BOX.filter((v) => v[1] < yLo + 0.25), TOP = BOX.filter((v) => v[1] > yHi - 0.25);
console.log('box vertices', BOX.length, 'bottom set', BOT.length, 'top set', TOP.length, 'y', yLo, yHi);
// the track
const k = readKn5(TRK), C = 6, tris = [], gridR = new Map(), gridA = new Map();
const put = (g, key, id) => { let L = g.get(key); if (!L) g.set(key, L = []); L.push(id); };
for (const m of k.meshes) { const road = /^1ROAD/.test(m.name);
  for (let q = 0; q < m.idx.length; q += 3) { const t = [m.idx[q], m.idx[q + 1], m.idx[q + 2]].map((i) => [m.pos[i * 3], m.pos[i * 3 + 1], m.pos[i * 3 + 2]]); const id = tris.push({ t, name: m.name }) - 1;
    const lo = [0, 1, 2].map((c) => Math.floor(Math.min(t[0][c], t[1][c], t[2][c]) / C)), hi = [0, 1, 2].map((c) => Math.floor(Math.max(t[0][c], t[1][c], t[2][c]) / C));
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const key = x + ',' + y + ',' + z; put(gridA, key, id); if (road) put(gridR, key, id); } } }
function ray(grid, o, d, len) { const done = new Set(); let best = null;
  for (let u = 0; u <= len + C; u += C / 2) { const q = add(o, mul(d, Math.min(u, len))), key = [0, 1, 2].map((c) => Math.floor(q[c] / C)).join(',');
    for (const id of grid.get(key) || []) { if (done.has(id)) continue; done.add(id); const [a, b, c] = tris[id].t, e1 = sub(b, a), e2 = sub(c, a), p = cr(d, e2), det = dot(e1, p); if (Math.abs(det) < 1e-12) continue;
      const iv = 1 / det, tv = sub(o, a), uu = dot(tv, p) * iv; if (uu < 0 || uu > 1) continue; const qq = cr(tv, e1), vv = dot(d, qq) * iv; if (vv < 0 || uu + vv > 1) continue;
      const t = dot(e2, qq) * iv; if (t > 0 && t <= len && (!best || t < best.t)) best = { t, name: tris[id].name }; }
    if (best && best.t < u - C) break; }
  return best; }
// the replay and its telemetry
const buf = fs.readFileSync(RP), ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), rep = R.parseReplay(ab), ex = R.extractCar(rep, 0);
const tel = R.alignTelemetry(R.parseTelemetry(ab), ex.N, ex.dt);
console.log('frames', ex.N, 'dt', ex.dt, 'telemetry', tel.schema, tel.mode, 'boost channel', tel.has.boost);
const rows = ['frame,t,lapT,kph,gas,brake,boost,piece,road,bodyBottomMin,bodyBottomVertex,wheelMin,upMin,upMesh,hBodyOverWheels,bodyDevFromModel'];
const f0 = ex.laps.length ? ex.laps[0].frame : 0;
for (let i = 0; i < ex.N; i++) {
  if (!ex.wheelsOk[i]) continue;
  const W = [0, 1, 2, 3].map((w) => [ex.wheels[i * 12 + w * 3], ex.wheels[i * 12 + w * 3 + 1], ex.wheels[i * 12 + w * 3 + 2]]);   // FL FR RL RR
  const fwd = unit(sub(mul(add(W[0], W[1]), 0.5), mul(add(W[2], W[3]), 0.5))), left0 = unit(sub(mul(add(W[0], W[2]), 0.5), mul(add(W[1], W[3]), 0.5)));
  let up = unit(cr(fwd, left0)); if (dot(up, [ex.nrm[i * 3], ex.nrm[i * 3 + 1], ex.nrm[i * 3 + 2]]) < 0) up = mul(up, -1); const left = unit(cr(up, fwd)), Wc = mul(add(add(W[0], W[1]), add(W[2], W[3])), 0.25);
  const place = (v) => add(Wc, add(mul(left, v[0]), add(mul(up, v[1] - 0.395), mul(fwd, v[2]))));
  const body = [ex.pos[i * 3], ex.pos[i * 3 + 1], ex.pos[i * 3 + 2]], hB = dot(sub(body, Wc), up), dev = Math.hypot(...sub(body, place([0, 0.395, 0]))) ;
  let bmin = null, bv = null, road = '';
  for (const v of BOT) { const p = place(v), h = ray(gridR, add(p, mul(up, 3)), mul(up, -1), 10); if (!h) continue; const hh = h.t - 3; if (bmin === null || hh < bmin) { bmin = hh; bv = v; road = h.name; } }
  let wmin = null; for (const w of W) { const h = ray(gridR, add(w, mul(up, 3)), mul(up, -1), 10); if (h && (wmin === null || h.t - 3 < wmin)) wmin = h.t - 3; }
  let umin = null, umesh = ''; for (const v of TOP) { const p = place(v), h = ray(gridA, add(p, mul(up, 0.01)), up, 40); if (h && (umin === null || h.t < umin)) { umin = h.t; umesh = h.name; } }
  const piece = (road.match(/_(p\d+)_/) || [, ''])[1];
  rows.push([i, (i * ex.dt).toFixed(3), ((i - f0) * ex.dt).toFixed(3), tel.speed[i].toFixed(1), tel.gas[i].toFixed(3), tel.brake[i].toFixed(3), tel.boost[i].toFixed(3), piece, road, bmin === null ? '' : bmin.toFixed(4), bv ? bv.map((x) => x.toFixed(2)).join(' ') : '', wmin === null ? '' : wmin.toFixed(4), umin === null ? '' : umin.toFixed(3), umesh, hB.toFixed(4), dev.toFixed(4)].join(','));
}
fs.writeFileSync(OUT, rows.join('\n') + '\n'); console.log('rows', rows.length - 1);
