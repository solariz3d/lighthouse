// L228 (pane A): rebuild the undo history of the two saved S projects, prove it through the app's load path.
//   node history.js build <stage dir> <app data dir>   build both sidecars into <stage dir> (never writes into the app data dir; reads the track files)
//   node history.js prove <app data dir>                open each project, undo x3 (counts), redo x3, print the sha256 of the start and the end
// The .t180track files are never rewritten: the stage's saveDoc goes to the stage folder only.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const T = process.env.ROUTE_TREE || 'C:/Consonance/t180-wt-flow';
const OROUTE = 'C:/Consonance/lighthouse/exo_memory/handback/p-d677-t180-route-O_2026-11-24_evidence/route.js';
const tmp = path.join(os.tmpdir(), '_l228_route.js');
fs.writeFileSync(tmp, fs.readFileSync(OROUTE, 'utf8').replace("process.env.ROUTE_TREE || 'G:/consonance-scratch/o-route-t180'", JSON.stringify(T)));
const O = require(tmp), { D, TB, extend, LEAD, DEG } = O;
const { createCoreShell } = require(T + '/app/core/coreshell.js');
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const DRIVEN = 'Smooth S as driven L', C1C = 'Smooth S flow L';
const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
const S_OPTS = { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } };
const lead = () => extend(D.createDoc('flow'), { length: LEAD, family: 'bowl', first: { w: 33 } });
const store = (dir) => {
  const f = (sub, n, ext) => { fs.mkdirSync(path.join(dir, sub), { recursive: true }); return path.join(dir, sub, n + ext); };
  return {
    saveDoc: async (n, b) => fs.writeFileSync(f('tracks', n, '.t180track'), b), openDoc: async (n) => fs.readFileSync(f('tracks', n, '.t180track'), 'utf8'),
    saveUndo: async (n, b) => fs.writeFileSync(f('tracks', n, '.t180undo'), b), openUndo: async (n) => { const p = f('tracks', n, '.t180undo'); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; },
    savePiece: async () => {}, openPiece: async () => '', listPieces: async () => [], deletePiece: async () => {}, listDocs: async () => [],
    saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => {}, listBackups: async () => [], docSavedAt: async () => null,
  };
};
async function steps(which) {   // the documents, in order: lead; lead + S; lead + S + ease-out. Each is the core's own result for that piece.
  if (which === DRIVEN) {
    const a = lead(), b = TB.extendCorner(a, S_OPTS), c = extend(b, { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
    return [a, b, c];
  }
  const p = await O.mountPanel();   // the panel's own Extend, one piece at a time (route 1c)
  const out = [D.parse(p.shell.text())];
  const ROUTE = [{ L: 200, turn: 176, bank: -27, flow: true, at: 55, rows: [['turn', -176, 80], ['bank', 0, 112], ['bank', 26, 157]] }, { L: 150, bank: 0, flow: true, at: 100 }];
  for (const s of ROUTE) { await O.piece(p, s); out.push(D.parse(p.shell.text())); }
  return out;
}
(async () => {
  const [mode, a1, a2] = process.argv.slice(2);
  if (mode === 'build') {
    const stage = a1, app = a2;
    for (const name of [DRIVEN, C1C]) {
      const file = path.join(app, 'tracks', 'eq-' + name + '.t180track'), disk = fs.readFileSync(file, 'utf8'), st = fs.statSync(file);
      console.log(name, '| track sha256 before:', sha(disk), '| mtime', st.mtime.toISOString());
      const [d0, d1, d2] = await steps(name);
      if (D.serialize(d2) !== disk) { console.log('  STOP: the laid document is not byte-equal to the track on disk; no sidecar built for', name); continue; }
      const sh = await createCoreShell({ brushFn: null, storage: store(stage) });
      sh.commitDoc(d0); sh.commitDoc(d1); sh.commitDoc(d2);   // past: empty (createCoreShell's), d0 (the lead), d1 (lead + S); present: d2
      await sh.save(name);
      console.log('  sidecar built in the stage:', path.join(stage, 'tracks', 'eq-' + name + '.t180undo'));
    }
    return;
  }
  const app = a1;
  for (const name of [DRIVEN, C1C]) {
    const file = path.join(app, 'tracks', 'eq-' + name + '.t180track');
    const sh = await createCoreShell({ brushFn: null, storage: store(app) });
    const n = () => D.parse(sh.text()).pieces.length;
    await sh.open(name);
    const start = sha(sh.text()), counts = [n()];
    for (let i = 0; i < 3; i++) { sh.undo(); counts.push(n()); }
    const bottom = sh.text();
    const redoCounts = [];
    for (let i = 0; i < 3; i++) { sh.redo(); redoCounts.push(n()); }
    console.log(name, '| undo counts (open, then 3 undos):', counts.join(' > '), '| redo counts:', redoCounts.join(' > '), '| sha256 start == end after redo x3:', start === sha(sh.text()), '| start == file on disk:', start === sha(fs.readFileSync(file, 'utf8')), '| start', start);
  }
})().catch((e) => { console.error('FAILED', e.stack); process.exit(1); });
