// D277 verify (B): where testexport.js (ff428fa7) put AC_TIME_0 / AC_AB_START on "TEST 1 recovered" (a COPY), as of 2026-10-05.
'use strict';
const fs = require('fs'), T = __dirname + '/ff428/', req = (m) => require(T + m);
const D = req('src/core/document.js'), AD = req('src/core/adapter.js'), { startLayout } = req('app/core/coreshell.js');
const d = D.parse(fs.readFileSync(__dirname + '/rec.copy', 'utf8')), segs = AD.toSegments(d), lift = (q) => AD.offsetPath(d, segs, q);
const start = { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch };
const lay = startLayout(segs, lift, start, { open: !d.closed });
const total = segs.reduce((a, g) => a + (g.length || 0), 0);
console.log('closed', d.closed, 'pieces', d.pieces.length, 'road length (segments)', total.toFixed(1));
console.log(JSON.stringify(lay, (k, v) => (typeof v === 'number' ? +v.toFixed(2) : v)).slice(0, 1500));
