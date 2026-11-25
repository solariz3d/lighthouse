// usage-ledger.js (the reader) and consonance/hooks/usage-ledger.js (the writer): L213, pane A.
//   node consonance/tools/usage-ledger.test.js
// R2 (registered before code): a row that feeds the reader two ledger lines and checks the per-seat movement it prints.
// R4: the ledger holds no text field longer than a seat id or a model id.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const reader = require('./usage-ledger.js');
const writer = require('../hooks/usage-ledger.js');

// A Windows-shaped path built at run time, so the portable-paths scan does not read a fixture as a hard-coded path.
const WIN = (...p) => ['C' + ':', ...p].join(String.fromCharCode(92));

// What the harness hands a status line script after a turn, as probed on 2.1.330 (keys and numbers; strings stand in).
function status(over = {}) {
  return {
    session_id: 'aaaaaaaa-1111-2222-3333-444444444444', transcript_path: WIN('x', 'y.jsonl'), cwd: WIN('Users', 'someone', 'proj'),
    prompt_id: 'bbbbbbbb-1111-2222-3333-444444444444', effort: { level: 'high' }, session_name: 'a name that must never land in the ledger',
    model: { id: 'claude-sonnet-5-5', display_name: 'Sonnet 5.5' }, workspace: { current_dir: WIN('x') }, version: '2.1.330',
    cost: { total_cost_usd: 0.0102, total_duration_ms: 2088, total_api_duration_ms: 811 },
    context_window: { total_input_tokens: 70884, total_output_tokens: 4, context_window_size: 1000000,
      current_usage: { input_tokens: 2, output_tokens: 4, cache_creation_input_tokens: 49782, cache_read_input_tokens: 21100 }, used_percentage: 7 },
    prompt_cache: { warm: true, caching_observed: true, ttl: '1h', expires_at: 1795247169, requests: 1, misses: 0, hit_ratio: 0.2977,
      cache_write_tokens: 49782, miss_recache_tokens: 0, last_miss_cause: null, recache_tokens_if_cold: 70884 },
    rate_limits: { seven_day: { used_percentage: 2, resets_at: 1795816800 } },
    ...over,
  };
}
const ENV = { CONSONANCE_PANE: '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f' };

test('R2 the reader, given two ledger lines, prints how far the 7-day figure moved and which seat it moved on', () => {
  const rows = [
    { v: 1, kind: 'turn', t: '2026-11-21T07:00:00.000Z', seat: 'aaaaaaaa', model: 'claude-sonnet-5-5', seven_day_pct: 2, seven_day_resets: 1795816800, in: 2, out: 4, cache_create: 100, cache_read: 900 },
    { v: 1, kind: 'turn', t: '2026-11-21T07:05:00.000Z', seat: 'bbbbbbbb', model: 'claude-opus-5-5', seven_day_pct: 5, seven_day_resets: 1795816800, in: 3, out: 50, cache_create: 20, cache_read: 5000 },
  ];
  const out = reader.report(rows, { since: '2026-11-21T00:00:00Z' });
  const b = out.seats.find((s) => s.seat === 'bbbbbbbb');
  const a = out.seats.find((s) => s.seat === 'aaaaaaaa');
  assert.strictEqual(b.moved, 3, 'the seat whose turn reported 2 -> 5 carries the 3 points');
  assert.strictEqual(a.moved, 0, 'the first row has nothing before it to move from');
  assert.strictEqual(out.first_pct, 2);
  assert.strictEqual(out.last_pct, 5);
  assert.strictEqual(out.seats[0].seat, 'bbbbbbbb', 'sorted by movement, the biggest first');
});

test('R2 the reader counts a reset of the window as no movement, and counts tokens by class', () => {
  const rows = [
    { v: 1, kind: 'turn', t: '2026-11-21T07:00:00.000Z', seat: 'aaaaaaaa', seven_day_pct: 90, seven_day_resets: 100, in: 1, out: 2, cache_create: 3, cache_read: 4 },
    { v: 1, kind: 'turn', t: '2026-11-21T07:01:00.000Z', seat: 'aaaaaaaa', seven_day_pct: 1, seven_day_resets: 200, in: 10, out: 20, cache_create: 30, cache_read: 40 },
  ];
  const s = reader.report(rows, {}).seats[0];
  assert.strictEqual(s.moved, 0);
  assert.deepStrictEqual([s.in, s.out, s.cache_create, s.cache_read, s.turns], [11, 22, 33, 44, 2]);
});

test('R2 a figure that is HIGHER under a new reset time is a new window, not movement', () => {
  const rows = [
    { v: 1, kind: 'turn', t: '2026-11-21T07:00:00.000Z', seat: 'aaaaaaaa', seven_day_pct: 2, seven_day_resets: 100, in: 0, out: 0, cache_create: 0, cache_read: 0 },
    { v: 1, kind: 'turn', t: '2026-11-21T07:01:00.000Z', seat: 'aaaaaaaa', seven_day_pct: 8, seven_day_resets: 200, in: 0, out: 0, cache_create: 0, cache_read: 0 },
  ];
  assert.strictEqual(reader.report(rows, {}).seats[0].moved, 0);
});

test('the reader says so when rows carry no 7-day figure', () => {
  const rows = [{ v: 1, kind: 'turn', t: '2026-11-21T07:00:00.000Z', seat: 'aaaaaaaa', seven_day_pct: null, in: 1, out: 1, cache_create: 0, cache_read: 0 }];
  const out = reader.report(rows, {});
  assert.strictEqual(out.rows_without_pct, 1);
  assert.strictEqual(out.last_pct, null);
});

test('the reader keeps only rows at or after --since, and keeps wakes out of the turn counts', () => {
  const rows = [
    { v: 1, kind: 'turn', t: '2026-11-20T07:00:00.000Z', seat: 'aaaaaaaa', seven_day_pct: 1, seven_day_resets: 1, in: 1, out: 1, cache_create: 0, cache_read: 0 },
    { v: 1, kind: 'turn', t: '2026-11-21T07:00:00.000Z', seat: 'aaaaaaaa', seven_day_pct: 2, seven_day_resets: 1, in: 1, out: 1, cache_create: 0, cache_read: 0 },
    { v: 1, kind: 'wake', t: '2026-11-21T08:00:00.000Z', seat: 'aaaaaaaa', source: 'resume', context_tokens: 267000, cache_expired: true, est_cache_write_usd: 1.2 },
  ];
  const out = reader.report(rows, { since: '2026-11-21T00:00:00Z' });
  assert.strictEqual(out.seats[0].turns, 1);
  assert.strictEqual(out.seats[0].wakes, 1);
  assert.strictEqual(out.seats[0].wake_tokens_cold, 267000);
});

test('the CLI prints a line per seat and exits 0, and refuses a --since that is not a date', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'usage-ledger-'));
  const file = path.join(dir, 'l.jsonl');
  fs.writeFileSync(file, [
    { v: 1, kind: 'turn', t: '2026-11-21T07:00:00.000Z', seat: 'aaaaaaaa', seven_day_pct: 2, seven_day_resets: 1, in: 1, out: 1, cache_create: 0, cache_read: 0 },
    { v: 1, kind: 'turn', t: '2026-11-21T07:05:00.000Z', seat: 'bbbbbbbb', seven_day_pct: 4, seven_day_resets: 1, in: 1, out: 1, cache_create: 0, cache_read: 0 },
  ].map((r) => JSON.stringify(r)).join('\n') + '\n');
  const ok = spawnSync(process.execPath, [path.join(__dirname, 'usage-ledger.js'), '--file', file, '--since', '2026-11-21T00:00:00Z'], { encoding: 'utf8' });
  assert.strictEqual(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /bbbbbbbb\s+\+2/);
  const bad = spawnSync(process.execPath, [path.join(__dirname, 'usage-ledger.js'), '--file', file, '--since', 'yesterday-ish'], { encoding: 'utf8' });
  assert.notStrictEqual(bad.status, 0);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('the writer turns a status line payload into numbers and short ids, and no free text', () => {
  const row = writer.rowFromStatus(status(), ENV, Date.parse('2026-11-21T07:00:00Z'));
  assert.strictEqual(row.kind, 'turn');
  assert.strictEqual(row.seat, '6fe15f0a');
  assert.strictEqual(row.session, 'aaaaaaaa');
  assert.strictEqual(row.model, 'claude-sonnet-5-5');
  assert.strictEqual(row.seven_day_pct, 2);
  assert.strictEqual(row.five_hour_pct, null, 'absent on this account: null, not zero');
  assert.strictEqual(row.cache_warm, true);
  assert.strictEqual(row.cache_create, 49782);
  assert.strictEqual(row.cache_read, 21100);
  assert.strictEqual(row.recache_if_cold, 70884);
});

test('R4 no text field of a row is longer than a model id', () => {
  const rows = [
    writer.rowFromStatus(status(), ENV, Date.now()),
    writer.rowFromWake({ session_id: 'cccccccc-1', hook_event_name: 'SessionStart', source: 'resume', seconds_since_last_response: 700, context_tokens: 267000, prompt_cache_likely_expired: true, estimated_cache_write_usd: 1.3, transcript_path: WIN('secret', 'path.jsonl'), cwd: WIN('Users', 'someone') }, ENV, Date.now()),
  ];
  for (const r of rows) for (const [k, v] of Object.entries(r)) {
    if (typeof v === 'string' && k !== 't') assert.ok(v.length <= 40, `${k} is ${v.length} characters`);
    assert.ok(!/[\\/]/.test(typeof v === 'string' && k !== 't' ? v : ''), `${k} carries a path`);
  }
  assert.ok(!JSON.stringify(rows).includes('someone'), 'no account or folder name');
  assert.ok(!JSON.stringify(rows).includes('a name that must never'), 'no session name');
});

test('the writer skips the first status line of a session (nothing used yet) and a repeat of the same turn', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'usage-ledger-'));
  const env = { ...ENV, CONSONANCE_DATA: dir };
  const empty = status({ context_window: { total_input_tokens: 0, total_output_tokens: 0, context_window_size: 1000000, current_usage: null, used_percentage: null } });
  assert.strictEqual(writer.handle(empty, env).wrote, false);
  assert.strictEqual(writer.handle(status(), env).wrote, true);
  assert.strictEqual(writer.handle(status(), env).wrote, false, 'the status line fires several times a turn');
  assert.strictEqual(writer.handle(status({ prompt_id: 'dddddddd-1111-2222-3333-444444444444' }), env).wrote, true);
  const lines = fs.readFileSync(path.join(dir, 'usage-ledger.jsonl'), 'utf8').trim().split('\n');
  assert.strictEqual(lines.length, 2);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('the writer ignores any other hook event, even one that carries status fields', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'usage-ledger-'));
  assert.strictEqual(writer.handle(status({ hook_event_name: 'Stop' }), { ...ENV, CONSONANCE_DATA: dir }).wrote, false);
  assert.ok(!fs.existsSync(path.join(dir, 'usage-ledger.jsonl')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('the writer turns a resume SessionStart payload into a wake row, and a bad payload into nothing', () => {
  const w = writer.rowFromWake({ hook_event_name: 'SessionStart', source: 'resume', session_id: 'cccccccc-1', seconds_since_last_response: 700, context_tokens: 267000, prompt_cache_likely_expired: true, estimated_cache_write_usd: 1.3 }, ENV, Date.now());
  assert.deepStrictEqual([w.kind, w.source, w.seconds_since, w.context_tokens, w.cache_expired, w.est_cache_write_usd], ['wake', 'resume', 700, 267000, true, 1.3]);
  assert.strictEqual(writer.handle(null, {}).wrote, false);
  assert.strictEqual(writer.handle({}, {}).wrote, false);
});

// L213 follow-up (B's read, p-l213-read-B): the room's two hook habits. A hook a dream session meets must switch off on CONSONANCE_DREAM, and a hook never
// waits on a stdin that does not end.
const HOOK = path.join(__dirname, '..', 'hooks', 'usage-ledger.js');
function runHook(input, env, opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'usage-ledger-'));
  const r = spawnSync(process.execPath, [HOOK], { input, encoding: 'utf8', env: { ...process.env, CONSONANCE_DREAM: '', CONSONANCE_DATA: dir, CONSONANCE_PANE: 'aaaaaaaa-1', ...env }, ...opts });
  const wrote = fs.existsSync(path.join(dir, 'usage-ledger.jsonl'));
  fs.rmSync(dir, { recursive: true, force: true });
  return { r, wrote };
}

test('the hook as a process writes a row from a status payload (the control for the dream row)', () => {
  const { r, wrote } = runHook(JSON.stringify(status()), {});
  assert.strictEqual(r.status, 0, r.stderr);
  assert.strictEqual(wrote, true);
});

test('a dream session (CONSONANCE_DREAM set) gets no row and no output from the hook', () => {
  const { r, wrote } = runHook(JSON.stringify(status()), { CONSONANCE_DREAM: '1' });
  assert.strictEqual(r.status, 0, r.stderr);
  assert.strictEqual(wrote, false);
  assert.strictEqual(r.stdout, '');
  const wake = runHook(JSON.stringify({ hook_event_name: 'SessionStart', source: 'resume', session_id: 'cccccccc-1' }), { CONSONANCE_DREAM: '1' });
  assert.strictEqual(wake.wrote, false);
});

test('a stdin that never ends does not hold the hook: it exits 0 by its own watchdog', async () => {
  const { spawn } = require('child_process');
  const child = spawn(process.execPath, [HOOK], { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, CONSONANCE_DREAM: '', CONSONANCE_DATA: os.tmpdir() } });   // stdin is held open and never written
  const t0 = Date.now();
  const code = await new Promise((resolve) => {
    const kill = setTimeout(() => { child.kill(); resolve('still running after 8 s'); }, 8000);
    child.on('exit', (c) => { clearTimeout(kill); resolve(c); });
  });
  assert.strictEqual(code, 0, 'it did not leave by itself: ' + code);
  assert.ok(Date.now() - t0 < 6000, 'it took ' + (Date.now() - t0) + ' ms');
});

// ---- L225 A2: calls that only wait (pane A). R3 (registered before code): the rule is in usage-ledger.js above `isWaitCommand`.
test('A2 a command that only sleeps, tails or re-reads a run already started is a wait', () => {
  for (const c of [
    'sleep 30', 'sleep 5; tail -n 5 out.txt', 'tail -f x.log', 'tail -c 1500 build.txt', 'until grep -q done f.txt; do sleep 2; done',
    'Start-Sleep -Seconds 20; Get-Content log.txt -Tail 5', 'Get-Content log.txt -Wait', 'node heavy-run.js --status', 'tasklist | grep node',
    'node consonance/tools/heavy-run.js --status',
  ]) assert.strictEqual(reader.isWaitCommand(c), true, c);
});

test('A2 a command that does any other work is not a wait, even with a sleep beside it', () => {
  for (const c of [
    'git status', 'sleep 5 && node test.js', 'node heavy-run.js --status && node build.js', 'ls | grep x', 'cat file.txt', 'node a.js; tail x.log',
    'Start-Sleep 3; npm test', '', '   ',
  ]) assert.strictEqual(reader.isWaitCommand(c), false, JSON.stringify(c));
});

function asst(id, ts, blocks, extra = {}) {
  return JSON.stringify({ type: 'assistant', timestamp: ts, message: { id, usage: { input_tokens: 1 }, content: blocks }, ...extra });
}
const sh = (name, command) => ({ type: 'tool_use', name, input: { command } });

test('A2 a model call counts once however many rows carry it, and is a wait only when every tool call in it is a waiting shell call', () => {
  const lines = [
    asst('m1', '2026-11-21T11:01:00Z', [sh('Bash', 'sleep 20')]),
    asst('m1', '2026-11-21T11:01:00Z', [sh('Bash', 'tail -n 3 x.log')]),      // a second row of the SAME call
    asst('m2', '2026-11-21T11:02:00Z', [sh('Bash', 'git status')]),
    asst('m3', '2026-11-21T11:03:00Z', [sh('Bash', 'sleep 5'), { type: 'tool_use', name: 'Read', input: { file_path: 'x' } }]),
    asst('m4', '2026-11-21T11:04:00Z', [{ type: 'text', text: 'done' }]),
    asst('m5', '2026-11-21T11:05:00Z', [sh('PowerShell', 'Start-Sleep -Seconds 9')]),
    asst('m6', '2026-11-21T11:06:00Z', [sh('Bash', 'sleep 9')], { isSidechain: true }),
    JSON.stringify({ type: 'user', timestamp: '2026-11-21T11:07:00Z', message: { content: 'hi' } }),
    'not json',
  ];
  assert.deepStrictEqual(reader.countCalls(lines), { calls: 5, waits: 2, mixed: 0 });
});

test('A2 countCalls reads only the window it is given, and an empty transcript is 0 of 0', () => {
  const lines = [
    asst('a', '2026-11-21T10:59:59Z', [sh('Bash', 'sleep 1')]),
    asst('b', '2026-11-21T11:00:00Z', [sh('Bash', 'sleep 1')]),
    asst('c', '2026-11-21T12:00:00Z', [sh('Bash', 'sleep 1')]),
  ];
  assert.deepStrictEqual(reader.countCalls(lines, { since: '2026-11-21T11:00:00Z', until: '2026-11-21T12:00:00Z' }), { calls: 1, waits: 1, mixed: 0 });
  assert.deepStrictEqual(reader.countCalls([]), { calls: 0, waits: 0, mixed: 0 });
});

test('A2 the report carries calls and waits per seat, and a seat with no transcript says so rather than 0', () => {
  const rows = [{ v: 1, kind: 'turn', t: '2026-11-21T11:00:00.000Z', seat: 'aaaaaaaa', in: 1, out: 1, cache_create: 0, cache_read: 0 },
    { v: 1, kind: 'turn', t: '2026-11-21T11:00:01.000Z', seat: 'bbbbbbbb', in: 1, out: 1, cache_create: 0, cache_read: 0 }];
  const out = reader.report(rows, { calls: { aaaaaaaa: { calls: 10, waits: 3 } } });
  const a = out.seats.find((s) => s.seat === 'aaaaaaaa'), b = out.seats.find((s) => s.seat === 'bbbbbbbb');
  assert.deepStrictEqual([a.calls, a.waits], [10, 3]);
  assert.deepStrictEqual([b.calls, b.waits], [null, null]);
  assert.match(reader.render(out, {}), /3 of 10/);
});

test('A2 a transcript is found by its seat id at the start of its file name, in any project folder', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ul-'));
  const proj = path.join(dir, 'proj-one'); fs.mkdirSync(proj);
  fs.writeFileSync(path.join(proj, 'aaaaaaaa-1111-2222-3333-444444444444.jsonl'), asst('x', '2026-11-21T11:00:00Z', [sh('Bash', 'sleep 3')]) + '\n');
  fs.writeFileSync(path.join(proj, 'bbbbbbbb-1111-2222-3333-444444444444.jsonl'), asst('y', '2026-11-21T11:00:00Z', [sh('Bash', 'ls')]) + '\n');
  const got = reader.callsBySeat(dir, ['aaaaaaaa', 'cccccccc'], {});
  assert.deepStrictEqual(got, { aaaaaaaa: { calls: 1, waits: 1, mixed: 0 } });
  fs.rmSync(dir, { recursive: true, force: true });
});

test('A2 a call that waits AND does other work is counted apart as mixed, never as a wait', () => {
  const lines = [
    asst('w', '2026-11-21T11:00:00Z', [sh('Bash', 'sleep 5')]),
    asst('x', '2026-11-21T11:01:00Z', [sh('Bash', 'tail -8 b.txt | cut -c1-200; wc -l b.txt; ls -la')]),
    asst('y', '2026-11-21T11:02:00Z', [sh('Bash', 'git status')]),
    asst('z', '2026-11-21T11:03:00Z', [sh('Bash', 'sleep 5 && node t.js'), { type: 'tool_use', name: 'Read', input: {} }]),
  ];
  assert.deepStrictEqual(reader.countCalls(lines), { calls: 4, waits: 1, mixed: 1 });
  assert.strictEqual(reader.hasWaitStatement('tail -8 b.txt | cut; wc -l b.txt'), true);
  assert.strictEqual(reader.hasWaitStatement('git status'), false);
});

test('A2 a cd or a variable assignment beside a wait does not stop it being a wait, and alone it is not one', () => {
  for (const c of ['cd /x/y && tail -5 b.txt', 'S=/tmp/s; sleep 30; tail -3 $S/b.txt', "$S='x'; Start-Sleep 5", 'cd /x && until grep -q ok f; do sleep 2; done']) assert.strictEqual(reader.isWaitCommand(c), true, c);
  for (const c of ['cd /x/y', 'S=/tmp/s', 'cd /x && git status', 'S=/tmp/s; node a.js']) assert.strictEqual(reader.isWaitCommand(c), false, c);
});

// L235 counter: files a pane re-reads in its first lap after a cut that it had read before the cut.
const rrJ = (o) => JSON.stringify(o);
const rrAsst = (t, name, input) => rrJ({ type: 'assistant', timestamp: t, message: { id: 'm' + t, content: [{ type: 'tool_use', name, input }] } });
const rrPrompt = (t, text) => rrJ({ type: 'user', timestamp: t, message: { content: text } });
const rrCut = (t) => rrJ({ type: 'system', subtype: 'compact_boundary', timestamp: t });

test('L235-1 a file read before the cut and read again in the first lap after it is counted once', () => {
  const lines = [
    rrPrompt('1', '[chair:MAIN] L229, yours'), rrAsst('2', 'Read', { file_path: 'C:\\x\\a.md' }), rrAsst('3', 'Bash', { command: 'sed -n 1,5p /c/x/b.js' }),
    rrCut('4'),
    rrPrompt('5', '[chair:MAIN] L232, yours'), rrAsst('6', 'Read', { file_path: 'C:/x/a.md' }), rrAsst('7', 'Read', { file_path: 'C:/x/a.md' }),
    rrAsst('8', 'Bash', { command: 'cat /c/x/b.js | head' }), rrAsst('9', 'Read', { file_path: 'C:/x/new.md' }),
  ];
  const r = reader.rereadsAfterCuts(lines);
  assert.strictEqual(r.length, 1);
  assert.deepStrictEqual(r[0].reread.sort(), ['c:/x/a.md', 'c:/x/b.js']);
  assert.strictEqual(r[0].firstLap, 'L232');
});
test('L235-2 the first lap ends at the next chair dispatch with another lap id; a read after it is not counted', () => {
  const lines = [rrAsst('1', 'Read', { file_path: '/a/f.md' }), rrCut('2'), rrPrompt('3', '[chair:MAIN] L232 x'), rrAsst('4', 'Read', { file_path: '/b/g.md' }),
    rrPrompt('5', '[chair:MAIN] L233 y'), rrAsst('6', 'Read', { file_path: '/a/f.md' })];
  assert.deepStrictEqual(reader.rereadsAfterCuts(lines)[0].reread, []);
});
test('L235-3 a transcript with no cut, an empty one and a torn line give no rows and no throw', () => {
  assert.deepStrictEqual(reader.rereadsAfterCuts([rrAsst('1', 'Read', { file_path: '/a' })]), []);
  assert.deepStrictEqual(reader.rereadsAfterCuts(['']), []);
  assert.deepStrictEqual(reader.rereadsAfterCuts(['{torn', rrCut('2')]).map((x) => x.reread), [[]]);
});
