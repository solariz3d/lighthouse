'use strict';
// run_mutate_gc.js <worktree>: runs <worktree>/dev/mutation/mutate-gen-consumer.js under the heavy-run hold (the harness takes none itself and
// writes the tracked generator in place, restoring it after each mutant). A control run of the test file first: the harness counts any non-zero
// exit as CAUGHT, so on a red suite every mutant would read caught for nothing.
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const W = path.resolve(process.argv[2]);
require(path.join(W, 'consonance/tools/heavy-run.js')).hold({ cmd: 'C D678 N6: mutate-gen-consumer.js (gen-consumer.test.js per mutant)' });
const GC = path.join(W, 'consonance/tools/gen-consumer.js'), before = fs.readFileSync(GC, 'utf8');
const c = spawnSync(process.execPath, [path.join(W, 'consonance/tools/gen-consumer.test.js')], { encoding: 'utf8', windowsHide: true, cwd: W });
console.log('CONTROL unmutated: exit ' + c.status); if (c.status !== 0) process.exit(2);
const r = spawnSync(process.execPath, [path.join(W, 'dev/mutation/mutate-gen-consumer.js')], { encoding: 'utf8', windowsHide: true, cwd: W });
process.stdout.write(r.stdout + r.stderr);
console.log('harness exit ' + r.status + '; generator restored: ' + (fs.readFileSync(GC, 'utf8') === before));
