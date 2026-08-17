/* Tests for board-audit.js's pure core. Fixtures only — the real board.jsonl is 50MB and
 * this suite must stay cheap enough that js-suite runs it every time. */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const { parseBoard, markRepeats, markBackward, shareSnapshots } = require('./board-audit.js');

const row = (i, pane, role, text, ts) => ({ pane, role, text, ts, _i: i });

test('a replayed turn — identical triple at 0ms gap — is flagged; the original is not', () => {
  const rows = [
    row(0, 'A', 'user', 'yes', 1000),
    row(1, 'A', 'user', 'yes', 1000), // the replay: original transcript ts, so 0ms gap
  ];
  const rep = markRepeats(rows, 30_000);
  assert.deepStrictEqual(rep, [false, true]);
});

test('a genuine later repeat — same words, its own ts outside the window — survives', () => {
  // The keeper saying "yes" twice is two turns with two transcript timestamps. This is the
  // case that made persisting the dedup table cost nothing; it must never be flagged.
  const rows = [
    row(0, 'A', 'user', 'yes', 1000),
    row(1, 'A', 'user', 'yes', 1000 + 31_000),
  ];
  assert.deepStrictEqual(markRepeats(rows, 30_000), [false, false]);
});

test('a replay of a replay chains on the LATEST copy, so every landing counts', () => {
  const rows = [
    row(0, 'A', 'user', 'yes', 1000),
    row(1, 'A', 'user', 'yes', 1000),
    row(2, 'A', 'user', 'yes', 1000),
  ];
  assert.deepStrictEqual(markRepeats(rows, 30_000), [false, true, true]);
});

test('backward means strictly behind the running maximum; equal is not backward', () => {
  const rows = [row(0, 'A', 'u', 'a', 100), row(1, 'A', 'u', 'b', 300),
                row(2, 'A', 'u', 'c', 200), row(3, 'A', 'u', 'd', 300)];
  assert.deepStrictEqual(markBackward(rows), [false, false, true, false]);
});

test('raw counts the replays and clean does not — the trend inversion in miniature', () => {
  // Main pushes 2 real turns then a 2-row replay of itself; pane B pushes 2 real turns.
  // Raw share rises with the replay; clean share is what the room actually did.
  const rows = [
    row(0, 'M', 'u', 'm1', 100), row(1, 'B', 'u', 'b1', 200),
    row(2, 'M', 'u', 'm2', 300), row(3, 'B', 'u', 'b2', 400),
    row(4, 'M', 'u', 'm1', 100), row(5, 'M', 'u', 'm2', 300), // the replay burst
  ];
  const rep = markRepeats(rows, 30_000);
  const snaps = shareSnapshots(rows, rep, 'M', [4, 6]);
  assert.strictEqual(snaps.length, 2);
  assert.strictEqual(snaps[0].raw, 0.5, 'before the replay: 2 of 4');
  assert.strictEqual(snaps[0].clean, 0.5);
  assert.strictEqual(snaps[1].raw, 4 / 6, 'the replay inflates raw');
  assert.strictEqual(snaps[1].clean, 0.5, 'clean is unmoved by the replay');
  assert.strictEqual(snaps[1].cleanCorpus, 4);
});

test('a torn tail line parses to nothing rather than killing the audit', () => {
  const rows = parseBoard(['{"pane":"A","role":"u","text":"x","ts":1}', '{"pane":"A","ro']);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0]._i, 0);
});
