// universe-print.test.js - the P-UNIVERSE bar, pinned rather than demonstrated once.
//
// THE RULE (registered 2026-08-25, amended the same night): every instrument that sweeps a corpus
//   (1) prints its universe - N seen / M skipped / the rule that decided - ENUMERATED FROM AN
//       AUTHORITY OUTSIDE ITSELF, and
//   (2) demonstrates a positive before any green from it is believed.
// The bar the librarian set is specifically NOT "the tool still passes": A DELIBERATELY-HIDDEN
// ITEM MUST APPEAR IN THE SKIPPED COUNT, with the rule that skipped it.
//
// CLAUSE (1)'S SECOND HALF WAS LEARNED THE HARD WAY, BY THIS FILE FAILING TO CATCH IT. The first
// version of the brief item printed "5 seen · 0 skipped" over a hardcoded list of five names while
// SIX briefs are bundled. Pane E: "0 skipped is arithmetically correct and epistemically
// worthless" - a skip counter ranges over the instrument's OWN list, so a file missing from the
// list is not skipped, it is absent, and absence has no counter. BUILDING.md was that file, it was
// DRIFTED, and it carries the two-turn dispatch rule.
//
// CLAUSE (2) IS THE OTHER SPECIES AND A UNIVERSE PRINT IS BLIND TO IT. Turn-scan v1 read 100% of
// its transcript and would have printed "8,065 rows seen · 0 skipped · rule: the whole transcript"
// - every word true, the instrument structurally incapable of ever firing. So the tests below do
// not only ask what was skipped; they point the tool at a DIFFERENT authority and require the
// answer to change, which is the smallest available proof that the authority is read rather than
// recited.
//
// WHAT THIS FILE DOES AND DOES NOT COVER, stated because a test whose scope is unprinted is the
// same failure one level up:
//   COVERED      open-items.js - every item declares a universe; a corrupt ledger line is COUNTED
//                as skipped rather than filtered away; a clean ledger reports zero skipped; the
//                bundle item enumerates from tauri.conf.json and CHANGES ITS ANSWER when pointed
//                at a different authority; an empty bundle is refused rather than reported green;
//                an unreadable authority does NOT fall back to a built-in list.
//   NOT COVERED  dev/shell/install.ps1 -Check. Its universe is real and was demonstrated by hand
//                (a probe in dev/shell/hooks/ printed as UNMANAGED, a probe at the destination as
//                UNCLAIMED, both named). Automating it means planting files in the repo and in
//                ~/.claude/shell on every suite run, which is a decision for the seat that owns
//                the tree, not something to smuggle into a test file. The re-runnable command is
//                in the registration. Until someone lands that, install.ps1's universe print is
//                DEMONSTRATED AND UNPINNED, and this comment is the only thing saying so.
//
// Everything below runs against TEMP FIXTURES via VANTAGE_DATA, OPEN_ITEMS_TAURI_CONF and
// CARGO_TARGET_DIR. Nothing touches the repo, the build, or ~/.claude.

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

// ---------------------------------------------------------------------------------------------
// CLAUSE 1: the denominator comes from outside. OPEN_ITEMS_TAURI_CONF swaps the authority; the
// fixtures below are a complete miniature bundle, so every count is known in advance.

function bundleFixture(name, resources, files, buildFiles) {
  const root = path.join(tmp, name);
  const src = path.join(root, 'src');
  const rel = path.join(root, 'build', 'release');
  fs.mkdirSync(src, { recursive: true });
  fs.mkdirSync(rel, { recursive: true });
  for (const f of Object.keys(files)) {
    const p = path.join(src, f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, files[f]);
  }
  // releaseDir() probes for BOOT.md, so the fixture build must carry one to be found at all.
  fs.writeFileSync(path.join(rel, 'BOOT.md'), 'fixture');
  for (const f of Object.keys(buildFiles)) {
    const p = path.join(rel, f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, buildFiles[f]);
  }
  const conf = path.join(src, 'tauri.conf.json');
  fs.writeFileSync(conf, JSON.stringify({ bundle: { resources: resources } }, null, 1));
  return { conf: conf, target: path.join(root, 'build') };
}

function runBundle(fx, json) {
  const args = json ? [TOOL, '--json'] : [TOOL];
  const env = Object.assign({}, process.env, {
    OPEN_ITEMS_TAURI_CONF: fx.conf,
    CARGO_TARGET_DIR: fx.target,
  });
  const r = spawnSync(process.execPath, args, { encoding: 'utf8', env: env, maxBuffer: 32 * 1024 * 1024 });
  return r.stdout || '';
}
const item = (rows) => rows.find((x) => x.id === 'seed-carrier');

// A two-file bundle where the build is missing one of them, and a glob that expands to three plus
// one that matches nothing. Four known quantities, none of them derived from the tool.
const FX = bundleFixture('bundle',
  { 'a.md': 'a.md', 'b.md': 'b.md', 'sub/*.md': 'sub/', 'none/*.md': 'none/' },
  { 'a.md': 'A', 'b.md': 'B', 'sub/x.md': 'X', 'sub/y.md': 'Y', 'sub/z.md': 'Z' },
  { 'a.md': 'A', 'sub/x.md': 'X', 'sub/y.md': 'DRIFTED', 'sub/z.md': 'Z' });
const fxJson = JSON.parse(runBundle(FX, true) || '[]');

test('THE BAR on the real instance: a bundled file absent from the BUILD is COUNTED, with the side named', () => {
  // This is the bar the first version could not meet. A file outside the hardcoded list was not
  // skipped, it was absent, and absence had no counter - so BUILDING.md, bundled and drifted,
  // appeared nowhere in the output at all.
  const it = item(fxJson);
  assert.ok(it, 'the bundle item is missing');
  assert.strictEqual(it.universe.seen, 6, '2 named + 3 from the glob + 1 empty glob slot');
  assert.strictEqual(it.universe.skipped, 2, 'b.md is absent from the build; none/*.md matches nothing');
  const sk = it.universe.skippedList.join(' | ');
  assert.ok(sk.match(/b\.md \(absent from the BUILD/),
    'the missing file must be named WITH the side it is missing from, got: ' + sk);
  assert.ok(sk.match(/none\/\*\.md \(glob matched NOTHING/),
    'a glob that ships zero files must be counted, not contribute silently: ' + sk);
});

test('the AUTHORITY is read, not recited - a different bundle produces a different number', () => {
  // Species B's question in its smallest form: can the unit produce a different answer at all?
  // If the tool ignored OPEN_ITEMS_TAURI_CONF and kept its own list, seen would not move.
  const real = cleanJson.find((r) => r.id === 'seed-carrier');
  assert.ok(real && real.universe.seen > 6,
    'the real bundle should be materially larger than the 6-file fixture; got ' + (real && real.universe.seen));
  assert.notStrictEqual(item(fxJson).universe.seen, real.universe.seen,
    'the reported universe did not change when the authority did - the count is not being read');
  assert.ok(item(fxJson).universe.rule.match(/bundle\.resources/),
    'the rule must name the authority it enumerated from');
});

test('drift is found across the glob-expanded files, not only the named ones', () => {
  // POSITIVE CONTROL for the sweep itself. Without it, "6 seen · 2 skipped" is satisfied by a tool
  // that enumerates correctly and then compares nothing - a structural zero with a good universe
  // line, which is exactly the failure clause 2 exists for.
  const it = item(fxJson);
  assert.strictEqual(it.state, 'OPEN');
  assert.ok(it.detail.match(/sub\/y\.md/), 'the drifted glob-expanded file must be named: ' + it.detail);
});

test('ARMED: a bundle that resolves to nothing is refused, not reported green', () => {
  // carrier-drift's rule applied here - "a registry with no withdrawals in it is not a green tree,
  // it is an unarmed instrument". A check that cannot fail must say so instead of passing.
  const EMPTY = bundleFixture('empty', {}, {}, {});
  const rows = JSON.parse(runBundle(EMPTY, true) || '[]');
  const it = item(rows);
  assert.strictEqual(it.state, 'UNKNOWN', 'an empty corpus must not produce a verdict');
  assert.ok(it.detail.match(/could not fail if it tried/),
    'the refusal must say WHY it is a refusal rather than a pass: ' + it.detail);
});

test('NO FALLBACK: an unreadable authority goes UNKNOWN rather than reverting to a built-in list', () => {
  // The fallback is how a hardcoded list survives a fix that removed it, and the hardcoded list is
  // the entire defect. If this ever passes by comparing five briefs, the fix has been undone.
  const rows = JSON.parse(runBundle({ conf: path.join(tmp, 'nope', 'tauri.conf.json'), target: path.join(tmp, 'bundle', 'build') }, true) || '[]');
  const it = item(rows);
  assert.strictEqual(it.state, 'UNKNOWN');
  assert.strictEqual(it.universe.seen, 0, 'nothing may be enumerated when the authority is gone');
  assert.ok(it.universe.rule.match(/NO \n?hardcoded fallback|no \n?hardcoded fallback/i)
    || it.universe.rule.match(/hardcoded fallback/),
    'the absence of a fallback must be stated, not merely true: ' + it.universe.rule);
  assert.ok(!it.detail.match(/\bbrief\(s\)? byte-identical/), 'it fell back to comparing briefs anyway');
});

console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
