// node measure.js  (from the worktree): size and time of the undo sidecar at the 200-step cap, on COPIES of the keeper's tracks (read-only source).
const fs = require('fs'), path = require('path');
const W = 'C:/Users/nname/Desktop/worktrees/a-undo-wt/';
const { createCoreShell } = require(W + 'app/core/coreshell.js');
const D = require(W + 'src/core/document.js');
const src = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'tracks');
(async () => {
  for (const name of ['FIRST TRACK', 'TEST 1', 'T-180 OVAL']) {
    const text = fs.readFileSync(path.join(src, `eq-${name}.t180track`), 'utf8');   // read only; the shell below works on this in-memory copy
    const docs = new Map([[`eq-${name}`, text]]), undos = new Map(); let autoText = null;
    const st = { saveDoc: async (n, t) => docs.set(n, t), openDoc: async (n) => docs.get(n), listDocs: async () => [...docs.keys()], saveUndo: async (n, t) => undos.set(n, t), openUndo: async (n) => undos.get(n) ?? null,
      saveAutosave: async (t) => { autoText = t; }, openAutosave: async () => null, clearAutosave: async () => {} };
    const s = await createCoreShell({ brushFn: null, storage: st, autosaveMs: 0 });
    await s.open(name);
    const pieces = s.getState().history.present.pieces.length;
    const t0 = Date.now();
    for (let i = 0; i < 110; i++) { s.extend({ length: 20 + (i % 7) }); s.removeHead(); }   // 200 real steps, the document about the same size throughout
    const edit = Date.now() - t0;
    const h = s.getState().history; if (h.past.length < 150) throw new Error('only ' + h.past.length + ' steps');
    const t1 = Date.now(); await s.save('measured'); const save = Date.now() - t1;
    const side = undos.get('eq-measured');
    s.extend({ length: 33 }); const t2 = Date.now(); await s.flushAutosave(); const autoMs = Date.now() - t2;
    const t3 = Date.now(); const b = await createCoreShell({ brushFn: null, storage: st, autosaveMs: 0 }); await b.open('measured'); const open = Date.now() - t3;
    const t4 = Date.now(); const base = await createCoreShell({ brushFn: null, storage: { ...st, openUndo: async () => null }, autosaveMs: 0 }); await base.open('measured'); const openNo = Date.now() - t4;
    console.log(JSON.stringify({ name, pieces, trackBytes: docs.get('eq-measured').length, steps: h.past.length, sidecarBytes: side.length, sidecarMB: +(side.length / 1048576).toFixed(2), saveMs: save, openWithMs: open, openWithoutMs: openNo, restoredPast: b.getState().history.past.length, autosaveMsAfterSave: autoMs, editMs: edit }));
  }
})().catch((e) => { console.error(e); process.exit(1); });
