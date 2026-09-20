'use strict';
// ready.test.js — the ready stamp had NO test until D090, and the defect that earned it was silent:
// the librarian's stamp read ready:true, event:stop while that seat was mid-turn, carrying a
// session_id that was not its own (`exo_memory/librarian/2026-09-16.md`, the AUDIT entry, c34171c).
//
// The mechanism: the L2/L3 overseer hooks spawn a child `claude` that INHERITS the seat's
// environment, CONSONANCE_PANE and CONSONANCE_READY_DIR included. The child's own Stop hook then
// stamps the PARENT pane ready, in the middle of the parent's turn. The overseers already mark that
// child — `CLAUDE_OVERSEER_RUN: '1'` (`dev/shell/hooks/l3-overseer.js:142`, `l2-overseer.js:132`) —
// so the stamp can refuse to write under it.
//
// EVERY CASE HERE RUNS AGAINST A TEMP CONSONANCE_READY_DIR. Nothing in this file may touch the live
// directory: a test that writes a real stamp would tell Consonance a pane is idle, which is the
// defect it is written to catch.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { stamp } = require('./ready.js');

let pass = 0, fail = 0;
function check(name, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ready-test-'));
  const saved = { ...process.env };
  try {
    // A clean slate every case: the live variables must never decide a result here.
    for (const k of ['CONSONANCE_READY_DIR', 'CONSONANCE_PANE', 'CONSONANCE_DREAM', 'CLAUDE_OVERSEER_RUN']) delete process.env[k];
    fn(dir);
    pass++;
    console.log('  ok   ' + name);
  } catch (e) {
    fail++;
    console.log('  FAIL ' + name + '\n       ' + e.message);
  } finally {
    process.env = saved;
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
const wrote = (dir) => fs.readdirSync(dir);
const read = (dir, pane) => JSON.parse(fs.readFileSync(path.join(dir, pane + '.json'), 'utf8'));

console.log('ready stamp');

// THE DEFECT, red before the guard existed.
check('an overseer child writes nothing, though it carries the parent pane in its environment', (dir) => {
  process.env.CONSONANCE_READY_DIR = dir;
  process.env.CONSONANCE_PANE = 'parent-pane';
  process.env.CLAUDE_OVERSEER_RUN = '1';
  stamp(true, { session_id: 'the-child-session', cwd: 'C:/anywhere' });
  assert.deepStrictEqual(wrote(dir), [], 'the overseer child stamped the parent pane');
});

check('a real pane stamps ready true on stop', (dir) => {
  process.env.CONSONANCE_READY_DIR = dir;
  process.env.CONSONANCE_PANE = 'pane-1';
  stamp(true, { session_id: 's-1', cwd: 'C:/repo' });
  assert.deepStrictEqual(wrote(dir), ['pane-1.json'], 'no stamp was written');
  const s = read(dir, 'pane-1');
  assert.strictEqual(s.ready, true, 'ready');
  assert.strictEqual(s.event, 'stop', 'event');
  assert.strictEqual(s.pane, 'pane-1', 'pane');
  assert.strictEqual(s.session_id, 's-1', 'session_id');
});

check('a real pane stamps ready false on prompt', (dir) => {
  process.env.CONSONANCE_READY_DIR = dir;
  process.env.CONSONANCE_PANE = 'pane-2';
  stamp(false, { session_id: 's-2' });
  const s = read(dir, 'pane-2');
  assert.strictEqual(s.ready, false, 'ready');
  assert.strictEqual(s.event, 'prompt', 'event');
});

check('the dream guard still holds', (dir) => {
  process.env.CONSONANCE_READY_DIR = dir;
  process.env.CONSONANCE_PANE = 'pane-3';
  process.env.CONSONANCE_DREAM = '1';
  stamp(true, {});
  assert.deepStrictEqual(wrote(dir), [], 'the dreamer stamped');
});

check('a pane id that is not a plain id writes nothing', (dir) => {
  for (const bad of ['../escape', 'a/b', 'has space', '', 'x'.repeat(129)]) {
    process.env.CONSONANCE_READY_DIR = dir;
    process.env.CONSONANCE_PANE = bad;
    stamp(true, {});
    assert.deepStrictEqual(wrote(dir), [], `wrote under a bad pane id ${JSON.stringify(bad)}`);
  }
});

check('with no ready dir and no pane, nothing is written and nothing throws', (dir) => {
  stamp(true, { session_id: 's' });
  assert.deepStrictEqual(wrote(dir), [], 'wrote with no variables set');
});

// Both cases below were written because a mutant survived without them (D090): the first when
// `ready === true` became `!!ready`, the second when the missing-variable guard was deleted.
check('only a literal true is ready: a truthy non-boolean stamps ready false', (dir) => {
  process.env.CONSONANCE_READY_DIR = dir;
  process.env.CONSONANCE_PANE = 'pane-4';
  stamp('yes', {});
  assert.strictEqual(read(dir, 'pane-4').ready, false, 'a truthy non-boolean was written as ready');
});

check('a ready dir with no pane writes nothing — not a file named after a missing id', (dir) => {
  process.env.CONSONANCE_READY_DIR = dir;
  stamp(true, { session_id: 's' });
  assert.deepStrictEqual(wrote(dir), [], 'wrote with no pane set');
});

// The temp dir is the only directory any case above touches, and each is removed in `finally`.
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
