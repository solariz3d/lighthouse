// diffpng.js <tree> <a.png> <b.png> <out.png>: per-pixel difference (max channel), amplified x4, and the share of pixels differing by more than 24/255
const fs = require('fs'), path = require('path'), T = process.argv[2], { decodePng, encodePng } = require(path.join(T, 'src/texture/png.js'));
const A = decodePng(fs.readFileSync(process.argv[3])), B = decodePng(fs.readFileSync(process.argv[4]));
if (A.width !== B.width || A.height !== B.height) throw new Error('sizes differ');
const out = new Uint8Array(A.width * A.height * 4); let big = 0, sum = 0;
for (let i = 0; i < A.width * A.height; i++) { let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(A.rgba[i * 4 + c] - B.rgba[i * 4 + c])); sum += d; if (d > 24) big++; const v = Math.min(255, d * 4); out[i * 4] = v; out[i * 4 + 1] = v; out[i * 4 + 2] = v; out[i * 4 + 3] = 255; }
fs.writeFileSync(process.argv[5], Buffer.from(encodePng({ width: A.width, height: A.height, rgba: out }, (b) => require('zlib').deflateSync(b))));
console.log(path.basename(process.argv[5]), 'pixels differing > 24/255:', (100 * big / (A.width * A.height)).toFixed(2) + '%', 'mean diff', (sum / (A.width * A.height)).toFixed(2));
