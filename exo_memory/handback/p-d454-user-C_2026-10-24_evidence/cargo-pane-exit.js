// cargo-pane-exit.js: `cargo test pane_exit` in pane C's d454-c worktree, under the heavy-run lock, at BelowNormal (children inherit).
// Red first: run 1 with the new pointer taken back out of refusal_notice (the test must fail), then the file is restored (finally) and
// run 2 must pass. A separate CARGO_TARGET_DIR in the scratchpad so no other seat's target is touched.
'use strict';
const os = require('os'), fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const W = 'C:/Users/nname/Desktop/worktrees/lh-d454-c';
process.chdir(W);
require(path.join(W, 'consonance/tools/heavy-run.js')).hold({ cmd: 'cargo test pane_exit (pane C, D454 part 2)' });
const target = path.join(__dirname, 'cargo-target');
const F = path.join(W, 'consonance/src-tauri/src/pane_exit.rs');
const orig = fs.readFileSync(F, 'utf8'), sha = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 16);
const POINTER = ' Why: consonance/GATES.md, \\"The app\'s delivery refusal\\".';
if (orig.split(POINTER).length !== 2) { console.log('ABORT: the pointer is not in refusal_notice exactly once'); process.exit(2); }
const CARGO = path.join(os.homedir(), '.cargo', 'bin', 'cargo.exe');   // not on the PATH this node sees
if (!fs.existsSync(CARGO)) { console.log('ABORT: no ' + CARGO); process.exit(2); }
const cargo = () => spawnSync(CARGO, ['test', '--manifest-path', 'consonance/src-tauri/Cargo.toml', '--', 'pane_exit'], { encoding: 'utf8', env: { ...process.env, CARGO_TARGET_DIR: target }, windowsHide: true, maxBuffer: 1 << 28 });
const tail = (r) => (r.error ? `SPAWN ERROR ${r.error.message}\n` : '') + (String(r.stdout || '') + String(r.stderr || '')).split('\n').filter((l) => /test result|FAILED|panicked|error(\[|:)/.test(l)).slice(0, 12).join('\n');
let red;
try {
  fs.writeFileSync(F, orig.replace(POINTER, ''));
  red = cargo();
  console.log(`RUN 1 (pointer removed): cargo exit ${red.status}\n${tail(red)}`);
} finally { fs.writeFileSync(F, orig); }
console.log(`restored: ${sha(fs.readFileSync(F, 'utf8')) === sha(orig) ? 'byte-identical' : 'DIFFERENT'}`);
const green = cargo();
console.log(`RUN 2 (as committed): cargo exit ${green.status}\n${tail(green)}`);
process.exit(red.status !== 0 && green.status === 0 ? 0 : 1);
