#!/usr/bin/env node
'use strict';
// close-small.test.js (B, L212, exo_memory/loop/packet_l212_close_small_B_2026-11-21.md): the rule that decides which seats a
// "Close for the night" cuts, and the transcript reading it rests on. R2 of the packet, registered red first: a cold seat is
// skipped, a small seat is skipped, a warm large seat is cut. Every row builds its own fixture; no live transcript, data folder or
// pane is read or touched.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const C = require('./close-small.js');
const SCRIPT = path.join(__dirname, 'close-small.js');

const MIN = 60 * 1000;
const NOW = Date.parse('2026-11-21T06:30:00.000Z');
const seat = (minsAgo, context) => ({ name: 'X', last: minsAgo == null ? null : { startedMs: NOW - minsAgo * MIN, context } });

// ---- R2, the rule: the three cases the packet registers, then its two edges.
test('a cold seat is skipped, however large: compacting it would read the whole context uncached', () => {
  const d = C.decide(seat(51, 900000), { nowMs: NOW });
  assert.strictEqual(d.action, 'skip');
  assert.match(d.reason, /cold/);
});
test('a small seat is skipped, however warm', () => {
  const d = C.decide(seat(5, 200000), { nowMs: NOW });
  assert.strictEqual(d.action, 'skip');
  assert.match(d.reason, /small/);
});
test('a warm large seat is cut', () => {
  assert.strictEqual(C.decide(seat(5, 400000), { nowMs: NOW }).action, 'cut');
});
test('the edges: a last call exactly 50 minutes old is cold, and a context of exactly 300k is small (the rule is "under" and "over")', () => {
  assert.strictEqual(C.decide(seat(50, 400000), { nowMs: NOW }).action, 'skip');
  assert.strictEqual(C.decide(seat(49.9, 400000), { nowMs: NOW }).action, 'cut');
  assert.strictEqual(C.decide(seat(5, 300000), { nowMs: NOW }).action, 'skip');
  assert.strictEqual(C.decide(seat(5, 300001), { nowMs: NOW }).action, 'cut');
});
test('both numbers are dials', () => {
  assert.strictEqual(C.decide(seat(70, 400000), { nowMs: NOW, warmMin: 90 }).action, 'cut');
  assert.strictEqual(C.decide(seat(5, 250000), { nowMs: NOW, big: 200000 }).action, 'cut');
});
test('a seat with no transcript, or no call in it, is skipped and says why', () => {
  assert.match(C.decide({ name: 'X', transcript: null, last: null }, { nowMs: NOW }).reason, /no transcript/);
  assert.match(C.decide({ name: 'X', transcript: 'x.jsonl', last: null }, { nowMs: NOW }).reason, /no call/);
});

// ---- The reading: the same rule as main.rs last_request (L067), so the app and this tool agree on a seat.
const row = (o) => JSON.stringify(o);
const req = (id, ts, usage, extra = {}) => row({ type: 'assistant', requestId: id, timestamp: ts, message: { usage }, ...extra });
test('the last call starts at the line before its run, and its context is input + cache read + cache creation', () => {
  const jsonl = [
    row({ type: 'user', timestamp: '2026-11-21T06:00:00.000Z' }),
    req('r1', '2026-11-21T06:00:05.000Z', { input_tokens: 1, cache_read_input_tokens: 10, cache_creation_input_tokens: 100 }),
    row({ type: 'user', timestamp: '2026-11-21T06:10:00.000Z' }),
    req('r2', '2026-11-21T06:10:09.000Z', { input_tokens: 5, cache_read_input_tokens: 400000, cache_creation_input_tokens: 2000 }),
    req('r2', '2026-11-21T06:10:11.000Z', { input_tokens: 5, cache_read_input_tokens: 400000, cache_creation_input_tokens: 2000 }),
  ].join('\n');
  assert.deepStrictEqual(C.lastRequest(jsonl), { startedMs: Date.parse('2026-11-21T06:10:00.000Z'), context: 402005 });
});
test("a subagent's own requests (sidechain) are not the seat's last call", () => {
  const jsonl = [
    row({ type: 'user', timestamp: '2026-11-21T06:00:00.000Z' }),
    req('r1', '2026-11-21T06:00:05.000Z', { input_tokens: 1, cache_read_input_tokens: 500000 }),
    row({ type: 'user', isSidechain: true, timestamp: '2026-11-21T06:20:00.000Z' }),
    req('s1', '2026-11-21T06:20:05.000Z', { input_tokens: 9 }, { isSidechain: true }),
  ].join('\n');
  assert.deepStrictEqual(C.lastRequest(jsonl), { startedMs: Date.parse('2026-11-21T06:00:00.000Z'), context: 500001 });
});
test('a torn last line (a transcript being written) is skipped, never a crash', () => {
  const jsonl = [row({ type: 'user', timestamp: '2026-11-21T06:00:00.000Z' }),
    req('r1', '2026-11-21T06:00:05.000Z', { input_tokens: 7 }), '{"type":"assist'].join('\n');
  assert.strictEqual(C.lastRequest(jsonl).context, 7);
});

// ---- The seats: the kept panes (panes.json) and the three fixed seats, each with its transcript.
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'close-small-'));
  const data = path.join(root, 'data'), projects = path.join(root, 'projects'), instances = path.join(root, 'instances');
  fs.mkdirSync(data); fs.mkdirSync(projects);
  const cwd = (n) => path.join(instances, n);
  fs.writeFileSync(path.join(data, 'panes.json'), JSON.stringify([{ pane: 'aaaa1111-0000-4000-8000-000000000001', cwd: cwd('sibling-a') }]));
  fs.writeFileSync(path.join(data, 'letters.json'), JSON.stringify({ 'aaaa1111-0000-4000-8000-000000000001': 'A', [C.FIXED.main]: 'D' }));
  const put = (dir, sid, mins, ctx) => {
    const p = path.join(projects, C.projectDir(cwd(dir)));
    fs.mkdirSync(p, { recursive: true });
    const t0 = new Date(NOW - mins * MIN).toISOString(), t1 = new Date(NOW - mins * MIN + 5000).toISOString();
    fs.writeFileSync(path.join(p, `${sid}.jsonl`), [row({ type: 'user', timestamp: t0 }), req('r', t1, { cache_read_input_tokens: ctx })].join('\n'));
  };
  put('sibling-a', 'aaaa1111-0000-4000-8000-000000000001', 5, 450000);   // warm, large: cut
  put('main', C.FIXED.main, 120, 800000);                                // cold: skipped
  put('librarian', C.FIXED.librarian, 3, 120000);                         // small: skipped
  // the Third Place has no transcript at all
  return { root, data, projects, instances };
}
test('every seat is listed, the kept panes and the three fixed seats, each with its decision and the reason for a skip', () => {
  const f = fixture();
  try {
    const plan = C.plan({ data: f.data, projects: f.projects, instances: f.instances, nowMs: NOW });
    const by = Object.fromEntries(plan.map((s) => [s.name, s]));
    assert.deepStrictEqual(plan.map((s) => s.name).sort(), ['A', 'librarian', 'main', 'third-place']);
    assert.strictEqual(by.A.action, 'cut');
    assert.match(by.main.reason, /cold/);
    assert.match(by.librarian.reason, /small/);
    assert.match(by['third-place'].reason, /no transcript/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});
test('the command line is a dry run only: it prints the list and touches nothing', () => {
  const f = fixture();
  try {
    const before = fs.readdirSync(f.data).sort();
    const r = spawnSync(process.execPath, [SCRIPT, '--dry-run', '--json', '--data', f.data, '--projects', f.projects, '--instances', f.instances,
      '--now', new Date(NOW).toISOString()], { encoding: 'utf8' });
    assert.strictEqual(r.status, 0, r.stderr);
    const out = JSON.parse(r.stdout);
    assert.deepStrictEqual(out.seats.filter((s) => s.action === 'cut').map((s) => s.name), ['A']);
    assert.deepStrictEqual(fs.readdirSync(f.data).sort(), before);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});
