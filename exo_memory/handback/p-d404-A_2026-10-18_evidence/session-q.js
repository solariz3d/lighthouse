// session-q.js: D404's timing session with a proof of quiet for every window (see quiet.js). This process IS the timing run and the heavy-run lock's holder for its tree;
// its child second.js holds the other slot for as long as this process lives. Every case: snapshot (locks, processes) before and after; the case counts only if the window was quiet,
// else it is run again (up to 3 attempts, 20 s apart); the rejected windows are kept in the case's JSON with their reasons.
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const REPO = 'C:/Users/nname/Downloads/t180-wt-a25'; process.chdir(REPO);
const hr = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const Q = require('./quiet.js'), M = require('./measure.js');
const OUT = path.join(__dirname, 'out-q'); fs.mkdirSync(OUT, { recursive: true });
const TREES = { v047: 'C:/Users/nname/Downloads/t180-wt-a24', d404: 'C:/Users/nname/Downloads/t180-wt-a25', d399fix: 'C:/Users/nname/Downloads/t180-wt-a28' };
const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const sec = spawn(process.execPath, [path.join(__dirname, 'second.js')], { stdio: ['ignore', 'pipe', 'inherit'], cwd: require('os').tmpdir() });
  await new Promise((r) => { sec.stdout.on('data', (d) => { if (/HELD/.test(String(d))) r(); }); });
  hr.hold({ cmd: 't180 A D404 timing session' });
  const started = new Date().toISOString(); console.log('both slots held', started, 'my pid', process.pid, 'second slot pid', sec.pid);
  const sys = { started, pid: process.pid, secondPid: sec.pid, standingAtStart: Q.standing(), locksAtStart: Q.locks() };
  try { sys.display = require('child_process').execSync('powershell -NoProfile -Command "Get-CimInstance Win32_VideoController | ForEach-Object { $_.Name + \' @ \' + $_.CurrentRefreshRate + \' Hz\' }"').toString().trim(); } catch (e) {}
  fs.writeFileSync(path.join(OUT, '_system.json'), JSON.stringify(sys, null, 1));
  let invalid = 0, total = 0;
  const run = async (id, o) => {
    if (fs.existsSync(path.join(OUT, id + '.json')) && !process.env.REDO) return;
    const attempts = []; let r = null; total++;
    for (let k = 0; k < 3; k++) {
      const a = Q.snap(); let cur;
      try { cur = await M.run({ ms: 4000, ...o }); } catch (e) { cur = { error: String(e.message || e).slice(0, 300) }; }
      const b = Q.snap(), j = Q.judge(a, b); attempts.push(j);
      if (j.quiet && !cur.error) { r = cur; break; }
      if (!j.quiet) console.log('  not quiet:', id, j.reasons.slice(0, 2).join(' ; ').slice(0, 220)); else console.log('  error:', id, cur.error);
      await sleep(20000);
    }
    if (!r) { invalid++; r = { error: 'NO QUIET WINDOW in 3 attempts', invalid: true }; }
    r.id = id; r.at = new Date().toISOString(); r.attempts = attempts.map((j) => ({ quiet: j.quiet, windowMs: j.windowMs, foreignCpu: j.foreignCpu, reasons: j.reasons })); r.quietWindow = attempts[attempts.length - 1];
    delete r.profile; fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(r));
    console.log(id, r.invalid ? 'INVALID' : `p50/p95 ${r.work ? r.work.script.median + '/' + r.work.script.p95 : '-'} ms`, `quiet after ${attempts.length} attempt(s), foreign cpu ${attempts[attempts.length - 1].foreignCpu}s`);
  };
  const group = process.argv[2] || 'all';
  if (group === 'all' || group === 'looks') {
    for (const rep of [1, 2, 3]) for (const look of LOOKS) for (const [tag, repo] of Object.entries(TREES)) {
      const cases = tag === 'd399fix' ? [['turn', 1000], ['turn', 2000]] : [['turn', 1000], ['turn', 2000], ['stretch', 1000], ['stretch', 2000]];
      for (const [kind, L] of cases) await run(`${tag}-${look}-${kind}-${L}-r${rep}`, { repo, look, kind, length: L });
    }
  }
  if (group === 'all' || group === 'ladder') for (const tag of ['v047', 'd404']) for (const L of [100, 500, 1000, 2000, 5000, 10000, 20000]) for (const kind of ['turn', 'stretch']) await run(`ladder-${tag}-${kind}-${L}`, { repo: TREES[tag], look: 'aqua', kind, length: L, ms: L >= 10000 ? 8000 : 5000 });
  if (group === 'all' || group === 'noblur') for (const look of LOOKS) for (const L of [1000, 2000]) await run(`noblur-d404-${look}-turn-${L}`, { repo: TREES.d404, look, kind: 'turn', length: L, noblur: true });
  if (group === 'all' || group === 'trace') {
    for (const [tag, L] of [['v047', 1000], ['d404', 1000], ['d404', 2000], ['d399fix', 2000]]) for (const noblur of [false, true]) await run(`trace-${tag}-aurora-turn-${L}-${noblur ? 'noblur' : 'blur'}`, { repo: TREES[tag], look: 'aurora', kind: 'turn', length: L, trace: true, capped: true, noblur });
  }
  if (group === 'trace2') for (const rep of [1, 2, 3, 4]) for (const tag of ['d404', 'd399fix']) for (const look of ['aurora', 'glass']) await run(`trace2-${tag}-${look}-turn-2000-r${rep}`, { repo: TREES[tag], look, kind: 'turn', length: 2000, trace: true, capped: true });
  const end = { ended: new Date().toISOString(), cases: total, invalidCases: invalid, standingAtEnd: Q.standing(), locksAtEnd: Q.locks() };
  fs.writeFileSync(path.join(OUT, '_end.json'), JSON.stringify(end, null, 1)); console.log('session done', JSON.stringify({ cases: total, invalid }));
  sec.kill(); process.exit(0);
})().catch((e) => { console.log('SESSION FAILED', e.stack || e); process.exit(1); });
