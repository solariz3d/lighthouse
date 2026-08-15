// pair-ledger.test.js — every falsifier SHOWN firing, not asserted able to fire.
//
// The evaluate() cases below construct the exact states F1 and C4 name and assert exit 1 with
// the right key — the guard failing on demand. The CLI cases prove the exit code crosses the
// process boundary, because a reader gating on this tool sees the code, not the object. The
// final case runs verify over the REAL seed ledger in the tree: if a quote drifts out of the
// evidence table, this suite goes red rather than the ledger quietly rotting.
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const { evaluate, latencySeconds, validatePair, verifyPairs, loadJsonl } = require('./pair-ledger.js');

const TOOL = path.join(__dirname, 'pair-ledger.js');
const NOW = Date.parse('2026-09-20T00:00:00Z');
const SEASON = 30;
const day = (iso) => iso; // readability marker for fixture dates

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'pairledger-')); }
function jsonl(file, rows) { fs.writeFileSync(file, rows.map((r) => JSON.stringify(r)).join('\n') + '\n'); }

const pairRow = (over) => ({
  id: over.id || 'x#1',
  claim: { quote: 'q', ref: 'doc.md', ts: null, ...(over.claim || {}) },
  correction: { ref: 'doc.md', ts: null, ...(over.correction || {}) },
  caught_by: over.caught_by || 'keeper',
  filed_by: 'test',
  filed_ts: over.filed_ts || day('2026-09-19T00:00:00Z'),
});

// ------------------------------------------------------------------ evaluate() --

test('healthy: reader live, ledger fresh — nothing fires', () => {
  const findings = [{ ts: day('2026-09-19T00:00:00Z'), verdict: 'AGREE' }];
  const pairs = [pairRow({ filed_ts: day('2026-09-19T01:00:00Z') })];
  const r = evaluate(pairs, findings, NOW, SEASON);
  assert.strictEqual(r.code, 0);
  assert.strictEqual(r.fired.length, 0);
});

test('F1 FIRES: reader live 41 days, zero reader-caught pairs curated in season', () => {
  const findings = [
    { ts: day('2026-08-10T00:00:00Z'), verdict: 'AGREE' },
    { ts: day('2026-09-19T00:00:00Z'), verdict: 'AGREE' },
  ];
  const pairs = [pairRow({ caught_by: 'keeper', filed_ts: day('2026-09-19T00:00:00Z') })]; // fresh, so C4 stays quiet
  const r = evaluate(pairs, findings, NOW, SEASON);
  assert.strictEqual(r.code, 1);
  assert.deepStrictEqual(r.fired.map((f) => f.key), ['F1']);
  assert.match(r.fired[0].msg, /DELETE THE READER/);
});

test('C4 FIRES: reader operating, pair ledger unmaintained past a season', () => {
  const findings = [{ ts: day('2026-09-19T00:00:00Z'), verdict: 'DISAGREE' }]; // age 1d — F1 stays quiet
  const pairs = [pairRow({ filed_ts: day('2026-08-01T00:00:00Z') })];          // 50 days stale
  const r = evaluate(pairs, findings, NOW, SEASON);
  assert.strictEqual(r.code, 1);
  assert.deepStrictEqual(r.fired.map((f) => f.key), ['C4']);
  assert.match(r.fired[0].msg, /unfalsifiable/);
});

test('C4 FIRES on a ledger that has never been filed to at all', () => {
  const findings = [{ ts: day('2026-09-19T00:00:00Z'), verdict: 'AGREE' }];
  const r = evaluate([], findings, NOW, SEASON);
  assert.strictEqual(r.code, 1);
  assert.deepStrictEqual(r.fired.map((f) => f.key), ['C4']);
});

test('both fire together when both conditions hold', () => {
  const findings = [
    { ts: day('2026-08-10T00:00:00Z'), verdict: 'AGREE' },
    { ts: day('2026-09-19T00:00:00Z'), verdict: 'AGREE' },
  ];
  const pairs = [pairRow({ filed_ts: day('2026-08-01T00:00:00Z') })];
  const r = evaluate(pairs, findings, NOW, SEASON);
  assert.deepStrictEqual(r.fired.map((f) => f.key).sort(), ['C4', 'F1']);
});

test('no premature F1: reader only 5 days old with zero catches is healthy', () => {
  const findings = [{ ts: day('2026-09-15T00:00:00Z'), verdict: 'AGREE' }];
  const pairs = [pairRow({ filed_ts: day('2026-09-16T00:00:00Z') })];
  assert.strictEqual(evaluate(pairs, findings, NOW, SEASON).code, 0);
});

test('a curated reader-caught pair inside the season keeps F1 quiet', () => {
  const findings = [
    { ts: day('2026-08-01T00:00:00Z'), verdict: 'DISAGREE' },
    { ts: day('2026-09-19T00:00:00Z'), verdict: 'AGREE' },
  ];
  const pairs = [pairRow({ id: 'r#1', caught_by: 'reader', filed_ts: day('2026-09-10T00:00:00Z') })];
  assert.strictEqual(evaluate(pairs, findings, NOW, SEASON).code, 0);
});

test('not evaluable, loudly: findings ledger absent → code 2; empty → code 2', () => {
  assert.strictEqual(evaluate([], null, NOW, SEASON).code, 2);
  assert.strictEqual(evaluate([], [], NOW, SEASON).code, 2);
});

// --------------------------------------------------------- latency and schema --

test('latency computed from refs at read time: #12-shaped pair → 132s exact', () => {
  const p = pairRow({
    claim: { quote: 'q', ref: 'doc.md', ts: '2026-08-15T11:16:05Z', approx: false },
    correction: { ref: 'doc.md', ts: '2026-08-15T11:18:17Z', approx: false },
  });
  const l = latencySeconds(p);
  assert.strictEqual(l.seconds, 132);
  assert.strictEqual(l.approx, false);
});

test('a missing timestamp yields null WITH its reason, never a guess', () => {
  const l = latencySeconds(pairRow({ claim: { quote: 'q', ref: 'doc.md', ts: '2026-08-15T11:16:05Z' } }));
  assert.strictEqual(l.seconds, null);
  assert.match(l.why, /correction ts not preserved/);
});

test('validatePair rejects an out-of-vocabulary catcher and a duplicate id', () => {
  assert.ok(validatePair(pairRow({ caught_by: 'somebody' }), new Set()).some((e) => /vocabulary/.test(e)));
  assert.ok(validatePair(pairRow({ id: 'dup' }), new Set(['dup'])).some((e) => /duplicate/.test(e)));
});

// ------------------------------------------------- the exit code crosses the CLI --

test('CLI: F1 state exits 1; absent findings exits 2 — the code a gating reader sees', () => {
  const d = tmp();
  const pairsFile = path.join(d, 'pairs.jsonl');
  const findingsFile = path.join(d, 'findings.jsonl');
  jsonl(pairsFile, [pairRow({ filed_ts: day('2026-09-19T00:00:00Z') })]);
  jsonl(findingsFile, [{ ts: day('2026-08-10T00:00:00Z'), verdict: 'AGREE' }, { ts: day('2026-09-19T00:00:00Z'), verdict: 'AGREE' }]);
  const args = ['check', '--pairs', pairsFile, '--sourced', path.join(d, 'nope.jsonl'), '--now', '2026-09-20T00:00:00Z', '--season', '30'];
  const fired = spawnSync('node', [TOOL, ...args, '--findings', findingsFile], { encoding: 'utf8' });
  assert.strictEqual(fired.status, 1);
  assert.match(fired.stdout, /F1 FURNITURE/);
  const absent = spawnSync('node', [TOOL, ...args, '--findings', path.join(d, 'missing.jsonl')], { encoding: 'utf8' });
  assert.strictEqual(absent.status, 2);
  assert.match(absent.stdout, /READER LEDGER ABSENT/);
});

// -------------------------------------------------------------------- verify --

test('verify flags a quote its ref does not contain, and a missing ref path', () => {
  const root = tmp();
  fs.writeFileSync(path.join(root, 'doc.md'), 'the truth **is** here\n');
  const ok = pairRow({ id: 'v#1', claim: { quote: 'the truth is here', ref: 'doc.md' } });
  const badQuote = pairRow({ id: 'v#2', claim: { quote: 'never written', ref: 'doc.md' } });
  const badPath = pairRow({ id: 'v#3', claim: { quote: 'x', ref: 'gone.md' } });
  const problems = verifyPairs([ok, badQuote, badPath], root);
  assert.ok(problems.some((p) => /v#2.*not found/.test(p)));
  assert.ok(problems.some((p) => /v#3.*path missing/.test(p)));
  assert.ok(!problems.some((p) => /v#1/.test(p)));
});

test('the REAL seed ledger verifies against the tree: 16 pairs, every quote walks', () => {
  const root = path.resolve(__dirname, '..', '..');
  const pairs = loadJsonl(path.join(root, 'exo_memory', 'loop', 'pair_ledger.jsonl'));
  assert.ok(pairs && pairs.length === 16, `expected 16 seed pairs, got ${pairs && pairs.length}`);
  const problems = verifyPairs(pairs, root);
  assert.deepStrictEqual(problems, []);
  const computable = pairs.map(latencySeconds).filter((l) => l.seconds != null);
  assert.strictEqual(computable.length, 1); // the honest baseline: one pair with both ends preserved
  assert.strictEqual(computable[0].seconds, 132);
});
