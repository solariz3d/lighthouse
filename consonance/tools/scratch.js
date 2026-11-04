'use strict';
/* scratch.js — where the room's harnesses make temporary folders, and the one way they remove them (D287 part 1).
 *
 * WHY. On 2026-10-10 12:13 C: hit 0 bytes. gen-consumer.js had left ~3,800 staging trees (about 21 GB) in %TEMP% since 09-03 and the test
 * suites ~260,000 small ones (sg-test-*, rs-test-*, jev-*, actors-home-*, jssuite-*, sr-test-* ...). Nothing removed them because removal
 * sat after the assertions, not in a `finally`, and a creator that is killed or throws leaves its folder behind.
 *
 * THE ROOT. CONSONANCE_SCRATCH if set; else `scratch_dir` in ~/.consonance.json (D454: a machine with a roomy drive names it there; it was
 * "G:\consonance-scratch when a G: drive exists", one machine's 2 TB NVMe, D287 amendment); else the OS temp directory. The root is only a place: every folder lives under a prefix so the janitor (part 2) can match it.
 *
 * THE TWO UNIVERSAL MOVES.
 *   mkdtemp(prefix)  a folder under the root, REMOVED AT PROCESS EXIT whether the process ended normally or on an uncaught throw, so a
 *                    creator that forgets its own `finally` still cannot leak. (A kill -9 cannot be caught: the janitor takes that case.)
 *   scoped(prefix)   a folder for a child process: js-suite hands each test file its own, as TEMP/TMP/TMPDIR, and removes it in a
 *                    `finally`. That one move reaches EVERY creator below the child that uses os.tmpdir(), without editing 130 test files.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

// The folder name a machine's scratch_dir conventionally ends in (G:consonance-scratch here). Exported as before; it no longer picks a drive (D454).
const DEFAULT_DRIVE_DIR = 'consonance-scratch';

/** The scratch root. `env` is injectable (its USERPROFILE/HOME locate ~/.consonance.json) so the choice can be tested; `platform` and `exists`
 *  are kept for the callers that pass them and no longer decide anything (D454). */
function scratchRoot(env = process.env, platform = process.platform, exists = fs.existsSync) {   // eslint-disable-line no-unused-vars
  if (env.CONSONANCE_SCRATCH && String(env.CONSONANCE_SCRATCH).trim()) return path.resolve(String(env.CONSONANCE_SCRATCH).trim());
  const home = env.USERPROFILE || env.HOME || os.homedir();
  try {
    const d = (JSON.parse(fs.readFileSync(path.join(home, '.consonance.json'), 'utf8').replace(/^\uFEFF/, '')) || {}).scratch_dir;
    if (typeof d === 'string' && d.trim()) return path.resolve(d.trim());
  } catch { /* no config, or no scratch_dir in it: the OS temp dir */ }
  return os.tmpdir();
}

const live = new Set();
let hooked = false;
function removeAll() {
  for (const d of live) { try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* the janitor takes what is left */ } }
  live.clear();
}
function hook() {
  if (hooked) return;
  hooked = true;
  process.on('exit', removeAll);
}

/** A fresh folder `<root>/<prefix>XXXXXX`, removed when this process exits. Falls back to the OS temp dir if the root cannot be made. */
function mkdtemp(prefix, root) {
  const base = root || scratchRoot();
  let dir;
  try {
    fs.mkdirSync(base, { recursive: true });
    dir = fs.mkdtempSync(path.join(base, prefix));
  } catch (e) {
    if (root) throw e;
    dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  }
  hook();
  live.add(dir);
  return dir;
}

/** Stop tracking a folder: it is kept past exit (for a person to look at). */
function keep(dir) { live.delete(dir); }

/** Remove a folder made by mkdtemp now (idempotent). */
function rm(dir) {
  if (!dir) return;
  live.delete(dir);
  fs.rmSync(dir, { recursive: true, force: true });
}

/** Run `fn(dir)` with a fresh folder and remove it in a `finally`, on return and on throw. */
function withDir(prefix, fn, root) {
  const dir = mkdtemp(prefix, root);
  try { return fn(dir); } finally { rm(dir); }
}

/** The env that makes a child process's os.tmpdir() be `dir`. */
function tempEnv(dir) { return { TEMP: dir, TMP: dir, TMPDIR: dir }; }

module.exports = { scratchRoot, mkdtemp, keep, rm, withDir, tempEnv, DEFAULT_DRIVE_DIR };
