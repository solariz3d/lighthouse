// jev/test/prompt.test.js — node --test jev/test/prompt.test.js
//
// The module's own behaviour, SELF-CONTAINED: nothing here reads the Consonance repo, so it runs in the standalone repo too.
// Byte-parity with the room lives in prompt.parity.test.js.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const P = require('../lib/prompt.js');

const JEV = path.resolve(__dirname, '..');
let n = 0;
function transcript(rows) {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'jev-prompt-')), `t${++n}.jsonl`);
  fs.writeFileSync(f, rows.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n') + '\n');
  return f;
}
const user = (content) => ({ type: 'user', message: { role: 'user', content } });
const asst = (content) => ({ type: 'assistant', message: { role: 'assistant', content } });
const text = (t) => [{ type: 'text', text: t }];

test('narrowedView: the last assistant move with text, and the user message before it', () => {
  const v = P.narrowedView(transcript([user('first question'), asst(text('first answer')), user('second question'), asst(text('second answer'))]));
  assert.deepStrictEqual(v, { assistant_move: 'second answer', user_context: 'second question' });
});

test('narrowedView: a tool-result-only user row is skipped for the real human text before it', () => {
  const v = P.narrowedView(transcript([user('the real ask'), asst([{ type: 'tool_use', id: 'x', name: 'Bash', input: {} }]),
    user([{ type: 'tool_result', tool_use_id: 'x', content: 'out' }]), asst(text('done'))]));
  assert.deepStrictEqual(v, { assistant_move: 'done', user_context: 'the real ask' });
});

test('narrowedView: no assistant text → null; a missing file → null', () => {
  assert.strictEqual(P.narrowedView(transcript([user('only a question')])), null);
  assert.strictEqual(P.narrowedView(path.join(os.tmpdir(), 'jev-no-such-transcript.jsonl')), null);
  assert.strictEqual(P.narrowedView(null), null);
});

test('narrowedView: no user message → user_context null', () => {
  assert.deepStrictEqual(P.narrowedView(transcript([asst(text('unprompted'))])), { assistant_move: 'unprompted', user_context: null });
});

test('narrowedView: the move is cut at 8000 characters and the user message at 4000', () => {
  const v = P.narrowedView(transcript([user('u'.repeat(5000)), asst(text('m'.repeat(9000)))]));
  assert.deepStrictEqual([v.assistant_move.length, v.user_context.length], [8000, 4000]);
});

test('narrowedView: an unparseable line is skipped, not fatal', () => {
  assert.deepStrictEqual(P.narrowedView(transcript([user('q'), '{not json', asst(text('a'))])), { assistant_move: 'a', user_context: 'q' });
});

test('buildPrompt: the view and the discipline land where the prompt says', () => {
  const p = P.buildPrompt({ view: { user_context: 'THE-USER', assistant_move: 'THE-MOVE' }, discipline: 'THE-RUBRIC' });
  assert.ok(p.indexOf('---\nTHE-RUBRIC\n---') > 0, 'the rubric sits between the --- markers');
  assert.ok(p.indexOf('Most recent user message:\nTHE-USER') > p.indexOf('THE-RUBRIC'));
  assert.ok(p.indexOf('Assistant move to judge:\nTHE-MOVE') > p.indexOf('THE-USER'));
});

test('buildPrompt: no user message says so', () => {
  assert.match(P.buildPrompt({ view: { user_context: null, assistant_move: 'm' }, discipline: 'd' }), /Most recent user message:\n\(no user context available\)/);
});

test('the retracted test ("can\'t lose by saying it", struck 2026-08-30) is in neither the prompt nor the shipped rubric', () => {
  const p = P.buildPrompt({ view: { user_context: 'u', assistant_move: 'm' }, discipline: P.readDiscipline() });
  assert.doesNotMatch(p, /can.?t lose by saying it/i);
  assert.match(p, /If you'd have said it whether or not it were true, it carries no information/);
});

test('jev/METHOD.md: line 1 names the source commit; readDiscipline drops exactly that line', () => {
  const raw = fs.readFileSync(path.join(JEV, 'METHOD.md'), 'utf8');
  assert.match(raw.split('\n')[0], /^<!-- jev: copied from the Consonance repo's METHOD\.md at [0-9a-f]{40} /);
  const d = P.readDiscipline();
  assert.strictEqual(d, raw.slice(raw.indexOf('\n') + 1));
  assert.match(d, /^# The Method\n/);
});

test('readDiscipline: a swapped-in rubric without the provenance line is used whole', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'jev-rubric-')), 'mine.md');
  fs.writeFileSync(f, '<!-- a comment of my own -->\nmy rubric\n');
  assert.strictEqual(P.readDiscipline(f), '<!-- a comment of my own -->\nmy rubric\n');
});

test('DEFAULT_RUBRIC is jev/METHOD.md', () => {
  assert.strictEqual(P.DEFAULT_RUBRIC, path.join(JEV, 'METHOD.md'));
});

test('narrowedView: past 4 MiB, the partial first line of the tail is dropped — even when that fragment is valid JSON', () => {
  // The read starts 4 MiB from the end. Build the file so the start lands exactly on a fragment that is itself a whole,
  // valid assistant row, inside a longer line. That fragment is not a real row and must not be taken as the move (mutant M13).
  const TAIL = 4 * 1024 * 1024;
  const frag = JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: 'A FRAGMENT, NOT A ROW' } });
  const userLine = JSON.stringify(user('the only real question'));
  const rest = userLine + '\n' + 'x'.repeat(TAIL - frag.length - 1 - userLine.length - 2) + '\n';
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'jev-prompt-big-')), 'big.jsonl');
  fs.writeFileSync(f, 'prefix-of-a-longer-line ' + frag + '\n' + rest);
  assert.strictEqual(fs.statSync(f).size - TAIL, Buffer.byteLength('prefix-of-a-longer-line '), 'the fixture must start the tail on the fragment');
  assert.strictEqual(P.narrowedView(f), null);
});
