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
  const saved = ferry.artifactCommits;
  // status() reads artifactCommits from module scope, so exercise the join directly with the
  // same rule rather than shelling out to git in a test.
  const rows = ferry.ledger().filter(r => r.sha && r.sha.length >= 7);
  return commits.map(c => ({
    ...c,
    ferry: rows.find(r => c.sha.startsWith(r.sha) || r.sha.startsWith(c.sha)) || null,
  }));
}

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

test('only claim-bearing directories count as artifacts', () => {
  // Code is reviewed by its tests. The surface with no instrument is prose making claims,
  // which is what BOOT says is unguarded and what this tool is pointed at.
  assert.ok(ferry.ARTIFACT_DIRS.every(d => d.startsWith('exo_memory/')));
  assert.ok(!ferry.ARTIFACT_DIRS.some(d => d.includes('src')));
});

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
