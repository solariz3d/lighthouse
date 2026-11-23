// install-fresh-home.test.js — D273 lap 2: dev/shell/install.ps1 on a STRANGER's machine. It used to refuse a home with no ~/.claude/settings.json, which
// stopped every new user at that line; it now creates `{}` there, says so, and registers into it. Everything it writes is under %USERPROFILE%, so each row
// runs it with USERPROFILE (and HOME) pointed at a fresh temp folder: nothing of the machine's own ~/.claude is touched. Windows only (PowerShell).
//   1  a fresh home: exit 0, the message says it created an empty settings.json, and the file is JSON with no BOM and the hooks registered in it
//   2  a home that HAS a settings.json: it is merged into, never re-created (the user's own keys survive) and the "created" message does not appear
//   3  D273 ruling 5: no jev-flags registration and no jev-flags.js (Jev retired)
// Run: node --test dev/shell/install-fresh-home.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SCRIPT = path.join(__dirname, 'install.ps1');
const skip = process.platform !== 'win32' ? 'install.ps1 is PowerShell on Windows' : false;
function install(home) {
  return spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', SCRIPT], { encoding: 'utf8', env: { ...process.env, USERPROFILE: home, HOME: home }, timeout: 240000 });
}

test('row 1: a fresh home with no settings.json: install creates {} there, says so, and registers the hooks into it', { skip }, () => {
  const home = require('../../consonance/tools/scratch.js').mkdtemp('fresh-home-');
  try {
    const r = install(home), out = r.stdout + r.stderr, f = path.join(home, '.claude', 'settings.json');
    assert.strictEqual(r.status, 0, out.slice(-2000));
    assert.match(out, /NO settings\.json at .* created an empty one \(\{\}\)/);
    const raw = fs.readFileSync(f);
    assert.notDeepStrictEqual([...raw.subarray(0, 3)], [0xef, 0xbb, 0xbf], 'no BOM: JSON.parse rejects one');
    const s = JSON.parse(raw.toString('utf8'));
    assert.ok(s.hooks && Object.keys(s.hooks).length > 0, 'the hooks are registered into the created file');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('row 2: a home that HAS a settings.json is merged into, never re-created: the user\'s own keys survive', { skip }, () => {
  const home = require('../../consonance/tools/scratch.js').mkdtemp('fresh-home-');
  try {
    fs.mkdirSync(path.join(home, '.claude')); fs.writeFileSync(path.join(home, '.claude', 'settings.json'), JSON.stringify({ theme: 'dark', model: 'theirs' }));
    const r = install(home), out = r.stdout + r.stderr;
    assert.strictEqual(r.status, 0, out.slice(-2000));
    assert.doesNotMatch(out, /created an empty one/);
    const s = JSON.parse(fs.readFileSync(path.join(home, '.claude', 'settings.json'), 'utf8'));
    assert.strictEqual(s.theme, 'dark'); assert.strictEqual(s.model, 'theirs'); assert.ok(s.hooks);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

// L214 (pane B, the librarian's rulings of 2026-11-21 03:5x): AGENT DEFINITIONS are a second destination, ~/.claude/agents/, so every seat's Agent
// tool can name them; and CLAUDE_CODE_SUBAGENT_EFFORT is set to medium in the user settings' env block, only where it is not already set.
test('row 4: a fresh home gets agents/room-reader.md, byte for byte the repo\'s', { skip }, () => {
  const home = require('../../consonance/tools/scratch.js').mkdtemp('fresh-home-');
  try {
    const r = install(home), out = r.stdout + r.stderr;
    assert.strictEqual(r.status, 0, out.slice(-2000));
    const got = path.join(home, '.claude', 'agents', 'room-reader.md');
    assert.ok(fs.existsSync(got), 'agents/room-reader.md is installed');
    assert.ok(fs.readFileSync(got).equals(fs.readFileSync(path.join(__dirname, 'agents', 'room-reader.md'))), 'it is the repo\'s copy');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('row 5: the env block gets CLAUDE_CODE_SUBAGENT_EFFORT=medium where it is unset, and a value already there is left as it is', { skip }, () => {
  const fresh = require('../../consonance/tools/scratch.js').mkdtemp('fresh-home-');
  const set = require('../../consonance/tools/scratch.js').mkdtemp('fresh-home-');
  try {
    let r = install(fresh);
    assert.strictEqual(r.status, 0, (r.stdout + r.stderr).slice(-2000));
    assert.strictEqual(JSON.parse(fs.readFileSync(path.join(fresh, '.claude', 'settings.json'), 'utf8')).env.CLAUDE_CODE_SUBAGENT_EFFORT, 'medium');
    fs.mkdirSync(path.join(set, '.claude'));
    fs.writeFileSync(path.join(set, '.claude', 'settings.json'), JSON.stringify({ env: { CLAUDE_CODE_SUBAGENT_EFFORT: 'high', THEIRS: '1' } }));
    r = install(set);
    assert.strictEqual(r.status, 0, (r.stdout + r.stderr).slice(-2000));
    const env = JSON.parse(fs.readFileSync(path.join(set, '.claude', 'settings.json'), 'utf8')).env;
    assert.strictEqual(env.CLAUDE_CODE_SUBAGENT_EFFORT, 'high', 'a value the user set is not displaced');
    assert.strictEqual(env.THEIRS, '1', 'the user\'s other env keys survive');
  } finally { fs.rmSync(fresh, { recursive: true, force: true }); fs.rmSync(set, { recursive: true, force: true }); }
});

test('row 3: D273 ruling 5 (Jev retired): a fresh install registers no jev-flags hook and copies no jev-flags.js', { skip }, () => {
  const home = require('../../consonance/tools/scratch.js').mkdtemp('fresh-home-');
  try {
    const r = install(home), out = r.stdout + r.stderr;
    assert.strictEqual(r.status, 0, out.slice(-2000));
    const s = JSON.parse(fs.readFileSync(path.join(home, '.claude', 'settings.json'), 'utf8'));
    const cmds = Object.values(s.hooks || {}).flat().flatMap((g) => (g.hooks || []).map((h) => String(h.command)));
    assert.ok(cmds.length > 0, 'control: hooks are registered');
    assert.deepStrictEqual(cmds.filter((c) => /jev-flags/.test(c)), [], 'no jev-flags registration');
    assert.ok(!fs.existsSync(path.join(home, '.claude', 'shell', 'hooks', 'jev-flags.js')), 'no jev-flags.js copied');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});
