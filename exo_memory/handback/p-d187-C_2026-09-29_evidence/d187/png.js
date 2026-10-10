// png.js: a minimal PNG reader (8-bit RGB / RGBA, non-interlaced, filters 0-4) for scoring captures. No dependencies.
'use strict';
const fs = require('fs'), zlib = require('zlib');
function readPng(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) !== 0x89504e47) throw new Error(`${file}: not a PNG`);
  let p = 8, w = 0, h = 0, depth = 0, type = 0, inter = 0; const idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), t = b.toString('ascii', p + 4, p + 8), d = b.subarray(p + 8, p + 8 + len);
    if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; type = d[9]; inter = d[12]; }
    else if (t === 'IDAT') idat.push(d);
    else if (t === 'IEND') break;
    p += 12 + len;
  }
  if (depth !== 8 || (type !== 2 && type !== 6) || inter) throw new Error(`${file}: unsupported PNG (depth ${depth}, type ${type}, interlace ${inter})`);
  const bpp = type === 6 ? 4 : 3, stride = w * bpp, raw = zlib.inflateSync(Buffer.concat(idat)), px = Buffer.alloc(w * h * 3);
  let prev = Buffer.alloc(stride), cur = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, up = prev[i], c = i >= bpp ? prev[i - bpp] : 0; let v = row[i];
      if (f === 1) v += a; else if (f === 2) v += up; else if (f === 3) v += (a + up) >> 1;
      else if (f === 4) { const pp = a + up - c, pa = Math.abs(pp - a), pb = Math.abs(pp - up), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      cur[i] = v & 255;
    }
    for (let x = 0; x < w; x++) { px[(y * w + x) * 3] = cur[x * bpp]; px[(y * w + x) * 3 + 1] = cur[x * bpp + 1]; px[(y * w + x) * 3 + 2] = cur[x * bpp + 2]; }
    [prev, cur] = [cur, prev];
  }
  return { w, h, px, at: (x, y) => { const i = (y * w + x) * 3; return [px[i], px[i + 1], px[i + 2]]; } };
}

// WCAG 2.x relative luminance and contrast
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/**
 * Score one label rectangle (device px in the capture) the sealed way (E's M5, as C holds it): the background is the rect's
 * median pixel (by luminance); ink is every pixel whose summed |dRGB| from it exceeds 12; contrast is the median ink pixel (by
 * luminance) against the background; ink height is the tallest 8-connected ink component that does not touch the rect's edge
 * (a glyph), in device rows.
 */
function scoreRect(img, r) {
  const x0 = Math.max(0, Math.round(r.x)), y0 = Math.max(0, Math.round(r.y)), x1 = Math.min(img.w, Math.round(r.x + r.w)), y1 = Math.min(img.h, Math.round(r.y + r.h));
  const W = x1 - x0, H = y1 - y0; if (W < 3 || H < 3) return { error: 'rect outside the capture', rect: [x0, y0, W, H] };
  const all = []; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) all.push(img.at(x, y));
  const byLum = all.map((c) => [lum(c), c]).sort((a, b) => a[0] - b[0]), bg = byLum[byLum.length >> 1][1];
  const inkMask = new Uint8Array(W * H), ink = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = img.at(x0 + x, y0 + y); if (Math.abs(c[0] - bg[0]) + Math.abs(c[1] - bg[1]) + Math.abs(c[2] - bg[2]) > 12) { inkMask[y * W + x] = 1; ink.push(c); } }
  if (!ink.length) return { bg, inkPixels: 0, contrast: 1, inkHeight: 0 };
  const inkSorted = ink.map((c) => [lum(c), c]).sort((a, b) => a[0] - b[0]), medInk = inkSorted[inkSorted.length >> 1][1];
  // glyphs: connected ink components not touching the rect's edge
  const seen = new Uint8Array(W * H); let tallest = 0, edgeTouching = 0;
  for (let i = 0; i < W * H; i++) {
    if (!inkMask[i] || seen[i]) continue;
    const st = [i]; seen[i] = 1; let top = H, bot = -1, touches = false;
    while (st.length) {
      const j = st.pop(), y = (j / W) | 0, x = j - y * W; top = Math.min(top, y); bot = Math.max(bot, y);
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touches = true;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const k = yy * W + xx; if (inkMask[k] && !seen[k]) { seen[k] = 1; st.push(k); } }
    }
    if (touches) edgeTouching++; else tallest = Math.max(tallest, bot - top + 1);
  }
  return { bg, medInk, inkPixels: ink.length, contrast: +contrast(medInk, bg).toFixed(2), inkHeight: tallest, edgeTouchingInkComponents: edgeTouching, rect: [x0, y0, W, H] };
}
module.exports = { readPng, lum, contrast, scoreRect };
