// jev/test/judge.test.js — node --test jev/test/judge.test.js
//
// NO LIVE CALLS. `fetch` is the one boundary stubbed. The config, the prompt and ask are the REAL jev/lib modules, run
// against a temp home (its .jev/config.json points the ledger into the temp dir), a temp transcript and a temp cwd.
// The one test that spawns the real hook gives it a temp HOME/USERPROFILE/TEMP/LOCALAPPDATA and no key, so the child
// it leaves behind can only write into the temp dir.
// Fake secrets are built at runtime by concatenation, never written out whole (this repo is public).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { isolatedEnv } = require('./isolated-env');   // D129: every spawn's store variables point into temp
const H = require('../bin/jev-judge.js');
const prompt = require('../lib/prompt.js');

const HOOK = path.join(__dirname, '..', 'bin', 'jev-judge.js');
const RUBRIC = path.join(__dirname, '..', 'METHOD.md');
const KEY = ['test', 'only', 'not', 'a', 'real', 'key', '7f3a9c'].join('-');
const USER_TEXT = 'please check the ledger before you claim it';
const MOVE_TEXT = 'I checked the ledger first: 794 rows, matching.';
const OK_BODY = { model: 'typesafe-ai/jev', usage: { inputTokens: 2200, outputTokens: 42 },
  answers: { verdict: { type: 'choice', choice: 'drift', confidence: 0.6, probabilities: { drift: 0.6, clean: 0.3, abstain: 0.1 } } } };

function stubFetch(status = 200, body = OK_BODY) {
  const calls = [];
  const f = async (url, init) => {
    calls.push({ url, init });
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    return { ok: status >= 200 && status < 300, status, text: async () => text, headers: { get: () => null } };
  };
  f.calls = calls;
  return f;
}

function world({ config = {}, move = MOVE_TEXT, ended = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-judge-'));
  const home = path.join(root, 'home');
  const cwd = path.join(root, 'project');
  const ledgerDir = path.join(root, 'ledger');
  const tmpdir = path.join(root, 'tmp');
  for (const d of [home, cwd, tmpdir, path.join(home, '.jev')]) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(home, '.jev', 'config.json'), JSON.stringify({ ledgerDir, rubric: RUBRIC, ...config }));
  const transcript = path.join(root, 'session.jsonl');
  const rows = [
    { type: 'user', uuid: 'u-0', message: { role: 'user', content: USER_TEXT } },
    { type: 'assistant', uuid: 'a-1', message: { role: 'assistant', stop_reason: ended ? 'end_turn' : 'tool_use', content: [{ type: 'text', text: move }] } },
  ];
  fs.writeFileSync(transcript, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  const meta = { session_id: 'sess-1', transcript_path: transcript, cwd };
  const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
  return { root, home, cwd, ledgerDir, tmpdir, transcript, meta,
    ledger: () => read(path.join(ledgerDir, H.LEDGER)), log: () => read(path.join(ledgerDir, H.LOG)),
    tmpLog: () => read(path.join(tmpdir, 'jev-judge.log')) };
}

const deps = (w, extra = {}) => ({ env: { AI_GATEWAY_API_KEY: KEY }, home: w.home, tmpdir: w.tmpdir, turnEndTries: 0, ...extra });

// D123: the contract gained `confidence` (jev_batch2_plan_2026-09-23.md, B's row) and `prompt_id` (the batch's new key,
// kept BESIDE turn_uuid because jev-flags.js reads turn_uuid and jev-report.js reads prompt_id), so the list has eleven.
test('a judged turn appends ONE row with exactly the contract\'s keys', async () => {
  const w = world();
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'judged');
  const lines = w.ledger().trim().split('\n');
  assert.strictEqual(lines.length, 1);
  const row = JSON.parse(lines[0]);
  assert.deepStrictEqual(Object.keys(row).sort(), [...H.ROW_KEYS].sort());
  assert.deepStrictEqual(Object.keys(row).sort(), ['confidence', 'model', 'probabilities', 'prompt_id', 'prompt_sha256', 'reason', 'session_id', 'ts', 'turn_uuid', 'usage', 'verdict']);
  assert.strictEqual(row.session_id, 'sess-1');
  assert.strictEqual(row.turn_uuid, 'a-1');
  assert.strictEqual(row.verdict, 'drift');
  assert.deepStrictEqual(row.probabilities, OK_BODY.answers.verdict.probabilities);
  assert.strictEqual(row.reason, null);
  assert.strictEqual(f.calls.length, 1);
});

test('the row carries no turn text — neither the move, the user message, nor the prompt', async () => {
  const w = world();
  const f = stubFetch();
  await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  const text = w.ledger();
  assert.ok(!text.includes(MOVE_TEXT));
  assert.ok(!text.includes(USER_TEXT));
  const sent = JSON.parse(f.calls[0].init.body).state;
  assert.ok(sent.includes(MOVE_TEXT), 'the prompt did carry the move to the gateway');
  assert.ok(!text.includes(sent));
});

test('prompt_sha256 is the sha256 of exactly the prompt sent', async () => {
  const w = world();
  const f = stubFetch();
  await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  const sent = JSON.parse(f.calls[0].init.body).state;
  const row = JSON.parse(w.ledger());
  assert.strictEqual(row.prompt_sha256, crypto.createHash('sha256').update(sent).digest('hex'));
  const expected = prompt.buildPrompt({ view: prompt.narrowedView(w.transcript), discipline: prompt.readDiscipline(RUBRIC) });
  assert.strictEqual(sent, expected);
});

test('a secret in the turn is refused before any fetch, and neither ledger nor log carries it', async () => {
  const secret = 'ghp' + '_' + 'C'.repeat(36);
  const w = world({ move: `here is the token ${secret} for you` });
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'refused');
  assert.strictEqual(f.calls.length, 0);
  assert.strictEqual(w.ledger(), null);
  const log = w.log();
  assert.ok(/github-token in state/.test(log), log);
  assert.ok(!log.includes(secret));
});

test('opt-out writes nothing anywhere and fetches nothing', async () => {
  const w = world();
  fs.writeFileSync(path.join(w.cwd, '.jev-off'), '');
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'opted-out');
  assert.strictEqual(f.calls.length, 0);
  assert.strictEqual(w.ledger(), null);
  assert.strictEqual(w.log(), null);
  assert.strictEqual(w.tmpLog(), null);
  assert.ok(!fs.existsSync(w.ledgerDir), 'not even the ledger directory is created');
});

test('judge "listed" skips a session not in the list and writes nothing', async () => {
  const w = world({ config: { judge: 'listed', sessions: ['someone-else'] } });
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'not-listed');
  assert.strictEqual(f.calls.length, 0);
  assert.ok(!fs.existsSync(w.ledgerDir));
});

test('judge "listed" judges a session that is in the list', async () => {
  const w = world({ config: { judge: 'listed', sessions: ['sess-1'] } });
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: stubFetch() }));
  assert.strictEqual(r.outcome, 'judged');
});

test('the dream guard on, in a dream (CONSONANCE_DREAM set): nothing written', async () => {
  const w = world({ config: { dream: true } });
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f, env: { AI_GATEWAY_API_KEY: KEY, CONSONANCE_DREAM: '1' } }));
  assert.strictEqual(r.outcome, 'dream');
  assert.strictEqual(f.calls.length, 0);
  assert.ok(!fs.existsSync(w.ledgerDir));
});

test('the dream guard off (the default): CONSONANCE_DREAM alone does not stop judging', async () => {
  const w = world();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: stubFetch(), env: { AI_GATEWAY_API_KEY: KEY, CONSONANCE_DREAM: '1' } }));
  assert.strictEqual(r.outcome, 'judged');
});

test('no key: a loud refusal in the log, no fetch, no row', async () => {
  const w = world();
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f, env: {} }));
  assert.strictEqual(r.outcome, 'refused');
  assert.strictEqual(f.calls.length, 0);
  assert.strictEqual(w.ledger(), null);
  assert.ok(/no key/.test(w.log()));
});

test('a turn already judged is not asked again', async () => {
  const w = world();
  const f = stubFetch();
  await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'already');
  assert.strictEqual(f.calls.length, 1);
  assert.strictEqual(w.ledger().trim().split('\n').length, 1);
});

test('a gateway failure logs its status only — never the body, which can echo the turn', async () => {
  const w = world();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: stubFetch(500, `echo: ${MOVE_TEXT}`) }));
  assert.strictEqual(r.outcome, 'gateway-failed');
  const log = w.log();
  assert.ok(log.includes('HTTP 500'), log);
  assert.ok(!log.includes(MOVE_TEXT));
  assert.strictEqual(w.ledger(), null);
});

test('a turn whose end row is not in the transcript is logged as no-turn-end, not guessed', async () => {
  const w = world({ ended: false });
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'no-turn-end');
  assert.strictEqual(f.calls.length, 0);
  assert.ok(/no-turn-end/.test(w.log()));
});

test('a config that cannot load is logged to the temp dir, not swallowed', async () => {
  const w = world();
  fs.writeFileSync(path.join(w.home, '.jev', 'config.json'), '{ not json');
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: stubFetch() }));
  assert.strictEqual(r.outcome, 'error');
  assert.ok(w.tmpLog(), 'the fallback log was written');
});

// D123: the command line gained `prompt_id`, and the move now travels on the child's stdin pipe (stdout/stderr ignored).
function fakeChild() {
  const c = { unrefd: false, piped: null, on() {}, unref() { c.unrefd = true; },
    stdin: { on() {}, end(s) { c.piped = s; } } };
  return c;
}

test('the hook spawns ONE detached, hidden child with four id/path fields on its command line, unrefs it, and returns 0', () => {
  const seen = [];
  const child = fakeChild();
  const spawnImpl = (cmd, args, opts) => { seen.push({ cmd, args, opts }); return child; };
  const stdinText = JSON.stringify({ session_id: 's', transcript_path: '/t.jsonl', cwd: '/p', prompt_id: 'p-1', last_assistant_message: MOVE_TEXT, extra: 'x' });
  assert.strictEqual(H.hook({ stdinText, spawnImpl, argv0: 'node', self: 'jev-judge.js' }), 0);
  assert.strictEqual(seen.length, 1);
  assert.deepStrictEqual(seen[0].args.slice(0, 2), ['jev-judge.js', '--child']);
  assert.deepStrictEqual(JSON.parse(seen[0].args[2]), { session_id: 's', transcript_path: '/t.jsonl', cwd: '/p', prompt_id: 'p-1' });
  assert.strictEqual(seen[0].opts.detached, true);
  assert.deepStrictEqual(seen[0].opts.stdio, ['pipe', 'ignore', 'ignore']);
  assert.strictEqual(seen[0].opts.windowsHide, true);
  assert.ok(child.unrefd);
});

test('the move never rides the command line — it goes over the child\'s stdin, and nothing else does', () => {
  const seen = [];
  const child = fakeChild();
  const stdinText = JSON.stringify({ session_id: 's', transcript_path: '/t.jsonl', prompt_id: 'p-1', last_assistant_message: MOVE_TEXT });
  H.hook({ stdinText, spawnImpl: (cmd, args) => { seen.push(args); return child; }, argv0: 'node', self: 'jev-judge.js' });
  assert.ok(!seen[0].join(' ').includes(MOVE_TEXT));
  assert.deepStrictEqual(JSON.parse(child.piped), { last_assistant_message: MOVE_TEXT });
});

test('a payload with no move still closes the child\'s stdin, so the child never waits on it', () => {
  const child = fakeChild();
  H.hook({ stdinText: JSON.stringify({ session_id: 's', transcript_path: '/t.jsonl' }), spawnImpl: () => child, argv0: 'node', self: 'x' });
  assert.deepStrictEqual(JSON.parse(child.piped), { last_assistant_message: null });
});

test('the hook returns 0 when the spawn itself throws, and on a payload that is not JSON', () => {
  assert.strictEqual(H.hook({ stdinText: '{}', spawnImpl: () => { throw new Error('EPERM'); } }), 0);
  assert.strictEqual(H.hook({ stdinText: 'not json', spawnImpl: () => ({ on() {}, unref() {} }) }), 0);
});

test('the real hook process exits 0 at once while its child is still working, and the child finishes on its own', async () => {
  const w = world({ ended: false });   // the child polls ~5 s for a turn end that never comes, then logs
  const env = isolatedEnv(undefined, { HOME: w.home, USERPROFILE: w.home, TEMP: w.tmpdir, TMP: w.tmpdir, LOCALAPPDATA: w.root });
  delete env.AI_GATEWAY_API_KEY;
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(w.meta), env, timeout: 20000 });
  const ms = Date.now() - t0;
  assert.strictEqual(r.status, 0, String(r.stderr));
  assert.strictEqual(String(r.stdout), '');
  assert.ok(ms < 3000, `the hook took ${ms} ms — it must not wait for the child's ~5 s poll`);
  let log = null;
  for (let i = 0; i < 60 && !log; i++) { await new Promise((res) => setTimeout(res, 250)); log = w.log(); }
  assert.ok(log && /no-turn-end/.test(log), 'the detached child ran to the end and wrote its line');
});

// ── D123: the turn keyed by the payload's prompt_id, the move taken from last_assistant_message ──────────────────────

const STALE_MOVE = 'the PREVIOUS turn\'s answer, still the last row the transcript has';
const NEW_MOVE = 'this turn\'s answer, from the payload';

test('with a prompt_id the turn is judged even when the transcript never shows its end row — turn_uuid null, prompt_id kept', async () => {
  const w = world({ ended: false, move: STALE_MOVE });
  const r = await H.runChild({ ...w.meta, prompt_id: 'p-42', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: stubFetch() }));
  assert.strictEqual(r.outcome, 'judged');
  const row = JSON.parse(w.ledger());
  assert.deepStrictEqual([row.prompt_id, row.turn_uuid], ['p-42', null]);
});

test('turn_uuid is the same end-row uuid jev-flags.js looks the row up by, so the flag line can find it', async () => {
  const flags = require('../bin/jev-flags.js');
  const w = world();
  await H.runChild({ ...w.meta, prompt_id: 'p-43', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: stubFetch() }));
  const row = JSON.parse(w.ledger());
  assert.strictEqual(row.turn_uuid, flags.lastTurnUuid(w.transcript));
  assert.strictEqual(row.turn_uuid, 'a-1');
});

test('a lagging transcript (the previous turn\'s end row, then this turn\'s prompt) is not read as this turn\'s end', async () => {
  const w = world();
  fs.appendFileSync(w.transcript, JSON.stringify({ type: 'user', uuid: 'u-2', message: { role: 'user', content: 'the next prompt' } }) + '\n');
  assert.strictEqual(H.lastTurnEnd(w.transcript), null);
});

test('without a prompt_id, that lag is logged as no-turn-end — not mistaken for the previous turn and skipped as "already"', async () => {
  const w = world();
  const f = stubFetch();
  await H.runChild(w.meta, deps(w, { fetchImpl: f }));                      // judges a-1
  fs.appendFileSync(w.transcript, JSON.stringify({ type: 'user', uuid: 'u-2', message: { role: 'user', content: 'the next prompt' } }) + '\n');
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'no-turn-end');
});

test('a sidechain (subagent) row is not the session\'s end row', () => {
  const w = world();
  fs.appendFileSync(w.transcript, JSON.stringify({ type: 'assistant', uuid: 'side-1', isSidechain: true, message: { role: 'assistant', stop_reason: 'end_turn', content: [{ type: 'text', text: 'subagent' }] } }) + '\n');
  assert.deepStrictEqual(H.lastTurnEnd(w.transcript), { uuid: 'a-1' });
});

test('dedupe follows prompt_id: two prompts whose transcript shows the same end row are both judged', async () => {
  const w = world();
  const f = stubFetch();
  await H.runChild({ ...w.meta, prompt_id: 'p-50', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: f }));
  const r = await H.runChild({ ...w.meta, prompt_id: 'p-51', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'judged');
  assert.strictEqual(f.calls.length, 2);
});

test('the payload\'s move is what is judged, not the transcript\'s stale last row', async () => {
  const w = world({ move: STALE_MOVE });
  const f = stubFetch();
  await H.runChild({ ...w.meta, prompt_id: 'p-1', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: f }));
  const sent = JSON.parse(f.calls[0].init.body).state;
  assert.ok(sent.includes(NEW_MOVE));
  assert.ok(!sent.includes(STALE_MOVE));
});

test('with the payload\'s move, the user context is the transcript\'s most recent user text', async () => {
  const w = world();
  fs.appendFileSync(w.transcript, JSON.stringify({ type: 'user', uuid: 'u-2', message: { role: 'user', content: [{ type: 'text', text: 'the second prompt' }] } }) + '\n'
    + JSON.stringify({ type: 'user', uuid: 'u-3', message: { role: 'user', content: [{ type: 'tool_result', content: 'tool output, not a prompt' }] } }) + '\n');
  const f = stubFetch();
  await H.runChild({ ...w.meta, prompt_id: 'p-2', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: f }));
  const sent = JSON.parse(f.calls[0].init.body).state;
  const expected = prompt.buildPrompt({ view: { assistant_move: NEW_MOVE, user_context: 'the second prompt' }, discipline: prompt.readDiscipline(RUBRIC) });
  assert.strictEqual(sent, expected);
});

test('the payload\'s move and prompt_id judge the turn even with no transcript path at all', async () => {
  const w = world();
  const f = stubFetch();
  const r = await H.runChild({ session_id: 'sess-1', cwd: w.cwd, prompt_id: 'p-3', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'judged');
  assert.ok(JSON.parse(f.calls[0].init.body).state.includes('(no user context available)'));
});

test('a turn already judged under its prompt_id is not asked again', async () => {
  const w = world();
  const f = stubFetch();
  const meta = { ...w.meta, prompt_id: 'p-4', last_assistant_message: NEW_MOVE };
  await H.runChild(meta, deps(w, { fetchImpl: f }));
  const r = await H.runChild(meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'already');
  assert.strictEqual(f.calls.length, 1);
});

test('the payload\'s move is capped at 8000 characters, as the room\'s view caps it', async () => {
  const w = world();
  const f = stubFetch();
  const long = 'm'.repeat(9000);
  await H.runChild({ ...w.meta, prompt_id: 'p-5', last_assistant_message: long }, deps(w, { fetchImpl: f }));
  const sent = JSON.parse(f.calls[0].init.body).state;
  assert.ok(sent.includes('m'.repeat(8000)));
  assert.ok(!sent.includes('m'.repeat(8001)));
});

test('the row carries no text from the payload\'s move either', async () => {
  const w = world();
  await H.runChild({ ...w.meta, prompt_id: 'p-6', last_assistant_message: NEW_MOVE }, deps(w, { fetchImpl: stubFetch() }));
  assert.ok(!w.ledger().includes(NEW_MOVE));
});

test('a secret in the payload\'s move is refused before any fetch', async () => {
  const w = world();
  const f = stubFetch();
  const secret = 'AK' + 'IA' + 'ABCDEFGHIJKLMNOP';
  const r = await H.runChild({ ...w.meta, prompt_id: 'p-7', last_assistant_message: `key ${secret}` }, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'refused');
  assert.strictEqual(f.calls.length, 0);
  assert.ok(!w.log().includes(secret));
});

test('confidence is written from what ask() returns', async () => {
  const w = world();
  const ask = { ask: async () => ({ choice: 'clean', probabilities: { clean: 0.9 }, confidence: 0.62, reason: null, model: 'm', usage: null }) };
  await H.runChild({ ...w.meta, prompt_id: 'p-8', last_assistant_message: NEW_MOVE }, deps(w, { ask }));
  assert.strictEqual(JSON.parse(w.ledger()).confidence, 0.62);
});

test('confidence is null — never invented — when the gateway sends none, through the real ask()', async () => {
  // D123 collation (librarian): ask.js now passes the gateway's confidence through, so the premise "ask drops it" is
  // gone; the intent (a missing confidence is never filled from probabilities) is kept by omitting it at the gateway.
  const w = world();
  const body = JSON.parse(JSON.stringify(OK_BODY));
  delete body.answers.verdict.confidence;
  await H.runChild(w.meta, deps(w, { fetchImpl: stubFetch(200, body) }));
  assert.strictEqual(JSON.parse(w.ledger()).confidence, null);
});

test('the gateway\'s confidence reaches the ledger row through the real ask() (the field E\'s flags line reads)', async () => {
  const w = world();
  const body = JSON.parse(JSON.stringify(OK_BODY));
  body.answers.verdict.confidence = 0.37;   // differs from probabilities.drift (0.6): passed through, not derived
  await H.runChild(w.meta, deps(w, { fetchImpl: stubFetch(200, body) }));
  assert.strictEqual(JSON.parse(w.ledger()).confidence, 0.37);
});

test('the real hook hands the move to its detached child over stdin: the child keys the turn by prompt_id and builds a prompt', async () => {
  const w = world();
  const env = isolatedEnv(undefined, { HOME: w.home, USERPROFILE: w.home, TEMP: w.tmpdir, TMP: w.tmpdir, LOCALAPPDATA: w.root });
  delete env.AI_GATEWAY_API_KEY;   // so the child stops at ask()'s key refusal — which comes AFTER the prompt was built
  const payload = { session_id: 'sess-9', cwd: w.cwd, prompt_id: 'p-9', last_assistant_message: NEW_MOVE };   // no transcript path
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(payload), env, timeout: 20000 });
  assert.strictEqual(r.status, 0, String(r.stderr));
  let log = null;
  for (let i = 0; i < 60 && !log; i++) { await new Promise((res) => setTimeout(res, 250)); log = w.log(); }
  const line = JSON.parse(log.trim().split('\n').pop());
  assert.strictEqual(line.prompt_id, 'p-9');
  assert.match(line.why, /no key/, 'reached ask(), so the move arrived: without it the child refuses for want of a transcript path');
});
