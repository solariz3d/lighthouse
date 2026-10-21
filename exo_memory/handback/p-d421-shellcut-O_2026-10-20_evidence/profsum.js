'use strict';
// D421 shell cut (O): sum a .cpuprofile. Self time per function (top N), and the INCLUSIVE time of named functions (a function's samples plus every descendant's; a
// recursive frame counted once per sample). Times are sample counts x the sampling interval.
//   node profsum.js <file.cpuprofile> [N] [name,name,...]
const fs = require('fs');
const [file, nArg, namesArg] = process.argv.slice(2);
const p = JSON.parse(fs.readFileSync(file, 'utf8')), N = Number(nArg) || 15;
const names = (namesArg || 'brushTo,brushed,brush,sculpt,pieceOffsets,checkDoc,toSegments,resolvedOf,segmentsOf,offsetPath,routeMovedDetail,dragTo,valueAt,spanUnder,freeze,serialize').split(',');
const byId = new Map(p.nodes.map((n) => [n.id, n])), parent = new Map();
for (const n of p.nodes) for (const c of n.children || []) parent.set(c, n.id);
const dt = p.timeDeltas, total = (p.endTime - p.startTime) / 1000, per = total / p.samples.length;
const self = new Map(), incl = new Map(names.map((x) => [x, 0]));
const label = (n) => `${n.callFrame.functionName || '(anon)'} ${(n.callFrame.url || '').split(/[\\/]/).slice(-2).join('/')}:${n.callFrame.lineNumber + 1}`;
p.samples.forEach((id) => {
  const n = byId.get(id); self.set(label(n), (self.get(label(n)) || 0) + 1);
  const seen = new Set(); for (let k = id; k !== undefined; k = parent.get(k)) { const f = byId.get(k).callFrame.functionName; if (incl.has(f) && !seen.has(f)) { seen.add(f); incl.set(f, incl.get(f) + 1); } }
});
const ms = (c) => +(c * per).toFixed(1);
console.log(`profile ${total.toFixed(0)} ms, ${p.samples.length} samples, ${per.toFixed(3)} ms each`);
console.log('INCLUSIVE (ms):', JSON.stringify(Object.fromEntries([...incl].map(([k, c]) => [k, ms(c)]))));
console.log('SELF, top ' + N + ':');
[...self].sort((a, b) => b[1] - a[1]).slice(0, N).forEach(([k, c]) => console.log(`  ${String(ms(c)).padStart(8)} ms  ${k}`));
