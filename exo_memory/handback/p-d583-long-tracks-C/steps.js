// steps.js <repo> <doc.t180track> [undo] : D583 step 1, the page's load and export path, step by step, under node with the app's own modules.
// Run with: node --expose-gc --trace-gc --max-old-space-size=12000 steps.js ... (so nothing dies here and the peaks can be read; parse with stepsum.js).
// Each step prints a STEP line before and after; between them --trace-gc prints every collection, whose "before" size is the heap the step reached.
// After each step a full GC gives the RETAINED heap: what the step leaves alive (each later step keeps what the page keeps).
//   open     the document text parsed and resolved as the shell's open does (coreshell.js open: D.parse, the undo sidecar, resolvedOf)
//   preview  the preview's track model (app/preview/trackmodel.js update: the path at the export's step, the mesh, the GL batches)
//   check    the checker's job (app/validate-ui/checkjob.js run: what the check worker holds, in its own isolate on the page's process)
//   export   the export (src/export/fromwords.js through app/export/export.js runSegments), the files in memory, as the export's process holds them
//   handoff  the files as the page sends them to the native side today (index.html b64, then the IPC's JSON.stringify of the arguments)
'use strict';
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [, , REPO, DOCF, UNDOF] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const MB = (b) => (b / 1048576).toFixed(1);
const heap = () => v8.getHeapStatistics().used_heap_size;
const ext = () => process.memoryUsage().arrayBuffers;
const keep = {};
let t0;
const begin = (name) => { global.gc(); console.log(`STEP-BEGIN ${name} heap ${MB(heap())} ab ${MB(ext())}`); t0 = Date.now(); };
const end = (name, note = '') => { const ms = Date.now() - t0; global.gc(); console.log(`STEP-END ${name} ms ${ms} heap ${MB(heap())} ab ${MB(ext())} ${note}`); };
(async () => {
  const D = rq('src/core/document.js');
  const { createCoreShell } = rq('app/core/coreshell.js');
  const { makeExporter } = rq('app/export/export.js');
  const { createTrackModel } = rq('app/preview/trackmodel.js');
  const { createCheckJob } = rq('app/validate-ui/checkjob.js');
  const { createCoreTextures } = rq('app/core/textures.js');
  const fromDisk = async (p) => fs.readFileSync(path.join(REPO, p), 'utf8');
  const ex = await makeExporter(fromDisk, { author: () => 'D583 measure' });
  const text = fs.readFileSync(DOCF, 'utf8'), undo = UNDOF ? fs.readFileSync(UNDOF, 'utf8') : null;
  const storage = { openDoc: async () => text, openUndo: async () => undo, listDocs: async () => ['eq-X'] };
  console.log(`doc ${DOCF} ${text.length} B; undo ${undo ? undo.length : 0} B`);

  begin('open');
  const shell = await createCoreShell({ storage, exporter: ex, brushFn: null, autosaveMs: 0 });
  await shell.open('X');
  const st = shell.getState();
  if (!st.resolved || st.resolveError) throw new Error(`did not resolve: ${st.message || st.resolveError}`);
  keep.shell = shell;
  end('open', `pieces ${st.history.present.pieces.length} segments ${st.resolved.segments.length} closed ${st.resolved.closed} undo-past ${(st.history.past || []).length}`);

  begin('preview');
  const model = createTrackModel(), r = model.update(st.resolved);
  keep.model = model;
  end('preview', `how ${r.how} samples ${r.path.samples.length} lengthM ${r.path.lengthM.toFixed(0)} cells ${(r.mesh.cells || r.mesh.pieces || []).length}`);

  begin('check');
  const job = createCheckJob(), cr = job.run({ doc: st.history.present, dragging: false, csp: true });
  keep.check = { job, cr };
  end('check', `how ${cr.how} error ${cr.error ? String(cr.error).slice(0, 80) : null} red ${cr.result && cr.result.red ? cr.result.red.length : '?'}`);

  begin('export');
  const textures = createCoreTextures({ segments: () => shell.getState().resolved.segments, closed: () => !!shell.getState().resolved.closed, edge: true }).current();
  let out;
  try { out = shell.buildExport({ textures }); } catch (e) { console.log(`export threw: ${e.code || ''} ${e.message.slice(0, 300)}`); }
  const files = out ? out.folders.flatMap((f) => f.files.map((x) => ({ path: `${f.folder}/${x.path}`, bytes: x.bytes }))) : [];
  const total = files.reduce((a, f) => a + f.bytes.length, 0), big = files.slice().sort((a, b) => b.bytes.length - a.bytes.length).slice(0, 3).map((f) => `${f.path} ${f.bytes.length}`);
  keep.files = files;
  end('export', `files ${files.length} bytes ${total} largest ${big.join(', ')}`);

  if (files.length && process.env.NO_HANDOFF !== '1') {
    begin('handoff');
    // index.html b64, verbatim, then the arguments as the IPC serialises them (Tauri 2's invoke: JSON.stringify of the payload)
    const b64 = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };
    let len = 0;
    try { const args = { folder: 't180b_x', files: files.map((f) => ({ path: f.path, data: b64(f.bytes) })) }; const body = JSON.stringify(args); len = body.length; }
    catch (e) { console.log(`handoff threw: ${e.message}`); }
    end('handoff', `json chars ${len}`);
  }
  if (files.length && process.env.NEW_HANDOFF === '1') {
    begin('handoff-bytes');
    const NF = rq('app/lib/nativefiles.js'); let len = 0;
    try { const body = NF.sendFiles((cmd, b) => b, 'install_track', { folder: 't180b_x' }, files); len = body.length; } catch (e) { console.log('handoff-bytes threw: ' + e.message); }
    end('handoff-bytes', 'body bytes ' + len);
  }
  console.log('DONE');
})().catch((e) => { console.log(`FATAL ${e.stack}`); process.exit(1); });
