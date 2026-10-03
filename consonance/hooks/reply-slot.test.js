// reply-slot.test.js - node --test consonance/hooks/reply-slot.test.js   (D218; under the heavy-run lock, --test-concurrency=1)
//
// NO MODEL CALL AND NO REAL TRANSCRIPT. Every transcript is a mock JSONL built here, in the shapes the SOURCES gate's tests use (and checked against real entries: a typed
// message carries origin.kind "human", a notification origin.kind "task-notification"). The data dir is a temp dir every time. Fake secrets are built at runtime.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'reply-slot.js');
const INSTALL = path.join(__dirname, '..', '..', 'dev', 'shell', 'install.ps1');
const MAIN_RS = path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs');
const PLAN = path.join(__dirname, '..', '..', 'exo_memory', 'loop', 'plan_finish_retrieval_2026-10-03.md');
const R = require('./reply-slot.js');
const MAIN_ID = '0c0c0c0a-0000-4000-8000-000000000a01', LIB_ID = '0c0c0c0b-0000-4000-8000-00000000115b', PANE_ID = '12fb81f6-f4c0-4ef8-aad8-f0cdce091925';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const OR_TOKEN = ['sk', 'or', 'v1', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4'].join('-');

const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'rs-test-'));
const rows = (dir) => { try { return fs.readFileSync(path.join(dir, 'reply-slot.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch (_) { return []; } };
const USER = (text, extra = {}) => ({ type: 'user', message: { role: 'user', content: text }, ...extra });
const HUMAN = (text) => USER(text, { origin: { kind: 'human' }, promptSource: 'typed' });
const NOTIF = () => USER('<task-notification>\n<task-id>b1</task-id>\n</task-notification>', { origin: { kind: 'task-notification' } });
const ASSIST = (...blocks) => ({ type: 'assistant', message: { role: 'assistant', content: blocks } });
const USE = (id, name, input) => ({ type: 'tool_use', id, name, input });
const RESULT = (id, text = 'ok', err = false) => ({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: text, ...(err ? { is_error: true } : {}) }] } });
const readCall = (id, p) => [ASSIST(USE(id, 'Read', { file_path: p })), RESULT(id, 'file text')];
const bashCall = (id, cmd) => [ASSIST(USE(id, 'Bash', { command: cmd })), RESULT(id, 'out')];
const writeTranscript = (dir, entries) => { const f = path.join(dir, 'transcript.jsonl'); fs.writeFileSync(f, entries.map((e) => JSON.stringify(e)).join('\n') + '\n'); return f; };

function envFor(dir, extra = {}) {
  const base = { ...process.env }; delete base.CONSONANCE_DREAM; delete base.CONSONANCE_PANE;
  return { ...base, CONSONANCE_DATA: dir, CONSONANCE_PANE: LIB_ID, ...extra };
}
function stopPayload(dir, entries, reply, extra = {}) {
  return JSON.stringify({ session_id: 'abcdef012345', transcript_path: entries ? writeTranscript(dir, entries) : null, cwd: 'C:/Consonance/instances/librarian', hook_event_name: 'Stop', stop_hook_active: false, last_assistant_message: reply, ...extra });
}
function run(dir, input, env = {}) {
  const r = spawnSync(process.execPath, [HOOK], { input, env: envFor(dir, env), encoding: 'utf8', timeout: 20000 });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}
const KEEPER_TURN = (...more) => [USER('earlier'), HUMAN('how are we doing with the retrieval work?'), ...more];
const last = (dir) => rows(dir).pop();

// ------------------------------------------------------------------ the tokens

test('TOKENS: a reply naming a path, a sha, a commit, a count N/M, "N of M", a percentage or a version is flagged, each by its kind', () => {
  const cases = {
    path: ['The plan is at exo_memory/loop/plan_x.md now.', 'See C:\\Users\\n\\notes.txt for it.', 'in consonance/hooks/reply-slot.js'],
    sha: ['It is at 9649ff6 on the branch.', 'the blob is 0a1b2c3d4e5f60718293a4b5c6d7e8f901234567'],
    commit: ['That went in with commit 9649ff6c.', 'landed as commit 3062377.'],
    count: ['47/47 tests pass.', 'Scored 3 of 60 so far.'],
    percentage: ['Followed 94% of the time.', 'up 12.5 %'],
    version: ['Claude Code v2.1.196 or later.', 'built on 1.96.0'],
  };
  for (const [kind, replies] of Object.entries(cases)) for (const t of replies) assert.ok(R.tokensIn(t).some((x) => x.kind === kind), kind + ' was not flagged in: ' + t);
});

test('TOKENS: plain prose, a bare number, a decimal, a word of hex-like letters, a lap id and a URL are not flagged', () => {
  assert.deepStrictEqual(R.tokensIn('Friday 10/03/2026 was long').filter((x) => x.kind === 'count'), [], 'a date with a year was read as a count');
  for (const t of ['Yes, go ahead and start with the second one.', 'I counted 12 of them earlier and it is fine', 'kappa came in at 0.868', 'a face, a bad decade, a feed', 'D218 and L123 are lap ids', 'which is why it matters']) {
    const tk = R.tokensIn(t).filter((x) => !(x.kind === 'count' && /of/.test(x.text)));   // "12 of them" is not "N of M"
    assert.deepStrictEqual(tk, [], 'flagged: ' + t + ' -> ' + JSON.stringify(tk));
  }
});

test('TOKENS: a sentence-final full stop, comma or closing bracket is not part of the token', () => {
  assert.deepStrictEqual(R.tokensIn('Filed at exo_memory/loop/x.md.').map((t) => t.text), ['exo_memory/loop/x.md']);
  assert.deepStrictEqual(R.tokensIn('(see consonance/hooks/a.js), then more').filter((t) => t.kind === 'path').map((t) => t.text), ['consonance/hooks/a.js']);
});

test('TOKENS: a flagged token is clipped, redacted of key shapes, deduplicated and capped at 12; no surrounding text is kept', () => {
  const many = Array.from({ length: 30 }, (_, i) => `exo_memory/loop/f${i}.md`).join(' ');
  assert.strictEqual(R.tokensIn(many).length, 12);
  assert.deepStrictEqual(R.tokensIn('exo_memory/loop/a.md and again exo_memory/loop/a.md').filter((x) => x.kind === 'path').length, 1);
  const tk = R.tokensIn('see exo_memory/' + OR_TOKEN + '.md please'); assert.ok(!JSON.stringify(tk).includes(OR_TOKEN), JSON.stringify(tk));
  for (const t of R.tokensIn('The sentence around 47/47 should not travel with the token.')) assert.ok(t.text.length <= 81 && !/sentence/.test(t.text));
});

// ------------------------------------------------------------------ the verdicts, matched vs unmatched

const REPLY_OK = 'The plan is at C:/work/a.md and 3 of 5 are done.\n\nSources: C:/work/a.md';
test('VERDICT: a Sources line whose items match calls of the turn is pass-matched', () => {
  const dir = tmpDir(), r = run(dir, stopPayload(dir, KEEPER_TURN(...readCall('t1', 'C:/work/a.md')), REPLY_OK));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
  const row = last(dir); assert.strictEqual(row.kind, 'pass-matched'); assert.strictEqual(row.wouldBlock, false); assert.strictEqual(row.seat, 'librarian'); assert.strictEqual(row.nSources, 1);
});
test('VERDICT: an unmatched Sources item is would-block-unmatched and the row names exactly that item', () => {
  const dir = tmpDir(), reply = 'Done: C:/work/a.md and C:/work/b.md, 4 of 5.\n\nSources: C:/work/a.md · C:/work/b.md';
  run(dir, stopPayload(dir, KEEPER_TURN(...readCall('t1', 'C:/work/a.md')), reply));
  const row = last(dir); assert.strictEqual(row.kind, 'would-block-unmatched'); assert.strictEqual(row.wouldBlock, true); assert.deepStrictEqual(row.unmatched, ['C:/work/b.md']);
});
test('VERDICT: a reply with a token and NO Sources line is would-block-missing; a Sources line that is not the FINAL line (a blank line and prose after it) is too', () => {
  const dir = tmpDir(), t = KEEPER_TURN(...readCall('t1', 'C:/work/a.md'));
  run(dir, stopPayload(dir, t, 'It is 47/47 green.')); assert.strictEqual(last(dir).kind, 'would-block-missing');
  run(dir, stopPayload(dir, t, 'It is 47/47 green.\n\nSources: C:/work/a.md\n\nAnd one more paragraph of prose.')); assert.strictEqual(last(dir).kind, 'would-block-missing');
});
test('VERDICT: "Sources: none" passes but is recorded as none; an empty Sources line is would-block-empty; "sources:" in any case and markdown emphasis count', () => {
  const dir = tmpDir(), t = KEEPER_TURN(...readCall('t1', 'C:/work/a.md'));
  run(dir, stopPayload(dir, t, 'Total 47/47.\n\nSources: none')); let row = last(dir); assert.strictEqual(row.kind, 'pass-none'); assert.strictEqual(row.none, true);
  run(dir, stopPayload(dir, t, 'Total 47/47.\n\nSources:')); assert.strictEqual(last(dir).kind, 'would-block-empty');
  run(dir, stopPayload(dir, t, 'At C:/work/a.md, 3 of 5.\n\n**sources:** C:/work/a.md')); assert.strictEqual(last(dir).kind, 'pass-matched');
});
test('VERDICT: the matcher is the SOURCES gate\'s: a command item matches a Bash call, an ls does not open, a read before the keeper\'s message is stale, a notification between is not a boundary', () => {
  const dir = tmpDir(), reply = 'Head is 3062377, 47/47.\n\nSources: `git log -1`';
  run(dir, stopPayload(dir, KEEPER_TURN(...bashCall('t1', 'git log -1')), reply)); assert.strictEqual(last(dir).kind, 'pass-matched');
  run(dir, stopPayload(dir, KEEPER_TURN(...bashCall('t1', 'ls -la C:/work/a.md')), 'At C:/work/a.md, 3 of 5.\n\nSources: C:/work/a.md')); assert.strictEqual(last(dir).kind, 'would-block-unmatched');
  run(dir, stopPayload(dir, [USER('x'), ...readCall('t1', 'C:/work/a.md'), HUMAN('a keeper message')], REPLY_OK)); assert.strictEqual(last(dir).kind, 'would-block-unmatched');
  run(dir, stopPayload(dir, KEEPER_TURN(...readCall('t1', 'C:/work/a.md'), NOTIF()), REPLY_OK)); assert.strictEqual(last(dir).kind, 'pass-matched');
});

// ------------------------------------------------------------------ what passes untouched

test('PASSES: no token is pass-notoken; the keep-warm "ok" and a keep-warm turn are skipped; a reply to a ring or a notification is not a reply to the keeper', () => {
  const dir = tmpDir();
  run(dir, stopPayload(dir, KEEPER_TURN(), 'Yes, go ahead.')); assert.strictEqual(last(dir).kind, 'pass-notoken'); assert.strictEqual(last(dir).wouldBlock, false);
  run(dir, stopPayload(dir, [USER('x'), HUMAN('[keep-warm, from the chair — not the keeper] Reply with exactly: ok')], 'ok')); assert.strictEqual(last(dir).kind, 'skip-keepwarm');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('[keep-warm, from the chair — not the keeper] Reply with exactly: ok')], 'ok, and 47/47 at exo_memory/x.md')); assert.strictEqual(last(dir).kind, 'skip-keepwarm', 'a keep-warm TURN is skipped whatever the reply says');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('[pane:B] D210 hand-back at exo_memory/handback/p.md')], 'Read it: 47/47 at exo_memory/handback/p.md'), { CONSONANCE_PANE: MAIN_ID }); assert.strictEqual(last(dir).kind, 'skip-not-keeper-ring', 'in the CHAIR session a pane ring stays skipped');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('\n\n<pasted_content id="e1">\n[chair:MAIN] D218 go\n</pasted_content id="e1">')], '47/47')); assert.strictEqual(last(dir).kind, 'skip-not-keeper-ring');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('keeper words'), ASSIST({ type: 'text', text: 'an earlier reply that ended the turn' }), NOTIF()], '47/47 at exo_memory/x.md')); assert.strictEqual(last(dir).kind, 'skip-not-keeper-machine', 'a turn a notification started while the seat was idle is not a reply to the keeper');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('keeper words'), ...readCall('t1', 'C:/work/a.md'), NOTIF()], '47/47 at exo_memory/x.md')); assert.strictEqual(last(dir).kind, 'would-block-missing', 'a notification that arrived MID-WORK must not turn the keeper\'s turn into a machine one');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('/compact')], '47/47')); assert.strictEqual(last(dir).kind, 'skip-not-keeper-machine');
  for (const row of rows(dir).filter((x) => /^(skip|pass)/.test(x.kind))) assert.strictEqual(row.wouldBlock, false);
});
test('PASSES: a bare "ok" reply, whatever the prompt, and an empty reply are skipped', () => {
  const dir = tmpDir();
  for (const reply of ['ok', 'OK.', '  ok\n', '']) { run(dir, stopPayload(dir, KEEPER_TURN(), reply)); assert.strictEqual(last(dir).kind, 'skip-keepwarm', JSON.stringify(reply)); }
});

// ------------------------------------------------------------------ D218 scope fix: a pane ring's reply is keeper-facing in the LIBRARIAN session only

const PANE_RING_TURN = (...more) => [USER('earlier'), HUMAN('[pane:B] D210 hand-back is at exo_memory/handback/p-x.md, 47/47'), ...more];
const PASTED_PANE_RING = '\n\n<pasted_content id="d7d4">\n[pane:B] D210 hand-back is at exo_memory/handback/p-x.md\n</pasted_content id="d7d4">';
test('D218 SCOPE: in the LIBRARIAN session a reply to a [pane: ring is EVALUATED (plain and pasted), and the row says it was a pane ring', () => {
  const dir = tmpDir();
  run(dir, stopPayload(dir, PANE_RING_TURN(), 'B is at 47/47, filed at exo_memory/handback/p-x.md.')); let row = last(dir);
  assert.strictEqual(row.kind, 'would-block-missing'); assert.strictEqual(row.prompt, 'pane-ring'); assert.strictEqual(row.seat, 'librarian'); assert.strictEqual(row.wouldBlock, true);
  run(dir, stopPayload(dir, [USER('x'), HUMAN(PASTED_PANE_RING)], 'B is at 47/47.')); assert.strictEqual(last(dir).kind, 'would-block-missing'); assert.strictEqual(last(dir).prompt, 'pane-ring');
  run(dir, stopPayload(dir, PANE_RING_TURN(), 'Understood, I will collate.')); assert.strictEqual(last(dir).kind, 'pass-notoken'); assert.strictEqual(last(dir).prompt, 'pane-ring');
});
test('D218 SCOPE: a pane-ring reply in the librarian session is judged on its Sources line exactly like a keeper reply (matched, unmatched, none)', () => {
  const dir = tmpDir(), t = PANE_RING_TURN(...readCall('t1', 'C:/work/a.md'));
  run(dir, stopPayload(dir, t, 'At C:/work/a.md, 3 of 5.\n\nSources: C:/work/a.md')); assert.strictEqual(last(dir).kind, 'pass-matched');
  run(dir, stopPayload(dir, t, 'At C:/work/a.md and C:/work/b.md, 3 of 5.\n\nSources: C:/work/a.md · C:/work/b.md')); assert.strictEqual(last(dir).kind, 'would-block-unmatched'); assert.deepStrictEqual(last(dir).unmatched, ['C:/work/b.md']);
  run(dir, stopPayload(dir, t, 'Total 47/47.\n\nSources: none')); assert.strictEqual(last(dir).kind, 'pass-none');
});
test('D218 SCOPE: in the CHAIR session a [pane: ring (plain or pasted) stays skipped, and so does every other ring; and in the librarian session a chair ring is still skipped', () => {
  const dir = tmpDir();
  run(dir, stopPayload(dir, PANE_RING_TURN(), 'B is at 47/47 at exo_memory/handback/p-x.md.'), { CONSONANCE_PANE: MAIN_ID }); assert.strictEqual(last(dir).kind, 'skip-not-keeper-ring'); assert.strictEqual(last(dir).seat, 'chair'); assert.strictEqual(last(dir).prompt, 'pane-ring');
  run(dir, stopPayload(dir, [USER('x'), HUMAN(PASTED_PANE_RING)], '47/47'), { CONSONANCE_PANE: MAIN_ID }); assert.strictEqual(last(dir).kind, 'skip-not-keeper-ring');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('\n\n<pasted_content id="e1">\n[chair:MAIN] D218 go\n</pasted_content id="e1">')], '47/47 at exo_memory/x.md')); assert.strictEqual(last(dir).kind, 'skip-not-keeper-ring', 'a CHAIR ring in the librarian session is not keeper-facing');
  for (const lead of ['[librarian: x]', '[sync] x', '[lap D1] x', '[orchestrator] x']) { run(dir, stopPayload(dir, [USER('x'), HUMAN(lead)], '47/47 at exo_memory/x.md')); assert.strictEqual(last(dir).kind, 'skip-not-keeper-ring', lead); }
});
test('D218 SCOPE: keep-warm and machine prompts stay skipped in BOTH sessions, and a turn a notification started while the seat was idle is still not keeper-facing after a pane ring', () => {
  const dir = tmpDir(), kw = HUMAN('[keep-warm, from the chair — not the keeper] Reply with exactly: ok');
  for (const pane of [LIB_ID, MAIN_ID]) {
    run(dir, stopPayload(dir, [USER('x'), kw], 'ok'), { CONSONANCE_PANE: pane }); assert.strictEqual(last(dir).kind, 'skip-keepwarm');
    run(dir, stopPayload(dir, [USER('x'), kw], '47/47 at exo_memory/x.md'), { CONSONANCE_PANE: pane }); assert.strictEqual(last(dir).kind, 'skip-keepwarm');
    run(dir, stopPayload(dir, [USER('x'), HUMAN('/compact')], '47/47'), { CONSONANCE_PANE: pane }); assert.strictEqual(last(dir).kind, 'skip-not-keeper-machine');
    run(dir, stopPayload(dir, [USER('x'), HUMAN('keeper words'), ASSIST({ type: 'text', text: 'an earlier reply that ended the turn' }), NOTIF()], '47/47'), { CONSONANCE_PANE: pane }); assert.strictEqual(last(dir).kind, 'skip-not-keeper-machine', 'a turn a notification started while idle');
  }
  run(dir, stopPayload(dir, [USER('x'), HUMAN('[pane:B] hand-back'), ASSIST({ type: 'text', text: 'an earlier reply that ended the turn' }), NOTIF()], '47/47 at exo_memory/x.md')); assert.strictEqual(last(dir).kind, 'skip-not-keeper-machine');
  run(dir, stopPayload(dir, [USER('x'), HUMAN('[pane:B] hand-back'), ...readCall('t1', 'C:/work/a.md'), NOTIF()], '47/47 at C:/work/a.md.')); assert.strictEqual(last(dir).kind, 'would-block-missing', 'a notification that arrived mid-work must not hide a pane-ring turn');
});
test('D218 SCOPE: still SHADOW: a pane-ring would-block prints nothing; with live true the block is produced only for the librarian seat, and never for the chair or with no seat named', () => {
  const dir = tmpDir(), r = run(dir, stopPayload(dir, PANE_RING_TURN(), 'B is at 47/47.')); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); assert.strictEqual(r.stderr, '');
  const entries = PANE_RING_TURN(), reply = 'B is at 47/47 at exo_memory/handback/p-x.md.';
  const live = R.verdict({ reply, entries, stopHookActive: false, live: true, seat: 'librarian' }); assert.ok(live.output && live.output.decision === 'block', JSON.stringify(live.output));
  assert.strictEqual(R.verdict({ reply, entries, stopHookActive: false, live: true, seat: 'chair' }).output, null); assert.strictEqual(R.verdict({ reply, entries, stopHookActive: false, live: true }).output, null, 'no seat named must not evaluate a ring');
  assert.strictEqual(R.verdict({ reply, entries, stopHookActive: true, live: true, seat: 'librarian' }).output, null, 'the loop guard must hold for a pane ring too');
  assert.strictEqual(R.promptKind(entries), 'pane-ring');
});

// ------------------------------------------------------------------ who

test('WHO: the librarian and the chair are identified by pane id, or by instance directory when there is no pane id; a committee pane and any other session are ignored with NO row', () => {
  const dir = tmpDir(), input = (cwd) => stopPayload(dir, KEEPER_TURN(), 'It is 47/47 at exo_memory/x.md.', { cwd });
  run(dir, input('C:/anywhere'), { CONSONANCE_PANE: MAIN_ID }); assert.strictEqual(last(dir).seat, 'chair');
  run(dir, input('C:/anywhere'), { CONSONANCE_PANE: LIB_ID.toUpperCase() }); assert.strictEqual(last(dir).seat, 'librarian');
  run(dir, input('C:\\Consonance\\instances\\main'), { CONSONANCE_PANE: '' }); assert.strictEqual(last(dir).seat, 'chair');
  run(dir, input('C:/Consonance/instances/librarian/'), { CONSONANCE_PANE: '' }); assert.strictEqual(last(dir).seat, 'librarian');
  const n = rows(dir).length;
  for (const [pane, cwd] of [[PANE_ID, 'C:/Consonance/instances/sibling-3d57124e'], [PANE_ID, 'C:/Consonance/instances/librarian'], ['', 'C:/Consonance/instances/sibling-3d57124e'], ['', 'C:/Consonance/instances/main/sub'], ['', 'C:/work']]) {
    const r = run(dir, input(cwd), { CONSONANCE_PANE: pane }); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
  }
  assert.strictEqual(rows(dir).length, n, 'a pane or other session left a row');
});
test('WHO: the two fixed ids are the ones main.rs declares', () => {
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  assert.ok(new RegExp('const MAIN_SID: &str = "' + R.SEAT_IDS.MAIN + '"').test(src)); assert.ok(new RegExp('const LIBRARIAN_SID: &str = "' + R.SEAT_IDS.LIBRARIAN + '"').test(src));
});

// ------------------------------------------------------------------ never blocks in shadow; the guard; live is built

test('SHADOW: it NEVER blocks: every verdict, would-block ones included, prints nothing and exits 0', () => {
  const dir = tmpDir(), t = KEEPER_TURN(...readCall('t1', 'C:/work/a.md'));
  for (const reply of ['It is 47/47 green.', 'Done at C:/work/zzz.md, 3 of 5.\n\nSources: C:/work/zzz.md', 'Total 47/47.\n\nSources:', REPLY_OK, 'Yes.']) {
    const r = run(dir, stopPayload(dir, t, reply)); assert.strictEqual(r.status, 0, reply); assert.strictEqual(r.stdout, '', 'printed something: ' + reply); assert.strictEqual(r.stderr, '', reply);
  }
  assert.ok(rows(dir).some((x) => x.wouldBlock), 'control: nothing would have blocked'); assert.ok(R.SHADOW === true);
});
test('LIVE (built, not on): with live true a would-block returns the Stop block JSON naming the kinds and the unmatched items; stop_hook_active true returns nothing', () => {
  const entries = KEEPER_TURN(...readCall('t1', 'C:/work/a.md')), reply = 'Done at C:/work/zzz.md, 3 of 5.\n\nSources: C:/work/zzz.md';
  const v = R.verdict({ reply, entries, stopHookActive: false, live: true });
  assert.ok(v.output && v.output.decision === 'block', JSON.stringify(v.output)); assert.ok(/path/.test(v.output.reason) && /count/.test(v.output.reason) && /C:\/work\/zzz\.md/.test(v.output.reason), v.output.reason);
  assert.deepStrictEqual(Object.keys(v.output).sort(), ['decision', 'reason']);
  assert.strictEqual(R.verdict({ reply, entries, stopHookActive: true, live: true }).output, null, 'THE LOOP GUARD did not hold when live');
  assert.strictEqual(R.verdict({ reply, entries, stopHookActive: true, live: true }).kind, 'skip-active');
  assert.strictEqual(R.verdict({ reply, entries, stopHookActive: false, live: false }).output, null, 'shadow produced a block');
  assert.strictEqual(R.verdict({ reply: REPLY_OK, entries, stopHookActive: false, live: true }).output, null, 'a matched reply was blocked');
  assert.strictEqual(R.verdict({ reply: 'plain words', entries, stopHookActive: false, live: true }).output, null);
});
test('GUARD: stop_hook_active true is skip-active even with NO readable transcript (the transcript is not even read), and a notification issued between a tool call and its result is still the keeper\'s turn', () => {
  const d2 = tmpDir(); run(d2, stopPayload(d2, null, 'It is 47/47.', { stop_hook_active: true })); assert.strictEqual(last(d2).kind, 'skip-active', 'the guard read the transcript');
  run(d2, stopPayload(d2, [USER('x'), HUMAN('keeper words'), ASSIST(USE('t1', 'Read', { file_path: 'C:/work/a.md' })), NOTIF(), RESULT('t1')], '47/47 at exo_memory/x.md')); assert.strictEqual(last(d2).kind, 'would-block-missing');
});
test('GUARD: stop_hook_active true in a real run logs skip-active, evaluates nothing, prints nothing', () => {
  const dir = tmpDir(), r = run(dir, stopPayload(dir, KEEPER_TURN(), 'It is 47/47 at exo_memory/x.md.', { stop_hook_active: true }));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); const row = last(dir); assert.strictEqual(row.kind, 'skip-active'); assert.strictEqual(row.wouldBlock, false); assert.deepStrictEqual(row.tokens, []);
});

// ------------------------------------------------------------------ the ledger: no message text

test('LEDGER: a row carries a sha of the reply, its length and the flagged tokens, and NOT the reply text; the shadow flag and the session prefix are there', () => {
  const dir = tmpDir(), reply = 'An unmistakable sentence that must not be stored anywhere. It is 47/47 at C:/work/q.md.\n\nSources: C:/work/q.md';
  run(dir, stopPayload(dir, KEEPER_TURN(), reply));
  const row = last(dir), raw = fs.readFileSync(path.join(dir, 'reply-slot.jsonl'), 'utf8');
  assert.ok(!raw.includes('unmistakable') && !raw.includes('stored anywhere'), 'reply text reached the ledger'); assert.strictEqual(row.replySha, sha(reply)); assert.strictEqual(row.replyChars, reply.length);
  assert.strictEqual(row.shadow, true); assert.strictEqual(row.session, 'abcdef01'); assert.strictEqual(row.v, 1); assert.ok(row.tokenKinds.includes('count') && row.tokenKinds.includes('path'));
  assert.ok(Array.isArray(row.tokens) && row.tokens.every((t) => typeof t.kind === 'string' && typeof t.text === 'string'));
});
test('LEDGER: a key shape in an unmatched Sources item is redacted', () => {
  const dir = tmpDir(); run(dir, stopPayload(dir, KEEPER_TURN(), 'It is 47/47.\n\nSources: `echo ' + OR_TOKEN + '`'));
  const raw = fs.readFileSync(path.join(dir, 'reply-slot.jsonl'), 'utf8'); assert.ok(!raw.includes(OR_TOKEN)); assert.ok(raw.includes('<redacted>'));
});

// ------------------------------------------------------------------ fail open

test('FAIL OPEN: garbage or empty stdin, a non-object payload, and a missing last_assistant_message exit 0 with nothing printed', () => {
  const dir = tmpDir();
  for (const input of ['', 'not json', '[1,2]', 'null']) { const r = run(dir, input); assert.strictEqual(r.status, 0, input); assert.strictEqual(r.stdout, ''); }
  const r = run(dir, JSON.stringify({ session_id: 's', cwd: 'C:/Consonance/instances/librarian', stop_hook_active: false })); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
  assert.strictEqual(last(dir).kind, 'error'); assert.ok(/last_assistant_message/.test(last(dir).error));
});
test('FAIL OPEN: a missing or unparseable transcript logs an error row and never blocks, even for a reply that would block', () => {
  const dir = tmpDir(), reply = 'It is 47/47.';
  let r = run(dir, stopPayload(dir, null, reply)); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); assert.strictEqual(last(dir).kind, 'error'); assert.ok(/transcript/.test(last(dir).error));
  const bad = path.join(dir, 'bad.jsonl'); fs.writeFileSync(bad, '{not json\n\u0000 garbage\n');
  r = run(dir, JSON.stringify({ session_id: 's', transcript_path: bad, cwd: 'C:/x', stop_hook_active: false, last_assistant_message: reply })); assert.strictEqual(r.stdout, ''); assert.strictEqual(last(dir).kind, 'error');
});
test('FAIL OPEN: with no data dir, or a ledger that cannot be written, it still prints nothing and exits 0', () => {
  const dir = tmpDir(), home = tmpDir(), input = stopPayload(dir, KEEPER_TURN(), 'It is 47/47.');
  const r1 = spawnSync(process.execPath, [HOOK], { input, env: { ...envFor(dir), CONSONANCE_DATA: '', USERPROFILE: home, HOME: home }, encoding: 'utf8' }); assert.strictEqual(r1.status, 0); assert.strictEqual(r1.stdout, '');
  const blocked = path.join(dir, 'blocked'); fs.mkdirSync(path.join(blocked, 'reply-slot.jsonl'), { recursive: true });
  const r2 = run(blocked, input); assert.strictEqual(r2.status, 0); assert.strictEqual(r2.stdout, '');
});
test('FAIL OPEN: alone in a directory (sources-gate.js not beside it) it logs an error row and exits 0', () => {
  const dir = tmpDir(), solo = tmpDir(); fs.copyFileSync(HOOK, path.join(solo, 'reply-slot.js'));
  const r = spawnSync(process.execPath, [path.join(solo, 'reply-slot.js')], { input: stopPayload(dir, KEEPER_TURN(), 'It is 47/47.'), env: envFor(dir), encoding: 'utf8' });
  assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); assert.strictEqual(last(dir).kind, 'error'); assert.ok(/sources-gate/.test(last(dir).error));
});
test('GUARDS: the dream gate and the second-reader environment do not get a row', () => {
  const dir = tmpDir(), input = stopPayload(dir, KEEPER_TURN(), 'It is 47/47.');
  const r = run(dir, input, { CONSONANCE_DREAM: '1' }); assert.strictEqual(r.status, 0); assert.strictEqual(rows(dir).length, 0);
  // the hook's OWN dream gate, not only the one in the sources-gate it requires (which exits on require): alone in a directory, a dream session still gets no row and no output
  const solo = tmpDir(); fs.copyFileSync(HOOK, path.join(solo, 'reply-slot.js'));
  const r2 = spawnSync(process.execPath, [path.join(solo, 'reply-slot.js')], { input, env: envFor(dir, { CONSONANCE_DREAM: '1' }), encoding: 'utf8' });
  assert.strictEqual(r2.status, 0); assert.strictEqual(r2.stdout, ''); assert.strictEqual(rows(dir).length, 0, 'the hook\'s own dream gate is missing');
});

// ------------------------------------------------------------------ registration

test('REGISTERED: install.ps1 copies reply-slot.js beside sources-gate.js and registers it on Stop with no matcher; every other Stop entry is still there', () => {
  const src = fs.readFileSync(INSTALL, 'utf8').replace(/\r\n/g, '\n');
  assert.ok(/From = 'consonance\\hooks\\reply-slot\.js';\s+To = 'hooks\\reply-slot\.js'/.test(src), 'the file entry is missing');
  assert.ok(/From = 'consonance\\hooks\\sources-gate\.js';\s+To = 'hooks\\sources-gate\.js'/.test(src), 'sources-gate.js must install into the same directory');
  const m = src.match(/@\{ Event = 'Stop';\s+Rel = 'hooks\\reply-slot\.js';\s+Runner = 'node'\s*\}/); assert.ok(m, 'the Stop registration is missing or has a matcher');
  for (const other of ['hooks\\stop.js', 'sourced-stop.js', 'hooks\\ready-stop.js', 'carrier-drift-watch.js']) assert.ok(src.includes("Event = 'Stop';") && src.includes(other), other + ' vanished');
});
test('PLAN: the plan the hook cites exists', () => { assert.ok(fs.existsSync(PLAN)); });
test('HOOK SOURCE: no process is spawned, no network is called, and nothing but the ledger is written', () => {
  const src = fs.readFileSync(HOOK, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  assert.ok(!/child_process|spawn\(|exec\(|https?\.request|fetch\(/.test(src)); assert.strictEqual((src.match(/appendFileSync|writeFileSync/g) || []).length, 1, 'writes more than the ledger');
});
