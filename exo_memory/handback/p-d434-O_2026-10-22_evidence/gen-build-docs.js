'use strict';
// D434 build (O): the shot documents from the BUILD (not the prototype): TEST TRACK 10's open lap finished by the base tree (before) and by the build (after), written
// to tracks/shots-input/ (private, uncommitted), with each new piece's s range.   node gen-build-docs.js <base tree> <build tree>
const [BASE, BUILD] = process.argv.slice(2), fs = require('fs'), path = require('path');
const outDir = path.join(__dirname, 'tracks', 'shots-input'); fs.mkdirSync(outDir, { recursive: true });
for (const [name, T] of [['build-before', BASE], ['build-after', BUILD]]) {
  const D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'src/core/finish.js')), AD = require(path.join(T, 'src/core/adapter.js'));
  const open = D.parse(fs.readFileSync(path.join(BUILD, 'fixtures-d431', 'testtrack10-open.t180track'), 'utf8')), r = F.finishToStart(open);
  fs.writeFileSync(path.join(outDir, `${name}.t180track`), D.serialize({ ...r.doc, name: `TEST TRACK 10 ${name}` }));
  const { segments } = AD.toPath(r.doc, { step: 2 }), at = {}; let s = 0; for (const g of segments) { if (!at[g.id]) at[g.id] = [s, s]; s += g.length; at[g.id][1] = s; }
  console.log(name, r.plan.report.slice(0, 70), JSON.stringify(r.doc.pieces.slice(open.pieces.length).map((P) => `${P.id} ${Math.round(at[P.id][0])}-${Math.round(at[P.id][1])}`)));
}
