'use strict';
// D421 landing (O): run the frame-timing files ONE AT A TIME (--test-concurrency=1) under the heavy-run lock (both slots), spec to <out>.spec.txt, TAP to <out>.tap, wall time printed.
//   cwd = the t180 worktree:  node <this> <out prefix> <file> [<file> ...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const argv = process.argv.slice(2), pi = argv.indexOf('--pattern'), pattern = pi >= 0 ? argv.splice(pi, 2)[1] : null; const [outPrefix, ...files] = argv;
const WAIT = 2 * 60 * 60 * 1000;
HR.hold({ cmd: `t180 O D421 landing: timing rows ${files.map((f) => path.basename(f)).join(' ')}`, maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 't180 O D421 landing: timing rows (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());
const t0 = Date.now();
const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', ...(pattern ? [`--test-name-pattern=${pattern}`] : []), '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${outPrefix}.tap`, ...files],
  { encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true });
fs.writeFileSync(`${outPrefix}.spec.txt`, (r.stdout || '') + (r.stderr || ''));
console.log(JSON.stringify({ files, exit: r.status, wall_s: +((Date.now() - t0) / 1000).toFixed(1), started: new Date(t0).toISOString() }));
process.exitCode = r.status ?? 1;
