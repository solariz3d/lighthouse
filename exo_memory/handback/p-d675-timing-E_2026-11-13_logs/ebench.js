// ebench.js (D675, pane E): a frame-time session, base against branch, after pane P's bench.js (its watch, void and pace
// rules unchanged). Run INSIDE the exclusive hold:
//   node consonance/tools/heavy-run.js --run --exclusive --cmd "E ... TIMING SESSION" -- node ebench.js <session.json>
// session.json: { "name", "out": dir, "arms": { "base": {"tree", "commit"}, "branch": {"tree", "commit"} }, "config": dir of
//   the base's game/config, "pre": [optional {label, exe, args, cwd, env}] run first (R4.7), "rounds": 3 }
// Each arm's exe must carry its own commit as its build stamp (game/world/build_commit.cmake), and stay unchanged across the
// session. Both arms read ONE config copy (base's game/config plus world.local.txt `flashlight = 1`, as P's arms did).
// Order: base, branch, three rounds, then base again. A run during which a watched process or another seat's lock or
// hold appears, or that drew fewer frames than it paced, is VOID by name and re-run (up to 3 tries).
// The card's other users are recorded at the session's START and END: nvidia-smi (utilisation, processes) and the
// tasklist entries of anything that could be a game. A session with a game of his on the card voids itself.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawn, execFileSync } = require('child_process');
const S = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const O = S.out, DATA = 'C:/Consonance/data';
fs.mkdirSync(O, { recursive: true });
const LOG = path.join(O, 'bench.log');
const log = (s) => { const l = `${new Date().toISOString().slice(11, 23)}Z ${s}`; fs.appendFileSync(LOG, l + '\n'); console.log(l); };
os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
const ARGS = ['--bench', '30', '--chasers', '--seed', '1', '--size', '2560', '1440'];
const PACED = 30 * 360 + 1;
const sh = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', windowsHide: true });
const exeOf = (arm) => path.win32.join(S.arms[arm].tree, 'build', 'bin', 'dz-world.exe');
const stampOf = (arm) => (fs.readFileSync(path.join(S.arms[arm].tree, 'build', 'game', 'generated', 'build_commit.h'), 'utf8').match(/DZ_BUILD_COMMIT "([^"]*)"/) || [])[1];
const exeStat = (arm) => { const s = fs.statSync(exeOf(arm)); return `${s.size} bytes, mtime ${s.mtime.toISOString()}`; };

// The card's users, and anything that could be a game of his.
const GAME = /^(league of legends|leagueclient|valorant|riotclientservices|riotclientcrashhandler|acs|assettocorsa|content manager|steam|steamwebhelper|epicgameslauncher|dreamzone|dz-world)/i;
function card(label) {
  let smi = '', apps = '';
  try { smi = sh('nvidia-smi', ['--query-gpu=utilization.gpu,memory.used', '--format=csv,noheader']).trim(); } catch (e) { smi = 'nvidia-smi failed: ' + e.message; }
  try { apps = sh('nvidia-smi', []).split(/\r?\n/).filter((l) => /^\|\s+\d+\s/.test(l)).map((l) => l.replace(/\s+/g, ' ').trim()).join(' / '); } catch (e) { apps = 'failed'; }
  const tl = sh('tasklist', ['/fo', 'csv', '/nh']).split(/\r?\n/).map((l) => l.split('","')).filter((p) => p.length > 1)
    .map((p) => ({ name: p[0].replace(/^"/, ''), pid: Number(p[1]) })).filter((p) => GAME.test(p.name)).map((p) => `${p.name} ${p.pid}`);
  const games = gamesRunning();
  log(`CARD ${label}: utilisation, memory: ${smi}; processes on the card: ${apps || 'none listed'}; launchers and game-like names: ${tl.join(', ') || 'none'}; GAMES (by path): ${games.join(', ') || 'none'}`);
  return games;
}
// A game is a process running from a game's own install folder (a launcher such as Steam's client, its web helpers and
// service, or Riot's background service and crash handler, is not a game), or his dz-world from his play build.
function gamesRunning() {
  try {
    return sh('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'games.ps1')]).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } catch (e) {
    return ['the game check failed: ' + e.message];
  }
}

const WATCH = /^(acs|t180-track-builder|dz-world|dz-gym|dz-view|dz-chase|dz-sim|dz-gen|blender|cmake|ninja|cl|link|lib|ctest|msbuild|.*_tests|league of legends|valorant.*)\.exe$/i;
const procs = () => sh('tasklist', ['/fo', 'csv', '/nh']).split(/\r?\n/).map((l) => l.split('","')).filter((p) => p.length > 1)
  .map((p) => ({ name: p[0].replace(/^"/, ''), pid: Number(p[1]) }));
const myToken = process.env.CONSONANCE_HEAVY_RUN_TOKEN || '';
const otherLocks = () => fs.readdirSync(DATA).filter((f) => /^heavy-run((\.\d+)?\.lock|\.hold)$/.test(f)).map((f) => {
  try { const j = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); return j.token === myToken ? null : `${f}: ${j.cmd}`; } catch (_) { return `${f}: unreadable`; }
}).filter(Boolean);
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function waitQuiet(label) {
  for (let n = 0; ; n++) {
    const busy = procs().filter((p) => WATCH.test(p.name)).map((p) => `${p.name} ${p.pid}`);
    if (!busy.length) return;
    if (n % 15 === 0) log(`WAIT before ${label}: running ${busy.join(', ')}; never closed`);
    sleep(2000);
  }
}
function watched(child, label, out) {
  const disturb = new Set();
  const timer = setInterval(() => {
    try {
      for (const p of procs()) if (WATCH.test(p.name) && p.pid !== child.pid) disturb.add(`${p.name} ${p.pid}`);
      for (const l of otherLocks()) disturb.add(l);
    } catch (e) { disturb.add('watch failed: ' + e.message); }
  }, 2000);
  return new Promise((ok) => child.on('exit', (c) => { clearInterval(timer); ok({ code: c, disturb }); }));
}

async function runPre(p) {
  const label = p.label;
  waitQuiet(label);
  const out = path.join(O, `pre_${label}.txt`), fd = fs.openSync(out, 'w');
  const child = spawn(p.exe, p.args || [], { cwd: p.cwd, env: Object.assign({}, process.env, p.env || {}), windowsHide: true, stdio: ['ignore', fd, fd] });
  const { code, disturb } = await watched(child, label, out);
  fs.closeSync(fd);
  const lines = fs.readFileSync(out, 'utf8').split(/\r?\n/).filter((l) => new RegExp(p.grep || '.').test(l));
  log(`${label}\texit ${code}\t${disturb.size ? 'VOID: disturbed by ' + [...disturb].join('; ') : 'clean'}\n    ${lines.join('\n    ')}`);
  return code === 0 && disturb.size === 0;
}

async function runOnce(arm, k, attempt) {
  const label = `${String(k).padStart(2, '0')}-${arm}${attempt > 1 ? '-try' + attempt : ''}`;
  waitQuiet(label);
  const g0 = gamesRunning();
  if (g0.length) { log(`${label}\tVOID before it ran: a game is running: ${g0.join('; ')}`); sleep(30000); return false; }
  const out = path.join(O, `bench_${label}.txt`), fd = fs.openSync(out, 'w');
  const t0 = new Date();
  const child = spawn(exeOf(arm), [...ARGS, '--config', S.config], { cwd: path.join(S.arms[arm].tree, 'build', 'bin'), windowsHide: true, stdio: ['ignore', fd, fd] });
  const { code, disturb } = await watched(child, label, out);
  fs.closeSync(fd);
  const text = fs.readFileSync(out, 'utf8');
  const gpu = text.match(/GPU frame \(timestamps, first pass to last\): avg ([\d.]+) ms, p50 ([\d.]+), p99 ([\d.]+), worst ([\d.]+) \((\d+) frames\)/);
  const why = [];
  if (code !== 0) why.push(`exit ${code}`);
  if (!gpu) why.push('no GPU frame line');
  else if (Number(gpu[5]) < PACED) why.push(`frames dropped: ${gpu[5]} of ${PACED} paced`);
  if (disturb.size) why.push('disturbed by ' + [...disturb].join('; '));
  const g1 = gamesRunning();
  if (g1.length) why.push('a game was running at its end: ' + g1.join('; '));
  log(`${label}\t${t0.toISOString().slice(11, 19)}Z\texit ${code}\t${gpu ? `avg ${gpu[1]} p50 ${gpu[2]} p99 ${gpu[3]} worst ${gpu[4]} (${gpu[5]} frames)` : '-'}\t${why.length ? 'VOID: ' + why.join(', ') : 'clean'}`);
  return why.length === 0;
}

(async () => {
  if (!myToken) { log('STOP: not inside heavy-run'); process.exit(2); }
  for (const arm of Object.keys(S.arms)) {
    const st = stampOf(arm);
    if (st !== S.arms[arm].commit) { log(`STOP: ${arm}'s exe is stamped ${st}, not ${S.arms[arm].commit}`); process.exit(2); }
  }
  const exeBefore = Object.fromEntries(Object.keys(S.arms).map((a) => [a, exeStat(a)]));
  log(`session ${S.name}; args ${ARGS.join(' ')}; config ${S.config}; ${Object.entries(S.arms).map(([a, v]) => `${a} ${v.commit} (${exeBefore[a]})`).join('; ')}`);
  const gamesAtStart = card('START');
  if (gamesAtStart.length) { log('VOID: a game is on the machine at the start; not run'); process.exit(4); }
  for (const p of S.pre || []) {
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) ok = await runPre(Object.assign({}, p, { label: p.label + (attempt > 1 ? '-try' + attempt : '') }));
  }
  const ORDER = [];
  for (let r = 1; r <= (S.rounds || 3); r++) ORDER.push('base', 'branch');
  ORDER.push('base');
  for (let k = 0; k < ORDER.length; k++) {
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) ok = await runOnce(ORDER[k], k + 1, attempt);
    if (!ok) log(`${ORDER[k]} run ${k + 1}: void three times; left void`);
  }
  const gamesAtEnd = card('END');
  for (const a of Object.keys(S.arms)) {
    const after = exeStat(a);
    log(`${a} exe before: ${exeBefore[a]}; after: ${after}: ${after === exeBefore[a] ? 'unchanged' : 'CHANGED, the session is VOID'}`);
  }
  log(gamesAtEnd.length ? 'VOID: a game was on the machine at the end' : 'done');
})();
