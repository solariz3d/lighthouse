// pair-r3.js <tag> <worktree> <file>...: D625 r3 attribution. Runs each named test file alone (concurrency 1), BelowNormal, hidden, in <worktree>;
// writes out-r3/pair-<tag>-<basename>.tap and a line per file to out-r3/pair.log. 3 files or fewer per call (no heavy-run lock needed).
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const [tag, W, ...files] = process.argv.slice(2);
if (!tag || !W || !files.length || files.length > 3) throw new Error('usage: pair-r3.js <tag> <worktree> <1-3 files>');
const O = path.join(__dirname, 'out-r3'), LOG = path.join(O, 'pair.log');
os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
const head = spawnSync('git', ['-C', W, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8', windowsHide: true }).stdout.trim();
for (const f of files) {
  const out = path.join(O, `pair-${tag}-${path.basename(f, '.test.js')}.tap`), fd = fs.openSync(out, 'w'), t0 = Date.now();
  const r = spawnSync('node', ['--test', '--test-reporter=tap', '--test-concurrency=1', f], { cwd: W, windowsHide: true, stdio: ['ignore', fd, fd] });
  fs.closeSync(fd);
  const s = fs.readFileSync(out, 'utf8'), n = (k) => ((s.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1]);
  fs.appendFileSync(LOG, `${new Date().toISOString().slice(11, 19)}Z ${tag} ${head} ${f}: exit ${r.status}, pass ${n('pass')} fail ${n('fail')}, ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
}
