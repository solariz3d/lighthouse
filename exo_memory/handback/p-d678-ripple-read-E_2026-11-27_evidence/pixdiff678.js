// pixdiff678.js (pane E, D678): the two trees' pictures compared pixel by pixel (the burned-in sha label, top-left 160x80, left out): how many pixels differ by
// more than 8 of 255 in any channel, the largest difference, and the box they fall in. usage: node pixdiff678.js <tree for png.js> <picsDir>
'use strict';
const path = require('path'), fs = require('fs'), { decodePng } = require(path.join(path.resolve(process.argv[2]), 'src/texture/png.js')), dir = process.argv[3];
for (const scene of ['extend', 'sharp']) for (const view of ['driver', 'driver-edge', 'above']) {
  const a = decodePng(fs.readFileSync(path.join(dir, `${scene}_${view}_e112a14.png`))), b = decodePng(fs.readFileSync(path.join(dir, `${scene}_${view}_c2591bf.png`)));
  let n = 0, max = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < a.height; y++) for (let x = 0; x < a.width; x++) {
    if (x < 160 && y < 80) continue;
    const i = 4 * (y * a.width + x); let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(a.rgba[i + c] - b.rgba[i + c]));
    max = Math.max(max, d); if (d > 8) { n++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  console.log(`${scene} ${view} ${a.width}x${a.height}: ${n} pixels differ by more than 8 (${((100 * n) / (a.width * a.height)).toFixed(3)}%), largest ${max}${n ? `, in x ${x0}..${x1}, y ${y0}..${y1}` : ''}`);
}
