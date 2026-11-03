// run the tests that name second-vantage, under the heavy-run lock, BelowNormal; TAP to argv[2]
const cp = require('child_process'), path = require('path'), fs = require('fs');
const root = 'C:/Users/nname/Desktop/worktrees/a-d632-wt';
process.chdir(root);
require(path.join(root, 'consonance/tools/heavy-run.js')).hold({ cmd: 'D632 A second-vantage touched tests (BelowNormal)' });
cp.spawnSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${process.pid}).PriorityClass='BelowNormal'`], { windowsHide: true });
const files = ['consonance/hooks/findings-return.test.js', 'consonance/tools/attached.test.js', 'consonance/tools/gen-consumer.fixture-scope.test.js',
  'consonance/tools/gen-consumer.test.js', 'consonance/tools/second-vantage.history.test.js', 'consonance/tools/second-vantage.test.js',
  'consonance/tools/usage.test.js', 'dev/vantage/install_vantage.test.js'];
const r = cp.spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...files], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
fs.writeFileSync(process.argv[2], (r.stdout || '') + (r.stderr || ''));
console.log('exit', r.status);
