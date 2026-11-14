// bench.js (D675, pane C, row C: the filter's cost): pane P's bench.js (its gibench folder), adapted. The branch d675-filter-c
// at ba127dd in C:/Users/nname/Desktop/worktrees/dz3-filter-c, its exe built clean first; two arms, defaults and filter; the card's
// users at each run's start and end (private log; counts in bench.log); its clocks every 2 s through each run.
// (P's own header follows.)
// Run INSIDE the exclusive hold: node consonance/tools/heavy-run.js --run --exclusive --cmd "..." -- node bench.js
// Each arm is a config dir in this scratch folder (a copy of the clone's game/config plus a world.local.txt with flashlight = 1 and the
// arm's lines), passed with --config, so nothing in the clone is written. dz-world --bench is offscreen (main.cpp:311) and read-only
// (offscreen.cpp:298, WorldApp(..., true, ...)); no sound device is opened on that path.
// Order: D F B X, three rounds, then D again (begin and end with defaults). Each run is watched every 2 s; a run during which another
// heavy or GPU process or another seat's lock appears, or that drew fewer frames than it paced, is VOID by name and re-run (up to 3 tries).
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawn, execFileSync } = require('child_process');
const CLONE = 'C:/Users/nname/Desktop/worktrees/dz3-filter-c', EXE = path.win32.join(CLONE, 'build', 'bin', 'dz-world.exe');
const O = __dirname, LOG = path.join(O, 'bench.log'), DATA = 'C:/Consonance/data';
const log = (s) => { const l = `${new Date().toISOString().slice(11, 23)}Z ${s}`; fs.appendFileSync(LOG, l + '\n'); };
os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
const ARMS = { defaults: [], filter: ['light_filter = 3', 'light_filter_kernel = 3'] };
const ORDER = [];
for (let r = 1; r <= 3; r++) for (const a of ['defaults', 'filter']) ORDER.push(a);
ORDER.push('defaults');
const START = Number(process.env.BENCH_START || 1);   // resume: the first run number to do (1-based)
const ARGS = ['--bench', '30', '--chasers', '--seed', '1', '--size', '2560', '1440'];
const PACED = 30 * 360 + 1;   // 3,601 for the experiment's 10 s at 360 Hz (REPORT.md :238)

// the clone must be exactly as handed over, before and after
const state = () => execFileSync('git', ['-C', CLONE, 'status', '--porcelain', '--ignored'], { encoding: 'utf8', windowsHide: true }).trim();
const head = execFileSync('git', ['-C', CLONE, 'rev-parse', 'HEAD'], { encoding: 'utf8', windowsHide: true }).trim();
if (!head.startsWith('4e90b03')) { log(`STOP: clone at ${head}`); process.exit(2); }
const before = state();
const exeStat = () => { const s = fs.statSync(EXE); return `${s.size} bytes, mtime ${s.mtime.toISOString()}`; };
const exeBefore = exeStat();
fs.writeFileSync(path.join(O, 'clone-state-before.txt'), before + '\n');

for (const [arm, lines] of Object.entries(ARMS)) {
  const dir = path.join(O, 'cfg-' + arm);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(path.join(CLONE, 'game', 'config'))) if (f.endsWith('.txt')) fs.copyFileSync(path.join(CLONE, 'game', 'config', f), path.join(dir, f));
  fs.writeFileSync(path.join(dir, 'world.local.txt'), ['flashlight = 1', ...lines].join('\n') + '\n');
}

const WATCH = /^(acs|t180-track-builder|dz-world|dz-gym|dz-view|dz-chase|dz-sim|dz-gen|blender|cmake|ninja|cl|link|lib|ctest|msbuild|.*_tests)\.exe$/i;
const procs = () => execFileSync('tasklist', ['/fo', 'csv', '/nh'], { encoding: 'utf8', windowsHide: true }).split(/\r?\n/)
  .map((l) => l.split('","')).filter((p) => p.length > 1).map((p) => ({ name: p[0].replace(/^"/, ''), pid: Number(p[1]) }));
const myToken = process.env.CONSONANCE_HEAVY_RUN_TOKEN || '';
const otherLocks = () => fs.readdirSync(DATA).filter((f) => /^heavy-run((\.\d+)?\.lock|\.hold)$/.test(f)).map((f) => {
  try { const j = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); return j.token === myToken ? null : `${f}: ${j.cmd}`; } catch (_) { return `${f}: unreadable`; }
}).filter(Boolean);
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
// pane C: the card's users (process names from nvidia-smi's process table; PRIVATE: names go to card-users.log only) and state.
const PRIV = path.join(O, 'card-users.log');
const cardUsers = () => {
  const t = execFileSync('nvidia-smi', [], { encoding: 'utf8', windowsHide: true });
  const i = t.indexOf('Processes');
  return [...new Set((i < 0 ? '' : t.slice(i)).match(/[A-Za-z0-9_.-]+\.exe/g) || [])].sort();
};
const cardState = () => execFileSync('nvidia-smi', ['--query-gpu=utilization.gpu,clocks.sm,clocks.mem,pstate,power.draw,temperature.gpu',
  '--format=csv,noheader,nounits'], { encoding: 'utf8', windowsHide: true }).trim().split(/,\s*/);
let BASE = null;
const usersNote = (when, label) => {
  const u = cardUsers(), st = cardState();
  fs.appendFileSync(PRIV, `${new Date().toISOString()} ${label} ${when}: ${u.join(' ')}\n`);
  const extra = BASE ? u.filter((n) => n !== 'dz-world.exe' && !BASE.includes(n)) : [];
  log(`  ${label} ${when}: card ${st[0]}% busy, SM ${st[1]} MHz, memory ${st[2]} MHz, ${st[3]}, ${st[4]} W, ${st[5]} C; ` +
      `${u.length} processes on the card, ${extra.length} not in the session's first list`);
  return extra;
};

function waitQuiet(label) {
  for (let n = 0; ; n++) {
    const busy = procs().filter((p) => WATCH.test(p.name)).map((p) => `${p.name} ${p.pid}`);
    if (!busy.length) return;
    if (n % 15 === 0) log(`WAIT before ${label}: running ${busy.join(', ')}; never closed`);
    sleep(2000);
  }
}

async function runOnce(arm, k, attempt) {
  const label = `${String(k).padStart(2, '0')}-${arm}${attempt > 1 ? '-try' + attempt : ''}`;
  waitQuiet(label);
  const out = path.join(O, `bench_${label}.txt`), fd = fs.openSync(out, 'w');
  const t0 = new Date();
  const startExtra = usersNote('start', label);
  const clocks = [];
  const child = spawn(EXE, [...ARGS, '--config', path.win32.join(O, 'cfg-' + arm)], { cwd: path.join(CLONE, 'build', 'bin'), windowsHide: true, stdio: ['ignore', fd, fd] });
  const disturb = new Set();
  const timer = setInterval(() => {
    try {
      for (const p of procs()) if (WATCH.test(p.name) && p.pid !== child.pid) disturb.add(`${p.name} ${p.pid}`);
      for (const l of otherLocks()) disturb.add(l);
      // (session 1 polled nvidia-smi here every 2 s and every run dropped frames, defaults too: removed; the card is read at start and end only)
    } catch (e) { disturb.add('watch failed: ' + e.message); }
  }, 2000);
  const code = await new Promise((ok) => child.on('exit', (c) => ok(c)));
  clearInterval(timer); fs.closeSync(fd);
  const endExtra = usersNote('end', label);
  if (startExtra.length || endExtra.length) disturb.add('company on the card at start or end');
  if (clocks.length) {
    const sm = clocks.map((c) => c[0]), mem = clocks.map((c) => c[1]);
    log(`  ${label} clocks over the run (${clocks.length} samples): SM ${Math.min(...sm)}-${Math.max(...sm)} MHz, memory ` +
        `${Math.min(...mem)}-${Math.max(...mem)} MHz, states ${[...new Set(clocks.map((c) => c[2]))].join(' ')}`);
  }
  const text = fs.readFileSync(out, 'utf8');
  const gpu = text.match(/GPU frame \(timestamps, first pass to last\): avg ([\d.]+) ms, p50 ([\d.]+), p99 ([\d.]+), worst ([\d.]+) \((\d+) frames\)/);
  const why = [];
  if (code !== 0) why.push(`exit ${code}`);
  if (!gpu) why.push('no GPU frame line');
  else if (Number(gpu[5]) < PACED) why.push(`frames dropped: ${gpu[5]} of ${PACED} paced`);
  if (disturb.size) why.push('disturbed by ' + [...disturb].join('; '));
  log(`${label}\t${t0.toISOString().slice(11, 19)}Z\texit ${code}\t${gpu ? `avg ${gpu[1]} p99 ${gpu[3]} worst ${gpu[4]} (${gpu[5]} frames)` : '-'}\t${why.length ? 'VOID: ' + why.join(', ') : 'clean'}`);
  return why.length === 0;
}

(async () => {
  log(`exe ${exeBefore}`);
  log(`clone ${head.slice(0, 8)}; exe ${EXE}; args ${ARGS.join(' ')}; token ${myToken ? 'present' : 'ABSENT'}`);
  if (!myToken) { log('STOP: not inside heavy-run'); process.exit(2); }
  log(`session from run ${START} of ${ORDER.length}`);
  BASE = cardUsers().filter((n) => n !== 'dz-world.exe');
  fs.appendFileSync(PRIV, `${new Date().toISOString()} the session's first list: ${BASE.join(' ')}\n`);
  log(`the card's first list: ${BASE.length} processes (names in card-users.log, private); a run whose list gains one is void`);
  for (let k = START - 1; k < ORDER.length; k++) {
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) ok = await runOnce(ORDER[k], k + 1, attempt);
    if (!ok) log(`${ORDER[k]} run ${k + 1}: void three times; left void`);
  }
  const exeAfter = exeStat();
  log(`exe before: ${exeBefore}; after: ${exeAfter}: ${exeAfter === exeBefore ? 'unchanged' : 'CHANGED, the bench is VOID'}`);
  const after = state();
  log(`clone state after: ${after === before ? 'unchanged' : 'CHANGED'}`);
  if (after !== before) fs.writeFileSync(path.join(O, 'clone-state-after.txt'), after + '\n');
  log('done');
})();
