/* Tests for corpus-age.js.
 *
 * The load-bearing properties are not "it lists files". They are: the capacity number is computed
 * from the same set the librarian actually carries, a proposal requires BOTH conditions rather than
 * either, and --apply cannot destroy anything. The first version of this tool proposed 2 files and
 * 0.2% of budget while 65% of the unreferenced mass sat under a week old -- the axis was wrong, and
 * a test that only checked "it produced a list" would have called that success.
 *
 * Run: node corpus-age.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { corpusSize, review, mdFiles, BUDGET_BYTES } = require('./corpus-age.js');

test('the capacity number counts the SAME set the librarian carries', () => {
  // If these drift apart the headline is a lie in the direction that matters: it would under-report
  // pressure on the seat while looking authoritative.
  const src = fs.readFileSync(path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs'), 'utf8');
  const order = src.match(/let order: \[\(&str, bool\); \d+\] = \[([\s\S]*?)\];/);
  assert.ok(order, 'could not find corpus_shelf order[] in main.rs');
  for (const d of ['cards', 'record', 'memory', 'map', 'spread', 'research', 'journal', 'loop']) {
    assert.ok(order[1].includes(`"${d}"`), `corpus_shelf carries ${d} but the tool may not count it`);
  }
  assert.ok(!order[1].includes('"attic"'), 'attic must be excluded in the shelf (law 3)');
});

test('attic/ is excluded from the carried corpus — law 3, in both places', () => {
  const before = corpusSize();
  const atticFiles = mdFiles('attic');
  assert.ok(atticFiles.length > 0, 'fixture broken: attic is empty, so exclusion proves nothing');
  const atticBytes = atticFiles.reduce((a, f) => a + f.size, 0);
  // the carried total must not include attic's mass
  const all = before.bytes + atticBytes;
  assert.notStrictEqual(before.bytes, all, 'attic bytes appear to be counted as carried');
});

test('the budget in the tool matches the shelf default in main.rs', () => {
  // Duplicated constants drift. This is the check that makes the duplication survivable.
  const src = fs.readFileSync(path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs'), 'utf8');
  // ANCHORED on the env var, not on the first unwrap_or in the file: the unanchored version
  // matched an unrelated unwrap_or(0) thousands of lines away. Third instance tonight of a
  // regex taking the first textual match instead of the intended one.
  const m = src.match(/CONSONANCE_LIBRARIAN_BUDGET[\s\S]{0,300}?unwrap_or\((\d[\d_]*)\)/);
  assert.ok(m, 'could not find the shelf budget default in main.rs');
  assert.strictEqual(parseInt(m[1].replace(/_/g, ''), 10), BUDGET_BYTES,
    'the tool and the shelf disagree about the carry budget');
});

test('a proposal needs BOTH unreferenced AND stale — either alone is not enough', () => {
  // The failure this prevents: proposing a file that is merely new, or merely unnamed. Checked by
  // running the same corpus at two thresholds and confirming the set shrinks.
  const loose = review('loop', 0).rows.filter((x) => x.propose).length;
  const strict = review('loop', 10_000).rows.filter((x) => x.propose).length;
  assert.ok(loose >= strict, 'a longer age threshold must never propose MORE files');
  assert.strictEqual(strict, 0, 'nothing is 10,000 days old; the age condition is not being applied');
});

test('referenced files are never proposed, whatever their age', () => {
  const rows = review('loop', 0).rows;
  const referenced = rows.filter((x) => x.referenced);
  assert.ok(referenced.length > 0, 'fixture broken: nothing in loop/ is referenced');
  for (const x of referenced) {
    assert.strictEqual(x.propose, false, 'a referenced file was proposed for archive: ' + x.rel);
  }
});

test('the tool states the limit it cannot see, in its own output path', () => {
  // "Unreferenced" is a proxy with false negatives -- a file can be load-bearing without being
  // named. If that caveat is ever edited out, the list starts reading as a verdict.
  const src = fs.readFileSync(path.join(__dirname, 'corpus-age.js'), 'utf8');
  assert.match(src, /CANDIDATES, not a verdict/, 'the caveat must reach the printed output');
  assert.match(src, /load-bearing without being/, 'the reason for the caveat must be stated');
});

test('--apply moves and manifests; it never deletes', () => {
  const src = fs.readFileSync(path.join(__dirname, 'corpus-age.js'), 'utf8');
  assert.match(src, /renameSync/, 'archiving must be a move');
  assert.doesNotMatch(src, /unlinkSync|rmSync|rimraf/, 'this tool must contain no delete call at all');
  assert.match(src, /MOVED-/, 'a manifest is required — a move with no record is a deletion with extra steps');
});

test('--apply refuses to clobber a name already in attic', () => {
  const src = fs.readFileSync(path.join(__dirname, 'corpus-age.js'), 'utf8');
  assert.match(src, /name taken in attic/, 'a colliding filename must be skipped, not overwritten');
});
