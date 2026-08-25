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

test('a sha shorter than 7 is REFUSED, not matched loosely', () => {
  withLedger([{ sha: 'cb0df', panes: ['C'], ferried_at: 1 }]);
  const joined = joinAgainst([{ sha: FULL, at: 0, subject: 'x', files: ['exo_memory/loop/a.md'] }]);
  assert.strictEqual(joined[0].ferry, null, 'under 7 chars collisions are real; refuse rather than guess');
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

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
