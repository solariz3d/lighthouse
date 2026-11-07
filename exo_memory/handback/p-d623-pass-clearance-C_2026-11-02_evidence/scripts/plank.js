// plank.js <tree> <doc> <mesh.json> <cellName> <s>: the export's vertices of one plank cell beside the rule's own edge and apron points at station s
'use strict';
const fs = require('fs'), T = process.argv[2], [, , , DOC, MJ, CELL, SS] = process.argv;
const J = JSON.parse(fs.readFileSync(MJ, 'utf8')), seen = new Set();
const v = [...J.p38, ...J.p41].filter((k) => k.m === CELL).filter((k) => { const key = k.p.map((t) => t.toFixed(2)).join(); if (seen.has(key)) return false; seen.add(key); return true; });
console.log(`export ${CELL}: ${v.length} vertices`); for (const k of v.slice(0, 14)) console.log('   ', k.p.map((t) => t.toFixed(2)).join(' '));
const D = require(T + '/src/core/document.js'), AD = require(T + '/src/core/adapter.js'), PC = require(T + '/src/validate/passclear.js'), P = require(T + '/src/geom/profile.js');
const doc = D.parse(fs.readFileSync(DOC, 'utf8')), { segments, path } = AD.toPath(doc, { step: 2 });
const q = path.samples.find((x) => Math.abs(x.s - +SS) < 1.01), sec = PC._internal.sectionOf(P.normalize(segments[q.seg].profile), 2);
console.log(`mine s ${q.s} pos ${q.pos.map((t) => t.toFixed(2)).join(' ')} L ${q.L.map((t) => t.toFixed(2)).join(' ')} U ${q.U.map((t) => t.toFixed(2)).join(' ')}`);
for (const p of sec.pts.filter((p) => p.apron || Math.abs(p.u) > 17.4)) { const x = [0, 1, 2].map((c) => q.pos[c] + q.L[c] * p.X + q.U[c] * p.Y); console.log('   ', p.apron ? `apron u ${p.u} w ${p.w}` : `edge u ${p.u.toFixed(1)}`, x.map((t) => t.toFixed(2)).join(' ')); }
