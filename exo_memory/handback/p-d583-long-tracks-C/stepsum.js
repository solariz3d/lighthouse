// stepsum.js <steps.out>: per step, its time, the PEAK heap during it (the largest "before" size of any collection between its BEGIN and END,
// or the END/BEGIN heap if larger), and the RETAINED heap after it. Reads the output of steps.js run with --trace-gc.
'use strict';
const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
const rows = []; let cur = null;
for (const l of lines) {
  let m;
  if ((m = /STEP-BEGIN (\S+) heap ([\d.]+) ab ([\d.]+)/.exec(l))) { cur = { step: m[1], before: +m[2], peak: +m[2], peakAb: +m[3] }; continue; }
  if ((m = /STEP-END (\S+) ms (\d+) heap ([\d.]+) ab ([\d.]+) ?(.*)$/.exec(l)) && cur) { cur.ms = +m[2]; cur.after = +m[3]; cur.ab = +m[4]; cur.note = m[5]; cur.peak = Math.max(cur.peak, cur.after); rows.push(cur); cur = null; continue; }
  if (cur && (m = /ms: (?:Scavenge|Mark-Compact|Mark-sweep)[^\d]*([\d.]+) \(([\d.]+)\) -> ([\d.]+)/.exec(l))) cur.peak = Math.max(cur.peak, +m[1]);
  if (/^(FATAL|export threw|handoff threw|handoff-bytes threw|doc )/.test(l)) console.log(l.slice(0, 300));
}
console.log('step      ms        heap before  peak during  retained after  arraybuffers after  (MB)');
for (const r of rows) console.log(`${r.step.padEnd(9)} ${String(r.ms).padStart(8)}  ${r.before.toFixed(1).padStart(11)}  ${r.peak.toFixed(1).padStart(11)}  ${r.after.toFixed(1).padStart(14)}  ${r.ab.toFixed(1).padStart(18)}   ${r.note}`);
