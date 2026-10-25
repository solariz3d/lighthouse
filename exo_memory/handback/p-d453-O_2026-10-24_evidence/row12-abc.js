'use strict';
// D453 (O): core_close_best row 12 alone (the reported 25 km save, one press under 30 s of main-thread CPU), back to back on the trees given, in one heavy-run slot,
// the whole run at BelowNormal; its diagnostic line is printed per tree.   node row12-abc.js <tree> [<tree> ...]
const os = require('os'), path = require('path'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
HR.hold({ cmd: 'd453 core_close_best row 12 alone, back to back on ' + process.argv.slice(2).map((x) => path.basename(x)).join(', ') });   // one slot for all, released on exit
for (const tree of process.argv.slice(2)) {
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-name-pattern=row 12', 'test/core_close_best.test.js'], { cwd: tree, encoding: 'utf8', maxBuffer: 1 << 28 });
  const diag = (r.stdout.match(/one press used[^\n]*|main thread [0-9]+ ms CPU[^\n]*/g) || []).join(' | '), res = (r.stdout.match(/^(not )?ok \d+ - row 12[^\n]{0,40}/m) || ['?'])[0];
  console.log(`${path.basename(tree)}: ${res} :: ${diag}`);
}
