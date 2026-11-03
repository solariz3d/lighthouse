// render.js (D593, O): a headless software render of a kn5's geometry (no window, no GPU, no dependency): tools/kn5.cjs readKn5 for the meshes in world space,
// a z-buffered rasteriser with near-plane clipping, two-sided Lambert shading from face normals, one colour per surface class, PNG out through zlib.
// node render.js <repo> <kn5> <views.json> <out dir> [prefix]
//   views.json: [{ name, eye: [x,y,z], at: [x,y,z], up?: [x,y,z] (world up), fov?: deg (60), w?: 1600, h?: 900, far?: m (600) }]   (D637 copy: up added, so a view can stand on the road's own up as a car does)
// COLOUR BY MATERIAL, so each surface shows what it wears: the apron's own material (t180b_apron: the first apron's plank and join), the underside skin's (t180b_underskin),
// and the road's (every other material on a road, lane or lip mesh); scenery apart. The game's textures are not drawn.
// WHAT IS NOT DRAWN: tools/kn5.cjs does not read a node's visible/renderable flags, so a kn5 written with the drawn lip (any APRONLIP_ mesh) has its physics apron
// (1ROAD_/1GRIPnnn_APRON_) hidden by construction (test/export_apron.test.js rows 14 and 16 hold it), and those meshes are skipped here, as AC skips them.
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const [, , REPO, KN5, VIEWS, OUT, PREFIX = ''] = process.argv;
const { readKn5 } = require(path.join(REPO, 'tools', 'kn5.cjs'));
const CLASS = [
  ['apron (its own material)', (m) => m.material === 't180b_apron', [205, 150, 80]],
  ['underside (the skin\'s material)', (m) => m.material === 't180b_underskin', [70, 80, 100]],
  ['road material (road, lane, lip)', (m) => /^(1(?:ROAD|GRIP\d{3})_|APRONLIP_)/.test(m.name), [200, 200, 196]],
  ['scenery', () => true, [140, 160, 140]],
];
const classOf = (m) => CLASS.findIndex(([, f]) => f(m));
const t0 = Date.now();
const kn = readKn5(KN5);
const hidePhysicsApron = kn.meshes.some((m) => /^APRONLIP_/.test(m.name));
const meshes = kn.meshes.filter((m) => !(hidePhysicsApron && /^1(?:ROAD|GRIP\d{3})_APRON_/.test(m.name))).map((m) => ({ name: m.name, c: classOf(m), pos: m.pos, idx: m.idx }));
console.log(`hidden (not drawn by AC): ${kn.meshes.length - meshes.length} physics apron meshes`);
console.log(`${path.basename(KN5)}: ${meshes.length} meshes, ${meshes.reduce((a, m) => a + m.idx.length / 3, 0)} triangles, read in ${Date.now() - t0} ms`);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return l > 0 ? a.map((x) => x / l) : a; };
const LIGHT = unit([0.35, 0.85, 0.4]);

function png(w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3); }
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

function render(v) {
  const W = v.w || 1600, H = v.h || 900, fov = (v.fov || 60) * Math.PI / 180, far = v.far || 600, near = 0.05, f = (H / 2) / Math.tan(fov / 2);
  const fwd = unit(sub(v.at, v.eye)), right = unit(cross(fwd, v.up || [0, 1, 0])), up = cross(right, fwd);
  const rgb = Buffer.alloc(W * H * 3), zb = new Float32Array(W * H).fill(Infinity), counts = CLASS.map(() => 0);
  for (let y = 0; y < H; y++) { const t = y / H; for (let x = 0; x < W; x++) { const o = (y * W + x) * 3; rgb[o] = 175 + 40 * t; rgb[o + 1] = 205 + 25 * t; rgb[o + 2] = 235; } }
  const toCam = (p) => { const d = sub(p, v.eye); return [dot(d, right), dot(d, up), dot(d, fwd)]; };
  for (const m of meshes) {
    const P = m.pos, I = m.idx, col = CLASS[m.c][2];
    for (let t = 0; t < I.length; t += 3) {
      const w = [0, 1, 2].map((k) => [P[I[t + k] * 3], P[I[t + k] * 3 + 1], P[I[t + k] * 3 + 2]]);
      const c = w.map(toCam);
      if (c.every((q) => q[2] < near) || c.every((q) => q[2] > far)) continue;
      if (Math.min(...c.map((q) => Math.abs(q[0]) - q[2] * W / (2 * f))) > 0 && c.every((q) => q[2] > 0)) continue;   // wholly left or right of the view: a coarse cull
      const nW = unit(cross(sub(w[1], w[0]), sub(w[2], w[0])));
      const toEye = sub(v.eye, w[0]), facing = dot(nW, toEye) >= 0, nS = facing ? nW : nW.map((x) => -x);
      const lam = Math.max(0, dot(nS, LIGHT)), k = (facing ? 1 : 0.8) * (0.35 + 0.65 * lam);
      // clip against the near plane (Sutherland-Hodgman)
      let poly = c, outP = [];
      for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], ia = a[2] >= near, ib = b[2] >= near;
        if (ia) outP.push(a); if (ia !== ib) { const s = (near - a[2]) / (b[2] - a[2]); outP.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, near]); } }
      if (outP.length < 3) continue;
      const sp = outP.map((q) => [W / 2 + f * q[0] / q[2], H / 2 - f * q[1] / q[2], 1 / q[2]]);
      for (let i = 1; i + 1 < sp.length; i++) {
        const A = sp[0], B = sp[i], C = sp[i + 1];
        const x0 = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0]))), x1 = Math.min(W - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
        const y0 = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1]))), y1 = Math.min(H - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
        if (x0 > x1 || y0 > y1) continue;
        const area = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]); if (Math.abs(area) < 1e-9) continue;
        let drew = false;
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          const px = x + 0.5, py = y + 0.5;
          const w0 = ((B[0] - px) * (C[1] - py) - (B[1] - py) * (C[0] - px)) / area, w1 = ((C[0] - px) * (A[1] - py) - (C[1] - py) * (A[0] - px)) / area, w2 = 1 - w0 - w1;
          if (w0 < 0 || w1 < 0 || w2 < 0) continue;
          const iz = w0 * A[2] + w1 * B[2] + w2 * C[2], z = 1 / iz, o = y * W + x;
          if (z >= zb[o]) continue;
          zb[o] = z; drew = true;
          const fog = Math.min(1, z / far) * 0.5;
          for (let ch = 0; ch < 3; ch++) rgb[o * 3 + ch] = Math.round(col[ch] * k * (1 - fog) + 215 * fog);
        }
        if (drew) counts[m.c]++;
      }
    }
  }
  // a legend, top left: one swatch per class drawn in this view
  let ly = 12; CLASS.forEach(([, , col], i) => { if (!counts[i]) return; for (let y = ly; y < ly + 14; y++) for (let x = 12; x < 40; x++) { const o = (y * W + x) * 3; rgb[o] = col[0]; rgb[o + 1] = col[1]; rgb[o + 2] = col[2]; } ly += 20; });
  return { buf: png(W, H, rgb), counts };
}

fs.mkdirSync(OUT, { recursive: true });
const views = JSON.parse(fs.readFileSync(VIEWS, 'utf8')), report = [];
for (const v of views) {
  const t1 = Date.now(), r = render(v), file = path.join(OUT, `${PREFIX}${v.name}.png`);
  fs.writeFileSync(file, r.buf);
  const drawn = Object.fromEntries(CLASS.map(([n], i) => [n, r.counts[i]]).filter(([, c]) => c));
  report.push({ view: v.name, file, ms: Date.now() - t1, trianglesDrawn: drawn });
  console.log(`${v.name}: ${Date.now() - t1} ms, ${JSON.stringify(drawn)}`);
}
fs.writeFileSync(path.join(OUT, `${PREFIX}render-report.json`), JSON.stringify({ kn5: KN5, legend: CLASS.map(([n, , c]) => ({ class: n, rgb: c })), views: report }, null, 1));
