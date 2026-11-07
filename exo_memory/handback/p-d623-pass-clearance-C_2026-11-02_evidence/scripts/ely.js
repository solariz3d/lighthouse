// ely.js <tree> <doc> [apronM]: the rule on a saved track (read-only): time, findings grouped by piece pair, the worst of each group
'use strict';
const fs = require('fs'), T = process.argv[2];
const D = require(T + '/src/core/document.js'), AD = require(T + '/src/core/adapter.js'), { passClearance } = require(T + '/src/validate/passclear.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8'));
const t0 = Date.now(), { segments, path } = AD.toPath(doc, { step: 2 }), t1 = Date.now();
const apronM = process.argv[4] !== undefined ? +process.argv[4] : doc.edgeApronM;
const f = passClearance(path, segments, apronM === undefined ? {} : { apronM }), t2 = Date.now();
// the piece of a station: the doc piece whose s span holds it (segments carry their piece id)
const S = path.samples, pieceAt = (s) => { let best = null; for (const q of S) { if (q.s > s + 1e-9) break; best = q; } const g = best && segments[best.seg]; return g ? (g.piece !== undefined ? `p${g.piece}` : g.id || '?') : '?'; };
console.log(`pieces ${doc.pieces.length}, closed ${!!doc.closed}, length ${path.lengthM && path.lengthM.toFixed(0)} m, stations ${S.length}, apron ${apronM === undefined ? 'default' : apronM}; path ${t1 - t0} ms, rule ${t2 - t1} ms; findings ${f.length}`);
const groups = new Map();
for (const x of f) { const k = `${pieceAt(x.s)} under ${pieceAt(x.otherS)}`; const g = groups.get(k) || { n: 0, s0: Infinity, s1: -Infinity, worst: null }; g.n++; g.s0 = Math.min(g.s0, x.s); g.s1 = Math.max(g.s1, x.s); if (!g.worst || x.shortM > g.worst.shortM) g.worst = x; groups.set(k, g); }
for (const [k, g] of groups) { const w = g.worst; console.log(`  ${k}: ${g.n} stations, s ${g.s0.toFixed(0)}..${g.s1.toFixed(0)}; worst at s ${w.s.toFixed(0)} u ${w.u.toFixed(1)} (other s ${w.otherS.toFixed(0)}): gap ${w.gapM.toFixed(2)} m, short ${w.shortM.toFixed(2)}, road gap ${w.surfaceGapM.toFixed(2) + (w.apron ? " (plank)" : " (road)")}, hull ${w.hullM.toFixed(2)}, clip ${w.clip}`); }
