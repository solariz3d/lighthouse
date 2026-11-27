// cmpexp.js (pane B, L258 step 4): two expcmp.js outputs, base and branch, track by track. A track matches when both opened it the same way, both
// exported it (or refused it with the same code) and every file has the same sha256 on both, with the same set of files. Prints one line a track and a total;
// exits 1 if any track differs, or if either run's control (the first track exported twice) differs from itself. usage: node cmpexp.js <base.json> <tip.json>
'use strict';
const fs = require('fs');
const [a, b] = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
let same = 0, differ = 0, files = 0;
if (a.rows.length !== b.rows.length) { console.log(`DIFFER: ${a.rows.length} core tracks at base, ${b.rows.length} on the branch`); process.exit(1); }
for (const [i, x] of a.rows.entries()) {
  const y = b.rows[i], why = [];
  if (x.text !== y.text) why.push('not the same input text');
  if (x.opened !== y.opened) why.push(`opened ${x.opened} / ${y.opened}`);
  if (x.kind !== y.kind) why.push(`kind ${x.kind} / ${y.kind}`);
  if ((x.refused || null) !== (y.refused || null)) why.push(`refused ${x.refused} / ${y.refused}`);
  const fx = x.files || {}, fy = y.files || {}, keys = [...new Set([...Object.keys(fx), ...Object.keys(fy)])].sort();
  for (const k of keys) if (fx[k] !== fy[k]) why.push(`${k}: ${fx[k] ? fx[k].slice(0, 12) : 'absent'} / ${fy[k] ? fy[k].slice(0, 12) : 'absent'}`);
  files += Object.keys(fx).length;
  const what = x.opened ? (x.refused ? `${x.kind} refused ${x.refused}` : `${x.kind}, ${Object.keys(fx).length} files`) : 'not opened';
  if (why.length) { differ++; console.log(`track ${i} (${x.text}): DIFFERS: ${why.join('; ')}`); } else { same++; console.log(`track ${i} (${x.text}): same (${what})`); }
}
console.log(`controls: base ${a.control && a.control.same}, branch ${b.control && b.control.same}; skipped (not core) ${a.skippedNotCore} / ${b.skippedNotCore}`);
console.log(`tracks: ${same} of ${a.rows.length} the same, ${differ} differ; files compared at base: ${files}`);
process.exit(differ || !(a.control && a.control.same) || !(b.control && b.control.same) ? 1 : 0);
