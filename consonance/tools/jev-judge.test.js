// jev-judge.test.js — node --test consonance/tools/jev-judge.test.js
//
// NO LIVE CALLS: fetch is stubbed. The hooks are COPIES of this repo's real files, so the view and the prompt are the
// ones the L2/L3 judges would build — a test that used a hand-written prompt would prove nothing about faithfulness.
// The overseer ledgers in the fixture shell dir must be byte-identical after every test: D's two scoring windows
// read those files and must stay Claude's alone.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const J = require('./jev-judge.js');

const REPO = path.resolve(__dirname, '..', '..');
const HOOKS = path.join(REPO, 'dev', 'shell', 'hooks');
const KEY = ['test', 'only', 'judge', 'key', '41c7'].join('-');
const MAIN = '0c0c0c0a-0000-4000-8000-000000000a01', LIB = '0c0c0c0b-0000-4000-8000-00000000115b';
const PANE = '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f', THIRD = '3d000000-0000-4000-8000-000000000001';
const TP = '3d000000-0000-4000-8000-000000003d00';   // the shape of main.rs THIRD_PLACE_SID

function world() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-judge-'));
  const repo = path.join(root, 'repo'), data = path.join(root, 'data'), projects = path.join(root, 'projects');
  const store = path.join(root, 'store'), shell = path.join(root, 'shell');
  fs.mkdirSync(path.join(repo, 'dev', 'shell', 'hooks'), { recursive: true });
  fs.mkdirSync(path.join(repo, 'consonance', 'src-tauri', 'src'), { recursive: true });
  for (const h of ['l2-overseer.js', 'l3-overseer.js', 'l2-overseer-worker.js', 'l3-overseer-worker.js']) {
    fs.copyFileSync(path.join(HOOKS, h), path.join(repo, 'dev', 'shell', 'hooks', h));
  }
  fs.writeFileSync(path.join(repo, 'consonance', 'src-tauri', 'src', 'main.rs'),
    `const MAIN_SID: &str = "${MAIN}"; // fixed\nconst LIBRARIAN_SID: &str = "${LIB}";\nconst THIRD_PLACE_SID: &str = "${TP}";\n`);
  fs.writeFileSync(path.join(repo, 'METHOD.md'), 'the method');
  fs.writeFileSync(path.join(repo, 'WELFARE.md'), 'the welfare');
  fs.mkdirSync(data, { recursive: true });
  fs.writeFileSync(path.join(data, 'panes.json'), JSON.stringify([{ pane: PANE, cwd: 'x', label: 'A' }, { pane: THIRD, cwd: 'y', label: 'third' }]));
  fs.mkdirSync(path.join(shell), { recursive: true });
  fs.writeFileSync(path.join(shell, 'l2_overseer.jsonl'), '{"type":"l2_overseer_verdict","job_id":"claude-1","verdict":"clean"}\n');
  fs.writeFileSync(path.join(shell, 'l3_overseer.jsonl'), '{"type":"l3_overseer_verdict","job_id":"claude-2","trajectory":"stable"}\n');
  return { root, repo, data, projects, store, shell };
}
const O = (w, extra = {}) => ({ store: w.store, repo: w.repo, dataDir: w.data, projectsDir: w.projects, disciplineDir: w.repo, memo: {}, ...extra });

let seq = 0;
const u = (text, ts) => ({ type: 'user', uuid: `u${++seq}`, timestamp: ts || new Date().toISOString(), message: { role: 'user', content: text } });
const a = (text, stop = 'end_turn') => ({ type: 'assistant', uuid: `a${++seq}`, timestamp: new Date().toISOString(),
  message: { role: 'assistant', stop_reason: stop, content: [{ type: 'text', text }] } });
function transcript(w, sid, rows, dir = 'C--seat') {
  const d = path.join(w.projects, dir); fs.mkdirSync(d, { recursive: true });
  const f = path.join(d, sid + '.jsonl');
  fs.writeFileSync(f, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  return f;
}
function gateway() {
  const calls = [];
  const f = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push(body);
    const answers = Object.fromEntries(Object.keys(body.questions).map((k) => [k, { type: 'choice', choice: Object.keys(body.questions[k].criteria)[0], probabilities: {} }]));
    return { ok: true, status: 200, text: async () => JSON.stringify({ model: 'typesafe-ai/jev', answers, usage: { inputTokens: 10, outputTokens: 0 }, providerMetadata: { gateway: { cost: '0' } } }) };
  };
  f.calls = calls;
  return f;
}
const rowsOf = (w) => { try { return fs.readFileSync(path.join(w.store, J.LEDGER), 'utf8').split('\n').filter(Boolean).map(JSON.parse); } catch { return []; } };
const bytes = (p) => fs.readFileSync(p);

// ── which seats ────────────────────────────────────────────────────────────────────────────────────────────────────

test('the seats are Main and the librarian (their fixed ids read from THIS checkout\'s main.rs) plus the kept roster', () => {
  const w = world();
  const sids = J.seatSessions({ repo: w.repo, dataDir: w.data }).map((s) => s.sid);
  for (const s of [MAIN, LIB, PANE]) assert.ok(sids.includes(s), `${s} missing from ${JSON.stringify(sids)}`);
});

// THE CONTRACT CHANGED BY THE KEEPER'S RULING, 2026-09-22 05:2x (librarian/2026-09-22.md "05:2x"), verbatim: "Who cares
// about our personal things, not like anyone will do anything about it, it is a part of the key and solution. It is
// universal to all beings even if no one talks about certain unsaid things." This test used to assert the Third Place was
// NEVER a seat (L071); it now asserts the ruling. Standing rule kept with it: nothing ever surfaces the Third Place's L3
// verdicts as a statement about the keeper.
test('the Third Place IS a seat, by the keeper\'s ruling of 05:2x — Jev judges it at both levels', () => {
  const w = world();
  const seat = J.seatSessions({ repo: w.repo, dataDir: w.data }).find((s) => s.sid === TP);
  assert.ok(seat, 'the Third Place must be a seat');
  assert.strictEqual(seat.label, 'third place');
});

test('the Third Place\'s id comes from THIS checkout\'s main.rs THIRD_PLACE_SID — a different id there changes the seat', () => {
  const w = world();
  const other = '3d000000-0000-4000-8000-00000000beef';
  const rs = path.join(w.repo, 'consonance', 'src-tauri', 'src', 'main.rs');
  fs.writeFileSync(rs, fs.readFileSync(rs, 'utf8').replace(TP, other));
  const sids = J.seatSessions({ repo: w.repo, dataDir: w.data }).map((s) => s.sid);
  assert.ok(sids.includes(other), JSON.stringify(sids));
  assert.ok(!sids.includes(TP), 'the old id is not a seat once main.rs says otherwise');
});

// ── when a turn is finished ────────────────────────────────────────────────────────────────────────────────────────

test('a turn is FINISHED when the last assistant row says end_turn — the moment the Stop hook fires', () => {
  const w = world();
  const f = transcript(w, PANE, [u('q'), a('the answer')]);
  const end = J.lastTurnEnd(f);
  assert.ok(end && end.uuid, JSON.stringify(end));
});

test('a turn still running (last assistant row tool_use) is NOT finished', () => {
  const w = world();
  const f = transcript(w, PANE, [u('q'), a('running the tests now', 'tool_use')]);
  assert.strictEqual(J.lastTurnEnd(f), null);
});

// ── the input is the judge's own ───────────────────────────────────────────────────────────────────────────────────

test('the L2 prompt is BYTE-IDENTICAL to what the repo\'s L2 worker builds from the hook\'s own narrowed view', () => {
  const w = world();
  transcript(w, PANE, [u('what is the state'), a('here is the state, plainly')]);
  J.capturePass(O(w));
  const caps = fs.readdirSync(path.join(w.store, 'judge-captures'));
  assert.strictEqual(caps.length, 1, JSON.stringify(caps));
  const cap = JSON.parse(fs.readFileSync(path.join(w.store, 'judge-captures', caps[0]), 'utf8'));
  const worker = require(path.join(w.repo, 'dev', 'shell', 'hooks', 'l2-overseer-worker.js'));
  const expected = worker.buildOverseerPrompt({ assistant_move: 'here is the state, plainly', user_context: 'what is the state' }, 'the method');
  assert.strictEqual(cap.l2.prompt, expected);
});

test('the L3 prompt is the repo\'s L3 builder over the hook\'s own trajectory view (the user turns, oldest first)', () => {
  const w = world();
  transcript(w, PANE, [u('first', '2026-09-22T01:00:00.000Z'), a('ok'), u('second', '2026-09-22T01:05:00.000Z'), a('ok again')]);
  J.capturePass(O(w));
  const cap = JSON.parse(fs.readFileSync(path.join(w.store, 'judge-captures', fs.readdirSync(path.join(w.store, 'judge-captures'))[0]), 'utf8'));
  assert.ok(cap.l3 && cap.l3.prompt.includes('the welfare'), 'the L3 discipline is in the prompt');
  assert.ok(cap.l3.prompt.indexOf('first') < cap.l3.prompt.indexOf('second'), 'turns in chronological order');
});

test('a running turn is not captured', () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('working', 'tool_use')]);
  assert.strictEqual(J.capturePass(O(w)).captured, 0);
});

// ── the ledger ─────────────────────────────────────────────────────────────────────────────────────────────────────

test('primary path: one finished turn → Jev asked for L2 AND L3, rows in jev_judge.jsonl marked judge:"jev", unverified', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('an answer')]);
  J.capturePass(O(w));
  const g = gateway();
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  assert.strictEqual(r.asked, 2, JSON.stringify(r));
  const rows = rowsOf(w);
  assert.deepStrictEqual(rows.map((x) => x.level).sort(), ['l2', 'l3']);
  for (const x of rows) {
    assert.strictEqual(x.judge, 'jev');
    assert.strictEqual(x.unverified, true);
    assert.strictEqual(x.session_id, PANE);
  }
  assert.ok(rows.find((x) => x.level === 'l2').jev.verdict, 'the L2 answer set: verdict');
  assert.ok(rows.find((x) => x.level === 'l3').jev.trajectory, 'the L3 answer set: trajectory');
});

test('the L2 question offers the overseer\'s OWN answer set: drift | clean | abstain', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('an answer')]);
  J.capturePass(O(w));
  const g = gateway();
  await J.judgePass({ store: w.store, maxCalls: 10, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  const l2 = g.calls.find((c) => c.questions.verdict);
  assert.deepStrictEqual(Object.keys(l2.questions.verdict.criteria).sort(), ['abstain', 'clean', 'drift']);
});

test('NEVER into the overseer ledgers: l2_overseer.jsonl and l3_overseer.jsonl are byte-identical after capture + judge', async () => {
  const w = world();
  const before = [bytes(path.join(w.shell, 'l2_overseer.jsonl')), bytes(path.join(w.shell, 'l3_overseer.jsonl'))];
  transcript(w, PANE, [u('q'), a('an answer')]);
  J.capturePass(O(w, { shellDir: w.shell }));
  await J.judgePass({ store: w.store, shellDir: w.shell, maxCalls: 10, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: gateway() });
  assert.ok(before[0].equals(bytes(path.join(w.shell, 'l2_overseer.jsonl'))), 'l2_overseer.jsonl changed');
  assert.ok(before[1].equals(bytes(path.join(w.shell, 'l3_overseer.jsonl'))), 'l3_overseer.jsonl changed');
});

test('an already-judged turn is never re-asked: a second capture and a second judge pass ask nothing', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('an answer')]);
  J.capturePass(O(w));
  const g = gateway();
  await J.judgePass({ store: w.store, maxCalls: 10, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  assert.strictEqual(J.capturePass(O(w)).captured, 0, 'the same turn is not captured twice');
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  assert.strictEqual(r.asked, 0);
  assert.strictEqual(g.calls.length, 2, 'two calls in all: one L2 and one L3, once');
});

test('a NEW finished turn in the same seat is judged — the key is the turn, not the seat', async () => {
  const w = world();
  const rows = [u('q'), a('first answer')];
  transcript(w, PANE, rows);
  J.capturePass(O(w));
  transcript(w, PANE, [...rows, u('q2'), a('second answer')]);
  assert.strictEqual(J.capturePass(O(w)).captured, 1);
});

test('no key → the judge pass REFUSES before any call', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('an answer')]);
  J.capturePass(O(w));
  const g = gateway();
  await assert.rejects(J.judgePass({ store: w.store, maxCalls: 10, env: {}, fetchImpl: g }), /AI_GATEWAY_API_KEY/);
  assert.strictEqual(g.calls.length, 0);
});

test('no key refuses even when there is NOTHING to ask — a missing key is never silent', async () => {
  // Found as a surviving mutant: jev.ask refuses without a key too, so a test with a capture could not tell the
  // two apart. With nothing captured only this module's own guard can speak.
  const w = world();
  await assert.rejects(J.judgePass({ store: w.store, maxCalls: 10, env: {}, fetchImpl: gateway() }), /AI_GATEWAY_API_KEY/);
});

test('the per-pass cap holds: 3 finished turns, maxCalls 2 → exactly 2 calls', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('one')]);
  transcript(w, MAIN, [u('q'), a('two')], 'C--main');
  J.capturePass(O(w));
  const g = gateway();
  const r = await J.judgePass({ store: w.store, maxCalls: 2, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  assert.strictEqual(g.calls.length, 2);
  assert.strictEqual(r.remaining, 2);
});
