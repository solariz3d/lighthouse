// ferry.test.js - run with: node ferry.test.js
//
// The first test is the one that matters: it pins the defect the tool shipped with on its first
// run. Three rows were written with short shas, matched nothing against full-sha commits, and the
// report said "0 ferried" without erroring. A silent omission from an instrument's own count is
// the exact failure this tool exists to make visible.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const TOOL = path.join(__dirname, 'ferry.js');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ferrytest-'));
process.env.FERRY_LEDGER = path.join(tmp, 'ferry.jsonl');
const ferry = require('./ferry.js');

const FULL = 'cb0df2d38aa1b2c3d4e5f60718293a4b5c6d7e8f';

function withLedger(rows) {
  fs.writeFileSync(process.env.FERRY_LEDGER, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
}
function joinAgainst(commits) {
  // status() reads artifactCommits from module scope, so exercise the join directly rather than
  // shelling out to git in a test. It calls the SHIPPED joinRows: this helper used to carry its
  // own copy of the prefix rule, which meant every assertion below was checking a lookalike and
  // would have stayed green through a change that broke the real join.
  return ferry.joinRows(commits, ferry.ledger());
}
const commit = (sha) => ({ sha, at: 0, subject: 'x', files: ['exo_memory/loop/a.md'] });

console.log('ferry.js');

test('a SHORT sha in the ledger matches the FULL sha of its commit', () => {
  withLedger([{ sha: 'cb0df2d', panes: ['C'], ferried_at: 1 }]);
  const joined = joinAgainst([{ sha: FULL, at: 0, subject: 'x', files: ['exo_memory/loop/a.md'] }]);
  assert.ok(joined[0].ferry, 'short sha must match - this is the defect the tool shipped with');
});

test('POSITIVE CONTROL: an unrelated sha does NOT match', () => {
  // Without this, the assertion above is satisfied by a join that matches everything, and the
  // miss rate would read 0% forever while the tool measured nothing.
  withLedger([{ sha: 'deadbee', panes: ['C'], ferried_at: 1 }]);
  const joined = joinAgainst([{ sha: FULL, at: 0, subject: 'x', files: ['exo_memory/loop/a.md'] }]);
  assert.strictEqual(joined[0].ferry, null, 'an unrelated sha must not match');
});

test('the sha-length rule is a FLOOR, not a window - 6 is refused and 7 matches', () => {
  // REPAIRED 2026-09-16 (E's T5 finding). This test used to assert only that a FIVE-character sha
  // does not match, and it was green whether the guard read `>= MIN_SHA` or its inversion
  // `<= MIN_SHA`: both reject a 5. A test whose inputs are all the same failure cannot tell which
  // guard held — the inversion was caught elsewhere, never here, while this test's NAME claimed it.
  //
  // Two inputs, one either side of the boundary, can tell them apart. This now fails if the
  // comparison is inverted, if the floor moves, or if the rule becomes an upper bound.
  withLedger([{ sha: FULL.slice(0, 6), panes: ['C'], ferried_at: 1 }]);
  assert.strictEqual(joinAgainst([commit(FULL)])[0].ferry, null,
    'under 7 chars collisions are real; refuse rather than guess');
  withLedger([{ sha: FULL.slice(0, 7), panes: ['C'], ferried_at: 1 }]);
  assert.ok(joinAgainst([commit(FULL)])[0].ferry,
    'exactly 7 is INSIDE the floor and must match - or the guard is a window, not a floor');
});

test('a malformed ledger line is skipped, not fatal', () => {
  fs.writeFileSync(process.env.FERRY_LEDGER, 'not json\n' + JSON.stringify({ sha: 'cb0df2d', panes: ['C'], ferried_at: 1 }) + '\n');
  assert.strictEqual(ferry.ledger().length, 1, 'the good row must survive a bad neighbour');
});

test('record() appends rather than overwriting - a ferry never erases an earlier one', () => {
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  ferry.record('aaaaaaa', ['A'], 100);
  ferry.record('bbbbbbb', ['B'], 200);
  assert.strictEqual(ferry.ledger().length, 2);
});

test('record() REFUSES a short sha rather than writing a phantom that blocks the full sha', () => {
  // The other half of the short-sha defect: status() already ignores a short sha in the ledger,
  // but record() used to WRITE one anyway — reporting success while the row was uncountable, and
  // its prefix then blocking the correct full sha via the idempotency check. record() must enforce
  // the same >=7 floor the readers filter on.
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  assert.throws(() => ferry.record('cb0df', ['C'], 100), /need >= 7/, 'a short sha must be refused, not written');
  assert.strictEqual(ferry.ledger().length, 0, 'nothing may be written for a too-short sha');
  const row = ferry.record(FULL, ['C'], 200);
  assert.ok(row, 'the correct full sha now records cleanly — no short prefix was left to block it');
  assert.strictEqual(ferry.ledger().length, 1);
});

test('only claim-bearing directories count as artifacts', () => {
  // Code is reviewed by its tests. The surface with no instrument is prose making claims,
  // which is what BOOT says is unguarded and what this tool is pointed at.
  assert.ok(ferry.ARTIFACT_DIRS.every(d => d.startsWith('exo_memory/')));
  assert.ok(!ferry.ARTIFACT_DIRS.some(d => d.includes('src')));
});

test('a SECOND pane on the same sha MERGES into the set - the defect this fixes', () => {
  // THE DEFECT, reproduced by the chair before this packet was briefed:
  //   --record 13c31bd A  ->  {"sha":"13c31bd","panes":["A"],...}
  //   --record 13c31bd C  ->  null, and the ledger still read panes:["A"]
  // The old idempotency check deduped on the SHA ALONE, so a commit routed to a second pane was
  // treated as a duplicate of itself. Every multi-routed commit under-reported its reach.
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  ferry.record(FULL, ['A'], 100);
  const second = ferry.record(FULL, ['C'], 200);
  assert.ok(second && second.already === false, 'a NEW pane must write, not return a no-op');
  assert.deepStrictEqual(second.added, ['C']);
  const joined = joinAgainst([commit(FULL)]);
  assert.deepStrictEqual(joined[0].ferry.panes, ['A', 'C'], 'the reader must see BOTH panes');
});

test('POSITIVE CONTROL: merging into one sha does not add panes to another', () => {
  // Without this, a join that unions across ALL rows regardless of sha would satisfy the test
  // above, and the pane list would be wrong in the opposite direction - every commit credited
  // with every pane, which reads as perfect reach.
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  ferry.record(FULL, ['A'], 100);
  ferry.record('deadbeef1234567', ['C'], 200);
  const joined = joinAgainst([commit(FULL)]);
  assert.deepStrictEqual(joined[0].ferry.panes, ['A'], 'panes must not leak across commits');
});

test('a GENUINE duplicate is a no-op and does NOT print the same as a write', () => {
  // The half of the defect that made it invisible. Both a dropped second pane and a real
  // duplicate returned null and exited 0, so the operator had no way to tell "already known"
  // from "information discarded". These two cases must be distinguishable at the CLI, not just
  // in the module - the CLI is where anyone actually meets them.
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  ferry.record(FULL, ['A'], 100);
  const dup = ferry.record(FULL, ['A'], 300);
  assert.strictEqual(dup.already, true);
  assert.deepStrictEqual(dup.added, [], 'a duplicate adds nothing');
  assert.strictEqual(ferry.ledger().length, 1, 'and writes no row');

  // stderr CAPTURED, not inherited: the human-readable line is part of what is being
  // asserted, and a test that lets it print to the console is also a test that never reads it.
  const runBoth = (args) => {
    const r = require('child_process').spawnSync(process.execPath, [TOOL, '--record', ...args],
      { encoding: 'utf8', env: { ...process.env, FERRY_NOW: '400' } });
    return { out: r.stdout, err: r.stderr };
  };
  const run = (args) => runBoth(args).out;
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  const first = run([FULL, 'A']);
  const merged = run([FULL, 'C']);
  const duplicate = run([FULL, 'C']);
  assert.notStrictEqual(merged.trim(), duplicate.trim(),
    'a merge and a duplicate printed identically - that is how the dropped pane went unseen');
  assert.ok(JSON.parse(duplicate).already === true, 'the duplicate must say so in its output');
  assert.ok(JSON.parse(merged).already === false, 'the merge must not claim to be a duplicate');
  assert.notStrictEqual(first.trim(), duplicate.trim());

  // and the human-readable half, which is what an operator at a terminal actually reads.
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  runBoth([FULL, 'A']);
  assert.strictEqual(runBoth([FULL, 'C']).err.trim(), '', 'a merge must not announce a duplicate');
  assert.match(runBoth([FULL, 'C']).err, /already recorded/, 'a duplicate must say so in words');
});

test('the merge does NOT move the ferry timestamp - latency stays time-to-FIRST-ferry', () => {
  // This is why the fix appends instead of rewriting the row. If a later pane overwrote
  // ferried_at, every multi-routed artifact would report the latency of its SLOWEST hop, and the
  // median latency in --report would drift upward as a side effect of recording more truthfully.
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  ferry.record(FULL, ['A'], 100);
  const beforeTs = joinAgainst([commit(FULL)])[0].ferry.ferried_at;
  ferry.record(FULL, ['C'], 999999);
  const afterTs = joinAgainst([commit(FULL)])[0].ferry.ferried_at;
  assert.strictEqual(beforeTs, 100);
  assert.strictEqual(afterTs, 100, 'the first ferry is when the artifact reached a mind');
});

test('the merge does NOT change what counts as ferried - the miss rate is untouched', () => {
  // The claim the chair asked to have established rather than assumed: the pane list was wrong,
  // the miss rate was not. It holds structurally, not by luck - a merge only ever appends a row
  // for a sha that ALREADY has one, so the SET of ferried shas cannot change. Pinned here so a
  // future change to the join cannot quietly break it.
  fs.writeFileSync(process.env.FERRY_LEDGER, '');
  const commits = [commit(FULL), commit('deadbeef1234567890123456789012345678901')];
  ferry.record(FULL, ['A'], 100);
  const ferriedBefore = joinAgainst(commits).map(r => !!r.ferry);
  ferry.record(FULL, ['C'], 200);
  ferry.record(FULL, ['E'], 300);
  const ferriedAfter = joinAgainst(commits).map(r => !!r.ferry);
  assert.deepStrictEqual(ferriedAfter, ferriedBefore, 'ferried/missed must be invariant');
  assert.deepStrictEqual(ferriedBefore, [true, false], 'and must not be trivially all-true');
});

test('a row with no panes at all is tolerated - the epoch row has none', () => {
  // ledger() returns the epoch row too, and it carries {epoch, note} and nothing else. A union
  // that assumed every row had an array would throw on a real ledger while every fixture passed.
  assert.deepStrictEqual(ferry.panesOf({ epoch: 1, note: 'x' }), []);
  assert.deepStrictEqual(ferry.panesOf({ sha: FULL, panes: 'C' }), ['C'], 'a bare string counts');
  assert.deepStrictEqual(ferry.panesOf({ sha: FULL, panes: ['C'] }), ['C']);
});

// ─── report(): the half of the tool that had no test at all ──────────────────────────────────────
//
// On 2026-09-16 eight single-line defects were planted in a copy of ferry.js. Three seats found all
// eight by reading; THIS SUITE caught three. The five it could not see — the epoch boundary, the
// latency divisor, the dropped negative-latency filter, the median index and the rate floor — all
// live in report(), and `grep -c "report(" ferry.test.js` returned 0. Every one of them is a change
// a real seat would have shipped, and the suite said green. (handback/t5-charlie_2026-09-16.md,
// handback/t5-echo_2026-09-16.md, ea605f8.)
//
// WHY THESE BUILD A REAL REPOSITORY. report() takes its commits from `git log` inside FERRY_REPO
// and nothing injects them; status() reads artifactCommits() from module scope. Exercising the
// shipped path therefore needs a repository whose commit times we chose — the alternative was a
// seam in ferry.js, and the tool is not this lap's file.
//
// Each test pins the SHAPE the value sits in — a boundary tested on both sides, a unit derived
// from its own inputs, an invariant that holds whatever the numbers are — rather than the literal
// text of a planted line.

const T0 = 1700000000; // one fixed second; every time below is relative to it

/** A throwaway repository with one artifact commit per given timestamp (seconds). Returns the shas. */
function withRepo(atSecs) {
  const dir = fs.mkdtempSync(path.join(tmp, 'repo-'));
  const g = (args, env) => execFileSync('git', args,
    { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], env: { ...process.env, ...env } });
  g(['init', '-q', '.']);
  g(['config', 'user.email', 'ferry@test']);
  g(['config', 'user.name', 'ferry test']);
  fs.mkdirSync(path.join(dir, 'exo_memory', 'loop'), { recursive: true });
  const shas = [];
  atSecs.forEach((atSec, i) => {
    const rel = `exo_memory/loop/a${i}.md`;
    fs.writeFileSync(path.join(dir, rel), `artifact ${i}\n`);
    g(['add', rel]);
    const when = `@${atSec} +0000`;
    g(['commit', '-q', '-m', `artifact ${i}`], { GIT_AUTHOR_DATE: when, GIT_COMMITTER_DATE: when });
    shas.push(g(['rev-parse', 'HEAD']).trim());
  });
  process.env.FERRY_REPO = dir;
  return shas;
}

/** report() prints. Capture the lines: the rate is PRINTED and never returned, so the only way to
 *  assert it is to read what an operator reads — and a suite that lets it scroll past is a suite
 *  that never checks it. */
function quietReport() {
  const lines = [];
  const real = console.log;
  console.log = (...a) => lines.push(a.join(' '));
  try { return { r: ferry.report(), lines }; } finally { console.log = real; }
}
const epochRow = { epoch: T0 * 1000, note: 'fixture' };

test('a commit AT the ledger epoch is inside the window, not before it', () => {
  // The boundary instant is exactly what a strict `>` loses, and it is not a hypothetical: the
  // epoch is taken FROM a ledger row, so the commit at the epoch is the first thing the instrument
  // ever measures. Asserted as the split between measured and unmeasured, not as a literal.
  const shas = withRepo([T0 - 3600, T0, T0 + 3600]);
  withLedger([epochRow, { sha: shas[1], panes: ['A'], ferried_at: (T0 + 60) * 1000 }]);
  const { r } = quietReport();
  assert.strictEqual(r.total, 3);
  assert.strictEqual(r.unmeasured, 1, 'only the commit BEFORE the epoch is unmeasured');
  assert.strictEqual(r.window, 2, 'the commit AT the epoch belongs to the window it opens');
});

test('median latency is reported in MINUTES', () => {
  // The unit is derived from the fixture's own inputs, so any divisor - seconds, hours - fails
  // here, not just the one that was planted.
  const [sha] = withRepo([T0]);
  const ferriedAt = (T0 + 2 * 3600) * 1000;
  withLedger([epochRow, { sha, panes: ['A'], ferried_at: ferriedAt }]);
  const expected = (ferriedAt - T0 * 1000) / 60000;
  assert.strictEqual(expected, 120, 'fixture sanity: two hours is 120 minutes');
  assert.strictEqual(quietReport().r.median, expected, 'the latency unit is minutes');
});

test('a ferry stamped BEFORE its commit cannot move the median', () => {
  // An artifact cannot be ferried before it exists; such a row is a clock skew or a typo, and the
  // filter that drops it is one `&& n >= 0`. Pinned as an INVARIANT - the impossible sample makes
  // no difference, whatever the other numbers are - rather than as an expected value.
  const shas = withRepo([T0, T0, T0]);
  const rows = [epochRow,
    { sha: shas[0], panes: ['A'], ferried_at: (T0 + 10 * 60) * 1000 },
    { sha: shas[1], panes: ['A'], ferried_at: (T0 + 20 * 60) * 1000 }];
  withLedger(rows);
  const clean = quietReport().r.median;
  assert.ok(clean !== null, 'the fixture must produce a median at all');
  withLedger([...rows, { sha: shas[2], panes: ['A'], ferried_at: (T0 - 60 * 60) * 1000 }]);
  assert.strictEqual(quietReport().r.median, clean,
    'a pre-dated ferry must be discarded, not ranked among the real ones');
});

test('the median is the MIDDLE latency, not the largest', () => {
  const shas = withRepo([T0, T0, T0]);
  withLedger([epochRow,
    { sha: shas[0], panes: ['A'], ferried_at: (T0 + 10 * 60) * 1000 },
    { sha: shas[1], panes: ['A'], ferried_at: (T0 + 20 * 60) * 1000 },
    { sha: shas[2], panes: ['A'], ferried_at: (T0 + 90 * 60) * 1000 }]);
  const { r } = quietReport();
  assert.strictEqual(r.median, 20, 'three samples: the median is the second');
  assert.ok(r.median < 90, 'an index one too high reports the SLOWEST ferry as the typical one');
});

test('ONE latency sample gives that sample, not undefined', () => {
  // The same off-by-one that makes the median the maximum indexes past the end of a one-element
  // array. `median` becomes undefined, the `median === null` guard does not catch it, and
  // `median.toFixed(1)` throws - so the tool's DEFAULT invocation (no arguments runs report())
  // dies with a stack trace on the first day exactly one artifact has been ferried.
  const [sha] = withRepo([T0]);
  withLedger([epochRow, { sha, panes: ['A'], ferried_at: (T0 + 7 * 60) * 1000 }]);
  const { r, lines } = quietReport();
  assert.strictEqual(r.median, 7, 'with one sample the median is that sample');
  assert.ok(lines.some(l => /median latency\s+7\.0 min/.test(l)), 'and it must print, not throw');
});

test('the miss rate is withheld below its floor and printed at it', () => {
  // A rate needs an n, and the floor is the whole guard: the tool has twice published a confident
  // percentage off a denominator it could not have observed (97.2%, then 0.0% off n=3 - the same
  // defect pointing the other way). Pinned on BOTH sides of the boundary, so lowering the floor
  // and raising it both fail here.
  const FLOOR = 10;
  const rateLine = (n) => {
    const shas = withRepo(Array.from({ length: n }, () => T0));
    withLedger([epochRow, { sha: shas[0], panes: ['A'], ferried_at: (T0 + 60) * 1000 }]);
    return quietReport().lines.find(l => l.startsWith('miss rate'));
  };
  const below = rateLine(FLOOR - 1);
  const at = rateLine(FLOOR);
  assert.ok(/n\/a/.test(below) && !/%/.test(below), `under the floor a rate must be withheld: ${below}`);
  assert.ok(/%/.test(at), `at the floor the rate must be printed: ${at}`);
});

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
