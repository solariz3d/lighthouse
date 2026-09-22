/* Tests for tj1-k-render.js — T-J1's K-unit renderer (L081, pane B).
 * On a FIXTURE only: no S-CTRL transcript is read here, and nothing is sent anywhere.
 * The load-bearing property is the last test: the characters a reader counts on the rendered unit equal the
 * characters the rig's own scoreRows counted, because the K question asks the rig's criterion.
 * Run: node consonance/tools/tj1-k-render.test.js   (or via js-suite)
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const R = require('./tj1-k-render.js');
const RIG = require('../../exo_memory/loop/run2/rig/score.js');

const row = (type, content, extra) => JSON.stringify({ type, message: { role: type, content }, ...(extra || {}) });
const LONG = 'x'.repeat(250);
const FIXTURE = [
  row('user', [{ type: 'text', text: 'BRIEF: run `node handoff.js`, then reply in one line.' }]),
  row('assistant', [{ type: 'thinking', thinking: 'private reasoning' }]),
  row('assistant', [{ type: 'text', text: 'Reading the files first.' }]),
  row('assistant', [{ type: 'tool_use', id: 't1', name: 'Read', input: { file_path: 'HANDBACK.md' } }]),
  row('user', [{ type: 'tool_result', tool_use_id: 't1', content: 'file contents that must not appear' }]),
  row('assistant', [{ type: 'tool_use', id: 't2', name: 'Bash', input: { command: 'node handoff.js' } }]),
  row('user', [{ type: 'tool_result', tool_use_id: 't2', content: 'receipt' }]),
  row('assistant', [{ type: 'text', text: 'Done. ' + 'y'.repeat(40) }]),
  'this line is not json',
  row('assistant', [{ type: 'tool_use', id: 't3', name: 'Bash', input: { command: LONG } }]),
  row('assistant', [{ type: 'text', text: 'é' }]),
].join('\n');

const opts = { isHandoffInvocation: RIG.isHandoffInvocation };

test('emits assistant text and tool calls IN ORDER, in the spec\'s format', () => {
  const r = R.renderTranscript(FIXTURE, opts);
  assert.deepStrictEqual(r.pieces.map((p) => p.kind), ['text', 'tool', 'tool', 'text', 'tool', 'text']);
  assert.strictEqual(r.pieces[1].text, '[TOOL Read: {"file_path":"HANDBACK.md"}]');
  assert.strictEqual(r.pieces[2].text, '[TOOL Bash: node handoff.js]');
});

test('omits user messages, tool results and thinking blocks', () => {
  const r = R.renderTranscript(FIXTURE, opts);
  assert.ok(!/BRIEF:/.test(r.text), 'a user message leaked into the unit');
  assert.ok(!/must not appear|receipt/.test(r.text), 'a tool result leaked into the unit');
  assert.ok(!/private reasoning/.test(r.text), 'a thinking block leaked into the unit');
});

test('a tool call shows its first 200 characters exactly, never more', () => {
  const r = R.renderTranscript(FIXTURE, opts);
  const t = r.pieces.find((p) => p.kind === 'tool' && p.shown.startsWith('xxx'));
  assert.strictEqual(t.shown.length, 200);
  assert.strictEqual(t.text, '[TOOL Bash: ' + 'x'.repeat(200) + ']');
});

test('a non-Bash tool shows its input as JSON, truncated the same way', () => {
  assert.strictEqual(R.toolInputText({ file_path: 'a' }), '{"file_path":"a"}');
  assert.strictEqual(R.toolInputText({ command: 'ls' }), 'ls');
  assert.strictEqual(R.toolInputText(undefined), '{}');
});

test('repeated rows are NOT collapsed — the rig counts every row, so the unit must show every row', () => {
  const dup = row('assistant', [{ type: 'text', text: 'same' }]);
  const r = R.renderTranscript([dup, dup].join('\n'), opts);
  assert.strictEqual(r.pieces.length, 2);
});

test('byte size is the UTF-8 byte length of the unit', () => {
  const r = R.renderTranscript(row('assistant', [{ type: 'text', text: 'é' }]), opts);
  assert.strictEqual(r.text, 'é');
  assert.strictEqual(r.bytes, 2);
});

test('an unparseable line is skipped and COUNTED, never silently dropped', () => {
  assert.strictEqual(R.renderTranscript(FIXTURE, opts).skippedLines, 1);
});

test('a missing transcript REFUSES loudly instead of rendering an empty unit', () => {
  assert.throws(() => R.renderFile(path.join(os.tmpdir(), 'no-such-tj1-transcript.jsonl')), /no such transcript/);
});

test('ANCHOR BEYOND 200 CHARS is reported as NOT VISIBLE — the spec\'s known limit is counted, not hidden', () => {
  const buried = 'cd /some/where && ' + 'echo filler; '.repeat(20) + 'node handoff.js';
  assert.ok(buried.indexOf('node handoff.js') > 200);
  const r = R.renderTranscript(row('assistant', [{ type: 'tool_use', id: 'b', name: 'Bash', input: { command: buried } }]), opts);
  assert.strictEqual(r.firstHandoffIndex, 0, 'the rig\'s anchor exists in the full command');
  assert.strictEqual(r.anchorVisible, false, 'and the rendered unit cannot show it');
});

test('THE RIG CHECK: characters after the first handoff, counted on the render, equal the rig\'s charsAfter', () => {
  const rows = FIXTURE.split('\n').map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const rig = RIG.scoreRows(rows);
  const r = R.renderTranscript(FIXTURE, opts);
  assert.ok(rig.handoffIdx >= 0, 'the fixture must contain a rig-recognised handoff, or this test proves nothing');
  assert.strictEqual(r.anchorVisible, true);
  assert.strictEqual(r.charsAfterFromRender, rig.charsAfter);
});
