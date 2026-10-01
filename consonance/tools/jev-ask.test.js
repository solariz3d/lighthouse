// jev-ask.test.js — node --test consonance/tools/jev-ask.test.js
//
// NO LIVE CALLS in the suite. `fetch` is the one boundary mocked (the keeper's rule: mock at the boundary); every
// other line runs for real. The single live test at the end is OPT-IN twice over — AI_GATEWAY_API_KEY set AND
// JEV_LIVE_SMOKE=1 — and otherwise prints NOT-RUN with its reason rather than passing silently.
//
// THE FAKE SECRETS ARE BUILT AT RUNTIME, by concatenation, never written out whole. This repo is public; a literal
// token shape in a test file trips push protection and reads, to every scanner downstream, as a leaked key.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const J = require('./jev-ask.js');

const TOOL = path.join(__dirname, 'jev-ask.js');
const FAKE_KEY = ['test', 'only', 'not', 'a', 'real', 'key', '7f3a9c'].join('-');   // 32 chars, no secret shape
const ENV = { AI_GATEWAY_API_KEY: FAKE_KEY };
const R = (n) => 'x'.repeat(n);

const SCHEMA = { questions: {
  colour: { type: 'boolean', instructions: 'Does the text mention a colour?', criteria: { true: 'a colour is named', false: 'no colour is named' } },
  route: { type: 'choice', instructions: 'Which room?', criteria: { kitchen: 'cooking', study: 'reading' } },
  level: { type: 'score', instructions: 'How calm?', criteria: ['tense', 'neutral', 'calm'] },
} };
const STATE = 'A blue chair stands beside a sleeping cat.';
const GOOD = {
  model: 'typesafe-ai/jev',
  answers: {
    colour: { type: 'boolean', probability: 0.99 },
    route: { type: 'choice', choice: 'study', probabilities: { kitchen: 0.1, study: 0.9 } },
    level: { type: 'score', score: 1.8, probabilities: { 0: 0, 1: 0.2, 2: 0.8 } },
  },
  usage: { inputTokens: 351, outputTokens: 0 },
  providerMetadata: { gateway: { cost: '0.0000147', generationId: 'gen_test' } },
};

/** A stubbed fetch that records every call and answers with `status` and `body`. */
function stub(status, body) {
  const calls = [];
  const f = async (url, init) => {
    calls.push({ url, init });
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    return { ok: status >= 200 && status < 300, status, text: async () => text };
  };
  f.calls = calls;
  return f;
}
const refuses = async (p, re) => { await assert.rejects(p, (e) => e instanceof J.Refusal && e.exitCode === 2 && re.test(e.message)); };

// ------------------------------------------------------------------ the key

test('no key: REFUSES loudly (exit 2) and never touches the network', async () => {
  const f = stub(200, GOOD);
  await refuses(J.ask({ schema: SCHEMA, state: STATE, env: {}, fetchImpl: f }), /no AI_GATEWAY_API_KEY/);
  assert.strictEqual(f.calls.length, 0);
});

test('a whitespace-only key is no key', async () => {
  const f = stub(200, GOOD);
  await refuses(J.ask({ schema: SCHEMA, state: STATE, env: { AI_GATEWAY_API_KEY: '   ' }, fetchImpl: f }), /no AI_GATEWAY_API_KEY/);
  assert.strictEqual(f.calls.length, 0);
});

test('the key is sent as a Bearer header — and only there', async () => {
  const f = stub(200, GOOD);
  await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f });
  assert.strictEqual(f.calls[0].init.headers.Authorization, `Bearer ${FAKE_KEY}`);
  assert.ok(!f.calls[0].init.body.includes(FAKE_KEY), 'the key reached the request body');
});

test('a gateway error body that ECHOES the key leaves this process scrubbed', async () => {
  const f = stub(401, `{"error":"invalid key ${FAKE_KEY}"}`);
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f }),
    (e) => e instanceof J.GatewayError && !e.message.includes(FAKE_KEY) && /HTTP 401/.test(e.message));
});

test('a network error that carries the key is scrubbed too', async () => {
  const f = async () => { throw new Error(`connect failed for ${FAKE_KEY}`); };
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f }),
    (e) => e instanceof J.GatewayError && !e.message.includes(FAKE_KEY));
});

// ------------------------------------------------------------------ refusals before the network

test('an empty state REFUSES before the network', async () => {
  const f = stub(200, GOOD);
  await refuses(J.ask({ schema: SCHEMA, state: '  \n', env: ENV, fetchImpl: f }), /state is empty/);
  assert.strictEqual(f.calls.length, 0);
});

const BAD_SCHEMAS = [
  ['questions as an array', { questions: [{ type: 'boolean' }] }, /object keyed by question name/],
  ['no questions', { questions: {} }, /empty/],
  ['boolean with no criteria (the live gateway refuses it)', { questions: { a: { type: 'boolean', instructions: 'x?' } } }, /criteria \{"true"/],
  ['boolean with no instructions', { questions: { a: { type: 'boolean', criteria: { true: 'y', false: 'n' } } } }, /"instructions" is required/],
  ['boolean criteria with an extra key', { questions: { a: { type: 'boolean', instructions: 'x?', criteria: { true: 'y', false: 'n', maybe: 'm' } } } }, /criteria \{"true"/],
  ['boolean criteria with an empty side', { questions: { a: { type: 'boolean', instructions: 'x?', criteria: { true: 'y', false: ' ' } } } }, /criteria \{"true"/],
  ['choice with one option', { questions: { a: { type: 'choice', instructions: 'x?', criteria: { only: 'one' } } } }, /at least two options/],
  ['score with one label', { questions: { a: { type: 'score', instructions: 'x?', criteria: ['one'] } } }, /at least two labels/],
  ['an unknown type', { questions: { a: { type: 'free-text', instructions: 'x?' } } }, /type must be one of/],
  ['a name that is not an identifier', { questions: { 'two words': { type: 'score', instructions: 'x?', criteria: ['a', 'b'] } } }, /identifier/],
];
for (const [name, schema, re] of BAD_SCHEMAS) {
  test(`malformed schema REFUSES before the network: ${name}`, async () => {
    const f = stub(200, GOOD);
    await refuses(J.ask({ schema, state: STATE, env: ENV, fetchImpl: f }), re);
    assert.strictEqual(f.calls.length, 0);
  });
}

// ------------------------------------------------------------------ the secret scan

// One sample per named pattern, each built at runtime. The test asserts the NAME in the refusal, so a pattern that
// stops matching fails its own row, not a neighbour's.
const SECRET_SAMPLES = [
  ['anthropic-key', 'sk-' + 'ant-' + 'api03' + R(24)],
  ['openai-style-key', 'sk-' + 'proj-' + R(24)],
  ['github-token', 'gh' + 'p_' + 'A'.repeat(36)],
  ['aws-access-key-id', 'AK' + 'IA' + 'ABCDEFGHIJKLMNOP'],
  ['slack-token', 'xo' + 'xb-' + '1234567890-abc'],
  ['google-api-key', 'AI' + 'za' + 'B'.repeat(35)],
  ['private-key-block', '-----BEGIN ' + 'RSA PRIVATE' + ' KEY-----'],
  ['bearer-token', 'Authorization: ' + 'Bearer ' + 'abcDEF123'.repeat(3)],
  ['jwt', 'ey' + 'J' + R(12) + '.ey' + 'J' + R(12) + '.' + R(12)],
  ['secret-assignment', 'AI_GATEWAY_' + 'API_KEY=' + 'q'.repeat(40)],
  ['openrouter-key', 'sk-' + 'or-' + 'v1-' + R(24)],   // D197, appended: the tests above index this list by position
  ['vercel-gateway-key', 'vc' + 'k_' + R(24)],
];

test('every named pattern has a sample here — a pattern with no test is a pattern nobody knows still works', () => {
  assert.deepStrictEqual(SECRET_SAMPLES.map((s) => s[0]).sort(), J.SECRET_PATTERNS.map((p) => p[0]).sort());
});

for (const [pattern, sample] of SECRET_SAMPLES) {
  test(`REFUSES to send a ${pattern} in the state, names the pattern, never prints the match`, async () => {
    const f = stub(200, GOOD);
    await assert.rejects(J.ask({ schema: SCHEMA, state: `notes: ${sample} end`, env: ENV, fetchImpl: f }),
      (e) => e instanceof J.Refusal && e.message.includes(pattern) && e.message.includes('state') && !e.message.includes(sample));
    assert.strictEqual(f.calls.length, 0);
  });
}

test('the key\'s OWN value in the state refuses, even though it matches no pattern', async () => {
  const f = stub(200, GOOD);
  await assert.rejects(J.ask({ schema: SCHEMA, state: `pasted ${FAKE_KEY} by accident`, env: ENV, fetchImpl: f }),
    (e) => e instanceof J.Refusal && /the-key-itself in state/.test(e.message) && !e.message.includes(FAKE_KEY));
  assert.strictEqual(f.calls.length, 0);
});

test('a secret in a QUESTION is refused too, and the refusal says which field', async () => {
  const f = stub(200, GOOD);
  const schema = { questions: { a: { type: 'boolean', instructions: 'Is ' + 'gh' + 'p_' + 'C'.repeat(36) + ' valid?', criteria: { true: 'y', false: 'n' } } } };
  await refuses(J.ask({ schema, state: STATE, env: ENV, fetchImpl: f }), /github-token in questions\.a\.instructions/);
  assert.strictEqual(f.calls.length, 0);
});

test('CONTROL: prose that NAMES the variable and the prefixes is not a secret — the scan can say no', async () => {
  const f = stub(200, GOOD);
  const prose = 'The key lives in AI_GATEWAY_API_KEY only. Tokens look like sk- or ghp_ and a Bearer header carries them.';
  const r = await J.ask({ schema: SCHEMA, state: prose, env: ENV, fetchImpl: f });
  assert.strictEqual(f.calls.length, 1);
  assert.strictEqual(r.answers.colour.probability, 0.99);
});

// ------------------------------------------------------------------ the request and the answer

test('the request is exactly {model, state, questions} to /v1/evaluate — no providerOptions (the keeper\'s ruling)', async () => {
  const f = stub(200, GOOD);
  await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f });
  assert.strictEqual(f.calls[0].url, 'https://ai-gateway.vercel.sh/v1/evaluate');
  assert.strictEqual(f.calls[0].init.method, 'POST');
  const body = JSON.parse(f.calls[0].init.body);
  assert.deepStrictEqual(Object.keys(body).sort(), ['model', 'questions', 'state']);
  assert.strictEqual(body.model, 'typesafe-ai/jev');
  assert.deepStrictEqual(body.questions, SCHEMA.questions);
});

test('returns the answers, the usage and the gateway\'s cost', async () => {
  const r = await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, GOOD) });
  assert.deepStrictEqual(r.answers, GOOD.answers);
  assert.deepStrictEqual(r.usage, { inputTokens: 351, outputTokens: 0 });
  assert.strictEqual(r.cost, '0.0000147');
  assert.strictEqual(r.generationId, 'gen_test');
  assert.strictEqual(r.model, 'typesafe-ai/jev');
});

test('a cost the gateway did not report is null — said, not invented', async () => {
  const body = { ...GOOD, providerMetadata: {} };
  const r = await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, body) });
  assert.strictEqual(r.cost, null);
});

test('a 5xx is surfaced with its status and is NOT retried', async () => {
  const f = stub(503, 'upstream down');
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f }), /HTTP 503/);
  assert.strictEqual(f.calls.length, 1);
});

test('a 200 whose body is not JSON is an error, not an empty answer', async () => {
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, '<html>') }), /not JSON/);
});

test('an answer missing for a declared question is an error that names it', async () => {
  const body = { ...GOOD, answers: { colour: GOOD.answers.colour, route: GOOD.answers.route } };
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, body) }), /declared question "level"/);
});

test('a boolean probability outside [0, 1] is an error', async () => {
  const body = { ...GOOD, answers: { ...GOOD.answers, colour: { type: 'boolean', probability: 1.7 } } };
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, body) }), /probability in \[0, 1\]/);
});

test('a choice outside the declared options is an error', async () => {
  const body = { ...GOOD, answers: { ...GOOD.answers, route: { type: 'choice', choice: 'garage' } } };
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, body) }), /not one of the declared options/);
});

test('an answer of the wrong type is an error', async () => {
  const body = { ...GOOD, answers: { ...GOOD.answers, level: { type: 'boolean', probability: 0.5 } } };
  await assert.rejects(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, body) }), /is type boolean, the question is score/);
});

// ------------------------------------------------------------------ dry, the ledger row, the CLI

test('--dry sends nothing, needs no key, and the printed request carries no key', async () => {
  const f = stub(200, GOOD);
  const r = await J.ask({ schema: SCHEMA, state: STATE, env: {}, fetchImpl: f, dry: true });
  assert.strictEqual(f.calls.length, 0);
  assert.strictEqual(r.dry, true);
  assert.deepStrictEqual(r.request.body, { model: 'typesafe-ai/jev', state: STATE, questions: SCHEMA.questions });
  const withKey = await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f, dry: true });
  assert.ok(!JSON.stringify(withKey).includes(FAKE_KEY), 'a dry run printed the key');
});

test('--dry still refuses a secret: a printed request is also an outgoing copy', async () => {
  await refuses(J.ask({ schema: SCHEMA, state: SECRET_SAMPLES[2][1], env: {}, dry: true }), /github-token/);
});

test('a ledger row carries hashes and counts — never the state, a question, or the key', async () => {
  const r = await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, GOOD) });
  const row = J.ledgerRow(r, JSON.stringify(SCHEMA), STATE);
  const s = JSON.stringify(row);
  assert.ok(!s.includes('blue chair') && !s.includes('Does the text') && !s.includes(FAKE_KEY));
  assert.match(row.state_sha256, /^[0-9a-f]{64}$/);
  assert.strictEqual(row.inputTokens, 351);
  assert.strictEqual(row.cost, '0.0000147');
});

function cliFiles() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-cli-'));
  fs.writeFileSync(path.join(d, 's.json'), JSON.stringify(SCHEMA));
  fs.writeFileSync(path.join(d, 'state.txt'), STATE);
  return d;
}
const cli = (args, env) => spawnSync(process.execPath, [TOOL, ...args], {
  encoding: 'utf8', env: { ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'AI_GATEWAY_API_KEY')), ...env } });

test('CLI: no key exits 2 with REFUSED on stderr', () => {
  const d = cliFiles();
  const r = cli(['--schema', path.join(d, 's.json'), '--state', path.join(d, 'state.txt')], {});
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /REFUSED — no AI_GATEWAY_API_KEY/);
});

test('CLI: --dry prints the request, exits 0, and never prints the key', () => {
  const d = cliFiles();
  const r = cli(['--schema', path.join(d, 's.json'), '--state', path.join(d, 'state.txt'), '--dry'], ENV);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /typesafe-ai\/jev/);
  assert.ok(!r.stdout.includes(FAKE_KEY) && !r.stderr.includes(FAKE_KEY));
});

test('CLI: both paths are required — one call form', () => {
  const r = cli(['--schema', 'x.json'], ENV);
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /both paths are required/);
});

// ------------------------------------------------------------------ PACING (D107): the gap, Retry-After, backoff
// A STUBBED CLOCK: `now()` reads a number and `sleep(ms)` advances it and records the wait, so no test here sleeps for
// real. `timed` is a fetch stub that notes the clock at every call and answers from a script of responses.

function clock(t0 = 1_000_000) {
  const c = { t: t0, sleeps: [] };
  c.now = () => c.t;
  c.sleep = async (ms) => { c.sleeps.push(ms); c.t += ms; };
  return c;
}
/** `script(n)` gives the n-th response (1-based): a status, or [status, {header: value}]. Default 200 GOOD. */
function timed(c, script = () => 200) {
  const at = [];
  const f = async () => {
    at.push(c.t);
    const s = script(at.length);
    const [status, headers] = Array.isArray(s) ? s : [s, {}];
    const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
    const text = status === 200 ? JSON.stringify(GOOD) : '{"error":{"message":"Rate limit exceeded","type":"rate_limit_exceeded"}}';
    return { ok: status >= 200 && status < 300, status, headers: { get: (k) => (k.toLowerCase() in h ? h[k.toLowerCase()] : null) }, text: async () => text };
  };
  f.at = at;
  return f;
}
const paced = (c, opts = {}) => J.createPacer({ gapMs: 2000, baseBackoffMs: 5000, maxBackoffMs: 60000, maxWaitMs: 120000, now: c.now, sleep: c.sleep, ...opts });
const askP = (f, pacer, c) => J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f, pacer, now: c.now });
const gaps = (at) => at.slice(1).map((t, i) => t - at[i]);

test('PACING: no 429 → the calls are spaced by the gap, and by the gap only', async () => {
  const c = clock(); const f = timed(c); const p = paced(c);
  for (let i = 0; i < 4; i++) await askP(f, p, c);
  assert.deepStrictEqual(gaps(f.at), [2000, 2000, 2000], 'each call starts one gap after the previous ended');
  assert.strictEqual(f.at[0], 1_000_000, 'the FIRST call of a process does not wait');
});

test('PACING: a MUTANT with no gap goes red — back-to-back calls are exactly what 429 punished', async () => {
  const c = clock(); const f = timed(c); const p = paced(c, { gapMs: 0 });
  for (let i = 0; i < 3; i++) await askP(f, p, c);
  assert.deepStrictEqual(gaps(f.at), [0, 0], 'the control: with gap 0 the calls are back to back');
  assert.ok(J.DEFAULT_GAP_MS >= 1000, `the DEFAULT gap must be a real gap, is ${J.DEFAULT_GAP_MS} ms`);
});

test('PACING: a 429 with Retry-After is waited on — the NEXT call goes after it, not after the gap', async () => {
  const c = clock(); const f = timed(c, (n) => (n === 1 ? [429, { 'Retry-After': '7' }] : 200)); const p = paced(c);
  await assert.rejects(askP(f, p, c), (e) => e instanceof J.GatewayError && /HTTP 429/.test(e.message));
  await askP(f, p, c);
  assert.strictEqual(f.at.length, 2, 'the 429 was NOT retried inside ask — it stays a skip-and-retry item (L078)');
  assert.strictEqual(f.at[1] - f.at[0], 7000, 'the next call waited the 7 s the gateway asked for');
});

test('PACING: Retry-After as an HTTP-date is honoured too', async () => {
  const c = clock(Date.parse('2026-09-22T16:00:00Z'));
  const f = timed(c, (n) => (n === 1 ? [429, { 'retry-after': 'Tue, 22 Sep 2026 16:00:12 GMT' }] : 200)); const p = paced(c);
  await assert.rejects(askP(f, p, c), /HTTP 429/);
  await askP(f, p, c);
  assert.strictEqual(f.at[1] - f.at[0], 12000);
});

test('PACING: a 429 with NO Retry-After backs off exponentially, capped — and a success resets it', async () => {
  const c = clock(); const st = [429, 429, 429, 429, 429, 200, 429, 200];
  const f = timed(c, (n) => st[n - 1]); const p = paced(c);
  for (let i = 0; i < st.length; i++) { try { await askP(f, p, c); } catch (e) { assert.match(e.message, /HTTP 429/); } }
  assert.deepStrictEqual(gaps(f.at), [5000, 10000, 20000, 40000, 60000, 2000, 5000],
    'base 5 s doubling to the 60 s cap; after a success the next call waits only the gap, and a new 429 starts at base again');
});

test('PACING: an unparseable Retry-After falls back to the backoff', async () => {
  const c = clock(); const f = timed(c, (n) => (n === 1 ? [429, { 'Retry-After': 'soon' }] : 200)); const p = paced(c);
  await assert.rejects(askP(f, p, c), /HTTP 429/);
  await askP(f, p, c);
  assert.strictEqual(f.at[1] - f.at[0], 5000);
});

test('PACING: a Retry-After beyond the in-pass cap is NOT slept on — the next call is deferred UNSENT as a 429 skip', async () => {
  const c = clock(); const f = timed(c, (n) => (n === 1 ? [429, { 'Retry-After': '3600' }] : 200)); const p = paced(c);
  await assert.rejects(askP(f, p, c), /HTTP 429/);
  await assert.rejects(askP(f, p, c), (e) => e instanceof J.GatewayError && /HTTP 429/.test(e.message) && /not sent/.test(e.message));
  assert.strictEqual(f.at.length, 1, 'the deferred call never reached the network');
  assert.ok(c.sleeps.every((ms) => ms <= 120000), 'no wait longer than the cap: ' + c.sleeps);
  c.t += 3600 * 1000;
  await askP(f, p, c);
  assert.strictEqual(f.at.length, 2, 'once the Retry-After has passed, calls go again');
});

test('PACING: a 5xx is not a rate limit — it gets the gap, not a backoff', async () => {
  const c = clock(); const f = timed(c, (n) => (n === 1 ? 503 : 200)); const p = paced(c);
  await assert.rejects(askP(f, p, c), /HTTP 503/);
  await askP(f, p, c);
  assert.strictEqual(f.at[1] - f.at[0], 2000);
});

test('PACING: the gap is not counted in `ms` — ms is the call, not the wait before it', async () => {
  const c = clock(); const f = timed(c); const p = paced(c);
  await askP(f, p, c);
  const r = await askP(f, p, c);
  assert.strictEqual(r.ms, 0, 'the stub answers in 0 ms on the stubbed clock; the 2 s gap is not in it');
});

test('PACING: the REAL fetch gets ONE shared pacer (judge and shadow share it in the runner); a stubbed fetch gets none', () => {
  const real = J.defaultPacerFor(globalThis.fetch);
  assert.ok(real, 'the real gateway path is paced by default');
  assert.strictEqual(J.defaultPacerFor(globalThis.fetch), real, 'the same pacer every time — one process, one spacing');
  assert.strictEqual(real.gapMs, J.DEFAULT_GAP_MS);
  assert.strictEqual(J.defaultPacerFor(async () => {}), null, 'a stub has no rate limit, so the suites never sleep');
});

// ------------------------------------------------------------------ D197: the OpenRouter route (plan_jev_openrouter_d162_2026-10-01.md)
// Every test mocks `fetch` and uses a FAKE key built at runtime. No live call is made here; E makes the live calls in D162.

const OR_KEY = ['sk', 'or', 'v1', 'test0nly0not0a0real0key0aaaa1111'].join('-');   // key-shaped (matches the openrouter-key pattern), not a real key
const OR_ENV = { OPENROUTER_API_KEY: OR_KEY };
const RESOLVED = 'typesafe/jev-1.13-20260917';
const OR_GOOD = {
  id: 'gen-dec-1790015143-test',
  model: RESOLVED,
  provider: 'TypeSafe',
  answers: {
    colour: { type: 'noul', noul: 0.97 },
    route: { type: 'choice', choice: 'study', confidence: 0.9, probabilities: { kitchen: 0.1, study: 0.9 } },
    level: { type: 'score', score: 1.8, probabilities: { 0: 0, 1: 0.2, 2: 0.8 } },
  },
  usage: { input_tokens: 351, output_tokens: 70, cost: 0.000014322 },
};
const orAsk = (over = {}) => J.ask({ schema: SCHEMA, state: STATE, env: OR_ENV, route: 'openrouter', ...over });

// route selection: explicit, never silent
test('ROUTE: with no route named the route is vercel, exactly as before, and it reads AI_GATEWAY_API_KEY only', async () => {
  const f = stub(200, GOOD); const r = await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f });
  assert.strictEqual(f.calls[0].url, J.URL_EVALUATE); assert.strictEqual(r.model, 'typesafe-ai/jev'); assert.strictEqual(J.DEFAULT_ROUTE, 'vercel');
});
test('ROUTE: an OPENROUTER key alone with no route named is REFUSED and told to name the route; nothing switches by which key is present, and nothing is sent', async () => {
  const f = stub(200, OR_GOOD);
  await refuses(J.ask({ schema: SCHEMA, state: STATE, env: OR_ENV, fetchImpl: f }), /no AI_GATEWAY_API_KEY[\s\S]*--route openrouter/);
  assert.strictEqual(f.calls.length, 0);
});
test('ROUTE: an unknown route name is REFUSED (never defaulted), and a bare typo does not select openrouter', async () => {
  for (const bad of ['open-router', 'OPENROUTER', 'jev', '', null]) {
    const f = stub(200, OR_GOOD);
    await refuses(J.ask({ schema: SCHEMA, state: STATE, env: { ...ENV, ...OR_ENV }, fetchImpl: f, route: bad }), /unknown route/);
    assert.strictEqual(f.calls.length, 0, `route ${JSON.stringify(bad)} sent something`);
  }
});
test('ROUTE: each route reads ITS OWN key variable: the openrouter route does not fall back to AI_GATEWAY_API_KEY, the vercel route does not use OPENROUTER_API_KEY', async () => {
  const f = stub(200, OR_GOOD);
  await refuses(J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: f, route: 'openrouter' }), /no OPENROUTER_API_KEY/);
  assert.strictEqual(f.calls.length, 0);
  const g = stub(200, GOOD); await J.ask({ schema: SCHEMA, state: STATE, env: { ...ENV, ...OR_ENV }, fetchImpl: g, route: 'vercel' });
  assert.match(g.calls[0].init.headers.Authorization, new RegExp(`Bearer ${FAKE_KEY}$`)); assert.ok(!g.calls[0].init.headers.Authorization.includes(OR_KEY));
});
test('ROUTE: the CLI takes --route, rejects an unknown one, and a --dry openrouter request names OPENROUTER_API_KEY and prints no key', () => {
  const schemaFile = path.join(os.tmpdir(), `jev-or-${process.pid}.schema.json`), stateFile = path.join(os.tmpdir(), `jev-or-${process.pid}.state.txt`);
  fs.writeFileSync(schemaFile, JSON.stringify(SCHEMA)); fs.writeFileSync(stateFile, STATE);
  try {
    const env = { ...process.env, OPENROUTER_API_KEY: OR_KEY }; delete env.AI_GATEWAY_API_KEY;
    const ok = spawnSync(process.execPath, [TOOL, '--schema', schemaFile, '--state', stateFile, '--route', 'openrouter', '--dry'], { encoding: 'utf8', env });
    assert.strictEqual(ok.status, 0, ok.stderr); const out = JSON.parse(ok.stdout);
    assert.strictEqual(out.route, 'openrouter'); assert.strictEqual(out.request.url, J.URL_OPENROUTER); assert.match(out.request.headers.Authorization, /OPENROUTER_API_KEY/);
    assert.ok(!ok.stdout.includes(OR_KEY) && !ok.stderr.includes(OR_KEY), 'the key was printed');
    const bad = spawnSync(process.execPath, [TOOL, '--schema', schemaFile, '--state', stateFile, '--route', 'nope', '--dry'], { encoding: 'utf8', env });
    assert.strictEqual(bad.status, 2); assert.match(bad.stderr, /unknown route/);
  } finally { fs.rmSync(schemaFile, { force: true }); fs.rmSync(stateFile, { force: true }); }
});

// the request shape
test('REQUEST: URL, the PINNED model (not an alias), data_collection deny, the state as sent, the key only in the Authorization header', async () => {
  const f = stub(200, OR_GOOD); await orAsk({ fetchImpl: f });
  const { url, init } = f.calls[0], body = JSON.parse(init.body);
  assert.strictEqual(url, 'https://openrouter.ai/api/alpha/decisions');
  assert.strictEqual(body.model, 'typesafe/jev-1.13'); assert.ok(!/latest|~/.test(body.model), 'an alias');
  assert.deepStrictEqual(body.provider, { data_collection: 'deny' });
  assert.strictEqual(body.state, STATE); assert.deepStrictEqual(Object.keys(body).sort(), ['model', 'provider', 'questions', 'state']);
  assert.strictEqual(init.method, 'POST'); assert.strictEqual(init.headers.Authorization, `Bearer ${OR_KEY}`);
  assert.ok(!init.body.includes(OR_KEY), 'the key is in the body');
});
test('REQUEST: a boolean question goes as OpenRouter\'s noul with its criteria and instructions; choice and score go unchanged; the schema object is not mutated', async () => {
  const before = JSON.stringify(SCHEMA); const f = stub(200, OR_GOOD); await orAsk({ fetchImpl: f });
  const q = JSON.parse(f.calls[0].init.body).questions;
  assert.deepStrictEqual(q.colour, { type: 'noul', instructions: SCHEMA.questions.colour.instructions, criteria: SCHEMA.questions.colour.criteria });
  assert.deepStrictEqual(q.route, SCHEMA.questions.route); assert.deepStrictEqual(q.level, SCHEMA.questions.level);
  assert.strictEqual(JSON.stringify(SCHEMA), before);
});
const Q3_SHAPE = { questions: { q3: { type: 'choice', instructions: 'Does the sentence state anything the output does not show?', criteria: { YES: 'YES (it states something the output does not show)', NO: 'NO', CANT_TELL: "CAN'T TELL" } } } };
const Q3_ANSWER = { id: 'g', model: RESOLVED, answers: { q3: { type: 'choice', choice: 'NO', confidence: 0.8, probabilities: { YES: 0.1, NO: 0.8, CANT_TELL: 0.1 } } }, usage: { input_tokens: 9, output_tokens: 1, cost: 0.00001 } };
test('REQUEST: a record of questions with criteria as {option: text}, the shape of D162 sealed Q3 schema, goes as it is with no translation', async () => {
  const f = stub(200, Q3_ANSWER); const r = await J.ask({ schema: Q3_SHAPE, state: 'a command output and a sentence', env: OR_ENV, route: 'openrouter', fetchImpl: f });
  assert.deepStrictEqual(JSON.parse(f.calls[0].init.body).questions, Q3_SHAPE.questions); assert.strictEqual(r.answers.q3.choice, 'NO');
});
test('REQUEST: the sealed Q3 schema FILE (consonance/jev/schemas/q3_2026-09-27.json) is unchanged (sha256 05c28c63...) and its questions go untranslated (skipped when the file is not beside this one, as in the mutants temp copy)', async (t) => {
  const file = path.join(__dirname, '..', 'jev', 'schemas', 'q3_2026-09-27.json');
  if (!fs.existsSync(file)) { t.skip('the sealed schema file is not beside this copy'); return; }
  const text = fs.readFileSync(file, 'utf8');
  assert.ok(require('crypto').createHash('sha256').update(text).digest('hex').startsWith('05c28c633415ea91'), 'the sealed Q3 schema changed');
  const q3 = JSON.parse(text), f = stub(200, Q3_ANSWER); await J.ask({ schema: q3, state: 'a command output and a sentence', env: OR_ENV, route: 'openrouter', fetchImpl: f });
  assert.deepStrictEqual(JSON.parse(f.calls[0].init.body).questions, q3.questions);
});

// the response mapping
test('MAPPING: noul becomes a boolean probability, choice and score pass through, usage and id and the RESOLVED model are recorded', async () => {
  const r = await orAsk({ fetchImpl: stub(200, OR_GOOD) });
  assert.strictEqual(r.route, 'openrouter'); assert.strictEqual(r.model, RESOLVED); assert.strictEqual(r.provider, 'TypeSafe');
  assert.deepStrictEqual(r.answers.colour, { type: 'boolean', probability: 0.97 });
  assert.strictEqual(r.answers.route.choice, 'study'); assert.strictEqual(r.answers.route.confidence, 0.9); assert.strictEqual(r.answers.level.score, 1.8);
  assert.deepStrictEqual(r.usage, { inputTokens: 351, outputTokens: 70, cost: 0.000014322 }); assert.strictEqual(r.cost, '0.000014322');
  assert.strictEqual(r.generationId, 'gen-dec-1790015143-test'); assert.strictEqual(typeof r.ms, 'number');
});
test('MAPPING: a missing usage or cost is null (NOT REPORTED), never zero', async () => {
  const { usage, ...noUsage } = OR_GOOD; let r = await orAsk({ fetchImpl: stub(200, noUsage) });
  assert.strictEqual(r.usage, null); assert.strictEqual(r.cost, null);
  r = await orAsk({ fetchImpl: stub(200, { ...OR_GOOD, usage: { input_tokens: 5, output_tokens: 1 } }) }); assert.strictEqual(r.cost, null); assert.strictEqual(r.usage.cost, null);
});
test('MAPPING: the ledger row of an openrouter result carries the route, the model and the generation id, and no text', async () => {
  const r = await orAsk({ fetchImpl: stub(200, OR_GOOD) }), row = J.ledgerRow(r, JSON.stringify(SCHEMA), STATE);
  assert.strictEqual(row.route, 'openrouter'); assert.strictEqual(row.model, RESOLVED); assert.strictEqual(row.generationId, 'gen-dec-1790015143-test'); assert.strictEqual(row.inputTokens, 351);
  assert.ok(!JSON.stringify(row).includes(STATE) && !JSON.stringify(row).includes(OR_KEY));
});
test('MAPPING: an answer missing for a declared question, a noul answer to a non-boolean question, a choice outside the options, and a probability outside [0, 1] are GatewayErrors', async () => {
  const wrong = (answers) => assert.rejects(orAsk({ fetchImpl: stub(200, { ...OR_GOOD, answers }) }), (e) => e instanceof J.GatewayError && e.exitCode === 1);
  await wrong({ colour: OR_GOOD.answers.colour, route: OR_GOOD.answers.route });
  await wrong({ ...OR_GOOD.answers, route: { type: 'noul', noul: 0.5 } });
  await wrong({ ...OR_GOOD.answers, route: { type: 'choice', choice: 'garage', probabilities: {} } });
  await wrong({ ...OR_GOOD.answers, colour: { type: 'noul', noul: 1.5 } });
});

// refusals before the network, and the failures that must not invent an answer
test('MISSING KEY: the openrouter route REFUSES loudly (exit 2) and never touches the network', async () => {
  const f = stub(200, OR_GOOD);
  await refuses(J.ask({ schema: SCHEMA, state: STATE, env: {}, fetchImpl: f, route: 'openrouter' }), /no OPENROUTER_API_KEY/);
  await refuses(J.ask({ schema: SCHEMA, state: STATE, env: { OPENROUTER_API_KEY: '   ' }, fetchImpl: f, route: 'openrouter' }), /no OPENROUTER_API_KEY/);
  assert.strictEqual(f.calls.length, 0);
});
for (const status of [400, 401, 402, 403, 404, 413, 429, 500, 502, 503, 524, 529]) {
  test(`HTTP ${status}: a GatewayError (exit 1) with the status, no answer invented, and nothing key-shaped printed`, async () => {
    const echoed = 'sk-' + 'or-' + 'v1-' + R(24), body = { error: { code: status, message: `insufficient credits for key ${echoed} and ${OR_KEY}` } };
    await assert.rejects(orAsk({ fetchImpl: stub(status, body) }), (e) => {
      assert.ok(e instanceof J.GatewayError && e.exitCode === 1 && !(e instanceof J.Refusal));
      assert.ok(e.message.includes(`HTTP ${status}`)); assert.ok(!e.message.includes(OR_KEY) && !e.message.includes(echoed), 'a key-shaped token was printed');
      return true;
    });
  });
}
test('HTTP 200 with a body that is not JSON, or an unusable answers object, is a GatewayError', async () => {
  await assert.rejects(orAsk({ fetchImpl: stub(200, '<html>') }), (e) => e instanceof J.GatewayError && /not JSON/.test(e.message));
  await assert.rejects(orAsk({ fetchImpl: stub(200, { ...OR_GOOD, answers: null }) }), (e) => e instanceof J.GatewayError);
});
test('REDACTION: a gateway error that echoes the OTHER route key value (not key-shaped) is scrubbed too, on the openrouter route', async () => {
  await assert.rejects(orAsk({ env: { ...OR_ENV, ...ENV }, fetchImpl: stub(500, { error: `upstream said ${FAKE_KEY}` }) }), (e) => e instanceof J.GatewayError && !e.message.includes(FAKE_KEY) && /HTTP 500/.test(e.message));
});
test('A NETWORK FAILURE is a GatewayError with the key scrubbed from whatever the transport said', async () => {
  const f = async () => { throw new Error(`connect failed with Bearer ${OR_KEY}`); };
  await assert.rejects(orAsk({ fetchImpl: f }), (e) => e instanceof J.GatewayError && !e.message.includes(OR_KEY));
});

// the resolved model
for (const bad of ['typesafe-ai/jev', 'typesafe/jev-1.12-20260101', 'typesafe/jev-1.13', 'typesafe/jev-1.130-x', 'typesafe/jev-1.13-', '~typesafe/jev-latest', 'openai/gpt-4o', 'xtypesafe/jev-1.13-20260917', 'typesafe/jev-1.13-20260917 ', '', null, undefined, 42]) {
  test(`RESOLVED MODEL ${JSON.stringify(bad)} is REFUSED loudly (exit 2): the answers are discarded and the generation id is named for the accounts`, async () => {
    const body = { ...OR_GOOD, model: bad }; if (bad === undefined) delete body.model;
    await assert.rejects(orAsk({ fetchImpl: stub(200, body) }), (e) => {
      assert.ok(e instanceof J.Refusal && e.exitCode === 2, `not a Refusal: ${e && e.constructor && e.constructor.name}`);
      assert.match(e.message, /not typesafe\/jev-1\.13-\*/); assert.match(e.message, /gen-dec-1790015143-test/); assert.match(e.message, /answers are discarded/);
      return true;
    });
  });
}
test('RESOLVED MODEL: a dated jev-1.13 version is accepted whatever its suffix (the next patch release is not a fallback)', async () => {
  for (const m of ['typesafe/jev-1.13-20260917', 'typesafe/jev-1.13-20261201', 'typesafe/jev-1.13-rc.2']) assert.strictEqual((await orAsk({ fetchImpl: stub(200, { ...OR_GOOD, model: m }) })).model, m);
});

// secrets: the openrouter and vercel key shapes, the key's own value, both routes' keys, the logs
test('SECRET SCAN: an sk-or- key in the state is named openrouter-key (not only as an openai-style key), a vck_ key vercel-gateway-key, and neither is printed', async () => {
  const orTok = 'sk-' + 'or-' + 'v1-' + R(24), vck = 'vc' + 'k_' + R(24);
  const hits = J.findSecrets(`here is ${orTok} and ${vck}`, {}, []);
  assert.ok(hits.some((h) => h.pattern === 'openrouter-key'), JSON.stringify(hits)); assert.ok(hits.some((h) => h.pattern === 'vercel-gateway-key'), JSON.stringify(hits));
  const f = stub(200, OR_GOOD);
  await assert.rejects(orAsk({ fetchImpl: f, state: `${STATE} ${orTok}` }), (e) => e instanceof J.Refusal && /openrouter-key/.test(e.message) && !e.message.includes(orTok));
  assert.strictEqual(f.calls.length, 0);
});
test('SECRET SCAN: the OPENROUTER key\'s own value in the state, and the VERCEL key\'s value too, on the openrouter route (both keys are checked on either route)', async () => {
  const f = stub(200, OR_GOOD);
  await assert.rejects(orAsk({ fetchImpl: f, state: `${STATE} (${OR_KEY})` }), (e) => e instanceof J.Refusal && /the-key-itself/.test(e.message) && !e.message.includes(OR_KEY));
  await assert.rejects(orAsk({ fetchImpl: f, env: { ...OR_ENV, ...ENV }, state: `${STATE} (${FAKE_KEY})` }), (e) => e instanceof J.Refusal && /the-key-itself/.test(e.message) && !e.message.includes(FAKE_KEY));
  assert.strictEqual(f.calls.length, 0);
});
test('REDACTION: scrub removes the key\'s own value AND any sk-or- or vck_ shaped token, and names the variable', () => {
  const t = 'sk-' + 'or-' + 'v1-' + R(24), v = 'vc' + 'k_' + R(24);
  const out = J.scrub(`a ${OR_KEY} b ${t} c ${v} d`, OR_KEY, 'OPENROUTER_API_KEY');
  assert.ok(!out.includes(OR_KEY) && !out.includes(t) && !out.includes(v), out); assert.match(out, /<OPENROUTER_API_KEY>/);
  assert.ok(!J.scrub(`x ${FAKE_KEY}`, [FAKE_KEY, OR_KEY]).includes(FAKE_KEY), 'an array of keys is each scrubbed');
  assert.strictEqual(J.scrub('no key here', ''), 'no key here');
});
test('REDACTION in the logs: the CLI prints neither key nor a key-shaped token on stdout or stderr when a refusal or a failure echoes one', () => {
  const schemaFile = path.join(os.tmpdir(), `jev-or2-${process.pid}.schema.json`), stateFile = path.join(os.tmpdir(), `jev-or2-${process.pid}.state.txt`);
  fs.writeFileSync(schemaFile, JSON.stringify(SCHEMA)); fs.writeFileSync(stateFile, `${STATE} ${OR_KEY}`);
  try {
    const env = { ...process.env, OPENROUTER_API_KEY: OR_KEY }; delete env.AI_GATEWAY_API_KEY;
    const r = spawnSync(process.execPath, [TOOL, '--schema', schemaFile, '--state', stateFile, '--route', 'openrouter'], { encoding: 'utf8', env });
    assert.strictEqual(r.status, 2); assert.match(r.stderr, /REFUSED[\s\S]*the-key-itself/); assert.ok(!(r.stdout + r.stderr).includes(OR_KEY));
  } finally { fs.rmSync(schemaFile, { force: true }); fs.rmSync(stateFile, { force: true }); }
});
test('the Vercel route\'s answer shape is unchanged: no route, provider or translation fields appear on it', async () => {
  const r = await J.ask({ schema: SCHEMA, state: STATE, env: ENV, fetchImpl: stub(200, GOOD) });
  assert.deepStrictEqual(Object.keys(r).sort(), ['answers', 'cost', 'generationId', 'model', 'ms', 'usage']); assert.strictEqual(r.answers.colour.type, 'boolean');
});

// ------------------------------------------------------------------ the one live call, opt-in twice over

test('LIVE smoke (opt-in: AI_GATEWAY_API_KEY and JEV_LIVE_SMOKE=1) — one throwaway call, about 351 input tokens, about $0.000015', async (t) => {
  const why = !process.env.AI_GATEWAY_API_KEY ? 'AI_GATEWAY_API_KEY is not set in this process'
    : process.env.JEV_LIVE_SMOKE !== '1' ? 'JEV_LIVE_SMOKE is not 1 — a live call is never made by default' : null;
  if (why) {
    console.log(`NOT-RUN: live smoke — ${why}`);
    t.skip(`NOT-RUN: ${why}`);
    return;
  }
  const schema = { questions: {
    colour: { type: 'boolean', instructions: 'Does the text mention a colour?', criteria: { true: 'a colour is named', false: 'no colour is named' } },
    dog: { type: 'boolean', instructions: 'Does the text mention a dog?', criteria: { true: 'a dog is mentioned', false: 'no dog is mentioned' } },
  } };
  const r = await J.ask({ schema, state: STATE });
  console.log(`LIVE: model=${r.model} colour=${r.answers.colour.probability} dog=${r.answers.dog.probability} `
    + `inputTokens=${r.usage && r.usage.inputTokens} cost=${r.cost} ms=${r.ms}`);
  assert.ok(r.answers.colour.probability > r.answers.dog.probability, 'a blue chair and a cat: colour should beat dog');
});
