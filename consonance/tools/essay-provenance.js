#!/usr/bin/env node
'use strict';
// essay-provenance.js — who contributed what to essay/, compiled from the record rather than
// from anyone's memory.
//
// THE CONCERN THIS ANSWERS, in the keeper's words, 2026-09-08 06:34: "it gets exponentially
// harder to do the methodology report once we do this, someone has to keep track of the turns and
// where they are going." He is right about the difficulty. The answer is that NOBODY TRACKS IT BY
// HAND. Four ledgers already record every move without anyone choosing to, and what was missing
// was the compiler. This is the compiler.
//
//   git log --name-only -- essay/   what landed, by path, with the author's own trailers
//   essay/METHOD.md                 the log-keeping seat's dated entries
//   data/board.jsonl                rows naming an essay path, written when a message ARRIVES
//   data/lap.jsonl                  which lap named which essay path, and who held the baton
//
// THE REPORT'S CONTRIBUTION TABLE IS THIS OUTPUT, pasted whole with the command beside it and
// recompiled at each milestone. It is never patched by hand: a hand-edited table is a copy that
// outranks its master, which is maintenance law 1's telephone game applied to a report about
// method. The falsifier that comes with it is the librarian's — A CONTRIBUTION THIS TABLE CANNOT
// SHOW MEANS THE LOOP WAS BYPASSED — and it binds the chair before it binds anyone else.
//
// ── WHY TWO TABLES AND NOT ONE ───────────────────────────────────────────────────────────────
//
// The packet asked for one table and gave permission to refuse if the four sources cannot be
// reconciled without inventing a join key. They half can, and the seam is worth printing:
//
//   METHOD entry -> commit    EXACT. Derived from git's own diff of essay/METHOD.md: the commit
//                             that ADDED a `## ` heading owns that entry. Not a guess, not a date
//                             match — the heading's introducing commit, read out of the history.
//   board row -> commit       EXACT ONLY WHEN THE ROW'S TEXT CARRIES THE SHA, which seats do write
//                             ("committed at 3322e54, pushed") but are not obliged to. Measured on
//                             the live board 2026-09-08 07:05: 4 of 17 unique essay-naming rows carry a
//                             sha that is an essay commit — a figure that MOVES as the board grows,
//                             so re-derive it from this tool's own COUNTS block rather than quoting
//                             this line. Nothing else links a row to a commit.
//   lap row -> commit         NONE. A lap row's `head` is the HEAD AT THE TIME THE ROW WAS
//                             WRITTEN, not the commit that landed the work; joining on it would
//                             attribute every landing to whatever was already in the tree.
//
// So a nearest-in-time join is the fabrication on offer and it is refused by construction and by
// test. What cannot be keyed to an artifact goes in a SECOND table of signals — dispatches that
// never landed, batons that moved and produced nothing — because a row that never landed has no
// path to put in a "what landed" column, and inventing one is how a tidy table starts lying.
//
// ── THE RULINGS. FIVE CASES, FIVE LABELS, AND NO "MISMATCH" BUCKET ───────────────────────────
//
//   LOGGED                    an artifact landed and the same commit wrote its METHOD entry
//   NO-LOG-ENTRY              an artifact landed unlogged, from the thread that KEEPS the log
//   NO-LOG-ENTRY-OTHER-SEAT   an artifact landed unlogged from another thread — which may not
//                             write METHOD.md at all, so the entry is owed by the log-keeper and
//                             this is not the lander's fault (see below)
//   METHOD-NO-ARTIFACT        the log recorded something no path shows
//   BOARD-SHA                 a board row names this commit's sha — the one exact board join
//   BOARD-PATH-ONLY           a board row names this PATH but not the sha: weak, and labelled weak
//   COMMIT-NO-BOARD           no board row names it: it landed off-loop, or by hand
//   BOARD-UNREAD              the board could not be read at all — NOT the same as no row
//   LAP-PATH                  a lap row named one of this commit's paths
//   BOARD-NO-COMMIT           a board row named an essay path that no commit carries
//   LAP-ONLY                  a baton moved over a path nothing else mentions
//   ON-DISK-NOT-COMMITTED     the path EXISTS in the working tree and git cannot see it yet:
//                             not-yet-recorded, which is neither done nor never-started
//   SEAT-CORRECTED            the commit body is wrong about who landed this file, and a verified
//                             correction says so. The commit's own name is NOT replaced (2026-09-08)
//
// THE SPLIT BETWEEN THE TWO UNLOGGED CASES IS THE WHOLE POINT OF THIS FILE. essay/METHOD.md
// belongs to one seat and no other seat may write it. So a librarian landing a read into essay/
// with no METHOD entry has broken no rule — and reporting that as a fault would be a SUCCESS
// REPORTED AS A FAULT, which this room has now shipped twice in one night: carrier-drift calls a
// deliberately deleted file MISSING-FILE, and forget-rate calls the same deletion "1 files left
// the reading path (161,665 bytes)". Two instruments, one intended act, both red. The packet's
// order was: do not build the third. Hence two labels, and a test that they never merge.
//
// ── WHAT THIS CANNOT SEE ─────────────────────────────────────────────────────────────────────
//
// Printed beside the table, not left in this comment, because a falsifier whose limits live only
// in its source is a falsifier nobody applies limits to. Six, of which the first four are the
// packet's and the last two were found while building it:
//
//   1 BLIND WINDOWS      `board_push` mutes every writer while `data/blind.lock` exists. One ran
//                        2026-06-30 -> 2026-08-01 and swallowed 2,473 entries. Board counts are a
//                        FLOOR.
//   2 ONE MACHINE        all four ledgers are machine-local. The desktop's work is invisible here.
//   3 THE SEAT IS PROSE  git's own author is `solariz3d` on every commit in this repo, and the
//                        Co-Authored-By trailer names the MODEL, not the thread. A seat name comes
//                        from a `Seat:` line in the body, which is prose and usually absent —
//                        3 of 30 essay commits carry one on 2026-09-08.
//   4 UNHANDED WORK      work done in a pane and never handed back appears in no ledger at all.
//   5 THE BOARD REPEATS  the live file carries byte-identical re-appended stretches: 6 of 23
//                        essay-naming rows on 2026-09-08. They are merged here and the merge is
//                        counted, because leaving them would inflate every board figure by a third.
//   6 ARRIVAL NAMES THE  a board row's mount is the RECEIVER for an arriving message and the
//     RECEIVER           SPEAKER for a pane's own turn. The packet's "written by mount, and a
//                        sending seat cannot suppress its own row" is right about the row's
//                        EXISTENCE and not about its attribution: on an arrival row the sender is
//                        named only by a `[chair:MAIN]`-style prefix, which the sender types.
//
//   node consonance/tools/essay-provenance.js
//   node consonance/tools/essay-provenance.js --json
//   node consonance/tools/essay-provenance.js --prefix essay/ --no-color

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_PREFIX = 'essay/';
const CORRECTIONS_FILE = 'exo_memory/provenance_corrections.jsonl';
const LOG_FILE = 'METHOD.md';

const normPrefix = (x) => {
  const v = String(x == null || x === '' ? DEFAULT_PREFIX : x);
  return v.endsWith('/') ? v : v + '/';
};

/* ── THE DATA DIR ─────────────────────────────────────────────────────────────────────────────
 * Three tiers, no literal, and no throw at import: this file is required by its own test. The
 * loudness lives in the CLI, which refuses with the reason rather than reading a stranger's disk.
 * Shape taken from actors.js:37 and chain-status.js:261, which is why it is the house shape and
 * not a preference. */
function fromConfig(key) {
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const v = JSON.parse(raw);
    const d = v && v[key] != null ? String(v[key]).trim() : '';
    return d || null;
  } catch (_) { return null; }
}
const DATA_DIR = (process.env.CONSONANCE_DATA || '').trim() || fromConfig('data_dir') || null;

/* ── PARSERS ──────────────────────────────────────────────────────────────────────────────── */

// A `## ` heading at column zero is an entry. `### ` is not, and neither is an indented one
// inside a fenced block — both appear in METHOD.md and counting them would inflate the log.
function parseMethod(text) {
  const out = [];
  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = /^## +(\S.*)$/.exec(lines[i]);
    if (!m) continue;
    const d = /(\d{4}-\d{2}-\d{2})/.exec(m[1]);
    out.push({
      heading: lines[i],
      title: m[1].trim(),
      date: d ? d[1] : null,
      line: i + 1,
      sha: null,
    });
  }
  return out;
}

// Seven to forty hex at a word boundary, and at least one letter in it — otherwise "5,609 words"
// and any seven-digit number become shas and the board joins to nonsense.
function shortShas(text) {
  return [...new Set((String(text).match(/\b[0-9a-f]{7,40}\b/g) || []).filter((s) => /[a-f]/.test(s)))];
}

function essayPaths(text, prefix) {
  const p = prefix || DEFAULT_PREFIX;
  const re = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[A-Za-z0-9_./-]*[A-Za-z0-9_]', 'g');
  return [...new Set(String(text).match(re) || [])].sort();
}

// Whole re-appended stretches exist in the live board. The key is (pane, ts, text): two panes
// saying the same thing in the same millisecond stay two rows, because merging them would be the
// wrong-merge that actors.js refuses for ids — worse than an unmerged pair and harder to see.
function dedupeBoard(rows) {
  const seen = new Set();
  const out = [];
  let dropped = 0;
  for (const r of rows) {
    const k = `${r.pane}\u0000${r.ts}\u0000${r.text}`;
    if (seen.has(k)) { dropped++; continue; }
    seen.add(k);
    out.push(r);
  }
  return { rows: out, dropped };
}

/* ── SOURCE 1: GIT ────────────────────────────────────────────────────────────────────────── */

const RS = '\x1e';
const FS_ = '\x1f';

function readCommits(repoRoot, prefix) {
  const fmt = `${RS}%H${FS_}%h${FS_}%ad${FS_}%at${FS_}%s${FS_}%b${FS_}`;
  const raw = execFileSync('git',
    ['log', '--date=short', `--pretty=format:${fmt}`, '--name-only', '--', prefix],
    { cwd: repoRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const out = [];
  for (const chunk of raw.split(RS)) {
    if (!chunk.trim()) continue;
    const parts = chunk.split(FS_);
    if (parts.length < 7) continue;
    const [full, sha, date, at, subject, body] = parts;
    const paths = parts.slice(6).join(FS_).split(/\r?\n/)
      .map((s) => s.trim()).filter((s) => s.startsWith(prefix));
    const seatLine = (/^ *Seat: *([^.\n]+)/mi.exec(body) || [])[1] || null;
    const session = (/session_[A-Za-z0-9]+/.exec(body) || [])[0] || null;
    out.push({
      full, sha, date, ts: Number(at) * 1000, subject: subject.trim(), body,
      session, seatLine: seatLine ? seatLine.trim() : null,
      paths: [...new Set(paths)].sort(),
    });
  }
  return out;
}

// The commit that ADDED a heading owns that entry. Walked oldest-first so a heading later edited
// keeps its FIRST introduction rather than its last touch.
function readMethodOwners(repoRoot, prefix) {
  const file = prefix + LOG_FILE;
  let raw;
  try {
    raw = execFileSync('git',
      ['log', '--reverse', `--pretty=format:${RS}%h`, '-p', '--', file],
      { cwd: repoRoot, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  } catch (_) { return new Map(); }
  const owners = new Map();
  let sha = null;
  for (const chunk of raw.split(RS)) {
    if (!chunk) continue;
    const nl = chunk.indexOf('\n');
    sha = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
    const body = nl === -1 ? '' : chunk.slice(nl + 1);
    for (const line of body.split(/\r?\n/)) {
      const m = /^\+(## +\S.*)$/.exec(line);
      if (!m) continue;
      const h = m[1].replace(/\s+$/, '');
      if (!owners.has(h)) owners.set(h, sha);
    }
  }
  return owners;
}

/* ── SOURCE 2: THE BOARD ──────────────────────────────────────────────────────────────────── */

// 330 MB on 2026-09-08, so it is streamed and pre-filtered on the raw line before any JSON.parse.
async function readBoard(file, prefix, canonical) {
  const rows = [];
  await new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(file, { encoding: 'utf8' }),
      crlfDelay: Infinity,
    });
    rl.on('line', (line) => {
      if (line.indexOf(prefix) === -1) return;
      let o;
      try { o = JSON.parse(line); } catch (_) { return; }
      if (!o || typeof o.text !== 'string') return;
      const paths = essayPaths(o.text, prefix);
      if (!paths.length) return;
      rows.push({
        pane: o.pane, role: o.role, ts: o.ts, text: o.text, paths,
        shas: shortShas(o.text),
        actor: canonical ? canonical(o.pane) : null,
        prefix: (/^\[([a-z]+):([A-Za-z0-9]+)\]/.exec(o.text) || [])[0] || null,
      });
    });
    rl.on('close', resolve);
    rl.on('error', reject);
  });
  return rows;
}

/* ── SOURCE 3: THE LAP LEDGER ─────────────────────────────────────────────────────────────── */

// MENTION VERSUS USE, and the lap ledger is the one source where the distinction is free. A lap
// row carries a machine-written `paths` ARRAY and a hand-written `note`. Only the array is used
// for the join. The first build of this file also mined the note, and the live ledger immediately
// produced a false LAP-ONLY: L047's note reads "four packets per essay/PROGRAM_BRIEF", abbreviating
// a file that had already landed as `essay/PROGRAM_BRIEF_2026-09-08.md`, so a landing was reported
// as a baton that produced nothing. Note mentions are counted and reported, never joined.
function readLap(file, prefix) {
  const out = [];
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.indexOf(prefix) === -1) continue;
    let o;
    try { o = JSON.parse(line); } catch (_) { continue; }
    const paths = Array.isArray(o.paths)
      ? [...new Set(o.paths.filter((p) => String(p).startsWith(prefix)))].sort() : [];
    const noteMentions = essayPaths(o.note || '', prefix);
    if (!paths.length && !noteMentions.length) continue;
    out.push({
      lap: o.lap, stage: o.stage, chain: o.chain || null, at: o.at,
      holder: o.holder || null, to: o.to || null, by: o.by || null, paths, noteMentions,
    });
  }
  return out;
}

/* ── SOURCE 5: THE CORRECTIONS LEDGER ─────────────────────────────────────────────────────────
 *
 * THE CASE, 2026-09-08. `babe926` is a librarian commit about the two-machine idea. It also
 * carried four files the CHAIR had staged and not yet committed — the two bare essay drafts and
 * their prompts, 266 of its 270 insertions. This tool reads the seat from the commit body, so it
 * attributed four chair artifacts to the librarian, correctly reading a record that is wrong.
 * `babe926` is pushed. It cannot be amended and must not be, so the only repair available is a
 * SECOND record this tool reads.
 *
 * A LEDGER THAT CAN BE WRITTEN BY HAND IS A PLACE TO REWRITE HISTORY POLITELY, and the packet's
 * standing permission was to refuse if no referent rule could be found that a motivated seat
 * cannot satisfy with a plausible pointer. There is one, and it is the only reason this exists:
 *
 *     A CORRECTION IS NEVER BELIEVED. IT IS CHECKED AGAINST A BLOB FROZEN IN THE COMMIT IT
 *     CORRECTS.
 *
 * Four conditions, all machine-checked, all against objects nobody can now rewrite:
 *
 *   1 the sha must be a commit this tool already read, and its diff must contain the corrected
 *     PATH — so a correction cannot reach a commit it does not name;
 *   2 the EVIDENCE must be readable at that sha (`git show <sha>:<evidence>`) — the content as it
 *     stood when the commit landed, not as it stands today;
 *   3 that blob's HEADER must carry the claimed seat on a line that also carries an authorship
 *     marker (`SEAT:`, `placed here by`, `written by`, …). Not "the word appears somewhere";
 *   4 when the evidence is a DIFFERENT file from the one being corrected, its header must NAME
 *     the corrected path — which is how the two prompt files are reachable at all: they carry no
 *     header of their own, and the drafts' headers name them.
 *
 * WHY THAT CANNOT BE FAKED AFTER THE FACT: to steal an artifact a seat would have to have written
 * its own name into the artifact's header BEFORE the commit was pushed, which is indistinguishable
 * from having authored it. WHAT IT DOES NOT DO, and this is the limit, printed rather than buried:
 * it authenticates a correction against the FROZEN RECORD, not against the world. A header that
 * was already false when it was written is inherited, not caught. And a file with no header and
 * nothing naming it — a .pdf, a .png — is UNREACHABLE by correction, which is the right way for
 * this to fail: closed, and out loud.
 *
 * FIRST VERIFIED CORRECTION WINS. A later row over the same (sha, path) is refused as CONFLICTING
 * and printed, never applied. Otherwise the ledger is last-writer-wins, which is the thing the
 * permission-to-refuse was about.
 *
 * The file is JSONL like the board and the lap ledger, with one deviation: lines beginning `#` are
 * skipped, because this is the only one of the five sources written by a hand rather than a
 * machine, and the format has to be legible where it is written. One row:
 *
 *   {"sha","path","seat","evidence"?,"by","at","note"?}
 */
const HEADER_BYTES = 4096;
const correctionKey = (full, p) => String(full) + '\0' + String(p);
const AUTHORSHIP = /(^|[^A-Za-z])(SEAT\s*:|written by|placed here by|placed by|spawned by|filed by|authored by|committed by)/i;

function readCorrections(file) {
  const out = [];
  let n = 0;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    n++;
    try { out.push(JSON.parse(t)); } catch (_) { out.push({ __malformed: t.slice(0, 80) }); }
  }
  return { rows: out, lines: n };
}

// THE ONE DOOR TO GIT FOR EVIDENCE, and it reads the blob AS OF THE SHA — `git show <sha>:<path>`
// — never the working tree. That is the whole property: the working copy of a header can be edited
// by anyone tonight, and the blob at a pushed commit cannot. Extracted and exported so the suite can
// test it against a real repository rather than assert it about a comment.
function gitBlobReader(repoRoot) {
  return (sha, file) => {
    try {
      return execFileSync('git', ['show', `${sha}:${file}`],
        { cwd: repoRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    } catch (_) { return null; }
  };
}

function wholeWord(hay, needle) {
  const esc = String(needle).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z0-9_-])${esc}([^A-Za-z0-9_-]|$)`, 'i').test(hay);
}

// Returns { ok, reason, line, evidence }. `readBlob(sha, path)` is the ONLY door to git here and
// is injected, so the test suite verifies the rule rather than a re-implementation of it. Absent a
// reader every correction is refused: an unverifiable correction and a verified one must never
// produce the same output, which is the silent-absence failure this room keeps re-finding.
function verifyCorrection(row, { commits = [], readBlob = null } = {}) {
  if (row && row.__malformed) return { ok: false, reason: `MALFORMED-ROW: ${row.__malformed}` };
  for (const k of ['sha', 'path', 'seat', 'by', 'at']) {
    if (!row || typeof row[k] !== 'string' || !row[k].trim()) return { ok: false, reason: `MISSING-FIELD: ${k}` };
  }
  const commit = commits.find((c) => shaMatch(row.sha, c.sha) || shaMatch(row.sha, c.full));
  if (!commit) return { ok: false, reason: 'NO-SUCH-COMMIT' };
  if (!commit.paths.includes(row.path)) return { ok: false, reason: 'PATH-NOT-IN-COMMIT' };
  const evidence = (row.evidence && String(row.evidence).trim()) || row.path;
  if (typeof readBlob !== 'function') return { ok: false, reason: 'NO-EVIDENCE-READER' };
  let blob;
  try { blob = readBlob(commit.full || commit.sha, evidence); } catch (_) { blob = null; }
  if (typeof blob !== 'string' || !blob) return { ok: false, reason: `EVIDENCE-NOT-READABLE AT ${row.sha}:${evidence}` };
  const head = blob.slice(0, HEADER_BYTES);
  const line = head.split(/\r?\n/).find((l) => AUTHORSHIP.test(l) && wholeWord(l, row.seat));
  if (!line) return { ok: false, reason: `NO-SEAT-IN-EVIDENCE: "${row.seat}" on no authorship line in ${evidence}` };
  if (evidence !== row.path && head.indexOf(row.path) === -1) {
    return { ok: false, reason: `EVIDENCE-DOES-NOT-NAME-PATH: ${evidence} never names ${row.path}` };
  }
  return { ok: true, reason: null, line: line.trim(), evidence, commit };
}

// Verified in ledger order, and the key is the COMMIT'S OWN full sha rather than what the row
// typed, so an abbreviated and a full form of one sha cannot stand as two corrections of one
// artifact. The first row to pass owns that key; anything later over the same artifact is refused
// as CONFLICTING rather than believed, which is what keeps this from being last-writer-wins.
function verifyCorrections(rows, ctx) {
  const applied = new Map();
  const refused = [];
  for (const row of rows || []) {
    const v = verifyCorrection(row, ctx);
    if (!v.ok) { refused.push({ row, reason: v.reason }); continue; }
    const key = correctionKey(v.commit.full, row.path);
    if (applied.has(key)) { refused.push({ row, reason: 'CONFLICTING — an earlier verified correction already stands' }); continue; }
    applied.set(key, { ...row, evidence: v.evidence, line: v.line });
  }
  return { applied, refused };
}

/* ── PROSE NAMES A PATH LOOSELY, AND THE RESOLUTION IS RULED RATHER THAN GUESSED ──────────────
 *
 * The board has no structured path field, so every board path is prose, and prose abbreviates:
 * the live board says `essay/READER_NOTES` for `essay/READER_NOTES_2026-09-07.md`. Matched
 * exactly, that mention resolves to nothing and the row is reported as a dispatch that never
 * landed — a landing called a failure, which is the one shape this instrument was ordered not to
 * repeat. Matched loosely, two files that merely share a stem get merged, which is worse and
 * quieter.
 *
 * The rule: EXACT first; otherwise a mention that is a prefix of EXACTLY ONE landed path resolves
 * to it and says `unique-prefix`; a prefix of more than one is AMBIGUOUS and resolves to NOTHING,
 * because `essay/A_What_Survives_the_Gap` genuinely does not say whether it means the .html or the
 * .pdf. Both non-exact outcomes are counted and printed, so a reader can overturn the rule instead
 * of inheriting it. */
function resolveMention(mention, landed) {
  if (landed.has(mention)) return { path: mention, via: 'exact' };
  const pre = [...landed].filter((p) => p.startsWith(mention));
  if (pre.length === 1) return { path: pre[0], via: 'unique-prefix' };
  if (pre.length > 1) return { path: null, via: 'ambiguous', candidates: pre };
  return { path: null, via: null };
}

/* ── THE LOG-KEEPER, DERIVED ──────────────────────────────────────────────────────────────── */

// Which thread keeps METHOD.md is read out of the record, never named in this source. A tie, or no
// evidence, returns null and every unlogged artifact is then flagged unqualified — the direction
// that does not flatter. The identifier is the `Claude-Session:` trailer: it names no seat, but it
// separates threads, and it is written far more consistently than the prose `Seat:` line (26 of 30
// essay commits carry one, against 3). It is still written BY the author and not stamped by git,
// which is why blindness 3 stays printed.
function methodKeeper(commits, prefix) {
  const p = prefix || DEFAULT_PREFIX;
  const tally = new Map();
  for (const c of commits || []) {
    if (!c.session) continue;
    if (!c.paths.includes(p + LOG_FILE)) continue;
    tally.set(c.session, (tally.get(c.session) || 0) + 1);
  }
  if (!tally.size) return null;
  const ranked = [...tally].sort((a, b) => b[1] - a[1]);
  if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) return null;
  return ranked[0][0];
}

/* ── RECONCILIATION ───────────────────────────────────────────────────────────────────────── */

function shaMatch(a, b) {
  if (!a || !b) return false;
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  return s.length >= 7 && l.startsWith(s);
}

function reconcile({ commits = [], method = [], board = [], lap = [], available = {}, prefix, onDisk,
  corrections = [], readBlob = null } = {}) {
  // A prefix without its slash makes `p + LOG_FILE` read `essayMETHOD.md`, which matches nothing and
  // would report every artifact unlogged — a silent wrong answer rather than an error.
  const p = normPrefix(prefix);
  const logPath = p + LOG_FILE;
  const have = {
    board: available.board !== false,
    lap: available.lap !== false,
    method: available.method !== false,
  };
  const unread = Object.keys(have).filter((k) => !have[k]);

  const keeper = methodKeeper(commits, p);
  // Verified HERE, never taken pre-verified from a caller: a corrections ledger whose checking is
  // somebody else's job is a corrections ledger with no checking.
  const corr = verifyCorrections(corrections, { commits, readBlob });
  const entriesBySha = new Map();
  for (const e of method) {
    if (!e.sha) continue;
    if (!entriesBySha.has(e.sha)) entriesBySha.set(e.sha, []);
    entriesBySha.get(e.sha).push(e);
  }

  const landedPaths = new Set();
  for (const c of commits) for (const f of c.paths) landedPaths.add(f);

  const fmtEntry = (e) => String(e.heading).replace(/^## +/, '').trim();
  const fmtLog = (es) => (es.length > 1
    ? `${fmtEntry(es[0])} (+${es.length - 1} more)` : fmtEntry(es[0]));

  /* Resolve every board mention ONCE, against the set of paths that actually landed. Rows keep
   * both what they said and what it resolved to, so the table can be checked against the board. */
  const resolution = { exact: 0, prefix: 0, ambiguous: 0, unresolved: 0 };
  const ambiguous = [];
  const boardPathHits = new Set();
  // Keyed by row rather than written INTO the row: reconcile does not mutate its inputs, so calling
  // it twice on one board array cannot carry state from the first call into the second.
  const resolvedBy = new Map();
  if (have.board) {
    for (const r of board) {
      const res = [];
      resolvedBy.set(r, res);
      for (const m of r.paths) {
        const got = resolveMention(m, landedPaths);
        res.push({ mention: m, ...got });
        if (got.via === 'exact') resolution.exact++;
        else if (got.via === 'unique-prefix') resolution.prefix++;
        else if (got.via === 'ambiguous') { resolution.ambiguous++; ambiguous.push({ mention: m, candidates: got.candidates }); }
        else resolution.unresolved++;
        if (got.path) boardPathHits.add(got.path);
      }
    }
  }
  const lapPathHits = new Set(have.lap ? lap.flatMap((r) => r.paths) : []);

  const landed = [];
  const usedCorrections = new Set();
  for (const c of commits) {
    const entries = entriesBySha.get(c.sha) || [];
    const logText = entries.length ? fmtLog(entries) : null;

    // Sha corroboration is a fact about the COMMIT; a path mention is a fact about the PATH. The
    // first build applied both at commit level, so a commit touching eight files printed the same
    // board and lap labels on all eight when the ledgers had named only one of them.
    const bySha = have.board
      && board.some((r) => r.shas.some((s) => shaMatch(s, c.sha) || shaMatch(s, c.full)));
    const axesFor = (f) => {
      const out = [];
      if (!have.board) out.push('BOARD-UNREAD');
      else if (bySha) out.push('BOARD-SHA');
      else if (boardPathHits.has(f)) out.push('BOARD-PATH-ONLY');
      else out.push('COMMIT-NO-BOARD');
      if (have.lap && lapPathHits.has(f)) out.push('LAP-PATH');
      return out;
    };

    const artifacts = c.paths.filter((f) => f !== logPath);
    const seat = c.seatLine ? c.seatLine
      : (c.session ? `thread ${c.session.replace(/^session_/, '').slice(0, 8)}` : 'UNNAMED');

    const base = {
      date: c.date, ts: c.ts, sha: c.sha, full: c.full, subject: c.subject,
      seat, seatNamed: Boolean(c.seatLine), session: c.session,
      seatFrom: null, corrected: null,
    };

    if (!artifacts.length) {
      landed.push({
        ...base,
        path: '(no artifact)',
        log: logText || 'NO LOG ENTRY',
        rulings: ['METHOD-NO-ARTIFACT', ...axesFor(logPath)],
        red: false,
        owed: false,
      });
      continue;
    }

    for (const f of artifacts) {
      let ruling;
      let log;
      let red = false;
      let owed = false;
      // THE CORRECTION IS ADDITIVE, NEVER A REPLACEMENT. `seatFrom` keeps what the commit body
      // said and the row carries SEAT-CORRECTED, because a table that quietly prints the right
      // answer teaches nobody that a capture happened, and the capture is the thing worth seeing.
      const fix = corr.applied.get(correctionKey(c.full, f));
      if (fix) usedCorrections.add(correctionKey(c.full, f));
      if (entries.length) {
        ruling = 'LOGGED';
        log = logText;
      } else if (keeper && c.session && c.session !== keeper) {
        // Another thread. It may not write METHOD.md, so the entry is owed by the log-keeper and
        // this row is not a fault of the seat that landed the file.
        ruling = 'NO-LOG-ENTRY-OTHER-SEAT';
        log = 'NO LOG ENTRY (owed by the log-keeper)';
        owed = true;
      } else {
        ruling = 'NO-LOG-ENTRY';
        log = 'NO LOG ENTRY';
        red = true;
      }
      landed.push({
        ...base,
        path: f,
        seat: fix ? fix.seat : seat,
        seatFrom: fix ? seat : null,
        corrected: fix ? { by: fix.by, at: fix.at, evidence: fix.evidence, line: fix.line, note: fix.note || null } : null,
        log,
        rulings: [ruling, ...axesFor(f), ...(fix ? ['SEAT-CORRECTED'] : [])],
        red,
        owed,
      });
    }
  }

  /* Signals: what named an essay path and never became an artifact. A board row whose paths are
   * all landed is corroboration and lives on the commit side; only a row that names nothing any
   * commit carries is a dispatch that never landed. */
  /* DONE, NOT-YET-RECORDED, AND NEVER-STARTED ARE THREE STATES, AND THIS TOOL READS GIT.
   * A hand-back written into the working tree and not yet committed is INVISIBLE to git log, so
   * without this it lands in table 2 as a dispatch that never landed. Caught live at 07:02 on
   * 2026-09-08: `essay/LIT_2026-09-08.md` had been filed by pane A minutes earlier, existed on
   * disk, and the first build called it never-landed. That is the third state, and it is the whole
   * distinction the packet spent its longest paragraph on. `onDisk` is the set of prefix paths
   * present in the working tree and untracked; absent, the tool falls back to two states and says
   * so by simply never emitting the third label. */
  const disk = onDisk instanceof Set ? onDisk : new Set(onDisk || []);
  // Resolved by the SAME rule as the git side, because prose abbreviates a path whether the file is
  // committed or not, and handling the abbreviation for one and not the other is how two halves of
  // one instrument end up disagreeing. A row naming several paths is labelled if ANY of them is on
  // disk; the row prints its paths, so a reader can see which.
  const diskRuling = (paths, fallback) => (paths.some((f) => {
    const got = resolveMention(f, disk);
    return Boolean(got.path) || got.via === 'ambiguous';
  }) ? 'ON-DISK-NOT-COMMITTED' : fallback);

  const signals = [];
  if (have.board) {
    for (const r of board) {
      const shaHit = r.shas.some((s) => commits.some((c) => shaMatch(s, c.sha) || shaMatch(s, c.full)));
      // An AMBIGUOUS mention names something that landed and merely does not say which file. It is
      // not a dispatch that never landed, so it does not belong in this table.
      const pathHit = (resolvedBy.get(r) || []).some((x) => x.path || x.via === 'ambiguous');
      if (shaHit || pathHit) continue;
      signals.push({
        source: 'board', ruling: diskRuling(r.paths, 'BOARD-NO-COMMIT'), ts: r.ts,
        date: new Date(r.ts).toISOString().slice(0, 10),
        actor: r.actor, pane: r.pane, role: r.role, prefixTag: r.prefix,
        paths: r.paths,
      });
    }
  }
  if (have.lap) {
    for (const r of lap) {
      if (!r.paths.length) continue;   // note mentions only: counted, never joined
      if (r.paths.some((f) => landedPaths.has(f) || boardPathHits.has(f))) continue;
      signals.push({
        source: 'lap', ruling: diskRuling(r.paths, 'LAP-ONLY'), lap: r.lap, stage: r.stage, chain: r.chain,
        ts: r.at, date: new Date(r.at).toISOString().slice(0, 10),
        holder: r.holder, to: r.to, by: r.by, paths: r.paths,
      });
    }
  }
  signals.sort((a, b) => a.ts - b.ts);
  landed.sort((a, b) => a.ts - b.ts || a.path.localeCompare(b.path));

  const counts = {
    commits: commits.length,
    rows: landed.length,
    logged: landed.filter((r) => r.rulings.includes('LOGGED')).length,
    no_log_entry: landed.filter((r) => r.rulings.includes('NO-LOG-ENTRY')).length,
    owed_by_keeper: landed.filter((r) => r.rulings.includes('NO-LOG-ENTRY-OTHER-SEAT')).length,
    method_no_artifact: landed.filter((r) => r.rulings.includes('METHOD-NO-ARTIFACT')).length,
    commit_no_board: landed.filter((r) => r.rulings.includes('COMMIT-NO-BOARD')).length,
    board_sha: landed.filter((r) => r.rulings.includes('BOARD-SHA')).length,
    board_no_commit: signals.filter((r) => r.ruling === 'BOARD-NO-COMMIT').length,
    on_disk_not_committed: signals.filter((r) => r.ruling === 'ON-DISK-NOT-COMMITTED').length,
    lap_only: signals.filter((r) => r.ruling === 'LAP-ONLY').length,
    method_entries: method.length,
    method_entries_owned: method.filter((e) => e.sha).length,
    seat_named: commits.filter((c) => c.seatLine).length,
    session_named: commits.filter((c) => c.session).length,
    board_mentions_exact: resolution.exact,
    board_mentions_unique_prefix: resolution.prefix,
    board_mentions_ambiguous: resolution.ambiguous,
    board_mentions_unresolved: resolution.unresolved,
    lap_note_mentions: have.lap ? lap.reduce((n, r) => n + (r.noteMentions || []).length, 0) : 0,
    corrections_offered: (corrections || []).length,
    corrections_applied: usedCorrections.size,
    corrections_refused: corr.refused.length,
    // A correction can verify and still reach no row — METHOD.md itself is in a commit's paths
    // and produces no artifact row. Counted rather than assumed to be zero.
    corrections_verified_unused: corr.applied.size - usedCorrections.size,
  };

  return {
    landed, signals, counts, keeper, unread, ambiguous,
    corrections: {
      // Read back off the ROWS, so what the corrections section prints and what table 1 prints
      // cannot drift apart into two accounts of one correction.
      applied: landed.filter((r) => r.corrected).map((r) => ({
        sha: r.sha, path: r.path, seat: r.seat, seatFrom: r.seatFrom,
        by: r.corrected.by, at: r.corrected.at,
        evidence: r.corrected.evidence, line: r.corrected.line, note: r.corrected.note,
      })),
      verifiedUnused: [...corr.applied.entries()]
        .filter(([k]) => !usedCorrections.has(k))
        .map(([, v]) => v),
      refused: corr.refused,
    },
    unmeasured: commits.length === 0,
  };
}

/* ── RENDER ───────────────────────────────────────────────────────────────────────────────── */

const pad = (s, n) => {
  const t = String(s == null ? '' : s);
  return t.length > n ? t.slice(0, n - 1) + '…' : t + ' '.repeat(n - t.length);
};

function render(out, opts) {
  const C = opts.color
    ? { red: (s) => `\x1b[31m${s}\x1b[0m`, amber: (s) => `\x1b[33m${s}\x1b[0m`, dim: (s) => `\x1b[90m${s}\x1b[0m` }
    : { red: (s) => s, amber: (s) => s, dim: (s) => s };
  const L = [];
  L.push('ESSAY PROVENANCE — compiled from four ledgers, not from anyone\'s memory');
  L.push(`  ${opts.command}`);
  L.push('');
  if (out.unmeasured) {
    L.push('UNMEASURED — no commits touch the prefix. A compile over zero contributions is not a');
    L.push('clean table; it is a table with nothing behind it.');
    L.push('');
  }
  L.push(`log-keeper (derived): ${out.keeper || 'UNDETERMINED — every unlogged artifact is flagged unqualified'}`);
  if (out.unread.length) L.push(C.red(`SOURCES NOT READ: ${out.unread.join(', ')} — their axes read UNREAD, never clean`));
  L.push('');

  L.push('TABLE 1 — WHAT LANDED');
  L.push(`${pad('DATE', 11)}${pad('SEAT', 18)}${pad('PATH', 42)}${pad('LOG ENTRY', 46)}RULINGS`);
  L.push('-'.repeat(150));
  let lastSha = null;
  for (const r of out.landed) {
    if (r.sha !== lastSha) {
      L.push(C.dim(`${r.sha}  ${r.subject}`));
      lastSha = r.sha;
    }
    const paint = r.red ? C.red : (r.owed ? C.amber : (s) => s);
    // Both names, always, when a correction stands. The wrong one is not overwritten here or in
    // --json; it is the evidence that the capture happened.
    const who = r.seatFrom ? `${r.seatFrom}->${r.seat}` : r.seat;
    L.push(`${pad(r.date, 11)}${pad(who, 18)}${pad(r.path, 42)}${paint(pad(r.log, 46))}${r.rulings.join(' ')}`);
  }
  L.push('');

  L.push('TABLE 2 — SIGNALS WITH NO COMMIT BEHIND THEM');
  L.push('(no key links a board row or a lap row to a commit unless the row names the sha, so these');
  L.push(' are listed rather than joined; a nearest-in-time join would be a fabricated correspondence)');
  L.push(' ON-DISK-NOT-COMMITTED is the THIRD state: the file exists and git cannot see it yet.');
  L.push(`${pad('DATE', 11)}${pad('SOURCE', 9)}${pad('WHO', 22)}${pad('RULING', 24)}PATHS`);
  L.push('-'.repeat(150));
  if (!out.signals.length) L.push('  (none)');
  for (const s of out.signals) {
    const who = s.source === 'lap'
      ? `${s.lap} ${s.chain || s.stage}`
      : `${(s.actor && s.actor.actor) || s.pane || '?'} ${s.prefixTag || s.role || ''}`;
    L.push(`${pad(s.date, 11)}${pad(s.source, 9)}${pad(who, 22)}${pad(s.ruling, 24)}${s.paths.join(' ')}`);
  }
  L.push('');

  const corr = out.corrections || { applied: [], refused: [], verifiedUnused: [] };
  if (corr.applied.length || corr.refused.length || corr.verifiedUnused.length) {
    L.push('CORRECTIONS — the commit body is wrong about who landed a file, and the artifact frozen');
    L.push('in that same commit says so. Nothing here overrides silently: table 1 prints both names.');
    L.push('A correction is CHECKED, never believed — the seat must appear on an authorship line in');
    L.push('the evidence blob AS IT STOOD at that sha, which pushed history cannot rewrite.');
    L.push(`${pad('SHA', 9)}${pad('PATH', 42)}${pad('COMMIT SAID -> TRUE SEAT', 26)}${pad('BY', 18)}AT`);
    L.push('-'.repeat(150));
    for (const a of corr.applied) {
      L.push(`${pad(a.sha, 9)}${pad(a.path, 42)}${pad(`${a.seatFrom || '?'} -> ${a.seat}`, 26)}${pad(a.by, 18)}${a.at}`);
      L.push(`         evidence ${a.sha}:${a.evidence}`);
      L.push(`         "${a.line}"`);
      if (a.note) L.push(`         note: ${a.note}`);
    }
    for (const u of corr.verifiedUnused) {
      L.push(C.amber(`${pad(u.sha, 9)}${pad(u.path, 42)}VERIFIED BUT MATCHED NO ROW`));
    }
    for (const r of corr.refused) {
      const row = r.row || {};
      L.push(C.red(`${pad(row.sha || '?', 9)}${pad(row.path || '?', 42)}REFUSED: ${r.reason}`));
    }
    L.push('');
  }

  const c = out.counts;
  L.push('COUNTS');
  L.push(`  commits touching the prefix          ${c.commits}`);
  L.push(`  rows in table 1                      ${c.rows}`);
  L.push(`  LOGGED                               ${c.logged}`);
  L.push(`  NO-LOG-ENTRY (log-keeper's own)      ${c.no_log_entry}`);
  L.push(`  NO-LOG-ENTRY-OTHER-SEAT (owed)       ${c.owed_by_keeper}`);
  L.push(`  METHOD-NO-ARTIFACT                   ${c.method_no_artifact}`);
  L.push(`  COMMIT-NO-BOARD                      ${c.commit_no_board}`);
  L.push(`  BOARD-SHA (exact board join)         ${c.board_sha}`);
  L.push(`  BOARD-NO-COMMIT                      ${c.board_no_commit}`);
  L.push(`  ON-DISK-NOT-COMMITTED                ${c.on_disk_not_committed}`);
  L.push(`  LAP-ONLY                             ${c.lap_only}`);
  L.push(`  corrections offered / applied        ${c.corrections_offered} / ${c.corrections_applied}`);
  L.push(`  corrections REFUSED                  ${c.corrections_refused}`);
  L.push(`  METHOD entries / owned by a commit   ${c.method_entries} / ${c.method_entries_owned}`);
  L.push(`  commits naming a seat in the body    ${c.seat_named} of ${c.commits}`);
  L.push(`  commits carrying a session trailer   ${c.session_named} of ${c.commits}`);
  L.push('');
  L.push('HOW THE BOARD\'S PROSE PATHS RESOLVED');
  L.push(`  exact                                ${c.board_mentions_exact}`);
  L.push(`  unique-prefix (an abbreviation)      ${c.board_mentions_unique_prefix}`);
  L.push(`  AMBIGUOUS, resolved to nothing       ${c.board_mentions_ambiguous}`);
  L.push(`  matched no landed path               ${c.board_mentions_unresolved}`);
  L.push(`  lap NOTE mentions, counted not joined ${c.lap_note_mentions}`);
  for (const a of (out.ambiguous || [])) {
    L.push(`    ${a.mention} -> ${a.candidates.join(' | ')}`);
  }
  L.push('');

  L.push('WHAT THIS TABLE CANNOT SEE');
  for (const b of out.blind || []) L.push(`  ${b}`);
  L.push('');
  L.push('FALSIFIER: a contribution this table cannot show means the loop was bypassed.');
  L.push('This output is pasted into the report whole and recompiled; it is never patched by hand.');
  return L.join('\n');
}

function blindness(ctx) {
  return [
    `1 BLIND WINDOWS   board_push mutes every writer while ${ctx.blindLock} exists; one window`,
    '                  2026-06-30 -> 2026-08-01 swallowed 2,473 entries. Board figures are a FLOOR.',
    `                  present now: ${ctx.blindLockPresent ? 'YES — this run is UNMEASURED on the board axis' : 'no'}`,
    '2 ONE MACHINE     all four ledgers are machine-local. The desktop\'s work is invisible here.',
    '3 THE SEAT IS     git author is the same human on every commit and Co-Authored-By names the',
    `  PROSE           MODEL, not the thread. A seat name comes from a body line: ${ctx.seatNamed} of ${ctx.commits}`,
    `                  carry one. A session trailer separates threads without naming them: ${ctx.sessionNamed} of ${ctx.commits}.`,
    '4 UNHANDED WORK   work done in a pane and never handed back appears in no ledger at all.',
    `5 THE BOARD       byte-identical re-appended rows are merged here: ${ctx.dropped} dropped of`,
    `  REPEATS         ${ctx.boardRaw} essay-naming rows this run.`,
    '6 ARRIVAL NAMES   a board row\'s mount is the RECEIVER on an arriving message. The row\'s',
    '  THE RECEIVER    EXISTENCE cannot be suppressed by the sender; its ATTRIBUTION to the sender',
    '                  is a text prefix the sender types, and is prose like any other.',
    '7 MERGE COMMITS   git shows no file names for a merge, so an artifact introduced BY a merge',
    '                  would land in no row at all — the one way this table can drop a committed',
    `                  file. Live now: ${ctx.merges} merge commits touch the prefix.`,
    '8 A CORRECTION    corrections change the SEAT column only. The log-entry ruling is keyed to the',
    '  IS SEAT-ONLY    COMMITTING thread, so a correction naming the log-keeping thread would',
    `                  leave the row saying the entry is owed elsewhere. On file now: ${ctx.corrections}.`,
  ];
}

/* ── CLI ──────────────────────────────────────────────────────────────────────────────────── */

async function main(argv) {
  const args = argv.slice(2);
  const opts = {
    json: args.includes('--json'),
    color: !args.includes('--no-color') && process.stdout.isTTY !== false,
    prefix: DEFAULT_PREFIX,
  };
  const pi = args.indexOf('--prefix');
  if (pi !== -1 && args[pi + 1]) opts.prefix = normPrefix(args[pi + 1]);
  opts.command = `node consonance/tools/essay-provenance.js${opts.prefix === DEFAULT_PREFIX ? '' : ` --prefix ${opts.prefix}`}`;

  if (!DATA_DIR) {
    console.error('no data dir: set CONSONANCE_DATA, or data_dir in ~/.consonance.json.');
    console.error('refusing rather than reading a literal path that is right on one machine.');
    return 2;
  }
  let commits;
  try {
    commits = readCommits(REPO_ROOT, opts.prefix);
  } catch (e) {
    console.error(`git log failed in ${REPO_ROOT}: ${e.message}`);
    return 2;
  }

  const owners = readMethodOwners(REPO_ROOT, opts.prefix);
  const methodFile = path.join(REPO_ROOT, opts.prefix, LOG_FILE);
  let method = [];
  let methodOk = true;
  try {
    method = parseMethod(fs.readFileSync(methodFile, 'utf8'));
    for (const e of method) e.sha = owners.get(e.heading.replace(/\s+$/, '')) || null;
  } catch (_) { methodOk = false; }

  let canonical = null;
  try { canonical = require('./actors.js').canonical; } catch (_) { canonical = null; }

  const boardFile = path.join(DATA_DIR, 'board.jsonl');
  let boardRaw = [];
  let boardOk = true;
  try { boardRaw = await readBoard(boardFile, opts.prefix, canonical); } catch (_) { boardOk = false; }
  const { rows: board, dropped } = dedupeBoard(boardRaw);

  const lapFile = path.join(DATA_DIR, 'lap.jsonl');
  let lap = [];
  let lapOk = true;
  try { lap = readLap(lapFile, opts.prefix); } catch (_) { lapOk = false; }

  let onDisk = [];
  try {
    onDisk = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', opts.prefix],
      { cwd: REPO_ROOT, encoding: 'utf8' })
      .split(String.fromCharCode(10)).map((x) => x.trim()).filter(Boolean);
  } catch (_) { onDisk = []; }

  // THE FIFTH LEDGER, and the only hand-written one. Absent, the run is not "clean": it is a run
  // with no corrections on file, and the counts say so with a zero rather than by omission.
  const corrFile = path.join(REPO_ROOT, CORRECTIONS_FILE);
  let corrections = [];
  let corrLines = 0;
  let corrOk = true;
  try {
    const got = readCorrections(corrFile);
    corrections = got.rows;
    corrLines = got.lines;
  } catch (_) { corrOk = false; }

  const readBlob = gitBlobReader(REPO_ROOT);

  let merges = 0;
  try {
    merges = execFileSync('git', ['log', '--merges', '--pretty=format:%h', '--', opts.prefix],
      { cwd: REPO_ROOT, encoding: 'utf8' }).split(String.fromCharCode(10)).filter((x) => x.trim()).length;
  } catch (_) { merges = -1; }

  const out = reconcile({
    commits, method, board, lap, prefix: opts.prefix, onDisk, corrections, readBlob,
    available: { board: boardOk, lap: lapOk, method: methodOk },
  });
  const blindLock = path.join(DATA_DIR, 'blind.lock');
  out.blind = blindness({
    blindLock,
    blindLockPresent: fs.existsSync(blindLock),
    seatNamed: out.counts.seat_named,
    sessionNamed: out.counts.session_named,
    commits: out.counts.commits,
    dropped,
    boardRaw: boardRaw.length,
    merges: merges === -1 ? 'UNCOUNTED' : merges,
    corrections: out.counts.corrections_applied + ' applied, ' + out.counts.corrections_refused + ' refused',
  });
  out.sources = {
    git: { ok: true, root: REPO_ROOT, commits: commits.length },
    method: { ok: methodOk, file: methodFile, entries: method.length },
    board: { ok: boardOk, file: boardFile, rows: board.length, dropped },
    lap: { ok: lapOk, file: lapFile, rows: lap.length },
    corrections: { ok: corrOk, file: corrFile, rows: corrLines },
  };
  if (!corrOk) console.error(`corrections ledger unreadable at ${corrFile} — no correction can apply`);

  if (opts.json) console.log(JSON.stringify(out, null, 2));
  else console.log(render(out, opts));
  return 0;
}

module.exports = {
  reconcile, parseMethod, shortShas, essayPaths, dedupeBoard, methodKeeper, normPrefix,
  readCommits, readMethodOwners, readBoard, readLap, render, blindness, shaMatch, resolveMention,
  readCorrections, verifyCorrection, verifyCorrections, correctionKey, gitBlobReader,
  REPO_ROOT, DATA_DIR, CORRECTIONS_FILE,
};

if (require.main === module) {
  main(process.argv).then((c) => { process.exitCode = c; })
    .catch((e) => { console.error(e && e.stack ? e.stack : String(e)); process.exitCode = 2; });
}
