// dragcost261.js (pane A, L261): core-extra-bank-drag-cost alternately on the change and at 7b3926e (4 runs), then core-bank-carry-mutation on the change. usage: node dragcost261.js <out txt> <harness tap>
'use strict';
const { spawnSync } = require('child_process'), fs = require('fs');
const [out, tap] = process.argv.slice(2), W = 'C:/Users/zackn/Downloads/t180-wt-';
fs.writeFileSync(out, '');
for (const t of ['l261-carry', 'l261-base', 'l261-carry', 'l261-base']) {
  const r = spawnSync(process.execPath, ['--test', 'app/test/core-extra-bank-drag-cost.test.js'], { cwd: W + t, encoding: 'utf8' });
  fs.appendFileSync(out, `== ${t} ${new Date().toISOString()} exit ${r.status}\n${r.stdout}${r.stderr}\n`);
}
const h = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'app/test/core-bank-carry-mutation.test.js'], { cwd: W + 'l261-carry', encoding: 'utf8', maxBuffer: 1 << 28 });
fs.writeFileSync(tap, h.stdout + (h.stderr ? `\n# STDERR\n${h.stderr}` : '')); fs.appendFileSync(out, `harness exit ${h.status}\n`);
