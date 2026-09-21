#!/usr/bin/env node
'use strict';
// state-sync.js — the state set moves between two machines, and both can prove they hold the
// same one. P-STATE-REPO (L052), pane A, 2026-09-09.
//
//   node consonance/tools/state-sync.js --push [--dry-run] [--no-remote]
//   node consonance/tools/state-sync.js --pull [--install]
//   node consonance/tools/state-sync.js --verify        # no network, no writes
//   node consonance/tools/state-sync.js --status        # one commit hash per machine
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// WHY A COPY AND NOT A HARD LINK. Measured, not chosen (all numbers re-derivable — see §MEASURED
// below and the hand-back):
//
//   A hard link SURVIVES a write through either link, and it DOES NOT SURVIVE GIT. `git checkout`
//   — which is what a fast-forward `--pull` performs on every changed file — REPLACES the file
//   rather than writing into it, and the link is gone: `fsutil hardlink list` went from two paths
//   to one, the repo froze at the old bytes, the data dir moved on, and NOTHING SAID SO. From that
//   moment the state tree would push a stale board and report success forever.
//
//   Worse, and found in the same run: with a hard link in place, `git status --porcelain` printed
//   a CLEAN TREE after the file had changed through the other link (git's racily-clean stat cache;
//   the mtime is inside the index's own second). A push that trusted `status` would commit nothing
//   and exit 0.
//
//   So: hard links are REFUSED here, on two independent measured grounds, both of which fail
//   silently — which is the only failure mode this room actually fears.
//
// WHY A STABLE READ AND NOT `fs.copyFileSync`. Also measured, and this one is a hazard in the
// direction nobody looks — the SOURCE:
//
//   `copyFileSync` is `CopyFileW`, which opens the source with a share mode that LOCKS OUT THE
//   APP'S OWN WRITER. Racing one against a rewriter of a 4.7 MB capture: 5,877 of the writer's
//   attempts came back EBUSY against 4,368 that succeeded. Against the board's append path:
//   9,012 EBUSY against 30,773 rows. And in `main.rs` every one of those is discarded —
//   `let _ = fs::write(...)` (:818, :5336) and `if let Ok(mut f) = OpenOptions...` (board_push,
//   :1910). A SYNC THAT COPIES WITH CopyFileW SILENTLY DELETES THE APP'S OWN ROWS AND STITCHES.
//   Reading the file with an ordinary open instead: 0 EBUSY, both classes.
//
//   But a plain read is not enough on its own, because `fs::write` is truncate-then-write and is
//   NOT atomic: reading a capture mid-rewrite returned an EMPTY file on 1,812 of 1,833 reads, and
//   `CopyFileW` returned a FULL-LENGTH FILE OF NUL BYTES on 14 of 879. Both are valid files at the
//   destination and neither can be told from a good one by looking at it.
//
//   AND THE READ-SIDE GATE ALONE WAS NOT ENOUGH EITHER, which is this packet's own finding and
//   the reason `SETTLE_MS` exists. stat/read/stat/read agreeing four ways still accepted 6 torn
//   buffers out of 28 against a real second process — because a truncate-then-write leaves the
//   file at an intermediate LENGTH that holds steady, with one mtime, for as long as the writer
//   is descheduled, so every one of those four agreements is about the same half-written file.
//   THE READ SIDE CANNOT CERTIFY A REWRITTEN FILE. What it can certify is that nobody has written
//   it for SETTLE_MS, which is the quiescent-moment answer made checkable: the state moves
//   BETWEEN writes, and a file that never goes quiet is refused BY NAME rather than carried torn.
//
// THE CLASSES, AND WHAT EACH ONE TOLERATES (this is the per-class answer the packet asked for):
//
//   APPEND-ONLY   board.jsonl, every *.jsonl ledger, and a capture .txt while it is merely growing.
//                 A copy taken mid-append is a valid PREFIX: 897 of 897 copies ended on a complete,
//                 parseable JSON line. Prefix-safe, so a stable read that loses a race here costs
//                 at most the newest row, and the next push carries it. `--push` still gates them,
//                 because a prefix that is SHORTER than the last push would be a rewind, and the
//                 index records bytes so a rewind is visible rather than quiet.
//
//   REWRITTEN     captures/*.txt under stitch (main.rs:818) and under shell eviction (:5336),
//                 letters.json (:3447), panes.json (:3299) — all `fs::write`, truncate-then-write.
//                 A prefix is NOT valid state here: an empty or NUL-filled capture is a seat that
//                 wakes as a stranger. These are the files the gate exists for, and a path that
//                 will not come back stable ABORTS THE PUSH by name rather than travelling torn.
//
// WHAT THIS TOOL WILL NOT DO. It will not push while any single file is over GitHub's 100 MB hard
// limit — checked before git is touched at all, because a rejected push leaves a commit behind and
// the next reader cannot tell a refused set from a delivered one. It will not push to a repository
// it has not itself confirmed is private. It will not `git add -A` or take a bare `git commit`
// (the 2026-09-04 capture at 38ae5c2: `commit` needs no `add` and takes whatever is in the shared
// index). It does not push the record repo and never touches it.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const manifestMod = require('./state-manifest.js');
const { globToRe, walk } = manifestMod;

const REPO = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH =
  (process.env.STATE_MANIFEST || '').trim() || path.join(REPO, 'consonance', 'state-manifest.json');

/** GitHub's hard per-file limit. Not a preference — a push over it is rejected by the server. */
const FILE_CAP = 100 * 1024 * 1024;

/** How many times the stable read may try before it gives up and names the path. */
const STABLE_TRIES = 8;

/**
 * How long a file must have gone UNWRITTEN before its bytes may be trusted.
 *
 * Measured, both ends: a whole-file rewrite of a 4.7 MB capture takes ~1.08 ms, and the harvest
 * loop that issues them polls every 250 ms. 150 ms is two orders of magnitude clear of the write
 * and comfortably inside the poll, so a pane that is actively streaming still has a window every
 * cycle in which its tail can be read whole. Raise it and a busy pane never syncs; lower it and
 * the gate goes back to certifying half-written files, which is the defect it was added to fix.
 */
const SETTLE_MS = 150;

const INDEX_NAME = 'state-set.json';
const STATUS_NAME = 'state-sync.status.json';
const COMPLETION_NAME = 'sync-completion.json';
const RECEIPT_NAME = 'state-sync.push.json';

/**
 * THIS PROCESS, named so a caller can prove a receipt is about the run it just started.
 *
 * Tonight's failure, twice in one hour: a reading taken at 04:05 was reported at 04:33 as though it
 * were current, and "I re-checked" was written into a ring when no check had run. Both are one
 * defect — a READING treated as a STATE. A receipt with no run identity is that defect with a file
 * behind it: a caller finds `outcome: "PUSHED"` on disk and cannot tell whether this run wrote it
 * or last night's did. The pid is checkable by whoever SPAWNED the process, and needs no clock.
 */
const RUN_ID = `${process.pid}-${Date.now()}`;

// ── corpus resolution ────────────────────────────────────────────────────────────────────────
// Same law as state-manifest.js and portable-paths: env, then this machine's config, then REFUSE.
// A literal fallback is how a tool comes to report about a disk nobody asked about.

function dataDir() {
  return manifestMod.dataDir();
}

function stateDir() {
  const env = (process.env.CONSONANCE_STATE || '').trim();
  if (env) return env;
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\ufeff/, '')
    );
    if (cfg.state_dir) return cfg.state_dir;
  } catch (_) { /* fall through */ }
  // No literal fallback (L065, pane E; portable-paths REVIEW at this line). A machine's own path returned
  // as everybody's default is another machine's disk the moment this file leaves the box that wrote it.
  throw new Error('no state dir declared: set state_dir in ~/.consonance.json or CONSONANCE_STATE. '
    + 'Nothing was read and nothing was sent.');
}

/**
 * Where THIS machine mints its instance directories.
 *
 * Resolved the same way `main.rs` resolves it (`instances_root()`, :753) and in the same order as
 * everything else here: env, then this machine's config, then the same literal default the app
 * falls back to. It is deliberately NOT read from the arriving set — an instances root taken from
 * the other machine's files is exactly the defect this packet exists to remove.
 */
function instancesRoot() {
  const env = (process.env.CONSONANCE_INSTANCES || '').trim();
  if (env) return env;
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')
    );
    if (cfg.instances_dir && String(cfg.instances_dir).trim()) return String(cfg.instances_dir).trim();
  } catch (_) { /* fall through */ }
  return path.join(os.homedir(), 'claude-instances');
}

/**
 * This machine's name, for the per-machine rows.
 *
 * `machine_tag` from ~/.consonance.json when it is there, the hostname otherwise. NEVER
 * `install_id` — that file is FORBIDDEN under the data root by this manifest's own list, and the
 * reason is exactly this kind of use: an identity read from inside the travelling set is an
 * identity both machines share.
 */
function machineTag() {
  const env = (process.env.CONSONANCE_MACHINE || '').trim();
  if (env) return env;
  try {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\ufeff/, '')
    );
    if (cfg.machine_tag) return String(cfg.machine_tag);
  } catch (_) { /* fall through */ }
  return os.hostname();
}

// ── the stable read ──────────────────────────────────────────────────────────────────────────

/**
 * Read a file the app may be rewriting underneath us, or return null having touched nothing.
 *
 * stat → read → read again → stat, and size, mtime and bytes must all agree across the whole
 * operation. (There was a second stat between the reads; the mutation pass proved it dead — the
 * final one is strictly later and compares against the same first stat.) The second
 * read is not belt-and-braces: `fs::write` truncates first, so a read that begins inside the
 * window sees size 0 and returns an EMPTY BUFFER THAT MATCHES ITS OWN STAT. Only comparing two
 * reads separated in time catches that, and it is the case that was measured 1,812 times out of
 * 1,833 against a continuous rewriter.
 *
 * Returns { buf, attempts } or { buf: null, attempts } — never a partial answer, never a throw.
 */
function sleepSync(ms) {
  // A synchronous sleep, because the whole tool is synchronous and a settle window has to be
  // waited out rather than polled hot — polling hot is what turned the source read into a
  // denial of service against the app's own writer in the first measurement.
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function stableRead(p, tries = STABLE_TRIES, settleMs = SETTLE_MS) {
  let lastErr = null;
  for (let i = 1; i <= tries; i++) {
    let a, c, buf, buf2;
    try { a = fs.statSync(p); } catch (e) { lastErr = e; continue; }

    // THE QUIESCENCE GATE, and it is here because the stat/read/stat/read gate ALONE WAS NOT
    // ENOUGH — measured by this file's own test before it was added: racing a real second process
    // that truncate-rewrote a 200 KB file, the four-step gate ACCEPTED 6 TORN BUFFERS OUT OF 28.
    // The reason is the one thing the four steps cannot see: fs::write leaves the file at an
    // intermediate LENGTH that is stable for as long as the writer is descheduled, with the same
    // mtime throughout, so both reads agree with each other and with both stats — and every one
    // of those agreements is about the same half-written file.
    //
    // So the read side cannot certify a rewritten file at all. What CAN be certified is that
    // nobody has written it recently: a whole-file rewrite of a 4.7 MB capture was measured at
    // ~1.08 ms, and the harvest loop that issues them polls every 250 ms. A file whose mtime is
    // SETTLE_MS in the past is therefore not inside a write; it is between them.
    //
    // THIS IS THE QUIESCENT-MOMENT ANSWER, made checkable rather than argued: the state moves
    // between writes, not during one, and a file that never goes quiet is REFUSED BY NAME rather
    // than carried torn.
    const age = Date.now() - a.mtimeMs;
    if (a.mtimeMs > Date.now() + 1000) {
      // A future mtime means the clock moved or something is writing with a time we cannot
      // reason about. Refusing is the only honest reading: no wait makes a future file old.
      return { buf: null, attempts: i, err: 'FUTURE_MTIME' };
    }
    if (age < settleMs) { sleepSync(Math.min(settleMs - age + 5, settleMs)); continue; }

    try { buf = fs.readFileSync(p); } catch (e) { lastErr = e; continue; }

    // A SHORT READ IS ITS OWN CASE. `readFileSync` sizes its buffer from a stat and then reads;
    // a file that shrank in between comes back shorter than the stat that shaped it, and that is
    // a comparison of a BUFFER against a STAT, which no later stat-to-stat check can make.
    if (buf.length !== a.size) continue;

    try { buf2 = fs.readFileSync(p); } catch (e) { lastErr = e; continue; }
    if (!buf.equals(buf2)) continue;

    // ONE STAT AFTER BOTH READS, not two.
    //
    // There was a second `stat` between the reads, comparing size and mtime against `a`. The
    // mutation pass proved it dead: deleting its comparison changed no test, because this check
    // is strictly later, compares against the same `a`, and therefore subsumes it. Keeping it
    // would have been a line that cannot fail — the shape this room is otherwise careful to
    // distrust — so it is gone rather than explained. One syscall less per file, too.
    try { c = fs.statSync(p); } catch (e) { lastErr = e; continue; }
    if (c.size !== a.size || c.mtimeMs !== a.mtimeMs) continue;
    return { buf, attempts: i, err: null };
  }
  return { buf: null, attempts: tries, err: lastErr && lastErr.code ? lastErr.code : null };
}

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// ── classification, borrowed rather than reimplemented ───────────────────────────────────────

function loadManifest() {
  const man = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8').replace(/^\ufeff/, ''));
  // ONE IMPLEMENTATION OF THE RULE SET, and this was the last piece still duplicated. This
  // function used to carry its own copy of three of the four checks; a fourth added to the checker
  // would have been silently absent here, so the transport and its checker could disagree about
  // whether the manifest is valid while both printed green \u2014 the exact failure this file's
  // exported `globToRe` already exists to prevent.
  const errors = manifestMod.classErrorsFor(man);
  return {
    man,
    errors,
    rules: man.rules.map((r) => ({ ...r, re: globToRe(r.glob) })),
    forbidden: (man.forbidden || []).map((f) => ({ ...f, re: globToRe(f.glob) })),
  };
}

/**
 * Walk the data dir and split it the way the manifest says.
 *
 * `unplaced` and `violations` are returned rather than tolerated: a push under an unclassified
 * path is a path travelling or failing to travel BY ACCIDENT, which is the one outcome the
 * manifest was built to make impossible. The caller refuses on either.
 */
function classify(DATA, m) {
  const paths = walk(DATA);
  const travels = [];
  const unplaced = [];
  const violations = [];
  const broken = [];
  for (const p of paths) {
    if (p.kind === 'unreadable' || p.kind === 'unstattable') { broken.push(p); continue; }
    const f = m.forbidden.find((f) => f.re.test(p.rel));
    if (f) { violations.push({ rel: p.rel, why: f.why }); continue; }
    const r = m.rules.find((r) => r.re.test(p.rel));
    if (!r) { unplaced.push(p.rel); continue; }
    if (r.class === 'TRAVELS' && p.kind === 'file') travels.push({ rel: p.rel, bytes: p.bytes, why: r.glob });
  }
  travels.sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));
  return { travels, unplaced, violations, broken, walked: paths.length };
}

// ── git, always by named path ────────────────────────────────────────────────────────────────

function git(cwd, args, opts = {}) {
  return execFileSync('git', ['-C', cwd, ...args], {
    encoding: 'utf8',
    stdio: opts.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  });
}

function gitTry(cwd, args) {
  try { return { ok: true, out: git(cwd, args).trim() }; }
  catch (e) { return { ok: false, out: '', err: String((e.stderr || e.stdout || e.message || '')).trim() }; }
}

/**
 * Is the remote this tree pushes to actually private?
 *
 * FAILS CLOSED, and the reason is in the packet that asked for it: the chair ran this check and
 * reported the answer, which is precisely the arrangement this room does not trust. An answer
 * relayed is not an answer measured. If `gh` is absent, unauthenticated, or the repo cannot be
 * read, this returns `unknown` and the push REFUSES — a private repo and a repo nobody could ask
 * about read identically from here, and this one carries the keeper's board.
 */
function remotePrivacy(cwd) {
  const url = gitTry(cwd, ['remote', 'get-url', 'origin']);
  if (!url.ok || !url.out) return { state: 'unknown', why: 'no origin remote on the state tree', repo: null };
  const m = url.out.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (!m) return { state: 'unknown', why: `origin is not a github remote this check understands: ${url.out}`, repo: null };
  const repo = `${m[1]}/${m[2]}`;
  try {
    const out = execFileSync('gh', ['repo', 'view', repo, '--json', 'isPrivate,visibility'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    const j = JSON.parse(out);
    return { state: j.isPrivate === true ? 'private' : 'PUBLIC', why: `gh: visibility=${j.visibility}`, repo };
  } catch (e) {
    return { state: 'unknown', why: `gh repo view failed: ${String(e.stderr || e.message).trim().split('\n')[0]}`, repo };
  }
}

/**
 * One commit hash per machine, read from the state tree's own log.
 *
 * Each machine's push touches `machines/<tag>.json` and nothing else does, so the last commit to
 * touch that path IS that machine's last sync. Read locally, so it is honest about what it is:
 * the other machine's head AS OF THIS MACHINE'S LAST FETCH, never a live reading of a machine
 * that may have moved since.
 */
function machineHeads(STATE) {
  const dir = path.join(STATE, 'machines');
  let names = [];
  try { names = fs.readdirSync(dir).filter((n) => n.endsWith('.json')); } catch (_) { return []; }
  const out = [];
  for (const n of names.sort()) {
    const tag = n.replace(/\.json$/, '');
    const r = gitTry(STATE, ['log', '-1', '--format=%h %ct', '--', `machines/${n}`]);
    const [sha, ct] = (r.ok ? r.out : '').split(/\s+/);
    let at = null;
    try { at = JSON.parse(fs.readFileSync(path.join(dir, n), 'utf8')).at || null; } catch (_) { /* keep null */ }
    out.push({ machine: tag, commit: sha || null, committed_at: ct ? Number(ct) * 1000 : null, at });
  }
  return out;
}

function writeStatus(DATA, STATE) {
  const head = gitTry(STATE, ['rev-parse', '--short', 'HEAD']);
  const status = {
    written: new Date().toISOString(),
    by: 'state-sync.js',
    this_machine: machineTag(),
    state_dir: STATE,
    head: head.ok ? head.out : null,
    machines: machineHeads(STATE),
    limit: 'AS OF THIS MACHINE\'S LAST PUSH OR PULL. It cannot see a machine that has synced since.',
  };
  try { fs.writeFileSync(path.join(DATA, STATUS_NAME), JSON.stringify(status, null, 2)); } catch (_) { /* a status file is not worth failing a sync over */ }
  return status;
}

/**
 * What actually happened on this push, in a form a caller can GATE on.
 *
 * WHY THIS EXISTS AND WHY AN EXIT CODE WILL NOT DO. `--push` returns 0 from four different places
 * — pushed, nothing changed, --dry-run, --no-remote — and 1 from eight, of which exactly one (a
 * path that will not settle) is worth retrying and the rest are not. So the exit code cannot answer
 * either question a CLOSE has to ask: did the state actually reach the remote, and is this failure
 * one to wait out or one to stop on. The only alternative is for the caller to read this tool's
 * PROSE, which is a relayed answer — the thing this room keeps being wrong about.
 *
 * Written on EVERY termination of the push that got far enough to know where the data dir is. A
 * failure to write it is swallowed, because a caller that finds no receipt for its own run must
 * refuse, and refusing is the safe direction. STAYS in the manifest: a per-machine record of a
 * per-machine act, and a travelled copy would tell the desktop the laptop's push was its own.
 */
function writeReceipt(DATA, o) {
  if (!DATA) return;
  try {
    fs.writeFileSync(
      path.join(DATA, RECEIPT_NAME),
      JSON.stringify({ version: 1, run_id: RUN_ID, pid: process.pid, at: new Date().toISOString(), machine: machineTag(), ...o }, null, 2) + '\n'
    );
  } catch (_) { /* the caller refuses on a missing receipt; that is the safe way for this to fail */ }
}

// ── the state tree's own settings ────────────────────────────────────────────────────────────

/**
 * `* -text` in the state tree, and it is load-bearing rather than tidy.
 *
 * `core.autocrlf` is TRUE on this machine (measured in the clone the chair made). Without this
 * file git rewrites every LF to CRLF on checkout, so the desktop's `board.jsonl` would be
 * byte-different from the laptop's the moment it arrived: every sha256 in the index would
 * mismatch, and the completeness check would go red for a reason that has nothing to do with a
 * missing path. Worse if it went unnoticed — the room's readers would be parsing a file whose
 * every line ends differently from the one that was written.
 */
function ensureTreeSettings(STATE) {
  const written = [];
  const ga = path.join(STATE, '.gitattributes');
  const want =
    '# state-sync.js (L052). Byte-exact or the sha256 index is meaningless.\n' +
    '# core.autocrlf is true on at least one machine here; without this line git rewrites LF to\n' +
    '# CRLF on checkout and every file in this repo arrives byte-different from the one pushed.\n' +
    '* -text\n';
  let cur = null;
  try { cur = fs.readFileSync(ga, 'utf8'); } catch (_) { /* absent */ }
  if (cur !== want) { fs.writeFileSync(ga, want); written.push('.gitattributes'); }
  return written;
}

// ── push ─────────────────────────────────────────────────────────────────────────────────────

function cmdPush(args) {
  const dryRun = args.includes('--dry-run');
  const noRemote = args.includes('--no-remote');
  const DATA = dataDir();
  const STATE = stateDir();
  // Every exit below goes through this, so a caller can gate on WHAT HAPPENED rather than on an
  // exit code that four different outcomes share. See writeReceipt.
  const done = (rc, outcome, extra) => { writeReceipt(DATA, { outcome, rc, state_dir: STATE, data_dir: DATA, ...(extra || {}) }); return rc; };
  if (!DATA) return refuse('no corpus declared — CONSONANCE_DATA unset and ~/.consonance.json has no data_dir', 2);
  if (!fs.existsSync(DATA)) return refuse(`data dir does not exist: ${DATA}`, 2);
  if (!fs.existsSync(path.join(STATE, '.git'))) return done(refuse(`state tree is not a git repository: ${STATE}`, 2), 'NO_STATE_TREE', { why: `${STATE} is not a git repository` });

  const m = loadManifest();
  if (m.errors.length) {
    return done(refuse(
      'CLASS ERROR in the manifest — nothing is classified, so nothing is pushed:\n  ' + m.errors.join('\n  '), 1
    ), 'REFUSED_MANIFEST', { why: m.errors.join('; ') });
  }

  const c = classify(DATA, m);
  if (c.violations.length) {
    return done(refuse(
      'FORBIDDEN PATH PRESENT under the data root. Its existence here is the fault, not its column:\n' +
        c.violations.map((v) => `  ${v.rel}\n    ${v.why}`).join('\n'), 1
    ), 'REFUSED_FORBIDDEN', { paths: c.violations.map((v) => v.rel) });
  }
  if (c.unplaced.length) {
    return done(refuse(
      `${c.unplaced.length} path(s) match no rule. Each would travel or fail to travel by accident:\n` +
        c.unplaced.map((p) => '  ' + p).join('\n') +
        '\n  Rule them in consonance/state-manifest.json, then push.', 1
    ), 'REFUSED_UNPLACED', { paths: c.unplaced });
  }

  // THE CAP, CHECKED BEFORE GIT IS TOUCHED AT ALL. A push that gets as far as the server and is
  // rejected leaves a commit behind, and the next reader cannot tell a refused set from a
  // delivered one — which is the exact confusion this whole packet is against.
  const over = c.travels.filter((t) => t.bytes > FILE_CAP);
  if (over.length) {
    return done(refuse(
      'OVER GITHUB\'S 100 MB PER-FILE HARD LIMIT — refusing before touching git:\n' +
        over.map((t) => `  ${t.rel}  ${t.bytes} bytes (${mb(t.bytes)})  — cap is ${FILE_CAP}`).join('\n') +
        '\n  This is not a warning. The server rejects the push, and a half-delivered set at the\n' +
        '  destination reads exactly like a whole one. Compact first (P-BOARD-COMPACT), then push.', 1
    ), 'REFUSED_CAP', { paths: over.map((t) => t.rel) });
  }

  // ── the copy, per class, with the gate ──
  const destRoot = path.join(STATE, 'data');
  const files = [];
  const refused = [];
  let attemptsMax = 0;
  for (const t of c.travels) {
    const src = path.join(DATA, t.rel.split('/').join(path.sep));
    const r = stableRead(src);
    attemptsMax = Math.max(attemptsMax, r.attempts);
    if (!r.buf) {
      refused.push({ rel: t.rel, attempts: r.attempts, err: r.err });
      continue;
    }
    const entry = { path: t.rel, bytes: r.buf.length, sha256: sha256(r.buf), attempts: r.attempts };
    files.push(entry);
    if (!dryRun) {
      const dest = path.join(destRoot, t.rel.split('/').join(path.sep));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, r.buf);
    }
  }

  // A REFUSED PATH ABORTS THE WHOLE PUSH. It does not push the rest and mention this one: a set
  // that is complete except for a capture tail is precisely a seat that wakes as a stranger while
  // every other check reads green.
  if (refused.length) {
    return done(refuse(
      `${refused.length} path(s) would not come back STABLE after ${STABLE_TRIES} attempts — the app is\n` +
        '  rewriting them right now, and a torn capture is indistinguishable from a good one at the\n' +
        '  destination. Nothing was pushed:\n' +
        refused.map((r) => `  ${r.rel}${r.err ? '  (last error ' + r.err + ')' : ''}`).join('\n') +
        '\n  Retry between turns. If a path never settles, say so — that is the quiescent-moment\n' +
        '  finding, and it changes the push CADENCE, not this tool.', 1
    ), 'DEFERRED_UNSETTLED', { paths: refused.map((r) => r.rel), tries: STABLE_TRIES });
  }

  const total = files.reduce((n, f) => n + f.bytes, 0);
  const tag = machineTag();

  if (dryRun) {
    console.log(`state-sync --push --dry-run · ${tag} · ${DATA} -> ${STATE}`);
    console.log(`  ${c.walked} paths walked · ${files.length} TRAVELS files · ${total} bytes (${mb(total)})`);
    console.log(`  stable-read attempts, max: ${attemptsMax}`);
    console.log('  nothing written, nothing committed, nothing pushed.');
    return done(0, 'DRY_RUN', { files: files.length, bytes: total });
  }

  // NOTHING CHANGED IS DECIDED ON CONTENT, NOT ON THE CLOCK.
  //
  // Found by this file's own test: the index and the machine row each carry an `at` timestamp, so
  // writing them unconditionally made EVERY push a commit — a repository that grows a commit per
  // turn whether or not one byte of state moved, and an in-sync line that shows both machines
  // advancing when neither has said anything. The comparison is the file list with its hashes;
  // the timestamps ride along only when something actually moved.
  let prevFiles = null;
  try { prevFiles = JSON.parse(fs.readFileSync(path.join(STATE, INDEX_NAME), 'utf8')).files; } catch (_) { /* first push */ }
  const same =
    prevFiles &&
    prevFiles.length === files.length &&
    prevFiles.every((p, i) => p.path === files[i].path && p.bytes === files[i].bytes && p.sha256 === files[i].sha256);
  if (same) {
    const h = gitTry(STATE, ['rev-parse', '--short', 'HEAD']);
    console.log(`state-sync --push · ${tag} · nothing changed since ${h.ok ? h.out : '?'} — no commit made.`);
    const st0 = writeStatus(DATA, STATE);
    printHeads(st0);
    // NOTHING CHANGED IS NOT THE SAME CLAIM AS NOTHING IS OWED. This path never consults the
    // remote, so a commit that failed to push yesterday is still unpushed and this still exits 0.
    // The receipt says only that no commit was made HERE; whether the remote HAS it is a question
    // for the remote, and close.js asks it rather than inferring it from this line.
    return done(0, 'NOTHING_CHANGED', { head: h.ok ? h.out : null, files: files.length, bytes: total });
  }

  // ── the index: what the other machine checks itself against ──
  const index = {
    version: 1,
    written_by: 'consonance/tools/state-sync.js',
    machine: tag,
    at: new Date().toISOString(),
    source_data_dir: DATA,
    manifest_version: m.man.version,
    totals: { files: files.length, bytes: total },
    files,
    how_to_verify: 'node consonance/tools/state-sync.js --verify',
  };
  fs.writeFileSync(path.join(STATE, INDEX_NAME), JSON.stringify(index, null, 2) + '\n');

  fs.mkdirSync(path.join(STATE, 'machines'), { recursive: true });
  fs.writeFileSync(
    path.join(STATE, 'machines', `${tag}.json`),
    JSON.stringify({ machine: tag, at: index.at, files: files.length, bytes: total }, null, 2) + '\n'
  );

  const extra = ensureTreeSettings(STATE);

  // ── git, BY NAMED PATH on the commit and not only on the add ──
  // 38ae5c2, 2026-09-04: `git commit` needs no `add` at all and takes whatever is in the shared
  // index. The state tree is not shared today and this rule still applies, because the day it is
  // shared nobody will remember to add the pathspec.
  const paths = ['data', INDEX_NAME, `machines/${tag}.json`, ...extra];
  const addR = gitTry(STATE, ['add', '--', ...paths]);
  if (!addR.ok) return done(refuse(`git add failed in the state tree: ${addR.err}`, 1), 'GIT_FAILED', { stage: 'add', why: addR.err });

  const staged = gitTry(STATE, ['diff', '--cached', '--name-only', '--', ...paths]);
  if (!staged.ok) return done(refuse(`git diff --cached failed: ${staged.err}`, 1), 'GIT_FAILED', { stage: 'diff --cached', why: staged.err });
  const changed = staged.out ? staged.out.split('\n').filter(Boolean) : [];

  let head = gitTry(STATE, ['rev-parse', '--short', 'HEAD']);
  if (changed.length === 0 && head.ok) {
    console.log(`state-sync --push · ${tag} · nothing changed since ${head.out} — no commit made.`);
    const st = writeStatus(DATA, STATE);
    printHeads(st);
    return done(0, 'NOTHING_CHANGED', { head: head.out, files: files.length, bytes: total });
  }

  const msg =
    `state: ${tag} ${index.at}\n\n` +
    `${files.length} files, ${total} bytes. Manifest v${m.man.version}, TRAVELS column.\n` +
    `Copied by stable read (stat/read/stat/read), never CopyFileW and never a hard link —\n` +
    `both of those were measured to fail silently (state-sync.js header).\n\n` +
    `Written by the pane A seat on ${tag}.\n`;
  const commit = gitTry(STATE, ['-c', 'core.autocrlf=false', 'commit', '-m', msg, '--', ...paths]);
  if (!commit.ok) return done(refuse(`git commit failed in the state tree: ${commit.err}`, 1), 'GIT_FAILED', { stage: 'commit', why: commit.err });
  head = gitTry(STATE, ['rev-parse', '--short', 'HEAD']);

  console.log(`state-sync --push · ${tag} · committed ${head.ok ? head.out : '?'} · ${changed.length} path(s) · ${mb(total)}`);

  if (noRemote) {
    console.log('  --no-remote: committed locally, NOT pushed. The other machine cannot see this yet.');
    const st = writeStatus(DATA, STATE);
    printHeads(st);
    return done(0, 'LOCAL_ONLY', { head: head.ok ? head.out : null, files: files.length, bytes: total, changed: changed.length });
  }

  // ── privacy, verified here and not accepted from anyone ──
  const priv = remotePrivacy(STATE);
  if (priv.state !== 'private') {
    console.error('');
    console.error(`  REFUSING TO PUSH: could not confirm ${priv.repo || 'the remote'} is private.`);
    console.error(`  ${priv.why}`);
    console.error('  The commit is made and is safe locally. Confirm with:');
    console.error(`      gh repo view ${priv.repo || '<owner/repo>'} --json isPrivate`);
    console.error('  then re-run --push. Failing closed is deliberate: from here, a private repo and');
    console.error('  a repo nobody could ask about read identically, and this one carries the board.');
    writeStatus(DATA, STATE);
    return done(1, 'REFUSED_PRIVACY', { privacy: priv, head: head.ok ? head.out : null });
  }
  console.log(`  privacy verified here: ${priv.repo} ${priv.why}`);

  const branch = gitTry(STATE, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const push = gitTry(STATE, ['push', '-u', 'origin', branch.ok ? branch.out : 'main']);
  if (!push.ok) {
    console.error('');
    console.error(`  PUSH FAILED — the commit stands locally, the remote does not have it: ${push.err}`);
    writeStatus(DATA, STATE);
    return done(1, 'PUSH_FAILED', { why: push.err, privacy: priv, head: head.ok ? head.out : null });
  }
  console.log(`  pushed to origin/${branch.ok ? branch.out : 'main'}`);
  const st = writeStatus(DATA, STATE);
  printHeads(st);
  return done(0, 'PUSHED', { head: head.ok ? head.out : null, files: files.length, bytes: total, privacy: priv, branch: branch.ok ? branch.out : null });
}

// ── verify ───────────────────────────────────────────────────────────────────────────────────

/**
 * Check the checked-out tree against the index that came with it.
 *
 * EVERY FAILURE NAMES THE PATH, THE SIDE, AND WHAT WAS EXPECTED. "Incomplete" is not actionable
 * at 8am on another machine — that sentence is the whole reason this function is longer than a
 * boolean.
 */
function verifyTree(STATE) {
  const indexPath = path.join(STATE, INDEX_NAME);
  if (!fs.existsSync(indexPath)) {
    return {
      ok: false,
      why: `no ${INDEX_NAME} in the state tree (${STATE}) — nothing has ever been pushed to it, or the pull did not land it.`,
      failures: [], checked: 0, index: null,
    };
  }
  let index;
  try { index = JSON.parse(fs.readFileSync(indexPath, 'utf8')); }
  catch (e) { return { ok: false, why: `${INDEX_NAME} will not parse: ${e.message}`, failures: [], checked: 0, index: null }; }

  const failures = [];
  const destRoot = path.join(STATE, 'data');
  const claimed = new Set();
  for (const f of index.files) {
    claimed.add(f.path);
    const p = path.join(destRoot, f.path.split('/').join(path.sep));
    let st;
    try { st = fs.statSync(p); } catch (_) {
      failures.push({
        path: f.path, kind: 'ABSENT',
        expected: `${f.bytes} bytes, sha256 ${f.sha256.slice(0, 12)}…`,
        found: 'no such file in the pulled tree',
        where: path.join('data', f.path),
      });
      continue;
    }
    if (st.size !== f.bytes) {
      failures.push({
        path: f.path, kind: 'SIZE',
        expected: `${f.bytes} bytes`, found: `${st.size} bytes`,
        where: path.join('data', f.path),
        note: st.size < f.bytes ? 'SHORT — a truncated arrival, not a stale one' : 'LONGER than the pushed file',
      });
      continue;
    }
    const got = sha256(fs.readFileSync(p));
    if (got !== f.sha256) {
      failures.push({
        path: f.path, kind: 'CONTENT',
        expected: `sha256 ${f.sha256}`, found: `sha256 ${got}`,
        where: path.join('data', f.path),
        note: 'right length, wrong bytes — check .gitattributes `* -text`; a CRLF rewrite lands here',
      });
    }
  }

  // A file in the tree that the index does not claim is not a failure of completeness, but it is
  // a disagreement between the index and the tree and it is reported: it means a path stopped
  // travelling and its stale copy is still sitting at the destination looking current.
  const strays = [];
  (function rec(dir, rel) {
    let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const e of entries) {
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) rec(path.join(dir, e.name), r);
      else if (!claimed.has(r)) strays.push(r);
    }
  })(destRoot, '');

  return {
    ok: failures.length === 0, why: null, failures, strays,
    checked: index.files.length, index,
  };
}

function reportVerify(v, STATE) {
  if (!v.index) {
    console.error(`state-sync --verify: ${v.why}`);
    return 1;
  }
  console.log(`state-sync --verify · ${STATE}`);
  console.log(`  index: ${v.index.files.length} files, ${v.index.totals.bytes} bytes, pushed by ${v.index.machine} at ${v.index.at}`);
  if (v.strays && v.strays.length) {
    console.log(`  ${v.strays.length} file(s) in the tree the index does not claim (stale, or a path that stopped travelling):`);
    for (const s of v.strays.slice(0, 20)) console.log(`    data/${s}`);
    if (v.strays.length > 20) console.log(`    … and ${v.strays.length - 20} more`);
  }
  if (v.ok) {
    console.log(`  COMPLETE — ${v.checked} of ${v.checked} files present, right length, right bytes.`);
    return 0;
  }
  console.error('');
  console.error(`  INCOMPLETE — ${v.failures.length} of ${v.checked} file(s) failed. Each one, by name:`);
  for (const f of v.failures) {
    console.error(`    ${f.kind.padEnd(8)} ${f.path}`);
    console.error(`             at:       ${STATE}${path.sep}${f.where}`);
    console.error(`             expected: ${f.expected}`);
    console.error(`             found:    ${f.found}`);
    if (f.note) console.error(`             note:     ${f.note}`);
  }
  console.error('');
  console.error('  This machine must not start on this set. Re-pull, or push again from the machine');
  console.error(`  that wrote the index (${v.index.machine}).`);
  return 1;
}

// ── pull ─────────────────────────────────────────────────────────────────────────────────────

function cmdPull(args) {
  const DATA = dataDir();
  const STATE = stateDir();
  const doInstall = args.includes('--install');
  if (!DATA) return refuse('no corpus declared — CONSONANCE_DATA unset and ~/.consonance.json has no data_dir', 2);
  if (!fs.existsSync(path.join(STATE, '.git'))) return refuse(`state tree is not a git repository: ${STATE}`, 2);

  const fetch = gitTry(STATE, ['fetch', 'origin']);
  if (!fetch.ok) {
    writeCompletion(DATA, STATE, { verified: false, installed: false, stage: 'fetch', why: fetch.err, failures: [] });
    return refuse(`git fetch failed — nothing changed locally: ${fetch.err}`, 1);
  }
  const branch = gitTry(STATE, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const br = branch.ok && branch.out !== 'HEAD' ? branch.out : 'main';

  // FAST-FORWARD ONLY. A merge on the state tree would mean two machines wrote the same
  // append-only file between syncs, and the honest answer to that is a conflict a person looks
  // at — not a resolution this tool invents at 8am.
  const ff = gitTry(STATE, ['merge', '--ff-only', `origin/${br}`]);
  if (!ff.ok) {
    writeCompletion(DATA, STATE, { verified: false, installed: false, stage: 'fast-forward', why: ff.err, failures: [] });
    return refuse(
      `NOT A FAST-FORWARD — this machine has state the remote does not, or the histories diverged:\n  ${ff.err}\n` +
      '  Refusing to merge. Two machines appending to the same ledger between syncs is the case\n' +
      '  the manifest names as its own precondition; it wants a person, not an automatic merge.', 1
    );
  }

  const v = verifyTree(STATE);
  const rc = reportVerify(v, STATE);
  const head = gitTry(STATE, ['rev-parse', '--short', 'HEAD']);

  if (!v.ok) {
    writeCompletion(DATA, STATE, {
      verified: false, installed: false, stage: 'verify',
      why: v.why || `${v.failures.length} file(s) failed the completeness check`,
      failures: v.failures, head: head.ok ? head.out : null,
    });
    writeStatus(DATA, STATE);
    return rc || 1;
  }

  let installed = false;
  let installedInto = null;
  let rec = null;
  let counts = {};
  if (doInstall) {
    const r = installTree(DATA, STATE, v);
    if (r.rc !== 0) {
      // IT SAYS SO. Until D056-1 this branch exited non-zero and printed NOTHING — the record
      // carried `why` and the operator at the terminal got a bare exit code, which is the same
      // shape as the morning that started all of this. Found by a surviving mutant: nothing could
      // tell a refused install from a silent one, because there was nothing to read.
      console.error('');
      console.error(`  INSTALL REFUSED — nothing further was written: ${r.why}`);
      console.error(`  ${r.wrote} file(s) had already landed before the refusal; ${COMPLETION_NAME} records installed:false.`);
      writeCompletion(DATA, STATE, {
        verified: true, installed: false, reconciled: false, stage: 'install', why: r.why, failures: [],
        missing: [], installed_files: r.wrote, head: head.ok ? head.out : null,
      });
      writeStatus(DATA, STATE);
      return r.rc;
    }
    counts = { installed_files: r.wrote, skipped_identical: r.skipped, displaced_files: r.displaced };
    console.log(`  installed ${r.wrote} file(s) into ${DATA}; ${r.skipped} already identical; ${r.displaced} displaced file(s) kept at ${r.backup || '(none)'}`);

    // AND NOW THE ONLY LINE THAT IS ENTITLED TO SAY THE SET ARRIVED. Everything above is this
    // process describing its own actions; reconcileInstall reads the destination. See its header.
    rec = reconcileInstall(DATA, v);
    reportReconcile(rec);
    if (!rec.ok) {
      // EXIT 1, AND `installed: false`.
      //
      // The competing option was to print loudly and exit 0 on the grounds that a launcher reading
      // sync-completion.json can already refuse. It is refused for three reasons. (1) The launcher
      // is not the only caller — a shell, a hook, a runbook step and every `&&` read the exit code
      // and read nothing else, and exit 0 over a set that did not arrive is the exact shape of the
      // morning this was written for: "the launch reported success". (2) This file is fail-closed
      // everywhere else it can be wrong about arrival (REFUSING TO PUSH on unconfirmed privacy;
      // exit 1 on an INCOMPLETE tree); a loud-but-zero path here would be a second, weaker standard
      // for the same class of fact. (3) Redundancy is the point, not the objection: the exit code
      // and the record are two independent refusals, and the failure being fixed is precisely one
      // channel being trusted alone.
      //
      // `installed: false` is C's vocabulary, not a new field — sync_launch.rs documents
      // `stage: "install"` with `installed: false` as "the data dir was PARTLY written", which is
      // exactly true here. The partial write is NOT undone: the bytes that landed are correct and
      // what they displaced is in the attic. This says the SET did not arrive, not that nothing did.
      writeCompletion(DATA, STATE, {
        verified: true, installed: false, reconciled: false, stage: 'install',
        why: shortfallWhy(rec), failures: rec.missing, missing: rec.missing,
        reconciled_files: rec.present, reconciled_at: rec.read_at, ...counts,
        head: head.ok ? head.out : null, files: v.checked, bytes: v.index.totals.bytes,
        pushed_by: v.index.machine, pushed_at: v.index.at,
      });
      writeStatus(DATA, STATE);
      return 1;
    }
    installed = true;
    installedInto = DATA;
  } else {
    console.log('');
    console.log('  VERIFIED BUT NOT INSTALLED. The state is in the tree, not in the data dir.');
    console.log('      node consonance/tools/state-sync.js --pull --install');
    console.log('  sync-completion.json records installed:false, so a launcher that reads it can');
    console.log('  refuse rather than start on a verified set that never arrived.');
  }

  writeCompletion(DATA, STATE, {
    verified: true, installed, installed_into: installedInto, stage: 'done', why: null,
    // `null`, not `false`, when no install was attempted: nothing was reconciled because nothing
    // was landed, and a reader must not be able to mistake "not asked" for "asked and short".
    reconciled: rec ? rec.ok : null,
    reconciled_files: rec ? rec.present : null,
    reconciled_at: rec ? rec.read_at : null,
    missing: rec ? rec.missing : [],
    ...counts,
    failures: [], head: head.ok ? head.out : null, files: v.checked, bytes: v.index.totals.bytes,
    pushed_by: v.index.machine, pushed_at: v.index.at,
  });
  const st = writeStatus(DATA, STATE);
  printHeads(st);
  return 0;
}

// ── arrival transforms ───────────────────────────────────────────────────────────────────────

/**
 * A TRAVELS file may declare `on_arrival: "<name>"`, and the installer applies that transform
 * before the bytes reach the data dir.
 *
 * WHY THE CONTRACT EXISTS AT ALL, and it is the finding under the finding. `panes.json` travelled
 * with its condition written as a `precondition` — prose beside the rule saying the entry is wrong
 * if the two machines resolve different instance dirs. **A comment cannot fail.** It read as
 * clearance, it was scored as checked, and it was false in a way it could not have expressed: the
 * check PASSES here (both machines resolve `C:\Consonance\instances`) and the migrate still landed
 * a roster where 0 of 4 cwds resolved, because what is machine-bound is not the root — it is the
 * `sibling-<id>` directories minted inside it. The manifest had no way to say "TRAVELS, conditional
 * on a transform", so the condition became a comment. Now it is a name that is validated, dispatched
 * and reconciled, and a rule naming a transform nothing implements is a CLASS ERROR.
 *
 * WHY AT THE INSTALL BOUNDARY. `--install` is callable and IS called directly — B's runbook step, a
 * shell, a hook. A repair living in the launcher would let the installer land a wrong file that only
 * the launcher repairs, so every other caller gets the broken roster: a gate that exists and is not
 * on the path, which is this file's own §4 shape from L055.
 *
 * Each transform is a pair, and the second half is not optional:
 *   apply(srcBuf, ctx)            -> { buf } | { err }
 *   verify(destBuf, srcBuf, ctx)  -> { ok, why }
 * `verify` is what the reconciliation runs INSTEAD of the sha compare, because a transformed file
 * is supposed to differ from the index. It re-derives the property at the destination rather than
 * trusting that `apply` ran — same law as reconcileInstall itself.
 */
const ARRIVAL_TRANSFORMS = {
  'roster-cwds': { apply: rosterApply, verify: rosterVerify },
};

const ROSTER_NAME = 'panes.json';

function underRoot(p, root) {
  const a = path.resolve(p).toLowerCase();
  const b = path.resolve(root).toLowerCase();
  return a === b || a.startsWith(b.endsWith(path.sep) ? b : b + path.sep);
}

function readJsonArray(buf) {
  try {
    const v = JSON.parse(buf.toString('utf8').replace(/^﻿/, ''));
    return Array.isArray(v) ? { rows: v } : { err: 'not a JSON array' };
  } catch (e) { return { err: e.message }; }
}

/**
 * Mint this machine's directory for a pane, deterministically.
 *
 * DETERMINISTIC, AND THAT IS THE REQUIREMENT RATHER THAN A PREFERENCE. `main.rs`'s
 * `prepare_sibling_dir` names a dir from a FRESH uuid, which is right at birth and wrong here: a
 * random name would mint a new directory on every `--install` and orphan the previous one, so the
 * install would stop converging — and `--install` being re-runnable is what the whole reconcile
 * contract rests on. Naming from the pane id gives the same answer every time.
 *
 * `sibling-` is not decoration: `role_for_kept` decides a resumed pane is committee rather than
 * human by its cwd sitting under the instances root, so a dir minted anywhere else brings the seat
 * back as the wrong kind of thing.
 *
 * The dir is left EMPTY on purpose. `warm_resume_brief` (main.rs:5379) writes the seat's CLAUDE.md
 * from its own travelled capture tail at resume, so the intake is rebuilt from the thread rather
 * than shipped stale — but it writes with `fs::write`, which cannot create a missing parent, so the
 * directory itself must exist before the pane resumes. That is the whole reason this mints at all.
 */
function mintSiblingDir(root, pane, taken) {
  const flat = pane.replace(/-/g, '');
  for (const n of [8, 12, 16, 32]) {
    const cand = path.join(root, `sibling-${flat.slice(0, n)}`);
    if (!taken.has(cand.toLowerCase())) return cand;
  }
  return path.join(root, `sibling-${flat}`);
}

/**
 * THE ROSTER TRANSFORM. Adopt the ids and the labels; never the cwds.
 *
 * The ruling is the keeper's, verbatim (`one_house_two_machines_idea_2026-09-08.md:48`): *"the
 * laptop's seats become the seats on both machines"*, committee panes named explicitly. So the pane
 * ids are adopted — they key the capture tails, which are the thread — and the labels with them.
 *
 * The cwd is re-resolved against THIS machine, in one of two ways and no third:
 *   - the destination's own record. The roster already on disk here says which local directory held
 *     this id last time. (The copy `installTree` displaces into `attic/` is the same bytes; this
 *     reads the live file, so it does not depend on a backup having been made.)
 *   - a minted directory, for an id this machine has never seen.
 * On the FIRST sync the second arm does all the work: the two id sets were measured DISJOINT
 * (4 arrived, 5 local, no overlap), so nothing the destination held could supply a cwd for anything
 * that arrived. The first arm is what makes every LATER sync stable.
 *
 * REPLACEMENT, NOT UNION, and it is the standing ruling rather than my preference. A row the
 * destination holds and the arriving set does not is retired — which under `:48` is the design
 * executing ("a retired seat stays revivable"; its tail is in `captures/archive/`). E's D056-2
 * argues for a home-keyed union instead and its reasoning is good, but union RETAINS the
 * destination's rows on the first sync, which is the thing `:48` explicitly forbids. That is not
 * mine to overturn inside this packet. **What is mine is that a retirement must not be silent** —
 * E's F3 residual, that replacement cannot tell retire-by-design from retire-by-direction-of-sync
 * — so every dropped row is returned by name and printed.
 *
 * `home` is RECORDED AND NOT CONSUMED, deliberately, on two independent grounds:
 *   - E's F4 residual: an absent home must never default to THIS machine. If it did, D would claim
 *     L's rows as home=D while L keeps them as home=L, and the round trip doubles the roster — the
 *     exact failure union is accused of. So home is taken from the arriving row, else from the
 *     destination's prior record of that pane, else from the INDEX's pusher (the machine that
 *     wrote the set, which on a first adopt is by construction where those seats live). Never from
 *     `machineTag()`.
 *   - `KeptPane` (main.rs:3309) has three fields, so the first `write_kept()` after launch ERASES
 *     this field. A transform that decided anything by reading `home` would be deciding on a value
 *     that vanishes. This one decides by POSITION — arrived rows versus the destination's prior
 *     rows — which cannot be erased. See the hand-back: persisting `home` needs C's struct.
 */
function rosterApply(srcBuf, ctx) {
  const a = readJsonArray(srcBuf);
  if (a.err) return { err: `the arriving roster will not parse (${a.err}) — refusing to write a roster nobody can read` };

  let prior = [];
  try {
    const p = readJsonArray(fs.readFileSync(path.join(ctx.DATA, ROSTER_NAME)));
    if (!p.err) prior = p.rows;
  } catch (_) { /* first arrival here, or nothing on disk */ }
  const priorByPane = new Map(prior.filter((r) => r && typeof r.pane === 'string').map((r) => [r.pane, r]));

  const taken = new Set();
  const rows = [];
  const minted = [];
  for (const r of a.rows) {
    if (!r || typeof r.pane !== 'string' || !r.pane.trim()) {
      return { err: 'the arriving roster has a row with no pane id — refusing to guess which seat it is' };
    }
    const was = priorByPane.get(r.pane);
    let cwd = was && typeof was.cwd === 'string' && underRoot(was.cwd, ctx.instances) ? was.cwd : null;
    if (!cwd || taken.has(path.resolve(cwd).toLowerCase())) {
      cwd = mintSiblingDir(ctx.instances, r.pane, taken);
      minted.push(cwd);
    }
    taken.add(path.resolve(cwd).toLowerCase());
    const row = { pane: r.pane, cwd, label: typeof r.label === 'string' ? r.label : '' };
    const home = r.home || (was && was.home) || ctx.pushedBy;
    if (home) row.home = home;
    rows.push(row);
  }

  const arrivedIds = new Set(rows.map((r) => r.pane));
  const retired = prior.filter((r) => r && r.pane && !arrivedIds.has(r.pane)).map((r) => r.pane);
  return {
    buf: Buffer.from(JSON.stringify(rows, null, 2) + '\n', 'utf8'),
    minted, retired, adopted: rows.length,
  };
}

/**
 * The postcondition, re-derived at the destination.
 *
 * AND THE FIRST CHECK IS THE IMPORTANT ONE. `read_kept()` (main.rs:3320) is
 * `from_str(&s).ok().unwrap_or_default()` — an unparseable roster is INDISTINGUISHABLE FROM AN
 * EMPTY ONE to every caller, and `gc_captures()` builds its keep-set from that call, so a roster
 * this transform garbled would not read as a broken roster: it would read as zero kept panes and
 * archive every committee tail in the house. That reader is E's D056-2 F1, and the librarian found
 * it already cost a visible failure on 2026-08-15 (`journal/2026-08-17.md:95`) with the writing
 * half fixed and the swallowing half left. This arrival path is about to become its second writer.
 * Fixing `read_kept()` is C's; refusing to be the writer that feeds it garbage is mine, and it is
 * this line.
 */
function rosterVerify(destBuf, srcBuf, ctx) {
  const d = readJsonArray(destBuf);
  if (d.err) {
    return { ok: false, why: `the roster at the destination will not parse (${d.err}). read_kept() reads that as ZERO kept panes, not as an error, and gc_captures() would archive every tail.` };
  }
  const s = readJsonArray(srcBuf);
  if (s.err) return { ok: false, why: `the arriving roster will not parse (${s.err})` };

  const want = s.rows.filter((r) => r && r.pane).map((r) => r.pane);
  const got = d.rows.map((r) => (r && r.pane) || '(no pane id)');
  if (got.length !== want.length || want.some((p, i) => got[i] !== p)) {
    return { ok: false, why: `the adopted ids are not the arriving set — wanted [${want.join(', ')}], found [${got.join(', ')}]` };
  }
  for (const r of d.rows) {
    if (typeof r.cwd !== 'string' || !r.cwd) return { ok: false, why: `${r.pane}: no cwd at the destination` };
    if (!underRoot(r.cwd, ctx.instances)) {
      return { ok: false, why: `${r.pane}: cwd is not under this machine's instances root (${ctx.instances}): ${r.cwd}` };
    }
    let st;
    try { st = fs.statSync(r.cwd); } catch (_) {
      return { ok: false, why: `${r.pane}: cwd does not resolve on this machine: ${r.cwd}` };
    }
    if (!st.isDirectory()) return { ok: false, why: `${r.pane}: cwd is not a directory: ${r.cwd}` };
  }
  return { ok: true, why: null };
}

/** The context every transform is handed. Resolved HERE, never from the arriving set. */
function arrivalCtx(DATA, STATE, v, over) {
  const o = over || {};
  let rules = o.rules;
  if (!rules) {
    const m = loadManifest();
    if (m.errors.length) return { err: m.errors };
    rules = m.rules;
  }
  return {
    DATA, rules,
    state: o.state || STATE,
    instances: o.instances || instancesRoot(),
    pushedBy: o.pushedBy || (v && v.index && v.index.machine) || null,
  };
}

/** The transform a path must go through on arrival, or null. First match wins, as classify does. */
function transformFor(rel, rules) {
  const r = (rules || []).find((r) => r.re.test(rel));
  return r && r.on_arrival ? { name: r.on_arrival, ...ARRIVAL_TRANSFORMS[r.on_arrival] } : null;
}

/**
 * Write the verified tree into the data dir, keeping whatever it displaces.
 *
 * Every file it is about to overwrite goes to `attic/pre-sync-<stamp>/` FIRST. This machine's own
 * board and tails are the only copy of what happened here, and a sync that arrives wrong must be
 * reversible on the machine it arrived at — otherwise the first bad sync is permanent on both.
 */
function installTree(DATA, STATE, v, over) {
  const ctx = arrivalCtx(DATA, STATE, v, over);
  if (ctx.err) {
    return { rc: 1, wrote: 0, displaced: 0, skipped: 0, backup: null, notes: [],
      why: `the manifest has class errors, so nothing can be classified or transformed: ${ctx.err.join('; ')}` };
  }
  const destRoot = path.join(STATE, 'data');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(DATA, 'attic', `pre-sync-${stamp}`);
  let wrote = 0;
  let displaced = 0;
  let skipped = 0;
  let madeBackup = false;
  const notes = [];
  for (const f of v.index.files) {
    const src = path.join(destRoot, f.path.split('/').join(path.sep));
    const dst = path.join(DATA, f.path.split('/').join(path.sep));

    // THE TRANSFORM RUNS BEFORE THE COMPARE, and that ordering is not cosmetic: comparing the
    // destination against the UNtransformed bytes would rewrite the file on every install and
    // report it as changed forever, because a transformed file is supposed to differ from what
    // arrived. `want` is what this machine is entitled to have on disk.
    const t = transformFor(f.path, ctx.rules);
    let want;
    if (t) {
      if (!t.apply) {
        return { rc: 1, wrote, displaced, skipped, backup: madeBackup ? backup : null, notes,
          why: `${f.path}: the manifest names arrival transform '${t.name}' and nothing implements it` };
      }
      const r = t.apply(fs.readFileSync(src), ctx);
      if (r.err) {
        return { rc: 1, wrote, displaced, skipped, backup: madeBackup ? backup : null, notes,
          why: `${f.path}: the '${t.name}' arrival transform refused — ${r.err}` };
      }
      want = r.buf;
      // EVERY directory the roster promises is made to exist HERE, before anything reads the file:
      // a cwd naming a directory that is not there is not this machine's roster. It walks the
      // OUTPUT rather than just the newly-minted ones on purpose — a dir recorded last time and
      // deleted since is the same defect arriving by a different door, and `mkdir -p` on one that
      // already exists costs nothing and keeps the install idempotent.
      for (const row of readJsonArray(want).rows || []) {
        if (row && row.cwd) fs.mkdirSync(row.cwd, { recursive: true });
      }
      notes.push({
        path: f.path, transform: t.name,
        adopted: r.adopted, minted: (r.minted || []).length, retired: r.retired || [],
      });
    } else {
      want = fs.readFileSync(src);
    }

    let cur = null;
    try { cur = fs.readFileSync(dst); } catch (_) { /* nothing there */ }
    if (cur) {
      // ALREADY IDENTICAL IS COUNTED, NOT DROPPED. `wrote` alone made a benign skip and a file
      // that never arrived print the same smaller number — which is how `installed 46 file(s)`
      // over a set of 47 read as a mystery on 2026-09-09 instead of as arithmetic that closes.
      if (cur.equals(want)) { skipped++; continue; } // touching it would only churn mtimes
      const b = path.join(backup, f.path.split('/').join(path.sep));
      fs.mkdirSync(path.dirname(b), { recursive: true });
      fs.writeFileSync(b, cur);
      madeBackup = true;
      displaced++;
    }
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, want);
    wrote++;
  }
  return { rc: 0, wrote, displaced, skipped, notes, backup: madeBackup ? backup : null, why: null };
}

/**
 * Ask the DATA DIR what it holds, and NAME the difference from what verified.
 *
 * WHY THIS EXISTS, verbatim from the morning it was written. `--install` printed
 *
 *     COMPLETE — 47 of 47 files present, right length, right bytes.
 *     installed 46 file(s) into C:\Consonance\data; 16 displaced file(s) kept at …
 *
 * and the line did not name the one. It was `data/captures/0c0c0c0b-…-115b.txt`, the librarian
 * seat's own capture tail, and that seat then woke with no past at all. Nobody could act on `46`,
 * because 46 names nothing; the launch reported success.
 *
 * THE DEFECT IS NOT THE MISSING FILE. It is that `installed 46 file(s) into <DATA>` is a claim
 * ABOUT THE DATA DIR taken from the tool's own bookkeeping — `wrote` counts calls to
 * `fs.writeFileSync` and nothing else. It cannot see a file skipped as already-identical (present
 * and correct), and it cannot see a file removed after the write by anything else on the machine.
 * Both print as a smaller number and neither prints as a path.
 *
 * So this function takes NOTHING from `installTree`. It walks the INDEX — the artefact the caller
 * holds and can re-derive — and stats and hashes each path AT THE DESTINATION. Same rule as
 * close.js: a reading is not a state, and the only thing entitled to say what the data dir holds
 * is the data dir.
 *
 * Its vocabulary is verifyTree's on purpose (ABSENT / SIZE / CONTENT): whoever can read one report
 * at 8am on the other machine can read this one, and the two are about the two different places a
 * set can go wrong — the tree, and the dir the app actually opens.
 *
 * WHAT IT DOES NOT CLAIM. It is a reading taken at one instant, and a process that removes a file
 * AFTER it returns leaves it green. That is not hypothetical: it is precisely what happened here
 * (gc_captures() renamed the tail away at 14:59:06.000Z; this tool wrote `installed: true` at
 * 14:59:06.172Z). A reading cannot be a lock. What it changes is that the record now says what was
 * read, when, and which paths — so the next investigation starts from evidence and not from 46.
 */
function reconcileInstall(DATA, v, over) {
  const missing = [];
  // The state dir is resolved LAZILY, and only by the one branch that reads it (a transformed path's
  // arriving copy, below). Resolving it up front made every reconcile — including ones with no
  // transformed path at all — depend on stateDir(), so a machine with no state_dir declared could not
  // reconcile an ordinary install (L065, pane E; found as six red reconcileInstall tests in L062 R-C1 §3).
  const ctx = arrivalCtx(DATA, (over && over.state) || null, v, over);
  const rules = ctx.err ? [] : ctx.rules;
  for (const f of v.index.files) {
    const p = path.join(DATA, f.path.split('/').join(path.sep));
    const expectedShort = `${f.bytes} bytes, sha256 ${f.sha256.slice(0, 12)}…`;

    // A TRANSFORMED PATH IS NOT RECONCILED BY ITS HASH, because it is SUPPOSED to differ from the
    // index — the whole point of the transform is that the bytes this machine should hold are not
    // the bytes that arrived. Hashing it would fail the roster on every single install. So the
    // claim is re-derived instead: the transform's own postcondition, run against the destination.
    // That keeps the L055 law intact — the answer still comes from reading the destination, never
    // from the tool's record of having run.
    const t = transformFor(f.path, rules);
    if (t && t.verify) {
      let destBuf, srcBuf;
      try { destBuf = fs.readFileSync(p); } catch (_) {
        missing.push({ path: f.path, kind: 'ABSENT', expected: expectedShort,
          found: 'no such file in the data dir', where: p });
        continue;
      }
      try { srcBuf = fs.readFileSync(path.join(ctx.state || stateDir(), 'data', f.path.split('/').join(path.sep))); }
      catch (e) {
        missing.push({ path: f.path, kind: 'TRANSFORM', expected: `the '${t.name}' postcondition`,
          found: `the arriving copy could not be re-read from the state tree: ${e.message}`, where: p });
        continue;
      }
      const r = t.verify(destBuf, srcBuf, ctx);
      if (!r.ok) {
        missing.push({ path: f.path, kind: 'TRANSFORM',
          expected: `the '${t.name}' arrival transform's postcondition`,
          found: r.why, where: p,
          note: 'the bytes are allowed to differ from the index here; the PROPERTY is not' });
      }
      continue;
    }

    let st;
    try { st = fs.statSync(p); } catch (_) {
      missing.push({
        path: f.path, kind: 'ABSENT', expected: expectedShort,
        found: 'no such file in the data dir', where: p,
      });
      continue;
    }
    if (!st.isFile()) {
      missing.push({
        path: f.path, kind: 'ABSENT', expected: expectedShort,
        found: 'a directory stands here, not a file', where: p,
      });
      continue;
    }
    if (st.size !== f.bytes) {
      missing.push({
        path: f.path, kind: 'SIZE', expected: `${f.bytes} bytes`, found: `${st.size} bytes`, where: p,
        note: st.size < f.bytes ? 'SHORT — a truncated landing, not a stale one' : 'LONGER than the verified file',
      });
      continue;
    }
    let got;
    try { got = sha256(fs.readFileSync(p)); } catch (e) {
      missing.push({
        path: f.path, kind: 'UNREADABLE', expected: expectedShort,
        found: `right length, but this machine cannot read it: ${e.message}`, where: p,
      });
      continue;
    }
    if (got !== f.sha256) {
      missing.push({
        path: f.path, kind: 'CONTENT', expected: `sha256 ${f.sha256}`, found: `sha256 ${got}`, where: p,
        note: 'right length, wrong bytes — something on THIS machine rewrote it after the install',
      });
    }
  }
  return {
    ok: missing.length === 0, missing,
    claimed: v.index.files.length, present: v.index.files.length - missing.length,
    read_at: new Date().toISOString(), data_dir: DATA,
  };
}

/** The `why` that rides to C's board row: short enough for one line, and it carries PATHS. */
function shortfallWhy(rec) {
  const named = rec.missing.map((m) => `${m.kind} ${m.path}`);
  return `${rec.missing.length} of ${rec.claimed} verified file(s) are not in the data dir: `
    + named.slice(0, 3).join('; ')
    + (named.length > 3 ? `; and ${named.length - 3} more (all of them under missing[])` : '');
}

function reportReconcile(rec) {
  if (rec.ok) {
    console.log(`  RECONCILED — ${rec.present} of ${rec.claimed} verified file(s) are in ${rec.data_dir}, right length, right bytes.`);
    return 0;
  }
  console.error('');
  console.error(`  SHORTFALL — the tree verified ${rec.claimed} file(s); ${rec.data_dir} holds ${rec.present}. Each difference, BY NAME:`);
  for (const m of rec.missing) {
    console.error(`    ${m.kind.padEnd(10)} ${m.path}`);
    console.error(`             at:       ${m.where}`);
    console.error(`             expected: ${m.expected}`);
    console.error(`             found:    ${m.found}`);
    if (m.note) console.error(`             note:     ${m.note}`);
  }
  console.error('');
  console.error('  A COUNT IS NOT ACTIONABLE AND A PATH IS. Do not wake a seat from this set: the bytes');
  console.error('  are still in the state tree and every path above is recoverable from it —');
  console.error('      git -C <state tree> show origin/main:data/<path>');
  console.error(`  ${COMPLETION_NAME} records installed:false with these paths under \`missing\`, and the`);
  console.error('  exit code is 1, so a caller that reads only the exit code still refuses.');
  return 1;
}

/**
 * The record C's launch reads.
 *
 * STAYS by the manifest: if it travelled, the desktop would read the laptop's verification as its
 * own — foreign state read as self, which is install_id's failure in a second costume. `verified`
 * and `installed` are SEPARATE fields on purpose: a set that verified and never reached the data
 * dir is the quiet half-arrival this packet exists to prevent, and a launcher that only asks
 * "verified?" would start on it.
 */
function writeCompletion(DATA, STATE, o) {
  const rec = {
    version: 1,
    written_by: 'consonance/tools/state-sync.js',
    at: new Date().toISOString(),
    machine: machineTag(),
    state_dir: STATE,
    data_dir: DATA,
    ...o,
  };
  try { fs.writeFileSync(path.join(DATA, COMPLETION_NAME), JSON.stringify(rec, null, 2) + '\n'); }
  catch (e) { console.error(`  could not write ${COMPLETION_NAME}: ${e.message}`); }
  return rec;
}

// ── output helpers ───────────────────────────────────────────────────────────────────────────

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';

function refuse(msg, code) {
  console.error('state-sync: ' + msg);
  return code;
}

function printHeads(st) {
  if (!st.machines.length) { console.log('  in sync: no machine has pushed yet'); return; }
  console.log('  in sync: ' + st.machines.map((m) => `${m.machine} ${m.commit || 'never'}`).join(' · '));
}

function cmdStatus() {
  const DATA = dataDir();
  const STATE = stateDir();
  if (!fs.existsSync(path.join(STATE, '.git'))) return refuse(`state tree is not a git repository: ${STATE}`, 2);
  const st = writeStatus(DATA, STATE);
  console.log(JSON.stringify(st, null, 2));
  return 0;
}

function main() {
  const args = process.argv.slice(2);
  let rc;
  if (args.includes('--push')) rc = cmdPush(args);
  else if (args.includes('--pull')) rc = cmdPull(args);
  else if (args.includes('--verify')) rc = reportVerify(verifyTree(stateDir()), stateDir());
  else if (args.includes('--status')) rc = cmdStatus();
  else {
    console.error('usage: state-sync.js --push [--dry-run] [--no-remote] | --pull [--install] | --verify | --status');
    rc = 2;
  }
  process.exit(rc);
}

if (require.main === module) main();
module.exports = {
  stableRead, sha256, classify, loadManifest, verifyTree, installTree, reconcileInstall,
  ARRIVAL_TRANSFORMS, instancesRoot, transformFor, underRoot, mintSiblingDir,
  machineHeads, machineTag, stateDir, dataDir, ensureTreeSettings, remotePrivacy, writeStatus, gitTry,
  FILE_CAP, STABLE_TRIES, SETTLE_MS, INDEX_NAME, STATUS_NAME, COMPLETION_NAME, RECEIPT_NAME,
};
