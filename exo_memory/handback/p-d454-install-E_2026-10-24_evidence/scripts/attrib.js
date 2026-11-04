// attrib.js (D454 part 3, pane E): the 13 files red or crashed in README's js-suite in the stranger clone of gen2, each run on its own in
// BOTH stranger clones: clone (the tree generated at HEAD 087b3c60) and clone2 (gen2, d454-e 06a1a739), same stranger env (env2.txt), and also
// in the d454-e worktree with this machine's env. A file red in clone too is the generated tree's own (B's parity); red only in clone2 is mine.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const env = {}; for (const l of fs.readFileSync(path.join(__dirname, 'env2.txt'), 'utf8').split('\n')) { const i = l.indexOf('='); if (i > 0) env[l.slice(0, i)] = l.slice(i + 1); }
const FILES = ['consonance/hooks/claim-check.test.js', 'consonance/hooks/delete-gate.test.js', 'consonance/hooks/dispatch-gate.test.js', 'consonance/hooks/dream-gate.test.js',
  'consonance/hooks/push-gate.test.js', 'consonance/hooks/sessionstart-state.test.js', 'consonance/tools/attached.test.js', 'consonance/tools/claim-check-adapter.test.js',
  'consonance/tools/claim-replay.test.js', 'consonance/tools/janitor.test.js', 'consonance/tools/mistake-bench.test.js', 'consonance/tools/pulse-degrade.test.js', 'consonance/tools/scratch.test.js'];
const TREES = [['clone(HEAD)', 'C:/Users/nname/Downloads/cons-d454-e/clone/consonance', env], ['clone2(d454-e)', 'C:/Users/nname/Downloads/cons-d454-e/clone2/consonance', env],
  ['worktree(this machine env)', 'C:/Users/nname/Downloads/lh-wt-d454-e', process.env]];
const res = {};
for (const f of FILES) for (const [name, root, e] of TREES) {
  const r = spawnSync(process.execPath, [f], { cwd: root, env: e, encoding: 'utf8', timeout: 300000, windowsHide: true, maxBuffer: 1 << 26 });
  const why = ((r.stdout || '') + (r.stderr || '')).split('\n').map((l) => l.replace(/\x1b\[[0-9;]*m/g, '')).find((l) => /Error|expected:|FAIL |MODULE_NOT_FOUND|Cannot find module/.test(l)) || '';
  (res[f] = res[f] || []).push(`${name}: exit ${r.status}${r.status ? ' — ' + why.trim().slice(0, 110) : ''}`);
}
for (const [f, rows] of Object.entries(res)) { console.log(f); for (const r of rows) console.log('   ' + r); }
