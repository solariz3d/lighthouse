// touched.js: the test files that cover pane C's D454 part 2 change, one after another, under the heavy-run lock, at BelowNormal.
'use strict';
const os = require('os'), path = require('path'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const W = 'C:/Users/nname/Desktop/worktrees/lh-d454-c';
process.chdir(W);
require(path.join(W, 'consonance/tools/heavy-run.js')).hold({ cmd: 'D454 part 2 touched tests (pane C)' });
const FILES = ['consonance/tools/leftovers.test.js', 'consonance/tools/consumer-relabel.test.js', 'consonance/tools/heavy-run.test.js',
  'consonance/tools/front-door-links.test.js', 'consonance/tools/portable-paths.test.js', 'consonance/tools/identity-diff.test.js', 'consonance/tools/gen-consumer.test.js'];
let bad = 0;
for (const f of FILES) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ['--test', f], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
  const out = String(r.stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
  const n = (k) => (out.match(new RegExp(`ℹ ${k} (\\d+)`)) || [])[1];
  if (r.status !== 0) bad++;
  console.log(`${r.status === 0 ? 'ok  ' : 'FAIL'} ${f}: tests ${n('tests')} pass ${n('pass')} fail ${n('fail')} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  if (r.status !== 0) console.log(out.split('\n').filter((l) => /^\s*✖/.test(l)).slice(0, 10).join('\n'));
}
console.log(bad ? `${bad} file(s) FAILED` : 'all green');
process.exit(bad ? 1 : 0);
