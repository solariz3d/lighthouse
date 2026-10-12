'use strict';
// node --test exo_memory/loop/fixarms/arms.test.js — the three fix arms (D311 part 3, pane E) on a THROWAWAY git repo, a
// synthetic board and ledger, and a synthetic transcript, all in a scratch folder. No real transcript, board or ledger is read.
//
// The fixture's clock (UTC):
//   commits   c0 15:00 README · c1 16:00 a.txt + notes.md · c2 17:00 a.txt v2 + exo_memory/third_place/x.md · c3 18:00 late.md
//   messages  15:30 [pane:B] "42 of 50" · 16:10 [chair:MAIN] names notes.md, a token and a third-place line · 16:50 the
//             unit's own seat [pane:E] · 17:05 THE ERRING TURN's prompt [chair:MAIN] "how many rows does a.txt hold" ·
//             17:05:20 the reply · 18:00 [pane:C] "99 of 100", AFTER the turn
//   T = 17:05:00Z. Everything an arm returns must be as of T: c3, the 18:00 message and rows after T must not appear.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const scratch = require('../../../consonance/tools/scratch.js');
const arms = require('./arms.js');

const root = scratch.mkdtemp('fixarms-test-');
const repo = path.join(root, 'repo'); fs.mkdirSync(repo);
const sh = (args, date) => execFileSync('git', ['-C', repo, '-c', 'user.name=dummy', '-c', 'user.email=dummy@example.invalid', ...args],
  { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_DATE: date || '', GIT_COMMITTER_DATE: date || '' }, stdio: ['ignore', 'pipe', 'pipe'] });
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(repo, f)), { recursive: true }); fs.writeFileSync(path.join(repo, f), s); };
sh(['init', '-q', '-b', 'main']);
write('README', 'dummy\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 'c0 readme'], '2026-01-01T15:00:00Z');
write('a.txt', 'row one\n'); write('notes.md', 'the zebracount is nine\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 'c1 notes'], '2026-01-01T16:00:00Z');
write('a.txt', 'how many rows: a.txt holds two rows\nrow two\n'); write('exo_memory/third_place/x.md', 'rows hold zebracount\n');
sh(['add', '-A']); sh(['commit', '-q', '-m', 'c2 a two rows'], '2026-01-01T17:00:00Z');
// a side line: s1 is committed at 17:02, after c2 and before T, but merged into main only at 18:30, after T (the 09-09 shape: work on
// another machine's line, merged later, so main's first-parent line does not show it at T)
sh(['checkout', '-q', '-b', 'side', 'HEAD~1']); write('side.md', 'side work\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 's1 side work'], '2026-01-01T17:02:00Z');
sh(['checkout', '-q', 'main']);
write('late.md', 'how many rows does a.txt hold: zebracount rows rows rows\n'); sh(['add', '-A']); sh(['commit', '-q', '-m', 'c3 late'], '2026-01-01T18:00:00Z');
sh(['merge', '-q', '--no-ff', '-m', 'm1 merge side', 'side'], '2026-01-01T18:30:00Z');

const data = path.join(root, 'data'); fs.mkdirSync(data);
const ms = (s) => Date.parse(s);
fs.writeFileSync(path.join(data, 'board.jsonl'), [
  { pane: 'aaaaaaaa-1', role: 'assistant', text: 'board row before T', ts: ms('2026-01-01T16:40:00Z') },
  { pane: 'aaaaaaaa-1', role: 'assistant', text: 'board row before T', ts: ms('2026-01-01T16:40:00Z') },   // the union's duplicate
  { pane: 'cccccccc-3', role: 'user', text: 'the turn prompt mirrored', ts: ms('2026-01-01T17:05:00Z') },  // AT T: the turn itself
  { pane: 'bbbbbbbb-2', role: 'committee', text: 'board row after T', ts: ms('2026-01-01T17:30:00Z') },
].map((o) => JSON.stringify(o)).join('\n') + '\n');
fs.writeFileSync(path.join(data, 'lap.jsonl'), [
  { lap: 'D900', stage: 'open', at: ms('2026-01-01T15:10:00Z') },
  { lap: 'D900', stage: 'chain', chain: 'working', holder: 'panes', at: ms('2026-01-01T16:20:00Z') },
  { lap: 'D900', stage: 'chain', chain: 'filed', holder: 'chair', at: ms('2026-01-01T17:40:00Z') },
  { lap: 'D899', stage: 'chain', chain: 'filed', holder: 'chair', at: ms('2026-01-01T15:20:00Z') },
].map((o) => JSON.stringify(o)).join('\n') + '\n');

const projects = path.join(root, 'projects'); fs.mkdirSync(path.join(projects, 'P'), { recursive: true });
const user = (ts, content) => ({ type: 'user', timestamp: ts, message: { role: 'user', content } });
const asst = (ts, text) => ({ type: 'assistant', timestamp: ts, message: { role: 'assistant', content: [{ type: 'text', text }] } });
fs.writeFileSync(path.join(projects, 'P', 't.jsonl'), [
  user('2026-01-01T15:30:00.000Z', '[pane:B] D999 result: 42 of 50 passed\nSOURCES: x\nNEXT: librarian collate'),
  asst('2026-01-01T15:30:10.000Z', 'noted'),
  user('2026-01-01T16:10:00.000Z', '<pasted_content id="ab">\n[chair:MAIN] check notes.md, the count is 7\n{"token":"s3cretvalue"}\nthe third place said 3\n</pasted_content id="ab">'),
  asst('2026-01-01T16:10:30.000Z', 'ok'),
  user('2026-01-01T16:50:00.000Z', '[pane:E] my own note, 5 rows'),
  user('2026-01-01T17:05:00.000Z', '[chair:MAIN] how many rows does a.txt hold? see a.txt and notes.md and missing.md'),
  asst('2026-01-01T17:05:20.000Z', 'a.txt holds one row'),
  user('2026-01-01T18:00:00.000Z', '[pane:C] 99 of 100'),
].map((o) => JSON.stringify(o)).join('\n') + '\n');

const unit = { id: 'X001', seat: 'E', transcript: 'P/t.jsonl', turnStart: '2026-01-01T17:05:00.000Z' };
const opts = { repo, projects, dataDir: data, tz: 'America/Regina' };

// ── the shared turn loader ───────────────────────────────────────────────────────────
test('the turn loader finds the erring prompt and stops the context at it', () => {
  const t = arms.loadTurn(unit, opts);
  assert.match(t.prompt.text, /how many rows does a\.txt hold/);
  assert.ok(!t.prior.some((m) => /99 of 100/.test(m.text)), 'a message after the turn is not context');
  assert.ok(t.prior.some((m) => /42 of 50/.test(m.text)));
});
test('the turn loader keeps a claim written through a tool as part of the reply', () => {
  const t = path.join(projects, 'P', 'tool.jsonl');
  fs.writeFileSync(t, [user('2026-01-01T17:05:00.000Z', 'write it up'),
    { type: 'assistant', timestamp: '2026-01-01T17:05:10.000Z', message: { role: 'assistant', content: [{ type: 'tool_use', name: 'Write', input: { file_path: 'x.md', content: 'the claim lives in a file' } }] } }]
    .map((o) => JSON.stringify(o)).join('\n') + '\n');
  const r = arms.loadTurn({ ...unit, transcript: 'P/tool.jsonl' }, opts);
  assert.ok(r.reply.some((m) => m.kind === 'TOOL_INPUT' && /the claim lives in a file/.test(m.text)));
});
test('a turnStart with no zone is refused, never guessed', () => {
  assert.throws(() => arms.loadTurn({ ...unit, turnStart: '2026-01-01T17:05:00' }, opts), /zone/);
});
test('a unit whose transcript is missing throws', () => {
  assert.throws(() => arms.loadTurn({ ...unit, transcript: 'P/none.jsonl' }, opts), /transcript/);
});
test('a turnStart with no prompt at or before it throws', () => {
  assert.throws(() => arms.loadTurn({ ...unit, turnStart: '2026-01-01T10:00:00Z' }, opts), /no real prompt/);
});
test('stamps take the D309 send-line form: UTC to the second, then the local civil time', () => {
  assert.strictEqual(arms.stamp(ms('2026-01-01T17:05:00Z'), 'America/Regina'), '2026-01-01T17:05:00Z · Jan 1, 11:05 AM local');
});

// ── F1, fresh facts ──────────────────────────────────────────────────────────────────
test('F1 reports the repository as it stood at the turn, not after it', () => {
  const r = arms.build('F1', unit, opts);
  assert.match(r.text, /c2 a two rows/);
  assert.doesNotMatch(r.text, /c3 late/);
  assert.strictEqual(r.asOf, '2026-01-01T17:05:00.000Z');
});
test('F1 names a side-line commit that existed by the turn but was merged into main only later', () => {
  const r = arms.build('F1', unit, opts);
  assert.match(r.text, /s1 side work/);
  assert.doesNotMatch(r.text, /m1 merge side/);
  const g = r.facts.find((f) => f.source === 'git');
  assert.notStrictEqual(g.head, g.newestAnywhere);
  assert.strictEqual(g.last24h, 4);   // c0 c1 s1 c2, every commit of main's history dated in the 24 h before T
});
test('F1 shows a board row once, and never the turn\'s own prompt mirrored at T', () => {
  const r = arms.build('F1', unit, opts);
  assert.strictEqual((r.text.match(/board row before T/g) || []).length, 1);
  assert.doesNotMatch(r.text, /the turn prompt mirrored/);
});
test('F1 checks each repo path the prompt names, as of the turn', () => {
  const r = arms.build('F1', unit, opts);
  const byPath = Object.fromEntries(r.facts.filter((f) => f.source === 'fs').map((f) => [f.path, f.status]));
  assert.deepStrictEqual(byPath, { 'a.txt': 'FOUND', 'notes.md': 'FOUND', 'missing.md': 'NOT-TRACKED' });
  assert.match(r.text, /a\.txt: in the repo, 2 lines, last changed [0-9a-f]{8} 2026-01-01T17:00:00Z/);
});
test('F1 shows board rows and lap rows only up to the turn', () => {
  const r = arms.build('F1', unit, opts);
  assert.match(r.text, /board row before T/);
  assert.doesNotMatch(r.text, /board row after T/);
  assert.match(r.text, /D900 working, holder panes/);   // filed only at 17:40, after T
  assert.doesNotMatch(r.text, /D899/);                 // filed before T: closed, not listed
});
test('F1 says the process list cannot be reconstructed rather than inventing one', () => {
  const r = arms.build('F1', unit, opts);
  assert.match(r.text, /processes: not reconstructible/);
});

// ── F2, dated messages ───────────────────────────────────────────────────────────────
test('F2 dates every other seat message in the context, the erring prompt included', () => {
  const r = arms.build('F2', unit, opts);
  assert.deepStrictEqual(r.stamps.map((s) => s.tag), ['pane:B', 'chair:MAIN', 'chair:MAIN']);
  assert.match(r.text, /42 of 50 passed\n\s*\[sent 2026-01-01T15:30:00Z · Jan 1, 9:30 AM local\]/);
  assert.doesNotMatch(r.text, /99 of 100/);
  assert.doesNotMatch(r.text, /my own note/);
});
test('F2 ends with the line that a figure from another seat is a claim to re-check', () => {
  const r = arms.build('F2', unit, opts);
  assert.match(r.text.trim().split('\n').pop(), /figure from another seat is a claim to re-check, not a fact/);
});
test('F2 redacts a token and removes a third-place line', () => {
  const r = arms.build('F2', unit, opts);
  assert.doesNotMatch(r.text, /s3cretvalue/);
  assert.doesNotMatch(r.text, /third place said/);
});
test('an arm writes a home path as ~, never with the user name', () => {
  const t = path.join(projects, 'P', 'home.jsonl');
  fs.writeFileSync(t, JSON.stringify(user('2026-01-01T17:05:00.000Z', '[pane:A] repo at C:\\Users\\someone\\Desktop\\x and C:/Users/someone/y, 3 files')) + '\n');
  const r = arms.build('F2', { ...unit, transcript: 'P/home.jsonl' }, opts);
  assert.doesNotMatch(r.text, /someone/);
  assert.match(r.text, /repo at ~\\Desktop\\x and ~\/y/);
});
test('F2 adds nothing when no other seat spoke in the context', () => {
  const t = path.join(projects, 'P', 'solo.jsonl');
  fs.writeFileSync(t, JSON.stringify(user('2026-01-01T17:05:00.000Z', 'plain question from the keeper')) + '\n');
  const r = arms.build('F2', { ...unit, transcript: 'P/solo.jsonl' }, opts);
  assert.strictEqual(r.text, '');
  assert.strictEqual(r.stamps.length, 0);
});

// ── F3, record search ────────────────────────────────────────────────────────────────
test('F3 searches the repository at the commit before the turn, with the prompt as the query', () => {
  const r = arms.build('F3', unit, { ...opts, k: 3 });
  assert.strictEqual(r.k, 3);
  assert.ok(r.results.length <= 3 && r.results.length > 0);
  assert.strictEqual(r.results[0].path, 'a.txt');
  assert.ok(!r.results.some((x) => x.path === 'late.md'), 'a file committed after the turn is not in the record');
  assert.match(r.text, /a\.txt:1-2/);
});
test('F3 never indexes the third-place folder', () => {
  const r = arms.build('F3', unit, { ...opts, query: 'zebracount rows' });
  assert.ok(r.results.length > 0);
  assert.ok(!r.results.some((x) => /third_place/.test(x.path)));
});
test('F3 with an empty query returns no results and adds nothing', () => {
  const r = arms.build('F3', unit, { ...opts, query: 'the and of' });
  assert.strictEqual(r.results.length, 0);
  assert.strictEqual(r.text, '');
});
test('an unknown arm is refused', () => {
  assert.throws(() => arms.build('F9', unit, opts), /unknown arm/);
});

test.after(() => scratch.rm(root));
