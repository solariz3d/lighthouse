// table.js <bench.log> [void label ...]: row C's figures per arm from the session's run lines, the named runs left out.
'use strict';
const fs = require('fs');
const [, , file, ...voided] = process.argv;
const runs = fs.readFileSync(file, 'utf8').split('\n').map((l) => l.match(/^\S+ (\d\d-(\w+)(?:-try\d)?)\t\S+\texit (\d+)\tavg ([\d.]+) p99 ([\d.]+) worst ([\d.]+) \((\d+) frames\)/)).filter(Boolean)
  .map((m) => ({ label: m[1], arm: m[2], exit: +m[3], avg: +m[4], p99: +m[5], worst: +m[6], frames: +m[7] }));
for (const arm of ['defaults', 'filter']) {
  const r = runs.filter((x) => x.arm === arm && !voided.includes(x.label) && x.exit === 0);
  const span = (k) => `${Math.min(...r.map((x) => x[k])).toFixed(3)}-${Math.max(...r.map((x) => x[k])).toFixed(3)}`;
  const mean = (k) => (r.reduce((s, x) => s + x[k], 0) / r.length).toFixed(3);
  console.log(`${arm}: ${r.length} runs; avg ${span('avg')} (mean ${mean('avg')}); p99 ${span('p99')} (mean ${mean('p99')}); worst ${span('worst')}; frames ${Math.min(...r.map((x) => x.frames))}-${Math.max(...r.map((x) => x.frames))} of 10801; p99 under 3.33 in ${r.filter((x) => x.p99 < 3.33).length}, under 2.78 in ${r.filter((x) => x.p99 < 2.78).length}; worst under 2.78 in ${r.filter((x) => x.worst < 2.78).length}`);
}
console.log(`left out: ${voided.join(', ') || 'none'}`);
