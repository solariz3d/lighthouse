'use strict';
// D434 (O): the documents for the keeper's shots, from TEST TRACK 10's open lap (undo past[71]) finished on one tree: the closer as that tree makes it (before), and
// the same laid route with its new pieces banked by scale·(−atan(v²·kh_i/g)) and closed by the same windowed close, for each scale given. Written as .t180track
// text into tracks/shots-input/ (derived from the keeper's private track: uncommitted). Also prints, per document, each new piece's s range along the lap.
//   node gen-shot-docs.js <tree> <scale,scale,...>
const [TREE, SCALES] = process.argv.slice(2);
const fs = require('fs'), path = require('path'), CM = require(`${TREE}/src/core/close.js`), c0 = CM.close, seen = [];
CM.close = function (doc, opts) { const r = c0(doc, opts); if (opts && opts.window && r.converged) seen.push({ doc, window: opts.window, out: r.doc }); return r; };
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), AD = require(`${TREE}/src/core/adapter.js`);
const { MACH6, G } = require(`${TREE}/src/validate/limits.js`), v = MACH6.designSpeedKmh / 3.6;
const open = D.parse(JSON.parse(fs.readFileSync(path.join(__dirname, 'tracks', 'testtrack10', 'eq-TEST TRACK 10.t180undo'), 'utf8')).past[71]);
const fin = F.finishToStart(open), pick = seen.find((x) => x.out === fin.doc); if (!pick) throw new Error('not captured');
const outDir = path.join(__dirname, 'tracks', 'shots-input'); fs.mkdirSync(outDir, { recursive: true });
const write = (name, doc) => {
  fs.writeFileSync(path.join(outDir, `${name}.t180track`), D.serialize({ ...doc, name: `TEST TRACK 10 ${name}` }));
  const { segments } = AD.toPath(doc, { step: 2 }), at = {}; let s = 0; for (const g of segments) { if (!at[g.id]) at[g.id] = [s, s]; s += g.length; at[g.id][1] = s; }
  console.log(name, JSON.stringify(pick.window.map((p) => `${doc.pieces[p].id} ${Math.round(at[doc.pieces[p].id][0])}-${Math.round(at[doc.pieces[p].id][1])} m`)));
};
write('before', fin.doc);
for (const scale of SCALES.split(',').map(Number)) {
  const banked = D.checkDoc({ ...pick.doc, pieces: pick.doc.pieces.map((P, p) => (!pick.window.includes(p) || P.type !== 'road' ? P : { ...P, channels: { ...P.channels, phi: P.channels.phi.map((ph, i, a) => (i < 2 || i > a.length - 3 ? ph : ph - scale * Math.atan((v * v * P.channels.kh[i]) / G))) } })) });
  write(`bank${Math.round(scale * 100)}`, c0(banked, { window: pick.window }).doc);
}
