// silhouette678.js (pane E, D678): on each driver's picture, the road's upper silhouette (the first non-sky row from the top, per column), before against after:
// the largest move in pixels and the columns it is in. usage: node silhouette678.js <tree for png.js> <picsDir>
'use strict';
const path = require('path'), fs = require('fs'), { decodePng } = require(path.join(path.resolve(process.argv[2]), 'src/texture/png.js')), dir = process.argv[3];
const top = (im, x) => { for (let y = 80; y < im.height; y++) { const i = 4 * (y * im.width + x); if (Math.abs(im.rgba[i] - 24) + Math.abs(im.rgba[i + 1] - 28) + Math.abs(im.rgba[i + 2] - 36) > 30) return y; } return -1; };
for (const scene of ['extend', 'sharp']) for (const view of ['driver', 'driver-edge']) {
  const a = decodePng(fs.readFileSync(path.join(dir, `${scene}_${view}_e112a14.png`))), b = decodePng(fs.readFileSync(path.join(dir, `${scene}_${view}_c2591bf.png`)));
  let max = 0, at = -1, moved = 0; for (let x = 0; x < a.width; x++) { const d = Math.abs(top(a, x) - top(b, x)); if (d > 0) moved++; if (d > max) { max = d; at = x; } }
  console.log(`${scene} ${view}: the silhouette moves in ${moved} of ${a.width} columns, at most ${max} px (column ${at}: ${top(a, at)} -> ${top(b, at)})`);
}
