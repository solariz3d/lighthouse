// cut.js (D604 redo, O): an END-ON CUT of a kn5. Every triangle of every mesh is sliced by the plane through `pos` normal to `T` (the road's tangent), and the
// cut lines within `half` metres of pos are drawn as seen straight along the road (world up kept up), coloured by what they are:
//   road (1ROAD_/1GRIPnnn_ but not APRON) light grey · physics plank (…APRON_…) orange · underside (UNDERSKIN_…) blue · join (APRONSIDE_…) red · anything else green.
// A 1 m grid, a scale bar and a legend. Pure node (zlib PNG), no window. Also prints, per family, the cut's segment count and its vertical extent.
// node cut.js <kn5> <cuts.json> <out dir> [prefix]     cuts.json: [{ name, pos: [x,y,z], T: [x,y,z], half?: metres (default 14) }]
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { readKn5Full } = require('./kn5full.js');
const [, , KN5, CUTS, OUT, PREFIX = ''] = process.argv;
const W = 1800, H = 1100, kn = readKn5Full(KN5), cuts = JSON.parse(fs.readFileSync(CUTS, 'utf8'));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], unit = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
const family = (n) => (/APRONSIDE_/.test(n) ? 'join' : /^UNDERSKIN_/.test(n) ? 'underside' : /^1(ROAD|GRIP\d{3})_APRON_/.test(n) ? 'plank' : /^1(ROAD|GRIP\d{3})_/.test(n) ? 'road' : 'other');
const COL = { road: [215, 215, 215], plank: [255, 150, 30], underside: [60, 130, 255], join: [235, 40, 40], other: [60, 200, 90] };
const ORDER = ['underside', 'join', 'other', 'road', 'plank'];
function png(px) {
  const raw = Buffer.alloc((W * 3 + 1) * H); for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; px.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3); }
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W, 0); ih.writeUInt32BE(H, 4); ih[8] = 8; ih[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
// a 5x7 bitmap font for the legend and labels (digits, a few letters)
const FONT = { '0': '0e1113151911 0e', '1': '040c0404040e', '2': '0e11010e101f', '3': '1e010e01011e', '4': '02060a121f02', '5': '1f101e01011e', '6': '0e101e11110e', '7': '1f0102040808', '8': '0e110e11110e', '9': '0e110f01010e', 'm': '00001a15151515', ' ': '000000000000', '.': '00000000000c', '-': '0000001f0000' };
fs.mkdirSync(OUT, { recursive: true });
for (const c of cuts) {
  const T = unit(c.T), right = unit(cross(T, [0, 1, 0])), up = cross(right, T), half = c.half || 14, P0 = c.pos;
  const segs = [];
  for (const m of kn.meshes) {
    if (!m.renderable && !/^1(ROAD|GRIP)/.test(m.name)) continue;
    const f = family(m.name), d = new Float64Array(m.pos.length / 3);
    for (let i = 0; i < d.length; i++) d[i] = (m.pos[i * 3] - P0[0]) * T[0] + (m.pos[i * 3 + 1] - P0[1]) * T[1] + (m.pos[i * 3 + 2] - P0[2]) * T[2];
    for (let t = 0; t < m.idx.length; t += 3) {
      const ids = [m.idx[t], m.idx[t + 1], m.idx[t + 2]], ds = ids.map((i) => d[i]);
      if (Math.min(...ds) > 0 || Math.max(...ds) < 0) continue;
      const pts = [];
      for (let e = 0; e < 3; e++) {
        const a = ids[e], b = ids[(e + 1) % 3], da = d[a], db = d[b];
        if ((da <= 0 && db > 0) || (da > 0 && db <= 0)) { const s = da / (da - db); const p = [0, 1, 2].map((k) => m.pos[a * 3 + k] + s * (m.pos[b * 3 + k] - m.pos[a * 3 + k])); pts.push(p); }
      }
      if (pts.length < 2) continue;
      const q = pts.slice(0, 2).map((p) => { const r = sub(p, P0); return [dot(r, right), dot(r, up)]; });
      if (Math.hypot(...q[0]) > half * 1.5 && Math.hypot(...q[1]) > half * 1.5) continue;
      segs.push({ f, a: q[0], b: q[1], name: m.name });
    }
  }
  // frame: centred on the cut's extent, 1:1 aspect
  const xs = segs.flatMap((s) => [s.a[0], s.b[0]]), ys = segs.flatMap((s) => [s.a[1], s.b[1]]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const span = Math.max(Math.max(...xs) - Math.min(...xs), (Math.max(...ys) - Math.min(...ys)) * W / H, 4) * 1.12, ppm = W / span;
  const X = (x) => W / 2 + (x - cx) * ppm, Y = (y) => H / 2 - (y - cy) * ppm;
  const px = Buffer.alloc(W * H * 3, 255);
  const put = (x, y, col) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; px[(y * W + x) * 3] = col[0]; px[(y * W + x) * 3 + 1] = col[1]; px[(y * W + x) * 3 + 2] = col[2]; };
  const line = (x0, y0, x1, y1, col, th = 1) => { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) + 1; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; for (let a = -th; a <= th; a++) for (let b = -th; b <= th; b++) if (a * a + b * b <= th * th) put(x + a, y + b, col); } };
  const text = (s, x, y, col, k = 3) => { for (const ch of s) { const g = FONT[ch] || FONT[' ']; const rows = g.replace(/ /g, '').match(/../g).map((h) => parseInt(h, 16)); rows.forEach((r, j) => { for (let i = 0; i < 5; i++) if (r & (1 << (4 - i))) for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) put(x + i * k + a, y + j * k + b, col); }); x += 6 * k; } };
  // 1 m grid
  for (let g = Math.floor(cx - span); g <= cx + span; g++) line(X(g), 0, X(g), H - 1, g === 0 ? [205, 205, 205] : [238, 238, 238], 0);
  for (let g = Math.floor(cy - span); g <= cy + span; g++) line(0, Y(g), W - 1, Y(g), [238, 238, 238], 0);
  const th = Math.max(1, Math.round(ppm / 70));
  for (const f of ORDER) for (const s of segs.filter((z) => z.f === f)) line(X(s.a[0]), Y(s.a[1]), X(s.b[0]), Y(s.b[1]), COL[f], f === 'road' || f === 'plank' ? th + 1 : th);
  // legend and scale
  let ly = 24; for (const f of ['road', 'plank', 'underside', 'join', 'other']) { line(24, ly + 10, 84, ly + 10, COL[f], 4); ly += 34; }
  line(W - 24 - ppm, H - 30, W - 24, H - 30, [0, 0, 0], 2); text('1 m', W - 24 - ppm, H - 64, [0, 0, 0]);
  fs.writeFileSync(path.join(OUT, `${PREFIX}cut-${c.name}.png`), png(px));
  const by = {}; for (const s of segs) { const b = by[s.f] || (by[s.f] = { n: 0, ylo: Infinity, yhi: -Infinity }); b.n++; b.ylo = Math.min(b.ylo, s.a[1], s.b[1]); b.yhi = Math.max(b.yhi, s.a[1], s.b[1]); }
  // CLEARANCE in the cut: the least distance from any underside or join point (segment ends, and 10 points along each) to any road segment, in metres
  const segDist = (p, s0) => { const d = [s0.b[0] - s0.a[0], s0.b[1] - s0.a[1]], l2 = d[0] * d[0] + d[1] * d[1]; let t = l2 > 0 ? ((p[0] - s0.a[0]) * d[0] + (p[1] - s0.a[1]) * d[1]) / l2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - s0.a[0] - t * d[0], p[1] - s0.a[1] - t * d[1]); };
  const roadS = segs.filter((z) => z.f === 'road'); let clear = Infinity, where = null;
  for (const z of segs.filter((z) => z.f === 'underside' || z.f === 'join')) for (let i = 0; i <= 10; i++) { const p = [z.a[0] + (z.b[0] - z.a[0]) * i / 10, z.a[1] + (z.b[1] - z.a[1]) * i / 10]; for (const r of roadS) { const d = segDist(p, r); if (d < clear) { clear = d; where = p.map((x) => +x.toFixed(2)); } } }
  console.log(c.name, 'clearance underside/join to road', clear.toFixed(3), 'm at', JSON.stringify(where));
  console.log(c.name, JSON.stringify(Object.fromEntries(Object.entries(by).map(([k, v]) => [k, `${v.n} segs, y ${v.ylo.toFixed(2)}..${v.yhi.toFixed(2)}`]))), `${ppm.toFixed(0)} px/m`);
}
