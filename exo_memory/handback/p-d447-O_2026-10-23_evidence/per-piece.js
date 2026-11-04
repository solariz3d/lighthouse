'use strict';
// D447 §10 (O): from a probe447h.js log, the press lap's mean / least lean (°) over the curved stations of the named pieces, and the finder's flips.   node per-piece.js <log>
const t = require('fs').readFileSync(process.argv[2], 'utf8').split(/^(?=\[)/m);
const want = { x58: ['p8'], x60: ['p8'], x62: ['p8'], x66: ['p8'], x70: ['p8'], x72: ['p8'], x80: ['p6', 'p7', 'p8'], x100: ['p6', 'p7', 'p8'], x120: ['p6', 'p7', 'p8', 'p13'], s5: ['p8'], t50w: ['p8'], t100: ['p8'], e60: ['p9'],
  short60: ['p7', 'p8'], short100: ['p7', 'p8'], short140: ['p7', 'p8'], short200: ['p7', 'p8'], 'g1200-100w300': ['p8', 'p9'], 'g3000-100w300': ['p8', 'p9'], 'g10000-100w300': ['p6', 'p7', 'p8'], sharp: ['p6', 'p7'], ramp40: ['p6', 'p7'] };
for (const b of t) { const n = (b.match(/^\[([^\]]+)\]/) || [])[1]; if (!want[n]) continue;
  const pl = (b.match(/press lap per piece: (.*)/) || [])[1] || '', fl = (b.match(/flipsOf \(or gap <= 30\): ([^;]*)/) || [])[1];
  console.log(n.padEnd(16), want[n].map((id) => { const m = pl.split(" ").map((w, k, a) => [w, a]).length && (() => { const ws = pl.split(" "), k = ws.findIndex((w) => w.startsWith(id + ":n")); return k < 0 ? null : [null, ws[k + 2].slice(4), ws[k + 3].slice(3)]; })(); return `${id} ${m ? m[1] + ' / ' + m[2] : '-'}`; }).join('   '), '| flips (close() lap)', fl); }
