'use strict';
// D424 landing (O): on lighthouse main after the d424-a merge, under the heavy-run lock holding BOTH slots (it waits out any timing run): `cargo test` in
// consonance/src-tauri whole (~/.cargo/bin on PATH), then node --test on the JS tests that read the briefs plus the one the merge touched.
//   cwd = the lighthouse root:  node <this> <out dir>
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const HR = require(path.resolve('consonance/tools/heavy-run.js'));
const OUT = process.argv[2], WAIT = 3 * 60 * 60 * 1000;
HR.hold({ cmd: 'lighthouse O D424 landing: cargo test + brief JS tests', maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: 'lighthouse O D424 landing (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());
const head = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
const PATHENV = { ...process.env, PATH: `${path.join(os.homedir(), '.cargo', 'bin')}${path.delimiter}${process.env.PATH}` };
let t0 = Date.now();
const c = spawnSync('cargo', ['test'], { cwd: path.resolve('consonance/src-tauri'), encoding: 'utf8', maxBuffer: 1 << 30, windowsHide: true, env: PATHENV });
fs.writeFileSync(path.join(OUT, 'cargo.out'), `HEAD ${head}\nstarted ${new Date(t0).toISOString()} wall ${((Date.now() - t0) / 1000).toFixed(1)} s exit ${c.status}${c.error ? ' error ' + c.error.message : ''}\n\n${c.stdout || ''}\n${c.stderr || ''}`);
const files = ['boundary-check.artifacts', 'carrier-drift', 'consumer-fork-wiring', 'consumer-relabel', 'gen-brief-gate', 'gen-consumer', 'identity-diff', 'lap-row', 'librarian-cite', 'librarian-notes', 'librarian-route', 'open-items-build', 'portable-paths', 'universe-print', 'chain-status'].map((f) => `consonance/tools/${f}.test.js`);
t0 = Date.now();
const j = spawnSync(process.execPath, ['--test', '--test-concurrency=1', '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${path.join(OUT, 'js.tap')}`, ...files], { encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true });
fs.writeFileSync(path.join(OUT, 'js.spec.txt'), `HEAD ${head}\nfiles ${files.join(' ')}\nstarted ${new Date(t0).toISOString()} wall ${((Date.now() - t0) / 1000).toFixed(1)} s exit ${j.status}\n\n${j.stdout || ''}\n${j.stderr || ''}`);
console.log(JSON.stringify({ head, cargo_exit: c.status, js_exit: j.status }));
process.exitCode = c.status || j.status || 0;
