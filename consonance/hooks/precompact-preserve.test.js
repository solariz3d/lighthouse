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

test('the ledger honours CONSONANCE_DATA, so a generic harness cannot pollute production', () => {
  // Added after this hook wrote 112 test rows into the production ledger. dream-gate.test.js
  // spawns every hook with CONSONANCE_DATA set and cannot know each hook's private env var, so a
  // hook that honours only its private override is unsafe under any generic harness. The failure
  // is invisible in the worst way: the pollution looks exactly like the activity being counted.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcp-data-'));
  run({ trigger: 'manual', session_id: 'seam' }, { CONSONANCE_DATA: dir });
  const led = path.join(dir, 'precompact.jsonl');
  assert.ok(fs.existsSync(led), 'CONSONANCE_DATA must redirect the ledger');
  const rows = fs.readFileSync(led, 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].session_id, 'seam');
});

test('the specific override still wins over CONSONANCE_DATA', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcp-both-'));
  const explicit = path.join(dir, 'explicit.jsonl');
  run({ trigger: 'manual', session_id: 'both' }, { CONSONANCE_DATA: dir, CONSONANCE_PRECOMPACT_LOG: explicit });
  assert.ok(fs.existsSync(explicit), 'the explicit path must take precedence');
  assert.strictEqual(fs.existsSync(path.join(dir, 'precompact.jsonl')), false,
    'and must not also write the data-dir default');
});

// ── D245 items 1 and 2 (pane C, 2026-10-05; exo_memory/handback/p-compact-C_2026-10-05.md) ──
// The OLD directive (b6fff168..0d6faf70), pinned by sha256 per trigger: a build seat's output must be byte-identical to it except for the ONE
// new line, item 6. The hashes were taken from the installed hook BEFORE the change (its byte-identical backup is beside the hand-back).
const crypto = require('node:crypto');
const OLD_SHA = {
  manual: '0a5872ed020d096f6f2fb5cd8c9a3b15fbf580385140dff03b19a48663d55f38',
  auto: '3bdc67c874bef066c5993a89ab2b07d806a6b145d5913049f4efcb8317fb2864',
  unknown: '1e99447c486f7235ad42b163cce33930ffbf9a82953c64c86e37c5c519a11c22',
};
const ITEM6 = '6. VERBATIM and quoted, every sentence of the assistant\'s that the user answered with a correction or an agreement.\n';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const TP = [String.raw`C:\Consonance\instances\third-place`, 'C:\\Consonance\\instances\\third-place\\', 'C:/Consonance/instances/third-place',
  'c:/consonance/instances/third-place/', String.raw`C:\Consonance\instances\third-place\.`];
const BUILD = [String.raw`C:\Consonance\instances\main`, String.raw`C:\Consonance\instances\librarian`, String.raw`C:\Consonance\instances\sibling-0845a868`,
  String.raw`C:\Consonance\instances\third-placement`, String.raw`C:\Consonance\instances\third_place`, String.raw`C:\x\my third-place`, 'third-place', undefined];

test('item 1: EVERY seat gets item 6, and a build seat\'s directive is byte-identical to the old one except that line (all three triggers)', () => {
  for (const cwd of BUILD) for (const trigger of ['manual', 'auto', undefined]) {
    const out = run({ trigger, cwd, session_id: 's' }, { CONSONANCE_DATA: fs.mkdtempSync(path.join(os.tmpdir(), 'ppC-')) });
    const parsed = JSON.parse(out), text = parsed.additionalContext;
    assert.strictEqual(text.split(ITEM6).length - 1, 1, `item 6 once, cwd ${cwd}`);
    assert.strictEqual(sha(text.replace(ITEM6, '')), OLD_SHA[trigger || 'unknown'], `the rest is the old directive, byte for byte: cwd ${cwd}, trigger ${trigger}`);
    assert.strictEqual(out, JSON.stringify({ additionalContext: text, suppressOutput: true }), 'and the stdout shape is unchanged');
  }
});

test('item 2: the Third Place\'s seat (every spelling, path-normalised as board-digest does) gets the "alive for them" section FIRST, then the same directive', () => {
  for (const cwd of TP) {
    const text = JSON.parse(run({ trigger: 'auto', cwd }, { CONSONANCE_DATA: fs.mkdtempSync(path.join(os.tmpdir(), 'ppC-')) })).additionalContext;
    const lines = text.split('\n');
    assert.match(lines[3], /^0\. FIRST, at the very top of the summary/, `cwd ${cwd}`);
    assert.ok(text.includes('"What is alive for them right now"'));
    assert.ok(text.indexOf('What is alive for them') < text.indexOf('1. Every commit sha'), 'above every task-shaped item');
    assert.ok(text.includes(ITEM6), 'and item 6 too');
  }
});

test('the dream gate still wins over both: a dreaming instance gets nothing, on the Third Place\'s cwd too', () => {
  const out = run({ trigger: 'auto', cwd: TP[0] }, { CONSONANCE_DREAM: '1', CONSONANCE_DATA: fs.mkdtempSync(path.join(os.tmpdir(), 'ppC-')) });
  assert.strictEqual(out, '');
});
