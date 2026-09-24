// jev/test/install.test.js — node --test jev/test/install.test.js
//
// EVERY TEST RUNS ON A TEMP HOME. install() and uninstall() take `home` with no default, and the one CLI test spawns the
// installer with HOME and USERPROFILE pointed at a temp dir, so nothing here can reach a real ~/.claude.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const I = require('../install.js');
// D129: every spawn's env comes from here, so all four store variables point into a temp root (isolation.test.js checks).
const { isolatedEnv } = require('./isolated-env.js');

const INSTALLER = path.join(__dirname, '..', 'install.js');
const JUDGE = path.join(__dirname, '..', 'bin', 'jev-judge.js');
const FLAGS = path.join(__dirname, '..', 'bin', 'jev-flags.js');
const NODE = process.execPath;
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

/** A settings file like one a real user has: other keys, and foreign hooks on both of Jev's events and on a third. */
const FOREIGN = {
  model: 'opus[1m]',
  permissions: { allow: ['Bash(git status)'] },
  hooks: {
    Stop: [{ hooks: [{ type: 'command', command: '"C:\\node.exe" "C:\\Users\\u\\.claude\\shell\\hooks\\ready-stop.js"', timeout: 10 }] }],
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: 'python ~/.claude/pulse.py' }] }],
    PreToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: 'node gate.js' }] }],
  },
  env: { SOME_FLAG: '1' },
};

function home({ settings, text, claudeDir = true } = {}) {
  const h = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-install-'));
  if (claudeDir) fs.mkdirSync(path.join(h, '.claude'));
  const file = path.join(h, '.claude', 'settings.json');
  if (text !== undefined) fs.writeFileSync(file, text);
  else if (settings !== undefined) fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n');
  return { h, file, read: () => fs.readFileSync(file, 'utf8'), bytes: () => fs.readFileSync(file),
    backups: () => fs.readdirSync(path.join(h, '.claude')).filter((f) => f.includes('.bak-jev-')) };
}

const later = (ms) => new Date(Date.UTC(2026, 8, 23, 15, 0, 0) + ms);

test('install adds Jev\'s two hooks, each as its own group, in exec form', () => {
  const w = home({ settings: FOREIGN });
  const r = I.install({ home: w.h, nodePath: NODE, now: later(0) });
  assert.deepStrictEqual([r.added, r.repointed, r.already, r.changed], [2, 0, 0, true]);
  const s = JSON.parse(w.read());
  assert.deepStrictEqual(s.hooks.Stop[s.hooks.Stop.length - 1], { hooks: [{ type: 'command', command: NODE, args: [JUDGE], timeout: 10 }] });
  assert.deepStrictEqual(s.hooks.UserPromptSubmit[s.hooks.UserPromptSubmit.length - 1], { hooks: [{ type: 'command', command: NODE, args: [FLAGS], timeout: 10 }] });
});

test('install leaves every foreign key and hook exactly as it was — the file minus Jev\'s groups is the original, byte for byte', () => {
  const w = home({ settings: FOREIGN });
  const before = w.read();
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const s = JSON.parse(w.read());
  s.hooks.Stop.pop();
  s.hooks.UserPromptSubmit.pop();
  assert.strictEqual(JSON.stringify(s, null, 2) + '\n', before);
});

test('a second install changes nothing: same bytes, same mtime, no new backup', () => {
  const w = home({ settings: FOREIGN });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const b1 = w.bytes();
  const m1 = fs.statSync(w.file).mtimeMs;
  const n1 = w.backups().length;
  const r = I.install({ home: w.h, nodePath: NODE, now: later(60000) });
  assert.deepStrictEqual([r.changed, r.added, r.repointed, r.already], [false, 0, 0, 2]);
  assert.ok(w.bytes().equals(b1));
  assert.strictEqual(fs.statSync(w.file).mtimeMs, m1);
  assert.strictEqual(w.backups().length, n1);
});

test('uninstall restores the pre-install file byte for byte', () => {
  const w = home({ settings: FOREIGN });
  const before = sha(w.bytes());
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const r = I.uninstall({ home: w.h, now: later(60000) });
  assert.deepStrictEqual([r.changed, r.removed, r.restored], [true, 2, 'bytes']);
  assert.strictEqual(sha(w.bytes()), before);
  assert.ok(!fs.existsSync(path.join(w.h, '.jev', 'install.json')), 'the install record is removed with the install');
});

test('uninstall after the user changed the file keeps their change and removes only Jev\'s entries', () => {
  const w = home({ settings: FOREIGN });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const s = JSON.parse(w.read());
  s.theme = 'dark';
  fs.writeFileSync(w.file, JSON.stringify(s, null, 2) + '\n');
  const r = I.uninstall({ home: w.h, now: later(60000) });
  assert.strictEqual(r.restored, 'structural');
  assert.deepStrictEqual(JSON.parse(w.read()), { ...FOREIGN, theme: 'dark' });
});

test('a CRLF, 4-space file keeps its line endings and indent through install, and uninstall restores its bytes', () => {
  const text = JSON.stringify(FOREIGN, null, 4).replace(/\n/g, '\r\n') + '\r\n';
  const w = home({ text });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const after = w.read();
  assert.ok(!/[^\r]\n/.test(after), 'no bare LF line ending was introduced');
  assert.ok(after.includes('\r\n    "hooks": {'), 'the 4-space indent is kept');
  I.uninstall({ home: w.h, now: later(60000) });
  assert.strictEqual(w.read(), text);
});

test('a BOM is kept', () => {
  const text = '\uFEFF' + JSON.stringify(FOREIGN, null, 2) + '\n';
  const w = home({ text });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  assert.ok(w.read().startsWith('\uFEFF'));
});

test('an empty "hooks": {} from before the install comes back on uninstall, byte for byte', () => {
  const text = JSON.stringify({ model: 'x', hooks: {} }, null, 2) + '\n';
  const w = home({ text });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const r = I.uninstall({ home: w.h, now: later(60000) });
  assert.strictEqual(r.restored, 'bytes');
  assert.strictEqual(w.read(), text);
});

test('a compact one-line file comes back byte for byte, even after a second install that had to write', () => {
  const text = '{"model":"x","hooks":{"Stop":[{"hooks":[{"type":"command","command":"node a.js"}]}]}}';
  const w = home({ text });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const s = JSON.parse(w.read());
  s.hooks.Stop[1].hooks[0].timeout = 99;             // someone edits Jev's entry, so the next install re-points it
  fs.writeFileSync(w.file, JSON.stringify(s, null, 2) + '\n');
  const r2 = I.install({ home: w.h, nodePath: NODE, now: later(60000) });
  assert.strictEqual(r2.repointed, 1);
  const u = I.uninstall({ home: w.h, now: later(120000) });
  assert.strictEqual(u.restored, 'bytes');
  assert.strictEqual(w.read(), text, 'the record still names the FIRST backup, the pre-install file');
});

test('an empty "Stop": [] from before the install comes back on uninstall, byte for byte', () => {
  const text = JSON.stringify({ hooks: { Stop: [], PreToolUse: FOREIGN.hooks.PreToolUse } }, null, 2) + '\n';
  const w = home({ text });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  const r = I.uninstall({ home: w.h, now: later(60000) });
  assert.strictEqual(r.restored, 'bytes');
  assert.strictEqual(w.read(), text);
});

test('a write that does not read back as intended is undone from the backup', () => {
  const w = home({ settings: FOREIGN });
  const before = w.read();
  const bak = `${w.file}.bak-test`;
  fs.copyFileSync(w.file, bak);
  assert.throws(() => I.writeChecked(w.file, '{"not":"what was meant"}', { meant: true }, bak), (e) => e.name === 'InstallError' && /restored from/.test(e.message));
  assert.strictEqual(w.read(), before);
});

test('a write with no backup that does not read back is removed, not left half-right', () => {
  const w = home();
  assert.throws(() => I.writeChecked(w.file, '{ broken', { meant: true }, null), (e) => e.name === 'InstallError' && /removed again/.test(e.message));
  assert.ok(!fs.existsSync(w.file));
});

test('a malformed settings.json is refused loudly and never rewritten or backed up', () => {
  const text = '{ "model": "x", "hooks": { "Stop": [ }';
  const w = home({ text });
  assert.throws(() => I.install({ home: w.h, nodePath: NODE }), (e) => e.name === 'InstallError' && /does not parse/.test(e.message));
  assert.strictEqual(w.read(), text);
  assert.deepStrictEqual(w.backups(), []);
  assert.ok(!fs.existsSync(path.join(w.h, '.jev')), 'no install record either');
});

test('a hooks event that is not an array is refused and the file is left alone', () => {
  const text = JSON.stringify({ hooks: { Stop: { command: 'x' } } }, null, 2) + '\n';
  const w = home({ text });
  assert.throws(() => I.install({ home: w.h, nodePath: NODE }), (e) => e.name === 'InstallError' && /hooks\.Stop/.test(e.message));
  assert.strictEqual(w.read(), text);
});

test('uninstall refuses a malformed file too, and leaves it alone', () => {
  const w = home({ settings: FOREIGN });
  I.install({ home: w.h, nodePath: NODE, now: later(0) });
  fs.writeFileSync(w.file, 'not json');
  assert.throws(() => I.uninstall({ home: w.h }), (e) => e.name === 'InstallError');
  assert.strictEqual(w.read(), 'not json');
});

test('no ~/.claude directory: refused, nothing created', () => {
  const w = home({ claudeDir: false });
  assert.throws(() => I.install({ home: w.h, nodePath: NODE }), (e) => e.name === 'InstallError' && /Claude Code has not been run/.test(e.message));
  assert.deepStrictEqual(fs.readdirSync(w.h), []);
});

test('no settings.json: created holding only Jev\'s hooks, and uninstall removes it again', () => {
  const w = home();
  const r = I.install({ home: w.h, nodePath: NODE, now: later(0) });
  assert.strictEqual(r.backup, null);
  assert.deepStrictEqual(Object.keys(JSON.parse(w.read()).hooks).sort(), ['Stop', 'UserPromptSubmit']);
  const u = I.uninstall({ home: w.h, now: later(60000) });
  assert.strictEqual(u.restored, 'removed-file');
  assert.ok(!fs.existsSync(w.file));
});

test('the room\'s own jev-flags.js (same name, different file) is never touched, and the install says both will run', () => {
  const roomFlags = { type: 'command', command: '"C:\\node.exe" "C:\\Users\\u\\.claude\\shell\\hooks\\jev-flags.js"', timeout: 10 };
  const settings = { hooks: { UserPromptSubmit: [{ hooks: [roomFlags] }] } };
  const w = home({ settings });
  const r = I.install({ home: w.h, nodePath: NODE, now: later(0) });
  assert.strictEqual(r.added, 2, 'the room\'s entry is not mistaken for Jev\'s');
  assert.ok(r.notes.some((n) => /another jev-flags\.js is already registered on UserPromptSubmit/.test(n)), r.notes.join('\n'));
  I.uninstall({ home: w.h, now: later(60000) });
  assert.deepStrictEqual(JSON.parse(w.read()), settings);
});

test('Jev\'s entry pointing at an old node is re-pointed in place, not duplicated', () => {
  const old = { type: 'command', command: '/old/node', args: [JUDGE], timeout: 10 };
  const w = home({ settings: { hooks: { Stop: [{ hooks: [old] }] } } });
  const r = I.install({ home: w.h, nodePath: NODE, now: later(0) });
  assert.deepStrictEqual([r.repointed, r.added], [1, 1]);
  const stop = JSON.parse(w.read()).hooks.Stop;
  assert.strictEqual(stop.length, 1);
  assert.deepStrictEqual(stop[0].hooks, [{ type: 'command', command: NODE, args: [JUDGE], timeout: 10 }]);
});

test('Jev\'s entries are recognised by absolute path: case-insensitively with either slash on Windows, exactly elsewhere', () => {
  const win = 'C:\\Users\\U\\lighthouse\\jev\\bin\\jev-judge.js';
  assert.ok(I.isOurs({ command: 'node', args: ['c:/users/u/LIGHTHOUSE/jev/bin/jev-judge.js'] }, win, 'win32'));
  assert.ok(I.isOurs({ command: '"node" "C:/Users/U/lighthouse/jev/bin/jev-judge.js"' }, win, 'win32'));
  assert.ok(!I.isOurs({ command: 'node', args: ['C:/Users/U/.claude/shell/hooks/jev-judge.js'] }, win, 'win32'));
  const nix = '/home/u/jev/bin/jev-judge.js';
  assert.ok(I.isOurs({ command: 'node', args: [nix] }, nix, 'linux'));
  assert.ok(!I.isOurs({ command: 'node', args: ['/HOME/u/jev/bin/jev-judge.js'] }, nix, 'linux'));
});

test('install and uninstall refuse to run with no home given — no default can reach a real ~/.claude', () => {
  assert.throws(() => I.install({ nodePath: NODE }), (e) => e.name === 'InstallError');
  assert.throws(() => I.uninstall({}), (e) => e.name === 'InstallError');
});

test('the CLI installs and uninstalls against the home it is given, exit 0, and refuses an unknown argument', () => {
  const w = home({ settings: FOREIGN });
  const before = sha(w.bytes());
  const env = isolatedEnv(undefined, { HOME: w.h, USERPROFILE: w.h });
  const a = spawnSync(NODE, [INSTALLER], { env, encoding: 'utf8' });
  assert.strictEqual(a.status, 0, a.stderr);
  assert.match(a.stdout, /2 added/);
  assert.match(a.stdout, /Vercel AI Gateway/);
  const b = spawnSync(NODE, [INSTALLER], { env, encoding: 'utf8' });
  assert.match(b.stdout, /nothing changed/);
  const c = spawnSync(NODE, [INSTALLER, '--uninstall'], { env, encoding: 'utf8' });
  assert.strictEqual(c.status, 0, c.stderr);
  assert.match(c.stdout, /byte for byte/);
  assert.strictEqual(sha(w.bytes()), before);
  const d = spawnSync(NODE, [INSTALLER, '--force'], { env, encoding: 'utf8' });
  assert.strictEqual(d.status, 1);
});

test('the CLI refuses a malformed file with exit 1 and says so', () => {
  const w = home({ text: '{ nope' });
  const r = spawnSync(NODE, [INSTALLER], { env: isolatedEnv(undefined, { HOME: w.h, USERPROFILE: w.h }), encoding: 'utf8' });
  assert.strictEqual(r.status, 1);
  assert.match(r.stderr, /REFUSED/);
  assert.strictEqual(w.read(), '{ nope');
});
