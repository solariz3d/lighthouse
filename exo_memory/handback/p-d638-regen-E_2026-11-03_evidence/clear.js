// usage: node clear.js <tree> <save> [pieces]   the shipped pass-clearance reading (src/validate/passclear.js passClearance) of a save, or of its first N pieces (open)
'use strict';
const fs = require('fs'), path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), AD = q('src/core/adapter.js'), PCL = q('src/validate/passclear.js'), A = q('src/export/apron.js');
let doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')); const n = process.argv[4] ? Number(process.argv[4]) : null;
if (n) doc = D.checkDoc({ ...doc, closed: false, pieces: doc.pieces.slice(0, n) });
const segs = AD.toSegments(doc), p = AD.offsetPath(doc, segs, AD.toPath(doc, { step: 2 }).path);
const f = PCL.passClearance(p, segs, { apronM: doc.edgeApronM === undefined ? A.APRON_WIDTH_M : doc.edgeApronM, from: 0 });
const km = (s) => (s / 1000).toFixed(2);
console.log(`${path.basename(process.argv[3])}${n ? ` first ${n} pieces` : ''}: ${doc.pieces.length} pieces, ${(p.lengthM / 1000).toFixed(2)} km, closed ${!!doc.closed}: ${f.length} pass-clearance finding(s)${f.length ? '; the road meets another at ' + f.filter((x) => x.clip).length + '; e.g. ' + f.slice(0, 4).map((x) => `${km(x.s)}|${km(x.otherS)} short ${x.shortM.toFixed(2)} m`).join(', ') : ''}`);
