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
  assert.ok(!/L007/.test(r.text), 'the filed lap must not appear: ' + r.text);
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
