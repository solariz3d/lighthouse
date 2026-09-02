// lap-row.test.js - each test drives a ledger in a temp directory; nothing touches C:\Consonance\data.
// Run: node --test consonance/tools/lap-row.test.js
//
// THE ORDERING TESTS ARE THE POINT. The metric is worthless if a guess can be written or amended
// after a map exists, so those cases are asserted as REFUSALS in code rather than trusted to a
// convention. A test suite here that only covered the happy path would bless exactly the ledger the
// tool exists to prevent.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const TOOL = path.join(__dirname, 'lap-row.js');
const NODE = process.execPath;

/* THE PIN, added 2026-08-25 after the desktop ran this suite and 18 of 33 tests went red.
 *
 * WHAT HAPPENED. `dcb0d9b` (rule 2W-1) made `mintId` derive its tag per machine --
 * LAP_MACHINE_TAG -> ~/.consonance.json `machine_tag` -> the hostname's first alphanumeric. That
 * is the fix working as designed: the desktop mints D001 exactly as specified. This FILE, though,
 * still names the minted ids as literals (`L001`, `L004`, `L009`) at roughly fifteen sites, so
 * every test that mints a lap and then addresses it by name was asserting a fact about WHICH
 * MACHINE WAS RUNNING rather than about the ledger. Verified rather than assumed, both directions:
 *
 *     git show dcb0d9b~1:consonance/tools/lap-row.js  -> mintId returned 'L' + n unconditionally
 *     LAP_MACHINE_TAG=D node --test consonance/tools/lap-row.test.js  -> 18 of 33 fail
 *
 * So the suite was portable BEFORE 2W-1 and became machine-dependent AT it. It was green when
 * committed on exactly one machine and red on every other from that moment -- the same shape as
 * "verified it existed, never verified it shipped", one axis over: verified it passes HERE.
 *
 * WHAT THE PIN DOES, AND WHAT IT MUST NOT DO. Fixing the tag makes the tests below assert LEDGER
 * LOGIC -- ordering, seals, max+1, the metric -- on any machine. It must not also swallow the
 * per-machine property, or the pin would have eaten the thing 2W-1 exists to hold. It does not,
 * and the reason is mechanical rather than a promise: the three `2W-1:` tests at the foot of this
 * file each set the tag EXPLICITLY in the child env, and the unconfigured-machine test DELETES
 * this variable and blanks HOME/USERPROFILE so the hostname derivation is the only path left. A
 * pin at this level cannot reach into a child env that overrides or removes it.
 *
 * Checked by mutation on 2026-08-25 WITH the pin in place: a `machineTag` returning a constant,
 * one falling back to a constant only when unconfigured, and one ignoring the env override all go
 * RED here. If a later edit makes any of those survive, the pin has begun eating the property and
 * this comment is where to start. The commands are in the hand-back. */
process.env.LAP_MACHINE_TAG = 'L';

/** A fresh ledger and a fresh module instance bound to it. */
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-'));
  const ledger = path.join(dir, 'lap.jsonl');
  process.env.LAP_LEDGER = ledger;
  delete require.cache[require.resolve('./lap-row.js')];
  const mod = require('./lap-row.js');
  return { dir, ledger, mod, cleanup: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

function cli(args, ledger) {
  try {
    return { code: 0, stdout: execFileSync(NODE, [TOOL, ...args], { encoding: 'utf8', env: { ...process.env, LAP_LEDGER: ledger } }) };
  } catch (e) {
    return { code: e.status, stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

// ---------------------------------------------------------------- the pin itself

test('pin: the ledger-logic tests address a PINNED tag, not this machine', () => {
  // Without this, removing the pin fails eighteen tests with `no such lap: L001` and nothing in
  // the output says why -- the reader has to know that `mintId` is per-machine to decode it. One
  // named failure is the whole point of this test; it asserts no ledger behaviour of its own.
  const { mod, cleanup } = fixture();
  assert.strictEqual(mod.mintId([]), 'L001',
    'LAP_MACHINE_TAG is not pinned to L for this file, so every literal id below names a machine ' +
    'rather than a lap. See the pin comment at the head of this file. This is NOT a defect in ' +
    'mintId: per-machine derivation is rule 2W-1 working, and the three 2W-1 tests below still ' +
    'assert it independently of this pin.');
  cleanup();
});

// ---------------------------------------------------------------- paths

test('path: a map item with a line number matches the same file without one', () => {
  // BUILDING.md says a map item is "a path and a line and one clause". Without stripping the
  // suffix the two seats never intersect and the metric reads zero forever while both are naming
  // the same file.
  const { mod, cleanup } = fixture();
  assert.strictEqual(mod.normPath('exo_memory/journal/2026-08-11.md:47'), 'exo_memory/journal/2026-08-11.md');
  assert.strictEqual(mod.normPath('muscle_map.md:321-325'), 'muscle_map.md');
  cleanup();
});

test('path: an absolute repo path normalises to the repo-relative one', () => {
  const { mod, cleanup } = fixture();
  assert.strictEqual(mod.normPath('C:\\Consonance\\lighthouse\\consonance\\tools\\ferry.js'), 'consonance/tools/ferry.js');
  cleanup();
});

test('path: a directory-shaped guess is BROAD; a file is not', () => {
  const { mod, cleanup } = fixture();
  assert.strictEqual(mod.isBroad('exo_memory/loop/'), true);
  assert.strictEqual(mod.isBroad('exo_memory/loop'), true);
  assert.strictEqual(mod.isBroad('exo_memory/BOOT.md'), false);
  cleanup();
});

// ---------------------------------------------------------------- the ordering guarantee

test('ORDERING: --open accepts no lap id, so a guess cannot be attached to an existing lap', () => {
  // The first mechanism, and the strongest: there is no argument through which to do it.
  const src = fs.readFileSync(TOOL, 'utf8');
  const openFn = src.slice(src.indexOf('function open('), src.indexOf('function map('));
  assert.doesNotMatch(openFn, /at\('--lap'\)|argv\[/, 'open() must not read a caller-supplied id');
});

test('ORDERING: a lap already carrying a map refuses a second one', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a/b.md'], now: 1 });
  mod.map('L001', ['a/b.md'], 2);
  assert.throws(() => mod.map('L001', ['c/d.md'], 3), /already has a map/);
  assert.strictEqual(fs.readFileSync(ledger, 'utf8').trim().split('\n').length, 2, 'the refused write must not append');
  cleanup();
});

test('ORDERING: a map on a lap with no open row is refused', () => {
  const { mod, ledger, cleanup } = fixture();
  fs.writeFileSync(ledger, JSON.stringify({ lap: 'L009', stage: 'opened', at: 1, paths: [] }) + '\n');
  assert.throws(() => mod.map('L009', ['a/b.md'], 2), /no open row/);
  cleanup();
});

test('ORDERING: the seal catches a guess edited by hand after the map was written', () => {
  // The one route the argument surface cannot close: editing the JSONL directly. The lap is
  // reported TAMPERED and EXCLUDED, never quietly counted.
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a/b.md'], now: 1 });
  mod.map('L001', ['x/y.md'], 2);
  const lines = fs.readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse);
  lines[0].guess = ['x/y.md'];                       // revise the prior to match the map
  fs.writeFileSync(ledger, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
  const l = mod.laps()[0];
  assert.strictEqual(l.integrity, 'TAMPERED');
  cleanup();
});

test('ORDERING: a map row timestamped before its open row is OUT-OF-ORDER even if the seal matches', () => {
  // Checked independently of the hash: a map written before its guess is not a lap, whatever the
  // hashes say.
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a/b.md'], now: 100 });
  mod.map('L001', ['a/b.md'], 200);
  const lines = fs.readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse);
  lines[1].at = 50;
  fs.writeFileSync(ledger, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
  assert.strictEqual(mod.laps()[0].integrity, 'OUT-OF-ORDER');
  cleanup();
});

test('ORDERING: a map with no seal at all is UNSEALED, never a pass', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a/b.md'], now: 1 });
  mod.map('L001', ['a/b.md'], 2);
  const lines = fs.readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse);
  delete lines[1].guess_seal;
  fs.writeFileSync(ledger, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
  assert.strictEqual(mod.laps()[0].integrity, 'UNSEALED');
  cleanup();
});

test('ORDERING: an excluded lap is counted nowhere in the report', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a/b.md'], now: 1 });
  mod.map('L001', ['x/y.md'], 2);
  const lines = fs.readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse);
  lines[0].guess = ['x/y.md'];
  fs.writeFileSync(ledger, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
  const out = [];
  const r = mod.report(0, s => out.push(s));
  assert.strictEqual(r.excluded, 1);
  assert.strictEqual(r.scored, 0, 'a tampered lap must not reach the metric');
  assert.match(out.join('\n'), /TAMPERED/);
  cleanup();
});

// ---------------------------------------------------------------- id minting

test('id: ids are minted max+1, so a hand-deleted row cannot have its id reused', () => {
  // Filling a gap would silently MERGE a new lap with the remains of a dead one - a guess from one
  // inquiry scored against the map of another.
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'a', guess: ['a.md'], now: 1 });
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'b', guess: ['b.md'], now: 2 });
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'c', guess: ['c.md'], now: 3 });
  const kept = fs.readFileSync(ledger, 'utf8').trim().split('\n').filter(l => !l.includes('"L002"'));
  fs.writeFileSync(ledger, kept.join('\n') + '\n');
  assert.strictEqual(mod.mintId(mod.rows()), 'L004', 'must not re-mint the deleted L002');
  cleanup();
});

test('id: two open rows on one id are classified DOUBLE-OPEN and excluded from the metric', () => {
  // HONEST BOUND, stated because the alternative is a test that looks like it covers more than it
  // does: the post-write `id collision` THROW in open() is reachable only under genuine
  // concurrency - two writers reading the same ledger before either appends - and this suite does
  // not produce that race. What is asserted here is the consequence the throw points at, which is
  // the part that governs the number. The throw itself is UNCOVERED and is named as such in the
  // hand-back.
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'first', guess: ['a.md'], now: 1 });
  fs.appendFileSync(ledger, JSON.stringify({ lap: 'L001', stage: 'open', at: 1, initiator: 'pane', inquiry: 'other', guess: ['z.md'] }) + '\n');
  const l = mod.laps().find(x => x.lap === 'L001');
  assert.strictEqual(l.integrity, 'DOUBLE-OPEN');
  const out = [];
  const r = mod.report(0, s => out.push(s));
  assert.strictEqual(r.scored, 0, 'a lap with two priors must not reach the metric');
  cleanup();
});

// ---------------------------------------------------------------- required fields

test('required: a missing guess is refused rather than scored as a perfect non-overlap', () => {
  // A forgotten flag would otherwise read as "the orchestrator held no context".
  const { mod, cleanup } = fixture();
  assert.throws(() => mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: [], now: 1 }), /--guess is required/);
  cleanup();
});

test('required: "none" is an accepted guess and records an empty prior explicitly', () => {
  const { mod, cleanup } = fixture();
  const r = mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['none'], now: 1 });
  assert.deepStrictEqual(r.guess, []);
  cleanup();
});

test('required: an unknown initiator is refused - falsifier 2 reads this field', () => {
  const { mod, cleanup } = fixture();
  assert.throws(() => mod.open({ initiator: 'keeper', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 }), /--initiator must be one of/);
  cleanup();
});

test('required: opened before a map exists is refused', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  assert.throws(() => mod.opened('L001', ['a.md'], 2), /has no map yet/);
  cleanup();
});

test('required: "opened none" is recordable - the falsifier firing must be writable', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  mod.map('L001', ['b.md'], 2);
  const r = mod.opened('L001', ['none'], 3);
  assert.deepStrictEqual(r.paths, []);
  cleanup();
});

// ---------------------------------------------------------------- the metric

test('metric: BOTH, map-only and opened-from-map are computed per lap', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'orch', inquiry: 'q', guess: ['a.md', 'b.md'], blind: true, now: 1 });
  mod.map('L001', ['b.md', 'c.md:12'], 2);
  mod.opened('L001', ['c.md'], 3);
  const l = mod.laps()[0];
  assert.deepStrictEqual(l.both, ['b.md']);
  assert.deepStrictEqual(l.mapOnly, ['c.md']);
  assert.deepStrictEqual(l.openedFromMap, ['c.md']);
  assert.deepStrictEqual(l.openedFromMapOnly, ['c.md'], 'a path the guess never named is where the corpus reached the work');
  cleanup();
});

test('metric: a broad guess is excluded from the intersection, not counted as a hit', () => {
  // Counting it either way is the Goodhart. Excluding it makes the attempt visible - guessed
  // narrow drops to 0 - instead of rewarding it.
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['exo_memory/'], now: 1 });
  mod.map('L001', ['exo_memory/BOOT.md'], 2);
  const l = mod.laps()[0];
  assert.strictEqual(l.guessBroad.length, 1);
  assert.strictEqual(l.guessNarrow.length, 0);
  assert.deepStrictEqual(l.both, [], 'a directory guess must not intersect the file under it');
  cleanup();
});

test('metric: no ratio is printed below the floor - a rate needs an n', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  mod.map('L001', ['a.md'], 2);
  const out = [];
  mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /below the floor of 5/);
  assert.doesNotMatch(text, /share of the guess the map confirmed\s+\d/);
  cleanup();
});

test('metric: the redundancy reading is refused on laps that were not blind', () => {
  const { mod, cleanup } = fixture();
  for (let i = 1; i <= 5; i++) {
    mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
    mod.map('L00' + i, ['a' + i + '.md'], i * 10 + 1);
  }
  const out = [];
  mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /ALWAYS EQUAL/);
  assert.match(text, /redundancy reading is REFUSED/, 'a map that saw the guess cannot corroborate it');
  cleanup();
});

// ---------------------------------------------------------------- the falsifiers

test('falsifier 1: reports a running count while the window is not full, never an answer', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  mod.map('L001', ['b.md'], 2);
  mod.opened('L001', ['b.md'], 3);
  const out = [];
  mod.report(0, s => out.push(s));
  assert.match(out.join('\n'), /1 of 1 so far.*not full/s);
  cleanup();
});

test("falsifier: this tool's own fires at ten laps with no opened stage", () => {
  const { mod, cleanup } = fixture();
  for (let i = 1; i <= 10; i++) {
    mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
    mod.map('L0' + String(i).padStart(2, '0'), ['b' + i + '.md'], i * 10 + 1);
  }
  const out = [];
  mod.report(0, s => out.push(s));
  assert.match(out.join('\n'), /FIRES\. 10 laps, 0 with an opened stage/);
  cleanup();
});

test("falsifier: this tool's own does NOT fire once an opened stage exists", () => {
  const { mod, cleanup } = fixture();
  for (let i = 1; i <= 10; i++) {
    mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
    mod.map('L0' + String(i).padStart(2, '0'), ['b' + i + '.md'], i * 10 + 1);
  }
  mod.opened('L001', ['b1.md'], 999);
  const out = [];
  mod.report(0, s => out.push(s));
  assert.doesNotMatch(out.join('\n'), /FIRES\. 10 laps/);
  cleanup();
});

test('falsifier 2: the keeper share needs both the initiator and a commit count, and names both', () => {
  const { mod, cleanup } = fixture();
  for (let i = 1; i <= 6; i++) {
    mod.open({ initiator: i <= 4 ? 'human' : 'chair', entry: 'orch', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
    mod.map('L00' + i, ['a' + i + '.md'], i * 10 + 1);
  }
  const out = [];
  mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /keeper-initiated 4 of 6 laps = 66\.7%/);
  assert.match(text, /chair commits since the first row/);
  assert.match(text, /window still open/);
  cleanup();
});

// ---------------------------------------------------------------- the limits are printed

test('report: prints what it cannot distinguish, beside the number rather than in a header', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  const out = [];
  mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /WHAT THIS CANNOT DISTINGUISH/);
  assert.match(text, /a good prior from a guess written to score/);
  assert.match(text, /agreement from anchoring/);
  assert.match(text, /self-reported by a participant/);
  cleanup();
});

test('report: an empty ledger says so plainly instead of printing zeroes as findings', () => {
  const { mod, cleanup } = fixture();
  const out = [];
  const r = mod.report(0, s => out.push(s));
  assert.strictEqual(r.laps, 0);
  assert.match(out.join('\n'), /The ledger is empty/);
  assert.doesNotMatch(out.join('\n'), /0\.0%/);
  cleanup();
});

// ---------------------------------------------------------------- cli

test('cli: the three writes and the report round-trip', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-cli-'));
  const ledger = path.join(dir, 'lap.jsonl');
  assert.strictEqual(cli(['--open', '--initiator', 'human', '--entry', 'orch', '--inquiry', 'q', '--guess', 'a.md,b.md', '--blind'], ledger).code, 0);
  assert.strictEqual(cli(['--map', 'L001', '--paths', 'b.md,c.md'], ledger).code, 0);
  assert.strictEqual(cli(['--opened', 'L001', '--paths', 'c.md'], ledger).code, 0);
  const r = cli(['--report'], ledger);
  assert.strictEqual(r.code, 0);
  assert.match(r.stdout, /L001/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('cli: a refusal exits non-zero and writes nothing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-cli2-'));
  const ledger = path.join(dir, 'lap.jsonl');
  cli(['--open', '--initiator', 'chair', '--entry', 'orch', '--inquiry', 'q', '--guess', 'a.md'], ledger);
  cli(['--map', 'L001', '--paths', 'a.md'], ledger);
  const before = fs.readFileSync(ledger, 'utf8');
  const r = cli(['--map', 'L001', '--paths', 'z.md'], ledger);
  assert.strictEqual(r.code, 2);
  assert.strictEqual(fs.readFileSync(ledger, 'utf8'), before, 'a refused write must leave the ledger byte-identical');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('cli: no verb prints usage and exits 2', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-cli3-'));
  const r = cli([], path.join(dir, 'lap.jsonl'));
  assert.strictEqual(r.code, 2);
  assert.match(r.stderr, /usage:/);
  fs.rmSync(dir, { recursive: true, force: true });
});

// ---------------------------------------------------------------- 2W-1: the mint site

// RULE 2W-1, registered in exo_memory/loop/two_writers_registration_2026-08-25.md and the only fix
// in that document aimed at a SILENT failure. This ledger is machine-local and ids mint as max+1
// locally, but the ids land in TRACKED prose. Two machines both minting L009 for different work
// merge CLEANLY because they write different files -- no conflict, no warning, and every falsifier
// keyed to that id is ambiguous forever after.
function cliTagged(args, ledger, tag) {
  try {
    return { code: 0, stdout: execFileSync(NODE, [TOOL, ...args], {
      encoding: 'utf8', env: { ...process.env, LAP_LEDGER: ledger, LAP_MACHINE_TAG: tag } }) };
  } catch (e) {
    return { code: e.status, stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

test('2W-1: two machines minting against their OWN ledgers do not produce the same id', () => {
  // The real scenario, and it is NOT two writers on one ledger: each machine has its own
  // machine-local lap.jsonl, so both are at the same count and both mint the same NUMBER. Only the
  // tag separates them. A test that shared one ledger would prove nothing, because the second mint
  // would see the first row and increment past it -- the collision would be hidden by the fixture.
  const dirA = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-2w1a-'));
  const dirB = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-2w1b-'));
  const ledA = path.join(dirA, 'lap.jsonl');
  const ledB = path.join(dirB, 'lap.jsonl');

  const a = cliTagged(['--open', '--initiator', 'chair', '--entry', 'orch', '--inquiry', 'q1', '--guess', 'a.md'], ledA, 'L');
  const b = cliTagged(['--open', '--initiator', 'chair', '--entry', 'orch', '--inquiry', 'q2', '--guess', 'b.md'], ledB, 'D');
  const idA = (a.stdout.match(/([A-Z][0-9][0-9][0-9])/) || [])[1];
  const idB = (b.stdout.match(/([A-Z][0-9][0-9][0-9])/) || [])[1];

  assert.ok(idA && idB, `both mints must print an id, got ${JSON.stringify([a.stdout, b.stdout])}`);
  assert.strictEqual(idA.slice(1), idB.slice(1), 'the NUMBER must match — that is the whole hazard');
  assert.notStrictEqual(idA, idB, 'the ids must differ, or the silent collision is live');

  fs.rmSync(dirA, { recursive: true, force: true });
  fs.rmSync(dirB, { recursive: true, force: true });
});

test('2W-1: an unconfigured machine does NOT fall back to a shared constant', () => {
  // THE DEFAULT IS THE SAFETY PROPERTY, so this must exercise the UNCONFIGURED path — and the
  // first version of this test did not. It computed its expectation from ~/.consonance.json, the
  // same file the tool reads, so it agreed with the tool by construction: with machine_tag=L set
  // here, a mutant hardcoding 'L' as the fallback passed cleanly. A test that consults the same
  // source as the thing it checks cannot disagree with it.
  //
  // Fixed by making the machine genuinely unconfigured: HOME and USERPROFILE point at an empty
  // temp dir, so fromConfig finds nothing and the derivation is the only path left.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-2w1c-'));
  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-nohome-'));
  const ledger = path.join(dir, 'lap.jsonl');
  const env = { ...process.env, LAP_LEDGER: ledger, HOME: fakeHome, USERPROFILE: fakeHome };
  delete env.LAP_MACHINE_TAG;
  const out = execFileSync(NODE, [TOOL, '--open', '--initiator', 'chair', '--entry', 'orch', '--inquiry', 'q', '--guess', 'a.md'],
    { encoding: 'utf8', env });
  const id = (out.match(/([A-Z][0-9][0-9][0-9])/) || [])[1];
  assert.ok(id, 'a mint with no config anywhere must still produce an id');

  // os.hostname() does not depend on HOME, so this is a real independent expectation rather than
  // a second reading of the tool's own input.
  const derived = (os.hostname().replace(/[^A-Za-z0-9]/g, '')[0] || 'X').toUpperCase();
  assert.strictEqual(id[0], derived,
    `with no config the prefix must derive from the HOSTNAME (${derived}), got ${id[0]}`);

  fs.rmSync(dir, { recursive: true, force: true });
  fs.rmSync(fakeHome, { recursive: true, force: true });
});

test('2W-1: max+1 still holds when the ledger carries MORE THAN ONE tag', () => {
  // The parse used to strip only /^L/. Left alone it would read a D-row as NaN, drop it from the
  // max, and re-mint an id that already exists -- reintroducing the exact gap-filling merge that
  // mintId's own comment forbids at length.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lap-2w1d-'));
  const ledger = path.join(dir, 'lap.jsonl');
  fs.writeFileSync(ledger,
    JSON.stringify({ lap: 'L001', stage: 'open', initiator: 'chair', inquiry: 'x', guess: ['a.md'], ts: 1 }) + '\n' +
    JSON.stringify({ lap: 'D007', stage: 'open', initiator: 'chair', inquiry: 'y', guess: ['b.md'], ts: 2 }) + '\n');
  const out = cliTagged(['--open', '--initiator', 'chair', '--entry', 'orch', '--inquiry', 'z', '--guess', 'c.md'], ledger, 'L').stdout;
  const id = (out.match(/([A-Z][0-9][0-9][0-9])/) || [])[1];
  assert.strictEqual(id, 'L008', `the foreign-tagged row must count toward the max, got ${id}`);

  fs.rmSync(dir, { recursive: true, force: true });
});

// ---------------------------------------------------------------- the void (2026-08-31, L020 packet C-2)
//
// THE EVENT. The chair found L017's and L020's map rows were chair-authored, appended correction
// NOTES, and the report kept printing BOTH=3 for both: it subtracts stages, not notes. With no
// void stage the chair wrote L017's note through `--stage dispatched`, which REOPENED a FILED lap.
// These tests are built from that: a void must leave every guess/map total, must stay visible,
// must not touch the chain, and — the bar that matters — removing the subtraction must bring the
// numbers back, or "they are gone" is an assertion rather than a measurement.

/** Six identical laps, above RATE_FLOOR: each guesses a,b and is mapped a,c -> per lap g=2 m=2 BOTH=1. */
function sixLaps(mod) {
  for (let i = 1; i <= 6; i++) {
    mod.open({ initiator: 'human', entry: 'orch', inquiry: 'q' + i, guess: ['a.md', 'b.md'], now: i * 10 });
    mod.map('L00' + i, ['a.md', 'c.md'], i * 10 + 5);
  }
}
function totals(text) {
  const m = /guessed \(narrow\) (\d+) · mapped (\d+) · in both (\d+)/.exec(text);
  return m ? m.slice(1).map(Number) : null;
}

test('void: a voided lap leaves every guess/map total, is PRINTED as void with its reason, and the lap count does not move', () => {
  const { mod, cleanup } = fixture();
  sixLaps(mod);
  let out = []; let r = mod.report(0, s => out.push(s));
  assert.deepStrictEqual(totals(out.join('\n')), [12, 12, 6], 'control: six laps of 2/2/1');
  assert.strictEqual(r.scored, 6);

  mod.voidLap('L003', 'map row chair-authored; one seat wrote both sides', 'pane-x', 100);
  out = []; r = mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.deepStrictEqual(totals(text), [10, 10, 5], 'exactly L003\'s 2/2/1 is gone and nothing else moved');
  assert.strictEqual(r.scored, 5);
  assert.strictEqual(r.voided, 1);
  assert.strictEqual(r.laps, 6, 'the lap still EXISTS - a number that quietly disappears is the same failure the other way');
  assert.match(text, /^laps\s+6\s+\(6 with a map, 0 with an opened stage, 1 VOID\)/m, 'the header says how many are void');
  assert.match(text, /^VOID\s+1\s+measurement withdrawn/m, 'a VOID section exists');
  assert.match(text, /L003  by pane-x: map row chair-authored; one seat wrote both sides/, 'reason and seat are printed, not just the id');
  assert.match(text, /^  L003 .*VOID/m, 'the lap is in the table, marked, in its place');
  assert.doesNotMatch(text, /^  L003 .*\b2\s+0\s+2\s+1\b/m, 'and its numbers are not printed as if measured');
  cleanup();
});

test('void: the chain is untouched - a FILED lap stays filed, where the chair\'s workaround through --stage reopened it', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  mod.map('L001', ['a.md'], 2);
  mod.chain('L001', 'filed', 'chair', 'done', 3);
  const chainRows = () => fs.readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.stage === 'chain');
  const before = chainRows();
  assert.strictEqual(before[before.length - 1].chain, 'filed');

  mod.voidLap('L001', 'withdrawn', 'pane-x', 4);
  const after = chainRows();
  assert.deepStrictEqual(after, before, 'not one chain row added, changed or removed: voiding a measurement is not reopening the work');
  assert.strictEqual(after[after.length - 1].chain, 'filed', 'chain-status reads the LAST chain row; it still reads filed');

  // THE CONTRAST, which is what actually happened on 2026-08-31 08:10 to L017: a void note written
  // through the chain vocabulary is a baton, and a baton reopens the lap.
  mod.chain('L001', 'dispatched', 'chair', 'VOID (written the wrong way)', 5);
  const wrong = chainRows();
  assert.strictEqual(wrong[wrong.length - 1].chain, 'dispatched', 'the workaround reopens a filed lap - the defect this stage exists to close');
  cleanup();
});

test('void: MUTATION - remove the subtraction and the voided numbers come back', () => {
  const { mod, ledger, dir, cleanup } = fixture();
  sixLaps(mod);
  mod.voidLap('L003', 'withdrawn', 'pane-x', 100);
  let out = []; mod.report(0, s => out.push(s));
  assert.deepStrictEqual(totals(out.join('\n')), [10, 10, 5], 'control: the shipped code subtracts');

  // One edit, the one the comment in report() names: `l.hasMap && !l.voided` -> `l.hasMap`.
  const src = fs.readFileSync(TOOL, 'utf8');
  const needle = 'const scored = valid.filter(l => l.hasMap && !l.voided);';
  assert.strictEqual(src.split(needle).length - 1, 1, 'the subtraction line must exist exactly once, or this mutation is not testing it');
  const mutant = path.join(dir, 'lap-row.mutant.js');
  fs.writeFileSync(mutant, src.replace(needle, 'const scored = valid.filter(l => l.hasMap);'));
  process.env.LAP_LEDGER = ledger;                 // the mutant binds to the same fixture ledger at load
  const M = require(mutant);
  out = []; const r = M.report(0, s => out.push(s));
  assert.deepStrictEqual(totals(out.join('\n')), [12, 12, 6], 'without the subtraction L003\'s 2/2/1 is back in every total');
  assert.strictEqual(r.scored, 6, 'and the voided lap is scored again - which is what the shipped line prevents');
  delete require.cache[require.resolve(mutant)];
  cleanup();
});

test('void: refusals write nothing - no reason, no seat, unknown lap, second void', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  mod.map('L001', ['a.md'], 2);
  const lines = () => fs.readFileSync(ledger, 'utf8').trim().split('\n').length;
  const n = lines();
  assert.throws(() => mod.voidLap('L001', '', 'pane-x', 3), /--reason is required/, 'a void with no reason is a number that disappeared');
  assert.throws(() => mod.voidLap('L001', 'r', '', 3), /--by is required/);
  assert.throws(() => mod.voidLap('L999', 'r', 'pane-x', 3), /no such lap/, 'a void cannot mint a lap');
  assert.strictEqual(lines(), n, 'refusals appended nothing');
  mod.voidLap('L001', 'r', 'pane-x', 3);
  assert.throws(() => mod.voidLap('L001', 'again', 'pane-x', 4), /already void/, 'one void is the whole effect');
  assert.strictEqual(lines(), n + 1);
  cleanup();
});

test('void: the cli verb round-trips and a refusal exits non-zero', () => {
  const { ledger, cleanup } = fixture();
  cli(['--open', '--initiator', 'human', '--entry', 'orch', '--inquiry', 'q', '--guess', 'a.md'], ledger);
  cli(['--map', 'L001', '--paths', 'a.md'], ledger);
  const bad = cli(['--void', 'L001', '--by', 'pane-x'], ledger);
  assert.strictEqual(bad.code, 2);
  assert.match(bad.stderr, /--reason is required/);
  const ok = cli(['--void', 'L001', '--reason', 'chair-authored map', '--by', 'pane-x'], ledger);
  assert.strictEqual(ok.code, 0, ok.stderr);
  assert.match(ok.stdout, /L001  VOID — measurement withdrawn by pane-x/);
  const rep = cli(['--report'], ledger).stdout;
  assert.match(rep, /VOID\s+1/);
  assert.match(rep, /L001  by pane-x: chair-authored map/);
  cleanup();
});

test('gap: the open->map gap is printed per lap, and maps written under the fresh-map floor are counted and named, never excluded', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'orch', inquiry: 'fast', guess: ['a.md'], now: 1000 });
  mod.map('L001', ['a.md'], 1100);                       // 0.1 s - one seat, one command
  mod.open({ initiator: 'human', entry: 'orch', inquiry: 'slow', guess: ['a.md'], now: 2000 });
  mod.map('L002', ['a.md'], 2000 + 199 * 1000);          // 199 s - L019's librarian round
  const out = []; const r = mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /^  L001 .*\?\s+0\.1\s+1\s+0\s+1\s+1/m, 'L001 shows a 0.1 s gap and is STILL SCORED');
  assert.match(text, /^  L002 .*\?\s+199\s+1\s+0\s+1\s+1/m, 'L002 shows 199 s');
  assert.match(text, new RegExp(`map row within ${mod.FRESH_MAP_FLOOR_S} s of the guess: 1 of 2 scored laps \\(L001\\)`), 'counted and named');
  assert.match(text, /the gap is a\n\s+signal, not a verdict/, 'and the line says it does not exclude');
  assert.strictEqual(r.scored, 2, 'a fast map is a signal; only --void, with a reason, removes a lap');
  cleanup();
});

// ---------------------------------------------------------------- the door (2026-09-02, two doors)
//
// THE ONE THING THIS SECTION IS FOR. Without `entry`, a lap that entered at the librarian (where no
// guess is possible until the ring rule fires) and a lap where the chair simply FAILED TO SEAL are
// the same row: guess column 0, nothing to tell them apart. The second should be visible and the
// first should not be reported as a failure - the chair mislabelled exactly that on 2026-09-02,
// writing "no guess was sealed before the map" when nothing had been skipped and the ask had simply
// entered by door two. A route is not a failure.

test('ENTRY: the door is required, and the refusal names the vocabulary', () => {
  // Required for the reason --guess is required: a legitimate state must be SAID rather than
  // arrived at by omitting a flag, or the field becomes decoration on its first busy night.
  const { mod, cleanup } = fixture();
  assert.throws(() => mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a.md'], now: 1 }),
    /--entry must be one of orch\|lib\|ring/);
  assert.throws(() => mod.open({ initiator: 'chair', entry: 'librarian', inquiry: 'q', guess: ['a.md'], now: 1 }),
    /--entry must be one of orch\|lib\|ring, got "librarian"/);
  cleanup();
});

test('ENTRY: the door is written to the open row and read back', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'lib', inquiry: 'q', guess: ['a.md'], now: 1 });
  assert.strictEqual(mod.rows()[0].entry, 'lib');
  assert.strictEqual(mod.laps()[0].entry, 'lib');
  cleanup();
});

test('ENTRY: a row written before the field reads as ABSENT, never as door one', () => {
  // The packet's own constraint: rows without the field are legitimately absent, not malformed.
  // Defaulting them to 'orch' would manufacture the very number the field exists to make honest.
  const { mod, ledger, cleanup } = fixture();
  fs.appendFileSync(ledger, JSON.stringify(
    { lap: 'L001', stage: 'open', at: 1, initiator: 'human', inquiry: 'old', guess: ['a.md'] }) + '\n');
  assert.strictEqual(mod.laps()[0].entry, null);
  const out = []; mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /door one \(orch\) 0 . door two \(lib\) 0 . ring, no user entry 0 . not recorded 1/);
  assert.match(text, /counted nowhere in this section rather than\n\s+assumed to be door one/);
  cleanup();
});

test('ENTRY: a garbage value on a historical row is absent too, not passed through to the report', () => {
  const { mod, ledger, cleanup } = fixture();
  fs.appendFileSync(ledger, JSON.stringify(
    { lap: 'L001', stage: 'open', at: 1, initiator: 'human', entry: 'sideways', inquiry: 'q', guess: ['a.md'] }) + '\n');
  assert.strictEqual(mod.laps()[0].entry, null, 'laps() gates on ENTRIES, so a hand-written value cannot invent a door');
  cleanup();
});

test('ENTRY: a direct entry with no guess is DISTINGUISHABLE from a chair that failed to seal', () => {
  // This assertion is the whole reason the field was added. Both laps below have an empty guess and
  // are identical in every column the ledger carried before today.
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'lib', inquiry: 'direct', guess: ['none'], now: 1 });
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'missed', guess: ['none'], now: 2 });
  const [a, b] = mod.laps();
  assert.deepStrictEqual([a.guess, b.guess], [[], []], 'identical on the guess column - that is the premise');
  assert.notStrictEqual(a.entry, b.entry, 'and separable only by the door');
  const out = []; mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /direct-entry laps with no guess: 1 of 1 \(L001\)/);
  assert.match(text, /no guess - direct entry/, 'the amendment asks for this row by name');
  assert.doesNotMatch(text, /\(L001, L002\)/, 'the door-one lap must NOT be absorbed into the direct-entry count');
  cleanup();
});

test('ENTRY: the ring rule falsifier fires on three consecutive direct entries with no guess', () => {
  // Registered in brief/BUILDING.md before the field existed; this is the instrument that reads it.
  const { mod, cleanup } = fixture();
  for (let i = 1; i <= mod.DIRECT_NO_GUESS_RUN; i++) {
    mod.open({ initiator: 'human', entry: 'lib', inquiry: 'q' + i, guess: ['none'], now: i * 10 });
  }
  const out = []; mod.report(0, s => out.push(s));
  assert.match(out.join('\n'), /longest such run: 3  -> FIRES/);
  cleanup();
});

test('ENTRY: a guess on a direct-entry lap breaks the run - the ring rule being KEPT must not fire it', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'lib', inquiry: 'a', guess: ['none'], now: 10 });
  mod.open({ initiator: 'human', entry: 'lib', inquiry: 'b', guess: ['x.md'], now: 20 });  // rung
  mod.open({ initiator: 'human', entry: 'lib', inquiry: 'c', guess: ['none'], now: 30 });
  const out = []; mod.report(0, s => out.push(s));
  assert.match(out.join('\n'), /longest such run: 1  -> does not fire/);
  cleanup();
});

test('ENTRY: a direct-entry map landing inside the fresh-map floor is named - the guess did not precede it', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'lib', inquiry: 'q', guess: ['a.md'], now: 1000 });
  mod.map('L001', ['a.md'], 1100);   // 0.1 s: the ring rule did not happen
  const out = []; mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /direct-entry laps whose map landed within 60 s of the guess: 1 of 1 \(L001\)/);
  assert.match(text, /the librarian carries the INQUIRY to the chair/);
  cleanup();
});

test('ENTRY: the report still runs, unchanged in its other figures, over rows with no door', () => {
  // Bar 2 of the packet, asserted rather than eyeballed: the field must not break the reader on
  // history. Every pre-field row is written raw here, the way the real ledger holds them.
  const { mod, ledger, cleanup } = fixture();
  for (let i = 1; i <= 6; i++) {
    fs.appendFileSync(ledger,
      JSON.stringify({ lap: 'L00' + i, stage: 'open', at: i * 1000, initiator: 'human', inquiry: 'q', guess: ['a' + i + '.md'] }) + '\n' +
      JSON.stringify({ lap: 'L00' + i, stage: 'map', at: i * 1000 + 200000, paths: ['a' + i + '.md'], guess_seal: mod.sealOf(['a' + i + '.md']) }) + '\n');
  }
  const out = []; const r = mod.report(0, s => out.push(s));
  assert.strictEqual(r.scored, 6, 'no historical lap is excluded by the new field');
  assert.match(out.join('\n'), /share of the guess the map confirmed   100\.0%/);
  cleanup();
});

test('ENTRY: the cli round-trips the door and says which one it recorded', () => {
  const { ledger, cleanup } = fixture();
  const a = cli(['--open', '--initiator', 'human', '--entry', 'lib', '--inquiry', 'q', '--guess', 'a.md'], ledger);
  assert.strictEqual(a.code, 0);
  assert.match(a.stdout, /door two \(straight to the librarian\)/);
  const b = cli(['--open', '--initiator', 'human', '--entry', 'orch', '--inquiry', 'q', '--guess', 'a.md'], ledger);
  assert.match(b.stdout, /door one \(the orchestrator\)/);
  const bad = cli(['--open', '--initiator', 'human', '--inquiry', 'q', '--guess', 'a.md'], ledger);
  assert.strictEqual(bad.code, 2, 'a missing door is a refusal, not a silent default');
  assert.match(bad.stderr, /--entry must be one of orch\|lib\|ring/);
  assert.match(cli([], ledger).stderr, /--entry <orch\|lib\|ring>/, 'the usage line carries it too');
  cleanup();
});

test('ENTRY: limit (e) is printed with the number - the seal does not cover the door', () => {
  // The limit is real and is named rather than defended: widening guess_seal to cover `entry` would
  // recompute every historical seal and file the whole existing ledger as TAMPERED.
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', entry: 'lib', inquiry: 'q', guess: ['a.md'], now: 1 });
  const out = []; mod.report(0, s => out.push(s));
  assert.match(out.join('\n'), /e\. an ENTRY field edited after the fact/);
  cleanup();
});

// ---------------------------------------------------------------- THE RING LAP (2026-09-02, L033)
//
// THE DEFECT THESE COVER was hit live by the chair while recording L033, not imagined here. Both
// existing `--entry` values are DOORS - where the USER's inquiry came in - and the keeper's second
// amendment of the same day says the ring repeats on its own and the user is the ENTRY, not a
// station. L033 had no user inquiry at any point: the librarian measured something itself, rang the
// chair, and the chair planned and dispatched. The chair wrote `--entry orch`, which asserts door
// one was used, and then put a note in the inquiry text saying the row was wrong.
//
// The packet's falsifier for this work: if the chair opens a ring lap after this and STILL has to
// explain the row in the --inquiry text, the shape is an entry shape with a new label. Every test
// below is aimed at that, not at the enum.

test('RING: a ring lap is openable and its door is not a lie', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'librarian', entry: 'ring', inquiry: 'the librarian found the harvester stalled', guess: ['a.md'], now: 1 });
  assert.strictEqual(mod.rows()[0].entry, 'ring');
  assert.strictEqual(mod.laps()[0].entry, 'ring', 'laps() gates on ENTRIES; a value it does not know reads as absent');
  const out = []; mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /door one \(orch\) 0 . door two \(lib\) 0 . ring, no user entry 1 . not recorded 0/,
    'a ring lap must land in neither door AND not in "not recorded" - both would be the row lying');
  assert.match(text, /ring laps: 1 - no user inquiry entered/);
  cleanup();
});

test('RING: a ring lap with no guess reads INAPPLICABLE, never a missed seal', () => {
  // The done-vs-never-started distinction, which is the part the packet said to get right. These
  // two laps are byte-identical on every column the ledger carried before the door field existed.
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'librarian', entry: 'ring', inquiry: 'ring', guess: ['none'], now: 1 });
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'missed', guess: ['none'], now: 2 });
  const [a, b] = mod.laps();
  assert.deepStrictEqual([a.guess, b.guess], [[], []], 'identical on the guess column - that is the premise');
  const out = []; mod.report(0, s => out.push(s));
  const text = out.join('\n');
  assert.match(text, /ring laps with no guess: 1 of 1 \(L001\)/);
  assert.match(text, /INAPPLICABLE, never zero/);
  assert.doesNotMatch(text, /\(L001, L002\)/, 'the door-one lap must not be absorbed into the ring count');
  cleanup();
});

test('RING: a ring lap MAY carry a real prior - the writer does not force it absent', () => {
  // The chair's guess for this packet was to record the guess as ABSENT on a ring lap. Refused:
  // L033 carried four line-numbered paths and they were a genuine prior. A writer that forced
  // absent would delete a measurement that existed. The inapplicable reading is the READER's job.
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'librarian', entry: 'ring', inquiry: 'q', guess: ['consonance/ui/chain-indicator.js:294', 'consonance/src-tauri/src/main.rs:3006'], now: 1000 });
  mod.map('L001', ['consonance/ui/chain-indicator.js', 'x/y.md'], 300000);
  const l = mod.laps()[0];
  assert.strictEqual(l.guessNarrow.length, 2, 'a ring lap prior is kept, not zeroed');
  assert.strictEqual(l.both.length, 1, 'and it still scores against the map');
  const out = []; mod.report(0, s => out.push(s));
  assert.match(out.join('\n'), /ring laps with no guess: 0 of 1/, 'a ring lap WITH a prior is not reported as having none');
  cleanup();
});

test('RING: neither door-two falsifier can see a difference - asserted, not claimed', () => {
  // The packet asked for this impact to be stated explicitly. It is stated by RUNNING it: the same
  // ledger, once with the interleaved lap as `orch` and once as `ring`, must produce an identical
  // direct-entry run and an identical door-two membership line. If a ring lap ever RESET the
  // direct-entry run, this goes red.
  const build = door => {
    const { mod, cleanup } = fixture();
    mod.open({ initiator: 'human', entry: 'lib', inquiry: 'a', guess: ['none'], now: 10 });
    mod.open({ initiator: 'librarian', entry: door, inquiry: 'interleaved', guess: ['none'], now: 20 });
    mod.open({ initiator: 'human', entry: 'lib', inquiry: 'b', guess: ['none'], now: 30 });
    mod.open({ initiator: 'human', entry: 'lib', inquiry: 'c', guess: ['none'], now: 40 });
    const out = []; mod.report(0, s => out.push(s));
    cleanup();
    return out.join('\n');
  };
  const asOrch = build('orch'), asRing = build('ring');
  const run = t => t.match(/longest such run: \d+[^\n]*/)[0];
  const direct = t => t.match(/direct-entry laps with no guess: [^\n]*/)[0];
  assert.strictEqual(run(asRing), run(asOrch), 'a ring lap must neither advance nor RESET the direct-entry run');
  assert.match(run(asRing), /longest such run: 3 {2}-> FIRES/, 'and the falsifier must still be able to fire through one');
  assert.strictEqual(direct(asRing), direct(asOrch), 'door two membership is untouched by the third value');
});

test('RING: the new hole the third value opened is PRINTED with the number', () => {
  // A ring lap can now be used to excuse a missing guess, and the seal does not cover the door.
  // Named beside the figure rather than defended, which is this report's standing rule.
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'librarian', entry: 'ring', inquiry: 'q', guess: ['a.md'], now: 1 });
  const out = []; mod.report(0, s => out.push(s));
  assert.match(out.join('\n'), /so does one relabelled ring, which is\n\s+a NEW hole/);
  cleanup();
});

test('RING: the refusal teaches the third value, and the cli says which one it wrote', () => {
  const { ledger, cleanup } = fixture();
  const r = cli(['--open', '--initiator', 'librarian', '--entry', 'ring', '--inquiry', 'q', '--guess', 'none'], ledger);
  assert.strictEqual(r.code, 0);
  assert.match(r.stdout, /the ring \(no user entry - the loop supplied this lap\)/);
  const bad = cli(['--open', '--initiator', 'librarian', '--entry', 'loop', '--inquiry', 'q', '--guess', 'none'], ledger);
  assert.strictEqual(bad.code, 2);
  assert.match(bad.stderr, /ring = no user inquiry entered at all/,
    'a refusal that does not say what ring MEANS gets worked around by guessing');
  cleanup();
});

// ---------------------------------------------------------------- THE LIBRARIAN AS INITIATOR
//
// `--entry lib` existed and `--initiator librarian` did not, so a door-two or ring lap could record
// the DOOR and not the SEAT. The chair hit it live on L033 and wrote `chair` with a note admitting
// the value was wrong.

test('INITIATOR: librarian is a seat this ledger can name', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'librarian', entry: 'ring', inquiry: 'q', guess: ['a.md'], now: 1 });
  assert.strictEqual(mod.laps()[0].initiator, 'librarian');
  cleanup();
});

test('INITIATOR: librarian is NOT pane, and the DOOR word is not the SEAT word', () => {
  const { mod, cleanup } = fixture();
  assert.ok(mod.INITIATORS.has('librarian') && mod.INITIATORS.has('pane'));
  assert.throws(() => mod.open({ initiator: 'lib', entry: 'ring', inquiry: 'q', guess: ['a.md'], now: 1 }),
    /--initiator must be one of/, 'the door word must not be accepted as a seat');
  cleanup();
});

test('INITIATOR: falsifier 2 does not move when a mislabelled chair lap becomes a librarian lap', () => {
  // The impact statement, run rather than asserted in prose. Falsifier 2 counts human laps over all
  // valid laps; laps the librarian started were already being opened AS chair, so neither side of
  // the ratio changes. If a later edit routes librarian laps out of `valid`, this goes red.
  const build = init => {
    const { mod, cleanup } = fixture();
    mod.open({ initiator: 'human', entry: 'orch', inquiry: 'a', guess: ['a.md'], now: 10 });
    mod.open({ initiator: init, entry: 'ring', inquiry: 'b', guess: ['b.md'], now: 20 });
    const out = []; mod.report(0, s => out.push(s));
    cleanup();
    return out.join('\n').match(/keeper-initiated [^\n]*/)[0];
  };
  assert.strictEqual(build('librarian'), build('chair'));
});

// ---------------------------------------------------------------- THE HOLDER IS A STATION
//
// Owed since the aura packet and unowned until now. Between 09-01 12:25 and 09-02 four `dispatched`
// rows were written with a PANE NAME in --holder (charlie, bravo, bravo, echo). Both readers key on
// the station vocabulary, so those laps went INVISIBLE rather than wrong-looking: no arrow at
// chain-indicator's holderArrow, skipped at chain-status.js:721 and :804. The repair that was
// actually made taught a READER to skip non-station holders. This is the other one: refuse at the
// write and keep the readers narrow, which is what the aura packet asked for in the first place.

test('HOLDER: a pane name is REFUSED, and the refusal says where the pane goes instead', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  const before = fs.readFileSync(ledger, 'utf8');
  for (const name of ['echo', 'charlie', 'bravo', 'E', 'pane-a']) {
    assert.throws(() => mod.chain('L001', 'dispatched', name, null, 2),
      /holder is a station; name the panes in --to/, name + ' was accepted as a station');
  }
  assert.strictEqual(fs.readFileSync(ledger, 'utf8'), before, 'a refused write must leave the ledger byte-identical');
  cleanup();
});

test('HOLDER: the four ruled stations are accepted and nothing else is', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  assert.deepStrictEqual([...mod.STATIONS], ['chair', 'panes', 'librarian', 'none']);
  let t = 10;
  for (const s of mod.STATIONS) assert.ok(mod.chain('L001', 'dispatched', s, null, t++));
  // `keeper` is deliberately absent: it has never been written to the live ledger and appears only
  // in chain-status.test.js fixtures, which are raw rows this writer never sees.
  assert.throws(() => mod.chain('L001', 'filed', 'keeper', null, t++), /holder is a station/);
  cleanup();
});

test('HOLDER: --to carries the pane list the gate refused to overload onto the baton', () => {
  // The gate would be LOSSY without this - "echo" would simply be deleted - and a fix that deletes
  // information is how the next drift starts.
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'ring', inquiry: 'q', guess: ['a.md'], now: 1 });
  const r = mod.chain('L001', 'dispatched', 'panes', null, 2, 'a, b ,C,E');
  assert.deepStrictEqual(r.to, ['A', 'B', 'C', 'E'], 'four panes, which one holder word could never have named');
  assert.strictEqual(mod.chain('L001', 'working', 'panes', null, 3).to, null, '--to is optional and absent is null, not []');
  cleanup();
});

test('HOLDER: --to is validated, not a free-text field one column over', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'ring', inquiry: 'q', guess: ['a.md'], now: 1 });
  assert.throws(() => mod.chain('L001', 'dispatched', 'panes', null, 2, 'echo'), /--to names panes by LETTER/);
  assert.throws(() => mod.chain('L001', 'dispatched', 'chair', null, 2, 'A,B'),
    /--to names the panes the baton went to, so it goes with --holder panes/);
  cleanup();
});

test('HOLDER: the station gate is the LAST refusal - an unknown lap still says "no such lap"', () => {
  // ORDERING, and it is load-bearing for a suite this file does not own. chain-status.test.js
  // proves the chain cannot MINT a lap with `--stage L999 working --holder pane-a`, asserting the
  // message is `no such lap`. Hoist the station gate above the existence check and that test goes
  // red on a holder message while its minting assertion silently stops testing minting.
  const { mod, cleanup } = fixture();
  assert.throws(() => mod.chain('L999', 'working', 'pane-a', null, 1), /no such lap/);
  cleanup();
});

test('HOLDER: APPEND-ONLY - the four drifted rows stay readable and are not edited by the gate', () => {
  // Bar 3 of the packet. The gate is a WRITE-side refusal and touches no history: a ledger already
  // carrying `holder: "echo"` must still fold, still report, and still hold that row verbatim.
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', entry: 'orch', inquiry: 'q', guess: ['a.md'], now: 1 });
  for (const h of ['charlie', 'bravo', 'bravo', 'echo']) {
    fs.appendFileSync(ledger, JSON.stringify({ lap: 'L001', stage: 'chain', at: 2, chain: 'dispatched', holder: h }) + '\n');
  }
  const drifted = mod.rows().filter(r => r.stage === 'chain').map(r => r.holder);
  assert.deepStrictEqual(drifted, ['charlie', 'bravo', 'bravo', 'echo'], 'history is read back verbatim');
  const out = []; assert.ok(mod.report(0, s => out.push(s)), '--report must still run over a ledger holding both shapes');
  cleanup();
});

test('HOLDER: the usage names the station vocabulary and the pane list', () => {
  const { ledger, cleanup } = fixture();
  const u = cli([], ledger).stderr;
  assert.match(u, /holder: chair \| panes \| librarian \| none {3}a STATION, never a pane name/);
  assert.match(u, /--to A,B,C,E/);
  cleanup();
});

// ---------------------------------------------------------------- the carrier
//
// THE DIAGRAM IS THE CARRIER, and this is its only oracle. The 2026-08-17 retirement edited every
// downstream document, missed the drawing, and the room taught a retired metaphor for five weeks.
// The prose of brief/BUILDING.md can be edited by anyone; nothing but this test notices if the
// SECOND ARROW leaves the picture.
//
// Filed here rather than in a brief-carrier test file of its own because the ledger's `entry` field
// and the diagram's second door are one rule with two halves, and this file owns the other half.
// If the librarian would rather it lived beside the brief, it moves as a block.

test('carrier: BUILDING.md draws BOTH doors and the ring, not just the prose about them', () => {
  const brief = path.join(__dirname, '..', 'src-tauri', 'brief', 'BUILDING.md');
  const src = fs.readFileSync(brief, 'utf8');
  const diagram = src.slice(src.indexOf('## THE LOOP'));
  const drawing = diagram.slice(diagram.indexOf('```') + 3, diagram.indexOf('```', diagram.indexOf('```') + 3));

  assert.match(drawing, /door one/, 'the drawing must name door one');
  assert.match(drawing, /door two/, 'the drawing must name door two - you -> LIBRARIAN, the keeper 2026-09-02');
  assert.match(drawing, /\u251c\u2500+\u2510/, 'and DRAW the branch, not only label it');
  assert.match(drawing, /THE RING/, 'the cycle repeats on its own: orch -> panes -> lib -> orch');
  assert.match(drawing, /ENTRY, not a station/, 'the user is the entry, not a station the loop returns to');
});

/** The master drawing, from BUILDING.md. Every copy below is compared against this and nothing else. */
function loopDiagramMaster() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src-tauri', 'brief', 'BUILDING.md'), 'utf8');
  const a = src.indexOf('```', src.indexOf('## THE LOOP')) + 3;
  return src.slice(a, src.indexOf('```', a)).trim();
}

test('carrier: the COMMITTEE.md copy of the diagram has not drifted from its master', () => {
  // COMMITTEE.md quotes this drawing and is the brief a PANE reads first. A quoted copy of a master
  // that changed is the failure this whole section is named for, one file over.
  const src = fs.readFileSync(path.join(__dirname, '..', 'src-tauri', 'brief', 'COMMITTEE.md'), 'utf8');
  const a = src.indexOf('```', src.indexOf('## The loop, in one card')) + 3;
  assert.strictEqual(src.slice(a, src.indexOf('```', a)).trim(), loopDiagramMaster(),
    'COMMITTEE.md holds a stale copy of the loop diagram. It is quoted from BUILDING.md, the master; ' +
    're-copy it rather than editing it in place.');
});

test('carrier: the About tab copy of the diagram has not drifted from its master either', () => {
  // THE THIRD COPY, found by the C -> A crosswise read on 2026-09-02. A's About prints the drawing
  // and says it is "extracted from that file rather than redrawn here, so this page cannot drift
  // against it". It is a STATIC PASTE in index.html: nothing extracts it at build or at runtime, so
  // the sentence is a claim about the file, not a property of it — exactly what COMMITTEE.md's own
  // "quoted from the master" line was before this suite started checking it.
  //
  // It is byte-identical today. This test is what keeps that true. It READS index.html and never
  // writes it; the file's owner is whoever holds the ui this lap.
  const html = fs.readFileSync(path.join(__dirname, '..', 'ui', 'index.html'), 'utf8');
  const pres = (html.match(/<pre[^>]*>[\s\S]*?<\/pre>/g) || [])
    .map(b => b.replace(/<[^>]*>/g, '')
               .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
               .trim())
    .filter(b => b.includes('ORCHESTRATOR') && b.includes('LIBRARIAN'));
  assert.strictEqual(pres.length, 1,
    'expected exactly one <pre> in index.html holding the loop diagram; found ' + pres.length +
    '. If the About stopped printing it, delete this test with the paste — do not leave it asserting nothing.');
  assert.strictEqual(pres[0], loopDiagramMaster(),
    'the About tab holds a stale copy of the loop diagram. BUILDING.md is the master; re-paste from ' +
    'it rather than editing index.html in place.');
});

test('carrier: every document that quotes the --entry vocabulary lists what the writer accepts', () => {
  /* SHIPPED RED ON 2026-09-02, DELIBERATELY, AND IT IS THE POINT OF THIS TEST.
   *
   * `brief/BUILDING.md:391` says `--entry orch|lib`. This lap added a third value, so that sentence
   * is now stale — a document describing an instrument that has moved. BUILDING.md is UNOWNED this
   * lap (A holds main.rs, E holds chain-indicator.js, B holds corpus-age.*), so pane C did not edit
   * it. The one-line replacement is named in the assertion message below and in the hand-back
   * `exo_memory/handback/p-lap-row_2026-09-02.md`; this goes green the moment it lands.
   *
   * WHY A RED TEST RATHER THAN A LINE IN A HAND-BACK. C's own finding on the previous lap (M13):
   * the entire door-two prose was deletable with the suite green, because the DRAWING was guarded
   * and the RULE was not. A hand-back is read once. This is the 2026-08-17 lesson exactly — the
   * documents moved and the carrier did not — and the only difference between that five-week drift
   * and this one is whether something notices.
   *
   * IT SCANS THREE SURFACES, not the one that carries the sentence today, for the reason C's C.md
   * entry gives: the number of copies grows with how good the original is, and every copy arrives
   * wearing a sentence about why it cannot drift. A fourth carrier is caught the moment it appears
   * rather than after someone thinks to look. */
  const want = [...require('./lap-row.js').ENTRIES].join('|');
  const surfaces = [
    ['brief/BUILDING.md', path.join(__dirname, '..', 'src-tauri', 'brief', 'BUILDING.md')],
    ['brief/COMMITTEE.md', path.join(__dirname, '..', 'src-tauri', 'brief', 'COMMITTEE.md')],
    ['ui/index.html', path.join(__dirname, '..', 'ui', 'index.html')],
  ];
  const found = [];
  for (const [label, file] of surfaces) {
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(/--entry[ `]*([a-z]+(?:\|[a-z]+)+)/g)) {
      found.push({ label, line: src.slice(0, m.index).split('\n').length, said: m[1] });
    }
  }
  assert.ok(found.length, 'no document quotes the --entry vocabulary at all - the rule has no carrier, ' +
    'which is worse than a stale one. If the sentence was deliberately removed, delete this test with it.');
  const stale = found.filter(f => f.said !== want);
  assert.deepStrictEqual(stale, [],
    'a document quotes an --entry vocabulary the writer no longer accepts. Replace `--entry ' +
    (stale[0] ? stale[0].said : '?') + '` with `--entry ' + want + '` at ' +
    stale.map(f => f.label + ':' + f.line).join(', ') + '. The writer is the master; the prose is the copy.');
});
