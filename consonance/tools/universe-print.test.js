// universe-print.test.js - the P-UNIVERSE bar, pinned rather than demonstrated once.
//
// THE RULE (registered 2026-08-25): every instrument that sweeps a corpus prints its universe -
// N seen / M skipped / the rule that decided - on every run. The bar the librarian set is
// specifically NOT "the tool still passes": A DELIBERATELY-HIDDEN ITEM MUST APPEAR IN THE SKIPPED
// COUNT, with the rule that skipped it. Silence about a shrunken denominator is the defect.
//
// WHAT THIS FILE DOES AND DOES NOT COVER, stated because a test whose scope is unprinted is the
// same failure one level up:
//   COVERED      open-items.js - every item declares a universe; a corrupt ledger line is COUNTED
//                as skipped rather than filtered away; a clean ledger reports zero skipped.
//   NOT COVERED  dev/shell/install.ps1 -Check. Its universe is real and was demonstrated by hand
//                (a probe in dev/shell/hooks/ printed as UNMANAGED, a probe at the destination as
//                UNCLAIMED, both named). Automating it means planting files in the repo and in
//                ~/.claude/shell on every suite run, which is a decision for the seat that owns
//                the tree, not something to smuggle into a test file. The re-runnable command is
//                in the registration. Until someone lands that, install.ps1's universe print is
//                DEMONSTRATED AND UNPINNED, and this comment is the only thing saying so.
//
// Everything below runs against TEMP FIXTURES via VANTAGE_DATA. Nothing touches real state.

'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const TOOL = path.join(__dirname, 'open-items.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'universe-'));

// Two fixture data dirs, identical but for ONE truncated line. That single difference is the
// whole experiment: anything the two runs disagree about is caused by the unparseable row.
function fixture(name, corrupt) {
  const d = path.join(tmp, name);
  fs.mkdirSync(d, { recursive: true });
  const findings = [
    JSON.stringify({ status: 'UNLAUNCHABLE' }),
    JSON.stringify({ status: 'UNLAUNCHABLE' }),
  ];
  const sourced = [
    JSON.stringify({ claims: [{ channel: 'artifact' }], heads: {} }),
    JSON.stringify({ claims: [{ channel: 'artifact' }], heads: { a: 'b' } }),
  ];
  if (corrupt) {
    findings.push('{"status":"UNLAUNCH');      // truncated mid-write, the realistic shape
    sourced.push('{"claims":[{"channel":"art');
  }
  fs.writeFileSync(path.join(d, 'vantage_findings.jsonl'), findings.join('\n') + '\n');
  fs.writeFileSync(path.join(d, 'sourced_ledger.jsonl'), sourced.join('\n') + '\n');
  fs.writeFileSync(path.join(d, 'vantage_runs.log'), '2026-08-01T00:00:00.000Z start\n');
  return d.split(path.sep).join('/');
}

function run(dataDir, json) {
  const args = json ? [TOOL, '--json'] : [TOOL];
  const r = spawnSync(process.execPath, args, {
    encoding: 'utf8',
    env: Object.assign({}, process.env, { VANTAGE_DATA: dataDir }),
    maxBuffer: 32 * 1024 * 1024,
  });
  return r.stdout || '';
}

console.log('universe-print (P-UNIVERSE bar)');

const CORRUPT = fixture('corrupt', true);
const CLEAN = fixture('clean', false);

// Two spawns, reused across the tests below. open-items shells out to actors.test.js, so each run
// costs seconds; spawning per assertion would make the suite slower than the thing it guards.
const corruptHuman = run(CORRUPT, false);
const cleanJson = JSON.parse(run(CLEAN, true) || '[]');
const corruptJson = JSON.parse(run(CORRUPT, true) || '[]');

test('EVERY item declares a universe - seen, skipped, and the rule that decided', () => {
  assert.ok(cleanJson.length, 'no items came back at all');
  for (const it of cleanJson) {
    assert.ok(it.universe, `${it.id} declares no universe - its verdict is over an unstated surface`);
    assert.strictEqual(typeof it.universe.seen, 'number', `${it.id}.universe.seen is not a number`);
    assert.strictEqual(typeof it.universe.skipped, 'number', `${it.id}.universe.skipped is not a number`);
    assert.ok(it.universe.rule && it.universe.rule.length > 20,
      `${it.id} states a count without the rule that produced it - a denominator you cannot audit`);
  }
});

test('THE BAR: a deliberately-corrupted ledger line is COUNTED as skipped, not dropped', () => {
  // Before this change both readers did .map(JSON.parse-or-null).filter(Boolean), so an
  // unparseable row silently shrank the denominator and the verdict read as a smaller clean set.
  const f = corruptJson.find((r) => r.id === 'f1-vantage-clock');
  assert.ok(f, 'f1-vantage-clock missing');
  assert.strictEqual(f.universe.skipped, 1, 'the truncated line must appear in the skipped count');
  assert.strictEqual(f.universe.seen, 3, 'seen must count the LINE, not the rows that survived it');
  assert.ok(f.universe.skippedList.join(' ').match(/did not parse/),
    'the skipped item must say WHY it was skipped, not merely that it was');

  const v = corruptJson.find((r) => r.id === 'vantage-reach');
  assert.ok(v.universe.skipped >= 1, 'the sourced ledger`s truncated line must be counted too');
  assert.ok(v.universe.rule.match(/unparseable/), 'the rule must name unparseable rows as a category');
});

test('POSITIVE CONTROL: the same fixture without the corrupt line reports ZERO skipped', () => {
  // Without this, a tool that reported "1 skipped" unconditionally would pass the test above, and
  // the skipped count would be decoration rather than a measurement.
  const f = cleanJson.find((r) => r.id === 'f1-vantage-clock');
  assert.strictEqual(f.universe.skipped, 0, 'a clean ledger must skip nothing');
  assert.strictEqual(f.universe.seen, 2, 'and must see both good lines');
});

test('the OUTER denominator is printed, not only the subset the question scores', () => {
  // vantage-reach reports "N of M artifact rows". M is a SUBSET of the ledger, and a reader shown
  // only M reads the percentage as a share of the whole file. The universe must carry both.
  const v = cleanJson.find((r) => r.id === 'vantage-reach');
  assert.strictEqual(v.universe.seen, 2, 'seen is every line in the ledger');
  assert.ok(v.universe.rule.match(/out of scope/),
    'rows the question does not apply to must be named as out of scope, not merely omitted');
});

test('the instrument states the ONE denominator it cannot walk - its own item list', () => {
  // The failure this rule cannot fix by printing: the ITEMS array is hand-maintained. A commitment
  // nobody wrote a check() for is not CLOSED here, it is ABSENT - and absent reads like done.
  // Refusing to say so would make this file the fourth instance of the class it exists to close.
  assert.ok(corruptHuman.match(/universe .+ what this instrument could and could not see/),
    'the human output carries no instrument-level universe');
  assert.ok(corruptHuman.match(/HAND-MAINTAINED AND CANNOT BE WALKED/),
    'the hand-maintained limit must be stated in words, every run');
});

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
