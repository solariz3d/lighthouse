// plot641.js <repo> <opts2.json> <out.png>: D641 item 1. Where every handle stands on screen (the real panel and handles, opts2.test.js) at E's cameras 1×, 1.6× and 2.4×, side by side,
// each panel cropped around the piece and drawn at 1:1. A filled dot is a base handle in its kind's colour; a ring is an extra handle; the extra width and cup carry a faint
// 36 px circle (CLEAR_PX), so a dot inside it is a handle closer than that. Software PNG, no browser.
'use strict';
const path = require('path'), fs = require('fs'), zlib = require('zlib');
const [REPO, IN, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const HD = require(path.join(REPO, 'app/core/handles.js'));
const data = JSON.parse(fs.readFileSync(IN, 'utf8')).handles, ks = Object.keys(data);
const S = 1, PW = 220, PH = 600, W = PW * ks.length, H = PH;
const rgb = Buffer.alloc(W * H * 3); for (let i = 0; i < W * H; i++) { rgb[i * 3] = 20; rgb[i * 3 + 1] = 24; rgb[i * 3 + 2] = 32; }
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const put = (x, y, c, a = 1) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const o = (y * W + x) * 3; for (let k = 0; k < 3; k++) rgb[o + k] = Math.round(rgb[o + k] * (1 - a) + c[k] * a); };
const disc = (cx, cy, r, c, ring = false, a = 1) => { for (let y = -r - 1; y <= r + 1; y++) for (let x = -r - 1; x <= r + 1; x++) { const d = Math.hypot(x, y); if (ring ? Math.abs(d - r) < 1 : d <= r) put(cx + x, cy + y, c, a); } };
ks.forEach((k, i) => {
  const L = data[k], xs = L.map((h) => h.x), ys = L.map((h) => h.y), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const at = (h) => [i * PW + PW / 2 + (h.x - cx) * S, PH / 2 + (h.y - cy) * S];
  for (let y = 0; y < PH; y++) put(i * PW, y, [70, 70, 80]);
  for (const h of L) { const K = HD.KINDS[h.kind]; if (K && K.extra && /^(width|cup)$/.test(K.base)) { const [x, y] = at(h); disc(x, y, 36 * S, [255, 255, 255], true, 0.18); } }
  for (const h of L) { const K = HD.KINDS[h.kind], c = hex((K && K.colour) || '#ffffff'), [x, y] = at(h); if (K && K.extra) disc(x, y, 7, c, true); else disc(x, y, 6, c); }
  console.log(`${k}×: ${L.length} handles over ${(Math.max(...ys) - Math.min(...ys)).toFixed(0)} px`);
});
const raw = Buffer.alloc((W * 3 + 1) * H); for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; rgb.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3); }
const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
fs.writeFileSync(OUT, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
