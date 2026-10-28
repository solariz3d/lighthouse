// sustained.js (D515, O): how LONG a replay holds a high load. loads.cjs's per-frame load and bottoming.cjs's h, exactly as they compute them;
// then, per threshold, the total time at or above it and the longest unbroken run (consecutive measured frames), and the longest run of the
// rigid-tyre box under the road.   node sustained.js <replay> [more]
'use strict';
const fs = require('fs'), path = require('path');
const { parseReplay, extractCar } = require('C:/Users/nname/Desktop/blackbox/ui/acreplay.js');
for (const file of process.argv.slice(2)) {
  const buf = fs.readFileSync(file), rep = parseReplay(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const ex = extractCar(rep, 0), N = ex.N, dt = ex.dt, P = ex.pos, Wh = ex.wheels, G = 9.81, W = 4, sm = new Float64Array(N * 3);
  for (let i = 0; i < N; i++) for (let k = 0; k < 3; k++) { let s = 0, n = 0; for (let j = Math.max(0, i - W); j <= Math.min(N - 1, i + W); j++) { s += P[j * 3 + k]; n++; } sm[i * 3 + k] = s / n; }
  const rows = [];
  for (let i = W + 2; i < N - W - 2; i++) {
    if (!ex.wheelsOk[i]) continue;
    const a = [0, 1, 2].map((k) => (sm[(i + 1) * 3 + k] - 2 * sm[i * 3 + k] + sm[(i - 1) * 3 + k]) / (dt * dt));
    const v = [0, 1, 2].map((k) => (sm[(i + 1) * 3 + k] - sm[(i - 1) * 3 + k]) / (2 * dt)), speed = Math.hypot(...v);
    if (speed < 5) continue;
    if (Math.hypot(...[0, 1, 2].map((k) => P[(i + 1) * 3 + k] - P[i * 3 + k])) > speed * dt * 3 + 1) continue;
    let n = [ex.nrm[i * 3], ex.nrm[i * 3 + 1], ex.nrm[i * 3 + 2]]; const nl = Math.hypot(...n) || 1; n = n.map((x) => x / nl);
    const load = (a[0] * n[0] + (a[1] + G) * n[1] + a[2] * n[2]) / G;
    const c = [0, 1, 2].map((k) => (Wh[i * 12 + k] + Wh[i * 12 + 3 + k] + Wh[i * 12 + 6 + k] + Wh[i * 12 + 9 + k]) / 4);
    const h = [0, 1, 2].reduce((s, k) => s + (P[i * 3 + k] - c[k]) * n[k], 0);
    rows.push({ i, load, h, kph: speed * 3.6 });
  }
  const longest = (test) => { let best = 0, run = 0, prev = -2, at = -1, start = -1; for (const r of rows) { if (test(r) && r.i === prev + 1 && run) run++; else run = test(r) ? 1 : 0; if (run === 1) start = r.i; prev = r.i; if (run > best) { best = run; at = start; } } return `${(best * dt).toFixed(2)} s${best ? ` (from t ${(at * dt).toFixed(2)})` : ''}`; };
  const max = rows.reduce((m, r) => (r.load > m.load ? r : m), { load: -Infinity });
  console.log(`${path.basename(file)}: ${rows.length} frames, dt ${dt.toFixed(4)}, max ${max.load.toFixed(2)} g at t ${(max.i * dt).toFixed(2)} (${max.kph.toFixed(0)} km/h)`);
  for (const th of [40, 50, 55, 60]) console.log(`  ≥ ${th} g: total ${(rows.filter((r) => r.load >= th).length * dt).toFixed(2)} s, longest unbroken ${longest((r) => r.load >= th)}`);
  console.log(`  rigid-tyre box under the road (h < -0.345): total ${(rows.filter((r) => r.h < -0.345).length * dt).toFixed(2)} s, longest unbroken ${longest((r) => r.h < -0.345)}`);
}
