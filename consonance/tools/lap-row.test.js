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
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a/b.md'], now: 1 });
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
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a/b.md'], now: 1 });
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
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a/b.md'], now: 100 });
  mod.map('L001', ['a/b.md'], 200);
  const lines = fs.readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse);
  lines[1].at = 50;
  fs.writeFileSync(ledger, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
  assert.strictEqual(mod.laps()[0].integrity, 'OUT-OF-ORDER');
  cleanup();
});

test('ORDERING: a map with no seal at all is UNSEALED, never a pass', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a/b.md'], now: 1 });
  mod.map('L001', ['a/b.md'], 2);
  const lines = fs.readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse);
  delete lines[1].guess_seal;
  fs.writeFileSync(ledger, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
  assert.strictEqual(mod.laps()[0].integrity, 'UNSEALED');
  cleanup();
});

test('ORDERING: an excluded lap is counted nowhere in the report', () => {
  const { mod, ledger, cleanup } = fixture();
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a/b.md'], now: 1 });
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
  mod.open({ initiator: 'chair', inquiry: 'a', guess: ['a.md'], now: 1 });
  mod.open({ initiator: 'chair', inquiry: 'b', guess: ['b.md'], now: 2 });
  mod.open({ initiator: 'chair', inquiry: 'c', guess: ['c.md'], now: 3 });
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
  mod.open({ initiator: 'chair', inquiry: 'first', guess: ['a.md'], now: 1 });
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
  assert.throws(() => mod.open({ initiator: 'chair', inquiry: 'q', guess: [], now: 1 }), /--guess is required/);
  cleanup();
});

test('required: "none" is an accepted guess and records an empty prior explicitly', () => {
  const { mod, cleanup } = fixture();
  const r = mod.open({ initiator: 'chair', inquiry: 'q', guess: ['none'], now: 1 });
  assert.deepStrictEqual(r.guess, []);
  cleanup();
});

test('required: an unknown initiator is refused - falsifier 2 reads this field', () => {
  const { mod, cleanup } = fixture();
  assert.throws(() => mod.open({ initiator: 'keeper', inquiry: 'q', guess: ['a.md'], now: 1 }), /--initiator must be one of/);
  cleanup();
});

test('required: opened before a map exists is refused', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a.md'], now: 1 });
  assert.throws(() => mod.opened('L001', ['a.md'], 2), /has no map yet/);
  cleanup();
});

test('required: "opened none" is recordable - the falsifier firing must be writable', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a.md'], now: 1 });
  mod.map('L001', ['b.md'], 2);
  const r = mod.opened('L001', ['none'], 3);
  assert.deepStrictEqual(r.paths, []);
  cleanup();
});

// ---------------------------------------------------------------- the metric

test('metric: BOTH, map-only and opened-from-map are computed per lap', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'human', inquiry: 'q', guess: ['a.md', 'b.md'], blind: true, now: 1 });
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
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['exo_memory/'], now: 1 });
  mod.map('L001', ['exo_memory/BOOT.md'], 2);
  const l = mod.laps()[0];
  assert.strictEqual(l.guessBroad.length, 1);
  assert.strictEqual(l.guessNarrow.length, 0);
  assert.deepStrictEqual(l.both, [], 'a directory guess must not intersect the file under it');
  cleanup();
});

test('metric: no ratio is printed below the floor - a rate needs an n', () => {
  const { mod, cleanup } = fixture();
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a.md'], now: 1 });
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
    mod.open({ initiator: 'chair', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
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
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a.md'], now: 1 });
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
    mod.open({ initiator: 'chair', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
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
    mod.open({ initiator: 'chair', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
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
    mod.open({ initiator: i <= 4 ? 'human' : 'chair', inquiry: 'q' + i, guess: ['a' + i + '.md'], now: i * 10 });
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
  mod.open({ initiator: 'chair', inquiry: 'q', guess: ['a.md'], now: 1 });
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
  assert.strictEqual(cli(['--open', '--initiator', 'human', '--inquiry', 'q', '--guess', 'a.md,b.md', '--blind'], ledger).code, 0);
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
  cli(['--open', '--initiator', 'chair', '--inquiry', 'q', '--guess', 'a.md'], ledger);
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

  const a = cliTagged(['--open', '--initiator', 'chair', '--inquiry', 'q1', '--guess', 'a.md'], ledA, 'L');
  const b = cliTagged(['--open', '--initiator', 'chair', '--inquiry', 'q2', '--guess', 'b.md'], ledB, 'D');
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
  const out = execFileSync(NODE, [TOOL, '--open', '--initiator', 'chair', '--inquiry', 'q', '--guess', 'a.md'],
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
  const out = cliTagged(['--open', '--initiator', 'chair', '--inquiry', 'z', '--guess', 'c.md'], ledger, 'L').stdout;
  const id = (out.match(/([A-Z][0-9][0-9][0-9])/) || [])[1];
  assert.strictEqual(id, 'L008', `the foreign-tagged row must count toward the max, got ${id}`);

  fs.rmSync(dir, { recursive: true, force: true });
});
