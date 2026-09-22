// shell-dir-seam.test.js - the eight shell hooks find ~/.claude/shell through their OWN variable.
//
// WHY (D098, pane C). Eight hooks resolved `SHELL_DIR = process.env.CONSONANCE_DATA || ~/.claude/shell`
// - a test seam borrowed from the app, where CONSONANCE_DATA means the DATA dir, and every other
// reader in the repo uses it that way. When the app leaked it into panes (09-14..09-20, closed by
// 3d89dfb), the hooks resolved their DEPENDENCIES in the data dir as well as their ledgers:
// lib/ready.js, lib/ambient.js and hooks/l*-overseer-worker.js do not exist there, so the readiness
// stamps, the ambient block and both overseer workers went silently off. Measured on D: 210 L2 and
// 297 L3 jobs queued in C:\Consonance\data\l{2,3}-jobs, 09-14 14:42 .. 09-20 23:31 local, never
// drained, because data\hooks\ does not exist. Nothing reported it.
//
// The seam is now CONSONANCE_SHELL_DIR, and CONSONANCE_DATA - whatever it says - is not read by
// these eight. The two executed tests below run the hooks UNDER the collision (CONSONANCE_DATA set
// to a data dir that has no lib/) and require them to work; the sweep covers the five that spawn
// `claude` or a worker and cannot be executed in a test.
// Run: node --test dev/shell/hooks/shell-dir-seam.test.js   (or via js-suite)
'use strict';
const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOKS = __dirname;
const SHELL_SRC = path.resolve(__dirname, '..');           // dev/shell: the same layout as ~/.claude/shell
const EIGHT = ['session-end', 'session-start', 'stop', 'userprompt-submit',
  'l2-overseer', 'l3-overseer', 'ready-prompt', 'ready-stop'];
const ROOM_CWD = path.join('C:', path.sep, 'Consonance', 'instances', 'sibling-d098-test');

/** A data dir that is what the app's data dir is to these hooks: somewhere with no lib/ and no hooks/. */
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));

function collisionEnv(extra) {
  const env = { ...process.env, CONSONANCE_DATA: tmp('seam-data-'), CONSONANCE_SHELL_DIR: SHELL_SRC, ...extra };
  delete env.CONSONANCE_DREAM;
  delete env.CLAUDE_OVERSEER_RUN;
  return env;
}

function runReady(hook, ready) {
  const readyDir = tmp('seam-ready-');
  const env = collisionEnv({ CONSONANCE_READY_DIR: readyDir, CONSONANCE_PANE: 'seam-pane' });
  const r = spawnSync(process.execPath, [path.join(HOOKS, `${hook}.js`)], {
    input: JSON.stringify({ session_id: 'd098-test', hook_event_name: 'x' }), env, encoding: 'utf8', timeout: 20000 });
  const stamp = path.join(readyDir, 'seam-pane.json');
  const got = fs.existsSync(stamp) ? JSON.parse(fs.readFileSync(stamp, 'utf8')).ready : 'NO STAMP';
  return { status: r.status, got, data: env.CONSONANCE_DATA };
}

test('ready-stop stamps the pane READY even when CONSONANCE_DATA names a data dir (the leaked-env case)', () => {
  const r = runReady('ready-stop');
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.got, true, 'no ready stamp: the hook looked for lib/ready.js in the data dir');
});

test('ready-prompt stamps the pane WORKING even when CONSONANCE_DATA names a data dir', () => {
  const r = runReady('ready-prompt');
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.got, false, 'no working stamp: the hook looked for lib/ready.js in the data dir');
});

test('userprompt-submit writes NOTHING into the data dir under the collision; its state goes to the shell dir', () => {
  const shell = tmp('seam-shell-');
  const env = collisionEnv({ CONSONANCE_SHELL_DIR: shell });
  const r = spawnSync(process.execPath, [path.join(HOOKS, 'userprompt-submit.js')], {
    input: JSON.stringify({ session_id: 'd098-test', cwd: ROOM_CWD, prompt: 'hello', hook_event_name: 'UserPromptSubmit' }),
    env, encoding: 'utf8', timeout: 20000 });
  assert.strictEqual(r.status, 0, r.stderr);
  assert.deepStrictEqual(fs.readdirSync(env.CONSONANCE_DATA), [], 'the hook wrote its ledgers into the data dir');
  assert.ok(fs.existsSync(path.join(shell, 'userprompt_state.json')),
    'CONTROL: the hook wrote no state anywhere, so "the data dir stayed empty" proves nothing');
});

test('SWEEP: all eight resolve SHELL_DIR from CONSONANCE_SHELL_DIR and none reads CONSONANCE_DATA', () => {
  // The five not executed above spawn claude or a worker. The sweep must SEE eight files or it is
  // the stick-waiter lesson again (a sweep whose count fell silently when its target was renamed).
  const found = EIGHT.filter((h) => fs.existsSync(path.join(HOOKS, `${h}.js`)));
  assert.deepStrictEqual(found, EIGHT, 'the sweep is not seeing all eight hooks');
  for (const h of EIGHT) {
    const code = fs.readFileSync(path.join(HOOKS, `${h}.js`), 'utf8')
      .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
    assert.ok(!/process\.env\.CONSONANCE_DATA\b/.test(code), `${h}.js still reads CONSONANCE_DATA`);
    assert.ok(/SHELL_DIR\s*=\s*process\.env\.CONSONANCE_SHELL_DIR\s*\|\|/.test(code),
      `${h}.js does not resolve SHELL_DIR from CONSONANCE_SHELL_DIR`);
  }
});
