// abab.js: D407's timing of record. ONE session, v0.4.8 (a30, b306309) and the branch (a29, d407-a) ALTERNATING case by case (A then B for every case), muted (pagelib passes --mute-audio),
// both heavy-run slots held by this process and its child for the whole session, every window proved quiet (quiet.js: the keeper's desktop, explorer.exe's descendants, counts as host;
// a window that is not quiet is run again, up to 12 times, 20 s apart). Output: out-abab/<case>-<tree>.json, and _system/_end.
const path = require('path'), fs = require('fs'), { spawn, execSync } = require('child_process');
const TREES = { A: 'C:/Users/nname/Downloads/t180-wt-a30', B: 'C:/Users/nname/Downloads/t180-wt-a29' };
process.chdir(TREES.B);
const hr = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const Q = require('./quiet.js'), M = require('./measure.js'), O = require('./ord407.js');
const OUT = path.join(__dirname, 'out-abab'); fs.mkdirSync(OUT, { recursive: true });
const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  hr.hold({ cmd: 't180 A D407 timing session (ABAB)' });   // this slot first: a session waiting for the lock holds nothing meanwhile
  const sec = spawn(process.execPath, [path.join(__dirname, 'second.js')], { stdio: ['pipe', 'pipe', 'inherit'], cwd: require('os').tmpdir(), detached: true, windowsHide: true, env: (() => { const e = { ...process.env }; delete e.CONSONANCE_HEAVY_RUN_TOKEN; return e; })() });   // NOT this run's token: a child carrying it is the same run to heavy-run.js (its NESTED RUNS rule) and would take no slot
  await new Promise((r) => { sec.stdout.on('data', (d) => { if (/HELD/.test(String(d))) r(); }); });
  { const L = Q.locks(); if (!(L.length === 2 && L.every((l) => l.mine && l.alive))) throw new Error('both slots are not this session: ' + JSON.stringify(L)); }   // proved, not assumed
  const started = new Date().toISOString(); console.log('both slots held', started, 'pid', process.pid, 'second', sec.pid);
  // the chair's order (18:59Z): both slots first, then a 40 s quiet check INSIDE the hold, so no seat slips into a gap; repeated until one 40 s window is quiet (up to 10 min)
  for (let k = 0; k < 15; k++) { const a0 = Q.snap(); await sleep(40000); const j = Q.judge(a0, Q.snap()); console.log('pre-check', k + 1, j.quiet ? 'quiet' : 'not quiet: ' + j.reasons.slice(0, 2).join(' ; ').slice(0, 200), 'foreign cpu', j.foreignCpu, 'host cpu', j.hostCpu); if (j.quiet) break; }
  const sys = { started, pid: process.pid, secondPid: sec.pid, trees: Object.fromEntries(Object.entries(TREES).map(([k, t]) => [k, { path: t, head: execSync('git rev-parse --short HEAD', { cwd: t }).toString().trim(), dirty: execSync('git status --short', { cwd: t }).toString().trim().split('\n').filter(Boolean).length }])), standingAtStart: Q.standing(), locksAtStart: Q.locks() };
  try { sys.display = execSync('powershell -NoProfile -Command "Get-CimInstance Win32_VideoController | ForEach-Object { $_.Name + \' @ \' + $_.CurrentRefreshRate + \' Hz\' }"').toString().trim(); } catch (e) {}
  fs.writeFileSync(path.join(OUT, '_system.json'), JSON.stringify(sys, null, 1)); console.log(JSON.stringify(sys.trees));
  let invalid = 0, total = 0;
  const run = async (id, fn) => {
    if (fs.existsSync(path.join(OUT, id + '.json')) && !process.env.REDO) return;
    const attempts = []; let r = null; total++;
    for (let k = 0; k < 12; k++) {
      const a = Q.snap(); let cur;
      try { cur = await fn(); } catch (e) { cur = { error: String(e.message || e).slice(0, 300) }; }
      const b = Q.snap(), j = Q.judge(a, b); attempts.push(j);
      if (j.quiet && !cur.error) { r = cur; break; }
      console.log('  ', j.quiet ? 'error' : 'not quiet', id, (j.quiet ? cur.error : j.reasons.slice(0, 2).join(' ; ')).slice(0, 200));
      await sleep(20000);
    }
    if (!r) { invalid++; r = { error: 'NO QUIET WINDOW in 12 attempts', invalid: true }; }
    r.id = id; r.at = new Date().toISOString(); r.attempts = attempts.map((j) => ({ quiet: j.quiet, windowMs: j.windowMs, foreignCpu: j.foreignCpu, hostCpu: j.hostCpu, reasons: j.reasons })); r.quietWindow = attempts[attempts.length - 1];
    delete r.releaseProf; delete r.profile; fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(r));
    const say = r.invalid ? 'INVALID' : r.orbit ? `orbit ${r.orbit.frame.p95} | edit ${r.edit.total.p95} | place ${r.place.total.p95} (handler ${r.place.handler.p95})` : `drag p95 ${r.work ? r.work.script.p95 : '-'} | release ${r.release ? Math.max(r.release.upMs || 0, r.release.maxScript).toFixed(1) : '-'}`;
    console.log(id, say, `| ${attempts.length} attempt(s)`);
  };
  // both trees, case by case: A then B
  const ab = async (id, mk) => { for (const t of ['A', 'B']) await run(`${id}-${t}`, () => mk(TREES[t])); };
  const drag = (o) => (repo) => M.run({ repo, ms: 3000, settle: 1800, ...o });
  for (const L of [1000, 2000]) for (const look of LOOKS) for (const kind of ['turn', 'stretch']) await ab(`drag-${kind}-${L}-${look}`, drag({ look, kind, length: L }));
  for (const look of LOOKS) await ab(`drag-stretch-5000-${look}`, drag({ look, kind: 'stretch', length: 5000, ms: 4000, settle: 2500 }));
  for (const L of [5000, 10000, 20000]) for (const kind of ['turn', 'stretch']) await ab(`drag-${kind}-${L}-aqua-ladder`, drag({ look: 'aqua', kind, length: L, ms: 4000, settle: L >= 10000 ? 6000 : 2500 }));
  for (const L of [1000, 2000]) for (const look of LOOKS) await ab(`ordinary-place${L}-${look}`, (repo) => O.run({ repo, look, build: 12, ms: 2000, places: 8, edits: 30, placeLen: L }));
  const end = { ended: new Date().toISOString(), cases: total, invalidCases: invalid, standingAtEnd: Q.standing(), locksAtEnd: Q.locks() };
  fs.writeFileSync(path.join(OUT, '_end.json'), JSON.stringify(end, null, 1)); console.log('session done', JSON.stringify({ cases: total, invalid }));
  sec.stdin.end(); await new Promise((r) => { sec.on('exit', r); setTimeout(r, 8000); }); process.exit(0);
})().catch((e) => { console.log('SESSION FAILED', e.stack || e); process.exit(1); });
