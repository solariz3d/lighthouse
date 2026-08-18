/* Tests for precompact-preserve.js.
 *
 * The load-bearing property is the OUTPUT SHAPE. `additionalContext` reaches the summarizer only
 * as a ROOT-LEVEL field; the hookSpecificOutput shape the event docs gesture at is rejected by
 * the harness's schema validator, and the rejection is NON-FATAL and INVISIBLE - compaction
 * proceeds, the summary is simply unshaped, and from outside that is indistinguishable from
 * success. So the shape is asserted here rather than trusted, and it is asserted in the negative
 * too: this must NOT emit hookSpecificOutput.
 *
 * Run: node precompact-preserve.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HOOK = path.join(__dirname, 'precompact-preserve.js');
const { instruction, CANARY } = require('./precompact-preserve.js');

function run(payload, env = {}) {
  const out = execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
  return out;
}

test('emits additionalContext at the ROOT, never under hookSpecificOutput', () => {
  const parsed = JSON.parse(run({ trigger: 'manual', session_id: 's1' }));
  assert.strictEqual(typeof parsed.additionalContext, 'string');
  assert.ok(parsed.additionalContext.length > 200, 'the directive must actually be present');
  assert.strictEqual(parsed.hookSpecificOutput, undefined,
    'hookSpecificOutput is rejected by the validator, non-fatally and invisibly');
});

test('the output is a single valid JSON object — a stray log line would break the contract', () => {
  const raw = run({ trigger: 'auto' });
  assert.doesNotThrow(() => JSON.parse(raw));
  assert.strictEqual(raw.trim().indexOf('{'), 0, 'nothing may precede the JSON');
});

test('the canary token is in the directive, so fired-and-ignored can be told from never-fired', () => {
  const parsed = JSON.parse(run({ trigger: 'manual' }));
  assert.match(parsed.additionalContext, new RegExp(CANARY));
});

test('the directive names all five classes B measured, not a vague plea for detail', () => {
  const t = instruction('manual');
  for (const must of ['commit sha', 'denominator', 'FALSIFIER', 'instrument', 'correction']) {
    assert.match(t, new RegExp(must, 'i'), `directive must name: ${must}`);
  }
  // The measured gradient itself belongs in the directive: it is the reason, and a directive
  // without its reason is the same unverifiable instruction this whole hook exists to fight.
  assert.match(t, /3\.5%/, 'the falsifier survival rate is the justification and must be stated');
  assert.match(t, /33\.8%/);
});

test('falsifiers must be demanded VERBATIM — a paraphrased falsifier stops being able to fire', () => {
  const t = instruction('manual');
  // The first version of this test matched /original wording|VERBATIM/i and a mutation proved it
  // vacuous: changing "in its original wording" to "SUMMARISED from its original wording" still
  // matched and the suite stayed green. The assertion has to pin the exact demand, because the
  // whole point is that a loosely restated falsifier can no longer fire.
  // \s+ because the directive is assembled from wrapped lines: "in its original\n   wording".
  assert.match(t, /\bin its original\s+wording\b/,
    'the falsifier clause must demand the original wording, not a derivative of it');
  assert.match(t, /carry forward VERBATIM and in full/,
    'the carry-forward instruction itself must say verbatim');
  assert.doesNotMatch(t, /summaris\w*\s+from|paraphras\w*\s+(them|these|it)\b/i,
    'nothing in the directive may license restating the preserved classes');
});

test('the trigger is carried into the directive, so manual and auto are distinguishable later', () => {
  assert.match(instruction('auto'), /auto/);
  assert.match(instruction('manual'), /manual/);
  assert.match(instruction(undefined), /unknown/, 'a missing trigger must not silently read as manual');
});

test('a malformed payload still produces a valid directive — never block a compaction', () => {
  const out = execFileSync(process.execPath, [HOOK], { input: 'not json at all', encoding: 'utf8' });
  const parsed = JSON.parse(out);
  assert.ok(parsed.additionalContext.length > 200);
  assert.match(parsed.additionalContext, /unknown/);
});

test('every attempt is ledgered, and it is recorded as an ATTEMPT not a compaction', () => {
  // PreCompact fires on aborted compactions too (A observed one with no PostCompact after it),
  // so calling these rows "compactions" would overcount. Completions come from compact_boundary.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcp-'));
  const led = path.join(dir, 'sub', 'precompact.jsonl');
  run({ trigger: 'auto', session_id: 'abc' }, { CONSONANCE_PRECOMPACT_LOG: led });
  const rows = fs.readFileSync(led, 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].event, 'precompact-attempt');
  assert.strictEqual(rows[0].trigger, 'auto');
  assert.strictEqual(rows[0].session_id, 'abc');
  assert.strictEqual(rows[0].canary, CANARY);
});

test('an unwritable ledger does not stop the directive — the hook must never block a compaction', () => {
  const bad = process.platform === 'win32' ? 'Z:\\nope\\precompact.jsonl' : '/proc/nope/x.jsonl';
  const parsed = JSON.parse(run({ trigger: 'manual' }, { CONSONANCE_PRECOMPACT_LOG: bad }));
  assert.ok(parsed.additionalContext.length > 200, 'directive must survive a ledger failure');
});
