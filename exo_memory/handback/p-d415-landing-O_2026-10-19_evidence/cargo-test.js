'use strict';
// D415 landing (O, 2026-10-19): `cargo test` on the whole consonance/src-tauri package, under the heavy-run lock holding BOTH slots (it waits
// out A's reserved timing window), with ~/.cargo/bin on PATH (C's hand-back: cargo is not on a seat shell's PATH). Output to <out>.
//   cwd = the lighthouse root:  node <this> <out file>
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const HR = require(path.resolve('consonance/tools/heavy-run.js'));
const out = process.argv[2];
const WAIT = 3 * 60 * 60 * 1000;
HR.hold({ cmd: 'lighthouse O D415 landing cargo test', maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 'lighthouse O D415 landing cargo test (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());
const head = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
const t0 = Date.now();
const r = spawnSync('cargo', ['test'], { cwd: path.resolve('consonance/src-tauri'), encoding: 'utf8', maxBuffer: 1 << 30, windowsHide: true,
  env: { ...process.env, PATH: `${path.join(os.homedir(), '.cargo', 'bin')}${path.delimiter}${process.env.PATH}` } });
fs.writeFileSync(out, `HEAD ${head}\nstarted ${new Date(t0).toISOString()} wall ${((Date.now() - t0) / 1000).toFixed(1)} s exit ${r.status}${r.error ? ' error ' + r.error.message : ''}\n\n${r.stdout || ''}\n${r.stderr || ''}`);
console.log(`exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exitCode = r.status ?? 1;
