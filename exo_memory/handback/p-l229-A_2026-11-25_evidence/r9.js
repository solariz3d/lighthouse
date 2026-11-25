// R9 (pane A, L229): step 6 on "Smooth S as driven L" as it is on disk: what src/core/shaperead.js reads off the S, beside what he typed.
//   node r9.js <app data dir>      reads through shell.open + undo x2 (the redo state is then lead + S, the S last: the ghost's own case); nothing is written
'use strict';
const fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-ghost';
const { createCoreShell } = require(T + '/app/core/coreshell.js'), D = require(T + '/src/core/document.js'), SR = require(T + '/src/core/shaperead.js');
const app = process.argv[2], f = (n, e) => path.join(app, 'tracks', n + e);
const storage = { openDoc: async (n) => fs.readFileSync(f(n, '.t180track'), 'utf8'), openUndo: async (n) => fs.readFileSync(f(n, '.t180undo'), 'utf8'),
  saveDoc: async () => { throw new Error('read only'); }, saveUndo: async () => { throw new Error('read only'); }, savePiece: async () => {}, openPiece: async () => '', listPieces: async () => [], deletePiece: async () => {}, listDocs: async () => [],
  saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => {}, listBackups: async () => [], docSavedAt: async () => null };
(async () => {
  const sh = await createCoreShell({ brushFn: null, storage }); await sh.open('Smooth S as driven L');
  sh.undo(); sh.undo();
  const g = sh.getState().undoGhost, redo = g && g.candidate ? null : null;
  const whole = D.parse(fs.readFileSync(f('eq-Smooth S as driven L', '.t180track'), 'utf8'));
  const two = { ...whole, pieces: whole.pieces.slice(0, 2) };
  const r = SR.readFromShape(two, 1);
  const known = { turns: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }], bank: [{ at: 80, deg: -20 }, { at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }] };
  console.log('ghost removed pieces after two undos:', g && g.removed, '| the words:', SR.shapeWords(r));
  console.log('turns read:', JSON.stringify(r.turns.map((t) => ({ from: +t.fromM.toFixed(1), to: +t.toM.toFixed(1), deg: +t.deg.toFixed(2) }))));
  for (const k of known.turns) { const m = r.turns.reduce((a, t) => (Math.abs(t.deg - k.deg) < Math.abs(a.deg - k.deg) ? t : a)); console.log(`  typed ${k.deg > 0 ? '+' : ''}${k.deg} from ${k.from} m: read ${m.deg.toFixed(2)} deg from ${m.fromM.toFixed(1)} m to ${m.toM.toFixed(1)} m; miss ${(m.deg - k.deg).toFixed(2)} deg`); }
  console.log('bank turning points read:', JSON.stringify(r.bank.map((b) => ({ at: +b.atM.toFixed(1), deg: +b.deg.toFixed(2) }))));
  for (const k of known.bank) console.log(`  typed ${k.deg} deg at ${k.at} m: built bank there ${r.bankAt(k.at).toFixed(2)} deg; miss ${(r.bankAt(k.at) - k.deg).toFixed(2)} deg`);
  console.log('climb read', r.climbDeg.toFixed(3), 'deg (typed none)');
})().catch((e) => { console.error('FAILED', e.stack); process.exit(1); });
