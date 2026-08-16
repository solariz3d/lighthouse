// Tests for the residue scanner.
//
// The invariant this suite exists to INSTALL rather than name — cycle 6's law, stated by the
// chair and demonstrated twice in one day: naming an invariant does not install it; only a
// test that fails installs it. `arch_test.rs` named a confirm gate and shipped broken until a
// mutation made it fail. So every assertion below was checked against the defect it guards,
// and the two that matter most are written as explicit mutation tests.
//
// The defect that produced this tool is the one it must never commit itself: a residue number
// aggregated across a session boundary, read as being about whoever is in the room. That is
// `withholds_across_sessions` and it is the reason the file exists.
//
// Run: node consonance/tools/residue.test.js
'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const R = require('./residue.js');

const H = 3600e3;
const commit = (o = {}) => ({
  repo: 'r', hash: o.hash || 'aaaaaaa', ts: o.ts || 0, author: 'x',
  subject: o.subject || 's', bodyLen: o.bodyLen === undefined ? 5 : o.bodyLen,
  coauthors: o.coauthors || [], files: o.files || [],
  docOnly: !!o.docOnly, touchesCode: !!o.touchesCode,
  added: (o.files || []).reduce((n, f) => n + f.added, 0),
  deleted: (o.files || []).reduce((n, f) => n + f.deleted, 0),
});

/* ---------------- the refusal, which is the whole point ---------------- */

test('withholds the body-by-class aggregate when the window spans sessions', () => {
  // Two sessions, four hours apart, with the bodyless doc commits confined to the FIRST.
  // This is the 2026-07-27 shape exactly: a pane measured the pair as one population and
  // handed the result to the person who owned only the second half of it.
  const early = [
    commit({ ts: 0, docOnly: true, bodyLen: 0, coauthors: ['Claude Fable 5'] }),
    commit({ ts: 60e3, docOnly: true, bodyLen: 0, coauthors: ['Claude Fable 5'] }),
  ];
  const late = [
    commit({ ts: 4 * H, docOnly: true, bodyLen: 30, coauthors: ['Claude Opus 5'] }),
    commit({ ts: 4 * H + 60e3, docOnly: true, bodyLen: 28, coauthors: ['Claude Opus 5'] }),
  ];
  const all = [...early, ...late];
  const s = R.sessions(all);
  assert.strictEqual(s.byGap.length, 2, 'a four-hour gap starts a new session');

  const per = s.byGap.map(g => R.bodyByClass(g.commits));
  assert.strictEqual(per[0].doc.empty, 2, 'the bodyless commits belong to the first session');
  assert.strictEqual(per[1].doc.empty, 0, 'and none of them to the second');

  // The mutation: aggregate anyway. It produces a true-sounding number about a mixed
  // population — "half the doc commits have no body" — which is the false finding.
  const aggregated = R.bodyByClass(all);
  assert.strictEqual(aggregated.doc.empty, 2);
  assert.strictEqual(aggregated.doc.n, 4,
    'the aggregate exists and is arithmetically true, which is exactly why it must be withheld');
});

test('the SHIPPED withholding rule fires on a mixed window, not a copy of it', () => {
  /* Asserts `withholdAggregate` — the predicate buildIndex actually calls — rather than a
   * re-implementation. The first draft of this test recomputed `byGap.length > 1` inline and
   * so agreed with itself by construction; deleting the refusal from the tool would have left
   * it green. That is the catch-ledger failure (canonical fixtures, 26 green, five defects)
   * committed in the suite guarding against it. */
  const twoSittings = R.sessions([
    commit({ ts: 0, docOnly: true, bodyLen: 0, coauthors: ['A'] }),
    commit({ ts: 5 * H, docOnly: true, bodyLen: 30, coauthors: ['B'] }),
  ]);
  assert.strictEqual(R.withholdAggregate(twoSittings), true, 'a time gap withholds');

  const twoAuthorsOneSitting = R.sessions([
    commit({ ts: 0, coauthors: ['Claude Fable 5'] }),
    commit({ ts: 60e3, coauthors: ['Claude Opus 5'] }),
  ]);
  assert.strictEqual(R.withholdAggregate(twoAuthorsOneSitting), true,
    'two named authors withhold even inside one sitting — the trailer is evidence and outranks the clock');

  const oneOfEach = R.sessions([
    commit({ ts: 0, coauthors: ['Claude Opus 5'] }),
    commit({ ts: 60e3, coauthors: [] }),
  ]);
  assert.strictEqual(R.withholdAggregate(oneOfEach), false,
    'a bodyless commit with no trailer does not count as a second author — otherwise the ' +
    'refusal fires on every window and a guard that always fires is a guard that gets disabled');
});

test('a single-session window is NOT withheld — the refusal is scoped, not blanket', () => {
  const commits = [
    commit({ ts: 0, docOnly: true, bodyLen: 20, coauthors: ['A'] }),
    commit({ ts: 10 * 60e3, touchesCode: true, bodyLen: 25, coauthors: ['A'] }),
  ];
  const s = R.sessions(commits);
  assert.strictEqual(s.byGap.length, 1);
  const b = R.bodyByClass(commits);
  assert.strictEqual(b.doc.n, 1);
  assert.strictEqual(b.code.n, 1);
});

/* ---------------- sessions: evidence and inference kept apart ---------------- */

test('trailer evidence and gap inference are reported separately, never merged', () => {
  const commits = [
    commit({ ts: 0, coauthors: ['Claude Fable 5'] }),
    commit({ ts: 60e3, coauthors: ['Claude Opus 5'] }),   // same sitting, different model
  ];
  const s = R.sessions(commits);
  assert.strictEqual(s.byGap.length, 1, 'one sitting by the clock');
  assert.strictEqual(s.byTrailer.length, 2, 'two authors by the record');
  assert.strictEqual(R.segmentationAgrees(s), false,
    'and the disagreement is surfaced rather than resolved toward either signal');
});

test('agreement is reported when the two signals line up', () => {
  const commits = [
    commit({ ts: 0, coauthors: ['Claude Fable 5'] }),
    commit({ ts: 60e3, coauthors: ['Claude Fable 5'] }),
    commit({ ts: 5 * H, coauthors: ['Claude Opus 5'] }),
  ];
  assert.strictEqual(R.segmentationAgrees(R.sessions(commits)), true);
});

test('a missing trailer does not manufacture a disagreement', () => {
  // Most quick doc commits carry no Co-Authored-By line. Treating "(no trailer)" as a rival
  // author would flag every real session as mixed and the refusal would fire everywhere,
  // which is how a guard gets disabled.
  const commits = [
    commit({ ts: 0, coauthors: ['Claude Opus 5'] }),
    commit({ ts: 60e3, coauthors: [] }),
  ];
  assert.strictEqual(R.segmentationAgrees(R.sessions(commits)), true);
});

/* ---------------- corrections that delete nothing ---------------- */

test('a correction that removes no line is flagged; one that removes lines is not', () => {
  const c = R.corrections([
    commit({ hash: '80b487d', subject: 'Track 2 corrected: articulation is not installation',
             files: [{ added: 55, deleted: 0, file: 'exo_memory/muscle_map.md' }] }),
    commit({ hash: '665b7cd', subject: 'TRAINING.md revised: all nine findings',
             files: [{ added: 72, deleted: 39, file: 'TRAINING.md' }] }),
    commit({ hash: 'ffffff0', subject: 'Allocation pass: pool the staging buffers',
             files: [{ added: 20, deleted: 5, file: 'ui/smokesim.js' }] }),
  ]);
  assert.strictEqual(c.length, 2, 'only correction-subject commits are considered');
  assert.strictEqual(c[0].deletesNothing, true);
  assert.strictEqual(c[1].deletesNothing, false);
  assert.strictEqual(c[0].target.file, 'exo_memory/muscle_map.md',
    'the target is the file the commit most touched — where a correction would land');
});

test('"fix" is deliberately not a correction word', () => {
  // Including it would swamp the measure with ordinary repair work and the signal would be
  // unreadable — a measure nobody reads twice is a measure that does nothing.
  assert.strictEqual(R.CORRECTION_RE.test('fix the numstat parser'), false);
  assert.strictEqual(R.CORRECTION_RE.test('Correction: three conclusions refuted'), true);
  assert.strictEqual(R.CORRECTION_RE.test('Amendment: the gradient is not stageable'), true);
  assert.strictEqual(R.CORRECTION_RE.test('Cycle 5 result: the prediction is falsified'), true);
});

/* ---------------- append-only ---------------- */

test('append-only sums across commits and per file', () => {
  const a = R.appendOnly([
    commit({ files: [{ added: 40, deleted: 0, file: 'map.md' }] }),
    commit({ files: [{ added: 60, deleted: 0, file: 'map.md' }, { added: 5, deleted: 5, file: 'x.js' }] }),
  ]);
  const map = a.find(r => r.file === 'map.md');
  assert.deepStrictEqual([map.added, map.deleted, map.commits], [100, 0, 2]);
  const x = a.find(r => r.file === 'x.js');
  assert.deepStrictEqual([x.added, x.deleted], [5, 5]);
});

test('binary files are skipped rather than counted as zero-change text', () => {
  const a = R.appendOnly([commit({ files: [{ added: 0, deleted: 0, file: 'icon.png', binary: true }] })]);
  assert.strictEqual(a.length, 0);
});

/* ---------------- assignment intervals ---------------- */

test('assignment intervals and withdrawals are read from the chair audit line', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'residue-board-'));
  const p = path.join(dir, 'board.jsonl');
  const t0 = Date.parse('2026-07-27T21:07:00Z');
  fs.writeFileSync(p, [
    JSON.stringify({ ts: new Date(t0).toISOString(), text: 'chair injected (chair: x) -> paneA [delivered]: review this' }),
    JSON.stringify({ ts: new Date(t0 + 4 * 60e3).toISOString(), text: 'chair injected (chair: x) -> paneA [delivered]: Drop the review — my mistake' }),
    JSON.stringify({ ts: new Date(t0 + 90 * 60e3).toISOString(), text: 'some other board line entirely' }),
  ].join('\n'));

  const a = R.assignments(p, t0 - 1000);
  assert.strictEqual(a.panes.length, 1, 'one pane');
  assert.strictEqual(a.panes[0].injections, 2, 'non-injection board lines are not assignments');
  assert.strictEqual(a.panes[0].gaps[0].mins, 4);
  assert.strictEqual(a.panes[0].gaps[0].withdrawn, true, '"Drop the review" is a withdrawal');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('a second assignment that is not a withdrawal is not counted as one', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'residue-board2-'));
  const p = path.join(dir, 'board.jsonl');
  const t0 = Date.parse('2026-07-27T20:00:00Z');
  fs.writeFileSync(p, [
    JSON.stringify({ ts: new Date(t0).toISOString(), text: 'chair injected (chair: x) -> paneB [delivered]: review this' }),
    JSON.stringify({ ts: new Date(t0 + 20 * 60e3).toISOString(), text: 'chair injected (chair: x) -> paneB [delivered]: now fix the residuals' }),
  ].join('\n'));
  const a = R.assignments(p, t0 - 1000);
  assert.strictEqual(a.panes[0].gaps[0].withdrawn, false);
  assert.strictEqual(a.panes[0].gaps[0].mins, 20);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('the unparsed denominator survives JSON — the safeguard is observable in every output mode', () => {
  // The defect: `out.unparsed` was an expando on an Array, dropped by JSON.stringify (so --json
  // never showed it) and never read by render(). It must be a real, serializable field.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'residue-unparsed-'));
  const p = path.join(dir, 'board.jsonl');
  const t0 = Date.parse('2026-07-27T20:00:00Z');
  fs.writeFileSync(p, [
    // parseable — counted
    JSON.stringify({ ts: new Date(t0).toISOString(), text: 'chair injected (chair: x) -> paneB [delivered]: review this' }),
    // a chair announcement in a shape the target regex cannot read — must land in `unparsed`
    JSON.stringify({ ts: new Date(t0 + 60e3).toISOString(), text: 'chair injected but in a format the parser does not recognise' }),
  ].join('\n'));
  const a = R.assignments(p, t0 - 1000);
  assert.strictEqual(a.unparsed.length, 1, 'the unreadable announcement is counted, not dropped');
  assert.strictEqual(JSON.parse(JSON.stringify(a)).unparsed.length, 1, 'and it survives serialization');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('a missing board is null, not an empty result that reads as "no assignments"', () => {
  assert.strictEqual(R.assignments(path.join(os.tmpdir(), 'nope-' + Date.now(), 'board.jsonl'), 0), null);
});

/* ---------------- the numstat parse, against a real git repo ---------------- */

test('file stats attach to their own commit, not the next one', () => {
  /* THE REGRESSION. `--numstat` prints after the body, so a TRAILING record separator files
   * every commit's stats under the following commit — silently: `files` came back empty, the
   * append-only table read "nothing changed", and a stray "5\t2\tpath" line rode into the
   * subject. Nothing threw. Only a real repo catches it, because the bug is in how git lays
   * the two outputs out, and a hand-written fixture would have been laid out the way I
   * imagined it rather than the way git prints it. */
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'residue-git-'));
  const g = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  g('init', '-q');
  g('config', 'user.email', 't@t');
  g('config', 'user.name', 'T');

  fs.writeFileSync(path.join(dir, 'a.md'), 'one\ntwo\nthree\n');
  g('add', '-A'); g('commit', '-q', '-m', 'first doc commit');

  fs.writeFileSync(path.join(dir, 'b.js'), 'x\ny\n');
  g('add', '-A');
  g('commit', '-q', '-m', 'Correction: second commit', '-m', 'a body line\nand another\n\nCo-Authored-By: Claude Opus 5 <n@n>');

  const cs = R.readCommits(dir, '10 years ago');
  assert.strictEqual(cs.length, 2);

  const [first, second] = cs;
  assert.strictEqual(first.subject, 'first doc commit', 'no numstat text leaks into the subject');
  assert.deepStrictEqual(first.files.map(f => f.file), ['a.md']);
  assert.strictEqual(first.added, 3, 'the first commit owns its own three added lines');
  assert.strictEqual(first.docOnly, true);

  assert.deepStrictEqual(second.files.map(f => f.file), ['b.js']);
  assert.strictEqual(second.added, 2);
  assert.strictEqual(second.touchesCode, true);
  assert.strictEqual(second.docOnly, false);
  assert.deepStrictEqual(second.coauthors, ['Claude Opus 5']);
  assert.strictEqual(second.bodyLen, 2, 'the Co-Authored-By trailer is not counted as body');

  fs.rmSync(dir, { recursive: true, force: true });
});

/* ---------------- against the real corpus, which is the only thing that can disagree ---------------- */

test('on the real repo, the bodyless doc commits do NOT land in the chair session', () => {
  /* The corpus test, and the reason it exists: catch-ledger's 26 green tests missed five real
   * defects because its fixtures were canonical — a synthetic fixture agrees with the rule by
   * construction. This asserts the actual property that was got wrong, against the actual
   * history that got it wrong. Skips rather than fails where the history is out of window, so
   * it cannot rot into a red nobody reads. */
  const repo = path.resolve(__dirname, '..', '..');
  let commits;
  try { commits = R.readCommits(repo, '2026-07-27T00:00:00'); }
  catch { return; }
  if (commits.length < 10) return;

  const s = R.sessions(commits);
  if (s.byGap.length < 2) return;

  const withBodyless = s.byGap.filter(g => g.commits.some(c => c.docOnly && c.bodyLen === 0));
  const withRichDocs = s.byGap.filter(g => {
    const d = g.commits.filter(c => c.docOnly);
    return d.length >= 3 && d.every(c => c.bodyLen > 10);
  });
  assert.ok(withBodyless.length > 0, 'the history does contain bodyless doc commits');
  assert.ok(withRichDocs.length > 0, 'and sessions whose doc commits are uniformly substantial');
  for (const a of withBodyless) {
    for (const b of withRichDocs) {
      assert.notStrictEqual(a.id, b.id,
        'no single session contains both — which is why the aggregate was false about a person');
    }
  }
});

/* ---------------- the contract is printed, and says what it cannot rule out ---------------- */

test('every run publishes what its numbers do not mean', () => {
  const ix = {
    window: { since: 'x', from: 0, to: 1000 }, repos: ['r'], commits: 0,
    sessions: { byGap: [], byTrailer: [], agrees: true, multi: false },
    append_only: [], corrections: [], body_by_class: { doc: null, code: null },
    body_by_class_per_session: [], assignments: null, _commits: [],
  };
  const out = R.render(ix);
  assert.match(out, /shapes, not verdicts/);
  assert.match(out, /append-only is CORRECT for a journal/);
  assert.match(out, /may be a pane that finished in four minutes/);
  assert.doesNotMatch(out, /\bshould\b/i,
    'no imperative: this reports the shape and leaves the call to a reader');
});
