'use strict';
// D438 build (O): what a surviving mutant changes. Each named mutant of d438-mutants.js applied to the tree's finish.js, figures.js run on TEST TRACK 10, TEST 10
// and row 5's built track, then restored (also on exit); the unmutated tree first. Under the heavy-run lock.   node survivor-figures.js <tree> <id,id,...>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), IDS = process.argv[3].split(','), FILE = path.join(TREE, 'src/core/finish.js');
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd438 survivor figures (finish.js mutated in turn)', tree: TREE });
const src = fs.readFileSync(FILE, 'utf8'); process.on('exit', () => fs.writeFileSync(FILE, src));
const M = fs.readFileSync(path.join(__dirname, 'd438-mutants.js'), 'utf8'), rows = {};
for (const m of M.matchAll(/^  \['(\w+) ([^']*)', '((?:[^'\\]|\\.)*)', '((?:[^'\\]|\\.)*)'\],$/gm)) rows[m[1]] = { name: m[2], from: m[3].replace(/\\n/g, '\n').replace(/\\'/g, "'"), to: m[4].replace(/\\n/g, '\n').replace(/\\'/g, "'") };
const built = `const D = require(${JSON.stringify(path.join(TREE, 'src/core/document.js'))}), { extend } = require(${JSON.stringify(path.join(TREE, 'src/core/extend.js'))}), { extendTurnBy } = require(${JSON.stringify(path.join(TREE, 'src/core/turnby.js'))});
let d = D.createDoc('rolled cup'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, Math.PI);
process.stdout.write(D.serialize(extend(d, { length: 300, targets: { c: 35, phi: (40 * Math.PI) / 180 } })));`;
fs.writeFileSync(path.join(TREE, 'fixtures-d431', 'row5-built.t180track'), spawnSync(process.execPath, ['-e', built], { encoding: 'utf8' }).stdout);
for (const id of ['none', ...IDS]) {
  const norm = src.replace(/\r\n/g, '\n');
  if (id !== 'none') { const r = rows[id]; if (!r || norm.split(r.from).length !== 2) { console.log(`== ${id}: NOT APPLIED`); continue; } fs.writeFileSync(FILE, norm.replace(r.from, r.to)); }
  const out = spawnSync(process.execPath, [path.join(__dirname, 'figures.js'), TREE, TREE, 'testtrack10-open,test10-open,row5-built'], { encoding: 'utf8' });
  console.log(`== ${id}${id === 'none' ? ' (the tree as it is)' : ' ' + rows[id].name}\n${out.stdout}${out.stderr.slice(-300)}`);
  fs.writeFileSync(FILE, src);
}
fs.rmSync(path.join(TREE, 'fixtures-d431', 'row5-built.t180track'));
