// L226: reopen what stage.js saved (project: shell.open; pieces: shell.insertPiece at the head of a straight) and read the built road. node reopen.js <dir holding tracks/ and pieces/>
'use strict';
process.argv[3] = process.argv[3] || '';
const fs = require('fs'), path = require('path');
const dir = process.argv[2], T = process.env.ROUTE_TREE || 'C:/Consonance/t180-wt-flow';
// reuse stage.js's helpers without running its main: load its source up to the main block
const src = fs.readFileSync(path.join(__dirname, 'stage.js'), 'utf8').split('(async () => {')[0] + '\nmodule.exports = { store, worst, O, D, PC, createCoreShell, NAME, P1, P2, LEAD };';
const tmp = path.join(require('os').tmpdir(), '_l226_helpers.js'); fs.writeFileSync(tmp, src.replace("process.argv[2]", JSON.stringify(dir)));
const H = require(tmp);
(async () => {
  const out = {};
  const a = await H.createCoreShell({ brushFn: null, storage: H.store(dir) });
  await a.open(H.NAME);
  const doc = H.D.parse(a.text()); out.projectPieces = doc.pieces.length; out.project = H.worst(doc, 'project reopened (shell.open)');
  out.bytesSameAsSaved = a.text() === H.D.serialize(H.D.parse(fs.readFileSync(path.join(dir, 'tracks', 'eq-' + H.NAME + '.t180track'), 'utf8')));
  // pieces added at the head of a straight (the library's "Add at head"): the same lead straight, piece 1 then piece 2
  const b = await H.createCoreShell({ brushFn: null, storage: H.store(dir) });
  b.commitDoc(H.O.extend(H.D.createDoc('flow'), { length: H.LEAD, family: 'bowl', first: { w: 33 } }));
  await b.insertPiece(H.P1); await b.insertPiece(H.P2);
  const d2 = H.D.parse(b.text()); out.piecesAddedPieces = d2.pieces.length; out.piecesAdded = H.worst(d2, 'saved pieces added at the head of a straight');
  out.piecesAddedMessage = b.get ? b.get().message : undefined;
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error('FAILED', e.stack); process.exit(1); });
