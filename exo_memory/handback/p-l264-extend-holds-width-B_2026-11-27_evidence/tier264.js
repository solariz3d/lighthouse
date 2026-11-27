// tier264.js (pane B, L264): the tier, run by heavy-run with cwd the worktree. (1) every test file that EXECUTES src/core/extend.js by L262's rule (reach.js: require()
// literals starting ./ or ../, transitively), the new row file among them, --test-concurrency=4; then (2) every mutation harness whose text names extend.js, the new
// one among them, --test-concurrency=2. Each to its own TAP in the scratch folder. The file lists are read from reach.js's output, never typed by hand.
// usage (from heavy-run): node tier264.js <tree> <reach list> <out dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync, execFileSync } = require('child_process');
const [tree, reachList, outDir] = process.argv.slice(2), T = path.resolve(tree);
const lines = fs.readFileSync(reachList, 'utf8').split(/\r?\n/), a = lines.indexOf('executes:'), b = lines.findIndex((l) => l.startsWith('harnesses naming it:'));
const rows = lines.slice(a + 1, b).map((l) => l.trim()).filter(Boolean);
const harn = execFileSync('git', ['-C', T, 'grep', '-l', 'extend\\.js', '--', 'test/*mutation*.test.js', 'app/test/*mutation*.test.js'], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const run = (name, files, conc) => {
  const tap = path.join(outDir, `${name}.tap`), t0 = Date.now();
  const fd = fs.openSync(tap, 'w');
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', `--test-concurrency=${conc}`, '--test-reporter=tap', ...files], { cwd: T, stdio: ['ignore', fd, fd] });
  fs.closeSync(fd);
  const s = `${name}: ${files.length} files, exit ${r.status}, ${Math.round((Date.now() - t0) / 1000)} s, ${new Date(t0).toISOString()} to ${new Date().toISOString()}`;
  console.log(s); fs.appendFileSync(path.join(outDir, 'tier264.log'), s + '\n');
};
fs.writeFileSync(path.join(outDir, 'tier264-files.txt'), `rows (${rows.length}):\n${rows.join('\n')}\nharnesses (${harn.length}):\n${harn.join('\n')}\n`);
run('tier-rows', rows, 4);
run('tier-harnesses', harn, 2);
