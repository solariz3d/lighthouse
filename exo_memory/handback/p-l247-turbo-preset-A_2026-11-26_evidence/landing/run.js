// L247 landing (pane A): the full suite once on the merged tree 95e772a9, in C:\Consonance\lh-wt-l247 (detached).
// This process sets itself to below normal first, so everything it starts inherits it. Three parts in sequence:
//   1. js-suite.js (it takes its own heavy-run slot);
//   2. TAP: `node --test --test-reporter=tap <file>` for the same files, one at a time, under `heavy-run --run`;
//   3. cargo test -q for the native side, under `heavy-run --run`.
// Writes js-suite.out, tap.out, tap-failed.txt, cargo-test.out and run.log beside this file.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const TREE = 'C:\\Consonance\\lh-wt-l247';
const OUT = __dirname;
const HR = path.join(TREE, 'consonance', 'tools', 'heavy-run.js');
const log = (s) => fs.appendFileSync(path.join(OUT, 'run.log'), `${new Date().toISOString()} ${s}\n`);
const env = { ...process.env, CARGO_TARGET_DIR: 'C:\\build\\lighthouse-target' };
const git = (a) => spawnSync('git', a, { cwd: TREE, encoding: 'utf8' }).stdout.trim();
log(`start HEAD ${git(['rev-parse', 'HEAD'])} status-lines ${git(['status', '--short']).split('\n').filter(Boolean).length}`);

// 1. js-suite
let t = Date.now();
let r = spawnSync(process.execPath, [path.join(TREE, 'consonance', 'tools', 'js-suite.js')], { cwd: TREE, env, encoding: 'utf8', maxBuffer: 256 << 20 });
fs.writeFileSync(path.join(OUT, 'js-suite.out'), (r.stdout || '') + (r.stderr || ''));
log(`js-suite exit ${r.status} in ${Math.round((Date.now() - t) / 1000)} s`);

// 2. TAP, one file at a time, under one heavy-run slot
const list = spawnSync(process.execPath, [path.join(TREE, 'consonance', 'tools', 'js-suite.js'), '--list'], { cwd: TREE, encoding: 'utf8' })
  .stdout.split('\n').filter((l) => l.endsWith('.test.js'));
fs.writeFileSync(path.join(OUT, 'tap-files.txt'), list.join('\n') + '\n');
const tapDriver = path.join(OUT, 'tap.js');
fs.writeFileSync(tapDriver, `'use strict';
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const TREE = ${JSON.stringify(TREE)}, OUT = ${JSON.stringify(OUT)};
const files = fs.readFileSync(path.join(OUT, 'tap-files.txt'), 'utf8').split('\\n').filter(Boolean);
const tot = { tests: 0, pass: 0, fail: 0, skipped: 0, todo: 0, cancelled: 0 }; const notZero = []; const failed = [];
const out = fs.openSync(path.join(OUT, 'tap.out'), 'w');
for (const f of files) {
  const t = Date.now();
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', f], { cwd: TREE, encoding: 'utf8', timeout: 300000, maxBuffer: 256 << 20 });
  const text = (r.stdout || '') + (r.stderr || '');
  fs.writeSync(out, '### ' + f + ' exit ' + r.status + (r.signal ? ' signal ' + r.signal : '') + ' ' + (Date.now() - t) + ' ms\\n' + text + '\\n');
  const n = {};
  for (const k of Object.keys(tot)) { const m = new RegExp('^# ' + k + ' (\\\\d+)', 'm').exec(text); n[k] = m ? Number(m[1]) : 0; tot[k] += n[k]; }
  if (r.status !== 0) notZero.push(f + ' exit ' + r.status + (r.signal ? ' ' + r.signal : ''));
  if (n.fail) failed.push(f + ' fail ' + n.fail);
}
const line = 'TAP files ' + files.length + ' · tests ' + tot.tests + ' · pass ' + tot.pass + ' · fail ' + tot.fail + ' · skipped ' + tot.skipped + ' · todo ' + tot.todo + ' · cancelled ' + tot.cancelled + ' · not exit 0: ' + notZero.length;
fs.writeSync(out, '\\n' + line + '\\n'); fs.closeSync(out);
fs.writeFileSync(path.join(OUT, 'tap-failed.txt'), line + '\\nfailed:\\n' + failed.join('\\n') + '\\nnot exit 0:\\n' + notZero.join('\\n') + '\\n');
process.exit(0);
`);
t = Date.now();
r = spawnSync(process.execPath, [HR, '--run', '--cmd', 'L247 landing TAP (pane A)', '--', process.execPath, tapDriver], { cwd: TREE, env, encoding: 'utf8', maxBuffer: 64 << 20 });
log(`tap exit ${r.status} in ${Math.round((Date.now() - t) / 1000)} s; ${(r.stderr || '').trim().split('\n').slice(-2).join(' | ')}`);

// 3. cargo test
t = Date.now();
r = spawnSync(process.execPath, [HR, '--run', '--cmd', 'L247 landing cargo test (pane A)', '--', 'cargo', 'test', '-q', '--manifest-path', path.join(TREE, 'consonance', 'src-tauri', 'Cargo.toml')], { cwd: TREE, env, encoding: 'utf8', maxBuffer: 256 << 20 });
fs.writeFileSync(path.join(OUT, 'cargo-test.out'), (r.stdout || '') + (r.stderr || ''));
log(`cargo exit ${r.status} in ${Math.round((Date.now() - t) / 1000)} s`);
log(`end HEAD ${git(['rev-parse', 'HEAD'])} status-lines ${git(['status', '--short']).split('\n').filter(Boolean).length}`);
