// render.js: a headless CPU render of each built attempt's road ribbon (the path's pos, L, U; width 33 m; kerbs 3 m), from about his screenshot's
// chase view: behind and above the run-in, looking down the road at the S. No window. usage: node render.js <tree> <docs.json> <out dir> [prefix]
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), zlib = require('zlib'), [tree, docsFile, outDir, prefix = ''] = process.argv.slice(2), R = (p) => require(path.join(tree, p));
const A = R('src/core/adapter.js'), { encodePng } = R('src/texture/png.js'), LEAD = 300, HW = 16.5, KERB = 3, W = 1280, H = 720;
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
fs.mkdirSync(outDir, { recursive: true });
for (const a of require(path.resolve(docsFile))) {
  const S = A.toPath(a.doc, { step: 1 }).path.samples.filter((x) => x.s >= LEAD - 120 && x.s <= LEAD + 400);
  const at = (d) => S.reduce((p, q) => (Math.abs(q.s - (LEAD + d - 340)) < Math.abs(p.s - (LEAD + d - 340)) ? q : p));
  // the camera: 55 m behind measured d 400 along the road and 42 m up, aimed at the road between the turns (d 530); 62° across
  const c0 = at(400), tgt = at(530).pos, eye = add(add(c0.pos, c0.T, -55), [0, 1, 0], 42);
  const f = unit(sub(tgt, eye)), r = unit(cross(f, [0, 1, 0])), u = cross(r, f), fx = W / 2 / Math.tan((62 / 2) * Math.PI / 180);
  const rgba = new Uint8Array(W * H * 4), z = new Float32Array(W * H).fill(Infinity);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = (y * W + x) * 4, t = y / H; rgba[o] = 196 - 30 * t; rgba[o + 1] = 206 - 30 * t; rgba[o + 2] = 210 - 26 * t; rgba[o + 3] = 255; }
  const proj = (p) => { const v = sub(p, eye), zc = dot(v, f); return zc < 0.5 ? null : [W / 2 + (fx * dot(v, r)) / zc, H / 2 - (fx * dot(v, u)) / zc, zc]; };
  const sun = unit([0.4, 1, 0.3]);
  function tri(P, col) {
    const q = P.map(proj); if (q.some((x) => !x)) return;
    const n = unit(cross(sub(P[1], P[0]), sub(P[2], P[0]))), lit = 0.55 + 0.45 * Math.abs(dot(n, sun));
    const x0 = Math.max(0, Math.floor(Math.min(...q.map((p) => p[0])))), x1 = Math.min(W - 1, Math.ceil(Math.max(...q.map((p) => p[0]))));
    const y0 = Math.max(0, Math.floor(Math.min(...q.map((p) => p[1])))), y1 = Math.min(H - 1, Math.ceil(Math.max(...q.map((p) => p[1]))));
    const [A0, B0, C0] = q, den = (B0[1] - C0[1]) * (A0[0] - C0[0]) + (C0[0] - B0[0]) * (A0[1] - C0[1]); if (Math.abs(den) < 1e-9) return;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const w0 = ((B0[1] - C0[1]) * (x - C0[0]) + (C0[0] - B0[0]) * (y - C0[1])) / den, w1 = ((C0[1] - A0[1]) * (x - C0[0]) + (A0[0] - C0[0]) * (y - C0[1])) / den, w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const iz = w0 / A0[2] + w1 / B0[2] + w2 / C0[2], d = 1 / iz, o = y * W + x; if (d >= z[o]) continue; z[o] = d;
      const fog = Math.exp(-0.0016 * d); for (let k = 0; k < 3; k++) rgba[o * 4 + k] = Math.round(col[k] * lit * fog + 200 * (1 - fog));
    }
  }
  const quad = (a1, b1, a2, b2, col) => { tri([a1, b1, b2], col); tri([a1, b2, a2], col); };
  for (let i = 0; i + 1 < S.length; i++) {
    const p = S[i], q = S[i + 1], band = Math.floor(p.s / 6) % 2, grid = Math.floor(p.s / 8) % 2;
    const E = (s, off, h = 0) => add(add(s.pos, s.L, off), s.U, h);
    const road = grid ? [118, 112, 104] : [104, 99, 92], kerb = band ? [70, 150, 205] : [225, 215, 195], under = [60, 64, 70];
    quad(E(p, -HW + KERB), E(p, HW - KERB), E(q, -HW + KERB), E(q, HW - KERB), road);
    quad(E(p, -HW), E(p, -HW + KERB), E(q, -HW), E(q, -HW + KERB), kerb);
    quad(E(p, HW - KERB), E(p, HW), E(q, HW - KERB), E(q, HW), kerb);
    quad(E(p, -HW), E(p, -HW, -1.5), E(q, -HW), E(q, -HW, -1.5), under); quad(E(p, HW), E(p, HW, -1.5), E(q, HW), E(q, HW, -1.5), under);
    quad(E(p, -HW, -1.5), E(p, HW, -1.5), E(q, -HW, -1.5), E(q, HW, -1.5), under);
  }
  const file = path.join(outDir, `${prefix}${a.name.replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').toLowerCase()}.png`);
  fs.writeFileSync(file, encodePng({ width: W, height: H, rgba }, (b) => zlib.deflateSync(b)));
  console.log(file);
}
