// Tests for essay-provenance. Fixture data only — nothing here reads the live git history, the
// live board or the live METHOD.md, so the suite says the same thing tonight and after the next
// commit lands in essay/.
//
// Run:  node --test consonance/tools/
//
// WHAT IS WORTH TESTING HERE. This is a compiler over four ledgers that disagree, and the whole
// instrument is what it does when they disagree. So the fixture is built to contain ALL FIVE of
// the reconciliation cases at once, plus the case where everything agrees, and each case gets its
// own assertion on its own label. That shape is deliberate: it is what kills the mutant that
// collapses every disagreement into one generic "mismatch" bucket, which is the failure the packet
// names and the failure this room has now shipped twice in a fortnight (carrier-drift reporting a
// deliberate deletion as MISSING-FILE, forget-rate reporting the same deletion as bytes lost).
//
// THE THREE MUTANTS the packet requires, and where each one dies:
//
//   drop the BOARD source   -> `a commit corroborated by a board row is labelled BOARD-SHA`
//                              and `a board row that names no landed commit is BOARD-NO-COMMIT`.
//   drop the METHOD source  -> `a commit that landed an artifact with its log entry is LOGGED`.
//   collapse the rulings    -> `all five reconciliation cases are distinguishable`, which asserts
//                              five DISTINCT labels over one fixture and forbids the word MISMATCH.
//
// AND ONE CASE THE PACKET DID NOT NAME, which is the reason this file has more tests than bars.
// "An artifact with no METHOD entry" is not one case, it is two, and calling them one would build
// exactly the instrument the packet forbids: the seat that keeps METHOD.md is the only seat
// permitted to write it, so another seat landing a file in essay/ without a METHOD entry has
// broken no rule — the entry is owed by the log's keeper, not by the lander. Flagging that as the
// lander's fault is a success reported as a fault, third occurrence. Hence NO-LOG-ENTRY and
// NO-LOG-ENTRY-OTHER-SEAT, and hence the test that they are not the same label.
'use strict';

const test = require('node:test');
const assert = require('node:assert');

const {
  reconcile,
  parseMethod,
  shortShas,
  essayPaths,
  dedupeBoard,
  methodKeeper,
  resolveMention,
  readLap,
} = require('./essay-provenance.js');

/* ── THE FIXTURE ──────────────────────────────────────────────────────────────────────────────
 *
 * Four commits, two METHOD entries, two board rows, one lap row. Between them they produce every
 * case in the packet's §2 and the agreeing case, and nothing here overlaps a real sha.
 *
 *   c1 aaaaaaa  artifact + its METHOD entry, and a board row naming its sha   -> LOGGED, BOARD-SHA
 *   c2 bbbbbbb  artifact from ANOTHER thread, no METHOD entry     -> NO-LOG-ENTRY-OTHER-SEAT
 *   c3 ccccccc  METHOD.md alone, nothing landed beside it         -> METHOD-NO-ARTIFACT
 *   c4 ddddddd  artifact from the log's OWN keeper, unlogged      -> NO-LOG-ENTRY   (the red case)
 *   b2          a board row naming an essay path and no commit    -> BOARD-NO-COMMIT
 *   lap L99     a lap row naming a path nothing else mentions     -> LAP-ONLY
 */
const S_KEEPER = 'session_KEEPER';
const S_OTHER = 'session_OTHER';

function fixture() {
  const commits = [
    {
      sha: 'aaaaaaa', full: 'aaaaaaa0000000000000000000000000000000', date: '2026-09-08',
      ts: 1788800000000, subject: 'Essay A built', body: '', session: S_KEEPER, seatLine: null,
      paths: ['essay/A.html', 'essay/METHOD.md'],
    },
    {
      sha: 'bbbbbbb', full: 'bbbbbbb0000000000000000000000000000000', date: '2026-09-08',
      ts: 1788800100000, subject: 'LIBRARIAN: the read', body: 'Seat: librarian.',
      session: S_OTHER, seatLine: 'librarian', paths: ['essay/READ.md'],
    },
    {
      sha: 'ccccccc', full: 'ccccccc0000000000000000000000000000000', date: '2026-09-08',
      ts: 1788800200000, subject: "METHOD: the keeper's decision", body: '',
      session: S_KEEPER, seatLine: null, paths: ['essay/METHOD.md'],
    },
    {
      sha: 'ddddddd', full: 'ddddddd0000000000000000000000000000000', date: '2026-09-08',
      ts: 1788800300000, subject: 'HANDOFF rewritten', body: '',
      session: S_KEEPER, seatLine: null, paths: ['essay/HANDOFF.md'],
    },
  ];
  const method = [
    { heading: '## 2026-09-08 ~02:20 — essay A built', date: '2026-09-08', sha: 'aaaaaaa', line: 10 },
    { heading: "## 2026-09-08 ~04:14 — the keeper's decision", date: '2026-09-08', sha: 'ccccccc', line: 40 },
  ];
  const board = [
    {
      pane: 'p-one', actor: 'D', role: 'user', ts: 1788800050000,
      text: 'landed essay/A.html at aaaaaaa, pushed', paths: ['essay/A.html'], shas: ['aaaaaaa'],
    },
    {
      pane: 'p-two', actor: 'E', role: 'user', ts: 1788800400000,
      text: 'read essay/PLAN.md before you start (9999999)', paths: ['essay/PLAN.md'], shas: ['9999999'],
    },
  ];
  const lap = [
    { lap: 'L99', stage: 'opened', at: 1788800500000, paths: ['essay/ORPHAN.md'], note: '', holder: null, to: null },
  ];
  return { commits, method, board, lap };
}

const labelsOf = (out) => new Set(out.landed.flatMap((r) => r.rulings)
  .concat(out.signals.map((r) => r.ruling)));

/* ── THE RED CASE, FIRST ──────────────────────────────────────────────────────────────────── */

test('a hand-back that lands in essay/ with no METHOD entry prints NO LOG ENTRY', () => {
  const out = reconcile(fixture());
  const row = out.landed.find((r) => r.path === 'essay/HANDOFF.md');
  assert.ok(row, 'the artifact must appear in the landed table at all');
  assert.strictEqual(row.log, 'NO LOG ENTRY');
  assert.ok(row.rulings.includes('NO-LOG-ENTRY'), `expected NO-LOG-ENTRY, got ${row.rulings}`);
  assert.strictEqual(row.red, true, 'the row must be marked red, not merely labelled');
});

test('the lander who may not write METHOD is not reported as the fault', () => {
  // The seat that keeps METHOD.md is the only seat permitted to write it. Another seat landing a
  // file in essay/ without an entry has broken no rule; the entry is owed by the log's keeper.
  // Collapsing this into the row above is the success-reported-as-a-fault defect, third time.
  const out = reconcile(fixture());
  const mine = out.landed.find((r) => r.path === 'essay/HANDOFF.md');
  const theirs = out.landed.find((r) => r.path === 'essay/READ.md');
  assert.ok(theirs.rulings.includes('NO-LOG-ENTRY-OTHER-SEAT'));
  assert.ok(!theirs.rulings.includes('NO-LOG-ENTRY'));
  assert.notDeepStrictEqual(theirs.rulings, mine.rulings);
  assert.strictEqual(theirs.log, 'NO LOG ENTRY (owed by the log-keeper)');
});

test('the log-keeper is derived from the record, never named in the source', () => {
  const f = fixture();
  assert.strictEqual(methodKeeper(f.commits), S_KEEPER);
  // and with the evidence removed it must say so rather than guess a keeper
  assert.strictEqual(methodKeeper([]), null);
});

test('with no derivable log-keeper every unlogged artifact is flagged unqualified', () => {
  const f = fixture();
  for (const c of f.commits) c.session = null;
  const out = reconcile(f);
  const rows = out.landed.filter((r) => r.rulings.includes('NO-LOG-ENTRY'));
  assert.strictEqual(rows.length, 2, 'both unlogged artifacts, with no basis to excuse either');
  assert.ok(!labelsOf(out).has('NO-LOG-ENTRY-OTHER-SEAT'));
});

/* ── THE FIVE CASES, EACH ITS OWN LABEL ───────────────────────────────────────────────────── */

test('all five reconciliation cases are distinguishable', () => {
  const out = reconcile(fixture());
  const labels = labelsOf(out);
  for (const want of ['COMMIT-NO-BOARD', 'BOARD-NO-COMMIT', 'METHOD-NO-ARTIFACT',
    'NO-LOG-ENTRY', 'LAP-ONLY']) {
    assert.ok(labels.has(want), `case ${want} was not produced; got ${[...labels].join(', ')}`);
  }
  for (const l of labels) {
    assert.ok(!/MISMATCH/i.test(l), `a generic bucket appeared: ${l}`);
  }
});

test('a commit that landed an artifact with its log entry is LOGGED', () => {
  const out = reconcile(fixture());
  const row = out.landed.find((r) => r.path === 'essay/A.html');
  assert.ok(row.rulings.includes('LOGGED'));
  assert.strictEqual(row.log, '2026-09-08 ~02:20 — essay A built');
  assert.strictEqual(row.red, false);
});

test('a commit corroborated by a board row is labelled BOARD-SHA', () => {
  const out = reconcile(fixture());
  const row = out.landed.find((r) => r.path === 'essay/A.html');
  assert.ok(row.rulings.includes('BOARD-SHA'));
  assert.ok(!row.rulings.includes('COMMIT-NO-BOARD'));
});

test('a commit no board row names anywhere is COMMIT-NO-BOARD', () => {
  const out = reconcile(fixture());
  const row = out.landed.find((r) => r.path === 'essay/READ.md');
  assert.ok(row.rulings.includes('COMMIT-NO-BOARD'));
});

test('a board row that names an essay path and no landed commit is BOARD-NO-COMMIT', () => {
  const out = reconcile(fixture());
  const row = out.signals.find((r) => r.source === 'board');
  assert.strictEqual(row.ruling, 'BOARD-NO-COMMIT');
  assert.deepStrictEqual(row.paths, ['essay/PLAN.md']);
});

test('a METHOD entry with nothing landing beside it is METHOD-NO-ARTIFACT', () => {
  const out = reconcile(fixture());
  const row = out.landed.find((r) => r.sha === 'ccccccc');
  assert.ok(row.rulings.includes('METHOD-NO-ARTIFACT'));
  assert.strictEqual(row.path, '(no artifact)');
  assert.strictEqual(row.log, "2026-09-08 ~04:14 — the keeper's decision");
});

test('a lap row nothing else mentions is LAP-ONLY', () => {
  const out = reconcile(fixture());
  const row = out.signals.find((r) => r.source === 'lap');
  assert.strictEqual(row.ruling, 'LAP-ONLY');
  assert.strictEqual(row.lap, 'L99');
});

test('a lap row whose path a commit already carries is not re-reported as LAP-ONLY', () => {
  const f = fixture();
  f.lap[0].paths = ['essay/A.html'];
  const out = reconcile(f);
  assert.strictEqual(out.signals.filter((r) => r.source === 'lap').length, 0);
});

/* ── THE JOIN, AND WHAT IT REFUSES TO DO ──────────────────────────────────────────────────── */

test('a board row is joined to a commit by its sha and never by proximity in time', () => {
  // b2 sits 100 s after commit ddddddd and names an essay path. A nearest-in-time join would
  // attach them; there is no key that licenses it, so it must stay in the signals table.
  const out = reconcile(fixture());
  const dd = out.landed.find((r) => r.sha === 'ddddddd');
  assert.ok(!dd.rulings.includes('BOARD-SHA'));
  assert.ok(out.signals.some((r) => r.source === 'board' && r.ts === 1788800400000));
});

test('a board row naming a landed path but not its sha is a weak join and says so', () => {
  const f = fixture();
  // The sha-carrying row is removed, so path mention is the ONLY board evidence for this commit.
  // Leaving it in would let BOARD-SHA answer for the path-only row and the test would prove
  // nothing about the weak join.
  f.board = [{
    pane: 'p-two', actor: 'E', role: 'user', ts: 1788800400000,
    text: 'go and read essay/A.html', paths: ['essay/A.html'], shas: [],
  }];
  const out = reconcile(f);
  const row = out.landed.find((r) => r.path === 'essay/A.html');
  assert.ok(row.rulings.includes('BOARD-PATH-ONLY'), `got ${row.rulings}`);
  assert.ok(!row.rulings.includes('BOARD-SHA'), 'a path mention is not evidence of which commit');
});

/* ── THE PARSERS ──────────────────────────────────────────────────────────────────────────── */

test('METHOD headings are parsed with their date and nothing else is', () => {
  const text = [
    '# METHOD — how the essay was produced',
    'prose',
    '## 2026-09-07 · sitting 1 (~01:55–02:10)',
    'more prose',
    '### not an entry',
    '## 2026-09-08 ~02:05 — fourth substrate change',
    '    ## indented, inside a block',
  ].join('\n');
  const out = parseMethod(text);
  assert.strictEqual(out.length, 2);
  assert.strictEqual(out[0].date, '2026-09-07');
  assert.strictEqual(out[1].date, '2026-09-08');
  assert.strictEqual(out[1].line, 6);
});

test('an entry with no parseable date is kept, not dropped', () => {
  // Dropping it would make the log look tidier than it is, which is the direction that flatters.
  const out = parseMethod('## a heading with no date');
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].date, null);
});

test('short shas are extracted at word boundaries and decimal lookalikes are not shas', () => {
  assert.deepStrictEqual(shortShas('landed 7acd20d and fd8d831'), ['7acd20d', 'fd8d831']);
  assert.deepStrictEqual(shortShas('5,609 words'), []);
  assert.deepStrictEqual(shortShas('abcdef'), [], 'six hex is below the floor');
  assert.deepStrictEqual(shortShas('x1234567x'), [], 'not at a word boundary');
});

test('essay paths are extracted and a bare mention of the word essay is not one', () => {
  assert.deepStrictEqual(essayPaths('see essay/METHOD.md now'), ['essay/METHOD.md']);
  assert.deepStrictEqual(essayPaths('the essay is long'), []);
  assert.deepStrictEqual(essayPaths('essay/sections/one.md and essay/A.html'),
    ['essay/A.html', 'essay/sections/one.md']);
  assert.deepStrictEqual(essayPaths('essay/METHOD.md, essay/METHOD.md'), ['essay/METHOD.md'],
    'one mention twice is one path');
});

/* ── THE BOARD IS NOT A CLEAN LEDGER ──────────────────────────────────────────────────────── */

test('exact duplicate board rows are merged and the merge is counted', () => {
  // The live board carries whole re-appended stretches: on 2026-09-08, 7 of the 20 rows naming an
  // essay path were byte-identical repeats of an earlier row. Counting them twice would inflate
  // every board figure in the report by a third.
  const rows = [
    { pane: 'p', role: 'user', ts: 1, text: 'essay/A.md' },
    { pane: 'p', role: 'user', ts: 1, text: 'essay/A.md' },
    { pane: 'p', role: 'user', ts: 2, text: 'essay/A.md' },
  ];
  const { rows: out, dropped } = dedupeBoard(rows);
  assert.strictEqual(out.length, 2);
  assert.strictEqual(dropped, 1);
});

test('two different panes saying the same thing at the same ms are two rows', () => {
  const rows = [
    { pane: 'p', role: 'user', ts: 1, text: 'essay/A.md' },
    { pane: 'q', role: 'user', ts: 1, text: 'essay/A.md' },
  ];
  const { rows: out, dropped } = dedupeBoard(rows);
  assert.strictEqual(out.length, 2);
  assert.strictEqual(dropped, 0);
});

/* ── THE EMPTY AND BOUNDARY CASES ─────────────────────────────────────────────────────────── */

test('no essay commits at all is reported, never rendered as a clean empty table', () => {
  const out = reconcile({ commits: [], method: [], board: [], lap: [] });
  assert.strictEqual(out.landed.length, 0);
  assert.strictEqual(out.counts.commits, 0);
  assert.strictEqual(out.unmeasured, true, 'an empty compile is UNMEASURED, not green');
});

test('a commit touching essay/ with a path list that is only METHOD still gets a row', () => {
  const out = reconcile(fixture());
  assert.ok(out.landed.some((r) => r.sha === 'ccccccc'));
});

test('every landed row carries at least one ruling', () => {
  const out = reconcile(fixture());
  for (const r of out.landed) {
    assert.ok(r.rulings.length > 0, `${r.sha} ${r.path} carries no ruling`);
  }
});

/* ── A MISSING SOURCE IS NOT AN EMPTY SOURCE ──────────────────────────────────────────────── */

test('an unreadable board reports BOARD-UNREAD, never COMMIT-NO-BOARD', () => {
  // "No board row names this commit" and "the board could not be read" are the done-vs-never-
  // started distinction on the board axis. Rendering the second as the first is a green over a
  // source that never ran, which is the defect this room keeps shipping.
  const f = fixture();
  f.board = [];
  f.available = { board: false };
  const out = reconcile(f);
  for (const r of out.landed) {
    assert.ok(r.rulings.includes('BOARD-UNREAD'), `${r.sha} got ${r.rulings}`);
    assert.ok(!r.rulings.includes('COMMIT-NO-BOARD'));
  }
});

test('an unreadable lap ledger does not manufacture LAP-ONLY rows or silence them', () => {
  const f = fixture();
  f.available = { lap: false };
  const out = reconcile(f);
  assert.strictEqual(out.signals.filter((r) => r.source === 'lap').length, 0);
  assert.strictEqual(out.unread.includes('lap'), true, 'the unread source must be named in output');
});

/* ── PROSE NAMES A PATH LOOSELY ───────────────────────────────────────────────────────────── */

test('an abbreviated path that is a prefix of exactly one landed file resolves to it', () => {
  // The live board says `essay/READER_NOTES` for `essay/READER_NOTES_2026-09-07.md`, a file that
  // DID land. Matched exactly it resolves to nothing and the row reads as a dispatch that never
  // landed — a landing reported as a failure, the one shape this tool was ordered not to repeat.
  const landed = new Set(['essay/READER_NOTES_2026-09-07.md', 'essay/METHOD.md']);
  assert.deepStrictEqual(resolveMention('essay/READER_NOTES', landed),
    { path: 'essay/READER_NOTES_2026-09-07.md', via: 'unique-prefix' });
  assert.deepStrictEqual(resolveMention('essay/METHOD.md', landed),
    { path: 'essay/METHOD.md', via: 'exact' });
});

test('an abbreviation matching two landed files resolves to NEITHER and says ambiguous', () => {
  const landed = new Set(['essay/A_Gap.html', 'essay/A_Gap.pdf']);
  const got = resolveMention('essay/A_Gap', landed);
  assert.strictEqual(got.path, null);
  assert.strictEqual(got.via, 'ambiguous');
  assert.deepStrictEqual(got.candidates.sort(), ['essay/A_Gap.html', 'essay/A_Gap.pdf']);
});

test('a mention matching nothing stays unresolved rather than reaching for a near miss', () => {
  assert.deepStrictEqual(resolveMention('essay/LIT.md', new Set(['essay/METHOD.md'])),
    { path: null, via: null });
});

test('an ambiguous board mention is not reported as a dispatch that never landed', () => {
  const f = fixture();
  f.board = [{
    pane: 'p', actor: 'D', role: 'user', ts: 1, text: 'see essay/A', paths: ['essay/A'], shas: [],
  }];
  f.commits[0].paths = ['essay/A.html', 'essay/A.pdf', 'essay/METHOD.md'];
  const out = reconcile(f);
  assert.strictEqual(out.signals.filter((r) => r.source === 'board').length, 0);
  assert.strictEqual(out.counts.board_mentions_ambiguous, 1);
});

/* ── AN AXIS IS A FACT ABOUT WHAT IT MEASURES ─────────────────────────────────────────────── */

test('a path mention corroborates that path only, never every file in its commit', () => {
  // The first build applied the board and lap axes at commit level, so a commit touching eight
  // files printed BOARD-PATH-ONLY on all eight when the board had named one.
  const f = fixture();
  f.commits[0].paths = ['essay/A.html', 'essay/B.html', 'essay/METHOD.md'];
  f.board = [{
    pane: 'p', actor: 'D', role: 'user', ts: 1, text: 'read essay/B.html',
    paths: ['essay/B.html'], shas: [],
  }];
  const out = reconcile(f);
  const a = out.landed.find((r) => r.path === 'essay/A.html');
  const b = out.landed.find((r) => r.path === 'essay/B.html');
  assert.ok(b.rulings.includes('BOARD-PATH-ONLY'));
  assert.ok(a.rulings.includes('COMMIT-NO-BOARD'), `A got ${a.rulings}`);
});

test('a sha corroborates the whole commit, because a sha names a commit and not a file', () => {
  const f = fixture();
  f.commits[0].paths = ['essay/A.html', 'essay/B.html', 'essay/METHOD.md'];
  const out = reconcile(f);   // b1 carries sha aaaaaaa
  for (const p of ['essay/A.html', 'essay/B.html']) {
    assert.ok(out.landed.find((r) => r.path === p).rulings.includes('BOARD-SHA'));
  }
});

test('a lap row is joined on its structured paths and never on its prose note', () => {
  // L047's note reads "four packets per essay/PROGRAM_BRIEF", abbreviating a file that had already
  // landed as essay/PROGRAM_BRIEF_2026-09-08.md. Mining the note produced a false LAP-ONLY.
  const rows = readLap(mkLapFixture(), 'essay/');
  assert.deepStrictEqual(rows[0].paths, ['essay/REAL.md']);
  assert.deepStrictEqual(rows[0].noteMentions, ['essay/ABBREV']);
});

function mkLapFixture() {
  const fs2 = require('fs');
  const os2 = require('os');
  const p2 = require('path');
  const dir = fs2.mkdtempSync(p2.join(os2.tmpdir(), 'essay-prov-'));
  const f = p2.join(dir, 'lap.jsonl');
  fs2.writeFileSync(f, `${JSON.stringify({
    lap: 'L01', stage: 'opened', at: 1, paths: ['essay/REAL.md'],
    note: 'four packets per essay/ABBREV; see it',
  })}\n`, 'utf8');
  return f;
}

/* ── DONE, NOT-YET-RECORDED, AND NEVER-STARTED ARE THREE STATES ───────────────────────────── */

test('a path written to disk and not yet committed is not a dispatch that never landed', () => {
  // Caught live at 07:02 on 2026-09-08: pane A had filed essay/LIT_2026-09-08.md minutes earlier,
  // the file existed, git log could not see it, and the tool called it never-landed. That is the
  // done-vs-never-started conflation this instrument was built to stop making.
  const f = fixture();
  f.onDisk = new Set(['essay/PLAN.md']);
  const out = reconcile(f);
  const row = out.signals.find((r) => r.source === 'board');
  assert.strictEqual(row.ruling, 'ON-DISK-NOT-COMMITTED');
  assert.strictEqual(out.counts.on_disk_not_committed, 1);
  assert.strictEqual(out.counts.board_no_commit, 0);
});

test('with no working-tree evidence the tool falls back to two states rather than guessing', () => {
  const out = reconcile(fixture());
  assert.strictEqual(out.signals.find((r) => r.source === 'board').ruling, 'BOARD-NO-COMMIT');
  assert.strictEqual(out.counts.on_disk_not_committed, 0);
});

test('a lap row over a path that exists on disk is not a baton that produced nothing', () => {
  const f = fixture();
  f.onDisk = new Set(['essay/ORPHAN.md']);
  const out = reconcile(f);
  assert.strictEqual(out.signals.find((r) => r.source === 'lap').ruling, 'ON-DISK-NOT-COMMITTED');
});

test('reconcile does not write into the rows it was handed', () => {
  // A function that mutates its input gives a different answer the second time it is called on the
  // same array, and the difference is invisible until something calls it twice.
  const f = fixture();
  const before = JSON.stringify(f.board);
  const one = reconcile(f);
  const two = reconcile(f);
  assert.strictEqual(JSON.stringify(f.board), before);
  assert.deepStrictEqual(one.counts, two.counts);
  assert.deepStrictEqual(one.signals, two.signals);
});

test('an abbreviated mention of a file that exists on disk resolves the same way git-side does', () => {
  // The board writes prose whether or not the file is committed. Handling the abbreviation for the
  // git side and not the working-tree side is how two halves of one instrument disagree.
  const f = fixture();
  f.board = [{
    pane: 'p', actor: 'D', role: 'user', ts: 1, text: 'filed essay/LIT',
    paths: ['essay/LIT'], shas: [],
  }];
  f.onDisk = new Set(['essay/LIT_2026-09-08.md']);
  const out = reconcile(f);
  assert.strictEqual(out.signals.find((r) => r.source === 'board').ruling, 'ON-DISK-NOT-COMMITTED');
});

/* ── A DOCSTRING LOOSER THAN ITS CODE IS A TRAP LAID FOR THE NEXT SEAT ────────────────────── */

test('every label this tool can emit is documented in its own header', () => {
  // js-suite.js carries this lesson with a scar attached: its prose said "by containing the marker"
  // for as long as the marker existed while the code enforced two extra narrowings, and a seat
  // declared a canary exactly as the sentence permitted and found out by running the suite. So the
  // header's ruling list is asserted against the labels the code actually produces.
  const fs2 = require('fs');
  const path2 = require('path');
  const header = fs2.readFileSync(path2.join(__dirname, 'essay-provenance.js'), 'utf8')
    .split('\n').slice(0, 100).join('\n');

  const emitted = new Set();
  const collect = (o) => {
    for (const r of o.landed) for (const l of r.rulings) emitted.add(l);
    for (const r of o.signals) emitted.add(r.ruling);
  };
  collect(reconcile(fixture()));
  collect(reconcile({ ...fixture(), available: { board: false } }));
  collect(reconcile({ ...fixture(), onDisk: new Set(['essay/PLAN.md', 'essay/ORPHAN.md']) }));
  const pathOnly = fixture();
  pathOnly.board = [{ pane: 'p', actor: 'D', role: 'user', ts: 1, text: 'essay/A.html',
    paths: ['essay/A.html'], shas: [] }];
  collect(reconcile(pathOnly));
  // and the corrected run, so a new label cannot be shipped undocumented (L048)
  collect(reconcile(Object.assign({}, fixture(), { corrections: [correction()], readBlob })));

  assert.ok(emitted.size >= 10, `only ${emitted.size} labels reachable: ${[...emitted].join(' ')}`);
  for (const label of emitted) {
    assert.ok(header.includes(label), `label ${label} is emitted and not documented in the header`);
  }
});

test('a prefix given without its slash does not silently unlog every artifact', () => {
  // `p + LOG_FILE` on a slashless prefix reads "essayMETHOD.md", which matches nothing, so every
  // commit would look like it landed an artifact with no log entry. A wrong answer, not an error.
  const { normPrefix } = require('./essay-provenance.js');
  assert.strictEqual(normPrefix('essay'), 'essay/');
  assert.strictEqual(normPrefix('essay/'), 'essay/');
  assert.strictEqual(normPrefix(''), 'essay/');
  assert.strictEqual(normPrefix(undefined), 'essay/');
  const out = reconcile({ ...fixture(), prefix: 'essay' });
  assert.strictEqual(out.counts.logged, 1, 'METHOD.md must still be recognised as the log');
  assert.strictEqual(out.counts.method_no_artifact, 1);
});

/* ── THE CORRECTIONS LEDGER (L048) ────────────────────────────────────────────────────────────
 *
 * `babe926`, 2026-09-08: a librarian commit about the two-machine idea carried four files the
 * chair had staged. The tool read the seat from the commit body — correctly — and attributed four
 * chair artifacts to the librarian. The commit is pushed, so the record can only be repaired by a
 * second record, and a second record that is BELIEVED rather than checked is a place to rewrite
 * history politely. Every test below holds one of those two halves down: the correction is VISIBLE
 * (never a silent override) and the correction is CHECKED (never an assertion).
 *
 * The evidence door is `readBlob(sha, path)` and it is injected, so these tests exercise the RULE
 * and not a re-implementation of it — and a run with no reader refuses every correction.
 */

const { verifyCorrection, readCorrections, correctionKey, render }
  = require('./essay-provenance.js');

// The shape of the real thing: an authorship line inside the artifact's own header.
const HEADER_B = [
  '# Essay B (bare instance) — "Uncarried", first draft',
  '',
  '**SEAT: a bare Claude instance, spawned by the chair. TIME: 2026-09-08 ~07:33 local.**',
  "**Placed here by the chair; the header is the chair's, the essay is not.**",
  'The full prompt is preserved at `essay/PROMPT.txt` so the check is re-runnable.',
].join('\n');

const BLOBS = {
  'essay/READ.md': HEADER_B,
  'essay/PROMPT.txt': 'Write a philosophical essay of roughly 2,000-3,000 words.\n',
  'essay/A.html': '<h1>no header, no authorship line, nothing to check against</h1>',
};
const readBlob = (sha, file) => (Object.prototype.hasOwnProperty.call(BLOBS, file) ? BLOBS[file] : null);

const correction = (over) => Object.assign({
  sha: 'bbbbbbb',
  path: 'essay/READ.md',
  seat: 'chair',
  by: 'pane BRAVO (L048)',
  at: '2026-09-09T00:55:00-06:00',
}, over || {});

const withCorrections = (rows, f) => reconcile(
  Object.assign({}, f || fixture(), { corrections: rows, readBlob }));

test('RED FIRST — uncorrected, the table says what the commit body said', () => {
  const out = reconcile(fixture());
  const row = out.landed.find((r) => r.path === 'essay/READ.md');
  assert.strictEqual(row.seat, 'librarian');
  assert.strictEqual(row.seatFrom, null);
  assert.ok(!row.rulings.includes('SEAT-CORRECTED'));
});

test('a verified correction changes the seat AND leaves the commit body name standing', () => {
  const out = withCorrections([correction()]);
  const row = out.landed.find((r) => r.path === 'essay/READ.md');
  assert.strictEqual(row.seat, 'chair', 'the corrected seat');
  assert.strictEqual(row.seatFrom, 'librarian', 'what the commit body said must survive');
  assert.ok(row.rulings.includes('SEAT-CORRECTED'), `expected SEAT-CORRECTED, got ${row.rulings}`);
  assert.strictEqual(out.counts.corrections_applied, 1);
  assert.strictEqual(out.counts.corrections_refused, 0);
});

test('MUTANT — a silent override is caught: both names must reach the rendered table', () => {
  // Make the correction replace rather than annotate and this test is the one that dies. A table
  // that quietly prints the right answer teaches nobody that the capture happened.
  const out = withCorrections([correction()]);
  const text = render(out, { color: false, command: 'test' });
  assert.ok(text.includes('librarian->chair'), 'table 1 must show both names on the row');
  assert.ok(text.includes('CORRECTIONS'), 'the correction must have its own section');
  assert.ok(text.includes('COMMIT SAID -> TRUE SEAT'));
  assert.ok(text.includes('pane BRAVO (L048)'), 'who corrected it');
  assert.ok(text.includes('2026-09-09T00:55:00-06:00'), 'when');
  assert.ok(text.includes('evidence bbbbbbb:essay/READ.md'), 'on what evidence');
  assert.ok(text.includes('SEAT: a bare Claude instance'), 'the evidence LINE, quoted');
});

test('MUTANT — a correction with no evidence referent is refused, not applied', () => {
  // The claimed seat is on no authorship line in the blob.
  const out = withCorrections([correction({ path: 'essay/A.html', sha: 'aaaaaaa' })]);
  const row = out.landed.find((r) => r.path === 'essay/A.html');
  assert.strictEqual(row.seatFrom, null, 'the row must be untouched');
  assert.ok(!row.rulings.includes('SEAT-CORRECTED'));
  assert.strictEqual(out.counts.corrections_applied, 0);
  assert.strictEqual(out.counts.corrections_refused, 1);
  assert.match(out.corrections.refused[0].reason, /NO-SEAT-IN-EVIDENCE/);
});

test('MUTANT — with no way to read the evidence, every correction is refused', () => {
  // Fail closed. A verified correction and an unverifiable one must never look the same.
  const out = reconcile(Object.assign({}, fixture(), { corrections: [correction()] }));
  assert.strictEqual(out.counts.corrections_applied, 0);
  assert.strictEqual(out.corrections.refused[0].reason, 'NO-EVIDENCE-READER');
});

test('MUTANT — a correction cannot reach a commit it does not name', () => {
  const wrongSha = withCorrections([correction({ sha: '9999999' })]);
  assert.strictEqual(wrongSha.corrections.refused[0].reason, 'NO-SUCH-COMMIT');
  // the right commit, but its diff does not contain that path
  const wrongPath = withCorrections([correction({ sha: 'aaaaaaa' })]);
  assert.strictEqual(wrongPath.corrections.refused[0].reason, 'PATH-NOT-IN-COMMIT');
  assert.strictEqual(wrongPath.counts.corrections_applied, 0);
});

test('a correction is a claim: without who, when and a seat it is refused', () => {
  for (const missing of ['by', 'at', 'seat']) {
    const out = withCorrections([correction({ [missing]: '' })]);
    assert.strictEqual(out.counts.corrections_applied, 0, `${missing} must be required`);
    assert.strictEqual(out.corrections.refused[0].reason, `MISSING-FIELD: ${missing}`);
  }
});

test('the seat must match as a whole word, not as a substring', () => {
  const v = verifyCorrection(correction(), {
    commits: fixture().commits,
    readBlob: () => 'written by the chairman of nothing in particular',
  });
  assert.strictEqual(v.ok, false);
  assert.match(v.reason, /NO-SEAT-IN-EVIDENCE/);
});

test('evidence in another file must NAME the path it corrects', () => {
  // The two prompt files in the live case carry no header of their own; each draft's header names
  // its prompt. That naming is the join, and without it the evidence is about a different file.
  const f = fixture();
  f.commits = f.commits.map((c) => (c.sha === 'bbbbbbb'
    ? Object.assign({}, c, { paths: ['essay/READ.md', 'essay/PROMPT.txt'] }) : c));
  const ok = withCorrections([correction({ path: 'essay/PROMPT.txt', evidence: 'essay/READ.md' })], f);
  const row = ok.landed.find((r) => r.path === 'essay/PROMPT.txt');
  assert.strictEqual(row.seat, 'chair');
  assert.strictEqual(row.seatFrom, 'librarian');

  const renamed = Object.assign({}, BLOBS, {
    'essay/READ.md': HEADER_B.replace('essay/PROMPT.txt', 'essay/OTHER.txt'),
  });
  const bad = reconcile(Object.assign({}, f, {
    corrections: [correction({ path: 'essay/PROMPT.txt', evidence: 'essay/READ.md' })],
    readBlob: (sha, file) => (renamed[file] || null),
  }));
  assert.strictEqual(bad.counts.corrections_applied, 0);
  assert.match(bad.corrections.refused[0].reason, /EVIDENCE-DOES-NOT-NAME-PATH/);
});

test('the first verified correction stands; a later one over the same artifact is refused', () => {
  // Otherwise the ledger is last-writer-wins, which is the whole thing the referent rule is for.
  const out = withCorrections([correction(), correction({ by: 'someone else' })]);
  const row = out.landed.find((r) => r.path === 'essay/READ.md');
  assert.strictEqual(row.corrected.by, 'pane BRAVO (L048)');
  assert.strictEqual(out.counts.corrections_applied, 1);
  assert.match(out.corrections.refused[0].reason, /CONFLICTING/);
});

test('the key is the commit full sha, so an abbreviation cannot double-correct', () => {
  const f = fixture();
  const long = f.commits.find((c) => c.sha === 'bbbbbbb').full;
  const out = withCorrections([correction(), correction({ sha: long })], f);
  assert.strictEqual(out.counts.corrections_applied, 1);
  assert.match(out.corrections.refused[0].reason, /CONFLICTING/);
  assert.strictEqual(correctionKey(long, 'essay/READ.md'), correctionKey(long, 'essay/READ.md'));
});

test('a refused correction is printed, never dropped', () => {
  const out = withCorrections([correction({ sha: '9999999' })]);
  const text = render(out, { color: false, command: 'test' });
  assert.ok(text.includes('REFUSED: NO-SUCH-COMMIT'), 'the refusal has to be visible in the table');
});

test('a correction that verifies but reaches no row is counted, not assumed away', () => {
  // essay/METHOD.md is in a commit paths list and produces no artifact row.
  const out = reconcile(Object.assign({}, fixture(), {
    corrections: [correction({ sha: 'aaaaaaa', path: 'essay/METHOD.md' })],
    readBlob: () => HEADER_B,
  }));
  assert.strictEqual(out.counts.corrections_applied, 0);
  assert.strictEqual(out.counts.corrections_verified_unused, 1);
  assert.strictEqual(out.corrections.verifiedUnused.length, 1);
});

test('the corrections ledger skips comments and survives a malformed row', () => {
  const os2 = require('os');
  const fs3 = require('fs');
  const path3 = require('path');
  const dir = fs3.mkdtempSync(path3.join(os2.tmpdir(), 'prov-'));
  const file = path3.join(dir, 'c.jsonl');
  fs3.writeFileSync(file, ['# a comment', '', JSON.stringify(correction()), 'not json at all'].join('\n'));
  const got = readCorrections(file);
  assert.strictEqual(got.lines, 2, 'comments and blanks are not rows');
  assert.strictEqual(got.rows.length, 2);
  const out = withCorrections(got.rows);
  assert.strictEqual(out.counts.corrections_applied, 1);
  assert.match(out.corrections.refused[0].reason, /MALFORMED-ROW/);
});

/* ── THE MISSING-ROW HALF ─────────────────────────────────────────────────────────────────────
 *
 * The chair's premise for this packet was that the failure has two shapes — a WRONG row in one
 * table and a MISSING row in another. Measured against the live record it has one: the four
 * captured files were rows under the librarian's name at yesterday's HEAD exactly as they are
 * today (`git log 14cc0ad --name-only -- essay/` lists all four under babe926). This test makes
 * that a property of the instrument rather than an observation about one night: every artifact
 * path a commit carries gets exactly one row, corrections or no corrections. If a later change
 * ever drops one, this is where it dies.
 */
test('every artifact path a commit carries produces exactly one row', () => {
  const f = fixture();
  for (const rows of [[], [correction()]]) {
    const out = reconcile(Object.assign({}, f, { corrections: rows, readBlob }));
    for (const c of f.commits) {
      const artifacts = c.paths.filter((p) => p !== 'essay/METHOD.md');
      const got = out.landed.filter((r) => r.sha === c.sha);
      const expected = artifacts.length || 1;   // a METHOD-only commit still prints one row
      assert.strictEqual(got.length, expected, `${c.sha}: ${got.length} rows for ${expected} paths`);
      for (const a of artifacts) {
        assert.strictEqual(got.filter((r) => r.path === a).length, 1, `${a} must appear once`);
      }
    }
  }
});

test('the evidence reader reads the COMMITTED blob, never the working tree', () => {
  // The single mutation that would undo this whole mechanism is a reader that reads the file as it
  // stands today: a motivated seat could then write any header it liked and point a correction at
  // it. Tested against a real repository — created here, not the room's — because the property is
  // about git, and a mock of git would only prove the mock.
  const fs4 = require('fs');
  const os4 = require('os');
  const path4 = require('path');
  const { execFileSync } = require('child_process');
  const { gitBlobReader } = require('./essay-provenance.js');

  const dir = fs4.mkdtempSync(path4.join(os4.tmpdir(), 'prov-git-'));
  const git = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' });
  git('init', '-q');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'test');
  fs4.writeFileSync(path4.join(dir, 'a.md'), 'SEAT: written by the chair\n');
  git('add', 'a.md');
  git('commit', '-q', '-m', 'first');
  const sha = git('rev-parse', 'HEAD').trim();

  // now somebody rewrites the header in the working tree, which is the attack
  fs4.writeFileSync(path4.join(dir, 'a.md'), 'SEAT: written by the librarian\n');

  const read = gitBlobReader(dir);
  assert.match(read(sha, 'a.md'), /chair/, 'the frozen blob is what must come back');
  assert.doesNotMatch(read(sha, 'a.md'), /librarian/, 'the working tree must not be read');
  assert.strictEqual(read(sha, 'nope.md'), null, 'a missing path returns null, never a throw');
});
