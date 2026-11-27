// dg5hash.js (pane B, L264): drag-ghost row 5's documents (its very calls), hashed as the row hashes them: (a) the row's own hash (wd taken out); (b) with the three corner
// solves' WIDTH channel taken out too. On c522ea6 and on the branch, (b) must be the same: then everything but the corners' width is as it was. usage: node dg5hash.js <tree>
'use strict';
const path = require('path'), crypto = require('crypto');
const T = path.resolve(process.argv[2]);
const TB = require(path.join(T, 'src/core/turnby.js')), D = require(path.join(T, 'src/core/document.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
(async () => {
  const sh0 = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh0.extend({ length: 300 });
  sh0.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); sh0.extend({ length: 75, transition: 30, targets: { w: 25 } });
  const doc0 = sh0.exportDoc(), parts = [doc0.pieces, TB.extendCorner(doc0, { length: 1500, turnDeg: 33, targets: { phi: 0.1 } }).pieces.at(-1), TB.extendCorner(doc0, { length: 400, turnDeg: -75, climbDeg: 4 }).pieces.at(-1), TB.extendCorner(doc0, { length: 2200 }).pieces.at(-1)];
  const noWd = (P) => { const { wd, ...channels } = P.channels; return { ...P, channels }; };
  const noW = (P) => { const { w, ...channels } = noWd(P).channels; return { ...P, channels }; };
  const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
  console.log(`(a) the row's hash: ${h([parts[0].map(noWd), ...parts.slice(1).map(noWd)])}`);
  console.log(`(b) the corners' width out too: ${h([parts[0].map(noWd), ...parts.slice(1).map(noW)])}`);
  console.log(`the head: ${JSON.stringify(D.pieceEnd(doc0.pieces.at(-1)).w)}; the corners' width ends: ${parts.slice(1).map((P) => JSON.stringify(D.pieceEnd(P).w)).join(' ')}`);
})().catch((e) => { console.error('probe failed:', e); process.exit(1); });
