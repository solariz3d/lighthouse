// read-ledger.test.js - run with: node read-ledger.test.js
//
// Driven through the CLI as a subprocess rather than by requiring the module. The tool's whole
// value is in what it REFUSES, and a refusal is an exit code plus a message on stderr - which is
// exactly what a caller sees and what an in-process require would let us skip past.
//
// The first three tests are the ones that matter. Each pins a way the instrument could quietly
// become useless while still running green: a registration with no falsifier (unscoreable later),
// a score against no registration (post-hoc classification, the defect this repairs), and a rate
// computed over a minority of registrations (measures which ones someone chose to score).

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const TOOL = path.join(__dirname, 'read-ledger.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readledger-'));
const LEDGER = path.join(tmp, 'read_ledger.jsonl');

function run(args) {
  try {
    const out = execFileSync(process.execPath, [TOOL, ...args], {
      env: { ...process.env, READ_LEDGER: LEDGER }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out, err: '' };
  } catch (e) {
    return { code: e.status, out: e.stdout || '', err: e.stderr || '' };
  }
}
function reset() { if (fs.existsSync(LEDGER)) fs.unlinkSync(LEDGER); }
function registerOK(cls, claim) {
  const r = run(['--register', '--class', cls, '--claim', claim,
    '--falsifier', 'an instrument returns a number contradicting it']);
  assert.strictEqual(r.code, 0, `register failed: ${r.err}`);
  return JSON.parse(r.out).id;
}

test('a registration without a falsifier is REFUSED', () => {
  reset();
  const r = run(['--register', '--class', 'direction', '--claim', 'the keeper reads structure well']);
  assert.strictEqual(r.code, 2, 'expected refusal');
  assert.ok(/falsifier/i.test(r.err), 'the refusal must name the falsifier as the reason');
  assert.ok(!fs.existsSync(LEDGER) || fs.readFileSync(LEDGER, 'utf8').trim() === '',
    'a refused registration must not be written — a half-written row is worse than none');
});

test('scoring an id that was never registered is REFUSED', () => {
  reset();
  const r = run(['--score', 'deadbeef', '--outcome', 'confirmed', '--evidence', 'it worked out']);
  assert.strictEqual(r.code, 2, 'expected refusal');
  assert.ok(/post-hoc|unregistered/i.test(r.err),
    'the refusal must name post-hoc classification — that is the defect being prevented');
});

test('the refutation rate is WITHHELD when most registrations are unscored', () => {
  reset();
  const ids = [];
  for (let i = 0; i < 5; i++) ids.push(registerOK('direction', `structural read number ${i} about the room`));
  // Score only the one that "went well" — the exact bias the withholding rule exists to catch.
  run(['--score', ids[0], '--outcome', 'confirmed', '--evidence', 'the instrument agreed']);
  const r = run(['--report']);
  assert.strictEqual(r.code, 0);
  assert.ok(/WITHHELD/.test(r.out), 'a rate over 1 of 5 must not be printed as if it were the rate');
  assert.ok(!/refutation rate: \d+%/.test(r.out), 'no percentage may appear while withheld');
});

// PANE A'S BYPASS, scripted rather than argued, kept as a permanent regression. v1 withheld on
// `scored`, and `unresolved` counted as scored while never entering the denominator — so dumping
// the inconvenient reads as unresolved unlocked a rate computed over a single favourable one.
test('dumping reads as UNRESOLVED does not unlock the rate', () => {
  reset();
  const ids = [];
  for (let i = 0; i < 6; i++) ids.push(registerOK('direction', `structural read number ${i} about the room`));
  run(['--score', ids[0], '--outcome', 'confirmed', '--evidence', 'the instrument agreed']);
  for (let i = 1; i < 6; i++) run(['--score', ids[i], '--outcome', 'unresolved', '--evidence', 'no instrument for this']);
  const r = run(['--report']);
  assert.ok(/WITHHELD/.test(r.out), `5 unresolved + 1 confirmed must not unlock a rate:\n${r.out}`);
  assert.ok(!/refutation rate: \d+%/.test(r.out), 'no percentage may be printed off one decided read');
  assert.ok(/DECIDED/.test(r.out), 'the withholding must name DECIDED, not merely scored');
});

test('the register→score interval is reported so same-breath scoring is visible', () => {
  reset();
  const id = registerOK('state', 'the suite reads 261 on this branch');
  run(['--score', id, '--outcome', 'refuted', '--evidence', 'it read 261 not 267']);
  const r = run(['--report']);
  assert.ok(/register→score/.test(r.out), `the interval must be printed:\n${r.out}`);
  assert.ok(/within 60s of registering/.test(r.out),
    'a score written seconds after its registration must be flagged for hand-checking');
});

test('the rate IS computed once a majority are scored, and counts refutations', () => {
  reset();
  const ids = [];
  for (let i = 0; i < 4; i++) ids.push(registerOK('direction', `structural read number ${i} about the room`));
  run(['--score', ids[0], '--outcome', 'confirmed', '--evidence', 'the instrument agreed']);
  run(['--score', ids[1], '--outcome', 'confirmed', '--evidence', 'the instrument agreed']);
  run(['--score', ids[2], '--outcome', 'refuted', '--evidence', 'the suite came back red']);
  const r = run(['--report']);
  assert.ok(!/WITHHELD/.test(r.out), `3 of 4 scored should compute a rate:\n${r.out}`);
  assert.ok(/refutation rate: 33%/.test(r.out), `expected 1 refuted of 3 decided:\n${r.out}`);
});

test('re-scoring is appended and COUNTED, never silently replaced', () => {
  reset();
  const id = registerOK('state', 'the suite reads 261 on this branch');
  run(['--score', id, '--outcome', 'refuted', '--evidence', 'it read 261 not 267']);
  const second = run(['--score', id, '--outcome', 'confirmed', '--evidence', 'rechecked after landing']);
  assert.strictEqual(second.code, 0);
  assert.strictEqual(JSON.parse(second.out).amendment, true, 'the amendment must be reported to the caller');
  const lines = fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
  assert.strictEqual(lines.filter((l) => l.kind === 'score' && l.id === id).length, 2,
    'both scores must survive on the record — append-clean, never overwrite');
  const r = run(['--report']);
  assert.ok(/AMENDED SCORES: 1/.test(r.out), `amendments must be visible in the report:\n${r.out}`);
});

test('an empty ledger reports its emptiness rather than a passing grade', () => {
  reset();
  const r = run(['--report']);
  assert.strictEqual(r.code, 0);
  assert.ok(/no registrations yet/.test(r.out), 'must say it is empty');
  assert.ok(/cannot refute/.test(r.out), 'must say emptiness is not evidence the section survives');
});

test('--open lists unscored registrations with their falsifiers', () => {
  reset();
  const id = registerOK('direction', 'the vocabulary collision is the real defect');
  const r = run(['--open']);
  assert.ok(r.out.includes(id), 'the open registration must be listed');
  assert.ok(/falsifier:/.test(r.out), 'the falsifier must be shown — it is what the reader scores against');
});

test('an unknown class is refused rather than filed under a default', () => {
  reset();
  const r = run(['--register', '--class', 'vibes', '--claim', 'this one feels structural',
    '--falsifier', 'an instrument returns a number contradicting it']);
  assert.strictEqual(r.code, 2);
  assert.ok(/--class/.test(r.err));
});

console.log(`\nread-ledger: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
