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

// What the harness hands a status line script after a turn, as probed on 2.1.330 (keys and numbers; strings stand in).
function status(over = {}) {
  return {
    session_id: 'aaaaaaaa-1111-2222-3333-444444444444', transcript_path: 'C:\\x\\y.jsonl', cwd: 'C:\\Users\\someone\\proj',
    prompt_id: 'bbbbbbbb-1111-2222-3333-444444444444', effort: { level: 'high' }, session_name: 'a name that must never land in the ledger',
    model: { id: 'claude-sonnet-5-5', display_name: 'Sonnet 5.5' }, workspace: { current_dir: 'C:\\x' }, version: '2.1.330',
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
    writer.rowFromWake({ session_id: 'cccccccc-1', hook_event_name: 'SessionStart', source: 'resume', seconds_since_last_response: 700, context_tokens: 267000, prompt_cache_likely_expired: true, estimated_cache_write_usd: 1.3, transcript_path: 'C:\\secret\\path.jsonl', cwd: 'C:\\Users\\someone' }, ENV, Date.now()),
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
