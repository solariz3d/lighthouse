'use strict';

// live-host.js — the cross-machine "one live host" decision, as a pure function.
//
// L049, P-LIVE-HOST, pane E, 2026-09-09. WIRED TO NOTHING. No fs, no git, no clock, no network:
// every fact the decision needs is an argument. The Rust beside the mutex at `main.rs:5462` lands
// at the next rebuild; this is the decision it will call, testable tonight.
//
// ---------------------------------------------------------------------------------------------
// WHAT THIS IS FOR
//
// `Local\ConsonanceSingleInstance` (main.rs:5462) refuses a second app on ONE machine. There is no
// cross-machine equivalent, and the two-machines lap wants one: laptop and desktop sharing
// `C:\Consonance\data\` through a git-transported state set, with only one host live at a time.
//
// ---------------------------------------------------------------------------------------------
// THE FINDING THAT SHAPED THE DESIGN, and it arrived while enumerating the cases rather than from
// the brief:
//
//   A SYNCED FILE CANNOT REPORT THE PRESENT. Not its heartbeat, and NOT its state field either.
//
// The obvious hazard is a heartbeat that has gone stale. The one that is easy to miss: host A
// closes cleanly at 10:00 (CLOSED written and pushed), relaunches at 10:05 (LIVE written, push
// fails — no network). Host B pulls, reads CLOSED, proceeds. Two live hosts, and no clock was
// involved anywhere in that story. `state: CLOSED` is exactly as stale-able as the heartbeat is.
//
// So a design that only hardens the heartbeat comparison is green over the surface it cannot see —
// which is this seat's own recurring class (L044, L046), caught here before it shipped rather than
// after. The consequence is the layering below.
//
// ---------------------------------------------------------------------------------------------
// THREE LAYERS, IN ORDER OF AUTHORITY
//
//   1. THE LEASE — authoritative, clock-free, and the only thing here that ENFORCES anything.
//      A ref on the shared remote, taken by an atomic create-if-absent push. Mutual exclusion
//      lives on the one machine both hosts can reach, so it needs no shared clock and no
//      agreement about time at all. Reachable only when the network is.
//
//   2. THE HEARTBEAT — evidence, never enforcement. It answers "is the lease-holder still alive",
//      so a lease held by a crashed host can be broken with a reason. Read CLOCK-FREE where
//      possible: see LIVENESS below.
//
//   3. THE HUMAN — final, always. Every refusal here is overridable, and every override is
//      recorded. See THE FAILURE DIRECTION.
//
// `enforced` in the result is TRUE only when layer 1 decided. Offline, every verdict — PROCEED on
// a CLOSED file included — carries `enforced: false`, because offline nothing in the synced set is
// known to be current. That flag is what makes the lap's falsifier auditable afterwards: a
// double-live must have at least one launch that recorded `enforced: false`.
//
// ---------------------------------------------------------------------------------------------
// LIVENESS WITHOUT A SHARED CLOCK
//
// The packet gave permission to refuse the whole thing if one live host cannot be enforced without
// a shared clock. It can — but not by heartbeats, which is where the refusal would have been
// right. Two separate readings, and only one of them is trusted:
//
//   OBSERVED (authoritative, skew-free): "I have watched this file across N pulls spanning W ms of
//     MY OWN clock and the heartbeat token has not changed." Only one clock appears, and only as a
//     difference on it. The foreign timestamp is used as an OPAQUE TOKEN for change-detection and
//     never as a quantity in arithmetic, so it may be arbitrarily wrong and the reading still
//     holds. Costs a wait: one sample can never say "unchanged".
//
//   WALL (advisory only, never decides): `nowLocal - heartbeat.at`. Contaminated by skew in both
//     directions — a clock behind the other host's makes a dead host look alive (over-refusal,
//     merely annoying), a clock ahead makes a LIVE host look stale (under-refusal, the dangerous
//     one). It is computed anyway, because when it DISAGREES with the observed reading, or comes
//     back negative, that disagreement is a direct measurement of skew and gets named to the user
//     instead of silently deciding anything.
//
// So a cold launch with a single sample genuinely cannot tell stale from live. It does not guess:
// it says so, prices the wait, and lets the keeper override or wait for a clock-free answer. Most
// launches never reach that branch, because most of the time the lease is free or the other host
// closed cleanly.
//
// ---------------------------------------------------------------------------------------------
// THE FAILURE DIRECTION — the ruling the packet asked for
//
// IT FAILS TOWARD LETTING THE KEEPER IN. Never silently, never without a record, but in.
// No state this module can return is a lockout. Four reasons, in the order they carry weight:
//
//   1. RECOVERABILITY IS ASYMMETRIC, and size is not the axis. Two live hosts on an append-only,
//      git-transported set produce a DIVERGENCE: both commits exist, nothing is destroyed, and the
//      merge of two sets of appends is a concatenation a sort settles. A lockout is not
//      recoverable by the person it happens to — the tool refuses on evidence about a machine he
//      may not be able to reach, and offers him nothing to do about it.
//   2. THE PRECEDENT IS IN THE SAME FILE, WITH ITS REASON STATED. `claim_named_singleton`
//      (main.rs:5443) fails OPEN when it cannot tell: "a launcher bug must never be able to make
//      the app permanently unstartable, and the cost of a second instance is recoverable while the
//      cost of no instance is not." That reasoning transfers to the cross-machine case unchanged.
//   3. THE GUARD HAS STRICTLY LESS INFORMATION THAN THE HUMAN. It is reasoning from a file that
//      may be minutes old about a machine it cannot see. The keeper knows whether his desktop is
//      on. Overriding him on that inference is the overseer position the room has already ruled
//      against — with you, not above you.
//   4. FAIL-CLOSED PRODUCES NO EVIDENCE OF ITS OWN OPERATION. A guard that hard-refuses records
//      zero double-lives whether it works or not, which is indistinguishable from a guard nobody
//      ever triggered. Fail-open-with-a-record makes every contested launch a row.
//
// WHAT THAT COSTS, said plainly rather than softened: an always-overridable guard cannot deliver
// "one live host" as a hard property. It delivers two weaker ones — two live hosts are impossible
// BY ACCIDENT, and undeniable AFTER THE FACT. So the lap's falsifier splits (see the design doc):
// F1, two hosts live in the same minute, still fires and is not weakened; F2, two hosts live with
// NO `forced` record, is the new one and is the worse failure, because it is the silent one.
//
// What changes across the verdicts is not whether the door opens but what it costs to open it:
// REFUSE_FOREIGN_LIVE wants the other host's name typed; the ASK verdicts want one click; PROCEED
// asks nothing. Deliberateness scales with the strength of the evidence against.
//
// ---------------------------------------------------------------------------------------------
// DONE VS NEVER-STARTED — the tenth sighting this fortnight, on a new surface
//
// An absence has no author. Four different situations produce "no heartbeat here", they call for
// four different actions, and nothing about the absence itself tells them apart. Each therefore
// gets a distinguishing ARTIFACT written by whatever would have been running, never inferred:
//
//   NEVER_INSTALLED     no file at all, and the sync is VERIFIED complete. Nothing has ever
//                       claimed this house. Safe.
//   SYNC_UNVERIFIED     no file, and the pull is not known to have finished. This is the
//                       DANGEROUS absence — the other host may be live and its file simply did not
//                       arrive — and it is indistinguishable from NEVER_INSTALLED by looking. Only
//                       the sync's own completion record separates them, which is why
//                       `syncVerified` is a required input and `null` is not treated as `false`
//                       or as `true`: it is treated as UNKNOWN and named.
//   WRITER_NEVER_WROTE  the file exists, a `heartbeat.writer_started` stamp is present, and no
//                       beat was ever written. The writer started and produced nothing — a bug in
//                       the writer, a wholly different diagnosis from "no host ran here", and one
//                       that would otherwise read as maximally-stale and therefore as SAFE.
//   STOPPED             a beat exists and stopped. The only one of the four that means what a
//                       naive reader assumes an absent heartbeat means.
//
// The rule underneath: a never-started heartbeat must NEVER be reported as maximally stale.
// Maximum staleness reads as "safe to take over", and three of these four absences are not that.
//
// ---------------------------------------------------------------------------------------------
// IDENTITY, and one silent failure worth more than everything else in this file
//
// `selfId` is an INSTALL id, not a hostname: hostnames get renamed and can collide, and
// `lap-row.js:411`'s one-character machine tag is far too coarse to decide self-versus-foreign.
// It is minted once per install and lives in a MACHINE-LOCAL file.
//
// IF THAT FILE EVER LANDS IN THE TRAVELLING SET, BOTH MACHINES SHARE AN IDENTITY AND EVERY FOREIGN
// CLAIM READS AS SELF — the guard returns PROCEED_RECLAIM at exactly the moment it should refuse,
// and does it quietly. That is a hard dependency on P-STATE-SET's manifest (`install_id` in the
// STAYS column) and it is asserted here rather than trusted: see `identityHazard()`.

// ---------------------------------------------------------------------------------------------
// POLICY — the numbers, as a derivation rather than as constants.
//
// STALENESS IS A FUNCTION OF THE TRANSPORT, so it is computed from the publish period rather than
// written down. If the transport changes, the number moves with it instead of rotting.
//
//   staleAfterMs = publishMs * missesTolerated + marginMs
//
// missesTolerated = 3. One missed publish is routine (a push failed, the link blipped); two is
// suspicious; three is a pattern. Consecutive-miss detectors trade a false-positive rate that
// falls geometrically against a detection delay that grows only linearly, and here the cost of
// declaring stale too EARLY is a double-live host while the cost of declaring it too LATE is the
// keeper waiting one dialog longer — so this leans long.
//
// marginMs = one further publish period: tolerate one wholly lost cycle beyond the three.
//
// publishMs = 120_000 is a PLACEHOLDER AND IS UNMEASURED. Nobody here has timed a push-and-pull of
// a one-line file between these two machines, and this number is a guess until somebody does. It
// is stated as a guess rather than quoted as a figure, and the lap's measurement owes it a real
// value. At the placeholder: staleAfterMs = 120_000 * 3 + 120_000 = 480_000 (8 minutes).
//
// LOCAL_BEAT_MS is the on-disk write and is unrelated to staleness: it exists so a crash leaves a
// recent local beat, and it costs nothing.

const MISSES_TOLERATED = 3;

function staleAfterMs(publishMs, missesTolerated = MISSES_TOLERATED, marginMs = publishMs) {
  if (!Number.isFinite(publishMs) || publishMs <= 0) {
    throw new Error(`publishMs must be a positive number, got ${JSON.stringify(publishMs)}`);
  }
  if (!Number.isInteger(missesTolerated) || missesTolerated < 1) {
    throw new Error(`missesTolerated must be a positive integer, got ${JSON.stringify(missesTolerated)}`);
  }
  if (!Number.isFinite(marginMs) || marginMs < 0) {
    throw new Error(`marginMs must be a non-negative number, got ${JSON.stringify(marginMs)}`);
  }
  return publishMs * missesTolerated + marginMs;
}

const DEFAULT_PUBLISH_MS = 120_000;   // UNMEASURED — see above
const DEFAULT_LOCAL_BEAT_MS = 15_000;

function policy(overrides = {}) {
  const publishMs = overrides.publishMs ?? DEFAULT_PUBLISH_MS;
  const missesTolerated = overrides.missesTolerated ?? MISSES_TOLERATED;
  const marginMs = overrides.marginMs ?? publishMs;
  return Object.freeze({
    localBeatMs: overrides.localBeatMs ?? DEFAULT_LOCAL_BEAT_MS,
    publishMs,
    missesTolerated,
    marginMs,
    staleAfterMs: staleAfterMs(publishMs, missesTolerated, marginMs),
    // A number nobody has timed is a guess, and it says so in its own output rather than in a
    // comment somebody has to go and read.
    publishMsMeasured: overrides.publishMsMeasured === true,
  });
}

// ---------------------------------------------------------------------------------------------

const VERDICTS = Object.freeze({
  PROCEED: 'PROCEED',
  PROCEED_RECLAIM: 'PROCEED_RECLAIM',
  REFUSE_FOREIGN_LIVE: 'REFUSE_FOREIGN_LIVE',
  ASK_FOREIGN_STALE: 'ASK_FOREIGN_STALE',
  ASK_INDETERMINATE: 'ASK_INDETERMINATE',
});

// Cost of opening the door, per verdict. No entry is `never`: see THE FAILURE DIRECTION.
const OVERRIDE_COST = Object.freeze({
  [VERDICTS.PROCEED]: 'none',
  [VERDICTS.PROCEED_RECLAIM]: 'none',
  [VERDICTS.REFUSE_FOREIGN_LIVE]: 'type-the-other-host',
  [VERDICTS.ASK_FOREIGN_STALE]: 'confirm',
  [VERDICTS.ASK_INDETERMINATE]: 'confirm',
});

const ABSENCE = Object.freeze({
  NEVER_INSTALLED: 'NEVER_INSTALLED',
  SYNC_UNVERIFIED: 'SYNC_UNVERIFIED',
  WRITER_NEVER_WROTE: 'WRITER_NEVER_WROTE',
  STOPPED: 'STOPPED',
});

const LIVENESS = Object.freeze({
  ADVANCING: 'ADVANCING',         // token changed under our own eyes
  UNCHANGED: 'UNCHANGED',         // token held still for >= staleAfterMs of OUR clock
  UNOBSERVED: 'UNOBSERVED',       // not watched long enough to say either — a single sample
  NEVER_STARTED: 'NEVER_STARTED', // writer started, no beat ever written
});

// ---------------------------------------------------------------------------------------------

/** SELF | FOREIGN | UNKNOWN. Unknown is a third answer and is never folded into either. */
function whose(claim, selfId) {
  const held = claim && claim.holder && claim.holder.install_id;
  if (typeof held !== 'string' || held.trim() === '') return 'UNKNOWN';
  if (typeof selfId !== 'string' || selfId.trim() === '') return 'UNKNOWN';
  return held === selfId ? 'SELF' : 'FOREIGN';
}

/**
 * The hazard that would make this whole module lie quietly. `installIdPath` must not sit under
 * `travellingRoot`; if it does, both machines carry one identity and every FOREIGN claim reads as
 * SELF. Returns null when safe, or a reason string.
 */
function identityHazard(installIdPath, travellingRoot) {
  if (typeof installIdPath !== 'string' || installIdPath.trim() === '') {
    return 'install-id path is not set: identity cannot be established, so self and foreign are indistinguishable';
  }
  if (typeof travellingRoot !== 'string' || travellingRoot.trim() === '') return null;
  const norm = (p) => p.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
  const idp = norm(installIdPath);
  const root = norm(travellingRoot);
  if (idp === root || idp.startsWith(root + '/')) {
    return `install-id file ${installIdPath} is inside the travelling set ${travellingRoot}: `
      + 'both machines would share an identity and every foreign claim would read as self';
  }
  return null;
}

/**
 * Which of the four absences this is. Takes the claim and the sync's own completion record;
 * `syncVerified === null` means UNKNOWN and is not read as either boolean.
 */
function absenceClass(claim, syncVerified) {
  if (claim === null || claim === undefined) {
    return syncVerified === true ? ABSENCE.NEVER_INSTALLED : ABSENCE.SYNC_UNVERIFIED;
  }
  const hb = claim.heartbeat || null;
  const beat = hb ? hb.beat : undefined;
  const started = hb ? hb.writer_started : undefined;
  if (!Number.isFinite(beat)) {
    return started ? ABSENCE.WRITER_NEVER_WROTE : ABSENCE.SYNC_UNVERIFIED;
  }
  return ABSENCE.STOPPED;
}

/**
 * Clock-free liveness from local observation.
 *
 * `observation` is this machine's own record of what it last saw: { token, firstSeenLocalMs }.
 * `nowLocalMs` is this machine's clock. The foreign timestamp never enters.
 */
function liveness(claim, observation, nowLocalMs, pol) {
  const hb = (claim && claim.heartbeat) || null;
  if (!hb || !Number.isFinite(hb.beat)) {
    return { state: LIVENESS.NEVER_STARTED, observedForMs: null, token: null };
  }
  const token = String(hb.token ?? `${claim.lease_seq}:${hb.beat}`);
  if (!observation || observation.token !== token) {
    // Either the first sighting, or it moved since the last one. A token that CHANGED is the only
    // positive evidence of life there is, and it is skew-free.
    const advanced = !!(observation && observation.token && observation.token !== token);
    return {
      state: advanced ? LIVENESS.ADVANCING : LIVENESS.UNOBSERVED,
      observedForMs: 0,
      token,
    };
  }
  const observedForMs = nowLocalMs - observation.firstSeenLocalMs;
  if (!Number.isFinite(observedForMs) || observedForMs < 0) {
    // Our own clock moved backwards (a resync, a suspend). We cannot measure our own interval, so
    // we do not pretend to.
    return { state: LIVENESS.UNOBSERVED, observedForMs: null, token };
  }
  return {
    state: observedForMs >= pol.staleAfterMs ? LIVENESS.UNCHANGED : LIVENESS.UNOBSERVED,
    observedForMs,
    token,
  };
}

/**
 * ADVISORY ONLY. Never decides. Its job is to make skew visible: a negative age is a foreign clock
 * running ahead of ours, and disagreement with the observed reading is a measurement of skew that
 * gets named rather than resolved silently.
 */
function wallClockAge(claim, nowLocalMs) {
  const at = claim && claim.heartbeat && claim.heartbeat.at;
  const t = at ? Date.parse(at) : NaN;
  if (!Number.isFinite(t) || !Number.isFinite(nowLocalMs)) {
    return { ageMs: null, skewSuspected: false, note: 'no parseable foreign timestamp', advisory: true };
  }
  const ageMs = nowLocalMs - t;
  if (ageMs < 0) {
    return {
      ageMs,
      skewSuspected: true,
      note: `the other host's heartbeat is ${Math.abs(ageMs)}ms in this machine's future: the clocks disagree`,
      advisory: true,
    };
  }
  return { ageMs, skewSuspected: false, note: null, advisory: true };
}

// ---------------------------------------------------------------------------------------------

function result(verdict, enforced, reason, named, extra = {}) {
  return Object.freeze({
    verdict,
    enforced: !!enforced,
    reason,
    named: Object.freeze({
      ...named,
      ...(extra.caveat ? { caveat: extra.caveat } : {}),
      ...(extra.via ? { via: extra.via } : {}),
    }),
    overrideCost: OVERRIDE_COST[verdict],
    overridable: OVERRIDE_COST[verdict] !== 'never',
  });
}

/**
 * The decision.
 *
 * input = {
 *   selfId,          install id of this machine (machine-local, never travels)
 *   claim,           parsed live_host.json, or null if absent, or the string 'CORRUPT'
 *   syncVerified,    true | false | null(unknown) — did the pull complete and verify?
 *   lease,           { holder } | null(free) | 'UNAVAILABLE'(offline / remote unreachable)
 *   observation,     { token, firstSeenLocalMs } | null — this machine's own prior sighting
 *   nowLocalMs,      this machine's clock
 *   policy,          from policy()
 * }
 *
 * Returns { verdict, enforced, reason, named{}, overrideCost, overridable }.
 */
function decide(input) {
  const pol = input.policy || policy();
  const named = {};
  const lease = input.lease;
  const online = lease !== 'UNAVAILABLE';
  named.online = online;

  // Layer 1. OWNERSHIP is decided by the lease whenever the remote is reachable, and by the file
  // only when it is not. The lease outranks the file in both directions — including the case that
  // is easy to miss and that this module got wrong on its first pass: a FOREIGN lease standing
  // over a file that says CLOSED. That combination means the other host took the lease and its
  // close never published, so the file's CLOSED is the stale reading, not the lease.
  if (online) {
    if (lease === null || lease === undefined) {
      return result(VERDICTS.PROCEED, true,
        'the remote lease is free: taken atomically by this host', named, { via: 'lease' });
    }
    const holder = lease && lease.holder;
    if (holder && holder === input.selfId) {
      return result(VERDICTS.PROCEED_RECLAIM, true,
        "the remote lease is already this host's", named, { via: 'lease' });
    }
    // A foreign lease exists. Whether it may be BROKEN is a liveness question, and liveness is
    // evidence rather than enforcement — so nothing below this line is `enforced`.
    named.leaseHolder = holder || '(unnamed)';
    named.ownerFrom = 'lease';
    if (input.claim && input.claim !== 'CORRUPT' && input.claim.state === 'CLOSED') {
      named.leaseFileDisagree =
        'the remote lease is held by another host while the synced file says CLOSED: the close '
        + 'never published, so the file is the stale reading and the lease is not';
    }
    return foreignLive(input, pol, named);
  }

  if (input.claim === 'CORRUPT') {
    named.absence = 'CORRUPT';
    return result(VERDICTS.ASK_INDETERMINATE, false,
      'live_host.json is present but unreadable, so nothing about the other host is known', named);
  }

  const claim = input.claim ?? null;
  const abs = absenceClass(claim, input.syncVerified);
  named.absence = abs;
  named.syncVerified = input.syncVerified ?? null;

  if (claim === null) {
    if (abs === ABSENCE.NEVER_INSTALLED) {
      return result(VERDICTS.PROCEED, false,
        'no host has ever claimed this house, and the sync that would have carried a claim is verified complete',
        named);
    }
    return result(VERDICTS.ASK_INDETERMINATE, false,
      'no live_host.json AND no verified sync: an absent claim and an unarrived claim look identical, '
      + "and only the sync's own completion record separates them", named);
  }

  const side = whose(claim, input.selfId);
  named.holder = (claim.holder && claim.holder.host_label)
    || (claim.holder && claim.holder.install_id) || '(unnamed)';
  named.side = side;
  named.leaseSeq = claim.lease_seq ?? null;

  if (side === 'UNKNOWN') {
    return result(VERDICTS.ASK_INDETERMINATE, false,
      "the claim names no install id, so this host cannot tell its own leftover from another machine's",
      named);
  }

  if (claim.state === 'CLOSED') {
    named.cleanClose = !!(claim.closed && claim.closed.clean === true);
    // NOT enforced, and this is the case the enumeration turned up: a CLOSED record is only as
    // fresh as the last successful publish. Offline, `CLOSED` is a claim about the past.
    return result(VERDICTS.PROCEED, false,
      named.cleanClose
        ? 'the last host closed cleanly'
        : 'the last host recorded a close, but not a clean one',
      named, {
        caveat: online ? null
          : 'read offline: a CLOSED record is only as current as the last publish that arrived, so '
            + 'this is evidence about the past, not a statement about now',
      });
  }

  if (side === 'SELF') {
    // Our own LIVE record with no live process: the local mutex already excludes a second copy on
    // this machine, so this is a leftover from a crash or a hard power-off.
    return result(VERDICTS.PROCEED_RECLAIM, false,
      "this host's own LIVE record is still standing with no local instance: the local mutex "
      + 'already excludes a second copy here, so this is our own leftover', named);
  }

  return foreignLive(input, pol, named);
}

/**
 * A foreign host owns the house and the only open question is whether it is still alive. This is
 * where a clock would have been, and is not: the decision comes from `liveness()`, which uses only
 * this machine's own clock, and the wall-clock reading is carried alongside as advice.
 */
function foreignLive(input, pol, named) {
  const claim = (input.claim && input.claim !== 'CORRUPT') ? input.claim : null;
  if (!named.holder) {
    named.holder = (claim && claim.holder && claim.holder.host_label)
      || (claim && claim.holder && claim.holder.install_id)
      || named.leaseHolder || '(unnamed)';
  }
  const live = liveness(claim, input.observation, input.nowLocalMs, pol);
  const wall = wallClockAge(claim, input.nowLocalMs);
  named.liveness = live.state;
  named.observedForMs = live.observedForMs;
  named.wallClockAgeMs = wall.ageMs;
  named.wallClockAdvisoryOnly = true;
  if (wall.skewSuspected) named.clockSkew = wall.note;

  // Skew is visible exactly when the two readings disagree, and it is reported rather than resolved.
  if (wall.ageMs !== null && live.state === LIVENESS.UNCHANGED && wall.ageMs < pol.staleAfterMs) {
    named.readingsDisagree =
      `watched unchanged for ${live.observedForMs}ms on this clock, but the other host's own timestamp `
      + `says ${wall.ageMs}ms: the clocks disagree and the observed reading is the one used`;
  }

  switch (live.state) {
    case LIVENESS.ADVANCING:
      return result(VERDICTS.REFUSE_FOREIGN_LIVE, false,
        `${named.holder} is live: its heartbeat advanced under this machine's own observation`, named);
    case LIVENESS.UNCHANGED:
      return result(VERDICTS.ASK_FOREIGN_STALE, false,
        `${named.holder} still holds the claim, and its heartbeat has not moved in `
        + `${live.observedForMs}ms of this machine's own clock (stale after ${pol.staleAfterMs}ms). `
        + 'Stale is not the same as gone.', named);
    case LIVENESS.NEVER_STARTED:
      return result(VERDICTS.ASK_INDETERMINATE, false,
        `${named.holder} claims the house and its heartbeat writer started but never wrote a beat. `
        + 'That is a broken writer, not an idle machine, and it must not be read as maximum staleness.',
        named);
    case LIVENESS.UNOBSERVED:
    default:
      return result(VERDICTS.ASK_INDETERMINATE, false,
        `${named.holder} holds the claim and this machine has only one sample of its heartbeat. `
        + "One sample cannot tell live from stale without trusting the other host's clock. "
        + `Wait ${pol.staleAfterMs}ms for a clock-free answer, or override.`, named);
  }
}

/**
 * The row an override writes. This is the whole of what makes the split falsifier checkable: a
 * double-live WITHOUT one of these is the silent failure (F2); a double-live WITH one is a choice
 * the keeper made, and the record says so.
 */
function forcedRecord({ byInstallId, byLabel, atIso, decision }) {
  if (!byInstallId) throw new Error('a forced record with no author is not a record');
  if (!atIso) throw new Error('a forced record with no time is not a record');
  if (!decision || !decision.verdict) throw new Error('a forced record must carry the decision it stepped over');
  return {
    by: { install_id: byInstallId, host_label: byLabel ?? null },
    at: atIso,
    stepped_over: {
      verdict: decision.verdict,
      reason: decision.reason,
      enforced: decision.enforced,
      named: decision.named,
    },
  };
}

module.exports = {
  VERDICTS, ABSENCE, LIVENESS, OVERRIDE_COST, MISSES_TOLERATED,
  DEFAULT_PUBLISH_MS, DEFAULT_LOCAL_BEAT_MS,
  policy, staleAfterMs, whose, identityHazard, absenceClass, liveness, wallClockAge,
  decide, forcedRecord,
};
