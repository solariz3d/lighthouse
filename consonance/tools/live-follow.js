#!/usr/bin/env node
'use strict';

// live-follow.js — the follower half of the per-seat live mirror. L052, P-LIVE-MIRROR, pane E.
//
// The Stop hook (consonance/hooks/live-mirror-stop.js) is the DRIVER's half: it beats the lease of
// the seat it is driving and publishes. This is the other half — the machine that is NOT driving a
// given seat, watching who holds what, and taking a seat over when its human types into it.
//
// ---------------------------------------------------------------------------------------------
// ONE ROUND TRIP FOR ALL SEATS, WHICH IS THE ONLY REASON PER-SEAT LEASES ARE AFFORDABLE
//
// The unit changing from machine to seat multiplies the number of leases by the number of seats,
// and the naive follower polls each one — seven seats x ~1 000 ms is a seven-second poll cycle,
// which fails the bound before anything else does. `git ls-remote origin 'refs/consonance/live/*'`
// returns every seat in ONE round trip, so the read cost is flat in the number of seats. Verified
// against the real remote 2026-09-09.
//
// ---------------------------------------------------------------------------------------------
// WHAT THIS TOOL WILL TELL YOU AND WHAT IT WILL NOT
//
// It reports the LEASE view, which is cheap, flat, and clears its bound. It does NOT claim the
// state has arrived — that is `state-sync.js --pull` (A's), and the measured state round trip does
// not fit the 5 s bound at any poll interval (live-host.js `roundTrip('state', ...)`). So a seat
// showing as held-by-us here means "this machine may drive it", never "this machine has the other
// machine's latest text". Conflating those two is how a follower silently drives from stale state.

const path = require('path');
const { execFileSync } = require('child_process');

const LH = require(path.join(__dirname, 'live-host.js'));

// env, then ~/.consonance.json state_dir, then NULL — never a machine's literal path (L062 R-C1, pane E;
// portable-paths FATAL-DEFAULT at this line). Same shape as transcript-watch.js dataDir().
// ONE NAME (L069, pane E): CONSONANCE_STATE, as state-sync.js stateDir() and close.js read it. This read
// CONSONANCE_STATE_REPO until L069; nothing outside the repo ever set that name, so it is retired, not aliased.
function stateRepo() {
  const env = (process.env.CONSONANCE_STATE || '').trim();
  if (env) return env;
  try {
    const v = JSON.parse(require('fs').readFileSync(path.join(require('os').homedir(), '.consonance.json'), 'utf8')
      .replace(/^﻿/, ''));
    const d = v && v.state_dir != null ? String(v.state_dir).trim() : '';
    if (d) return d;
  } catch (_) { /* unreadable config declares nothing */ }
  return null;
}
const STATE_REPO = stateRepo();
const UNDECLARED = 'no state repo declared: set state_dir in ~/.consonance.json or CONSONANCE_STATE';
const GIT_TIMEOUT_MS = 8_000;

function git(args) {
  // With a null cwd git would run in whatever directory the CALLER is in — `push origin --delete`
  // against the wrong repository. Refuse before the spawn.
  if (!STATE_REPO) throw Object.assign(new Error(UNDECLARED), { stderr: '' });
  return execFileSync('git', args, {
    cwd: STATE_REPO, timeout: GIT_TIMEOUT_MS, encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * Every seat lease in one round trip. Returns { ok, ms, seats: { <seat>: sha }, err }.
 * `ok:false` is reported, never thrown and never silently turned into an empty map — an empty map
 * and an unreachable remote are the same shape and mean opposite things (nobody holds anything vs
 * we cannot see who holds anything), and folding them together is how a follower takes a seat that
 * is already being driven.
 */
function readLeases() {
  const t0 = Date.now();
  try {
    const out = git(['ls-remote', 'origin', `${LH.LEASE_NS}/*`]);
    const seats = {};
    for (const line of out.split('\n')) {
      const m = /^([0-9a-f]{40})\s+(.+?)\s*$/.exec(line);
      if (!m) continue;
      const seat = m[2].slice(LH.LEASE_NS.length + 1);
      if (!LH.seatHazard(seat)) seats[seat] = m[1];
    }
    return { ok: true, ms: Date.now() - t0, seats };
  } catch (e) {
    return {
      ok: false, ms: Date.now() - t0, seats: null,
      err: String((e.stderr || '') + (e.message || '')).slice(0, 400),
    };
  }
}

/**
 * The observation record that makes the clock-free liveness reading possible: for each seat, the
 * token we last saw and when WE first saw it, on OUR clock. Kept in memory by the watch loop and
 * on disk by the hook; only differences on one clock are ever taken.
 */
function foldObservation(prev, seats, nowMs) {
  const next = {};
  for (const [seat, sha] of Object.entries(seats)) {
    const p = prev[seat];
    next[seat] = (p && p.token === sha)
      ? { token: sha, firstSeenLocalMs: p.firstSeenLocalMs, advanced: false }
      : { token: sha, firstSeenLocalMs: nowMs, advanced: !!(p && p.token && p.token !== sha) };
  }
  return next;
}

/** Liveness of one seat from our own observation window, with no foreign clock anywhere. */
function seatLiveness(obs, nowMs, pol) {
  if (!obs) return LH.LIVENESS.NEVER_STARTED;
  if (obs.advanced) return LH.LIVENESS.ADVANCING;
  const watchedMs = nowMs - obs.firstSeenLocalMs;
  if (watchedMs >= LH.staleAfterMs(pol.publishMs)) return LH.LIVENESS.UNCHANGED;
  return LH.LIVENESS.UNOBSERVED;               // one sample, or not watched long enough
}

function status(selfId, pol) {
  const read = readLeases();
  if (!read.ok) {
    return { ok: false, err: read.err, note: 'the remote is unreachable: who holds what is UNKNOWN, '
      + 'which is not the same as nobody holding anything' };
  }
  const now = Date.now();
  const obs = foldObservation({}, read.seats, now);
  const rows = Object.keys(read.seats).sort().map((seat) => {
    const live = seatLiveness(obs[seat], now, pol);
    return { seat, sha: read.seats[seat].slice(0, 8), liveness: live };
  });
  return { ok: true, ms: read.ms, selfId, rows };
}

/**
 * Take a seat over. Delegates the RULING to live-host.js `handoff()` and only performs the git.
 * `forced` is the human's override and it orphans a turn on the other host — the caller must have
 * said so before asking, not after.
 */
function acquire({ seat, selfId, forced = false, observation = null, pol = LH.policy() }) {
  const bad = LH.seatHazard(seat);
  if (bad) return { ok: false, reason: bad };

  const read = readLeases();
  const lease = !read.ok ? 'UNAVAILABLE'
    : (read.seats[seat] ? { holder: read.seats[seat] } : null);

  const now = Date.now();
  const live = read.ok && read.seats[seat]
    ? seatLiveness(observation || { token: read.seats[seat], firstSeenLocalMs: now }, now, pol)
    : LH.LIVENESS.NEVER_STARTED;

  const ruling = LH.handoff({ seat, selfId, lease, liveness: live, turnActive: null, forced });
  if (ruling.blocked || ruling.action === LH.HANDOFF.REQUEST) {
    // A REQUEST is not a git operation. It is a note the holder honours at its next turn boundary,
    // and the holder is the only party that can act on it — deliberately, so that acquiring a live
    // seat never tears a turn.
    return { ok: false, ruling, performed: null };
  }

  const ref = LH.leaseRef(seat);
  const mine = git(['commit-tree', '4b825dc642cb6eb9a060e54bf8d69288fbee4904',
    '-m', `acquire ${seat} by ${selfId} ${Date.now()}`]).trim();
  const args = read.seats[seat]
    // CAS against exactly the sha we OBSERVED, so a lease that moved while we were deciding cannot
    // be broken by accident.
    ? ['push', `--force-with-lease=${ref}:${read.seats[seat]}`, 'origin', `${mine}:${ref}`]
    : ['push', 'origin', `${mine}:${ref}`];
  try {
    git(args);
    return { ok: true, ruling, performed: ruling.action, sha: mine };
  } catch (e) {
    return { ok: false, ruling, performed: null,
      reason: String((e.stderr || '') + (e.message || '')).slice(0, 400) };
  }
}

function release(seat) {
  const bad = LH.seatHazard(seat);
  if (bad) return { ok: false, reason: bad };
  try { git(['push', 'origin', '--delete', LH.leaseRef(seat)]); return { ok: true }; }
  catch (e) { return { ok: false, reason: String((e.stderr || '') + (e.message || '')).slice(0, 400) }; }
}

// ---------------------------------------------------------------------------------------------
// CLI

function budgetLine(pollMs) {
  const lease = LH.roundTrip('lease', pollMs);
  const state = LH.roundTrip('state', pollMs);
  return [
    `poll ${pollMs} ms  ·  bound ${LH.BOUND_INTERNET_MS} ms (internet)`,
    `  lease round trip  floor ${lease.floorMs} ms  worst ${lease.worstMs} ms  ` +
      `${lease.fits ? 'FITS' : 'DOES NOT FIT'} (headroom ${lease.headroomMs} ms)`,
    `  state round trip  floor ${state.floorMs} ms  worst ${state.worstMs} ms  ` +
      `${state.fits ? 'FITS' : 'DOES NOT FIT'} (headroom ${state.headroomMs} ms)`,
    `  largest poll that still fits:  lease ${LH.maxPollMs('lease')} ms  ·  ` +
      `state ${LH.maxPollMs('state')} ms`,
  ].join('\n');
}

function main(argv) {
  const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
  const has = (n) => argv.includes(n);
  const pollMs = Number(arg('--poll', '1500'));
  const selfId = arg('--self', process.env.CONSONANCE_INSTALL_ID || '(unset)');
  const pol = LH.policy();

  if (has('--budget')) { console.log(budgetLine(pollMs)); return 0; }

  if (!STATE_REPO && ['--status', '--acquire', '--release', '--watch'].some(has)) {
    console.error(`REFUSED — ${UNDECLARED}. Nothing was read and nothing was sent.`);
    return 2;
  }

  if (has('--status')) {
    const s = status(selfId, pol);
    if (!s.ok) { console.error(`unreachable: ${s.err}\n${s.note}`); return 2; }
    console.log(`leases read in ${s.ms} ms  ·  self ${s.selfId}`);
    if (!s.rows.length) console.log('  (no seat lease is held by anyone)');
    for (const r of s.rows) console.log(`  ${r.seat.padEnd(10)} ${r.sha}  ${r.liveness}`);
    return 0;
  }

  if (has('--acquire')) {
    const seat = arg('--acquire');
    const r = acquire({ seat, selfId, forced: has('--force'), pol });
    console.log(JSON.stringify(r, null, 2));
    return r.ok ? 0 : 1;
  }

  if (has('--release')) {
    const r = release(arg('--release'));
    console.log(JSON.stringify(r, null, 2));
    return r.ok ? 0 : 1;
  }

  if (has('--watch')) {
    // The loop deliberately reports the poll budget on the first tick, so a follower running at an
    // interval that cannot meet the bound says so on screen instead of quietly being slow.
    console.log(budgetLine(pollMs));
    let obs = {};
    const tick = () => {
      const read = readLeases();
      const now = Date.now();
      if (!read.ok) { console.log(`${new Date().toISOString()}  UNREACHABLE  ${read.err.split('\n')[0]}`); return; }
      obs = foldObservation(obs, read.seats, now);
      const held = Object.keys(read.seats).sort()
        .map((s) => `${s}:${seatLiveness(obs[s], now, pol)[0]}${obs[s].advanced ? '*' : ''}`)
        .join(' ');
      console.log(`${new Date().toISOString()}  ${read.ms} ms  ${held || '(none)'}`);
    };
    tick();
    setInterval(tick, Math.max(250, pollMs));
    return null;                                   // runs until killed
  }

  console.log(`live-follow.js — the follower half of the per-seat live mirror

  --status              who holds which seat, one round trip
  --watch [--poll MS]   keep reading; prints the poll budget first
  --budget [--poll MS]  the measured round trips against the keeper's bound
  --acquire SEAT [--force]
  --release SEAT
  --self ID             this machine's install id

The lease view clears the 5 s bound. THE STATE MIRROR DOES NOT — see --budget.`);
  return 0;
}

if (require.main === module) {
  const rc = main(process.argv.slice(2));
  if (rc !== null) process.exit(rc);
}

module.exports = { readLeases, foldObservation, seatLiveness, status, acquire, release, budgetLine, main, STATE_REPO };
