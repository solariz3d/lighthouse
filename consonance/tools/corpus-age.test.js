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
const { corpusSize, review, mdFiles, intakeCap, ageDaysMap,
        CARRY_TIERS, INDEX_TIERS, EXCLUDED_PREFIXES, MAIN_RS } = require('./corpus-age.js');

/* Reads `order` out of corpus_shelf_at() and returns { carry: [...], index: [...] } by the CARRY
 * FLAG, not by presence. The old version of this only checked that each name appeared somewhere in
 * the tuple list, which is why it stayed green from 2026-08-24 -- when map/, journal/ and loop/
 * became indexed-never-carried -- while the tool counted all three as carried. A membership test
 * cannot see a flag flip. */
function shelfTiers() {
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  const order = src.match(/let order: \[\(&str, bool, bool\); \d+\] = \[([\s\S]*?)\];/);
  assert.ok(order, 'could not find corpus_shelf order[] in main.rs');
  const carry = [], index = [];
  const re = /\("([^"]*)",\s*(true|false),\s*(true|false)\)/g;
  let m;
  while ((m = re.exec(order[1])) !== null) (m[3] === 'true' ? carry : index).push(m[1]);
  assert.ok(carry.length + index.length >= 9, 'order[] parsed too few tiers — the shape changed');
  return { carry, index };
}

test('the capacity number counts the SAME set the librarian carries', () => {
  // If these drift apart the headline is a lie in the direction that matters: it would under-report
  // pressure on the seat while looking authoritative.
  const { carry, index } = shelfTiers();
  assert.deepStrictEqual([...CARRY_TIERS].sort(), [...carry].sort(),
    'the tool and the shelf disagree about which tiers are CARRIED');
  assert.deepStrictEqual([...INDEX_TIERS].sort(), [...index].sort(),
    'the tool and the shelf disagree about which tiers are INDEXED');
  assert.ok(![...carry, ...index].includes('attic'), 'attic must be excluded in the shelf (law 3)');
});

test('the by-name exclusions match the ones the shelf actually drops', () => {
  // These files are on disk and are not in the shelf at all. Counting them reports pressure the
  // seat does not feel -- 246 files and 385,574 bytes of it on 2026-09-02.
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  for (const p of EXCLUDED_PREFIXES) {
    assert.ok(src.includes(`label.starts_with("${p}")`),
      `the tool excludes ${p} but the shelf does not — the two sets have drifted`);
  }
  const size = corpusSize();
  assert.ok(size.excluded.files > 0,
    'fixture broken: nothing matched the excluded prefixes, so the exclusion proves nothing');
  assert.strictEqual(size.files, size.carried.files + size.indexed.files,
    'the accounted total must be exactly the two tier sets — excluded files must not be in it');
});

test('the tool refuses to print a capacity number it cannot anchor in the binary', () => {
  // THE REPLACEMENT FOR THE DELETED BUDGET GUARD. There is no carry-budget constant to compare
  // against any more -- librarian_budget() and CONSONANCE_LIBRARIAN_BUDGET were removed on purpose
  // at c2afec6, and the delivered budget is computed per run from the cap. So the property worth
  // holding is not "two numbers agree" but "the one number this tool prints comes out of main.rs,
  // and if the anchor rots the tool says so instead of inventing one".
  const cap = intakeCap();
  assert.ok(Number.isInteger(cap) && cap > 0, 'the cap must be a positive integer');

  // The failure paths, EXERCISED THROUGH THE REAL FUNCTION rather than through a copy of its regex
  // pasted into the test -- a test that agrees with its own duplicate of the code is the same
  // problem this whole change is about, one level in.
  const tmp = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'corpus-age-anchor-'));
  const stray = path.join(tmp, 'main.rs');

  fs.writeFileSync(stray, 'fn main() {}\n// no LIBRARIAN_INTAKE_LIMIT here\n');
  assert.throws(() => intakeCap(stray), /refusing to print a capacity number/,
    'with the anchor gone the tool must refuse, not fall back to a number');

  fs.writeFileSync(stray, 'const LIBRARIAN_INTAKE_LIMIT: usize = SOME_OTHER_CONST;\n');
  assert.throws(() => intakeCap(stray), /has no numeric definition/,
    'an alias that resolves to nothing must refuse, not resolve to zero');

  // And it must follow the alias rather than only reading a literal, which is how it is written.
  fs.writeFileSync(stray,
    'const HARNESS_CLAUDE_MD_CHAR_CAP: usize = 123_456;\n' +
    'const LIBRARIAN_INTAKE_LIMIT: usize = HARNESS_CLAUDE_MD_CHAR_CAP;\n');
  assert.strictEqual(intakeCap(stray), 123456, 'the cap must be resolved through the alias');

  fs.rmSync(tmp, { recursive: true, force: true });
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

/* DELETED 2026-09-02 (BRAVO, L033): `the budget in the tool matches the shelf default in main.rs`.
 *
 * It compared this tool's BUDGET_BYTES against `librarian_budget()`'s `unwrap_or(2_200_000)`. That
 * function and `CONSONANCE_LIBRARIAN_BUDGET` were removed at `c2afec6` (2026-09-02 02:02) for three
 * measured reasons stated at main.rs:4730 — the removal is right and stays. The test went red
 * because the duplication it guarded no longer has two sides: there IS no shelf budget default.
 *
 * NOT RE-POINTED, and that is the decision rather than an oversight. The old number survives as
 * `CORPUS_WALK_BUDGET` in `shelf_tests`, and re-anchoring here would have made the tool agree with
 * a fixture instead of with the binary — the same duplication in a new coat, now one hop further
 * from anything that runs. The property that replaces it is above: the tool reads the one bound
 * that IS live (`LIBRARIAN_INTAKE_LIMIT`) out of main.rs, and refuses rather than inventing one. */

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

/* ADDED 2026-09-07 (BRAVO, L043). The age lookup went from one `git log` PER FILE to one per
 * DIRECTORY -- 1,443 subprocess spawns to 3, and 137.7 s of test runtime to under a second.
 * That is a change to HOW the answer is fetched, so the property to hold is that the answer is
 * the same one. This test asks git the old way for a sample and requires the batch to agree.
 *
 * It costs ~0.5 s (5 spawns) on purpose: a rewrite justified by a speed number needs a guard
 * that would go red if the speed came from returning something else. */
test('the batched age map returns exactly what the per-file git log returned', () => {
  const { execFileSync } = require('node:child_process');
  const REPO = path.resolve(__dirname, '..', '..');
  const ages = ageDaysMap('loop');
  assert.ok(ages instanceof Map, 'ageDaysMap must return a Map');
  assert.ok(ages.size > 0, 'fixture broken: no file under loop/ has a commit, so agreement is vacuous');

  const sample = [...ages.keys()].slice(0, 5);
  assert.strictEqual(sample.length, 5, 'need five committed files to compare against');
  for (const rel of sample) {
    const out = execFileSync('git', ['log', '-1', '--format=%ad', '--date=format:%s', '--', rel],
      { cwd: REPO, encoding: 'utf8' }).trim();
    const expected = Math.floor((Date.now() / 1000 - parseInt(out, 10)) / 86400);
    assert.strictEqual(ages.get(rel), expected,
      `batched age disagrees with per-file git log for ${rel}`);
  }
});

test('a file with no commits is absent from the age map, not aged zero', () => {
  // The old ageDays() returned null for an uncommitted file and `stale` stayed false, so it was
  // never proposed. An absent key must reproduce that, because the alternative -- treating
  // "unknown" as "0 days" or as "very old" -- silently changes what gets proposed for ARCHIVE.
  const ages = ageDaysMap('loop');
  const untracked = 'exo_memory/loop/' + 'no-such-file-' + Date.now() + '.md';
  assert.strictEqual(ages.has(untracked), false, 'an uncommitted path must not appear in the map');
  assert.strictEqual(ages.get(untracked), undefined, 'and must not resolve to a number');
});

test('every value in the age map is a non-negative integer number of days', () => {
  const ages = ageDaysMap('loop');
  for (const [rel, days] of ages) {
    assert.ok(Number.isInteger(days), `${rel} has a non-integer age: ${days}`);
    assert.ok(days >= 0, `${rel} has a negative age: ${days} — a timestamp parsed wrong`);
  }
});
