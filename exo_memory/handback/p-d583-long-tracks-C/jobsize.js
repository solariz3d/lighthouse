// jobsize.js <repo> <doc>...: the export job the page posts to the export's process (app/export/exportjob.js packJob of shell.exportArgs, the road surface
// as the page passes it): its JSON length and structuredClone time (a stand-in for the cross-process copy), per document.
'use strict';
const fs = require('fs'), path = require('path');
const [, , REPO, ...DOCS] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const { createCoreShell } = rq('app/core/coreshell.js');
const { createCoreTextures } = rq('app/core/textures.js');
const J = rq('app/export/exportjob.js');
(async () => {
  for (const f of DOCS) {
    const text = fs.readFileSync(f, 'utf8');
    const s = await createCoreShell({ storage: { openDoc: async () => text, openUndo: async () => null }, exporter: { runSegments() {} }, brushFn: null, autosaveMs: 0 });
    await s.open('X');
    const textures = createCoreTextures({ segments: () => s.getState().resolved.segments, closed: () => !!s.getState().resolved.closed, edge: true }).current();
    const [segs, meta, o] = s.exportArgs({ textures });
    const job = J.packJob(segs, meta.liftPath ? { ...meta, liftDoc: s.getState().history.present } : meta, o);
    let t = Date.now(); const c = structuredClone(job); const clone = Date.now() - t;
    t = Date.now(); const len = JSON.stringify(job).length; const js = Date.now() - t;
    console.log(`${path.basename(f)}: segments ${segs.length}, job JSON ${(len / 1048576).toFixed(1)} M chars (${js} ms), structuredClone ${clone} ms`);
    void c;
  }
})().catch((e) => { console.log('FATAL ' + e.stack); process.exit(1); });
