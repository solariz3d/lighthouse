// golden.js <repo>: sha256 of the meshes the release makes (a placed 300 + 1000 m turn track; the full ghost of a 1000 m corner after it), for a byte-identity row
const path = require('path'), crypto = require('crypto'); const repo = process.argv[2];
const { createCoreShell } = require(path.join(repo, 'app/core/coreshell.js')); const { createTrackModel } = require(path.join(repo, 'app/preview/trackmodel.js'));
const hashBatches = (bs) => { const h = crypto.createHash('sha256'); for (const b of bs) { for (const k of ['positions', 'normals', 'uvs', 'indices']) if (b[k]) h.update(Buffer.from(b[k].buffer, b[k].byteOffset, b[k].byteLength)); if (b.model) h.update(Buffer.from(new Float64Array(b.model).buffer)); } return h.digest('hex').slice(0, 16); };
(async () => {
  const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh.extend({ length: 300 }); sh.extend({ length: 1000, targets: { kh: 1 / 700 } });
  const tm = createTrackModel(); const t = tm.update(sh.getState().resolved);
  const ghost = tm.ghostFor(sh.candidate({ length: 1000, turnDeg: 40 }));
  const ghost2 = tm.ghostFor(sh.candidate({ length: 700, turnDeg: -25 }, undefined));
  console.log(JSON.stringify({ placed: hashBatches(t.batches), ghost: hashBatches(ghost.batches), ghost2: hashBatches(ghost2.batches), segs: t.segments.length, ghostSegs: ghost.segments.length, batches: [t.batches.length, ghost.batches.length] }));
})();
