// usage.test.js — usage.js on FIXTURE transcripts. Every fixture is built in a temp dir; nothing reads the real
// ~/.claude/projects. The zone is America/Regina (UTC-6, no daylight time), so every boundary below is exact.
//
//   node consonance/tools/usage.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const U = require('./usage.js');

const TOOL = path.join(__dirname, 'usage.js');
const TZ = 'America/Regina';
const PANE_E = 'eeeeeeee-1111-4000-8000-00000000000e';
const PANE_OLD = 'ffffffff-1111-4000-8000-00000000000f';

/** A home with ~/.consonance.json, a data dir (panes.json, letters.json) and an empty projects dir. */
function bed(cfgExtra = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'usage-'));
  const home = path.join(root, 'home');
  const data = path.join(root, 'data');
  const instances = path.join(root, 'instances');
  const projects = path.join(home, '.claude', 'projects');
  for (const d of [home, data, instances, projects]) fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ data_dir: data, instances_dir: instances, ambient_tz: TZ, ...cfgExtra }));
  fs.writeFileSync(path.join(data, 'panes.json'), JSON.stringify([{ pane: PANE_E, cwd: path.join(instances, 'sibling-abc12345'), label: 'brief' }]));
  fs.writeFileSync(path.join(data, 'letters.json'), JSON.stringify({ [PANE_E]: 'E', [PANE_OLD]: 'K' }));
  const dirOf = (seat) => path.join(projects, U.encodeCwd(path.join(instances, seat)));
  return { root, home, data, instances, projects, dirOf };
}

/** An assistant row, in the shape Claude Code writes. */
const asst = (id, ts, u, extra = {}) => ({
  type: 'assistant', requestId: `req_${id}`, timestamp: ts, isSidechain: false,
  message: { id, model: 'claude-opus-5', role: 'assistant', usage: { input_tokens: u[0], output_tokens: u[1], cache_creation_input_tokens: u[2], cache_read_input_tokens: u[3] } },
  ...extra,
});
const user = (content, ts) => ({ type: 'user', timestamp: ts, isSidechain: false, message: { role: 'user', content } });

function write(dir, name, rows) {
  fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
  fs.writeFileSync(path.join(dir, name), rows.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n') + '\n');
}

function run(b, args) {
  const r = spawnSync(process.execPath, [TOOL, '--tz', TZ, ...args], {
    encoding: 'utf8', env: { ...process.env, USERPROFILE: b.home, HOME: b.home, CONSONANCE_DATA: '', CONSONANCE_INSTANCES: '' },
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}
const json = (b, args) => { const r = run(b, [...args, '--json']); assert.strictEqual(r.code, 0, r.err); return JSON.parse(r.out); };

const NOW = '2026-09-23T10:00:00.000Z'; // Wed 04:00 in Regina

// ── one seat, one day ────────────────────────────────────────────────────────────────────────────────────────
test('ONE SEAT ONE DAY: two responses are one seat-day with the four fields summed', () => {
  const b = bed();
  write(b.dirOf('main'), 's1.jsonl', [
    user('do a thing', '2026-09-23T08:00:00.000Z'),
    asst('m1', '2026-09-23T08:00:05.000Z', [10, 20, 30, 40]),
    asst('m2', '2026-09-23T08:01:05.000Z', [1, 2, 3, 4]),
  ]);
  const r = json(b, ['--now', NOW]);
  assert.deepStrictEqual(r.days.map((d) => [d.seat, d.day, d.responses, d.input, d.output, d.cacheWrite, d.cacheRead, d.all]),
    [['MAIN', '2026-09-23', 2, 11, 22, 33, 44, 110]]);
});

test('TWO DAYS: responses either side of LOCAL midnight land on two days', () => {
  const b = bed();
  write(b.dirOf('main'), 's1.jsonl', [
    asst('m1', '2026-09-23T05:59:59.000Z', [1, 0, 0, 0]), // 23:59:59 on the 22nd in Regina
    asst('m2', '2026-09-23T06:00:00.000Z', [2, 0, 0, 0]), // 00:00:00 on the 23rd
  ]);
  const r = json(b, ['--now', NOW]);
  assert.deepStrictEqual(r.days.map((d) => [d.day, d.input]), [['2026-09-22', 1], ['2026-09-23', 2]]);
});

// ── dedup ────────────────────────────────────────────────────────────────────────────────────────────────────
test('DEDUP: one response written as three rows is counted ONCE, each field at its maximum (mid-stream row first)', () => {
  const b = bed();
  write(b.dirOf('main'), 's1.jsonl', [
    asst('m1', '2026-09-23T08:00:05.000Z', [2, 5, 100, 1000]),
    asst('m1', '2026-09-23T08:00:06.000Z', [2, 231, 100, 1000]),
    asst('m1', '2026-09-23T08:00:06.000Z', [2, 231, 100, 1000]),
  ]);
  const t = json(b, ['--now', NOW]).total;
  assert.deepStrictEqual([t.responses, t.output, t.all], [1, 231, 1333]);
});

test('DEDUP ACROSS FILES: a response copied into a resumed session and an .orphaned file is counted once', () => {
  const b = bed();
  const row = asst('m1', '2026-09-23T08:00:05.000Z', [1, 1, 1, 1]);
  write(b.dirOf('main'), 's1.jsonl', [row]);
  write(b.dirOf('main'), 's2.jsonl', [row, asst('m2', '2026-09-23T09:00:05.000Z', [1, 1, 1, 1])]);
  write(b.dirOf('main'), 's0.jsonl.orphaned', [row]);
  assert.strictEqual(json(b, ['--now', NOW]).total.responses, 2);
});

test('DEDUP KEY is the message id: a row with no requestId is still counted, and still once', () => {
  const b = bed();
  const noReq = asst('m1', '2026-09-23T08:00:05.000Z', [1, 1, 1, 1]);
  delete noReq.requestId;
  write(b.dirOf('main'), 's1.jsonl', [noReq, noReq]);
  assert.strictEqual(json(b, ['--now', NOW]).total.responses, 1);
});

test('an .orphaned file holding a response found nowhere else IS counted', () => {
  const b = bed();
  write(b.dirOf('main'), 's0.jsonl.orphaned', [asst('only', '2026-09-23T08:00:05.000Z', [5, 0, 0, 0])]);
  assert.strictEqual(json(b, ['--now', NOW]).total.input, 5);
});

test('a SUBAGENT transcript is counted, under the seat whose session spawned it', () => {
  const b = bed();
  write(b.dirOf('main'), path.join('s1', 'subagents', 'agent-x.jsonl'), [asst('sub1', '2026-09-23T08:00:05.000Z', [7, 0, 0, 0], { isSidechain: true })]);
  assert.deepStrictEqual(json(b, ['--now', NOW]).seats.map((s) => [s.seat, s.input]), [['MAIN', 7]]);
});

test('<synthetic> rows are not API calls and are skipped; cost-state totals are never added', () => {
  const b = bed();
  const synth = asst('syn', '2026-09-23T08:00:05.000Z', [0, 0, 0, 0]);
  synth.message.model = '<synthetic>';
  write(b.dirOf('main'), 's1.jsonl', [
    synth,
    { type: 'cost-state', sessionId: 's1', timestamp: '2026-09-23T08:00:06.000Z', modelUsage: { 'claude-opus-5': { inputTokens: 999999, outputTokens: 999999 } } },
    asst('m1', '2026-09-23T08:00:05.000Z', [1, 1, 1, 1]),
  ]);
  const r = json(b, ['--now', NOW]);
  assert.deepStrictEqual([r.total.responses, r.total.all, r.synthetic, r.costState], [1, 4, 1, 1]);
});

// ── seats ────────────────────────────────────────────────────────────────────────────────────────────────────
test('SEATS: fixed seats by name, a sibling by its letter, a retired sibling by its session file, other work as itself', () => {
  const b = bed();
  const at = '2026-09-23T08:00:05.000Z';
  write(b.dirOf('librarian'), 'a.jsonl', [asst('l1', at, [1, 0, 0, 0])]);
  write(b.dirOf('third-place'), 'a.jsonl', [asst('t1', at, [1, 0, 0, 0])]);
  // Named by the ROSTER alone: the session file is not the pane id (a /clear starts a new session id).
  write(b.dirOf('sibling-abc12345'), 'a-later-session.jsonl', [asst('e1', at, [1, 0, 0, 0])]);
  write(b.dirOf('sibling-99999999'), `${PANE_OLD}.jsonl`, [asst('k1', at, [1, 0, 0, 0])]);
  write(path.join(b.projects, 'C--Users-someone-Desktop-brain-rot'), 'x.jsonl', [asst('o1', at, [1, 0, 0, 0])]);
  const seats = json(b, ['--now', NOW]).seats.map((s) => s.seat).sort();
  assert.deepStrictEqual(seats, ['C--Users-someone-Desktop-brain-rot', 'LIBRARIAN', 'THIRD-PLACE', 'pane E', 'pane K']);
});

// ── keep-warm ────────────────────────────────────────────────────────────────────────────────────────────────
test('KEEP-WARM: the reply to the ping is keep-warm; a tool_result does not end it; the next real prompt does', () => {
  const b = bed();
  write(b.dirOf('main'), 's1.jsonl', [
    user('[keep-warm, from the chair — not the keeper] Reply with exactly: ok', '2026-09-23T08:00:00.000Z'),
    asst('k1', '2026-09-23T08:00:01.000Z', [1, 1, 0, 100]),
    // A tool_result row can carry a text block beside it; it is still the model's own loop, not a new prompt.
    user([{ type: 'tool_result', tool_use_id: 'x', content: 'r' }, { type: 'text', text: 'hook context' }], '2026-09-23T08:00:02.000Z'),
    asst('k2', '2026-09-23T08:00:03.000Z', [1, 1, 0, 100]),
    user('a real prompt', '2026-09-23T08:05:00.000Z'),
    asst('w1', '2026-09-23T08:05:01.000Z', [1, 1, 0, 100]),
  ]);
  const t = json(b, ['--now', NOW]).total;
  assert.deepStrictEqual([t.keepWarmResponses, t.keepWarmAll, t.all], [2, 204, 306]);
});

// ── the week ─────────────────────────────────────────────────────────────────────────────────────────────────
test('WEEK WINDOW ends at the NEXT reset: Wed 04:00 Regina, reset fri@04:00 → Fri 18 10:00Z to Fri 25 10:00Z', () => {
  const w = U.weekWindow(Date.parse(NOW), U.parseReset('fri@04:00'), TZ);
  assert.deepStrictEqual([new Date(w.start).toISOString(), new Date(w.end).toISOString()],
    ['2026-09-18T10:00:00.000Z', '2026-09-25T10:00:00.000Z']);
});

test('WEEK WINDOW at the exact reset instant starts the NEW week', () => {
  const w = U.weekWindow(Date.parse('2026-09-25T10:00:00.000Z'), U.parseReset('fri@04:00'), TZ);
  assert.strictEqual(new Date(w.start).toISOString(), '2026-09-25T10:00:00.000Z');
});

test('WEEK BOUNDARY: one millisecond before the week is out, the first millisecond of it is in', () => {
  const b = bed();
  write(b.dirOf('main'), 's1.jsonl', [
    asst('before', '2026-09-18T09:59:59.999Z', [1000, 0, 0, 0]),
    asst('first', '2026-09-18T10:00:00.000Z', [1, 0, 0, 0]),
  ]);
  // Both files are written now, so the mtime skip cannot hide the early row; the window must.
  const r = json(b, ['--now', NOW, '--week', '--reset', 'fri@04:00']);
  assert.strictEqual(r.total.input, 1);
});

test('--week without a reset is refused, loudly', () => {
  const r = run(bed(), ['--now', NOW, '--week']);
  assert.deepStrictEqual([r.code, /needs the keeper's reset/.test(r.err)], [2, true]);
});

test('a malformed --reset is refused', () => {
  assert.strictEqual(run(bed(), ['--now', NOW, '--week', '--reset', 'friday 4am']).code, 2);
});

test('the reset can come from ~/.consonance.json usage.reset', () => {
  const b = bed({ usage: { reset: 'fri@04:00' } });
  write(b.dirOf('main'), 's1.jsonl', [asst('m1', '2026-09-23T08:00:05.000Z', [1, 0, 0, 0])]);
  assert.strictEqual(json(b, ['--now', NOW, '--week']).reset, 'fri@04:00');
});

// ── the limit ────────────────────────────────────────────────────────────────────────────────────────────────
function limitBed(cfg) {
  const b = bed(cfg);
  write(b.dirOf('main'), 's1.jsonl', [asst('m1', '2026-09-23T08:00:05.000Z', [100, 200, 300, 400])]);
  return b;
}

test('LIMIT NOT SET: the report says "limit: not set" and prints no percentage of a limit', () => {
  const out = run(limitBed(), ['--now', NOW, '--week', '--reset', 'fri@04:00']).out;
  assert.match(out, /^limit: not set$/m);
  assert.doesNotMatch(out, /of the limit/);
});

test('LIMIT SET with what it counts: the percentage is of that measure', () => {
  const r = json(limitBed(), ['--now', NOW, '--week', '--reset', 'fri@04:00', '--limit', '1000', '--limit-counts', 'no-cache-read']);
  assert.deepStrictEqual([r.limit.used, r.limit.percent], [600, 60]);
});

test('LIMIT SET but not what it counts: no percentage, and the report says what is missing', () => {
  const b = limitBed();
  const r = json(b, ['--now', NOW, '--week', '--reset', 'fri@04:00', '--limit', '1000']);
  assert.deepStrictEqual([r.limit.set, r.limit.percent, /WHAT IT COUNTS is not set/.test(r.limit.why)], [false, undefined, true]);
});

test('LIMIT from ~/.consonance.json, and the flag wins over it', () => {
  const b = limitBed({ usage: { weekly_limit: 2000, limit_counts: 'all' } });
  const fromCfg = json(b, ['--now', NOW, '--week', '--reset', 'fri@04:00']);
  const fromFlag = json(b, ['--now', NOW, '--week', '--reset', 'fri@04:00', '--limit', '1000']);
  assert.deepStrictEqual([fromCfg.limit.percent, fromFlag.limit.percent], [50, 100]);
});

test('LIMIT without --week is not compared (it is a weekly limit)', () => {
  const r = json(limitBed(), ['--now', NOW, '--limit', '1000', '--limit-counts', 'all']);
  assert.strictEqual(r.limit.percent, undefined);
});

test('a limit that is not a positive whole number is refused', () => {
  for (const bad of ['0', '-5', '1.5', 'lots']) assert.strictEqual(run(limitBed(), ['--now', NOW, '--limit', bad]).code, 2, bad);
});

test('an unknown --limit-counts is refused', () => {
  assert.strictEqual(run(limitBed(), ['--now', NOW, '--limit', '10', '--limit-counts', 'most']).code, 2);
});

// ── the blind spot ───────────────────────────────────────────────────────────────────────────────────────────
test('THE BLIND SPOT is printed in every report, with the no-persistence sites and Jev named', () => {
  const out = run(bed(), ['--now', NOW]).out;
  for (const must of [/NOT the account's total usage/, /--no-session-persistence/, /claude_oneshot/, /curate\.js/, /second-vantage\.js/, /d121_relay\/harness\.js/, /Jev/]) {
    assert.match(out, must);
  }
});

test('an empty projects dir still reports, and says there is nothing in the window', () => {
  assert.match(run(bed(), ['--now', NOW]).out, /no responses in this window/);
});

test('a seat name longer than the column does not run into the day column', () => {
  const b = bed();
  write(path.join(b.projects, 'C--a-very-long-project-directory-name-from-other-work'), 'x.jsonl', [asst('o1', '2026-09-23T08:00:05.000Z', [1, 0, 0, 0])]);
  assert.match(run(b, ['--now', NOW]).out, /other-work\s+2026-09-23/);
});

test('THE BLIND SPOT says what the machine boundary really is: carried conversations are in, uncarried work is not', () => {
  const out = run(bed(), ['--now', NOW]).out;
  assert.match(out, /tail-carry\.js/);
  assert.doesNotMatch(out, /THIS machine only/);
});
