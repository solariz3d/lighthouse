// run-tests.js (D521, O): node --test on named files, BelowNormal, inside a heavy-run slot, TAP and a summary to <out>.   node run-tests.js <out> <tree> <files...>
const os = require('os'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [out, tree, ...files] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `d521 O t180 tests (${files.length} files, BelowNormal)` });
const t0 = Date.now(), r = spawnSync(process.execPath, ['--test', '--test-concurrency=2', '--test-reporter=tap', ...files], { cwd: tree, encoding: 'utf8', maxBuffer: 1 << 28 });
fs.writeFileSync(out, r.stdout + '\n' + r.stderr);
const pick = (k) => ((r.stdout.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1]);
console.log(`exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(0)} s: tests ${pick('tests')} pass ${pick('pass')} fail ${pick('fail')}`);
for (const l of r.stdout.split('\n')) if (/^\s*not ok/.test(l) && !/# TODO|# SKIP/.test(l)) console.log(l.slice(0, 220));
