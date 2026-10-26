// blocks.js (D479, pane E): READ-ONLY. A stick tail against its local byte range in 4 KiB blocks: how many differ, the first few runs
// of bad blocks (start, length) and whether a bad block holds the 55 aa 55 aa pattern. Offsets and counts only, never content.
'use strict';
const fs = require('fs');
const [stickFile, localFile, from] = process.argv.slice(2), B = 4096;
const a = fs.openSync(stickFile, 'r'), b = fs.openSync(localFile, 'r'), size = fs.fstatSync(a).size;
const x = Buffer.alloc(B), y = Buffer.alloc(B); let bad = 0, runs = [], cur = null, pat = 0, zero = 0;
for (let off = 0; off < size; off += B) {
  const n = Math.min(B, size - off); fs.readSync(a, x, 0, n, off); fs.readSync(b, y, 0, n, +from + off);
  const eq = x.subarray(0, n).equals(y.subarray(0, n));
  if (!eq) { bad++; if (x[0] === 0x55 && x[1] === 0xaa) pat++; if (x.subarray(0, n).every((v) => v === 0)) zero++; if (cur && cur.end === off) cur.end = off + n; else { cur = { start: off, end: off + n }; runs.push(cur); } }
}
console.log(`size ${size} blocks ${Math.ceil(size / B)} bad ${bad} (${(100 * bad / Math.ceil(size / B)).toFixed(1)}%), runs ${runs.length}, bad blocks starting 55aa ${pat}, all-zero ${zero}`);
const lens = runs.map((r) => r.end - r.start), gcd = (p, q) => (q ? gcd(q, p % q) : p);
console.log('first runs (offset, bytes):', runs.slice(0, 6).map((r) => `${r.start}+${r.end - r.start}`).join(' '));
console.log('gcd of run starts and lengths:', runs.slice(0, 200).reduce((g, r) => gcd(gcd(g, r.start), r.end - r.start), 0));
