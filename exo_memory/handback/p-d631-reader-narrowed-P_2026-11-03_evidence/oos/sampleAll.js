// sampleAll.js <seed>: simple random sample of 80 rings (status ok, flagged OR NOT) from the first 3,364 rows of second-reader.jsonl, for the narrowed
// trigger's call rate out of the D627 sample (which drew flagged rows only). Writes sample80.jsonl in extract.js's shape.
'use strict';
const fs = require('fs');
const SEED = Number(process.argv[2]), N = 80;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(SEED);
const L = fs.readFileSync('C:/Consonance/data/second-reader.jsonl', 'utf8').split(/\n/).filter(Boolean).slice(0, 3364);
const pop = []; L.forEach((l, i) => { const r = JSON.parse(l); if (r.status === 'ok' && r.ringSha && r.seat) pop.push({ line: i + 1, r }); });
for (let i = pop.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pop[i], pop[j]] = [pop[j], pop[i]]; }
const out = pop.slice(0, N).sort((a, b) => a.line - b.line);
const proj = 'C:/Users/nname/.claude/projects', seatOf = {};
for (const d of fs.readdirSync(proj)) { if (!d.startsWith('C--Consonance-instances-')) continue; for (const f of fs.readdirSync(proj + '/' + d)) if (f.endsWith('.jsonl')) seatOf[f.slice(0, -6)] = d.replace('C--Consonance-instances-', ''); }
console.error(`population ${pop.length} ok rows of ${L.length}; sample ${out.length}; seed ${SEED}; flagged in sample ${out.filter((o) => (o.r.flags || []).length).length}`);
fs.writeFileSync('sample80.jsonl', out.map((o) => JSON.stringify({ line: o.line, ts: o.r.ts, seat: seatOf[o.r.seat] || o.r.seat.slice(0, 8), session: o.r.seat, tool: o.r.tool, ringSha: o.r.ringSha, flags: o.r.flags || [] })).join('\n') + '\n');
