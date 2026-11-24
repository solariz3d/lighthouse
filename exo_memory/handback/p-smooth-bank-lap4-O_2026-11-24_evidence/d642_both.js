// the D642 drag-cost row three times on 15b1306's export (with its own test file), against the tip's three in lap4_checks2_out.txt
const { spawnSync } = require('child_process');
for (const i of [1, 2, 3]) { const r = spawnSync(process.execPath, ['--test', 'app/test/core-extra-bank-drag-cost.test.js'], { cwd: 'G:/consonance-scratch/o-smooth-work/tmp/base15b', encoding: 'utf8', windowsHide: true });
  console.log(`15b1306 run ${i}: ` + (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter((l) => /^ℹ rolling \(first drag\)|^ℹ (pass|fail)/.test(l)).join(' | ')); }
