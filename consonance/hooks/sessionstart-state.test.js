/* Tests for sessionstart-state.js.
 *
 * The load-bearing properties, each learned the hard way:
 *   * it emits the SessionStart shape (hookSpecificOutput), not PreCompact's root-level shape —
 *     pane A proved the two events differ and that guessing wrong fails invisibly;
 *   * it fires on source=compact AND on spawn sources, because one file serves both;
 *   * it stays silent on sources it does not serve, without that silence looking like a failure;
 *   * a missing generator REPORTS rather than emitting nothing, since a silent absence is
 *     indistinguishable from a healthy quiet room.
 *
 * Run: node sessionstart-state.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const HOOK = path.join(__dirname, 'sessionstart-state.js');
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));

function run(payload, env = {}) {
  return execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    env: { ...process.env, CONSONANCE_DATA: env.CONSONANCE_DATA || tmp('sss-'), ...env },
    encoding: 'utf8',
  });
}

test('emits the SessionStart shape — hookSpecificOutput, NOT PreCompact’s root-level field', () => {
  // A established the two events do not share a shape, and that using the wrong one fails
  // silently. So this is asserted in both directions.
  const o = JSON.parse(run({ source: 'compact', session_id: 's' }));
  assert.strictEqual(o.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.strictEqual(typeof o.hookSpecificOutput.additionalContext, 'string');
  assert.strictEqual(o.additionalContext, undefined, 'the root-level field is PreCompact’s, not this one');
});

test('fires on source=compact — the case the whole plan exists for', () => {
  const o = JSON.parse(run({ source: 'compact' }));
  assert.match(o.hookSpecificOutput.additionalContext, /source=compact/);
  assert.match(o.hookSpecificOutput.additionalContext, /state-block: machine-generated/);
});

test('the DEFAULT is compact only — spawn sources are skipped until the cost is measured', () => {
  // The hook can serve startup/resume (the carrier problem proper) but that costs ~1.2KB of
  // context at EVERY session start across every pane. Registered 2026-08-18 at the case the plan
  // exists for; widening is one env var and should follow a measurement, not an assumption.
  for (const src of ['startup', 'resume']) {
    assert.strictEqual(run({ source: src }).trim(), '', `${src} must be skipped by default`);
  }
});

test('but it CAN serve spawn sources — one file covers both, when widened', () => {
  for (const src of ['startup', 'resume']) {
    const o = JSON.parse(run({ source: src }, { CONSONANCE_STATE_SOURCES: 'compact,startup,resume' }));
    assert.match(o.hookSpecificOutput.additionalContext, new RegExp('source=' + src));
  }
});

test('stays SILENT on a source it does not serve, and records why', () => {
  const data = tmp('sss-skip-');
  const out = run({ source: 'clear' }, { CONSONANCE_DATA: data });
  assert.strictEqual(out.trim(), '', 'an unserved source must emit nothing at all');
  const rows = fs.readFileSync(path.join(data, 'sessionstart-state.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(rows[0].event, 'skipped');
  assert.strictEqual(rows[0].source, 'clear');
  assert.match(rows[0].reason, /not in/, 'silence must be explained in the ledger, not merely happen');
});

test('the served set is configurable, so it can be narrowed without editing code', () => {
  const out = run({ source: 'startup' }, { CONSONANCE_STATE_SOURCES: 'compact' });
  assert.strictEqual(out.trim(), '', 'startup must be skipped when the set is narrowed to compact');
});

test('a MISSING generator reports FAILED rather than emitting nothing', () => {
  // Silence here would be indistinguishable from a healthy quiet room — the exact failure this
  // repo keeps finding under rocks.
  // The first version of this test pointed the override at a nonexistent path and asserted only
  // that "something" came back — but the resolver falls through to a real generator, so it proved
  // nothing. Force the failure with a generator that EXISTS and exits non-zero, which is the
  // realistic break (a syntax error, a missing dependency, a mid-edit file).
  const dir = tmp('sss-badgen-');
  const bad = path.join(dir, 'boom.js');
  fs.writeFileSync(bad, 'process.exit(3);\n');
  const o = JSON.parse(run({ source: 'compact' }, { CONSONANCE_STATE_BLOCK: bad }));
  const ctx = o.hookSpecificOutput.additionalContext;
  assert.match(ctx, /state-block FAILED/, 'a broken generator must be reported inside the block');
  assert.match(ctx, /source=compact/, 'and the block must still be emitted, not swallowed');
});

test('a failed generator is recorded as failed in the ledger, not as a clean emit', () => {
  const data = tmp('sss-failled-');
  const dir = tmp('sss-badgen2-');
  const bad = path.join(dir, 'boom.js');
  fs.writeFileSync(bad, 'process.exit(3);\n');
  run({ source: 'compact' }, { CONSONANCE_DATA: data, CONSONANCE_STATE_BLOCK: bad });
  const rows = fs.readFileSync(path.join(data, 'sessionstart-state.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(rows[0].failed, true, 'the ledger must distinguish a failed block from a good one');
});

test('a malformed payload does not break a session start', () => {
  const out = execFileSync(process.execPath, [HOOK], {
    input: 'not json', env: { ...process.env, CONSONANCE_DATA: tmp('sss-bad-') }, encoding: 'utf8',
  });
  assert.strictEqual(out.trim(), '', 'no source means no emission, and no crash');
});

test('the emitted block is ledgered with its size and whether it failed', () => {
  const data = tmp('sss-led-');
  run({ source: 'compact' }, { CONSONANCE_DATA: data });
  const rows = fs.readFileSync(path.join(data, 'sessionstart-state.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(rows[0].event, 'emitted');
  assert.strictEqual(rows[0].source, 'compact');
  assert.ok(rows[0].chars > 100);
  assert.strictEqual(rows[0].failed, false, 'the live generator must not be reporting FAILED');
});
