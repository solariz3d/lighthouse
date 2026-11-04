'use strict';
// D477: the touched test files, then app/test/core-close-mutation.test.js whole (the harness that mutates finish.js), in one heavy-run slot at BelowNormal.
const os = require('os'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const T = 'C:/Users/nname/Downloads/t180-wt-p477', S = __dirname;
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d477: the touched test files, then core-close-mutation whole (BelowNormal; not a timing session)', tree: T });
const FILES = ['test/core_close_banks_lap.test.js', 'test/core_finish_bank.test.js', 'test/core_finish.test.js', 'test/core_finish_joints.test.js', 'test/core_joint_c2.test.js',
  'test/core_close_best.test.js', 'test/core_close_flip.test.js', 'test/core_close_joint.test.js', 'test/core_close_refusal.test.js', 'test/core_close_local.test.js', 'test/core_close.test.js',
  'test/core_chord.test.js', 'test/sweep_joints.test.js', 'test/geom_mesh_rows.test.js',
  'app/test/core-bank-lap.test.js', 'app/test/core-bank-lap-twice.test.js', 'app/test/core-bank-lap-pins.test.js', 'app/test/core-smooth-ramps.test.js', 'app/test/core-trackmenu.test.js',
  'app/test/close-worker.test.js', 'app/test/core-close-preview.test.js', 'app/test/core-shell.test.js', 'app/test/core-readout-display.test.js', 'app/test/core-check-lean.test.js', 'app/test/undo-guard.test.js',
  'app/test/core-close-mutation.test.js'];
for (const f of FILES) {
  const base = path.basename(f, '.test.js'), tap = path.join(S, 'd477-' + base + '.tap'), t0 = Date.now();
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${tap}`, f], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 2 * 60 * 60 * 1000 });
  fs.writeFileSync(path.join(S, 'd477-' + base + '.spec.txt'), (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
  const m = ((r.stdout || '') + (r.stderr || '')).match(/ℹ (tests|pass|fail|skipped|todo) \d+/g);
  console.log(f.padEnd(44), 'exit', r.status, ((Date.now() - t0) / 1000).toFixed(1), 's', m ? m.join(' ') : '');
}
console.log('d477 runs done');
