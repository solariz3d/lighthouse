'use strict';
// mistake-bench.test.js (seat A, D311 part 2): the replay bench's pure parts and its model call, with the call replaced by a stub runner.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const B = require('./mistake-bench.js');
const scratch = require('./scratch.js');

const T0 = Date.parse('2026-09-16T14:00:00Z');
const iso = (min, sec = 0) => new Date(T0 + min * 60000 + sec * 1000).toISOString();
const TOKEN_FIELD = '"tok' + 'en"';   // assembled: the line below must look like a chair verb's argument without this file spelling a real one
let seq = 0;
const line = (o) => JSON.stringify({ uuid: 'u' + ++seq, isSidechain: false, ...o });
const prompt = (min, text) => line({ type: 'user', timestamp: iso(min), message: { role: 'user', content: text } });
const say = (min, text, model = 'claude-opus-5-5', sec = 0) => line({ type: 'assistant', timestamp: iso(min, sec), message: { role: 'assistant', model, content: [{ type: 'text', text }] } });
const call = (min, name, input, id) => line({ type: 'assistant', timestamp: iso(min), message: { role: 'assistant', model: 'claude-opus-5-5', content: [{ type: 'tool_use', id, name, input }] } });
const result = (min, id, text) => line({ type: 'user', timestamp: iso(min), message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: text }] } });
const compact = (min, text) => line({ type: 'user', isCompactSummary: true, timestamp: iso(min), message: { role: 'user', content: text } });

function fixture(lines) {
  const dir = scratch.mkdtemp('mistake-bench-');
  const file = path.join(dir, 's.jsonl');
  fs.writeFileSync(file, lines.join('\n') + '\n');
  return { dir, file };
}
const unitAt = (claimMin, sec = 0) => ({ id: 'U1', seat: 'lib', turnStartMs: T0 + 10 * 60000, claimMs: T0 + claimMin * 60000 + sec * 1000 });

test('the context stops before the claim message and holds neither it nor anything after', () => {
  const { file } = fixture([
    prompt(0, 'earlier prompt'), say(1, 'earlier reply'),
    prompt(10, 'the erring prompt'), call(11, 'Bash', { command: 'ls' }, 'c1'), result(11, 'c1', 'file-a file-b'),
    say(12, 'THE WRONG CLAIM there are 3 files'), say(13, 'after the claim'),
  ]);
  const ev = B.readEvents(file, T0 + 12 * 60000 + 1500);
  const ctx = B.buildContext(ev, unitAt(12));
  const all = ctx.history.concat(ctx.turn).join('\n');
  assert.ok(all.includes('the erring prompt') && all.includes('file-a file-b'));
  assert.ok(!all.includes('THE WRONG CLAIM') && !all.includes('after the claim'));
  assert.strictEqual(ctx.stop.text, 'THE WRONG CLAIM there are 3 files');
});

test('a claim that sits in a tool call stops the context before that call, and the stop says it was a call', () => {
  const { file } = fixture([prompt(10, 'p'), say(11, 'a note'), call(12, 'Bash', { command: 'echo THE WRONG CLAIM in a file' }, 'c1'), result(12, 'c1', 'done')]);
  const ctx = B.buildContext(B.readEvents(file, T0 + 12 * 60000 + 1500), unitAt(12));
  assert.ok(ctx.stop.kind.startsWith('CALL ') && ctx.stop.text.includes('THE WRONG CLAIM'));
  const turn = ctx.turn.join(' | ');
  assert.ok(!turn.includes('THE WRONG CLAIM') && turn.includes('a note'));
});

test('the context starts at the last compaction summary before the turn, and earlier events are absent', () => {
  const { file } = fixture([
    prompt(0, 'ancient prompt'), say(1, 'ancient reply'), compact(5, 'SUMMARY OF THE ANCIENT PAST'),
    prompt(6, 'after the compaction'), say(7, 'a reply after it'),
    prompt(10, 'the erring prompt'), say(12, 'claim'),
  ]);
  const ctx = B.buildContext(B.readEvents(file, T0 + 12 * 60000 + 1500), unitAt(12));
  assert.strictEqual(ctx.summary, 'SUMMARY OF THE ANCIENT PAST');
  const all = ctx.history.concat(ctx.turn).join('\n');
  assert.ok(!all.includes('ancient prompt') && all.includes('after the compaction') && all.includes('a reply after it'));
});

test('a Third Place line and a token field never reach the prompt', () => {
  const { file } = fixture([
    prompt(10, 'the erring prompt\nthe third place says hello\nnormal line'),
    call(11, 'Bash', { command: 'x' }, 'c1'), result(11, 'c1', `{${TOKEN_FIELD}: "SECRETVALUE"}`),
    say(12, 'claim'),
  ]);
  const ctx = B.buildContext(B.readEvents(file, T0 + 12 * 60000 + 1500), unitAt(12));
  const all = ctx.history.concat(ctx.turn).join('\n');
  assert.ok(all.includes('normal line') && all.includes('[third-place line removed]'));
  assert.ok(!/third place says/i.test(all) && !all.includes('SECRETVALUE'));
});

test('a long tool result is cut with a marker, and a history over budget drops its oldest events first and says how many', () => {
  const long = 'x'.repeat(9000);
  const lines = [compact(0, 'S')];
  for (let i = 1; i <= 6; i++) lines.push(prompt(i, 'history prompt number ' + i + ' ' + 'p'.repeat(500)));
  lines.push(prompt(10, 'the erring prompt'), call(11, 'Bash', { command: 'big' }, 'c1'), result(11, 'c1', long), say(12, 'claim'));
  const { file } = fixture(lines);
  const ctx = B.buildContext(B.readEvents(file, T0 + 12 * 60000 + 1500), unitAt(12), { historyChars: 1500, resultChars: 400 });
  const turn = ctx.turn.join('\n');
  assert.ok(turn.includes('[+8600 chars cut]') && !turn.includes('x'.repeat(401)));
  assert.ok(ctx.stats.historyDropped >= 4, 'dropped ' + ctx.stats.historyDropped);
  assert.ok(ctx.history.join('\n').includes('history prompt number 6') && !ctx.history.join('\n').includes('history prompt number 1 '));
  assert.ok(ctx.history[0].startsWith('[earlier history cut:'));
});

test('the unit model is the model of the last assistant message at or before the claim', () => {
  const { file } = fixture([prompt(10, 'p'), say(11, 'a', 'claude-fable-5-1'), say(12, 'claim', 'claude-opus-5-5'), say(13, 'late', 'claude-sonnet-5-5')]);
  const ctx = B.buildContext(B.readEvents(file, T0 + 12 * 60000 + 1500), unitAt(12));
  assert.strictEqual(ctx.model, 'claude-opus-5-5');
});

test('an arm text is placed once, labelled, before the closing instruction; the baseline has none', () => {
  const { file } = fixture([prompt(10, 'p'), say(12, 'claim')]);
  const ctx = B.buildContext(B.readEvents(file, T0 + 12 * 60000 + 1500), unitAt(12));
  const base = B.renderPrompt(ctx, null, 'baseline');
  const arm = B.renderPrompt(ctx, 'FRESH FACT: 4 files', 'F1');
  assert.ok(!base.prompt.includes('FRESH FACT') && !base.prompt.includes('[added context'));
  assert.strictEqual(arm.prompt.split('FRESH FACT').length - 1, 1);
  assert.ok(arm.prompt.indexOf('[added context: F1]') < arm.prompt.indexOf(B.INSTRUCTION));
  assert.ok(arm.prompt.trimEnd().endsWith(B.INSTRUCTION));
  assert.notStrictEqual(base.sha, arm.sha);
});

test('pickUnits is fixed by the seed, differs under another seed, and skips a unit with no claim time', () => {
  const units = Array.from({ length: 20 }, (_, i) => ({ id: 'W' + String(i).padStart(3, '0'), claimMs: i === 3 ? null : 1 }));
  const a = B.pickUnits(units, 'seed-one', 3), b = B.pickUnits(units, 'seed-one', 3), c = B.pickUnits(units, 'seed-two', 3);
  assert.deepStrictEqual(a.map((u) => u.id), b.map((u) => u.id));
  assert.notDeepStrictEqual(a.map((u) => u.id), c.map((u) => u.id));
  assert.ok(!B.pickUnits(units, 'seed-one', 20).some((u) => u.id === 'W003') && B.pickUnits(units, 'seed-one', 20).length === 19);
});

test('regenerate asks claude -p for the unit model with tools off and no saved session, and parses reply, usage and cost', async () => {
  let seen;
  const runner = async (args, input) => { seen = { args, input }; return { code: 0, stdout: JSON.stringify({ type: 'result', is_error: false, result: 'the reply', duration_ms: 4200, total_cost_usd: 0.31, usage: { input_tokens: 10, output_tokens: 20, cache_read_input_tokens: 5, cache_creation_input_tokens: 7 } }), stderr: '' }; };
  const r = await B.regenerate({ system: 'SYS', prompt: 'PROMPT', model: 'claude-opus-5-5' }, { runner });
  assert.ok(seen.args.includes('-p') && seen.args.includes('--no-session-persistence'));
  assert.strictEqual(seen.args[seen.args.indexOf('--model') + 1], 'claude-opus-5-5');
  assert.strictEqual(seen.args[seen.args.indexOf('--tools') + 1], '');
  assert.strictEqual(seen.args[seen.args.indexOf('--system-prompt') + 1], 'SYS');
  assert.strictEqual(seen.input, 'PROMPT');
  assert.deepStrictEqual([r.status, r.reply, r.durationMs, r.costUsd, r.tokens.output, r.tokens.input], ['ok', 'the reply', 4200, 0.31, 20, 22]);
});

test('a failed call is recorded as an error with no reply, never as an empty reply', async () => {
  const bad = await B.regenerate({ system: 's', prompt: 'p', model: 'm' }, { runner: async () => ({ code: 1, stdout: '', stderr: 'boom' }) });
  assert.deepStrictEqual([bad.status, bad.reply], ['error', null]);
  assert.match(bad.error, /boom/);
  const flagged = await B.regenerate({ system: 's', prompt: 'p', model: 'm' }, { runner: async () => ({ code: 0, stdout: JSON.stringify({ is_error: true, result: 'rate limited' }), stderr: '' }) });
  assert.deepStrictEqual([flagged.status, flagged.reply], ['error', null]);
  const junk = await B.regenerate({ system: 's', prompt: 'p', model: 'm' }, { runner: async () => ({ code: 0, stdout: 'not json', stderr: '' }) });
  assert.deepStrictEqual([junk.status, junk.reply], ['error', null]);
});

test('a reply is cleaned before it is recorded: Third Place lines out', async () => {
  const r = await B.regenerate({ system: 's', prompt: 'p', model: 'm' }, { runner: async () => ({ code: 0, stdout: JSON.stringify({ is_error: false, result: 'ok line\nthe Third Place note', usage: {} }), stderr: '' }) });
  assert.ok(r.reply.includes('ok line') && !/third place note/i.test(r.reply));
});

test('makeBlind lists every run once with no arm or run number, keeps a key back to them, and is fixed by the seed', () => {
  const runs = [];
  for (const u of ['U1', 'U2', 'U3']) for (const arm of ['baseline', 'F1']) runs.push({ unit: u, arm, run: 1, status: 'ok', reply: `reply ${u} ${arm}`, correction: 'the wrong claim ' + u });
  const a = B.makeBlind(runs, 'blind-seed'), b = B.makeBlind(runs, 'blind-seed'), c = B.makeBlind(runs, 'other');
  assert.strictEqual(a.blind.length, 6);
  assert.deepStrictEqual(a.blind, b.blind);
  assert.notDeepStrictEqual(a.blind.map((x) => x.reply), c.blind.map((x) => x.reply));   // the ids run R001.. in order; the SHUFFLE is the reply order
  for (const row of a.blind) {
    assert.deepStrictEqual(Object.keys(row).sort(), ['blindId', 'reply', 'unit', 'wrongClaim']);
    assert.ok(!/baseline|F1/.test(JSON.stringify(row).replace(row.reply, '')));
    const k = a.key[row.blindId];
    assert.strictEqual(row.reply, `reply ${k.unit} ${k.arm}`);
  }
  assert.strictEqual(new Set(a.blind.map((x) => x.blindId)).size, 6);
});

test('makeBlind leaves an errored run out of the set and lists it in the key as errored', () => {
  const runs = [{ unit: 'U1', arm: 'baseline', run: 1, status: 'ok', reply: 'r', correction: 'c' }, { unit: 'U2', arm: 'baseline', run: 1, status: 'error', reply: null, correction: 'c' }];
  const out = B.makeBlind(runs, 's');
  assert.strictEqual(out.blind.length, 1);
  assert.strictEqual(out.errored.length, 1);
});
