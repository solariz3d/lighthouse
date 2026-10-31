// table.js (C, D482): node table.js <probe json>... — one line per row: work frames a second and p95, idle and drag, and the preview frame's share of the drag.
'use strict';
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  const { rows, errors } = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const r of rows) {
    const d = r.drag, pv = (b) => (b && b.by || []).find((x) => /preview\.js/.test(x.origin)) || {};
    if (typeof d === 'string') { console.log(`${r.label.padEnd(10)} ${r.mode.padEnd(6)} placed=${!!r.placed} idle work/s ${r.idle.workPerSec}  drag: ${d}`); continue; }
    const p = pv(d);
    console.log(`${r.label.padEnd(10)} ${r.mode.padEnd(6)} placed=${!!r.placed} segs=${r.trackSegments}  idle work/s ${String(r.idle.workPerSec).padStart(6)}  | drag frames/s ${String(d.framesPerSec).padStart(7)} work/s ${String(d.workPerSec).padStart(6)} p95 ${String(d.p95).padStart(7)} med ${String(d.median).padStart(6)} held ${d.held}  | preview frame >0.5ms/s ${String(p.over05PerSec).padStart(6)} ms/s ${String(p.msPerSec).padStart(7)} p95 ${p.p95}`);
  }
  if (errors && errors.length) console.log(`  page errors in ${f}: ${errors.length}`);
}
