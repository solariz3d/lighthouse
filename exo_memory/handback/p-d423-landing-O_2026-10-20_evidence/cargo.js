'use strict';
// D423 (O, 2026-10-20): cargo with the given arguments in a lighthouse tree's consonance/src-tauri, under the heavy-run lock (both slots),
// ~/.cargo/bin on PATH. Output to <out>.   node cargo.js <lighthouse tree> <out file> <cargo args...>
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const [tree, out, ...args] = process.argv.slice(2);
const HR = require(path.join(path.resolve(tree), 'consonance/tools/heavy-run.js'));
process.chdir(path.resolve(tree));
HR.hold({ cmd: `lighthouse O D423 cargo ${args.join(' ')}`, maxWaitMs: 3 * 60 * 60 * 1000 });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 'lighthouse O D423 cargo (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: 3 * 60 * 60 * 1000 });
process.on('exit', () => h2.release());
const head = spawnSync('git', ['rev-parse', '--short=8', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
const t0 = Date.now();
const r = spawnSync('cargo', args, { cwd: path.resolve('consonance/src-tauri'), encoding: 'utf8', maxBuffer: 1 << 30, windowsHide: true,
  env: { ...process.env, PATH: `${path.join(os.homedir(), '.cargo', 'bin')}${path.delimiter}${process.env.PATH}` } });
fs.writeFileSync(out, `HEAD ${head} (plus working-tree changes)\ncargo ${args.join(' ')}\nstarted ${new Date(t0).toISOString()} wall ${((Date.now() - t0) / 1000).toFixed(1)} s exit ${r.status}${r.error ? ' error ' + r.error.message : ''}\n\n${r.stdout || ''}\n${r.stderr || ''}`);
console.log(`exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exitCode = r.status ?? 1;
