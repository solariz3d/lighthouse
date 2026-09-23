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

test('a judged turn appends ONE row with exactly the contract\'s keys', async () => {
  const w = world();
  const f = stubFetch();
  const r = await H.runChild(w.meta, deps(w, { fetchImpl: f }));
  assert.strictEqual(r.outcome, 'judged');
  const lines = w.ledger().trim().split('\n');
  assert.strictEqual(lines.length, 1);
  const row = JSON.parse(lines[0]);
  assert.deepStrictEqual(Object.keys(row).sort(), [...H.ROW_KEYS].sort());
  assert.deepStrictEqual(Object.keys(row).sort(), ['model', 'probabilities', 'prompt_sha256', 'reason', 'session_id', 'ts', 'turn_uuid', 'usage', 'verdict']);
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

test('the hook spawns ONE detached, hidden child with only three payload fields, unrefs it, and returns 0', () => {
  const seen = [];
  let unrefd = false;
  const spawnImpl = (cmd, args, opts) => { seen.push({ cmd, args, opts }); return { on() {}, unref() { unrefd = true; } }; };
  const stdinText = JSON.stringify({ session_id: 's', transcript_path: '/t.jsonl', cwd: '/p', last_assistant_message: MOVE_TEXT, extra: 'x' });
  assert.strictEqual(H.hook({ stdinText, spawnImpl, argv0: 'node', self: 'jev-judge.js' }), 0);
  assert.strictEqual(seen.length, 1);
  assert.deepStrictEqual(seen[0].args.slice(0, 2), ['jev-judge.js', '--child']);
  assert.deepStrictEqual(JSON.parse(seen[0].args[2]), { session_id: 's', transcript_path: '/t.jsonl', cwd: '/p' });
  assert.ok(!seen[0].args.join(' ').includes(MOVE_TEXT));
  assert.strictEqual(seen[0].opts.detached, true);
  assert.strictEqual(seen[0].opts.stdio, 'ignore');
  assert.strictEqual(seen[0].opts.windowsHide, true);
  assert.ok(unrefd);
});

test('the hook returns 0 when the spawn itself throws, and on a payload that is not JSON', () => {
  assert.strictEqual(H.hook({ stdinText: '{}', spawnImpl: () => { throw new Error('EPERM'); } }), 0);
  assert.strictEqual(H.hook({ stdinText: 'not json', spawnImpl: () => ({ on() {}, unref() {} }) }), 0);
});

test('the real hook process exits 0 at once while its child is still working, and the child finishes on its own', async () => {
  const w = world({ ended: false });   // the child polls ~5 s for a turn end that never comes, then logs
  const env = { ...process.env, HOME: w.home, USERPROFILE: w.home, TEMP: w.tmpdir, TMP: w.tmpdir, LOCALAPPDATA: w.root };
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
