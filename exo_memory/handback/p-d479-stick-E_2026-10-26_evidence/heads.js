// heads.js (D479, pane E): READ-ONLY. For every file in the stick's tails folder: does it start like a JSONL record ('{'),
// and does its first 16 bytes match the 55 aa 55 aa pattern? Also a 4 KiB read from the middle and the end. Prints hex only, never content.
'use strict';
const fs = require('fs'), path = require('path');
const dir = 'D:/consonance-L-20260911/consonance-tails';
const at = (fd, pos, n) => { const b = Buffer.alloc(n); const r = fs.readSync(fd, b, 0, n, pos); return b.subarray(0, r); };
const rows = [];
for (const n of fs.readdirSync(dir).sort()) {
  const p = path.join(dir, n), st = fs.statSync(p); if (!st.isFile() || st.size === 0) continue;
  const fd = fs.openSync(p, 'r');
  try {
    const h = at(fd, 0, 16), mid = at(fd, Math.floor(st.size / 2), 4096), end = at(fd, Math.max(0, st.size - 4096), 4096);
    const json = h[0] === 0x7b, pat = h.slice(0, 4).equals(Buffer.from([0x55, 0xaa, 0x55, 0xaa]));
    const zeros = (b) => b.every((x) => x === 0), text = (b) => b.filter((x) => x >= 0x20 && x < 0x7f || x === 0x0a).length / b.length;
    rows.push({ n, size: st.size, mtime: st.mtime.toISOString().slice(0, 16), json, pat, head: h.slice(0, 8).toString('hex'), midText: text(mid).toFixed(2), endText: text(end).toFixed(2), endZero: zeros(end) });
  } finally { fs.closeSync(fd); }
}
for (const r of rows) console.log([r.mtime, r.n.slice(0, 8), r.n.slice(37), r.size, r.json ? 'JSON' : r.pat ? '55AA' : 'other', r.head, 'mid printable', r.midText, 'end printable', r.endText, r.endZero ? 'END ZEROS' : ''].join(' | '));
console.log('files', rows.length, 'json-start', rows.filter((r) => r.json).length, '55aa-start', rows.filter((r) => r.pat).length, 'other', rows.filter((r) => !r.json && !r.pat).length);
