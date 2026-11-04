'use strict';
// D439 (O): do the surviving side-load mutants K4 (the side load leaves out gravity) and K5 (it reads the whole lap, not the closer) change any CHOICE? Each is
// applied to finish.js in turn (d439-mutants.js's edits), modes.js runs its seven laps plus a lap whose own turn is tight (180° over 400 m, R 127 m, more side
// load than either closer), and the choices are printed beside the tree's own; restored after (also on exit). Under the heavy-run lock.
//   node k-choices.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), FILE = path.join(TREE, 'src/core/finish.js');
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd439 K4/K5 choices (finish.js mutated: do not read this tree meanwhile)', tree: TREE });
const src = fs.readFileSync(FILE, 'utf8'); process.on('exit', () => fs.writeFileSync(FILE, src));
const M = { none: null, K4: ['(v * v * k[1] + G) * q.L[1]', '(v * v * k[1]) * q.L[1]'], K5: ['side: sideLoad(out.result.doc, doc.pieces.length)', 'side: sideLoad(out.result.doc, 0)'] };
const tight = `const path = require('path'), T = ${JSON.stringify(TREE)}, D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'src/core/finish.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js'));
let e = D.createDoc('p'); e = extend(e, { length: 1000, family: 'bowl', first: { c: 10 } }); e = extendTurnBy(e, { length: 400, targets: { kv: 0 } }, Math.PI); e = extend(e, { length: 1200, targets: { c: 35, phi: 10 * Math.PI / 180 } });
const r = F.finishToStart(e); console.log('  tight own turn (180 over 400 m), tail 1200 roll 10: roll ' + (r.plan.rollFirst ? 'FIRST' : 'LAST') + ', ' + r.plan.lengthM + ' m | ' + r.plan.report.slice(0, 90));`;
for (const [id, edit] of Object.entries(M)) {
  const norm = src.replace(/\r\n/g, '\n');
  if (edit) { if (norm.split(edit[0]).length !== 2) { console.log(`== ${id}: NOT APPLIED`); continue; } fs.writeFileSync(FILE, norm.replace(edit[0], edit[1])); }
  const a = spawnSync(process.execPath, [path.join(__dirname, 'modes.js'), TREE], { encoding: 'utf8' }), b = spawnSync(process.execPath, ['-e', tight], { encoding: 'utf8' });
  console.log(`== ${id}\n${a.stdout.split('\n').filter((l) => l.startsWith('  ')).map((l) => l.replace(/; hold.*$/, '')).join('\n')}\n${b.stdout.trim()}${b.stderr ? ' ERR ' + b.stderr.slice(-200) : ''}`);
  fs.writeFileSync(FILE, src);
}
