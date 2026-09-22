// userprompt-submit.js — THE FRESH-PANE GUARD (D097 step 2, 2026-09-21).
//
// WHY: a fresh pane (C:\Consonance\instances\fresh-*) is a stock claude spawned without a brief. These user-level
// hooks fire for every claude on the machine, so this one must strip itself (lib/fresh-guard.js). The installed
// copy on D had the guard; the repo copy never did (git log -S isFreshCwd -> only 58b94f9, into session-start.js).
// And the repo's main() writes the SHARED state file on every prompt, so without the guard a fresh pane would
// (1) hear L3 and the beacon, (2) mark notices surfaced — swallowing them from the rooms, and (3) overwrite
// last_prompt_iso / first_seen_iso — corrupting the rooms' rollover and thread age.
// exo_memory/handback/p-d097-install1-B_2026-09-21.md §3.
//
// A BEHAVIOURAL ASSERTION THAT CANNOT DETECT ITS OWN VACUITY IS THE BUG (dream-gate.test.js's rule). "No output"
// and "state unchanged" are both things a broken harness produces too. So each fresh assertion is paired with a
// CONTROL on the same fixture from a non-fresh cwd, which must SPEAK and must CHANGE the state file. If the
// control goes quiet, the fresh test proves nothing and says so.
//
// Hermetic: CONSONANCE_SHELL_DIR (D098; was CONSONANCE_DATA) points the hook at a temp dir, so the real ~/.claude/shell is never read or written;
// the dream and overseer gates are unset so they cannot be what silences the hook.
// Run: node dev/shell/hooks/userprompt-submit.test.js   (or via js-suite)
'use strict';
const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'userprompt-submit.js');
// The guard's own marker: a dir named fresh-* DIRECTLY under the instances root (lib/fresh-guard.js).
// It need not exist — isFreshCwd resolves the name, it does not stat it.
const FRESH_CWD = path.join('C:', path.sep, 'Consonance', 'instances', 'fresh-d097-test');
const ROOM_CWD = path.join('C:', path.sep, 'Consonance', 'instances', 'sibling-d097-test');

// A seeded state with a first_seen far in the past, so a non-fresh run is certain to rewrite last_prompt_iso.
const SEED = JSON.stringify({ last_surfaced_job_ids: ['seed-job'], first_seen_iso: '2026-08-15T00:00:00.000Z',
  last_prompt_iso: '2026-08-15T00:00:00.000Z' });

function runHook(cwd) {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'ups-d097-'));
  const statePath = path.join(data, 'userprompt_state.json');
  fs.writeFileSync(statePath, SEED);
  const env = { ...process.env, CONSONANCE_SHELL_DIR: data };
  delete env.CONSONANCE_DREAM;
  delete env.CLAUDE_OVERSEER_RUN;
  const payload = JSON.stringify({ session_id: 'd097-test', cwd, prompt: 'hello', hook_event_name: 'UserPromptSubmit' });
  const r = spawnSync(process.execPath, [HOOK], { input: payload, env, encoding: 'utf8', timeout: 20000 });
  const after = fs.readFileSync(statePath, 'utf8');
  fs.rmSync(data, { recursive: true, force: true });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, stateAfter: after };
}

test('CONTROL: from a room cwd the hook SPEAKS — so silence below is the guard, not a dead fixture', () => {
  const r = runHook(ROOM_CWD);
  assert.strictEqual(r.status, 0, 'the hook must exit 0: ' + r.stderr);
  assert.ok(r.stdout.length > 0, 'a room pane got no output at all — the fresh assertions below would be vacuous');
  assert.ok(/UserPromptSubmit/.test(r.stdout), 'the output is not the hook JSON');
});

test('CONTROL: from a room cwd the state file CHANGES — so "unchanged" below can fail', () => {
  const r = runHook(ROOM_CWD);
  assert.notStrictEqual(r.stateAfter, SEED, 'a room prompt left the state byte-identical — the fresh check could not fail');
});

test('a FRESH pane gets NO output', () => {
  const r = runHook(FRESH_CWD);
  assert.strictEqual(r.status, 0, 'the guard must exit cleanly, not crash: ' + r.stderr);
  assert.strictEqual(r.stdout, '', 'a fresh pane was handed context: ' + r.stdout.slice(0, 200));
});

test('a FRESH pane leaves the SHARED state file byte-unchanged — no swallowed notices, no rewritten anchors', () => {
  const r = runHook(FRESH_CWD);
  assert.strictEqual(r.stateAfter, SEED, 'a fresh pane wrote the rooms\' state file');
});

test('a PARENT named fresh-* does not unbrief a room beneath it (the guard matches the pane\'s own dir)', () => {
  const nested = path.join('C:', path.sep, 'Consonance', 'instances', 'fresh-parent', 'sibling-child');
  const r = runHook(nested);
  assert.ok(r.stdout.length > 0, 'a room under a fresh-named parent was silenced');
});
