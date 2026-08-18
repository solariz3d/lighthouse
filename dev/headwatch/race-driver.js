/* race-driver.js — tries to make TWO watchers acquire the same lock at once.
 *
 * Scenario under attack: the STALE-TAKEOVER path of acquireLock. The lock holds a
 * dead pid; N processes race. The hypothesized hole (from reading the code, to be
 * confirmed or refuted here):
 *   P1: wx fails -> reads dead pid -> unlink -> wx succeeds (P1 is watcher)
 *   P2: wx fails -> reads dead pid (BEFORE P1's unlink) -> unlink (deletes P1's
 *       FRESH lock) -> wx succeeds (P2 is watcher too)
 * The decision "this lock is stale" is made from a read, and the unlink acts on
 * whatever the file is NOW — check and act are not atomic.
 *
 * A second, wider hole: writeFileSync(wx) is open-then-write; a reader landing
 * between the two sees an EMPTY file, Number('') is NaN -> alive=false -> it
 * reaps a LIVE lock.
 *
 * Usage: node race-driver.js <trials> <contestants>
 * Verdict line at the end: DOUBLE-ACQUIRE observed in K of T trials.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const TRIALS = Number(process.argv[2] || 60);
const N = Number(process.argv[3] || 8);
const DIR = path.join(__dirname, 'race-arena');
fs.mkdirSync(DIR, { recursive: true });
const CONTESTANT = path.join(__dirname, 'contestant.js');

async function getDeadPid() {
  return new Promise((resolve) => {
    const c = spawn(process.execPath, ['-e', 'process.exit(0)'], { stdio: 'ignore' });
    const pid = c.pid;
    c.on('exit', () => {
      // confirm dead before use
      try { process.kill(pid, 0); resolve(null); } catch (_) { resolve(pid); }
    });
  });
}

function runTrial(trial, stalePid) {
  return new Promise((resolve) => {
    const lock = path.join(DIR, `t${trial}.lock`);
    const go = path.join(DIR, `t${trial}.go`);
    try { fs.unlinkSync(lock); } catch (_) {}
    try { fs.unlinkSync(go); } catch (_) {}
    fs.writeFileSync(lock, String(stalePid)); // the stale lock

    const kids = [];
    const out = [];
    let done = 0;
    for (let i = 0; i < N; i++) {
      const k = spawn(process.execPath, [CONTESTANT, lock, go], { stdio: ['ignore', 'pipe', 'inherit'] });
      let buf = '';
      k.stdout.on('data', (d) => { buf += d; });
      k.on('exit', () => {
        out.push(buf.trim());
        if (++done === N) {
          try { fs.unlinkSync(go); } catch (_) {}
          resolve(out.filter(Boolean));
        }
      });
      kids.push(k);
    }
    // give all contestants time to reach the spin-wait, then fire the gun
    setTimeout(() => { fs.writeFileSync(go, '1'); }, 350);
    // safety: kill stragglers after 5s
    setTimeout(() => { for (const k of kids) { try { k.kill(); } catch (_) {} } }, 5000);
  });
}

(async () => {
  let doubles = 0;
  const examples = [];
  for (let t = 0; t < TRIALS; t++) {
    let stale = null;
    while (stale === null) stale = await getDeadPid();
    const lines = await runTrial(t, stale);
    const acq = lines.filter((l) => l.startsWith('ACQUIRED'));
    if (acq.length > 1) {
      doubles++;
      if (examples.length < 5) examples.push(`trial ${t}: ${acq.join(' | ')}`);
    }
    if ((t + 1) % 10 === 0) process.stderr.write(`  ...${t + 1}/${TRIALS} trials, doubles so far: ${doubles}\n`);
  }
  console.log(`VERDICT: DOUBLE-ACQUIRE in ${doubles} of ${TRIALS} trials (${N} contestants each, stale-lock start)`);
  for (const e of examples) console.log('  ' + e);
  process.exit(0);
})();
