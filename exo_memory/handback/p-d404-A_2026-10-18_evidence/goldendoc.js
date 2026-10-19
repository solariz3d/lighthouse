const path = require('path'), crypto = require('crypto'); const r = process.argv[2];
const { createCoreShell } = require(path.join(r, 'app/core/coreshell.js')); const TB = require(path.join(r, 'src/core/turnby.js'));
(async () => {
  const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh.extend({ length: 300 }); sh.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); sh.extend({ length: 75, transition: 30, targets: { w: 25 } });
  const doc = sh.exportDoc(), parts = [doc.pieces, TB.extendCorner(doc, { length: 1500, turnDeg: 33, targets: { phi: 0.1 } }).pieces.at(-1), TB.extendCorner(doc, { length: 400, turnDeg: -75, climbDeg: 4 }).pieces.at(-1), TB.extendCorner(doc, { length: 2200 }).pieces.at(-1)];
  console.log(crypto.createHash('sha256').update(JSON.stringify(parts)).digest('hex').slice(0, 16));
})();
