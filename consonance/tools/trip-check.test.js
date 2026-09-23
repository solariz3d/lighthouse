#!/usr/bin/env node
'use strict';
/* trip-check.test.js — the trip checker's own tests. Written before the tool (D112).
 *
 * The bar these pin: a row is built from the TOOLS' OWN OUTPUTS, and the checker can say NOT CLEAN. A checker that
 * cannot fail is decoration, so the mutants file makes an always-clean checker go red, and these tests are what it
 * goes red against. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const T = require('./trip-check.js');

const dirs = [];
function tmp() { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'trip-check-')); dirs.push(d); return d; }
process.on('exit', () => { for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {} } });

const row = (o) => JSON.stringify(o);
function world({ completion, files = {}, backups = {}, commits = [], resolves = () => true } = {}) {
  const dataDir = tmp();
  if (completion) fs.writeFileSync(path.join(dataDir, 'sync-completion.json'), JSON.stringify(completion, null, 2));
  for (const [rel, lines] of Object.entries(files)) {
    const p = path.join(dataDir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, lines.join('\n') + (lines.length ? '\n' : ''));
  }
  for (const [rel, lines] of Object.entries(backups)) {
    const p = path.join(dataDir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, lines.join('\n') + (lines.length ? '\n' : ''));
  }
  // A state dir that does not exist and is never read (scan() uses `git` when given one). Built from this test's own
  // temp dir, not a drive literal: 'C:/nowhere' tripped portable-paths and held the JS suite red (L089).
  return { dataDir, stateDir: path.join(tmp(), 'no-such-state-dir'), git: { log: () => commits, resolves } };
}

// ── the install trip ────────────────────────────────────────────────────────────────────────────

test('an install that wrote nothing and refused files is reported with the TOOL\'S OWN refusal counts, not a retelling', () => {
  const w = world({ completion: {
    at: '2026-09-22T15:11:08.900Z', machine: 'D', installed: false, installed_files: 0, head: '9486b30', verified: true,
    refused: [{ path: 'lap.jsonl', kind: 'DIVERGED', local_only: 329, incoming_only: 375 }],
  } });
  const r = T.scan(w).find((x) => x.kind === 'install');
  assert.strictEqual(r.installed, false);
  assert.strictEqual(r.installed_files, 0);
  assert.strictEqual(r.head, '9486b30');
  assert.deepStrictEqual(r.refused, [{ path: 'lap.jsonl', kind: 'DIVERGED', local_only: 329, incoming_only: 375 }]);
  assert.strictEqual(r.source, 'sync-completion.json', 'the row must name the tool output it came from');
});

test('NOT CLEAN: an install that says it installed files AND refused some contradicts itself', () => {
  const w = world({ completion: { at: '2026-09-22T15:11:08.900Z', machine: 'D', installed: true, installed_files: 3, head: 'abc1234',
    refused: [{ path: 'lap.jsonl', kind: 'DIVERGED', local_only: 1, incoming_only: 1 }] } });
  const r = T.scan(w).find((x) => x.kind === 'install');
  assert.strictEqual(r.clean, false);
  assert.match(r.not_clean.join(' '), /installed .*refused|refused .*installed/i);
});

test('NOT CLEAN: a refused file that no union ever repaired is an open loss', () => {
  const w = world({
    completion: { at: '2026-09-22T15:11:08.900Z', machine: 'D', installed: false, installed_files: 0, head: 'h',
      refused: [{ path: 'lap.jsonl', kind: 'DIVERGED', local_only: 3, incoming_only: 4 },
        { path: 'board.jsonl', kind: 'DIVERGED', local_only: 1, incoming_only: 2 }] },
    files: { 'lap.jsonl': [row({ a: 1 }), row({ a: 2 })], 'board.jsonl': [row({ b: 1 })] },
    // only lap was unioned, and AFTER the refusal
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'install');
  assert.deepStrictEqual(r.refusals_unresolved, ['board.jsonl']);
  assert.strictEqual(r.clean, false);
  assert.match(r.not_clean.join(' '), /board\.jsonl/);
});

test('a refused file unioned after the refusal is resolved, and the install trip is clean', () => {
  const w = world({
    completion: { at: '2026-09-22T15:11:08.900Z', machine: 'D', installed: false, installed_files: 0, head: 'h',
      refused: [{ path: 'lap.jsonl', kind: 'DIVERGED', local_only: 3, incoming_only: 4 }] },
    files: { 'lap.jsonl': [row({ a: 1 }), row({ a: 2 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'install');
  assert.deepStrictEqual(r.refusals_unresolved, []);
  assert.strictEqual(r.clean, true, r.not_clean.join(' '));
});

test('a union BEFORE the refusal does not resolve it — the order is what makes it a repair', () => {
  const w = world({
    completion: { at: '2026-09-22T15:11:08.900Z', machine: 'D', installed: false, installed_files: 0, head: 'h',
      refused: [{ path: 'lap.jsonl', kind: 'DIVERGED', local_only: 3, incoming_only: 4 }] },
    files: { 'lap.jsonl': [row({ a: 1 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-01T10-00-00-000Z': [row({ a: 1 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'install');
  assert.deepStrictEqual(r.refusals_unresolved, ['lap.jsonl']);
  assert.strictEqual(r.clean, false);
});

// ── the union trip ──────────────────────────────────────────────────────────────────────────────

test('a union trip carries rows before and after, and the backup it can be re-derived from', () => {
  const w = world({
    files: { 'lap.jsonl': [row({ a: 1 }), row({ a: 2 }), row({ a: 3 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'union');
  assert.strictEqual(r.file, 'lap.jsonl');
  assert.strictEqual(r.rows_before, 1);
  assert.strictEqual(r.rows_after, 3);
  assert.strictEqual(r.rows_added_since_backup, 2);
  assert.strictEqual(r.at, '2026-09-22T15:39:49.131Z', 'the stamp in the backup name IS the trip time');
  assert.strictEqual(r.clean, true, r.not_clean.join(' '));
});

test('NOT CLEAN: a union that LOST a row the backup held', () => {
  const w = world({
    files: { 'lap.jsonl': [row({ a: 2 }), row({ a: 3 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 }), row({ a: 2 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'union');
  assert.strictEqual(r.rows_lost, 1);
  assert.strictEqual(r.clean, false);
  assert.match(r.not_clean.join(' '), /lost/i);
});

test('NOT CLEAN: a union that ends with fewer rows than it began with', () => {
  const w = world({
    files: { 'lap.jsonl': [row({ a: 1 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 }), row({ a: 2 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'union');
  assert.ok(r.rows_after < r.rows_before);
  assert.strictEqual(r.clean, false);
});

test('NOT CLEAN: the file was REPLACED — the row set is intact but lines were dropped', () => {
  // The live file is carried verbatim, repeats included, so a union never removes a line. Distinct rows alone cannot
  // see this: the SET is unchanged. Found by a surviving mutant (D112).
  const w = world({
    files: { 'lap.jsonl': [row({ a: 1 }), row({ a: 2 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 }), row({ a: 1 }), row({ a: 2 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'union');
  assert.strictEqual(r.rows_lost, 0, 'no row of the set is missing');
  assert.strictEqual(r.rows_after, r.rows_before);
  assert.ok(r.lines_after < r.lines_before, 'but lines were dropped');
  assert.strictEqual(r.clean, false);
  assert.match(r.not_clean.join(' '), /REPLACED/);
});

test('a row is the same row only if EVERY field matches, key order aside (ledger-union\'s own rule)', () => {
  const w = world({
    files: { 'lap.jsonl': ['{"b":2,"a":1}'] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': ['{"a":1,"b":2}'] },
  });
  const r = T.scan(w).find((x) => x.kind === 'union');
  assert.strictEqual(r.rows_lost, 0, 'key order is not a difference');
  assert.strictEqual(r.rows_added_since_backup, 0);
});

test('the union row says its counts were DERIVED, because ledger-union leaves no receipt', () => {
  const w = world({
    files: { 'lap.jsonl': [row({ a: 1 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 })] },
  });
  const r = T.scan(w).find((x) => x.kind === 'union');
  assert.strictEqual(r.counts_from_tool, false);
  assert.match(r.source, /pre-union/);
});

// ── the close trip ──────────────────────────────────────────────────────────────────────────────

test('a close trip is read from the state repo\'s own commits', () => {
  const w = world({ commits: [{ sha: '9486b30', machine: 'L', at: '2026-09-22T13:44:45.975Z', subject: 'state: L 2026-09-22T13:44:45.975Z' }] });
  const r = T.scan(w).find((x) => x.kind === 'close');
  assert.strictEqual(r.head, '9486b30');
  assert.strictEqual(r.machine, 'L');
  assert.strictEqual(r.clean, true, r.not_clean.join(' '));
});

test('NOT CLEAN: a published head that does not resolve in the state repo', () => {
  const w = world({ commits: [{ sha: 'deadbee', machine: 'L', at: '2026-09-22T13:44:45.975Z', subject: 'state: L …' }], resolves: () => false });
  const r = T.scan(w).find((x) => x.kind === 'close');
  assert.strictEqual(r.clean, false);
  assert.match(r.not_clean.join(' '), /resolve/i);
});

// ── the week, and the shape of the output ───────────────────────────────────────────────────────

test('A CLEAN WEEK IS A COUNT: seven days of clean trips, and one not-clean trip restarts it at zero', () => {
  const mk = (day, clean) => ({ kind: 'union', at: `2026-09-${day}T12:00:00.000Z`, clean, not_clean: clean ? [] : ['x'] });
  const now = new Date('2026-09-17T13:00:00Z');                 // the window is 09-10T13:00 .. 09-17T13:00
  const rows = [];
  for (let d = 11; d <= 17; d++) rows.push(mk(String(d), true));  // seven days, all inside the window
  assert.strictEqual(T.cleanWeek(rows, now).clean_days, 7);
  assert.strictEqual(T.cleanWeek(rows, now).clean, true);
  // the SAME seven clean days, plus one not-clean trip: the week must fail even though 7 clean days are still there
  const broken = rows.concat([mk('16', false)]);
  const cw = T.cleanWeek(broken, now);
  assert.strictEqual(cw.clean_days, 7, 'the clean days are unchanged — only the bad trip differs');
  assert.strictEqual(cw.clean, false, 'one not-clean trip fails the week');
  assert.strictEqual(cw.not_clean_trips, 1);
  assert.strictEqual(cw.days_since_not_clean, 1, 'and the count restarts from that trip');
});

test('every row carries the six fields the solid registration named', () => {
  const w = world({
    completion: { at: '2026-09-22T15:11:08.900Z', machine: 'D', installed: false, installed_files: 0, head: 'h', refused: [] },
    files: { 'lap.jsonl': [row({ a: 1 })] },
    backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 })] },
    commits: [{ sha: '9486b30', machine: 'L', at: '2026-09-22T13:44:45.975Z', subject: 's' }],
  });
  for (const r of T.scan(w)) {
    for (const k of ['kind', 'at', 'machine', 'clean', 'not_clean', 'source']) assert.ok(k in r, `${r.kind} row lacks ${k}`);
    assert.ok(Array.isArray(r.not_clean));
  }
});

test('an --out inside the data dir is REFUSED: no manifest rule covers a trip ledger (D112)', () => {
  const d = tmp();
  assert.strictEqual(T.outIsInsideData(d, path.join(d, 'trip.jsonl')), true, 'inside must be refused');
  assert.strictEqual(T.outIsInsideData(d, path.join(d, 'resonance', 'trip.jsonl')), true, 'a subdirectory is still inside');
  assert.strictEqual(T.outIsInsideData(d, path.join(tmp(), 'trip.jsonl')), false, 'outside is allowed');
});

test('the tool NEVER writes into the data dir (no manifest rule covers it — D112)', () => {
  const w = world({ files: { 'lap.jsonl': [row({ a: 1 })] }, backups: { 'lap.jsonl.pre-union-2026-09-22T15-39-49-131Z': [row({ a: 1 })] } });
  const before = fs.readdirSync(w.dataDir).sort();
  T.scan(w);
  assert.deepStrictEqual(fs.readdirSync(w.dataDir).sort(), before, 'scan() must be read-only over the data dir');
});

// ── L091: every launch is a row, and "a clean week" is the keeper's reading ───────────────────────────────────────
// The keeper, 2026-09-23 02:5x (loop/solid_decision_sheet_2026-09-23.md, THE KEEPER'S ANSWER): a clean week is
// "seven days with no bad trip (days without a trip don't count against it)".
const trip = (at, o = {}) => ({ at, machine: 'L', stage: 'done', verified: true, installed: true, installed_files: 1, head: 'h', refused: [], ...o });

test('L091 a completion carrying trips[] gives one install row per launch, oldest first', () => {
  const w = world({ completion: { ...trip('2026-09-22T12:00:00.000Z'), trips: [trip('2026-09-21T09:00:00.000Z', { head: 'a' }), trip('2026-09-22T12:00:00.000Z', { head: 'b' })] } });
  const rows = T.scan(w).filter((x) => x.kind === 'install');
  assert.deepStrictEqual(rows.map((r) => r.head), ['a', 'b']);
  assert.ok(rows.every((r) => r.source === 'sync-completion.json' && r.counts_from_tool === true));
});

test('L091 a refusing launch in the middle of the week is still its own bad trip', () => {
  const bad = trip('2026-09-21T09:00:00.000Z', { installed: false, installed_files: 0, stage: 'install', refused: [{ path: 'lap.jsonl', kind: 'DIVERGED', local_only: 3, incoming_only: 4 }] });
  const w = world({ completion: { ...trip('2026-09-22T12:00:00.000Z'), trips: [bad, trip('2026-09-22T12:00:00.000Z')] } });
  const rows = T.scan(w).filter((x) => x.kind === 'install');
  assert.strictEqual(rows[0].clean, false, 'the earlier refusal is not overwritten by the later clean launch');
  assert.strictEqual(rows[1].clean, true);
});

test('L091 THE KEEPER\'S READING: one clean trip and six days without one is a clean week', () => {
  const now = new Date('2026-09-17T13:00:00Z');
  const cw = T.cleanWeek([{ kind: 'union', at: '2026-09-17T12:00:00.000Z', clean: true, not_clean: [] }], now);
  assert.strictEqual(cw.clean, true, 'days without a trip do not count against the week');
  assert.strictEqual(cw.clean_days, 1);
});

test('L091 a bad trip older than seven days no longer counts against the week', () => {
  const now = new Date('2026-09-17T13:00:00Z');
  const rows = [
    { kind: 'union', at: '2026-09-09T12:00:00.000Z', clean: false, not_clean: ['x'] },
    { kind: 'union', at: '2026-09-15T12:00:00.000Z', clean: true, not_clean: [] },
  ];
  assert.strictEqual(T.cleanWeek(rows, now).clean, true);
});

test('L091 THE EDGE: zero trips in the window is UNMEASURED (null) with a reason — neither clean nor failed', () => {
  const now = new Date('2026-09-17T13:00:00Z');
  for (const rows of [[], [{ kind: 'union', at: '2026-09-01T12:00:00.000Z', clean: true, not_clean: [] }]]) {
    const cw = T.cleanWeek(rows, now);
    assert.strictEqual(cw.clean, null, JSON.stringify(cw));
    assert.strictEqual(cw.trips, 0);
    assert.match(String(cw.reason), /no trip/i);
  }
});

test('L091 the week says how far back LAUNCHES are on record (install rows), because older launches were overwritten', () => {
  const now = new Date('2026-09-17T13:00:00Z');
  const rows = [
    { kind: 'close', at: '2026-09-01T12:00:00.000Z', clean: true, not_clean: [] },
    { kind: 'install', at: '2026-09-15T12:00:00.000Z', clean: true, not_clean: [] },
    { kind: 'install', at: '2026-09-16T12:00:00.000Z', clean: true, not_clean: [] },
  ];
  assert.strictEqual(T.cleanWeek(rows, now).launches_on_record_since, '2026-09-15T12:00:00.000Z');
  assert.strictEqual(T.cleanWeek(rows.slice(0, 1), now).launches_on_record_since, null, 'no launch on record says so');
});
