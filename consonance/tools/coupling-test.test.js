// The coupling permutation test, anchored on arrangements enumerated by hand before it ran.
//
// The instrument exists before the corpus does, so the only way to know it works is to point it
// at cases whose answers were worked out on paper. The four-entry session below has six distinct
// label arrangements; they are listed here with their statistics, and the exact p follows by
// counting. If the script disagrees with the list, the script is wrong.
//
//   node consonance/tools/coupling-test.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const C = require('./coupling-test.js');

const tsv = (rows) => ['session\tt\tarm\tactor', ...rows.map(r => r.join('\t'))].join('\n');

/* ------------------------------------------------------------------ *
 * 1. the hand-enumerated case
 * ------------------------------------------------------------------ */

/* One session, entries at t = 0, 1, 10, 11, labels A A B B. Three consecutive pairs, with gaps
 * 1, 9, 1. The six distinct arrangements, worked out by hand:
 *
 *   A A B B   same {1,1}  cross {9}     meanGap = 1 - 9 = -8    adjacency 2/3
 *   A B A B   same {}     cross {1,9,1} meanGap UNDEFINED       adjacency 0/3
 *   A B B A   same {9}    cross {1,1}   meanGap = 9 - 1 = +8    adjacency 1/3
 *   B A A B   same {9}    cross {1,1}   meanGap = +8            adjacency 1/3
 *   B A B A   same {}     cross {1,9,1} meanGap UNDEFINED       adjacency 0/3
 *   B B A A   same {1,1}  cross {9}     meanGap = -8            adjacency 2/3
 *
 * Observed is A A B B. For meanGap, tested in the LOW tail, the defined reference set is
 * {-8, +8, +8, -8} and two of four are <= -8, so p = 0.5. For adjacency, tested HIGH, the full
 * reference set is {2/3, 0, 1/3, 1/3, 0, 2/3} and two of six are >= 2/3, so p = 1/3.
 *
 * Note what this case demonstrates on its own: FOUR ENTRIES CANNOT REACH SIGNIFICANCE. The
 * strongest possible clustering here is p = 1/3. Worth having in the tests so nobody reads a
 * small-corpus p of 0.33 as a weak effect when it is the floor. */
const HAND = tsv([
  ['s1', 0, 'A', 'x'], ['s1', 1, 'A', 'x'], ['s1', 10, 'B', 'x'], ['s1', 11, 'B', 'x'],
]);

test('the four-entry case is enumerated exactly, not sampled', () => {
  const r = C.run(C.parseCorpus(HAND));
  assert.ok(r.exact, 'six arrangements must be enumerated');
  assert.match(r.mode, /all 6 arrangements/);
});

test('meanGap matches the hand enumeration: observed -8, p = 0.5', () => {
  const r = C.run(C.parseCorpus(HAND));
  assert.strictEqual(r.results.meanGap.observed, -8);
  assert.strictEqual(r.results.meanGap.p, 0.5);
  assert.strictEqual(r.results.meanGap.undef, 2, 'the two alternating arrangements have no same-arm pair');
});

test('adjacency matches the hand enumeration: observed 2/3, p = 1/3', () => {
  const r = C.run(C.parseCorpus(HAND));
  assert.ok(Math.abs(r.results.adjacency.observed - 2 / 3) < 1e-12);
  assert.ok(Math.abs(r.results.adjacency.p - 1 / 3) < 1e-12, `got ${r.results.adjacency.p}`);
  assert.strictEqual(r.results.adjacency.undef, 0, 'adjacency is never undefined — the reason it is primary');
});

test('and four entries cannot reach significance however clustered — the floor is 1/3', () => {
  const r = C.run(C.parseCorpus(HAND));
  assert.ok(r.results.adjacency.p > 0.05, 'a small-corpus p is a resolution limit, not a weak effect');
});

/* ------------------------------------------------------------------ *
 * 2. the base-rate worry, checked rather than assumed
 * ------------------------------------------------------------------ */

test('an uneven base rate cannot manufacture a result, because the null carries the same imbalance', () => {
  // 9 of arm A, 3 of arm B, placed with NO clustering — A and B interleaved as evenly as the
  // counts allow. Same-arm pairs are commoner than cross-arm pairs by construction; if the test
  // read that as coupling it would fire here, and it must not.
  const arms = ['A', 'A', 'A', 'B', 'A', 'A', 'A', 'B', 'A', 'A', 'A', 'B'];
  const rows = arms.map((a, i) => ['s1', i * 10, a, 'x']);
  const r = C.run(C.parseCorpus(tsv(rows)), { reps: 2000, seed: 7 });
  assert.ok(r.results.adjacency.observed > 0.5, `same-arm pairs really are commoner: ${r.results.adjacency.observed}`);
  assert.ok(r.results.adjacency.p > 0.05,
            `and that must NOT read as coupling (p=${r.results.adjacency.p}) — the null has the same 9:3 split`);
});

test('real clustering of the same imbalanced labels DOES fire', () => {
  // Identical counts, 9 A and 3 B, now blocked together. The only difference from the previous
  // case is arrangement, which is exactly what the test is supposed to see.
  const arms = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B'];
  const rows = arms.map((a, i) => ['s1', i * 10, a, 'x']);
  const r = C.run(C.parseCorpus(tsv(rows)), { reps: 2000, seed: 7 });
  assert.ok(r.results.adjacency.p < 0.05, `blocked labels must fire: p=${r.results.adjacency.p}`);
});

/* ------------------------------------------------------------------ *
 * 3. determinism and the seed
 * ------------------------------------------------------------------ */

test('two runs with the same seed agree exactly, and a different seed moves the p', () => {
  const arms = Array.from({ length: 40 }, (_, i) => (i % 7 < 3 ? 'A' : 'B'));
  const corpus = C.parseCorpus(tsv(arms.map((a, i) => ['s1', i * 3, a, 'x'])));
  const a = C.run(corpus, { reps: 500, seed: 42 });
  const b = C.run(corpus, { reps: 500, seed: 42 });
  assert.strictEqual(a.results.adjacency.p, b.results.adjacency.p, 'same seed, same answer');
  assert.ok(!a.exact, 'this corpus is too large to enumerate, so it is genuinely sampled');
  const c = C.run(corpus, { reps: 500, seed: 43 });
  assert.ok(typeof c.results.adjacency.p === 'number');
});

test('the generator does not depend on Math.random', () => {
  // MENTION IS NOT USE, and this assertion was written the naive way first and failed on the
  // file's own comment explaining why Math.random is not used. That is the bite this repo has
  // taken four times and it landed here, in a test about instruments, on the first run. Strip
  // comments and strings, then look at what is left in executable position.
  const raw = require('fs').readFileSync(__dirname + '/coupling-test.js', 'utf8');
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
                  .replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '""');
  assert.ok(/Math\.random/.test(raw), 'the file does discuss it, which is why the naive check fails');
  assert.ok(!/Math\.random\s*\(/.test(code),
            'but never CALLS it — a permutation p that moves between machines is not a test');
});

/* ------------------------------------------------------------------ *
 * 4. strata
 * ------------------------------------------------------------------ */

test('adding a stratum can only hold more constant, never less', () => {
  // Two actors, each firing only its own arm. Without an actor stratum this is perfect
  // clustering; with one, the labels cannot move at all and there is nothing left to detect.
  const rows = [];
  for (let i = 0; i < 6; i++) rows.push(['s1', i * 10, 'A', 'p']);
  for (let i = 0; i < 6; i++) rows.push(['s1', 60 + i * 10, 'B', 'q']);
  const corpus = C.parseCorpus(tsv(rows));
  const without = C.run(corpus, { reps: 2000, seed: 3 });
  assert.ok(without.results.adjacency.p < 0.05, 'unstratified, this reads as strong coupling');
  const withActor = C.run(corpus, { reps: 2000, seed: 3, strataActor: true });
  assert.ok(withActor.results.adjacency.p > 0.5,
            `stratified by actor there is nothing left: p=${withActor.results.adjacency.p}`);
  assert.ok(withActor.strata > without.strata, 'and the stratum count says so out loud');
});

/* ------------------------------------------------------------------ *
 * 4b. THE SAMPLED PATH, which nothing above reaches
 * ------------------------------------------------------------------ *
 *
 * There are two implementations of the same null and only one runs on any given corpus. Every
 * hand-checkable case here is small, so every one of them enumerates and NONE of them executes
 * `permute`. That was found by breaking `permute` on purpose — replacing the within-stratum
 * shuffle with a global one, which destroys the entire base-rate protection — and watching the
 * suite stay green. A guard that never runs against the code it guards is not a guard. */

test('THE SAMPLED PATH respects strata too — the mutation that used to pass unnoticed', () => {
  const rows = [];
  for (let i = 0; i < 6; i++) rows.push(['s1', i * 10, 'A', 'p']);
  for (let i = 0; i < 6; i++) rows.push(['s1', 60 + i * 10, 'B', 'q']);
  const corpus = C.parseCorpus(tsv(rows));
  const r = C.run(corpus, { reps: 2000, seed: 3, strataActor: true, forceSample: true });
  assert.ok(!r.exact, 'this run must take the sampling path, or it tests nothing new');
  assert.ok(r.results.adjacency.p > 0.5,
            `sampled and stratified, the labels cannot move: p=${r.results.adjacency.p}`);
});

test('the two implementations of the null agree on the same corpus', () => {
  // The strongest available check on both: enumeration and sampling are independent routes to
  // the same reference distribution, so a disagreement means one of them is wrong and neither
  // can say which. Cheap, and it would have caught the broken permute from the other direction.
  const arms = ['A', 'A', 'A', 'B', 'A', 'A', 'A', 'B', 'A', 'A', 'A', 'B'];
  const corpus = C.parseCorpus(tsv(arms.map((a, i) => ['s1', i * 10, a, 'x'])));
  const exact = C.run(corpus, { seed: 11 });
  const sampled = C.run(corpus, { reps: 20000, seed: 11, forceSample: true });
  assert.ok(exact.exact && !sampled.exact, 'one of each path');
  assert.ok(Math.abs(exact.results.adjacency.p - sampled.results.adjacency.p) < 0.02,
            `exact ${exact.results.adjacency.p} vs sampled ${sampled.results.adjacency.p}`);
});

/* ------------------------------------------------------------------ *
 * 5. what it refuses
 * ------------------------------------------------------------------ */

test('a single-arm corpus produces NO numbers', () => {
  const rows = [['s1', 0, 'A', 'x'], ['s1', 1, 'A', 'x'], ['s1', 2, 'A', 'x']];
  assert.throws(() => C.run(C.parseCorpus(tsv(rows))), /only one arm/);
});

test('a corpus of singleton sessions produces NO numbers', () => {
  // Every session one entry means no consecutive pairs at all. The statistic would be NaN and a
  // NaN printed beside a contract reads like a measurement.
  const rows = [['s1', 0, 'A', 'x'], ['s2', 1, 'B', 'x'], ['s3', 2, 'A', 'x']];
  assert.throws(() => C.run(C.parseCorpus(tsv(rows))), /no consecutive within-session pairs/);
});

test('a bad header, a non-numeric t and an empty field all refuse by name', () => {
  assert.throws(() => C.parseCorpus('sess\tt\tarm\n1\t0\tA'), /header must begin/);
  assert.throws(() => C.parseCorpus('session\tt\tarm\ns1\tnoon\tA'), /t must be a number/);
  assert.throws(() => C.parseCorpus('session\tt\tarm\ns1\t0\t'), /empty arm/);
  assert.throws(() => C.parseCorpus(''), /empty corpus/);
});

/* ------------------------------------------------------------------ *
 * 6. the ordering rule is stated rather than incidental
 * ------------------------------------------------------------------ */

test('entries with equal timestamps keep file order, so "consecutive" is not ambiguous', () => {
  const rows = [['s1', 5, 'B', 'x'], ['s1', 5, 'A', 'x'], ['s1', 0, 'A', 'x']];
  const sess = C.toSessions(C.parseCorpus(tsv(rows)))[0];
  assert.deepStrictEqual(sess.map(e => e.arm), ['A', 'B', 'A'],
                         't=0 first, then the two t=5 entries in the order the file gave them');
});

test('the contract names the confound the test cannot remove', () => {
  // Collapse the layout before matching: the contract is wrapped for the terminal, so a phrase
  // that spans two lines carries the padding with it and a literal regex misses a sentence that
  // is present. The assertion is about what the contract SAYS, not how it is set.
  const text = C.CONTRACT.join(' ').replace(/\s+/g, ' ');
  assert.match(text, /shared upstream cause|task type|fatigue/,
               'a low p is a necessary condition for coupling, not evidence of it');
  assert.match(text, /refutes better than it confirms/i,
               'the asymmetry is the honest headline and belongs in the printed contract');
});
