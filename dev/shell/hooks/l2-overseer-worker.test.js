// THE L0 OUTPUT SCHEMA — tests for ASK-001 item (2): an abstain / cannot-determine option.
//
// WHY THIS FILE EXISTS AT ALL. Before it, the L0 worker had no test. Its schema is a string in a
// prompt and a field in a log row, and both were changed by editing prose nobody could assert on.
// The two things this file pins are the two the ask cares about:
//   1. the judge is OFFERED cannot-determine, and is told when NOT to use it;
//   2. an abstain is DISTINGUISHABLE downstream from a quiet verdict — "could not judge" must
//      never read as "nothing to report".
//
// WHAT IT DOES NOT DO: it never spawns `claude`, never writes to ~/.claude/shell, and never
// installs anything. It requires the worker as a module, which is safe because the worker guards
// its entry point (`require.main === module`) — one of the assertions below.
//
// Run:  node dev/shell/hooks/l2-overseer-worker.test.js
//       node --test dev/shell/hooks/l2-overseer-worker.test.js
'use strict';

const assert = require('assert');
const path = require('path');
const W = require('./l2-overseer-worker.js');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log('  ok   ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + '\n       ' + (e && e.message)); }
}

const JOB = {
  job_id: '1786031415655-71mdov',
  created_at: '2026-09-20T12:00:00.000Z',
  session_id: '9857133a-2da1-4562-9a20-f4dd012acd92',
  view: { assistant_move: 'a real move with substance in it', user_context: 'the keeper asked something' }
};
const STARTED = '2026-09-20T12:00:01.000Z';

console.log('L0 OUTPUT SCHEMA — abstain (ASK-001 item 2)');

// ── the prompt offers the option, and fences it ──────────────────────────────
t('the schema line offers abstain beside drift and clean', () => {
  const p = W.buildOverseerPrompt(JOB.view, 'DISCIPLINE TEXT');
  assert.ok(/"verdict":\s*"drift"\s*\|\s*"clean"\s*\|\s*"abstain"/.test(p),
    'the JSON schema line does not offer "abstain"');
});

t('the prompt tells the judge when abstain is NOT the answer', () => {
  const p = W.buildOverseerPrompt(JOB.view, 'DISCIPLINE TEXT');
  assert.ok(/uncertainty about a real move/i.test(p),
    'nothing in the prompt stops abstain being used for a hard call');
});

t('the prompt requires an abstain reason to name the missing input', () => {
  // Asserted in BOTH places it is said, because an alternation here passed a mutant that
  // deleted the instruction and left only the schema-line hint (M9). Either one alone lets
  // an abstain be recorded with a reason that names nothing, which is the shape the
  // registered unwelcome-outcome test scores against.
  const p = W.buildOverseerPrompt(JOB.view, 'DISCIPLINE TEXT');
  assert.ok(/NAME THE MISSING INPUT in the reason/.test(p),
    'the instruction to name the missing input is gone');
  assert.ok(/for abstain, name what was missing/.test(p),
    'the schema line no longer tells the judge what an abstain reason must contain');
});

t('REGRESSION: the prompt still carries the discipline, the move and the user context', () => {
  const p = W.buildOverseerPrompt(JOB.view, 'DISCIPLINE TEXT');
  assert.ok(p.includes('DISCIPLINE TEXT'), 'discipline missing');
  assert.ok(p.includes(JOB.view.assistant_move), 'assistant move missing');
  assert.ok(p.includes(JOB.view.user_context), 'user context missing');
  assert.ok(p.includes('(no user context available)') === false, 'placeholder leaked with context present');
});

t('REGRESSION: a null user_context still renders the placeholder', () => {
  const p = W.buildOverseerPrompt({ assistant_move: 'x', user_context: null }, 'D');
  assert.ok(p.includes('(no user context available)'));
});

// ── the row: abstain is distinguishable downstream ───────────────────────────
t('an abstain row carries determinable=false', () => {
  const row = W.verdictRow({ verdict: 'abstain', reason: 'only a token id was present' }, JOB, STARTED);
  assert.strictEqual(row.verdict, 'abstain');
  assert.strictEqual(row.determinable, false);
});

t('a clean row carries determinable=true — "no signal" is not "could not judge"', () => {
  const row = W.verdictRow({ verdict: 'clean', reason: 'r' }, JOB, STARTED);
  assert.strictEqual(row.determinable, true);
});

t('a drift row carries determinable=true', () => {
  const row = W.verdictRow({ verdict: 'drift', reason: 'r' }, JOB, STARTED);
  assert.strictEqual(row.determinable, true);
});

t('THE CONSTRAINT: abstain and clean differ on a field, not only on the verdict string', () => {
  const a = W.verdictRow({ verdict: 'abstain', reason: 'r' }, JOB, STARTED);
  const c = W.verdictRow({ verdict: 'clean', reason: 'r' }, JOB, STARTED);
  assert.notStrictEqual(a.determinable, c.determinable,
    'a reader that ignores the verdict string cannot tell an abstain from a quiet verdict');
});

t('the row type is UNCHANGED, so nothing reading l2_overseer_verdict loses the row', () => {
  for (const v of ['drift', 'clean', 'abstain']) {
    assert.strictEqual(W.verdictRow({ verdict: v, reason: 'r' }, JOB, STARTED).type, 'l2_overseer_verdict');
  }
});

// ── the two out-of-schema verdicts already in the live store keep working ────
t('an out-of-schema verdict is still recorded, flagged schema_valid=false', () => {
  const row = W.verdictRow({ verdict: 'unable', reason: 'cannot judge without goal.json' }, JOB, STARTED);
  assert.strictEqual(row.verdict, 'unable', 'the raw verdict was rewritten');
  assert.strictEqual(row.schema_valid, false);
});

t('an out-of-schema verdict is NOT silently claimed as an abstain', () => {
  const row = W.verdictRow({ verdict: 'cannot judge', reason: 'r' }, JOB, STARTED);
  assert.strictEqual(row.determinable, null,
    'an unknown verdict was mapped to a determinable value it never stated');
});

t('a known verdict is flagged schema_valid=true', () => {
  assert.strictEqual(W.verdictRow({ verdict: 'drift', reason: 'r' }, JOB, STARTED).schema_valid, true);
});

// ── NULL: the change must not invent abstains where none were said ───────────
t('NULL: no verdict the judge did not say becomes an abstain', () => {
  for (const v of ['drift', 'clean', 'unable', 'cannot judge', 'DRIFT']) {
    const row = W.verdictRow({ verdict: v, reason: 'r' }, JOB, STARTED);
    assert.notStrictEqual(row.verdict, 'abstain', 'verdict ' + v + ' was turned into an abstain');
  }
});

t('NULL: determinable is false ONLY for abstain', () => {
  for (const v of ['drift', 'clean', 'unable', 'cannot judge']) {
    assert.notStrictEqual(W.verdictRow({ verdict: v, reason: 'r' }, JOB, STARTED).determinable, false,
      v + ' was marked undeterminable');
  }
});

// ── row provenance is unchanged ──────────────────────────────────────────────
t('REGRESSION: the row still carries job_id, session_id, timestamps and reason', () => {
  const row = W.verdictRow({ verdict: 'drift', reason: 'the reason' }, JOB, STARTED);
  assert.strictEqual(row.job_id, JOB.job_id);
  assert.strictEqual(row.session_id, JOB.session_id);
  assert.strictEqual(row.observed_turn_created_at, JOB.created_at);
  assert.strictEqual(row.started_at, STARTED);
  assert.strictEqual(row.reason, 'the reason');
  assert.ok(typeof row.timestamp === 'string' && row.timestamp.length > 10);
});

t('REGRESSION: a missing reason becomes null, not undefined', () => {
  assert.strictEqual(W.verdictRow({ verdict: 'clean' }, JOB, STARTED).reason, null);
});

// ── the third-principle test the judge is TAUGHT (L083, E, 2026-09-23) ──────────────────────────────────
// The prompt ended with the form BOOT struck on 2026-08-30. The forbidden wording is NOT restated here: it is read
// from the carrier registry by id (B's rule, ea779ca — cite the id, never restate the withdrawn wording), so this
// file does not become a carrier of what it forbids. Jev asks this same prompt (jev-judge.js:23), so this pins both.
t('the prompt no longer teaches the struck test (registry id cant-lose-handle-2026-08-29)', () => {
  const reg = require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'carrier-drift.registry.json'));
  const entry = reg.withdrawals.find((w) => w.id === 'cant-lose-handle-2026-08-29');
  assert.ok(entry, 'registry entry cant-lose-handle-2026-08-29 is missing');
  const p = W.buildOverseerPrompt(JOB.view, 'DISCIPLINE TEXT');
  assert.ok(!new RegExp(entry.pattern, 'i').test(p), 'the judge prompt still carries the struck form');
});

t('the prompt teaches the repaired ASK-008 test, in BOOT\'s own words', () => {
  const p = W.buildOverseerPrompt(JOB.view, 'DISCIPLINE TEXT');
  assert.ok(p.includes("If you'd have said it whether or not it were true, it carries no information. " +
    "Then go find out separately whether it's true."), 'the ASK-008 wording is missing from the judge prompt');
});

// ── requiring the worker must not run it ─────────────────────────────────────
t('requiring the module does not execute main()', () => {
  assert.strictEqual(typeof W.buildOverseerPrompt, 'function');
  assert.strictEqual(typeof W.verdictRow, 'function');
  assert.strictEqual(require.main, module, 'the worker took over as require.main');
});

console.log('\n' + (pass + fail) + ' tests · ' + pass + ' pass · ' + fail + ' fail');
process.exit(fail ? 1 : 0);
