/* corpus-age.synthetic.test.js — corpus-age.js and the shelf's recursion rule, proved on a corpus this test builds.
 *
 * WHY THIS FILE EXISTS (D273 lap 3, the consumer refresh). corpus-age.test.js and shelf-recursion.test.js prove the same properties against the
 * ROOM'S OWN corpus: they need an `attic/`, a `loop/` with referenced and unreferenced files, nested registrations, and git history that
 * ages them. A consumer ships the instrument and none of that record, so those rows are declared WORKSHOP-bound there and the instrument
 * would otherwise be untested where a stranger runs it. This file is the twin: a throwaway repo with a SMALL corpus whose every property
 * is known by construction, and the same questions asked of it:
 *
 *   1  the capacity split: carried tiers, indexed tiers, the by-name exclusions, and attic/ skipped at ANY depth (law 3)
 *   2  nested files are walked (the 2026-08-23 flat-read miss) and review()'s OWN rel resolves on disk for a nested file
 *   3  a proposal needs BOTH conditions: unreferenced AND old; a referenced old file and an unreferenced young file are not proposed
 *   4  the intake cap is READ from main.rs (a number, or a name that resolves to one), and absent it the tool refuses to print a number
 *   5  the command line: --json prints the same sizes the module computes
 *   6  --apply moves, writes a manifest, keeps the bytes, never deletes, and never overwrites a name already in attic/
 *
 * It copies corpus-age.js into the throwaway repo (the tool resolves its repo from its own location), so it runs the SHIPPED file, unchanged.
 * Real git, real dates (the author date is set per commit); no network. Source and consumer run the same file.
 *
 * Run: node consonance/tools/corpus-age.synthetic.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const TOOL = path.join(__dirname, 'corpus-age.js');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'corpus-age-syn-'));
test.after(() => { try { fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* a temp folder Windows is still holding is not a failure of the tool */ } });

const git = (env, ...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', env: { ...process.env, ...env } });
const put = (rel, body) => { const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body); return Buffer.byteLength(body); };
const DAY = 86400 * 1000;
const commit = (daysAgo, msg) => {
  const d = new Date(Date.now() - daysAgo * DAY).toISOString(), env = { GIT_AUTHOR_DATE: d, GIT_COMMITTER_DATE: d };
  git(env, 'add', '-A'); git(env, 'commit', '-q', '-m', msg);
};

git({}, 'init', '-q'); git({}, 'config', 'user.email', 't@t'); git({}, 'config', 'user.name', 't');
const size = {};   // the bytes of each file, as written
// the tool, and the one line of main.rs it reads its cap from
fs.mkdirSync(path.join(root, 'consonance', 'tools'), { recursive: true });
fs.copyFileSync(TOOL, path.join(root, 'consonance', 'tools', 'corpus-age.js'));
put('consonance/src-tauri/src/main.rs', 'const LIBRARIAN_INTAKE_LIMIT: usize = 500_000;\n');
// carried tiers: cards/, the exo_memory root (not walked into), librarian/
size.card = put('exo_memory/cards/card-one.md', 'a card\n');
size.root = put('exo_memory/ROOT-note.md', 'a root-level note\n');
size.lib = put('exo_memory/librarian/seat-note.md', 'the seat note\n');
// indexed tiers: a journal that NAMES one loop file (so that one is "referenced") and a loop/ with every case
size.journal = put('exo_memory/journal/day.md', 'we kept ref-old-thing because it mattered.\n');
size.stale = put('exo_memory/loop/stale-unref-thing.md', 'old and named by nobody\n');
size.refd = put('exo_memory/loop/ref-old-thing.md', 'old but cited in the journal\n');
size.nested = put('exo_memory/loop/2026-08-18/archaeology/NESTED-prereg-thing.md', 'a registration nested three deep\n');
size.taken = put('exo_memory/loop/taken-name.md', 'its name is already in attic\n');
size.bulk = put('exo_memory/loop/run2/cells/bulk-cell-thing.md', 'a run artifact the shelf drops by name\n');
put('exo_memory/loop/attic/deep-hidden-thing.md', 'attic at depth, skipped by name\n');
size.atticTaken = put('exo_memory/attic/taken-name.md', 'already preserved here\n');
put('exo_memory/attic/old-top-thing.md', 'preserved\n');
commit(100, 'the old record');
size.young = put('exo_memory/loop/fresh-unref-thing.md', 'new and named by nobody\n');
commit(0, 'a fresh one');

const A = require(path.join(root, 'consonance', 'tools', 'corpus-age.js'));
const sum = (...ks) => ks.reduce((a, k) => a + size[k], 0);
const EXO = path.join(root, 'exo_memory');

test('1: the capacity split counts carried and indexed tiers, drops the by-name exclusions, and never sees attic/ at any depth', () => {
  const s = A.corpusSize();
  assert.deepStrictEqual(s.carried, { files: 3, bytes: sum('card', 'root', 'lib') }, 'carried: cards/, the exo_memory root (not recursive), librarian/');
  assert.deepStrictEqual(s.indexed, { files: 6, bytes: sum('journal', 'stale', 'refd', 'nested', 'taken', 'young') }, 'indexed: journal/ and loop/, nested files included');
  assert.deepStrictEqual(s.excluded, { files: 1, bytes: size.bulk }, 'loop/run2/cells/ is on disk and not in the shelf');
  assert.strictEqual(s.files, s.carried.files + s.indexed.files, 'the accounted total is exactly the two tier sets');
  assert.strictEqual(s.bytes, s.carried.bytes + s.indexed.bytes);
  const seen = [...A.mdFiles(''), ...A.mdFiles('loop'), ...A.mdFiles('journal')].map((f) => f.rel);
  assert.ok(!seen.some((r) => /(^|\/)attic\//.test(r)), 'attic/ is skipped by name, at the top and at depth: ' + seen.filter((r) => /attic/.test(r)).join(', '));
  assert.ok(seen.includes('loop/2026-08-18/archaeology/NESTED-prereg-thing.md'), 'the walk reaches a file three directories down');
});

test('2: a nested file is reviewed under a rel that resolves on disk (the walk\'s rel, not dir+name)', () => {
  const rows = A.review('loop', 30).rows, nested = rows.find((r) => r.name === 'NESTED-prereg-thing.md');
  assert.ok(nested, 'review() lost the nested file');
  assert.strictEqual(nested.rel, 'exo_memory/loop/2026-08-18/archaeology/NESTED-prereg-thing.md');
  for (const r of rows) assert.ok(fs.existsSync(path.join(root, r.rel)), 'review() produced a rel that resolves to nothing: ' + r.rel);
  assert.ok(nested.days !== null && nested.days >= 99, 'a nested file found its git age (the miss was days === null, so it was never proposed): ' + nested.days);
});

test('3: a proposal needs BOTH conditions, unreferenced and old', () => {
  const by = Object.fromEntries(A.review('loop', 30).rows.map((r) => [r.name, r]));
  assert.strictEqual(by['stale-unref-thing.md'].propose, true, 'old and unreferenced: proposed');
  assert.strictEqual(by['NESTED-prereg-thing.md'].propose, true, 'old, unreferenced and nested: proposed');
  assert.strictEqual(by['ref-old-thing.md'].referenced, true, 'the journal names it');
  assert.strictEqual(by['ref-old-thing.md'].propose, false, 'old but referenced: NOT proposed');
  assert.strictEqual(by['fresh-unref-thing.md'].referenced, false);
  assert.strictEqual(by['fresh-unref-thing.md'].propose, false, 'unreferenced but young: NOT proposed');
  assert.ok(by['fresh-unref-thing.md'].days <= 1, 'the young file reads as young: ' + by['fresh-unref-thing.md'].days);
  assert.strictEqual(A.review('loop', 1000).rows.filter((r) => r.propose).length, 0, 'raise the age bar above every file and nothing is proposed');
});

test('4: the intake cap is read from main.rs, as a number or through a name, and without it the tool refuses to print one', () => {
  assert.strictEqual(A.intakeCap(), 500000, 'the synthetic main.rs says 500_000');
  const f = path.join(root, 'cap-via-name.rs');
  fs.writeFileSync(f, 'const LIBRARIAN_INTAKE_LIMIT: usize = CAP_BYTES;\nconst CAP_BYTES: usize = 123_456;\n');
  assert.strictEqual(A.intakeCap(f), 123456, 'resolved through the named constant');
  fs.writeFileSync(f, 'fn main() {}\n');
  assert.throws(() => A.intakeCap(f), /refusing to print a capacity number/);
  fs.writeFileSync(f, 'const LIBRARIAN_INTAKE_LIMIT: usize = NOWHERE;\n');
  assert.throws(() => A.intakeCap(f), /no numeric definition/);
});

test('5: the command line prints the same sizes the module computes', () => {
  const r = spawnSync(process.execPath, [path.join(root, 'consonance', 'tools', 'corpus-age.js'), '--json'], { cwd: root, encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stderr);
  const o = JSON.parse(r.stdout);
  assert.deepStrictEqual(o.size, A.corpusSize());
  assert.strictEqual(o.intakeCap, 500000);
  assert.strictEqual(o.dir, 'loop');
  assert.strictEqual(o.minDays, 30);
});

test('6: --apply moves to attic/ with a manifest, keeps the bytes, deletes nothing, and never overwrites a name taken in attic/', () => {
  const rel = 'exo_memory/loop/stale-unref-thing.md', takenRel = 'exo_memory/loop/taken-name.md';
  const before = fs.readFileSync(path.join(root, rel)), atticBefore = fs.readFileSync(path.join(EXO, 'attic', 'taken-name.md'));
  const run = (...files) => spawnSync(process.execPath, [path.join(root, 'consonance', 'tools', 'corpus-age.js'), '--apply', ...files], { cwd: root, encoding: 'utf8' });
  const r = run(rel, takenRel, 'exo_memory/loop/not-there.md');
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(!fs.existsSync(path.join(root, rel)), 'the file left loop/');
  assert.ok(fs.readFileSync(path.join(EXO, 'attic', 'stale-unref-thing.md')).equals(before), 'and arrived in attic/ byte for byte');
  assert.ok(fs.existsSync(path.join(root, takenRel)), 'a name already in attic/ is NOT moved: nothing is overwritten');
  assert.ok(fs.readFileSync(path.join(EXO, 'attic', 'taken-name.md')).equals(atticBefore), 'and the preserved copy is untouched');
  assert.match(r.stderr, /SKIP \(name taken in attic\)/); assert.match(r.stderr, /SKIP \(absent\)/);
  const manifest = fs.readdirSync(path.join(EXO, 'attic')).find((n) => /^MOVED-\d{4}-\d{2}-\d{2}\.md$/.test(n));
  assert.ok(manifest, 'a manifest records where it came from');
  const m = fs.readFileSync(path.join(EXO, 'attic', manifest), 'utf8');
  assert.ok(m.includes('stale-unref-thing.md') && !m.includes('taken-name.md'), 'the manifest lists what moved and only that');
  assert.match(m, /Nothing here was deleted/);
  // asking again moves nothing and says so, with a non-zero exit
  const again = run(takenRel); assert.strictEqual(again.status, 1); assert.match(again.stdout, /nothing moved/);
  assert.strictEqual(run().status, 2, '--apply with no path is refused');
});
