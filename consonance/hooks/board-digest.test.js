// board-digest.js — the blind gate's OUTPUT behaviour, end to end.
//
// blind.test.js proves the state machine (blind.js) resolves the four cases correctly. This file
// proves board-digest.js ACTS on that resolution correctly — specifically the expired case, which
// had a bug the state machine could not catch: emit() exits the process, so a separate emit() for
// the "window expired" notice returned before the [panes] body ever ran. A stale lock therefore
// muted the room on the turn it expired and every turn after — the exact "must not silently mute
// the room forever" failure blind.js decision #4 exists to prevent — while blindState() itself was
// behaving perfectly. The bug lived in the two-emit sequence, so only a test that reads the emitted
// output can see it.
//
//   node consonance/hooks/board-digest.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const HOOK = path.join(__dirname, 'board-digest.js');
const SIBLING = 'aaaaaaaa-1111-4000-8000-000000000001';
const READER = '0c0c0c0a-0000-4000-8000-0000000000ff'; // any pane that is not the sibling

/** A minimal but real bed: one sibling pane with a prompt and a reply from today, so the digest
 *  has a non-empty [panes] body to either show or (wrongly) suppress. */
function bed() {
  const instances = fs.mkdtempSync(path.join(os.tmpdir(), 'bd-inst-'));
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'bd-data-'));
  const cwd = path.join(instances, 'a-pane');
  fs.mkdirSync(cwd, { recursive: true });
  const now = Date.now();
  fs.writeFileSync(
    path.join(data, 'board.jsonl'),
    [
      { pane: SIBLING, role: 'user', text: 'a prompt from another pane', ts: now - 60_000 },
      { pane: SIBLING, role: 'assistant', text: 'a reply long enough to read as a report rather than tool narration, from a pane that is not the reader', ts: now - 30_000 },
    ].map((o) => JSON.stringify(o)).join('\n') + '\n'
  );
  return { instances, data, cwd };
}

function run(b) {
  const out = execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ cwd: b.cwd, session_id: READER, source: 'user' }),
    encoding: 'utf8',
    env: { ...process.env, CONSONANCE_INSTANCES: b.instances, CONSONANCE_DATA: b.data },
  }).trim();
  if (!out) return '';
  return JSON.parse(out).hookSpecificOutput.additionalContext;
}

test('no lock: the [panes] digest is delivered, with no blind line', () => {
  const b = bed();
  const line = run(b);
  assert.match(line, /\[panes\]/, 'the digest must reach the reader');
  assert.doesNotMatch(line, /\[blind\]/, 'no lock means no blind line');
});

test('active lock: the digest is WITHHELD and the mute declares itself', () => {
  const b = bed();
  fs.writeFileSync(path.join(b.data, 'blind.lock'),
    JSON.stringify({ until: new Date(Date.now() + 60_000).toISOString(), why: 'arm A' }));
  const line = run(b);
  assert.match(line, /withheld until/, 'an active window mutes the broadcast and says so');
  assert.doesNotMatch(line, /\[panes\]/, 'the pane bodies must not leak during a blind window');
  assert.ok(fs.existsSync(path.join(b.data, 'blind.lock')), 'an active lock is left in place');
});

test('EXPIRED lock: fails OPEN — the notice AND the digest both go out in one turn', () => {
  // The regression guard. Before the fix, emit() for the expiry notice exited the process before
  // the [panes] body ran, so this same run produced the notice with no digest — and every later
  // turn too, because nothing cleared the stale lock.
  const b = bed();
  fs.writeFileSync(path.join(b.data, 'blind.lock'),
    JSON.stringify({ until: new Date(Date.now() - 60_000).toISOString() }));
  const line = run(b);
  assert.match(line, /\[blind\] window expired/, 'the expiry must be declared, not silently inferred');
  assert.match(line, /\[panes\]/, 'the digest must resume in the SAME turn the window is found stale');
});

test('EXPIRED lock is cleared, so the notice fires once rather than every turn forever', () => {
  const b = bed();
  const lock = path.join(b.data, 'blind.lock');
  fs.writeFileSync(lock, JSON.stringify({ until: new Date(Date.now() - 60_000).toISOString() }));
  const first = run(b);
  assert.match(first, /\[blind\] window expired/);
  assert.ok(!fs.existsSync(lock), 'the stale lock must be removed once its expiry has been announced');
  const second = run(b);
  assert.match(second, /\[panes\]/, 'the next turn resumes clean');
  assert.doesNotMatch(second, /\[blind\]/, 'and does not re-announce an already-cleared window');
});
