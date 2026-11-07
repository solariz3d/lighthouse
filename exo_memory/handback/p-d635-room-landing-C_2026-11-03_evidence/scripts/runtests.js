// runtests.js <label> <out.tap> <file>...: holds the heavy-run lock, sets BelowNormal, then runs each test file with
// node --test --test-concurrency=1 from the landing worktree's root, one at a time; prints per file pass/fail and a total.
'use strict';
const fs = require('fs'), os = require('os'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'C D635 landing: ' + process.argv[2] + ' (BelowNormal)' });
const W = 'C:/Users/nname/Desktop/worktrees/lh-d635-c';
const [out, ...files] = process.argv.slice(3);
let tap = '', P = 0, F = 0, bad = [];
for (const f of files) {
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=tap', f], { cwd: W, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
  const s = (r.stdout || '') + (r.stderr || '');
  tap += `\n##### ${f} exit ${r.status}\n` + s;
  const p = +((/^# pass (\d+)/m.exec(s) || [])[1] || 0), fl = +((/^# fail (\d+)/m.exec(s) || [])[1] || 0);
  P += p; F += fl; if (r.status !== 0) bad.push(f);
  console.log(`${f}: pass ${p} fail ${fl} exit ${r.status}`);
}
fs.writeFileSync(out, tap);
console.log(`TOTAL files ${files.length} pass ${P} fail ${F}; non-zero exit: ${bad.length ? bad.join(', ') : 'none'}`);
