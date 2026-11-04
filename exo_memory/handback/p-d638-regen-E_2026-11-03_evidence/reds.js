// usage: node reds.js <tree> <save> [pieces]   the shipped checker (src/validate/index.js validate) on a save, or its first N pieces open: red and amber counts by reason
'use strict';
const fs = require('fs'), path = require('path'), R = path.resolve(process.argv[2]), q = (m) => require(path.join(R, m));
const D = q('src/core/document.js'), AD = q('src/core/adapter.js'), V = q('src/validate/index.js');
let doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')); const n = process.argv[4] ? Number(process.argv[4]) : null;
if (n) doc = D.checkDoc({ ...doc, closed: false, pieces: doc.pieces.slice(0, n) });
const segs = AD.toSegments(doc), p = AD.offsetPath(doc, segs, AD.toPath(doc, { step: 2 }).path);
const r = V.validate(p, segs, {});
const list = [...(r.red || []).map((f) => ({ ...f, level: "red" })), ...(r.amber || []).map((f) => ({ ...f, level: "amber" }))];
const by = {}; for (const f of list) { const k = `${f.level || f.severity}:${f.reason || f.id || f.kind}`; by[k] = (by[k] || 0) + 1; }
console.log(`${path.basename(process.argv[3])}${n ? ` first ${n}` : ''}: ${Object.keys(r).join(',')} | ${list.length} findings: ${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(', ')}`);
