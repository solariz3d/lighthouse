// CANARY RETIRED 2026-09-04. This file carried `JS-SUITE: EXPECTED-RED` on the line above from the
// commit that landed it until the commit that fixed what it named. All three declared reds are
// green; js-suite treats an expected-red that goes green as a failure, which is what forced the
// marker's removal to be part of the repair rather than a courtesy. It worked as designed.
//
// The marker's own history is kept because it cost a measurement: it must sit on a line that
// STARTS with `//` or `#` — js-suite.js:217 is /^\s*(\/\/|#)\s*JS-SUITE:\s*EXPECTED-RED/m, while
// its header at :41 says only "a file declares itself by containing the marker". Declared inside
// the block comment below, it was not detected and the suite read this file as FAILED, 0 canary.

/* gen-consumer.fixture-scope — the red-first test for the fixture guard's SCOPE.
 *
 * STATUS, 2026-09-04: THE DEFECT IS FIXED AND THE DECLARATION IS RETIRED. This section is kept
 * because it explains why the file was born red, and because the mechanism it describes worked.
 *
 * WHY THIS FILE WAS DECLARED EXPECTED-RED, and what cleared the declaration. Three of the
 * assertions below were red at the commit that landed them. That was deliberate: the defect they
 * named was live, and that lap was a REGISTRATION lap -- other seats were measuring the
 * generator's current output, so changing what it emitted underneath them would have invalidated
 * their readings. The declaration lived here rather than in a roster so it would die with the fix:
 * js-suite treats an expected-red that goes GREEN as a failure, which is what forced whoever
 * repaired `isFixture` to come back and delete the marker. It did exactly that. Below, the header
 * of this file records the retirement; the sections that follow are HISTORY unless marked
 * otherwise, and the paragraph headed WHAT THESE TESTS CANNOT CATCH has been corrected because one
 * of its limits was closed by the repair.
 *
 * THE HISTORY, because the fix and the defect are the same edit.
 *
 * On 2026-08-23 the generator rewrote test fixtures. `agreement-spread.test.js:46` lost the
 * referent its `>= 3` assertion counted, `corrections-gate.test.js` lost the `muscle_map.md`
 * filename the gate keys on, and `main.rs` had a shipped Rust assertion rewritten into one that
 * cannot pass. Three further suites went GREEN over rewritten data, which is worse than red.
 * The record: the librarian's 2026-08-23 entry, measured as 31 green / 9 failed / 2 crashed of 43
 * in the generated tree.
 *
 * `b20fed5` fixed it by adding `isFixture` and routing fixtures to a token-only transform. That
 * repair works -- test 1 below proves it over the real tree, and it is the reason this file runs
 * the actual generator instead of hand-written strings. Every existing fixture test in
 * `gen-consumer.test.js` calls `transform()` on a synthetic literal, which measures a model of the
 * break rather than the break; a replica is not evidence until it agrees with the instrument.
 *
 * THE DEFECT THE REPAIR INTRODUCED -- FIXED 2026-09-04, described here as it stood. It was a leak
 * rather than a broken test. `isFixture` keyed on /\.rs$/, so it classified the WHOLE of main.rs
 * as a fixture. (One correction to the sentence that follows, measured while fixing it: the
 * #[cfg(test)] block is NOT "a small tail". main.rs carries FORTY #[cfg(test)] attributes
 * interleaved through 10,153 lines and no `mod tests` at all -- which is precisely why the repair
 * could not scope the waiver by region.) Two guards then stood down together:
 *
 *   1. `transform()` routes it to the token-only branch, so `demachine()` never runs on it.
 *   2. `scan()` exempts fixtures from DANGLING, MACHINE and RECORD.
 *
 * and a third never covered it: `build()`'s `unportable` report matches DANGLING and RECORD refs
 * only, so a MACHINE hit in a Rust file is not refused, not reported, and not counted. Measured at
 * this commit, `build('', {dry:true})` returns `refused: none`, `leaks: 0`, and `main.rs` present in
 * `unportable` with its 7 dangling/record refs -- while the staged output carries three MACHINE
 * hits the scan would have raised under any other extension. Two of them name the keeper's personal
 * OneDrive path, in `///` doc comments in LIVE code, nowhere near #[cfg(test)].
 *
 * This is a regression and not an old gap: before `b20fed5`, `scan()` read
 * `const allowed = ALLOW[rel] || [];` with no fixture clause, so those lines failed the build.
 *
 * THE MUTATION RUN, and it corrected the shape this file was drafted in. Three loads of the
 * generator from a mutated copy in scratchpad, the shared checkout never edited:
 *
 *   HEAD (unmutated)                 T1 GREEN · T2 RED (3) · T3 RED   refused: none  · leaks: 0
 *   A: isFixture -> false            T1 RED   · T2 RED (2) · T3 GREEN refused: 15 leaks
 *   B: waiver scoped to #[cfg(test)] T1 GREEN · T2 RED (3) · T3 GREEN refused: 9 leaks
 *
 * A is the reproduction: neutering the guard turns T1 red, so T1 is about the 2026-08-23 break and
 * not about four files merely existing. B is the candidate fix, and it does NOT clear T2. That was
 * not the prediction and it is the useful part: the predicate fix makes the generator REFUSE the
 * three MACHINE hits, it does not remove them. So the two reds have different owners --
 *
 *   T3 clears with the PREDICATE fix: scope the .rs waiver to the #[cfg(test)] region, so the
 *      waiver covers the lines that are a fixture and not the ~10k around them. Measured above.
 *   T2 clears only when main.rs's live `///` comments stop naming those paths, or `demachine()`
 *      grows patterns that match them. It is a content red and no scan change will turn it green.
 *
 * A is also where the second cost showed: under A the private-tree path count drops 3 -> 2, because
 * `deidentify()` rewrites `C:\Consonance\lighthouse` to `%CONSONANCE_HOME%` on a non-fixture. That
 * substitution is available today and the fixture routing is what declines it.
 *
 * WHAT THESE TESTS CANNOT CATCH, stated because a test that cannot say what it stopped seeing is
 * a silencing. CORRECTED 2026-09-04 -- the first limit below was real, was hit exactly as written,
 * and is now closed:
 *   - [CLOSED] "They assert on OUTPUT CONTENT, not on the predicate. A fix that keeps `isFixture`
 *     over-broad but deletes the offending comments from main.rs turns them green while the hole
 *     stays open for the next Rust file." That is what happened: mutation M1 reverts the waiver
 *     and tests 1-3 stay green. Section 4 below now asserts `scan()`'s contract on synthetic
 *     input, in both directions, and M1 turns it red. The prediction that a #[cfg(test)] region
 *     model would be needed was wrong -- the predicate is assertable without one.
 *   - [CLOSED] Nothing here asserted the generator still BUILDS. The first draft of the repair
 *     passed tests 1-3 while refusing over 10 leaks it had introduced in three other fixtures.
 *     Section 4's last test is that assertion.
 *   - They say nothing about the OTHER failures the generated tree carries. Run at the commit
 *     that landed this file, and NOT re-measured since -- treat as stale:
 *     private 66 green / 3 failed of 70; generated 42 green / 17 failed / 3 crashed of 63. That
 *     delta is unattributed here and is not this file's claim.
 *   - They say nothing about whether the generated tree compiles or runs.
 *   - Test 1 pins four named 2026-08-23 casualties. It does not prove no OTHER fixture was damaged.
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..');
const G = require('./gen-consumer.js');

/* One real build, staged and scanned by the generator itself, shared by every test below. This is
 * the instrument; nothing here reads a hand-written string. */
const R = G.build('', { dry: true });
const staged = (rel) => fs.readFileSync(path.join(R.staging, rel), 'utf8');
const source = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8');
const MAIN_RS = 'consonance/src-tauri/src/main.rs';
test.after(() => { try { fs.rmSync(R.staging, { recursive: true, force: true }); } catch (_) {} });

/* ---------------------------------------------------------------- 1. the repair, over the tree */

test('the 2026-08-23 casualties survive the REAL build byte-intact', () => {
  /* Each of these is a file the generator actually damaged on 2026-08-23, named in the record.
   * Byte equality is the assertion because the damage was a rewrite, and any rewrite of a fixture
   * either breaks its assertion or leaves it green over data that no longer means what it meant.
   *
   * MUTATION PROOF: neutering `isFixture` to `() => false` turns all four of these red -- the
   * dangling rules fire again and every one of the four differs from source. That is the check
   * that this test is about the break rather than about the files merely existing. */
  for (const rel of ['consonance/tools/agreement-spread.test.js',
                     'consonance/tools/corrections-gate.test.js',
                     'consonance/tools/second-vantage.test.js']) {
    assert.strictEqual(staged(rel), source(rel),
      rel + ' was rewritten by the generator; its assertions no longer key on what they tested');
  }
  /* The Rust one is narrower and worth pinning by content: `cargo check` without `--all-targets`
   * does not compile #[cfg(test)], so no build gate here can see this assertion break. */
  assert.match(staged(MAIN_RS), /assert!\(shelf\.contains\("journal\/2026-08-22\.md"\)/,
    'the generator rewrote the Rust assertion at main.rs:8835 into one that cannot pass');
});

/* ---------------------------------------------------------------- 2. the scope the repair took */

test('the generated Rust carries no MACHINE-class path', () => {
  /* `LEAKS` calls OneDrive "the keeper's personal sync directory" and refuses it everywhere else.
   * It ships here because main.rs matched /\.rs$/ and `isFixture` waived MACHINE for the whole
   * file. These two lines are `///` doc comments in live code, not fixtures by any reading of the
   * function's own docstring ("Test files and the Rust #[cfg(test)] block are fixtures").
   *
   * THIS RED IS NOT CLEARED BY THE PREDICATE FIX -- measured, mutation B above. Scoping the waiver
   * makes the build REFUSE these three; it does not remove them. This one goes green when main.rs's
   * doc comments stop naming the paths, or when `demachine()` matches them. Whoever fixes the
   * predicate should expect to still see this red and should not read it as the fix failing. */
  const rs = staged(MAIN_RS);
  const one = (rs.match(/OneDrive/g) || []).length;
  assert.strictEqual(one, 0,
    one + " OneDrive reference(s) shipped in main.rs -- the keeper's personal sync directory, "
    + 'waived because /\\.rs$/ made the whole file a fixture');

  const priv = (rs.match(/C:\\{1,4}Consonance\\{1,4}lighthouse/gi) || []).length;
  assert.strictEqual(priv, 0,
    priv + " reference(s) to the private tree's own path shipped in main.rs, same waiver");
});

test('a MACHINE hit in a Rust file is refused OR reported -- never silent', () => {
  /* The narrow, load-bearing claim. DANGLING and RECORD hits in main.rs ARE surfaced: the file
   * appears in `unportable` with 7 refs, so a reader is told. MACHINE is in neither channel --
   * `scan()` waives it for fixtures and `unportable`'s regex never matched it. So the one class
   * this generator exists to stop is the one class it cannot see in a Rust file.
   *
   * Asserted through the report rather than through `scan()` directly, because the question is
   * what a person running the tool is TOLD, not what an internal function returns. */
  const rs = staged(MAIN_RS);
  const machine = (rs.match(/OneDrive|C:\\{1,4}Consonance\\{1,4}lighthouse/gi) || []).length;
  if (machine === 0) return; // nothing to be silent about; the test above owns that case

  const refusedForIt = /leak/.test(R.refused || '');
  const entry = R.unportable.find((u) => u.rel === MAIN_RS);
  const reported = !!entry && entry.refs.some((r) => /OneDrive|Consonance\\lighthouse/i.test(r));
  assert.ok(refusedForIt || reported,
    machine + ' MACHINE hit(s) shipped in main.rs with refused=' + JSON.stringify(R.refused)
    + ' and leaks=' + R.leaks.length + '. Not refused, not in unportable ('
    + (entry ? entry.n + ' refs, all DANGLING/RECORD' : 'absent') + '): silent.');
});

/* ---------------------------------------------------------------- 3. the header's own claim */

/* ---------------------------------------------------------------- 4. the predicate itself
 *
 * ADDED 2026-09-04, BECAUSE THE REPAIR ABOVE PROVED THE TESTS ABOVE CANNOT SEE IT. The mutation
 * run on the landed fix:
 *
 *   HEAD (repaired)                     main.rs MACHINE=0  leaks= 0  refused=none
 *   M1 waiver reverted to MACHINE-waived  main.rs MACHINE=0  leaks= 0  refused=none   <-- SILENT
 *   M2 demachine off the fixture branch   main.rs MACHINE=2  leaks= 3  refused=3 leak(s)
 *   M3 both reverted (pre-repair)         main.rs MACHINE=2  leaks= 0  refused=none
 *
 * M1 is the finding. Once `demachine()` removes the three doc-comment paths, tests 2 and 3 go
 * green whether or not the predicate was ever fixed — which is verbatim what this file's own
 * docstring predicted ("a fix that keeps isFixture over-broad but deletes the offending comments
 * turns them green while the hole stays open for the next Rust file"). It predicted it and then
 * did not guard it.
 *
 * These assert the CONTRACT of `scan()` on synthetic input, so they are not a model of Rust and
 * they do not depend on what main.rs happens to contain today. M1 turns the first one red. */

test('a MACHINE path in live Rust is scanned; in a path-fixture it is waived', () => {
  const machineLine = '/// see C:\\Consonance\\lighthouse\\exo_memory\\map\\\n';

  const live = G.scan(machineLine, 'consonance/src-tauri/src/anything.rs');
  assert.ok(live.some((f) => f.cls === 'MACHINE'),
    'a MACHINE path in a LIVE .rs file was waived; /\\.rs$/ is making whole files fixtures again '
    + '— the hole that shipped the keeper\'s OneDrive path in main.rs doc comments');

  /* The other direction, so the fix cannot be "delete the waiver". These are the fixtures the
   * class-wide narrowing broke when it was tried: rewriting them breaks their assertions. */
  const fixture = G.scan(machineLine, 'consonance/tools/lap-row.test.js');
  assert.ok(!fixture.some((f) => f.cls === 'MACHINE'),
    'MACHINE fired inside a .test.js fixture; assertion literals like '
    + "normPath('C:\\\\Consonance\\\\lighthouse\\\\...') would be rewritten and their tests broken");
});

test('a DANGLING reference in live Rust is still waived, and reported instead', () => {
  /* The narrowing was by CLASS WITHIN KIND, not a blanket removal. Rust doc comments legitimately
   * cite this record's filenames — main.rs carries 7 such refs — and those are surfaced through
   * `unportable` rather than refused. If this goes red the waiver was deleted rather than cut. */
  const dangling = G.scan('/// see exo_memory/loop/some_registration_2026-01-01.md\n',
                          'consonance/src-tauri/src/anything.rs');
  assert.ok(!dangling.some((f) => f.cls === 'DANGLING'),
    'DANGLING fired in a .rs file; the fixture waiver was removed wholesale rather than narrowed');
});

test('the repaired generator still BUILDS — no leak refuses it', () => {
  /* The failure this file could not see, and the reason it is asserted separately: staging is
   * written BEFORE the refusal check, so every test above reads a staged tree that the generator
   * then declines to emit. The first draft of this repair passed tests 1-3 while refusing the
   * build over 10 leaks in three fixtures it had broken. A green scope test over a generator that
   * produces nothing is the worst reading available. */
  assert.ok(!R.refused, 'the generator refused: ' + JSON.stringify(R.refused)
    + ' — leaks in ' + JSON.stringify([...new Set(R.leaks.map((l) => l.rel))]));
});

/* ---------------------------------------------------------------- 5. the header's own claim */

test('the module header does not call the source tree private', () => {
  /* `gh repo view solariz3d/lighthouse --json isPrivate` returns false, and has since 2026-08-22.
   * Line 2 reads "build the PUBLIC consonance tree from the PRIVATE lighthouse tree". This is not
   * a typo: the three non-negotiable properties in the header, the allow-list, and every leak class
   * are justified by a source tree that is not published. A generator wrong about its own source is
   * wrong about what its scan is for.
   *
   * Asserted as prose because that is what it is. The repository's actual visibility is not
   * checkable from here without a network call, so this test pins the CLAIM, not the fact -- if
   * the tree is ever made private again the fix is to say so beside this line, not to delete it. */
  const head = source('consonance/tools/gen-consumer.js').split('\n').slice(0, 3).join('\n');
  assert.doesNotMatch(head, /PRIVATE lighthouse tree/,
    'gen-consumer.js:2 declares the lighthouse tree PRIVATE; gh reports isPrivate=false since 2026-08-22');
});
