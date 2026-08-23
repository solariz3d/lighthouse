/* librarian-cite.test.js — the resolver must refuse a stale citation, and must never emit prose.
 *
 * WHAT THIS PREVENTS, and the failure has no natural error. A citation is `path:line`. Line
 * numbers drift every time a master is appended to, and this room appends constantly (maintenance
 * law 2, "grow by appending clean"). So the dangerous case is not the missing file — that throws.
 * It is the citation that STILL RESOLVES: the file opens, line N comes back, everything looks
 * fine, and the pane is handed a line the librarian never cited. It reads as authoritative and it
 * is wrong, which is the same class as the figure handed to this pane tonight with a command
 * beside it that does not produce it.
 *
 * So drift is tested as the PRIMARY case, against a real git fixture rather than a mock: the
 * detector's whole mechanism is `git blame` on the note line plus `git show` of the master at that
 * commit, and a mocked git would test the mock.
 *
 * The second invariant is the seat's own rule, mechanised: CITE, DO NOT RECOLLECT. Every content
 * line this tool emits must appear verbatim in the master it names. If that assertion can pass
 * while the tool paraphrases, the tool is not doing the one thing it exists for.
 *
 * Run: node --test consonance/tools/librarian-cite.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const TOOL = path.join(__dirname, 'librarian-cite.js');
const REAL_REPO = path.resolve(__dirname, '..', '..');

// ---------------------------------------------------------------------------------------------
// A throwaway git repo whose masters are then edited underneath committed citations.

function sh(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}
const w = (root, rel, body) => {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), body);
};

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'libcite-'));
  sh(root, ['init', '-q']);
  sh(root, ['config', 'user.email', 'fixture@example.invalid']);
  sh(root, ['config', 'user.name', 'fixture']);
  sh(root, ['config', 'commit.gpgsign', 'false']);

  // The master, as it stood when the note was written. Line 7 is deliberately blank.
  w(root, 'exo_memory/journal/2026-01-01.md', [
    '# journal',                     // 1
    'alpha stays exactly where it is', // 2  -> VERIFIED
    'beta will be pushed down',      // 3  -> MOVED
    'gamma will be deleted',         // 4  -> GONE
    'delta will be duplicated',      // 5  -> AMBIGUOUS-MOVE
    'epsilon holds still',           // 6
    '',                              // 7  -> EMPTY-ANCHOR
  ].join('\n') + '\n');

  w(root, 'exo_memory/journal/short.md',
    ['one', 'two', 'three', 'four', 'five'].join('\n') + '\n');

  // Two tracked files with the same basename: a bare `README.md:1` cannot be resolved.
  w(root, 'README.md', 'root readme\n');
  w(root, 'sub/README.md', 'sub readme\n');

  w(root, 'exo_memory/librarian/2026-01-01.md', [
    '# 2026-01-01 — fixture notes',
    '',
    'stable journal/2026-01-01.md:2 drift topic',
    'shifted journal/2026-01-01.md:3 drift topic',
    'deleted journal/2026-01-01.md:4 drift topic',
    'doubled journal/2026-01-01.md:5 drift topic',
    'blankln journal/2026-01-01.md:7 drift topic',
    'beyond  journal/2026-01-01.md:900 drift topic',
    'shrunk  journal/short.md:5 drift topic',
    'missing journal/nowhere.md:1 drift topic',
    'ambig   README.md:1 drift topic',
    'later   journal/later.md:1 drift topic',
    '',
    '## An unrelated heading with no drift token',
    'quiet   journal/2026-01-01.md:6',
    '',
    '## recite topic — the same address, cited before the drift',
    'first   journal/2026-01-01.md:6',
  ].join('\n') + '\n');

  sh(root, ['add', '-A']);
  sh(root, ['commit', '-q', '-m', 'fixture: masters and the note that cites them']);

  // --- now the masters move underneath the committed citations ---
  w(root, 'exo_memory/journal/2026-01-01.md', [
    '# journal',
    'alpha stays exactly where it is',
    'INSERTED ONE',
    'INSERTED TWO',
    'beta will be pushed down',       // 3 -> 5
    // 'gamma will be deleted' removed entirely
    'delta will be duplicated',
    'delta will be duplicated',       // now two of them
    '',
    'epsilon holds still',
  ].join('\n') + '\n');
  w(root, 'exo_memory/journal/short.md', ['one', 'two'].join('\n') + '\n');
  // A master that did not exist at the note's commit.
  w(root, 'exo_memory/journal/later.md', 'added after the note was written\n');
  sh(root, ['add', '-A']);
  sh(root, ['commit', '-q', '-m', 'the masters drift, as masters do']);

  // A third commit in which the seat RE-CITES an address it had already cited before the drift.
  // The later citation carries the later baseline, and it is the one that must win.
  fs.appendFileSync(path.join(root, 'exo_memory/librarian/2026-01-01.md'),
    ['', '## recite topic — the same address again, after the drift',
      'second  journal/2026-01-01.md:6', ''].join('\n'));
  sh(root, ['add', '-A']);
  sh(root, ['commit', '-q', '-m', 'the seat re-cites the same address against the new master']);

  return root;
}

function run(root, args) {
  const r = require('node:child_process').spawnSync(
    process.execPath, [TOOL, ...args],
    { encoding: 'utf8', env: { ...process.env, LIBRARIAN_CITE_REPO: root } });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

function statuses(root, topic) {
  const r = run(root, [topic, '--json']);
  assert.strictEqual(r.code, 0, 'tool exited ' + r.code + ': ' + r.err);
  const j = JSON.parse(r.out);
  const by = {};
  for (const c of [...j.carried, ...j.refused]) by[c.raw] = c;
  return { j, by };
}

let ROOT;
test.before(() => { ROOT = fixture(); });

// ---------------------------------------------------------------------------------------------
// DRIFT — the primary case.

test('a line that has not changed is VERIFIED and carries the master text', () => {
  const { by } = statuses(ROOT, 'drift');
  const c = by['journal/2026-01-01.md:2'];
  assert.strictEqual(c.status, 'VERIFIED');
  assert.strictEqual(c.carry, true);
  assert.strictEqual(c.text, 'alpha stays exactly where it is');
});

test('a line pushed down by an append is MOVED, and the CORRECTED number is emitted', () => {
  // The whole point: the integer in the note is stale, the tool does not trust it, and it hands
  // the pane the line the note meant rather than whatever now sits at that offset.
  const { by } = statuses(ROOT, 'drift');
  const c = by['journal/2026-01-01.md:3'];
  assert.strictEqual(c.status, 'MOVED');
  assert.strictEqual(c.carry, true);
  assert.strictEqual(c.movedFrom, 3);
  assert.strictEqual(c.at, 5);
  assert.strictEqual(c.text, 'beta will be pushed down');
});

test('the MOVED case is exactly the silent one: line 3 now holds different text', () => {
  // Guards against a tool that "works" by trusting the integer. If it did, it would emit
  // 'INSERTED ONE' here and nothing would look wrong.
  const cur = fs.readFileSync(path.join(ROOT, 'exo_memory/journal/2026-01-01.md'), 'utf8')
    .split(/\r?\n/);
  assert.strictEqual(cur[2], 'INSERTED ONE');
  const { by } = statuses(ROOT, 'drift');
  assert.notStrictEqual(by['journal/2026-01-01.md:3'].text, 'INSERTED ONE');
});

test('a deleted line is GONE and is refused, not carried', () => {
  const { by } = statuses(ROOT, 'drift');
  const c = by['journal/2026-01-01.md:4'];
  assert.strictEqual(c.status, 'GONE');
  assert.strictEqual(c.carry, false);
});

test('a line whose text now appears twice is AMBIGUOUS-MOVE and is refused', () => {
  // Two candidates is not a 50/50 guess worth taking: half the time it cites the wrong one and
  // there is no way for the reader to tell which half they got.
  const { by } = statuses(ROOT, 'drift');
  const c = by['journal/2026-01-01.md:5'];
  assert.strictEqual(c.status, 'AMBIGUOUS-MOVE');
  assert.strictEqual(c.carry, false);
});

test('a blank cited line is EMPTY-ANCHOR and is refused', () => {
  const { by } = statuses(ROOT, 'drift');
  assert.strictEqual(by['journal/2026-01-01.md:7'].status, 'EMPTY-ANCHOR');
  assert.strictEqual(by['journal/2026-01-01.md:7'].carry, false);
});

test('a line number already past EOF when it was written is BASELINE-EOF, not PAST-EOF', () => {
  // The two are different findings: one says the citation was always wrong, the other says the
  // file shrank. Collapsing them would hide a note that was never checkable.
  const { by } = statuses(ROOT, 'drift');
  assert.strictEqual(by['journal/2026-01-01.md:900'].status, 'BASELINE-EOF');
});

test('a file that shrank below the cited line is PAST-EOF and is refused', () => {
  const { by } = statuses(ROOT, 'drift');
  assert.strictEqual(by['journal/short.md:5'].status, 'PAST-EOF');
  assert.strictEqual(by['journal/short.md:5'].carry, false);
});

// ---------------------------------------------------------------------------------------------
// PATHS — refusing to guess.

test('a path that does not exist is NO-FILE and is refused', () => {
  const { by } = statuses(ROOT, 'drift');
  assert.strictEqual(by['journal/nowhere.md:1'].status, 'NO-FILE');
});

test('a bare basename matching two tracked files is AMBIGUOUS-PATH, never resolved to one', () => {
  const { by } = statuses(ROOT, 'drift');
  const c = by['README.md:1'];
  assert.strictEqual(c.status, 'AMBIGUOUS-PATH');
  assert.strictEqual(c.carry, false);
  assert.ok(c.candidates.length >= 2, 'the refusal should name what it could not choose between');
});

test('a master added after the note was written is NO-BASELINE and is refused', () => {
  // It resolves and it opens. Without a baseline there is no way to know the line is the cited
  // one, so it is refused rather than carried with a shrug.
  const { by } = statuses(ROOT, 'drift');
  assert.strictEqual(by['journal/later.md:1'].status, 'NO-BASELINE');
  assert.strictEqual(by['journal/later.md:1'].carry, false);
});

test('an uncommitted note line is FRESH — carried, but never labelled VERIFIED', () => {
  // The seat writes and the chair commits, so a note written this hour is legitimately
  // uncommitted. Calling that VERIFIED would claim a check that did not happen.
  const note = path.join(ROOT, 'exo_memory/librarian/2026-01-01.md');
  const before = fs.readFileSync(note, 'utf8');
  const added = 'freshly journal/2026-01-01.md:2 drift topic uncommitted';
  fs.writeFileSync(note, before + added + '\n');
  const addedLine = fs.readFileSync(note, 'utf8').split(/\r?\n/).indexOf(added) + 1;
  try {
    const r = run(ROOT, ['uncommitted', '--json']);
    const j = JSON.parse(r.out);
    const c = j.carried.find((x) => x.noteLine === addedLine);
    assert.ok(c, 'the uncommitted citation was not picked up at all');
    assert.strictEqual(c.status, 'FRESH');
    assert.strictEqual(c.carry, true);
    assert.ok(/no baseline/i.test(c.detail), 'FRESH must say why it is weaker than VERIFIED');
  } finally {
    fs.writeFileSync(note, before);
  }
});

test('when one address is cited twice in a note, the LATER citation supplies the baseline', () => {
  // Within a file, the later append is the fresher citation and carries the fresher baseline.
  // Taking the earlier one would report MOVED for an address the seat re-cited correctly against
  // the current master — a drift warning about a citation that has no drift.
  const { j, by } = statuses(ROOT, 'recite');
  const c = by['journal/2026-01-01.md:6'];
  assert.strictEqual(c.status, 'VERIFIED', 'the pre-drift citation won; the later one should');
  assert.strictEqual(c.text, 'delta will be duplicated');
  assert.strictEqual(j.carried.filter((x) => x.raw === 'journal/2026-01-01.md:6').length, 1,
    'one address must be emitted once, not once per mention');
});

// ---------------------------------------------------------------------------------------------
// CITE, DO NOT RECOLLECT — the seat's own rule, mechanised.

test('every content line emitted appears verbatim in the master it names', () => {
  const r = run(ROOT, ['drift']);
  const lines = r.out.split(/\r?\n/);
  let current = null;
  let checked = 0;
  for (const line of lines) {
    const head = line.match(/^(\S+):(\d+)(?:-(\d+))?\s{2,}\[/);
    if (head) { current = head[1]; continue; }
    if (/^\s{4}\^ indexed by /.test(line)) { current = null; continue; }
    if (current && /^ {4}\S/.test(line)) {
      const body = line.slice(4);
      const master = fs.readFileSync(path.join(ROOT, current), 'utf8').split(/\r?\n/);
      assert.ok(master.includes(body),
        'emitted a line that is not in ' + current + ': ' + JSON.stringify(body));
      checked++;
    }
  }
  assert.ok(checked >= 2, 'the invariant checked ' + checked + ' lines — too few to mean anything');
});

test('the librarian\'s own prose is never emitted as content', () => {
  // The notes say "stable ... drift topic" around each citation. None of that may reach a pane:
  // the notes are an INDEX. Only the heading appears, and only on an attribution line.
  const r = run(ROOT, ['drift']);
  for (const marker of ['stable journal', 'shifted journal', 'deleted journal']) {
    assert.ok(!r.out.includes(marker),
      'note prose leaked into the output: ' + marker);
  }
});

test('a refused citation never appears as carried content', () => {
  const r = run(ROOT, ['drift']);
  const [carriedPart, refusedPart] = r.out.split(/^REFUSED \(/m);
  assert.ok(refusedPart, 'the refused section is missing');
  assert.ok(!carriedPart.includes('journal/nowhere.md'));
  assert.ok(!carriedPart.includes('gamma will be deleted'),
    'the text of a GONE citation was carried anyway');
});

// ---------------------------------------------------------------------------------------------
// SILENCE, and the ledger that holds no verdict.

test('no match prints nothing on stdout, says so on stderr, and exits 0', () => {
  // A channel that fires every turn becomes one people learn to skip (brief/LIBRARIAN.md:89-95).
  const r = run(ROOT, ['zzz-no-such-topic-anywhere']);
  assert.strictEqual(r.code, 0);
  assert.strictEqual(r.out, '');
  assert.match(r.err, /nothing surfaced/);
});

test('no topic is a usage error, not an empty success', () => {
  const r = run(ROOT, []);
  assert.strictEqual(r.code, 2);
  assert.match(r.err, /usage/);
});

test('--log writes an uninterpreted row and the tool ships no --report to read it', () => {
  // The seat must not score itself; a channel that scores the seat whose output it carries is the
  // same defect one hop out. This file records the operation and stops.
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'libcite-data-'));
  const r = require('node:child_process').spawnSync(
    process.execPath, [TOOL, 'drift', '--log', 'PANE-X'],
    { encoding: 'utf8', env: { ...process.env, LIBRARIAN_CITE_REPO: ROOT, CONSONANCE_DATA: dataDir } });
  assert.strictEqual(r.status, 0, r.stderr);
  const rows = fs.readFileSync(path.join(dataDir, 'librarian_cite.jsonl'), 'utf8')
    .split('\n').filter(Boolean).map(JSON.parse);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].pane, 'PANE-X');
  assert.ok(rows[0].carried.length > 0);
  assert.ok(!('score' in rows[0]) && !('opened' in rows[0]),
    'the emission row must carry no verdict');
  assert.ok(!fs.readFileSync(TOOL, 'utf8').includes("'--report'"),
    'this tool must not grow a report that scores the seat it carries');
});

test('--log with no pane name is refused rather than logged as an empty pane', () => {
  const r = run(ROOT, ['drift', '--log']);
  assert.strictEqual(r.code, 2);
});

// ---------------------------------------------------------------------------------------------
// AGAINST THE REAL CORPUS — a fixture can pass while the tool is useless here.

test('the real notes directory resolves citations against the real masters', () => {
  const M = require('./librarian-cite.js');
  assert.ok(M.noteFiles().length > 0, 'no dated librarian notes found in the repo');
  const res = M.collect('shelf');
  assert.ok(res.carried.length > 0,
    'nothing resolved from the real notes — the index or the resolver is broken here');
  for (const c of res.carried) {
    const master = fs.readFileSync(path.join(REAL_REPO, c.repoPath), 'utf8').split(/\r?\n/);
    assert.ok(master.slice(c.at - 1, c.at + c.span).join('\n') === c.text,
      c.repoPath + ':' + c.at + ' does not match what was emitted');
  }
});

test('notes are read newest-first, so a re-cited address resolves from the latest note', () => {
  const M = require('./librarian-cite.js');
  const files = M.noteFiles().map((f) => path.basename(f));
  assert.deepStrictEqual(files, [...files].sort().reverse(),
    'note files are not newest-first');
});

test('a note file carrying a different date in its own heading is reported by that heading', () => {
  // Real and live: exo_memory/librarian/2026-08-22.md carries a top-level `# 2026-08-23` section,
  // so one day's notes span two files. Filename order still drives reading; the heading date is
  // what gets reported, so the split stays visible rather than being silently averaged away.
  const M = require('./librarian-cite.js');
  const f = M.noteFiles().find((x) => path.basename(x) === '2026-08-22.md');
  if (!f) return;                                  // the fixture day may age out; not a failure
  const bs = M.blocks(f);
  const dates = new Set(bs.map((b) => b.headingDate));
  assert.ok(dates.size >= 1);
  const late = bs.filter((b) => b.headingDate !== b.fileDate);
  if (late.length) {
    assert.ok(late.every((b) => b.headingDate > b.fileDate),
      'a heading date earlier than its filename would mean the notes are out of order');
  }
});
