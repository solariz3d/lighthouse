/* Tests for replay-check.js. The pure core first, then the CLI end-to-end on a fixture, because
 * the whole instrument is an arithmetic claim about two files and the claim is worth nothing if
 * it cannot be made to fail.
 *
 * HONEST ORDER: these were written AFTER the tool, not red-first. So the suite was scored by
 * mutation instead — three deliberate breaks in replay-check.js, all three killed:
 *   bound() without the shrink guard (plain delta)            -> 1 failure
 *   splitAdded() counting every added row as transcript-sourced -> 3 failures
 *   verdict() hardcoded to pass (the bound read off the same file) -> 3 failures
 * Re-run that by patching those three lines back in; a suite that survives any of them is not
 * measuring what this header says it measures. */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { countLines, bound, splitAdded, verdict, transcripts } = require('./replay-check.js');

const TOOL = path.join(__dirname, 'replay-check.js');
const snap = (lines) => ({ path: 'x', bytes: lines * 10, lines });

test('countLines counts complete lines and ignores a torn tail', () => {
  assert.strictEqual(countLines(Buffer.from('a\nb\n')), 2);
  assert.strictEqual(countLines(Buffer.from('a\nb')), 1, 'a half-written line is not a line yet');
  assert.strictEqual(countLines(Buffer.alloc(0)), 0);
});

test('the bound is new transcript lines: a grown pane contributes its delta', () => {
  assert.strictEqual(bound({ p: snap(100) }, { p: snap(112) }).total, 12);
});

test('a pane that appeared after the mark contributes all of its lines', () => {
  assert.strictEqual(bound({}, { fresh: snap(40) }).total, 40);
});

test('a pane whose transcript SHRANK contributes all of its lines, not a negative delta', () => {
  // resume_offset's len<offset arm entitles the tailer to re-read a shrunk file from the top,
  // so the bound must allow it. A delta here would go negative and quietly finance replay
  // somewhere else in the sum — the arithmetic sign error this case exists to prevent.
  const b = bound({ p: snap(100) }, { p: snap(30) });
  assert.strictEqual(b.total, 30);
  assert.ok(b.total >= 0);
});

test('rows are split by whether a transcript on this machine can account for them', () => {
  const tail = [
    JSON.stringify({ pane: 'sid-a', role: 'user', text: 'x' }),
    JSON.stringify({ pane: 'sid-a', role: 'assistant', text: 'y' }),
    JSON.stringify({ pane: 'backfill', role: 'committee', text: 'ONE TIME' }),
    'not json at all',
  ].join('\n');
  const s = splitAdded(tail, new Set(['sid-a']));
  assert.deepStrictEqual(s, { fromTranscripts: 2, other: 1, unparsed: 1 });
});

test('the backfill announcement is never judged as replay — it is not a transcript row', () => {
  // It is one row per launch and it comes from nowhere a transcript can vouch for. Counting it
  // against the bound would make a clean relaunch fail by exactly one, and a bar that cries
  // wolf on the honest case is a bar nobody keeps.
  const only = JSON.stringify({ pane: 'backfill', role: 'committee', text: 'x' });
  assert.strictEqual(splitAdded(only, new Set(['sid-a'])).fromTranscripts, 0);
});

test('verdict passes at the bound and fails one row past it', () => {
  assert.ok(verdict(12, 12).pass);
  assert.ok(!verdict(13, 12).pass);
  assert.strictEqual(verdict(13, 12).excess, 1);
});

test('MUTANT: a bound taken from the board itself passes every replay, and this one does not', () => {
  // The failure the tool exists to prevent. Tonight's real shape: an 8,030-row full re-read on
  // a launch where the transcripts had grown by 12 lines.
  const added = 8030, transcriptLines = 12;
  assert.ok(verdict(added, added).pass, 'the mutant scorer — bound read off the same file — passes');
  assert.ok(!verdict(added, transcriptLines).pass, 'the real bound must fail it');
  assert.strictEqual(verdict(added, transcriptLines).excess, 8018);
});

/* ---- the CLI, on a fixture, because the pure core can be right while the wiring is not ---- */

function fixture(tag) {
  const root = path.join(os.tmpdir(), `replay-check-${tag}-${process.pid}`);
  fs.rmSync(root, { recursive: true, force: true });
  const proj = path.join(root, 'projects', 'C--fixture');
  fs.mkdirSync(proj, { recursive: true });
  const board = path.join(root, 'board.jsonl');
  const row = (pane, text) => JSON.stringify({ pane, role: 'assistant', text, ts: 1 }) + '\n';
  const turn = (t) => JSON.stringify({ type: 'assistant', message: { content: t } }) + '\n';
  fs.writeFileSync(path.join(proj, 'sid-a.jsonl'), turn('one') + turn('two') + turn('three'));
  fs.writeFileSync(board, row('sid-a', 'one') + row('sid-a', 'two') + row('sid-a', 'three'));
  return {
    root, board, proj, row, turn,
    env: {
      ...process.env,
      CONSONANCE_BOARD: board,
      CONSONANCE_MARK: undefined,
      CONSONANCE_REPLAY_MARK: path.join(root, 'mark.json'),
      CONSONANCE_PROJECTS: path.join(root, 'projects'),
    },
  };
}

function run(f, mode) {
  try {
    return { code: 0, out: execFileSync(process.execPath, [TOOL, mode], { env: f.env, encoding: 'utf8' }) };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}

test('CLI: an honest relaunch — three new transcript lines, three new rows — PASSES', () => {
  const f = fixture('honest');
  assert.strictEqual(run(f, '--mark').code, 0);
  fs.appendFileSync(path.join(f.proj, 'sid-a.jsonl'), f.turn('four') + f.turn('five'));
  fs.appendFileSync(f.board, f.row('backfill', 'ONE TIME') + f.row('sid-a', 'four') + f.row('sid-a', 'five'));
  const r = run(f, '--score');
  assert.strictEqual(r.code, 0, r.out);
  assert.match(r.out, /PASS/);
  assert.match(r.out, /rows added, everything else\s*:\s*1/, 'the backfill row is reported, not judged');
  fs.rmSync(f.root, { recursive: true, force: true });
});

test('CLI: a relaunch that re-reads the transcript from the top FAILS, naming the excess', () => {
  const f = fixture('replay');
  assert.strictEqual(run(f, '--mark').code, 0);
  fs.appendFileSync(path.join(f.proj, 'sid-a.jsonl'), f.turn('four'));
  // The whole transcript pushed again, which is what offset 0 does.
  fs.appendFileSync(f.board,
    f.row('sid-a', 'one') + f.row('sid-a', 'two') + f.row('sid-a', 'three') + f.row('sid-a', 'four'));
  const r = run(f, '--score');
  assert.strictEqual(r.code, 1, r.out);
  assert.match(r.out, /FAIL/);
  assert.match(r.out, /3 rows no transcript can account for/);
  fs.rmSync(f.root, { recursive: true, force: true });
});

test('CLI: it refuses to score across a compaction rather than reporting a number', () => {
  // B's packet compacts this file. A scorer that silently read a shorter board would compare
  // two different corpora and print something confident.
  const f = fixture('compacted');
  assert.strictEqual(run(f, '--mark').code, 0);
  fs.writeFileSync(f.board, '');
  const r = run(f, '--score');
  assert.strictEqual(r.code, 3, r.out);
  assert.match(r.out, /REFUSED/);
  fs.rmSync(f.root, { recursive: true, force: true });
});

test('transcripts() keys by session id, which is what the board calls a pane', () => {
  const f = fixture('keys');
  const t = transcripts(path.join(f.root, 'projects'));
  assert.deepStrictEqual(Object.keys(t), ['sid-a']);
  assert.strictEqual(t['sid-a'].lines, 3);
  fs.rmSync(f.root, { recursive: true, force: true });
});
