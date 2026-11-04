'use strict';
// lineage-rip.test.js — node --test consonance/tools/lineage-rip.test.js. D475 part 1: the keeper's words kept verbatim, append-only and deduplicated.
// SYNTHETIC transcripts only, written here (never his words): a scratch folder of Claude project folders, real files, real git for the refusal.
//   1  the primary path: the seats' user turns are kept (system reminders cut), and nothing else is: a short turn, a tool result, a meta turn,
//      a sidechain, a machine-made head, a sibling pane's folder; the store parses back to exactly the kept rows; the transcripts are untouched
//   2  dedup: a re-run on unchanged transcripts writes 0 bytes; a turn seen twice is kept once; a new turn is APPENDED, the old bytes kept as they were
//   3  an output inside a git work tree is refused before anything is read or written (a .git folder, and a worktree's .git file)
//   4  an empty line and a malformed line are skipped and counted, and the run goes on
//   5  a month file that does not parse to its last byte is refused by name, and nothing is written
//   6  --dry-run counts and writes nothing
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const R = require('./lineage-rip.js');
const scratch = require('./scratch.js');

const long = (w) => `${w} `.repeat(Math.ceil(220 / (w.length + 1))).trim();   // a synthetic turn past the 200-char floor
const turn = (text, extra = {}) => JSON.stringify({ type: 'user', timestamp: extra.ts || '2026-09-03T10:00:00.000Z', message: { role: 'user', content: text }, ...extra });
const put = (p, lines) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, lines.join('\n') + '\n'); return p; };
const bytesOf = (dir) => Object.fromEntries(fs.readdirSync(dir).sort().map((f) => [f, fs.readFileSync(path.join(dir, f), 'utf8')]));

/** projects/ with two seats, a sibling pane and an attic copy; the store's folder beside it. */
function fixture() {
  const root = scratch.mkdtemp('lineage-rip-test-'), projects = path.join(root, 'projects'), attic = path.join(root, 'attic'), out = path.join(root, 'lineage');
  const A = long('alpha'), B = long('bravo'), C = long('charlie');
  const files = [
    put(path.join(projects, 'C--Consonance-instances-main', 's1.jsonl'), [
      turn(A, { ts: '2026-09-03T10:00:00.000Z' }),
      turn(`<system-reminder>a reminder ${long('x')}</system-reminder>\n${B}`, { ts: '2026-10-01T09:00:00.000Z' }),
      turn('too short', { ts: '2026-09-03T10:01:00.000Z' }),
      JSON.stringify({ type: 'user', timestamp: '2026-09-03T10:02:00.000Z', message: { content: [{ type: 'tool_result', content: long('tool') }, { type: 'text', text: long('aside') }] } }),   // a tool result with text beside it: not his turn
      turn(long('meta'), { isMeta: true }),
      turn(long('side'), { isSidechain: true }),
      turn(`[pane:E] ${long('handback')}`),
      JSON.stringify({ type: 'assistant', timestamp: '2026-09-03T10:03:00.000Z', message: { content: [{ type: 'text', text: long('reply') }] } }),
    ]),
    put(path.join(projects, 'C--Users-someone-Desktop-notes', 'n1.jsonl'), [turn(C, { ts: '2026-09-04T08:00:00.000Z' })]),
    put(path.join(projects, 'C--Consonance-instances-sibling-1234abcd', 'p1.jsonl'), [turn(long('packet'), { ts: '2026-09-05T08:00:00.000Z' })]),
    put(path.join(attic, 'C--Consonance-instances-main', 'old.jsonl'), [turn(long('delta'), { ts: '2026-08-20T08:00:00.000Z' }), turn(A)]),
  ];
  const opts = { out, roots: [{ dir: projects, attic: false }, { dir: attic, attic: true }], seats: ['main', 'Desktop-notes'], now: new Date('2026-10-26T12:00:00Z') };
  return { root, projects, attic, out, files, opts, A, B, C };
}

test('row 1: the seats\' user turns are kept verbatim, system reminders cut, and nothing else; the transcripts are left as they were', async () => {
  const F = fixture(), before = F.files.map((f) => [fs.readFileSync(f, 'utf8'), fs.statSync(f).mtimeMs]);
  const c = await R.rip(F.opts);
  assert.equal(c.added, 4, JSON.stringify(c));
  assert.deepEqual(c.months, { '2026-08': 1, '2026-09': 2, '2026-10': 1 });
  assert.deepEqual(fs.readdirSync(F.out).sort(), ['INDEX.md', 'keeper_2026-08.md', 'keeper_2026-09.md', 'keeper_2026-10.md'], 'no lock or other file is left');
  const rows = (m) => R.parseMonth(m, fs.readFileSync(path.join(F.out, `keeper_${m}.md`), 'utf8')).rows.map((r) => [r.ts, r.seat, r.t]);
  assert.deepEqual(rows('2026-09'), [['2026-09-03T10:00:00.000Z', 'main', F.A], ['2026-09-04T08:00:00.000Z', 'Desktop-notes', F.C]]);
  assert.deepEqual(rows('2026-10'), [['2026-10-01T09:00:00.000Z', 'main', F.B]], 'the reminder is cut and the turn kept');
  assert.deepEqual(rows('2026-08'), [['2026-08-20T08:00:00.000Z', 'main (attic)', long('delta')]], 'the attic copy\'s seat is marked; its repeat of A is not kept twice');
  const all = Object.values(bytesOf(F.out)).join('\n');
  for (const w of ['too short', 'tool tool', 'aside aside', 'meta meta', 'side side', 'handback', 'reply reply', 'packet packet', 'a reminder']) assert.ok(!all.includes(w), `${w} is not in the store`);
  assert.match(fs.readFileSync(path.join(F.out, 'INDEX.md'), 'utf8'), /\n## added 2026-10-26T12:00:00\.000Z \(4\)\n\n- 2026-08-20T08:00 · main \(attic\) · \d+ · delta delta/);
  F.files.forEach((f, i) => { assert.equal(fs.readFileSync(f, 'utf8'), before[i][0], `${f} unchanged`); assert.equal(fs.statSync(f).mtimeMs, before[i][1], `${f} not written`); });
});

test('row 2: a re-run on unchanged transcripts writes 0 bytes; a new turn is appended once, and the old bytes stay a prefix', async () => {
  const F = fixture();
  await R.rip(F.opts);
  const first = bytesOf(F.out);
  const again = await R.rip(F.opts);
  assert.equal(again.added, 0); assert.equal(again.bytes, 0); assert.equal(again.duplicate, again.kept, 'every kept turn is already in the store');
  assert.deepEqual(bytesOf(F.out), first, 'byte for byte');
  fs.appendFileSync(F.files[0], turn(long('echo'), { ts: '2026-09-02T07:00:00.000Z' }) + '\n' + turn(F.A) + '\n');   // one new turn, one already kept
  const third = await R.rip(F.opts);
  assert.equal(third.added, 1);
  const now = bytesOf(F.out);
  for (const [f, text] of Object.entries(first)) assert.ok(now[f].startsWith(text), `${f}: append-only`);
  const sep = R.parseMonth('09', now['keeper_2026-09.md']).rows.map((r) => r.t);
  assert.deepEqual(sep, [F.A, F.C, long('echo')], 'the new, earlier turn goes at the END of its month, once');
  assert.equal((await R.rip(F.opts)).bytes, 0, 'and a fourth run writes nothing');
});

test('row 3: an output inside a git work tree is refused before anything is read or written', async () => {
  const F = fixture(), repo = path.join(F.root, 'repo');
  fs.mkdirSync(repo); spawnSync('git', ['init', '-q', repo]);
  const inRepo = path.join(repo, 'sub', 'lineage');
  await assert.rejects(R.rip({ ...F.opts, out: inRepo }), (e) => e.code === 'LINEAGE_IN_REPO' && e.message.includes(repo));
  assert.equal(fs.existsSync(path.join(repo, 'sub')), false, 'nothing made inside the repo');
  const wt = path.join(F.root, 'wt'); fs.mkdirSync(wt); fs.writeFileSync(path.join(wt, '.git'), 'gitdir: elsewhere\n');   // a worktree's .git is a file
  await assert.rejects(R.rip({ ...F.opts, out: path.join(wt, 'lineage') }), (e) => e.code === 'LINEAGE_IN_REPO');
  await assert.rejects(R.rip({ ...F.opts, out: path.join(F.projects, 'lineage') }), (e) => e.code === 'LINEAGE_ARGS', 'nor inside the transcripts it reads');
  assert.equal(R.gitTreeOf(F.out), null, 'control: the scratch store is in no work tree');
});

test('row 4: an empty line and a malformed line are skipped and counted, and the run goes on', async () => {
  const F = fixture();
  fs.writeFileSync(F.files[1], '\n' + '{"type":"user","message":{"content":"cut off' + '\n' + turn(F.C, { ts: '2026-09-04T08:00:00.000Z' }) + '\n\n');
  const c = await R.rip(F.opts);
  assert.equal(c.empty, 2, 'the leading and trailing blank lines'); assert.equal(c.malformed, 1);
  assert.equal(c.added, 4, 'the good turn after them is still kept');
});

test('row 5: a month file that does not parse to its last byte is refused by name, and nothing is written', async () => {
  const F = fixture();
  await R.rip(F.opts);
  const f = path.join(F.out, 'keeper_2026-09.md');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/ · (\d+) chars/, (m, n) => ` · ${+n + 1} chars`));
  const was = bytesOf(F.out);
  fs.appendFileSync(F.files[0], turn(long('foxtrot'), { ts: '2026-10-02T07:00:00.000Z' }) + '\n');
  await assert.rejects(R.rip(F.opts), (e) => e.code === 'LINEAGE_UNPARSED' && e.message.includes('keeper_2026-09.md'));
  assert.deepEqual(bytesOf(F.out), was);
  // a count one SHORT on a file's last row would read the row cut by a char and still reach the end of the file: refused too
  const g = path.join(F.out, 'keeper_2026-10.md'), cut = fs.readFileSync(g, 'utf8').replace(/ · (\d+) chars/, (m, n) => ` · ${+n - 1} chars`);
  assert.throws(() => R.parseMonth('keeper_2026-10.md', cut), (e) => e.code === 'LINEAGE_UNPARSED');
});

test('row 6: --dry-run counts what a run would add and writes nothing, not even the store\'s folder', async () => {
  const F = fixture();
  const dry = await R.rip({ ...F.opts, dryRun: true });
  assert.equal(fs.existsSync(F.out), false);
  assert.deepEqual({ added: dry.added, months: dry.months, bytes: dry.bytes }, { added: 4, months: { '2026-08': 1, '2026-09': 2, '2026-10': 1 }, bytes: 0 });
  assert.equal((await R.rip(F.opts)).added, dry.added, 'a real run adds what the dry run counted');
});
