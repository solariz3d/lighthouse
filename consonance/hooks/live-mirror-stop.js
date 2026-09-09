#!/usr/bin/env node
'use strict';

// live-mirror-stop.js — the Stop hook of the per-seat live mirror. L052, P-LIVE-MIRROR, pane E.
//
// WHAT IT DOES at the end of every assistant turn, in this order and no other:
//
//   1. HEARTBEAT the seat's lease (refs/consonance/live/<seat>, force-with-lease from our own last
//      sha). This is ALSO how eviction is detected: if another host took the seat, this push fails
//      its lease check, and that failure is the notification. Nobody has to tell us.
//   2. If evicted -> write the quarantine row and STOP. Do not publish. The turn that just finished
//      stays local, deliberately (live-host.js `evicted()`: finish the turn, do not push).
//   3. Otherwise publish the state by calling `state-sync.js --push`.
//
// ---------------------------------------------------------------------------------------------
// STEP 3 IS GATED AND THE GATE IS SHUT. READ THIS BEFORE OPENING IT.
//
// A is measuring, right now, whether the writers tolerate hard-linking or copy-on-close, and
// whether there is a window in which the destination is WRONG. That question is not mine, and its
// answer changes MY cadence rather than A's copy:
//
//   the board and the ledgers are APPEND-ONLY  -> a mid-write read yields a torn last line
//   THE TAILS ARE REWRITTEN                    -> a mid-write read yields a torn FILE
//
// A hook that pushes mid-write would ship a corrupt tail to the other machine at turn cadence:
// fast, automatic, and wrong. So `state.enabled` defaults to FALSE and the lease half runs alone.
// The lease half is safe to run today because it publishes an EMPTY orphan commit — it reads no
// file from `data\` at all, so there is no window for it to be inside of.
//
// TO OPEN THE GATE you need A's finding, wired into `quiescent()` below. Opening it without that
// is precisely what this comment exists to prevent.
//
// ---------------------------------------------------------------------------------------------
// AND `state-sync.js` DOES NOT EXIST YET — A owns it and it was not on disk when this was written
// (checked 2026-09-09 ~03:40). So this hook degrades instead of pretending: a missing sync tool is
// recorded as SKIPPED with a reason, never as a push that happened. An instrument that reports
// success when its dependency is absent is the done-vs-never-started failure, and this seat has
// shipped that bug once and caught it twice since.
//
// A HOOK MUST NEVER BREAK A TURN. Every git call is time-boxed well under the harness's 10 s hook
// timeout, everything is wrapped, and the process always exits 0.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const LH = require(path.join(__dirname, '..', 'tools', 'live-host.js'));

const STATE_REPO = process.env.CONSONANCE_STATE_REPO || 'C:\\Consonance\\state';
const LEDGER = process.env.CONSONANCE_MIRROR_LEDGER || 'C:\\Consonance\\data\\live-mirror.jsonl';
// Machine-local: our own last-pushed lease sha per seat. NEVER travels — it is the observation
// that makes the clock-free reading possible, and a shared copy would make every host agree with
// itself about a lease it does not hold.
const OBS_DIR = process.env.CONSONANCE_MIRROR_OBS || 'C:\\Consonance\\data\\live-mirror';

// The harness kills a hook at 10 s. A network slow enough to hit this is a network the mirror is
// not working over anyway, so the right move is to give up and say so rather than stall the turn.
const GIT_TIMEOUT_MS = 6_000;

// git's well-known empty tree. Always resolvable and never needs writing — which matters because
// this runs via execFile on Windows, where `/dev/null` is not a path git can open.
const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

const CONFIG = Object.freeze({
  lease: { enabled: true },
  state: {
    // WIRED AND TESTED, DEFAULT OFF, AND THE DEFAULT IS A DECISION RATHER THAN AN UNFINISHED EDGE.
    //
    // A's quiescence answer landed while this was being built, so the reason the gate was shut is
    // gone and the plumbing below is complete. What remains is not a technical gap:
    //
    //   1. Flipping this makes every seat push to a real remote after every turn, unattended.
    //      Publishing outward is the one thing this room does not let a seat start on its own
    //      (journal 2026-07-28: committing is not publishing, and a human stays awake saying yes).
    //   2. The measured state round trip does NOT meet the keeper's 5 s bound at any poll interval
    //      (live-host.js roundTrip('state', ...)), so turning it on does not deliver what it is for.
    //
    // Set CONSONANCE_MIRROR_STATE=1 to enable. The lease half runs regardless and is what actually
    // prevents two drivers.
    enabled: process.env.CONSONANCE_MIRROR_STATE === '1',
    gatedOn: 'the keeper: unattended per-turn publishing to a remote, and a state round trip that '
      + 'does not meet the bound it was built to',
  },
});

function row(obj) {
  try {
    fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
    fs.appendFileSync(LEDGER, JSON.stringify({ ts: new Date().toISOString(), ...obj }) + '\n');
  } catch (_) { /* a sensor must never break a turn */ }
}

function git(args, opts = {}) {
  return execFileSync('git', args, {
    cwd: STATE_REPO, timeout: GIT_TIMEOUT_MS, encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'], ...opts,
  });
}

/** Seat from the pane's cwd basename — how every other hook here identifies itself. */
function seatOf(cwd) {
  const base = path.basename(cwd || process.cwd());
  const m = /^(?:sibling-)?([A-Za-z][A-Za-z0-9_]{0,31})$/.exec(base);
  const seat = m ? m[1] : base;
  return LH.seatHazard(seat) ? null : seat;
}

function obsPath(seat) { return path.join(OBS_DIR, `${seat}.json`); }
function readObs(seat) {
  try { return JSON.parse(fs.readFileSync(obsPath(seat), 'utf8')); } catch (_) { return null; }
}
function writeObs(seat, o) {
  try {
    fs.mkdirSync(OBS_DIR, { recursive: true });
    fs.writeFileSync(obsPath(seat), JSON.stringify(o));
  } catch (_) { /* ignore */ }
}

/**
 * Heartbeat the lease. Returns exactly one of:
 *   { ok: true, sha }              we still hold it
 *   { ok: false, evicted: true }   another host took it — force-with-lease refused us
 *   { ok: false, offline: true }   the remote could not be reached
 *   { ok: false, reason }          anything else, named
 *
 * THE EVICTION SIGNAL IS THIS PUSH'S OWN FAILURE, which is why it is worth doing every turn even
 * when nothing else is: it is the only notification a displaced holder ever gets.
 *
 * The three outcomes share one exit code and are separated by stderr, which is a weaker
 * discriminator than I would like — it is pattern-matching on git's prose. Named in the hand-back
 * rather than hidden here.
 */
function heartbeat(seat) {
  const ref = LH.leaseRef(seat);          // throws on a bad seat; the caller has already checked
  const prev = readObs(seat);
  let sha;
  try {
    sha = git(['commit-tree', EMPTY_TREE, '-m', `beat ${seat} ${Date.now()}`]).trim();
  } catch (e) {
    return { ok: false, reason: `could not build the beat commit: ${e.message}` };
  }

  const args = prev && prev.sha
    ? ['push', `--force-with-lease=${ref}:${prev.sha}`, 'origin', `${sha}:${ref}`]
    : ['push', 'origin', `${sha}:${ref}`];   // first beat: create-if-absent; non-ff if already held

  try {
    git(args);
    writeObs(seat, { sha, at: new Date().toISOString() });
    return { ok: true, sha };
  } catch (e) {
    const err = String((e.stderr || '') + (e.stdout || '') + (e.message || ''));
    if (/could not resolve host|unable to access|Connection|timed out|ETIMEDOUT/i.test(err)) {
      return { ok: false, offline: true, err: err.slice(0, 400) };
    }
    if (/stale info|rejected|non-fast-forward/i.test(err)) {
      return { ok: false, evicted: true, err: err.slice(0, 400) };
    }
    return { ok: false, reason: err.slice(0, 400) };
  }
}

/**
 * QUIESCENCE — ANSWERED BY A ON 2026-09-09, AND THE ANSWER IS NOT MINE TO RE-IMPLEMENT.
 *
 * A measured it rather than reasoning about it, and the numbers are worse than my gate assumed:
 * reading a capture mid-rewrite returned an EMPTY file on 1,812 of 1,833 reads, and a
 * stat/read/stat/read gate agreeing four ways STILL accepted 6 torn buffers out of 28. Hard links
 * are refused on two independent measured grounds. The working gate is a settle window inside
 * `state-sync.js`, and a path that will not come back stable ABORTS THE WHOLE PUSH by name.
 *
 * So the gate lives in A's tool, and this returns 'DELEGATED' rather than a verdict of its own.
 * Two copies of one rule drift apart — the committee card's own warning, and re-deriving a settle
 * check here is exactly that.
 *
 * A's closing line is the half that is mine: *"Retry between turns. ... that is the
 * quiescent-moment finding, and it changes the push CADENCE, not this tool."* This hook IS the
 * cadence. An unsettled abort is therefore a NORMAL outcome here, not an error — the next turn
 * carries it.
 */
function quiescent() { return 'DELEGATED'; }

/**
 * Returns { pushed } | { deferred, why } | { error }.
 *
 * THE DISTINCTION IS THE WHOLE FUNCTION. A's abort and a broken tool share exit code 1, and
 * collapsing them would either cry wolf every time a capture happened to be mid-rewrite, or bury a
 * genuinely broken sync under a reassuring "deferred". Deferred is expected and self-correcting;
 * error is not.
 */
function pushState(seat) {
  const tool = path.join(__dirname, '..', 'tools', 'state-sync.js');
  if (!fs.existsSync(tool)) {
    return { pushed: false, error: 'state-sync.js is missing' };
  }
  const t0 = Date.now();
  try {
    execFileSync(process.execPath, [tool, '--push'],
      { timeout: GIT_TIMEOUT_MS, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { pushed: true, ms: Date.now() - t0 };
  } catch (e) {
    const out = String((e.stdout || '') + (e.stderr || '') + (e.message || ''));
    if (/would not come back STABLE|Retry between turns/i.test(out)) {
      // Expected. The app was writing; the next turn carries it. Named paths ride the row so a
      // path that NEVER settles is visible as a repeat rather than as steady silence.
      return {
        pushed: false, deferred: true, ms: Date.now() - t0,
        why: out.split('\n').filter((l) => /^\s{2}\S/.test(l)).slice(0, 6).join(' | ').slice(0, 300)
          || 'a TRAVELS path would not settle',
      };
    }
    return { pushed: false, error: out.slice(0, 400), ms: Date.now() - t0 };
  }
}

function readStdin() {
  // NON-BLOCKING BY CONSTRUCTION. Reading fd 0 when no stdin is attached hangs until the harness
  // kills the hook — found the hard way while wiring this file, by hanging a shell for two minutes.
  try {
    const st = fs.fstatSync(0);
    if (!st.isFIFO() && !st.isFile()) return {};
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch (_) { return {}; }
}

function main() {
  // THE DREAM GUARD, and this hook is the worst possible member of the class without it. Every
  // managed hook here carries one; the two DECLARED-UNMANAGED hooks are unmanaged partly BECAUSE
  // they lack it. A dream runs unattended — and this hook reaches a network remote and moves a
  // lease that decides which machine may drive a seat. A dream beating leases the dream runner
  // cannot switch off would be a sleeping machine quietly holding seats against a waking one.
  if (process.env.CONSONANCE_DREAM) return;

  const input = readStdin();

  const seat = seatOf(input.cwd);
  if (!seat) { row({ kind: 'skip', reason: 'no usable seat name from cwd', cwd: input.cwd }); return; }
  if (!fs.existsSync(path.join(STATE_REPO, '.git'))) {
    row({ kind: 'skip', seat, reason: `no state repo at ${STATE_REPO}` });
    return;
  }
  if (!CONFIG.lease.enabled) { row({ kind: 'skip', seat, reason: 'lease disabled' }); return; }

  const hb = heartbeat(seat);
  if (hb.evicted) {
    // live-host.js owns the ruling; this hook only carries it out.
    const ruling = LH.evicted({ seat, turnActive: true });
    row({ kind: 'evicted', seat, ...ruling.row, ruling: ruling.reason, push: ruling.push });
    return;                                    // step 2: STOP. The turn stays local.
  }
  if (hb.offline) { row({ kind: 'offline', seat, err: hb.err }); return; }
  if (!hb.ok) { row({ kind: 'lease_error', seat, reason: hb.reason }); return; }

  const st = CONFIG.state.enabled
    ? pushState(seat)
    : { pushed: false, skipped: `state push is GATED on: ${CONFIG.state.gatedOn}` };

  row({ kind: 'beat', seat, sha: hb.sha, state: st });
}

// Only ACT when run as a hook. Requiring this file (the test does) must neither run a turn's worth
// of git nor exit the requiring process — a bare `process.exit(0)` at module scope would do both.
if (require.main === module) {
  try { main(); } catch (e) {
    try { row({ kind: 'hook_error', error: String((e && e.message) || e).slice(0, 400) }); } catch (_) {}
  }
  process.exit(0);
}

module.exports = {
  seatOf, quiescent, heartbeat, pushState, readStdin, main,
  CONFIG, EMPTY_TREE, LEDGER, STATE_REPO, OBS_DIR, GIT_TIMEOUT_MS,
};
