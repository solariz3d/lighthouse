// waitquiet.js: wait, WITHOUT holding any lock, until the machine has been quiet (judge's non-lock reasons empty) for 3 probes of 12 s in a row, then run session407.js (which takes both slots itself).
const Q = require('./quiet.js'), { spawn } = require('child_process'); const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  let ok = 0, n = 0;
  for (;;) {
    const a = Q.snap(); await sleep(12000); const b = Q.snap(), j = Q.judge(a, b);
    const other = j.reasons.filter((r) => !/^locks at |lock holder changed/.test(r)); n++;
    if (other.length === 0) ok++; else { ok = 0; if (n % 5 === 1) console.log(new Date().toISOString(), 'busy:', other[0].slice(0, 140)); }
    if (ok >= 3) break; await sleep(8000);
  }
  console.log(new Date().toISOString(), 'machine quiet for 3 probes; starting the session');
  const c = spawn(process.execPath, [require('path').join(__dirname, 'session407.js'), process.argv[2] || 'all'], { stdio: 'inherit' }); c.on('exit', (code) => process.exit(code));
})();
