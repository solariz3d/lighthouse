// chain-status.test.js - the baton writer and the one-line reader.
// Run: node consonance/tools/chain-status.test.js
//
// EVERY ASSERTION HERE READS BEHAVIOUR, NEVER SOURCE. Two days ago a Rust test asserting the
// librarian brief says "No work." stayed GREEN after the keeper struck the phrase, because the
// sentence RETIRING it quotes it verbatim - a test satisfied by the CORRECTION of the claim it
// asserts. So nothing below greps a file for a word: each test drives the tool against a fixture
// ledger and reads what came out of it. The comments in chain-status.js quote every phrase these
// tests look for; if any assertion were a grep over the source it would pass on the comment alone.
//
// Fixtures live in a temp dir. Nothing touches C:\Consonance\data, the repo, or ~/.claude.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const READER = path.join(__dirname, 'chain-status.js');
const WRITER = path.join(__dirname, 'lap-row.js');
const NODE = process.execPath;

function fixture(rows) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'chain-'));
  const ledger = path.join(dir, 'lap.jsonl');
  if (rows) fs.writeFileSync(ledger, rows.map(r => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n') + '\n');
  return { dir, ledger, cleanup: () => fs.rmSync(dir, { recursive: true, force: true }) };
}
/** A lap that exists, so the chain writer has something to attach to. */
const OPEN_ROW = { lap: 'L007', stage: 'open', at: 1000, initiator: 'chair', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null };

/* spawnSync, not execFileSync: execFileSync only hands back stderr on a NON-ZERO exit, and this
 * tool's whole contract is that it stays quiet and exits 0. The first version of this helper
 * asserted on a channel it was not capturing and reported the tool broken when the harness was. */
function run(tool, args, ledger) {
  const r = spawnSync(NODE, [tool, ...args], {
    encoding: 'utf8', env: { ...process.env, LAP_LEDGER: ledger },
  });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}
const mod = () => { delete require.cache[require.resolve('./chain-status.js')]; return require('./chain-status.js'); };

// ---------------------------------------------------------------- reader: with and without

test('reader: with a ledger it prints one line naming lap, stage and holder', () => {
  const fx = fixture([OPEN_ROW,
    { lap: 'L007', stage: 'chain', at: 2000, chain: 'return-leg', holder: 'librarian' }]);
  const r = mod().line({ ledger: fx.ledger, now: 2000 + 11 * 60000, dirty: 4 });
  assert.ok(r.text, 'a ledger with an unfiled baton row must produce a line');
  assert.strictEqual(r.text.split('\n').length, 1, 'it is ONE line: ' + JSON.stringify(r.text));
  assert.match(r.text, /^chain: L007 RETURN-LEG/);
  assert.match(r.text, /holder librarian/);
  assert.match(r.text, /11m/);
  fx.cleanup();
});

test('reader: WITHOUT a ledger it prints nothing, writes no stderr, and exits 0', () => {
  // Called from the pulse on every prompt in every seat. A reader that can fail takes the pulse
  // with it, and a hook that errors every turn is uninstalled within a day.
  const fx = fixture(null);
  const r = run(READER, ['--ledger', fx.ledger], fx.ledger);
  assert.strictEqual(r.code, 0, 'absent ledger must exit 0, got ' + r.code + ' / ' + r.stderr);
  assert.strictEqual(r.stdout, '', 'absent ledger must print NOTHING, got ' + JSON.stringify(r.stdout));
  assert.strictEqual(r.stderr, '', 'and must not complain either');
  fx.cleanup();
});

test('reader: the silence is CHOSEN, not a swallowed crash - --why names the reason', () => {
  // Without this, "it printed nothing" and "it threw and something ate it" are the same
  // observation, which is the blindness this whole tool exists to end, one level down.
  const fx = fixture(null);
  const r = run(READER, ['--ledger', fx.ledger, '--why'], fx.ledger);
  assert.strictEqual(r.code, 0);
  assert.strictEqual(r.stdout, '', 'the reason goes to stderr; stdout stays clean for the pulse');
  assert.match(r.stderr, /silent/, 'the silence must be attributable: ' + JSON.stringify(r.stderr));
  assert.match(r.stderr, /no ledger/);
  fx.cleanup();
});

// ---------------------------------------------------------------- reader: the filed filter

test('THE BAR: a lap whose newest baton row is `filed` does NOT appear in the line', () => {
  const fx = fixture([OPEN_ROW,
    { lap: 'L007', stage: 'chain', at: 2000, chain: 'return-leg', holder: 'librarian' },
    { lap: 'L007', stage: 'chain', at: 3000, chain: 'filed', holder: 'keeper' }]);
  const r = mod().line({ ledger: fx.ledger, now: 4000, dirty: 0 });
  assert.strictEqual(r.text, null, 'a filed lap must be silent, got: ' + r.text);
  assert.match(r.why, /filed/, 'and the silence must say why: ' + r.why);
  fx.cleanup();
});

test('a filed lap is not resurrected by its own earlier row', () => {
  // Filtering `filed` out of the stream FIRST and then taking the newest of what remains would
  // report L007 RETURN-LEG forever, because that row can never stop being the newest non-filed
  // one. Newest-per-lap first, then filter. This test fails if the order is ever swapped.
  const fx = fixture([OPEN_ROW,
    { lap: 'L007', stage: 'chain', at: 2000, chain: 'dispatched', holder: 'panes' },
    { lap: 'L007', stage: 'chain', at: 2500, chain: 'return-leg', holder: 'librarian' },
    { lap: 'L007', stage: 'chain', at: 3000, chain: 'filed', holder: 'keeper' }]);
  const open = mod().openLaps(JSON.parse('[' + fs.readFileSync(fx.ledger, 'utf8').trim().split('\n').join(',') + ']'));
  assert.deepStrictEqual(open, [], 'the finished lap came back from an earlier row');
  fx.cleanup();
});

test('an unfiled lap alongside a filed one is the one reported, and the count is stated', () => {
  const fx = fixture([OPEN_ROW, { lap: 'L008', stage: 'open', at: 1001, initiator: 'chair', inquiry: 'y', guess: ['q.js'], head: null },
    { lap: 'L007', stage: 'chain', at: 3000, chain: 'filed', holder: 'keeper' },
    { lap: 'L008', stage: 'chain', at: 4000, chain: 'working', holder: 'pane-a' }]);
  const r = mod().line({ ledger: fx.ledger, now: 4000, dirty: 2 });
  assert.match(r.text, /^chain: L008 WORKING/);
  assert.doesNotMatch(r.text, /^chain: L007/, 'a finished lap must not be reported as the chain position: ' + r.text);
  // NARROWED 2026-08-29 BY THE WORK-LEG CLAUSE, recorded here rather than done quietly. The
  // original assertion was `!/L007/` - "must not appear ANYWHERE in the line" - which was
  // equivalent to the property above ONLY because a filed lap had no other reason to be named.
  // It has one now: this fixture's L007 carries a single `filed` row and no work-leg row, so it is
  // exactly the shape the new clause counts. The property the test protects is asserted above and
  // is STRICTER about position than the old form was. What is no longer asserted is that the id is
  // absent from the whole string - and that absence is the blindness the chair dispatched this to
  // end. So the id is pinned to ONE segment instead: if L007 leaks anywhere else, this still fails.
  const seg = r.text.split(' · ').filter(s => /L007/.test(s));
  assert.deepStrictEqual(seg, ['1 of 2 chained laps unwitnessed (L007)'],
    'L007 appeared outside the work-leg clause: ' + r.text);
  assert.ok(!/more open/.test(r.text), 'one open lap must not claim others: ' + r.text);
  fx.cleanup();
});

test('two unfiled laps: the newest leads and the line SAYS the others exist', () => {
  const fx = fixture([OPEN_ROW, { lap: 'L008', stage: 'open', at: 1001, initiator: 'chair', inquiry: 'y', guess: ['q.js'], head: null },
    { lap: 'L007', stage: 'chain', at: 3000, chain: 'return-leg', holder: 'librarian' },
    { lap: 'L008', stage: 'chain', at: 4000, chain: 'working', holder: 'pane-a' }]);
  const r = mod().line({ ledger: fx.ledger, now: 4000, dirty: 0 });
  assert.match(r.text, /^chain: L008 WORKING/);
  assert.match(r.text, /\+1 more open/, 'one line must not silently drop the other lap: ' + r.text);
  fx.cleanup();
});

// ---------------------------------------------------------------- reader: the universe

test('the line states what it cannot see: one machine, and a repo-wide dirty count', () => {
  // P-UNIVERSE clause 1. The test of a universe line is that a reader can name, from the line
  // alone, one specific thing the instrument cannot see. Here: the desktop's laps, and which seat
  // those dirty files belong to.
  const fx = fixture([OPEN_ROW, { lap: 'L007', stage: 'chain', at: 2000, chain: 'return-leg', holder: 'librarian' }]);
  const r = mod().line({ ledger: fx.ledger, now: 2000, dirty: 4 });
  assert.match(r.text, /this machine only/, 'cross-machine blindness must be stated, not merely true');
  assert.match(r.text, /dirty 4 repo-wide/, '"dirty 4" next to "holder librarian" reads as the librarian\'s four');
  fx.cleanup();
});

test('an unreadable git tree prints `dirty ?`, never `dirty 0`', () => {
  // An unreadable count reported as a clean tree is the false green this room keeps finding.
  const fx = fixture([OPEN_ROW, { lap: 'L007', stage: 'chain', at: 2000, chain: 'working', holder: 'pane-a' }]);
  const r = mod().line({ ledger: fx.ledger, now: 2000, dirty: null });
  assert.match(r.text, /dirty \? repo-wide/, 'unknown must not render as zero: ' + r.text);
  fx.cleanup();
});

test('a ledger line that will not parse is COUNTED, not filtered away', () => {
  const fx = fixture([OPEN_ROW, '{ this is not json',
    { lap: 'L007', stage: 'chain', at: 2000, chain: 'handbacks-in', holder: 'chair' }]);
  const r = mod().line({ ledger: fx.ledger, now: 2000, dirty: 0 });
  assert.match(r.text, /1 unreadable/, 'an unparseable row is UNKNOWN, not absent: ' + r.text);
  fx.cleanup();
});

test('dirtyCount returns null rather than 0 when git cannot answer', () => {
  const fx = fixture(null);
  assert.strictEqual(mod().dirtyCount(path.join(fx.dir, 'not-a-repo-at-all')), null);
  fx.cleanup();
});

// ---------------------------------------------------------------- writer: the refusals

test('writer: an unknown stage is REFUSED and the vocabulary is printed', () => {
  const fx = fixture([OPEN_ROW]);
  const before = fs.readFileSync(fx.ledger, 'utf8');
  const r = run(WRITER, ['--stage', 'L007', 'nearly-done', '--holder', 'chair'], fx.ledger);
  assert.strictEqual(r.code, 2, 'an invented stage must not be written');
  assert.match(r.stderr, /unknown stage/);
  assert.match(r.stderr, /handbacks-in/, 'the refusal must say what WOULD be accepted: ' + r.stderr);
  assert.strictEqual(fs.readFileSync(fx.ledger, 'utf8'), before, 'a refused write must leave the ledger byte-identical');
  fx.cleanup();
});

test('writer: a row with no holder is REFUSED - a baton must name a hand', () => {
  const fx = fixture([OPEN_ROW]);
  const before = fs.readFileSync(fx.ledger, 'utf8');
  const r = run(WRITER, ['--stage', 'L007', 'return-leg'], fx.ledger);
  assert.strictEqual(r.code, 2);
  assert.match(r.stderr, /--holder is required/);
  assert.strictEqual(fs.readFileSync(fx.ledger, 'utf8'), before);
  fx.cleanup();
});

test('writer: `filed` needs a holder too - no exemption', () => {
  // An exemption is where the next defect lives. js-suite learned this on 2026-08-17: a canary is
  // an exemption from FAILING, never from CLASSIFICATION.
  const fx = fixture([OPEN_ROW]);
  const r = run(WRITER, ['--stage', 'L007', 'filed'], fx.ledger);
  assert.strictEqual(r.code, 2, 'the terminal stage must not be a hole in the rule');
  fx.cleanup();
});

test('writer: the chain cannot MINT a lap', () => {
  // laps() builds an entry for any row carrying a lap id, so a chain row for an unknown id would
  // produce a lap with no open row that --report files as NO-OPEN and excludes.
  const fx = fixture([OPEN_ROW]);
  const r = run(WRITER, ['--stage', 'L999', 'working', '--holder', 'pane-a'], fx.ledger);
  assert.strictEqual(r.code, 2);
  assert.match(r.stderr, /no such lap/);
  fx.cleanup();
});

test('writer: an accepted row round-trips to the reader', () => {
  const fx = fixture([OPEN_ROW]);
  const w = run(WRITER, ['--stage', 'L007', 'return-leg', '--holder', 'librarian'], fx.ledger);
  assert.strictEqual(w.code, 0, w.stderr);
  assert.match(w.stdout, /RETURN-LEG/);
  assert.match(w.stdout, /librarian/);
  const r = mod().line({ ledger: fx.ledger, dirty: 0 });
  assert.match(r.text, /^chain: L007 RETURN-LEG \u00b7 holder librarian/);
  fx.cleanup();
});

// ---------------------------------------------------------------- the collision that had to be avoided

test('THE COLLISION: a chain row must not land in the `stage` field, and does not', () => {
  // Measured before any of this was written. A chain row written as {stage:'map'} - which is what
  // "more values of the existing field" literally means - CRASHES `--report` with a TypeError and
  // then blocks the real --map for that lap FOREVER, the ledger being append-only. Both halves are
  // reproduced here so that a future seat "simplifying" the row shape sees the cost immediately.
  const fx = fixture([OPEN_ROW]);
  delete require.cache[require.resolve('./lap-row.js')];
  process.env.LAP_LEDGER = fx.ledger;
  const lap = require('./lap-row.js');

  // the collision, reproduced by hand
  fs.appendFileSync(fx.ledger, JSON.stringify({ lap: 'L007', stage: 'map', at: 2000, holder: 'librarian' }) + '\n');
  assert.throws(() => lap.report(0, () => {}), TypeError, '--report survived a paths-less map row');
  assert.throws(() => lap.map('L007', ['x.js'], 3000), /already has a map/, 'the real map was still writable');

  // the shape that shipped, on a clean ledger: inert to the existing measurement
  const fx2 = fixture([OPEN_ROW,
    { lap: 'L007', stage: 'map', at: 2000, paths: ['a/b.js'], guess_seal: null, head: null }]);
  delete require.cache[require.resolve('./lap-row.js')];
  process.env.LAP_LEDGER = fx2.ledger;
  const lap2 = require('./lap-row.js');
  const before = []; lap2.report(0, l => before.push(l));
  lap2.chain('L007', 'return-leg', 'librarian', null, 4000);
  const after = []; lap2.report(0, l => after.push(l));
  assert.deepStrictEqual(after, before, 'a baton row changed the guess-vs-map report; the two measurements are entangled');

  fx.cleanup(); fx2.cleanup();
});

// ---------------------------------------------------------------- the work leg (2026-08-29)
//
// THE FAILURE UNDER TEST is the chair's, twice: a lap reached MAP and never reached the panes
// (L010, L011 - both `dispatched -> map -> filed`). The reader was blind to it BY CONSTRUCTION,
// because filing a dead lap removes it from the line. Every fixture below is a real ledger shape
// transcribed from C:\Consonance\data\lap.jsonl, not one invented to make a rule look good.
//
// AND THE ONE THAT MATTERS MOST IS THE SPARING, not the firing. L009 has no `working` row either
// and the panes demonstrably worked; a rule that fires on it is counting paperwork.

/** L010/L011: dispatched -> map -> filed. Nothing ever attested the work leg. */
const DEAD = (lap, t) => [
  { lap, stage: 'open', at: t, initiator: 'chair', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null },
  { lap, stage: 'chain', at: t + 1, chain: 'dispatched', holder: 'librarian' },
  { lap, stage: 'chain', at: t + 2, chain: 'map', holder: 'chair' },
  { lap, stage: 'chain', at: t + 3, chain: 'filed', holder: 'chair' },
];
/** L008: the full healthy lap, work leg crossed. */
const ALIVE = (lap, t) => [
  { lap, stage: 'open', at: t, initiator: 'human', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null },
  { lap, stage: 'chain', at: t + 1, chain: 'dispatched', holder: 'librarian' },
  { lap, stage: 'chain', at: t + 2, chain: 'map', holder: 'chair' },
  { lap, stage: 'chain', at: t + 3, chain: 'working', holder: 'panes' },
  { lap, stage: 'chain', at: t + 4, chain: 'filed', holder: 'chair' },
];

test('THE BAR: a lap filed without ever reaching the work leg is NAMED, where this was silent', () => {
  const fx = fixture(DEAD('L010', 1000));
  const r = mod().line({ ledger: fx.ledger, now: 1000 + 60 * 60000, dirty: 6 });
  assert.ok(r.text, 'a lap that died before the panes must produce a line; silence here IS the bug');
  assert.match(r.text, /^chain: L010 FILED/, r.text);
  assert.match(r.text, /WORK LEG UNWITNESSED/, r.text);
  assert.strictEqual(r.text.split('\n').length, 1, 'still ONE line: ' + JSON.stringify(r.text));
  fx.cleanup();
});

test('THE MUTATION: one `working` row silences it, and it is the ONLY thing that changed', () => {
  // Red-then-green on a single row. If the red arm passed without the mutation, the assertion
  // would be reading something other than the rule.
  const red = fixture(DEAD('L010', 1000));
  const green = fixture(ALIVE('L010', 1000));
  const a = mod().line({ ledger: red.ledger, now: 5000, dirty: 6 });
  const b = mod().line({ ledger: green.ledger, now: 5000, dirty: 6 });
  assert.match(a.text, /WORK LEG UNWITNESSED/, 'red arm did not fire: ' + a.text);
  assert.strictEqual(b.text, null, 'green arm still printed a line: ' + b.text);
  assert.strictEqual(b.unwitnessed, 0, 'green arm still counted the lap as unwitnessed');
  red.cleanup(); green.cleanup();
});

test('THE DISCRIMINATION: a lap that reached `return-leg` with no `working` row is SPARED', () => {
  // L009, verbatim: dispatched -> return-leg -> filed. The `working` row was never written and the
  // panes worked anyway - four hand-backs, per that row's own note. A definition that catches this
  // measures bookkeeping, not chain deaths, and would have reported the night's real work dead.
  const fx = fixture([
    { lap: 'L009', stage: 'open', at: 1000, initiator: 'human', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null },
    { lap: 'L009', stage: 'chain', at: 1001, chain: 'dispatched', holder: 'panes' },
    { lap: 'L009', stage: 'chain', at: 1002, chain: 'return-leg', holder: 'librarian' },
    { lap: 'L009', stage: 'chain', at: 1003, chain: 'filed', holder: 'chair' },
  ]);
  const r = mod().line({ ledger: fx.ledger, now: 9000, dirty: 6 });
  assert.strictEqual(r.text, null, 'L009 was reported dead; the panes had worked: ' + r.text);
  assert.strictEqual(r.unwitnessed, 0, 'L009 counted as unwitnessed - the false-positive class');
  fx.cleanup();
});

test('a healthy lap prints the line it printed before this section existed, byte for byte', () => {
  // "silent as now" asserted as EQUALITY, not as the absence of one substring. A clause added
  // anywhere in a healthy line is a clause the reader learns to skip past.
  const fx = fixture([
    { lap: 'L008', stage: 'open', at: 1000, initiator: 'human', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null },
    { lap: 'L008', stage: 'chain', at: 2000, chain: 'working', holder: 'panes' },
  ]);
  const r = mod().line({ ledger: fx.ledger, now: 2000 + 11 * 60000, dirty: 4 });
  assert.strictEqual(
    r.text,
    'chain: L008 WORKING \u00b7 holder panes \u00b7 dirty 4 repo-wide \u00b7 11m \u00b7 this machine only',
    'a healthy lap picked up a new clause');
  fx.cleanup();
});

test('the universe rides the claim: the denominator is printed WITH it, never left to the reader', () => {
  const fx = fixture([...DEAD('L010', 1000), ...DEAD('L011', 2000), ...ALIVE('L008', 500)]);
  const r = mod().line({ ledger: fx.ledger, now: 9000, dirty: 6 });
  assert.match(r.text, /2 of 3 chained laps unwitnessed/, r.text);
  // and the universe is CHAINED laps, not every lap in the ledger
  fs.appendFileSync(fx.ledger, JSON.stringify(
    { lap: 'L001', stage: 'open', at: 10, initiator: 'human', inquiry: 'y', guess: ['q.js'], head: null }) + '\n');
  const r2 = mod().line({ ledger: fx.ledger, now: 9000, dirty: 6 });
  assert.match(r2.text, /2 of 3 chained laps unwitnessed/, 'a lap with no chain row entered the denominator: ' + r2.text);
  fx.cleanup();
});

test('the claim carries its own limit, and ONLY where the claim is made', () => {
  // `unwitnessed` is a fact about ROWS. The ledger is self-report, so the line must never read as
  // "the panes did not work" - `rows only` is that limit, printed rather than filed in a header.
  const dead = fixture(DEAD('L010', 1000));
  const alive = fixture(ALIVE('L008', 1000));
  assert.match(mod().line({ ledger: dead.ledger, now: 9000, dirty: 6 }).text, /rows only/);
  const ok = mod().line({ ledger: alive.ledger, now: 9000, dirty: 6 });
  assert.strictEqual(ok.text, null, 'expected silence on the healthy fixture: ' + ok.text);
  dead.cleanup(); alive.cleanup();
});

test('the loud clause is bounded to the NEWEST lap: an open lap leads, the dead one falls to the count', () => {
  // The bound is structural, not a timeout. Without it a lap that died three weeks ago headlines
  // every turn forever, and a hook that nags is a hook that gets uninstalled - this file's own law.
  const fx = fixture([...DEAD('L010', 1000),
    { lap: 'L012', stage: 'open', at: 3000, initiator: 'human', inquiry: 'z', guess: ['a/b.js'], blind: true, head: null },
    { lap: 'L012', stage: 'chain', at: 3001, chain: 'working', holder: 'panes' }]);
  const r = mod().line({ ledger: fx.ledger, now: 9000, dirty: 6 });
  assert.match(r.text, /^chain: L012 WORKING/, 'the live lap must lead: ' + r.text);
  assert.doesNotMatch(r.text, /WORK LEG UNWITNESSED/, 'the loud clause outlived its lap: ' + r.text);
  assert.match(r.text, /1 of 2 chained laps unwitnessed \(L010\)/, 'the dead lap vanished entirely: ' + r.text);
  fx.cleanup();
});

test("E-3.1: ONE healthy lap filing after the deaths must not mute the alarm on STDOUT", () => {
  // THE FINDING THIS REPLACES WAS MINE AND IT WAS WRONG. v1 gated the all-filed speak-up on the
  // newest lap being the dead one, and I wrote a test asserting exactly that: silence here, with
  // the finding parked on `--why`. Pane E swept eleven fixtures and showed stdout empty at every
  // one - and `userprompt_pulse.py:151-153` does not read stderr, deliberately. So the alarm died
  // one healthy lap after the deaths, in the quiet-ledger state a stalled loop actually produces.
  //
  // Silence must mean the ledger is CLEAN. It must not mean the ledger is QUIET.
  const fx = fixture([...DEAD('L010', 1000), ...ALIVE('L011', 2000)]);
  const r = mod().line({ ledger: fx.ledger, now: 9000, dirty: 6 });
  assert.ok(r.text, 'the alarm went mute behind one healthy lap - E-3.1, reopened');
  assert.match(r.text, /^chain: no open lap/, 'no live position, and the line must say so: ' + r.text);
  assert.match(r.text, /1 of 2 chained laps unwitnessed \(L010\)/, r.text);
  assert.match(r.text, /rows only/, r.text);
  fx.cleanup();
});

test('E-3.1: and it reaches STDOUT through the cli, which is the only channel the pulse reads', () => {
  const fx = fixture([...DEAD('L010', 1000), ...ALIVE('L011', 2000)]);
  const r = run(READER, ['--ledger', fx.ledger], fx.ledger);
  assert.strictEqual(r.code, 0, 'exit ' + r.code + ' / ' + r.stderr);
  assert.match(r.stdout, /unwitnessed \(L010\)/, 'stdout: ' + JSON.stringify(r.stdout));
  assert.strictEqual(r.stdout.trim().split('\n').length, 1,
    'the pulse keeps only the FIRST line; a second would ship green and never leave the tool');
  fx.cleanup();
});

test('E-3.2: the window cap names what it dropped instead of shrinking the count in silence', () => {
  // E swept the real ledger forward: L010 left the count at +8 healthy laps and L011 at +9, after
  // which --why reported "every lap with a baton row is filed" over a ledger holding two chain
  // deaths. The cap stays; its silence does not.
  const rows = [];
  for (let i = 1; i <= 3; i++) rows.push(...DEAD('D' + i, i * 1000));
  for (let i = 1; i <= 9; i++) rows.push(...ALIVE('H' + i, 10000 + i * 1000));
  const fx = fixture(rows);
  const r = mod().line({ ledger: fx.ledger, now: 99000, dirty: 0 });
  assert.ok(r.text, 'twelve chained laps, three of them dead, and the reader went silent');
  assert.strictEqual(r.older, 2, 'expected two deaths pushed past the 10-lap window, got ' + r.older);
  assert.match(r.text, /2 older beyond the 10-lap window/, 'the cap dropped two laps silently: ' + r.text);
  fx.cleanup();
});

test('E-3.3: a lap with a damaged chain row is UNKNOWN, never counted as a chain death', () => {
  // `attested` asks whether any row carries a work-attesting `chain` value. A `working` row whose
  // `chain` field is damaged therefore un-attests a HEALTHY lap and manufactures a chain death out
  // of corruption. Unknown is not absent - residue.js, 2026-08-17.
  const fx = fixture([
    { lap: 'L0', stage: 'open', at: 1, initiator: 'chair', inquiry: 'x', guess: ['a.js'], head: null },
    { lap: 'L0', stage: 'chain', at: 2, chain: 'dispatched', holder: 'librarian' },
    { lap: 'L0', stage: 'chain', at: 3, holder: 'panes' },              // was `working`; field gone
    { lap: 'L0', stage: 'chain', at: 4, chain: 'filed', holder: 'chair' }]);
  const r = mod().line({ ledger: fx.ledger, now: 90, dirty: 0 });
  assert.strictEqual(r.unwitnessed, 0, 'damage was reported as a chain death: ' + r.text);
  assert.strictEqual(r.damaged, 1, 'and the damage was dropped instead of counted');
  assert.match(r.text, /1 lap\(s\) UNKNOWN, damaged rows/, r.text);
  fx.cleanup();
});

test('E-3.3: a wholly corrupt ledger reads as CORRUPT on stdout, never as clean', () => {
  // `led.unreadable` was computed on every path and appended only where a line already printed, so
  // all three silent returns threw it away: a destroyed ledger and an unstarted one were one
  // output. The count is load-bearing now - `0 unwitnessed` over an unreadable file is a false
  // green with an alarm attached to it.
  const fx = fixture(null);
  fs.writeFileSync(fx.ledger, 'not json\n{broken\ngarbage\n');
  const r = run(READER, ['--ledger', fx.ledger], fx.ledger);
  assert.strictEqual(r.code, 0, 'exit ' + r.code + ' / ' + r.stderr);
  assert.match(r.stdout, /3 unreadable/, 'a destroyed ledger printed nothing: ' + JSON.stringify(r.stdout));
  fx.cleanup();
});

test('membership, never ordering: the map/dispatched order every real lap uses is read the same', () => {
  // lap-row.js declares map -> dispatched; all four real laps write dispatched -> map. A rule
  // computing "did it get past index N" would misread the entire record.
  const a = fixture([{ lap: 'L0', stage: 'open', at: 1, initiator: 'chair', inquiry: 'x', guess: ['a.js'], head: null },
    { lap: 'L0', stage: 'chain', at: 2, chain: 'dispatched', holder: 'librarian' },
    { lap: 'L0', stage: 'chain', at: 3, chain: 'map', holder: 'chair' },
    { lap: 'L0', stage: 'chain', at: 4, chain: 'filed', holder: 'chair' }]);
  const b = fixture([{ lap: 'L0', stage: 'open', at: 1, initiator: 'chair', inquiry: 'x', guess: ['a.js'], head: null },
    { lap: 'L0', stage: 'chain', at: 2, chain: 'map', holder: 'chair' },
    { lap: 'L0', stage: 'chain', at: 3, chain: 'dispatched', holder: 'librarian' },
    { lap: 'L0', stage: 'chain', at: 4, chain: 'filed', holder: 'chair' }]);
  const ra = mod().line({ ledger: a.ledger, now: 90, dirty: 0 });
  const rb = mod().line({ ledger: b.ledger, now: 90, dirty: 0 });
  assert.strictEqual(ra.unwitnessed, 1);
  assert.strictEqual(rb.unwitnessed, 1, 'the two stage orders classified differently');
  a.cleanup(); b.cleanup();
});

test('a lap continued after being filed is OPEN, not dead - the two readers agree about `closed`', () => {
  // `filed` reads the NEWEST row, matching openLaps(). If one asked "is there a filed row anywhere"
  // and the other "is the newest row filed", a resumed lap would be open and dead in the same line.
  // THE FIXTURE HAS TO STAY PRE-WORK AFTER THE FILE, or the two definitions cannot diverge and
  // this asserts nothing. The first version resumed with a `working` row: `attested` then went
  // true and BOTH definitions reported the lap healthy, so the test passed under the mutation it
  // was written to catch. Caught by mutating the line it guards (M2, 2026-08-29) - which is the
  // only reason it is known to bite now.
  const fx = fixture([{ lap: 'L0', stage: 'open', at: 1, initiator: 'chair', inquiry: 'x', guess: ['a.js'], head: null },
    { lap: 'L0', stage: 'chain', at: 2, chain: 'map', holder: 'chair' },
    { lap: 'L0', stage: 'chain', at: 3, chain: 'filed', holder: 'chair' },
    { lap: 'L0', stage: 'chain', at: 4, chain: 'dispatched', holder: 'librarian' }]);
  const r = mod().line({ ledger: fx.ledger, now: 90, dirty: 0 });
  assert.match(r.text, /^chain: L0 DISPATCHED/, 'the resumed lap must lead as open: ' + r.text);
  assert.strictEqual(r.unwitnessed, 0,
    'a lap reported OPEN in the same line was also counted dead - the two readers disagree about `closed`');
  assert.doesNotMatch(r.text, /unwitnessed/, r.text);
  fx.cleanup();
});

test('more unwitnessed laps than the list cap: ids truncate with +N and the COUNT stays exact', () => {
  const rows = [];
  for (let i = 1; i <= 5; i++) rows.push(...DEAD('L' + String(i).padStart(3, '0'), i * 1000));
  const fx = fixture(rows);
  const r = mod().line({ ledger: fx.ledger, now: 90000, dirty: 0 });
  assert.match(r.text, /^chain: L005 FILED/, r.text);
  assert.match(r.text, /5 of 5 chained laps unwitnessed/, 'the count truncated with the list: ' + r.text);
  assert.match(r.text, /\+1/, 'the truncation was silent: ' + r.text);
  assert.strictEqual(r.text.split('\n').length, 1);
  fx.cleanup();
});

test('a ledger with chain rows and NOTHING unwitnessed still exits 0 in silence', () => {
  const fx = fixture(ALIVE('L008', 1000));
  const r = run(READER, ['--ledger', fx.ledger], fx.ledger);
  assert.strictEqual(r.code, 0, 'exit ' + r.code + ' / ' + r.stderr);
  assert.strictEqual(r.stdout, '', 'printed on a clean chain: ' + JSON.stringify(r.stdout));
  assert.strictEqual(r.stderr, '');
  fx.cleanup();
});

test('the dead lap reaches the ACTUAL cli, not only line() - the hook reads stdout', () => {
  const fx = fixture(DEAD('L010', 1000));
  const r = run(READER, ['--ledger', fx.ledger], fx.ledger);
  assert.strictEqual(r.code, 0, 'exit ' + r.code + ' / ' + r.stderr);
  assert.match(r.stdout, /WORK LEG UNWITNESSED/, 'stdout: ' + JSON.stringify(r.stdout));
  fx.cleanup();
});

// ── THE COLLATION CLAIM (pane B, 2026-08-29) ─────────────────────────────────────────────────────
// A store here is a temp dir holding all three files the claim joins — lap.jsonl, board.jsonl and
// letters.json — because the claim is a CONJUNCTION and a fixture that supplies one of them is
// testing something else. Nothing below reads C:\Consonance\data.

const LET = { 'aaaaaaaa-0000-4000-8000-000000000001': 'A', 'bbbbbbbb-0000-4000-8000-000000000002': 'B' };
const DISPATCH = (ts, id) => ({ pane: 'chair', role: 'committee', ts,
  text: 'chair injected (chair: claude-opus-5) -> ' + id.slice(0, 8) + ' [delivered and received]: go' });
const HANDBACK = (ts, letter) => ({ pane: letter, role: 'committee', ts, text: '[pane ' + letter + '] done' });
const WORKING = (at) => ([
  { lap: 'L900', stage: 'open', at: at - 100, initiator: 'human', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null },
  { lap: 'L900', stage: 'chain', at, chain: 'working', holder: 'panes' },
]);

/** lap.jsonl + board.jsonl + letters.json in one temp dir. `board:null` omits the board entirely. */
function store(lapRows, boardRows, opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'chain-store-'));
  fs.writeFileSync(path.join(dir, 'lap.jsonl'), lapRows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  if (boardRows !== null) {
    fs.writeFileSync(path.join(dir, 'board.jsonl'),
      (opts.rawBoard || boardRows.map((r) => JSON.stringify(r)).join('\n')) + '\n');
  }
  if (opts.letters !== null) {
    fs.writeFileSync(path.join(dir, 'letters.json'), opts.rawLetters || JSON.stringify(opts.lettersMap || LET));
  }
  return { dir, ledger: path.join(dir, 'lap.jsonl'), cleanup: () => fs.rmSync(dir, { recursive: true, force: true }) };
}
const A = 'aaaaaaaa-0000-4000-8000-000000000001';
const B = 'bbbbbbbb-0000-4000-8000-000000000002';

test('BAR 1 — holder=panes and every dispatched pane has posted: the line SAYS SO', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), DISPATCH(1200, B), HANDBACK(1300, 'A'), HANDBACK(1400, 'B')]);
  const r = mod().line({ ledger: s.ledger, now: 1400 + 65 * 60000, dirty: 0 });
  assert.match(r.text, /HANDBACKS IN, NOT COLLATED — 2 of 2 \(A,B\), last 65m ago/, r.text);
  s.cleanup();
});

test('BAR 2 — one pane has not posted: SILENT on the claim, and it names who is owed', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), DISPATCH(1200, B), HANDBACK(1300, 'A')]);
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.ok(!/HANDBACKS IN/.test(r.text), 'fired with a pane still owing: ' + r.text);
  assert.match(r.text, /handbacks 1 of 2 \(owing B\)/, r.text);
  s.cleanup();
});

test('BAR 2b — a hand-back that PREDATES the dispatch does not count: it answered an older brief', () => {
  const s = store(WORKING(1000), [HANDBACK(1050, 'A'), DISPATCH(1100, A)]);
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.match(r.text, /handbacks 0 of 1 \(owing A\)/, r.text);
  s.cleanup();
});

test('BAR 3 — holder=chair is silent on the claim no matter how long every pane has been quiet', () => {
  const rows = [...WORKING(1000), { lap: 'L900', stage: 'chain', at: 2000, chain: 'return-leg', holder: 'chair' }];
  const s = store(rows, [DISPATCH(1100, A), DISPATCH(1200, B), HANDBACK(1300, 'A'), HANDBACK(1400, 'B')]);
  const r = mod().line({ ledger: s.ledger, now: 1400 + 99 * 3600000, dirty: 0 });
  assert.ok(!/HANDBACKS IN|handbacks |collation /.test(r.text), 'the claim leaked onto a chair line: ' + r.text);
  s.cleanup();
});

test('BAR 3b — holder=librarian is silent too, on the identical board', () => {
  const rows = [...WORKING(1000), { lap: 'L900', stage: 'chain', at: 2000, chain: 'return-leg', holder: 'librarian' }];
  const s = store(rows, [DISPATCH(1100, A), HANDBACK(1300, 'A')]);
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.ok(!/HANDBACKS IN|handbacks |collation /.test(r.text), r.text);
  s.cleanup();
});

// ── THE TRAP: silent-on-unreadable is the false-green class ───────────────────────────────────────

test('THE TRAP — an UNPARSEABLE board says UNKNOWN, never silent', () => {
  const s = store(WORKING(1000), [], { rawBoard: '{not json' });
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  // The first draft SKIPPED unparseable lines, which emptied the round, which read as 'n/a', which
  // printed silence — a damaged source reporting as nothing-to-say. Counted, and loud.
  assert.ok(r.text.includes('collation UNKNOWN — 1 board line(s) unreadable'), r.text);
  assert.ok(!/HANDBACKS IN/.test(r.text), 'a garbage board produced an all-in claim: ' + r.text);
  s.cleanup();
});

// ── THE FUSED LINE (2026-09-01, P-BOARD-LINE) ────────────────────────────────────────────────────
// board_push appends with `writeln!` on an unbuffered File: row and '\n' are two syscalls, and two
// writer threads interleave as A · B\n · \n. Measured on the live board: 30 of 152,806 lines, each
// exactly two complete rows from two panes, each followed by a stray empty line. One sat inside the
// 8 MB tail and held `collation UNKNOWN` for a day. The fixtures below reproduce that byte shape —
// `}{` with no newline, then the orphan newline — rather than an idealised one.
const FUSE = (...rows) => rows.map((r) => JSON.stringify(r)).join('') + '\n';

test('FUSED — the live shape (two rows glued `}{`, stray newline after) is RECOVERED, not UNKNOWN', () => {
  const raw = JSON.stringify(DISPATCH(1100, A)) + '\n' + FUSE(HANDBACK(1300, 'A'), { pane: 'x', role: 'user', text: 'replayed', ts: 900 });
  const s = store(WORKING(1000), [], { rawBoard: raw });
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.ok(!/collation UNKNOWN/.test(r.text), 'a recoverable line collapsed the state: ' + r.text);
  assert.match(r.text, /HANDBACKS IN, NOT COLLATED — 1 of 1 \(A\)/, 'the hand-back inside the fused line was not seen: ' + r.text);
  s.cleanup();
});

test('FUSED — the count PRINTS, so the write defect stays visible from the line everyone reads', () => {
  const raw = JSON.stringify(DISPATCH(1100, A)) + '\n' + FUSE(HANDBACK(1300, 'A'), { pane: 'x', role: 'user', text: 'replayed', ts: 900 });
  const s = store(WORKING(1000), [], { rawBoard: raw });
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /1 board line\(s\) fused, rows recovered/, 'a repaired line hid the defect it repaired: ' + r.text);
  s.cleanup();
});

test('FUSED — THE GUARD SURVIVES: a DISPATCH hidden inside a fused line is counted, and the pane is owed', () => {
  // The lenient repair — skip the line you cannot parse — reads this board as 1 of 1 all-in.
  // B was dispatched inside the torn write and never answered; the honest line says so.
  const raw = [JSON.stringify(DISPATCH(1100, A)), JSON.stringify(HANDBACK(1300, 'A'))].join('\n') + '\n'
    + FUSE({ pane: 'x', role: 'user', text: 'replayed', ts: 900 }, DISPATCH(1200, B));
  const s = store(WORKING(1000), [], { rawBoard: raw });
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /handbacks 1 of 2 \(owing B\)/, 'the dispatch inside the fused line was dropped: ' + r.text);
  assert.ok(!/HANDBACKS IN/.test(r.text), 'FALSE ALL-IN over a dispatch the reader could have seen: ' + r.text);
  s.cleanup();
});

test('FUSED — THE OTHER DIRECTION: `}{` clothing on a line that does NOT decompose is still UNKNOWN', () => {
  const s = store(WORKING(1000), [], { rawBoard: JSON.stringify(DISPATCH(1100, A)) + '\n{"a":1}{broken\n' });
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.ok(r.text.includes('collation UNKNOWN — 1 board line(s) unreadable'), 'salvage guessed on a half-readable line: ' + r.text);
  assert.ok(!/HANDBACKS IN|handbacks \d/.test(r.text), 'a state was claimed over an unreadable row: ' + r.text);
  s.cleanup();
});

test('FUSED — the split happens at the boundary that PARSES, not at the first `}{` in the bytes', () => {
  // A row whose text contains the two characters is not cut open at them.
  const first = { pane: 'x', role: 'user', text: 'a }{ b', ts: 1 };
  const second = { pane: 'y', role: 'assistant', text: 'c', ts: 2 };
  const p = mod().parseBoardLine(JSON.stringify(first) + JSON.stringify(second));
  assert.ok(p && p.fused, 'a two-row line did not read as fused: ' + JSON.stringify(p));
  assert.deepStrictEqual(p.rows, [first, second]);
});

test('FUSED — an ordinary single row is untouched: not fused, and the line does not mention it', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), HANDBACK(1300, 'A')]);
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.ok(!/fused/.test(r.text), 'a clean board printed a fused count: ' + r.text);
  s.cleanup();
});

// ── THE DEADLOCK (2026-09-01, P3d — the pane→librarian edge) ─────────────────────────────────────
// The librarian is the seat that collates hand-backs. A chair ring to it (a chair_inject to the
// librarian's session) was counted as a dispatch creating a hand-back obligation, so the counter
// waited for the librarian while the librarian waited for the counter to say the panes were in.
// Live on 2026-09-01: `handbacks 1 of 3 (owing B,M)` with M the librarian's letter.
const LIB = '0c0c0c0b-0000-4000-8000-00000000115b';   // main.rs LIBRARIAN_SID
const LET_WITH_LIB = Object.assign({ [LIB]: 'M' }, LET);
const CALL_LIB = (ts, letter, receipt = 'Received') => ({ pane: 'chair', role: 'committee', ts,
  text: 'call_librarian ' + letter + ' -> LIB [' + receipt + ']: "handback at exo_memory/handback/x.md"' });

test('THE DEADLOCK — a chair ring to the LIBRARIAN is a wake, not a dispatch: the counter still completes', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), DISPATCH(1200, LIB), HANDBACK(1300, 'A')], { lettersMap: LET_WITH_LIB });
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /HANDBACKS IN, NOT COLLATED — 1 of 1 \(A\)/, 'the librarian was counted as owing a hand-back: ' + r.text);
  s.cleanup();
});

test('THE DEADLOCK — the exclusion is by SEAT, not by silence: a pane that has not posted is still owed', () => {
  // The mutation the fix must not admit: excluding the librarian must not widen into excluding
  // anyone quiet. B was dispatched and has said nothing; the line names it.
  const s = store(WORKING(1000), [DISPATCH(1100, A), DISPATCH(1150, B), DISPATCH(1200, LIB), HANDBACK(1300, 'A')], { lettersMap: LET_WITH_LIB });
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /handbacks 1 of 2 \(owing B\)/, r.text);
  s.cleanup();
});

test('THE NEW ROUTE — a pane\'s `call_librarian` audit row IS its hand-back', () => {
  // No board post from A at all: the hand-back went pane -> librarian by the edge, and the app's
  // audit row is the only trace on the board. It is written by pane `chair`, which the old reader
  // skipped wholesale — so without the new match this reads `owing A`.
  const s = store(WORKING(1000), [DISPATCH(1100, A), CALL_LIB(1300, 'A')], { lettersMap: LET_WITH_LIB });
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /HANDBACKS IN, NOT COLLATED — 1 of 1 \(A\)/, 'the edge\'s own audit row was not read as a hand-back: ' + r.text);
  s.cleanup();
});

test('THE NEW ROUTE — a call that PREDATES the dispatch answered an older brief and does not count', () => {
  const s = store(WORKING(1000), [CALL_LIB(1050, 'A'), DISPATCH(1100, A)], { lettersMap: LET_WITH_LIB });
  const r = mod().line({ ledger: s.ledger, now: 1100 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /handbacks 0 of 1 \(owing A\)/, r.text);
  s.cleanup();
});

test('THE NEW ROUTE — a REFUSED call is not a hand-back', () => {
  // The refusal line the gate writes has a different shape on purpose; it must not satisfy the join.
  const refused = { pane: 'chair', role: 'committee', ts: 1300,
    text: 'call_librarian REFUSED — mount A (seat committee) has no address row for call_librarian' };
  const s = store(WORKING(1000), [DISPATCH(1100, A), refused], { lettersMap: LET_WITH_LIB });
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /handbacks 0 of 1 \(owing A\)/, 'a refused call satisfied the hand-back join: ' + r.text);
  s.cleanup();
});

test('THE TRAP — an unreadable letters.json says UNKNOWN, and the line carries it', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), HANDBACK(1300, 'A')], { rawLetters: '{oops' });
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.match(r.text, /collation UNKNOWN — letters\.json unreadable/, r.text);
  s.cleanup();
});

test('THE TRAP — a dispatch to a pane with NO letter is UNKNOWN, not a smaller round', () => {
  // The false-green shape: drop the pane you cannot name, and the remaining round is "all in".
  const s = store(WORKING(1000), [DISPATCH(1100, A), DISPATCH(1200, 'cccccccc-0000-4000-8000-000000000003'), HANDBACK(1300, 'A')]);
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.match(r.text, /collation UNKNOWN — 1 dispatch target\(s\) unresolved/, r.text);
  assert.ok(!/HANDBACKS IN/.test(r.text), r.text);
  s.cleanup();
});

test('THE TRAP — an AMBIGUOUS id prefix resolves to nothing rather than to a guess', () => {
  const two = { 'abcdef00-0000-4000-8000-000000000001': 'A', 'abcdef00-0000-4000-8000-000000000002': 'B' };
  assert.strictEqual(mod().toLetter('abcdef00', two), null, 'a prefix matching two panes was guessed');
  assert.strictEqual(mod().toLetter('abcdef00-0000-4000-8000-000000000002', two), 'B');
  s_cleanup_noop();
});
function s_cleanup_noop() {}

test('THE TRAP — a byte tail that does not reach the anchor is UNKNOWN, not "nobody owes"', () => {
  // The anchor is the previous `filed` row. A tail whose oldest committee row is NEWER than the
  // anchor could be missing a dispatch, so the round could be short and a short round reads all-in.
  const c = mod().collation({
    now: 9e6, anchor: 1000,
    boardLines: [JSON.stringify(HANDBACK(5000, 'A'))], boardTruncated: true,
    lettersMap: LET, board: 'x', letters: 'y',
  });
  assert.strictEqual(c.state, 'unknown', JSON.stringify(c));
  assert.match(c.why, /did not reach the anchor/);
});

test('the anchor scopes the round: a dispatch from BEFORE the last `filed` row is not this cycle', () => {
  const rows = [
    { lap: 'L899', stage: 'open', at: 100, initiator: 'human', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null },
    { lap: 'L899', stage: 'chain', at: 900, chain: 'filed', holder: 'chair' },
    ...WORKING(1000),
  ];
  // B was dispatched in the PREVIOUS cycle and never answered. Without the anchor it would owe
  // forever and this claim would be permanently mute — the measured failure over 206 dispatches.
  const s = store(rows, [DISPATCH(500, B), DISPATCH(1100, A), HANDBACK(1300, 'A')]);
  const r = mod().line({ ledger: s.ledger, now: 1300 + 5 * 60000, dirty: 0 });
  assert.match(r.text, /HANDBACKS IN, NOT COLLATED — 1 of 1 \(A\)/, r.text);
  s.cleanup();
});

test('a store with NO board.jsonl is not a room running a committee: n/a and silent', () => {
  // The applicability cut, and the reason it exists: the first version of this joined a temp-dir
  // fixture against the live 185 MB board. Around's byte-identical test caught it on run one.
  const s = store(WORKING(1000), null);
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.ok(!/collation|handbacks/.test(r.text), r.text);
  s.cleanup();
});

test('the chair\'s own board traffic is not a hand-back', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), { pane: 'chair', role: 'committee', ts: 1500, text: 'call_chair -> Main [Received]: "x"' }]);
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.match(r.text, /handbacks 0 of 1 \(owing A\)/, 'a chair row was counted as a pane hand-back: ' + r.text);
  s.cleanup();
});

test('a delivery-UNCONFIRMED dispatch is counted and said, not silently treated as delivered', () => {
  const bad = { pane: 'chair', role: 'committee', ts: 1100,
    text: 'chair injected (chair: x) -> ' + A.slice(0, 8) + " [WRITTEN BUT UNCONFIRMED — no render in the pane's capture within 1800ms]: go" };
  const s = store(WORKING(1000), [bad, HANDBACK(1300, 'A')]);
  const r = mod().line({ ledger: s.ledger, now: 1300 + 3 * 60000, dirty: 0 });
  assert.match(r.text, /1 dispatch\(es\) delivery-unconfirmed/, r.text);
  s.cleanup();
});

test('THE UNIVERSE rides the claim: N of M and the round are printed, never left to the reader', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), DISPATCH(1200, B), HANDBACK(1300, 'A'), HANDBACK(1400, 'B')]);
  const r = mod().line({ ledger: s.ledger, now: 1400 + 60000, dirty: 0 });
  assert.match(r.text, /2 of 2/, 'the denominator is missing: ' + r.text);
  assert.match(r.text, /\(A,B\)/, 'the round is not named: ' + r.text);
  s.cleanup();
});

test('MUTATION — remove one hand-back row and the fired claim goes silent', () => {
  const full = [DISPATCH(1100, A), DISPATCH(1200, B), HANDBACK(1300, 'A'), HANDBACK(1400, 'B')];
  const s1 = store(WORKING(1000), full);
  assert.match(mod().line({ ledger: s1.ledger, now: 9e6, dirty: 0 }).text, /HANDBACKS IN/);
  s1.cleanup();
  const s2 = store(WORKING(1000), full.slice(0, 3));
  const r = mod().line({ ledger: s2.ledger, now: 9e6, dirty: 0 });
  assert.ok(!/HANDBACKS IN/.test(r.text), 'the claim survived deleting the evidence for it: ' + r.text);
  s2.cleanup();
});

// ── THE BLIND GATE — pane E's attack §2b, the one item it said not to ship without ────────────────
// The claim carries cross-pane state onto a line printed in every seat. blind.js exists to mute that
// traffic; reading board.jsonl directly routes around it unless the gate is here.

test('BLIND — an active window withholds the claim and DECLARES the mute', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), HANDBACK(1300, 'A')]);
  fs.writeFileSync(path.join(s.dir, 'blind.lock'),
    JSON.stringify({ until: new Date(Date.now() + 3600000).toISOString(), why: 'run', by: 'chair' }));
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.ok(!/HANDBACKS IN/.test(r.text), 'cross-pane state leaked through a blind window: ' + r.text);
  assert.match(r.text, /collation UNKNOWN — blind window/, r.text);
  s.cleanup();
});

test('BLIND — an UNREADABLE marker fails CLOSED, per blind.js decision 3', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), HANDBACK(1300, 'A')]);
  fs.writeFileSync(path.join(s.dir, 'blind.lock'), '{ this is not json');
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.match(r.text, /collation UNKNOWN — blind window/, 'an unreadable marker did not mute: ' + r.text);
  s.cleanup();
});

test('BLIND — an EXPIRED marker does not mute: fail-closed is not fail-forever', () => {
  const s = store(WORKING(1000), [DISPATCH(1100, A), HANDBACK(1300, 'A')]);
  fs.writeFileSync(path.join(s.dir, 'blind.lock'),
    JSON.stringify({ until: new Date(Date.now() - 3600000).toISOString(), why: 'over', by: 'chair' }));
  const r = mod().line({ ledger: s.ledger, now: 1300 + 60000, dirty: 0 });
  assert.match(r.text, /HANDBACKS IN, NOT COLLATED/, 'an expired window kept the claim muted: ' + r.text);
  s.cleanup();
});

test('BLIND — the marker is read from the STORE, never from the live machine', () => {
  // The same defect Around's byte-identical test caught in the first draft, one file over: a
  // fixture must not consult C:\Consonance\data for anything, the blind window included.
  const s = store(WORKING(1000), [DISPATCH(1100, A), HANDBACK(1300, 'A')]);
  let asked = null;
  const c = mod().collation({
    now: 9e6, anchor: 0, board: path.join(s.dir, 'board.jsonl'), letters: path.join(s.dir, 'letters.json'),
    blindState: (p) => { asked = p; return { blind: false, reason: 'no-lock' }; },
  });
  assert.strictEqual(asked, path.join(s.dir, 'blind.lock'), 'the gate consulted ' + asked);
  assert.strictEqual(c.state, 'all-in');
  s.cleanup();
});

test('COVERAGE, stated: this claim cannot fire on a lap whose holder never reached panes', () => {
  // Pane E's §1. L010 and L011 died at MAP with holder=chair; only L013 is this clause's case. A
  // hand-back saying "this closes the failure I committed three times" is wrong by two-thirds.
  const rows = [
    { lap: 'L010', stage: 'open', at: 900, initiator: 'human', inquiry: 'x', guess: ['a/b.js'], blind: true, head: null },
    { lap: 'L010', stage: 'chain', at: 1000, chain: 'dispatched', holder: 'librarian' },
    { lap: 'L010', stage: 'chain', at: 1100, chain: 'map', holder: 'chair' },
  ];
  const s = store(rows, [DISPATCH(1200, A), HANDBACK(1300, 'A')]);
  const r = mod().line({ ledger: s.ledger, now: 9e6, dirty: 0 });
  assert.ok(!/HANDBACKS IN|handbacks |collation /.test(r.text),
    'the claim fired on a lap that never dispatched anyone: ' + r.text);
  s.cleanup();
});
