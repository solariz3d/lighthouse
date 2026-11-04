// score.js: run the vantage test file with node --test and print the counts in cargo's shape for mutant-harness.js
const cp = require('child_process');
const r = cp.spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'consonance/tools/second-vantage.test.js'],
  { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
const out = (r.stdout || '') + (r.stderr || '');
const pass = /^# pass (\d+)/m.exec(out), fail = /^# fail (\d+)/m.exec(out);
if (!pass || !fail) { console.log(out.slice(-2000)); process.exit(2); }
for (const m of out.matchAll(/^not ok \d+ - (.*)$/gm)) console.log(`test ${m[1].replace(/\W+/g, '_').slice(0, 60)} ... FAILED`);
console.log(`test result: ${+fail[1] === 0 && r.status === 0 ? 'ok' : 'FAILED'}. ${pass[1]} passed; ${fail[1]} failed`);
