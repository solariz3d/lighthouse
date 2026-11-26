// window_detail.js (pane C, L251): how much of the road's detail shows through the label window, at 40e931e (the canvas window, its fill unblurred over the road)
// and on the branch (the element, the look's blur behind its fill). Reads the two hover_bank.png pictures per look (pictures/<tree>/<look>/), decodes them (PNG,
// 8-bit RGB or RGBA, not interlaced: what Chrome writes), and inside the window's box less a 6 px margin (the words' rows left out: the band between the two
// lines' text and the box's edges is too thin, so the whole inner box is read and the words, the same on both trees, add the same to both) takes the mean
// absolute difference of luminance between horizontally adjacent pixels: the road's lines are edges, a blur flattens them.
// usage: node window_detail.js <pictures dir> <x> <y> <w> <h>
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const [dir, bx, by, bw, bh] = [process.argv[2], ...process.argv.slice(3).map(Number)];
function decode(file) {
  const b = fs.readFileSync(file); let p = 8, W = 0, H = 0, ct = 0; const idat = [];
  while (p < b.length) { const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8), d = b.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { W = d.readUInt32BE(0); H = d.readUInt32BE(4); if (d[8] !== 8 || d[12] !== 0) throw new Error('not 8-bit, or interlaced'); ct = d[9]; }
    if (type === 'IDAT') idat.push(d); p += 12 + len; }
  const bpp = ct === 6 ? 4 : ct === 2 ? 3 : 0; if (!bpp) throw new Error(`colour type ${ct}`);
  const raw = zlib.inflateSync(Buffer.concat(idat)), out = Buffer.alloc(W * H * bpp), st = W * bpp;
  for (let y = 0; y < H; y++) { const f = raw[y * (st + 1)], row = raw.subarray(y * (st + 1) + 1, (y + 1) * (st + 1));
    for (let i = 0; i < st; i++) { const a = i >= bpp ? out[y * st + i - bpp] : 0, u = y > 0 ? out[(y - 1) * st + i] : 0, c = y > 0 && i >= bpp ? out[(y - 1) * st + i - bpp] : 0;
      let v = row[i]; if (f === 1) v += a; else if (f === 2) v += u; else if (f === 3) v += (a + u) >> 1; else if (f === 4) { const pp = a + u - c, pa = Math.abs(pp - a), pb = Math.abs(pp - u), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? u : c; }
      out[y * st + i] = v & 255; } }
  return { W, H, bpp, px: out };
}
const lum = (im, x, y) => { const k = (y * im.W + x) * im.bpp; return 0.2126 * im.px[k] + 0.7152 * im.px[k + 1] + 0.0722 * im.px[k + 2]; };
function detail(file) {
  const im = decode(file); let s = 0, n = 0;
  for (let y = by + 6; y < by + bh - 6; y++) for (let x = bx + 6; x < bx + bw - 7; x++) { s += Math.abs(lum(im, x + 1, y) - lum(im, x, y)); n++; }
  return s / n;
}
for (const look of fs.readdirSync(path.join(dir, 'branch'))) {
  const a = detail(path.join(dir, 'base_40e931e', look, 'hover_bank.png')), b = detail(path.join(dir, 'branch', look, 'hover_bank.png'));
  console.log(`${look.padEnd(14)} detail in the window: 40e931e ${a.toFixed(2)}, branch ${b.toFixed(2)} (${(100 * (b - a) / a).toFixed(1)}%)`);
}
// the same box with no window (the rest pictures, the same view): what the road alone puts there
for (const look of fs.readdirSync(path.join(dir, 'branch'))) console.log(`${look.padEnd(14)} the road alone there (rest.png, branch): ${detail(path.join(dir, 'branch', look, 'rest.png')).toFixed(2)}`);
