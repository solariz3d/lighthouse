// blind.js — the blind window, as a FILE, global, fail-closed.
//
// SPECCED BY THE LAPTOP SIDE, cycle 9 Arm A (2026-07-28), built here. Their finding, and it
// invalidates work on this machine rather than theirs:
//
//   board-digest.js emits `[panes]` to EVERY pane on EVERY turn, carrying each other pane's
//   `asked:` (the chair's assignment to it), `<name>:` (what it last said) and `hands:` (the
//   files it has open). Unbidden. Nobody has to choose to look.
//
// CORRECTED 2026-07-29, an hour after this file was written. The first version of this comment
// said every desktop blind pair — cycles 4 through 7 — ran under that leak. **That is false on
// this machine and I asserted it without measuring.** The transcripts settle it: `[panes]`
// blocks appear in the Main transcript on 2026-07-25 only (11 of them, genuine broadcasts), and
// **zero times in pane A's or pane B's transcripts, ever.** The hook was live here on the 25th,
// gone by the 27th when cycles 4–7 ran, and is registered in neither settings.json nor
// ~/.claude/shell today.
//
// Adopting the other machine's finding without checking whether the mechanism applied to mine is
// the same wrong-artifact groove that has fired all week — this time with "which machine's
// harness" as the artifact. It is on the record in commit a1def8e, which cannot be edited, so it
// is corrected here where a reader will actually hit it.
//
// WHAT SURVIVES, and why this file still earns its place: the channel is REAL, it ran here for
// at least one day, nothing prevents its re-registration, and it remains live on the laptop.
// A gate against a leak that is currently closed is worth having precisely because closure by
// accident is not closure. Asking a pane to blind itself — what cycle 7 did — cannot work
// against a channel that delivers a sibling's assignment into its context before it reads the
// request, whether or not that channel happened to be on.
// Arm A survived only because it had no human detector: PROGRAMS DO NOT READ THE HOOK. Choosing
// a program scorer bought immunity to a leak channel nobody had registered.
//
// FOUR DESIGN DECISIONS, all theirs, and each one is load-bearing:
//
//   1. A FILE, not an environment variable. A blind window spans independently spawned panes; a
//      variable set in one process cannot bind a pane launched later by a different parent.
//   2. GLOBAL, not per-pane. Their words: "the surface is bigger than anyone models — I wasn't
//      on anybody's list." A per-pane opt-in only covers the panes someone remembered.
//   3. UNREADABLE MARKER → FAIL CLOSED AND MUTE. A corrupt lock during a blind window must not
//      leak. Absence is open; damage is closed. Those are different and the difference matters.
//   4. EXPIRED MARKER → FAIL OPEN AND SAY SO. A stale lock must not silently mute the room
//      forever, and its expiry has to be visible rather than inferred.
//
// AND THE FIFTH, which is the one that makes it auditable: EVERY MUTE DECLARES ITSELF. A silent
// gap is indistinguishable from a hook that crashed; a declared gap is evidence. So a muted
// broadcast still emits a line saying it was muted, why, and until when — the same rule the
// quiet phase follows, and the same reason: withholding is permitted here, misrepresenting the
// record is not.
//
//   const { blindState, declareLine } = require('./blind.js');
//   const b = blindState();
//   if (b.blind) { emit(declareLine(b)); return; }
'use strict';

const fs = require('fs');
const path = require('path');

const DATA = process.env.CONSONANCE_DATA || 'C:\\Consonance\\data';
const LOCK = path.join(DATA, 'blind.lock');
const BOARD = path.join(DATA, 'board.jsonl');

/** THE RECORD OF A WINDOW BELONGS TO THE TOGGLE, NOT TO TRAFFIC OR TO A PROCESS.
 *
 * `board_push` detects the blind edge inside itself, so it can only record a window that
 * something else happened to push through — and it holds the previous state in a process-global
 * that dies with the app. C measured both holes (`handback/p-blind-rows-C_2026-09-16.md` §4.1,
 * §4.2): a window opened and closed with no push leaves NO row at all, and a lock removed while
 * the app is down never writes CLOSED, so `boundary-check.js` reads UNMEASURED forever.
 *
 * This writer has neither problem by construction: it runs exactly when the lock changes,
 * whatever else is or is not running. It does not REPLACE the app's rows — `blindOverlaps`
 * ignores a second OPEN while one is open and a CLOSED with nothing open, so the two writers
 * coexist and the guard reads one span either way.
 *
 * Best-effort on purpose: the lock is the safety mechanism, so failing to RECORD must never
 * fail to BLIND. It is never silent about it, because a silent gap is the thing being fixed. */
function markBoard(text, boardPath = BOARD) {
  const row = { pane: 'blind', role: 'committee', text, ts: Date.now(), ts_source: 'push' };
  try {
    fs.appendFileSync(boardPath, JSON.stringify(row) + '\n', 'utf8');
    return true;
  } catch (e) {
    process.stderr.write(`[blind] the window changed but the board row could NOT be written to `
      + `${boardPath}: ${e.message}. The window is real and the guard will not see it.\n`);
    return false;
  }
}

/** Read the blind marker.
 *
 *  Returns { blind, reason, until, why, raw }. `reason` is the machine-readable cause and is
 *  always set, because "why am I blind" must never require guessing:
 *
 *    'no-lock'    no file          -> open
 *    'active'     valid, unexpired -> BLIND
 *    'expired'    valid, past due  -> open, and the caller says so
 *    'unreadable' present, corrupt -> BLIND (fail closed)
 */
function blindState(lockPath = LOCK) {
  let raw;
  try {
    raw = fs.readFileSync(lockPath, 'utf8');
  } catch (e) {
    if (e && e.code === 'ENOENT') return { blind: false, reason: 'no-lock' };
    // Present but unreadable — a permissions error, a partial write, a locked handle. This is
    // the case that must not resolve to "carry on": the lock exists, so somebody meant to be
    // blind, and we cannot tell whether the window is still open.
    return { blind: true, reason: 'unreadable', raw: String(e && e.message || e) };
  }

  let m;
  try {
    m = JSON.parse(raw);
  } catch {
    return { blind: true, reason: 'unreadable', raw: raw.slice(0, 200) };
  }

  const until = Date.parse(m && m.until);
  if (!isFinite(until)) {
    // A marker with no usable expiry is corrupt, not eternal. Fail closed rather than treat a
    // missing field as "blind forever" — but do not pretend it parsed.
    return { blind: true, reason: 'unreadable', why: m && m.why, raw: raw.slice(0, 200) };
  }
  if (Date.now() > until) {
    return { blind: false, reason: 'expired', until, why: m.why, by: m.by };
  }
  return { blind: true, reason: 'active', until, why: m.why, by: m.by };
}

/** The line a muted broadcast emits in place of its content.
 *
 *  It is not a courtesy. A hook that goes silent is indistinguishable from a hook that crashed,
 *  and an unexplained absence in a blind window is exactly the thing that makes a null result
 *  unreadable afterwards. This turns the gap into evidence.
 */
function declareLine(state, what = 'pane activity') {
  if (state.reason === 'unreadable') {
    return `[blind] ${what} withheld — the blind marker is present but unreadable, so this ` +
           `failed CLOSED. Fix or remove ${LOCK}. (raw: ${String(state.raw).slice(0, 80)})`;
  }
  const until = state.until ? new Date(state.until).toISOString().replace('T', ' ').slice(0, 19) : '?';
  const why = state.why ? ` — ${state.why}` : '';
  return `[blind] ${what} withheld until ${until}Z${why}. A blind window is open: siblings' ` +
         `assignments, utterances and open files are not delivered. This line exists so the ` +
         `gap is declared rather than silent.`;
}

/** Open a blind window. Deliberately tiny: the chair writes it, anything can read it. */
function setBlind({ minutes = 90, why = '', by = 'chair', lockPath = LOCK, boardPath = BOARD } = {}) {
  const until = new Date(Date.now() + minutes * 60000).toISOString();
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  fs.writeFileSync(lockPath, JSON.stringify({ until, why, by }, null, 2), 'utf8');
  // The lock exists from here. Record it, and never let the recording decide whether it exists.
  markBoard(`blind window OPEN — by ${by}, until ${until}${why ? ` — ${why}` : ''}`, boardPath);
  return { until, why, by };
}

function clearBlind(lockPath = LOCK, boardPath = BOARD) {
  try { fs.unlinkSync(lockPath); } catch { return false; }
  // Only after a lock was actually removed. A close that closed nothing must not look like one.
  // The muted COUNT is not knowable here — only the muting process counts — so it is named as
  // absent rather than invented. `blindOverlaps` needs the phrase and the timestamp, not the count.
  markBoard('blind window CLOSED — muted count unknown to the lock\'s producer', boardPath);
  return true;
}

module.exports = { blindState, declareLine, setBlind, clearBlind, markBoard, LOCK, BOARD };

if (require.main === module) {
  const cmd = process.argv[2];
  if (cmd === 'set') {
    const mins = parseInt(process.argv[3], 10) || 90;
    const why = process.argv.slice(4).join(' ');
    const r = setBlind({ minutes: mins, why });
    console.log(`blind window open until ${r.until}${why ? ' — ' + why : ''}`);
  } else if (cmd === 'clear') {
    console.log(clearBlind() ? 'blind window closed' : 'no blind window to close');
  } else {
    const s = blindState();
    console.log(JSON.stringify(s, null, 2));
    console.log(s.blind ? '\n' + declareLine(s) : `\nnot blind (${s.reason})`);
  }
}
