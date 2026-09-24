// jev/test/isolation.test.js — node --test jev/test/isolation.test.js
//
// THE GUARD (D129): no process a jev test spawns may resolve the REAL store. Four refused lines reached the keeper's real
// %LOCALAPPDATA%\jev\jev.log on 2026-09-23 from ask-judge.mutants.js row 42 (reproduced in D129: two lines per run, the
// shape and spacing of both real pairs). The fix routes every spawn through jev/test/isolated-env.js; this file fails when
// that stops being true — at runtime for the helper, and by reading the source of every jev/test file that starts a process.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { isolatedEnv, assertIsolated, KEYS, REAL } = require('./isolated-env.js');

const DIR = __dirname;
// Built from parts so this file's own source never contains a call it would then have to account for.
const CALL = new RegExp('\\b(' + ['spawn', 'spawnSync', 'execFile', 'execFileSync', 'execSync', 'fork'].join('|') + ')\\s*\\(');
const USES_HELPER = /require\(\s*['"]\.\/isolated-env(\.js)?['"]\s*\)/;

/**
 * Files under jev/test that spawn WITHOUT the helper, known on 2026-09-23 and NOT this pane's to edit. Listed, never
 * waived silently: each is printed on every run, and the test fails if one is fixed (or stops spawning) and is not taken
 * off this list, so the list can only shrink toward empty.
 */
const KNOWN_UNISOLATED = {
  'clean-machine.e2e.js': 'A: sets all four store variables to its own temp world (its own construction, not this helper); not a *.test.js file, so the module run never executes it',
};

function spawningFiles() {
  const out = [];
  for (const f of fs.readdirSync(DIR).filter((n) => n.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(DIR, f), 'utf8');
    const code = src.split(/\r?\n/).filter((l) => !/^\s*\/\//.test(l));
    const calls = code.filter((l) => CALL.test(l));
    if (calls.length) out.push({ f, src, calls });
  }
  return out;
}

test('isolatedEnv points all four store variables into its own temp root, away from the real values', () => {
  const env = isolatedEnv();
  for (const k of KEYS) {
    assert.ok(env[k] && env[k] !== REAL[k], `${k} = ${env[k]}`);
    assert.ok(fs.statSync(env[k]).isDirectory(), `${k} exists as a directory`);
  }
  assert.strictEqual(env.HOME, env.USERPROFILE);
});

test('assertIsolated refuses an env that leaves any store variable at its real value, or unset', () => {
  const good = isolatedEnv();
  for (const k of KEYS) {
    if (REAL[k]) assert.throws(() => assertIsolated({ ...good, [k]: REAL[k] }), new RegExp(`${k} is the REAL value`));
    const unset = { ...good };
    delete unset[k];
    assert.throws(() => assertIsolated(unset), new RegExp(`${k} is not set`));
  }
});

test('isolatedEnv refuses an `extra` that would put a real value back', () => {
  const k = KEYS.find((x) => REAL[x]);
  assert.ok(k, 'at least one of the four has a real value on this machine');
  assert.throws(() => isolatedEnv(undefined, { [k]: REAL[k] }), /REAL value/);
});

test('every jev/test file that starts a process goes through isolated-env.js, or is on the known list', () => {
  const offenders = spawningFiles().filter(({ f, src }) => !USES_HELPER.test(src) && !(f in KNOWN_UNISOLATED)).map(({ f }) => f);
  assert.deepStrictEqual(offenders, [], `these spawn with an env the guard cannot vouch for: ${offenders.join(', ')}`);
});

test('a file that uses the helper never hands a spawn process.env directly', () => {
  const bad = [];
  for (const { f, src, calls } of spawningFiles()) {
    if (!USES_HELPER.test(src)) continue;
    for (const l of calls) if (/process\.env/.test(l)) bad.push(`${f}: ${l.trim().slice(0, 100)}`);
  }
  assert.deepStrictEqual(bad, []);
});

test('the known list is still true — each listed file still spawns without the helper (take it off when that changes)', () => {
  const now = new Map(spawningFiles().map((x) => [x.f, x]));
  for (const [f, why] of Object.entries(KNOWN_UNISOLATED)) {
    console.log(`NOT YET ISOLATED: jev/test/${f} — ${why}`);
    assert.ok(now.has(f), `${f} no longer spawns: remove it from KNOWN_UNISOLATED`);
    assert.ok(!USES_HELPER.test(now.get(f).src), `${f} now uses isolated-env.js: remove it from KNOWN_UNISOLATED`);
  }
});

test('this pane\'s three files are NOT on the known list — they must stay isolated', () => {
  for (const f of ['install.test.js', 'ask-judge.mutants.js', 'install-judge.mutants.js']) assert.ok(!(f in KNOWN_UNISOLATED), f);
});
