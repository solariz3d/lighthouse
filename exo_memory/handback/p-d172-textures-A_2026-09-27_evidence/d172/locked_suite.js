// the t180 full suite under the heavy-run lock, at --test-concurrency=4 (the chair's rule, 2026-09-27 16:59)
const { spawnSync } = require('child_process');
const fs = require('fs');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 npm test (D178 A), concurrency 4' });
const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', 'test/*.test.js', 'app/test/*.test.js'],
  { cwd: 'C:/Users/nname/Desktop/t180-track-builder', encoding: 'utf8', maxBuffer: 1 << 28 });
fs.writeFileSync(__dirname + '/npmtest.txt', (r.stdout || '') + (r.stderr || ''));
console.log('exit', r.status);
