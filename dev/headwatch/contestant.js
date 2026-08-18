/* contestant.js — one racer. Spin-waits for the GO file so all contestants hit
 * acquireLock within ~1ms of each other, then reports ACQUIRED or REFUSED.
 * An acquirer holds the lock 400ms before releasing, so overlapping acquisitions
 * are provably concurrent, then exits. */
'use strict';
const fs = require('fs');
const MODULE = process.env.HEADWATCH_MODULE || 'C:/Consonance/lighthouse/consonance/tools/head-watch.js';
const { acquireLock } = require(MODULE);

const lockPath = process.argv[2];
const goPath = process.argv[3];

// spin until GO appears (tight loop, sub-ms resolution)
while (!fs.existsSync(goPath)) { /* spin */ }

const release = acquireLock(lockPath);
if (release) {
  // Report what the lock file ACTUALLY contains right after our acquisition —
  // if it isn't our pid, another process overwrote or reaped it: torn state.
  let now = '';
  try { now = fs.readFileSync(lockPath, 'utf8').trim(); } catch (_) { now = '<gone>'; }
  console.log(`ACQUIRED pid=${process.pid} lockNow=${now}`);
  setTimeout(() => { release(); process.exit(0); }, 400);
} else {
  console.log(`REFUSED pid=${process.pid}`);
  process.exit(0);
}
