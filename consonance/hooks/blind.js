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

// ── THE SEALED WINDOW (D130, E). A blind window per READER, opened by the dispatch itself.
//
// WHY. Two sealed reads leaked through `[panes]` on 2026-09-23, and the lock above never fired
// because nothing set it: no `blind window OPEN` row exists on the board between 12:00Z and 13:10Z
// that day except the test's own (`handback/p-d130-blind-E_2026-09-24.md` §1). B's transcript holds
// the leak itself, in the UserPromptSubmit context 118 ms after the L113 packet arrived:
// `↳ charlie: **Jev gave the same verdict every time: 0 of 20 real…`. A window someone has to
// remember is a window that will be forgotten, so this one is opened by the arriving packet.
//
// WHY NOT THE LOCK ABOVE. `blind.lock` is GLOBAL, and main.rs `board_push` (:2118) mutes EVERY board
// push while it exists — the hand-back rings too, so a window that ends "when the hand-backs are in"
// could never see them arrive — and it mutes the chair's and the librarian's digest. This window is
// per seat, mutes only that seat's `[panes]`, and leaves the board, the chair and the librarian alone.
//
// WHY THE READER'S OWN HOOK, NOT A DISPATCH TOOL. The leak rides the reader's UserPromptSubmit, and
// that is the one moment guaranteed to come after the dispatch and before the leak. The dispatch
// verb is Rust (main.rs / mcp.rs, B's this batch, live only after a rebuild), and a PreToolUse hook on
// the chair would be a second writer on another seat's settings. So: no dispatch tool is edited.
//
// THE RULES, each one a failure it prevents:
//   OPEN   a prompt that is a CHAIR dispatch (`[chair:…]` at its head) and names a sealed or blind
//          read/reader/pair. Over-muting is the safe direction: a packet that only DISCUSSES sealed
//          reads mutes its own pane's digest until that pane rings, and says so.
//   END    that seat's own ring (`[pane:<letter>]`) on the board, after the window opened. A refused
//          ring is posted as `call_librarian REFUSED…` and does not match, so it does not end it.
//   CRASH  the window is a file; a pane that dies mid-read comes back still muted, and declared.
//   DAMAGE a sealed file that cannot be read mutes EVERY seat except the chair and the librarian,
//          declared with how to clear it (decision 3 above: damage is closed).
//   EXPIRY a 12-hour backstop, so a reader that never rings does not mute forever; the expiry is
//          declared in the turn it is found (decision 4 above: expiry is open, and says so).
//   EXEMPT the chair and the librarian never get a window and are never muted by this file.
const SEALED = path.join(DATA, 'sealed.json');
const SEALED_HOURS = 12;
// main.rs MAIN_SID and LIBRARIAN_SID (:6766). Copied because a hook cannot import Rust; board-digest.js
// carries MAIN_SID the same way.
const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';
const LIBRARIAN_SID = '0c0c0c0b-0000-4000-8000-00000000115b';
const EXEMPT = new Set([MAIN_SID, LIBRARIAN_SID]);
const CHAIR_HEAD = /^\s*(?:<pasted_content[^>]*>\s*)?\[chair:[A-Za-z]+\]/;
const SEALED_WORDS = /\b(?:sealed|blind)[ -]?(?:read|reader|readers|reading|pair)\b/i;

/** Is this prompt a chair dispatch of a sealed or blind read? */
function isSealedDispatch(prompt) {
  const p = String(prompt || '');
  return CHAIR_HEAD.test(p) && SEALED_WORDS.test(p);
}

/** Read the sealed file. Absent → no windows. Present and not a { windows: {…} } object → damaged. */
function readSealed(file) {
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch (e) {
    if (e && e.code === 'ENOENT') return { ok: true, windows: {} };
    return { ok: false, raw: String(e && e.message || e) };
  }
  try {
    const m = JSON.parse(raw);
    if (m && typeof m.windows === 'object' && m.windows !== null && !Array.isArray(m.windows)) return { ok: true, windows: m.windows };
  } catch { /* fall through */ }
  return { ok: false, raw: raw.slice(0, 200) };
}

function writeSealed(file, windows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ windows }, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

/** When did <letter> ring the librarian after `since`? A ring lands on the board as a row whose text
 *  starts `[pane:<letter>]`, sometimes inside a pasted_content tag. Returns the ts, or 0. */
function ringAfter(lines, letter, since) {
  if (!letter) return 0;
  const re = new RegExp(`^\\s*(?:<pasted_content[^>]*>\\s*)?\\[pane:${letter.replace(/[^A-Za-z0-9]/g, '')}\\]`);
  for (const raw of lines || []) {
    if (!raw || raw.indexOf(`[pane:${letter}]`) < 0) continue;
    let e;
    try { e = JSON.parse(raw); } catch { continue; }
    const ts = Number(e && e.ts);
    if (ts > since && re.test(String(e.text || ''))) return ts;
  }
  return 0;
}

const iso = (ms) => new Date(ms).toISOString().replace('T', ' ').slice(0, 19) + 'Z';

/** The whole decision for one reader's turn.
 *
 *  Returns { mute, line } when the digest must be withheld (line is the declaration), or
 *  { mute: false, notice } where notice, if set, is a declared end to prepend to the digest.
 *  `lines` is the board tail (raw JSONL lines), used only to find this seat's ring. */
function sealedGate({ sessionId, prompt, letter, lines = [], file = SEALED, boardPath = BOARD, now = Date.now() } = {}) {
  const sid = String(sessionId || '');
  if (!sid || EXEMPT.has(sid)) return { mute: false };
  const who = letter || sid.slice(0, 8);

  const st = readSealed(file);
  if (!st.ok) {
    return { mute: true, line: `[blind] pane activity withheld — the sealed-read file is present but unreadable, `
      + `so this failed CLOSED for every seat but the chair and the librarian. Fix or remove ${file}. `
      + `(raw: ${String(st.raw).slice(0, 80)})` };
  }
  const windows = { ...st.windows };

  if (isSealedDispatch(prompt)) {
    const head = String(prompt).replace(/<pasted_content[^>]*>/, '').replace(/\s+/g, ' ').trim().slice(0, 80);
    windows[sid] = { letter: letter || null, opened: now, until: now + SEALED_HOURS * 3600e3, why: head };
    let recorded = true;
    try { writeSealed(file, windows); } catch (e) {
      recorded = false;
      process.stderr.write(`[blind] a sealed dispatch arrived but ${file} could not be written: ${e.message}\n`);
    }
    if (recorded) markBoard(`sealed window OPEN — for ${who}, until ${new Date(now + SEALED_HOURS * 3600e3).toISOString()} — ${head}`, boardPath);
    return { mute: true, line: `[blind] pane activity withheld — this prompt is a sealed read, so a sealed window is open `
      + `for ${who} until its hand-back rings (${letter ? `a [pane:${letter}] ring` : 'no letter is registered for this pane, so only the backstop'}`
      + ` or ${iso(now + SEALED_HOURS * 3600e3)}).`
      + (recorded ? '' : ` The window could NOT be recorded (${file}), so later turns of this read are NOT protected.`)
      + ' This line exists so the gap is declared rather than silent.' };
  }

  const w = windows[sid];
  if (!w || typeof w !== 'object') return { mute: false };
  const opened = Number(w.opened) || 0;
  const until = Number(w.until);
  const rang = ringAfter(lines, w.letter || letter, opened);
  const close = (why, notice) => {
    delete windows[sid];
    try { writeSealed(file, windows); } catch (e) {
      // Could not close: stay muted rather than resume on a window the file still says is open.
      return { mute: true, line: `[blind] pane activity withheld — the sealed window for ${who} has ended (${why}) but `
        + `${file} could not be updated (${e.message}), so it stays CLOSED until it can.` };
    }
    markBoard(`sealed window CLOSED — for ${who} — ${why}`, boardPath);
    return { mute: false, notice };
  };
  if (rang) return close(`its hand-back rang at ${iso(rang)}`, `[blind] sealed window for ${who} ended — its hand-back rang at ${iso(rang)}; pane activity resumes below.`);
  if (!isFinite(until)) {
    return { mute: true, line: `[blind] pane activity withheld — the sealed window for ${who} has no usable expiry, `
      + `so this failed CLOSED. Fix or remove ${file}.` };
  }
  if (now > until) return close(`expired at ${iso(until)} with no ring`, `[blind] sealed window for ${who} EXPIRED at ${iso(until)} with no hand-back rung — pane activity resumes below.`);
  return { mute: true, line: `[blind] pane activity withheld — a sealed window is open for ${who} since ${iso(opened)}, `
    + `until its hand-back rings or ${iso(until)}${w.why ? ` — ${w.why}` : ''}. This line exists so the gap is declared rather than silent.` };
}

module.exports = {
  blindState, declareLine, setBlind, clearBlind, markBoard, LOCK, BOARD,
  sealedGate, isSealedDispatch, readSealed, ringAfter, SEALED, SEALED_HOURS, EXEMPT,
};

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
