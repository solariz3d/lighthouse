// plotbank.js <cases.json> <out.png>: D642 part 3, the bank along the piece (the core's own phi channel, every 10 m, dumped through the panel by cases.test.js) for his three
// cases, one line each, with the extra's mark (500 m) as a vertical line and level (0°) as a horizontal one. Software PNG, no browser.
//   blue: 1, the −90 alone; dashed white over it: 2, the −90 with extra turn 0 (identical); orange: 3, his p2 with the extra +180 and the bank brought back to −88.45
'use strict';
const fs = require('fs'), zlib = require('zlib');
const [IN, OUT] = process.argv.slice(2);
const C = JSON.parse(fs.readFileSync(IN, 'utf8')), names = Object.keys(C);
const W = 1200, H = 600, PADL = 70, PADR = 30, PADT = 30, PADB = 50, x0 = 0, x1 = 1000, y0 = -100, y1 = 100;
const rgb = Buffer.alloc(W * H * 3); for (let i = 0; i < W * H; i++) { rgb[i * 3] = 22; rgb[i * 3 + 1] = 26; rgb[i * 3 + 2] = 34; }
const X = (s) => PADL + ((s - x0) / (x1 - x0)) * (W - PADL - PADR), Y = (d) => PADT + ((y1 - d) / (y1 - y0)) * (H - PADT - PADB);
const put = (x, y, c, a = 1) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const o = (y * W + x) * 3; for (let k = 0; k < 3; k++) rgb[o + k] = Math.round(rgb[o + k] * (1 - a) + c[k] * a); };
const line = (ax, ay, bx, by, c, w = 2, dash = 0) => { const n = Math.ceil(Math.hypot(bx - ax, by - ay)); for (let i = 0; i <= n; i++) { if (dash && Math.floor(i / dash) % 2) continue; const x = ax + ((bx - ax) * i) / n, y = ay + ((by - ay) * i) / n; for (let dx = -w / 2; dx <= w / 2; dx++) for (let dy = -w / 2; dy <= w / 2; dy++) put(x + dx, y + dy, c); } };
for (let d = -90; d <= 90; d += 30) line(X(0), Y(d), X(1000), Y(d), d === 0 ? [140, 140, 150] : [50, 55, 66], d === 0 ? 2 : 1);   // level stronger, every 30°
for (let s = 0; s <= 1000; s += 100) line(X(s), Y(-100), X(s), Y(100), [50, 55, 66], 1);
line(X(500), Y(-100), X(500), Y(100), [230, 230, 120], 2, 8);   // the extra's mark
const style = [[[90, 150, 255], 4, 0], [[255, 255, 255], 2, 10], [[255, 150, 60], 4, 0]];
names.forEach((n, i) => { const b = C[n].bank, [c, w, dash] = style[i] || [[200, 200, 200], 2, 0]; for (let k = 1; k < b.length; k++) line(X(b[k - 1][0]), Y(b[k - 1][1]), X(b[k][0]), Y(b[k][1]), c, w, dash); });
const raw = Buffer.alloc((W * 3 + 1) * H); for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; rgb.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3); }
const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
fs.writeFileSync(OUT, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
const b3 = C[names[2]].bank, at = (s) => b3.find(([x]) => x === s)[1], top = b3.filter(([s]) => s >= 500 && s <= 700).reduce((m, p) => (p[1] > m[1] ? p : m));
console.log(`case 3: ${at(500)}° at the mark (500 m), a top of ${top[1]}° at ${top[0]} m, ${at(1000)}° at the end`);
