// usage: node render642.js <t180 tree> <out dir>   D642 review: what he sees with B's fix. The placed track (the model's own mesh, tm.update batches) drawn opaque with a depth
// buffer, then the ghost (tm.ghostFor of shell.candidate) drawn as app/preview/renderer.js:552-557 draws it: depth-tested (LESS), no depth written, blended at GHOST_ALPHA in
// COLOURS.ghost (both read from renderer.js). Software raster (C's mesh641.js raster, D641 evidence), no browser, no window, BelowNormal. Linear float depth, not the GPU's
// 24-bit buffer: where the ghost and the placed road lie within millimetres the GPU will z-fight; here the nearer one simply wins (said in the hand-back).
'use strict';
const os = require('os'); try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* not allowed: run at normal */ }
const path = require('path'), fs = require('fs'), zlib = require('zlib');
const [REPO, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const req = (p) => require(path.join(REPO, p));
const { createCoreShell } = req('app/core/coreshell.js'), TM = req('app/preview/trackmodel.js'), RD = req('app/preview/renderer.js');
const DEG = Math.PI / 180, GA = RD.GHOST_ALPHA, GC = RD.COLOURS.ghost.map((x) => Math.round(x * 255));
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
const trisOf = (batches) => { const out = []; for (const b of batches) { const M = b.model, bake = (x, y, z, w) => [x * M[0] + y * M[4] + z * M[8] + w * M[12], x * M[1] + y * M[5] + z * M[9] + w * M[13], x * M[2] + y * M[6] + z * M[10] + w * M[14]];
  const P = b.positions, I = b.indices, v = (i) => bake(P[i * 3], P[i * 3 + 1], P[i * 3 + 2], 1); for (let t = 0; t < I.length; t += 3) { const p = [v(I[t]), v(I[t + 1]), v(I[t + 2])]; out.push({ p, n: unit(cross(sub(p[1], p[0]), sub(p[2], p[0]))) }); } } return out; };
function render(placedTris, ghostTris, v, W = 1400, H = 800) {
  const fov = (v.fov || 60) * DEG, far = v.far || 6000, near = 0.5, f = (H / 2) / Math.tan(fov / 2);
  const fwd = unit(sub(v.at, v.eye)), right = unit(cross(fwd, v.up || [0, 1, 0])), up = cross(right, fwd);
  const rgb = Buffer.alloc(W * H * 3), zb = new Float32Array(W * H).fill(Infinity); let ghostPx = 0;
  for (let y = 0; y < H; y++) { const t = y / H; for (let x = 0; x < W; x++) { const o = (y * W + x) * 3; rgb[o] = 14 + 14 * t; rgb[o + 1] = 18 + 16 * t; rgb[o + 2] = 26 + 20 * t; } }
  const toCam = (p) => { const d = sub(p, v.eye); return [dot(d, right), dot(d, up), dot(d, fwd)]; };
  const raster = (T, shade) => {
    const c = T.p.map(toCam); if (c.some((q) => q[2] < near) || c.every((q) => q[2] > far)) return;
    const s = c.map((q) => ({ x: W / 2 + (q[0] * f) / q[2], y: H / 2 - (q[1] * f) / q[2], z: q[2] }));
    const x0 = Math.max(0, Math.floor(Math.min(...s.map((q) => q.x)))), x1 = Math.min(W - 1, Math.ceil(Math.max(...s.map((q) => q.x))));
    const y0 = Math.max(0, Math.floor(Math.min(...s.map((q) => q.y)))), y1 = Math.min(H - 1, Math.ceil(Math.max(...s.map((q) => q.y))));
    const area = (s[1].x - s[0].x) * (s[2].y - s[0].y) - (s[2].x - s[0].x) * (s[1].y - s[0].y); if (Math.abs(area) < 1e-9) return;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5, w0 = ((s[1].x - px) * (s[2].y - py) - (s[2].x - px) * (s[1].y - py)) / area, w1 = ((s[2].x - px) * (s[0].y - py) - (s[0].x - px) * (s[2].y - py)) / area, w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const z = 1 / (w0 / s[0].z + w1 / s[1].z + w2 / s[2].z), o = y * W + x; shade(o, z);
    }
  };
  for (const T of placedTris) { const facing = dot(T.n, sub(v.eye, T.p[0])) >= 0, ns = facing ? T.n : T.n.map((x) => -x), k = 0.45 + 0.55 * Math.max(0, dot(ns, LIGHT)), col = facing ? [110, 160, 245] : [245, 140, 55];
    raster(T, (o, z) => { if (z >= zb[o]) return; zb[o] = z; for (let ch = 0; ch < 3; ch++) rgb[o * 3 + ch] = Math.round(col[ch] * k); }); }
  for (const T of ghostTris) raster(T, (o, z) => { if (!(z < zb[o])) return; ghostPx++; for (let ch = 0; ch < 3; ch++) rgb[o * 3 + ch] = Math.round(GC[ch] * GA + rgb[o * 3 + ch] * (1 - GA)); });
  return { png: png(W, H, rgb), ghostPx };
}
const CASES = {
  'his-88.45-then-straight-100': { last: { length: 1000, targets: { phi: 88.45 * DEG }, bankShape: 'rounded' }, next: { length: 100 } },
  'his-88.45-then-bank-minus180-250': { last: { length: 1000, targets: { phi: 88.45 * DEG }, bankShape: 'rounded' }, next: { length: 250, targets: { phi: -180 * DEG } } },
  'corkscrew-90-then-180': { last: { length: 250, targets: { phi: -90 * DEG } }, next: { length: 250, targets: { phi: -180 * DEG } } },
};
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); const log = [];
  for (const [name, cs] of Object.entries(CASES)) {
    const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.extend({ length: 1000, family: 'bowl' }); s.extend({ family: 'bowl', ...cs.last });
    const st = s.getState(), tm = TM.createTrackModel(), placed = tm.update({ segments: st.resolved.segments, closed: false, start: st.resolved.start });
    const g = tm.ghostFor(s.candidate(cs.next)), P = trisOf(placed.batches), Gt = trisOf(g.batches);
    const S = tm.path.samples, end = S[S.length - 1], relaidS = g.relaid !== undefined ? g.path.samples[g.path.segFirst[g.relaid]].s : null;
    const at = (x) => S.reduce((m, q) => (Math.abs(q.s - x) < Math.abs(m.s - x) ? q : m)), pt = (q, t, u, w) => [0, 1, 2].map((k) => q.pos[k] + q.T[k] * t + q.L[k] * u + q.U[k] * w);
    const back = relaidS !== null ? Math.max(60, end.s - relaidS + 40) : 100;
    const V = [
      { name: 'behind-above', eye: pt(at(end.s - back - 120), 0, 30, 90), at: pt(end, 60, 0, 0), up: [0, 1, 0], fov: 55 },
      { name: 'over-the-joint', eye: pt(at(end.s - 40), 0, 0, 25), at: pt(end, 30, 0, 0), up: at(end.s - 40).U, fov: 70 },
    ];
    for (const v of V) { const r = render(P, Gt, v); fs.writeFileSync(path.join(OUT, `${name}-${v.name}.png`), r.png); log.push(`${name} ${v.name}: ghost pixels drawn ${r.ghostPx}`); }
    log.push(`${name}: placed ${P.length} triangles, ghost ${Gt.length}; ghost re-lays from s ${relaidS === null ? '—' : relaidS.toFixed(1)} (${relaidS === null ? 0 : (end.s - relaidS).toFixed(1)} m of the placed road), the placed end at s ${end.s.toFixed(1)}`);
  }
  console.log(log.join('\n'));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
