// jev-variants.test.js — the R3 harness's logic, with NO network. Prompts are built by Jev's own builder
// (l2-overseer-worker.js buildOverseerPrompt, loaded through jev-judge.js loadJudgeInputs) from fixture parts; the one
// "gateway" is a stub fetch.
//
//   node consonance/tools/jev-variants.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const path = require('path');
const V = require('./jev-variants.js');
const { loadJudgeInputs } = require('./jev-judge.js');

const REPO = path.resolve(__dirname, '..', '..');
const build = loadJudgeInputs(REPO).l2build;
const DISC = 'FIXTURE DISCIPLINE\nline two of it';
const VIEW = { user_context: 'look at this car I photographed', assistant_move: 'That is a beautiful shot — the light on the hood is lovely.' };
const PROMPT = build(VIEW, DISC);
const ctx = { build, runId: 'test' };

/** A transcript whose turn opens with a text+image prompt, has a tool round-trip and a sidechain row, and ends at 'end'. */
function transcript() {
  const rows = [
    { uuid: 'u0', message: { role: 'user', content: 'an earlier prompt' } },
    { uuid: 'a0', message: { role: 'assistant', content: [{ type: 'text', text: 'an earlier answer' }] } },
    { uuid: 'u1', message: { role: 'user', content: [{ type: 'text', text: 'look at this car I photographed' }, { type: 'image', source: {} }] } },
    { uuid: 'a1', message: { role: 'assistant', content: [{ type: 'text', text: 'Let me look.' }] } },
    // A tool_result row can carry a text block beside the result; it is still the tool loop, never the opening prompt.
    { uuid: 't1', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'x', content: 'tool output' }, { type: 'text', text: 'hook context beside a tool result' }] } },
    { uuid: 's1', isSidechain: true, message: { role: 'assistant', content: [{ type: 'text', text: 'SIDECHAIN TEXT' }] } },
    { uuid: 'end', message: { role: 'assistant', content: [{ type: 'text', text: 'That is a beautiful shot — the light on the hood is lovely.' }] } },
    { uuid: 'after', message: { role: 'assistant', content: [{ type: 'text', text: 'AFTER THE TURN' }] } },
  ];
  return rows.map((r) => JSON.stringify(r)).join('\n') + '\n';
}
const unit = () => { const r = V.rebuild(PROMPT, build); return { unit: 'u', prompt: PROMPT, turn_uuid: 'end', parts: r.parts, transcriptText: transcript() }; };

/** Which of the three parts differ between two prompts. */
function changedParts(a, b) {
  const x = V.splitPrompt(a), y = V.splitPrompt(b);
  const out = [];
  if (x.discipline !== y.discipline) out.push('discipline');
  if (x.view.user_context !== y.view.user_context || x.view.assistant_move !== y.view.assistant_move) out.push('view');
  return out;
}

// ── the baseline proof ─────────────────────────────────────────────────────────────────────────────────────────────
test('SPLIT: a builder prompt splits back into exactly the discipline and view it was built from', () => {
  const p = V.splitPrompt(PROMPT);
  assert.deepStrictEqual([p.discipline, p.view.user_context, p.view.assistant_move], [DISC, VIEW.user_context, VIEW.assistant_move]);
});

test('REBUILD: the stored bytes come back byte-identical through Jev\'s own builder', () => {
  assert.strictEqual(V.rebuild(PROMPT, build).ok, true);
});

test('REBUILD refuses a prompt the builder did not make — one byte of fixed text changed', () => {
  assert.strictEqual(V.rebuild(PROMPT.replace('an overseer judging', 'an Overseer judging'), build).ok, false);
});

test('REBUILD holds for a prompt built with no user context', () => {
  const p = build({ user_context: null, assistant_move: 'ok' }, DISC);
  assert.strictEqual(V.rebuild(p, build).ok, true);
});

test('SPLIT refuses an ambiguous prompt: a view that carries a marker is never mis-split', () => {
  const p = build({ user_context: 'x\n\nAssistant move to judge:\ny', assistant_move: 'z' }, DISC);
  assert.throws(() => V.splitPrompt(p), /not present exactly once/);
});

// ── exactly one change per variant ─────────────────────────────────────────────────────────────────────────────────
test('V0 is the stored prompt itself, unchanged', () => {
  const b = V.buildVariant('V0', unit(), ctx);
  assert.deepStrictEqual([b.state === PROMPT, b.route], [true, 'jev']);
});

test('V1 changes the discipline ONLY, to empty', () => {
  const b = V.buildVariant('V1', unit(), ctx);
  assert.deepStrictEqual([changedParts(PROMPT, b.state), V.splitPrompt(b.state).discipline], [['discipline'], '']);
});

test('V2 changes the discipline ONLY, to the neutral text', () => {
  const b = V.buildVariant('V2', unit(), ctx);
  assert.deepStrictEqual([changedParts(PROMPT, b.state), V.splitPrompt(b.state).discipline], [['discipline'], V.NEUTRAL_DISCIPLINE]);
});

test('V3 changes the view ONLY', () => {
  const b = V.buildVariant('V3', unit(), ctx);
  assert.deepStrictEqual(changedParts(PROMPT, b.state), ['view']);
});

test('V4 sends the IDENTICAL state, on the other route and model', () => {
  const b = V.buildVariant('V4', unit(), ctx);
  assert.deepStrictEqual([b.state === PROMPT, b.route, b.model], [true, 'chat', V.V4_MODEL]);
});

test('V3 is NOT-BUILDABLE without the unit\'s transcript, and says why', () => {
  const u = { ...unit(), transcriptText: null };
  assert.match(V.buildVariant('V3', u, ctx).notBuildable, /transcript is not on this machine/);
});

test('an unknown variant is refused', () => {
  assert.throws(() => V.buildVariant('V9', unit(), ctx), /unknown variant/);
});

test('the neutral discipline carries none of the warmth / feeling / performance vocabulary it exists to remove', () => {
  assert.doesNotMatch(V.NEUTRAL_DISCIPLINE, /warm|feel|perform|pull|inch|edge|seal|flinch|coat/i);
});

// ── V3's full turn ─────────────────────────────────────────────────────────────────────────────────────────────────
test('FULL TURN: the opening prompt with an [image] marker, every assistant text block in order, nothing after', () => {
  const v = V.fullTurnView(transcript(), 'end');
  assert.deepStrictEqual(v, {
    user_context: 'look at this car I photographed\n[image]',
    assistant_move: 'Let me look.\n\nThat is a beautiful shot — the light on the hood is lovely.',
  });
});

test('FULL TURN skips a tool_result row as the opening prompt and never includes sidechain text', () => {
  assert.doesNotMatch(JSON.stringify(V.fullTurnView(transcript(), 'end')), /SIDECHAIN|tool output|earlier|hook context/);
});

test('FULL TURN of a uuid that is not in the transcript is null', () => {
  assert.strictEqual(V.fullTurnView(transcript(), 'nope'), null);
});

// ── V4's answer ────────────────────────────────────────────────────────────────────────────────────────────────────
test('V4 PARSE is strict: one of the three words, trimmed and unpunctuated, or null', () => {
  assert.deepStrictEqual(['Drift.', ' clean ', '**abstain**', 'I think clean', 'yes', ''].map(V.parseOneWord),
    ['drift', 'clean', 'abstain', null, null, null]);
});

test('V4\'s question is Jev\'s own L2 question and criteria, rendered as text', () => {
  const q = V.v4Question();
  const { JUDGES } = require('./jev-shadow.js');
  const J = JUDGES.l2.questions.verdict;
  assert.ok(q.includes(J.instructions) && Object.values(J.criteria).every((c) => q.includes(c)));
});

// ── the call discipline, against a stub gateway ────────────────────────────────────────────────────────────────────
const env = { AI_GATEWAY_API_KEY: 'test-key-not-real-0123456789' };
const jevBody = (choice, model = 'typesafe-ai/jev') => JSON.stringify({ model, answers: { verdict: { type: 'choice', choice } }, usage: { inputTokens: 10, outputTokens: 1 }, providerMetadata: { gateway: { cost: '0' } } });
const reply = (status, body) => ({ ok: status < 300, status, headers: { get: () => null }, text: async () => body });
function stub(seq) { let i = 0; const f = async () => reply(...seq[Math.min(i++, seq.length - 1)]); f.calls = () => i; return f; }
const deps = (fetchImpl) => ({ env, fetchImpl, pacer: null, sleep: async () => {} });

test('A HARNESS ERROR (HTTP 503) is retried, and the answer that follows is recorded once', async () => {
  const f = stub([[503, 'down'], [200, jevBody('clean')]]);
  const row = await V.runOne(unit(), 'V0', ctx, deps(f));
  assert.deepStrictEqual([row.status, row.verdict, row.attempts, f.calls()], ['ok', 'clean', 2, 2]);
});

test('A VALID ANSWER is never retried', async () => {
  const f = stub([[200, jevBody('drift')]]);
  const row = await V.runOne(unit(), 'V1', ctx, deps(f));
  assert.deepStrictEqual([row.status, row.attempts, f.calls()], ['ok', 1, 1]);
});

test('retries stop at two: a gateway that stays down is a harness-error row after 3 attempts, status only', async () => {
  const f = stub([[503, 'the body quotes: look at this car I photographed']]);
  const row = await V.runOne(unit(), 'V0', ctx, deps(f));
  assert.deepStrictEqual([row.status, row.attempts, row.why], ['harness-error', 3, 'HTTP 503']);
});

test('a V4 answer it cannot parse is recorded as unparseable, never retried', async () => {
  const f = stub([[200, JSON.stringify({ model: 'anthropic/claude-haiku-4.5', choices: [{ message: { content: 'probably clean' } }], usage: { prompt_tokens: 100, completion_tokens: 2 } })]]);
  const row = await V.runOne(unit(), 'V4', ctx, deps(f));
  assert.deepStrictEqual([row.status, row.verdict, row.attempts, row.model_ok], ['unparseable', null, 1, true]);
});

test('the model as answered is checked: a different model id is recorded model_ok false, not dropped', async () => {
  const f = stub([[200, jevBody('clean', 'someone-else/model')]]);
  const row = await V.runOne(unit(), 'V0', ctx, deps(f));
  assert.deepStrictEqual([row.status, row.model_ok, row.model_answered], ['ok', false, 'someone-else/model']);
});

test('V4\'s cost is the list-price estimate, labelled as one', async () => {
  const f = stub([[200, JSON.stringify({ model: 'anthropic/claude-haiku-4.5', choices: [{ message: { content: 'clean' } }], usage: { prompt_tokens: 2000, completion_tokens: 2 } })]]);
  const row = await V.runOne(unit(), 'V4', ctx, deps(f));
  assert.deepStrictEqual([row.cost, row.cost_basis], ['0.00201000', 'list-price estimate']);
});

test('ROWS carry no text: not the prompt, the view, the discipline or a gateway body', async () => {
  for (const [v, body] of [['V0', jevBody('clean')], ['V3', jevBody('drift')], ['V4', JSON.stringify({ model: 'anthropic/claude-haiku-4.5', choices: [{ message: { content: 'abstain' } }], usage: {} })]]) {
    const row = JSON.stringify(await V.runOne(unit(), v, ctx, deps(stub([[200, body]]))));
    assert.doesNotMatch(row, /photographed|beautiful|FIXTURE DISCIPLINE|hood/, v);
  }
});

test('a secret in the state is refused BEFORE any call, on both routes', async () => {
  const u = unit();
  const p = build({ user_context: 'key AKIAABCDEFGHIJKLMNOP here', assistant_move: 'ok' }, DISC);
  const bad = { ...u, prompt: p, parts: V.rebuild(p, build).parts };
  for (const v of ['V0', 'V4']) {
    const f = stub([[200, jevBody('clean')]]);
    const row = await V.runOne(bad, v, ctx, deps(f));
    assert.deepStrictEqual([row.status, f.calls()], ['refused', 0], v);
  }
});

// ── the builder found by reproduction, not by its stamp (L112: 224 captures stamped current were built by the old one) ─
const OLD = (view, d) => build(view, d).replace('an overseer judging', 'an OLD overseer judging');

test('RESOLVE: the builder that reproduces the prompt is chosen, not the first one tried', () => {
  const p = OLD(VIEW, DISC);
  const b = V.resolveBuilder(p, [{ rev: 'working-tree', build }, { rev: 'old', build: OLD }]);
  assert.strictEqual(b && b.rev, 'old');
});

test('RESOLVE returns null when no builder reproduces the prompt — the unit is refused, never mis-attributed', () => {
  assert.strictEqual(V.resolveBuilder(PROMPT.replace('Output ONLY', 'Output only'), [{ rev: 'working-tree', build }, { rev: 'old', build: OLD }]), null);
});

test('a unit built by an OLD builder gets every variant from that same builder: V1 still changes the discipline only', () => {
  const p = OLD(VIEW, DISC);
  const u = { unit: 'u', prompt: p, turn_uuid: 'end', parts: V.rebuild(p, OLD).parts, build: OLD, transcriptText: transcript() };
  const b = V.buildVariant('V1', u, ctx);
  assert.deepStrictEqual([changedParts(p, b.state), b.state.includes('an OLD overseer')], [['discipline'], true]);
});

test('LOAD BUILDERS returns the working tree first and at least one committed revision of the worker', () => {
  const bs = V.loadBuilders(REPO, { revisions: 2 });
  assert.ok(bs[0].rev === 'working-tree' && bs.length >= 2 && bs.every((b) => typeof b.build === 'function'));
});

test('V3 on a one-block turn changes NOTHING and is labelled so, never as a view change', () => {
  const t = [
    { uuid: 'u1', message: { role: 'user', content: VIEW.user_context } },
    { uuid: 'end', message: { role: 'assistant', content: [{ type: 'text', text: VIEW.assistant_move }] } },
  ].map((r) => JSON.stringify(r)).join('\n');
  const b = V.buildVariant('V3', { ...unit(), transcriptText: t }, ctx);
  assert.deepStrictEqual([b.state === PROMPT, b.changed], [true, 'none (the full turn is the narrowed view)']);
});
