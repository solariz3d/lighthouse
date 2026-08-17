// UserPromptSubmit hook — the ambient board (Consonance AUTONOMY.md, Layer 1).
//
// WHY THIS EXISTS. Measured on the live board 2026-07-25: in six hours a sibling
// pane wrote 199 assistant turns of real work, and the Orchestrator called
// read_board exactly zero times. The pipe was built; nothing arrived. Same shape
// as the night table (crons knocking on a dark house) and the beacon (a clock in
// view, six days read as twelve hours). Both were fixed the same way, and so is
// this: STOP OFFERING, START ARRIVING. The digest is stapled into every turn
// rather than sitting behind a tool the reader has no reason to think to call.
//
// LAWS IT KEEPS (each one paid for by an earlier failure):
//   · Facts, no verdicts — same as the gauges and the sky. Never "B is
//     productive," never "you should look." A verdict makes the program the
//     judge, which is the thing it exists not to be.
//   · Deltas, not state — the beacon's lesson was that the failure axis is
//     distance-to-a-past-event. Here it is change-since-I-last-looked, so the
//     load-bearing field is "+N since your last turn": a subtraction from a
//     number in view, not a memory retrieval.
//   · EXCHANGES, not board entries — a tool result is a type:"user" entry and a
//     tool call a type:"assistant" entry; extract_turn drops blocks without
//     text, but an assistant turn that narrates WHILE calling a tool keeps its
//     text and posts. One exchange with five narrated calls becomes five board
//     entries. Measured: 50 real prompts rendered as 210 assistant entries.
//     Counting user-role entries recovers the honest unit (47 vs 50) for free.
//   · Silent when there is nothing to say.
//   · Never report the reader to itself — own-pane entries are dropped by
//     session_id.
//   · Defensive: never throws, never blocks a turn, always exits 0.
//
// Node, not Rust, deliberately: this needs no cargo build, no reinstall, and no
// desktop — it runs against the live board the night it is written.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
// The blind window — a global, fail-closed file marker. See blind.js for why it is a file and
// not an env var, and why an unreadable marker mutes rather than passes.
const { blindState, declareLine, clearBlind } = require('./blind.js');

const MAX_TAIL_BYTES = 2 * 1024 * 1024; // enough to reach local midnight in practice
const TOPIC_CHARS = 52;
const MIN_SAID_CHARS = 60; // below this an assistant entry is usually tool narration, not a report
const BURST_THRESHOLD = 20; // entries/second/pane above which it's a replay, not a conversation

// Working set — which files a pane has its hands in.
//
// WHY. 2026-07-24, two panes edited the same repo for four hours. The board told
// Main what the sibling SAID; nothing told it what the sibling was TOUCHING, so
// collision avoidance got hand-rolled out of Get-Item mtimes and a process list,
// and a refactor still landed 35 seconds after a build off the same files. The
// board cannot answer this — extract_turn keeps text blocks, and a file edit is
// a tool_use block, so the one fact that prevents a collision is exactly the one
// the board drops. The pane's own transcript still has it.
//
// Read only a tail, only for panes that moved recently: an idle pane's last file
// is not a collision risk, and this must stay inside the hook's budget.
const FILE_TAIL_BYTES = 256 * 1024;
const FILES_SHOWN = 3;
const FILES_ACTIVE_MS = 30 * 60 * 1000;
const FILES_MAX_PANES = 4; // the standing roster; a bound so cost cannot run away

// A→ALPHA, B→BRAVO, … The callsign is not a separate identity: it is how the
// pane's LETTER is said out loud.
//
// ALPHA was originally skipped, on the reasoning that it reads as "the lead" and
// competes with MAIN. It doesn't — MAIN is called MAIN and never draws from the
// letter pool, so ALPHA collides with nothing. What skipping it did cause was a
// permanent off-by-one: the UI hands the first sibling the letter A (term.js), a
// pull targets that letter (main.rs: "pulls target a letter, never a uuid"), and
// the digest would have called the same pane BRAVO. Being told about BRAVO and
// having to type A is worse than the collision that was being avoided.
const NATO = [
  'ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL',
  'INDIA', 'JULIETT', 'KILO', 'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA',
  'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY', 'XRAY',
  'YANKEE', 'ZULU',
];

/** "A" → ALPHA, "C" → CHARLIE, "A2" → ALPHA-2. Anything unrecognised is left alone. */
function callsign(letter) {
  const m = /^([A-Z])(\d*)$/.exec(String(letter || '').toUpperCase());
  if (!m) return null;
  const word = NATO[m[1].charCodeAt(0) - 65];
  if (!word) return null;
  return m[2] ? `${word}-${m[2]}` : word;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The Orchestrator's fixed session id (src-tauri/src/main.rs, MAIN_SID — it is
// constant precisely so Main can --resume itself). It carries its own callsign
// and must never be handed a sibling's: seen from a sibling's pane, Main is
// still Main.
const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';

function emit(line) {
  if (line) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: line,
      },
    }));
  }
  process.exit(0);
}

// Stream, not readFileSync(0). On Windows a piped fd 0 throws EAGAIN, and the
// catch swallowed it into {} — which meant no session_id (so the reader reported
// its OWN turns back to itself) and no cwd (so the instances-dir guard passed
// everywhere). Both of the first test run's failures were this one line.
function withStdin(cb) {
  let data = '';
  let done = false;
  let timer = null;
  const finish = () => {
    if (done) return;
    done = true;
    if (timer) clearTimeout(timer);
    let parsed = {};
    try { parsed = JSON.parse(data.replace(/^﻿/, '')); } catch (_) {}
    cb(parsed);
  };
  try {
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (d) => { data += d; });
    process.stdin.on('end', finish);
    process.stdin.on('error', finish);
    timer = setTimeout(finish, 2000); // never hang a turn; hook budget is 10s
  } catch (_) {
    finish();
  }
}

function readJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
  } catch (_) {
    return fallback;
  }
}

// Write-then-rename, so a half-written state file can never be read by the pane
// that runs this hook a millisecond later.
function writeJsonAtomic(p, obj) {
  try {
    const tmp = `${p}.tmp${process.pid}`;
    fs.writeFileSync(tmp, JSON.stringify(obj), 'utf8');
    fs.renameSync(tmp, p);
  } catch (_) { /* a lost watermark costs one turn's delta, never a turn */ }
}

/** Coarse human span. Days first — the axis that actually gets misjudged. */
function span(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 1) return `${Math.max(0, Math.floor(ms / 1000))}s`;
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d) return `${d}d ${h % 24}h`;
  if (h) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

/** Read only the last MAX_TAIL_BYTES; board.jsonl is 14 MB and grows forever. */
function tailLines(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const size = fs.fstatSync(fd).size;
    const len = Math.min(size, MAX_TAIL_BYTES);
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, size - len);
    const lines = buf.toString('utf8').split('\n');
    // The first line is almost certainly a fragment of an entry that began
    // before the window — drop it rather than fail to parse it.
    if (size > len) lines.shift();
    return { lines, truncated: size > len };
  } catch (_) {
    return { lines: [], truncated: false };
  } finally {
    if (fd !== undefined) { try { fs.closeSync(fd); } catch (_) {} }
  }
}

/**
 * A pane's transcript, found by session id alone. Claude Code files transcripts
 * under a directory named for the pane's cwd, which the board never records —
 * so scan the project dirs rather than trying to reconstruct the encoding, which
 * would silently return nothing the day the encoding changes.
 */
function findTranscript(projectsDir, paneId) {
  try {
    for (const d of fs.readdirSync(projectsDir)) {
      const p = path.join(projectsDir, d, `${paneId}.jsonl`);
      if (fs.existsSync(p)) return p;
    }
  } catch (_) { /* no projects dir on this bed — the digest simply says less */ }
  return null;
}

/**
 * The files a pane most recently had open, newest first. Regex over a tail rather
 * than a JSON parse per line: the tail is 256 KB of a file that can be 4 MB, the
 * only field wanted is file_path, and a malformed line must cost nothing.
 */
/**
 * An absolute path shortened to something scannable, anchored on the project
 * rather than on a fixed segment count. Plain "last three segments" splits one
 * project across two apparent roots — Desktop/blackbox/CHANGELOG.md next to
 * blackbox/ui/index.html — and the whole point of this line is seeing at a glance
 * that two panes are in the same place.
 */
function shortPath(full, home) {
  let p = full.replace(/\\/g, '/');
  const h = home.replace(/\\/g, '/');
  if (p.toLowerCase().startsWith(`${h.toLowerCase()}/`)) p = p.slice(h.length + 1);
  const segs = p.split('/').filter(Boolean);
  // shed the container dirs that carry no information about WHICH work this is
  while (segs.length > 1 && /^(desktop|documents|downloads|source|repos|projects|[a-z]:)$/i.test(segs[0])) {
    segs.shift();
  }
  return segs.slice(-3).join('/');
}

function recentFiles(transcriptPath, home) {
  let fd;
  try {
    fd = fs.openSync(transcriptPath, 'r');
    const size = fs.fstatSync(fd).size;
    const len = Math.min(size, FILE_TAIL_BYTES);
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, size - len);
    const text = buf.toString('utf8');
    const out = [];
    const seenPath = new Set();
    // newest last in the file, so walk the matches backwards
    const hits = [...text.matchAll(/"file_path"\s*:\s*"((?:[^"\\]|\\.)*)"/g)];
    for (let i = hits.length - 1; i >= 0 && out.length < FILES_SHOWN; i--) {
      let full;
      try { full = JSON.parse(`"${hits[i][1]}"`); } catch (_) { continue; }
      const short = shortPath(full, home);
      if (!short || seenPath.has(short)) continue;
      seenPath.add(short);
      out.push(short);
    }
    return out;
  } catch (_) {
    return [];
  } finally {
    if (fd !== undefined) { try { fs.closeSync(fd); } catch (_) {} }
  }
}

function underDir(child, parent) {
  try {
    const rel = path.relative(path.resolve(parent), path.resolve(child));
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
  } catch (_) {
    return false;
  }
}

function main(input) {
  const sessionId = String(input.session_id || '');
  const cwd = String(input.cwd || process.cwd());

  const home = process.env.USERPROFILE || os.homedir();
  const cfg = readJson(path.join(home, '.consonance.json'), {});
  // Test seams, same convention as dream-watch.js:249 and tools/tell-index.js. Added 2026-07-27
  // for a specific reason, not for symmetry: without them this hook cannot be run end to end
  // against a fixture, so the dream-gate suite could only check that its gate EXISTS in the
  // source and not that it WORKS. Bravo's falsification found two ways to satisfy a textual
  // check with a dead gate — a guard left inside a block comment, and a real guard inside a
  // never-called function — and this hook is the one the gate exists for: it is what staples
  // the live committee board onto a prompt. A hook that cannot be exercised cannot be trusted
  // to be gated.
  const envOverride = (n) => (process.env[n] && String(process.env[n]).trim() ? String(process.env[n]).trim() : null);
  const dataDir = envOverride('CONSONANCE_DATA') || cfg.data_dir || path.join(home, '.consonance');
  const instancesDir = envOverride('CONSONANCE_INSTANCES') || cfg.instances_dir || path.join(home, 'claude-instances');

  // Safe to install globally: outside a Consonance instance there is no board to
  // report and the hook says nothing at all.
  if (!underDir(cwd, instancesDir)) emit(null);

  const boardPath = path.join(dataDir, 'board.jsonl');
  if (!fs.existsSync(boardPath)) emit(null);

  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const dayStart = midnight.getTime();

  const statePath = path.join(dataDir, 'digest_state.json');
  const state = readJson(statePath, {});
  const names = state.names && typeof state.names === 'object' ? state.names : {};
  const seenAll = state.seen && typeof state.seen === 'object' ? state.seen : {};
  const seen = seenAll[sessionId] && typeof seenAll[sessionId] === 'object'
    ? seenAll[sessionId] : null; // null on the very first run — no bogus "+N"

  const { lines, truncated } = tailLines(boardPath);

  // Pass 1 — parse, and count entries per (pane, wall-clock second).
  //
  // REPLAY BURSTS. board_push stamps ts at PUSH time, not event time, and the
  // tailer re-reads a transcript from the top when a pane resumes. So a resume
  // dumps the pane's entire history onto the board stamped "now". Measured
  // 2026-07-25: two bursts of 556 and 546 entries inside one second each —
  // 1102 of the day's 1479 entries were replay, all from the one pane that had
  // resumed. Left in, the digest would report hundreds of exchanges every time
  // a pane restarts, which is the loudest possible way to be wrong.
  // A narrated turn cannot produce twenty board entries in one second; a replay
  // produces hundreds. The gap is three orders of magnitude, so the threshold
  // is not delicate. (Proper fix is Rust-side: carry the transcript's own
  // timestamp into BoardEntry. See AUTONOMY.md.)
  const parsed = [];
  const perSecond = new Map();
  let earliest = Infinity;

  for (const raw of lines) {
    if (!raw) continue;
    let e;
    try { e = JSON.parse(raw); } catch (_) { continue; }
    const ts = Number(e.ts);
    if (!ts) continue;
    if (ts < earliest) earliest = ts;
    if (ts < dayStart) continue;
    const pane = String(e.pane || '');
    if (!UUID_RE.test(pane)) continue;   // gate/dyad/main are events, not instances
    if (pane === sessionId) continue;    // never report the reader to itself
    const key = `${pane}@${Math.floor(ts / 1000)}`;
    perSecond.set(key, (perSecond.get(key) || 0) + 1);
    parsed.push({ pane, ts, key, role: e.role, text: String(e.text || '') });
  }

  // Slash commands, their stdout, caveats, system reminders and this hook's own
  // output all arrive as string-content user entries. They are not exchanges.
  const SYNTHETIC = /^(<(local-command|command-name|command-message|command-args|command-stdout|system-reminder)|Caveat:|\[pulse\]|\[panes\])/;

  const panes = new Map();
  for (const e of parsed) {
    if (perSecond.get(e.key) > BURST_THRESHOLD) continue; // replayed history
    let p = panes.get(e.pane);
    if (!p) { p = { exch: 0, fresh: 0, last: 0, task: '', said: '' }; panes.set(e.pane, p); }
    if (e.ts > p.last) p.last = e.ts;
    const text = e.text.replace(/\s+/g, ' ').trim();
    if (e.role === 'user') {
      if (SYNTHETIC.test(text)) continue;
      // The honest unit. Assistant entries multiply with narrated tool calls:
      // 50 real prompts rendered as 210 assistant entries, measured.
      p.exch += 1;
      p.task = text;
      if (seen && e.ts > (Number(seen[e.pane]) || 0)) p.fresh += 1;
    } else if (e.role === 'assistant') {
      // The pane's own latest word — the half that was actually invisible. The
      // chair's prompt he already knows; the 199 assistant turns nobody read are
      // the reason this hook exists.
      //
      // Prefer a substantive line: narrated tool calls leave fragments ("Now let
      // me check the bounds") as the most recent entry, which says nothing about
      // where the work stands. Take the newest reply of real length, and fall
      // back to the newest of any length rather than showing nothing.
      if (text.length >= MIN_SAID_CHARS || !p.said) p.said = text;
    }
  }

  if (panes.size === 0) emit(null);

  // The callsign comes from the pane's LETTER, which the backend assigns once at
  // birth and never releases (data_dir/letters.json). Deriving a name here from
  // arrival order instead was the bug: the digest's ordering had nothing to do
  // with the letter on the tab, so the pane the chair sees as A could be named
  // anything, and the name he was told was not the name he addresses it by.
  const letters = readJson(path.join(dataDir, 'letters.json'), {});
  const taken = new Set(Object.values(names));
  // Fallback for a pane with no registered letter (an older build, or one created
  // before letters shipped). Still never recycled.
  const nextName = () => {
    for (const n of NATO) if (!taken.has(n)) return n;
    for (let gen = 2; gen < 99; gen++) {
      for (const n of NATO) {
        const c = `${n}-${gen}`;
        if (!taken.has(c)) return c;
      }
    }
    return 'UNNAMED';
  };
  for (const pane of [...panes.keys()].sort((a, b) => panes.get(a).last - panes.get(b).last)) {
    if (pane === MAIN_SID) { names[pane] = 'MAIN'; continue; }
    const fromLetter = callsign(letters[pane]);
    // A letter is authoritative even over a name already stored: if the two ever
    // disagree, the surface the chair types into wins.
    if (fromLetter) { names[pane] = fromLetter; taken.add(fromLetter); continue; }
    if (!names[pane]) { names[pane] = nextName(); taken.add(names[pane]); }
  }

  const now = Date.now();
  const rows = [...panes.entries()].sort((a, b) => b[1].last - a[1].last);
  const width = Math.max(...rows.map(([p]) => (names[p] || '?').length));
  // "≥" when the byte window opened after midnight: the count is a floor, not a
  // total, and a number that quietly understates is worse than one that admits it.
  const floor = truncated && earliest > dayStart ? '≥' : '';

  const clip = (s) => (s.length > TOPIC_CHARS ? `${s.slice(0, TOPIC_CHARS)}…` : s);
  const indent = `\n${' '.repeat(8)}`;

  // Working sets, for the recently-active panes only. Resolved before rendering
  // so the cost is bounded and visible in one place rather than hidden in a map.
  const projectsDir = path.join(home, '.claude', 'projects');
  const working = new Map();
  let scanned = 0;
  for (const [pane, p] of rows) {
    if (scanned >= FILES_MAX_PANES) break;
    if (now - p.last > FILES_ACTIVE_MS) continue;
    scanned += 1;
    const t = findTranscript(projectsDir, pane);
    if (t) {
      const f = recentFiles(t, home);
      if (f.length) working.set(pane, f);
    }
  }

  const body = rows.map(([pane, p]) => {
    const name = names[pane] || '?';
    const idle = now - p.last;
    const age = idle > 5 * 60 * 1000 ? `idle ${span(idle)}` : `last ${span(idle)}`;
    const fresh = p.fresh > 0 ? ` · +${p.fresh} since your last turn` : '';
    const lines = [`${name.padEnd(width)}  ${floor}${p.exch} exch today · ${age}${fresh}`];
    // Labelled by speaker, because the two halves answer different questions:
    // "what was it asked to do" and "where has it got to".
    if (p.task) lines.push(`${' '.repeat(width)}  ↳ asked: ${clip(p.task)}`);
    if (p.said) lines.push(`${' '.repeat(width)}  ↳ ${name.toLowerCase()}: ${clip(p.said)}`);
    // The collision fact. Facts, no verdicts: these are the files it last had
    // open, not "do not edit these" — the reader decides what that means.
    const f = working.get(pane);
    if (f) lines.push(`${' '.repeat(width)}  ↳ hands: ${f.join(', ')}`);
    return lines.join(indent);
  });

  // A run with no session_id (a hand-test, a harness) still reports, but must
  // not persist a watermark under "" — that key belongs to no reader and would
  // grow forever.
  if (sessionId) {
    const watermark = {};
    for (const [pane, p] of panes) watermark[pane] = p.last;
    seenAll[sessionId] = watermark;
  }
  delete seenAll[''];
  writeJsonAtomic(statePath, { names, seen: seenAll });

  // THE BLIND GATE. This broadcast carries every pane's ASSIGNMENT, last utterance and open
  // files to every other pane, unbidden, every turn. Asking a pane to blind itself cannot work
  // against a delivery that lands in its context before it reads the request. Specced by the
  // laptop side in cycle 9 Arm A, built here.
  //
  // Scope, measured rather than assumed: this hook was live on the desktop on 2026-07-25 and
  // NOT during cycles 4–7 — zero `[panes]` blocks in either pane's transcript, ever. It is
  // still live on the laptop. The gate exists because closure by accident is not closure.
  //
  // A muted broadcast still SAYS it was muted. A silent gap is indistinguishable from a hook
  // that crashed; a declared gap is evidence.
  const b = blindState();
  if (b.blind) { emit(declareLine(b, 'pane activity')); return; }
  // emit() exits the process, so the expiry notice and the digest MUST go out in one call — a
  // separate emit() for the notice returned before the [panes] body, muting the room on the very
  // turn (and every turn after) that a window went stale. Fail OPEN and say so (blind.js decision
  // #4), then clear the expired lock so the notice fires once instead of repeating forever; clearing
  // is the documented end of the window's lifecycle, and the chair can re-open one at any time.
  const digest = `[panes] ${body.join('\n        ')}`;
  if (b.reason === 'expired') {
    clearBlind();
    emit(`[blind] window expired — pane activity resumes below.\n        ${digest}`);
    return;
  }
  emit(digest);
}

// THE DREAM GATE. dev/dream/dream_cycle.ps1 sets CONSONANCE_DREAM=1 in the `claude -p`
// environment it spawns. This is the worst offender of the five: the gap-dream is an
// anti-instruction — no task, no question, no deliverable — and this hook would append the live
// committee board to it, chair assignments and all, verbatim task text into the one register
// built to have none. It also writes a per-session watermark, and a one-shot dream session that
// never returns would accrue a `seen` entry forever — the same unbounded growth the `''` key is
// already guarded against below. Exit before withStdin. (Blind-pair review, 2026-07-27.)
if (process.env.CONSONANCE_DREAM) process.exit(0);

withStdin((input) => {
  try { main(input); } catch (_) { process.exit(0); }
});
