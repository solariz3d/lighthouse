/* second-vantage.history.test.js — second-vantage's WORLD-MOVED guard, proved on a repository this test builds.
 *
 * WHY THIS FILE EXISTS (D273 lap 3, the consumer refresh). Two rows of second-vantage.test.js ask "heads differ" questions against THIS repo and
 * take `HEAD~1` as the claim-time commit ("repo has a parent commit to pin"). A consumer is generated as ONE fresh commit by design (no history
 * surgery, no inherited record), so there is no parent to pin and those two rows are declared WORKSHOP-bound there. The guard they prove is
 * product: a DISAGREE only surfaces if it also holds in the tree the claim was made against, and a claim-time tree that cannot be rebuilt
 * withholds the finding. This file proves that on a two-commit throwaway repo whose files differ between the commits, so the claim-time reader
 * is shown to be reading the OLD tree, not just a different directory. The spawner is a mock (as in the original); the git worktree is real.
 *
 *   1  heads differ, the reader AGREEs in the claim-time tree: WORLD-MOVED, nothing surfaces, the tree it read was the OLD commit's
 *   2  heads differ, DISAGREE in both trees: SURFACE
 *   3  the claim-time head is not in this repository (a consumer's first day: a row from another history): the DISAGREE is WITHHELD, never surfaced
 *   4  heads equal: no world check, a clean DISAGREE surfaces
 *   5  the claim-time worktree is removed afterwards
 *
 * Run: node consonance/tools/second-vantage.history.test.js
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sv = require('./second-vantage.js');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sv-hist-'));
test.after(() => { try { fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }); } catch (e) { /* a temp folder Windows is still holding is not a failure of the guard */ } });
const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim();
git('init', '-q'); git('config', 'user.email', 't@t'); git('config', 'user.name', 't');
fs.writeFileSync(path.join(root, 'value.txt'), 'old\n'); git('add', '-A'); git('commit', '-q', '-m', 'claim time');
const OLD = git('rev-parse', 'HEAD');
fs.writeFileSync(path.join(root, 'value.txt'), 'new\n'); git('add', '-A'); git('commit', '-q', '-m', 'the world moved');
const NEW = git('rev-parse', 'HEAD');

const ROW = {
  ts: '2026-08-15T17:00:00.000Z', session: 'abc12345', pane: 'main',
  turn_ts: '2026-08-15T16:59:58.000Z', values: ['count'], sourced: false, tools: 2,
  sentences: ['value.txt says old'], wrote: ['x.md'], read: ['value.txt'], head: OLD,
};
const disagree = (cmds, ev) => ({ failed: false, raw: `VERDICT: DISAGREE\nCOMMANDS:\n${cmds.join('\n')}\nEVIDENCE: ${ev}` });
const agree = (ev) => ({ failed: false, raw: `VERDICT: AGREE\nCOMMANDS:\nread value.txt\nEVIDENCE: ${ev}` });
const norm = (p) => path.resolve(p).toLowerCase();

test('1: heads differ and the claim-time reader AGREEs: WORLD-MOVED, nothing surfaces, and that reader was handed the OLD commit\'s tree', () => {
  const seen = [];
  const f = sv.processRow(ROW, 'artifact', root, (briefText, r) => {
    const content = fs.readFileSync(path.join(r, 'value.txt'), 'utf8').trim();
    seen.push({ root: r, content });
    return norm(r) === norm(root) ? disagree(['cat value.txt → ' + content], 'it says ' + content) : agree('then it said ' + content);
  });
  assert.strictEqual(f.status, 'WORLD-MOVED'); assert.strictEqual(f.surface, false);
  assert.strictEqual(f.world.checked, true); assert.strictEqual(f.world.claimHead, OLD); assert.strictEqual(f.world.currentHead, NEW);
  assert.strictEqual(seen.length, 2, 'the current-tree reader, then the claim-time reader');
  assert.strictEqual(seen[0].content, 'new', 'the first reader saw the current tree');
  assert.notStrictEqual(norm(seen[1].root), norm(root), 'the second reader ran somewhere else');
  assert.strictEqual(seen[1].content, 'old', 'and what it read there was the claim-time commit, not the current tree');
});

test('2: heads differ and the reader DISAGREEs in BOTH trees: it surfaces', () => {
  const f = sv.processRow(ROW, 'artifact', root, () => disagree(['cat value.txt → whatever'], 'wrong in both worlds'));
  assert.strictEqual(f.status, 'SURFACE'); assert.strictEqual(f.surface, true);
  assert.strictEqual(f.world.checked, true); assert.strictEqual(f.world.moved, false);
  assert.strictEqual(f.caveat, sv.F0_CITATION, 'the dual-denominator caveat rides the row');
});

test('3: a claim-time head this repository does not have: the DISAGREE is withheld, never surfaced', () => {
  const row = { ...ROW, head: 'deadbeef'.repeat(5) };
  const f = sv.processRow(row, 'artifact', root, () => disagree(['cat value.txt → x'], 'differs'));
  assert.strictEqual(f.surface, false, 'a finding whose claim-time world cannot be rebuilt must not surface');
  assert.strictEqual(f.status, 'WORLD-MOVED');
  assert.strictEqual(f.world.checked, false); assert.match(f.world.note, /claim-time tree unavailable; DISAGREE withheld/);
});

test('4: heads equal: no world check runs and a clean DISAGREE surfaces', () => {
  let calls = 0;
  const f = sv.processRow({ ...ROW, head: NEW }, 'artifact', root, () => { calls++; return disagree(['cat value.txt → 1'], 'count is 1'); });
  assert.strictEqual(calls, 1, 'one reader, no claim-time re-run');
  assert.strictEqual(f.status, 'SURFACE'); assert.strictEqual(f.world.checked, false);
});

test('5: the claim-time worktree is removed afterwards, whatever the verdict', () => {
  const before = git('worktree', 'list').split('\n').length;
  let made = 0;   // the world check really built a worktree each time (a reader that ran somewhere other than the repo root)
  const spawner = (briefText, r) => { if (norm(r) !== norm(root)) made++; return disagree(['cat value.txt → x'], 'differs'); };
  sv.processRow(ROW, 'artifact', root, spawner);
  sv.processRow(ROW, 'artifact', root, (b, r) => (norm(r) === norm(root) ? disagree(['cat value.txt → x'], 'differs') : (made++, agree('same'))));
  assert.strictEqual(made, 2, 'both runs built a claim-time worktree');
  assert.strictEqual(git('worktree', 'list').split('\n').length, before, 'no worktree left registered');
});
