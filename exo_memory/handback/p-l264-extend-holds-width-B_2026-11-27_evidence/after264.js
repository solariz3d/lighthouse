// after264.js (pane B, L264): run by heavy-run --exclusive. (1) drag-ghost.test.js, with its row 5 amended, on c522ea6 and on the branch (row 5 should be red on the
// base: the corners' width ran on there); (2) the new harness, test/core_width_hold_mutation.test.js, which the tier's list missed (it took harnesses from git grep, and
// the file is not committed yet); (3) D642's drag-cost row file, alternately on the base and the branch, twice each, nothing else running (the exclusive hold).
// usage: node after264.js <branch tree> <base tree> <out dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [branch, base, outDir] = process.argv.slice(2);
const run = (name, tree, files, extra = []) => {
  const tap = path.join(outDir, `${name}.tap`), t0 = Date.now(), fd = fs.openSync(tap, 'w');
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', '--test-reporter=tap', ...extra, ...files], { cwd: tree, stdio: ['ignore', fd, fd] });
  fs.closeSync(fd);
  const s = `${name}: ${path.basename(tree)}, exit ${r.status}, ${Math.round((Date.now() - t0) / 1000)} s, ${new Date(t0).toISOString()}`;
  console.log(s); fs.appendFileSync(path.join(outDir, 'after264.log'), s + '\n');
};
run('dg-base', base, ['app/test/drag-ghost.test.js']);
run('dg-branch', branch, ['app/test/drag-ghost.test.js']);
run('hold-harness', branch, ['test/core_width_hold_mutation.test.js']);
for (const k of [1, 2]) { run(`d642-base${k}`, base, ['app/test/core-extra-bank-drag-cost.test.js']); run(`d642-branch${k}`, branch, ['app/test/core-extra-bank-drag-cost.test.js']); }
