'use strict';
// D412 part 2 (b) (O): run named test files under the heavy-run lock (both slots), spec to <out>.spec.txt, TAP to <out>.tap, wall time printed.
//   cwd = the t180 worktree:  node <this> <out prefix> <file> [<file> ...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const [outPrefix, ...files] = process.argv.slice(2);
const WAIT = 2 * 60 * 60 * 1000;
HR.hold({ cmd: `t180 O D421 part 2 ${files.map((f) => path.basename(f)).join(' ')}`, maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 't180 O D421 part 2 (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());
const t0 = Date.now();
const r = spawnSync(process.execPath, ['--test', '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${outPrefix}.tap`, ...files],
  { encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true });
fs.writeFileSync(`${outPrefix}.spec.txt`, (r.stdout || '') + (r.stderr || ''));
console.log(JSON.stringify({ files, exit: r.status, wall_s: +((Date.now() - t0) / 1000).toFixed(1), started: new Date(t0).toISOString() }));
process.exitCode = r.status ?? 1;
