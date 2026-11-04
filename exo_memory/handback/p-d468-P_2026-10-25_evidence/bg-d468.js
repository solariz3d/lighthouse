'use strict';
const os = require('os'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const T = 'C:/Users/nname/Downloads/t180-wt-p468', S = __dirname;
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d468: Finish/extend touched files, then core-close, core_ramp and core_xsec mutation harnesses whole (BelowNormal; not a timing session)', tree: T });
const files = ['test/core_joint_c2.test.js', 'test/core_xsec.test.js', 'test/core_finish_bank.test.js', 'test/core_finish_joints.test.js', 'test/core_finish.test.js', 'test/core_close_banks_lap.test.js', 'test/core_close_best.test.js', 'test/core_close.test.js', 'test/core_close_local.test.js', 'test/core_close_joint.test.js', 'test/core_close_flip.test.js', 'test/core_ramp.test.js', 'test/core_cup.test.js', 'test/core_chord.test.js', 'test/sweep_c2.test.js', 'test/sweep_joints.test.js', 'app/test/core-close-preview.test.js', 'app/test/close-worker.test.js', 'app/test/drag-ghost.test.js', 'test/geom_mesh_rows.test.js',
  'app/test/core-close-mutation.test.js', 'test/core_ramp_mutation.test.js', 'test/core_xsec_mutation.test.js'];
for (const f of files) {
  const base = path.basename(f, '.test.js'), tap = path.join(S, 'd468-' + base + '.tap'), t0 = Date.now();
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${tap}`, f], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 90 * 60 * 1000 });
  fs.writeFileSync(path.join(S, 'd468-' + base + '.spec.txt'), (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
  const o = (r.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => (o.match(new RegExp(`ℹ ${k} (\d+)`)) || [])[1];
  console.log(f.padEnd(44), 'exit', r.status, `tests ${n('tests')} pass ${n('pass')} fail ${n('fail')} todo ${n('todo')}`, ((Date.now() - t0) / 1000).toFixed(1), 's');
}
console.log('d468 runs done');
