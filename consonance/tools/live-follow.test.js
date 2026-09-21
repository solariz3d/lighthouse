'use strict';

// live-follow.test.js — L062 R-C1, pane E. The follower's state-repo location.
//
// Run: node consonance/tools/live-follow.test.js
//
// portable-paths flagged live-follow.js:33 FATAL-DEFAULT: `STATE_REPO` fell back to C:\Consonance\state,
// which is somebody else's disk on any box that did not write it. The shape required is the peer hooks'
// (transcript-watch.js dataDir): env, then ~/.consonance.json, then a LOUD refusal.
//
// WHAT IS CONTROLLED. Each child gets an empty home (no ~/.consonance.json), no CONSONANCE_* variables,
// and a PATH with no git on it. The last one is a safety as much as a control: before this repair the
// follower resolved the real C:\Consonance\state, and `--release` pushes a ref deletion to a real remote.
// With no git reachable, a regression here can only fail, never publish.
//
// NOT COVERED: a real lease read against a real remote. That is live-host's end-to-end run, not this.

const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync, execFileSync } = require('node:child_process');

const TOOL = path.join(__dirname, 'live-follow.js');

function bareEnv(home, extra = {}) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^CONSONANCE_/i.test(k)) env[k] = v;
  env.USERPROFILE = home; env.HOME = home; env.PATH = home; env.Path = home;
  return { ...env, ...extra };
}
function withHome(fn) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'follow-home-'));
  try { return fn(home); } finally { fs.rmSync(home, { recursive: true, force: true }); }
}
const run = (args, env) => spawnSync(process.execPath, [TOOL, ...args], { encoding: 'utf8', env });

test('nothing declared -> --status REFUSES and names the setting, rather than reading a guessed C:\\ path', () => {
  withHome((home) => {
    const r = run(['--status'], bareEnv(home));
    assert.strictEqual(r.status, 2, 'an undeclared state repo is a refusal, exit 2');
    assert.match(r.stderr, /no state repo declared/, 'the refusal must say nothing was declared');
    assert.match(r.stderr, /state_dir/, 'the refusal must name the setting that fixes it');
    assert.doesNotMatch(r.stderr, /unreachable/,
      'an undeclared repo is not an unreachable remote; reporting it as one sends the reader to the network');
  });
});

test('nothing declared -> --release refuses before any git runs (it would push a ref deletion)', () => {
  withHome((home) => {
    const r = run(['--release', 'E'], bareEnv(home));
    assert.strictEqual(r.status, 2);
    assert.match(r.stderr, /no state repo declared/);
  });
});

test('as a module, git never runs in the caller\'s directory when no state repo is declared', () => {
  // With a null cwd execFileSync would run git in WHATEVER directory the caller is in — a
  // `push origin --delete` against the wrong repository. The guard must precede the spawn: with no git
  // on PATH, only the guard's own message can appear here, never ENOENT.
  withHome((home) => {
    const out = execFileSync(process.execPath, ['-e',
      `const f=require(${JSON.stringify(TOOL)});console.log(JSON.stringify(f.release('E')));`],
      { encoding: 'utf8', env: bareEnv(home), cwd: home });
    const r = JSON.parse(out.trim().split('\n').pop());
    assert.strictEqual(r.ok, false);
    assert.match(r.reason, /no state repo declared/);
  });
});

test('~/.consonance.json state_dir is honoured when env is absent, and env wins over it', () => {
  withHome((home) => {
    const st = path.join(home, 'from-config');
    fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ state_dir: st }));
    const probe = `const f=require(${JSON.stringify(TOOL)});console.log(f.STATE_REPO);`;
    const fromCfg = execFileSync(process.execPath, ['-e', probe], { encoding: 'utf8', env: bareEnv(home) }).trim();
    assert.strictEqual(fromCfg, st);
    const fromEnv = execFileSync(process.execPath, ['-e', probe],
      { encoding: 'utf8', env: bareEnv(home, { CONSONANCE_STATE_REPO: path.join(home, 'from-env') }) }).trim();
    assert.strictEqual(fromEnv, path.join(home, 'from-env'));
  });
});
