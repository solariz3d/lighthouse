'use strict';
// d423-letters-swap.test.js: node --test consonance/tools/d423-letters-swap.test.js — the one-time letters.json correction (D423 part 4 (2)).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path');
const S = require('./d423-letters-swap.js');

const crossed = () => ({ '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f': 'A', 'efdcf8e2-0244-4c56-b1a2-823d8705cc21': 'H', [S.O_SEAT]: 'N', [S.P_SEAT]: 'O' });
function dir(reg) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'd423-letters-'));
  fs.writeFileSync(path.join(d, 'letters.json'), JSON.stringify(reg, null, 2));
  return d;
}

test('the crossed registry is corrected: O seat N->O, P seat O->P, the Third Place gets N, every other row untouched', () => {
  const p = S.plan(crossed());
  assert.equal(p.action, 'apply');
  assert.deepEqual(p.next, { ...crossed(), [S.O_SEAT]: 'O', [S.P_SEAT]: 'P', [S.THIRD_PLACE]: 'N' });
});
test('an already corrected registry is a no-op', () => {
  assert.equal(S.plan({ ...crossed(), [S.O_SEAT]: 'O', [S.P_SEAT]: 'P', [S.THIRD_PLACE]: 'N' }).action, 'noop');
});
test('anything but the exact crossed shape is refused and nothing moves: another holder of P, a registered Third Place, a moved seat, not an object', () => {
  assert.equal(S.plan({ ...crossed(), 'x-other': 'P' }).action, 'refuse');
  assert.equal(S.plan({ ...crossed(), [S.THIRD_PLACE]: 'Q' }).action, 'refuse');
  assert.equal(S.plan({ ...crossed(), [S.O_SEAT]: 'Z' }).action, 'refuse');
  assert.equal(S.plan([]).action, 'refuse');
  assert.equal(S.plan(null).action, 'refuse');
});
test('apply refuses while Consonance runs, or when that cannot be told, and the file is byte-identical after', () => {
  for (const running of [true, null]) {
    const d = dir(crossed()), before = fs.readFileSync(path.join(d, 'letters.json'));
    const r = S.run(d, { apply: true, running });
    assert.equal(r.action, 'refuse');
    assert.deepEqual(fs.readFileSync(path.join(d, 'letters.json')), before);
    assert.deepEqual(fs.readdirSync(d), ['letters.json'], 'a refused run left something behind');
  }
});
test('a dry run changes nothing', () => {
  const d = dir(crossed()), before = fs.readFileSync(path.join(d, 'letters.json'));
  assert.equal(S.run(d, { apply: false, running: false }).action, 'apply');
  assert.deepEqual(fs.readFileSync(path.join(d, 'letters.json')), before);
});
test('apply with Consonance closed backs the file up first, writes the correction, and writes the board note naming both moves', () => {
  const d = dir(crossed()), before = fs.readFileSync(path.join(d, 'letters.json'), 'utf8');
  const r = S.run(d, { apply: true, running: false });
  assert.equal(r.action, 'applied');
  assert.equal(fs.readFileSync(r.backup, 'utf8'), before, 'the backup is not the file as it was');
  const after = JSON.parse(fs.readFileSync(path.join(d, 'letters.json'), 'utf8'));
  assert.equal(after[S.O_SEAT], 'O'); assert.equal(after[S.P_SEAT], 'P'); assert.equal(after[S.THIRD_PLACE], 'N');
  assert.match(fs.readFileSync(r.noteFile, 'utf8'), /\[pane:N\] were seat O, and \[pane:O\] were seat P/);
  assert.equal(S.run(d, { apply: true, running: false }).action, 'noop', 'a second run must not move anything');
});
test('a missing letters.json is refused, not created', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'd423-letters-'));
  assert.equal(S.run(d, { apply: true, running: false }).action, 'refuse');
  assert.deepEqual(fs.readdirSync(d), []);
});
