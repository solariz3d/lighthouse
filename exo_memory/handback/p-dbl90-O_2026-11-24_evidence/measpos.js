// measpos.js: the measured profile with the tangent taken from the centre POSITIONS (chord ±k stations) instead of the walker's forward vector; bank from the normal n
// against that tangent. Same sign rules as build.js (turn A's way +, bank into turn A +). usage: node measpos.js <read> <k> [out.json]
const read = require(require('path').resolve(process.argv[2])), k = +(process.argv[3] || 1), DEG = Math.PI / 180;
const st = read.stations.filter((s) => s.c && s.n && s.d >= 320 && s.d <= 760);
const rows = [];
for (let i = k; i + k < st.length; i++) {
  const a = st[i - k].c, b = st[i + k].c, t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...t), f = t.map((x) => x / L);
  rows.push({ d: st[i].d, f, n: st[i].n, y: st[i].c[1], w: st[i].width });
}
let acc = 0, prev = null; const out = [];
for (const x of rows) {
  const f = x.f, n = x.n;
  if (prev) { const h0 = [prev[0], 0, prev[2]], h1 = [f[0], 0, f[2]]; acc += Math.atan2(h0[2] * h1[0] - h0[0] * h1[2], h0[0] * h1[0] + h0[2] * h1[2]); }
  prev = f;
  const left = [f[2], 0, -f[0]], ll = Math.hypot(left[0], left[2]); left[0] /= ll; left[2] /= ll;
  const u2 = [left[1] * f[2] - left[2] * f[1], left[2] * f[0] - left[0] * f[2], left[0] * f[1] - left[1] * f[0]], dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  out.push({ d: x.d, h: acc / DEG, bank: Math.atan2(dot(n, left), -dot(n, u2)) / DEG, y: x.y, w: x.w });
}
const at = (d) => out.reduce((p, q) => (Math.abs(q.d - d) < Math.abs(p.d - d) ? q : p)), h0 = at(452).h, sg = Math.sign(at(516).h - h0) || 1;
const prof = out.map((x) => ({ d: x.d, h: (x.h - h0) * sg, bank: x.bank * sg, y: x.y, w: x.w }));
if (process.argv[4]) require('fs').writeFileSync(process.argv[4], JSON.stringify(prof));
for (const x of prof) if (x.d % 8 === 0 && x.d >= 340 && x.d <= 720) { const p = prof[prof.indexOf(x) - 2]; console.log(String(x.d).padEnd(5), x.h.toFixed(1).padStart(6), (((x.h - p.h) / (x.d - p.d))).toFixed(2).padStart(6), x.bank.toFixed(0).padStart(5), x.y.toFixed(1).padStart(6), x.w); }
