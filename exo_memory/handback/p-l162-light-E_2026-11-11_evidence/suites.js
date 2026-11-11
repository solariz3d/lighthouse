// suites.js <worktree> <tag>: pane E, L162. Under the heavy-run lock, BelowNormal: every test exe in build/bin, one at a time,
// each to <scratch>/l162/<tag>-<suite>.log, and a summary line per suite. No timing run (these are the repo's suites).
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const W = process.argv[2], TAG = process.argv[3];
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `pane E L162: ${TAG} all ten test suites, one at a time (no timing)` });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const bin = path.join(W, 'build', 'bin');
for (const exe of fs.readdirSync(bin).filter((f) => /_tests\.exe$/.test(f)).sort()) {
  const t0 = Date.now(); const r = cp.spawnSync(path.join(bin, exe), [], { cwd: W, encoding: 'utf8', maxBuffer: 256 << 20 });
  const log = `${r.stdout || ''}${r.stderr || ''}`; fs.writeFileSync(path.join(__dirname, `${TAG}-${exe.replace('.exe', '')}.log`), log);
  const tail = log.trim().split('\n').slice(-2).join(' | ');
  console.log(`${exe}: exit ${r.status} (${Math.round((Date.now() - t0) / 1000)} s) ${tail.slice(0, 220)}`);
}
