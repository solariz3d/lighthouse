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
// AND AMENDED 2026-09-22 (D108): the librarian's 11:0x decision, at the keeper's "what do you suggest", drops L3 from judge
// mode, reversing the "both levels" half of the 05:2x ruling. The Third Place stays a seat and is judged at L2 only.
test('the Third Place IS a seat, by the keeper\'s ruling of 05:2x — judged at L2 (L3 dropped at 11:0x, D108)', () => {
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

// WITHDRAWN 2026-09-22 (D108), with its inverse below: this test asserted "the L3 prompt is the repo's L3 builder over the
// hook's own trajectory view". Jev asks L2 ONLY since the librarian's 11:0x decision, taken at the keeper's "what do you
// suggest" (librarian/2026-09-22.md "11:0x"), which reverses the L3 half of the keeper's 05:2x ruling. Verifiably wrong now.
test('L2 ONLY (D108): a capture carries NO L3 prompt, and capture works with the L3 hook, its worker and WELFARE.md all GONE', () => {
  const w = world();
  for (const h of ['l3-overseer.js', 'l3-overseer-worker.js']) fs.rmSync(path.join(w.repo, 'dev', 'shell', 'hooks', h));
  fs.rmSync(path.join(w.repo, 'WELFARE.md'));
  transcript(w, PANE, [u('first', '2026-09-22T01:00:00.000Z'), a('ok'), u('second', '2026-09-22T01:05:00.000Z'), a('ok again')]);
  assert.strictEqual(J.capturePass(O(w)).captured, 1, 'nothing L3 is on the live path, so nothing L3 can refuse it');
  const cap = JSON.parse(fs.readFileSync(path.join(w.store, 'judge-captures', fs.readdirSync(path.join(w.store, 'judge-captures'))[0]), 'utf8'));
  assert.ok(cap.l2 && cap.l2.prompt, 'the L2 prompt is captured');
  assert.ok(!('l3' in cap) && !('welfare_sha256' in cap), 'no L3 prompt and no L3 discipline in the capture: ' + Object.keys(cap));
});

test('a running turn is not captured', () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('working', 'tool_use')]);
  assert.strictEqual(J.capturePass(O(w)).captured, 0);
});

// ── the ledger ─────────────────────────────────────────────────────────────────────────────────────────────────────

// CHANGED 2026-09-22 (D108): this was "Jev asked for L2 AND L3" and asserted rows ['l2', 'l3']. L2 only since 11:0x.
test('primary path: one finished turn → Jev asked for L2 ONLY, one row in jev_judge.jsonl marked judge:"jev", unverified', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('an answer')]);
  J.capturePass(O(w));
  const g = gateway();
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  assert.strictEqual(r.asked, 1, JSON.stringify(r));
  const rows = rowsOf(w);
  assert.deepStrictEqual(rows.map((x) => x.level), ['l2']);
  for (const x of rows) {
    assert.strictEqual(x.judge, 'jev');
    assert.strictEqual(x.unverified, true);
    assert.strictEqual(x.session_id, PANE);
  }
  assert.ok(rows[0].jev.verdict, 'the L2 answer set: verdict');
});

test('L2 ONLY (D108): an OLD capture that still carries an L3 prompt is asked L2 only — NO L3 row is ever written', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('an answer')]);
  J.capturePass(O(w));
  const dir = path.join(w.store, 'judge-captures'), f = path.join(dir, fs.readdirSync(dir)[0]);
  const cap = JSON.parse(fs.readFileSync(f, 'utf8'));
  cap.l3 = { prompt: 'an L3 prompt captured before 11:0x' };
  fs.writeFileSync(f, JSON.stringify(cap));
  const g = gateway();
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  assert.strictEqual(g.calls.length, 1, 'one call, L2');
  assert.ok(g.calls.every((c) => c.questions.verdict && !c.questions.trajectory), 'no L3 question was sent');
  assert.ok(rowsOf(w).every((x) => x.level === 'l2'), 'no L3 row: ' + JSON.stringify(rowsOf(w).map((x) => x.level)));
  assert.strictEqual(r.remaining, 0, 'and the L3 item is not left waiting as "remaining"');
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
  assert.strictEqual(g.calls.length, 1, 'one call in all: the L2 question, once (L2 only since D108; this said two, L2 and L3)');
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

// ── L078: a failed call must not end the pass (the librarian, 05:4x: intermittent upstream 503s blocked every capture
// queued behind the first failure for a whole cadence — head-of-line blocking) ─────────────────────────────────────

/** A gateway that answers like gateway() except where `fail(n)` returns a status for the n-th call (1-based). */
function flaky(fail) {
  const ok = gateway();
  const calls = [];
  const f = async (url, init) => {
    calls.push(JSON.parse(init.body));
    const st = fail(calls.length);
    if (st === 'network') throw new Error('socket hang up');
    if (st) return { ok: false, status: st, text: async () => 'upstream unavailable' };
    return ok(url, init);
  };
  f.calls = calls;
  return f;
}
/** Four finished turns in four seats, captured at distinct times, so the four items have a fixed order. (D108: this was
 * two turns x two levels; L2 only, so it is four seats x one level — the same four items, in capture order.) */
function fourItems() {
  const w = world();
  const seats = [[PANE, 'C--seat'], [MAIN, 'C--main'], [LIB, 'C--lib'], [THIRD, 'C--third']];
  seats.forEach(([sid, dir], i) => {
    transcript(w, sid, [u('q ' + i), a(i === 0 ? 'first answer' : 'answer ' + i)], dir);
    J.capturePass(O(w, { now: () => new Date(Date.parse('2026-09-22T11:00:00.000Z') + i * 1000) }));
  });
  return w;
}
const KEYED = { AI_GATEWAY_API_KEY: KEY };

test('a 503 on item 2 of 4 does NOT end the pass: items 1, 3 and 4 are asked in that same pass', async () => {
  const w = fourItems();
  const g = flaky((n) => (n === 2 ? 503 : null));
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g });
  assert.strictEqual(g.calls.length, 4, 'every item was tried');
  assert.strictEqual(r.asked, 3, JSON.stringify(r));
  assert.strictEqual(r.failed.length, 1);
  assert.strictEqual(rowsOf(w).length, 3, 'only the answered items have rows');
});

test('the failed item is retried on the NEXT pass, asked once it succeeds — and no answered item is ever re-sent', async () => {
  const w = fourItems();
  const g1 = flaky((n) => (n === 2 ? 503 : null));
  const r1 = await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g1 });
  const failedPrompt = g1.calls[1].state;
  const g2 = flaky(() => null);
  const r2 = await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g2 });
  assert.strictEqual(g2.calls.length, 1, 'only the failed item is sent again');
  assert.strictEqual(g2.calls[0].state, failedPrompt, 'and it is the one that failed');
  assert.strictEqual(r2.asked, 1);
  assert.strictEqual(rowsOf(w).length, 4);
  const g3 = flaky(() => null);
  await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g3 });
  assert.strictEqual(g3.calls.length, 0, 'nothing answered is ever asked again');
  assert.ok(r1.failed[0].key.includes(':'), 'the failure names the item');
});

test('a failed call consumes NO daily cap: it writes no ledger row, and callsToday counts only answered calls', async () => {
  const w = fourItems();
  await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: flaky((n) => (n === 2 ? 503 : null)), now: () => new Date() });
  assert.strictEqual(J.callsToday(w.store), 3);
});

test('a NETWORK failure and a 429 are skipped the same way as a 503', async () => {
  const w = fourItems();
  const g = flaky((n) => (n === 1 ? 'network' : n === 3 ? 429 : null));
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g });
  assert.strictEqual(g.calls.length, 4);
  assert.strictEqual(r.asked, 2);
  assert.deepStrictEqual(r.failed.map((x) => x.status), ['network', 429]);
});

test('an AUTH failure (401) still ENDS the pass — it would fail every item the same way', async () => {
  const w = fourItems();
  const g = flaky((n) => (n === 1 ? 401 : null));
  await assert.rejects(J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g }), /HTTP 401/);
  assert.strictEqual(g.calls.length, 1, 'no further calls after an auth failure');
});

test('the failure report carries the item key and the status, never the prompt text', async () => {
  const w = fourItems();
  const g = flaky((n) => (n === 2 ? 503 : null));
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g });
  const text = JSON.stringify(r.failed);
  assert.match(text, /503/);
  assert.ok(!text.includes('first answer') && !text.includes('the method') && !text.includes('upstream unavailable'), text);
});

test('the per-pass cap holds: 3 finished turns, maxCalls 2 → exactly 2 calls', async () => {
  const w = world();
  transcript(w, PANE, [u('q'), a('one')]);
  transcript(w, MAIN, [u('q'), a('two')], 'C--main');
  transcript(w, LIB, [u('q'), a('three')], 'C--lib');   // D108: the third turn the title names; it was 2 turns x 2 levels
  J.capturePass(O(w));
  const g = gateway();
  const r = await J.judgePass({ store: w.store, maxCalls: 2, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g });
  assert.strictEqual(g.calls.length, 2);
  assert.strictEqual(r.remaining, 1, '3 L2 items, 2 asked');
});

// ── D107 PACING through the judge pass. A stubbed clock (no real sleeps) and a gateway whose 1st call is a 429 with
// Retry-After 3. The pacer is jev-ask's; judgePass only carries it through to ask(). ───────────────────────────────
test('PACING: a pass spaces its calls, waits out a 429\'s Retry-After, skips that item, and the daily cap counts only ok rows', async () => {
  const w = fourItems();
  const c = { t: Date.parse('2026-09-22T12:00:00Z'), sleeps: [] };
  const jevAsk = require('./jev-ask.js');
  const pacer = jevAsk.createPacer({ gapMs: 2000, baseBackoffMs: 5000, maxBackoffMs: 60000, maxWaitMs: 120000,
    now: () => c.t, sleep: async (ms) => { c.sleeps.push(ms); c.t += ms; } });
  const at = [];
  const ok = gateway();
  const g = async (url, init) => {
    at.push(c.t);
    if (at.length === 1) return { ok: false, status: 429, headers: { get: (k) => (k.toLowerCase() === 'retry-after' ? '3' : null) }, text: async () => 'rate limited' };
    return ok(url, init);
  };
  const r = await J.judgePass({ store: w.store, maxCalls: 10, env: KEYED, fetchImpl: g, pacer });
  assert.strictEqual(at.length, 4, 'every item tried once in the pass');
  assert.deepStrictEqual(at.slice(1).map((t, i) => t - at[i]), [3000, 2000, 2000], 'Retry-After 3 s after the 429, then the gap');
  assert.deepStrictEqual(r.failed.map((x) => x.status), [429], 'the 429 item is a skip-and-retry (L078), not a stop');
  assert.strictEqual(r.asked, 3);
  assert.strictEqual(J.callsToday(w.store, new Date(rowsOf(w)[0].ts).toDateString()), 3, 'the daily cap counts ok rows only — unchanged');
});

// ── L099: the room is found through ~/.consonance.json room_path, and not finding it is LOUD ───────────────────────
// An installed copy (not inside a checkout) used to read <__dirname>/../../consonance/src-tauri/src/main.rs, find nothing,
// and judge the roster alone: Main, the librarian and the Third Place dropped out with no line anywhere — L089's
// jev-flags bug, in its sibling.
function installedCopy() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-judge-inst-'));
  const tools = path.join(dir, 'somewhere', 'tools');
  fs.mkdirSync(tools, { recursive: true });
  for (const f of ['jev-judge.js', 'jev-ask.js', 'jev-shadow.js']) fs.copyFileSync(path.join(__dirname, f), path.join(tools, f));
  return require(path.join(tools, 'jev-judge.js'));
}
function homeWith(cfg) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-judge-home-'));
  if (cfg !== undefined) fs.writeFileSync(path.join(home, '.consonance.json'), typeof cfg === 'string' ? cfg : JSON.stringify(cfg));
  return home;
}

test('L099: an installed copy with no repo finds all three fixed seats through room_path', () => {
  const w = world();
  const JI = installedCopy();
  const home = homeWith({ room_path: path.join(w.repo, 'exo_memory', 'BOOT.md') });
  const sids = JI.seatSessions({ dataDir: w.data, home }).map((s) => s.sid);
  for (const s of [MAIN, LIB, TP]) assert.ok(sids.includes(s), `${s} missing from ${JSON.stringify(sids)}`);
});

test('L099: an installed copy captures a Main turn, reading the hooks from the room room_path names', () => {
  const w = world();
  const JI = installedCopy();
  const home = homeWith({ room_path: path.join(w.repo, 'exo_memory', 'BOOT.md') });
  transcript(w, MAIN, [u('do the thing'), a('done')]);
  const res = JI.capturePass({ store: w.store, dataDir: w.data, projectsDir: w.projects, disciplineDir: w.repo, memo: {}, home });
  assert.strictEqual(res.captured, 1, JSON.stringify(res));
});

test('L099: no room_path and no checkout → capturePass REFUSES, naming every place tried and the fix', () => {
  const w = world();
  const JI = installedCopy();
  const home = homeWith();
  assert.throws(() => JI.capturePass({ store: w.store, dataDir: w.data, projectsDir: w.projects, disciplineDir: w.repo, memo: {}, home }),
    (e) => e instanceof JI.Refusal
      && /cannot find the room/.test(e.message)
      && /~\/\.consonance\.json does not exist/.test(e.message)
      && /Fix: set room_path in ~\/\.consonance\.json/.test(e.message));
});

test('L099: a room_path that leads nowhere is named in the refusal', () => {
  const w = world();
  const JI = installedCopy();
  const home = homeWith({ room_path: path.join(w.root, 'nowhere', 'exo_memory', 'BOOT.md') });
  assert.throws(() => JI.capturePass({ store: w.store, dataDir: w.data, projectsDir: w.projects, disciplineDir: w.repo, memo: {}, home }),
    (e) => /room_path .*nowhere.* does not lead to consonance\/src-tauri\/src\/main\.rs/.test(e.message));
});

test('L099: the roster still resolves when the room cannot be found — the refusal is what says so, not an empty seat list', () => {
  const w = world();
  const JI = installedCopy();
  const seats = JI.seatSessions({ dataDir: w.data, home: homeWith() });
  assert.ok(seats.map((s) => s.sid).includes(PANE));
  assert.strictEqual(seats.room.file, null);
  assert.match(seats.room.why, /~\/\.consonance\.json does not exist/);
});

test('L099: a main.rs missing one const → the other two still resolve, and the missing one is NAMED', () => {
  const w = world();
  const rs = path.join(w.repo, 'consonance', 'src-tauri', 'src', 'main.rs');
  fs.writeFileSync(rs, fs.readFileSync(rs, 'utf8').replace(/const LIBRARIAN_SID[^\n]*\n/, ''));
  const seats = J.seatSessions({ repo: w.repo, dataDir: w.data, home: homeWith() });
  const sids = seats.map((s) => s.sid);
  assert.ok(sids.includes(MAIN) && sids.includes(TP), JSON.stringify(sids));
  assert.deepStrictEqual(seats.missing, ['LIBRARIAN_SID']);
});

test('L099: capturePass carries the missing const into its result', () => {
  const w = world();
  const rs = path.join(w.repo, 'consonance', 'src-tauri', 'src', 'main.rs');
  fs.writeFileSync(rs, fs.readFileSync(rs, 'utf8').replace(/const THIRD_PLACE_SID[^\n]*\n/, ''));
  const res = J.capturePass(O(w, { home: homeWith() }));
  assert.deepStrictEqual(res.missing, ['THIRD_PLACE_SID']);
});

test('L099: a checkout passed as repo wins over room_path — the hooks and main.rs come from ONE tree', () => {
  const w = world(), other = world();
  const rs = path.join(other.repo, 'consonance', 'src-tauri', 'src', 'main.rs');
  fs.writeFileSync(rs, fs.readFileSync(rs, 'utf8').replace(MAIN, '0c0c0c0a-0000-4000-8000-00000000beef'));
  const home = homeWith({ room_path: path.join(other.repo, 'exo_memory', 'BOOT.md') });
  const sids = J.seatSessions({ repo: w.repo, dataDir: w.data, home }).map((s) => s.sid);
  assert.ok(sids.includes(MAIN), JSON.stringify(sids));
});

test('L099: an unreadable ~/.consonance.json is named as unreadable, not as absent', () => {
  const w = world();
  const JI = installedCopy();
  const seats = JI.seatSessions({ dataDir: w.data, home: homeWith('{not json') });
  assert.match(seats.room.why, /could not be read as JSON/);
});

// ── L099 addition: a seat is named by its pane LETTER, not its roster label. Three panes shared "✦ brief" on L, so 74 of
// Jev's verdicts could not be told apart, and the first real drift flag (04:26) could have been A, B or E.
const PANE_B = '12fb81f6-f4c0-4ef8-aad8-f0cdce091925', PANE_E = 'a2122153-a37e-41a6-a86f-534267ec0565';
function sharedLabels(w, letters) {
  fs.writeFileSync(path.join(w.data, 'panes.json'), JSON.stringify([
    { pane: PANE, cwd: 'x', label: '✦ brief' }, { pane: PANE_B, cwd: 'y', label: '✦ brief' }, { pane: PANE_E, cwd: 'z', label: '✦ brief' }]));
  if (letters) fs.writeFileSync(path.join(w.data, 'letters.json'), JSON.stringify(letters));
}
const seatName = (w, sid) => (J.seatSessions({ repo: w.repo, dataDir: w.data, home: homeWith() }).find((s) => s.sid === sid) || {}).label;

test('L099: two panes with the same roster label get two different seat names — their letters', () => {
  const w = world();
  sharedLabels(w, { [PANE]: 'A', [PANE_B]: 'B', [PANE_E]: 'E' });
  assert.deepStrictEqual([seatName(w, PANE), seatName(w, PANE_B), seatName(w, PANE_E)], ['A', 'B', 'E']);
});

test('L099: a pane with no letter is named by a short session id, never by the shared label', () => {
  const w = world();
  sharedLabels(w, { [PANE]: 'A' });
  assert.deepStrictEqual([seatName(w, PANE), seatName(w, PANE_B)], ['A', '12fb81f6']);
});

test('L099: Main, the librarian and the Third Place keep their names even when letters.json gives them a letter', () => {
  const w = world();
  sharedLabels(w, { [MAIN]: 'D', [LIB]: 'M', [PANE]: 'A' });
  // Main and the librarian in the roster too, so the order the two sources are read in decides the name (mutant N4).
  const roster = JSON.parse(fs.readFileSync(path.join(w.data, 'panes.json'), 'utf8'));
  fs.writeFileSync(path.join(w.data, 'panes.json'), JSON.stringify([{ pane: MAIN, label: '✦ brief' }, { pane: LIB, label: '✦ brief' }, ...roster]));
  assert.deepStrictEqual([seatName(w, MAIN), seatName(w, LIB), seatName(w, TP)], ['main', 'librarian', 'third place']);
});

test('L099: the captured row carries the letter as its seat', () => {
  const w = world();
  sharedLabels(w, { [PANE]: 'A', [PANE_B]: 'B', [PANE_E]: 'E' });
  transcript(w, PANE_B, [u('do it'), a('done')]);
  J.capturePass(O(w, { home: homeWith() }));
  const caps = fs.readdirSync(path.join(w.store, J.CAPTURES)).map((f) => JSON.parse(fs.readFileSync(path.join(w.store, J.CAPTURES, f), 'utf8')));
  assert.deepStrictEqual(caps.map((c) => c.seat), ['B']);
});
