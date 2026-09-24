'use strict';
// jev/test/isolated-env.js — the ONE place a jev test builds the environment of a process it spawns (D129).
//
// WHY IT EXISTS. On 2026-09-23 four lines landed in the keeper's REAL %LOCALAPPDATA%\jev\jev.log — "refused", session_id
// null — written by tests, not by a session. Reproduced in D129: ask-judge.mutants.js row 42 swaps the hook's stub spawn
// for a real spawnSync, two judge.test.js unit tests then start a real jev-judge child, and that child inherited the
// suite's un-isolated environment, so config.js resolved the real ledger dir. Anything a jev test spawns inherits its
// env, and jev resolves every store from four variables:
//   LOCALAPPDATA    the Windows ledger dir (config.js: %LOCALAPPDATA%\jev)
//   XDG_STATE_HOME  the Linux ledger dir
//   HOME            the POSIX home: ~/.jev/config.json, ~/.claude, ~/Library/... on macOS, ~/.local/state
//   USERPROFILE     the Windows home, which os.homedir() reads there
// So every spawn gets all four pointed into its own temp root, and this file refuses to hand out an env that leaves any
// of them at the real value.
//
// WHY EQUALITY AND NOT "INSIDE". On Windows os.tmpdir() is itself under the real LOCALAPPDATA (…\AppData\Local\Temp) and
// under the real home, so every temp root is "inside" the real dirs. What must never happen is a variable EQUAL to its
// real value — that is what points jev at the real store — so that is the check.
const fs = require('fs');
const os = require('os');
const path = require('path');

const KEYS = ['LOCALAPPDATA', 'XDG_STATE_HOME', 'HOME', 'USERPROFILE'];

/** The real values, captured once, when this module loads, before any test can change process.env. */
const REAL = Object.freeze(Object.fromEntries(KEYS.map((k) => [k, process.env[k] || null])));
const REAL_HOMEDIR = os.homedir();

const same = (a, b) => {
  if (!a || !b) return false;
  const n = (p) => path.resolve(p).replace(/[\\/]+$/, '');
  return process.platform === 'win32' ? n(a).toLowerCase() === n(b).toLowerCase() : n(a) === n(b);
};

/** Throws naming the first of the four keys that is unset, or equal to its real value (or to the real home). */
function assertIsolated(env) {
  if (!env || typeof env !== 'object') throw new Error('isolated-env: no env object given');
  for (const k of KEYS) {
    const v = env[k];
    if (typeof v !== 'string' || !v) throw new Error(`isolated-env: ${k} is not set — a spawned process would fall back to a real default`);
    if (same(v, REAL[k])) throw new Error(`isolated-env: ${k} is the REAL value (${v}) — a spawned process would write into the real store`);
    if ((k === 'HOME' || k === 'USERPROFILE') && same(v, REAL_HOMEDIR)) throw new Error(`isolated-env: ${k} is the real home directory (${v})`);
  }
  return env;
}

/**
 * The env for a spawned process: the current env, with the four store variables pointed at directories under `root`
 * (a fresh temp dir when none is given), then `extra` on top. Asserted before it is returned — `extra` cannot put a real
 * value back.
 */
function isolatedEnv(root, extra = {}) {
  const base = root || fs.mkdtempSync(path.join(os.tmpdir(), 'jev-iso-'));
  const dirs = { home: path.join(base, 'home'), local: path.join(base, 'localappdata'), state: path.join(base, 'xdg-state') };
  for (const d of Object.values(dirs)) fs.mkdirSync(d, { recursive: true });
  const env = { ...process.env, HOME: dirs.home, USERPROFILE: dirs.home, LOCALAPPDATA: dirs.local, XDG_STATE_HOME: dirs.state, ...extra };
  return assertIsolated(env);
}

module.exports = { isolatedEnv, assertIsolated, KEYS, REAL };
