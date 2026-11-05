// ribbon641.js <repo> <opts.json> <out dir>: D641. For each state in opts.json (the panel's own options, dumped through the real panel by opts.test.js): the placed 1,000 m
// straight, then his HUD's piece laid with those options (shell.extend, as Extend does), and the road drawn from the core's own path (src/core/adapter.js toPath, the same
// path the preview meshes): a ribbon of the road's width across the frame's L, its TOP light blue and its UNDERSIDE orange, so a roll shows as the colour turning over.
// No cup is drawn (the ribbon is flat across), no browser, no window, no GPU: a z-buffered software rasteriser to PNG. Writes only under <out dir>. BelowNormal.
'use strict';
require('./winhide.js');
const os = require('os'); os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), zlib = require('zlib');
const [REPO, OPTS, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const req = (p) => require(path.join(REPO, p));
const { createCoreShell } = req('app/core/coreshell.js'), A = req('src/core/adapter.js');
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return l > 0 ? a.map((x) => x / l) : a; };
const LIGHT = unit([0.3, 0.9, 0.35]);
function png(w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3); }
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
// tris: [{ p: [a, b, c], top: [r,g,b], under: [r,g,b] }]; the top face is the side the frame's U points out of
function render(tris, v, W = 1600, H = 900) {
  const fov = (v.fov || 60) * Math.PI / 180, far = v.far || 2000, near = 0.5, f = (H / 2) / Math.tan(fov / 2);
  const fwd = unit(sub(v.at, v.eye)), right = unit(cross(fwd, v.up || [0, 1, 0])), up = cross(right, fwd);
  const rgb = Buffer.alloc(W * H * 3), zb = new Float32Array(W * H).fill(Infinity);
  for (let y = 0; y < H; y++) { const t = y / H; for (let x = 0; x < W; x++) { const o = (y * W + x) * 3; rgb[o] = 18 + 20 * t; rgb[o + 1] = 22 + 22 * t; rgb[o + 2] = 30 + 26 * t; } }
  const toCam = (p) => { const d = sub(p, v.eye); return [dot(d, right), dot(d, up), dot(d, fwd)]; };
  for (const T of tris) {
    const c = T.p.map(toCam); if (c.some((q) => q[2] < near) || c.every((q) => q[2] > far)) continue;
    const n = unit(cross(sub(T.p[1], T.p[0]), sub(T.p[2], T.p[0]))), facingTop = dot(n, sub(v.eye, T.p[0])) >= 0;
    const col = facingTop ? T.top : T.under, ns = facingTop ? n : n.map((x) => -x), k = 0.45 + 0.55 * Math.max(0, dot(ns, LIGHT));
    const s = c.map((q) => ({ x: W / 2 + (q[0] * f) / q[2], y: H / 2 - (q[1] * f) / q[2], z: q[2] }));
    const x0 = Math.max(0, Math.floor(Math.min(...s.map((q) => q.x)))), x1 = Math.min(W - 1, Math.ceil(Math.max(...s.map((q) => q.x))));
    const y0 = Math.max(0, Math.floor(Math.min(...s.map((q) => q.y)))), y1 = Math.min(H - 1, Math.ceil(Math.max(...s.map((q) => q.y))));
    const area = (s[1].x - s[0].x) * (s[2].y - s[0].y) - (s[2].x - s[0].x) * (s[1].y - s[0].y); if (Math.abs(area) < 1e-9) continue;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = ((s[1].x - px) * (s[2].y - py) - (s[2].x - px) * (s[1].y - py)) / area, w1 = ((s[2].x - px) * (s[0].y - py) - (s[0].x - px) * (s[2].y - py)) / area, w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const z = 1 / (w0 / s[0].z + w1 / s[1].z + w2 / s[2].z), o = y * W + x; if (z >= zb[o]) continue; zb[o] = z;
      const fog = Math.min(1, z / far) * 0.4;
      for (let ch = 0; ch < 3; ch++) rgb[o * 3 + ch] = Math.round(col[ch] * k * (1 - fog) + 40 * fog);
    }
  }
  return png(W, H, rgb);
}
(async () => {
  const states = JSON.parse(fs.readFileSync(OPTS, 'utf8'));
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, st] of Object.entries(states)) {
    const s = await createCoreShell({ brushFn: null, autosaveMs: 0 });
    s.extend({ length: 1000, family: 'bowl' }); s.extend(st.options);
    const doc = s.getState().history.present, P = doc.pieces[1], half = 31 / 2;
    const S = A.toPath(doc, { step: 2 }).path.samples.filter((q) => q.s >= 700).map((q) => ({ s: q.s, pos: [...q.pos], T: [...q.T], L: [...q.L], U: [...q.U] }));
    const tris = [];
    for (let i = 1; i < S.length; i++) {
      const a = S[i - 1], b = S[i], E = (q, sg) => q.pos.map((x, k) => x + sg * half * q.L[k]);
      const newPiece = a.s >= 1000, stripe = Math.floor(a.s / 40) % 2 === 0;   // 40 m bands so the roll can be followed
      const top = newPiece ? (stripe ? [120, 170, 255] : [95, 140, 230]) : [150, 150, 160], under = newPiece ? (stripe ? [255, 150, 60] : [230, 120, 40]) : [110, 90, 80];
      // wound so the triangle's normal points along U (the road's top)
      tris.push({ p: [E(a, 1), E(a, -1), E(b, -1)], top, under }, { p: [E(a, 1), E(b, -1), E(b, 1)], top, under });
    }
    for (const t of tris) { const n = cross(sub(t.p[1], t.p[0]), sub(t.p[2], t.p[0])); const q = S[Math.min(S.length - 1, Math.round(tris.indexOf(t) / 2))]; if (dot(n, q.U) < 0) { const x = t.top; t.top = t.under; t.under = x; } }
    const at = (x) => S.reduce((m, q) => (Math.abs(q.s - x) < Math.abs(m.s - x) ? q : m));
    const pt = (x, u, v, f = 0) => { const q = at(x); return [0, 1, 2].map((k) => q.pos[k] + q.L[k] * u + q.U[k] * v + q.T[k] * f); };
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (const q of S) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], q.pos[k]); hi[k] = Math.max(hi[k], q.pos[k]); }
    const c = lo.map((x, k) => (x + hi[k]) / 2), R = Math.max(hi[0] - lo[0], hi[2] - lo[2]), L = P.length;
    const V = [{ name: 'wide', eye: [c[0] - 0.45 * R, c[1] + 0.55 * R, c[2] - 0.45 * R], at: c, fov: 55, far: 9000 }];
    for (const share of [0.7, 0.85, 0.97]) { const x = 1000 + share * L; V.push({ name: `follow-${Math.round(share * 100)}`, eye: pt(x - 30, 0, 7), at: pt(x + 45, 0, 2), up: at(x - 30).U, fov: 75, far: 2500 }); }
    let worstU = 0; for (let i = 1; i < S.length; i++) { const d = Math.acos(Math.max(-1, Math.min(1, dot(S[i - 1].U, S[i].U)))) * 180 / Math.PI; if (d > worstU) worstU = d; }
    for (const v of V) fs.writeFileSync(path.join(OUT, `${name}-${v.name}.png`), render(tris, v));
    console.log(`${name}: HUD bank ${st.hudBank.toFixed(2)}; piece ${L} m; ${tris.length} triangles; the frame turns at most ${worstU.toFixed(2)}° between 2 m samples; views ${V.map((v) => v.name).join(', ')}`);
  }
})().catch((e) => { console.log('ERR', e.stack || e); process.exit(1); });
