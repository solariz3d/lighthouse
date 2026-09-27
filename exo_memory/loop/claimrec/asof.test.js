'use strict';
// node --test exo_memory/loop/claimrec/asof.test.js — the as-of helpers, on a THROWAWAY git repo and synthetic board and
// ledger files in a temp dir. No real transcript, sample, board or ledger is read.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync } = require('child_process');
const { parseTime, fileAsOf, jsonlAsOf, boardAsOf, ledgerAsOf, resolveDataDir } = require('./asof.js');

// ── the dummy repo: every commit at a fixed time, written with a -06:00 offset (the keeper's zone) ──────────────
//   c0 09:00-06 = 15:00Z  README
//   c1 10:00-06 = 16:00Z  a.txt "v1", d.txt
//   c2 11:00-06 = 17:00Z  a.txt "v2"
//   c3 12:00-06 = 18:00Z  a.txt renamed to b.txt
//   c4 13:00-06 = 19:00Z  d.txt deleted
//   c5 12:30-06 = 18:30Z  e.txt — a commit dated EARLIER than its parent (clock skew), to pin the limit
const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'asof-dummy-'));
const sh = (args, date) => execFileSync('git', ['-C', repo, '-c', 'user.name=dummy', '-c', 'user.email=dummy@example.invalid', ...args],
  { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_DATE: date || '', GIT_COMMITTER_DATE: date || '' }, stdio: ['ignore', 'pipe', 'pipe'] });
const write = (f, s) => fs.writeFileSync(path.join(repo, f), s);
sh(['init', '-q', '-b', 'main']);
write('README', 'dummy\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 'c0'], '2026-01-01T09:00:00-06:00');
write('a.txt', 'v1\n'); write('d.txt', 'dee\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 'c1'], '2026-01-01T10:00:00-06:00');
write('a.txt', 'v2\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 'c2'], '2026-01-01T11:00:00-06:00');
sh(['mv', 'a.txt', 'b.txt']); sh(['commit', '-q', '-m', 'c3'], '2026-01-01T12:00:00-06:00');
sh(['rm', '-q', 'd.txt']); sh(['commit', '-q', '-m', 'c4'], '2026-01-01T13:00:00-06:00');
write('e.txt', 'late\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 'c5'], '2026-01-01T12:30:00-06:00');
const sha = (msg) => sh(['log', '--format=%H', `--grep=^${msg}$`]).trim();

// ── time ─────────────────────────────────────────────────────────────────────────────────────
test('Z, a numeric offset and epoch milliseconds name the same instant', () => {
  const z = parseTime('2026-01-01T16:00:00Z');
  assert.deepStrictEqual([parseTime('2026-01-01T10:00:00-06:00'), parseTime(String(z)), parseTime(z)], [z, z, z]);
});

test('a timestamp with no zone is refused, not guessed', () => {
  assert.throws(() => parseTime('2026-01-01T10:00:00'), /no zone/);
});

test('fractional seconds are kept exactly', () => {
  assert.strictEqual(parseTime('2026-01-01T16:00:00.123Z') - parseTime('2026-01-01T16:00:00Z'), 123);
});

// ── file as of T ─────────────────────────────────────────────────────────────────────────────
test('before the path was first committed it is NOT-YET-EXISTING', () => {
  assert.strictEqual(fileAsOf(repo, 'a.txt', '2026-01-01T15:30:00Z').status, 'NOT-YET-EXISTING');
});

test('before the first commit of all there is NO-COMMIT', () => {
  assert.strictEqual(fileAsOf(repo, 'README', '2026-01-01T14:59:59Z').status, 'NO-COMMIT');
});

test('a commit exactly at T is included (the boundary second is inclusive)', () => {
  const r = fileAsOf(repo, 'a.txt', '2026-01-01T16:00:00Z');
  assert.deepStrictEqual([r.status, r.content, r.commit], ['FOUND', 'v1\n', sha('c1')]);
});

test('one millisecond before the next change still shows the old content, and names the next change', () => {
  const r = fileAsOf(repo, 'a.txt', '2026-01-01T16:59:59.999Z');
  assert.deepStrictEqual([r.content, r.nextChange && r.nextChange.commit], ['v1\n', sha('c2')]);
});

test('an offset-form T reads the same state as its UTC form', () => {
  assert.strictEqual(fileAsOf(repo, 'a.txt', '2026-01-01T11:30:00-06:00').content, 'v2\n');
});

test('a path named after T is followed back to the name it had at T', () => {
  const r = fileAsOf(repo, 'b.txt', '2026-01-01T17:30:00Z');
  assert.deepStrictEqual([r.status, r.content, r.renamedFrom], ['FOUND', 'v2\n', 'a.txt']);
});

test('a path renamed away by T is DELETED under its old name and never returns the new file\'s content', () => {
  const r = fileAsOf(repo, 'a.txt', '2026-01-01T18:10:00Z');
  assert.deepStrictEqual([r.status, r.content, r.renamedTo], ['DELETED', null, 'b.txt']);
});

test('a deleted file is DELETED after its deletion and FOUND before it', () => {
  assert.deepStrictEqual([fileAsOf(repo, 'd.txt', '2026-01-01T19:30:00Z').status, fileAsOf(repo, 'd.txt', '2026-01-01T16:30:00Z').content], ['DELETED', 'dee\n']);
});

test('a path git never held is NOT-TRACKED', () => {
  assert.strictEqual(fileAsOf(repo, 'never.txt', '2026-01-01T19:30:00Z').status, 'NOT-TRACKED');
});

test('LIMIT: a file in the working tree but never committed is invisible (NOT-TRACKED)', () => {
  write('uncommitted.txt', 'here, but not in git\n');
  assert.strictEqual(fileAsOf(repo, 'uncommitted.txt', '2026-01-01T19:30:00Z').status, 'NOT-TRACKED');
});

test('LIMIT: a commit dated earlier than its parent makes the parent\'s later-dated change visible at T', () => {
  // c5 (18:30Z) sits on top of c4 (19:00Z). At 18:45Z the newest first-parent commit dated <= T is c5, whose tree
  // already lacks d.txt although d.txt was deleted "at 19:00Z". The helper reports c5; the skew is the limit.
  const r = fileAsOf(repo, 'd.txt', '2026-01-01T18:45:00Z');
  assert.deepStrictEqual([r.commit, r.status], [sha('c5'), 'DELETED']);
});

// ── board and ledger as of T ────────────────────────────────────────────────────────────────
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'asof-data-'));
fs.writeFileSync(path.join(data, 'board.jsonl'), [
  JSON.stringify({ pane: 'A', text: 'third', ts: 3000 }),
  JSON.stringify({ pane: 'B', text: 'first', ts: 1000 }),                       // out of order: a union of two machines
  JSON.stringify({ pane: 'C', text: 'x', ts: 2000 }) + JSON.stringify({ pane: 'D', text: 'y', ts: 2500 }), // a fused line
  '{"pane":"E","text":"torn',                                                    // unreadable
  JSON.stringify({ pane: 'F', text: 'no time' }),
  '',
].join('\n'));
fs.writeFileSync(path.join(data, 'lap.jsonl'), [JSON.stringify({ lap: 'L1', stage: 'open', at: 1500 }), JSON.stringify({ lap: 'L1', stage: 'filed', at: 4000 })].join('\n') + '\n');

test('board rows are filtered by ts, not line position, and come back in time order', () => {
  assert.deepStrictEqual(boardAsOf(2500, { dataDir: data }).rows.map((r) => r.pane), ['B', 'C', 'D']);
});

test('fused, unreadable and time-less board lines are counted, never guessed', () => {
  const c = boardAsOf(9999, { dataDir: data }).counts;
  assert.deepStrictEqual([c.fusedLinesRecovered, c.unreadableLines, c.rowsWithoutTime, c.rowsAtOrBeforeT], [1, 1, 1, 4]);
});

test('ledger rows are filtered by at', () => {
  assert.deepStrictEqual(ledgerAsOf(2000, { dataDir: data }).rows.map((r) => r.stage), ['open']);
});

test('the data dir comes from CONSONANCE_DATA when no dir is passed', () => {
  const was = process.env.CONSONANCE_DATA;
  process.env.CONSONANCE_DATA = data;
  try { assert.strictEqual(resolveDataDir(), data); } finally { if (was === undefined) delete process.env.CONSONANCE_DATA; else process.env.CONSONANCE_DATA = was; }
});

test('a missing ledger file is an error, not an empty result', () => {
  assert.throws(() => jsonlAsOf(path.join(data, 'nope.jsonl'), 'at', 1), /not found/);
});
