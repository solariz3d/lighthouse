// row5.js (pane E, L264 read, the librarian's item 1): drag-ghost row 5's own documents, on one tree. Prints the OLD pin's hash (c2d7cb5's, wd out), the NEW pin's
// (wd out, and the corners' w out), each corner's width at its end and its widest along the piece, the head the corners start from, and whether the corners'
// OTHER channels and their knots equal c522ea6's (by a per-channel hash printed for comparison). usage: node row5.js <tree>
'use strict';
const path = require('path'), crypto = require('crypto');
const T = path.resolve(process.argv[2]);
const TB = require(path.join(T, 'src/core/turnby.js')), D = require(path.join(T, 'src/core/document.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
(async () => {
  const sh0 = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh0.extend({ length: 300 });   // the row's bowl()
  sh0.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); sh0.extend({ length: 75, transition: 30, targets: { w: 25 } });
  const doc0 = sh0.exportDoc(), parts = [doc0.pieces, TB.extendCorner(doc0, { length: 1500, turnDeg: 33, targets: { phi: 0.1 } }).pieces.at(-1), TB.extendCorner(doc0, { length: 400, turnDeg: -75, climbDeg: 4 }).pieces.at(-1), TB.extendCorner(doc0, { length: 2200 }).pieces.at(-1)];
  const noWd = (P) => { const { wd, ...channels } = P.channels; return { ...P, channels }; };
  const noW = (P) => { const { w, ...channels } = noWd(P).channels; return { ...P, channels }; };
  const out = { tree: process.argv[2], oldPin: h([parts[0].map(noWd), ...parts.slice(1).map(noWd)]), newPin: h([parts[0].map(noWd), ...parts.slice(1).map(noW)]),
    placedOnly: h(parts[0].map(noWd)), head: D.pieceEnd(doc0.pieces.at(-1)).w, corners: [] };
  for (const P of parts.slice(1)) {
    let wMax = -Infinity, wMin = Infinity; for (let k = 0; k <= 2000; k++) { const v = D.channelValue(P, 'w', (P.length * k) / 2000); wMax = Math.max(wMax, v); wMin = Math.min(wMin, v); }
    const per = {}; for (const ch of Object.keys(P.channels)) per[ch] = h(P.channels[ch]);
    out.corners.push({ length: P.length, end: D.pieceEnd(P).w, wMin: +wMin.toFixed(4), wMax: +wMax.toFixed(4), knots: h(P.knots), rest: h({ ...noW(P), channels: undefined }), per });
  }
  console.log(JSON.stringify(out));
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });
