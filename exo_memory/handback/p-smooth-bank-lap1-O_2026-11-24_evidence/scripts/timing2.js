// the two timing files, alone: branch then base, each in its own process
const { spawnSync } = require('child_process');
for (const tree of ['G:/consonance-scratch/o-smooth-t180', 'G:/consonance-scratch/o-smooth-base']) {
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', 'app/test/core-extra-bank-drag-cost.test.js', 'app/test/release-frame.test.js'], { cwd: tree, encoding: 'utf8', windowsHide: true });
  const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
  console.log('==', tree, '\n' + out.split('\n').filter((l) => /^ℹ (tests|pass|fail|todo|skipped)|AssertionError|^✖ (D642|row 1)/.test(l)).join('\n'));
}
