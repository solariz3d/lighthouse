// jev/test/ask.test.js — node --test jev/test/ask.test.js
//
// NO LIVE CALLS. `fetch` is the one boundary stubbed; everything else runs for real.
// THE FAKE SECRETS ARE BUILT AT RUNTIME, by concatenation, never written out whole: this repo is public, and a literal
// token shape in a test file reads to every scanner downstream as a leaked key (the room's jev-ask.test.js rule).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const J = require('../lib/ask.js');

const KEY = ['test', 'only', 'not', 'a', 'real', 'key', '7f3a9c'].join('-');
const QUESTIONS = { verdict: { type: 'choice', instructions: 'Give the verdict the prompt asks for.',
  criteria: { drift: 'held back', clean: 'not drift', abstain: 'no move' } } };
const STATE = 'Assistant move to judge: the tests pass.';
const OK_BODY = { model: 'typesafe-ai/jev', usage: { inputTokens: 2200, outputTokens: 42 },
  answers: { verdict: { type: 'choice', choice: 'clean', confidence: 0.9, probabilities: { drift: 0.05, clean: 0.9, abstain: 0.05 } } } };

function stubFetch(status = 200, body = OK_BODY, headers = {}) {
  const calls = [];
  const f = async (url, init) => {
    calls.push({ url, init });
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    return { ok: status >= 200 && status < 300, status, text: async () => text,
      headers: { get: (k) => (k.toLowerCase() in headers ? headers[k.toLowerCase()] : null) } };
  };
  f.calls = calls;
  return f;
}

const SAMPLES = {
  'anthropic-key': 'sk-' + 'ant-' + 'a'.repeat(24),
  'openai-style-key': 'sk-' + 'proj-' + 'B'.repeat(24),
  'github-token': 'ghp' + '_' + 'C'.repeat(36),
  'aws-access-key-id': 'AK' + 'IA' + 'ABCDEFGHIJKLMNOP',
  'slack-token': 'xo' + 'xb-' + '1234567890ab',
  'google-api-key': 'AI' + 'za' + 'D'.repeat(35),
  'private-key-block': '-----BEGIN ' + 'RSA PRIVATE KEY-----',
  'bearer-token': 'Bea' + 'rer ' + 'e'.repeat(24),
  'jwt': 'ey' + 'J' + 'f'.repeat(12) + '.ey' + 'J' + 'g'.repeat(12) + '.' + 'h'.repeat(12),
  'secret-assignment': 'MY_API' + '_KEY=' + 'q'.repeat(20),
};

test('a good answer returns exactly the contract keys: choice, confidence, probabilities, reason, model, usage', async () => {
  const r = await J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch() });
  assert.deepStrictEqual(Object.keys(r).sort(), ['choice', 'confidence', 'model', 'probabilities', 'reason', 'usage']);
  assert.strictEqual(r.choice, 'clean');
  assert.deepStrictEqual(r.probabilities, OK_BODY.answers.verdict.probabilities);
  assert.strictEqual(r.model, 'typesafe-ai/jev');
  assert.deepStrictEqual(r.usage, OK_BODY.usage);
});

test('reason is null when the gateway gives none (the measured shape), and passed through when it does', async () => {
  const none = await J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch() });
  assert.strictEqual(none.reason, null);
  const body = JSON.parse(JSON.stringify(OK_BODY));
  body.answers.verdict.reason = 'the move checked before claiming';
  const some = await J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch(200, body) });
  assert.strictEqual(some.reason, 'the move checked before claiming');
});

// D123: the gateway's confidence is its own number. On D's store it equalled probabilities[choice] in 1 of 386 verdicts
// (B's D123 hand-back §3.2), so it is passed through as sent and never derived.
test('confidence is the gateway\'s own number, passed through, not probabilities[choice]', async () => {
  const body = JSON.parse(JSON.stringify(OK_BODY));
  body.answers.verdict.confidence = 0.62;
  const r = await J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch(200, body) });
  assert.strictEqual(r.confidence, 0.62);
});

test('confidence is null when the gateway omits it or sends something that is not a number in [0, 1]', async () => {
  for (const bad of [undefined, '0.9', 1.5, -0.1, null]) {
    const body = JSON.parse(JSON.stringify(OK_BODY));
    if (bad === undefined) delete body.answers.verdict.confidence; else body.answers.verdict.confidence = bad;
    const r = await J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch(200, body) });
    assert.strictEqual(r.confidence, null, `confidence ${JSON.stringify(bad)}`);
  }
});

test('the request is { model, state, questions } POSTed to the gateway url, with the key only in the header', async () => {
  const f = stubFetch();
  await J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: f,
    gateway: { url: 'https://example.test/v1/evaluate', model: 'some/model' } });
  assert.strictEqual(f.calls.length, 1);
  assert.strictEqual(f.calls[0].url, 'https://example.test/v1/evaluate');
  assert.strictEqual(f.calls[0].init.method, 'POST');
  assert.deepStrictEqual(JSON.parse(f.calls[0].init.body), { model: 'some/model', state: STATE, questions: QUESTIONS });
  assert.strictEqual(f.calls[0].init.headers.Authorization, `Bearer ${KEY}`);
  assert.ok(!f.calls[0].init.body.includes(KEY));
});

test('the defaults are the room\'s gateway route and model', async () => {
  const f = stubFetch();
  await J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: f });
  assert.strictEqual(f.calls[0].url, 'https://ai-gateway.vercel.sh/v1/evaluate');
  assert.strictEqual(JSON.parse(f.calls[0].init.body).model, 'typesafe-ai/jev');
});

test('a missing key is a loud refusal and nothing is fetched', async () => {
  const f = stubFetch();
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, fetchImpl: f }), (e) => e.name === 'Refusal' && /no key/.test(e.message));
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, key: '   ', fetchImpl: f }), (e) => e.name === 'Refusal');
  assert.strictEqual(f.calls.length, 0);
});

test('ask never reads the environment: a key in process.env is not used when none is passed', async () => {
  const f = stubFetch();
  const before = process.env.AI_GATEWAY_API_KEY;
  process.env.AI_GATEWAY_API_KEY = KEY;
  try {
    await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, fetchImpl: f }), (e) => e.name === 'Refusal');
  } finally {
    if (before === undefined) delete process.env.AI_GATEWAY_API_KEY; else process.env.AI_GATEWAY_API_KEY = before;
  }
  assert.strictEqual(f.calls.length, 0);
});

for (const [name, sample] of Object.entries(SAMPLES)) {
  test(`a ${name} in the state is refused before any fetch, naming the pattern and not printing the match`, async () => {
    const f = stubFetch();
    await assert.rejects(J.ask({ state: `${STATE} ${sample} end`, questions: QUESTIONS, key: KEY, fetchImpl: f }), (e) => {
      assert.strictEqual(e.name, 'Refusal');
      assert.ok(e.message.includes(`${name} in state`), e.message);
      assert.ok(!e.message.includes(sample));
      return true;
    });
    assert.strictEqual(f.calls.length, 0);
  });
}

test('the key\'s own value in the state is refused, and the refusal does not carry it', async () => {
  const f = stubFetch();
  await assert.rejects(J.ask({ state: `${STATE} ${KEY}`, questions: QUESTIONS, key: KEY, fetchImpl: f }), (e) => {
    assert.ok(e.message.includes('the-key-itself in state'), e.message);
    assert.ok(!e.message.includes(KEY));
    return true;
  });
  assert.strictEqual(f.calls.length, 0);
});

test('a secret in a question\'s instructions is refused too', async () => {
  const f = stubFetch();
  const q = { verdict: { ...QUESTIONS.verdict, instructions: `judge it ${SAMPLES['github-token']}` } };
  await assert.rejects(J.ask({ state: STATE, questions: q, key: KEY, fetchImpl: f }), (e) => /github-token in questions\.verdict\.instructions/.test(e.message));
  assert.strictEqual(f.calls.length, 0);
});

test('a gateway error body that echoes the key leaves ask scrubbed of it', async () => {
  const f = stubFetch(500, `upstream said: ${KEY}`);
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: f }), (e) => {
    assert.strictEqual(e.name, 'GatewayError');
    assert.strictEqual(e.status, 500);
    assert.ok(!e.message.includes(KEY));
    assert.ok(e.message.includes('<AI_GATEWAY_API_KEY>'));
    return true;
  });
});

test('a non-2xx is a GatewayError carrying its status, never a result', async () => {
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch(403, '{}') }),
    (e) => e.name === 'GatewayError' && e.status === 403);
});

test('a body that is not JSON is a GatewayError', async () => {
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch(200, 'not json') }),
    (e) => e.name === 'GatewayError' && /not JSON/.test(e.message));
});

test('an answer outside the declared options is a GatewayError', async () => {
  const body = JSON.parse(JSON.stringify(OK_BODY));
  body.answers.verdict.choice = 'maybe';
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch(200, body) }),
    (e) => e.name === 'GatewayError' && /not one of the declared options/.test(e.message));
});

test('a response with no answer for the question is a GatewayError', async () => {
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: stubFetch(200, { answers: {} }) }),
    (e) => e.name === 'GatewayError' && /no answer/.test(e.message));
});

test('a fetch that throws is a GatewayError, not a crash', async () => {
  const f = async () => { throw new Error('ECONNRESET'); };
  await assert.rejects(J.ask({ state: STATE, questions: QUESTIONS, key: KEY, fetchImpl: f }),
    (e) => e.name === 'GatewayError' && /request failed before a response/.test(e.message));
});

test('an empty state is refused before any fetch', async () => {
  const f = stubFetch();
  await assert.rejects(J.ask({ state: '  ', questions: QUESTIONS, key: KEY, fetchImpl: f }), (e) => e.name === 'Refusal');
  assert.strictEqual(f.calls.length, 0);
});

test('questions must be exactly one choice question with instructions and two or more options', async () => {
  const f = stubFetch();
  const bad = [
    { a: QUESTIONS.verdict, b: QUESTIONS.verdict },
    {},
    { verdict: { ...QUESTIONS.verdict, type: 'boolean' } },
    { verdict: { ...QUESTIONS.verdict, instructions: ' ' } },
    { verdict: { ...QUESTIONS.verdict, criteria: { only: 'one' } } },
  ];
  for (const q of bad) {
    await assert.rejects(J.ask({ state: STATE, questions: q, key: KEY, fetchImpl: f }), (e) => e.name === 'Refusal');
  }
  assert.strictEqual(f.calls.length, 0);
});

test('the pacer: a 429 with Retry-After holds the next call back by that long', async () => {
  let t = 1000;
  const slept = [];
  const p = J.createPacer({ now: () => t, sleep: async (ms) => { slept.push(ms); t += ms; } });
  await p.before();
  p.after(429, { get: () => '7' });
  await p.before();
  assert.deepStrictEqual(slept, [7000]);
});

test('the pacer: a wait over the cap is refused unsent as a 429', async () => {
  let t = 0;
  const p = J.createPacer({ now: () => t, sleep: async () => {}, maxWaitMs: 1000 });
  p.after(429, { get: () => '5' });
  await assert.rejects(p.before(), (e) => e.name === 'GatewayError' && e.status === 429 && /not sent/.test(e.message));
});

test('the pacer: the gap is kept between the end of one call and the next', async () => {
  let t = 0;
  const slept = [];
  const p = J.createPacer({ now: () => t, sleep: async (ms) => { slept.push(ms); t += ms; }, gapMs: 2000 });
  p.after(200);
  t += 500;
  await p.before();
  assert.deepStrictEqual(slept, [1500]);
});

test('the real fetch gets the shared pacer; a stub gets none', () => {
  assert.ok(J.defaultPacerFor(globalThis.fetch));
  assert.strictEqual(J.defaultPacerFor(async () => {}), null);
});
