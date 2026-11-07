// render2.js (D593, O): a headless software render of a kn5 WITH ITS TEXTURES (no window, no GPU, no dependency), for his page: kn5full.js reads the kn5 whole; the
// DDS textures (uncompressed 32-bit, with their mips, as src/texture writes them) are decoded; each triangle is drawn with perspective-correct uvs, a mip level chosen
// per triangle, bilinear, repeating; lit as a ksPerPixel material: texture × (ksAmbient · sky + ksDiffuse · sun · max(0, n·sun)) with the vertex normals interpolated.
// Only what AC draws: a mesh not renderable or not visible is skipped, and a back face (by its winding, as AC culls) is culled.
// node render2.js <kn5> <views.json> <out dir> [prefix] [W H]
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { readKn5Full } = require('./kn5full.js');
const [, , KN5, VIEWS, OUT, PREFIX = '', WS = '2560', HS = '1440'] = process.argv;
const W = +WS, H = +HS;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return l > 0 ? a.map((x) => x / l) : a; };
const SUN = unit([0.35, 0.85, 0.4]), SKY = 0.9 * +(process.env.AMBIENT || 1), SUNL = 1.0, EXPOSURE = +(process.env.EXPOSURE || 1);   // one exposure for every image of a set (AC with CSP lights a road far brighter than plain material maths)

function ddsDecode(buf) {
  if (buf.toString('latin1', 0, 4) !== 'DDS ') throw new Error('not a DDS');
  const h = (o) => buf.readUInt32LE(o), height = h(12), width = h(16), mips = Math.max(1, h(28)), pfFlags = h(80), four = buf.toString('latin1', 84, 88), bits = h(88);
  if (four.trim() && !(pfFlags & 0x40)) throw new Error(`DDS ${four}: compressed textures are not read here`);
  if (bits !== 32) throw new Error(`DDS of ${bits} bits a pixel is not read here`);
  const mask = [h(92), h(96), h(100)], shift = (m) => { let s = 0; while (m && !(m & 1)) { m >>>= 1; s++; } return s; }, sh = mask.map(shift);
  const levels = []; let o = 128, w = width, ht = height;
  for (let l = 0; l < mips && w >= 1 && ht >= 1; l++) {
    const px = new Uint8Array(w * ht * 3);
    for (let i = 0; i < w * ht; i++) { const v = buf.readUInt32LE(o + i * 4); for (let c = 0; c < 3; c++) px[i * 3 + c] = (v & mask[c]) >>> sh[c]; }
    levels.push({ w, h: ht, px }); o += w * ht * 4; w = Math.max(1, w >> 1); ht = Math.max(1, ht >> 1);
    if (o > buf.length) break;
  }
  return levels;
}
function sample(levels, l, u, v, out) {
  const L = levels[Math.min(levels.length - 1, Math.max(0, l))], x = (u - Math.floor(u)) * L.w - 0.5, y = (v - Math.floor(v)) * L.h - 0.5;
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, wrap = (a, n) => ((a % n) + n) % n;
  const X0 = wrap(x0, L.w), X1 = wrap(x0 + 1, L.w), Y0 = wrap(y0, L.h), Y1 = wrap(y0 + 1, L.h), p = L.px;
  for (let c = 0; c < 3; c++) {
    const a = p[(Y0 * L.w + X0) * 3 + c], b = p[(Y0 * L.w + X1) * 3 + c], d = p[(Y1 * L.w + X0) * 3 + c], e = p[(Y1 * L.w + X1) * 3 + c];
    out[c] = (a * (1 - fx) + b * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy;
  }
}
function png(rgb) {
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; rgb.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3); }
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}

const t0 = Date.now(), kn = readKn5Full(KN5);
const tex = new Map(); for (const [n, b] of kn.textures) { try { tex.set(n, ddsDecode(b)); } catch (e) { console.log(`texture ${n}: ${e.message}; drawn as its material's grey`); } }
const mats = kn.materials.map((m) => ({ name: m.name, amb: m.props.ksAmbient ?? 0.5, dif: m.props.ksDiffuse ?? 0.5, levels: tex.get(m.samplers.txDiffuse) || null }));
const meshes = kn.meshes.filter((m) => m.renderable && m.visible);
console.log(`${path.basename(KN5)}: ${kn.meshes.length} meshes, ${meshes.length} drawn, ${kn.meshes.length - meshes.length} hidden; ${tex.size} textures; read in ${Date.now() - t0} ms`);

function render(v) {
  const fov = (v.fov || 60) * Math.PI / 180, far = v.far || 800, near = 0.05, f = (H / 2) / Math.tan(fov / 2);
  const fwd = unit(sub(v.at, v.eye)), right = unit(cross(fwd, [0, 1, 0])), up = cross(right, fwd);
  const rgb = Buffer.alloc(W * H * 3), zb = new Float32Array(W * H).fill(Infinity);
  for (let y = 0; y < H; y++) { const t = y / H; for (let x = 0; x < W; x++) { const o = (y * W + x) * 3; rgb[o] = 150 + 50 * t; rgb[o + 1] = 190 + 35 * t; rgb[o + 2] = 235; } }
  const toCam = (p) => { const d = sub(p, v.eye); return [dot(d, right), dot(d, up), dot(d, fwd)]; };
  const col = [0, 0, 0];
  for (const m of meshes) {
    const mat = mats[m.material] || { amb: 0.5, dif: 0.5, levels: null }, P = m.pos, Nn = m.nrm, UV = m.uv, I = m.idx;
    for (let t = 0; t < I.length; t += 3) {
      const ids = [I[t], I[t + 1], I[t + 2]], w = ids.map((i) => [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]), c = w.map(toCam);
      if (c.every((q) => q[2] < near) || c.every((q) => q[2] > far)) continue;
      const nv = ids.map((i) => [Nn[i * 3], Nn[i * 3 + 1], Nn[i * 3 + 2]]), avgN = unit([nv[0][0] + nv[1][0] + nv[2][0], nv[0][1] + nv[1][1] + nv[2][1], nv[0][2] + nv[1][2] + nv[2][2]]);
      // a back face, culled as AC culls it: by its WINDING (counter-clockwise from the eye is front), not its vertex normals; a first form culled on the normals and
      // dropped the road's underside skin beside the lane, whose normals are hung along the frame's up and tip past edge-on at a grazing view (sky through cracks)
      if (dot(cross(sub(w[1], w[0]), sub(w[2], w[0])), sub(v.eye, w[0])) < 0) continue;
      // the near plane: clip in camera space, carrying each vertex's uv and normal (attributes interpolated with the position)
      const vert = c.map((q, k) => ({ q, uv: [UV[ids[k] * 2], UV[ids[k] * 2 + 1]], n: nv[k] }));
      let poly = vert, out = [];
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length], ia = a.q[2] >= near, ib = b.q[2] >= near;
        if (ia) out.push(a);
        if (ia !== ib) { const s = (near - a.q[2]) / (b.q[2] - a.q[2]), lerp = (x, y) => x.map((xx, k) => xx + (y[k] - xx) * s); out.push({ q: lerp(a.q, b.q), uv: lerp(a.uv, b.uv), n: lerp(a.n, b.n) }); }
      }
      if (out.length < 3) continue;
      const sp = out.map((x) => ({ x: W / 2 + f * x.q[0] / x.q[2], y: H / 2 - f * x.q[1] / x.q[2], iz: 1 / x.q[2], uz: x.uv[0] / x.q[2], vz: x.uv[1] / x.q[2], nz: x.n.map((k) => k / x.q[2]) }));
      for (let i = 1; i + 1 < sp.length; i++) {
        const A = sp[0], B = sp[i], C = sp[i + 1];
        const area = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x); if (Math.abs(area) < 1e-9) continue;
        let level = 0;
        if (mat.levels) {   // the mip level: texels per pixel over the triangle, from its uv area at level 0 against its screen area
          const ua = [A.uz / A.iz, A.vz / A.iz], ub = [B.uz / B.iz, B.vz / B.iz], uc = [C.uz / C.iz, C.vz / C.iz], L0 = mat.levels[0];
          const uvArea = Math.abs((ub[0] - ua[0]) * (uc[1] - ua[1]) - (ub[1] - ua[1]) * (uc[0] - ua[0])) * L0.w * L0.h;
          level = Math.round(0.5 * Math.log2(Math.max(1, uvArea / Math.abs(area)))) + (+process.env.MIPBIAS || 0);   // MIPBIAS: a test of sampling (default 0)
          if (process.env.MIPFIX !== undefined) level = +process.env.MIPFIX;   // MIPFIX (D610): one level for every triangle, so a coarser mesh is sampled as a finer one is
        }
        const x0 = Math.max(0, Math.floor(Math.min(A.x, B.x, C.x))), x1 = Math.min(W - 1, Math.ceil(Math.max(A.x, B.x, C.x)));
        const y0 = Math.max(0, Math.floor(Math.min(A.y, B.y, C.y))), y1 = Math.min(H - 1, Math.ceil(Math.max(A.y, B.y, C.y)));
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          const px = x + 0.5, py = y + 0.5;
          const w0 = ((B.x - px) * (C.y - py) - (B.y - py) * (C.x - px)) / area, w1 = ((C.x - px) * (A.y - py) - (C.y - py) * (A.x - px)) / area, w2 = 1 - w0 - w1;
          if (w0 < 0 || w1 < 0 || w2 < 0) continue;
          const iz = w0 * A.iz + w1 * B.iz + w2 * C.iz, z = 1 / iz, o = y * W + x;
          if (z >= zb[o]) continue;
          zb[o] = z;
          const n = unit([0, 1, 2].map((k) => (w0 * A.nz[k] + w1 * B.nz[k] + w2 * C.nz[k]) * z)), light = mat.amb * SKY + mat.dif * SUNL * Math.max(0, dot(n, SUN));
          if (mat.levels) sample(mat.levels, level, (w0 * A.uz + w1 * B.uz + w2 * C.uz) * z, (w0 * A.vz + w1 * B.vz + w2 * C.vz) * z, col); else { col[0] = col[1] = col[2] = 160; }
          const fog = Math.min(1, z / far) * 0.35;
          for (let ch = 0; ch < 3; ch++) rgb[o * 3 + ch] = Math.max(0, Math.min(255, Math.round(col[ch] * light * EXPOSURE * (1 - fog) + 210 * fog)));
        }
      }
    }
  }
  return png(rgb);
}

fs.mkdirSync(OUT, { recursive: true });
const views = JSON.parse(fs.readFileSync(VIEWS, 'utf8')), only = process.env.VIEWS ? new Set(process.env.VIEWS.split(',')) : null;
for (const v of views) {
  if (only && !only.has(v.name)) continue;
  const t1 = Date.now(), file = path.join(OUT, `${PREFIX}${v.name}.png`);
  fs.writeFileSync(file, render(v));
  console.log(`${v.name}: ${((Date.now() - t1) / 1000).toFixed(1)} s, ${(fs.statSync(file).size / 1048576).toFixed(1)} MB`);
}
