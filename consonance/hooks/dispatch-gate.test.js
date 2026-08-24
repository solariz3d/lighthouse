// dispatch-gate.test.js — the pure core in both directions, and the hook as the harness runs it:
// JSON on stdin, exit code and stdout observed.
// Run: node --test consonance/hooks/dispatch-gate.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { spawnSync } = require('child_process');
const { findCitation, DISPATCH_VERBS } = require('./dispatch-gate.js');

const HOOK = path.join(__dirname, 'dispatch-gate.js');

// fixtures for the injected lookups — no repo, no git, so both directions are pinnable
const exists = (p) => p === 'exo_memory/librarian/2026-08-24.md' || p === 'consonance/src-tauri/src/main.rs';
const shaOk = (s) => s === '3d33713' || s === '0a7ac2b';

function runHook(payload) {
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(payload), encoding: 'utf8' });
  return { status: r.status, stdout: (r.stdout || '').trim() };
}

function decision(out) {
  if (!out) return null;
  return JSON.parse(out).hookSpecificOutput.permissionDecision;
}

// ── the pure core ────────────────────────────────────────────────────────────

test('a dispatch citing a real commit routes an object', () => {
  assert.strictEqual(findCitation('landed as 3d33713, read the message', exists, shaOk), 'sha');
});

test('a dispatch citing a repo path routes an object', () => {
  assert.strictEqual(
    findCitation('the packets are at exo_memory/librarian/2026-08-24.md', exists, shaOk), 'path');
});

// the house citation format is path:line — if that did not count, every correctly-cited dispatch
// in this repo's history would be asked about, and the gate would be trained past within a night
test('the path:line citation format counts', () => {
  assert.strictEqual(findCitation('see consonance/src-tauri/src/main.rs:4818', exists, shaOk), 'path');
});

test('prose with no citation is caught, however long and however confident', () => {
  const essay = 'Your intake puts THE SHELF before THE ROOM it indexes, and the test asserts the '
    + 'opposite ordering. I did not fix it because burying a red inside my commit is how a red sits '
    + 'unwatched. It is on the table.';
  assert.strictEqual(findCitation(essay, exists, shaOk), null);
});

// the exact 2026-08-24 failure, as a fixture: fluent, specific, technically detailed, and citing
// nothing that can be opened
test('a sha-shaped string that does not resolve is not a citation', () => {
  assert.strictEqual(findCitation('fixed in d4e8f21', exists, shaOk), null,
    'an invented sha was handed over as a citation once already — it must not satisfy this gate');
});

test('a path-shaped string that does not exist is not a citation', () => {
  assert.strictEqual(findCitation('see exo_memory/loop/does_not_exist.md', exists, shaOk), null);
});

test('the interrupt carve-out is explicit and lands in the text the receiver reads', () => {
  assert.strictEqual(findCitation('[interrupt] stop, you are about to clobber the branch', exists, shaOk),
    'interrupt');
});

test('empty and non-string text never throw', () => {
  assert.strictEqual(findCitation('', exists, shaOk), null);
  assert.strictEqual(findCitation(undefined, exists, shaOk), null);
  assert.strictEqual(findCitation(null, exists, shaOk), null);
});

// ── the hook as the harness runs it ──────────────────────────────────────────

test('an uncited dispatch is ASKED, not blocked', () => {
  const out = runHook({ tool_name: 'mcp__consonance__chair_inject',
    tool_input: { target: 'LIB', text: 'a confident paragraph citing nothing at all' } });
  assert.strictEqual(out.status, 0, 'the hook must never fail the turn');
  assert.strictEqual(decision(out.stdout), 'ask');
});

test('the question names the cost rather than reciting a rule', () => {
  const out = runHook({ tool_name: 'mcp__consonance__chair_inject',
    tool_input: { target: 'LIB', text: 'no citation here' } });
  const why = JSON.parse(out.stdout).hookSpecificOutput.permissionDecisionReason;
  assert.ok(/un-revisable/.test(why), 'it must say why it cannot be taken back');
  assert.ok(/wrong ruling/.test(why), 'and name the measured consequence');
  assert.ok(/\[interrupt\]/.test(why), 'and tell the reader how to proceed deliberately');
});

test("the librarian's verb is gated too, and the question addresses the right seat", () => {
  const out = runHook({ tool_name: 'mcp__consonance__call_chair',
    tool_input: { text: 'plan is ready, pull it' } });
  assert.strictEqual(decision(out.stdout), 'ask');
  assert.ok(/the orchestrator/.test(JSON.parse(out.stdout).hookSpecificOutput.permissionDecisionReason));
});

test('every other tool passes untouched — this gate has exactly two verbs', () => {
  for (const verb of ['Bash', 'Edit', 'mcp__consonance__post_board', 'mcp__consonance__raise_pull']) {
    const out = runHook({ tool_name: verb, tool_input: { text: 'no citation' } });
    assert.strictEqual(out.stdout, '', `${verb} must not be gated`);
    assert.strictEqual(out.status, 0);
  }
  assert.strictEqual(DISPATCH_VERBS.size, 2);
});

// raise_pull is the human-gated path; gating it too would put two questions in front of one act
test('raise_pull is deliberately not a dispatch verb', () => {
  assert.ok(!DISPATCH_VERBS.has('mcp__consonance__raise_pull'));
});

test('malformed stdin fails OPEN — a gate that breaks a dispatch is worse than none', () => {
  const r = spawnSync(process.execPath, [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual((r.stdout || '').trim(), '');
});

test('a payload with no tool_input fails OPEN', () => {
  const out = runHook({ tool_name: 'mcp__consonance__chair_inject' });
  assert.strictEqual(out.status, 0);
  assert.strictEqual(decision(out.stdout), 'ask',
    'no text is no citation — it asks, but it must not crash');
});
