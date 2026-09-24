// jev-shadow.test.js — node --test consonance/tools/jev-shadow.test.js
//
// NO LIVE CALLS. `fetch` is the one boundary stubbed. The shell dir is a FIXTURE: temp job files, temp verdict
// ledgers, and COPIES of the repo's real overseer workers (dev/shell/hooks/l{2,3}-overseer-worker.js), so the prompt
// the capture builds is checked against the real builder, not against a restatement of it.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const S = require('./jev-shadow.js');

const REPO_HOOKS = path.resolve(__dirname, '..', '..', 'dev', 'shell', 'hooks');
const TOOL = path.join(__dirname, 'jev-shadow.js');
const KEY = { AI_GATEWAY_API_KEY: ['test', 'only', 'shadow', 'key', '4c1e'].join('-') };
const METHOD = '# METHOD (fixture)\nthe discipline text for L0\n';
const WELFARE = '# WELFARE (fixture)\nthe discipline text for L3\n';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-shadow-'));
  const shell = path.join(root, 'shell');
  const disc = path.join(root, 'lighthouse');
  const store = path.join(root, 'store');
  for (const d of ['hooks', 'l2-jobs', 'l3-jobs']) fs.mkdirSync(path.join(shell, d), { recursive: true });
  fs.mkdirSync(disc);
  for (const w of ['l2-overseer-worker.js', 'l3-overseer-worker.js']) fs.copyFileSync(path.join(REPO_HOOKS, w), path.join(shell, 'hooks', w));
  fs.writeFileSync(path.join(disc, 'METHOD.md'), METHOD);
  fs.writeFileSync(path.join(disc, 'WELFARE.md'), WELFARE);
  fs.writeFileSync(path.join(shell, 'l2_overseer.jsonl'), '');
  fs.writeFileSync(path.join(shell, 'l3_overseer.jsonl'), '');
  return { root, shell, disc, store, opts: { shellDir: shell, disciplineDir: disc, store } };
}
const l2Job = (f, id, move = 'the assistant said a thing', user = 'the user asked') => {
  const j = { job_id: id, created_at: '2026-09-21T18:00:00.000Z', session_id: 'sess-' + id, view: { assistant_move: move, user_context: user } };
  fs.writeFileSync(path.join(f.shell, 'l2-jobs', id + '.json'), JSON.stringify(j));
  return j;
};
const l3Job = (f, id, texts = ['first', 'second']) => {
  const j = { job_id: id, created_at: '2026-09-21T18:00:00.000Z', session_id: 'sess-' + id,
    user_turns: texts.map((t, i) => ({ timestamp: `2026-09-21T17:0${i}:00.000Z`, text: t })) };
  fs.writeFileSync(path.join(f.shell, 'l3-jobs', id + '.json'), JSON.stringify(j));
  return j;
};
const verdict = (f, judge, id, answer) => {
  const row = judge === 'l2'
    ? { type: 'l2_overseer_verdict', timestamp: '2026-09-21T18:00:30.000Z', job_id: id, verdict: answer, determinable: answer !== 'abstain', schema_valid: true }
    : { type: 'l3_overseer_verdict', timestamp: '2026-09-21T18:00:30.000Z', job_id: id, trajectory: answer, recommendation: 'none' };
  fs.appendFileSync(path.join(f.shell, `${judge}_overseer.jsonl`), JSON.stringify(row) + '\n');
};
/** A stubbed gateway that answers each question with the given choice. */
function gateway(choices = {}) {
  const calls = [];
  const f = async (url, init) => {
    calls.push(JSON.parse(init.body));
    const q = JSON.parse(init.body).questions;
    const answers = Object.fromEntries(Object.keys(q).map((k) => {
      const opts = Object.keys(q[k].criteria);
      const c = choices[k] || opts[0];
      return [k, { type: 'choice', choice: c, probabilities: Object.fromEntries(opts.map((o) => [o, o === c ? 0.9 : 0.1 / (opts.length - 1)])) }];
    }));
    const body = { model: 'typesafe-ai/jev', answers, usage: { inputTokens: 1000, outputTokens: 0 }, providerMetadata: { gateway: { cost: '0.000042', generationId: 'gen_x' } } };
    return { ok: true, status: 200, text: async () => JSON.stringify(body) };
  };
  f.calls = calls;
  return f;
}
const ledger = (f) => { const p = path.join(f.store, 'shadow.jsonl'); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []; };

// ------------------------------------------------------------------ capture: the judged input, exactly

test('capture stores the EXACT prompt the installed L2 worker builds from the job', () => {
  const f = fixture();
  const job = l2Job(f, 'j1');
  const r = S.capture(f.opts);
  assert.strictEqual(r.l2.captured, 1);
  const cap = JSON.parse(fs.readFileSync(path.join(f.store, 'captures', 'l2', 'j1.json'), 'utf8'));
  const expected = require(path.join(f.shell, 'hooks', 'l2-overseer-worker.js')).buildOverseerPrompt(job.view, METHOD);
  assert.strictEqual(cap.prompt, expected);
  assert.strictEqual(cap.job_id, 'j1');
});

test('capture stores the exact L3 prompt WITHOUT loading the L3 worker (it runs main() when required)', () => {
  const f = fixture();
  l3Job(f, 'k1', ['alpha turn', 'beta turn']);
  const r = S.capture(f.opts);
  assert.strictEqual(r.l3.captured, 1);
  const cap = JSON.parse(fs.readFileSync(path.join(f.store, 'captures', 'l3', 'k1.json'), 'utf8'));
  assert.ok(cap.prompt.startsWith('You are an L3 overseer'), 'not the L3 prompt');
  assert.ok(cap.prompt.includes(WELFARE) && cap.prompt.includes('alpha turn') && cap.prompt.includes('[turn 0 (most recent), '));
  // The job file is still there: loading the worker would have processed and deleted it.
  assert.ok(fs.existsSync(path.join(f.shell, 'l3-jobs', 'k1.json')), 'the L3 job was consumed — the worker ran');
});

test('capture is idempotent: a job is captured once', () => {
  const f = fixture();
  l2Job(f, 'j1');
  S.capture(f.opts);
  assert.strictEqual(S.capture(f.opts).l2.captured, 0);
});

test('capture never writes into the shell dir it reads', () => {
  const f = fixture();
  l2Job(f, 'j1'); l3Job(f, 'k1');
  const before = JSON.stringify(fs.readdirSync(f.shell, { recursive: true }).sort());
  S.capture(f.opts);
  assert.strictEqual(JSON.stringify(fs.readdirSync(f.shell, { recursive: true }).sort()), before);
});

test('capture REFUSES loudly if the L3 builder cannot be found in the installed worker', () => {
  const f = fixture();
  fs.writeFileSync(path.join(f.shell, 'hooks', 'l3-overseer-worker.js'), '// renamed everything\n');
  l3Job(f, 'k1');
  // The fixture removed both functions; the refusal names the first it looked for.
  assert.throws(() => S.capture(f.opts), (e) => e instanceof S.Refusal && /formatTurns|buildOverseerPrompt/.test(e.message));
});

test('capture REFUSES loudly if a discipline file is missing — the prompt would not be the one judged', () => {
  const f = fixture();
  fs.rmSync(path.join(f.disc, 'METHOD.md'));
  l2Job(f, 'j1');
  assert.throws(() => S.capture(f.opts), (e) => e instanceof S.Refusal && /METHOD\.md/.test(e.message));
});

test('no store path: REFUSES — there is no default location (an unplaced data-dir file blocks close)', () => {
  const f = fixture();
  assert.throws(() => S.capture({ ...f.opts, store: undefined }), (e) => e instanceof S.Refusal && /store/.test(e.message));
});

// ------------------------------------------------------------------ shadow: ask Jev, same question, same answers

test('shadow pairs a capture with its verdict by job_id, asks Jev once, and appends both answers', async () => {
  const f = fixture();
  l2Job(f, 'j1'); S.capture(f.opts); verdict(f, 'l2', 'j1', 'drift');
  const g = gateway({ verdict: 'clean' });
  const r = await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: g });
  assert.strictEqual(r.asked, 1);
  assert.strictEqual(g.calls.length, 1);
  const row = ledger(f)[0];
  assert.strictEqual(row.judge, 'l2');
  assert.strictEqual(row.job_id, 'j1');
  assert.strictEqual(row.overseer, 'drift');
  assert.strictEqual(row.jev.verdict.choice, 'clean');
  assert.strictEqual(row.cost, '0.000042');
  assert.deepStrictEqual(row.usage, { inputTokens: 1000, outputTokens: 0 });
});

test('the question is the SAME answer set as the overseer\'s: L2 drift|clean|abstain; L3 four trajectories + four recommendations', async () => {
  const f = fixture();
  l2Job(f, 'j1'); l3Job(f, 'k1'); S.capture(f.opts);
  verdict(f, 'l2', 'j1', 'clean'); verdict(f, 'l3', 'k1', 'stable');
  const g = gateway();
  await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: g });
  const byJudge = Object.fromEntries(g.calls.map((b) => [Object.keys(b.questions).join(), b]));
  assert.deepStrictEqual(Object.keys(byJudge['verdict'].questions.verdict.criteria), ['drift', 'clean', 'abstain']);
  assert.deepStrictEqual(Object.keys(byJudge['trajectory,recommendation'].questions.trajectory.criteria), ['stable', 'deepening', 'quiet_spiral', 'crisis']);
  assert.deepStrictEqual(Object.keys(byJudge['trajectory,recommendation'].questions.recommendation.criteria), ['none', 'slow', 'name', 'refer_to_human']);
});

test('the state sent is the captured prompt, byte for byte', async () => {
  const f = fixture();
  l2Job(f, 'j1'); S.capture(f.opts); verdict(f, 'l2', 'j1', 'clean');
  const cap = JSON.parse(fs.readFileSync(path.join(f.store, 'captures', 'l2', 'j1.json'), 'utf8'));
  const g = gateway();
  await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: g });
  assert.strictEqual(g.calls[0].state, cap.prompt);
});

test('shadow is idempotent: a verdict is shadowed once', async () => {
  const f = fixture();
  l2Job(f, 'j1'); S.capture(f.opts); verdict(f, 'l2', 'j1', 'clean');
  await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: gateway() });
  const g = gateway();
  const r = await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: g });
  assert.strictEqual(r.asked, 0);
  assert.strictEqual(g.calls.length, 0);
  assert.strictEqual(ledger(f).length, 1);
});

test('the per-run cap is HARD: five eligible, --max-calls 2 → exactly two calls; the next run takes the next two', async () => {
  const f = fixture();
  for (const id of ['a', 'b', 'c', 'd', 'e']) { l2Job(f, id); }
  S.capture(f.opts);
  for (const id of ['a', 'b', 'c', 'd', 'e']) verdict(f, 'l2', id, 'clean');
  const g1 = gateway();
  const r1 = await S.shadow({ ...f.opts, maxCalls: 2, env: KEY, fetchImpl: g1 });
  assert.strictEqual(g1.calls.length, 2);
  assert.strictEqual(r1.remaining, 3);
  const g2 = gateway();
  await S.shadow({ ...f.opts, maxCalls: 2, env: KEY, fetchImpl: g2 });
  assert.strictEqual(g2.calls.length, 2);
  assert.strictEqual(ledger(f).length, 4);
});

test('the cap is required, and bounded', async () => {
  const f = fixture();
  await assert.rejects(S.shadow({ ...f.opts, env: KEY, fetchImpl: gateway() }), (e) => e instanceof S.Refusal && /max-calls/.test(e.message));
  await assert.rejects(S.shadow({ ...f.opts, maxCalls: S.HARD_CAP + 1, env: KEY, fetchImpl: gateway() }), (e) => e instanceof S.Refusal && /at most/.test(e.message));
  await assert.rejects(S.shadow({ ...f.opts, maxCalls: 0, env: KEY, fetchImpl: gateway() }), (e) => e instanceof S.Refusal);
});

test('no key: REFUSES loudly before any call', async () => {
  const f = fixture();
  l2Job(f, 'j1'); S.capture(f.opts); verdict(f, 'l2', 'j1', 'clean');
  const g = gateway();
  await assert.rejects(S.shadow({ ...f.opts, maxCalls: 5, env: {}, fetchImpl: g }), (e) => e instanceof S.Refusal && /AI_GATEWAY_API_KEY/.test(e.message));
  assert.strictEqual(g.calls.length, 0);
});

test('a captured prompt holding a secret is REFUSED (jev-ask\'s scan, inherited), recorded once, and the run goes on', async () => {
  const f = fixture();
  l2Job(f, 'bad', 'here is my key ' + 'gh' + 'p_' + 'Z'.repeat(36));
  l2Job(f, 'ok');
  S.capture(f.opts);
  verdict(f, 'l2', 'bad', 'clean'); verdict(f, 'l2', 'ok', 'clean');
  const g = gateway();
  const r = await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: g });
  assert.strictEqual(g.calls.length, 1, 'the secret-bearing prompt reached the gateway');
  assert.strictEqual(r.refused, 1);
  const bad = ledger(f).find((x) => x.job_id === 'bad');
  assert.strictEqual(bad.status, 'refused');
  assert.match(bad.why, /github-token/);
  assert.ok(!JSON.stringify(bad).includes('Z'.repeat(36)), 'the ledger carries the secret');
  // "Never retried" cannot be read off the call count — a refused item makes no call either way (mutant 8, D103,
  // survived exactly that assertion). It is read off the ledger: two runs, ONE refused row.
  const again = gateway();
  const r2 = await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: again });
  assert.strictEqual(r2.refused, 0, 'the second run refused the same item again');
  assert.strictEqual(ledger(f).filter((x) => x.job_id === 'bad').length, 1, 'a refused item was recorded twice');
});

test('a refusal that is NOT the secret scan stops the run and retires nothing (it is about the run, not the item)', async () => {
  const f = fixture();
  l2Job(f, 'j1'); S.capture(f.opts); verdict(f, 'l2', 'j1', 'clean');
  const cap = path.join(f.store, 'captures', 'l2', 'j1.json');
  fs.writeFileSync(cap, JSON.stringify({ ...JSON.parse(fs.readFileSync(cap, 'utf8')), prompt: '' }));   // a corrupted capture
  await assert.rejects(S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: gateway() }), (e) => e instanceof S.Refusal && /state is empty/.test(e.message));
  assert.strictEqual(ledger(f).length, 0, 'a run-level refusal was recorded against the item, retiring it forever');
});

// L079 changed this test's status from 500 to 401: a 5xx is now a SKIPPED item (the L078 rule, below), so the case that
// still ends the run is a failure every call would hit the same way — another 4xx, here a bad key.
test('a NON-transient gateway failure (401) STOPS the run, is surfaced, and writes no row for the failed item', async () => {
  const f = fixture();
  l2Job(f, 'a'); l2Job(f, 'b'); S.capture(f.opts);
  verdict(f, 'l2', 'a', 'clean'); verdict(f, 'l2', 'b', 'clean');
  const failing = async () => ({ ok: false, status: 401, text: async () => 'bad key' });
  await assert.rejects(S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: failing }), /HTTP 401/);
  assert.strictEqual(ledger(f).length, 0);
});

// ------------------------------------------------------------------ L079: a failed call SKIPS the item, it does not end the run
// The twin of A's L078 in jev-judge.js. One upstream 503 used to end the whole shadow run, on D, where the ~100-pair
// agreement count is being built. A failure about ONE call — 5xx, 429, a network failure, an answer that does not fit
// the schema — skips that item with NO row (so it is retried next run) and one log line (status + item id only).
// Any other 4xx still ends the run, and so do the secret-scan's and the run-level refusals, as before.

/** A gateway that answers normally except on the calls whose 1-based index is in `fail` → { status } or 'network'. */
function flaky(fail) {
  const ok = gateway();
  let n = 0;
  const f = async (url, init) => {
    n++;
    f.calls.push(JSON.parse(init.body));
    const how = fail[n];
    if (how === 'network') throw new Error('socket hang up');
    if (how) return { ok: false, status: how, text: async () => 'upstream said no — and this body could echo input' };
    return ok(url, init);
  };
  f.calls = [];
  return f;
}
const four = (f) => { for (const id of ['i1', 'i2', 'i3', 'i4']) { l2Job(f, id); } S.capture(f.opts); for (const id of ['i1', 'i2', 'i3', 'i4']) verdict(f, 'l2', id, 'clean'); };

test('SKIP: a 503 on item 2 of 4 — items 1, 3, 4 are shadowed, item 2 gets NO row and is retried next run', async () => {
  const f = fixture();
  four(f);
  const r1 = await S.shadow({ ...f.opts, maxCalls: 10, env: KEY, fetchImpl: flaky({ 2: 503 }) });
  assert.strictEqual(r1.asked, 3);
  assert.deepStrictEqual(ledger(f).map((x) => x.job_id), ['i1', 'i3', 'i4']);
  assert.deepStrictEqual(r1.failed, [{ key: 'l2:i2', status: 503 }]);
  const g2 = flaky({});
  const r2 = await S.shadow({ ...f.opts, maxCalls: 10, env: KEY, fetchImpl: g2 });
  assert.strictEqual(g2.calls.length, 1, 'an answered pair was re-asked');
  assert.strictEqual(r2.asked, 1);
  assert.deepStrictEqual(ledger(f).map((x) => x.job_id), ['i1', 'i3', 'i4', 'i2']);
});

test('SKIP: 429, 500, a network failure and an unusable answer are each skipped; a 4xx other than 429 ends the run', async () => {
  const f = fixture();
  four(f);
  const r = await S.shadow({ ...f.opts, maxCalls: 10, env: KEY, fetchImpl: flaky({ 1: 429, 2: 500, 3: 'network' }) });
  assert.deepStrictEqual(r.failed.map((x) => x.status), [429, 500, 'network']);
  assert.strictEqual(r.asked, 1);
  const f2 = fixture();
  four(f2);
  await assert.rejects(S.shadow({ ...f2.opts, maxCalls: 10, env: KEY, fetchImpl: flaky({ 2: 403 }) }), /HTTP 403/);
  assert.deepStrictEqual(ledger(f2).map((x) => x.job_id), ['i1'], 'the run did not end at the 403');
});

test('SKIP: an answer that does not fit the schema is skipped as "bad-answer", with no row', async () => {
  const f = fixture();
  l2Job(f, 'b1'); S.capture(f.opts); verdict(f, 'l2', 'b1', 'clean');
  const junk = async () => ({ ok: true, status: 200, text: async () => JSON.stringify({ answers: {} }) });
  const r = await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: junk });
  assert.deepStrictEqual(r.failed, [{ key: 'l2:b1', status: 'bad-answer' }]);
  assert.strictEqual(ledger(f).length, 0);
});

test('SKIP: one log line per failed item — the status and the item id ONLY, never the error body', async () => {
  const f = fixture();
  four(f);
  const lines = [];
  await S.shadow({ ...f.opts, maxCalls: 10, env: KEY, fetchImpl: flaky({ 2: 503, 4: 502 }), log: (s) => lines.push(s) });
  assert.deepStrictEqual(lines, ['shadow: item l2:i2 failed (503) — skipped, retried next run', 'shadow: item l2:i4 failed (502) — skipped, retried next run']);
  assert.ok(!lines.join('\n').includes('upstream said'), 'the gateway body reached the log');
});

test('SKIP: the per-run cap is unchanged — a failed call still spends a place in the run', async () => {
  const f = fixture();
  four(f);
  const g = flaky({ 1: 503 });
  const r = await S.shadow({ ...f.opts, maxCalls: 2, env: KEY, fetchImpl: g });
  assert.strictEqual(g.calls.length, 2, 'the cap is on calls made, and a failed call is a call');
  assert.strictEqual(r.asked, 1);
  assert.strictEqual(r.remaining, 2);
});

test('SKIP: the secret scan still records its refusal once, and the run goes on (unchanged)', async () => {
  const f = fixture();
  l2Job(f, 'bad', 'key ' + 'gh' + 'p_' + 'W'.repeat(36)); l2Job(f, 'ok');
  S.capture(f.opts); verdict(f, 'l2', 'bad', 'clean'); verdict(f, 'l2', 'ok', 'clean');
  const r = await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: flaky({}) });
  assert.strictEqual(r.refused, 1);
  assert.deepStrictEqual(r.failed, []);
});

test('SKIP: the classification is A\'s, kept in step — jev-shadow.js carries transientStatus IDENTICAL to jev-judge.js\'s', () => {
  // Mirrored, not imported: jev-judge.js does not export it, and this packet owns only jev-shadow.js. The two copies are
  // held equal here, so a change to either that does not reach the other goes red.
  const judge = fs.readFileSync(path.join(__dirname, 'jev-judge.js'), 'utf8');
  const mine = fs.readFileSync(path.join(__dirname, 'jev-shadow.js'), 'utf8');
  assert.strictEqual(S.extractFunction(mine, 'transientStatus', 'jev-shadow.js'), S.extractFunction(judge, 'transientStatus', 'jev-judge.js'));
});

test('verdicts with no capture are COUNTED, not asked (the input is gone); captures with no verdict yet wait', async () => {
  const f = fixture();
  l2Job(f, 'captured-only'); S.capture(f.opts);
  verdict(f, 'l2', 'never-captured', 'drift');
  const g = gateway();
  const r = await S.shadow({ ...f.opts, maxCalls: 5, env: KEY, fetchImpl: g });
  assert.strictEqual(g.calls.length, 0);
  assert.strictEqual(r.uncaptured.l2, 1);
  assert.strictEqual(r.pending.l2, 1);
});

test('--dry asks nothing and states the calls and the estimated cost first', async () => {
  const f = fixture();
  l2Job(f, 'j1'); S.capture(f.opts); verdict(f, 'l2', 'j1', 'clean');
  const g = gateway();
  const r = await S.shadow({ ...f.opts, maxCalls: 5, env: {}, fetchImpl: g, dry: true });
  assert.strictEqual(g.calls.length, 0);
  assert.strictEqual(r.wouldAsk, 1);
  assert.ok(r.estCostUsd > 0 && r.estTokens > 0);
  assert.strictEqual(ledger(f).length, 0);
});

// ------------------------------------------------------------------ report: measured, not acted on

test('report: agreement per judge WITH its denominator; refusals counted apart, never in the rate', async () => {
  const f = fixture();
  for (const id of ['a', 'b', 'c']) l2Job(f, id);
  l2Job(f, 'bad', 'key ' + 'gh' + 'p_' + 'Q'.repeat(36));
  l3Job(f, 'k1');
  S.capture(f.opts);
  verdict(f, 'l2', 'a', 'drift'); verdict(f, 'l2', 'b', 'clean'); verdict(f, 'l2', 'c', 'drift'); verdict(f, 'l2', 'bad', 'clean');
  verdict(f, 'l3', 'k1', 'stable');
  await S.shadow({ ...f.opts, maxCalls: 10, env: KEY, fetchImpl: gateway({ verdict: 'drift', trajectory: 'stable' }) });
  const rep = S.report(f.opts);
  assert.deepStrictEqual(rep.l2, { n: 3, agree: 2, rate: 2 / 3, refused: 1, byPair: { 'drift/drift': 2, 'clean/drift': 1 } });
  assert.strictEqual(rep.l3.n, 1);
  assert.strictEqual(rep.l3.agree, 1);
});

test('report with nothing shadowed says n=0 and no rate — a rate needs a denominator', () => {
  const f = fixture();
  const rep = S.report(f.opts);
  assert.strictEqual(rep.l2.n, 0);
  assert.strictEqual(rep.l2.rate, null);
});

test('CLI: shadow without --store exits 2; without a key exits 2', () => {
  const env = { ...process.env }; delete env.AI_GATEWAY_API_KEY; delete env.JEV_SHADOW_STORE;
  const r1 = spawnSync(process.execPath, [TOOL, 'shadow', '--max-calls', '1'], { encoding: 'utf8', env });
  assert.strictEqual(r1.status, 2);
  assert.match(r1.stderr, /REFUSED/);
  const f = fixture();
  const r2 = spawnSync(process.execPath, [TOOL, 'shadow', '--max-calls', '1', '--store', f.store, '--shell', f.shell], { encoding: 'utf8', env });
  assert.strictEqual(r2.status, 2);
  assert.match(r2.stderr, /AI_GATEWAY_API_KEY/);
});

// ── L105: the discipline dir comes through config (jev-room.js), not `__dirname/../..` ────────────────────────────────
function installedShadow() {
  const tools = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'jev-shadow-inst-')), 'somewhere', 'tools');
  fs.mkdirSync(tools, { recursive: true });
  for (const n of ['jev-shadow.js', 'jev-ask.js', 'jev-room.js']) fs.copyFileSync(path.join(__dirname, n), path.join(tools, n));
  return require(path.join(tools, 'jev-shadow.js'));
}
function roomHome() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-shadow-room-'));
  fs.mkdirSync(path.join(root, 'consonance', 'src-tauri', 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'consonance', 'src-tauri', 'src', 'main.rs'), '// fixture\n');
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-shadow-home-'));
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ room_path: path.join(root, 'exo_memory', 'BOOT.md') }));
  return { root, home };
}

test('L105: an installed copy takes the discipline dir from the room room_path names', () => {
  const { root, home } = roomHome();
  assert.strictEqual(installedShadow().parseArgs(['report', '--store', 'x'], {}, home).disciplineDir, root);
});

test('L105: --discipline still wins over the resolved room', () => {
  const { home } = roomHome();
  assert.strictEqual(installedShadow().parseArgs(['report', '--store', 'x', '--discipline', path.join(path.sep, 'X', 'disc')], {}, home).disciplineDir, path.join(path.sep, 'X', 'disc'));
});

test('L105: no room → capture REFUSES naming why and the fix, instead of reading METHOD.md from nowhere', () => {
  const S2 = installedShadow();
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-shadow-nohome-'));
  const f = fixture();
  l2Job(f, 'j1');
  const a = S2.parseArgs(['capture', '--store', f.store, '--shell', f.opts.shellDir], {}, home);
  assert.strictEqual(a.disciplineDir, null);
  assert.throws(() => S2.capture(a), (e) => e instanceof S2.Refusal && /discipline/.test(e.message) && /Fix: set room_path/.test(e.message));
});

// D130 (librarian, collation): loadBuilder's L2 branch hashed its own read of the worker and then require()d it — cached
// for the life of the process — so a worker changed between two loads in one runner ran the OLD builder under the NEW
// worker_sha256 (A's D130 hand-back §4; the loadJudgeInputs defect, one file over). The sha must describe what runs.
test('D130 loadBuilder l2: a worker changed between two loads in one process builds with the NEW code under the NEW sha', () => {
  const shell = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-shadow-d130-'));
  fs.mkdirSync(path.join(shell, 'hooks'));
  const worker = path.join(shell, 'hooks', 'l2-overseer-worker.js');
  const write = (tag) => fs.writeFileSync(worker, `'use strict';\nfunction buildOverseerPrompt(view, discipline) {\n  return '${tag}:' + discipline;\n}\nmodule.exports = { buildOverseerPrompt };\n`);
  write('OLD');
  const a = S.loadBuilder('l2', shell);
  write('NEW');
  const b = S.loadBuilder('l2', shell);
  assert.strictEqual(a.build({}, 'd'), 'OLD:d');
  assert.strictEqual(b.build({}, 'd'), 'NEW:d', 'the second load must run the code on disk, not a cached copy');
  assert.notStrictEqual(a.workerSha, b.workerSha);
});
