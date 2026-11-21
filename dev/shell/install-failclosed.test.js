// install-failclosed.test.js — L215 (pane A): install.ps1 -FailClosed <leaf,...> and -GatesOpen. Every room gate fails OPEN by design; nothing is switched by a bare run.
// -FailClosed sets onFailure:"block" and a timeout on the NAMED PreToolUse gates only; -GatesOpen is the way out (takes onFailure off every managed hook). Each row runs the
// installer with USERPROFILE pointed at a scratch folder: nothing of the machine's own ~/.claude is touched. Windows only (PowerShell).
// Run: node --test dev/shell/install-failclosed.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SCRIPT = path.join(__dirname, 'install.ps1');
const skip = process.platform !== 'win32' ? 'install.ps1 is PowerShell on Windows' : false;
const run = (home, ...args) => spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', SCRIPT, ...args], { encoding: 'utf8', env: { ...process.env, USERPROFILE: home, HOME: home }, timeout: 240000 });
const settingsOf = (home) => JSON.parse(fs.readFileSync(path.join(home, '.claude', 'settings.json'), 'utf8'));
const entries = (s) => Object.entries(s.hooks || {}).flatMap(([ev, gs]) => gs.flatMap((g) => (g.hooks || []).map((h) => ({ ev, h }))));
const leafOf = (h) => { const q = [...String(h.command).matchAll(/"([^"]*)"/g)]; return path.basename(q.length ? q[q.length - 1][1] : h.command).toLowerCase(); };
const withHome = (fn) => { const home = require('../../consonance/tools/scratch.js').mkdtemp('failclosed-'); try { fn(home); } finally { fs.rmSync(home, { recursive: true, force: true }); } };

test('row 1 (control): a bare install registers the gates and sets no onFailure anywhere: they fail open', { skip }, () => withHome((home) => {
  const r = run(home); assert.strictEqual(r.status, 0, (r.stdout + r.stderr).slice(-1500));
  const all = entries(settingsOf(home));
  assert.ok(all.some((e) => e.ev === 'PreToolUse' && leafOf(e.h) === 'push-gate.js'), 'push-gate is registered');
  assert.deepStrictEqual(all.filter((e) => 'onFailure' in e.h), []);
}));

test('row 2: -FailClosed push-gate.js sets onFailure block and a timeout on that PreToolUse entry and on nothing else', { skip }, () => withHome((home) => {
  assert.strictEqual(run(home).status, 0);
  const r = run(home, '-FailClosed', 'push-gate.js'); assert.strictEqual(r.status, 0, (r.stdout + r.stderr).slice(-1500));
  assert.match(r.stdout, /CLOSED\s+PreToolUse\s+push-gate\.js/);
  const closed = entries(settingsOf(home)).filter((e) => 'onFailure' in e.h);
  assert.deepStrictEqual(closed.map((e) => [e.ev, leafOf(e.h), e.h.onFailure]), [['PreToolUse', 'push-gate.js', 'block']]);
  assert.ok(Number(closed[0].h.timeout) > 0, 'an explicit timeout');
}));

test('row 3 (the way out): -GatesOpen takes onFailure off every managed hook and changes nothing else', { skip }, () => withHome((home) => {
  assert.strictEqual(run(home).status, 0);
  const before = JSON.stringify(settingsOf(home));
  assert.strictEqual(run(home, '-FailClosed', 'push-gate.js,delete-gate.js').status, 0);
  assert.strictEqual(entries(settingsOf(home)).filter((e) => 'onFailure' in e.h).length, 2);
  const r = run(home, '-GatesOpen'); assert.strictEqual(r.status, 0, (r.stdout + r.stderr).slice(-1500));
  assert.match(r.stdout, /OPEN\s+PreToolUse\s+(push|delete)-gate\.js/);
  assert.deepStrictEqual(entries(settingsOf(home)).filter((e) => 'onFailure' in e.h), []);
  const strip = (s) => JSON.stringify(JSON.parse(s), (k, v) => (k === 'timeout' ? undefined : v));
  assert.strictEqual(strip(JSON.stringify(settingsOf(home))), strip(before), 'only onFailure (and the timeout it set) differ from the bare install');
}));

test('row 4: -FailClosed refuses a name it does not manage and a hook that is not a PreToolUse gate; a bare run afterwards keeps what was set', { skip }, () => withHome((home) => {
  assert.strictEqual(run(home).status, 0);
  const r = run(home, '-FailClosed', 'no-such-gate.js,usage-ledger.js');
  assert.match(r.stdout, /UNKNOWN.*no-such-gate\.js/);
  assert.deepStrictEqual(entries(settingsOf(home)).filter((e) => 'onFailure' in e.h), [], 'usage-ledger.js is a SessionStart hook: not switched');
  assert.strictEqual(run(home, '-FailClosed', 'delete-gate.js').status, 0);
  assert.strictEqual(run(home).status, 0, 'a bare re-run');
  assert.deepStrictEqual(entries(settingsOf(home)).filter((e) => 'onFailure' in e.h).map((e) => leafOf(e.h)), ['delete-gate.js'], 'a bare run does not strip it');
}));

test('row 5: the two switches write settings.json, so they are refused with -Check and -NoRegister, and with each other', { skip }, () => withHome((home) => {
  assert.notStrictEqual(run(home, '-Check', '-GatesOpen').status, 0);
  assert.notStrictEqual(run(home, '-NoRegister', '-FailClosed', 'push-gate.js').status, 0);
  assert.notStrictEqual(run(home, '-FailClosed', 'push-gate.js', '-GatesOpen').status, 0);
}));

test('row 6: -GatesOpen leaves a hook the script does not manage alone, even one carrying onFailure; -FailClosed gives a gate with no timeout one', { skip }, () => withHome((home) => {
  assert.strictEqual(run(home).status, 0);
  const sf = path.join(home, '.claude', 'settings.json'), s = settingsOf(home);
  s.hooks.PreToolUse.push({ matcher: 'Bash', hooks: [{ type: 'command', command: '"C:/mine/own-hook.js"', onFailure: 'block', timeout: 7 }] });
  for (const g of s.hooks.PreToolUse) for (const h of g.hooks || []) if (leafOf(h) === 'push-gate.js') delete h.timeout;   // a gate with no timeout waits the harness's 600 s
  fs.writeFileSync(sf, JSON.stringify(s));
  assert.strictEqual(run(home, '-FailClosed', 'push-gate.js').status, 0);
  const gate = entries(settingsOf(home)).find((e) => leafOf(e.h) === 'push-gate.js');
  assert.ok(Number(gate.h.timeout) > 0 && Number(gate.h.timeout) <= 30, 'an explicit, short timeout was set: ' + gate.h.timeout);
  assert.strictEqual(run(home, '-GatesOpen').status, 0);
  const mine = entries(settingsOf(home)).find((e) => leafOf(e.h) === 'own-hook.js');
  assert.strictEqual(mine.h.onFailure, 'block', 'the own hook keeps its key');
}));
