// aitan.js <repo> <fast_lane.ai>: |t x up| = the horizontal length of the unit tangent, read from the POINT POSITIONS (as AC recomputes it), three ways:
// forward (k -> k+1), backward (k-1 -> k), central (k-1 -> k+1); the smallest of each, where, and how many points fall under 1e-4. Reads only.
const fs = require('fs'), path = require('path'); const { readAiLine } = require(path.resolve(process.argv[2]) + '/src/export/ailine.js');
const l = readAiLine(fs.readFileSync(process.argv[3])), P = l.points.map((p) => p.pos), n = P.length;
const h = (a, b) => { const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d); return Math.hypot(d[0], d[2]) / L; };
for (const [name, f] of [['forward', (k) => h(P[k], P[(k + 1) % n])], ['backward', (k) => h(P[(k - 1 + n) % n], P[k])], ['central', (k) => h(P[(k - 1 + n) % n], P[(k + 1) % n])]]) {
  let m = 9, at = -1, under = 0; for (let k = 0; k < n; k++) { const v = f(k); if (v < m) { m = v; at = k; } if (v < 1e-4) under++; }
  console.log(`${name}: min ${m.toExponential(3)} at ${at}, under 1e-4: ${under}`);
}
