// expdigest.js <repo> <doc>: a document's export as the page builds it (the core shell's buildExport with the page's road surface), in memory, under
// node: one sha256 per file (the builder's marker read without its "written" time) and one over all. Compare two trees' lines to see the bytes moved or not.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [, , REPO, DOCF] = process.argv;
const rq = (p) => require(path.join(REPO, p));
(async () => {
  const { createCoreShell } = rq('app/core/coreshell.js'), { makeExporter } = rq('app/export/export.js'), { createCoreTextures } = rq('app/core/textures.js');
  const ex = await makeExporter(async (p) => fs.readFileSync(path.join(REPO, p), 'utf8'), { author: () => 'D583 landing' });
  const text = fs.readFileSync(DOCF, 'utf8');
  const s = await createCoreShell({ storage: { openDoc: async () => text, openUndo: async () => null }, exporter: ex, brushFn: null, autosaveMs: 0 });
  await s.open('X');
  const textures = createCoreTextures({ segments: () => s.getState().resolved.segments, closed: () => !!s.getState().resolved.closed, edge: true }).current();
  const out = s.buildExport({ textures }), all = crypto.createHash('sha256');
  for (const f of out.folders) for (const file of f.files) {
    let b = Buffer.from(file.bytes.buffer, file.bytes.byteOffset, file.bytes.byteLength);
    if (/\.t180b-builder\.json$/.test(file.path)) b = Buffer.from(b.toString('utf8').replace(/"written": "[^"]*"/, '"written": "-"'));
    const h = crypto.createHash('sha256').update(b).digest('hex').slice(0, 16); all.update(`${f.folder}/${file.path}\0${h}\0`);
    console.log(`${h} ${String(b.length).padStart(10)} ${f.folder}/${file.path}`);
  }
  console.log(`ALL ${all.digest('hex').slice(0, 16)}`);
})().catch((e) => { console.log('FATAL ' + e.stack); process.exit(1); });
