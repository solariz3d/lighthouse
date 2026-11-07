// mem614.js <repo> <doc> <check|stub> [findings.json]: the export as the app's export process runs it (coreshell buildExport -> fromwords), under node with
// the app's own modules, once with the final-scene check and once with it stubbed. Run: node --expose-gc --trace-gc --max-old-space-size=N mem614.js ...
// Prints MARK lines (heap after a full GC) around the export and around the check; --trace-gc prints every collection between them, whose "before" size
// is the heap reached (parse with memsum.js). The MARK lines go to the file $MARKS, with performance.now(), so they do not interleave with the GC trace. At the end: the process's peak RSS (resourceUsage().maxRSS). With [findings.json], writes the check's
// refuse and warn findings there (for comparing two checks on one scene).
'use strict';
require('./winhide.js');
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [, , REPO, DOCF, MODE = 'check', FOUT] = process.argv;
const rq = (p) => require(path.join(REPO, p));
const MB = (b) => (b / 1048576).toFixed(1);
const heap = () => v8.getHeapStatistics().used_heap_size;
const { performance } = require('perf_hooks'), MARKS = process.env.MARKS;
const mark = (name) => { const t = performance.now(); global.gc(); const m = process.memoryUsage(); fs.appendFileSync(MARKS, `MARK ${name} t ${t.toFixed(0)} heap ${MB(heap())} rss ${MB(m.rss)} ab ${MB(m.arrayBuffers)}
`); };
// the exporter loads its modules from their text (app/lib/cjs.js), not through require: the check is wrapped by appending a hook to finalscene.js's text
let found = null;
globalThis.__fsHook = function (real, scene, o) {
  mark('check-begin');
  const r = MODE === 'stub' ? { refuse: [], warn: [] } : real(scene, o);
  mark('check-end');
  found = r;
  return r;
};
const HOOK = '\n;{ const __real = module.exports.checkFinalScene; module.exports.checkFinalScene = (s, o) => globalThis.__fsHook(__real, s, o); }\n';
(async () => {
  const { createCoreShell } = rq('app/core/coreshell.js');
  const { makeExporter } = rq('app/export/export.js');
  const { createCoreTextures } = rq('app/core/textures.js');
  let hooked = 0;
  const fromDisk = async (p) => { const t = fs.readFileSync(path.join(REPO, p), 'utf8'); if (p === 'src/export/finalscene.js') { hooked++; return t + HOOK; } return t; };
  const ex = await makeExporter(fromDisk, { author: () => 'D614 measure' });
  const text = fs.readFileSync(DOCF, 'utf8');
  const storage = { openDoc: async () => text, openUndo: async () => null, listDocs: async () => ['eq-X'] };
  const shell = await createCoreShell({ storage, exporter: ex, brushFn: null, autosaveMs: 0 });
  await shell.open('X');
  const st = shell.getState();
  if (!st.resolved || st.resolveError) throw new Error(`did not resolve: ${st.message || st.resolveError}`);
  if (!hooked) throw new Error('finalscene.js was not loaded through the hook');
  console.log(`doc ${path.basename(DOCF)} mode ${MODE} pieces ${st.history.present.pieces.length}`);
  const textures = createCoreTextures({ segments: () => shell.getState().resolved.segments, closed: () => !!shell.getState().resolved.closed, edge: true }).current();
  mark('export-begin');
  const t0 = Date.now();
  let out, err = null;
  try { out = shell.buildExport({ textures }); } catch (e) { err = e; console.log(`export threw: ${e.code || ''} ${String(e.message).slice(0, 400)}`); }
  const ms = Date.now() - t0;
  const files = out ? out.folders.flatMap((f) => f.files) : [];
  console.log(`export ms ${ms} files ${files.length} bytes ${files.reduce((a, f) => a + f.bytes.length, 0)}`);
  mark('export-end');
  const r = found || (err && err.detail && err.detail.sceneCheck) || (err && err.sceneCheck) || null;
  if (r) console.log(`findings refuse ${r.refuse.length} warn ${r.warn.length}`);
  if (FOUT && r) fs.writeFileSync(FOUT, JSON.stringify({ refuse: r.refuse, warn: r.warn }, null, 1));
  console.log(`maxRSS ${(process.resourceUsage().maxRSS / 1024).toFixed(1)} MB`);
  console.log('DONE');
})().catch((e) => { console.log(`FATAL ${e.stack}`); process.exit(1); });
