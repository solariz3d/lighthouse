// session407.js: D407's timing session on v0.4.8 (worktree a29), a proof of quiet for every window (quiet.js). This process IS the timing run and the heavy-run lock's holder;
// its child second.js holds the other slot for as long as this process lives. A case counts only if its window was quiet, else it is run again (up to 12 attempts, 20 s apart).
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const REPO = 'C:/Users/nname/Downloads/t180-wt-a29'; process.chdir(REPO);
const hr = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const Q = require('./quiet.js'), M = require('./measure.js'), O = require('./ord407.js');
const OUT = path.join(__dirname, 'out-407'); fs.mkdirSync(OUT, { recursive: true });
const LOOKS = ['aqua', 'skyline', 'glass', 'aurora', 'sigil'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const sec = spawn(process.execPath, [path.join(__dirname, 'second.js')], { stdio: ['pipe', 'pipe', 'inherit'], cwd: require('os').tmpdir(), detached: true, windowsHide: true });
  await new Promise((r) => { sec.stdout.on('data', (d) => { if (/HELD/.test(String(d))) r(); }); });
  hr.hold({ cmd: 't180 A D407 timing session' });
  const started = new Date().toISOString(); console.log('both slots held', started, 'my pid', process.pid, 'second slot pid', sec.pid);
  const sys = { started, pid: process.pid, secondPid: sec.pid, repo: REPO, head: require('child_process').execSync('git rev-parse --short HEAD', { cwd: REPO }).toString().trim(), standingAtStart: Q.standing(), locksAtStart: Q.locks() };
  try { sys.display = require('child_process').execSync('powershell -NoProfile -Command "Get-CimInstance Win32_VideoController | ForEach-Object { $_.Name + \' @ \' + $_.CurrentRefreshRate + \' Hz\' }"').toString().trim(); } catch (e) {}
  fs.writeFileSync(path.join(OUT, '_system' + (process.argv[2] || '') + '.json'), JSON.stringify(sys, null, 1));
  let invalid = 0, total = 0;
  const run = async (id, fn) => {
    if (fs.existsSync(path.join(OUT, id + '.json')) && !process.env.REDO) return;
    const attempts = []; let r = null; total++;
    for (let k = 0; k < 12; k++) {
      const a = Q.snap(); let cur;
      try { cur = await fn(); } catch (e) { cur = { error: String(e.message || e).slice(0, 300) }; }
      const b = Q.snap(), j = Q.judge(a, b); attempts.push(j);
      if (j.quiet && !cur.error) { r = cur; break; }
      if (!j.quiet) console.log('  not quiet:', id, j.reasons.slice(0, 2).join(' ; ').slice(0, 220)); else console.log('  error:', id, cur.error);
      await sleep(20000);
    }
    if (!r) { invalid++; r = { error: 'NO QUIET WINDOW in 12 attempts', invalid: true }; }
    r.id = id; r.at = new Date().toISOString(); r.attempts = attempts.map((j) => ({ quiet: j.quiet, windowMs: j.windowMs, foreignCpu: j.foreignCpu, reasons: j.reasons })); r.quietWindow = attempts[attempts.length - 1];
    delete r.profile; fs.writeFileSync(path.join(OUT, id + '.json'), JSON.stringify(r));
    console.log(id, r.invalid ? 'INVALID' : r.release ? `drag p95 ${r.work ? r.work.script.p95 : '-'} | release handler ${r.release.upMs && r.release.upMs.toFixed(0)} ms, worst frame script ${r.release.maxScript.toFixed(1)} gap ${r.release.maxGap.toFixed(0)}` : r.orbit ? `orbit p95 ${r.orbit.frame.p95} edit ${r.edit.total.median}/${r.edit.total.p95} place ${r.place.total.median}/${r.place.total.p95}` : '', `quiet after ${attempts.length} attempt(s), foreign cpu ${attempts[attempts.length - 1].foreignCpu}s`);
  };
  const group = process.argv[2] || 'all';
  const drag = (o) => () => M.run({ repo: REPO, ms: 3000, settle: 1800, ...o });
  if (group === 'all' || group === 'release') {
    for (const kind of ['turn', 'stretch']) for (const L of [100, 500, 1000, 2000, 5000, 10000, 20000]) for (const rep of (L >= 5000 ? [1] : [1, 2, 3])) await run(`release-${kind}-${L}-aqua-r${rep}`, drag({ look: 'aqua', kind, length: L, ms: L >= 10000 ? 4000 : 3000, settle: L >= 10000 ? 4500 : 1800 }));
    for (const look of LOOKS.filter((l) => l !== 'aqua')) for (const kind of ['turn', 'stretch']) for (const L of [1000, 2000]) await run(`release-${kind}-${L}-${look}-r1`, drag({ look, kind, length: L }));
  }
  if (group === 'all' || group === 'len5000') for (const look of LOOKS) for (const rep of [1, 2, 3]) await run(`len5000-stretch-${look}-r${rep}`, drag({ look, kind: 'stretch', length: 5000, ms: 5000, settle: 2500 }));
  if (group === 'all' || group === 'ordinary') for (const look of LOOKS) for (const rep of [1, 2, 3]) await run(`ordinary-${look}-r${rep}`, () => O.run({ repo: REPO, look, build: 12, ms: 3000, places: 20, edits: 40 }));
  const end = { ended: new Date().toISOString(), cases: total, invalidCases: invalid, standingAtEnd: Q.standing(), locksAtEnd: Q.locks() };
  fs.writeFileSync(path.join(OUT, '_end' + (process.argv[2] || '') + '.json'), JSON.stringify(end, null, 1)); console.log('session done', JSON.stringify({ cases: total, invalid }));
  sec.stdin.end(); await new Promise((r) => { sec.on('exit', r); setTimeout(r, 8000); }); process.exit(0);
})().catch((e) => { console.log('SESSION FAILED', e.stack || e); process.exit(1); });
