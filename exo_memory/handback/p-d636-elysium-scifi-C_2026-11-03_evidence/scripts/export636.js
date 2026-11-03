// export599.js <repo> <track copy> <spec> <outDir>: D636 (from D599), from D358's export_a.js. His ELYSIUM NEW (a copy) opened in the core shell under the name
// "ELYSIUM NEW SCIFI 0439", the recipe as every road piece's floor (2048 px, 35 m across, 20 m along), exported through coreshell.buildExport({ textures }).
// No undo file is given (his .t180undo is not read). Writes only under <outDir>.
const path = require('path'), fs = require('fs'), os = require('os');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [REPO, T, SPEC, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const { createCoreShell } = require(path.join(REPO, 'app/core/coreshell.js')), { makeExporter } = require(path.join(REPO, 'app/export/export.js'));
const TS = require(path.join(REPO, 'src/texture/set.js'));
(async () => {
  const ex = await makeExporter(async (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8'));
  const store = { openDoc: async () => fs.readFileSync(T, 'utf8'), listDocs: async () => ['eq-ELYSIUM NEW SCIFI 0439'] };
  const s = await createCoreShell({ storage: store, exporter: ex, brushFn: null, autosaveMs: 0 }); await s.open('ELYSIUM NEW SCIFI 0439');
  console.log('open note:', s.getState().message, '| export name:', s.exportDoc().name, '| closed:', s.getState().resolved.closed);
  const segs = s.getState().resolved.segments, make = fs.readFileSync(SPEC, 'utf8');
  const ids = [...new Set(segs.filter((g) => g.kind === 'road').map((g) => g.id))];
  const set = TS.buildTextureSet({ words: ids.map((id) => ({ id, word: 'straight', font: 'flat', textures: { floor: { make, size: 2048, tileWidth: 35, tileLength: 20 } } })) });
  console.log('road pieces:', ids.length, '| texture set:', set.textures.map((x) => `${x.name} ${x.width}x${x.height}`).join(', '), '| warnings:', JSON.stringify(set.warnings).slice(0, 300));
  const t0 = Date.now(), out = s.buildExport({ textures: set }), r = out.result;
  console.log(`BUILT in ${((Date.now() - t0) / 1000).toFixed(0)} s; length ${r.lengthM.toFixed(1)} m; kn5 ${r.kn5Bytes} B sha ${r.kn5Sha}; folders ${out.folders.map((f) => f.folder).join(',')}`);
  console.log('warnings:', (r.warnings || []).map((w) => w.slice(0, 160)).join(' || '));
  for (const f of out.folders) for (const file of f.files) {
    const p = path.join(OUT, f.folder, file.path || file.name); fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, Buffer.from(file.bytes || file.data || file.content));
  }
  console.log('files:', out.folders.map((f) => f.folder + ': ' + f.files.map((x) => x.path || x.name).join(' ')).join(' | '));
})().catch((e) => { console.log('ERR', e.stack || e); process.exit(1); });
