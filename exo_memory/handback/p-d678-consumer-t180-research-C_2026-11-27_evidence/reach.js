'use strict';
// reach.js <worktree>: what the generator's collect() reaches under exo_memory/research/, read from that tree's own gen-consumer.js.
// Prints each research/t180_ note with SHIPS or EXCLUDED, then the _evidence/ folders on disk and whether any collected path is inside one.
const fs = require('fs'), path = require('path');
const W = path.resolve(process.argv[2]);
const G = require(path.join(W, 'consonance/tools/gen-consumer.js'));
const R = 'exo_memory/research/';
const norm = (p) => String(p || '').split(path.sep).join('/');
const all = G.collect();
const t180 = all.filter((f) => norm(f.from).startsWith(R + 't180_'));
console.log('tree ' + W);
console.log('collect(): ' + all.length + ' entries; under research/t180_: ' + t180.length);
for (const f of t180) console.log('  ' + (G.EXCLUDE[f.from] ? 'EXCLUDED ' : 'SHIPS    ') + f.from);
const inSub = all.filter((f) => norm(f.from).startsWith(R) && norm(f.from).slice(R.length).includes('/'));
console.log('collected from inside a research/ subfolder: ' + inSub.length);
console.log('collected with _evidence in the path (source or destination): ' + all.filter((f) => /_evidence\//.test(norm(f.from) + ' ' + norm(f.to))).length);
const rules = G.MANIFEST.filter((m) => m.dir && norm(m.dir).startsWith('exo_memory/research'));
console.log('manifest dir rules under exo_memory/research: ' + rules.map((m) => m.dir + ' match ' + m.match).join('; '));
for (const d of fs.readdirSync(path.join(W, R), { withFileTypes: true }).filter((e) => e.isDirectory() && /^t180_/.test(e.name))) {
  let n = 0;
  const walk = (p) => { for (const e of fs.readdirSync(p, { withFileTypes: true })) { if (e.isDirectory()) walk(path.join(p, e.name)); else n++; } };
  walk(path.join(W, R, d.name));
  console.log('  on disk: ' + R + d.name + '/ (' + n + ' files)');
}
const shipped = all.filter((f) => !G.EXCLUDE[f.from]);
console.log('shipped: ' + shipped.length + '; shipped under research/t180_ (source or destination): ' + shipped.filter((f) => [f.from, f.to].some((p) => norm(p).startsWith(R + 't180_'))).length);
console.log('research/ notes shipped: ' + shipped.filter((f) => norm(f.from).startsWith(R)).length);
