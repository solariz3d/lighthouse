// mesh641.js <repo> <opts.json> <out dir>: D641, the chair's 15:15Z order: his HUD's piece rendered from the REAL ghost mesh the preview draws (app/preview/trackmodel.js
// ghostFor of shell.candidate(options), the cup included), after the placed 1,000 m straight, for each state in opts.json (the panel's own options, opts3.test.js).
// The fold checks, on that mesh and its path:
//   flips: neighbouring triangles (sharing an edge) whose face normals differ by more than 90° (a surface that folds back over itself does that at the crease)
//   inverted: triangles whose face normal points against the road's own up there (the mesh's vertex normals): a strip turned inside out
//   near: the closest the centreline comes to itself between stations more than 100 m apart along it (a road crossing itself comes within its width)
// Drawn two-sided: a face seen from the side its normal points to is the road's top (blue), from behind its underside (orange). Software raster, no browser. BelowNormal.
'use strict';
require('./winhide.js');
const os = require('os'); os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), zlib = require('zlib');
const [REPO, OPTS, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const req = (p) => require(path.join(REPO, p));
const { createCoreShell } = req('app/core/coreshell.js'), TM = req('app/preview/trackmodel.js');
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
function render(tris, v, W = 1600, H = 900) {
  const fov = (v.fov || 60) * Math.PI / 180, far = v.far || 3000, near = 0.5, f = (H / 2) / Math.tan(fov / 2);
  const fwd = unit(sub(v.at, v.eye)), right = unit(cross(fwd, v.up || [0, 1, 0])), up = cross(right, fwd);
  const rgb = Buffer.alloc(W * H * 3), zb = new Float32Array(W * H).fill(Infinity);
  for (let y = 0; y < H; y++) { const t = y / H; for (let x = 0; x < W; x++) { const o = (y * W + x) * 3; rgb[o] = 18 + 20 * t; rgb[o + 1] = 22 + 22 * t; rgb[o + 2] = 30 + 26 * t; } }
  const toCam = (p) => { const d = sub(p, v.eye); return [dot(d, right), dot(d, up), dot(d, fwd)]; };
  for (const T of tris) {
    const c = T.p.map(toCam); if (c.some((q) => q[2] < near) || c.every((q) => q[2] > far)) continue;
    const facing = dot(T.n, sub(v.eye, T.p[0])) >= 0, col = facing ? T.top : T.under, ns = facing ? T.n : T.n.map((x) => -x), k = 0.45 + 0.55 * Math.max(0, dot(ns, LIGHT));
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
  const states = JSON.parse(fs.readFileSync(OPTS, 'utf8')); fs.mkdirSync(OUT, { recursive: true });
  for (const [name, st] of Object.entries(states)) {
    const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.extend({ length: 1000, family: 'bowl' });
    const R0 = s.getState().resolved, tm = TM.createTrackModel(); tm.update({ segments: R0.segments, closed: false, start: R0.start });
    const g = tm.ghostFor(s.candidate(st.options));
    // the triangles, each with its face normal and the mesh's own up there (the mean of its vertex normals)
    const tris = [];
    for (const b of g.batches) {
      // world = local · M, as the preview's renderer bakes it (app/preview/renderer.js bakePoints: w 1 points, w 0 directions)
      const M = b.model, bake = (x, y, z, w) => [x * M[0] + y * M[4] + z * M[8] + w * M[12], x * M[1] + y * M[5] + z * M[9] + w * M[13], x * M[2] + y * M[6] + z * M[10] + w * M[14]];
      const P = b.positions, N = b.normals, I = b.indices, v = (i) => bake(P[i * 3], P[i * 3 + 1], P[i * 3 + 2], 1), vn = (i) => bake(N[i * 3], N[i * 3 + 1], N[i * 3 + 2], 0);
      for (let t = 0; t < I.length; t += 3) {
        const p = [v(I[t]), v(I[t + 1]), v(I[t + 2])], n = unit(cross(sub(p[1], p[0]), sub(p[2], p[0])));
        const up = unit([0, 1, 2].map((k) => vn(I[t])[k] + vn(I[t + 1])[k] + vn(I[t + 2])[k]));
        tris.push({ p, n, up, top: [110, 160, 245], under: [245, 140, 55], key: [I[t], I[t + 1], I[t + 2]].map((i) => p[0] && i), b });
      }
    }
    // inverted: a face against its own vertex normals; flips: neighbours (a shared edge, by position) more than 90° apart
    let inverted = 0; for (const T of tris) if (dot(T.n, T.up) < 0) inverted++;
    const edgeKey = (a, c) => { const ka = a.map((x) => x.toFixed(3)).join(','), kc = c.map((x) => x.toFixed(3)).join(','); return ka < kc ? `${ka}|${kc}` : `${kc}|${ka}`; };
    const byEdge = new Map(); tris.forEach((T, i) => { for (const [a, c] of [[0, 1], [1, 2], [2, 0]]) { const k = edgeKey(T.p[a], T.p[c]); if (!byEdge.has(k)) byEdge.set(k, []); byEdge.get(k).push(i); } });
    let flips = 0, worstNb = 0; for (const list of byEdge.values()) for (let a = 0; a < list.length; a++) for (let c = a + 1; c < list.length; c++) { const d = Math.acos(Math.max(-1, Math.min(1, dot(tris[list[a]].n, tris[list[c]].n)))) * 180 / Math.PI; worstNb = Math.max(worstNb, d); if (d > 90) flips++; }
    const S = g.path.samples.filter((q) => q.s >= 1000).map((q) => ({ s: q.s, pos: [...q.pos], T: [...q.T], L: [...q.L], U: [...q.U] }));
    let nearM = Infinity, nearAt = null; for (let i = 0; i < S.length; i += 2) for (let j = i + 1; j < S.length; j += 2) { if (S[j].s - S[i].s <= 100) continue; const d = Math.hypot(...sub(S[i].pos, S[j].pos)); if (d < nearM) { nearM = d; nearAt = [S[i].s, S[j].s]; } }
    // views: wide from above and behind-right, like his Free view; follow cams rolled with the road at 70%, 85% and 97% of the piece
    const at = (x) => S.reduce((m, q) => (Math.abs(q.s - x) < Math.abs(m.s - x) ? q : m));
    const pt = (x, u, v, f = 0) => { const q = at(x); return [0, 1, 2].map((k) => q.pos[k] + q.L[k] * u + q.U[k] * v + q.T[k] * f); };
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity]; for (const q of S) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], q.pos[k]); hi[k] = Math.max(hi[k], q.pos[k]); }
    const c = lo.map((x, k) => (x + hi[k]) / 2), Rr = Math.max(hi[0] - lo[0], hi[2] - lo[2]), L = S[S.length - 1].s - 1000;
    const st0 = S[0], his = [0, 1, 2].map((k) => st0.pos[k] - st0.T[k] * 420 + st0.U[k] * 330 + st0.L[k] * 60);   // his angle: behind and above the piece's start, looking along it
    const V = [{ name: 'his-angle', eye: his, at: [0, 1, 2].map((k) => (c[k] + at(1000 + 0.75 * L).pos[k]) / 2), fov: 60, far: 9000 }, { name: 'wide',eye: [c[0] + 0.5 * Rr, c[1] + 0.6 * Rr, c[2] - 0.6 * Rr], at: c, fov: 50, far: 9000 }, { name: 'front-close', eye: pt(1000 + 0.80 * L, -120, 140), at: pt(1000 + 0.93 * L, 0, 0), fov: 55, far: 3000 }];
    for (const share of [0.7, 0.85, 0.97]) { const x = 1000 + share * L; V.push({ name: `follow-${Math.round(share * 100)}`, eye: pt(x - 30, 0, 7), at: pt(x + 45, 0, 2), up: at(x - 30).U, fov: 75, far: 2500 }); }
    for (const v of V) fs.writeFileSync(path.join(OUT, `${name}-${v.name}.png`), render(tris, v));
    console.log(`${name}: HUD bank ${st.hud.bank.toFixed(2)}, gravity ${st.hud.gravity.map((x) => x.toFixed(2)).join(' -> ')}; mesh ${tris.length} triangles in ${g.batches.length} batches; inverted ${inverted}; neighbour flips over 90° ${flips} (worst ${worstNb.toFixed(1)}°); centreline nearest itself ${nearM.toFixed(1)} m (s ${nearAt ? nearAt.map((x) => x.toFixed(0)).join(' / ') : '-'}); views ${V.map((x) => x.name).join(', ')}`);
  }
})().catch((e) => { console.log('ERR', e.stack || e); process.exit(1); });
