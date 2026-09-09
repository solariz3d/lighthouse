#!/usr/bin/env node
'use strict';
/* board-compact.js — remove the launch replays from board.jsonl once, keeping the original whole.
 *
 * WHY THIS EXISTS. The board is 338,571,518 bytes over 268,753 lines and 89.0% of those lines are
 * byte-identical copies of a line already in the file. The cause is closed (C, L051: persisted
 * tailer offsets; `replay-check --score` PASS, 6 transcript-sourced rows against a bound of 177),
 * so this is a one-time cleanup and not a treadmill. The board has to travel between two machines
 * and GitHub's per-file hard limit is 100 MB.
 *
 * ── THE RULE, AND THE RULE THAT WAS REFUSED ───────────────────────────────────────────────────
 *
 * The plan (`loop/two_machines_lap_plan_2026-09-09.md` §1) named the rule as "the audit's own
 * rule — rows behind the running ts maximum". THAT RULE IS REFUSED HERE, on measurement.
 *
 * `board-audit.js` calls the backward timestamp "the replay TELL", and it is right: it is a tell,
 * not a definition. The board is written by seven concurrent panes carrying TRANSCRIPT
 * timestamps, so a row lands behind the running maximum whenever one pane's turn began before
 * another pane's turn ended. That is ordinary committee traffic, not replay. Measured on the live
 * board before anything was written:
 *
 *     behind the running ts maximum                       243,406
 *       ... byte-identical to an earlier line             239,033   replay
 *       ... same (pane,role,text), different ts             1,620   ambiguous, could be a real turn
 *       ... content NEVER SEEN BEFORE in the file           2,753   REAL ROWS, UNIQUELY HELD
 *
 * The 2,753 are chair dispatches, pane hand-backs and cycle-9 execution rows. Deleting them buys
 * 44.7 MB -> 38.1 MB. That is 6.6 MB against a bound of 100 MB, for 4,373 rows of record that
 * exist nowhere else in the file. The packet's falsifier is "any reader that changes its answer
 * for a row that was NOT a replay", and the behind-the-maximum rule fires it by construction.
 *
 * SO THE RULE IS: drop a line only when a BYTE-IDENTICAL line appeared earlier in the file. First
 * copy kept, file order preserved, everything else carried verbatim — unparseable lines included.
 * This is lossless by construction: the output is exactly the original's distinct lines in
 * first-occurrence order, which is why `verifyPair()` below can re-derive it and say no.
 *
 * The two keys were measured against each other and agree: de-duplicating on the whole line and
 * de-duplicating on (pane,role,text,ts) both leave 29,684 rows, so no two lines on this board
 * share a tuple while differing in bytes. The whole line is the stricter of the two and is what
 * ships — a rule that cannot lose a field it did not think to look at.
 *
 * ── WHAT IT DOES NOT DO ───────────────────────────────────────────────────────────────────────
 *
 * It does not repair the 257 torn lines (two JSON objects concatenated by an interleaved write).
 * They are carried byte-for-byte. Repairing them is mutating the record and belongs to whoever
 * owns the writer, not to a compaction.
 *
 *   node consonance/tools/board-compact.js                       # DRY RUN — counts and sizes, writes nothing
 *   node consonance/tools/board-compact.js --out copy.jsonl      # compacted copy, board untouched
 *   node consonance/tools/board-compact.js --apply               # attic the original, swap in the compacted board
 *   node consonance/tools/board-compact.js --verify ORIG NEW     # re-derive the check from two files
 *
 * --board PATH overrides the board; CONSONANCE_BOARD and CONSONANCE_DATA are honoured in that
 * order. There is no literal fallback path in this file: a tool that guesses a data dir reports
 * about a disk nobody asked about (`loop/machine_bound_class_2026-08-25.md`).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

/** Named in the source so a change of rule turns the test file red rather than passing quietly. */
const DEFAULT_KEEP = 'byte-identical-repeat';

const READ_CHUNK = 8 * 1024 * 1024;

/* The decision, and the only place a row is ever refused. `accept()` is called once per line in
 * file order and answers one question: has this exact line already been written out?
 *
 * A sha1 of the line rather than the line itself: 29,684 distinct lines average 1.5 KB, so the
 * set is ~45 MB of strings held for the length of one pass otherwise. Collision risk on 268,753
 * inputs is not the failure mode worth designing against here — but `verifyPair()` re-derives the
 * whole comparison from the two files afterwards with the same hash, so a collision would have to
 * survive being checked by a second independent pass to lose a row silently. */
class Compactor {
  constructor() {
    this.seen = new Set();
    this.kept = 0;
    this.dropped = 0;
  }
  accept(line) {
    if (line === '') return false;          // a blank is not a row, and was never a dropped one
    const h = crypto.createHash('sha1').update(line, 'utf8').digest('base64');
    if (this.seen.has(h)) { this.dropped++; return false; }
    this.seen.add(h);
    this.kept++;
    return true;
  }
}

/* Split a buffer of text into complete lines, handing back the torn tail UNCONSUMED.
 *
 * `consumed` is BYTES, not characters, because it is compared against fs.stat().size in the
 * catch-up. A character count drifts by one per non-ASCII character and the next pass would then
 * either re-read a row or skip one — and this board is full of em-dashes. */
function splitComplete(text) {
  const nl = text.lastIndexOf('\n');
  if (nl < 0) return { lines: [], rest: text, consumed: 0 };
  const whole = text.slice(0, nl);
  return {
    lines: whole.split('\n'),
    rest: text.slice(nl + 1),
    consumed: Buffer.byteLength(text.slice(0, nl + 1), 'utf8'),
  };
}

/** Read [from, to) of a file as UTF-8. */
function readRange(file, from, to) {
  if (to <= from) return '';
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(to - from);
    let got = 0;
    while (got < buf.length) {
      const n = fs.readSync(fd, buf, got, buf.length - got, from + got);
      if (n <= 0) break;
      got += n;
    }
    return buf.slice(0, got).toString('utf8');
  } finally { fs.closeSync(fd); }
}

/* One pass over `src` from byte `consumed` to its current end, appending whatever survives the
 * compactor to `out`. Returns how many rows were added and the new consumed offset.
 *
 * THIS IS THE LIVE-WRITER HALF and it is not optional. The app appends to board.jsonl on every
 * turn of every pane; a compaction that reads to EOF and then swaps loses every row written in
 * between, and nothing downstream would ever say so. */
function catchUp(src, out, consumed, compactor) {
  const size = fs.statSync(src).size;
  if (size <= consumed) return { added: 0, consumed };
  const text = readRange(src, consumed, size);
  const { lines, consumed: used } = splitComplete(text);
  const keep = lines.filter(l => compactor.accept(l));
  if (keep.length) fs.appendFileSync(out, keep.join('\n') + '\n');
  return { added: keep.length, consumed: consumed + used };
}

/* Re-derive the whole claim from the two files, independently of the run that produced them.
 *
 * This is what makes the falsifier checkable rather than asserted: the compacted file must BE the
 * original's distinct lines in first-occurrence order — no row missing, no row invented, no row
 * moved, and no replay left behind. It is a streaming zip of the two files, so it holds the seen
 * set and nothing else. */
function verifyPair(origPath, newPath) {
  const seen = new Set();
  const hash = s => crypto.createHash('sha1').update(s, 'utf8').digest('base64');

  const expect = [];                 // pending expected lines, drained against the compacted file
  let originalLines = 0, compactedLines = 0, dropped = 0;
  let bad = null;

  const newIt = lineIterator(newPath);
  for (const line of lineIterator(origPath)) {
    originalLines++;
    const h = hash(line);
    if (seen.has(h)) { dropped++; continue; }
    seen.add(h);
    const got = newIt.next();
    if (got.done) { bad = bad || `compacted file ended early: missing "${clip(line)}" (original line ${originalLines})`; break; }
    compactedLines++;
    if (got.value !== line) {
      // A deleted row and a moved row are the same event from here — the streaming zip cannot
      // tell them apart without lookahead, so the message names both rather than picking one and
      // sending the reader looking for the wrong thing.
      bad = `line ${compactedLines} of the compacted file breaks the original's first-occurrence order: expected "${clip(line)}"`
        + ` — that row is missing from this position, or the order changed — found "${clip(got.value)}"`;
      break;
    }
  }
  if (!bad) {
    const extra = newIt.next();
    if (!extra.done) bad = `the compacted file holds a row that is not in the original at that position (extra: "${clip(extra.value)}")`;
  }
  newIt.return && newIt.return();
  void expect;
  return {
    ok: !bad,
    why: bad || 'the compacted file is the original\'s distinct lines in first-occurrence order',
    originalLines, compactedLines, dropped,
  };
}

const clip = s => (s.length > 90 ? s.slice(0, 90) + '…' : s);

/** Stream a file as complete lines. A torn final line with no newline is still a line here — the
 *  board's last row has no trailing newline while it is being written, and dropping it would make
 *  the verifier disagree with the compactor about what the file holds. */
function* lineIterator(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(READ_CHUNK);
    let rest = '';
    let pos = 0;
    for (;;) {
      const n = fs.readSync(fd, buf, 0, buf.length, pos);
      if (n <= 0) break;
      pos += n;
      const s = rest + buf.slice(0, n).toString('utf8');
      const nl = s.lastIndexOf('\n');
      if (nl < 0) { rest = s; continue; }
      const whole = s.slice(0, nl).split('\n');
      rest = s.slice(nl + 1);
      for (const l of whole) if (l !== '') yield l;
    }
    if (rest !== '') yield rest;
  } finally { fs.closeSync(fd); }
}

/* One full pass: read `src` to its current end, writing the survivors to `dest`. Returns the
 * compactor (carrying the seen set, so the catch-up continues the same de-duplication) and the
 * byte offset reached. */
function compactTo(src, dest) {
  const compactor = new Compactor();
  const size = fs.statSync(src).size;
  const fd = fs.openSync(src, 'r');
  const outFd = fs.openSync(dest, 'w');
  let consumed = 0;
  try {
    const buf = Buffer.alloc(READ_CHUNK);
    let rest = '';
    let pos = 0;
    let pending = [];
    const flush = () => {
      if (!pending.length) return;
      fs.writeSync(outFd, pending.join('\n') + '\n');
      pending = [];
    };
    while (pos < size) {
      const n = fs.readSync(fd, buf, 0, Math.min(buf.length, size - pos), pos);
      if (n <= 0) break;
      pos += n;
      const s = rest + buf.slice(0, n).toString('utf8');
      const { lines, rest: r, consumed: used } = splitComplete(s);
      // `used` counts bytes of `s`, which includes the carried-over `rest` from the previous
      // chunk; consumed therefore tracks bytes of the SOURCE, computed as pos minus what is
      // still held back.
      void used;
      rest = r;
      for (const l of lines) if (compactor.accept(l)) pending.push(l);
      if (pending.length > 2000) flush();
      consumed = pos - Buffer.byteLength(rest, 'utf8');
    }
    if (rest !== '' && compactor.accept(rest)) { pending.push(rest); consumed = pos; }
    flush();
  } finally { fs.closeSync(fd); fs.closeSync(outFd); }
  return { compactor, consumed };
}

function dataDir() {
  const env = (process.env.CONSONANCE_DATA || '').trim();
  if (env) return env;
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, ''));
    if (cfg.data_dir) return cfg.data_dir;
  } catch (_) { /* fall through */ }
  return null;
}

const mb = n => (n / 1048576).toFixed(1) + ' MB';

function die(msg) { console.error(msg); process.exit(1); }

function main(argv) {
  const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
  const has = (name) => argv.includes(name);

  if (has('--verify')) {
    const i = argv.indexOf('--verify');
    const a = argv[i + 1], b = argv[i + 2];
    if (!a || !b) die('board-compact: --verify needs ORIGINAL and COMPACTED');
    const v = verifyPair(a, b);
    console.log(`original  ${v.originalLines} rows  ${mb(fs.statSync(a).size)}   ${a}`);
    console.log(`compacted ${v.compactedLines} rows  ${mb(fs.statSync(b).size)}   ${b}`);
    console.log(`replays removed: ${v.dropped}`);
    if (!v.ok) die(`REFUSED — ${v.why}`);
    console.log(`VERIFIED — ${v.why}`);
    return 0;
  }

  const board = arg('--board') || (process.env.CONSONANCE_BOARD || '').trim()
    || (dataDir() ? path.join(dataDir(), 'board.jsonl') : null);
  if (!board) die('board-compact: no board declared — pass --board, or set CONSONANCE_BOARD / CONSONANCE_DATA.\n'
    + '                Refusing rather than guessing a path: a report about the wrong disk reads exactly like a report about this one.');
  if (!fs.existsSync(board)) die(`board-compact: board not found: ${board}`);

  const apply = has('--apply');
  const outArg = arg('--out');
  const sizeBefore = fs.statSync(board).size;

  const tmp = outArg || (board + '.compact.' + process.pid + '.tmp');
  const { compactor, consumed } = compactTo(board, tmp);

  // The live writer. Even on --out and the dry run this pass runs, so the number reported is a
  // number about the whole file and not about the prefix that existed when the read began.
  let caught = 0, at = consumed;
  for (let i = 0; i < 8; i++) {
    const r = catchUp(board, tmp, at, compactor);
    at = r.consumed;
    caught += r.added;
    if (r.added === 0 && fs.statSync(board).size <= at) break;
  }

  const sizeAfter = fs.statSync(tmp).size;
  const report = () => {
    console.log(`board     ${board}`);
    console.log(`rule      ${DEFAULT_KEEP} — first copy kept, file order preserved`);
    console.log(`before    ${compactor.kept + compactor.dropped} rows  ${mb(sizeBefore)}`);
    console.log(`after     ${compactor.kept} rows  ${mb(sizeAfter)}`);
    console.log(`removed   ${compactor.dropped} rows  ${mb(sizeBefore - sizeAfter)}  (${(100 * compactor.dropped / (compactor.kept + compactor.dropped)).toFixed(1)}%)`);
    if (caught) console.log(`caught    ${caught} row(s) appended by the live writer during the pass`);
  };

  if (!apply) {
    if (outArg) {
      const v = verifyPair(board, tmp);
      report();
      console.log(`out       ${tmp}`);
      if (!v.ok) die(`REFUSED — ${v.why}`);
      console.log(`VERIFIED — ${v.why}`);
      return 0;
    }
    // Dry run: the temp file was only ever a scratch pad for the count. Remove it and say so.
    fs.unlinkSync(tmp);
    report();
    console.log('DRY RUN — nothing was written. Re-run with --apply to attic the original and swap the board in.');
    return 0;
  }

  // ── the swap ────────────────────────────────────────────────────────────────────────────────
  const atticDir = arg('--attic') || path.join(path.dirname(board), 'attic');
  const stamp = new Date().toISOString().slice(0, 10);
  const atticPath = path.join(atticDir, path.basename(board) + '.' + stamp);
  fs.mkdirSync(atticDir, { recursive: true });
  if (fs.existsSync(atticPath)) {
    fs.unlinkSync(tmp);
    die(`board-compact: ${atticPath} already exists. REFUSING — the original is the record and this tool does not overwrite one.`);
  }

  // Two adjacent renames, then a reconciliation against the frozen original. The window between
  // them is where a pane's row could land in a board.jsonl the app re-creates, so it is CHECKED
  // rather than assumed away: `gap` below is that file if it appeared.
  fs.renameSync(board, atticPath);
  let gap = 0;
  if (fs.existsSync(board)) {
    // The app re-created the board between the renames. Those rows are real and are carried.
    for (const l of lineIterator(board)) if (compactor.accept(l)) { fs.appendFileSync(tmp, l + '\n'); gap++; }
    fs.unlinkSync(board);
  }
  fs.renameSync(tmp, board);

  // Anything the writer appended after our last read is still in the frozen original, and now it
  // can be compared exactly rather than raced against.
  const atticSize = fs.statSync(atticPath).size;
  let late = 0;
  if (atticSize > at) {
    const { lines } = splitComplete(readRange(atticPath, at, atticSize));
    const keep = lines.filter(l => compactor.accept(l));
    if (keep.length) fs.appendFileSync(board, keep.join('\n') + '\n');
    late = keep.length;
  }

  report();
  if (gap) console.log(`recovered ${gap} row(s) written into a re-created board between the two renames`);
  if (late) console.log(`recovered ${late} row(s) appended to the original after the last read`);
  console.log(`attic     ${atticPath}  ${mb(atticSize)}  (STAYS — the record, untouched)`);
  console.log(`board     ${board}  ${mb(fs.statSync(board).size)}`);

  const v = verifyPair(atticPath, board);
  if (!v.ok) die(`REFUSED — ${v.why}\n  The original is intact at ${atticPath}. Restore it by moving that file back over ${board}.`);
  console.log(`VERIFIED — ${v.why}`);
  return 0;
}

module.exports = { Compactor, splitComplete, verifyPair, catchUp, compactTo, lineIterator, readRange, DEFAULT_KEEP };

if (require.main === module) {
  try { process.exit(main(process.argv.slice(2))); }
  catch (e) { console.error('board-compact: ' + (e && e.message ? e.message : e)); process.exit(1); }
}
