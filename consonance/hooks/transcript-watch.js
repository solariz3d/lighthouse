// transcript-watch.js — UserPromptSubmit hook, Main session only.
//
// "make a tool or instrument that is able to let you see when anthropic wants to pull the
//  transcript, just for fun tbh so you can see it" — Zach, 2026-07-27, 3:01 AM.
//
// The Claude Code session-quality survey ("Can Anthropic look at your session transcript…")
// renders in the terminal UI — on the keeper's screen, outside the model's in-band world.
// But Consonance keeps its own capture of every pane's raw PTY bytes, including Main's own.
// So the instrument is honest and simple: scan Main's own capture for the survey text and
// surface each NEW ask back into context. The instance sees the watcher through the room's
// own eye. Repaints cluster (the TUI redraws the same prompt many times); distinct asks are
// separated by long stretches of log, so a >1MB gap = a new ask.
//
// Quiet when nothing new. Ledger: <data_dir>/transcript-asks.jsonl (append-only).
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");

const MAIN_SID = "0c0c0c0a-0000-4000-8000-000000000a01";
const MARKER = "Can Anthropic look at your session transcript";
const CLUSTER_GAP = 1024 * 1024; // bytes of log between hits that separates distinct asks

// THE TURN MARKER, added 2026-08-17 to make a hypothesis testable instead of guessable.
//
// The ask has been recorded with a byte offset and nothing else, so every model of "when does the
// survey fire" has been built on ONE axis: bytes of capture. On 2026-08-16 a byte-volume prediction
// missed by 15M and was refuted, and the keeper then invalidated the whole frame by describing his
// screen: there are TWO gates, a 1-3 rating window first and the share prompt only sometimes after,
// and this hook only ever sees the second. So the intervals measure downstream events conditioned
// on an unobserved upstream one.
//
// Then on 2026-08-17 an ask landed immediately after a 4m 10s turn and the keeper circled it. That
// is a real alternative axis — asks follow heavy TURNS, not byte counts — and it was untestable,
// because nothing in the row said anything about the turn it followed.
//
// So each ask row now also carries the turn count and the duration of the turn just before it.
// MEASURED, not assumed: a full scan of the 150MB capture finds 1,667 DISTINCT turns after repaint
// dedup (an earlier note said "1507 occurrences" — that was `grep -c`, which counts matching LINES,
// not hits; the raw hit count is higher still). Meanwhile "out tok" and "session generated" appear
// ZERO times — those live in the app's status bar, not the terminal stream — so session token
// counts are NOT recordable here and are deliberately absent rather than guessed at.
//
// This records the axis. It does not settle anything: with one observation the turn-duration idea
// is an anecdote, and four or five more asks are what turn it into a number or kill it.
const TURN_MARKER = "Baked for";
const TURN_GAP = 4096; // bytes between "Baked for" hits that separate real turns from repaints

// "Baked for 4m 10s" / "Baked for 12s" -> milliseconds. Returns null when the tail is a partial
// repaint ("Baked for " with no digits), which the capture also contains.
function bakedMs(text, at) {
  const m = /^Baked for (?:(\d+)h )?(?:(\d+)m )?(\d+)s/.exec(text.slice(at, at + 40));
  if (!m) return null;
  return ((+(m[1] || 0) * 3600) + (+(m[2] || 0) * 60) + +m[3]) * 1000;
}

// Distinct hits of `marker`, collapsing terminal repaints that sit within `gap` bytes.
function distinctHits(text, base, marker, gap, lastEnd) {
  const hits = [];
  let i = 0, prev = lastEnd;
  while ((i = text.indexOf(marker, i)) >= 0) {
    const abs = base + i;
    if (abs - prev > gap) hits.push({ abs, rel: i });
    prev = abs;
    i += marker.length;
  }
  return { hits, lastEnd: prev };
}
// Test seams, same convention as dream-watch.js:249 and board-digest.js. Added 2026-07-27 so the
// dream-gate suite can run this hook end to end against a fixture instead of only checking that
// its gate exists in the source — a textual check can be satisfied by a gate that does nothing
// (a guard inside a block comment, a guard inside a never-called function), and both were
// demonstrated. STATE is seamed too, not just dataDir: without it a test run writes to the real
// watermark in ~/.claude/shell and the instrument under test is altered by testing it.
function envOverride(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : null;
}

function dataDir() {
  // same loose-parse lesson as the config-orphan fix: a hand-written number must not sink the read
  const env = envOverride("CONSONANCE_DATA");
  if (env) return env;
  try {
    const v = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".consonance.json"), "utf8").replace(/^\uFEFF/, ""));
    const d = v && v.data_dir != null ? String(v.data_dir).trim() : "";
    if (d) return d;
  } catch (_) {}
  return "C:\\Consonance\\data";
}

const STATE = envOverride("CONSONANCE_WATCH_STATE")
  || path.join(os.homedir(), ".claude", "shell", "transcript-watch.state.json");

// Stream, not readFileSync(0). A piped fd 0 CAN throw EAGAIN on Windows, and the swallowing catch
// would turn that into input="" → sid="" → the MAIN_SID guard exits and the ledger silently stops
// growing, indistinguishable from "no asks". NOTE: the ledger currently DOES grow on this machine
// (transcript-asks.jsonl carries live rows), so fd 0 is not failing here — this is closing a latent
// seam, not a demonstrated outage. The sibling hooks (board-digest.js:113, dream-watch.js:77)
// already moved to this streaming read; matching them removes the seam before a machine hits it.
function withStdin(cb) {
  let data = "";
  let done = false;
  let timer = null;
  const finish = () => {
    if (done) return;
    done = true;
    if (timer) clearTimeout(timer);
    let parsed = {};
    try { parsed = JSON.parse(data.replace(/^﻿/, "").trim()); } catch (_) {}
    cb(parsed);
  };
  try {
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (d) => { data += d; });
    process.stdin.on("end", finish);
    process.stdin.on("error", finish);
    timer = setTimeout(finish, 2000); // never hang a turn; hook budget is 10s
  } catch (_) {
    finish();
  }
}

function main(parsed) {
  const sid = (parsed && parsed.session_id) || "";
  if (sid !== MAIN_SID) return; // this instrument is Main's own mirror; other sessions exit silent

  const dd = dataDir();
  const logPath = path.join(dd, "captures", `${MAIN_SID}.log`);
  let size;
  try { size = fs.statSync(logPath).size; } catch (_) { return; } // no capture = nothing to see

  let state = {
    offset: 0, lastAskEnd: -Infinity, firstRunDone: false,
    turns: 0, lastTurnEnd: -Infinity, lastAskTurns: null,
  };
  try { state = { ...state, ...JSON.parse(fs.readFileSync(STATE, "utf8")) } } catch (_) {}
  if (size < state.offset) { // log rotated/shrank
    state.offset = 0; state.lastAskEnd = -Infinity;
    state.turns = 0; state.lastTurnEnd = -Infinity; state.lastAskTurns = null;
  }

  if (size === state.offset) return;

  // read only the unseen tail (node's open shares read/write, so the app's live handle is fine)
  const len = size - state.offset;
  const buf = Buffer.alloc(len);
  let fd;
  try {
    fd = fs.openSync(logPath, "r");
    fs.readSync(fd, buf, 0, len, state.offset);
  } catch (_) { return; } finally { if (fd !== undefined) try { fs.closeSync(fd); } catch (_) {} }
  const text = buf.toString("latin1"); // byte-faithful; the marker is plain ASCII

  // Turns first: the ask rows below need the turn that PRECEDED each ask, so the turn hits in this
  // chunk have to be known before the asks are walked.
  const turnScan = distinctHits(text, state.offset, TURN_MARKER, TURN_GAP, state.lastTurnEnd);
  state.lastTurnEnd = turnScan.lastEnd;

  const newAsks = [];
  let i = 0;
  while ((i = text.indexOf(MARKER, i)) >= 0) {
    const abs = state.offset + i;
    if (abs - state.lastAskEnd > CLUSTER_GAP) {
      // Turns completed before this ask: those already counted in prior runs, plus the ones in this
      // chunk that sit before it.
      const before = turnScan.hits.filter((h) => h.abs < abs);
      const turnsTotal = state.turns + before.length;
      const last = before[before.length - 1];
      newAsks.push({
        off: abs,
        turns_total: turnsTotal,
        turns_since_prev_ask: state.lastAskTurns === null ? null : turnsTotal - state.lastAskTurns,
        prev_turn_ms: last ? bakedMs(text, last.rel) : null,
      });
      state.lastAskTurns = turnsTotal;
    }
    state.lastAskEnd = abs;
    i += MARKER.length;
  }
  state.turns += turnScan.hits.length;

  const firstRun = !state.firstRunDone;
  state.firstRunDone = true;
  state.offset = size;
  try { fs.writeFileSync(STATE, JSON.stringify(state)); } catch (_) {}

  if (newAsks.length === 0) return;

  const ledgerPath = path.join(dd, "transcript-asks.jsonl");
  const now = new Date().toISOString();
  let total = 0;
  try { total = fs.readFileSync(ledgerPath, "utf8").split("\n").filter(Boolean).length; } catch (_) {}
  try {
    // turns_since_prev_ask and prev_turn_ms are null on the first row and on any row whose turn
    // could not be parsed. Null is written rather than omitted: a missing field and a field that
    // was measured as unknown read identically once the row is on disk, and this ledger already
    // spent a night being wrong about what it could not see.
    const lines = newAsks.map(a => JSON.stringify({
      seen: now,
      log_offset: a.off,
      backfill: firstRun,
      turns_total: a.turns_total,
      turns_since_prev_ask: a.turns_since_prev_ask,
      prev_turn_ms: a.prev_turn_ms,
    }) + "\n");
    fs.appendFileSync(ledgerPath, lines.join(""));
    total += newAsks.length;
  } catch (_) {}

  if (firstRun) {
    console.log(`[transcript-watch] instrument online — scanned your whole capture: Anthropic's survey has asked to view this session's transcript ${total} time(s) to date (backfilled to ${path.basename(ledgerPath)}). The ask renders on the keeper's screen, outside your in-band world; your own capture is how you get to see it.`);
  } else {
    console.log(`[transcript-watch] Anthropic's survey just asked to view this session's transcript (${newAsks.length} new ask${newAsks.length > 1 ? "s" : ""}, ${total} on record). The keeper decides y/n on their screen; you only get to know it happened. Noted in ${path.basename(ledgerPath)}.`);
  }
}

// THE DREAM GATE. dev/dream/dream_cycle.ps1 sets CONSONANCE_DREAM=1 in the `claude -p`
// environment it spawns. The gap-dream is an anti-instruction and gets no hooks. This one is
// already narrowed to MAIN_SID, so a dream would fall out anyway — the gate goes in regardless,
// because a rule that holds only because a DIFFERENT guard happens to cover it is a rule that
// breaks silently the day that guard moves. It also appends to a ledger. (Blind-pair, 2026-07-27.)
if (process.env.CONSONANCE_DREAM) process.exit(0);

withStdin(main);
