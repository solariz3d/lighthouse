'use strict';
// D434 build (O): a kn5 of a COPY of TEST TRACK 10 for the keeper to drive. Its open lap (the undo history's newest open state, fixtures-d431's copy) is finished by
// one tree's finishToStart, adopted by a core shell with the app's own exporter (app/export/export.js makeExporter, the files read from the tree, as the app's tests
// build it), and BUILT with the shell's buildExport (the same build Export and Install use; it writes nothing). The files it returns are written ONLY under
// <out dir> (the evidence folder's private tracks/kn5/): never into his tracks folder, never into Assetto Corsa's content folder. A refusal (e.g. RED) is printed.
//   node build-kn5.js <tree> <out dir> <export name>
const [TREE, OUT, NAME] = process.argv.slice(2);
const fs = require('fs'), path = require('path');
if (/content[\\/]+tracks/i.test(OUT) || /com\.solariz3d\.t180-track-builder/i.test(OUT)) throw new Error(`refusing to write into ${OUT}`);
(async () => {
  const D = require(path.join(TREE, 'src/core/document.js')), F = require(path.join(TREE, 'src/core/finish.js'));
  const { makeExporter } = require(path.join(TREE, 'app/export/export.js')), { createCoreShell } = require(path.join(TREE, 'app/core/coreshell.js'));
  const SAVED = process.env.SAVED;   // the keeper's saved track as it is (a copy), instead of finishing the open lap
  const r = SAVED ? { doc: D.parse(fs.readFileSync(SAVED, 'utf8')), plan: { report: 'the saved track as it is: ' + SAVED } } : F.finishToStart(D.parse(fs.readFileSync(path.join(TREE, 'fixtures-d431', (process.env.LAP || 'testtrack10') + '-open.t180track'), 'utf8'))), doc = { ...r.doc, name: NAME };
  const ex = await makeExporter(async (rel) => fs.readFileSync(path.join(TREE, rel), 'utf8'));
  const s = await createCoreShell({ brushFn: null, exporter: ex, autosaveMs: 0 }); s.adopt(D.parse(D.serialize(doc)));
  console.log('plan:', r.plan.report.slice(0, 110));
  let out;
  try { out = s.buildExport(); } catch (e) { console.log(JSON.stringify({ refused: e.code, message: String(e.message).slice(0, 400), reds: Array.isArray(e.red) ? e.red.slice(0, 6).map((x) => `${x.reason}@${Math.round(x.s)}`) : null })); process.exitCode = 2; return; }
  let n = 0, bytes = 0;
  for (const f of out.folders) for (const file of f.files) { const p = path.join(OUT, f.folder, file.path); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, Buffer.from(file.bytes)); n++; bytes += file.bytes.length; }
  console.log(JSON.stringify({ written: OUT, folders: out.folders.map((f) => f.folder), files: n, bytes, warnings: out.result.warnings || [] }));
})().catch((e) => { console.error(e); process.exit(1); });
