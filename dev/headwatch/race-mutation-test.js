/* race-mutation-test.js — the ACCEPTANCE TEST for the lock fix, at the concurrency level.
 *
 * The chair's standard: "a mutation your HARNESS catches rather than one a unit test catches."
 * Single-process unit tests (head-watch.test.js) all passed on the BROKEN lock too; the defect
 * only shows under real concurrency. So this test:
 *   1. runs race-driver against the REAL, fixed head-watch.js         -> expects 0 double-acquire
 *   2. writes a MUTANT: takeover reverted to the old non-atomic unlink -> expects doubles > 0
 * If (1) is clean and (2) is red, the harness demonstrably catches the exact class of defect,
 * and the fix demonstrably closes it. If (1) is NOT clean, the fix is not proven and says so.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const REAL = 'C:/Consonance/lighthouse/consonance/tools/head-watch.js';
const DRIVER = path.join(HERE, 'race-driver.js');
const TRIALS = process.argv[2] || '40';
const CONTESTANTS = process.argv[3] || '8';

function runHarness(modulePath, label) {
  // race-driver hardcodes the real module path via require; to test a mutant we point it at a
  // copy through an env override the driver reads. (contestant.js reads HEADWATCH_MODULE.)
  const out = execFileSync(process.execPath, [DRIVER, TRIALS, CONTESTANTS], {
    env: { ...process.env, HEADWATCH_MODULE: modulePath },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const line = out.split('\n').find((l) => l.startsWith('VERDICT:')) || out.trim();
  const m = line.match(/DOUBLE-ACQUIRE in (\d+) of (\d+)/);
  const doubles = m ? Number(m[1]) : NaN;
  console.log(`[${label}] ${line.trim()}`);
  return doubles;
}

// Build the mutant: revert the atomic rename-aside takeover to the old non-atomic unlink+retry.
function writeMutant() {
  let src = fs.readFileSync(REAL, 'utf8');
  // Replace the whole acquireLock body with the KNOWN-BROKEN original shape.
  const brokenFn = `function acquireLock(lockPath) {
  const mine = String(process.pid);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      fs.writeFileSync(lockPath, mine, { flag: 'wx' });
      return makeRelease(lockPath, mine);
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      let held = '';
      try { held = fs.readFileSync(lockPath, 'utf8').trim(); } catch (_) {}
      const pid = Number(held);
      let alive = false;
      if (Number.isInteger(pid) && pid > 0) {
        try { process.kill(pid, 0); alive = true; } catch (err) { alive = (err.code === 'EPERM'); }
      }
      if (alive) return null;
      try { fs.unlinkSync(lockPath); } catch (_) {}
    }
  }
  return null;
}`;
  // Excise the real acquireLock (from its declaration to the line before module.exports) and
  // splice the broken one in, keeping makeRelease (the mutant reuses it).
  const start = src.indexOf('function acquireLock(lockPath) {');
  const end = src.indexOf('\nmodule.exports');
  if (start < 0 || end < 0 || end < start) throw new Error('cannot locate acquireLock to mutate');
  const mutant = src.slice(0, start) + brokenFn + '\n' + src.slice(end + 1);
  const mpath = path.join(HERE, 'head-watch.MUTANT.js');
  fs.writeFileSync(mpath, mutant);
  return mpath;
}

(function main() {
  console.log(`\n=== LOCK ACCEPTANCE TEST (${TRIALS} trials x ${CONTESTANTS} contestants) ===`);
  const realDoubles = runHarness(REAL, 'FIXED ');
  const mpath = writeMutant();
  const mutDoubles = runHarness(mpath, 'MUTANT');
  try { fs.unlinkSync(mpath); } catch (_) {}

  console.log('\n--- verdict ---');
  const fixedClean = realDoubles === 0;
  const mutantCaught = mutDoubles > 0;
  console.log(`fixed lock double-acquires:  ${realDoubles}   ${fixedClean ? 'PASS (no double-acquire)' : 'FAIL'}`);
  console.log(`mutant double-acquires:      ${mutDoubles}   ${mutantCaught ? 'PASS (harness catches the defect)' : 'FAIL (harness blind!)'}`);
  const ok = fixedClean && mutantCaught;
  console.log(`\nACCEPTANCE: ${ok ? 'PASS — fix closes the race AND the harness proves it' : 'FAIL'}`);
  process.exit(ok ? 0 : 1);
})();
