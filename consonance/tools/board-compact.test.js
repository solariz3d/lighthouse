/* Tests for board-compact.js — WRITTEN BEFORE THE TOOL, on a fixture whose replay is PLANTED.
 *
 * WHY PLANTED. The packet's bar (P-BOARD-COMPACT, 2026-09-09) is that the expected output is
 * known BEFORE the tool runs rather than inferred from what it produced. Every fixture below is
 * built by hand, row by row, with a comment on each row saying whether it survives and why. If
 * the tool's output is read back to decide what the tool should do, the test measures nothing.
 *
 * THE FIXTURE CARRIES THE FOUR CASES THAT DECIDED THE RULE, measured on the live board first
 * (338,571,518 bytes, 268,753 lines) and recorded in the hand-back:
 *
 *   1. a byte-identical replay of an earlier row              -> DROPPED   (239,073 live)
 *   2. a row BEHIND the running ts maximum, content never
 *      seen before — two panes writing concurrently with
 *      transcript timestamps                                  -> KEPT      (2,753 live)
 *   3. a row with the same (pane,role,text) as an earlier
 *      one but a DIFFERENT ts                                 -> KEPT      (1,620 live)
 *   4. a torn line (two objects concatenated, no newline)     -> KEPT      (257 live)
 *
 * Cases 2, 3 and 4 are the whole reason the behind-the-running-maximum rule named in the plan was
 * refused. They are asserted here as their own tests so that adopting that rule later turns this
 * file red rather than silently deleting 4,373 rows of record.
 *
 * HONEST ORDER. This file was written before board-compact.js existed and its first run was a
 * MODULE_NOT_FOUND — a load failure, not 22 assertion reds, so red-first here bought the fixture
 * and the expected output, not a per-assertion score. The per-assertion score is the mutation run
 * below (source restored byte-identical after each, checked by sha256):
 *
 *   M1 accept() also drops rows behind the running ts max      -> 6 failures
 *   M2 dedup keyed on (pane,role,text), ts ignored             -> 5 failures
 *   M3 keep the LAST copy instead of the first                 -> 6 failures
 *   M4 verifyPair() returns ok unconditionally                 -> 5 failures
 *   M5 catchUp() ignores bytes appended after the read         -> 1 failure
 *   M6 splitComplete() returns the torn tail as a whole line   -> 1 failure
 *
 * M5 and M6 are killed by one test each, which is thinner than it looks on paper: both are the
 * live-writer half, and on this board the live writer is the only thing between a compaction and
 * a lost row. Named here rather than left for a reader to notice.
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
  Compactor, splitComplete, verifyPair, catchUp, DEFAULT_KEEP,
} = require('./board-compact.js');

const TOOL = path.join(__dirname, 'board-compact.js');

// ── the planted fixture ────────────────────────────────────────────────────────────────────────
// Every line is written out longhand. `KEEP`/`DROP` on each row is the expected verdict, decided
// here and not read back off the tool.
const row = (pane, role, text, ts, extra) =>
  JSON.stringify(Object.assign({ pane, role, text, ts }, extra || {}));

const A = 'pane-a', B = 'pane-b';

const L = [
  /* 0  KEEP */ row(A, 'user', 'hello', 1000),
  /* 1  KEEP */ row(A, 'assistant', 'hi', 1100),
  /* 2  KEEP */ row(B, 'user', 'dispatch', 1200, { ts_source: 'transcript' }),
  /* 3  KEEP */ row(A, 'assistant', 'working', 1300),
  // case 2: B's turn began before A's finished, so this lands BEHIND the running maximum (1300)
  // while its content has never appeared. A behind-the-maximum rule destroys it.
  /* 4  KEEP */ row(B, 'assistant', 'concurrent — never seen before', 1250),
  // case 1: the launch replay. Byte-identical copies of rows 0..2, in order, at their original
  // timestamps. These are the only rows the tool may remove.
  /* 5  DROP */ row(A, 'user', 'hello', 1000),
  /* 6  DROP */ row(A, 'assistant', 'hi', 1100),
  /* 7  DROP */ row(B, 'user', 'dispatch', 1200, { ts_source: 'transcript' }),
  // case 3: the keeper says "yes" twice. Same (pane,role,text) as nothing above, but this pair is
  // the shape — two identical texts at different timestamps, both real turns.
  /* 8  KEEP */ row(A, 'user', 'yes', 1400),
  /* 9  KEEP */ row(A, 'user', 'yes', 1500),
  // and the same shape BEHIND the maximum, which is the live board's 1,620-row class.
  /* 10 KEEP */ row(A, 'user', 'yes', 1450),
  // case 4: two objects on one line, no newline between them — an interleaved write.
  /* 11 KEEP */ row(A, 'user', 'torn-left', 1600) + row(B, 'user', 'torn-right', 1601),
  /* 12 KEEP */ row(B, 'assistant', 'last', 1700),
  // a byte-identical repeat of the torn line: still a repeat, still removable.
  /* 13 DROP */ row(A, 'user', 'torn-left', 1600) + row(B, 'user', 'torn-right', 1601),
];
const KEPT_INDEXES = [0, 1, 2, 3, 4, 8, 9, 10, 11, 12];
const DROPPED_INDEXES = [5, 6, 7, 13];
const FIXTURE = L.join('\n') + '\n';
const EXPECTED = KEPT_INDEXES.map(i => L[i]).join('\n') + '\n';

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'board-compact-'));
}

// ── the rule ───────────────────────────────────────────────────────────────────────────────────

test('the planted fixture compacts to exactly the rows planted as KEEP, in file order', () => {
  const c = new Compactor();
  const kept = L.filter(l => c.accept(l));
  assert.deepStrictEqual(kept, KEPT_INDEXES.map(i => L[i]));
  assert.strictEqual(c.dropped, DROPPED_INDEXES.length);
  assert.strictEqual(c.kept, KEPT_INDEXES.length);
});

test('a row BEHIND the running ts maximum whose content is new is KEPT', () => {
  // The rule the plan named would delete this row. On the live board that class is 2,753 rows —
  // chair dispatches and pane hand-backs written while another pane's turn was still open.
  const c = new Compactor();
  for (const l of L.slice(0, 4)) c.accept(l);
  assert.strictEqual(c.accept(L[4]), true, 'concurrency is not replay');
});

test('a row with the same (pane,role,text) but a different ts is KEPT', () => {
  const c = new Compactor();
  assert.strictEqual(c.accept(L[8]), true);
  assert.strictEqual(c.accept(L[9]), true, 'the keeper may say the same word twice');
  assert.strictEqual(c.accept(L[10]), true, 'and out of ts order, when two panes interleave');
});

test('only a BYTE-IDENTICAL earlier line is a replay', () => {
  const c = new Compactor();
  const first = row(A, 'user', 'x', 1);
  assert.strictEqual(c.accept(first), true);
  assert.strictEqual(c.accept(first), false, 'the second copy is the replay');
  assert.strictEqual(c.accept(row(A, 'user', 'x', 2)), true, 'a different ts is a different row');
  assert.strictEqual(c.accept(row(A, 'user', 'x ', 1)), true, 'a different text is a different row');
  assert.strictEqual(c.accept(row(A, 'user', 'x', 1, { ts_source: 'transcript' })), true,
    'an extra field is a different line and is not assumed redundant');
});

test('an unparseable line is carried, and only its byte-identical repeat is dropped', () => {
  const c = new Compactor();
  assert.strictEqual(c.accept('not json at all'), true);
  assert.strictEqual(c.accept('not json at all'), false);
  assert.strictEqual(c.accept(L[11]), true, 'the torn line survives compaction verbatim');
});

test('an empty line is not a row and is never emitted', () => {
  const c = new Compactor();
  assert.strictEqual(c.accept(''), false);
  assert.strictEqual(c.kept, 0);
  assert.strictEqual(c.dropped, 0, 'a blank is not a dropped row — it was never a row');
});

// ── streaming mechanics ────────────────────────────────────────────────────────────────────────

test('splitComplete returns whole lines and hands back the torn tail unconsumed', () => {
  assert.deepStrictEqual(splitComplete('a\nb\nc'), { lines: ['a', 'b'], rest: 'c', consumed: 4 });
  assert.deepStrictEqual(splitComplete('a\nb\n'), { lines: ['a', 'b'], rest: '', consumed: 4 });
  assert.deepStrictEqual(splitComplete('abc'), { lines: [], rest: 'abc', consumed: 0 },
    'a half-written line is not a line yet and its bytes are not consumed');
  assert.deepStrictEqual(splitComplete(''), { lines: [], rest: '', consumed: 0 });
});

test('splitComplete counts bytes, not characters', () => {
  // The catch-up arithmetic compares against fs.stat().size. A char count here would drift by one
  // byte per non-ASCII character and re-read or skip real rows on the next pass.
  const s = 'é\n';
  assert.strictEqual(splitComplete(s).consumed, 3, 'two UTF-8 bytes plus the newline');
});

test('catchUp appends only what was written after the bytes already consumed', () => {
  const d = tmpdir();
  const src = path.join(d, 'board.jsonl');
  fs.writeFileSync(src, FIXTURE);
  const consumed = Buffer.byteLength(FIXTURE, 'utf8');
  const extra = row(B, 'user', 'arrived during the compaction', 1800) + '\n';
  fs.appendFileSync(src, extra);

  const c = new Compactor();
  for (const l of L) c.accept(l);            // the first pass already saw the fixture
  const out = path.join(d, 'out.jsonl');
  fs.writeFileSync(out, EXPECTED);

  const r = catchUp(src, out, consumed, c);
  assert.strictEqual(r.added, 1);
  assert.strictEqual(r.consumed, consumed + Buffer.byteLength(extra, 'utf8'));
  assert.strictEqual(fs.readFileSync(out, 'utf8'), EXPECTED + extra);
});

test('catchUp de-duplicates the rows it catches, and adds nothing when nothing was appended', () => {
  const d = tmpdir();
  const src = path.join(d, 'board.jsonl');
  fs.writeFileSync(src, FIXTURE);
  const consumed = Buffer.byteLength(FIXTURE, 'utf8');
  fs.appendFileSync(src, L[0] + '\n');       // a replay of row 0 arriving late

  const c = new Compactor();
  for (const l of L) c.accept(l);
  const out = path.join(d, 'out.jsonl');
  fs.writeFileSync(out, EXPECTED);

  assert.strictEqual(catchUp(src, out, consumed, c).added, 0);
  assert.strictEqual(fs.readFileSync(out, 'utf8'), EXPECTED);
  assert.strictEqual(catchUp(src, out, Buffer.byteLength(FIXTURE, 'utf8') + L[0].length + 1, c).added, 0);
});

// ── the verifier, which is the thing that has to be able to say no ─────────────────────────────

test('verifyPair passes only when the compacted file IS the first-occurrence sequence', () => {
  const d = tmpdir();
  const a = path.join(d, 'orig.jsonl'), b = path.join(d, 'new.jsonl');
  fs.writeFileSync(a, FIXTURE);
  fs.writeFileSync(b, EXPECTED);
  const v = verifyPair(a, b);
  assert.strictEqual(v.ok, true, v.why);
  assert.strictEqual(v.originalLines, L.length);
  assert.strictEqual(v.compactedLines, KEPT_INDEXES.length);
  assert.strictEqual(v.dropped, DROPPED_INDEXES.length);
});

test('verifyPair FAILS when a row that was not a replay is missing', () => {
  const d = tmpdir();
  const a = path.join(d, 'orig.jsonl'), b = path.join(d, 'new.jsonl');
  fs.writeFileSync(a, FIXTURE);
  // drop row 4 — the behind-the-maximum row with unique content. This is the mutant the packet
  // names: "drop a non-replay row => red".
  fs.writeFileSync(b, KEPT_INDEXES.filter(i => i !== 4).map(i => L[i]).join('\n') + '\n');
  const v = verifyPair(a, b);
  assert.strictEqual(v.ok, false);
  assert.match(v.why, /missing/i);
});

test('verifyPair FAILS when the order changed', () => {
  const d = tmpdir();
  const a = path.join(d, 'orig.jsonl'), b = path.join(d, 'new.jsonl');
  fs.writeFileSync(a, FIXTURE);
  const swapped = KEPT_INDEXES.map(i => L[i]);
  [swapped[1], swapped[2]] = [swapped[2], swapped[1]];
  fs.writeFileSync(b, swapped.join('\n') + '\n');
  const v = verifyPair(a, b);
  assert.strictEqual(v.ok, false);
  assert.match(v.why, /order/i);
});

test('verifyPair FAILS on a row the original never held', () => {
  const d = tmpdir();
  const a = path.join(d, 'orig.jsonl'), b = path.join(d, 'new.jsonl');
  fs.writeFileSync(a, FIXTURE);
  fs.writeFileSync(b, EXPECTED + row(A, 'user', 'invented', 9999) + '\n');
  const v = verifyPair(a, b);
  assert.strictEqual(v.ok, false);
  assert.match(v.why, /not in the original|extra/i);
});

test('verifyPair FAILS when a replay was left in', () => {
  const d = tmpdir();
  const a = path.join(d, 'orig.jsonl'), b = path.join(d, 'new.jsonl');
  fs.writeFileSync(a, FIXTURE);
  fs.writeFileSync(b, FIXTURE);
  const v = verifyPair(a, b);
  assert.strictEqual(v.ok, false, 'a no-op is not a compaction');
});

// ── the CLI, end to end ────────────────────────────────────────────────────────────────────────

const run = (args, env) => execFileSync(process.execPath, [TOOL, ...args],
  { encoding: 'utf8', env: Object.assign({}, process.env, env || {}) });

test('--out writes a compacted copy and touches neither the board nor the attic', () => {
  const d = tmpdir();
  const src = path.join(d, 'board.jsonl');
  const out = path.join(d, 'copy.jsonl');
  fs.writeFileSync(src, FIXTURE);
  const o = run(['--board', src, '--out', out]);
  assert.strictEqual(fs.readFileSync(out, 'utf8'), EXPECTED);
  assert.strictEqual(fs.readFileSync(src, 'utf8'), FIXTURE, 'the source is untouched');
  assert.ok(!fs.existsSync(path.join(d, 'attic')), 'no attic on --out');
  assert.match(o, /VERIFIED/);
});

test('the default run writes nothing at all', () => {
  const d = tmpdir();
  const src = path.join(d, 'board.jsonl');
  fs.writeFileSync(src, FIXTURE);
  const before = fs.readdirSync(d);
  const o = run(['--board', src]);
  assert.deepStrictEqual(fs.readdirSync(d), before, 'a dry run leaves the directory as it found it');
  assert.match(o, /DRY RUN/);
  assert.match(o, new RegExp(String(DROPPED_INDEXES.length)));
});

test('--apply attics the original byte-for-byte and leaves the compacted board in place', () => {
  const d = tmpdir();
  const src = path.join(d, 'board.jsonl');
  fs.writeFileSync(src, FIXTURE);
  const o = run(['--board', src, '--apply', '--attic', path.join(d, 'attic')]);
  assert.strictEqual(fs.readFileSync(src, 'utf8'), EXPECTED);
  const attic = fs.readdirSync(path.join(d, 'attic'));
  assert.strictEqual(attic.length, 1);
  assert.strictEqual(fs.readFileSync(path.join(d, 'attic', attic[0]), 'utf8'), FIXTURE,
    'the original is the record and is kept whole');
  assert.match(o, /VERIFIED/);
});

test('--apply refuses rather than overwriting an attic file that already exists', () => {
  const d = tmpdir();
  const src = path.join(d, 'board.jsonl');
  fs.writeFileSync(src, FIXTURE);
  fs.mkdirSync(path.join(d, 'attic'));
  const stamp = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(d, 'attic', 'board.jsonl.' + stamp), 'PRECIOUS');
  assert.throws(() => run(['--board', src, '--apply', '--attic', path.join(d, 'attic')]),
    /exists/i);
  assert.strictEqual(fs.readFileSync(path.join(d, 'attic', 'board.jsonl.' + stamp), 'utf8'), 'PRECIOUS');
  assert.strictEqual(fs.readFileSync(src, 'utf8'), FIXTURE, 'and the board is left alone');
});

test('--verify re-derives the check from two files on disk and exits 1 on a hole', () => {
  const d = tmpdir();
  const a = path.join(d, 'orig.jsonl'), b = path.join(d, 'new.jsonl');
  fs.writeFileSync(a, FIXTURE);
  fs.writeFileSync(b, EXPECTED);
  assert.match(run(['--verify', a, b]), /VERIFIED/);
  fs.writeFileSync(b, KEPT_INDEXES.filter(i => i !== 4).map(i => L[i]).join('\n') + '\n');
  assert.throws(() => run(['--verify', a, b]), /REFUSED/);
});

test('the tool refuses a board it cannot find rather than compacting an empty set', () => {
  const d = tmpdir();
  assert.throws(() => run(['--board', path.join(d, 'nope.jsonl')]), /not found|ENOENT/i);
});

test('DEFAULT_KEEP names the rule in the source, so a change of rule changes this file', () => {
  assert.strictEqual(DEFAULT_KEEP, 'byte-identical-repeat',
    'the behind-the-running-maximum rule was measured and refused — see the header');
});
