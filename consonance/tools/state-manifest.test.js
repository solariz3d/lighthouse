// state-manifest.test.js — run with: node state-manifest.test.js
//
// THE MANIFEST IS A CLAIM ABOUT EVERY PATH, AND UNTIL THIS FILE EXISTED NOTHING CHECKED IT.
// P-STATE-SET's own bar was "a path in no column fails the check". That was true when it was run
// by hand and read by a person, which is a control with a hook's failure mode: silent absence.
//
// EVERY TEST RUNS AGAINST A FIXTURE, never against C:\Consonance\data. That is not tidiness. A
// test whose universe is the one live directory it was written against is green by construction
// on anything nobody thought of — the defect this repo has now shipped three times (actors.test.js
// over a foreign board; the guard that went inert when a constant left the source; the suite that
// counted buckets instead of executions). So this file is portable: it declares its own corpus
// every time, and it must pass identically on a machine that has no data dir at all.
//
// The first test is the one that matters, and it is the red one: a fixture containing a path no
// rule covers must EXIT 1 and name it. If that test ever passes green, this instrument has
// stopped being able to say no and everything else in this file is decoration.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const TOOL = path.join(__dirname, 'state-manifest.js');
let pass = 0, fail = 0;

function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'statemanifest-'));
let seq = 0;

/** A fixture data dir + a fixture manifest. `files` maps relative path -> contents. */
function fixture(files, manifest) {
  const dir = path.join(tmp, 'case' + (++seq));
  const data = path.join(dir, 'data');
  for (const [rel, body] of Object.entries(files)) {
    const p = path.join(data, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  }
  fs.mkdirSync(data, { recursive: true });
  const man = path.join(dir, 'manifest.json');
  fs.writeFileSync(man, JSON.stringify(manifest));
  return { data, man };
}

/** Run the tool over a fixture. Never throws — the exit code is the thing under test. */
function run(fx, args = []) {
  const env = { ...process.env, CONSONANCE_DATA: fx.data, STATE_MANIFEST: fx.man };
  try {
    const out = execFileSync(process.execPath, [TOOL, ...args], { encoding: 'utf8', env });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}
function runJson(fx) {
  const r = run(fx, ['--json']);
  return { ...r, json: JSON.parse(r.out) };
}

const OK = { version: 1, rules: [{ glob: 'a.jsonl', class: 'TRAVELS', why: 'x' }] };

// ---- the bar: a path in no column fails --------------------------------------------------

test('a file matching no rule exits 1 and names the path', () => {
  const fx = fixture({ 'a.jsonl': 'x', 'nobody-classified-this.jsonl': 'y' }, OK);
  const r = run(fx);
  assert.strictEqual(r.code, 1, 'an unclassified path must fail the run, not warn in it');
  assert.ok(r.out.includes('nobody-classified-this.jsonl'), 'the unplaced path must be NAMED — a count alone leaves the reader to find it');
});

test('an unclassified DIRECTORY is caught, not only files', () => {
  // The failure this guards is a whole subtree arriving unclassified because only files were
  // walked. A directory carries its contents wherever it goes.
  const fx = fixture({ 'a.jsonl': 'x', 'strange/thing.json': 'y' }, OK);
  const r = run(fx);
  assert.strictEqual(r.code, 1);
  assert.ok(r.out.includes('strange'), 'the directory itself must appear, not just its contents');
});

test('a fully classified fixture exits 0', () => {
  const fx = fixture({ 'a.jsonl': 'x' }, OK);
  const r = run(fx);
  assert.strictEqual(r.code, 0, r.out);
});

test('an EMPTY data dir exits 0 — nothing present is nothing unplaced', () => {
  const fx = fixture({}, OK);
  assert.strictEqual(run(fx).code, 0);
});

// ---- the enumeration is a live walk, not a fixed list ------------------------------------

test('a path created AFTER the manifest was written is still caught', () => {
  // The whole question the chair asked on 2026-09-09: is the universe the disk or a list? If it
  // were a list, this file would be invisible and the run would be green.
  const fx = fixture({ 'a.jsonl': 'x' }, OK);
  assert.strictEqual(run(fx).code, 0, 'green before');
  fs.writeFileSync(path.join(fx.data, 'appeared-later.json'), 'z');
  const r = run(fx);
  assert.strictEqual(r.code, 1, 'the walk must see a file the manifest never anticipated');
  assert.ok(r.out.includes('appeared-later.json'));
});

// ---- REGENERATES is audited, not trusted -------------------------------------------------

test('REGENERATES without regenerated_by is a class error', () => {
  const fx = fixture({ 'a.jsonl': 'x' }, { version: 1, rules: [{ glob: 'a.jsonl', class: 'REGENERATES', why: 'x', regenerated_when: 'later' }] });
  const r = run(fx);
  assert.strictEqual(r.code, 1);
  assert.ok(/regenerated_by/.test(r.out));
});

test('REGENERATES without regenerated_when is a class error', () => {
  const fx = fixture({ 'a.jsonl': 'x' }, { version: 1, rules: [{ glob: 'a.jsonl', class: 'REGENERATES', why: 'x', regenerated_by: 'something.js' }] });
  const r = run(fx);
  assert.strictEqual(r.code, 1);
  assert.ok(/regenerated_when/.test(r.out));
});

test('REGENERATES with both a writer and a time passes', () => {
  const fx = fixture({ 'a.jsonl': 'x' }, { version: 1, rules: [{ glob: 'a.jsonl', class: 'REGENERATES', why: 'x', regenerated_by: 'w.js', regenerated_when: 'at launch' }] });
  assert.strictEqual(run(fx).code, 0);
});

test('UNDECIDED without decided_by is a class error', () => {
  const fx = fixture({ 'a.jsonl': 'x' }, { version: 1, rules: [{ glob: 'a.jsonl', class: 'UNDECIDED', why: 'x' }] });
  const r = run(fx);
  assert.strictEqual(r.code, 1);
  assert.ok(/decided_by/.test(r.out));
});

test('an unknown class name is REPORTED, not crashed through', () => {
  // This test found a real defect on the day it was written: the tool exited 1 by TypeError,
  // and an assertion on the exit code alone went green over a crash. A check that cannot tell a
  // detection from a collapse is not a check — so the reason is asserted, not the number.
  const fx = fixture({ 'a.jsonl': 'x' }, { version: 1, rules: [{ glob: 'a.jsonl', class: 'MAYBE', why: 'x' }] });
  const r = run(fx);
  assert.strictEqual(r.code, 1);
  assert.ok(/CLASS ERROR/.test(r.out), 'the fault must be named');
  assert.ok(!/TypeError/.test(r.out), 'and it must not be a crash wearing the right exit code');
});

test('a broken manifest prints NO totals', () => {
  // The transport decision is made on the TRAVELS figure. A number computed under a rule set that
  // does not parse into classes reads exactly as authoritative as a good one.
  const fx = fixture({ 'a.jsonl': 'x' }, { version: 1, rules: [{ glob: 'a.jsonl', class: 'MAYBE', why: 'x' }] });
  assert.ok(!/TRAVELS = /.test(run(fx).out));
});

// ---- the totals ---------------------------------------------------------------------------

test('TRAVELS is the exact byte sum of the travelling files', () => {
  const fx = fixture({ 'a.jsonl': '12345', 'b.jsonl': '123', 'c.log': '1234567' },
    { version: 1, rules: [
      { glob: 'a.jsonl', class: 'TRAVELS', why: 'x' },
      { glob: 'b.jsonl', class: 'TRAVELS', why: 'x' },
      { glob: 'c.log', class: 'STAYS', why: 'x' },
    ] });
  const r = runJson(fx);
  assert.strictEqual(r.json.totals.TRAVELS.bytes, 8, 'exact bytes, not an estimate');
  assert.strictEqual(r.json.totals.STAYS.bytes, 7);
});

test('UNDECIDED bytes are NOT counted in TRAVELS', () => {
  // The point of the fourth state: a path nobody has ruled must not silently inflate or deflate
  // the number a transport decision gets made on.
  const fx = fixture({ 'a.jsonl': '12345' },
    { version: 1, rules: [{ glob: 'a.jsonl', class: 'UNDECIDED', why: 'x', decided_by: 'a ruling' }] });
  const r = runJson(fx);
  assert.strictEqual(r.json.totals.TRAVELS.bytes, 0);
  assert.strictEqual(r.json.totals.UNDECIDED.bytes, 5);
});

test('a directory contributes paths but no bytes', () => {
  const fx = fixture({ 'd/x.json': '1234' },
    { version: 1, rules: [{ glob: 'd', class: 'TRAVELS', why: 'x' }, { glob: 'd/*.json', class: 'TRAVELS', why: 'x' }] });
  const r = runJson(fx);
  assert.strictEqual(r.json.totals.TRAVELS.paths, 2);
  assert.strictEqual(r.json.totals.TRAVELS.files, 1);
  assert.strictEqual(r.json.totals.TRAVELS.bytes, 4);
});

// ---- matching semantics --------------------------------------------------------------------

test('first match wins when two rules GENUINELY overlap', () => {
  // Written wrong the first time, and a mutant caught it: the original fixture paired
  // '*.txt.bak-*' with '*.txt', which are ANCHORED and therefore do not overlap at all — so
  // "last match wins" passed it untouched. A test for an ordering rule has to contain a path
  // that two rules both claim, or it is testing nothing.
  const fx = fixture({ 'x.txt': '1', 'y.log': '22' },
    { version: 1, rules: [
      { glob: '*.txt', class: 'TRAVELS', why: 'the narrow rule, placed first' },
      { glob: '**', class: 'STAYS', why: 'the catch-all beneath it' },
    ] });
  const r = runJson(fx);
  assert.strictEqual(r.json.totals.TRAVELS.bytes, 1, 'the earlier, narrower rule must win');
  assert.strictEqual(r.json.totals.STAYS.bytes, 2, 'and the catch-all takes only what is left');
});

test('the ordering also holds for the shipped pattern shape (bak before txt)', () => {
  const fx = fixture({ 'x.txt': '1', 'x.txt.bak-20260713': '22' },
    { version: 1, rules: [
      { glob: '*.txt.bak-*', class: 'STAYS', why: 'x' },
      { glob: '*.txt', class: 'TRAVELS', why: 'x' },
    ] });
  const r = runJson(fx);
  assert.strictEqual(r.json.totals.TRAVELS.bytes, 1);
  assert.strictEqual(r.json.totals.STAYS.bytes, 2);
});

test('a glob is anchored at both ends and cannot widen into a catch-all', () => {
  const fx = fixture({ 'a.jsonl': 'x', 'a.jsonl.old': 'y' }, OK);
  const r = run(fx);
  assert.strictEqual(r.code, 1, "'a.jsonl' must not match 'a.jsonl.old'");
  assert.ok(r.out.includes('a.jsonl.old'));
});

test('* does not cross a directory separator; ** does', () => {
  const one = fixture({ 'd/x.json': '1' }, { version: 1, rules: [{ glob: 'd', class: 'STAYS', why: 'x' }, { glob: '*.json', class: 'STAYS', why: 'x' }] });
  assert.strictEqual(run(one).code, 1, "'*.json' must not reach into d/");
  const two = fixture({ 'd/x.json': '1' }, { version: 1, rules: [{ glob: 'd', class: 'STAYS', why: 'x' }, { glob: '**', class: 'STAYS', why: 'x' }] });
  assert.strictEqual(run(two).code, 0);
});

// ---- declared-but-absent: the MISSING-FILE ruling, mechanised --------------------------------

test('a rule matching nothing reports as declared-not-present, and is NOT an error', () => {
  // A deliberate absence and an accidental one read identically in a listing. The declaration is
  // the only thing that separates them, so it must be reported and must not fail the run.
  const fx = fixture({ 'a.jsonl': 'x' },
    { version: 1, rules: [{ glob: 'a.jsonl', class: 'TRAVELS', why: 'x' }, { glob: 'attic/board.jsonl.*', class: 'STAYS', why: 'declared early' }] });
  const r = runJson(fx);
  assert.strictEqual(r.code, 0, 'declaring a path before it exists is correct, not a fault');
  assert.ok(r.json.declared_not_present.includes('attic/board.jsonl.*'));
});

// ---- FORBIDDEN: install_id's silent failure, made loud ----------------------------------------

const FORBID = {
  version: 1,
  rules: [{ glob: 'a.jsonl', class: 'TRAVELS', why: 'x' }],
  forbidden: [{ glob: 'install_id*', why: 'both machines would share an identity' }],
};

test('a forbidden path that is absent leaves the run green', () => {
  assert.strictEqual(run(fixture({ 'a.jsonl': 'x' }, FORBID)).code, 0);
});

test('a forbidden path that EXISTS fails the run and says why', () => {
  const fx = fixture({ 'a.jsonl': 'x', 'install_id.json': 'abc' }, FORBID);
  const r = run(fx);
  assert.strictEqual(r.code, 1, 'the file E named as the silent failure must be a loud one here');
  assert.ok(r.out.includes('install_id.json'));
  assert.ok(r.out.includes('share an identity'), 'the reason travels with the failure, not just the path');
});

test('a forbidden path is NOT reported as placed even when a rule would match it', () => {
  // The reading this denies: "install_id.json — STAYS" in a listing, which is exactly the
  // false compliance that made a STAYS rule the wrong answer in the first place.
  const fx = fixture({ 'a.jsonl': 'x', 'install_id.json': 'abc' }, {
    ...FORBID, rules: [...FORBID.rules, { glob: 'install_id*', class: 'STAYS', why: 'x' }],
  });
  const r = runJson(fx);
  assert.strictEqual(r.code, 1);
  assert.strictEqual(r.json.totals.STAYS.paths, 0, 'a forbidden path must not be counted as classified');
  assert.strictEqual(r.json.forbidden_present.length, 1);
});

// ---- the refusal ------------------------------------------------------------------------------

test('no corpus declared: refuses with exit 2 rather than guessing a data dir', () => {
  // Exit 2, not 1: "I could not look" and "I looked and found a fault" are different outcomes and
  // the caller must be able to tell them apart. A guessed path reports about the wrong disk, which
  // is the defect actors.test.js shipped for a week.
  const fx = fixture({ 'a.jsonl': 'x' }, OK);
  const env = { ...process.env, STATE_MANIFEST: fx.man, CONSONANCE_DATA: '', USERPROFILE: path.join(tmp, 'no-home'), HOME: path.join(tmp, 'no-home') };
  let code = 0, out = '';
  try { execFileSync(process.execPath, [TOOL], { encoding: 'utf8', env }); }
  catch (e) { code = e.status; out = (e.stdout || '') + (e.stderr || ''); }
  assert.strictEqual(code, 2, 'a refusal is not a failed check');
  assert.ok(/Refusing rather than guessing/i.test(out));
});

test('a declared data dir that does not exist is exit 2, not an empty green', () => {
  const fx = fixture({ 'a.jsonl': 'x' }, OK);
  const env = { ...process.env, STATE_MANIFEST: fx.man, CONSONANCE_DATA: path.join(tmp, 'not-here') };
  let code = 0;
  try { execFileSync(process.execPath, [TOOL], { encoding: 'utf8', env }); } catch (e) { code = e.status; }
  assert.strictEqual(code, 2, 'an absent corpus reported as "0 unplaced" is the false green this file exists to deny');
});

// ---- the real manifest ------------------------------------------------------------------------

test('the shipped manifest parses and every rule carries a reason', () => {
  const man = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'state-manifest.json'), 'utf8'));
  assert.ok(man.rules.length > 0);
  for (const r of man.rules) {
    assert.ok(r.glob && r.class, 'every rule needs a glob and a class');
    assert.ok(r.why && r.why.length > 10, `rule ${r.glob} has no reason, and a classification without one cannot be argued with`);
  }
  for (const f of man.forbidden || []) assert.ok(f.glob && f.why, 'every forbidden entry needs a reason');
});

// L068, from C's L066 diagnosis §2.4: the vantage_cell rule said "an EMPTY working directory", and
// since 2026-09-14 01:23 it has held a 3,383 B harness log that blocked every close as UNPLACED.
const SHIPPED = () => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'state-manifest.json'), 'utf8'));

// (Its placement test was WITHDRAWN at D100 with the rule it tested; the D100 test below is its inverse.)

// D099: the second leftover in the cell. A blind-verifier reader (session 288d78a5, 2026-09-10 15:14Z on D) made a scratch
// copy under ./_verify_refuse/consonance/tools/, cd'd into it, and its `rm -rf` failed "Device or resource busy" — its own
// shell's cwd was inside the tree. The files went; three empty directories stayed, and blocked every close on D.
function withVerifyRefuse(extra) {
  const fx = fixture(extra || {}, SHIPPED());
  fs.mkdirSync(path.join(fx.data, 'vantage_cell', '_verify_refuse', 'consonance', 'tools'), { recursive: true });
  return fx;
}

// (Its two placement tests were WITHDRAWN at D100 with the two rules they tested; the D100 tests below invert them.)

test('D099: a DIFFERENT scratch directory in the cell is still UNPLACED — the rule names this tree, not the cell', () => {
  const fx = withVerifyRefuse();
  fs.mkdirSync(path.join(fx.data, 'vantage_cell', '_verify_other'), { recursive: true });
  const r = run(fx);
  assert.strictEqual(r.code, 1, 'the next leftover must still be loud');
  assert.ok(r.out.includes('vantage_cell/_verify_other'));
});

// D100: readers no longer run in the data dir (E, 4d1c417: <os tmpdir>/consonance/vantage_cell), and the librarian ruled
// that ALL FOUR vantage_cell rules go, so anything that reappears there is a new writer and must refuse loudly.

test('D100: the vantage_cell directory itself is UNPLACED — no rule places the old cell', () => {
  const fx = fixture({}, SHIPPED());
  fs.mkdirSync(path.join(fx.data, 'vantage_cell'), { recursive: true });
  const r = run(fx);
  assert.strictEqual(r.code, 1, 'a cell reappearing in the data dir means something still writes there');
  assert.ok(r.out.includes('vantage_cell'), r.out);
});

test('D100: vantage_cell/mutants-run.log is UNPLACED — the L068 shelf is gone', () => {
  const r = run(fixture({ 'vantage_cell/mutants-run.log': '  killed  x\n' }, SHIPPED()));
  assert.strictEqual(r.code, 1);
  assert.ok(r.out.includes('vantage_cell/mutants-run.log'), r.out);
});

test('D100: the empty _verify_refuse tree is UNPLACED — the D099 shelf is gone', () => {
  const r = run(withVerifyRefuse());
  assert.strictEqual(r.code, 1);
  assert.ok(r.out.includes('vantage_cell/_verify_refuse/consonance/tools'), r.out);
});

test('any OTHER file left in vantage_cell is still UNPLACED — the rule is named, not a wildcard', () => {
  const fx = fixture({ 'vantage_cell/mutants-run.log': 'x', 'vantage_cell/something-else.txt': 'y' }, SHIPPED());
  const r = run(fx);
  assert.strictEqual(r.code, 1, 'a reader\'s next stray file must be loud, not silently local');
  assert.ok(r.out.includes('vantage_cell/something-else.txt'));
});

// L071 C2: the union's own backups. ledger-union.js --write keeps each original BESIDE the live file as
// <file>.pre-union-<stamp>; they are the ONLY pre-union copies, so they stay — and stay here, local, like the
// pre-quarantine snapshot above them in the manifest. The rule names the two ledgers the write touches, nothing wider.
test('L071: the two union backups beside the live ledgers are placed (STAYS)', () => {
  const r = run(fixture({
    'lap.jsonl.pre-union-2026-09-22T08-47-16-301Z': '{"lap":"L001"}\n',
    'board.jsonl.pre-union-2026-09-22T08-47-24-570Z': '{"ts":1}\n',
  }, SHIPPED()));
  assert.strictEqual(r.code, 0, r.out);
});

test('L071: a pre-union copy of any OTHER file is still UNPLACED — the rule is named, not a wildcard', () => {
  const r = run(fixture({ 'ferry.jsonl.pre-union-2026-09-22T08-47-16-301Z': 'x\n' }, SHIPPED()));
  assert.strictEqual(r.code, 1, 'a pre-union copy of a file the union never writes is something else, and must be loud');
  assert.ok(r.out.includes('ferry.jsonl.pre-union-'), r.out);
});

// THE SUMMARY STAYS LAST. This runner exits here, so any test written below this line never runs and never fails —
// L071's two tests were appended below it first and reported "30 passed" while not having run at all.
console.log(`\n${pass} passed, ${fail} failed`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
