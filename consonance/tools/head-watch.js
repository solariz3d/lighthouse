/* head-watch.js — the falsifier for the replay diagnosis. Runs BEFORE any rebuild, needs no
 * main.rs change.
 *
 * THE CLAIM UNDER TEST (2026-08-17): the board's silent full re-reads are triggered by the
 * transcript's FIRST 512 BYTES changing at a Main relaunch — the tailer fingerprints exactly
 * that region (HEAD_BYTES, main.rs), a Claude Code transcript opens with harness-rewritable
 * header records (mode / permission-mode / file-history-snapshot), and resume_offset treats a
 * changed head as "different file" and resets to 0. If the head does NOT flip at the next
 * relaunch, the silent resets are coming from the SHRINK arm (len < offset) instead, and the
 * master must not say "header mutation". This tool discriminates the two arms with timestamps.
 *
 * WHAT IT LOGS, as JSONL to stdout and to the ledger file (append-only):
 *   start      — initial len + head at watch start
 *   head-flip  — first-512-bytes hash changed: old/new head, len, byte offset of the first
 *                difference, and both 512-byte regions base64 so WHAT changed is on the record
 *   shrink     — len decreased: old/new len (the other silent reset arm)
 *   gone/back  — the file disappeared / reappeared (rotation looks like gone+back+flip)
 * Ordinary growth (appends) is deliberately not logged — it is the normal case and would bury
 * the signal. Each event names which resume_offset arm WOULD have fired.
 *
 *   node consonance/tools/head-watch.js [transcriptPath]
 *
 * Defaults to Main's transcript. Ledger: CONSONANCE_HEADWATCH_LOG or
 * C:\Consonance\data\head-watch.jsonl. Poll 500ms. Runs until killed; leave it up across a
 * relaunch and read the ledger after.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';
const DEFAULT_TRANSCRIPT = path.join(
  os.homedir(), '.claude', 'projects', 'C--Consonance-instances-main', `${MAIN_SID}.jsonl`);
const LEDGER = process.env.CONSONANCE_HEADWATCH_LOG || 'C:\\Consonance\\data\\head-watch.jsonl';
const HEAD_BYTES = 512; // MUST match main.rs HEAD_BYTES, or this watches a different fingerprint

/* FNV-1a over a buffer — the same hash, constants and width as main.rs fnv1a, verified against
 * a live tailer-offsets.json record (computed 14527506195736961416 == stored) before shipping. */
function fnv1a(buf) {
  let h = 0xcbf29ce484222325n;
  for (const b of buf) {
    h ^= BigInt(b);
    h = (h * 0x00000100000001b3n) & 0xFFFFFFFFFFFFFFFFn;
  }
  return h.toString();
}

function readState(file) {
  let len;
  try { len = fs.statSync(file).size; } catch (_) { return null; } // gone
  let buf = Buffer.alloc(0);
  try {
    const fd = fs.openSync(file, 'r');
    const b = Buffer.alloc(HEAD_BYTES);
    const n = fs.readSync(fd, b, 0, HEAD_BYTES, 0);
    fs.closeSync(fd);
    buf = b.subarray(0, n);
  } catch (_) { /* unreadable head hashes as the empty hash. Internally consistent — this tool
                   only ever compares its own readings to each other. NOTE it is NOT the same
                   value main.rs read_head yields for that case (0); never compare a head logged
                   here against a tailer-offsets.json record for the unreadable case. */ }
  return { len, head: fnv1a(buf), buf };
}

/* Pure: compare two states, return the events between them. Exported for the test. */
function classify(prev, cur) {
  const ev = [];
  if (prev === null && cur !== null) ev.push({ event: 'back', len: cur.len, head: cur.head });
  if (prev !== null && cur === null) ev.push({ event: 'gone' });
  if (prev === null || cur === null) return ev;
  if (cur.head !== prev.head) {
    let firstDiff = -1;
    const n = Math.max(prev.buf.length, cur.buf.length);
    for (let i = 0; i < n; i++) {
      if (prev.buf[i] !== cur.buf[i]) { firstDiff = i; break; }
    }
    ev.push({
      event: 'head-flip', arm: 'resume_offset would reset to 0 (head arm)',
      oldHead: prev.head, newHead: cur.head, len: cur.len, firstDiffByte: firstDiff,
      oldHeadB64: prev.buf.toString('base64'), newHeadB64: cur.buf.toString('base64'),
    });
  }
  if (cur.len < prev.len) {
    ev.push({
      event: 'shrink', arm: 'resume_offset would reset to 0 (shrink arm, if offset > new len)',
      oldLen: prev.len, newLen: cur.len,
    });
  }
  return ev;
}

/* SINGLE INSTANCE, required the moment this became a detached task (2026-08-18).
 *
 * Before that it was started by hand, so "one watcher" was true by accident. Now the scheduler
 * starts one at logon and any hand-start makes two, both appending to the SAME ledger — a
 * head-flip would land twice and the duplicate would read as two events rather than one seen
 * twice. That is worse than no watcher, because the ledger is the evidence.
 *
 * Liveness is decided by process.kill(pid, 0), not by the lock file existing: a watcher killed
 * with its parent (which is exactly how the 2026-08-18 relaunch was missed) leaves the lock
 * behind, and a stale lock that blocks startup forever would turn one miss into permanent
 * silence. Returns the release function, or null if another live watcher holds it.
 *
 * REWRITTEN 2026-08-18 after pane A's race harness broke the first version in 32 of 40 trials
 * (up to seven of eight processes acquiring at once). The original had two holes, both from the
 * same root — check-and-act were not atomic:
 *   1. TAKEOVER RE-RACE. Two processes both read a stale lock, both unlinkSync, then both
 *      wx-create — the second unlink deletes the first's FRESH lock. The retry loop was what
 *      re-raced; "just drop the retry" is wrong the other way, because then a genuinely stale
 *      lock is never reclaimed and one crash becomes permanent silence.
 *   2. EMPTY-FILE WINDOW. writeFileSync(wx) is open-then-write; a reader landing between sees
 *      zero bytes, Number('') is NaN, and the file reads as stale — so a watcher mid-startup
 *      looked reclaimable to a racer.
 *
 * The fix is to make the two non-atomic steps atomic, and to NEVER throw (any unexpected error
 * is "lost the race, refuse", never a crash — an uncaught EPERM here was itself a startup-crash
 * vector that burned the scheduler's finite restart budget):
 *   * PUBLISH by hard-linking a fully-written temp file into place. linkSync is atomic and fails
 *     EEXIST if the target exists, and the published file is never seen empty because it already
 *     holds the pid. (Falls back to wx-create only where hardlinks are unsupported; that path
 *     keeps the tiny empty window, but an empty read is handled as stale-via-atomic-takeover
 *     below, so it still cannot double-acquire — only refuse.)
 *   * TAKE OVER by renaming the stale lock aside. Exactly one racer can rename a given file;
 *     the losers get ENOENT and refuse. Whether the holder is a dead pid, garbage, or an empty
 *     mid-write file, the takeover is the SAME single-winner path, so "treat garbage as
 *     reclaimable" (the liveness rule the tests pin) no longer implies a double-acquire.
 * At most ONE takeover is attempted; there is no unbounded retry to re-race.
 */
function makeRelease(lockPath, mine) {
  return () => { try { if (fs.readFileSync(lockPath, 'utf8').trim() === mine) fs.unlinkSync(lockPath); } catch (_) {} };
}

function acquireLock(lockPath) {
  const mine = String(process.pid);
  const tmp = lockPath + '.tmp.' + mine;   // unique per process; pids are unique among the living
  try { fs.writeFileSync(tmp, mine); } catch (_) { return null; }
  const cleanupTmp = () => { try { fs.unlinkSync(tmp); } catch (_) {} };

  // Atomic exclusive publish. 'won' | 'exists' | 'error' — never throws.
  const publish = () => {
    try { fs.linkSync(tmp, lockPath); return 'won'; }
    catch (e) {
      if (e.code === 'EEXIST') return 'exists';
      if (e.code === 'ENOENT') return 'error';   // tmp vanished — refuse
      // Hardlinks unsupported on this filesystem: fall back to exclusive create. Keeps the tiny
      // empty window, but a concurrent empty read is handled as an atomic takeover, not a
      // double-acquire.
      try { fs.writeFileSync(lockPath, mine, { flag: 'wx' }); return 'won'; }
      catch (e2) { return e2.code === 'EEXIST' ? 'exists' : 'error'; }
    }
  };

  // Attempt 1.
  let r = publish();
  if (r === 'won') { cleanupTmp(); return makeRelease(lockPath, mine); }
  if (r === 'error') { cleanupTmp(); return null; }

  // A lock exists. Is its holder provably alive? Only a live pid blocks us; a dead pid, garbage,
  // empty, or a file that vanishes mid-read are all reclaimable — but reclaimed ATOMICALLY.
  let alive = false;
  try {
    const held = fs.readFileSync(lockPath, 'utf8').trim();
    const pid = Number(held);
    if (held && Number.isInteger(pid) && pid > 0) {
      try { process.kill(pid, 0); alive = true; } catch (err) { alive = (err.code === 'EPERM'); }
    }
  } catch (_) { /* vanished mid-read: someone else is mid-takeover — treat as reclaimable, the
                   rename below will lose ENOENT and we will refuse */ }
  if (alive) { cleanupTmp(); return null; }

  // Reclaim the stale lock. This is the step pane A's harness broke, and the lesson took two
  // tries: the reap must be gated by CREATING a new exclusive name, never by consuming an
  // existing one. renameSync is not a gate here — Node maps it to MoveFileEx with
  // REPLACE_EXISTING, and even to distinct targets two racers both reported success, so both
  // removed the stale lock and both published. mkdirSync IS a gate: CreateDirectory fails
  // EEXIST if the directory exists, reliably, so exactly ONE process becomes the reaper. Only
  // the reaper ever unlinks the stale lock; everyone else either publishes fresh (exclusive via
  // link) or refuses. That makes at most one process capable of clearing lockPath, which is what
  // the double-acquire needed.
  const reapDir = lockPath + '.reaplock';
  let reaper = false;
  try { fs.mkdirSync(reapDir); reaper = true; }
  catch (e) {
    // A reaper that died mid-takeover would orphan reapDir and wedge every future reap into
    // permanent silence. The reap is held for microseconds, so anything older than 30s is an
    // orphan: clear it and take the reaper slot once.
    if (e.code === 'EEXIST') {
      try {
        if (Date.now() - fs.statSync(reapDir).mtimeMs > 30000) {
          fs.rmdirSync(reapDir); fs.mkdirSync(reapDir); reaper = true;
        }
      } catch (_) { /* someone else won the orphan-clear; refuse below */ }
    }
  }
  if (!reaper) { cleanupTmp(); return null; }

  // Sole reaper. Remove the stale lock — but re-check staleness first, so we never delete a lock
  // a fresh publisher created in the gap between our alive-check and here.
  try {
    const held = fs.readFileSync(lockPath, 'utf8').trim();
    const pid = Number(held);
    let a = false;
    if (held && Number.isInteger(pid) && pid > 0) {
      try { process.kill(pid, 0); a = true; } catch (err) { a = (err.code === 'EPERM'); }
    }
    if (!a) fs.unlinkSync(lockPath);   // still stale — clear it
    // if a live holder appeared, leave it; our publish below will EEXIST and we refuse
  } catch (_) { /* already gone — fine, publish will create it */ }

  r = publish();
  try { fs.rmdirSync(reapDir); } catch (_) {}
  cleanupTmp();
  if (r !== 'won') return null;

  // Final safety net, independent of any primitive's concurrency quirks: the lock is ours only
  // if it actually holds our pid. Any residual race collapses to a refuse here, never a second
  // live watcher.
  try { if (fs.readFileSync(lockPath, 'utf8').trim() !== mine) return null; } catch (_) { return null; }
  return makeRelease(lockPath, mine);
}

module.exports = { classify, fnv1a, acquireLock, HEAD_BYTES };

if (require.main === module) {
  const file = process.argv[2] || DEFAULT_TRANSCRIPT;
  const LOCK = process.env.CONSONANCE_HEADWATCH_LOCK ||
    path.join(path.dirname(LEDGER), 'head-watch.lock');
  const release = acquireLock(LOCK);
  if (!release) {
    // Loud, and exit 0: for a scheduler this is the CORRECT outcome, not a failure, and a
    // non-zero code here would make every logon-with-one-already-running look like a fault.
    console.error(`head-watch: another live watcher holds ${LOCK} — not starting a second.`);
    process.exit(0);
  }
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
    try { process.on(sig, () => { release(); process.exit(0); }); } catch (_) {}
  }
  process.on('exit', release);
  const emit = (obj) => {
    const line = JSON.stringify({ ts: new Date().toISOString(), file, ...obj });
    console.log(line);
    try { fs.appendFileSync(LEDGER, line + '\n'); } catch (e) {
      console.error(`head-watch: ledger append failed: ${e.message}`); // keep watching; stdout still has it
    }
  };
  let prev = readState(file);
  emit(prev
    ? { event: 'start', len: prev.len, head: prev.head }
    : { event: 'start', note: 'transcript absent at watch start' });
  setInterval(() => {
    const cur = readState(file);
    for (const ev of classify(prev, cur)) emit(ev);
    prev = cur;
  }, 500);
}
