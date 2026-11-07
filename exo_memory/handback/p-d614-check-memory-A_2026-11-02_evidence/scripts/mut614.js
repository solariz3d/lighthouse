// mut614.js <repo> <outdir> <test file>...: takes a heavy-run slot for the repo's tree, checks acs.exe, then runs each given test file alone to its own TAP,
// hidden, BelowNormal; one summary line each
'use strict';
require('./winhide.js');
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [, , REPO, OUT, ...FILES] = process.argv;
process.chdir(REPO);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `A D614 ${FILES.join(' ')} (t180 d614-a), hidden, BelowNormal` });
try { cp.execFileSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${process.pid}).PriorityClass = 'BelowNormal'`]); } catch {}
for (const f of FILES) {
  if (/acs\.exe/i.test(cp.execFileSync('tasklist', ['/FI', 'IMAGENAME eq acs.exe', '/NH'], { encoding: 'utf8' }))) { console.log(`${f}: acs.exe is running, not started`); continue; }
  const tap = path.join(OUT, path.basename(f).replace(/\.test\.js$/, '.tap')), t0 = Date.now();
  const r = cp.spawnSync(process.execPath, ['--test', '--test-reporter=tap', `--test-reporter-destination=${tap}`, '--test-concurrency=1', f], { cwd: REPO, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28, timeout: 3 * 3600 * 1000 });
  const t = fs.existsSync(tap) ? fs.readFileSync(tap, 'utf8') : '', n = (k) => { const m = new RegExp(`^# ${k} (\d+)`, 'm').exec(t); return m ? +m[1] : NaN; };
  console.log(`${new Date().toISOString()} ${f}: exit ${r.status}, tests ${n('tests')}, pass ${n('pass')}, fail ${n('fail')}, ${((Date.now() - t0) / 1000).toFixed(0)} s, ${tap}`);
}
