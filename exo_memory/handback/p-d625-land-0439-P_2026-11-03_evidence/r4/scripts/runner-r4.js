// runner-r4.js (D625 r4, from runner-r3.js: out-r4; timing claims with CONSONANCE_HEAVY_SLOTS=1, so it waits until NO lock is live, and its second-slot
// holder runs at the default count so slot 2 is held too and nothing joins beside it)
// runner-r3.js (D625 r3, from runner-r2.js) <phase: suite | timing>. r3: the suite holds ONE slot at BelowNormal; the timing files run solo at NORMAL
// (both slots, so nothing beside them and sculpt-frame's timed rows run), with drag-frame added; the sweep names windows only there.
// runner.js <phase: suite | timing>: D625's locked runs in the 0.4.39 landing tree. Waits while acs.exe runs or another seat's lock names a timing
// session; holds BOTH heavy-run slots (this run's, and the other through holder2.js), BelowNormal, very low I/O on every descendant
// (lowio-sweep.ps1), every spawn hidden. suite: the release build, the full suite (every file, the mutant harnesses whole), cargo test --lib.
// timing: the frame-timing files one at a time, alone, with CONSONANCE_DATA set so sculpt-frame's timed rows can see both slots.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync, spawn } = require('child_process');
const phase = process.argv[2], S = __dirname, O = path.join(S, 'out-r4'), W = 'C:/Users/nname/Desktop/worktrees/t180-p625r2'; fs.mkdirSync(O, { recursive: true });
const LOG = path.join(O, `${phase}.log`), log = (s) => fs.appendFileSync(LOG, `${new Date().toISOString().slice(11, 19)}Z ${s}\n`);
const hidden = { windowsHide: true, encoding: 'utf8' };
const acs = () => /acs\.exe/i.test(spawnSync('tasklist', ['/FI', 'IMAGENAME eq acs.exe', '/NH'], hidden).stdout || '');
const othersTiming = () => fs.readdirSync('C:/Consonance/data').filter((f) => /^heavy-run(\.\d+)?\.lock$/.test(f)).some((f) => {
  try { const c = JSON.parse(fs.readFileSync(path.join('C:/Consonance/data', f), 'utf8')).cmd || ''; return /timing|sculpt-frame|ABAB/i.test(c) && !/not a timing/i.test(c) && !/^t180 P D625/.test(c); } catch (e) { return false; } });
while (acs() || othersTiming()) { log(`waiting: acs.exe ${acs()}, another seat's timing session ${othersTiming()}`); spawnSync('node', ['-e', 'setTimeout(()=>{},60000)'], hidden); }
log(`clear: acs.exe not running, no timing session held by another seat`);
if (phase === 'suite') os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);   // r3: timing stays NORMAL
process.env.CONSONANCE_HEAVY_WAIT_MS = '3600000';
const cmd = phase === 'timing' ? 't180 P D625 r4 timing session: the frame-timing files solo at normal priority, in the 0.4.39 r4 landing tree (slots=1, plus slot 2 held)'
  : 't180 P D625 r4 0.4.39 landing: release build, full suite with the mutant harnesses, cargo lib (not a timing session; one slot)';
if (phase === 'timing') process.env.CONSONANCE_HEAVY_SLOTS = '1';
const h = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd });
log(`holding slot ${h.slot} (${h.file})`);
const ready = path.join(O, `${phase}.ready`), stop = path.join(O, `${phase}.stop`); for (const f of [ready, stop]) fs.rmSync(f, { force: true });
const env2 = { ...process.env }; delete env2.CONSONANCE_HEAVY_RUN_TOKEN; delete env2.CONSONANCE_HEAVY_SLOTS;
if (phase === 'timing') spawn('node', [path.join(S, 'holder2.js'), String(process.pid), cmd + ' [second slot]', ready, stop], { cwd: S, env: env2, windowsHide: true, stdio: 'ignore' });
if (phase === 'suite') fs.writeFileSync(ready, 'one slot, no second holder (r3)');
for (let i = 0; !fs.existsSync(ready); i++) { if (i > 3700) { log('second slot never came'); process.exit(5); } spawnSync('node', ['-e', 'setTimeout(()=>{},1000)'], hidden); }
log(`second slot held: ${fs.readFileSync(ready, 'utf8')}`);
spawn('powershell.exe', ['-NoProfile', '-WindowStyle', 'Hidden', '-ExecutionPolicy', 'Bypass', '-File', path.join(S, 'lowio-sweep3.ps1'), '-Root', String(process.pid), '-Stop', stop, '-Log', path.join(O, `${phase}-lowio.log`), ...(phase === 'timing' ? ['-NameOnly'] : [])], { windowsHide: true, stdio: 'ignore' });
const run = (label, file, args, opts = {}) => {
  const t0 = Date.now(); const fd = fs.openSync(path.join(O, label), 'w');
  const r = spawnSync(file, args, { cwd: W, windowsHide: true, stdio: ['ignore', fd, fd], maxBuffer: 1 << 30, ...opts }); fs.closeSync(fd);
  log(`${label}: exit ${r.status}${r.error ? ' error ' + r.error.message : ''}, ${((Date.now() - t0) / 1000).toFixed(0)} s`); return r.status;
};
const cargoBin = 'C:/Users/nname/.cargo/bin'; process.env.PATH = cargoBin + path.delimiter + process.env.PATH;
try {
  log(`head ${spawnSync('git', ['-C', W, 'rev-parse', '--short', 'HEAD'], hidden).stdout.trim()} tree ${spawnSync('git', ['-C', W, 'rev-parse', '--short', 'HEAD^{tree}'], hidden).stdout.trim()}; status lines ${spawnSync('git', ['-C', W, 'status', '--short'], hidden).stdout.split('\n').filter(Boolean).length}`);
  if (phase === 'suite') {
    fs.mkdirSync(path.join(W, 'src-tauri/dist'), { recursive: true });   // the repo CLAUDE.md: build.rs fills an empty dist (C's D615 correction)
    process.env.CARGO_TARGET_DIR = 'G:/Consonance-tools/scratch-P-d625/target';
    run('build.out', 'node', ['src-tauri/release.cjs']);
    run('full.tap', 'node', ['--test', '--test-reporter=tap', '--test-concurrency=4', 'test/*.test.js', 'app/test/*.test.js']);
    run('cargo.out', 'cargo', ['test', '--lib'], { cwd: W + '/src-tauri' });
  } else {
    process.env.CONSONANCE_DATA = 'C:/Consonance/data';
    for (const f of ['app/test/preview-speed.test.js', 'app/test/sculpt-frame.test.js', 'app/test/preview-lod-frame.test.js', 'app/test/preview-close-reuse.test.js', 'app/test/drag-frame.test.js'])
      run(`timing-${path.basename(f, '.test.js')}.tap`, 'node', ['--max-old-space-size=4096', '--test', '--test-reporter=tap', '--test-concurrency=1', f]);
  }
} finally { fs.writeFileSync(stop, 'done'); spawnSync('node', ['-e', 'setTimeout(()=>{},8000)'], hidden); log('done'); }
