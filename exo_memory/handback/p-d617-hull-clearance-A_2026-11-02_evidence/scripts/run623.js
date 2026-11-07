// run623.js <repo> <outdir> <test file>...: takes a heavy-run slot (CONSONANCE_HEAVY_SLOTS=1 set by the caller), then runs each test file alone to its own TAP,
// hidden, BelowNormal, concurrency 1. Before each file: acs.exe up -> wait. While a file runs: free memory under 8 GB -> kill its process tree, log what ran, exit 3.
'use strict';
require('./winhide.js');
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const [, , REPO, OUT, ...FILES] = process.argv;
const FLOOR = 8 * 1024 ** 3;
process.chdir(REPO);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `A D617 ${FILES.length} test file(s) (t180 d617-a), hidden, BelowNormal; not a timing session` });
try { cp.execFileSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${process.pid}).PriorityClass = 'BelowNormal'`], { windowsHide: true }); } catch {}
const gb = (b) => (b / 1024 ** 3).toFixed(1);
const acs = () => /acs\.exe/i.test(cp.execFileSync('tasklist', ['/FI', 'IMAGENAME eq acs.exe', '/NH'], { encoding: 'utf8', windowsHide: true }));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  for (const f of FILES) {
    while (acs()) { console.log(`${new Date().toISOString()} acs.exe is up: waiting before ${f}`); await sleep(60000); }
    if (os.freemem() < FLOOR) { console.log(`${new Date().toISOString()} STOP before ${f}: free ${gb(os.freemem())} GB`); process.exit(3); }
    const tap = path.join(OUT, path.basename(f).replace(/\.test\.js$/, '.tap')), t0 = Date.now();
    let low = 0, stopped = false;
    const code = await new Promise((res) => {
      const ch = cp.spawn(process.execPath, ['--test', '--test-reporter=tap', `--test-reporter-destination=${tap}`, '--test-concurrency=1', f], { cwd: REPO, windowsHide: true, stdio: 'ignore' });
      const iv = setInterval(() => { const m = os.freemem(); low = low ? Math.min(low, m) : m; if (m < FLOOR) { stopped = true; clearInterval(iv); console.log(`${new Date().toISOString()} STOP during ${f}: free ${gb(m)} GB; killing its tree`); try { cp.execFileSync('taskkill', ['/PID', String(ch.pid), '/T', '/F'], { windowsHide: true }); } catch {} } }, 5000);
      ch.on('exit', (c) => { clearInterval(iv); res(c); });
    });
    const t = fs.existsSync(tap) ? fs.readFileSync(tap, 'utf8') : '', n = (k) => { const m = new RegExp(`^# ${k} ([0-9]+)`, 'm').exec(t); return m ? +m[1] : NaN; };
    console.log(`${new Date().toISOString()} ${f}: exit ${code}, tests ${n('tests')}, pass ${n('pass')}, fail ${n('fail')}, todo ${n('todo')}, ${((Date.now() - t0) / 1000).toFixed(0)} s, lowest free ${gb(low || os.freemem())} GB`);
    if (stopped || os.freemem() < FLOOR) process.exit(3);
  }
})();
