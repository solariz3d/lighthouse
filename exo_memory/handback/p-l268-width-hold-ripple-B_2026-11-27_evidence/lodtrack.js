// lodtrack.js (pane B, L268): preview-lod-frame's own 100 km track (its longTrack, the same calls), on ONE tree: the saved text's hash, and how many of its pieces were
// laid from a head whose width was still changing (where the hold fires). usage: node lodtrack.js <tree>
'use strict';
const path = require('path'), crypto = require('crypto'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const R = 400, Q = (Math.PI * R) / 2; let m = 0, i = 0, d = D.createDoc('Long'), held = 0;
while (m < 100000) { const head = d.pieces.length ? D.endState(d).w : null; if (head && head.m !== 0) held++;
  if (i % 4 === 3) { d = TB.extendCorner(d, { length: Q, transition: 60, targets: { kh: (i % 8 === 3 ? 1 : -1) / R } }); m += Q; } else { d = TB.extendCorner(d, { length: 800, ...(i === 0 ? { family: 'bowl' } : {}) }); m += 800; } i++; }
console.log(`pieces ${d.pieces.length}; laid from a head whose width was still changing: ${held}; the track's text ${crypto.createHash('sha256').update(D.serialize(d)).digest('hex').slice(0, 16)}`);
